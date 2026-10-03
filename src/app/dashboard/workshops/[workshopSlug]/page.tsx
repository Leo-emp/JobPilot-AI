/* ============================================================
   WORKSHOP OVERVIEW PAGE — Module List for a Profession
   ============================================================
   # Shows all modules within a profession with progress tracking.
   # Links to individual module pages.
   ============================================================ */

import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import WorkshopProgressRing from "@/components/workshops/WorkshopProgressRing";

interface PageProps {
  params: Promise<{ workshopSlug: string }>;
}

export default async function WorkshopOverviewPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { workshopSlug } = await params;

  /* # Fetch the workshop with all modules and sections */
  const workshop = await dbRetry(() =>
    prisma.workshop.findUnique({
      where: { slug: workshopSlug },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            sections: {
              orderBy: { order: "asc" },
              select: { id: true, slug: true, title: true, type: true, difficulty: true, estimatedMinutes: true },
            },
          },
        },
      },
    })
  );

  if (!workshop) notFound();

  /* # Fetch user's progress for this workshop */
  const allSectionIds = workshop.modules.flatMap((m) => m.sections.map((s) => s.id));
  const progress = await dbRetry(() =>
    prisma.workshopProgress.findMany({
      where: { userId: session.user.id, sectionId: { in: allSectionIds } },
      select: { sectionId: true, completed: true },
    })
  );

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.sectionId));

  /* # Calculate overall workshop progress */
  const totalSections = allSectionIds.length;
  const completedSections = allSectionIds.filter((id) => completedIds.has(id)).length;

  /* # Difficulty badge colors */
  const difficultyColor: Record<string, string> = {
    beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    advanced: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  /* # Section type icons */
  const typeLabel: Record<string, string> = {
    lesson: "Lesson",
    exercise: "Exercise",
    quiz: "Quiz",
  };

  return (
    <div>
      {/* # Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/dashboard/workshops" className="hover:text-white transition-colors">
          Learning Center
        </Link>
        <span>/</span>
        <span className="text-white">{workshop.name}</span>
      </nav>

      {/* # Workshop header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: workshop.color }}
          >
            {workshop.name}
          </h1>
          <p className="text-text-secondary text-base">{workshop.description}</p>
        </div>
        {totalSections > 0 && (
          <WorkshopProgressRing
            completed={completedSections}
            total={totalSections}
            color={workshop.color}
            size={64}
          />
        )}
      </div>

      {/* # Overall progress bar */}
      {totalSections > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-secondary">Overall Progress</span>
            <span className="text-text-muted">
              {completedSections} of {totalSections} sections completed
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalSections > 0 ? (completedSections / totalSections) * 100 : 0}%`,
                backgroundColor: workshop.color,
              }}
            />
          </div>
        </div>
      )}

      {/* # Module cards */}
      <div className="space-y-6">
        {workshop.modules.map((mod, i) => {
          const modCompleted = mod.sections.filter((s) => completedIds.has(s.id)).length;
          const modTotal = mod.sections.length;
          const modEstimate = mod.sections.reduce((sum, s) => sum + s.estimatedMinutes, 0);

          return (
            <div key={mod.id} className="glass-card overflow-hidden">
              {/* # Module header */}
              <div className="p-6 border-b border-card-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* # Module number badge */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold border"
                      style={{
                        backgroundColor: `${workshop.color}15`,
                        borderColor: `${workshop.color}30`,
                        color: workshop.color,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{mod.name}</h2>
                      <p className="text-sm text-text-secondary mt-0.5">{mod.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-text-muted">{Math.round(modEstimate / 60)}h {modEstimate % 60}m</span>
                    {modTotal > 0 && (
                      <WorkshopProgressRing
                        completed={modCompleted}
                        total={modTotal}
                        color={workshop.color}
                        size={40}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* # Section list */}
              <div className="divide-y divide-card-border/50">
                {mod.sections.map((section) => {
                  const done = completedIds.has(section.id);
                  return (
                    <Link
                      key={section.id}
                      href={`/dashboard/workshops/${workshopSlug}/${mod.slug}/${section.slug}`}
                      className="flex items-center gap-4 px-6 py-3.5 hover:bg-space-700/30 transition-colors group"
                    >
                      {/* # Completion checkbox */}
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          done
                            ? "border-transparent"
                            : "border-white/20"
                        }`}
                        style={done ? { backgroundColor: workshop.color } : undefined}
                      >
                        {done && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* # Section title */}
                      <span className={`flex-1 text-sm ${done ? "text-text-muted line-through" : "text-text-secondary group-hover:text-white"} transition-colors`}>
                        {section.title}
                      </span>

                      {/* # Badges */}
                      <div className="flex items-center gap-2 shrink-0">
                        {section.type !== "lesson" && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-white/10 text-text-muted uppercase">
                            {typeLabel[section.type] || section.type}
                          </span>
                        )}
                        {section.difficulty && (
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${difficultyColor[section.difficulty] || ""}`}>
                            {section.difficulty}
                          </span>
                        )}
                        <span className="text-[10px] text-text-muted w-10 text-right">{section.estimatedMinutes}m</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
