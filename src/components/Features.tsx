/* ============================================================
   FEATURES SECTION - What JobPilot AI Does
   ============================================================
   Displays the 8 core features in a responsive grid of glass cards.
   Each card has an icon, title, and description.
   Uses the glassmorphism card style from globals.css.
   ============================================================ */

/* ---- Feature Data ---- */
/* Each feature has an emoji icon, title, and description */
const features = [
  {
    icon: "📄",
    title: "Resume Intelligence",
    description:
      "Upload your resume and get instant ATS scoring, keyword analysis, and AI-powered optimization suggestions.",
  },
  {
    icon: "🔍",
    title: "Smart Job Matching",
    description:
      "Find jobs that match your skills. Our AI calculates compatibility scores and highlights skill gaps.",
  },
  {
    icon: "✉️",
    title: "Cover Letter Generator",
    description:
      "Generate tailored, professional cover letters for any job in seconds. Each one is unique to the role.",
  },
  {
    icon: "🛠️",
    title: "Resume Rebuild Engine",
    description:
      "Completely rebuild your resume for a specific job — ATS-optimized format, power verbs, keyword injection.",
  },
  {
    icon: "🎤",
    title: "Interview Prep AI",
    description:
      "Predict likely interview questions for any role and get AI-coached answers based on your experience.",
  },
  {
    icon: "🚀",
    title: "Career Pivot Mode",
    description:
      "Switching careers? Our AI reframes your experience with transferable skills for your target industry.",
  },
  {
    icon: "📋",
    title: "Resume Templates",
    description:
      "Choose from 6 professional ATS-friendly templates. Fill in your details and download as PDF or Word instantly.",
  },
  {
    icon: "💼",
    title: "LinkedIn Optimizer",
    description:
      "Get a profile audit scored out of 100, then AI-rewritten headline, about, and experience sections that attract recruiters.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-16 sm:mb-20">
          {/* Small label above the title (common SaaS pattern) */}
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light mb-4">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="glow-text">Land the Job</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            Eight powerful AI tools working together to supercharge your job search
            from start to finish.
          </p>
        </div>

        {/* ---- Feature Cards Grid ---- */}
        {/* Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-8 sm:p-10 group"
            >
              {/* Feature icon with a subtle glow background */}
              <div className="text-4xl mb-5 w-16 h-16 flex items-center justify-center rounded-xl bg-space-700">
                {feature.icon}
              </div>

              {/* Feature title */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-light transition-colors">
                {feature.title}
              </h3>

              {/* Feature description */}
              <p className="text-base text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
