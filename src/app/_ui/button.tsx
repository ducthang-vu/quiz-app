"use client";

import styles from '@/app/_ui/button.module.css'

interface Props {
    children: React.ReactNode;
    disabled: boolean;
    onClick: React.MouseEventHandler,
    type: 'button' | 'submit' | 'reset';
    appearance?: 'primary' | 'tertiary';
}

const defaultProps: Props = {
    children: null,
    disabled: false,
    onClick: () => {},
    type: 'button',
    appearance: 'primary'
}

export default function Button(props: Partial<Props>) {
    const p = { ...defaultProps, ...props };
    const appearance = p.appearance === 'tertiary' ? styles.tertiary : styles.primary;
    return (
        <button
            className={appearance}
            disabled={p.disabled}
            type={p.type}
            onClick={p.onClick}
            aria-disabled={p.disabled}
        >
            { p.children }
        </button>
    )
}
