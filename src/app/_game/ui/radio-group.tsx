import styles from '@/app/_game/ui/radio-group.module.css';
import { useState } from 'react';

interface Props {
    legend: string;
    name: string;
    options: string[];
}

export default function RadioGroup({ legend, name, options}: Props) {
    const [value, setValue] = useState<typeof options[number] | null>(null);

    return (
        <fieldset className={styles.formControl}>
            <legend className={styles.formControl__legend}>{legend}</legend>

            { options.map((o: string, i: number) => (
                <label className={styles.formControlRadio} key={i}>
                    <input
                        type="radio"
                        id={'n' + i}
                        value={o}
                        name={name}
                        required
                        checked={value === o}
                        onChange={() => setValue(o)}
                    />
                    <span>{o}</span>
                </label>
            ))}
        </fieldset>
    )
}
