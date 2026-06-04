/* ============================================================
   PDF EXPORT CONFIGURATION — Centralized resume PDF settings
   ============================================================
   Standard margins, page sizes, and spacing constants used by
   all resume templates. Change values here to update every
   template at once.
   ============================================================ */

/* # Page sizes in mm */
export const PAGE_SIZES = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
} as const;

/* # Standard margins: 0.75 inch = 19.05mm ≈ 54pt */
export const MARGINS = {
  top: 20,
  bottom: 18,
  left: 20,
  right: 20,
} as const;

/* # Derived values for A4 */
export const A4 = {
  ...PAGE_SIZES.a4,
  contentWidth: PAGE_SIZES.a4.width - MARGINS.left - MARGINS.right,
  contentHeight: PAGE_SIZES.a4.height - MARGINS.top - MARGINS.bottom,
} as const;

/* # Iframe pixel values at 96 DPI (browser standard) */
const MM_TO_PX = 96 / 25.4;

export const IFRAME = {
  width: Math.round(PAGE_SIZES.a4.width * MM_TO_PX),
  height: Math.round(PAGE_SIZES.a4.height * MM_TO_PX),
  marginPx: Math.round(MARGINS.top * MM_TO_PX),
  contentWidthPx: Math.round(A4.contentWidth * MM_TO_PX),
  contentHeightPx: Math.round(A4.contentHeight * MM_TO_PX),
} as const;

/* # html2canvas render scale (2x for crisp text) */
export const RENDER_SCALE = 2;

/* # Minimum lines to keep together (widow/orphan protection) */
export const MIN_LINES_TOGETHER = 2;

/* # Minimum content height (px) required on current page before starting a section */
export const MIN_SECTION_SPACE_PX = 80;

/* # Block types for content-aware page breaking */
export type PdfBlockType =
  | "header"
  | "summary"
  | "section-title"
  | "entry"
  | "skill-group"
  | "education"
  | "certification"
  | "language"
  | "sidebar";

/* # CSS for page-break data attributes — injected into all templates */
export const PDF_BREAK_CSS = `
  [data-pdf-block] { position: relative; }
  [data-pdf-block="section-title"] { page-break-after: avoid; }
  [data-pdf-block="entry"] { page-break-inside: avoid; }
  [data-pdf-block="education"] { page-break-inside: avoid; }
  [data-pdf-block="certification"] { page-break-inside: avoid; }
  [data-pdf-block="skill-group"] { page-break-inside: avoid; }
  [data-pdf-block="language"] { page-break-inside: avoid; }
`;

/* # Standard body CSS that enforces margins — used by all templates */
export function getStandardBodyCSS(opts?: { sidebar?: boolean }): string {
  const px = IFRAME.marginPx;
  if (opts?.sidebar) {
    return `margin: 0; font-size: 12px; line-height: 1.45;`;
  }
  return `max-width: ${IFRAME.width}px; margin: 0 auto; padding: ${px}px ${px}px 0 ${px}px; line-height: 1.45; font-size: 10pt; color: #191919;`;
}
