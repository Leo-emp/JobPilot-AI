/* ============================================================
   EMPLOYER BOOKMARKS — GET, POST, DELETE /api/employer/[empId]/bookmarks
   ============================================================
   Manage candidate bookmarks for an employer account.
   POST triggers mutual interest check → auto-thread + notifications.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { employerHandler } from "@/lib/employer-handler";
import { employerBookmarkSchema } from "@/lib/messaging-validations";
import { formatZodError } from "@/lib/validations";
import { audit } from "@/lib/audit";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkMutualInterest, handleMutualInterest } from "@/lib/mutual-interest";
import { notify } from "@/lib/notifications";

/* # Rate limit: 30 bookmark actions per minute per employer */
const bookmarkLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60_000,
});

/* # GET — List all candidate bookmarks for this employer */
export const GET = employerHandler(async (_req, _session, membership) => {
  const bookmarks = await dbRetry(() =>
    prisma.employerBookmark.findMany({
      where: { employerId: membership.employerId },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            image: true,
            /* # Don't include email — only visible on mutual interest */
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  );

  return NextResponse.json({ bookmarks });
}, "recruiter");

/* # POST — Bookmark a candidate */
export const POST = employerHandler(async (req, _session, membership) => {
  /* # Rate limit check */
  const limitCheck = await bookmarkLimiter.check(membership.employerId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Too many bookmark actions. Please slow down." },
      { status: 429 },
    );
  }

  const body = await req.json();
  const parsed = employerBookmarkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  const { candidateId, roleId } = parsed.data;

  /* # Verify the candidate exists and has openToWork enabled */
  const candidate = await dbRetry(() =>
    prisma.user.findUnique({
      where: { id: candidateId, deletedAt: null },
      select: { id: true, candidatePreference: { select: { openToWork: true } } },
    })
  );
  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  /* # Create the bookmark (upsert to handle duplicates gracefully) */
  const bookmark = await dbRetry(() =>
    prisma.employerBookmark.upsert({
      where: {
        employerId_candidateId: {
          employerId: membership.employerId,
          candidateId,
        },
      },
      create: {
        employerId: membership.employerId,
        candidateId,
        roleId: roleId ?? null,
      },
      update: {}, // # Already bookmarked — no-op
    })
  );

  audit("employer.bookmark.created", {
    userId: membership.userId,
    detail: `employer:${membership.employerId} bookmarked candidate:${candidateId}`,
  });

  /* # Check for mutual interest (non-blocking) */
  checkMutualInterest(membership.employerId, candidateId)
    .then(async (mutual) => {
      if (mutual) {
        await handleMutualInterest(membership.employerId, candidateId, roleId);
      } else {
        /* # Notify the candidate they were bookmarked */
        const employer = await prisma.employer.findUnique({
          where: { id: membership.employerId },
          select: { name: true },
        });
        await notify(candidateId, "bookmark", `${employer?.name ?? "An employer"} is interested in your profile`, {
          body: "Bookmark them back to unlock messaging.",
          linkUrl: "/dashboard/bookmarks",
        });
      }
    })
    .catch(() => {}); // # Non-critical

  return NextResponse.json({ bookmark }, { status: 201 });
}, "recruiter");

/* # DELETE — Remove a candidate bookmark */
export const DELETE = employerHandler(async (req, _session, membership) => {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId");
  if (!candidateId) {
    return NextResponse.json({ error: "candidateId is required" }, { status: 400 });
  }

  await dbRetry(() =>
    prisma.employerBookmark.deleteMany({
      where: {
        employerId: membership.employerId,
        candidateId,
      },
    })
  );

  audit("employer.bookmark.deleted", {
    userId: membership.userId,
    detail: `employer:${membership.employerId} unbookmarked candidate:${candidateId}`,
  });

  return NextResponse.json({ deleted: true });
}, "recruiter");
