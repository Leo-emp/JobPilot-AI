/* ============================================================
   CRON: OUTREACH QUEUE — POST /api/cron/outreach
   ============================================================
   Runs every 15 minutes via Vercel Cron.
   1. Processes queued outreach emails (up to 20 per run)
   2. Checks suppression list before every send
   3. Queues follow-ups for sent emails past their delay
   4. Monitors bounce rates, auto-pauses if > 10%

   Protected by CRON_SECRET bearer token.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/cron-auth";
import { processOutreachQueue, queueFollowUps } from "@/lib/outreach-queue";
import { audit } from "@/lib/audit";
import { isB2BEnabled } from "@/lib/b2b-gate";

export async function POST(req: NextRequest) {
  /* # B2B gate */
  if (!isB2BEnabled()) {
    return NextResponse.json({ skipped: true, reason: "B2B not enabled" });
  }

  /* # Auth: timing-safe verification of cron secret */
  const authError = verifyCronSecret(req);
  if (authError) return authError;

  /* # Process the send queue */
  const sendResult = await processOutreachQueue();

  /* # Queue follow-ups for sent emails past their delay */
  const followUpsQueued = await queueFollowUps();

  audit("outreach.sent", {
    detail: `cron sent:${sendResult.sent} suppressed:${sendResult.suppressed} failed:${sendResult.failed} followUps:${followUpsQueued}`,
  });

  return NextResponse.json({
    ...sendResult,
    followUpsQueued,
  });
}
