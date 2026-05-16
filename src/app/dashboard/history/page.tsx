/* ============================================================
   AI HISTORY PAGE - Browse past AI results
   ============================================================
   Shows all saved AI results with filtering by action type.
   Click any item to view the full result. Delete unwanted items.
   ============================================================ */

"use client";

import { useState, useEffect, useCallback } from "react";
import MarkdownResult from "@/components/MarkdownResult";

interface HistoryItem {
  id: string;
  action: string;
  title: string;
  createdAt: string;
}

interface FullResult extends HistoryItem {
  result: string;
}

const ACTION_LABELS: Record<string, string> = {
  analyze_resume: "Resume Analysis",
  optimize_resume: "Resume Optimize",
  rebuild_resume: "Resume Rebuild",
  career_pivot: "Career Pivot",
  match_score: "Match Score",
  cover_letter: "Cover Letter",
  interview_questions: "Interview Questions",
  interview_answer: "Interview Answer",
  linkedin_audit: "LinkedIn Audit",
  linkedin_rewrite: "LinkedIn Rewrite",
  craft_outreach: "Outreach Message",
  mock_interview_respond: "Mock Interview",
  mock_interview_summary: "Interview Summary",
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fullResult, setFullResult] = useState<FullResult | null>(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      const url = filter ? `/api/ai-history?action=${filter}&limit=50` : "/api/ai-history?limit=50";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data.data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const viewResult = async (id: string) => {
    setSelectedId(id);
    setResultLoading(true);
    try {
      const res = await fetch(`/api/ai-history/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFullResult(data);
      }
    } catch {
    } finally {
      setResultLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/ai-history/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setFullResult(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const uniqueActions = [...new Set(items.map((i) => i.action))];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold mb-2">
        AI History
      </h1>
      <p className="text-text-secondary mb-8">
        All your past AI-generated results in one place.
      </p>

      {/* Filter by action type */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !filter ? "bg-brand-indigo text-white" : "bg-space-600 text-text-secondary hover:text-white"
          }`}
        >
          All
        </button>
        {uniqueActions.map((a) => (
          <button
            key={a}
            onClick={() => setFilter(a)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === a ? "bg-brand-indigo text-white" : "bg-space-600 text-text-secondary hover:text-white"
            }`}
          >
            {ACTION_LABELS[a] || a}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">Loading history...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted mb-2">No AI results yet.</p>
          <p className="text-sm text-text-muted">
            Use any AI tool and your results will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Item list */}
          <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => viewResult(item.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selectedId === item.id
                    ? "border-brand-indigo/50 bg-brand-indigo/10"
                    : "border-card-border bg-space-700/50 hover:border-brand-indigo/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {ACTION_LABELS[item.action] || item.action} &middot; {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                    className="text-text-muted hover:text-red-400 text-xs flex-shrink-0 px-1"
                    aria-label="Delete"
                  >
                    ✕
                  </button>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Full result display */}
          <div className="lg:col-span-2">
            {resultLoading ? (
              <div className="text-center py-12 text-text-muted">Loading result...</div>
            ) : fullResult ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-white">{fullResult.title}</h2>
                  <p className="text-sm text-text-muted">
                    {ACTION_LABELS[fullResult.action] || fullResult.action} &middot; {formatDate(fullResult.createdAt)}
                  </p>
                </div>
                <MarkdownResult result={fullResult.result} showDownload={true} />
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted">
                Select an item to view the full result.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
