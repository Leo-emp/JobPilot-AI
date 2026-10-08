/* # Server wrapper — gates B2B page with notFound() */
import { notFound } from "next/navigation";
import { isB2BEnabled } from "@/lib/b2b-gate";
import BookmarksClient from "./BookmarksClient";

export default function BookmarksPage() {
  if (!isB2BEnabled()) notFound();
  return <BookmarksClient />;
}
