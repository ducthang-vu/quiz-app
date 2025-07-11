import { FormEventHandler } from "react";
import styles from "./initial-form.module.css";
import RadioGroup, { Option } from "./ui/radio-group";
import Button from "./ui/button";
import { GameDifficulty, GameType } from '@/lib/open-trivia/types';

export interface FormValue {
    amount: number;
    type: GameType;
    difficulty: GameDifficulty;
}

interface Props {
    disabled: boolean;
    startGame: (arg: FormValue) => void;
}

export default function InitialForm({ startGame, disabled }: Props) {
    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!(e.target instanceof HTMLFormElement)) {
            return;
        }
        const formData = new FormData(e.target);
        const rawValue = Object.fromEntries(formData);
        startGame({...rawValue, amount: +rawValue.amount} as FormValue);
    }

    const amounts = ['5', '10', '15', '20'];
    const types: Option<GameType>[] = [
        {
            label: 'Any type',
            value: 'both'
        },
        {
            label: 'Multiple choice',
            value: 'multiple'
        },
        {
            label: 'True/False',
            value: 'boolean'
        }
    ];
    const difficulties: Option<GameDifficulty>[] = [
        { label: 'All', value: 'any_difficulty'},
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' }
    ];

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <RadioGroup legend="Choose how many questions:" name="amount" options={amounts}/>
            <RadioGroup legend="Choose type of questions:" name="type" options={types}/>
            <RadioGroup legend="Difficulty:" name="difficulty" options={difficulties}/>
            <Button disabled={disabled} type="submit">Start!</Button>
        </form>
    )
}
