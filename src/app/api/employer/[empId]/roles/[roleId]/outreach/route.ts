/* ============================================================
   EMPLOYER OUTREACH — GET, POST /api/employer/[empId]/roles/[roleId]/outreach
   ============================================================
   GET: View outreach status for a role (sent, delivered, opened, replied).
   POST: Queue AI outreach emails for selected candidate matches.

   Only enterprise employers can use outreach.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { employerHandler } from "@/lib/employer-handler";
import { queueOutreachSchema } from "@/lib/outreach-validations";
import { formatZodError } from "@/lib/validations";
import { audit } from "@/lib/audit";
import { createRateLimiter } from "@/lib/rate-limit";
import { generateOutreachEmail } from "@/lib/outreach-email";
import { createConversionToken } from "@/lib/conversion-token";
import { parseSkills } from "@/lib/matching-engine";

/* # Rate limit: 10 outreach batches per hour per employer */
const outreachLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 3_600_000,
});

/* # GET — View outreach activity for a role */
export const GET = employerHandler(async (req, _session, membership) => {
  const url = new URL(req.url);
  const roleId = url.pathname.split("/").at(-2)!;

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

  /* # Fetch outreach records for this role */
  const outreach = await dbRetry(() =>
    prisma.outreach.findMany({
      where: { roleId },
      orderBy: { createdAt: "desc" },
      take: 100,
    })
  );

  /* # Aggregate stats */
  const stats = {
    total: outreach.length,
    queued: outreach.filter((o) => o.status === "queued").length,
    sent: outreach.filter((o) => o.status === "sent").length,
    delivered: outreach.filter((o) => o.status === "delivered").length,
    opened: outreach.filter((o) => o.status === "opened").length,
    replied: outreach.filter((o) => o.status === "replied").length,
    bounced: outreach.filter((o) => o.status === "bounced").length,
    cancelled: outreach.filter((o) => o.status === "cancelled").length,
  };

  return NextResponse.json({ role, outreach, stats });
}, "recruiter");

/* # POST — Queue outreach for selected candidates */
export const POST = employerHandler(async (req, session, membership) => {
  /* # Rate limit check */
  const limitCheck = await outreachLimiter.check(membership.employerId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Outreach rate limit reached. Try again later." },
      { status: 429 },
    );
  }

  /* # Only enterprise employers can send outreach */
  const employer = await dbRetry(() =>
    prisma.employer.findUnique({
      where: { id: membership.employerId },
      select: { plan: true, name: true, industry: true, size: true, description: true },
    })
  );

  if (employer?.plan !== "enterprise") {
    return NextResponse.json(
      { error: "AI outreach is available on the Enterprise plan." },
      { status: 403 },
    );
  }

  const url = new URL(req.url);
  const roleId = url.pathname.split("/").at(-2)!;

  /* # Verify role belongs to employer and is active */
  const role = await dbRetry(() =>
    prisma.role.findFirst({
      where: { id: roleId, employerId: membership.employerId, status: "active" },
    })
  );

  if (!role) {
    return NextResponse.json(
      { error: "Role not found or not active" },
      { status: 404 },
    );
  }

  const body = await req.json();
  const parsed = queueOutreachSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  /* # Fetch the candidate matches */
  const matches = await dbRetry(() =>
    prisma.candidateMatch.findMany({
      where: {
        id: { in: parsed.data.candidateMatchIds },
        roleId,
        externalId: { not: null },
      },
      include: {
        externalCandidate: true,
      },
    })
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://jobpilotai.co";
  let queued = 0;
  let skipped = 0;

  for (const match of matches) {
    const ext = match.externalCandidate;
    if (!ext || !ext.email) {
      skipped++;
      continue;
    }

    /* # Check if outreach already sent to this email for this role */
    const existing = await prisma.outreach.findFirst({
      where: { email: ext.email, roleId, followUpNumber: 0 },
    });
    if (existing) {
      skipped++;
      continue;
    }

    /* # Check suppression list */
    const suppressed = await prisma.emailSuppression.findUnique({
      where: { email: ext.email.toLowerCase() },
    });
    if (suppressed) {
      skipped++;
      continue;
    }

    /* # Generate conversion token for the invite link */
    const rawToken = await createConversionToken(ext.id);
    const inviteUrl = `${baseUrl}/signup?invite=${rawToken}`;
    const optOutUrl = `${baseUrl}/api/outreach/opt-out?email=${encodeURIComponent(ext.email)}`;

    /* # Parse external candidate data for the AI prompt */
    let skills: string[] = [];
    let experience: Record<string, unknown> = {};
    let rawData: Record<string, unknown> = {};
    try { skills = ext.skills ? JSON.parse(ext.skills) : []; } catch {}
    try { experience = ext.experience ? JSON.parse(ext.experience) : {}; } catch {}
    try { rawData = ext.rawData ? JSON.parse(ext.rawData) : {}; } catch {}

    /* # Generate the personalized email */
    const email = await generateOutreachEmail(
      {
        name: ext.name,
        source: ext.source,
        profileUrl: ext.profileUrl,
        skills,
        experience,
        rawData,
      },
      {
        title: role.title,
        description: role.description,
        skills: parseSkills(role.skills),
        locationType: role.locationType,
        salaryMin: role.salaryMin,
        salaryMax: role.salaryMax,
        salaryCurrency: role.salaryCurrency,
      },
      {
        name: employer.name,
        industry: employer.industry,
        size: employer.size,
        description: employer.description,
      },
      inviteUrl,
      optOutUrl,
    );

    /* # Queue the outreach email */
    await dbRetry(() =>
      prisma.outreach.create({
        data: {
          roleId,
          externalCandidateId: ext.id,
          candidateMatchId: match.id,
          email: ext.email!,
          subject: email.subject,
          body: email.body,
          inviteToken: ext.inviteToken,
        },
      })
    );

    audit("outreach.queued", {
      userId: session.user.id,
      detail: `role:${roleId} candidate:${ext.id} email:${ext.email}`,
    });

    queued++;
  }

  return NextResponse.json({
    queued,
    skipped,
    message: `${queued} outreach emails queued for sending.`,
  });
}, "recruiter");
