import {
    CreateQuizPayload,
    PlayerRecord,
    QuestionRecord,
    QuizQuestion,
    QuizQuestionMetadata,
    Score
} from '@/lib/quiz-service/types';
import { openTriviaService } from '@/lib/open-trivia/service';
import { format } from '@/lib/format';
import { shuffle } from '@/lib/shuffle';
import { AlreadyAnsweredError, OpenTriviaFailureError, QuizNotCompletedError } from '@/lib/errors';
import { quizRepository } from '@/lib/quiz-service/repository';

const quizQuestionAdapter = (q: QuestionRecord): QuizQuestion => ({
    question: q.question,
    options: shuffle([q.correct_answer, ...q.incorrect_answers]),
    answer: q.answer
});

async function createQuiz(id: string, payload: CreateQuizPayload): Promise<QuizQuestion[]> {
    const questions = await openTriviaService.getQuestions({
        ...payload,
    }).catch(async (e) => {
        await quizRepository.deleteRecord(id);
        throw e;
    });

    if (questions.length === 0) {
        throw new OpenTriviaFailureError('[QuizService#createQuiz] No questions returned from OpenTrivia', 1);
    }

    const newRecord: PlayerRecord = {
        quiz: questions.map(q => ({
            ...q,
            question: format(q.question),
            correct_answer: format(q.correct_answer),
            incorrect_answers: q.incorrect_answers.map(format),
            answer: null
        }))
    };

    await quizRepository.setRecord(id, newRecord);
    return newRecord.quiz.map(quizQuestionAdapter);
}

export async function getQuestion(id: string, payload: { questionIndex: number} ): Promise<QuizQuestion & QuizQuestionMetadata> {
    const record: PlayerRecord | null = await quizRepository.getRecord(id);
    if (!record) {
        throw new Error(`Quiz with id ${id} does not exist.`);
    }
    const question = record.quiz[payload.questionIndex];
    if (!question) {
        throw new Error(`Question with index ${payload.questionIndex} does not exist in quiz with id ${id}.`);
    }
    return {
        ...quizQuestionAdapter(question),
        index: payload.questionIndex,
        total: record.quiz.length,
        currentQuestionIndex: record.quiz.findIndex(q => q.answer === null)
    };
}

export async function answerQuestion(id: string, payload: { questionIndex: number, answer: string}): Promise<void> {
    const record: PlayerRecord | null = await quizRepository.getRecord(id);
    if (!record) {
        throw new Error(`Quiz with id ${id} does not exist.`);
    }

    const question = record.quiz[payload.questionIndex];
    if (!question) {
        const error = new Error(`Question with index ${payload.questionIndex} does not exist in quiz with id ${id}.`);
        console.error(error);
        throw error;
    }

    if (question.answer) {
        const notAnswered = record.quiz.findIndex(q => q.answer === null);
        const error = new AlreadyAnsweredError(
            `Question with index ${payload.questionIndex} has already been answered in quiz with id ${id}.`,
            notAnswered - 1
        );
        console.error(error);
        throw error;
    }

    const newRecord: PlayerRecord = {...record};
    newRecord.quiz[payload.questionIndex] = {
        ...question,
        answer: payload.answer
    };
    await quizRepository.setRecord(id, newRecord);
}


async function getScore(id: string): Promise<Score> {
    const record: PlayerRecord | null = await quizRepository.getRecord(id);

    if (!record) {
        throw new Error(`Quiz with id ${id} does not exist.`);
    }

    const notAnswered = record.quiz.findIndex(q => q.answer === null);
    if (notAnswered !== -1) {
        const error = new QuizNotCompletedError(`The quiz has not been completed.`, notAnswered - 1);
        console.error(error);
        throw error;
    }

    return {
        score: record.quiz.reduce((acc, q) => Number(q.answer === q.correct_answer) + acc, 0),
        total: record.quiz.length
    }
}

export const quizService = {
    answerQuestion,
    createQuiz,
    getQuestion,
    getScore
}
