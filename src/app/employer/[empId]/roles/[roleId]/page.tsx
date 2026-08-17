/* ============================================================
   ROLE DETAIL — View/edit a single job role
   ============================================================
   Shows full role details. Admin+ can edit, publish, pause,
   or cancel the role.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface RoleDetail {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  skills: string | null;
  niceToHaveSkills: string | null;
  experienceMin: number | null;
  experienceMax: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  locationType: string;
  location: string | null;
  employmentType: string;
  industry: string | null;
  education: string | null;
  urgency: string;
  candidatesNeeded: number;
  status: string;
  publishedAt: string | null;
  filledAt: string | null;
  createdAt: string;
}

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const empId = params.empId as string;
  const roleId = params.roleId as string;
  const [role, setRole] = useState<RoleDetail | null>(null);
  const [empRole, setEmpRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/employer/${empId}`).then((r) => r.json()),
      fetch(`/api/employer/${empId}/roles/${roleId}`).then((r) => r.json()),
    ])
      .then(([empData, roleData]) => {
        setEmpRole(empData.role || "");
        setRole(roleData.role || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [empId, roleId]);

  const isAdmin = empRole === "admin" || empRole === "owner";

  /* # Status change handler */
  async function updateStatus(newStatus: string) {
    if (!confirm(`Change status to "${newStatus}"?`)) return;
    setUpdating(true);

    const res = await fetch(`/api/employer/${empId}/roles/${roleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      const data = await res.json();
      setRole(data.role);
    }
    setUpdating(false);
  }

  /* # Delete handler */
  async function handleDelete() {
    if (!confirm("Cancel this role? This cannot be undone.")) return;
    setUpdating(true);

    const res = await fetch(`/api/employer/${empId}/roles/${roleId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push(`/employer/${empId}/roles`);
    }
    setUpdating(false);
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
        <div className="h-5 w-96 bg-space-700 rounded-lg mb-10" />
        <div className="h-48 bg-space-700 rounded-xl" />
      </div>
    );
  }

  if (!role) {
    return <p className="text-gray-400 py-10 text-center">Role not found.</p>;
  }

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-300",
    draft: "bg-gray-500/20 text-gray-400",
    paused: "bg-amber-500/20 text-amber-300",
    filled: "bg-blue-500/20 text-blue-300",
    cancelled: "bg-red-500/20 text-red-300",
  };

  return (
    <div>
      {/* # Back link */}
      <button
        onClick={() => router.back()}
        className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Roles
      </button>

      {/* # Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{role.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[role.status] || ""}`}>
              {role.status}
            </span>
            <span className="text-sm text-gray-400 capitalize">{role.locationType}</span>
            {role.location && <span className="text-sm text-gray-400">· {role.location}</span>}
            <span className="text-sm text-gray-400 capitalize">· {role.employmentType}</span>
          </div>
        </div>

        {/* # Admin actions */}
        {isAdmin && (
          <div className="flex gap-2">
            {role.status === "draft" && (
              <button
                onClick={() => updateStatus("active")}
                disabled={updating}
                className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors"
              >
                Publish
              </button>
            )}
            {role.status === "active" && (
              <button
                onClick={() => updateStatus("paused")}
                disabled={updating}
                className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-500 disabled:opacity-50 transition-colors"
              >
                Pause
              </button>
            )}
            {role.status === "paused" && (
              <button
                onClick={() => updateStatus("active")}
                disabled={updating}
                className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors"
              >
                Resume
              </button>
            )}
            {(role.status === "active" || role.status === "paused") && (
              <button
                onClick={() => updateStatus("filled")}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                Mark Filled
              </button>
            )}
            {role.status !== "cancelled" && (
              <button
                onClick={handleDelete}
                disabled={updating}
                className="px-4 py-2 bg-red-600/20 text-red-400 text-sm rounded-lg hover:bg-red-600/30 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {/* # Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* # Description */}
        <div className="p-6 bg-space-800 border border-card-border rounded-xl md:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
          <p className="text-gray-300 whitespace-pre-line">{role.description}</p>
        </div>

        {/* # Requirements */}
        {role.requirements && (
          <div className="p-6 bg-space-800 border border-card-border rounded-xl md:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-3">Requirements</h2>
            <p className="text-gray-300 whitespace-pre-line">{role.requirements}</p>
          </div>
        )}

        {/* # Compensation */}
        <div className="p-6 bg-space-800 border border-card-border rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-3">Compensation</h2>
          <div className="space-y-2 text-sm">
            {(role.salaryMin || role.salaryMax) ? (
              <div className="flex justify-between">
                <span className="text-gray-400">Salary Range</span>
                <span className="text-white">
                  {role.salaryCurrency} {role.salaryMin?.toLocaleString()} - {role.salaryMax?.toLocaleString()}
                </span>
              </div>
            ) : (
              <p className="text-gray-500">No salary specified</p>
            )}
          </div>
        </div>

        {/* # Details */}
        <div className="p-6 bg-space-800 border border-card-border rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-3">Details</h2>
          <div className="space-y-2 text-sm">
            {role.experienceMin != null && (
              <div className="flex justify-between">
                <span className="text-gray-400">Experience</span>
                <span className="text-white">{role.experienceMin} - {role.experienceMax} years</span>
              </div>
            )}
            {role.education && (
              <div className="flex justify-between">
                <span className="text-gray-400">Education</span>
                <span className="text-white">{role.education}</span>
              </div>
            )}
            {role.industry && (
              <div className="flex justify-between">
                <span className="text-gray-400">Industry</span>
                <span className="text-white">{role.industry}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Urgency</span>
              <span className="text-white capitalize">{role.urgency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Candidates Needed</span>
              <span className="text-white">{role.candidatesNeeded}</span>
            </div>
          </div>
        </div>
      </div>

      {/* # View Candidates CTA — only for active/paused roles */}
      {(role.status === "active" || role.status === "paused") && (
        <Link
          href={`/employer/${empId}/roles/${roleId}/candidates`}
          className="block p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl mb-8 hover:border-purple-500/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">View Matched Candidates</h2>
              <p className="text-sm text-gray-400 mt-1">
                See candidates ranked by AI matching score against this role's requirements
              </p>
            </div>
            <svg className="w-6 h-6 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      )}

      {/* # Timeline */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl">
        <h2 className="text-lg font-semibold text-white mb-3">Timeline</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Created</span>
            <span className="text-white">{new Date(role.createdAt).toLocaleDateString()}</span>
          </div>
          {role.publishedAt && (
            <div className="flex justify-between">
              <span className="text-gray-400">Published</span>
              <span className="text-white">{new Date(role.publishedAt).toLocaleDateString()}</span>
            </div>
          )}
          {role.filledAt && (
            <div className="flex justify-between">
              <span className="text-gray-400">Filled</span>
              <span className="text-white">{new Date(role.filledAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
