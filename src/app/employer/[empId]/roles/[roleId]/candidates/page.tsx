/* ============================================================
   MATCHED CANDIDATES — Kanban pipeline view
   ============================================================
   Employer-facing candidate pipeline with columns:
   New Matches → Shortlisted → Contacted → Hired / Rejected
   Drag-free design (button-based status changes) for simplicity.
   Includes score breakdown, feedback (thumbs up/down), and
   score-based filtering.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PIPELINE_COLUMNS } from "@/lib/match-pipeline";
import type { MatchStatus } from "@/lib/match-pipeline";

interface ScoreBreakdown {
  skills: number;
  bonusSkills: number;
  location: number;
  salary: number;
  experience: number;
  employmentType: number;
  industry: number;
}

interface CandidateMatch {
  candidateId: string;
  matchId: string;
  score: {
    total: number;
    breakdown: ScoreBreakdown;
    matchedSkills: string[];
    missingSkills: string[];
  };
  status: string;
  feedback: string | null;
  feedbackNote: string | null;
  preferences: {
    desiredTitle: string | null;
    locationPref: string;
    employmentType: string;
    openToWork: boolean;
  };
  activity: {
    resumeCount: number;
    aiCallCount: number;
  };
}

interface Stats {
  totalCandidates: number;
  averageScore: number;
  topScore: number;
}

/* # Score color helper */
function scoreColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  if (score >= 25) return "text-orange-400";
  return "text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  if (score >= 25) return "bg-orange-500";
  return "bg-red-500";
}

