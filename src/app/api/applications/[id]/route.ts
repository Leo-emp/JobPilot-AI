/* ============================================================
   APPLICATIONS API - Update & Delete Single Application
   ============================================================
   PATCH  /api/applications/[id] — update status or notes
   DELETE /api/applications/[id] — delete an application
   The [id] folder name makes this a dynamic route segment.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler } from "@/lib/api-handler";
import { updateApplicationSchema, formatZodError } from "@/lib/validations";

/* ---- PATCH: Update an application ---- */
export const PATCH = authHandler(async (
  req,
  session,
  { params }: { params: Promise<{ id: string }> }
) => {

  const { id } = await params;
  const raw = await req.json();
  const parsed = updateApplicationSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  const body = parsed.data;

  /* Update only if this application belongs to the logged-in user */
  const result = await dbRetry(() => prisma.application.updateMany({
    where: { id, userId: session.user.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.status === "Applied" && { appliedDate: new Date() }),
      ...(body.interviewDate !== undefined && {
        interviewDate: body.interviewDate ? new Date(body.interviewDate) : null,
      }),
    },
  }));

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  /* Return the updated record */
  const updated = await dbRetry(() => prisma.application.findFirst({
    where: { id, userId: session.user.id },
  }));

  return NextResponse.json(updated);
});

/* ---- DELETE: Remove an application ---- */
export const DELETE = authHandler(async (
  _req,
  session,
  { params }: { params: Promise<{ id: string }> }
) => {

  const { id } = await params;

  /* Delete only if this application belongs to the logged-in user */
  const result = await dbRetry(() => prisma.application.deleteMany({
    where: { id, userId: session.user.id },
  }));

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
});
