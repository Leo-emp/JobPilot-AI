/* ============================================================
   ORG OVERVIEW — Coach/Admin dashboard for a single org
   ============================================================
   Shows key metrics: total members, active users, resumes,
   applications pipeline, AI usage. Coaches see aggregate stats;
   admins see management links.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface OrgStats {
  totalMembers: number;
  activeThisWeek: number;
  resumesCreated: number;
  applicationsByStatus: Record<string, number>;
  aiCallsTotal: number;
}

interface OrgProfile {
  id: string;
  name: string;
  type: string;
  slug: string;
  logoUrl: string | null;
  billingEmail: string | null;
  seatLimit: number | null;
  sponsorPlan: string;
  dataVisibility: string;
  _count: { members: number; invites: number };
}

export default function OrgOverviewPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [org, setOrg] = useState<OrgProfile | null>(null);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* # Fetch org profile + stats in parallel */
    Promise.all([
      fetch(`/api/org/${orgId}`).then((r) => r.json()),
      fetch(`/api/org/${orgId}/stats`).then((r) => r.json()),
    ])
      .then(([orgData, statsData]) => {
        setOrg(orgData.organization);
        setRole(orgData.role);
        setStats(statsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orgId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
        <div className="h-5 w-96 bg-space-700 rounded-lg mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-space-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!org || !stats) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Organization not found or you do not have access.</p>
      </div>
    );
  }

  /* # Calculate total applications */
  const totalApps = Object.values(stats.applicationsByStatus).reduce((a, b) => a + b, 0);

  /* # Stat cards data */
  const statCards = [
    { label: "Members", value: stats.totalMembers, color: "text-indigo-400" },
    { label: "Active This Week", value: stats.activeThisWeek, color: "text-emerald-400" },
    { label: "Resumes Created", value: stats.resumesCreated, color: "text-blue-400" },
    { label: "AI Calls", value: stats.aiCallsTotal, color: "text-purple-400" },
  ];

  /* # Pipeline stages with colors */
  const pipelineStages = [
    { key: "saved", label: "Saved", color: "bg-gray-500" },
    { key: "applied", label: "Applied", color: "bg-blue-500" },
    { key: "interviewing", label: "Interviewing", color: "bg-amber-500" },
    { key: "offered", label: "Offered", color: "bg-emerald-500" },
    { key: "rejected", label: "Rejected", color: "bg-red-500" },
  ];

  return (
    <div>
      {/* # Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{org.name}</h1>
          <p className="text-gray-400 mt-1 capitalize">{org.type} Dashboard</p>
        </div>
        {(role === "admin" || role === "owner") && (
          <Link
            href={`/org/${orgId}/invites`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Invite Members
          </Link>
        )}
      </div>

      {/* # Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="p-4 bg-space-800 border border-card-border rounded-xl">
            <p className="text-sm text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* # Application pipeline */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Application Pipeline</h2>
        <div className="flex gap-2 items-end h-32">
          {pipelineStages.map((stage) => {
            const count = stats.applicationsByStatus[stage.key] || 0;
            const height = totalApps > 0 ? Math.max(8, (count / totalApps) * 100) : 8;
            return (
              <div key={stage.key} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{count}</span>
                <div
                  className={`w-full ${stage.color} rounded-t-lg transition-all`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500 mt-1">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* # Quick links for admins/owners */}
      {(role === "admin" || role === "owner") && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={`/org/${orgId}/members`}
            className="p-4 bg-space-800 border border-card-border rounded-xl hover:border-indigo-500/50 transition-all"
          >
            <h3 className="font-semibold text-white">Manage Members</h3>
            <p className="text-sm text-gray-400 mt-1">{org._count.members} members</p>
          </Link>
          <Link
            href={`/org/${orgId}/invites`}
            className="p-4 bg-space-800 border border-card-border rounded-xl hover:border-indigo-500/50 transition-all"
          >
            <h3 className="font-semibold text-white">Invitations</h3>
            <p className="text-sm text-gray-400 mt-1">{org._count.invites} sent</p>
          </Link>
          <Link
            href={`/org/${orgId}/export`}
            className="p-4 bg-space-800 border border-card-border rounded-xl hover:border-indigo-500/50 transition-all"
          >
            <h3 className="font-semibold text-white">Export Data</h3>
            <p className="text-sm text-gray-400 mt-1">Download CSV roster</p>
          </Link>
        </div>
      )}
    </div>
  );
}
