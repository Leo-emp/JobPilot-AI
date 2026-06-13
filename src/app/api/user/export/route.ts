/* ============================================================
   DATA EXPORT API — GDPR Right to Data Portability
   ============================================================
   GET /api/user/export
   Returns ALL of the authenticated user's data as a JSON file.
   Includes: profile, resumes, saved jobs, applications,
   cover letters, contacts, companies, and AI history.

   Read-only — no database modifications.
   Scoped to the requesting user's data only.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { createRateLimiter } from "@/lib/rate-limit";
import { safeHandler } from "@/lib/api-handler";

/* # 3 exports per hour per user — enough for legitimate use, blocks abuse */
const exportLimiter = createRateLimiter({ maxRequests: 3, windowMs: 60 * 60_000 });

export const GET = safeHandler(async (_req: NextRequest) => {
  /* # Authenticate — only logged-in users can export their own data */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitCheck = await exportLimiter.check(`export:${session.user.id}`);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Export limit reached. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limitCheck.resetIn / 1000)) } }
    );
  }

  const userId = session.user.id;

  /* # Fetch all user data in parallel for speed */
  const [user, resumes, savedJobs, applications, coverLetters, contacts, companies, aiHistory] =
    await dbRetry(() =>
      Promise.all([
        /* Profile info (excluding password hash and internal Stripe IDs) */
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            plan: true,
            aiUsageCount: true,
            usageResetDate: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        /* All resumes (capped at 500) */
        prisma.resume.findMany({
          where: { userId },
          select: {
            id: true,
            fileName: true,
            content: true,
            analysis: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 500,
        }),
        /* All saved jobs (capped at 5000) */
        prisma.savedJob.findMany({
          where: { userId },
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            description: true,
            url: true,
            salary: true,
            matchScore: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5000,
        }),
        /* All applications (capped at 5000) */
        prisma.application.findMany({
          where: { userId },
          select: {
            id: true,
            jobTitle: true,
            company: true,
            status: true,
            notes: true,
            appliedDate: true,
            interviewDate: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5000,
        }),
        /* All cover letters (capped at 2000) */
        prisma.coverLetter.findMany({
          where: { userId },
          select: {
            id: true,
            jobTitle: true,
            company: true,
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 2000,
        }),
        /* All contacts (capped at 2000) */
        prisma.contact.findMany({
          where: { userId },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
            role: true,
            linkedinUrl: true,
            relationship: true,
            notes: true,
            lastContactedAt: true,
            nextFollowUp: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 2000,
        }),
        /* All companies (capped at 2000) */
        prisma.company.findMany({
          where: { userId },
          select: {
            id: true,
            name: true,
            industry: true,
            website: true,
            location: true,
            size: true,
            notes: true,
            priority: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 2000,
        }),
        /* All AI history (capped at 5000) */
        prisma.aiResult.findMany({
          where: { userId },
          select: {
            id: true,
            action: true,
            title: true,
            result: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5000,
        }),
      ])
    );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  /* # Build the export payload */
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    profile: user,
    resumes,
    savedJobs,
    applications,
    coverLetters,
    contacts,
    companies,
    aiHistory,
  };

  /* # Return as a downloadable JSON file */
  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="jobpilot-export-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
});
