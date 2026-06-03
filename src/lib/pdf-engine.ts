/* ============================================================
   PDF PAGINATION ENGINE — Intelligent page breaking
   ============================================================
   Content-aware page splitting that uses DOM measurements to
   find optimal break points. Handles section headers, work
   entries, education blocks, and widow/orphan protection.
   ============================================================ */

import { MARGINS, PAGE_SIZES, RENDER_SCALE, IFRAME, MIN_SECTION_SPACE_PX } from "./pdf-config";

/* ============================================================
   TYPES
   ============================================================ */
interface ContentBlock {
  type: string;
  top: number;
  height: number;
  bottom: number;
}

interface PageSlice {
  yStart: number;
  yEnd: number;
  contentHeight: number;
}

/* ============================================================
   MEASURE CONTENT BLOCKS FROM IFRAME DOM
   ============================================================
   Queries all elements with data-pdf-block attributes and
   records their vertical positions. These measurements guide
   page break decisions.
   ============================================================ */
export function measureBlocks(iframeDoc: Document): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const els = iframeDoc.querySelectorAll("[data-pdf-block]");

  els.forEach((el) => {
    const rect = (el as HTMLElement).getBoundingClientRect();
    blocks.push({
      type: (el as HTMLElement).dataset.pdfBlock || "unknown",
      top: Math.round(rect.top),
      height: Math.round(rect.height),
      bottom: Math.round(rect.bottom),
    });
  });

  return blocks.sort((a, b) => a.top - b.top);
}

/* ============================================================
   CALCULATE PAGE SLICES
   ============================================================
   Given the total content height and block positions, computes
   where each page starts and ends. Ensures:
   - Section titles stay with their content
   - Entries are kept together when possible
   - No orphaned single lines
   - Consistent margins on every page
   ============================================================ */
export function calculatePageSlices(
  totalHeightPx: number,
  blocks: ContentBlock[],
  canvasScale: number = RENDER_SCALE
): PageSlice[] {
  const marginPx = IFRAME.marginPx;
  const pageHeightPx = IFRAME.height;
  const usableHeight = pageHeightPx - marginPx * 2;

  const slices: PageSlice[] = [];
  let cursor = 0;

  while (cursor < totalHeightPx) {
    const pageBottom = cursor + usableHeight;

    if (pageBottom >= totalHeightPx) {
      slices.push({ yStart: cursor, yEnd: totalHeightPx, contentHeight: totalHeightPx - cursor });
      break;
    }

    let breakAt = pageBottom;

    /* # Find the best break point by checking content blocks */
    const blocksInRange = blocks.filter(
      (b) => b.top >= cursor && b.top < pageBottom
    );

    if (blocksInRange.length > 0) {
      /* # Check if any block straddles the page boundary */
      const straddling = blocks.filter(
        (b) => b.top < pageBottom && b.bottom > pageBottom
      );

      if (straddling.length > 0) {
        const firstStraddler = straddling[0];

        /* # If the block starts near the bottom of the page, move it entirely to next page */
        const spaceUsed = firstStraddler.top - cursor;
        const spaceRemaining = usableHeight - spaceUsed;

        if (spaceRemaining < MIN_SECTION_SPACE_PX || firstStraddler.type === "section-title") {
          breakAt = firstStraddler.top;
        } else if (firstStraddler.height <= usableHeight) {
          breakAt = firstStraddler.top;
        }
        /* # If the block is taller than a page, we must split it — let it break naturally */
      }

      /* # Section title protection: never let a section title be the last thing on a page */
      const lastBlockOnPage = blocksInRange
        .filter((b) => b.bottom <= breakAt)
        .pop();

      if (lastBlockOnPage?.type === "section-title") {
        breakAt = lastBlockOnPage.top;
      }
    }

    /* # Ensure we make progress (avoid infinite loop) */
    if (breakAt <= cursor) {
      breakAt = pageBottom;
    }

    slices.push({ yStart: cursor, yEnd: breakAt, contentHeight: breakAt - cursor });
    cursor = breakAt;
  }

  return slices;
}

/* ============================================================
   RENDER PDF PAGES
   ============================================================
   Takes a canvas and page slices, renders each slice onto an
   A4-sized canvas with proper margins, and adds it to the PDF.
   ============================================================ */
