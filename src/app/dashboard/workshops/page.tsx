/* ============================================================
   WORKSHOP LANDING PAGE — Learning Center
   ============================================================
   # Shows all 7 profession workshops as cards with progress rings.
   # Each card links to the profession overview page.
   # Progress calculated from WorkshopProgress table per user.
   ============================================================ */

import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import WorkshopProgressRing from "@/components/workshops/WorkshopProgressRing";

/* # Workshop metadata for the landing page cards */
const WORKSHOP_ICONS: Record<string, React.ReactNode> = {
  "software-engineer": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  "backend-engineer": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
    </svg>
  ),
  "frontend-engineer": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  ),
  "full-stack-engineer": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    </svg>
  ),
  "ai-engineer": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  "ai-product-manager": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
    </svg>
  ),
  "ict-project-manager": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
  ),
};

export default async function WorkshopsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  /* # Wrap in try/catch — Workshop tables may not exist on production yet */
  let workshopData: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    order: number;
    totalSections: number;
    completedSections: number;
    totalModules: number;
  }[] = [];

  try {
    /* # Fetch all workshops with module/section counts */
    const workshops = await dbRetry(() =>
      prisma.workshop.findMany({
        orderBy: { order: "asc" },
        include: {
          modules: {
            include: {
              sections: {
                select: { id: true },
              },
            },
          },
        },
      })
    );

    /* # Fetch user's progress across all workshops */
    const progress = await dbRetry(() =>
      prisma.workshopProgress.findMany({
        where: { userId: session.user.id, completed: true },
        select: { sectionId: true },
      })
    );

    const completedIds = new Set(progress.map((p) => p.sectionId));

    /* # Calculate per-workshop completion */
    workshopData = workshops.map((w) => {
      const totalSections = w.modules.reduce((sum, m) => sum + m.sections.length, 0);
      const completedSections = w.modules.reduce(
        (sum, m) => sum + m.sections.filter((s) => completedIds.has(s.id)).length,
        0
      );
      return {
        ...w,
        totalSections,
        completedSections,
        totalModules: w.modules.length,
      };
    });
  } catch {
    /* # Tables don't exist yet — show empty state gracefully */
    workshopData = [];
  }

  return (
    <div>
      {/* # Page header */}
      <div className="mb-10">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold mb-2">
          Learning Center
        </h1>
        <p className="text-text-secondary text-base">
          Full-depth professional workshops with exercises, quizzes, and templates. Zero AI calls — all content is free.
        </p>
      </div>

      {/* # Workshop grid */}
      {workshopData.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-text-secondary text-lg mb-2">Workshops are being built</p>
          <p className="text-text-muted text-sm">Check back soon — profession-specific workshops with exercises and templates are on the way.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workshopData.map((workshop) => (
            <Link
              key={workshop.id}
              href={`/dashboard/workshops/${workshop.slug}`}
              className="glass-card p-6 hover:border-white/20 transition-all group"
            >
              {/* # Icon + progress ring row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${workshop.color}15`,
                    borderColor: `${workshop.color}30`,
                    color: workshop.color,
                  }}
                >
                  {WORKSHOP_ICONS[workshop.slug] || (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                {workshop.totalSections > 0 && (
                  <WorkshopProgressRing
                    completed={workshop.completedSections}
                    total={workshop.totalSections}
                    color={workshop.color}
                    size={48}
                  />
                )}
              </div>

              {/* # Workshop name and description */}
              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
                {workshop.name}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {workshop.description}
              </p>

              {/* # Stats row */}
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span>{workshop.totalModules} modules</span>
                <span>{workshop.totalSections} sections</span>
                {workshop.completedSections > 0 && (
                  <span style={{ color: workshop.color }}>
                    {workshop.completedSections}/{workshop.totalSections} done
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
