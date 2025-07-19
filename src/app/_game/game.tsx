'use client';

import { useEffect, useState } from 'react';
import InitialForm, { FormValue } from '@/app/_game/initial-form';
import QuestionCmp from '@/app/_game/question';
import { QuizQuestion } from '@/lib/quiz-service/types';
import { useRouter } from 'next/navigation';

type GamePhase = 'initial' | 'playing' | 'end';

export default function Game() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [responses, setResponses] = useState<string[]>([]);
    const router = useRouter();

    const fetchQuestions = (arg: FormValue): void => {
        setLoadingQuestions(true);
        fetch('/api/quiz', { method: 'POST', body: JSON.stringify(arg) })
            .then(r => r.json() as Promise<QuizQuestion[]>)
            .then((q: QuizQuestion[]) => { setQuestions(q); setLoadingQuestions(false) })
            .catch(() => { location.reload(); });
    }

    const gamePhase: GamePhase = (() => {
        if (questions.length === 0) {
            return 'initial';
        } else if (currentQuestion < questions.length) {
            return 'playing';
        } else {
            // TODO need to keep this for now
            return 'end';
        }
    })()

    const manageResponse = (res: string): void => {
        setCurrentQuestion((prev) => prev + 1);
        setResponses(prev => prev.concat(res));
    };

    const step = {
        current: currentQuestion + 1,
        total: questions.length,
    }

    useEffect(() => {
        if (currentQuestion === questions.length && currentQuestion !== 0) {
            fetch(`/api/quiz/terminate`, {method: 'POST', body: JSON.stringify(responses)}).then(
                () => router.push('/quiz/end'),
            );
        }
    }, [currentQuestion])

    switch (gamePhase) {
        case 'playing':
            return <QuestionCmp question={questions[currentQuestion]} onAnswer={manageResponse} step={step}></QuestionCmp>;
        case 'end':
            return <></>;
        default:
            return <InitialForm startGame={fetchQuestions} disabled={loadingQuestions}></InitialForm>;
    }
}