export async function renderPdfPages(
  sourceCanvas: HTMLCanvasElement,
  slices: PageSlice[],
  pdf: InstanceType<typeof import("jspdf").jsPDF>
): Promise<void> {
  const scaledMargin = IFRAME.marginPx * RENDER_SCALE;
  const pageWidthPx = IFRAME.width * RENDER_SCALE;
  const pageHeightPx = IFRAME.height * RENDER_SCALE;

  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    const srcY = slice.yStart * RENDER_SCALE;
    const srcH = slice.contentHeight * RENDER_SCALE;

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = pageWidthPx;
    pageCanvas.height = pageHeightPx;
    const ctx = pageCanvas.getContext("2d")!;

    /* # Fill white background */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageWidthPx, pageHeightPx);

    /* # Draw content with consistent margins: top margin on every page */
    ctx.drawImage(
      sourceCanvas,
      0, srcY, pageWidthPx, srcH,
      0, scaledMargin, pageWidthPx, srcH
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
   ============================================================
   Post-processes template HTML to add data-pdf-block attributes
   to semantic elements. Works with any template without requiring
   individual template modifications.
   ============================================================ */
export function injectPdfAttributes(html: string): string {
  let result = html;

  /* # Section titles — h2 and h3 headings */
  result = result.replace(/<h2(\s)/g, '<h2 data-pdf-block="section-title"$1');
  result = result.replace(/<h2>/g, '<h2 data-pdf-block="section-title">');
  result = result.replace(
    /<h3([^>]*class="[^"]*main[^"]*")/g,
    '<h3 data-pdf-block="section-title"$1'
  );

  /* # Work experience entries */
  result = result.replace(
    /class="entry"/g,
    'class="entry" data-pdf-block="entry"'
  );

  /* # Education rows */
  result = result.replace(
    /class="edu-row"/g,
    'class="edu-row" data-pdf-block="education"'
  );
  result = result.replace(
    /class="edu-entry"/g,
    'class="edu-entry" data-pdf-block="education"'
  );

  /* # Skill groups */
  result = result.replace(
    /class="skill-group"/g,
    'class="skill-group" data-pdf-block="skill-group"'
  );

  /* # Language lines */
  result = result.replace(
    /class="lang-line"/g,
    'class="lang-line" data-pdf-block="language"'
  );

  /* # Summary */
  result = result.replace(
    /class="summary"/g,
    'class="summary" data-pdf-block="summary"'
  );

  /* # Certification entries */
  result = result.replace(
    /class="cert-row"/g,
    'class="cert-row" data-pdf-block="certification"'
  );

  return result;
}

/* ============================================================
   STANDARDIZE TEMPLATE MARGINS
   ============================================================
   Replaces template-specific body padding/margin with the
   standard 0.75" margins from pdf-config.
   ============================================================ */
export function standardizeMargins(html: string): string {
  const px = IFRAME.marginPx;

  /* # Replace body padding rules — handles various formats */
  let result = html.replace(
    /body\s*\{([^}]*)\}/,
    (match, inner: string) => {
      let updated = inner;

      /* # Remove existing padding */
      updated = updated.replace(/padding\s*:\s*[^;]+;?/g, "");

      /* # Remove existing max-width and margin auto */
      updated = updated.replace(/max-width\s*:\s*[^;]+;?/g, "");
      updated = updated.replace(/margin\s*:\s*0\s*auto\s*;?/g, "");

      /* # Add standardized padding and width */
      updated += ` padding: ${px}px ${px}px 0 ${px}px; max-width: ${IFRAME.width}px; margin: 0 auto;`;

      return `body {${updated}}`;
    }
  );

  return result;
}

/* ============================================================
   FULL HTML POST-PROCESSING PIPELINE
   ============================================================
   Applies all standardization to a template's HTML output:
   1. Standardize margins (non-sidebar templates)
   2. Inject PDF block attributes
   3. Add page-break CSS
   ============================================================ */
export function prepareForPdf(html: string, isSidebar = false): string {
  let result = html;

  /* # Don't override margins for sidebar templates — they use flex layout */
  if (!isSidebar) {
    result = standardizeMargins(result);
  }

  /* # Inject content block markers */
  result = injectPdfAttributes(result);

  /* # Add page-break CSS before </head> */
  const breakCSS = `<style>
    [data-pdf-block="section-title"] { page-break-after: avoid; }
    [data-pdf-block="entry"] { page-break-inside: avoid; }
    [data-pdf-block="education"] { page-break-inside: avoid; }
    [data-pdf-block="certification"] { page-break-inside: avoid; }
    [data-pdf-block="skill-group"] { page-break-inside: avoid; }
  </style>`;
  result = result.replace("</head>", `${breakCSS}</head>`);

  return result;
}
