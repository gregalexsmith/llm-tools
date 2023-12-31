export function waitFor<T>(
  promise: Promise<T>,
  timeoutMs: number,
  shouldThrow = false,
): Promise<T> {
  const timeout = new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      if (shouldThrow) {
        reject(new Error(`Timed out after ${timeoutMs} ms`));
      } else {
        resolve(undefined as T);
      }
    }, timeoutMs);

    promise.then(
      () => clearTimeout(timer),
      () => clearTimeout(timer),
    );
  });

  return Promise.race([promise, timeout]);
}
