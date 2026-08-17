/* ============================================================
   PORTFOLIO SOURCING — Find candidates via web search + Gemini
   ============================================================
   Uses Gemini to generate search queries, then fetches and
   parses portfolio/personal sites to extract candidate data.

   Flow:
   1. Gemini generates 3-5 search queries from role requirements
   2. Web search finds portfolio/personal sites
   3. Gemini parses each site to extract name, skills, contact
   4. Returns structured portfolio profiles

   Uses existing callGemini() from gemini.ts for AI calls.
   ============================================================ */

import { callGemini } from "@/lib/gemini";

/* # Represents a candidate found via portfolio/web search */
export interface PortfolioProfile {
  name: string;
  email: string | null;
  portfolioUrl: string;
  skills: string[];
  bio: string | null;
  projects: Array<{
    name: string;
    description: string | null;
    technologies: string[];
  }>;
  location: string | null;
}

/* # Generate search queries from role requirements using Gemini */
export async function generateSearchQueries(
  roleTitle: string,
  skills: string[],
  location?: string | null,
): Promise<string[]> {
  const prompt = `Generate exactly 3 web search queries to find freelance developers or engineers with personal portfolio websites who have skills matching this role.

Role: ${roleTitle}
Required skills: ${skills.join(", ")}
${location ? `Location preference: ${location}` : ""}

Rules:
- Each query should target personal portfolio sites, not job boards
- Include terms like "portfolio", "developer", "engineer"
- Vary the queries to find different types of profiles
- Return ONLY a JSON array of 3 strings, no explanation

Example output: ["react developer portfolio site", "senior frontend engineer portfolio projects", "typescript react developer personal website"]`;

  try {
    const result = await callGemini(prompt, 0.3);

    /* # Parse the JSON array from Gemini's response */
    const cleaned = result.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const queries = JSON.parse(cleaned);

    if (Array.isArray(queries) && queries.length > 0) {
      return queries.slice(0, 5);
    }
  } catch (err) {
    console.warn("[portfolio-sourcing] Failed to generate queries:", err);
  }

  /* # Fallback: generate a basic query */
  return [`${roleTitle} developer portfolio ${skills.slice(0, 2).join(" ")}`];
}

/* # Search the web for portfolio sites (uses Gemini grounding) */
export async function searchPortfolios(
  queries: string[],
  maxResults: number = 10,
): Promise<string[]> {
  /* # Use Gemini to find relevant URLs — it has web search grounding */
  const prompt = `Search the web for personal developer portfolio websites using these queries. Return the URLs of real portfolio/personal websites you find.

Queries:
${queries.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Rules:
- Only return personal portfolio or developer websites
- Do NOT return GitHub profiles, LinkedIn, job boards, or company sites
- Return up to ${maxResults} unique URLs
- Return ONLY a JSON array of URL strings, no explanation

Example: ["https://janedoe.dev", "https://example.com/portfolio"]`;

  try {
    const result = await callGemini(prompt, 0.3);
    const cleaned = result.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const urls = JSON.parse(cleaned);

    if (Array.isArray(urls)) {
      /* # Filter to valid URLs only */
      return urls
        .filter((u: unknown) => typeof u === "string" && u.startsWith("http"))
        .slice(0, maxResults);
    }
  } catch (err) {
    console.warn("[portfolio-sourcing] Web search failed:", err);
  }

  return [];
}

/* # Extract candidate data from a portfolio URL using Gemini */
export async function parsePortfolioSite(
  url: string,
): Promise<PortfolioProfile | null> {
  /* # Fetch the page content */
  let pageContent: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "JobPilot-AI-Sourcing/1.0 (hiring platform)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;

    const html = await res.text();
    /* # Strip HTML tags to get text content (keep it under 5000 chars for Gemini) */
    pageContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 5000);
  } catch {
    return null;
  }

  if (pageContent.length < 50) return null;

  /* # Use Gemini to extract structured data from the page */
  const prompt = `Extract candidate information from this portfolio website content. Return a JSON object with these fields:

{
  "name": "Full name",
  "email": "email@example.com or null",
  "skills": ["skill1", "skill2"],
  "bio": "Brief professional summary or null",
  "projects": [{"name": "Project name", "description": "Brief description", "technologies": ["tech1"]}],
  "location": "City, Country or null"
}

Website URL: ${url}
Page content (text-only):
${pageContent}

Rules:
- Extract ONLY information that is clearly present on the page
- Do NOT fabricate or guess any information
- skills should be technical skills (programming languages, frameworks, tools)
- If a field is not found, use null (for strings) or empty array (for arrays)
- Return ONLY the JSON object, no explanation`;

  try {
    const result = await callGemini(prompt, 0.1);
    const cleaned = result.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    /* # Validate required fields */
    if (!parsed.name || typeof parsed.name !== "string") return null;

    return {
      name: parsed.name,
      email: parsed.email ?? null,
      portfolioUrl: url,
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      bio: parsed.bio ?? null,
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      location: parsed.location ?? null,
    };
  } catch (err) {
    console.warn("[portfolio-sourcing] Parse failed for", url, err);
    return null;
  }
}

/* # Run the full portfolio sourcing pipeline */
export async function findPortfolioCandidates(
  roleTitle: string,
  skills: string[],
  location?: string | null,
  maxResults: number = 10,
): Promise<PortfolioProfile[]> {
  /* # Step 1: Generate search queries */
  const queries = await generateSearchQueries(roleTitle, skills, location);

  /* # Step 2: Search web for portfolio URLs */
  const urls = await searchPortfolios(queries, maxResults * 2);

  /* # Step 3: Parse each portfolio site */
  const profiles: PortfolioProfile[] = [];

  for (const url of urls) {
    if (profiles.length >= maxResults) break;

    const profile = await parsePortfolioSite(url);
    if (profile && profile.skills.length > 0) {
      profiles.push(profile);
    }
  }

  return profiles;
}
