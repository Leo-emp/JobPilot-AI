/* ============================================================
   RESUME TEMPLATES PAGE — 20+ Professional Templates
   ============================================================
   Complete resume builder with:
   1. Visual template gallery (20 templates, mini previews)
   2. Form to fill in resume details
   3. Live preview matching the selected template exactly
   4. Edit content before downloading
   5. PDF and Word export

   Template categories:
   - Single Column (6): Classic, Modern, Minimal, Executive, Elegant, Clean
   - Sidebar Left (8): Corporate, Professional, Creative, Tech, Consultant, Premium, Bold, Fresh
   - Sidebar Right (2): Sleek, Designer
   - Banner Header (2): Banner, Noir
   - Special (2): Timeline, Compact
   ============================================================ */

"use client";

import { useState, useCallback, useRef } from "react";

/* ============================================================
   RESUME DATA INTERFACE
   ============================================================ */
interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  certifications: string;
  languages: string;
}

const EMPTY_FORM: ResumeData = {
  fullName: "", jobTitle: "", email: "", phone: "",
  location: "", linkedin: "", summary: "", skills: "",
  experience: "", education: "", certifications: "", languages: "",
};

/* ============================================================
   SAMPLE DATA — Used for template previews
   ============================================================ */
const SAMPLE: ResumeData = {
  fullName: "Olivia Wilson",
  jobTitle: "Marketing Manager",
  email: "olivia.wilson@email.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  linkedin: "linkedin.com/in/oliviawilson",
  summary: "Results-driven marketing manager with 6+ years of experience in digital strategy, brand development, and campaign optimization. Proven track record of increasing revenue by 35% through data-driven marketing initiatives and cross-functional team leadership. Skilled at translating business objectives into measurable marketing outcomes.",
  skills: "Strategy & Growth: Brand Strategy, Go-to-Market, Market Research, Campaign Planning\nDigital Marketing: SEO/SEM, Google Analytics, Social Media, Content Marketing, A/B Testing\nLeadership: Team Management, Stakeholder Communication, Budget Oversight, Cross-functional Collaboration\nTools: HubSpot, Salesforce, Google Ads, Meta Business Suite, Tableau",
  experience: "Senior Marketing Manager | Brightwave Inc. | 2022 - Present\n- Spearheaded digital campaigns generating $2.4M in annual revenue, exceeding targets by 35%\n- Managed a team of 6 across content, social, and paid media, delivering 95% on-time project completion\n- Optimized conversion funnel through A/B testing, increasing lead-to-customer rate by 28%\n- Launched brand refresh initiative that improved brand recognition scores by 40% in key markets\n\nMarketing Specialist | Greenfield Co. | 2019 - 2022\n- Executed multi-channel campaigns across email, social, and PPC, driving 150% increase in qualified leads\n- Built and maintained marketing analytics dashboard tracking $1.2M in campaign spend\n- Developed content strategy that grew organic traffic by 85% over 18 months\n- Coordinated with sales team to create enablement materials, reducing sales cycle by 15%\n\nMarketing Coordinator | Apex Media | 2017 - 2019\n- Managed social media accounts with 50K+ combined followers, increasing engagement by 60%\n- Coordinated event marketing for 12 annual conferences, managing $200K in event budgets\n- Created monthly performance reports for C-suite, synthesizing data from 8 marketing channels\n- Assisted with website redesign project that improved bounce rate by 25%",
  education: "MBA Marketing | Columbia University, New York | 2017\n- Dean's List, Marketing Excellence Award\n\nBA Communications | Boston University | 2015\n- Graduated Magna Cum Laude, GPA: 3.8/4.0",
  certifications: "Google Analytics Certified — 2023\nHubSpot Content Marketing Certification — 2022\nMeta Certified Digital Marketing Associate — 2021",
  languages: "English - Native\nSpanish - Conversational\nFrench - Basic",
};

/* ============================================================
   TEMPLATE DEFINITIONS — 20 Distinct Templates
   ============================================================ */
type LayoutType = "single" | "sidebar-left" | "sidebar-right" | "banner";

interface Template {
  id: string;
  name: string;
  desc: string;
  category: string;
  layout: LayoutType;
  /* Mini-preview styling hints */
  previewBg: string;      /* sidebar/header bg color for mini preview */
  previewAccent: string;   /* accent color for mini preview */
  previewLight: boolean;   /* true = light sidebar text in mini preview */
  /* Full CSS for this template */
  css: string;
}