export default function CandidatesPage() {
  const params = useParams();
  const router = useRouter();
  const empId = params.empId as string;
  const roleId = params.roleId as string;
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [roleTitle, setRoleTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, [empId, roleId, minScore]);

  function fetchCandidates() {
    setLoading(true);
    const p = new URLSearchParams();
    p.set("limit", "50");
    if (minScore > 0) p.set("minScore", minScore.toString());

    fetch(`/api/employer/${empId}/roles/${roleId}/candidates?${p}`)
      .then((r) => r.json())
      .then((data) => {
        setCandidates(data.candidates || []);
        setStats(data.stats || null);
        setRoleTitle(data.role?.title || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  /* # Update a candidate's pipeline status */
  async function updateStatus(candidateId: string, newStatus: MatchStatus) {
    setUpdating(candidateId);
    const res = await fetch(`/api/employer/${empId}/roles/${roleId}/candidates`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId, status: newStatus }),
    });
    if (res.ok) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.candidateId === candidateId ? { ...c, status: newStatus } : c
        )
      );
    }
    setUpdating(null);
  }

  /* # Submit feedback on a candidate */
  async function submitFeedback(candidateId: string, feedback: "thumbs_up" | "thumbs_down") {
    setUpdating(candidateId);
    const res = await fetch(`/api/employer/${empId}/roles/${roleId}/candidates`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId, feedback }),
    });
    if (res.ok) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.candidateId === candidateId ? { ...c, feedback } : c
        )
      );
    }
    setUpdating(null);
  }

  /* # Group candidates by status for Kanban */
  function groupByStatus(): Record<string, CandidateMatch[]> {
    const groups: Record<string, CandidateMatch[]> = {};
    for (const col of PIPELINE_COLUMNS) {
      groups[col.key] = [];
    }
    for (const c of candidates) {
      if (groups[c.status]) {
        groups[c.status].push(c);
      } else {
        groups.new.push(c);
      }
    }
    return groups;
  }

  /* # Available status transitions per current status */
  function getActions(status: string): { label: string; target: MatchStatus; color: string }[] {
    switch (status) {
      case "new":
        return [
          { label: "Shortlist", target: "shortlisted", color: "bg-amber-600 hover:bg-amber-500" },
          { label: "Reject", target: "rejected", color: "bg-red-600/30 hover:bg-red-600/50 text-red-400" },
        ];
      case "shortlisted":
        return [
          { label: "Contact", target: "contacted", color: "bg-purple-600 hover:bg-purple-500" },
          { label: "Reject", target: "rejected", color: "bg-red-600/30 hover:bg-red-600/50 text-red-400" },
        ];
      case "contacted":
        return [
          { label: "Hire", target: "hired", color: "bg-emerald-600 hover:bg-emerald-500" },
          { label: "Reject", target: "rejected", color: "bg-red-600/30 hover:bg-red-600/50 text-red-400" },
        ];
      case "rejected":
        return [
          { label: "Reconsider", target: "new", color: "bg-blue-600/30 hover:bg-blue-600/50 text-blue-400" },
        ];
      default:
        return [];
    }
  }

  /* # Render a candidate card */
  function renderCard(candidate: CandidateMatch) {
    const isUpdating = updating === candidate.candidateId;
    const actions = getActions(candidate.status);

    return (
      <div
        key={candidate.candidateId}
        className="p-4 bg-space-900 border border-card-border/50 rounded-lg"
      >
        {/* # Header — title + score */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-sm text-white font-medium truncate">
              {candidate.preferences.desiredTitle || "Open to opportunities"}
            </p>
            <p className="text-xs text-gray-500">
              {candidate.activity.resumeCount} resume{candidate.activity.resumeCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className={`text-lg font-bold ${scoreColor(candidate.score.total)} shrink-0`}>
            {candidate.score.total}
          </div>
        </div>

        {/* # Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="text-xs bg-space-700 text-gray-300 px-1.5 py-0.5 rounded capitalize">
            {candidate.preferences.locationPref}
          </span>
          <span className="text-xs bg-space-700 text-gray-300 px-1.5 py-0.5 rounded capitalize">
            {candidate.preferences.employmentType.replace("-", " ")}
          </span>
        </div>

        {/* # Matched skills (top 4) */}
        {candidate.score.matchedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {candidate.score.matchedSkills.slice(0, 4).map((skill) => (
              <span key={skill} className="text-xs bg-emerald-500/10 text-emerald-300/80 px-1.5 py-0.5 rounded">
                {skill}
              </span>
            ))}
            {candidate.score.matchedSkills.length > 4 && (
              <span className="text-xs text-gray-600">+{candidate.score.matchedSkills.length - 4}</span>
            )}
          </div>
        )}

        {/* # Feedback buttons */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => submitFeedback(candidate.candidateId, "thumbs_up")}
            disabled={isUpdating}
            className={`p-1.5 rounded transition-colors ${
              candidate.feedback === "thumbs_up"
                ? "bg-emerald-500/20 text-emerald-300"
                : "text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10"
            }`}
            title="Good match"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </button>
          <button
            onClick={() => submitFeedback(candidate.candidateId, "thumbs_down")}
            disabled={isUpdating}
            className={`p-1.5 rounded transition-colors ${
              candidate.feedback === "thumbs_down"
                ? "bg-red-500/20 text-red-400"
                : "text-gray-500 hover:text-red-400 hover:bg-red-500/10"
            }`}
            title="Poor match"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </button>
        </div>

        {/* # Pipeline actions */}
        <div className="flex gap-1.5">
          {actions.map((action) => (
            <button
              key={action.target}
              onClick={() => updateStatus(candidate.candidateId, action.target)}
              disabled={isUpdating}
              className={`flex-1 px-2 py-1.5 text-xs text-white rounded transition-colors disabled:opacity-50 ${action.color}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* # Back + header */}
      <button
        onClick={() => router.back()}
        className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Role
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Candidate Pipeline</h1>
          <p className="text-gray-400">{roleTitle}</p>
        </div>

        {/* # View mode toggle */}
        <div className="flex bg-space-700 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === "kanban" ? "bg-space-600 text-white" : "text-gray-400"
            }`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === "list" ? "bg-space-600 text-white" : "text-gray-400"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* # Stats bar */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-space-800 border border-card-border rounded-xl text-center">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-xl font-bold text-white">{stats.totalCandidates}</p>
          </div>
          <div className="p-3 bg-space-800 border border-card-border rounded-xl text-center">
            <p className="text-xs text-gray-400">Avg Score</p>
            <p className={`text-xl font-bold ${scoreColor(stats.averageScore)}`}>{stats.averageScore}</p>
          </div>
          <div className="p-3 bg-space-800 border border-card-border rounded-xl text-center">
            <p className="text-xs text-gray-400">Top Score</p>
            <p className={`text-xl font-bold ${scoreColor(stats.topScore)}`}>{stats.topScore}</p>
          </div>
        </div>
      )}

      {/* # Min score filter */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm text-gray-400">Min score:</label>
        <div className="flex gap-2">
          {[0, 25, 50, 75].map((threshold) => (
            <button
              key={threshold}
              onClick={() => setMinScore(threshold)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                minScore === threshold
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-space-700"
              }`}
            >
              {threshold === 0 ? "All" : `${threshold}+`}
            </button>
          ))}
        </div>
      </div>

      {/* # Loading state */}
      {loading ? (
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-64 bg-space-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-16 bg-space-800 border border-card-border rounded-xl">
          <p className="text-gray-400 text-lg mb-2">No matching candidates found</p>
          <p className="text-gray-500 text-sm">
            {minScore > 0
              ? "Try lowering the minimum score threshold."
              : "Candidates will appear here when they set their preferences and mark themselves as open to work."}
          </p>
        </div>
      ) : viewMode === "kanban" ? (
        /* # Kanban view */
        <div className="grid grid-cols-5 gap-4 overflow-x-auto">
          {PIPELINE_COLUMNS.map((col) => {
            const grouped = groupByStatus();
            const colCandidates = grouped[col.key] || [];
            return (
              <div key={col.key} className="min-w-[220px]">
                {/* # Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-semibold text-gray-300">{col.label}</h3>
                  <span className="text-xs bg-space-700 text-gray-400 px-2 py-0.5 rounded-full">
                    {colCandidates.length}
                  </span>
                </div>

                {/* # Column cards */}
                <div className="space-y-3">
                  {colCandidates.map(renderCard)}
                  {colCandidates.length === 0 && (
                    <div className="p-4 border border-dashed border-card-border/30 rounded-lg text-center">
                      <p className="text-xs text-gray-600">No candidates</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* # List view */
        <div className="space-y-3">
          {candidates.map((candidate, idx) => (
            <div
              key={candidate.candidateId}
              className="p-5 bg-space-800 border border-card-border rounded-xl flex items-start gap-4"
            >
              {/* # Rank */}
              <span className="w-7 h-7 bg-space-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 shrink-0 mt-0.5">
                {idx + 1}
              </span>

              {/* # Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">
                  {candidate.preferences.desiredTitle || "Open to opportunities"}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs bg-space-700 text-gray-300 px-2 py-0.5 rounded capitalize">
                    {candidate.preferences.locationPref}
                  </span>
                  <span className="text-xs bg-space-700 text-gray-300 px-2 py-0.5 rounded capitalize">
                    {candidate.preferences.employmentType.replace("-", " ")}
                  </span>
                  <span className="text-xs bg-space-700 text-gray-400 px-2 py-0.5 rounded">
                    {candidate.status}
                  </span>
                </div>
                {candidate.score.matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {candidate.score.matchedSkills.slice(0, 6).map((skill) => (
                      <span key={skill} className="text-xs bg-emerald-500/10 text-emerald-300/80 px-1.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* # Score */}
              <div className={`text-2xl font-bold ${scoreColor(candidate.score.total)} shrink-0`}>
                {candidate.score.total}
              </div>

              {/* # Actions */}
              <div className="flex gap-1.5 shrink-0">
                {getActions(candidate.status).map((action) => (
                  <button
                    key={action.target}
                    onClick={() => updateStatus(candidate.candidateId, action.target)}
                    disabled={updating === candidate.candidateId}
                    className={`px-3 py-1.5 text-xs text-white rounded transition-colors disabled:opacity-50 ${action.color}`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
