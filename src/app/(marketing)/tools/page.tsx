/* ============================================================
   SEO LANDING PAGE — Tools Hub
   ============================================================
   # Master directory of every JobPilot AI tool. Organized by
   # category with visual preview cards. Each tool links to its
   # own dedicated page. Mirrors Teal-style tools hub.
   # Targets: "job search tools", "AI career tools",
   # "free resume tools", "career assessment tools"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Career Tools — Resume, Interview, Job Search & More | JobPilot AI",
  description:
    "Every tool you need to land your dream job. AI resume checker, cover letter generator, interview prep, career quizzes, application tracker, LinkedIn optimizer, and more — all free.",
  alternates: { canonical: "https://jobpilotai.co/tools" },
  openGraph: {
    title: "Free AI Career Tools — JobPilot AI",
    description:
      "AI resume checker, cover letter generator, interview prep, career quizzes, job tracker, and more — all in one platform.",
    url: "https://jobpilotai.co/tools",
  },
};

/* ---- Tool categories and their items ---- */

interface Tool {
  title: string;
  desc: string;
  href: string;
  /* # Preview card colors + visual type */
  gradient: string;
  preview: "score" | "letter" | "resignation" | "jobs" | "tracker" | "extension" | "interview" | "mock" | "quiz-change" | "quiz-personality" | "quiz-stayquit" | "linkedin" | "portfolio" | "templates" | "analyze" | "optimize" | "rebuild" | "outreach";
}

interface ToolCategory {
  title: string;
  description: string;
  tools: Tool[];
}

