/* ============================================================
   FEATURE SHOWCASE - Deep-Dive Feature Sections
   ============================================================
   Full-width alternating sections that explain each core feature
   in depth. Content slides in from its side, visual card slides
   from the opposite side — creates a premium reveal effect.
   Bullet points stagger in. Progress bars animate on scroll.
   ============================================================ */

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* # Zero-bounce spring — naturally settles with no hard stop */
const SPRING = { type: "spring" as const, duration: 1.2, bounce: 0 };
/* # Tween ease for width animations (springs can't animate CSS width smoothly) */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ---- Feature data with detailed breakdowns ---- */
const showcaseFeatures = [
  {
    tag: "Resume Intelligence",
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
    tag: "Resume Rebuild Engine",
    headline: "One job post. One click. A completely new resume.",
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
    tag: "Smart Job Matching",
    headline: "Know your odds before you apply",
    description:
      "Stop wasting time on jobs you won't get. Paste a job description alongside your resume, and our AI calculates a precise match score — showing exactly which skills align, which are missing, and what you need to do to close the gap.",
    capabilities: [
      "Match score from 0-100 with detailed skill breakdown",
      "Matching skills highlighted so you know what to emphasize",
      "Gap analysis showing exactly which skills to add or develop",
      "Actionable recommendations to increase your match percentage",
    ],
    accent: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-500/10 border-sky-500/20",
    iconColor: "text-blue-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    tag: "Interview Prep AI",
    headline: "Walk in knowing what they'll ask",
    description:
      "Our AI predicts the most likely interview questions for any role based on the job description, company, and industry. Then it coaches you through strong answers using the STAR method, grounded in your actual resume experience.",
    capabilities: [
      "10 predicted questions: technical, behavioral, and culture-fit",
      "AI-coached answers based on your real experience and background",
      "STAR method structuring for behavioral questions",
      "Company-specific questions based on the role and industry",
    ],
    accent: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    tag: "Interactive Mock Interview",
    headline: "Practice with an AI interviewer that feels real",
    description:
      "Step into a live mock interview powered by AI. Choose your target role, face realistic questions from a virtual interviewer, and respond with your voice or text — all in a real-time video-call format. Get detailed feedback and scoring after the interview.",
    capabilities: [
      "Real-time AI interviewer with voice and video-call style interface",
      "Role-specific questions tailored to the exact position you're targeting",
      "Respond by voice or text — practice exactly how you'll interview",
      "Comprehensive feedback with scoring and improvement suggestions after the interview",
    ],
    accent: "from-red-500 to-amber-600",
    iconBg: "bg-red-500/10 border-red-500/20",
    iconColor: "text-red-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    tag: "Career Pivot Mode",
    headline: "Switch careers without starting from scratch",
    description:
      "Changing industries is hard — but your experience is more valuable than you think. Our AI identifies transferable skills from your background and reframes your resume for a completely different career path. Same experience, new narrative.",
    capabilities: [
      "Transferable skills mapping between your current and target industry",
      "Experience reframing — same achievements, new industry language",
      "Gap analysis showing what skills to highlight vs. what to learn",
      "Industry-specific keyword injection for your target career",
    ],
    accent: "from-rose-500 to-rose-600",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    tag: "LinkedIn Optimizer",
    headline: "Get found by recruiters, not lost in the feed",
    description:
      "Your LinkedIn profile is your digital storefront. Our AI audits every section — headline, about, experience, skills — with a score out of 100, then rewrites your profile to rank higher in recruiter searches and attract inbound opportunities.",
    capabilities: [
      "Profile score with section-by-section breakdown and priorities",
      "Headline rewrite optimized for recruiter search algorithms",
      "About section that hooks readers in the first 3 visible lines",
      "Skills and hashtag recommendations for maximum discoverability",
    ],
    accent: "from-cyan-500 to-blue-600",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
    <section className="relative z-10 py-24 sm:py-32 px-4">
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
            Every Tool You Need,{" "}
            <span className="glow-text">Nothing You Don&apos;t</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            Each feature is purpose-built to solve a specific problem in your job search.
            No fluff. No gimmicks. Just tools that get you hired.
          </p>
        </motion.div>

        {/* ---- Feature Deep-Dive Sections ---- */}
        <div className="space-y-24 sm:space-y-32">
          {showcaseFeatures.map((feature, index) => {
            /* # Even index: content left, visual right */
            /* # Odd index: content right, visual left (flex-row-reverse) */
            const isEven = index % 2 === 0;

            /* # Resume Templates — special full-width card layout */
            if (index === 7) {
              return (
                <div
                  key={index}
                  id={`showcase-${feature.tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="scroll-mt-24"
                >
                  {/* ---- Text on top ---- */}
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

                  {/* ---- 3 resumes side by side ---- */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ ...SPRING, delay: 0.15 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                  >
                    <FeatureTemplateCard><FeatureStandardATS /></FeatureTemplateCard>
                    <FeatureTemplateCard><FeatureUSATS /></FeatureTemplateCard>
                    <FeatureTemplateCard><FeatureAUCV /></FeatureTemplateCard>
                  </motion.div>
                </div>
              );
            }

            /* # Cover Letter Generator — same text-on-top + 3 card grid layout */
            if (index === 8) {
              return (
                <div
                  key={index}
                  id={`showcase-${feature.tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="scroll-mt-24"
                >
                  {/* ---- Text on top ---- */}
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

                  {/* ---- 3 cover letters side by side ---- */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ ...SPRING, delay: 0.15 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                  >
                    <FeatureCoverLetterCard><FeatureCoverLetter1 /></FeatureCoverLetterCard>
                    <FeatureCoverLetterCard><FeatureCoverLetter2 /></FeatureCoverLetterCard>
                    <FeatureCoverLetterCard><FeatureCoverLetter3 /></FeatureCoverLetterCard>
                  </motion.div>
                </div>
              );
            }

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

                      {index === 1 && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.8, delay: 0.3 }}
                            className="p-3 rounded-lg bg-space-600/40 border-l-2 border-red-400/50"
                          >
                            <div className="text-xs text-red-400 mb-1">Before</div>
                            <div className="text-xs text-text-muted line-through">Responsible for managing team projects</div>
                          </motion.div>
                          <div className="flex justify-center">
                            <motion.svg
                              initial={{ opacity: 0, y: -5 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ ...SPRING, duration: 0.7, delay: 0.5 }}
                              className="w-5 h-5 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </motion.svg>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.8, delay: 0.6 }}
                            className="p-3 rounded-lg bg-space-600/40 border-l-2 border-green-400/50"
                          >
                            <div className="text-xs text-green-400 mb-1">After</div>
                            <div className="text-xs text-white">Spearheaded cross-functional team of 8, delivering 3 projects ahead of schedule and reducing costs by 22%</div>
                          </motion.div>
                        </>
                      )}

                      {index === 2 && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.9, delay: 0.3 }}
                            className="text-center mb-4"
                          >
                            <div className="text-4xl font-bold text-green-400 mb-1">78%</div>
                            <div className="text-xs text-text-muted">Match Score</div>
                          </motion.div>
                          <motion.div
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="space-y-2"
                          >
                            {[
                              { color: "bg-green-400", text: "React, TypeScript, Node.js" },
                              { color: "bg-green-400", text: "3+ years experience" },
                              { color: "bg-amber-400", text: "AWS — mentioned but not emphasized" },
                              { color: "bg-red-400", text: "GraphQL — not found in resume" },
                            ].map((item, i) => (
                              <motion.div
                                key={i}
                                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { ...SPRING, duration: 0.7 } } }}
                                className="flex items-center gap-2"
                              >
                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                <span className="text-xs text-text-secondary">{item.text}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        </>
                      )}

                      {index === 3 && (
                        <>
                          {/* # Job role header */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.8, delay: 0.2 }}
                            className="flex items-center justify-between mb-3"
                          >
                            <div>
                              <div className="text-xs text-text-muted">Preparing for</div>
                              <div className="text-sm font-semibold text-white">Senior Product Manager</div>
                            </div>
                            <div className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                              <span className="text-[10px] text-amber-400 font-medium">10 Questions</span>
                            </div>
                          </motion.div>

                          {/* # Interview questions by type */}
                          <motion.div
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } } }}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="space-y-2"
                          >
                            {[
                              { label: "Behavioral", color: "text-amber-400", border: "border-amber-400/30", q: "“Describe a time you had to influence stakeholders without direct authority”" },
                              { label: "Technical", color: "text-blue-400", border: "border-blue-400/30", q: "“How would you prioritize a backlog with competing business and engineering needs?”" },
                              { label: "Behavioral", color: "text-amber-400", border: "border-amber-400/30", q: "“Tell me about a product launch that didn’t go as planned. What did you learn?”" },
                              { label: "Culture Fit", color: "text-emerald-400", border: "border-emerald-400/30", q: "“How do you build alignment across cross-functional teams?”" },
                              { label: "Technical", color: "text-blue-400", border: "border-blue-400/30", q: "“Walk me through how you’d define success metrics for a new feature”" },
                            ].map((item, i) => (
                              <motion.div
                                key={i}
                                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { ...SPRING, duration: 0.7 } } }}
                                className={`p-2.5 rounded-lg bg-space-600/40 border-l-2 ${item.border}`}
                              >
                                <div className={`text-[10px] ${item.color} font-medium mb-0.5`}>{item.label}</div>
                                <div className="text-[11px] text-white leading-snug">{item.q}</div>
                              </motion.div>
                            ))}
                          </motion.div>

                        </>
                      )}

                      {index === 4 && (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-xs text-text-muted">Mock Interview Session</div>
                              <div className="text-sm font-semibold text-white">Product Lead at Google</div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                              <span className="text-[10px] text-red-400 font-medium">LIVE</span>
                            </div>
                          </div>
                          <div className="rounded-xl overflow-hidden">
                            <Image
                              src="/mock-interview-preview.png"
                              alt="Interactive mock interview with AI interviewer"
                              width={1366}
                              height={768}
                              className="w-full h-auto"
                            />
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                              <span className="text-[10px] text-text-muted">Voice & Text</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span className="text-[10px] text-text-muted">Post-interview feedback</span>
                            </div>
                          </div>
                        </>
                      )}

                      {index === 5 && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.8, delay: 0.3 }}
                            className="p-3 rounded-lg bg-space-600/40 border-l-2 border-rose-400/50 mb-3"
                          >
                            <div className="text-xs text-text-muted mb-1">Current: Marketing Manager</div>
                            <div className="text-xs text-white">7 years in B2B SaaS marketing</div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.7, delay: 0.5 }}
                            className="flex justify-center mb-3"
                          >
                            <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.8, delay: 0.6 }}
                            className="p-3 rounded-lg bg-space-600/40 border-l-2 border-green-400/50 mb-4"
                          >
                            <div className="text-xs text-green-400 mb-1">Target: Product Manager</div>
                            <div className="text-xs text-white">Reframed for product leadership</div>
                          </motion.div>
                          <motion.div
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } } }}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="space-y-2"
                          >
                            {[
                              { color: "bg-green-400", text: "5 transferable skills found" },
                              { color: "bg-amber-400", text: "2 skills to emphasize more" },
                              { color: "bg-red-400", text: "1 certification recommended" },
                            ].map((item, i) => (
                              <motion.div
                                key={i}
                                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { ...SPRING, duration: 0.7 } } }}
                                className="flex items-center gap-2"
                              >
                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                <span className="text-xs text-text-secondary">{item.text}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        </>
                      )}

                      {index === 6 && (
                        <>
                          {/* # Mini LinkedIn profile mockup */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.8, delay: 0.2 }}
                            className="rounded-lg bg-space-600/40 overflow-hidden"
                          >
                            {/* # Banner bar */}
                            <div className="h-10 bg-gradient-to-r from-cyan-600/40 to-blue-600/40" />

                            {/* # Profile header */}
                            <div className="px-3 -mt-5">
                              <div className="flex items-end gap-2.5 mb-2">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-space-700 flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">JD</span>
                                </div>
                                <div className="pb-0.5">
                                  <div className="text-xs font-semibold text-white">Jason Davis</div>
                                  <div className="text-[10px] text-text-muted">Software Engineer</div>
                                </div>
                              </div>
                            </div>

                            {/* # Headline section with AI callout */}
                            <div className="px-3 pb-2">
                              <div className="flex items-start gap-2">
                                <div className="flex-1 p-2 rounded bg-red-500/5 border border-red-500/20 border-dashed">
                                  <div className="text-[10px] text-text-muted leading-snug">&quot;Software Engineer | Problem Solver | Team Player&quot;</div>
                                </div>
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ ...SPRING, duration: 0.6, delay: 0.5 }}
                                  className="flex-shrink-0 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20"
                                >
                                  <span className="text-[8px] text-red-400 font-medium">Weak</span>
                                </motion.div>
                              </div>
                            </div>

                            {/* # About section */}
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ ...SPRING, duration: 0.7, delay: 0.8 }}
                              className="px-3 pb-2.5"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1 p-2 rounded bg-amber-500/5 border border-amber-500/20 border-dashed">
                                  <div className="text-[9px] text-text-muted font-medium mb-0.5">About</div>
                                  <div className="text-[10px] text-text-muted leading-snug">I am a passionate developer who loves building things and solving problems...</div>
                                  <div className="text-[8px] text-amber-400 mt-1">Too generic — lacks metrics, impact, and keywords</div>
                                </div>
                                <div className="flex-shrink-0 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                  <span className="text-[8px] text-amber-400 font-medium">6/10</span>
                                </div>
                              </div>
                            </motion.div>

                            {/* # Experience section */}
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ ...SPRING, duration: 0.7, delay: 0.95 }}
                              className="px-3 pb-2.5"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1 p-2 rounded bg-green-500/5 border border-green-500/20">
                                  <div className="text-[9px] text-text-muted font-medium mb-0.5">Experience</div>
                                  <div className="text-[10px] text-text-secondary leading-snug">Senior Engineer at Lumina Software &bull; 3 yrs</div>
                                  <div className="text-[10px] text-text-secondary leading-snug">Engineer at Apex Digital &bull; 2 yrs</div>
                                </div>
                                <div className="flex-shrink-0 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                                  <span className="text-[8px] text-green-400 font-medium">8/10</span>
                                </div>
                              </div>
                            </motion.div>

                            {/* # Skills section */}
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ ...SPRING, duration: 0.7, delay: 1.1 }}
                              className="px-3 pb-3"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1 p-2 rounded bg-amber-500/5 border border-amber-500/20 border-dashed">
                                  <div className="text-[9px] text-text-muted font-medium mb-1">Skills</div>
                                  <div className="flex flex-wrap gap-1">
                                    {["JavaScript", "React", "Node.js"].map((s, i) => (
                                      <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-space-500/50 text-text-secondary">{s}</span>
                                    ))}
                                    <span className="text-[8px] text-amber-400">+8 missing</span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                  <span className="text-[8px] text-amber-400 font-medium">5/10</span>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>

                          {/* # Overall score bar at bottom */}
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...SPRING, duration: 0.8, delay: 1.25 }}
                            className="flex items-center gap-3 mt-2"
                          >
                            <span className="text-[10px] text-text-muted uppercase tracking-wider">Profile Score</span>
                            <div className="flex-1 h-2 rounded-full bg-space-600 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "62%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: EASE, delay: 1.4 }}
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                              />
                            </div>
                            <span className="text-sm font-bold text-cyan-400">62/100</span>
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
