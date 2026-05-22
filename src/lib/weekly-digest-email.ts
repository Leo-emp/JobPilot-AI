/* ============================================================
   WEEKLY DIGEST EMAIL - Career Intelligence Summary
   ============================================================
   HTML email template matching the dark space theme.
   Sent every Monday 8am UTC to opted-in users.
   Sections: Activity, Skill Gaps, Follow-ups, Numbers, CTA.
   ============================================================ */

import type { WeeklyDigestData } from "./weekly-stats";

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const FONT_DISPLAY = `'Space Grotesk', 'Segoe UI', Roboto, sans-serif`;

/* # Builds the full HTML email from computed weekly stats */
export function buildWeeklyDigestEmail(data: WeeklyDigestData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #050507; -webkit-text-size-adjust: 100%;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #050507;">
<tr><td align="center" style="padding: 0;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%;">

<tr><td style="height: 40px;"></td></tr>

<!-- Logo -->
<tr><td align="center" style="padding: 0 0 36px 0;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td valign="middle">
      <span style="font-family: ${FONT_DISPLAY}; font-size: 15px; font-weight: 700; color: #e4e4e7; letter-spacing: -0.3px;">JobPilot AI</span>
    </td>
  </tr>
  </table>
</td></tr>

<!-- Main Card -->
<tr><td>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(170deg, #12102a 0%, #0c0b18 30%, #0a0a10 100%); border: 1px solid #1e1e2e; border-radius: 20px; overflow: hidden;">

<!-- Top gradient line -->
<tr><td style="height: 1px; background: linear-gradient(90deg, transparent 10%, #6366f1 35%, #a78bfa 50%, #6366f1 65%, transparent 90%); opacity: 0.4;"></td></tr>

<!-- Header -->
<tr><td style="padding: 52px 52px 0 52px;">
  <p style="font-family: ${FONT}; font-size: 15px; color: #8b8ba0; margin: 0 0 24px 0; line-height: 1.6;">Hey ${escapeHtml(data.userName)},</p>
  <h1 style="font-family: ${FONT_DISPLAY}; font-size: 26px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0; line-height: 1.15; letter-spacing: -0.8px;">Your Weekly Career Intelligence</h1>
  <p style="font-family: ${FONT}; font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">${escapeHtml(data.weekOf)}</p>
</td></tr>

<tr><td style="padding: 28px 52px;"><div style="height: 1px; background: linear-gradient(90deg, #1e1e2e, #2a2a3d, #1e1e2e);"></div></td></tr>

<!-- This Week: Activity Stats -->
<tr><td style="padding: 0 52px;">
  <p style="font-family: ${FONT}; font-size: 11px; font-weight: 600; color: #6366f1; letter-spacing: 1.2px; text-transform: uppercase; margin: 0 0 16px 0;">THIS WEEK</p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td width="33%" style="text-align: center; padding: 16px 8px; background: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.12); border-radius: 12px;">
      <p style="font-family: ${FONT_DISPLAY}; font-size: 28px; font-weight: 700; color: #ffffff; margin: 0;">${data.applicationsThisWeek}</p>
      <p style="font-family: ${FONT}; font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Applications</p>
    </td>
    <td width="8"></td>
    <td width="33%" style="text-align: center; padding: 16px 8px; background: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.12); border-radius: 12px;">
      <p style="font-family: ${FONT_DISPLAY}; font-size: 28px; font-weight: 700; color: #ffffff; margin: 0;">${data.aiCallsThisWeek}</p>
      <p style="font-family: ${FONT}; font-size: 11px; color: #64748b; margin: 4px 0 0 0;">AI Actions</p>
    </td>
    <td width="8"></td>
    <td width="33%" style="text-align: center; padding: 16px 8px; background: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.12); border-radius: 12px;">
      <p style="font-family: ${FONT_DISPLAY}; font-size: 28px; font-weight: 700; color: #ffffff; margin: 0;">${data.interviewsScheduled}</p>
      <p style="font-family: ${FONT}; font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Interviews</p>
    </td>
  </tr>
  </table>
</td></tr>

${data.jobViewsThisWeek > 0 ? `
<tr><td style="padding: 12px 52px 0 52px;">
  <p style="font-family: ${FONT}; font-size: 13px; color: #8b8ba0; margin: 0;">You browsed <strong style="color: #c4c4d8;">${data.jobViewsThisWeek} job${data.jobViewsThisWeek === 1 ? "" : "s"}</strong> this week via the Chrome extension.</p>
</td></tr>
` : ""}

${buildSkillGapsSection(data)}

${buildFollowUpsSection(data)}

${buildNumbersSection(data)}

<!-- CTA Button -->
<tr><td align="center" style="padding: 32px 52px 0 52px;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
  <tr><td style="border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #7c3aed); text-align: center;">
    <a href="${escapeHtml(data.dashboardUrl)}" style="display: inline-block; width: 100%; padding: 16px 0; font-family: ${FONT}; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.2px; box-sizing: border-box;">Open Your Dashboard &rarr;</a>
  </td></tr>
  </table>
</td></tr>

<tr><td style="padding: 32px 52px 0 52px;"><div style="height: 1px; background: linear-gradient(90deg, #1e1e2e, #2a2a3d, #1e1e2e);"></div></td></tr>

<!-- Footer inside card -->
<tr><td style="padding: 28px 52px 40px 52px;">
  <p style="font-family: ${FONT}; font-size: 13px; color: #8b8ba0; margin: 0 0 16px 0; line-height: 1.6;">Keep the momentum going. Every week gets you closer.</p>
  <p style="font-family: ${FONT_DISPLAY}; font-size: 14px; color: #6366f1; margin: 0; font-weight: 600; letter-spacing: -0.2px;">&mdash; The JobPilot AI Team</p>
</td></tr>

</table>
</td></tr>

<!-- Footer outside card -->
<tr><td align="center" style="padding: 32px 48px 48px 48px;">
  <p style="font-family: ${FONT}; font-size: 12px; color: #3f3f4a; margin: 0 0 8px 0;">
    <a href="https://jobpilotai.co/dashboard/settings" style="color: #4f4f5a; text-decoration: underline;">Unsubscribe</a> from weekly emails
  </p>
  <p style="font-family: ${FONT}; font-size: 12px; color: #27272e; margin: 0;"><a href="https://jobpilotai.co" style="color: #3f3f4a; text-decoration: none;">jobpilotai.co</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;&copy; 2026 JobPilot AI</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ---- Section Builders ---- */

function buildSkillGapsSection(data: WeeklyDigestData): string {
  if (data.topSkillGaps.length === 0) return "";

  const rows = data.topSkillGaps.map(gap => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #1e1e2e;">
        <span style="font-family: ${FONT}; font-size: 13px; font-weight: 500; color: #fbbf24;">${escapeHtml(gap.skill)}</span>
      </td>
      <td style="padding: 8px 0; border-bottom: 1px solid #1e1e2e; text-align: right;">
        <span style="font-family: ${FONT}; font-size: 12px; color: #64748b;">in ${gap.jobCount} job${gap.jobCount === 1 ? "" : "s"}</span>
      </td>
    </tr>`).join("");

  return `
<tr><td style="padding: 28px 52px 0 52px;"><div style="height: 1px; background: linear-gradient(90deg, #1e1e2e, #2a2a3d, #1e1e2e);"></div></td></tr>
<tr><td style="padding: 24px 52px 0 52px;">
  <p style="font-family: ${FONT}; font-size: 11px; font-weight: 600; color: #fbbf24; letter-spacing: 1.2px; text-transform: uppercase; margin: 0 0 12px 0;">SKILL GAPS</p>
  <p style="font-family: ${FONT}; font-size: 13px; color: #8b8ba0; margin: 0 0 16px 0;">Skills appearing in your saved jobs but missing from your resume:</p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  ${rows}
  </table>
</td></tr>`;
}

function buildFollowUpsSection(data: WeeklyDigestData): string {
  const hasContacts = data.followUpsDue.length > 0;
  const hasApps = data.applicationFollowUps.length > 0;
  if (!hasContacts && !hasApps) return "";

  let contactRows = "";
  if (hasContacts) {
    contactRows = data.followUpsDue.map(c => `
    <tr><td style="padding: 6px 0;">
      <span style="font-family: ${FONT}; font-size: 13px; color: #c4c4d8;">${escapeHtml(c.name)}</span>
      <span style="font-family: ${FONT}; font-size: 12px; color: #64748b;"> at ${escapeHtml(c.company)}</span>
    </td></tr>`).join("");
  }

  let appRows = "";
  if (hasApps) {
    appRows = data.applicationFollowUps.map(a => `
    <tr><td style="padding: 6px 0;">
      <span style="font-family: ${FONT}; font-size: 13px; color: #c4c4d8;">${escapeHtml(a.jobTitle)}</span>
      <span style="font-family: ${FONT}; font-size: 12px; color: #64748b;"> at ${escapeHtml(a.company)} &mdash; ${a.daysSinceApplied}d ago</span>
    </td></tr>`).join("");
  }

  return `
<tr><td style="padding: 28px 52px 0 52px;"><div style="height: 1px; background: linear-gradient(90deg, #1e1e2e, #2a2a3d, #1e1e2e);"></div></td></tr>
<tr><td style="padding: 24px 52px 0 52px;">
  <p style="font-family: ${FONT}; font-size: 11px; font-weight: 600; color: #34d399; letter-spacing: 1.2px; text-transform: uppercase; margin: 0 0 12px 0;">FOLLOW UP</p>
  ${hasContacts ? `
  <p style="font-family: ${FONT}; font-size: 12px; color: #64748b; margin: 0 0 8px 0;">Contacts to reach out to:</p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${contactRows}</table>
  ` : ""}
  ${hasApps ? `
  <p style="font-family: ${FONT}; font-size: 12px; color: #64748b; margin: ${hasContacts ? "16px" : "0"} 0 8px 0;">Applications waiting for a response:</p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${appRows}</table>
  ` : ""}
</td></tr>`;
}

function buildNumbersSection(data: WeeklyDigestData): string {
  if (data.responseRate === 0 && data.avgMatchScore === 0) return "";

  return `
<tr><td style="padding: 28px 52px 0 52px;"><div style="height: 1px; background: linear-gradient(90deg, #1e1e2e, #2a2a3d, #1e1e2e);"></div></td></tr>
<tr><td style="padding: 24px 52px 0 52px;">
  <p style="font-family: ${FONT}; font-size: 11px; font-weight: 600; color: #818cf8; letter-spacing: 1.2px; text-transform: uppercase; margin: 0 0 16px 0;">YOUR NUMBERS</p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    ${data.responseRate > 0 ? `
    <td width="50%" style="padding: 12px 16px; background: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.12); border-radius: 10px;">
      <p style="font-family: ${FONT_DISPLAY}; font-size: 22px; font-weight: 700; color: #ffffff; margin: 0;">${data.responseRate}%</p>
      <p style="font-family: ${FONT}; font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Response Rate</p>
    </td>
    <td width="8"></td>
    ` : ""}
    ${data.avgMatchScore > 0 ? `
    <td width="50%" style="padding: 12px 16px; background: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.12); border-radius: 10px;">
      <p style="font-family: ${FONT_DISPLAY}; font-size: 22px; font-weight: 700; color: #ffffff; margin: 0;">${data.avgMatchScore}%</p>
      <p style="font-family: ${FONT}; font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Avg Match Score</p>
    </td>
    ` : ""}
  </tr>
  </table>
</td></tr>`;
}

/* ---- HTML escape ---- */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
