import { z } from 'zod';
import QuizCreationForm from '@/app/quiz/new/quiz-creation-form';
import { quizService } from '@/lib/quiz-service/service';
import { COOKIE_NAME } from '@/app/constants';
import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { GAME_CATEGORIES } from '@/lib/open-trivia/types';
import { CreateQuizPayload } from '@/lib/quiz-service/types';

const formValueSchema = z.object({
    amount: z.coerce.number().gt(1).lt(50).default(5),
    type: z.enum( ['multiple', 'boolean', 'both'] as const).default('both'),
    difficulty: z.enum(['any_difficulty', 'easy', 'medium', 'hard'] as const).default('medium'),
    category: z.preprocess(
        (val) => Number(val),
        z.number().refine((n) => (Object.values(GAME_CATEGORIES) as number[]).includes(n))
    )
})

async function startGame(formData: FormData): Promise<void> {
    "use server";
    const cookie = await cookies();
    if (!cookie.get(COOKIE_NAME)?.value) {
        cookie.set(COOKIE_NAME, randomUUID(), { maxAge: 60 * 60 * 24 * 10 });
    }
    const id = cookie.get(COOKIE_NAME)?.value;

    if (!id) {
        const error = new Error(`Cookie ${COOKIE_NAME} not found and could be set`);
        console.error(error);
        throw error;
    }

    const rawValue = Object.fromEntries(formData);
    const p = formValueSchema.safeParse(rawValue);
    if (!p.success) {
        console.error('Invalid payload:', p.error);
        throw new Error('Invalid payload');
    }
    try {
        await quizService.createQuiz(id, p.data as CreateQuizPayload);
    } catch (error) {
        console.error('Error creating quiz:', error);
        redirect('/');
    }
    redirect('/quiz/0');
}

export default function NewQuizPage() {
    return <QuizCreationForm action={startGame}></QuizCreationForm>
}
