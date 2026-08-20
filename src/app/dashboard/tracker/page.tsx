/* ============================================================
   APPLICATION TRACKER PAGE
   ============================================================
   Kanban-style tracker for job applications.
   Users can add applications, update their status, and add notes.
   Data is stored in the database via API routes.
   ============================================================ */

"use client";

import { useState, useEffect, useCallback } from "react";
import { trackEvent } from "@/lib/track-event";

/* ---- Status options with colors ---- */
const STATUSES = [
  { value: "Saved", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "Applied", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
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
  interviewDate: string | null;
  createdAt: string;
  job?: { url: string | null; description: string | null; salary: string | null } | null;
}

export default function TrackerPage() {
  /* Application list from database */
  const [apps, setApps] = useState<Application[]>([]);
  /* New application form */
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---- Fetch Applications ---- */
  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.data) setApps(data.data);
      }
    } catch {
      trackEvent("tracker.load_apps_failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setApps(data.data);
        }
      } catch { trackEvent("tracker.load_apps_failed"); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ---- Add New Application ---- */
  const handleAdd = async () => {
    if (!newTitle || !newCompany) return;

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: newTitle,
          company: newCompany,
          ...(newSalary && { salary: newSalary }),
          ...(newDescription && { description: newDescription }),
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewCompany("");
        setNewSalary("");
        setNewDescription("");
        setShowForm(false);
        fetchApps();
      }
    } catch {
      /* Handle error silently */
    }
  };

  /* ---- Expanded description state ---- */
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ---- Interview date picker state ---- */
  const [interviewPrompt, setInterviewPrompt] = useState<string | null>(null);
  const [interviewDateInput, setInterviewDateInput] = useState("");

  /* ---- Update Status ---- */
  const handleStatusChange = async (id: string, status: string) => {
    /* When changing to Interview, prompt for the date */
    if (status === "Interview") {
      setInterviewPrompt(id);
      setInterviewDateInput("");
      return;
    }

    try {
      await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchApps();
    } catch {
      trackEvent("tracker.status_update_failed", { status });
    }
  };

  /* ---- Confirm Interview with date ---- */
  const handleConfirmInterview = async () => {
    if (!interviewPrompt) return;
    try {
      await fetch(`/api/applications/${interviewPrompt}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Interview",
          ...(interviewDateInput && { interviewDate: new Date(interviewDateInput).toISOString() }),
        }),
      });
      setInterviewPrompt(null);
      setInterviewDateInput("");
      fetchApps();
    } catch {
      trackEvent("tracker.interview_confirm_failed");
    }
  };

  /* ---- Delete Application ---- */
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/applications/${id}`, { method: "DELETE" });
      fetchApps();
    } catch {
      trackEvent("tracker.delete_failed");
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
              placeholder="Job Title *"
              className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
            />
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="Company Name *"
              className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
            />
            <input
              type="text"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
              placeholder="Salary (e.g. $80k - $120k)"
              className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm sm:col-span-2"
            />
          </div>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Paste job description here (optional)"
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm mb-4 resize-y"
          />
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
          <div className="flex justify-center mb-4"><svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg></div>
          <p className="text-text-secondary">No applications yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{app.jobTitle}</h3>
                  <p className="text-sm text-text-secondary">{app.company}</p>
                  {app.job?.salary && (
                    <p className="text-xs text-green-400 mt-0.5">{app.job.salary}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    {app.appliedDate && (
                      <span className="text-xs text-text-muted">
                        Applied {new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                    {app.interviewDate && (
                      <span className="text-xs text-yellow-400 font-medium">
                        Interview {new Date(app.interviewDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </span>
                    )}
                    {app.job?.url && (
                      <a
                        href={app.job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-light hover:text-white transition-colors"
                      >
                        View posting →
                      </a>
                    )}
                    {app.job?.description && (
                      <button
                        onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                        className="text-xs text-brand-light hover:text-white transition-colors"
                      >
                        {expandedId === app.id ? "Hide description" : "Show description"}
                      </button>
                    )}
                  </div>
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

              {/* Expandable job description */}
              {expandedId === app.id && app.job?.description && (
                <div className="mt-4 pt-4 border-t border-card-border">
                  <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto">
                    {app.job.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---- Interview Date Modal ---- */}
      {interviewPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setInterviewPrompt(null)}
          />
          <div className="relative w-full max-w-sm bg-space-800 border border-card-border rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Schedule Interview</h3>
            <p className="text-text-secondary text-sm mb-4">
              When is the interview? You can skip this and add it later.
            </p>
            <input
              type="datetime-local"
              value={interviewDateInput}
              onChange={(e) => setInterviewDateInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:outline-none focus:border-brand-indigo text-sm mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleConfirmInterview}
                className="flex-1 btn-primary text-sm"
              >
                {interviewDateInput ? "Confirm Interview" : "Mark as Interview"}
              </button>
              <button
                onClick={() => setInterviewPrompt(null)}
                className="px-4 py-2.5 text-sm text-text-secondary border border-card-border rounded-xl hover:bg-space-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
