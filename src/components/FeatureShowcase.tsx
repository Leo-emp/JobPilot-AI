/* ============================================================
   FEATURE SHOWCASE - Deep-Dive Feature Sections
   ============================================================
   Full-width alternating sections that explain each core feature
   in depth. Content slides in from its side, visual card slides
   from the opposite side — creates a premium reveal effect.
   Bullet points stagger in. Progress bars animate on scroll.
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* # Zero-bounce spring — naturally settles with no hard stop */
const SPRING = { type: "spring" as const, duration: 1.2, bounce: 0 };
/* # Tween ease for width animations (springs can't animate CSS width smoothly) */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ---- Feature data with detailed breakdowns ---- */
const showcaseFeatures = [
  {
    tag: "Resume Analyzer",
    headline: "Your resume, decoded by AI in seconds",
    description:
      "Upload your resume and get an instant ATS compatibility score out of 100. Our AI reads your resume the same way Applicant Tracking Systems do — identifying missing keywords, weak formatting, and missed opportunities that cost you interviews.",
    capabilities: [
      "ATS compatibility score with section-by-section breakdown",
      "Missing keyword detection based on your target industry",
      "Formatting analysis — flags tables, images, and headers that ATS can't read",
      "Priority action list ranked by impact on interview callbacks",
    ],
    accent: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    tag: "Resume Intelligence",
    headline: "One job post. One click. ATS friendly resume tailored for each job description.",
    description:
      "Paste any job description and our AI rebuilds your entire resume from scratch — restructured, reworded, and loaded with the exact keywords that hiring managers and ATS systems are scanning for. Your real experience, reframed for maximum impact.",
    capabilities: [
      "Full resume rewrite tailored to a specific job description",
      "Power verb injection — Led, Spearheaded, Engineered, Transformed",
      "Keyword matching that mirrors the job post language naturally",
      "Professional summary rewritten to hook the recruiter in 6 seconds",
    ],
    accent: "from-indigo-500 to-blue-600",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    tag: "Resume Templates",
    headline: "Professional templates, ready in minutes",
    description:
      "Pick from 6 ATS-friendly resume templates designed for different industries and seniority levels. Fill in your details, preview the result live, and download a polished PDF or Word document — no design skills needed.",
    capabilities: [
      "6 professionally designed templates: Classic, Modern, Executive, Minimal, Technical, Creative",
      "Live preview showing exactly how your resume will look when printed",
      "Direct PDF and Word download — no print dialog, no extra steps",
      "Single-column ATS-safe layouts that every hiring system can parse",
    ],
    accent: "from-slate-500 to-slate-400",
    iconBg: "bg-slate-500/10 border-slate-500/20",
    iconColor: "text-slate-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    tag: "Cover Letter Generator",
    headline: "A cover letter that sounds like you, not a robot",
    description:
      "Every cover letter is written from scratch using your actual experience and the specific job requirements. No templates. No fill-in-the-blanks. Just a compelling, human-sounding letter that connects your story to what the employer needs.",
    capabilities: [
      "Unique letter for every application — never the same twice",
      "References your real achievements, projects, and skills",
      "Tone that's confident and professional without being generic",
      "Under 350 words — optimized for how hiring managers actually read",
    ],
    accent: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

/* # Section header fade */
const headerFade = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING, duration: 1 },
  },
};

/* # Bullet stagger container */
const bulletStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

/* # Individual bullet item */
const bulletItem = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { ...SPRING, duration: 0.8 },
  },
};

/* # Bottom CTA fade */
const ctaFade = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING, duration: 1 },
  },
};

