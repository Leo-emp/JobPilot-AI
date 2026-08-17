/* ============================================================
   ORG MEMBER DETAIL — GET/PATCH/DELETE /api/org/[orgId]/members/[userId]
   ============================================================
   GET: coach+ — single member detail with activity summary.
   PATCH: admin+ — change member role.
   DELETE: admin+ — remove member from org.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgHandler } from "@/lib/org-handler";
import { updateMemberSchema } from "@/lib/org-validations";
import { formatZodError } from "@/lib/validations";
import { dbRetry } from "@/lib/db-retry";
import { audit, getClientIp } from "@/lib/audit";
import { cacheDel } from "@/lib/redis";

/* # GET: single member detail — coach+ role */
export const GET = orgHandler(async (_req, _session, membership, params) => {
  const targetUserId = params.userId;

  /* # Look up the target member in the same org */
  const member = await dbRetry(() =>
    prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: membership.organizationId,
          userId: targetUserId,
        },
      },
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
                coverLetters: true,
              },
            },
          },
        },
      },
    })
  );

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ member });
}, "coach");

/* # PATCH: change member role — admin+ role */
export const PATCH = orgHandler(async (req: NextRequest, session, membership, params) => {
  const targetUserId = params.userId;

  /* # Validate input */
  const body = await req.json();
  const parsed = updateMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Cannot change own role — prevents accidental demotion */
  if (targetUserId === session.user.id) {
    return NextResponse.json(
      { error: "Cannot change your own role" },
      { status: 400 }
    );
  }

  /* # Verify target is actually a member */
  const target = await dbRetry(() =>
    prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: membership.organizationId,
          userId: targetUserId,
        },
      },
      select: { id: true, role: true },
    })
  );

  if (!target) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  /* # Only owner can promote to owner or demote other owners */
  if (
    (parsed.data.role === "owner" || target.role === "owner") &&
    membership.role !== "owner"
  ) {
    return NextResponse.json(
      { error: "Only owners can manage owner roles" },
      { status: 403 }
    );
  }

  /* # Update the role */
  const updated = await dbRetry(() =>
    prisma.organizationMember.update({
      where: { id: target.id },
      data: { role: parsed.data.role },
      select: { id: true, role: true, userId: true },
    })
  );

  audit("org.member.role_changed", {
    userId: session.user.id,
    detail: `Changed ${targetUserId} role to ${parsed.data.role} in org ${membership.organizationId}`,
    ip: getClientIp(req.headers),
  });

  /* # Invalidate cached membership so role change takes effect immediately */
  await cacheDel(`org:member:${membership.organizationId}:${targetUserId}`);

  return NextResponse.json({ member: updated });
}, "admin");

/* # DELETE: remove member from org — admin+ role */
export const DELETE = orgHandler(async (req: NextRequest, session, membership, params) => {
  const targetUserId = params.userId;

  /* # Cannot remove yourself — use a separate leave flow */
  if (targetUserId === session.user.id) {
    return NextResponse.json(
      { error: "Cannot remove yourself. Use the leave org flow instead." },
      { status: 400 }
    );
  }

  /* # Verify target is a member */
  const target = await dbRetry(() =>
    prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: membership.organizationId,
          userId: targetUserId,
        },
      },
      select: { id: true, role: true },
    })
  );

  if (!target) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  /* # Cannot remove an owner unless you're also an owner */
  if (target.role === "owner" && membership.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can remove other owners" },
      { status: 403 }
    );
  }

  /* # Delete the membership */
  await dbRetry(() =>
    prisma.organizationMember.delete({ where: { id: target.id } })
  );

  audit("org.member.removed", {
    userId: session.user.id,
    detail: `Removed ${targetUserId} from org ${membership.organizationId}`,
    ip: getClientIp(req.headers),
  });

  /* # Clear membership cache */
  await cacheDel(`org:member:${membership.organizationId}:${targetUserId}`);
  /* # Clear effective plan cache so removed user loses sponsorship */
  await cacheDel(`effectivePlan:${targetUserId}`);

  return NextResponse.json({ removed: true });
}, "admin");
