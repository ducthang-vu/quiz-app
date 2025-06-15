export function withRetry<T>(promiseFactory: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T> {
    let retried = false;

    return (...args: any[]): Promise<T> => {
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
