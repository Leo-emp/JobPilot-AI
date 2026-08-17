/* ============================================================
   ORG MEMBERS — GET /api/org/[orgId]/members
   ============================================================
   Coach+ role. Returns member roster with activity summary.
   Supports ?cohort= filter and ?search= for name/email.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgHandler } from "@/lib/org-handler";
import { dbRetry } from "@/lib/db-retry";

/* # GET: list org members with activity counts — coach+ role */
export const GET = orgHandler(async (req: NextRequest, _session, membership) => {
  const url = new URL(req.url);
  const cohort = url.searchParams.get("cohort") || undefined;
  const search = url.searchParams.get("search") || undefined;

  /* # Build where clause with optional filters */
  const where: Record<string, unknown> = {
    organizationId: membership.organizationId,
  };
  if (cohort) where.cohort = cohort;

  /* # Fetch members with user details */
  const members = await dbRetry(() =>
    prisma.organizationMember.findMany({
      where,
      select: {
        id: true,
        role: true,
        cohort: true,
        dataVisibility: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            _count: {
              select: {
                resumes: true,
                applications: true,
                aiResults: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    })
  );

  /* # Apply search filter in-memory (name or email) */
  let filtered = members;
  if (search) {
    const q = search.toLowerCase();
    filtered = members.filter(
      (m) =>
        m.user.name.toLowerCase().includes(q) ||
        m.user.email.toLowerCase().includes(q)
    );
  }

  /* # Get unique cohorts for the filter dropdown */
  const cohorts = [...new Set(members.map((m) => m.cohort).filter(Boolean))];

  return NextResponse.json({
    members: filtered,
    cohorts,
    total: filtered.length,
  });
}, "coach");
