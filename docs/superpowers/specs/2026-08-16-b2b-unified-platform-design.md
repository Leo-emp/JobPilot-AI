# JobPilot AI — Unified B2B Platform Design

**Date:** 2026-08-16
**Status:** Design spec — approved for implementation planning
**Scope:** Two B2B pathways that feed each other: Career Services Platform (tool-as-SaaS) + AI Recruiter-as-a-Service (outcome-based)

---

## 0. The Vision

JobPilot becomes a two-sided marketplace with an AI recruiting agent at its center:

- **Supply side (job seekers):** Use JobPilot's tools (resume builder, cover letters, mock interviews, job tracking). Bootcamps and universities onboard their cohorts. All active users with resumes form the candidate pool (opt-out available).
- **Demand side (employers):** Post roles, browse matched candidates, or pay the AI agent to do the full recruiting pipeline end-to-end.
- **The flywheel:** More candidates make the platform more valuable to employers. Employer demand attracts more candidates. Org-sponsored users (bootcamps) seed the supply side. External sourcing (GitHub, resume databases) supplements the pool.

Revenue comes from both sides: orgs pay per-seat for tool access, employers pay tiered pricing for recruiting services.

---

## 1. Four Layers (Build in Order)

### Layer 1: Career Services Platform
Sell tool access to bootcamps, universities, agencies. They pay per-seat. Their students/candidates use JobPilot's existing features. Coaches get a dashboard to track candidate activity and outcomes.

**Already scoped** in `docs/b2b-org-layer-scope.md`. This spec inherits that design (membership overlay, 3 new models, ~13 API routes, coach dashboard). No changes to the org-layer architecture.

### Layer 2: Two-Sided Marketplace
Employer accounts with company profiles and role postings. Public candidate profiles (built on existing Portfolio model). AI-powered matching on both sides. Interest signals and match-triggered messaging.

### Layer 3: AI Recruiting Agent
The full pipeline: employer submits a role, AI sources candidates (internal pool + external), screens, ranks, does outreach, schedules interviews, delivers a shortlist. This is the premium product.

### Layer 4: Social Feed (Deferred)
Posts, engagement, discovery. Built once user base exceeds ~1,000 active users. Not scoped in this document.

---

## 2. Schema Design

### 2.1 Inherited from Org-Layer Scope (Layer 1)

These three models are unchanged from `docs/b2b-org-layer-scope.md`:

- `Organization` — B2B customer (bootcamp, university, agency, outplacement)
- `OrganizationMember` — links User to Organization with role + dataVisibility
- `OrganizationInvite` — time-limited invite tokens for bulk onboarding

### 2.2 New Models — Employer Side (Layer 2)

```prisma
// ---- Employer Account ----
// A company that hires through JobPilot. Separate from Organization
// (which represents career services providers, not hiring companies).
// An employer is the demand side; an org is the supply side.
model Employer {
  id               String    @id @default(cuid())
  name             String                          // Company name
  slug             String    @unique               // Public URL: /companies/{slug}
  industry         String?                         // Tech, Finance, Healthcare, etc.
  size             String?                         // startup, small, medium, large, enterprise
  website          String?                         // Company website
  logoUrl          String?                         // Company logo
  description      String?                         // About the company (public)
  location         String?                         // HQ location
  remoteFriendly   Boolean   @default(false)       // Accepts remote workers
  plan             String    @default("free")      // free, pro, enterprise (employer tiers)
  stripeCustomerId String?                         // Employer Stripe customer
  stripeSubId      String?                         // Employer subscription
  verifiedAt       DateTime?                       // Manual verification timestamp (prevents spam)
  deletedAt        DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  members   EmployerMember[]
  roles     Role[]
  bookmarks EmployerBookmark[]
  threads   MessageThread[]

  @@index([plan])
  @@index([deletedAt])
}

// ---- Employer Member ----
// Links a User to an Employer account with permissions.
// One user can belong to multiple employers (agency recruiters).
model EmployerMember {
  id         String   @id @default(cuid())
  employerId String
  userId     String
  role       String   @default("recruiter")  // owner, admin, recruiter
  createdAt  DateTime @default(now())

  employer Employer @relation(fields: [employerId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([employerId, userId])
  @@index([userId])
  @@index([employerId, role])
}

// ---- Role (Job Posting) ----
// A position the employer wants to fill. This is what the AI agent works on.
model Role {
  id               String    @id @default(cuid())
  employerId       String
  title            String                          // "Senior Software Engineer"
  description      String                          // Full job description
  requirements     String?                         // JSON: parsed structured requirements
  skills           String?                         // JSON: array of required skills (extracted by AI)
  niceToHaveSkills String?                         // JSON: array of nice-to-have skills (bonus scoring, see §19.3)
  experienceMin    Int?                            // Minimum years of experience
  experienceMax    Int?                            // Maximum years (null = no cap)
  salaryMin        Int?                            // Salary range lower bound
  salaryMax        Int?                            // Salary range upper bound
  salaryCurrency   String    @default("USD")
  locationType     String    @default("remote")    // remote, hybrid, onsite
  location         String?                         // Office location (if hybrid/onsite)
  employmentType   String    @default("full-time") // full-time, part-time, contract
  industry         String?                         // Role-specific industry if different from company
  education        String?                         // Required education level
  urgency          String    @default("normal")    // normal, urgent, critical
  status           String    @default("active")    // draft, active, paused, filled, cancelled
  candidatesNeeded Int       @default(1)           // How many hires needed
  publishedAt      DateTime?                       // When made visible to candidates
  filledAt         DateTime?                       // When all positions filled
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  employer    Employer          @relation(fields: [employerId], references: [id], onDelete: Cascade)
  matches     CandidateMatch[]
  shortlists  Shortlist[]

  @@index([employerId])
  @@index([status])
  @@index([locationType])
  @@index([status, publishedAt])
}
```

### 2.3 New Models — Matching & Pipeline (Layer 2 + 3)

