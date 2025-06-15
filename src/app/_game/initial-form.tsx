import { FormEventHandler } from "react";
import styles from "./initial-form.module.css";
import RadioGroup from "./ui/radio-group";
import Button from "./ui/button";

export interface FormValue {
    numberOfQuestions: number;
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
        startGame(Object.fromEntries(formData) as unknown as FormValue);
    }

    const options = ['5', '10', '15', '20'];

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <RadioGroup legend="Choose how many questions:" name="numberOfQuestions" options={options}/>
            <Button disabled={disabled}>Start!</Button>
        </form>
    )
}
