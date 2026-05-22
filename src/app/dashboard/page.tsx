/* ============================================================
   DASHBOARD HOME — Command Center
   ============================================================
   The first page users see after logging in. Shows:
   - Welcome header with greeting
   - AI usage meter (calls used vs limit)
   - Key stats cards with icons
   - Application pipeline visual
   - Recent AI activity timeline
   - Upcoming interviews & follow-ups
   - Full feature grid (all tools)
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Onboarding from "@/components/Onboarding";

/* ---- Types from the stats API ---- */
interface RecentActivity {
  id: string;
  action: string;
  title: string;
  createdAt: string;
}

interface UpcomingInterview {
  id: string;
  jobTitle: string;
  company: string;
  interviewDate: string;
}

interface UpcomingFollowUp {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  nextFollowUp: string;
}

interface DashboardStats {
  resumeCount: number;
  jobCount: number;
  applicationCount: number;
  coverLetterCount: number;
  contactCount: number;
  aiResultCount: number;
  aiUsage: { used: number; limit: number; plan: string };
  recentActivity: RecentActivity[];
  pipeline: Record<string, number>;
  upcomingInterviews: UpcomingInterview[];
  upcomingFollowUps: UpcomingFollowUp[];
}

/* ---- Human-readable labels for AI action types ---- */
const actionLabels: Record<string, { label: string; color: string; icon: string }> = {
  analyze_resume: { label: "Resume Analysis", color: "text-blue-400", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  optimize_resume: { label: "Resume Optimize", color: "text-blue-400", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  rebuild_resume: { label: "Resume Rebuild", color: "text-blue-400", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  career_pivot: { label: "Career Pivot", color: "text-purple-400", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  cover_letter: { label: "Cover Letter", color: "text-emerald-400", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  match_score: { label: "Match Score", color: "text-sky-400", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  interview_questions: { label: "Interview Q's", color: "text-amber-400", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  interview_answer: { label: "Practice Answer", color: "text-amber-400", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
  interview_feedback: { label: "Answer Feedback", color: "text-amber-400", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  mock_interview_summary: { label: "Mock Interview", color: "text-orange-400", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  linkedin_audit: { label: "LinkedIn Audit", color: "text-indigo-400", icon: "M20 7h-4a2 2 0 00-2 2v9m6-11v11a2 2 0 01-2 2h-2a2 2 0 01-2-2M8 7H4a2 2 0 00-2 2v9a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2zm0 0V5a2 2 0 012-2h0a2 2 0 012 2v2M8 7h4" },
  linkedin_rewrite: { label: "LinkedIn Rewrite", color: "text-indigo-400", icon: "M20 7h-4a2 2 0 00-2 2v9m6-11v11a2 2 0 01-2 2h-2a2 2 0 01-2-2M8 7H4a2 2 0 00-2 2v9a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2zm0 0V5a2 2 0 012-2h0a2 2 0 012 2v2M8 7h4" },
  linkedin_content_strategy: { label: "Content Strategy", color: "text-indigo-400", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  craft_outreach: { label: "AI Outreach", color: "text-teal-400", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
};

/* ---- All features grid ---- */
const features = [
  {
    href: "/dashboard/resume",
    title: "Resume Intelligence",
    description: "Analyze, optimize, rebuild, or career-pivot your resume with AI",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    href: "/dashboard/templates",
    title: "Resume Templates",
    description: "Professional template gallery with preview and customization",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    iconPath: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z",
  },
  {
    href: "/dashboard/jobs",
    title: "Job Search & Match",
    description: "Search jobs, check match scores, and get gap analysis",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    href: "/dashboard/cover-letter",
    title: "Cover Letter",
    description: "Generate tailored cover letters in your voice",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    iconPath: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    href: "/dashboard/tracker",
    title: "Application Tracker",
    description: "Track every application from saved to offer",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    href: "/dashboard/interview",
    title: "Interview Prep",
    description: "Predict questions, practice answers, get AI coaching",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    iconPath: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    href: "/dashboard/interview/mock",
    title: "Mock Interview",
    description: "Full interactive mock with voice, video, and live scoring",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    iconPath: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  },
  {
    href: "/dashboard/linkedin",
    title: "LinkedIn Optimizer",
    description: "Audit, rewrite, and build a content strategy for LinkedIn",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    iconPath: "M20 7h-4a2 2 0 00-2 2v9m6-11v11a2 2 0 01-2 2h-2a2 2 0 01-2-2M8 7H4a2 2 0 00-2 2v9a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2zm0 0V5a2 2 0 012-2h0a2 2 0 012 2v2M8 7h4",
  },
  {
    href: "/dashboard/network",
    title: "AI Outreach Hub",
    description: "Craft networking messages, manage contacts & companies",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

/* ---- Application pipeline stages (in order) ---- */
const pipelineStages = [
  { key: "Saved", color: "bg-slate-500", label: "Saved" },
  { key: "Applied", color: "bg-blue-500", label: "Applied" },
  { key: "Interview", color: "bg-amber-500", label: "Interview" },
  { key: "Offer", color: "bg-emerald-500", label: "Offer" },
  { key: "Rejected", color: "bg-red-500", label: "Rejected" },
];

/* ---- Format relative time (e.g., "2 hours ago") ---- */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ---- Format a future date nicely ---- */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return d.toLocaleDateString("en-US", { weekday: "long" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ---- Career Insights types ---- */
interface SkillGap { skill: string; jobCount: number }
interface SuccessPattern { label: string; value: string }
interface CareerInsightsData {
  topSkills: string[];
  skillGaps: SkillGap[];
  successPatterns: SuccessPattern[];
  recommendations: string[];
  stats: { totalApplications: number; interviewRate: number; avgMatchScore: number; jobViewsThisWeek: number };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [insights, setInsights] = useState<CareerInsightsData | null>(null);

  /* # Fetch dashboard stats and career insights in parallel */
  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setStats(data); })
      .catch(() => {});

    fetch("/api/career-insights")
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setInsights(data); })
      .catch(() => {});
  }, []);

  const hasActivity = stats
    ? (stats.resumeCount + stats.jobCount + stats.applicationCount + stats.coverLetterCount) > 0
    : false;

  /* # Skeleton pulse element for loading state */
  const skeleton = (w: string) => (
    <span className={`inline-block h-7 ${w} bg-space-600 rounded-lg animate-pulse`} />
  );

  /* # AI usage bar calculations */
  const aiUsed = stats?.aiUsage.used ?? 0;
  const aiLimit = stats?.aiUsage.limit ?? 20;
  const aiPlan = stats?.aiUsage.plan ?? "free";
  const aiPct = Math.min((aiUsed / aiLimit) * 100, 100);
  const aiBarColor = aiPct > 90 ? "bg-red-500" : aiPct > 70 ? "bg-amber-500" : "bg-brand-indigo";

  /* # Pipeline total for percentage widths */
  const pipelineTotal = stats
    ? pipelineStages.reduce((sum, s) => sum + (stats.pipeline[s.key] || 0), 0)
    : 0;

  return (
    <div>
      {/* ---- Onboarding for new users ---- */}
      {stats !== null && <Onboarding hasActivity={hasActivity} />}

      {/* ============================================================
         ROW 1: WELCOME + AI USAGE
         ============================================================ */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        {/* Welcome text */}
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold mb-1">
            Welcome back,{" "}
            <span className="glow-text">
              {session?.user?.name?.split(" ")[0] || "there"}
            </span>
          </h1>
          <p className="text-text-secondary">
            Here&apos;s your career command center.
          </p>
        </div>

        {/* AI Usage Meter */}
        {stats && (
          <div className="glass-card px-5 py-4 w-full lg:w-80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">AI Usage</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-indigo/15 border border-brand-indigo/25 text-brand-light font-medium capitalize">
                {aiPlan}
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold text-white">{aiUsed}</span>
              <span className="text-sm text-text-muted">/ {aiLimit === 9999 ? "Unlimited" : aiLimit} this month</span>
            </div>
            <div className="w-full h-2 bg-space-600 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${aiBarColor}`}
                style={{ width: `${aiLimit === 9999 ? 5 : aiPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
         ROW 2: STAT CARDS (6 metrics)
         ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {[
          { label: "Resumes", value: stats?.resumeCount, color: "text-blue-400", iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          { label: "Jobs Saved", value: stats?.jobCount, color: "text-sky-400", iconPath: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
          { label: "Applications", value: stats?.applicationCount, color: "text-emerald-400", iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
          { label: "Cover Letters", value: stats?.coverLetterCount, color: "text-amber-400", iconPath: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          { label: "Contacts", value: stats?.contactCount, color: "text-teal-400", iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
          { label: "AI Results", value: stats?.aiResultCount, color: "text-purple-400", iconPath: "M13 10V3L4 14h7v7l9-11h-7z" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className={`w-4 h-4 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.iconPath} />
              </svg>
              <span className="text-xs text-text-muted truncate">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stats ? stat.value : skeleton("w-10")}
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
         CAREER INTELLIGENCE (only shows when enough data exists)
         ============================================================ */}
      {insights && (insights.skillGaps.length > 0 || insights.recommendations.length > 0 || insights.successPatterns.length > 0) && (
        <div className="mb-8">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Career Intelligence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Skill Gaps Card */}
            {insights.skillGaps.length > 0 && (
              <div className="glass-card p-5 border-l-2 border-l-amber-500/50">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-sm font-bold text-amber-400">Top Skill Gaps</h3>
                </div>
                <div className="space-y-2">
                  {insights.skillGaps.slice(0, 4).map((gap) => (
                    <div key={gap.skill} className="flex items-center justify-between">
                      <span className="text-sm text-white">{gap.skill}</span>
                      <span className="text-xs text-text-muted px-2 py-0.5 rounded-full bg-amber-500/10">
                        {gap.jobCount} {gap.jobCount === 1 ? "job" : "jobs"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Patterns Card */}
            {insights.successPatterns.length > 0 && (
              <div className="glass-card p-5 border-l-2 border-l-emerald-500/50">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="text-sm font-bold text-emerald-400">Your Patterns</h3>
                </div>
                <div className="space-y-2.5">
                  {insights.successPatterns.map((p) => (
                    <div key={p.label}>
                      <p className="text-xs text-text-muted">{p.label}</p>
                      <p className="text-sm text-white">{p.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Card */}
            {insights.recommendations.length > 0 && (
              <div className="glass-card p-5 border-l-2 border-l-brand-indigo/50">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-sm font-bold text-brand-light">Recommended Actions</h3>
                </div>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-text-secondary flex gap-2">
                      <span className="text-brand-light shrink-0 mt-0.5">-</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
         ROW 3: APPLICATION PIPELINE + UPCOMING
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">

        {/* ---- Application Pipeline ---- */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
              Application Pipeline
            </h2>
            <Link
              href="/dashboard/tracker"
              className="text-xs text-brand-light hover:text-white transition-colors"
            >
              View Tracker →
            </Link>
          </div>

          {stats && pipelineTotal > 0 ? (
            <>
              {/* Visual bar */}
              <div className="flex h-8 rounded-xl overflow-hidden mb-4">
                {pipelineStages.map(stage => {
                  const count = stats.pipeline[stage.key] || 0;
                  if (count === 0) return null;
                  const pct = (count / pipelineTotal) * 100;
                  return (
                    <div
                      key={stage.key}
                      className={`${stage.color} flex items-center justify-center text-xs font-bold text-white transition-all duration-500`}
                      style={{ width: `${pct}%`, minWidth: count > 0 ? "2rem" : 0 }}
                      title={`${stage.label}: ${count}`}
                    >
                      {pct > 10 ? count : ""}
                    </div>
                  );
                })}
              </div>

              {/* Stage counts row */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {pipelineStages.map(stage => {
                  const count = stats.pipeline[stage.key] || 0;
                  return (
                    <div key={stage.key} className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <span className="text-sm text-text-secondary">{stage.label}</span>
                      <span className="text-sm font-bold text-white">{count}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : stats ? (
            <div className="text-center py-8">
              <p className="text-text-muted text-sm mb-3">No applications yet</p>
              <Link
                href="/dashboard/tracker"
                className="inline-flex items-center gap-2 text-sm text-brand-light hover:text-white transition-colors"
              >
                Start tracking your first application
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="h-20 bg-space-600/30 rounded-xl animate-pulse" />
          )}
        </div>

        {/* ---- Upcoming Events ---- */}
        <div className="glass-card p-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold mb-4">
            Upcoming
          </h2>

          {stats ? (
            <>
              {stats.upcomingInterviews.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Interviews</p>
                  <div className="space-y-2">
                    {stats.upcomingInterviews.map(item => (
                      <div key={item.id} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white truncate">{item.jobTitle}</p>
                          <span className="text-xs text-amber-400 font-medium shrink-0 ml-2">
                            {formatDate(item.interviewDate)}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{item.company}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.upcomingFollowUps.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Follow-ups</p>
                  <div className="space-y-2">
                    {stats.upcomingFollowUps.map(item => (
                      <div key={item.id} className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/15">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white truncate">{item.name}</p>
                          <span className="text-xs text-teal-400 font-medium shrink-0 ml-2">
                            {formatDate(item.nextFollowUp)}
                          </span>
                        </div>
                        {item.company && (
                          <p className="text-xs text-text-muted mt-0.5">
                            {item.role ? `${item.role} at ` : ""}{item.company}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.upcomingInterviews.length === 0 && stats.upcomingFollowUps.length === 0 && (
                <div className="text-center py-6">
                  <svg className="w-8 h-8 mx-auto text-text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-text-muted">Nothing scheduled</p>
                  <p className="text-xs text-text-muted mt-1">Interviews and follow-ups will show here</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="h-14 bg-space-600/30 rounded-xl animate-pulse" />
              <div className="h-14 bg-space-600/30 rounded-xl animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
         ROW 4: RECENT ACTIVITY
         ============================================================ */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
            Recent Activity
          </h2>
          <Link
            href="/dashboard/history"
            className="text-xs text-brand-light hover:text-white transition-colors"
          >
            View All History →
          </Link>
        </div>

        {stats ? (
          stats.recentActivity.length > 0 ? (
            <div className="space-y-1">
              {stats.recentActivity.map((item) => {
                const meta = actionLabels[item.action] || {
                  label: item.action.replace(/_/g, " "),
                  color: "text-text-secondary",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                };

                return (
                  <Link
                    key={item.id}
                    href="/dashboard/history"
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-space-700/50 transition-colors group"
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-lg bg-space-700 border border-card-border flex items-center justify-center shrink-0 ${meta.color}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={meta.icon} />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${meta.color}`}>{meta.label}</span>
                      </div>
                      <p className="text-sm text-text-secondary truncate group-hover:text-white transition-colors">
                        {item.title}
                      </p>
                    </div>

                    {/* Time */}
                    <span className="text-xs text-text-muted shrink-0">
                      {timeAgo(item.createdAt)}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-10 h-10 mx-auto text-text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-text-muted mb-1">No activity yet</p>
              <p className="text-xs text-text-muted">Your AI-generated results will appear here</p>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <div className="w-9 h-9 rounded-lg bg-space-600 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-space-600 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-space-600 rounded animate-pulse" />
                </div>
                <div className="h-3 w-12 bg-space-600 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================
         ROW 5: ALL FEATURES GRID
         ============================================================ */}
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold mb-5">
        All Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {features.map((feature, i) => (
          <Link
            key={i}
            href={feature.href}
            className="glass-card p-5 sm:p-6 group hover:border-brand-indigo/30 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center ${feature.color} mb-3`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={feature.iconPath} />
              </svg>
            </div>
            <h3 className="text-base font-bold mb-1 group-hover:text-brand-light transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {feature.description}
            </p>
            <span className="inline-flex items-center gap-1 mt-3 text-xs text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">
              Open
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      {/* ---- Pro Tip ---- */}
      <div className="mt-10 glass-card p-5 sm:p-6 border-brand-indigo/15">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Pro Workflow</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Upload your resume → Search for a job → Check your match score → Optimize your resume for that job → Generate a tailored cover letter → Practice interview questions. All in one flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
