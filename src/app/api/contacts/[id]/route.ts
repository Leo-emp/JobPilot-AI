/* ============================================================
   CONTACT BY ID API - Update & Delete
   ============================================================
   PATCH  /api/contacts/:id — update a contact
   DELETE /api/contacts/:id — delete a contact
   Both endpoints require authentication + ownership check.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- PATCH: Update a contact ---- */
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

  /* Verify ownership — only update your own contacts */
  const existing = await prisma.contact.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  /* Build update data — only include fields that were sent */
  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.email !== undefined) updateData.email = body.email || null;
  if (body.phone !== undefined) updateData.phone = body.phone || null;
  if (body.company !== undefined) updateData.company = body.company || null;
  if (body.role !== undefined) updateData.role = body.role || null;
  if (body.linkedinUrl !== undefined) updateData.linkedinUrl = body.linkedinUrl || null;
  if (body.relationship !== undefined) updateData.relationship = body.relationship;
  if (body.notes !== undefined) updateData.notes = body.notes || null;
  if (body.lastContactedAt !== undefined) {
    updateData.lastContactedAt = body.lastContactedAt ? new Date(body.lastContactedAt) : null;
  }
  if (body.nextFollowUp !== undefined) {
    updateData.nextFollowUp = body.nextFollowUp ? new Date(body.nextFollowUp) : null;
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(contact);
}

/* ---- DELETE: Remove a contact ---- */
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
  const existing = await prisma.contact.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  await prisma.contact.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
