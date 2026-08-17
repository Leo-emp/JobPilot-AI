/* ============================================================
   ORG INVITES — Manage invitations (admin+ only)
   ============================================================
   Send bulk invites, view pending/accepted/expired status,
   revoke pending invites. Uses the invite email template.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Invite {
  id: string;
  email: string;
  role: string;
  cohort: string | null;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export default function OrgInvitesPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  /* # Bulk invite form state */
  const [emails, setEmails] = useState("");
  const [inviteRole, setInviteRole] = useState("candidate");
  const [cohort, setCohort] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* # Load existing invites */
  useEffect(() => {
    fetchInvites();
  }, [orgId]);

  function fetchInvites() {
    setLoading(true);
    fetch(`/api/org/${orgId}/invites`)
      .then((r) => r.json())
      .then((data) => {
        setInvites(data.invites || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  /* # Send bulk invites */
  async function handleSendInvites(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    /* # Parse emails — comma or newline separated */
    const emailList = emails
      .split(/[,\n]/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));

    if (emailList.length === 0) {
      setMessage({ type: "error", text: "Please enter at least one valid email." });
      setSending(false);
      return;
    }

    const res = await fetch(`/api/org/${orgId}/invites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emails: emailList,
        role: inviteRole,
        cohort: cohort || undefined,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({
        type: "success",
        text: `${data.sent} invite(s) sent successfully${data.skipped ? `, ${data.skipped} skipped (duplicate)` : ""}.`,
      });
      setEmails("");
      setCohort("");
      fetchInvites();
    } else {
      setMessage({ type: "error", text: data.error || "Failed to send invites." });
    }

    setSending(false);
  }

  /* # Revoke a pending invite */
  async function handleRevoke(inviteId: string) {
    if (!confirm("Revoke this invitation?")) return;

    const res = await fetch(`/api/org/${orgId}/invites?inviteId=${inviteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    }
  }

  /* # Status badge colors */
  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-300",
    accepted: "bg-emerald-500/20 text-emerald-300",
    expired: "bg-gray-500/20 text-gray-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Invitations</h1>
      <p className="text-gray-400 mb-8">Invite new members by email.</p>

      {/* # Invite form */}
      <form onSubmit={handleSendInvites} className="p-6 bg-space-800 border border-card-border rounded-xl mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Send Invites</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email addresses (comma or newline separated)</label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={3}
              placeholder="john@example.com, jane@example.com"
              className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full bg-space-700 border border-card-border rounded-lg px-3 py-2.5 text-white"
              >
                <option value="candidate">Candidate</option>
                <option value="coach">Coach</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cohort (optional)</label>
              <input
                type="text"
                value={cohort}
                onChange={(e) => setCohort(e.target.value)}
                placeholder="e.g., Spring 2026"
                className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {sending ? "Sending..." : "Send Invites"}
          </button>
        </div>
      </form>

      {/* # Invite history */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl">
        <h2 className="text-lg font-semibold text-white mb-4">Invite History</h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-space-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : invites.length === 0 ? (
          <p className="text-gray-400 text-sm">No invites sent yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-card-border">
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Cohort</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Sent</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-space-700/50 transition-colors">
                    <td className="py-3 text-sm text-white">{invite.email}</td>
                    <td className="py-3">
                      <span className="text-xs bg-space-700 text-gray-300 px-2 py-0.5 rounded-full capitalize">
                        {invite.role}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-400">{invite.cohort || "-"}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[invite.status] || ""}`}>
                        {invite.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(invite.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      {invite.status === "pending" && (
                        <button
                          onClick={() => handleRevoke(invite.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
