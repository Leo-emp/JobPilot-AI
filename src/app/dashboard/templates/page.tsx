/* ============================================================
   RESUME TEMPLATES PAGE
   ============================================================
   Users pick from 6 ATS-friendly resume templates, fill in
   their details via a form, preview the result live, and
   download as PDF (print) or Word (.doc).

   Template designs:
   1. Classic — Traditional single-column, serif accents
   2. Modern — Clean sans-serif with subtle color bar
   3. Executive — Bold headers, dark section dividers
   4. Minimal — Maximum whitespace, lightweight feel
   5. Technical — Monospace touches, skills grid layout
   6. Creative — Colored sidebar with contact/skills

   All templates are ATS-friendly: no tables for layout,
   no images, no multi-column tricks that confuse parsers.
   ============================================================ */

"use client";

import { useState } from "react";

/* ============================================================
   TEMPLATE DEFINITIONS
   ============================================================
   Each template has an id, display name, description, accent
   color for preview cards, and a CSS generator function that
   produces the print/download styles.
   ============================================================ */
const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    desc: "Traditional layout trusted by Fortune 500 recruiters",
    accent: "from-blue-500 to-blue-700",
    preview: "border-blue-500/30",
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Clean and contemporary with a subtle color accent",
    accent: "from-indigo-500 to-purple-600",
    preview: "border-indigo-500/30",
  },
  {
    id: "executive",
    name: "Executive",
    desc: "Bold and authoritative for senior-level roles",
    accent: "from-gray-600 to-gray-900",
    preview: "border-gray-500/30",
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Ultra-clean with maximum whitespace and clarity",
    accent: "from-emerald-500 to-teal-600",
    preview: "border-emerald-500/30",
  },
  {
    id: "technical",
    name: "Technical",
    desc: "Optimized for engineering and technical roles",
    accent: "from-cyan-500 to-blue-600",
    preview: "border-cyan-500/30",
  },
  {
    id: "creative",
    name: "Creative",
    desc: "Standout design for marketing and design roles",
    accent: "from-pink-500 to-rose-600",
    preview: "border-pink-500/30",
  },
];

/* ============================================================
   FORM FIELD TYPE
   ============================================================ */
interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  certifications: string;
}

/* ============================================================
   DEFAULT EMPTY FORM
   ============================================================ */
const EMPTY_FORM: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  summary: "",
  skills: "",
  experience: "",
  education: "",
  certifications: "",
};

/* ============================================================
   TEMPLATE CSS GENERATORS
   ============================================================
   Each template ID maps to a function that returns the CSS
   for the downloadable/printable HTML document.
   All use single-column, ATS-safe structure.
   ============================================================ */
