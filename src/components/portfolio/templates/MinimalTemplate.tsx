"use client";

/* # Minimal Template v2 — Pearl × Graphite dual-tone, edge-to-edge typography, whitespace-driven */

import Image from "next/image";
import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { SkillBar } from "../shared/SkillBar";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { autoCategorizeSkills } from "@/lib/skill-categories";

/* # Dual-tone palette: Pearl × Graphite — ultra-clean, type-driven */
const c = {
  bg: "#fafafa",
  bgAlt: "#f5f5f5",
  surface: "#ffffff",
  pearl: "#e8e4df",
  graphite: "#2d2d2d",
  text: "#1a1a1a",
  muted: "#737373",
  heading: "#0a0a0a",
  border: "#e5e5e5",
  accent: "#404040",
  accentSoft: "#40404008",
  gradient: "linear-gradient(135deg, #2d2d2d, #737373)",
};

/* # Accent colors — monochromatic for minimal aesthetic */
const ENTRY_GRADIENTS = [
  { from: "#2d2d2d", to: "#525252" },
  { from: "#404040", to: "#737373" },
  { from: "#171717", to: "#404040" },
  { from: "#525252", to: "#a3a3a3" },
  { from: "#262626", to: "#525252" },
];

const DEMO = {
  projects: [
    { title: "Architecture", img: "https://picsum.photos/seed/arch/800/500" },
    { title: "Typography", img: "https://picsum.photos/seed/type/600/400" },
    { title: "Composition", img: "https://picsum.photos/seed/comp/600/400" },
    { title: "Space", img: "https://picsum.photos/seed/space/600/400" },
  ],
  gallery: [
    { title: "Form", img: "https://picsum.photos/seed/form/600/500" },
    { title: "Light", img: "https://picsum.photos/seed/light/500/600" },
    { title: "Shadow", img: "https://picsum.photos/seed/shadow/600/400" },
    { title: "Texture", img: "https://picsum.photos/seed/texture/500/500" },
    { title: "Line", img: "https://picsum.photos/seed/line/600/400" },
    { title: "Pattern", img: "https://picsum.photos/seed/ptrn/500/600" },
  ],
};

/* # Minimal section heading — large type, horizontal rule */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold tracking-tight" style={{ color: c.heading }}>
        {children}
      </h2>
      <div className="mt-4 h-px w-full" style={{ backgroundColor: c.border }} />
    </div>
  );
}

