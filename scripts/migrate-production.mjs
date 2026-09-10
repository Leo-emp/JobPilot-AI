/* ============================================================
   MIGRATE PRODUCTION - Auto-apply Prisma migrations to Turso
   ============================================================
   Runs during every Vercel build (before next build).
   Reads prisma/migrations/ folders, checks which ones have
   been applied via a _prisma_migrations tracking table, and
   runs any new ones. Replaces sync-db.mjs entirely.

   On first run, all existing migrations are recorded as
   "baseline" (already applied) — they won't re-execute.
   Only migrations created AFTER the baseline date will
   auto-apply on deploy.

   If any migration fails, the build fails — broken schema
   never reaches production.
   ============================================================ */

import { createClient } from "@libsql/client";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

/* ---- Baseline: migrations already in production as of 2026-09-10 ---- */
/* These get recorded as "applied" without executing on first run. */
/* Any migration folder added AFTER this list will auto-run on deploy. */
const BASELINE = new Set([
  "20260503190416_init",
  "20260505193516_add_oauth_support",
  "20260506104752_add_networking_crm",
  "20260512022406_add_password_reset",
  "20260514110903_add_indexes",
  "20260514222748_add_user_soft_delete",
  "20260516154636_add_ai_result_history",
  "20260519214305_add_two_factor_fields",
  "20260604220110_add_feedback_table",
  "20260614145009_add_stripe_and_softdelete_indexes",
  "20260621195609_add_blog_post_model",
  "20260815180952_add_org_layer",
  "20260815182625_add_employer_role_models",
  "20260816053805_add_candidate_match",
  "20260816072745_add_bookmarks_messaging_notifications",
  "20260816082601_add_candidate_bookmark_relations",
  "20260817072308_add_external_candidates_sourcing",
  "20260817101404_add_outreach_shortlist_suppression",
  "20260817104808_add_employer_usage_tracking",
  "20260908053647_add_follow_up_date",
  "20260908082015_add_bonus_calls",
  "20260909185133_add_cancellation_feedback_fields",
]);

/* ---- Parse migration SQL into individual statements ---- */
/* Handles multi-line CREATE TABLE, comments, and PRAGMAs. */
function parseStatements(sql) {
  return sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));
}

async function migrate() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  /* Skip on local dev (file: URL) or missing credentials */
  if (!url || !authToken || url.startsWith("file:")) {
    console.log("[migrate] Skipping — local dev or no Turso credentials");
    return;
  }

  console.log("[migrate] Connecting to production Turso...");
  const client = createClient({ url, authToken });

  /* ---- Create tracking table if it doesn't exist ---- */
  await client.execute(`
    CREATE TABLE IF NOT EXISTS _prisma_migrations (
      id TEXT PRIMARY KEY,
      migration_name TEXT NOT NULL UNIQUE,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      is_baseline INTEGER NOT NULL DEFAULT 0
    )
  `);

  /* ---- Get list of already-applied migrations ---- */
  const applied = await client.execute(
    "SELECT migration_name FROM _prisma_migrations"
  );
  const appliedSet = new Set(applied.rows.map((r) => r.migration_name));

  /* ---- Read all migration folders, sorted by timestamp ---- */
  const migrationsDir = join(process.cwd(), "prisma", "migrations");
  const folders = readdirSync(migrationsDir)
    .filter(
      (f) =>
        !f.startsWith("migration_lock") &&
        existsSync(join(migrationsDir, f, "migration.sql"))
    )
    .sort();

  let appliedCount = 0;
  let baselinedCount = 0;

  for (const folder of folders) {
    /* Already tracked — skip */
    if (appliedSet.has(folder)) continue;

    /* Baseline migration — record without executing */
    if (BASELINE.has(folder)) {
      await client.execute({
        sql: "INSERT INTO _prisma_migrations (id, migration_name, is_baseline) VALUES (?, ?, 1)",
        args: [crypto.randomUUID(), folder],
      });
      baselinedCount++;
      console.log(`[migrate] Baseline: ${folder}`);
      continue;
    }

    /* ---- New migration — read and execute ---- */
    const sqlFile = join(migrationsDir, folder, "migration.sql");
    const sql = readFileSync(sqlFile, "utf-8");
    const statements = parseStatements(sql);

    console.log(
      `[migrate] Applying: ${folder} (${statements.length} statements)`
    );

    /* Execute each statement sequentially (not batch) because */
    /* PRAGMA statements can't run inside transactions. */
    for (const stmt of statements) {
      try {
        await client.execute(stmt);
      } catch (err) {
        /* If a column/table already exists, treat as applied */
        const msg = err.message || "";
        if (
          msg.includes("already exists") ||
          msg.includes("duplicate column")
        ) {
          console.log(`[migrate]   Skipped (already exists): ${stmt.slice(0, 60)}...`);
          continue;
        }
        /* Any other error — fail the build */
        console.error(`[migrate] FAILED on statement: ${stmt}`);
        throw err;
      }
    }

    /* Record as applied */
    await client.execute({
      sql: "INSERT INTO _prisma_migrations (id, migration_name, is_baseline) VALUES (?, ?, 0)",
      args: [crypto.randomUUID(), folder],
    });
    appliedCount++;
    console.log(`[migrate] Applied: ${folder}`);
  }

  if (baselinedCount > 0) {
    console.log(`[migrate] Baselined ${baselinedCount} existing migrations`);
  }
  if (appliedCount > 0) {
    console.log(`[migrate] Applied ${appliedCount} new migrations`);
  }
  console.log("[migrate] Production database is up to date");
}

/* ---- Run and fail the build on any error ---- */
migrate().catch((e) => {
  console.error("[migrate] FATAL:", e.message);
  process.exit(1);
});
