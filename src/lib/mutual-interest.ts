/* ============================================================
   MUTUAL INTEREST — Detects and acts on two-way bookmarks
   ============================================================
   When an employer bookmarks a candidate AND the candidate has
   bookmarked that employer (or one of their roles), mutual
   interest is detected. This unlocks:
   1. Auto-creation of a MessageThread
   2. Notifications to both parties
   3. Contact info visibility

   Called after every bookmark creation to check for the match.
   ============================================================ */

import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";

/* # Check if mutual interest exists between an employer and a candidate */
export async function checkMutualInterest(
  employerId: string,
  candidateId: string,
): Promise<boolean> {
  /* # Does the employer have this candidate bookmarked? */
  const employerBookmark = await prisma.employerBookmark.findUnique({
    where: { employerId_candidateId: { employerId, candidateId } },
  });
  if (!employerBookmark) return false;

  /* # Does the candidate have this employer (or any of their roles) bookmarked? */
  const candidateBookmark = await prisma.candidateBookmark.findFirst({
    where: {
      userId: candidateId,
      OR: [
        { employerId },
        { role: { employerId } },
      ],
    },
  });
  if (!candidateBookmark) return false;

  return true;
}

/* # Handle mutual interest: create thread + notify both sides */
export async function handleMutualInterest(
  employerId: string,
  candidateId: string,
  roleId?: string,
): Promise<void> {
  /* # Check if a thread already exists for this pair */
  const existing = await prisma.messageThread.findFirst({
    where: { candidateId, employerId, roleId: roleId ?? null },
  });
  if (existing) return; // # Thread already exists, nothing to do

  /* # Get employer name for notification text */
  const employer = await prisma.employer.findUnique({
    where: { id: employerId },
    select: { name: true },
  });
  const employerName = employer?.name ?? "An employer";

  /* # Get candidate name for notification text */
  const candidate = await prisma.user.findUnique({
    where: { id: candidateId },
    select: { name: true },
  });
  const candidateName = candidate?.name ?? "A candidate";

  /* # Create the message thread — ready for first message */
  await prisma.messageThread.create({
    data: {
      candidateId,
      employerId,
      roleId: roleId ?? null,
    },
  });

  /* # Notify both parties */
  await Promise.all([
    // # Notify the candidate
    notify(candidateId, "mutual", `${employerName} is interested in you!`, {
      body: "You have a mutual interest — messaging is now unlocked.",
      linkUrl: "/dashboard/messages",
    }),
    // # Notify employer members (get all recruiters/admins/owners)
    notifyEmployerMembers(employerId, candidateName),
  ]);
}

/* # Notify all members of an employer about mutual interest */
async function notifyEmployerMembers(
  employerId: string,
  candidateName: string,
): Promise<void> {
  const members = await prisma.employerMember.findMany({
    where: { employerId },
    select: { userId: true },
  });

  await Promise.all(
    members.map((m) =>
      notify(m.userId, "mutual", `Mutual interest with ${candidateName}`, {
        body: "Both sides are interested — messaging is now unlocked.",
        linkUrl: `/employer/${employerId}/messages`,
      })
    ),
  );
}
