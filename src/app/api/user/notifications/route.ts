/* ============================================================
   USER NOTIFICATIONS — GET, PATCH /api/user/notifications
   ============================================================
   GET: List notifications with pagination + unread count.
   PATCH: Mark notifications as read (single, batch, or all).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler, type AuthSession } from "@/lib/api-handler";
import { markReadSchema } from "@/lib/messaging-validations";
import { formatZodError } from "@/lib/validations";
import { markRead, markAllRead, getUnreadCount } from "@/lib/notifications";

/* # GET — List notifications with pagination */
export const GET = authHandler(async (req: NextRequest, session: AuthSession) => {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
  const unreadOnly = searchParams.get("unread") === "true";

  const where = {
    userId: session.user.id,
    ...(unreadOnly ? { readAt: null } : {}),
  };

  const [notifications, total, unreadCount] = await Promise.all([
    dbRetry(() =>
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      })
    ),
    dbRetry(() => prisma.notification.count({ where })),
    getUnreadCount(session.user.id),
  ]);

  return NextResponse.json({ notifications, total, unreadCount, page, limit });
});

/* # PATCH — Mark notifications as read */
export const PATCH = authHandler(async (req: NextRequest, session: AuthSession) => {
  const body = await req.json();

  /* # "all" = mark everything as read */
  if (body.all === true) {
    const count = await markAllRead(session.user.id);
    return NextResponse.json({ markedRead: count });
  }

  /* # Otherwise expect an array of notification IDs */
  const parsed = markReadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  const count = await markRead(parsed.data.notificationIds, session.user.id);
  return NextResponse.json({ markedRead: count });
});
