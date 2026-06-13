/* ============================================================
   CONTACTS API - Networking CRM
   ============================================================
   GET  /api/contacts — list contacts (paginated)
   POST /api/contacts — create a new contact
   Both endpoints require authentication.

   Pagination: ?cursor=xxx&limit=20&sort=updatedAt&order=desc
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { createContactSchema, formatZodError } from "@/lib/validations";
import { parsePaginationParams, buildPaginationQuery, paginatedResponse } from "@/lib/pagination";
import { safeHandler } from "@/lib/api-handler";

/* ---- GET: List contacts for the logged-in user (paginated) ---- */
export const GET = safeHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = parsePaginationParams(req.url);
  const query = buildPaginationQuery({
    ...params,
    allowedSorts: ["createdAt", "updatedAt", "name", "company"],
  });

  const contacts = await dbRetry(() => prisma.contact.findMany({
    where: { userId: session.user.id },
    ...query,
  }));

  return NextResponse.json(paginatedResponse(contacts, params.limit));
});

/* ---- POST: Create a new contact ---- */
export const POST = safeHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createContactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { name, email, phone, company, role, linkedinUrl, relationship, notes, nextFollowUp } = parsed.data;

  const contact = await dbRetry(() => prisma.contact.create({
    data: {
      userId: session.user.id,
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      role: role || null,
      linkedinUrl: linkedinUrl || null,
      relationship: relationship || "Connection",
      notes: notes || null,
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
    },
  }));

  return NextResponse.json(contact, { status: 201 });
});
