/* ============================================================
   ZOD VALIDATION SCHEMAS - Input validation for all API routes
   ============================================================
   Centralized schemas enforce strict input validation at every
   API boundary. Each schema defines exact field types, lengths,
   and allowed values — rejecting anything unexpected.
   ============================================================ */

import { z } from "zod";

/* ---- Reusable field definitions ---- */
/* These are common patterns used across multiple schemas */

/* Email: must be valid format, max 254 chars (RFC 5321), trimmed + lowercased */
const email = z.string().trim().lowercase().email("Invalid email address.").max(254);

/* Password: 8-128 chars — short enough to validate, long enough for passphrase */
const password = z.string().min(8, "Password must be at least 8 characters.").max(128, "Password is too long.");

/* Short text: for names, titles, labels (max 200 chars) */
const shortText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`).max(200, `${label} is too long.`);

/* Optional short text: same as above but can be empty/null/undefined */
const optionalShortText = z.string().trim().max(200).optional().or(z.literal(""));

/* Long text: for descriptions, notes, content (max 50,000 chars) */
const longText = (label: string) =>
  z.string().min(1, `${label} is required.`).max(50_000, `${label} is too long.`);

/* Optional long text */
const optionalLongText = z.string().max(50_000).optional().or(z.literal(""));

/* Optional URL: loose validation — just needs to look like a URL */
const optionalUrl = z.string().trim().max(2000).url().optional().or(z.literal(""));

/* Optional date string: ISO 8601 format or empty */
const optionalDateString = z.string().datetime({ offset: true }).optional().or(z.literal("")).or(z.null());


/* ============================================================
   AUTH SCHEMAS
   ============================================================ */

/* POST /api/auth/signup */
export const signupSchema = z.object({
  name: shortText("Name").max(100),
  email,
  password,
});

/* POST /api/auth/forgot-password */
export const forgotPasswordSchema = z.object({
  email,
});

/* POST /api/auth/reset-password */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required.").max(256),
  password,
});


/* ============================================================
   AI SCHEMAS
   ============================================================ */

/* All valid AI action types */
const aiActions = [
  "analyze_resume",
  "optimize_resume",
  "rebuild_resume",
  "match_score",
  "cover_letter",
  "interview_questions",
  "interview_answer",
  "career_pivot",
  "linkedin_audit",
  "linkedin_rewrite",
  "mock_interview_start",
  "mock_interview_respond",
  "mock_interview_evaluate",
  "mock_interview_summary",
  "craft_outreach",
  "parse_resume_fields",
] as const;

/* POST /api/ai */
export const aiSchema = z.object({
  action: z.enum(aiActions, "Invalid AI action."),
  /* Payload is validated as a generic object — specific field validation */
  /* happens inside buildPrompt based on the action type */
  payload: z.record(z.string(), z.unknown()),
});


/* ============================================================
   APPLICATION SCHEMAS
   ============================================================ */

/* Valid application statuses */
const applicationStatuses = [
  "Saved", "Applied", "Interview", "Offer", "Rejected",
] as const;

/* POST /api/applications */
export const createApplicationSchema = z.object({
  jobTitle: shortText("Job title"),
  company: shortText("Company"),
});

/* PATCH /api/applications/[id] */
export const updateApplicationSchema = z.object({
  status: z.enum(applicationStatuses).optional(),
  notes: optionalLongText,
}).refine(
  (data) => data.status !== undefined || data.notes !== undefined,
  "At least one field (status or notes) must be provided."
);


/* ============================================================
   CONTACT SCHEMAS
   ============================================================ */

/* Valid relationship types */
const relationships = [
  "Connection", "Recruiter", "Hiring Manager", "Referral", "Mentor",
] as const;

/* POST /api/contacts */
export const createContactSchema = z.object({
  name: shortText("Contact name"),
  email: email.optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  company: optionalShortText,
  role: optionalShortText,
  linkedinUrl: optionalUrl,
  relationship: z.enum(relationships).optional().default("Connection"),
  notes: optionalLongText,
  nextFollowUp: optionalDateString,
});

/* PATCH /api/contacts/[id] */
export const updateContactSchema = z.object({
  name: shortText("Contact name").optional(),
  email: email.optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  company: optionalShortText,
  role: optionalShortText,
  linkedinUrl: optionalUrl,
  relationship: z.enum(relationships).optional(),
  notes: optionalLongText,
  lastContactedAt: optionalDateString,
  nextFollowUp: optionalDateString,
});


/* ============================================================
   COMPANY SCHEMAS
   ============================================================ */

/* Valid company sizes */
const companySizes = [
  "Startup", "Small", "Medium", "Large", "Enterprise",
] as const;

/* Valid company priorities */
const companyPriorities = ["Low", "Medium", "High"] as const;

/* Valid company statuses */
const companyStatuses = [
  "Researching", "Applied", "Interviewing", "Offer", "Rejected",
] as const;

/* POST /api/companies */
export const createCompanySchema = z.object({
  name: shortText("Company name"),
  industry: optionalShortText,
  website: optionalUrl,
  location: optionalShortText,
  size: z.enum(companySizes).optional().or(z.literal("")),
  notes: optionalLongText,
  priority: z.enum(companyPriorities).optional().default("Medium"),
  status: z.enum(companyStatuses).optional().default("Researching"),
});

/* PATCH /api/companies/[id] */
export const updateCompanySchema = z.object({
  name: shortText("Company name").optional(),
  industry: optionalShortText,
  website: optionalUrl,
  location: optionalShortText,
  size: z.enum(companySizes).optional().or(z.literal("")),
  notes: optionalLongText,
  priority: z.enum(companyPriorities).optional(),
  status: z.enum(companyStatuses).optional(),
});


/* ============================================================
   COVER LETTER SCHEMAS
   ============================================================ */

/* POST /api/cover-letters */
export const createCoverLetterSchema = z.object({
  jobTitle: shortText("Job title"),
  company: shortText("Company"),
  content: longText("Cover letter content"),
});


/* ============================================================
   RESUME SCHEMAS
   ============================================================ */

/* POST /api/resumes */
export const createResumeSchema = z.object({
  fileName: shortText("File name"),
  content: z.string().min(1, "Resume content is required.").max(200_000, "Resume content is too long."),
  analysis: z.string().max(200_000).optional().or(z.literal("")).or(z.null()),
});


/* ============================================================
   STRIPE SCHEMAS
   ============================================================ */

/* POST /api/stripe/checkout */
export const stripeCheckoutSchema = z.object({
  plan: z.enum(["pro", "enterprise"], "Plan must be 'pro' or 'enterprise'."),
});


/* ============================================================
   EXTENSION SCHEMAS
   ============================================================ */

/* POST /api/extension/save-job */
export const extensionSaveJobSchema = z.object({
  jobTitle: shortText("Job title"),
  company: shortText("Company"),
  location: optionalShortText,
  url: optionalUrl,
  description: z.string().max(50_000).optional().or(z.literal("")),
});

/* POST /api/extension/ai */
export const extensionAiSchema = z.object({
  action: z.enum(["match_score", "cover_letter"], "Action must be 'match_score' or 'cover_letter'."),
  description: longText("Job description"),
  jobTitle: optionalShortText,
  company: optionalShortText,
});


/* ============================================================
   USER SCHEMAS
   ============================================================ */

/* DELETE /api/user/delete */
export const deleteUserSchema = z.object({
  confirmEmail: email,
});


/* ============================================================
   HELPER: Format Zod errors into user-friendly messages
   ============================================================ */
export function formatZodError(error: z.ZodError): string {
  /* Return the first issue message — clearest for the user */
  return error.issues[0]?.message || "Invalid input.";
}
