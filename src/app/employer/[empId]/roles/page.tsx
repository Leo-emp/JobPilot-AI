/* ============================================================
   EMPLOYER ROLES — List and create job postings
   ============================================================
   Shows all roles with status filter. Admin+ can create new
   roles and manage existing ones.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Role {
  id: string;
  title: string;
  status: string;
  locationType: string;
  location: string | null;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  urgency: string;
  createdAt: string;
  publishedAt: string | null;
}

export default function EmployerRolesPage() {
  const params = useParams();
  const router = useRouter();
  const empId = params.empId as string;
  const [roles, setRoles] = useState<Role[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [empRole, setEmpRole] = useState("");

  /* # Create role form */
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationType, setLocationType] = useState("remote");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/employer/${empId}`).then((r) => r.json()).then((d) => setEmpRole(d.role || ""));
    fetchRoles();
  }, [empId]);

  function fetchRoles() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set("status", filter);
    fetch(`/api/employer/${empId}/roles?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setRoles(data.roles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    fetchRoles();
  }, [filter]);

  const isAdmin = empRole === "admin" || empRole === "owner";

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");

    const res = await fetch(`/api/employer/${empId}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, locationType }),
    });
    const data = await res.json();

    if (res.ok) {
      router.push(`/employer/${empId}/roles/${data.role.id}`);
    } else {
      setError(data.error || "Failed to create role.");
      setCreating(false);
    }
  }

  /* # Format salary range */
  function formatSalary(min: number | null, max: number | null, currency: string) {
    if (!min && !max) return null;
    const fmt = (n: number) => `${currency} ${(n / 1000).toFixed(0)}k`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Roles</h1>
          <p className="text-gray-400 mt-1">{roles.length} total</p>
        </div>
        {isAdmin && !showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 transition-colors"
          >
            New Role
          </button>
        )}
      </div>

      {/* # Create role form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="p-6 bg-space-800 border border-card-border rounded-xl mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Create New Role</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="Senior Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Location Type</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="bg-space-700 border border-card-border rounded-lg px-3 py-2.5 text-white"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 disabled:opacity-50 transition-colors"
              >
                {creating ? "Creating..." : "Create as Draft"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2.5 text-gray-400 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* # Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["", "active", "draft", "paused", "filled", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${
              filter === s
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "text-gray-400 hover:text-white hover:bg-space-700"
            }`}
          >
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* # Roles list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-space-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <p className="text-gray-400 py-10 text-center">No roles found.</p>
      ) : (
        <div className="space-y-3">
          {roles.map((r) => (
            <Link
              key={r.id}
              href={`/employer/${empId}/roles/${r.id}`}
              className="block p-5 bg-space-800 border border-card-border rounded-xl hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{r.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                    <span className="capitalize">{r.locationType}</span>
                    {r.location && <span>· {r.location}</span>}
                    <span className="capitalize">· {r.employmentType}</span>
                    {formatSalary(r.salaryMin, r.salaryMax, r.salaryCurrency) && (
                      <span>· {formatSalary(r.salaryMin, r.salaryMax, r.salaryCurrency)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {r.urgency !== "normal" && (
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full capitalize">
                      {r.urgency}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[r.status] || ""}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
