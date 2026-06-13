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
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { updateContactSchema, formatZodError } from "@/lib/validations";

/* ---- PATCH: Update a contact ---- */
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
  const parsed = updateContactSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  const body = parsed.data;

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

  /* Update only if this contact belongs to the logged-in user */
  const result = await dbRetry(() => prisma.contact.updateMany({
    where: { id, userId: session.user.id },
    data: updateData,
  }));

  if (result.count === 0) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  const contact = await dbRetry(() => prisma.contact.findFirst({
    where: { id, userId: session.user.id },
  }));

  return NextResponse.json(contact);
});

/* ---- DELETE: Remove a contact ---- */
export const DELETE = safeHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  /* Delete only if this contact belongs to the logged-in user */
  const result = await dbRetry(() => prisma.contact.deleteMany({
    where: { id, userId: session.user.id },
  }));

  if (result.count === 0) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
});
