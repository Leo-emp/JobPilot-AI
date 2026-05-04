/* ============================================================
   DASHBOARD LAYOUT - Protected App Shell
   ============================================================
   This layout wraps ALL dashboard pages (/dashboard/*).
   It checks for authentication — if not logged in, redirects to /login.
   Shows the sidebar navigation and provides the main content area.
   The star field background carries through for visual consistency.
   ============================================================ */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import StarField from "@/components/StarField";
import DashboardSidebar from "@/components/DashboardSidebar";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ---- Auth Check ---- */
  /* auth() returns the session on the server side */
  /* If no session exists, redirect to the login page */
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    /* SessionProvider makes useSession() available in all child components */
    <SessionProvider session={session}>
      <div className="min-h-screen">
        {/* Star field background (behind everything) */}
        <StarField />

        {/* Sidebar navigation */}
        <DashboardSidebar userName={session.user.name || "User"} />

        {/* ---- Main Content Area ---- */}
        {/* lg:ml-64 pushes content right to make room for the desktop sidebar */}
        {/* pt-16 on mobile accounts for the fixed top header bar */}
        <main className="relative z-10 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
          <div className="p-6 sm:p-8 lg:p-10 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
