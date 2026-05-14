/* ============================================================
   ACCOUNT LOCKOUT - Brute-Force Protection
   ============================================================
   Tracks failed login attempts per email address. After 10
   consecutive failures, the account is locked for 15 minutes.
   Successful login resets the counter.

   In-memory for now — same limitation as rate limiting
   (resets on deploy). Moves to Redis in Phase 4.
   ============================================================ */

/* # Failed attempt tracking */
interface LockEntry {
  failures: number;
  lockedUntil: number | null;
}

const attempts = new Map<string, LockEntry>();

/* # Max failures before lockout */
const MAX_FAILURES = 10;
/* # Lockout duration: 15 minutes */
const LOCKOUT_MS = 15 * 60 * 1000;
/* # Clean up stale entries every 10 minutes */
const CLEANUP_INTERVAL = 10 * 60 * 1000;

/* # Periodic cleanup to prevent memory growth */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.lockedUntil && entry.lockedUntil < now) {
      attempts.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

/* # Check if an account is locked — call before attempting login */
export function isLocked(email: string): { locked: boolean; retryAfterMs: number } {
  const entry = attempts.get(email.toLowerCase());
  if (!entry?.lockedUntil) return { locked: false, retryAfterMs: 0 };

  const remaining = entry.lockedUntil - Date.now();
  if (remaining <= 0) {
    /* Lockout expired — clear it */
    attempts.delete(email.toLowerCase());
    return { locked: false, retryAfterMs: 0 };
  }

  return { locked: true, retryAfterMs: remaining };
}

/* # Record a failed login attempt — call after password check fails */
export function recordFailure(email: string): void {
  const key = email.toLowerCase();
  const entry = attempts.get(key) || { failures: 0, lockedUntil: null };
  entry.failures += 1;

  if (entry.failures >= MAX_FAILURES) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
  }

  attempts.set(key, entry);
}

/* # Reset on successful login — call after password check succeeds */
export function resetFailures(email: string): void {
  attempts.delete(email.toLowerCase());
}
