import styles from '@/app/_ui/form-controls/form-field.module.css';

interface Props {
    children: React.ReactNode;
    legend: string;
}

export function FormField({ children, legend }: Props) {
    return (
        <fieldset className={styles.formControl}>
            <legend className={styles.formControl__legend}>{legend}</legend>
            { children }
        </fieldset>
    )
}
