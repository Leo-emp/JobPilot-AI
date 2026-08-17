/* ============================================================
   EMPLOYER DASHBOARD — Overview for a single employer
   ============================================================
   Shows company profile summary, role stats, team count.
   Quick links to manage roles, team, and settings.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface EmployerProfile {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  size: string | null;
  website: string | null;
  description: string | null;
  location: string | null;
  remoteFriendly: boolean;
  logoUrl: string | null;
  plan: string;
  verifiedAt: string | null;
  createdAt: string;
  _count: { members: number; roles: number };
}

interface RoleSummary {
  id: string;
  title: string;
  status: string;
  locationType: string;
  publishedAt: string | null;
}

export default function EmployerDashboardPage() {
  const params = useParams();
  const empId = params.empId as string;
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [role, setRole] = useState<string>("");
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/employer/${empId}`).then((r) => r.json()),
      fetch(`/api/employer/${empId}/roles`).then((r) => r.json()),
    ])
      .then(([empData, rolesData]) => {
        setEmployer(empData.employer);
        setRole(empData.role);
        setRoles(rolesData.roles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [empId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
        <div className="h-5 w-96 bg-space-700 rounded-lg mb-10" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-space-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!employer) {
    return <p className="text-gray-400 py-10 text-center">Employer not found.</p>;
  }

  /* # Count roles by status */
  const activeRoles = roles.filter((r) => r.status === "active").length;
  const draftRoles = roles.filter((r) => r.status === "draft").length;

  const isAdmin = role === "admin" || role === "owner";

  return (
    <div>
      {/* # Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{employer.name}</h1>
            {employer.verifiedAt && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Verified</span>
            )}
          </div>
          <p className="text-gray-400 mt-1">
            {employer.industry || "No industry"} · {employer.size || "Unknown size"} · {employer.location || "No location"}
          </p>
        </div>
        {isAdmin && (
          <Link
            href={`/employer/${empId}/roles`}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 transition-colors"
          >
            Post a Role
          </Link>
        )}
      </div>

      {/* # Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-space-800 border border-card-border rounded-xl">
          <p className="text-sm text-gray-400">Active Roles</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{activeRoles}</p>
        </div>
        <div className="p-4 bg-space-800 border border-card-border rounded-xl">
          <p className="text-sm text-gray-400">Draft Roles</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{draftRoles}</p>
        </div>
        <div className="p-4 bg-space-800 border border-card-border rounded-xl">
          <p className="text-sm text-gray-400">Team Size</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{employer._count.members}</p>
        </div>
        <div className="p-4 bg-space-800 border border-card-border rounded-xl">
          <p className="text-sm text-gray-400">Total Roles</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{employer._count.roles}</p>
        </div>
      </div>

      {/* # Recent roles */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Roles</h2>
          <Link href={`/employer/${empId}/roles`} className="text-sm text-purple-400 hover:text-purple-300">
            View all
          </Link>
        </div>

        {roles.length === 0 ? (
          <p className="text-gray-400 text-sm">No roles posted yet.</p>
        ) : (
          <div className="space-y-3">
            {roles.slice(0, 5).map((r) => {
              const statusColors: Record<string, string> = {
                active: "bg-emerald-500/20 text-emerald-300",
                draft: "bg-gray-500/20 text-gray-400",
                paused: "bg-amber-500/20 text-amber-300",
                filled: "bg-blue-500/20 text-blue-300",
                cancelled: "bg-red-500/20 text-red-300",
              };
              return (
                <Link
                  key={r.id}
                  href={`/employer/${empId}/roles/${r.id}`}
                  className="flex items-center justify-between py-3 border-b border-card-border last:border-0 hover:bg-space-700/30 px-2 rounded transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{r.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{r.locationType}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[r.status] || ""}`}>
                    {r.status}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* # Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href={`/employer/${empId}/roles`}
          className="p-4 bg-space-800 border border-card-border rounded-xl hover:border-purple-500/50 transition-all"
        >
          <h3 className="font-semibold text-white">Manage Roles</h3>
          <p className="text-sm text-gray-400 mt-1">Create and edit job postings</p>
        </Link>
        <Link
          href={`/employer/${empId}/team`}
          className="p-4 bg-space-800 border border-card-border rounded-xl hover:border-purple-500/50 transition-all"
        >
          <h3 className="font-semibold text-white">Team Members</h3>
          <p className="text-sm text-gray-400 mt-1">{employer._count.members} members</p>
        </Link>
        <Link
          href={`/companies/${employer.slug}`}
          className="p-4 bg-space-800 border border-card-border rounded-xl hover:border-purple-500/50 transition-all"
          target="_blank"
        >
          <h3 className="font-semibold text-white">Public Profile</h3>
          <p className="text-sm text-gray-400 mt-1">View your company page</p>
        </Link>
      </div>
    </div>
  );
}
