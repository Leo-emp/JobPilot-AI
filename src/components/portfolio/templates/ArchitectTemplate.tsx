"use client";

/* # Architect Template — Blueprint grid, structural lines, visual project showcase with renders & drawings */
/* # PREMIUM LANDING PAGE — no section should look like a resume, all text sections have visual treatments */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioData, PortfolioSection, GalleryEntry } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { VideoEmbed, hasVideo } from "../shared/VideoEmbed";
import { StatsBar } from "../shared/StatsBar";
import { autoCategorizeSkills } from "@/lib/skill-categories";

const c = {
  bg: "#0c1220",
  surface: "#111827",
  card: "#15202e",
  text: "#e2e8f0",
  muted: "#94a3b8",
  teal: "#2dd4bf",
  tealSoft: "#2dd4bf12",
  blue: "#38bdf8",
  border: "rgba(45, 212, 191, 0.1)",
  gridLine: "rgba(45, 212, 191, 0.06)",
  shadow: "0 8px 40px rgba(0,0,0,0.35)",
};

/* # Unique gradient accents for skill categories and experience entries */
const categoryGradients = [
  { from: "#2dd4bf", to: "#38bdf8" },
  { from: "#38bdf8", to: "#818cf8" },
  { from: "#2dd4bf", to: "#34d399" },
  { from: "#818cf8", to: "#2dd4bf" },
  { from: "#34d399", to: "#38bdf8" },
  { from: "#38bdf8", to: "#2dd4bf" },
];

/* # Blueprint-style card with corner markers */
function BlueprintCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
      whileHover={{ y: -3, boxShadow: `0 8px 30px rgba(45, 212, 191, 0.06)`, transition: { duration: 0.2 } }}
    >
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: `${c.teal}30` }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: `${c.teal}30` }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: `${c.teal}30` }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: `${c.teal}30` }} />
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

