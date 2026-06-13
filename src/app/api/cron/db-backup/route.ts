/* ============================================================
   DATABASE BACKUP CRON - Daily Turso/libSQL Export
   ============================================================
   POST /api/cron/db-backup
   Triggered daily at 3am UTC by Vercel Cron.
   Protected by CRON_SECRET bearer token.

   Exports all tables as JSON and stores the backup in Vercel
   Blob storage. Keeps the last 7 backups and auto-deletes
   older ones to stay within free tier limits.

   Restore: download the JSON from Vercel Blob dashboard,
   then re-insert rows via Prisma or raw SQL.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

/* # Max backups to keep — 7 days of daily snapshots */
const MAX_BACKUPS = 7;

export async function POST(req: NextRequest) {
  /* # Auth: only allow requests with the correct cron secret */
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    /* # Export all tables in parallel */
    const [
      users,
      accounts,
      resumes,
      savedJobs,
      applications,
      coverLetters,
      contacts,
      companies,
      aiResults,
      portfolios,
      jobViews,
      careerInsights,
      feedback,
    ] = await Promise.all([
      prisma.user.findMany({ where: { deletedAt: null } }),
      prisma.account.findMany(),
      prisma.resume.findMany(),
      prisma.savedJob.findMany(),
      prisma.application.findMany(),
      prisma.coverLetter.findMany(),
      prisma.contact.findMany(),
      prisma.company.findMany(),
      prisma.aiResult.findMany(),
      prisma.portfolio.findMany(),
      prisma.jobView.findMany(),
      prisma.careerInsight.findMany(),
      prisma.feedback.findMany(),
    ]);

    /* # Build the backup payload with metadata */
    const backup = {
      version: 1,
      createdAt: new Date().toISOString(),
      counts: {
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
      },
      data: {
        users,
        accounts,
        resumes,
        savedJobs,
        applications,
        coverLetters,
        contacts,
        companies,
        aiResults,
        portfolios,
        jobViews,
        careerInsights,
        feedback,
      },
    };

    /* # Upload to Vercel Blob with timestamped filename */
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const blob = await put(
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

    const totalRecords = Object.values(backup.counts).reduce((sum, c) => sum + c, 0);

    return NextResponse.json({
      success: true,
      records: totalRecords,
      counts: backup.counts,
      oldBackupsDeleted: Math.max(0, blobs.length - MAX_BACKUPS),
    });
  } catch (err) {
    console.error("[db-backup] Failed:", err);
    return NextResponse.json(
      { error: "Backup failed" },
      { status: 500 }
    );
  }
}
