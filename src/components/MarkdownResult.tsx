/* ============================================================
   MARKDOWN RESULT - Renders AI output as formatted HTML
   ============================================================
   Custom markdown-to-HTML renderer that handles the common
   markdown patterns from Gemini AI responses: headings, bold,
   italic, bullet lists, numbered lists, and horizontal rules.
   No external dependencies — works reliably on all platforms.
   ============================================================ */

"use client";

import { useState } from "react";
import type { jsPDF } from "jspdf";
import AiDisclosure from "./AiDisclosure";

/* ---- Escape HTML to prevent XSS ---- */
/* Strips any raw HTML tags from AI output before we add our own safe markup */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ---- Convert a single line of markdown to HTML ---- */
function processInline(text: string): string {
  /* Escape raw HTML first, then apply markdown formatting */
  const safe = escapeHtml(text);
  return safe
    /* Bold: **text** */
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    /* Italic: *text* (but not inside bold) */
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="text-gray-300">$1</em>')
    /* Inline code: `code` */
    .replace(/`([^`]+)`/g, '<code class="bg-space-600 px-1.5 py-0.5 rounded text-brand-light text-[13px]">$1</code>');
}

/* ---- Detect analysis-specific section headings for card styling ---- */
function isAnalysisHeading(text: string): boolean {
  const h = text.toLowerCase();
  return (
    h.includes("strength") ||
    h.includes("weakness") ||
    h.includes("missing keyword") ||
    h.includes("formatting issue") ||
    h.includes("formatting") ||
    (h.includes("priority") && h.includes("action")) ||
    h.includes("matching skills") ||
    h.includes("missing skills") ||
    h.includes("experience gap") ||
    h.includes("recommendation") ||
    h.includes("action plan") ||
    h.includes("quick wins") ||
    h.includes("content pillar") ||
    h.includes("post template") ||
    h.includes("posting schedule") ||
    h.includes("engagement") ||
    h.includes("hashtag") ||
    h.includes("growth")
  );
}

/* ---- Get color scheme for analysis section cards ---- */
function getAnalysisStyle(text: string): { border: string; headerBg: string; headerText: string } {
  const h = text.toLowerCase();
  if (h.includes("strength") || h.includes("matching skills")) return { border: "border-l-emerald-500", headerBg: "bg-emerald-500/10", headerText: "text-emerald-400" };
  if (h.includes("weakness") || h.includes("experience gap")) return { border: "border-l-red-400", headerBg: "bg-red-400/10", headerText: "text-red-400" };
  if (h.includes("missing keyword") || h.includes("missing skills")) return { border: "border-l-violet-400", headerBg: "bg-violet-400/10", headerText: "text-violet-400" };
  if (h.includes("formatting")) return { border: "border-l-amber-400", headerBg: "bg-amber-400/10", headerText: "text-amber-400" };
  if (h.includes("recommendation") || h.includes("action plan")) return { border: "border-l-sky-400", headerBg: "bg-sky-400/10", headerText: "text-sky-400" };
  if (h.includes("quick wins")) return { border: "border-l-teal-400", headerBg: "bg-teal-400/10", headerText: "text-teal-400" };
  return { border: "border-l-sky-400", headerBg: "bg-sky-400/10", headerText: "text-sky-400" };
}

/* ---- Parse markdown string into React-safe HTML ---- */
/* Enhanced with visual score cards, color-coded analysis sections, and better spacing */
function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inList = false;
  let listType = "";
  let inSectionCard = false;

  const closeLists = () => {
    if (inList) {
      htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
    }
  };

  const closeSectionCard = () => {
    if (inSectionCard) {
      closeLists();
      htmlParts.push("</div></div>");
      inSectionCard = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    /* Skip empty lines but close any open list */
    if (!trimmed) {
      if (inList) closeLists();
      continue;
    }

    /* Horizontal rule: --- or ___ or *** */
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      closeLists();
      if (!inSectionCard) {
        htmlParts.push(`<hr class="border-card-border my-6" />`);
      }
      continue;
    }

    /* H3: ### heading */
    if (trimmed.startsWith("### ")) {
      closeLists();
      const h3Text = trimmed.slice(4);
      const qMatch = h3Text.match(/^Question\s+(\d+)/i);
      if (qMatch) {
        htmlParts.push(`<h3 class="text-lg font-bold text-white mt-7 mb-3 flex items-center gap-3"><span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light text-sm font-bold shrink-0">${qMatch[1]}</span>${processInline(h3Text)}</h3>`);
      } else {
        htmlParts.push(`<h3 class="text-lg font-bold text-white mt-6 mb-3">${processInline(h3Text)}</h3>`);
      }
      continue;
    }

    /* H2: ## heading — with ATS score detection and analysis section cards */
    if (trimmed.startsWith("## ")) {
      closeSectionCard();
      const h2Text = trimmed.slice(3);

      /* ATS Score: render as visual gauge card */
      const scoreMatch = h2Text.match(/ATS\s+Score[:\s]*(\d+)\s*\/\s*(\d+)/i);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1]);
        const total = parseInt(scoreMatch[2]);
        const pct = Math.round((score / total) * 100);

        let ringCls: string, txtCls: string, badgeCls: string, barCls: string, label: string;
        if (pct >= 75) {
          ringCls = "border-emerald-400/50"; txtCls = "text-emerald-400";
          badgeCls = "bg-emerald-400/20 text-emerald-400 border-emerald-400/30";
          barCls = "from-emerald-500 to-emerald-400"; label = "Strong";
        } else if (pct >= 50) {
          ringCls = "border-amber-400/50"; txtCls = "text-amber-400";
          badgeCls = "bg-amber-400/20 text-amber-400 border-amber-400/30";
          barCls = "from-amber-500 to-amber-400"; label = "Needs Work";
        } else {
          ringCls = "border-red-400/50"; txtCls = "text-red-400";
          badgeCls = "bg-red-400/20 text-red-400 border-red-400/30";
          barCls = "from-red-500 to-red-400"; label = "Critical";
        }

        htmlParts.push(
          `<div class="mb-8 p-6 rounded-2xl bg-space-600/50 border border-card-border">` +
            `<div class="flex items-center gap-6 mb-4">` +
              `<div class="flex items-center justify-center w-20 h-20 rounded-full border-4 ${ringCls} shrink-0">` +
                `<span class="text-3xl font-bold ${txtCls}">${score}</span>` +
              `</div>` +
              `<div>` +
                `<h2 class="text-xl font-bold text-white mb-1.5">ATS Compatibility Score</h2>` +
                `<span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeCls} border">${label} — ${score}/${total}</span>` +
              `</div>` +
            `</div>` +
            `<div class="w-full h-3 rounded-full bg-space-700 overflow-hidden">` +
              `<div class="h-full rounded-full bg-gradient-to-r ${barCls}" style="width: ${pct}%"></div>` +
            `</div>` +
          `</div>`
        );
        continue;
      }

      /* Analysis section heading — wrap content in a colored card */
      if (isAnalysisHeading(h2Text)) {
        const style = getAnalysisStyle(h2Text);
        htmlParts.push(
          `<div class="mb-6 rounded-xl border-l-4 ${style.border} border border-card-border bg-space-600/30 overflow-hidden">` +
            `<div class="px-5 py-3 ${style.headerBg} border-b border-card-border/50">` +
              `<h2 class="text-sm font-bold ${style.headerText} uppercase tracking-wider">${processInline(h2Text)}</h2>` +
            `</div>` +
            `<div class="px-5 py-4">`
        );
        inSectionCard = true;
        continue;
      }

      /* Default H2 styling (resume outputs, etc.) */
      htmlParts.push(`<h2 class="text-xl font-bold text-white mt-8 mb-4 pb-2 border-b border-card-border uppercase tracking-wide">${processInline(h2Text)}</h2>`);
      continue;
    }

    /* H1: # heading */
    if (trimmed.startsWith("# ")) {
      closeSectionCard();
      htmlParts.push(`<h1 class="text-2xl font-bold text-white mb-2 mt-4">${processInline(trimmed.slice(2))}</h1>`);
      continue;
    }

    /* Unordered list items: - item, * item, • item */
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

    /* Ordered list items: 1. item, 2. item */
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

    /* Regular paragraph */
    if (inList) closeLists();

    if (trimmed.startsWith("**What they’re looking for:**") || trimmed.startsWith("**What they’re looking for:**")) {
      htmlParts.push(`<div class="mt-3 mb-1 pl-5 py-3 border-l-2 border-brand-indigo/40 bg-brand-indigo/5 rounded-r-lg"><p class="text-[15px] text-gray-200 leading-relaxed m-0">${processInline(trimmed)}</p></div>`);
      continue;
    }
    if (trimmed.startsWith("**How to prepare:**")) {
      htmlParts.push(`<div class="mb-3 pl-5 py-3 border-l-2 border-emerald-500/40 bg-emerald-500/5 rounded-r-lg"><p class="text-[15px] text-gray-200 leading-relaxed m-0">${processInline(trimmed)}</p></div>`);
      continue;
    }

    htmlParts.push(`<p class="text-[15px] text-gray-200 leading-relaxed mb-3">${processInline(trimmed)}</p>`);
  }

  /* Close any open containers at the end */
  closeSectionCard();

  return htmlParts.join("\n");
}

