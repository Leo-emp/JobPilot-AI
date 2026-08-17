/* ============================================================
   EMPLOYER THREAD DETAIL — GET, PATCH /api/employer/[empId]/messages/[threadId]
   ============================================================
   GET: Fetch all messages in a thread + mark candidate messages as read.
   PATCH: Block a thread.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { employerHandler } from "@/lib/employer-handler";
import { audit } from "@/lib/audit";

/* # GET — Fetch messages in a thread + auto-mark as read */
export const GET = employerHandler(async (_req, _session, membership, params) => {
  const threadId = params.threadId;

  /* # Verify thread belongs to this employer */
  const thread = await dbRetry(() =>
    prisma.messageThread.findFirst({
      where: { id: threadId, employerId: membership.employerId },
      include: {
        candidate: { select: { id: true, name: true, image: true } },
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

  /* # Mark unread candidate messages as read (non-blocking) */
  prisma.message.updateMany({
    where: {
      threadId,
      senderType: "candidate",
      readAt: null,
    },
    data: { readAt: new Date() },
  }).catch(() => {});

  return NextResponse.json({ thread, messages });
}, "recruiter");

/* # PATCH — Block a thread */
export const PATCH = employerHandler(async (req, _session, membership, params) => {
  const threadId = params.threadId;
  const body = await req.json();
  const action = body.action as string;

  if (action !== "block") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  /* # Verify thread belongs to this employer */
  const thread = await dbRetry(() =>
    prisma.messageThread.findFirst({
      where: { id: threadId, employerId: membership.employerId },
    })
  );

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  await dbRetry(() =>
    prisma.messageThread.update({
      where: { id: threadId },
      data: { status: "blocked", blockedById: membership.userId },
    })
  );

  audit("message.thread.blocked", {
    userId: membership.userId,
    detail: `thread:${threadId} blocked by employer:${membership.employerId}`,
  });

  return NextResponse.json({ blocked: true });
}, "recruiter");
