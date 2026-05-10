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
import { jsPDF } from "jspdf";

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
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="text-gray-400">$1</em>')
    /* Inline code: `code` */
    .replace(/`([^`]+)`/g, '<code class="bg-space-600 px-1.5 py-0.5 rounded text-brand-light text-[13px]">$1</code>');
}

/* ---- Parse markdown string into React-safe HTML ---- */
function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inList = false;
  let listType = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    /* Skip empty lines but close any open list */
    if (!trimmed) {
      if (inList) {
        htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
      }
      continue;
    }

    /* Horizontal rule: --- or ___ or *** */
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      if (inList) { htmlParts.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
      htmlParts.push('<hr class="border-card-border my-5" />');
      continue;
    }

    /* Headings: # ## ### */
    if (trimmed.startsWith("# ")) {
      if (inList) { htmlParts.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
      htmlParts.push(`<h1 class="text-2xl font-bold text-white mb-2 mt-4">${processInline(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      if (inList) { htmlParts.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
      htmlParts.push(`<h2 class="text-lg font-bold text-white mt-7 mb-3 pb-2 border-b border-card-border uppercase tracking-wide">${processInline(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      if (inList) { htmlParts.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
      htmlParts.push(`<h3 class="text-base font-bold text-white mt-5 mb-2">${processInline(trimmed.slice(4))}</h3>`);
      continue;
    }

    /* Unordered list items: - item, * item, • item */
    if (/^[-*•] /.test(trimmed)) {
      if (!inList || listType !== "ul") {
        if (inList) htmlParts.push("</ol>");
        htmlParts.push('<ul class="list-disc list-outside ml-5 space-y-1.5 mb-4">');
        inList = true;
        listType = "ul";
      }
      htmlParts.push(`<li class="text-[15px] text-gray-300 leading-relaxed">${processInline(trimmed.replace(/^[-*•] /, ""))}</li>`);
      continue;
    }

    /* Ordered list items: 1. item, 2. item */
    if (/^\d+\. /.test(trimmed)) {
      if (!inList || listType !== "ol") {
        if (inList) htmlParts.push("</ul>");
        htmlParts.push('<ol class="list-decimal list-outside ml-5 space-y-1.5 mb-4">');
        inList = true;
        listType = "ol";
      }
      htmlParts.push(`<li class="text-[15px] text-gray-300 leading-relaxed">${processInline(trimmed.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }

    /* Regular paragraph */
    if (inList) { htmlParts.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; }
    htmlParts.push(`<p class="text-[15px] text-gray-300 leading-relaxed mb-3">${processInline(trimmed)}</p>`);
  }

  /* Close any open list at the end */
  if (inList) {
    htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
  }

  return htmlParts.join("\n");
}

/* ---- Professional download styles for PDF/Word exports ---- */
const DOWNLOAD_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.55; font-size: 14px; }
  h1 { font-size: 28px; font-weight: 700; margin: 0 0 4px 0; color: #111; }
  h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #111; padding-bottom: 3px; margin: 20px 0 10px 0; color: #111; }
  h3 { font-size: 14px; font-weight: 700; margin: 12px 0 2px 0; color: #111; }
  p { margin: 0 0 8px 0; font-size: 13.5px; color: #333; }
  .contact-line { font-size: 13px; color: #444; margin-bottom: 14px; }
  ul, ol { padding-left: 20px; margin: 4px 0 10px 0; }
  li { margin-bottom: 3px; font-size: 13.5px; color: #333; line-height: 1.5; }
  strong { color: #111; font-weight: 700; }
  em { font-style: italic; }
  hr { border: none; border-top: 1px solid #ddd; margin: 14px 0; }
  @media print { body { padding: 20px; } }
`;

/* ---- Convert markdown to structured HTML for downloads ---- */
function markdownToDownloadHTML(md: string): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      continue;
    }

    if (trimmed.startsWith("### ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push(`<h3>${trimmed.slice(4).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</h3>`);
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
      const content = trimmed.replace(/^[-*•] /, "")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
      htmlParts.push(`<li>${content}</li>`);
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

/* Render wrapped text with bold support, returns new Y position */
function renderWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, fontSize: number, lineHeight: number, pageHeight: number, margin: number): number {
  const plain = text.replace(/\*\*/g, "");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  const wrapped = doc.splitTextToSize(plain, maxWidth);

  for (let i = 0; i < wrapped.length; i++) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    if (i === 0 && text.includes("**")) {
      renderBoldLine(doc, text, x, y, fontSize, "normal");
    } else {
      doc.text(wrapped[i], x, y);
    }
    y += lineHeight;
  }
  return y;
}

/* ---- Props for the component ---- */
interface MarkdownResultProps {
  result: string;
  showDownload?: boolean;
}

/* ---- Main Component ---- */
export default function MarkdownResult({ result, showDownload = true }: MarkdownResultProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const html = parseMarkdown(result);

  /* Download as PDF — uses jsPDF directly, NO html2canvas */
  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;
      const lineSpacing = 5;

      const lines = result.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();

        /* Empty line — small gap */
        if (!trimmed) { y += 3; continue; }

        /* Page break check */
        if (y > pageHeight - margin - 10) {
          doc.addPage();
          y = margin;
        }

        /* --- Headings --- */
        if (trimmed.startsWith("# ") && !trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
          const text = trimmed.slice(2).replace(/\*\*/g, "");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(22);
          doc.setTextColor(17, 17, 17);
          doc.text(text, margin, y);
          y += 9;
          continue;
        }

        if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
          const text = trimmed.slice(3).replace(/\*\*/g, "").toUpperCase();
          y += 5;
          if (y > pageHeight - margin - 10) { doc.addPage(); y = margin; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(17, 17, 17);
          doc.text(text, margin, y);
          y += 1.5;
          doc.setDrawColor(17, 17, 17);
          doc.setLineWidth(0.4);
          doc.line(margin, y, margin + contentWidth, y);
          y += 5;
          continue;
        }

        if (trimmed.startsWith("### ")) {
          const text = trimmed.slice(4).replace(/\*\*/g, "");
          y += 3;
          if (y > pageHeight - margin - 10) { doc.addPage(); y = margin; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(17, 17, 17);
          doc.text(text, margin, y);
          y += 5;
          continue;
        }

        /* --- Horizontal rule --- */
        if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3);
          doc.line(margin, y, margin + contentWidth, y);
          y += 4;
          continue;
        }

        /* --- Bullet list items --- */
        if (/^[-*•] /.test(trimmed)) {
          const text = trimmed.replace(/^[-*•] /, "");
          doc.setFontSize(10.5);
          doc.setTextColor(51, 51, 51);
          doc.setFont("helvetica", "normal");

          /* Bullet character */
          doc.text("•", margin + 2, y);

          /* Wrapped text with bold support */
          const bulletIndent = 8;
          y = renderWrappedText(doc, text, margin + bulletIndent, y, contentWidth - bulletIndent, 10.5, lineSpacing, pageHeight, margin);
          continue;
        }

        /* --- Numbered list items --- */
        if (/^\d+\. /.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\. (.+)/);
          if (match) {
            doc.setFontSize(10.5);
            doc.setTextColor(51, 51, 51);
            doc.setFont("helvetica", "normal");
            doc.text(`${match[1]}.`, margin + 1, y);
            y = renderWrappedText(doc, match[2], margin + 8, y, contentWidth - 8, 10.5, lineSpacing, pageHeight, margin);
          }
          continue;
        }

        /* --- Regular paragraph --- */
        doc.setTextColor(51, 51, 51);
        y = renderWrappedText(doc, trimmed, margin, y, contentWidth, 10.5, lineSpacing, pageHeight, margin);
        y += 1;
      }

      doc.save("resume-jobpilot.pdf");
    } catch {
      /* Fallback: open print dialog with styled HTML */
      const downloadHTML = markdownToDownloadHTML(result);
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
    const downloadHTML = markdownToDownloadHTML(result);
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
            onClick={() => navigator.clipboard.writeText(result)}
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
    </div>
  );
}
