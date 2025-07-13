import { useState } from 'react';
import styles from '@/app/_game/ui/form-controls/select.module.css';
import { Option, optionAdapter } from '@/app/_game/ui/form-controls/option';

interface Props<T extends string> {
    legend: string;
    name: string;
    options: (T | Option<T>)[];
}

export default function Select<T extends string>({ legend, name, options}: Props<T>) {
    const [value, setValue] = useState<T | ''>('');
    const optionsData: Option<T>[]  = options.map(optionAdapter);

    return (
        <fieldset className={styles.formControl}>
            <legend className={styles.formControl__legend}>{legend}</legend>
            <select
                className={styles.formControlSelect}
                name={name}
                value={value ?? undefined}
                onChange={(v) => setValue(v.target.value as T ?? '')}
            >
            { optionsData.map((o: Option<T>) => (
                <option value={o.value} key={o.value}>{o.label}</option>
            ))}
            </select>
        </fieldset>
    )
}
