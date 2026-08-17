/* ============================================================
   ORG EXPORT — GET /api/org/[orgId]/export
   ============================================================
   Admin+ role. Returns CSV of member roster + activity metrics.
   Same data as the stats/members endpoints but formatted for
   download into spreadsheets.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgHandler } from "@/lib/org-handler";
import { dbRetry } from "@/lib/db-retry";

/* # GET: CSV export of roster — admin+ role */
export const GET = orgHandler(async (req: NextRequest, _session, membership) => {
  const url = new URL(req.url);
  const cohort = url.searchParams.get("cohort") || undefined;

  /* # Fetch members with activity counts */
  const members = await dbRetry(() =>
    prisma.organizationMember.findMany({
      where: {
        organizationId: membership.organizationId,
        ...(cohort ? { cohort } : {}),
      },
      select: {
        role: true,
        cohort: true,
        joinedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            _count: {
              select: {
                resumes: true,
                applications: true,
                aiResults: true,
                coverLetters: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    })
  );

  /* # Build CSV content */
  const headers = ["Name", "Email", "Role", "Cohort", "Joined", "Resumes", "Applications", "AI Calls", "Cover Letters"];
  const rows = members.map((m) => [
    /* # Escape commas and quotes in CSV fields */
    `"${m.user.name.replace(/"/g, '""')}"`,
    m.user.email,
    m.role,
    m.cohort || "",
    m.joinedAt.toISOString().slice(0, 10),
    m.user._count.resumes,
    m.user._count.applications,
    m.user._count.aiResults,
    m.user._count.coverLetters,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  /* # Return as downloadable CSV */
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="roster-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}, "admin");
