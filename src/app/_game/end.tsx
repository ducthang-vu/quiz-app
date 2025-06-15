import Button from "./ui/button";
import styles from "./end.module.css";

interface Props {
    data: {
        isCorrect: boolean
    }[];
}

export default function End({ data }: Props) {
    const score = data.reduce((acc, r) => acc + +r.isCorrect, 0);
    const startNewGame = () => {
        // Reset the game state or redirect to the initial form
        // TODO temporary need to reload the application state instead
        location.reload(); // This will reload the page and reset the game
    };
    return (
        <div>
            <div className={styles.message}>
                <p>Thank you for playing!</p>
                <p>You scored {score}/{data.length}!</p>
            </div>

            <Button onClick={startNewGame}>Start a new game!</Button>
        </div>
    );
}
