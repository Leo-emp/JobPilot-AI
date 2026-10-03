/* ============================================================
   SECTION PAGE — Individual Workshop Section
   ============================================================
   # Renders a single section's content: lessons, exercises, quizzes.
   # Content is stored as Markdown in the database.
   # Exercises and quizzes are embedded via JSON markers in content.
   # Progress is tracked per-user per-section.
   ============================================================ */

import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import SectionContent from "@/components/workshops/SectionContent";
import SectionActions from "@/components/workshops/SectionActions";

interface PageProps {
  params: Promise<{ workshopSlug: string; moduleSlug: string; sectionSlug: string }>;
}

export default async function SectionPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { workshopSlug, moduleSlug, sectionSlug } = await params;

  /* # Fetch the workshop for breadcrumbs + color */
  const workshop = await dbRetry(() =>
    prisma.workshop.findUnique({
      where: { slug: workshopSlug },
      select: { name: true, color: true, slug: true },
    })
  );

  if (!workshop) notFound();

  /* # Fetch the module */
  const mod = await dbRetry(() =>
    prisma.workshopModule.findFirst({
      where: { workshop: { slug: workshopSlug }, slug: moduleSlug },
      select: { id: true, name: true, slug: true },
    })
  );

  if (!mod) notFound();

  /* # Fetch the current section */
  const section = await dbRetry(() =>
    prisma.workshopSection.findFirst({
      where: { module: { id: mod.id }, slug: sectionSlug },
    })
  );

  if (!section) notFound();

  /* # Fetch user's progress for this section */
  const progress = await dbRetry(() =>
    prisma.workshopProgress.findUnique({
      where: { userId_sectionId: { userId: session.user.id, sectionId: section.id } },
    })
  );

  /* # Fetch all sections in this module for prev/next navigation */
  const allSections = await dbRetry(() =>
    prisma.workshopSection.findMany({
      where: { moduleId: mod.id },
      orderBy: { order: "asc" },
      select: { id: true, slug: true, title: true, order: true },
    })
  );

  /* # Find current index for prev/next */
  const currentIndex = allSections.findIndex((s) => s.id === section.id);
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  /* # Difficulty badge styles */
  const diffBadge: Record<string, string> = {
    beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    advanced: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  /* # Type label map */
  const typeLabel: Record<string, string> = {
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
        <span className="text-white">{section.title}</span>
      </nav>

      {/* # Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          {/* # Type badge */}
          <span
            className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border"
            style={{ borderColor: `${workshop.color}30`, color: workshop.color, backgroundColor: `${workshop.color}10` }}
          >
            {typeLabel[section.type] || section.type}
          </span>
          {/* # Difficulty badge */}
          {section.difficulty && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${diffBadge[section.difficulty] || ""}`}>
              {section.difficulty}
            </span>
          )}
          {/* # Time estimate */}
          <span className="text-xs text-text-muted">{section.estimatedMinutes} min</span>
        </div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold text-white">
          {section.title}
        </h1>
      </div>

      {/* # Content area */}
      <div className="glass-card p-6 sm:p-8 mb-8">
        <SectionContent content={section.content} sectionId={section.id} color={workshop.color} />
      </div>

      {/* # Section actions: mark complete, bookmark, notes */}
      <SectionActions
        sectionId={section.id}
        completed={progress?.completed || false}
        bookmarked={progress?.bookmarked || false}
        notes={progress?.notes || ""}
        color={workshop.color}
      />

      {/* # Prev/Next navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-card-border">
        {prevSection ? (
          <Link
            href={`/dashboard/workshops/${workshopSlug}/${moduleSlug}/${prevSection.slug}`}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="max-w-[200px] truncate">{prevSection.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextSection ? (
          <Link
            href={`/dashboard/workshops/${workshopSlug}/${moduleSlug}/${nextSection.slug}`}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors group"
          >
            <span className="max-w-[200px] truncate">{nextSection.title}</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ) : (
          /* # Link back to module overview when at last section */
          <Link
            href={`/dashboard/workshops/${workshopSlug}`}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: workshop.color }}
          >
            <span>Back to modules</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
