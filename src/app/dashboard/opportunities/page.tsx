/* # Server wrapper — gates B2B page with notFound() */
import { notFound } from "next/navigation";
import { isB2BEnabled } from "@/lib/b2b-gate";
import OpportunitiesClient from "./OpportunitiesClient";

export default function OpportunitiesPage() {
  if (!isB2BEnabled()) notFound();
  return <OpportunitiesClient />;
}
