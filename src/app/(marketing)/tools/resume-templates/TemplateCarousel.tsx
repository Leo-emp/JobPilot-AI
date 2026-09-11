/* ============================================================
   TEMPLATE CAROUSEL — Client component for swipeable resume
   previews. Shows one template at a time with arrow navigation
   and dot indicators. CSS scroll-snap for touch swipe support.
   ============================================================ */

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";

const TOTAL = 3;

export default function TemplateCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* # Sync dot indicator with scroll position */
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.min(idx, TOTAL - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* # Navigate to a specific slide */
  const goTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  const prev = () => goTo(Math.max(0, active - 1));
  const next = () => goTo(Math.min(TOTAL - 1, active + 1));

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* # Left arrow */}
      {active > 0 && (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-10 w-10 h-10 rounded-full bg-space-700/80 border border-card-border flex items-center justify-center text-white hover:bg-space-700 transition-colors"
          aria-label="Previous template"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}

      {/* # Right arrow */}
      {active < TOTAL - 1 && (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 z-10 w-10 h-10 rounded-full bg-space-700/80 border border-card-border flex items-center justify-center text-white hover:bg-space-700 transition-colors"
          aria-label="Next template"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      )}

      {/* # Scrollable container with snap */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="snap-center shrink-0 w-full flex justify-center px-2">
          <TemplateCard><StandardATSTemplate /></TemplateCard>
        </div>
        <div className="snap-center shrink-0 w-full flex justify-center px-2">
          <TemplateCard><USATSTemplate /></TemplateCard>
        </div>
        <div className="snap-center shrink-0 w-full flex justify-center px-2">
          <TemplateCard><AUCVTemplate /></TemplateCard>
        </div>
      </div>

      {/* # Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${i === active ? "bg-brand-light" : "bg-white/20 hover:bg-white/40"}`}
            aria-label={`Template ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TEMPLATE CARD WRAPPER
   Renders a full-size A4 resume scaled down inside a fixed
   container with a hover overlay.
   ============================================================ */
function TemplateCard({ children }: { children: React.ReactNode }) {
  return (
    <Link href="/signup" className="group block w-full max-w-xl">
      <div className="relative rounded-xl overflow-hidden bg-white shadow-lg shadow-black/30" style={{ height: 780 }}>
        <div className="origin-top-left" style={{ transform: "scale(0.62)", width: "210mm", minHeight: "297mm" }}>
          {children}
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-6 py-3 rounded-xl bg-brand-indigo/90 text-white text-sm font-bold border border-brand-indigo/50">Select Template</span>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   TEMPLATE 1 — Standard ATS-Friendly
   Left-aligned, bold uppercase section headers, clean layout
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
          <p className="text-[12px] font-bold text-black">Senior Marketing Manager, Brightwave Inc. — 2022 - Present</p>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Spearheaded digital campaigns generating $2.4M in annual revenue, exceeding targets by 35%</li>
            <li className="text-[11px] text-gray-800">Managed a team of 6 across content, social, and paid media, delivering 95% on-time project completion</li>
            <li className="text-[11px] text-gray-800">Optimized conversion funnel through A/B testing, increasing lead-to-customer rate by 28%</li>
            <li className="text-[11px] text-gray-800">Launched brand refresh initiative that improved brand recognition scores by 40% in key markets</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-[12px] font-bold text-black">Marketing Specialist, Greenfield Co. — 2019 - 2022</p>
          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
            <li className="text-[11px] text-gray-800">Executed multi-channel campaigns across email, social, and PPC, driving 150% increase in qualified leads</li>
            <li className="text-[11px] text-gray-800">Built and maintained marketing analytics dashboard tracking $1.2M in campaign spend</li>
            <li className="text-[11px] text-gray-800">Developed content strategy that grew organic traffic by 85% over 18 months</li>
            <li className="text-[11px] text-gray-800">Coordinated with sales team to create enablement materials, reducing sales cycle by 15%</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-[12px] font-bold text-black">Marketing Coordinator, Apex Media — 2017 - 2019</p>
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
   Left-aligned, pipe-delimited skills, different section names
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
