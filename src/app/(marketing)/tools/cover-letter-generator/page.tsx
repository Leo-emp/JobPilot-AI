/* ============================================================
   SEO LANDING PAGE — AI Cover Letter Generator
   ============================================================
   # Targets: "cover letter generator", "AI cover letter",
   # "cover letter writer", "personalized cover letter",
   # "cover letter for job application"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Cover Letter Generator — Personalized & Job-Matched | JobPilot AI",
  description:
    "Generate personalized cover letters matched to any job description in seconds. AI writes unique, compelling letters that highlight your strongest qualifications. Free.",
  alternates: { canonical: "https://jobpilotai.co/tools/cover-letter-generator" },
  openGraph: {
    title: "Free AI Cover Letter Generator — JobPilot AI",
    description: "AI writes personalized cover letters matched to each job description. Unique, compelling, and free.",
    url: "https://jobpilotai.co/tools/cover-letter-generator",
  },
};

const benefits = [
  {
    title: "Job-Matched Every Time",
    desc: "AI reads the job description and writes a cover letter that directly addresses what the employer is looking for. Every letter is unique — never a template fill-in-the-blank.",
  },
  {
    title: "Highlights Your Best Fit",
    desc: "AI analyzes your resume against the job requirements and leads with your most relevant experience. It knows which skills to emphasize and which to save for the interview.",
  },
  {
    title: "Professional Tone",
    desc: "Every letter strikes the right balance — confident but not arrogant, enthusiastic but not desperate. Reads like it was written by a professional career coach.",
  },
  {
    title: "Multiple Styles",
    desc: "Choose the tone that fits: formal for corporate roles, conversational for startups, or technical for engineering positions. The AI adapts its voice accordingly.",
  },
  {
    title: "Edit Before Sending",
    desc: "Every generated letter is fully editable. Add personal touches, adjust phrasing, or tweak details — then download as a PDF or Word document.",
  },
  {
    title: "Instant & Free",
    desc: "No more staring at a blank page. Get a polished, personalized cover letter in under 15 seconds — ready to customize and send.",
  },
];

const faqs = [
  {
    q: "Should I still include a cover letter in 2026?",
    a: "Yes. While not every company requires one, 83% of hiring managers say a strong cover letter can convince them to interview a candidate whose resume alone wouldn't have stood out. It's your chance to tell a story that a resume can't.",
  },
  {
    q: "How personalized are the AI-generated letters?",
    a: "Very. The AI reads both your resume and the job description, then writes a letter that connects YOUR specific experience to THEIR specific requirements. No two letters are the same, even for similar roles.",
  },
  {
    q: "Will hiring managers know it's AI-generated?",
    a: "Not if you add your personal touch. The AI creates a strong foundation — you should review it, add any specific anecdotes or details only you would know, and make it sound like you. That's why we make every letter fully editable.",
  },
  {
    q: "How long should a cover letter be?",
    a: "3-4 paragraphs, ideally fitting on one page (250-400 words). Our AI targets this sweet spot automatically. Long enough to make your case, short enough that it actually gets read.",
  },
  {
    q: "What if I don't have a resume yet?",
    a: "You can still use the cover letter generator by manually entering your experience and the job description. But for best results, build your resume first with our AI Resume Builder — the cover letter generator pulls from it automatically.",
  },
];

export default function CoverLetterGeneratorToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Cover Letter Generator", url: "https://jobpilotai.co/tools/cover-letter-generator" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI Cover Letter Generator
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Stop writing generic cover letters. AI reads the job description and your resume,
          then writes a personalized letter that highlights exactly why you&apos;re the right fit.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Generate a Cover Letter Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">
            Already have an account?
          </Link>
        </div>
      </div>

      {/* # Example Letter Preview */}
      <div className="mb-20">
        <div className="glass-card p-8 sm:p-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-card-border">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs font-semibold text-emerald-400">92% Match</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Product Manager — Google</p>
              <p className="text-xs text-text-muted">Generated from resume + job description</p>
            </div>
          </div>
          <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
            <p>Dear Hiring Manager,</p>
            <p>
              I&apos;m excited to apply for the Product Manager role at Google. With 6 years of experience
              leading cross-functional product teams and a track record of shipping features used by
              millions, I bring the exact blend of technical depth and strategic thinking this role demands.
            </p>
            <p>
              At Acme Corp, I led the mobile platform from zero to 2M active users in 18 months —
              defining the roadmap, prioritizing features through data-driven frameworks, and
              collaborating daily with engineering, design, and marketing teams...
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">Generated by JobPilot AI in 12 seconds</p>
          </div>
        </div>
      </div>

      {/* # Benefits */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Why Use an AI Cover Letter Generator?</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          The average job seeker spends 45 minutes writing a cover letter. Most hiring managers spend 30 seconds reading it. Make those 30 seconds count — without spending 45 minutes.
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
            { step: "1", title: "Paste the Job Description", desc: "Copy the job posting and paste it in. Upload your resume or enter details manually." },
            { step: "2", title: "AI Writes Your Letter", desc: "AI matches your experience to the job requirements and writes a personalized letter." },
            { step: "3", title: "Edit & Download", desc: "Review, add personal touches, and download as PDF or Word. Ready to send." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Write a Better Cover Letter?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">
          Generate a personalized, job-matched cover letter in under 15 seconds. Edit it, download it, send it.
        </p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Get Started Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
