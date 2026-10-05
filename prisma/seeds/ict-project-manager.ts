/* ============================================================
   ICT PROJECT MANAGER WORKSHOP — Seed Content
   ============================================================
   # Project management methodologies, stakeholder management,
   # risk management, budgeting, governance, and leadership.
   # EXPANDED: Deep prose, analogies, step-by-step walkthroughs.
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
        estimatedMinutes: 45,
        order: 1,
        content: `## Project Management Methodologies — Choosing the Right One

A methodology is the operating system for your project. It defines how work is planned, executed, tracked, and delivered. Choosing the right one is not about following trends or personal preference — it is about matching the approach to your project's specific constraints: how clear are the requirements? How likely are they to change? How large is the team? What does the client expect?

The biggest mistake new project managers make is treating methodology as a religion. "We are an Agile team" or "We do Waterfall" misses the point entirely. The right methodology is the one that maximises your chances of delivering value within your constraints. Sometimes that is Scrum. Sometimes it is Waterfall. Often it is a hybrid.

### Waterfall — Sequential, Plan-Driven

Waterfall is the oldest and most straightforward project management approach. Work flows downward through distinct phases, like water flowing over a series of waterfalls. Each phase must be completed and signed off before the next begins.

\`\`\`
Requirements → Design → Development → Testing → Deployment → Maintenance
     ↓           ↓          ↓           ↓          ↓            ↓
  (Sign-off)  (Sign-off) (Sign-off) (Sign-off) (Sign-off)  (Ongoing)
\`\`\`

Think of Waterfall like building a house. You would never start pouring the foundation before the architectural drawings are complete. You would never start wiring the electricity before the walls are up. Each phase depends on the previous one being finished. The blueprint (requirements) is agreed upon before construction (development) begins, and changes mid-construction are extremely expensive.

**When Waterfall is the right choice:**

Waterfall works well when requirements are stable, well-understood, and unlikely to change. This is common in regulated industries (banking, healthcare, government) where requirements come from regulations, not from user feedback. It is also appropriate when the client demands a fixed scope, fixed timeline, and fixed budget upfront — Waterfall's detailed planning makes this possible (though risky).

Government contracts often mandate Waterfall because the procurement process requires a detailed specification before funding is approved. The specification becomes the contract, and the delivered product is measured against it.

**When Waterfall fails:**

Waterfall fails when requirements are unclear, evolving, or dependent on user feedback. The fundamental problem is that testing happens at the end. If the requirements were wrong (which happens more often than anyone admits), you discover this only after months of development. Fixing a requirements error at the testing phase costs 10-100x more than catching it during design.

The other risk is that the world changes while you are building. A two-year Waterfall project delivers the product that was designed two years ago — the market may have moved on.

### Agile — Iterative, Value-Driven

Agile is a philosophy, not a specific methodology. It emerged in 2001 when seventeen software developers published the Agile Manifesto, rejecting the heavy documentation and rigid planning of traditional methods.

**The Agile Manifesto — Four Values:**

1. **Individuals and interactions** over processes and tools — a talented team with good communication beats a mediocre team with perfect processes
2. **Working software** over comprehensive documentation — a working prototype is worth more than a 200-page specification
3. **Customer collaboration** over contract negotiation — continuous feedback beats a fixed contract
4. **Responding to change** over following a plan — adaptability beats predictability in uncertain environments

These values do not say the things on the right are unimportant. They say the things on the left are MORE important. You still need processes, documentation, contracts, and plans — but they serve the team, not the other way around.

**When Agile shines:**

Agile works best when requirements will evolve (which is most software projects), when you need early and continuous user feedback, when time to market is critical, and when the team is cross-functional and capable of self-organisation. It is the default choice for product development in startups and tech companies.

### Scrum — The Most Popular Agile Framework

Scrum is a specific implementation of Agile principles. It provides a concrete structure: fixed-length iterations (Sprints), defined roles, and regular ceremonies.

**The Three Scrum Roles:**

The **Product Owner** is the voice of the customer. They define WHAT to build by maintaining and prioritising the Product Backlog — the ordered list of everything the product needs. They make trade-off decisions: "Feature A is more important than Feature B." They attend Sprint Reviews to accept or reject completed work. There is exactly one Product Owner per team, and their word on priorities is final.

The **Scrum Master** is the team's coach and facilitator. They do NOT manage the team (Scrum teams are self-organising). Instead, they facilitate ceremonies, remove blockers ("the staging server is down — I will chase IT"), coach the team on Scrum practices, and protect the team from external distractions during the Sprint.

The **Development Team** is a cross-functional group of 3-9 people who do the actual work. They decide HOW to implement the stories selected for the Sprint. They self-organise — no one tells them who works on what. They collectively commit to the Sprint Goal.

**Scrum Ceremonies — The Rhythm of Work:**

| Ceremony | Duration | Purpose | Who Attends |
|----------|----------|---------|-------------|
| Sprint Planning | 2-4 hours | Select stories for the Sprint, define Sprint Goal | All three roles |
| Daily Standup | 15 minutes max | Sync: what I did yesterday, what I will do today, blockers | Dev Team + Scrum Master |
| Sprint Review | 1-2 hours | Demo working software to stakeholders, gather feedback | All roles + stakeholders |
| Sprint Retrospective | 1-1.5 hours | Reflect: what went well, what to improve, action items | All three roles (no stakeholders) |

**Sprint length** is typically 2 weeks. Shorter Sprints (1 week) give faster feedback but higher ceremony overhead. Longer Sprints (4 weeks) give more development time but delayed feedback.

**Scrum Artifacts:**

The **Product Backlog** is the single, prioritised list of everything the product might need. It is alive — items are constantly added, removed, refined, and re-prioritised. The Product Owner owns it.

The **Sprint Backlog** is the subset of Product Backlog items selected for the current Sprint, plus the team's plan for delivering them. Once the Sprint starts, the Sprint Backlog is protected — no new work is added mid-Sprint (except critical bugs).

The **Increment** is the sum of all completed Product Backlog items at the end of the Sprint. It must be in a usable, potentially releasable state — "done" means tested, integrated, and deployable, not "code is written but not tested."

### Kanban — Flow-Based, Continuous Delivery

Kanban is fundamentally different from Scrum. There are no Sprints, no fixed iterations, and no ceremonies (though teams often add their own). Instead, Kanban focuses on visualising the flow of work and optimising that flow.

**The Kanban Board — Making Work Visible:**

\`\`\`
| Backlog | To Do | In Progress (3) | Review (2) | Done |
|---------|-------|-----------------|------------|------|
| Story H | Story E | Story C       | Story A    | Story X |
| Story I | Story F | Story D       |            | Story Y |
| Story J |         |               |            | Story Z |
\`\`\`

The numbers in parentheses are **WIP (Work-In-Progress) Limits** — the maximum number of items that can be in that column at any time. This is the single most important Kanban concept.

**Why WIP limits matter:**

Without WIP limits, teams tend to start many tasks and finish few. A developer might be "working on" 5 things simultaneously, making slow progress on all of them due to context switching. WIP limits force a discipline: you cannot start new work until you finish current work.

WIP limits also make bottlenecks visible. If the "Review" column is always full and work piles up waiting for review, the bottleneck is obvious — you need more reviewers or faster reviews. Without WIP limits, this bottleneck is invisible: work just moves slowly through the whole board, and nobody knows why.

**When to use Kanban:**

Kanban is ideal for support and maintenance teams (unpredictable work arrives continuously), DevOps teams (continuous flow of deployments), and any team where Sprint boundaries feel artificial. It works well for teams that need maximum flexibility in prioritisation.

### Methodology Decision Framework

| Factor | Waterfall | Scrum | Kanban |
|--------|-----------|-------|--------|
| Requirements clarity | High (fixed upfront) | Medium (evolve each Sprint) | Variable (flow-based) |
| Change frequency | Low (changes are expensive) | Medium (between Sprints) | High (reprioritise anytime) |
| Delivery cadence | End of project | Every 2 weeks | Continuous |
| Ideal team size | Any | 3-9 per team | Any |
| Planning overhead | High upfront | Medium (per Sprint) | Low |
| Client involvement | Beginning and end | Every Sprint Review | Continuous |
| Best for | Fixed-scope compliance | Product development | Support, ops, maintenance |

### The Pragmatic Approach — Hybrid Methodologies

Most real-world projects use a hybrid approach. Pure methodologies exist in textbooks; real projects live in the messy middle.

**Scrumban (Scrum + Kanban):** Use Sprint ceremonies (Planning, Review, Retro) for structure, but manage daily work on a Kanban board with WIP limits. This combines Scrum's regular feedback loops with Kanban's flow optimisation.

**Water-Scrum-Fall:** Use Waterfall for the overall project lifecycle (requirements phase → design phase → build phase → test phase → deploy phase), but run Agile Sprints within the build phase. This is common in enterprise environments where the contract is fixed but the development work benefits from iteration.

The key insight: methodology is a tool, not an identity. Use whatever combination delivers the most value for your specific project, team, and constraints.`,
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
    "question": "A government agency needs to build a tax filing system. Requirements come from tax law (fixed), the contract specifies exact deliverables, and a compliance audit is required. Which methodology fits best?",
    "options": [
      "Scrum — iterate every 2 weeks and get user feedback",
      "Kanban — continuous flow with maximum flexibility",
      "Waterfall — requirements are fixed, compliance demands documentation at each phase, and the contract specifies exact deliverables",
      "Extreme Programming (XP) — pair programming and test-driven development"
    ],
    "correctIndex": 2,
    "explanation": "Waterfall is the best fit because: (1) requirements come from tax law and are fixed — they won't change based on user feedback, (2) regulatory compliance demands thorough documentation at each phase (design documents, test plans, sign-offs), (3) the contract specifies exact deliverables measured against a specification, and (4) auditors need a clear, traceable decision trail from requirements through testing to deployment."
  },
  {
    "question": "Your team of 6 developers is building a new mobile app. The CEO changes priorities weekly based on user analytics and competitor moves. Which methodology handles this best?",
    "options": [
      "Waterfall — plan everything upfront so priorities stop changing",
      "Scrum — 2-week Sprints protect the team from mid-Sprint changes while allowing reprioritisation between Sprints",
      "Kanban — no Sprints, continuous reprioritisation as priorities change",
      "PRINCE2 — formal stage gates and governance"
    ],
    "correctIndex": 1,
    "explanation": "Scrum balances structure and flexibility. The Sprint protects the team from mid-Sprint disruption (the CEO cannot change priorities while a Sprint is in progress), while Sprint Planning lets priorities be completely reshuffled every 2 weeks based on new data. Kanban would allow too much priority churn (developers would constantly switch tasks). Waterfall cannot accommodate weekly priority changes at all."
  },
  {
    "question": "In Scrum, who is responsible for deciding WHAT features to build and in what order?",
    "options": [
      "Scrum Master — they lead the team and make decisions",
      "Product Owner — they own the Product Backlog and prioritisation",
      "Development Team — they know what's technically feasible",
      "Project Manager — they manage scope, timeline, and budget"
    ],
    "correctIndex": 1,
    "explanation": "The Product Owner maximises the value of the product by managing the Product Backlog — deciding WHAT to build and in what order. The Scrum Master facilitates HOW the team works (removes blockers, coaches Scrum practices). The Development Team decides HOW to implement each selected story. There is no 'Project Manager' role in pure Scrum — the responsibilities are distributed across the three roles."
  },
  {
    "question": "Your Kanban board shows that the 'Code Review' column is always at its WIP limit (2), while 'In Progress' items pile up waiting. What does this tell you?",
    "options": [
      "The WIP limit is too high — reduce it to 1",
      "Code review is the bottleneck — you need more reviewers, faster reviews, or pair programming to reduce the queue",
      "The team is too slow at writing code",
      "You should remove WIP limits entirely so work flows freely"
    ],
    "correctIndex": 1,
    "explanation": "When a column is consistently at its WIP limit with items queuing behind it, that column IS the bottleneck. The fix: add more capacity to that stage (more reviewers), improve efficiency (smaller PRs, review guidelines), or restructure (pair programming eliminates separate review). Removing WIP limits would hide the bottleneck, not fix it. The whole point of WIP limits is to make bottlenecks visible."
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
    description: "Stakeholder mapping, communication plans, managing expectations, delivering bad news, and navigating politics.",
    order: 2,
    sections: [
      {
        title: "Stakeholder Communication Framework",
        slug: "stakeholder-communication",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 45,
        order: 1,
        content: `## Stakeholder Communication Framework

Projects do not fail because of technology. They fail because of people. The most technically brilliant project in the world will crash if the stakeholders are not aligned, informed, and supportive. Managing stakeholders — understanding their needs, setting their expectations, and communicating effectively — is the number one skill that separates successful project managers from struggling ones.

Think of stakeholder management like being the conductor of an orchestra. You do not play every instrument, but you ensure that every musician knows their part, comes in at the right time, and plays in harmony with everyone else. If the trumpets do not know about the key change, the performance falls apart — even though every individual musician is talented.

### Stakeholder Mapping — The Power/Interest Grid

Before you can communicate effectively with stakeholders, you need to understand who they are and what they care about. The Power/Interest grid is the most practical tool for this.

Map every person who can influence or is affected by your project on two axes:

- **Power** — their ability to influence the project. Can they approve the budget? Block a decision? Assign or remove team members? Change requirements?
- **Interest** — how much they care about the project's day-to-day progress and outcomes.

\`\`\`
         High Power
            │
  Keep      │   Partner
  Satisfied │   Closely
  (Manage)  │   (Engage)
            │
Low ────────┼──────── High
Interest    │         Interest
            │
  Monitor   │   Keep
  (Minimal) │   Informed
            │
         Low Power
\`\`\`

Each quadrant requires a different communication strategy:

**High Power, High Interest — Partner Closely.** These are your key stakeholders. The project sponsor, the product owner, the tech lead. They can make or break your project AND they care deeply about it. Strategy: weekly one-to-one meetings, involve them in key decisions, give them early access to information, ask for their input frequently. Neglecting this group is the fastest way to fail.

**High Power, Low Interest — Keep Satisfied.** The CTO who approved the budget but does not track daily progress. A VP whose department is affected but who has 20 other things on their plate. Strategy: monthly executive summaries (one page, key metrics only), escalate only when you need a decision or there is a genuine blocker. Do NOT overwhelm them with detail — they will disengage entirely.

**Low Power, High Interest — Keep Informed.** End users who will use the product, junior team members who are passionate about the project, support staff who will handle questions. Strategy: regular status updates (weekly email or newsletter), town hall presentations at milestones, demos of new features.

**Low Power, Low Interest — Monitor.** People on the periphery. Strategy: minimal effort. Quarterly updates at most. Include them in broad announcements but do not invest significant time.

### The Communication Plan

A communication plan documents who gets what information, through what channel, and how often. Without one, communication is ad hoc — some stakeholders get too much information, others get too little, and the PM spends their entire day answering the same questions in different meetings.

| Audience | What They Need | Channel | Frequency |
|----------|---------------|---------|-----------|
| Executive Sponsor | Health, risks, decisions needed | 1:1 meeting | Weekly (30 min) |
| Steering Committee | Status, milestones, budget | Slide deck + meeting | Bi-weekly |
| Development Team | Sprint goals, blockers, priorities | Standup + Sprint Planning | Daily + Bi-weekly |
| End Users | Feature updates, training | Newsletter, demos | Per release |
| External Vendors | Requirements, timelines, SLAs | Email, contract reviews | As needed |

### Managing Expectations — The Iron Triangle

Every project is constrained by three things: Scope (what you build), Time (when you deliver), and Cost (what you spend). Quality sits in the centre. You can optimise for any two, but the third must flex.

\`\`\`
       Scope
      /     \\
     /       \\
    / Quality \\
   /           \\
  Time ——————— Cost
\`\`\`

When a stakeholder says "Can we add this feature AND deliver on time AND stay within budget?" the honest answer is: "Pick two. The third must give." This is not pessimism — it is physics. If you say yes to all three, you sacrifice quality (hidden technical debt, bugs, burnout).

**Common expectation traps and how to handle them:**

"Can we add this one feature?" — This is scope creep. The right response: "Absolutely, but let's talk about trade-offs. If we add Feature X, what do we defer or cut? Or do we extend the timeline by two weeks?" Never just say yes. Always make the trade-off visible.

"Can we deliver faster?" — "Yes, if we reduce scope (deliver 80% of features now, 20% in v2) or add team members (with a 3-4 week ramp-up delay before they're productive). Which would you prefer?"

"This should be easy" — "Let me check with the team and give you an informed estimate. 'Easy' from a business perspective and 'easy' from a technical perspective are often very different." Never commit to an estimate in a meeting before consulting your team.

### Delivering Bad News — The SBAR Framework

Bad news is inevitable. The PM's job is not to prevent all problems — it is to communicate them early, clearly, and with options. The SBAR framework ensures you deliver bad news professionally:

| Step | What It Means | Example |
|------|---------------|---------|
| **S** — Situation | What is happening right now | "The payment integration is 2 weeks behind schedule" |
| **B** — Background | Why does this matter | "This blocks the launch date for the premium tier" |
| **A** — Assessment | Your analysis of the situation | "The vendor API has undocumented limitations we are working around" |
| **R** — Recommendation | What you recommend doing about it | "Option A: Delay launch 2 weeks. Option B: Launch without premium tier, add it in v1.1" |

**The five rules for delivering bad news:**

1. **Deliver early** — the earlier you flag a risk, the more options exist. A problem reported at 20% completion has many solutions. The same problem at 90% completion has almost none.
2. **Come with options** — never present a problem without at least two possible solutions. "Here's the problem and here are two ways we could handle it. I recommend Option A because..."
3. **Be specific about impact** — "Two weeks behind schedule" is useful. "Behind schedule" is not. Quantify the impact on timeline, budget, and scope.
4. **Own it** — do not blame the team, the vendor, or circumstances. "We are behind because X" is better than "The vendor messed up."
5. **Follow up with a plan** — after the conversation, send a written summary of the agreed action and timeline.

### The RACI Matrix — Eliminating Role Confusion

One of the most common causes of project friction is unclear ownership. Two people think the other is handling something, or three people make conflicting decisions on the same topic. The RACI matrix defines exactly who does what.

| Role | What It Means |
|------|---------------|
| **R** — Responsible | Does the work. Multiple people can be Responsible. |
| **A** — Accountable | Makes the final decision and owns the outcome. ONLY ONE per row. |
| **C** — Consulted | Provides input and expertise before the decision is made. |
| **I** — Informed | Notified after the decision is made. No input needed. |

| Deliverable | PM | Tech Lead | Designer | QA | Sponsor |
|------------|-----|-----------|----------|-----|---------|
| Requirements Gathering | A | C | C | I | C |
| Architecture Design | C | A | I | C | I |
| UI/UX Design | C | C | A | I | I |
| Test Strategy | C | C | I | A | I |
| Go/No-Go Decision | R | C | I | C | A |

The critical rule: there must be exactly ONE Accountable person per deliverable. If two people are both "accountable," neither truly is — disagreements have no tiebreaker, decisions stall, and both assume the other is handling it.`,
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
    "question": "Your CTO (high power, low interest) asks for weekly detailed status reports. What's the most effective approach?",
    "options": [
      "Send them weekly 10-page detailed reports as requested — they're the CTO",
      "Send a concise monthly executive summary (one page, key metrics), and offer a quick meeting if they want more detail",
      "Ignore the request — they said they're not very interested in the project",
      "Add them to every daily standup so they stay informed"
    ],
    "correctIndex": 1,
    "explanation": "High power, low interest stakeholders need to be kept satisfied without being overwhelmed. A monthly one-page summary respects their time while keeping them informed. If you send 10-page weekly reports, they'll stop reading after week 2. Match your communication to their actual interest level, not their stated request. Offer deeper detail on demand — they'll appreciate the option without needing to use it."
  },
  {
    "question": "The project is 3 weeks behind schedule due to an unexpected technical challenge. When should you tell the project sponsor?",
    "options": [
      "Wait until you've solved the problem — no need to alarm them unnecessarily",
      "Immediately — deliver bad news early with options and a recovery plan (SBAR framework)",
      "At the next scheduled monthly steering committee meeting",
      "Only if the sponsor asks directly about the timeline"
    ],
    "correctIndex": 1,
    "explanation": "Deliver bad news as early as possible. At 3 weeks behind, you still have options: reduce scope, add resources, extend the timeline, or reprioritise. If you wait another month, those options shrink. Use SBAR: Situation (3 weeks behind), Background (technical challenge in X), Assessment (impact on launch date), Recommendation (Option A or B). Sponsors value transparency and options, not optimistic silence followed by a crisis."
  },
  {
    "question": "In a RACI matrix, why must there be exactly ONE 'Accountable' person per deliverable?",
    "options": [
      "To keep the matrix simple and easy to read",
      "Because only one person can do the work at a time",
      "To ensure clear ownership — when multiple people are accountable, no one truly is. Disagreements have no tiebreaker.",
      "It's just a convention — having two or three accountable people works fine in practice"
    ],
    "correctIndex": 2,
    "explanation": "Single accountability is a core principle of RACI. With two accountable people: (1) disagreements have no tiebreaker — the decision stalls, (2) each assumes the other is handling it — things fall through the cracks, (3) there's no single person who owns the outcome. Multiple people can be Responsible (doing the work) or Consulted (providing input), but exactly one person must own the final decision and be answerable for the result."
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
    description: "Risk identification, assessment, mitigation strategies, risk registers, contingency planning, and pre-mortems.",
    order: 3,
    sections: [
      {
        title: "Risk Management Framework",
        slug: "risk-framework",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 45,
        order: 1,
        content: `## Risk Management Framework

Every project has risks. No matter how well you plan, unexpected things will happen — a key developer leaves, a vendor's API changes, requirements shift, the budget gets cut, or a global pandemic disrupts your supply chain. The difference between a good PM and a great PM is not that great PMs avoid all risks — it is that they anticipate risks before they become crises and have plans ready when they materialise.

Think of risk management like driving a car. You do not drive with your eyes closed and hope for the best. You check your mirrors (identify risks), maintain safe following distance (create buffer), wear a seatbelt (mitigation), and have insurance (contingency plan). You do not expect an accident, but you prepare for one.

### Risk Identification — Finding Risks Before They Find You

The hardest part of risk management is identifying risks that nobody wants to talk about. Teams suffer from optimism bias — "It'll be fine," "That won't happen to us," "We've never had that problem before." Your job is to push past this optimism systematically.

**Five categories of project risk:**

**Technical risks** — new or unfamiliar technology, complex integrations, performance requirements you have never met before, dependencies on third-party systems you do not control. Example: "The vendor's payment API has a rate limit of 100 requests per minute, and our Black Friday projections show we will need 500."

**People risks** — key person dependency (one developer who knows the legacy system), skill gaps (nobody on the team has done machine learning before), team turnover (a developer might leave for a competitor), and team conflicts. Example: "Our lead architect is the only person who understands the data pipeline. If they leave or get sick, the project stops."

**Schedule risks** — unrealistic deadlines imposed by business commitments, dependency delays (another team's project must finish before yours can start), scope creep (continuous addition of "small" features that collectively delay the project by months), and external dependencies with unknown timelines.

**Budget risks** — cost overruns from scope changes, vendor price increases, hidden costs discovered mid-project (licence fees nobody budgeted for), and currency fluctuations for international vendors.

**External risks** — regulatory changes (new data protection laws), market shifts (a competitor launches a similar product), vendor bankruptcy, and political or economic disruption.

**Techniques for identifying risks:**

The **Pre-Mortem** is the most powerful technique. Gather the team and say: "Imagine it is six months from now and this project has failed spectacularly. The deadline was missed, the budget was blown, the sponsor is furious. What went wrong?"

This psychological trick works because people find it much easier to explain a (hypothetical) failure than to predict one. It overcomes the optimism bias and surfaces risks that nobody wants to raise in a normal meeting — "What if the CEO changes priorities?" "What if the integration turns out to be ten times harder than estimated?"

Other techniques include brainstorming sessions ("What could go wrong?"), reviewing lessons learned from previous projects, expert interviews with senior engineers and architects, and SWOT analysis.

### Risk Assessment — Probability × Impact

Once you have identified your risks, you need to prioritise them. Not all risks are equal — a risk that is both highly likely AND highly impactful needs urgent attention, while a risk that is unlikely AND has minimal impact can be monitored passively.

Score each risk on two dimensions:

| | Low Impact (1-2) | Medium Impact (3) | High Impact (4-5) |
|---|-----------|--------------|-------------|
| **High Probability (4-5)** | Medium Risk | High Risk | **Critical Risk** |
| **Medium Probability (3)** | Low Risk | Medium Risk | High Risk |
| **Low Probability (1-2)** | Low Risk | Low Risk | Medium Risk |

**Risk Score = Probability × Impact**

A risk scoring 15+ (e.g., probability 3 × impact 5 = 15) is critical and needs an active mitigation plan and contingency. A risk scoring under 6 can be monitored passively with periodic review.

### The Risk Register — Your Living Document

The risk register is NOT a document you create at the start of the project and forget about. It is a living document that you review and update regularly — at least bi-weekly, and ideally weekly for the top risks.

| ID | Risk Description | Prob | Impact | Score | Mitigation Strategy | Owner | Status |
|----|-----------------|------|--------|-------|-------------------|-------|--------|
| R1 | Lead developer leaves mid-project | 2 | 5 | 10 | Cross-train 2 developers, document architecture decisions | PM | Open |
| R2 | Vendor API deprecates endpoints we depend on | 3 | 4 | 12 | Abstract vendor behind interface layer; can swap vendor in 2 weeks | Tech Lead | Active |
| R3 | Budget overrun exceeds 20% | 2 | 4 | 8 | Monthly budget reviews, 15% contingency reserved | PM | Monitoring |
| R4 | Data migration corrupts production records | 3 | 5 | 15 | Dry-run migration on staging, automated rollback, backup before migration | DBA | Active |
| R5 | Scope creep delays launch by 4+ weeks | 4 | 3 | 12 | Change control process, Sprint scope is fixed once committed | PM | Active |

### Mitigation Strategies — The Four Options

When you have identified and prioritised a risk, you have four strategic options:

| Strategy | What It Means | When to Use | Example |
|----------|--------------|-------------|---------|
| **Avoid** | Change your plans to eliminate the risk entirely | High probability + high impact risks where elimination is possible | "Instead of building our own payment system (risky), we will use Stripe (proven)" |
| **Mitigate** | Take action to reduce the probability or the impact | Most common strategy for most risks | "Cross-train two developers on the legacy system to reduce key-person dependency" |
| **Transfer** | Shift the risk to a third party | Financial or contractual risks | "Buy cyber insurance, use an SLA-backed vendor, outsource the risky module" |
| **Accept** | Acknowledge the risk and prepare a contingency plan | Low probability or low impact risks where mitigation cost exceeds the risk | "Accept that a minor UI library might be deprecated; prepare to switch if it happens" |

### Contingency Planning — When Risks Materialise

For every critical risk (score 12 or above), create a written contingency plan:

\`\`\`
Risk: Lead developer leaves mid-project (Score: 10)
Trigger: Resignation notice received
Immediate response (within 24 hours):
  1. Conduct knowledge transfer sessions (daily for 1 week)
  2. Activate pre-identified backup developer
  3. Notify steering committee of potential 2-week delay
  4. Adjust Sprint scope for transition period
Contingency budget: 2 weeks buffer + £5,000 recruitment budget
Decision owner: PM
Communication: Steering committee within 24 hours, team within 4 hours
\`\`\`

### Risk Review Cadence

| Frequency | Activity |
|-----------|----------|
| Weekly | Review top 5 risks in team standup (2 minutes) |
| Bi-weekly | Update full risk register — re-score risks, add new ones, close resolved ones |
| Monthly | Present risk status to steering committee |
| Per milestone | Conduct full risk identification workshop (brainstorm + pre-mortem) |
| Project close | Document lessons learned for future projects |`,
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
    "question": "Your lead developer is the ONLY person who understands the legacy system you're migrating from. What's the best mitigation strategy?",
    "options": [
      "Accept the risk — they're not planning to leave",
      "Transfer the risk by outsourcing the migration to a vendor",
      "Mitigate: cross-train another developer AND document the architecture NOW, before any emergency",
      "Avoid: cancel the migration and keep the legacy system"
    ],
    "correctIndex": 2,
    "explanation": "Key person dependency is one of the most dangerous project risks because it's a single point of failure. Mitigation through cross-training and documentation reduces the impact if they leave, get sick, go on holiday, or burn out. 'They're not planning to leave' is the most famous last words in project management. The time to mitigate is NOW, when there's no pressure — not after they've resigned with 2 weeks' notice."
  },
  {
    "question": "A risk has Probability 4 (likely) and Impact 3 (moderate), scoring 12. What action should you take?",
    "options": [
      "Accept it — moderate impact isn't worth the effort",
      "Monitor it at the next quarterly review",
      "Actively mitigate: create a specific action plan, assign an owner, and review weekly",
      "Avoid: shut down the entire project to eliminate the risk"
    ],
    "correctIndex": 2,
    "explanation": "A score of 12 is in the 'high risk' zone. 'Likely' probability means it will probably happen, and 'moderate' impact means it will cause real disruption. This needs active mitigation: a specific plan with concrete actions, an owner responsible for executing it, and weekly status updates. Passive monitoring (quarterly review) is appropriate for low-risk items. Any risk scoring 10+ should have an active mitigation plan."
  },
  {
    "question": "What is a 'pre-mortem' and why is it more effective than traditional risk brainstorming?",
    "options": [
      "A medical check-up required before starting risky projects",
      "A pre-mortem asks 'imagine this project has already failed — why did it fail?' which overcomes optimism bias and surfaces risks people are reluctant to raise",
      "A post-mortem conducted at the project midpoint instead of the end",
      "A risk assessment technique only used on high-budget enterprise projects"
    ],
    "correctIndex": 1,
    "explanation": "A pre-mortem overcomes optimism bias by framing risks as an explanation rather than a prediction. People find it psychologically easier to explain why something failed (past tense, hypothetical) than to predict failure (which feels negative). It surfaces uncomfortable risks — 'what if the CEO changes priorities?', 'what if the vendor goes bankrupt?' — that nobody would raise in a normal brainstorming session. And unlike a post-mortem, you still have time to act on the findings."
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
    description: "Project estimation, budgeting, resource allocation, earned value management, vendor management, and cost tracking.",
    order: 4,
    sections: [
      {
        title: "Project Estimation Techniques",
        slug: "estimation-techniques",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 45,
        order: 1,
        content: `## Project Estimation Techniques

Estimation is simultaneously the most important and the most difficult project management skill. Every budget, every timeline, every staffing decision, and every stakeholder commitment flows from your estimates. If the estimates are wrong, everything downstream is wrong — regardless of how well you execute.

The uncomfortable truth is that all estimates are wrong. The question is how wrong, and whether you have accounted for that uncertainty. A good estimate is not one that predicts the future perfectly — it is one that communicates a range of likely outcomes with appropriate confidence levels.

### Why Estimates Go Wrong — The Four Cognitive Traps

Understanding why estimates fail helps you avoid repeating the same mistakes.

**Optimism bias** — this is the most common trap. Developers naturally estimate based on the "happy path" where everything goes smoothly: no bugs, no unclear requirements, no meetings, no context switching, no dependencies that block them. In reality, the happy path almost never happens. A task estimated at 2 days often takes 4-5 days when you account for interruptions, unexpected complexity, code reviews, and deployment issues. A common correction factor is to multiply developer estimates by 1.5 to 2x for tasks with unknowns.

**Anchoring** — the first number mentioned in a discussion becomes the psychological anchor. If someone says "I think this will take about 3 weeks," everyone else's estimates unconsciously drift toward 3 weeks. Fix: have each team member write their estimate independently BEFORE discussing. Compare the independent estimates, then discuss the differences.

**Scope creep** — "Can we add just one more feature?" Individual additions seem small, but they accumulate. Ten "small" additions of half a day each add a full week to the project. Fix: a formal change control process where every scope addition requires a documented impact on timeline and budget, approved by the sponsor.

**Hofstadter's Law** — "It always takes longer than you expect, even when you take Hofstadter's Law into account." This recursive law highlights that we consistently underestimate complexity, even when we know we consistently underestimate complexity. Fix: track your actual delivery times against your estimates over multiple projects. Use the data to calibrate your estimates, not your feelings.

### Estimation Techniques

**1. Analogous Estimation (Top-Down)**

Compare your project to similar past projects. "The last customer portal we built took 6 months with 4 developers. This one is about 30% more complex, so estimate 8 months with 4 developers."

This is fast and useful for early-stage estimates when detailed requirements are not available. Its accuracy depends entirely on how similar the comparison project truly is.

**2. Three-Point Estimation (PERT)**

Instead of a single estimate, provide three: optimistic, most likely, and pessimistic. The PERT formula weighs the most likely estimate most heavily.

\`\`\`
Optimistic (O):   Best case — everything goes right, no surprises
Most Likely (M):  Realistic case — normal challenges, typical pace
Pessimistic (P):  Worst case — major setbacks, unforeseen complexity

PERT Estimate = (O + 4×M + P) / 6

Example — building a search feature:
  Optimistic:   3 weeks (if the existing library handles everything)
  Most Likely:  5 weeks (some custom work needed, normal testing)
  Pessimistic: 12 weeks (library doesn't support our data model, build from scratch)

  PERT = (3 + 20 + 12) / 6 = 5.8 weeks
\`\`\`

The PERT formula naturally produces an estimate HIGHER than the most likely case, which is exactly what you want — it builds in buffer for the realistic probability that things will not go perfectly.

**3. Story Points — Relative Sizing**

Instead of estimating in hours or days (which creates false precision), estimate in relative sizes. Compare tasks to each other: "Is this bigger or smaller than that?"

| Points | Relative Size | Example |
|--------|--------------|---------|
| 1 | Trivial — a few minutes | Fix a typo, update a config value |
| 2 | Small — a few hours | Add a form field, write a simple test |
| 3 | Medium — about a day | Build a new API endpoint with validation |
| 5 | Large — 2-3 days | Implement OAuth login, build a complex form |
| 8 | Very large — a week | Build a search feature with filters and pagination |
| 13 | Epic-sized — needs decomposition | Rebuild the entire checkout flow |

The Fibonacci sequence (1, 2, 3, 5, 8, 13) is used intentionally. The increasing gaps between numbers reflect increasing uncertainty. You can meaningfully distinguish a 1-point task from a 2-point task. But you cannot meaningfully distinguish a 14-point task from a 16-point task — the uncertainty is too high. Fibonacci forces the team to make a clear choice: "Is this closer to 8 or 13?"

**4. Planning Poker**

A collaborative estimation technique where each team member independently selects a story point card for a task, then all cards are revealed simultaneously. If estimates differ significantly (one person says 3, another says 8), the discussion reveals hidden complexity or misunderstandings.

### Budget Structure

| Category | Typical % of Total | What It Includes |
|----------|-------------------|-----------------|
| Personnel | 60-70% | Developer salaries, contractor rates, QA, designers |
| Infrastructure | 10-15% | Cloud hosting, databases, API subscriptions, CDN |
| Tools & Software | 5-10% | IDE licences, project management tools, SaaS subscriptions |
| Contingency | 10-15% | Buffer for unknowns — ALWAYS include this |
| Training | 3-5% | Team upskilling, certifications, conferences |

The contingency budget is non-negotiable. Projects without contingency have zero buffer for ANY unexpected event. A 15% contingency means you can absorb a moderate surprise without going back to the sponsor for more money.

### Resource Allocation — Effective Capacity

A common mistake is assuming team members are available 100% of the time for project work. They are not. Meetings, admin tasks, email, context switching, holidays, and sick days consume a significant portion of every working day.

\`\`\`
Effective capacity = Team size × Working days × Utilisation factor

Utilisation factor accounts for:
  - Meetings, admin, communication: ~20% of time
  - Holidays, sick days, personal: ~10% of time
  - Context switching, ramp-up: ~10% of time

Effective utilisation ≈ 60-65% of total time

Example:
  5 developers × 20 working days/month × 0.65 utilisation
  = 65 effective developer-days per month
  (NOT 100 — planning for 100 guarantees you will miss the deadline)
\`\`\`

### Earned Value Management (EVM) — Are We On Track?

EVM answers the two most important project questions: "Are we ahead or behind schedule?" and "Are we over or under budget?" — using objective metrics, not gut feeling.

| Metric | What It Measures | Formula |
|--------|-----------------|---------|
| Planned Value (PV) | How much work should be done by now | Budget × % of time elapsed |
| Earned Value (EV) | How much work IS actually done | Budget × % of work completed |
| Actual Cost (AC) | How much money has been spent | Sum of all actual costs to date |
| Schedule Variance (SV) | Ahead or behind schedule | EV − PV (positive = ahead) |
| Cost Variance (CV) | Under or over budget | EV − AC (positive = under budget) |

**Quick health check with EVM:**
- EV > PV and EV > AC → Green: ahead of schedule and under budget
- EV < PV → Amber/Red: behind schedule
- AC > EV → Amber/Red: over budget
- EV < PV AND AC > EV → Red: behind schedule AND over budget — immediate intervention needed`,
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
    "question": "A developer estimates a feature at 2 weeks. Using PERT: Optimistic=1 week, Most Likely=2 weeks, Pessimistic=5 weeks. What's the PERT estimate?",
    "options": [
      "2 weeks — just use the most likely estimate",
      "2.33 weeks — (1 + 4×2 + 5) / 6 = 14/6",
      "2.67 weeks — (1 + 2 + 5) / 3 = 8/3 (simple average)",
      "3 weeks — round up to the nearest whole week"
    ],
    "correctIndex": 1,
    "explanation": "PERT = (O + 4M + P) / 6 = (1 + 8 + 5) / 6 = 14/6 = 2.33 weeks. The formula weights the Most Likely estimate 4x because it's the most probable outcome, while still accounting for best-case and worst-case scenarios. Notice the result (2.33) is higher than the developer's gut estimate (2) — PERT naturally builds in buffer for uncertainty. This makes it more reliable than single-point estimates, which almost always suffer from optimism bias."
  },
  {
    "question": "Your project EVM shows: Planned Value = £100K, Earned Value = £80K, Actual Cost = £90K. What's the project health?",
    "options": [
      "On track — we've spent most of the budget and completed most of the work",
      "Behind schedule AND over budget — we've completed less work than planned (EV < PV) and it cost more than the value delivered (AC > EV)",
      "Ahead of schedule but over budget",
      "Behind schedule but under budget"
    ],
    "correctIndex": 1,
    "explanation": "Schedule Variance = EV - PV = £80K - £100K = -£20K → we've completed LESS work than planned (behind schedule). Cost Variance = EV - AC = £80K - £90K = -£10K → we've SPENT MORE than the value of work completed (over budget). This is a double-red status. Both variances are negative, meaning the project is delivering less value at higher cost than planned. Time for immediate intervention: reduce scope, add resources, or extend the timeline."
  },
  {
    "question": "Why do Agile teams use Fibonacci numbers (1, 2, 3, 5, 8, 13) for story points instead of linear numbers (1, 2, 3, 4, 5, 6)?",
    "options": [
      "Fibonacci numbers are more mathematically precise for velocity calculations",
      "It's just an industry convention — any numbers would produce the same results",
      "The increasing gaps reflect increasing uncertainty — you can't meaningfully distinguish a '14' from a '16' on complex tasks, so Fibonacci forces clear decisions",
      "Fibonacci numbers are required by the Scrum Guide"
    ],
    "correctIndex": 2,
    "explanation": "Fibonacci sizing mirrors how humans actually estimate. We're good at distinguishing small differences (is this 1 or 2?) but terrible at distinguishing large ones (is this 14, 15, or 16?). The growing gaps FORCE the team to make a clear call: 'Is this task closer to 8 or 13?' There's no fence-sitting on '11.' This produces faster, more honest estimation discussions. If a task feels bigger than 13, it needs to be broken down — that's a signal, not a limitation."
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
        estimatedMinutes: 45,
        order: 1,
        content: `## IT Governance Frameworks

IT governance is the system of rules, practices, and processes that ensure technology decisions align with business goals, manage risk appropriately, and comply with regulations. As a project manager, you do not need to be a governance expert, but you need to understand these frameworks well enough to navigate them confidently — especially during audits, compliance reviews, and change management processes.

Think of governance like the rules of the road for your project. Speed limits, traffic lights, and lane markings might feel restrictive when you are in a hurry, but they exist because the consequences of everyone driving however they want are catastrophic. Governance frameworks prevent the ICT equivalent of traffic accidents — uncontrolled changes that crash production, security breaches from poor access controls, and compliance violations that result in fines.

### ITIL 4 — IT Service Management

ITIL (Information Technology Infrastructure Library) is the most widely adopted framework for managing IT services. It originated in the UK government in the 1980s and has evolved into a global standard used by organisations of all sizes.

The core philosophy of ITIL is to think in terms of **services**, not systems or technology. A "service" is something that delivers value to users — email, customer support portal, payroll processing, online banking. ITIL provides structured practices for designing, deploying, operating, and improving these services.

**Key ITIL Practices That Every PM Must Understand:**

**Incident Management** is about restoring service as quickly as possible when something breaks. An incident is an unplanned interruption — the website goes down, the payment system stops processing, users cannot log in. The priority is to restore service, NOT to find the root cause (that is Problem Management). When production goes down, you will be called. Know the escalation path, the communication plan, and the expected response times.

**Change Management** (also called Change Enablement in ITIL 4) controls how changes are made to production systems. Every deployment, every configuration change, every database migration goes through change management. This is NOT bureaucracy for its own sake — it exists because uncontrolled changes are the single biggest cause of production outages. ITIL defines three types of changes:

| Change Type | Process | Example |
|-------------|---------|---------|
| Standard | Pre-approved, follows a documented procedure | Adding a new user account, deploying a routine patch |
| Normal | Assessed by Change Advisory Board (CAB), scheduled | New feature deployment, database migration |
| Emergency | Expedited approval, implemented immediately | Critical security patch, production crash fix |

An emergency change still requires approval (from an on-call manager, not the full CAB), a rollback plan, and post-implementation documentation. "Emergency" does not mean "skip all process."

**Problem Management** looks for the root cause of recurring incidents. If the same service fails every Monday morning, incident management restores it each time. Problem management investigates WHY it fails every Monday and fixes the underlying cause. A "problem" is the unknown cause of one or more incidents.

**Service Level Management** defines and monitors Service Level Agreements (SLAs). An SLA is a measurable commitment — "99.9% uptime," "critical incidents resolved within 4 hours," "support tickets responded to within 24 hours." Your project's success metrics may be defined as SLAs, and you need to know what they are, how they are measured, and what happens when they are breached.

### COBIT — Governance and Management of Enterprise IT

While ITIL focuses on HOW to manage services, COBIT (Control Objectives for Information Technologies) focuses on WHY — ensuring IT creates value for the organisation and manages risk appropriately. COBIT is more strategic and governance-focused.

**Five key COBIT principles:**

1. **Meeting stakeholder needs** — IT exists to serve the business, not the other way around
2. **Covering the enterprise end-to-end** — governance applies to all IT, not just project-specific systems
3. **Applying a single integrated framework** — avoid conflicting frameworks and policies
4. **Enabling a holistic approach** — consider people, processes, culture, and technology together
5. **Separating governance from management** — governance sets direction (board level); management executes (operational level)

### Data Protection — GDPR and Beyond

Every ICT project that handles personal data must consider data protection. In the EU and UK, GDPR (General Data Protection Regulation) is the primary regulation, with fines of up to 4% of global annual turnover or 20 million euros (whichever is higher) for serious violations. Australia has the Privacy Act with the Australian Privacy Principles (APPs).

**The Seven GDPR Principles — What Every PM Needs to Know:**

1. **Lawfulness, fairness, and transparency** — you must have a legal basis to process personal data (consent, legitimate interest, contractual necessity, legal obligation), and you must tell people what you are doing with their data
2. **Purpose limitation** — collect data only for specific, stated purposes. You cannot collect email addresses for "account management" and then use them for marketing without separate consent
3. **Data minimisation** — collect only the data you actually need. If your feature does not need a user's date of birth, do not collect it
4. **Accuracy** — keep personal data up to date. Provide mechanisms for users to correct their data
5. **Storage limitation** — do not keep personal data longer than necessary. Define retention periods and delete data when they expire
6. **Integrity and confidentiality (Security)** — protect personal data with appropriate technical measures: encryption, access controls, secure backups
7. **Accountability** — be able to demonstrate compliance. Document what data you process, why, how it is protected, and for how long

**PM Checklist for Data Protection:**

| Step | Action | Why |
|------|--------|-----|
| 1 | Identify all personal data the project processes | You cannot protect what you do not know about |
| 2 | Document the legal basis for processing each type | "Because we need it" is not a legal basis |
| 3 | Conduct a Data Protection Impact Assessment (DPIA) for high-risk processing | Required by law for large-scale profiling, sensitive data, or surveillance |
| 4 | Ensure encryption at rest and in transit | Protects data even if systems are compromised |
| 5 | Implement role-based access controls | Not everyone needs access to all personal data |
| 6 | Plan for data subject requests (access, deletion, portability) | Users have legal rights to their data — you must respond within 30 days |
| 7 | Define data retention periods for each data type | "Keep forever" violates GDPR's storage limitation principle |
| 8 | Include privacy requirements in all vendor contracts | If a vendor processes data on your behalf, YOU are still responsible |

### Change Management — Organisational, Not Just Technical

Technical change is relatively easy. People change is hard. When your project changes how people work — a new system that replaces a manual process, a new tool that requires retraining, a new workflow that disrupts established habits — you need organisational change management.

**Kotter's 8-Step Model for Leading Change:**

1. **Create urgency** — why must we change NOW? What is the cost of not changing?
2. **Form a guiding coalition** — get influential supporters who can champion the change
3. **Create a vision** — what does the future state look like? Make it vivid and compelling
4. **Communicate the vision** — repeatedly, through multiple channels, with clear examples
5. **Empower action** — remove obstacles that prevent people from adopting the change
6. **Generate short-term wins** — visible progress in the first 30-60 days builds momentum
7. **Consolidate gains** — do not declare victory too early. Use early wins to drive further change
8. **Anchor in culture** — the change must become "how we do things here," not a temporary initiative

The most common failure mode is stopping at step 4. Leaders communicate the vision, assume everyone is on board, and move on. But communication is not adoption. People need training, support, time to adjust, and visible evidence that the change is working before they truly adopt it.

### Audit Preparation — Being Ready Before the Auditor Arrives

Projects may be audited for compliance, security, financial accuracy, or quality. The time to prepare for an audit is NOT when the auditor arrives — it is continuously, throughout the project. If your documentation is current and your processes are followed, audit preparation requires zero extra work.

**What auditors look for — the documentation trail:**

- **Decision log** — who decided what, when, and why (with signatures or approvals)
- **Change records** — every change to production systems, who approved it, what testing was done
- **Test evidence** — test plans, test results, sign-offs, defect logs
- **Risk register** — identified risks, mitigation actions taken, current status
- **Access control records** — who has access to what systems and data, and why
- **Data processing records** — what personal data is processed, legal basis, retention periods
- **Vendor contracts** — SLAs, data processing agreements, security requirements

The golden rule of audit readiness: if it is not documented, it did not happen. A verbal approval in a meeting is invisible to an auditor. An email approval with a timestamp is evidence.`,
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
    "question": "Your team discovers a critical security vulnerability in production at 11pm on Friday. Under ITIL Change Management, what should happen?",
    "options": [
      "Deploy the fix immediately — security vulnerabilities don't need change management",
      "Wait until Monday for the Change Advisory Board (CAB) meeting",
      "Follow the Emergency Change process: assess risk, get expedited approval from the on-call manager, deploy with a rollback plan, and document afterward",
      "Submit a standard change request and wait for the normal 2-week cycle"
    ],
    "correctIndex": 2,
    "explanation": "This is an Emergency Change — it follows an expedited process, not the normal CAB cycle. But 'emergency' does NOT mean 'skip all process.' You still need: risk assessment (could the fix make things worse?), authorized approval (on-call manager, not full CAB), a rollback plan (what if the fix breaks something else?), and post-implementation documentation (what was changed, by whom, when). Skipping change management entirely is how urgent fixes turn production outages into extended catastrophes."
  },
  {
    "question": "Under GDPR, a user requests deletion of all their personal data. Your system stores their data in the user database, email logs, and payment records. What's the correct response?",
    "options": [
      "Delete everything immediately from all three systems within 24 hours",
      "Delete from the user database and email logs, but retain payment records if legally required for tax compliance — document the legal basis for retention",
      "Tell the user you cannot delete anything because it would be technically complex",
      "Mark their account as inactive but keep all data indefinitely"
    ],
    "correctIndex": 1,
    "explanation": "GDPR's Right to Erasure is NOT absolute. You must delete personal data UNLESS there is a legal obligation to retain it. Tax law in most jurisdictions requires financial records to be kept for 6-7 years. The correct approach: delete what you can (user profile, email logs), retain what you must (payment records), document the legal basis for retention (tax compliance), and inform the user clearly about what was deleted and what was retained and why. You must respond within 30 days."
  },
  {
    "question": "An auditor asks for evidence that your project followed proper change management. What documents should you provide?",
    "options": [
      "The project plan and Gantt chart",
      "Meeting minutes from daily standups",
      "Change request forms with approvals, deployment logs with timestamps, test results with sign-offs, and rollback plans for each change",
      "A recording of the final product demo"
    ],
    "correctIndex": 2,
    "explanation": "Auditors need a verifiable, traceable trail for EVERY change to production: what changed (change request), who approved it (approvals with names and dates), what testing was done (test results with evidence), how it was deployed (deployment logs with timestamps), and what the fallback was (rollback plan). The principle is traceability — from change request to production deployment, every step should be traceable to a specific person, date, and decision."
  }
]
-->`,
      },
    ],
  },
];
