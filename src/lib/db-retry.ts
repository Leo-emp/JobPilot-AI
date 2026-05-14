/* ============================================================
   DATABASE RETRY UTILITY
   ============================================================
   Wraps database operations with exponential backoff retry logic.
   Turso (cloud SQLite) can have transient connection failures —
   this prevents single hiccups from crashing user requests.

   Usage:
     const user = await dbRetry(() => prisma.user.findUnique({ ... }));

   Only retries on transient errors (connection reset, timeout).
   Validation errors and constraint violations fail immediately.
   ============================================================ */

/* # Errors that indicate a transient failure worth retrying */
const TRANSIENT_PATTERNS = [
  "connection",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "socket hang up",
  "network",
  "SQLITE_BUSY",
  "database is locked",
  "Connection refused",
  "fetch failed",
];

/* # Check if an error is transient (retryable) */
function isTransient(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error);
  return TRANSIENT_PATTERNS.some((p) =>
    message.toLowerCase().includes(p.toLowerCase())
  );
}

/* # Configuration for retry behavior */
interface RetryOptions {
  maxRetries?: number;     /* # Default 3 attempts total */
  baseDelayMs?: number;    /* # Initial delay between retries (doubles each time) */
  maxDelayMs?: number;     /* # Cap on delay to prevent excessively long waits */
}

const DEFAULTS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 100,
  maxDelayMs: 2000,
};

/* # Sleep helper */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* # Main retry wrapper — call this around any Prisma operation */
export async function dbRetry<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const { maxRetries, baseDelayMs, maxDelayMs } = {
    ...DEFAULTS,
    ...options,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      /* # Don't retry non-transient errors (validation, unique constraint, etc.) */
      if (!isTransient(error)) {
        throw error;
      }

      /* # Don't retry if we've exhausted all attempts */
      if (attempt === maxRetries) {
        break;
      }

      /* # Exponential backoff: 100ms → 200ms → 400ms (capped at maxDelayMs) */
      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      await sleep(delay);
    }
  }

  /* # All retries exhausted — throw the last error */
  throw lastError;
}
