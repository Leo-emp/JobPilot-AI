/* ============================================================
   2FA SETUP API — /api/auth/two-factor/setup
   ============================================================
   Generates a TOTP secret and QR code for the user to scan
   with their authenticator app. Does NOT enable 2FA yet —
   the user must verify a code first via /verify.
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { safeHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";

export const POST = safeHandler(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* Generate a new TOTP secret */
  const secret = new OTPAuth.Secret({ size: 20 });

  const totp = new OTPAuth.TOTP({
    issuer: "JobPilot AI",
    label: session.user.email || "user",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });

  /* Store the secret (not yet enabled — user must verify first) */
  await dbRetry(() =>
    prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret.base32, twoFactorEnabled: false },
    })
  );

  /* Generate QR code as data URL */
  const otpauthUrl = totp.toString();
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

  return NextResponse.json({
    qrCode: qrCodeUrl,
    secret: secret.base32,
    otpauthUrl,
  });
});
