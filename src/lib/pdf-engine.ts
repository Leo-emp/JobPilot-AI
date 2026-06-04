/* ============================================================
   PDF PAGINATION ENGINE — DOM-measured per-page rendering
   ============================================================
   Measures content blocks in the iframe DOM, calculates optimal
   page breaks, then renders each page individually with
   html2canvas for clean, consistent output.
   ============================================================ */

import { PAGE_SIZES, RENDER_SCALE, IFRAME } from "./pdf-config";

interface ContentBlock {
  top: number;
  height: number;
  bottom: number;
  type: string;
}

/* ============================================================
   INJECT PDF BLOCK ATTRIBUTES INTO HTML
   ============================================================
   Adds data-pdf-block markers to semantic elements across all
   template HTML patterns. Handles entries, sections, headings,
   skills, education, etc.
   ============================================================ */
export function injectPdfAttributes(html: string): string {
  let r = html;

  /* # Section wrappers */
  r = r.replace(/class="(section\b[^"]*)"/g, 'class="$1" data-pdf-block="section"');

  /* # Section headings */
  r = r.replace(/<h2(?=[\s>])(?![^>]*data-pdf-block)/g, '<h2 data-pdf-block="heading"');
  r = r.replace(/<h3(?=[\s>])(?![^>]*data-pdf-block)/g, '<h3 data-pdf-block="heading"');

  /* # Work entries — various class patterns across templates */
  r = r.replace(/class="((?:entry|t-entry|exp-entry|entry-block)\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');

  /* # Education rows */
  r = r.replace(/class="(edu-row\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(edu-entry\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');

  /* # Skill groups */
  r = r.replace(/class="(skill-group\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(skills-list\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(skills-wrap\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(skills-cols\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');

  /* # Language lines */
  r = r.replace(/class="(lang-line\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');

  /* # Summary */
  r = r.replace(/class="(summary\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');

  /* # Cert lists */
  r = r.replace(/class="(certs-list\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');

  return r;
}

/* ============================================================
   MEASURE CONTENT BLOCKS FROM IFRAME DOM
   ============================================================ */
export function measureBlocks(iframeDoc: Document): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const els = iframeDoc.querySelectorAll("[data-pdf-block]");

  els.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const top = htmlEl.offsetTop;
    const height = htmlEl.offsetHeight;
    if (height > 0) {
      blocks.push({
        top,
        height,
        bottom: top + height,
        type: htmlEl.dataset.pdfBlock || "entry",
      });
    }
  });

  return blocks.sort((a, b) => a.top - b.top);
}

/* ============================================================
   CALCULATE PAGE BREAK POSITIONS
   ============================================================
   Returns an array of Y positions (in CSS px) where pages break.
   Uses block boundaries to avoid splitting entries.
   ============================================================ */
export function calculateBreakPoints(
  totalHeight: number,
  blocks: ContentBlock[],
  pageContentHeight: number
): number[] {
  const breaks: number[] = [];
  let cursor = 0;

  while (cursor + pageContentHeight < totalHeight) {
    const idealBreak = cursor + pageContentHeight;

    /* # Find blocks that straddle the ideal break point */
    const straddlers = blocks.filter(
      b => b.top < idealBreak && b.bottom > idealBreak && b.top > cursor
    );

    let breakAt = idealBreak;

    if (straddlers.length > 0) {
      const block = straddlers[0];

      /* # If this block would fit entirely on the next page, move it there */
      if (block.height <= pageContentHeight) {
        breakAt = block.top;
      }
      /* # If the block is huge (taller than a page), break at the ideal point */
    }

    /* # Check if a heading is the last thing before the break */
    const nearBreak = blocks.filter(
      b => b.type === "heading" && b.bottom <= breakAt && b.bottom > breakAt - 30 && b.top > cursor
    );
    if (nearBreak.length > 0) {
      breakAt = nearBreak[0].top;
    }

    /* # Ensure progress */
    if (breakAt <= cursor + 20) {
      breakAt = idealBreak;
    }

    breaks.push(breakAt);
    cursor = breakAt;
  }

  return breaks;
}

/* ============================================================
   RENDER PDF WITH PER-PAGE html2canvas
   ============================================================
   For each page, scrolls the iframe to the correct position
   and renders only the visible portion with html2canvas. This
   prevents content clipping at page boundaries.
   ============================================================ */
export async function renderTemplatePdf(
  iframeEl: HTMLIFrameElement,
  blocks: ContentBlock[],
  totalHeight: number,
  pdf: InstanceType<typeof import("jspdf").jsPDF>,
  html2canvas: (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement>
): Promise<void> {
  const marginTop = 20;
  const marginBottom = 18;
  const marginTopPx = Math.round(marginTop * IFRAME.width / PAGE_SIZES.a4.width);
  const marginBottomPx = Math.round(marginBottom * IFRAME.width / PAGE_SIZES.a4.width);
  const pageHeightPx = IFRAME.height;
  const pageContentPx = pageHeightPx - marginTopPx - marginBottomPx;

  const breakPoints = calculateBreakPoints(totalHeight, blocks, pageContentPx);
  const pageStarts = [0, ...breakPoints];

  const iWin = iframeEl.contentWindow;
  const iDoc = iframeEl.contentDocument;
  if (!iWin || !iDoc) return;

  for (let i = 0; i < pageStarts.length; i++) {
    const yStart = pageStarts[i];
    const yEnd = i < breakPoints.length ? breakPoints[i] : totalHeight;
    const sliceHeight = yEnd - yStart;

    /* # Scroll iframe to the start of this page's content */
    iWin.scrollTo(0, yStart);
    await new Promise(r => setTimeout(r, 50));

    /* # Render the visible area */
    const canvas = await html2canvas(iDoc.body, {
      scale: RENDER_SCALE,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: IFRAME.width,
      windowHeight: pageHeightPx,
      y: yStart,
      height: Math.min(sliceHeight, pageContentPx),
    });

    /* # Create an A4-sized page canvas with margins */
    const pageW = IFRAME.width * RENDER_SCALE;
    const pageH = IFRAME.height * RENDER_SCALE;
    const mTopScaled = marginTopPx * RENDER_SCALE;

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = pageW;
    pageCanvas.height = pageH;
    const ctx = pageCanvas.getContext("2d")!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageW, pageH);

    /* # Draw rendered content with top margin */
    const drawH = Math.min(canvas.height, (pageContentPx) * RENDER_SCALE);
    ctx.drawImage(canvas, 0, 0, canvas.width, drawH, 0, mTopScaled, canvas.width, drawH);

    if (i > 0) pdf.addPage();
    pdf.addImage(
      pageCanvas.toDataURL("image/png"),
      "PNG",
      0, 0,
      PAGE_SIZES.a4.width,
      PAGE_SIZES.a4.height
    );
  }
}

/* ============================================================
   STANDARDIZE TEMPLATE MARGINS (CSS — horizontal only)
   ============================================================ */
export function standardizeMargins(html: string): string {
  const px = IFRAME.marginPx;

  return html.replace(
    /body\s*\{([^}]*)\}/,
    (_match, inner: string) => {
      let updated = inner;
      updated = updated.replace(/padding\s*:\s*[^;]+;?/g, "");
      updated = updated.replace(/max-width\s*:\s*[^;]+;?/g, "");
      updated = updated.replace(/margin\s*:\s*0\s*auto\s*;?/g, "");
      updated += ` padding: 0 ${px}px; max-width: ${IFRAME.width}px; margin: 0 auto;`;
      return `body {${updated}}`;
    }
  );
}

/* ============================================================
   FULL PIPELINE — prepare HTML for PDF rendering
   ============================================================ */
export function prepareForPdf(html: string, isSidebar = false): string {
  let result = html;

  if (!isSidebar) {
    result = standardizeMargins(result);
  }

  result = injectPdfAttributes(result);

  return result;
}
