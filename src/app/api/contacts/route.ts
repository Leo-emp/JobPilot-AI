/* ============================================================
   CONTACTS API - Networking CRM
   ============================================================
   GET  /api/contacts — list all contacts for the user
   POST /api/contacts — create a new contact
   Both endpoints require authentication.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- GET: List all contacts for the logged-in user ---- */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* Fetch all contacts, newest first */
  const contacts = await prisma.contact.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(contacts);
}

/* ---- POST: Create a new contact ---- */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, phone, company, role, linkedinUrl, relationship, notes, nextFollowUp } = await req.json();

  /* Name is required */
  if (!name) {
    return NextResponse.json(
      { error: "Contact name is required." },
      { status: 400 }
    );
  }

  const contact = await prisma.contact.create({
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
  });

  return NextResponse.json(contact, { status: 201 });
}
