/* ============================================================
   EMPLOYER PIPELINE — Kanban view of candidates across roles
   ============================================================
   Shows all candidate matches across the employer's active roles
   organized by pipeline stage: New → Shortlisted → Contacted →
   Responded → Interviewing → Offered → Hired.

   Candidates can be dragged between stages (via status update).
   ============================================================ */

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

/* # Pipeline stages in order */
const STAGES = [
  { key: "new", label: "New", color: "bg-slate-500" },
  { key: "shortlisted", label: "Shortlisted", color: "bg-indigo-500" },
  { key: "contacted", label: "Contacted", color: "bg-blue-500" },
  { key: "responded", label: "Responded", color: "bg-green-500" },
  { key: "interviewing", label: "Interviewing", color: "bg-yellow-500" },
  { key: "offered", label: "Offered", color: "bg-purple-500" },
  { key: "hired", label: "Hired", color: "bg-emerald-500" },
];

interface CandidateMatch {
  id: string;
  candidateId: string | null;
  externalId: string | null;
  score: number;
  status: string;
  source: string;
  matchedSkills: string | null;
  candidate?: {
    name: string;
    image: string | null;
  };
  externalCandidate?: {
    name: string;
    source: string;
    profileUrl: string;
  };
  role: {
    id: string;
    title: string;
  };
}

interface RoleOption {
  id: string;
  title: string;
}

export default function PipelinePage({
  params,
}: {
  params: Promise<{ empId: string }>;
}) {
  const { empId } = use(params);
  const router = useRouter();
  const [matches, setMatches] = useState<CandidateMatch[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  /* # Fetch roles and matches */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        /* # Fetch active roles */
        const rolesRes = await fetch(`/api/employer/${empId}/roles`);
        const rolesData = await rolesRes.json();
        const roleList = rolesData.roles ?? [];
        setRoles(roleList.map((r: { id: string; title: string }) => ({
          id: r.id,
          title: r.title,
        })));

        /* # Fetch candidates for each role */
        const allMatches: CandidateMatch[] = [];
        const targetRoles = selectedRole === "all"
          ? roleList
          : roleList.filter((r: { id: string }) => r.id === selectedRole);

        for (const role of targetRoles) {
          const res = await fetch(
            `/api/employer/${empId}/roles/${role.id}/candidates?limit=50`,
          );
          const data = await res.json();
          if (data.candidates) {
            allMatches.push(
              ...data.candidates.map((c: Record<string, unknown>) => ({
                ...c,
                role: { id: role.id, title: role.title },
              })),
            );
          }
        }

        setMatches(allMatches);
      } catch (err) {
        console.error("Failed to load pipeline:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [empId, selectedRole]);

  /* # Update candidate status */
  async function updateStatus(matchId: string, roleId: string, newStatus: string) {
    try {
      await fetch(`/api/employer/${empId}/roles/${roleId}/candidates`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, status: newStatus }),
      });

      /* # Update local state */
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, status: newStatus } : m,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  /* # Group matches by stage */
  const grouped = STAGES.map((stage) => ({
    ...stage,
    matches: matches.filter((m) => m.status === stage.key),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted">Loading pipeline...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* # Header with role filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Recruiting Pipeline
        </h1>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-card-border text-foreground text-sm"
        >
          <option value="all">All Roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.title}
            </option>
          ))}
        </select>
      </div>

      {/* # Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {grouped.map((stage) => (
          <div
            key={stage.key}
            className="min-w-[240px] max-w-[280px] flex-shrink-0"
          >
            {/* # Stage header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <h3 className="text-sm font-semibold text-foreground">
                {stage.label}
              </h3>
              <span className="text-xs text-muted bg-card px-2 py-0.5 rounded-full">
                {stage.matches.length}
              </span>
            </div>

            {/* # Stage column */}
            <div className="space-y-2 min-h-[200px] p-2 rounded-lg bg-card/30 border border-card-border/50">
              {stage.matches.length === 0 && (
                <p className="text-xs text-muted text-center py-8">
                  No candidates
                </p>
              )}

              {stage.matches.map((match) => (
                <div
                  key={match.id}
                  className="p-3 rounded-lg bg-card border border-card-border hover:border-indigo-500/50 transition-colors cursor-pointer"
                >
                  {/* # Candidate name + source */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {match.candidate?.name ??
                        match.externalCandidate?.name ??
                        "Unknown"}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        match.source === "internal"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {match.source === "internal" ? "Internal" : match.source}
                    </span>
                  </div>

                  {/* # Score bar */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1.5 rounded-full bg-card-border">
                      <div
                        className={`h-full rounded-full ${
                          match.score >= 80
                            ? "bg-green-500"
                            : match.score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${match.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted">{match.score}</span>
                  </div>

                  {/* # Role label */}
                  {selectedRole === "all" && (
                    <p className="text-xs text-muted truncate mb-2">
                      {match.role.title}
                    </p>
                  )}

                  {/* # Skills preview */}
                  {match.matchedSkills && (
                    <div className="flex flex-wrap gap-1">
                      {JSON.parse(match.matchedSkills)
                        .slice(0, 3)
                        .map((skill: string) => (
                          <span
                            key={skill}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* # Stage transition buttons */}
                  <div className="flex gap-1 mt-2">
                    {STAGES.filter(
                      (s) =>
                        STAGES.indexOf(s) ===
                        STAGES.findIndex((st) => st.key === match.status) + 1,
                    ).map((nextStage) => (
                      <button
                        key={nextStage.key}
                        onClick={() =>
                          updateStatus(match.id, match.role.id, nextStage.key)
                        }
                        className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 transition-colors"
                      >
                        Move to {nextStage.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* # Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-card border border-card-border">
          <p className="text-xs text-muted">Total Candidates</p>
          <p className="text-2xl font-bold text-foreground">{matches.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-card-border">
          <p className="text-xs text-muted">Active Roles</p>
          <p className="text-2xl font-bold text-foreground">{roles.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-card-border">
          <p className="text-xs text-muted">Avg Score</p>
          <p className="text-2xl font-bold text-foreground">
            {matches.length > 0
              ? Math.round(
                  matches.reduce((sum, m) => sum + m.score, 0) / matches.length,
                )
              : 0}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-card-border">
          <p className="text-xs text-muted">Responded</p>
          <p className="text-2xl font-bold text-green-400">
            {matches.filter((m) =>
              ["responded", "interviewing", "offered", "hired"].includes(m.status),
            ).length}
          </p>
        </div>
      </div>
    </div>
  );
}
