/* ============================================================
   TRUST BAR - Social Proof Stats Strip
   ============================================================
   Horizontal bar of key metrics that builds instant credibility.
   Numbers animate (count up from 0) when the section scrolls
   into view — gives a dynamic, premium feel.
   Uses Framer Motion's useInView to trigger the counter once.
   ============================================================ */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* # Stats data — split into numeric target + suffix for animation */
const stats = [
  { target: 10000, suffix: "+", label: "Resumes Optimized" },
  { target: 95, suffix: "%", label: "ATS Pass Rate" },
  { target: 10, suffix: "", label: "AI-Powered Tools" },
  { target: 30, suffix: "s", label: "Average Generation Time" },
];

/* # Animated counter — counts from 0 to target with ease-out curve */
/* Uses requestAnimationFrame for buttery 60fps animation */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = performance.now();

    /* # Ease-out cubic: fast start, smooth deceleration */
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* # Smooth deceleration curve */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* # Fade-up variant for each stat card */
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

/* # Parent variant — staggers the 4 stats */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function TrustBar() {
  return (
    <section className="relative z-10 py-12 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              {/* # Large stat number with brand glow + animated counter */}
              <div className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold glow-text mb-1">
                <Counter target={stat.target} suffix={stat.suffix} />
              </div>
              {/* # Label below the number */}
              <div className="text-sm sm:text-base text-text-muted uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
