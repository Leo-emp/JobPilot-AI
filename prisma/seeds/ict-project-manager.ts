/* ============================================================
   ICT PROJECT MANAGER WORKSHOP — Seed Content
   ============================================================
   # Project management methodologies, stakeholder management,
   # risk management, Agile/Scrum, budgeting, and leadership.
   ============================================================ */

export const ictProjectManagerModules = [
  /* ============================================================
     MODULE 1: Project Management Methodologies
     ============================================================ */
  {
    name: "Project Management Methodologies",
    slug: "pm-methodologies",
    description: "Waterfall, Agile, Scrum, Kanban, SAFe, and hybrid approaches — when to use each and how to choose.",
    order: 1,
    sections: [
      {
        title: "Choosing the Right Methodology",
        slug: "choosing-methodology",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## Project Management Methodologies

Choosing the right methodology isn't about following trends — it's about matching the approach to your project's needs, team, and constraints.

### Waterfall — Sequential, Plan-Driven

**How it works:** Complete each phase fully before moving to the next.

\`\`\`
Requirements → Design → Development → Testing → Deployment → Maintenance
\`\`\`

**When to use:**
- Requirements are fixed and well-understood
- Regulatory/compliance projects (banking, healthcare, government)
- Hardware-dependent projects (can't iterate on manufactured parts)
- Client requires fixed scope, timeline, and budget upfront

**When NOT to use:**
- Requirements are unclear or likely to change
- You need early feedback from users
- The technology is new or unproven

**Strengths:** Clear milestones, predictable timelines, thorough documentation
**Weaknesses:** Late testing, inflexible to change, high risk of building the wrong thing

### Agile — Iterative, Value-Driven

**Philosophy:** Deliver working software frequently, respond to change over following a plan.

**The Agile Manifesto (4 values):**
1. **Individuals and interactions** over processes and tools
2. **Working software** over comprehensive documentation
3. **Customer collaboration** over contract negotiation
4. **Responding to change** over following a plan

**When to use:**
- Requirements will evolve (most software projects)
- You need early and continuous user feedback
- Time to market is critical
- The team is cross-functional and self-organizing

### Scrum — Agile Framework

**Structure:**
- **Sprint:** 1-4 week iteration (most teams use 2 weeks)
- **Product Owner:** defines WHAT to build (prioritizes backlog)
- **Scrum Master:** facilitates HOW (removes blockers, coaches the team)
- **Development Team:** 3-9 people who build the product

**Ceremonies:**
| Ceremony | Duration | Purpose |
|----------|----------|---------|
| Sprint Planning | 2-4 hours | Plan what to build this sprint |
| Daily Standup | 15 minutes | Sync: what I did, what I'll do, blockers |
| Sprint Review | 1-2 hours | Demo working software to stakeholders |
| Sprint Retrospective | 1-1.5 hours | Improve team processes |

**Artifacts:**
- **Product Backlog** — prioritized list of all features/stories
- **Sprint Backlog** — stories selected for the current sprint
- **Increment** — working software delivered at the end of each sprint

### Kanban — Flow-Based, Continuous

**How it works:** Visualize work, limit work-in-progress (WIP), optimize flow.

**Kanban Board:**
\`\`\`
| Backlog | To Do | In Progress (3) | Review (2) | Done |
|---------|-------|-----------------|------------|------|
| Story H | Story E | Story C      | Story A    | Story X |
| Story I | Story F | Story D      | Story B    | Story Y |
| Story J |       |                 |            | Story Z |
\`\`\`

**WIP Limits** — the key differentiator. In Progress is limited to 3 items. If you're at the limit, you must finish something before starting something new.

**When to use:**
- Support/maintenance teams (unpredictable work)
- Continuous delivery (no sprints needed)
- Teams that need flexibility without sprint boundaries
- Visualizing bottlenecks in the process

### Methodology Decision Guide

| Factor | Waterfall | Scrum | Kanban |
|--------|-----------|-------|--------|
| Requirements clarity | High | Medium | Variable |
| Change frequency | Low | Medium | High |
| Delivery cadence | End of project | Every sprint | Continuous |
| Team size | Any | 3-9 | Any |
| Planning overhead | High upfront | Medium (per sprint) | Low |
| Best for | Fixed-scope, compliance | Product development | Support, ops, maintenance |

### Hybrid Approaches

Most real-world projects use a hybrid. Examples:

**Scrum + Kanban ("Scrumban"):**
- Sprint ceremonies for planning and review
- Kanban board for daily workflow visibility
- WIP limits to prevent overload

**Waterfall + Agile:**
- Waterfall for overall project phases (requirements → design → build → test → deploy)
- Agile/Scrum within the build phase for iterative development
- Common in enterprise environments with fixed contracts but iterative development`,
      },
      {
        title: "Methodology Quiz",
        slug: "methodology-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Project Methodology Quiz

<!--quiz
[
  {
    "question": "A government agency needs to build a tax filing system with strict regulatory requirements that are fully defined upfront. Which methodology fits best?",
    "options": [
      "Scrum — iterate and get feedback every 2 weeks",
      "Kanban — continuous flow with WIP limits",
      "Waterfall — requirements are fixed and compliance demands thorough documentation",
      "Extreme Programming (XP) — pair programming and TDD"
    ],
    "correctIndex": 2,
    "explanation": "Waterfall is the best fit here because: (1) requirements are fully defined and unlikely to change, (2) regulatory compliance demands thorough documentation at each phase, (3) government agencies often require fixed scope and timeline contracts, and (4) tax filing logic must be validated against regulations before any code is written."
  },
  {
    "question": "Your team has 5 developers building a new mobile app. The CEO changes priorities weekly based on user feedback. Which methodology?",
    "options": [
      "Waterfall — plan everything upfront so priorities don't change",
      "Scrum — 2-week sprints to deliver value and adapt to changing priorities",
      "Kanban — no sprints, continuous reprioritization",
      "PRINCE2 — formal stage gates and governance"
    ],
    "correctIndex": 1,
    "explanation": "Scrum is ideal: the 2-week sprint gives enough structure for the team to focus and deliver (Sprint Backlog is protected from mid-sprint changes), while Sprint Planning lets you reprioritize between sprints based on the CEO's new insights. Kanban would allow too much priority thrash; Waterfall can't accommodate weekly changes."
  },
  {
    "question": "In Scrum, who is responsible for deciding what features to build and in what order?",
    "options": [
      "Scrum Master — they lead the team",
      "Product Owner — they own the product backlog and prioritization",
      "Development Team — they know what's technically feasible",
      "Project Manager — they manage scope and timeline"
    ],
    "correctIndex": 1,
    "explanation": "The Product Owner is responsible for maximizing the value of the product by managing the Product Backlog — deciding WHAT to build and in what order. The Scrum Master facilitates the process (HOW the team works). The Development Team decides HOW to implement the selected stories. There is no 'Project Manager' role in Scrum."
  },
  {
    "question": "What is the primary purpose of WIP (Work-In-Progress) limits in Kanban?",
    "options": [
      "To limit how many people can work on the project",
      "To prevent the team from multitasking and identify bottlenecks in the workflow",
      "To set a maximum number of features per release",
      "To cap the project budget"
    ],
    "correctIndex": 1,
    "explanation": "WIP limits prevent multitasking (context switching kills productivity) and make bottlenecks visible. If 'Code Review' is capped at 2 and it's always full, you know reviewing is the bottleneck — maybe you need more reviewers or faster reviews. Without WIP limits, work piles up invisibly and nothing gets finished."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 2: Stakeholder Management
     ============================================================ */
  {
    name: "Stakeholder Management",
    slug: "stakeholder-management",
    description: "Stakeholder mapping, communication plans, managing expectations, and navigating organizational politics.",
    order: 2,
    sections: [
      {
        title: "Stakeholder Communication Framework",
        slug: "stakeholder-communication",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Stakeholder Communication Framework

Projects don't fail because of technology. They fail because of people. Managing stakeholders is the #1 skill that separates successful PMs from struggling ones.

### Stakeholder Mapping (Power/Interest Grid)

Map every stakeholder on two axes:
- **Power** — ability to influence the project (budget approval, decisions, blockers)
- **Interest** — how much they care about the project outcome

\`\`\`
         High Power
            │
  Manage    │   Manage
  Closely   │   Closely
  (Engage)  │   (Partner)
            │
Low ────────┼──────── High
Interest    │         Interest
            │
  Monitor   │   Keep
  (Minimal) │   Informed
            │
         Low Power
\`\`\`

| Quadrant | Strategy | Communication |
|----------|----------|---------------|
| High Power, High Interest | **Partner** — your key stakeholders | Weekly 1:1s, involve in decisions |
| High Power, Low Interest | **Manage** — keep satisfied, don't overwhelm | Monthly summary, escalate blockers only |
| Low Power, High Interest | **Inform** — they care, keep them in the loop | Weekly status emails, town halls |
| Low Power, Low Interest | **Monitor** — minimal effort | Quarterly updates if any |

### The Communication Plan

| Audience | What | How | When |
|----------|------|-----|------|
| Executive Sponsor | Project health, risks, decisions needed | 1:1 meeting | Weekly |
| Steering Committee | Status, milestones, budget | Slide deck | Bi-weekly |
| Development Team | Sprint goals, blockers, priorities | Standup, Sprint Planning | Daily / Bi-weekly |
| End Users | Feature updates, training, feedback | Newsletter, demos | Per release |
| External Vendors | Requirements, timelines, SLAs | Email, contract reviews | As needed |

### Managing Expectations

**The Iron Triangle:**
\`\`\`
       Scope
      /     \\
     /       \\
    /  Quality \\
   /           \\
  Time ——————— Cost
\`\`\`

You can optimize for 2 of 3 (scope, time, cost). Quality is the center that suffers if you push all three.

**Common expectation traps:**
- "Can we add this one feature?" → Scope creep. Always ask: "What do we cut to make room?"
- "Can we deliver faster?" → "Yes, if we reduce scope or increase the team (with ramp-up delay)."
- "This should be easy" → "Let me check with the team and give you an informed estimate."

### Delivering Bad News

**The SBAR Framework:**

| Step | What | Example |
|------|------|---------|
| **S** — Situation | What's happening | "The payment integration is 2 weeks behind schedule" |
| **B** — Background | Why it matters | "This blocks the launch date for the premium tier" |
| **A** — Assessment | Your analysis | "The vendor's API has undocumented limitations we're working around" |
| **R** — Recommendation | What to do | "Option A: Delay launch 2 weeks. Option B: Launch without premium tier, add it in v1.1" |

**Rules for bad news:**
1. Deliver early — the earlier you flag a risk, the more options exist
2. Come with options, not just problems
3. Be specific about impact (timeline, cost, scope)
4. Own it — don't blame the team
5. Follow up with a plan

### RACI Matrix

Define who does what for every deliverable:

| Role | Meaning |
|------|---------|
| **R** — Responsible | Does the work |
| **A** — Accountable | Makes the final decision (only ONE per row) |
| **C** — Consulted | Provides input before the decision |
| **I** — Informed | Notified after the decision |

| Deliverable | PM | Tech Lead | Designer | QA | Sponsor |
|------------|-----|-----------|----------|-----|---------|
| Requirements | A | C | C | I | C |
| Architecture | C | A | I | C | I |
| UI Design | C | C | A | I | I |
| Test Plan | C | C | I | A | I |
| Go/No-Go Decision | R | C | I | C | A |`,
      },
      {
        title: "Stakeholder Management Quiz",
        slug: "stakeholder-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Stakeholder Management Quiz

<!--quiz
[
  {
    "question": "Your CTO (high power, low interest) asks for weekly detailed status reports. What should you do?",
    "options": [
      "Send them weekly 10-page reports — they asked for it",
      "Send a monthly 1-page executive summary with key metrics, and offer to meet if they want details",
      "Ignore their request — they said they're not very interested",
      "Add them to the daily standups"
    ],
    "correctIndex": 1,
    "explanation": "High power, low interest stakeholders should be kept satisfied without being overwhelmed. A monthly executive summary respects their time while keeping them informed. If you send weekly detailed reports, they'll stop reading them. The key is to give them just enough to feel confident the project is on track, and escalate only when decisions are needed."
  },
  {
    "question": "The project is 3 weeks behind schedule. When should you tell the sponsor?",
    "options": [
      "Wait until you've fixed the problem — no need to alarm them",
      "Immediately — deliver bad news early, come with options and a recovery plan",
      "At the next scheduled monthly meeting",
      "Only if they ask about the timeline"
    ],
    "correctIndex": 1,
    "explanation": "Deliver bad news early. The earlier you flag a delay, the more options exist: reduce scope, add resources, extend timeline, or reprioritize. Waiting shrinks those options. Always come with a recommendation (not just the problem). The SBAR framework works well: Situation, Background, Assessment, Recommendation. Trust is built by transparency, not by hiding problems."
  },
  {
    "question": "In a RACI matrix, why should there be only ONE 'Accountable' person per deliverable?",
    "options": [
      "To save space in the matrix",
      "To ensure clear ownership — when everyone is accountable, no one is accountable",
      "Because only one person can do the work at a time",
      "It's just a convention, having multiple is fine"
    ],
    "correctIndex": 1,
    "explanation": "Single accountability ensures someone owns the final decision. With two accountable people, disagreements have no tiebreaker, decisions stall, and both assume the other is handling it. Accountability means 'the buck stops here.' Multiple people can be Responsible (doing the work) or Consulted (giving input), but one person must be the decision-maker."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 3: Risk Management
     ============================================================ */
  {
    name: "Risk Management",
    slug: "risk-management",
    description: "Risk identification, assessment, mitigation strategies, risk registers, and contingency planning.",
    order: 3,
    sections: [
      {
        title: "Risk Management Framework",
        slug: "risk-framework",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Risk Management Framework

Every project has risks. The difference between a good PM and a great PM is anticipating risks before they become problems.

### Risk Identification

**Sources of risk:**
- **Technical:** new technology, integration complexity, performance requirements
- **People:** key person dependency, skill gaps, team turnover
- **Schedule:** unrealistic deadlines, dependency delays, scope creep
- **Budget:** cost overruns, vendor price changes, hidden costs
- **External:** regulatory changes, market shifts, vendor bankruptcy

**Techniques to identify risks:**
1. **Brainstorming** with the team ("what could go wrong?")
2. **Lessons learned** from past projects
3. **Expert interviews** with senior engineers and architects
4. **SWOT analysis** (Strengths, Weaknesses, Opportunities, Threats)
5. **Pre-mortem** — "Imagine the project failed. Why?"

### Risk Assessment — Probability × Impact

| | Low Impact | Medium Impact | High Impact |
|---|-----------|--------------|-------------|
| **High Probability** | Medium Risk | High Risk | Critical Risk |
| **Medium Probability** | Low Risk | Medium Risk | High Risk |
| **Low Probability** | Low Risk | Low Risk | Medium Risk |

**Scoring:**
- Probability: 1 (unlikely) to 5 (almost certain)
- Impact: 1 (minimal) to 5 (project failure)
- Risk Score = Probability × Impact

### Risk Register

| ID | Risk | Probability | Impact | Score | Mitigation | Owner | Status |
|----|------|------------|--------|-------|------------|-------|--------|
| R1 | Lead developer leaves | 2 | 5 | 10 | Cross-train, document architecture | PM | Open |
| R2 | API vendor deprecates endpoint | 3 | 4 | 12 | Abstract vendor behind interface | Tech Lead | Open |
| R3 | Budget exceeded by >20% | 2 | 4 | 8 | Monthly budget reviews, 15% contingency | PM | Monitoring |
| R4 | Data migration corrupts records | 3 | 5 | 15 | Dry run on staging, rollback plan | DBA | Open |
| R5 | Scope creep delays launch | 4 | 3 | 12 | Change control process, fixed sprint scope | PM | Active |

### Mitigation Strategies

| Strategy | Description | When to Use |
|----------|-------------|-------------|
| **Avoid** | Change plans to eliminate the risk entirely | High probability + high impact |
| **Mitigate** | Reduce probability or impact | Most common approach |
| **Transfer** | Shift risk to a third party (insurance, vendor SLA) | Financial or contractual risks |
| **Accept** | Acknowledge and prepare a contingency plan | Low probability or low impact |

### Contingency Planning

For every critical risk (score ≥ 12), define:

1. **Trigger** — what event signals the risk has materialized?
2. **Response** — what do we do immediately?
3. **Contingency budget** — what time/money is reserved?
4. **Owner** — who makes the call?
5. **Communication** — who needs to know?

**Example:**
\`\`\`
Risk: Lead developer leaves mid-project
Trigger: Resignation notice received
Response:
  1. Immediate knowledge transfer sessions (1 week)
  2. Activate pre-identified backup developer
  3. Notify steering committee of potential 2-week delay
  4. Adjust sprint scope for transition period
Contingency: 2 weeks buffer + £5K recruitment budget
Owner: PM
Communication: Steering committee within 24 hours
\`\`\`

### Risk Review Cadence

| Frequency | Activity |
|-----------|----------|
| Weekly | Review top 5 risks in team standup |
| Bi-weekly | Update risk register, re-score risks |
| Monthly | Present risk status to steering committee |
| Per milestone | Conduct risk identification workshop |
| Post-mortem | Document lessons learned for future projects |`,
      },
      {
        title: "Risk Management Quiz",
        slug: "risk-management-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Risk Management Quiz

<!--quiz
[
  {
    "question": "Your lead developer is the only person who understands the legacy system you're migrating from. What's the best mitigation strategy?",
    "options": [
      "Accept the risk — they're not going anywhere",
      "Transfer the risk to a vendor",
      "Mitigate: cross-train another developer and document the architecture NOW, before any emergency",
      "Avoid: cancel the migration project"
    ],
    "correctIndex": 2,
    "explanation": "Key person dependency is one of the most dangerous project risks. Mitigation through cross-training and documentation reduces the impact if they leave (or get sick, or go on holiday). 'They're not going anywhere' is a famous last words — people leave, get sick, or burn out. The time to mitigate is NOW, when there's no pressure, not after they've resigned."
  },
  {
    "question": "A risk has Probability 4 (likely) and Impact 3 (moderate), giving a score of 12. What action should you take?",
    "options": [
      "Accept it — moderate impact isn't worth worrying about",
      "Monitor it at the next quarterly review",
      "Actively mitigate: create a specific action plan, assign an owner, and review weekly",
      "Avoid: shut down the project"
    ],
    "correctIndex": 2,
    "explanation": "A score of 12 puts this in the 'high risk' zone. Likely probability means it will probably happen, and moderate impact means it'll hurt. This needs active mitigation: a specific plan to reduce either the probability or the impact, an owner responsible for executing that plan, and weekly monitoring. Scores 10+ in your risk register should never be just 'monitored.'"
  },
  {
    "question": "What's a 'pre-mortem' and why is it more effective than a post-mortem?",
    "options": [
      "It's the same as a post-mortem but done by senior staff",
      "It's imagining the project has already failed and asking 'why did it fail?' — it surfaces risks while you can still prevent them",
      "It's a medical examination required before starting a project",
      "It's a risk assessment done only on high-budget projects"
    ],
    "correctIndex": 1,
    "explanation": "A pre-mortem asks: 'Imagine it's 6 months from now and this project failed spectacularly. What went wrong?' This psychological trick overcomes optimism bias — people find it easier to explain a (hypothetical) failure than to predict one. It surfaces risks that nobody wants to raise ('what if the CEO changes priorities?'). Unlike a post-mortem, you still have time to act on the findings."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 4: Budget & Resource Planning
     ============================================================ */
  {
    name: "Budget & Resource Planning",
    slug: "budget-resources",
    description: "Project estimation, budgeting, resource allocation, vendor management, and cost tracking.",
    order: 4,
    sections: [
      {
        title: "Project Estimation Techniques",
        slug: "estimation-techniques",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Project Estimation Techniques

Estimation is the most difficult and most important PM skill. Every budget, timeline, and staffing decision flows from your estimates.

### Why Estimates Go Wrong

| Bias | Description | Fix |
|------|-------------|-----|
| **Optimism bias** | "It'll only take a week" | Multiply by 1.5-2x for unknowns |
| **Anchoring** | First number heard becomes the reference | Estimate independently before discussing |
| **Scope creep** | "Just one more feature" | Fixed change control process |
| **Hofstadter's Law** | "It always takes longer than you expect, even when you take this law into account" | Track actuals vs estimates to calibrate |

### Estimation Techniques

**1. Expert Judgment**
Ask experienced team members. Best when combined with other techniques.

**2. Analogous Estimation**
"The last project like this took 6 months, and this one is 30% larger, so ~8 months."

**3. Three-Point Estimation (PERT)**
\`\`\`
Optimistic (O):  Best case if everything goes right
Most Likely (M): Realistic estimate
Pessimistic (P): Worst case

Expected = (O + 4M + P) / 6

Example:
  O = 3 weeks, M = 5 weeks, P = 12 weeks
  Expected = (3 + 20 + 12) / 6 = 5.8 weeks
\`\`\`

**4. Story Points (Relative Sizing)**
Compare tasks to each other rather than estimating absolute time.

| Points | Meaning | Example |
|--------|---------|---------|
| 1 | Trivial | Fix a typo |
| 2 | Small | Add a form field |
| 3 | Medium | Build a new API endpoint |
| 5 | Large | Implement OAuth login |
| 8 | Very large | Build a search feature |
| 13 | Epic-sized | Rebuild the checkout flow |

**Fibonacci sequence** (1, 2, 3, 5, 8, 13) — larger tasks have more uncertainty, so the gaps between estimates increase.

### Budget Structure

| Category | % of Total | Items |
|----------|-----------|-------|
| Personnel | 60-70% | Developer salaries, contractor rates |
| Infrastructure | 10-15% | Cloud hosting, databases, APIs |
| Tools/Software | 5-10% | Licenses, SaaS subscriptions |
| Contingency | 10-15% | Buffer for unknowns |
| Training | 3-5% | Team upskilling, certifications |

### Resource Allocation

**Capacity planning formula:**
\`\`\`
Available capacity = Team size × Working days × Utilization factor

Utilization factor accounts for:
- Meetings, admin work: ~20% of time
- Vacations, sick days: ~10% of time
- Context switching: ~10% of time

Effective capacity = 60-65% of total time

Example:
  5 developers × 20 days/month × 0.65 = 65 developer-days/month
\`\`\`

### Tracking & Reporting

**Earned Value Management (EVM) — Simplified:**

| Metric | Formula | What It Tells You |
|--------|---------|-------------------|
| Planned Value (PV) | Budget × % of time elapsed | How much should be done by now |
| Earned Value (EV) | Budget × % of work completed | How much is actually done |
| Actual Cost (AC) | Total spent so far | How much has been spent |
| Schedule Variance | EV - PV | Ahead (+) or behind (-) schedule |
| Cost Variance | EV - AC | Under (+) or over (-) budget |

**Quick health check:**
- EV > PV and EV > AC → Project is ahead of schedule and under budget (green)
- EV < PV → Behind schedule (yellow/red)
- AC > EV → Over budget (yellow/red)`,
      },
      {
        title: "Budget & Estimation Quiz",
        slug: "budget-estimation-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Budget & Estimation Quiz

<!--quiz
[
  {
    "question": "A developer estimates a feature will take 2 weeks. Using three-point estimation (PERT), they say: Optimistic=1 week, Most Likely=2 weeks, Pessimistic=5 weeks. What's the PERT estimate?",
    "options": [
      "2 weeks (just use the most likely)",
      "2.3 weeks — (1 + 4×2 + 5) / 6 = 14/6",
      "2.7 weeks — (1 + 2 + 5) / 3 = 8/3",
      "3 weeks — round up to be safe"
    ],
    "correctIndex": 1,
    "explanation": "PERT = (O + 4M + P) / 6 = (1 + 8 + 5) / 6 = 14/6 = 2.33 weeks. The formula weights the Most Likely estimate 4x, giving it the most influence while still accounting for best and worst cases. Notice the result is HIGHER than the developer's gut estimate of 2 weeks — PERT naturally includes buffer for uncertainty. This is more reliable than a single-point estimate."
  },
  {
    "question": "Your project EVM shows: Planned Value = £100K, Earned Value = £80K, Actual Cost = £90K. What's the project status?",
    "options": [
      "On track — we've spent most of the budget",
      "Behind schedule (EV < PV) AND over budget (AC > EV)",
      "Ahead of schedule but over budget",
      "Behind schedule but under budget"
    ],
    "correctIndex": 1,
    "explanation": "Schedule Variance = EV - PV = £80K - £100K = -£20K (behind schedule — we've completed less than planned). Cost Variance = EV - AC = £80K - £90K = -£10K (over budget — we've spent more than the value of work completed). This is a red status: we're doing less work than planned AND it's costing more than expected. Time for intervention."
  },
  {
    "question": "Why do estimates use Fibonacci numbers (1, 2, 3, 5, 8, 13) instead of linear numbers (1, 2, 3, 4, 5, 6)?",
    "options": [
      "Fibonacci numbers are more mathematically precise",
      "It's just tradition — any numbers would work",
      "The increasing gaps reflect increasing uncertainty — you can't meaningfully distinguish a 6 from a 7 on a large task",
      "Fibonacci numbers make the math easier for velocity calculations"
    ],
    "correctIndex": 2,
    "explanation": "Fibonacci sizing reflects how humans estimate: we're good at distinguishing small differences (1 vs 2) but terrible at distinguishing large ones (is this a 14 or a 16?). The growing gaps FORCE the team to choose: is this task closer to 8 or 13? There's no hiding behind '11'. This makes estimation meetings faster and more honest about uncertainty."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 5: ICT Governance & Compliance
     ============================================================ */
  {
    name: "ICT Governance & Compliance",
    slug: "governance-compliance",
    description: "ITIL, COBIT, data protection (GDPR), change management, audit preparation, and IT service management.",
    order: 5,
    sections: [
      {
        title: "IT Governance Frameworks",
        slug: "it-governance-frameworks",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## IT Governance Frameworks

IT governance ensures technology decisions align with business goals, manage risk, and comply with regulations. As a PM, you need to know enough to navigate these frameworks confidently.

### ITIL 4 — IT Service Management

ITIL (Information Technology Infrastructure Library) is the most widely adopted framework for managing IT services.

**Core concept: Services, not technology.** ITIL thinks in terms of services delivered to users, not systems or infrastructure.

**The Service Value Chain:**
1. **Plan** — understand demand, set direction
2. **Improve** — continuously improve services
3. **Engage** — understand stakeholder needs
4. **Design & Transition** — design and deploy new/changed services
5. **Obtain/Build** — get components needed for services
6. **Deliver & Support** — keep services running

**Key ITIL Practices for PMs:**

| Practice | What It Is | Why You Care |
|----------|-----------|-------------|
| Incident Management | Restore service ASAP when something breaks | You'll be called when production goes down |
| Change Management | Control how changes are made to production | Every deployment goes through this process |
| Problem Management | Find and fix root causes of recurring incidents | Prevents the same issue from happening again |
| Service Level Management | Define and monitor SLAs | Your project's success metrics may be SLAs |

### COBIT — Governance and Management

COBIT (Control Objectives for Information Technologies) is more about governance — ensuring IT creates value and manages risk.

**Five key principles:**
1. Meeting stakeholder needs
2. Covering the enterprise end-to-end
3. Applying a single integrated framework
4. Enabling a holistic approach
5. Separating governance from management

### Data Protection (GDPR / Privacy)

Every ICT project that handles personal data must consider data protection.

**GDPR Key Principles:**
1. **Lawfulness** — you need a legal basis to process data
2. **Purpose limitation** — collect data for specific, stated purposes only
3. **Data minimization** — collect only what you need
4. **Accuracy** — keep data up to date
5. **Storage limitation** — don't keep data longer than necessary
6. **Security** — protect data with appropriate measures
7. **Accountability** — demonstrate compliance

**PM Checklist for Data Protection:**

| Step | Action |
|------|--------|
| 1 | Identify what personal data the project processes |
| 2 | Document the legal basis for processing |
| 3 | Conduct a Data Protection Impact Assessment (DPIA) if high-risk |
| 4 | Ensure data encryption at rest and in transit |
| 5 | Implement access controls (who can see what data) |
| 6 | Plan for data subject requests (access, deletion, portability) |
| 7 | Define data retention periods |
| 8 | Include privacy requirements in vendor contracts |

### Change Management (Organizational)

Technical change is easy. People change is hard. When your project changes how people work, you need change management.

**Kotter's 8-Step Model:**
1. Create urgency — why must we change NOW?
2. Form a guiding coalition — get influential supporters
3. Create a vision — what does success look like?
4. Communicate the vision — repeatedly, in multiple channels
5. Empower action — remove obstacles
6. Generate short-term wins — visible progress builds momentum
7. Consolidate gains — don't declare victory too early
8. Anchor in culture — make the change stick

### Audit Preparation

Projects may be audited for compliance, security, or quality. Be ready.

**What auditors look for:**
- Decision trail (who decided what, when, why)
- Change logs (what changed, approved by whom)
- Test evidence (test plans, test results, sign-offs)
- Risk register (identified risks, mitigation actions taken)
- Access controls (who has access to what systems)
- Data handling records (what data, where, how protected)

**PM's audit-readiness checklist:**
1. Maintain a decision log with dates and approvers
2. Keep all change requests and approvals documented
3. Store test results and QA sign-offs
4. Update risk register regularly with status
5. Document all data processing activities
6. Keep vendor contracts and SLAs accessible`,
      },
      {
        title: "Governance & Compliance Quiz",
        slug: "governance-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## ICT Governance & Compliance Quiz

<!--quiz
[
  {
    "question": "Your team wants to deploy a hotfix to production immediately. Under ITIL Change Management, what should happen?",
    "options": [
      "Deploy immediately — hotfixes don't need change management",
      "Wait for the next Change Advisory Board (CAB) meeting",
      "Follow the emergency change process: assess risk, get expedited approval, deploy with rollback plan, and document afterward",
      "Submit a standard change request and wait 2 weeks"
    ],
    "correctIndex": 2,
    "explanation": "ITIL distinguishes between Standard, Normal, and Emergency changes. An urgent hotfix is an Emergency Change — it follows an expedited process (not the normal 2-week queue) but still requires: risk assessment (what could go wrong?), authorized approval (on-call manager, not full CAB), a rollback plan (what if it makes things worse?), and post-implementation documentation. Skipping change management entirely is how outages turn into catastrophes."
  },
  {
    "question": "Under GDPR, a user requests all their personal data be deleted. Your system has their data in 3 places: user database, email logs, and payment history. What do you do?",
    "options": [
      "Delete everything immediately from all 3 systems",
      "Delete from user database and email logs, but keep payment history if legally required for tax/financial records — document the retention basis",
      "Tell the user you can't delete anything because it's too complex",
      "Mark their account as inactive but keep all data"
    ],
    "correctIndex": 1,
    "explanation": "GDPR's Right to Erasure is not absolute. You must delete personal data UNLESS there's a legal obligation to keep it (like tax records, which must be retained for 6-7 years). Delete what you can, document the legal basis for what you retain, and inform the user clearly. A PM needs to know which data has legal retention requirements BEFORE the request arrives."
  },
  {
    "question": "An auditor asks for evidence that your project followed proper change management. What documents should you provide?",
    "options": [
      "The project plan and budget report",
      "Meeting notes from team standups",
      "Change request forms, approval records, deployment logs, and test sign-offs — showing who approved what, when, and what testing was done",
      "The final product demo recording"
    ],
    "correctIndex": 2,
    "explanation": "Auditors want a verifiable trail: what changed (change requests), who approved it (approval records with names and dates), what testing was done (test results and sign-offs), and how it was deployed (deployment logs with timestamps). The key principle is traceability — from requirement to deployment, every decision should be traceable to a specific person and date."
  }
]
-->`,
      },
    ],
  },
];
