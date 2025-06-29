import Button from "./ui/button";
import styles from "./end.module.css";

interface Props {
    score: number
    total: number
}

export default function End({ score, total }: Props) {
       const startNewGame = () => {
        // Reset the game state or redirect to the initial form
        // TODO temporary need to reload the application state instead
        location.reload(); // This will reload the page and reset the game
    };
    return (
        <div>
            <div className={styles.message}>
                <p>Thank you for playing!</p>
                <p>You scored {score}/{total}!</p>
            </div>

            <Button onClick={startNewGame}>Start a new game!</Button>
        </div>
    );
}
