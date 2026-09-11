/* ============================================================
   SEO LANDING PAGE — Visual Resume Templates
   ============================================================
   # Targets: "free resume templates", "ATS resume templates",
   # "professional resume templates", "resume template builder",
   # "visual resume maker"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "20 Free Professional Resume Templates — ATS-Friendly | JobPilot AI",
  description:
    "Choose from 20 structurally unique resume templates. Classic, sidebar, visual, modern, and special layouts — all ATS-friendly. Fill in your details, download as PDF.",
  alternates: { canonical: "https://jobpilotai.co/tools/resume-templates" },
  openGraph: {
    title: "20 Free Professional Resume Templates — JobPilot AI",
    description: "20 unique layouts: Classic, Sidebar, Visual, Modern, Special. ATS-friendly, fill & download.",
    url: "https://jobpilotai.co/tools/resume-templates",
  },
};

const benefits = [
  {
    title: "20 Structurally Unique Layouts",
    desc: "Not 20 color variations of the same template. Each one has a genuinely different HTML structure — from classic single-column to split layouts, timelines, card grids, and sidebar designs.",
  },
  {
    title: "5 Style Categories",
    desc: "Classic (4), Sidebar (5), Visual (4), Modern (4), and Special (3). From conservative ATS-friendly formats to creative layouts — choose the style that fits your industry.",
  },
  {
    title: "100% ATS-Compatible",
    desc: "Every template is built with proper heading hierarchy, semantic markup, and standard section ordering. Your resume passes ATS scanners while still looking great to human reviewers.",
  },
  {
    title: "Fill-in-the-Blank Simple",
    desc: "No design skills needed. Enter your name, experience, education, and skills — the template handles all formatting, spacing, and layout automatically.",
  },
  {
    title: "Download as PDF",
    desc: "Export your finished resume as a clean, properly formatted PDF ready to upload to any job application. What you see on screen is exactly what the PDF looks like.",
  },
  {
    title: "Works with AI Analysis",
    desc: "Build your resume with a template, then run it through our AI Resume Checker to optimize keywords and improve your ATS score. The tools work together seamlessly.",
  },
];

const faqs = [
  {
    q: "Are these templates really free?",
    a: "Yes, all 20 templates are available on the free plan. You can preview any template, fill in your details, and download as PDF. No credit card, no watermark, no catch.",
  },
  {
    q: "Which template should I use?",
    a: "For corporate/traditional roles: Classic or Sidebar. For creative/startup roles: Visual or Modern. For executive roles: Premium Sidebar or Banner Modern. When in doubt, 'ATS-Friendly Classic' is the safest choice for any industry.",
  },
  {
    q: "Will these pass ATS systems?",
    a: "Yes. Every template uses standard section headings, proper text hierarchy, and parseable formatting. We specifically test against common ATS systems to ensure compatibility.",
  },
  {
    q: "Can I customize the colors and fonts?",
    a: "Each template has its own professional color scheme and typography designed to work together. The focus is on structure and content — ensuring your resume looks polished without design decisions.",
  },
  {
    q: "How do I switch between templates?",
    a: "Your content is saved separately from the template. Enter your details once, then preview any template with one click. Switch freely until you find the perfect fit.",
  },
];

export default function ResumeTemplatesToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Resume Templates", url: "https://jobpilotai.co/tools/resume-templates" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free Templates</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Professional Resume Templates
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          20 structurally unique resume templates across 5 categories. Classic, Sidebar, Visual,
          Modern, and Special layouts — all ATS-friendly, all free.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Browse Templates Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Template Categories Preview */}
      <div className="mb-20 max-w-3xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { cat: "Classic", count: 4, examples: "Traditional, ATS-Friendly, Centered, Compact", color: "border-blue-500/30 bg-blue-500/5" },
            { cat: "Sidebar", count: 5, examples: "Corporate, Creative, Tech, Premium, Fresh", color: "border-purple-500/30 bg-purple-500/5" },
            { cat: "Visual", count: 4, examples: "Timeline, Skill Bars, Rating Dots, Pill Tags", color: "border-emerald-500/30 bg-emerald-500/5" },
            { cat: "Modern", count: 4, examples: "Banner, Monogram, Icon Sections, Card Grid", color: "border-amber-500/30 bg-amber-500/5" },
            { cat: "Special", count: 3, examples: "Split 50/50, Alternating Bands, Right Sidebar", color: "border-rose-500/30 bg-rose-500/5" },
          ].map((c) => (
            <div key={c.cat} className={`glass-card p-4 ${c.color}`}>
              <p className="text-sm font-bold text-white mb-1">{c.cat}</p>
              <p className="text-lg font-bold text-brand-light">{c.count} templates</p>
              <p className="text-[10px] text-text-muted mt-2 leading-relaxed">{c.examples}</p>
            </div>
          ))}
          <div className="glass-card p-4 border-indigo-500/30 bg-indigo-500/5 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-brand-light">20</p>
            <p className="text-xs text-text-secondary">Total Templates</p>
            <p className="text-[10px] text-text-muted mt-1">All ATS-Friendly</p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Not Just Color Swaps</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Most &ldquo;template libraries&rdquo; give you the same layout in 20 colors. Each of these templates has a genuinely different structure — different section ordering, header styles, and content layouts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="glass-card p-6 hover:border-brand-indigo/30 transition-colors">
              <h3 className="text-base font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: "1", title: "Pick a Template", desc: "Browse 20 templates across 5 categories. Preview each one before choosing." },
            { step: "2", title: "Fill in Your Details", desc: "Enter your name, experience, skills, and education. The template handles formatting." },
            { step: "3", title: "Download as PDF", desc: "Export a clean, ATS-friendly PDF ready for any job application." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-brand-light font-bold text-lg">{s.step}</span>
              </div>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card p-6">
              <h3 className="font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-space-800/60 p-8 sm:p-10 text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Find Your Perfect Resume Template</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">20 professional templates. All free. All ATS-friendly. Pick one and start building.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Browse Templates Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
