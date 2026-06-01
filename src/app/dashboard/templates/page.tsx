/* ============================================================
   RESUME TEMPLATES PAGE — 20 Structurally Unique Templates
   ============================================================
   Each template has a genuinely different HTML structure, not
   just different colors. Categories based on layout archetype:

   Classic (4): Traditional, ATS-Friendly, Centered, Compact
   Sidebar (5): Corporate, Creative, Tech, Premium, Fresh
   Visual (4): Timeline, Skill Bars, Rating Dots, Pill Tags
   Modern (4): Banner, Monogram, Icon Sections, Card Grid
   Special (3): Split 50/50, Alternating Bands, Right Sidebar
   ============================================================ */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
   TEMPLATE DEFINITIONS — 20 Structurally Unique Templates
   ============================================================ */
interface Template {
  id: string;
  name: string;
  desc: string;
  category: string;
  /* Each template has its own buildHTML function for unique structure */
  buildHTML: (d: ResumeData) => string;
}

/* ============================================================
   SHARED HELPERS
   ============================================================ */
function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function parseEntries(text: string): { title: string; sub: string; bullets: string[] }[] {
  const lines = text.split("\n").filter(l => l.trim());
  const entries: { title: string; sub: string; bullets: string[] }[] = [];
  let current: { title: string; sub: string; bullets: string[] } | null = null;
  for (const line of lines) {
    const t = line.trim();
    if (t.includes(" | ")) {
      if (current) entries.push(current);
      const parts = t.split(" | ").map(p => p.trim());
      current = { title: parts[0], sub: parts.slice(1).filter(Boolean).join(" · "), bullets: [] };
    } else if (t.startsWith("- ") || t.startsWith("• ")) {
      if (current) current.bullets.push(t.replace(/^[-•]\s*/, ""));
    } else if (current) {
      const prev = current.bullets.length > 0 ? current.bullets[current.bullets.length - 1] : "";
      if (prev && !prev.match(/[.!?)\]:]$/)) {
        current.bullets[current.bullets.length - 1] += " " + t;
      } else {
        current.bullets.push(t);
      }
    }
  }
  if (current) entries.push(current);
  return entries;
}

/* Parse skills into { category, items[] } groups */
function parseSkillGroups(text: string): { category: string; items: string[] }[] {
  return text.split("\n").filter(l => l.trim()).map(line => {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      return { category: line.slice(0, colonIdx).trim(), items: line.slice(colonIdx + 1).split(",").map(s => s.trim()).filter(Boolean) };
    }
    return { category: "", items: line.split(",").map(s => s.trim()).filter(Boolean) };
  });
}

/* Parse flat skill list for bar/dot/pill renderers */
function flatSkills(text: string): string[] {
  return text.split(/[,\n]/).map(s => s.replace(/^[-•]\s*/, "").trim()).filter(s => s && !s.includes(":"));
}

/* Parse all skills including categories */
function allSkillItems(text: string): string[] {
  const groups = parseSkillGroups(text);
  const items: string[] = [];
  for (const g of groups) items.push(...g.items);
  return items.length > 0 ? items : flatSkills(text);
}

