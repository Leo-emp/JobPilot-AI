# JobPilot AI: Technical Report

## Problem Statement

Job searching is fragmented and time-consuming. Candidates spend hours tailoring resumes for each application, writing cover letters from scratch, and preparing for interviews without knowing what questions to expect. Existing tools are either too simple (basic templates) or too expensive ($30-50/month) for individual job seekers.

Three specific technical challenges make this problem harder than it appears:

1. **AI reliability** — LLM APIs have rate limits, model deprecations, and unpredictable latency. A career tool that fails mid-resume-rewrite destroys user trust.
2. **Security at the data layer** — Resumes contain home addresses, phone numbers, salary history. A multi-tenant SaaS must enforce user isolation at the database level, not just the API level.
3. **Fragmented job boards** — Job seekers use 5-10 different sites. No single API covers all sources, and manual data entry creates friction that kills adoption.

## Approach

### Production-Grade Monolith

The system is built as a full-stack Next.js 16 application deployed on Vercel — a deliberate architectural choice over microservices. For a solo-founder SaaS at early stage, collocating frontend, API, and background logic in one repository eliminates deployment complexity, reduces latency (no inter-service calls), and allows rapid iteration. The architecture supports clean migration to services later through well-defined module boundaries.

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

## Results

### System Specifications

| Metric | Value |
|--------|-------|
| Total codebase | 28,000+ lines of TypeScript |
| Source files | 248 modules |
| API routes | 32 endpoints |
| Pages | 26 (10 marketing + 4 auth + 12 dashboard) |
| React components | 42 |
| Database models | 10 with 12 versioned migrations |
| Unit tests | 164 passing |
| External integrations | 10 services |
| Security layers | 8 independent controls |
| Deployment | Vercel (edge + serverless) |

### Production Metrics

- **Live at:** jobpilotai.co
- **Auth providers:** 3 (Google, LinkedIn, Email/Password)
- **AI models:** 6-model fallback chain (near-100% availability)
- **Rate limiting:** Redis-backed burst + monthly caps
- **Monitoring:** Sentry error tracking + PostHog analytics

## Conclusions

Building a production SaaS as a solo founder requires making the right architectural trade-offs. The monolith-on-Vercel pattern provides the deployment simplicity of a static site with the capability of a full backend — serverless functions scale to zero when idle and handle traffic spikes automatically.

The 6-model AI fallback chain is the most impactful engineering decision. LLM APIs are inherently unreliable at the individual model level, but highly reliable at the aggregate level — by maintaining a prioritized fallback chain with dead-model tracking, the system achieves near-100% AI availability without any infrastructure beyond the API calls themselves.

Row-Level Security at the ORM layer eliminates the most common class of multi-tenant bugs. Rather than trusting every developer to add user-scoping to every query, the system enforces it structurally.

## Future Work

- **B2B organization layer** — Multi-tenant support for bootcamps, universities, and staffing agencies
- **Real-time job alerts** — Background workers monitoring job boards for matching listings
- **AI interview simulator** — Voice-based mock interviews with real-time feedback
- **Resume template marketplace** — Premium, ATS-optimized templates with AI customization
