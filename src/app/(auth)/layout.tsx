/* ============================================================
   AUTH LAYOUT - Shared Layout for Login & Signup Pages
   ============================================================
   This layout wraps the login and signup pages.
   It centers the auth form on the page with the star field
   background behind it. The (auth) folder name with parentheses
   means it's a "route group" — it shares this layout but doesn't
   add /auth to the URL. So /login and /signup just work directly.
   ============================================================ */

import StarField from "@/components/StarField";
import Link from "next/link";
import RocketIcon from "@/components/RocketIcon";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated star background */}
      <StarField />

      {/* Top bar with logo — links back to landing page */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-1">
          <RocketIcon size={28} />
          <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-tight text-text-primary">
            JobPilot AI
          </span>
        </Link>
      </div>

      {/* Center the auth form on the page */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">
        {children}
      </div>
    </div>
  );
}
