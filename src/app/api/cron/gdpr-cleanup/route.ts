/* ============================================================
   GDPR CLEANUP CRON - Hard-Delete Expired Accounts
   ============================================================
   POST /api/cron/gdpr-cleanup
   Triggered daily by Vercel Cron.
   Protected by CRON_SECRET bearer token.

   Finds users whose deletedAt is older than 30 days and
   permanently removes them and all cascaded data (resumes,
   jobs, applications, contacts, companies, AI history, etc.).
   Prisma cascade deletes handle all child records.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { audit } from "@/lib/audit";
import { getStripe } from "@/lib/stripe";
import { cacheGet, cacheSet } from "@/lib/redis";

/* # 30-day retention period before permanent deletion */
const RETENTION_DAYS = 30;

/* # Process one user at a time to avoid long transactions */
const BATCH_SIZE = 10;

export const POST = safeHandler(async (req: NextRequest) => {
  /* Auth: only allow requests with the correct cron secret */
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* # Idempotency lock — prevents duplicate runs if Vercel retries */
  const lockKey = `cron:gdpr-cleanup:${new Date().toISOString().slice(0, 10)}`;
  const alreadyRan = await cacheGet(lockKey);
  if (alreadyRan) {
    return NextResponse.json({ skipped: true, reason: "Already ran today" });
  }
  await cacheSet(lockKey, "1", 86400);

  /* # Calculate the cutoff date — accounts deleted more than 30 days ago */
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  /* # Find expired soft-deleted users (include Stripe sub for cleanup) */
  const expiredUsers = await dbRetry(() =>
    prisma.user.findMany({
      where: {
        deletedAt: { not: null, lt: cutoff },
      },
      select: { id: true, email: true, deletedAt: true, stripeSubId: true },
      take: BATCH_SIZE,
    })
  );

  let purged = 0;
  let failed = 0;

  /* # Hard-delete each user — cancel Stripe sub first, then Prisma cascade removes all child records */
  for (const user of expiredUsers) {
    try {
      /* # Cancel any active Stripe subscription to prevent orphaned charges */
      if (user.stripeSubId) {
        try {
          await getStripe().subscriptions.cancel(user.stripeSubId);
        } catch { /* # Already cancelled or doesn't exist — safe to proceed */ }
      }

      await dbRetry(() =>
        prisma.user.delete({ where: { id: user.id } })
      );

      audit("gdpr.hard_delete", {
        userId: user.id,
        email: user.email,
        deletedAt: user.deletedAt?.toISOString(),
        detail: `Permanently removed after ${RETENTION_DAYS}-day retention`,
      });

      purged++;
    } catch {
      failed++;
    }
  }

  console.log(`[gdpr-cleanup] Purged ${purged}, failed ${failed}, remaining expired: ${expiredUsers.length - purged}`);

  return NextResponse.json({
    success: true,
    purged,
    failed,
    cutoffDate: cutoff.toISOString(),
    timestamp: new Date().toISOString(),
  });
}, { timeoutMs: 60_000 });
