/* ============================================================
   SEO LANDING PAGE — Features Overview
   ============================================================
   Hub page linking to all individual feature pages.
   Targets: "JobPilot AI features", "AI career tools",
   "job search tools", "AI job application tools"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Features — AI Career Tools for Job Seekers | JobPilot AI",
  description:
    "Every tool you need to land your dream job. AI resume builder, cover letter generator, interview prep, portfolio builder, application tracker, and more — all in one platform.",
  alternates: { canonical: "https://jobpilotai.co/features" },
  openGraph: {
    title: "Features — JobPilot AI",
    description:
      "AI resume builder, cover letter generator, interview prep, portfolio builder, and application tracker — all in one platform.",
    url: "https://jobpilotai.co/features",
  },
};

const features = [
  {
    title: "AI Resume Builder",
    desc: "Get an instant ATS score, keyword optimization, and AI-powered resume rebuilds. Beat applicant tracking systems and land more interviews.",
    href: "/features/resume-builder",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Cover Letter Generator",
    desc: "AI writes personalized cover letters that match your resume to each job description. Unique, compelling, and tailored every time.",
    href: "/features/cover-letter-generator",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: "Interview Prep & Mock Interviews",
    desc: "AI-predicted interview questions, STAR-method answer coaching, and live AI mock interviews to build confidence before the real thing.",
    href: "/features/interview-prep",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "Portfolio Builder",
    desc: "Create a professional portfolio with a shareable public link. Showcase projects, skills, and achievements — no coding required.",
    href: "/features/portfolio-builder",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: "Application Tracker",
    desc: "Track every job application in one place. Save jobs with one click, get AI match scores, and manage your entire job search pipeline.",
    href: "/features/application-tracker",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    title: "LinkedIn Optimizer",
    desc: "AI audits your LinkedIn profile, rewrites your headline and summary, and creates a content strategy to boost visibility with recruiters.",
    href: "/signup",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Features", url: "https://jobpilotai.co/features" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-16">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Every Career Tool, One Platform
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto">
          From resume building to interview prep, portfolio creation to application
          tracking — JobPilot AI is the all-in-one AI career platform built to help
          you land your dream job faster.
        </p>
      </div>

      {/* # Feature cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="glass-card p-6 group hover:border-brand-indigo/40 transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-brand-indigo/10 text-brand-light w-fit mb-4 group-hover:bg-brand-indigo/20 transition-colors">
              {f.icon}
            </div>
            <h2 className="text-white font-bold text-lg mb-2 group-hover:text-brand-light transition-colors">
              {f.title}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* # CTA */}
      <div className="text-center glass-card p-10">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4 glow-text">
          Start Your Job Search the Smart Way
        </h2>
        <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
          All features included in the free plan — 20 AI calls per month, no credit
          card required. Upgrade to Pro for 1,000 AI calls and priority support.
        </p>
        <Link href="/signup" className="btn-primary text-base px-8 py-3">
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
