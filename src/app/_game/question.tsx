import { FormEventHandler } from 'react';
import RadioGroup from './ui/radio-group';
import Button from './ui/button';
import Stepper from '@/app/_game/ui/stepper';
import styles from './question.module.css';
import { QuizQuestion } from '@/lib/quiz-service/types';

interface Prop {
    question: QuizQuestion;
    onAnswer: (response: string) => void;
    step: { current: number; total: number };
}

export default function Question({ question, onAnswer, step}: Prop) {
    const onSubmit: FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!(e.target instanceof HTMLFormElement)) {
            return;
        }
        const formData = new FormData(e.target);
        const formValue = Object.fromEntries(formData).response as string;
        onAnswer(formValue);
    }

    return (
        <>
            <div className={styles.stepper}>
                <Stepper current={step.current} total={step.total}></Stepper>
            </div>

            <form className={styles.question} onSubmit={onSubmit}>
                <RadioGroup legend={question.question} name="response" options={question.options}/>
                <Button type="submit">Answer</Button>
            </form>
        </>
    )
}
