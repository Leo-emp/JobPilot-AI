/* ============================================================
   USER PROFILE API - Update Name & Avatar
   ============================================================
   PATCH /api/user/profile — update name and/or profile image
   Accepts JSON body: { name?: string, image?: string }
   Image should be a base64 data URL (stored directly in DB).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { formatZodError } from "@/lib/validations";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long.").optional(),
  image: z.string().max(2_000_000, "Image is too large.").optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const updates: Record<string, string | null> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.image !== undefined) updates.image = parsed.data.image;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No changes provided." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updates,
      select: { id: true, name: true, email: true, image: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
