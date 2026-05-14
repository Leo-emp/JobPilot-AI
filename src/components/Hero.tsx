/* ============================================================
   HERO SECTION - Main Landing Above the Fold
   ============================================================ */

import Link from "next/link";
import RocketIcon from "./RocketIcon";

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36">

      {/* ---- Badge ---- */}
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.07] bg-white/[0.03]">
        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full uppercase">
          New
        </span>
        <span className="text-sm text-text-secondary">
          AI-Powered Career Pivot Mode
        </span>
        <span className="text-text-muted">→</span>
      </div>

      {/* ---- Rocket Icon ---- */}
      <div className="mb-8 opacity-90">
        <RocketIcon size={120} />
      </div>

      {/* ---- Title ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] mb-6 glow-text-strong">
        JobPilot AI
      </h1>

      {/* ---- Tagline ---- */}
      <p className="font-[family-name:var(--font-space-grotesk)] text-lg sm:text-xl md:text-2xl font-medium tracking-[0.15em] uppercase mb-8 glow-text-subtle">
        Your Career Co-Pilot
      </p>

      {/* ---- Description ---- */}
      <p className="max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed mb-12">
        AI-powered resume optimization, intelligent job matching,
        personalized cover letters, and interview prep —
        everything you need to land your dream job, in one place.
      </p>

      {/* ---- CTA Buttons ---- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/signup" className="btn-primary text-base px-8 py-4">
          Get Started Free →
        </Link>
        <Link href="/#features" className="btn-secondary text-base px-8 py-4">
          See Features
        </Link>
      </div>

      {/* ---- Trust Line ---- */}
      <p className="mt-8 text-sm text-text-muted">
        No credit card required · Free forever plan available
      </p>
    </section>
  );
}
