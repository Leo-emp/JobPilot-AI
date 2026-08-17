/* ============================================================
   EMPLOYER BILLING USAGE — GET /api/employer/[empId]/billing/usage
   ============================================================
   Returns the current month's usage stats for this employer.
   Any team member can view usage (not just owners).
   ============================================================ */

import { NextResponse } from "next/server";
import { employerHandler } from "@/lib/employer-handler";
import { getUsage } from "@/lib/employer-usage";

export const GET = employerHandler(async (_req, _session, membership) => {
  const usage = await getUsage(membership.employerId);

  return NextResponse.json({
    usage: {
      rolesPosted: usage.rolesPosted,
      candidatesContacted: usage.candidatesContacted,
      matchesViewed: usage.matchesViewed,
      bookmarksUsed: usage.bookmarksUsed,
      shortlistsDelivered: usage.shortlistsDelivered,
    },
    month: usage.month,
  });
}, "recruiter");
