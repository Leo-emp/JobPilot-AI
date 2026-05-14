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
          className="absolute inset-0 mx-auto w-[600px] h-[400px] -z-10 opacity-15"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)",
          }}
        />

        {/* Main CTA heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
          Ready to{" "}
          <span className="glow-text-strong">Launch Your Career?</span>
        </h2>

        {/* Supporting text */}
        <p className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of professionals who use JobPilot AI to land interviews
          faster, write better resumes, and walk into every opportunity fully prepared.
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
