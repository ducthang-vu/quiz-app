import Button from "@/app/_ui/button";
import styles from "./page.module.css";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { quizService } from '@/lib/quiz-service/service';
import { COOKIE_NAME } from '@/app/api/constants';
import { Score } from '@/lib/quiz-service/types';

const startNewGame = async () => {
    "use server"
    redirect('/')
};

export default async function End() {
    const cookie = await cookies();
    const id = cookie.get(COOKIE_NAME)?.value;

    if (!id) {
        redirect('/404');
    }

    const score: Score = await quizService.getScore(id).catch(() => { redirect('/')});

    return (
        <div className={styles.container}>
            <div className={styles.messages}>
                <h2 className={styles.message}>🏆 You scored {score.score}/{score.total}!</h2>
                <h2 className={styles.message}>🎉 Thank you for playing!</h2>
            </div>

            <Button onClick={startNewGame}>Start a new game!</Button>
        </div>
    );
}
