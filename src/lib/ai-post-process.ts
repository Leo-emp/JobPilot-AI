/* ============================================================
   AI POST-PROCESSING — Scrubs placeholder leaks from AI output
   ============================================================
   Catches common LLM placeholder patterns that slip through
   despite prompt instructions. Runs after every AI response
   before returning to the user.
   ============================================================ */

const PLACEHOLDER_PATTERNS = [
  /\[Your (?:Full )?Name\]/gi,
  /\[(?:Company|Company Name|Organization)\]/gi,
  /\[(?:City|Location|City,?\s*(?:State|Country))\]/gi,
  /\[(?:Phone|Phone Number|Phone #)\]/gi,
  /\[(?:Email|Email Address)\]/gi,
  /\[(?:Date|Month|Year)\]/gi,
  /\[(?:X|XX|X+)\s*(?:years?|months?|%|percent)\]/gi,
  /\[(?:quantify|insert|add|specify|fill in)[^\]]*\]/gi,
  /\[(?:e\.g\.,?\s*)[^\]]*\]/gi,
];

export function scrubPlaceholders(text: string): string {
  let cleaned = text;
  for (const pattern of PLACEHOLDER_PATTERNS) {
    cleaned = cleaned.replace(pattern, "___");
  }
  return cleaned;
}

export function hasPlaceholders(text: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(text));
}
