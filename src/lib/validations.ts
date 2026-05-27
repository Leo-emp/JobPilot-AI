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
  "interview_feedback",
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
  salary: optionalShortText,
  description: optionalLongText,
});

/* PATCH /api/applications/[id] */
export const updateApplicationSchema = z.object({
  status: z.enum(applicationStatuses).optional(),
  notes: optionalLongText,
  interviewDate: z.string().datetime().optional().nullable(),
}).refine(
  (data) => data.status !== undefined || data.notes !== undefined || data.interviewDate !== undefined,
  "At least one field (status, notes, or interviewDate) must be provided."
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
  plan: z.enum(["pro"], "Plan must be 'pro'."),
  interval: z.enum(["month", "year"]).optional().default("month"),
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
  status: z.enum(["Saved", "Applied"]).optional(),
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
   PORTFOLIO SCHEMAS
   ============================================================ */

/* Valid portfolio template names */
const portfolioTemplates = [
  "minimal", "developer", "creative", "corporate", "academic", "modern",
  "videographer", "photographer", "architect",
] as const;

/* Slug: 3-40 chars, lowercase alphanumeric + hyphens, no leading/trailing hyphens */
const portfolioSlug = z.string()
  .trim()
  .min(3, "Slug must be at least 3 characters.")
  .max(40, "Slug must be 40 characters or less.")
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Only lowercase letters, numbers, and hyphens allowed.");

/* Safe URL: block javascript: and data: protocols to prevent XSS */
const safeUrl = z.string().max(2000).refine(
  (val) => !val || /^https?:\/\//.test(val) || val === "",
  "URLs must start with http:// or https://",
);

/* Section limits — prevent abuse through oversized portfolios */
const MAX_SECTIONS = 20;
const MAX_ENTRIES_PER_SECTION = 50;
const MAX_ACHIEVEMENTS = 20;
const MAX_SKILLS_PER_GROUP = 30;
const MAX_SKILL_GROUPS = 15;
const MAX_TECH_STACK = 20;

const validSectionTypes = [
  "about", "experience", "education", "skills", "projects",
  "certifications", "publications", "awards", "gallery",
  "testimonials", "contact",
] as const;

/* Deep sections validator — parses JSON string, validates structure & limits */
export function validateSections(sectionsStr: string): { valid: boolean; error?: string } {
  let sections: unknown[];
  try {
    sections = JSON.parse(sectionsStr);
  } catch {
    return { valid: false, error: "Invalid sections JSON." };
  }

  if (!Array.isArray(sections)) {
    return { valid: false, error: "Sections must be an array." };
  }

  if (sections.length > MAX_SECTIONS) {
    return { valid: false, error: `Maximum ${MAX_SECTIONS} sections allowed.` };
  }

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i] as Record<string, unknown>;
    if (!s || typeof s !== "object") {
      return { valid: false, error: `Section ${i + 1} is invalid.` };
    }

    if (!validSectionTypes.includes(s.type as typeof validSectionTypes[number])) {
      return { valid: false, error: `Section ${i + 1} has invalid type "${String(s.type)}".` };
    }

    if (typeof s.visible !== "boolean") {
      return { valid: false, error: `Section ${i + 1} must have a visible boolean.` };
    }

    /* Validate entry counts for array-based sections */
    if ("entries" in s && Array.isArray(s.entries)) {
      if (s.entries.length > MAX_ENTRIES_PER_SECTION) {
        return { valid: false, error: `Section "${String(s.type)}" exceeds ${MAX_ENTRIES_PER_SECTION} entries limit.` };
      }

      for (const entry of s.entries as Record<string, unknown>[]) {
        if (!entry || typeof entry !== "object") continue;

        /* Validate achievements array size */
        if ("achievements" in entry && Array.isArray(entry.achievements)) {
          if (entry.achievements.length > MAX_ACHIEVEMENTS) {
            return { valid: false, error: `Maximum ${MAX_ACHIEVEMENTS} achievements per entry.` };
          }
        }

        /* Validate techStack array size */
        if ("techStack" in entry && Array.isArray(entry.techStack)) {
          if (entry.techStack.length > MAX_TECH_STACK) {
            return { valid: false, error: `Maximum ${MAX_TECH_STACK} tech stack items per entry.` };
          }
        }

        /* Block dangerous URLs in imageUrl, videoUrl, liveUrl, repoUrl, link */
        for (const urlField of ["imageUrl", "videoUrl", "liveUrl", "repoUrl", "link"]) {
          const val = entry[urlField];
          if (typeof val === "string" && val.length > 0) {
            if (val.length > 2000) {
              return { valid: false, error: `URL in ${urlField} exceeds 2000 characters.` };
            }
            if (!/^https?:\/\//.test(val)) {
              return { valid: false, error: `URLs must start with http:// or https:// (found in ${urlField}).` };
            }
          }
        }
      }
    }

    /* Validate skill groups */
    if ("groups" in s && Array.isArray(s.groups)) {
      if (s.groups.length > MAX_SKILL_GROUPS) {
        return { valid: false, error: `Maximum ${MAX_SKILL_GROUPS} skill groups allowed.` };
      }
      for (const group of s.groups as Record<string, unknown>[]) {
        if (group && "skills" in group && Array.isArray(group.skills)) {
          if (group.skills.length > MAX_SKILLS_PER_GROUP) {
            return { valid: false, error: `Maximum ${MAX_SKILLS_PER_GROUP} skills per group.` };
          }
        }
      }
    }

    /* Validate string field lengths within sections */
    for (const [key, val] of Object.entries(s)) {
      if (typeof val === "string" && key !== "type") {
        if (val.length > 10_000) {
          return { valid: false, error: `Field "${key}" in section "${String(s.type)}" exceeds 10,000 character limit.` };
        }
      }
    }
  }

  return { valid: true };
}

/* POST /api/portfolio */
export const createPortfolioSchema = z.object({
  slug: portfolioSlug,
  title: shortText("Portfolio title"),
  tagline: optionalShortText,
  template: z.enum(portfolioTemplates).optional().default("minimal"),
});

/* PATCH /api/portfolio */
export const updatePortfolioSchema = z.object({
  slug: portfolioSlug.optional(),
  title: shortText("Portfolio title").optional(),
  tagline: optionalShortText,
  bio: optionalLongText,
  template: z.enum(portfolioTemplates).optional(),
  themeColors: z.string().max(500).optional().or(z.literal("")),
  socialLinks: z.string().max(5000).optional().or(z.literal("")),
  avatarUrl: safeUrl.optional().or(z.literal("")),
  sections: z.string().max(200_000).optional(),
});

/* POST /api/portfolio/publish */
export const publishPortfolioSchema = z.object({
  published: z.boolean(),
});


/* ============================================================
   HELPER: Format Zod errors into user-friendly messages
   ============================================================ */
export function formatZodError(error: z.ZodError): string {
  /* Return the first issue message — clearest for the user */
  return error.issues[0]?.message || "Invalid input.";
}
