/* ============================================================
   EMPLOYER ROLES — GET/POST /api/employer/[empId]/roles
   ============================================================
   GET: recruiter+ — list all roles (job postings).
   POST: admin+ — create a new role.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employerHandler } from "@/lib/employer-handler";
import { createRoleSchema } from "@/lib/employer-validations";
import { formatZodError } from "@/lib/validations";
import { dbRetry } from "@/lib/db-retry";
import { audit, getClientIp } from "@/lib/audit";

/* # GET: list all roles for this employer */
export const GET = employerHandler(async (req, _session, membership) => {
  const url = new URL(req.url);

  /* # Optional status filter */
  const status = url.searchParams.get("status");

  /* # Build the where clause */
  const where: Record<string, unknown> = {
    employerId: membership.employerId,
  };
  if (status) {
    where.status = status;
  }

  const roles = await dbRetry(() =>
    prisma.role.findMany({
      where,
      select: {
        id: true,
        title: true,
        status: true,
        locationType: true,
        location: true,
        employmentType: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        urgency: true,
        candidatesNeeded: true,
        createdAt: true,
        publishedAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
  );

  return NextResponse.json({ roles });
}, "recruiter");

/* # POST: create a new role (job posting) — admin+ */
export const POST = employerHandler(async (req: NextRequest, session, membership) => {
  const body = await req.json();
  const parsed = createRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Create role as draft by default */
  const role = await dbRetry(() =>
    prisma.role.create({
      data: {
        employerId: membership.employerId,
        title: parsed.data.title,
        description: parsed.data.description,
        requirements: parsed.data.requirements || null,
        skills: parsed.data.skills || null,
        niceToHaveSkills: parsed.data.niceToHaveSkills || null,
        experienceMin: parsed.data.experienceMin ?? null,
        experienceMax: parsed.data.experienceMax ?? null,
        salaryMin: parsed.data.salaryMin ?? null,
        salaryMax: parsed.data.salaryMax ?? null,
        salaryCurrency: parsed.data.salaryCurrency,
        locationType: parsed.data.locationType,
        location: parsed.data.location || null,
        employmentType: parsed.data.employmentType,
        industry: parsed.data.industry || null,
        education: parsed.data.education || null,
        urgency: parsed.data.urgency,
        candidatesNeeded: parsed.data.candidatesNeeded,
        status: "draft",
      },
    })
  );

  audit("employer.role.created", {
    userId: session.user.id,
    detail: `Created role: ${role.title} (${role.id}) for employer ${membership.employerId}`,
    ip: getClientIp(req.headers),
  });

  return NextResponse.json({ role }, { status: 201 });
}, "admin");
