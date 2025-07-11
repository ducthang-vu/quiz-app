/**
 * Code 0: Success Returned results successfully.
 * Code 1: No Results Could not return results. The API doesn't have enough quiz for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
 * Code 2: Invalid Parameter Contains an invalid parameter. Arguments passed in aren't valid. (Ex. Amount = Five)
 * Code 3: Token Not Found Session Token does not exist.
 * Code 4: Token Empty Session Token has returned all possible quiz for the specified query. Resetting the Token is necessary.
 * Code 5: Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.
 */
export enum ResponseCode {
    SUCCESS = 0,
    NO_RESULTS = 1,
    INVALID_PARAMETER = 2,
    TOKEN_NOT_FOUND = 3,
    TOKEN_EMPTY = 4,
    RATE_LIMIT = 5
}

export interface BaseResponse {
    response_code: ResponseCode;
}

export type GameDifficulty = 'any_difficulty' | 'easy' | 'medium' | 'hard';

export type GameType = 'multiple' | 'boolean' | 'both';

export interface TokenResponse extends BaseResponse {
    response_message: string;
    token: string;
}

export interface Question {
    category: string;
    type: GameType;
    difficulty: GameDifficulty;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface QuestionsResponse extends BaseResponse {
    results: Question[];
}

export interface GetQuestionsParams {
    amount: number;
    category?: string;
    difficulty: GameDifficulty;
    type: GameType;
    token: string;
}
