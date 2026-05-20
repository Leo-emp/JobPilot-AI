/* ============================================================
   TESTIMONIALS - Social Proof Section
   ============================================================
   Shows user testimonials in glassmorphism cards.
   Cards fade in on scroll with a stagger effect — each card
   appears slightly after the previous one, creating a
   cascading reveal. Builds trust and credibility.
   ============================================================ */

"use client";

import { motion } from "framer-motion";

/* ---- Testimonial Data ---- */
const testimonials = [
  {
    name: "Sarah M.",
    role: "Software Engineer",
    avatar: "SM",
    text: "JobPilot completely transformed my resume. I went from zero callbacks to 5 interviews in two weeks. The ATS optimization is incredible.",
    color: "bg-blue-600",
  },
  {
    name: "David K.",
    role: "Career Changer",
    avatar: "DK",
    text: "The Career Pivot mode is a game-changer. I transitioned from teaching to tech and JobPilot rewrote my entire resume to highlight transferable skills.",
    color: "bg-emerald-600",
  },
  {
    name: "Priya R.",
    role: "Marketing Manager",
    avatar: "PR",
    text: "Generated a perfect cover letter in 30 seconds. It was better than anything I'd spent hours writing myself. Absolutely worth it.",
    color: "bg-sky-600",
  },
  {
    name: "James L.",
    role: "Recent Graduate",
    avatar: "JL",
    text: "The interview prep predicted almost the exact questions I was asked. I walked in confident and got the offer. This tool is unreal.",
    color: "bg-amber-600",
  },
];

/* # Zero-bounce spring — naturally settles with no hard stop */
const SPRING = { type: "spring" as const, duration: 1, bounce: 0 };

/* # Section header fade */
const headerFade = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: SPRING,
  },
};

/* # Cards container — staggers children */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/* # Individual card — fades up into place */
const cardReveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: SPRING,
  },
};

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative z-10 py-24 sm:py-32 px-4"
    >
      <div className="max-w-7xl mx-auto">

        {/* ---- Section Header — fades in on scroll ---- */}
        <motion.div
          variants={headerFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-sm font-semibold uppercase tracking-widest glow-text-subtle mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            What People{" "}
            <span className="glow-text">Say</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            Join thousands of job seekers who launched their careers with JobPilot AI.
          </p>
        </motion.div>

        {/* ---- Testimonial Cards — staggered fade-in on scroll ---- */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.map((t, index) => (
            <motion.div key={index} variants={cardReveal} className="glass-card p-6 sm:p-8 flex flex-col">
              {/* # Avatar circle with gradient background and initials */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold text-white`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-base">{t.name}</p>
                  <p className="text-sm text-text-muted">{t.role}</p>
                </div>
              </div>

              {/* # Testimonial text */}
              <p className="text-text-secondary text-base leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
