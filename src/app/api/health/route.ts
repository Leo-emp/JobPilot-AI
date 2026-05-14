/* ============================================================
   HEALTH CHECK API — GET /api/health
   ============================================================
   Returns app status and database connectivity. Used by uptime
   monitors and deployment checks. No auth required.
   ============================================================ */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const start = Date.now();

  /* Check database connectivity */
  let dbOk = false;
  try {
    await prisma.user.count();
    dbOk = true;
  } catch {
    /* DB unreachable */
  }

  const latency = Date.now() - start;
  const status = dbOk ? "healthy" : "degraded";

  return NextResponse.json(
    {
      status,
      db: dbOk ? "connected" : "unreachable",
      latencyMs: latency,
      timestamp: new Date().toISOString(),
    },
    { status: dbOk ? 200 : 503 }
  );
}
