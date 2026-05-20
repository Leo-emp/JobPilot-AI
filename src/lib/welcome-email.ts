/* ============================================================
   WELCOME EMAIL - Premium HTML template for new user onboarding
   ============================================================ */

const LOGO_BASE64 = "PHN2ZyB2aWV3Qm94PSIwIDAgNjQgMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJ0bCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNDOEQ0REUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQThCOEM4Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJ0ciIgeDE9IjEwMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0QTcyOTgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzA1ODc4Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJibCIgeDE9IjAlIiB5MT0iMCUiIHgyPSI1MCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzdBOUFCMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1QzdFOTYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJyIiB4MT0iMTAwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyNjRBNjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTUyRTQ1Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cG9seWdvbiBwb2ludHM9IjMyLDAgNCw1NiAzMiw1MCIgZmlsbD0idXJsKCN0bCkiLz4KICA8cG9seWdvbiBwb2ludHM9IjMyLDAgNjAsNTYgMzIsNTAiIGZpbGw9InVybCgjdHIpIi8+CiAgPHBvbHlnb24gcG9pbnRzPSI0LDU2IDMyLDUwIDMyLDc0IDIwLDk4IiBmaWxsPSJ1cmwoI2JsKSIvPgogIDxwb2x5Z29uIHBvaW50cz0iNjAsNTYgMzIsNTAgMzIsNzQgNDQsOTgiIGZpbGw9InVybCgjYnIpIi8+Cjwvc3ZnPgo=";

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const FONT_DISPLAY = `'Space Grotesk', 'Segoe UI', Roboto, sans-serif`;

export function buildWelcomeEmail(firstName: string): string {
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
      <img src="data:image/svg+xml;base64,${LOGO_BASE64}" alt="JobPilot AI" width="24" style="display: block; width: 24px; height: auto;" />
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
  <h1 style="font-family: ${FONT_DISPLAY}; font-size: 30px; font-weight: 700; color: #ffffff; margin: 0 0 10px 0; line-height: 1.15; letter-spacing: -0.8px;">Welcome to JobPilot AI.</h1>
  <p style="font-family: ${FONT}; font-size: 16px; font-weight: 500; color: #c4c4d8; margin: 0; line-height: 1.5; letter-spacing: -0.2px;">You've just joined a smarter way to manage your career.</p>
</td></tr>

<tr><td style="padding: 36px 52px;"><div style="height: 1px; background: linear-gradient(90deg, #1e1e2e, #2a2a3d, #1e1e2e);"></div></td></tr>

<tr><td style="padding: 0 52px;">
  <p style="font-family: ${FONT}; font-size: 14.5px; color: #8b8ba0; margin: 0; line-height: 1.8; letter-spacing: -0.1px;">Job searching today is overwhelming &mdash; endless applications, resume edits, LinkedIn updates, interview prep, and tracking everything manually.</p>
</td></tr>

<tr><td style="padding: 24px 52px 0 52px;">
  <p style="font-family: ${FONT}; font-size: 14.5px; color: #c4c4d8; margin: 0; line-height: 1.8; letter-spacing: -0.1px;">JobPilot AI helps simplify that process with AI-powered tools designed to help you move faster and stand out better.</p>
</td></tr>

<tr><td style="padding: 40px 52px 0 52px;">
  <p style="font-family: ${FONT}; font-size: 15px; font-weight: 500; color: #c4c4d8; margin: 0 0 22px 0; line-height: 1.5; letter-spacing: -0.1px;">Here's what you can do now:</p>
</td></tr>

<tr><td style="padding: 0 52px 16px 52px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td width="8" valign="top" style="padding-top: 8px;"><div style="width: 6px; height: 6px; border-radius: 6px; background-color: #6366f1;"></div></td><td style="padding-left: 16px;"><p style="font-family: ${FONT}; font-size: 14.5px; font-weight: 500; color: #d4d4dc; margin: 0; line-height: 1.5; letter-spacing: -0.1px;">Optimize your resume</p></td></tr></table></td></tr>

<tr><td style="padding: 0 52px 16px 52px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td width="8" valign="top" style="padding-top: 8px;"><div style="width: 6px; height: 6px; border-radius: 6px; background-color: #818cf8;"></div></td><td style="padding-left: 16px;"><p style="font-family: ${FONT}; font-size: 14.5px; font-weight: 500; color: #d4d4dc; margin: 0; line-height: 1.5; letter-spacing: -0.1px;">Improve your LinkedIn profile</p></td></tr></table></td></tr>

<tr><td style="padding: 0 52px 16px 52px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td width="8" valign="top" style="padding-top: 8px;"><div style="width: 6px; height: 6px; border-radius: 6px; background-color: #a78bfa;"></div></td><td style="padding-left: 16px;"><p style="font-family: ${FONT}; font-size: 14.5px; font-weight: 500; color: #d4d4dc; margin: 0; line-height: 1.5; letter-spacing: -0.1px;">Generate tailored cover letters for each job</p></td></tr></table></td></tr>

<tr><td style="padding: 0 52px 0 52px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td width="8" valign="top" style="padding-top: 8px;"><div style="width: 6px; height: 6px; border-radius: 6px; background-color: #c4b5fd;"></div></td><td style="padding-left: 16px;"><p style="font-family: ${FONT}; font-size: 14.5px; font-weight: 500; color: #d4d4dc; margin: 0; line-height: 1.5; letter-spacing: -0.1px;">Prepare for interviews &mdash; and so much more</p></td></tr></table></td></tr>

<tr><td align="center" style="padding: 40px 52px 0 52px;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
  <tr><td style="border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #7c3aed); text-align: center;">
    <a href="https://jobpilotai.co/dashboard" style="display: inline-block; width: 100%; padding: 16px 0; font-family: ${FONT}; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.2px; box-sizing: border-box;">Check out your dashboard &rarr;</a>
  </td></tr>
  </table>
</td></tr>

<tr><td style="padding: 40px 52px 0 52px;"><div style="height: 1px; background: linear-gradient(90deg, #1e1e2e, #2a2a3d, #1e1e2e);"></div></td></tr>

<tr><td style="padding: 36px 52px 0 52px;">
  <p style="font-family: ${FONT}; font-size: 14.5px; color: #8b8ba0; margin: 0; line-height: 1.8; letter-spacing: -0.1px;">Our goal is simple: help you land interviews faster &mdash; without spending hours on repetitive job hunting tasks.</p>
</td></tr>

<tr><td style="padding: 36px 52px 52px 52px;">
  <p style="font-family: ${FONT}; font-size: 15px; font-weight: 500; color: #c4c4d8; margin: 0 0 8px 0; line-height: 1.5; letter-spacing: -0.1px;">All the best on your journey!</p>
  <p style="font-family: ${FONT_DISPLAY}; font-size: 14px; color: #6366f1; margin: 0; font-weight: 600; letter-spacing: -0.2px;">&mdash; The JobPilot AI Team</p>
</td></tr>

</table>
</td></tr>

<tr><td align="center" style="padding: 32px 48px 48px 48px;">
  <p style="font-family: ${FONT}; font-size: 13px; color: #3f3f4a; margin: 0 0 8px 0; letter-spacing: -0.1px;">Questions? Reply to this email &mdash; we read every one.</p>
  <p style="font-family: ${FONT}; font-size: 12px; color: #27272e; margin: 0;"><a href="https://jobpilotai.co" style="color: #3f3f4a; text-decoration: none;">jobpilotai.co</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;&copy; 2026 JobPilot AI</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
