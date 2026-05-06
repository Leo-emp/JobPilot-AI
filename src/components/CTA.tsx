/* ============================================================
   CTA SECTION - Final Call to Action
   ============================================================
   A large, bold section near the bottom of the page that
   encourages visitors to sign up. Uses the glowing text effect
   and a centered layout for maximum impact.
   ============================================================ */

import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">

        {/* Decorative gradient background glow behind the CTA */}
        <div
          className="absolute inset-0 mx-auto w-[600px] h-[400px] -z-10 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)",
          }}
        />

        {/* Main CTA heading — outcome-focused */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
          Your Next Interview{" "}
          <span className="glow-text-strong">Starts Here</span>
        </h2>

        {/* Supporting text — specific value, not vague promises */}
        <p className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
          10 AI tools. One platform. Upload your resume, and in under 60 seconds
          you&apos;ll know exactly what to fix, what to say, and where to apply.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="btn-primary text-lg px-10 py-4">
            Get Started Free →
          </Link>
          <Link href="/#features" className="btn-secondary text-lg px-10 py-4">
            Learn More
          </Link>
        </div>

        {/* Trust line */}
        <p className="mt-8 text-base text-text-muted">
          Free plan available &bull; No credit card required &bull; Cancel
          anytime
        </p>
      </div>
    </section>
  );
}
