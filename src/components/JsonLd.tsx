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
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JobPilot AI",
    url: "https://jobpilotai.co",
    logo: "https://jobpilotai.co/opengraph-image",
    sameAs: [
      "https://twitter.com/jobpilotai",
      "https://linkedin.com/company/jobpilotai",
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
