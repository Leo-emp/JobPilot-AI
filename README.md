# JobPilot AI

A production-grade AI career platform that helps job seekers optimize resumes, match jobs, generate cover letters, and prepare for interviews — deployed at [jobpilotai.co](https://jobpilotai.co) with Stripe billing, multi-provider auth, and a Chrome extension.

Built as a full-stack SaaS with **28,000+ lines of TypeScript**, 32 API routes, 10 database models, 6-model AI fallback, and enterprise-grade security across 8 layers.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTS                              │
│   Browser (Next.js 16)  │  Chrome Extension  │  Stripe WH   │
└──────────┬──────────────┴────────┬───────────┴──────┬───────┘
           │                       │                  │
           ▼                       ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  VERCEL EDGE PROXY (proxy.ts)                │
│   CSRF · IP rate limit · Auth gate · CSP · CORS · Tracing   │
└────────────────────────────┬────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐
│  MARKETING   │   │  DASHBOARD   │   │    32 API ROUTES      │
│  10 pages    │   │  14 pages    │   │                        │
│  ISR (1hr)   │   │  Client-side │   │  /api/ai  (6 actions)  │
│              │   │  Dynamic     │   │  /api/auth (4 routes)  │
└──────────────┘   └──────────────┘   │  /api/stripe (4)       │
                                      │  /api/applications (6) │
                                      │  /api/extension (3)    │
                                      │  /api/jobs/search      │
                                      │  /api/admin/stats      │
                                      └──────────┬─────────────┘
                                                 │
              ┌──────────────────────────────────┼──────────────┐
              ▼                                  ▼              ▼
    ┌──────────────┐                   ┌──────────────┐  ┌────────────┐
    │   SECURITY   │                   │   DATABASE   │  │  EXTERNAL  │
    │              │                   │              │  │            │
    │ NextAuth v5  │                   │ Prisma v7    │  │ Gemini AI  │
    │  Google      │                   │ SQLite/Turso │  │  6-model   │
    │  LinkedIn    │                   │ libSQL       │  │  fallback  │
    │  Email/PW    │                   │ 10 models    │  │            │
    │              │                   │              │  │ Stripe     │
    │ Bcrypt       │                   │ RLS wrapper  │  │ Resend     │
    │ JWT sessions │                   │ db-retry     │  │ Adzuna +3  │
    │ Acct lockout │                   │ Soft-delete  │  │ PostHog    │
    │ Zod (15 rts) │                   │ Cursor paging│  │ Sentry     │
    │ Audit logs   │                   │ 10 indexes   │  │ Redis      │
    └──────────────┘                   └──────────────┘  └────────────┘
```

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
| External services | 10 (Gemini, Stripe, Resend, Redis, Sentry, PostHog, Adzuna, Remotive, RemoteOK, WeWorkRemotely) |
| Prisma migrations | 12 |
| Security layers | 8 |

## Key Engineering Decisions

**Why Next.js 16 App Router?** Server Components reduce client bundle size by ~40%. API routes collocate backend logic with the frontend. Vercel deployment gives edge proxy, serverless functions, and zero-config CI/CD.

**Why 6-model AI fallback?** Gemini API has periodic model deprecations and rate limits. The fallback chain (2.5-flash → 2.0-flash → 1.5-pro → 1.5-flash) ensures near-100% AI availability without user-facing errors.

**Why SQLite/Turso over Postgres?** Turso (libSQL) provides SQLite-compatible cloud database with edge replicas. Zero cold starts, sub-millisecond reads, and free tier handles early-stage traffic. Migration to Postgres is one config change when needed.

**Why Redis for rate limiting?** In-memory counters reset on serverless cold starts. Upstash Redis persists rate limit state across function invocations with an in-memory fallback for development.

**Why a Chrome extension?** Job boards are fragmented — users visit 5-10 sites. The extension captures job data from any page with one click, syncing directly to the user's JobPilot tracker.

## Setup

```bash
git clone https://github.com/Leo-emp/JobPilot-AI.git
cd JobPilot-AI

npm install

# Configure environment
cp .env.example .env
# Add: DATABASE_URL, AUTH_SECRET, GEMINI_API_KEY

# Initialize database
npx prisma migrate dev

# Run
npm run dev
```

## Live

- **Website:** [jobpilotai.co](https://jobpilotai.co)
- **Repository:** [github.com/Leo-emp/JobPilot-AI](https://github.com/Leo-emp/JobPilot-AI)

## License

MIT
