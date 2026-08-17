/* ============================================================
   CRON: EXTERNAL SOURCING — POST /api/cron/source-external
   ============================================================
   Runs external candidate sourcing for all active roles that
   have fewer than 5 quality internal matches (score >= 70).

   Designed to run every 6 hours via Vercel Cron:
   - Finds roles needing external candidates
   - Searches GitHub, Stack Overflow, and portfolio sites
   - Scores and persists matches
   - Notifies employers when new external matches are found

   Protected by CRON_SECRET bearer token.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { verifyCronSecret } from "@/lib/cron-auth";
import {
  roleNeedsExternalSourcing,
  sourceExternalCandidates,
  type SourcingResult,
} from "@/lib/external-sourcing";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";
import { isB2BEnabled } from "@/lib/b2b-gate";

/* # Maximum roles to process per cron run (avoid timeout) */
const MAX_ROLES_PER_RUN = 10;

export async function POST(req: NextRequest) {
  /* # B2B gate */
  if (!isB2BEnabled()) {
    return NextResponse.json({ skipped: true, reason: "B2B not enabled" });
  }

  /* # Auth: timing-safe verification of cron secret */
  const authError = verifyCronSecret(req);
  if (authError) return authError;

  audit("sourcing.started", { detail: "cron batch run" });

  /* # Fetch all active roles */
  const activeRoles = await dbRetry(() =>
    prisma.role.findMany({
      where: { status: "active" },
      select: { id: true, title: true, employerId: true },
      orderBy: { createdAt: "desc" },
    })
  );

  /* # Filter to roles that need external sourcing */
  const rolesNeedingSourcing: typeof activeRoles = [];

  for (const role of activeRoles) {
    if (rolesNeedingSourcing.length >= MAX_ROLES_PER_RUN) break;

    const needs = await roleNeedsExternalSourcing(role.id);
    if (needs) {
      rolesNeedingSourcing.push(role);
    }
  }

  /* # Run sourcing for each qualifying role */
  const results: SourcingResult[] = [];

  for (const role of rolesNeedingSourcing) {
    try {
      const result = await sourceExternalCandidates(role.id);
      results.push(result);

      /* # Notify employer if we found new external candidates */
      if (result.totalPersisted > 0) {
        const members = await prisma.employerMember.findMany({
          where: { employerId: role.employerId },
          select: { userId: true },
        });

        for (const member of members) {
          await notify(
            member.userId,
            "match",
            `${result.totalPersisted} new external candidates found for "${role.title}"`,
            {
              body: "Review external candidates in your role's match view.",
              linkUrl: `/employer/${role.employerId}/roles`,
            },
          ).catch(() => {});
        }
      }
    } catch (err) {
      console.error(`[source-external] Failed for role ${role.id}:`, err);
    }
  }

  /* # Summary stats */
  const totalFound = results.reduce((sum, r) => sum + r.totalPersisted, 0);
  const totalDuplicates = results.reduce((sum, r) => sum + r.skippedDuplicate, 0);

  audit("sourcing.completed", {
    detail: `roles:${results.length} found:${totalFound} dupes:${totalDuplicates}`,
  });

  return NextResponse.json({
    rolesProcessed: results.length,
    totalActiveRoles: activeRoles.length,
    totalExternalFound: totalFound,
    totalDuplicatesSkipped: totalDuplicates,
    results,
  });
}
