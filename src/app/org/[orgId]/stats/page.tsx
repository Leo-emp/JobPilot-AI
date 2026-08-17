/* ============================================================
   ORG STATS — Analytics page with cohort filtering
   ============================================================
   Redirects to the overview page which already shows stats.
   This is a dedicated stats page for deeper analytics.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface OrgStats {
  totalMembers: number;
  activeThisWeek: number;
  resumesCreated: number;
  applicationsByStatus: Record<string, number>;
  aiCallsTotal: number;
}

export default function OrgStatsPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [cohort, setCohort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [orgId, cohort]);

  function fetchStats() {
    setLoading(true);
    const params = new URLSearchParams();
    if (cohort) params.set("cohort", cohort);

    fetch(`/api/org/${orgId}/stats?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  if (loading && !stats) {
    return (
      <div className="animate-pulse">
        <div className="h-9 w-48 bg-space-700 rounded-xl mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-space-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-gray-400 py-10 text-center">Unable to load stats.</p>;
  }

  const totalApps = Object.values(stats.applicationsByStatus).reduce((a, b) => a + b, 0);

  /* # Pipeline data for the bar chart */
  const pipelineStages = [
    { key: "saved", label: "Saved", color: "bg-gray-500" },
    { key: "applied", label: "Applied", color: "bg-blue-500" },
    { key: "interviewing", label: "Interviewing", color: "bg-amber-500" },
    { key: "offered", label: "Offered", color: "bg-emerald-500" },
    { key: "rejected", label: "Rejected", color: "bg-red-500" },
  ];

  /* # Key metrics */
  const metrics = [
    { label: "Total Members", value: stats.totalMembers, color: "text-indigo-400", desc: "All active members" },
    { label: "Active This Week", value: stats.activeThisWeek, color: "text-emerald-400", desc: "Members with AI activity" },
    { label: "Resumes Created", value: stats.resumesCreated, color: "text-blue-400", desc: "Total resumes in system" },
    { label: "Total AI Calls", value: stats.aiCallsTotal, color: "text-purple-400", desc: "AI actions performed" },
    { label: "Total Applications", value: totalApps, color: "text-amber-400", desc: "Across all stages" },
    {
      label: "Success Rate",
      value: totalApps > 0
        ? `${Math.round(((stats.applicationsByStatus.offered || 0) / totalApps) * 100)}%`
        : "0%",
      color: "text-emerald-400",
      desc: "Offers / Total applications",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Aggregate metrics for your organization</p>
        </div>
        {/* # Cohort filter */}
        <input
          type="text"
          placeholder="Filter by cohort..."
          value={cohort}
          onChange={(e) => setCohort(e.target.value)}
          className="bg-space-700 border border-card-border rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
        />
      </div>

      {/* # Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="p-5 bg-space-800 border border-card-border rounded-xl">
            <p className="text-sm text-gray-400">{m.label}</p>
            <p className={`text-3xl font-bold mt-1 ${m.color}`}>{m.value}</p>
            <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* # Pipeline chart */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl">
        <h2 className="text-lg font-semibold text-white mb-6">Application Pipeline</h2>
        <div className="flex gap-3 items-end h-40">
          {pipelineStages.map((stage) => {
            const count = stats.applicationsByStatus[stage.key] || 0;
            const height = totalApps > 0 ? Math.max(8, (count / totalApps) * 100) : 8;
            return (
              <div key={stage.key} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-white">{count}</span>
                <div
                  className={`w-full ${stage.color} rounded-t-xl transition-all`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400 mt-1">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
