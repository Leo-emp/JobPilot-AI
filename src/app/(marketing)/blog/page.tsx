/* ============================================================
   BLOG PAGE - DB-Driven Blog Listing
   ============================================================
   Career advice and job search tips blog. Articles created by
   Marketing HQ's Blog Writer Agent, stored in BlogPost table.
   ISR: regenerates every hour for fresh content from the DB.
   ============================================================ */

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";

// # ISR: regenerate this page every hour to pick up newly published posts
export const revalidate = 3600;

export const metadata = {
  title: "Blog — JobPilot AI",
  description: "Career tips, resume advice, and job search strategies from the JobPilot AI team.",
};

// # Category color mapping — each category gets a distinct colour badge
// # Falls back to indigo if a new category is added without a colour assignment
const CATEGORY_COLORS: Record<string, string> = {
  "Resume Tips": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Interview Prep": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "LinkedIn": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Cover Letters": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Career Change": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Job Search": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Career Advice": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Networking": "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

export default async function BlogPage() {
  // # Fetch all published posts from the database, newest first
  // # dbRetry wraps with exponential backoff for transient Turso connection errors
  const posts = await dbRetry(() =>
    prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      // # Only select the fields we need for the listing cards — saves bandwidth
      select: {
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        readTime: true,
        coverImageUrl: true,  // # Optional cover image for visual cards
        publishedAt: true,
      },
    })
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      {/* # Page Header */}
      <div className="mb-16">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
          Blog
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Career advice, resume tips, and job search strategies to help you land your next role faster.
        </p>
      </div>

      {/* # Blog Post Grid — 2 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => {
          // # Look up the colour for this category, default to indigo
          const color = CATEGORY_COLORS[post.category] || "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";

          // # Format the date for display — "May 2, 2026"
          const dateStr = post.publishedAt
            ? post.publishedAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "";

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-card-border bg-space-800/60 overflow-hidden hover:border-brand-indigo/30 hover:bg-space-700/60 transition-all duration-300"
            >
              {/* # Cover image — only shown if the post has one (optional field) */}
              {post.coverImageUrl && (
                <div className="w-full h-40 overflow-hidden">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-7">
                {/* # Category badge + read time */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${color}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-text-muted">{post.readTime}</span>
                </div>

                {/* # Post title — highlights on hover */}
                <h2 className="text-xl font-bold mb-3 group-hover:text-brand-light transition-colors leading-tight">
                  {post.title}
                </h2>

                {/* # Short excerpt — gives readers a preview of the content */}
                <p className="text-base text-text-secondary leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* # Date + Read more CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{dateStr}</span>
                  <span className="text-sm text-brand-light font-medium group-hover:text-white transition-colors">
                    Read more &rarr;
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* # Empty state — shown when no posts exist yet in the DB */}
      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg">No blog posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
