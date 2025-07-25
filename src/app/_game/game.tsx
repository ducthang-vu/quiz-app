'use client';

import { useState } from 'react';
import InitialForm, { FormValue } from '@/app/_game/initial-form';
import { QuizQuestion } from '@/lib/quiz-service/types';
import { useRouter } from 'next/navigation';

export default function Game() {
    const router = useRouter();
    const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);

    const fetchQuestions = (arg: FormValue): void => {
        setLoadingQuestions(true);
        fetch('/api/quiz', { method: 'POST', body: JSON.stringify(arg) })
            .then(r => r.json() as Promise<QuizQuestion[]>)
            .then(() => {
                setLoadingQuestions(false);
                console.log('before redirect');
                return router.push('/quiz/0')
            })
            .catch(() => { location.reload(); });
    }

    return <InitialForm startGame={fetchQuestions} disabled={loadingQuestions}></InitialForm>;
}
