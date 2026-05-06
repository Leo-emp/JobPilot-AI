/* ============================================================
   TESTIMONIALS - Social Proof Section
   ============================================================
   Shows user testimonials in glassmorphism cards (like OpenClaw).
   Builds trust and credibility with potential users.
   Horizontally scrollable on mobile, grid on desktop.
   ============================================================ */

/* ---- Testimonial Data ---- */
/* These are placeholder testimonials — replace with real ones later */
/* Outcome-focused testimonials with specific, measurable results */
const testimonials = [
  {
    name: "Sarah M.",
    role: "Software Engineer",
    avatar: "SM",
    text: "Went from 0 callbacks to 5 interviews in 2 weeks. The Resume Rebuild Engine rewrote my entire resume for each role — every application was tailored.",
    color: "from-brand-indigo to-brand-purple",
  },
  {
    name: "David K.",
    role: "Teacher → UX Designer",
    avatar: "DK",
    text: "Career Pivot Mode found 7 transferable skills I didn't know I had. Landed a UX role at a SaaS company after 4 years in education. Nothing else does this.",
    color: "from-brand-purple to-brand-violet",
  },
  {
    name: "Priya R.",
    role: "Marketing Manager",
    avatar: "PR",
    text: "I was spending 45 minutes per cover letter. JobPilot generates one in 30 seconds that's better than what I wrote manually. Applied to 3x more jobs.",
    color: "from-brand-violet to-brand-glow",
  },
  {
    name: "James L.",
    role: "Recent Graduate",
    avatar: "JL",
    text: "Interview Prep predicted 4 out of 5 questions I was asked at my final round. Walked in prepared, got the offer. Worth it for that feature alone.",
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
            Real results from job seekers who stopped guessing and started landing interviews.
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
                  <p className="font-semibold text-base">{t.name}</p>
                  <p className="text-sm text-text-muted">{t.role}</p>
                </div>
              </div>

              {/* Testimonial text */}
              <p className="text-text-secondary text-base leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
