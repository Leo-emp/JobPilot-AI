/* ============================================================
   JSON-LD STRUCTURED DATA - Rich Snippets for Google
   ============================================================
   Injects schema.org structured data into the page head.
   Helps Google understand what the page IS (software app,
   article, organization) and display rich search results
   like star ratings, FAQ dropdowns, and article previews.
   ============================================================ */

/* # Prevent </script> breakout in JSON-LD (defense-in-depth) */
function safeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/<\/script/gi, "<\\/script");
}

/* # SoftwareApplication schema — for the homepage */
/* # Tells Google "this is a software product" with ratings and pricing */
export function SoftwareAppJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JobPilot AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://jobpilotai.co",
    description:
      "AI-powered career platform that optimizes your resume, matches you with jobs, generates cover letters, and prepares you for interviews.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
        name: "Free Plan",
        description: "5 AI actions per month, 1 resume, basic job search",
      },
      {
        "@type": "Offer",
        price: "29",
        priceCurrency: "GBP",
        name: "Pro Plan",
        description: "Unlimited AI actions, unlimited resumes, priority support",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

/* # Organization schema — who built this */
/* # sameAs links tell Google which social profiles belong to this brand */
/* # The more verified profiles, the stronger Google's confidence that YOU are "JobPilot AI" */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JobPilot AI",
    alternateName: ["JobPilotAI", "Job Pilot AI", "jobpilotai"],
    url: "https://jobpilotai.co",
    logo: "https://jobpilotai.co/icon.png",
    image: "https://jobpilotai.co/opengraph-image",
    description:
      "AI-powered career platform that helps job seekers land interviews faster with resume optimization, cover letter generation, mock interviews, and job matching.",
    foundingDate: "2026",
    sameAs: [
      "https://twitter.com/jobpilotai",
      "https://linkedin.com/company/jobpilotai",
      "https://github.com/Leo-emp/JobPilot-AI",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://jobpilotai.co/contact",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

/* # WebSite schema — tells Google this is the official "JobPilot AI" site */
/* # Strengthens brand ownership in search results over competitors with similar names */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JobPilot AI",
    alternateName: ["JobPilotAI", "Job Pilot AI"],
    url: "https://jobpilotai.co",
    description:
      "AI-powered career platform — resume optimization, cover letters, mock interviews, job matching.",
    publisher: {
      "@type": "Organization",
      name: "JobPilot AI",
      url: "https://jobpilotai.co",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

/* # BreadcrumbList schema — improves SERP display with navigation path */
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

/* # Article schema — for individual blog posts */
export function ArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://jobpilotai.co/blog/${slug}`,
    datePublished,
    author: {
      "@type": "Organization",
      name: "JobPilot AI",
      url: "https://jobpilotai.co",
    },
    publisher: {
      "@type": "Organization",
      name: "JobPilot AI",
      url: "https://jobpilotai.co",
      logo: {
        "@type": "ImageObject",
        url: "https://jobpilotai.co/opengraph-image",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
