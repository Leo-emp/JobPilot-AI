/* ============================================================
   WORKSHOP SEED SCRIPT — Seeds all workshop data
   ============================================================
   # Run with: npx tsx prisma/seed-workshops.ts
   # Seeds: Workshop → Modules → Sections (with full content)
   # Currently seeds: AI Product Manager (first profession)
   # Idempotent: uses upsert, safe to re-run.
   ============================================================ */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

/* # Import profession content from separate seed files */
import { softwareEngineerModules } from "./seeds/software-engineer";
import { backendEngineerModules } from "./seeds/backend-engineer";
import { frontendEngineerModules } from "./seeds/frontend-engineer";
import { fullStackEngineerModules } from "./seeds/full-stack-engineer";
import { aiEngineerModules } from "./seeds/ai-engineer";
import { ictProjectManagerModules } from "./seeds/ict-project-manager";

/* # Determine database URL — local dev.db or remote Turso */
const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

/* # For local file:// URLs, resolve to absolute path */
const resolvedUrl = dbUrl.startsWith("file:")
  ? `file:${path.resolve(process.cwd(), dbUrl.replace("file:", ""))}`
  : dbUrl;

/* # Create Prisma client with libSQL adapter (same as app) */
const adapter = new PrismaLibSql({
  url: resolvedUrl,
  authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

/* # Helper to create a workshop with all modules and sections */
async function seedWorkshop(data: {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  modules: {
    name: string;
    slug: string;
    description: string;
    order: number;
    sections: {
      title: string;
      slug: string;
      content: string;
      type: "lesson" | "exercise" | "quiz";
      difficulty?: "beginner" | "intermediate" | "advanced";
      estimatedMinutes: number;
      order: number;
    }[];
  }[];
}) {
  /* # Upsert the workshop */
  const workshop = await prisma.workshop.upsert({
    where: { slug: data.slug },
    create: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      color: data.color,
      order: data.order,
    },
    update: {
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      order: data.order,
    },
  });

  console.log(`  Workshop: ${data.name} (${workshop.id})`);

  /* # Seed each module */
  for (const mod of data.modules) {
    const module = await prisma.workshopModule.upsert({
      where: { workshopId_slug: { workshopId: workshop.id, slug: mod.slug } },
      create: {
        workshopId: workshop.id,
        name: mod.name,
        slug: mod.slug,
        description: mod.description,
        order: mod.order,
      },
      update: {
        name: mod.name,
        description: mod.description,
        order: mod.order,
      },
    });

    console.log(`    Module: ${mod.name} (${module.id})`);

    /* # Seed each section */
    for (const sec of mod.sections) {
      await prisma.workshopSection.upsert({
        where: { moduleId_slug: { moduleId: module.id, slug: sec.slug } },
        create: {
          moduleId: module.id,
          title: sec.title,
          slug: sec.slug,
          content: sec.content,
          type: sec.type,
          difficulty: sec.difficulty || null,
          estimatedMinutes: sec.estimatedMinutes,
          order: sec.order,
        },
        update: {
          title: sec.title,
          content: sec.content,
          type: sec.type,
          difficulty: sec.difficulty || null,
          estimatedMinutes: sec.estimatedMinutes,
          order: sec.order,
        },
      });
    }

    console.log(`      ${mod.sections.length} sections seeded`);
  }
}

/* ============================================================
   ALL WORKSHOPS — Empty shells for the 7 professions
   ============================================================ */
async function seedWorkshopShells() {
  const shells = [
    { name: "Software Engineer", slug: "software-engineer", description: "Master algorithms, system design, debugging, and software architecture from fundamentals to advanced concepts.", icon: "code", color: "#6366f1", order: 1 },
    { name: "Backend Engineer", slug: "backend-engineer", description: "Deep dive into APIs, databases, distributed systems, caching, and server-side architecture.", icon: "server", color: "#10b981", order: 2 },
    { name: "Frontend Engineer", slug: "frontend-engineer", description: "Build modern UIs with React, CSS architecture, accessibility, performance optimization, and design systems.", icon: "monitor", color: "#0ea5e9", order: 3 },
    { name: "Full Stack Engineer", slug: "full-stack-engineer", description: "End-to-end application development — frontend to backend integration, deployment, and architecture decisions.", icon: "layers", color: "#8b5cf6", order: 4 },
    { name: "AI Engineer", slug: "ai-engineer", description: "Build production AI systems — RAG, fine-tuning, LLMOps, vector databases, and ML infrastructure.", icon: "brain", color: "#f59e0b", order: 5 },
    { name: "ICT Project Manager", slug: "ict-project-manager", description: "Manage ICT projects end-to-end — methodologies, vendor management, risk, EVM, and infrastructure delivery.", icon: "calendar", color: "#14b8a6", order: 7 },
  ];

  for (const shell of shells) {
    await prisma.workshop.upsert({
      where: { slug: shell.slug },
      create: { ...shell, modules: undefined } as any,
      update: { name: shell.name, description: shell.description, icon: shell.icon, color: shell.color, order: shell.order },
    });
    console.log(`  Shell: ${shell.name}`);
  }
}

/* ============================================================
   AI PRODUCT MANAGER — Full Content
   ============================================================ */
async function seedAIProductManager() {
  await seedWorkshop({
    name: "AI Product Manager",
    slug: "ai-product-manager",
    description: "Master AI product strategy, PRDs, technical literacy, UX design, analytics, go-to-market, and stakeholder communication.",
    icon: "chart",
    color: "#f43f5e",
    order: 6,
    modules: [
      /* ============================================================
         MODULE 1: PRDs (Product Requirements Documents)
         ============================================================ */
      {
        name: "PRDs (Product Requirements Documents)",
        slug: "prds",
        description: "Write world-class PRDs for AI products — templates, examples, reviews, and common mistakes.",
        order: 1,
        sections: [
          {
            title: "The AI PRD Template",
            slug: "ai-prd-template",
            type: "lesson",
            difficulty: "beginner",
            estimatedMinutes: 25,
            order: 1,
            content: `## The AI PRD Template

A Product Requirements Document (PRD) is the single most important document an AI Product Manager writes. It aligns engineering, design, data science, and leadership around what you're building, why, and how you'll know it works.

AI products need a different PRD structure than traditional software. Traditional PRDs focus on deterministic inputs and outputs — click this button, see this screen. AI products deal with probabilistic outputs, model performance thresholds, data dependencies, and failure modes that don't exist in conventional software.

### Why AI PRDs Are Different

Traditional software has predictable behavior. If a user clicks "Submit," the form submits. Every time. AI products introduce uncertainty at their core. A recommendation engine might suggest great products 85% of the time and irrelevant ones 15% of the time. Your PRD needs to define what "good enough" means, how the system handles the 15%, and how you'll improve over time.

### The 12-Section AI PRD Template

Every AI PRD should contain these 12 sections. Missing any one creates ambiguity that leads to engineering rework, misaligned expectations, or products that technically work but don't solve the user's problem.

#### 1. Executive Summary
One paragraph. What are we building, for whom, and why now? Include the expected business impact in concrete terms.

> **Example:** "We're building an AI-powered document classifier that automatically categorizes incoming support tickets into 15 categories with 90%+ accuracy, reducing manual triage time by 70% for our 50-person support team. This addresses the #1 pain point from our Q3 support team survey and unblocks the routing automation initiative."

#### 2. Problem Statement
Describe the user problem with evidence. Include user quotes, data, and the cost of the status quo. Avoid describing the solution here.

**Key questions to answer:**
- Who has this problem? (be specific — not "users" but "enterprise support managers with 50+ daily tickets")
- How painful is it? (quantify: time, money, error rate, satisfaction score)
- What do they do today? (current workaround)
- Why hasn't this been solved before? (what's changed — new model capabilities, data availability, cost reduction)

#### 3. Goals & Success Metrics
Define 2-4 measurable goals. Each needs a metric, target, and measurement method.

| Goal | Metric | Target | How to Measure |
|------|--------|--------|----------------|
| Accuracy | Classification accuracy | >90% on production data | Weekly automated eval against human labels |
| Speed | Triage time reduction | 70% reduction | Compare avg triage time before/after |
| Adoption | Support team usage | >80% of tickets auto-classified | Daily usage dashboard |
| Satisfaction | Team NPS | +20 points | Monthly survey |

#### 4. User Stories & Personas
Write 3-5 user stories in standard format. For AI products, include stories about the AI working correctly AND incorrectly.

- "As a support manager, I want tickets auto-classified so I can focus on resolution instead of routing."
- "As a support agent, I want to see the AI's confidence level so I can quickly verify or correct the classification."
- "As a support agent, when the AI misclassifies a ticket, I want to correct it in one click so the system learns."

#### 5. AI-Specific Requirements
This is where AI PRDs diverge most from traditional PRDs.

**Model Requirements:**
- Input: What data does the model consume? (ticket text, metadata, attachments?)
- Output: What does the model produce? (category label, confidence score, top-3 predictions?)
- Performance floor: What's the minimum acceptable accuracy before launch?
- Latency: How fast must the prediction be? (real-time vs batch)
- Confidence threshold: Below what confidence should the system fall back to human review?

**Data Requirements:**
- Training data: What labeled data exists? How much? What's the quality?
- Data pipeline: How does new data flow in for retraining?
- Privacy: Any PII in the input data? GDPR/CCPA implications?
- Bias considerations: Could the model discriminate against certain ticket types or users?

#### 6. User Experience
Describe the user flow, not pixel-perfect designs. Focus on:
- How users interact with AI predictions
- How confidence is communicated
- The correction/feedback mechanism
- Progressive disclosure of AI features
- Graceful degradation when AI fails

#### 7. Technical Architecture (High Level)
Not a system design doc — just enough for alignment:
- Model approach (fine-tuned classifier? LLM with prompt? Hybrid?)
- Infrastructure (where does it run? GPU requirements?)
- Integration points (which systems does it connect to?)
- Data flow diagram

#### 8. Edge Cases & Failure Modes
AI products have unique failure modes. Document them explicitly:
- What happens when confidence is low?
- What happens with out-of-distribution inputs? (new ticket categories)
- What happens when the model is down? (fallback to manual)
- What happens with adversarial inputs?
- What happens with multilingual content?

#### 9. Rollout Strategy
AI products should never launch to 100% on day one.
- Phase 1: Shadow mode (AI classifies, humans still do it, compare results)
- Phase 2: Human-in-the-loop (AI classifies, human approves)
- Phase 3: Auto-classify high confidence, human reviews low confidence
- Phase 4: Full automation with monitoring

#### 10. Monitoring & Observability
What dashboards and alerts do you need?
- Model accuracy over time (drift detection)
- Confidence score distribution
- Human override rate
- Latency percentiles
- Error rate by category

#### 11. Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Model accuracy drops below 85% | Medium | High | Automated retraining trigger + alert |
| Biased predictions for certain categories | Low | High | Regular bias audit, per-category accuracy tracking |
| Training data becomes stale | High | Medium | Monthly retraining with latest tickets |

#### 12. Timeline & Milestones
Use milestone-based planning, not sprint-based. AI projects are harder to estimate.
- Milestone 1: Data pipeline + labeled dataset ready
- Milestone 2: Model v1 trained, accuracy > 80%
- Milestone 3: Shadow mode deployment
- Milestone 4: Human-in-the-loop launch
- Milestone 5: Full automation launch

---

### Template Checklist

Before submitting your PRD for review, verify:
- Every section has concrete details, not placeholder text
- Success metrics have specific numbers, not "improve" or "increase"
- AI-specific requirements cover input, output, performance floor, and latency
- At least 3 failure modes are documented with mitigation strategies
- Rollout strategy has at least 2 phases (never "launch to everyone")
- Monitoring section defines at least 3 dashboards or alerts`,
          },
          {
            title: "PRD Example: AI Search Engine",
            slug: "prd-example-ai-search",
            type: "lesson",
            difficulty: "intermediate",
            estimatedMinutes: 20,
            order: 2,
            content: `## PRD Example: AI-Powered Internal Search

This is a complete, production-quality PRD for an AI search feature. Study the structure, specificity, and how AI-specific concerns are handled.

---

### 1. Executive Summary

We're building an AI-powered semantic search for our internal knowledge base (12,000+ documents across Confluence, Google Drive, and Notion). Current keyword search returns relevant results for only 40% of queries (measured via click-through on first-page results). AI search will use embeddings and retrieval-augmented generation to deliver relevant results for 85%+ of queries and provide direct answers for factual questions, reducing the average search-to-answer time from 4.5 minutes to under 30 seconds.

### 2. Problem Statement

**Who:** 2,400 employees across engineering, sales, support, and operations.

**Pain:** Employees spend an average of 35 minutes per day searching for internal information (time-tracking study, Q2 2026). 62% report "can't find what I need" as a top-3 frustration in the annual survey. New hires take 3x longer to find answers than tenured employees.

**Current workaround:** Employees ask in Slack channels (800+ search-related messages/week in #general and #help channels), message colleagues directly, or recreate documents that already exist.

**Why now:** Embedding models have reached quality/cost thresholds that make semantic search practical. OpenAI's text-embedding-3-small costs $0.02 per 1M tokens — indexing our entire knowledge base costs under $5.

### 3. Goals & Success Metrics

| Goal | Metric | Target | Measurement |
|------|--------|--------|-------------|
| Relevance | Click-through on top-3 results | >85% (from 40%) | Search analytics |
| Speed | Time from query to answer | <30 seconds avg | Frontend instrumentation |
| Adoption | Daily active searchers | >60% of employees | Usage dashboard |
| Satisfaction | Search NPS | >50 (from -10) | Monthly pulse survey |
| Efficiency | Slack search questions | -50% | Slack analytics |

### 4. User Stories

- "As an engineer, I want to search across all our documentation in natural language so I can find architecture decisions without knowing exact keywords."
- "As a sales rep, I want to ask 'what's our pricing for enterprise plans with SSO?' and get a direct answer with the source document linked."
- "As a new hire, I want search to understand my question even when I don't know our internal terminology yet."
- "As any employee, when search gives me a wrong or outdated answer, I want to flag it so the system improves."

### 5. AI-Specific Requirements

**Model Requirements:**
- Embedding model: text-embedding-3-small (1536 dimensions)
- Reranker: Cohere rerank-v3.5 for top-20 → top-5 reranking
- Answer generation: GPT-4o-mini for direct answer synthesis
- Relevance threshold: cosine similarity > 0.72 to include in results
- Answer confidence: only show direct answers when reranker score > 0.85
- Latency: <2 seconds for search results, <5 seconds for generated answers

**Data Requirements:**
- Index: 12,000 documents, ~50M tokens total
- Refresh: incremental indexing every 6 hours via webhooks
- Chunking: 512 tokens with 64-token overlap
- Metadata: source, author, last modified, department, document type
- Privacy: exclude documents marked "Confidential" or "HR-only" unless user has access

### 6. User Experience

**Search flow:**
1. User types natural language query in search bar
2. Results appear in <2 seconds: top 5 document chunks with highlighted excerpts
3. If confidence is high, a "Direct Answer" card appears above results with the synthesized answer and source citations
4. Each result shows: title, excerpt with highlight, source system icon, last updated date, relevance score (shown as relevance bar, not a number)
5. User can click "Not helpful" on any result (feeds back to reranking model)

**Zero-results state:** "No results found" is unacceptable. If semantic search returns nothing above threshold, fall back to keyword search. If keyword search also fails, suggest related terms and show recently popular searches.

### 7. Technical Architecture

**Components:**
- Vector database: Pinecone (serverless, auto-scaling)
- Embedding pipeline: Node.js service, processes document webhooks
- Search API: FastAPI service, handles query → embedding → search → rerank → answer
- Frontend: React component embedded in existing intranet

**Data flow:**
Document created/updated → Webhook → Chunking service → Embedding API → Pinecone upsert
User query → Embedding API → Pinecone search → Cohere rerank → (optional) GPT-4o-mini answer → Response

### 8. Edge Cases & Failure Modes

| Scenario | Handling |
|----------|---------|
| Query about very recent document (not yet indexed) | Show "Results may not include documents from the last 6 hours" banner |
| Ambiguous query | Show "Did you mean..." with 2-3 interpretations |
| Generated answer is wrong | "Flag as incorrect" button, triggers human review |
| Pinecone is down | Fall back to keyword search with "AI search temporarily unavailable" banner |
| Query contains PII | Do not log the query, only log anonymized metadata |
| Multilingual query | Support English only at launch, show "English queries only" message |

### 9. Rollout Strategy

- **Week 1-2:** Shadow mode — index all documents, run queries through AI search in background, compare results to keyword search
- **Week 3-4:** Beta — 200 employees (50 per department), opt-in, feedback form
- **Week 5-6:** Controlled rollout — 50% of employees, A/B test against keyword search
- **Week 7+:** Full rollout with monitoring

### 10. Monitoring

- **Accuracy dashboard:** relevance score distribution, click-through rates, "not helpful" rates
- **Performance dashboard:** P50/P95/P99 latency, Pinecone query times, embedding API latency
- **Usage dashboard:** DAU, queries per user, peak hours, popular queries
- **Cost dashboard:** API costs (embeddings, reranking, answer generation) per day
- **Alert:** if click-through drops below 70% for 24 hours, page the search team

### 11. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Hallucinated answers | Medium | High | Only show answers above 0.85 confidence; always show source documents |
| Stale index | Medium | Medium | 6-hour refresh; show "last indexed" timestamp on results |
| Cost overrun | Low | Medium | Rate limit to 50 queries/user/day; cache common queries |
| Data leak (showing restricted docs) | Low | Critical | Access control check on every result before returning |

### 12. Timeline

| Milestone | Target | Criteria |
|-----------|--------|----------|
| Infrastructure ready | Week 2 | Pinecone provisioned, embedding pipeline running |
| Full index built | Week 3 | All 12K documents indexed, <1% error rate |
| Search API v1 | Week 4 | Semantic search working, latency <2s |
| Answer generation | Week 5 | Direct answers with citations, confidence filtering |
| Beta launch | Week 6 | 200 users, feedback collection active |
| Full launch | Week 9 | All employees, monitoring dashboards live |

---

### Key Takeaways

Notice how this PRD:
- Quantifies the problem (35 min/day, 40% click-through, 800 Slack messages/week)
- Sets specific thresholds (cosine similarity > 0.72, reranker > 0.85, <2s latency)
- Handles AI uncertainty (confidence thresholds, fallbacks, "not helpful" feedback)
- Plans for failure (every edge case has a handling strategy)
- Rolls out gradually (shadow → beta → A/B → full)
- Monitors continuously (4 dashboards, automated alerts)`,
          },
          {
            title: "PRD Example: AI Chatbot",
            slug: "prd-example-chatbot",
            type: "lesson",
            difficulty: "intermediate",
            estimatedMinutes: 20,
            order: 3,
            content: `## PRD Example: Customer Support AI Chatbot

A complete PRD for a customer support chatbot that handles tier-1 queries before escalating to human agents.

---

### 1. Executive Summary

We're building an AI chatbot for our customer support portal that handles tier-1 queries (account questions, billing inquiries, feature how-tos) autonomously, escalating complex issues to human agents. Currently, 65% of our 2,000 daily support tickets are tier-1 questions with known answers. The chatbot will resolve 50%+ of these autonomously (650+ tickets/day), reducing first-response time from 4 hours to under 10 seconds and saving approximately $180,000/year in support costs.

### 2. Problem Statement

**Who:** 15,000 monthly active users who contact support, and our 30-person support team.

**Pain:** Support team handles 2,000 tickets/day. 65% are repetitive tier-1 questions (password resets, billing dates, feature locations). Average first-response time is 4 hours. CSAT score is 3.2/5 — primarily driven by slow response times, not resolution quality. Support costs are $45/ticket average.

**Current workaround:** Users search our help center (30% success rate by help center analytics), then submit a ticket and wait. Some ask in community forums (avg 12-hour response). Many just give up — exit surveys show 22% of users who considered contacting support didn't.

**Why now:** LLMs can now maintain context across multi-turn conversations and reliably extract structured data (account IDs, dates) from natural language, making autonomous resolution of structured queries feasible.

### 3. Goals & Success Metrics

| Goal | Metric | Target | Measurement |
|------|--------|--------|-------------|
| Deflection | Tickets resolved without human | >50% of tier-1 | Ticket tracking system |
| Speed | First response time | <10 seconds | Chat analytics |
| Quality | CSAT for bot-resolved tickets | >4.0/5 | Post-chat survey |
| Safety | Escalation accuracy | >95% correct escalations | Weekly audit of 100 escalated tickets |
| Cost | Cost per bot resolution | <$0.50 | API costs / resolutions |

### 4. User Stories

- "As a user, I want to ask about my billing date in plain English and get an immediate answer without waiting for a human."
- "As a user, when the chatbot can't help me, I want to be transferred to a human agent who already has context of my conversation."
- "As a support agent, I want to see the chatbot's conversation history when a ticket is escalated so I don't ask the user to repeat themselves."
- "As a support manager, I want to see which questions the bot struggles with so I can improve our knowledge base."

### 5. AI-Specific Requirements

**Model Requirements:**
- Base model: GPT-4o-mini (cost-efficient for high volume)
- System prompt: Strictly bounded to support topics, refuses off-topic requests
- Context window: Last 10 messages + user account data + relevant help articles
- Response latency: <3 seconds per message
- Confidence: If the model's response references information not in the provided context, flag for human review

**Conversation Guardrails:**
- Maximum 8 bot turns before offering human escalation
- Never provide medical, legal, or financial advice
- Never reveal internal processes, pricing strategies, or employee information
- Never modify user accounts directly (can look up information, not change it)
- If user expresses frustration (detected via sentiment), immediately offer human escalation

**Knowledge Base:**
- Source: 500 help center articles + 200 FAQ entries + product documentation
- RAG retrieval: top 3 articles per query, similarity threshold > 0.75
- Refresh: re-index when articles are updated (webhook-triggered)

### 6. User Experience

**Chat widget:**
- Bottom-right corner of support portal and product dashboard
- Opens with: "Hi! I'm here to help with account, billing, and product questions. What can I help you with?"
- Shows typing indicator while generating response
- Each bot message has a thumbs up/down feedback button
- "Talk to a human" button always visible

**Escalation flow:**
1. Bot determines it can't help (low confidence, off-topic, user frustrated, or 8+ turns)
2. Bot says: "Let me connect you with a support specialist who can help with this."
3. Creates ticket with full conversation transcript + bot's assessment of the issue
4. If agents are online: live transfer. If offline: "A specialist will follow up within [SLA time]."

**Account verification:**
- Bot asks for email to look up account
- Sends one-time code to email for verification
- After verification: can access account-specific information (plan, billing date, usage)
- Without verification: can only answer general product questions

### 7. Technical Architecture

**Components:**
- Chat frontend: React widget with WebSocket connection
- Chat backend: Node.js service managing conversation state
- RAG pipeline: Pinecone for help article embeddings, retrieval on each user message
- LLM orchestration: LangChain for prompt templating, tool calling, guardrails
- Account API: Internal API for user data lookup (read-only)
- Ticket system: Integration with Zendesk for escalation

### 8. Edge Cases & Failure Modes

| Scenario | Handling |
|----------|---------|
| User asks about competitor products | "I can only help with [Product Name] questions. Is there anything about our product I can help with?" |
| User asks to delete their account | Do NOT process. Say "Account deletion requires verification. I'll connect you with our team." Escalate. |
| User sends abusive messages | Respond once: "I understand you're frustrated. Let me connect you with a specialist." Auto-escalate. |
| LLM API is down | Show: "Our AI assistant is temporarily unavailable. Connecting you to our support team." Create ticket. |
| User sends image/file | "I can only process text messages right now. Could you describe your issue in text?" |
| User asks in non-English language | Detect language, respond: "I currently support English only. Let me connect you with our team." |

### 9. Rollout Strategy

- **Phase 1 (Week 1-2):** Internal testing — support team uses the bot, rates every response
- **Phase 2 (Week 3-4):** Shadow mode — bot runs alongside live chat, support team sees bot suggestions but users don't
- **Phase 3 (Week 5-6):** 10% of users see the bot as first touchpoint (A/B test against direct ticket submission)
- **Phase 4 (Week 7-8):** 50% rollout if Phase 3 CSAT > 3.8 and deflection > 40%
- **Phase 5 (Week 9+):** Full rollout with continuous monitoring

### 10. Monitoring

- **Resolution dashboard:** daily deflection rate, resolution rate by category, escalation reasons
- **Quality dashboard:** CSAT scores, thumbs up/down ratio, conversation length distribution
- **Safety dashboard:** guardrail triggers, off-topic requests, abuse detection, failed escalations
- **Cost dashboard:** API costs per conversation, cost per resolution, daily spend
- **Alerts:** CSAT drops below 3.5 → page PM. Deflection drops below 40% → page PM. Cost per resolution exceeds $1 → email PM.

### 11. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Bot gives wrong account info | Medium | High | Read-only API access, always show "verify this in your dashboard" disclaimer |
| Bot can't handle edge cases | High | Medium | Easy escalation, weekly review of failed conversations to improve prompts |
| Users refuse to talk to a bot | Medium | Medium | "Talk to a human" always visible, don't force bot interaction |
| Cost exceeds budget | Low | Medium | Per-conversation token limit (4K tokens max), caching common queries |

### 12. Timeline

| Milestone | Target | Criteria |
|-----------|--------|----------|
| Knowledge base indexed | Week 2 | 500 articles in Pinecone, retrieval working |
| Chat MVP (no account access) | Week 4 | General questions answered, escalation working |
| Account verification flow | Week 6 | Email OTP, account data lookup |
| Internal testing complete | Week 7 | >90% support team approval |
| Public beta (10%) | Week 8 | A/B test running |
| Full launch | Week 11 | All metrics at target |

---

### Key Takeaways

This PRD demonstrates:
- Clear conversation guardrails (what the bot must never do)
- Account verification flow (security for AI-accessed data)
- Escalation design (smooth handoff with context preservation)
- Safety monitoring (separate dashboard for guardrail triggers)
- Gradual rollout with clear go/no-go criteria at each phase`,
          },
          {
            title: "PRD Review Exercises",
            slug: "prd-review-exercises",
            type: "exercise",
            difficulty: "intermediate",
            estimatedMinutes: 40,
            order: 4,
            content: `## PRD Review Exercises

Practice identifying problems in flawed PRDs. Each exercise presents a PRD section with issues — find them all.

---

### Exercise 1: Vague Success Metrics

**The PRD says:**

> **Goals:** Our AI recommendation engine will improve user engagement and increase revenue. We want users to find recommendations helpful and use them regularly.

**What's wrong?** Find at least 4 issues with this goals section.

<details>
<summary>Click to reveal answer</summary>

**Issues found:**

1. **No specific metrics** — "improve engagement" is not measurable. Which engagement metric? Session duration? Click-through? Return visits?
2. **No targets** — "increase revenue" by how much? 5%? 50%? Without a target, you can't evaluate success.
3. **No measurement method** — how will you measure "helpful"? Surveys? Click-through? Dwell time?
4. **No timeline** — by when should these goals be achieved?
5. **"Users" is too broad** — which users? All users? New users? Power users?

**Better version:**

| Goal | Metric | Target | Timeline | Measurement |
|------|--------|--------|----------|-------------|
| Engagement | Recommendation click-through rate | >15% (from 8%) | 3 months post-launch | Analytics event tracking |
| Revenue | Revenue per recommendation click | >$2.50 avg | 3 months post-launch | Attribution model |
| Satisfaction | Recommendation helpfulness rating | >4.0/5.0 | Monthly | In-product survey (sample 5% of users) |

</details>

---

### Exercise 2: Missing Failure Modes

**The PRD says:**

> **Edge Cases:** If the AI model returns an error, we'll show a generic error message. If the user's input is too long, we'll truncate it.

**What's wrong?** List at least 5 failure modes this PRD is missing.

<details>
<summary>Click to reveal answer</summary>

**Missing failure modes:**

1. **Low confidence predictions** — what happens when the model isn't sure? No confidence threshold defined.
2. **Model latency spike** — what if the model takes 30 seconds instead of 2? No timeout or fallback.
3. **Out-of-distribution inputs** — what about inputs the model has never seen? (e.g., new product categories)
4. **Adversarial inputs** — what if users try to manipulate the model? (prompt injection, jailbreaking)
5. **Data freshness** — what if the model recommends discontinued products or outdated information?
6. **Bias** — what if recommendations favor certain demographics or price ranges unfairly?
7. **Model degradation** — what if accuracy slowly drops over weeks? No monitoring or drift detection.
8. **Concurrent failures** — what if both the model AND the fallback fail?
9. **Truncation side effects** — truncating user input changes the meaning. Better to reject with a clear message.

</details>

---

### Exercise 3: No Rollout Strategy

**The PRD says:**

> **Launch Plan:** We'll deploy the AI feature to all users on March 15th after completing QA testing.

**What's wrong?** Write a better rollout strategy for this AI feature.

<details>
<summary>Click to reveal answer</summary>

**Issues:**

1. **No gradual rollout** — deploying AI to 100% of users on day one is reckless. There's no safety net.
2. **No shadow mode** — haven't validated against real production data.
3. **No A/B test** — no way to measure if the AI is actually better than the current experience.
4. **No rollback plan** — what if something goes catastrophically wrong on March 15th?
5. **"After QA testing"** — QA testing for AI features requires production-like data, not synthetic test cases.

**Better rollout strategy:**

- **Phase 1 (Feb 15-28): Shadow mode** — run AI predictions alongside current system, log results, compare accuracy. Go/no-go: AI matches or beats current system on 1,000+ predictions.
- **Phase 2 (Mar 1-7): Internal dogfood** — employees use the AI feature. Collect qualitative feedback. Fix critical issues.
- **Phase 3 (Mar 8-14): 5% canary** — random 5% of users get AI feature. Monitor all metrics. Kill switch ready.
- **Phase 4 (Mar 15-21): 25% rollout** — expand if canary metrics are healthy. A/B test against control.
- **Phase 5 (Mar 22-28): 50% rollout** — expand if A/B test shows improvement.
- **Phase 6 (Apr 1): 100% rollout** — full launch with monitoring dashboards live.

Each phase has explicit go/no-go criteria and a documented rollback procedure.

</details>

---

### Exercise 4: Weak AI Requirements

**The PRD says:**

> **AI Requirements:** We'll use GPT-4 for the AI feature. It should be accurate and fast.

**What's wrong?** Rewrite this section with proper AI-specific requirements.

<details>
<summary>Click to reveal answer</summary>

**Issues:**

1. **"GPT-4"** — which version? GPT-4o? GPT-4o-mini? GPT-4-turbo? Each has different cost, speed, and capability.
2. **"Accurate"** — by what measure? What's the minimum accuracy threshold?
3. **"Fast"** — how fast? <1 second? <5 seconds? P50 or P99?
4. **No cost constraints** — GPT-4 is expensive. What's the per-request budget?
5. **No input/output spec** — what exactly goes in? What comes out?
6. **No fallback model** — what if GPT-4 is down or rate-limited?

**Better version:**

**Model Requirements:**
- Primary model: GPT-4o-mini (cost: ~$0.15/1M input tokens, $0.60/1M output tokens)
- Fallback model: GPT-3.5-turbo if primary is unavailable or rate-limited
- Input: User query (max 500 tokens) + retrieved context (max 2,000 tokens) + system prompt (300 tokens)
- Output: Structured JSON response with answer (max 500 tokens), confidence score (0-1), source citations
- Accuracy target: >90% on our evaluation set of 500 labeled queries
- Latency target: P50 <1.5s, P95 <3s, P99 <5s
- Cost target: <$0.003 per request average
- Confidence threshold: only show AI answer when confidence > 0.8

</details>

---

### Exercise 5: Missing Monitoring

**The PRD says:**

> **Monitoring:** We'll track usage metrics in our existing analytics dashboard.

**What's wrong?** Design a proper monitoring plan for this AI feature.

<details>
<summary>Click to reveal answer</summary>

**Issues:**

1. **"Existing dashboard"** — AI features need AI-specific monitoring, not just page views and clicks.
2. **"Usage metrics"** only — missing accuracy, cost, latency, and safety metrics.
3. **No alerting** — when something goes wrong, how do you find out? (Answer: angry users, which is too late.)
4. **No drift detection** — AI accuracy degrades over time. You need to measure this continuously.

**Better monitoring plan:**

**Dashboard 1: Model Performance**
- Accuracy: daily accuracy on a held-out evaluation set (auto-run, compared to baseline)
- Drift: weekly distribution comparison of input data vs training data
- Confidence: histogram of confidence scores (alerts if distribution shifts)
- Override rate: % of AI decisions overridden by users

**Dashboard 2: User Experience**
- Latency: P50, P95, P99 response times (line chart, 24-hour window)
- Satisfaction: thumbs up/down ratio, CSAT scores
- Adoption: DAU, queries/user/day, feature retention curve

**Dashboard 3: Cost & Operations**
- API costs: daily spend by model, cost per request
- Token usage: input/output token counts, prompt optimization opportunities
- Rate limits: how close to API limits, throttling events
- Errors: API errors, timeout rate, fallback invocations

**Alerts:**
- Accuracy drops below 85% for 24 hours → Slack alert to AI team
- P95 latency exceeds 5 seconds → PagerDuty
- Daily API cost exceeds 150% of budget → Email to PM and engineering manager
- Error rate exceeds 5% → PagerDuty

</details>`,
          },
          {
            title: "PRD Knowledge Check",
            slug: "prd-quiz",
            type: "quiz",
            difficulty: "beginner",
            estimatedMinutes: 10,
            order: 5,
            content: `## PRD Knowledge Check

Test your understanding of AI PRD best practices.

<!--quiz
[
  {
    "question": "What is the most important difference between an AI PRD and a traditional software PRD?",
    "options": [
      "AI PRDs need to define model performance thresholds, confidence levels, and failure modes for probabilistic outputs",
      "AI PRDs are longer and more detailed than traditional PRDs",
      "AI PRDs need to include the model architecture and training code",
      "AI PRDs should be written by the ML engineer, not the product manager"
    ],
    "correctIndex": 0,
    "explanation": "AI products produce probabilistic outputs, unlike the deterministic behavior of traditional software. The PRD must define what 'good enough' looks like (performance thresholds), how to handle uncertainty (confidence levels), and what happens when the AI is wrong (failure modes). The other options are incorrect: AI PRDs aren't necessarily longer, they don't include training code, and they should be written by the PM with input from ML engineers."
  },
  {
    "question": "A PRD states: 'The AI feature will be accurate and fast.' What is the primary problem with this requirement?",
    "options": [
      "It uses technical jargon that stakeholders won't understand",
      "It doesn't specify which AI model to use",
      "It's not measurable — there are no specific accuracy thresholds, latency targets, or measurement methods",
      "It doesn't mention the cost of the AI feature"
    ],
    "correctIndex": 2,
    "explanation": "'Accurate and fast' are meaningless without numbers. A proper requirement specifies: accuracy target (e.g., >90% on evaluation set), latency target (e.g., P95 <3 seconds), and how these will be measured (e.g., weekly automated eval against human labels). Without specific targets, you can't evaluate whether the feature is ready to launch."
  },
  {
    "question": "Why should an AI product never launch to 100% of users on day one?",
    "options": [
      "Because AI models are always buggy and need months of fixing",
      "Because AI products have probabilistic behavior that needs real-world validation, and gradual rollout provides a safety net for catching issues before they affect all users",
      "Because regulators require gradual AI rollouts",
      "Because the AI infrastructure can't handle the load"
    ],
    "correctIndex": 1,
    "explanation": "Unlike traditional software that can be fully tested before launch, AI products behave probabilistically and may encounter edge cases in production that weren't covered in testing. A gradual rollout (shadow mode → small % → larger % → full) lets you catch accuracy issues, unexpected failure modes, and user experience problems before they impact your entire user base. It's not about bugs or regulation — it's about managing the inherent uncertainty of AI."
  },
  {
    "question": "In an AI PRD, the 'Edge Cases & Failure Modes' section should include:",
    "options": [
      "Only technical errors like API timeouts and server crashes",
      "Only user errors like invalid inputs and misuse",
      "Technical failures, model uncertainty, adversarial inputs, data quality issues, and graceful degradation strategies for each",
      "A brief note saying 'we'll handle edge cases during development'"
    ],
    "correctIndex": 2,
    "explanation": "AI failure modes are much broader than traditional software. They include: model failures (low confidence, hallucinations, drift), data issues (stale data, bias, out-of-distribution inputs), adversarial scenarios (prompt injection, manipulation), and operational issues (API down, rate limits, cost spikes). Each failure mode needs a documented handling strategy. Deferring edge cases to 'during development' is a recipe for launching with critical gaps."
  },
  {
    "question": "What should an AI PRD's monitoring section define that a traditional product PRD typically doesn't need?",
    "options": [
      "Page load times and uptime SLAs",
      "User acquisition and retention funnels",
      "Model accuracy drift, confidence score distributions, and automated retraining triggers",
      "A/B testing framework and statistical significance thresholds"
    ],
    "correctIndex": 2,
    "explanation": "AI products uniquely require monitoring for model degradation over time (accuracy drift), changes in prediction confidence (suggesting data distribution shifts), and automated triggers for model retraining. Traditional products don't have models that slowly lose accuracy as the world changes. While page load times, user funnels, and A/B testing are important, they're not unique to AI products."
  }
]
-->`,
          },
        ],
      },
      /* ============================================================
         MODULE 2: AI Product Strategy
         ============================================================ */
      {
        name: "AI Product Strategy",
        slug: "ai-product-strategy",
        description: "Strategic frameworks for deciding when to use AI, build vs buy decisions, competitive moats, and AI maturity assessment.",
        order: 2,
        sections: [
          {
            title: "Should This Be AI? — The 5-Criteria Framework",
            slug: "should-this-be-ai",
            type: "lesson",
            difficulty: "beginner",
            estimatedMinutes: 25,
            order: 1,
            content: `## Should This Be AI?

The most important question an AI Product Manager asks isn't "how do we build this AI feature?" — it's "should this be AI at all?"

Not every product needs AI. Not every problem benefits from machine learning. The best AI PMs are the ones who say "no" to AI when it's the wrong tool, saving their teams months of wasted effort on features that would work better with simple rules or traditional software.

### The 5-Criteria Framework

Before greenlighting any AI feature, it must pass all five criteria. If it fails even one, reconsider whether AI is the right approach.

### Criterion 1: Is the problem inherently fuzzy?

AI excels at problems where the "right answer" isn't deterministic — where human judgment, pattern recognition, or prediction is involved.

**Good fits for AI:**
- "Classify this support ticket into one of 15 categories" — humans disagree 10-15% of the time, the boundaries between categories are fuzzy
- "Predict which users will churn next month" — involves finding subtle patterns across hundreds of variables
- "Generate a personalized email subject line" — there's no single right answer, it depends on the recipient

**Bad fits for AI:**
- "Calculate the user's monthly bill" — this is arithmetic, not pattern recognition
- "Sort these items alphabetically" — deterministic, no fuzziness
- "Send an email when a user signs up" — a simple trigger, no prediction needed
- "Format this date as YYYY-MM-DD" — a rule, not a pattern

**The test:** If you can write an exhaustive if/else decision tree that covers 99%+ of cases, you don't need AI. Use rules.

### Criterion 2: Do you have (or can you get) the data?

AI models need data. Not hypothetical future data — actual data you can access, label, and use for training or retrieval.

**Questions to ask:**
- How much labeled data exists? (100 examples? 10,000? 1,000,000?)
- How expensive is labeling? ($0.01/label for sentiment? $50/label for medical imaging?)
- Is the data representative? (does it cover all the cases you'll see in production?)
- Is the data clean? (consistent labels, no major quality issues?)
- Can you legally use it? (privacy, IP, licensing)
- Is the data recent enough? (a model trained on 2020 data may not work in 2026)

**Red flags:**
- "We'll collect data after launch" — you need data BEFORE training, not after
- "We only have 50 examples" — too few for most supervised learning approaches
- "The data is in 14 different systems" — data integration is a project in itself
- "We'll use synthetic data" — can work for augmentation, rarely works as your primary dataset

### Criterion 3: Is "good enough" acceptable?

AI is never 100% accurate. If your use case requires perfection, AI is the wrong tool.

**Questions to ask:**
- What's the cost of a wrong prediction? (recommending a bad movie vs misdiagnosing a disease)
- What accuracy would make this feature useful? (60%? 90%? 99%?)
- Can users correct mistakes? (thumbs down on a recommendation vs an automated financial trade)
- Is there a human fallback? (AI assists, human decides)

**When "good enough" works:**
- Content recommendations (wrong = mild annoyance)
- Email categorization (wrong = user moves email, no harm)
- Search result ranking (wrong = user scrolls further)

**When "good enough" doesn't work:**
- Automated medication dosing (wrong = patient harm)
- Autonomous financial trading (wrong = significant monetary loss with no reversal)
- Automated access control decisions (wrong = security breach or lockout)

### Criterion 4: Is the value worth the cost?

AI features are expensive to build, maintain, and run. The ROI must justify the investment.

**Costs to consider:**
- **Build cost:** 3-12 months of ML engineering time (vs weeks for traditional features)
- **Data cost:** labeling, cleaning, storage, pipelines
- **Infrastructure cost:** GPU compute, vector databases, API calls
- **Maintenance cost:** model monitoring, retraining, drift detection (ongoing, forever)
- **Opportunity cost:** what else could the team build with those resources?

**The napkin math:**
- Will this save more than it costs? (e.g., $180K/year in support costs vs $120K/year in AI costs)
- Does it create value that's impossible without AI? (personalization at scale, real-time fraud detection)
- Is the competitive advantage worth the investment? (first-mover in AI search for your industry)

### Criterion 5: Can you explain and monitor it?

If you can't explain what the AI is doing and monitor whether it's working, you shouldn't ship it.

**Explainability requirements:**
- Can you tell users why the AI made a specific decision? (required for financial, medical, legal)
- Can you debug incorrect predictions? (if the model is a black box, how do you fix it?)
- Can stakeholders understand the model's limitations?

**Monitoring requirements:**
- Can you measure accuracy in production? (do you have ground truth?)
- Can you detect when the model degrades? (drift monitoring)
- Can you retrain when needed? (data pipeline, compute, deployment)

### Decision Matrix: 15 Scenarios

| # | Scenario | AI? | Why |
|---|----------|-----|-----|
| 1 | Classify support tickets into categories | Yes | Fuzzy problem, abundant data, good enough works |
| 2 | Calculate shipping costs based on weight and distance | No | Deterministic — use a formula |
| 3 | Detect fraudulent credit card transactions | Yes | Pattern recognition across hundreds of signals, real-time |
| 4 | Send birthday emails to users | No | Simple trigger — user.birthday === today |
| 5 | Recommend products based on browsing history | Yes | Personalization at scale, fuzzy preferences |
| 6 | Validate email format (user@domain.com) | No | Regex, not AI |
| 7 | Transcribe meeting recordings to text | Yes | Speech recognition, inherently fuzzy |
| 8 | Sort a list of names alphabetically | No | Array.sort() — deterministic |
| 9 | Predict which sales leads will convert | Yes | Pattern across many variables, historical data |
| 10 | Generate alt text for images | Yes | Visual understanding, infinite variation |
| 11 | Check if a password meets complexity rules | No | Rules-based, deterministic |
| 12 | Detect toxic content in user comments | Yes | Context-dependent, fuzzy boundaries |
| 13 | Convert PDF invoices to structured data | Yes | Varying layouts, OCR + extraction |
| 14 | Calculate tax based on location | No | Lookup table, deterministic |
| 15 | Predict server failures before they happen | Yes | Anomaly detection across many signals |

### The Decision Flowchart

Ask these questions in order:

1. Can you solve this with rules or simple logic? → If yes, don't use AI.
2. Do you have enough relevant data? → If no, build data collection first, AI later.
3. Is "85% accurate" good enough for this use case? → If no, reconsider.
4. Does the ROI justify 6+ months of ML engineering? → If no, find a simpler approach.
5. Can you monitor and explain the AI's decisions? → If no, you're not ready.

If you answered yes to questions 2-5 and no to question 1: AI is probably the right call.`,
          },
          {
            title: "Build vs Buy vs API Decision Matrix",
            slug: "build-vs-buy-vs-api",
            type: "lesson",
            difficulty: "intermediate",
            estimatedMinutes: 25,
            order: 2,
            content: `## Build vs Buy vs API

Once you've decided AI is the right approach, the next strategic decision is how to get it: build your own model, buy a platform, or use an API.

This decision has massive implications for cost, time-to-market, competitive advantage, and long-term flexibility. Most AI PMs default to "use an API" because it's fastest — but that's not always right.

### The Three Options

**Build (Train Your Own Model)**
- You collect data, train a model from scratch or fine-tune a foundation model, and deploy it on your own infrastructure.
- Examples: training a custom NER model for your domain, fine-tuning Llama for your specific use case.

**Buy (AI Platform/SaaS)**
- You purchase a complete AI solution that handles model training, hosting, and updates.
- Examples: Salesforce Einstein, Google Document AI, AWS Comprehend, Hugging Face Inference Endpoints.

**API (Use a Foundation Model API)**
- You call a third-party API (OpenAI, Anthropic, Google) with your prompts and data.
- Examples: Using GPT-4o via API for text generation, Claude for analysis, Gemini for multimodal tasks.

### Decision Framework

| Factor | Build | Buy | API |
|--------|-------|-----|-----|
| **Time to market** | 3-12 months | 1-3 months | Days to weeks |
| **Upfront cost** | Very high ($200K-2M+) | Medium ($10K-100K/year) | Low ($0-1K to start) |
| **Ongoing cost** | Infrastructure + team | Subscription | Per-request pricing |
| **Data privacy** | Full control | Depends on vendor | Data sent to third party |
| **Customization** | Full control | Limited | Prompt engineering |
| **Competitive moat** | Strongest | Weak | Weakest |
| **ML team needed** | Yes (3-5+ engineers) | No | No (but helpful) |
| **Performance ceiling** | Highest | Medium | Medium-high |
| **Vendor lock-in** | None | High | Medium |
| **Maintenance burden** | Highest | Lowest | Low |

### When to Build

Build your own model when:

1. **Data is your competitive advantage** — your proprietary dataset is what makes your AI better than anyone else's. Example: a logistics company with 10 years of shipping delay data.

2. **Privacy requirements are absolute** — the data literally cannot leave your infrastructure. Example: healthcare companies with PHI, defense contractors, financial institutions with regulatory constraints.

3. **The use case is highly specialized** — general models don't perform well enough, and fine-tuning an API model doesn't bridge the gap. Example: detecting manufacturing defects in a specific product line.

4. **Volume justifies the investment** — at massive scale, the cost of API calls exceeds the cost of self-hosting. Example: processing 100M+ requests/month.

5. **You have the team** — building requires ML engineers, data engineers, and MLOps. If you don't have them and aren't ready to hire, don't build.

### When to Buy

Buy a platform when:

1. **The problem is well-defined and common** — document processing, sentiment analysis, entity extraction — platforms have solved these well.

2. **You need reliability and SLAs** — enterprise platforms come with uptime guarantees, support contracts, and compliance certifications your internal team would take years to achieve.

3. **Speed matters more than customization** — you need a solution in weeks, not months, and 80% accuracy is acceptable.

4. **Your team isn't ML-capable** — platforms abstract away the ML complexity. Your engineers integrate an API, not train models.

### When to Use an API

Use a foundation model API when:

1. **Prototyping and validation** — before committing to a build, prove the concept works with an API.

2. **The task is general-purpose** — summarization, translation, code generation, conversational AI — foundation models handle these well out of the box.

3. **You need cutting-edge capabilities** — foundation model providers invest billions in R&D. Their models improve faster than anything you could build.

4. **Volume is low to moderate** — at <1M requests/month, API costs are usually cheaper than self-hosting.

5. **Time-to-market is critical** — you can ship in days, iterate fast, and switch providers if needed.

### 10 Decision Scenarios

| # | Scenario | Recommendation | Why |
|---|----------|---------------|-----|
| 1 | Startup building an AI chatbot for customer support | API | Fast to market, chatbots are general-purpose, low initial volume |
| 2 | Hospital analyzing MRI scans for tumor detection | Build | Privacy requirements, highly specialized, requires domain data |
| 3 | E-commerce company adding product recommendations | Buy | Well-solved problem, platforms like Algolia/AWS Personalize exist |
| 4 | Fintech detecting fraudulent transactions | Build | Proprietary transaction data is the moat, regulatory requirements |
| 5 | Marketing team generating social media copy | API | General-purpose text generation, low volume, fast iteration needed |
| 6 | Law firm analyzing contracts for risks | API + fine-tune | Start with API for prototyping, fine-tune for domain accuracy |
| 7 | Manufacturing detecting defects on assembly line | Build | Highly specialized visual data, real-time latency requirements |
| 8 | HR platform screening resumes | Buy | Platforms exist (HireVue, Textio), bias compliance is complex to build |
| 9 | Enterprise processing 50K invoices/month | Buy | Document AI platforms (Google, AWS) handle this well |
| 10 | Social media platform moderating content at scale | Build | Scale (billions of posts), proprietary policy interpretation, speed |

### The Hybrid Approach

The best strategy is often hybrid:

1. **Start with API** — validate the concept in 2-4 weeks
2. **Evaluate buy** — once validated, check if a platform gives 90%+ of what you need
3. **Build strategically** — only build the parts that are your competitive advantage

Example: Use GPT-4o API for general text tasks, buy a platform for document processing, and build a custom model for the one task where your proprietary data creates a moat.

### Cost Modeling

Before deciding, estimate costs for each option at your expected scale:

**API cost formula:**
\`\`\`
Monthly cost = (requests/month × avg tokens per request × price per token)
\`\`\`

**Build cost formula:**
\`\`\`
Year 1 cost = team cost + infrastructure + data labeling + training compute
Ongoing = infrastructure + team + retraining + monitoring
\`\`\`

**Buy cost formula:**
\`\`\`
Annual cost = platform subscription + per-request overage + integration cost
\`\`\`

**Break-even analysis:**
If your API cost at 5M requests/month is $15K/month, and building internally costs $500K upfront + $8K/month in infrastructure, the break-even point is:
\`\`\`
$500K / ($15K - $8K) = 71 months ≈ 6 years
\`\`\`
At this scale, API is cheaper. At 50M requests/month, the math flips.`,
          },
          {
            title: "AI Product Strategy Quiz",
            slug: "ai-strategy-quiz",
            type: "quiz",
            difficulty: "beginner",
            estimatedMinutes: 10,
            order: 3,
            content: `## AI Product Strategy Quiz

Test your understanding of when and how to apply AI.

<!--quiz
[
  {
    "question": "A team wants to build an AI feature that sends a welcome email when a new user signs up. What should you advise?",
    "options": [
      "Use GPT-4 to generate personalized welcome emails",
      "Build a custom model trained on successful welcome emails",
      "Don't use AI — this is a simple trigger that works with traditional software",
      "Buy an email automation platform with AI capabilities"
    ],
    "correctIndex": 2,
    "explanation": "Sending an email when a user signs up is a deterministic trigger (event → action), not a fuzzy problem that requires pattern recognition. Using AI for this would add unnecessary cost, latency, and complexity. A simple if/then rule or event-driven architecture handles this perfectly. The first criterion of the 5-criteria framework says: if you can solve it with rules, don't use AI."
  },
  {
    "question": "A startup with no ML team wants to add AI-powered document search to their product. They have 5,000 documents and expect 10,000 queries/month. What approach should they take?",
    "options": [
      "Build a custom search model from scratch",
      "Use a foundation model API (embeddings + RAG) for fast time-to-market",
      "Buy an enterprise search platform like Elasticsearch with ML features",
      "Wait until they hire an ML team before adding AI features"
    ],
    "correctIndex": 1,
    "explanation": "For a startup with no ML team, low volume (10K queries/month), and a general-purpose task (document search), using a foundation model API with RAG is the best choice. It offers fast time-to-market (days, not months), low cost at this volume (embedding 5K docs costs under $1, queries maybe $50-100/month), no ML team required, and the flexibility to switch providers. Building from scratch would take 6+ months and require ML hires. Enterprise platforms are overkill for this scale."
  },
  {
    "question": "Which of these is the strongest competitive moat for an AI product?",
    "options": [
      "Using the latest GPT model before competitors do",
      "Having a proprietary dataset that improves model accuracy for your specific domain",
      "Having the best UI design for displaying AI results",
      "Being the first to market with an AI feature in your category"
    ],
    "correctIndex": 1,
    "explanation": "A proprietary dataset is the strongest moat because: (1) it's hard to replicate — competitors can't just copy your data, (2) it creates a flywheel — more users → more data → better model → more users, (3) it survives model commoditization — when everyone can use GPT-5, the company with the best domain data wins. Using the latest model is a temporary advantage (competitors adopt quickly), UI can be copied, and first-mover advantage erodes without a data moat."
  },
  {
    "question": "At what scale does building your own model typically become cheaper than using an API?",
    "options": [
      "Immediately — building is always cheaper than API calls",
      "At millions of requests per month, but only if the break-even math works after accounting for team and infrastructure costs",
      "Never — APIs are always more cost-effective",
      "At exactly 100,000 requests per month"
    ],
    "correctIndex": 1,
    "explanation": "There's no universal threshold — it depends on your specific costs. Building requires significant upfront investment (team salaries, infrastructure, compute) and ongoing costs (monitoring, retraining, maintenance). APIs have zero upfront cost but per-request pricing that scales linearly. The break-even point varies: for some tasks it's at 5M requests/month, for others at 50M. You need to model the actual costs for your specific use case, including the opportunity cost of tying up ML engineers."
  }
]
-->`,
          },
        ],
      },
      /* ============================================================
         MODULE 3: Technical Literacy (No Code)
         ============================================================ */
      {
        name: "Technical Literacy (No Code)",
        slug: "technical-literacy",
        description: "Understand ML concepts, model metrics, LLMs, data pipelines, and infrastructure — all without writing a single line of code.",
        order: 3,
        sections: [
          {
            title: "ML Concepts Without Math",
            slug: "ml-concepts-without-math",
            type: "lesson",
            difficulty: "beginner",
            estimatedMinutes: 30,
            order: 1,
            content: `## ML Concepts Without Math

You don't need a PhD in statistics to be an effective AI Product Manager. But you do need to understand what machine learning is actually doing — well enough to make informed product decisions, ask the right questions, and call BS when someone says "the model will just learn it."

This section explains core ML concepts using analogies and real-world examples. No equations, no code, no Greek letters.

### What Is Machine Learning?

**Analogy: The Experienced Chef**

Imagine a chef who has cooked 10,000 meals. They don't follow recipes anymore — they've developed an intuition for what flavors work together, how long to cook something, and what adjustments to make based on the ingredients available.

Machine learning is similar. Instead of being programmed with explicit rules ("if ingredient = chicken AND cooking_method = grill, THEN temperature = 375°F, time = 25min"), a model learns patterns from thousands of examples. It develops "intuition" — but it's mathematical intuition based on patterns in data, not human understanding.

**Key insight for PMs:** The model doesn't "understand" anything. It finds statistical patterns. If the patterns in your training data don't match the patterns in production, the model fails. This is the most common source of AI product failures.

### Supervised Learning

**Analogy: Flashcards**

Remember studying with flashcards? Someone shows you a card with a question, you guess the answer, and they tell you if you're right or wrong. Over time, you learn the correct answers.

Supervised learning works the same way. You give the model thousands of examples where you already know the correct answer (labeled data):
- Input: "I love this product!" → Label: Positive sentiment
- Input: "Worst purchase ever" → Label: Negative sentiment
- Input: photo of a cat → Label: Cat
- Input: photo of a dog → Label: Dog

The model sees enough examples to learn the pattern, then applies it to new inputs it hasn't seen before.

**Why this matters for PMs:**
- You need labeled data before you can train. No labels = no supervised learning.
- The quality of labels directly determines model quality. If your labels are wrong 20% of the time, your model will be wrong at least 20% of the time.
- The model can only predict categories it's been trained on. If you train a sentiment model on "positive" and "negative" but don't include "neutral," it'll force every input into one of those two buckets.

### Unsupervised Learning

**Analogy: Organizing Your Closet**

Imagine someone dumps 1,000 clothing items on your floor and says "organize these." Nobody tells you the categories — you figure them out yourself. You might group by color, by season, by formality, or by type. The groupings emerge from the data, not from predefined labels.

Unsupervised learning does this with data. It finds natural groupings, patterns, and structures without being told what to look for.

**Real-world uses:**
- Customer segmentation (which customers behave similarly?)
- Anomaly detection (which transactions look unusual?)
- Topic modeling (what topics appear in 100,000 customer reviews?)

**Why this matters for PMs:**
- Unsupervised learning is great for exploration ("what patterns exist in our data?") but harder to control ("find specifically this pattern").
- The model decides the groupings — they might not align with your business categories.
- You can use unsupervised learning to generate labels for supervised learning (cluster users, then label the clusters).

### Reinforcement Learning

**Analogy: Training a Dog**

When training a dog, you don't explain the theory of sitting. You wait for the dog to sit, give it a treat (positive reward), and repeat. The dog learns that sitting = treat. Over time, it learns complex behaviors through trial, error, and rewards.

Reinforcement learning works the same way. The model takes actions in an environment, receives rewards or penalties, and learns to maximize rewards over time.

**Real-world uses:**
- Game AI (AlphaGo, Atari games)
- Robotics (learning to walk, grasp objects)
- Recommendation optimization (maximizing user engagement over time)
- RLHF (Reinforcement Learning from Human Feedback) — how ChatGPT was aligned with human preferences

**Why this matters for PMs:**
- RL is powerful but extremely hard to get right. If the reward function is wrong, the model optimizes for the wrong thing.
- Classic failure: a recommendation system optimizing for clicks learns to show clickbait, not quality content.
- RL is rarely the right first approach. Start with supervised learning.

### Overfitting vs Underfitting

**Analogy: Studying for a Test**

**Overfitting** is like memorizing every question and answer from practice tests word-for-word. On the actual test, if a question is slightly different from practice, you fail — because you memorized instead of learning the concepts.

In ML, overfitting means the model has memorized the training data instead of learning general patterns. It performs perfectly on training data but poorly on new data.

**Underfitting** is like barely studying at all. You haven't learned enough to perform well on anything — not the practice tests and not the real test.

In ML, underfitting means the model hasn't learned the patterns in the data. It performs poorly everywhere.

**The sweet spot** is like studying until you understand the concepts, not the specific questions. You can handle new questions because you've learned the underlying patterns.

**Why this matters for PMs:**
- If your team says "the model is 99% accurate," ask: "on training data or on held-out test data?" 99% on training data might mean overfitting.
- If the model works great in testing but poorly in production, the production data might be different from training data (distribution shift).
- More data usually helps. More model complexity without more data often hurts (overfitting).

### Transfer Learning

**Analogy: Learning a Second Language**

If you speak English and want to learn Spanish, you don't start from zero. You already understand grammar, sentence structure, vocabulary patterns, and how languages work in general. You "transfer" this knowledge, making Spanish easier to learn than it would be if you'd never learned any language.

Transfer learning in ML works the same way. Instead of training a model from scratch, you start with a model that's already been trained on a massive dataset (like GPT, which was trained on most of the internet). Then you fine-tune it on your specific task with much less data.

**Why this matters for PMs:**
- Transfer learning dramatically reduces data requirements. Instead of needing 1,000,000 examples, you might need 1,000.
- It reduces training time from weeks to hours.
- It's why ChatGPT/Claude can do so many things — they learned general language understanding, then can be adapted to specific tasks.
- This is why the build vs buy vs API decision matters: APIs give you the benefits of transfer learning without the infrastructure cost.

### The Training-Serving Gap

**Analogy: Practice vs Game Day**

A basketball team might win every practice scrimmage but lose real games. Why? Practice conditions don't match game conditions — different opponents, crowd noise, pressure, fatigue.

The training-serving gap is the same problem. Your model performs great on test data but fails in production because:
- Training data is clean; production data is messy
- Training data is from 2024; production data is from 2026
- Training data is in English; production users write in Spanglish
- Training data has 10 categories; production users create new categories

**Why this matters for PMs:**
- Always test with production-like data, not just clean test sets
- Monitor model performance in production, not just at launch
- Plan for data distribution shift — it's not if, it's when
- The model that works in your demo might fail in the real world

### 30 Questions to Ask Your AI Team

Use these throughout a project. They're organized by project phase.

**During planning:**
1. What data do we have? How much? How clean?
2. Has anyone done something similar? Can we use a pre-trained model?
3. What's our accuracy floor — the minimum to be useful?
4. How will we measure accuracy in production?
5. What's the expected latency? Does the use case need real-time or batch?

**During development:**
6. What's our current accuracy on the test set?
7. Where does the model fail most? (which classes, which inputs?)
8. Is the model overfitting? How do we know?
9. How sensitive is performance to the training data size?
10. What's the confidence distribution? (mostly high confidence or spread out?)

**Before launch:**
11. How does performance on test data compare to production-like data?
12. What happens with out-of-distribution inputs?
13. Have we tested for bias across different user groups?
14. What's the fallback when the model fails?
15. What's our monitoring plan? What metrics, what alerts?

**After launch:**
16. Is accuracy stable or declining?
17. What's the actual latency in production? (P50, P95, P99)
18. What percentage of predictions are high confidence vs low confidence?
19. How often do users override or correct the model?
20. Has the input data distribution changed since training?

**During maintenance:**
21. When should we retrain? On what schedule?
22. How much does retraining cost? (compute + labeling)
23. Can we use production feedback to improve the model automatically?
24. Are there new model architectures worth evaluating?
25. Has the competitive landscape changed? (new models, new APIs)

**Strategic:**
26. Is our data moat growing or shrinking?
27. Are we measuring the right success metric, or has the goal post moved?
28. What would 10x more data let us do?
29. Are there adjacent problems we could solve with the same model/data?
30. Should we build this ourselves or switch to an API/platform?`,
          },
          {
            title: "Model Metrics Explained",
            slug: "model-metrics-explained",
            type: "lesson",
            difficulty: "intermediate",
            estimatedMinutes: 20,
            order: 2,
            content: `## Model Metrics Explained

When your ML team says "the model has 92% accuracy," what does that actually mean? And is 92% good enough?

Model metrics are the language of AI performance evaluation. As an AI PM, you don't need to calculate these yourself — but you absolutely need to understand what they mean, when each one matters, and how to use them for product decisions.

### Accuracy

**What it is:** The percentage of predictions the model gets right.

**Formula (in plain English):** Correct predictions ÷ Total predictions

**Example:** Out of 1,000 predictions, 920 were correct → 92% accuracy.

**When accuracy is misleading:**

Imagine a spam detector. 95% of emails are legitimate, 5% are spam. A model that just predicts "not spam" for every email gets 95% accuracy — while catching zero spam. This is the **class imbalance problem**.

**When to use accuracy:** Only when your classes are roughly balanced (e.g., 50/50 positive/negative sentiment). For imbalanced datasets, use precision, recall, or F1.

### Precision

**What it is:** Of all the things the model SAID were positive, how many actually were?

**Analogy:** A fishing net. Precision measures what percentage of what you caught is actually fish (vs seaweed, boots, etc.).

**Example:** The spam detector flagged 100 emails as spam. 90 were actually spam, 10 were legitimate emails incorrectly flagged. Precision = 90/100 = 90%.

**When precision matters most:**
- When false positives are costly
- Spam detection (marking a legitimate email as spam means the user misses it)
- Fraud detection (blocking a legitimate transaction loses revenue and frustrates customers)
- Content moderation (incorrectly removing a legitimate post angers users)

**The PM question:** "What's the cost of a false alarm?"

### Recall

**What it is:** Of all the things that ACTUALLY were positive, how many did the model catch?

**Analogy:** Back to fishing. Recall measures what percentage of all the fish in the lake you actually caught.

**Example:** There were 200 actual spam emails. The model caught 150 of them and missed 50. Recall = 150/200 = 75%.

**When recall matters most:**
- When false negatives are costly
- Disease screening (missing a cancer diagnosis is worse than a false alarm)
- Security threats (missing an actual attack is worse than investigating a false alarm)
- Safety-critical systems (missing a defect is worse than flagging a good part)

**The PM question:** "What's the cost of missing something?"

### The Precision-Recall Tradeoff

You usually can't maximize both. Making the model more cautious (higher threshold) increases precision but decreases recall. Making it more aggressive (lower threshold) increases recall but decreases precision.

**Example: Fraud Detection**
- High precision, low recall: "Only flag transactions I'm 99% sure are fraud" → Few false alarms, but misses many actual frauds
- High recall, low precision: "Flag anything remotely suspicious" → Catches most frauds, but blocks many legitimate transactions

**The PM decision:** Where on this tradeoff should your product sit? This is a product decision, not a technical one.

| Use Case | Priority | Why |
|----------|----------|-----|
| Cancer screening | High recall | Missing cancer is worse than a false alarm |
| Email spam filter | Balance | Missing spam is annoying; flagging real email loses trust |
| Fraud blocking | Depends on severity | High-value: high recall. Low-value: high precision |
| Content moderation | Balance with lean to precision | Over-removing content suppresses free expression |

### F1 Score

**What it is:** The balanced average of precision and recall. It's a single number that captures both.

**When to use:** When you care about both precision and recall equally and want one number to track.

**Interpretation:**
- F1 = 1.0: Perfect precision and recall
- F1 = 0.5: One or both of precision/recall are poor
- F1 is always between 0 and 1

**When to use F1:** When reporting to stakeholders who want a single "how good is the model?" number. When optimizing, look at precision and recall separately.

### AUC-ROC

**What it is:** Measures how well the model distinguishes between classes across ALL possible thresholds.

**Analogy:** Imagine you're sorting a deck of cards into "red" and "black" piles without looking. AUC-ROC measures how well you sort overall, not just at one specific rule for deciding.

**Interpretation:**
- AUC = 1.0: Perfect separation (never confuses red and black)
- AUC = 0.5: Random guessing (coin flip)
- AUC = 0.8: Good — the model correctly ranks a positive example higher than a negative example 80% of the time

**When to use AUC-ROC:** When comparing different models before you've chosen a confidence threshold. AUC tells you the model's inherent ability to distinguish, independent of where you set the cutoff.

### Metric Selection Guide for PMs

| Question | Use This Metric |
|----------|----------------|
| "How often is the model right?" | Accuracy (balanced data only) |
| "How many false alarms?" | Precision |
| "How many things did we miss?" | Recall |
| "Give me one number for model quality" | F1 score |
| "Which model is fundamentally better?" | AUC-ROC |
| "Is performance degrading over time?" | Track all of the above weekly |

### What to Ask When Your Team Reports Metrics

1. "Is this on test data or production data?" — test data metrics are aspirational, production metrics are real.
2. "What's the class distribution?" — 95% accuracy on imbalanced data might be meaningless.
3. "What threshold are you using?" — precision/recall change with the confidence threshold.
4. "What's the per-class breakdown?" — the model might be 95% accurate overall but 50% accurate on the class that matters most.
5. "How does this compare to the baseline?" — a 90% accurate model sounds great until you learn that a simple rules-based approach gets 88%.`,
          },
          {
            title: "LLM Concepts for PMs",
            slug: "llm-concepts-for-pms",
            type: "lesson",
            difficulty: "beginner",
            estimatedMinutes: 25,
            order: 3,
            content: `## LLM Concepts for PMs

Large Language Models (LLMs) like GPT-4, Claude, and Gemini have changed how AI products are built. As a PM, you need to understand how they work — not to build them, but to make informed decisions about what's possible, what's risky, and what's marketing hype.

### What Is an LLM?

**Analogy: The World's Most Well-Read Speed Reader**

Imagine someone who has read every book, every website, every forum post ever written — billions of pages. They can't recall specific passages word-for-word, but they've absorbed patterns: how sentences are structured, how arguments flow, what typically follows "the weather today is..." They're not looking things up — they're pattern-matching based on everything they've read.

An LLM is this speed reader, implemented as a neural network. It was trained on massive amounts of text and learned statistical patterns about language. When you ask it a question, it's not "searching for the answer" — it's generating the most likely next words based on patterns it learned during training.

**Key insight for PMs:** LLMs don't "know" things in the way humans do. They predict the most probable text continuation. This is why they sometimes generate plausible-sounding but completely wrong information (hallucination).

### Tokens

**What they are:** LLMs don't process words — they process tokens. A token is roughly 3/4 of a word. "Artificial intelligence" is 2 words but about 4 tokens. "AI" is 1 token.

**Why PMs care:**
- **Cost:** API pricing is per token. If your prompt uses 1,000 tokens and the response is 500 tokens, you pay for 1,500 tokens.
- **Speed:** More tokens = slower response. A 2,000-token response takes longer to generate than a 200-token response.
- **Context window:** The total number of tokens the model can "see" at once.

**Rough token math:**
- 1 token ≈ 4 characters in English
- 100 tokens ≈ 75 words
- 1 page of text ≈ 400-500 tokens
- A 5,000-word document ≈ 6,500 tokens

### Context Window

**What it is:** The maximum number of tokens the model can process in a single request (prompt + response combined).

**Analogy:** Think of it as the model's working memory. Like a person who can only keep a certain number of pages in front of them at once. If you need them to reference information from page 50 of a document, it needs to fit within the context window.

**Current context windows (as of 2026):**
- GPT-4o: 128K tokens (~200 pages)
- Claude: 200K tokens (~300 pages)
- Gemini 1.5 Pro: 2M tokens (~3,000 pages)

**Why PMs care:**
- **RAG design:** Your retrieval system needs to fit relevant context within the window
- **Conversation length:** Long conversations consume tokens from the context window
- **Cost:** Larger context = more tokens = more cost per request
- **Quality:** Models tend to lose track of information in the middle of very long contexts (the "lost in the middle" problem)

### Temperature

**What it is:** A parameter that controls how "creative" or "random" the model's output is.

**Analogy:** Think of temperature like the dial on a creativity knob:
- Temperature = 0: The model always picks the most probable next word. Output is deterministic, focused, and repetitive if you run the same prompt twice.
- Temperature = 0.7: The model sometimes picks less probable words, creating more varied and creative output.
- Temperature = 1.0+: The model frequently picks unlikely words, producing unpredictable and sometimes nonsensical output.

**PM guidelines for temperature:**
| Use Case | Temperature | Why |
|----------|-------------|-----|
| Data extraction, classification | 0.0-0.2 | Need consistent, predictable output |
| Customer support responses | 0.3-0.5 | Need accuracy with some natural variation |
| Content writing, brainstorming | 0.7-0.9 | Need creativity and variety |
| Creative fiction, poetry | 0.9-1.2 | Need maximum creativity |

### Hallucination

**What it is:** When an LLM generates text that sounds confident and plausible but is factually incorrect.

**Why it happens:** LLMs are pattern-completion machines. They generate the most likely text continuation — which sometimes means generating plausible-sounding text that has no basis in reality. The model doesn't "know" it's wrong because it doesn't "know" anything.

**Types of hallucination:**
1. **Fabrication** — inventing facts, citations, or references that don't exist
2. **Incorrect attribution** — assigning real facts to the wrong source
3. **Outdated information** — stating things that were true during training but are no longer true
4. **Logical inconsistency** — making arguments that sound right but contain subtle logical errors

**How to mitigate (PM decisions):**
- **RAG:** Ground the model's responses in retrieved documents (your data, not its training data)
- **Citation requirements:** Require the model to cite sources for every factual claim
- **Confidence thresholds:** Only show AI responses above a confidence threshold
- **Human-in-the-loop:** Have humans verify high-stakes outputs before they reach users
- **Structured output:** Force the model to output JSON with specific fields, reducing free-form hallucination
- **Temperature:** Lower temperature reduces hallucination (but also reduces creativity)

### Prompt Engineering

**What it is:** The art of designing the input text (prompt) to get the best possible output from an LLM.

**Why PMs care:** Prompt engineering is often the difference between a feature that works and one that doesn't. It's a PM responsibility to define what the prompt should achieve, even if an engineer writes the actual text.

**Key prompting techniques:**
1. **System prompts:** Set the model's role, personality, and constraints. "You are a customer support agent for [Company]. Never discuss competitor products."
2. **Few-shot examples:** Show the model 2-3 examples of the desired input/output format before giving it the actual task.
3. **Chain-of-thought:** Ask the model to "think step by step" before giving its final answer. Improves accuracy on reasoning tasks.
4. **Output format specification:** "Respond in JSON format with fields: category, confidence, reasoning." Prevents free-form responses that are hard to parse.

### Fine-Tuning

**What it is:** Taking a pre-trained LLM and training it further on your specific data to specialize it for your use case.

**Analogy:** A general practitioner going through a residency to become a cardiologist. They already know medicine (pre-training), but they're specializing in a specific area (fine-tuning).

**When to fine-tune:**
- You need consistent output format that prompt engineering can't reliably achieve
- You need domain-specific knowledge not in the base model
- You need to reduce token usage (fine-tuned models can give shorter, more focused responses)
- You need lower latency (fewer tokens = faster response)

**When NOT to fine-tune:**
- Prompt engineering or RAG can solve the problem (cheaper, faster to iterate)
- You have fewer than 100 high-quality examples
- The task changes frequently (retraining is expensive)

### Token Economics for PMs

Understanding token costs is essential for budgeting AI features:

| Model | Input Cost (per 1M tokens) | Output Cost (per 1M tokens) |
|-------|---------------------------|----------------------------|
| GPT-4o | $2.50 | $10.00 |
| GPT-4o-mini | $0.15 | $0.60 |
| Claude 3.5 Sonnet | $3.00 | $15.00 |
| Claude 3.5 Haiku | $0.80 | $4.00 |

**Example cost calculation:**
Your chatbot averages 500 tokens in (user message + context) and 300 tokens out per turn. Using GPT-4o-mini:
- Per turn: (500 × $0.15 / 1M) + (300 × $0.60 / 1M) = $0.000075 + $0.000180 = $0.000255
- Per conversation (10 turns): $0.00255
- At 10,000 conversations/month: $25.50/month

This is why model selection matters for PMs. GPT-4o for the same scenario would cost ~$42.50/month — not a huge difference at 10K conversations, but at 1M conversations it's $2,550 vs $425.`,
          },
        ],
      },
      /* ============================================================
         MODULE 4: Stakeholder Communication
         ============================================================ */
      {
        name: "Stakeholder Communication",
        slug: "stakeholder-communication",
        description: "Translate ML concepts for executives, manage AI expectations, roadmap AI products, and communicate incidents effectively.",
        order: 4,
        sections: [
          {
            title: "Explaining ML to Executives",
            slug: "explaining-ml-to-executives",
            type: "lesson",
            difficulty: "beginner",
            estimatedMinutes: 20,
            order: 1,
            content: `## Explaining ML to Executives

The most common failure mode for AI PMs isn't building the wrong feature — it's failing to communicate what you're building in a way executives can understand and support.

Executives don't need to understand gradient descent or transformer architectures. They need to understand: what does this do, how confident are we it'll work, what are the risks, and what's the business impact.

### The Translation Framework

Every ML concept has a business translation. Your job is to be the translator.

| ML Concept | Executive Translation |
|-----------|----------------------|
| Model accuracy: 92% | "It gets it right 92 out of 100 times" |
| Precision vs recall tradeoff | "We can catch more fraud but block more real customers, or block fewer real customers but miss more fraud. Where should we set the dial?" |
| Training data | "The examples the system learned from — like case studies for a new hire" |
| Overfitting | "The system memorized our test cases instead of learning the general pattern" |
| Hallucination | "The AI confidently makes up information that sounds right but isn't" |
| Fine-tuning | "Specializing the AI for our specific use case, like onboarding a generalist into a specialist role" |
| Context window | "The amount of information the AI can consider at once — like how many pages it can read before answering" |
| Latency | "How long users wait for a response" |
| Model drift | "The AI's performance slowly degrades as the real world changes but the AI doesn't update" |

### The BLUF Method (Bottom Line Up Front)

Executives have short attention spans in meetings. Lead with the conclusion, then support with details.

**Bad:**
"We've been evaluating several approaches including fine-tuning, RAG, and prompt engineering. After testing on our evaluation dataset of 2,000 examples across 15 categories, with cross-validation and hyperparameter tuning, we've found that a RAG approach with text-embedding-3-small and GPT-4o-mini achieves 91.3% accuracy with P95 latency of 2.1 seconds..."

**Good:**
"Our AI classifier is 91% accurate — beating our 85% target. It'll launch next month in shadow mode. The main risk is that accuracy might drop when we encounter ticket types we haven't seen in training. We're monitoring daily and have a human fallback ready."

### Five Translation Exercises

Practice translating these technical updates into executive-friendly language:

**Exercise 1:**
Technical: "We're experiencing a 7% accuracy degradation on the sentiment analysis model due to distribution shift in the input data. The training set was predominantly formal business emails, but production traffic includes 30% informal Slack-style messages."

Executive translation: "Our AI's accuracy dropped from 92% to 85% because it was trained on formal emails but 30% of actual messages are casual Slack-style writing. We're updating the training data to include these — fix expected in 2 weeks."

**Exercise 2:**
Technical: "We need to implement a reranking layer between the embedding-based retrieval and the answer generation to improve the relevance of retrieved documents. Currently our Recall@5 is 0.78 but MRR is only 0.45."

Executive translation: "Our search finds relevant documents 78% of the time, but the most relevant one isn't always at the top. We're adding a 'second opinion' step that reorders results before showing them. Expected improvement: the best result moves to position 1 about 70% of the time, up from 45%."

**Exercise 3:**
Technical: "The model's token consumption is 3x our projection due to the few-shot examples in the system prompt. At current usage, we'll exceed our monthly API budget by 200%."

Executive translation: "We're spending 3x more on AI than planned because each request sends too much context. Two options: (1) reduce context and accept slightly lower quality, estimated 5% accuracy drop. (2) Switch to a cheaper model (GPT-4o-mini), which is 20x cheaper with about 3% quality loss. I recommend option 2."

**Exercise 4:**
Technical: "We achieved SOTA on our benchmark with a 94.2% F1 score, outperforming the baseline by 8.3 percentage points. However, the model shows significant performance degradation on underrepresented classes, with F1 dropping to 0.67 for class 12."

Executive translation: "Our AI is best-in-class with 94% overall accuracy. However, it struggles with one category — 'regulatory inquiries' — where accuracy drops to 67%. This category is 3% of our volume but highest risk. We're collecting more training examples and expect to close this gap in the next iteration."

**Exercise 5:**
Technical: "The inference pipeline requires GPU instances for real-time serving. We're evaluating T4 vs A10G instances on AWS. T4 gives us P99 latency of 350ms at $0.526/hr, while A10G gives P99 of 180ms at $1.212/hr."

Executive translation: "We need to choose between two server options: a cheaper one ($380/month, 0.35-second response time) and a faster one ($870/month, 0.18-second response time). For our use case, users won't notice the difference below 0.5 seconds. I recommend the cheaper option — it saves $6,000/year."

### Common Executive Questions and How to Answer Them

**"Is this AI safe?"**
Don't say: "We've implemented guardrails and content filtering."
Say: "We've built three safety layers: the AI can't access customer data it shouldn't, it can't take actions without human approval, and everything it says is monitored. Here are the specific risks and how we're mitigating each one." [Then show the risk table from your PRD.]

**"What if the AI is wrong?"**
Don't say: "The model has 92% accuracy."
Say: "It'll be wrong about 8% of the time. Here's what happens when it's wrong: [describe the fallback]. Users can always override it, and we monitor override rates daily to catch patterns."

**"Can't we just use ChatGPT for this?"**
Don't say: "ChatGPT doesn't have access to our data."
Say: "ChatGPT is a general tool — like using Google Translate for legal contracts. It'll get you 80% of the way, but the 20% it gets wrong could be costly for our use case. We need an AI trained on [our specific data/use case] with [our specific guardrails]. We're actually using the same underlying technology, just customized for our needs."

**"When will it be ready?"**
Don't say: "AI projects are hard to estimate."
Say: "We're using milestone-based planning instead of date-based. Here are the 5 milestones. We're at milestone 2. Each milestone has a go/no-go decision. Current trajectory puts us at full launch in [X weeks], but milestone 3 (production accuracy validation) is the highest-risk point where the timeline could shift."`,
          },
          {
            title: "Managing AI Expectations",
            slug: "managing-ai-expectations",
            type: "lesson",
            difficulty: "intermediate",
            estimatedMinutes: 20,
            order: 2,
            content: `## Managing AI Expectations

The biggest challenge in AI product management isn't technical — it's expectational. Stakeholders, executives, customers, and even your own team have wildly miscalibrated expectations about what AI can and can't do.

Half your job as an AI PM is managing these expectations before they become disappointments.

### The Expectation Gap

**What stakeholders expect:** An AI that understands context perfectly, never makes mistakes, works immediately, costs nothing, and does everything ChatGPT does but customized for their business.

**What they get:** A probabilistic system that's right 85-95% of the time, needs months of data preparation, costs real money, and works well only within its trained domain.

This gap is the source of most AI project failures. Not technical failure — expectation failure.

### Common Misconceptions (and How to Address Them)

**Misconception 1: "AI will replace [role]"**
Reality: AI augments roles, rarely replaces them. The support chatbot doesn't replace support agents — it handles tier-1 tickets so agents can focus on complex issues.

Script: "The AI handles the 65% of cases that are routine and straightforward. Your team handles the 35% that require judgment, empathy, and complex problem-solving. Think of it as removing the boring work so your team can focus on the work that matters."

**Misconception 2: "It should work perfectly from day one"**
Reality: AI products improve over time with data and feedback. V1 will be noticeably imperfect.

Script: "Version 1 will be about 85% accurate — good enough to be useful, but you'll notice mistakes. That's normal and expected. With user feedback and more data, we'll reach 92%+ by version 3. We're shipping early because even at 85%, it saves [X hours/dollars/clicks] per day."

**Misconception 3: "More AI = better product"**
Reality: AI should be invisible when it's working well. The best AI features feel like the product is just smarter, not like there's an AI bolt-on.

Script: "We're not adding AI for the sake of AI. We're solving [specific problem] and AI happens to be the best tool for it. If we could solve it without AI, we would — it would be cheaper and simpler. AI is the means, not the goal."

**Misconception 4: "The AI just needs to be trained once"**
Reality: AI models degrade over time and need continuous monitoring and retraining.

Script: "AI models are like employees — they need ongoing training. Customer behavior changes, language evolves, new product categories emerge. We need to retrain the model [quarterly/monthly] and monitor daily. This is an ongoing operational cost, not a one-time project."

**Misconception 5: "Why can't it do X? ChatGPT can do X"**
Reality: ChatGPT is a general-purpose conversational AI backed by enormous infrastructure. Your product's AI is purpose-built for specific tasks with specific constraints.

Script: "ChatGPT is like a general-knowledge encyclopedia — it knows a little about everything but isn't specialized. Our AI is like a domain expert — it knows [your specific area] deeply but doesn't try to do everything else. We deliberately limit its scope to ensure accuracy and safety within our product."

### Conversation Scripts for Difficult Situations

**When the project is behind schedule:**
"AI projects have a unique challenge: we can't fully predict model performance until we train on real data. We've hit milestone 2 — the model is working but not at our accuracy target. We have two options: (1) launch at current accuracy with a human fallback, or (2) invest 4 more weeks in data augmentation to close the gap. I recommend option 1 — we'll learn faster from real usage."

**When accuracy drops after launch:**
"Our AI's accuracy dropped from 91% to 86% this week. This is expected — it's called model drift. It happens because real-world data changes over time. We're retraining now with recent data and expect to be back above 90% by [date]. The human fallback is handling the gap — no user impact."

**When a competitor announces an AI feature:**
"[Competitor] announced an AI feature similar to ours. Three things to consider: (1) Announcing is not launching — we don't know their accuracy, speed, or actual capability yet. (2) Our competitive advantage is our [specific data/integration/user experience], not the AI itself — the same underlying models are available to everyone. (3) We should track their rollout and user reactions, but not change our roadmap reactively."

**When an executive wants to add AI to everything:**
"I love the ambition. Let me map these ideas against our AI decision framework and come back with a prioritized list. Not every feature benefits from AI — some are better solved with traditional engineering. For the ones that do benefit, I'll rank them by impact, feasibility, and time-to-value."

### Setting Expectations Early: The AI Product Brief

Before starting any AI project, share a one-page brief with all stakeholders:

**Template:**

**What we're building:** [One sentence]

**What AI does in this feature:** [Specifically what the AI handles]

**What AI does NOT do:** [Explicitly list things people might expect but that aren't included]

**Expected accuracy at launch:** [X%] — this means [Y% of cases] will need human fallback

**Timeline to reach target accuracy:** [X weeks/months] after launch, with user feedback

**Ongoing costs:** [$X/month] for API calls, [$Y/month] for monitoring, [$Z] per retraining cycle

**Known limitations:**
1. The AI cannot [do X] because [reason]
2. The AI may struggle with [edge case] until [mitigation]
3. The AI requires [data/feedback] to improve over time

**Success criteria:** [Specific metrics and targets]

**Risks we're actively managing:**
1. [Risk] — [mitigation]
2. [Risk] — [mitigation]

This document prevents the expectation gap from forming in the first place. When someone later says "I thought it would do X," you can point to this brief.`,
          },
        ],
      },
      /* ============================================================
         MODULE 5: AI UX Design
         ============================================================ */
      {
        name: "AI UX Design",
        slug: "ai-ux-design",
        description: "Design for uncertainty, error states, feedback loops, onboarding, and 10 proven AI UX patterns.",
        order: 5,
        sections: [
          {
            title: "Designing for Uncertainty",
            slug: "designing-for-uncertainty",
            type: "lesson",
            difficulty: "intermediate",
            estimatedMinutes: 25,
            order: 1,
            content: `## Designing for Uncertainty

Traditional software design assumes deterministic outcomes. Click a button → something happens. Every time. AI breaks this assumption. The same input might produce different outputs, the model's confidence varies, and wrong answers are a feature, not a bug.

Designing for AI means designing for uncertainty — helping users understand, trust, and work with a system that's right most of the time but not all of the time.

### Confidence Communication

The most fundamental AI UX decision: how (and whether) to show the model's confidence to users.

**Option 1: Hide confidence entirely**
Show the AI's answer without any indication of certainty. This works when the accuracy is very high (>95%) and the cost of being wrong is low.
- Good for: autocomplete suggestions, music recommendations
- Bad for: medical screening, financial analysis

**Option 2: Binary confidence (high/low)**
Show either a confident answer or a "needs review" state. No granular percentages.
- Good for: document classification, spam detection
- Example: "Category: Billing Inquiry" (high confidence) vs "I'm not sure about this one — please review" (low confidence)

**Option 3: Graduated confidence**
Show a visual indicator of certainty (progress bar, stars, color coding) without exact numbers.
- Good for: search results, content relevance ranking
- Example: Green = highly relevant, Yellow = somewhat relevant, Gray = weakly relevant

**Option 4: Explicit percentages**
Show the exact confidence score. Only for power users who understand probabilities.
- Good for: data science tools, internal dashboards, developer tools
- Bad for: consumer products (most users misinterpret "92% confident" as "might be wrong")

### Progressive Disclosure

Don't dump the AI's full analysis on users. Reveal information in layers.

**Layer 1: The Answer**
Show the AI's primary output — the classification, recommendation, or response.

**Layer 2: The Evidence**
On click/expand, show what evidence the AI used. "Based on these 3 customer reviews..."

**Layer 3: The Alternatives**
On deeper click, show other possibilities the AI considered. "Also considered: Product B (78% match), Product C (65% match)"

**Layer 4: The Methodology**
For advanced users: how the AI reached this conclusion. Model version, data sources, confidence breakdown.

### Trust Building Through Transparency

Users trust AI more when they understand how it works — even if that understanding is simplified.

**Techniques:**

1. **Attribution:** "Based on your purchase history and 2,300 similar customers..."
2. **Reasoning:** "I recommended this because: (1) you liked similar authors, (2) it's trending in your category, (3) it has 4.7 average rating"
3. **Limitations disclosure:** "I searched documents from the last 90 days. For older information, try [manual search]."
4. **Learning indicators:** "I'm still learning your preferences. Rate this recommendation to help me improve."

### Handling AI Mistakes Gracefully

The AI will be wrong. The question is: how does the product handle it?

**Design Pattern: The Easy Correction**
Make it trivially easy for users to correct the AI. One click, not a form. The correction should:
1. Immediately update the user's view
2. (Optionally) feed back into the model for improvement
3. Never make the user feel like they're "fighting" the AI

**Design Pattern: The Graceful Fallback**
When the AI can't help, don't show an error. Transition smoothly to the next-best option:
- Can't classify a ticket → "I need a human's help on this one. Routing to [Team]."
- Can't answer a question → "I don't have enough information to answer this. Here are 3 related articles that might help."
- Can't generate content → "I couldn't generate something I'm confident in. Here are some starting points you can work from."

**Design Pattern: The Confidence Gate**
Don't show AI output below a confidence threshold. Instead:
- Below 70%: Don't show AI output, fall back to non-AI behavior
- 70-85%: Show with "suggestion" framing ("You might want to check...")
- 85-95%: Show as default with easy correction
- 95%+: Show as fact with no hedging

### 10 AI UX Patterns

**1. Inline Suggestions**
AI offers suggestions as you type, without interrupting your flow. Examples: Gmail Smart Compose, GitHub Copilot.
- When to use: text input, code writing, form filling
- Key rule: must be dismissable with a single keystroke (Esc or keep typing)

**2. Chat Interface**
Conversational back-and-forth with the AI. Examples: ChatGPT, customer support bots.
- When to use: open-ended queries, multi-turn problem solving
- Key rule: always show "talk to a human" option

**3. Side Panel Assistant**
AI provides context and suggestions in a panel beside the main content. Examples: Notion AI, Google Docs "Help me write."
- When to use: when AI augments an existing workflow without replacing it
- Key rule: the panel should never block the main content

**4. Smart Defaults**
AI pre-fills forms, selects options, or suggests values based on context. Examples: calendar scheduling suggestions, shipping address prediction.
- When to use: when you can predict user intent with >80% accuracy
- Key rule: always editable, never locked in

**5. Content Generation**
AI creates text, images, or other content on demand. Examples: email drafts, image generation, report summaries.
- When to use: creative or repetitive content tasks
- Key rule: always frame as a "draft" that needs human review

**6. Intelligent Search**
AI understands natural language queries and returns ranked, contextual results. Examples: semantic search, FAQ bots.
- When to use: when keyword search isn't good enough
- Key rule: always show source documents, never just AI's interpretation

**7. Anomaly Alerts**
AI detects unusual patterns and proactively notifies users. Examples: fraud alerts, performance anomaly detection.
- When to use: monitoring and security use cases
- Key rule: include the evidence for the anomaly, not just "something looks wrong"

**8. Predictive Recommendations**
AI predicts what the user wants next based on behavior patterns. Examples: Netflix "You might like," Amazon "Frequently bought together."
- When to use: e-commerce, content, productivity tools
- Key rule: explain WHY this was recommended

**9. Auto-Classification**
AI categorizes, tags, or routes items automatically. Examples: email labels, support ticket routing.
- When to use: high-volume categorization tasks
- Key rule: easy to re-classify with one click

**10. Summarization**
AI condenses long content into key points. Examples: meeting summaries, document highlights, review aggregation.
- When to use: information overload scenarios
- Key rule: always link to the full source, never replace it`,
          },
        ],
      },
      /* ============================================================
         MODULE 6: Evaluation & Metrics
         ============================================================ */
      {
        name: "Evaluation & Metrics",
        slug: "evaluation-metrics",
        description: "Define success for AI products, design A/B tests, build evaluation frameworks, and create monitoring dashboards.",
        order: 6,
        sections: [
          {
            title: "Defining Success for AI Products",
            slug: "defining-success-for-ai-products",
            type: "lesson",
            difficulty: "intermediate",
            estimatedMinutes: 25,
            order: 1,
            content: `## Defining Success for AI Products

Measuring AI product success is harder than measuring traditional product success. Traditional metrics (DAU, conversion rate, NPS) still apply — but AI products need additional metrics that capture model performance, user trust, and the unique ways AI can fail.

### The Three Layers of AI Metrics

**Layer 1: Model Metrics (Is the AI technically working?)**
These are engineering metrics. They tell you if the model is performing as expected.
- Accuracy / Precision / Recall / F1
- Latency (P50, P95, P99)
- Confidence score distribution
- Error rate by category
- Drift detection (accuracy over time)

**Layer 2: Product Metrics (Is the AI feature delivering value?)**
These are product metrics. They tell you if users are benefiting from the AI.
- Feature adoption rate (% of eligible users who use the AI feature)
- Task completion rate (% of tasks successfully completed with AI assistance)
- Time savings (before/after comparison)
- Human override rate (% of times users correct the AI)
- Feature retention (do users keep using it after the first week?)

**Layer 3: Business Metrics (Is the AI creating business value?)**
These are outcome metrics. They tell you if the AI is moving the needle.
- Revenue impact (direct and attributed)
- Cost savings (support tickets deflected, manual work automated)
- Customer satisfaction (NPS, CSAT change)
- Competitive positioning
- LTV impact for AI feature users vs non-users

### The Override Rate: Your Most Important Signal

The human override rate — how often users correct, reject, or ignore the AI's output — is the single most informative metric for AI product health.

**Interpreting override rates:**
- **0-5% override:** Either your AI is excellent, or users aren't checking. Verify they're actually evaluating the output.
- **5-15% override:** Healthy range for most AI features. Users trust the AI but stay engaged.
- **15-30% override:** The AI is useful but has significant gaps. Investigate which categories drive overrides.
- **30%+ override:** The AI is more hindrance than help. Users are doing the work twice — once with the AI, once correcting it.

**Action framework:**
- Track override rate by category/segment — a 10% overall rate might hide a 50% rate for a specific category
- Track override rate over time — is it improving (model learning from feedback) or worsening (model drift)?
- Survey users who override frequently — are they finding real errors, or do they just prefer to do it manually?

### Defining Success Criteria Before Launch

Before building, define your success criteria using this template:

**Success metric:** [What are you measuring?]
**Current baseline:** [What's the current state without AI?]
**Target:** [What does success look like?]
**Minimum viable:** [What's the minimum improvement to justify the feature?]
**Anti-target:** [What would indicate failure?]
**Measurement method:** [How will you measure this?]
**Measurement frequency:** [How often?]

**Example:**

| | Metric |
|---|---|
| **Success metric** | Support ticket first-response time |
| **Current baseline** | 4.2 hours average |
| **Target** | <15 minutes for AI-handled tickets |
| **Minimum viable** | <1 hour (still a 4x improvement) |
| **Anti-target** | CSAT drops below 3.0 (even if response time improves) |
| **Measurement method** | Timestamp difference: ticket created → first response |
| **Measurement frequency** | Daily dashboard, weekly review |

### A/B Testing AI Features

A/B testing AI features requires special considerations:

**1. Network effects:** If the AI affects multiple users (e.g., recommendations, search), you need to isolate test groups carefully to avoid contamination.

**2. Learning effects:** Users need time to learn how to work with AI. A 1-week A/B test might understate the long-term benefit. Run tests for at least 4 weeks.

**3. Novelty effects:** Users might over-engage with a new AI feature initially (novelty) and then settle to a lower usage level. The first week's data is unreliable.

**4. Confidence thresholds:** Your A/B test is really testing a combination of model performance + UX + threshold settings. If results are poor, the fix might be adjusting the confidence threshold, not rebuilding the model.

**5. Guardrail metrics:** In addition to your primary metric, track guardrail metrics that should NOT change:
- Error rate should not increase
- Support tickets about the feature should not spike
- User complaints should not increase
- Revenue should not decrease

### Dashboard Design for AI Products

Every AI product needs three dashboards:

**Dashboard 1: Model Health (for ML engineers)**
- Accuracy trend (line chart, 30-day window)
- Confidence score distribution (histogram, daily refresh)
- Latency percentiles (P50, P95, P99)
- Error rate by category (heatmap)
- Data pipeline health (freshness, volume, quality)
- Drift detection (statistical tests comparing recent vs training distribution)

**Dashboard 2: Product Performance (for PMs)**
- Feature adoption (% of eligible users using AI)
- Override rate trend (line chart, by category)
- User satisfaction scores (NPS/CSAT for AI feature)
- Task completion rate (with AI vs without)
- Top failure modes (ranked list of AI errors)

**Dashboard 3: Business Impact (for executives)**
- Cost savings (monthly, cumulative)
- Revenue impact (attributed to AI feature)
- Volume: requests handled by AI vs human
- ROI calculation (value delivered vs AI costs)
- Customer retention difference (AI users vs non-AI users)`,
          },
        ],
      },
      /* ============================================================
         MODULE 7: Cost Modeling
         ============================================================ */
      {
        name: "Cost Modeling",
        slug: "cost-modeling",
        description: "Master token economics, infrastructure costing, build-vs-API break-even analysis, pricing models, and optimization strategies.",
        order: 7,
        sections: [
          {
            title: "Token Economics",
            slug: "token-economics",
            type: "lesson",
            difficulty: "beginner",
            estimatedMinutes: 20,
            order: 1,
            content: `## Token Economics

Every AI feature that uses a language model API has a per-request cost driven by token consumption. Understanding token economics is essential for budgeting, pricing, and optimization.

### What Tokens Actually Cost

Token pricing has two components:
1. **Input tokens** — what you send to the model (prompt, context, instructions)
2. **Output tokens** — what the model generates (response, completion)

Output tokens are always more expensive than input tokens because generation is computationally harder than processing.

### Real-World Cost Examples

**Example 1: AI Email Classifier**
- System prompt: 200 tokens (instructions for the model)
- Email content: 300 tokens average
- Classification output: 50 tokens (category + confidence)
- Total per request: 550 tokens
- Using GPT-4o-mini: (500 input × $0.15/1M) + (50 output × $0.60/1M) = $0.000105
- At 10,000 emails/day: $1.05/day = **$31.50/month**

**Example 2: AI Customer Support Chatbot**
- System prompt: 500 tokens
- Retrieved context (RAG): 1,500 tokens
- Conversation history (last 5 turns): 1,000 tokens average
- User message: 100 tokens
- Bot response: 300 tokens
- Total per turn: 3,400 tokens
- Using GPT-4o-mini: (3,100 × $0.15/1M) + (300 × $0.60/1M) = $0.000645
- 10 turns per conversation: $0.00645
- 5,000 conversations/month: **$32.25/month**

**Example 3: AI Content Generator**
- System prompt: 800 tokens (detailed writing guidelines)
- User input + context: 500 tokens
- Generated content: 2,000 tokens (blog post)
- Total per generation: 3,300 tokens
- Using GPT-4o: (1,300 × $2.50/1M) + (2,000 × $10.00/1M) = $0.0233
- 200 generations/month: **$4.65/month**
- Using GPT-4o-mini for the same: $0.00142 per generation = **$0.28/month**

### The Hidden Costs

Token costs are just the API bill. The real cost of an AI feature includes:

1. **Development time** — 2-6 months of engineering to build, test, and deploy
2. **Data preparation** — collecting, cleaning, and labeling training data
3. **Infrastructure** — vector databases ($20-200/month), embedding storage, caching
4. **Monitoring** — dashboards, alerting, automated evaluation (engineering time)
5. **Maintenance** — prompt iteration, retraining, drift handling (ongoing)
6. **Support** — handling user complaints about AI errors

**Rule of thumb:** Token costs are typically 20-30% of the total cost of owning an AI feature. If your API bill is $100/month, budget $300-500/month for the full feature.

### Cost Optimization Strategies

**1. Model selection**
Use the cheapest model that meets your quality bar. Most tasks don't need GPT-4o — GPT-4o-mini is 97% as good at 6% of the cost for many tasks.

**2. Prompt optimization**
Every unnecessary word in your prompt costs money. A 200-token reduction in a prompt used 1M times/month saves $30-300/month depending on the model.

**3. Caching**
If 30% of queries are similar enough to reuse a cached response, that's 30% off your API bill. Semantic caching (using embeddings to match similar queries) is more effective than exact-match caching.

**4. Tiered processing**
Use a cheap model for easy cases and an expensive model for hard cases:
- Step 1: Classify difficulty with a cheap model (or rules)
- Step 2: Easy cases → GPT-4o-mini ($0.15/1M input)
- Step 3: Hard cases → GPT-4o ($2.50/1M input)
If 80% of cases are easy, you cut costs by ~70%.

**5. Batch processing**
If latency isn't critical, batch requests for lower per-token costs. OpenAI's Batch API is 50% cheaper than real-time.

**6. Output length limits**
Set max_tokens to limit response length. If you need a one-word classification, don't let the model generate 500 words of explanation.

### Build vs API Break-Even Calculator

To decide whether to self-host:

**API cost at scale:**
Monthly API cost = requests/month × tokens/request × price/token

**Self-hosting cost:**
Monthly cost = GPU instance + storage + bandwidth + engineer time for maintenance

**Break-even formula:**
Months to break-even = (Setup cost) ÷ (Monthly API cost - Monthly self-hosting cost)

**If break-even > 24 months:** Stick with API. Technology will change before you recoup.
**If break-even < 12 months:** Self-hosting is likely worth it.
**If break-even 12-24 months:** Consider hybrid — self-host high-volume tasks, API for the rest.

### Pricing AI Features to Users

Four pricing models for AI features:

**1. Included in subscription**
AI is just a feature within the existing plan. Simplest for users, hardest to attribute value.
- Best for: AI features that improve core product metrics (engagement, retention)
- Risk: heavy users subsidized by light users

**2. Usage-based (pay per call)**
Users pay per AI request. Clear cost attribution, but users may under-use due to cost anxiety.
- Best for: API products, developer tools, high-value per-request features
- Example: Stripe's Radar charges per transaction screened

**3. Tiered credits**
Include N AI requests in the plan, charge for overages or upgrades.
- Best for: SaaS products with predictable AI usage patterns
- Example: Free = 10 AI calls/month, Pro = 500, Enterprise = unlimited

**4. Premium add-on**
AI is a separate paid feature or plan tier.
- Best for: AI features with clear, demonstrable ROI
- Example: "AI Assistant" as a $29/month add-on

**Pricing rule of thumb:** Price at 3-5x your cost per request. If an AI request costs you $0.01, charge $0.03-0.05. This gives you margin for infrastructure, monitoring, and improvement costs beyond raw API costs.`,
          },
        ],
      },
    ],
  });
}

/* ============================================================
   MAIN — Run all seeds
   ============================================================ */
async function main() {
  console.log("Seeding workshops...\n");

  /* # Create empty shells for all professions */
  console.log("Creating workshop shells...");
  await seedWorkshopShells();

  /* # Seed AI Product Manager with full content */
  console.log("\nSeeding AI Product Manager content...");
  await seedAIProductManager();

  /* # Seed Software Engineer with full content */
  console.log("\nSeeding Software Engineer content...");
  await seedWorkshop({
    name: "Software Engineer",
    slug: "software-engineer",
    description: "Master algorithms, system design, debugging, and software architecture from fundamentals to advanced concepts.",
    icon: "code",
    color: "#6366f1",
    order: 1,
    modules: softwareEngineerModules,
  });

  /* # Seed Backend Engineer with full content */
  console.log("\nSeeding Backend Engineer content...");
  await seedWorkshop({
    name: "Backend Engineer",
    slug: "backend-engineer",
    description: "Deep dive into APIs, databases, distributed systems, caching, and server-side architecture.",
    icon: "server",
    color: "#10b981",
    order: 2,
    modules: backendEngineerModules,
  });

  /* # Seed Frontend Engineer with full content */
  console.log("\nSeeding Frontend Engineer content...");
  await seedWorkshop({
    name: "Frontend Engineer",
    slug: "frontend-engineer",
    description: "Build modern UIs with React, CSS architecture, accessibility, performance optimization, and design systems.",
    icon: "monitor",
    color: "#0ea5e9",
    order: 3,
    modules: frontendEngineerModules,
  });

  /* # Seed Full Stack Engineer with full content */
  console.log("\nSeeding Full Stack Engineer content...");
  await seedWorkshop({
    name: "Full Stack Engineer",
    slug: "full-stack-engineer",
    description: "End-to-end application development — frontend to backend integration, deployment, and architecture decisions.",
    icon: "layers",
    color: "#8b5cf6",
    order: 4,
    modules: fullStackEngineerModules,
  });

  /* # Seed AI Engineer with full content */
  console.log("\nSeeding AI Engineer content...");
  await seedWorkshop({
    name: "AI Engineer",
    slug: "ai-engineer",
    description: "Build production AI systems — RAG, fine-tuning, LLMOps, vector databases, and ML infrastructure.",
    icon: "brain",
    color: "#f59e0b",
    order: 5,
    modules: aiEngineerModules,
  });

  /* # Seed ICT Project Manager with full content */
  console.log("\nSeeding ICT Project Manager content...");
  await seedWorkshop({
    name: "ICT Project Manager",
    slug: "ict-project-manager",
    description: "Manage ICT projects end-to-end — methodologies, vendor management, risk, EVM, and infrastructure delivery.",
    icon: "calendar",
    color: "#14b8a6",
    order: 7,
    modules: ictProjectManagerModules,
  });

  console.log("\nDone! All workshops seeded.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
