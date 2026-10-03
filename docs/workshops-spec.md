# Professional Workshops — Feature Spec

> Last updated: 2026-10-03
> Status: APPROVED — ready to build
> Location: `/dashboard/workshops` (no public page until post-launch)
> Navigation: Separate icon on dashboard nav bar — standalone learning center

---

## Table of Contents

1. [Architecture](#architecture)
2. [Database Schema](#database-schema)
3. [URL Structure](#url-structure)
4. [Design System](#design-system)
5. [Component Library](#component-library)
6. [Content Standards](#content-standards)
7. [Professions & Content](#professions--content)
   - [Universal Modules](#universal-modules)
   - [Software Engineer](#software-engineer)
   - [Backend Engineer](#backend-engineer)
   - [Frontend Engineer](#frontend-engineer)
   - [Full Stack Engineer](#full-stack-engineer)
   - [AI Engineer](#ai-engineer)
   - [AI Product Manager](#ai-product-manager)
   - [ICT Project Manager](#ict-project-manager)
8. [Cross-Workshop Rules](#cross-workshop-rules)
9. [Build Order](#build-order)

---

## Architecture

- **Database-driven content** — all workshop content stored in Turso via Prisma
- **Progress tracking** — per-user completion, quiz scores, bookmarks
- **Static content** — zero AI calls, no Gemini usage
- **No public landing page** until after launch — dashboard-only access
- **Post-launch**: add `/tools/workshops` public page for SEO + signup CTA

---

## Database Schema

```prisma
model Workshop {
  id          String   @id @default(cuid())
  name        String                          // "Software Engineer"
  slug        String   @unique                // "software-engineer"
  description String                          // One-line description
  icon        String                          // Icon identifier
  color       String                          // Hex color for profession
  order       Int                             // Display order
  modules     WorkshopModule[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model WorkshopModule {
  id          String   @id @default(cuid())
  workshopId  String
  workshop    Workshop @relation(fields: [workshopId], references: [id])
  name        String                          // "RAG (Retrieval-Augmented Generation)"
  slug        String                          // "rag"
  description String                          // Module summary
  order       Int                             // Display order within workshop
  sections    WorkshopSection[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([workshopId, slug])
}

model WorkshopSection {
  id          String   @id @default(cuid())
  moduleId    String
  module      WorkshopModule @relation(fields: [moduleId], references: [id])
  title       String                          // "Chunking Strategies"
  slug        String                          // "chunking-strategies"
  content     String                          // Rich text content (Markdown stored)
  type        String   @default("lesson")     // "lesson" | "exercise" | "quiz"
  difficulty  String?                         // "beginner" | "intermediate" | "advanced"
  estimatedMinutes Int @default(15)           // Estimated time to complete
  order       Int                             // Display order within module
  lastVerified DateTime?                      // For perishable data (costs, regulations)
  progress    WorkshopProgress[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([moduleId, slug])
}

model WorkshopProgress {
  id          String   @id @default(cuid())
  userId      String
  sectionId   String
  section     WorkshopSection @relation(fields: [sectionId], references: [id])
  completed   Boolean  @default(false)
  completedAt DateTime?
  quizScore   Int?                            // Quiz score if section type is "quiz"
  quizAnswers String?                         // JSON string of user's quiz answers
  notes       String?                         // User's personal notes
  bookmarked  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, sectionId])
}
```

**Indexes needed:**
- `WorkshopProgress(userId)` — fetch all progress for a user
- `WorkshopProgress(userId, sectionId)` — unique constraint handles this
- `WorkshopSection(moduleId, order)` — ordered section listing
- `WorkshopModule(workshopId, order)` — ordered module listing

---

## URL Structure

```
/dashboard/workshops                                    ← Landing (7 profession cards)
/dashboard/workshops/[workshopSlug]                     ← Profession overview (module list)
/dashboard/workshops/[workshopSlug]/[moduleSlug]        ← Module (section list + content)
/dashboard/workshops/[workshopSlug]/[moduleSlug]/[sectionSlug]  ← Individual section
```

---

## Design System

### Profession Colors

| Profession | Color | Hex |
|---|---|---|
| Software Engineer | Indigo | `#6366f1` |
| Backend Engineer | Emerald | `#10b981` |
| Frontend Engineer | Sky | `#0ea5e9` |
| Full Stack Engineer | Violet | `#8b5cf6` |
| AI Engineer | Amber | `#f59e0b` |
| AI Product Manager | Rose | `#f43f5e` |
| ICT Project Manager | Teal | `#14b8a6` |

### Typography

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Workshop title | Space Grotesk | 48px | Bold | Profession color |
| Module title | Space Grotesk | 32px | Bold | White |
| Section title | Space Grotesk | 24px | Bold | White |
| Body text | System font | 16px | Normal | text-secondary |
| Code | Mono font | 14px | Normal | Syntax highlighted |
| Exercise label | Mono font | 12px | Uppercase | Profession color |
| Difficulty badge | System font | 12px | Medium | Color-coded |

### Theme

- Matches existing JP Arc space theme
- `glass-card` backgrounds for content cards
- `card-border` for section separators
- Profession color used for accents, progress bars, active states
- Dark theme only (matches dashboard)

---

## Component Library

### Section Card
- Glass card with section title
- Estimated time badge
- Completion checkbox (saves to DB on click)
- Difficulty badge (beginner=green, intermediate=amber, advanced=red)
- Type indicator (lesson/exercise/quiz icon)

### Exercise Block
- Distinct background (darker than surrounding content)
- Numbered ("Exercise 1 of 5")
- Problem statement with constraints
- Input/output examples (for coding exercises)
- Progressive hints (3 hints, each behind a click)
- Collapsible solution with:
  - Brute force approach + code + complexity
  - Optimal approach + code + complexity
  - "Why interviewers ask this" context
  - Similar problems list

### Quiz Component
- Multiple choice (4 options)
- Instant feedback on answer (correct/wrong + explanation)
- Score saved to DB
- Retakeable (best score kept)
- End-of-quiz summary: X/Y correct, time taken

### Progress Ring
- Circular SVG progress indicator
- Shows completion percentage per module
- Profession color fill

### Interactive Checklist
- Checkboxes that save to DB per user
- Progress count ("7 of 12 completed")
- Used for self-assessment rubrics and skill inventories

### Code Block
- Syntax highlighted (Prism.js or similar — static, no API)
- Copy button
- Language label
- Line numbers for exercises

### Decision Tree
- Expandable yes/no flow
- Visual branching with arrows
- Each node is a question, each leaf is a recommendation

### Comparison Table
- Striped rows
- Sticky headers
- Horizontally scrollable on mobile
- Profession color header background

### Template Card
- Preview of template contents
- Format badge (checklist/worksheet/template)
- "Use Template" button (renders inline, no download needed)

### Breadcrumbs
- Workshops → [Profession] → [Module] → [Section]
- Clickable at each level

### Sidebar Navigation
- Sticky left sidebar (hidden on mobile, slide-out menu)
- Collapsible module groups
- Active section highlighted with profession color
- Completion tick marks on finished sections
- Progress bar per module

### Bottom Navigation
- "Previous: [section]" / "Next: [section]" buttons
- Module progress bar between them

---

## Content Standards

### Coding Exercises — LeetCode Quality

Every coding exercise MUST include:

1. **Problem title** — clear, descriptive
2. **Difficulty badge** — Easy / Medium / Hard
3. **Problem statement** — precise, unambiguous, complete
4. **Constraints** — input size limits, value ranges, edge cases
5. **Input/output format** — explicitly defined
6. **Examples** — minimum 2 examples with explanation
   - Example 1: straightforward case
   - Example 2: edge case or tricky case
7. **Hints** — 3 progressive hints
   - Hint 1: approach direction ("Think about using a hash map")
   - Hint 2: algorithm hint ("Consider sliding window technique")
   - Hint 3: near-solution hint ("Track the window boundaries with two pointers")
8. **Brute force solution** — working code + explanation + time/space complexity
9. **Optimal solution** — working code + explanation + time/space complexity
10. **Why interviewers ask this** — what skill this tests
11. **Similar problems** — 2-3 related problems for more practice
12. **Language** — Solutions in JavaScript/TypeScript (matches JP Arc's stack)

### Non-Coding Exercises

Every non-coding exercise MUST include:

1. **Clear objective** — what the user should produce
2. **Context/scenario** — realistic situation with enough detail
3. **Deliverable** — what the output looks like (template, analysis, plan)
4. **Sample answer** — complete, high-quality example answer
5. **Evaluation criteria** — how to self-assess ("good answers include X, Y, Z")

### Quizzes

- Minimum 5 questions per quiz
- 4 options per question (A/B/C/D)
- One clearly correct answer
- Explanation for correct AND incorrect answers
- Questions test understanding, not memorization

### General Content

- Write for someone who knows the basics but wants to level up
- Practical > theoretical — every concept links to a real-world scenario
- No filler paragraphs — every sentence teaches something
- Tables for comparisons, prose for explanations, code for demonstrations
- Difficulty labels on everything: beginner / intermediate / advanced
- "Last verified" dates on perishable data (costs, tool comparisons, regulations)

---

## Professions & Content

### Universal Modules

> Stored ONCE in the database, linked to all 7 professions.
> These modules appear in every workshop but are not duplicated.

#### Module 1: Career Self-Assessment
- Skills inventory checklist (30+ skills, rate 1-5, profession-specific)
- Current level diagnostic (20 questions → junior/mid/senior/staff result)
- Strengths & weaknesses matrix with action items
- Career goals worksheet (1/3/5 year planning)

#### Module 2: Job Market Intelligence
- Salary benchmarks by region (US, UK, AU, EU, remote)
- In-demand skills for 2026-2027 with trend indicators
- Industry breakdown (sectors by pay, hiring volume, growth)
- Remote vs hybrid vs onsite landscape per role
- **Last verified date required**

#### Module 3: Resume & Application Workshop
- 3 profession-specific resume examples (junior, mid, senior)
- Bullet point formula: Action verb + What + Measurable result
- 20 before/after bullet point rewrites
- ATS keyword checklist per profession
- Cover letter template with fill-in sections
- Common mistakes gallery

#### Module 4: Behavioral Interview Mastery
- 40 behavioral questions with STAR sample answers
- 15 profession-specific situational questions
- "Tell me about yourself" script builder
- Weakness question — 10 real answers
- 20 questions to ask interviewers (categorized)

#### Module 5: Salary Negotiation
- Negotiation scripts (initial offer, counter, final round)
- Benefits negotiation checklist (equity, remote, PTO, signing bonus)
- Walk-away framework
- Email templates

#### Module 6: First 90 Days Plan
- Week-by-week action plan template
- Stakeholder mapping exercise
- Quick wins identification framework
- 30/60/90 day goals worksheet

#### Module 7: Networking & Personal Brand
- LinkedIn profile optimization checklist
- Cold outreach templates (5 scenarios)
- Conference networking playbook
- Online community guide per profession
- Content creation starter kit

---

### Software Engineer

**Profession color:** Indigo `#6366f1`

#### Module: Technical Foundations
- Data structures — arrays, linked lists, stacks, queues, trees, graphs, hash maps
  - Visual explanation per structure
  - When to use each (decision guide)
  - Big O cheat sheet for all operations
- Algorithms — sorting, searching, BFS/DFS, dynamic programming, greedy, backtracking
  - Pattern recognition guide per algorithm family
- Big O reference — time/space complexity table

#### Module: Coding Exercises (50 problems)
- 20 Easy: arrays, strings, hash maps, two pointers, sliding window
- 20 Medium: trees, graphs, DP, binary search, linked lists, stacks
- 10 Hard: advanced DP, graph algorithms, system design coding
- ALL at LeetCode quality (see Content Standards above)

#### Module: System Design (10 problems)
1. URL shortener (Bitly)
2. Chat application (WhatsApp)
3. Social media feed (Twitter/X)
4. File storage (Dropbox)
5. Video streaming (YouTube)
6. Ride sharing (Uber)
7. Search engine (Google)
8. Notification system
9. Rate limiter
10. Payment system (Stripe)

Each includes: requirements clarification checklist, step-by-step walkthrough, architecture description, database schema, API design, scalability discussion, trade-offs, follow-up questions with answers

#### Module: Code Architecture (GAP CLOSED)
- SOLID principles — each with code examples and exercises
- Design patterns — factory, observer, strategy, singleton, decorator, adapter
  - When to use each (decision guide)
  - Code examples in TypeScript
  - Anti-patterns (when NOT to use)
- Clean code principles — naming, functions, classes, error handling
- Refactoring exercises — 5 messy code samples to improve

#### Module: Debugging Workshop (GAP CLOSED)
- Systematic debugging methodology — reproduce → isolate → identify → fix → verify
- Reading stack traces — 10 exercises with real stack traces
- Using debuggers — breakpoints, watch expressions, call stack navigation
- Log analysis — structured logging, log levels, searching logs
- Profiling — CPU profiling, memory profiling, finding bottlenecks
- 10 debugging exercises — buggy code to diagnose and fix

#### Module: Code Review Exercises (15 — expanded from 10)
- Race conditions (3 exercises)
- Memory leaks (2 exercises)
- SQL injection (2 exercises)
- Off-by-one errors (2 exercises)
- Null/undefined handling (2 exercises)
- API design flaws (2 exercises)
- Performance anti-patterns (2 exercises)

#### Module: Testing Workshop
- Unit testing patterns with 10 exercises
- Integration testing guide
- TDD walkthrough — build a feature test-first
- Test coverage strategy — what to test, what not to test

#### Module: DevOps Essentials (EXPANDED)
- Git workflow cheat sheet (branching, rebasing, cherry-picking)
- CI/CD pipeline design exercise
- Docker fundamentals with 5 exercises
- Deployment checklist
- Monitoring & alerting basics — metrics, dashboards, alert rules
- Infrastructure as code concepts — what it means, why it matters
- Cloud services overview — compute, storage, networking, databases

---

### Backend Engineer

**Profession color:** Emerald `#10b981`

> Includes all Software Engineer modules plus:

#### Module: API Design Workshop (15 exercises)
- REST API design — 5 real-world APIs to design from scratch
- GraphQL schema design — 3 exercises
- gRPC service definition — 2 exercises
- API versioning strategies comparison
- Pagination patterns (cursor vs offset) with trade-offs
- Error handling standardization exercise
- Rate limiting design exercise
- API documentation template

#### Module: Database Deep Dive (20 exercises)
- SQL exercises — 15 queries (joins, subqueries, window functions, CTEs)
- Schema design exercises — 5 real-world databases to model
- Indexing strategy exercises — given query patterns, design indexes
- Query optimization — 5 slow queries to fix with EXPLAIN analysis
- Migration planning checklist
- SQL vs NoSQL decision framework with 10 scenarios
- Redis/caching pattern exercises

#### Module: Authentication & Security Workshop
- OAuth2 flow walkthrough (authorization code, PKCE, client credentials)
- JWT deep dive — structure, signing, refresh token rotation
- OWASP Top 10 with code examples per vulnerability
- Security audit checklist (40 items)
- Input validation exercise — 10 malicious inputs to catch
- SQL injection prevention exercises
- XSS prevention exercises
- CSRF protection implementation

#### Module: Scalability Workshop
- Caching strategies — when to cache, invalidation patterns, exercises
- Message queue design — 3 scenarios
- Load balancing strategies comparison
- Microservices vs monolith decision framework with 10 scenarios
- Database sharding exercise
- Connection pooling configuration exercise
- Horizontal vs vertical scaling decision tree

#### Module: Message Queues Deep Dive (GAP CLOSED)
- RabbitMQ vs Kafka vs SQS vs Redis Streams — comparison table
- When to use which — decision framework with 8 scenarios
- Dead letter queues — what they are, design exercises
- Exactly-once delivery — why it's hard, practical approaches
- Message ordering guarantees
- Consumer group patterns
- 5 exercises: design the queue architecture for real scenarios

#### Module: Containerization & Orchestration (GAP CLOSED)
- Docker deep dive — Dockerfile best practices, multi-stage builds, layer caching
- Docker Compose for local development
- Kubernetes basics — pods, deployments, services, ingress
- Container orchestration patterns for backend services
- Health checks and readiness probes
- 5 exercises: containerize different backend services

#### Module: Background Jobs & Scheduling (GAP CLOSED)
- Job queue patterns — Bull, BullMQ, Celery, SQS
- Cron job design — scheduling, overlapping prevention
- Idempotency — why it matters, how to implement
- Retry patterns — exponential backoff, dead letter queues
- Job monitoring and alerting
- 5 exercises: design background job systems

#### Module: Performance & Observability
- Query profiling — find N+1 problems
- Connection pooling tuning
- Logging best practices — structured logging format guide
- Metrics design — what to measure for 5 different systems
- Alert design — thresholds, alert fatigue prevention
- Incident response playbook template
- Postmortem template with real examples

---

### Frontend Engineer

**Profession color:** Sky `#0ea5e9`

> Includes all Software Engineer modules plus:

#### Module: Component Architecture (10 exercises)
- Component library design — button, modal, form, table, dropdown
- Composition patterns — render props, compound components, hooks
- State management decision tree
- Component API design — props interface exercises
- Storybook documentation exercise

#### Module: CSS & Layout Mastery (20 exercises)
- Flexbox — 10 layout challenges
- CSS Grid — 5 layout challenges
- Responsive design — 5 breakpoint exercises (mobile-first)
- Animation performance — transform vs layout properties, 3 exercises
- CSS architecture — BEM, CSS modules, Tailwind, CSS-in-JS comparison
- Dark mode implementation exercise
- Design token system exercise

#### Module: State Management Deep Dive (GAP CLOSED)
- Local state vs global state — decision tree
- Redux — when to use, core concepts, exercises
- Zustand — lightweight alternative, migration from Redux
- Jotai — atomic state management
- React Query / TanStack Query — server state management
- When to use which — decision matrix with 10 scenarios
- Migration exercises — refactor from one to another

#### Module: TypeScript for Frontend (GAP CLOSED)
- Generics — practical exercises (typed API responses, form handlers)
- Discriminated unions — component props, state machines
- Type narrowing — guards, assertions, control flow
- Utility types — Partial, Required, Pick, Omit, Record exercises
- Template literal types — route typing, event names
- 10 exercises: fix type errors in real components

#### Module: Build Tools & Bundlers (GAP CLOSED)
- Webpack — configuration walkthrough, optimization
- Vite — why it's faster, configuration
- Turbopack — Next.js bundler, comparison
- Bundle analysis — identifying large dependencies
- Tree shaking — how it works, common pitfalls
- 5 exercises: optimize bundle configurations

#### Module: SSR/SSG/ISR Rendering Strategies (GAP CLOSED)
- Server-side rendering — when to use, data fetching patterns
- Static site generation — build-time rendering, revalidation
- Incremental static regeneration — on-demand revalidation
- Streaming SSR — React Suspense, progressive loading
- Client-side rendering — SPAs, when it's still the right choice
- Decision framework: which rendering strategy for 10 scenarios
- Hydration — what it is, hydration mismatches, debugging

#### Module: Performance Workshop (10 exercises)
- Core Web Vitals optimization — LCP, FID, CLS exercises
- Lazy loading — images, components, routes
- Code splitting — route-based, component-based
- Bundle analysis — find what's large
- Image optimization checklist
- Font loading strategy comparison
- Render optimization — memo, useMemo, useCallback decision guide

#### Module: Accessibility Workshop (15 exercises)
- WCAG 2.1 checklist (50 items) with pass/fail examples
- Screen reader testing guide — VoiceOver, NVDA
- ARIA patterns — 10 common widgets
- Keyboard navigation exercises — 5 components
- Color contrast checker exercise
- Form accessibility checklist
- Focus management exercises

#### Module: Browser Internals
- Rendering pipeline — parse → style → layout → paint → composite
- Event loop — 10 "what prints first?" exercises
- Memory management — garbage collection, leak detection
- Network waterfall reading exercises
- DevTools mastery — 10 debugging scenarios

#### Module: Design Collaboration
- Reading Figma specs — spacing, typography, colors exercise
- Design tokens implementation exercise
- Handoff workflow — designer → developer checklist
- Pushing back on designs — 5 scenarios with scripts

---

### Full Stack Engineer

**Profession color:** Violet `#8b5cf6`

> IMPORTANT: Does NOT repeat Backend/Frontend content.
> Focuses on INTEGRATION and END-TO-END decision making.
> References Backend/Frontend modules where relevant.

#### Module: Architecture Decisions (10 scenarios)
- Monorepo vs polyrepo — decision framework with 5 scenarios
- When to split frontend/backend vs keep together
- Framework selection matrix (Next.js vs Remix vs SvelteKit vs Nuxt)
- Hosting decision tree (Vercel vs AWS vs Railway vs Fly.io)
- Build vs buy for common features (auth, payments, email, storage)

#### Module: Full Stack Project Walkthroughs (3 complete builds)
1. SaaS app — auth → database → API → dashboard → billing → deployment
2. E-commerce — catalog → cart → checkout → order management
3. Social platform — profiles → posts → feed → notifications

Each: database schema, API routes, frontend pages, auth flow, deployment config, cost estimation

#### Module: Authentication Implementation (GAP CLOSED)
- Session vs JWT — trade-offs, when to use each
- OAuth providers — Google, GitHub, LinkedIn integration
- Role-based access control (RBAC) — design and implementation
- Multi-tenancy — shared DB vs separate DB, tenant isolation
- Auth security checklist
- 5 exercises: implement auth flows for different scenarios

#### Module: End-to-End Type Safety
- TypeScript across the stack — shared types
- Zod validation patterns — 5 exercises
- API contract design — tRPC vs REST with typed clients
- Database types — Prisma schema → TypeScript types flow

#### Module: Data Flow Mastery (8 exercises)
- Client state vs server state — decision tree
- Optimistic updates — 3 implementation exercises
- Real-time patterns — WebSocket vs SSE vs polling comparison
- Form state management — 2 complex form exercises
- Cache invalidation strategies

#### Module: Deployment & CI/CD (GAP CLOSED)
- GitHub Actions — workflow configuration, secrets, matrix builds
- Vercel deployment — preview deployments, environment variables, rollback
- Railway / Fly.io — alternative deployment platforms
- Docker deployment — compose for production
- Zero-downtime deployment strategies
- 5 exercises: set up CI/CD for different project types

#### Module: Payment Integration (GAP CLOSED)
- Stripe — products, prices, subscriptions, webhooks
- Subscription models — flat, usage-based, tiered
- Webhook handling — idempotency, retry handling, signature verification
- PCI compliance basics — what you need to know
- Checkout flow design — UX patterns
- 5 exercises: implement payment flows

#### Module: Cost-Aware Architecture
- Serverless vs containers — cost calculator
- Free tier breakdown — Vercel, AWS, Supabase, Turso, Upstash
- When free tiers break — traffic thresholds
- Infrastructure cost estimation for 100 / 1K / 10K / 100K users

---

### AI Engineer

**Profession color:** Amber `#f59e0b`

> Includes all Software Engineer modules plus:

#### Module: ML Fundamentals Review
- Supervised learning — regression, classification, trees, forests, SVM
- Unsupervised learning — clustering, dimensionality reduction, anomaly detection
- Deep learning — CNN, RNN, transformers architecture breakdowns
- When to use what — decision tree for 20 problems
- Evaluation metrics — accuracy, precision, recall, F1, AUC-ROC with exercises

#### Module: NLP Fundamentals (GAP CLOSED)
- Tokenization — BPE, WordPiece, SentencePiece
- Named Entity Recognition (NER) — what it is, use cases, exercises
- Sentiment analysis — approaches, model comparison
- Text classification — traditional vs transformer-based
- Topic modeling — LDA, BERTopic
- 8 exercises: build NLP pipelines for different tasks

#### Module: Computer Vision (GAP CLOSED)
- CNN architectures — ResNet, EfficientNet, ViT (concepts, not math)
- Image classification — training, transfer learning, data augmentation
- Object detection — YOLO, SSD, Faster R-CNN comparison
- Image segmentation — semantic vs instance vs panoptic
- Multimodal models — CLIP, LLaVA, GPT-4V
- 8 exercises: build CV pipelines for different tasks

#### Module: RAG (Retrieval-Augmented Generation)
- 11 sections as detailed in conversation:
  1. What is RAG and why it exists
  2. RAG architecture deep dive
  3. Document processing
  4. Chunking strategies
  5. Embedding models
  6. Vector storage & indexing
  7. Retrieval strategies
  8. Reranking
  9. Generation with context
  10. Evaluation (MRR, Recall@K, RAGAS)
  11. Production RAG

#### Module: Hugging Face Ecosystem
- 6 sections: Hub, Transformers library, Datasets library, Training, Deployment, Advanced (PEFT, Accelerate, TRL)
- 8 exercises total

#### Module: Pinecone / Vector Databases
- 6 sections: Fundamentals, Pinecone deep dive, Comparison table (Pinecone/Weaviate/Chroma/Qdrant/pgvector), Index design patterns, Performance optimization, Migration & operations
- 5 exercises total

#### Module: LLMOps
- 8 sections: What is LLMOps, Prompt management, Evaluation pipelines, Deployment strategies, Monitoring & observability, Cost management, Incident response, Team workflows
- Exercises per section

#### Module: Fine-Tuning
- 7 sections: When to fine-tune (decision framework), Data preparation, Methods (LoRA/QLoRA), Training process, Evaluation, Platforms comparison, Production deployment
- 6 exercises total

#### Module: Agent Frameworks
- 7 sections: What are agents, Tool use, LangChain, Multi-agent systems (CrewAI/Autogen), Planning & reasoning, Agent memory, Production agents
- 5 exercises total

#### Module: Experiment Tracking (GAP CLOSED)
- MLflow — setup, experiment logging, model registry
- Weights & Biases — runs, sweeps, artifacts
- Comparing runs — metrics visualization, hyperparameter analysis
- Reproducing experiments — environment capture, random seeds
- 5 exercises: set up tracking for different ML projects

#### Module: ML System Design Interviews (GAP CLOSED)
- How ML system design differs from software system design
- Framework: problem definition → data → features → model → serving → monitoring
- 10 problems:
  1. Recommendation system (Netflix)
  2. Search ranking (Google)
  3. Fraud detection
  4. Content moderation
  5. Ad click prediction
  6. Self-driving car perception
  7. Machine translation
  8. Speech recognition
  9. Anomaly detection in time series
  10. Personalized news feed
- Each includes: clarifying questions, data pipeline, model selection, serving architecture, monitoring

#### Module: Model Serving & Deployment
- 4 sections: Serving frameworks (vLLM/TGI/Triton), Optimization (quantization/ONNX), Infrastructure (GPU selection), Containerized deployment

**Accuracy note:** Hugging Face APIs change frequently. All code examples must note library versions. Link to current docs where possible.

---

### AI Product Manager

**Profession color:** Rose `#f43f5e`

> Universal modules + profession-specific (NO coding exercises)

#### Module: PRDs (Product Requirements Documents)
- PRD template for AI products (12 sections)
- 5 complete PRD examples (AI search, chatbot, recommendations, document processing, predictive analytics)
- PRD review exercises (5 flawed PRDs to fix)
- Common PRD mistakes

#### Module: AI Product Strategy
- "Should this be AI?" framework (5 criteria, 15 scenarios)
- Build vs buy vs API decision matrix (10 scenarios)
- AI product canvas (template + 3 examples)
- Competitive moat analysis (data/model/distribution/workflow/network moats, 5 case studies)
- AI maturity model (Level 0-4 assessment)

#### Module: Technical Literacy (No Code)
- ML concepts without math (analogies + real examples)
- Model metrics explained (accuracy, precision, recall, F1, AUC-ROC)
- LLM concepts for PMs (tokens, context window, temperature, hallucination)
- Data concepts for PMs (training data, labeling, bias, privacy, pipelines)
- Infrastructure basics for PMs (GPU/CPU, cloud services, latency, scaling, costs)
- 30 questions to ask your AI team (by project phase)

#### Module: AI UX Design
- Designing for uncertainty (confidence scores, progressive disclosure)
- Error states for AI
- User feedback loops
- AI onboarding
- 10 AI UX patterns (inline suggestions, chat, side panel, etc.)

#### Module: AI Product Analytics (GAP CLOSED)
- Instrumentation for AI features — what to track, event schema
- Funnel analysis — AI feature adoption, drop-off points
- Cohort analysis — retention by AI usage level
- Feature adoption metrics — activation, engagement, retention, referral
- Dashboard design for AI products
- 5 exercises: design analytics for different AI features

#### Module: Go-to-Market for AI Products (GAP CLOSED)
- Positioning AI features — value prop, not tech spec
- Demo strategy — what to show, what to hide
- Customer education — teaching users to work with AI
- Handling "AI washing" perception — differentiation strategy
- Launch playbook for AI features
- 5 exercises: create GTM plans for AI features

#### Module: AI Team Structure (GAP CLOSED)
- How to build an ML team — roles, hiring order
- Embedded vs platform ML teams — trade-offs
- Cross-functional collaboration — PM + ML engineer + designer workflows
- Managing ML engineers — what's different from managing software engineers
- Hiring AI talent — interview questions, red flags, compensation benchmarks
- 5 exercises: design team structures for different company sizes

#### Module: Evaluation & Metrics
- Defining success for AI products (5 exercises)
- A/B testing AI features
- Human evaluation — rubric design
- Automated evaluation — LLM-as-judge, reference metrics
- Regression testing for AI
- Monitoring dashboard design

#### Module: Stakeholder Communication
- Explaining ML to executives (5 translation exercises)
- Managing AI expectations (conversation scripts)
- Roadmapping AI products (milestone-based planning)
- AI project status reporting (templates)
- Incident communication
- Vendor presentations (evaluation + negotiation)

#### Module: Cost Modeling
- Token economics (counting, pricing, estimation)
- Infrastructure cost modeling
- Build vs API break-even calculator
- Pricing AI features (4 models)
- Cost optimization strategies

#### Module: AI Regulatory Landscape
- EU AI Act (risk classification, compliance requirements, timeline)
- US AI regulation (executive order, state laws, SEC, FTC)
- Australia AI Ethics Framework (8 principles)
- Global comparison table
- Practical compliance (transparency, impact assessment, audit prep)
- **Last verified date required — regulations change frequently**

---

### ICT Project Manager

**Profession color:** Teal `#14b8a6`

> Universal modules + profession-specific (NO coding exercises)

#### Module: ICT Project Fundamentals
- ICT vs general PM — what's different
- Types of ICT projects (software, infrastructure, migration, cloud, security, ERP)
- ICT project lifecycle
- Failure statistics and common causes

#### Module: Methodologies
- Waterfall — when to use, phase gates, templates
- Agile (Scrum) — ceremonies, roles, artifacts
- Agile (Kanban) — WIP limits, flow metrics
- Hybrid — combining waterfall governance with agile execution
- PRINCE2 — 7 principles, 7 themes, 7 processes
- SAFe — PI planning, ARTs, when needed
- Decision framework: 15 scenarios, which methodology fits

#### Module: Project Initiation
- Business case development (template, NPV/ROI/IRR, 3 examples)
- Project charter (template, 3 examples)
- Stakeholder analysis (power/interest matrix, register template)
- Requirements gathering (elicitation techniques, functional/non-functional, MoSCoW)

#### Module: Project Planning
- WBS — templates for 5 project types
- Scheduling — CPM, Gantt, PERT, schedule compression
- Cost estimation & budgeting — EVM formulas, budget template
- Resource planning — ICT roles, build/buy/outsource, capacity planning
- Risk management — 40 pre-identified ICT risks, assessment matrix, response strategies
- Procurement & vendor management — RFP/RFI/RFQ, evaluation scorecard, SLAs

#### Module: Project Execution
- SDLC management — managing developers without being a developer
- Testing management — test strategy, UAT, defect management, go/no-go
- Data migration — strategies, planning template, common disasters
- Integration management — patterns, testing, API management
- Change control — change request form, CAB, impact assessment, scope creep prevention
- Communication management — plan template, status report, steering committee deck

#### Module: Infrastructure & Cloud Projects
- Cloud migration — 6 strategies, readiness assessment, wave planning, cost comparison
- Network & infrastructure — lifecycle, procurement, data center moves
- Cybersecurity projects — types, governance, frameworks (ISO 27001, NIST, Essential Eight)

#### Module: Monitoring & Controlling
- EVM deep dive — full calculations, 9 scenarios, 5 exercises
- Issue management — issue log, triage, escalation matrix
- Quality management — plan template, metrics, quality gates
- Reporting & dashboards — RAG definitions, dashboard design for 3 audiences

#### Module: Vendor & Contract Management Deep Dive (GAP CLOSED)
- SLA negotiation — response time, resolution time, availability, penalties
- Performance management — KPIs, review cadence, improvement plans
- Exit clauses — data migration, transition support, IP ownership
- Multi-vendor coordination — RACI across vendors, integration responsibility
- Dispute resolution — escalation, mediation, contract remedies
- 5 exercises: negotiate SLAs, manage underperforming vendors

#### Module: Agile at Scale (GAP CLOSED)
- SAFe PI planning exercises — step-by-step simulation
- Cross-team coordination — dependency mapping, sync ceremonies
- Dependency management — identification, tracking, risk mitigation
- Scaled retrospectives — techniques for large teams
- 5 exercises: plan and coordinate across multiple agile teams

#### Module: Benefits Realization (GAP CLOSED)
- Benefits register — identification, measurement, tracking
- Benefits measurement — baseline, target, actual comparison
- Post-implementation review — 3-month, 6-month, 12-month assessments
- Benefits reporting — templates for different stakeholders
- 5 exercises: design benefits tracking for different project types

#### Module: Disaster Recovery & Business Continuity (GAP CLOSED)
- DR planning — RTO/RPO definitions, strategy selection
- BCP testing — tabletop exercises, simulation exercises, full tests
- Failover design — active-passive, active-active, cloud DR
- Incident management integration — DR triggers, escalation
- 5 exercises: create DR plans for different infrastructure setups

#### Module: Project Closure & Handover
- Go-live planning (50-item checklist, cutover runbook, hypercare)
- Transition to operations (handover documentation, knowledge transfer, support model)
- Closure report (template with all required sections)

#### Module: ITIL & Service Management (EXPANDED)
- Service lifecycle (strategy → design → transition → operation → improvement)
- Change management — CAB process, change types, emergency changes
- Incident management — priority matrix, escalation, major incident process
- Problem management — root cause analysis, known errors, workarounds
- Release management — release planning, deployment, rollback
- Service transition planning

#### Module: Certifications & Career
- Detailed certification comparison with:
  - Provider name and official website
  - Prerequisites (experience, training hours)
  - Exam format (questions, duration, passing score)
  - Cost (exam + training)
  - Renewal requirements
  - Study resources
  - Market value assessment by region
  - **All data must be verified against provider websites**
  - **Last verified date required**
- Career progression path (Junior PM → Portfolio Manager → CIO)
- Skills gap assessment per level
- ICT PM tools mastery (Jira, MS Project, Azure DevOps, etc.)

#### Module: Frameworks & Templates Library
- 20 downloadable/usable templates (all listed in conversation)
- Each template: fill-in format with guidance notes and sample entries

---

## Cross-Workshop Rules

1. **No content duplication** — universal modules stored once, linked to all workshops. Backend/Frontend content NOT repeated in Full Stack
2. **Full Stack differentiator** — focuses on integration and end-to-end decisions, references Backend/Frontend for deep dives
3. **Software Engineer as foundation** — positioned as "fundamentals that apply everywhere," other technical workshops build on top
4. **Difficulty progression** — every module clearly labeled beginner → intermediate → advanced
5. **Perishable data** — salary benchmarks, tool comparisons, certification costs, regulations must have `lastVerified` date
6. **Mobile-friendly** — tables horizontally scrollable, code blocks wrappable, sidebar collapses to hamburger
7. **No AI calls** — all content is static, exercises are self-scored, quizzes have pre-defined answers
8. **Exercise quality** — coding exercises at LeetCode quality, non-coding exercises with complete sample answers

---

## Build Order

### Phase 1: Foundation
1. Prisma schema + migration
2. Seed script structure
3. Dashboard nav icon + routing
4. Workshop landing page (7 profession cards)
5. Profession overview page (module list)
6. Module page (section list + content renderer)
7. Section page (content + exercises + quizzes)
8. Core components (exercise block, quiz, progress ring, sidebar, breadcrumbs)

### Phase 2: Content (one profession at a time)
1. Universal modules (shared across all)
2. Software Engineer
3. Backend Engineer
4. Frontend Engineer
5. Full Stack Engineer
6. AI Engineer
7. AI Product Manager
8. ICT Project Manager

### Phase 3: Progress Tracking
1. Completion toggle API
2. Quiz scoring API
3. Progress bar calculations
4. Bookmark functionality
5. Notes per section

### Phase 4: Post-Launch
1. Public `/tools/workshops` landing page for SEO
2. Completion certificates
3. Workshop analytics (most popular modules, completion rates)
