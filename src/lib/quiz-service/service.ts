import { CreateQuizPayload, PlayerRecord, QuizQuestion, Score } from '@/lib/quiz-service/types';
import { openTriviaService } from '@/lib/open-trivia/service';
import { format } from '@/lib/format';
import { shuffle } from '@/lib/shuffle';
import { OpenTriviaFailureError, QuizNotCompletedError } from '@/lib/errors';
import { quizRepository } from '@/lib/quiz-service/repository';
import { Question } from '@/lib/open-trivia/types';

const quizQuestionAdapter = (q: Question): QuizQuestion => ({
    question: q.question,
    options: shuffle([q.correct_answer, ...q.incorrect_answers]),
    answer: null
});

async function createQuiz(id: string, payload: CreateQuizPayload): Promise<QuizQuestion[]> {
    const record: PlayerRecord | null = await quizRepository.getRecord(id);

    const openTriviaToken = record?.openTriviaToken ?? await openTriviaService.getToken();

    const questions = await openTriviaService.getQuestions({
        ...payload,
        token: openTriviaToken
    }).catch(async (e) => {
        await quizRepository.deleteRecord(id);
        throw e;
    });

    if (questions.length === 0) {
        throw new OpenTriviaFailureError('[QuizService#createQuiz] No questions returned from OpenTrivia', 1);
    }

    const newRecord: PlayerRecord = {
        openTriviaToken,
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

/**
 * @deprecated
 * @param id
 * @param payload
 */
async function terminateQuiz(id: string, payload : { answers: string[]} ): Promise<void> {
    const record: PlayerRecord | null = await quizRepository.getRecord(id);
    if (!record) {
        throw new Error(`Quiz with id ${id} does not exist.`);
    }

    const questions = record.quiz.map((q, i)=> ({
        ...q,
        answer: payload.answers[i]
    }));

    const updatedRecord: PlayerRecord = {
        ...record,
        quiz: questions
    };

    await quizRepository.setRecord(id, updatedRecord);
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
    createQuiz,
    getScore,
    terminateQuiz
}
