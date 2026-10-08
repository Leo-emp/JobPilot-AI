/* # Server wrapper — gates B2B page with notFound() */
import { notFound } from "next/navigation";
import { isB2BEnabled } from "@/lib/b2b-gate";
import MessagesClient from "./MessagesClient";

export default function MessagesPage() {
  if (!isB2BEnabled()) notFound();
  return <MessagesClient />;
}