const categories: ToolCategory[] = [
  {
    title: "Resume Tools",
    description:
      "Getting started on a resume can feel overwhelming, but our AI-powered resume tools take the stress out of the process. From ATS analysis to cover letters — tools that work together to help you land more interviews.",
    tools: [
      {
        title: "AI Resume Analyzer",
        desc: "Upload your resume and get an instant ATS score, keyword gap analysis, section-by-section feedback, and specific improvement suggestions.",
        href: "/tools/resume-analyzer",
        gradient: "from-indigo-500/30 to-purple-500/30",
        preview: "analyze",
      },
      {
        title: "Resume Optimizer",
        desc: "Paste a job description and AI tailors your resume in 30 seconds — adding missing keywords, strengthening bullets, and boosting your ATS score.",
        href: "/tools/resume-optimizer",
        gradient: "from-cyan-500/30 to-blue-500/30",
        preview: "optimize",
      },
      {
        title: "Resume Rebuild",
        desc: "AI completely rewrites your resume from scratch for a target role. New structure, new bullets, new language — a full ground-up rewrite.",
        href: "/tools/resume-rebuild",
        gradient: "from-violet-500/30 to-indigo-500/30",
        preview: "rebuild",
      },
      {
        title: "Resume Templates",
        desc: "20 structurally unique resume templates across 5 categories — Classic, Sidebar, Visual, Modern, and Special. All ATS-friendly, all free.",
        href: "/tools/resume-templates",
        gradient: "from-teal-500/30 to-cyan-500/30",
        preview: "templates",
      },
      {
        title: "Cover Letter Generator",
        desc: "Write personalized cover letters with AI that match your resume to each job description. Unique and tailored every time.",
        href: "/tools/cover-letter-generator",
        gradient: "from-blue-500/30 to-cyan-500/30",
        preview: "letter",
      },
      {
        title: "Resignation Letter Generator",
        desc: "Create a polished, professional resignation letter with the right tone. Choose from three styles — ready to send in seconds.",
        href: "/tools/resignation-letter-generator",
        gradient: "from-rose-500/30 to-orange-500/30",
        preview: "resignation",
      },
    ],
  },
  {
    title: "Job Search Tools",
    description:
      "Find the right opportunities and stay organized throughout your entire job search. AI match scores tell you which jobs fit best, and the tracker keeps every application in one place.",
    tools: [
      {
        title: "AI Job Board",
        desc: "Search jobs from multiple sources in one place. Get AI match scores that tell you how well each job fits your profile and skills.",
        href: "/tools/job-search",
        gradient: "from-emerald-500/30 to-teal-500/30",
        preview: "jobs",
      },
      {
        title: "Chrome Extension",
        desc: "Save jobs from LinkedIn, Indeed, Glassdoor, and 40+ job boards with one click. Auto-extracts details, adds AI match scores, and syncs to your tracker.",
        href: "/tools/chrome-extension",
        gradient: "from-green-500/30 to-emerald-500/30",
        preview: "extension",
      },
      {
        title: "Application Tracker",
        desc: "Track every job application in one pipeline. Save jobs with one click, monitor status, and never lose track of an opportunity.",
        href: "/tools/application-tracker",
        gradient: "from-amber-500/30 to-yellow-500/30",
        preview: "tracker",
      },
    ],
  },
  {
    title: "Interview Tools",
    description:
      "Walk into every interview prepared and confident. AI predicts the exact questions you'll face, coaches your answers using the STAR method, and runs live mock interviews so you can practice.",
    tools: [
      {
        title: "Interview Prep",
        desc: "AI predicts the exact interview questions you'll face based on the job description and coaches your answers using the STAR method.",
        href: "/tools/interview-prep",
        gradient: "from-violet-500/30 to-fuchsia-500/30",
        preview: "interview",
      },
      {
        title: "AI Mock Interview",
        desc: "Practice with a live AI interviewer that asks role-specific questions, gives real-time STAR coaching, and delivers a detailed performance report.",
        href: "/tools/mock-interview",
        gradient: "from-fuchsia-500/30 to-pink-500/30",
        preview: "mock",
      },
    ],
  },
  {
    title: "Career Assessment Tools",
    description:
      "Not sure what's next in your career? Our AI-powered quizzes go beyond generic personality labels — they give you honest, personalized insights with real career matches and actionable plans.",
    tools: [
      {
        title: "Career Change Quiz",
        desc: "Evaluate your readiness for a career change, discover careers that match your strengths, and get a personalized transition plan.",
        href: "/tools/career-change-quiz",
        gradient: "from-indigo-500/30 to-blue-500/30",
        preview: "quiz-change",
      },
      {
        title: "Career Personality Test",
        desc: "Discover your work personality type across 6 dimensions. Get matched with 5 ideal careers and learn which ones to avoid.",
        href: "/tools/career-personality-test",
        gradient: "from-purple-500/30 to-pink-500/30",
        preview: "quiz-personality",
      },
      {
        title: "Stay or Quit Assessment",
        desc: "Get an honest, data-driven verdict on whether to stay and fix things or plan your exit. Includes both a stay-plan and exit strategy.",
        href: "/tools/stay-or-quit-assessment",
        gradient: "from-amber-500/30 to-red-500/30",
        preview: "quiz-stayquit",
      },
    ],
  },
  {
    title: "Networking & Outreach Tools",
    description:
      "80% of jobs are filled through networking. Generate personalized LinkedIn messages, cold outreach, follow-ups, and more — AI writes messages that sound human and get replies.",
    tools: [
      {
        title: "AI Outreach Hub",
        desc: "Generate personalized LinkedIn messages, cold outreach, follow-ups, thank-you notes, referral requests, and recruiter pitches — 7 message types that get replies.",
        href: "/tools/outreach-hub",
        gradient: "from-pink-500/30 to-rose-500/30",
        preview: "outreach",
      },
      {
        title: "LinkedIn Profile Optimizer",
        desc: "AI audits your LinkedIn profile, rewrites your headline and summary, and creates a content strategy to boost visibility with recruiters.",
        href: "/tools/linkedin-optimizer",
        gradient: "from-sky-500/30 to-blue-500/30",
        preview: "linkedin",
      },
    ],
  },
  {
    title: "Professional Growth Tools",
    description:
      "Build your professional presence beyond the resume. Create a shareable portfolio that showcases your best work and explore your career options with AI assessments.",
    tools: [
      {
        title: "Portfolio Builder",
        desc: "Create a professional portfolio with a shareable public link. Showcase projects, skills, and achievements — no coding required.",
        href: "/tools/portfolio-builder",
        gradient: "from-teal-500/30 to-emerald-500/30",
        preview: "portfolio",
      },
    ],
  },
];

