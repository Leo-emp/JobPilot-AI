/* ============================================================
   TESTIMONIALS - Social Proof Section
   ============================================================
   Shows user testimonials in glassmorphism cards (like OpenClaw).
   Builds trust and credibility with potential users.
   Horizontally scrollable on mobile, grid on desktop.
   ============================================================ */

/* ---- Testimonial Data ---- */
/* These are placeholder testimonials — replace with real ones later */
const testimonials = [
  {
    name: "Sarah M.",
    role: "Software Engineer",
    avatar: "SM",
    text: "JobPilot completely transformed my resume. I went from zero callbacks to 5 interviews in two weeks. The ATS optimization is incredible.",
    color: "from-brand-indigo to-brand-purple",
  },
  {
    name: "David K.",
    role: "Career Changer",
    avatar: "DK",
    text: "The Career Pivot mode is a game-changer. I transitioned from teaching to tech and JobPilot rewrote my entire resume to highlight transferable skills.",
    color: "from-brand-purple to-brand-violet",
  },
  {
    name: "Priya R.",
    role: "Marketing Manager",
    avatar: "PR",
    text: "Generated a perfect cover letter in 30 seconds. It was better than anything I'd spent hours writing myself. Absolutely worth it.",
    color: "from-brand-violet to-brand-glow",
  },
  {
    name: "James L.",
    role: "Recent Graduate",
    avatar: "JL",
    text: "The interview prep predicted almost the exact questions I was asked. I walked in confident and got the offer. This tool is unreal.",
    color: "from-brand-light to-brand-indigo",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative z-10 py-24 sm:py-32 px-4"
    >
      <div className="max-w-7xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            What People{" "}
            <span className="glow-text">Say</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            Join thousands of job seekers who launched their careers with JobPilot AI.
          </p>
        </div>

        {/* ---- Testimonial Cards Grid ---- */}
        {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, index) => (
            <div key={index} className="glass-card p-6 sm:p-8 flex flex-col">
              {/* Avatar circle with gradient background and initials */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-bold text-white`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>

              {/* Testimonial text */}
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
