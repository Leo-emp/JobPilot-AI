/* ============================================================
   SEO LANDING PAGE — AI Mock Interview
   ============================================================
   # Targets: "AI mock interview", "practice interview online",
   # "mock interview simulator", "interview practice tool",
   # "AI interview practice"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Mock Interview — Practice with Real-Time Feedback | JobPilot AI",
  description:
    "Practice interviews with an AI interviewer that adapts to the job description. Get real-time STAR coaching, detailed feedback, and confidence scores. Unlimited practice.",
  alternates: { canonical: "https://jobpilotai.co/tools/mock-interview" },
  openGraph: {
    title: "Free AI Mock Interview — JobPilot AI",
    description: "Practice with an AI interviewer. Real-time STAR coaching, role-specific questions, detailed feedback.",
    url: "https://jobpilotai.co/tools/mock-interview",
  },
};

const benefits = [
  {
    title: "Live Conversational Interview",
    desc: "The AI asks questions one at a time, waits for your response, and follows up — just like a real interviewer. It adapts based on your answers, not a fixed script.",
  },
  {
    title: "Role-Specific Questions",
    desc: "Paste any job description and the AI generates questions specific to that role, company, and industry. A PM mock interview is completely different from an engineering one.",
  },
  {
    title: "Real-Time STAR Coaching",
    desc: "After each answer, get instant feedback on your STAR structure — did you set up the Situation, clarify the Task, describe your Action, and quantify the Result?",
  },
  {
    title: "Detailed Performance Report",
    desc: "At the end of each session, get a comprehensive breakdown: strengths, areas to improve, specific answer suggestions, and an overall confidence rating.",
  },
  {
    title: "Behavioral + Technical",
    desc: "For technical roles, the AI mixes behavioral questions with role-specific technical ones — system design for engineers, case studies for consultants, analytics for data roles.",
  },
  {
    title: "Practice Unlimited Times",
    desc: "Each session generates fresh questions. Practice the same role multiple times with different questions, or switch roles entirely. Build confidence through repetition.",
  },
];

const faqs = [
  {
    q: "How does the mock interview work?",
    a: "Paste a job description, and the AI generates 6-10 interview questions specific to that role. It asks one question at a time, you type your answer, and it provides STAR coaching after each response. At the end, you get a detailed performance report.",
  },
  {
    q: "Is this different from the Interview Prep tool?",
    a: "Yes. Interview Prep generates predicted questions and coaching tips you can study. Mock Interview is a live, interactive practice session where you actually answer questions and get real-time feedback. Think of Prep as studying and Mock as practicing.",
  },
  {
    q: "Can I practice for specific companies?",
    a: "Yes. Paste the actual job description from the company, and the AI tailors questions to that specific role and company context. The more specific the JD, the more targeted the questions.",
  },
  {
    q: "How many questions per session?",
    a: "Each mock interview session includes 6-10 questions, depending on the role complexity. A typical session takes 20-30 minutes. You can end early or request follow-up questions.",
  },
  {
    q: "What does the performance report include?",
    a: "You get: overall confidence rating, STAR structure scores for each answer, specific strengths identified, areas needing improvement, and rewritten example answers for your weakest responses.",
  },
];

export default function MockInterviewToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Mock Interview", url: "https://jobpilotai.co/tools/mock-interview" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI Mock Interview
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          The closest thing to a real interview without a real interviewer. AI asks role-specific
          questions, coaches your answers in real time, and gives you a detailed performance report.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Start Practicing Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Mock Interview Session Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-border">
            <div>
              <p className="text-sm font-bold text-white">Mock Interview Session</p>
              <p className="text-xs text-text-muted">Senior PM at Google &middot; Question 4 of 8</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className={`w-2.5 h-2.5 rounded-full ${n <= 3 ? "bg-emerald-500/60" : n === 4 ? "bg-violet-500/60 ring-2 ring-violet-500/30" : "bg-white/10"}`} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-[10px] text-violet-400 font-semibold uppercase mb-1">AI Interviewer</p>
              <p className="text-sm text-violet-300">Describe a time when you had to prioritize between competing product features with limited engineering resources. How did you decide?</p>
            </div>
            <div className="p-4 rounded-xl bg-space-700/50 border border-white/10">
              <p className="text-[10px] text-text-muted font-semibold uppercase mb-1">Your Answer</p>
              <p className="text-sm text-text-secondary">At my previous company, we had three features competing for our Q2 sprint — a customer-requested dashboard, an internal efficiency tool, and a security patch. I created a scoring framework...</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-400 mb-2">Real-Time Feedback</p>
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="text-center">
                  <div className="h-1.5 rounded-full bg-emerald-500/60 mb-1" />
                  <p className="text-[10px] text-text-muted">Situation</p>
                </div>
                <div className="text-center">
                  <div className="h-1.5 rounded-full bg-emerald-500/60 mb-1" />
                  <p className="text-[10px] text-text-muted">Task</p>
                </div>
                <div className="text-center">
                  <div className="h-1.5 rounded-full bg-emerald-500/60 mb-1" />
                  <p className="text-[10px] text-text-muted">Action</p>
                </div>
                <div className="text-center">
                  <div className="h-1.5 rounded-full bg-amber-500/60 mb-1" />
                  <p className="text-[10px] text-text-muted">Result</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">Great framework explanation. Quantify the outcome — what happened after you prioritized? Did metrics improve?</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Practice Makes Confident</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Candidates who do mock interviews are 2x more likely to receive offers. Practice eliminates the surprises that make interviews stressful.
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
            { step: "1", title: "Paste the Job Description", desc: "AI generates 6-10 role-specific questions based on the JD, company, and industry." },
            { step: "2", title: "Answer Live Questions", desc: "AI asks one question at a time. Type your answer. Get real-time STAR coaching after each." },
            { step: "3", title: "Review Your Performance", desc: "Get a detailed report: confidence score, STAR breakdown, strengths, and improvement areas." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">Practice with AI. Get real-time coaching. Walk in confident.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Start a Mock Interview Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