/* ---- CSS-based preview illustrations for each tool type ---- */
/* # These replace product screenshots with stylized mockups */
function ToolPreview({ type, gradient }: { type: Tool["preview"]; gradient: string }) {
  return (
    <div className={`relative w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${gradient} overflow-hidden border border-white/5`}>
      {/* # Semi-transparent card elements that suggest each tool's UI */}
      <div className="absolute inset-0 p-5 flex items-center justify-center">
        {type === "score" && <ScorePreview />}
        {type === "letter" && <LetterPreview />}
        {type === "resignation" && <ResignationPreview />}
        {type === "jobs" && <JobsPreview />}
        {type === "tracker" && <TrackerPreview />}
        {type === "extension" && <ExtensionPreview />}
        {type === "interview" && <InterviewPreview />}
        {type === "mock" && <MockPreview />}
        {type === "quiz-change" && <QuizChangePreview />}
        {type === "quiz-personality" && <QuizPersonalityPreview />}
        {type === "quiz-stayquit" && <QuizStayQuitPreview />}
        {type === "linkedin" && <LinkedInPreview />}
        {type === "portfolio" && <PortfolioPreview />}
        {type === "templates" && <TemplatesPreview />}
        {type === "analyze" && <AnalyzePreview />}
        {type === "optimize" && <OptimizePreview />}
        {type === "rebuild" && <RebuildPreview />}
        {type === "outreach" && <OutreachPreview />}
      </div>
    </div>
  );
}

/* # ATS Score gauge */
function ScorePreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-5 w-full max-w-[200px] text-center backdrop-blur-sm border border-white/10">
      <div className="relative w-24 h-24 mx-auto mb-3">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">78</span>
        </div>
      </div>
      <p className="text-xs text-text-secondary">ATS Score</p>
      <div className="mt-3 flex gap-1.5 justify-center">
        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">8 Keywords</span>
        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/20">3 Gaps</span>
      </div>
    </div>
  );
}

/* # Cover letter layout */
function LetterPreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-5 w-full backdrop-blur-sm border border-white/10 text-left">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <span className="text-xs font-bold text-blue-400">JD</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Product Manager</p>
          <p className="text-[10px] text-text-muted">Acme Corp</p>
        </div>
        <span className="ml-auto px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">92% Match</span>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 bg-white/10 rounded-full w-full" />
        <div className="h-2 bg-white/10 rounded-full w-11/12" />
        <div className="h-2 bg-white/10 rounded-full w-full" />
        <div className="h-2 bg-white/10 rounded-full w-9/12" />
        <div className="h-2 bg-white/10 rounded-full w-full mt-3" />
        <div className="h-2 bg-white/10 rounded-full w-10/12" />
      </div>
    </div>
  );
}

/* # Resignation letter document */
function ResignationPreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-5 w-full backdrop-blur-sm border border-white/10 text-left">
      <p className="text-[11px] font-semibold text-white mb-0.5">Sarah Johnson</p>
      <p className="text-[9px] text-text-muted mb-3">September 11, 2026</p>
      <p className="text-[10px] text-text-secondary mb-2">Dear Mr. Chen,</p>
      <div className="space-y-1.5">
        <div className="h-1.5 bg-white/10 rounded-full w-full" />
        <div className="h-1.5 bg-white/10 rounded-full w-11/12" />
        <div className="h-1.5 bg-white/10 rounded-full w-full" />
        <div className="h-1.5 bg-white/10 rounded-full w-8/12" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 bg-white/10 rounded-full w-full" />
        <div className="h-1.5 bg-white/10 rounded-full w-10/12" />
        <div className="h-1.5 bg-white/10 rounded-full w-6/12" />
      </div>
      <p className="text-[10px] text-text-secondary mt-3">Sincerely,</p>
      <p className="text-[10px] text-white font-medium">Sarah Johnson</p>
    </div>
  );
}

