/* ============================================================
   HEALTH CHECK API — GET /api/health
   ============================================================
   Returns app status and database connectivity. Used by uptime
   monitors and deployment checks. No auth required.
   Includes DB latency, memory usage, and uptime info.
   ============================================================ */

import { NextResponse } from "next/server";
import { dbRetry } from "@/lib/db-retry";
import { prisma } from "@/lib/prisma";
import { getRedis, isRedisConfigured } from "@/lib/redis";

/* # Track when the server started (persists across requests in the same instance) */
const startedAt = new Date().toISOString();

export async function GET() {
  const start = Date.now();

  /* Check database connectivity with retry for transient failures */
  let dbOk = false;
  let dbError: string | undefined;
  try {
    await dbRetry(() => prisma.user.count());
    dbOk = true;
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Unknown error";
  }

  const dbLatencyMs = Date.now() - start;

  /* Check Redis connectivity */
  let redisOk = false;
  let redisLatencyMs = 0;
  const redisConfigured = isRedisConfigured();
  if (redisConfigured) {
    const redisStart = Date.now();
    try {
      const r = getRedis();
      await r!.ping();
      redisOk = true;
    } catch {
      /* Redis down is non-fatal */
    }
    redisLatencyMs = Date.now() - redisStart;
  }

  const status = dbOk ? "healthy" : "degraded";

  /* # Memory usage for monitoring (Node.js process) */
  const mem = process.memoryUsage();

  return NextResponse.json(
    {
      status,
      version: process.env.npm_package_version || "0.1.0",
      db: {
        connected: dbOk,
        latencyMs: dbLatencyMs,
        ...(dbError && { error: dbError }),
      },
      redis: {
        configured: redisConfigured,
        connected: redisOk,
        ...(redisConfigured && { latencyMs: redisLatencyMs }),
      },
      memory: {
        heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
        rssMB: Math.round(mem.rss / 1024 / 1024),
      },
      startedAt,
      timestamp: new Date().toISOString(),
    },
    {
      status: dbOk ? 200 : 503,
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
