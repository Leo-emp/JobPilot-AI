# JobPilot AI

A production-grade AI career platform that helps job seekers optimize resumes, match jobs, generate cover letters, and prepare for interviews — deployed at [jobpilotai.co](https://jobpilotai.co) with Stripe billing, multi-provider auth, and a Chrome extension.

Built as a full-stack SaaS with **28,000+ lines of TypeScript**, 32 API routes, 10 database models, 6-model AI fallback, and enterprise-grade security across 8 layers.

---

## Architecture

```mermaid
graph TB
    subgraph Clients["CLIENTS"]
        BR[Browser<br/>Next.js 16 App]
        CE[Chrome Extension<br/>Manifest V3]
        SW[Stripe Webhooks]
    end

    subgraph Edge["VERCEL EDGE PROXY"]
        PX[proxy.ts<br/>CSRF · IP rate limit · Auth gate<br/>CSP · CORS · Body limit · Tracing]
    end

    subgraph Pages["PAGES"]
        MK[Marketing<br/>10 pages · ISR 1hr]
        DB[Dashboard<br/>14 pages · Dynamic]
    end

    subgraph API["32 API ROUTES"]
        AI[/api/ai — 6 actions<br/>Resume · Cover · Interview<br/>Match · Pivot · Outreach]
        AU[/api/auth — 4 routes<br/>Google · LinkedIn · Email/PW]
        ST[/api/stripe — 4 routes<br/>Checkout · Portal · Webhooks]
        AP[/api/applications — 6<br/>CRUD · Pipeline · Notes]
        EX[/api/extension — 3<br/>Auth · Save · AI tools]
    end

    subgraph Security["8-LAYER SECURITY"]
        S1[NextAuth v5 + Bcrypt]
        S2[Account lockout · Audit logs]
        S3[Zod validation — 15 routes]
        S4[Row-Level Security wrapper]
        S5[Redis burst + monthly caps]
    end

    subgraph External["EXTERNAL SERVICES"]
        GM[Gemini AI<br/>6-model fallback chain]
        SR[Stripe<br/>Checkout + Portal]
        RS[Resend · Sentry<br/>PostHog · Redis]
    end

    subgraph Data["DATABASE"]
        PR[(Prisma v7<br/>SQLite / Turso<br/>10 models · 10 indexes)]
    end

    BR & CE & SW --> PX
    PX --> MK & DB & API
    API --> Security
    API --> External
    API --> Data
    AI --> GM

    style Edge fill:#1a1a2e,stroke:#818CF8,color:#fff
    style Security fill:#1a1a2e,stroke:#EF4444,color:#fff
    style External fill:#1a1a2e,stroke:#10B981,color:#fff
    style API fill:#1a1a2e,stroke:#F59E0B,color:#fff
```

## Problem Statement

Job searching is fragmented and time-consuming. Candidates spend hours tailoring resumes for each application, writing cover letters from scratch, and preparing for interviews without knowing what questions to expect. Existing tools are either too simple (basic templates) or too expensive ($30-50/month) for individual job seekers.

Three specific technical challenges make this problem harder than it appears:

1. **AI reliability** — LLM APIs have rate limits, model deprecations, and unpredictable latency. A career tool that fails mid-resume-rewrite destroys user trust.
2. **Security at the data layer** — Resumes contain home addresses, phone numbers, salary history. A multi-tenant SaaS must enforce user isolation at the database level, not just the API level.
3. **Fragmented job boards** — Job seekers use 5-10 different sites. No single API covers all sources, and manual data entry creates friction that kills adoption.

---

## Technical Deep Dive

### 6-Model AI Fallback Chain

Rather than depending on a single LLM endpoint, the system maintains a prioritized chain of 6 Gemini models:

| Priority | Model | Use Case |
|----------|-------|----------|
| 1 | gemini-2.5-flash | Primary — fastest, most capable |
| 2 | gemini-2.5-flash-preview | Fallback if primary is rate-limited |
| 3 | gemini-2.0-flash | Stable fallback |
| 4 | gemini-2.0-flash-lite | Lightweight fallback |
| 5 | gemini-1.5-pro | High-quality fallback |
| 6 | gemini-1.5-flash | Last resort |

Dead models are tracked in memory — if a model returns 3 consecutive errors, it is skipped for 5 minutes. Each attempt has a 30-second timeout. The chain ensures near-100% AI availability: even during Google API incidents, the system degrades to an older model rather than showing an error.

### 8 Specialized Prompt Templates

Each AI action uses a domain-specific prompt template rather than a generic instruction. The `prompts.ts` module contains 8 functions that construct prompts with structured output requirements:

- **Resume Analysis** — ATS scoring with keyword extraction, section-by-section feedback
- **Full Rebuild** — Complete resume rewrite with configurable tone and target role
- **Deep Tailor** — Resume customization against a specific job description
- **Career Pivot** — Experience reframing for industry transitions
- **Cover Letter** — Tailored letters with company research integration
- **Interview Prep** — Role-specific question prediction with model answers
- **Job Match** — Resume-to-JD similarity scoring with gap analysis
- **LinkedIn Outreach** — Connection messages with tone and platform selection

Each prompt enforces output structure (markdown headers, bullet points, scoring rubrics) to ensure consistent, parseable AI responses.

### Row-Level Security

The database layer implements a Row-Level Security wrapper (`rls.ts`) that automatically scopes every query to the authenticated user's ID. This prevents a class of bugs where a developer forgets to add `WHERE userId = ?` — the RLS wrapper injects it automatically. Combined with cascade deletes on all user relations, account deletion removes all associated data in a single transaction.

### Edge Proxy Security

Every request passes through a proxy layer (`proxy.ts`) that runs at the Vercel edge before reaching any API route or page. This single file implements 9 security controls:

1. Maintenance mode (env var toggle)
2. Auth gate (redirect unauthenticated users from /dashboard)
3. API protection (401 on private routes without session)
4. IP rate limiting (30 req/min on auth routes)
5. Request body size limit (2MB)
6. CSRF protection (origin/referer check on mutations)
7. Security headers (CSP, HSTS, X-Frame-Options, etc.)
8. CORS (same-origin + Chrome extension)
9. Request tracing (X-Request-Id)

This pattern ensures security controls cannot be bypassed by adding new routes — the proxy runs before all of them.

### Chrome Extension Integration

The Chrome extension (Manifest V3) captures job listings from any website with a single click. It communicates with the main application through 3 dedicated API endpoints (`/api/extension/*`) that handle authentication, job saving, and in-extension AI analysis.

The extension injects a floating badge on supported job board pages, extracts structured job data (title, company, description, URL), and syncs it to the user's application tracker. This solves the job board fragmentation problem — instead of requiring users to search within the platform, it meets them where they already browse.

### Stripe Billing Integration

The payment system uses Stripe's hosted checkout flow with webhook-driven state management. The user never enters payment details on the application — they are redirected to Stripe's PCI-compliant checkout page. Webhooks handle subscription creation, renewal, cancellation, and payment failures, updating the user's plan in the database atomically.

A reconciliation endpoint (`/api/stripe/reconcile`) handles edge cases where webhook delivery fails, ensuring the database plan state always matches Stripe's source of truth.

---

## AI/ML Techniques

| # | Technique | Implementation | Purpose |
|---|-----------|---------------|---------|
| 1 | **LLM Integration** | Gemini 2.5 Flash (6-model fallback chain) | Resume analysis, cover letters, interview prep |
| 2 | **Prompt Engineering** | 8 specialized prompt templates | ATS scoring, job matching, career pivot, outreach |
| 3 | **Streaming AI** | Server-Sent Events (SSE) | Real-time token delivery for better UX |
| 4 | **AI Fallback** | Dead-model tracking + auto-skip | 99.9% uptime across 6 Gemini models |
| 5 | **Usage Metering** | Per-user monthly counters + plan limits | Freemium → Pro conversion funnel |

## Features

### Resume Intelligence
- **ATS Score** — AI grades resume against ATS parsers with keyword analysis
- **Full Rebuild** — Complete resume rewrite optimized for target roles
- **Deep Tailor** — Customizes resume for a specific job description
- **Career Pivot** — Reframes experience for industry transitions
- **Custom Instructions** — User-defined rules for AI output (section order, tone, emphasis)

### Job Search & Match
- **Multi-Source Aggregator** — Searches Adzuna, Remotive, RemoteOK, WeWorkRemotely in parallel
- **AI Match Score** — Analyzes resume vs job description with gap analysis
- **Chrome Extension** — One-click save from any job board + in-extension AI tools

### Cover Letters & Interview
- **Cover Letter Generator** — Tailored letters from resume + job description
- **Interview Prep** — Predicts questions for specific roles with model answers
- **LinkedIn Outreach** — AI-crafted connection messages with tone/platform selection

### Application Tracker
- **Pipeline View** — Track applications through Applied → Interview → Offer stages
- **Company Research** — Store notes, contacts, and research per company
- **Network CRM** — Manage professional contacts with relationship tracking

## Security (8 Layers)

| Layer | Protection |
|-------|-----------|
| Edge Proxy | CSRF, CORS, CSP, HSTS, IP rate limit, body size (2MB), auth gate |
| Authentication | Bcrypt hashing, JWT sessions (7-day), OAuth (Google/LinkedIn) |
| Account Protection | Lockout after 10 failed attempts (15min), audit logging |
| API Validation | Zod schemas on 15 routes, input size limits |
| Database | Row-Level Security wrapper, user-scoped queries, cascade delete |
| Rate Limiting | Redis burst (10/min) + monthly caps (free: 20, pro: 1000) |
| AI Safety | Prompt injection defense, 30s timeout, dead-model tracking |
| Compliance | Cookie consent, GDPR data export, AI disclosure, privacy policy |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React Server Components) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 with custom space theme |
| Database | SQLite (dev) / Turso libSQL (prod) via Prisma v7 |
| Auth | NextAuth.js v5 — Google, LinkedIn, Email/Password |
| AI | Google Gemini API (6-model fallback, 30s timeout) |
| Payments | Stripe (Checkout, Portal, Webhooks) |
| Caching | Upstash Redis (rate limits, plan cache, job search) |
| Email | Resend (onboarding, lifecycle, password reset) |
| Analytics | PostHog |
| Error Tracking | Sentry (errors + breadcrumbs) |
| Deployment | Vercel (edge proxy, serverless functions) |

