/* ============================================================
   DASHBOARD LAYOUT - Protected App Shell
   ============================================================
   This layout wraps ALL dashboard pages (/dashboard/*).
   Auth redirect is handled by proxy.ts at the edge.
   This layout fetches session data for the sidebar and checks 2FA.
   The star field background carries through for visual consistency.
   ============================================================ */

import { redirect } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/DashboardSidebar";
import { SessionProvider } from "next-auth/react";
import PostHogProvider from "@/components/PostHogProvider";

const StarField = dynamic(() => import("@/components/StarField"));
const FeedbackWidget = dynamic(() => import("@/components/FeedbackWidget"));

/* Async inner shell — loads session while outer shell renders instantly */
async function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.twoFactorPending) {
    redirect("/verify-2fa");
  }

  return (
    <SessionProvider session={session}>
      <PostHogProvider>
        <DashboardSidebar
          userName={session.user.name || "User"}
          isAdmin={session.user.isAdmin}
        />

        <main className="relative z-10 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
          <div className="p-4 sm:p-8 lg:p-10 max-w-6xl">
            {children}
          </div>
        </main>

        <FeedbackWidget />
      </PostHogProvider>
    </SessionProvider>
  );
}

/* Skeleton sidebar shown while auth loads on first entry */
function SidebarSkeleton() {
  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-space-800 border-r border-card-border flex-col z-40">
        <div className="p-6 border-b border-card-border">
          <div className="h-7 w-32 bg-space-700 rounded-lg animate-pulse" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="h-10 bg-space-700 rounded-xl animate-pulse" />
          ))}
        </nav>
      </aside>
      <main className="relative z-10 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-8 lg:p-10 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
            <div className="h-5 w-96 bg-space-700 rounded-lg mb-10" />
          </div>
        </div>
      </main>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <StarField />
      <Suspense fallback={<SidebarSkeleton />}>
        <AuthenticatedShell>{children}</AuthenticatedShell>
      </Suspense>
    </div>
  );
}
