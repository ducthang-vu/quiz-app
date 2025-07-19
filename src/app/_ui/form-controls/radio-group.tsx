"use client";

import styles from '@/app/_ui/form-controls/radio-group.module.css';
import { useEffect, useState } from 'react';
import { Option, optionAdapter } from '@/app/_ui/form-controls/option';
import { FormField } from '@/app/_ui/form-controls/form-field';


interface Props<T extends string> {
    disabled?: boolean;
    legend: string;
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    options: (T | Option<T>)[];
    value?: T;
}

export default function RadioGroup<T extends string>({ disabled, legend, name, onChange, options, value }: Props<T>) {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<T | null>(isControlled ? value ?? null : null);
    const selectedValue = isControlled ? value ?? null : internalValue;
    const optionsData: Option<T>[]  = options.map(optionAdapter);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isControlled) {
            onChange?.(e);
            return;
        }
        setInternalValue(e.target.value as T);
    }

    useEffect(() => {
        if (isControlled) {
            setInternalValue(value ?? null);
        }
    }, [value, isControlled]);

    return (
        <FormField legend={legend}>
            { optionsData.map((o: Option<T>) => (
                <label className={styles.formControlRadio} key={o.value}>
                    <input
                        type="radio"
                        disabled={!!disabled}
                        value={o.value}
                        name={name}
                        required
                        checked={selectedValue === o.value}
                        onChange={onChangeHandler}
                    />
                    <span>{o.label}</span>
                </label>
            ))}
        </FormField>
    )
}
