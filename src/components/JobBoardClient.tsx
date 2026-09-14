/* ============================================================
   JOB BOARD CLIENT — Interactive job listing with search/filter
   ============================================================
   Client component for the public job board. Handles search,
   filters, pagination, and rendering the role cards.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Employer {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  industry: string | null;
  size: string | null;
  verifiedAt: string | null;
}

interface PublicRole {
  id: string;
  title: string;
  description: string;
  locationType: string;
  location: string | null;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  skills: string | null;
  industry: string | null;
  urgency: string;
  publishedAt: string;
  employer: Employer;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function JobBoardClient() {
  const [roles, setRoles] = useState<PublicRole[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  /* # Filter state */
  const [search, setSearch] = useState("");
  const [locationType, setLocationType] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  useEffect(() => {
    fetchRoles(1);
  }, [search, locationType, employmentType]);

  function fetchRoles(page: number) {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (search) params.set("search", search);
    if (locationType) params.set("locationType", locationType);
    if (employmentType) params.set("employmentType", employmentType);

    fetch(`/api/roles?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setRoles(data.roles || []);
        setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  /* # Debounced search */
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);
  function handleSearch(val: string) {
    setSearch(val);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => fetchRoles(1), 300));
  }

  /* # Format salary for display */
  function formatSalary(min: number | null, max: number | null, currency: string) {
    if (!min && !max) return null;
    const fmt = (n: number) => `${currency} ${(n / 1000).toFixed(0)}k`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  }

  /* # Time ago for published date */
  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  return (
    <div>
      {/* # Search + filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Search roles, skills, companies..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 min-w-[250px] bg-space-800 border border-card-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
        />
        <select
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
          className="bg-space-800 border border-card-border rounded-xl px-4 py-3 text-white"
        >
          <option value="">All Locations</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </select>
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="bg-space-800 border border-card-border rounded-xl px-4 py-3 text-white"
        >
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      {/* # Results count */}
      <p className="text-sm text-gray-400 mb-4">
        {pagination.total} {pagination.total === 1 ? "role" : "roles"} found
      </p>

      {/* # Role cards */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-space-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-2">No roles found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={`/jobs/${role.id}`}
              className="block p-6 bg-space-800 border border-card-border rounded-xl hover:border-indigo-500/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {role.title}
                    </h3>
                    {role.urgency !== "normal" && (
                      <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full capitalize">
                        {role.urgency}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-indigo-400">{role.employer.name}</span>
                    {role.employer.verifiedAt && (
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                    <span className="bg-space-700 px-2 py-1 rounded capitalize">{role.locationType}</span>
                    {role.location && <span className="bg-space-700 px-2 py-1 rounded">{role.location}</span>}
                    <span className="bg-space-700 px-2 py-1 rounded capitalize">{role.employmentType}</span>
                    {role.industry && <span className="bg-space-700 px-2 py-1 rounded">{role.industry}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {formatSalary(role.salaryMin, role.salaryMax, role.salaryCurrency) && (
                    <p className="text-sm font-medium text-white mb-1">
                      {formatSalary(role.salaryMin, role.salaryMax, role.salaryCurrency)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{timeAgo(role.publishedAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* # Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => fetchRoles(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchRoles(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
