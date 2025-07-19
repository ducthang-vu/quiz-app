import { cookies } from 'next/headers';
import { quizService } from '@/lib/quiz-service/service';
import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/app/api/constants';

export async function POST(request: Request): Promise<NextResponse> {
    const id = await cookies().then(c => c.get(COOKIE_NAME)?.value);

    if (!id) {
        return NextResponse.json('Not found', { status: 404 });
    }

    const res: string[] = await request.json();
    await quizService.terminateQuiz(id, { answers: res })
    return NextResponse.json('ok', { status: 201 });
}
