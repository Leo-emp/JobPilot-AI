/* ============================================================
   WEEKLY STATS - Compute weekly digest data per user
   ============================================================
   Queries all user activity from the past 7 days to build
   the data needed for the weekly intelligence email.
   ============================================================ */

import { prisma } from "./prisma";

/* ---- Types ---- */

export interface WeeklyDigestData {
  userName: string;
  weekOf: string;
  /* Activity */
  applicationsThisWeek: number;
  aiCallsThisWeek: number;
  interviewsScheduled: number;
  /* Intelligence */
  topSkillGaps: { skill: string; jobCount: number }[];
  responseRate: number;
  avgMatchScore: number;
  jobViewsThisWeek: number;
  /* Follow-ups */
  followUpsDue: { name: string; company: string }[];
  applicationFollowUps: { jobTitle: string; company: string; daysSinceApplied: number }[];
  /* CTA */
  dashboardUrl: string;
}

/* # Compute all weekly stats for a single user */
export async function computeWeeklyStats(userId: string): Promise<WeeklyDigestData | null> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  /* Format "May 19 – May 25, 2026" */
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const weekOf = `${fmt(weekAgo)} – ${fmt(now)}, ${now.getFullYear()}`;

  /* Parallel queries for all data */
  const [
    user,
    resumeCount,
    applicationsThisWeek,
    aiCallsThisWeek,
    upcomingInterviews,
    allApplications,
    savedJobs,
    contactFollowUps,
    staleApplications,
    jobViewsThisWeek,
  ] = await Promise.all([
    /* User name */
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, topSkills: true },
    }),

    /* Resume count — skip digest for users who never uploaded one */
    prisma.resume.count({ where: { userId } }),

    /* Applications created this week */
    prisma.application.count({
      where: { userId, createdAt: { gte: weekAgo } },
    }),

    /* AI calls this week */
    prisma.aiResult.count({
      where: { userId, createdAt: { gte: weekAgo } },
    }),

    /* Interviews in the next 7 days */
    prisma.application.count({
      where: {
        userId,
        interviewDate: {
          gte: now,
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),

    /* All applications for response rate */
    prisma.application.findMany({
      where: { userId },
      select: { status: true },
    }),

    /* Saved jobs for match scores + skill gaps */
    prisma.savedJob.findMany({
      where: { userId },
      select: { matchScore: true, requiredSkills: true },
    }),

    /* Contacts with follow-ups due */
    prisma.contact.findMany({
      where: {
        userId,
        nextFollowUp: { lte: now },
      },
      select: { name: true, company: true },
      take: 3,
    }),

    /* Applications in "Applied" status with appliedDate > 5 days ago */
    prisma.application.findMany({
      where: {
        userId,
        status: "Applied",
        appliedDate: { lte: fiveDaysAgo },
      },
      select: { jobTitle: true, company: true, appliedDate: true },
      take: 3,
      orderBy: { appliedDate: "asc" },
    }),

    /* Job views this week (from Chrome extension) */
    prisma.jobView.count({
      where: { userId, viewedAt: { gte: weekAgo } },
    }),
  ]);

  if (!user) return null;

  /* Don't email users who haven't meaningfully engaged yet */
  const totalApplications = allApplications.length;
  if (resumeCount === 0 && totalApplications < 3) return null;

  /* Response rate: applications with Interview or Offer / total applied */
  const applied = allApplications.filter(a => a.status !== "Saved").length;
  const interviewed = allApplications.filter(a =>
    a.status === "Interview" || a.status === "Offer"
  ).length;
  const responseRate = applied > 0 ? Math.round((interviewed / applied) * 100) : 0;

  /* Average match score */
  const scores = savedJobs.filter(j => j.matchScore != null).map(j => j.matchScore!);
  const avgMatchScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  /* Skill gaps — cross-reference user skills vs job requirements */
  let topSkills: string[] = [];
  if (user.topSkills) {
    try { topSkills = JSON.parse(user.topSkills); } catch {}
  }
  const userSkillsLower = new Set(topSkills.map(s => s.toLowerCase()));
  const gapCounts = new Map<string, number>();

  for (const job of savedJobs) {
    if (!job.requiredSkills) continue;
    let skills: string[] = [];
    try { skills = JSON.parse(job.requiredSkills); } catch { continue; }
    for (const skill of skills) {
      if (!userSkillsLower.has(skill.toLowerCase())) {
        gapCounts.set(skill, (gapCounts.get(skill) || 0) + 1);
      }
    }
  }

  const topSkillGaps = [...gapCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill, jobCount]) => ({ skill, jobCount }));

  /* Stale application follow-ups */
  const applicationFollowUps = staleApplications.map(a => ({
    jobTitle: a.jobTitle,
    company: a.company,
    daysSinceApplied: Math.floor((now.getTime() - (a.appliedDate?.getTime() || now.getTime())) / 86400000),
  }));

  /* Contact follow-ups */
  const followUpsDue = contactFollowUps.map(c => ({
    name: c.name,
    company: c.company || "Unknown",
  }));

  /* Skip sending if user had zero activity and no follow-ups */
  const hasActivity = applicationsThisWeek > 0 || aiCallsThisWeek > 0 || jobViewsThisWeek > 0;
  const hasFollowUps = followUpsDue.length > 0 || applicationFollowUps.length > 0;
  const hasInsights = topSkillGaps.length > 0 || allApplications.length >= 3;

  if (!hasActivity && !hasFollowUps && !hasInsights) return null;

  return {
    userName: user.name || "there",
    weekOf,
    applicationsThisWeek,
    aiCallsThisWeek,
    interviewsScheduled: upcomingInterviews,
    topSkillGaps,
    responseRate,
    avgMatchScore,
    jobViewsThisWeek,
    followUpsDue,
    applicationFollowUps,
    dashboardUrl: "https://jobpilotai.co/dashboard",
  };
}
