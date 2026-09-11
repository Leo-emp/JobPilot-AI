/* ============================================================
   SEO LANDING PAGE — Resume Analyzer
   ============================================================
   # Targets: "resume analyzer", "resume analysis tool",
   # "ATS resume checker", "resume score checker",
   # "analyze my resume"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Resume Analyzer — ATS Score & Detailed Feedback | JobPilot AI",
  description:
    "Upload your resume and get an instant ATS compatibility score, keyword analysis, formatting feedback, and section-by-section improvement suggestions. Free tool.",
  alternates: { canonical: "https://jobpilotai.co/tools/resume-analyzer" },
  openGraph: {
    title: "Free AI Resume Analyzer — JobPilot AI",
    description: "Get your ATS score, keyword gaps, and section-by-section improvement suggestions. Free.",
    url: "https://jobpilotai.co/tools/resume-analyzer",
  },
};

const benefits = [
  {
    title: "ATS Compatibility Score",
    desc: "Get a score out of 100 that tells you exactly how well your resume will perform in Applicant Tracking Systems. Most resumes score below 60 — see where yours stands.",
  },
  {
    title: "Keyword Gap Analysis",
    desc: "AI compares your resume against the job description and identifies missing keywords — the specific terms that ATS systems scan for and recruiters expect to see.",
  },
  {
    title: "Section-by-Section Feedback",
    desc: "Every section of your resume gets individual feedback: summary, experience, education, skills, and formatting. Know exactly which sections are strong and which need work.",
  },
  {
    title: "Formatting & Structure Check",
    desc: "AI evaluates your resume layout, section ordering, bullet point quality, and overall readability. Catches issues that make recruiters skip your resume in the first 7 seconds.",
  },
  {
    title: "Quantification Audit",
    desc: "Are your achievements backed by numbers? AI identifies bullet points that lack quantified results and suggests how to add metrics that make your impact measurable.",
  },
  {
    title: "Upload PDF or Paste Text",
    desc: "Upload a PDF resume or paste the text directly. AI extracts and analyzes the content either way — no special formatting required.",
  },
];

const faqs = [
  {
    q: "What does the ATS score mean?",
    a: "The ATS score (0-100) measures how likely your resume is to pass through Applicant Tracking Systems — the software companies use to filter resumes before a human ever sees them. Above 80 is strong, 60-80 needs improvement, below 60 is likely getting filtered out.",
  },
  {
    q: "Do I need a job description for analysis?",
    a: "It's optional but recommended. Without a JD, AI provides general resume quality feedback. With a JD, you also get keyword gap analysis and role-specific optimization suggestions — which is significantly more useful.",
  },
  {
    q: "What file formats are supported?",
    a: "Upload a PDF or TXT file, or paste your resume text directly. PDF text extraction happens in your browser — your file is not uploaded to any server.",
  },
  {
    q: "How is this different from Resume Optimizer?",
    a: "The Analyzer tells you what's wrong — it diagnoses issues and provides a score. The Optimizer actually rewrites your resume to fix those issues. Analyze first to understand the problems, then optimize to fix them.",
  },
  {
    q: "Can I analyze the same resume multiple times?",
    a: "Yes. Each analysis uses 1 AI credit. Analyze, make changes, then analyze again to see your score improve. It's the fastest way to iterate toward a high-scoring resume.",
  },
];

export default function ResumeAnalyzerToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Resume Analyzer", url: "https://jobpilotai.co/tools/resume-analyzer" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI Resume Analyzer
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          75% of resumes are rejected by ATS before a human sees them. Upload yours and get
          an instant ATS score, keyword gaps, and section-by-section improvement feedback.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Analyze My Resume Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Analysis Result Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">80</span>
                <span className="text-[9px] text-text-muted">/100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">ATS Score: Strong</p>
              <p className="text-xs text-text-secondary">Your resume is well-optimized but has 3 keyword gaps and 2 sections that need improvement.</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Section Scores</p>
            {[
              { section: "Contact & Header", score: "10/10", color: "text-emerald-400" },
              { section: "Professional Summary", score: "7/10", color: "text-amber-400" },
              { section: "Experience", score: "8/10", color: "text-emerald-400" },
              { section: "Skills & Keywords", score: "6/10", color: "text-amber-400" },
              { section: "Education", score: "9/10", color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.section} className="flex items-center justify-between p-2.5 rounded-lg bg-space-700/50">
                <span className="text-xs text-white">{s.section}</span>
                <span className={`text-xs font-bold ${s.color}`}>{s.score}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-lg font-bold text-emerald-400">12</p>
              <p className="text-[10px] text-text-muted">Keywords Found</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-lg font-bold text-amber-400">3</p>
              <p className="text-[10px] text-text-muted">Keyword Gaps</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-lg font-bold text-blue-400">8</p>
              <p className="text-[10px] text-text-muted">Suggestions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Know Exactly Where You Stand</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Stop guessing whether your resume is good enough. Get a concrete score, specific feedback, and a clear picture of what to fix — in 10 seconds.
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

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: "1", title: "Upload Your Resume", desc: "Upload a PDF, paste text, or use your saved resume. Optionally add a target job description." },
            { step: "2", title: "AI Analyzes Everything", desc: "ATS scoring, keyword analysis, section review, formatting check, and quantification audit." },
            { step: "3", title: "Get Your Report", desc: "Score out of 100, section-by-section feedback, keyword gaps, and specific improvement suggestions." },
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

      <div className="rounded-2xl border border-card-border bg-space-800/60 p-8 sm:p-10 text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Check Your Resume Score Now</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">Upload your resume. Get your ATS score and improvement roadmap in 10 seconds.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Analyze My Resume Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
