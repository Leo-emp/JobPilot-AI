"use client";

/* # Photographer Template — Full-bleed gallery, masonry grid, image-forward with category filters & lightbox */
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
  bg: "#0e0e0e",
  surface: "#171717",
  card: "#1c1c1c",
  text: "#f5f5f5",
  muted: "#888888",
  accent: "#ffffff",
  border: "rgba(255,255,255,0.07)",
  shadow: "0 8px 40px rgba(0,0,0,0.5)",
};

/* # Elegant monochrome gradient accents for category differentiation */
const categoryGradients = [
  { from: "#ffffff", to: "#a0a0a0" },
  { from: "#d4d4d4", to: "#737373" },
  { from: "#e5e5e5", to: "#8a8a8a" },
  { from: "#fafafa", to: "#b0b0b0" },
  { from: "#c8c8c8", to: "#606060" },
  { from: "#f0f0f0", to: "#999999" },
];

/* # Lightbox for full-screen image viewing */
function Lightbox({ entry, onClose }: { entry: GalleryEntry; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center cursor-zoom-out"
      style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* # Close button */}
      <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      <motion.div className="max-w-[90vw] max-h-[85vh] relative"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring" as const, damping: 25 }}
        onClick={(e) => e.stopPropagation()}>

        {hasVideo(entry) ? (
          <div className="max-w-4xl mx-auto rounded-lg overflow-hidden">
            <VideoEmbed videoUrl={entry.videoUrl} thumbnailUrl={entry.imageUrl || undefined} title={entry.title} />
          </div>
        ) : (
          <img src={entry.imageUrl} alt={entry.title}
            className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        )}

        {/* # Caption overlay */}
        {(entry.title || entry.description) && (
          <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-lg"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
            {entry.title && <h3 className="text-white font-bold text-lg">{entry.title}</h3>}
            {entry.description && <p className="text-white/60 text-sm mt-1">{entry.description}</p>}
            {entry.category && (
              <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-white/10 text-white/70">{entry.category}</span>
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
  const gallery = data.sections.find((s) => s.type === "gallery" && s.visible);
  const heroImage = gallery && gallery.type === "gallery" && gallery.entries.length > 0 ? gallery.entries[0].imageUrl : null;

  return (
    <motion.header
      className="relative min-h-screen flex items-end overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
    >
      {heroImage ? (
        <>
          <div className="absolute inset-0">
            <motion.img src={heroImage} alt="Featured work" className="w-full h-full object-cover"
              initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2 }} />
          </div>
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)",
          }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 40%, #1a1a1a 0%, #0e0e0e 100%)",
        }} />
      )}

      <div className="relative z-10 w-full px-6 md:px-16 pb-20 pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            {avatarUrl && (
              <motion.img src={avatarUrl} alt={data.userName}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-white/20 shadow-2xl shrink-0"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} />
            )}
            <div className="flex-1">
              <motion.h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                {data.title || data.userName}
              </motion.h1>
              {data.tagline && (
                <motion.p className="text-lg mt-3 font-light tracking-wide" style={{ color: "rgba(255,255,255,0.65)" }}
                  initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  {data.tagline}
                </motion.p>
              )}
              {about && "bio" in about && about.bio && (
                <motion.p className="mt-5 text-sm leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}
                  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                  {about.bio}
                </motion.p>
              )}
            </div>
            <motion.div className="flex items-center gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color="rgba(255,255,255,0.6)" iconSize={22} />}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-12 flex items-center gap-6">
      <h2 className="text-2xl font-bold tracking-tight" style={{ color: c.text }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${c.border}, transparent)` }} />
    </div>
  );
}

function GallerySection({ section }: { section: PortfolioSection & { type: "gallery" } }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* # Extract unique categories */
  const categories = [...new Set(section.entries.map((e) => e.category).filter(Boolean))];
  const filtered = activeCategory
    ? section.entries.filter((e) => e.category === activeCategory)
    : section.entries;

  return (
    <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
      <SectionHeading title="Portfolio" />

      {/* # Category filter pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className="text-xs px-4 py-2 rounded-full font-medium transition-all"
            style={{
              backgroundColor: !activeCategory ? c.accent : "transparent",
              color: !activeCategory ? c.bg : c.muted,
              border: `1px solid ${!activeCategory ? c.accent : c.border}`,
            }}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              className="text-xs px-4 py-2 rounded-full font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat ? c.accent : "transparent",
                color: activeCategory === cat ? c.bg : c.muted,
                border: `1px solid ${activeCategory === cat ? c.accent : c.border}`,
              }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* # Masonry gallery */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        <AnimatePresence>
          {filtered.map((g, i) => (
            <motion.div key={g.title + i}
              className="break-inside-avoid group relative rounded-lg overflow-hidden cursor-pointer"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setLightboxIndex(i)}>

              {hasVideo(g) ? (
                <div className="relative aspect-video">
                  {g.imageUrl ? (
                    <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-75" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: c.surface }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill={c.muted}><polygon points="8,5 20,12 8,19" /></svg>
                    </div>
                  )}
                  {/* # Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/40 group-hover:bg-black/60 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <img src={g.imageUrl} alt={g.title} className="w-full transition-all duration-700 group-hover:brightness-75" />
              )}

              {/* # Hover overlay with gradient and title */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: `linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.03) 60%, ${c.bg}ee)` }}>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold">{g.title}</h3>
                  {g.description && <p className="text-white/60 text-sm mt-1">{g.description}</p>}
                  {g.category && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">{g.category}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* # Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <Lightbox entry={filtered[lightboxIndex]} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "gallery":
      if (section.entries.length === 0) return null;
      return <GallerySection section={section} />;

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <SectionHeading title="Projects" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-20">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}>
                {/* # Large visual — video or image */}
                <div className="w-full md:w-3/5 rounded-xl overflow-hidden group" style={{ boxShadow: c.shadow, border: `1px solid ${c.border}` }}>
                  {hasVideo(p) ? (
                    <VideoEmbed videoUrl={p.videoUrl} thumbnailUrl={p.imageUrl || undefined} title={p.title} accentColor="#ffffff" />
                  ) : p.imageUrl ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center" style={{ backgroundColor: c.surface }}>
                      <span className="text-4xl" style={{ color: c.border }}>📸</span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-2/5">
                  <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: c.muted }}>
                    Project {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl font-bold mt-2" style={{ color: c.text }}>{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: c.muted }}>{p.description}</p>
                  {p.techStack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.techStack.map((t, j) => (
                        <span key={j} className="text-xs px-3 py-1 rounded-full transition-all duration-200"
                          style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                            color: c.text,
                            border: `1px solid ${c.border}`,
                          }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex gap-4">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold px-5 py-2 rounded-lg text-black transition-all hover:opacity-90 hover:shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${c.accent}, #d4d4d4)`,
                          boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
                        }}>
                        View Project →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Experience" />
          {/* # Elegant dark container for the experience section */}
          <div className="relative rounded-2xl overflow-hidden" style={{
            background: `linear-gradient(135deg, ${c.surface}, ${c.card})`,
            border: `1px solid ${c.border}`,
          }}>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {section.entries.map((e, i) => {
                const gradient = categoryGradients[i % categoryGradients.length];
                return (
                  <motion.div key={i} variants={staggerItem}>
                    <motion.div
                      className="relative p-8 group"
                      style={{
                        borderBottom: i < section.entries.length - 1 ? `1px solid ${c.border}` : "none",
                      }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* # Subtle white left accent border — unique opacity per entry */}
                      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                        style={{ background: `linear-gradient(180deg, ${gradient.from}40, ${gradient.to}15)` }} />

                      <div className="flex flex-col md:flex-row md:items-start gap-5 pl-4">
                        {/* # Company initial badge with subtle gradient */}
                        <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from}12, ${gradient.to}06)`,
                            border: `1px solid ${gradient.from}15`,
                            color: gradient.from,
                          }}>
                          {e.company?.charAt(0)?.toUpperCase() || "C"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                              <p className="text-sm font-medium mt-1" style={{ color: c.accent, opacity: 0.7 }}>
                                {e.company}{e.location ? ` · ${e.location}` : ""}
                              </p>
                            </div>
                            {/* # Date in styled pill */}
                            <span className="inline-flex items-center self-start text-xs font-medium uppercase tracking-wider px-4 py-1.5 rounded-full shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${gradient.from}10, ${gradient.to}05)`,
                                color: gradient.from,
                                opacity: 0.8,
                                border: `1px solid ${gradient.from}12`,
                              }}>
                              {e.startDate} — {e.endDate || "Present"}
                            </span>
                          </div>

                          {/* # Achievements with elegant accent markers */}
                          {e.achievements.length > 0 && (
                            <ul className="mt-5 space-y-3">
                              {e.achievements.map((a, j) => (
                                <li key={j} className="text-sm flex items-start gap-3" style={{ color: c.muted }}>
                                  <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full transition-all duration-200"
                                    style={{
                                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                                      boxShadow: `0 0 4px ${gradient.from}20`,
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
          <SectionHeading title="Equipment & Skills" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g, i) => {
              /* # Each category card gets a unique gradient accent */
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: c.surface,
                    border: `1px solid ${c.border}`,
                  }}
                  whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(255,255,255,0.03)` }}
                  transition={{ duration: 0.25 }}
                >
                  {/* # Gradient top accent — unique per category */}
                  <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${gradient.from}60, ${gradient.to}30, transparent)` }} />

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
                          className="text-sm px-3.5 py-1.5 rounded-lg cursor-default transition-all duration-200"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from}06, ${gradient.to}03)`,
                            color: c.text,
                            border: `1px solid ${gradient.from}10`,
                          }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: `0 0 10px ${gradient.from}10`,
                          }}
                        >
                          {s.name}
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

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Awards" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.entries.map((a, i) => (
              <motion.div key={i}
                className="relative rounded-xl overflow-hidden group"
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid rgba(212, 168, 83, 0.12)`,
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(212,168,83,0.06)" }}
                transition={{ duration: 0.25 }}
              >
                {/* # Gold/amber gradient accent strip */}
                <div className="h-0.5" style={{
                  background: "linear-gradient(90deg, #d4a853, #f0d78c, #d4a853)",
                }} />

                <div className="p-7">
                  <div className="flex items-start gap-4">
                    {/* # Trophy-style icon with gold gradient */}
                    <div className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center relative"
                      style={{
                        background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(240,215,140,0.08))",
                        border: "1px solid rgba(212,168,83,0.2)",
                      }}>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: "0 0 15px rgba(212,168,83,0.15)" }} />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 1 }}>
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
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
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
          <SectionHeading title="Client Words" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden group"
                  style={{
                    background: `linear-gradient(145deg, ${c.surface}, ${c.card})`,
                    border: `1px solid ${gradient.from}08`,
                  }}
                  whileHover={{ y: -3, boxShadow: `0 8px 30px rgba(255,255,255,0.03)` }}
                  transition={{ duration: 0.2 }}
                >
                  {/* # Subtle gradient side accent */}
                  <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full"
                    style={{ background: `linear-gradient(180deg, ${gradient.from}30, transparent)` }} />

                  <div className="p-8 pl-5">
                    {/* # Large decorative gradient quote marks */}
                    <div className="text-5xl font-serif leading-none mb-4 select-none" style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      opacity: 0.3,
                    }}>
                      &ldquo;
                    </div>

                    <p className="text-sm italic leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>

                    {/* # Author with monochrome avatar badge */}
                    <div className="mt-6 pt-4 flex items-center gap-3" style={{ borderTop: `1px solid ${c.border}` }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}08)`,
                          color: gradient.from,
                          border: `1px solid ${gradient.from}15`,
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

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Education" />
          <div className="space-y-5">
            {section.entries.map((e, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden group"
                  style={{
                    backgroundColor: c.surface,
                    border: `1px solid ${c.border}`,
                  }}
                  whileHover={{ y: -3, boxShadow: `0 8px 25px rgba(255,255,255,0.02)` }}
                  transition={{ duration: 0.2 }}
                >
                  {/* # Gradient top border */}
                  <div className="h-0.5" style={{
                    background: `linear-gradient(90deg, ${gradient.from}50, ${gradient.to}25, transparent)`,
                  }} />

                  <div className="p-7">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1">
                        {/* # Degree name — large and prominent */}
                        <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.degree}</h3>
                        {/* # School in accent color */}
                        <p className="text-sm font-medium mt-1" style={{ color: c.accent, opacity: 0.7 }}>{e.school}</p>
                      </div>
                      {/* # Year in gradient badge */}
                      {e.startDate && (
                        <span className="inline-flex items-center self-start text-xs font-medium uppercase tracking-wider px-3.5 py-1 rounded-full shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from}10, ${gradient.to}05)`,
                            color: gradient.from,
                            opacity: 0.8,
                            border: `1px solid ${gradient.from}10`,
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
          <SectionHeading title="Certifications" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((cert, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.from}04, ${c.surface})`,
                    border: `1px solid ${gradient.from}08`,
                  }}
                  whileHover={{ y: -2, boxShadow: `0 6px 20px rgba(255,255,255,0.02)` }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6 flex items-center gap-4">
                    {/* # Badge/shield-style icon */}
                    <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(135deg, ${gradient.from}12, ${gradient.to}06)`,
                        border: `1px solid ${gradient.from}15`,
                      }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4" stroke={gradient.from} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                          fill={`${gradient.from}10`} stroke={gradient.from} strokeWidth="1" strokeOpacity="0.3" />
                      </svg>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: `0 0 12px ${gradient.from}10` }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: c.text }}>{cert.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-xs font-medium" style={{ color: gradient.from, opacity: 0.7 }}>{cert.issuer}</p>
                        {cert.date && (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: `${gradient.from}08`,
                              color: gradient.from,
                              opacity: 0.7,
                              border: `1px solid ${gradient.from}08`,
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

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16">
          {/* # Full-width dark background CTA with clean white accents */}
          <div className="relative max-w-6xl mx-auto rounded-2xl overflow-hidden">
            {/* # Background with subtle gradient */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(135deg, ${c.surface} 0%, #1a1a1a 50%, ${c.surface} 100%)`,
            }} />
            {/* # Subtle decorative white glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

            <div className="relative z-10 py-20 px-8 md:px-16 text-center" style={{ border: `1px solid ${c.border}` }}>
              {/* # Section label */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3))" }} />
                <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: c.accent, opacity: 0.5 }}>Contact</span>
                <div className="w-8 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)" }} />
              </div>

              {/* # Large heading */}
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: c.text }}>
                Let&apos;s Capture Something Beautiful
              </h2>
              <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: c.muted }}>
                Available for bookings, collaborations, and creative projects.
              </p>

              {/* # Contact info in styled cards */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {section.email && (
                  <div className="px-5 py-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                      border: `1px solid ${c.border}`,
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.5" strokeOpacity="0.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="text-sm" style={{ color: c.text }}>{section.email}</span>
                  </div>
                )}
                {section.phone && (
                  <div className="px-5 py-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                      border: `1px solid ${c.border}`,
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.5" strokeOpacity="0.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="text-sm" style={{ color: c.text }}>{section.phone}</span>
                  </div>
                )}
                {section.location && (
                  <div className="px-5 py-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                      border: `1px solid ${c.border}`,
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.5" strokeOpacity="0.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-sm" style={{ color: c.text }}>{section.location}</span>
                  </div>
                )}
              </div>

              {/* # CTA buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                {section.email && (
                  <a href={`mailto:${section.email}`}
                    className="px-10 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${c.accent}, #d4d4d4)`,
                      color: c.bg,
                      boxShadow: "0 4px 25px rgba(255,255,255,0.1)",
                    }}>
                    Get in Touch
                  </a>
                )}
                {section.calendarLink && (
                  <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                    className="px-10 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                    style={{ color: c.text, border: `1px solid ${c.border}` }}>
                    Book a Session
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

export default function PhotographerTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      <StatsBar data={data} variant="minimal" colors={{
        bg: c.bg, text: c.text, accent: c.text, muted: c.muted, border: c.border,
      }} />

      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
        ))}

      <footer className="py-16 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.text }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
