/* ============================================================
   FEEDBACK API — User Feedback Collection + Admin Review
   ============================================================
   POST /api/feedback  — Submit feedback (authenticated users)
   GET  /api/feedback   — List all feedback (admin only)
   PATCH /api/feedback  — Update feedback status (admin only)
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { audit } from "@/lib/audit";
import { z } from "zod";

/* # Validate feedback payload */
const feedbackSchema = z.object({
  category: z.enum(["bug", "feature", "improvement", "other"]),
  message: z.string().min(1).max(2000),
});

/* # Validate status update payload */
const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "reviewed", "resolved"]),
});

/* ---- POST: Submit feedback ---- */
export const POST = safeHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid feedback data" }, { status: 400 });
  }

  const feedback = await dbRetry(() => prisma.feedback.create({
    data: {
      userId: session.user.id,
      email: session.user.email || "",
      category: parsed.data.category,
      message: parsed.data.message,
    },
  }));

  audit("feedback.submitted", {
    userId: session.user.id,
    email: session.user.email || undefined,
    category: parsed.data.category,
    feedbackId: feedback.id,
  });

  return NextResponse.json({ success: true });
});

/* ---- GET: List all feedback (admin only) ---- */
export const GET = safeHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = 30;

  const where = status && status !== "all" ? { status } : {};

  const [feedbacks, total] = await dbRetry(() => Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.feedback.count({ where }),
  ]));

  return NextResponse.json({
    feedbacks,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
});

/* ---- PATCH: Update feedback status (admin only) ---- */
export const PATCH = safeHandler(async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  await dbRetry(() => prisma.feedback.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  }));

  return NextResponse.json({ success: true });
});
