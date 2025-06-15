import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { withRetry } from '@/lib/retry';

describe('withRetry', () => {
    class PromiseTest {
        private _retried = 0;

        constructor(private failTimes = 0) {
        }

        get retried() {
            return this._retried;
        }

        run(arg1: string, arg2: string) {
            if (this._retried < this.failTimes) {
                this._retried++;
                return Promise.reject(new Error('fail after retrying'));
            }

            if (!(arg1 === '1' && arg2 === '2')) {
                this._retried++;
                return Promise.reject(new Error(`fail for wrong arguments: ${arg1}, ${arg2}`));
            }

            return Promise.resolve('success');
        }
    }

    // silence console.warn with vitest
    beforeEach(() => {
        vi.spyOn(console, 'warn').mockImplementation((arg) => {
            if (arg.includes('Retrying due to error')) {
                // Do nothing, we expect this warning
                return;
            }
            // Otherwise, log as usual
            process.stderr.write(`[warn] ${arg}\n`);
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    })

    it('should return the result of the promise', async () => {
        const test = new PromiseTest();
        const fn = withRetry(test.run.bind(test));
        const result = await fn('1', '2');
        expect(result).toBe('success');
        expect(test.retried).toBe(0);
    })

    it('should retry once and return promise', async () => {
        const test = new PromiseTest(1);
        const fn = withRetry(test.run.bind(test));
        const result = await fn('1', '2');
        expect(result).toBe('success');
        expect(test.retried).toBe(1);
    })

    it('should retry once and return error', async () => {
        const test = new PromiseTest(2);
        const fn = withRetry(test.run.bind(test));
        await expect(fn('1', '2')).rejects.toMatchObject({
            message: 'fail after retrying',
        });
        expect(test.retried).toBe(2);
    })
})
