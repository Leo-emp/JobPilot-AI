/* ============================================================
   SPONSORSHIP DETECTOR
   ============================================================
   Scans job description text for visa sponsorship signals.
   Only badges jobs where the posting EXPLICITLY mentions
   sponsorship — never guesses based on company name.

   Returns:
   - "available"   → posting says sponsorship is offered
   - "unavailable" → posting explicitly says no sponsorship
   - null          → no mention either way
   ============================================================ */

/* ---- Negative patterns checked first — they override positives ---- */
const NEGATIVE_PATTERNS = [
  /* Universal */
  /\bno\s+(visa\s+)?sponsorship\b/i,
  /\bnot\s+(able|willing|offering|providing)\s+to\s+sponsor\b/i,
  /\bunable\s+to\s+sponsor\b/i,
  /\bcannot\s+sponsor\b/i,
  /\bwon'?t\s+sponsor\b/i,
  /\bwill\s+not\s+sponsor\b/i,
  /\bwithout\s+(requiring\s+)?sponsorship\b/i,
  /\bwithout\s+visa\s+sponsorship\b/i,
  /\bnot\s+provide\s+(immigration\s+)?sponsorship\b/i,
  /\bdo\s+not\s+sponsor\b/i,
  /\bdoes\s+not\s+sponsor\b/i,
  /\bnot\s+sponsor\s+visas?\b/i,

  /* Must have existing authorization */
  /\bmust\s+(be|have)\s+(authorized|authorised|eligible)\s+to\s+work\b/i,
  /\bmust\s+have\s+(full\s+)?(existing\s+)?work(ing)?\s+(rights|authorization|authorisation|permit)\b/i,
  /\bmust\s+have\s+(unrestricted|unlimited)\s+work(ing)?\s+rights\b/i,
  /\brequire(s|d)?\s+existing\s+work\s+(rights|authorization|authorisation)\b/i,

  /* Country-specific negatives */
  /\b(australian|us|uk|british)\s+citizens?\s+only\b/i,
  /\bpermanent\s+residents?\s+only\b/i,
  /\bcitizens?\s+(and|or)\s+permanent\s+residents?\s+only\b/i,
  /\bno\s+H-?1B\b/i,
  /\bcannot\s+provide\s+H-?1B\b/i,
  /\bno\s+certificate\s+of\s+sponsorship\b/i,
];

/* ---- Country-specific positive patterns ---- */
const POSITIVE_PATTERNS_COMMON = [
  /\bvisa\s+sponsorship\s+(available|offered|provided|included)\b/i,
  /\b(willing|able|happy|open)\s+to\s+sponsor\b/i,
  /\bsponsorship\s+(is\s+)?(available|offered|provided)\b/i,
  /\bsponsor\s+(your|a|the)\s+visa\b/i,
  /\bvisa\s+support\s+(available|offered|provided)\b/i,
  /\bimmigration\s+sponsorship\s+(available|offered|provided)\b/i,
  /\bwe\s+sponsor\s+(work\s+)?visas?\b/i,
  /\bsponsorship\s+opportunity\b/i,
  /\bwork\s+visa\s+(assistance|support|sponsorship)\b/i,
  /\brelocation\s+(and\s+visa\s+)?sponsorship\b/i,
  /\boffer(s|ing)?\s+(visa\s+)?sponsorship\b/i,
];

/* Australia: 482, 494, 186 visa subclasses */
const POSITIVE_PATTERNS_AU = [
  /\b482\s*visa\b/i,
  /\bTSS\s+visa\b/i,
  /\b(subclass\s+)?186\s*visa\b/i,
  /\b(subclass\s+)?494\s*visa\b/i,
  /\btemporary\s+skill\s+shortage\b/i,
  /\bemployer\s+nomination\s+scheme\b/i,
  /\bsponsored\s+work(er)?\s+visa\b/i,
];

/* US: H-1B, OPT/CPT, Green Card, PERM */
const POSITIVE_PATTERNS_US = [
  /\bH-?1B\s+(sponsorship|visa|transfer)\b/i,
  /\bsponsor(s|ing)?\s+(an?\s+)?H-?1B\b/i,
  /\bgreen\s+card\s+sponsorship\b/i,
  /\bemployment.based\s+(visa|immigration)\b/i,
  /\bPERM\s+(sponsorship|filing|process)\b/i,
  /\bOPT\s+(friendly|accepted|welcome|eligible)\b/i,
  /\bCPT\s+(friendly|accepted|welcome|eligible)\b/i,
  /\bE-?3\s+visa\b/i,
  /\bTN\s+visa\b/i,
  /\bimmigration\s+sponsorship\b/i,
];

/* UK: Skilled Worker visa, Certificate of Sponsorship */
const POSITIVE_PATTERNS_UK = [
  /\bskilled\s+worker\s+visa\b/i,
  /\btier\s+2\s+(visa|sponsorship|sponsor)\b/i,
  /\bcertificate\s+of\s+sponsorship\b/i,
  /\bCoS\s+(available|provided|offered)\b/i,
  /\bUK\s+work\s+visa\s+(sponsorship|support)\b/i,
  /\blicensed\s+sponsor\b/i,
  /\bsponsor\s+licence\b/i,
  /\bglobal\s+talent\s+visa\b/i,
];

/* Map country codes to their additional positive patterns */
const COUNTRY_PATTERNS: Record<string, RegExp[]> = {
  au: POSITIVE_PATTERNS_AU,
  us: POSITIVE_PATTERNS_US,
  gb: POSITIVE_PATTERNS_UK,
};

/* ---- Main detection function ---- */
export function detectSponsorship(
  description: string,
  title: string,
  country: string
): "available" | "unavailable" | null {
  if (!description && !title) return null;

  /* Combine title + description for scanning */
  const text = `${title} ${description}`;

  /* Check negative signals first — they take priority */
  for (const pattern of NEGATIVE_PATTERNS) {
    if (pattern.test(text)) return "unavailable";
  }

  /* Check common positive signals */
  for (const pattern of POSITIVE_PATTERNS_COMMON) {
    if (pattern.test(text)) return "available";
  }

  /* Check country-specific positive signals */
  const extra = COUNTRY_PATTERNS[country];
  if (extra) {
    for (const pattern of extra) {
      if (pattern.test(text)) return "available";
    }
  }

  /* No sponsorship mention found */
  return null;
}