/* # Job listing cards */
function JobsPreview() {
  return (
    <div className="w-full space-y-2">
      {[
        { role: "Product Manager", company: "Google", match: "94%", color: "emerald" },
        { role: "UX Designer", company: "Spotify", match: "87%", color: "emerald" },
        { role: "Data Analyst", company: "Stripe", match: "72%", color: "amber" },
      ].map((j) => (
        <div key={j.role} className="bg-space-800/80 rounded-lg p-3 backdrop-blur-sm border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">{j.company[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-white truncate">{j.role}</p>
            <p className="text-[9px] text-text-muted">{j.company}</p>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] ${j.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"} shrink-0`}>
            {j.match}
          </span>
        </div>
      ))}
    </div>
  );
}

/* # Application pipeline */
function TrackerPreview() {
  return (
    <div className="w-full">
      <div className="flex gap-1.5 mb-3">
        {["Applied", "Interview", "Offer"].map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div className={`h-1.5 rounded-full mb-1 ${i === 0 ? "bg-blue-500/60" : i === 1 ? "bg-amber-500/60" : "bg-emerald-500/60"}`} />
            <p className="text-[9px] text-text-muted">{s}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="bg-space-800/80 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/10 flex items-center justify-between">
          <p className="text-[10px] text-white">PM at Google</p>
          <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-400">Interview</span>
        </div>
        <div className="bg-space-800/80 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/10 flex items-center justify-between">
          <p className="text-[10px] text-white">Designer at Meta</p>
          <span className="px-2 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-400">Applied</span>
        </div>
        <div className="bg-space-800/80 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/10 flex items-center justify-between">
          <p className="text-[10px] text-white">Analyst at Stripe</p>
          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400">Offer</span>
        </div>
      </div>
    </div>
  );
}

/* # Interview chat */
function InterviewPreview() {
  return (
    <div className="w-full space-y-2">
      <div className="bg-violet-500/20 rounded-lg rounded-tl-sm p-3 backdrop-blur-sm border border-violet-500/20 max-w-[85%]">
        <p className="text-[10px] text-violet-300">Tell me about a time you led a cross-functional team through a challenging project.</p>
      </div>
      <div className="bg-space-800/80 rounded-lg rounded-tr-sm p-3 backdrop-blur-sm border border-white/10 max-w-[85%] ml-auto">
        <p className="text-[10px] text-text-secondary">In my role at Acme, I led a team of 8 engineers and 3 designers to ship our mobile app...</p>
      </div>
      <div className="bg-emerald-500/10 rounded-lg p-2 backdrop-blur-sm border border-emerald-500/20">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-[8px] text-emerald-400">S</span>
          </div>
          <p className="text-[9px] text-emerald-400 font-medium">STAR Method Coaching</p>
        </div>
      </div>
    </div>
  );
}

/* # Career change quiz result */
function QuizChangePreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-5 w-full backdrop-blur-sm border border-white/10 text-center">
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Your Top Career Match</p>
      <p className="text-lg font-bold text-white mb-3">Product Management</p>
      <div className="flex gap-2 justify-center mb-3">
        <div className="text-center">
          <p className="text-lg font-bold text-emerald-400">82</p>
          <p className="text-[9px] text-text-muted">Readiness</p>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <p className="text-lg font-bold text-blue-400">5</p>
          <p className="text-[9px] text-text-muted">Matches</p>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <p className="text-lg font-bold text-amber-400">90d</p>
          <p className="text-[9px] text-text-muted">Plan</p>
        </div>
      </div>
      <div className="flex gap-1 justify-center flex-wrap">
        <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">Leadership</span>
        <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">Strategy</span>
        <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">Analytics</span>
      </div>
    </div>
  );
}

/* # Career personality result */
function QuizPersonalityPreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-5 w-full backdrop-blur-sm border border-white/10 text-center">
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Your Work Personality</p>
      <p className="text-base font-bold text-purple-400 mb-3">The Strategic Builder</p>
      <div className="space-y-2 text-left">
        <div className="flex items-center gap-2">
          <p className="text-[9px] text-text-muted w-16 shrink-0">Leadership</p>
          <div className="flex-1 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-purple-500/60" style={{ width: "85%" }} /></div>
          <p className="text-[9px] text-white w-6 text-right">85</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[9px] text-text-muted w-16 shrink-0">Creativity</p>
          <div className="flex-1 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-pink-500/60" style={{ width: "72%" }} /></div>
          <p className="text-[9px] text-white w-6 text-right">72</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[9px] text-text-muted w-16 shrink-0">Analytical</p>
          <div className="flex-1 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-indigo-500/60" style={{ width: "90%" }} /></div>
          <p className="text-[9px] text-white w-6 text-right">90</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[9px] text-text-muted w-16 shrink-0">Social</p>
          <div className="flex-1 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-500/60" style={{ width: "60%" }} /></div>
          <p className="text-[9px] text-white w-6 text-right">60</p>
        </div>
      </div>
    </div>
  );
}

