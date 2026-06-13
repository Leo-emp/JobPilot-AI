/* ============================================================
   2FA DISABLE API — /api/auth/two-factor/disable
   ============================================================
   Disables 2FA for the user's account. Requires a valid TOTP
   code to confirm — prevents accidental or unauthorized disable.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as OTPAuth from "otpauth";
import { z } from "zod";
import { formatZodError } from "@/lib/validations";
import { audit, getClientIp } from "@/lib/audit";
import { safeHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";

const disableSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must be numeric"),
});

export const POST = safeHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = disableSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  const user = await dbRetry(() =>
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true, email: true },
    })
  );

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return NextResponse.json({ error: "2FA is not enabled." }, { status: 400 });
  }

  /* Verify code before disabling */
  const totp = new OTPAuth.TOTP({
    issuer: "JobPilot AI",
    label: session.user.email || "user",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
  });

  const delta = totp.validate({ token: parsed.data.code, window: 1 });
  if (delta === null) {
    return NextResponse.json({ error: "Invalid code." }, { status: 400 });
  }

  await dbRetry(() =>
    prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: null, twoFactorEnabled: false },
    })
  );

  audit("auth.2fa.disabled", { email: user.email, ip: getClientIp(req.headers) });

  return NextResponse.json({ disabled: true });
});
