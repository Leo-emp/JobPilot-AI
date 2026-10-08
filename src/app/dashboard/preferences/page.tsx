/* # Server wrapper — gates B2B page with notFound() */
import { notFound } from "next/navigation";
import { isB2BEnabled } from "@/lib/b2b-gate";
import PreferencesClient from "./PreferencesClient";

export default function PreferencesPage() {
  if (!isB2BEnabled()) notFound();
  return <PreferencesClient />;
}
