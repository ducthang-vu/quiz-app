import styles from '@/app/_game/ui/radio-group.module.css';

interface Props {
    legend: string;
    name: string;
    options: string[];
}

export default function RadioGroup({ legend, name, options}: Props) {
    return (
        <fieldset className={styles.formControl}>
            <legend className={styles.formControl__legend}>{legend}</legend>

            { options.map((o: string, i: number) => (
                <label className={styles.formControlRadio} key={i}>
                    <input type="radio" id={'n' + i} value={o} name={name} required/>
                    <span>{o}</span>
                </label>
            ))}
        </fieldset>
    )
}
