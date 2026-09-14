/* ============================================================
   ADMIN BLOG API — /api/admin/blog
   ============================================================
   CRUD for blog posts. Admin-only.
   GET:    List all posts (published + drafts)
   POST:   Create a new post
   PUT:    Update an existing post
   DELETE: Delete a post by id
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";

/* # Admin gate — reused across all methods */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) return null;
  return session;
}

/* # GET: List all blog posts (newest first) */
export const GET = safeHandler(async () => {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  /* # Fetch all posts including drafts — admin sees everything */
  const posts = await dbRetry(() =>
    prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        status: true,
        readTime: true,
        publishedAt: true,
        createdAt: true,
      },
    })
  );

  return NextResponse.json({ posts });
});

/* # POST: Create a new blog post */
export const POST = safeHandler(async (req: NextRequest) => {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { title, slug, excerpt, content, category, tags, readTime, status } = body;

  /* # Validate required fields */
  if (!title || !slug || !excerpt || !content || !category || !readTime) {
    return NextResponse.json(
      { error: "Missing required fields: title, slug, excerpt, content, category, readTime" },
      { status: 400 }
    );
  }

  /* # Check for duplicate slug */
  const existing = await dbRetry(() =>
    prisma.blogPost.findUnique({ where: { slug } })
  );
  if (existing) {
    return NextResponse.json(
      { error: `Slug "${slug}" already exists` },
      { status: 409 }
    );
  }

  /* # Create the post — publish immediately if status is "published" */
  const post = await dbRetry(() =>
    prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags || null,
        readTime,
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : null,
      },
    })
  );

  return NextResponse.json({ id: post.id, slug: post.slug }, { status: 201 });
});

/* # PUT: Update an existing blog post */
export const PUT = safeHandler(async (req: NextRequest) => {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing post id" }, { status: 400 });
  }

  /* # If publishing for the first time, set publishedAt */
  if (updates.status === "published") {
    const existing = await dbRetry(() =>
      prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } })
    );
    if (!existing?.publishedAt) {
      updates.publishedAt = new Date();
    }
  }

  const post = await dbRetry(() =>
    prisma.blogPost.update({ where: { id }, data: updates })
  );

  return NextResponse.json({ id: post.id, slug: post.slug });
});

/* # DELETE: Remove a blog post */
export const DELETE = safeHandler(async (req: NextRequest) => {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing post id" }, { status: 400 });
  }

  await dbRetry(() => prisma.blogPost.delete({ where: { id } }));

  return NextResponse.json({ deleted: true });
});