/* # Hero — edge-to-edge typography, massive name, minimal ornament */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header className="relative min-h-[80vh] flex items-end overflow-hidden pb-20"
      style={{ backgroundColor: c.bg }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      {/* # Subtle dot grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, ${c.graphite} 0.5px, transparent 0.5px)`,
        backgroundSize: "24px 24px",
      }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-8">
          {avatarUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Image src={avatarUrl} alt={data.userName}
                className="w-20 h-20 rounded-full object-cover grayscale" width={80} height={80} unoptimized />
            </motion.div>
          )}

          <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]"
            style={{ color: c.heading }}
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}>
            {data.title || data.userName}
          </motion.h1>

          {data.tagline && (
            <motion.p className="text-lg md:text-xl font-light tracking-wide max-w-xl"
              style={{ color: c.muted }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              {data.tagline}
            </motion.p>
          )}

          {about && "bio" in about && about.bio && (
            <motion.p className="text-base leading-relaxed max-w-lg" style={{ color: c.muted }}
              initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              {about.bio}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.graphite} iconSize={18} />}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}

/* # Main section renderer */
function renderSection(section: PortfolioSection, index: number) {
  switch (section.type) {
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Skills</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {groups.map((g, gi) => (
              <motion.div key={gi}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: gi * 0.08 }}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] mb-5" style={{ color: c.muted }}>{g.category}</h3>
                <div className="space-y-1">
                  {g.skills.map((s, si) => (
                    <SkillBar key={si} name={s.name} proficiency={s.proficiency ?? 80}
                      gradientFrom={c.graphite} gradientTo={c.muted}
                      textColor={c.text} mutedColor={c.muted} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );
    }

    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Experience</SectionHeading>
          <div className="space-y-0">
            {section.entries.map((e, i) => (
              <motion.div key={i} className="py-8 group" style={{ borderBottom: `1px solid ${c.border}` }}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8">
                  <div>
                    <span className="text-xs font-medium" style={{ color: c.muted }}>
                      {e.startDate} — {e.endDate || "Present"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: c.heading }}>{e.title}</h3>
                    <p className="text-sm font-medium mt-0.5" style={{ color: c.accent }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                    {e.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{e.description}</p>}
                    {e.achievements.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {e.achievements.map((a, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <span className="text-xs mt-1.5" style={{ color: c.muted }}>—</span>
                            <span className="text-sm leading-relaxed" style={{ color: c.muted }}>{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="space-y-16">
              {section.entries.map((p, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div key={i} variants={staggerItem}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${!isEven ? "md:[direction:rtl]" : ""}`}>
                    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden group" style={{ direction: "ltr" }}>
                      <ImageWithFallback src={p.imageUrl} alt={p.title}
                        fallbackSeed={DEMO.projects[i % DEMO.projects.length]?.title.toLowerCase().replace(/\s/g, "")}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                        accentColor={c.graphite} fill />
                    </div>
                    <div style={{ direction: "ltr" }}>
                      <span className="text-xs font-medium tracking-[0.15em] uppercase" style={{ color: c.muted }}>
                        Project {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-bold mt-2" style={{ color: c.heading }}>{p.title}</h3>
                      {p.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{p.description}</p>}
                      {p.techStack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.techStack.map((t: string, j: number) => (
                            <span key={j} className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ border: `1px solid ${c.border}`, color: c.accent }}>{t}</span>
                          ))}
                        </div>
                      )}
                      {(p.liveUrl || p.repoUrl) && (
                        <div className="mt-5 flex gap-4">
                          {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-wide uppercase hover:opacity-60 transition-opacity" style={{ color: c.heading }}>View →</a>}
                          {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-wide uppercase hover:opacity-60 transition-opacity" style={{ color: c.muted }}>Source</a>}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </SectionWrapper>
      );

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-0">
            {section.entries.map((e, i) => (
              <motion.div key={i} className="py-6" style={{ borderBottom: `1px solid ${c.border}` }}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8">
                  <span className="text-xs font-medium" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</span>
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: c.heading }}>{e.degree}</h3>
                    <p className="text-sm mt-0.5" style={{ color: c.accent }}>{e.school}</p>
                    {e.description && <p className="text-sm leading-relaxed mt-2" style={{ color: c.muted }}>{e.description}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Gallery</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {section.entries.map((g, i) => (
              <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="block relative aspect-square overflow-hidden group"
                whileHover={{ scale: 0.98 }}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <ImageWithFallback src={g.imageUrl} alt={g.title}
                  fallbackSeed={DEMO.gallery[i % DEMO.gallery.length]?.title.toLowerCase().replace(/\s/g, "")}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  accentColor={c.graphite} fill />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">{g.title}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </SectionWrapper>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Testimonials</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {section.entries.map((t, i) => (
              <motion.div key={i} className="py-6"
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-base leading-relaxed italic" style={{ color: c.text }}>"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-px h-8" style={{ backgroundColor: c.graphite }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: c.heading }}>{t.author}</p>
                    <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? `, ${t.company}` : ""}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Certifications</SectionHeading>
          <div className="space-y-0">
            {section.entries.map((cert, i) => (
              <motion.div key={i} className="py-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${c.border}` }}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: c.heading }}>{cert.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                </div>
                {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:opacity-60 transition-opacity" style={{ color: c.accent }}>View →</a>}
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Awards</SectionHeading>
          <div className="space-y-0">
            {section.entries.map((a, i) => (
              <motion.div key={i} className="py-5" style={{ borderBottom: `1px solid ${c.border}` }}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: c.heading }}>{a.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: c.muted }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                  </div>
                </div>
                {a.description && <p className="text-sm leading-relaxed mt-2" style={{ color: c.muted }}>{a.description}</p>}
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Publications</SectionHeading>
          <div className="space-y-0">
            {section.entries.map((pub, i) => (
              <motion.div key={i} className="py-5" style={{ borderBottom: `1px solid ${c.border}` }}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <h3 className="text-sm font-semibold" style={{ color: c.heading }}>{pub.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {pub.venue && <span className="text-xs" style={{ color: c.muted }}>{pub.venue}</span>}
                  {pub.date && <span className="text-xs" style={{ color: c.muted }}>· {pub.date}</span>}
                </div>
                {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium mt-1 inline-block hover:opacity-60 transition-opacity" style={{ color: c.accent }}>Read →</a>}
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <div className="max-w-lg">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: c.heading }}>Let&apos;s connect</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: c.muted }}>Available for new opportunities and collaborations.</p>
            <div className="mt-8 space-y-3">
              {section.email && (
                <a href={`mailto:${section.email}`} className="flex items-center gap-3 py-3 group" style={{ borderBottom: `1px solid ${c.border}` }}>
                  <span className="text-xs uppercase tracking-[0.15em] w-20 shrink-0" style={{ color: c.muted }}>Email</span>
                  <span className="text-sm font-medium group-hover:opacity-60 transition-opacity" style={{ color: c.heading }}>{section.email}</span>
                </a>
              )}
              {section.phone && (
                <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                  <span className="text-xs uppercase tracking-[0.15em] w-20 shrink-0" style={{ color: c.muted }}>Phone</span>
                  <span className="text-sm font-medium" style={{ color: c.heading }}>{section.phone}</span>
                </div>
              )}
              {section.location && (
                <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                  <span className="text-xs uppercase tracking-[0.15em] w-20 shrink-0" style={{ color: c.muted }}>Based in</span>
                  <span className="text-sm font-medium" style={{ color: c.heading }}>{section.location}</span>
                </div>
              )}
            </div>
            <div className="mt-8 flex gap-4">
              {section.email && <a href={`mailto:${section.email}`} className="text-xs font-semibold tracking-wide uppercase px-5 py-2.5 rounded transition-opacity hover:opacity-80 text-white" style={{ backgroundColor: c.graphite }}>Get in Touch</a>}
              {section.calendarLink && <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-wide uppercase px-5 py-2.5 rounded transition-opacity hover:opacity-60" style={{ border: `1px solid ${c.border}`, color: c.heading }}>Schedule</a>}
            </div>
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

export default function MinimalTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <Hero data={data} />

      <div style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div className="max-w-5xl mx-auto">
          <StatsBar data={data} variant="minimal" colors={{
            bg: "transparent", text: c.heading, accent: c.graphite, muted: c.muted, border: c.border,
          }} />
        </div>
      </div>

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`} style={{ borderBottom: `1px solid ${c.border}` }}>
          {renderSection(section, i)}
        </div>
      ))}

      <footer className="py-16 text-center text-xs tracking-wide" style={{ color: c.muted }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:opacity-60 transition-opacity" style={{ color: c.heading }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
