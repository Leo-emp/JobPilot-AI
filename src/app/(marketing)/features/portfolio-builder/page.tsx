/* ============================================================
   SEO LANDING PAGE — AI Portfolio Builder
   ============================================================
   Targets: "portfolio builder", "online portfolio creator",
   "professional portfolio website", "career portfolio"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "AI Portfolio Builder — Create a Professional Portfolio | JobPilot AI",
  description:
    "Build a stunning professional portfolio in minutes. Showcase projects, skills, and achievements with a shareable public link. Free AI portfolio builder — no coding required.",
  alternates: { canonical: "https://jobpilotai.co/features/portfolio-builder" },
  openGraph: {
    title: "AI Portfolio Builder — JobPilot AI",
    description:
      "Build a professional portfolio in minutes. Shareable public link, no coding required.",
    url: "https://jobpilotai.co/features/portfolio-builder",
  },
};

const benefits = [
  {
    title: "No Coding Required",
    desc: "Fill in your details — experience, projects, skills, education — and JobPilot AI generates a polished, professional portfolio page. No HTML, CSS, or hosting needed.",
  },
  {
    title: "Shareable Public Link",
    desc: "Every portfolio gets a unique public URL (jobpilotai.co/p/your-name) that you can share with recruiters, include in your resume, or add to LinkedIn.",
  },
  {
    title: "Project Showcase",
    desc: "Highlight your best work with project cards that include descriptions, tech stacks, links, and images. Perfect for developers, designers, marketers, and creatives.",
  },
  {
    title: "Multiple Templates",
    desc: "Choose from professionally designed portfolio templates. Each one is responsive, fast-loading, and optimized for both desktop and mobile viewing.",
  },
  {
    title: "Skills Visualization",
    desc: "Display your skills with visual indicators. Categorize by type — technical, soft, tools — so hiring managers can quickly assess your capabilities.",
  },
  {
    title: "SEO-Optimized Pages",
    desc: "Your portfolio page is indexed by Google with proper meta tags and structured data. When recruiters search your name, your portfolio appears in results.",
  },
];

export default function PortfolioBuilderPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Features", url: "https://jobpilotai.co/features" },
          { name: "Portfolio Builder", url: "https://jobpilotai.co/features/portfolio-builder" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">
          Professional Portfolio Creator
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Your Work Deserves a Portfolio
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          A resume shows what you&apos;ve done. A portfolio shows what you can do.
          JobPilot AI helps you build a professional portfolio with a shareable
          public link — no design skills or coding required.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Build Your Portfolio
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 text-base font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* # How it works */}
      <div className="mb-16">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-center mb-10 glow-text">
          Build Your Portfolio in 3 Steps
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Add Your Details", desc: "Fill in your name, bio, experience, education, and skills. Add projects with descriptions and links." },
            { step: "2", title: "Choose a Template", desc: "Pick a professional template that matches your style. All templates are mobile-responsive and fast-loading." },
            { step: "3", title: "Publish & Share", desc: "Hit publish and get your unique public link. Share it with recruiters, add it to applications, or embed in LinkedIn." },
          ].map((s) => (
            <div key={s.step} className="glass-card p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/20 text-brand-light font-bold flex items-center justify-center mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="text-white font-bold mb-2">{s.title}</h3>
              <p className="text-text-secondary text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # Benefits */}
      <div className="mb-16">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-center mb-10 glow-text">
          Everything You Need in a Portfolio
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="glass-card p-6">
              <h3 className="text-white font-bold mb-2">{b.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # SEO content */}
      <div className="glass-card p-8 sm:p-10 mb-16">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4 glow-text">
          Why Every Professional Needs a Portfolio
        </h2>
        <div className="text-text-secondary leading-relaxed space-y-4">
          <p>
            Portfolios aren&apos;t just for designers anymore. In 2026, professionals
            across every industry use portfolios to showcase their work, demonstrate
            skills, and stand out from other candidates. A portfolio gives hiring
            managers concrete evidence of your capabilities — something a resume
            bullet point alone can&apos;t provide.
          </p>
          <p>
            Building a portfolio website traditionally requires web development skills,
            a domain name, hosting, and ongoing maintenance. JobPilot AI eliminates all
            of that. You fill in your information, choose a template, and publish —
            everything is hosted for you with a professional URL.
          </p>
          <p>
            Your portfolio is also discoverable. Each published portfolio is SEO-optimized
            with proper meta tags, so when a recruiter Googles your name, your portfolio
            shows up alongside your LinkedIn — giving you a competitive edge.
          </p>
        </div>
      </div>

      {/* # CTA */}
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4 glow-text">
          Show the World What You Can Do
        </h2>
        <p className="text-text-secondary mb-6">
          Build your professional portfolio in minutes. Free to create, free to share.
        </p>
        <Link href="/signup" className="btn-primary text-base px-8 py-3">
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
