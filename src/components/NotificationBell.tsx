/* ============================================================
   NOTIFICATION BELL — In-app notification dropdown
   ============================================================
   Renders a bell icon with an unread count badge. Clicking
   opens a dropdown showing recent notifications. Polls every
   60s for new notifications (no WebSockets in v1).
   ============================================================ */

"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* # Notification from the API */
interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  linkUrl: string | null;
  readAt: string | null;
  createdAt: string;
}

/* # Type badge colors */
const TYPE_COLORS: Record<string, string> = {
  mutual: "bg-emerald-500/10 text-emerald-400",
  message: "bg-blue-500/10 text-blue-400",
  bookmark: "bg-amber-500/10 text-amber-400",
  match: "bg-indigo-500/10 text-indigo-400",
  interview: "bg-purple-500/10 text-purple-400",
  system: "bg-slate-500/10 text-slate-400",
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* # Fetch unread count on mount + poll every 60s */
  const fetchCount = useCallback(() => {
    fetch("/api/user/notifications?limit=1")
      .then((r) => r.json())
      .then((data) => setUnreadCount(data.unreadCount || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 60_000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  /* # Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* # Load notifications when dropdown opens */
  async function handleToggle() {
    const opening = !isOpen;
    setIsOpen(opening);

    if (opening) {
      setLoading(true);
      try {
        const res = await fetch("/api/user/notifications?limit=10");
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch {
        /* # Ignore */
      } finally {
        setLoading(false);
      }
    }
  }

  /* # Mark all as read */
  async function handleMarkAllRead() {
    try {
      await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      /* # Ignore */
    }
  }

  /* # Navigate to notification link */
  function handleClick(notification: Notification) {
    /* # Mark as read (non-blocking) */
    if (!notification.readAt) {
      fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [notification.id] }),
      }).catch(() => {});

      setNotifications((prev) =>
        prev.map((n) => n.id === notification.id ? { ...n, readAt: new Date().toISOString() } : n)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    if (notification.linkUrl) {
      window.location.href = notification.linkUrl;
    }
    setIsOpen(false);
  }

  /* # Relative time formatting */
  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* # Bell button */}
      <button
        onClick={handleToggle}
        className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-700/50 hover:text-white transition"
        aria-label="Notifications"
      >
        {/* # Bell SVG */}
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>

        {/* # Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* # Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-700/50 bg-slate-800 shadow-xl z-50">
          {/* # Header */}
          <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
            <span className="text-sm font-medium text-white">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* # Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full px-4 py-3 text-left border-b border-slate-700/30 transition hover:bg-slate-700/30 ${
                    !n.readAt ? "bg-slate-700/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* # Unread indicator */}
                    {!n.readAt && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[n.type] ?? TYPE_COLORS.system}`}>
                          {n.type}
                        </span>
                        <span className="text-xs text-slate-600">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className={`mt-0.5 text-sm ${!n.readAt ? "text-white" : "text-slate-300"}`}>
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="mt-0.5 text-xs text-slate-500 truncate">{n.body}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
