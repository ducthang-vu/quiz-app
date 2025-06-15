'use server';

import styles from './page.module.css';

export default async function Page() {
    return <p className={styles.container}>
        This application uses user-contributed <a className={styles.anchor}
                                                 href="https://opentdb.com">trivia question database</a>.</p>
}
