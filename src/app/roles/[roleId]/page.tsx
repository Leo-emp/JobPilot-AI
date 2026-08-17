/* ============================================================
   PUBLIC ROLE DETAIL — Single role view with apply/interest
   ============================================================
   Public page showing full role details. Logged-in candidates
   see an "I'm interested" button that creates a bookmark signal.

   Gated behind B2B_ENABLED.
   ============================================================ */

import { notFound } from "next/navigation";
import { isB2BEnabled } from "@/lib/b2b-gate";
import RoleDetailClient from "./RoleDetailClient";

export default function RoleDetailPage() {
  if (!isB2BEnabled()) {
    notFound();
  }

  return <RoleDetailClient />;
}
