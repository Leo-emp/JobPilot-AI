/* ============================================================
   DASHBOARD STATS API — Quick Overview Counts
   ============================================================
   GET /api/dashboard/stats
   Returns resume, job, application, and cover letter counts
   for the authenticated user. Used by the dashboard home page
   to avoid server-side data fetching (enables instant navigation).
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  /* # Fetch all four counts in parallel */
  const [resumeCount, jobCount, applicationCount, coverLetterCount] = await dbRetry(() =>
    Promise.all([
      prisma.resume.count({ where: { userId } }),
      prisma.savedJob.count({ where: { userId } }),
      prisma.application.count({ where: { userId } }),
      prisma.coverLetter.count({ where: { userId } }),
    ])
  );

  return NextResponse.json(
    { resumeCount, jobCount, applicationCount, coverLetterCount },
    { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
  );
}
