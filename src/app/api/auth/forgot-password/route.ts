/* ============================================================
   FORGOT PASSWORD API — /api/auth/forgot-password
   ============================================================
   Generates a time-limited reset token and sends it via email.
   Token expires after 1 hour. Always returns success to prevent
   email enumeration (attacker can't tell if an email exists).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { forgotPasswordSchema, formatZodError } from "@/lib/validations";
import { authPerMinute, authPerHour } from "@/lib/rate-limit";
import { audit, getClientIp } from "@/lib/audit";

/* ---- Resend client for sending emails ---- */
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    /* ---- Rate limiting by IP — blocks email enumeration & abuse ---- */
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const minuteCheck = await authPerMinute.check(`forgot:${ip}`);
    if (!minuteCheck.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a minute and try again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(minuteCheck.resetIn / 1000)) } }
      );
    }
    const hourCheck = await authPerHour.check(`forgot:${ip}`);
    if (!hourCheck.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(hourCheck.resetIn / 1000)) } }
      );
    }

    /* Validate input with Zod */
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    /* Email is already trimmed + lowercased by the schema */
    const normalizedEmail = parsed.data.email;

    /* ---- Look up the user ---- */
    /* Only credentials users (with a password) can reset. OAuth users should */
    /* sign in with their provider instead. */
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (user && user.password) {
      /* ---- Generate a secure random token ---- */
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); /* 1 hour from now */

      /* ---- Invalidate any existing tokens for this email ---- */
      await prisma.passwordReset.updateMany({
        where: { email: normalizedEmail, used: false },
        data: { used: true },
      });

      /* ---- Store the new token ---- */
      await prisma.passwordReset.create({
        data: { email: normalizedEmail, token, expiresAt },
      });

      /* ---- Build the reset link ---- */
      const baseUrl = process.env.NEXTAUTH_URL
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
        || "http://localhost:3000";
      const resetLink = `${baseUrl}/reset-password?token=${token}`;

      /* ---- Send the email via Resend ---- */
      await resend.emails.send({
        from: "JobPilot AI <onboarding@resend.dev>",
        to: normalizedEmail,
        subject: "Reset your JobPilot AI password",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="color: #1a1a2e; margin-bottom: 16px;">Reset Your Password</h2>
            <p style="color: #555; line-height: 1.6;">
              Hi ${user.name},
            </p>
            <p style="color: #555; line-height: 1.6;">
              We received a request to reset your JobPilot AI password. Click the button below to set a new password:
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #4338CA, #7C3AED); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <p style="color: #888; font-size: 14px; line-height: 1.6;">
              This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px;">
              JobPilot AI — Your AI-powered career copilot
            </p>
          </div>
        `,
      });
    }

    audit("auth.password_reset.requested", { email: parsed.data.email, ip: getClientIp(req.headers) });

    /* ---- Always return success (prevents email enumeration) ---- */
    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link.",
    });
  } catch (e) {
    console.error("Forgot password error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
