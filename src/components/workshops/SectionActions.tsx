/* ============================================================
   SECTION ACTIONS — Complete / Bookmark / Notes
   ============================================================
   # Client component for interactive section actions.
   # - Mark section as complete (toggleable)
   # - Bookmark for later reference
   # - Personal notes (saved to DB)
   # All actions call /api/workshops/progress endpoint.
   ============================================================ */

"use client";

import { useState, useCallback } from "react";

interface SectionActionsProps {
  sectionId: string;
  completed: boolean;
  bookmarked: boolean;
  notes: string;
  color: string;
}

export default function SectionActions({
  sectionId,
  completed: initialCompleted,
  bookmarked: initialBookmarked,
  notes: initialNotes,
  color,
}: SectionActionsProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [notes, setNotes] = useState(initialNotes);
  const [showNotes, setShowNotes] = useState(false);
  const [saving, setSaving] = useState(false);

  /* # Save progress to the API */
  const saveProgress = useCallback(
    async (data: Record<string, unknown>) => {
      setSaving(true);
      try {
        await fetch("/api/workshops/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId, ...data }),
        });
      } catch {
        /* # Silently handle — user sees local state change */
      } finally {
        setSaving(false);
      }
    },
    [sectionId]
  );

  /* # Toggle completion */
  const toggleComplete = useCallback(() => {
    const newVal = !completed;
    setCompleted(newVal);
    saveProgress({ completed: newVal, completedAt: newVal ? new Date().toISOString() : null });
  }, [completed, saveProgress]);

  /* # Toggle bookmark */
  const toggleBookmark = useCallback(() => {
    const newVal = !bookmarked;
    setBookmarked(newVal);
    saveProgress({ bookmarked: newVal });
  }, [bookmarked, saveProgress]);

  /* # Save notes (debounced via blur) */
  const saveNotes = useCallback(() => {
    saveProgress({ notes });
  }, [notes, saveProgress]);

  return (
    <div className="space-y-4">
      {/* # Action buttons row */}
      <div className="flex items-center gap-3">
        {/* # Mark complete button */}
        <button
          onClick={toggleComplete}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            completed
              ? "text-white"
              : "text-text-secondary border border-white/15 hover:border-white/30"
          }`}
          style={completed ? { backgroundColor: color } : undefined}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            {completed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <circle cx="12" cy="12" r="9" />
            )}
          </svg>
          {completed ? "Completed" : "Mark Complete"}
        </button>

        {/* # Bookmark button */}
        <button
          onClick={toggleBookmark}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border border-white/15 hover:border-white/30 transition-colors"
          style={bookmarked ? { color, borderColor: `${color}40` } : { color: "rgba(255,255,255,0.5)" }}
        >
          <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>

        {/* # Notes toggle */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border border-white/15 hover:border-white/30 text-text-muted transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Notes
        </button>
      </div>

      {/* # Notes textarea (expandable) */}
      {showNotes && (
        <div className="glass-card p-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
            placeholder="Add your personal notes for this section..."
            className="w-full bg-transparent text-sm text-text-secondary placeholder:text-text-muted resize-y min-h-[100px] focus:outline-none"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-card-border/50">
            <span className="text-[10px] text-text-muted">Notes auto-save when you click away</span>
            {saving && <span className="text-[10px] text-text-muted">Saving...</span>}
          </div>
        </div>
      )}
    </div>
  );
}
