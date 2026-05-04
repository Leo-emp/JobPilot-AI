/* ============================================================
   APPLICATIONS API - Update & Delete Single Application
   ============================================================
   PATCH  /api/applications/[id] — update status or notes
   DELETE /api/applications/[id] — delete an application
   The [id] folder name makes this a dynamic route segment.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- PATCH: Update an application ---- */
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

  /* Only allow updating applications that belong to the logged-in user */
  const existing = await prisma.application.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.application.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.status === "Applied" && { appliedDate: new Date() }),
    },
  });

  return NextResponse.json(updated);
}

/* ---- DELETE: Remove an application ---- */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  /* Only allow deleting applications that belong to the logged-in user */
  const existing = await prisma.application.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.application.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
