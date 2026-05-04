/* ============================================================
   PRISMA CLIENT - Database Connection Singleton
   ============================================================
   Creates a single Prisma client instance shared across the app.
   Prisma v7+ requires an explicit adapter for database connections.
   We use @prisma/adapter-libsql for SQLite support.
   In development, the globalThis trick prevents hot-reload
   from creating multiple database connections.
   ============================================================ */

/* Import from the client submodule — Prisma v7+ generates separate files */
import { PrismaClient } from "@/generated/prisma/client";
/* libSQL adapter bridges Prisma to the SQLite database */
import { PrismaLibSql } from "@prisma/adapter-libsql";

/* Extend the global type so TypeScript allows us to store prisma on it */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/* ---- Create the Database Connection ---- */
/* In production (Vercel), connects to Turso cloud database via libSQL */
/* In development, connects to the local SQLite file (dev.db) */
/* Turso requires both a URL and an auth token for cloud connections */
function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
    /* Auth token is required for Turso cloud, not needed for local SQLite */
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  });
  return new PrismaClient({ adapter });
}

/* Reuse existing client if one exists, otherwise create a new one */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

/* In development, store the client on globalThis so hot reloads don't */
/* create new connections. In production, this line is skipped. */
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
