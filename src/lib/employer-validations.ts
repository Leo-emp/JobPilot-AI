/* ============================================================
   EMPLOYER VALIDATION SCHEMAS — Zod schemas for /api/employer/*
   ============================================================
   All employer-related input validation. Separate file to keep
   the existing validations.ts untouched (additive-only rule).
   ============================================================ */

import { z } from "zod";

/* # Create employer account */
export const createEmployerSchema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(200),
  slug: z.string().trim().min(1).max(100)
    .regex(/^[a-z0-9-]+$/, "URL slug must be lowercase alphanumeric with hyphens"),
  industry: z.string().trim().max(100).optional(),
  size: z.enum(["startup", "small", "medium", "large", "enterprise"]).optional(),
  website: z.string().url().max(2000).optional().or(z.literal("")),
  description: z.string().trim().max(5000).optional(),
  location: z.string().trim().max(200).optional(),
  remoteFriendly: z.boolean().default(false),
});

/* # Update employer profile — all fields optional */
export const updateEmployerSchema = createEmployerSchema.partial();

/* # Create/update role (job posting) */
export const createRoleSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(50000),
  requirements: z.string().max(50000).optional(),
  skills: z.string().max(10000).optional(),         // # JSON array of required skills
  niceToHaveSkills: z.string().max(10000).optional(), // # JSON array of bonus skills
  experienceMin: z.number().int().min(0).max(50).optional().nullable(),
  experienceMax: z.number().int().min(0).max(50).optional().nullable(),
  salaryMin: z.number().int().min(0).optional().nullable(),
  salaryMax: z.number().int().min(0).optional().nullable(),
  salaryCurrency: z.string().max(3).default("USD"),
  locationType: z.enum(["remote", "hybrid", "onsite"]).default("remote"),
  location: z.string().trim().max(200).optional(),
  employmentType: z.enum(["full-time", "part-time", "contract"]).default("full-time"),
  industry: z.string().trim().max(100).optional(),
  education: z.string().trim().max(100).optional(),
  urgency: z.enum(["normal", "urgent", "critical"]).default("normal"),
  candidatesNeeded: z.number().int().min(1).max(100).default(1),
}).refine(
  (d) => !d.salaryMin || !d.salaryMax || d.salaryMin <= d.salaryMax,
  { message: "Minimum salary must be less than maximum" }
).refine(
  (d) => !d.experienceMin || !d.experienceMax || d.experienceMin <= d.experienceMax,
  { message: "Minimum experience must be less than maximum" }
);

/* # Update role — all fields optional */
export const updateRoleSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().min(1).max(50000).optional(),
  requirements: z.string().max(50000).optional(),
  skills: z.string().max(10000).optional(),
  niceToHaveSkills: z.string().max(10000).optional(),
  experienceMin: z.number().int().min(0).max(50).optional().nullable(),
  experienceMax: z.number().int().min(0).max(50).optional().nullable(),
  salaryMin: z.number().int().min(0).optional().nullable(),
  salaryMax: z.number().int().min(0).optional().nullable(),
  salaryCurrency: z.string().max(3).optional(),
  locationType: z.enum(["remote", "hybrid", "onsite"]).optional(),
  location: z.string().trim().max(200).optional(),
  employmentType: z.enum(["full-time", "part-time", "contract"]).optional(),
  industry: z.string().trim().max(100).optional(),
  education: z.string().trim().max(100).optional(),
  urgency: z.enum(["normal", "urgent", "critical"]).optional(),
  candidatesNeeded: z.number().int().min(1).max(100).optional(),
  status: z.enum(["draft", "active", "paused", "filled", "cancelled"]).optional(),
});

/* # Candidate preferences for matching */
export const candidatePreferenceSchema = z.object({
  openToWork: z.boolean().default(true),
  desiredTitle: z.string().trim().max(200).optional().nullable(),
  desiredSkills: z.string().max(5000).optional().nullable(),    // # JSON array
  locationPref: z.enum(["remote", "hybrid", "onsite", "any"]).default("remote"),
  locations: z.string().max(5000).optional().nullable(),        // # JSON array
  salaryMin: z.number().int().min(0).optional().nullable(),
  salaryCurrency: z.string().max(3).default("USD"),
  employmentType: z.enum(["full-time", "part-time", "contract", "any"]).default("full-time"),
  industries: z.string().max(5000).optional().nullable(),       // # JSON array
  companySizes: z.string().max(5000).optional().nullable(),     // # JSON array
});

/* # Add employer team member */
export const addEmployerMemberSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  role: z.enum(["recruiter", "admin", "owner"]).default("recruiter"),
});
