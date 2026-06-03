/* ============================================================
   PDF PAGINATION ENGINE — Intelligent page breaking
   ============================================================
   Hybrid approach: uses DOM block measurements when available,
   falls back to pixel-scanning for white gaps. Applies consistent
   0.75" margins on every page via the render step (not CSS).
   ============================================================ */

import { PAGE_SIZES, RENDER_SCALE, IFRAME } from "./pdf-config";

interface ContentBlock {
  type: string;
  top: number;
  height: number;
  bottom: number;
}

interface PageSlice {
  yStart: number;
  yEnd: number;
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
    blocks.push({
      type: htmlEl.dataset.pdfBlock || "unknown",
      top,
      height,
      bottom: top + height,
    });
  });

  return blocks.sort((a, b) => a.top - b.top);
}

/* ============================================================
   FIND BEST BREAK POINT — HYBRID ALGORITHM
   ============================================================
   1. Try content blocks first (semantic breaks)
   2. Fall back to pixel-scanning for white gaps
   ============================================================ */
function findBreakPoint(
  pageBottom: number,
  cursor: number,
  usableHeight: number,
  blocks: ContentBlock[],
  canvas: HTMLCanvasElement,
  scanFromRight: boolean
): number {
  /* # First: try content-aware breaking using block boundaries */
  if (blocks.length > 0) {
    const straddling = blocks.filter(
      (b) => b.top < pageBottom && b.bottom > pageBottom && b.top > cursor
    );

    if (straddling.length > 0) {
      const block = straddling[0];
      const spaceOnPage = block.top - cursor;

      /* # If less than 60px of content would remain, or it's a section title, push to next page */
      if (spaceOnPage < 60 || block.type === "section-title") {
        return block.top;
      }

      /* # If the entire block fits on one page, move it to next */
      if (block.height <= usableHeight) {
        return block.top;
      }
    }

    /* # Check if a section-title is the last block ending on this page */
    const blocksEndingOnPage = blocks.filter(
      (b) => b.bottom <= pageBottom && b.bottom > pageBottom - 40 && b.top > cursor
    );
    const lastBlock = blocksEndingOnPage[blocksEndingOnPage.length - 1];
    if (lastBlock?.type === "section-title") {
      return lastBlock.top;
    }
  }

  /* # Fallback: pixel-scan for the largest white gap in the bottom 25% of the page */
  const ctx = canvas.getContext("2d");
  if (!ctx) return pageBottom;

  const scale = RENDER_SCALE;
  const scanTop = Math.floor((cursor + usableHeight * 0.75) * scale);
  const scanBottom = Math.floor(pageBottom * scale);
  const cw = canvas.width;

  /* # For sidebar templates, scan only the right portion */
  const scanX = scanFromRight ? Math.floor(cw * 0.4) : 0;
  const scanW = cw - scanX - 10;

  let bestGapRow = -1;
  let bestGapSize = 0;
  let consecutive = 0;
  let gapStart = -1;

  for (let row = scanBottom; row > scanTop; row--) {
    const rowData = ctx.getImageData(scanX, row, scanW, 1).data;
    let isWhite = true;
    for (let i = 0; i < rowData.length; i += 16) {
      if (rowData[i] < 245 || rowData[i + 1] < 245 || rowData[i + 2] < 245) {
        isWhite = false;
        break;
      }
    }

    if (isWhite) {
      if (gapStart === -1) gapStart = row;
      consecutive++;
    } else {
      if (consecutive > bestGapSize && consecutive >= 12) {
        bestGapSize = consecutive;
        bestGapRow = gapStart - Math.floor(consecutive / 2);
      }
      consecutive = 0;
      gapStart = -1;
    }
  }

  if (consecutive > bestGapSize && consecutive >= 12) {
    bestGapRow = gapStart - Math.floor(consecutive / 2);
  }

  if (bestGapRow > 0) {
    return Math.round(bestGapRow / scale);
  }

  return pageBottom;
}

/* ============================================================
   CALCULATE PAGE SLICES
   ============================================================ */
