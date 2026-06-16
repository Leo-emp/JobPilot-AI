/* ============================================================
   SEO LANDING PAGE — AI Interview Preparation
   ============================================================
   Targets: "AI interview prep", "interview questions",
   "mock interview AI", "interview coaching"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "AI Interview Prep & Mock Interviews — JobPilot AI",
  description:
    "Prepare for job interviews with AI-predicted questions, answer coaching, and live mock interviews. Practice with AI before the real thing. Free interview prep tool.",
  alternates: { canonical: "https://jobpilotai.co/features/interview-prep" },
  openGraph: {
    title: "AI Interview Prep & Mock Interviews — JobPilot AI",
    description:
      "AI-predicted questions, answer coaching, and live mock interviews. Practice before the real thing.",
    url: "https://jobpilotai.co/features/interview-prep",
  },
};

const benefits = [
  {
    title: "AI Question Prediction",
    desc: "Paste any job description and our AI predicts the most likely interview questions — including technical, behavioral, and situational questions specific to that role.",
  },
  {
    title: "Answer Coaching",
    desc: "Get AI-generated answer frameworks using the STAR method. Each suggested answer references your actual experience from your resume, so you sound authentic and prepared.",
  },
  {
    title: "Live Mock Interviews",
    desc: "Practice with our AI interviewer in real-time. It asks questions, listens to your answers, and provides instant feedback on content, structure, and delivery.",
  },
  {
    title: "Role-Specific Prep",
    desc: "Whether you're interviewing for software engineering, marketing, sales, finance, or management — the AI tailors questions and coaching to your specific field.",
  },
  {
    title: "Confidence Scoring",
    desc: "After each mock interview session, receive a readiness score with specific areas to improve. Track your progress as you practice and watch your scores improve.",
  },
  {
    title: "Common Questions Library",
    desc: "Access frequently asked interview questions by role, company type, and experience level. Each comes with AI-generated answer templates you can personalize.",
  },
];

export default function InterviewPrepPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Features", url: "https://jobpilotai.co/features" },
          { name: "Interview Prep", url: "https://jobpilotai.co/features/interview-prep" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">
          AI Interview Coaching
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Walk Into Every Interview Prepared
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Stop guessing what they&apos;ll ask. JobPilot AI predicts interview questions
          from the job description, coaches you on answers using your real experience,
          and lets you practice with a live AI mock interviewer.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Start Interview Prep
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
          How AI Interview Prep Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Add the Job Details", desc: "Paste the job description. The AI analyzes required skills, seniority level, and company context." },
            { step: "2", title: "Get Predicted Questions", desc: "Receive 10-15 likely interview questions with STAR-method answer frameworks tailored to your resume." },
            { step: "3", title: "Practice with AI", desc: "Start a live mock interview. The AI asks questions, you answer, and get instant feedback on each response." },
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
          Everything You Need to Ace the Interview
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
          Why Interview Preparation Matters
        </h2>
        <div className="text-text-secondary leading-relaxed space-y-4">
          <p>
            Studies consistently show that candidates who prepare for interviews
            are 2-3x more likely to receive an offer. Yet most people wing it —
            reading the job description once and hoping for the best. The difference
            between prepared and unprepared candidates is obvious within the first
            five minutes of an interview.
          </p>
          <p>
            Traditional interview prep means Googling &ldquo;common interview questions&rdquo;
            and rehearsing generic answers. But every job is different. A product
            manager interview at a startup looks nothing like one at a Fortune 500.
            AI interview prep analyzes the specific role, company, and your background
            to generate questions you&apos;ll actually face.
          </p>
          <p>
            Mock interviews take preparation to the next level. Practicing out loud —
            even with an AI — builds muscle memory, reduces anxiety, and helps you
            structure clear, concise answers under pressure. JobPilot AI&apos;s mock
            interviewer provides the repetitions you need to walk in confident.
          </p>
        </div>
      </div>

      {/* # CTA */}
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4 glow-text">
          Don&apos;t Leave Your Next Interview to Chance
        </h2>
        <p className="text-text-secondary mb-6">
          AI-powered prep that&apos;s tailored to the actual job. Free to start — practice as much as you need.
        </p>
        <Link href="/signup" className="btn-primary text-base px-8 py-3">
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
