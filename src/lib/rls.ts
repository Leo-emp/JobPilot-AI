/* ============================================================
   ROW LEVEL SECURITY (RLS) - User Data Isolation
   ============================================================
   Ensures every database query is scoped to the authenticated
   user's ID. Prevents users from accessing each other's data
   even if a route handler has a bug.

   Usage in API routes:
     const db = userScopedDb(session.user.id);
     const resumes = await db.resume.findMany();
     // Automatically filtered to only this user's resumes
   ============================================================ */

import { prisma } from "./prisma";

/* Creates a user-scoped database accessor that auto-filters by userId */
export function userScopedDb(userId: string) {
  return {
    resume: {
      findMany: (args?: { orderBy?: Record<string, string>; select?: Record<string, boolean> }) =>
        prisma.resume.findMany({ ...args, where: { ...((args as Record<string, unknown>)?.where as Record<string, unknown> || {}), userId } }),
      findFirst: (args?: { orderBy?: Record<string, string>; select?: Record<string, boolean> }) =>
        prisma.resume.findFirst({ ...args, where: { ...((args as Record<string, unknown>)?.where as Record<string, unknown> || {}), userId } }),
      create: (data: { fileName: string; content: string; analysis?: string }) =>
        prisma.resume.create({ data: { ...data, userId } }),
      delete: (id: string) =>
        prisma.resume.deleteMany({ where: { id, userId } }),
    },

    coverLetter: {
      findMany: (args?: { orderBy?: Record<string, string> }) =>
        prisma.coverLetter.findMany({ ...args, where: { ...((args as Record<string, unknown>)?.where as Record<string, unknown> || {}), userId } }),
      create: (data: { jobTitle: string; company: string; content: string }) =>
        prisma.coverLetter.create({ data: { ...data, userId } }),
      delete: (id: string) =>
        prisma.coverLetter.deleteMany({ where: { id, userId } }),
    },

    application: {
      findMany: (args?: { orderBy?: Record<string, string>; include?: Record<string, boolean> }) =>
        prisma.application.findMany({ ...args, where: { ...((args as Record<string, unknown>)?.where as Record<string, unknown> || {}), userId } }),
      findFirst: (id: string) =>
        prisma.application.findFirst({ where: { id, userId } }),
      create: (data: Record<string, unknown>) =>
        prisma.application.create({ data: { ...data, userId } as never }),
      update: (id: string, data: Record<string, unknown>) =>
        prisma.application.updateMany({ where: { id, userId }, data: data as never }),
      delete: (id: string) =>
        prisma.application.deleteMany({ where: { id, userId } }),
    },

    contact: {
      findMany: (args?: { orderBy?: Record<string, string> }) =>
        prisma.contact.findMany({ ...args, where: { ...((args as Record<string, unknown>)?.where as Record<string, unknown> || {}), userId } }),
      findFirst: (id: string) =>
        prisma.contact.findFirst({ where: { id, userId } }),
      create: (data: Record<string, unknown>) =>
        prisma.contact.create({ data: { ...data, userId } as never }),
      update: (id: string, data: Record<string, unknown>) =>
        prisma.contact.updateMany({ where: { id, userId }, data: data as never }),
      delete: (id: string) =>
        prisma.contact.deleteMany({ where: { id, userId } }),
    },

    company: {
      findMany: (args?: { orderBy?: Record<string, string> }) =>
        prisma.company.findMany({ ...args, where: { ...((args as Record<string, unknown>)?.where as Record<string, unknown> || {}), userId } }),
      findFirst: (id: string) =>
        prisma.company.findFirst({ where: { id, userId } }),
      create: (data: Record<string, unknown>) =>
        prisma.company.create({ data: { ...data, userId } as never }),
      update: (id: string, data: Record<string, unknown>) =>
        prisma.company.updateMany({ where: { id, userId }, data: data as never }),
      delete: (id: string) =>
        prisma.company.deleteMany({ where: { id, userId } }),
    },

    savedJob: {
      findMany: (args?: { orderBy?: Record<string, string> }) =>
        prisma.savedJob.findMany({ ...args, where: { ...((args as Record<string, unknown>)?.where as Record<string, unknown> || {}), userId } }),
      create: (data: Record<string, unknown>) =>
        prisma.savedJob.create({ data: { ...data, userId } as never }),
      delete: (id: string) =>
        prisma.savedJob.deleteMany({ where: { id, userId } }),
    },
  };
}