function getTemplateCSS(templateId: string): string {
  const shared = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.6; }
    .header { margin-bottom: 20px; }
    .name { margin-bottom: 4px; }
    .contact { margin-bottom: 16px; }
    .contact span { margin-right: 14px; }
    .section { margin-bottom: 18px; }
    .section-title { margin-bottom: 10px; }
    .content { white-space: pre-line; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag { display: inline-block; padding: 2px 0; }
    @media print { body { padding: 20px; } }
  `;

  switch (templateId) {
    case "classic":
      return shared + `
        body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 14px; }
        .name { font-size: 28px; font-weight: bold; color: #111; }
        .contact { font-size: 13px; color: #444; border-bottom: 2px solid #111; padding-bottom: 12px; }
        .section-title { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #999; padding-bottom: 4px; color: #111; }
        .content { font-size: 14px; color: #222; }
        .skill-tag { font-size: 13px; color: #222; }
      `;
    case "modern":
      return shared + `
        body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 14px; }
        .header { border-left: 4px solid #4f46e5; padding-left: 16px; }
        .name { font-size: 30px; font-weight: 700; color: #1e1b4b; }
        .contact { font-size: 13px; color: #555; }
        .section-title { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #4f46e5; border-bottom: 2px solid #e0e0ff; padding-bottom: 4px; }
        .content { font-size: 14px; color: #333; }
        .skill-tag { background: #eef2ff; color: #4338ca; padding: 3px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; }
      `;
    case "executive":
      return shared + `
        body { font-family: 'Calibri', Arial, sans-serif; font-size: 14px; }
        .header { background: #1a1a1a; color: #fff; padding: 24px; margin: -40px -40px 24px -40px; }
        .name { font-size: 32px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 2px; }
        .contact { font-size: 13px; color: #ccc; }
        .section-title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; background: #f0f0f0; padding: 6px 12px; color: #111; }
        .content { font-size: 14px; color: #222; }
        .skill-tag { font-size: 13px; font-weight: 600; color: #111; }
      `;
    case "minimal":
      return shared + `
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13.5px; }
        .name { font-size: 26px; font-weight: 300; color: #111; letter-spacing: 1px; }
        .contact { font-size: 12px; color: #888; }
        .section { margin-bottom: 22px; }
        .section-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; color: #999; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; }
        .content { font-size: 13.5px; color: #333; }
        .skill-tag { font-size: 12px; color: #555; }
      `;
    case "technical":
      return shared + `
        body { font-family: 'Consolas', 'Fira Code', 'Courier New', monospace; font-size: 13px; }
        .name { font-size: 26px; font-weight: bold; color: #0ea5e9; }
        .contact { font-size: 12px; color: #555; font-family: 'Calibri', Arial, sans-serif; }
        .section-title { font-size: 14px; font-weight: bold; color: #0284c7; border-bottom: 2px solid #0ea5e9; padding-bottom: 3px; font-family: 'Calibri', Arial, sans-serif; text-transform: uppercase; letter-spacing: 1px; }
        .content { font-size: 13px; color: #222; font-family: 'Calibri', Arial, sans-serif; }
        .skill-tag { background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-family: 'Consolas', monospace; }
      `;
    case "creative":
      return shared + `
        body { font-family: 'Segoe UI', 'Calibri', Arial, sans-serif; font-size: 14px; }
        .header { border-bottom: 3px solid #ec4899; padding-bottom: 16px; }
        .name { font-size: 32px; font-weight: 700; color: #be185d; }
        .contact { font-size: 13px; color: #666; }
        .section-title { font-size: 15px; font-weight: 700; color: #be185d; border-bottom: 2px solid #fce7f3; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .content { font-size: 14px; color: #333; }
        .skill-tag { background: #fdf2f8; color: #be185d; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
      `;
    default:
      return shared;
  }
}

/* ============================================================
   GENERATE HTML FROM FORM DATA
   ============================================================
   Builds a clean, ATS-friendly HTML document from the user's
   form inputs. Skills are split by comma into individual tags.
   ============================================================ */
function generateResumeHTML(data: ResumeData, templateId: string): string {
  /* Build contact line from non-empty fields */
  const contactParts = [data.email, data.phone, data.location, data.linkedin].filter(Boolean);
  const contactLine = contactParts.map((c) => `<span>${c}</span>`).join(" | ");

  /* Split skills by comma into individual tags */
  const skillTags = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `<span class="skill-tag">${s}</span>`)
    .join(" ");

  /* Build sections — only include non-empty ones */
  let sections = "";

  if (data.summary.trim()) {
    sections += `
      <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="content">${data.summary}</div>
      </div>`;
  }

  if (data.skills.trim()) {
    sections += `
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">${skillTags}</div>
      </div>`;
  }

  if (data.experience.trim()) {
    sections += `
      <div class="section">
        <div class="section-title">Professional Experience</div>
        <div class="content">${data.experience}</div>
      </div>`;
  }

  if (data.education.trim()) {
    sections += `
      <div class="section">
        <div class="section-title">Education</div>
        <div class="content">${data.education}</div>
      </div>`;
  }

  if (data.certifications.trim()) {
    sections += `
      <div class="section">
        <div class="section-title">Certifications & Development</div>
        <div class="content">${data.certifications}</div>
      </div>`;
  }

  const css = getTemplateCSS(templateId);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.fullName || "Resume"} - Resume</title>
  <style>${css}</style>
</head>
<body>
  <div class="header">
    <div class="name">${data.fullName || "Your Name"}</div>
    <div class="contact">${contactLine || "email@example.com | (123) 456-7890"}</div>
  </div>
  ${sections}
</body>
</html>`;
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */
export default function TemplatesPage() {
  /* Which template is selected */
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  /* Current step: "pick" template or "fill" form */
  const [step, setStep] = useState<"pick" | "fill">("pick");
  /* Form data */
  const [formData, setFormData] = useState<ResumeData>(EMPTY_FORM);
  /* Preview modal */
  const [showPreview, setShowPreview] = useState(false);

  /* Update a single form field */
  const updateField = (field: keyof ResumeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* Check if enough data to preview/download */
  const canPreview = formData.fullName.trim() && (formData.summary.trim() || formData.experience.trim());
  /* Track PDF generation state */
  const [pdfLoading, setPdfLoading] = useState(false);

  /* ---- Download as PDF file using html2pdf.js from CDN ---- */
  /* Dynamically loads html2pdf.js, renders HTML to canvas, outputs .pdf file */
  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      /* Load html2pdf.js from CDN if not already loaded */
      if (!(window as unknown as Record<string, unknown>).html2pdf) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load PDF library"));
          document.head.appendChild(script);
        });
      }

      /* Create a temporary container with the resume HTML */
      const container = document.createElement("div");
      const fullHTML = generateResumeHTML(formData, selectedTemplate);
      /* Extract only the body content and apply inline styles */
      container.innerHTML = fullHTML.replace(/<html>|<\/html>|<head>[\s\S]*?<\/head>|<body>|<\/body>|<!DOCTYPE html>/g, "");

      /* Apply the template's CSS as a style tag inside the container */
      const styleEl = document.createElement("style");
      styleEl.textContent = getTemplateCSS(selectedTemplate);
      container.prepend(styleEl);

      /* Temporarily add to DOM (required for rendering) */
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.width = "800px";
      document.body.appendChild(container);

      /* Generate PDF with html2pdf */
      const html2pdf = (window as unknown as Record<string, unknown>).html2pdf as CallableFunction;
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `${formData.fullName || "resume"}-resume.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save();

      /* Clean up */
      document.body.removeChild(container);
    } catch {
      /* Fallback to print dialog if PDF library fails */
      const html = generateResumeHTML(formData, selectedTemplate);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 300);
      }
    } finally {
      setPdfLoading(false);
    }
  };

  /* ---- Download as Word (.doc) ---- */
  const downloadWord = () => {
    const html = generateResumeHTML(formData, selectedTemplate);
    /* Wrap in Word-compatible XML namespace */
    const wordHTML = html.replace("<html>",
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">');
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
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
          Resume Templates
        </h1>
        <p className="text-text-secondary">
          Pick a professional ATS-friendly template, fill in your details, and download your resume.
        </p>
      </div>

      {/* ---- Step Indicator ---- */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setStep("pick")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            step === "pick"
              ? "bg-brand-indigo/15 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white border border-transparent"
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-brand-indigo/20 text-brand-light flex items-center justify-center text-xs font-bold">1</span>
          Choose Template
        </button>
        <div className="w-8 h-px bg-card-border" />
        <button
          onClick={() => setStep("fill")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            step === "fill"
              ? "bg-brand-indigo/15 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white border border-transparent"
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-brand-indigo/20 text-brand-light flex items-center justify-center text-xs font-bold">2</span>
          Fill Details
        </button>
      </div>

      {/* ============================================================
         STEP 1: TEMPLATE PICKER
         ============================================================ */}
      {step === "pick" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`relative p-5 rounded-xl text-left transition-all ${
                  selectedTemplate === t.id
                    ? `bg-brand-indigo/10 border-2 ${t.preview} shadow-lg`
                    : "bg-space-700/50 border border-card-border hover:border-brand-indigo/20"
                }`}
              >
                {/* Template color preview bar */}
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${t.accent} mb-4`} />
                <h3 className={`text-base font-bold mb-1 ${selectedTemplate === t.id ? "text-white" : "text-text-secondary"}`}>
                  {t.name}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">{t.desc}</p>
                {/* Selected checkmark */}
                {selectedTemplate === t.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-indigo flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Continue button */}
          <button
            onClick={() => setStep("fill")}
            className="btn-primary"
          >
            Continue with {TEMPLATES.find((t) => t.id === selectedTemplate)?.name} Template
          </button>
        </div>
      )}

      {/* ============================================================
         STEP 2: FILL IN DETAILS FORM
         ============================================================ */}
      {step === "fill" && (
        <div>
          {/* Selected template indicator */}
          <div className="mb-6 flex items-center gap-3">
            <div className={`w-12 h-1.5 rounded-full bg-gradient-to-r ${TEMPLATES.find((t) => t.id === selectedTemplate)?.accent}`} />
            <span className="text-sm text-text-secondary">
              Using <strong className="text-white">{TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</strong> template
            </span>
            <button
              onClick={() => setStep("pick")}
              className="text-sm text-brand-light hover:text-white transition-colors ml-auto"
            >
              Change template
            </button>
          </div>

          <div className="space-y-6">
            {/* ---- Personal Information ---- */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="New York, NY"
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => updateField("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                  />
                </div>
              </div>
            </div>

            {/* ---- Professional Summary ---- */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Professional Summary</h2>
              <p className="text-xs text-text-muted mb-4">2-3 sentences summarizing your experience and value proposition.</p>
              <textarea
                value={formData.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
              />
            </div>

            {/* ---- Skills ---- */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Skills</h2>
              <p className="text-xs text-text-muted mb-4">Comma-separated list of your key skills.</p>
              <textarea
                value={formData.skills}
                onChange={(e) => updateField("skills", e.target.value)}
                placeholder="JavaScript, React, Node.js, Python, SQL, AWS, Docker, Git, Agile, REST APIs"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
              />
            </div>

            {/* ---- Experience ---- */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Professional Experience</h2>
              <p className="text-xs text-text-muted mb-4">
                List each role with title, company, dates, and bullet points. Use a blank line between roles.
              </p>
              <textarea
                value={formData.experience}
                onChange={(e) => updateField("experience", e.target.value)}
                placeholder={`Senior Software Engineer | TechCorp Inc. | Jan 2022 - Present
- Led development of microservices architecture serving 2M+ users
- Reduced API response times by 40% through query optimization
- Mentored 3 junior developers and conducted code reviews

Software Engineer | StartupXYZ | Jun 2019 - Dec 2021
- Built React dashboard used by 500+ enterprise clients
- Implemented CI/CD pipeline reducing deployment time by 60%`}
                rows={10}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
              />
            </div>

            {/* ---- Education ---- */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Education</h2>
              <textarea
                value={formData.education}
                onChange={(e) => updateField("education", e.target.value)}
                placeholder={`Bachelor of Science in Computer Science
University of California, Berkeley | 2015 - 2019
GPA: 3.7/4.0 | Dean's List`}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
              />
            </div>

            {/* ---- Certifications (optional) ---- */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-2">Certifications & Development <span className="text-text-muted font-normal text-sm">(optional)</span></h2>
              <textarea
                value={formData.certifications}
                onChange={(e) => updateField("certifications", e.target.value)}
                placeholder={`AWS Certified Solutions Architect — 2023
Google Professional Data Engineer — 2022`}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
              />
            </div>

            {/* ---- Action Buttons ---- */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPreview(true)}
                disabled={!canPreview}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview Resume
              </button>
              <button
                onClick={downloadPDF}
                disabled={!canPreview || pdfLoading}
                className="px-6 py-3 rounded-xl text-sm font-medium bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light hover:text-white hover:bg-brand-indigo/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pdfLoading ? "Generating PDF..." : "Download PDF"}
              </button>
              <button
                onClick={downloadWord}
                disabled={!canPreview}
                className="px-6 py-3 rounded-xl text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download Word
              </button>
            </div>

            {!canPreview && (
              <p className="text-xs text-text-muted">
                Fill in at least your name and either a summary or experience to preview/download.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
         PREVIEW MODAL
         ============================================================
         Full-screen overlay showing the rendered resume exactly as
         it will look when printed/downloaded.
         ============================================================ */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => setShowPreview(false)}
          />
          {/* Modal content */}
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-8">
            {/* Modal header (dark bar) */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-space-800 rounded-t-2xl border-b border-card-border">
              <h3 className="text-white font-bold text-sm">Resume Preview — {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadPDF}
                  disabled={pdfLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light hover:text-white hover:bg-brand-indigo/30 transition-colors disabled:opacity-50"
                >
                  {pdfLoading ? "Generating..." : "Download PDF"}
                </button>
                <button
                  onClick={downloadWord}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors"
                >
                  Download Word
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="ml-2 text-text-muted hover:text-white p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Resume rendered in iframe-like container */}
            <div
              className="p-8 sm:p-12"
              dangerouslySetInnerHTML={{ __html: generateResumeHTML(formData, selectedTemplate).replace(/<html>|<\/html>|<head>[\s\S]*?<\/head>|<body>|<\/body>|<!DOCTYPE html>/g, "") }}
              style={{
                fontFamily: selectedTemplate === "classic" ? "Georgia, serif" :
                  selectedTemplate === "technical" ? "Consolas, monospace" :
                  "Calibri, Segoe UI, Arial, sans-serif",
                color: "#1a1a1a",
                lineHeight: "1.6",
                fontSize: "14px",
              }}
            />
          </div>
        </div>
      )}

      {/* ---- Tips Section ---- */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">ATS-Friendly</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            All templates use single-column layouts with standard headings that ATS software can parse reliably.
          </p>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">Customize Freely</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Download as Word to make further edits. The structure is clean and easy to modify in any word processor.
          </p>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">Pro Tip</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Use the Resume Intelligence tool first to optimize your content, then paste the improved text into a template here.
          </p>
        </div>
      </div>
    </div>
  );
}
