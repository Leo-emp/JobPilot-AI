/* ============================================================
   2FA STATUS API — /api/auth/two-factor/status
   ============================================================
   Returns whether 2FA is enabled for the logged-in user.
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";

export const GET = safeHandler(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await dbRetry(() =>
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true },
    })
  );

  return NextResponse.json({ enabled: user?.twoFactorEnabled ?? false });
});
