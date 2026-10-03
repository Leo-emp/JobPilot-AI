/* ============================================================
   MODULE PAGE — Section List for a Module
   ============================================================
   # Shows all sections within a module with progress.
   # Links to individual section pages.
   # Redirects to workshop overview if module not found.
   ============================================================ */

import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import WorkshopProgressRing from "@/components/workshops/WorkshopProgressRing";

interface PageProps {
  params: Promise<{ workshopSlug: string; moduleSlug: string }>;
}

export default async function ModulePage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { workshopSlug, moduleSlug } = await params;

  /* # Fetch workshop — try/catch in case tables don't exist on production */
  let workshop;
  try {
    workshop = await dbRetry(() =>
      prisma.workshop.findUnique({
        where: { slug: workshopSlug },
        select: { name: true, color: true, slug: true },
      })
    );
  } catch {
    notFound();
  }

  if (!workshop) notFound();

  /* # Fetch the module with all sections */
  const mod = await dbRetry(() =>
    prisma.workshopModule.findFirst({
      where: { workshop: { slug: workshopSlug }, slug: moduleSlug },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    })
  );

  if (!mod) notFound();

  /* # Fetch user's progress for sections in this module */
  const sectionIds = mod.sections.map((s) => s.id);
  const progress = await dbRetry(() =>
    prisma.workshopProgress.findMany({
      where: { userId: session.user.id, sectionId: { in: sectionIds } },
      select: { sectionId: true, completed: true, bookmarked: true },
    })
  );

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.sectionId));
  const bookmarkedIds = new Set(progress.filter((p) => p.bookmarked).map((p) => p.sectionId));

  const totalSections = mod.sections.length;
  const completedSections = mod.sections.filter((s) => completedIds.has(s.id)).length;
  const totalMinutes = mod.sections.reduce((sum, s) => sum + s.estimatedMinutes, 0);

  /* # Difficulty badge styles */
  const diffBadge: Record<string, string> = {
    beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    advanced: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const typeIcon: Record<string, string> = {
    lesson: "Lesson",
    exercise: "Exercise",
    quiz: "Quiz",
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* # Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6 flex-wrap">
        <Link href="/dashboard/workshops" className="hover:text-white transition-colors">
          Learning Center
        </Link>
        <span>/</span>
        <Link href={`/dashboard/workshops/${workshopSlug}`} className="hover:text-white transition-colors">
          {workshop.name}
        </Link>
        <span>/</span>
        <span className="text-white">{mod.name}</span>
      </nav>

      {/* # Module header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-white mb-2"
          >
            {mod.name}
          </h1>
          <p className="text-text-secondary text-base">{mod.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
            <span>{totalSections} sections</span>
            <span>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m estimated</span>
            {completedSections > 0 && (
              <span style={{ color: workshop.color }}>
                {completedSections}/{totalSections} done
              </span>
            )}
          </div>
        </div>
        {totalSections > 0 && (
          <WorkshopProgressRing
            completed={completedSections}
            total={totalSections}
            color={workshop.color}
            size={56}
          />
        )}
      </div>

      {/* # Progress bar */}
      {totalSections > 0 && (
        <div className="mb-8">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completedSections / totalSections) * 100}%`,
                backgroundColor: workshop.color,
              }}
            />
          </div>
        </div>
      )}

      {/* # Section list */}
      <div className="glass-card overflow-hidden divide-y divide-card-border/50">
        {mod.sections.map((section, i) => {
          const done = completedIds.has(section.id);
          const marked = bookmarkedIds.has(section.id);

          return (
            <Link
              key={section.id}
              href={`/dashboard/workshops/${workshopSlug}/${moduleSlug}/${section.slug}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-space-700/30 transition-colors group"
            >
              {/* # Section number */}
              <span className="text-xs font-mono text-text-muted w-6 text-right shrink-0">{i + 1}</span>

              {/* # Completion indicator */}
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                  done ? "border-transparent" : "border-white/20"
                }`}
                style={done ? { backgroundColor: workshop.color } : undefined}
              >
                {done && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* # Section info */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium block ${done ? "text-text-muted line-through" : "text-text-secondary group-hover:text-white"} transition-colors`}>
                  {section.title}
                </span>
              </div>

              {/* # Badges */}
              <div className="flex items-center gap-2 shrink-0">
                {marked && (
                  <svg className="w-3.5 h-3.5" style={{ color: workshop.color }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                )}
                {section.type !== "lesson" && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-white/10 text-text-muted uppercase">
                    {typeIcon[section.type] || section.type}
                  </span>
                )}
                {section.difficulty && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${diffBadge[section.difficulty] || ""}`}>
                    {section.difficulty}
                  </span>
                )}
                <span className="text-[10px] text-text-muted w-10 text-right">{section.estimatedMinutes}m</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* # Back to workshop link */}
      <div className="mt-6">
        <Link
          href={`/dashboard/workshops/${workshopSlug}`}
          className="text-sm text-text-muted hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to {workshop.name}
        </Link>
      </div>
    </div>
  );
}
