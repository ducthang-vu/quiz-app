import * as redis from 'redis';
import { CreateQuizPayload, PlayerRecord, QuizQuestion } from '@/lib/quiz-service/types';
import { openTriviaService } from '@/lib/open-trivia/service';
import RedisJsonModule from '@redis/json';
import { format } from '@/lib/forrmat';
import { shuffle } from '@/lib/shuffle';
import { OpenTriviaFailureError } from '@/lib/errors';

const redisClient = await redis.createClient({
    url: process.env.REDIS_URL,
    modules: { json: RedisJsonModule },
}).on("error", (err) => console.log("Redis Client Error", err)).connect();

async function createQuiz(id: string, payload: CreateQuizPayload): Promise<QuizQuestion[]> {
    const record = await redisClient.json.get(id) as unknown as PlayerRecord | null;

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
        await redisClient.del(id);
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

    // @ts-expect-error JSON module is used
    await redisClient.json.set(id, '$', newRecord);
    return newRecord.quiz.map(q => ({
        question: q.question,
        options: shuffle([q.correct_answer, ...q.incorrect_answers]),
        isActive: false
    }));
}

async function terminateQuiz(id: string, payload : { answers: string[]} ): Promise<{ score: number, total: number }> {
    const record = await redisClient.json.get(id) as unknown as PlayerRecord | null;
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
    terminateQuiz
}
