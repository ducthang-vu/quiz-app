import { FormEventHandler } from "react";
import styles from "./initial-form.module.css";
import RadioGroup from "./ui/form-controls/radio-group";
import Button from "./ui/button";
import { GAME_CATEGORIES, GameCategory, GameDifficulty, GameType } from '@/lib/open-trivia/types';
import Select from '@/app/_game/ui/form-controls/select';
import { Option } from '@/app/_game/ui/form-controls/option';

export interface FormValue {
    amount: number;
    type: GameType;
    difficulty: GameDifficulty;
    category: GameCategory;
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
        startGame({...rawValue, amount: +rawValue.amount, category: +rawValue.category} as FormValue);
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

    const categories: Option<`${GameCategory}`>[] = Object.entries(GAME_CATEGORIES).map(([key, value]) => ({
        value: value.toString() as `${GameCategory}`,
        label: key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
    })).toSorted((a, b) => a.label.localeCompare(b.label));

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <RadioGroup legend="Choose how many questions:" name="amount" options={amounts}/>
            <RadioGroup legend="Choose type of questions:" name="type" options={types}/>
            <RadioGroup legend="Difficulty:" name="difficulty" options={difficulties}/>
            <Select legend="Category:" name="category" options={categories}/>
            <Button disabled={disabled} type="submit">Start!</Button>
        </form>
    )
}
