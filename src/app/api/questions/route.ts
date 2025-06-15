import { NextRequest, NextResponse } from 'next/server';
import { BaseResponse, Question, QuestionsResponse, ResponseCode } from '@/core/open-trivia';
import { withRetry } from '@/lib/retry';

export interface TokenResponse extends BaseResponse {
    response_message: string;
    token: string;
}

const SERVER_ERROR_RESPONSE = NextResponse.json({ status: 500, message: 'Server Error' });

// TODO this only works in localhost, need a real db because vercel use lambda
let token: string | null = null;

async function getToken(): Promise<TokenResponse> {
    return fetch('https://opentdb.com/api_token.php?command=request').then(r => r.json() as unknown as TokenResponse);
}

function replaceQuotes(str: string): string {
    return str
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, '"')
        .replace(/&#039;s/g, '')
        .replace(/&#039;/g, "'")
        .replace(/&eacute;/g, 'é')
        .replace(/&rsquo;/g, "'")
        .replace(/&divide;/, '/');
}

async function _GET(req: NextRequest): Promise<NextResponse> {
    if (!token) {
        console.log('Fetching new token.');
        token = await getToken().then(r => r.token);
    }

    const amount = req.nextUrl.searchParams.get('amount');

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return NextResponse.json({ status: 400, message: 'Invalid amount parameter' }, { status: 400 });
    }

    const response: Response = await fetch(`https://opentdb.com/api.php?amount=${amount}&token=${token}`);
    if (!response.ok) {
        return SERVER_ERROR_RESPONSE;
    }
    const body = await response.json() as QuestionsResponse;
    const tokenError = [ResponseCode.TOKEN_NOT_FOUND,  ResponseCode.TOKEN_EMPTY];
    if (tokenError.includes(body.response_code)) {
        token = null; // Reset token to trigger a new fetch on next request
        console.log('Token expired or not found, running again.');
        throw new Error('Token expired or not found');
    }
    const formattedBody = body.results.map((q: Question) => ({
        ...q,
        question: replaceQuotes(q.question),
        correct_answer: replaceQuotes(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(replaceQuotes),
    }));

    return NextResponse.json(formattedBody, { status: 200 });
}

export async function GET(req: NextRequest) {
    return withRetry(_GET)(req);
}
