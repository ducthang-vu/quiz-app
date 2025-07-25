import { GetQuestionsParams, Question } from '@/lib/open-trivia/types';

interface HasAnswer {
    answer: string | null;
}

export interface QuestionRecord extends Question, HasAnswer {}

export interface PlayerRecord {
    openTriviaToken: string;
    quiz: QuestionRecord[]
}

export interface QuizQuestion extends HasAnswer {
    question: string;
    options: string[];
}

export interface Score {
    score: number;
    total: number;
}

export interface QuizQuestionMetadata {
    index: number;
    total: number;
    currentQuestionIndex: number;
}

/**
 * @public
 */
export type CreateQuizPayload = Omit<GetQuestionsParams, 'token'>;
