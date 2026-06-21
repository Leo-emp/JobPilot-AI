/* # Create BlogPost table in Turso
   # Task 1 added this model to the Prisma schema but Turso needs the actual table.
   # Run: node scripts/create-blog-table.mjs */

import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

// # Load .env.local
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=["']?(.+?)["']?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
}

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const CREATE_SQL = `
CREATE TABLE IF NOT EXISTS "BlogPost" (
  id              TEXT NOT NULL PRIMARY KEY,
  slug            TEXT NOT NULL,
  title           TEXT NOT NULL,
  excerpt         TEXT NOT NULL,
  content         TEXT NOT NULL,
  category        TEXT NOT NULL,
  tags            TEXT,
  metaTitle       TEXT,
  metaDescription TEXT,
  coverImageUrl   TEXT,
  author          TEXT NOT NULL DEFAULT 'JobPilot AI Team',
  readTime        TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft',
  publishedAt     DATETIME,
  createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`;

const CREATE_INDEXES = [
  `CREATE INDEX IF NOT EXISTS "BlogPost_status_idx" ON "BlogPost"("status")`,
  `CREATE INDEX IF NOT EXISTS "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt")`,
  `CREATE INDEX IF NOT EXISTS "BlogPost_category_idx" ON "BlogPost"("category")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug")`,
];

console.log("Creating BlogPost table in Turso...");

await db.execute(CREATE_SQL);
console.log("  Table created.");

for (const idx of CREATE_INDEXES) {
  await db.execute(idx);
  console.log(`  Index created.`);
}

// # Verify
const r = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='BlogPost'");
console.log("BlogPost table exists:", r.rows.length > 0 ? "YES" : "FAILED");

db.close();
console.log("Done!");
