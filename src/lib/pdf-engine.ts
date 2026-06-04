/* ============================================================
   PDF PAGINATION ENGINE — Single canvas, smart slicing
   ============================================================
   Renders the full resume as one tall canvas, then slices into
   A4 pages at intelligent break points. Uses both pixel scanning
   (find white gaps) and DOM block measurements (avoid splitting
   entries) for reliable page breaks.
   ============================================================ */

import { PAGE_SIZES, RENDER_SCALE, IFRAME } from "./pdf-config";

/* ============================================================
   INJECT PDF BLOCK ATTRIBUTES INTO HTML
   ============================================================ */
export function injectPdfAttributes(html: string): string {
  let r = html;
  /* # Tag headings so we never break right after one */
  r = r.replace(/<h2(?=[\s>])(?![^>]*data-pdf-block)/g, '<h2 data-pdf-block="heading"');
  r = r.replace(/<h3(?=[\s>])(?![^>]*data-pdf-block)/g, '<h3 data-pdf-block="heading"');
  /* # Tag content blocks we want to keep together on one page.
     # Use (?:\s|") after the class name so we match "entry" and "entry foo"
     # but NOT "entry-title" or "entry-sub" (child elements inside entries). */
  r = r.replace(/class="((?:entry|t-entry|exp-entry|entry-block)(?:\s[^"]*)?)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(edu-row(?:\s[^"]*)?)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(edu-entry(?:\s[^"]*)?)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(skill-group(?:\s[^"]*)?)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(lang-line(?:\s[^"]*)?)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(dot-row(?:\s[^"]*)?)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(summary(?:\s[^"]*)?)"/g, 'class="$1" data-pdf-block="entry"');
  r = r.replace(/class="(section(?:\s[^"]*)?)"/g, 'class="$1" data-pdf-block="section"');
  return r;
}

/* ============================================================
   EXPORT Block type for consumers
   ============================================================ */
export type { Block };

/* ============================================================
   MEASURE BLOCK POSITIONS FROM IFRAME DOM
   ============================================================ */
interface Block { top: number; bottom: number; left: number; type: string; }

export function measureBlocks(iframeDoc: Document): Block[] {
  const blocks: Block[] = [];
  iframeDoc.querySelectorAll("[data-pdf-block]").forEach((el) => {
    const h = el as HTMLElement;
    const rect = h.getBoundingClientRect();
    if (rect.height > 0) {
      blocks.push({
        top: rect.top + (iframeDoc.defaultView?.scrollY || 0),
        bottom: rect.bottom + (iframeDoc.defaultView?.scrollY || 0),
        left: rect.left,
        type: h.dataset.pdfBlock || "entry",
      });
    }
  });
  return blocks.sort((a, b) => a.top - b.top);
}

/* ============================================================
   FIND BEST PAGE BREAK — pixel scan guided by block positions
   ============================================================
   Scans upward from the ideal break point looking for a white
   gap between content blocks. Prefers breaking between entries
   and never breaks right after a heading.
   ============================================================ */
function findBreak(
  canvas: HTMLCanvasElement,
  idealBreakScaled: number,
  minBreakScaled: number,
  blocks: Block[],
  hasSidebar: boolean,
): number {
  const ctx = canvas.getContext("2d");
  if (!ctx) return idealBreakScaled;

  const scale = RENDER_SCALE;
  const cw = canvas.width;
  const scanX = hasSidebar ? Math.floor(cw * 0.4) : 0;
  const scanW = cw - scanX - 10;

  /* # First: check if any block boundary falls in the scan range */
  const idealCss = idealBreakScaled / scale;
  const minCss = minBreakScaled / scale;

  /* # Find block boundaries (gaps between blocks) in the break zone
     # For sidebar templates, only consider blocks in the main column */
  const mainBlocks = hasSidebar
    ? blocks.filter(b => b.left > IFRAME.width * 0.30)
    : blocks;
  const gaps: number[] = [];
  for (let i = 0; i < mainBlocks.length; i++) {
    const b = mainBlocks[i];
    if (b.top > minCss && b.top < idealCss) {
      /* # Don't break right after a heading — check if previous block was a heading */
      const prev = i > 0 ? mainBlocks[i - 1] : null;
      if (prev?.type === "heading" && b.top - prev.bottom < 10) continue;
      gaps.push(b.top);
    }
  }

  /* # Prefer the last gap (closest to ideal break, maximizes content per page) */
  if (gaps.length > 0) {
    const bestGap = gaps[gaps.length - 1];
    return Math.round(bestGap * scale);
  }

  /* # Fallback: pixel scan for largest white gap */
  let bestRow = -1;
  let bestSize = 0;
  let consecutive = 0;
  let gapStart = -1;

  for (let row = idealBreakScaled; row > minBreakScaled; row--) {
    const data = ctx.getImageData(scanX, row, scanW, 1).data;
    let isWhite = true;
    for (let i = 0; i < data.length; i += 16) {
      if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) {
        isWhite = false;
        break;
      }
    }
    if (isWhite) {
      if (gapStart === -1) gapStart = row;
      consecutive++;
    } else {
      if (consecutive > bestSize && consecutive >= 8) {
        bestSize = consecutive;
        bestRow = gapStart - Math.floor(consecutive / 2);
      }
      consecutive = 0;
      gapStart = -1;
    }
  }
  if (consecutive > bestSize && consecutive >= 8) {
    bestRow = gapStart - Math.floor(consecutive / 2);
  }

  return bestRow > 0 ? bestRow : idealBreakScaled;
}

