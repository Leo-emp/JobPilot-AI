/* ============================================================
   SYNC DB - Push schema changes to production Turso
   ============================================================
   Runs during Vercel builds to ensure the production database
   has all columns and tables that the Prisma schema expects.
   Uses ALTER TABLE ADD COLUMN (safe — never drops data).
   ============================================================ */

import { createClient } from "@libsql/client";

const SCHEMA = {
  User: {
    id: "TEXT",
    name: "TEXT",
    email: "TEXT",
    image: "TEXT",
    password: "TEXT",
    plan: "TEXT DEFAULT 'free'",
    aiUsageCount: "INTEGER DEFAULT 0",
    usageResetDate: "DATETIME",
    stripeCustomerId: "TEXT",
    stripeSubId: "TEXT",
    twoFactorSecret: "TEXT",
    twoFactorEnabled: "BOOLEAN DEFAULT 0",
    deletedAt: "DATETIME",
    createdAt: "DATETIME",
    updatedAt: "DATETIME",
  },
  PasswordReset: {
    id: "TEXT",
    email: "TEXT",
    token: "TEXT",
    expiresAt: "DATETIME",
    used: "BOOLEAN DEFAULT 0",
    createdAt: "DATETIME",
  },
  Account: {
    id: "TEXT",
    userId: "TEXT",
    type: "TEXT",
    provider: "TEXT",
    providerAccountId: "TEXT",
    access_token: "TEXT",
    refresh_token: "TEXT",
    expires_at: "INTEGER",
    token_type: "TEXT",
    scope: "TEXT",
    id_token: "TEXT",
  },
  Resume: {
    id: "TEXT",
    userId: "TEXT",
    fileName: "TEXT",
    content: "TEXT",
    analysis: "TEXT",
    createdAt: "DATETIME",
  },
  SavedJob: {
    id: "TEXT",
    userId: "TEXT",
    title: "TEXT",
    company: "TEXT",
    location: "TEXT",
    description: "TEXT",
    url: "TEXT",
    salary: "TEXT",
    matchScore: "INTEGER",
    createdAt: "DATETIME",
  },
  Application: {
    id: "TEXT",
    userId: "TEXT",
    jobId: "TEXT",
    jobTitle: "TEXT",
    company: "TEXT",
    status: "TEXT DEFAULT 'Saved'",
    notes: "TEXT",
    appliedDate: "DATETIME",
    interviewDate: "DATETIME",
    createdAt: "DATETIME",
    updatedAt: "DATETIME",
  },
  Contact: {
    id: "TEXT",
    userId: "TEXT",
    name: "TEXT",
    email: "TEXT",
    phone: "TEXT",
    company: "TEXT",
    role: "TEXT",
    linkedinUrl: "TEXT",
    relationship: "TEXT DEFAULT 'Connection'",
    notes: "TEXT",
    lastContactedAt: "DATETIME",
    nextFollowUp: "DATETIME",
    createdAt: "DATETIME",
    updatedAt: "DATETIME",
  },
  Company: {
    id: "TEXT",
    userId: "TEXT",
    name: "TEXT",
    industry: "TEXT",
    website: "TEXT",
    location: "TEXT",
    size: "TEXT",
    notes: "TEXT",
    priority: "TEXT DEFAULT 'Medium'",
    status: "TEXT DEFAULT 'Researching'",
    createdAt: "DATETIME",
    updatedAt: "DATETIME",
  },
  AiResult: {
    id: "TEXT",
    userId: "TEXT",
    action: "TEXT",
    title: "TEXT",
    result: "TEXT",
    createdAt: "DATETIME",
  },
  CoverLetter: {
    id: "TEXT",
    userId: "TEXT",
    jobTitle: "TEXT",
    company: "TEXT",
    content: "TEXT",
    createdAt: "DATETIME",
  },
};

async function syncDatabase() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url || !authToken || url.startsWith("file:")) {
    console.log("[sync-db] Skipping — local or no Turso credentials");
    return;
  }

  console.log("[sync-db] Connecting to production database...");
  const client = createClient({ url, authToken });

  for (const [table, columns] of Object.entries(SCHEMA)) {
    const existing = await client.execute(`PRAGMA table_info(${table})`);
    const existingCols = new Set(existing.rows.map((r) => r.name));

    for (const [col, type] of Object.entries(columns)) {
      if (!existingCols.has(col)) {
        const sql = `ALTER TABLE ${table} ADD COLUMN ${col} ${type}`;
        console.log(`[sync-db] Adding column: ${table}.${col}`);
        await client.execute(sql);
      }
    }
  }

  console.log("[sync-db] Database sync complete");
}

syncDatabase().catch((e) => {
  console.error("[sync-db] Failed:", e.message);
  process.exit(0);
});
