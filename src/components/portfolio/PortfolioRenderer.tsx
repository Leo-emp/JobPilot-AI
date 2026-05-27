"use client";

/* # Template dispatcher — picks the right template component based on portfolio data */

import dynamic from "next/dynamic";
import type { PortfolioData } from "@/lib/portfolio-types";
import type { TemplateName } from "@/lib/portfolio-types";
import type { ComponentType } from "react";

/* # Lazy-load templates — only the selected one is bundled per page */
const MinimalTemplate = dynamic(() => import("./templates/MinimalTemplate"));
const DeveloperTemplate = dynamic(() => import("./templates/DeveloperTemplate"));
const CreativeTemplate = dynamic(() => import("./templates/CreativeTemplate"));
const CorporateTemplate = dynamic(() => import("./templates/CorporateTemplate"));
const AcademicTemplate = dynamic(() => import("./templates/AcademicTemplate"));
const ModernTemplate = dynamic(() => import("./templates/ModernTemplate"));
const VideographerTemplate = dynamic(() => import("./templates/VideographerTemplate"));
const PhotographerTemplate = dynamic(() => import("./templates/PhotographerTemplate"));
const ArchitectTemplate = dynamic(() => import("./templates/ArchitectTemplate"));

const TEMPLATE_MAP: Record<TemplateName, ComponentType<{ data: PortfolioData }>> = {
  minimal: MinimalTemplate,
  developer: DeveloperTemplate,
  creative: CreativeTemplate,
  corporate: CorporateTemplate,
  academic: AcademicTemplate,
  modern: ModernTemplate,
  videographer: VideographerTemplate,
  photographer: PhotographerTemplate,
  architect: ArchitectTemplate,
};

export function PortfolioRenderer({ data }: { data: PortfolioData }) {
  const Template = TEMPLATE_MAP[data.template] || MinimalTemplate;
  return <Template data={data} />;
}
