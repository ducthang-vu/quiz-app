import styles from "./page.module.css";
import Game from '@/app/_game/game';

export default async function Home() {
    return (
        <div className={styles.page}>
            <Game></Game>
        </div>
    );
}
