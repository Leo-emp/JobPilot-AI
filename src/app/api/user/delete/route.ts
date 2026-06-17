/* ============================================================
   ACCOUNT DELETION API - DELETE /api/user/delete
   ============================================================
   Soft-deletes the authenticated user's account by setting the
   deletedAt timestamp. The account and data are preserved for
   30 days (for recovery requests) before permanent cleanup.
   Requires the user to confirm by sending their email address.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteUserSchema, formatZodError } from "@/lib/validations";
import { audit, getClientIp } from "@/lib/audit";
import { authHandler } from "@/lib/api-handler";
import { cacheSet } from "@/lib/redis";
import { dbRetry } from "@/lib/db-retry";

export const DELETE = authHandler(async (req, session) => {
  /* # Extra check: email required for deletion confirmation */
  if (!session.user.email) {
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

  /* Soft-delete: set deletedAt timestamp instead of destroying data */
  /* Account data is preserved for 30 days for recovery requests */
  await dbRetry(() =>
    prisma.user.update({
      where: { id: session.user.id },
      data: { deletedAt: new Date() },
    })
  );

  /* # Invalidate session cache so auth check blocks this user immediately */
  await cacheSet(`session:active:${session.user.id}`, "0", 300);

  audit("auth.account.deleted", {
    userId: session.user.id,
    email: session.user.email,
    ip: getClientIp(req.headers),
  });

  /* Return success — the client will sign out and redirect */
  return NextResponse.json({
    success: true,
    message: "Your account has been deactivated. Data will be permanently removed after 30 days.",
  });
});
