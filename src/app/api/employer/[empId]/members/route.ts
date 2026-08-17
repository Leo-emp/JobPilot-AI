/* ============================================================
   EMPLOYER MEMBERS — GET/POST/DELETE /api/employer/[empId]/members
   ============================================================
   GET: recruiter+ — list team members.
   POST: admin+ — add a new member by email.
   DELETE: admin+ — remove a member (by userId in body).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employerHandler } from "@/lib/employer-handler";
import { addEmployerMemberSchema } from "@/lib/employer-validations";
import { formatZodError } from "@/lib/validations";
import { dbRetry } from "@/lib/db-retry";
import { audit, getClientIp } from "@/lib/audit";
import { cacheDel } from "@/lib/redis";
import { z } from "zod";

/* # GET: list all team members for this employer */
export const GET = employerHandler(async (_req, _session, membership) => {
  const members = await dbRetry(() =>
    prisma.employerMember.findMany({
      where: { employerId: membership.employerId },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    })
  );

  return NextResponse.json({ members });
}, "recruiter");

/* # POST: add a new team member by email — admin+ role */
export const POST = employerHandler(async (req: NextRequest, session, membership) => {
  const body = await req.json();
  const parsed = addEmployerMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Find the user by email */
  const targetUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, name: true },
  });

  if (!targetUser) {
    return NextResponse.json(
      { error: "No user found with that email. They must sign up first." },
      { status: 404 }
    );
  }

  /* # Check they're not already a member */
  const existing = await prisma.employerMember.findUnique({
    where: {
      employerId_userId: {
        employerId: membership.employerId,
        userId: targetUser.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User is already a member of this employer" },
      { status: 409 }
    );
  }

  /* # Only owners can add other owners */
  if (parsed.data.role === "owner" && membership.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can add other owners" },
      { status: 403 }
    );
  }

  /* # Create the membership */
  const member = await dbRetry(() =>
    prisma.employerMember.create({
      data: {
        employerId: membership.employerId,
        userId: targetUser.id,
        role: parsed.data.role,
      },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })
  );

  audit("employer.member.added", {
    userId: session.user.id,
    detail: `Added ${targetUser.name || parsed.data.email} as ${parsed.data.role} to employer ${membership.employerId}`,
    ip: getClientIp(req.headers),
  });

  return NextResponse.json({ member }, { status: 201 });
}, "admin");

/* # DELETE body schema — userId required */
const removeMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

/* # DELETE: remove a team member — admin+ role */
export const DELETE = employerHandler(async (req: NextRequest, session, membership) => {
  const body = await req.json();
  const parsed = removeMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Can't remove yourself */
  if (parsed.data.userId === session.user.id) {
    return NextResponse.json(
      { error: "Cannot remove yourself. Transfer ownership first." },
      { status: 400 }
    );
  }

  /* # Find the target member */
  const target = await prisma.employerMember.findUnique({
    where: {
      employerId_userId: {
        employerId: membership.employerId,
        userId: parsed.data.userId,
      },
    },
    select: { id: true, role: true, userId: true },
  });

  if (!target) {
    return NextResponse.json(
      { error: "Member not found" },
      { status: 404 }
    );
  }

  /* # Can't remove an owner unless you're also an owner */
  if (target.role === "owner" && membership.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can remove other owners" },
      { status: 403 }
    );
  }

  /* # Delete the membership */
  await dbRetry(() =>
    prisma.employerMember.delete({
      where: { id: target.id },
    })
  );

  /* # Clear cached membership */
  await cacheDel(`emp:member:${membership.employerId}:${parsed.data.userId}`);

  audit("employer.member.removed", {
    userId: session.user.id,
    detail: `Removed user ${parsed.data.userId} from employer ${membership.employerId}`,
    ip: getClientIp(req.headers),
  });

  return NextResponse.json({ success: true });
}, "admin");
