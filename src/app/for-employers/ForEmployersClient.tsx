/* ============================================================
   FOR EMPLOYERS CLIENT — Marketing landing page content
   ============================================================
   Showcases the AI Recruiter-as-a-Service offering:
   - Hero section with value prop
   - How it works (3 steps)
   - Pricing tiers (Free / Pro $299 / Enterprise $999)
   - Feature comparison table
   - CTA to employer signup

   Space theme consistent with the rest of the app.
   ============================================================ */

"use client";

import Link from "next/link";

/* # Pricing tiers to display */
const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try the platform with limited access.",
    features: [
      "3 active roles",
      "25 candidate bookmarks",
      "Basic AI matching",
      "Email support",
    ],
    cta: "Get Started",
    href: "/employer/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$299",
    period: "/month",
    description: "For growing teams hiring regularly.",
    features: [
      "25 active roles",
      "500 candidate bookmarks",
      "Advanced AI matching & ranking",
      "Automated outreach (500/month)",
      "Shortlist delivery (50/month)",
      "Team messaging",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/employer/signup",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$999",
    period: "/month",
    description: "Unlimited hiring power for large teams.",
    features: [
      "Unlimited active roles",
      "Unlimited bookmarks",
      "Premium AI matching with custom weights",
      "Unlimited outreach",
      "Unlimited shortlist delivery",
      "Dedicated account manager",
      "Custom integrations & API access",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/employer/signup",
    highlight: false,
  },
];

/* # How it works steps */
const STEPS = [
  {
    step: "1",
    title: "Post Your Roles",
    description:
      "Describe who you are looking for. Our AI extracts skills, experience levels, and requirements automatically.",
  },
  {
    step: "2",
    title: "AI Matches Candidates",
    description:
      "Our matching engine scores every candidate in the pool against your role. You see ranked results with match explanations.",
  },
  {
    step: "3",
    title: "Engage & Hire",
    description:
      "Bookmark top candidates, send outreach, and manage your pipeline all from one dashboard. No agency fees.",
  },
];

export default function ForEmployersClient() {
  return (
    <div className="min-h-screen bg-space-900">
      {/* # Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-16 relative">
          <div className="text-center">
            <span className="inline-block text-sm font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
              AI Recruiter-as-a-Service
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Hire Smarter,<br />Not Harder
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Post roles, get AI-matched and ranked candidates from a pool of verified
              job seekers. No agency fees, no manual screening, no wasted time.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/employer/signup"
                className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-medium text-lg hover:bg-indigo-500 transition-colors"
              >
                Start Hiring Free
              </Link>
              <Link
                href="/roles"
                className="px-8 py-4 rounded-xl border border-card-border text-foreground font-medium text-lg hover:bg-card transition-colors"
              >
                Browse Roles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* # Stats bar */}
      <section className="border-y border-card-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-indigo-400">10x</p>
            <p className="text-sm text-muted mt-1">Faster Than Traditional Recruiting</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-400">$0</p>
            <p className="text-sm text-muted mt-1">Agency Fees</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-400">AI</p>
            <p className="text-sm text-muted mt-1">Powered Matching & Ranking</p>
          </div>
        </div>
      </section>

      {/* # How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          How It Works
        </h2>
        <p className="text-lg text-muted text-center mb-12 max-w-2xl mx-auto">
          From posting to hiring in three simple steps.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-2xl bg-card border border-card-border"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg mb-4">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* # Pricing section */}
      <section className="bg-space-800/30 border-y border-card-border">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted text-center mb-12 max-w-2xl mx-auto">
            No hidden fees. No per-hire commissions. Just a flat monthly rate.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`p-6 rounded-2xl border ${
                  tier.highlight
                    ? "bg-gradient-to-b from-indigo-500/10 to-card border-indigo-500/30 ring-1 ring-indigo-500/20"
                    : "bg-card border-card-border"
                }`}
              >
                {tier.highlight && (
                  <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 rounded-full px-3 py-1 mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-muted">{tier.period}</span>
                </div>
                <p className="text-sm text-muted mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                      <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`block text-center px-6 py-3 rounded-xl font-medium transition-colors ${
                    tier.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-card border border-card-border text-foreground hover:bg-card-border/50"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* # Final CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Hiring?
        </h2>
        <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
          Join the employers already using AI to find better candidates, faster.
        </p>
        <Link
          href="/employer/signup"
          className="inline-block px-10 py-4 rounded-xl bg-indigo-600 text-white font-medium text-lg hover:bg-indigo-500 transition-colors"
        >
          Start Hiring Free
        </Link>
      </section>
    </div>
  );
}
