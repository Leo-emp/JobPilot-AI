/* ============================================================
   HEALTH CHECK API — GET /api/health
   ============================================================
   Returns app status and database connectivity. Used by uptime
   monitors and deployment checks. No auth required.
   Includes DB latency, memory usage, and uptime info.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { dbRetry } from "@/lib/db-retry";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getRedis, isRedisConfigured } from "@/lib/redis";
import * as Sentry from "@sentry/nextjs";

/* # Track when the server started (persists across requests in the same instance) */
const startedAt = new Date().toISOString();

export async function GET(_req: NextRequest) {
  /* Only admin sees technical error details */
  const session = await auth().catch(() => null);
  const isAdmin = session?.user?.isAdmin ?? false;

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

  /* Check Gemini API reachability */
  let geminiOk = false;
  let geminiLatencyMs = 0;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const geminiStart = Date.now();
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`,
        { signal: AbortSignal.timeout(5000) }
      );
      geminiOk = res.ok;
    } catch { /* Gemini unreachable */ }
    geminiLatencyMs = Date.now() - geminiStart;
  }

  const status = dbOk && geminiOk ? "healthy" : dbOk ? "degraded" : "unhealthy";

  /* Alert Sentry on critical failures */
  if (!dbOk) {
    Sentry.captureMessage("Health check: database unreachable", { level: "fatal", tags: { component: "health" } });
  }
  if (!geminiOk && geminiKey) {
    Sentry.captureMessage("Health check: Gemini API unreachable", { level: "error", tags: { component: "health" } });
  }
  if (redisConfigured && !redisOk) {
    Sentry.captureMessage("Health check: Redis unreachable", { level: "warning", tags: { component: "health" } });
  }

  /* # Memory usage for monitoring (Node.js process) */
  const mem = process.memoryUsage();

  return NextResponse.json(
    {
      status,
      version: process.env.npm_package_version || "0.1.0",
      db: {
        connected: dbOk,
        latencyMs: dbLatencyMs,
        /* Only expose error details to admin */
        ...(dbError && isAdmin && { error: dbError }),
      },
      redis: {
        configured: redisConfigured,
        connected: redisOk,
        ...(redisConfigured && { latencyMs: redisLatencyMs }),
      },
      gemini: {
        configured: !!geminiKey,
        reachable: geminiOk,
        latencyMs: geminiLatencyMs,
      },
      /* Memory stats only for admin — prevents leaking server internals */
      ...(isAdmin && {
        memory: {
          heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
          rssMB: Math.round(mem.rss / 1024 / 1024),
        },
      }),
      startedAt,
      timestamp: new Date().toISOString(),
    },
    {
      status: status === "healthy" ? 200 : 503,
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
