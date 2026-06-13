/* ============================================================
   AI HISTORY [ID] - Get or Delete a single AI result
   ============================================================
   GET    /api/ai-history/:id — get full result by ID
   DELETE /api/ai-history/:id — delete a result
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";

/* ---- GET: Retrieve full AI result ---- */
export const GET = safeHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const result = await dbRetry(() => prisma.aiResult.findFirst({
    where: { id, userId: session.user.id },
  }));

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
});

/* ---- DELETE: Remove an AI result ---- */
export const DELETE = safeHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const result = await dbRetry(() => prisma.aiResult.findFirst({
    where: { id, userId: session.user.id },
  }));

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await dbRetry(() => prisma.aiResult.delete({ where: { id } }));

  return NextResponse.json({ success: true });
});
