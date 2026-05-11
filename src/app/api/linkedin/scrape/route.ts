/* ============================================================
   LINKEDIN PROFILE SCRAPER — Server-side route
   ============================================================
   Fetches a public LinkedIn profile URL and extracts whatever
   data is available without authentication:
   - Meta tags (og:title, og:description, og:image)
   - JSON-LD structured data (name, headline, location)
   - Any visible text in the page HTML

   LinkedIn blocks most server-side requests, so this is best-effort.
   Returns partial data + a flag indicating if the full profile was found.
   The frontend falls back to manual paste if scraping is limited.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/* ---- Validate that the URL is a real LinkedIn profile URL ---- */
function isValidLinkedInUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === "www.linkedin.com" || parsed.hostname === "linkedin.com") &&
      parsed.pathname.startsWith("/in/")
    );
  } catch {
    return false;
  }
}

/* ---- Extract content from meta tags ---- */
function extractMeta(html: string, property: string): string {
  /* Try property="..." first (Open Graph), then name="..." */
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtmlEntities(match[1]);
  }
  return "";
}

/* ---- Decode common HTML entities ---- */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

/* ---- Try to extract JSON-LD structured data from the page ---- */
function extractJsonLd(html: string): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    /* LinkedIn sometimes includes Person schema in JSON-LD */
    const match = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (match) {
      const data = JSON.parse(match[1]);
      if (data.name) result.name = data.name;
      if (data.jobTitle) result.headline = data.jobTitle;
      if (data.description) result.description = data.description;
      if (data.address?.addressLocality) result.location = data.address.addressLocality;
      if (data.address?.addressCountry) {
        result.location = result.location
          ? `${result.location}, ${data.address.addressCountry}`
          : data.address.addressCountry;
      }
      if (data.alumniOf) {
        const schools = Array.isArray(data.alumniOf) ? data.alumniOf : [data.alumniOf];
        result.education = schools.map((s: { name?: string }) => s.name).filter(Boolean).join(", ");
      }
      if (data.worksFor) {
        const companies = Array.isArray(data.worksFor) ? data.worksFor : [data.worksFor];
        result.currentCompany = companies.map((c: { name?: string }) => c.name).filter(Boolean).join(", ");
      }
    }
  } catch {
    /* JSON-LD parsing failed — not critical */
  }
  return result;
}

/* ---- Strip HTML tags and clean up whitespace ---- */
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ---- Main POST handler ---- */
export async function POST(req: NextRequest) {
  /* Auth check — only logged-in users can scrape */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const { url } = await req.json();

  /* Validate the URL */
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Please provide a LinkedIn profile URL." }, { status: 400 });
  }

  if (!isValidLinkedInUrl(url)) {
    return NextResponse.json(
      { error: "Invalid LinkedIn URL. Please use a URL like: https://www.linkedin.com/in/your-username" },
      { status: 400 }
    );
  }

  try {
    /* Fetch the LinkedIn page with browser-like headers */
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not reach LinkedIn. The profile may be private or the URL is incorrect." },
        { status: 502 }
      );
    }

    const html = await response.text();

    /* Extract Open Graph meta tags */
    const ogTitle = extractMeta(html, "og:title");           /* "FirstName LastName - Headline | LinkedIn" */
    const ogDescription = extractMeta(html, "og:description"); /* About section preview */
    const ogImage = extractMeta(html, "og:image");            /* Profile photo */
    const description = extractMeta(html, "description");     /* Sometimes has more detail */

    /* Extract JSON-LD structured data (name, jobTitle, education, employer) */
    const jsonLd = extractJsonLd(html);

    /* Parse name and headline from og:title: "FirstName LastName - Headline | LinkedIn" */
    let name = jsonLd.name || "";
    let headline = jsonLd.headline || "";
    if (ogTitle && !name) {
      const titleParts = ogTitle.replace(/ \| LinkedIn$/, "").split(" - ");
      name = titleParts[0]?.trim() || "";
      headline = titleParts.slice(1).join(" - ").trim() || "";
    }

    /* Use the longer description available */
    const about = ogDescription && description
      ? (description.length > ogDescription.length ? description : ogDescription)
      : (ogDescription || description || jsonLd.description || "");

    /* Try to extract any visible body text (limited — LinkedIn is JS-rendered) */
    const bodyText = stripHtml(html);
    /* Check if we got meaningful profile content (not just a login wall) */
    const hasRichContent = bodyText.length > 2000 && !bodyText.includes("Sign in") && bodyText.includes(name);

    /* Build the profile text from whatever we extracted */
    const sections: string[] = [];
    if (name) sections.push(`Name: ${name}`);
    if (headline) sections.push(`Headline: ${headline}`);
    if (jsonLd.location) sections.push(`Location: ${jsonLd.location}`);
    if (jsonLd.currentCompany) sections.push(`Current Company: ${jsonLd.currentCompany}`);
    if (about) sections.push(`\nAbout:\n${about}`);
    if (jsonLd.education) sections.push(`\nEducation: ${jsonLd.education}`);

    const profileText = sections.join("\n");
    const isPartial = !hasRichContent;

    return NextResponse.json({
      success: true,
      profileText,
      name,
      headline,
      about,
      location: jsonLd.location || "",
      currentCompany: jsonLd.currentCompany || "",
      education: jsonLd.education || "",
      photoUrl: ogImage || "",
      isPartial,
      message: isPartial
        ? "We extracted basic info from your public profile. For a complete audit, please paste your full profile text below — go to your LinkedIn profile, select all (Ctrl+A), copy (Ctrl+C), and paste."
        : "Profile data loaded successfully!",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch LinkedIn profile. Please paste your profile text manually instead." },
      { status: 500 }
    );
  }
}
