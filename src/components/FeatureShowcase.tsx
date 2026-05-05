/* ============================================================
   FEATURE SHOWCASE - Deep-Dive Feature Sections
   ============================================================
   Full-width alternating sections that explain each core feature
   in depth with benefit-driven headlines, detailed descriptions,
   capability bullet points, and visual accent elements.

   Pattern: alternating left-content/right-visual layout.
   Each section builds trust by showing exactly what users get
   and why it matters for their career.
   ============================================================ */

import Link from "next/link";

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
    accent: "from-indigo-500 to-purple-600",
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
    accent: "from-purple-500 to-pink-600",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
    accent: "from-violet-500 to-fuchsia-600",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function FeatureShowcase() {
  return (
    <section className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-20 sm:mb-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light mb-4">
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
        </div>

        {/* ---- Feature Deep-Dive Sections ---- */}
        <div className="space-y-24 sm:space-y-32">
          {showcaseFeatures.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-10 lg:gap-16 items-center`}
            >
              {/* ---- Content Side ---- */}
              <div className="flex-1 max-w-xl">
                {/* Feature tag pill */}
                <div className="inline-flex items-center gap-2 mb-5">
                  <div className={`w-8 h-8 rounded-lg ${feature.iconBg} border flex items-center justify-center ${feature.iconColor}`}>
                    {feature.icon}
                  </div>
                  <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                    {feature.tag}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                  {feature.headline}
                </h3>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Capability bullet points */}
                <ul className="space-y-3">
                  {feature.capabilities.map((cap, j) => (
                    <li key={j} className="flex items-start gap-3">
                      {/* Checkmark icon */}
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
                      <span className="text-sm text-text-secondary leading-relaxed">
                        {cap}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ---- Visual Side — Feature Preview Card ---- */}
              <div className="flex-1 w-full max-w-lg">
                <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
                  {/* Gradient accent bar at top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.accent}`} />

                  {/* Simulated UI preview */}
                  <div className="space-y-4">
                    {/* Fake header bar */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      <div className="ml-2 flex-1 h-5 rounded-md bg-space-600/50" />
                    </div>

                    {/* Simulated content lines matching the feature */}
                    {index === 0 && (
                      /* Resume Analysis Preview */
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-text-muted uppercase tracking-wider">ATS Score</span>
                          <span className="text-2xl font-bold text-green-400">87/100</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-space-600 overflow-hidden">
                          <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="p-3 rounded-lg bg-space-600/40">
                            <div className="text-xs text-text-muted mb-1">Keywords</div>
                            <div className="text-sm font-semibold text-white">12 found</div>
                          </div>
                          <div className="p-3 rounded-lg bg-space-600/40">
                            <div className="text-xs text-text-muted mb-1">Missing</div>
                            <div className="text-sm font-semibold text-amber-400">4 critical</div>
                          </div>
                        </div>
                      </>
                    )}

                    {index === 1 && (
                      /* Resume Rebuild Preview */
                      <>
                        <div className="p-3 rounded-lg bg-space-600/40 border-l-2 border-red-400/50">
                          <div className="text-xs text-red-400 mb-1">Before</div>
                          <div className="text-xs text-text-muted line-through">Responsible for managing team projects</div>
                        </div>
                        <div className="flex justify-center">
                          <svg className="w-5 h-5 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                        <div className="p-3 rounded-lg bg-space-600/40 border-l-2 border-green-400/50">
                          <div className="text-xs text-green-400 mb-1">After</div>
                          <div className="text-xs text-white">Spearheaded cross-functional team of 8, delivering 3 projects ahead of schedule and reducing costs by 22%</div>
                        </div>
                      </>
                    )}

                    {index === 2 && (
                      /* Match Score Preview */
                      <>
                        <div className="text-center mb-4">
                          <div className="text-4xl font-bold text-green-400 mb-1">78%</div>
                          <div className="text-xs text-text-muted">Match Score</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-xs text-text-secondary">React, TypeScript, Node.js</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-xs text-text-secondary">3+ years experience</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-xs text-text-secondary">AWS — mentioned but not emphasized</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <span className="text-xs text-text-secondary">GraphQL — not found in resume</span>
                          </div>
                        </div>
                      </>
                    )}

                    {index === 3 && (
                      /* Cover Letter Preview */
                      <>
                        <div className="space-y-2.5">
                          <div className="h-2.5 rounded bg-space-600/60 w-[60%]" />
                          <div className="h-2.5 rounded bg-space-600/60 w-full" />
                          <div className="h-2.5 rounded bg-space-600/60 w-[90%]" />
                          <div className="h-2.5 rounded bg-space-600/60 w-[75%]" />
                          <div className="h-3 rounded bg-space-600/20 w-full mt-3" />
                          <div className="h-2.5 rounded bg-space-600/60 w-full" />
                          <div className="h-2.5 rounded bg-space-600/60 w-[85%]" />
                          <div className="h-2.5 rounded bg-space-600/60 w-[70%]" />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-xs text-emerald-400 font-medium">312 words</span>
                          </div>
                          <div className="px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                            <span className="text-xs text-blue-400 font-medium">Personalized</span>
                          </div>
                        </div>
                      </>
                    )}

                    {index === 4 && (
                      /* Interview Prep Preview */
                      <>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-space-600/40">
                            <div className="text-xs text-amber-400 mb-1">Behavioral</div>
                            <div className="text-xs text-white">&ldquo;Tell me about a time you led a team through a difficult challenge&rdquo;</div>
                          </div>
                          <div className="p-3 rounded-lg bg-space-600/40">
                            <div className="text-xs text-blue-400 mb-1">Technical</div>
                            <div className="text-xs text-white">&ldquo;How would you design a scalable notification system?&rdquo;</div>
                          </div>
                          <div className="p-3 rounded-lg bg-space-600/40">
                            <div className="text-xs text-purple-400 mb-1">Culture Fit</div>
                            <div className="text-xs text-white">&ldquo;What does collaboration look like to you?&rdquo;</div>
                          </div>
                        </div>
                      </>
                    )}

                    {index === 5 && (
                      /* LinkedIn Optimizer Preview */
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-text-muted uppercase tracking-wider">Profile Score</span>
                          <span className="text-2xl font-bold text-cyan-400">62/100</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-text-secondary">Headline</span>
                            <span className="text-xs text-red-400 font-medium">Weak — 4/10</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-text-secondary">About</span>
                            <span className="text-xs text-amber-400 font-medium">Okay — 6/10</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-text-secondary">Experience</span>
                            <span className="text-xs text-green-400 font-medium">Strong — 8/10</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-text-secondary">Skills</span>
                            <span className="text-xs text-amber-400 font-medium">Okay — 5/10</span>
                          </div>
                        </div>
                      </>
                    )}

                    {index === 6 && (
                      /* Resume Templates Preview */
                      <>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {["Classic", "Modern", "Executive"].map((name, i) => (
                            <div key={i} className={`p-2 rounded-lg border text-center ${i === 1 ? "bg-violet-500/10 border-violet-500/30" : "bg-space-600/40 border-space-600/60"}`}>
                              <div className={`w-full h-1 rounded mb-2 ${i === 0 ? "bg-blue-500" : i === 1 ? "bg-indigo-500" : "bg-gray-500"}`} />
                              <div className="h-1.5 rounded bg-space-500/60 w-[70%] mx-auto mb-1" />
                              <div className="h-1 rounded bg-space-500/40 w-full mb-0.5" />
                              <div className="h-1 rounded bg-space-500/40 w-[80%]" />
                              <div className={`text-[9px] mt-2 font-medium ${i === 1 ? "text-violet-400" : "text-text-muted"}`}>{name}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1.5 rounded-md bg-violet-500/10 border border-violet-500/20">
                            <span className="text-xs text-violet-400 font-medium">PDF</span>
                          </div>
                          <div className="px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                            <span className="text-xs text-blue-400 font-medium">Word</span>
                          </div>
                          <span className="text-xs text-text-muted ml-1">Ready to download</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Bottom CTA ---- */}
        <div className="mt-24 sm:mt-32 text-center">
          <p className="text-text-secondary text-lg mb-6">
            All six tools. One platform. Zero guesswork.
          </p>
          <Link href="/signup" className="btn-primary text-base px-8 py-4">
            Start Optimizing for Free
          </Link>
        </div>
      </div>
    </section>
  );
}
