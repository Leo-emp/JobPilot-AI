/* ============================================================
   BLOG POST PAGE - DB-Driven Article View
   ============================================================
   Fetches blog post from BlogPost table by slug. Renders
   markdown content with react-markdown. ISR for fresh content.
   generateStaticParams pre-builds known slugs at deploy time.
   ============================================================ */

import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

// # ISR: regenerate each article page every hour so new content is picked up
export const revalidate = 3600;

// # Category color mapping — must match the listing page colors for visual consistency
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

// # Pre-build static paths for all published posts at deploy time
// # Any slug NOT in this list is generated on-demand and cached (fallback: true equivalent via ISR)
export async function generateStaticParams() {
  // # Use prisma directly (no dbRetry) — build-time failure is acceptable here
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  // # Return array of { slug } objects as required by Next.js generateStaticParams
  return posts.map((p) => ({ slug: p.slug }));
}

// # SEO metadata — unique title, description, and OG tags per post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // # Fetch just enough fields to build metadata — no need for full content here
  const post = await dbRetry(() =>
    prisma.blogPost.findUnique({
      where: { slug },
      select: {
        title: true,
        excerpt: true,
        metaTitle: true,
        metaDescription: true,
        coverImageUrl: true,
        publishedAt: true,
        status: true,
      },
    })
  );

  // # Return minimal metadata if post not found or not published
  if (!post || post.status !== "published") {
    return { title: "Post Not Found — JobPilot AI" };
  }

  // # metaTitle and metaDescription override the defaults if set (for SEO fine-tuning)
  const description = post.metaDescription || post.excerpt;
  const title = post.metaTitle || `${post.title} — JobPilot AI Blog`;

  return {
    title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      url: `https://jobpilotai.co/blog/${slug}`,
      // # Include cover image in OG tags if available (Twitter card + link previews)
      ...(post.coverImageUrl
        ? { images: [{ url: post.coverImageUrl, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.coverImageUrl ? { images: [post.coverImageUrl] } : {}),
    },
  };
}

// # Blog Post Page Component — renders the full article
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // # Fetch the full post from DB — includes content for rendering
  const post = await dbRetry(() =>
    prisma.blogPost.findUnique({ where: { slug } })
  );

  // # 404 if post doesn't exist or is not published (draft/archived posts are private)
  if (!post || post.status !== "published") {
    notFound();
  }

  // # Look up the colour for this category badge
  const color = CATEGORY_COLORS[post.category] || "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";

  // # Format dates for display and structured data
  const dateStr = post.publishedAt
    ? post.publishedAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  // # ISO date for ArticleJsonLd structured data (Google rich results)
  const dateISO = post.publishedAt?.toISOString().split("T")[0] || "";

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      {/* # Structured data for Google — helps with rich results in search */}
      <ArticleJsonLd
        title={post.title}
        description={post.metaDescription || post.excerpt}
        slug={slug}
        datePublished={dateISO}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://jobpilotai.co" },
        { name: "Blog", url: "https://jobpilotai.co/blog" },
        { name: post.title, url: `https://jobpilotai.co/blog/${slug}` },
      ]} />

      {/* # Back to listing link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-light transition-colors mb-10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      {/* # Cover image — displayed full-width above the title if set */}
      {post.coverImageUrl && (
        <div className="w-full rounded-2xl overflow-hidden mb-8">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-auto object-cover"
            width={1200}
            height={630}
          />
        </div>
      )}

      {/* # Post Header — category, read time, date, and title */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${color}`}>
            {post.category}
          </span>
          <span className="text-xs text-text-muted">{post.readTime}</span>
          <span className="text-xs text-text-muted">{dateStr}</span>
        </div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold glow-text-strong leading-tight">
          {post.title}
        </h1>
      </div>

      {/* # Article Content — markdown from DB rendered via react-markdown
          # Each element type gets custom dark-theme styling to match the site */}
      <article className="prose-custom">
        <ReactMarkdown
          components={{
            // # H2 headings — section titles in the article
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold text-white mt-10 mb-4">{children}</h2>
            ),
            // # H3 headings — sub-sections within each section
            h3: ({ children }) => (
              <h3 className="text-xl font-bold text-white mt-8 mb-3">{children}</h3>
            ),
            // # Body paragraphs — muted colour for readability on dark background
            p: ({ children }) => (
              <p className="text-text-secondary leading-relaxed mb-4">{children}</p>
            ),
            // # Unordered lists — disc markers with spacing
            ul: ({ children }) => (
              <ul className="list-disc ml-6 mb-4">{children}</ul>
            ),
            // # Ordered lists — numbered with spacing
            ol: ({ children }) => (
              <ol className="list-decimal ml-6 mb-4">{children}</ol>
            ),
            // # List items — muted colour for readability
            li: ({ children }) => (
              <li className="text-text-secondary leading-relaxed">{children}</li>
            ),
            // # Bold text — white to stand out against muted body copy
            strong: ({ children }) => (
              <strong className="text-white font-semibold">{children}</strong>
            ),
            // # Links — brand colour, open external links in new tab
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-brand-light hover:text-white underline transition-colors"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>

      {/* # CTA Banner — nudges readers to try JobPilot AI after consuming the content */}
      <div className="mt-16 rounded-2xl border border-card-border bg-space-800/60 p-8 text-center">
        <h3 className="text-xl font-bold mb-3">Ready to Put This Into Practice?</h3>
        <p className="text-text-secondary text-base mb-6 max-w-md mx-auto">
          JobPilot AI helps you build ATS-optimized resumes, write tailored cover letters, and prepare for interviews — all powered by AI.
        </p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">
          Try JobPilot AI Free
        </Link>
      </div>

      {/* # Footer navigation back to the blog listing */}
      <div className="mt-10 text-center">
        <Link href="/blog" className="text-sm text-brand-light hover:text-white transition-colors">
          &larr; Back to all posts
        </Link>
      </div>
    </div>
  );
}
