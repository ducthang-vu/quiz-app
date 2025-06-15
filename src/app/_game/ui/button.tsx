import styles from '@/app/_game/ui/button.module.css'

interface Props {
    children: React.ReactNode;
    disabled: boolean;
}

const defaultProps: Props = {
    children: null,
    disabled: false
}

export default function Button({ children, disabled }: Partial<Props>) {
    const props = { ...defaultProps, children, disabled };
    return (
        <button className={styles.primary} disabled={props.disabled}>
            { props.children }
        </button>
    )
}
