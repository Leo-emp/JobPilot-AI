/* ============================================================
   FOR EMPLOYERS — Marketing landing page
   ============================================================
   Public page showcasing the AI Recruiter-as-a-Service for
   employers. Pricing tiers, features, how it works, signup CTA.

   Gated behind B2B_ENABLED — returns 404 when B2B is off.
   ============================================================ */

import { notFound } from "next/navigation";
import { isB2BEnabled } from "@/lib/b2b-gate";
import ForEmployersClient from "./ForEmployersClient";

export const metadata = {
  title: "For Employers | JobPilot AI",
  description: "AI-powered recruiting. Post roles, get matched candidates, hire faster.",
};

export default function ForEmployersPage() {
  /* # Gate behind B2B feature flag */
  if (!isB2BEnabled()) {
    notFound();
  }

  return <ForEmployersClient />;
}
