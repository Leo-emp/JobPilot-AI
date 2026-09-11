/* ============================================================
   SEO LANDING PAGE — Interview Prep & Mock Interviews
   ============================================================
   # Targets: "AI interview prep", "mock interview practice",
   # "interview question predictor", "STAR method coach",
   # "AI mock interview", "practice interview questions"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Interview Prep & Mock Interviews — Practice & Ace It | JobPilot AI",
  description:
    "AI predicts the exact interview questions you'll face, coaches your answers using the STAR method, and runs live mock interviews. Walk in prepared and confident.",
  alternates: { canonical: "https://jobpilotai.co/tools/interview-prep" },
  openGraph: {
    title: "Free AI Interview Prep & Mock Interviews — JobPilot AI",
    description: "AI-predicted questions, STAR coaching, and live mock interviews. Walk in prepared.",
    url: "https://jobpilotai.co/tools/interview-prep",
  },
};

const benefits = [
  {
    title: "AI-Predicted Questions",
    desc: "Paste the job description and AI generates the exact questions the interviewer is likely to ask — behavioral, technical, and situational. No more generic lists.",
  },
  {
    title: "STAR Method Coaching",
    desc: "For every behavioral question, AI coaches you to structure your answer using the STAR framework: Situation, Task, Action, Result. Turn rambling stories into compelling answers.",
  },
  {
    title: "Live AI Mock Interviews",
    desc: "Practice with an AI interviewer that asks questions, listens to your answers, and gives real-time feedback. As close to the real thing as you can get without a human.",
  },
  {
    title: "Job-Specific Preparation",
    desc: "Questions are tailored to the specific role, company, and industry. A Product Manager mock interview looks nothing like a Data Analyst one — as it should be.",
  },
  {
    title: "Detailed Feedback",
    desc: "After each mock interview, get a breakdown of your performance: strengths, areas for improvement, specific suggestions for stronger answers, and an overall confidence rating.",
  },
  {
    title: "Practice Anywhere, Anytime",
    desc: "No scheduling, no human interviewer, no awkward role-play with friends. Practice as many times as you want, whenever you want. Each session generates fresh questions.",
  },
];

const faqs = [
  {
    q: "How accurate are the predicted interview questions?",
    a: "The AI analyzes the job description, role requirements, company context, and common industry patterns to predict questions. Users report 70-80% of predicted questions appear in some form during actual interviews.",
  },
  {
    q: "What is the STAR method?",
    a: "STAR stands for Situation (context), Task (your responsibility), Action (what you did), Result (the outcome). It's the gold standard framework for answering behavioral interview questions like 'Tell me about a time when...'",
  },
  {
    q: "How does the mock interview work?",
    a: "The AI acts as an interviewer based on the job description. It asks questions one at a time, waits for your typed response, and provides coaching after each answer. At the end, you get a comprehensive performance summary.",
  },
  {
    q: "Can I practice for technical interviews?",
    a: "Yes. For technical roles, AI generates role-specific technical questions alongside behavioral ones. For software engineering, this includes system design and coding concepts. For data roles, expect SQL and analytics scenarios.",
  },
  {
    q: "How many times can I practice?",
    a: "Each mock interview session uses 1 AI credit. Free plan includes 10 credits per month — enough for thorough preparation for 2-3 interviews. Pro plan includes unlimited credits.",
  },
];

export default function InterviewPrepToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Interview Prep", url: "https://jobpilotai.co/tools/interview-prep" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI Interview Prep & Mock Interviews
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Know exactly what they&apos;ll ask before you walk in. AI predicts questions from the job
          description, coaches your answers with STAR, and runs live mock interviews.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Start Practicing Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Mock Interview Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-card-border">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Mock Interview — Product Manager at Google</p>
              <p className="text-xs text-text-muted">Question 3 of 8</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-sm text-violet-300">Tell me about a time you had to make a product decision with incomplete data. How did you approach it?</p>
            </div>
            <div className="p-4 rounded-xl bg-space-700/50 border border-white/10">
              <p className="text-sm text-text-secondary">During the Q3 launch at Acme, we needed to decide between two feature directions with limited user research. I proposed a rapid A/B test with our beta users...</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-400 mb-2">STAR Method Feedback</p>
              <div className="grid grid-cols-4 gap-2">
                {["Situation", "Task", "Action", "Result"].map((s, i) => (
                  <div key={s} className="text-center">
                    <div className={`h-1.5 rounded-full mb-1 ${i < 3 ? "bg-emerald-500/60" : "bg-amber-500/60"}`} />
                    <p className="text-[10px] text-text-muted">{s}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-2">Strong setup and action. Add a quantified result to make this answer outstanding.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Why Practice with AI?</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          The best interviewers aren&apos;t born — they&apos;re prepared. Candidates who do mock interviews are 2x more likely to receive an offer. Practice eliminates surprises.
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
            { step: "1", title: "Paste the Job Description", desc: "AI generates predicted interview questions specific to the role, company, and industry." },
            { step: "2", title: "Practice with AI", desc: "Answer questions in a live mock interview. Get real-time STAR coaching and feedback." },
            { step: "3", title: "Review & Improve", desc: "Get a detailed performance report with strengths, gaps, and specific suggestions." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Ace Your Interview?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">Practice with AI-predicted questions and STAR coaching. Walk in confident, walk out with the offer.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Get Started Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
