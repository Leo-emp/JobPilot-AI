/* ============================================================
   ACCOUNT DELETION API - DELETE /api/user/delete
   ============================================================
   Permanently deletes the authenticated user's account and ALL
   associated data (resumes, cover letters, applications, jobs).
   This is irreversible. Requires the user to confirm by sending
   their email address in the request body as a safety check.

   Prisma cascade deletes handle related records automatically
   (onDelete: Cascade is set on all relations in the schema).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteUserSchema, formatZodError } from "@/lib/validations";

export async function DELETE(req: NextRequest) {
  try {
    /* Verify authentication */
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to delete your account." },
        { status: 401 }
      );
    }

    /* Parse and validate confirmation email */
    const body = await req.json();
    const parsed = deleteUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    /* Safety check: user must type their email to confirm deletion */
    if (parsed.data.confirmEmail !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { error: "Please enter your email address correctly to confirm deletion." },
        { status: 400 }
      );
    }

    /* Delete the user — Prisma cascade will remove all related records */
    /* (resumes, saved jobs, applications, cover letters) */
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    /* Return success — the client will sign out and redirect */
    return NextResponse.json({
      success: true,
      message: "Your account and all associated data have been permanently deleted.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete account.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
