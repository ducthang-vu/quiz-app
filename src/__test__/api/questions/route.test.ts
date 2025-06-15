// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { GET, TokenResponse } from '@/app/api/questions/route';
import { ResponseCode } from '@/core/open-trivia';
import { NextURL } from 'next/dist/server/web/next-url';

const goodToken = 'good-token';

const tokenResponse: TokenResponse = {
    token: goodToken,
    response_message: '',
    response_code: ResponseCode.SUCCESS
}

// @ts-expect-error no need just for a test
vi.spyOn(global, "fetch").mockImplementation((url: string) => {
    if (url === 'https://opentdb.com/api_token.php?command=request') {
        // @ts-expect-error no need just for a test
        return Promise.resolve({ json() { return tokenResponse }})
    }
    if (url === 'https://opentdb.com/api.php?amount=2&token=good-token') {
        return Promise.resolve({
            ok: true,
            // @ts-expect-error no need just for a test
            json() {
                return {
                    response_code: ResponseCode.SUCCESS,
                    results: [
                        {
                            question: 'What is 2 + 2?',
                        },
                        {
                            question: 'What is the capital of France?',
                        }
                    ]
                };
            }
        });
    }
});

describe('route', () => {
    it('should return 400 when no param is given', async () => {
        const request = { nextUrl: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                searchParams: { get(name: string) { return null} } as URLSearchParams
            } as NextURL} as NextRequest;
        const response: NextResponse = await GET(request);
        expect(response.status).toEqual(400);
    });

    it('should return 200 with response', async () => {
        const request = {
            nextUrl: {
                searchParams: {
                    get(param: string) {
                        if (param === 'amount') {
                            return '2';
                        }
                        return null;
                    }
                } as URLSearchParams
            } as NextURL
        } as NextRequest;
        const response: NextResponse = await GET(request);
        expect(response.status).toEqual(200);
        expect(response.json()).toMatchSnapshot();
    });
})
