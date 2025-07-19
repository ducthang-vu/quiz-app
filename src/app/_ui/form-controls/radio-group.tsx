import styles from '@/app/_ui/form-controls/radio-group.module.css';
import { useState } from 'react';
import { Option, optionAdapter } from '@/app/_ui/form-controls/option';
import { FormField } from '@/app/_ui/form-controls/form-field';


interface Props<T extends string> {
    legend: string;
    name: string;
    options: (T | Option<T>)[];
}

export default function RadioGroup<T extends string>({ legend, name, options}: Props<T>) {
    const [value, setValue] = useState<T | null>(null);
    const optionsData: Option<T>[]  = options.map(optionAdapter);

    return (
        <FormField legend={legend}>
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
        </FormField>
    )
}
