/* ============================================================
   EMPLOYER ROLE SOURCING — GET, POST /api/employer/[empId]/roles/[roleId]/sourcing
   ============================================================
   GET: View external sourcing status + results for a role.
   POST: Trigger external sourcing on-demand for a role.

   Only enterprise employers can trigger external sourcing.
   Pro employers can view results from cron-based sourcing.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { employerHandler } from "@/lib/employer-handler";
import { audit } from "@/lib/audit";
import { createRateLimiter } from "@/lib/rate-limit";
import {
  roleNeedsExternalSourcing,
  sourceExternalCandidates,
} from "@/lib/external-sourcing";

/* # Rate limit: 5 sourcing triggers per hour per employer */
const sourcingLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 3_600_000,
});

/* # GET — View external candidates matched for this role */
export const GET = employerHandler(async (req, _session, membership) => {
  const url = new URL(req.url);
  const roleId = url.pathname.split("/").at(-2)!;

  /* # Verify the role belongs to this employer */
  const role = await dbRetry(() =>
    prisma.role.findFirst({
      where: { id: roleId, employerId: membership.employerId },
      select: { id: true, title: true, status: true },
    })
  );

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  /* # Fetch external matches for this role */
  const externalMatches = await dbRetry(() =>
    prisma.candidateMatch.findMany({
      where: {
        roleId,
        source: { not: "internal" },
        externalId: { not: null },
      },
      include: {
        externalCandidate: {
          select: {
            id: true,
            name: true,
            email: true,
            profileUrl: true,
            source: true,
            skills: true,
            experience: true,
            convertedUserId: true,
          },
        },
      },
      orderBy: { score: "desc" },
    })
  );

  /* # Check if role needs more sourcing */
  const needsMore = await roleNeedsExternalSourcing(roleId);

  return NextResponse.json({
    role: { id: role.id, title: role.title },
    externalMatches,
    needsMoreSourcing: needsMore,
    totalExternal: externalMatches.length,
  });
}, "recruiter");

/* # POST — Trigger external sourcing for this role */
export const POST = employerHandler(async (req, session, membership) => {
  /* # Rate limit check */
  const limitCheck = await sourcingLimiter.check(membership.employerId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Sourcing rate limit reached. Try again later." },
      { status: 429 },
    );
  }

  const url = new URL(req.url);
  const roleId = url.pathname.split("/").at(-2)!;

  /* # Verify the role belongs to this employer and is active */
  const role = await dbRetry(() =>
    prisma.role.findFirst({
      where: {
        id: roleId,
        employerId: membership.employerId,
        status: "active",
      },
      select: { id: true, title: true },
    })
  );

  if (!role) {
    return NextResponse.json(
      { error: "Role not found or not active" },
      { status: 404 },
    );
  }

  /* # Only enterprise employers can trigger on-demand sourcing */
  const employer = await dbRetry(() =>
    prisma.employer.findUnique({
      where: { id: membership.employerId },
      select: { plan: true },
    })
  );

  if (employer?.plan !== "enterprise") {
    return NextResponse.json(
      {
        error:
          "On-demand external sourcing is available on the Enterprise plan. External sourcing runs automatically for roles with insufficient matches.",
      },
      { status: 403 },
    );
  }

  audit("sourcing.started", {
    userId: session.user.id,
    detail: `on-demand employer:${membership.employerId} role:${roleId}`,
  });

  /* # Run sourcing */
  const result = await sourceExternalCandidates(roleId);

  audit("sourcing.completed", {
    userId: session.user.id,
    detail: `role:${roleId} found:${result.totalPersisted} dupes:${result.skippedDuplicate}`,
  });

  return NextResponse.json({
    result,
    message: `Found ${result.totalPersisted} new external candidates for "${role.title}"`,
  });
}, "recruiter");
