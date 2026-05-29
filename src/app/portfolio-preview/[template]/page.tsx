/* ============================================================
   TEMPLATE PREVIEW PAGE
   ============================================================
   Full-page preview of a portfolio template with rich demo data.
   Renders all 11 section types so users can see exactly what
   the template looks like before choosing it.
   URL: /portfolio-preview/[template]
   ============================================================ */

"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES, TEMPLATE_INFO } from "@/lib/portfolio-types";
import type { TemplateName } from "@/lib/portfolio-types";
import { getDemoPortfolioData } from "@/lib/demo-portfolio-data";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";

export default function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = use(params);
  const router = useRouter();

  /* # Validate template name — fall back to minimal if invalid */
  const isValid = (TEMPLATES as readonly string[]).includes(template);
  const templateName = isValid ? (template as TemplateName) : "minimal";
  const info = TEMPLATE_INFO[templateName];

  /* # Build demo data for the selected template */
  const demoData = getDemoPortfolioData(templateName);

  return (
    <div className="relative min-h-screen">
      {/* # Floating top bar with back button and template name */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-black/80 backdrop-blur-sm text-white border border-white/10 hover:bg-black/90 hover:border-white/20 transition-all shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Editor
        </button>

        {/* # Template name badge */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-black/60 backdrop-blur-sm text-white/70 border border-white/10">
            {info.name} Template
          </span>
          <div className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-indigo/90 backdrop-blur-sm text-white border border-brand-indigo/50 shadow-lg uppercase tracking-wider">
            Demo Preview
          </div>
        </div>
      </div>

      {/* # Full template render with demo data */}
      <PortfolioRenderer data={demoData} />
    </div>
  );
}
