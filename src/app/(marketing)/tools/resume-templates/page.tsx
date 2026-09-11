/* ============================================================
   SEO LANDING PAGE — Visual Resume Templates
   ============================================================
   # Targets: "free resume templates", "ATS resume templates",
   # "professional resume templates", "resume template builder",
   # "visual resume maker"
   ============================================================ */

import Link from "next/link";
import type { ReactNode } from "react";
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

      {/* # Template Showcase — 3 real resume previews */}
      <div className="mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <TemplateCard><StandardATSTemplate /></TemplateCard>
          <TemplateCard><USATSTemplate /></TemplateCard>
          <TemplateCard><AUCVTemplate /></TemplateCard>
        </div>
        <p className="text-center text-text-muted text-sm mt-6">3 of 20 templates shown &middot; <Link href="/signup" className="text-brand-light hover:underline">Browse all templates</Link></p>
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

/* ============================================================
   TEMPLATE CARD WRAPPER
   Renders a full-size A4 resume inside a scaled-down preview
   with a hover overlay linking to signup.
   ============================================================ */
function TemplateCard({ children }: { children: ReactNode }) {
  return (
    <Link href="/signup" className="group block">
      <div className="relative rounded-xl border border-card-border bg-space-800/40 overflow-hidden" style={{ height: 520 }}>
        {/* # Scaled-down resume — real HTML, not an image */}
        <div className="origin-top-left" style={{ transform: "scale(0.34)", width: "210mm", minHeight: "297mm" }}>
          {children}
        </div>
        {/* # Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-6 py-3 rounded-xl bg-brand-indigo/90 text-white text-sm font-bold border border-brand-indigo/50">Select Template</span>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   TEMPLATE 1 — Standard ATS-Friendly
   Left-aligned, bold uppercase section headers, clean Helvetica
   ============================================================ */
function StandardATSTemplate() {
  return (
    <div className="bg-white text-black p-10 font-[Arial,Helvetica,sans-serif]" style={{ width: "210mm", minHeight: "297mm", fontSize: 14 }}>
      <div className="mb-1">
        <h1 className="text-[28px] font-bold text-black leading-tight">Olivia Wilson</h1>
        <p className="text-[11px] text-gray-600 mt-1">New York, NY &bull; +1 (555) 123-4567 &bull; olivia.wilson@email.com &bull; linkedin.com/in/oliviawilson</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[13px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Professional Summary</h2>
        <p className="text-[11.5px] text-gray-800 leading-relaxed">Results-driven marketing manager with 6+ years of experience in digital strategy, brand development, and campaign optimization. Proven track record of increasing revenue by 35% through data-driven marketing initiatives and cross-functional team leadership. Skilled at translating business objectives into measurable marketing outcomes.</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[13px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Core Skills</h2>
        <p className="text-[11px] text-gray-800 leading-relaxed">Strategy &amp; Growth: Brand Strategy, Go-to-Market, Market Research, Campaign Planning</p>
        <p className="text-[11px] text-gray-800 leading-relaxed">Digital Marketing: SEO/SEM, Google Analytics, Social Media, Content Marketing, A/B Testing</p>
        <p className="text-[11px] text-gray-800 leading-relaxed">Leadership: Team Management, Stakeholder Communication, Budget Oversight, Cross-functional Collaboration</p>
        <p className="text-[11px] text-gray-800 leading-relaxed">Tools: HubSpot, Salesforce, Google Ads, Meta Business Suite, Tableau</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[13px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-3">Work Experience</h2>

        <div className="mb-4">
          <div className="flex justify-between items-baseline">
            <p className="text-[12px] font-bold text-black">Senior Marketing Manager, Brightwave Inc.</p>
            <p className="text-[11px] text-gray-600">2022 - Present</p>
          </div>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Spearheaded digital campaigns generating $2.4M in annual revenue, exceeding targets by 35%</li>
            <li className="text-[11px] text-gray-800">Managed a team of 6 across content, social, and paid media, delivering 95% on-time project completion</li>
            <li className="text-[11px] text-gray-800">Optimized conversion funnel through A/B testing, increasing lead-to-customer rate by 28%</li>
            <li className="text-[11px] text-gray-800">Launched brand refresh initiative that improved brand recognition scores by 40% in key markets</li>
          </ul>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-baseline">
            <p className="text-[12px] font-bold text-black">Marketing Specialist, Greenfield Co.</p>
            <p className="text-[11px] text-gray-600">2019 - 2022</p>
          </div>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Executed multi-channel campaigns across email, social, and PPC, driving 150% increase in qualified leads</li>
            <li className="text-[11px] text-gray-800">Built and maintained marketing analytics dashboard tracking $1.2M in campaign spend</li>
            <li className="text-[11px] text-gray-800">Developed content strategy that grew organic traffic by 85% over 18 months</li>
            <li className="text-[11px] text-gray-800">Coordinated with sales team to create enablement materials, reducing sales cycle by 15%</li>
          </ul>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-baseline">
            <p className="text-[12px] font-bold text-black">Marketing Coordinator, Apex Media</p>
            <p className="text-[11px] text-gray-600">2017 - 2019</p>
          </div>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Managed social media accounts with 50K+ combined followers, increasing engagement by 60%</li>
            <li className="text-[11px] text-gray-800">Coordinated event marketing for 12 annual conferences, managing $200K in event budgets</li>
            <li className="text-[11px] text-gray-800">Created monthly performance reports for C-suite, synthesizing data from 8 marketing channels</li>
            <li className="text-[11px] text-gray-800">Assisted with website redesign project that improved bounce rate by 25%</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[13px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Education</h2>
        <div className="mb-2">
          <div className="flex justify-between items-baseline">
            <p className="text-[12px] font-bold text-black">MBA Marketing, Columbia University, New York</p>
            <p className="text-[11px] text-gray-600">2017</p>
          </div>
          <ul className="mt-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Dean&apos;s List, Marketing Excellence Award</li>
          </ul>
        </div>
        <div className="mb-2">
          <div className="flex justify-between items-baseline">
            <p className="text-[12px] font-bold text-black">BA Communications, Boston University</p>
            <p className="text-[11px] text-gray-600">2015</p>
          </div>
          <ul className="mt-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Graduated Magna Cum Laude, GPA: 3.8/4.0</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[13px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Certifications and Trainings</h2>
        <p className="text-[11px] text-gray-800">Google Analytics Certified — 2023</p>
        <p className="text-[11px] text-gray-800">HubSpot Content Marketing Certification — 2022</p>
        <p className="text-[11px] text-gray-800">Meta Certified Digital Marketing Associate — 2021</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[13px] font-bold text-black uppercase tracking-wide border-b-2 border-black pb-1 mb-2">Languages</h2>
        <p className="text-[11px] text-gray-800">English - Native</p>
        <p className="text-[11px] text-gray-800">Spanish - Conversational</p>
      </div>
    </div>
  );
}

/* ============================================================
   TEMPLATE 2 — US ATS Optimized
   Centered name/header, centered uppercase section titles,
   horizontal rules between sections
   ============================================================ */
function USATSTemplate() {
  return (
    <div className="bg-white text-black p-10 font-[Arial,Helvetica,sans-serif]" style={{ width: "210mm", minHeight: "297mm", fontSize: 14 }}>
      <div className="text-center mb-1">
        <h1 className="text-[26px] font-bold text-black leading-tight">Olivia Wilson</h1>
        <p className="text-[11px] text-gray-600 mt-1">New York, NY &bull; +1 (555) 123-4567 &bull; olivia.wilson@email.com &bull; linkedin.com/in/oliviawilson</p>
      </div>

      <div className="mt-6">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-widest text-center mb-1">Professional Summary</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[11.5px] text-gray-800 leading-relaxed">Results-driven marketing manager with 6+ years of experience in digital strategy, brand development, and campaign optimization. Proven track record of increasing revenue by 35% through data-driven marketing initiatives and cross-functional team leadership. Skilled at translating business objectives into measurable marketing outcomes.</p>
      </div>

      <div className="mt-6">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-widest text-center mb-1">Work Experience</h2>
        <div className="border-t border-gray-300 mb-3" />

        <div className="mb-4">
          <p className="text-[12px] font-bold text-blue-700">Senior Marketing Manager, Brightwave Inc. — 2022 - Present</p>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Spearheaded digital campaigns generating $2.4M in annual revenue, exceeding targets by 35%</li>
            <li className="text-[11px] text-gray-800">Managed a team of 6 across content, social, and paid media, delivering 95% on-time project completion</li>
            <li className="text-[11px] text-gray-800">Optimized conversion funnel through A/B testing, increasing lead-to-customer rate by 28%</li>
            <li className="text-[11px] text-gray-800">Launched brand refresh initiative that improved brand recognition scores by 40% in key markets</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-[12px] font-bold text-blue-700">Marketing Specialist, Greenfield Co. — 2019 - 2022</p>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Executed multi-channel campaigns across email, social, and PPC, driving 150% increase in qualified leads</li>
            <li className="text-[11px] text-gray-800">Built and maintained marketing analytics dashboard tracking $1.2M in campaign spend</li>
            <li className="text-[11px] text-gray-800">Developed content strategy that grew organic traffic by 85% over 18 months</li>
            <li className="text-[11px] text-gray-800">Coordinated with sales team to create enablement materials, reducing sales cycle by 15%</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-[12px] font-bold text-blue-700">Marketing Coordinator, Apex Media — 2017 - 2019</p>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Managed social media accounts with 50K+ combined followers, increasing engagement by 60%</li>
            <li className="text-[11px] text-gray-800">Coordinated event marketing for 12 annual conferences, managing $200K in event budgets</li>
            <li className="text-[11px] text-gray-800">Created monthly performance reports for C-suite, synthesizing data from 8 marketing channels</li>
            <li className="text-[11px] text-gray-800">Assisted with website redesign project that improved bounce rate by 25%</li>
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-widest text-center mb-1">Core Skills</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[11px] text-gray-800 leading-relaxed">Strategy &amp; Growth: Brand Strategy, Go-to-Market, Market Research, Campaign Planning</p>
        <p className="text-[11px] text-gray-800 leading-relaxed">Digital Marketing: SEO/SEM, Google Analytics, Social Media, Content Marketing, A/B Testing</p>
        <p className="text-[11px] text-gray-800 leading-relaxed">Leadership: Team Management, Stakeholder Communication, Budget Oversight, Cross-functional Collaboration</p>
        <p className="text-[11px] text-gray-800 leading-relaxed">Tools: HubSpot, Salesforce, Google Ads, Meta Business Suite, Tableau</p>
      </div>

      <div className="mt-6">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-widest text-center mb-1">Education</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[11.5px] text-gray-800">MBA Marketing, Columbia University, New York — 2017</p>
        <ul className="list-disc list-outside ml-4">
          <li className="text-[11px] text-gray-800">Dean&apos;s List, Marketing Excellence Award</li>
        </ul>
        <p className="text-[11.5px] text-gray-800 mt-2">BA Communications, Boston University — 2015</p>
        <ul className="list-disc list-outside ml-4">
          <li className="text-[11px] text-gray-800">Graduated Magna Cum Laude, GPA: 3.8/4.0</li>
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-widest text-center mb-1">Certifications and Trainings</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[11px] text-gray-800">Google Analytics Certified — 2023</p>
        <p className="text-[11px] text-gray-800">HubSpot Content Marketing Certification — 2022</p>
        <p className="text-[11px] text-gray-800">Meta Certified Digital Marketing Associate — 2021</p>
      </div>

      <div className="mt-6">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-widest text-center mb-1">Languages</h2>
        <div className="border-t border-gray-300 mb-3" />
        <p className="text-[11px] text-gray-800">English - Native</p>
        <p className="text-[11px] text-gray-800">Spanish - Conversational</p>
      </div>
    </div>
  );
}

/* ============================================================
   TEMPLATE 3 — AU CV Optimised
   Left-aligned, inline skill tags, different section naming
   (Key Skills, Professional Experience, Education & Qualifications,
   Professional Development)
   ============================================================ */
function AUCVTemplate() {
  return (
    <div className="bg-white text-black p-10 font-[Arial,Helvetica,sans-serif]" style={{ width: "210mm", minHeight: "297mm", fontSize: 14 }}>
      <div className="mb-1">
        <h1 className="text-[26px] font-bold text-black leading-tight">Olivia Wilson</h1>
        <p className="text-[10.5px] text-gray-500 mt-1">New York, NY &bull; +1 (555) 123-4567 &bull; olivia.wilson@email.com &bull; linkedin.com/in/oliviawilson</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-wide mb-2">Professional Summary</h2>
        <p className="text-[11.5px] text-gray-800 leading-relaxed">Results-driven marketing manager with 6+ years of experience in digital strategy, brand development, and campaign optimization. Proven track record of increasing revenue by 35% through data-driven marketing initiatives and cross-functional team leadership. Skilled at translating business objectives into measurable marketing outcomes.</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-wide mb-2">Key Skills</h2>
        <p className="text-[11px] text-gray-800 leading-relaxed">Brand Strategy | Go-to-Market | Market Research | Campaign Planning | SEO/SEM | Google Analytics | Social Media | Content Marketing | A/B Testing | Team Management | Stakeholder Communication | Budget Oversight | Cross-functional Collaboration | HubSpot | Salesforce | Tableau</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-wide mb-3">Professional Experience</h2>

        <div className="mb-4">
          <p className="text-[12px] font-bold text-black">Senior Marketing Manager — 2022 - Present</p>
          <p className="text-[11px] text-gray-600 mb-1">Brightwave Inc.</p>
          <ul className="space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Spearheaded digital campaigns generating $2.4M in annual revenue, exceeding targets by 35%</li>
            <li className="text-[11px] text-gray-800">Managed a team of 6 across content, social, and paid media, delivering 95% on-time project completion</li>
            <li className="text-[11px] text-gray-800">Optimized conversion funnel through A/B testing, increasing lead-to-customer rate by 28%</li>
            <li className="text-[11px] text-gray-800">Launched brand refresh initiative that improved brand recognition scores by 40% in key markets</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-[12px] font-bold text-black">Marketing Specialist — 2019 - 2022</p>
          <p className="text-[11px] text-gray-600 mb-1">Greenfield Co.</p>
          <ul className="space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Executed multi-channel campaigns across email, social, and PPC, driving 150% increase in qualified leads</li>
            <li className="text-[11px] text-gray-800">Built and maintained marketing analytics dashboard tracking $1.2M in campaign spend</li>
            <li className="text-[11px] text-gray-800">Developed content strategy that grew organic traffic by 85% over 18 months</li>
            <li className="text-[11px] text-gray-800">Coordinated with sales team to create enablement materials, reducing sales cycle by 15%</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-[12px] font-bold text-black">Marketing Coordinator — 2017 - 2019</p>
          <p className="text-[11px] text-gray-600 mb-1">Apex Media</p>
          <ul className="space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Managed social media accounts with 50K+ combined followers, increasing engagement by 60%</li>
            <li className="text-[11px] text-gray-800">Coordinated event marketing for 12 annual conferences, managing $200K in event budgets</li>
            <li className="text-[11px] text-gray-800">Created monthly performance reports for C-suite, synthesizing data from 8 marketing channels</li>
            <li className="text-[11px] text-gray-800">Assisted with website redesign project that improved bounce rate by 25%</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-wide mb-2">Education &amp; Qualifications</h2>
        <div className="mb-2">
          <p className="text-[11.5px] text-gray-800">MBA Marketing, Columbia University, New York — 2017</p>
          <ul className="list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Dean&apos;s List, Marketing Excellence Award</li>
          </ul>
        </div>
        <div className="mb-2">
          <p className="text-[11.5px] text-gray-800">BA Communications, Boston University — 2015</p>
          <ul className="list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Graduated Magna Cum Laude, GPA: 3.8/4.0</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-wide mb-2">Professional Development</h2>
        <p className="text-[11px] text-gray-800">Google Analytics Certified — 2023</p>
        <p className="text-[11px] text-gray-800">HubSpot Content Marketing Certification — 2022</p>
        <p className="text-[11px] text-gray-800">Meta Certified Digital Marketing Associate — 2021</p>
      </div>

      <div className="mt-5">
        <h2 className="text-[12px] font-bold text-black uppercase tracking-wide mb-2">Languages</h2>
        <p className="text-[11px] text-gray-800">English - Native</p>
        <p className="text-[11px] text-gray-800">Spanish - Conversational</p>
      </div>
    </div>
  );
}