## Project Structure

```
jobpilot-website/                  # 28,000+ lines of TypeScript
├── src/
│   ├── app/
│   │   ├── (auth)/                # Login, Signup, Forgot/Reset Password
│   │   ├── (marketing)/           # 10 marketing pages (ISR, 1hr revalidation)
│   │   ├── api/                   # 32 API routes (AI, auth, Stripe, CRUD)
│   │   ├── dashboard/             # 14 protected pages (all features)
│   │   ├── layout.tsx             # Root layout (fonts, metadata, theme)
│   │   ├── page.tsx               # Landing page (space theme)
│   │   └── globals.css            # Design tokens, glow effects, glass cards
│   ├── components/                # 42 React components
│   └── lib/                       # 16 modules (auth, db, AI, stripe, security)
├── chrome-extension/              # Browser extension (manifest v3)
├── prisma/
│   ├── schema.prisma              # 10 models, indexes, relations
│   └── migrations/                # 12 versioned migrations
├── e2e/                           # Playwright E2E tests
└── scripts/                       # DB seeding, admin tools
```

## By the Numbers

| Metric | Value |
|--------|-------|
| Source files | 248 TypeScript modules |
| Lines of code | 28,000+ |
| API routes | 32 |
| Pages | 26 (10 marketing + 4 auth + 12 dashboard) |
| React components | 42 |
| Database models | 10 |
| Unit tests | 164 |
| External services | 10 |
| Security layers | 8 |

