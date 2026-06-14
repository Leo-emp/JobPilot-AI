/* ============================================================
   RATE LIMITER - Redis-Backed with In-Memory Fallback
   ============================================================
   Uses Upstash Redis for consistent rate limiting across all
   serverless instances. Falls back to in-memory sliding window
   when Redis isn't configured (dev mode, or env vars missing).

   Redis mode: shared state across all Vercel function instances.
   In-memory mode: per-instance only (same as pre-Phase 4).

   Usage:
     const limiter = createRateLimiter({ maxRequests: 6, windowMs: 60_000 });
     const { allowed, remaining } = await limiter.check("user-123");

   BREAKING CHANGE from pre-Phase 4: .check() is now async.
   ============================================================ */

import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "./redis";

/* ---- Types ---- */
interface RateLimiterConfig {
  /* # Maximum requests allowed in the window */
  maxRequests: number;
  /* # Window size in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  /* # Whether the request is allowed */
  allowed: boolean;
  /* # How many requests remain in the current window */
  remaining: number;
  /* # Milliseconds until the window resets */
  resetIn: number;
}

/* ============================================================
   IN-MEMORY FALLBACK — Same sliding window as pre-Phase 4
   ============================================================ */
interface RateLimitEntry {
  timestamps: number[];
}

/* # Cap to prevent memory exhaustion under DDoS with randomized IPs */
const MAX_STORE_SIZE = 10_000;

function createInMemoryLimiter(config: RateLimiterConfig) {
  const store = new Map<string, RateLimitEntry>();

  /* # Clean up expired entries every 5 minutes */
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      entry.timestamps = entry.timestamps.filter(t => now - t < config.windowMs);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  }, 5 * 60 * 1000);
  interval.unref?.();

  return {
    async check(identifier: string): Promise<RateLimitResult> {
      const now = Date.now();
      const entry = store.get(identifier) || { timestamps: [] };

      entry.timestamps = entry.timestamps.filter(t => now - t < config.windowMs);

      if (entry.timestamps.length >= config.maxRequests) {
        const oldestInWindow = entry.timestamps[0];
        const resetIn = config.windowMs - (now - oldestInWindow);
        store.set(identifier, entry);
        return { allowed: false, remaining: 0, resetIn };
      }

      /* # Evict oldest entries if store is full — prevents unbounded memory growth */
      if (store.size >= MAX_STORE_SIZE && !store.has(identifier)) {
        const oldestKey = store.keys().next().value;
        if (oldestKey) store.delete(oldestKey);
      }

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

/* ============================================================
   REDIS-BACKED LIMITER — Shared across all instances
   ============================================================ */
function createRedisLimiter(config: RateLimiterConfig) {
  const redis = getRedis()!;
  /* # Convert windowMs to the format Upstash expects */
  const windowSec = Math.ceil(config.windowMs / 1000);

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.maxRequests, `${windowSec} s`),
    prefix: `rl`,
  });

  return {
    async check(identifier: string): Promise<RateLimitResult> {
      try {
        const result = await ratelimit.limit(identifier);
        return {
          allowed: result.success,
          remaining: result.remaining,
          resetIn: Math.max(0, result.reset - Date.now()),
        };
      } catch {
        /* # Redis failure — deny the request (fail closed to prevent runaway costs) */
        return { allowed: false, remaining: 0, resetIn: 30_000 };
      }
    },
  };
}

/* ============================================================
   PUBLIC API — Auto-selects Redis or in-memory
   ============================================================ */
export function createRateLimiter(config: RateLimiterConfig) {
  if (getRedis()) {
    return createRedisLimiter(config);
  }
  return createInMemoryLimiter(config);
}

/* ---- Pre-configured limiters for the AI endpoint ---- */

/* # Per-user: 6 requests per minute — allows normal use, blocks scripting */
export const userPerMinute = createRateLimiter({ maxRequests: 6, windowMs: 60_000 });

/* # Per-user: 40 requests per hour — allows a productive session */
export const userPerHour = createRateLimiter({ maxRequests: 40, windowMs: 60 * 60_000 });

/* # Per-IP: 20 requests per minute — allows multiple users behind same IP */
export const ipPerMinute = createRateLimiter({ maxRequests: 20, windowMs: 60_000 });

/* ---- Auth route limiters ---- */

/* # Per-IP: 5 auth attempts per minute — enough for typos, blocks stuffing */
export const authPerMinute = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });

/* # Per-IP: 15 auth attempts per hour — prevents slow brute force */
export const authPerHour = createRateLimiter({ maxRequests: 15, windowMs: 60 * 60_000 });
