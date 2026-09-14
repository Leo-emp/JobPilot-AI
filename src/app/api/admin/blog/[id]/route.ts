/* ============================================================
   ADMIN BLOG SINGLE POST — /api/admin/blog/[id]
   ============================================================
   GET: Fetch a single blog post by id (for editing)
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";

export const GET = safeHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  const post = await dbRetry(() =>
    prisma.blogPost.findUnique({ where: { id } })
  );

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
});
