/* ============================================================
   DATABASE BACKUP CRON - Daily Turso/libSQL Export
   ============================================================
   POST /api/cron/db-backup
   Triggered daily at 3am UTC by Vercel Cron.
   Protected by CRON_SECRET bearer token.

   Exports all tables as JSON in batches (paginated to avoid
   OOM on large datasets) and stores the backup in Vercel Blob
   storage. Keeps the last 7 backups and auto-deletes older
   ones to stay within free tier limits.

   Restore: download the JSON from Vercel Blob dashboard,
   then re-insert rows via Prisma or raw SQL.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";

/* # Max backups to keep — 7 days of daily snapshots */
const MAX_BACKUPS = 7;

/* # Batch size for paginated table exports — prevents OOM */
const BATCH_SIZE = 500;

/* # Generic paginated export — fetches all rows in batches */
async function exportTable<T extends { id: string }>(
  findMany: (args: { take: number; skip: number }) => Promise<T[]>
): Promise<T[]> {
  const all: T[] = [];
  let skip = 0;

  while (true) {
    const batch = await dbRetry(() => findMany({ take: BATCH_SIZE, skip }));
    all.push(...batch);
    if (batch.length < BATCH_SIZE) break;
    skip += BATCH_SIZE;
  }

  return all;
}

export const POST = safeHandler(async (req: NextRequest) => {
  /* # Auth: only allow requests with the correct cron secret */
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* # Export tables sequentially in batches to control memory usage */
  const users = await exportTable((args) => prisma.user.findMany({ ...args, where: { deletedAt: null } }));
  const accounts = await exportTable((args) => prisma.account.findMany(args));
  const resumes = await exportTable((args) => prisma.resume.findMany(args));
  const savedJobs = await exportTable((args) => prisma.savedJob.findMany(args));
  const applications = await exportTable((args) => prisma.application.findMany(args));
  const coverLetters = await exportTable((args) => prisma.coverLetter.findMany(args));
  const contacts = await exportTable((args) => prisma.contact.findMany(args));
  const companies = await exportTable((args) => prisma.company.findMany(args));
  const aiResults = await exportTable((args) => prisma.aiResult.findMany(args));
  const portfolios = await exportTable((args) => prisma.portfolio.findMany(args));
  const jobViews = await exportTable((args) => prisma.jobView.findMany(args));
  const careerInsights = await exportTable((args) => prisma.careerInsight.findMany(args));
  const feedback = await exportTable((args) => prisma.feedback.findMany(args));

  /* # Build the backup payload with metadata */
  const counts = {
    users: users.length,
    accounts: accounts.length,
    resumes: resumes.length,
    savedJobs: savedJobs.length,
    applications: applications.length,
    coverLetters: coverLetters.length,
    contacts: contacts.length,
    companies: companies.length,
    aiResults: aiResults.length,
    portfolios: portfolios.length,
    jobViews: jobViews.length,
    careerInsights: careerInsights.length,
    feedback: feedback.length,
  };

  const backup = {
    version: 2,
    createdAt: new Date().toISOString(),
    counts,
    data: {
      users, accounts, resumes, savedJobs, applications,
      coverLetters, contacts, companies, aiResults,
      portfolios, jobViews, careerInsights, feedback,
    },
  };

  /* # Upload to Vercel Blob with timestamped filename */
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  await put(
    `db-backups/backup-${timestamp}.json`,
    JSON.stringify(backup),
    {
      access: "private",
      contentType: "application/json",
    }
  );

  /* # Clean up old backups — keep only the most recent MAX_BACKUPS */
  const { blobs } = await list({ prefix: "db-backups/" });
  if (blobs.length > MAX_BACKUPS) {
    const sorted = blobs.sort(
      (a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
    );
    const toDelete = sorted.slice(0, blobs.length - MAX_BACKUPS);
    await Promise.all(toDelete.map((b) => del(b.url)));
  }

  const totalRecords = Object.values(counts).reduce((sum, c) => sum + c, 0);

  return NextResponse.json({
    success: true,
    records: totalRecords,
    counts,
    oldBackupsDeleted: Math.max(0, blobs.length - MAX_BACKUPS),
  });
});
