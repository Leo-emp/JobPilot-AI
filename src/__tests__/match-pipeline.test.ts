/* ============================================================
   MATCH PIPELINE — Unit tests
   ============================================================
   Tests status labels, visibility rules, and pipeline columns.
   ============================================================ */

import { describe, it, expect } from "vitest";
import {
  MATCH_STATUSES,
  CANDIDATE_STATUS_LABELS,
  STATUS_COLORS,
  isCandidateVisible,
  PIPELINE_COLUMNS,
} from "@/lib/match-pipeline";
import type { MatchStatus } from "@/lib/match-pipeline";

describe("MATCH_STATUSES", () => {
  it("defines all expected statuses", () => {
    expect(MATCH_STATUSES).toContain("new");
    expect(MATCH_STATUSES).toContain("shortlisted");
    expect(MATCH_STATUSES).toContain("rejected");
    expect(MATCH_STATUSES).toContain("contacted");
    expect(MATCH_STATUSES).toContain("hired");
    expect(MATCH_STATUSES).toContain("withdrawn");
  });

  it("has 6 statuses total", () => {
    expect(MATCH_STATUSES).toHaveLength(6);
  });
});

describe("CANDIDATE_STATUS_LABELS", () => {
  it("has a label for every status", () => {
    for (const status of MATCH_STATUSES) {
      expect(CANDIDATE_STATUS_LABELS[status]).toBeDefined();
      expect(typeof CANDIDATE_STATUS_LABELS[status]).toBe("string");
    }
  });

  it("maps 'rejected' to a friendly label", () => {
    expect(CANDIDATE_STATUS_LABELS.rejected).toBe("Not Selected");
  });

  it("maps 'contacted' to employer-interested", () => {
    expect(CANDIDATE_STATUS_LABELS.contacted).toBe("Employer Interested");
  });
});

describe("STATUS_COLORS", () => {
  it("has colors for every status", () => {
    for (const status of MATCH_STATUSES) {
      expect(STATUS_COLORS[status]).toBeDefined();
      expect(STATUS_COLORS[status].bg).toBeDefined();
      expect(STATUS_COLORS[status].text).toBeDefined();
    }
  });
});

describe("isCandidateVisible", () => {
  it("shows 'new' matches to candidates", () => {
    expect(isCandidateVisible("new")).toBe(true);
  });

  it("shows 'shortlisted' to candidates", () => {
    expect(isCandidateVisible("shortlisted")).toBe(true);
  });

  it("hides 'rejected' from candidates", () => {
    expect(isCandidateVisible("rejected")).toBe(false);
  });

  it("shows 'contacted' to candidates", () => {
    expect(isCandidateVisible("contacted")).toBe(true);
  });

  it("shows 'hired' to candidates", () => {
    expect(isCandidateVisible("hired")).toBe(true);
  });

  it("shows 'withdrawn' to candidates", () => {
    expect(isCandidateVisible("withdrawn")).toBe(true);
  });
});

describe("PIPELINE_COLUMNS", () => {
  it("has 5 columns for employer Kanban", () => {
    expect(PIPELINE_COLUMNS).toHaveLength(5);
  });

  it("starts with 'new' and ends with 'rejected'", () => {
    expect(PIPELINE_COLUMNS[0].key).toBe("new");
    expect(PIPELINE_COLUMNS[PIPELINE_COLUMNS.length - 1].key).toBe("rejected");
  });

  it("each column has a key and label", () => {
    for (const col of PIPELINE_COLUMNS) {
      expect(col.key).toBeDefined();
      expect(col.label).toBeDefined();
      expect(typeof col.label).toBe("string");
    }
  });
});
