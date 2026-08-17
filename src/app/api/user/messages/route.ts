/* ============================================================
   CANDIDATE MESSAGES — GET, POST /api/user/messages
   ============================================================
   GET: List message threads (inbox) for the authenticated candidate.
   POST: Send a message in an existing thread.
   Candidates cannot initiate threads — only respond to them.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler, type AuthSession } from "@/lib/api-handler";
import { sendMessageSchema } from "@/lib/messaging-validations";
import { formatZodError } from "@/lib/validations";
import { audit } from "@/lib/audit";
import { createRateLimiter } from "@/lib/rate-limit";
import { notify } from "@/lib/notifications";

/* # Rate limit: 20 messages per minute per user */
const messageLimiter = createRateLimiter({
  maxRequests: 20,
  windowMs: 60_000,
});

/* # GET — List message threads (candidate inbox) */
export const GET = authHandler(async (req: NextRequest, session: AuthSession) => {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));

  const [threads, total] = await Promise.all([
    dbRetry(() =>
      prisma.messageThread.findMany({
        where: {
          candidateId: session.user.id,
          status: { not: "blocked" },
        },
        include: {
          employer: { select: { id: true, name: true, logoUrl: true } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1, // # Latest message for preview
            select: { content: true, senderType: true, createdAt: true, readAt: true },
          },
        },
        orderBy: { lastMessageAt: { sort: "desc", nulls: "last" } },
        skip: (page - 1) * limit,
        take: limit,
      })
    ),
    dbRetry(() =>
      prisma.messageThread.count({
        where: { candidateId: session.user.id, status: { not: "blocked" } },
      })
    ),
  ]);

  /* # Count unread messages across all threads */
  const unreadCount = await dbRetry(() =>
    prisma.message.count({
      where: {
        thread: { candidateId: session.user.id, status: "active" },
        senderType: "employer", // # Only count messages FROM employers
        readAt: null,
      },
    })
  );

  return NextResponse.json({ threads, total, unreadCount, page, limit });
});

/* # POST — Send a message in an existing thread */
export const POST = authHandler(async (req: NextRequest, session: AuthSession) => {
  /* # Rate limit check */
  const limitCheck = await messageLimiter.check(session.user.id);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please slow down." },
      { status: 429 },
    );
  }

  const body = await req.json();
  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  /* # Verify the thread belongs to this candidate and is active */
  const thread = await dbRetry(() =>
    prisma.messageThread.findFirst({
      where: {
        id: parsed.data.threadId,
        candidateId: session.user.id,
        status: "active",
      },
      select: { id: true, employerId: true },
    })
  );

  if (!thread) {
    return NextResponse.json(
      { error: "Thread not found or not active" },
      { status: 404 },
    );
  }

  /* # Create the message + update thread's lastMessageAt atomically */
  const [message] = await dbRetry(() =>
    prisma.$transaction([
      prisma.message.create({
        data: {
          threadId: parsed.data.threadId,
          senderId: session.user.id,
          senderType: "candidate",
          content: parsed.data.content,
        },
      }),
      prisma.messageThread.update({
        where: { id: parsed.data.threadId },
        data: { lastMessageAt: new Date() },
      }),
    ])
  );

  audit("message.sent", {
    userId: session.user.id,
    detail: `thread:${parsed.data.threadId} candidate`,
  });

  /* # Notify employer members (non-blocking) */
  const members = await prisma.employerMember.findMany({
    where: { employerId: thread.employerId },
    select: { userId: true },
  });
  const candidateName = (await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  }))?.name ?? "A candidate";

  Promise.all(
    members.map((m) =>
      notify(m.userId, "message", `New message from ${candidateName}`, {
        body: parsed.data.content.substring(0, 100),
        linkUrl: `/employer/${thread.employerId}/messages`,
      })
    )
  ).catch(() => {});

  return NextResponse.json({ message }, { status: 201 });
});
