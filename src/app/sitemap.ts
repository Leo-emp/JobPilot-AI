/* ============================================================
   SITEMAP - Dynamic XML Sitemap for Search Engines
   ============================================================
   Next.js App Router generates /sitemap.xml automatically from
   this file. Includes all marketing pages, blog posts, and
   published portfolios. Google Search Console reads this to
   discover and index all pages efficiently.
   ============================================================ */

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

/* # Blog slugs — must match the posts defined in the blog page */
const BLOG_SLUGS = [
  "how-to-beat-ats-systems-2026",
  "linkedin-profile-mistakes",
  "cover-letter-that-gets-read",
  "career-change-resume-guide",
  "interview-questions-you-will-be-asked",
  "remote-job-search-strategy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://jobpilotai.co";

  /* # Static marketing pages */
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  /* # Blog post pages */
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* # Published portfolio pages — these are user-generated public content */
  let portfolioPages: MetadataRoute.Sitemap = [];
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    portfolioPages = portfolios.map((p) => ({
      url: `${baseUrl}/p/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    /* # DB error shouldn't break the sitemap — static pages still get indexed */
  }

  return [...staticPages, ...blogPages, ...portfolioPages];
}
