/* ============================================================
   ABOUT PAGE
   ============================================================
   Company story, mission, and team info. Matches the space
   theme with glassmorphism cards and glow text.
   ============================================================ */

export const metadata = {
  title: "About — JobPilot AI",
  description: "Learn about JobPilot AI — our mission to make job hunting smarter with AI-powered career tools.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
        About JobPilot AI
      </h1>
      <p className="text-text-secondary text-lg mb-16 max-w-2xl">
        We&apos;re on a mission to make job hunting smarter, faster, and less stressful
        — powered by AI that actually understands your career.
      </p>

      <div className="space-y-16">
        {/* ---- Our Story ---- */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-6 glow-text">
            Our Story
          </h2>
          <div className="glass-card p-6 sm:p-8 space-y-4 text-text-secondary leading-relaxed">
            <p>
              JobPilot AI was born from a simple frustration: job hunting is broken.
              You spend hours tailoring resumes, writing cover letters from scratch,
              and preparing for interviews — only to hear nothing back.
            </p>
            <p>
              We built JobPilot AI to change that. By combining cutting-edge AI with
              a deep understanding of what recruiters and hiring managers look for,
              we created an all-in-one career platform that does the heavy lifting
              so you can focus on what matters — landing the right job.
            </p>
            <p>
              Whether you&apos;re a fresh graduate, a career changer, or a seasoned
              professional looking for your next move, JobPilot AI gives you the
              tools to stand out in a competitive market.
            </p>
          </div>
        </section>

        {/* ---- Our Mission ---- */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-6 glow-text">
            Our Mission
          </h2>
          <div className="glass-card p-6 sm:p-8">
            <p className="text-lg text-text-secondary leading-relaxed">
              To democratize career success by giving every job seeker access to
              AI-powered tools that were previously only available to those who could
              afford expensive career coaches and consultants.
            </p>
          </div>
        </section>

        {/* ---- What We Offer ---- */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-6 glow-text">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Feature cards */}
            {[
              {
                title: "Resume Intelligence",
                desc: "AI-powered resume analysis, optimization, full rebuilds, and career pivot suggestions.",
              },
              {
                title: "Smart Job Matching",
                desc: "Find jobs that match your skills and get an AI-calculated match score with gap analysis.",
              },
              {
                title: "Cover Letter Generator",
                desc: "Personalized, job-specific cover letters generated in seconds — not generic templates.",
              },
              {
                title: "Interview Prep",
                desc: "AI predicts likely interview questions and coaches you on crafting strong answers.",
              },
              {
                title: "Application Tracker",
                desc: "Track every application from saved to offer with a clean, organized dashboard.",
              },
              {
                title: "Career Pivot Mode",
                desc: "Thinking of switching industries? Our AI maps your transferable skills to new career paths.",
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-5">
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Why Choose Us ---- */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-6 glow-text">
            Why Choose JobPilot AI
          </h2>
          <div className="glass-card p-6 sm:p-8">
            <ul className="space-y-4 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-brand-light font-bold mt-0.5">01</span>
                <span><strong className="text-white">All-in-One Platform</strong> — Resume, cover letters, job search, interview prep, and tracking in a single app. No more juggling 5 different tools.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-light font-bold mt-0.5">02</span>
                <span><strong className="text-white">Powered by Advanced AI</strong> — We use Google Gemini to deliver intelligent, context-aware career guidance tailored to your unique profile.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-light font-bold mt-0.5">03</span>
                <span><strong className="text-white">Free to Start</strong> — Our free tier gives you real access to every feature. Upgrade when you&apos;re ready for unlimited power.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-light font-bold mt-0.5">04</span>
                <span><strong className="text-white">Privacy First</strong> — Your resume data is yours. We never sell your information or share it with recruiters without your consent.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ---- CTA ---- */}
        <section className="text-center">
          <div className="glass-card p-8 sm:p-12">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4 glow-text-strong">
              Ready to Launch Your Career?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Join thousands of job seekers who are using AI to land better jobs, faster.
            </p>
            <a
              href="/signup"
              className="btn-primary inline-block"
            >
              Get Started Free
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
