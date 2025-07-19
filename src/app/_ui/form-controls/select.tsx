import { useState } from 'react';
import styles from '@/app/_ui/form-controls/select.module.css';
import { FormField } from '@/app/_ui/form-controls/form-field';

interface Props {
    children: React.ReactNode;
    legend: string;
    name: string;
}

export default function Select<T extends string>({ children, legend, name }: Props) {
    const [value, setValue] = useState<T | ''>('');

    return (
        <FormField legend={legend}>
            <select
                className={styles.formControlSelect}
                name={name}
                value={value ?? undefined}
                onChange={(v) => setValue(v.target.value as T ?? '')}
            >
                { children }
            </select>
        </FormField>
    )
}
