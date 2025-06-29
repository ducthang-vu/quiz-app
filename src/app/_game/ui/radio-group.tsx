import styles from '@/app/_game/ui/radio-group.module.css';
import { useState } from 'react';

export interface Option<T extends string = string> {
    value: T;
    label: string;
}

interface Props<T extends string> {
    legend: string;
    name: string;
    options: (T | Option<T>)[];
}

function optionAdapter<T extends string>(option: T | Option<T>): Option<T> {
    if (typeof option === 'string') {
        return { value: option, label: option };
    }
    return option;
}

export default function RadioGroup<T extends string>({ legend, name, options}: Props<T>) {
    const [value, setValue] = useState<T | null>(null);
    const optionsData: Option<T>[]  = options.map(optionAdapter);

    return (
        <fieldset className={styles.formControl}>
            <legend className={styles.formControl__legend}>{legend}</legend>

            { optionsData.map((o: Option<T>) => (
                <label className={styles.formControlRadio} key={o.value}>
                    <input
                        type="radio"
                        value={o.value}
                        name={name}
                        required
                        checked={value === o.value}
                        onChange={() => setValue(o.value)}
                    />
                    <span>{o.label}</span>
                </label>
            ))}
        </fieldset>
    )
}
