import { CreateQuizPayload, PlayerRecord, QuizQuestion } from '@/lib/quiz-service/types';
import { openTriviaService } from '@/lib/open-trivia/service';
import { format } from '@/lib/forrmat';
import { shuffle } from '@/lib/shuffle';
import { OpenTriviaFailureError } from '@/lib/errors';
import { quizRepository } from '@/lib/quiz-service/repository';
import { Question } from '@/lib/open-trivia/types';

const quizQuestionAdapter = (q: Question): QuizQuestion => ({
    question: format(q.question),
    options: shuffle([format(q.correct_answer), ...q.incorrect_answers.map(format)]),
    isActive: false
});

async function createQuiz(id: string, payload: CreateQuizPayload): Promise<QuizQuestion[]> {
    const record: PlayerRecord | null = await quizRepository.getRecord(id);

    let openTriviaToken: string | undefined = undefined;

    if (!record?.openTriviaToken) {
        openTriviaToken = await openTriviaService.getToken();
    }

    if (!openTriviaToken) {
        openTriviaToken = record!.openTriviaToken;
    }

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
        }))
    }

    await quizRepository.createRecord(id, newRecord);
    return newRecord.quiz.map(quizQuestionAdapter);
}

async function getQuestion(id: string, payload: { index: number }): Promise<QuizQuestion> {
    const record: PlayerRecord | null = await quizRepository.getRecord(id);
    if (!record) {
        throw new Error(`Quiz with id ${id} does not exist.`);
    }

    const q: Question = record.quiz[payload.index];
    return quizQuestionAdapter(q);
}

async function terminateQuiz(id: string, payload : { answers: string[]} ): Promise<{ score: number, total: number }> {
    const record: PlayerRecord | null = await quizRepository.getRecord(id);;
    if (!record) {
        throw new Error(`Quiz with id ${id} does not exist.`);
    }

    const correct = record.quiz.map(q => q.correct_answer);
    const score: number =  payload.answers.reduce((a, answer, i) => {
        return a + (correct[i] === answer ? 1 : 0);
    }, 0);
    return { score, total: payload.answers.length };
}

export const quizService = {
    createQuiz,
    getQuestion,
    terminateQuiz
}
