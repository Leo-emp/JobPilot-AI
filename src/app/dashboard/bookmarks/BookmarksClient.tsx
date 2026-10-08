/* ============================================================
   BOOKMARKS — Companies/roles the candidate has bookmarked
   ============================================================
   Shows bookmarked employers and roles with mutual interest
   indicators. Mutual interest = both sides bookmarked each other
   → messaging is unlocked.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/track-event";

/* # Bookmark type from the API */
interface Bookmark {
  id: string;
  employerId: string | null;
  roleId: string | null;
  createdAt: string;
  mutualInterest: boolean;
  employer: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    industry: string | null;
  } | null;
  role: {
    id: string;
    title: string;
    employerId: string;
    locationType: string;
    salaryMin: number | null;
    salaryMax: number | null;
  } | null;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/bookmarks")
      .then((r) => r.json())
      .then((data) => setBookmarks(data.bookmarks || []))
      .catch(() => { trackEvent("bookmarks.load_failed"); })
      .finally(() => setLoading(false));
  }, []);

  /* # Remove a bookmark */
  async function handleRemove(id: string) {
    setRemoving(id);
    try {
      await fetch(`/api/user/bookmarks?id=${id}`, { method: "DELETE" });
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch {
      trackEvent("bookmarks.remove_failed");
    } finally {
      setRemoving(null);
    }
  }

  /* # Mutual interest badge */
  const mutualBadge = (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
      Mutual Interest
    </span>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookmarks</h1>
          <p className="mt-1 text-sm text-slate-400">
            Companies and roles you&apos;re interested in. When both sides bookmark each other, messaging unlocks.
          </p>
        </div>
        <span className="text-sm text-slate-500">{bookmarks.length} saved</span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-12 text-center">
          <p className="text-slate-400">No bookmarks yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Browse the{" "}
            <Link href="/roles" className="text-indigo-400 hover:text-indigo-300 underline">
              job board
            </Link>{" "}
            to find companies and roles you&apos;re interested in.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition hover:border-slate-600/50"
            >
              <div className="flex items-center gap-4">
                {/* # Company logo or placeholder */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700/50 text-lg font-bold text-indigo-400">
                  {bookmark.employer?.name?.charAt(0) ?? "?"}
                </div>

                <div>
                  {/* # Show employer name or role title */}
                  {bookmark.employer ? (
                    <div className="font-medium text-white">
                      {bookmark.employer.name}
                      {bookmark.employer.industry && (
                        <span className="ml-2 text-xs text-slate-500">{bookmark.employer.industry}</span>
                      )}
                    </div>
                  ) : null}

                  {bookmark.role ? (
                    <div className="text-sm text-indigo-400">{bookmark.role.title}</div>
                  ) : null}

                  <div className="mt-1 flex items-center gap-2">
                    {bookmark.mutualInterest && mutualBadge}
                    <span className="text-xs text-slate-500">
                      Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* # If mutual interest, show message link */}
                {bookmark.mutualInterest && (
                  <Link
                    href="/dashboard/messages"
                    className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 transition"
                  >
                    Message
                  </Link>
                )}
                <button
                  onClick={() => handleRemove(bookmark.id)}
                  disabled={removing === bookmark.id}
                  className="rounded-lg bg-slate-700/50 px-3 py-1.5 text-xs text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition disabled:opacity-50"
                >
                  {removing === bookmark.id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
