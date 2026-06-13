/* ============================================================
   JOB SEARCH API - Multi-Source Job Aggregator
   ============================================================
   GET /api/jobs/search?q=...&location=...&page=1&country=au&sponsorship=true
   Searches for jobs across multiple free sources in parallel:
   - Adzuna (requires API keys)
   - Jooble (requires API key)
   - Remotive (free, no key)
   - RemoteOK (free, no key)
   - We Work Remotely (free RSS feed, no key)
   Merges, deduplicates, and badges sponsor-friendly results.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { safeHandler } from "@/lib/api-handler";
import { cacheGet, cacheSet } from "@/lib/redis";
import { detectSponsorship } from "@/lib/sponsorship-detector";

/* ---- Standardized job format returned to the frontend ---- */
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary: string;
  category: string;
  contractTime: string;
  postedDate: string;
  source: string;
  sponsorship?: "available" | "unavailable";
}

/* ============================================================
   SOURCE 1: ADZUNA (requires ADZUNA_APP_ID + ADZUNA_APP_KEY)
   ============================================================ */
async function fetchAdzuna(query: string, location: string, page: number, country: string): Promise<Job[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: "15",
    what: query,
  });
  if (location) params.set("where", location);

  const res = await fetch(
    `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${params.toString()}`
  );
  if (!res.ok) return [];

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return [];

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.results || []).map((j: any) => ({
    id: `adzuna-${j.id}`,
    title: j.title || "",
    company: j.company?.display_name || "Unknown",
    location: j.location?.display_name || "Remote",
    description: j.description || "",
    url: j.redirect_url || "",
    salary: formatSalary(j.salary_min, j.salary_max),
    category: j.category?.label || "",
    contractTime: j.contract_time || "",
    postedDate: j.created || "",
    source: "Adzuna",
  }));
}

/* ============================================================
   SOURCE 2: REMOTIVE (free, no key, JSON)
   ============================================================ */
async function fetchRemotive(query: string): Promise<Job[]> {
  const params = new URLSearchParams();
  if (query) params.set("search", query);
  params.set("limit", "20");

  const res = await fetch(`https://remotive.com/api/remote-jobs?${params.toString()}`);
  if (!res.ok) return [];

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.jobs || []).map((j: any) => ({
    id: `remotive-${j.id}`,
    title: j.title || "",
    company: j.company_name || "Unknown",
    location: j.candidate_required_location || "Worldwide",
    description: stripHTML(j.description || ""),
    url: j.url || "",
    salary: j.salary || "",
    category: j.category || "",
    contractTime: j.job_type || "",
    postedDate: j.publication_date || "",
    source: "Remotive",
  }));
}

/* ============================================================
   SOURCE 3: REMOTEOK (free, no key, JSON array)
   ============================================================ */
async function fetchRemoteOK(query: string): Promise<Job[]> {
  const res = await fetch("https://remoteok.com/api", {
    headers: { "User-Agent": "JobPilotAI/1.0" },
  });
  if (!res.ok) return [];

  const data = await res.json();
  /* First element is a legal notice — skip it */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobs: any[] = Array.isArray(data) ? data.slice(1) : [];

  const q = query.toLowerCase();
  const filtered = q
    ? jobs.filter(
        (j) =>
          (j.position || "").toLowerCase().includes(q) ||
          (j.company || "").toLowerCase().includes(q) ||
          (j.description || "").toLowerCase().includes(q) ||
          (j.tags || []).some((t: string) => t.toLowerCase().includes(q))
      )
    : jobs;

  return filtered.slice(0, 20).map((j) => ({
    id: `remoteok-${j.id}`,
    title: j.position || "",
    company: j.company || "Unknown",
    location: j.location || "Remote",
    description: stripHTML(j.description || ""),
    url: j.url || j.apply_url || "",
    salary: formatSalary(j.salary_min, j.salary_max),
    category: (j.tags || []).slice(0, 3).join(", "),
    contractTime: "",
    postedDate: j.date || "",
    source: "RemoteOK",
  }));
}

/* ============================================================
   SOURCE 4: WE WORK REMOTELY (free RSS feed, no key)
   ============================================================ */
