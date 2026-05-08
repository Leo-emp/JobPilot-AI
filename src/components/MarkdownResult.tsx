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

/* ---- Convert a single line of markdown to HTML ---- */
function processInline(text: string): string {
  return text
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
/* Matches the standard resume layout: bold name, contact with pipes, */
/* uppercase section headers with underlines, structured entries */
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
/* Properly wraps consecutive <li> elements in <ul> tags and */
/* converts contact-line paragraphs (with bullet separators) */
function markdownToDownloadHTML(md: string): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    /* Empty line — close any open list, add spacing */
    if (!trimmed) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      continue;
    }

    /* Headings */
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

    /* Horizontal rules */
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      htmlParts.push("<hr>");
      continue;
    }

    /* List items — wrap in <ul> */
    if (/^[-*•] /.test(trimmed)) {
      if (!inList) { htmlParts.push("<ul>"); inList = true; }
      const content = trimmed.replace(/^[-*•] /, "")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
      htmlParts.push(`<li>${content}</li>`);
      continue;
    }

    /* Numbered list items */
    if (/^\d+\. /.test(trimmed)) {
      if (!inList) { htmlParts.push("<ul>"); inList = true; }
      const content = trimmed.replace(/^\d+\. /, "")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      htmlParts.push(`<li>${content}</li>`);
      continue;
    }

    /* Regular paragraphs */
    if (inList) { htmlParts.push("</ul>"); inList = false; }
    const content = trimmed
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
    htmlParts.push(`<p>${content}</p>`);
  }

  if (inList) htmlParts.push("</ul>");
  return htmlParts.join("\n");
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

  /* Download as PDF — uses html2pdf.js from CDN */
  /* html2canvas REQUIRES the element to be fully visible (opacity:1) to */
  /* render content. We show a dark overlay so the user doesn't see the */
  /* render container underneath while html2canvas captures it. */
  const downloadPDF = async () => {
    setPdfLoading(true);
    const overlay = document.createElement("div");
    const container = document.createElement("div");
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

      /* Dark overlay covers the screen so user doesn't see the render container */
      overlay.style.cssText = "position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;";
      overlay.innerHTML = '<div style="color:white;font-size:16px;font-family:system-ui,sans-serif;">Generating PDF…</div>';
      document.body.appendChild(overlay);

      /* Build HTML content for PDF */
      const downloadHTML = markdownToDownloadHTML(result);
      container.innerHTML = downloadHTML;

      /* Apply download styles */
      const styleEl = document.createElement("style");
      styleEl.textContent = DOWNLOAD_STYLES;
      container.prepend(styleEl);

      /* Container is FULLY VISIBLE — html2canvas needs this to capture content. */
      /* It sits behind the overlay (z-index 99999 < 100000) so the user only */
      /* sees the "Generating PDF..." overlay, not the raw HTML. */
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "800px";
      container.style.zIndex = "99999";
      container.style.background = "white";
      container.style.padding = "40px";
      container.style.fontFamily = "'Calibri', 'Segoe UI', Arial, sans-serif";
      container.style.color = "#1a1a1a";
      container.style.lineHeight = "1.55";
      container.style.fontSize = "14px";
      document.body.appendChild(container);

      /* Let the browser paint the container before html2canvas captures it */
      await new Promise(r => setTimeout(r, 300));

      /* Generate and save PDF */
      const html2pdf = (window as unknown as Record<string, unknown>).html2pdf as CallableFunction;
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: "resume-jobpilot.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save();

      document.body.removeChild(container);
      document.body.removeChild(overlay);
    } catch {
      /* Clean up DOM elements on failure */
      if (container.parentNode) document.body.removeChild(container);
      if (overlay.parentNode) document.body.removeChild(overlay);
      /* Fallback to print dialog */
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
