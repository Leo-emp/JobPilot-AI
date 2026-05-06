/* ============================================================
   HERO SECTION - Main Landing Above the Fold
   ============================================================
   The first thing visitors see. Contains:
   - Custom SVG rocket in brand colors (indigo/purple gradient)
   - Glowing "JobPilot AI" title in Space Grotesk font
   - Tagline in glowing purple
   - Description text
   - CTA buttons (Get Started + See Features)
   - Floating badge (like OpenClaw's "NEW" pill)
   ============================================================ */

import Link from "next/link";
import RocketIcon from "./RocketIcon";

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36">

      {/* ---- Floating "NEW" Badge (like OpenClaw) ---- */}
      {/* A pill-shaped badge that draws attention to a new feature */}
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-card-border bg-card-bg backdrop-blur-sm">
        <span className="px-2 py-0.5 bg-brand-indigo text-white text-xs font-bold rounded-full uppercase">
          New
        </span>
        <span className="text-sm text-text-secondary">
          AI-Powered Career Pivot Mode
        </span>
        <span className="text-text-muted">→</span>
      </div>

      {/* ---- Custom SVG Rocket Logo ---- */}
      {/* Uses our brand indigo/purple gradient instead of emoji colors */}
      {/* The drop-shadow filter adds a glowing aura around the rocket */}
      <div className="mb-8" style={{
        filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 60px rgba(99, 102, 241, 0.2))"
      }}>
        <RocketIcon size={120} />
      </div>

      {/* ---- Main Title with Glow Effect ---- */}
      {/* font-display uses Space Grotesk — geometric, premium, techy */}
      {/* glow-text-strong creates the OpenClaw-style neon glow illusion */}
      {/* tracking-[-0.04em] = tight letter spacing for a premium feel */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] mb-6 glow-text-strong">
        JobPilot AI
      </h1>

      {/* ---- Glowing Tagline ---- */}
      {/* Also uses Space Grotesk for consistency with the title */}
      <p className="font-[family-name:var(--font-space-grotesk)] text-lg sm:text-xl md:text-2xl font-medium tracking-[0.2em] uppercase mb-8 glow-text-subtle">
        Your Career Co-Pilot
      </p>

      {/* ---- Description ---- */}
      {/* Body text stays in Geist (the default sans font) for readability */}
      <p className="max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed mb-12">
        AI-powered resume optimization, intelligent job matching,
        personalized cover letters, and interview prep —
        everything you need to land your dream job, in one place.
      </p>

      {/* ---- CTA Buttons ---- */}
      {/* Two buttons side by side: primary (filled) and secondary (outline) */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/signup" className="btn-primary text-base px-8 py-4">
          Get Started Free →
        </Link>
        <Link href="/#features" className="btn-secondary text-base px-8 py-4">
          See Features
        </Link>
      </div>

      {/* ---- Trust Indicators ---- */}
      {/* Small text below buttons showing social proof */}
      <p className="mt-8 text-base text-text-muted">
        No credit card required &bull; Free forever plan available
      </p>
    </section>
  );
}