async function fetchWWR(query: string): Promise<Job[]> {
  const res = await fetch("https://weworkremotely.com/remote-jobs.rss");
  if (!res.ok) return [];

  const xml = await res.text();

  /* Simple XML parsing — extract <item> blocks */
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  const q = query.toLowerCase();

  const jobs: Job[] = [];
  for (const item of items) {
    const rawTitle = extractXML(item, "title");
    const link = extractXML(item, "link");
    const pubDate = extractXML(item, "pubDate");
    const region = extractXML(item, "region") || "Remote";
    const category = extractXML(item, "category") || "";
    const type = extractXML(item, "type") || "";
    const desc = stripHTML(extractCDATA(item, "description") || extractXML(item, "description") || "");

    /* Title format: "Company : Job Title" */
    let company = "Unknown";
    let title = rawTitle;
    if (rawTitle.includes(":")) {
      const parts = rawTitle.split(":");
      company = parts[0].trim();
      title = parts.slice(1).join(":").trim();
    }

    /* Filter by query if provided */
    if (q && !title.toLowerCase().includes(q) && !company.toLowerCase().includes(q) && !desc.toLowerCase().includes(q)) {
      continue;
    }

    jobs.push({
      id: `wwr-${link || jobs.length}`,
      title,
      company,
      location: region,
      description: desc,
      url: link,
      salary: "",
      category,
      contractTime: type,
      postedDate: pubDate,
      source: "WeWorkRemotely",
    });

    if (jobs.length >= 15) break;
  }

  return jobs;
}

/* ============================================================
   SOURCE 5: JOOBLE (requires JOOBLE_API_KEY)
   ============================================================ */
async function fetchJooble(query: string, location: string, page: number): Promise<Job[]> {
  const apiKey = process.env.JOOBLE_API_KEY;
  if (!apiKey) return [];

  const body: Record<string, string> = { keywords: query, page: String(page) };
  if (location) body.location = location;

  const res = await fetch(`https://jooble.org/api/${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return [];

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.jobs || []).map((j: any) => ({
    id: `jooble-${j.id || Math.random().toString(36).slice(2)}`,
    title: j.title || "",
    company: j.company || "Unknown",
    location: j.location || "",
    description: stripHTML(j.snippet || ""),
    url: j.link || "",
    salary: j.salary || "",
    category: j.type || "",
    contractTime: j.type || "",
    postedDate: j.updated || "",
    source: "Jooble",
  }));
}

/* ============================================================
   SOURCE 6: JSEARCH (RapidAPI — aggregates LinkedIn, Indeed, Glassdoor)
   ============================================================ */
async function fetchJSearch(query: string, location: string, page: number, country: string): Promise<Job[]> {
  const apiKey = process.env.JSEARCH_API_KEY;
  if (!apiKey) return [];

  const countryName = COUNTRY_NAMES[country] || "";
  const searchQuery = location ? `${query} in ${location}, ${countryName}` : `${query} in ${countryName}`;

  const params = new URLSearchParams({
    query: searchQuery,
    page: String(page),
    num_pages: "1",
  });

  const res = await fetch(`https://jsearch.p.rapidapi.com/search?${params.toString()}`, {
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  });
  if (!res.ok) return [];

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.data || []).map((j: any) => ({
    id: `jsearch-${j.job_id || Math.random().toString(36).slice(2)}`,
    title: j.job_title || "",
    company: j.employer_name || "Unknown",
    location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(", ") || "Remote",
    description: (j.job_description || "").slice(0, 500),
    url: j.job_apply_link || j.job_google_link || "",
    salary: j.job_min_salary && j.job_max_salary
      ? formatSalary(j.job_min_salary, j.job_max_salary)
      : "",
    category: j.job_employment_type || "",
    contractTime: j.job_employment_type || "",
    postedDate: j.job_posted_at_datetime_utc || "",
    source: j.job_publisher || "JSearch",
  }));
}

/* ============================================================
   SOURCE 7: REED (UK jobs — requires REED_API_KEY)
   ============================================================ */
