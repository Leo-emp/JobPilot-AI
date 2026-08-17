/* ============================================================
   CRON: BATCH MATCH SCORING — POST /api/cron/match-scoring
   ============================================================
   Runs batch matching for all active roles against all
   open-to-work candidates. Designed to run daily to catch:
   1. New candidates who signed up since last run
   2. Preference changes that weren't caught by real-time hooks
   3. Roles published while the server was under load

   Also cleans up matches for roles that are no longer active.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { verifyCronSecret } from "@/lib/cron-auth";
import { matchRoleToAllCandidates } from "@/lib/batch-matching";
import { isB2BEnabled } from "@/lib/b2b-gate";

export async function POST(req: NextRequest) {
  /* # B2B gate — skip matching when B2B is disabled */
  if (!isB2BEnabled()) {
    return NextResponse.json({ skipped: true, reason: "B2B not enabled" });
  }

  /* # Verify cron secret */
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* # Fetch all active roles */
  const activeRoles = await dbRetry(() =>
    prisma.role.findMany({
      where: { status: "active" },
      select: { id: true, title: true },
    })
  );

  let totalMatched = 0;
  let totalSkipped = 0;

  /* # Run matching for each active role */
  for (const role of activeRoles) {
    const result = await matchRoleToAllCandidates(role.id);
    totalMatched += result.matched;
    totalSkipped += result.skipped;
  }

  /* # Clean up matches for roles that are no longer active */
  const cleaned = await dbRetry(() =>
    prisma.candidateMatch.deleteMany({
      where: {
        role: {
          status: { in: ["cancelled", "filled"] },
        },
      },
    })
  );

  return NextResponse.json({
    rolesProcessed: activeRoles.length,
    totalMatched,
    totalSkipped,
    cleanedUp: cleaned.count,
  });
}
