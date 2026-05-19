/* ============================================================
   ADMIN STATS API — /api/admin/stats
   ============================================================
   Returns platform-wide analytics for the admin dashboard.
   Protected: only ADMIN_EMAILS can access this endpoint.
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  /* ---- Auth + admin gate ---- */
  const session = await auth();
  if (!session?.user?.isAdmin) {
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
    /* User list with usage stats (most recent first, capped at 200) */
    prisma.user.findMany({
      take: 200,
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

  /* ---- Revenue Metrics (estimated from plan data) ---- */
  const monthlyPrice = 10;
  const annualMonthlyPrice = 8;
  const estimatedMRR = proUsers * monthlyPrice;
  const conversionRate = totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : "0.0";
  const avgAICallsPerUser = totalUsers > 0 ? Math.round(totalAICalls / totalUsers) : 0;

  /* ---- Growth: signups per week for last 8 weeks ---- */
  const weeklyGrowth: { week: string; signups: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
    const count = allUsers.filter(u => {
      const d = new Date(u.createdAt);
      return d >= start && d < end;
    }).length;
    weeklyGrowth.push({
      week: start.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      signups: count,
    });
  }

  return NextResponse.json({
    overview: {
      totalUsers,
      freeUsers,
      proUsers,
      recentSignups,
      monthlySignups,
      totalAICalls,
    },
    revenue: {
      estimatedMRR,
      conversionRate,
      avgAICallsPerUser,
      monthlyPrice,
      annualMonthlyPrice,
    },
    growth: weeklyGrowth,
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
