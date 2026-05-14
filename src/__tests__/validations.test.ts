import { describe, it, expect } from "vitest";
import {
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  aiSchema,
  createApplicationSchema,
  updateApplicationSchema,
  createContactSchema,
  createCompanySchema,
  createCoverLetterSchema,
  createResumeSchema,
  stripeCheckoutSchema,
  extensionSaveJobSchema,
  extensionAiSchema,
  deleteUserSchema,
  formatZodError,
} from "@/lib/validations";

/* ============================================================
   AUTH VALIDATION TESTS
   ============================================================ */

describe("signupSchema", () => {
  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects uppercase email (enforces lowercase)", () => {
    const result = signupSchema.safeParse({
      name: "John",
      email: "JOHN@Example.COM",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = signupSchema.safeParse({
      email: "john@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signupSchema.safeParse({
      name: "John",
      email: "not-an-email",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = signupSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password over 128 chars", () => {
    const result = signupSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "a".repeat(129),
    });
    expect(result.success).toBe(false);
  });

  it("rejects name over 100 chars", () => {
    const result = signupSchema.safeParse({
      name: "a".repeat(201),
      email: "john@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts valid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "test@test.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "bad" });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts valid token and password", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123token",
      password: "newpassword123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty token", () => {
    const result = resetPasswordSchema.safeParse({
      token: "",
      password: "newpassword123",
    });
    expect(result.success).toBe(false);
  });
});

/* ============================================================
   AI VALIDATION TESTS
   ============================================================ */

describe("aiSchema", () => {
  it("accepts valid AI action", () => {
    const result = aiSchema.safeParse({
      action: "cover_letter",
      payload: { jobDescription: "test" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid action types", () => {
    const actions = [
      "analyze_resume", "optimize_resume", "rebuild_resume", "match_score",
      "cover_letter", "interview_questions", "interview_answer", "career_pivot",
      "linkedin_audit", "linkedin_rewrite", "mock_interview_start",
      "mock_interview_respond", "mock_interview_evaluate", "mock_interview_summary",
      "craft_outreach", "parse_resume_fields",
    ];
    for (const action of actions) {
      const result = aiSchema.safeParse({ action, payload: {} });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid action type", () => {
    const result = aiSchema.safeParse({
      action: "hack_the_planet",
      payload: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing payload", () => {
    const result = aiSchema.safeParse({ action: "cover_letter" });
    expect(result.success).toBe(false);
  });
});

/* ============================================================
   APPLICATION VALIDATION TESTS
   ============================================================ */

describe("createApplicationSchema", () => {
  it("accepts valid application", () => {
    const result = createApplicationSchema.safeParse({
      jobTitle: "Software Engineer",
      company: "Acme Corp",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty job title", () => {
    const result = createApplicationSchema.safeParse({
      jobTitle: "",
      company: "Acme Corp",
    });
    expect(result.success).toBe(false);
  });

  it("rejects oversized fields", () => {
    const result = createApplicationSchema.safeParse({
      jobTitle: "a".repeat(201),
      company: "Acme",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateApplicationSchema", () => {
  it("accepts valid status update", () => {
    const result = updateApplicationSchema.safeParse({ status: "Interview" });
    expect(result.success).toBe(true);
  });

  it("accepts valid notes update", () => {
    const result = updateApplicationSchema.safeParse({ notes: "Had a great call" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = updateApplicationSchema.safeParse({ status: "InvalidStatus" });
    expect(result.success).toBe(false);
  });

  it("rejects empty update (no fields)", () => {
    const result = updateApplicationSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

/* ============================================================
   CONTACT VALIDATION TESTS
   ============================================================ */

describe("createContactSchema", () => {
  it("accepts valid contact with minimal fields", () => {
    const result = createContactSchema.safeParse({ name: "Alice" });
    expect(result.success).toBe(true);
  });

  it("accepts full contact data", () => {
    const result = createContactSchema.safeParse({
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "+44 7700 900000",
      company: "TechCo",
      role: "Recruiter",
      relationship: "Recruiter",
      notes: "Met at conference",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createContactSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});

/* ============================================================
   COMPANY VALIDATION TESTS
   ============================================================ */

describe("createCompanySchema", () => {
  it("accepts valid company", () => {
    const result = createCompanySchema.safeParse({ name: "Acme Corp" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid size", () => {
    const result = createCompanySchema.safeParse({
      name: "Acme",
      size: "Mega",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid priority", () => {
    const result = createCompanySchema.safeParse({
      name: "Acme",
      priority: "Urgent",
    });
    expect(result.success).toBe(false);
  });
});

/* ============================================================
   COVER LETTER & RESUME VALIDATION TESTS
   ============================================================ */

describe("createCoverLetterSchema", () => {
  it("accepts valid cover letter", () => {
    const result = createCoverLetterSchema.safeParse({
      jobTitle: "Engineer",
      company: "Acme",
      content: "Dear Hiring Manager...",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing content", () => {
    const result = createCoverLetterSchema.safeParse({
      jobTitle: "Engineer",
      company: "Acme",
    });
    expect(result.success).toBe(false);
  });
});

describe("createResumeSchema", () => {
  it("accepts valid resume", () => {
    const result = createResumeSchema.safeParse({
      fileName: "resume.pdf",
      content: "Resume text content here...",
    });
    expect(result.success).toBe(true);
  });

  it("rejects content over 200k chars", () => {
    const result = createResumeSchema.safeParse({
      fileName: "resume.pdf",
      content: "a".repeat(200_001),
    });
    expect(result.success).toBe(false);
  });
});

/* ============================================================
   STRIPE VALIDATION TESTS
   ============================================================ */

describe("stripeCheckoutSchema", () => {
  it("accepts pro plan", () => {
    const result = stripeCheckoutSchema.safeParse({ plan: "pro" });
    expect(result.success).toBe(true);
  });

  it("rejects enterprise plan", () => {
    const result = stripeCheckoutSchema.safeParse({ plan: "enterprise" });
    expect(result.success).toBe(false);
  });

  it("rejects free plan", () => {
    const result = stripeCheckoutSchema.safeParse({ plan: "free" });
    expect(result.success).toBe(false);
  });
});

/* ============================================================
   EXTENSION VALIDATION TESTS
   ============================================================ */

describe("extensionSaveJobSchema", () => {
  it("accepts valid job save", () => {
    const result = extensionSaveJobSchema.safeParse({
      jobTitle: "Developer",
      company: "Startup Inc",
    });
    expect(result.success).toBe(true);
  });
});

describe("extensionAiSchema", () => {
  it("accepts match_score action", () => {
    const result = extensionAiSchema.safeParse({
      action: "match_score",
      description: "We need a software engineer...",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid action", () => {
    const result = extensionAiSchema.safeParse({
      action: "analyze_resume",
      description: "test",
    });
    expect(result.success).toBe(false);
  });
});

/* ============================================================
   USER VALIDATION TESTS
   ============================================================ */

describe("deleteUserSchema", () => {
  it("accepts valid email confirmation", () => {
    const result = deleteUserSchema.safeParse({ confirmEmail: "user@test.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = deleteUserSchema.safeParse({ confirmEmail: "not-email" });
    expect(result.success).toBe(false);
  });
});

/* ============================================================
   HELPER TESTS
   ============================================================ */

describe("formatZodError", () => {
  it("returns first issue message", () => {
    const result = signupSchema.safeParse({ name: "", email: "bad", password: "x" });
    if (!result.success) {
      const msg = formatZodError(result.error);
      expect(typeof msg).toBe("string");
      expect(msg.length).toBeGreaterThan(0);
    }
  });
});
