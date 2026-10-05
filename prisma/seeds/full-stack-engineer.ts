/* ============================================================
   FULL STACK ENGINEER WORKSHOP — Seed Content
   ============================================================
   # End-to-end application architecture, API integration,
   # deployment, testing, and full-stack project patterns.
   # EXPANDED: Deep prose, analogies, step-by-step walkthroughs.
   ============================================================ */

export const fullStackEngineerModules = [
  /* ============================================================
     MODULE 1: Full Stack Architecture
     ============================================================ */
  {
    name: "Full Stack Architecture",
    slug: "full-stack-architecture",
    description: "Monolith vs microservices, API design for full-stack apps, Next.js App Router patterns, and serverless architecture.",
    order: 1,
    sections: [
      {
        title: "Monolith vs Microservices vs Serverless",
        slug: "monolith-vs-microservices",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## Monolith vs Microservices vs Serverless

Choosing the right architecture is one of the most impactful decisions you will make as a full-stack engineer. Get it right, and everything flows smoothly — development is fast, deployments are easy, and the system scales gracefully. Get it wrong, and you spend months wrestling with unnecessary complexity or hitting walls you cannot climb over.

The good news is that there is a clear pragmatic path that works for the vast majority of applications. The bad news is that the internet is full of advice from engineers at Google, Netflix, and Uber whose problems are nothing like yours. Let's cut through the noise.

### Monolith — One Codebase, One Deploy

A monolith is a single application that contains everything: frontend, backend, database access, business logic, and APIs. All the code lives in one repository, runs in one process, and deploys as one unit.

Think of a monolith like a small restaurant where the owner is also the chef, waiter, and dishwasher. Everything happens in one place, one person can see the whole picture, and communication is instant. There is no overhead of coordinating between separate teams or services.

**Structure of a typical monolith:**
\`\`\`
my-app/
├── src/
│   ├── app/            # Pages and routes (Next.js App Router)
│   ├── components/     # UI components
│   ├── lib/            # Shared libraries (auth, db, email)
│   ├── services/       # Business logic
│   └── utils/          # Helper functions
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── package.json
\`\`\`

**Why monoliths are excellent for most projects:**

The single biggest advantage is simplicity. When everything is in one codebase, you can trace a request from the browser all the way to the database and back without switching repositories, reading network logs, or debugging distributed systems. When something breaks, you add a breakpoint and step through the code.

Deployment is trivial: push to main, the CI pipeline builds and deploys one thing. There are no coordination problems, no "service A needs to deploy before service B," no version compatibility matrices between services.

Testing is straightforward because you can write integration tests that exercise the full stack — from the API route through the business logic to the database — all in one process. There is no need to mock service boundaries or set up service discovery for your test environment.

**When monoliths struggle:**

The main limitation is that you cannot scale parts of the application independently. If your image processing code needs 10x more compute than your user authentication code, you have to scale the entire application 10x. With separate services, you would scale only the image processing.

Additionally, as teams grow beyond 10-15 engineers, coordination within a single codebase becomes difficult. Merge conflicts increase, deploy queues get long, and one team's bug can block another team's release.

### Microservices — Many Small Services

Microservices split your application into independent services, each owning its own data, its own deployment pipeline, and often its own technology stack. Each service does one thing well and communicates with other services over the network (usually HTTP or message queues).

Think of microservices like a food court: there is a sushi counter, a burger stand, a coffee shop, and a dessert bar. Each operates independently with its own staff, equipment, and menu. They can scale independently (the coffee shop adds a second barista during the morning rush without affecting the sushi counter), and they can use different tools (the sushi counter uses rice cookers, the coffee shop uses espresso machines).

**The hidden costs that tutorials do not mention:**

Microservices introduce an enormous amount of operational complexity. Every service needs its own CI/CD pipeline, its own monitoring, its own logging, its own database, and its own error handling. When Service A calls Service B which calls Service C, and something fails, you need distributed tracing to figure out where the problem is. You need service discovery so services can find each other. You need health checks, circuit breakers, retries, and timeouts at every service boundary.

Distributed transactions are genuinely hard. If "create order" involves deducting inventory (Service A), charging the credit card (Service B), and sending a confirmation email (Service C), what happens when the credit card charge succeeds but the email service is down? You need saga patterns, compensating transactions, and eventual consistency — concepts that are much harder than a single database transaction.

**When microservices are the right choice:**

- Your organisation has 50+ engineers who need to deploy independently
- Specific components have wildly different scaling requirements
- You need different technology stacks for different parts (ML in Python, API in Node.js)
- You are building a platform where third parties will integrate with specific services

### Serverless — Functions as a Service

Serverless means you write individual functions that a cloud provider runs on demand. You do not manage servers, you do not worry about scaling, and you pay only for the compute time you actually use.

In the context of full-stack development, Vercel Functions (which power Next.js API routes) are serverless. Each API route is a separate function that spins up when a request arrives and shuts down after responding.

**The serverless sweet spot:**

Serverless is ideal for workloads with variable or unpredictable traffic. If your app gets 10 requests per hour at 3am and 10,000 requests per minute during a product launch, serverless handles both automatically. You pay almost nothing during quiet periods and scale automatically during spikes.

It is also excellent for event-driven workloads: webhooks from Stripe, scheduled cron jobs, image processing triggers, and queue consumers. These are all naturally "function-shaped" — a trigger arrives, the function runs, it finishes.

**The serverless trade-offs:**

Cold starts are real but increasingly less impactful. The first request to a function that has not been used recently takes longer (a few hundred milliseconds) because the runtime needs to initialise. Vercel's Fluid Compute and connection reuse have largely mitigated this for Next.js applications.

Long-running processes (video transcoding, large data imports) are not a natural fit for serverless functions, which have execution time limits. Use dedicated compute or queue-based workers for these.

### Decision Framework

| Factor | Monolith | Microservices | Serverless |
|--------|----------|---------------|------------|
| Team size | 1-15 engineers | 50+ engineers | 1-20 engineers |
| Time to market | Fastest | Slowest | Fast |
| Deployment | Simple (one deploy) | Complex (many deploys) | Simplest (auto) |
| Scaling | Vertical (bigger server) | Horizontal per service | Automatic |
| Cost at low traffic | Fixed server cost | High (many services running) | Near zero |
| Debugging | Easy (single process) | Hard (distributed tracing) | Medium |
| Operational overhead | Low | Very high | Low |

### The Pragmatic Path — What Successful Companies Actually Do

1. **Start with a monolith** — Ship fast, validate the product, find product-market fit
2. **Use serverless for the edges** — Cron jobs, webhooks, event processing (Next.js does this automatically)
3. **Extract services only when forced** — When a specific component genuinely needs independent scaling or a different technology
4. **Never start with microservices** — You do not have Netflix's problems, and you do not have Netflix's 2,000-person platform engineering team

The vast majority of successful SaaS products serve millions of users on a well-architected monolith. Basecamp, Shopify (started monolith), GitHub (started monolith), and Stack Overflow all prove that monoliths work at enormous scale.`,
      },
      {
        title: "Next.js App Router Patterns",
        slug: "nextjs-app-router",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 2,
        content: `## Next.js App Router Patterns

Next.js App Router is the modern way to build full-stack React applications. It fundamentally changes how you think about data fetching, rendering, and the boundary between client and server. Understanding these patterns deeply is essential for any full-stack engineer working in the React ecosystem.

The key insight of the App Router is that most of your application does not need to run in the browser. Pages that display data, fetch from databases, and render HTML can all happen on the server — sending zero JavaScript to the client. Only the interactive parts (buttons, forms, modals, animations) need client-side JavaScript.

### Server Components vs Client Components

This is the most important concept in modern Next.js. Every component is a Server Component by default. Server Components run on the server, have direct access to your database, file system, and environment variables, and send only HTML to the browser. They ship zero JavaScript to the client.

Think of Server Components like a printing press. The press (server) does all the work — arranging text, adding images, formatting the layout — and sends the finished page (HTML) to the reader (browser). The reader does not need a printing press; they just need eyes to read the finished product.

Client Components are marked with \`"use client"\` at the top of the file. They run in the browser and can use React hooks (useState, useEffect), event handlers (onClick, onChange), and browser APIs (localStorage, window). They ship JavaScript to the browser because the browser needs to run the code.

\`\`\`tsx
// # Server Component (default — no directive needed)
// # This runs on the SERVER. It can directly access the database.
// # Zero JavaScript sent to the browser.
async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // # App Router: params is a Promise
  // # Direct database access — no API route needed
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound(); // # Returns a 404 page
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* # Client Component nested inside Server Component */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}

// # Client Component — only needed for interactivity
"use client";
import { useState } from "react";

function AddToCartButton({ productId }: { productId: string }) {
  // # useState and onClick only work in Client Components
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
\`\`\`

The critical mental model: Server Components are for DISPLAY. Client Components are for INTERACTION. Push "use client" as deep into your component tree as possible — only the leaf components that need interactivity should be Client Components. Everything above them can stay as Server Components, sending zero JavaScript.

### Data Fetching Patterns

**Pattern 1: Direct database access in Server Components (preferred)**

This is the simplest and most performant pattern. No API route, no fetch call, no loading state, no useEffect. The data is available when the component renders.

\`\`\`tsx
// # Server Component — data is fetched on the SERVER before rendering
async function UserProfile({ userId }: { userId: string }) {
  // # Direct Prisma call — this would FAIL in a Client Component
  // # because the browser cannot access your database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { posts: { take: 5, orderBy: { createdAt: "desc" } } },
  });
  if (!user) notFound();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <h2>Recent Posts</h2>
      {user.posts.map((post) => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  );
}
\`\`\`

**Pattern 2: Parallel data fetching with Promise.all**

When a page needs data from multiple sources, fetch them in parallel — not sequentially. Sequential fetching is one of the most common performance mistakes in full-stack apps.

\`\`\`tsx
async function Dashboard() {
  // # BAD — sequential (each waits for the previous to finish)
  // # Total time: 200ms + 300ms + 150ms = 650ms
  // const user = await getUser();       // 200ms
  // const orders = await getOrders();   // 300ms
  // const stats = await getStats();     // 150ms

  // # GOOD — parallel (all three run at the same time)
  // # Total time: max(200ms, 300ms, 150ms) = 300ms
  const [user, orders, stats] = await Promise.all([
    getUser(),    // # Starts immediately
    getOrders(),  // # Starts immediately (doesn't wait for getUser)
    getStats(),   // # Starts immediately (doesn't wait for either)
  ]);

  return <DashboardView user={user} orders={orders} stats={stats} />;
}
\`\`\`

**Pattern 3: Streaming with Suspense — show content progressively**

When some data is fast and some is slow, use Suspense to show the fast content immediately while the slow content loads. The user sees something useful right away instead of waiting for everything.

\`\`\`tsx
import { Suspense } from "react";

async function Page() {
  return (
    <div>
      {/* # This renders immediately (fast data) */}
      <UserHeader />
      <QuickStats />

      {/* # This shows a skeleton while loading, then streams in */}
      {/* # when the data is ready — NO client-side JavaScript needed */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <SlowAnalytics /> {/* # Takes 3 seconds to fetch */}
      </Suspense>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <PersonalisedRecommendations /> {/* # Takes 2 seconds */}
      </Suspense>
    </div>
  );
}
\`\`\`

### Server Actions — Mutations Without API Routes

Server Actions let you write functions that run on the server and can be called directly from client-side forms. No API route, no fetch boilerplate, no manual request/response handling. The framework handles everything.

\`\`\`tsx
// # This function runs on the SERVER, even though it's called from a form
async function createPost(formData: FormData) {
  "use server"; // # This directive makes it a Server Action
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // # Validate input (always validate server-side!)
  if (!title || title.length > 200) throw new Error("Invalid title");

  await prisma.post.create({
    data: { title, content, authorId: session.user.id },
  });

  // # Tell Next.js to refetch data for /posts
  revalidatePath("/posts");
}

// # The form calls the Server Action directly
// # This works even WITHOUT JavaScript enabled in the browser!
function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" required placeholder="Post title" />
      <textarea name="content" placeholder="Write your post..." />
      <button type="submit">Publish</button>
    </form>
  );
}
\`\`\`

### Route Groups and Layouts

Route groups let you organise routes and apply different layouts without affecting the URL structure. The parentheses in the folder name mean "this folder exists for organisation only — do not add it to the URL."

\`\`\`
app/
├── (marketing)/              # Route group — no URL segment
│   ├── layout.tsx            # Marketing layout (no sidebar, full-width)
│   ├── page.tsx              # / (homepage)
│   ├── pricing/page.tsx      # /pricing
│   └── about/page.tsx        # /about
├── (dashboard)/              # Route group — different layout
│   ├── layout.tsx            # Dashboard layout (with sidebar, auth required)
│   ├── dashboard/page.tsx    # /dashboard
│   ├── settings/page.tsx     # /settings
│   └── billing/page.tsx      # /billing
├── api/
│   └── users/route.ts        # API route: /api/users
└── layout.tsx                # Root layout (shared by everything)
\`\`\`

### When to Use Each Pattern

| Need | Best Pattern | Why |
|------|-------------|-----|
| Display data from DB | Server Component + direct query | No API needed, zero JS, fastest |
| Form submission | Server Action | No API route, works without JS |
| Interactive UI (modals, filters) | Client Component | Needs useState/useEffect |
| Slow data on a fast page | Suspense + streaming | Shows content progressively |
| Multiple data sources | Promise.all in Server Component | Parallel is 2-3x faster than sequential |
| External API consumers | Route Handler (route.ts) | Standard REST endpoint |
| Webhooks (Stripe, GitHub) | Route Handler | Needs standard HTTP endpoint |`,
      },
      {
        title: "Architecture Quiz",
        slug: "architecture-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## Full Stack Architecture Quiz

<!--quiz
[
  {
    "question": "You're a solo founder building an MVP to validate a business idea. Which architecture should you start with?",
    "options": [
      "Microservices — design for scale from day one so you never have to refactor",
      "Monolith — ship fast, validate the product, extract services later only when needed",
      "Serverless microservices — get the best of both worlds",
      "Event-driven architecture — loosely coupled from the start"
    ],
    "correctIndex": 1,
    "explanation": "Start with a monolith. One codebase, one deployment, simple debugging. Your biggest risk is building something nobody wants — not running out of scale. Monoliths can serve millions of users (Basecamp, Stack Overflow, early Shopify). If and when you hit genuine scaling bottlenecks, extract the specific component that needs independent scaling into a service. Most companies never need to."
  },
  {
    "question": "In Next.js App Router, when should you add 'use client' to a component?",
    "options": [
      "Always — client components are more flexible",
      "Only when you need interactivity: hooks (useState, useEffect), event handlers (onClick), or browser APIs (localStorage)",
      "When the component fetches data from the database",
      "When the component receives props from a parent"
    ],
    "correctIndex": 1,
    "explanation": "Server Components are the default and preferred — they send zero JavaScript to the browser, can access the database directly, and render faster. Only add 'use client' when you NEED client-side features: React hooks, event handlers, or browser APIs. Push 'use client' as deep into your component tree as possible — only the leaf components that need interactivity should be Client Components."
  },
  {
    "question": "Your dashboard page fetches user data (200ms), orders (300ms), and analytics (150ms) sequentially. Total: 650ms. How do you halve the load time?",
    "options": [
      "Cache all the data in Redis",
      "Use Promise.all to fetch all three in parallel — total becomes max(200, 300, 150) = 300ms",
      "Move all data fetching to the client with useEffect",
      "Use a GraphQL API instead of REST"
    ],
    "correctIndex": 1,
    "explanation": "Promise.all runs all three fetches simultaneously. Instead of waiting for each one to finish before starting the next (650ms total), all three start at the same time. The total time is the LONGEST individual fetch (300ms), not the sum. This is one of the most impactful performance optimisations you can make — and it's a one-line change."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 2: Database Integration
     ============================================================ */
  {
    name: "Database Integration",
    slug: "database-integration",
    description: "ORMs (Prisma, Drizzle), migrations, connection pooling, edge database patterns, and data modelling.",
    order: 2,
    sections: [
      {
        title: "Modern ORM Patterns with Prisma",
        slug: "modern-orm-patterns",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## Modern ORM Patterns with Prisma

An ORM (Object-Relational Mapping) is a tool that lets you interact with your database using your programming language instead of writing raw SQL. Instead of writing \`SELECT * FROM users WHERE email = 'jane@example.com'\`, you write \`prisma.user.findUnique({ where: { email: 'jane@example.com' } })\`.

Think of an ORM like a translator who sits between you and a foreign official. You speak English (TypeScript), the official speaks SQL. The translator (Prisma) converts your request into the official's language, gets the response, and translates it back into something you understand — including type information, so you know exactly what shape the data has.

### Why Prisma Specifically?

Prisma is the most popular ORM in the TypeScript ecosystem, and for good reason. Its killer feature is type safety — the types generated from your schema mean you get autocompletion in your editor, compile-time error checking, and never have to guess what fields are available on a query result.

| Without an ORM (raw SQL) | With Prisma |
|--------------------------|-------------|
| No type safety — typos cause runtime errors | Full TypeScript types generated from your schema |
| SQL injection risk with string concatenation | Parameterised queries by default |
| Manual migration tracking | Built-in migration system with history |
| Write SQL for every query | Auto-generated, type-safe query builder |
| Manually map rows to objects | Automatic object mapping with relations |

### The Prisma Schema — Your Single Source of Truth

The Prisma schema defines your database tables, columns, relationships, and constraints in one file. From this schema, Prisma generates TypeScript types, a query client, and database migrations.

\`\`\`prisma
// # prisma/schema.prisma — defines your entire database structure
// # Every model becomes a database table and a TypeScript type

model User {
  id        String   @id @default(cuid())   // # Primary key, auto-generated
  email     String   @unique                // # Unique constraint
  name      String?                         // # Nullable — the ? means optional
  role      Role     @default(USER)         // # Enum with default value
  posts     Post[]                          // # One-to-many relation: one user has many posts
  createdAt DateTime @default(now())        // # Auto-set on creation
  updatedAt DateTime @updatedAt             // # Auto-updated on every change
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String                          // # Foreign key to User
  tags      Tag[]                           // # Many-to-many relation
  createdAt DateTime @default(now())
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]                              // # Many-to-many (implicit join table)
}

enum Role {
  USER
  ADMIN
}
\`\`\`

### Essential Query Patterns

**Creating records with relations:**

\`\`\`typescript
// # Create a user AND their first post in one query
// # Prisma wraps this in a transaction automatically
const user = await prisma.user.create({
  data: {
    email: "jane@example.com",
    name: "Jane",
    posts: {
      create: [
        { title: "My First Post", content: "Hello, world!" },
        { title: "Second Post", content: "Learning Prisma" },
      ],
    },
  },
  // # include tells Prisma to return the related posts with the user
  include: { posts: true },
});
// # user.posts is typed as Post[] — autocompletion works!
\`\`\`

**Querying with filters, pagination, and field selection:**

\`\`\`typescript
// # Find all admin users who have at least one published post
const admins = await prisma.user.findMany({
  where: {
    role: "ADMIN",
    // # Filter by relation — users who have published posts
    posts: { some: { published: true } },
  },
  orderBy: { createdAt: "desc" },      // # Newest first
  take: 20,                             // # Limit to 20 results
  skip: 0,                              // # Offset for pagination
  // # select returns only these fields — less data transferred
  select: {
    id: true,
    name: true,
    email: true,
    _count: { select: { posts: true } }, // # Count of posts per user
  },
});
\`\`\`

**Transactions — all or nothing:**

Transactions ensure that either ALL operations succeed or NONE do. This is critical for operations that must be atomic — like deducting credits and creating an order. If the order fails, you do not want the credits deducted.

\`\`\`typescript
// # Transaction: deduct credits AND create order atomically
// # If either operation fails, BOTH are rolled back
const [updatedUser, order] = await prisma.$transaction([
  prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: 10 } }, // # Atomic decrement
  }),
  prisma.order.create({
    data: { userId, productId, total: 10 },
  }),
]);
\`\`\`

**Upsert — create if not exists, update if exists:**

\`\`\`typescript
// # Perfect for "save settings" or "sync external data"
// # One query instead of find-then-create-or-update
const user = await prisma.user.upsert({
  where: { email: "jane@example.com" },
  create: { email: "jane@example.com", name: "Jane" },
  update: { name: "Jane Updated" },
});
\`\`\`

### Connection Pooling — Why It Matters

Database connections are expensive to create. Each connection takes memory on both the application server and the database server, and establishing the TCP handshake and TLS negotiation takes time. A connection pool maintains a small number of open connections (typically 10-20) and shares them across all requests.

Without connection pooling in a serverless environment, every function invocation creates a new database connection. If you get 1,000 concurrent requests, that is 1,000 connections — most databases max out at a few hundred and crash.

\`\`\`
// # Without pooling (serverless): each request opens a new connection
Request 1 → New Connection → Database    (connection 1)
Request 2 → New Connection → Database    (connection 2)
...
Request 500 → New Connection → Database  (connection 500 — database crashes!)

// # With pooling: requests share a small pool of connections
Request 1 → Pool → Connection A → Database
Request 2 → Pool → Connection B → Database
Request 3 → Pool → Connection A → Database  (reused! A was freed)
...
Request 500 → Pool → Connection C → Database (only 10-20 connections total)
\`\`\`

In Prisma, you configure this in your datasource:

\`\`\`prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")         // # Pooled connection URL
  directUrl = env("DIRECT_DATABASE_URL")  // # Direct connection for migrations
}
\`\`\``,
      },
      {
        title: "Database Migrations — Safe Schema Evolution",
        slug: "migrations-schema-evolution",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 35,
        order: 2,
        content: `## Database Migrations — Safe Schema Evolution

Your database schema will change constantly as your application evolves. New features need new tables, growing data needs new indexes, and changing requirements need altered columns. Migrations let you make these changes safely, repeatably, and (usually) reversibly.

Think of migrations like a flight recorder for your database schema. Every change is recorded as a timestamped file. If you need to set up a fresh database (for a new developer, a staging environment, or disaster recovery), you replay all the migrations in order and get an exact replica of your production schema. If something goes wrong, you can trace exactly which migration caused the issue.

### What Happens During a Migration

When you change your Prisma schema and run \`npx prisma migrate dev\`, Prisma:

1. Compares your schema file to the current database state
2. Generates a SQL migration file describing the differences
3. Applies the migration to your development database
4. Records that the migration has been applied (so it never runs twice)
5. Regenerates the Prisma Client types to match the new schema

The migration file is committed to git alongside your code. When another developer pulls your changes, they run \`npx prisma migrate dev\` and their database is updated to match.

### Safe Migration Patterns

**Adding a nullable column (always safe):**

\`\`\`sql
-- # This is always safe. Existing rows get NULL for the new column.
-- # No data is lost, no constraints are violated.
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
\`\`\`

**Adding a NOT NULL column to a table with existing data (requires care):**

\`\`\`sql
-- # DANGEROUS — this FAILS if the table has existing rows!
-- # Existing rows have no value for 'avatar', violating NOT NULL.
ALTER TABLE "User" ADD COLUMN "avatar" TEXT NOT NULL;

-- # SAFE — provide a default value for existing rows
ALTER TABLE "User" ADD COLUMN "avatar" TEXT NOT NULL DEFAULT 'default-avatar.png';
\`\`\`

This is one of the most common migration mistakes. If your table has even one row, adding a NOT NULL column without a default will fail. Always check: "Does this table have existing data?" If yes, provide a default.

**Renaming a column (multi-step process):**

You cannot simply rename a column in production because your running code still references the old name. You need to do it in steps:

\`\`\`
Step 1: Add new column ('fullName')
Step 2: Copy data from old column to new column
Step 3: Deploy code that reads from NEW column
Step 4: Drop old column ('name') — only after new code is live
\`\`\`

This is called the "expand and contract" pattern. You expand (add the new column), migrate code, then contract (remove the old column). Doing it in one step would cause downtime — your code would reference a column that no longer exists.

### Migration Workflow Commands

\`\`\`bash
# # Development: generates and applies a migration
# # Also regenerates the Prisma Client types
npx prisma migrate dev --name add_user_avatar

# # Production: applies ALL pending migrations
# # Does NOT generate new migrations (only applies existing ones)
npx prisma migrate deploy

# # Check which migrations have been applied
npx prisma migrate status

# # Reset database — DESTROYS ALL DATA (development only!)
npx prisma migrate reset

# # For prototyping: push schema directly without migration files
# # Good for early development, not for production
npx prisma db push
\`\`\`

### Golden Rules for Migrations

| Rule | Why |
|------|-----|
| Never edit a migration after it has been applied to production | Other developers may have already run it. Create a new migration instead. |
| Always review the generated SQL before applying | ORMs can generate unexpected DDL — dropping columns, recreating tables. |
| Test migrations on a staging database first | A migration that works on your empty dev DB might fail on production's 1M rows. |
| Make migrations backward-compatible | During deployment, old code and new code run simultaneously. The old code must still work. |
| Keep migrations small and focused | One concern per migration. "Add avatar column" not "restructure user schema." |
| Have a rollback plan | For every migration, know how to undo it. Some changes (dropping a column) are irreversible. |`,
      },
      {
        title: "Database Integration Quiz",
        slug: "database-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## Database Integration Quiz

<!--quiz
[
  {
    "question": "You need to add a required 'phoneNumber' column to a Users table with 50,000 existing rows. What's the safest approach?",
    "options": [
      "ALTER TABLE Users ADD COLUMN phoneNumber TEXT NOT NULL — simple and direct",
      "ALTER TABLE Users ADD COLUMN phoneNumber TEXT NOT NULL DEFAULT '' — existing rows get the default",
      "Delete all users first, then add the column",
      "Create a completely new table with the column"
    ],
    "correctIndex": 1,
    "explanation": "Adding a NOT NULL column without a default fails when existing rows exist — they would have no value, violating the constraint. Adding with DEFAULT '' is safe: all 50,000 existing rows get an empty string, and new rows can provide a real phone number. You can later update the existing rows with real data and optionally change the default."
  },
  {
    "question": "Your serverless app makes 1,000 concurrent API requests, each querying the database. Without connection pooling, what happens?",
    "options": [
      "The database handles it fine — modern databases support unlimited connections",
      "1,000 new database connections are created — most databases crash at a few hundred",
      "Requests queue up and wait",
      "The ORM handles it automatically"
    ],
    "correctIndex": 1,
    "explanation": "Without connection pooling, each serverless function invocation creates its own database connection. 1,000 concurrent requests means 1,000 connections — but most databases (PostgreSQL defaults to 100, MySQL to 151) crash well before that. A connection pool shares 10-20 connections across all requests, solving the problem. This is the #1 infrastructure issue in serverless applications."
  },
  {
    "question": "When should you use prisma.$transaction()?",
    "options": [
      "For every database query — transactions are always safer",
      "When multiple operations must all succeed or all fail together (e.g., deduct credits AND create order)",
      "Only for read operations to ensure consistency",
      "When you want to speed up queries"
    ],
    "correctIndex": 1,
    "explanation": "Transactions ensure atomicity: either ALL operations succeed, or NONE do. Use them for logically linked operations — deducting credits AND creating an order, transferring money between accounts, creating a user AND their default settings. If the order creation fails, the credits should NOT be deducted. Don't use transactions for single queries (unnecessary overhead) or purely read queries (they don't modify data)."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 3: Authentication Patterns
     ============================================================ */
  {
    name: "Full Stack Auth Patterns",
    slug: "full-stack-auth",
    description: "NextAuth/Auth.js, middleware-based auth, role-based access, protected routes, and session management.",
    order: 3,
    sections: [
      {
        title: "Auth.js in Next.js — Complete Guide",
        slug: "authjs-nextjs-guide",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## Auth.js (NextAuth) in Next.js

Authentication is the process of verifying who a user is. It is the gateway to your entire application — every protected feature, every piece of personal data, every action that matters depends on it being correct. Getting auth right is non-negotiable.

Auth.js (formerly NextAuth.js) is the most popular authentication library for Next.js. It handles the entire authentication lifecycle: OAuth sign-in (Google, GitHub, LinkedIn), credentials-based login, session management, JWT tokens, and database persistence. You configure it once, and it handles the complexity.

### Setting Up Auth.js

The setup involves three pieces: the auth configuration, the API route handler, and the Prisma adapter for database persistence.

\`\`\`typescript
// # src/lib/auth.ts — The central auth configuration
// # This is the SINGLE source of truth for all authentication
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // # PrismaAdapter stores sessions and accounts in your database
  adapter: PrismaAdapter(prisma),

  providers: [
    // # OAuth providers — "Sign in with Google/GitHub"
    // # Users never share their password with your app
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),

    // # Credentials provider — email/password login
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // # Look up the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;

        // # Compare the provided password with the stored hash
        // # NEVER store plain-text passwords — always bcrypt
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        // # Return the user object — Auth.js creates the session
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],

  callbacks: {
    // # Add custom data to the session object
    // # This runs every time a session is accessed
    session({ session, user }) {
      session.user.id = user.id;     // # Add user ID to session
      session.user.role = user.role; // # Add role for RBAC
      return session;
    },
  },
});
\`\`\`

### Protecting Pages — Three Layers of Defence

**Layer 1: Server Component Protection (per-page)**

The simplest approach — check the session at the top of each protected page.

\`\`\`tsx
// # Server Component — runs on the server, no client JS
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // # Check if the user is logged in
  const session = await auth();
  if (!session?.user) redirect("/login"); // # Redirect to login

  // # User is authenticated — render the page
  return (
    <div>
      <h1>Welcome back, {session.user.name}</h1>
      <p>Your role: {session.user.role}</p>
    </div>
  );
}
\`\`\`

**Layer 2: Middleware Protection (global, runs before any route)**

Middleware runs BEFORE the page even starts rendering. It is the best place to protect entire sections of your app because you cannot forget to add the check to individual pages.

\`\`\`typescript
// # middleware.ts — runs before EVERY matched route
import { auth } from "@/lib/auth";

export default auth((req) => {
  // # If not authenticated and trying to access /dashboard/*
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    // # Redirect to login page
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

// # Only run middleware on these paths (performance optimisation)
export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
\`\`\`

**Layer 3: API Route Protection**

Every API route that handles sensitive data must check authentication independently. Never trust that the middleware caught it — defence in depth.

\`\`\`typescript
// # src/app/api/protected/route.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // # User is authenticated — return their data
  return NextResponse.json({ user: session.user });
}
\`\`\`

### Role-Based Access Control (RBAC)

RBAC assigns permissions based on roles. Instead of checking individual permissions for each user, you check their role, and the role determines what they can do.

\`\`\`tsx
// # Reusable function that checks role AND returns the session
async function requireRole(allowedRoles: string[]) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized"); // # Show "access denied" page
  }
  return session; // # Return session for use in the page
}

// # Admin-only page
export default async function AdminPage() {
  const session = await requireRole(["admin"]);
  return <h1>Admin Panel — {session.user.name}</h1>;
}

// # Editor or admin page
export default async function ContentPage() {
  const session = await requireRole(["admin", "editor"]);
  return <h1>Content Management</h1>;
}
\`\`\`

### OAuth Flow — What Happens When Users Click "Sign in with Google"

Understanding the OAuth flow helps you debug the most common authentication issues.

\`\`\`
1. User clicks "Sign in with Google"
2. Your app redirects to Google's login page
   → google.com/o/oauth2/auth?client_id=YOUR_ID&redirect_uri=YOUR_CALLBACK
3. User enters their Google credentials and clicks "Allow"
4. Google redirects back to YOUR app with a temporary code
   → yourapp.com/api/auth/callback/google?code=abc123
5. Your SERVER exchanges the code for tokens (server-to-server)
   → This keeps the client_secret safe — it never touches the browser
6. Your app uses the tokens to get the user's profile from Google
7. Auth.js creates or finds the user in your database
8. Auth.js creates a session and sets a cookie
9. User is now logged in!
\`\`\`

The most common OAuth debugging issue is **redirect URI mismatch** — the redirect URI in your code must EXACTLY match what is registered in the OAuth provider's console. Mismatches in protocol (http vs https), trailing slashes, or port numbers all cause failures.`,
      },
      {
        title: "Auth Patterns Quiz",
        slug: "auth-patterns-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Authentication Patterns Quiz

<!--quiz
[
  {
    "question": "In OAuth 2.0, why does the token exchange happen server-to-server instead of in the browser?",
    "options": [
      "It's faster when done on the server",
      "Browsers cannot make HTTP POST requests",
      "To keep the client_secret secure — if it were in browser code, anyone could extract it and impersonate your application",
      "Google requires all requests to come from servers"
    ],
    "correctIndex": 2,
    "explanation": "The client_secret MUST stay on your server. Browser code is visible to everyone (right-click → View Source). If your client_secret were in the browser, anyone could copy it and pretend to be your application — requesting tokens, stealing user data, and acting on behalf of your users. The authorization code is safe to pass through the browser because it's useless without the secret and expires in seconds."
  },
  {
    "question": "A user reports 'redirect_uri_mismatch' when trying to sign in with Google. What's wrong?",
    "options": [
      "Google's authentication servers are experiencing an outage",
      "The redirect URI in your code doesn't exactly match what's registered in Google Cloud Console",
      "The user's Google account has been suspended",
      "Your Auth.js version is outdated"
    ],
    "correctIndex": 1,
    "explanation": "redirect_uri_mismatch means the redirect URI your app sends doesn't EXACTLY match what's registered in Google Console. Common causes: trailing slash mismatch (/callback vs /callback/), http:// vs https://, wrong port (localhost:3000 vs localhost:3001), or different domain (localhost vs 127.0.0.1). The fix: make the URIs identical in both places, character for character."
  },
  {
    "question": "Where should you check authentication to protect ALL routes under /dashboard?",
    "options": [
      "In every individual page component under /dashboard",
      "In middleware.ts with a matcher for /dashboard/:path* — it runs before any route renders",
      "In the root layout.tsx only",
      "In a client-side useEffect hook"
    ],
    "correctIndex": 1,
    "explanation": "Middleware runs BEFORE any page starts rendering. With a matcher for '/dashboard/:path*', every route under /dashboard is protected in one place. Unauthenticated users are redirected before the page even loads — no flash of protected content. Individual page checks are repetitive and error-prone (you'll forget one eventually). Layout checks don't redirect before rendering."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 4: Deployment & DevOps
     ============================================================ */
  {
    name: "Deployment & DevOps",
    slug: "deployment-devops",
    description: "Vercel deployment, environment variables, CI/CD, Docker basics, preview deployments, and monitoring.",
    order: 4,
    sections: [
      {
        title: "Modern Deployment Pipeline",
        slug: "modern-deployment",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## Modern Deployment Pipeline

The days of manually uploading files to a server via FTP are long gone. Modern deployment is automated, repeatable, safe, and (ideally) boring. Every push to your repository triggers a pipeline that tests, builds, and deploys your code without human intervention.

The goal is to make deployment so routine and low-risk that you can do it multiple times a day without anxiety. When deployment is scary, teams deploy less often, which means bigger changes, which means more risk, which makes deployment even scarier. Break the cycle by making deployment frequent, automated, and reversible.

### CI/CD — The Two Halves of the Pipeline

**CI (Continuous Integration)** runs on every push and pull request. It catches problems before code reaches production.

\`\`\`
Every git push triggers this sequence:
1. Install dependencies (npm ci — deterministic install)
2. Run linter (ESLint — catches code quality issues)
3. Run type checker (TypeScript — catches type errors)
4. Run tests (unit + integration — catches logic bugs)
5. Build the application (catches build-time errors)

If ANY step fails → the PR is blocked. Cannot merge.
\`\`\`

**CD (Continuous Deployment)** runs when code is merged to the main branch. It deploys the tested, built code to production.

\`\`\`
When code is merged to main:
1. CI pipeline runs (all the above checks)
2. Application is built for production
3. Deployed to staging environment
4. Smoke tests verify critical paths work
5. Promoted to production
6. Health check confirms production is healthy
\`\`\`

### Vercel Deployment — The Full-Stack Sweet Spot

Vercel is built specifically for Next.js and provides the simplest deployment experience for full-stack applications. Push to git, and Vercel handles everything else.

**Vercel's automatic pipeline:**
- Push to any branch → Preview deployment (unique URL like my-app-abc123.vercel.app)
- Push to main → Production deployment (my-app.vercel.app)
- Each pull request gets its own preview URL for testing and review

This means every PR can be tested in a production-like environment before merging. Reviewers can click the preview link and test the actual changes — not just read the code.

### Environment Variables — The Three Environments

Your application needs different configuration for different environments. The database URL, API keys, and feature flags all change between development, staging/preview, and production.

| Environment | Purpose | Example DATABASE_URL |
|------------|---------|---------------------|
| Development | Your local machine | file:./dev.db (local SQLite) |
| Preview | PR preview deployments | staging-db.example.com |
| Production | Live site | production-db.example.com |

**Critical rules for environment variables:**

1. **Never commit .env files to git** — They contain secrets. Add .env* to .gitignore.
2. **Use different values per environment** — Preview should never touch production data.
3. **Validate env vars at startup** — Fail immediately if a required variable is missing.
4. **Keep a .env.example** — Document which variables are needed (with placeholder values, not real secrets).

\`\`\`typescript
// # Validate required environment variables at build time
// # The app CRASHES immediately if any are missing
// # This is MUCH better than discovering a missing var at runtime
const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      \`Missing required environment variable: \${envVar}. \` +
      \`Check your .env.local file or Vercel dashboard.\`
    );
  }
}
\`\`\`

### Docker — When You Need It

Docker packages your application and all its dependencies into a container that runs identically everywhere — your laptop, staging, production, your colleague's machine.

You typically do NOT need Docker for Vercel deployments (Vercel handles the build environment). Docker is useful when you need to deploy to your own servers, AWS ECS, Google Cloud Run, or any container-based platform.

\`\`\`dockerfile
# # Multi-stage build — keeps the final image small
# # Stage 1: Install production dependencies only
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# # Stage 2: Build the application (needs ALL dependencies)
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# # Stage 3: Production image — only runtime files, no build tools
FROM node:20-alpine AS runner
WORKDIR /app
# # Copy only what we need from previous stages
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

The multi-stage build is important: the build stage includes TypeScript, dev dependencies, and build tools (often 1-2 GB). The final stage includes only the built output and production dependencies (often 100-200 MB). Smaller images deploy faster and have a smaller attack surface.

### Deployment Checklist

| Step | What to Verify |
|------|---------------|
| 1 | All tests pass (unit + integration) |
| 2 | TypeScript compiles with zero errors |
| 3 | Environment variables set for target environment |
| 4 | Database migrations applied to target database |
| 5 | Preview deployment tested by a human |
| 6 | Performance budget met (bundle size, LCP under 2.5s) |
| 7 | Security headers configured (CSP, HSTS, X-Frame-Options) |
| 8 | Error monitoring connected (Sentry or similar) |
| 9 | Rollback plan documented ("revert to previous deployment") |`,
      },
      {
        title: "Monitoring & Error Tracking",
        slug: "monitoring-error-tracking",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 35,
        order: 2,
        content: `## Monitoring & Error Tracking

Deploying your application is only half the battle. You need to know when things break — ideally before your users tell you. A well-monitored application tells you exactly what went wrong, when, why, and for how many users.

Think of monitoring like the dashboard in a car. Without it, you have no idea how fast you are going, how much fuel you have left, or whether the engine is overheating. You would drive until something breaks catastrophically. With a dashboard, you see problems developing and can respond before they become emergencies.

### The Three Pillars of Observability

**1. Logs — What happened (narrative events)**

Logs are timestamped records of events that happened in your application. Good logs are structured (machine-parseable), searchable, and contain enough context to diagnose issues without reproducing them.

\`\`\`typescript
// # Use a structured logger — NOT console.log in production
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

// # GOOD: Structured, searchable, contains context
// # You can search for userId=123 or action=signup across all logs
logger.info(
  { userId: "123", action: "signup", plan: "pro", source: "google" },
  "User signed up"
);

// # BAD: Unstructured, unsearchable, no context
// # How do you find all signups? How do you filter by plan?
console.log("User 123 signed up for pro plan via Google");
\`\`\`

**2. Metrics — How much / how fast (numeric measurements)**

Metrics are numbers that tell you how your system is performing. They answer questions like "How many requests per second?" "What's the average response time?" "How many errors are happening?"

\`\`\`typescript
// # Track API response time for every request
const start = Date.now();
const result = await handleRequest(req);
const duration = Date.now() - start;

// # Log the metric so your monitoring tool can aggregate it
logger.info(
  { path: req.url, duration, status: result.status, method: req.method },
  "API request completed"
);
\`\`\`

**3. Traces — The full journey (request lifecycle)**

A trace follows a single request through every service it touches: Browser → CDN → Load Balancer → Server → Database → External API → Response. When a request is slow, the trace shows you exactly which step took the longest.

### Sentry — Error Tracking in Practice

Sentry captures every unhandled error in your application, including the full stack trace, the user who experienced it, the browser/device information, and (optionally) a video replay of the user's session.

\`\`\`typescript
// # sentry.client.config.ts — Frontend error tracking
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // # Sample 10% of requests for performance traces
  // # (100% would be too expensive for high-traffic apps)
  tracesSampleRate: 0.1,
  // # Record 10% of sessions as video replays
  replaysSessionSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
\`\`\`

When an error occurs, Sentry captures: the error message, the full stack trace (with source maps for readable code), the user's ID and email, the browser and device, breadcrumbs (the sequence of actions that led to the error), and the exact commit that deployed the buggy code.

### Health Check Endpoint

Every production application needs a health check endpoint that monitoring tools can ping. If the health check fails, your alerting system notifies you immediately.

\`\`\`typescript
// # src/app/api/health/route.ts
export async function GET() {
  try {
    // # Check that the database is reachable
    await prisma.$queryRaw\`SELECT 1\`;

    return Response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.COMMIT_SHA || "unknown",
    });
  } catch (error) {
    // # Database is down — return unhealthy status
    return Response.json(
      { status: "unhealthy", error: "Database connection failed" },
      { status: 503 }
    );
  }
}
\`\`\`

### Key Metrics to Monitor and Alert On

| Metric | Healthy Target | Alert When |
|--------|---------------|------------|
| Error rate | Below 0.1% | Above 1% for 5 consecutive minutes |
| P95 response time | Under 500ms | Above 2 seconds for 5 minutes |
| Uptime | 99.9% or higher | Any downtime detected |
| Database connections | Under 80% of pool | Above 90% of pool |
| Memory usage | Under 80% | Above 90% |
| Failed health checks | 0 | Any failure |

Set up external monitoring (BetterUptime, UptimeRobot, or Vercel's built-in analytics) to ping your health endpoint every minute. If the health check fails consecutively, you get notified via Slack, email, or SMS — not when a user tweets about your outage.`,
      },
      {
        title: "DevOps Quiz",
        slug: "devops-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## Deployment & DevOps Quiz

<!--quiz
[
  {
    "question": "Your production app suddenly starts returning 500 errors. What should you check FIRST?",
    "options": [
      "Read through the latest git commit to find the bug",
      "Check Sentry (error tracking dashboard) for the specific error message and stack trace",
      "Check the database CPU and memory usage",
      "Roll back to the previous deployment immediately"
    ],
    "correctIndex": 1,
    "explanation": "Sentry shows you the EXACT error, stack trace, affected users, and which deployment introduced it. Starting with git commits is guessing. Checking database metrics is premature. Rolling back without understanding the problem might not fix it (the issue might be in the database, not the code). Start with the error tracker — it gives you the diagnosis in seconds."
  },
  {
    "question": "Why should development, preview, and production use different DATABASE_URL values?",
    "options": [
      "Different databases perform differently at different scales",
      "To prevent development and testing from accidentally modifying or deleting production data",
      "Vercel requires separate databases for each environment",
      "It makes the code more secure"
    ],
    "correctIndex": 1,
    "explanation": "Environment isolation prevents catastrophic mistakes. If dev and production share a database, a migration test could drop a production table. A developer running 'prisma migrate reset' (which deletes all data) would wipe production. Each environment must be completely isolated — its own database, its own API keys, its own configuration."
  },
  {
    "question": "What's the primary advantage of a multi-stage Docker build over a single-stage build?",
    "options": [
      "It runs the application faster in production",
      "The final image is much smaller because build tools and dev dependencies are excluded",
      "It supports more programming languages in one image",
      "It's required by container registries like Docker Hub"
    ],
    "correctIndex": 1,
    "explanation": "Multi-stage builds separate BUILD (TypeScript compiler, dev dependencies, build tools — often 1-2 GB) from RUN (Node.js runtime, production dependencies, compiled code — often 100-200 MB). The final image excludes everything that's only needed during build. Smaller images deploy faster, use less memory, and have fewer potential security vulnerabilities."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 5: API Design & Integration
     ============================================================ */
  {
    name: "API Design & Integration",
    slug: "api-design-integration",
    description: "REST API best practices, error handling, validation, third-party integration patterns, and Server Actions vs Route Handlers.",
    order: 5,
    sections: [
      {
        title: "Full Stack API Patterns",
        slug: "fullstack-api-patterns",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## Full Stack API Patterns

In a full-stack Next.js application, you have multiple ways to move data between the client and server. Each pattern has a specific purpose, and choosing the right one for each use case makes your code simpler, faster, and more maintainable.

The key insight is that many operations that traditionally required an API route no longer need one. Server Components can fetch data directly. Server Actions can handle form submissions. Route Handlers are only needed for external API consumers (mobile apps, webhooks, third-party integrations).

### Pattern 1: Server Components — Display Data (No API Needed)

The simplest pattern in full-stack Next.js. Your component runs on the server, queries the database directly, and sends HTML to the browser. No API route, no fetch call, no loading state, no useEffect. The data is just there.

\`\`\`tsx
// # This entire component runs on the SERVER
// # The browser receives finished HTML — zero JavaScript for this component
async function ProductList() {
  // # Direct database access — Prisma runs on the server
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, name: true, price: true, image: true },
  });

  return (
    <ul className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <li key={product.id} className="p-4 border rounded">
          <h3>{product.name}</h3>
          <p>£{(product.price / 100).toFixed(2)}</p>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

### Pattern 2: Server Actions — Handle Form Submissions

For creating, updating, or deleting data. Server Actions run on the server and can be called directly from forms. They even work when JavaScript is disabled in the browser (progressive enhancement).

\`\`\`tsx
// # actions.ts — Server Actions file
"use server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// # Validation schema — ALWAYS validate server-side
const productSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
});

export async function createProduct(formData: FormData) {
  // # Step 1: Authenticate
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // # Step 2: Validate input
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const parsed = productSchema.safeParse({ name, price });
  if (!parsed.success) throw new Error("Invalid input");

  // # Step 3: Create in database
  await prisma.product.create({
    data: {
      name: parsed.data.name,
      price: Math.round(parsed.data.price * 100), // # Store as pence
      authorId: session.user.id,
    },
  });

  // # Step 4: Revalidate the products page so it shows the new product
  revalidatePath("/products");
}
\`\`\`

### Pattern 3: Route Handlers — External API Endpoints

Route Handlers create standard REST endpoints. Use them when something EXTERNAL needs to call your API — a mobile app, a webhook from Stripe, a Chrome extension, or a third-party integration.

\`\`\`typescript
// # src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function GET(request: NextRequest) {
  // # Parse query parameters for pagination
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  // # Clamp limit to prevent someone requesting 999999 items
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  // # Fetch products with pagination
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { published: true },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: { published: true } }),
  ]);

  // # Return consistent response format
  return NextResponse.json({
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  // # Authentication check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // # Parse and validate request body
  const body = await request.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // # Create the product
  const product = await prisma.product.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  // # 201 Created — the correct status code for successful creation
  return NextResponse.json(product, { status: 201 });
}
\`\`\`

### When to Use Each Pattern

| Scenario | Best Pattern | Why |
|----------|-------------|-----|
| Display data on a page | Server Component | No API needed, zero JS, simplest code |
| Form submission (create/update/delete) | Server Action | No API route needed, works without JS |
| Client-side data with SWR/React Query | Route Handler | Client needs a REST endpoint to fetch |
| Webhook from Stripe/GitHub | Route Handler | External services need a standard HTTP endpoint |
| Mobile app API | Route Handler | Mobile apps consume REST APIs |
| Real-time updates | WebSocket or Server-Sent Events | Bidirectional or push-based communication |`,
      },
      {
        title: "Error Handling & Validation",
        slug: "error-handling-validation",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 35,
        order: 2,
        content: `## Error Handling & Validation

Poor error handling is the number one source of confusing user experiences and security vulnerabilities. When errors are handled well, users see helpful messages, developers can diagnose problems quickly, and attackers cannot extract information about your system.

The fundamental principle is: validate everything at the boundary (where data enters your system), handle errors gracefully, and never expose internal details to the client.

### Input Validation with Zod

Never trust client input. Every piece of data that crosses the client-server boundary must be validated. Zod is the standard validation library in the TypeScript ecosystem — it validates data and produces TypeScript types from the same definition.

\`\`\`typescript
import { z } from "zod";

// # Define the schema — this is BOTH validation AND TypeScript type
const createUserSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  age: z.number().int().min(13, "Must be at least 13").optional(),
});

// # TypeScript type is generated automatically from the schema
// # type CreateUserInput = { email: string; name: string; password: string; age?: number }
type CreateUserInput = z.infer<typeof createUserSchema>;

// # Use in an API route
export async function POST(request: NextRequest) {
  // # Parse the request body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // # Validate with Zod
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    // # Return structured validation errors
    // # The client can display these next to each form field
    return NextResponse.json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
      // # Example: { email: ["Must be a valid email"], name: ["Too short"] }
    }, { status: 400 });
  }

  // # parsed.data is fully typed, validated, and safe to use
  const user = await createUser(parsed.data);
  return NextResponse.json(user, { status: 201 });
}
\`\`\`

### Consistent Error Responses

Every error response from your API should follow the same structure. Clients should never have to guess where the error information is.

\`\`\`typescript
// # Standard error response type
type ApiErrorResponse = {
  error: string;      // # Human-readable message (shown to user)
  code: string;       // # Machine-readable code (used in client logic)
  details?: unknown;  // # Additional context (validation errors, etc.)
};

// # Helper function for consistent errors
function apiError(
  message: string,
  code: string,
  status: number,
  details?: unknown
) {
  return NextResponse.json(
    { error: message, code, details } satisfies ApiErrorResponse,
    { status }
  );
}

// # Usage — clear, consistent, concise
return apiError("User not found", "USER_NOT_FOUND", 404);
return apiError("Rate limit exceeded", "RATE_LIMITED", 429, { retryAfter: 60 });
return apiError("Email already registered", "DUPLICATE_EMAIL", 409);
\`\`\`

### Global Error Boundary — Catch Everything Else

Even with careful error handling, unexpected errors will occur. A global try-catch prevents your API from leaking internal details.

\`\`\`typescript
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    // # Log the FULL error for your debugging (server-side only)
    console.error("API error:", error);

    // # Return a GENERIC message to the client
    // # NEVER expose: stack traces, file paths, database details,
    // # SQL queries, internal error messages, or environment info
    return NextResponse.json(
      { error: "Something went wrong", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
\`\`\`

### What to Return vs What to Log

| To the Client (visible to attackers) | To Your Logs (visible only to you) |
|--------------------------------------|-----------------------------------|
| "Invalid email format" | Full Zod validation error with field details |
| "User not found" | "No row in table Users where id=abc123" |
| "Something went wrong" | Full stack trace with file paths and line numbers |
| Field-specific validation errors | SQL query that failed with parameters |
| "Rate limit exceeded" | IP address, endpoint, request count |`,
      },
      {
        title: "API Design & Integration Quiz",
        slug: "api-design-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## API Design & Integration Quiz

<!--quiz
[
  {
    "question": "You're building a product page that displays data from your database. What's the simplest approach in Next.js App Router?",
    "options": [
      "Create a Route Handler (/api/products), then fetch from the client with useEffect and useState",
      "Use a Server Component and query the database directly — no API route, no fetch, no loading state",
      "Use getServerSideProps (legacy Pages Router pattern)",
      "Create a Server Action to load the data"
    ],
    "correctIndex": 1,
    "explanation": "Server Components can access the database directly — no API route, no fetch, no loading state management. The data is fetched on the server and HTML is sent to the browser. Zero JavaScript shipped for the data-fetching logic. This is the simplest AND most performant pattern for displaying data. API routes are for external consumers; Server Actions are for mutations (create/update/delete)."
  },
  {
    "question": "Your API returns this to a client: 'Error: relation users does not exist at /app/src/lib/db.ts:42'. What's the security problem?",
    "options": [
      "Nothing wrong — detailed errors help users report bugs",
      "The error exposes internal details: database type, table names, file paths, and line numbers — information attackers use to plan targeted attacks",
      "The error message is too technical for users to understand",
      "The HTTP status code should be 404 instead of 500"
    ],
    "correctIndex": 1,
    "explanation": "Internal error details are a goldmine for attackers. Database engine type helps craft SQL injection. Table names reveal your data model. File paths reveal your directory structure. Framework versions reveal known vulnerabilities. Always: log the full error server-side (for YOUR debugging) and return a generic message to clients ('Something went wrong'). Never expose internals."
  },
  {
    "question": "When should you validate incoming data with Zod in your API routes?",
    "options": [
      "Only for POST requests that create new records",
      "Only when users fill out registration or payment forms",
      "For ALL incoming data — request bodies, query parameters, and any user-controllable input",
      "Only in production — skip validation in development for faster iteration"
    ],
    "correctIndex": 2,
    "explanation": "Validate everything at the API boundary. Query parameters can be manipulated (?page=-1&limit=999999 could crash your database). Request bodies can contain unexpected fields or types. Even URL path parameters can be malicious. Zod validates and transforms data in one step, giving you a typed, safe object to work with. If you didn't validate it, don't trust it."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 6: Testing Full Stack Apps
     ============================================================ */
  {
    name: "Testing Full Stack Apps",
    slug: "testing-fullstack",
    description: "Unit tests, integration tests, E2E testing with Playwright, testing API routes, and testing strategy.",
    order: 6,
    sections: [
      {
        title: "Testing Strategy for Full Stack Apps",
        slug: "testing-strategy",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 1,
        content: `## Testing Strategy for Full Stack Apps

Testing a full-stack application is different from testing a library or a single service. You have multiple layers — utility functions, API routes, database operations, user interfaces, and end-to-end flows — each needing a different testing approach.

The goal is not 100% code coverage. The goal is confidence. You want to be confident that when you merge a PR, it will not break production. Different types of tests give you confidence about different things: unit tests catch logic errors, integration tests catch layer-boundary issues, and E2E tests catch user-flow regressions.

### The Testing Pyramid

\`\`\`
         /   E2E   \\          ← Few (5-10): slow, expensive, test critical user flows
        / Integration \\       ← Some (20-50): test API routes, database operations
       /    Unit       \\      ← Many (100+): fast, focused, test pure logic
      /________________\\
\`\`\`

The pyramid shape is intentional. Unit tests are fast (milliseconds), cheap to write, and reliable. E2E tests are slow (seconds), expensive to maintain, and sometimes flaky. Write more of the fast, cheap tests and fewer of the slow, expensive ones.

### Unit Tests — Testing Pure Functions in Isolation

Unit tests verify that individual functions produce correct output for given inputs. They are fast, deterministic, and focused on one thing.

\`\`\`typescript
// # utils/format.ts — Pure utility functions
export function formatPrice(pence: number): string {
  return \`£\${(pence / 100).toFixed(2)}\`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")  // # Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, "");     // # Remove leading/trailing hyphens
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

// # utils/format.test.ts — Unit tests
import { describe, it, expect } from "vitest";
import { formatPrice, slugify, truncate } from "./format";

describe("formatPrice", () => {
  it("converts pence to pounds with two decimals", () => {
    expect(formatPrice(1099)).toBe("£10.99");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("£0.00");
  });

  it("handles single-digit pence", () => {
    expect(formatPrice(5)).toBe("£0.05");
  });

  it("handles large amounts", () => {
    expect(formatPrice(999999)).toBe("£9999.99");
  });
});

describe("slugify", () => {
  it("converts spaces to hyphens and lowercases", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World? #2")).toBe("hello-world-2");
  });

  it("trims hyphens from edges", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("truncate", () => {
  it("returns full text when under limit", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates with ellipsis when over limit", () => {
    expect(truncate("Hello World", 8)).toBe("Hello...");
  });

  it("handles exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});
\`\`\`

### Integration Tests — Testing API Routes and Database

Integration tests verify that multiple parts of your application work together correctly. For full-stack apps, the most valuable integration tests exercise your API routes — they test authentication, validation, database operations, and response formatting all at once.

\`\`\`typescript
// # __tests__/api/products.test.ts
import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/products/route";
import { NextRequest } from "next/server";

describe("GET /api/products", () => {
  it("returns paginated products with correct structure", async () => {
    const req = new NextRequest("http://localhost/api/products?page=1&limit=10");
    const res = await GET(req);
    const data = await res.json();

    // # Verify status code
    expect(res.status).toBe(200);
    // # Verify response structure
    expect(data.data).toBeInstanceOf(Array);
    expect(data.pagination).toHaveProperty("page", 1);
    expect(data.pagination).toHaveProperty("limit", 10);
    expect(data.pagination).toHaveProperty("total");
    expect(data.pagination).toHaveProperty("totalPages");
  });

  it("clamps limit to maximum 100 to prevent abuse", async () => {
    // # A malicious client might send ?limit=999999 to overload the DB
    const req = new NextRequest("http://localhost/api/products?limit=999999");
    const res = await GET(req);
    const data = await res.json();

    expect(data.pagination.limit).toBeLessThanOrEqual(100);
  });
});

describe("POST /api/products", () => {
  it("rejects unauthenticated requests with 401", async () => {
    const req = new NextRequest("http://localhost/api/products", {
      method: "POST",
      body: JSON.stringify({ name: "Test Product", price: 1099 }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("rejects invalid input with 400 and field errors", async () => {
    // # Assuming authenticated...
    const req = new NextRequest("http://localhost/api/products", {
      method: "POST",
      body: JSON.stringify({ name: "", price: -5 }), // # Invalid!
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined(); // # Field-specific errors
  });
});
\`\`\`

### E2E Tests — Testing Real User Flows

E2E (end-to-end) tests simulate a real user interacting with your application in a real browser. They are the most expensive to write and maintain, but they catch issues that no other test type can find — like a button that renders but does not actually work, or a redirect that goes to the wrong page.

Use Playwright for E2E tests — it is fast, reliable, and supports all major browsers.

\`\`\`typescript
// # e2e/auth.spec.ts — Playwright E2E test
import { test, expect } from "@playwright/test";

test("user can sign up and see the dashboard", async ({ page }) => {
  // # Navigate to the signup page
  await page.goto("/signup");

  // # Fill out the registration form
  await page.fill('[name="email"]', "newuser@example.com");
  await page.fill('[name="password"]', "SecurePassword123!");
  await page.fill('[name="name"]', "Test User");

  // # Submit the form
  await page.click('button[type="submit"]');

  // # Verify redirect to dashboard
  await expect(page).toHaveURL("/dashboard");
  // # Verify the user's name appears
  await expect(page.getByText("Welcome, Test User")).toBeVisible();
});

test("unauthenticated user is redirected to login", async ({ page }) => {
  // # Try to access a protected page without logging in
  await page.goto("/dashboard");
  // # Should be redirected to the login page
  await expect(page).toHaveURL("/login");
});

test("invalid login shows error message", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "wrong@example.com");
  await page.fill('[name="password"]', "wrongpassword");
  await page.click('button[type="submit"]');

  // # Should show an error, NOT redirect to dashboard
  await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible();
  await expect(page).toHaveURL("/login");
});
\`\`\`

### What to Test at Each Level

| Layer | Test Type | What to Test | How Many |
|-------|-----------|-------------|----------|
| Utility functions | Unit | Pure logic, formatting, calculations | Many (100+) |
| API routes | Integration | Auth, validation, status codes, response shape | Some (20-50) |
| Database operations | Integration | CRUD, constraints, transactions, edge cases | Some |
| Critical user flows | E2E | Sign up, login, purchase, key features | Few (5-10) |
| Error states | All levels | Invalid input, network errors, edge cases | Throughout |`,
      },
      {
        title: "Testing Quiz",
        slug: "testing-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Full Stack Testing Quiz

<!--quiz
[
  {
    "question": "You have a formatPrice(pence) utility function that converts pence to a formatted pound string. What kind of test should you write?",
    "options": [
      "E2E test — render a page showing a price and check it displays correctly",
      "Unit test — call the function directly with various inputs and check the output",
      "Integration test — test it through an API route that uses it",
      "Manual test — check prices in the browser by hand"
    ],
    "correctIndex": 1,
    "explanation": "Pure utility functions with no dependencies are perfect for unit tests. They run in milliseconds, test one thing, and never flake. Test normal cases (1099 → '£10.99'), edge cases (0 → '£0.00'), and boundary conditions (5 → '£0.05'). Unit tests are the foundation of your test pyramid — they're fast, reliable, and catch logic errors immediately."
  },
  {
    "question": "Which testing approach gives you the best bug-catching coverage per time invested in a full-stack application?",
    "options": [
      "Aim for 100% unit test line coverage",
      "A balanced testing pyramid: many unit tests, some integration tests, and a few critical E2E tests",
      "Write only E2E tests that simulate every possible user flow",
      "Skip automated tests and do thorough manual testing before each release"
    ],
    "correctIndex": 1,
    "explanation": "The testing pyramid works because each layer catches different bugs at different costs. Unit tests catch logic errors (fast, cheap, write many). Integration tests catch API and database issues (moderate cost, write some). E2E tests catch user-flow regressions (expensive, write few critical paths). Only unit tests miss integration bugs. Only E2E tests are too slow and fragile. The balanced mix catches the most bugs per hour invested."
  }
]
-->`,
      },
    ],
  },
];
