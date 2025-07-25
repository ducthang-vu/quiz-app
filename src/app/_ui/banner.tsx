"use client"

import styles from '@/app/_ui/banner.module.css'

export function Banner({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.banner}>
            { children }
        </div>
    )
}
