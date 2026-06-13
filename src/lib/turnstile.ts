/* ============================================================
   CLOUDFLARE TURNSTILE — Bot Protection for Auth Routes
   ============================================================
   Verifies the Turnstile token sent from the client. Only
   enforced when TURNSTILE_SECRET_KEY is set (production).
   In dev mode or when unconfigured, verification is skipped.

   Setup: Add TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY
   to your Vercel env vars after registering at
   https://dash.cloudflare.com/?to=/:account/turnstile
   ============================================================ */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  /* # Skip verification when Turnstile isn't configured */
  if (!secret) return true;

  if (!token) return false;

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = await res.json();
    return data.success === true;
  } catch {
    /* # Network failure — fail open to avoid blocking real users */
    return true;
  }
}