async function fetchReed(query: string, location: string): Promise<Job[]> {
  const apiKey = process.env.REED_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({ keywords: query, resultsToTake: "20" });
  if (location) params.set("locationName", location);

  const res = await fetch(`https://www.reed.co.uk/api/1.0/search?${params.toString()}`, {
    headers: { Authorization: `Basic ${btoa(apiKey + ":")}` },
  });
  if (!res.ok) return [];

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.results || []).map((j: any) => ({
    id: `reed-${j.jobId}`,
    title: j.jobTitle || "",
    company: j.employerName || "Unknown",
    location: j.locationName || "",
    description: stripHTML(j.jobDescription || ""),
    url: j.jobUrl || "",
    salary: formatSalary(j.minimumSalary, j.maximumSalary),
    category: "",
    contractTime: j.contractType || "",
    postedDate: j.date || "",
    source: "Reed",
  }));
}

/* ============================================================
   SOURCE 8: THE MUSE (free, no key, curated jobs)
   ============================================================ */
async function fetchTheMuse(query: string, page: number): Promise<Job[]> {
  const params = new URLSearchParams({ page: String(page - 1) });
  if (query) params.set("category", query);

  const res = await fetch(`https://www.themuse.com/api/public/jobs?${params.toString()}`);
  if (!res.ok) return [];

  const data = await res.json();
  const q = query.toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.results || []).slice(0, 15).filter((j: any) => {
    if (!q) return true;
    return (j.name || "").toLowerCase().includes(q) ||
      (j.company?.name || "").toLowerCase().includes(q) ||
      (j.contents || "").toLowerCase().includes(q);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).map((j: any) => ({
    id: `muse-${j.id}`,
    title: j.name || "",
    company: j.company?.name || "Unknown",
    location: (j.locations || []).map((l: { name: string }) => l.name).join(", ") || "Remote",
    description: stripHTML((j.contents || "").slice(0, 500)),
    url: j.refs?.landing_page || "",
    salary: "",
    category: (j.categories || []).map((c: { name: string }) => c.name).join(", "),
    contractTime: j.type || "",
    postedDate: j.publication_date || "",
    source: "The Muse",
  }));
}

/* ============================================================
   SOURCE 9: ARBEITNOW (free, no key, EU + remote)
   ============================================================ */
async function fetchArbeitnow(query: string): Promise<Job[]> {
  const params = new URLSearchParams();
  if (query) params.set("search", query);

  const res = await fetch(`https://arbeitnow.com/api/job-board-api?${params.toString()}`);
  if (!res.ok) return [];

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.data || []).slice(0, 15).map((j: any) => ({
    id: `arbeitnow-${j.slug || Math.random().toString(36).slice(2)}`,
    title: j.title || "",
    company: j.company_name || "Unknown",
    location: j.location || "Remote",
    description: stripHTML((j.description || "").slice(0, 500)),
    url: j.url || "",
    salary: "",
    category: (j.tags || []).slice(0, 3).join(", "),
    contractTime: j.remote ? "Remote" : "",
    postedDate: j.created_at ? new Date(j.created_at * 1000).toISOString() : "",
    source: "Arbeitnow",
  }));
}

/* ============================================================
   SOURCE 10: GITHUB JOBS (via findwork.dev — free, no key, tech internships)
   ============================================================ */
async function fetchFindwork(query: string): Promise<Job[]> {
  const params = new URLSearchParams({ search: query });

  const res = await fetch(`https://findwork.dev/api/jobs/?${params.toString()}`, {
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) return [];

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.results || []).slice(0, 15).map((j: any) => ({
    id: `findwork-${j.id || Math.random().toString(36).slice(2)}`,
    title: j.role || "",
    company: j.company_name || "Unknown",
    location: j.location || "Remote",
    description: stripHTML((j.text || "").slice(0, 500)),
    url: j.url || "",
    salary: "",
    category: (j.keywords || []).slice(0, 3).join(", "),
    contractTime: j.employment_type || "",
    postedDate: j.date_posted || "",
    source: "Findwork",
  }));
}

