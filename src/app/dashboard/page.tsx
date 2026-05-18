/* ============================================================
   DASHBOARD HOME - Main Overview Page
   ============================================================
   The first page users see after logging in.
   Shows welcome message, quick stats, and shortcuts to features.
   Client component — renders instantly, fetches stats via API.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Onboarding from "@/components/Onboarding";

/* ---- Stats type from the API ---- */
interface DashboardStats {
  resumeCount: number;
  jobCount: number;
  applicationCount: number;
  coverLetterCount: number;
}

/* Quick action cards — static data, no fetching needed */
const actions = [
  {
    href: "/dashboard/resume",
    title: "Resume Intelligence",
    description: "Upload and optimize your resume with AI",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    href: "/dashboard/jobs",
    title: "Job Search & Match",
    description: "Find jobs and check your match score",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  },
  {
    href: "/dashboard/cover-letter",
    title: "Cover Letter",
    description: "Generate tailored cover letters instantly",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  },
  {
    href: "/dashboard/interview",
    title: "Interview Prep",
    description: "Predict questions and practice answers",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  /* # Fetch dashboard stats from API (non-blocking) */
  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setStats(data); })
      .catch(() => {});
  }, []);

  const resumeCount = stats?.resumeCount ?? 0;
  const jobCount = stats?.jobCount ?? 0;
  const applicationCount = stats?.applicationCount ?? 0;
  const coverLetterCount = stats?.coverLetterCount ?? 0;
  const hasActivity = resumeCount + jobCount + applicationCount + coverLetterCount > 0;

  /* Stat cards data */
  const statCards = [
    { label: "Resumes Analyzed", value: resumeCount, color: "text-blue-400" },
    { label: "Jobs Saved", value: jobCount, color: "text-sky-400" },
    { label: "Applications", value: applicationCount, color: "text-emerald-400" },
    { label: "Cover Letters", value: coverLetterCount, color: "text-amber-400" },
  ];

  return (
    <div>
      {/* ---- Onboarding for new users (wait for stats before deciding) ---- */}
      {stats !== null && <Onboarding hasActivity={hasActivity} />}

      {/* ---- Welcome Header ---- */}
      <div className="mb-10">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold mb-2">
          Welcome back,{" "}
          <span className="glow-text">
            {session?.user?.name?.split(" ")[0] || "there"}
          </span>
        </h1>
        <p className="text-text-secondary text-lg">
          Here&apos;s your career dashboard overview.
        </p>
      </div>

      {/* ---- Stats Grid ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card p-5 sm:p-6">
            <div className={`text-2xl sm:text-3xl font-bold mb-1 ${stat.color} ${!stats ? "animate-pulse" : ""}`}>
              {stats ? stat.value : <span className="inline-block h-8 w-12 bg-space-600 rounded-lg" />}
            </div>
            <div className="text-sm text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ---- Quick Actions Grid ---- */}
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {actions.map((action, i) => (
          <Link key={i} href={action.href} className="glass-card p-6 sm:p-8 group hover:border-brand-indigo/30 transition-all">
            <div className={`w-11 h-11 rounded-xl ${action.bg} border ${action.border} flex items-center justify-center ${action.color} mb-4`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                {action.icon}
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-brand-light transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-text-secondary">
              {action.description}
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">
              Open
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
