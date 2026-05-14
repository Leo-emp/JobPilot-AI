/* ============================================================
   RATE LIMITER - In-Memory Sliding Window
   ============================================================
   Protects API endpoints from burst abuse (rapid-fire requests).
   Uses a sliding window counter stored in a Map.

   On Vercel Fluid Compute, function instances are reused across
   requests, so the Map persists for the life of the instance.
   Not perfectly consistent across multiple instances, but provides
   meaningful protection against abuse without extra infrastructure.

   Usage:
     const limiter = createRateLimiter({ maxRequests: 6, windowMs: 60_000 });
     const { allowed, remaining } = limiter.check("user-123");
   ============================================================ */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimiterConfig {
  /* Maximum number of requests allowed in the window */
  maxRequests: number;
  /* Window size in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  /* Whether the request is allowed */
  allowed: boolean;
  /* How many requests remain in the current window */
  remaining: number;
  /* When the oldest request in the window expires (ms until reset) */
  resetIn: number;
}

/* Store entries in module-level Maps — persist across requests on same instance */
const stores = new Map<string, Map<string, RateLimitEntry>>();

export function createRateLimiter(config: RateLimiterConfig) {
  /* Each limiter gets its own store keyed by a unique ID */
  const storeKey = `${config.maxRequests}-${config.windowMs}`;
  if (!stores.has(storeKey)) {
    stores.set(storeKey, new Map());
  }
  const store = stores.get(storeKey)!;

  /* Clean up expired entries every 5 minutes to prevent memory leaks */
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      entry.timestamps = entry.timestamps.filter(t => now - t < config.windowMs);
      if (entry.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();

  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(identifier) || { timestamps: [] };

      /* Remove timestamps outside the current window */
      entry.timestamps = entry.timestamps.filter(t => now - t < config.windowMs);

      if (entry.timestamps.length >= config.maxRequests) {
        /* Rate limited — calculate when the oldest request expires */
        const oldestInWindow = entry.timestamps[0];
        const resetIn = config.windowMs - (now - oldestInWindow);
        store.set(identifier, entry);
        return { allowed: false, remaining: 0, resetIn };
      }

      /* Allow the request and record it */
      entry.timestamps.push(now);
      store.set(identifier, entry);

      return {
        allowed: true,
        remaining: config.maxRequests - entry.timestamps.length,
        resetIn: config.windowMs,
      };
    },
  };
}

/* ---- Pre-configured limiters for the AI endpoint ---- */

/* Per-user: 6 requests per minute — allows normal use, blocks scripting */
export const userPerMinute = createRateLimiter({ maxRequests: 6, windowMs: 60_000 });

/* Per-user: 40 requests per hour — allows a productive session */
export const userPerHour = createRateLimiter({ maxRequests: 40, windowMs: 60 * 60_000 });

/* Per-IP: 20 requests per minute — allows multiple users behind same IP (office) */
export const ipPerMinute = createRateLimiter({ maxRequests: 20, windowMs: 60_000 });

/* ---- Auth route limiters — blocks brute-force attacks on login/signup/reset ---- */

/* Per-IP: 5 auth attempts per minute — enough for typos, blocks credential stuffing */
export const authPerMinute = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });

/* Per-IP: 15 auth attempts per hour — prevents slow-and-steady brute force */
export const authPerHour = createRateLimiter({ maxRequests: 15, windowMs: 60 * 60_000 });