/* ---- Professional download styles for PDF/Word exports ---- */
const DOWNLOAD_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px 36px; color: #1a1a1a; line-height: 1.45; font-size: 13px; }
  h1 { font-size: 26px; font-weight: 700; margin: 0 0 2px 0; color: #111; }
  h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #111; padding-bottom: 2px; margin: 16px 0 8px 0; color: #111; }
  h3, .entry-row { font-size: 13px; font-weight: 700; margin: 8px 0 2px 0; color: #111; }
  .entry-row { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-row .date { font-weight: 700; white-space: nowrap; margin-left: 12px; }
  p { margin: 0 0 6px 0; font-size: 12.5px; color: #333; }
  .contact-line { font-size: 12px; color: #444; margin-bottom: 10px; }
  ul, ol { padding-left: 20px; margin: 2px 0 8px 0; list-style-type: disc; }
  li { margin-bottom: 2px; font-size: 12.5px; color: #333; line-height: 1.45; }
  strong { color: #111; font-weight: 700; }
  em { font-style: italic; }
  hr { border: none; border-top: 1px solid #ddd; margin: 10px 0; }
  @media print { body { padding: 20px; } }
`;

/* ---- Convert markdown to structured HTML for downloads ---- */
/* Splits H3 lines into left title + right-aligned date, matching reference resume layout */
function markdownToDownloadHTML(md: string): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inList = false;

  /* Extract date range from end: "... — MM/YYYY – MM/YYYY" */
  const splitDate = (text: string): { left: string; date: string } | null => {
    const m = text.match(/^(.*?)\s*[—–\-]\s*((?:\d{1,2}\/\d{4})\s*[—–\-]\s*(?:\d{1,2}\/\d{4}|Current|Present|Ongoing))\s*$/i);
    return m ? { left: m[1].trim(), date: m[2].trim() } : null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      continue;
    }

    if (trimmed.startsWith("### ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      const raw = trimmed.slice(4);
      const clean = raw.replace(/\*\*/g, "");
      const dateInfo = splitDate(clean);
      if (dateInfo) {
        const leftHtml = raw.slice(0, raw.replace(/\*\*/g, "").indexOf(dateInfo.left) + dateInfo.left.length + (raw.length - clean.length))
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        const rawInfo = splitDate(raw);
        const leftRaw = rawInfo ? rawInfo.left : dateInfo.left;
        const leftFormatted = leftRaw.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        htmlParts.push(`<div class="entry-row"><span>${leftFormatted}</span><span class="date">${dateInfo.date}</span></div>`);
      } else {
        htmlParts.push(`<h3>${raw.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</h3>`);
      }
      continue;
    }
    if (trimmed.startsWith("## ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push(`<h2>${trimmed.slice(3).replace(/\*\*(.+?)\*\*/g, "$1")}</h2>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push(`<h1>${trimmed.slice(2).replace(/\*\*(.+?)\*\*/g, "$1")}</h1>`);
      continue;
    }

    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push("<hr>");
      continue;
    }

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

    if (/^\d+\. /.test(trimmed)) {
      if (!inList) { htmlParts.push("<ul>"); inList = true; }
      const content = trimmed.replace(/^\d+\. /, "")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      htmlParts.push(`<li>${content}</li>`);
      continue;
    }

    if (inList) { htmlParts.push("</ul>"); inList = false; }
    const content = trimmed
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
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

/* Render wrapped text with proper bold support across multiple lines.
   Splits text into word-level tokens, measures each in its correct font
   (bold vs normal), and breaks lines when they exceed maxWidth. */
function renderWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, fontSize: number, lineHeight: number, pageHeight: number, margin: number): number {
  doc.setFontSize(fontSize);

  /* Fast path: no bold markers — use built-in wrapping */
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

  /* Parse **bold** markers into typed chunks */
  const chunks: { t: string; b: boolean }[] = [];
  for (const p of text.split(/(\*\*[^*]+\*\*)/g)) {
    if (!p) continue;
    if (p.startsWith("**") && p.endsWith("**")) {
      chunks.push({ t: p.slice(2, -2), b: true });
    } else {
      chunks.push({ t: p, b: false });
    }
  }

  /* Flatten to word-level tokens (spaces are separate so we can measure them) */
  const tokens: { t: string; b: boolean }[] = [];
  for (const c of chunks) {
    for (const w of c.t.split(/( +)/)) {
      if (w) tokens.push({ t: w, b: c.b });
    }
  }

  /* Build wrapped lines that respect maxWidth */
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

  /* Render each line token by token with correct font */
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

/* ---- Strip markdown code fences that Gemini sometimes wraps responses in ---- */
function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:markdown|md|text)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
}

/* ---- Props for the component ---- */
interface MarkdownResultProps {
  result: string;
  showDownload?: boolean;
}

/* ---- Main Component ---- */
export default function MarkdownResult({ result, showDownload = true }: MarkdownResultProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const cleaned = stripCodeFences(result);
  const html = parseMarkdown(cleaned);

  /* Download as PDF — matches reference resume layout exactly */
  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const { jsPDF: JsPDF } = await import("jspdf");
      const doc = new JsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const mL = 20;
      const mR = 20;
      const mTop = 18;
      const mBot = 16;
      const cW = pageWidth - mL - mR;
      let y = mTop;
      const bSize = 9.5;
      const bLH = 4.8;
      let nameRendered = false;
      let contactRendered = false;
      let seenSection = false;

      const checkPage = (need: number) => {
        if (y + need > pageHeight - mBot) { doc.addPage(); y = mTop; }
      };

      /* Draw a filled bullet circle (since jsPDF helvetica lacks ● glyph) */
      const drawBullet = (bx: number, by: number) => {
        doc.setFillColor(40, 40, 40);
        doc.circle(bx, by - 1, 0.7, "F");
      };

      /* Detect if a line looks like contact info: has separators + email or phone */
      const isContactLine = (t: string) =>
        (t.includes("|") || t.includes("•") || t.includes("·") || t.includes(" - ")) &&
        (t.includes("@") || /\+?\d[\d\s()\-]{7,}/.test(t));

      /* Extract date range from end of text. Handles multiple separator and date styles:
         "... — 11/2024 – Current", "... — Nov 2024 – Jan 2025", "... — 2024 – Present" */
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

      const lines = cleaned.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();
        if (/^```/.test(trimmed)) continue;
        if (!trimmed) { y += 2.5; continue; }
        checkPage(10);

        /* ---- H1: Name — large bold, left-aligned ---- */
        if (/^# (?!#)/.test(trimmed)) {
          const text = trimmed.slice(2).replace(/\*\*/g, "");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(24);
          doc.setTextColor(17, 17, 17);
          doc.text(text, mL, y);
          nameRendered = true;
          y += 8;
          continue;
        }

        /* ---- H2: Section headers — bold uppercase with full-width underline ---- */
        if (/^## (?!#)/.test(trimmed)) {
          seenSection = true;
          const text = trimmed.slice(3).replace(/\*\*/g, "").toUpperCase();
          y += 5;
          checkPage(12);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(17, 17, 17);
          doc.text(text, mL, y);
          y += 1.8;
          doc.setDrawColor(30, 30, 30);
          doc.setLineWidth(0.5);
          doc.line(mL, y, pageWidth - mR, y);
          y += 5;
          continue;
        }

        /* ---- H3: Job/education entries — title+company LEFT, dates RIGHT ---- */
        if (/^### /.test(trimmed)) {
          const raw = trimmed.slice(4);
          const clean = raw.replace(/\*\*/g, "");
          y += 2;
          checkPage(10);
          doc.setFontSize(10.5);
          doc.setTextColor(17, 17, 17);

          const dateInfo = extractDate(clean);
          if (dateInfo) {
            const rawMatch = raw.match(/^(.*?)(?:\s*[—–\-]{1,2}\s*\d|,\s*\d{1,2}\/\d{4})/);
            const leftRaw = rawMatch ? rawMatch[1].trim() : dateInfo.left;
            renderBoldLine(doc, leftRaw, mL, y, 10.5, "normal");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            doc.text(dateInfo.date, pageWidth - mR, y, { align: "right" });
          } else {
            renderBoldLine(doc, raw, mL, y, 10.5, "bold");
          }
          y += 5.5;
          continue;
        }

        /* ---- Horizontal rule ---- */
        if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
          doc.setDrawColor(180, 180, 180);
          doc.setLineWidth(0.2);
          doc.line(mL, y, pageWidth - mR, y);
          y += 4;
          continue;
        }

        /* ---- Auto-detect name: first plain text line before any section heading ---- */
        if (!seenSection && !nameRendered && !/^[-*•\d#]/.test(trimmed) && !isContactLine(trimmed)) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(24);
          doc.setTextColor(17, 17, 17);
          doc.text(trimmed.replace(/\*\*/g, ""), mL, y);
          nameRendered = true;
          y += 8;
          continue;
        }

        /* ---- Auto-detect contact: line with separators + email/phone before sections ---- */
        if (!seenSection && !contactRendered && isContactLine(trimmed)) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.text(trimmed.replace(/\*\*/g, ""), mL, y);
          contactRendered = true;
          y += 6;
          continue;
        }

        /* ---- Bullet list items — filled circle + hanging indent ---- */
        if (/^[-*•] /.test(trimmed)) {
          const text = trimmed.replace(/^[-*•] /, "");
          const clean = text.replace(/\*\*/g, "");
          doc.setFontSize(bSize);
          doc.setTextColor(40, 40, 40);

          const textX = mL + 8;
          const textW = cW - 8;

          const bulletDate = extractDate(clean);
          if (bulletDate) {
            drawBullet(mL + 4, y);
            const rawMatch = text.match(/^(.*?)(?:\s*[—–\-]{1,2}\s*\d|,\s*\d{1,2}\/\d{4})/);
            const leftRaw = rawMatch ? rawMatch[1].trim() : bulletDate.left;
            renderBoldLine(doc, leftRaw, textX, y, bSize, "normal");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(bSize);
            doc.text(bulletDate.date, pageWidth - mR, y, { align: "right" });
            y += bLH;
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
            doc.setTextColor(40, 40, 40);
            doc.setFont("helvetica", "normal");
            doc.text(`${match[1]}.`, mL + 1, y);
            y = renderWrappedText(doc, match[2], mL + 7, y, cW - 7, bSize, bLH, pageHeight, mTop);
          }
          continue;
        }

        /* ---- Regular paragraph ---- */
        doc.setTextColor(40, 40, 40);
        y = renderWrappedText(doc, trimmed, mL, y, cW, bSize, bLH, pageHeight, mTop);
        y += 1;
      }

      doc.save("resume-jobpilot.pdf");
    } catch {
      /* Fallback: open print dialog with styled HTML */
      const downloadHTML = markdownToDownloadHTML(cleaned);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`<!DOCTYPE html><html><head><title>Resume - JobPilot AI</title><style>${DOWNLOAD_STYLES}</style></head><body>${downloadHTML}</body></html>`);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 300);
      }
    } finally {
      setPdfLoading(false);
    }
  };

  /* Download as Word — creates .doc blob */
  const downloadWord = () => {
    const downloadHTML = markdownToDownloadHTML(cleaned);
    const wordContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>${DOWNLOAD_STYLES}</style></head><body>${downloadHTML}</body></html>`;
    const blob = new Blob([wordContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-jobpilot.doc";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      {/* Header with action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="text-xl font-bold glow-text-subtle">AI Result</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(cleaned)}
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

      {/* Rendered markdown content */}
      <div
        className="p-6 sm:p-8 rounded-xl bg-space-700/80 border border-card-border overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {showDownload && (
        <p className="mt-4 text-sm text-text-muted text-center">
          Use the buttons above to download your result as a Word document or PDF.
        </p>
      )}

      {/* AI-generated content disclosure */}
      <AiDisclosure />
    </div>
  );
}