export function calculatePageSlices(
  totalHeightPx: number,
  blocks: ContentBlock[],
  canvas: HTMLCanvasElement,
  hasSidebar: boolean
): PageSlice[] {
  const marginPx = IFRAME.marginPx;
  const usableHeight = IFRAME.height - marginPx * 2;

  const slices: PageSlice[] = [];
  let cursor = 0;

  while (cursor < totalHeightPx) {
    const pageBottom = cursor + usableHeight;

    if (pageBottom >= totalHeightPx) {
      slices.push({ yStart: cursor, yEnd: totalHeightPx });
      break;
    }

    const breakAt = findBreakPoint(
      pageBottom, cursor, usableHeight, blocks, canvas, hasSidebar
    );

    /* # Ensure progress */
    const actualBreak = breakAt <= cursor ? pageBottom : breakAt;

    slices.push({ yStart: cursor, yEnd: actualBreak });

    /* # Skip whitespace at the top of next page */
    let next = actualBreak;
    const ctx = canvas.getContext("2d");
    if (ctx && !hasSidebar) {
      const scale = RENDER_SCALE;
      const maxSkip = Math.min(actualBreak + 30, totalHeightPx);
      while (next < maxSkip) {
        const row = ctx.getImageData(0, next * scale, canvas.width, 1).data;
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

    cursor = next;
  }

  return slices;
}

/* ============================================================
   RENDER PDF PAGES
   ============================================================
   Draws each page slice onto an A4 canvas with consistent
   0.75" margins on all sides, every page.
   ============================================================ */
export async function renderPdfPages(
  sourceCanvas: HTMLCanvasElement,
  slices: PageSlice[],
  pdf: InstanceType<typeof import("jspdf").jsPDF>
): Promise<void> {
  const scale = RENDER_SCALE;
  const marginScaled = IFRAME.marginPx * scale;
  const pageW = IFRAME.width * scale;
  const pageH = IFRAME.height * scale;

  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    const srcY = slice.yStart * scale;
    const srcH = (slice.yEnd - slice.yStart) * scale;

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = pageW;
    pageCanvas.height = pageH;
    const ctx = pageCanvas.getContext("2d")!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageW, pageH);

    /* # Draw content with top margin — consistent on EVERY page */
    ctx.drawImage(
      sourceCanvas,
      0, srcY, pageW, srcH,
      0, marginScaled, pageW, srcH
    );

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
   INJECT PDF BLOCK ATTRIBUTES INTO HTML
   ============================================================ */
export function injectPdfAttributes(html: string): string {
  let result = html;

  /* # Section titles — all h2 tags and main-area h3 tags */
  result = result.replace(/<h2(?=[\s>])/g, '<h2 data-pdf-block="section-title"');
  result = result.replace(/<(h3[^>]*class="[^"]*(?:main|section)[^"]*")/g, '<$1 data-pdf-block="section-title"');

  /* # Work experience entries — match class containing "entry" */
  result = result.replace(/class="([^"]*\bentry\b[^"]*)"/g, 'class="$1" data-pdf-block="entry"');

  /* # Education */
  result = result.replace(/class="([^"]*\bedu-row\b[^"]*)"/g, 'class="$1" data-pdf-block="education"');
  result = result.replace(/class="([^"]*\bedu-entry\b[^"]*)"/g, 'class="$1" data-pdf-block="education"');

  /* # Skill groups */
  result = result.replace(/class="([^"]*\bskill-group\b[^"]*)"/g, 'class="$1" data-pdf-block="skill-group"');

  /* # Language lines */
  result = result.replace(/class="([^"]*\blang-line\b[^"]*)"/g, 'class="$1" data-pdf-block="language"');

  /* # Summary */
  result = result.replace(/class="([^"]*\bsummary\b[^"]*)"/g, 'class="$1" data-pdf-block="summary"');

  return result;
}

/* ============================================================
   STANDARDIZE TEMPLATE MARGINS
   ============================================================
   Sets LEFT/RIGHT margins only in CSS. Vertical margins are
   handled by the render engine for consistency across pages.
   ============================================================ */
export function standardizeMargins(html: string): string {
  const px = IFRAME.marginPx;

  let result = html.replace(
    /body\s*\{([^}]*)\}/,
    (_match, inner: string) => {
      let updated = inner;
      updated = updated.replace(/padding\s*:\s*[^;]+;?/g, "");
      updated = updated.replace(/max-width\s*:\s*[^;]+;?/g, "");
      updated = updated.replace(/margin\s*:\s*0\s*auto\s*;?/g, "");
      /* # Only horizontal padding — vertical handled by render engine */
      updated += ` padding: 0 ${px}px; max-width: ${IFRAME.width}px; margin: 0 auto;`;
      return `body {${updated}}`;
    }
  );

  return result;
}

/* ============================================================
   FULL HTML POST-PROCESSING PIPELINE
   ============================================================ */
export function prepareForPdf(html: string, isSidebar = false): string {
  let result = html;

  if (!isSidebar) {
    result = standardizeMargins(result);
  }

  result = injectPdfAttributes(result);

  return result;
}
