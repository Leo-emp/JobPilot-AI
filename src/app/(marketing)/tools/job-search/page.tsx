/* ============================================================
   SEO LANDING PAGE — AI Job Board & Search
   ============================================================
   # Targets: "AI job search", "job board with match score",
   # "AI job matching", "find jobs that match my resume",
   # "smart job search tool"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "AI Job Board — Smart Job Search with Match Scores | JobPilot AI",
  description:
    "Search jobs with AI match scores that tell you how well each role fits your profile. Filter by location, salary, and remote options. Save jobs with one click.",
  alternates: { canonical: "https://jobpilotai.co/tools/job-search" },
  openGraph: {
    title: "AI Job Board — Smart Job Search | JobPilot AI",
    description: "Search jobs with AI match scores. Know which roles fit you best before applying.",
    url: "https://jobpilotai.co/tools/job-search",
  },
};

const benefits = [
  {
    title: "AI Match Scores",
    desc: "Every job listing gets a match score based on your resume and preferences. Know instantly which roles are worth pursuing — stop wasting time on bad fits.",
  },
  {
    title: "Search Across Multiple Boards",
    desc: "Browse opportunities aggregated from multiple job sources in one place. No more opening 10 tabs on different job boards and searching the same keywords.",
  },
  {
    title: "Smart Filters",
    desc: "Filter by location, salary range, remote/hybrid/on-site, experience level, and more. Find exactly what you're looking for without scrolling through irrelevant listings.",
  },
  {
    title: "One-Click Save",
    desc: "Found something interesting? Save it to your application tracker with one click. Build a curated list of target roles and apply when you're ready.",
  },
  {
    title: "Apply Faster",
    desc: "When you find the right job, generate a tailored cover letter and optimize your resume for that specific role — all from the same platform.",
  },
  {
    title: "Free Access",
    desc: "Browse and search jobs for free. AI match scores are included with every plan. Save unlimited bookmarks and track all your applications.",
  },
];

const faqs = [
  {
    q: "How does the AI match score work?",
    a: "The AI compares the job description against your resume, skills, and preferences. It evaluates keyword alignment, experience level match, skill requirements, and role compatibility to generate a percentage score. Higher scores mean better fit.",
  },
  {
    q: "Where do the job listings come from?",
    a: "We aggregate listings from multiple job boards and company career pages to give you broad coverage in one search. New listings are updated regularly so you're always seeing fresh opportunities.",
  },
  {
    q: "Can I search for remote jobs?",
    a: "Yes. Use the work arrangement filter to find remote-only, hybrid, or on-site positions. You can also filter by location, salary range, and experience level to narrow your search.",
  },
  {
    q: "How do I apply to a job I find?",
    a: "Click on any listing to see the full details and apply through the company's application page. Before applying, use our Resume Builder to optimize your resume and Cover Letter Generator to create a tailored letter for that specific role.",
  },
  {
    q: "Can I save jobs to apply later?",
    a: "Yes. Bookmark any job with one click, and it's saved to your dashboard. You can also add it directly to your Application Tracker to monitor your progress through the hiring process.",
  },
];

export default function JobSearchToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "AI Job Board", url: "https://jobpilotai.co/tools/job-search" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI-Powered Job Board
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Stop scrolling through hundreds of irrelevant listings. AI match scores tell you
          exactly which jobs fit your profile — so you only apply where it matters.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Start Searching Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">
            Already have an account?
          </Link>
        </div>
      </div>

      {/* # Example Job Listings Preview */}
      <div className="mb-20 max-w-2xl mx-auto space-y-4">
        {[
          { role: "Senior Product Manager", company: "Google", location: "Remote", salary: "$180k-$220k", match: 94, color: "emerald" },
          { role: "Product Designer", company: "Spotify", location: "New York, NY", salary: "$140k-$170k", match: 87, color: "emerald" },
          { role: "Data Analyst", company: "Stripe", location: "San Francisco, CA", salary: "$120k-$150k", match: 72, color: "amber" },
        ].map((j) => (
          <div key={j.role} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-white">{j.company[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white">{j.role}</h3>
              <p className="text-sm text-text-muted">{j.company} &middot; {j.location} &middot; {j.salary}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold shrink-0 ${j.color === "emerald" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
              {j.match}% Match
            </div>
          </div>
        ))}
        <div className="text-center">
          <p className="text-xs text-text-muted">AI match scores based on your resume and preferences</p>
        </div>
      </div>

      {/* # Benefits */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Search Smarter, Not Harder</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          The average job search takes 5 months. The difference between finding a role in 5 weeks vs 5 months is how efficiently you target the right opportunities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="glass-card p-6 hover:border-brand-indigo/30 transition-colors">
              <h3 className="text-base font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # How It Works */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: "1", title: "Search & Filter", desc: "Enter keywords, location, and filters. Browse curated listings from multiple sources." },
            { step: "2", title: "See AI Match Scores", desc: "Each listing shows how well it matches your profile. Focus on high-match opportunities." },
            { step: "3", title: "Save & Apply", desc: "Bookmark jobs, add them to your tracker, and use AI tools to tailor your application." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-brand-light font-bold text-lg">{s.step}</span>
              </div>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # FAQ */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card p-6">
              <h3 className="font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # Bottom CTA */}
      <div className="rounded-2xl border border-card-border bg-space-800/60 p-8 sm:p-10 text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Find Your Next Role?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">
          Search jobs with AI match scores. Know which roles fit before you apply.
        </p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Get Started Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