/* ============================================================
   RENDER FULL PDF — single canvas, smart slicing
   ============================================================ */
export async function renderFullPdf(
  canvas: HTMLCanvasElement,
  blocks: Block[],
  hasSidebar: boolean,
  pdf: InstanceType<typeof import("jspdf").jsPDF>,
): Promise<void> {
  const scale = RENDER_SCALE;
  const marginTopMm = 20;
  const marginBotMm = 18;
  const marginTopScaled = Math.round(marginTopMm / PAGE_SIZES.a4.height * IFRAME.height * scale);
  const marginBotScaled = Math.round(marginBotMm / PAGE_SIZES.a4.height * IFRAME.height * scale);
  const pageHScaled = IFRAME.height * scale;
  const pageWScaled = IFRAME.width * scale;
  const usableH = pageHScaled - marginTopScaled - marginBotScaled;

  let yOffset = 0;
  let isFirst = true;

  while (yOffset < canvas.height) {
    const remaining = canvas.height - yOffset;
    const isLast = remaining <= usableH;

    let sliceH: number;
    if (isLast) {
      sliceH = remaining;
    } else {
      const idealEnd = yOffset + usableH;
      const minEnd = yOffset + Math.floor(usableH * 0.7);
      const breakRow = findBreak(canvas, idealEnd, minEnd, blocks, hasSidebar);
      sliceH = breakRow - yOffset;
      if (sliceH <= 0) sliceH = usableH;
    }

    /* # Create A4 page canvas */
    const page = document.createElement("canvas");
    page.width = pageWScaled;
    page.height = pageHScaled;
    const ctx = page.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageWScaled, pageHScaled);

    /* # Draw content slice with top margin — same on every page */
    ctx.drawImage(canvas, 0, yOffset, pageWScaled, sliceH, 0, marginTopScaled, pageWScaled, sliceH);

    if (!isFirst) pdf.addPage();
    pdf.addImage(page.toDataURL("image/png"), "PNG", 0, 0, PAGE_SIZES.a4.width, PAGE_SIZES.a4.height);

    /* # Skip whitespace at top of next slice */
    let next = yOffset + sliceH;
    const skipCtx = canvas.getContext("2d");
    if (skipCtx && !isLast) {
      const scanX = hasSidebar ? Math.floor(pageWScaled * 0.4) : 0;
      const scanW = pageWScaled - scanX - 10;
      const maxSkip = Math.min(next + 40 * scale, canvas.height);
      while (next < maxSkip) {
        const row = skipCtx.getImageData(scanX, next, scanW, 1).data;
        let allWhite = true;
        for (let i = 0; i < row.length; i += 16) {
          if (row[i] < 245 || row[i + 1] < 245 || row[i + 2] < 245) {
            allWhite = false;
            break;
          }
        }
        if (!allWhite) break;
        next++;
      }
    }

    yOffset = next;
    isFirst = false;
  }
}

/* ============================================================
   STANDARDIZE MARGINS (CSS — horizontal only)
   ============================================================ */
export function standardizeMargins(html: string): string {
  const px = IFRAME.marginPx;
  return html.replace(
    /body\s*\{([^}]*)\}/,
    (_match, inner: string) => {
      let u = inner;
      u = u.replace(/padding\s*:\s*[^;]+;?/g, "");
      u = u.replace(/max-width\s*:\s*[^;]+;?/g, "");
      u = u.replace(/margin\s*:\s*0\s*auto\s*;?/g, "");
      u += ` padding: 0 ${px}px; max-width: ${IFRAME.width}px; margin: 0 auto;`;
      return `body {${u}}`;
    }
  );
}

/* ============================================================
   FULL PIPELINE
   ============================================================ */
export function prepareForPdf(html: string, isSidebar = false): string {
  let r = html;
  if (!isSidebar) r = standardizeMargins(r);
  r = injectPdfAttributes(r);
  return r;
}