/* ============================================================
   SOURCE 11: INTERNSHIPS — Aggregates multiple internship-specific feeds
   when the user selects "Internship" job type
   ============================================================ */
/* # Country-specific internship terminology */
const INTERNSHIP_KEYWORDS: Record<string, string> = {
  au: "intern internship vacation program cadetship graduate program work placement traineeship summer analyst",
  gb: "intern internship placement graduate scheme trainee work experience industrial placement year in industry",
  us: "intern internship co-op fellowship summer analyst rotational program",
  ca: "intern internship co-op work placement summer student",
  nz: "intern internship graduate programme cadetship summer placement",
  de: "intern internship praktikum werkstudent working student trainee",
};
const DEFAULT_INTERN_KEYWORDS = "intern internship placement trainee graduate scheme work experience co-op";

async function fetchInternships(query: string, country: string): Promise<Job[]> {
  const countryName = COUNTRY_NAMES[country] || "";
  const keywords = INTERNSHIP_KEYWORDS[country] || DEFAULT_INTERN_KEYWORDS;
  const allResults: Job[] = [];

  /* # Adzuna with country-specific internship keywords */
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (appId && appKey) {
    try {
      const params = new URLSearchParams({
        app_id: appId,
        app_key: appKey,
        results_per_page: "25",
        what: `internship ${query}`,
        what_or: keywords,
      });
      const res = await fetch(`https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params.toString()}`);
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const jobs = (data.results || []).map((j: any) => ({
            id: `adzuna-intern-${j.id}`,
            title: j.title || "",
            company: j.company?.display_name || "Unknown",
            location: j.location?.display_name || "Remote",
            description: j.description || "",
            url: j.redirect_url || "",
            salary: formatSalary(j.salary_min, j.salary_max),
            category: j.category?.label || "",
            contractTime: "Internship",
            postedDate: j.created || "",
            source: "Adzuna",
          }));
          allResults.push(...jobs);
        }
      }
    } catch { /* fail silently */ }
  }

  /* # Jooble internship-specific search */
  const joobleKey = process.env.JOOBLE_API_KEY;
  if (joobleKey) {
    try {
      const res = await fetch(`https://jooble.org/api/${joobleKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: `${keywords.split(" ").slice(0, 3).join(" OR ")} ${query}`,
          location: countryName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jobs = (data.jobs || []).map((j: any) => ({
          id: `jooble-intern-${j.id || Math.random().toString(36).slice(2)}`,
          title: j.title || "",
          company: j.company || "Unknown",
          location: j.location || "",
          description: stripHTML(j.snippet || ""),
          url: j.link || "",
          salary: j.salary || "",
          category: "Internship",
          contractTime: "Internship",
          postedDate: j.updated || "",
          source: "Jooble",
        }));
        allResults.push(...jobs);
      }
    } catch { /* fail silently */ }
  }

  /* # JSearch broadened internship search */
  const jsearchKey = process.env.JSEARCH_API_KEY;
  if (jsearchKey) {
    try {
      const topTerms = keywords.split(" ").slice(0, 4).join(" OR ");
      const searchQ = `(${topTerms}) ${query} in ${countryName}`;
      const params = new URLSearchParams({ query: searchQ, page: "1", num_pages: "1" });
      const res = await fetch(`https://jsearch.p.rapidapi.com/search?${params.toString()}`, {
        headers: { "X-RapidAPI-Key": jsearchKey, "X-RapidAPI-Host": "jsearch.p.rapidapi.com" },
      });
      if (res.ok) {
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jobs = (data.data || []).map((j: any) => ({
          id: `jsearch-intern-${j.job_id || Math.random().toString(36).slice(2)}`,
          title: j.job_title || "",
          company: j.employer_name || "Unknown",
          location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(", ") || "Remote",
          description: (j.job_description || "").slice(0, 500),
          url: j.job_apply_link || j.job_google_link || "",
          salary: j.job_min_salary && j.job_max_salary ? formatSalary(j.job_min_salary, j.job_max_salary) : "",
          category: "Internship",
          contractTime: "Internship",
          postedDate: j.job_posted_at_datetime_utc || "",
          source: j.job_publisher || "JSearch",
        }));
        allResults.push(...jobs);
      }
    } catch { /* fail silently */ }
  }

  return allResults;
}

