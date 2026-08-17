# B2B Platform Phase 0–3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the B2B foundation — fix pre-pilot bugs, add org layer (career services), employer accounts, role posting, and public job board. Everything from Phase 0 (hardening) through Phase 3 (employer foundation) in the unified B2B spec.

**Architecture:** Purely additive. New models, routes, and pages alongside existing code. Zero modifications to existing routes or UI. The only existing files touched are: `schema.prisma` (back-references on User), `plan-limits.ts` (add `getEffectivePlan`), 3 AI routes (swap `user.plan` for `getEffectivePlan()`), `proxy.ts` (public route allowlist), `user/delete` (cascade memberships), `user/export` (include memberships), `audit.ts` (add event types), `validations.ts` (add new schemas).

**Tech Stack:** Next.js 16, Prisma (SQLite/Turso), Zod, Vitest, Resend email, existing `authHandler`/`safeHandler` wrappers, existing rate-limit infrastructure.

**Spec:** `docs/superpowers/specs/2026-08-16-b2b-unified-platform-design.md`

## Global Constraints

- **Zero changes to existing 54 API routes** — no modifications to request/response shapes, no new parameters, no behavioral changes
- **Zero changes to existing UI pages** — dashboard pages, marketing pages, auth pages all untouched
- **All migrations additive-only** — new tables, new columns with defaults. No column renames, no drops, no backfills
- **Comments required** — all code heavily commented with `//` throughout for learning (user preference)
- **Zod validation on every route** — no raw `req.json()` without schema parsing
- **Rate limiting on every new route** — use existing `createRateLimiter` infrastructure
- **Audit logging on security events** — use existing `audit()` function
- **Test with Vitest** — test files in `src/__tests__/`, match existing naming pattern
- **Stripe keys never in logs/output** — scan every file before commit

---

## File Structure

### New Library Files (`src/lib/`)

| File | Responsibility |
|---|---|
| `src/lib/effective-plan.ts` | `getEffectivePlan(userId)` — resolves user's plan considering org sponsorship |
| `src/lib/org-handler.ts` | `orgHandler(handler, minRole)` — auth wrapper for `/api/org/*` routes |
| `src/lib/employer-handler.ts` | `employerHandler(handler, minRole)` — auth wrapper for `/api/employer/*` routes |
| `src/lib/org-validations.ts` | Zod schemas for org routes (create org, invite, member update) |
| `src/lib/employer-validations.ts` | Zod schemas for employer routes (create employer, role CRUD) |
| `src/lib/skills-taxonomy.json` | ~200 skills with synonyms + relatedness maps |
| `src/lib/industry-taxonomy.json` | ~30 industries with relatedness maps |
| `src/lib/invite-email.ts` | Org invite email template (Resend) |
| `src/lib/employer-verify-email.ts` | Employer verification notification email |

### New API Routes

| Route | File |
|---|---|
| `/api/org` | `src/app/api/org/route.ts` |
| `/api/org/[orgId]` | `src/app/api/org/[orgId]/route.ts` |
| `/api/org/[orgId]/members` | `src/app/api/org/[orgId]/members/route.ts` |
| `/api/org/[orgId]/members/[userId]` | `src/app/api/org/[orgId]/members/[userId]/route.ts` |
| `/api/org/[orgId]/members/[userId]/activity` | `src/app/api/org/[orgId]/members/[userId]/activity/route.ts` |
| `/api/org/[orgId]/invites` | `src/app/api/org/[orgId]/invites/route.ts` |
| `/api/org/invites/accept` | `src/app/api/org/invites/accept/route.ts` |
| `/api/org/[orgId]/stats` | `src/app/api/org/[orgId]/stats/route.ts` |
| `/api/org/[orgId]/export` | `src/app/api/org/[orgId]/export/route.ts` |
| `/api/employer` | `src/app/api/employer/route.ts` |
| `/api/employer/[empId]` | `src/app/api/employer/[empId]/route.ts` |
| `/api/employer/[empId]/members` | `src/app/api/employer/[empId]/members/route.ts` |
| `/api/employer/[empId]/roles` | `src/app/api/employer/[empId]/roles/route.ts` |
| `/api/employer/[empId]/roles/[roleId]` | `src/app/api/employer/[empId]/roles/[roleId]/route.ts` |
| `/api/user/preferences` | `src/app/api/user/preferences/route.ts` |
| `/api/roles` | `src/app/api/roles/route.ts` |
| `/api/roles/[roleId]` | `src/app/api/roles/[roleId]/route.ts` |
| `/api/companies/[slug]` | `src/app/api/companies-public/[slug]/route.ts` |

### New Frontend Pages

| Page | File |
|---|---|
| Coach dashboard layout | `src/app/org/[orgId]/layout.tsx` |
| Coach overview | `src/app/org/[orgId]/page.tsx` |
| Coach candidates | `src/app/org/[orgId]/candidates/page.tsx` |
| Coach candidate detail | `src/app/org/[orgId]/candidates/[userId]/page.tsx` |
| Coach invites | `src/app/org/[orgId]/invites/page.tsx` |
| Coach settings | `src/app/org/[orgId]/settings/page.tsx` |
| Invite accept | `src/app/invite/[token]/page.tsx` |
| Employer dashboard layout | `src/app/employer/[empId]/layout.tsx` |
| Employer overview | `src/app/employer/[empId]/page.tsx` |
| Employer roles | `src/app/employer/[empId]/roles/page.tsx` |
| Employer role detail | `src/app/employer/[empId]/roles/[roleId]/page.tsx` |
| Employer company profile | `src/app/employer/[empId]/company/page.tsx` |
| Employer team | `src/app/employer/[empId]/team/page.tsx` |
| Employer billing | `src/app/employer/[empId]/billing/page.tsx` |
| Candidate preferences | `src/app/dashboard/preferences/page.tsx` |
| Public roles (job board) | `src/app/roles/page.tsx` |
| Public role detail | `src/app/roles/[roleId]/page.tsx` |
| Public companies | `src/app/companies-public/page.tsx` |
| Public company detail | `src/app/companies-public/[slug]/page.tsx` |
| For employers landing | `src/app/(marketing)/for-employers/page.tsx` |

### Modified Files (minimal, enumerated)

| File | Change | Size |
|---|---|---|
| `prisma/schema.prisma` | Add 9 new models + User back-references | M |
| `src/lib/plan-limits.ts` | Add `enterprise` entry to fix fallthrough bug | XS |
| `src/lib/effective-plan.ts` | New file — `getEffectivePlan()` | S |
| `src/app/api/ai/route.ts` | Import+call `getEffectivePlan()` instead of `user.plan` | XS |
| `src/app/api/ai/stream/route.ts` | Same swap | XS |
| `src/app/api/extension/ai/route.ts` | Same swap | XS |
| `src/proxy.ts` | Add `/api/org/invites/accept`, `/api/roles`, `/api/companies-public` to public allowlist | XS |
| `src/app/api/user/delete/route.ts` | Add membership cascade on soft-delete | S |
| `src/app/api/user/export/route.ts` | Include memberships in GDPR export | XS |
| `src/lib/audit.ts` | Add new audit event types for org/employer actions | XS |
| `src/lib/validations.ts` | No change — new schemas go in separate files | — |
| `src/app/api/cron/gdpr-cleanup/route.ts` | Add org soft-delete cleanup | XS |

---

## Task 1: Phase 0 — Pre-Pilot Bug Fixes

**Files:**
- Modify: `src/lib/plan-limits.ts`
- Modify: `src/app/api/cron/db-backup/route.ts` (or whichever cron routes use plain string compare)
- Test: `src/__tests__/plan-limits.test.ts`

**Interfaces:**
- Consumes: existing `PLAN_LIMITS` from `src/lib/plan-limits.ts`
- Produces: Fixed `PLAN_LIMITS` with `enterprise` entry mapped to `1000`

