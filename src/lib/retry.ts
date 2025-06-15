export function withRetry<T, S extends unknown[]>(promiseFactory: (...args: S) => Promise<T>): (...args: S) => Promise<T> {
    let retried = false;

    return (...args: S): Promise<T> => {
        return promiseFactory(...args)
            .catch((error) => {
                if (retried) {
                    throw error; // If already retried, throw the error
                }
                retried = true; // Set retried flag to true
                console.warn('Retrying due to error:', error.message);
                return promiseFactory(...args); // Retry the promise
            });
    }
}
