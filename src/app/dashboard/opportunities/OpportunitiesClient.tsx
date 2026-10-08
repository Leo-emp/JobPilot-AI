/* ============================================================
   OPPORTUNITIES — Candidate's matched roles
   ============================================================
   Shows roles the candidate has been matched with, ranked by
   match score. Candidates can see employer info, match details,
   and take actions (hide, withdraw).
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CANDIDATE_STATUS_LABELS,
  STATUS_COLORS,
} from "@/lib/match-pipeline";
import type { MatchStatus } from "@/lib/match-pipeline";
import { trackEvent } from "@/lib/track-event";

interface Opportunity {
  matchId: string;
  score: number;
  breakdown: Record<string, number>;
  matchedSkills: string[];
  missingSkills: string[];
  status: string;
  statusLabel: string;
  matchedAt: string;
  role: {
    id: string;
    title: string;
    description: string | null;
    locationType: string;
    location: string | null;
    employmentType: string;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string;
    industry: string | null;
    isActive: boolean;
  };
  employer: {
    name: string;
    slug: string;
    industry: string | null;
    size: string | null;
    logoUrl: string | null;
    remoteFriendly: boolean;
  };
}

/* # Score color helper */
function scoreColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  if (score >= 25) return "text-orange-400";
  return "text-red-400";
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, [statusFilter]);

  function fetchOpportunities() {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/user/opportunities?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setOpportunities(data.opportunities || []);
        setTotal(data.pagination?.total || 0);
        setLoading(false);
      })
      .catch(() => { trackEvent("opportunities.load_failed"); setLoading(false); });
  }

  /* # Hide or withdraw from a match */
  async function handleAction(matchId: string, action: "hide" | "withdraw") {
    if (action === "withdraw" && !confirm("Withdraw from this opportunity? The employer will be notified.")) return;

    setActionLoading(matchId);
    const res = await fetch("/api/user/opportunities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, action }),
    });

    if (res.ok) {
      /* # Remove from list after action */
      setOpportunities((prev) => prev.filter((o) => o.matchId !== matchId));
      setTotal((prev) => prev - 1);
    }
    setActionLoading(null);
  }

  /* # Status filter tabs */
  const filterTabs = [
    { key: null, label: "All" },
    { key: "new", label: "New" },
    { key: "shortlisted", label: "Under Review" },
    { key: "contacted", label: "Interested" },
    { key: "hired", label: "Selected" },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2">My Opportunities</h1>
      <p className="text-gray-400 mb-8">
        Roles you've been matched with based on your preferences. Your identity stays
        private until you decide to share it with an employer.
      </p>

      {/* # Status filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab.key || "all"}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === tab.key
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "text-gray-400 hover:text-white hover:bg-space-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* # Opportunity cards */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-space-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 bg-space-800 border border-card-border rounded-xl">
          <p className="text-gray-400 text-lg mb-2">No opportunities yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Make sure your job preferences are set and you're marked as "Open to Work" to get matched with roles.
          </p>
          <Link
            href="/dashboard/preferences"
            className="px-6 py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-500 transition-colors"
          >
            Set Preferences
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => {
            const colors = STATUS_COLORS[opp.status as MatchStatus] || STATUS_COLORS.new;
            return (
              <div
                key={opp.matchId}
                className="p-6 bg-space-800 border border-card-border rounded-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* # Left — role info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {/* # Employer logo or initial */}
                      <div className="w-10 h-10 bg-space-700 rounded-lg flex items-center justify-center shrink-0">
                        {opp.employer.logoUrl ? (
                          <img
                            src={opp.employer.logoUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-gray-400">
                            {opp.employer.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-semibold truncate">{opp.role.title}</h3>
                        <p className="text-sm text-gray-400">
                          {opp.employer.name}
                          {opp.employer.industry && ` · ${opp.employer.industry}`}
                        </p>
                      </div>
                    </div>

                    {/* # Role tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                        {opp.statusLabel}
                      </span>
                      <span className="text-xs bg-space-700 text-gray-300 px-2 py-1 rounded capitalize">
                        {opp.role.locationType}
                      </span>
                      <span className="text-xs bg-space-700 text-gray-300 px-2 py-1 rounded capitalize">
                        {opp.role.employmentType.replace("-", " ")}
                      </span>
                      {opp.role.salaryMin && (
                        <span className="text-xs bg-space-700 text-gray-300 px-2 py-1 rounded">
                          {opp.role.salaryCurrency} {opp.role.salaryMin.toLocaleString()}
                          {opp.role.salaryMax ? `–${opp.role.salaryMax.toLocaleString()}` : "+"}
                        </span>
                      )}
                    </div>

                    {/* # Matched skills */}
                    {opp.matchedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {opp.matchedSkills.slice(0, 6).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {opp.matchedSkills.length > 6 && (
                          <span className="text-xs text-gray-500">
                            +{opp.matchedSkills.length - 6} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* # Description preview */}
                    {opp.role.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {opp.role.description}
                      </p>
                    )}
                  </div>

                  {/* # Right — score + actions */}
                  <div className="text-right shrink-0">
                    <div className={`text-2xl font-bold ${scoreColor(opp.score)}`}>
                      {opp.score}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Match</p>

                    {/* # Actions */}
                    <div className="mt-4 flex flex-col gap-2">
                      <Link
                        href={`/jobs/${opp.role.id}`}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        View Role
                      </Link>
                      {opp.status !== "withdrawn" && (
                        <>
                          <button
                            onClick={() => handleAction(opp.matchId, "hide")}
                            disabled={actionLoading === opp.matchId}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
                          >
                            Hide
                          </button>
                          <button
                            onClick={() => handleAction(opp.matchId, "withdraw")}
                            disabled={actionLoading === opp.matchId}
                            className="text-xs text-red-400/70 hover:text-red-300 transition-colors disabled:opacity-50"
                          >
                            Withdraw
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* # Total count */}
      {!loading && total > 0 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Showing {opportunities.length} of {total} opportunities
        </p>
      )}
    </div>
  );
}