- [ ] **Step 1: Write failing test for enterprise plan limit**

```typescript
// src/__tests__/plan-limits.test.ts
import { describe, it, expect } from "vitest";
import { PLAN_LIMITS } from "@/lib/plan-limits";

describe("PLAN_LIMITS", () => {
  it("has a limit for the enterprise plan", () => {
    /* # Enterprise plan should NOT fall through to free limit */
    expect(PLAN_LIMITS.enterprise).toBeDefined();
    expect(PLAN_LIMITS.enterprise).toBeGreaterThan(PLAN_LIMITS.free);
  });

  it("all known plans have explicit limits", () => {
    /* # Every plan name that Stripe might set must have a limit */
    const plans = ["free", "pro", "enterprise"];
    for (const plan of plans) {
      expect(PLAN_LIMITS[plan]).toBeDefined();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/plan-limits.test.ts`
Expected: FAIL — `PLAN_LIMITS.enterprise` is `undefined`

- [ ] **Step 3: Fix enterprise plan limit**

In `src/lib/plan-limits.ts`, add the `enterprise` entry:

```typescript
/* # Monthly AI call limits per plan */
export const PLAN_LIMITS: Record<string, number> = {
  free: 20,
  pro: 1000,
  enterprise: 1000, // # Same as pro — enterprise benefits are features, not quota
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/plan-limits.test.ts`
Expected: PASS

- [ ] **Step 5: Find and fix timing-unsafe cron secret comparison**

Search all cron routes for `!==` or `===` comparisons against `CRON_SECRET`. Replace with timing-safe comparison:

```typescript
import crypto from "crypto";

/* # Timing-safe compare prevents timing attacks on the bearer token */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
```

Use `timingSafeCompare(token, process.env.CRON_SECRET!)` instead of `token === process.env.CRON_SECRET`.

- [ ] **Step 6: Run all existing tests to confirm nothing broke**

Run: `npx vitest run`
Expected: All existing tests pass

- [ ] **Step 7: Commit**

```bash
git add src/lib/plan-limits.ts src/__tests__/plan-limits.test.ts src/app/api/cron/
git commit -m "fix: enterprise plan limit fallthrough + timing-safe cron auth

Enterprise plan fell through to free 20-call limit. Added explicit entry.
Cron secret comparison now uses crypto.timingSafeEqual.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Prisma Schema — Org Layer Models

**Files:**
- Modify: `prisma/schema.prisma` (add 3 new models + User back-reference)
- Test: Migration runs cleanly

**Interfaces:**
- Consumes: existing `User` model in `schema.prisma`
- Produces: `Organization`, `OrganizationMember`, `OrganizationInvite` models; `memberships OrganizationMember[]` on User

- [ ] **Step 1: Add Organization model to schema.prisma**

Append after the `BlogPost` model (do NOT modify any existing model definitions except adding the back-reference to User):

```prisma
// ---- Organization ----
// A B2B customer: recruitment agency, bootcamp, university career office,
// or outplacement provider. Billing and seat limits live here, not on User.
model Organization {
  id             String    @id @default(cuid())
  name           String                          // # Display name, e.g. "Northcoders"
  slug           String    @unique               // # For org-scoped URLs
  type           String    @default("agency")    // # agency, bootcamp, university, outplacement
  plan           String    @default("pilot")     // # pilot, team, business (B2B tiers)
  seatLimit      Int       @default(25)          // # Max candidate members
  billingEmail   String                          // # Where invoices go
  stripeCustomerId String?                       // # Org-level Stripe customer (null while manual)
  stripeSubId      String?                       // # Org-level subscription
  logoUrl        String?                         // # For the coach dashboard header
  deletedAt      DateTime?                       // # Soft-delete, same pattern as User
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  members OrganizationMember[]
  invites OrganizationInvite[]

  @@index([deletedAt])
}

// ---- Organization Membership ----
// Links a User to an Organization with a role. Authorization pivot for B2B layer.
model OrganizationMember {
  id             String   @id @default(cuid())
  organizationId String
  userId         String
  role           String   @default("candidate")  // # owner, admin, coach, candidate
  cohort         String?                         // # Free-text grouping, e.g. "March 2027 cohort"
  dataVisibility String   @default("metrics")    // # metrics = activity counts only, full = resume content
  invitedById    String?                         // # Which admin/coach invited them
  joinedAt       DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])             // # One membership per user per org
  @@index([userId])                              // # "which orgs am I in" lookup
  @@index([organizationId, role])                // # "list all candidates" lookup
}

// ---- Organization Invite ----
// Time-limited invite tokens for bulk candidate onboarding.
// Token stored HASHED (same pattern as PasswordReset).
model OrganizationInvite {
  id             String    @id @default(cuid())
  organizationId String
  email          String                          // # Invitee email
  role           String    @default("candidate")
  cohort         String?
  tokenHash      String    @unique               // # SHA-256 of raw token sent by email
  expiresAt      DateTime                        // # 14 days from creation
  acceptedAt     DateTime?                       // # Null until accepted
  createdAt      DateTime  @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
  @@index([email])
  @@index([expiresAt])
}
```

- [ ] **Step 2: Add back-reference to User model**

In the User model's relationship section, add after `portfolio Portfolio?`:

```prisma
  memberships    OrganizationMember[]
```

This is the ONLY change to the User model block in this task.

- [ ] **Step 3: Run Prisma migration**

Run: `npx prisma migrate dev --name add-org-layer`
Expected: Migration creates 3 new tables, no changes to existing tables

- [ ] **Step 4: Verify migration**

Run: `npx prisma migrate status`
Expected: All migrations applied, no pending

- [ ] **Step 5: Commit**

```bash
git add prisma/
git commit -m "feat: add Organization, OrganizationMember, OrganizationInvite models

Additive migration — 3 new tables, zero changes to existing tables.
Only touch on User model is the memberships back-reference.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: getEffectivePlan + orgHandler

**Files:**
- Create: `src/lib/effective-plan.ts`
- Create: `src/lib/org-handler.ts`
- Create: `src/lib/org-validations.ts`
- Modify: `src/lib/audit.ts` (add org audit event types)
- Test: `src/__tests__/effective-plan.test.ts`

**Interfaces:**
- Consumes: `prisma` from `src/lib/prisma.ts`, `cacheGet`/`cacheSet` from `src/lib/redis.ts`, `authHandler`/`AuthSession` from `src/lib/api-handler.ts`
- Produces: `getEffectivePlan(userId): Promise<"free" | "pro">`, `orgHandler(handler, minRole): RouteHandler`, org Zod schemas

- [ ] **Step 1: Write failing test for getEffectivePlan**

```typescript
// src/__tests__/effective-plan.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

/* # Mock prisma before importing the module under test */
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    organizationMember: { findFirst: vi.fn() },
  },
}));

vi.mock("@/lib/redis", () => ({
  cacheGet: vi.fn().mockResolvedValue(null),
  cacheSet: vi.fn().mockResolvedValue(undefined),
}));

import { getEffectivePlan } from "@/lib/effective-plan";
import { prisma } from "@/lib/prisma";

describe("getEffectivePlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 'pro' when user has own pro plan", async () => {
    /* # User is already paying — no org check needed */
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({ plan: "pro" });
    const result = await getEffectivePlan("user-1");
    expect(result).toBe("pro");
  });

  it("returns 'pro' when user is free but org member", async () => {
    /* # Free user sponsored by an org with active plan gets pro */
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({ plan: "free" });
    (prisma.organizationMember.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      organization: { plan: "team", deletedAt: null },
    });
    const result = await getEffectivePlan("user-1");
    expect(result).toBe("pro");
  });

  it("returns 'free' when user is free with no org", async () => {
    /* # No sponsorship — stays on free */
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({ plan: "free" });
    (prisma.organizationMember.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await getEffectivePlan("user-1");
    expect(result).toBe("free");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/effective-plan.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement getEffectivePlan**

```typescript
// src/lib/effective-plan.ts
/* ============================================================
   EFFECTIVE PLAN — Resolves a user's plan considering org sponsorship
   ============================================================
   A user's effective plan = their own paid plan, OR "pro" if any of
   their organizations has an active B2B subscription.
   Cached under "plan:{userId}" key for 60s.
   ============================================================ */

