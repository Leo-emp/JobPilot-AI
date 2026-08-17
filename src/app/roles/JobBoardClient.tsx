/* ============================================================
   JOB BOARD CLIENT — Interactive role browser
   ============================================================
   Client component with search, filters, pagination.
   Fetches from /api/roles publicly.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Role {
  id: string;
  title: string;
  locationType: string;
  location: string | null;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  skills: string | null;
  industry: string | null;
  urgency: string;
  publishedAt: string | null;
  employer: {
    name: string;
    slug: string;
    logoUrl: string | null;
    industry: string | null;
    size: string | null;
  };
}

export default function JobBoardClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationType, setLocationType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        if (search) params.set("search", search);
        if (locationType) params.set("locationType", locationType);

        const res = await fetch(`/api/roles?${params}`);
        const data = await res.json();
        setRoles(data.roles ?? []);
        setTotalPages(data.pagination?.pages ?? 1);
      } catch (err) {
        console.error("Failed to load roles:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, search, locationType]);

  /* # Format salary range */
  function formatSalary(min: number | null, max: number | null, currency: string) {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  }

  /* # Parse skills JSON */
  function parseSkills(skills: string | null): string[] {
    if (!skills) return [];
    try { return JSON.parse(skills); } catch { return []; }
  }

  return (
    <div className="min-h-screen bg-space-900">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* # Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Job Board
          </h1>
          <p className="text-lg text-gray-400">
            Browse roles from verified employers, matched by AI.
          </p>
        </div>

        {/* # Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search roles, skills, or companies..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 px-4 py-3 rounded-xl bg-card border border-card-border text-foreground placeholder:text-muted focus:outline-none focus:border-indigo-500/50"
          />
          <select
            value={locationType}
            onChange={(e) => { setLocationType(e.target.value); setPage(1); }}
            className="px-4 py-3 rounded-xl bg-card border border-card-border text-foreground"
          >
            <option value="">All Locations</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>

        {/* # Results */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-card border border-card-border animate-pulse" />
            ))}
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="text-lg">No roles found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {roles.map((role) => (
              <Link
                key={role.id}
                href={`/roles/${role.id}`}
                className="block p-5 rounded-xl bg-card border border-card-border hover:border-indigo-500/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* # Title + company */}
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-indigo-300 transition-colors">
                      {role.title}
                    </h2>
                    <p className="text-sm text-muted mt-0.5">
                      {role.employer.name}
                      {role.employer.industry && ` · ${role.employer.industry}`}
                    </p>

                    {/* # Tags row */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-300">
                        {role.locationType}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-300">
                        {role.employmentType}
                      </span>
                      {role.urgency === "urgent" && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-300">
                          Urgent
                        </span>
                      )}
                      {parseSkills(role.skills).slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-1 rounded-lg bg-card-border/50 text-muted"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* # Salary */}
                  {formatSalary(role.salaryMin, role.salaryMax, role.salaryCurrency) && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-green-400">
                        {formatSalary(role.salaryMin, role.salaryMax, role.salaryCurrency)}
                      </p>
                      <p className="text-xs text-muted">/year</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* # Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-card border border-card-border text-sm text-foreground hover:bg-card-border/50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-muted">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-card border border-card-border text-sm text-foreground hover:bg-card-border/50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
