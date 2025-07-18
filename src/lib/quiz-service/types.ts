import { GetQuestionsParams, Question } from '@/lib/open-trivia/types';

export interface PlayerRecord {
    openTriviaToken: string;
    quiz: Question[]
}

export interface QuizQuestion {
    question: string;
    options: string[];
    isActive: boolean;
}

/**
 * @public
 */
export type CreateQuizPayload = Omit<GetQuestionsParams, 'token'>;
