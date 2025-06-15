import styles from '@/app/_game/ui/button.module.css'

interface Props {
    children: React.ReactNode;
    disabled: boolean;
    onClick: React.MouseEventHandler
}

const defaultProps: Props = {
    children: null,
    disabled: false,
    onClick: () => {}
}

export default function Button({ children, disabled, onClick }: Partial<Props>) {
    const props = { ...defaultProps, children, disabled };
    return (
        <button className={styles.primary} disabled={props.disabled} onClick={onClick}>
            { props.children }
        </button>
    )
}