import { prisma } from "@/lib/prisma";
import { cacheGet, cacheSet } from "@/lib/redis";

/* # Resolve user's effective plan — own plan or org-sponsored pro */
export async function getEffectivePlan(userId: string): Promise<"free" | "pro"> {
  /* # Check cache first — avoid DB hit on every AI request */
  const cached = await cacheGet(`effectivePlan:${userId}`);
  if (cached === "pro" || cached === "free") return cached;

  /* # Look up user's own plan */
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  /* # If user already has a paid plan, they're pro */
  if (user?.plan === "pro" || user?.plan === "enterprise") {
    await cacheSet(`effectivePlan:${userId}`, "pro", 60);
    return "pro";
  }

  /* # Check if any org sponsorship grants pro entitlements */
  const sponsorship = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organization: {
        deletedAt: null,
        plan: { not: "pilot" }, // # Only paid org plans grant pro
      },
    },
    select: { organization: { select: { plan: true } } },
  });

  /* # Active org membership with paid plan → pro */
  const effective = sponsorship ? "pro" : "free";
  await cacheSet(`effectivePlan:${userId}`, effective, 60);
  return effective;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/effective-plan.test.ts`
Expected: PASS

- [ ] **Step 5: Create orgHandler**

```typescript
// src/lib/org-handler.ts
/* ============================================================
   ORG HANDLER — Authorization wrapper for /api/org/* routes
   ============================================================
   Composes with authHandler: resolves OrganizationMember for the
   authenticated user + orgId from URL params. Returns 403 unless
   the member's role meets the minimum required role.

   Role hierarchy: candidate < coach < admin < owner
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler, type AuthSession } from "@/lib/api-handler";
import { cacheGet, cacheSet } from "@/lib/redis";
import { dbRetry } from "@/lib/db-retry";

/* # Role hierarchy — higher index = more permissions */
const ROLE_LEVELS: Record<string, number> = {
  candidate: 0,
  coach: 1,
  admin: 2,
  owner: 3,
};

/* # Membership info passed to route handlers */
export interface OrgMembership {
  memberId: string;
  organizationId: string;
  role: string;
  userId: string;
}

/* # Route handler type with session + membership */
type OrgRouteHandler = (
  req: NextRequest,
  session: AuthSession,
  membership: OrgMembership,
  params: { orgId: string; [key: string]: string }
) => Promise<Response | NextResponse>;

/* # Main wrapper — checks auth + org membership + role level */
export function orgHandler(handler: OrgRouteHandler, minRole: string = "candidate") {
  return authHandler(async (req: NextRequest, session: AuthSession, context: { params: Promise<{ orgId: string; [key: string]: string }> }) => {
    const params = await context.params;
    const orgId = params.orgId;

    if (!orgId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 });
    }

    /* # Check cache first for membership lookups */
    const cacheKey = `org:member:${orgId}:${session.user.id}`;
    const cached = await cacheGet(cacheKey);
    let membership: OrgMembership | null = null;

    if (cached) {
      try {
        membership = JSON.parse(cached);
      } catch {
        /* # Invalid cache — fall through to DB lookup */
      }
    }

    if (!membership) {
      /* # Resolve membership from DB */
      const member = await dbRetry(() =>
        prisma.organizationMember.findUnique({
          where: {
            organizationId_userId: {
              organizationId: orgId,
              userId: session.user.id,
            },
          },
          select: {
            id: true,
            organizationId: true,
            role: true,
            userId: true,
          },
        })
      );

      if (!member) {
        return NextResponse.json({ error: "Not a member of this organization" }, { status: 403 });
      }

      membership = {
        memberId: member.id,
        organizationId: member.organizationId,
        role: member.role,
        userId: member.userId,
      };

      /* # Cache for 60s to avoid repeated DB lookups */
      await cacheSet(cacheKey, JSON.stringify(membership), 60);
    }

    /* # Check role level against minimum required */
    const userLevel = ROLE_LEVELS[membership.role] ?? 0;
    const requiredLevel = ROLE_LEVELS[minRole] ?? 0;

    if (userLevel < requiredLevel) {
      return NextResponse.json(
        { error: `Requires ${minRole} role or higher` },
        { status: 403 }
      );
    }

    return handler(req, session, membership, params);
  });
}
```

- [ ] **Step 6: Create org validation schemas**

```typescript
// src/lib/org-validations.ts
/* ============================================================
   ORG VALIDATION SCHEMAS — Zod schemas for /api/org/* routes
   ============================================================ */

import { z } from "zod";

/* # Create organization (admin-only, manual for now) */
export const createOrgSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  slug: z.string().trim().min(1).max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  type: z.enum(["agency", "bootcamp", "university", "outplacement"]).default("agency"),
  billingEmail: z.string().trim().lowercase().email("Invalid email"),
  seatLimit: z.number().int().min(1).max(1000).default(25),
});

/* # Update organization */
export const updateOrgSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  logoUrl: z.string().url().max(2000).optional().or(z.literal("")),
  billingEmail: z.string().trim().lowercase().email().optional(),
  seatLimit: z.number().int().min(1).max(1000).optional(),
});

/* # Bulk invite candidates */
export const bulkInviteSchema = z.object({
  invites: z.array(
    z.object({
      email: z.string().trim().lowercase().email("Invalid email"),
      role: z.enum(["candidate", "coach"]).default("candidate"),
      cohort: z.string().trim().max(100).optional(),
    })
  ).min(1, "At least one invite required").max(500, "Maximum 500 invites per request"),
});

/* # Accept invite (public — token-based auth) */
export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Invite token is required").max(256),
});

/* # Update member role */
export const updateMemberSchema = z.object({
  role: z.enum(["candidate", "coach", "admin", "owner"]),
});
```

- [ ] **Step 7: Add org audit events to audit.ts**

In `src/lib/audit.ts`, add to the `AuditEvent` type union:

```typescript
  | "org.created"
  | "org.updated"
  | "org.deleted"
  | "org.member.invited"
  | "org.member.accepted"
  | "org.member.removed"
  | "org.member.role_changed"
  | "employer.created"
  | "employer.updated"
  | "employer.verified"
  | "employer.role.created"
  | "employer.role.published"
  | "employer.role.deleted"
  | "employer.member.added"
  | "employer.member.removed"
```

- [ ] **Step 8: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (existing + new effective-plan test)

- [ ] **Step 9: Commit**

```bash
git add src/lib/effective-plan.ts src/lib/org-handler.ts src/lib/org-validations.ts src/__tests__/effective-plan.test.ts src/lib/audit.ts
git commit -m "feat: add getEffectivePlan, orgHandler, org validation schemas

getEffectivePlan resolves user plan considering org sponsorship.
orgHandler wraps routes with org membership + role checks.
Org Zod schemas enforce input validation on all org routes.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Wire getEffectivePlan into AI Routes

**Files:**
- Modify: `src/app/api/ai/route.ts` (3 lines)
- Modify: `src/app/api/ai/stream/route.ts` (3 lines)
- Modify: `src/app/api/extension/ai/route.ts` (3 lines)

**Interfaces:**
- Consumes: `getEffectivePlan` from `src/lib/effective-plan.ts`
- Produces: AI routes now respect org-sponsored pro entitlements

