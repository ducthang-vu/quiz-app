"use client";

import styles from "./quiz-creation-form.module.css";
import RadioGroup from "@/app/_ui/form-controls/radio-group";
import Button from "@/app/_ui/button";
import { GAME_CATEGORIES, GameDifficulty, GameType } from '@/lib/open-trivia/types';
import { Option } from '@/app/_ui/form-controls/option'
import Select from '@/app/_ui/form-controls/select';
import { CATEGORIES, Group } from '@/app/quiz/new/categories';
import { useActionState } from 'react';

interface Props {
    action: (formData: FormData) => Promise<void>;
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

function OptGroupCmp({ group }: { group: Group }) {
    return (
        <optgroup label={group.label}>
            {group.items.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </optgroup>
    );
}

export default function QuizCreationForm({ action }: Props) {
    const actionFn = (_: void | null, formData: FormData) => action(formData);
    const [, formAction, isPending] = useActionState(actionFn, null);
    return (
        <form action={formAction} className={styles.form}>
            <RadioGroup legend="Choose how many questions:" name="amount" options={amounts}/>
            <RadioGroup legend="Choose type of questions:" name="type" options={types}/>
            <RadioGroup legend="Difficulty:" name="difficulty" options={difficulties}/>
            <Select legend="Category" name="category">
                <option value={GAME_CATEGORIES.Any_Category}>All</option>
                {CATEGORIES.map((i) =>
                    'items' in i
                        ? <OptGroupCmp key={i.label} group={i}></OptGroupCmp>
                        : <option key={i.value} value={i.value}>{i.label}</option>
                )}
            </Select>
            <Button disabled={isPending} type="submit">Start!</Button>
        </form>
    )
}
