/* ============================================================
   DASHBOARD HOME - Main Overview Page
   ============================================================
   The first page users see after logging in.
   Shows welcome message, quick stats, and shortcuts to features.
   ============================================================ */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Onboarding from "@/components/Onboarding";

export default async function DashboardPage() {
  /* Get the current user's session */
  const session = await auth();
  const userId = session?.user?.id;

  /* Fetch stats from the database */
  const [resumeCount, jobCount, applicationCount, coverLetterCount] =
    await Promise.all([
      prisma.resume.count({ where: { userId: userId || "" } }),
      prisma.savedJob.count({ where: { userId: userId || "" } }),
      prisma.application.count({ where: { userId: userId || "" } }),
      prisma.coverLetter.count({ where: { userId: userId || "" } }),
    ]);

  /* Stat cards data */
  const stats = [
    { label: "Resumes Analyzed", value: resumeCount, icon: "📄" },
    { label: "Jobs Saved", value: jobCount, icon: "🔍" },
    { label: "Applications", value: applicationCount, icon: "📊" },
    { label: "Cover Letters", value: coverLetterCount, icon: "✉️" },
  ];

  /* Quick action cards */
  const actions = [
    {
      href: "/dashboard/resume",
      icon: "📄",
      title: "Resume Intelligence",
      description: "Upload and optimize your resume with AI",
    },
    {
      href: "/dashboard/jobs",
      icon: "🔍",
      title: "Job Search & Match",
      description: "Find jobs and check your match score",
    },
    {
      href: "/dashboard/cover-letter",
      icon: "✉️",
      title: "Cover Letter",
      description: "Generate tailored cover letters instantly",
    },
    {
      href: "/dashboard/interview",
      icon: "🎤",
      title: "Interview Prep",
      description: "Predict questions and practice answers",
    },
  ];

  const hasActivity = resumeCount + jobCount + applicationCount + coverLetterCount > 0;

  return (
    <div>
      {/* ---- Onboarding for new users ---- */}
      <Onboarding hasActivity={hasActivity} />

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
      {/* Shows key metrics in glassmorphism cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-5 sm:p-6">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">
              {stat.value}
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
          <Link key={i} href={action.href} className="glass-card p-6 sm:p-8 group">
            <div className="text-3xl mb-4">{action.icon}</div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-brand-light transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-text-secondary">
              {action.description}
            </p>
            <span className="inline-block mt-4 text-sm text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">
              Open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
