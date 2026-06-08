/* ============================================================
   ECOSYSTEM SHOWCASE - Job Board, Outreach & Portfolio
   ============================================================
   Showcases three platform features below the AI tool showcase:
   1. Job Board Integration — search real listings, save & track
   2. AI Outreach Hub — generate cold outreach messages with AI
   3. Portfolio Builder — 9 templates, resume import, shareable link
   Content slides in from its edge, visual cards from opposite
   side. Internal card elements animate on scroll for premium feel.
   ============================================================ */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* # Zero-bounce spring — naturally settles with no hard stop */
const SPRING = { type: "spring" as const, duration: 1.2, bounce: 0 };

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

/* # Individual bullet */
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

export default function EcosystemShowcase() {
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
            Beyond AI Tools
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Your Complete Career{" "}
            <span className="glow-text">Command Center</span>
          </h2>
          <p className="max-w-xl mx-auto text-text-secondary text-lg">
            Search real jobs, craft perfect outreach, and showcase your work — all from one dashboard.
          </p>
        </motion.div>

        {/* ============================================================
             FEATURE 1 - Job Board Integration
             Content: left → slides from left. Visual: right → slides from right.
             ============================================================ */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center mb-24 sm:mb-32">

          {/* ---- Content Side — slides in from left ---- */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING }}
            className="flex-1 max-w-xl"
          >
            {/* # Feature tag */}
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                Job Board Integration
              </span>
            </div>

            {/* # Headline */}
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Search thousands of jobs without leaving your dashboard
            </h3>

            {/* # Description */}
            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Real listings from Indeed, LinkedIn, Glassdoor, and more — pulled directly into your workspace.
              Save roles with one click and they land straight in your tracker.
            </p>

            {/* # Capability bullets — stagger in */}
            <motion.ul
              variants={bulletStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3"
            >
              {[
                "Search by title, location, and salary across major job boards",
                "One-click save to your Application Tracker",
                "Salary, contract type, and posting date on every listing",
              ].map((cap, j) => (
                <motion.li key={j} variants={bulletItem} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base text-text-secondary leading-relaxed">{cap}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---- Visual Side — slides in from right ---- */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
              {/* # Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600" />

              {/* # Fake browser chrome */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="ml-2 flex-1 h-5 rounded-md bg-space-600/50" />
              </div>

              {/* # Search bar — fades in */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.8, delay: 0.3 }}
                className="flex gap-2 mb-5"
              >
                <div className="flex-1 px-3 py-2 rounded-lg bg-space-700 border border-card-border">
                  <span className="text-xs text-white">Software Engineer</span>
                </div>
                <div className="flex-1 px-3 py-2 rounded-lg bg-space-700 border border-card-border">
                  <span className="text-xs text-text-muted">New York, NY</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <span className="text-xs text-white font-semibold">Search</span>
                </div>
              </motion.div>

              {/* # Results count */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.7, delay: 0.45 }}
                className="text-xs text-text-muted mb-3"
              >
                2,847 jobs found
              </motion.p>

              {/* # Job cards — stagger in one-by-one */}
              <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {/* # Job card 1 */}
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { ...SPRING, duration: 0.8 } } }}
                  className="p-3 rounded-lg bg-space-700/50 border border-card-border mb-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-bold text-white">Senior Software Engineer</div>
                      <div className="text-xs text-text-secondary">TechCorp Inc.</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-green-500/15 border border-green-500/30">
                      <span className="text-[10px] text-green-400 font-semibold">Saved</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-space-600 text-[10px] text-text-secondary">New York, NY</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-[10px] text-green-400">$150k - $200k</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-[10px] text-blue-400">Full Time</span>
                  </div>
                </motion.div>

                {/* # Job card 2 */}
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { ...SPRING, duration: 0.8 } } }}
                  className="p-3 rounded-lg bg-space-700/50 border border-card-border mb-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-bold text-white">Full Stack Developer</div>
                      <div className="text-xs text-text-secondary">InnovateTech</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-brand-indigo/15 border border-brand-indigo/30">
                      <span className="text-[10px] text-brand-light font-semibold">Save Job</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-space-600 text-[10px] text-text-secondary">Remote</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-[10px] text-green-400">$120k - $160k</span>
                    <span className="px-2 py-0.5 rounded-full bg-space-600 text-[10px] text-text-muted">2 days ago</span>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================
             FEATURE 2 - AI Outreach Hub
             Content: right (flex-row-reverse) → slides from right.
             Visual: left → slides from left.
             ============================================================ */}
        <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center">

          {/* ---- Content Side — slides in from right ---- */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING }}
            className="flex-1 max-w-xl"
          >
            {/* # Feature tag */}
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                AI Outreach Hub
              </span>
            </div>

            {/* # Headline */}
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Cold messages that actually get replies
            </h3>

            {/* # Description */}
            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Upload your resume, describe who you&apos;re reaching out to, and AI generates 3 personalized message
              versions — from short and direct to detailed and confident. No more generic templates that get ignored.
            </p>

            {/* # Capability bullets — stagger in */}
            <motion.ul
              variants={bulletStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3"
            >
              {[
                "Upload your resume PDF — AI extracts your background automatically",
                "3 unique message styles: Short & Direct, Confident & Detailed, Natural & Human",
                "References specific details from both your background and the recipient",
              ].map((cap, j) => (
                <motion.li key={j} variants={bulletItem} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base text-text-secondary leading-relaxed">{cap}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---- Visual Side — slides in from left ---- */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
              {/* # Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-600" />

              {/* # Fake browser chrome */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="ml-2 flex-1 h-5 rounded-md bg-space-600/50" />
              </div>

              {/* # Resume uploaded badge — slides in */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.8, delay: 0.3 }}
                className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-space-700/50 border border-card-border"
              >
                <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                <span className="text-[11px] text-white font-medium">resume_2026.pdf</span>
                <span className="text-[9px] text-green-400 ml-auto">Uploaded</span>
              </motion.div>

              {/* # Recipient info — slides in */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.8, delay: 0.45 }}
                className="mb-4 px-3 py-2 rounded-lg bg-space-700/50 border border-card-border"
              >
                <div className="text-[10px] text-text-muted mb-1">Reaching out to:</div>
                <div className="text-xs text-white font-medium">Sarah Chen — Engineering Manager at Google</div>
              </motion.div>

              {/* # 3 message version tabs — stagger in */}
              <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.55 } } }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex gap-2 mb-3"
              >
                {[
                  { label: "Short & Direct", active: true },
                  { label: "Confident", active: false },
                  { label: "Natural", active: false },
                ].map((tab, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { ...SPRING, duration: 0.7 } } }}
                    className={`px-3 py-1.5 rounded-lg ${tab.active ? "bg-brand-indigo/20 border border-brand-indigo/30" : "bg-space-700/50"}`}
                  >
                    <span className={`text-[10px] font-medium ${tab.active ? "text-white" : "text-text-muted"}`}>{tab.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* # Message preview — fades in */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.9, delay: 0.7 }}
                className="p-3 rounded-lg bg-space-700/50 border border-brand-indigo/20 mb-3"
              >
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Hi Sarah, I saw Google&apos;s work on the Gemini API and it caught my attention — I&apos;ve been building AI-powered
                  career tools with it. With 5 years in full-stack development and a focus on AI integration, I&apos;d love to
                  chat about opportunities on your team...
                </p>
              </motion.div>

              {/* # Action buttons — fade in */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.8, delay: 0.85 }}
                className="flex gap-2"
              >
                <div className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-center">
                  <span className="text-[10px] text-white font-semibold">Copy Message</span>
                </div>
                <div className="py-2 px-3 rounded-lg bg-space-700/50 border border-card-border">
                  <span className="text-[10px] text-text-muted">Edit</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================
             FEATURE 3 - Portfolio Builder
             Content: left → slides from left. Visual: right → slides from right.
             ============================================================ */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center mt-24 sm:mt-32">

          {/* ---- Content Side — slides in from left ---- */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING }}
            className="flex-1 max-w-xl"
          >
            {/* # Feature tag */}
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                Portfolio Builder
              </span>
            </div>

            {/* # Headline */}
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              A stunning portfolio site — built in minutes, not days
            </h3>

            {/* # Description */}
            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Pick from 9 premium templates, fill in your details, and publish a professional portfolio
              with a shareable link. Import directly from your resume so you never type the same thing twice.
            </p>

            {/* # Capability bullets — stagger in */}
            <motion.ul
              variants={bulletStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3"
            >
              {[
                "9 designer templates — from minimal to creative to corporate",
                "One-click import from your uploaded resume",
                "Custom slug — share yourname.jobpilotai.co with anyone",
              ].map((cap, j) => (
                <motion.li key={j} variants={bulletItem} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base text-text-secondary leading-relaxed">{cap}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---- Visual Side — slides in from right ---- */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="glass-card relative overflow-hidden">
              {/* # Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />

              {/* # Fake browser chrome */}
              <div className="flex items-center gap-2 px-6 pt-6 sm:px-8 sm:pt-8 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="ml-2 flex-1 h-5 rounded-md bg-space-600/50 flex items-center px-2">
                  <span className="text-[9px] text-text-muted">jobpilotai.co/p/sarah-chen</span>
                </div>
              </div>

              {/* # Mini portfolio page — resembles a real template */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.8, delay: 0.3 }}
              >
                {/* # Hero header with gradient */}
                <div className="mx-4 sm:mx-6 rounded-t-xl bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-indigo-600/10 p-5 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <span className="text-lg font-bold text-white">SC</span>
                    </div>
                    <div>
                      <div className="text-base font-bold text-white">Sarah Chen</div>
                      <div className="text-xs text-violet-200/80">Full Stack Engineer</div>
                      <div className="flex gap-1.5 mt-1.5">
                        {["React", "Node.js", "Python"].map((t, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] text-white/70">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* # Content body */}
                <div className="mx-4 sm:mx-6 rounded-b-xl bg-space-800/80 border border-card-border border-t-0 p-4 mb-4 sm:mb-6 space-y-4">

                  {/* # Skills section with bars */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ ...SPRING, duration: 0.8, delay: 0.5 }}
                  >
                    <div className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2">Skills</div>
                    <div className="space-y-1.5">
                      {[
                        { name: "React / Next.js", pct: 95 },
                        { name: "Python / FastAPI", pct: 88 },
                        { name: "TypeScript", pct: 92 },
                      ].map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[9px] text-text-secondary">{skill.name}</span>
                            <span className="text-[9px] text-text-muted">{skill.pct}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-space-600">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ ...SPRING, duration: 1.2, delay: 0.6 + i * 0.1 }}
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* # Projects section with cards */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ ...SPRING, duration: 0.8, delay: 0.7 }}
                  >
                    <div className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2">Projects</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "AI Career Coach", tech: "Next.js + Gemini" },
                        { name: "DevOps Dashboard", tech: "React + Go" },
                      ].map((proj, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-space-700/50 border border-card-border">
                          <div className="w-full h-8 rounded bg-gradient-to-br from-violet-500/10 to-purple-500/5 mb-2 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-violet-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                            </svg>
                          </div>
                          <div className="text-[10px] font-semibold text-white">{proj.name}</div>
                          <div className="text-[8px] text-text-muted">{proj.tech}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ---- Bottom CTA — fades up on scroll ---- */}
        <motion.div
          variants={ctaFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-24 sm:mt-32 text-center"
        >
          <p className="text-text-secondary text-lg mb-6">
            Find jobs. Craft perfect outreach. Showcase your work. Land interviews.
          </p>
          <Link href="/signup" className="btn-primary text-base px-8 py-4">
            Get Started Free
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
