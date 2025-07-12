import { NextRequest, NextResponse } from 'next/server';
import { quizService } from '@/lib/quiz-service/service';
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/app/api/constants';
import { GameDifficulty, GameType } from '@/lib/open-trivia/types';
import { CreateQuizPayload, QuizQuestion } from '@/lib/quiz-service/types';

function isGameType(value: string): value is GameType {
    return ['multiple', 'boolean', 'both'].includes(value);
}

function isGameDifficulty(value: string): value is GameDifficulty {
    return ['easy', 'medium', 'hard', 'any_difficulty'].includes(value);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();
    if (isNaN(Number(body.amount)) || Number(body.amount) <= 0) {
        return NextResponse.json({status: 400, message: 'Invalid amount parameter'}, {status: 400});
    }
    if (!isGameType(body.type)) {
        return NextResponse.json({ status: 400, message: 'Invalid type parameter' }, { status: 400 });
    }
    if (!isGameDifficulty(body.difficulty)) {
        return NextResponse.json({ status: 400, message: 'Invalid difficulty parameter' }, { status: 400 });
    }

    const cookie = await cookies();
    const id = cookie.get(COOKIE_NAME)?.value ?? randomUUID();
    cookie.set(COOKIE_NAME, id, { maxAge: 60 * 60 * 24 * 10 }); // Set cookie for 10 days

    const payload: CreateQuizPayload = {
        amount: Number(body.amount),
        difficulty: body.difficulty,
        type: body.type,
    }
    const questions: QuizQuestion[] = await quizService.createQuiz(id, payload);

    return NextResponse.json(questions, { status: 201 });
}
