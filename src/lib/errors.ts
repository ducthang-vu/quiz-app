import { ResponseCode } from '@/lib/open-trivia/types';

export class HttpError extends Error {
    public readonly type = 'HttpError';

    constructor(message: string, public readonly status: number) {
        super(message);
    }
}

export class OpenTriviaFailureError extends Error {
    public readonly type = 'OpenTriviaFailureError';

    constructor(message: string, public readonly errorCode: ResponseCode) {
        super(message);
    }
}
