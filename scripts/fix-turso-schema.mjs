// Fix Turso schema — add missing columns to existing tables
import { createClient } from "@libsql/client";

const db = createClient({
  url: "libsql://jobpilot-leo-emp.aws-ap-south-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc4NTY3OTEsImlkIjoiMDE5ZGYwODMtMGMwMS03MjMxLTk1ZjQtNjU4NGRlNzExMWYwIiwicmlkIjoiZjBiMjgxMzEtZjRmMS00ODk5LWIyMmEtZDEyNGNkODdlM2U1In0.ogLi2lGRPBu0ZJ-N7AwZZLHgPCJWtDFgq6pas6kg-s9D29ZHkIGrWMPEnPPGe0nT4kDzUyAjTK2GJUSodeaFCg",
});

// Check current User table columns
const info = await db.execute("PRAGMA table_info('User')");
const existingCols = new Set(info.rows.map(r => r.name));
console.log("Current User columns:", [...existingCols].join(", "));

// Columns that might be missing from the User table
const missingCols = [
  { name: "image", sql: 'ALTER TABLE "User" ADD COLUMN "image" TEXT' },
  { name: "aiUsageCount", sql: 'ALTER TABLE "User" ADD COLUMN "aiUsageCount" INTEGER NOT NULL DEFAULT 0' },
  { name: "usageResetDate", sql: 'ALTER TABLE "User" ADD COLUMN "usageResetDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP' },
  { name: "stripeCustomerId", sql: 'ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT' },
  { name: "stripeSubId", sql: 'ALTER TABLE "User" ADD COLUMN "stripeSubId" TEXT' },
];

for (const col of missingCols) {
  if (!existingCols.has(col.name)) {
    try {
      await db.execute(col.sql);
      console.log(`  ADDED: ${col.name}`);
    } catch (err) {
      console.log(`  SKIP: ${col.name} — ${err.message}`);
    }
  } else {
    console.log(`  EXISTS: ${col.name}`);
  }
}

// Verify final schema
const final = await db.execute("PRAGMA table_info('User')");
console.log("\nFinal User table columns:");
for (const row of final.rows) {
  console.log(`  ${row.name} (${row.type}, ${row.notnull ? "NOT NULL" : "nullable"})`);
}

// Also verify all tables exist
const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
console.log("\nAll tables:");
for (const row of tables.rows) {
  console.log(`  - ${row.name}`);
}

console.log("\nDone!");