/* ============================================================
   HELPERS
   ============================================================ */
function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "";
  if (min && max) return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
  if (min) return `From $${Math.round(min / 1000)}k`;
  if (max) return `Up to $${Math.round(max / 1000)}k`;
  return "";
}

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

function extractXML(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
}

function extractCDATA(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
  return match ? match[1].trim() : "";
}

/* Country code → country name for Jooble location + filtering */
const COUNTRY_NAMES: Record<string, string> = {
  au: "Australia", us: "United States", gb: "United Kingdom",
  ca: "Canada", de: "Germany", fr: "France", in: "India",
  nz: "New Zealand", sg: "Singapore", nl: "Netherlands",
  it: "Italy", br: "Brazil", za: "South Africa", at: "Austria",
  ch: "Switzerland", pl: "Poland", mx: "Mexico",
};

/* Major cities/states per country for location-based filtering */
const COUNTRY_MARKERS: Record<string, string[]> = {
  au: ["australia", "sydney", "melbourne", "brisbane", "perth", "adelaide", "canberra", "hobart", "darwin", "gold coast", "nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"],
  us: ["united states", "usa", "new york", "los angeles", "chicago", "san francisco", "seattle", "boston", "texas", "california", "florida"],
  gb: ["united kingdom", "london", "manchester", "birmingham", "edinburgh", "glasgow", "leeds", "bristol", "england", "scotland", "wales"],
  ca: ["canada", "toronto", "vancouver", "montreal", "ottawa", "calgary", "edmonton", "ontario", "british columbia", "quebec", "alberta"],
  nz: ["new zealand", "auckland", "wellington", "christchurch", "hamilton"],
  in: ["india", "bangalore", "mumbai", "delhi", "hyderabad", "pune", "chennai", "kolkata", "noida", "gurgaon"],
  de: ["germany", "berlin", "munich", "hamburg", "frankfurt", "cologne", "düsseldorf"],
  sg: ["singapore"],
  fr: ["france", "paris", "lyon", "marseille", "toulouse"],
};

/* Check if a job location matches the selected country */
function matchesCountry(jobLocation: string, country: string): boolean {
  if (!jobLocation) return true;
  const loc = jobLocation.toLowerCase();
  /* "Remote" or "Worldwide" always passes */
  if (loc.includes("remote") || loc.includes("worldwide") || loc.includes("anywhere")) return true;
  const markers = COUNTRY_MARKERS[country];
  if (!markers) return true;
  return markers.some(marker => loc.includes(marker));
}

