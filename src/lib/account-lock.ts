/* ============================================================
   ACCOUNT LOCKOUT - Redis-Backed Brute-Force Protection
   ============================================================
   Tracks failed login attempts per email address. After 10
   consecutive failures, the account is locked for 15 minutes.
   Successful login resets the counter.

   Redis mode: shared across all Vercel function instances.
   In-memory mode: per-instance only (fallback when Redis
   isn't configured).

   BREAKING CHANGE from pre-Phase 4: all functions are now async.
   ============================================================ */

import { getRedis } from "./redis";

/* # Max failures before lockout */
const MAX_FAILURES = 10;
/* # Lockout duration: 15 minutes */
const LOCKOUT_MS = 15 * 60 * 1000;
/* # Redis key prefix */
const PREFIX = "lockout";

/* ============================================================
   IN-MEMORY FALLBACK — Same as pre-Phase 4
   ============================================================ */
interface LockEntry {
  failures: number;
  lockedUntil: number | null;
}

const memoryStore = new Map<string, LockEntry>();

/* # Clean up stale entries every 10 minutes */
const interval = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (entry.lockedUntil && entry.lockedUntil < now) {
      memoryStore.delete(key);
    }
  }
}, 10 * 60 * 1000);
interval.unref?.();

/* ============================================================
   CHECK IF LOCKED — Call before attempting login
   ============================================================ */
export async function isLocked(email: string): Promise<{ locked: boolean; retryAfterMs: number }> {
  const key = email.toLowerCase();
  const redis = getRedis();

  if (redis) {
    try {
      /* # Check Redis for lock expiry timestamp */
      const lockedUntil = await redis.get<number>(`${PREFIX}:lock:${key}`);
      if (lockedUntil) {
        const remaining = lockedUntil - Date.now();
        if (remaining > 0) {
          return { locked: true, retryAfterMs: remaining };
        }
        /* # Lock expired — clean up */
        await redis.del(`${PREFIX}:lock:${key}`);
        await redis.del(`${PREFIX}:fails:${key}`);
      }
      return { locked: false, retryAfterMs: 0 };
    } catch {
      /* # Redis failure — fail open (allow login attempt) */
      return { locked: false, retryAfterMs: 0 };
    }
  }

  /* # In-memory fallback */
  const entry = memoryStore.get(key);
  if (!entry?.lockedUntil) return { locked: false, retryAfterMs: 0 };

  const remaining = entry.lockedUntil - Date.now();
  if (remaining <= 0) {
    memoryStore.delete(key);
    return { locked: false, retryAfterMs: 0 };
  }

  return { locked: true, retryAfterMs: remaining };
}

/* ============================================================
   RECORD FAILURE — Call after password check fails
   ============================================================ */
export async function recordFailure(email: string): Promise<void> {
  const key = email.toLowerCase();
  const redis = getRedis();

  if (redis) {
    try {
      /* # Increment failure counter with 15-min TTL */
      const failures = await redis.incr(`${PREFIX}:fails:${key}`);
      /* # Set TTL on first failure so keys auto-expire */
      if (failures === 1) {
        await redis.expire(`${PREFIX}:fails:${key}`, Math.ceil(LOCKOUT_MS / 1000));
      }
      /* # Lock the account at threshold */
      if (failures >= MAX_FAILURES) {
        const lockedUntil = Date.now() + LOCKOUT_MS;
        await redis.set(`${PREFIX}:lock:${key}`, lockedUntil, { ex: Math.ceil(LOCKOUT_MS / 1000) });
      }
    } catch {
      /* # Redis failure — fall through silently */
    }
    return;
  }

  /* # In-memory fallback */
  const entry = memoryStore.get(key) || { failures: 0, lockedUntil: null };
  entry.failures += 1;

  if (entry.failures >= MAX_FAILURES) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
  }

  memoryStore.set(key, entry);
}

/* ============================================================
   RESET FAILURES — Call after successful login
   ============================================================ */
export async function resetFailures(email: string): Promise<void> {
  const key = email.toLowerCase();
  const redis = getRedis();

  if (redis) {
    try {
      await redis.del(`${PREFIX}:fails:${key}`);
      await redis.del(`${PREFIX}:lock:${key}`);
    } catch {
      /* # Redis failure — fall through silently */
    }
    return;
  }

  /* # In-memory fallback */
  memoryStore.delete(key);
}
