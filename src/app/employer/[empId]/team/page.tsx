/* ============================================================
   EMPLOYER TEAM — Manage team members
   ============================================================
   List team members, add new ones by email, remove existing.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface TeamMember {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function EmployerTeamPage() {
  const params = useParams();
  const empId = params.empId as string;
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [empRole, setEmpRole] = useState("");

  /* # Add member form */
  const [email, setEmail] = useState("");
  const [addRole, setAddRole] = useState("recruiter");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/employer/${empId}`).then((r) => r.json()).then((d) => setEmpRole(d.role || ""));
    fetchMembers();
  }, [empId]);

  function fetchMembers() {
    setLoading(true);
    fetch(`/api/employer/${empId}/members`)
      .then((r) => r.json())
      .then((data) => {
        setMembers(data.members || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  const isAdmin = empRole === "admin" || empRole === "owner";

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setMessage(null);

    const res = await fetch(`/api/employer/${empId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role: addRole }),
    });
    const data = await res.json();

    if (res.ok) {
      setMessage({ type: "success", text: "Team member added." });
      setEmail("");
      fetchMembers();
    } else {
      setMessage({ type: "error", text: data.error || "Failed to add member." });
    }
    setAdding(false);
  }

  async function handleRemove(userId: string, name: string) {
    if (!confirm(`Remove ${name || "this member"} from the team?`)) return;

    const res = await fetch(`/api/employer/${empId}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.user.id !== userId));
    }
  }

  const roleColors: Record<string, string> = {
    owner: "bg-purple-500/20 text-purple-300",
    admin: "bg-indigo-500/20 text-indigo-300",
    recruiter: "bg-gray-500/20 text-gray-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Team Members</h1>
      <p className="text-gray-400 mb-8">{members.length} members</p>

      {/* # Add member form — admin+ only */}
      {isAdmin && (
        <form onSubmit={handleAdd} className="p-6 bg-space-800 border border-card-border rounded-xl mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Add Team Member</h2>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="colleague@company.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <select
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
                className="bg-space-700 border border-card-border rounded-lg px-3 py-2.5 text-white"
              >
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 disabled:opacity-50 transition-colors"
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
          {message && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {message.text}
            </div>
          )}
        </form>
      )}

      {/* # Members list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-space-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-4 bg-space-800 border border-card-border rounded-xl">
              <div>
                <p className="font-medium text-white">{m.user.name || "Unnamed"}</p>
                <p className="text-sm text-gray-500">{m.user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${roleColors[m.role] || ""}`}>
                  {m.role}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(m.joinedAt).toLocaleDateString()}
                </span>
                {isAdmin && m.role !== "owner" && (
                  <button
                    onClick={() => handleRemove(m.user.id, m.user.name || "")}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors ml-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
