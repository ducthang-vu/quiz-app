import { NextRequest, NextResponse } from 'next/server';
import { quizService } from '@/lib/quiz-service/service';
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/app/api/constants';
import { GAME_CATEGORIES, GameCategory, GameDifficulty, GameType } from '@/lib/open-trivia/types';
import { CreateQuizPayload, QuizQuestion } from '@/lib/quiz-service/types';

interface Body {
    amount: number; type: GameType; difficulty: GameDifficulty; category: GameCategory
}

function isGameType(value: unknown): value is GameType {
    if (typeof value !== 'string') {
        return false;
    }
    return ['multiple', 'boolean', 'both'].includes(value);
}

function isGameDifficulty(value: unknown): value is GameDifficulty {
    if (typeof value !== 'string') {
        return false;
    }
    return ['easy', 'medium', 'hard', 'any_difficulty'].includes(value);
}

function isGameCategory(value: unknown): value is GameCategory {
    if (typeof value !== 'number') {
        return false;
    }
    const categories = Object.values(GAME_CATEGORIES) as number[];
    return categories.includes(Number(value));
}

function validateBody(body: unknown): body is Body {
    const errors: string[] = [];
    if (body == null || !(typeof body === 'object')) {
        throw Error('Body must be an object');
    }

    if (!('amount' in body) || typeof body.amount !== 'number' || body.amount <= 0 || body.amount > 50) {
        errors.push('The field "amount" is mandatory and must be a number between 1 and 50');
    }

    if (!('type' in body) || !isGameType(body.type)) {
        errors.push(`The field "type" is mandatory and must be one of: multiple, boolean, both`);
    }

    if (!('difficulty' in body) || !isGameDifficulty(body.difficulty)) {
        errors.push(`The field "difficulty" is mandatory and must be one of: easy, medium, hard, any_difficulty`);
    }

    if (!('category' in body) || !isGameCategory(body.category)) {
        errors.push(`The field "category" is mandatory and must be one of: ${Object.values(GAME_CATEGORIES).join(', ')}`);
    }
    if (errors.length > 0) {
        throw Error(errors.join(', '));
    }
    return true;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const rawBody: unknown = await req.json();
    try {
        validateBody(rawBody);
    } catch (e) {
        const error = e as Error;
        console.error(`[POST /api/quiz] Validation error: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const body: Body = rawBody as Body; // this is safe, using ts type inference would be verbose
    const cookie = await cookies();
    const id = cookie.get(COOKIE_NAME)?.value ?? randomUUID();
    cookie.set(COOKIE_NAME, id, { maxAge: 60 * 60 * 24 * 10 }); // Set cookie for 10 days

    const payload: CreateQuizPayload = {
        amount: body.amount,
        difficulty: body.difficulty,
        type: body.type,
        category: body.category
    }
    const questions: QuizQuestion[] = await quizService.createQuiz(id, payload);

    return NextResponse.json(questions, { status: 201 });
}
