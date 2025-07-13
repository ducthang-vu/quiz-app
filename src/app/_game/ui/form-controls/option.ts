export interface Option<T extends string = string> {
    value: T;
    label: string;
}

/**
 * @param option
 * @internal
 */
export function optionAdapter<T extends string>(option: T | Option<T>): Option<T> {
    if (typeof option === 'string') {
        return { value: option, label: option };
    }
    return option;
}