/* # Stay or quit verdict */
function QuizStayQuitPreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-5 w-full backdrop-blur-sm border border-white/10 text-center">
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">AI Verdict</p>
      <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 mb-3">
        <p className="text-sm font-bold text-amber-400">Plan Your Exit</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-left">
        {[
          { area: "Growth", score: "3/10", color: "text-red-400" },
          { area: "Manager", score: "5/10", color: "text-amber-400" },
          { area: "Culture", score: "4/10", color: "text-amber-400" },
          { area: "Pay", score: "7/10", color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.area} className="flex justify-between items-center px-2 py-1 rounded bg-white/5">
            <span className="text-[9px] text-text-muted">{s.area}</span>
            <span className={`text-[10px] font-semibold ${s.color}`}>{s.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* # LinkedIn profile card */
function LinkedInPreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-5 w-full backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
          <span className="text-sm font-bold text-sky-400">JD</span>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white">Jane Doe</p>
          <p className="text-[9px] text-text-muted">Senior Product Manager</p>
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-text-muted">Headline</span>
          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400">Optimized</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-text-muted">Summary</span>
          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400">Rewritten</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-text-muted">Keywords</span>
          <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-400">+12 Added</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-sky-500/60 w-[88%]" />
      </div>
      <p className="text-[9px] text-text-muted mt-1 text-right">Profile Strength: 88%</p>
    </div>
  );
}

/* # Portfolio grid */
function PortfolioPreview() {
  return (
    <div className="w-full">
      <div className="bg-space-800/80 rounded-xl p-3 backdrop-blur-sm border border-white/10 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
            <span className="text-[8px] font-bold text-teal-400">P</span>
          </div>
          <p className="text-[10px] font-semibold text-white">My Portfolio</p>
          <span className="ml-auto text-[8px] text-text-muted">jobpilotai.co/p/jane</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {["bg-indigo-500/20", "bg-emerald-500/20", "bg-amber-500/20", "bg-rose-500/20"].map((bg, i) => (
          <div key={i} className={`${bg} rounded-lg aspect-[4/3] flex items-center justify-center border border-white/5`}>
            <div className="text-center">
              <div className="w-6 h-6 rounded bg-white/10 mx-auto mb-1" />
              <div className="h-1 bg-white/15 rounded w-12 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* # Chrome extension popup */
function ExtensionPreview() {
  return (
    <div className="w-full max-w-[200px] mx-auto">
      <div className="bg-space-800/80 rounded-xl p-4 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-brand-indigo/20 flex items-center justify-center">
            <span className="text-[7px] font-bold text-brand-light">JP</span>
          </div>
          <p className="text-[10px] font-bold text-white">JobPilot AI</p>
          <span className="ml-auto px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/20 text-emerald-400">Detected</span>
        </div>
        <div className="space-y-1.5 mb-3">
          <div className="p-2 rounded bg-space-700/80 border border-white/5">
            <p className="text-[8px] text-text-muted">Job Title</p>
            <p className="text-[10px] text-white font-medium">Senior PM</p>
          </div>
          <div className="flex gap-1.5">
            <div className="flex-1 p-2 rounded bg-space-700/80 border border-white/5">
              <p className="text-[8px] text-text-muted">Company</p>
              <p className="text-[10px] text-white font-medium">Google</p>
            </div>
            <div className="flex-1 p-2 rounded bg-space-700/80 border border-white/5">
              <p className="text-[8px] text-text-muted">Match</p>
              <p className="text-[10px] text-emerald-400 font-bold">94%</p>
            </div>
          </div>
        </div>
        <div className="w-full py-1.5 rounded-lg bg-brand-indigo/60 text-center">
          <p className="text-[9px] text-white font-semibold">Save to Tracker</p>
        </div>
      </div>
    </div>
  );
}

/* # Mock interview session */
function MockPreview() {
  return (
    <div className="w-full space-y-2">
      <div className="bg-space-800/80 rounded-lg p-2.5 backdrop-blur-sm border border-white/10 flex items-center justify-between">
        <p className="text-[10px] text-white font-medium">Mock Interview &middot; PM at Google</p>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className={`w-2 h-2 rounded-full ${n <= 3 ? "bg-emerald-500/60" : n === 4 ? "bg-violet-500/60" : "bg-white/10"}`} />
          ))}
        </div>
      </div>
      <div className="bg-violet-500/20 rounded-lg rounded-tl-sm p-3 backdrop-blur-sm border border-violet-500/20 max-w-[85%]">
        <p className="text-[10px] text-violet-300">How would you prioritize features with limited engineering resources?</p>
      </div>
      <div className="bg-space-800/80 rounded-lg rounded-tr-sm p-3 backdrop-blur-sm border border-white/10 max-w-[85%] ml-auto">
        <p className="text-[10px] text-text-secondary">I created a scoring framework weighing customer impact, revenue potential, and effort...</p>
      </div>
      <div className="bg-emerald-500/10 rounded-lg p-2 backdrop-blur-sm border border-emerald-500/20 flex items-center gap-2">
        <div className="flex gap-1">
          {["S", "T", "A", "R"].map((l, i) => (
            <div key={l} className={`w-5 h-5 rounded text-[8px] font-bold flex items-center justify-center ${i < 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{l}</div>
          ))}
        </div>
        <p className="text-[9px] text-text-secondary">Add a quantified result</p>
      </div>
    </div>
  );
}

/* # Resume template categories */
function TemplatesPreview() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {[
          { cat: "Classic", n: 4, bg: "bg-blue-500/15 border-blue-500/20" },
          { cat: "Sidebar", n: 5, bg: "bg-purple-500/15 border-purple-500/20" },
          { cat: "Visual", n: 4, bg: "bg-emerald-500/15 border-emerald-500/20" },
        ].map((c) => (
          <div key={c.cat} className={`rounded-lg p-2 border ${c.bg} text-center`}>
            <p className="text-sm font-bold text-white">{c.n}</p>
            <p className="text-[8px] text-text-muted">{c.cat}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { cat: "Modern", n: 4, bg: "bg-amber-500/15 border-amber-500/20" },
          { cat: "Special", n: 3, bg: "bg-rose-500/15 border-rose-500/20" },
          { cat: "Total", n: 20, bg: "bg-indigo-500/15 border-indigo-500/20" },
        ].map((c) => (
          <div key={c.cat} className={`rounded-lg p-2 border ${c.bg} text-center`}>
            <p className="text-sm font-bold text-white">{c.n}</p>
            <p className="text-[8px] text-text-muted">{c.cat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* # Resume analysis result */
function AnalyzePreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-5 w-full max-w-[200px] text-center backdrop-blur-sm border border-white/10">
      <div className="relative w-20 h-20 mx-auto mb-3">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">80</span>
        </div>
      </div>
      <p className="text-xs text-text-secondary mb-2">ATS Score</p>
      <div className="space-y-1">
        <div className="flex justify-between text-[9px]">
          <span className="text-text-muted">Keywords</span>
          <span className="text-emerald-400">12 found</span>
        </div>
        <div className="flex justify-between text-[9px]">
          <span className="text-text-muted">Gaps</span>
          <span className="text-amber-400">3 missing</span>
        </div>
        <div className="flex justify-between text-[9px]">
          <span className="text-text-muted">Suggestions</span>
          <span className="text-blue-400">8 items</span>
        </div>
      </div>
    </div>
  );
}

/* # Resume optimize before/after */
function OptimizePreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-4 w-full backdrop-blur-sm border border-white/10">
      <div className="flex gap-2 mb-3">
        <div className="flex-1 text-center py-1 rounded bg-red-500/10 border border-red-500/20">
          <p className="text-[10px] text-red-400 font-semibold">Before: 54</p>
        </div>
        <div className="flex-1 text-center py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-[10px] text-emerald-400 font-semibold">After: 87</p>
        </div>
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="p-2 rounded bg-red-500/5 border border-red-500/10">
          <p className="text-[9px] text-text-muted line-through">Managed a team and worked on projects</p>
        </div>
        <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
          <p className="text-[9px] text-white">Led 8 engineers to deliver 3 features, +34% retention</p>
        </div>
      </div>
      <div className="flex gap-1 flex-wrap">
        {["+agile", "+data-driven", "+stakeholder"].map((kw) => (
          <span key={kw} className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{kw}</span>
        ))}
      </div>
    </div>
  );
}

/* # Resume rebuild transformation */
function RebuildPreview() {
  return (
    <div className="bg-space-800/80 rounded-xl p-4 w-full backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-1 rounded text-[9px] bg-red-500/10 text-red-400 border border-red-500/20">Marketing Coord.</span>
        <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        <span className="px-2 py-1 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Product Manager</span>
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="h-2 bg-white/10 rounded-full w-full" />
        <div className="h-2 bg-white/10 rounded-full w-11/12" />
        <div className="h-2 bg-white/10 rounded-full w-9/12" />
      </div>
      <div className="flex gap-1 flex-wrap">
        {["Product Strategy", "Roadmapping", "A/B Testing", "SQL"].map((s) => (
          <span key={s} className="px-1.5 py-0.5 rounded text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{s}</span>
        ))}
      </div>
      <p className="text-[9px] text-text-muted mt-2">Full rewrite in 2 min</p>
    </div>
  );
}

/* # Outreach message types */
function OutreachPreview() {
  return (
    <div className="w-full space-y-1.5">
      {[
        { type: "Connection Request", badge: "bg-sky-500/20 text-sky-400" },
        { type: "Cold Outreach", badge: "bg-purple-500/20 text-purple-400" },
        { type: "Follow-Up", badge: "bg-amber-500/20 text-amber-400" },
        { type: "Thank-You Note", badge: "bg-emerald-500/20 text-emerald-400" },
      ].map((m) => (
        <div key={m.type} className="bg-space-800/80 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/10 flex items-center justify-between">
          <p className="text-[10px] text-white">{m.type}</p>
          <span className={`px-2 py-0.5 rounded text-[9px] ${m.badge}`}>AI</span>
        </div>
      ))}
      <div className="bg-sky-500/10 rounded-lg p-2.5 border border-sky-500/20">
        <p className="text-[9px] text-text-secondary">Hi Sarah, I saw your work on Stripe&apos;s checkout...</p>
        <p className="text-[8px] text-sky-400 mt-1">247 / 300 chars</p>
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-20">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">
          Free AI Career Tools
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Every Tool to Land Your Dream Job
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto">
          From resume analysis to interview prep, career assessments to application
          tracking — a complete suite of AI-powered tools designed to help you at every
          stage of your career journey.
        </p>
      </div>

      {/* # Tool categories */}
      <div className="space-y-20">
        {categories.map((cat) => (
          <section key={cat.title}>
            {/* # Category header */}
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-3">
                {cat.title}
              </h2>
              <p className="text-text-secondary text-base max-w-3xl">
                {cat.description}
              </p>
            </div>

            {/* # Tool cards grid — 3 columns on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cat.tools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group block"
                >
                  {/* # Preview illustration */}
                  <div className="mb-4 transition-transform duration-300 group-hover:scale-[1.02]">
                    <ToolPreview type={tool.preview} gradient={tool.gradient} />
                  </div>

                  {/* # Title + description */}
                  <h3 className="text-lg font-bold text-brand-light group-hover:text-white transition-colors mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {tool.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* # Bottom CTA */}
      <div className="mt-24 rounded-2xl border border-card-border bg-space-800/60 p-8 sm:p-12 text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">
          Start Using These Tools for Free
        </h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">
          All tools are available on the free plan. No credit card required.
          Sign up and start using AI-powered career tools in under 30 seconds.
        </p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">
          Get Started Free
        </Link>
        <p className="text-xs text-text-muted mt-4">
          Free plan includes 10 AI calls per month. Upgrade to Pro for unlimited access.
        </p>
      </div>
    </div>
  );
}
