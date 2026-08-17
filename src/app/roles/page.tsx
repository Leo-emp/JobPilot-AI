/* ============================================================
   PUBLIC JOB BOARD — Browse all active roles
   ============================================================
   Public page (no auth needed). Shows active roles from verified
   employers with search, filters, and pagination.

   Gated behind B2B_ENABLED — returns 404 when B2B is off.
   ============================================================ */

import { notFound } from "next/navigation";
import { isB2BEnabled } from "@/lib/b2b-gate";
import JobBoardClient from "./JobBoardClient";

export const metadata = {
  title: "Job Board | JobPilot AI",
  description: "Browse AI-matched roles from verified employers.",
};

export default function RolesPage() {
  if (!isB2BEnabled()) {
    notFound();
  }

  return <JobBoardClient />;
}
