/* ============================================================
   RESET PASSWORD API — /api/auth/reset-password
   ============================================================
   Validates the reset token, then updates the user's password.
   Token must be valid, unused, and not expired.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resetPasswordSchema, formatZodError } from "@/lib/validations";
import { authPerMinute, authPerHour } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    /* ---- Rate limiting by IP — blocks token brute-force attempts ---- */
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const minuteCheck = authPerMinute.check(`reset:${ip}`);
    if (!minuteCheck.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a minute and try again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(minuteCheck.resetIn / 1000)) } }
      );
    }
    const hourCheck = authPerHour.check(`reset:${ip}`);
    if (!hourCheck.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(hourCheck.resetIn / 1000)) } }
      );
    }

    /* Validate input with Zod */
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const { token, password } = parsed.data;

    /* ---- Find the reset token ---- */
    const resetRecord = await prisma.passwordReset.findUnique({ where: { token } });

    if (!resetRecord) {
      return NextResponse.json({ error: "Invalid or expired reset link. Please request a new one." }, { status: 400 });
    }

    if (resetRecord.used) {
      return NextResponse.json({ error: "This reset link has already been used. Please request a new one." }, { status: 400 });
    }

    if (new Date() > resetRecord.expiresAt) {
      return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
    }

    /* ---- Update the user's password ---- */
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    /* ---- Mark the token as used ---- */
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    return NextResponse.json({ message: "Password reset successfully. You can now sign in." });
  } catch (e) {
    console.error("Reset password error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
