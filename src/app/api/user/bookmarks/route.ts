/* ============================================================
   CANDIDATE BOOKMARKS — GET, POST, DELETE /api/user/bookmarks
   ============================================================
   Manage employer/role bookmarks for the authenticated candidate.
   POST triggers mutual interest check → auto-thread + notifications.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler, type AuthSession } from "@/lib/api-handler";
import { candidateBookmarkSchema } from "@/lib/messaging-validations";
import { formatZodError } from "@/lib/validations";
import { audit } from "@/lib/audit";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkMutualInterest, handleMutualInterest } from "@/lib/mutual-interest";

/* # Rate limit: 20 bookmark actions per minute per user */
const bookmarkLimiter = createRateLimiter({
  maxRequests: 20,
  windowMs: 60_000,
});

/* # GET — List all bookmarks for the authenticated user */
export const GET = authHandler(async (_req: NextRequest, session: AuthSession) => {
  const bookmarks = await dbRetry(() =>
    prisma.candidateBookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
  );

  /* # Enrich with employer names + role titles */
  const employerIds = [...new Set(bookmarks.filter((b) => b.employerId).map((b) => b.employerId!))];
  const roleIds = [...new Set(bookmarks.filter((b) => b.roleId).map((b) => b.roleId!))];

  const [employers, roles] = await Promise.all([
    employerIds.length > 0
      ? dbRetry(() =>
          prisma.employer.findMany({
            where: { id: { in: employerIds } },
            select: { id: true, name: true, slug: true, logoUrl: true, industry: true },
          })
        )
      : [],
    roleIds.length > 0
      ? dbRetry(() =>
          prisma.role.findMany({
            where: { id: { in: roleIds } },
            select: { id: true, title: true, employerId: true, locationType: true, salaryMin: true, salaryMax: true },
          })
        )
      : [],
  ]);

  const employerMap = Object.fromEntries(employers.map((e) => [e.id, e]));
  const roleMap = Object.fromEntries(roles.map((r) => [r.id, r]));

  /* # Check mutual interest status for each employer bookmark */
  const enriched = await Promise.all(
    bookmarks.map(async (b) => {
      const employerId = b.employerId ?? roleMap[b.roleId!]?.employerId;
      let mutualInterest = false;
      if (employerId) {
        const empBookmark = await prisma.employerBookmark.findUnique({
          where: { employerId_candidateId: { employerId, candidateId: session.user.id } },
        });
        mutualInterest = !!empBookmark;
      }

      return {
        ...b,
        employer: b.employerId ? employerMap[b.employerId] ?? null : null,
        role: b.roleId ? roleMap[b.roleId] ?? null : null,
        mutualInterest,
      };
    })
  );

  return NextResponse.json({ bookmarks: enriched });
});

/* # POST — Bookmark an employer or role */
export const POST = authHandler(async (req: NextRequest, session: AuthSession) => {
  /* # Rate limit check */
  const limitCheck = await bookmarkLimiter.check(session.user.id);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Too many bookmark actions. Please slow down." },
      { status: 429 },
    );
  }

  const body = await req.json();
  const parsed = candidateBookmarkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  const { employerId, roleId } = parsed.data;

  /* # Verify the employer/role exists */
  if (employerId) {
    const employer = await prisma.employer.findUnique({
      where: { id: employerId, deletedAt: null },
    });
    if (!employer) {
      return NextResponse.json({ error: "Employer not found" }, { status: 404 });
    }
  }
  if (roleId) {
    const role = await prisma.role.findUnique({
      where: { id: roleId, status: "active" },
    });
    if (!role) {
      return NextResponse.json({ error: "Role not found or not active" }, { status: 404 });
    }
  }

  /* # Create the bookmark */
  const bookmark = await dbRetry(() =>
    prisma.candidateBookmark.create({
      data: {
        userId: session.user.id,
        employerId: employerId ?? null,
        roleId: roleId ?? null,
      },
    })
  ).catch(async () => {
    /* # Handle unique constraint — already bookmarked */
    return null;
  });

  if (!bookmark) {
    return NextResponse.json({ message: "Already bookmarked" }, { status: 200 });
  }

  audit("candidate.bookmark.created", {
    userId: session.user.id,
    detail: `employer:${employerId ?? "none"} role:${roleId ?? "none"}`,
  });

  /* # Check for mutual interest (non-blocking) */
  const resolvedEmployerId = employerId ?? (roleId
    ? (await prisma.role.findUnique({ where: { id: roleId }, select: { employerId: true } }))?.employerId
    : null);

  if (resolvedEmployerId) {
    checkMutualInterest(resolvedEmployerId, session.user.id)
      .then(async (mutual) => {
        if (mutual) {
          await handleMutualInterest(resolvedEmployerId, session.user.id, roleId);
        }
      })
      .catch(() => {});
  }

  return NextResponse.json({ bookmark }, { status: 201 });
});

/* # DELETE — Remove a bookmark */
export const DELETE = authHandler(async (req: NextRequest, session: AuthSession) => {
  const { searchParams } = new URL(req.url);
  const bookmarkId = searchParams.get("id");
  if (!bookmarkId) {
    return NextResponse.json({ error: "Bookmark id is required" }, { status: 400 });
  }

  await dbRetry(() =>
    prisma.candidateBookmark.deleteMany({
      where: { id: bookmarkId, userId: session.user.id },
    })
  );

  audit("candidate.bookmark.deleted", {
    userId: session.user.id,
    detail: `bookmark:${bookmarkId}`,
  });

  return NextResponse.json({ deleted: true });
});
