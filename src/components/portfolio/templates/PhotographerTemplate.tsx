"use client";

/* # Photographer Template — Full-bleed gallery, masonry grid, image-forward with category filters & lightbox */

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

              {/* # Hover overlay with title */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: `linear-gradient(180deg, transparent 50%, ${c.bg}ee)` }}>
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
                        <span key={j} className="text-xs px-3 py-1 rounded-full"
                          style={{ backgroundColor: c.surface, color: c.muted, border: `1px solid ${c.border}` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex gap-4">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold px-5 py-2 rounded-lg text-black transition-all hover:opacity-90"
                        style={{ backgroundColor: c.accent }}>
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
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-8">
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem} className="pb-8" style={{ borderBottom: `1px solid ${c.border}` }}>
                <div className="flex flex-col md:flex-row md:justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                    <p className="text-sm mt-0.5" style={{ color: c.muted }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                  </div>
                  <span className="text-xs tracking-wider uppercase shrink-0" style={{ color: c.muted }}>
                    {e.startDate} — {e.endDate || "Present"}
                  </span>
                </div>
                {e.achievements.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {e.achievements.map((a, j) => (
                      <li key={j} className="text-sm flex items-start gap-2" style={{ color: c.muted }}>
                        <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-white/40" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Equipment & Skills" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4" style={{ color: c.muted }}>{g.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s, j) => (
                    <span key={j} className="text-sm px-3.5 py-1.5 rounded-lg"
                      style={{ backgroundColor: c.card, color: c.text, border: `1px solid ${c.border}` }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );
    }

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Awards" />
          <div className="space-y-4">
            {section.entries.map((a, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <h3 className="font-bold" style={{ color: c.text }}>{a.title}</h3>
                <p className="text-sm mt-0.5" style={{ color: c.muted }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                {a.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{a.description}</p>}
              </div>
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
            {section.entries.map((t, i) => (
              <div key={i} className="p-7 rounded-xl" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <p className="text-sm italic leading-relaxed" style={{ color: c.muted }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
                  <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
                  <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? ` · ${t.company}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Education" />
          <div className="space-y-4">
            {section.entries.map((e, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <h3 className="font-bold" style={{ color: c.text }}>{e.degree}</h3>
                <p className="text-sm mt-0.5" style={{ color: c.muted }}>{e.school}</p>
                {e.startDate && <p className="text-xs mt-1" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
            <h2 className="text-3xl font-bold mb-3" style={{ color: c.text }}>Let&apos;s Capture Something Beautiful</h2>
            <p className="text-sm mb-10" style={{ color: c.muted }}>Available for bookings, collaborations, and creative projects.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {section.email && (
                <a href={`mailto:${section.email}`}
                  className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: c.accent, color: c.bg }}>
                  Get in Touch
                </a>
              )}
              {section.calendarLink && (
                <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-80"
                  style={{ color: c.text, border: `1px solid ${c.border}` }}>
                  Book a Session
                </a>
              )}
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