/* ---- Shared base CSS for single-column layouts ---- */
const SINGLE_BASE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { max-width: 800px; margin: 0 auto; padding: 36px 40px; line-height: 1.5; font-size: 13.5px; color: #1a1a1a; }
  .header { margin-bottom: 14px; }
  .name { margin-bottom: 2px; }
  .job-title { margin-bottom: 4px; }
  .contact { font-size: 12.5px; color: #555; margin-bottom: 12px; }
  .section { margin-bottom: 14px; }
  .section-title { margin-bottom: 6px; font-size: 13px; }
  .summary { font-size: 13px; color: #333; line-height: 1.5; margin-bottom: 14px; }
  .entry { margin-bottom: 10px; }
  .entry-title { font-weight: 700; font-size: 13px; color: #111; margin-bottom: 1px; }
  .entry-sub { font-size: 12.5px; color: #444; margin-bottom: 3px; }
  ul { padding-left: 17px; margin: 3px 0 6px 0; }
  li { font-size: 12.5px; line-height: 1.45; margin-bottom: 2px; color: #333; }
  strong { color: #111; font-weight: 700; }
  p { margin: 0 0 4px 0; font-size: 12.5px; color: #333; }
  @media print { body { padding: 20px; } }
`;

/* ---- Shared base CSS for sidebar layouts ---- */
const SIDEBAR_BASE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin: 0; padding: 0; font-size: 12.5px; line-height: 1.45; color: #1a1a1a; }
  .resume-wrap { display: flex; min-height: 100vh; }
  .sidebar { width: 34%; padding: 28px 18px; }
  .main { width: 66%; padding: 28px 24px; }
  .name { margin-bottom: 2px; }
  .job-title { margin-bottom: 10px; font-size: 12px; }
  .contact-item { font-size: 11.5px; margin-bottom: 5px; }
  .sidebar .section { margin-bottom: 16px; }
  .sidebar .section-title { font-size: 11.5px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .main .section { margin-bottom: 14px; }
  .main .section-title { font-size: 12.5px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .summary { font-size: 12px; line-height: 1.5; margin-bottom: 14px; }
  .entry { margin-bottom: 10px; }
  .entry-title { font-weight: 700; font-size: 12.5px; margin-bottom: 1px; }
  .entry-sub { font-size: 11.5px; margin-bottom: 3px; }
  ul { padding-left: 15px; margin: 3px 0 6px 0; }
  li { font-size: 12px; line-height: 1.4; margin-bottom: 2px; }
  .skill-cat { margin-bottom: 6px; font-size: 11.5px; }
  strong { font-weight: 700; }
  p { margin: 0 0 3px 0; font-size: 12px; }
  @media print { .resume-wrap { min-height: auto; } }
`;

/* ---- Shared base CSS for banner layouts ---- */
const BANNER_BASE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; padding: 0; font-size: 13.5px; line-height: 1.5; color: #1a1a1a; }
  .banner { padding: 28px 40px; }
  .name { color: #fff; margin-bottom: 2px; }
  .job-title { color: rgba(255,255,255,0.85); margin-bottom: 6px; }
  .contact { color: rgba(255,255,255,0.75); font-size: 12.5px; }
  .body { padding: 24px 40px; max-width: 800px; }
  .section { margin-bottom: 14px; }
  .section-title { margin-bottom: 6px; font-size: 13px; }
  .summary { font-size: 13px; color: #333; line-height: 1.5; margin-bottom: 14px; }
  .entry { margin-bottom: 10px; }
  .entry-title { font-weight: 700; font-size: 13px; color: #111; }
  .entry-sub { font-size: 12.5px; color: #444; margin-bottom: 3px; }
  ul { padding-left: 17px; margin: 3px 0 6px 0; }
  li { font-size: 12.5px; line-height: 1.45; margin-bottom: 2px; color: #333; }
  strong { color: #111; font-weight: 700; }
  p { margin: 0 0 4px 0; font-size: 12.5px; color: #333; }
  @media print { body { padding: 0; } }
`;

/* ---- 20 Template Definitions ---- */
const TEMPLATES: Template[] = [
  /* ======== SINGLE COLUMN ======== */
  {
    id: "classic", name: "Classic", desc: "Traditional serif layout trusted by Fortune 500 recruiters",
    category: "Single Column", layout: "single",
    previewBg: "#fff", previewAccent: "#111", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: Georgia, 'Times New Roman', serif; }
      .name { font-size: 26px; font-weight: 700; color: #111; }
      .job-title { font-size: 14px; color: #444; font-style: italic; }
      .contact { border-bottom: 2px solid #111; padding-bottom: 10px; }
      .section-title { font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #111; border-bottom: 1px solid #999; padding-bottom: 3px; }
    `,
  },
  {
    id: "modern", name: "Modern", desc: "Clean sans-serif with indigo accent",
    category: "Single Column", layout: "single",
    previewBg: "#fff", previewAccent: "#4f46e5", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .header { border-left: 4px solid #4f46e5; padding-left: 16px; }
      .name { font-size: 28px; font-weight: 700; color: #1e1b4b; }
      .job-title { font-size: 14px; color: #4f46e5; }
      .section-title { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #4f46e5; border-bottom: 2px solid #e0e0ff; padding-bottom: 3px; }
    `,
  },
  {
    id: "minimal", name: "Minimal", desc: "Ultra-clean with maximum whitespace",
    category: "Single Column", layout: "single",
    previewBg: "#fff", previewAccent: "#999", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
      .name { font-size: 24px; font-weight: 300; color: #111; letter-spacing: 1px; }
      .job-title { font-size: 13px; color: #888; letter-spacing: 2px; text-transform: uppercase; }
      .contact { font-size: 12px; color: #999; }
      .section { margin-bottom: 18px; }
      .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; color: #aaa; border-bottom: 1px solid #e5e5e5; padding-bottom: 3px; }
    `,
  },
  {
    id: "executive", name: "Executive", desc: "Bold dark header for senior-level roles",
    category: "Single Column", layout: "single",
    previewBg: "#1a1a1a", previewAccent: "#fff", previewLight: true,
    css: SINGLE_BASE + `
      body { font-family: Calibri, Arial, sans-serif; padding-top: 0; }
      .header { background: #1a1a1a; color: #fff; padding: 24px 30px; margin: -36px -40px 20px -40px; }
      .name { font-size: 28px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 2px; }
      .job-title { font-size: 13px; color: #ccc; text-transform: uppercase; letter-spacing: 1px; }
      .contact { color: #bbb; border: none; padding: 0; }
      .section-title { font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; background: #f0f0f0; padding: 5px 10px; color: #111; font-size: 12px; }
    `,
  },
  {
    id: "elegant", name: "Elegant", desc: "Centered serif with refined double borders",
    category: "Single Column", layout: "single",
    previewBg: "#fff", previewAccent: "#8b5e3c", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: Georgia, serif; }
      .header { text-align: center; border-top: 2px solid #8b5e3c; border-bottom: 2px solid #8b5e3c; padding: 14px 0; margin-bottom: 16px; }
      .name { font-size: 26px; font-weight: 700; color: #8b5e3c; }
      .job-title { font-size: 13px; color: #666; font-style: italic; }
      .contact { color: #666; }
      .section-title { font-weight: 700; font-variant: small-caps; letter-spacing: 1px; color: #8b5e3c; border-bottom: 1px solid #d4b896; padding-bottom: 3px; font-size: 14px; }
    `,
  },
  {
    id: "clean", name: "Clean", desc: "Teal accents with clean dividers",
    category: "Single Column", layout: "single",
    previewBg: "#fff", previewAccent: "#0d9488", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
      .name { font-size: 26px; font-weight: 700; color: #0d9488; }
      .job-title { font-size: 13px; color: #555; }
      .section-title { font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #0d9488; border-bottom: 2px solid #ccfbf1; padding-bottom: 3px; }
      .entry-title { color: #0f766e; }
    `,
  },

  /* ======== SIDEBAR LEFT ======== */
  {
    id: "corporate", name: "Corporate", desc: "Navy sidebar, professional corporate feel",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#1e293b", previewAccent: "#60a5fa", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .sidebar { background: #1e293b; color: #e2e8f0; }
      .name { font-size: 22px; font-weight: 700; color: #fff; }
      .job-title { color: #93c5fd; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
      .contact-item { color: #cbd5e1; }
      .sidebar .section-title { color: #93c5fd; font-weight: 700; border-bottom: 1px solid #334155; padding-bottom: 3px; }
      .sidebar li { color: #cbd5e1; }
      .sidebar p { color: #cbd5e1; }
      .main .section-title { font-weight: 700; color: #1e293b; border-bottom: 2px solid #1e293b; padding-bottom: 3px; }
    `,
  },
  {
    id: "professional", name: "Professional", desc: "Deep blue sidebar, clean and trusted",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#1e3a5f", previewAccent: "#7dd3fc", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, Arial, sans-serif; }
      .sidebar { background: #1e3a5f; color: #e0f2fe; }
      .name { font-size: 22px; font-weight: 700; color: #fff; }
      .job-title { color: #7dd3fc; font-size: 12px; }
      .contact-item { color: #bae6fd; }
      .sidebar .section-title { color: #7dd3fc; font-weight: 700; border-bottom: 1px solid #2d5a8e; padding-bottom: 3px; }
      .sidebar li { color: #bae6fd; }
      .sidebar p { color: #bae6fd; }
      .main .section-title { font-weight: 700; color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 3px; }
    `,
  },
  {
    id: "creative", name: "Creative", desc: "Bold red sidebar for standout applications",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#dc2626", previewAccent: "#fca5a5", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
      .sidebar { background: #dc2626; color: #fee2e2; }
      .name { font-size: 22px; font-weight: 700; color: #fff; }
      .job-title { color: #fecaca; font-size: 12px; text-transform: uppercase; }
      .contact-item { color: #fecaca; }
      .sidebar .section-title { color: #fff; font-weight: 700; border-bottom: 1px solid #ef4444; padding-bottom: 3px; }
      .sidebar li { color: #fee2e2; }
      .sidebar p { color: #fee2e2; }
      .main .section-title { font-weight: 700; color: #dc2626; border-bottom: 2px solid #fecaca; padding-bottom: 3px; }
    `,
  },
  {
    id: "tech", name: "Tech", desc: "Dark charcoal with cyan accents for tech roles",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#1a1a2e", previewAccent: "#22d3ee", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .sidebar { background: #1a1a2e; color: #d1d5db; }
      .name { font-size: 22px; font-weight: 700; color: #22d3ee; }
      .job-title { color: #67e8f9; font-size: 12px; }
      .contact-item { color: #9ca3af; }
      .sidebar .section-title { color: #22d3ee; font-weight: 700; border-bottom: 1px solid #2d2d4e; padding-bottom: 3px; }
      .sidebar li { color: #d1d5db; }
      .sidebar p { color: #d1d5db; }
      .main .section-title { font-weight: 700; color: #1a1a2e; border-bottom: 2px solid #22d3ee; padding-bottom: 3px; }
    `,
  },
  {
    id: "consultant", name: "Consultant", desc: "Teal sidebar with a professional consulting feel",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#0f766e", previewAccent: "#5eead4", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, Arial, sans-serif; }
      .sidebar { background: #0f766e; color: #ccfbf1; }
      .name { font-size: 22px; font-weight: 700; color: #fff; }
      .job-title { color: #99f6e4; font-size: 12px; }
      .contact-item { color: #99f6e4; }
      .sidebar .section-title { color: #fff; font-weight: 700; border-bottom: 1px solid #14b8a6; padding-bottom: 3px; }
      .sidebar li { color: #ccfbf1; }
      .sidebar p { color: #ccfbf1; }
      .main .section-title { font-weight: 700; color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 3px; }
    `,
  },
  {
    id: "premium", name: "Premium", desc: "Near-black sidebar with gold accents",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#111827", previewAccent: "#d4a843", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Georgia, serif; }
      .sidebar { background: #111827; color: #d1d5db; }
      .name { font-size: 22px; font-weight: 700; color: #d4a843; }
      .job-title { color: #fbbf24; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
      .contact-item { color: #9ca3af; }
      .sidebar .section-title { color: #d4a843; font-weight: 700; border-bottom: 1px solid #374151; padding-bottom: 3px; font-family: Calibri, sans-serif; }
      .sidebar li { color: #d1d5db; }
      .sidebar p { color: #d1d5db; }
      .main .section-title { font-weight: 700; color: #111827; border-bottom: 2px solid #d4a843; padding-bottom: 3px; font-family: Calibri, sans-serif; }
    `,
  },
  {
    id: "bold", name: "Bold", desc: "Black sidebar with amber highlights",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#000", previewAccent: "#f59e0b", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .sidebar { background: #000; color: #e5e7eb; }
      .name { font-size: 22px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; }
      .job-title { color: #fbbf24; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; }
      .contact-item { color: #9ca3af; }
      .sidebar .section-title { color: #f59e0b; font-weight: 800; border-bottom: 1px solid #333; padding-bottom: 3px; }
      .sidebar li { color: #d1d5db; }
      .sidebar p { color: #d1d5db; }
      .main .section-title { font-weight: 800; color: #000; border-bottom: 3px solid #f59e0b; padding-bottom: 3px; }
    `,
  },
  {
    id: "fresh", name: "Fresh", desc: "Light sage sidebar with green accents",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#f0fdf4", previewAccent: "#16a34a", previewLight: false,
    css: SIDEBAR_BASE + `
      body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
      .sidebar { background: #f0fdf4; color: #1a1a1a; border-right: 2px solid #bbf7d0; }
      .name { font-size: 22px; font-weight: 700; color: #15803d; }
      .job-title { color: #16a34a; font-size: 12px; }
      .contact-item { color: #555; }
      .sidebar .section-title { color: #15803d; font-weight: 700; border-bottom: 1px solid #bbf7d0; padding-bottom: 3px; }
      .sidebar li { color: #374151; }
      .sidebar p { color: #374151; }
      .main .section-title { font-weight: 700; color: #15803d; border-bottom: 2px solid #bbf7d0; padding-bottom: 3px; }
    `,
  },

  /* ======== SIDEBAR RIGHT ======== */
  {
    id: "sleek", name: "Sleek", desc: "Right sidebar with slate blue styling",
    category: "Sidebar", layout: "sidebar-right",
    previewBg: "#334155", previewAccent: "#94a3b8", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, Arial, sans-serif; }
      .sidebar { background: #334155; color: #e2e8f0; }
      .sidebar .section-title { color: #94a3b8; font-weight: 700; border-bottom: 1px solid #475569; padding-bottom: 3px; }
      .sidebar li { color: #cbd5e1; }
      .sidebar p { color: #cbd5e1; }
      .contact-item { color: #cbd5e1; }
      .main .name { font-size: 26px; font-weight: 700; color: #1e293b; }
      .main .job-title { font-size: 14px; color: #64748b; margin-bottom: 10px; }
      .main .section-title { font-weight: 700; color: #334155; border-bottom: 2px solid #334155; padding-bottom: 3px; }
    `,
  },
  {
    id: "designer", name: "Designer", desc: "Right sidebar with rose/magenta accents",
    category: "Sidebar", layout: "sidebar-right",
    previewBg: "#9f1239", previewAccent: "#fda4af", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: 'Segoe UI', Calibri, sans-serif; }
      .sidebar { background: #9f1239; color: #ffe4e6; }
      .sidebar .section-title { color: #fecdd3; font-weight: 700; border-bottom: 1px solid #be123c; padding-bottom: 3px; }
      .sidebar li { color: #ffe4e6; }
      .sidebar p { color: #ffe4e6; }
      .contact-item { color: #fecdd3; }
      .main .name { font-size: 26px; font-weight: 700; color: #9f1239; }
      .main .job-title { font-size: 14px; color: #be123c; margin-bottom: 10px; }
      .main .section-title { font-weight: 700; color: #9f1239; border-bottom: 2px solid #fecdd3; padding-bottom: 3px; }
    `,
  },

  /* ======== BANNER HEADER ======== */
  {
    id: "banner", name: "Banner", desc: "Full-width navy header with white text",
    category: "Banner", layout: "banner",
    previewBg: "#1e293b", previewAccent: "#fff", previewLight: true,
    css: BANNER_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .banner { background: #1e293b; }
      .name { font-size: 28px; font-weight: 700; }
      .job-title { font-size: 14px; }
      .section-title { font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1e293b; border-bottom: 2px solid #1e293b; padding-bottom: 3px; }
    `,
  },
  {
    id: "noir", name: "Noir", desc: "Dark header with minimal monochrome body",
    category: "Banner", layout: "banner",
    previewBg: "#111", previewAccent: "#888", previewLight: true,
    css: BANNER_BASE + `
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
      .banner { background: #111; }
      .name { font-size: 26px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }
      .job-title { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #888; }
      .contact { color: #888; }
      .section-title { font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #555; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-size: 12px; }
      .entry-title { font-weight: 600; }
    `,
  },

  /* ======== SPECIAL ======== */
  {
    id: "timeline", name: "Timeline", desc: "Left timeline dots for work experience",
    category: "Special", layout: "single",
    previewBg: "#fff", previewAccent: "#6366f1", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .name { font-size: 26px; font-weight: 700; color: #312e81; }
      .job-title { font-size: 13px; color: #6366f1; }
      .section-title { font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #4f46e5; border-bottom: 2px solid #e0e7ff; padding-bottom: 3px; }
      .entry { border-left: 2px solid #c7d2fe; padding-left: 14px; margin-left: 6px; position: relative; }
      .entry::before { content: ''; position: absolute; left: -5px; top: 4px; width: 8px; height: 8px; border-radius: 50%; background: #6366f1; }
    `,
  },
  {
    id: "compact", name: "Compact", desc: "Dense layout maximizing content per page",
    category: "Special", layout: "single",
    previewBg: "#fff", previewAccent: "#374151", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: Calibri, Arial, sans-serif; font-size: 12.5px; padding: 28px 32px; line-height: 1.4; }
      .name { font-size: 22px; font-weight: 700; color: #111; }
      .job-title { font-size: 12px; color: #555; }
      .contact { font-size: 11.5px; }
      .section { margin-bottom: 10px; }
      .section-title { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #374151; border-bottom: 1.5px solid #374151; padding-bottom: 2px; margin-bottom: 4px; }
      .entry { margin-bottom: 7px; }
      .entry-title { font-size: 12px; }
      li { font-size: 11.5px; line-height: 1.35; margin-bottom: 1px; }
      .summary { font-size: 12px; line-height: 1.4; }
    `,
  },
];

/* ============================================================
   EXPERIENCE / EDUCATION PARSER
   ============================================================ */
function parseEntries(text: string): { title: string; sub: string; bullets: string[] }[] {
  const lines = text.split("\n").filter(l => l.trim());
  const entries: { title: string; sub: string; bullets: string[] }[] = [];
  let current: { title: string; sub: string; bullets: string[] } | null = null;
  for (const line of lines) {
    const t = line.trim();
    if (t.includes(" | ")) {
      if (current) entries.push(current);
      const parts = t.split(" | ").map(p => p.trim());
      current = { title: parts[0] + (parts[2] ? ` — ${parts[2]}` : ""), sub: parts[1] || "", bullets: [] };
    } else if (t.startsWith("- ") || t.startsWith("• ")) {
      if (current) current.bullets.push(t.replace(/^[-•]\s*/, ""));
    } else if (current) {
      current.bullets.push(t);
    }
  }
  if (current) entries.push(current);
  return entries;
}

/* ============================================================
   HTML GENERATORS — One per layout type
   ============================================================ */
function escapeHTML(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildEntriesHTML(text: string): string {
  const entries = parseEntries(text);
  if (entries.length === 0) return `<p>${escapeHTML(text)}</p>`;
  return entries.map(e => `
    <div class="entry">
      <div class="entry-title">${escapeHTML(e.title)}</div>
      ${e.sub ? `<div class="entry-sub">${escapeHTML(e.sub)}</div>` : ""}
      ${e.bullets.length > 0 ? `<ul>${e.bullets.map(b => `<li>${escapeHTML(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");
}

function buildSkillsHTML(text: string): string {
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length === 0) return "";
  return `<ul>${lines.map(l => `<li>${l.replace(/^[-•]\s*/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</li>`).join("")}</ul>`;
}

function buildCertsHTML(text: string): string {
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length === 0) return "";
  return `<ul>${lines.map(l => `<li>${escapeHTML(l.replace(/^[-•]\s*/, ""))}</li>`).join("")}</ul>`;
}

function contactLine(d: ResumeData, sep: string = " &bull; "): string {
  return [d.location, d.phone, d.email, d.linkedin].filter(Boolean).join(sep);
}

/* ---- Single Column HTML ---- */
function singleHTML(d: ResumeData, css: string): string {
  let body = "";
  if (d.summary) body += `<div class="summary">${escapeHTML(d.summary)}</div>`;
  if (d.skills) body += `<div class="section"><div class="section-title">Core Skills</div>${buildSkillsHTML(d.skills)}</div>`;
  if (d.experience) body += `<div class="section"><div class="section-title">Work Experience</div>${buildEntriesHTML(d.experience)}</div>`;
  if (d.education) body += `<div class="section"><div class="section-title">Education</div>${buildEntriesHTML(d.education)}</div>`;
  if (d.certifications) body += `<div class="section"><div class="section-title">Certifications and Trainings</div>${buildCertsHTML(d.certifications)}</div>`;
  if (d.languages) body += `<div class="section"><div class="section-title">Languages</div><p>${escapeHTML(d.languages).replace(/\n/g, " &bull; ")}</p></div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
    <div class="header">
      <div class="name">${escapeHTML(d.fullName || "Your Name")}</div>
      ${d.jobTitle ? `<div class="job-title">${escapeHTML(d.jobTitle)}</div>` : ""}
      <div class="contact">${contactLine(d)}</div>
    </div>${body}</body></html>`;
}

/* ---- Sidebar Left HTML ---- */
function sidebarLeftHTML(d: ResumeData, css: string): string {
  let sidebar = `<div class="name">${escapeHTML(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) sidebar += `<div class="job-title">${escapeHTML(d.jobTitle)}</div>`;
  const contacts = [d.location, d.phone, d.email, d.linkedin].filter(Boolean);
  sidebar += contacts.map(c => `<div class="contact-item">${escapeHTML(c)}</div>`).join("");
  if (d.skills) sidebar += `<div class="section"><div class="section-title">Core Skills</div>${buildSkillsHTML(d.skills)}</div>`;
  if (d.languages) sidebar += `<div class="section"><div class="section-title">Languages</div><p>${escapeHTML(d.languages).replace(/\n/g, "<br>")}</p></div>`;
  if (d.education) sidebar += `<div class="section"><div class="section-title">Education</div>${buildEntriesHTML(d.education)}</div>`;

  let main = "";
  if (d.summary) main += `<div class="section"><div class="section-title">Profile</div><div class="summary">${escapeHTML(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><div class="section-title">Work Experience</div>${buildEntriesHTML(d.experience)}</div>`;
  if (d.certifications) main += `<div class="section"><div class="section-title">Certifications</div>${buildCertsHTML(d.certifications)}</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
    <div class="resume-wrap"><div class="sidebar">${sidebar}</div><div class="main">${main}</div></div></body></html>`;
}

/* ---- Sidebar Right HTML ---- */
function sidebarRightHTML(d: ResumeData, css: string): string {
  let main = `<div class="name">${escapeHTML(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) main += `<div class="job-title">${escapeHTML(d.jobTitle)}</div>`;
  if (d.summary) main += `<div class="section"><div class="section-title">Profile</div><div class="summary">${escapeHTML(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><div class="section-title">Work Experience</div>${buildEntriesHTML(d.experience)}</div>`;
  if (d.certifications) main += `<div class="section"><div class="section-title">Certifications</div>${buildCertsHTML(d.certifications)}</div>`;

  let sidebar = "";
  const contacts = [d.location, d.phone, d.email, d.linkedin].filter(Boolean);
  sidebar += `<div class="section"><div class="section-title">Contact</div>${contacts.map(c => `<div class="contact-item">${escapeHTML(c)}</div>`).join("")}</div>`;
  if (d.skills) sidebar += `<div class="section"><div class="section-title">Core Skills</div>${buildSkillsHTML(d.skills)}</div>`;
  if (d.education) sidebar += `<div class="section"><div class="section-title">Education</div>${buildEntriesHTML(d.education)}</div>`;
  if (d.languages) sidebar += `<div class="section"><div class="section-title">Languages</div><p>${escapeHTML(d.languages).replace(/\n/g, "<br>")}</p></div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
    <div class="resume-wrap"><div class="main" style="width:66%;padding:28px 24px;">${main}</div><div class="sidebar" style="width:34%;padding:28px 18px;">${sidebar}</div></div></body></html>`;
}

/* ---- Banner HTML ---- */
function bannerHTML(d: ResumeData, css: string): string {
  let body = "";
  if (d.summary) body += `<div class="summary">${escapeHTML(d.summary)}</div>`;
  if (d.skills) body += `<div class="section"><div class="section-title">Core Skills</div>${buildSkillsHTML(d.skills)}</div>`;
  if (d.experience) body += `<div class="section"><div class="section-title">Work Experience</div>${buildEntriesHTML(d.experience)}</div>`;
  if (d.education) body += `<div class="section"><div class="section-title">Education</div>${buildEntriesHTML(d.education)}</div>`;
  if (d.certifications) body += `<div class="section"><div class="section-title">Certifications</div>${buildCertsHTML(d.certifications)}</div>`;
  if (d.languages) body += `<div class="section"><div class="section-title">Languages</div><p>${escapeHTML(d.languages).replace(/\n/g, " &bull; ")}</p></div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
    <div class="banner">
      <div class="name">${escapeHTML(d.fullName || "Your Name")}</div>
      ${d.jobTitle ? `<div class="job-title">${escapeHTML(d.jobTitle)}</div>` : ""}
      <div class="contact">${contactLine(d)}</div>
    </div><div class="body">${body}</div></body></html>`;
}

/* ---- Route to the right generator ---- */
function generateHTML(d: ResumeData, template: Template): string {
  switch (template.layout) {
    case "single": return singleHTML(d, template.css);
    case "sidebar-left": return sidebarLeftHTML(d, template.css);
    case "sidebar-right": return sidebarRightHTML(d, template.css);
    case "banner": return bannerHTML(d, template.css);
  }
}

/* ============================================================
   MINI PREVIEW COMPONENT — Scaled-down resume for gallery
   ============================================================ */
function MiniPreview({ template, data }: { template: Template; data: ResumeData }) {
  const html = generateHTML(data, template);
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-white" style={{ aspectRatio: "8.5/11" }}>
      <iframe
        srcDoc={html}
        className="absolute top-0 left-0 border-0 pointer-events-none"
        style={{ width: "800px", height: "1040px", transform: "scale(0.215)", transformOrigin: "top left" }}
        title={template.name}
        loading="lazy"
      />
    </div>
  );
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */
export default function TemplatesPage() {
  const [selectedId, setSelectedId] = useState("classic");
  const [step, setStep] = useState<"gallery" | "form" | "preview">("gallery");
  const [formData, setFormData] = useState<ResumeData>(EMPTY_FORM);
  const [filter, setFilter] = useState("All");
  const [pdfLoading, setPdfLoading] = useState(false);

  const selected = TEMPLATES.find(t => t.id === selectedId)!;
  const categories = ["All", "Single Column", "Sidebar", "Banner", "Special"];
  const filtered = filter === "All" ? TEMPLATES : TEMPLATES.filter(t => t.category === filter);

  const updateField = useCallback((field: keyof ResumeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const canPreview = (formData.fullName || "").trim() && ((formData.summary || "").trim() || (formData.experience || "").trim());

  /* ---- PDF Download ---- */
  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      if (!(window as unknown as Record<string, unknown>).html2pdf) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load PDF library"));
          document.head.appendChild(s);
        });
      }
      const fullHTML = generateHTML(formData, selected);
      const container = document.createElement("div");
      container.innerHTML = fullHTML.replace(/<html>|<\/html>|<head>[\s\S]*?<\/head>|<body>|<\/body>|<!DOCTYPE html>/g, "");
      const styleEl = document.createElement("style");
      styleEl.textContent = selected.css;
      container.prepend(styleEl);
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.width = "800px";
      document.body.appendChild(container);
      const html2pdf = (window as unknown as Record<string, unknown>).html2pdf as CallableFunction;
      await html2pdf().set({
        margin: [0, 0, 0, 0],
        filename: `${formData.fullName || "resume"}-resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(container).save();
      document.body.removeChild(container);
    } catch {
      const html = generateHTML(formData, selected);
      const w = window.open("", "_blank");
      if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 300); }
    } finally { setPdfLoading(false); }
  };

  /* ---- Word Download ---- */
  const downloadWord = () => {
    const html = generateHTML(formData, selected);
    const wordHTML = html.replace("<html>", '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">');
    const blob = new Blob([wordHTML], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.fullName || "resume"}-resume.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* ---- Page Header ---- */}
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">Resume Templates</h1>
        <p className="text-text-secondary">Choose from 20 professional templates. Preview, fill your details, edit, and download.</p>
      </div>

      {/* ---- Step Indicator ---- */}
      <div className="flex items-center gap-3 mb-6">
        {(["gallery", "form", "preview"] as const).map((s, i) => (
          <button key={s} onClick={() => { if (s === "preview" && !canPreview) return; setStep(s); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${step === s ? "bg-brand-indigo/15 text-white border border-brand-indigo/30" : "text-text-secondary hover:text-white border border-transparent"}`}>
            <span className="w-6 h-6 rounded-full bg-brand-indigo/20 text-brand-light flex items-center justify-center text-xs font-bold">{i + 1}</span>
            {s === "gallery" ? "Choose Template" : s === "form" ? "Fill Details" : "Preview & Edit"}
          </button>
        ))}
      </div>

      {/* ============================================================
         STEP 1: TEMPLATE GALLERY
         ============================================================ */}
      {step === "gallery" && (
        <div>
          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === c ? "bg-brand-indigo text-white" : "bg-space-700 text-text-secondary hover:text-white border border-card-border"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Template grid with visual previews */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {filtered.map(t => (
              <button key={t.id} onClick={() => setSelectedId(t.id)}
                className={`relative rounded-xl overflow-hidden text-left transition-all ${selectedId === t.id ? "ring-2 ring-brand-indigo shadow-lg shadow-brand-indigo/20" : "ring-1 ring-card-border hover:ring-brand-indigo/40"}`}>
                {/* Mini resume preview */}
                <MiniPreview template={t} data={SAMPLE} />
                {/* Template info overlay */}
                <div className="p-3 bg-space-800 border-t border-card-border">
                  <h3 className={`text-sm font-bold ${selectedId === t.id ? "text-white" : "text-text-secondary"}`}>{t.name}</h3>
                  <p className="text-xs text-text-muted truncate">{t.desc}</p>
                </div>
                {/* Selected checkmark */}
                {selectedId === t.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-indigo flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button onClick={() => setStep("form")} className="btn-primary">
            Continue with {selected.name} Template
          </button>
        </div>
      )}

      {/* ============================================================
         STEP 2: FILL IN DETAILS FORM
         ============================================================ */}
      {step === "form" && (
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className={`w-12 h-1.5 rounded-full`} style={{ background: selected.previewAccent }} />
            <span className="text-sm text-text-secondary">Using <strong className="text-white">{selected.name}</strong> template</span>
            <button onClick={() => setStep("gallery")} className="text-sm text-brand-light hover:text-white transition-colors ml-auto">Change template</button>
          </div>

          <div className="space-y-5">
            {/* Personal Info */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ["fullName", "Full Name *", "Olivia Wilson"],
                  ["jobTitle", "Job Title", "Marketing Manager"],
                  ["email", "Email", "olivia@email.com"],
                  ["phone", "Phone", "+1 (555) 123-4567"],
                  ["location", "Location", "New York, NY"],
                  ["linkedin", "LinkedIn", "linkedin.com/in/oliviawilson"],
                ] as [keyof ResumeData, string, string][]).map(([field, label, ph]) => (
                  <div key={field} className={field === "linkedin" ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
                    <input type="text" value={formData[field]} onChange={e => updateField(field, e.target.value)} placeholder={ph}
                      className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Professional Summary</h2>
              <p className="text-xs text-text-muted mb-4">3-4 sentences about your experience and what you bring.</p>
              <textarea value={formData.summary} onChange={e => updateField("summary", e.target.value)} placeholder="Results-driven professional with 5+ years of experience..." rows={4}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed" />
            </div>

            {/* Skills */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Core Skills</h2>
              <p className="text-xs text-text-muted mb-4">One category per line. Format: Category: Skill1, Skill2, Skill3</p>
              <textarea value={formData.skills} onChange={e => updateField("skills", e.target.value)}
                placeholder={"Strategy & Growth: Brand Strategy, Market Research, Campaign Planning\nDigital Marketing: SEO/SEM, Google Analytics, Social Media\nTools: HubSpot, Salesforce, Tableau"} rows={4}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm" />
            </div>

            {/* Experience */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Work Experience</h2>
              <p className="text-xs text-text-muted mb-4">Format: Title | Company | Dates, then bullet points with &quot;- &quot;</p>
              <textarea value={formData.experience} onChange={e => updateField("experience", e.target.value)}
                placeholder={"Senior Marketing Manager | Brightwave Inc. | 2022 - Present\n- Led digital campaigns generating $2.4M in revenue\n- Managed team of 6 across content and paid media\n\nMarketing Specialist | Greenfield Co. | 2019 - 2022\n- Executed multi-channel campaigns driving 150% lead increase"} rows={10}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed" />
            </div>

            {/* Education */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Education</h2>
              <textarea value={formData.education} onChange={e => updateField("education", e.target.value)}
                placeholder={"MBA Marketing | Columbia University, New York | 2017\n- Dean's List, Marketing Excellence Award\n\nBA Communications | Boston University | 2015"} rows={4}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed" />
            </div>

            {/* Certifications */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Certifications and Trainings <span className="text-text-muted font-normal text-sm">(optional)</span></h2>
              <textarea value={formData.certifications} onChange={e => updateField("certifications", e.target.value)}
                placeholder={"Google Analytics Certified — 2023\nHubSpot Content Marketing — 2022"} rows={3}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm" />
            </div>

            {/* Languages */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Languages</h2>
              <textarea value={formData.languages} onChange={e => updateField("languages", e.target.value)}
                placeholder={"English - Native\nSpanish - Conversational"} rows={2}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm" />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { if (canPreview) setStep("preview"); }} disabled={!canPreview} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                Preview Resume
              </button>
              <button onClick={() => setStep("gallery")} className="px-6 py-3 rounded-xl text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors">
                Back to Templates
              </button>
            </div>
            {!canPreview && <p className="text-xs text-text-muted">Fill in at least your name and summary or experience to preview.</p>}
          </div>
        </div>
      )}

      {/* ============================================================
         STEP 3: PREVIEW, EDIT & DOWNLOAD
         ============================================================ */}
      {step === "preview" && (
        <div>
          {/* Action bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-1.5 rounded-full" style={{ background: selected.previewAccent }} />
              <span className="text-sm text-text-secondary"><strong className="text-white">{selected.name}</strong> template</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setStep("form")} className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors">
                Edit Details
              </button>
              <button onClick={() => setStep("gallery")} className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors">
                Change Template
              </button>
              <button onClick={downloadWord} className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors">
                Download Word
              </button>
              <button onClick={downloadPDF} disabled={pdfLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light hover:text-white hover:bg-brand-indigo/30 transition-colors disabled:opacity-50">
                {pdfLoading ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>

          {/* Full-size resume preview */}
          <div className="rounded-xl overflow-hidden border border-card-border shadow-2xl bg-white">
            <iframe
              srcDoc={generateHTML(formData, selected)}
              className="w-full border-0"
              style={{ minHeight: "1100px" }}
              title="Resume Preview"
            />
          </div>

          <p className="mt-4 text-sm text-text-muted text-center">
            Click &quot;Edit Details&quot; to modify content, or download directly as PDF or Word.
          </p>
        </div>
      )}
    </div>
  );
}
