/* ============================================================
   SEO LANDING PAGE — AI Resume Builder
   ============================================================
   Targets: "AI resume builder", "ATS friendly resume",
   "resume optimizer", "resume analysis tool"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "AI Resume Builder & ATS Optimizer — JobPilot AI",
  description:
    "Build ATS-friendly resumes with AI. Get instant resume analysis, keyword optimization, ATS score, and professional formatting. Free AI resume builder — no credit card required.",
  alternates: { canonical: "https://jobpilotai.co/features/resume-builder" },
  openGraph: {
    title: "AI Resume Builder & ATS Optimizer — JobPilot AI",
    description:
      "Build ATS-friendly resumes with AI. Instant analysis, keyword optimization, and professional formatting.",
    url: "https://jobpilotai.co/features/resume-builder",
  },
};

/* # Structured feature data for the benefit cards */
const benefits = [
  {
    title: "ATS Score Analysis",
    desc: "Upload your resume and get an instant ATS compatibility score. Our AI checks formatting, keywords, sections, and structure against what applicant tracking systems actually look for.",
  },
  {
    title: "Keyword Optimization",
    desc: "Paste any job description and our AI identifies missing keywords, skills, and phrases — then suggests exactly where to add them for maximum impact.",
  },
  {
    title: "AI Resume Rebuild",
    desc: "Let AI rewrite your entire resume from scratch. Keeps your real experience but restructures, rewrites bullet points with metrics, and formats for ATS compatibility.",
  },
  {
    title: "Career Pivot Reframing",
    desc: "Changing careers? Our AI reframes your existing experience to align with your target role — highlighting transferable skills and rewriting accomplishments for a new industry.",
  },
  {
    title: "Multiple Templates",
    desc: "Choose from professionally designed resume templates. Every template is ATS-optimized so your content passes automated screening before human eyes see it.",
  },
  {
    title: "Unlimited Revisions",
    desc: "Analyze and rebuild your resume as many times as you need. Pro users get 1,000 AI calls per month — enough to perfect multiple versions for different roles.",
  },
];

export default function ResumeBuilderPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Features", url: "https://jobpilotai.co/features" },
          { name: "Resume Builder", url: "https://jobpilotai.co/features/resume-builder" },
        ]}
      />

      {/* # Hero section */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">
          AI-Powered Resume Tool
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Build an ATS-Friendly Resume in Minutes
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Most resumes get rejected by ATS software before a human ever reads them.
          JobPilot AI analyzes, optimizes, and rebuilds your resume so it passes
          automated screening and lands on the recruiter&apos;s desk.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Build Your Resume Free
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
          How the AI Resume Builder Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Upload Your Resume", desc: "Upload a PDF or paste your resume text. Our AI reads every section." },
            { step: "2", title: "Get AI Analysis", desc: "Receive an ATS score, keyword gaps, formatting issues, and content feedback in seconds." },
            { step: "3", title: "Optimize & Download", desc: "Apply AI suggestions or let it rebuild your resume entirely. Download the polished result." },
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

      {/* # Benefits grid */}
      <div className="mb-16">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-center mb-10 glow-text">
          Why Job Seekers Choose JobPilot AI
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

      {/* # SEO content block */}
      <div className="glass-card p-8 sm:p-10 mb-16">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4 glow-text">
          What Makes a Resume ATS-Friendly?
        </h2>
        <div className="text-text-secondary leading-relaxed space-y-4">
          <p>
            Applicant Tracking Systems (ATS) are software used by over 97% of Fortune 500
            companies and most mid-size employers to filter resumes before they reach a human
            recruiter. An ATS-friendly resume uses clean formatting, standard section headings,
            and relevant keywords from the job description.
          </p>
          <p>
            Common reasons resumes fail ATS screening include: using tables or columns that
            confuse parsers, missing critical keywords, creative section headings the software
            doesn&apos;t recognize, and file formats the system can&apos;t read. JobPilot AI
            checks for all of these issues and shows you exactly how to fix them.
          </p>
          <p>
            Our AI doesn&apos;t just format your resume — it rewrites bullet points with
            quantified achievements, identifies skill gaps for your target role, and ensures
            every section follows the structure that both ATS software and human recruiters
            prefer.
          </p>
        </div>
      </div>

      {/* # Final CTA */}
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4 glow-text">
          Ready to Beat the ATS?
        </h2>
        <p className="text-text-secondary mb-6">
          Join thousands of job seekers who&apos;ve improved their resume with AI. Free to start, no credit card required.
        </p>
        <Link href="/signup" className="btn-primary text-base px-8 py-3">
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
