/* ============================================================
   INTERNAL BLOG POSTS — /api/internal/blog-posts
   ============================================================
   POST: Receive published articles from Marketing HQ.
   GET:  Return all existing slugs for duplicate avoidance.
   Protected by INTERNAL_API_SECRET Bearer token.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";

// # Verify internal API secret — shared with Marketing HQ
function verifyAuth(req: NextRequest): boolean {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${secret}`;

  // # Timing-safe comparison prevents timing attacks on the secret
  // # Both buffers must be the same length for timingSafeEqual to work
  if (
    !authHeader ||
    authHeader.length !== expected.length ||
    !timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))
  ) {
    return false;
  }
  return true;
}

// # POST: Create a new published blog post from Marketing HQ
export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // # Validate required fields — Marketing HQ must supply these
  const { slug, title, excerpt, content, category, readTime } = body;
  if (!slug || !title || !excerpt || !content || !category || !readTime) {
    return NextResponse.json(
      {
        error: "Missing required fields: slug, title, excerpt, content, category, readTime",
      },
      { status: 400 }
    );
  }

  try {
    // # Check for duplicate slug — prevent overwrites from accidental retries
    const existing = await dbRetry(() =>
      prisma.blogPost.findUnique({ where: { slug } })
    );
    if (existing) {
      return NextResponse.json(
        { error: `Blog post with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    // # Create the blog post as published — immediate availability for ISR
    const post = await dbRetry(() =>
      prisma.blogPost.create({
        data: {
          slug,
          title,
          excerpt,
          content,
          category,
          // # Optional fields — fallback to null if not provided
          tags: body.tags || null,
          metaTitle: body.metaTitle || null,
          metaDescription: body.metaDescription || null,
          coverImageUrl: body.coverImageUrl || null,
          // # Default author to JobPilot AI Team if not specified
          author: body.author || "JobPilot AI Team",
          readTime,
          // # Immediately set as published — no draft stage for Marketing HQ posts
          status: "published",
          publishedAt: new Date(),
        },
      })
    );

    // # Return the created post ID and slug for confirmation
    return NextResponse.json({ id: post.id, slug: post.slug }, { status: 201 });
  } catch (err) {
    console.error("Failed to create blog post:", err);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

// # GET: Return all existing slugs for duplicate avoidance
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // # Fetch only the slug field to minimize response size
    // # This is called by Marketing HQ before publishing to check for duplicates
    const posts = await dbRetry(() =>
      prisma.blogPost.findMany({
        select: { slug: true },
      })
    );

    // # Return the list of slugs as a JSON object
    return NextResponse.json({ slugs: posts.map((p) => p.slug) });
  } catch (err) {
    console.error("Failed to fetch blog post slugs:", err);
    return NextResponse.json(
      { error: "Failed to fetch blog post slugs" },
      { status: 500 }
    );
  }
}
