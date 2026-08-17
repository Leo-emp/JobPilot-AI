/* ============================================================
   EMPLOYER MESSAGES — GET, POST /api/employer/[empId]/messages
   ============================================================
   GET: List message threads (inbox) for this employer.
   POST: Send a message in an existing thread, or create a new
         thread (enterprise employers only).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { employerHandler } from "@/lib/employer-handler";
import { sendMessageSchema, createThreadSchema } from "@/lib/messaging-validations";
import { formatZodError } from "@/lib/validations";
import { audit } from "@/lib/audit";
import { createRateLimiter } from "@/lib/rate-limit";
import { notify } from "@/lib/notifications";

/* # Rate limit: 20 messages per minute per employer */
const messageLimiter = createRateLimiter({
  maxRequests: 20,
  windowMs: 60_000,
});

/* # GET — List message threads (inbox) sorted by most recent */
export const GET = employerHandler(async (req, _session, membership) => {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));

  const [threads, total] = await Promise.all([
    dbRetry(() =>
      prisma.messageThread.findMany({
        where: {
          employerId: membership.employerId,
          status: { not: "blocked" },
        },
        include: {
          candidate: { select: { id: true, name: true, image: true } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1, // # Only get the latest message for preview
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
        where: { employerId: membership.employerId, status: { not: "blocked" } },
      })
    ),
  ]);

  /* # Count unread messages across all threads */
  const unreadCount = await dbRetry(() =>
    prisma.message.count({
      where: {
        thread: { employerId: membership.employerId, status: "active" },
        senderType: "candidate", // # Only count messages FROM candidates
        readAt: null,
      },
    })
  );

  return NextResponse.json({ threads, total, unreadCount, page, limit });
}, "recruiter");

/* # POST — Send a message or create a new thread */
export const POST = employerHandler(async (req, session, membership) => {
  /* # Rate limit check */
  const limitCheck = await messageLimiter.check(membership.employerId);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please slow down." },
      { status: 429 },
    );
  }

  const body = await req.json();

  /* # Try parsing as a send-message request first */
  const sendParsed = sendMessageSchema.safeParse(body);
  if (sendParsed.success) {
    return await sendMessage(sendParsed.data, session.user.id, membership.employerId);
  }

  /* # Try parsing as a create-thread request (enterprise only) */
  const threadParsed = createThreadSchema.safeParse(body);
  if (threadParsed.success) {
    return await createThread(threadParsed.data, session.user.id, membership.employerId);
  }

  /* # Neither schema matched */
  return NextResponse.json(
    { error: formatZodError(sendParsed.error) },
    { status: 400 },
  );
}, "recruiter");

/* # Send a message in an existing thread */
async function sendMessage(
  data: { threadId: string; content: string },
  userId: string,
  employerId: string,
) {
  /* # Verify the thread belongs to this employer and is active */
  const thread = await dbRetry(() =>
    prisma.messageThread.findFirst({
      where: {
        id: data.threadId,
        employerId,
        status: "active",
      },
      select: { id: true, candidateId: true },
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
          threadId: data.threadId,
          senderId: userId,
          senderType: "employer",
          content: data.content,
        },
      }),
      prisma.messageThread.update({
        where: { id: data.threadId },
        data: { lastMessageAt: new Date() },
      }),
    ])
  );

  audit("message.sent", {
    userId,
    detail: `thread:${data.threadId} employer:${employerId}`,
  });

  /* # Notify the candidate (non-blocking) */
  const employer = await prisma.employer.findUnique({
    where: { id: employerId },
    select: { name: true },
  });
  notify(thread.candidateId, "message", `New message from ${employer?.name ?? "an employer"}`, {
    body: data.content.substring(0, 100),
    linkUrl: "/dashboard/messages",
  }).catch(() => {});

  return NextResponse.json({ message }, { status: 201 });
}

/* # Create a new thread (enterprise employers only) */
async function createThread(
  data: { candidateId: string; roleId?: string },
  userId: string,
  employerId: string,
) {
  /* # Only enterprise employers can initiate threads without mutual interest */
  const employer = await dbRetry(() =>
    prisma.employer.findUnique({
      where: { id: employerId },
      select: { plan: true, name: true },
    })
  );

  if (employer?.plan !== "enterprise") {
    return NextResponse.json(
      { error: "Only enterprise employers can initiate conversations. Bookmark candidates to express interest." },
      { status: 403 },
    );
  }

  /* # Verify candidate exists and has a match score >= 60 */
  const match = await dbRetry(() =>
    prisma.candidateMatch.findFirst({
      where: {
        candidateId: data.candidateId,
        role: { employerId },
        score: { gte: 60 },
      },
    })
  );

  if (!match) {
    return NextResponse.json(
      { error: "Can only message matched candidates (score >= 60)" },
      { status: 403 },
    );
  }

  /* # Check if thread already exists — can't upsert with nullable roleId */
  const existing = await dbRetry(() =>
    prisma.messageThread.findFirst({
      where: {
        candidateId: data.candidateId,
        employerId,
        roleId: data.roleId ?? null,
      },
    })
  );

  const thread = existing ?? await dbRetry(() =>
    prisma.messageThread.create({
      data: {
        candidateId: data.candidateId,
        employerId,
        roleId: data.roleId ?? null,
      },
    })
  );

  audit("message.thread.created", {
    userId,
    detail: `employer:${employerId} thread with candidate:${data.candidateId}`,
  });

  /* # Notify the candidate */
  notify(data.candidateId, "message", `${employer.name} started a conversation`, {
    body: "Check your messages to respond.",
    linkUrl: "/dashboard/messages",
  }).catch(() => {});

  return NextResponse.json({ thread }, { status: 201 });
}