## Key Engineering Decisions

**Why Next.js 16 App Router?** Server Components reduce client bundle size by ~40%. API routes collocate backend logic with the frontend. Vercel deployment gives edge proxy, serverless functions, and zero-config CI/CD.

**Why 6-model AI fallback?** Gemini API has periodic model deprecations and rate limits. The fallback chain (2.5-flash → 2.0-flash → 1.5-pro → 1.5-flash) ensures near-100% AI availability without user-facing errors.

**Why SQLite/Turso over Postgres?** Turso (libSQL) provides SQLite-compatible cloud database with edge replicas. Zero cold starts, sub-millisecond reads, and free tier handles early-stage traffic. Migration to Postgres is one config change when needed.

**Why Redis for rate limiting?** In-memory counters reset on serverless cold starts. Upstash Redis persists rate limit state across function invocations with an in-memory fallback for development.

**Why a Chrome extension?** Job boards are fragmented — users visit 5-10 sites. The extension captures job data from any page with one click, syncing directly to the user's JobPilot tracker.

## Future Work

- **B2B organization layer** — Multi-tenant support for bootcamps, universities, and staffing agencies
- **Real-time job alerts** — Background workers monitoring job boards for matching listings
- **AI interview simulator** — Voice-based mock interviews with real-time feedback
- **Resume template marketplace** — Premium, ATS-optimized templates with AI customization

## Setup

```bash
git clone https://github.com/Leo-emp/JobPilot-AI.git
cd JobPilot-AI

npm install

cp .env.example .env
# Add: DATABASE_URL, AUTH_SECRET, GEMINI_API_KEY

npx prisma migrate dev
npm run dev
```

## Live

- **Website:** [jobpilotai.co](https://jobpilotai.co)
- **Repository:** [github.com/Leo-emp/JobPilot-AI](https://github.com/Leo-emp/JobPilot-AI)

## License

MIT
