/* ============================================================
   CANDIDATE THREAD DETAIL — GET, PATCH /api/user/messages/[threadId]
   ============================================================
   GET: Fetch all messages in a thread + mark employer messages as read.
   PATCH: Block/report a thread.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler, type AuthSession } from "@/lib/api-handler";
import { audit } from "@/lib/audit";

/* # GET — Fetch messages in a thread + auto-mark as read */
export const GET = authHandler(async (_req: NextRequest, session: AuthSession, context: { params: Promise<Record<string, string>> }) => {
  const params = await context.params;
  const threadId = params.threadId;

  /* # Verify thread belongs to this candidate */
  const thread = await dbRetry(() =>
    prisma.messageThread.findFirst({
      where: { id: threadId, candidateId: session.user.id },
      include: {
        employer: { select: { id: true, name: true, logoUrl: true } },
      },
    })
  );

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  /* # Get all messages in the thread */
  const messages = await dbRetry(() =>
    prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
    })
  );

  /* # Mark unread employer messages as read (non-blocking) */
  prisma.message.updateMany({
    where: {
      threadId,
      senderType: "employer",
      readAt: null,
    },
    data: { readAt: new Date() },
  }).catch(() => {});

  return NextResponse.json({ thread, messages });
});

/* # PATCH — Block or report a thread */
export const PATCH = authHandler(async (req: NextRequest, session: AuthSession, context: { params: Promise<Record<string, string>> }) => {
  const params = await context.params;
  const threadId = params.threadId;
  const body = await req.json();
  const action = body.action as string;

  if (action !== "block") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  /* # Verify thread belongs to this candidate */
  const thread = await dbRetry(() =>
    prisma.messageThread.findFirst({
      where: { id: threadId, candidateId: session.user.id },
    })
  );

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  await dbRetry(() =>
    prisma.messageThread.update({
      where: { id: threadId },
      data: { status: "blocked", blockedById: session.user.id },
    })
  );

  audit("message.thread.blocked", {
    userId: session.user.id,
    detail: `thread:${threadId} blocked by candidate`,
  });

  return NextResponse.json({ blocked: true });
});
