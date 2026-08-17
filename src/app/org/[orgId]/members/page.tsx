/* ============================================================
   ORG MEMBERS — Member roster with search/filter
   ============================================================
   Shows all org members with their stats. Coaches see metrics,
   admins can change roles and remove members.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Member {
  id: string;
  role: string;
  cohort: string | null;
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    resumes: number;
    applications: number;
    aiResults: number;
  };
}

export default function OrgMembersPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [orgRole, setOrgRole] = useState("");

  /* # Fetch org role first, then members */
  useEffect(() => {
    fetch(`/api/org/${orgId}`)
      .then((r) => r.json())
      .then((data) => setOrgRole(data.role || ""));

    fetchMembers();
  }, [orgId]);

  function fetchMembers(searchQuery?: string) {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);

    fetch(`/api/org/${orgId}/members?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setMembers(data.members || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  /* # Debounced search */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* # Remove member handler */
  async function handleRemove(userId: string, name: string) {
    if (!confirm(`Remove ${name || "this member"} from the organization?`)) return;

    const res = await fetch(`/api/org/${orgId}/members/${userId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.user.id !== userId));
    }
  }

  const isAdmin = orgRole === "admin" || orgRole === "owner";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-gray-400 mt-1">{members.length} total members</p>
        </div>
        {isAdmin && (
          <Link
            href={`/org/${orgId}/invites`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Invite
          </Link>
        )}
      </div>

      {/* # Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
        />
      </div>

      {/* # Members table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-space-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <p className="text-gray-400 py-10 text-center">No members found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-card-border">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Resumes</th>
                <th className="pb-3 font-medium">Apps</th>
                <th className="pb-3 font-medium">AI Calls</th>
                <th className="pb-3 font-medium">Joined</th>
                {isAdmin && <th className="pb-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-space-700/50 transition-colors">
                  <td className="py-3">
                    <Link
                      href={`/org/${orgId}/members/${m.user.id}`}
                      className="text-white hover:text-indigo-300 transition-colors"
                    >
                      {m.user.name || "Unnamed"}
                    </Link>
                    <p className="text-xs text-gray-500">{m.user.email}</p>
                  </td>
                  <td className="py-3">
                    <span className="text-xs bg-space-700 text-gray-300 px-2 py-0.5 rounded-full capitalize">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">{m._count?.resumes ?? 0}</td>
                  <td className="py-3 text-gray-300">{m._count?.applications ?? 0}</td>
                  <td className="py-3 text-gray-300">{m._count?.aiResults ?? 0}</td>
                  <td className="py-3 text-gray-500 text-sm">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td className="py-3">
                      <button
                        onClick={() => handleRemove(m.user.id, m.user.name || "")}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
