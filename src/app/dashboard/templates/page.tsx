/* ============================================================
   RESUME TEMPLATES PAGE — 20 Professional Templates
   ============================================================
   Complete resume builder with:
   1. Visual template gallery (20 templates, mini previews)
   2. Form to fill in resume details + PDF upload auto-fill via AI
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
import { extractTextFromPdf } from "@/lib/pdf-extract";

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
  previewBg: string;
  previewAccent: string;
  previewLight: boolean;
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
      .name { font-size: 28px; font-weight: 700; color: #111; letter-spacing: -0.5px; }
      .job-title { font-size: 15px; color: #444; font-style: italic; }
      .contact { border-bottom: 2.5px solid #111; padding-bottom: 12px; font-style: italic; }
      .section-title { font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #111; border-bottom: 1.5px solid #666; padding-bottom: 4px; }
      .entry-title { font-family: Georgia, serif; }
    `,
  },
  {
    id: "modern", name: "Modern", desc: "Geometric accent bar with bold indigo headers",
    category: "Single Column", layout: "single",
    previewBg: "#fff", previewAccent: "#4f46e5", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .header { border-left: 5px solid #4f46e5; padding-left: 18px; margin-bottom: 18px; }
      .name { font-size: 30px; font-weight: 800; color: #1e1b4b; letter-spacing: -1px; }
      .job-title { font-size: 15px; color: #4f46e5; font-weight: 600; }
      .contact { color: #666; border: none; padding: 0; }
      .section-title { font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #4f46e5; border-bottom: 3px solid #e0e7ff; padding-bottom: 4px; font-size: 12px; }
      .entry-title { color: #1e1b4b; }
    `,
  },
  {
    id: "minimal", name: "Minimal", desc: "Ultra-lightweight with generous whitespace",
    category: "Single Column", layout: "single",
    previewBg: "#fff", previewAccent: "#999", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 48px 50px; }
      .header { text-align: center; margin-bottom: 24px; }
      .name { font-size: 22px; font-weight: 300; color: #222; letter-spacing: 4px; text-transform: uppercase; }
      .job-title { font-size: 11px; color: #999; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
      .contact { font-size: 11px; color: #aaa; letter-spacing: 1px; text-align: center; border: none; padding: 0; margin-top: 8px; }
      .section { margin-bottom: 20px; }
      .section-title { font-size: 10px; font-weight: 400; text-transform: uppercase; letter-spacing: 4px; color: #bbb; border: none; padding-bottom: 0; margin-bottom: 8px; }
      .entry-title { font-weight: 500; font-size: 13px; }
      li { color: #555; }
    `,
  },
  {
    id: "executive", name: "Executive", desc: "Full-width dark header for C-suite professionals",
    category: "Single Column", layout: "single",
    previewBg: "#1a1a1a", previewAccent: "#fff", previewLight: true,
    css: SINGLE_BASE + `
      body { font-family: Calibri, Arial, sans-serif; padding-top: 0; }
      .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #fff; padding: 30px 36px; margin: -36px -40px 24px -40px; }
      .name { font-size: 32px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 3px; }
      .job-title { font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
      .contact { color: #888; border: none; padding: 0; margin-top: 10px; font-size: 11.5px; }
      .section-title { font-weight: 800; text-transform: uppercase; letter-spacing: 2px; background: #f5f5f5; padding: 6px 12px; color: #111; font-size: 11px; border: none; }
      .entry-title { font-weight: 800; }
    `,
  },
  {
    id: "elegant", name: "Elegant", desc: "Centered layout with ornamental copper accents",
    category: "Single Column", layout: "single",
    previewBg: "#fff", previewAccent: "#8b5e3c", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: Georgia, 'Palatino Linotype', serif; padding: 40px 44px; }
      .header { text-align: center; padding: 16px 0 18px; margin-bottom: 18px; border-top: 1px solid #8b5e3c; border-bottom: 1px solid #8b5e3c; position: relative; }
      .header::before { content: ''; position: absolute; top: -4px; left: 30%; right: 30%; height: 1px; background: #8b5e3c; }
      .header::after { content: ''; position: absolute; bottom: -4px; left: 30%; right: 30%; height: 1px; background: #8b5e3c; }
      .name { font-size: 28px; font-weight: 400; color: #8b5e3c; letter-spacing: 2px; }
      .job-title { font-size: 13px; color: #777; font-style: italic; margin-top: 4px; }
      .contact { color: #777; text-align: center; border: none; font-style: italic; font-size: 12px; }
      .section-title { font-weight: 400; font-variant: small-caps; letter-spacing: 2px; color: #8b5e3c; border-bottom: 1px solid #d4b896; padding-bottom: 4px; font-size: 15px; }
      .entry-title { color: #4a3728; }
    `,
  },
  {
    id: "clean", name: "Clean", desc: "Two-tone teal with rounded section headers",
    category: "Single Column", layout: "single",
    previewBg: "#fff", previewAccent: "#0d9488", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
      .header { background: #f0fdfa; padding: 20px 24px; margin: -36px -40px 20px -40px; border-bottom: 3px solid #0d9488; }
      .name { font-size: 28px; font-weight: 700; color: #0d9488; }
      .job-title { font-size: 14px; color: #0f766e; font-weight: 500; }
      .contact { color: #555; border: none; padding: 0; margin-top: 6px; }
      .section-title { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #fff; background: #0d9488; padding: 4px 12px; border-radius: 4px; font-size: 11px; border: none; display: inline-block; margin-bottom: 10px; }
      .entry-title { color: #0f766e; }
    `,
  },

  /* ======== SIDEBAR LEFT ======== */
  {
    id: "corporate", name: "Corporate", desc: "Navy sidebar with structured corporate hierarchy",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#1e293b", previewAccent: "#60a5fa", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .sidebar { background: #1e293b; color: #e2e8f0; }
      .name { font-size: 22px; font-weight: 700; color: #fff; }
      .job-title { color: #93c5fd; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; }
      .contact-item { color: #94a3b8; font-size: 11px; border-bottom: 1px solid #334155; padding-bottom: 4px; }
      .sidebar .section-title { color: #60a5fa; font-weight: 700; border-bottom: 1px solid #334155; padding-bottom: 4px; }
      .sidebar li { color: #cbd5e1; }
      .sidebar p { color: #cbd5e1; }
      .main .section-title { font-weight: 700; color: #1e293b; border-bottom: 2px solid #1e293b; padding-bottom: 4px; }
    `,
  },
  {
    id: "professional", name: "Professional", desc: "Gradient blue sidebar with icon-style contact",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#1e3a5f", previewAccent: "#7dd3fc", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, Arial, sans-serif; }
      .sidebar { background: linear-gradient(180deg, #1e3a5f 0%, #0f2744 100%); color: #e0f2fe; padding-top: 36px; }
      .name { font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
      .job-title { color: #7dd3fc; font-size: 12px; border-bottom: 2px solid #7dd3fc; padding-bottom: 10px; margin-bottom: 14px; display: inline-block; }
      .contact-item { color: #bae6fd; padding-left: 10px; border-left: 2px solid #2563eb; margin-bottom: 8px; }
      .sidebar .section-title { color: #7dd3fc; font-weight: 800; border: none; padding: 4px 0; border-top: 1px solid #2d5a8e; margin-top: 6px; }
      .sidebar li { color: #bae6fd; }
      .sidebar p { color: #bae6fd; }
      .main .section-title { font-weight: 800; color: #1e3a5f; border-left: 4px solid #1e3a5f; border-bottom: none; padding-left: 10px; padding-bottom: 0; }
    `,
  },
  {
    id: "creative", name: "Creative", desc: "Vivid coral with playful rounded elements",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#dc2626", previewAccent: "#fca5a5", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
      .sidebar { background: linear-gradient(160deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%); color: #fee2e2; padding: 32px 20px; }
      .name { font-size: 24px; font-weight: 800; color: #fff; line-height: 1.1; }
      .job-title { color: #fecaca; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; }
      .contact-item { color: #fecaca; background: rgba(0,0,0,0.15); padding: 5px 10px; border-radius: 6px; margin-bottom: 6px; font-size: 11px; }
      .sidebar .section-title { color: #fff; font-weight: 800; background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 6px; border: none; margin-bottom: 8px; }
      .sidebar li { color: #fee2e2; }
      .sidebar p { color: #fee2e2; }
      .main .section-title { font-weight: 800; color: #dc2626; border: none; padding: 5px 0; border-left: 4px solid #dc2626; padding-left: 10px; }
    `,
  },
  {
    id: "tech", name: "Tech", desc: "Terminal-inspired dark theme with monospace headers",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#0f0f23", previewAccent: "#22d3ee", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .sidebar { background: #0f0f23; color: #d1d5db; border-right: 1px solid #22d3ee; }
      .name { font-size: 20px; font-weight: 700; color: #22d3ee; font-family: 'Courier New', monospace; }
      .job-title { color: #67e8f9; font-size: 11px; font-family: 'Courier New', monospace; }
      .contact-item { color: #6b7280; font-family: 'Courier New', monospace; font-size: 10.5px; }
      .sidebar .section-title { color: #22d3ee; font-weight: 700; border: none; font-family: 'Courier New', monospace; font-size: 11px; }
      .sidebar .section-title::before { content: '> '; color: #06b6d4; }
      .sidebar li { color: #d1d5db; font-size: 11.5px; }
      .sidebar p { color: #d1d5db; }
      .main { background: #fafafa; }
      .main .section-title { font-weight: 700; color: #0f0f23; background: #e0f2fe; padding: 5px 12px; border: 1px solid #22d3ee; border-radius: 3px; font-size: 11px; }
      .main .entry-title { color: #0e7490; }
    `,
  },
  {
    id: "consultant", name: "Consultant", desc: "Emerald with data-driven metric callouts",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#064e3b", previewAccent: "#34d399", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, Arial, sans-serif; }
      .sidebar { background: #064e3b; color: #d1fae5; }
      .name { font-size: 22px; font-weight: 700; color: #fff; }
      .job-title { color: #6ee7b7; font-size: 12px; font-weight: 600; }
      .contact-item { color: #a7f3d0; font-size: 11px; }
      .sidebar .section-title { color: #34d399; font-weight: 700; border-bottom: 2px solid #34d399; padding-bottom: 4px; letter-spacing: 1px; }
      .sidebar li { color: #d1fae5; position: relative; padding-left: 10px; }
      .sidebar li::before { content: '—'; position: absolute; left: 0; color: #34d399; }
      .sidebar p { color: #d1fae5; }
      .main .section-title { font-weight: 700; color: #064e3b; border-bottom: 2px solid #064e3b; padding-bottom: 4px; }
      .main .entry-title { color: #065f46; }
    `,
  },
  {
    id: "premium", name: "Premium", desc: "Luxury black with gold foil-style accents",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#0a0a0a", previewAccent: "#d4a843", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Georgia, 'Palatino Linotype', serif; }
      .sidebar { background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%); color: #d1d5db; border-right: 2px solid #d4a843; }
      .name { font-size: 22px; font-weight: 400; color: #d4a843; letter-spacing: 1px; }
      .job-title { color: #b8860b; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Calibri, sans-serif; }
      .contact-item { color: #8b8b8b; font-family: Calibri, sans-serif; font-size: 11px; }
      .sidebar .section-title { color: #d4a843; font-weight: 400; font-variant: small-caps; letter-spacing: 1.5px; border-bottom: 1px solid #333; padding-bottom: 4px; font-size: 13px; }
      .sidebar li { color: #ccc; font-family: Calibri, sans-serif; }
      .sidebar p { color: #ccc; font-family: Calibri, sans-serif; }
      .main .section-title { font-weight: 400; color: #0a0a0a; font-variant: small-caps; letter-spacing: 2px; border-bottom: 1px solid #d4a843; padding-bottom: 4px; font-size: 14px; }
      .main .entry-title { font-family: Calibri, sans-serif; color: #333; }
    `,
  },
  {
    id: "bold", name: "Bold", desc: "High-contrast black with neon amber highlights",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#000", previewAccent: "#f59e0b", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .sidebar { background: #000; color: #e5e7eb; }
      .name { font-size: 24px; font-weight: 900; color: #f59e0b; text-transform: uppercase; letter-spacing: 2px; line-height: 1.1; }
      .job-title { color: #fbbf24; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; border-top: 2px solid #f59e0b; margin-top: 8px; padding-top: 8px; }
      .contact-item { color: #777; font-size: 11px; }
      .sidebar .section-title { color: #000; background: #f59e0b; font-weight: 900; padding: 4px 10px; margin-bottom: 8px; border: none; font-size: 10px; letter-spacing: 2px; }
      .sidebar li { color: #d1d5db; }
      .sidebar p { color: #d1d5db; }
      .main .section-title { font-weight: 900; color: #000; border: none; border-left: 4px solid #f59e0b; padding-left: 12px; letter-spacing: 1px; }
      .main .entry-title { font-weight: 800; }
    `,
  },
  {
    id: "fresh", name: "Fresh", desc: "Light pastel sidebar with organic green feel",
    category: "Sidebar", layout: "sidebar-left",
    previewBg: "#ecfdf5", previewAccent: "#16a34a", previewLight: false,
    css: SIDEBAR_BASE + `
      body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
      .sidebar { background: #ecfdf5; color: #1a1a1a; border-right: none; }
      .name { font-size: 24px; font-weight: 700; color: #15803d; }
      .job-title { color: #16a34a; font-size: 12px; font-weight: 600; }
      .contact-item { color: #374151; font-size: 11.5px; padding: 4px 8px; background: #d1fae5; border-radius: 4px; margin-bottom: 4px; }
      .sidebar .section-title { color: #15803d; font-weight: 700; background: #d1fae5; padding: 4px 8px; border-radius: 4px; border: none; font-size: 11px; }
      .sidebar li { color: #374151; }
      .sidebar p { color: #374151; }
      .main { border-left: 3px solid #bbf7d0; }
      .main .section-title { font-weight: 700; color: #15803d; border-bottom: 2px solid #bbf7d0; padding-bottom: 4px; }
    `,
  },

  /* ======== SIDEBAR RIGHT ======== */
  {
    id: "sleek", name: "Sleek", desc: "Right sidebar with split-tone grey architecture",
    category: "Sidebar", layout: "sidebar-right",
    previewBg: "#1f2937", previewAccent: "#94a3b8", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: Calibri, Arial, sans-serif; }
      .sidebar { background: #1f2937; color: #e2e8f0; }
      .sidebar .section-title { color: #fff; font-weight: 700; background: #374151; padding: 4px 10px; border-radius: 4px; border: none; font-size: 10.5px; letter-spacing: 1px; }
      .sidebar li { color: #d1d5db; }
      .sidebar p { color: #d1d5db; }
      .contact-item { color: #9ca3af; border-bottom: 1px solid #374151; padding-bottom: 5px; margin-bottom: 5px; font-size: 11px; }
      .main .name { font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -1px; }
      .main .job-title { font-size: 13px; color: #6b7280; margin-bottom: 14px; font-weight: 500; }
      .main .section-title { font-weight: 700; color: #111827; border: none; border-left: 3px solid #6b7280; padding-left: 10px; }
    `,
  },
  {
    id: "designer", name: "Designer", desc: "Right sidebar with vibrant magenta personality",
    category: "Sidebar", layout: "sidebar-right",
    previewBg: "#9f1239", previewAccent: "#fda4af", previewLight: true,
    css: SIDEBAR_BASE + `
      body { font-family: 'Segoe UI', Calibri, sans-serif; }
      .sidebar { background: linear-gradient(180deg, #9f1239 0%, #881337 100%); color: #ffe4e6; padding: 32px 18px; }
      .sidebar .section-title { color: #fff; font-weight: 700; border: none; background: rgba(255,255,255,0.15); padding: 5px 10px; border-radius: 20px; text-align: center; font-size: 10.5px; letter-spacing: 1px; }
      .sidebar li { color: #fecdd3; }
      .sidebar p { color: #fecdd3; }
      .contact-item { color: #fda4af; text-align: center; font-size: 11px; }
      .main .name { font-size: 28px; font-weight: 800; color: #9f1239; }
      .main .job-title { font-size: 14px; color: #be123c; margin-bottom: 12px; font-weight: 500; }
      .main .section-title { font-weight: 800; color: #9f1239; border-bottom: 3px solid #fda4af; padding-bottom: 4px; }
    `,
  },

  /* ======== BANNER HEADER ======== */
  {
    id: "banner", name: "Banner", desc: "Full-width gradient header with prominent name",
    category: "Banner", layout: "banner",
    previewBg: "#1e293b", previewAccent: "#fff", previewLight: true,
    css: BANNER_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .banner { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 44px; }
      .name { font-size: 32px; font-weight: 800; letter-spacing: -0.5px; }
      .job-title { font-size: 13px; letter-spacing: 1px; }
      .contact { font-size: 12px; margin-top: 8px; }
      .section-title { font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #1e293b; border-left: 4px solid #1e293b; padding-left: 10px; border-bottom: none; padding-bottom: 0; font-size: 12px; }
    `,
  },
  {
    id: "noir", name: "Noir", desc: "Cinematic dark with thin ultra-light typography",
    category: "Banner", layout: "banner",
    previewBg: "#111", previewAccent: "#888", previewLight: true,
    css: BANNER_BASE + `
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
      .banner { background: #111; padding: 36px 44px; }
      .name { font-size: 30px; font-weight: 200; letter-spacing: 6px; text-transform: uppercase; }
      .job-title { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #666; font-weight: 300; }
      .contact { color: #555; letter-spacing: 1px; font-size: 11px; margin-top: 10px; }
      .body { padding: 28px 44px; }
      .section-title { font-weight: 300; text-transform: uppercase; letter-spacing: 3px; color: #888; border: none; padding-bottom: 0; font-size: 11px; margin-bottom: 10px; }
      .entry-title { font-weight: 500; letter-spacing: 0.3px; }
      li { color: #444; }
      .summary { color: #444; }
    `,
  },

  /* ======== SPECIAL ======== */
  {
    id: "timeline", name: "Timeline", desc: "Visual timeline with connected dots and indigo accents",
    category: "Special", layout: "single",
    previewBg: "#fff", previewAccent: "#6366f1", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      .header { border-bottom: 3px solid #6366f1; padding-bottom: 14px; margin-bottom: 18px; }
      .name { font-size: 28px; font-weight: 800; color: #312e81; }
      .job-title { font-size: 14px; color: #6366f1; font-weight: 600; }
      .contact { border: none; color: #666; }
      .section-title { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #4f46e5; border: none; padding: 0; margin-bottom: 10px; }
      .entry { border-left: 3px solid #c7d2fe; padding-left: 16px; margin-left: 8px; position: relative; margin-bottom: 14px; }
      .entry::before { content: ''; position: absolute; left: -7px; top: 5px; width: 11px; height: 11px; border-radius: 50%; background: #6366f1; border: 2px solid #e0e7ff; }
      .entry-title { color: #312e81; }
    `,
  },
  {
    id: "compact", name: "Compact", desc: "Maximum content density — fits everything on one page",
    category: "Special", layout: "single",
    previewBg: "#fff", previewAccent: "#374151", previewLight: false,
    css: SINGLE_BASE + `
      body { font-family: Calibri, Arial, sans-serif; font-size: 12px; padding: 24px 28px; line-height: 1.35; }
      .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
      .name { font-size: 20px; font-weight: 800; color: #111; }
      .job-title { font-size: 11px; color: #555; }
      .contact { font-size: 10.5px; text-align: right; border: none; padding: 0; margin: 0; }
      .section { margin-bottom: 8px; }
      .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; background: #374151; padding: 2px 8px; margin-bottom: 5px; border: none; display: inline-block; }
      .entry { margin-bottom: 6px; }
      .entry-title { font-size: 11.5px; font-weight: 700; }
      .entry-sub { font-size: 10.5px; }
      li { font-size: 11px; line-height: 1.3; margin-bottom: 1px; }
      .summary { font-size: 11.5px; line-height: 1.35; }
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
    <div className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: "8.5/11" }}>
      <iframe
        srcDoc={html}
        className="absolute top-0 left-0 border-0 pointer-events-none"
        style={{ width: "800px", height: "1130px", transform: "scale(0.33)", transformOrigin: "top left" }}
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
  const [selectedId, setSelectedId] = useState("corporate");
  const [step, setStep] = useState<"gallery" | "form" | "preview">("gallery");
  const [formData, setFormData] = useState<ResumeData>(EMPTY_FORM);
  const [filter, setFilter] = useState("All");
  const [pdfLoading, setPdfLoading] = useState(false);

  /* PDF upload state */
  const [uploadStatus, setUploadStatus] = useState<"idle" | "extracting" | "parsing" | "done" | "error">("idle");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = TEMPLATES.find(t => t.id === selectedId)!;
  const categories = ["All", "Single Column", "Sidebar", "Banner", "Special"];
  const filtered = filter === "All" ? TEMPLATES : TEMPLATES.filter(t => t.category === filter);

  const updateField = useCallback((field: keyof ResumeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const canPreview = String(formData.fullName).trim() && (String(formData.summary).trim() || String(formData.experience).trim());

  /* ---- PDF Upload & AI Auto-Fill ---- */
  const handlePdfUpload = async (file: File) => {
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Please upload a PDF file.");
      setUploadStatus("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large. Maximum 10MB.");
      setUploadStatus("error");
      return;
    }

    setUploadedFileName(file.name);
    setUploadError("");
    setUploadStatus("extracting");

    try {
      /* Step 1: Extract text from PDF on the client */
      const text = await extractTextFromPdf(file);
      if (!text.trim()) {
        setUploadError("Couldn't read text from this PDF. It may be a scanned image — please fill in your details manually below.");
        setUploadStatus("error");
        return;
      }

      /* Step 2: Send to AI to parse into structured fields */
      setUploadStatus("parsing");
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "parse_resume_fields",
          payload: { resumeText: text.slice(0, 15000) },
        }),
      });

      if (!res.ok) {
        setUploadError("Auto-fill is temporarily busy. Please fill in your details manually below — it only takes a minute!");
        setUploadStatus("error");
        return;
      }

      const { result } = await res.json();

      /* Step 3: Parse the JSON response from Gemini */
      let parsed: Partial<ResumeData>;
      try {
        const cleaned = result.replace(/```json\s*|```\s*/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch {
        setUploadError("Couldn't read that format. Please fill in your details manually below.");
        setUploadStatus("error");
        return;
      }

      /* Step 4: Populate the form with parsed data */
      setFormData({
        fullName: parsed.fullName || "",
        jobTitle: parsed.jobTitle || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        location: parsed.location || "",
        linkedin: parsed.linkedin || "",
        summary: parsed.summary || "",
        skills: parsed.skills || "",
        experience: parsed.experience || "",
        education: parsed.education || "",
        certifications: parsed.certifications || "",
        languages: parsed.languages || "",
      });

      setUploadStatus("done");
    } catch (err) {
      console.error("PDF upload error:", err);
      setUploadError("Something went wrong. Please try again or fill in your details manually below.");
      setUploadStatus("error");
    }
  };

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

  /* ---- Step labels ---- */
  const stepLabels = [
    { key: "gallery" as const, label: "Choose Template", icon: "1" },
    { key: "form" as const, label: "Fill Details", icon: "2" },
    { key: "preview" as const, label: "Preview & Download", icon: "3" },
  ];

  return (
    <div>
      {/* ---- Page Header ---- */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold mb-3">
          Resume Templates
        </h1>
        <p className="text-text-secondary text-lg">
          Pick a template, fill your details or upload your resume, and download a polished PDF.
        </p>
      </div>

      {/* ---- Step Progress Bar ---- */}
      <div className="flex items-center gap-2 mb-8 p-1 rounded-2xl bg-space-800/50 border border-card-border w-fit">
        {stepLabels.map((s, i) => {
          const isActive = step === s.key;
          const isPast = stepLabels.findIndex(sl => sl.key === step) > i;
          return (
            <button
              key={s.key}
              onClick={() => { if (s.key === "preview" && !canPreview) return; setStep(s.key); }}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-indigo text-white shadow-lg shadow-brand-indigo/25"
                  : isPast
                    ? "text-brand-light hover:bg-brand-indigo/10"
                    : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isActive ? "bg-white/20 text-white" : isPast ? "bg-brand-indigo/20 text-brand-light" : "bg-space-600 text-text-muted"
              }`}>
                {isPast ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : s.icon}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
         STEP 1: TEMPLATE GALLERY
         ============================================================ */}
      {step === "gallery" && (
        <div>
          {/* ---- Category Filter Chips ---- */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(c => {
              const count = c === "All" ? TEMPLATES.length : TEMPLATES.filter(t => t.category === c).length;
              return (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === c
                      ? "bg-brand-indigo text-white shadow-md shadow-brand-indigo/25"
                      : "bg-space-700/60 text-text-secondary hover:text-white hover:bg-space-600 border border-card-border"
                  }`}>
                  {c} <span className="ml-1 opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* ---- Template Grid — LiveCareer-style cards ---- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filtered.map(t => {
              const isSelected = selectedId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-200 ${
                    isSelected
                      ? "ring-2 ring-brand-indigo shadow-xl shadow-brand-indigo/20 scale-[1.02]"
                      : "ring-1 ring-card-border hover:ring-brand-indigo/50 hover:shadow-lg hover:shadow-brand-indigo/10 hover:scale-[1.01]"
                  }`}
                >
                  {/* Resume preview with subtle shadow */}
                  <div className="relative bg-space-700/30 p-3 pb-2">
                    <div className="rounded-lg overflow-hidden shadow-md ring-1 ring-black/5">
                      <MiniPreview template={t} data={SAMPLE} />
                    </div>

                    {/* Hover overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                      isSelected ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      <div className="bg-brand-indigo/90 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
                        Select Template
                      </div>
                    </div>

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-brand-indigo flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Template info */}
                  <div className="px-4 py-3 bg-space-800 border-t border-card-border">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.previewAccent }} />
                      <h3 className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-text-secondary group-hover:text-white"}`}>
                        {t.name}
                      </h3>
                    </div>
                    <p className="text-xs text-text-muted truncate">{t.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ---- Selected Template Summary + Continue ---- */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-space-800/60 border border-card-border">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-16 rounded-lg overflow-hidden ring-1 ring-card-border flex-shrink-0 bg-white">
                <div className="relative w-full h-full overflow-hidden">
                  <iframe
                    srcDoc={generateHTML(SAMPLE, selected)}
                    className="absolute top-0 left-0 border-0 pointer-events-none"
                    style={{ width: "800px", height: "1040px", transform: "scale(0.015)", transformOrigin: "top left" }}
                    title="Selected"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: selected.previewAccent }} />
                  <span className="font-bold text-white">{selected.name}</span>
                  <span className="text-xs text-text-muted px-2 py-0.5 rounded-full bg-space-700">{selected.category}</span>
                </div>
                <p className="text-sm text-text-muted truncate">{selected.desc}</p>
              </div>
            </div>
            <button onClick={() => setStep("form")} className="btn-primary whitespace-nowrap px-8">
              Use This Template
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
         STEP 2: FILL IN DETAILS FORM
         ============================================================ */}
      {step === "form" && (
        <div>
          {/* Template indicator */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-1.5 rounded-full" style={{ background: selected.previewAccent }} />
            <span className="text-sm text-text-secondary">Using <strong className="text-white">{selected.name}</strong> template</span>
            <button onClick={() => setStep("gallery")} className="text-sm text-brand-light hover:text-white transition-colors ml-auto">Change template</button>
          </div>

          <div className="space-y-5">

            {/* ---- PDF Upload Zone ---- */}
            <div className="glass-card p-6 border-dashed border-2 border-brand-indigo/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-1">Upload Your Resume PDF</h2>
                  <p className="text-sm text-text-secondary mb-4">
                    Upload an existing resume and AI will automatically fill in all the fields below. You can edit anything after.
                  </p>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePdfUpload(file);
                    }}
                  />

                  {/* Upload button / status */}
                  {uploadStatus === "idle" && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-indigo/15 border border-brand-indigo/30 text-brand-light hover:bg-brand-indigo/25 transition-colors"
                    >
                      Choose PDF File
                    </button>
                  )}

                  {uploadStatus === "extracting" && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-brand-light border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-brand-light font-medium">Reading {uploadedFileName}...</span>
                    </div>
                  )}

                  {uploadStatus === "parsing" && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-blue-400 font-medium">AI is extracting your details...</span>
                    </div>
                  )}

                  {uploadStatus === "done" && (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-green-400 font-medium">{uploadedFileName} — fields auto-filled!</span>
                      <button
                        onClick={() => { setUploadStatus("idle"); setUploadedFileName(""); fileInputRef.current && (fileInputRef.current.value = ""); }}
                        className="text-xs text-text-muted hover:text-white ml-2"
                      >
                        Upload different
                      </button>
                    </div>
                  )}

                  {uploadStatus === "error" && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-red-400">{uploadError}</span>
                      </div>
                      <button
                        onClick={() => { setUploadStatus("idle"); setUploadError(""); fileInputRef.current && (fileInputRef.current.value = ""); }}
                        className="text-xs text-brand-light hover:text-white"
                      >
                        Try again
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              {uploadStatus === "idle" && (
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex-1 h-px bg-card-border" />
                  <span className="text-xs text-text-muted font-medium">OR FILL IN MANUALLY BELOW</span>
                  <div className="flex-1 h-px bg-card-border" />
                </div>
              )}
            </div>

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-space-800/60 border border-card-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-1.5 rounded-full" style={{ background: selected.previewAccent }} />
              <span className="text-sm text-text-secondary"><strong className="text-white">{selected.name}</strong> template</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setStep("form")} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors">
                Edit Details
              </button>
              <button onClick={() => setStep("gallery")} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors">
                Change Template
              </button>
              <button onClick={downloadWord} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors">
                Download Word
              </button>
              <button onClick={downloadPDF} disabled={pdfLoading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light hover:text-white hover:bg-brand-indigo/30 transition-colors disabled:opacity-50">
                {pdfLoading ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>

          {/* Full-size resume preview */}
          <div className="rounded-2xl overflow-hidden border border-card-border shadow-2xl bg-white">
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
