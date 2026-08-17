/* ============================================================
   CRON AUTH — Timing-safe authentication for cron routes
   ============================================================
   Vercel cron jobs send a Bearer token in the Authorization
   header. This helper validates it using timing-safe comparison
   to prevent timing attacks that could leak the secret byte
   by byte via response time analysis.

   Usage:
     const authError = verifyCronSecret(req);
     if (authError) return authError;
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/* # Timing-safe string compare — prevents leaking secret length/content via response timing */
function timingSafeCompare(a: string, b: string): boolean {
  /* # If lengths differ, still compare to avoid early exit leaking length info */
  if (a.length !== b.length) {
    /* # Compare against self to burn equal time, then return false */
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/* # Returns null if auth passes, or a 401 response if it fails */
export function verifyCronSecret(req: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;

  /* # CRON_SECRET must be configured — reject if missing */
  if (!cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* # Extract Bearer token from Authorization header */
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";

  /* # Timing-safe comparison prevents timing attacks */
  if (!token || !timingSafeCompare(token, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
