/* ============================================================
   EMPLOYER SHORTLIST — GET, POST /api/employer/[empId]/roles/[roleId]/shortlist
   ============================================================
   GET: View shortlists for a role (with entries and candidate data).
   POST: Create a new shortlist, add/remove entries, or deliver.

   Pro employers get internal-only shortlists.
   Enterprise employers get internal + external shortlists.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { employerHandler } from "@/lib/employer-handler";
import {
  createShortlistSchema,
  addShortlistEntrySchema,
} from "@/lib/outreach-validations";
import { formatZodError } from "@/lib/validations";
import { createRateLimiter } from "@/lib/rate-limit";
import {
  createShortlist,
  addToShortlist,
  removeFromShortlist,
  deliverShortlist,
  getShortlistForExport,
} from "@/lib/shortlist";

/* # Rate limit: 30 shortlist operations per minute */
const shortlistLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60_000,
});

/* # GET — View shortlists for a role */
export const GET = employerHandler(async (req, _session, membership) => {
  const url = new URL(req.url);
  const roleId = url.pathname.split("/").at(-2)!;
  const exportId = url.searchParams.get("export");

  /* # Verify role belongs to this employer */
  const role = await dbRetry(() =>
    prisma.role.findFirst({
      where: { id: roleId, employerId: membership.employerId },
      select: { id: true, title: true },
    })
  );

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  /* # If export ID is provided, return full export data */
  if (exportId) {
    const exportData = await getShortlistForExport(exportId);
    if (!exportData) {
      return NextResponse.json(
        { error: "Shortlist not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ export: exportData });
  }

  /* # List all shortlists for this role */
  const shortlists = await dbRetry(() =>
    prisma.shortlist.findMany({
      where: { roleId },
      include: {
        entries: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  );

  return NextResponse.json({ role, shortlists });
}, "recruiter");

/* # POST — Create shortlist, add/remove entries, deliver */
export const POST = employerHandler(async (req, session, membership) => {
  /* # Rate limit check */
  const limitCheck = await shortlistLimiter.check(membership.employerId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Too many shortlist operations. Please slow down." },
      { status: 429 },
    );
  }

  /* # Check employer plan — pro+ required */
  const employer = await dbRetry(() =>
    prisma.employer.findUnique({
      where: { id: membership.employerId },
      select: { plan: true },
    })
  );

  if (!employer || employer.plan === "free") {
    return NextResponse.json(
      { error: "Shortlists are available on Pro and Enterprise plans." },
      { status: 403 },
    );
  }

  const url = new URL(req.url);
  const roleId = url.pathname.split("/").at(-2)!;

  /* # Verify role belongs to employer */
  const role = await dbRetry(() =>
    prisma.role.findFirst({
      where: { id: roleId, employerId: membership.employerId },
      select: { id: true },
    })
  );

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const body = await req.json();
  const action = body.action;

  switch (action) {
    case "create": {
      const parsed = createShortlistSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: formatZodError(parsed.error) },
          { status: 400 },
        );
      }
      const shortlist = await createShortlist(
        roleId,
        membership.employerId,
        parsed.data.name,
      );
      return NextResponse.json({ shortlist }, { status: 201 });
    }

    case "add": {
      const parsed = addShortlistEntrySchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: formatZodError(parsed.error) },
          { status: 400 },
        );
      }
      if (!body.shortlistId) {
        return NextResponse.json(
          { error: "shortlistId is required" },
          { status: 400 },
        );
      }
      const added = await addToShortlist(
        body.shortlistId,
        parsed.data.candidateMatchId,
        parsed.data.employerNote,
      );
      return NextResponse.json({
        added,
        message: added ? "Added to shortlist" : "Already in shortlist",
      });
    }

    case "remove": {
      if (!body.shortlistId || !body.candidateMatchId) {
        return NextResponse.json(
          { error: "shortlistId and candidateMatchId are required" },
          { status: 400 },
        );
      }
      const removed = await removeFromShortlist(
        body.shortlistId,
        body.candidateMatchId,
      );
      return NextResponse.json({ removed });
    }

    case "deliver": {
      if (!body.shortlistId) {
        return NextResponse.json(
          { error: "shortlistId is required" },
          { status: 400 },
        );
      }
      const delivered = await deliverShortlist(body.shortlistId);
      return NextResponse.json({
        delivered,
        message: delivered
          ? "Shortlist delivered successfully"
          : "Shortlist not found",
      });
    }

    default:
      return NextResponse.json(
        { error: "Invalid action. Use: create, add, remove, deliver" },
        { status: 400 },
      );
  }
}, "recruiter");
