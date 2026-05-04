/* ============================================================
   HOW IT WORKS - Step-by-Step Flow
   ============================================================
   Shows users the 3 simple steps to get started with JobPilot AI.
   Visual numbered steps with connecting lines between them.
   Builds trust by showing how simple the process is.
   ============================================================ */

/* ---- Step Data ---- */
const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description:
      "Drop your existing resume (PDF, DOCX, or TXT). Our AI instantly analyzes it for ATS compatibility, keywords, and strength.",
  },
  {
    number: "02",
    title: "Paste a Job Description",
    description:
      "Found a job you love? Paste the description and our AI will rebuild your resume, generate a cover letter, and prep you for interviews.",
  },
  {
    number: "03",
    title: "Apply with Confidence",
    description:
      "Download your optimized resume and tailored cover letter. Walk into interviews fully prepared with predicted questions and coached answers.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative z-10 py-24 sm:py-32 px-4"
    >
      <div className="max-w-5xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light mb-4">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Three Steps to Your{" "}
            <span className="glow-text">Dream Job</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            No complicated setup. No learning curve. Just results.
          </p>
        </div>

        {/* ---- Steps List ---- */}
        {/* Vertical layout with connecting line on the left */}
        <div className="space-y-12 sm:space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-6 sm:gap-10 items-start"
            >
              {/* Step Number Circle */}
              {/* Large gradient-bordered number for visual hierarchy */}
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-space-700 border border-card-border flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold glow-text">
                  {step.number}
                </span>
              </div>

              {/* Step Content */}
              <div className="pt-1">
                <h3 className="text-xl sm:text-2xl font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed max-w-xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
