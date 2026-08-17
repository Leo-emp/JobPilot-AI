/* ============================================================
   PUBLIC COMPANY PROFILE — Employer's public-facing page
   ============================================================
   Shows employer details and their active roles.
   Uses slug for SEO-friendly URLs.

   Gated behind B2B_ENABLED — returns 404 when B2B is off.
   ============================================================ */

import { notFound } from "next/navigation";
import { isB2BEnabled } from "@/lib/b2b-gate";
import CompanyProfileClient from "./CompanyProfileClient";

export default function CompanyProfilePage() {
  /* # Gate behind B2B feature flag */
  if (!isB2BEnabled()) {
    notFound();
  }

  return <CompanyProfileClient />;
}
