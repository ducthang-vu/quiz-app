import { GetQuestionsParams, Question, QuestionsResponse, ResponseCode, TokenResponse } from '@/lib/open-trivia/types';
import { HttpError, OpenTriviaFailureError } from '@/lib/errors';

async function getToken(): Promise<string> {
    console.log('Fetching new token from OpenTrivia.');
    const response = await fetch('https://opentdb.com/api_token.php?command=request');
    const body = await response.json() as TokenResponse;
    if (!response.ok) {
        const error = new HttpError(`[OpenTriviaService#getToken] ${JSON.stringify(body)}`, response.status);
        console.error(error);
        throw error;
    }
    if (body.response_code !== ResponseCode.SUCCESS) {
        const error = new OpenTriviaFailureError(`[OpenTriviaService#getToken] Failed to get token: ${body.response_message}`, body.response_code);
        console.error(error);
        throw error;
    }

    return body.token;
}

async function getQuestions(payload: GetQuestionsParams): Promise<Question[]> {
    const res: Response =  await fetch(`https://opentdb.com/api.php?amount=${payload.amount}&token=${payload.token}`);
    const body = await res.json() as QuestionsResponse;
    if (!res.ok) {
        const error = new HttpError(JSON.stringify(body), res.status);
        console.error(error);
        throw error;
    }
    if (body.response_code !== ResponseCode.SUCCESS) {
        const error = new OpenTriviaFailureError(`[OpenTriviaService#getQuestions] Failed to get questions from OpenTrivia`, body.response_code);
        console.error(error);
        throw error;
    }
    return body.results;
}

export const openTriviaService = {
    getToken,
    getQuestions
}


