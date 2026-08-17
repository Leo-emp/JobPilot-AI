/* ============================================================
   NOTIFICATION HELPER — Unit tests
   ============================================================
   Tests notify(), markRead(), markAllRead(), getUnreadCount().
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* # Mock prisma */
vi.mock("@/lib/prisma", () => ({
  prisma: {
    notification: {
      create: vi.fn(() => Promise.resolve({ id: "notif-1" })),
      updateMany: vi.fn(() => Promise.resolve({ count: 3 })),
      count: vi.fn(() => Promise.resolve(5)),
    },
  },
}));

import { notify, markRead, markAllRead, getUnreadCount } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("notify", () => {
  it("creates a notification with required fields", async () => {
    await notify("user-1", "bookmark", "Someone liked you");

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        type: "bookmark",
        title: "Someone liked you",
        body: null,
        linkUrl: null,
      }),
    });
  });

  it("passes optional body and linkUrl", async () => {
    await notify("user-1", "message", "New message", {
      body: "Hello there",
      linkUrl: "/dashboard/messages",
    });

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        body: "Hello there",
        linkUrl: "/dashboard/messages",
      }),
    });
  });

  it("does not throw on prisma error", async () => {
    vi.mocked(prisma.notification.create).mockRejectedValueOnce(new Error("DB down"));

    /* # Should not throw — notification failures are swallowed */
    await expect(notify("user-1", "system", "Test")).resolves.toBeUndefined();
  });
});

describe("markRead", () => {
  it("marks specific notifications as read for the user", async () => {
    const count = await markRead(["notif-1", "notif-2"], "user-1");

    expect(count).toBe(3);
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: {
        id: { in: ["notif-1", "notif-2"] },
        userId: "user-1",
        readAt: null,
      },
      data: expect.objectContaining({ readAt: expect.any(Date) }),
    });
  });
});

describe("markAllRead", () => {
  it("marks all unread notifications as read for the user", async () => {
    const count = await markAllRead("user-1");

    expect(count).toBe(3);
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: "user-1", readAt: null },
      data: expect.objectContaining({ readAt: expect.any(Date) }),
    });
  });
});

describe("getUnreadCount", () => {
  it("counts unread notifications for the user", async () => {
    const count = await getUnreadCount("user-1");

    expect(count).toBe(5);
    expect(prisma.notification.count).toHaveBeenCalledWith({
      where: { userId: "user-1", readAt: null },
    });
  });
});
