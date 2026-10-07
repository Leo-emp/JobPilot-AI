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
    name: "JP Arc",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://jobpilotai.co",
    description:
      "Free AI resume builder, CV templates, ATS checker, mock interview practice, cover letter generator, and job application tracker. Build and download your resume in minutes.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
        name: "Free Plan",
        description: "Resume builder, CV templates, ATS checker, mock interviews, cover letters — all free",
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
/* # disambiguatingDescription helps Google distinguish JP Arc from J-PARC */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://jobpilotai.co/#organization",
    name: "JP Arc",
    alternateName: ["JP Arc AI", "JP Arc Career Platform", "JobPilot AI", "JPArc"],
    url: "https://jobpilotai.co",
    logo: {
      "@type": "ImageObject",
      url: "https://jobpilotai.co/icon-512.png",
      width: 512,
      height: 512,
    },
    image: "https://jobpilotai.co/opengraph-image",
    description:
      "JP Arc is an AI-powered career platform that helps job seekers build ATS-optimized resumes, generate cover letters, practice mock interviews, and track job applications.",
    disambiguatingDescription:
      "JP Arc is a career technology company and AI job search platform at jobpilotai.co — not to be confused with J-PARC (Japan Proton Accelerator Research Complex) or ARC Academy language school.",
    foundingDate: "2026",
    knowsAbout: [
      "artificial intelligence",
      "resume building",
      "career coaching",
      "job search",
      "interview preparation",
      "ATS optimization",
      "cover letter writing",
    ],
    slogan: "Your AI-Powered Career Co-Pilot",
    sameAs: [
      "https://twitter.com/jobpilotai",
      "https://linkedin.com/company/jobpilotai",
      "https://github.com/Leo-emp/JobPilot-AI",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://jobpilotai.co/contact",
      email: "support@jobpilotai.co",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

/* # WebSite schema — tells Google this is the official "JP Arc" site */
/* # Strengthens brand ownership in search results over competitors with similar names */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://jobpilotai.co/#website",
    name: "JP Arc",
    alternateName: ["JP Arc AI", "JP Arc Career Platform", "JobPilot AI", "JPArc"],
    url: "https://jobpilotai.co",
    description:
      "JP Arc is a free AI career platform — resume builder, CV templates, ATS checker, mock interviews, cover letters, and job matching at jobpilotai.co.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://jobpilotai.co/tools?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@id": "https://jobpilotai.co/#organization",
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

/* # FAQPage schema — expandable Q&A dropdowns in Google search results */
export function FAQPageJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
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
      name: "JP Arc",
      url: "https://jobpilotai.co",
    },
    publisher: {
      "@type": "Organization",
      name: "JP Arc",
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
