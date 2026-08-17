/* ============================================================
   MESSAGING VALIDATION SCHEMAS — Zod schemas for bookmarks,
   messages, and notifications
   ============================================================
   All Phase 5 input validation. Separate file to keep
   the existing validations untouched (additive-only rule).
   ============================================================ */

import { z } from "zod";

/* # Employer bookmarks a candidate */
export const employerBookmarkSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  roleId: z.string().optional(), // # Optional role context
});

/* # Candidate bookmarks an employer or role */
export const candidateBookmarkSchema = z.object({
  employerId: z.string().optional(),
  roleId: z.string().optional(),
}).refine(
  (d) => d.employerId || d.roleId,
  "Must bookmark either a company or a role",
);

/* # Send a message in a thread */
export const sendMessageSchema = z.object({
  threadId: z.string().min(1, "Thread ID is required"),
  content: z.string().trim().min(1, "Message cannot be empty").max(5000, "Message too long (5000 char max)"),
});

/* # Create a new thread (enterprise employers only) */
export const createThreadSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required"),
  roleId: z.string().optional(), // # Optional role scope
});

/* # Mark notifications as read */
export const markReadSchema = z.object({
  notificationIds: z.array(z.string()).min(1).max(100),
});
