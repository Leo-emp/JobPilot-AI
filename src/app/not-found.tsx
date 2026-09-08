/* ============================================================
   404 NOT FOUND PAGE
   ============================================================
   Custom space-themed 404 page. Shows when a user navigates
   to a route that doesn't exist. Includes a fun lost-in-space
   message and links back to safety.
   ============================================================ */

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";


const StarField = dynamic(() => import("@/components/StarField"));

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Star field background */}
      <StarField />

      {/* Top bar with logo */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center">
          <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-tight glow-text-strong">
            JobPilot AI
          </span>
        </Link>
      </div>

      {/* Centered 404 content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">
        <div className="text-center max-w-lg">
          {/* Large 404 number with glow effect */}
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-8xl sm:text-9xl font-bold glow-text-strong mb-4">
            404
          </h1>

          {/* # Mascot oops — apologetic pose for the lost page */}
          <Image
            src="/mascot/mascot-oops.png"
            alt="Oops! Page not found"
            width={140}
            height={140}
            className="mx-auto mb-4 drop-shadow-[0_0_24px_rgba(139,92,246,0.3)]"
            priority
          />

          {/* Fun message */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Lost in Space
          </h2>
          <p className="text-text-secondary text-lg mb-10 leading-relaxed">
            This page has drifted beyond our orbit.
            Let&apos;s get you back on course.
          </p>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
