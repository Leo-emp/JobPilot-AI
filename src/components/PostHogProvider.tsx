/* ============================================================
   POSTHOG PROVIDER - Analytics Context Wrapper
   ============================================================
   Initializes PostHog on the client side and identifies
   logged-in users so analytics are tied to their account.
   ============================================================ */

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { posthog } from "@/lib/posthog";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  /* Identify user when they log in so events are tied to their account */
  useEffect(() => {
    if (session?.user?.id && posthog) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
    }
  }, [session]);

  return <>{children}</>;
}
