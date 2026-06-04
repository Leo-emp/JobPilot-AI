/* ============================================================
   ADMIN DASHBOARD — Platform Analytics
   ============================================================
   Shows total users, plan breakdown, AI usage, content stats,
   and a full user list. Only accessible to admin emails.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

/* ---- Types ---- */
interface UserRow {
  id: string;
  name: string;
  email: string;
  image: string | null;
  plan: string;
  aiUsageCount: number;
  usageResetDate: string;
  createdAt: string;
  _count: {
    resumes: number;
    jobs: number;
    applications: number;
    coverLetters: number;
    contacts: number;
  };
}

interface WeeklyGrowth {
  week: string;
  signups: number;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalUsers: number;
  totalPages: number;
}

interface AdminStats {
  overview: {
    totalUsers: number;
    freeUsers: number;
    proUsers: number;
    recentSignups: number;
    monthlySignups: number;
    totalAICalls: number;
  };
  revenue: {
    estimatedMRR: number;
    conversionRate: string;
    avgAICallsPerUser: number;
    monthlyPrice: number;
    annualMonthlyPrice: number;
  };
  growth: WeeklyGrowth[];
  content: {
    totalResumes: number;
    totalJobs: number;
    totalApplications: number;
    totalCoverLetters: number;
    totalContacts: number;
    totalCompanies: number;
  };
  users: UserRow[];
  pagination: Pagination;
}

