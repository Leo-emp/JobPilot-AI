/* ============================================================
   OPT-OUT — GET, POST /api/outreach/opt-out
   ============================================================
   GET: Show opt-out confirmation (email param in query string).
   POST: Process opt-out — add email to global suppression list
         and cancel all queued outreach for that email.

   This endpoint is public (no auth required).
   CAN-SPAM and GDPR require a one-click opt-out mechanism.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { audit, getClientIp } from "@/lib/audit";
import { isB2BEnabled } from "@/lib/b2b-gate";
import { createRateLimiter } from "@/lib/rate-limit";

/* # Rate limit: 10 opt-outs per minute per IP — prevents mass suppression abuse */
const optOutLimit = createRateLimiter({ maxRequests: 10, windowMs: 60_000 });

/* # GET — Confirm opt-out (landing page for email link) */
export async function GET(req: NextRequest) {
  if (!isB2BEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  /* # Rate limit by IP */
  const ip = getClientIp(req.headers) || "unknown";
  const { allowed } = await optOutLimit.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 },
    );
  }

  /* # Process the opt-out immediately on GET (one-click compliance) */
  const normalizedEmail = email.toLowerCase().trim();

  /* # Add to suppression list (upsert to handle duplicates) */
  await dbRetry(() =>
    prisma.emailSuppression.upsert({
      where: { email: normalizedEmail },
      create: { email: normalizedEmail, reason: "opt_out" },
      update: {},
    })
  );

  /* # Cancel all queued outreach for this email */
  await dbRetry(() =>
    prisma.outreach.updateMany({
      where: { email: normalizedEmail, status: "queued" },
      data: { status: "cancelled" },
    })
  );

  audit("outreach.suppressed", {
    detail: `opt-out email:${normalizedEmail}`,
  });

  /* # Return a simple confirmation page */
  return new NextResponse(
    `<html><head><title>Unsubscribed</title></head><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;text-align:center"><h2>You have been unsubscribed</h2><p>You will no longer receive recruiting outreach emails from JobPilot AI.</p><p>If this was a mistake, contact support@jobpilotai.co.</p></body></html>`,
    { headers: { "Content-Type": "text/html" } },
  );
}

/* # POST — API opt-out (for programmatic use) */
export async function POST(req: NextRequest) {
  if (!isB2BEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  /* # Rate limit by IP */
  const ip = getClientIp(req.headers) || "unknown";
  const { allowed } = await optOutLimit.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const email = body.email;

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 },
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  await dbRetry(() =>
    prisma.emailSuppression.upsert({
      where: { email: normalizedEmail },
      create: { email: normalizedEmail, reason: "opt_out" },
      update: {},
    })
  );

  await dbRetry(() =>
    prisma.outreach.updateMany({
      where: { email: normalizedEmail, status: "queued" },
      data: { status: "cancelled" },
    })
  );

  audit("outreach.suppressed", {
    detail: `api-opt-out email:${normalizedEmail}`,
  });

  return NextResponse.json({
    optedOut: true,
    message: "You will no longer receive outreach emails.",
  });
}