```prisma
// ---- Candidate Match ----
// AI-generated match between a candidate and a role. The core scoring record.
// Created by the matching engine (batch or on-demand).
// NOTE: Exactly one of candidateId or externalId must be set (never both, never neither).
// Enforced at the API/service layer — Prisma can't express XOR constraints.
model CandidateMatch {
  id              String   @id @default(cuid())
  roleId          String
  candidateId     String?                          // User ID (null for external candidates)
  externalId      String?                          // ExternalCandidate ID (null for internal)
  score           Int                              // Overall match score 0-100
  scoreBreakdown  String                           // JSON: per-dimension scores
  aiSummary       String?                          // 2-3 sentence AI explanation
  source          String   @default("internal")    // internal, github, portfolio, resume_db
  status          String   @default("matched")     // matched, shortlisted, contacted, responded,
                                                   // interviewing, offered, hired, rejected, withdrawn
  statusNote      String?                          // Reason for status change
  contactedAt     DateTime?                        // When outreach was sent
  respondedAt     DateTime?                        // When candidate responded
  interviewAt     DateTime?                        // Scheduled interview time
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  role              Role               @relation(fields: [roleId], references: [id], onDelete: Cascade)
  candidate         User?              @relation(fields: [candidateId], references: [id], onDelete: SetNull)
  externalCandidate ExternalCandidate? @relation(fields: [externalId], references: [id], onDelete: SetNull)
  shortlistEntries  ShortlistEntry[]

  @@unique([roleId, candidateId])                  // One match per candidate per role (internal)
  @@unique([roleId, externalId])                   // One match per external candidate per role
  @@index([candidateId])
  @@index([roleId, score])
  @@index([roleId, status])
  @@index([status])
}

// ---- External Candidate ----
// A person found outside JobPilot (GitHub, portfolio sites, resume databases).
// Stored separately until they accept an invite and become a User.
model ExternalCandidate {
  id          String    @id @default(cuid())
  name        String                               // Full name
  email       String?                              // Contact email (if found)
  profileUrl  String                               // Source URL (GitHub profile, portfolio, etc.)
  source      String                               // github, stackoverflow, portfolio, indeed_resume, monster
  skills      String?                              // JSON: extracted skills
  experience  String?                              // JSON: parsed experience summary
  rawData     String?                              // JSON: full scraped/fetched profile data
  convertedUserId String?  @unique                 // Links to User if they join JobPilot
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  matches CandidateMatch[]

  @@unique([source, profileUrl])                   // Deduplicate by source + URL
  @@index([email])
  @@index([convertedUserId])
}

// ---- Shortlist ----
// A delivered set of candidates for a role. This is the "product" employers pay for.
// Uses ShortlistEntry junction table for referential integrity (see §22).
model Shortlist {
  id          String   @id @default(cuid())
  roleId      String
  name        String   @default("Shortlist")       // "Round 1", "Final candidates", etc.
  status      String   @default("draft")           // draft, delivered, reviewed
  deliveredAt DateTime?
  createdAt   DateTime @default(now())

  role    Role              @relation(fields: [roleId], references: [id], onDelete: Cascade)
  entries ShortlistEntry[]

  @@index([roleId])
}

// ---- Shortlist Entry ----
// Junction table linking shortlists to candidate matches with sort order and notes.
model ShortlistEntry {
  id              String @id @default(cuid())
  shortlistId     String
  candidateMatchId String
  position        Int                              // Sort order in the shortlist
  employerNote    String?                          // Employer's note about this candidate

  shortlist      Shortlist      @relation(fields: [shortlistId], references: [id], onDelete: Cascade)
  candidateMatch CandidateMatch @relation(fields: [candidateMatchId], references: [id], onDelete: Cascade)

  @@unique([shortlistId, candidateMatchId])        // No duplicate entries
  @@index([shortlistId, position])
}

// ---- Candidate Preference ----
// What a job seeker is looking for. Powers the reverse matching (role → candidate).
// Filled during onboarding or settings. One per user.
model CandidatePreference {
  id              String   @id @default(cuid())
  userId          String   @unique
  openToWork      Boolean  @default(true)          // Master toggle for pool visibility
  desiredTitle    String?                          // "Software Engineer", "Product Manager"
  desiredSkills   String?                          // JSON: skills they want to use
  locationPref    String   @default("remote")      // remote, hybrid, onsite, any
  locations       String?                          // JSON: preferred cities/countries
  salaryMin       Int?                             // Minimum acceptable salary
  salaryCurrency  String   @default("USD")
  employmentType  String   @default("full-time")   // full-time, part-time, contract, any
  industries      String?                          // JSON: preferred industries
  companySizes    String?                          // JSON: preferred company sizes
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 2.4 New Models — Communication (Layer 2 + 3)

```prisma
// ---- Interest Signal (Bookmark) ----
// Employer bookmarks a candidate, or candidate bookmarks an employer/role.
// Mutual interest = unlocked contact info + messaging.
model EmployerBookmark {
  id           String   @id @default(cuid())
  employerId   String
  candidateId  String                              // User ID of the candidate
  roleId       String?                             // Specific role context (optional)
  createdAt    DateTime @default(now())

  employer  Employer @relation(fields: [employerId], references: [id], onDelete: Cascade)
  candidate User     @relation(fields: [candidateId], references: [id], onDelete: Cascade)

  @@unique([employerId, candidateId])
  @@index([candidateId])
}

// Note: At least one of employerId or roleId must be set.
// Prisma can't enforce this — validated at the API layer via Zod:
//   z.object({ employerId: z.string().optional(), roleId: z.string().optional() })
//    .refine(d => d.employerId || d.roleId, "Must bookmark a company or role")
model CandidateBookmark {
  id           String   @id @default(cuid())
  userId       String
  employerId   String?                             // Bookmarked company
  roleId       String?                             // Bookmarked specific role
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, employerId])
  @@unique([userId, roleId])
  @@index([employerId])
  @@index([roleId])
}

// ---- Message Thread ----
// A conversation between a candidate and an employer, optionally tied to a role.
// Created on mutual interest or employer initiation (enterprise tier).
// Full design in §21.
model MessageThread {
  id           String    @id @default(cuid())
  candidateId  String                              // The candidate in this conversation
  employerId   String                              // The employer in this conversation
  roleId       String?                             // Optionally scoped to a specific role
  status       String    @default("active")        // active, archived, blocked
  blockedById  String?                             // User who blocked (candidate or employer member)
  lastMessageAt DateTime?                          // For sort order in inbox
  createdAt    DateTime  @default(now())

  candidate User     @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  employer  Employer @relation(fields: [employerId], references: [id], onDelete: Cascade)
  messages  Message[]

  @@unique([candidateId, employerId, roleId])      // One thread per candidate-employer-role triple
  @@index([candidateId, lastMessageAt])            // Candidate inbox sorted by recency
  @@index([employerId, lastMessageAt])             // Employer inbox sorted by recency
}

// ---- Message ----
// Match-triggered messaging between employer and candidate.
// Not open DMs — requires mutual interest or an active match.
// Belongs to a MessageThread (not bare string threadId). Full design in §21.
model Message {
  id          String   @id @default(cuid())
  threadId    String                               // FK to MessageThread
  senderId    String                               // User ID of sender
  senderType  String                               // "candidate" or "employer"
  content     String                               // Message text (max 5000 chars)
  readAt      DateTime?
  createdAt   DateTime @default(now())

  thread MessageThread @relation(fields: [threadId], references: [id], onDelete: Cascade)

  @@index([threadId, createdAt])
  @@index([senderId])
}

// ---- Outreach ----
// AI-generated recruiting emails sent to external candidates.
// Tracks delivery, opens, and responses for the pipeline.
// NOTE: roleId, externalCandidateId, candidateMatchId are intentionally bare strings
// (no @relation) so outreach audit trail survives if the role/candidate/match is deleted.
// Referential lookups use manual queries, not Prisma joins.
model Outreach {
  id                String    @id @default(cuid())
  roleId            String                         // Which role this outreach is for
  externalCandidateId String?                      // External candidate
  candidateMatchId  String?                        // Link to the CandidateMatch
  email             String                         // Recipient email
  subject           String                         // Email subject
  body              String                         // Email body (personalized by AI)
  status            String    @default("queued")   // queued, sent, delivered, opened, replied, bounced
  sentAt            DateTime?
  openedAt          DateTime?
  repliedAt         DateTime?
  inviteToken       String?   @unique              // Platform invite token (hashed)
  createdAt         DateTime  @default(now())

  @@index([roleId])
  @@index([externalCandidateId])
  @@index([status])
}
```

### 2.5 Modifications to Existing Models

```prisma
// Add to User model:
  candidatePreference CandidatePreference?
  employerMemberships EmployerMember[]
  candidateMatches    CandidateMatch[]
  employerBookmarks   EmployerBookmark[]    // Bookmarks received from employers
  candidateBookmarks  CandidateBookmark[]   // Bookmarks the user gave
  candidateThreads    MessageThread[]       // Messaging threads as a candidate
  notifications       Notification[]        // In-app notifications
  emailNotifications  Boolean @default(true) // Opt-out for transactional notification emails
  // existing: memberships OrganizationMember[] (from org-layer scope)
