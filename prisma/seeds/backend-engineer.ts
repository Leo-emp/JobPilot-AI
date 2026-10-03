/* ============================================================
   BACKEND ENGINEER WORKSHOP — Seed Content
   ============================================================
   # Full backend engineering curriculum: APIs, databases, auth,
   # caching, message queues, observability, and security.
   ============================================================ */

export const backendEngineerModules = [
  /* ============================================================
     MODULE 1: API Design
     ============================================================ */
  {
    name: "API Design",
    slug: "api-design",
    description: "REST best practices, GraphQL fundamentals, API versioning, rate limiting, and documentation — with real examples.",
    order: 1,
    sections: [
      {
        title: "REST API Design Principles",
        slug: "rest-api-design",
        type: "lesson" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## REST API Design Principles

REST (Representational State Transfer) is the most common API architecture. A well-designed REST API is intuitive, consistent, and predictable.

### The Six Constraints

1. **Client-Server** — Frontend and backend are separate. The API doesn't care what the client looks like.
2. **Stateless** — Each request contains everything the server needs. No "remember my last request."
3. **Cacheable** — Responses should say whether they can be cached (and for how long).
4. **Uniform Interface** — Consistent URL patterns, HTTP methods, and response formats.
5. **Layered System** — Client doesn't know (or care) if it's hitting a load balancer, cache, or the actual server.
6. **Code on Demand** (optional) — Server can send executable code to the client (rarely used).

### URL Design

**Resources are nouns, not verbs:**

| Bad | Good |
|-----|------|
| GET /getUsers | GET /users |
| POST /createUser | POST /users |
| PUT /updateUser/123 | PUT /users/123 |
| DELETE /deleteUser/123 | DELETE /users/123 |

**Nesting for relationships:**
\`\`\`
GET  /users/123/orders          # All orders for user 123
GET  /users/123/orders/456      # Order 456 for user 123
POST /users/123/orders          # Create a new order for user 123
\`\`\`

**Don't nest more than 2 levels deep:**
\`\`\`
# Bad — too deeply nested
GET /users/123/orders/456/items/789/reviews

# Good — flatten it
GET /order-items/789/reviews
\`\`\`

### HTTP Methods

| Method | Purpose | Idempotent? | Request Body? |
|--------|---------|-------------|---------------|
| GET | Read a resource | Yes | No |
| POST | Create a resource | No | Yes |
| PUT | Replace a resource entirely | Yes | Yes |
| PATCH | Partially update a resource | No* | Yes |
| DELETE | Remove a resource | Yes | No |

*PATCH is technically not guaranteed idempotent, though many implementations make it so.

**Idempotent** means calling it multiple times produces the same result. PUT /users/123 with the same body 10 times = same result. POST /users 10 times = 10 new users.

### Status Codes

**Use the right status code.** Don't return 200 for everything.

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST that created a resource |
| 204 | No Content | Successful DELETE (nothing to return) |
| 400 | Bad Request | Invalid input (validation failed) |
| 401 | Unauthorized | Not authenticated (no/invalid token) |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email already exists) |
| 422 | Unprocessable Entity | Valid JSON but semantically wrong |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Bug in your code |

### Response Format

**Always use consistent response envelopes:**

\`\`\`json
// Success (single resource)
{
  "data": {
    "id": "123",
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}

// Success (collection with pagination)
{
  "data": [
    { "id": "123", "name": "Jane Smith" },
    { "id": "124", "name": "John Doe" }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 145,
    "totalPages": 8
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Email address is invalid",
    "details": [
      { "field": "email", "message": "Must be a valid email address" }
    ]
  }
}
\`\`\`

### Pagination

**Three approaches:**

1. **Offset-based** — \`GET /users?page=2&perPage=20\`
   - Simple, supports jumping to any page
   - Problem: inconsistent if data changes between pages

2. **Cursor-based** — \`GET /users?after=abc123&limit=20\`
   - Consistent results even if data changes
   - Can't jump to page 5 directly
   - Best for infinite scroll, real-time feeds

3. **Keyset-based** — \`GET /users?createdAfter=2024-01-01&limit=20\`
   - Like cursor but uses actual field values
   - Fast with database indexes

**Rule of thumb:** Use cursor-based for real-time feeds and large datasets. Use offset for admin dashboards and UIs with page numbers.

### Filtering, Sorting, and Search

\`\`\`
# Filtering
GET /users?status=active&role=admin

# Sorting (- prefix for descending)
GET /users?sort=-createdAt,name

# Search
GET /users?search=jane

# Combined
GET /users?status=active&sort=-createdAt&page=1&perPage=20
\`\`\`

### Versioning

**Three strategies:**

1. **URL versioning** — \`/api/v1/users\` (most common, easiest)
2. **Header versioning** — \`Accept: application/vnd.api+json;version=1\`
3. **Query param** — \`/api/users?version=1\`

**Best practice:** Use URL versioning. It's visible, cacheable, and easy to understand. Only increment versions for breaking changes. Don't version every release.

### Rate Limiting

Include rate limit headers in every response:

\`\`\`
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1625097600
\`\`\`

When exceeded, return 429 with a Retry-After header:

\`\`\`
HTTP/1.1 429 Too Many Requests
Retry-After: 60
\`\`\``,
      },
      {
        title: "API Design Quiz",
        slug: "api-design-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## REST API Design Quiz

Test your understanding of REST API best practices.

<!--quiz
[
  {
    "question": "A client sends PUT /users/123 with the same body 5 times. How many users should exist after?",
    "options": [
      "5 new users (PUT creates like POST)",
      "1 user — the same one, unchanged after the first call",
      "It depends on the server implementation",
      "0 — PUT is for updates only, not creates"
    ],
    "correctIndex": 1,
    "explanation": "PUT is idempotent — calling it multiple times with the same data produces the same result. The first call creates/replaces the resource at /users/123, and subsequent calls just overwrite it with identical data. This is the key difference from POST, which would create a new resource each time."
  },
  {
    "question": "A user tries to create an account but the email already exists. What status code should the API return?",
    "options": [
      "400 Bad Request",
      "422 Unprocessable Entity",
      "409 Conflict",
      "403 Forbidden"
    ],
    "correctIndex": 2,
    "explanation": "409 Conflict means the request conflicts with the current state of the resource (the email already exists). 400 means the request syntax is wrong. 422 means the data is valid but semantically incorrect. 403 means the user doesn't have permission. A duplicate resource is a conflict."
  },
  {
    "question": "Which pagination approach is best for an infinite-scroll social media feed with new posts arriving constantly?",
    "options": [
      "Offset-based (page=2&perPage=20) — jump to any page",
      "Cursor-based (after=abc123&limit=20) — consistent with changing data",
      "No pagination — return all posts at once",
      "Keyset-based (createdAfter=timestamp) — fast with indexes"
    ],
    "correctIndex": 1,
    "explanation": "Cursor-based pagination is ideal for real-time feeds. With offset-based, if a new post is added while you're on page 2, page 3 might show a duplicate from page 2 (everything shifted). Cursors say 'give me everything after this specific item,' so new items don't affect your position."
  },
  {
    "question": "What's wrong with this endpoint: POST /api/getUserOrders?userId=123",
    "options": [
      "Nothing — it works fine",
      "Resources should be nouns (not verbs), and POST should not be used for reading data",
      "The userId should be in the request body, not the URL",
      "It should use PATCH instead of POST"
    ],
    "correctIndex": 1,
    "explanation": "Two REST violations: (1) 'getUserOrders' is a verb — REST URLs should be nouns: /users/123/orders. (2) POST is for creating resources, not reading them. This should be GET /users/123/orders. The URL pattern tells you exactly what you're getting without reading documentation."
  },
  {
    "question": "An authenticated user tries to access an admin-only endpoint. What status code should be returned?",
    "options": [
      "401 Unauthorized — they can't access this",
      "403 Forbidden — authenticated but not authorized",
      "404 Not Found — pretend the endpoint doesn't exist",
      "400 Bad Request — wrong request"
    ],
    "correctIndex": 1,
    "explanation": "403 Forbidden means 'I know who you are, but you don't have permission.' 401 means 'I don't know who you are' (not authenticated). The distinction matters: 401 tells the client to log in, 403 tells them they need different permissions. Some APIs return 404 to hide the endpoint's existence (a valid security choice), but 403 is the semantically correct answer."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 2: Database Design
     ============================================================ */
  {
    name: "Database Design",
    slug: "database-design",
    description: "Schema design, normalization, indexing strategy, query optimization, migrations, and choosing between SQL vs NoSQL.",
    order: 2,
    sections: [
      {
        title: "Schema Design & Normalization",
        slug: "schema-design-normalization",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## Database Schema Design & Normalization

Good schema design is the foundation of every performant application. Get it wrong, and no amount of optimization will save you.

### Normal Forms (Simplified)

**1NF (First Normal Form):**
- Each column contains only atomic (indivisible) values
- No repeating groups

**Bad (not 1NF):**
| id | name | phone_numbers |
|----|------|---------------|
| 1 | Jane | 555-1234, 555-5678 |

**Good (1NF):**
| id | name | phone_number |
|----|------|-------------|
| 1 | Jane | 555-1234 |
| 1 | Jane | 555-5678 |

Or better: a separate phone_numbers table.

**2NF (Second Normal Form):**
- Is in 1NF
- Every non-key column depends on the entire primary key (no partial dependencies)

**3NF (Third Normal Form):**
- Is in 2NF
- No transitive dependencies (column A depends on column B which depends on the key)

**Bad (not 3NF):**
| order_id | customer_id | customer_name | customer_email |
|----------|------------|---------------|----------------|

customer_name and customer_email depend on customer_id, not order_id. They belong in a customers table.

**Good (3NF):**
\`\`\`sql
-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customers table (separate)
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE
);
\`\`\`

### When to Denormalize

Normalization isn't always the answer. Sometimes you intentionally duplicate data for performance.

**Denormalize when:**
- You're doing expensive JOINs on every read (and reads >> writes)
- You need to display aggregated data frequently (e.g., order total, comment count)
- You're building a read-heavy analytics/reporting system

**Keep normalized when:**
- Data integrity is critical (financial systems, user accounts)
- Writes are frequent and must be consistent
- Storage is a concern

### Indexing Strategy

**What is an index?** It's like a book's index — instead of reading every page to find "PostgreSQL," you look it up in the index and jump to the right page.

**When to add an index:**
- Columns used in WHERE clauses frequently
- Columns used in JOIN conditions
- Columns used in ORDER BY
- Columns with high cardinality (many unique values)

**When NOT to index:**
- Small tables (< 1,000 rows) — full table scan is faster
- Columns with low cardinality (e.g., boolean, status with 3 values)
- Tables with heavy writes — each write must update the index too

**Types of indexes:**
\`\`\`sql
-- B-tree (default, good for =, <, >, BETWEEN, ORDER BY)
CREATE INDEX idx_users_email ON users(email);

-- Unique index (B-tree + uniqueness constraint)
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Composite index (multiple columns — order matters!)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
-- This helps: WHERE user_id = 123 AND created_at > '2024-01-01'
-- This helps: WHERE user_id = 123 (leftmost prefix)
-- This does NOT help: WHERE created_at > '2024-01-01' (skips first column)

-- Partial index (only index rows matching a condition)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
\`\`\`

### SQL vs NoSQL Decision Guide

| Factor | SQL (PostgreSQL, MySQL) | NoSQL (MongoDB, DynamoDB) |
|--------|------------------------|--------------------------|
| Data structure | Known, relational | Flexible, evolving |
| Relationships | Many, complex JOINs | Few or embedded |
| Consistency | ACID required | Eventual consistency OK |
| Query patterns | Complex, ad-hoc queries | Simple key-value lookups |
| Scale | Vertical (bigger server) | Horizontal (more servers) |
| Examples | E-commerce, banking, CRM | Real-time analytics, IoT, content |

**Default to SQL** unless you have a specific reason to use NoSQL. Most applications benefit from relational data and ACID guarantees.`,
      },
      {
        title: "Query Optimization — Finding & Fixing Slow Queries",
        slug: "query-optimization",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 2,
        content: `## Query Optimization

A slow query can bring down your entire application. Learning to identify and fix them is a critical backend skill.

### EXPLAIN — Your Best Friend

Every database has an EXPLAIN command that shows how a query will be executed.

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC LIMIT 20;
\`\`\`

**What to look for:**
| Indicator | Good | Bad |
|-----------|------|-----|
| Scan type | Index Scan | Seq Scan (full table scan) |
| Rows examined | Close to rows returned | Much higher than rows returned |
| Execution time | < 100ms | > 1 second |
| Sort | Index-based sort | In-memory sort on large datasets |

### Common Slow Query Patterns & Fixes

**1. Missing index on WHERE clause:**
\`\`\`sql
-- SLOW: Full table scan on 10M rows
SELECT * FROM orders WHERE status = 'pending';

-- FIX: Add an index
CREATE INDEX idx_orders_status ON orders(status);
\`\`\`

**2. Using SELECT * when you need 2 columns:**
\`\`\`sql
-- SLOW: Fetches all 20 columns from disk
SELECT * FROM users WHERE id = 123;

-- FAST: Only fetches what you need (can use covering index)
SELECT name, email FROM users WHERE id = 123;
\`\`\`

**3. N+1 query problem:**
\`\`\`sql
-- SLOW: 101 queries for 100 posts
SELECT * FROM posts LIMIT 100;
-- Then for EACH post:
SELECT * FROM users WHERE id = ?;

-- FAST: 2 queries
SELECT * FROM posts LIMIT 100;
SELECT * FROM users WHERE id IN (1, 2, 3, ...);
-- Or: JOIN
SELECT p.*, u.name FROM posts p JOIN users u ON p.user_id = u.id LIMIT 100;
\`\`\`

**4. Wildcard at the beginning of LIKE:**
\`\`\`sql
-- SLOW: Can't use index (must scan every row)
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- FAST: Index can be used (prefix search)
SELECT * FROM users WHERE email LIKE 'jane%';
\`\`\`

**5. Functions on indexed columns:**
\`\`\`sql
-- SLOW: Index on created_at is useless (function applied first)
SELECT * FROM orders WHERE YEAR(created_at) = 2024;

-- FAST: Range query uses the index
SELECT * FROM orders WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
\`\`\`

### Pagination Performance

\`\`\`sql
-- SLOW for deep pages: OFFSET 10000 scans and discards 10,000 rows
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000;

-- FAST: Cursor-based (keyset) pagination
SELECT * FROM posts
WHERE created_at < '2024-06-15T10:30:00'
ORDER BY created_at DESC LIMIT 20;
\`\`\`

### Database Query Optimization Checklist

| Check | Action |
|-------|--------|
| Slow query log enabled? | Enable slow query logging (>100ms threshold) |
| EXPLAIN shows Seq Scan? | Add appropriate index |
| SELECT *? | Select only needed columns |
| N+1 queries? | Use JOINs or batch loading (IN clause) |
| Sorting large datasets? | Create index matching ORDER BY |
| Deep pagination (OFFSET > 1000)? | Switch to cursor-based pagination |
| Counting rows frequently? | Cache the count or use estimates |`,
      },
      {
        title: "Database Design Quiz",
        slug: "database-design-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 3,
        content: `## Database Design Quiz

<!--quiz
[
  {
    "question": "Your users table has 10 million rows and this query is slow: SELECT * FROM users WHERE email = 'jane@example.com'. What's the most likely fix?",
    "options": [
      "Add more RAM to the database server",
      "Create an index on the email column",
      "Partition the table by email prefix",
      "Switch from SQL to NoSQL"
    ],
    "correctIndex": 1,
    "explanation": "Without an index on email, the database must scan all 10 million rows (sequential scan) to find the matching email. An index on email makes this an O(log n) lookup — about 23 comparisons instead of 10 million. This is the single most common performance fix in databases. CREATE UNIQUE INDEX idx_users_email ON users(email);"
  },
  {
    "question": "You have a composite index on (user_id, created_at). Which query can use this index?",
    "options": [
      "WHERE created_at > '2024-01-01' (skips first column)",
      "WHERE user_id = 123 AND created_at > '2024-01-01' (uses both columns)",
      "WHERE created_at > '2024-01-01' AND user_id = 123 (wrong order)",
      "Both B and C can use the index"
    ],
    "correctIndex": 3,
    "explanation": "Composite indexes follow the leftmost prefix rule: the index on (user_id, created_at) can be used for queries that include user_id, regardless of the WHERE clause order (the query optimizer reorders conditions). Both B and C include user_id, so both use the index. Option A skips user_id entirely, so the index can't be used."
  },
  {
    "question": "When should you denormalize your database (intentionally duplicate data)?",
    "options": [
      "Always — normalized databases are slower",
      "Never — duplicated data always causes inconsistencies",
      "When read performance matters more than write consistency and you read far more than you write",
      "When you have more than 100 tables"
    ],
    "correctIndex": 2,
    "explanation": "Denormalization trades write complexity for read performance. It makes sense when: (1) you read far more than you write (e.g., 100:1 read/write ratio), (2) the JOINs are expensive and frequent, and (3) you can tolerate eventual consistency on the duplicated data. Example: storing a user's name on every post to avoid JOINing the users table on every feed render."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 3: Authentication & Authorization
     ============================================================ */
  {
    name: "Authentication & Authorization",
    slug: "auth-patterns",
    description: "JWT, OAuth 2.0, session management, RBAC, API key security, and common auth vulnerabilities.",
    order: 3,
    sections: [
      {
        title: "JWT & Session-Based Auth",
        slug: "jwt-session-auth",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Authentication: JWT vs Session-Based

Authentication answers "who are you?" Authorization answers "what can you do?"

### Session-Based Authentication

**How it works:**
1. User sends username + password
2. Server creates a session (stored in DB or memory), generates a session ID
3. Server sends session ID as an HTTP-only cookie
4. Browser automatically sends the cookie with every request
5. Server looks up the session ID to find the user

**Pros:**
- Simple to implement
- Easy to revoke (delete the session from the server)
- Server has full control over active sessions

**Cons:**
- Requires server-side storage (DB or Redis)
- Harder to scale across multiple servers (sticky sessions or shared store)
- Not great for mobile apps or third-party APIs

### JWT (JSON Web Token) Authentication

**How it works:**
1. User sends username + password
2. Server creates a JWT containing user data, signs it with a secret key
3. Server sends the JWT to the client
4. Client stores it (localStorage, cookie, or memory) and sends it in the Authorization header
5. Server verifies the signature — no database lookup needed

**JWT Structure:**

\`\`\`
Header.Payload.Signature

// Header (algorithm + type)
{ "alg": "HS256", "typ": "JWT" }

// Payload (claims — data about the user)
{ "sub": "user_123", "email": "jane@example.com", "role": "admin", "exp": 1735689600 }

// Signature
HMACSHA256(base64(header) + "." + base64(payload), secret)
\`\`\`

**Pros:**
- Stateless — server doesn't store anything
- Scales easily across multiple servers
- Works great for APIs, mobile apps, microservices

**Cons:**
- Can't be revoked without extra infrastructure (blacklist)
- Token size is larger than a session ID
- If stolen, valid until expiration

### Security Best Practices

| Practice | Why |
|----------|-----|
| Use HTTP-only cookies for tokens | Prevents XSS from reading the token |
| Set Secure flag on cookies | Only sent over HTTPS |
| Use short expiration (15 min) + refresh tokens | Limits damage if token is stolen |
| Never store secrets in JWT payload | JWTs are base64-encoded, NOT encrypted — anyone can read the payload |
| Rotate signing keys periodically | Limits blast radius of key compromise |
| Use bcrypt/argon2 for password hashing | Resistant to brute force and rainbow tables |

### OAuth 2.0 (Third-Party Login)

OAuth lets users log in with Google/GitHub/etc. without sharing their password with your app.

**Flow (Authorization Code — most secure):**
1. User clicks "Login with Google"
2. Your app redirects to Google's auth page
3. User logs in at Google, grants permission
4. Google redirects back to your app with an authorization code
5. Your server exchanges the code for an access token (server-to-server)
6. Your server uses the token to fetch user profile from Google
7. Your server creates a session/JWT for the user

### RBAC (Role-Based Access Control)

**Simple approach:**

\`\`\`typescript
// Define roles and permissions
const PERMISSIONS = {
  admin: ["read", "write", "delete", "manage_users"],
  editor: ["read", "write"],
  viewer: ["read"],
};

// Middleware
function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    if (!PERMISSIONS[userRole]?.includes(permission)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

// Usage
app.delete("/posts/:id", requirePermission("delete"), deletePost);
\`\`\``,
      },
      {
        title: "Auth & Authorization Quiz",
        slug: "auth-authorization-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Authentication & Authorization Quiz

<!--quiz
[
  {
    "question": "What's the key difference between authentication and authorization?",
    "options": [
      "They're the same thing — both check passwords",
      "Authentication verifies WHO you are (identity). Authorization verifies WHAT you're allowed to do (permissions).",
      "Authentication is for APIs, authorization is for web pages",
      "Authentication uses tokens, authorization uses passwords"
    ],
    "correctIndex": 1,
    "explanation": "Authentication = identity (who are you? — login, JWT, OAuth). Authorization = permissions (what can you do? — role-based access, resource ownership checks). A logged-in user (authenticated) might still be forbidden from deleting other users' data (not authorized). Every protected endpoint needs BOTH checks."
  },
  {
    "question": "Your JWT access tokens last 30 days. A user's account is compromised. Why is this dangerous?",
    "options": [
      "30-day tokens are actually fine — they're encrypted",
      "The attacker has access for up to 30 days because the token is valid even after the password is changed — there's no way to revoke it",
      "The token will automatically expire when the password changes",
      "JWTs can be remotely invalidated by the server"
    ],
    "correctIndex": 1,
    "explanation": "JWTs are self-contained — the server doesn't need to check a database to validate them. This means you CAN'T revoke a JWT once issued (unlike session tokens). If a 30-day JWT is stolen, the attacker has 30 days of access even if the password is changed. Best practice: short-lived access tokens (15 min) + refresh tokens. Or use a token blocklist (but then you lose the stateless benefit)."
  },
  {
    "question": "A user can view their own profile at GET /users/123. They change the URL to GET /users/456 and see another user's data. What vulnerability is this?",
    "options": [
      "Cross-Site Scripting (XSS)",
      "SQL Injection",
      "Insecure Direct Object Reference (IDOR) — missing authorization check on resource ownership",
      "Cross-Site Request Forgery (CSRF)"
    ],
    "correctIndex": 2,
    "explanation": "IDOR is when a user can access resources by guessing or changing IDs in the URL, and the server doesn't verify they're allowed to access that resource. Fix: always check that the authenticated user owns or has permission to access the requested resource. Never rely solely on the ID in the URL — always verify: 'Does user X have access to resource Y?'"
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 4: Caching & Performance
     ============================================================ */
  {
    name: "Caching & Performance",
    slug: "caching-performance",
    description: "Redis, CDNs, HTTP caching, database query optimization, connection pooling, and N+1 query detection.",
    order: 4,
    sections: [
      {
        title: "Caching Strategies",
        slug: "caching-strategies",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Caching Strategies

Caching is the single most impactful performance optimization. The fastest database query is the one you never make.

### Cache Layers

From fastest to slowest:
1. **Browser cache** — HTTP cache headers (no network request at all)
2. **CDN cache** — edge servers close to the user (Cloudflare, Vercel Edge)
3. **Application cache** — in-memory (Redis, Memcached)
4. **Database cache** — query cache, materialized views

### Cache-Aside (Lazy Loading)

The most common pattern. Application checks cache first, falls back to database.

\`\`\`typescript
async function getUser(userId: string) {
  // 1. Check cache first
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) return JSON.parse(cached);

  // 2. Cache miss — fetch from database
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  // 3. Populate cache for next time (TTL: 1 hour)
  await redis.set(\`user:\${userId}\`, JSON.stringify(user), "EX", 3600);

  return user;
}
\`\`\`

**Pros:** Only caches data that's actually requested
**Cons:** First request is always slow (cache miss). Stale data possible.

### Write-Through

Write to cache AND database simultaneously on every write.

\`\`\`typescript
async function updateUser(userId: string, data: UserUpdate) {
  // 1. Update database
  const user = await db.user.update({ where: { id: userId }, data });

  // 2. Update cache immediately
  await redis.set(\`user:\${userId}\`, JSON.stringify(user), "EX", 3600);

  return user;
}
\`\`\`

**Pros:** Cache is always fresh
**Cons:** Every write hits both cache and DB (slower writes). May cache data that's rarely read.

### Cache Invalidation

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

**Strategies:**
1. **TTL (Time to Live)** — cache expires after N seconds. Simple but may serve stale data.
2. **Event-based invalidation** — delete cache when data changes. Accurate but complex.
3. **Write-through** — update cache on every write. Always fresh but more write overhead.

### The N+1 Query Problem

**The bug:** You fetch a list of items, then make a separate query for each item's related data.

\`\`\`typescript
// BAD — N+1 queries (1 query for posts + N queries for authors)
const posts = await db.post.findMany(); // 1 query
for (const post of posts) {
  const author = await db.user.findUnique({ where: { id: post.authorId } }); // N queries
}

// GOOD — 2 queries total (eager loading / JOIN)
const posts = await db.post.findMany({
  include: { author: true }, // Prisma joins automatically
});
\`\`\`

If you have 100 posts, the bad version makes 101 database queries. The good version makes 1-2.

### HTTP Cache Headers

\`\`\`
// Static assets — cache for 1 year (immutable)
Cache-Control: public, max-age=31536000, immutable

// API responses — cache for 60 seconds, revalidate after
Cache-Control: public, max-age=60, stale-while-revalidate=30

// Private data — only browser can cache, not CDNs
Cache-Control: private, max-age=300

// Never cache (auth endpoints, user-specific data)
Cache-Control: no-store
\`\`\``,
      },
      {
        title: "Caching & Performance Quiz",
        slug: "caching-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Caching & Performance Quiz

<!--quiz
[
  {
    "question": "You cache user profiles in Redis. A user updates their name, but old data keeps appearing. What pattern solves this?",
    "options": [
      "Increase the cache TTL (time-to-live)",
      "Cache invalidation — delete or update the cache entry when the source data changes",
      "Stop using caching entirely",
      "Add a second cache layer"
    ],
    "correctIndex": 1,
    "explanation": "When the source data changes, the cache must be invalidated (deleted or updated). The most common strategy is 'cache-aside with invalidation': read from cache (hit → return), on miss → read from DB → store in cache. On write → update DB → delete cache entry. The next read will fetch fresh data and re-cache it. Never rely on TTL alone for data that users actively modify."
  },
  {
    "question": "Your API endpoint hits the database with N+1 queries: 1 query for a list of 100 posts, then 100 separate queries for each post's author. How do you fix this?",
    "options": [
      "Add more database indexes",
      "Use eager loading / joins — fetch posts AND their authors in a single query (Prisma: include: { author: true })",
      "Cache all the authors in Redis",
      "Increase the database connection pool size"
    ],
    "correctIndex": 1,
    "explanation": "N+1 is the most common backend performance problem. Instead of 101 queries, use a JOIN (SQL) or eager loading (ORM) to fetch everything in 1-2 queries. In Prisma: findMany({ include: { author: true } }). This can turn a 500ms endpoint into a 5ms endpoint. Caching and indexes help but don't fix the fundamental problem of making 101 queries when 1 would do."
  },
  {
    "question": "What's the correct Cache-Control header for a user's private dashboard data?",
    "options": [
      "Cache-Control: public, max-age=86400",
      "Cache-Control: private, no-store",
      "Cache-Control: public, s-maxage=3600",
      "No header needed — browsers don't cache API responses"
    ],
    "correctIndex": 1,
    "explanation": "'private' means only the user's browser can cache it (not CDNs or shared proxies). 'no-store' means don't cache at all — appropriate for sensitive user data that changes frequently. 'public' would allow CDNs to cache it, meaning User A might see User B's dashboard. NEVER use 'public' for user-specific or sensitive data."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 5: Security
     ============================================================ */
  {
    name: "Backend Security",
    slug: "backend-security",
    description: "OWASP Top 10, input validation, SQL injection, XSS, CSRF, rate limiting, and security headers.",
    order: 5,
    sections: [
      {
        title: "OWASP Top 10 for Backend Engineers",
        slug: "owasp-top-10",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 30,
        order: 1,
        content: `## OWASP Top 10 for Backend Engineers

The OWASP Top 10 is the most important security checklist for web applications. Every backend engineer must know these vulnerabilities and how to prevent them.

### 1. Injection (SQL, NoSQL, OS Command)

**What:** Attacker inserts malicious code into your queries.

**SQL Injection Example:**
\`\`\`typescript
// VULNERABLE — user input directly in query
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
// Attacker sends: ' OR '1'='1
// Result: SELECT * FROM users WHERE email = '' OR '1'='1'
// Returns ALL users!

// SAFE — parameterized query
const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

// SAFE — ORM (Prisma, TypeORM)
const user = await prisma.user.findUnique({ where: { email } });
\`\`\`

**Prevention:**
- Always use parameterized queries or an ORM
- Never concatenate user input into SQL
- Validate and sanitize all inputs

### 2. Broken Authentication

**Common mistakes:**
- Allowing weak passwords (no minimum length/complexity)
- Not implementing rate limiting on login attempts
- Exposing session IDs in URLs
- Not expiring sessions after inactivity

**Prevention:**
- Enforce strong password policies
- Use bcrypt/argon2 with appropriate cost factor (≥12 rounds)
- Implement account lockout after N failed attempts
- Use secure, HTTP-only cookies for session tokens

### 3. Broken Access Control

**What:** Users access resources they shouldn't.

\`\`\`typescript
// VULNERABLE — no authorization check
app.get("/api/users/:id/billing", async (req, res) => {
  const billing = await db.billing.findUnique({ where: { userId: req.params.id } });
  res.json(billing); // Any user can see any user's billing!
});

// SAFE — verify the user is accessing their own data
app.get("/api/users/:id/billing", async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  const billing = await db.billing.findUnique({ where: { userId: req.params.id } });
  res.json(billing);
});
\`\`\`

### 4. Cross-Site Scripting (XSS)

**What:** Attacker injects JavaScript that runs in other users' browsers.

**Prevention:**
- Escape all output (use templating engines that auto-escape)
- Set Content-Security-Policy headers
- Use HTTP-only cookies (JavaScript can't read them)
- Validate and sanitize all user input

### 5. Security Misconfiguration

**Common mistakes:**
- Default credentials left in production
- Debug mode enabled in production
- Unnecessary HTTP methods enabled (TRACE, OPTIONS)
- Missing security headers
- Exposing stack traces in error responses

**Essential security headers:**
\`\`\`typescript
// Set these on every response
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
\`\`\`

### 6. Sensitive Data Exposure

**Rules:**
- Never log passwords, tokens, or API keys
- Never return sensitive data in API responses unless necessary
- Encrypt sensitive data at rest (database encryption)
- Always use HTTPS (TLS) in production
- Mask sensitive data in logs (\`email: j***@example.com\`)

### Backend Security Checklist

| Category | Check |
|----------|-------|
| Input | All user input validated and sanitized |
| Auth | Passwords hashed with bcrypt/argon2 (≥12 rounds) |
| Auth | Rate limiting on login and registration |
| Auth | JWT tokens expire in ≤15 minutes |
| Access | Every endpoint checks authorization |
| Access | Users can only access their own data (IDOR protection) |
| Headers | All security headers set |
| Secrets | No secrets in code, logs, or error messages |
| API | Rate limiting on all public endpoints |
| Database | Parameterized queries or ORM (no raw SQL concatenation) |`,
      },
      {
        title: "Backend Security Quiz",
        slug: "backend-security-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Backend Security Quiz

<!--quiz
[
  {
    "question": "A user submits this in a search form: ' OR 1=1 --'. Your backend runs: SELECT * FROM users WHERE name = '[user_input]'. What happens?",
    "options": [
      "Nothing — modern databases are immune to this",
      "SQL injection — the query becomes SELECT * FROM users WHERE name = '' OR 1=1 -- and returns ALL users",
      "The search returns no results",
      "The database throws a syntax error"
    ],
    "correctIndex": 1,
    "explanation": "This is classic SQL injection. The injected ' OR 1=1 -- closes the string, adds a condition that's always true (1=1), and comments out the rest (--). The query returns ALL users. Fix: NEVER concatenate user input into SQL. Use parameterized queries (SELECT * FROM users WHERE name = ?) or an ORM like Prisma that parameterizes automatically."
  },
  {
    "question": "Your API error handler returns: { error: 'QueryFailedError: relation \"users\" does not exist', stack: 'at /app/src/db.ts:42' }. What's wrong?",
    "options": [
      "Nothing — detailed errors help developers debug issues",
      "The error message leaks internal details (database engine, table names, file paths) that attackers can use to plan further attacks",
      "The error should be in a different format",
      "The status code is probably wrong"
    ],
    "correctIndex": 1,
    "explanation": "Internal error details reveal your tech stack to attackers. Database table names help with SQL injection. File paths help locate configuration. Stack traces reveal framework versions with known vulnerabilities. ALWAYS: log the full error server-side (for your debugging), return a generic message to the client ('Something went wrong'). In production, never expose stack traces or database details."
  },
  {
    "question": "Which security header prevents your site from being embedded in an iframe on a malicious site (clickjacking)?",
    "options": [
      "Content-Security-Policy: default-src 'self'",
      "X-Frame-Options: DENY (or Content-Security-Policy: frame-ancestors 'none')",
      "X-XSS-Protection: 1; mode=block",
      "Strict-Transport-Security: max-age=31536000"
    ],
    "correctIndex": 1,
    "explanation": "X-Frame-Options: DENY prevents your page from being loaded in any iframe. The modern equivalent is Content-Security-Policy: frame-ancestors 'none'. Clickjacking works by loading your page in an invisible iframe, overlaid with a fake UI — the user thinks they're clicking a button on the attacker's page but actually clicking on your page. Frame-busting headers prevent this entirely."
  }
]
-->`,
      },
    ],
  },
  /* ============================================================
     MODULE 6: Message Queues & Background Jobs
     ============================================================ */
  {
    name: "Message Queues & Background Jobs",
    slug: "message-queues",
    description: "When to use queues, Redis/BullMQ patterns, event-driven architecture, and reliable job processing.",
    order: 6,
    sections: [
      {
        title: "When and How to Use Message Queues",
        slug: "message-queue-patterns",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 25,
        order: 1,
        content: `## Message Queues & Background Jobs

Not everything should happen during the API request. Long-running tasks, notifications, and data processing should happen in the background.

### When to Use a Queue

**Rule of thumb:** If a task takes >500ms or isn't needed for the API response, put it in a queue.

**Common queue tasks:**
- Sending emails (welcome email, password reset)
- Processing file uploads (resize images, generate thumbnails)
- PDF generation
- Sending webhooks to external services
- Data aggregation and analytics
- Search index updates

### The Producer-Consumer Pattern

\`\`\`
Producer (API) → Queue (Redis/RabbitMQ) → Consumer (Worker)

1. API receives request to send a welcome email
2. API adds a job to the queue: { type: "send_email", userId: 123 }
3. API immediately returns 202 Accepted to the client
4. Worker picks up the job from the queue
5. Worker sends the email
6. Worker marks the job as completed
\`\`\`

### Reliability Patterns

**At-least-once delivery:** The job will be processed at least once (may be processed twice if the worker crashes mid-processing). Your handler must be idempotent.

\`\`\`typescript
// IDEMPOTENT — safe to run multiple times
async function sendWelcomeEmail(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });

  // Check if already sent (idempotency)
  if (user.welcomeEmailSentAt) return;

  await emailService.send(user.email, "Welcome!");
  await db.user.update({
    where: { id: userId },
    data: { welcomeEmailSentAt: new Date() },
  });
}
\`\`\`

**Retry with exponential backoff:**
\`\`\`
Attempt 1: immediate
Attempt 2: wait 1 second
Attempt 3: wait 4 seconds
Attempt 4: wait 16 seconds
Attempt 5: wait 64 seconds → move to Dead Letter Queue
\`\`\`

### Dead Letter Queue (DLQ)

Jobs that fail after all retries go to a Dead Letter Queue for manual inspection. Never silently drop failed jobs.

### Event-Driven Architecture

Instead of direct calls between services, services emit events that other services can subscribe to.

\`\`\`
// Direct (tightly coupled)
OrderService → calls → EmailService
OrderService → calls → InventoryService
OrderService → calls → AnalyticsService

// Event-driven (loosely coupled)
OrderService → emits "order.created" event
  → EmailService listens → sends confirmation email
  → InventoryService listens → updates stock
  → AnalyticsService listens → records the sale
\`\`\`

**Benefits:**
- Services don't know about each other (loose coupling)
- Easy to add new consumers without changing the producer
- If a consumer is down, events queue up and process when it recovers`,
      },
      {
        title: "Message Queues Quiz",
        slug: "message-queues-quiz",
        type: "quiz" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## Message Queues & Background Jobs Quiz

<!--quiz
[
  {
    "question": "Your API endpoint sends a welcome email, resizes an avatar, and updates analytics — total time: 3 seconds. Users complain about slow sign-up. What's the fix?",
    "options": [
      "Optimize the email and image code to be faster",
      "Move email, image resize, and analytics to a background queue — return 202 Accepted immediately after creating the user account",
      "Add more servers to handle the load",
      "Make the frontend show a loading spinner"
    ],
    "correctIndex": 1,
    "explanation": "The user only needs the account created (fast, ~200ms). The email, avatar resize, and analytics aren't needed for the response — they should happen asynchronously in a background queue. The API returns 202 Accepted immediately, and the queue processes the tasks in the background. The user sees instant sign-up, and the tasks complete within seconds behind the scenes."
  },
  {
    "question": "A background job to send an email fails because the email service is temporarily down. The job retries and sends the email. Then the original attempt also goes through (delayed). The user gets 2 welcome emails. What went wrong?",
    "options": [
      "The retry logic is broken",
      "The email service has a bug",
      "The job handler isn't idempotent — it should check if the email was already sent before sending again",
      "The queue should use exactly-once delivery"
    ],
    "correctIndex": 2,
    "explanation": "In distributed systems, at-least-once delivery means a job MAY run more than once. Your handler must be idempotent — safe to run multiple times with the same result. Fix: check a flag (user.welcomeEmailSentAt) before sending. If it's already set, skip. This way, even if the job runs 3 times, the email is sent exactly once. Exactly-once delivery is nearly impossible in practice."
  },
  {
    "question": "What is a Dead Letter Queue (DLQ) and why is it essential?",
    "options": [
      "A queue for deleting old messages automatically",
      "A separate queue where jobs go after exhausting all retry attempts — for manual inspection and debugging",
      "A backup queue in case the main queue crashes",
      "A high-priority queue for urgent messages"
    ],
    "correctIndex": 1,
    "explanation": "After a job fails all retry attempts (e.g., 5 tries with exponential backoff), it should NOT be silently dropped — it moves to the Dead Letter Queue. This lets you: inspect what failed, understand why, fix the bug, and replay the failed jobs. Without a DLQ, failed jobs disappear and you never know about data loss. Always have a DLQ and set up alerts when jobs land in it."
  }
]
-->`,
      },
    ],
  },
];
