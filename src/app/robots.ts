/* ============================================================
   ROBOTS.TXT - Search Engine Crawl Directives
   ============================================================
   Next.js App Router generates /robots.txt automatically from
   this file. Tells search engines what to crawl and where the
   sitemap lives. Blocks dashboard/API routes from indexing.
   ============================================================ */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",     /* # Private user dashboard — no indexing */
          "/api/",           /* # API endpoints — not web pages */
          "/login",          /* # Auth pages — low SEO value */
          "/signup",
        ],
      },
    ],
    sitemap: "https://jobpilotai.co/sitemap.xml",
  };
}
