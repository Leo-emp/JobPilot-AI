/* ============================================================
   ADMIN STATS API — /api/admin/stats
   ============================================================
   Returns platform-wide analytics for the admin dashboard.
   Protected: only ADMIN_EMAILS can access this endpoint.
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- Admin check (same logic as ai/route.ts) ---- */
function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
  return admins.includes(email.toLowerCase());
}

export async function GET() {
  /* ---- Auth + admin gate ---- */
  const session = await auth();
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  /* ---- Fetch all stats in parallel ---- */
  const [
    totalUsers,
    freeUsers,
    proUsers,
    totalResumes,
    totalJobs,
    totalApplications,
    totalCoverLetters,
    totalContacts,
    totalCompanies,
    allUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "free" } }),
    prisma.user.count({ where: { plan: "pro" } }),
    prisma.resume.count(),
    prisma.savedJob.count(),
    prisma.application.count(),
    prisma.coverLetter.count(),
    prisma.contact.count(),
    prisma.company.count(),
    /* Full user list with usage stats (sorted by most recent first) */
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        aiUsageCount: true,
        usageResetDate: true,
        createdAt: true,
        _count: {
          select: {
            resumes: true,
            jobs: true,
            applications: true,
            coverLetters: true,
            contacts: true,
          },
        },
      },
    }),
  ]);

  /* ---- Total AI calls across all users ---- */
  const totalAICalls = allUsers.reduce((sum, u) => sum + u.aiUsageCount, 0);

  /* ---- Signups in last 7 days ---- */
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentSignups = allUsers.filter(u => new Date(u.createdAt) >= weekAgo).length;

  /* ---- Signups in last 30 days ---- */
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const monthlySignups = allUsers.filter(u => new Date(u.createdAt) >= monthAgo).length;

  return NextResponse.json({
    overview: {
      totalUsers,
      freeUsers,
      proUsers,
      recentSignups,
      monthlySignups,
      totalAICalls,
    },
    content: {
      totalResumes,
      totalJobs,
      totalApplications,
      totalCoverLetters,
      totalContacts,
      totalCompanies,
    },
    users: allUsers,
  });
}
