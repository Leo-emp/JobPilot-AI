/* ============================================================
   SEO LANDING PAGE — AI Cover Letter Generator
   ============================================================
   Targets: "AI cover letter generator", "cover letter writer",
   "cover letter for job application", "custom cover letter"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "AI Cover Letter Generator — Tailored to Every Job | JobPilot AI",
  description:
    "Generate personalized cover letters in seconds. AI matches your resume to the job description and writes a compelling, unique cover letter every time. Free to try.",
  alternates: { canonical: "https://jobpilotai.co/features/cover-letter-generator" },
  openGraph: {
    title: "AI Cover Letter Generator — JobPilot AI",
    description:
      "Generate personalized cover letters tailored to every job description. AI-powered, unique every time.",
    url: "https://jobpilotai.co/features/cover-letter-generator",
  },
};

const benefits = [
  {
    title: "Tailored to Every Job",
    desc: "Paste any job description and your resume. The AI cross-references both to highlight your most relevant experience, skills, and achievements for that specific role.",
  },
  {
    title: "Unique Every Time",
    desc: "No templates or fill-in-the-blank forms. Each cover letter is generated fresh by AI, with natural language that sounds like you — not a robot.",
  },
  {
    title: "Keyword Alignment",
    desc: "The AI pulls key requirements from the job description and weaves them naturally into your cover letter, improving your chances of passing initial screening.",
  },
  {
    title: "Multiple Tones",
    desc: "Whether you need a formal corporate letter or a conversational startup pitch, the AI adapts its tone to match the company culture and role level.",
  },
  {
    title: "Instant Generation",
    desc: "Stop spending 45 minutes per cover letter. Get a polished, job-specific cover letter in under 15 seconds — then edit to add your personal touch.",
  },
  {
    title: "Save & Reuse",
    desc: "Every generated cover letter is saved to your account. Revisit, edit, or use them as inspiration for future applications. Export anytime.",
  },
];

export default function CoverLetterPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Features", url: "https://jobpilotai.co/features" },
          { name: "Cover Letter Generator", url: "https://jobpilotai.co/features/cover-letter-generator" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">
          AI Cover Letter Writer
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Cover Letters That Actually Get Read
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Generic cover letters go straight to the trash. JobPilot AI writes
          personalized, compelling cover letters that match your experience to the
          exact requirements of each job — in seconds, not hours.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Generate Your Cover Letter
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
          Three Steps to a Perfect Cover Letter
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Paste the Job Description", desc: "Copy the job listing you want to apply for. The AI extracts key requirements, skills, and culture signals." },
            { step: "2", title: "Add Your Resume", desc: "Upload or paste your resume. The AI identifies your strongest matches for this specific role." },
            { step: "3", title: "Get Your Cover Letter", desc: "Receive a polished, personalized cover letter in seconds. Edit if you want, then copy or download." },
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
          Why Use an AI Cover Letter Generator?
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
          Do Cover Letters Still Matter in 2026?
        </h2>
        <div className="text-text-secondary leading-relaxed space-y-4">
          <p>
            Yes. While some job boards have made cover letters optional, hiring managers
            report that a strong cover letter significantly increases interview chances —
            especially for competitive roles. A cover letter is your chance to explain
            why you want THIS job at THIS company, something a resume alone can&apos;t do.
          </p>
          <p>
            The problem is that writing a good cover letter takes time. The average job
            seeker spends 30-60 minutes per letter, which adds up quickly when applying
            to dozens of positions. AI cover letter generators solve this by creating a
            tailored first draft in seconds — you just add the personal touch.
          </p>
          <p>
            JobPilot AI goes beyond generic templates. It reads both your resume and the
            job description, identifies the strongest alignment points, and writes a
            letter that connects your specific achievements to the role&apos;s requirements.
            Every letter is unique — no two outputs are the same.
          </p>
        </div>
      </div>

      {/* # CTA */}
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4 glow-text">
          Stop Writing Cover Letters From Scratch
        </h2>
        <p className="text-text-secondary mb-6">
          Let AI handle the heavy lifting. Personalized cover letters in seconds — free to start.
        </p>
        <Link href="/signup" className="btn-primary text-base px-8 py-3">
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
