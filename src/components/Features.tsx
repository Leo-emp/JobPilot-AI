/* ============================================================
   FEATURES SECTION - What JobPilot AI Does
   ============================================================
   Displays 8 core features in a clean centered grid.
   Top row: 4 features. Bottom row: 4 features.
   Each card has an SVG icon, title, and description.
   Centered text layout for a polished, professional look.
   ============================================================ */

/* ---- Feature Data ---- */
/* Each feature has an SVG icon path, accent color, title, description, and showcase ID for scroll linking */
const features = [
  {
    title: "Resume Intelligence",
    showcaseId: "showcase-resume-intelligence",
    description:
      "Upload your resume and get instant ATS scoring, keyword analysis, and AI-powered optimization suggestions.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Smart Job Matching",
    showcaseId: "showcase-smart-job-matching",
    description:
      "Find jobs that match your skills. Our AI calculates compatibility scores and highlights skill gaps.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Cover Letter Generator",
    showcaseId: "showcase-cover-letter-generator",
    description:
      "Generate tailored, professional cover letters for any job in seconds. Each one is unique to the role.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Resume Rebuild Engine",
    showcaseId: "showcase-resume-rebuild-engine",
    description:
      "Completely rebuild your resume for a specific job — ATS-optimized format, power verbs, keyword injection.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: "Interview Prep AI",
    showcaseId: "showcase-interview-prep-ai",
    description:
      "Predict likely interview questions for any role and get AI-coached answers based on your experience.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Career Pivot Mode",
    showcaseId: "showcase-career-pivot-mode",
    description:
      "Switching careers? Our AI reframes your experience with transferable skills for your target industry.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Resume Templates",
    showcaseId: "showcase-resume-templates",
    description:
      "Choose from 6 professional ATS-friendly templates. Fill in your details and download as PDF or Word.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: "LinkedIn Optimizer",
    showcaseId: "showcase-linkedin-optimizer",
    description:
      "Get a profile audit scored out of 100, then AI-rewritten headline, about, and experience that attract recruiters.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light mb-4">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="glow-text">Land the Job</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            Ten AI-powered tools working together to take you from application
            to interview — all in one platform.
          </p>
        </div>

        {/* ---- Feature Cards Grid ---- */}
        {/* 1 col mobile, 2 col tablet, 4 col desktop — centered text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <a
              key={index}
              href={`#${feature.showcaseId}`}
              className="group relative rounded-2xl border border-card-border bg-space-800/60 p-7 text-center hover:border-brand-indigo/30 hover:bg-space-700/60 transition-all duration-300 cursor-pointer"
            >
              {/* Icon circle — centered */}
              <div className={`mx-auto mb-5 w-14 h-14 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center ${feature.color}`}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold mb-2 group-hover:text-brand-light transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