export default function FeatureShowcase() {
  return (
    <section id="features" className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ---- Section Header — fades in on scroll ---- */}
        <motion.div
          variants={headerFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-20 sm:mb-28"
        >
          <p className="text-sm font-semibold uppercase tracking-widest glow-text-subtle mb-4">
            Built for Results
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Build Resumes That{" "}
            <span className="glow-text">Get You Interviews</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            Analyze your resume, rebuild it for any job, and download it in a professional template
            — all in one place.
          </p>
        </motion.div>

        {/* ---- Feature Deep-Dive Sections ---- */}
        <div className="space-y-24 sm:space-y-32">
          {showcaseFeatures.map((feature, index) => {
            /* # Even index: content left, visual right */
            /* # Odd index: content right, visual left (flex-row-reverse) */
            const isEven = index % 2 === 0;

            /* # Resume Intelligence — full-width text on top, before/after resumes below */
            if (index === 1) {
              return (
                <div
                  key={index}
                  id="showcase-resume-intelligence"
                  className="scroll-mt-24"
                >
                  {/* ---- Text centered on top ---- */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ ...SPRING }}
                    className="text-center max-w-3xl mx-auto mb-10"
                  >
                    <div className="inline-flex items-center gap-2 mb-5">
                      <div className={`w-8 h-8 rounded-lg ${feature.iconBg} border flex items-center justify-center ${feature.iconColor}`}>
                        {feature.icon}
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                        {feature.tag}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                      {feature.headline}
                    </h3>
                    <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>

                  {/* ---- Before / After resume cards side by side ---- */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
                    {/* # Before — bad, non-ATS-friendly resume */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ ...SPRING, delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">Before</span>
                      </div>
                      <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-red-400/30">
                        <div style={{ aspectRatio: "210/310" }}>
                          <div className="absolute top-0 left-0 origin-top-left" style={{ transform: "scale(0.45)", width: "210mm" }}>
                            <FeatureBadResume />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* # After — clean, ATS-friendly resume */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ ...SPRING, delay: 0.25 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">After</span>
                      </div>
                      <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-green-400/30">
                        <div style={{ aspectRatio: "210/310" }}>
                          <div className="absolute top-0 left-2 origin-top-left" style={{ transform: "scale(0.45)", width: "210mm" }}>
                            <FeatureStandardATS />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            }

            /* # Resume Templates + Cover Letter Generator — tabbed section */
            if (index === 2) {
              const coverLetterFeature = showcaseFeatures[3];
              return (
                <div
                  key={index}
                  id="showcase-resume-templates"
                  className="scroll-mt-24"
                >
                  <TemplatesAndCoverLettersTabs
                    resumeFeature={feature}
                    coverLetterFeature={coverLetterFeature}
                  />
                </div>
              );
            }

            /* # Cover Letter data is rendered inside the tabbed section above */
            if (index === 3) return null;

            return (
              <div
                key={index}
                id={`showcase-${feature.tag.toLowerCase().replace(/\s+/g, "-")}`}
                className={`scroll-mt-24 flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-10 lg:gap-16 items-center`}
              >
                {/* ---- Content Side — slides in from its edge ---- */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -28 : 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ ...SPRING }}
                  className="flex-1 max-w-xl"
                >
                  {/* # Feature tag pill */}
                  <div className="inline-flex items-center gap-2 mb-5">
                    <div className={`w-8 h-8 rounded-lg ${feature.iconBg} border flex items-center justify-center ${feature.iconColor}`}>
                      {feature.icon}
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                      {feature.tag}
                    </span>
                  </div>

                  {/* # Headline */}
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                    {feature.headline}
                  </h3>

                  {/* # Description */}
                  <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* # Capability bullets — stagger in one-by-one */}
                  <motion.ul
                    variants={bulletStagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="space-y-3"
                  >
                    {feature.capabilities.map((cap, j) => (
                      <motion.li key={j} variants={bulletItem} className="flex items-start gap-3">
                        <svg
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.iconColor}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-base text-text-secondary leading-relaxed">
                          {cap}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>

                {/* ---- Visual Side — slides in from opposite edge ---- */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 28 : -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ ...SPRING, delay: 0.15 }}
                  className="flex-1 w-full max-w-lg"
                >
                  <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
                    {/* # Gradient accent bar at top */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.accent}`} />

                    {/* # Simulated UI preview */}
                    <div className="space-y-4">
                      {/* # Each index renders a unique card preview */}
                      {index === 0 && (
                        <>
                          {/* # ATS Score */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-text-muted uppercase tracking-wider">ATS Score</span>
                            <span className="text-2xl font-bold text-green-400">87/100</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-space-600 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "87%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
                              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                            />
                          </div>

                          {/* # Score Breakdown */}
                          <div className="grid grid-cols-4 gap-2 mt-3">
                            {[
                              { label: "Structure", score: "23/25", color: "text-green-400" },
                              { label: "Writing", score: "22/25", color: "text-green-400" },
                              { label: "ATS", score: "24/25", color: "text-green-400" },
                              { label: "Content", score: "18/25", color: "text-amber-400" },
                            ].map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ ...SPRING, duration: 0.7, delay: 0.5 + i * 0.08 }}
                                className="text-center p-2 rounded-lg bg-space-600/40"
                              >
                                <div className={`text-xs font-semibold ${item.color}`}>{item.score}</div>
                                <div className="text-[10px] text-text-muted mt-0.5">{item.label}</div>
                              </motion.div>
                            ))}
                          </div>

                          {/* # Strengths + Areas to Improve side by side */}
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ ...SPRING, duration: 0.8, delay: 0.7 }}
                              className="p-2.5 rounded-lg bg-space-600/40"
                            >
                              <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider mb-1.5">Strengths</div>
                              <div className="space-y-1">
                                {["Strong action verbs", "Quantified achievements", "Clean ATS layout"].map((s, i) => (
                                  <div key={i} className="flex items-center gap-1.5">
                                    <svg className="w-3 h-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span className="text-[10px] text-text-secondary">{s}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ ...SPRING, duration: 0.8, delay: 0.85 }}
                              className="p-2.5 rounded-lg bg-space-600/40"
                            >
                              <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-1.5">Improve</div>
                              <div className="space-y-1">
                                {["Add industry keywords", "Strengthen summary", "Add certifications"].map((s, i) => (
                                  <div key={i} className="flex items-center gap-1.5">
                                    <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                    <span className="text-[10px] text-text-secondary">{s}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          </div>

                          {/* # Suggested Keywords + Formatting */}
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ ...SPRING, duration: 0.8, delay: 1.0 }}
                              className="p-2.5 rounded-lg bg-space-600/40"
                            >
                              <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mb-1.5">Keywords</div>
                              <div className="flex flex-wrap gap-1">
                                {["React", "TypeScript", "CI/CD", "Agile", "AWS"].map((kw, i) => (
                                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">{kw}</span>
                                ))}
                              </div>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ ...SPRING, duration: 0.8, delay: 1.1 }}
                              className="p-2.5 rounded-lg bg-space-600/40"
                            >
                              <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-1.5">Formatting</div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-[10px] text-text-secondary">ATS-safe layout</span></div>
                                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-[10px] text-text-secondary">Standard headers</span></div>
                                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="text-[10px] text-text-secondary">Dates inconsistent</span></div>
                              </div>
                            </motion.div>
                          </div>

                          {/* # Next Steps */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.8, delay: 1.2 }}
                            className="mt-2 p-2.5 rounded-lg bg-space-600/40"
                          >
                            <div className="text-[10px] text-brand-light font-semibold uppercase tracking-wider mb-1.5">Next Steps</div>
                            <div className="space-y-1">
                              {["1. Add 5 missing industry keywords", "2. Rewrite summary with metrics", "3. Use Deep Tailor for job-specific targeting"].map((s, i) => (
                                <div key={i} className="text-[10px] text-text-secondary">{s}</div>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}


                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ---- Bottom CTA — fades up on scroll ---- */}
        <motion.div
          variants={ctaFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 sm:mt-20 text-center"
        >
          <p className="text-text-secondary text-lg mb-6">
            Every tool you need. One platform. Zero guesswork.
          </p>
          <Link href="/signup" className="btn-primary text-base px-8 py-4">
            Start Optimizing for Free
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* # Tabbed component combining Resume Templates + Cover Letter Generator */
function TemplatesAndCoverLettersTabs({
  resumeFeature,
  coverLetterFeature,
}: {
  resumeFeature: (typeof showcaseFeatures)[0];
  coverLetterFeature: (typeof showcaseFeatures)[0];
}) {
  const [activeTab, setActiveTab] = useState<"resumes" | "coverLetters">("resumes");
  const feature = activeTab === "resumes" ? resumeFeature : coverLetterFeature;

  return (
    <>
      {/* ---- Tab toggle buttons ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ ...SPRING }}
        className="flex justify-center gap-3 mb-8"
      >
        <button
          onClick={() => setActiveTab("resumes")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
            activeTab === "resumes"
              ? "bg-brand-indigo/20 border-brand-indigo/40 text-white"
              : "bg-space-700/40 border-card-border text-text-secondary hover:text-white hover:border-white/20"
          }`}
        >
          Resume Templates
        </button>
        <button
          onClick={() => setActiveTab("coverLetters")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
            activeTab === "coverLetters"
              ? "bg-emerald-500/20 border-emerald-500/40 text-white"
              : "bg-space-700/40 border-card-border text-text-secondary hover:text-white hover:border-white/20"
          }`}
        >
          Cover Letter Generator
        </button>
      </motion.div>

      {/* ---- Text — switches based on active tab ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ ...SPRING }}
        className="text-center max-w-3xl mx-auto mb-10"
      >
        <div className="inline-flex items-center gap-2 mb-5">
          <div className={`w-8 h-8 rounded-lg ${feature.iconBg} border flex items-center justify-center ${feature.iconColor}`}>
            {feature.icon}
          </div>
          <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
            {feature.tag}
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
          {feature.headline}
        </h3>
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
          {feature.description}
        </p>
      </motion.div>

      {/* ---- 3 cards grid — switches content based on active tab ---- */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        {activeTab === "resumes" ? (
          <>
            <FeatureTemplateCard><FeatureStandardATS /></FeatureTemplateCard>
            <FeatureTemplateCard><FeatureUSATS /></FeatureTemplateCard>
            <FeatureTemplateCard><FeatureAUCV /></FeatureTemplateCard>
          </>
        ) : (
          <>
            <FeatureCoverLetterCard><FeatureCoverLetter1 /></FeatureCoverLetterCard>
            <FeatureCoverLetterCard><FeatureCoverLetter2 /></FeatureCoverLetterCard>
            <FeatureCoverLetterCard><FeatureCoverLetter3 /></FeatureCoverLetterCard>
          </>
        )}
      </motion.div>
    </>
  );
}

function FeatureTemplateCard({ children }: { children: React.ReactNode }) {
  return (
    <Link href="/tools/resume-templates" className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white">
        <div style={{ aspectRatio: "210/310" }}>
          <div className="absolute top-0 left-2 origin-top-left" style={{ transform: "scale(0.45)", width: "210mm" }}>
            {children}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* # Cover letter card — shorter aspect ratio since cover letters have less content */
function FeatureCoverLetterCard({ children }: { children: React.ReactNode }) {
  return (
    <Link href="/tools/cover-letter" className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white">
        <div style={{ aspectRatio: "210/260" }}>
          <div className="absolute top-0 left-0 origin-top-left" style={{ transform: "scale(0.55)", width: "170mm" }}>
            {children}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeatureStandardATS() {
  return (
    <div className="bg-white text-black p-10 font-[Arial,Helvetica,sans-serif]" style={{ width: "210mm", fontSize: 16 }}>
      <div className="mb-1">
        <h1 className="text-[32px] font-bold text-black leading-tight">Olivia Wilson</h1>
        <p className="text-[13px] text-gray-600 mt-1">New York, NY &bull; +1 (555) 123-4567 &bull; olivia.wilson@email.com &bull; linkedin.com/in/oliviawilson</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[15px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Professional Summary</h2>
        <p className="text-[13px] text-gray-800 leading-relaxed">Results-driven marketing manager with 6+ years of experience in digital strategy, brand development, and campaign optimization. Proven track record of increasing revenue by 35% through data-driven marketing initiatives and cross-functional team leadership. Skilled at translating business objectives into measurable marketing outcomes.</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[15px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Core Skills</h2>
        <p className="text-[13px] text-gray-800 leading-relaxed">Strategy &amp; Growth: Brand Strategy, Go-to-Market, Market Research, Campaign Planning</p>
        <p className="text-[13px] text-gray-800 leading-relaxed">Digital Marketing: SEO/SEM, Google Analytics, Social Media, Content Marketing, A/B Testing</p>
        <p className="text-[13px] text-gray-800 leading-relaxed">Leadership: Team Management, Stakeholder Communication, Budget Oversight, Cross-functional Collaboration</p>
        <p className="text-[13px] text-gray-800 leading-relaxed">Tools: HubSpot, Salesforce, Google Ads, Meta Business Suite, Tableau</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[15px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-3">Work Experience</h2>
        <div className="mb-4">
          <div className="flex justify-between items-baseline">
            <p className="text-[14px] font-bold text-black">Senior Marketing Manager, Brightwave Inc.</p>
            <p className="text-[13px] text-gray-600">2022 - Present</p>
          </div>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Spearheaded digital campaigns generating $2.4M in annual revenue, exceeding targets by 35%</li>
            <li className="text-[13px] text-gray-800">Managed a team of 6 across content, social, and paid media, delivering 95% on-time project completion</li>
            <li className="text-[13px] text-gray-800">Optimized conversion funnel through A/B testing, increasing lead-to-customer rate by 28%</li>
            <li className="text-[13px] text-gray-800">Launched brand refresh initiative that improved brand recognition scores by 40% in key markets</li>
          </ul>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-baseline">
            <p className="text-[14px] font-bold text-black">Marketing Specialist, Greenfield Co.</p>
            <p className="text-[13px] text-gray-600">2019 - 2022</p>
          </div>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Executed multi-channel campaigns across email, social, and PPC, driving 150% increase in qualified leads</li>
            <li className="text-[13px] text-gray-800">Built and maintained marketing analytics dashboard tracking $1.2M in campaign spend</li>
            <li className="text-[13px] text-gray-800">Developed content strategy that grew organic traffic by 85% over 18 months</li>
            <li className="text-[13px] text-gray-800">Coordinated with sales team to create enablement materials, reducing sales cycle by 15%</li>
          </ul>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-baseline">
            <p className="text-[14px] font-bold text-black">Marketing Coordinator, Apex Media</p>
            <p className="text-[13px] text-gray-600">2017 - 2019</p>
          </div>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Managed social media accounts with 50K+ combined followers, increasing engagement by 60%</li>
            <li className="text-[13px] text-gray-800">Coordinated event marketing for 12 annual conferences, managing $200K in event budgets</li>
            <li className="text-[13px] text-gray-800">Created monthly performance reports for C-suite, synthesizing data from 8 marketing channels</li>
            <li className="text-[13px] text-gray-800">Assisted with website redesign project that improved bounce rate by 25%</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[15px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Education</h2>
        <div className="mb-2">
          <div className="flex justify-between items-baseline">
            <p className="text-[14px] font-bold text-black">MBA Marketing, Columbia University, New York</p>
            <p className="text-[13px] text-gray-600">2017</p>
          </div>
          <ul className="mt-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Dean&apos;s List, Marketing Excellence Award</li>
          </ul>
        </div>
        <div className="mb-2">
          <div className="flex justify-between items-baseline">
            <p className="text-[14px] font-bold text-black">BA Communications, Boston University</p>
            <p className="text-[13px] text-gray-600">2015</p>
          </div>
          <ul className="mt-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Graduated Magna Cum Laude, GPA: 3.8/4.0</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[15px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Certifications and Trainings</h2>
        <p className="text-[13px] text-gray-800">Google Analytics Certified — 2023</p>
        <p className="text-[13px] text-gray-800">HubSpot Content Marketing Certification — 2022</p>
        <p className="text-[13px] text-gray-800">Meta Certified Digital Marketing Associate — 2021</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[15px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Languages</h2>
        <p className="text-[13px] text-gray-800">English - Native</p>
        <p className="text-[13px] text-gray-800">Spanish - Conversational</p>
      </div>
    </div>
  );
}

function FeatureUSATS() {
  return (
    <div className="bg-white text-black p-10 font-[Arial,Helvetica,sans-serif]" style={{ width: "210mm", fontSize: 16 }}>
      <div className="text-center mb-1">
        <h1 className="text-[30px] font-bold text-black leading-tight">Olivia Wilson</h1>
        <p className="text-[13px] text-gray-600 mt-1">New York, NY &bull; +1 (555) 123-4567 &bull; olivia.wilson@email.com &bull; linkedin.com/in/oliviawilson</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-widest text-center mb-1">Professional Summary</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[13px] text-gray-800 leading-relaxed">Results-driven marketing manager with 6+ years of experience in digital strategy, brand development, and campaign optimization. Proven track record of increasing revenue by 35% through data-driven marketing initiatives and cross-functional team leadership. Skilled at translating business objectives into measurable marketing outcomes.</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-widest text-center mb-1">Work Experience</h2>
        <div className="border-t border-gray-300 mb-3" />
        <div className="mb-4">
          <p className="text-[14px] font-bold text-black">Senior Marketing Manager, Brightwave Inc. — 2022 - Present</p>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Spearheaded digital campaigns generating $2.4M in annual revenue, exceeding targets by 35%</li>
            <li className="text-[13px] text-gray-800">Managed a team of 6 across content, social, and paid media, delivering 95% on-time project completion</li>
            <li className="text-[13px] text-gray-800">Optimized conversion funnel through A/B testing, increasing lead-to-customer rate by 28%</li>
            <li className="text-[13px] text-gray-800">Launched brand refresh initiative that improved brand recognition scores by 40% in key markets</li>
          </ul>
        </div>
        <div className="mb-4">
          <p className="text-[14px] font-bold text-black">Marketing Specialist, Greenfield Co. — 2019 - 2022</p>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Executed multi-channel campaigns across email, social, and PPC, driving 150% increase in qualified leads</li>
            <li className="text-[13px] text-gray-800">Built and maintained marketing analytics dashboard tracking $1.2M in campaign spend</li>
            <li className="text-[13px] text-gray-800">Developed content strategy that grew organic traffic by 85% over 18 months</li>
            <li className="text-[13px] text-gray-800">Coordinated with sales team to create enablement materials, reducing sales cycle by 15%</li>
          </ul>
        </div>
        <div className="mb-4">
          <p className="text-[14px] font-bold text-black">Marketing Coordinator, Apex Media — 2017 - 2019</p>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Managed social media accounts with 50K+ combined followers, increasing engagement by 60%</li>
            <li className="text-[13px] text-gray-800">Coordinated event marketing for 12 annual conferences, managing $200K in event budgets</li>
            <li className="text-[13px] text-gray-800">Created monthly performance reports for C-suite, synthesizing data from 8 marketing channels</li>
            <li className="text-[13px] text-gray-800">Assisted with website redesign project that improved bounce rate by 25%</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-widest text-center mb-1">Core Skills</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[13px] text-gray-800 leading-relaxed">Strategy &amp; Growth: Brand Strategy, Go-to-Market, Market Research, Campaign Planning</p>
        <p className="text-[13px] text-gray-800 leading-relaxed">Digital Marketing: SEO/SEM, Google Analytics, Social Media, Content Marketing, A/B Testing</p>
        <p className="text-[13px] text-gray-800 leading-relaxed">Leadership: Team Management, Stakeholder Communication, Budget Oversight, Cross-functional Collaboration</p>
        <p className="text-[13px] text-gray-800 leading-relaxed">Tools: HubSpot, Salesforce, Google Ads, Meta Business Suite, Tableau</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-widest text-center mb-1">Education</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[13px] text-gray-800">MBA Marketing, Columbia University, New York — 2017</p>
        <ul className="list-disc list-outside ml-5">
          <li className="text-[13px] text-gray-800">Dean&apos;s List, Marketing Excellence Award</li>
        </ul>
        <p className="text-[13px] text-gray-800 mt-2">BA Communications, Boston University — 2015</p>
        <ul className="list-disc list-outside ml-5">
          <li className="text-[13px] text-gray-800">Graduated Magna Cum Laude, GPA: 3.8/4.0</li>
        </ul>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-widest text-center mb-1">Certifications and Trainings</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[13px] text-gray-800">Google Analytics Certified — 2023</p>
        <p className="text-[13px] text-gray-800">HubSpot Content Marketing Certification — 2022</p>
        <p className="text-[13px] text-gray-800">Meta Certified Digital Marketing Associate — 2021</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-widest text-center mb-1">Languages</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[13px] text-gray-800">English - Native</p>
        <p className="text-[13px] text-gray-800">Spanish - Conversational</p>
      </div>
    </div>
  );
}

function FeatureAUCV() {
  return (
    <div className="bg-white text-black p-10 font-[Arial,Helvetica,sans-serif]" style={{ width: "210mm", fontSize: 16 }}>
      <div className="mb-1">
        <h1 className="text-[30px] font-bold text-black leading-tight">Olivia Wilson</h1>
        <p className="text-[12px] text-gray-500 mt-1">New York, NY &bull; +1 (555) 123-4567 &bull; olivia.wilson@email.com &bull; linkedin.com/in/oliviawilson</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-wide mb-2">Professional Summary</h2>
        <p className="text-[13px] text-gray-800 leading-relaxed">Results-driven marketing manager with 6+ years of experience in digital strategy, brand development, and campaign optimization. Proven track record of increasing revenue by 35% through data-driven marketing initiatives and cross-functional team leadership. Skilled at translating business objectives into measurable marketing outcomes.</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-wide mb-2">Key Skills</h2>
        <p className="text-[13px] text-gray-800 leading-relaxed">Brand Strategy | Go-to-Market | Market Research | Campaign Planning | SEO/SEM | Google Analytics | Social Media | Content Marketing | A/B Testing | Team Management | Stakeholder Communication | Budget Oversight | Cross-functional Collaboration | HubSpot | Salesforce | Tableau</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-wide mb-3">Professional Experience</h2>
        <div className="mb-4">
          <p className="text-[14px] font-bold text-black">Senior Marketing Manager — 2022 - Present</p>
          <p className="text-[13px] text-gray-600 mb-1">Brightwave Inc.</p>
          <ul className="space-y-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Spearheaded digital campaigns generating $2.4M in annual revenue, exceeding targets by 35%</li>
            <li className="text-[13px] text-gray-800">Managed a team of 6 across content, social, and paid media, delivering 95% on-time project completion</li>
            <li className="text-[13px] text-gray-800">Optimized conversion funnel through A/B testing, increasing lead-to-customer rate by 28%</li>
            <li className="text-[13px] text-gray-800">Launched brand refresh initiative that improved brand recognition scores by 40% in key markets</li>
          </ul>
        </div>
        <div className="mb-4">
          <p className="text-[14px] font-bold text-black">Marketing Specialist — 2019 - 2022</p>
          <p className="text-[13px] text-gray-600 mb-1">Greenfield Co.</p>
          <ul className="space-y-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Executed multi-channel campaigns across email, social, and PPC, driving 150% increase in qualified leads</li>
            <li className="text-[13px] text-gray-800">Built and maintained marketing analytics dashboard tracking $1.2M in campaign spend</li>
            <li className="text-[13px] text-gray-800">Developed content strategy that grew organic traffic by 85% over 18 months</li>
            <li className="text-[13px] text-gray-800">Coordinated with sales team to create enablement materials, reducing sales cycle by 15%</li>
          </ul>
        </div>
        <div className="mb-4">
          <p className="text-[14px] font-bold text-black">Marketing Coordinator — 2017 - 2019</p>
          <p className="text-[13px] text-gray-600 mb-1">Apex Media</p>
          <ul className="space-y-0.5 list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Managed social media accounts with 50K+ combined followers, increasing engagement by 60%</li>
            <li className="text-[13px] text-gray-800">Coordinated event marketing for 12 annual conferences, managing $200K in event budgets</li>
            <li className="text-[13px] text-gray-800">Created monthly performance reports for C-suite, synthesizing data from 8 marketing channels</li>
            <li className="text-[13px] text-gray-800">Assisted with website redesign project that improved bounce rate by 25%</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-wide mb-2">Education &amp; Qualifications</h2>
        <div className="mb-2">
          <p className="text-[13px] text-gray-800">MBA Marketing, Columbia University, New York — 2017</p>
          <ul className="list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Dean&apos;s List, Marketing Excellence Award</li>
          </ul>
        </div>
        <div className="mb-2">
          <p className="text-[13px] text-gray-800">BA Communications, Boston University — 2015</p>
          <ul className="list-disc list-outside ml-5">
            <li className="text-[13px] text-gray-800">Graduated Magna Cum Laude, GPA: 3.8/4.0</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-wide mb-2">Professional Development</h2>
        <p className="text-[13px] text-gray-800">Google Analytics Certified — 2023</p>
        <p className="text-[13px] text-gray-800">HubSpot Content Marketing Certification — 2022</p>
        <p className="text-[13px] text-gray-800">Meta Certified Digital Marketing Associate — 2021</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[14px] font-bold text-black uppercase tracking-wide mb-2">Languages</h2>
        <p className="text-[13px] text-gray-800">English - Native</p>
        <p className="text-[13px] text-gray-800">Spanish - Conversational</p>
      </div>
    </div>
  );
}

/* # Bad resume — two-column sidebar layout with every common non-ATS mistake */
function FeatureBadResume() {
  return (
    <div className="bg-white text-black font-[Arial,Helvetica,sans-serif] flex" style={{ width: "210mm", fontSize: 16, minHeight: "320mm" }}>
      {/* # Dark sidebar — ATS can't parse multi-column layouts */}
      <div className="w-[70mm] bg-slate-800 text-white p-8 shrink-0" style={{ minHeight: "320mm" }}>
        {/* # Photo placeholder — ATS ignores images, wastes space */}
        <div className="w-28 h-28 rounded-full bg-slate-600 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-14 h-14 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        <h1 className="text-[22px] font-bold text-center leading-tight mb-1">Olivia Wilson</h1>
        <p className="text-[11px] text-slate-300 text-center mb-6">Marketing Professional</p>

        {/* # Contact with icons — ATS can't read icon fonts */}
        <div className="space-y-2 mb-8">
          <p className="text-[11px] text-slate-300 flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-slate-600 flex items-center justify-center text-[8px]">@</span>
            olivia.w@email.com
          </p>
          <p className="text-[11px] text-slate-300 flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-slate-600 flex items-center justify-center text-[8px]">#</span>
            555-123-4567
          </p>
          <p className="text-[11px] text-slate-300 flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-slate-600 flex items-center justify-center text-[8px]">in</span>
            linkedin.com/olivia
          </p>
        </div>

        {/* # Skills as progress bars — ATS reads 0% of this */}
        <div className="mb-8">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider mb-3">Skills</h2>
          {[
            { name: "Marketing", pct: "85%" },
            { name: "Social Media", pct: "90%" },
            { name: "Teamwork", pct: "95%" },
            { name: "Communication", pct: "88%" },
            { name: "MS Office", pct: "80%" },
          ].map((s) => (
            <div key={s.name} className="mb-2">
              <p className="text-[10px] text-slate-300 mb-0.5">{s.name}</p>
              <div className="w-full h-1.5 rounded-full bg-slate-600">
                <div className="h-full rounded-full bg-sky-400" style={{ width: s.pct }} />
              </div>
            </div>
          ))}
        </div>

        {/* # Hobbies — irrelevant, wastes space */}
        <div>
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider mb-3">Hobbies</h2>
          <p className="text-[10px] text-slate-300 leading-relaxed">Yoga, Travel, Reading, Photography, Cooking, Gardening</p>
        </div>
      </div>

      {/* # Main content — weak writing, no metrics, paragraph dumps */}
      <div className="flex-1 p-8">
        {/* # No professional summary section */}
        <div className="mb-6">
          <h2 className="text-[14px] font-bold text-sky-600 uppercase tracking-wider mb-3">About Me</h2>
          <p className="text-[12px] text-gray-600 leading-relaxed">
            I am a hardworking and passionate marketing professional who loves creating campaigns and working with teams. I am looking for a challenging position where I can use my skills and grow my career.
          </p>
        </div>

        {/* # Work experience — no achievements, no numbers, vague descriptions */}
        <div className="mb-6">
          <h2 className="text-[14px] font-bold text-sky-600 uppercase tracking-wider mb-3">Work Experience</h2>

          <div className="mb-4">
            <p className="text-[13px] font-bold text-black">Marketing Manager</p>
            <p className="text-[11px] text-gray-500 mb-1">Brightwave Inc. | Jan 2022 - Current</p>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              Responsible for managing marketing campaigns and overseeing the team. Helped with social media and content creation. Worked on various projects and assisted with brand strategy. Attended meetings and coordinated with other departments.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-[13px] font-bold text-black">Marketing Specialist</p>
            <p className="text-[11px] text-gray-500 mb-1">Greenfield Co. | 2019 - 2022</p>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              Handled marketing tasks including email campaigns and social media posts. Was responsible for updating the website and creating reports. Helped the sales team with materials.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-[13px] font-bold text-black">Marketing Intern</p>
            <p className="text-[11px] text-gray-500 mb-1">Apex Media | Summer 2017</p>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              Assisted with day-to-day marketing tasks. Updated social media accounts. Filed paperwork and organized events. Learned about marketing.
            </p>
          </div>
        </div>

        {/* # Education — minimal detail */}
        <div className="mb-6">
          <h2 className="text-[14px] font-bold text-sky-600 uppercase tracking-wider mb-3">Education</h2>
          <p className="text-[12px] text-gray-800">MBA - Columbia University (2017)</p>
          <p className="text-[12px] text-gray-800 mt-1">BA Communications - Boston University (2015)</p>
        </div>

        {/* # References available — outdated, wastes space */}
        <div>
          <h2 className="text-[14px] font-bold text-sky-600 uppercase tracking-wider mb-2">References</h2>
          <p className="text-[12px] text-gray-500 italic">Available upon request</p>
        </div>
      </div>
    </div>
  );
}

/* # Cover Letter 1 — Software Engineer applying for Senior Frontend role */
function FeatureCoverLetter1() {
  return (
    <div className="bg-white text-black px-12 py-10 font-[Arial,Helvetica,sans-serif]" style={{ width: "170mm", fontSize: 16 }}>
      {/* # Header — name and contact */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-black leading-tight">Sarah Chen</h1>
        <p className="text-[13px] text-gray-600 mt-1">San Francisco, CA &bull; +1 (415) 892-3047 &bull; sarah.chen@email.com &bull; linkedin.com/in/sarahchen</p>
      </div>

      {/* # Date */}
      <p className="text-[13px] text-gray-800 mb-6">September 10, 2026</p>

      {/* # Salutation */}
      <p className="text-[13px] text-gray-800 mb-4">Dear Hiring Manager,</p>

      {/* # Body paragraphs */}
      <p className="text-[13px] text-gray-800 leading-relaxed mb-4">
        I am writing to express my strong interest in the Senior Frontend Engineer position at Veritas Technologies. With over five years of experience building high-performance web applications using React, TypeScript, and Next.js, I am confident that my technical expertise and passion for delivering exceptional user experiences make me an ideal candidate for this role.
      </p>

      <p className="text-[13px] text-gray-800 leading-relaxed mb-4">
        In my current role as a Frontend Engineer at Lumina Software, I led the complete redesign of our customer-facing dashboard, which resulted in a 42% increase in user engagement and a 28% reduction in support tickets. I architected a component library used across four product teams, reducing development time by 35% and establishing consistent design patterns that improved our Lighthouse performance score from 62 to 94.
      </p>

      <p className="text-[13px] text-gray-800 leading-relaxed mb-4">
        What excites me most about Veritas Technologies is your commitment to building accessible, performant interfaces that serve millions of users daily. My experience optimizing rendering pipelines, implementing code-splitting strategies, and mentoring junior developers aligns directly with the challenges your team is tackling. I have also contributed to open-source projects in the React ecosystem, including performance monitoring tools that have been adopted by over 2,000 developers.
      </p>

      <p className="text-[13px] text-gray-800 leading-relaxed mb-6">
        I would welcome the opportunity to discuss how my background in scalable frontend architecture and my track record of shipping impactful features can contribute to your team&apos;s goals. Thank you for considering my application, and I look forward to the possibility of contributing to Veritas Technologies&apos; continued success.
      </p>

      {/* # Sign-off */}
      <p className="text-[13px] text-gray-800 mb-1">Sincerely,</p>
      <p className="text-[13px] font-bold text-black">Sarah Chen</p>
    </div>
  );
}

/* # Cover Letter 2 — Product Manager applying for Senior PM role */
function FeatureCoverLetter2() {
  return (
    <div className="bg-white text-black px-12 py-10 font-[Arial,Helvetica,sans-serif]" style={{ width: "170mm", fontSize: 16 }}>
      {/* # Header — name and contact */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-black leading-tight">James Rodriguez</h1>
        <p className="text-[13px] text-gray-600 mt-1">Austin, TX &bull; +1 (512) 734-1985 &bull; james.rodriguez@email.com &bull; linkedin.com/in/jamesrodriguez</p>
      </div>

      {/* # Date */}
      <p className="text-[13px] text-gray-800 mb-6">September 10, 2026</p>

      {/* # Salutation */}
      <p className="text-[13px] text-gray-800 mb-4">Dear Hiring Manager,</p>

      {/* # Body paragraphs */}
      <p className="text-[13px] text-gray-800 leading-relaxed mb-4">
        I am excited to apply for the Senior Product Manager position at CloudScale. Having spent the past six years building and scaling B2B SaaS products from concept to market leadership, I bring a data-driven approach to product strategy that I believe aligns perfectly with CloudScale&apos;s mission to simplify enterprise infrastructure management.
      </p>

      <p className="text-[13px] text-gray-800 leading-relaxed mb-4">
        At my current company, Meridian Analytics, I own the product roadmap for our core analytics platform, which serves over 800 enterprise clients and generates $18M in annual recurring revenue. I led the launch of our real-time data pipeline feature, which became our fastest-adopted feature in company history with 340 enterprise accounts onboarded within the first quarter. This initiative alone contributed $3.2M in new ARR and reduced customer churn by 18%.
      </p>

      <p className="text-[13px] text-gray-800 leading-relaxed mb-4">
        What draws me to CloudScale is your focus on making complex infrastructure accessible to engineering teams of all sizes. My experience translating technical complexity into intuitive user workflows, combined with my background in cross-functional leadership across engineering, design, and go-to-market teams, positions me to drive meaningful impact. I have consistently delivered products that achieve both user satisfaction scores above 4.5 and measurable business outcomes.
      </p>

      <p className="text-[13px] text-gray-800 leading-relaxed mb-6">
        I would love the opportunity to discuss how my product leadership experience and my passion for developer tools can contribute to CloudScale&apos;s next phase of growth. Thank you for your time and consideration, and I look forward to hearing from you.
      </p>

      {/* # Sign-off */}
      <p className="text-[13px] text-gray-800 mb-1">Sincerely,</p>
      <p className="text-[13px] font-bold text-black">James Rodriguez</p>
    </div>
  );
}

/* # Cover Letter 3 — Data Analyst applying for Senior Analyst role at consulting firm */
function FeatureCoverLetter3() {
  return (
    <div className="bg-white text-black px-12 py-10 font-[Arial,Helvetica,sans-serif]" style={{ width: "170mm", fontSize: 16 }}>
      {/* # Header — name and contact */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-black leading-tight">Priya Sharma</h1>
        <p className="text-[13px] text-gray-600 mt-1">London, UK &bull; +44 7911 234 567 &bull; priya.sharma@email.com &bull; linkedin.com/in/priyasharma</p>
      </div>

      {/* # Date */}
      <p className="text-[13px] text-gray-800 mb-6">September 10, 2026</p>

      {/* # Salutation */}
      <p className="text-[13px] text-gray-800 mb-4">Dear Hiring Manager,</p>

      {/* # Body paragraphs */}
      <p className="text-[13px] text-gray-800 leading-relaxed mb-4">
        I am writing to apply for the Senior Data Analyst position at McKenzie &amp; Partners. With four years of experience transforming complex datasets into actionable business intelligence for Fortune 500 clients, I am eager to bring my analytical expertise and consulting mindset to your growing analytics practice.
      </p>

      <p className="text-[13px] text-gray-800 leading-relaxed mb-4">
        In my current role at Stratton Consulting Group, I lead data analysis engagements across financial services and healthcare sectors. Most recently, I designed a predictive customer segmentation model for a major retail banking client that identified $14M in untapped cross-selling opportunities and improved campaign conversion rates by 45%. I also built an automated reporting pipeline using Python and Tableau that reduced weekly reporting time from 12 hours to 45 minutes across three client accounts.
      </p>

      <p className="text-[13px] text-gray-800 leading-relaxed mb-4">
        McKenzie &amp; Partners&apos; reputation for delivering data-driven transformation to global enterprises is what makes this opportunity particularly compelling. My proficiency in SQL, Python, R, and advanced statistical modelling, combined with my ability to communicate complex findings to C-suite stakeholders in clear, actionable terms, aligns directly with the consultative approach your firm is known for. I thrive in client-facing environments and have consistently received top satisfaction ratings from engagement partners.
      </p>

      <p className="text-[13px] text-gray-800 leading-relaxed mb-6">
        I would be delighted to discuss how my experience in data strategy and client engagement can contribute to McKenzie &amp; Partners&apos; continued growth. Thank you for considering my application, and I look forward to the opportunity to speak with you further.
      </p>

      {/* # Sign-off */}
      <p className="text-[13px] text-gray-800 mb-1">Sincerely,</p>
      <p className="text-[13px] font-bold text-black">Priya Sharma</p>
    </div>
  );
}
