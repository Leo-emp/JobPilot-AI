/* ============================================================
   APPLICATION TRACKER PAGE
   ============================================================
   Kanban-style tracker for job applications.
   Users can add applications, update their status, and add notes.
   Data is stored in the database via API routes.
   ============================================================ */

"use client";

import { useState, useEffect, useCallback } from "react";

/* ---- Status options with colors ---- */
const STATUSES = [
  { value: "Saved", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "Applied", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "Interview", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "Offer", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "Rejected", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  notes: string | null;
  appliedDate: string | null;
  createdAt: string;
}

export default function TrackerPage() {
  /* Application list from database */
  const [apps, setApps] = useState<Application[]>([]);
  /* New application form */
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---- Fetch Applications ---- */
  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      }
    } catch {
      /* Silently fail — empty list is fine for now */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  /* ---- Add New Application ---- */
  const handleAdd = async () => {
    if (!newTitle || !newCompany) return;

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: newTitle, company: newCompany }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewCompany("");
        setShowForm(false);
        fetchApps();
      }
    } catch {
      /* Handle error silently */
    }
  };

  /* ---- Update Status ---- */
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchApps();
    } catch {
      /* Handle error silently */
    }
  };

  /* ---- Delete Application ---- */
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/applications/${id}`, { method: "DELETE" });
      fetchApps();
    } catch {
      /* Handle error silently */
    }
  };

  /* Get the status badge styling */
  const getStatusStyle = (status: string) => {
    return STATUSES.find((s) => s.value === status)?.color || STATUSES[0].color;
  };

  return (
    <div>
      {/* ---- Page Header ---- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
            Application Tracker
          </h1>
          <p className="text-text-secondary">
            Track all your job applications in one place.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm"
        >
          + Add Application
        </button>
      </div>

      {/* ---- Add Application Form ---- */}
      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">New Application</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Job Title"
              className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
            />
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="Company Name"
              className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-primary text-sm">
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ---- Stats Bar ---- */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {STATUSES.map((s) => (
          <div key={s.value} className="glass-card p-4 text-center">
            <div className="text-2xl font-bold">
              {apps.filter((a) => a.status === s.value).length}
            </div>
            <div className="text-xs text-text-muted mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ---- Applications List ---- */}
      {loading ? (
        <div className="flex items-center gap-3 text-text-secondary py-8">
          <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading applications...</span>
        </div>
      ) : apps.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-text-secondary">No applications yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="glass-card p-5 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{app.jobTitle}</h3>
                <p className="text-sm text-text-secondary">{app.company}</p>
              </div>

              {/* Status dropdown */}
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusStyle(app.status)} bg-transparent cursor-pointer focus:outline-none`}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value} className="bg-space-800">
                    {s.value}
                  </option>
                ))}
              </select>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(app.id)}
                className="text-text-muted hover:text-red-400 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
