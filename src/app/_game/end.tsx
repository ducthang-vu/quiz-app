import Button from "./ui/button";
import styles from "./end.module.css";

interface Props {
    data: {
        isCorrect: boolean
    }[];
}

export default function End({ data }: Props) {
    const score = data.reduce((acc, r) => acc + +r.isCorrect, 0);
    return (
        <div>
            <div className={styles.message}>
                <p>Thank you for playing!</p>
                <p>You scored {score}/{data.length}!</p>
            </div>

            <a href="/"><Button>Start a new game!</Button></a>
        </div>
    );
}
