/* ============================================================
   ABOUT PAGE
   ============================================================
   Company story, mission, and team info. Matches the space
   theme with glassmorphism cards and glow text.
   ============================================================ */

export const revalidate = 3600;

export const metadata = {
  title: "About — JobPilot AI",
  description: "Learn about JobPilot AI — helping job seekers get to interviews faster with every career tool in one place.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
        About JobPilot AI
      </h1>
      <p className="text-text-secondary text-lg mb-16 max-w-2xl">
        We help job seekers get to interviews faster and land their dream roles
        — with every tool they need in one place.
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
              Help job seekers get to interviews faster and land their dream roles
              — with every tool they need in one place. No jumping between platforms,
              no piecing together five different apps. One career co-pilot from resume to offer.
            </p>
          </div>
        </section>

        {/* ---- Our Values ---- */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-6 glow-text">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Convenience",
                desc: "Save your time and ease the grind. Every feature is built to remove friction from the job search, not add more.",
              },
              {
                title: "Transparency",
                desc: "See the reasoning behind every score, evaluation, and recommendation. No black-box outputs, no unexplained numbers.",
              },
              {
                title: "Continuous Growth",
                desc: "Improve every day through learning, actionable feedback, and clear guidance on what to fix and why.",
              },
              {
                title: "Simplicity",
                desc: "We simplify the job search process instead of overcomplicating it. Clean tools that do what they say.",
              },
              {
                title: "Quality",
                desc: "We focus on generating outputs that actually work. Resumes that pass ATS, cover letters worth sending, answers that hold up.",
              },
            ].map((value) => (
              <div key={value.title} className="glass-card p-5">
                <h3 className="font-bold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- What We Offer ---- */}
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-6 glow-text">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Resume Intelligence",
                desc: "AI-powered resume analysis with ATS scoring, optimization tailored to specific jobs, full rebuilds, and career pivot reframing.",
              },
              {
                title: "Cover Letter Generator",
                desc: "Professional cover letters matched to specific roles and companies — using your real achievements, not generic templates.",
              },
              {
                title: "Mock Interview Studio",
                desc: "Live AI mock interviews that adapt to your role, experience level, and target company. Full scoring and feedback after each session.",
              },
              {
                title: "Interview Question Predictor",
                desc: "Role-specific interview questions with AI-coached answers based on your actual resume experience.",
              },
              {
                title: "LinkedIn Optimizer",
                desc: "Profile audit scored out of 100, AI-rewritten headline and about section, plus a 30-day content strategy.",
              },
              {
                title: "Smart Job Matching",
                desc: "AI-calculated match scores between your resume and any job description, with skill gap analysis and action plans.",
              },
              {
                title: "Portfolio Builder",
                desc: "9 premium templates for developers, designers, photographers, and professionals. Shareable live web pages, not static PDFs.",
              },
              {
                title: "Networking & Outreach",
                desc: "AI-crafted connection requests, cold outreach, recruiter pitches, and follow-ups — three versions per message, platform-aware.",
              },
              {
                title: "Application Tracker",
                desc: "Track every application from saved to offer. Notes, follow-up reminders, and skill gap insights across your saved jobs.",
              },
              {
                title: "Career Pivot Mode",
                desc: "Switching industries? Our AI reframes your existing experience with transferable skills and target-industry language.",
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
                <span><strong className="text-white">Everything in One Place</strong> — Resume, cover letters, mock interviews, LinkedIn, portfolios, job tracking, and networking — in a single app. No juggling five different tools.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-light font-bold mt-0.5">02</span>
                <span><strong className="text-white">Outputs That Actually Work</strong> — Every resume passes ATS checks, every cover letter is role-specific, every interview answer is grounded in your real experience.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-light font-bold mt-0.5">03</span>
                <span><strong className="text-white">Transparent AI</strong> — You see the reasoning behind every score and recommendation. No unexplained numbers, no black boxes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-light font-bold mt-0.5">04</span>
                <span><strong className="text-white">Free to Start</strong> — Our free tier gives you real access to every feature. No crippled demo — optimize a resume today without paying.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-light font-bold mt-0.5">05</span>
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
