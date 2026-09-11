/* ============================================================
   SEO LANDING PAGE — AI Outreach Hub
   ============================================================
   # Targets: "AI networking message generator", "LinkedIn cold
   # outreach", "recruiter message template", "networking email
   # generator", "professional outreach messages"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Outreach Hub — Networking Messages That Get Replies | JobPilot AI",
  description:
    "Generate personalized LinkedIn messages, cold outreach, follow-ups, thank-you notes, referral requests, and recruiter pitches. AI writes messages that sound human and get replies.",
  alternates: { canonical: "https://jobpilotai.co/tools/outreach-hub" },
  openGraph: {
    title: "Free AI Outreach Hub — JobPilot AI",
    description: "AI generates personalized networking messages: LinkedIn requests, cold outreach, follow-ups, and more.",
    url: "https://jobpilotai.co/tools/outreach-hub",
  },
};

const messageTypes = [
  { type: "Connection Request", desc: "LinkedIn note (300 chars max)", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  { type: "Cold Outreach", desc: "Recruiters & hiring managers", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { type: "Follow-Up", desc: "After no reply or a conversation", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { type: "Thank-You Note", desc: "After interviews or coffee chats", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { type: "Referral Request", desc: "Ask your network for intros", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  { type: "Info Interview", desc: "Request informational meetings", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  { type: "Recruiter Pitch", desc: "Pitch yourself for specific roles", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
];

const benefits = [
  {
    title: "7 Message Types",
    desc: "LinkedIn connection requests, cold outreach, follow-ups, thank-you notes, referral requests, informational interview asks, and recruiter pitches — every networking scenario covered.",
  },
  {
    title: "Personalized, Not Templated",
    desc: "AI uses your background AND the recipient's details to craft messages that feel personal. Generic templates get ignored — personalized messages get replies.",
  },
  {
    title: "Platform-Aware Formatting",
    desc: "LinkedIn connection notes have a 300-character limit. Email outreach needs a subject line. AI formats each message for its platform, not one-size-fits-all.",
  },
  {
    title: "Resume-Powered Context",
    desc: "Upload your resume and AI uses your actual experience to craft messages — referencing your specific skills, companies, and achievements instead of generic claims.",
  },
  {
    title: "Tone Control",
    desc: "Professional but warm. Confident but not arrogant. AI strikes the tone that gets responses from busy people without sounding like a bot or a salesperson.",
  },
  {
    title: "Copy & Send in Seconds",
    desc: "Each message is ready to copy and paste into LinkedIn, email, or any messaging platform. No editing needed — though you can customize if you want.",
  },
];

const faqs = [
  {
    q: "Will people know these messages are AI-generated?",
    a: "No. The messages are designed to sound natural and personal — not like templates. AI uses your specific background and the recipient's context to create messages that read like you wrote them yourself.",
  },
  {
    q: "What information do I need to provide?",
    a: "At minimum: your background (or upload your resume) and the recipient's name and role. For better personalization, add their company, how you found them, and any shared connections or interests.",
  },
  {
    q: "What's the LinkedIn connection note character limit?",
    a: "LinkedIn limits connection notes to 300 characters. AI generates messages that fit within this limit while still being personalized and compelling. Other message types have no strict limit.",
  },
  {
    q: "Can I generate messages for multiple recipients at once?",
    a: "Currently, each message is generated individually to ensure maximum personalization. Mass-generated messages defeat the purpose — the value is in the personal touch.",
  },
  {
    q: "What message type should I use first?",
    a: "Start with Connection Requests for people you want in your network. Use Cold Outreach for recruiters at companies you're targeting. Follow-Ups are critical — most people don't reply to the first message but will respond to a thoughtful follow-up.",
  },
];

export default function OutreachHubToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "AI Outreach Hub", url: "https://jobpilotai.co/tools/outreach-hub" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI Outreach Hub
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          80% of jobs are filled through networking. AI generates personalized LinkedIn messages,
          cold outreach, follow-ups, and more — messages that sound human and actually get replies.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Start Writing Messages Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Message Types + Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">7 Message Types</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {messageTypes.map((m) => (
              <div key={m.type} className={`px-3 py-2.5 rounded-lg border ${m.color}`}>
                <p className="text-xs font-bold">{m.type}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-card-border pt-5">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Example: LinkedIn Connection Request</p>
            <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
              <p className="text-xs text-text-secondary leading-relaxed">Hi Sarah, I came across your work on Stripe&apos;s checkout redesign — the 15% conversion lift was impressive. I&apos;m a PM exploring fintech product roles and would love to connect and learn about your team&apos;s approach to experimentation.</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-text-muted">Personalized to recipient + your background</span>
              <span className="text-[10px] text-sky-400 font-medium">247 / 300 chars</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Networking Without the Awkwardness</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Most people know they should network but don&apos;t know what to say. AI removes the blank-page problem — you get a personalized, ready-to-send message in seconds.
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
            { step: "1", title: "Choose Message Type", desc: "Connection request, cold outreach, follow-up, thank you, referral, info interview, or recruiter pitch." },
            { step: "2", title: "Add Context", desc: "Your background (or upload resume) + recipient details. More context = more personalized message." },
            { step: "3", title: "Copy & Send", desc: "AI generates a ready-to-send message. Copy it into LinkedIn, email, or any platform." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Start Networking with Confidence</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">7 message types. Personalized in seconds. Messages that actually get replies.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Get Started Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
