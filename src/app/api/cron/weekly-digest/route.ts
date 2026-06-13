/* ============================================================
   WEEKLY DIGEST CRON - Send Career Intelligence Emails
   ============================================================
   POST /api/cron/weekly-digest
   Triggered by Vercel Cron every Monday 8am UTC.
   Protected by CRON_SECRET bearer token.

   For each opted-in user: compute weekly stats, build email,
   send via Resend. Batched (50 at a time) to avoid rate limits.
   Failures per-user don't block other users.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { computeWeeklyStats } from "@/lib/weekly-stats";
import { buildWeeklyDigestEmail } from "@/lib/weekly-digest-email";

const resend = new Resend(process.env.RESEND_API_KEY);
const BATCH_SIZE = 50;

export const POST = safeHandler(async (req: NextRequest) => {
  /* Auth: only allow requests with the correct cron secret */
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    /* Get all opted-in, active users */
    const users = await dbRetry(() => prisma.user.findMany({
      where: {
        weeklyDigest: true,
        deletedAt: null,
      },
      select: { id: true, email: true },
    }));

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    /* Process in batches to avoid Resend rate limits */
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map(async (user) => {
          /* Compute stats for this user */
          const stats = await computeWeeklyStats(user.id);

          /* Skip if no meaningful data to send */
          if (!stats) {
            skipped++;
            return;
          }

          /* Build and send the email */
          const html = buildWeeklyDigestEmail(stats);

          await resend.emails.send({
            from: "JobPilot AI <noreply@jobpilotai.co>",
            to: user.email,
            subject: `Your Career Intelligence — ${stats.weekOf}`,
            html,
          });

          sent++;
        })
      );

      /* Count failures */
      for (const result of results) {
        if (result.status === "rejected") {
          failed++;
          console.error("[weekly-digest] Send failed:", result.reason);
        }
      }
    }

    console.log(`[weekly-digest] Completed: ${sent} sent, ${skipped} skipped, ${failed} failed out of ${users.length} users`);

    return NextResponse.json({
      success: true,
      total: users.length,
      sent,
      skipped,
      failed,
    });
  } catch (err) {
    console.error("[weekly-digest] Cron error:", err);
    return NextResponse.json(
      { error: "Digest failed" },
      { status: 500 }
    );
  }
}, { timeoutMs: 120_000 });
