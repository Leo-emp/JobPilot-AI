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

/* ---- PATCH: Update a company ---- */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  /* Verify ownership */
  const existing = await prisma.company.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

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

  const company = await prisma.company.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(company);
}

/* ---- DELETE: Remove a company ---- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  /* Verify ownership */
  const existing = await prisma.company.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  await prisma.company.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
