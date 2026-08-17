/* ============================================================
   ORG INVITE EMAIL — Sent when a coach/admin invites a candidate
   ============================================================
   Builds the HTML email for org invitations. No emoji (user
   preference). Plain professional style matching existing
   JobPilot transactional emails.
   ============================================================ */

/* # Build the invite email HTML and subject line */
export function buildInviteEmail(params: {
  orgName: string;
  inviterName: string;
  acceptUrl: string;
  role: string;
  cohort?: string;
}): { subject: string; html: string } {
  const { orgName, inviterName, acceptUrl, role, cohort } = params;

  const subject = `${orgName} has invited you to JobPilot AI`;

  /* # Professional email template — no emoji, no gimmicks */
  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1e1b4b; margin-bottom: 8px;">${orgName} has invited you</h2>
      <p style="color: #475569; line-height: 1.6;">
        ${inviterName} has invited you to join ${orgName} on JobPilot AI as a ${role}${cohort ? ` in the ${cohort} cohort` : ""}.
      </p>
      <p style="color: #475569; line-height: 1.6;">
        ${orgName} sponsors your account, giving you access to all Pro features including AI resume optimization,
        cover letter generation, mock interviews, and job tracking.
      </p>
      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        By accepting, ${orgName} can see your activity summary (applications sent, resumes created, features used).
        They cannot see your resume content, AI outputs, or personal notes.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${acceptUrl}" style="background: #4f46e5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Accept Invitation
        </a>
      </div>
      <p style="color: #94a3b8; font-size: 12px;">
        This invitation expires in 14 days. If you did not expect this, you can safely ignore this email.
      </p>
    </div>
  `;

  return { subject, html };
}