```

No existing columns are changed. All additions are relation back-references.

---

## 3. Matching Engine

### 3.1 Scoring Dimensions

The matching engine produces a 0-100 score by comparing structured candidate data against structured role data. The AI extracts; the code scores.

| Dimension | Weight | How it's measured |
|---|---|---|
| **Skills match** | 30% | Fuzzy match of candidate skills vs required skills. Exact = 100%, related (e.g. React/Next.js) = 70%, missing = 0%. Score = (matched skill points / total required points) * 100 |
| **Experience level** | 20% | Candidate years vs role range. Within range = 100%. Each year over/under = -15%. Cap at 0%. |
| **Industry fit** | 10% | Same industry = 100%. Related industry = 60%. Unrelated = 20%. |
| **Education** | 10% | Meets requirement = 100%. One level below = 60%. Bootcamp counts as equivalent for roles that accept it. |
| **Location/remote** | 10% | Perfect match (both remote, or same city) = 100%. Timezone overlap = 70%. Requires relocation = 30%. |
| **Salary alignment** | 10% | Full overlap = 100%. Partial overlap = proportional. No overlap = 0%. Unknown salary on either side = 70% (neutral). |
| **Culture signals** | 5% | Company size preference match, work style alignment. Derived from CandidatePreference + application history patterns. |
| **Recency** | 5% | Active in last 7 days = 100%. 30 days = 70%. 90 days = 40%. 90+ days = 10%. |

**Overall score** = weighted sum of dimension scores, rounded to integer.

### 3.2 Scoring Flow

```
1. EXTRACT (AI — runs once per resume/JD, cached)
   Resume → Gemini → { skills[], experience: {years, titles[]}, education, industry, location }
   JD     → Gemini → { requiredSkills[], niceToHaveSkills[], experience: {min, max}, education, location, salary }

2. SCORE (deterministic code — runs per candidate-role pair)
   For each dimension: compute dimension_score (0-100)
   overall = sum(dimension_score * weight)

3. EXPLAIN (AI — runs for top candidates only)
   Top 20 matches → Gemini → "Strong match: 8/10 required skills, 3 years over minimum, salary aligned."

4. STORE
   CandidateMatch { roleId, candidateId, score, scoreBreakdown: JSON, aiSummary }
```

### 3.3 When Scoring Runs

- **On role publish:** batch score all eligible candidates (openToWork = true, not deleted) against the new role. Start with internal pool, then external sources.
- **On resume upload/update:** re-score candidate against all active roles they haven't been matched to.
- **On demand:** employer clicks "refresh matches" on a role.
- **Nightly cron:** re-score candidates whose recency score has decayed.

### 3.4 Reverse Matching (Roles for Candidates)

Same engine, different weights. When a candidate logs in, show "Top roles for you":

| Dimension | Weight (reverse) |
|---|---|
| Skills match | 25% |
| Salary alignment | 20% |
| Location/remote | 20% |
| Experience level | 15% |
| Industry fit | 10% |
| Company size pref | 5% |
| Role recency (days posted) | 5% |

Scores stored on the same `CandidateMatch` row — one row serves both directions.

---

## 4. External Candidate Sourcing

### 4.1 Sources (v1)

| Source | Method | What we get | Rate limits |
|---|---|---|---|
| **GitHub** | Public API (`/search/users`, `/users/{name}`) | Name, bio, repos, languages, contributions, email (if public), location | 30 req/min (unauthenticated), 5000/hr (with token) |
| **Stack Overflow** | Public API (`/users`) | Name, tags, reputation, location, website | 300 req/day (with key) |
| **Personal portfolios** | Gemini web search + scrape | Name, skills, projects, contact info | Gemini API limits |
| **Resume databases** | Indeed Resume API, Monster API | Full resume data, contact info | Per contract (apply for access) |

### 4.2 Sourcing Flow

```
1. Employer publishes a role
2. Internal matching runs first (fast, free)
3. If fewer than N quality matches (score >= 70) found internally:
   a. AI generates search queries from the JD
      e.g. "senior react engineer" → GitHub: "react language:typescript location:remote followers:>10"
   b. Fetch profiles from each source
   c. Parse into ExternalCandidate records (deduplicate by source + profileUrl)
   d. Score against the role using the same engine
   e. Top external matches added to CandidateMatch with source = "github" / "portfolio" / etc.
4. Results merged with internal matches, ranked by score
```

### 4.3 External Candidate → User Conversion

When the AI agent does outreach to an external candidate:

1. Personalized email sent via Resend: "A company is looking for [role] and your profile is a strong match. Join JobPilot to connect."
2. Email contains an invite link with a hashed token
3. Candidate clicks → signup page pre-filled with their extracted data
4. On signup: `ExternalCandidate.convertedUserId` set to new User ID
5. All their `CandidateMatch` records update `candidateId` to the new User ID
6. They're now an internal candidate — part of the pool permanently

This is the flywheel: every external sourcing run potentially adds users to the platform.

---

## 5. AI Recruiting Agent Pipeline

The full end-to-end pipeline for "give us the job, we give you candidates."

### 5.1 Pipeline Stages

```
INTAKE → SOURCE → SCREEN → RANK → OUTREACH → SCHEDULE → DELIVER
```

| Stage | What happens | Automated? | AI involved? |
|---|---|---|---|
| **Intake** | Employer submits role. AI parses JD into structured requirements. Employer reviews/edits. | Yes | Yes (extraction) |
| **Source** | Search internal pool + external sources. Create CandidateMatch records. | Yes | Yes (search queries) |
| **Screen** | Filter out clearly unqualified (score < 40). Flag edge cases for employer review. | Yes | No (deterministic) |
| **Rank** | Sort by score. AI generates summary for top 20. | Yes | Yes (summaries) |
| **Outreach** | AI writes personalized emails to top candidates. Sends via Resend. Tracks opens/replies. | Yes | Yes (email writing) |
| **Schedule** | Candidates who respond get a scheduling link (Calendly integration or built-in). | Semi-auto | No |
| **Deliver** | Package shortlist: candidate profiles, scores, AI summaries, response status. Notify employer. | Yes | Yes (final report) |

### 5.2 Pipeline State Machine

Each `Role` has an implicit pipeline state derived from its `CandidateMatch` statuses:

```
Role.status = "active"
  └→ CandidateMatch records created (status: "matched")
     └→ Top candidates shortlisted (status: "shortlisted")
        └→ Outreach sent (status: "contacted")
           └→ Candidate responds (status: "responded")
              └→ Interview scheduled (status: "interviewing")
                 └→ Offer made (status: "offered")
                    └→ Hired (status: "hired") → Role.status = "filled"
```

Employers see a Kanban-style pipeline view of their candidates moving through stages.

### 5.3 Outreach Email Design

The AI writes personalized outreach using:
- Candidate's profile data (skills, projects, experience)
- Role details (title, company, what makes it interesting)
- Company info (culture, size, mission)

Template structure:
```
Subject: [Company] is looking for a [Title] — your [specific skill/project] caught our attention

Body:
- Personal hook (reference a specific project/contribution)
- Role pitch (2-3 sentences on why this role is interesting)
- Company pitch (1-2 sentences)
- CTA: "Interested? [Join JobPilot to connect] or [Reply to this email]"
- Clear opt-out link (CAN-SPAM/GDPR compliance)

