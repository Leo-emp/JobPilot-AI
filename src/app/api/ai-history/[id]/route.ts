/* ============================================================
   AI HISTORY [ID] - Get or Delete a single AI result
   ============================================================
   GET    /api/ai-history/:id — get full result by ID
   DELETE /api/ai-history/:id — delete a result
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- GET: Retrieve full AI result ---- */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const result = await prisma.aiResult.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

/* ---- DELETE: Remove an AI result ---- */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const result = await prisma.aiResult.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.aiResult.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
