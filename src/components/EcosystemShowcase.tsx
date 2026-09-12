/* ============================================================
   ECOSYSTEM SHOWCASE - Career Command Center
   ============================================================
   Showcases six platform features below the resume tools:
   1. LinkedIn Optimizer — profile audit and rewrite
   2. Job Board Integration — search real listings, save & track
   3. Chrome Extension — one-click save from 40+ job boards
   4. Application Tracker — pipeline stages, notes, AI match scores
   5. Interview Prep AI — predicted questions and STAR coaching
   6. Interactive Mock Interview — live AI interview practice
   Content slides in from its edge, visual cards from opposite
   side. Internal card elements animate on scroll for premium feel.
   ============================================================ */

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* # Zero-bounce spring — naturally settles with no hard stop */
const SPRING = { type: "spring" as const, duration: 1.2, bounce: 0 };
/* # Tween ease for width animations */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
    <section className="relative z-10 py-16 sm:py-20 px-4">
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
            Optimize your LinkedIn, find the right jobs, track every application, and nail every interview — all from one dashboard.
          </p>
        </motion.div>

        {/* ============================================================
             FEATURE 1 - LinkedIn Optimizer
             Content: right (flex-row-reverse) → slides from right.
             Visual: left → slides from left.
             ============================================================ */}
        <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center mb-24 sm:mb-32">

          {/* ---- Content Side — slides in from right ---- */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING }}
            className="flex-1 max-w-xl"
          >
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                LinkedIn Optimizer
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Get found by recruiters, not lost in the feed
            </h3>

            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Your LinkedIn profile is your digital storefront. Our AI audits every section — headline, about, experience, skills — with a score out of 100, then rewrites your profile to rank higher in recruiter searches and attract inbound opportunities.
            </p>

            <motion.ul
              variants={bulletStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3"
            >
              {[
                "Profile score with section-by-section breakdown and priorities",
                "Headline rewrite optimized for recruiter search algorithms",
                "About section that hooks readers in the first 3 visible lines",
                "Skills and hashtag recommendations for maximum discoverability",
              ].map((cap, j) => (
                <motion.li key={j} variants={bulletItem} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base text-text-secondary leading-relaxed">{cap}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---- Visual Side — LinkedIn profile mockup (slides from left) ---- */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, duration: 0.8, delay: 0.2 }}
                  className="rounded-lg bg-space-600/40 overflow-hidden"
                >
                  <div className="h-10 bg-gradient-to-r from-cyan-600/40 to-blue-600/40" />
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

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, duration: 0.8, delay: 1.25 }}
                  className="flex items-center gap-3"
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
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================
             FEATURE 2 - Job Board Integration
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
             FEATURE 2 - Chrome Extension
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
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                Chrome Extension
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Save any job listing in one click
            </h3>

            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Browsing LinkedIn, Indeed, or Glassdoor? Click the extension and the job is saved — title, company, salary,
              and full description extracted automatically. Works on 40+ job boards and ATS career pages.
            </p>

            <motion.ul
              variants={bulletStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3"
            >
              {[
                "One-click save from LinkedIn, Indeed, Glassdoor, and 40+ sites",
                "Auto-extracts job title, company, salary, location, and description",
                "Instant AI match score based on your resume",
                "Syncs directly to your Application Tracker",
              ].map((cap, j) => (
                <motion.li key={j} variants={bulletItem} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

              {/* # Browser tab with extension popup */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="ml-2 flex-1 h-5 rounded-md bg-space-600/50 flex items-center px-2">
                  <span className="text-[9px] text-text-muted">linkedin.com/jobs/senior-engineer</span>
                </div>
              </div>

              {/* # Extension popup overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.8, delay: 0.3 }}
                className="rounded-xl bg-space-700/80 border border-card-border p-4 mb-3"
              >
                {/* # Extension header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">JP</span>
                  </div>
                  <span className="text-[11px] font-semibold text-white">JobPilot AI</span>
                  <div className="ml-auto px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                    <span className="text-[8px] text-green-400 font-medium">Connected</span>
                  </div>
                </div>

                {/* # Detected job details */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, duration: 0.7, delay: 0.5 }}
                  className="p-3 rounded-lg bg-space-600/50 mb-3"
                >
                  <div className="text-[10px] text-blue-400 font-medium mb-1.5">Job Detected</div>
                  <div className="text-xs font-semibold text-white mb-1">Senior Software Engineer</div>
                  <div className="text-[10px] text-text-secondary mb-2">Google — Mountain View, CA</div>
                  <div className="flex gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-[8px] text-green-400">$180k - $260k</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-[8px] text-blue-400">Full Time</span>
                    <span className="px-1.5 py-0.5 rounded bg-space-500/50 text-[8px] text-text-muted">Hybrid</span>
                  </div>
                </motion.div>

                {/* # AI match score */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, duration: 0.7, delay: 0.65 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-text-muted uppercase tracking-wider">AI Match</span>
                      <span className="text-sm font-bold text-green-400">87%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-space-600 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "87%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* # Save button */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, duration: 0.7, delay: 0.8 }}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-center"
                >
                  <span className="text-[11px] text-white font-semibold">Save to Tracker</span>
                </motion.div>
              </motion.div>

              {/* # Supported sites row */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.7, delay: 0.95 }}
                className="flex items-center gap-2"
              >
                <span className="text-[9px] text-text-muted">Works on:</span>
                <div className="flex gap-1 flex-wrap">
                  {["LinkedIn", "Indeed", "Glassdoor", "Greenhouse", "Lever", "40+"].map((site, i) => (
                    <span key={i} className={`px-1.5 py-0.5 rounded text-[8px] ${i === 5 ? "text-blue-400 bg-blue-500/10" : "text-text-muted bg-space-600/50"}`}>{site}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================
             FEATURE 3 - Application Tracker
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
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                Application Tracker
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Every application, one dashboard — no more spreadsheets
            </h3>

            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Track every job from saved to offer in a visual pipeline. See your application stages at a glance,
              add notes and follow-up dates, and never lose track of where you stand. Free and unlimited on every plan.
            </p>

            <motion.ul
              variants={bulletStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3"
            >
              {[
                "Pipeline stages: Saved, Applied, Phone Screen, Interview, Offer",
                "AI match scores on every tracked job",
                "Notes, follow-up dates, and interviewer details per application",
                "One-click save from Job Board and Chrome Extension",
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
            <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />

              {/* # Header — matches dashboard page header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.8, delay: 0.2 }}
                className="flex items-center justify-between mb-4"
              >
                <div>
                  <div className="text-sm font-bold text-white">Application Tracker</div>
                  <div className="text-[10px] text-text-muted">Track all your job applications in one place.</div>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-500">
                  <span className="text-[9px] text-white font-semibold">+ Add Application</span>
                </div>
              </motion.div>

              {/* # Stats bar — 5 status counts like the real dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, duration: 0.7, delay: 0.35 }}
                className="grid grid-cols-5 gap-1.5 mb-4"
              >
                {[
                  { label: "Saved", count: 4, color: "text-blue-400" },
                  { label: "Applied", count: 6, color: "text-blue-400" },
                  { label: "Interview", count: 2, color: "text-yellow-400" },
                  { label: "Offer", count: 1, color: "text-green-400" },
                  { label: "Rejected", count: 3, color: "text-red-400" },
                ].map((s, i) => (
                  <div key={i} className="rounded-lg bg-space-600/40 p-2 text-center">
                    <div className={`text-sm font-bold ${s.color}`}>{s.count}</div>
                    <div className="text-[8px] text-text-muted mt-0.5">{s.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* # Application list — matches glass-card p-5 layout */}
              <div className="space-y-2">
                {[
                  { title: "Full Stack Engineer", company: "Vercel", status: "Applied", statusStyle: "bg-blue-500/20 text-blue-400 border-blue-500/30", date: "Applied Sep 8", salary: "$150k - $200k" },
                  { title: "Backend Engineer", company: "Shopify", status: "Saved", statusStyle: "bg-blue-500/20 text-blue-400 border-blue-500/30", date: "Saved Sep 11", salary: "$140k - $180k" },
                  { title: "Senior Product Manager", company: "Stripe", status: "Interview", statusStyle: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", date: "Applied Sep 5", extra: "Interview Oct 3", extraColor: "text-yellow-400", salary: "$180k - $220k" },
                ].map((app, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...SPRING, duration: 0.7, delay: 0.45 + i * 0.08 }}
                    className="p-3 rounded-xl bg-space-700/50 border border-card-border"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white">{app.title}</div>
                        <div className="text-[10px] text-text-secondary">{app.company}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-[9px] font-medium border ${app.statusStyle}`}>{app.status}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] text-text-muted">{app.date}</span>
                      {app.extra && <span className={`text-[9px] font-medium ${app.extraColor}`}>{app.extra}</span>}
                      <span className="text-[9px] text-green-400 ml-auto">{app.salary}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================
             FEATURE 5 - Interview Prep AI
             Content: right (flex-row-reverse) → slides from right.
             Visual: left → slides from left.
             ============================================================ */}
        <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center mt-24 sm:mt-32">

          {/* ---- Content Side — slides in from right ---- */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING }}
            className="flex-1 max-w-xl"
          >
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                Interview Prep AI
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Walk in knowing what they&apos;ll ask
            </h3>

            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Our AI predicts the most likely interview questions for any role based on the job description, company, and industry. Then it coaches you through strong answers using the STAR method, grounded in your actual resume experience.
            </p>

            <motion.ul
              variants={bulletStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3"
            >
              {[
                "10 predicted questions: technical, behavioral, and culture-fit",
                "AI-coached answers based on your real experience and background",
                "STAR method structuring for behavioral questions",
                "Company-specific questions based on the role and industry",
              ].map((cap, j) => (
                <motion.li key={j} variants={bulletItem} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base text-text-secondary leading-relaxed">{cap}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---- Visual Side — Interview questions card ---- */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />

              <div className="space-y-4">
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
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================
             FEATURE 6 - Interactive Mock Interview
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
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                Interactive Mock Interview
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Practice with an AI interviewer that feels real
            </h3>

            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Step into a live mock interview powered by AI. Choose your target role, face realistic questions from a virtual interviewer, and respond with your voice or text — all in a real-time video-call format. Get detailed feedback and scoring after the interview.
            </p>

            <motion.ul
              variants={bulletStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3"
            >
              {[
                "Real-time AI interviewer with voice and video-call style interface",
                "Role-specific questions tailored to the exact position you're targeting",
                "Respond by voice or text — practice exactly how you'll interview",
                "Comprehensive feedback with scoring and improvement suggestions",
              ].map((cap, j) => (
                <motion.li key={j} variants={bulletItem} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base text-text-secondary leading-relaxed">{cap}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---- Visual Side — Mock interview preview ---- */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-amber-600" />

              <div className="space-y-4">
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
              </div>
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
            Optimize your profile. Find the right jobs. Ace every interview.
          </p>
          <Link href="/signup" className="btn-primary text-base px-8 py-4">
            Get Started Free
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
