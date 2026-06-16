/* ============================================================
   SEO LANDING PAGE — Job Application Tracker
   ============================================================
   Targets: "job application tracker", "application tracking",
   "job search organizer", "job tracker tool"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Job Application Tracker — Organize Your Job Search | JobPilot AI",
  description:
    "Track every job application in one place. Save jobs, monitor status, get AI match scores, and manage your entire job search pipeline. Free application tracker.",
  alternates: { canonical: "https://jobpilotai.co/features/application-tracker" },
  openGraph: {
    title: "Job Application Tracker — JobPilot AI",
    description:
      "Track every job application in one place. Save, monitor, and manage your entire job search pipeline.",
    url: "https://jobpilotai.co/features/application-tracker",
  },
};

const benefits = [
  {
    title: "Kanban Board View",
    desc: "See all your applications at a glance with a visual pipeline. Drag jobs between stages — Saved, Applied, Interview, Offer, Rejected — to keep everything organized.",
  },
  {
    title: "AI Match Scoring",
    desc: "Every saved job gets an AI-generated match score based on your resume and skills. Focus your energy on roles where you're the strongest fit.",
  },
  {
    title: "Chrome Extension",
    desc: "Save jobs from LinkedIn, Indeed, Glassdoor, and 40+ job boards with one click using our Chrome extension. Job details are automatically extracted and organized.",
  },
  {
    title: "Skill Gap Analysis",
    desc: "For each saved job, see which required skills you have and which you're missing. Use this to prioritize upskilling or tailor your resume for specific roles.",
  },
  {
    title: "Application Timeline",
    desc: "Track when you applied, when you heard back, and how long each stage took. Identify patterns in your job search and optimize your approach.",
  },
  {
    title: "Networking CRM",
    desc: "Keep track of contacts, referrals, and follow-ups alongside your applications. Link people to specific jobs and never forget to follow up.",
  },
];

export default function ApplicationTrackerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Features", url: "https://jobpilotai.co/features" },
          { name: "Application Tracker", url: "https://jobpilotai.co/features/application-tracker" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">
          Job Search Organizer
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Never Lose Track of an Application Again
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Spreadsheets aren&apos;t built for job searching. JobPilot AI gives you a
          purpose-built application tracker with AI match scores, status management,
          and a Chrome extension to save jobs with one click.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Start Tracking Applications
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 text-base font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* # How it works */}
      <div className="mb-16">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-center mb-10 glow-text">
          How the Application Tracker Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Save Jobs", desc: "Use the Chrome extension to save jobs from any job board, or add them manually. Details are extracted automatically." },
            { step: "2", title: "Get AI Insights", desc: "Each job is scored for how well it matches your profile. See skill gaps and get tailored resume suggestions." },
            { step: "3", title: "Track Progress", desc: "Move applications through stages as you progress. Filter, sort, and analyze your pipeline at a glance." },
          ].map((s) => (
            <div key={s.step} className="glass-card p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/20 text-brand-light font-bold flex items-center justify-center mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="text-white font-bold mb-2">{s.title}</h3>
              <p className="text-text-secondary text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # Benefits */}
      <div className="mb-16">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-center mb-10 glow-text">
          A Smarter Way to Search for Jobs
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="glass-card p-6">
              <h3 className="text-white font-bold mb-2">{b.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # SEO content */}
      <div className="glass-card p-8 sm:p-10 mb-16">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4 glow-text">
          Why You Need a Dedicated Job Application Tracker
        </h2>
        <div className="text-text-secondary leading-relaxed space-y-4">
          <p>
            The average job seeker applies to 100-200 positions during a search.
            Without a proper tracking system, it&apos;s easy to lose track of where
            you applied, miss follow-up deadlines, or accidentally apply to the
            same company twice. A dedicated tracker keeps your entire search organized
            and actionable.
          </p>
          <p>
            Most people start with a spreadsheet, but spreadsheets lack context.
            They can&apos;t score job matches, suggest resume improvements, or remind
            you to follow up. JobPilot AI combines tracking with intelligence —
            each saved job is automatically analyzed against your profile.
          </p>
          <p>
            The Chrome extension makes saving jobs effortless. Instead of copying
            and pasting job titles, companies, and URLs into a spreadsheet, just
            click the extension icon on any job listing. The details are extracted
            and added to your tracker instantly.
          </p>
        </div>
      </div>

      {/* # CTA */}
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4 glow-text">
          Take Control of Your Job Search
        </h2>
        <p className="text-text-secondary mb-6">
          Track applications, get AI insights, and land interviews faster. Free to start.
        </p>
        <Link href="/signup" className="btn-primary text-base px-8 py-3">
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