- [ ] **Step 1: Update `/api/ai/route.ts`**

Add import at top:
```typescript
import { getEffectivePlan } from "@/lib/effective-plan";
```

Replace every occurrence of:
```typescript
const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;
```
with:
```typescript
/* # Use effective plan — considers org sponsorship */
const effectivePlan = await getEffectivePlan(session.user.id);
const limit = PLAN_LIMITS[effectivePlan] ?? PLAN_LIMITS.free;
```

There are 3 occurrences in this file. Replace all 3.

- [ ] **Step 2: Update `/api/ai/stream/route.ts`**

Same pattern — add import, replace `user.plan` reads with `getEffectivePlan()` call. Read the file first to find exact locations.

- [ ] **Step 3: Update `/api/extension/ai/route.ts`**

Same pattern.

- [ ] **Step 4: Run existing AI tests to confirm nothing broke**

Run: `npx vitest run src/__tests__/api-ai.test.ts`
Expected: All existing tests pass

- [ ] **Step 5: Commit**

```bash
git add src/app/api/ai/route.ts src/app/api/ai/stream/route.ts src/app/api/extension/ai/route.ts
git commit -m "feat: wire getEffectivePlan into AI routes for org sponsorship

AI quota now resolves through getEffectivePlan() which checks org
membership. Free users sponsored by a paid org get pro limits.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Org API Routes — Core CRUD

**Files:**
- Create: `src/app/api/org/route.ts`
- Create: `src/app/api/org/[orgId]/route.ts`
- Create: `src/app/api/org/[orgId]/members/route.ts`
- Create: `src/app/api/org/[orgId]/members/[userId]/route.ts`
- Create: `src/app/api/org/[orgId]/members/[userId]/activity/route.ts`
- Test: `src/__tests__/api-org.test.ts`

**Interfaces:**
- Consumes: `orgHandler` from `src/lib/org-handler.ts`, org Zod schemas from `src/lib/org-validations.ts`
- Produces: Full CRUD for orgs and members

- [ ] **Step 1: Write test for org list route**

```typescript
// src/__tests__/api-org.test.ts
import { describe, it, expect, vi } from "vitest";
import { createOrgSchema, updateOrgSchema, bulkInviteSchema } from "@/lib/org-validations";

