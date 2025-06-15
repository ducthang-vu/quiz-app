'use client';

import { useState } from 'react';
import { Question } from '@/core/open-trivia';
import InitialForm, { FormValue } from '@/app/_game/initial-form';
import QuestionCmp from '@/app/_game/question';
import End from '@/app/_game/end';

type GamePhase = 'initial' | 'playing' | 'end';

export default function Game() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [responses, setResponses] = useState<string[]>([]);

    const fetchQuestions = (arg: FormValue): void => {
        setLoadingQuestions(true);
        fetch(`/api/questions?amount=${arg.numberOfQuestions}`)
            .then(r => r.json() as Promise<Question[]>)
            .then((q: Question[]) => { setQuestions(q); setLoadingQuestions(false) })
            .catch(() => { location.reload(); });
    }

    const manageResponse = (res:string): void => {
        setCurrentQuestion((prev) => prev + 1);
        setResponses(prev => prev.concat(res));
    };

    const questionWithResponses = questions.map((r, i) => ({
        ...r,
        response: responses[i],
        isCorrect: responses[i] === r.correct_answer,
    }))

    const gamePhase: GamePhase = (() => {
        if (questions.length === 0) {
            return 'initial';
        } else if (currentQuestion < questions.length) {
            return 'playing';
        } else {
            return 'end';
        }
    })()

    const step = {
        current: currentQuestion + 1,
        total: questions.length,
    }

    switch (gamePhase) {
        case 'playing':
            return <QuestionCmp question={questions[currentQuestion]} onAnswer={manageResponse} step={step}></QuestionCmp>;
        case 'end':
            return <End data={questionWithResponses}></End>;
        default:
            return <InitialForm startGame={fetchQuestions} disabled={loadingQuestions}></InitialForm>;
    }
}
