/* ============================================================
   HERO SECTION - Main Landing Above the Fold
   ============================================================
   Staggered entrance animation: elements fade up one-by-one
   as soon as the page loads (above the fold = no scroll trigger).
   Uses Framer Motion variants with staggerChildren for a
   premium, coordinated reveal effect.
   ============================================================ */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";


/* # Zero-bounce spring — physics-based, no hard start/stop */
const SPRING = { type: "spring" as const, duration: 1.2, bounce: 0 };

/* # Parent variant — staggers children 140ms apart */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

/* # Child variant — each element fades up with spring physics */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: SPRING,
  },
};

/* # Rocket gets a subtle scale-in on top of the fade-up */
const rocketReveal = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...SPRING, duration: 1.4 },
  },
};

export default function Hero() {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-36 sm:pt-40 sm:pb-44 lg:pt-48 lg:pb-52"
    >

      {/* ---- Title ---- */}
      <motion.h1 variants={fadeUp} className="font-[family-name:var(--font-space-grotesk)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] mb-6 glow-text-strong">
        JobPilot AI
      </motion.h1>

      {/* ---- Tagline ---- */}
      <motion.p variants={fadeUp} className="font-[family-name:var(--font-space-grotesk)] text-lg sm:text-xl md:text-2xl font-medium tracking-[0.2em] uppercase mb-8 glow-text-subtle">
        Your Career Co-Pilot
      </motion.p>

      {/* ---- Description ---- */}
      <motion.p variants={fadeUp} className="max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed mb-14 font-light">
        AI-powered resume optimization, intelligent job matching,
        personalized cover letters, and interview prep —
        everything you need to land your dream job, in one place.
      </motion.p>

      {/* ---- CTA Buttons ---- */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
        <Link href="/signup" className="btn-primary text-base px-8 py-4">
          Get Started Free →
        </Link>
        <Link href="/#features" className="btn-secondary text-base px-8 py-4">
          See Features
        </Link>
      </motion.div>

      {/* ---- Trust Line ---- */}
      <motion.p variants={fadeUp} className="mt-8 text-sm text-text-muted">
        No credit card required · Free forever plan available
      </motion.p>
    </motion.section>
  );
}
