"use client"

import styles from '@/app/_ui/button.module.css'

interface Props {
    children: React.ReactNode;
    disabled: boolean;
    onClick: React.MouseEventHandler,
    type: 'button' | 'submit' | 'reset';
}

const defaultProps: Props = {
    children: null,
    disabled: false,
    onClick: () => {},
    type: 'button'
}

export default function Button(props: Partial<Props>) {
    const p = { ...defaultProps, ...props };
    return (
        <button
            className={styles.primary}
            disabled={p.disabled}
            type={p.type}
            onClick={p.onClick}
            aria-disabled={p.disabled}
        >
            { p.children }
        </button>
    )
}
