/* ============================================================
   MATCH PIPELINE — Status management for candidate matches
   ============================================================
   Defines the pipeline stages for candidate-role matches.
   Maps internal employer statuses to candidate-facing labels
   so candidates see friendly descriptions, not internal jargon.
   ============================================================ */

/* # All valid match statuses */
export const MATCH_STATUSES = [
  "new",         // # Just matched, no employer action yet
  "shortlisted", // # Employer marked as interesting
  "rejected",    // # Employer decided not to proceed
  "contacted",   // # Employer reached out to candidate
  "hired",       // # Position filled by this candidate
  "withdrawn",   // # Candidate withdrew from consideration
] as const;

export type MatchStatus = typeof MATCH_STATUSES[number];

/* # Pipeline visibility mapping — what candidates see for each internal status */
export const CANDIDATE_STATUS_LABELS: Record<MatchStatus, string> = {
  new: "Matched",
  shortlisted: "Under Review",
  rejected: "Not Selected",
  contacted: "Employer Interested",
  hired: "Selected",
  withdrawn: "Withdrawn",
};

/* # Colors for each status in the UI */
export const STATUS_COLORS: Record<MatchStatus, { bg: string; text: string }> = {
  new: { bg: "bg-blue-500/15", text: "text-blue-300" },
  shortlisted: { bg: "bg-amber-500/15", text: "text-amber-300" },
  rejected: { bg: "bg-gray-500/15", text: "text-gray-400" },
  contacted: { bg: "bg-purple-500/15", text: "text-purple-300" },
  hired: { bg: "bg-emerald-500/15", text: "text-emerald-300" },
  withdrawn: { bg: "bg-red-500/15", text: "text-red-300" },
};

/* # Statuses that should be visible to candidates */
const CANDIDATE_VISIBLE_STATUSES: MatchStatus[] = [
  "new",
  "shortlisted",
  "contacted",
  "hired",
  "withdrawn",
];

/* # Check if a status is visible to the candidate */
export function isCandidateVisible(status: MatchStatus): boolean {
  return CANDIDATE_VISIBLE_STATUSES.includes(status);
}

/* # Kanban columns for employer pipeline view */
export const PIPELINE_COLUMNS: { key: MatchStatus; label: string }[] = [
  { key: "new", label: "New Matches" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "contacted", label: "Contacted" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
];
