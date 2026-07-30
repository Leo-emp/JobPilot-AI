/* ============================================================
   HEALTH MONITOR CRON - Automated Service Check
   ============================================================
   POST /api/cron/health-monitor
   Triggered every 5 minutes by Vercel Cron.
   Protected by CRON_SECRET bearer token.

   Calls the /api/health endpoint internally and logs
   degraded/unhealthy status to Sentry. The health endpoint
   already sends Sentry alerts per-service, but this cron
   ensures those checks run regularly — not just when a
   user happens to hit the endpoint.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  /* # Verify Vercel cron secret */
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    /* # Build the internal URL from the request origin */
    const origin = req.nextUrl.origin;
    const res = await fetch(`${origin}/api/health`, {
      signal: AbortSignal.timeout(15000),
      headers: { "Cache-Control": "no-cache" },
    });

    const data = await res.json();

    /* # Log status transitions to help debug intermittent issues */
    if (data.status === "unhealthy") {
      Sentry.captureMessage("Health monitor: app is UNHEALTHY", {
        level: "fatal",
        tags: { component: "health-monitor" },
        extra: {
          db: data.db,
          redis: data.redis,
          gemini: data.gemini,
        },
      });
    } else if (data.status === "degraded") {
      Sentry.captureMessage("Health monitor: app is DEGRADED", {
        level: "warning",
        tags: { component: "health-monitor" },
        extra: {
          db: data.db,
          redis: data.redis,
          gemini: data.gemini,
        },
      });
    }

    return NextResponse.json({
      monitored: true,
      status: data.status,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    /* # Health endpoint itself is unreachable — critical failure */
    Sentry.captureException(err, {
      tags: { component: "health-monitor" },
    });

    return NextResponse.json(
      {
        monitored: true,
        status: "unreachable",
        error: err instanceof Error ? err.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
