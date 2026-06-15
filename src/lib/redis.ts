/* ============================================================
   REDIS CLIENT - Upstash Redis with Graceful Fallback
   ============================================================
   Creates a singleton Redis client for rate limiting, account
   lockout, and caching. Falls back gracefully when env vars
   aren't configured — the app works without Redis, just uses
   in-memory storage (same behavior as pre-Phase 4).

   Setup: Create a free Upstash Redis database at upstash.com,
   then set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
   in your Vercel environment variables.
   ============================================================ */

import { Redis } from "@upstash/redis";

/* # Singleton Redis instance — reused across all imports */
let redis: Redis | null = null;

/* # Whether Redis is configured (env vars present) */
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/* # Get the shared Redis client — returns null if not configured */
export function getRedis(): Redis | null {
  if (!isRedisConfigured()) return null;

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  return redis;
}

/* ============================================================
   CACHE UTILITIES - Redis-backed with TTL
   ============================================================
   Simple get/set/del for caching DB lookups. Returns null on
   cache miss or if Redis isn't configured. All operations are
   non-blocking — a cache failure never breaks the app.
   ============================================================ */

/* # Get a cached value — returns null on miss or error */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const r = getRedis();
  if (!r) return null;

  try {
    const value = await r.get<T>(key);
    return value;
  } catch {
    return null;
  }
}

/* # Set a cached value with TTL in seconds */
export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const r = getRedis();
  if (!r) return;

  try {
    await r.set(key, value, { ex: ttlSeconds });
  } catch {
    /* Cache write failure is non-fatal */
  }
}

/* # Delete a cached key (use after mutations) */
export async function cacheDel(key: string): Promise<void> {
  const r = getRedis();
  if (!r) return;

  try {
    await r.del(key);
  } catch {
    /* Cache delete failure is non-fatal */
  }
}

/* ============================================================
   GLOBAL DAILY CAP - Platform-wide circuit breaker
   ============================================================
   Hard ceiling on total AI calls across ALL users per day.
   Prevents runaway costs even if every other limit fails.
   Falls back to in-memory counter when Redis isn't available.
   ============================================================ */

const GLOBAL_DAILY_CAP = parseInt(process.env.GLOBAL_AI_DAILY_CAP || "5000", 10);

export async function checkGlobalDailyCap(): Promise<{ allowed: boolean; used: number; cap: number }> {
  const r = getRedis();

  if (r) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const key = `global:ai:daily:${today}`;
      const count = await r.incr(key);
      if (count === 1) await r.expire(key, 86400);
      return { allowed: count <= GLOBAL_DAILY_CAP, used: count, cap: GLOBAL_DAILY_CAP };
    } catch {
      return { allowed: false, used: 0, cap: GLOBAL_DAILY_CAP };
    }
  }

  /* # Fail closed when Redis is unavailable — per-instance counters can't enforce a global cap */
  return { allowed: false, used: 0, cap: GLOBAL_DAILY_CAP };
}
