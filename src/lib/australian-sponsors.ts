/* ============================================================
   AUSTRALIAN APPROVED SPONSORS — Known Visa Sponsors
   ============================================================
   Curated list of major Australian companies known to sponsor
   skilled worker visas (subclass 482/494/186). Sourced from
   the Department of Home Affairs' published approved sponsor
   lists and public accredited sponsor registers.

   Used to badge job search results with a "Sponsors Visas"
   indicator when the company matches a known sponsor.

   This is NOT exhaustive — thousands of companies sponsor.
   We focus on the most recognized names that international
   students search for. Update periodically from official lists.
   ============================================================ */

/* # Normalized company names (lowercase, trimmed) for fast matching */
const KNOWN_SPONSORS = new Set([
  /* ---- Big Tech ---- */
  "google", "meta", "microsoft", "amazon", "apple", "atlassian",
  "canva", "salesforce", "oracle", "sap", "ibm", "cisco",
  "dell", "hp", "intel", "adobe", "vmware", "servicenow",
  "snowflake", "databricks", "twilio", "stripe", "shopify",

  /* ---- Big 4 / Consulting ---- */
  "deloitte", "pwc", "pricewaterhousecoopers", "ey", "ernst & young",
  "ernst and young", "kpmg", "mckinsey", "mckinsey & company",
  "boston consulting group", "bcg", "bain & company", "bain",
  "accenture", "capgemini", "infosys", "tcs",
  "tata consultancy services", "wipro", "cognizant",

  /* ---- Banks / Finance ---- */
  "commonwealth bank", "commbank", "cba", "westpac", "anz",
  "national australia bank", "nab", "macquarie", "macquarie group",
  "hsbc", "jpmorgan", "jp morgan", "goldman sachs", "morgan stanley",
  "citi", "citibank", "citigroup", "ubs", "credit suisse",
  "deutsche bank", "barclays", "bnp paribas",

  /* ---- Australian Corporates ---- */
  "telstra", "optus", "woolworths", "coles", "wesfarmers",
  "bhp", "rio tinto", "fortescue", "woodside", "santos",
  "qantas", "virgin australia", "csl", "cochlear", "resmed",
  "seek", "rea group", "domain", "xero", "afterpay",
  "zip", "wisetech global", "appen", "nearmap", "airtasker",
  "culture amp", "safety culture", "safetyculture", "linktree",
  "buildkite", "rokt", "immutable", "airwallex",

  /* ---- Mining / Resources / Engineering ---- */
  "bechtel", "worley", "aurecon", "aecom", "jacobs",
  "glencore", "anglo american", "newmont", "newcrest",
  "south32", "mineral resources", "pilbara minerals",

  /* ---- Healthcare / Pharma ---- */
  "pfizer", "roche", "novartis", "astrazeneca", "johnson & johnson",
  "medtronic", "abbott", "bayer", "merck", "gsk",
  "glaxosmithkline", "sanofi", "amgen",

  /* ---- Government / Research / Education ---- */
  "csiro", "university of sydney", "university of melbourne",
  "university of queensland", "unsw", "monash university",
  "anu", "australian national university", "university of adelaide",
  "uwa", "university of western australia", "uts",

  /* ---- Retail / FMCG ---- */
  "unilever", "procter & gamble", "p&g", "nestle", "mars",
  "coca-cola", "pepsico", "diageo", "lvmh",

  /* ---- Telecommunications / Media ---- */
  "nbn", "tpg", "foxtel", "nine entertainment", "seven west media",
  "news corp",

  /* ---- Transport / Logistics ---- */
  "toll", "linfox", "brambles", "transurban", "aurizon",
  "dhl", "fedex", "maersk",

  /* ---- Insurance ---- */
  "iag", "suncorp", "allianz", "axa", "zurich", "qbe",
  "medibank", "bupa", "nib",

  /* ---- Real Estate / Property ---- */
  "lendlease", "stockland", "mirvac", "dexus", "goodman group",
  "cbre", "jll", "jones lang lasalle", "colliers", "cushman & wakefield",

  /* ---- Defence / Aerospace ---- */
  "bae systems", "thales", "raytheon", "lockheed martin",
  "northrop grumman", "boeing", "airbus",
]);

/* # Check if a company name is a known sponsor */
export function isKnownSponsor(companyName: string): boolean {
  const normalized = companyName.toLowerCase().trim();
  if (KNOWN_SPONSORS.has(normalized)) return true;

  /* # Partial match — handles "Deloitte Australia", "Google LLC", etc. */
  for (const sponsor of KNOWN_SPONSORS) {
    if (normalized.includes(sponsor) || sponsor.includes(normalized)) {
      if (normalized.length >= 3 && sponsor.length >= 3) return true;
    }
  }
  return false;
}

/* # Australian cities for location autocomplete */
export const AUSTRALIAN_CITIES = [
  /* ---- Major capitals ---- */
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide",
  "Canberra", "Hobart", "Darwin",
  /* ---- Regional centers with visa benefits ---- */
  "Gold Coast", "Newcastle", "Wollongong", "Geelong",
  "Townsville", "Cairns", "Toowoomba", "Ballarat", "Bendigo",
  "Launceston", "Albury", "Mackay", "Rockhampton", "Bunbury",
  "Sunshine Coast",
];

/* # Cities that qualify for regional visa benefits (extra points + longer post-study visa) */
export const REGIONAL_CITIES = new Set([
  "gold coast", "newcastle", "wollongong", "geelong",
  "townsville", "cairns", "toowoomba", "ballarat", "bendigo",
  "launceston", "albury", "mackay", "rockhampton", "bunbury",
  "hobart", "darwin", "adelaide", "canberra", "sunshine coast",
]);

export function isRegionalCity(city: string): boolean {
  return REGIONAL_CITIES.has(city.toLowerCase().trim());
}
