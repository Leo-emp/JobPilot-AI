/* ============================================================
   INDIVIDUAL ROLE — GET/PATCH/DELETE /api/employer/[empId]/roles/[roleId]
   ============================================================
   GET: recruiter+ — view role details.
   PATCH: admin+ — update role (including publish/pause).
   DELETE: admin+ — soft-delete (set status to "cancelled").
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employerHandler } from "@/lib/employer-handler";
import { updateRoleSchema } from "@/lib/employer-validations";
import { formatZodError } from "@/lib/validations";
import { dbRetry } from "@/lib/db-retry";
import { audit, getClientIp } from "@/lib/audit";
import { matchRoleToAllCandidates } from "@/lib/batch-matching";

/* # GET: single role with full details — recruiter+ */
export const GET = employerHandler(async (_req, _session, membership, params) => {
  const role = await dbRetry(() =>
    prisma.role.findFirst({
      where: {
        id: params.roleId,
        employerId: membership.employerId,
      },
    })
  );

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  return NextResponse.json({ role });
}, "recruiter");

/* # PATCH: update role — admin+ */
export const PATCH = employerHandler(async (req: NextRequest, session, membership, params) => {
  const body = await req.json();
  const parsed = updateRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Verify role belongs to this employer */
  const existing = await prisma.role.findFirst({
    where: {
      id: params.roleId,
      employerId: membership.employerId,
    },
    select: { id: true, status: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  /* # If status is changing to "active", set publishedAt */
  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "active" && existing.status !== "active") {
    data.publishedAt = new Date();
  }

  const updated = await dbRetry(() =>
    prisma.role.update({
      where: { id: params.roleId },
      data,
    })
  );

  /* # On publish: trigger batch matching against all open candidates (non-blocking) */
  if (parsed.data.status === "active" && existing.status !== "active") {
    matchRoleToAllCandidates(updated.id).catch(() => {});

    audit("employer.role.published", {
      userId: session.user.id,
      detail: `Published role: ${updated.title} (${updated.id})`,
      ip: getClientIp(req.headers),
    });
  } else {
    audit("employer.updated", {
      userId: session.user.id,
      detail: `Updated role: ${updated.title} (${updated.id})`,
      ip: getClientIp(req.headers),
    });
  }

  return NextResponse.json({ role: updated });
}, "admin");

/* # DELETE: soft-delete role (set to cancelled) — admin+ */
export const DELETE = employerHandler(async (req: NextRequest, session, membership, params) => {
  /* # Verify role belongs to this employer */
  const existing = await prisma.role.findFirst({
    where: {
      id: params.roleId,
      employerId: membership.employerId,
    },
    select: { id: true, title: true, status: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  /* # Soft delete — mark as cancelled rather than hard deleting */
  await dbRetry(() =>
    prisma.role.update({
      where: { id: params.roleId },
      data: {
        status: "cancelled",
      },
    })
  );

  audit("employer.role.deleted", {
    userId: session.user.id,
    detail: `Cancelled role: ${existing.title} (${existing.id})`,
    ip: getClientIp(req.headers),
  });

  return NextResponse.json({ success: true });
}, "admin");
