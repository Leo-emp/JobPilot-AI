/* ============================================================
   LINKEDIN PROFILE SCRAPER — Server-side route
   ============================================================
   Fetches a public LinkedIn profile URL and extracts whatever
   data is available without authentication:
   - Meta tags (og:title, og:description, og:image)
   - JSON-LD structured data (name, headline, location)

   LinkedIn blocks most server-side requests or redirects to a
   login page. This scraper handles that gracefully:
   - Tries multiple User-Agent strings
   - Accepts ANY response (even login walls) and still extracts meta tags
   - Returns partial data with a clear message to paste more
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/* ---- Normalize URL: add https:// if missing ---- */
function normalizeUrl(url: string): string {
  let u = url.trim().replace(/\/+$/, "");
  if (!u.startsWith("http://") && !u.startsWith("https://")) {
    u = "https://" + u;
  }
  return u;
}

/* ---- Validate that the URL points to a LinkedIn profile ---- */
function isValidLinkedInUrl(url: string): boolean {
  try {
    const parsed = new URL(normalizeUrl(url));
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

/* ---- Fetch HTML from LinkedIn, trying multiple strategies ---- */
async function fetchLinkedInPage(url: string): Promise<string | null> {
  /* Different User-Agents to try — LinkedIn treats some better than others */
  const strategies: Record<string, string>[] = [
    {
      "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Accept": "text/html",
    },
    {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
    },
    {
      "User-Agent": "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)",
      "Accept": "text/html",
    },
  ];

  for (const headers of strategies) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        headers,
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      /* Accept ANY response — even login walls have meta tags */
      const html = await response.text();
      /* If we got HTML with meta tags, that's good enough */
      if (html.includes("og:title") || html.includes("og:description") || html.includes("ld+json")) {
        return html;
      }
      /* If we got substantial HTML, return it even without meta tags */
      if (html.length > 1000) return html;
    } catch {
      /* This strategy failed — try the next one */
      continue;
    }
  }
  return null;
}

/* ---- Main POST handler ---- */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Please provide a LinkedIn profile URL." }, { status: 400 });
  }

  if (!isValidLinkedInUrl(url)) {
    return NextResponse.json(
      { error: "Invalid LinkedIn URL. Use a URL like: linkedin.com/in/your-username" },
      { status: 400 }
    );
  }

  /* Normalize the URL (add https:// etc.) */
  const normalizedUrl = normalizeUrl(url);

  try {
    /* Try multiple strategies to fetch the page */
    const html = await fetchLinkedInPage(normalizedUrl);

    if (!html) {
      /* All strategies failed — return a helpful message instead of an error */
      return NextResponse.json({
        success: true,
        profileText: "",
        name: "",
        headline: "",
        about: "",
        location: "",
        currentCompany: "",
        education: "",
        photoUrl: "",
        isPartial: true,
        message: "LinkedIn is blocking automated access to this profile. Please paste your profile text manually — go to your LinkedIn profile, press Ctrl+A to select all, Ctrl+C to copy, then paste below.",
      });
    }

    /* Extract Open Graph meta tags */
    const ogTitle = extractMeta(html, "og:title");
    const ogDescription = extractMeta(html, "og:description");
    const ogImage = extractMeta(html, "og:image");
    const description = extractMeta(html, "description");
    const twitterTitle = extractMeta(html, "twitter:title");
    const twitterDesc = extractMeta(html, "twitter:description");

    /* Extract JSON-LD structured data */
    const jsonLd = extractJsonLd(html);

    /* Parse name and headline from og:title or twitter:title */
    let name = jsonLd.name || "";
    let headline = jsonLd.headline || "";
    const titleStr = ogTitle || twitterTitle || "";
    if (titleStr && !name) {
      const titleParts = titleStr.replace(/ \| LinkedIn$/i, "").split(" - ");
      name = titleParts[0]?.trim() || "";
      headline = titleParts.slice(1).join(" - ").trim() || "";
    }

    /* Use the longest description available */
    const descriptions = [ogDescription, description, twitterDesc, jsonLd.description || ""].filter(Boolean);
    const about = descriptions.sort((a, b) => b.length - a.length)[0] || "";

    /* Build profile text from extracted data */
    const sections: string[] = [];
    if (name) sections.push(`Name: ${name}`);
    if (headline) sections.push(`Headline: ${headline}`);
    if (jsonLd.location) sections.push(`Location: ${jsonLd.location}`);
    if (jsonLd.currentCompany) sections.push(`Current Company: ${jsonLd.currentCompany}`);
    if (about) sections.push(`\nAbout:\n${about}`);
    if (jsonLd.education) sections.push(`\nEducation: ${jsonLd.education}`);

    const profileText = sections.join("\n");
    const hasData = name || headline || about;

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
      isPartial: true,
      message: hasData
        ? "We extracted basic info from your public profile. For a more thorough analysis, paste your full profile text below."
        : "LinkedIn limited what we could access. Please paste your full profile text below for analysis.",
    });
  } catch {
    /* Even on error, return a success response with guidance instead of failing */
    return NextResponse.json({
      success: true,
      profileText: "",
      name: "",
      headline: "",
      about: "",
      location: "",
      currentCompany: "",
      education: "",
      photoUrl: "",
      isPartial: true,
      message: "Could not access this LinkedIn profile. Please paste your profile text manually — go to your LinkedIn profile, press Ctrl+A, Ctrl+C, and paste below.",
    });
  }
}
