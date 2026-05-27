"use client";

/* # Photographer Template — Full-bleed gallery, image-forward design, minimal chrome */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";

const c = {
  bg: "#111111",
  surface: "#1a1a1a",
  card: "#1e1e1e",
  text: "#f5f5f5",
  muted: "#999999",
  accent: "#ffffff",
  border: "rgba(255,255,255,0.08)",
  shadow: "0 4px 30px rgba(0,0,0,0.4)",
};

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
      {/* # Full-bleed background image from gallery */}
      {heroImage ? (
        <>
          <div className="absolute inset-0">
            <img src={heroImage} alt="Featured work" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.85) 100%)",
          }} />
        </>
      ) : (
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 40%, #222 0%, #111 100%)",
        }} />
      )}

      <div className="relative z-10 w-full px-6 md:px-16 pb-16 pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            {avatarUrl && (
              <motion.img src={avatarUrl} alt={data.userName}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-white/20 shadow-2xl shrink-0"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} />
            )}
            <div className="flex-1">
              <motion.h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-none"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                {data.title || data.userName}
              </motion.h1>
              {data.tagline && (
                <motion.p className="text-lg mt-3 font-light tracking-wide" style={{ color: "rgba(255,255,255,0.7)" }}
                  initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  {data.tagline}
                </motion.p>
              )}
            </div>
            <motion.div className="flex items-center gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color="rgba(255,255,255,0.7)" iconSize={22} />}
            </motion.div>
          </div>
          {about && "bio" in about && about.bio && (
            <motion.p className="mt-6 text-base leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.6)" }}
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              {about.bio}
            </motion.p>
          )}
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

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <SectionHeading title="Portfolio" />
          {/* # Masonry gallery — photographer's primary showcase */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {section.entries.map((g, i) => (
              <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="block break-inside-avoid group relative rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.01 }}>
                <img src={g.imageUrl} alt={g.title} className="w-full transition-all duration-700 group-hover:brightness-75" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background: `linear-gradient(180deg, transparent 60%, ${c.bg}ee)` }}>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold">{g.title}</h3>
                    {g.description && <p className="text-white/60 text-sm mt-1">{g.description}</p>}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <SectionHeading title="Projects" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-16">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}>
                {/* # Large project image */}
                <div className="w-full md:w-3/5 rounded-xl overflow-hidden group" style={{ boxShadow: c.shadow }}>
                  {p.imageUrl ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center" style={{ backgroundColor: c.surface }}>
                      <span className="text-4xl" style={{ color: c.border }}>📸</span>
                    </div>
                  )}
                </div>
                {/* # Project details */}
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
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold hover:underline" style={{ color: c.muted }}>
                        Details
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

    case "skills":
      if (section.groups.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Equipment & Skills" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.groups.map((g, i) => (
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
                {e.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{e.description}</p>}
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

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
                <p className="text-sm italic leading-relaxed" style={{ color: c.muted }}>"{t.quote}"</p>
                <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
                  <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
                  <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? ` · ${t.company}` : ""}</p>
                </div>
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
            <h2 className="text-3xl font-bold mb-3" style={{ color: c.text }}>Let's Capture Something Beautiful</h2>
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

      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
        ))}

      <footer className="py-10 text-center text-xs" style={{ color: c.muted }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.text }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