Sender: noreply@jobpilotai.co (or a branded sender if employer is on enterprise)
```

Rate limits on outreach:
- Max 50 emails per role per day (avoid spam flags)
- Max 2 follow-ups per candidate (spaced 3 and 7 days)
- Candidate can opt out globally — added to suppression list

---

## 6. Employer Tiers & Revenue Model

### 6.1 Employer Plans

| Feature | Free | Pro ($299/mo) | Enterprise ($999/mo) |
|---|---|---|---|
| Company profile page | Yes | Yes | Yes |
| Post roles | 1 active | 5 active | Unlimited |
| Browse candidate profiles | Limited (name + skills only) | Full profiles + scores | Full + AI summaries |
| AI matching | Basic (top 10) | Full ranked list | Full + external sourcing |
| Shortlist delivery | No | Yes (internal only) | Yes (internal + external) |
| AI outreach | No | No | Yes (full agent pipeline) |
| Interview scheduling | No | No | Yes |
| Dedicated support | No | Email | Priority + Slack |
| Candidate bookmarks | 5/month | 50/month | Unlimited |
| Messaging | Mutual interest only | Mutual interest only | Direct message any match |

### 6.2 Organization Plans (Career Services — unchanged)

From existing B2B scope:
- **Pilot:** manual invoicing, up to 25 seats
- **Team:** $500-1,000/month, up to 50 seats
- **Business:** $1,500-3,000/month, up to 200 seats, analytics, exports

### 6.3 Revenue Math

| Scenario | Revenue |
|---|---|
| 10 bootcamps × $500/mo avg | $5,000/mo |
| 50 employers on Pro × $299/mo | $14,950/mo |
| 5 employers on Enterprise × $999/mo | $4,995/mo |
| B2C Pro subscribers (existing) | Variable |
| **Total potential** | **$25K+/mo** |

---

## 7. API Surface

### 7.1 Employer Routes (new, all under `/api/employer/`)

| Route | Methods | Auth | Purpose |
|---|---|---|---|
| `/api/employer` | POST | authenticated user | Create employer account |
| `/api/employer/[empId]` | GET, PATCH | member | Company profile |
| `/api/employer/[empId]/members` | GET, POST, DELETE | admin | Team management |
| `/api/employer/[empId]/roles` | GET, POST | recruiter | List/create roles |
| `/api/employer/[empId]/roles/[roleId]` | GET, PATCH, DELETE | recruiter | Role CRUD |
| `/api/employer/[empId]/roles/[roleId]/matches` | GET | recruiter | View matched candidates |
| `/api/employer/[empId]/roles/[roleId]/shortlist` | GET, POST | recruiter | Manage shortlists |
| `/api/employer/[empId]/roles/[roleId]/outreach` | POST, GET | recruiter (enterprise) | Trigger/view AI outreach |
| `/api/employer/[empId]/bookmarks` | GET, POST, DELETE | recruiter | Candidate bookmarks |
| `/api/employer/[empId]/messages` | GET, POST | recruiter | Messaging (mutual interest) |
| `/api/employer/[empId]/billing/checkout` | POST | owner | Stripe checkout |
| `/api/employer/[empId]/billing/portal` | POST | owner | Stripe billing portal |

### 7.2 Candidate Routes (additions to existing)

| Route | Methods | Auth | Purpose |
|---|---|---|---|
| `/api/user/preferences` | GET, PUT | authenticated | Candidate preferences (openToWork, salary, location, etc.) |
| `/api/user/matches` | GET | authenticated | Roles matched to this candidate |
| `/api/user/bookmarks` | GET, POST, DELETE | authenticated | Employer/role bookmarks |
| `/api/user/messages` | GET, POST | authenticated | Messages (mutual interest) |

### 7.3 Public Routes

| Route | Methods | Auth | Purpose |
|---|---|---|---|
| `/api/roles` | GET | public | Browse active roles (with filters) |
| `/api/roles/[roleId]` | GET | public | Role detail |
| `/api/companies/[slug]` | GET | public | Public company profile |
| `/api/candidates/[slug]` | GET | public (limited) | Public candidate profile (from Portfolio) |

### 7.4 Internal/Cron Routes

| Route | Methods | Purpose |
|---|---|---|
| `/api/cron/matching` | POST | Nightly batch matching + recency decay |
| `/api/cron/outreach` | POST | Process outreach queue (send emails, track delivery) |
| `/api/cron/source-external` | POST | Run external sourcing for roles with insufficient internal matches |

### 7.5 Inherited from Org-Layer Scope

All 13 `/api/org/*` routes as specified in `docs/b2b-org-layer-scope.md`.

---

## 8. Frontend Pages

### 8.1 Employer Dashboard (`/employer/[empId]/`)

| Page | Purpose |
|---|---|
| `/employer/[empId]` | Overview: active roles, pipeline summary, recent matches |
| `/employer/[empId]/roles` | Role management: list, create, edit |
| `/employer/[empId]/roles/[roleId]` | Role detail: matched candidates (Kanban pipeline view), shortlists |
| `/employer/[empId]/roles/[roleId]/outreach` | Outreach status: sent, opened, replied, scheduled |
| `/employer/[empId]/company` | Company profile editor (public page) |
| `/employer/[empId]/team` | Team member management |
| `/employer/[empId]/billing` | Subscription management |
| `/employer/[empId]/messages` | Conversations with candidates |

### 8.2 Candidate Additions (to existing dashboard)

| Page | Purpose |
|---|---|
| `/dashboard/opportunities` | Roles matched to you, sorted by score |
| `/dashboard/preferences` | Set job preferences (title, salary, location, etc.) |
| `/dashboard/bookmarks` | Companies/roles you've bookmarked + mutual interests |
| `/dashboard/messages` | Conversations with employers |

### 8.3 Public Pages

| Page | Purpose |
|---|---|
| `/companies` | Browse employer profiles |
| `/companies/[slug]` | Company profile + open roles |
| `/roles` | Browse all active roles (job board) |
| `/roles/[roleId]` | Role detail + "I'm interested" button |
| `/for-employers` | Marketing page: how it works, pricing, signup |
| `/p/[slug]` | Existing portfolio (now also serves as public candidate profile) |

---

## 9. Consent & Privacy

### 9.1 Candidate Pool Consent

- **Default:** All active users with resumes are in the pool (`openToWork = true` by default).
- **Opt-out:** Users can toggle `openToWork = false` in `/dashboard/preferences`. This removes them from all matching immediately.
- **ToS update:** Required. New clause: "By using JobPilot, you agree that your profile information (skills, experience, education) may be visible to employers searching for candidates. Your resume content is never shared without your explicit consent."
- **Profile visibility levels:**
  - `openToWork = false` → invisible to employers entirely
  - `openToWork = true` → name, skills, experience summary, portfolio link visible
  - Resume content is NEVER shared — employers see structured data only unless the candidate explicitly shares it via messaging

### 9.2 Org-Sponsored Candidates

From org-layer scope: `dataVisibility = "metrics"` by default. Org coaches see activity counts, not content. No change needed — this is orthogonal to employer visibility.

### 9.3 External Candidate Privacy

- Outreach emails must include: clear sender identity, why they're being contacted, opt-out link
- One-click opt-out adds email to global suppression list
- External candidate data retained for 90 days if no response; deleted automatically by GDPR cleanup cron
- If candidate joins platform, they're governed by standard ToS

### 9.4 Employer Access Controls

- Free tier: see candidate name + skills only (no email, no resume, no contact)
- Pro tier: full profile + score breakdown (still no direct contact unless mutual interest)
- Enterprise tier: can message any matched candidate directly
- Mutual interest: both parties bookmarked each other → contact info unlocked for both

---

## 10. Phased Build Plan

### Phase 0: Pre-Pilot Fixes (~1 day)
From org-layer scope. Do regardless:
- Fix enterprise plan falling through to free limits
- Timing-safe cron secret comparison
- 2FA enforcement in API routes
- Scope funnel-events endpoint

### Phase 1: Org Core (~3-4 days)
From org-layer scope:
- 3 new models (Organization, OrganizationMember, OrganizationInvite)
- orgHandler + role checks
- Invite flow (create, accept, email)
- getEffectivePlan() wired into AI routes
- User delete/export/GDPR touches

### Phase 2: Coach Dashboard (~4-5 days)
From org-layer scope:
- /api/org/* read surface (stats, members, activity, export)
- 5 coach dashboard pages
- Candidate-side invite accept + "Sponsored by" badge
**Milestone: pilot-ready for bootcamps/universities**

### Phase 3: Employer Foundation (~6-8 days)
New:
- Employer, EmployerMember, Role models + migration
- `employerHandler` authorization wrapper (mirrors orgHandler)
- Employer signup flow ("I'm hiring" toggle, not separate signup)
- Guided employer onboarding (company name, logo, industry, description)
- Manual verification flow + "Verification pending" banner UX
- AI-assisted role creation (paste JD / describe / template → AI extraction → review)
- Nice-to-have skills bonus scoring (+5 max)
- Role CRUD (create, edit, publish, "Post similar role" template copy) with Zod validation
- CandidatePreference model + settings page (openToWork toggle + profile completeness indicator)
- Skills taxonomy JSON file (~200 skills with synonyms + relatedness)
- Industry taxonomy JSON file (~30 industries with relatedness)
- Public pages: /companies, /roles, /for-employers
- Rate limiting on new public routes (anti-scraping)
- ToS update with candidate pool visibility clause

### Phase 4: Matching Engine (~5-6 days)
New:
- CandidateMatch model
- Structured extraction (resume → JSON, JD → JSON) via Gemini with extraction caching
- Deterministic scoring engine (8 dimensions + nice-to-have bonus)
- Pre-filter optimization (skill reverse index to narrow candidate pool before scoring)
- Batch matching on role publish + incremental re-scoring on resume update
- Employer match feedback (thumbs up/down on candidates → feeds future scoring)
- /dashboard/opportunities (candidate side with pipeline status visibility + hide/withdraw)
- /employer/[empId]/roles/[roleId] matches view (employer side, Kanban pipeline)
- Candidate pipeline visibility mapping (internal status → candidate-facing label)
- 0-matches auto-trigger external sourcing notification
**Milestone: two-sided marketplace functional**

### Phase 5: Interest Signals & Messaging (~4-5 days)
New:
- EmployerBookmark, CandidateBookmark models (with validation: at least one of employerId/roleId required)
- Mutual interest detection + auto-thread creation + notification trigger
- MessageThread model + Message model (proper threading, not bare string threadId)
- Thread creation rules (mutual interest, enterprise direct, candidate response-only)
- Block/report functionality (blocked employer can't message or view candidate)
- Notification model + bell icon dropdown (both dashboards)
- Messaging UI with inbox sorted by recency, unread count badge
- Rate limiting on messaging endpoints
- Coach dashboard "Placement Activity" card (aggregate cross-visibility)

### Phase 6: External Sourcing (~4-5 days)
New:
- ExternalCandidate model
- GitHub API integration
- Stack Overflow API integration
- Portfolio web search via Gemini
- Sourcing flow: generate queries → fetch → parse → score → merge
- External → User conversion on signup

### Phase 7: AI Recruiting Agent (~6-8 days)
New:
- Outreach model + EmailSuppression model
- Source-specific AI email prompts (GitHub → reference repos, portfolio → reference projects, SO → reference answers)
- Internal candidate outreach via in-app notification + email (not Outreach model — they're already on platform)
- AI email generation (personalized per candidate, validated for opt-out link)
- Outreach queue + send cron (15-min interval, 20 emails/batch, suppression check before every send)
- Open/reply tracking (Resend webhooks)
- AI reply classification (positive/negative/neutral) with fallback to manual employer review on uncertain
- Follow-up automation (3-day, 7-day, max 2 follow-ups, skip if negative reply detected)
- Shortlist model with ShortlistEntry junction table (referential integrity, sort order, employer notes)
- Shortlist delivery + CSV/PDF export
- Pipeline Kanban view for employers
- Bounce rate monitoring + auto-pause at > 10% + admin alert
- Role deletion cancels all queued outreach
**Milestone: full recruiter-as-a-service operational**

### Phase 8: Employer Billing (~2-3 days)
New:
- Employer Stripe products (free/pro/enterprise)
- Checkout + webhook handling for employer plans
- Feature gating by plan tier (server-side enforcement)
- Usage tracking (roles posted, candidates contacted, outreach sent)
- B2B metrics tab in admin dashboard (pool size, match rates, outreach stats, revenue)

### Phase 9: Resume Database Integration (deferred)
- Apply for Indeed Resume API access
- Apply for Monster API access
- Integration + candidate parsing
- Requires commercial agreements — timeline dependent on approval

### Phase 10: Social Feed (deferred)
- Posts, likes, comments
- Connection system
- Content feed algorithm
- Only after 1,000+ active users

---

## 11. Total Estimated Effort

| Phase | Days | Cumulative |
|---|---|---|
| 0: Pre-pilot fixes | 1 | 1 |
| 1: Org core | 3-4 | 5 |
| 2: Coach dashboard | 4-5 | 10 |
| 3: Employer foundation | 6-8 | 18 |
| 4: Matching engine | 5-6 | 24 |
| 5: Signals & messaging | 4-5 | 29 |
| 6: External sourcing | 4-5 | 34 |
| 7: AI recruiting agent | 6-8 | 42 |
| 8: Employer billing | 2-3 | 45 |
| **Total to full platform** | **~40-50 days** | |

### Key Milestones

- **Day 10:** Pilot-ready for bootcamps (sell while building the rest)
- **Day 24:** Two-sided marketplace live (employers can find candidates, candidates see matched roles)
- **Day 34:** External sourcing live (GitHub, portfolios, Stack Overflow)
- **Day 42:** Full AI recruiting agent operational (outreach, scheduling, shortlists)
- **Day 45:** Revenue from both sides flowing

---

## 12. Technical Decisions

### 12.1 Database
Stay on Turso (SQLite) for now. The new models are additive. Monitor write contention as matching jobs increase — if batch scoring at 1000+ candidates causes lock contention, that's the trigger to evaluate Postgres migration.

### 12.2 Matching Engine Location
Run scoring in Next.js API routes (not a separate service). The deterministic scoring is CPU-light. Gemini extraction calls are the bottleneck — cache aggressively (resume extraction cached until resume changes, JD extraction cached per role).

### 12.3 Outreach Queue
Use Vercel Cron (existing pattern) to process the outreach queue every 15 minutes. Each run sends up to 20 emails via Resend. No external queue service needed at this scale.

### 12.4 External Sourcing
Run as a background cron, not real-time. Employer publishes role → internal matches shown immediately → external sourcing runs async → results merged within 1-2 hours.

### 12.5 Search
For candidate/role search with filters: start with Prisma queries + indexes. If full-text search is needed, add SQLite FTS5 or evaluate Meilisearch. Defer until query performance shows it's needed.

---

## 13. Security & Authorization Hardening

Every new surface must match the production-grade standard of the existing 54 routes.

### 13.1 Employer Route Authorization

New `employerHandler` wrapper (mirrors `orgHandler` from org-layer scope):

```
employerHandler(handler, minRole)
  → authHandler (existing: session + 401)
  → resolve EmployerMember for (session.user.id, params.empId)
  → 403 unless role >= minRole   (recruiter < admin < owner)
  → Redis cache "employer:member:{empId}:{userId}" 60s
```

- All `/api/employer/[empId]/*` routes wrapped in `employerHandler`
- Employer verification check: unverified employers (`verifiedAt = null`) can create roles but not publish them (prevents spam job postings)
- Plan-tier feature gating enforced server-side (not just UI): outreach routes return 403 for non-enterprise, external sourcing returns 403 for free tier

### 13.2 Candidate Data Isolation

- Employer routes NEVER return raw resume content — only structured extraction (skills, experience summary, education)
- `/api/employer/[empId]/roles/[roleId]/matches` filters by `openToWork = true` on every query
- Candidate email/phone only returned when mutual interest exists (both bookmarked each other) or candidate explicitly shared via messaging
- CandidateMatch records are read-only for employers — status changes go through dedicated endpoints with audit logging

### 13.3 Rate Limiting (New Routes)

All new routes inherit existing rate limiting infrastructure. Additional limits:

| Route group | Limit | Why |
|---|---|---|
| `/api/employer` POST (create) | 3/hour per user | Prevent spam employer accounts |
| `/api/employer/*/roles` POST | 10/day per employer | Prevent job spam |
| `/api/employer/*/roles/*/outreach` POST | 1/hour per role | Prevent outreach flooding |
| `/api/roles` GET (public browse) | 60/min per IP | Prevent scraping |
| `/api/candidates/*` GET (public) | 30/min per IP | Prevent profile scraping |
| `/api/user/messages` POST | 30/hour per user | Prevent message spam |

### 13.4 Input Validation (Zod schemas required)

Every new route gets a Zod schema. Critical validations:

- Role description: max 50,000 chars, sanitized for HTML/script injection
- Employer name/slug: alphanumeric + hyphens, max 100 chars, profanity filter on slug
- Message content: max 5,000 chars, no HTML, link sanitization
- Outreach email body: AI-generated but validated — must contain opt-out link, must not contain profanity or misleading content
- Salary values: positive integers only, min < max enforced
- Bulk operations (CSV invite): max 500 rows per request

### 13.5 Abuse Prevention

- **Fake employer accounts:** manual verification required before role publishing. Admin sets `verifiedAt` after checking company website/domain.
- **Outreach spam:** global suppression list checked before every send. Bounce rate > 10% auto-pauses employer outreach. Employer flagged for review.
- **Candidate scraping:** employer browse responses are paginated (max 20 per page), no bulk export on free/pro tiers. Rate limiting on browse endpoints.
- **Message harassment:** candidates can block an employer. Blocked employer cannot message or view that candidate. Report button triggers admin review.

---

## 14. Edge Cases & Error Handling

### 14.1 Matching Engine Edge Cases

| Scenario | Handling |
|---|---|
| Candidate has no resume uploaded | Skip from matching pool. Show prompt: "Upload a resume to get matched with roles." |
| Role has no structured requirements (AI extraction failed) | Retry extraction once. If still fails, fall back to keyword-based matching on raw JD text. Flag for employer review. |
| Candidate updates resume | Invalidate cached extraction. Re-score against all active roles on next cron run (not real-time — could be expensive). |
| Role gets 0 internal matches | Automatically trigger external sourcing (don't wait for cron). Notify employer: "Searching external sources — results within 2 hours." |
| Score tie between candidates | Secondary sort by recency (most recently active first), then by profile completeness. |
| Candidate opts out while shortlisted | Remove from all active shortlists. CandidateMatch status → "withdrawn". Notify employer. |
| External candidate already exists as a User | Deduplicate: if ExternalCandidate.email matches User.email, skip external record. Score the existing User instead. |
| Employer deletes a role with active outreach | Cancel all queued outreach (status → "cancelled"). Contacted candidates see "This role is no longer available." |

### 14.2 Outreach Edge Cases

| Scenario | Handling |
|---|---|
| Email bounces | Mark Outreach.status = "bounced". After 3 bounces from same domain, flag source quality issue. |
| Candidate replies "not interested" | AI classifies reply sentiment. If negative: mark "rejected", no follow-ups. Add to role-specific exclusion (not global suppression). |
| Candidate replies "interested" | AI classifies as positive. Create platform invite if external. Notify employer. Move CandidateMatch to "responded." |
| Candidate clicks opt-out | Add to global suppression list (EmailSuppression model — see 14.4). Never contact again from any role. |
| Resend API down | Queue stays as "queued". Next cron run retries. After 3 failed runs, alert admin via Sentry. |
| Employer's outreach budget exhausted | Pause outreach for that role. Notify employer: "Monthly outreach limit reached. Upgrade or wait for reset." |

### 14.3 Messaging Edge Cases

| Scenario | Handling |
|---|---|
| Candidate deletes account | Messages preserved for employer audit trail but sender shown as "[Deleted User]". |
| Employer downgraded from enterprise | Existing message threads remain readable. New messages blocked unless mutual interest exists. |
| Mutual interest detected | Both parties get a notification: "[Company] is also interested in you" / "[Candidate] bookmarked your role." Messaging unlocked. |
| Message contains PII (phone/email) in free tier | Don't strip — the messaging system is already gated by mutual interest. If they've unlocked messaging, PII sharing is expected. |

### 14.4 Email Suppression Model (Phase 7)

```prisma
// ---- Email Suppression ----
// Global opt-out list for outreach. Checked before every external email send.
model EmailSuppression {
  id        String   @id @default(cuid())
  email     String   @unique                       // Suppressed email address (lowercased)
  reason    String                                 // opt_out, bounce, complaint, manual
  createdAt DateTime @default(now())

  @@index([email])
}
```

Add to Phase 7 build. The outreach cron must check this table before every send.

---

## 15. Notification System

Smooth workflows require timely notifications. These are the key notification triggers:

### 15.1 Employer Notifications (via email + in-app)

| Event | Channel | Priority |
|---|---|---|
| New high-quality match (score >= 80) | Email + in-app | High |
| Candidate responded to outreach | Email + in-app | High |
| Interview scheduled | Email + in-app | High |
| Shortlist delivered | Email + in-app | Medium |
| External sourcing completed | In-app only | Medium |
| Outreach follow-up sent (automated) | In-app only | Low |
| Candidate withdrew from pipeline | In-app only | Medium |
| Monthly usage summary | Email | Low |

### 15.2 Candidate Notifications (via email + in-app)

| Event | Channel | Priority |
|---|---|---|
| New role match (score >= 75) | Email (weekly digest) + in-app | Medium |
| Employer bookmarked you | In-app only | Medium |
| Mutual interest unlocked | Email + in-app | High |
| New message from employer | Email + in-app | High |
| Interview invitation | Email + in-app | High |
| Outreach email (external candidate) | Email | High |
| "Your profile is incomplete" nudge | Email (once, 7 days after signup) | Low |

### 15.3 Implementation

- In-app: new `Notification` model (userId, type, title, body, readAt, createdAt). Rendered in a bell icon dropdown (existing pattern from the dashboard).
- Email: via existing Resend integration. Respect user's `weeklyDigest` preference. Add `emailNotifications` boolean to User for transactional emails (default true).
- No WebSockets needed for v1 — poll every 60s or use Vercel's ISR pattern for the notification badge count.

```prisma
model Notification {
  id        String    @id @default(cuid())
  userId    String
  type      String                                 // match, message, bookmark, interview, outreach, system
  title     String
  body      String?
  linkUrl   String?                                // Deep link to relevant page
  readAt    DateTime?
  createdAt DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, readAt])
  @@index([userId, createdAt])
}
```

---

## 16. Monitoring & Observability

### 16.1 Business Metrics (track from day 1)

| Metric | How | Alert threshold |
|---|---|---|
| Candidate pool size (openToWork = true) | Nightly cron count | Drop > 10% week-over-week |
| Active roles | Count(Role.status = "active") | — |
| Match rate | Avg matches per role (score >= 60) | < 5 per role (pool too small) |
| Outreach response rate | Replied / Sent | < 5% (email quality issue) |
| External → User conversion | convertedUserId set / total outreach | < 2% (value prop issue) |
| Time to shortlist | Role.createdAt → Shortlist.deliveredAt | > 48 hours (pipeline bottleneck) |
| Employer activation | Created account → posted first role | > 7 days (onboarding friction) |
| Mutual interest rate | Mutual bookmarks / total bookmarks | — (baseline tracking) |

### 16.2 Technical Metrics

| Metric | How | Alert threshold |
|---|---|---|
| Matching engine latency | Timer around batch scoring | > 30s for 1000 candidates |
| Gemini extraction failures | Sentry error count on extraction | > 5% failure rate |
| Outreach queue depth | Count(Outreach.status = "queued") | > 200 (processing stalled) |
| External API failures (GitHub, SO) | Sentry + response code logging | 3 consecutive failures |
| Resend delivery rate | Resend webhook events | < 95% (deliverability issue) |

All metrics logged to existing Sentry + audit log infrastructure. Admin dashboard extended with B2B metrics tab.

---

## 17. Data Migration & Rollback Strategy

### 17.1 Migration Approach

Every phase uses additive-only migrations (new tables, new columns with defaults). No existing table modifications except adding back-references to User.

Migration sequence:
1. Run `prisma migrate dev` — creates new tables
2. Deploy code — new routes are live but invisible (no UI links until frontend deploys)
3. Verify with health check endpoint
4. Enable frontend routes

### 17.2 Rollback

Each phase can be rolled back independently:
- **Code rollback:** Revert to previous deployment on Vercel (one click)
- **Schema rollback:** New tables are empty on first deploy — dropping them has zero impact on existing data
- **Data rollback:** If data has been created (employers, roles, matches), soft-delete rather than drop. Keep the tables, hide the UI.

### 17.3 Feature Flags

No feature flag system needed. Each layer is behind its own URL namespace:
- `/org/*` — Layer 1 (coach dashboard)
- `/employer/*` — Layer 2-3 (employer dashboard)
- `/dashboard/opportunities`, `/dashboard/messages` — Layer 2 (candidate marketplace features)
- `/companies`, `/roles` — Layer 2 (public marketplace)

If a layer isn't ready, its routes simply don't exist. No conditional rendering needed.

---

## 18. User Journeys (End-to-End Flows)

Every workflow must be smooth from first click to outcome. No dead ends, no confusion about what's next.

### 18.1 Employer Journey

```
1. DISCOVER    → /for-employers marketing page (how it works, pricing, social proof)
2. SIGN UP     → Existing JobPilot signup → "I'm hiring" toggle → create Employer account
                 (one flow, not two separate signups — employer is a role, not a separate user type)
3. ONBOARD     → Guided setup: company name, logo, industry, size, website, description
                 → "Verification pending" banner — can create draft roles but not publish
                 → Admin verifies within 24 hours (SLA) → email notification when verified
4. POST ROLE   → AI-assisted JD creation: paste raw JD or describe the role in plain text
                 → AI extracts structured fields (skills, experience, salary, location)
                 → Employer reviews/edits extracted fields before publishing
                 → "Publish" button triggers matching immediately
5. REVIEW      → Dashboard shows matches arriving in real-time as scoring completes
                 → Kanban view: Matched → Shortlisted → Contacted → Responded → Interviewing → Hired
                 → Each candidate card: name, score, top 3 skills, AI summary, bookmark button
                 → Click card → expanded profile (experience, education, portfolio link, score breakdown)
6. ENGAGE      → Bookmark candidates → mutual interest unlocks messaging
                 → Enterprise: trigger AI outreach directly from the matches view
                 → Message thread per candidate-role pair
7. HIRE        → Move candidate to "Offered" → "Hired" → role auto-closes when candidatesNeeded reached
                 → Shortlist export (CSV/PDF) for internal stakeholders
8. REPEAT      → Dashboard shows all roles + aggregate pipeline stats
                 → "Post similar role" button copies a previous role as template
```

**Dead-end prevention:**
- 0 matches → auto-trigger external sourcing + show "We're expanding the search" with ETA
- Pending verification → clear messaging + "Need it faster? Email support@jobpilotai.co"
- No response to outreach after 7 days → suggest expanding criteria or lowering minimum score

### 18.2 Candidate Journey

```
1. EXISTING    → Current signup + resume upload + onboarding flow (unchanged)
2. PREFERENCES → After first resume upload, prompt: "Set your job preferences to get matched"
                 → /dashboard/preferences: title, skills, location, salary, openToWork toggle
                 → Profile completeness indicator: "Your profile is 60% complete — add salary
                   expectations to improve match quality"
3. DISCOVER    → /dashboard/opportunities: roles matched to you, sorted by score
                 → Each role card: title, company, score, salary range, location, "I'm interested" button
                 → Also visible: /roles public job board (browse without login, login to see scores)
4. SIGNAL      → Bookmark a role or company → if employer also bookmarked you → mutual interest notification
                 → "New: [Company] is interested in you!" → messaging unlocked
5. CONNECT     → Message thread with employer → share additional info if desired
                 → Interview scheduling (calendar link from employer)
6. TRACK       → /dashboard/tracker (existing) now also shows employer-side pipeline status
                 → "Google marked you as Interviewing" / "Acme sent you an offer"
                 → Candidate can withdraw from any pipeline at any time
```

**Dead-end prevention:**
- No matches → "Upload a resume" or "Set your preferences" prompt (whichever is missing)
- Low match scores → "Your top skill gaps for roles you're interested in: [X, Y, Z]"
- No mutual interests → don't show empty state, show "Browse companies" CTA

### 18.3 External Candidate Journey

```
1. SOURCED     → AI finds profile on GitHub / portfolio / resume database
2. SCORED      → Matched against role, scored, ranked alongside internal candidates
3. OUTREACH    → Personalized email: "[Company] found your profile — you're a strong match for [Role]"
4. ENGAGE      → Click "I'm interested" → signup page pre-filled with extracted data
                 → OR reply to email → AI classifies response → pipeline advances
5. CONVERT     → Signup creates User + links ExternalCandidate record
                 → All match history preserved → candidate is now internal
                 → Profile shows "Complete your profile for better matches" prompt
6. RETAIN      → Now a full JobPilot user — gets matched to future roles automatically
```

### 18.4 Coach Journey (Org Layer)

```
1. ONBOARD     → Admin creates org → coach receives invite → accepts
2. INVITE      → Bulk invite candidates (CSV or paste emails) → track acceptance
3. MONITOR     → Dashboard: active candidates, resumes created, applications in flight
                 → Cohort filter: "March 2027 cohort" performance
4. CROSS-REF   → If org candidates are being matched with employers, coach sees:
                 → "5 of your candidates matched with employer roles this week"
                 → Aggregate only — never which employer or which role (privacy)
5. REPORT      → CSV export for stakeholders → outcome tracking (applied → hired)
```

---

## 19. AI-Assisted Role Creation

Employers shouldn't write structured forms from scratch. The intake experience must feel effortless.

### 19.1 Three Input Modes

| Mode | How it works | Best for |
|---|---|---|
| **Paste JD** | Employer pastes existing job description text → AI extracts all structured fields | Companies with existing JDs |
| **Describe it** | Employer writes 2-3 sentences: "We need a senior React engineer, remote, $120-150K" → AI generates full JD + structured fields | Quick postings, first-time employers |
| **Template** | Pick from common role templates (SWE, PM, Designer, Data Scientist, etc.) → edit fields | Employers who want speed |

### 19.2 Extraction + Review Flow

```
1. Input received (paste / describe / template)
2. Gemini extracts: title, skills (required vs nice-to-have), experience range,
   salary range, location type, education, employment type, industry
3. Show side-by-side: original text (left) + extracted fields (right, editable)
4. Employer reviews, adjusts any field, adds anything AI missed
5. "Preview" shows how candidates will see it on /roles
6. "Publish" → matching starts immediately
```

### 19.3 Nice-to-Have Skills

The JD extraction captures both `requiredSkills` and `niceToHaveSkills`. The scoring engine uses them:

- Required skill match: full weight (30% dimension)
- Nice-to-have skill match: bonus points — up to +5 on final score (caps at 100)

This prevents candidates with only nice-to-have skills from outscoring those with required skills, while still rewarding breadth.

---

## 20. Skills Taxonomy

Fuzzy matching ("React" = "React.js" = "ReactJS") needs a structured approach, not string comparison.

### 20.1 Skill Synonym Map

A JSON file (`src/lib/skills-taxonomy.json`) mapping canonical skill names to variants:

```json
{
  "React": ["React.js", "ReactJS", "React JS"],
  "Node.js": ["NodeJS", "Node"],
  "TypeScript": ["TS"],
  "PostgreSQL": ["Postgres", "psql"],
  "Amazon Web Services": ["AWS"],
  "Machine Learning": ["ML"],
  "CI/CD": ["Continuous Integration", "Continuous Deployment", "CI CD"]
}
```

### 20.2 Skill Relatedness Map

Skills that aren't synonyms but indicate transferable knowledge:

```json
{
  "React": { "related": ["Vue", "Angular", "Svelte"], "weight": 0.5 },
  "Python": { "related": ["Ruby", "JavaScript"], "weight": 0.3 },
  "PostgreSQL": { "related": ["MySQL", "SQLite", "MongoDB"], "weight": 0.4 },
  "AWS": { "related": ["GCP", "Azure"], "weight": 0.6 }
}
```

Scoring: exact match = 100% of skill weight. Synonym = 100%. Related = weight * 100%.

### 20.3 Industry Taxonomy

Flat list with relatedness:

```json
{
  "Technology": { "related": ["Fintech", "Healthtech", "Edtech", "SaaS"] },
  "Finance": { "related": ["Fintech", "Insurance", "Banking"] },
  "Healthcare": { "related": ["Healthtech", "Biotech", "Pharma"] }
}
```

Same industry = 100%. Related = 60%. Unrelated = 20%.

### 20.4 Maintenance

Start with a curated list of ~200 skills and ~30 industries. Extend by analyzing extracted skills from real JDs and resumes — if Gemini extracts a skill not in the taxonomy, add it. Review quarterly.

---

## 21. Messaging Architecture

> **Note:** The MessageThread and Message definitions in §2.4 are the canonical versions (already updated with proper threading). This section explains the design rationale and rules.

### 21.2 Thread Creation Rules

- **Mutual interest:** when both sides bookmark each other, a thread is auto-created (empty, ready for first message)
- **Enterprise employer:** can create a thread with any matched candidate (score >= 60) without mutual interest
- **Candidate:** cannot initiate a thread — can only respond to employer-initiated threads or mutual interest threads
- **One thread per candidate-employer-role:** prevents duplicate conversations. If employer posts a new role, a new thread can be created for that role context.

### 21.3 Inbox Queries

Candidate inbox: `SELECT thread WHERE candidateId = ? AND status = 'active' ORDER BY lastMessageAt DESC`
Employer inbox: `SELECT thread WHERE employerId = ? AND status = 'active' ORDER BY lastMessageAt DESC`
Unread count: `SELECT COUNT(*) FROM Message WHERE threadId IN (user's threads) AND readAt IS NULL AND senderId != ?`

---

## 22. Shortlist Integrity

> **Note:** The Shortlist and ShortlistEntry definitions in §2.3 are the canonical versions (already updated with the junction table pattern below). This section explains the design rationale.

### 22.1 Design: Junction Table over JSON

The original approach stored candidate IDs as a JSON string on Shortlist. This was fragile — if a CandidateMatch was deleted, the JSON reference became stale with no cascade protection.

The junction table (`ShortlistEntry`) solves this with: referential integrity (FK cascade delete), explicit sort order, employer notes per candidate, and standard Prisma query patterns instead of JSON parsing.

---

## 23. Candidate Pipeline Visibility

Candidates must know where they stand. A silent pipeline feels like a black hole.

### 23.1 What Candidates See

On `/dashboard/opportunities`, each matched role shows the candidate's pipeline status:

| Internal status | What candidate sees | Why |
|---|---|---|
| matched | "You match this role" | Neutral — no action taken yet |
| shortlisted | "Employer is reviewing your profile" | Encouraging — they're interested |
| contacted | "Employer reached out — check your messages" | Action required |
| responded | "Awaiting employer reply" | Acknowledgment |
| interviewing | "Interview scheduled: [date]" | Clear next step |
| offered | "You received an offer!" | Celebration |
| hired | "Congratulations!" | Terminal |
| rejected | Not shown (silently removed from view) | Protect candidate experience |
| withdrawn | "You withdrew from this role" | Candidate's own action |

### 23.2 Candidate Control

- **Withdraw:** candidate can withdraw from any role at any stage. One click, immediate.
- **Hide:** candidate can hide a role from their opportunities feed (not interested, not a withdrawal — the employer doesn't know)
- **Report:** flag a role as spam/misleading → admin review

---

## 24. Batch Scoring Performance

With 10,000 candidates and 50 active roles, naive batch scoring = 500,000 pairs per nightly cron. This must be efficient.

### 24.1 Optimization Strategy

1. **Pre-filter before scoring:** Only score candidates where at least 1 required skill matches. Use a reverse index: `skill → [candidateIds]`. If a role requires React and Python, the candidate pool is `intersection(react_candidates, python_candidates)` — typically 10-20% of total pool.

2. **Cache extractions aggressively:** Resume extraction cached until resume `updatedAt` changes. JD extraction cached per role. These are Gemini calls — expensive and slow. Store in `AiResult` or a dedicated `ExtractionCache` table.

3. **Incremental scoring:** The nightly cron only re-scores candidates whose recency score has changed (everyone, but recency is cheap — no AI call). Full re-scoring only runs when a candidate updates their resume or a role's requirements change.

4. **Scoring is CPU-light:** The 8-dimension deterministic scoring is pure arithmetic — no AI calls. 10,000 pairs score in < 1 second. The bottleneck is extraction, which is cached.

5. **Batch Gemini calls:** When a new role is published, extract its JD once, then score against all pre-extracted candidates. Only candidates without cached extractions need a Gemini call. Process these in batches of 20 with 500ms delays to stay under rate limits.

### 24.2 Scaling Triggers

| Signal | Action |
|---|---|
| Pre-filter still leaves > 5,000 candidates per role | Add more dimensions to pre-filter (location, experience range) |
| Nightly cron takes > 5 minutes | Split into per-role jobs, run in parallel |
| > 50,000 total candidates | Evaluate moving scoring to a background worker (Vercel Queues or Inngest) |
| > 100 active roles simultaneously | Evaluate Postgres for write throughput |

---

## 25. Coach ↔ Employer Cross-Visibility

When a bootcamp's candidates are being matched with employers, coaches should see aggregate signal — not specifics (privacy).

### 25.1 What Coaches See

On the coach dashboard, a new "Placement Activity" card:

- "12 of your candidates were matched with employer roles this week"
- "3 candidates received outreach from employers"
- "1 candidate is in an interview pipeline"

**Never shown:** which employer, which role, match scores, or any employer-side data. The candidate is the data owner — the coach sees activity metrics only (consistent with `dataVisibility = "metrics"`).

### 25.2 Implementation

A new aggregate query in `/api/org/[orgId]/stats`:
```sql
SELECT
  COUNT(DISTINCT cm.candidateId) as matched_candidates,
  COUNT(CASE WHEN cm.status IN ('contacted','responded','interviewing') THEN 1 END) as active_pipelines,
  COUNT(CASE WHEN cm.status = 'hired' THEN 1 END) as placed
FROM CandidateMatch cm
JOIN OrganizationMember om ON cm.candidateId = om.userId
WHERE om.organizationId = ?
  AND cm.createdAt > datetime('now', '-7 days')
```

This is the metric that sells the B2B contract: "Your candidates are getting placed."

---

## 26. Open Decisions

1. **Calendar integration:** Build a simple slot picker, or integrate Cal.com? Recommend Cal.com (open source, free tier, API). Decision needed before Phase 7.
2. **Resume database access:** Indeed and Monster require commercial partnerships. Apply early — 2-4 week approval. Not blocking for v1. Decision needed before Phase 9.
3. **Branded employer emails:** Enterprise employers may want outreach from their domain, not jobpilotai.co. Requires Resend domain verification per employer. Defer to post-launch.
4. **Candidate data export for employers:** Do employers get a CSV/PDF of their shortlist? Recommend yes — it's what closes deals. Simple to build. Add to Phase 7.
5. **Org → Employer bridge:** Can a bootcamp also be an employer (hiring their own grads)? Schema supports it (separate Employer and Organization records for the same company). No special code needed.
6. **Notification email frequency:** Real-time per-event, or batched daily digest? Recommend: high-priority events (message, interview, response) real-time. Match notifications batched into weekly digest. Configurable per user.
7. **Employer verification process:** Manual only (admin reviews), or automated domain verification (check MX records, send verification email to company domain)? Recommend: start manual, add domain verification in Phase 8.
8. **Match score visibility to candidates:** Show the exact score ("82% match") or a tier ("Strong match" / "Good match" / "Possible match")? Recommend tiers — exact numbers invite gaming and complaints.
9. **Employer feedback on matches:** Should employers be able to thumbs-up/down candidates to improve future scoring? Recommend yes — store on CandidateMatch, feed into culture signals dimension over time. Add to Phase 4.
10. **Outreach personalization by source:** GitHub outreach should reference repos. Portfolio outreach should reference projects. Stack Overflow should reference top answers. Build source-specific AI prompts. Add to Phase 7.
11. **Internal candidate outreach:** When the AI agent wants to reach a JobPilot user (not external), use in-app notification + email, NOT the Outreach model. They're already on the platform — treat them differently.
