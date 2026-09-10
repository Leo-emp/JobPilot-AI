/* ============================================================
   COUNTRY RESUME RESULT - Renders country-specific AI resumes
   ============================================================
   Separate renderer from MarkdownResult, built specifically for
   country-specific resumes (US, UK, AU). Does NOT touch or modify
   the existing MarkdownResult component.

   US layout: centered name, contact, and section headers.
   UK/AU: left-aligned (same as standard for now).
   ============================================================ */

"use client";

import { useState, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import type { jsPDF } from "jspdf";
import AiDisclosure from "./AiDisclosure";

/* # Country type matches the country selector on the resume page */
type Country = "us" | "uk" | "au";

/* ---- Escape HTML to prevent XSS ---- */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ---- Convert inline markdown to HTML ---- */
function processInline(text: string): string {
  const safe = escapeHtml(text);
  return safe
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="text-gray-300">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-space-600 px-1.5 py-0.5 rounded text-brand-light text-[13px]">$1</code>');
}

/* ---- Parse markdown to HTML with country-specific layout ---- */
function parseCountryMarkdown(md: string, country: Country): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inList = false;
  let listType = "";
  /* # Track if we're still in the header area (before first ## section) */
  let seenSection = false;

  const closeLists = () => {
    if (inList) {
      htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
    }
  };

  /* # US uses centered name/contact/headers; UK and AU are left-aligned */
  const centerHeaders = country === "us";

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      if (inList) closeLists();
      continue;
    }

    /* # Skip horizontal rules — section headers already have underlines */
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      closeLists();
      continue;
    }

    /* # H2: Section headers */
    if (trimmed.startsWith("## ")) {
      closeLists();
      seenSection = true;
      const h2Text = trimmed.slice(3);
      if (centerHeaders) {
        htmlParts.push(`<h2 class="text-xl font-bold text-white mt-8 mb-4 pb-2 border-b border-card-border uppercase tracking-wide text-center">${processInline(h2Text)}</h2>`);
      } else {
        htmlParts.push(`<h2 class="text-xl font-bold text-white mt-8 mb-4 pb-2 border-b border-card-border uppercase tracking-wide">${processInline(h2Text)}</h2>`);
      }
      continue;
    }

    /* # H1: Candidate name */
    if (trimmed.startsWith("# ")) {
      closeLists();
      const nameText = processInline(trimmed.slice(2));
      if (centerHeaders) {
        htmlParts.push(`<h1 class="text-2xl font-bold text-white mb-2 mt-4 text-center">${nameText}</h1>`);
      } else {
        htmlParts.push(`<h1 class="text-2xl font-bold text-white mb-2 mt-4">${nameText}</h1>`);
      }
      continue;
    }

    /* # Contact line detection: has separators + email or phone, appears before first section */
    const isContact = !seenSection &&
      (trimmed.includes("|") || trimmed.includes("•") || trimmed.includes("·") || trimmed.includes(" - ")) &&
      (trimmed.includes("@") || /\+?\d[\d\s()\-]{7,}/.test(trimmed));

    if (isContact && centerHeaders) {
      htmlParts.push(`<p class="text-[15px] text-gray-200 leading-relaxed mb-3 text-center">${processInline(trimmed)}</p>`);
      continue;
    }

    /* # Unordered list items */
    if (/^[-*•] /.test(trimmed)) {
      if (!inList || listType !== "ul") {
        if (inList) htmlParts.push("</ol>");
        htmlParts.push(`<ul class="list-disc list-outside ml-5 space-y-2 mb-4">`);
        inList = true;
        listType = "ul";
      }
      htmlParts.push(`<li class="text-[15px] text-gray-200 leading-relaxed">${processInline(trimmed.replace(/^[-*•] /, ""))}</li>`);
      continue;
    }

    /* # Ordered list items */
    if (/^\d+\. /.test(trimmed)) {
      if (!inList || listType !== "ol") {
        if (inList) htmlParts.push("</ul>");
        htmlParts.push(`<ol class="list-decimal list-outside ml-5 space-y-2 mb-4">`);
        inList = true;
        listType = "ol";
      }
      htmlParts.push(`<li class="text-[15px] text-gray-200 leading-relaxed">${processInline(trimmed.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }

    /* # Regular paragraph */
    if (inList) closeLists();
    htmlParts.push(`<p class="text-[15px] text-gray-200 leading-relaxed mb-3">${processInline(trimmed)}</p>`);
  }

  if (inList) closeLists();
  return htmlParts.join("\n");
}

/* ---- Professional download styles for PDF/Word exports ---- */
/* # Country-specific: US centers name, contact, and section headers */
export function getDownloadStyles(country: Country): string {
  const headerAlign = country === "us" ? "text-align: center;" : "";
  const h1Align = country === "us" ? "text-align: center;" : "";
  const contactAlign = country === "us" ? "text-align: center;" : "";

  return `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px 36px; color: #1a1a1a; line-height: 1.45; font-size: 13px; }
  h1 { font-size: 26px; font-weight: 700; margin: 0 0 2px 0; color: #111; ${h1Align} }
  h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #111; padding-bottom: 2px; margin: 16px 0 8px 0; color: #111; ${headerAlign} }
  h3, .entry-row { font-size: 13px; font-weight: 700; margin: 8px 0 2px 0; color: #111; }
  .entry-row { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-row .date { font-weight: 700; white-space: nowrap; margin-left: 12px; }
  p { margin: 0 0 6px 0; font-size: 12.5px; color: #191919; }
  .contact-line { font-size: 12px; color: #191919; margin-bottom: 10px; ${contactAlign} }
  ul, ol { padding-left: 20px; margin: 2px 0 8px 0; list-style-type: disc; }
  li { margin-bottom: 2px; font-size: 12.5px; color: #191919; line-height: 1.45; }
  strong { color: #111; font-weight: 700; }
  em { font-style: italic; }
  hr { border: none; border-top: 1px solid #ddd; margin: 10px 0; }
  @media print { body { padding: 20px; } }
`;
}

/* ---- Convert markdown to structured HTML for downloads ---- */
export function markdownToDownloadHTML(md: string, country: Country): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inList = false;
  let seenSection = false;
  const centerHeaders = country === "us";

  /* # Extract date range from end of text */
  const splitDate = (text: string): { left: string; date: string } | null => {
    /* # Multiple date patterns: MM/YYYY, Month YYYY, YYYY */
    const patterns = [
      /^(.*?)\s*[—–\-]{1,2}\s*((?:\d{1,2}\/\d{4})\s*[—–\-]\s*(?:\d{1,2}\/\d{4}|Current|Present|Ongoing))\s*$/i,
      /^(.*?)\s*[—–\-]{1,2}\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+\d{4}\s*[—–\-]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+\d{4}|Current|Present|Ongoing))\s*$/i,
      /^(.*?),\s*((?:\d{1,2}\/\d{4})\s*[—–\-]\s*(?:\d{1,2}\/\d{4}|Current|Present|Ongoing))\s*$/i,
    ];
    for (const re of patterns) {
      const m = text.match(re);
      if (m) return { left: m[1].trim(), date: m[2].trim() };
    }
    return null;
  };

  /* # Detect contact line */
  const isContactLine = (t: string) =>
    (t.includes("|") || t.includes("•") || t.includes("·") || t.includes(" - ")) &&
    (t.includes("@") || /\+?\d[\d\s()\-]{7,}/.test(t));

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      continue;
    }

    /* # H2: section header */
    if (trimmed.startsWith("## ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      seenSection = true;
      htmlParts.push(`<h2>${trimmed.slice(3).replace(/\*\*(.+?)\*\*/g, "$1")}</h2>`);
      continue;
    }

    /* # H1: candidate name */
    if (trimmed.startsWith("# ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push(`<h1>${trimmed.slice(2).replace(/\*\*(.+?)\*\*/g, "$1")}</h1>`);
      continue;
    }

    /* # Contact line before first section — use contact-line class for centering */
    if (!seenSection && isContactLine(trimmed)) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      const content = trimmed
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s|•·,)<]+)/gi, '<a href="$1" style="color:#003399;text-decoration:underline">$1</a>');
      htmlParts.push(`<p class="contact-line">${content}</p>`);
      continue;
    }

    /* # Bold line with date — job title entry */
    if (/^\*\*/.test(trimmed) && splitDate(trimmed.replace(/\*\*/g, ""))) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      const clean = trimmed.replace(/\*\*/g, "");
      const dateInfo = splitDate(clean)!;
      htmlParts.push(`<div class="entry-row"><span><strong>${dateInfo.left}</strong></span><span class="date"><strong>${dateInfo.date}</strong></span></div>`);
      continue;
    }

    /* # Horizontal rule — skip (section headers already styled) */
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      continue;
    }

    /* # Bullet list items */
    if (/^[-*•] /.test(trimmed)) {
      if (!inList) { htmlParts.push("<ul>"); inList = true; }
      const text = trimmed.replace(/^[-*•] /, "");
      const clean = text.replace(/\*\*/g, "");
      const bulletDate = splitDate(clean);
      if (bulletDate) {
        const rawInfo = splitDate(text);
        const leftRaw = rawInfo ? rawInfo.left : bulletDate.left;
        const leftFormatted = leftRaw.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        htmlParts.push(`<li><div class="entry-row"><span>${leftFormatted}</span><span class="date">${bulletDate.date}</span></div></li>`);
      } else {
        const content = text
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
        htmlParts.push(`<li>${content}</li>`);
      }
      continue;
    }

    /* # Numbered list items */
    if (/^\d+\. /.test(trimmed)) {
      if (!inList) { htmlParts.push("<ul>"); inList = true; }
      const content = trimmed.replace(/^\d+\. /, "")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      htmlParts.push(`<li>${content}</li>`);
      continue;
    }

    if (inList) { htmlParts.push("</ul>"); inList = false; }

    /* # Plain line with date — education/cert entry */
    const pClean = trimmed.replace(/\*\*/g, "");
    const pDate = splitDate(pClean);
    if (pDate) {
      htmlParts.push(`<div class="entry-row"><span>${pDate.left}</span><span class="date"><strong>${pDate.date}</strong></span></div>`);
      continue;
    }

    const content = trimmed
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>")
      .replace(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s|•·,)<]+)/gi, '<a href="$1" style="color:#003399;text-decoration:underline">$1</a>');
    htmlParts.push(`<p>${content}</p>`);
  }

  if (inList) htmlParts.push("</ul>");
  return htmlParts.join("\n");
}

/* ---- Render text with inline **bold** to jsPDF ---- */
function renderBoldLine(doc: jsPDF, text: string, x: number, y: number, baseFontSize: number, baseStyle: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  let cx = x;
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      const bold = part.slice(2, -2);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(baseFontSize);
      doc.text(bold, cx, y);
      cx += doc.getTextWidth(bold);
    } else {
      doc.setFont("helvetica", baseStyle);
      doc.setFontSize(baseFontSize);
      doc.text(part, cx, y);
      cx += doc.getTextWidth(part);
    }
  }
}

/* # Render wrapped text with bold support across multiple lines */
function renderWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, fontSize: number, lineHeight: number, pageHeight: number, margin: number): number {
  doc.setFontSize(fontSize);

  if (!text.includes("**")) {
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(text, maxWidth);
    for (const ln of wrapped) {
      if (y > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.text(ln, x, y);
      y += lineHeight;
    }
    return y;
  }

  const chunks: { t: string; b: boolean }[] = [];
  for (const p of text.split(/(\*\*[^*]+\*\*)/g)) {
    if (!p) continue;
    if (p.startsWith("**") && p.endsWith("**")) {
      chunks.push({ t: p.slice(2, -2), b: true });
    } else {
      chunks.push({ t: p, b: false });
    }
  }

  const tokens: { t: string; b: boolean }[] = [];
  for (const c of chunks) {
    for (const w of c.t.split(/( +)/)) {
      if (w) tokens.push({ t: w, b: c.b });
    }
  }

  const lines: { t: string; b: boolean }[][] = [];
  let cur: { t: string; b: boolean }[] = [];
  let lw = 0;

  for (const tok of tokens) {
    doc.setFont("helvetica", tok.b ? "bold" : "normal");
    doc.setFontSize(fontSize);
    const tw = doc.getTextWidth(tok.t);
    if (lw + tw > maxWidth && cur.length > 0 && tok.t.trim()) {
      lines.push(cur);
      cur = [];
      lw = 0;
      if (!tok.t.trim()) continue;
    }
    cur.push(tok);
    lw += tw;
  }
  if (cur.length > 0) lines.push(cur);

  for (const line of lines) {
    if (y > pageHeight - margin) { doc.addPage(); y = margin; }
    let cx = x;
    for (const tok of line) {
      doc.setFont("helvetica", tok.b ? "bold" : "normal");
      doc.setFontSize(fontSize);
      doc.text(tok.t, cx, y);
      cx += doc.getTextWidth(tok.t);
    }
    y += lineHeight;
  }

  return y;
}

/* ---- Strip markdown code fences ---- */
function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:markdown|md|text)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
}

/* ---- Convert contentEditable DOM back to markdown ---- */
function inlineToMd(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const tag = (node as Element).tagName.toLowerCase();
  const inner = Array.from(node.childNodes).map(inlineToMd).join("");
  if (tag === "strong" || tag === "b") return `**${inner}**`;
  if (tag === "em" || tag === "i") return `*${inner}*`;
  if (tag === "code") return `\`${inner}\``;
  if (tag === "br") return "\n";
  return inner;
}

function domToMarkdown(root: HTMLElement): string {
  const lines: string[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = (node.textContent || "").trim();
      if (t) { lines.push(t); lines.push(""); }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (tag === "h1") { lines.push(`# ${inlineToMd(el)}`); lines.push(""); }
    else if (tag === "h2") { lines.push(`## ${inlineToMd(el)}`); lines.push(""); }
    else if (tag === "h3") { lines.push(`### ${inlineToMd(el)}`); lines.push(""); }
    else if (tag === "hr") { lines.push("---"); lines.push(""); }
    else if (tag === "ul") {
      for (const li of Array.from(el.children))
        if (li.tagName.toLowerCase() === "li") lines.push(`- ${inlineToMd(li)}`);
      lines.push("");
    }
    else if (tag === "ol") {
      Array.from(el.children).forEach((li, i) => {
        if (li.tagName.toLowerCase() === "li") lines.push(`${i + 1}. ${inlineToMd(li)}`);
      });
      lines.push("");
    }
    else if (tag === "p") { lines.push(inlineToMd(el)); lines.push(""); }
    else if (tag === "div" || tag === "span" || tag === "section") {
      for (const child of Array.from(el.childNodes)) walk(child);
    }
  }

  for (const child of Array.from(root.childNodes)) walk(child);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/* ---- Props ---- */
interface CountryResumeResultProps {
  result: string;
  country: Country;
  showDownload?: boolean;
  editable?: boolean;
}

/* ---- Main Component ---- */
export default function CountryResumeResult({ result, country, showDownload = true, editable = true }: CountryResumeResultProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedMarkdownState, setEditedMarkdownState] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cleaned = stripCodeFences(result);
  const source = editedMarkdownState ?? cleaned;
  const html = parseCountryMarkdown(source, country);

  const getEditedMarkdown = (): string => {
    if (editing && contentRef.current) return domToMarkdown(contentRef.current);
    return editedMarkdownState ?? cleaned;
  };

  /* # Country-specific file name for downloads */
  const countryLabel = country === "us" ? "US" : country === "uk" ? "UK" : "AU";

  /* ---- Download as PDF with country-specific layout ---- */
  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const { jsPDF: JsPDF } = await import("jspdf");
      const doc = new JsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const mL = 20;
      const mR = 20;
      const mTop = 20;
      const mBot = 18;
      const cW = pageWidth - mL - mR;
      let y = mTop;
      const bSize = 10;
      const bLH = 5;
      let nameRendered = false;
      let contactRendered = false;
      let seenSection = false;

      /* # US centers name, contact, and section headers */
      const centerHeaders = country === "us";
      const centerX = pageWidth / 2;

      const checkPage = (need: number) => {
        if (y + need > pageHeight - mBot) { doc.addPage(); y = mTop; }
      };

      const measureTextHeight = (text: string, maxWidth: number, fontSize: number, lineHeight: number): number => {
        const clean = text.replace(/\*\*/g, "");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(clean, maxWidth);
        return lines.length * lineHeight;
      };

      /* # Filled bullet circle */
      const drawBullet = (bx: number, by: number) => {
        doc.setFillColor(25, 25, 25);
        doc.circle(bx, by - 1, 0.7, "F");
      };

      /* # Contact line detection */
      const isContactLine = (t: string) =>
        (t.includes("|") || t.includes("•") || t.includes("·") || t.includes(" - ")) &&
        (t.includes("@") || /\+?\d[\d\s()\-]{7,}/.test(t));

      /* # Date extraction patterns */
      const DATE_RE = [
        /^(.*?)\s*[—–\-]{1,2}\s*((?:\d{1,2}\/\d{4})\s*[—–\-]\s*(?:\d{1,2}\/\d{4}|Current|Present|Ongoing))\s*$/i,
        /^(.*?)\s*[—–\-]{1,2}\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+\d{4}\s*[—–\-]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+\d{4}|Current|Present|Ongoing))\s*$/i,
        /^(.*?),\s*((?:\d{1,2}\/\d{4})\s*[—–\-]\s*(?:\d{1,2}\/\d{4}|Current|Present|Ongoing))\s*$/i,
      ];
      const extractDate = (text: string): { left: string; date: string } | null => {
        for (const re of DATE_RE) {
          const m = text.match(re);
          if (m) return { left: m[1].trim(), date: m[2].trim() };
        }
        return null;
      };

      const editedMarkdown = getEditedMarkdown();

      /* # Normalize section headers — AI sometimes outputs **Bold** instead of ## Heading */
      const sectionNames = [
        "professional summary", "core skills", "work experience", "education",
        "certifications and trainings", "certifications", "languages",
        "projects", "relevant experience", "volunteer experience",
        "personal statement", "key skills", "education & qualifications",
        "certifications & professional memberships", "hobbies & interests",
        "professional experience", "licences & registrations",
        "professional development", "referees",
      ];
      const normalizeHeaders = (md: string): string => {
        return md.split("\n").map(line => {
          const t = line.trim();
          const boldMatch = t.match(/^\*\*([^*]+)\*\*$/);
          if (boldMatch) {
            const inner = boldMatch[1].trim();
            if (sectionNames.includes(inner.toLowerCase())) return `## ${inner}`;
          }
          if (sectionNames.includes(t.toLowerCase())) return `## ${t}`;
          return line;
        }).join("\n");
      };

      const lines = normalizeHeaders(editedMarkdown).split("\n");

      for (const line of lines) {
        const trimmed = line.trim();
        if (/^```/.test(trimmed)) continue;
        if (!trimmed) { y += 2.5; continue; }
        checkPage(10);

        /* ---- H1: Name ---- */
        if (/^# (?!#)/.test(trimmed)) {
          const text = trimmed.slice(2).replace(/\*\*/g, "");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(24);
          doc.setTextColor(17, 17, 17);
          if (centerHeaders) {
            doc.text(text, centerX, y, { align: "center" });
          } else {
            doc.text(text, mL, y);
          }
          nameRendered = true;
          y += 8;
          continue;
        }

        /* ---- H2: Section headers ---- */
        if (/^## (?!#)/.test(trimmed)) {
          seenSection = true;
          const text = trimmed.slice(3).replace(/\*\*/g, "").toUpperCase();
          y += 5;
          checkPage(30);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(17, 17, 17);
          if (centerHeaders) {
            doc.text(text, centerX, y, { align: "center" });
          } else {
            doc.text(text, mL, y);
          }
          y += 1.8;
          doc.setDrawColor(30, 30, 30);
          doc.setLineWidth(0.5);
          doc.line(mL, y, pageWidth - mR, y);
          y += 5;
          continue;
        }

        /* ---- Bold line with date — job title entry ---- */
        if (/^\*\*/.test(trimmed) && extractDate(trimmed.replace(/\*\*/g, ""))) {
          const clean = trimmed.replace(/\*\*/g, "");
          const boldHeight = measureTextHeight(clean, cW * 0.65, 10.5, 5.5) + 4;
          y += 2;
          checkPage(Math.max(boldHeight, 16));
          doc.setFontSize(10.5);
          doc.setTextColor(17, 17, 17);

          const dateInfo = extractDate(clean)!;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          const dateW = doc.getTextWidth(dateInfo.date);
          const maxLeftW = cW - dateW - 4;

          doc.text(dateInfo.date, pageWidth - mR, y, { align: "right" });
          y = renderWrappedText(doc, `**${dateInfo.left}**`, mL, y, maxLeftW, 10.5, 5.5, pageHeight, mTop);
          continue;
        }

        /* ---- H3: Job/education entries ---- */
        if (/^### /.test(trimmed)) {
          const raw = trimmed.slice(4);
          const clean = raw.replace(/\*\*/g, "");
          const h3Height = measureTextHeight(clean, cW * 0.65, 10.5, 5.5) + 4;
          y += 2;
          checkPage(Math.max(h3Height, 16));
          doc.setFontSize(10.5);
          doc.setTextColor(17, 17, 17);

          const dateInfo = extractDate(clean);
          if (dateInfo) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            const dateW = doc.getTextWidth(dateInfo.date);
            const maxLeftW = cW - dateW - 4;
            doc.text(dateInfo.date, pageWidth - mR, y, { align: "right" });
            y = renderWrappedText(doc, raw.match(/^(.*?)(?:\s*[—–\-]{1,2}\s*\d|,\s*\d{1,2}\/\d{4})/)?.[1]?.trim() || dateInfo.left, mL, y, maxLeftW, 10.5, 5.5, pageHeight, mTop);
          } else {
            renderBoldLine(doc, raw, mL, y, 10.5, "bold");
            y += 5.5;
          }
          continue;
        }

        /* ---- Horizontal rule — skip ---- */
        if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
          continue;
        }

        /* ---- Auto-detect name: first plain text before any section ---- */
        if (!seenSection && !nameRendered && !/^[-*•\d#]/.test(trimmed) && !isContactLine(trimmed)) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(24);
          doc.setTextColor(17, 17, 17);
          const nameText = trimmed.replace(/\*\*/g, "");
          if (centerHeaders) {
            doc.text(nameText, centerX, y, { align: "center" });
          } else {
            doc.text(nameText, mL, y);
          }
          nameRendered = true;
          y += 8;
          continue;
        }

        /* ---- Auto-detect contact line ---- */
        if (!seenSection && !contactRendered && isContactLine(trimmed)) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(25, 25, 25);
          const contactText = trimmed.replace(/\*\*/g, "");
          const linkedinMatch = contactText.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s|•·,)]+)/i);

          if (centerHeaders) {
            /* # For centered contact, render the full line centered */
            if (linkedinMatch) {
              const url = linkedinMatch[1];
              const fullText = contactText;
              const idx = fullText.indexOf(url);
              const before = fullText.slice(0, idx);
              const after = fullText.slice(idx + url.length);
              const totalWidth = doc.getTextWidth(fullText);
              let cx = centerX - totalWidth / 2;
              if (before) { doc.text(before, cx, y); cx += doc.getTextWidth(before); }
              doc.setTextColor(0, 51, 153);
              doc.textWithLink(url, cx, y, { url });
              cx += doc.getTextWidth(url);
              doc.setTextColor(25, 25, 25);
              if (after.trim()) { doc.text(after, cx, y); }
            } else {
              doc.text(contactText, centerX, y, { align: "center" });
            }
          } else {
            if (linkedinMatch) {
              const url = linkedinMatch[1];
              const idx = contactText.indexOf(url);
              const before = contactText.slice(0, idx);
              const after = contactText.slice(idx + url.length);
              let cx = mL;
              if (before) { doc.text(before, cx, y); cx += doc.getTextWidth(before); }
              doc.setTextColor(0, 51, 153);
              doc.textWithLink(url, cx, y, { url });
              cx += doc.getTextWidth(url);
              doc.setTextColor(25, 25, 25);
              if (after.trim()) { doc.text(after, cx, y); }
            } else {
              doc.text(contactText, mL, y);
            }
          }
          contactRendered = true;
          y += 6;
          continue;
        }

        /* ---- Bullet list items ---- */
        if (/^[-*•]\s/.test(trimmed)) {
          const text = trimmed.replace(/^[-*•]\s+/, "");
          const clean = text.replace(/\*\*/g, "");
          doc.setFontSize(bSize);
          doc.setTextColor(25, 25, 25);

          const textX = mL + 8;
          const textW = cW - 8;

          const bulletHeight = measureTextHeight(clean, textW, bSize, bLH);
          checkPage(bulletHeight);

          const bulletDate = extractDate(clean);
          if (bulletDate) {
            drawBullet(mL + 4, y);
            const rawMatch = text.match(/^(.*?)(?:\s*[—–\-]{1,2}\s*\d|,\s*\d{1,2}\/\d{4})/);
            const leftRaw = rawMatch ? rawMatch[1].trim() : bulletDate.left;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(bSize);
            const dateW = doc.getTextWidth(bulletDate.date);
            const maxBulletLeftW = textW - dateW - 4;
            doc.text(bulletDate.date, pageWidth - mR, y, { align: "right" });
            y = renderWrappedText(doc, leftRaw, textX, y, maxBulletLeftW, bSize, bLH, pageHeight, mTop);
          } else {
            drawBullet(mL + 4, y);
            doc.setFont("helvetica", "normal");
            y = renderWrappedText(doc, text, textX, y, textW, bSize, bLH, pageHeight, mTop);
          }
          continue;
        }

        /* ---- Numbered list items ---- */
        if (/^\d+\. /.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\. (.+)/);
          if (match) {
            doc.setFontSize(bSize);
            doc.setTextColor(25, 25, 25);
            doc.setFont("helvetica", "normal");
            doc.text(`${match[1]}.`, mL + 1, y);
            y = renderWrappedText(doc, match[2], mL + 7, y, cW - 7, bSize, bLH, pageHeight, mTop);
          }
          continue;
        }

        /* ---- Plain line with date ---- */
        const plainClean = trimmed.replace(/\*\*/g, "");
        const plainDate = extractDate(plainClean);
        if (plainDate) {
          const plainHeight = measureTextHeight(plainClean, cW * 0.65, 10.5, 5.5) + 4;
          y += 2;
          checkPage(Math.max(plainHeight, 12));
          doc.setFontSize(10.5);
          doc.setTextColor(17, 17, 17);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          const dateW = doc.getTextWidth(plainDate.date);
          const maxLeftW = cW - dateW - 4;
          doc.text(plainDate.date, pageWidth - mR, y, { align: "right" });
          doc.setFont("helvetica", "normal");
          y = renderWrappedText(doc, plainDate.left, mL, y, maxLeftW, 10.5, 5.5, pageHeight, mTop);
          continue;
        }

        /* ---- Regular paragraph ---- */
        doc.setTextColor(25, 25, 25);
        y = renderWrappedText(doc, trimmed, mL, y, cW, bSize, bLH, pageHeight, mTop);
        y += 1;
      }

      doc.save(`resume-${countryLabel.toLowerCase()}-jobpilot.pdf`);
    } catch {
      /* # Fallback: open print dialog with styled HTML */
      const downloadHTML = markdownToDownloadHTML(getEditedMarkdown(), country);
      const styles = getDownloadStyles(country);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`<!DOCTYPE html><html><head><title>Resume - JobPilot AI</title><style>${styles}</style></head><body>${downloadHTML}</body></html>`);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 300);
      }
    } finally {
      setPdfLoading(false);
    }
  };

  /* ---- Download as Word ---- */
  const downloadWord = () => {
    const downloadHTML = markdownToDownloadHTML(getEditedMarkdown(), country);
    const styles = getDownloadStyles(country);
    const wordContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>${styles}</style></head><body>${downloadHTML}</body></html>`;
    const blob = new Blob([wordContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-${countryLabel.toLowerCase()}-jobpilot.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      {/* # Header with action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="text-xl font-bold glow-text-subtle">AI Result — {countryLabel} Resume</h3>
        <div className="flex flex-wrap gap-2">
          {editable && (
            <button
              onClick={() => {
                setEditing((prev) => {
                  if (prev && contentRef.current) {
                    setEditedMarkdownState(domToMarkdown(contentRef.current));
                    contentRef.current.blur();
                  }
                  if (!prev && contentRef.current) contentRef.current.focus();
                  return !prev;
                });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${editing ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-space-600 border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30"}`}
            >
              {editing ? "Done Editing" : "Edit Text"}
            </button>
          )}
          <button
            onClick={() => navigator.clipboard.writeText(getEditedMarkdown())}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-colors"
          >
            Copy Text
          </button>
          {showDownload && (
            <>
              <button
                onClick={downloadWord}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-colors"
              >
                Download Word
              </button>
              <button
                onClick={downloadPDF}
                disabled={pdfLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light hover:text-white hover:bg-brand-indigo/30 transition-colors disabled:opacity-50"
              >
                {pdfLoading ? "Generating PDF..." : "Download PDF"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* # Rendered content */}
      <div
        key={source}
        ref={contentRef}
        contentEditable={editable && editing}
        suppressContentEditableWarning
        className={`p-6 sm:p-8 rounded-xl bg-space-700/80 border overflow-x-auto transition-colors ${editing ? "border-emerald-500/40 ring-1 ring-emerald-500/20 cursor-text" : "border-card-border"}`}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      />
      {editing && <p className="mt-2 text-xs text-emerald-400/70 text-right">Editing mode — click &quot;Done Editing&quot; when finished</p>}

      {showDownload && (
        <p className="mt-4 text-sm text-text-muted text-center">
          Use the buttons above to download your result as a Word document or PDF.
        </p>
      )}

      <AiDisclosure />
    </div>
  );
}