describe("org validation schemas", () => {
  it("rejects org with invalid slug", () => {
    const result = createOrgSchema.safeParse({
      name: "Test Bootcamp",
      slug: "Invalid Slug!",
      billingEmail: "admin@test.com",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid org creation", () => {
    const result = createOrgSchema.safeParse({
      name: "Northcoders",
      slug: "northcoders",
      type: "bootcamp",
      billingEmail: "admin@northcoders.com",
      seatLimit: 50,
    });
    expect(result.success).toBe(true);
  });

  it("rejects bulk invite over 500", () => {
    /* # 500 is the max to prevent abuse */
    const invites = Array.from({ length: 501 }, (_, i) => ({
      email: `user${i}@example.com`,
    }));
    const result = bulkInviteSchema.safeParse({ invites });
    expect(result.success).toBe(false);
  });

  it("accepts valid bulk invite", () => {
    const result = bulkInviteSchema.safeParse({
      invites: [
        { email: "alice@example.com", role: "candidate", cohort: "March 2027" },
        { email: "bob@example.com" },
      ],
    });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it passes (schema-only test)**

Run: `npx vitest run src/__tests__/api-org.test.ts`
Expected: PASS

- [ ] **Step 3: Create `/api/org` route (GET — list my orgs)**

```typescript
// src/app/api/org/route.ts
/* ============================================================
   ORG LIST — GET /api/org
   ============================================================
   Returns all organizations the authenticated user belongs to.
   Used for the org switcher in the UI.
   ============================================================ */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";

export const GET = authHandler(async (_req, session) => {
  /* # Fetch all orgs this user is a member of */
  const memberships = await dbRetry(() =>
    prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        role: true,
        cohort: true,
        joinedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            plan: true,
            logoUrl: true,
          },
        },
      },
    })
  );

  return NextResponse.json({ organizations: memberships });
});
```

- [ ] **Step 4: Create `/api/org/[orgId]` route (GET + PATCH)**

Read the file location conventions from existing routes, then create this route following the `orgHandler` pattern. GET requires `coach` role, PATCH requires `admin` role. PATCH validates with `updateOrgSchema`.

- [ ] **Step 5: Create `/api/org/[orgId]/members` route (GET)**

GET requires `coach` role. Returns member list with activity summary (application count, resume count, last active). Supports `?cohort=` query param filter.

- [ ] **Step 6: Create `/api/org/[orgId]/members/[userId]` route (GET, PATCH, DELETE)**

GET: coach role — single member detail. PATCH: admin role — change member role (validates with `updateMemberSchema`). DELETE: admin role — remove member. Must invalidate `org:member:` cache on changes.

- [ ] **Step 7: Create `/api/org/[orgId]/members/[userId]/activity` route (GET)**

Coach role. Returns per-candidate activity: AiResult counts by action, Application statuses, last active timestamp. Gated by `dataVisibility` — if `"metrics"`, return counts only, never resume/AI content.

- [ ] **Step 8: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 9: Commit**

```bash
git add src/app/api/org/
git commit -m "feat: add org API routes — list, detail, members, activity

GET /api/org — list user's orgs
GET/PATCH /api/org/[orgId] — org profile
GET /api/org/[orgId]/members — candidate roster
GET/PATCH/DELETE /api/org/[orgId]/members/[userId] — member management
GET /api/org/[orgId]/members/[userId]/activity — per-candidate metrics

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Org Invite Flow + Stats + Export

**Files:**
- Create: `src/app/api/org/[orgId]/invites/route.ts`
- Create: `src/app/api/org/invites/accept/route.ts`
- Create: `src/app/api/org/[orgId]/stats/route.ts`
- Create: `src/app/api/org/[orgId]/export/route.ts`
- Create: `src/lib/invite-email.ts`
- Modify: `src/proxy.ts` (add accept route to public allowlist)
- Modify: `src/app/api/user/delete/route.ts` (cascade memberships)
- Modify: `src/app/api/user/export/route.ts` (include memberships)

**Interfaces:**
- Consumes: `orgHandler`, org Zod schemas, Resend email setup
- Produces: Full invite lifecycle, org stats endpoint, CSV export, public accept route

- [ ] **Step 1: Create invite email template**

```typescript
// src/lib/invite-email.ts
/* ============================================================
   ORG INVITE EMAIL — Sent when a coach/admin invites a candidate
   ============================================================ */

/* # Build the invite email HTML — no emoji (user preference) */
export function buildInviteEmail(params: {
  orgName: string;
  inviterName: string;
  acceptUrl: string;
  role: string;
  cohort?: string;
}): { subject: string; html: string } {
  const { orgName, inviterName, acceptUrl, role, cohort } = params;

  const subject = `${orgName} has invited you to JobPilot AI`;

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1e1b4b; margin-bottom: 8px;">${orgName} has invited you</h2>
      <p style="color: #475569; line-height: 1.6;">
        ${inviterName} has invited you to join ${orgName} on JobPilot AI as a ${role}${cohort ? ` in the ${cohort} cohort` : ""}.
      </p>
      <p style="color: #475569; line-height: 1.6;">
        ${orgName} sponsors your account, giving you access to all Pro features including AI resume optimization,
        cover letter generation, mock interviews, and job tracking.
      </p>
      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        By accepting, ${orgName} can see your activity summary (applications sent, resumes created, features used).
        They cannot see your resume content, AI outputs, or personal notes.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${acceptUrl}" style="background: #4f46e5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Accept Invitation
        </a>
      </div>
      <p style="color: #94a3b8; font-size: 12px;">
        This invitation expires in 14 days. If you did not expect this, you can ignore this email.
      </p>
    </div>
  `;

  return { subject, html };
}
```

- [ ] **Step 2: Create `/api/org/[orgId]/invites` route (GET, POST, DELETE)**

POST requires `admin` role. Validates with `bulkInviteSchema`. For each invite: generate random token, hash with SHA-256, store `OrganizationInvite` with hash, send email via Resend with raw token in the link. GET: list pending/accepted invites. DELETE: revoke a specific invite by ID.

Check seat limit before sending: `currentMembers + pendingInvites < org.seatLimit`.

- [ ] **Step 3: Create `/api/org/invites/accept` route (POST)**

Public route — authenticates by token, not session. Validates with `acceptInviteSchema`. Flow:
1. Hash the provided token
2. Look up `OrganizationInvite` by `tokenHash`
3. Check not expired, not already accepted
4. If user is logged in: create `OrganizationMember` for session user
5. If not logged in but user exists with that email: return redirect to login
6. If no user exists: return redirect to signup with invite token
7. Mark invite as accepted (`acceptedAt = now()`)

- [ ] **Step 4: Add accept route to proxy.ts public allowlist**

In `src/proxy.ts`, find the `isPublic` check block (around line 141) and add:

```typescript
      pathname.startsWith("/api/org/invites/accept") ||
```

This lets the token-based accept endpoint work without a session cookie.

- [ ] **Step 5: Create `/api/org/[orgId]/stats` route (GET)**

Coach role. Returns aggregate stats:
- Total members, active this week, resumes created, applications by status
- Uses `groupBy` queries through OrganizationMember → User joins
- Supports `?cohort=` filter

- [ ] **Step 6: Create `/api/org/[orgId]/export` route (GET)**

Admin role. Returns CSV of roster + metrics. Uses same data as stats but formatted as CSV with `Content-Type: text/csv` and `Content-Disposition: attachment`.

- [ ] **Step 7: Update user delete route — cascade memberships**

In `src/app/api/user/delete/route.ts`, after the soft-delete `prisma.user.update`, add:

```typescript
  /* # Invalidate org membership caches so coaches see updated roster */
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });
  for (const m of memberships) {
    await cacheDel(`org:member:${m.organizationId}:${session.user.id}`);
  }
```

Note: Don't delete the membership rows — they cascade via the User soft-delete/hard-delete flow. Just clear caches.

If user is the sole `owner` of any org, return 409: "Transfer ownership before deleting your account."

- [ ] **Step 8: Update user export route — include memberships**

In `src/app/api/user/export/route.ts`, add org memberships to the export data:

```typescript
  /* # Include org memberships in GDPR export */
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id },
    select: {
      role: true,
      cohort: true,
      joinedAt: true,
      organization: { select: { name: true, type: true } },
    },
  });
```

Add `memberships` to the response JSON.

- [ ] **Step 9: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 10: Commit**

```bash
git add src/app/api/org/ src/lib/invite-email.ts src/proxy.ts src/app/api/user/delete/route.ts src/app/api/user/export/route.ts
git commit -m "feat: org invite flow, stats, export, user cascade

POST /api/org/[orgId]/invites — bulk invite with email
POST /api/org/invites/accept — public token-based accept
GET /api/org/[orgId]/stats — aggregate coach dashboard stats
GET /api/org/[orgId]/export — CSV roster export
User delete now cascades org membership caches + blocks sole owner.
User export includes org memberships.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Coach Dashboard Frontend (6 pages)

**Files:**
- Create: `src/app/org/[orgId]/layout.tsx`
- Create: `src/app/org/[orgId]/page.tsx`
- Create: `src/app/org/[orgId]/candidates/page.tsx`
- Create: `src/app/org/[orgId]/candidates/[userId]/page.tsx`
- Create: `src/app/org/[orgId]/invites/page.tsx`
- Create: `src/app/org/[orgId]/settings/page.tsx`
- Create: `src/app/invite/[token]/page.tsx`
- Modify: `src/proxy.ts` (protect `/org/*` like `/dashboard`)

**Interfaces:**
- Consumes: all `/api/org/*` routes from Tasks 5-6
- Produces: Full coach dashboard UI, invite accept page

- [ ] **Step 1: Add /org protection to proxy.ts**

In `src/proxy.ts`, add `/org` to the dashboard protection block (around line 133):

```typescript
  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/org")) && !isLoggedIn) {
```

- [ ] **Step 2: Create org layout with sidebar navigation**

`src/app/org/[orgId]/layout.tsx` — reuse the existing dashboard shell pattern. Sidebar links: Overview, Candidates, Invites, Settings. Fetch org name from `/api/org` for the header. Show "Sponsored by [Org]" badge.

- [ ] **Step 3: Create overview page**

`src/app/org/[orgId]/page.tsx` — stat cards from `/api/org/[orgId]/stats`: active candidates, resumes created, applications in flight, AI calls used. Activity-over-time chart (simple bar chart, no external library — use SVG). Cohort filter dropdown.

- [ ] **Step 4: Create candidates roster page**

`src/app/org/[orgId]/candidates/page.tsx` — table: name, cohort, last active, resume count, applications by stage. Row click → detail page. Cohort filter. Search by name.

- [ ] **Step 5: Create candidate detail page**

`src/app/org/[orgId]/candidates/[userId]/page.tsx` — activity timeline from `/api/org/[orgId]/members/[userId]/activity`. Pipeline view of application statuses. Respects `dataVisibility` — shows metrics only, never resume content.

- [ ] **Step 6: Create invites management page**

`src/app/org/[orgId]/invites/page.tsx` — form: paste emails (textarea, one per line) or upload CSV. Cohort and role selectors. Pending invites table with status (pending/accepted/expired) and revoke button.

- [ ] **Step 7: Create settings page**

`src/app/org/[orgId]/settings/page.tsx` — edit org name, logo URL, billing email. Seat usage display (X of Y used). Only visible to admin/owner roles.

- [ ] **Step 8: Create invite accept page**

`src/app/invite/[token]/page.tsx` — public page. Shows org name, consent copy ("X sponsors your account and can see your activity summary — never your resume content"), and Accept button. Calls `POST /api/org/invites/accept`. If not logged in, redirects to signup with callback.

- [ ] **Step 9: Test all pages in browser**

Start dev server: `npm run dev`
- Navigate to `/org/[testOrgId]` — should redirect to login if not authenticated
- After login, verify sidebar navigation works
- Verify all pages render without errors
- Test invite accept flow end-to-end

- [ ] **Step 10: Commit**

```bash
git add src/app/org/ src/app/invite/ src/proxy.ts
git commit -m "feat: coach dashboard — 6 pages + invite accept

/org/[orgId] — overview with stat cards
/org/[orgId]/candidates — roster table with cohort filter
/org/[orgId]/candidates/[userId] — activity timeline
/org/[orgId]/invites — bulk invite management
/org/[orgId]/settings — org profile editor
/invite/[token] — public invite accept with consent

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Prisma Schema — Employer + Role + CandidatePreference Models

**Files:**
- Modify: `prisma/schema.prisma` (add 4 models + User back-references)
- Test: Migration runs cleanly

**Interfaces:**
- Consumes: existing schema from Task 2
- Produces: `Employer`, `EmployerMember`, `Role`, `CandidatePreference` models

- [ ] **Step 1: Add Employer, EmployerMember, Role, CandidatePreference models**

Append to `schema.prisma` after the org models. Use the exact definitions from the spec §2.2 (Employer, EmployerMember, Role) and §2.3 (CandidatePreference). Include all indexes.

Add `niceToHaveSkills String?` on Role (per spec audit fix).

- [ ] **Step 2: Add back-references to User model**

After the `memberships` line added in Task 2:

```prisma
  employerMemberships EmployerMember[]
  candidatePreference CandidatePreference?
```

- [ ] **Step 3: Run Prisma migration**

Run: `npx prisma migrate dev --name add-employer-role-models`
Expected: 4 new tables created, no existing tables modified

- [ ] **Step 4: Commit**

```bash
git add prisma/
git commit -m "feat: add Employer, EmployerMember, Role, CandidatePreference models

4 new tables for employer side + candidate preferences.
Only touch on User model is back-references.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: employerHandler + Employer Validations + Taxonomies

**Files:**
- Create: `src/lib/employer-handler.ts`
- Create: `src/lib/employer-validations.ts`
- Create: `src/lib/skills-taxonomy.json`
- Create: `src/lib/industry-taxonomy.json`
- Test: `src/__tests__/employer-validations.test.ts`

**Interfaces:**
- Consumes: `authHandler` from `src/lib/api-handler.ts`, `prisma`, `cacheGet`/`cacheSet`
- Produces: `employerHandler(handler, minRole)`, employer Zod schemas, taxonomy files

- [ ] **Step 1: Create employerHandler**

Same pattern as `orgHandler` but for EmployerMember. Role hierarchy: `recruiter < admin < owner`.

```typescript
// src/lib/employer-handler.ts
/* ============================================================
   EMPLOYER HANDLER — Authorization wrapper for /api/employer/* routes
   ============================================================
   Mirrors orgHandler: resolves EmployerMember for authenticated user
   + empId from URL params. Returns 403 unless role >= minRole.
   Role hierarchy: recruiter < admin < owner
   ============================================================ */
```

Follow the exact same structure as `orgHandler` but use `EmployerMember` and `employerId` instead.

- [ ] **Step 2: Create employer validation schemas**

```typescript
// src/lib/employer-validations.ts
/* ============================================================
   EMPLOYER VALIDATION SCHEMAS — Zod schemas for /api/employer/* routes
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

/* # Update employer profile */
export const updateEmployerSchema = createEmployerSchema.partial();

/* # Create/update role */
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
export const updateRoleSchema = createRoleSchema.partial();

/* # Candidate preferences */
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
  email: z.string().trim().lowercase().email("Invalid email"),
  role: z.enum(["recruiter", "admin", "owner"]).default("recruiter"),
});
```

- [ ] **Step 3: Write validation tests**

```typescript
// src/__tests__/employer-validations.test.ts
import { describe, it, expect } from "vitest";
import { createEmployerSchema, createRoleSchema, candidatePreferenceSchema } from "@/lib/employer-validations";

describe("createEmployerSchema", () => {
  it("rejects employer with invalid slug", () => {
    const result = createEmployerSchema.safeParse({
      name: "Acme Corp",
      slug: "Acme Corp!",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid employer", () => {
    const result = createEmployerSchema.safeParse({
      name: "Acme Corp",
      slug: "acme-corp",
      industry: "Technology",
      size: "startup",
    });
    expect(result.success).toBe(true);
  });
});

describe("createRoleSchema", () => {
  it("rejects salary min > max", () => {
    const result = createRoleSchema.safeParse({
      title: "Engineer",
      description: "Build things",
      salaryMin: 200000,
      salaryMax: 100000,
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid role", () => {
    const result = createRoleSchema.safeParse({
      title: "Senior Software Engineer",
      description: "Build scalable systems",
      salaryMin: 120000,
      salaryMax: 180000,
      locationType: "remote",
    });
    expect(result.success).toBe(true);
  });
});

describe("candidatePreferenceSchema", () => {
  it("accepts minimal preferences", () => {
    const result = candidatePreferenceSchema.safeParse({
      openToWork: true,
    });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 4: Create skills taxonomy JSON**

Create `src/lib/skills-taxonomy.json` with ~200 skills. Structure per spec §20.1 and §20.2:

```json
{
  "synonyms": {
    "React": ["React.js", "ReactJS", "React JS"],
    "Node.js": ["NodeJS", "Node"],
    "TypeScript": ["TS"],
    "JavaScript": ["JS"],
    "Python": ["Python3", "Python 3"],
    "PostgreSQL": ["Postgres", "psql"],
    "Amazon Web Services": ["AWS"],
    "Google Cloud Platform": ["GCP"],
    "Microsoft Azure": ["Azure"],
    "Machine Learning": ["ML"],
    "CI/CD": ["Continuous Integration", "Continuous Deployment", "CI CD"],
    "Next.js": ["NextJS", "Next JS"],
    "Vue.js": ["Vue", "VueJS"],
    "Angular": ["AngularJS", "Angular.js"],
    "Docker": ["Containerization"],
    "Kubernetes": ["K8s"],
    "GraphQL": ["GQL"],
    "REST": ["REST API", "RESTful"],
    "SQL": ["Structured Query Language"],
    "NoSQL": ["Non-relational"],
    "MongoDB": ["Mongo"],
    "Redis": [],
    "Elasticsearch": ["ES", "Elastic"],
    "Terraform": ["TF", "IaC"],
    "Git": ["Version Control"],
    "Agile": ["Scrum", "Kanban"],
    "Java": [],
    "C#": ["CSharp", "C Sharp"],
    "Go": ["Golang"],
    "Rust": [],
    "Swift": [],
    "Kotlin": [],
    "Ruby": [],
    "PHP": [],
    "Figma": [],
    "Tailwind CSS": ["TailwindCSS", "Tailwind"],
    "CSS": ["CSS3"],
    "HTML": ["HTML5"],
    "Sass": ["SCSS"],
    "Linux": ["Unix"],
    "AWS Lambda": ["Lambda", "Serverless"],
    "DynamoDB": ["Dynamo"],
    "S3": ["AWS S3"],
    "Prisma": ["Prisma ORM"],
    "Drizzle": ["Drizzle ORM"]
  },
  "relatedness": {
    "React": { "related": ["Vue.js", "Angular", "Svelte"], "weight": 0.5 },
    "Vue.js": { "related": ["React", "Angular", "Svelte"], "weight": 0.5 },
    "Angular": { "related": ["React", "Vue.js"], "weight": 0.4 },
    "Python": { "related": ["Ruby", "JavaScript"], "weight": 0.3 },
    "Java": { "related": ["Kotlin", "C#"], "weight": 0.5 },
    "PostgreSQL": { "related": ["MySQL", "SQLite", "MongoDB"], "weight": 0.4 },
    "Amazon Web Services": { "related": ["Google Cloud Platform", "Microsoft Azure"], "weight": 0.6 },
    "Docker": { "related": ["Kubernetes", "Podman"], "weight": 0.5 },
    "Next.js": { "related": ["Nuxt", "SvelteKit", "Remix"], "weight": 0.5 },
    "Node.js": { "related": ["Deno", "Bun"], "weight": 0.6 },
    "TypeScript": { "related": ["JavaScript"], "weight": 0.8 },
    "GraphQL": { "related": ["REST"], "weight": 0.3 },
    "Terraform": { "related": ["Pulumi", "CloudFormation"], "weight": 0.5 }
  }
}
```

- [ ] **Step 5: Create industry taxonomy JSON**

Create `src/lib/industry-taxonomy.json`:

```json
{
  "industries": {
    "Technology": { "related": ["Fintech", "Healthtech", "Edtech", "SaaS", "AI/ML"] },
    "Finance": { "related": ["Fintech", "Insurance", "Banking", "Cryptocurrency"] },
    "Healthcare": { "related": ["Healthtech", "Biotech", "Pharma"] },
    "Education": { "related": ["Edtech", "Training", "Academic"] },
    "E-commerce": { "related": ["Retail", "Marketplace", "D2C"] },
    "Media": { "related": ["Entertainment", "Gaming", "Publishing"] },
    "Real Estate": { "related": ["Proptech", "Construction"] },
    "Manufacturing": { "related": ["Automotive", "Aerospace", "Industrial"] },
    "Energy": { "related": ["CleanTech", "Oil & Gas", "Utilities"] },
    "Transportation": { "related": ["Logistics", "Mobility", "Autonomous"] },
    "Consulting": { "related": ["Professional Services", "Advisory"] },
    "Government": { "related": ["Defense", "Public Sector", "Civic Tech"] },
    "Nonprofit": { "related": ["NGO", "Social Impact"] },
    "Telecommunications": { "related": ["Networking", "Infrastructure"] },
    "Agriculture": { "related": ["AgTech", "Food & Beverage"] },
    "Legal": { "related": ["LegalTech", "Compliance"] },
    "Travel": { "related": ["Hospitality", "Tourism"] },
    "Sports": { "related": ["Fitness", "Wellness"] },
    "Fintech": { "related": ["Finance", "Technology", "Cryptocurrency"] },
    "Healthtech": { "related": ["Healthcare", "Technology"] },
    "Edtech": { "related": ["Education", "Technology"] },
    "SaaS": { "related": ["Technology", "Cloud"] },
    "AI/ML": { "related": ["Technology", "Data Science"] },
    "Cybersecurity": { "related": ["Technology", "Defense"] },
    "Data Science": { "related": ["AI/ML", "Analytics"] },
    "DevOps": { "related": ["Technology", "Infrastructure"] },
    "Gaming": { "related": ["Entertainment", "Media"] },
    "Marketplace": { "related": ["E-commerce", "Platform"] },
    "Insurance": { "related": ["Finance", "Insurtech"] }
  }
}
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/__tests__/employer-validations.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/employer-handler.ts src/lib/employer-validations.ts src/lib/skills-taxonomy.json src/lib/industry-taxonomy.json src/__tests__/employer-validations.test.ts
git commit -m "feat: employerHandler, employer validations, skill+industry taxonomies

employerHandler mirrors orgHandler for employer routes.
Employer Zod schemas for all employer/role/preference inputs.
Skills taxonomy: ~50 skills with synonyms + relatedness.
Industry taxonomy: ~30 industries with relatedness.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Employer API Routes

**Files:**
- Create: `src/app/api/employer/route.ts`
- Create: `src/app/api/employer/[empId]/route.ts`
- Create: `src/app/api/employer/[empId]/members/route.ts`
- Create: `src/app/api/employer/[empId]/roles/route.ts`
- Create: `src/app/api/employer/[empId]/roles/[roleId]/route.ts`
- Create: `src/app/api/user/preferences/route.ts`

**Interfaces:**
- Consumes: `employerHandler`, employer Zod schemas, rate limiters
- Produces: Full employer CRUD + role CRUD + candidate preferences

- [ ] **Step 1: Create `/api/employer` route (POST — create employer account)**

```typescript
// src/app/api/employer/route.ts
/* ============================================================
   EMPLOYER ACCOUNT — POST /api/employer
   ============================================================
   Creates a new employer account and adds the creator as owner.
   Rate limited: 3/hour per user to prevent spam.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler } from "@/lib/api-handler";
import { createEmployerSchema } from "@/lib/employer-validations";
import { createRateLimiter } from "@/lib/rate-limit";
import { audit, getClientIp } from "@/lib/audit";
import { dbRetry } from "@/lib/db-retry";

/* # 3 employer accounts per hour per user — prevents spam */
const employerCreateLimit = createRateLimiter({ maxRequests: 3, windowMs: 60 * 60_000 });

export const POST = authHandler(async (req, session) => {
  /* # Rate limit check */
  const { allowed } = await employerCreateLimit.check(session.user.id);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  /* # Validate input */
  const body = await req.json();
  const parsed = createEmployerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
  }

  /* # Check slug uniqueness */
  const existing = await prisma.employer.findFirst({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "This URL slug is already taken" }, { status: 409 });
  }

  /* # Create employer + add creator as owner in a transaction */
  const employer = await dbRetry(() =>
    prisma.$transaction(async (tx) => {
      const emp = await tx.employer.create({
        data: {
          ...parsed.data,
          /* # Not verified yet — admin must verify before role publishing */
        },
      });

      /* # Creator becomes the owner */
      await tx.employerMember.create({
        data: {
          employerId: emp.id,
          userId: session.user.id,
          role: "owner",
        },
      });

      return emp;
    })
  );

  audit("employer.created", {
    userId: session.user.id,
    detail: `Created employer: ${employer.name} (${employer.id})`,
    ip: getClientIp(req.headers),
  });

  return NextResponse.json({ employer }, { status: 201 });
});
```

- [ ] **Step 2: Create `/api/employer/[empId]` route (GET, PATCH)**

GET: any member. Returns employer profile. PATCH: admin role. Validates with `updateEmployerSchema`.

- [ ] **Step 3: Create `/api/employer/[empId]/members` route (GET, POST, DELETE)**

GET: admin role — list team members. POST: admin role — add member by email (validates with `addEmployerMemberSchema`). DELETE: admin role — remove member (cannot remove sole owner).

- [ ] **Step 4: Create `/api/employer/[empId]/roles` route (GET, POST)**

GET: recruiter role — list employer's roles with status filter. POST: recruiter role — create new role. Validates with `createRoleSchema`. Rate limited: 10/day per employer. If employer not verified (`verifiedAt = null`), role is created with `status: "draft"` — cannot publish.

- [ ] **Step 5: Create `/api/employer/[empId]/roles/[roleId]` route (GET, PATCH, DELETE)**

GET: recruiter role. PATCH: recruiter role — update role fields + handle publish action. If PATCH includes `status: "active"` and employer not verified → 403. DELETE: recruiter role — soft-delete (set `status: "cancelled"`). Audit log on publish and delete.

- [ ] **Step 6: Create `/api/user/preferences` route (GET, PUT)**

```typescript
// src/app/api/user/preferences/route.ts
/* ============================================================
   CANDIDATE PREFERENCES — GET/PUT /api/user/preferences
   ============================================================
   Job seeker's preferences for matching. One per user.
   GET returns current preferences (creates default if none).
   PUT creates or updates preferences.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler } from "@/lib/api-handler";
import { candidatePreferenceSchema } from "@/lib/employer-validations";
import { dbRetry } from "@/lib/db-retry";

export const GET = authHandler(async (_req, session) => {
  /* # Fetch or create default preferences */
  let prefs = await prisma.candidatePreference.findUnique({
    where: { userId: session.user.id },
  });

  if (!prefs) {
    /* # Create default preferences on first access */
    prefs = await dbRetry(() =>
      prisma.candidatePreference.create({
        data: { userId: session.user.id },
      })
    );
  }

  return NextResponse.json({ preferences: prefs });
});

export const PUT = authHandler(async (req, session) => {
  const body = await req.json();
  const parsed = candidatePreferenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
  }

  /* # Upsert — create if doesn't exist, update if it does */
  const prefs = await dbRetry(() =>
    prisma.candidatePreference.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, ...parsed.data },
      update: parsed.data,
    })
  );

  return NextResponse.json({ preferences: prefs });
});
```

- [ ] **Step 7: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 8: Commit**

```bash
git add src/app/api/employer/ src/app/api/user/preferences/
git commit -m "feat: employer CRUD, role management, candidate preferences

POST /api/employer — create employer account
GET/PATCH /api/employer/[empId] — employer profile
GET/POST/DELETE /api/employer/[empId]/members — team management
GET/POST /api/employer/[empId]/roles — role list + create
GET/PATCH/DELETE /api/employer/[empId]/roles/[roleId] — role CRUD
GET/PUT /api/user/preferences — candidate job preferences

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 11: Public Routes — Job Board + Company Pages

**Files:**
- Create: `src/app/api/roles/route.ts`
- Create: `src/app/api/roles/[roleId]/route.ts`
- Create: `src/app/api/companies-public/[slug]/route.ts`
- Modify: `src/proxy.ts` (add public routes to allowlist)

**Interfaces:**
- Consumes: Prisma models for Role, Employer
- Produces: Public API for browsing roles and companies without authentication

Note: we use `/api/companies-public/` instead of `/api/companies/` because `/api/companies/` already exists (user's personal company tracking). Different data model entirely.

- [ ] **Step 1: Create `/api/roles` route (GET — public job board)**

Public route — no auth required. Returns active, published roles with pagination. Supports filters: `?location=remote&industry=Technology&employment=full-time&search=react`. Rate limited: 60/min per IP.

Only returns roles from verified employers (`verifiedAt IS NOT NULL`).

- [ ] **Step 2: Create `/api/roles/[roleId]` route (GET — public role detail)**

Public. Returns full role detail with employer company profile (name, logo, description, size). Never returns employer internal data (member list, billing).

- [ ] **Step 3: Create `/api/companies-public/[slug]` route (GET — public company profile)**

Public. Returns employer profile + list of active published roles. Only verified employers are visible.

- [ ] **Step 4: Add to proxy.ts public allowlist**

In `src/proxy.ts`, update the `isPublic` check (around line 141):

```typescript
      pathname.startsWith("/api/roles") ||
      pathname.startsWith("/api/companies-public/") ||
```

Also add to `isPublicApi` rate limit block (around line 96):

```typescript
    pathname.startsWith("/api/roles") ||
    pathname.startsWith("/api/companies-public/")
```

- [ ] **Step 5: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/app/api/roles/ src/app/api/companies-public/ src/proxy.ts
git commit -m "feat: public job board + company profile API routes

GET /api/roles — browse active roles with filters
GET /api/roles/[roleId] — public role detail
GET /api/companies-public/[slug] — public company profile + open roles
Added to proxy.ts public allowlist + IP rate limiting.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 12: Employer + Public Frontend Pages

**Files:**
- Create: `src/app/employer/[empId]/layout.tsx`
- Create: `src/app/employer/[empId]/page.tsx`
- Create: `src/app/employer/[empId]/roles/page.tsx`
- Create: `src/app/employer/[empId]/roles/[roleId]/page.tsx`
- Create: `src/app/employer/[empId]/company/page.tsx`
- Create: `src/app/employer/[empId]/team/page.tsx`
- Create: `src/app/employer/[empId]/billing/page.tsx`
- Create: `src/app/dashboard/preferences/page.tsx`
- Create: `src/app/roles/page.tsx`
- Create: `src/app/roles/[roleId]/page.tsx`
- Create: `src/app/companies-public/page.tsx`
- Create: `src/app/companies-public/[slug]/page.tsx`
- Create: `src/app/(marketing)/for-employers/page.tsx`
- Modify: `src/proxy.ts` (protect `/employer/*`)

**Interfaces:**
- Consumes: all employer + public API routes from Tasks 10-11
- Produces: Full employer dashboard + public marketplace pages + for-employers landing

- [ ] **Step 1: Add /employer protection to proxy.ts**

Extend the dashboard redirect check:

```typescript
  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/org") || pathname.startsWith("/employer")) && !isLoggedIn) {
```

- [ ] **Step 2: Create employer dashboard layout**

`src/app/employer/[empId]/layout.tsx` — sidebar: Overview, Roles, Company Profile, Team, Billing. Show verification status banner if not verified. Match existing dashboard shell styling.

- [ ] **Step 3: Create employer overview page**

`src/app/employer/[empId]/page.tsx` — stat cards: active roles, total matches (placeholder 0 until Phase 4), pipeline summary. Quick-action: "Post a new role" button.

- [ ] **Step 4: Create employer roles page**

`src/app/employer/[empId]/roles/page.tsx` — table of roles: title, status, candidates needed, created date. "Create Role" button opens the AI-assisted role creation form (per spec §19: paste JD, describe it, or template). Status filter tabs: All, Active, Draft, Filled.

- [ ] **Step 5: Create role detail page**

`src/app/employer/[empId]/roles/[roleId]/page.tsx` — role detail + edit form. Shows structured fields from AI extraction. Publish button (checks verification). "Post similar role" button. Matched candidates section (placeholder until Phase 4).

- [ ] **Step 6: Create company profile page**

`src/app/employer/[empId]/company/page.tsx` — edit form for public company profile: name, logo, industry, size, website, description, location, remote-friendly toggle. Preview of how it appears on `/companies-public/[slug]`.

- [ ] **Step 7: Create team management page**

`src/app/employer/[empId]/team/page.tsx` — list team members with roles. Invite by email form. Remove member button (admin only). Role change dropdown.

- [ ] **Step 8: Create billing placeholder page**

`src/app/employer/[empId]/billing/page.tsx` — shows current plan (free). "Upgrade to Pro" and "Upgrade to Enterprise" buttons (disabled with "Coming soon" until Phase 8 builds Stripe integration).

- [ ] **Step 9: Create candidate preferences page**

`src/app/dashboard/preferences/page.tsx` — form for job seekers: openToWork toggle, desired title, skills (tag input), location preference, salary minimum, employment type, preferred industries. Profile completeness indicator. Connected to `PUT /api/user/preferences`.

- [ ] **Step 10: Create public roles page (job board)**

`src/app/roles/page.tsx` — browse all active roles. Search bar + filters (location type, industry, employment type). Card grid: title, company, salary range, location, posted date. Pagination.

- [ ] **Step 11: Create public role detail page**

`src/app/roles/[roleId]/page.tsx` — full role detail. Company card sidebar. "I'm interested" button (login to continue). If logged in, shows match score placeholder.

- [ ] **Step 12: Create public companies page**

`src/app/companies-public/page.tsx` — browse verified employer profiles. Card grid: name, logo, industry, location, open roles count.

- [ ] **Step 13: Create public company detail page**

`src/app/companies-public/[slug]/page.tsx` — company profile + list of open roles. "Follow this company" placeholder button.

- [ ] **Step 14: Create for-employers marketing page**

`src/app/(marketing)/for-employers/page.tsx` — how it works (3 steps), pricing table (Free/Pro/Enterprise from spec §6.1), social proof section (placeholder), CTA "Start hiring" button → signup.

- [ ] **Step 15: Test all pages in browser**

Start dev server and verify:
- Employer dashboard with all pages
- Role creation + publish flow
- Public job board browsing
- Public company profiles
- For-employers landing page
- Preferences page on candidate dashboard
- Mobile responsiveness on all pages

- [ ] **Step 16: Commit**

```bash
git add src/app/employer/ src/app/dashboard/preferences/ src/app/roles/ src/app/companies-public/ src/app/(marketing)/for-employers/ src/proxy.ts
git commit -m "feat: employer dashboard + public marketplace + candidate preferences UI

Employer: overview, role management, company profile, team, billing
Public: job board, role detail, company profiles, for-employers landing
Candidate: job preferences page with openToWork toggle
All pages follow existing dashboard shell + space theme styling.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Scope Note: Phases 4–8

This plan covers Phases 0–3 (~18 days). The remaining phases build on top of this foundation:

- **Phase 4: Matching Engine** — CandidateMatch model, scoring engine, extraction caching, Kanban view. Requires Phase 3 complete.
- **Phase 5: Signals & Messaging** — Bookmarks, MessageThread, notifications. Requires Phase 4.
- **Phase 6: External Sourcing** — GitHub/SO/portfolio integration. Requires Phase 4.
- **Phase 7: AI Recruiting Agent** — Outreach, shortlists, reply classification. Requires Phase 5+6.
- **Phase 8: Employer Billing** — Stripe for employer plans. Requires Phase 7.

Each will get its own implementation plan when Phase 3 is complete.
