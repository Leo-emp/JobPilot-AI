/* ============================================================
   SEO LANDING PAGE — Resignation Letter Generator
   ============================================================
   # Targets: "resignation letter generator", "professional
   # resignation letter", "how to write a resignation letter",
   # "resignation letter template", "two weeks notice letter"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free Resignation Letter Generator — Professional & Instant | JobPilot AI",
  description:
    "Generate a professional resignation letter in seconds. Choose your tone, set your last day, and get a polished letter ready to send. Free AI-powered tool.",
  alternates: { canonical: "https://jobpilotai.co/tools/resignation-letter-generator" },
  openGraph: {
    title: "Free Resignation Letter Generator — JobPilot AI",
    description:
      "Generate a professional, polished resignation letter instantly. AI-powered, customizable tone, ready to send.",
    url: "https://jobpilotai.co/tools/resignation-letter-generator",
  },
};

/* # Key benefits — each targets a different search intent */
const benefits = [
  {
    title: "Professional & Polished",
    desc: "Every letter follows proper business letter structure — header, date, body, and sign-off. No awkward phrasing, no templates that sound robotic. Each letter reads like it was written by a seasoned professional.",
  },
  {
    title: "Three Tone Options",
    desc: "Choose Professional for standard formality, Warm & Grateful for long tenures where you want to express genuine appreciation, or Brief & Direct when you need to keep it short and factual.",
  },
  {
    title: "Never Burns Bridges",
    desc: "The AI is trained to keep resignation letters positive and forward-looking. It will never include complaints, criticism, or negative language — even if you're leaving a terrible job. Your future references are safe.",
  },
  {
    title: "Transition-Ready",
    desc: "Every letter includes a professional offer to help with the transition — training replacements, documenting processes, or wrapping up projects. Shows maturity and leaves a lasting positive impression.",
  },
  {
    title: "Customizable Details",
    desc: "Add specific highlights, mention particular mentors or projects you're grateful for, and optionally include your reason for leaving. The AI weaves these naturally into the letter.",
  },
  {
    title: "Instant & Free",
    desc: "Stop spending hours agonizing over wording. Get a polished resignation letter in under 15 seconds — then edit it to add your personal touch before sending.",
  },
];

/* # Common questions for the FAQ section — targets long-tail search queries */
const faqs = [
  {
    q: "How long should a resignation letter be?",
    a: "Keep it to 150-300 words. A resignation letter is a formality, not an essay. State your intent, express gratitude, offer to help with the transition, and close. That's it.",
  },
  {
    q: "Should I include my reason for leaving?",
    a: "Usually no. Your resignation letter is a professional document, not a confessional. Save the reasons for your conversation with your manager. Our tool lets you optionally include a reason if you choose to.",
  },
  {
    q: "When should I give my resignation letter?",
    a: "After you've had a face-to-face conversation with your direct manager. The letter confirms what you already discussed verbally. Never blindside your manager with a letter — the conversation comes first.",
  },
  {
    q: "What should I NOT include in a resignation letter?",
    a: "Never include complaints about management, colleagues, salary, or working conditions. Don't mention your new employer or salary. Don't burn bridges — you may need references from these people.",
  },
  {
    q: "What's the standard notice period?",
    a: "In the US, 2 weeks is standard (though not legally required in most states). In the UK, it's typically 1-3 months depending on your contract. In Australia, 2-4 weeks. Always check your employment contract.",
  },
];

export default function ResignationLetterGeneratorPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Resignation Letter Generator", url: "https://jobpilotai.co/tools/resignation-letter-generator" },
        ]}
      />

      {/* # Hero Section */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">
          Free AI Tool
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Resignation Letter Generator
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Leave on the best possible terms. Generate a professional, polished
          resignation letter in seconds — with the right tone, proper structure,
          and zero bridge-burning. Ready to send today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Generate Your Letter Free
          </Link>
          <Link
            href="/login"
            className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors"
          >
            Already have an account?
          </Link>
        </div>
      </div>

      {/* # Example Letter Preview */}
      <div className="mb-20">
        <div className="glass-card p-8 sm:p-10 max-w-2xl mx-auto">
          <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
            <p className="text-white font-semibold text-base">Sarah Johnson</p>
            <p className="text-text-muted text-xs">September 11, 2026</p>
            <p>Dear Mr. Chen,</p>
            <p>
              I am writing to formally resign from my position as Senior Product Manager at
              Acme Corporation, effective October 11, 2026.
            </p>
            <p>
              The past four years at Acme have been transformative for my career. Leading the
              mobile platform launch from zero to 2M users was the most rewarding project I have
              worked on, and the cross-functional collaboration with the engineering and design
              teams taught me what great product work looks like at scale.
            </p>
            <p>
              I am committed to making this transition as smooth as possible. I will document all
              active projects, complete the Q4 roadmap handoff, and am happy to help interview
              or onboard my replacement during my remaining time.
            </p>
            <p>
              I wish you and the entire Acme team continued success. I hope to stay connected
              and watch the product continue to grow.
            </p>
            <p>Sincerely,<br />Sarah Johnson</p>
          </div>
          <div className="mt-6 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">
              Generated by JobPilot AI in 8 seconds — &quot;Warm &amp; Grateful&quot; tone
            </p>
          </div>
        </div>
      </div>

      {/* # Benefits Grid */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">
          Why Use an AI Resignation Letter Generator?
        </h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Writing a resignation letter is stressful. You want to leave professionally
          without burning bridges — and you don&apos;t want to spend hours on wording.
          Let AI handle the structure while you focus on your next chapter.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="glass-card p-6 hover:border-brand-indigo/30 transition-colors"
            >
              <h3 className="text-base font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # How It Works */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: "1", title: "Fill in Details", desc: "Your name, position, company, manager, and last working day." },
            { step: "2", title: "Choose Your Tone", desc: "Professional, warm & grateful, or brief & direct." },
            { step: "3", title: "Get Your Letter", desc: "AI generates a polished letter you can copy, edit, and send." },
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

      {/* # FAQ Section */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card p-6">
              <h3 className="font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # Bottom CTA */}
      <div className="rounded-2xl border border-card-border bg-space-800/60 p-8 sm:p-10 text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">
          Ready to Write Your Resignation Letter?
        </h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">
          Generate a professional, polished letter in seconds. Choose your tone,
          customize the details, and leave on the best terms possible.
        </p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">
          Get Started Free
        </Link>
        <p className="text-xs text-text-muted mt-4">
          No credit card required. Part of the complete JobPilot AI career toolkit.
        </p>
      </div>
    </div>
  );
}
