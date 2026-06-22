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
import { dbRetry } from "@/lib/db-retry";

/* # Blog slugs are now fetched dynamically from the BlogPost table.
   # The BLOG_SLUGS constant has been removed — see the blogPages block below. */

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

  /* # SEO feature landing pages — target high-value keywords */
  const featurePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/features/resume-builder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/features/cover-letter-generator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/features/interview-prep`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/features/portfolio-builder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/features/application-tracker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];

  /* # Blog post pages — dynamic from BlogPost table
     # Fetches all published slugs and their updatedAt timestamps from the DB.
     # Try/catch ensures a DB error never breaks the sitemap — static pages still get indexed. */
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await dbRetry(() => prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    }));
    blogPages = blogPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,  // # Use actual DB timestamp instead of new Date()
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    /* # DB error shouldn't break sitemap — silently skip blog pages */
  }

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

  return [...staticPages, ...featurePages, ...blogPages, ...portfolioPages];
}
