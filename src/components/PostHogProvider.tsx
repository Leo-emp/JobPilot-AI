/* ============================================================
   POSTHOG PROVIDER - Analytics Context Wrapper
   ============================================================
   Initializes PostHog on the client side and identifies
   logged-in users so analytics are tied to their account.
   PostHog is lazy-loaded to reduce initial bundle size.
   ============================================================ */

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPosthog } from "@/lib/posthog";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      getPosthog().then((ph) => {
        ph?.identify(session.user!.id!, {
          email: session.user!.email,
          name: session.user!.name,
        });
      });
    }
  }, [session]);

  return <>{children}</>;
}