interface FeedbackRow {
  id: string;
  email: string;
  category: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);
  const [feedbackFilter, setFeedbackFilter] = useState("all");
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [feedbackPages, setFeedbackPages] = useState(1);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  /* ---- Fetch admin stats ---- */
  const fetchStats = async (page: number, initial = false) => {
    if (!initial) setLoadingPage(true);
    try {
      const res = await fetch(`/api/admin/stats?page=${page}`);
      if (res.status === 403) throw new Error("You don't have admin access.");
      if (!res.ok) throw new Error("Failed to load stats");
      const data = await res.json().catch(() => null);
      if (data) { setStats(data); setCurrentPage(page); }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/stats?page=1");
        if (res.status === 403) throw new Error("You don't have admin access.");
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json().catch(() => null);
        if (!cancelled && data) { setStats(data); setCurrentPage(1); }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load stats");
      } finally {
        if (!cancelled) { setLoading(false); setLoadingPage(false); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ---- Fetch feedback ---- */
  const fetchFeedback = async (page: number, status: string) => {
    setFeedbackLoading(true);
    try {
      const res = await fetch(`/api/feedback?page=${page}&status=${status}`);
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (!data) return;
        setFeedbacks(data.feedbacks);
        setFeedbackTotal(data.pagination?.total);
        setFeedbackPages(data.pagination?.totalPages);
        setFeedbackPage(page);
      }
    } catch { /* ignore */ } finally { setFeedbackLoading(false); }
  };

  useEffect(() => { fetchFeedback(1, feedbackFilter); }, [feedbackFilter]);

  const updateFeedbackStatus = async (id: string, status: string) => {
    await fetch("/api/feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchFeedback(feedbackPage, feedbackFilter);
  };

  /* ---- Filter users by search ---- */
  const filteredUsers = stats?.users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  /* ---- Format date for display ---- */
  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  /* ---- Time ago helper ---- */
  const [now] = useState(() => Date.now());
  const timeAgo = (d: string) => {
    const diff = now - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(d);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-brand-indigo mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-text-secondary">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-text-secondary mb-6">{error}</p>
        <Link href="/dashboard" className="text-brand-light hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  if (!stats) return null;

  const { overview, revenue, growth, content } = stats;

  return (
    <div>
      {/* ---- Header ---- */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard" className="text-text-secondary hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <p className="text-text-secondary mb-8">Platform analytics and user management</p>

      {/* ---- Overview Cards ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Total Users", value: overview.totalUsers, color: "text-white", icon: "👥" },
          { label: "Free Users", value: overview.freeUsers, color: "text-blue-400", icon: "🆓" },
          { label: "Pro Users", value: overview.proUsers, color: "text-blue-400", icon: "⭐" },
          { label: "This Week", value: overview.recentSignups, color: "text-green-400", icon: "📈" },
          { label: "This Month", value: overview.monthlySignups, color: "text-yellow-400", icon: "📅" },
          { label: "Total AI Calls", value: overview.totalAICalls, color: "text-brand-light", icon: "🤖" },
        ].map(card => (
          <div key={card.label} className="p-4 rounded-2xl bg-space-700/80 border border-card-border text-center">
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value.toLocaleString()}</div>
            <div className="text-xs text-text-muted mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* ---- Plan Distribution Bar ---- */}
      {overview.totalUsers > 0 && (
        <div className="p-5 rounded-2xl bg-space-700/80 border border-card-border mb-8">
          <h3 className="font-semibold text-white mb-3">Plan Distribution</h3>
          <div className="flex h-8 rounded-xl overflow-hidden bg-space-600">
            {overview.freeUsers > 0 && (
              <div className="bg-blue-500/60 flex items-center justify-center text-xs font-medium text-white"
                style={{ width: `${(overview.freeUsers / overview.totalUsers) * 100}%` }}>
                Free {Math.round((overview.freeUsers / overview.totalUsers) * 100)}%
              </div>
            )}
            {overview.proUsers > 0 && (
              <div className="bg-blue-500/60 flex items-center justify-center text-xs font-medium text-white"
                style={{ width: `${(overview.proUsers / overview.totalUsers) * 100}%` }}>
                Pro {Math.round((overview.proUsers / overview.totalUsers) * 100)}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- Revenue & Business Metrics ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* MRR + Conversion */}
        <div className="p-5 rounded-2xl bg-space-700/80 border border-card-border">
          <h3 className="font-semibold text-white mb-4">Revenue Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-green-400">£{revenue.estimatedMRR}</div>
              <div className="text-xs text-text-muted mt-1">Estimated MRR</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{revenue.conversionRate}%</div>
              <div className="text-xs text-text-muted mt-1">Conversion Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{revenue.avgAICallsPerUser}</div>
              <div className="text-xs text-text-muted mt-1">Avg AI Calls/User</div>
            </div>
          </div>
        </div>

        {/* Weekly Growth Chart */}
        <div className="p-5 rounded-2xl bg-space-700/80 border border-card-border">
          <h3 className="font-semibold text-white mb-4">Weekly Signups (8 weeks)</h3>
          <div className="flex items-end gap-1.5 h-20">
            {growth.map((w, i) => {
              const max = Math.max(...growth.map(g => g.signups), 1);
              const height = (w.signups / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-text-muted">{w.signups || ""}</span>
                  <div
                    className="w-full rounded-t bg-brand-indigo/60 transition-all"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-[9px] text-text-muted truncate w-full text-center">{w.week}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---- Platform Content Stats ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Resumes", value: content.totalResumes, icon: "📄" },
          { label: "Jobs Saved", value: content.totalJobs, icon: "🔍" },
          { label: "Applications", value: content.totalApplications, icon: "📊" },
          { label: "Cover Letters", value: content.totalCoverLetters, icon: "✉️" },
          { label: "Contacts", value: content.totalContacts, icon: "🤝" },
          { label: "Companies", value: content.totalCompanies, icon: "🏢" },
        ].map(card => (
          <div key={card.label} className="p-4 rounded-2xl bg-space-700/50 border border-card-border/50 text-center">
            <div className="text-xl mb-1">{card.icon}</div>
            <div className="text-xl font-bold text-white">{card.value.toLocaleString()}</div>
            <div className="text-xs text-text-muted mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* ---- User List ---- */}
      <div className="rounded-2xl bg-space-700/80 border border-card-border overflow-hidden">
        <div className="p-5 border-b border-card-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-semibold text-white">All Users ({stats.pagination.totalUsers.toLocaleString()})</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="px-3 py-2 rounded-xl bg-space-600 border border-card-border/50 text-sm text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none w-full sm:w-64"
          />
        </div>

        {/* ---- Table (scrollable on mobile) ---- */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border/50 text-text-muted text-left">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium text-center">AI Calls</th>
                <th className="px-5 py-3 font-medium text-center">Resumes</th>
                <th className="px-5 py-3 font-medium text-center">Jobs</th>
                <th className="px-5 py-3 font-medium text-center">Apps</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-card-border/30 hover:bg-space-600/30 transition-colors">
                  {/* ---- User info ---- */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image src={user.image} alt="" width={32} height={32} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                          {user.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-text-muted text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* ---- Plan badge ---- */}
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.plan === "pro"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}>
                      {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                    </span>
                  </td>
                  {/* ---- Stats ---- */}
                  <td className="px-5 py-3 text-center text-text-secondary">{user.aiUsageCount}</td>
                  <td className="px-5 py-3 text-center text-text-secondary">{user._count.resumes}</td>
                  <td className="px-5 py-3 text-center text-text-secondary">{user._count.jobs}</td>
                  <td className="px-5 py-3 text-center text-text-secondary">{user._count.applications}</td>
                  {/* ---- Joined date ---- */}
                  <td className="px-5 py-3 text-text-muted text-xs">{timeAgo(user.createdAt)}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-text-muted">
                    {searchQuery ? "No users match your search" : "No users yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---- Pagination Controls ---- */}
        {stats.pagination.totalPages > 1 && (
          <div className="p-4 border-t border-card-border flex items-center justify-between">
            <p className="text-xs text-text-muted">
              Page {currentPage} of {stats.pagination.totalPages} · Showing {stats.users.length} of {stats.pagination.totalUsers.toLocaleString()} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchStats(currentPage - 1)}
                disabled={currentPage <= 1 || loadingPage}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-space-600 border border-card-border/50 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-space-500 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => fetchStats(currentPage + 1)}
                disabled={currentPage >= stats.pagination.totalPages || loadingPage}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-space-600 border border-card-border/50 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-space-500 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---- User Feedback ---- */}
      <div className="rounded-2xl bg-space-700/80 border border-card-border overflow-hidden mt-8">
        <div className="p-5 border-b border-card-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-semibold text-white">User Feedback ({feedbackTotal})</h3>
          <div className="flex gap-2">
            {["all", "new", "reviewed", "resolved"].map(s => (
              <button key={s} onClick={() => setFeedbackFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${feedbackFilter === s ? "bg-brand-indigo/20 text-brand-light border border-brand-indigo/30" : "bg-space-600 text-text-muted border border-card-border/50 hover:text-white"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {feedbackLoading ? (
          <div className="p-8 text-center text-text-muted">Loading feedback...</div>
        ) : feedbacks.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No feedback yet</div>
        ) : (
          <div className="divide-y divide-card-border/30">
            {feedbacks.map(fb => (
              <div key={fb.id} className="p-5 hover:bg-space-600/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        fb.category === "bug" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                        fb.category === "feature" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                        fb.category === "improvement" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}>{fb.category}</span>
                      <span className="text-xs text-text-muted">{fb.email}</span>
                      <span className="text-xs text-text-muted">{timeAgo(fb.createdAt)}</span>
                    </div>
                    <p className="text-sm text-white whitespace-pre-wrap">{fb.message}</p>
                  </div>
                  <select
                    value={fb.status}
                    onChange={e => updateFeedbackStatus(fb.id, e.target.value)}
                    className="px-2 py-1 rounded-lg text-xs bg-space-600 border border-card-border/50 text-text-secondary focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {feedbackPages > 1 && (
          <div className="p-4 border-t border-card-border flex items-center justify-between">
            <p className="text-xs text-text-muted">Page {feedbackPage} of {feedbackPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => fetchFeedback(feedbackPage - 1, feedbackFilter)} disabled={feedbackPage <= 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-space-600 border border-card-border/50 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-space-500 transition-colors">
                Prev
              </button>
              <button onClick={() => fetchFeedback(feedbackPage + 1, feedbackFilter)} disabled={feedbackPage >= feedbackPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-space-600 border border-card-border/50 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-space-500 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
