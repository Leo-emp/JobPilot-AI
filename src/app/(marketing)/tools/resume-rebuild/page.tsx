/* ============================================================
   SEO LANDING PAGE — Resume Rebuild
   ============================================================
   # Targets: "resume rewrite service", "rebuild resume",
   # "AI resume rewrite", "complete resume makeover",
   # "rewrite my resume"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Resume Rebuild — Complete Resume Rewrite for Any Role | JobPilot AI",
  description:
    "AI completely rewrites your resume from scratch for a target role. New structure, new bullets, new language — optimized to land interviews in your desired field.",
  alternates: { canonical: "https://jobpilotai.co/tools/resume-rebuild" },
  openGraph: {
    title: "Free AI Resume Rebuild — JobPilot AI",
    description: "Complete resume rewrite for any target role. New structure, bullets, and language — AI-powered.",
    url: "https://jobpilotai.co/tools/resume-rebuild",
  },
};

const benefits = [
  {
    title: "Complete Ground-Up Rewrite",
    desc: "This isn't a tweak — it's a full rebuild. AI takes your experience and creates an entirely new resume structured, worded, and optimized for your target role.",
  },
  {
    title: "Role-Targeted Structure",
    desc: "The section ordering, emphasis, and language change based on your target. A PM resume leads with impact metrics; an engineer's leads with technical skills. AI knows the difference.",
  },
  {
    title: "Professional Summary Written for You",
    desc: "AI writes a compelling professional summary that positions you for the specific role — not a generic 'results-driven professional' opener.",
  },
  {
    title: "Experience Bullets Reframed",
    desc: "Your past experience is rewritten to highlight the skills and achievements most relevant to your target role. Same history, completely different framing.",
  },
  {
    title: "Skills Section Rebuilt",
    desc: "AI curates your skills section for the target role — prioritizing the most relevant skills, adding missing industry keywords, and removing irrelevant ones.",
  },
  {
    title: "Download-Ready Output",
    desc: "The rebuilt resume comes as formatted markdown you can download as Word or PDF. Copy, adjust, and submit — no reformatting needed.",
  },
];

const faqs = [
  {
    q: "How is this different from Resume Optimizer?",
    a: "Optimizer takes your existing resume and adjusts it — adding keywords and strengthening language (30 seconds). Rebuild creates an entirely new resume from your raw experience for a target role (2-3 minutes). Use Optimizer for quick applications; use Rebuild when your current resume needs a fundamentally different approach.",
  },
  {
    q: "Do I lose my original resume?",
    a: "No. The rebuild creates a new version alongside your original. You can compare both, mix sections, or keep whichever version you prefer.",
  },
  {
    q: "What input does AI need?",
    a: "Your current resume (upload PDF or paste text) and a target role description. The more specific you are about your target role, the better the rebuild. You can also specify a specific job posting.",
  },
  {
    q: "Is this good for career changers?",
    a: "Rebuild is especially powerful for career changers. We also have a dedicated Career Pivot mode that goes even deeper — reframing your entire work history through the lens of your new field and identifying transferable skills you might not see.",
  },
  {
    q: "How long does the rebuild take?",
    a: "About 2-3 minutes. The AI needs more time than Quick Optimize because it's rewriting every section from scratch, not just adjusting keywords.",
  },
];

export default function ResumeRebuildToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Resume Rebuild", url: "https://jobpilotai.co/tools/resume-rebuild" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI Resume Rebuild
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Sometimes your resume doesn&apos;t need a tweak — it needs a complete rewrite.
          AI takes your experience and rebuilds your resume from scratch for your target role.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Rebuild My Resume Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Rebuild Transformation Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-card-border">
            <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-[10px] text-red-400 font-semibold">Current: Marketing Coordinator</p>
            </div>
            <svg className="w-5 h-5 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 font-semibold">Target: Product Manager</p>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">New Professional Summary</p>
              <div className="p-3 rounded-lg bg-space-700/50 border border-white/5">
                <p className="text-xs text-text-secondary leading-relaxed">Data-driven product leader with 5 years of cross-functional experience driving user growth through market research, competitive analysis, and iterative feature development...</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Reframed Experience</p>
              <div className="p-3 rounded-lg bg-space-700/50 border border-white/5">
                <p className="text-xs text-white font-medium mb-1">Product Strategy Lead (reframed from Marketing Coordinator)</p>
                <p className="text-xs text-text-secondary">Drove product roadmap decisions through customer research and A/B testing, increasing feature adoption by 28% across 3 product lines...</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Rebuilt Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {["Product Strategy", "User Research", "Roadmapping", "A/B Testing", "Stakeholder Management", "SQL", "Jira", "Data Analysis"].map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">Complete rewrite generated in 2 minutes</p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">When a Tweak Isn&apos;t Enough</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          If your resume was written for a different role, a different industry, or a different stage of your career — optimizing it won&apos;t fix the foundation. Rebuild starts fresh.
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
            { step: "1", title: "Upload + Set Target", desc: "Upload your current resume and specify your target role or paste a job description." },
            { step: "2", title: "AI Rebuilds Everything", desc: "Summary, experience, skills — all rewritten from scratch with the target role as the north star." },
            { step: "3", title: "Review & Download", desc: "Compare with your original, make adjustments, and download as Word or PDF." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready for a Fresh Start?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">Upload your resume. Tell AI your target role. Get a complete rewrite in 2 minutes.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Rebuild My Resume Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
