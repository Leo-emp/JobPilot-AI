/* ============================================================
   REQUEST TIMEOUT UTILITY
   ============================================================
   Wraps any async operation with a timeout. Prevents hanging
   requests from burning Vercel compute for the full 300s
   function limit when a database query or external API stalls.

   Usage:
     const result = await withTimeout(
       () => prisma.user.findMany(),
       15_000  // 15 seconds
     );
   ============================================================ */

/* # Default timeout for database operations (15 seconds) */
const DEFAULT_TIMEOUT_MS = 15_000;

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`);
    this.name = "TimeoutError";
  }
}

export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new TimeoutError(timeoutMs)),
      timeoutMs
    );

    operation()
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}
