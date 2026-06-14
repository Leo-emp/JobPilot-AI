// ============================================================
// PRISMA CONFIG - Database Connection for CLI Commands
// ============================================================
// Local dev: uses file:./dev.db from .env
// Production: Turso is managed via db push or direct SQL
// (Prisma migrate deploy doesn't yet support libsql:// URLs)
// ============================================================

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