/* # Lightbox for full-screen design viewing */
function DesignLightbox({ entry, onClose }: { entry: GalleryEntry; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center cursor-zoom-out"
      style={{ backgroundColor: "rgba(12,18,32,0.97)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{ color: c.muted }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      <motion.div className="max-w-[90vw] max-h-[85vh] relative"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring" as const, damping: 25 }}
        onClick={(e) => e.stopPropagation()}>

        {hasVideo(entry) ? (
          <div className="max-w-5xl mx-auto rounded-xl overflow-hidden" style={{ border: `1px solid ${c.teal}20` }}>
            <VideoEmbed videoUrl={entry.videoUrl} thumbnailUrl={entry.imageUrl || undefined} title={entry.title} accentColor={c.teal} />
          </div>
        ) : (
          <img src={entry.imageUrl} alt={entry.title}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            style={{ border: `1px solid ${c.teal}15` }} />
        )}

        {(entry.title || entry.description) && (
          <div className="mt-4 text-center">
            {entry.title && <h3 className="font-bold text-lg" style={{ color: c.text }}>{entry.title}</h3>}
            {entry.description && <p className="text-sm mt-1" style={{ color: c.muted }}>{entry.description}</p>}
            {entry.category && (
              <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: c.tealSoft, color: c.teal }}>{entry.category}</span>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  /* # Pull first project image as hero background */
  const projectsSection = data.sections.find((s): s is import("@/lib/portfolio-types").ProjectsSection => s.type === "projects" && s.visible);
  const heroImage = projectsSection && projectsSection.entries.length > 0
    ? projectsSection.entries[0].imageUrl : null;

  return (
    <motion.header
      className="relative min-h-screen flex items-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      {/* # Blueprint grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(${c.gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${c.gridLine} 1px, transparent 1px),
          linear-gradient(${c.gridLine} 0.5px, transparent 0.5px),
          linear-gradient(90deg, ${c.gridLine} 0.5px, transparent 0.5px)
        `,
        backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
      }} />

      {/* # Hero project image (subtle, behind content) */}
      {heroImage && (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{
              background: `linear-gradient(90deg, ${c.bg} 0%, ${c.bg}cc 30%, transparent 100%)`,
            }} />
            <div className="absolute inset-0" style={{
              background: `linear-gradient(180deg, ${c.bg}40 0%, transparent 30%, transparent 70%, ${c.bg}60 100%)`,
            }} />
          </div>
        </>
      )}

      {/* # Teal ambient glow */}
      <motion.div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[200px]"
        style={{ background: `radial-gradient(circle, ${c.teal}08, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

      {/* # Decorative measurement line */}
      <div className="absolute top-16 left-8 bottom-16 w-px hidden lg:block" style={{ backgroundColor: `${c.teal}15` }}>
        <div className="absolute top-0 -left-1 w-2.5 h-px" style={{ backgroundColor: `${c.teal}30` }} />
        <div className="absolute bottom-0 -left-1 w-2.5 h-px" style={{ backgroundColor: `${c.teal}30` }} />
        <div className="absolute top-1/2 -translate-y-1/2 -left-8 -rotate-90 text-[10px] tracking-[0.3em] uppercase whitespace-nowrap"
          style={{ color: `${c.teal}30` }}>
          Portfolio
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-16">
        <div className="flex flex-col gap-8">
          {avatarUrl && (
            <motion.div className="shrink-0 relative"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" as const }}>
              <div className="absolute -inset-3 rounded-xl" style={{ border: `1px solid ${c.teal}15` }} />
              <div className="absolute -inset-6 rounded-xl" style={{ border: `1px solid ${c.teal}08` }} />
              <img src={avatarUrl} alt={data.userName}
                className="relative w-32 h-32 rounded-xl object-cover"
                style={{ border: `2px solid ${c.teal}30` }} />
            </motion.div>
          )}
          <div>
            <motion.div className="flex items-center gap-3 mb-5"
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="w-8 h-px" style={{ backgroundColor: c.teal }} />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: c.teal }}>
                {data.tagline || "Architecture · Design · Vision"}
              </span>
            </motion.div>

            <motion.h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
              style={{ color: c.text }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              {data.title || data.userName}
            </motion.h1>

            {about && "bio" in about && about.bio && (
              <motion.p className="mt-8 text-base leading-relaxed max-w-2xl" style={{ color: c.muted }}
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                {about.bio}
              </motion.p>
            )}

            <motion.div className="mt-8"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.teal} iconSize={22} />}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.teal}20, transparent)` }} />
    </motion.header>
  );
}

function SectionHeading({ title, label }: { title: string; label: string }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-2 h-2" style={{ backgroundColor: c.teal }} />
        <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: c.teal }}>{label}</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${c.teal}20, transparent)` }} />
      </div>
      <h2 className="text-3xl font-bold tracking-tight" style={{ color: c.text }}>{title}</h2>
    </div>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <SectionHeading title="Selected Works" label="Projects" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-16">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}>
                {/* # Full-width visual on top, details below */}
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                  {/* # Project visual — video or large image */}
                  <div className="relative w-full group">
                    {hasVideo(p) ? (
                      <VideoEmbed videoUrl={p.videoUrl} thumbnailUrl={p.imageUrl || undefined} title={p.title} accentColor={c.teal} />
                    ) : p.imageUrl ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={p.imageUrl} alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        {/* # Gradient overlay on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{ background: `linear-gradient(180deg, transparent 50%, ${c.teal}08 70%, ${c.bg}90)` }} />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] flex items-center justify-center" style={{ backgroundColor: c.surface }}>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2" style={{
                            border: `1px solid ${c.teal}30`,
                            background: `linear-gradient(135deg, transparent 45%, ${c.teal}15 45%, ${c.teal}15 55%, transparent 55%)`,
                          }} />
                          <p className="text-xs" style={{ color: c.muted }}>Project Render</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* # Project details */}
                  <div className="p-8" style={{ backgroundColor: c.card }}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: c.teal }}>
                          Project {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-2xl font-bold mt-1" style={{ color: c.text }}>{p.title}</h3>
                        <div className="mt-1 w-10 h-px" style={{ backgroundColor: c.teal }} />
                        <p className="mt-4 text-sm leading-relaxed max-w-2xl" style={{ color: c.muted }}>{p.description}</p>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:scale-105"
                            style={{
                              background: `linear-gradient(135deg, ${c.teal}, ${c.blue})`,
                              color: c.bg,
                              boxShadow: `0 4px 20px ${c.teal}30`,
                            }}>
                            View Project →
                          </a>
                        )}
                        {p.repoUrl && (
                          <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:opacity-80"
                            style={{ color: c.teal, border: `1px solid ${c.teal}25` }}>
                            Details
                          </a>
                        )}
                      </div>
                    </div>
                    {p.techStack.length > 0 && (
                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: c.teal }}>Materials & Methods</p>
                        <div className="flex flex-wrap gap-2">
                          {p.techStack.map((t, j) => (
                            <span key={j} className="text-xs px-3 py-1 rounded-md transition-all duration-200"
                              style={{
                                background: `linear-gradient(135deg, ${c.teal}10, ${c.blue}08)`,
                                color: c.teal,
                                border: `1px solid ${c.teal}20`,
                              }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return <DesignGallery section={section} />;

    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Professional Experience" label="Career" />
          {/* # Blueprint-style container with grid lines background */}
          <div className="relative rounded-2xl overflow-hidden" style={{
            background: `linear-gradient(135deg, ${c.card}, ${c.surface})`,
            border: `1px solid ${c.border}`,
          }}>
            {/* # Subtle blueprint grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `linear-gradient(${c.teal} 1px, transparent 1px), linear-gradient(90deg, ${c.teal} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="relative z-10">
              {section.entries.map((e, i) => {
                /* # Each entry gets a unique gradient accent */
                const gradient = categoryGradients[i % categoryGradients.length];
                return (
                  <motion.div key={i} variants={staggerItem}>
                    <motion.div
                      className="relative p-8 group"
                      style={{
                        borderBottom: i < section.entries.length - 1 ? `1px solid ${c.border}` : "none",
                      }}
                      whileHover={{ backgroundColor: `${c.teal}04` }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* # Gradient left accent bar — teal-blue unique per entry */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                        style={{ background: `linear-gradient(180deg, ${gradient.from}, ${gradient.to})` }} />

                      {/* # Blueprint corner markers on this card */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l" style={{ borderColor: `${gradient.from}20` }} />
                      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r" style={{ borderColor: `${gradient.from}20` }} />

                      <div className="flex flex-col md:flex-row md:items-start gap-5 pl-4">
                        {/* # Company badge with gradient background */}
                        <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black relative"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from}18, ${gradient.to}10)`,
                            border: `1px solid ${gradient.from}20`,
                            color: gradient.from,
                          }}>
                          {/* # Decorative measurement tick marks */}
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-1.5" style={{ backgroundColor: `${gradient.from}30` }} />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-1.5" style={{ backgroundColor: `${gradient.from}30` }} />
                          {e.company?.charAt(0)?.toUpperCase() || "C"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                              <p className="text-sm font-semibold mt-1" style={{
                                background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}>
                                {e.company}{e.location ? ` · ${e.location}` : ""}
                              </p>
                            </div>
                            {/* # Date in colored pill */}
                            <span className="inline-flex items-center self-start text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-md shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}08)`,
                                color: gradient.from,
                                border: `1px solid ${gradient.from}18`,
                              }}>
                              {e.startDate} — {e.endDate || "Present"}
                            </span>
                          </div>

                          {/* # Achievements with colored accent markers */}
                          {e.achievements.length > 0 && (
                            <ul className="mt-5 space-y-3">
                              {e.achievements.map((a, j) => (
                                <li key={j} className="text-sm flex items-start gap-3 group/item" style={{ color: c.muted }}>
                                  <span className="shrink-0 mt-1 w-2 h-2 rotate-45 transition-all duration-200 group-hover/item:scale-125"
                                    style={{
                                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                                      boxShadow: `0 0 6px ${gradient.from}25`,
                                    }} />
                                  <span className="leading-relaxed">{a}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </SectionWrapper>
      );

    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Technical Skills" label="Expertise" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g, i) => {
              /* # Each category card gets a unique gradient accent */
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: c.card,
                    border: `1px solid ${c.border}`,
                  }}
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${gradient.from}08` }}
                  transition={{ duration: 0.25 }}
                >
                  {/* # Blueprint corner markers */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: `${gradient.from}25` }} />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: `${gradient.from}25` }} />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: `${gradient.from}25` }} />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: `${gradient.from}25` }} />

                  {/* # Gradient top strip — unique per category */}
                  <div className="h-1" style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }} />

                  <div className="p-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4" style={{
                      background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                      {g.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {g.skills.map((s, j) => (
                        <motion.span key={j}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm cursor-default"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from}08, ${gradient.to}05)`,
                            border: `1px solid ${gradient.from}18`,
                            color: c.text,
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: j * 0.03 }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: `0 0 12px ${gradient.from}15`,
                            backgroundColor: `${gradient.from}12`,
                          }}
                        >
                          {s.name}
                          {s.proficiency && s.proficiency >= 90 && (
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gradient.from }} />
                          )}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );
    }

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Education" label="Academic" />
          <div className="space-y-5">
            {section.entries.map((e, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden group"
                  style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
                  whileHover={{ y: -3, boxShadow: `0 8px 30px ${gradient.from}06` }}
                  transition={{ duration: 0.2 }}
                >
                  {/* # Blueprint corner markers */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: `${gradient.from}25` }} />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: `${gradient.from}25` }} />

                  {/* # Gradient header strip */}
                  <div className="h-1.5" style={{
                    background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to}, transparent)`,
                  }} />

                  <div className="p-7">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1">
                        {/* # Degree name — large and prominent */}
                        <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.degree}</h3>
                        {/* # School in gradient accent color */}
                        <p className="text-sm font-semibold mt-1.5" style={{
                          background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>
                          {e.school}
                        </p>
                        {/* # Decorative measurement line */}
                        <div className="mt-2 w-8 h-px" style={{ backgroundColor: `${gradient.from}30` }} />
                      </div>
                      {/* # Year in gradient badge */}
                      {e.startDate && (
                        <span className="inline-flex items-center self-start text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-md shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}08)`,
                            color: gradient.from,
                            border: `1px solid ${gradient.from}18`,
                          }}>
                          {e.startDate} — {e.endDate || "Present"}
                        </span>
                      )}
                    </div>
                    {e.description && (
                      <p className="text-sm mt-4 leading-relaxed" style={{ color: c.muted }}>{e.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Licenses & Certifications" label="Credentials" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((cert, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.from}06, ${c.card} 30%, ${c.card})`,
                    border: `1px solid ${gradient.from}12`,
                  }}
                  whileHover={{ y: -3, boxShadow: `0 8px 25px ${gradient.from}08` }}
                  transition={{ duration: 0.2 }}
                >
                  {/* # Blueprint corner markers */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: `${gradient.from}20` }} />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: `${gradient.from}20` }} />

                  <div className="p-6 flex items-center gap-4">
                    {/* # Shield/badge-style with gradient fill and glow */}
                    <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(135deg, ${gradient.from}20, ${gradient.to}10)`,
                        border: `1px solid ${gradient.from}25`,
                      }}>
                      {/* # Checkmark with accent glow */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 1 }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                          fill={`${gradient.from}25`} stroke={gradient.from} strokeWidth="1.5" />
                        <path d="M9 12l2 2 4-4" stroke={gradient.from} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {/* # Glow on hover */}
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: `0 0 18px ${gradient.from}15` }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: c.text }}>{cert.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-xs font-medium" style={{ color: gradient.from }}>{cert.issuer}</p>
                        {cert.date && (
                          <span className="text-xs px-2.5 py-0.5 rounded-md font-medium"
                            style={{
                              background: `${gradient.from}10`,
                              color: gradient.from,
                              border: `1px solid ${gradient.from}15`,
                            }}>
                            {cert.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Awards & Recognition" label="Honors" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.entries.map((a, i) => (
              <motion.div key={i}
                className="relative rounded-xl overflow-hidden group"
                style={{
                  backgroundColor: c.card,
                  border: "1px solid rgba(212, 168, 83, 0.12)",
                }}
                whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(212,168,83,0.06)" }}
                transition={{ duration: 0.25 }}
              >
                {/* # Blueprint corner markers with gold accent */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: "rgba(212,168,83,0.2)" }} />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: "rgba(212,168,83,0.2)" }} />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: "rgba(212,168,83,0.2)" }} />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: "rgba(212,168,83,0.2)" }} />

                {/* # Gold/amber gradient accent strip */}
                <div className="h-1" style={{
                  background: "linear-gradient(90deg, #d4a853, #f0d78c, #d4a853)",
                }} />

                <div className="p-7">
                  <div className="flex items-start gap-4">
                    {/* # Trophy-style icon with gold gradient glow */}
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center relative"
                      style={{
                        background: "linear-gradient(135deg, rgba(212,168,83,0.18), rgba(240,215,140,0.08))",
                        border: "1px solid rgba(212,168,83,0.22)",
                      }}>
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: "0 0 20px rgba(212,168,83,0.15)" }} />
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 1 }}>
                        <path d="M8 21h8m-4-4v4m-5-8a5 5 0 0 1-3-4.5V4h16v4.5A5 5 0 0 1 13 13h-2z"
                          stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3"
                          stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg" style={{ color: c.text }}>{a.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-sm font-medium" style={{
                          background: "linear-gradient(90deg, #d4a853, #f0d78c)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>
                          {a.issuer}
                        </span>
                        {a.date && (
                          <span className="text-xs px-2.5 py-0.5 rounded-md font-medium"
                            style={{
                              background: "rgba(212,168,83,0.1)",
                              color: "#d4a853",
                              border: "1px solid rgba(212,168,83,0.15)",
                            }}>
                            {a.date}
                          </span>
                        )}
                      </div>
                      {a.description && <p className="text-sm mt-3 leading-relaxed" style={{ color: c.muted }}>{a.description}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Client Testimonials" label="Reviews" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden group"
                  style={{
                    background: `linear-gradient(145deg, ${gradient.from}04, ${c.card} 40%, ${c.card})`,
                    border: `1px solid ${gradient.from}10`,
                  }}
                  whileHover={{ y: -3, boxShadow: `0 8px 30px ${gradient.from}06` }}
                  transition={{ duration: 0.2 }}
                >
                  {/* # Blueprint corner markers */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: `${gradient.from}20` }} />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: `${gradient.from}20` }} />

                  {/* # Gradient left border accent */}
                  <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full"
                    style={{ background: `linear-gradient(180deg, ${gradient.from}, ${gradient.to})` }} />

                  <div className="p-8 pl-5">
                    {/* # Large decorative gradient quote marks */}
                    <div className="text-5xl font-serif leading-none mb-4 select-none" style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      opacity: 0.4,
                    }}>
                      &ldquo;
                    </div>

                    <p className="text-sm italic leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>

                    {/* # Author with colored avatar badge */}
                    <div className="mt-6 pt-4 flex items-center gap-3" style={{ borderTop: `1px solid ${c.border}` }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${gradient.from}25, ${gradient.to}15)`,
                          color: gradient.from,
                          border: `1px solid ${gradient.from}20`,
                        }}>
                        {t.author?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
                        <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? ` · ${t.company}` : ""}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16">
          {/* # Full-width blueprint-style dark section with teal CTA */}
          <div className="relative max-w-6xl mx-auto rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${c.border}` }}>
            {/* # Background with blueprint grid */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(135deg, ${c.surface} 0%, ${c.card} 50%, ${c.surface} 100%)`,
            }} />
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `linear-gradient(${c.teal} 1px, transparent 1px), linear-gradient(90deg, ${c.teal} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            {/* # Teal glow accent */}
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] rounded-full blur-[120px]"
              style={{ background: c.teal, opacity: 0.04 }} />

            {/* # Blueprint corner markers */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: `${c.teal}25` }} />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-2xl" style={{ borderColor: `${c.teal}25` }} />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-2xl" style={{ borderColor: `${c.teal}25` }} />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: `${c.teal}25` }} />

            <div className="relative z-10 py-20 px-8 md:px-16 text-center">
              {/* # Section label with measurement markers */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-2 h-2" style={{ backgroundColor: c.teal }} />
                <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: c.teal }}>Contact</span>
                <div className="w-2 h-2" style={{ backgroundColor: c.teal }} />
              </div>

              {/* # Large heading */}
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: c.text }}>
                Let&apos;s Build Together
              </h2>
              <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: c.muted }}>
                Looking for an architect who brings vision and precision? Let&apos;s discuss your project.
              </p>

              {/* # Contact info in blueprint-style cards */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {section.email && (
                  <div className="px-5 py-3 rounded-xl flex items-center gap-3 relative"
                    style={{
                      background: `linear-gradient(135deg, ${c.teal}08, ${c.card})`,
                      border: `1px solid ${c.teal}15`,
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.teal} strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="text-sm" style={{ color: c.text }}>{section.email}</span>
                  </div>
                )}
                {section.phone && (
                  <div className="px-5 py-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: `linear-gradient(135deg, ${c.teal}08, ${c.card})`,
                      border: `1px solid ${c.teal}15`,
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.teal} strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="text-sm" style={{ color: c.text }}>{section.phone}</span>
                  </div>
                )}
                {section.location && (
                  <div className="px-5 py-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: `linear-gradient(135deg, ${c.teal}08, ${c.card})`,
                      border: `1px solid ${c.teal}15`,
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.teal} strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-sm" style={{ color: c.text }}>{section.location}</span>
                  </div>
                )}
              </div>

              {/* # Gradient CTA buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                {section.email && (
                  <a href={`mailto:${section.email}`}
                    className="px-10 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${c.teal}, ${c.blue})`,
                      color: c.bg,
                      boxShadow: `0 4px 25px ${c.teal}30`,
                    }}>
                    Start a Conversation
                  </a>
                )}
                {section.calendarLink && (
                  <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                    className="px-10 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                    style={{ color: c.teal, border: `1px solid ${c.teal}25` }}>
                    Schedule Consultation
                  </a>
                )}
              </div>
            </div>
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

/* # Design Gallery with category filters and lightbox */
function DesignGallery({ section }: { section: PortfolioSection & { type: "gallery" } }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [...new Set(section.entries.map((e) => e.category).filter(Boolean))];
  const filtered = activeCategory
    ? section.entries.filter((e) => e.category === activeCategory)
    : section.entries;

  return (
    <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
      <SectionHeading title="Design Gallery" label="Renders & Drawings" />

      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => setActiveCategory(null)}
            className="text-xs px-4 py-2 rounded-md font-medium transition-all"
            style={{
              backgroundColor: !activeCategory ? c.teal : "transparent",
              color: !activeCategory ? c.bg : c.muted,
              border: `1px solid ${!activeCategory ? c.teal : c.border}`,
            }}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="text-xs px-4 py-2 rounded-md font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat ? c.teal : "transparent",
                color: activeCategory === cat ? c.bg : c.muted,
                border: `1px solid ${activeCategory === cat ? c.teal : c.border}`,
              }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[180px] md:auto-rows-[210px] gap-4">
        <AnimatePresence>
          {filtered.map((g, i) => {
            /* # Bento pattern for varying item sizes */
            const bentoClass = (() => {
              const total = filtered.length;
              if (total <= 2) return i === 0 ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-2";
              const pattern = [
                "lg:col-span-2 lg:row-span-2",
                "",
                "lg:row-span-2",
                "",
                "",
                "lg:col-span-2",
              ];
              return pattern[i % pattern.length] || "";
            })();

            return (
              <motion.div key={g.title + i}
                className={`group relative rounded-xl overflow-hidden cursor-pointer ${bentoClass}`}
                style={{ border: `1px solid ${c.border}` }}
                layout
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxIndex(i)}>

                {hasVideo(g) ? (
                  <div className="relative w-full h-full">
                    {g.imageUrl ? (
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-80" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: c.surface }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill={c.muted}><polygon points="8,5 20,12 8,19" /></svg>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${c.teal}50`, boxShadow: `0 0 25px ${c.teal}30` }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full overflow-hidden">
                    <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-80" />
                  </div>
                )}

                {/* # Featured badge on first item */}
                {i === 0 && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                    style={{ backgroundColor: `${c.teal}20`, border: `1px solid ${c.teal}30`, color: c.teal }}>
                    Featured
                  </div>
                )}

                {/* # Gradient overlay on hover with teal tint */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(180deg, transparent 40%, ${c.teal}08 60%, ${c.bg}ee)` }}>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-sm">{g.title}</h3>
                    {g.description && <p className="text-white/60 text-xs mt-1">{g.description}</p>}
                    {g.category && (
                      <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${c.teal}30`, color: c.teal }}>{g.category}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <DesignLightbox entry={filtered[lightboxIndex]} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}

export default function ArchitectTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      <StatsBar data={data} variant="minimal" colors={{
        bg: c.bg, text: c.text, accent: c.teal, muted: c.muted, border: c.border,
      }} />

      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
        ))}

      <footer className="py-16 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.teal }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
