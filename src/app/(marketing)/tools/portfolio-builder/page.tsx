/* ============================================================
   SEO LANDING PAGE — Portfolio Builder
   ============================================================
   # Targets: "portfolio builder", "professional portfolio maker",
   # "career portfolio", "online portfolio builder",
   # "job portfolio creator"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Portfolio Builder — Showcase Your Career Story | JobPilot AI",
  description:
    "AI builds a professional career portfolio from your resume and experience. Showcases projects, achievements, and skills in a shareable format. Free tool.",
  alternates: { canonical: "https://jobpilotai.co/tools/portfolio-builder" },
  openGraph: {
    title: "Free AI Portfolio Builder — JobPilot AI",
    description: "AI transforms your resume into a professional portfolio that showcases projects and achievements.",
    url: "https://jobpilotai.co/tools/portfolio-builder",
  },
};

const benefits = [
  {
    title: "AI-Generated from Your Resume",
    desc: "Paste your resume and AI transforms it into a structured portfolio — organizing projects, achievements, skills, and career narrative into sections that tell your professional story.",
  },
  {
    title: "Project Showcase",
    desc: "Highlight your best work with dedicated project sections. Each project gets a description, your role, the impact, and technologies used — formatted to impress hiring managers.",
  },
  {
    title: "Achievement Highlights",
    desc: "AI identifies and showcases your most impressive achievements — revenue generated, efficiency improved, teams led, products launched — with quantified metrics where possible.",
  },
  {
    title: "Skills Visualization",
    desc: "Your skills aren't just listed — they're categorized and visualized. Technical skills, soft skills, tools, and certifications are organized in a format that's easy to scan.",
  },
  {
    title: "Shareable Link",
    desc: "Get a clean, professional portfolio you can share via link. Perfect for LinkedIn bios, email signatures, job applications, and networking conversations.",
  },
  {
    title: "Tailored to Your Target",
    desc: "Specify the roles you're targeting and AI emphasizes the most relevant experience. A PM portfolio looks different from an engineer's — and it should.",
  },
];

const faqs = [
  {
    q: "How is this different from a resume?",
    a: "A resume is a structured document optimized for ATS scanning. A portfolio is a narrative that showcases your work, projects, and impact in a visual, engaging format. Think of your resume as the summary and your portfolio as the story.",
  },
  {
    q: "What input do I need to provide?",
    a: "At minimum, paste your resume. For a richer portfolio, you can add project descriptions, links to work samples, certifications, and a brief career narrative. The more context you provide, the more detailed the portfolio.",
  },
  {
    q: "Can I edit the generated portfolio?",
    a: "The AI generates text and structure that you can copy and customize. You have full control over what to include, modify, or remove before sharing.",
  },
  {
    q: "Who should use a career portfolio?",
    a: "Anyone whose work is hard to capture in a one-page resume: product managers, designers, engineers, marketers, consultants, and career changers. If you've built things, led initiatives, or driven measurable impact, a portfolio shows it better than bullet points.",
  },
  {
    q: "Does this replace my personal website?",
    a: "It can complement one. If you already have a personal website, use the portfolio content to improve it. If you don't have one, the portfolio gives you shareable content that works on its own.",
  },
];

export default function PortfolioBuilderToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Portfolio Builder", url: "https://jobpilotai.co/tools/portfolio-builder" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI Portfolio Builder
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Your resume tells them what you did. Your portfolio shows them how you think.
          AI transforms your experience into a professional career portfolio — ready to share.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Build Your Portfolio Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Portfolio Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-card-border">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
              <span className="text-xl font-bold text-indigo-400">AD</span>
            </div>
            <div>
              <p className="text-base font-bold text-white">Alex Doe</p>
              <p className="text-sm text-text-secondary">Senior Product Manager</p>
              <p className="text-xs text-text-muted">8 years experience &middot; SaaS &middot; AI/ML</p>
            </div>
          </div>
          <div className="mb-5">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Featured Projects</p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-space-700/50 border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-white">AI Recommendation Engine</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Shipped</span>
                </div>
                <p className="text-xs text-text-secondary mb-2">Led a cross-functional team of 8 to build a personalization engine that increased conversion by 34%.</p>
                <div className="flex gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400">Python</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400">ML</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400">A/B Testing</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-space-700/50 border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-white">Enterprise Dashboard Redesign</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Shipped</span>
                </div>
                <p className="text-xs text-text-secondary mb-2">Redesigned the analytics dashboard, reducing time-to-insight by 60% for enterprise users.</p>
                <div className="flex gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400">React</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400">D3.js</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400">UX Research</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Key Achievements</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                <p className="text-lg font-bold text-purple-400">$4.2M</p>
                <p className="text-[10px] text-text-muted">Revenue Impact</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-lg font-bold text-blue-400">12</p>
                <p className="text-[10px] text-text-muted">Products Shipped</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-lg font-bold text-emerald-400">34%</p>
                <p className="text-[10px] text-text-muted">Avg Conversion Lift</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">AI-generated portfolio from resume in 15 seconds</p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Show, Don&apos;t Just Tell</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          A resume lists your responsibilities. A portfolio demonstrates your impact. Show hiring managers the difference you made — not just the role you held.
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
            { step: "1", title: "Paste Your Resume", desc: "Upload or paste your resume. Optionally add project descriptions and work samples." },
            { step: "2", title: "AI Builds Your Portfolio", desc: "AI organizes your experience into projects, achievements, skills, and a career narrative." },
            { step: "3", title: "Share & Impress", desc: "Get a professional portfolio ready to share via link — on LinkedIn, in applications, or at networking events." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Showcase Your Career?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">Turn your resume into a portfolio that shows your impact. AI-generated in seconds.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Get Started Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
