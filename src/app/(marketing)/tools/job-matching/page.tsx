/* ============================================================
   SEO LANDING PAGE — Smart Job Matching
   ============================================================
   # Targets: "job matching tool", "resume job match",
   # "AI job match score", "skills gap analysis",
   # "resume vs job description"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Smart Job Matching — AI Match Score & Skills Gap Analysis | JobPilot AI",
  description:
    "Paste a job description and your resume to get a precise AI match score. See which skills align, which are missing, and get actionable recommendations to close the gap.",
  alternates: { canonical: "https://jobpilotai.co/tools/job-matching" },
  openGraph: {
    title: "Smart Job Matching — JobPilot AI",
    description: "Get an AI match score that tells you exactly how well your resume fits any job. Free skills gap analysis.",
    url: "https://jobpilotai.co/tools/job-matching",
  },
};

/* # Key benefits of the job matching tool */
const benefits = [
  {
    title: "Match Score 0–100",
    desc: "Get a precise match percentage that tells you exactly how well your resume fits the job. Above 80 means you're a strong candidate — below 60 means you're likely wasting your time applying.",
  },
  {
    title: "Matching Skills Highlighted",
    desc: "See which skills from the job description already appear in your resume. Know exactly what to emphasize in your cover letter and interview to maximize your advantage.",
  },
  {
    title: "Skills Gap Analysis",
    desc: "Identify every skill the job requires that your resume is missing or barely mentions. Each gap comes with a severity rating — critical, important, or nice-to-have.",
  },
  {
    title: "Actionable Recommendations",
    desc: "Get specific, step-by-step suggestions to increase your match score. Add missing keywords, reframe existing experience, or highlight transferable skills you didn't realize counted.",
  },
  {
    title: "Experience Level Match",
    desc: "AI compares the seniority level in the job post against your resume's experience signals — years, leadership scope, project complexity — so you know if you're over or under-qualified.",
  },
  {
    title: "Paste or Upload",
    desc: "Paste any job description and upload your resume as PDF or text. AI cross-references both in seconds and gives you a complete compatibility report.",
  },
];

/* # Frequently asked questions */
const faqs = [
  {
    q: "What does the match score mean?",
    a: "The match score (0–100) measures how well your resume aligns with a specific job description. It considers skills overlap, experience level, keyword presence, and qualification fit. A score above 80 means you're a strong match; 60–80 means you should optimize your resume; below 60 means significant gaps exist.",
  },
  {
    q: "How is this different from Resume Analyzer?",
    a: "Resume Analyzer evaluates your resume quality in general — formatting, ATS compatibility, writing strength. Job Matching is specifically about how well your resume fits one particular job. Analyzer tells you if your resume is good; Job Matching tells you if it's right for the job you want.",
  },
  {
    q: "Can I use this to decide which jobs to apply for?",
    a: "Absolutely. That's one of the best use cases. Paste multiple job descriptions one at a time, compare your match scores, and focus your energy on the roles where you score highest. Stop wasting applications on jobs where your match is below 50%.",
  },
  {
    q: "What if my match score is low?",
    a: "Use the gap analysis and recommendations to improve. The tool tells you exactly which skills to add to your resume. Then use Resume Rebuild or Resume Optimizer to rewrite your resume for that specific role — and run Job Matching again to see your score improve.",
  },
  {
    q: "Does it work for any industry?",
    a: "Yes. The AI understands job descriptions across all industries — tech, finance, healthcare, marketing, operations, education, and more. It compares the language and requirements in the job post against your resume regardless of field.",
  },
];

export default function JobMatchingToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Smart Job Matching", url: "https://jobpilotai.co/tools/job-matching" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Smart Job Matching
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Stop guessing whether you're qualified. Paste a job description alongside your resume and
          get an instant AI match score — with a clear breakdown of what aligns, what's missing, and
          how to close the gap.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Check My Match Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Match Result Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          {/* # Score header */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="55.26" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">78</span>
                <span className="text-[9px] text-text-muted">/100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">Strong Match — Worth Applying</p>
              <p className="text-xs text-text-secondary">Your resume covers most requirements. Fill 2 skill gaps to push above 85%.</p>
            </div>
          </div>

          {/* # Skills breakdown */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Skills Breakdown</p>
            {[
              { skill: "React / TypeScript", status: "Match", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { skill: "Node.js / Express", status: "Match", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { skill: "3+ Years Experience", status: "Match", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { skill: "AWS / Cloud", status: "Weak", color: "text-amber-400", bg: "bg-amber-500/10" },
              { skill: "GraphQL", status: "Missing", color: "text-red-400", bg: "bg-red-500/10" },
              { skill: "CI/CD Pipelines", status: "Missing", color: "text-red-400", bg: "bg-red-500/10" },
            ].map((s) => (
              <div key={s.skill} className="flex items-center justify-between p-2.5 rounded-lg bg-space-700/50">
                <span className="text-xs text-white">{s.skill}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${s.bg} ${s.color}`}>{s.status}</span>
              </div>
            ))}
          </div>

          {/* # Summary stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-lg font-bold text-emerald-400">8</p>
              <p className="text-[10px] text-text-muted">Skills Match</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-lg font-bold text-amber-400">1</p>
              <p className="text-[10px] text-text-muted">Weak</p>
            </div>
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-lg font-bold text-red-400">2</p>
              <p className="text-[10px] text-text-muted">Missing</p>
            </div>
          </div>
        </div>
      </div>

      {/* # Benefits grid */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Know Your Odds Before You Apply</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Stop spray-and-praying applications. Get a concrete match score, see exactly where you stand,
          and focus your energy on roles where you actually have a shot.
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
            { step: "1", title: "Paste a Job Description", desc: "Copy the full job posting from LinkedIn, Indeed, or any job board. The more detail, the better the match." },
            { step: "2", title: "Add Your Resume", desc: "Upload a PDF, paste text, or use your saved resume. AI cross-references every requirement against your experience." },
            { step: "3", title: "Get Your Match Report", desc: "Instant match score, skill-by-skill breakdown, gap analysis, and specific recommendations to boost your score." },
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

      {/* # FAQs */}
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Check Your Match Score Now</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">Paste a job description. See your match score and skill gaps in seconds.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Check My Match Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
