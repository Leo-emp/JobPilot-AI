/* ============================================================
   FULL STACK ENGINEER WORKSHOP — Seed Content
   ============================================================
   # End-to-end application architecture, API integration,
   # deployment, and full-stack project patterns.
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
        estimatedMinutes: 30,
        order: 1,
        content: `## Monolith vs Microservices vs Serverless

Choosing the right architecture is one of the most impactful decisions you'll make. The wrong choice can sink a project; the right choice makes everything easier.

### Monolith — One Codebase, One Deploy

**What it is:** Everything (frontend, backend, database access) in a single application.

**Structure:**
\`\`\`
my-app/
├── src/
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── models/        # Database models
│   ├── middleware/     # Auth, logging, etc.
│   └── utils/         # Shared utilities
├── public/            # Static assets
└── package.json
\`\`\`

**Pros:**
- Simple to develop, test, and deploy
- Easy debugging (everything in one process)
- No network calls between services
- Perfect for small teams (1-10 developers)

**Cons:**
- Entire app must be deployed for any change
- Hard to scale individual components
- One bug can bring down everything
- Technology lock-in (one language/framework)

**When to use:** Early-stage startups, MVPs, teams under 10, apps that don't need to scale independently.

### Microservices — Many Small Services

**What it is:** Application split into independent services, each with its own database, deployment, and team.

**Structure:**
\`\`\`
services/
├── user-service/       # Handles authentication, profiles
├── order-service/      # Handles orders, payments
├── notification-service/ # Email, SMS, push notifications
├── search-service/     # Elasticsearch-based search
└── api-gateway/        # Routes requests to services
\`\`\`

**Pros:**
- Independent deployment (deploy user-service without touching orders)
- Independent scaling (scale search-service without scaling everything)
- Technology flexibility (user-service in Node.js, search-service in Go)
- Team autonomy (each team owns their service end-to-end)

**Cons:**
- Massive operational complexity (networking, monitoring, debugging)
- Distributed transactions are hard
- Data consistency challenges
- Requires DevOps maturity (Kubernetes, service mesh, distributed tracing)

**When to use:** Large organizations (50+ engineers), apps with components that need to scale independently, when teams are large enough to own services end-to-end.

### Serverless — Functions as a Service

**What it is:** Write individual functions that cloud providers run on demand. No servers to manage.

**Examples:** Vercel Functions, AWS Lambda, Cloudflare Workers

**Pros:**
- No server management
- Auto-scales to zero (pay only for what you use)
- Per-request pricing (great for variable traffic)
- Fast deployments

**Cons:**
- Cold starts (first request is slower)
- Execution time limits (varies by provider)
- Vendor lock-in
- Harder to test locally
- Not great for long-running processes

**When to use:** API routes, webhooks, scheduled jobs, event processing, any workload with variable traffic.

### Decision Framework

| Factor | Monolith | Microservices | Serverless |
|--------|----------|---------------|------------|
| Team size | 1-10 | 50+ | 1-20 |
| Deployment | Simple | Complex | Simplest |
| Scaling | Vertical | Horizontal per service | Automatic |
| Cost at low traffic | Fixed server cost | High (many services) | Near zero |
| Cost at high traffic | Moderate | Optimized | Can spike |
| Debugging | Easy | Hard (distributed tracing) | Medium |
| Time to market | Fastest | Slowest | Fast |

### The Pragmatic Path

**Most successful companies follow this path:**
1. **Start with a monolith** — ship fast, validate the product
2. **Extract services when needed** — when a specific component needs independent scaling or different technology
3. **Use serverless for glue** — cron jobs, webhooks, event processing

Don't start with microservices. You don't have Netflix's problems, and you don't have Netflix's engineering team.`,
      },
      {
        title: "Next.js App Router Patterns",
        slug: "nextjs-app-router",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 30,
        order: 2,
        content: `## Next.js App Router Patterns

Next.js App Router is the modern way to build full-stack React applications. Understanding Server Components, data fetching, and rendering strategies is essential.

### Server Components vs Client Components

**Server Components (default):**
- Render on the server, send HTML to the client
- Can directly access databases, file systems, environment variables
- Zero JavaScript shipped to the browser
- Cannot use hooks (useState, useEffect) or browser APIs

**Client Components ("use client"):**
- Render on the client (browser)
- Can use hooks, event handlers, browser APIs
- JavaScript is shipped to the browser
- Required for interactivity (forms, modals, animations)

\`\`\`tsx
// Server Component (default — no directive)
async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  return <ProductDetails product={product} />;
}

// Client Component
"use client";
function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    await fetch("/api/cart", { method: "POST", body: JSON.stringify({ productId }) });
    setLoading(false);
  };
  return <button onClick={handleClick} disabled={loading}>Add to Cart</button>;
}
\`\`\`

### Data Fetching Patterns

**Pattern 1: Fetch in Server Components (preferred)**
\`\`\`tsx
// Fetch directly — no useEffect, no loading state needed
async function UserProfile({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) notFound();
  return <h1>{user.name}</h1>;
}
\`\`\`

**Pattern 2: Parallel data fetching**
\`\`\`tsx
async function Dashboard() {
  // Fetch in parallel — don't await sequentially!
  const [user, orders, stats] = await Promise.all([
    getUser(),
    getOrders(),
    getStats(),
  ]);
  return <DashboardView user={user} orders={orders} stats={stats} />;
}
\`\`\`

**Pattern 3: Streaming with Suspense**
\`\`\`tsx
import { Suspense } from "react";

async function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Fast content renders immediately */}
      <UserInfo />
      {/* Slow content streams in when ready */}
      <Suspense fallback={<Skeleton />}>
        <SlowAnalytics />
      </Suspense>
    </div>
  );
}
\`\`\`

### Server Actions

Server Actions let you mutate data without creating API routes.

\`\`\`tsx
// Server Action (runs on the server)
async function createPost(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  await prisma.post.create({ data: { title, authorId: session.user.id } });
  revalidatePath("/posts");
}

// Used in a form (works without JavaScript!)
function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
\`\`\`

### Route Groups & Layouts

\`\`\`
app/
├── (marketing)/           # Route group — no URL segment
│   ├── layout.tsx         # Marketing layout (no sidebar)
│   ├── page.tsx           # /
│   └── pricing/page.tsx   # /pricing
├── (dashboard)/           # Route group — different layout
│   ├── layout.tsx         # Dashboard layout (with sidebar)
│   ├── dashboard/page.tsx # /dashboard
│   └── settings/page.tsx  # /settings
├── api/
│   └── users/route.ts     # API route
└── layout.tsx             # Root layout
\`\`\`

### Decision Guide

| Need | Approach |
|------|---------|
| Display data | Server Component + direct DB access |
| Form submission | Server Action |
| Interactive UI (modals, forms) | Client Component |
| Slow data | Suspense boundary + streaming |
| Parallel data | Promise.all in Server Component |
| Shared layout | Layout file in route folder |
| API for external consumers | Route Handler (route.ts) |`,
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
    "question": "You're a solo founder building an MVP. Which architecture should you start with?",
    "options": [
      "Microservices — scale from day one",
      "Monolith — ship fast, extract services later when needed",
      "Serverless — pay only for what you use",
      "Event-driven — loosely coupled from the start"
    ],
    "correctIndex": 1,
    "explanation": "A monolith lets you ship fastest: one codebase, one deployment, simple debugging. You don't have Netflix's scale problems, so you don't need Netflix's architecture. Start monolith, validate the product, then extract specific services when (and only when) they need independent scaling. Most successful companies followed this path."
  },
  {
    "question": "In Next.js App Router, when should you add 'use client' to a component?",
    "options": [
      "Always — client components are faster",
      "Only when you need interactivity (hooks, event handlers, browser APIs)",
      "When the component fetches data",
      "When the component has props"
    ],
    "correctIndex": 1,
    "explanation": "Server Components are the default and preferred — they send zero JavaScript to the browser. You only add 'use client' when you NEED client-side features: useState, useEffect, onClick handlers, browser APIs (localStorage, window), or third-party libraries that use these. Data fetching is better in Server Components (direct DB access, no API needed)."
  },
  {
    "question": "You have a page with a fast header and a slow analytics section. How do you avoid the slow section blocking the entire page?",
    "options": [
      "Use useEffect to fetch analytics on the client",
      "Wrap the slow section in Suspense with a fallback skeleton",
      "Put analytics in a separate API route",
      "Cache the analytics data"
    ],
    "correctIndex": 1,
    "explanation": "Suspense with streaming is the ideal solution: the fast header renders and ships to the browser immediately, while the slow analytics section shows a skeleton. When the data is ready, the real content streams in and replaces the skeleton — all server-rendered, no client-side fetching needed. The user sees useful content instantly."
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
    description: "ORMs (Prisma, Drizzle), migrations, connection pooling, edge database patterns, and data modeling.",
    order: 2,
    sections: [
      {
        title: "Modern ORM Patterns",
        slug: "modern-orm-patterns",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Modern ORM Patterns

An ORM (Object-Relational Mapping) lets you interact with your database using your programming language instead of raw SQL. Modern ORMs like Prisma provide type safety, auto-completion, and migration management.

### Why Use an ORM?

| Without ORM (raw SQL) | With ORM (Prisma) |
|----------------------|-------------------|
| No type safety | Full TypeScript types |
| SQL injection risk with string concat | Parameterized by default |
| Manual migration tracking | Built-in migration system |
| Write SQL for every query | Auto-generated query builder |

### Prisma — The Type-Safe ORM

**Schema definition:**
\`\`\`prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  tags      Tag[]
}

enum Role {
  USER
  ADMIN
}
\`\`\`

**Common query patterns:**

\`\`\`typescript
// Create with relations
const user = await prisma.user.create({
  data: {
    email: "jane@example.com",
    name: "Jane",
    posts: {
      create: [
        { title: "First Post", content: "Hello!" },
      ],
    },
  },
  include: { posts: true },
});

// Find with filtering and pagination
const users = await prisma.user.findMany({
  where: {
    role: "ADMIN",
    posts: { some: { published: true } },
  },
  orderBy: { createdAt: "desc" },
  take: 20,
  skip: 0,
  select: { id: true, name: true, email: true },
});

// Transaction — all or nothing
const [user, order] = await prisma.$transaction([
  prisma.user.update({ where: { id: userId }, data: { credits: { decrement: 10 } } }),
  prisma.order.create({ data: { userId, productId, total: 10 } }),
]);

// Upsert — create if not exists, update if exists
const user = await prisma.user.upsert({
  where: { email: "jane@example.com" },
  create: { email: "jane@example.com", name: "Jane" },
  update: { name: "Jane Updated" },
});
\`\`\`

### Migrations — Safe Schema Evolution

\`\`\`bash
# Generate migration from schema changes
npx prisma migrate dev --name add_user_avatar

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset
\`\`\`

**Migration best practices:**
1. Never edit a migration after it's been applied to production
2. Always review generated SQL before applying
3. Use \`prisma db push\` for prototyping, \`prisma migrate dev\` for real migrations
4. Test migrations on a staging database first
5. Have a rollback plan for every migration

### Connection Pooling

Database connections are expensive. A pool reuses connections instead of creating a new one per query.

\`\`\`typescript
// PgBouncer, Prisma Accelerate, or Neon's built-in pooler
// In serverless, this is critical because each function invocation
// would otherwise create a new connection

// Prisma with connection pooler
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")           // Pooled connection
  directUrl = env("DIRECT_DATABASE_URL")   // Direct for migrations
}
\`\`\`

**Without pooling:** 1,000 requests = 1,000 database connections (database crashes)
**With pooling:** 1,000 requests = 10-20 shared connections (database is happy)`,
      },
      {
        title: "Database Migrations & Schema Evolution",
        slug: "migrations-schema-evolution",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 20,
        order: 2,
        content: `## Database Migrations & Schema Evolution

Your database schema will change constantly as your application evolves. Migrations let you make those changes safely, repeatably, and reversibly.

### What Are Migrations?

A migration is a versioned SQL script that changes your database schema. Instead of manually running ALTER TABLE commands, you:

1. Change your schema definition (e.g., Prisma schema)
2. Generate a migration file (SQL describing the change)
3. Apply the migration to your database
4. The migration is tracked so it never runs twice

### Safe Migration Patterns

**Adding a column (safe):**
\`\`\`sql
-- Generated by: prisma migrate dev --name add_avatar
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
\`\`\`
This is safe because existing rows get NULL for the new column.

**Adding a NOT NULL column (dangerous!):**
\`\`\`sql
-- This FAILS if the table has existing rows!
ALTER TABLE "User" ADD COLUMN "avatar" TEXT NOT NULL;

-- Safe approach: add with default, then make required
ALTER TABLE "User" ADD COLUMN "avatar" TEXT NOT NULL DEFAULT 'default-avatar.png';
\`\`\`

**Renaming a column (requires care):**
\`\`\`sql
-- Step 1: Add new column
ALTER TABLE "User" ADD COLUMN "fullName" TEXT;
-- Step 2: Copy data
UPDATE "User" SET "fullName" = "name";
-- Step 3: Deploy code that reads both columns
-- Step 4: Drop old column (after code is live)
ALTER TABLE "User" DROP COLUMN "name";
\`\`\`

### Migration Workflow

\`\`\`bash
# Development: generate and apply migration
npx prisma migrate dev --name add_user_avatar

# Production: apply pending migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database (DEVELOPMENT ONLY — destroys all data)
npx prisma migrate reset
\`\`\`

### Golden Rules

1. **Never edit a migration after it's been applied** — create a new one
2. **Always review generated SQL** — ORMs can generate unexpected DDL
3. **Test migrations on staging first** — before production
4. **Make migrations backward-compatible** — old code should still work during deploy
5. **Keep migrations small** — one concern per migration
6. **Have a rollback plan** — know how to undo every migration`,
      },
      {
        title: "Database Design Quiz",
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
      "ALTER TABLE Users ADD COLUMN phoneNumber TEXT NOT NULL",
      "ALTER TABLE Users ADD COLUMN phoneNumber TEXT NOT NULL DEFAULT ''",
      "Delete all users first, then add the column",
      "Create a new table and copy data"
    ],
    "correctIndex": 1,
    "explanation": "Adding a NOT NULL column without a default fails when existing rows exist (they'd have no value). Adding with a DEFAULT value is safe — all existing rows get the default. You can later update the default values and optionally remove the default. Never delete data or create new tables for simple schema changes."
  },
  {
    "question": "Your app makes 1,000 API requests per second, each querying the database. What's the most critical infrastructure to add?",
    "options": [
      "A bigger database server",
      "Connection pooling (PgBouncer or built-in pooler)",
      "Read replicas",
      "Switch to NoSQL"
    ],
    "correctIndex": 1,
    "explanation": "Connection pooling is the first thing to add. Without it, 1,000 requests means 1,000 database connections — most databases max out at a few hundred. A connection pool shares 10-20 connections across all requests. This alone often solves performance issues. Scaling hardware, replicas, or changing databases are later steps."
  },
  {
    "question": "When should you use prisma.$transaction()?",
    "options": [
      "For every database query — it's always safer",
      "When multiple operations must all succeed or all fail together",
      "Only for read operations",
      "When you want faster queries"
    ],
    "correctIndex": 1,
    "explanation": "Transactions ensure atomicity: either ALL operations succeed, or NONE do. Use them when operations are logically linked — like deducting credits AND creating an order. If the order fails, you don't want credits deducted. Don't wrap single queries in transactions (unnecessary overhead), and don't wrap reads (they don't modify data)."
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
        estimatedMinutes: 25,
        order: 1,
        content: `## Auth.js (NextAuth) in Next.js

Auth.js is the most popular authentication library for Next.js. It handles OAuth, credentials, sessions, and JWTs out of the box.

### Setup

\`\`\`typescript
// src/lib/auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
    Google({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials against your database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
});
\`\`\`

### Protecting Pages (Server Components)

\`\`\`tsx
// Server Component — no "use client" needed
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <h1>Welcome, {session.user.name}</h1>;
}
\`\`\`

### Protecting API Routes

\`\`\`typescript
// src/app/api/protected/route.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user: session.user });
}
\`\`\`

### Middleware Protection (Global)

\`\`\`typescript
// middleware.ts (at project root)
import { auth } from "@/lib/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
\`\`\`

### Role-Based Access Control

\`\`\`tsx
function requireRole(allowedRoles: string[]) {
  return async function checkRole() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (!allowedRoles.includes(session.user.role)) {
      redirect("/unauthorized");
    }
    return session;
  };
}

// Usage in a page
export default async function AdminPage() {
  const session = await requireRole(["admin"])();
  return <h1>Admin Panel for {session.user.name}</h1>;
}
\`\`\``,
      },
      {
        title: "OAuth Flows Explained",
        slug: "oauth-flows",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 20,
        order: 2,
        content: `## OAuth 2.0 Flows Explained

OAuth lets users sign in with Google, GitHub, LinkedIn, etc. without giving your app their password. Understanding the flow is essential for debugging auth issues.

### The Authorization Code Flow (Most Common)

This is what happens when a user clicks "Sign in with Google":

\`\`\`
1. User clicks "Sign in with Google"
2. Your app redirects to Google's authorization server
   → https://accounts.google.com/o/oauth2/v2/auth?
       client_id=YOUR_CLIENT_ID&
       redirect_uri=https://yourapp.com/api/auth/callback/google&
       response_type=code&
       scope=openid email profile

3. User sees Google's consent screen, clicks "Allow"
4. Google redirects back to YOUR app with a CODE
   → https://yourapp.com/api/auth/callback/google?code=abc123

5. Your SERVER exchanges the code for tokens (not the browser!)
   → POST https://oauth2.googleapis.com/token
     { code, client_id, client_secret, redirect_uri }

6. Google returns access_token + id_token
7. Your app uses access_token to get user profile
8. Your app creates a session (cookie or JWT)
\`\`\`

### Why the Code Exchange Matters

The browser only sees the **code**, never the **token**. The token exchange happens server-to-server. This is critical because:
- The code is short-lived (seconds) and single-use
- Even if intercepted, it's useless without your client_secret
- The client_secret never leaves your server

### Setting Up OAuth Providers

**Google:**
1. Go to console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: \`https://yourapp.com/api/auth/callback/google\`
4. Copy Client ID and Client Secret to your .env

**GitHub:**
1. Go to github.com → Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Set callback URL: \`https://yourapp.com/api/auth/callback/github\`
4. Copy Client ID and Client Secret

**Common mistakes:**
- Redirect URI mismatch (must be EXACT, including trailing slashes)
- Using http:// in production (must be https://)
- Not setting the correct callback path for your auth library
- Forgetting to add localhost callback for development

### Token Types

| Token | Purpose | Lifetime |
|-------|---------|----------|
| Authorization Code | One-time code exchange | Seconds |
| Access Token | Access user's data from provider | 1 hour |
| Refresh Token | Get new access tokens | Weeks/months |
| ID Token | Contains user identity claims (JWT) | 1 hour |
| Session Token | Your app's session cookie | Configurable |`,
      },
      {
        title: "Auth Patterns Quiz",
        slug: "auth-patterns-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## Authentication Patterns Quiz

<!--quiz
[
  {
    "question": "In OAuth 2.0, why does the token exchange happen server-to-server instead of in the browser?",
    "options": [
      "It's faster on the server",
      "The browser can't make HTTP requests",
      "To keep the client_secret secure — exposing it in browser code would let anyone impersonate your app",
      "Google requires it for compliance"
    ],
    "correctIndex": 2,
    "explanation": "The client_secret MUST stay on your server. If it were in browser code, anyone could extract it (right-click → View Source) and impersonate your application — requesting tokens on your behalf, stealing user data. The authorization code is safe to pass through the browser because it's useless without the secret."
  },
  {
    "question": "A user reports they can't sign in with Google. The error says 'redirect_uri_mismatch'. What's wrong?",
    "options": [
      "Google's servers are down",
      "The redirect URI in your code doesn't exactly match what's configured in Google Console",
      "The user's Google account is locked",
      "Your client_secret is expired"
    ],
    "correctIndex": 1,
    "explanation": "redirect_uri_mismatch means the redirect URI your app sends doesn't EXACTLY match what's registered in Google Console. Common causes: trailing slash mismatch (with vs without), http vs https, wrong port number, or using localhost in production. Check the Google Console and make the URIs identical."
  },
  {
    "question": "Where should you check authentication in a Next.js app to protect ALL dashboard routes?",
    "options": [
      "In every individual page component",
      "In middleware.ts with a matcher for /dashboard/*",
      "In the layout.tsx file only",
      "In the API routes only"
    ],
    "correctIndex": 1,
    "explanation": "Middleware runs BEFORE any route renders. By using middleware with a matcher for '/dashboard/:path*', you protect every dashboard route in one place. If the user isn't authenticated, they're redirected before the page even starts loading. Checking in individual pages is repetitive and error-prone — you might forget one."
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
        estimatedMinutes: 25,
        order: 1,
        content: `## Modern Deployment Pipeline

The days of FTP-ing files to a server are over. Modern deployment is automated, repeatable, and safe.

### The CI/CD Pipeline

**CI (Continuous Integration):**
Every code push triggers:
1. Install dependencies
2. Run linter (ESLint)
3. Run type checker (TypeScript)
4. Run tests (unit + integration)
5. Build the application

If any step fails, the PR is blocked.

**CD (Continuous Deployment):**
When code is merged to main:
1. CI pipeline runs (above)
2. Application is built
3. Deployed to staging environment
4. Smoke tests run
5. Promoted to production

### Vercel Deployment

\`\`\`bash
# Connect your repo
vercel link

# Deploy preview
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull .env.local
\`\`\`

**Vercel's automatic pipeline:**
- Push to any branch → Preview deployment (unique URL)
- Push to main → Production deployment
- Each PR gets its own preview URL for testing and review

### Environment Variables

**Three environments, three sets of variables:**

| Environment | Purpose | Example Variables |
|------------|---------|-------------------|
| Development | Local dev (.env.local) | DATABASE_URL=file:./dev.db |
| Preview | PR previews | DATABASE_URL=staging-db-url |
| Production | Live site | DATABASE_URL=production-db-url |

**Rules:**
1. Never commit .env files to git
2. Use different values per environment
3. Validate env vars at startup (fail fast)
4. Use a .env.example with placeholder values for documentation

\`\`\`typescript
// Validate environment variables at build time
const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(\`Missing required environment variable: \${envVar}\`);
  }
}
\`\`\`

### Docker Basics (When You Need It)

\`\`\`dockerfile
# Multi-stage build for Node.js
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Deployment Checklist

| Step | Check |
|------|-------|
| 1 | All tests pass |
| 2 | TypeScript compiles with no errors |
| 3 | Environment variables set for target environment |
| 4 | Database migrations applied |
| 5 | Preview deployment tested |
| 6 | Performance budget met (bundle size, LCP) |
| 7 | Security headers configured |
| 8 | Error monitoring connected (Sentry) |
| 9 | Backup/rollback plan in place |`,
      },
      {
        title: "Monitoring & Error Tracking",
        slug: "monitoring-error-tracking",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 20,
        order: 2,
        content: `## Monitoring & Error Tracking

Deploying your app is only half the battle. You need to know when things break — ideally before your users tell you.

### The Three Pillars of Observability

**1. Logs — What happened**
\`\`\`typescript
// Structured logging (not console.log in production)
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

// Good: structured, searchable
logger.info({ userId, action: "signup", plan: "pro" }, "User signed up");

// Bad: unstructured, unsearchable
console.log("User " + userId + " signed up for pro plan");
\`\`\`

**2. Metrics — How much/how fast**
\`\`\`typescript
// Track key business and performance metrics
// Response times, error rates, active users, revenue

// Example: track API response time
const start = Date.now();
const result = await handleRequest(req);
const duration = Date.now() - start;

logger.info({ path: req.url, duration, status: result.status }, "API request");
\`\`\`

**3. Traces — The full journey**
A trace follows a single request through your entire system:
Browser → CDN → Server → Database → External API → Response

### Sentry Setup (Error Tracking)

\`\`\`typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,        // 10% of requests get performance traces
  replaysSessionSampleRate: 0.1, // 10% of sessions get replay
  environment: process.env.NODE_ENV,
});
\`\`\`

### Key Metrics to Monitor

| Metric | Target | Alert When |
|--------|--------|------------|
| Error rate | < 0.1% | > 1% for 5 minutes |
| P95 response time | < 500ms | > 2s for 5 minutes |
| Uptime | 99.9% | Any downtime |
| Database connections | < 80% pool | > 90% pool |
| Memory usage | < 80% | > 90% |

### Health Check Endpoint

\`\`\`typescript
// src/app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw\`SELECT 1\`;

    return Response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.COMMIT_SHA || "unknown",
    });
  } catch (error) {
    return Response.json(
      { status: "unhealthy", error: "Database connection failed" },
      { status: 503 }
    );
  }
}
\`\`\`

### Uptime Monitoring

Set up external monitoring (BetterUptime, UptimeRobot) to ping your health endpoint every minute. If it fails, you get alerted immediately — not when a user tweets about it.`,
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
      "The latest git commit",
      "Error tracking dashboard (Sentry) for the specific error and stack trace",
      "Database CPU usage",
      "The deployment logs"
    ],
    "correctIndex": 1,
    "explanation": "Sentry (or your error tracker) shows you the EXACT error, stack trace, and which deployment introduced it. It also shows how many users are affected and which endpoints are failing. Starting with git commits or database metrics is guessing — Sentry gives you the answer directly. Always instrument before you need it."
  },
  {
    "question": "Why should you use different DATABASE_URL values for development, preview, and production?",
    "options": [
      "Different databases have different speeds",
      "To prevent development/testing from affecting production data, and to isolate environments",
      "It's a Vercel requirement",
      "Production databases are more expensive"
    ],
    "correctIndex": 1,
    "explanation": "Environment isolation prevents catastrophic mistakes. If dev and prod share a database, a migration test could delete production data. Preview environments let you test with staging data without risk. Each environment should be a complete, isolated copy of your stack — code, database, and secrets."
  },
  {
    "question": "What's the main advantage of a multi-stage Docker build?",
    "options": [
      "It runs faster in production",
      "It makes the final image smaller by excluding build tools and dev dependencies",
      "It supports more programming languages",
      "It's required by container registries"
    ],
    "correctIndex": 1,
    "explanation": "Multi-stage builds separate the BUILD environment (Node.js, npm, TypeScript compiler, dev dependencies — often 1-2 GB) from the RUN environment (just Node.js, production dependencies, compiled code — often 100-200 MB). A smaller image means faster deploys, less memory usage, and a smaller attack surface."
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
    description: "REST API best practices, error handling, rate limiting, API versioning, and third-party integration patterns.",
    order: 5,
    sections: [
      {
        title: "Full Stack API Patterns",
        slug: "fullstack-api-patterns",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Full Stack API Patterns

In a full-stack Next.js app, you have multiple ways to move data between client and server. Choosing the right pattern for each use case is key.

### Pattern 1: Server Components (No API Needed)

The simplest pattern — fetch data directly in your component. No API route, no fetch call, no loading state.

\`\`\`tsx
// This runs on the SERVER — direct database access
async function ProductList() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name} — £{p.price}</li>)}
    </ul>
  );
}
\`\`\`

### Pattern 2: Server Actions (Mutations)

For creating, updating, or deleting data. No API route needed.

\`\`\`tsx
// actions.ts
"use server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);

  // Validate
  if (!name || name.length > 100) throw new Error("Invalid name");
  if (isNaN(price) || price < 0) throw new Error("Invalid price");

  await prisma.product.create({
    data: { name, price, authorId: session.user.id },
  });

  revalidatePath("/products");
}
\`\`\`

### Pattern 3: Route Handlers (External APIs)

When you need a REST endpoint that external clients, webhooks, or mobile apps consume.

\`\`\`typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const products = await prisma.product.findMany({
    where: { published: true },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.product.count({ where: { published: true } });

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
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  // Validate with Zod
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  return NextResponse.json(product, { status: 201 });
}
\`\`\`

### Decision Matrix

| Scenario | Pattern |
|----------|---------|
| Display data on a page | Server Component |
| Form submission | Server Action |
| Client-side data (SWR/React Query) | Route Handler |
| Webhook from Stripe/GitHub | Route Handler |
| Mobile app API | Route Handler |
| Real-time updates | WebSocket or Server-Sent Events |`,
      },
      {
        title: "Error Handling & Validation",
        slug: "error-handling-validation",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 20,
        order: 2,
        content: `## Error Handling & Validation

Bad error handling is the #1 source of confusing user experiences and security vulnerabilities. Get this right.

### Input Validation with Zod

Never trust client input. Validate everything at the API boundary.

\`\`\`typescript
import { z } from "zod";

// Define your schema
const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.number().int().min(13, "Must be at least 13").optional(),
});

// Use in an API route
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    // Return structured validation errors
    return NextResponse.json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
      // Example: { email: ["Invalid email"], name: ["Too short"] }
    }, { status: 400 });
  }

  // parsed.data is fully typed and validated
  const user = await createUser(parsed.data);
  return NextResponse.json(user, { status: 201 });
}
\`\`\`

### Error Response Standard

Use consistent error responses across your entire API:

\`\`\`typescript
// Standardized error response
type ApiError = {
  error: string;          // Human-readable message
  code: string;           // Machine-readable code (e.g., "USER_NOT_FOUND")
  details?: unknown;      // Additional context (validation errors, etc.)
};

// Helper function
function apiError(message: string, code: string, status: number, details?: unknown) {
  return NextResponse.json({ error: message, code, details }, { status });
}

// Usage
return apiError("User not found", "USER_NOT_FOUND", 404);
return apiError("Rate limit exceeded", "RATE_LIMITED", 429, { retryAfter: 60 });
\`\`\`

### Try-Catch in API Routes

\`\`\`typescript
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    // Log the full error (for you)
    console.error("API error:", error);

    // Return a safe message (for the user)
    // NEVER expose internal error messages — they can reveal
    // database structure, file paths, or other sensitive info
    return NextResponse.json(
      { error: "Something went wrong", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
\`\`\`

### Client-Side Error Handling

\`\`\`tsx
"use client";

async function submitForm(data: FormData) {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const error = await res.json();
      // Show specific validation errors to the user
      if (res.status === 400 && error.details) {
        setFieldErrors(error.details);
        return;
      }
      // Show generic error for other failures
      toast.error(error.error || "Something went wrong");
      return;
    }

    const user = await res.json();
    toast.success("Account created!");
    router.push("/dashboard");
  } catch (error) {
    // Network error — no response at all
    toast.error("Network error. Please check your connection.");
  }
}
\`\`\`

### Security: What NOT to Return

| DO Return | DON'T Return |
|-----------|--------------|
| "Invalid email format" | "SQL error: column 'email' constraint..." |
| "User not found" | "No row in table Users where id=..." |
| "Something went wrong" | Stack traces with file paths |
| Validation field errors | Database schema details |`,
      },
      {
        title: "API Design Quiz",
        slug: "api-design-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## API Design & Integration Quiz

<!--quiz
[
  {
    "question": "You're building a product page that just displays data from your database. What's the simplest pattern in Next.js?",
    "options": [
      "Create an API route, then fetch from the client with useEffect",
      "Use a Server Component and query the database directly",
      "Use getServerSideProps",
      "Create a Server Action"
    ],
    "correctIndex": 1,
    "explanation": "Server Components can access the database directly — no API route, no fetch, no loading state needed. The data is fetched on the server and HTML is sent to the browser. This is the simplest and most performant pattern for displaying data. API routes are for external consumers; Server Actions are for mutations (create/update/delete)."
  },
  {
    "question": "Your API returns this error to the client: 'Error: relation \"users\" does not exist at /app/src/lib/db.ts:42'. What's wrong?",
    "options": [
      "Nothing — detailed errors help debugging",
      "The error exposes internal implementation details (database type, file paths, table names) which is a security risk",
      "The error message is too long",
      "It should return a 404 instead"
    ],
    "correctIndex": 1,
    "explanation": "Internal error details (database engine, table names, file paths, line numbers) reveal your tech stack to attackers. They can use this to craft targeted attacks — knowing your database type helps with SQL injection, knowing file paths helps find config files. Always return a generic message to clients and log the full error server-side."
  },
  {
    "question": "When should you use Zod validation in your API routes?",
    "options": [
      "Only for POST requests",
      "Only when users fill out forms",
      "For ALL incoming data — request bodies, query parameters, headers",
      "Only in production"
    ],
    "correctIndex": 2,
    "explanation": "Validate everything at the API boundary. Query parameters can be manipulated (?page=-1&limit=999999), request bodies can contain unexpected fields, and headers can be spoofed. Zod validates and transforms data in one step, giving you a typed, safe object. If you don't validate it, don't trust it."
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
    description: "Unit tests, integration tests, E2E testing with Playwright, testing API routes, and test-driven development.",
    order: 6,
    sections: [
      {
        title: "Testing Strategy for Full Stack Apps",
        slug: "testing-strategy",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Testing Strategy for Full Stack Apps

A full-stack app has multiple layers that need different testing approaches. Here's how to test each layer effectively.

### The Testing Pyramid

\`\`\`
         /  E2E  \\         ← Few (5-10): slow, expensive, test user flows
        / Integr.  \\       ← Some (20-50): test layers together
       /   Unit     \\      ← Many (100+): fast, focused, isolated
      /______________\\
\`\`\`

### Unit Tests — Testing Functions in Isolation

\`\`\`typescript
// utils/format.ts
export function formatPrice(cents: number): string {
  return \`£\${(cents / 100).toFixed(2)}\`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// utils/format.test.ts
import { describe, it, expect } from "vitest";
import { formatPrice, slugify } from "./format";

describe("formatPrice", () => {
  it("converts cents to pounds", () => {
    expect(formatPrice(1099)).toBe("£10.99");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("£0.00");
  });

  it("handles single-digit pence", () => {
    expect(formatPrice(5)).toBe("£0.05");
  });
});

describe("slugify", () => {
  it("converts to lowercase with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World? #2")).toBe("hello-world-2");
  });

  it("trims hyphens from edges", () => {
    expect(slugify("-hello-")).toBe("hello");
  });
});
\`\`\`

### Integration Tests — Testing API Routes

\`\`\`typescript
// __tests__/api/products.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/products/route";
import { NextRequest } from "next/server";

describe("GET /api/products", () => {
  it("returns paginated products", async () => {
    const req = new NextRequest("http://localhost/api/products?page=1&limit=10");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(10);
  });

  it("clamps limit to maximum 100", async () => {
    const req = new NextRequest("http://localhost/api/products?limit=9999");
    const res = await GET(req);
    const data = await res.json();

    expect(data.pagination.limit).toBeLessThanOrEqual(100);
  });
});

describe("POST /api/products", () => {
  it("rejects unauthenticated requests", async () => {
    const req = new NextRequest("http://localhost/api/products", {
      method: "POST",
      body: JSON.stringify({ name: "Test", price: 10 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
\`\`\`

### E2E Tests — Testing Real User Flows

\`\`\`typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test("user can sign up and see dashboard", async ({ page }) => {
  // Navigate to signup
  await page.goto("/signup");

  // Fill out the form
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "SecurePass123!");
  await page.fill('[name="name"]', "Test User");

  // Submit
  await page.click('button[type="submit"]');

  // Should redirect to dashboard
  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByText("Welcome, Test User")).toBeVisible();
});

test("protected route redirects to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
});
\`\`\`

### What to Test at Each Layer

| Layer | Test Type | What to Test |
|-------|-----------|-------------|
| Utility functions | Unit | Pure logic, formatting, calculations |
| API routes | Integration | Auth, validation, response codes, data shape |
| Database operations | Integration | CRUD, constraints, transactions |
| User flows | E2E | Sign up, purchase, settings changes |
| Error states | All levels | Invalid input, network errors, edge cases |`,
      },
      {
        title: "Testing Quiz",
        slug: "testing-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 8,
        order: 2,
        content: `## Full Stack Testing Quiz

<!--quiz
[
  {
    "question": "You have a formatPrice(cents) utility function. What kind of test should you write?",
    "options": [
      "E2E test — render a page and check the displayed price",
      "Unit test — test the function directly with various inputs",
      "Integration test — test it through an API route",
      "Manual test — check it in the browser"
    ],
    "correctIndex": 1,
    "explanation": "Pure utility functions with no dependencies are perfect for unit tests. They're fast (milliseconds), focused (test one thing), and reliable (no network, no database). Test normal cases, edge cases (0, negative numbers), and boundary conditions. Unit tests are the foundation of your test pyramid — write many of them."
  },
  {
    "question": "Which testing approach catches the most real-world bugs in a full-stack app?",
    "options": [
      "100% unit test coverage",
      "A balanced mix: many unit tests, some integration tests, and a few critical E2E tests",
      "Only E2E tests that cover every user flow",
      "Manual testing before each release"
    ],
    "correctIndex": 1,
    "explanation": "The testing pyramid works because each layer catches different bugs. Unit tests catch logic errors (fast, many). Integration tests catch API/database issues (moderate speed, some). E2E tests catch UI/flow bugs (slow, few critical paths). Only unit tests misses integration issues. Only E2E tests is too slow and fragile. The balanced mix gives the best coverage per time invested."
  }
]
-->`,
      },
    ],
  },
];
