import { NextRequest, NextResponse } from 'next/server';
import { quizService } from '@/lib/quiz-service/service';
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/app/api/constants';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const cookie = await cookies();

    const body = await req.json();
    const amount = body.amount;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return NextResponse.json({ status: 400, message: 'Invalid amount parameter' }, { status: 400 });
    }

    const id = cookie.get(COOKIE_NAME)?.value ?? randomUUID();
    cookie.set(COOKIE_NAME, id, { maxAge: 60 * 60 * 24 * 10 }); // Set cookie for 10 days

    const questions =  await quizService.createQuiz(id, { amount: Number(amount) } );

    return NextResponse.json(questions, { status: 201 });
}
