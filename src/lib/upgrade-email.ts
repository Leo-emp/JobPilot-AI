/* ============================================================
   UPGRADE EMAIL - Sent when a free user upgrades to Pro
   ============================================================
   # Matches the premium dark/space theme of welcome + cancellation.
   # Celebrates the upgrade, highlights unlimited usage, CTA to dashboard.
   ============================================================ */

const LOGO_URL = "https://jobpilotai.co/logo.svg";

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const FONT_DISPLAY = `'Space Grotesk', 'Segoe UI', Roboto, sans-serif`;

export function buildUpgradeEmail(firstName: string): string {
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

<tr><td align="center" style="padding: 0 0 36px 0;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td valign="middle" style="padding-right: 10px;">
      <img src="${LOGO_URL}" alt="JobPilot AI" width="28" style="display: block; width: 28px; height: auto;" />
    </td>
    <td valign="middle">
      <span style="font-family: ${FONT_DISPLAY}; font-size: 15px; font-weight: 700; color: #e4e4e7; letter-spacing: -0.3px;">JobPilot AI</span>
    </td>
  </tr>
  </table>
</td></tr>

<tr><td>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(170deg, #12102a 0%, #0c0b18 30%, #0a0a10 100%); border: 1px solid #1e1e2e; border-radius: 20px; overflow: hidden;">

<tr><td style="height: 1px; background: linear-gradient(90deg, transparent 10%, #6366f1 35%, #a78bfa 50%, #6366f1 65%, transparent 90%); opacity: 0.4;"></td></tr>

<tr><td style="padding: 52px 52px 0 52px;">
  <p style="font-family: ${FONT}; font-size: 15px; color: #8b8ba0; margin: 0 0 24px 0; line-height: 1.6;">Hey ${firstName},</p>
  <h1 style="font-family: ${FONT_DISPLAY}; font-size: 30px; font-weight: 700; color: #ffffff; margin: 0 0 10px 0; line-height: 1.15; letter-spacing: -0.8px;">You're now on Pro.</h1>
  <p style="font-family: ${FONT}; font-size: 16px; font-weight: 500; color: #c4c4d8; margin: 0; line-height: 1.5; letter-spacing: -0.2px;">Your usage limits have been lifted &mdash; you now have unlimited AI requests.</p>
</td></tr>

<tr><td style="padding: 36px 52px;"><div style="height: 1px; background: linear-gradient(90deg, #1e1e2e, #2a2a3d, #1e1e2e);"></div></td></tr>

<tr><td style="padding: 0 52px;">
  <p style="font-family: ${FONT}; font-size: 15px; font-weight: 500; color: #c4c4d8; margin: 0 0 22px 0; line-height: 1.5; letter-spacing: -0.1px;">What changes with Pro:</p>
</td></tr>

<tr><td style="padding: 0 52px 16px 52px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td width="8" valign="top" style="padding-top: 8px;"><div style="width: 6px; height: 6px; border-radius: 6px; background-color: #6366f1;"></div></td><td style="padding-left: 16px;"><p style="font-family: ${FONT}; font-size: 14.5px; font-weight: 500; color: #d4d4dc; margin: 0; line-height: 1.5; letter-spacing: -0.1px;">Unlimited AI requests &mdash; no more monthly cap</p></td></tr></table></td></tr>

<tr><td style="padding: 0 52px 16px 52px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td width="8" valign="top" style="padding-top: 8px;"><div style="width: 6px; height: 6px; border-radius: 6px; background-color: #818cf8;"></div></td><td style="padding-left: 16px;"><p style="font-family: ${FONT}; font-size: 14.5px; font-weight: 500; color: #d4d4dc; margin: 0; line-height: 1.5; letter-spacing: -0.1px;">Tailor as many resumes and cover letters as you need</p></td></tr></table></td></tr>

<tr><td style="padding: 0 52px 0 52px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td width="8" valign="top" style="padding-top: 8px;"><div style="width: 6px; height: 6px; border-radius: 6px; background-color: #a78bfa;"></div></td><td style="padding-left: 16px;"><p style="font-family: ${FONT}; font-size: 14.5px; font-weight: 500; color: #d4d4dc; margin: 0; line-height: 1.5; letter-spacing: -0.1px;">Run unlimited mock interviews and career insights</p></td></tr></table></td></tr>

<tr><td align="center" style="padding: 40px 52px 0 52px;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
  <tr><td style="border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #7c3aed); text-align: center;">
    <a href="https://jobpilotai.co/dashboard" style="display: inline-block; width: 100%; padding: 16px 0; font-family: ${FONT}; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.2px; box-sizing: border-box;">Go to your dashboard &rarr;</a>
  </td></tr>
  </table>
</td></tr>

<tr><td style="padding: 40px 52px 0 52px;"><div style="height: 1px; background: linear-gradient(90deg, #1e1e2e, #2a2a3d, #1e1e2e);"></div></td></tr>

<tr><td style="padding: 36px 52px 52px 52px;">
  <p style="font-family: ${FONT}; font-size: 14.5px; color: #8b8ba0; margin: 0 0 20px 0; line-height: 1.8; letter-spacing: -0.1px;">No more counting requests. Apply to every role that fits, prep for every interview, and let the AI do the heavy lifting.</p>
  <p style="font-family: ${FONT}; font-size: 15px; font-weight: 500; color: #c4c4d8; margin: 0 0 8px 0; line-height: 1.5; letter-spacing: -0.1px;">Make every application count.</p>
  <p style="font-family: ${FONT_DISPLAY}; font-size: 14px; color: #6366f1; margin: 0; font-weight: 600; letter-spacing: -0.2px;">&mdash; The JobPilot AI Team</p>
</td></tr>

</table>
</td></tr>

<tr><td align="center" style="padding: 32px 48px 48px 48px;">
  <p style="font-family: ${FONT}; font-size: 13px; color: #3f3f4a; margin: 0 0 8px 0; letter-spacing: -0.1px;">Questions? Email us at <a href="mailto:support@jobpilotai.co" style="color: #6366f1; text-decoration: none;">support@jobpilotai.co</a> &mdash; we read every one.</p>
  <p style="font-family: ${FONT}; font-size: 12px; color: #27272e; margin: 0;"><a href="https://jobpilotai.co" style="color: #3f3f4a; text-decoration: none;">jobpilotai.co</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;&copy; 2026 JobPilot AI</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
