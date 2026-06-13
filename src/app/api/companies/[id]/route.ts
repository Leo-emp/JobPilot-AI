/* ============================================================
   COMPANY BY ID API - Update & Delete
   ============================================================
   PATCH  /api/companies/:id — update a company
   DELETE /api/companies/:id — delete a company
   Both endpoints require authentication + ownership check.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { updateCompanySchema, formatZodError } from "@/lib/validations";

/* ---- PATCH: Update a company ---- */
export const PATCH = safeHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const raw = await req.json();
  const parsed = updateCompanySchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  const body = parsed.data;

  /* Build update data — only include fields that were sent */
  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.industry !== undefined) updateData.industry = body.industry || null;
  if (body.website !== undefined) updateData.website = body.website || null;
  if (body.location !== undefined) updateData.location = body.location || null;
  if (body.size !== undefined) updateData.size = body.size || null;
  if (body.notes !== undefined) updateData.notes = body.notes || null;
  if (body.priority !== undefined) updateData.priority = body.priority;
  if (body.status !== undefined) updateData.status = body.status;

  /* Update only if this company belongs to the logged-in user */
  const result = await dbRetry(() => prisma.company.updateMany({
    where: { id, userId: session.user.id },
    data: updateData,
  }));

  if (result.count === 0) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  const company = await dbRetry(() => prisma.company.findFirst({
    where: { id, userId: session.user.id },
  }));

  return NextResponse.json(company);
});

/* ---- DELETE: Remove a company ---- */
export const DELETE = safeHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  /* Delete only if this company belongs to the logged-in user */
  const result = await dbRetry(() => prisma.company.deleteMany({
    where: { id, userId: session.user.id },
  }));

  if (result.count === 0) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
});