/* Deduplicate by normalized title+company */
function deduplicateJobs(jobs: Job[]): Job[] {
  const seen = new Set<string>();
  return jobs.filter((j) => {
    const key = `${j.title.toLowerCase().trim()}|${j.company.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ============================================================
   MAIN HANDLER
   ============================================================ */
export const GET = safeHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const country = searchParams.get("country") || "us";
  const sponsorship = searchParams.get("sponsorship") === "true";
  const jobType = searchParams.get("jobType") || "";

  /* # When a job type is selected, prepend it to the search query
     so all sources return filtered results */
  const query = jobType ? `${jobType} ${rawQuery}`.trim() : rawQuery;

  /* Cache key based on normalized search params (15 min TTL) */
  const cacheKey = `jobs:${query.toLowerCase().trim()}:${location.toLowerCase().trim()}:${page}:${country}:${sponsorship}:${jobType}`;

  try {
    /* Check cache first — avoids hitting external APIs for repeated searches */
    const cached = await cacheGet<{ jobs: Job[]; total: number; page: number; source: string }>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    /* # Only include global remote boards when the user is searching
       for remote jobs or has no specific location. When searching
       a specific country + city, remote-only boards pollute results
       with irrelevant global listings. */
    const isRemoteSearch = !location || location.toLowerCase().includes("remote");

    /* # Build Jooble location: use user's city + country name so
       Jooble returns results from the correct country */
    const countryName = COUNTRY_NAMES[country] || "";
    const joobleLocation = location
      ? `${location}, ${countryName}`
      : countryName;

    /* Fetch all sources in parallel — each one fails gracefully */
    const isUK = country === "gb";
    const isInternship = jobType === "internship";

    const [adzunaJobs, joobleJobs, jsearchJobs, reedJobs, museJobs, findworkJobs, internshipJobs, remotiveJobs, remoteOKJobs, wwrJobs, arbeitnowJobs] = await Promise.all([
      fetchAdzuna(query, location, page, country).catch(() => [] as Job[]),
      fetchJooble(query, joobleLocation, page).catch(() => [] as Job[]),
      fetchJSearch(query, location, page, country).catch(() => [] as Job[]),
      isUK ? fetchReed(query, location).catch(() => [] as Job[]) : Promise.resolve([] as Job[]),
      fetchTheMuse(query, page).catch(() => [] as Job[]),
      fetchFindwork(query).catch(() => [] as Job[]),
      isInternship ? fetchInternships(rawQuery, country).catch(() => [] as Job[]) : Promise.resolve([] as Job[]),
      isRemoteSearch ? fetchRemotive(query).catch(() => [] as Job[]) : Promise.resolve([] as Job[]),
      isRemoteSearch ? fetchRemoteOK(query).catch(() => [] as Job[]) : Promise.resolve([] as Job[]),
      isRemoteSearch ? fetchWWR(query).catch(() => [] as Job[]) : Promise.resolve([] as Job[]),
      isRemoteSearch ? fetchArbeitnow(query).catch(() => [] as Job[]) : Promise.resolve([] as Job[]),
    ]);

    /* Merge all results and deduplicate */
    let allJobs = deduplicateJobs([
      ...internshipJobs,
      ...jsearchJobs,
      ...adzunaJobs,
      ...joobleJobs,
      ...reedJobs,
      ...museJobs,
      ...findworkJobs,
      ...remotiveJobs,
      ...remoteOKJobs,
      ...wwrJobs,
      ...arbeitnowJobs,
    ]);

    /* # Filter out jobs that don't match the selected country.
       Adzuna uses the country code in the URL so its results are
       usually correct, but Jooble and remote boards can leak
       results from other countries. */
    allJobs = allJobs.filter(job => matchesCountry(job.location, country));

    /* # Detect sponsorship signals from job descriptions (AU, US, UK) */
    if (["au", "us", "gb"].includes(country)) {
      allJobs = allJobs.map(job => {
        const result = detectSponsorship(job.description, job.title, country);
        return result ? { ...job, sponsorship: result } : job;
      });

      /* # When sponsorship filter is on, sort sponsored jobs to the top and hide "unavailable" */
      if (sponsorship) {
        allJobs = allJobs.filter(job => job.sponsorship !== "unavailable");
        allJobs.sort((a, b) =>
          (a.sponsorship === "available" ? 0 : 1) - (b.sponsorship === "available" ? 0 : 1)
        );
      }
    }

    /* Build source summary */
    const sources = [
      jsearchJobs.length > 0 && "LinkedIn/Indeed/Glassdoor",
      adzunaJobs.length > 0 && "Adzuna",
      joobleJobs.length > 0 && "Jooble",
      reedJobs.length > 0 && "Reed",
      museJobs.length > 0 && "The Muse",
      findworkJobs.length > 0 && "Findwork",
      internshipJobs.length > 0 && "Internship Search",
      remotiveJobs.length > 0 && "Remotive",
      remoteOKJobs.length > 0 && "RemoteOK",
      wwrJobs.length > 0 && "WeWorkRemotely",
      arbeitnowJobs.length > 0 && "Arbeitnow",
    ].filter(Boolean);

    const response = {
      jobs: allJobs,
      total: allJobs.length,
      page,
      source: sources.join(", ") || "none",
    };

    /* Cache for 15 minutes — reduces external API calls for identical searches */
    if (allJobs.length > 0) {
      await cacheSet(cacheKey, response, 900);
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Job search failed", jobs: [], source: "none" },
      { status: 200 }
    );
  }
});
