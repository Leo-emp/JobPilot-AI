/* ============================================================
   PRICING SECTION - Plans & Pricing
   ============================================================
   Three-tier pricing layout: Free, Pro, Enterprise.
   The middle "Pro" card is highlighted as the recommended plan.
   Glass card styling with gradient accents on the featured plan.
   Free and Pro link to signup, Enterprise links to contact.
   ============================================================ */

import Link from "next/link";

/* ---- Plan Data ---- */
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "3 AI calls per month",
      "Resume analysis & ATS scoring",
      "1 cover letter per month",
      "Application tracker",
      "Community support",
    ],
    cta: "Get Started",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious job seekers",
    features: [
      "Unlimited AI calls",
      "Full resume rebuild engine",
      "Unlimited cover letters",
      "Interview prep AI",
      "Career Pivot mode",
      "Priority support",
      "Job match scoring",
    ],
    cta: "Start Pro Trial",
    href: "/signup?plan=pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams & organizations",
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Bulk resume processing",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/contact",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light mb-4">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent{" "}
            <span className="glow-text">Pricing</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </div>

        {/* ---- Pricing Cards Grid ---- */}
        {/* 1 column on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-card p-8 sm:p-10 flex flex-col ${
                plan.featured
                  ? /* Featured plan gets a glowing gradient border */
                    "border-brand-indigo/40 ring-1 ring-brand-indigo/20 shadow-lg shadow-brand-indigo/10 lg:scale-105"
                  : ""
              }`}
            >
              {/* "Most Popular" badge on featured plan */}
              {plan.featured && (
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-brand-indigo/20 text-brand-light rounded-full border border-brand-indigo/30">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold">
                  {plan.price}
                </span>
                <span className="text-text-muted text-lg">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-text-secondary mb-8">{plan.description}</p>

              {/* Feature list with checkmarks */}
              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    {/* Purple checkmark icon */}
                    <svg
                      className="w-5 h-5 text-brand-light flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-text-secondary text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA button — primary style for featured, secondary for others */}
              <Link
                href={plan.href}
                className={
                  plan.featured
                    ? "btn-primary w-full text-center"
                    : "btn-secondary w-full text-center"
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
