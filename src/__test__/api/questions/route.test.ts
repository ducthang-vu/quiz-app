// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { NextResponse } from 'next/server';
import { GET, TokenResponse } from '@/app/api/questions/route';
import { ResponseCode } from '@/core/open-trivia';

const goodToken = 'good-token';

const tokenResponse: TokenResponse = {
    token: goodToken
}

const mockFetch = vi.spyOn(global, "fetch").mockImplementation((url) => {
    if (url === 'https://opentdb.com/api_token.php?command=request') {
        return Promise.resolve({ json() { return tokenResponse }})
    }
    if (url === 'https://opentdb.com/api.php?amount=2&token=good-token') {
        return Promise.resolve({
            ok: true,
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
                searchParams: { get() { return null} }
            }};
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
                }
            }
        };
        const response: NextResponse = await GET(request);
        expect(response.status).toEqual(200);
        expect(response.json()).toMatchSnapshot();
    });
})
