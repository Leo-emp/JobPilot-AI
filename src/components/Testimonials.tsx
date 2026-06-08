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
    name: "Daniel R.",
    role: "Career Switcher",
    avatar: "DR",
    text: "Went from zero callbacks to 5 interviews in two weeks. The ATS optimization caught formatting issues I never knew existed.",
    color: "bg-blue-600",
  },
  {
    name: "Priya M.",
    role: "Mid-Career Professional",
    avatar: "PM",
    text: "The career pivot feature rewrote my resume to highlight transferable skills I didn't even know I had. Landed a role in a completely new industry.",
    color: "bg-emerald-600",
  },
  {
    name: "James L.",
    role: "Freelancer to Full-Time",
    avatar: "JL",
    text: "Cover letter generated in 30 seconds that was better than anything I spent hours writing. Tailored perfectly to the job description.",
    color: "bg-sky-600",
  },
  {
    name: "Sophie K.",
    role: "Recent Graduate",
    avatar: "SK",
    text: "Interview prep predicted almost the exact questions I was asked. Walked in prepared, stayed calm, and got the offer on the spot.",
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
      className="relative z-10 py-32 sm:py-40 px-4"
    >
      <div className="max-w-7xl mx-auto">

        {/* ---- Section Header — fades in on scroll ---- */}
        <motion.div
          variants={headerFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-20 sm:mb-24"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] glow-text-subtle mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            What People{" "}
            <span className="glow-text">Say</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg font-light">
            Real results from real job seekers using JobPilot AI.
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
              <p className="text-text-secondary text-base leading-relaxed flex-1 font-light">
                &ldquo;{t.text}&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
