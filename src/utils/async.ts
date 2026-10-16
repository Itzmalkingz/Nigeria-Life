/**
 * Default timeout for remote authentication requests (Supabase).
 * Keeps auth loading state from hanging forever when the network stalls.
 */
export const AUTH_REQUEST_TIMEOUT_MS = 15000

/**
 * Rejects if `promise` does not settle within `ms` milliseconds.
 *
 * Note: this does NOT cancel the underlying operation — a late settlement is
 * simply ignored. Use it only to stop the UI waiting forever (e.g. an auth
 * loading spinner), never as a substitute for real request cancellation.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new Error(
          `${label} timed out after ${Math.round(ms / 1000)} seconds. Please check your connection and try again.`
        )
      )
    }, ms)
  })
  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== undefined) {
      clearTimeout(timer)
    }
  })
}
