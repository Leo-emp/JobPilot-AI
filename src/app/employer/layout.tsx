/* ============================================================
   EMPLOYER LAYOUT — Protected employer dashboard shell
   ============================================================
   Mirrors the dashboard layout. Auth enforced by proxy.ts.
   ============================================================ */

import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import EmployerSidebar from "@/components/EmployerSidebar";
import { isB2BEnabled } from "@/lib/b2b-gate";

const StarField = dynamic(() => import("@/components/StarField"));

async function EmployerShell({ children }: { children: React.ReactNode }) {
  /* # B2B feature gate — entire employer dashboard is hidden until enabled */
  if (!isB2BEnabled()) {
    notFound();
  }

  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <EmployerSidebar userName={session.user.name || "User"} />
      <main className="relative z-10 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-8 lg:p-10 max-w-6xl">
          {children}
        </div>
      </main>
    </SessionProvider>
  );
}

function EmployerSkeleton() {
  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-space-800 border-r border-card-border flex-col z-40">
        <div className="p-6 border-b border-card-border">
          <div className="h-7 w-32 bg-space-700 rounded-lg animate-pulse" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
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

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <StarField />
      <Suspense fallback={<EmployerSkeleton />}>
        <EmployerShell>{children}</EmployerShell>
      </Suspense>
    </div>
  );
}
