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
        <div className={styles.container}>
            <div className={styles.messages}>
                <h2 className={styles.message}>🏆 You scored {score}/{total}!</h2>
                <h2 className={styles.message}>🎉 Thank you for playing!</h2>
            </div>

            <Button onClick={startNewGame}>Start a new game!</Button>
        </div>
    );
}
