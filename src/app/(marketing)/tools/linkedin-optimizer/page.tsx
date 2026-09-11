/* ============================================================
   SEO LANDING PAGE — LinkedIn Profile Optimizer
   ============================================================
   # Targets: "LinkedIn profile optimizer", "LinkedIn headline
   # generator", "LinkedIn summary writer", "optimize LinkedIn
   # profile", "LinkedIn profile review"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free LinkedIn Profile Optimizer — AI Audit & Rewrite | JobPilot AI",
  description:
    "AI audits your LinkedIn profile, rewrites your headline and summary, optimizes keywords for recruiter visibility, and creates a content strategy. Free tool.",
  alternates: { canonical: "https://jobpilotai.co/tools/linkedin-optimizer" },
  openGraph: {
    title: "Free LinkedIn Profile Optimizer — JobPilot AI",
    description: "AI audits your LinkedIn, rewrites your headline and summary, and boosts recruiter visibility.",
    url: "https://jobpilotai.co/tools/linkedin-optimizer",
  },
};

const benefits = [
  {
    title: "Complete Profile Audit",
    desc: "AI evaluates your headline, summary, experience descriptions, skills section, and overall profile strength. Get a percentage score with specific, actionable improvements.",
  },
  {
    title: "Headline Rewrite",
    desc: "Your headline is the most important line on LinkedIn — it appears in search results, connection requests, and everywhere your name shows up. AI writes one that gets clicks.",
  },
  {
    title: "Summary Rewrite",
    desc: "Transform a generic 'Results-driven professional' summary into a compelling personal story that showcases your unique value and speaks directly to the roles you're targeting.",
  },
  {
    title: "Keyword Optimization",
    desc: "LinkedIn search is keyword-driven. AI identifies which keywords recruiters in your field search for and weaves them naturally into your profile — boosting your visibility.",
  },
  {
    title: "Content Strategy",
    desc: "Get a personalized posting strategy: what topics to write about, how often to post, and how to engage with your network to build visibility with decision-makers.",
  },
  {
    title: "Recruiter-Focused",
    desc: "Every optimization is designed to make you more visible in LinkedIn Recruiter searches. We focus on the fields and keywords that recruiters actually filter by.",
  },
];

const faqs = [
  {
    q: "Will this change my LinkedIn profile automatically?",
    a: "No. The tool generates optimized text that you manually copy and paste into your LinkedIn profile. You have full control over what to use and what to modify. Nothing is changed without your action.",
  },
  {
    q: "How do I use the optimized text?",
    a: "After AI generates your optimized headline, summary, and suggestions, copy the text and paste it directly into your LinkedIn profile editing sections. The tool provides the exact text — you do the pasting.",
  },
  {
    q: "What input do I need to provide?",
    a: "Paste your current LinkedIn headline, summary, and optionally your experience section. The more context you provide, the more tailored the optimization. You can also specify target roles or industries.",
  },
  {
    q: "How often should I optimize my LinkedIn?",
    a: "Update your profile whenever you change roles, gain new skills, or shift your career focus. At minimum, refresh your headline and summary every 6-12 months to stay relevant in recruiter searches.",
  },
  {
    q: "Does this work for any industry?",
    a: "Yes. The AI adapts its optimization to your specific industry and role. A software engineer's profile should look very different from a marketing director's — and the tool handles both.",
  },
];

export default function LinkedInOptimizerToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "LinkedIn Profile Optimizer", url: "https://jobpilotai.co/tools/linkedin-optimizer" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          LinkedIn Profile Optimizer
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          87% of recruiters use LinkedIn to find candidates. AI audits your profile,
          rewrites your headline and summary, and optimizes your keywords to get you found.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Optimize Your Profile Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Profile Audit Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-card-border">
            <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-500/30 flex items-center justify-center">
              <span className="text-xl font-bold text-sky-400">JD</span>
            </div>
            <div>
              <p className="text-base font-bold text-white">Jane Doe</p>
              <p className="text-sm text-text-muted">Senior Product Manager | Google</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            {[
              { field: "Headline", status: "Rewritten", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
              { field: "Summary", status: "Rewritten", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
              { field: "Experience", status: "5 Improvements", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
              { field: "Skills", status: "+8 Keywords Added", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
              { field: "Content Strategy", status: "Generated", badge: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
            ].map((f) => (
              <div key={f.field} className="flex items-center justify-between p-3 rounded-lg bg-space-700/50">
                <span className="text-sm text-white">{f.field}</span>
                <span className={`px-2.5 py-1 rounded text-xs font-medium border ${f.badge}`}>{f.status}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-sky-500/60" style={{ width: "92%" }} />
              </div>
            </div>
            <span className="text-sm font-bold text-sky-400">92%</span>
          </div>
          <p className="text-[10px] text-text-muted mt-1.5 text-right">Profile Strength After Optimization</p>
          <div className="mt-4 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">AI audit completed in 10 seconds — targeting Product Management roles</p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Your LinkedIn Profile is Your Digital Resume</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Recruiters spend 7.4 seconds scanning your profile. Your headline, summary, and keywords determine whether they stop or scroll. Make every second count.
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
            { step: "1", title: "Paste Your Profile", desc: "Copy your current headline, summary, and experience from LinkedIn." },
            { step: "2", title: "AI Audits & Rewrites", desc: "Get a profile strength score, optimized headline and summary, and keyword suggestions." },
            { step: "3", title: "Update & Get Found", desc: "Copy the optimized text back to your LinkedIn profile. Start appearing in more searches." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Get Found by Recruiters?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">Optimize your headline, summary, and keywords. Start appearing in more recruiter searches.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Get Started Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
