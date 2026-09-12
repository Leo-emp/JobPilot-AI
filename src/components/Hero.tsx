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
      className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36"
    >

      {/* ---- Title ---- */}
      <motion.h1 variants={fadeUp} className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6 max-w-4xl">
        Land More Interviews With{" "}
        <span className="glow-text-strong">Tailored Resumes</span>
      </motion.h1>

      {/* ---- Description ---- */}
      <motion.p variants={fadeUp} className="max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed mb-12">
        Upload your resume, paste a job description, and get an ATS-optimized
        resume in seconds — tailored with the right keywords, structure, and
        formatting to get optimized for ATS screening and to stand out to hiring managers.
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
