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
import { cacheGet, cacheSet } from "@/lib/redis";
import { isKnownSponsor } from "@/lib/australian-sponsors";

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
  sponsorsVisas?: boolean;
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
      description: desc.slice(0, 500),
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
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const country = searchParams.get("country") || "us";
  const sponsorship = searchParams.get("sponsorship") === "true";

  /* # For sponsorship searches, boost query with visa keywords */
  const effectiveQuery = sponsorship
    ? `${query} visa sponsorship`.trim()
    : query;

  /* Cache key based on normalized search params (15 min TTL) */
  const cacheKey = `jobs:${query.toLowerCase().trim()}:${location.toLowerCase().trim()}:${page}:${country}:${sponsorship}`;

  try {
    /* Check cache first — avoids hitting external APIs for repeated searches */
    const cached = await cacheGet<{ jobs: Job[]; total: number; page: number; source: string }>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    /* Fetch all sources in parallel — each one fails gracefully */
    const [adzunaJobs, joobleJobs, remotiveJobs, remoteOKJobs, wwrJobs] = await Promise.all([
      fetchAdzuna(sponsorship ? effectiveQuery : query, location, page, country).catch(() => [] as Job[]),
      fetchJooble(sponsorship ? effectiveQuery : query, location, page).catch(() => [] as Job[]),
      fetchRemotive(query).catch(() => [] as Job[]),
      fetchRemoteOK(query).catch(() => [] as Job[]),
      fetchWWR(query).catch(() => [] as Job[]),
    ]);

    /* Merge all results and deduplicate */
    let allJobs = deduplicateJobs([
      ...adzunaJobs,
      ...joobleJobs,
      ...remotiveJobs,
      ...remoteOKJobs,
      ...wwrJobs,
    ]);

    /* # Badge jobs from known sponsors (especially useful for AU searches) */
    if (country === "au") {
      allJobs = allJobs.map(job => ({
        ...job,
        sponsorsVisas: isKnownSponsor(job.company),
      }));

      /* # When sponsorship filter is on, sort sponsor-friendly jobs to the top */
      if (sponsorship) {
        allJobs.sort((a, b) => (b.sponsorsVisas ? 1 : 0) - (a.sponsorsVisas ? 1 : 0));
      }
    }

    /* Build source summary */
    const sources = [
      adzunaJobs.length > 0 && "Adzuna",
      joobleJobs.length > 0 && "Jooble",
      remotiveJobs.length > 0 && "Remotive",
      remoteOKJobs.length > 0 && "RemoteOK",
      wwrJobs.length > 0 && "WeWorkRemotely",
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
}