function entriesHTML(text: string): string {
  const entries = parseEntries(text);
  if (entries.length === 0) return `<p>${esc(text)}</p>`;
  return entries.map(e => `
    <div class="entry">
      <div class="entry-title">${esc(e.title)}</div>
      ${e.sub ? `<div class="entry-sub">${esc(e.sub)}</div>` : ""}
      ${e.bullets.length > 0 ? `<ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");
}

function skillGroupsHTML(text: string): string {
  const groups = parseSkillGroups(text);
  if (groups.length === 0) return "";
  return groups.map(g => `<div class="skill-group">${g.category ? `<strong>${esc(g.category)}:</strong> ` : ""}${g.items.map(i => esc(i)).join(", ")}</div>`).join("");
}

function certsHTML(text: string): string {
  const lines = text.split("\n").filter(l => l.trim());
  if (lines.length === 0) return "";
  return `<ul>${lines.map(l => `<li>${esc(l.replace(/^[-•]\s*/, ""))}</li>`).join("")}</ul>`;
}

function langLines(text: string): string[] {
  return text.split("\n").filter(l => l.trim());
}

function contactParts(d: ResumeData): string[] {
  return [d.location, d.phone, d.email, d.linkedin].filter(Boolean);
}

/* ============================================================
   SVG ICONS (inline, no external deps)
   ============================================================ */
const ICONS = {
  email: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>`,
  phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  location: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  briefcase: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>`,
  graduation: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10l-10-6L2 10l10 6 10-6z"/><path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"/></svg>`,
  star: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  globe: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
  award: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-9-11h2m18 0h2m-3.636-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m0-12.728l1.414 1.414m11.314 11.314l1.414 1.414"/></svg>`,
};

/* ============================================================
   TEMPLATE 1: TRADITIONAL — Classic serif, HR lines, linear flow
   ============================================================ */
function buildTraditional(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; max-width:760px; margin:0 auto; padding:36px 40px; line-height:1.55; font-size:13px; color:#1a1a1a; }
    .name { font-size:28px; font-weight:700; color:#111; letter-spacing:-0.5px; margin-bottom:2px; }
    .title { font-size:14px; color:#555; font-style:italic; margin-bottom:6px; }
    .contact { font-size:12px; color:#666; font-style:italic; padding-bottom:12px; border-bottom:2.5px solid #111; margin-bottom:16px; }
    h2 { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#111; border-bottom:1.5px solid #888; padding-bottom:4px; margin:16px 0 10px; }
    .summary { font-size:12.5px; color:#333; line-height:1.6; margin-bottom:4px; }
    .entry { margin-bottom:12px; }
    .entry-title { font-weight:700; font-size:13px; color:#111; }
    .entry-sub { font-size:12px; color:#555; margin-bottom:3px; }
    ul { padding-left:18px; margin:3px 0 0; }
    li { font-size:12px; line-height:1.5; margin-bottom:2px; color:#333; }
    .skill-group { font-size:12px; margin-bottom:3px; color:#333; }
    p { font-size:12px; color:#333; margin:0 0 3px; }
  `;
  let html = `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) html += `<div class="title">${esc(d.jobTitle)}</div>`;
  html += `<div class="contact">${contactParts(d).join(" · ")}</div>`;
  if (d.summary) html += `<h2>Professional Summary</h2><div class="summary">${esc(d.summary)}</div>`;
  if (d.experience) html += `<h2>Work Experience</h2>${entriesHTML(d.experience)}`;
  if (d.education) html += `<h2>Education</h2>${entriesHTML(d.education)}`;
  if (d.skills) html += `<h2>Core Skills</h2>${skillGroupsHTML(d.skills)}`;
  if (d.certifications) html += `<h2>Certifications</h2>${certsHTML(d.certifications)}`;
  if (d.languages) html += `<h2>Languages</h2><p>${langLines(d.languages).map(l => esc(l)).join(" · ")}</p>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 2: ATS-FRIENDLY — Clean sans-serif, zero decoration
   ============================================================ */
function buildATS(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, Helvetica, sans-serif; max-width:760px; margin:0 auto; padding:32px 36px; line-height:1.5; font-size:12.5px; color:#222; }
    .header { text-align:center; margin-bottom:14px; border-bottom:1px solid #ccc; padding-bottom:12px; }
    .name { font-size:24px; font-weight:700; color:#000; text-transform:uppercase; letter-spacing:2px; }
    .title { font-size:12px; color:#555; margin:3px 0; }
    .contact { font-size:11px; color:#666; }
    .contact span { margin:0 6px; }
    h2 { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#000; margin:14px 0 6px; padding-top:8px; border-top:1px solid #ddd; }
    .summary { font-size:12px; color:#333; line-height:1.55; }
    .entry { margin-bottom:10px; }
    .entry-title { font-weight:700; font-size:12.5px; color:#111; }
    .entry-sub { font-size:11.5px; color:#555; }
    ul { padding-left:18px; margin:2px 0; }
    li { font-size:12px; line-height:1.45; margin-bottom:2px; }
    .skill-group { font-size:12px; margin-bottom:2px; }
    .skills-list { columns:2; column-gap:24px; }
    p { font-size:12px; color:#333; margin:0 0 2px; }
  `;
  let html = `<div class="header">
    <div class="name">${esc(d.fullName || "Your Name")}</div>
    ${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}
    <div class="contact">${contactParts(d).map(c => `<span>${esc(c)}</span>`).join(" | ")}</div>
  </div>`;
  if (d.summary) html += `<h2>Summary</h2><div class="summary">${esc(d.summary)}</div>`;
  if (d.experience) html += `<h2>Experience</h2>${entriesHTML(d.experience)}`;
  if (d.skills) html += `<h2>Skills</h2><div class="skills-list">${skillGroupsHTML(d.skills)}</div>`;
  if (d.education) html += `<h2>Education</h2>${entriesHTML(d.education)}`;
  if (d.certifications) html += `<h2>Certifications</h2>${certsHTML(d.certifications)}`;
  if (d.languages) html += `<h2>Languages</h2><p>${langLines(d.languages).map(l => esc(l)).join(" | ")}</p>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 3: CENTERED ELEGANT — All center-aligned, ornamental
   ============================================================ */
function buildCentered(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Georgia, 'Palatino Linotype', serif; max-width:720px; margin:0 auto; padding:44px 48px; line-height:1.55; font-size:12.5px; color:#333; text-align:center; }
    .header { padding:18px 0 20px; margin-bottom:20px; border-top:1px solid #8b5e3c; border-bottom:1px solid #8b5e3c; position:relative; }
    .header::before,.header::after { content:''; position:absolute; left:30%; right:30%; height:1px; background:#8b5e3c; }
    .header::before { top:-4px; }
    .header::after { bottom:-4px; }
    .name { font-size:26px; font-weight:400; color:#8b5e3c; letter-spacing:3px; text-transform:uppercase; }
    .title { font-size:12px; color:#888; font-style:italic; margin-top:4px; letter-spacing:1px; }
    .contact { font-size:11.5px; color:#999; letter-spacing:0.5px; margin-top:6px; }
    .divider { width:60px; height:1px; background:#cba882; margin:18px auto; }
    h2 { font-size:14px; font-weight:400; font-variant:small-caps; letter-spacing:2px; color:#8b5e3c; margin-bottom:10px; }
    .summary { font-size:12.5px; color:#555; line-height:1.65; max-width:580px; margin:0 auto 6px; font-style:italic; }
    .content { text-align:left; }
    .entry { margin-bottom:12px; }
    .entry-title { font-weight:700; font-size:12.5px; color:#4a3728; }
    .entry-sub { font-size:11.5px; color:#777; margin-bottom:3px; }
    ul { padding-left:18px; margin:3px 0; text-align:left; }
    li { font-size:12px; line-height:1.5; margin-bottom:2px; color:#555; }
    .skill-group { font-size:12px; margin-bottom:3px; text-align:left; }
    p { font-size:12px; margin:0 0 3px; }
  `;
  let html = `<div class="header">
    <div class="name">${esc(d.fullName || "Your Name")}</div>
    ${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}
    <div class="contact">${contactParts(d).join("  ·  ")}</div>
  </div>`;
  if (d.summary) html += `<div class="divider"></div><h2>About</h2><div class="summary">${esc(d.summary)}</div>`;
  html += `<div class="content">`;
  if (d.experience) html += `<div class="divider"></div><h2 style="text-align:center">Experience</h2>${entriesHTML(d.experience)}`;
  if (d.education) html += `<div class="divider"></div><h2 style="text-align:center">Education</h2>${entriesHTML(d.education)}`;
  if (d.skills) html += `<div class="divider"></div><h2 style="text-align:center">Skills</h2>${skillGroupsHTML(d.skills)}`;
  if (d.certifications) html += `<div class="divider"></div><h2 style="text-align:center">Certifications</h2>${certsHTML(d.certifications)}`;
  if (d.languages) html += `<div class="divider"></div><h2 style="text-align:center">Languages</h2><p>${langLines(d.languages).map(l => esc(l)).join("  ·  ")}</p>`;
  html += `</div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 4: COMPACT — Maximum density, tight grid, small type
   ============================================================ */
function buildCompact(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Calibri, Arial, sans-serif; max-width:780px; margin:0 auto; padding:20px 24px; line-height:1.3; font-size:11px; color:#222; }
    .header { display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2.5px solid #111; padding-bottom:7px; margin-bottom:10px; }
    .name { font-size:20px; font-weight:800; color:#111; letter-spacing:-0.3px; }
    .title { font-size:10px; color:#555; }
    .contact-right { text-align:right; font-size:10px; color:#666; line-height:1.5; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:0 20px; }
    .full { grid-column:1 / -1; }
    h2 { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; color:#fff; background:#374151; padding:2px 8px; margin-bottom:5px; display:inline-block; }
    .section { margin-bottom:8px; }
    .summary { font-size:10.5px; line-height:1.35; color:#333; }
    .entry { margin-bottom:5px; }
    .entry-title { font-size:11px; font-weight:700; color:#111; }
    .entry-sub { font-size:10px; color:#555; }
    ul { padding-left:14px; margin:1px 0 3px; }
    li { font-size:10.5px; line-height:1.3; margin-bottom:1px; }
    .skill-group { font-size:10.5px; margin-bottom:2px; }
    .skills-cols { columns:2; column-gap:16px; }
    p { font-size:10.5px; color:#333; margin:0 0 2px; }
  `;
  const c = contactParts(d);
  let html = `<div class="header">
    <div><div class="name">${esc(d.fullName || "Your Name")}</div>${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}</div>
    <div class="contact-right">${c.map(p => esc(p)).join("<br>")}</div>
  </div><div class="grid">`;
  if (d.summary) html += `<div class="full section"><h2>Summary</h2><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) html += `<div class="full section"><h2>Experience</h2>${entriesHTML(d.experience)}</div>`;
  if (d.skills) html += `<div class="section"><h2>Skills</h2><div class="skills-cols">${skillGroupsHTML(d.skills)}</div></div>`;
  if (d.education) html += `<div class="section"><h2>Education</h2>${entriesHTML(d.education)}</div>`;
  if (d.certifications) html += `<div class="section"><h2>Certifications</h2>${certsHTML(d.certifications)}</div>`;
  if (d.languages) html += `<div class="section"><h2>Languages</h2><p>${langLines(d.languages).map(l => esc(l)).join(" · ")}</p></div>`;
  html += `</div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 5: CORPORATE SIDEBAR — Dark navy left sidebar
   ============================================================ */
function buildCorporate(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { height:100%; }
    body { margin:0; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size:12px; line-height:1.45; color:#1a1a1a; }
    .wrap { display:flex; min-height:100vh; }
    .sidebar { width:34%; background:#1e293b; color:#e2e8f0; padding:28px 20px; }
    .main { width:66%; padding:28px 26px; }
    .name { font-size:22px; font-weight:700; color:#fff; margin-bottom:2px; }
    .title { color:#93c5fd; font-size:10.5px; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:14px; }
    .contact-item { color:#94a3b8; font-size:11px; display:flex; align-items:center; gap:8px; padding:5px 0; border-bottom:1px solid #334155; }
    .contact-item svg { color:#60a5fa; flex-shrink:0; }
    .sidebar h3 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#60a5fa; border-bottom:1px solid #334155; padding-bottom:4px; margin:16px 0 8px; }
    .sidebar li { color:#cbd5e1; font-size:11.5px; margin-bottom:2px; }
    .sidebar p { color:#cbd5e1; font-size:11.5px; }
    .sidebar ul { padding-left:14px; }
    .main h3 { font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#1e293b; border-bottom:2px solid #1e293b; padding-bottom:4px; margin:0 0 10px; }
    .main .section { margin-bottom:16px; }
    .summary { font-size:12px; color:#555; line-height:1.55; }
    .entry { margin-bottom:10px; }
    .entry-title { font-weight:700; font-size:12px; color:#111; }
    .entry-sub { font-size:11px; color:#666; margin-bottom:3px; }
    ul { padding-left:15px; margin:2px 0; }
    li { font-size:11.5px; line-height:1.4; margin-bottom:2px; }
    .skill-group { font-size:11.5px; margin-bottom:3px; }
    p { font-size:11.5px; margin:0 0 3px; }
  `;
  let sidebar = `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) sidebar += `<div class="title">${esc(d.jobTitle)}</div>`;
  const icons = [ICONS.location, ICONS.phone, ICONS.email, ICONS.linkedin];
  const contacts = contactParts(d);
  sidebar += contacts.map((c, i) => `<div class="contact-item">${icons[i] || ""}${esc(c)}</div>`).join("");
  if (d.skills) sidebar += `<h3>Skills</h3>${skillGroupsHTML(d.skills)}`;
  if (d.education) sidebar += `<h3>Education</h3>${entriesHTML(d.education)}`;
  if (d.languages) sidebar += `<h3>Languages</h3>${langLines(d.languages).map(l => `<p>${esc(l)}</p>`).join("")}`;

  let main = "";
  if (d.summary) main += `<div class="section"><h3>Profile</h3><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><h3>Work Experience</h3>${entriesHTML(d.experience)}</div>`;
  if (d.certifications) main += `<div class="section"><h3>Certifications</h3>${certsHTML(d.certifications)}</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap"><div class="sidebar">${sidebar}</div><div class="main">${main}</div></div></body></html>`;
}


/* ============================================================
   TEMPLATE 6: CREATIVE — Vivid coral sidebar, rounded elements
   ============================================================ */
function buildCreative(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { height:100%; }
    body { margin:0; font-family: 'Segoe UI', Calibri, sans-serif; font-size:12px; line-height:1.45; color:#1a1a1a; }
    .wrap { display:flex; min-height:100vh; }
    .sidebar { width:35%; background:linear-gradient(160deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%); color:#ede9fe; padding:32px 20px; }
    .main { width:65%; padding:28px 26px; }
    .initials { width:70px; height:70px; border-radius:50%; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; color:#fff; margin-bottom:12px; letter-spacing:1px; }
    .name { font-size:22px; font-weight:800; color:#fff; line-height:1.1; }
    .title { color:#c4b5fd; font-size:11px; text-transform:uppercase; letter-spacing:2px; margin-top:6px; margin-bottom:16px; }
    .contact-item { color:#c4b5fd; background:rgba(0,0,0,0.15); padding:5px 10px; border-radius:8px; margin-bottom:5px; font-size:11px; display:flex; align-items:center; gap:8px; }
    .contact-item svg { flex-shrink:0; }
    .sidebar h3 { color:#fff; font-weight:800; font-size:10.5px; text-transform:uppercase; letter-spacing:1px; background:rgba(0,0,0,0.2); padding:5px 10px; border-radius:8px; margin:14px 0 8px; }
    .sidebar p,.sidebar li { color:#ede9fe; font-size:11px; }
    .sidebar ul { padding-left:14px; }
    .sidebar li { margin-bottom:2px; }
    .main h3 { font-size:12.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:#5b21b6; padding:4px 0; border-left:4px solid #7c3aed; padding-left:10px; margin-bottom:8px; }
    .main .section { margin-bottom:16px; }
    .summary { font-size:12px; color:#555; line-height:1.55; }
    .entry { margin-bottom:10px; }
    .entry-title { font-weight:700; font-size:12px; color:#111; }
    .entry-sub { font-size:11px; color:#666; margin-bottom:3px; }
    ul { padding-left:15px; margin:2px 0; }
    li { font-size:11.5px; line-height:1.4; margin-bottom:2px; }
    .skill-group { font-size:11.5px; margin-bottom:3px; }
    p { font-size:11.5px; margin:0 0 3px; }
  `;
  const initials = (d.fullName || "YN").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  let sidebar = `<div class="initials">${initials}</div>`;
  sidebar += `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) sidebar += `<div class="title">${esc(d.jobTitle)}</div>`;
  const icons = [ICONS.location, ICONS.phone, ICONS.email, ICONS.linkedin];
  sidebar += contactParts(d).map((c, i) => `<div class="contact-item">${icons[i] || ""}${esc(c)}</div>`).join("");
  if (d.skills) sidebar += `<h3>Skills</h3>${skillGroupsHTML(d.skills)}`;
  if (d.languages) sidebar += `<h3>Languages</h3>${langLines(d.languages).map(l => `<p>${esc(l)}</p>`).join("")}`;

  let main = "";
  if (d.summary) main += `<div class="section"><h3>Profile</h3><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><h3>Experience</h3>${entriesHTML(d.experience)}</div>`;
  if (d.education) main += `<div class="section"><h3>Education</h3>${entriesHTML(d.education)}</div>`;
  if (d.certifications) main += `<div class="section"><h3>Certifications</h3>${certsHTML(d.certifications)}</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap"><div class="sidebar">${sidebar}</div><div class="main">${main}</div></div></body></html>`;
}


/* ============================================================
   TEMPLATE 7: TECH — Dark terminal-inspired, monospace headers
   ============================================================ */
function buildTech(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { height:100%; }
    body { margin:0; font-family: Calibri, sans-serif; font-size:12px; line-height:1.45; color:#1a1a1a; }
    .wrap { display:flex; min-height:100vh; }
    .sidebar { width:34%; background:#0f0f23; color:#d1d5db; padding:28px 18px; border-right:2px solid #22d3ee; }
    .main { width:66%; padding:28px 24px; background:#fafafa; }
    .name { font-size:20px; font-weight:700; color:#22d3ee; font-family:'Courier New',monospace; margin-bottom:2px; }
    .title { color:#67e8f9; font-size:11px; font-family:'Courier New',monospace; margin-bottom:14px; }
    .contact-item { color:#6b7280; font-family:'Courier New',monospace; font-size:10px; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
    .contact-item svg { color:#22d3ee; flex-shrink:0; }
    .sidebar h3 { color:#22d3ee; font-weight:700; font-family:'Courier New',monospace; font-size:10.5px; margin:14px 0 6px; text-transform:uppercase; letter-spacing:0.5px; }
    .sidebar h3::before { content:'> '; color:#06b6d4; }
    .sidebar p,.sidebar li { color:#d1d5db; font-size:11px; }
    .sidebar ul { padding-left:14px; }
    .sidebar li { margin-bottom:2px; }
    .main h3 { font-weight:700; color:#0f0f23; background:#e0f2fe; padding:5px 12px; border:1px solid #22d3ee; border-radius:3px; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; display:inline-block; }
    .main .section { margin-bottom:16px; }
    .summary { font-size:12px; color:#555; line-height:1.55; }
    .entry { margin-bottom:10px; }
    .entry-title { font-weight:700; font-size:12px; color:#0e7490; }
    .entry-sub { font-size:11px; color:#555; margin-bottom:3px; }
    ul { padding-left:15px; margin:2px 0; }
    li { font-size:11.5px; line-height:1.4; margin-bottom:2px; }
    .skill-group { font-size:11px; margin-bottom:3px; }
    p { font-size:11.5px; margin:0 0 3px; }
  `;
  let sidebar = `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) sidebar += `<div class="title">${esc(d.jobTitle)}</div>`;
  const icons = [ICONS.location, ICONS.phone, ICONS.email, ICONS.linkedin];
  sidebar += contactParts(d).map((c, i) => `<div class="contact-item">${icons[i] || ""}${esc(c)}</div>`).join("");
  if (d.skills) sidebar += `<h3>Skills</h3>${skillGroupsHTML(d.skills)}`;
  if (d.languages) sidebar += `<h3>Languages</h3>${langLines(d.languages).map(l => `<p>${esc(l)}</p>`).join("")}`;
  if (d.education) sidebar += `<h3>Education</h3>${entriesHTML(d.education)}`;

  let main = "";
  if (d.summary) main += `<div class="section"><h3>Profile</h3><br><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><h3>Experience</h3><br>${entriesHTML(d.experience)}</div>`;
  if (d.certifications) main += `<div class="section"><h3>Certifications</h3><br>${certsHTML(d.certifications)}</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap"><div class="sidebar">${sidebar}</div><div class="main">${main}</div></div></body></html>`;
}


/* ============================================================
   TEMPLATE 8: PREMIUM — Black + gold foil, luxury serif
   ============================================================ */
function buildPremium(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { height:100%; }
    body { margin:0; font-family: Georgia, 'Palatino Linotype', serif; font-size:12px; line-height:1.45; color:#1a1a1a; }
    .wrap { display:flex; min-height:100vh; }
    .sidebar { width:34%; background:linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%); color:#d1d5db; padding:28px 18px; border-right:2px solid #d4a843; }
    .main { width:66%; padding:28px 26px; }
    .name { font-size:22px; font-weight:400; color:#d4a843; letter-spacing:1px; margin-bottom:2px; }
    .title { color:#b8860b; font-size:10.5px; letter-spacing:2px; text-transform:uppercase; font-family:Calibri,sans-serif; margin-bottom:16px; }
    .contact-item { color:#8b8b8b; font-family:Calibri,sans-serif; font-size:10.5px; margin-bottom:4px; padding:4px 0; border-bottom:1px solid #2a2a2a; }
    .sidebar h3 { color:#d4a843; font-weight:400; font-variant:small-caps; letter-spacing:1.5px; border-bottom:1px solid #333; padding-bottom:4px; font-size:13px; margin:16px 0 8px; }
    .sidebar p,.sidebar li { color:#ccc; font-family:Calibri,sans-serif; font-size:11px; }
    .sidebar ul { padding-left:14px; }
    .sidebar li { margin-bottom:2px; }
    .main h3 { font-weight:400; color:#0a0a0a; font-variant:small-caps; letter-spacing:2px; border-bottom:1px solid #d4a843; padding-bottom:4px; font-size:14px; margin-bottom:10px; }
    .main .section { margin-bottom:16px; }
    .summary { font-size:12px; color:#555; line-height:1.55; font-style:italic; }
    .entry { margin-bottom:10px; }
    .entry-title { font-family:Calibri,sans-serif; font-weight:700; font-size:12px; color:#333; }
    .entry-sub { font-size:11px; color:#777; margin-bottom:3px; font-family:Calibri,sans-serif; }
    ul { padding-left:15px; margin:2px 0; }
    li { font-size:11.5px; line-height:1.4; margin-bottom:2px; font-family:Calibri,sans-serif; }
    .skill-group { font-size:11.5px; margin-bottom:3px; }
    p { font-size:11.5px; margin:0 0 3px; }
  `;
  let sidebar = `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) sidebar += `<div class="title">${esc(d.jobTitle)}</div>`;
  sidebar += contactParts(d).map(c => `<div class="contact-item">${esc(c)}</div>`).join("");
  if (d.skills) sidebar += `<h3>Expertise</h3>${skillGroupsHTML(d.skills)}`;
  if (d.languages) sidebar += `<h3>Languages</h3>${langLines(d.languages).map(l => `<p>${esc(l)}</p>`).join("")}`;
  if (d.education) sidebar += `<h3>Education</h3>${entriesHTML(d.education)}`;

  let main = "";
  if (d.summary) main += `<div class="section"><h3>Executive Profile</h3><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><h3>Professional Experience</h3>${entriesHTML(d.experience)}</div>`;
  if (d.certifications) main += `<div class="section"><h3>Credentials</h3>${certsHTML(d.certifications)}</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap"><div class="sidebar">${sidebar}</div><div class="main">${main}</div></div></body></html>`;
}


/* ============================================================
   TEMPLATE 9: FRESH — Light green pastel sidebar
   ============================================================ */
function buildFresh(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { height:100%; }
    body { margin:0; font-family: 'Segoe UI', Calibri, sans-serif; font-size:12px; line-height:1.45; color:#1a1a1a; }
    .wrap { display:flex; min-height:100vh; }
    .sidebar { width:34%; background:#ecfdf5; color:#1a1a1a; padding:28px 18px; }
    .main { width:66%; padding:28px 24px; border-left:3px solid #bbf7d0; }
    .name { font-size:24px; font-weight:700; color:#15803d; margin-bottom:2px; }
    .title { color:#16a34a; font-size:12px; font-weight:600; margin-bottom:14px; }
    .contact-item { color:#374151; font-size:11px; padding:4px 8px; background:#d1fae5; border-radius:6px; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
    .contact-item svg { color:#16a34a; flex-shrink:0; }
    .sidebar h3 { color:#15803d; font-weight:700; font-size:10.5px; text-transform:uppercase; letter-spacing:0.5px; background:#d1fae5; padding:4px 8px; border-radius:6px; margin:14px 0 8px; }
    .sidebar p,.sidebar li { color:#374151; font-size:11px; }
    .sidebar ul { padding-left:14px; }
    .sidebar li { margin-bottom:2px; }
    .main h3 { font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#15803d; border-bottom:2px solid #bbf7d0; padding-bottom:4px; margin-bottom:10px; }
    .main .section { margin-bottom:16px; }
    .summary { font-size:12px; color:#555; line-height:1.55; }
    .entry { margin-bottom:10px; }
    .entry-title { font-weight:700; font-size:12px; color:#111; }
    .entry-sub { font-size:11px; color:#555; margin-bottom:3px; }
    ul { padding-left:15px; margin:2px 0; }
    li { font-size:11.5px; line-height:1.4; margin-bottom:2px; }
    .skill-group { font-size:11.5px; margin-bottom:3px; }
    p { font-size:11.5px; margin:0 0 3px; }
  `;
  let sidebar = `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) sidebar += `<div class="title">${esc(d.jobTitle)}</div>`;
  const icons = [ICONS.location, ICONS.phone, ICONS.email, ICONS.linkedin];
  sidebar += contactParts(d).map((c, i) => `<div class="contact-item">${icons[i] || ""}${esc(c)}</div>`).join("");
  if (d.skills) sidebar += `<h3>Skills</h3>${skillGroupsHTML(d.skills)}`;
  if (d.education) sidebar += `<h3>Education</h3>${entriesHTML(d.education)}`;
  if (d.languages) sidebar += `<h3>Languages</h3>${langLines(d.languages).map(l => `<p>${esc(l)}</p>`).join("")}`;

  let main = "";
  if (d.summary) main += `<div class="section"><h3>Profile</h3><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><h3>Experience</h3>${entriesHTML(d.experience)}</div>`;
  if (d.certifications) main += `<div class="section"><h3>Certifications</h3>${certsHTML(d.certifications)}</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap"><div class="sidebar">${sidebar}</div><div class="main">${main}</div></div></body></html>`;
}


/* ============================================================
   TEMPLATE 10: TIMELINE — Vertical line with dot markers
   ============================================================ */
function buildTimeline(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Calibri, 'Segoe UI', sans-serif; max-width:760px; margin:0 auto; padding:32px 40px; line-height:1.5; font-size:12.5px; color:#1a1a1a; }
    .header { border-bottom:3px solid #6366f1; padding-bottom:14px; margin-bottom:20px; }
    .name { font-size:28px; font-weight:800; color:#312e81; }
    .title { font-size:14px; color:#6366f1; font-weight:600; }
    .contact { font-size:12px; color:#666; margin-top:6px; }
    h2 { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#4f46e5; margin:18px 0 12px; }
    .summary { font-size:12.5px; color:#444; line-height:1.6; margin-bottom:4px; }
    .timeline { position:relative; padding-left:24px; margin-left:8px; }
    .timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(180deg, #6366f1 0%, #c7d2fe 100%); border-radius:2px; }
    .t-entry { position:relative; margin-bottom:16px; padding-left:4px; }
    .t-entry::before { content:''; position:absolute; left:-28px; top:5px; width:13px; height:13px; border-radius:50%; background:#6366f1; border:3px solid #e0e7ff; }
    .entry-title { font-weight:700; font-size:13px; color:#312e81; }
    .entry-sub { font-size:11.5px; color:#6b7280; margin-bottom:3px; }
    ul { padding-left:16px; margin:3px 0; }
    li { font-size:12px; line-height:1.45; margin-bottom:2px; color:#444; }
    .skills-wrap { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; }
    .skill-pill { background:#e0e7ff; color:#4338ca; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:500; }
    .skill-group { font-size:12px; margin-bottom:3px; }
    p { font-size:12px; color:#444; margin:0 0 3px; }
  `;
  let html = `<div class="header">
    <div class="name">${esc(d.fullName || "Your Name")}</div>
    ${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}
    <div class="contact">${contactParts(d).join(" · ")}</div>
  </div>`;
  if (d.summary) html += `<h2>Profile</h2><div class="summary">${esc(d.summary)}</div>`;
  if (d.experience) {
    html += `<h2>Experience</h2><div class="timeline">`;
    const entries = parseEntries(d.experience);
    html += entries.map(e => `<div class="t-entry"><div class="entry-title">${esc(e.title)}</div>${e.sub ? `<div class="entry-sub">${esc(e.sub)}</div>` : ""}${e.bullets.length ? `<ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</div>`).join("");
    html += `</div>`;
  }
  if (d.education) {
    html += `<h2>Education</h2><div class="timeline">`;
    const entries = parseEntries(d.education);
    html += entries.map(e => `<div class="t-entry"><div class="entry-title">${esc(e.title)}</div>${e.sub ? `<div class="entry-sub">${esc(e.sub)}</div>` : ""}${e.bullets.length ? `<ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</div>`).join("");
    html += `</div>`;
  }
  if (d.skills) {
    html += `<h2>Skills</h2><div class="skills-wrap">`;
    html += allSkillItems(d.skills).map(s => `<span class="skill-pill">${esc(s)}</span>`).join("");
    html += `</div>`;
  }
  if (d.certifications) html += `<h2>Certifications</h2>${certsHTML(d.certifications)}`;
  if (d.languages) html += `<h2>Languages</h2><p>${langLines(d.languages).map(l => esc(l)).join(" · ")}</p>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 11: SKILL BARS — Sidebar with horizontal progress bars
   ============================================================ */
function buildSkillBars(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { height:100%; }
    body { margin:0; font-family: Calibri, 'Segoe UI', sans-serif; font-size:12px; line-height:1.45; color:#1a1a1a; }
    .wrap { display:flex; min-height:100vh; }
    .sidebar { width:36%; background:#1e3a5f; color:#e0f2fe; padding:28px 20px; }
    .main { width:64%; padding:28px 24px; }
    .name { font-size:22px; font-weight:800; color:#fff; letter-spacing:-0.5px; }
    .title { color:#7dd3fc; font-size:11px; font-weight:600; margin-bottom:14px; border-bottom:2px solid #7dd3fc; padding-bottom:8px; display:inline-block; }
    .contact-item { color:#bae6fd; font-size:11px; padding-left:10px; border-left:2px solid #2563eb; margin-bottom:6px; }
    .sidebar h3 { color:#7dd3fc; font-weight:800; font-size:10.5px; text-transform:uppercase; letter-spacing:0.8px; margin:16px 0 8px; border-top:1px solid #2d5a8e; padding-top:8px; }
    .bar-wrap { margin-bottom:8px; }
    .bar-label { font-size:11px; color:#bae6fd; margin-bottom:2px; }
    .bar-track { height:6px; background:rgba(255,255,255,0.15); border-radius:3px; overflow:hidden; }
    .bar-fill { height:100%; border-radius:3px; background:linear-gradient(90deg, #38bdf8, #7dd3fc); }
    .sidebar p { color:#bae6fd; font-size:11px; }
    .sidebar ul { padding-left:14px; }
    .sidebar li { color:#bae6fd; font-size:11px; margin-bottom:2px; }
    .main h3 { font-weight:800; color:#1e3a5f; font-size:12.5px; text-transform:uppercase; letter-spacing:0.5px; border-left:4px solid #1e3a5f; padding-left:10px; margin-bottom:8px; }
    .main .section { margin-bottom:16px; }
    .summary { font-size:12px; color:#555; line-height:1.55; }
    .entry { margin-bottom:10px; }
    .entry-title { font-weight:700; font-size:12px; color:#111; }
    .entry-sub { font-size:11px; color:#666; margin-bottom:3px; }
    ul { padding-left:15px; margin:2px 0; }
    li { font-size:11.5px; line-height:1.4; margin-bottom:2px; }
    p { font-size:11.5px; margin:0 0 3px; }
  `;
  /* Skills rendered as bars with pseudo-random widths based on position */
  const skills = allSkillItems(d.skills);
  const barWidths = [92, 88, 85, 80, 95, 78, 90, 82, 87, 75, 93, 86, 79, 91, 84, 77, 89, 83, 76, 94];

  let sidebar = `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) sidebar += `<div class="title">${esc(d.jobTitle)}</div>`;
  sidebar += contactParts(d).map(c => `<div class="contact-item">${esc(c)}</div>`).join("");
  if (d.skills) {
    sidebar += `<h3>Skills</h3>`;
    sidebar += skills.slice(0, 10).map((s, i) => `<div class="bar-wrap"><div class="bar-label">${esc(s)}</div><div class="bar-track"><div class="bar-fill" style="width:${barWidths[i % barWidths.length]}%"></div></div></div>`).join("");
  }
  if (d.languages) {
    sidebar += `<h3>Languages</h3>`;
    sidebar += langLines(d.languages).map((l, i) => `<div class="bar-wrap"><div class="bar-label">${esc(l.split("-")[0].trim())}</div><div class="bar-track"><div class="bar-fill" style="width:${[95, 70, 45, 60][i % 4]}%"></div></div></div>`).join("");
  }
  if (d.education) sidebar += `<h3>Education</h3>${entriesHTML(d.education)}`;

  let main = "";
  if (d.summary) main += `<div class="section"><h3>Profile</h3><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><h3>Experience</h3>${entriesHTML(d.experience)}</div>`;
  if (d.certifications) main += `<div class="section"><h3>Certifications</h3>${certsHTML(d.certifications)}</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap"><div class="sidebar">${sidebar}</div><div class="main">${main}</div></div></body></html>`;
}


/* ============================================================
   TEMPLATE 12: RATING DOTS — Skills shown as filled/empty dots
   ============================================================ */
function buildRatingDots(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { height:100%; }
    body { margin:0; font-family: 'Segoe UI', Calibri, sans-serif; font-size:12px; line-height:1.45; color:#1a1a1a; }
    .wrap { display:flex; min-height:100vh; }
    .sidebar { width:35%; background:#f8fafc; color:#1e293b; padding:28px 18px; border-right:1px solid #e2e8f0; }
    .main { width:65%; padding:28px 24px; }
    .name { font-size:20px; font-weight:700; color:#0f172a; margin-bottom:2px; }
    .title { font-size:12px; color:#64748b; font-weight:500; margin-bottom:14px; }
    .contact-item { font-size:11px; color:#64748b; margin-bottom:5px; display:flex; align-items:center; gap:6px; }
    .contact-item svg { color:#6366f1; flex-shrink:0; }
    .sidebar h3 { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#6366f1; margin:14px 0 8px; padding-top:8px; border-top:1px solid #e2e8f0; }
    .dot-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
    .dot-label { font-size:11px; color:#334155; flex:1; }
    .dots { display:flex; gap:4px; }
    .dot { width:8px; height:8px; border-radius:50%; }
    .dot-filled { background:#6366f1; }
    .dot-empty { background:#e2e8f0; }
    .sidebar p { color:#475569; font-size:11px; }
    .sidebar ul { padding-left:14px; }
    .sidebar li { color:#475569; font-size:11px; margin-bottom:2px; }
    .main h3 { font-size:12.5px; font-weight:700; color:#0f172a; letter-spacing:0.5px; padding-bottom:6px; border-bottom:2px solid #6366f1; margin-bottom:10px; }
    .main .section { margin-bottom:16px; }
    .summary { font-size:12px; color:#475569; line-height:1.55; }
    .entry { margin-bottom:10px; }
    .entry-title { font-weight:700; font-size:12px; color:#0f172a; }
    .entry-sub { font-size:11px; color:#64748b; margin-bottom:3px; }
    ul { padding-left:15px; margin:2px 0; }
    li { font-size:11.5px; line-height:1.4; margin-bottom:2px; }
    p { font-size:11.5px; margin:0 0 3px; }
  `;
  const skills = allSkillItems(d.skills);
  const dotCounts = [4, 5, 4, 3, 5, 4, 5, 3, 4, 5, 4, 3, 5, 4, 5, 3, 4, 5, 4, 3];

  let sidebar = `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) sidebar += `<div class="title">${esc(d.jobTitle)}</div>`;
  const icons = [ICONS.location, ICONS.phone, ICONS.email, ICONS.linkedin];
  sidebar += contactParts(d).map((c, i) => `<div class="contact-item">${icons[i] || ""}${esc(c)}</div>`).join("");
  if (d.skills) {
    sidebar += `<h3>Skills</h3>`;
    sidebar += skills.slice(0, 10).map((s, i) => {
      const filled = dotCounts[i % dotCounts.length];
      const dots = Array.from({ length: 5 }, (_, j) => `<div class="dot ${j < filled ? "dot-filled" : "dot-empty"}"></div>`).join("");
      return `<div class="dot-row"><span class="dot-label">${esc(s)}</span><div class="dots">${dots}</div></div>`;
    }).join("");
  }
  if (d.languages) {
    sidebar += `<h3>Languages</h3>`;
    const langDots = [5, 4, 3, 4];
    sidebar += langLines(d.languages).map((l, i) => {
      const filled = langDots[i % langDots.length];
      const dots = Array.from({ length: 5 }, (_, j) => `<div class="dot ${j < filled ? "dot-filled" : "dot-empty"}"></div>`).join("");
      return `<div class="dot-row"><span class="dot-label">${esc(l.split("-")[0].trim())}</span><div class="dots">${dots}</div></div>`;
    }).join("");
  }
  if (d.education) sidebar += `<h3>Education</h3>${entriesHTML(d.education)}`;

  let main = "";
  if (d.summary) main += `<div class="section"><h3>Profile</h3><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><h3>Experience</h3>${entriesHTML(d.experience)}</div>`;
  if (d.certifications) main += `<div class="section"><h3>Certifications</h3>${certsHTML(d.certifications)}</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap"><div class="sidebar">${sidebar}</div><div class="main">${main}</div></div></body></html>`;
}


/* ============================================================
   TEMPLATE 13: PILL TAGS — Skills as rounded pill badges
   ============================================================ */
function buildPillTags(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', Calibri, sans-serif; max-width:760px; margin:0 auto; padding:32px 40px; line-height:1.5; font-size:12.5px; color:#1a1a1a; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; padding-bottom:14px; border-bottom:3px solid #059669; }
    .name { font-size:26px; font-weight:800; color:#065f46; letter-spacing:-0.5px; }
    .title { font-size:13px; color:#059669; font-weight:600; }
    .contact-col { text-align:right; font-size:11px; color:#666; line-height:1.7; }
    h2 { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#059669; margin:16px 0 8px; }
    .summary { font-size:12.5px; color:#444; line-height:1.6; }
    .pills { display:flex; flex-wrap:wrap; gap:6px; margin:4px 0 8px; }
    .pill { padding:3px 12px; border-radius:14px; font-size:11px; font-weight:500; background:#d1fae5; color:#065f46; border:1px solid #a7f3d0; }
    .pill-cat { padding:3px 12px; border-radius:14px; font-size:10px; font-weight:700; background:#059669; color:#fff; text-transform:uppercase; letter-spacing:0.5px; }
    .entry { margin-bottom:12px; }
    .entry-title { font-weight:700; font-size:12.5px; color:#111; }
    .entry-sub { font-size:11.5px; color:#555; margin-bottom:3px; }
    ul { padding-left:16px; margin:3px 0; }
    li { font-size:12px; line-height:1.45; margin-bottom:2px; color:#444; }
    p { font-size:12px; color:#444; margin:0 0 3px; }
  `;
  const c = contactParts(d);
  let html = `<div class="header">
    <div><div class="name">${esc(d.fullName || "Your Name")}</div>${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}</div>
    <div class="contact-col">${c.map(p => esc(p)).join("<br>")}</div>
  </div>`;
  if (d.summary) html += `<h2>Summary</h2><div class="summary">${esc(d.summary)}</div>`;
  if (d.skills) {
    html += `<h2>Skills</h2>`;
    const groups = parseSkillGroups(d.skills);
    for (const g of groups) {
      html += `<div class="pills">`;
      if (g.category) html += `<span class="pill-cat">${esc(g.category)}</span>`;
      html += g.items.map(i => `<span class="pill">${esc(i)}</span>`).join("");
      html += `</div>`;
    }
  }
  if (d.experience) html += `<h2>Experience</h2>${entriesHTML(d.experience)}`;
  if (d.education) html += `<h2>Education</h2>${entriesHTML(d.education)}`;
  if (d.certifications) html += `<h2>Certifications</h2>${certsHTML(d.certifications)}`;
  if (d.languages) {
    html += `<h2>Languages</h2><div class="pills">`;
    html += langLines(d.languages).map(l => `<span class="pill">${esc(l)}</span>`).join("");
    html += `</div>`;
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 14: BANNER — Full-width gradient header
   ============================================================ */
function buildBanner(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { margin:0; font-family: Calibri, 'Segoe UI', sans-serif; font-size:13px; line-height:1.5; color:#1a1a1a; }
    .banner { background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding:32px 44px; }
    .name { font-size:32px; font-weight:800; color:#fff; letter-spacing:-0.5px; }
    .title { font-size:13px; color:rgba(255,255,255,0.8); letter-spacing:1px; margin-top:2px; }
    .contact-row { display:flex; flex-wrap:wrap; gap:16px; margin-top:10px; }
    .contact-chip { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,0.65); font-size:12px; }
    .contact-chip svg { color:rgba(255,255,255,0.5); }
    .body { padding:24px 44px; max-width:800px; }
    h2 { font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#1e293b; border-left:4px solid #1e293b; padding-left:10px; margin:16px 0 8px; }
    .summary { font-size:12.5px; color:#444; line-height:1.6; }
    .entry { margin-bottom:12px; }
    .entry-title { font-weight:700; font-size:13px; color:#111; }
    .entry-sub { font-size:12px; color:#555; margin-bottom:3px; }
    ul { padding-left:17px; margin:3px 0; }
    li { font-size:12px; line-height:1.45; margin-bottom:2px; color:#444; }
    .skill-group { font-size:12px; margin-bottom:3px; }
    p { font-size:12px; color:#444; margin:0 0 3px; }
  `;
  const icons = [ICONS.location, ICONS.phone, ICONS.email, ICONS.linkedin];
  let html = `<div class="banner">
    <div class="name">${esc(d.fullName || "Your Name")}</div>
    ${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}
    <div class="contact-row">${contactParts(d).map((c, i) => `<span class="contact-chip">${icons[i] || ""}${esc(c)}</span>`).join("")}</div>
  </div><div class="body">`;
  if (d.summary) html += `<h2>Summary</h2><div class="summary">${esc(d.summary)}</div>`;
  if (d.experience) html += `<h2>Experience</h2>${entriesHTML(d.experience)}`;
  if (d.skills) html += `<h2>Skills</h2>${skillGroupsHTML(d.skills)}`;
  if (d.education) html += `<h2>Education</h2>${entriesHTML(d.education)}`;
  if (d.certifications) html += `<h2>Certifications</h2>${certsHTML(d.certifications)}`;
  if (d.languages) html += `<h2>Languages</h2><p>${langLines(d.languages).map(l => esc(l)).join(" · ")}</p>`;
  html += `</div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 15: MONOGRAM — Large initials accent, minimal design
   ============================================================ */
function buildMonogram(d: ResumeData): string {
  const initials = (d.fullName || "YN").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width:740px; margin:0 auto; padding:36px 44px; line-height:1.5; font-size:12.5px; color:#222; }
    .header { display:flex; align-items:center; gap:20px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #e5e7eb; }
    .monogram { width:64px; height:64px; border-radius:50%; background:#111; color:#fff; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:700; letter-spacing:1px; flex-shrink:0; }
    .header-text { flex:1; }
    .name { font-size:24px; font-weight:700; color:#111; letter-spacing:-0.5px; }
    .title { font-size:12px; color:#888; margin-top:2px; }
    .contact { font-size:11px; color:#aaa; margin-top:4px; letter-spacing:0.3px; }
    h2 { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:3px; color:#999; margin:18px 0 8px; }
    .summary { font-size:12.5px; color:#555; line-height:1.6; }
    .entry { margin-bottom:12px; }
    .entry-title { font-weight:600; font-size:12.5px; color:#111; }
    .entry-sub { font-size:11.5px; color:#888; margin-bottom:3px; }
    ul { padding-left:16px; margin:3px 0; }
    li { font-size:12px; line-height:1.5; margin-bottom:2px; color:#555; }
    .skill-group { font-size:12px; margin-bottom:3px; color:#555; }
    p { font-size:12px; color:#555; margin:0 0 3px; }
  `;
  let html = `<div class="header">
    <div class="monogram">${initials}</div>
    <div class="header-text">
      <div class="name">${esc(d.fullName || "Your Name")}</div>
      ${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}
      <div class="contact">${contactParts(d).join("  ·  ")}</div>
    </div>
  </div>`;
  if (d.summary) html += `<h2>About</h2><div class="summary">${esc(d.summary)}</div>`;
  if (d.experience) html += `<h2>Experience</h2>${entriesHTML(d.experience)}`;
  if (d.education) html += `<h2>Education</h2>${entriesHTML(d.education)}`;
  if (d.skills) html += `<h2>Skills</h2>${skillGroupsHTML(d.skills)}`;
  if (d.certifications) html += `<h2>Certifications</h2>${certsHTML(d.certifications)}`;
  if (d.languages) html += `<h2>Languages</h2><p>${langLines(d.languages).map(l => esc(l)).join("  ·  ")}</p>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 16: ICON SECTIONS — Each section has a leading icon
   ============================================================ */
function buildIconSections(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Calibri, 'Segoe UI', sans-serif; max-width:760px; margin:0 auto; padding:32px 40px; line-height:1.5; font-size:12.5px; color:#1a1a1a; }
    .header { margin-bottom:18px; padding-bottom:14px; border-bottom:2px solid #dc2626; }
    .name { font-size:28px; font-weight:800; color:#111; }
    .title { font-size:13px; color:#dc2626; font-weight:600; }
    .contact-row { display:flex; flex-wrap:wrap; gap:14px; margin-top:8px; font-size:11.5px; color:#666; }
    .contact-row span { display:flex; align-items:center; gap:4px; }
    .contact-row svg { color:#dc2626; }
    .section { margin-bottom:16px; }
    .section-head { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
    .section-icon { width:30px; height:30px; border-radius:8px; background:#fef2f2; display:flex; align-items:center; justify-content:center; color:#dc2626; flex-shrink:0; }
    .section-head h2 { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#111; margin:0; }
    .summary { font-size:12.5px; color:#444; line-height:1.6; }
    .entry { margin-bottom:10px; margin-left:40px; }
    .entry-title { font-weight:700; font-size:12.5px; color:#111; }
    .entry-sub { font-size:11.5px; color:#666; margin-bottom:3px; }
    ul { padding-left:16px; margin:3px 0; }
    li { font-size:12px; line-height:1.45; margin-bottom:2px; color:#444; }
    .skill-group { font-size:12px; margin-bottom:3px; margin-left:40px; }
    .certs-list { margin-left:40px; }
    p { font-size:12px; color:#444; margin:0 0 3px; }
  `;
  const icons = [ICONS.location, ICONS.phone, ICONS.email, ICONS.linkedin];
  let html = `<div class="header">
    <div class="name">${esc(d.fullName || "Your Name")}</div>
    ${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}
    <div class="contact-row">${contactParts(d).map((c, i) => `<span>${icons[i] || ""}${esc(c)}</span>`).join("")}</div>
  </div>`;

  function iconSection(icon: string, title: string, content: string): string {
    return `<div class="section"><div class="section-head"><div class="section-icon">${icon}</div><h2>${title}</h2></div>${content}</div>`;
  }

  if (d.summary) html += iconSection(ICONS.user, "Profile", `<div class="summary" style="margin-left:40px">${esc(d.summary)}</div>`);
  if (d.experience) html += iconSection(ICONS.briefcase, "Experience", entriesHTML(d.experience));
  if (d.education) html += iconSection(ICONS.graduation, "Education", entriesHTML(d.education));
  if (d.skills) html += iconSection(ICONS.settings, "Skills", skillGroupsHTML(d.skills));
  if (d.certifications) html += iconSection(ICONS.award, "Certifications", `<div class="certs-list">${certsHTML(d.certifications)}</div>`);
  if (d.languages) html += iconSection(ICONS.globe, "Languages", `<p style="margin-left:40px">${langLines(d.languages).map(l => esc(l)).join(" · ")}</p>`);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 17: CARD GRID — Dashboard-style modular cards
   ============================================================ */
function buildCardGrid(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', Calibri, sans-serif; margin:0; padding:24px 28px; font-size:12px; line-height:1.45; color:#1a1a1a; background:#f1f5f9; }
    .header-card { background:linear-gradient(135deg, #0f172a, #1e293b); color:#fff; padding:24px 28px; border-radius:12px; margin-bottom:16px; }
    .name { font-size:26px; font-weight:800; letter-spacing:-0.5px; }
    .title { font-size:12px; color:#94a3b8; margin-top:2px; }
    .contact-row { display:flex; flex-wrap:wrap; gap:12px; margin-top:8px; font-size:11px; color:#94a3b8; }
    .contact-row span { display:flex; align-items:center; gap:5px; }
    .contact-row svg { color:#60a5fa; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .card { background:#fff; border-radius:10px; padding:16px 18px; border:1px solid #e2e8f0; }
    .card-full { grid-column:1 / -1; }
    .card h3 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#6366f1; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
    .card h3 svg { flex-shrink:0; }
    .summary { font-size:11.5px; color:#475569; line-height:1.55; }
    .entry { margin-bottom:8px; }
    .entry-title { font-weight:700; font-size:12px; color:#0f172a; }
    .entry-sub { font-size:11px; color:#64748b; margin-bottom:2px; }
    ul { padding-left:14px; margin:2px 0; }
    li { font-size:11px; line-height:1.4; margin-bottom:2px; color:#475569; }
    .skill-group { font-size:11px; margin-bottom:3px; color:#475569; }
    .stat-row { display:flex; gap:16px; margin-bottom:8px; }
    .stat { text-align:center; }
    .stat-num { font-size:22px; font-weight:800; color:#6366f1; }
    .stat-label { font-size:9px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; }
    p { font-size:11px; color:#475569; margin:0 0 2px; }
  `;
  const icons = [ICONS.location, ICONS.phone, ICONS.email, ICONS.linkedin];
  let html = `<div class="header-card">
    <div class="name">${esc(d.fullName || "Your Name")}</div>
    ${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}
    <div class="contact-row">${contactParts(d).map((c, i) => `<span>${icons[i] || ""}${esc(c)}</span>`).join("")}</div>
  </div><div class="grid">`;

  /* Stats card - extract some numbers from experience */
  const expEntries = parseEntries(d.experience);
  const yearsMatch = d.summary.match(/(\d+)\+?\s*years?/i);
  html += `<div class="card"><h3>${ICONS.star} Highlights</h3><div class="stat-row">
    <div class="stat"><div class="stat-num">${yearsMatch ? yearsMatch[1] + "+" : expEntries.length}</div><div class="stat-label">${yearsMatch ? "Years Exp." : "Roles"}</div></div>
    <div class="stat"><div class="stat-num">${allSkillItems(d.skills).length}</div><div class="stat-label">Skills</div></div>
    <div class="stat"><div class="stat-num">${langLines(d.languages).length || 1}</div><div class="stat-label">Languages</div></div>
  </div></div>`;

  if (d.summary) html += `<div class="card"><h3>${ICONS.user} Profile</h3><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) html += `<div class="card card-full"><h3>${ICONS.briefcase} Experience</h3>${entriesHTML(d.experience)}</div>`;
  if (d.skills) html += `<div class="card"><h3>${ICONS.settings} Skills</h3>${skillGroupsHTML(d.skills)}</div>`;
  if (d.education) html += `<div class="card"><h3>${ICONS.graduation} Education</h3>${entriesHTML(d.education)}</div>`;
  if (d.certifications) html += `<div class="card"><h3>${ICONS.award} Certifications</h3>${certsHTML(d.certifications)}</div>`;
  if (d.languages) html += `<div class="card"><h3>${ICONS.globe} Languages</h3>${langLines(d.languages).map(l => `<p>${esc(l)}</p>`).join("")}</div>`;
  html += `</div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 18: SPLIT 50/50 — Equal two-column layout
   ============================================================ */
function buildSplit(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { height:100%; }
    body { margin:0; font-family: Calibri, 'Segoe UI', sans-serif; font-size:12px; line-height:1.45; color:#1a1a1a; }
    .header { background:#111; color:#fff; padding:24px 28px; display:flex; justify-content:space-between; align-items:center; }
    .name { font-size:24px; font-weight:800; letter-spacing:-0.3px; }
    .title { font-size:11px; color:#9ca3af; text-transform:uppercase; letter-spacing:1.5px; }
    .contact-right { text-align:right; font-size:11px; color:#9ca3af; line-height:1.6; }
    .cols { display:flex; min-height:calc(100vh - 80px); }
    .col-left { width:50%; padding:20px 22px; border-right:1px solid #e5e7eb; }
    .col-right { width:50%; padding:20px 22px; }
    h3 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#111; margin:0 0 8px; padding-bottom:4px; border-bottom:2px solid #111; }
    .section { margin-bottom:16px; }
    .summary { font-size:12px; color:#555; line-height:1.55; }
    .entry { margin-bottom:10px; }
    .entry-title { font-weight:700; font-size:12px; color:#111; }
    .entry-sub { font-size:11px; color:#666; margin-bottom:2px; }
    ul { padding-left:15px; margin:2px 0; }
    li { font-size:11px; line-height:1.4; margin-bottom:2px; }
    .skill-group { font-size:11.5px; margin-bottom:3px; }
    p { font-size:11.5px; margin:0 0 3px; }
  `;
  const c = contactParts(d);
  let html = `<div class="header">
    <div><div class="name">${esc(d.fullName || "Your Name")}</div>${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}</div>
    <div class="contact-right">${c.map(p => esc(p)).join("<br>")}</div>
  </div><div class="cols"><div class="col-left">`;
  if (d.summary) html += `<div class="section"><h3>Profile</h3><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) html += `<div class="section"><h3>Experience</h3>${entriesHTML(d.experience)}</div>`;
  html += `</div><div class="col-right">`;
  if (d.skills) html += `<div class="section"><h3>Skills</h3>${skillGroupsHTML(d.skills)}</div>`;
  if (d.education) html += `<div class="section"><h3>Education</h3>${entriesHTML(d.education)}</div>`;
  if (d.certifications) html += `<div class="section"><h3>Certifications</h3>${certsHTML(d.certifications)}</div>`;
  if (d.languages) html += `<div class="section"><h3>Languages</h3>${langLines(d.languages).map(l => `<p>${esc(l)}</p>`).join("")}</div>`;
  html += `</div></div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 19: ALTERNATING BANDS — Full-width colored section bands
   ============================================================ */
function buildBands(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { margin:0; font-family: 'Segoe UI', Calibri, sans-serif; font-size:12.5px; line-height:1.5; color:#1a1a1a; }
    .band { padding:20px 40px; }
    .band-dark { background:#0f172a; color:#fff; }
    .band-light { background:#fff; }
    .band-gray { background:#f8fafc; }
    .band-accent { background:#eef2ff; }
    .name { font-size:30px; font-weight:800; letter-spacing:-0.5px; }
    .title { font-size:13px; color:#94a3b8; margin-top:2px; }
    .contact-row { display:flex; flex-wrap:wrap; gap:14px; margin-top:8px; font-size:11.5px; color:#94a3b8; }
    h2 { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#4f46e5; margin-bottom:10px; }
    .summary { font-size:12.5px; color:#475569; line-height:1.6; }
    .entry { margin-bottom:12px; }
    .entry-title { font-weight:700; font-size:12.5px; color:#111; }
    .entry-sub { font-size:11.5px; color:#64748b; margin-bottom:3px; }
    ul { padding-left:16px; margin:3px 0; }
    li { font-size:12px; line-height:1.45; margin-bottom:2px; color:#475569; }
    .skill-group { font-size:12px; margin-bottom:3px; color:#475569; }
    .skills-2col { columns:2; column-gap:24px; }
    p { font-size:12px; color:#475569; margin:0 0 3px; }
  `;
  let html = `<div class="band band-dark">
    <div class="name">${esc(d.fullName || "Your Name")}</div>
    ${d.jobTitle ? `<div class="title">${esc(d.jobTitle)}</div>` : ""}
    <div class="contact-row">${contactParts(d).map(c => `<span>${esc(c)}</span>`).join("")}</div>
  </div>`;
  if (d.summary) html += `<div class="band band-light"><h2>Summary</h2><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) html += `<div class="band band-gray"><h2>Experience</h2>${entriesHTML(d.experience)}</div>`;
  if (d.skills) html += `<div class="band band-accent"><h2>Skills</h2><div class="skills-2col">${skillGroupsHTML(d.skills)}</div></div>`;
  if (d.education) html += `<div class="band band-light"><h2>Education</h2>${entriesHTML(d.education)}</div>`;
  if (d.certifications) html += `<div class="band band-gray"><h2>Certifications</h2>${certsHTML(d.certifications)}</div>`;
  if (d.languages) html += `<div class="band band-light"><h2>Languages</h2><p>${langLines(d.languages).map(l => esc(l)).join(" · ")}</p></div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE 20: RIGHT SIDEBAR — Content left, info right
   ============================================================ */
function buildRightSidebar(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { height:100%; }
    body { margin:0; font-family: 'Segoe UI', Calibri, sans-serif; font-size:12px; line-height:1.45; color:#1a1a1a; }
    .wrap { display:flex; min-height:100vh; }
    .main { width:65%; padding:28px 26px; }
    .sidebar { width:35%; background:linear-gradient(180deg, #9f1239 0%, #881337 100%); color:#ffe4e6; padding:28px 20px; }
    .main .name { font-size:26px; font-weight:800; color:#9f1239; margin-bottom:2px; }
    .main .title { font-size:13px; color:#be123c; margin-bottom:14px; font-weight:500; }
    .main h3 { font-size:12.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#9f1239; border-bottom:3px solid #fda4af; padding-bottom:4px; margin-bottom:8px; }
    .main .section { margin-bottom:16px; }
    .summary { font-size:12px; color:#555; line-height:1.55; }
    .entry { margin-bottom:10px; }
    .entry-title { font-weight:700; font-size:12px; color:#111; }
    .entry-sub { font-size:11px; color:#666; margin-bottom:3px; }
    .sidebar h3 { color:#fff; font-weight:700; font-size:10.5px; text-transform:uppercase; letter-spacing:1px; background:rgba(255,255,255,0.15); padding:5px 10px; border-radius:14px; text-align:center; margin:14px 0 8px; }
    .contact-item { color:#fda4af; text-align:center; font-size:11px; margin-bottom:5px; }
    .sidebar p,.sidebar li { color:#fecdd3; font-size:11px; }
    .sidebar ul { padding-left:14px; }
    .sidebar li { margin-bottom:2px; }
    ul { padding-left:15px; margin:2px 0; }
    li { font-size:11.5px; line-height:1.4; margin-bottom:2px; }
    .skill-group { font-size:11.5px; margin-bottom:3px; }
    p { font-size:11.5px; margin:0 0 3px; }
  `;
  let main = `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  if (d.jobTitle) main += `<div class="title">${esc(d.jobTitle)}</div>`;
  if (d.summary) main += `<div class="section"><h3>Profile</h3><div class="summary">${esc(d.summary)}</div></div>`;
  if (d.experience) main += `<div class="section"><h3>Experience</h3>${entriesHTML(d.experience)}</div>`;
  if (d.certifications) main += `<div class="section"><h3>Certifications</h3>${certsHTML(d.certifications)}</div>`;

  let sidebar = `<h3>Contact</h3>`;
  sidebar += contactParts(d).map(c => `<div class="contact-item">${esc(c)}</div>`).join("");
  if (d.skills) sidebar += `<h3>Skills</h3>${skillGroupsHTML(d.skills)}`;
  if (d.education) sidebar += `<h3>Education</h3>${entriesHTML(d.education)}`;
  if (d.languages) sidebar += `<h3>Languages</h3>${langLines(d.languages).map(l => `<p>${esc(l)}</p>`).join("")}`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap"><div class="main">${main}</div><div class="sidebar">${sidebar}</div></div></body></html>`;
}


/* ============================================================
   TEMPLATE 0: STANDARD ATS — Matches JobPilot AI PDF output exactly
   ============================================================ */
function buildStandardATS(d: ResumeData): string {
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Helvetica, Arial, sans-serif; max-width:760px; margin:0 auto; padding:30px 36px; line-height:1.45; font-size:10pt; color:#191919; }
    .name { font-size:24pt; font-weight:700; color:#111; margin-bottom:2px; }
    .contact { font-size:10pt; color:#191919; margin-bottom:14px; }
    .contact a { color:#003399; text-decoration:underline; }
    h2 { font-size:12pt; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#111; border-bottom:2px solid #1a1a1a; padding-bottom:3px; margin:18px 0 10px; }
    .summary { font-size:10pt; color:#191919; line-height:1.5; margin-bottom:4px; }
    .entry { margin-bottom:10px; }
    .entry-row { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:3px; }
    .entry-row .left { font-weight:700; font-size:10.5pt; color:#111; }
    .entry-row .date { font-weight:700; font-size:10.5pt; color:#111; white-space:nowrap; margin-left:12px; }
    .edu-row { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
    .edu-row .left { font-weight:400; font-size:10.5pt; color:#191919; }
    .edu-row .date { font-weight:700; font-size:10.5pt; color:#111; white-space:nowrap; margin-left:12px; }
    ul { padding-left:20px; margin:2px 0 8px; list-style-type:disc; }
    li { font-size:10pt; line-height:1.45; margin-bottom:2px; color:#191919; }
    .skill-group { font-size:10pt; margin-bottom:3px; color:#191919; }
    .skill-group strong { color:#111; }
    .lang-line { font-size:10pt; color:#191919; margin-bottom:3px; }
  `;

  let html = `<div class="name">${esc(d.fullName || "Your Name")}</div>`;
  const contact = contactParts(d);
  const contactStr = contact.map(c => {
    if (c.includes("linkedin.com")) return `<a href="${c.startsWith("http") ? esc(c) : "https://" + esc(c)}">${esc(c)}</a>`;
    return esc(c);
  }).join(" &bull; ");
  html += `<div class="contact">${contactStr}</div>`;

  if (d.summary) html += `<h2>Professional Summary</h2><div class="summary">${esc(d.summary)}</div>`;

  if (d.skills) {
    html += `<h2>Core Skills</h2>`;
    const groups = parseSkillGroups(d.skills);
    html += groups.map(g => `<div class="skill-group">${g.category ? `${esc(g.category)}: ` : ""}${g.items.map(i => esc(i)).join(", ")}</div>`).join("");
  }

  if (d.experience) {
    html += `<h2>Work Experience</h2>`;
    const entries = parseEntries(d.experience);
    html += entries.map(e => {
      let leftText = e.title;
      let dateText = "";
      if (e.sub) {
        const datePart = e.sub.match(/([\d/]+ *[-–] *[\d/\w]+)$/);
        if (datePart) {
          dateText = datePart[1];
          const beforeDate = e.sub.slice(0, e.sub.indexOf(datePart[0])).replace(/\s*[·•,\-–—]\s*$/, "").trim().replace(/ · /g, ", ");
          if (beforeDate) leftText += ", " + beforeDate;
        } else {
          leftText += ", " + e.sub.replace(/ · /g, ", ");
        }
      }
      let row = `<div class="entry"><div class="entry-row"><span class="left">${esc(leftText)}</span>`;
      if (dateText) row += `<span class="date">${esc(dateText)}</span>`;
      row += `</div>`;
      if (e.bullets.length > 0) row += `<ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>`;
      row += `</div>`;
      return row;
    }).join("");
  }

  if (d.education) {
    html += `<h2>Education</h2>`;
    const entries = parseEntries(d.education);
    html += entries.map(e => {
      let leftText = e.title;
      let dateText = "";
      if (e.sub) {
        const datePart = e.sub.match(/([\d/]+ *[-–] *[\d/\w]+|\d{4}\s*[-–]\s*(?:Current|Present|\d{4})|\d{4})$/);
        if (datePart) {
          dateText = datePart[1];
          const beforeDate = e.sub.slice(0, e.sub.indexOf(datePart[0])).replace(/\s*[·•,\-–—]\s*$/, "").trim().replace(/ · /g, ", ");
          if (beforeDate) leftText += ", " + beforeDate;
        } else {
          leftText += ", " + e.sub.replace(/ · /g, ", ");
        }
      }
      if (!dateText) {
        const inlineDate = leftText.match(/,\s*((?:\d{4}\s*[-–]\s*(?:Current|Present|\d{4}))|\d{4})\s*$/);
        if (inlineDate) {
          dateText = inlineDate[1];
          leftText = leftText.slice(0, leftText.indexOf(inlineDate[0])).trim();
        }
      }
      let row = `<div class="edu-row"><span class="left">${esc(leftText)}</span>`;
      if (dateText) row += `<span class="date">${esc(dateText)}</span>`;
      row += `</div>`;
      if (e.bullets.length > 0) row += `<ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>`;
      return row;
    }).join("");
  }

  if (d.certifications) {
    html += `<h2>Certifications and Trainings</h2>`;
    const lines = d.certifications.split("\n").filter(l => l.trim());
    html += lines.map(l => {
      const clean = l.replace(/^[-•]\s*/, "");
      const datePart = clean.match(/[-—–]\s*([\d/]+ *[-–] *[\d/\w]+|\d{4}\s*[-–]\s*(?:Current|Present|\d{4})|Current|Present|\d{4})\s*$/);
      if (datePart) {
        const title = clean.slice(0, clean.indexOf(datePart[0])).trim();
        return `<div class="edu-row"><span class="left">${esc(title)}</span><span class="date">${esc(datePart[1])}</span></div>`;
      }
      return `<div class="edu-row"><span class="left">${esc(clean)}</span></div>`;
    }).join("");
  }

  if (d.languages) {
    html += `<h2>Languages</h2>`;
    html += langLines(d.languages).map(l => `<div class="lang-line">${esc(l)}</div>`).join("");
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}


/* ============================================================
   TEMPLATE REGISTRY — All 21 templates
   ============================================================ */
const TEMPLATES: Template[] = [
  /* ---- STANDARD ---- */
  { id: "standard-ats", name: "Standard ATS-Friendly", desc: "JobPilot's signature layout — clean Helvetica, bold headers, right-aligned dates", category: "Standard", buildHTML: buildStandardATS },

  /* ---- CLASSIC ---- */
  { id: "traditional", name: "Traditional", desc: "Classic serif layout trusted by Fortune 500 recruiters", category: "Classic", buildHTML: buildTraditional },
  { id: "ats-friendly", name: "ATS-Friendly", desc: "Zero-decoration layout that passes every ATS parser", category: "Classic", buildHTML: buildATS },
  { id: "centered", name: "Centered Elegant", desc: "Symmetric centered layout with ornamental copper accents", category: "Classic", buildHTML: buildCentered },
  { id: "compact", name: "Compact", desc: "Maximum density — fits 15+ years on one page", category: "Classic", buildHTML: buildCompact },

  /* ---- SIDEBAR ---- */
  { id: "corporate", name: "Corporate", desc: "Navy sidebar with icon contact list and structured hierarchy", category: "Sidebar", buildHTML: buildCorporate },
  { id: "creative", name: "Creative", desc: "Vivid purple sidebar with initials avatar and rounded elements", category: "Sidebar", buildHTML: buildCreative },
  { id: "tech", name: "Tech", desc: "Terminal-inspired dark theme with monospace headers", category: "Sidebar", buildHTML: buildTech },
  { id: "premium", name: "Premium", desc: "Luxury black with gold foil-style accents, serif typography", category: "Sidebar", buildHTML: buildPremium },
  { id: "fresh", name: "Fresh", desc: "Light pastel green sidebar with organic feel", category: "Sidebar", buildHTML: buildFresh },

  /* ---- VISUAL ---- */
  { id: "timeline", name: "Timeline", desc: "Connected timeline dots trace your career progression", category: "Visual", buildHTML: buildTimeline },
  { id: "skill-bars", name: "Skill Bars", desc: "Horizontal progress bars visualize your skill proficiency", category: "Visual", buildHTML: buildSkillBars },
  { id: "rating-dots", name: "Rating Dots", desc: "5-dot rating system for skills and languages", category: "Visual", buildHTML: buildRatingDots },
  { id: "pill-tags", name: "Pill Tags", desc: "Colorful rounded pill badges for every skill", category: "Visual", buildHTML: buildPillTags },

  /* ---- MODERN ---- */
  { id: "banner", name: "Banner", desc: "Full-width gradient header with icon contact chips", category: "Modern", buildHTML: buildBanner },
  { id: "monogram", name: "Monogram", desc: "Large initials badge as a personal brand mark", category: "Modern", buildHTML: buildMonogram },
  { id: "icon-sections", name: "Icon Sections", desc: "Every section led by a distinctive icon in a colored box", category: "Modern", buildHTML: buildIconSections },
  { id: "card-grid", name: "Card Grid", desc: "Dashboard-style modular cards with stat highlights", category: "Modern", buildHTML: buildCardGrid },

  /* ---- SPECIAL ---- */
  { id: "split", name: "Split 50/50", desc: "Equal two-column layout with dark header bar", category: "Special", buildHTML: buildSplit },
  { id: "bands", name: "Alternating Bands", desc: "Full-width colored bands separate each section", category: "Special", buildHTML: buildBands },
  { id: "right-sidebar", name: "Right Sidebar", desc: "Magenta right sidebar — content gets prime left position", category: "Special", buildHTML: buildRightSidebar },
];

/* ============================================================
   MINI PREVIEW COMPONENT — Scaled iframe showing full resume
   iframe ensures complete CSS isolation. The 800x1130 content
   is scaled down to fit the card via CSS transform.
   ============================================================ */
function MiniPreview({ template, data }: { template: Template; data: ResumeData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedScale, setComputedScale] = useState(0);
  const html = template.buildHTML(data);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setComputedScale(el.offsetWidth / 800);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: "8.5/11" }}>
      {computedScale > 0 && (
        <iframe
          srcDoc={html}
          className="absolute top-0 left-0 border-0 pointer-events-none"
          style={{ width: "800px", height: "1131px", transform: `scale(${computedScale})`, transformOrigin: "top left" }}
          title={template.name}
          loading="lazy"
        />
      )}
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
  const categories = ["All", "Standard", "Classic", "Sidebar", "Visual", "Modern", "Special"];
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
        setUploadError("Couldn't read text from this PDF. It may be a scanned image — please try a different file.");
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
        setUploadError("Auto-fill is temporarily busy. Please try again in a moment.");
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
        setUploadError("Couldn't parse that resume. Please try a different PDF file.");
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
      setUploadError("Something went wrong. Please try uploading again.");
      setUploadStatus("error");
    }
  };

  /* ---- PDF Download via jspdf + html2canvas inside isolated iframe ---- */
  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const fullHTML = selected.buildHTML(formData);

      /* Use an iframe for complete CSS isolation from the dark theme */
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;height:1122px;border:none;visibility:hidden;";
      document.body.appendChild(iframe);

      const idoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!idoc) throw new Error("Cannot access iframe document");
      idoc.open();
      idoc.write(fullHTML);
      idoc.close();

      /* Wait for fonts and layout to settle */
      await new Promise(r => setTimeout(r, 500));

      const canvas = await html2canvas(idoc.body, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 794,
      });

      document.body.removeChild(iframe);

      const imgWidth = 210;
      const pageHeight = 297;
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageHeightPx = Math.floor(pageHeight * canvas.width / imgWidth);
      const ctx = canvas.getContext("2d");
      let yOffset = 0;
      let isFirstPage = true;

      /* # Margin for pages 2+: ~14mm — used as minimum when centering content */
      const MARGIN_MM = 14;
      const FIXED_MARGIN = Math.floor(MARGIN_MM * canvas.width / imgWidth);

      /* Scan only the right 55% of the canvas for white gaps.
         This ensures two-column templates with dark sidebars still
         get proper page breaks based on the main content area. */
      const scanX = Math.floor(canvas.width * 0.45);
      const scanW = canvas.width - scanX - 20;

      const findBreak = (from: number, to: number): number => {
        if (!ctx) return -1;
        let consecutive = 0;
        let bestRow = -1;
        let bestSize = 0;
        let gapTopRow = -1;

        for (let row = from; row > to; row--) {
          const rowPixels = ctx.getImageData(scanX, row, scanW, 1).data;
          let allWhite = true;
          for (let i = 0; i < rowPixels.length; i += 16) {
            if (rowPixels[i] < 245 || rowPixels[i + 1] < 245 || rowPixels[i + 2] < 245) {
              allWhite = false;
              break;
            }
          }
          if (allWhite) {
            consecutive++;
            if (gapTopRow === -1) gapTopRow = row;
          } else {
            if (consecutive >= 24 && consecutive > bestSize) {
              bestSize = consecutive;
              bestRow = gapTopRow - consecutive + 1;
            }
            consecutive = 0;
            gapTopRow = -1;
          }
        }
        if (consecutive >= 24 && consecutive > bestSize) {
          bestRow = gapTopRow - consecutive + 1;
        }
        return bestRow;
      };

      const skipWhite = (from: number): number => {
        if (!ctx) return from;
        let pos = from;
        while (pos < canvas.height) {
          const rowPixels = ctx.getImageData(scanX, pos, scanW, 1).data;
          let allWhite = true;
          for (let i = 0; i < rowPixels.length; i += 16) {
            if (rowPixels[i] < 245 || rowPixels[i + 1] < 245 || rowPixels[i + 2] < 245) {
              allWhite = false;
              break;
            }
          }
          if (!allWhite) break;
          pos++;
        }
        return pos;
      };

      while (yOffset < canvas.height) {
        /* # Page 1: no reserved margins (CSS padding handles top, maximize content)
           # Pages 2+: reserve minimum margin for break scanning */
        const reserveForScan = isFirstPage ? 0 : FIXED_MARGIN;
        const availableH = pageHeightPx - reserveForScan;
        let sliceBottom = Math.min(yOffset + availableH, canvas.height);
        const isLastSlice = sliceBottom >= canvas.height;

        if (!isLastSlice) {
          const scanEnd = Math.max(yOffset + Math.floor(availableH * 0.80), yOffset);
          const br = findBreak(sliceBottom, scanEnd);
          if (br > yOffset) sliceBottom = br;
        }

        const sliceH = sliceBottom - yOffset;

        /* # Calculate where to place content on the page canvas:
           # Page 1: top=0 (CSS padding is baked into the canvas content)
           # Pages 2+: center the slice vertically for equal top/bottom margins */
        let drawY: number;
        if (isFirstPage) {
          drawY = 0;
        } else {
          const totalSpace = pageHeightPx - sliceH;
          drawY = Math.max(FIXED_MARGIN, Math.floor(totalSpace / 2));
        }

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageHeightPx;
        const pctx = pageCanvas.getContext("2d")!;
        pctx.fillStyle = "#ffffff";
        pctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pctx.drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, drawY, canvas.width, sliceH);

        if (!isFirstPage) pdf.addPage();
        pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.98), "JPEG", 0, 0, imgWidth, pageHeight);

        yOffset = isLastSlice ? sliceBottom : skipWhite(sliceBottom);
        isFirstPage = false;
      }

      pdf.save(`${formData.fullName || "resume"}-resume.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      /* Fallback: open in new tab for browser print-to-PDF */
      const html = selected.buildHTML(formData);
      const w = window.open("", "_blank");
      if (w) { w.document.write(html); w.document.close(); }
    } finally { setPdfLoading(false); }
  };

  /* ---- Word Download ---- */
  const downloadWord = () => {
    const html = selected.buildHTML(formData);
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

  /* ---- Category color map for badges ---- */
  const catColors: Record<string, string> = {
    Classic: "bg-gray-500/20 text-gray-300",
    Sidebar: "bg-blue-500/20 text-blue-300",
    Visual: "bg-purple-500/20 text-purple-300",
    Modern: "bg-emerald-500/20 text-emerald-300",
    Special: "bg-amber-500/20 text-amber-300",
  };

  return (
    <div>
      {/* ---- Page Header ---- */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold mb-3">
          Resume Templates
        </h1>
        <p className="text-text-secondary text-lg">
          20 structurally unique designs. Pick one, fill your details, and download a polished PDF.
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

          {/* ---- Template Grid ---- */}
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
                  {/* Resume preview */}
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
                      <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-brand-indigo flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Template info */}
                  <div className="px-3 py-2.5 bg-space-800 border-t border-card-border">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-text-secondary group-hover:text-white"}`}>
                        {t.name}
                      </h3>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${catColors[t.category] || "bg-space-600 text-text-muted"}`}>
                        {t.category}
                      </span>
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
              <div className="w-12 h-16 rounded-lg ring-1 ring-card-border flex-shrink-0 bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{selected.name}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${catColors[selected.category] || "bg-space-600 text-text-muted"}`}>
                    {selected.category}
                  </span>
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
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColors[selected.category] || ""}`}>{selected.category}</span>
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
                    Upload your resume and AI will automatically fill in all the fields below. Review and edit anything before previewing.
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

            </div>

            {/* ---- Form fields only shown after resume is successfully parsed ---- */}
            {uploadStatus === "done" ? (
            <>

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

            </>
            ) : (uploadStatus === "idle" || uploadStatus === "error") && (
              <div className="glass-card p-10 flex flex-col items-center text-center">
                <svg className="w-14 h-14 text-text-muted mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-text-secondary text-sm font-medium mb-1">Upload your resume to get started</p>
                <p className="text-text-muted text-xs">AI will extract your details and fill in all the fields automatically so you can review and edit.</p>
              </div>
            )}
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
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColors[selected.category] || ""}`}>{selected.category}</span>
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
              srcDoc={selected.buildHTML(formData)}
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
