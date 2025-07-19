import styles from "./stepper.module.css";

interface Props {
    current: number;
    total: number;
}

export default function Stepper({ current, total }: Props) {
    const list: string[] = Array.from({ length: total }, (_, i) => {
        const index = i + 1;
        if (index < current) {
            return styles.isBefore;
        }
        if (index === current) {
            return styles.isCurrent;
        }
        return '';
    });

    return (
        <div className={styles.stepper}>
            { list.map((s, i) => (
                <div key={i} className={`${styles.stepper__item} ${s}`}></div>
            ))}
        </div>
    );
}
