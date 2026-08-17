/* ============================================================
   NOTIFICATION HELPER — Create in-app notifications
   ============================================================
   Central place for creating notifications. All notification
   types route through here so we have a single point for
   future email integration and rate limiting.

   Usage:
     await notify(userId, "bookmark", "New interest!", {
       body: "Acme Corp bookmarked your profile",
       linkUrl: "/dashboard/bookmarks",
     });
   ============================================================ */

import { prisma } from "@/lib/prisma";

/* # Valid notification types */
export type NotificationType =
  | "match"       // New role match
  | "message"     // New message in a thread
  | "bookmark"    // Someone bookmarked you
  | "mutual"      // Mutual interest unlocked
  | "interview"   // Interview scheduled
  | "system";     // System announcements

/* # Optional notification fields */
interface NotifyOptions {
  body?: string;     // Detail text
  linkUrl?: string;  // Deep link to relevant page
}

/* # Create a notification for a user — non-blocking, never throws */
export async function notify(
  userId: string,
  type: NotificationType,
  title: string,
  options?: NotifyOptions,
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body: options?.body ?? null,
        linkUrl: options?.linkUrl ?? null,
      },
    });
  } catch {
    // # Notification failures should never break the main flow
    console.error(`Failed to create notification for user ${userId}`);
  }
}

/* # Mark notifications as read — single or batch */
export async function markRead(notificationIds: string[], userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId, // # Security: only mark your own notifications
      readAt: null,
    },
    data: { readAt: new Date() },
  });
  return result.count;
}

/* # Mark ALL unread notifications as read for a user */
export async function markAllRead(userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
  return result.count;
}

/* # Get unread notification count for a user */
export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null },
  });
}
