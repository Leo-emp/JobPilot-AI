"use client";

/* # Videographer Template v2 — Crimson × Amber dual-tone, cinematic widescreen, film grain SVG */

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

/* # Dual-tone palette: Crimson × Amber — cinematic dark theme */
const c = {
  bg: "#0a0a0a",
  bgAlt: "#111111",
  surface: "#161616",
  crimson: "#dc2626",
  amber: "#f59e0b",
  text: "#f5f5f5",
  muted: "#a3a3a3",
  heading: "#ffffff",
  border: "rgba(255,255,255,0.08)",
  gradient: "linear-gradient(135deg, #dc2626, #f59e0b)",
  gradientSubtle: "linear-gradient(135deg, #dc262620, #f59e0b20)",
};

const ENTRY_GRADIENTS = [
  { from: "#dc2626", to: "#f59e0b" },
  { from: "#f59e0b", to: "#dc2626" },
  { from: "#ef4444", to: "#fbbf24" },
  { from: "#b91c1c", to: "#d97706" },
  { from: "#fbbf24", to: "#ef4444" },
];

const DEMO = {
  projects: [
    { title: "Documentary", img: "https://picsum.photos/seed/cinema/800/450" },
    { title: "Music Video", img: "https://picsum.photos/seed/music/800/450" },
    { title: "Short Film", img: "https://picsum.photos/seed/film/800/450" },
    { title: "Commercial", img: "https://picsum.photos/seed/commercial/800/450" },
  ],
  gallery: [
    { title: "Behind Scenes", img: "https://picsum.photos/seed/bts/600/400" },
    { title: "Color Grade", img: "https://picsum.photos/seed/colorgrade/500/600" },
    { title: "Aerial Shot", img: "https://picsum.photos/seed/aerial/600/400" },
    { title: "Golden Hour", img: "https://picsum.photos/seed/golden/500/500" },
    { title: "Night Scene", img: "https://picsum.photos/seed/night/600/400" },
    { title: "Slow Motion", img: "https://picsum.photos/seed/slowmo/500/600" },
  ],
};

/* # Film grain SVG overlay — adds cinematic texture */
function FilmGrain() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

/* # Cinematic letterbox bars — top and bottom */
function Letterbox() {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-8 md:h-12 z-20 pointer-events-none"
        style={{ background: "linear-gradient(180deg, #0a0a0a 60%, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-8 md:h-12 z-20 pointer-events-none"
        style={{ background: "linear-gradient(0deg, #0a0a0a 60%, transparent)" }} />
    </>
  );
}

/* # Section heading with cinematic red accent */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3">
        <div className="w-8 h-0.5 rounded-full" style={{ background: c.gradient }} />
        <h2 className="text-2xl font-bold uppercase tracking-wider" style={{ color: c.heading }}>
          {children}
        </h2>
      </div>
    </div>
  );
}

/* # Hero — full-bleed cinematic widescreen with letterbox */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: c.bg }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
      <FilmGrain />
      <Letterbox />

      {/* # Ambient crimson/amber glow */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[200px] opacity-10 pointer-events-none"
        style={{ background: c.crimson }} />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full blur-[180px] opacity-10 pointer-events-none"
        style={{ background: c.amber }} />

      {/* # Scan lines overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)`,
      }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {avatarUrl && (
          <motion.div className="mb-8 flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" as const }}>
            <Image src={avatarUrl} alt={data.userName}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-white/10" width={96} height={96} unoptimized />
          </motion.div>
        )}

        <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none"
          style={{ color: c.heading }}
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
          {data.title || data.userName}
        </motion.h1>

        {data.tagline && (
          <motion.p className="text-lg md:text-xl mt-6 font-light tracking-widest uppercase"
            style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            {data.tagline}
          </motion.p>
        )}

        {about && "bio" in about && about.bio && (
          <motion.p className="mt-6 text-base leading-relaxed max-w-xl mx-auto" style={{ color: c.muted }}
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            {about.bio}
          </motion.p>
        )}

        <motion.div className="mt-8 flex justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.text} iconSize={20} />}
        </motion.div>
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
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Expertise</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {groups.map((g, gi) => (
                <motion.div key={gi} className="rounded-xl p-6" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`,
                }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: gi * 0.1 }}>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
                    style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {g.category}
                  </h3>
                  <div className="space-y-1">
                    {g.skills.map((s, si) => (
                      <SkillBar key={si} name={s.name} proficiency={s.proficiency ?? 80}
                        gradientFrom={c.crimson} gradientTo={c.amber}
                        textColor={c.text} mutedColor={c.muted} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );
    }

    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Filmography</SectionHeading>
            <div className="space-y-4">
              {section.entries.map((e, i) => {
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                return (
                  <motion.div key={i} className="relative rounded-xl overflow-hidden group" style={{
                    backgroundColor: c.surface, border: `1px solid ${c.border}`,
                  }}
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5"
                      style={{ background: `linear-gradient(90deg, ${grad.from}, ${grad.to})` }} />
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-base" style={{ color: c.heading }}>{e.title}</h3>
                          <p className="text-sm font-medium mt-0.5"
                            style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {e.company}{e.location ? ` · ${e.location}` : ""}
                          </p>
                        </div>
                        {(e.startDate || e.endDate) && (
                          <span className="text-xs shrink-0 px-3 py-1 rounded" style={{ backgroundColor: `${c.crimson}15`, color: c.crimson }}>
                            {e.startDate} — {e.endDate || "Present"}
                          </span>
                        )}
                      </div>
                      {e.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{e.description}</p>}
                      {e.achievements.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {e.achievements.map((a, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: c.gradient }} />
                              <span className="text-xs leading-relaxed" style={{ color: c.muted }}>{a}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </div>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Reel</SectionHeading>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {/* # Widescreen aspect ratio cards — cinematic 16:9 */}
              <div className="space-y-6">
                {section.entries.map((p, i) => (
                  <motion.div key={i} variants={staggerItem}
                    className="rounded-xl overflow-hidden group" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <div className="relative aspect-video overflow-hidden">
                        <ImageWithFallback src={p.imageUrl} alt={p.title}
                          fallbackSeed={DEMO.projects[i % DEMO.projects.length]?.title.toLowerCase().replace(/\s/g, "")}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          accentColor={c.crimson} fill />
                        {/* # Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
                            style={{ background: `${c.crimson}cc` }}>
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <Letterbox />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold" style={{ color: c.heading }}>{p.title}</h3>
                            {p.description && <p className="text-sm leading-relaxed mt-2 line-clamp-2" style={{ color: c.muted }}>{p.description}</p>}
                          </div>
                          {(p.liveUrl || p.repoUrl) && (
                            <div className="flex gap-3 shrink-0">
                              {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-4 py-2 rounded-lg text-white" style={{ background: c.gradient }}>Watch</a>}
                              {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-4 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, color: c.text }}>Details</a>}
                            </div>
                          )}
                        </div>
                        {p.techStack.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {p.techStack.map((t: string, j: number) => (
                              <span key={j} className="text-[10px] px-2.5 py-1 rounded font-medium" style={{ backgroundColor: `${c.crimson}10`, color: c.crimson }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </SectionWrapper>
        </div>
      );

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Education</SectionHeading>
            <div className="space-y-4">
              {section.entries.map((e, i) => (
                <motion.div key={i} className="rounded-xl p-6" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <h3 className="font-bold text-base" style={{ color: c.heading }}>{e.degree}</h3>
                  <p className="text-sm font-medium mt-1" style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{e.school}</p>
                  {e.startDate && <p className="text-xs mt-2" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                  {e.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{e.description}</p>}
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Stills</SectionHeading>
            {/* # Masonry grid with cinematic aspect ratios */}
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {section.entries.map((g, i) => {
                const heights = ["aspect-video", "aspect-[4/3]", "aspect-video", "aspect-square", "aspect-[3/4]", "aspect-video"];
                return (
                  <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                    className={`block rounded-lg overflow-hidden group break-inside-avoid relative ${heights[i % heights.length]}`}
                    style={{ border: `1px solid ${c.border}` }}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <ImageWithFallback src={g.imageUrl} alt={g.title}
                      fallbackSeed={DEMO.gallery[i % DEMO.gallery.length]?.title.toLowerCase().replace(/\s/g, "")}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      accentColor={c.crimson} fill />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, transparent 50%, ${c.bg}ee 100%)` }}>
                      <div className="absolute bottom-3 left-3">
                        <p className="text-white text-sm font-bold">{g.title}</p>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </SectionWrapper>
        </div>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Reviews</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((t, i) => (
                <motion.div key={i} className="rounded-xl p-6 relative overflow-hidden" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`,
                }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: c.gradient }} />
                  <p className="text-sm leading-relaxed mb-4" style={{ color: c.muted }}>&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3" style={{ borderTop: `1px solid ${c.border}` }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: c.gradient }}>{t.author.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: c.heading }}>{t.author}</p>
                      <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? `, ${t.company}` : ""}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Certifications</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.entries.map((cert, i) => (
                <motion.div key={i} className="rounded-xl p-5" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <h3 className="text-sm font-bold" style={{ color: c.heading }}>{cert.name}</h3>
                  <p className="text-xs mt-1" style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-block hover:opacity-60 transition-opacity" style={{ color: c.crimson }}>Verify →</a>}
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Awards</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((a, i) => (
                <motion.div key={i} className="rounded-xl p-6" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <h3 className="text-base font-bold" style={{ color: c.heading }}>{a.title}</h3>
                  <p className="text-sm font-medium mt-1" style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                  {a.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{a.description}</p>}
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Publications</SectionHeading>
            <div className="space-y-3">
              {section.entries.map((pub, i) => (
                <motion.div key={i} className="rounded-xl p-5" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <h3 className="text-sm font-bold" style={{ color: c.heading }}>{pub.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    {pub.venue && <span className="text-xs" style={{ color: c.crimson }}>{pub.venue}</span>}
                    {pub.date && <span className="text-xs" style={{ color: c.muted }}>· {pub.date}</span>}
                  </div>
                  {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-block hover:opacity-60 transition-opacity" style={{ color: c.amber }}>Read →</a>}
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <div style={{ backgroundColor: c.bg }}>
          <SectionDivider variant="gradient" color={c.crimson} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <div className="rounded-2xl p-10 md:p-14 text-center relative overflow-hidden" style={{ background: c.gradientSubtle, border: `1px solid ${c.border}` }}>
              <FilmGrain />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight" style={{ color: c.heading }}>Let&apos;s Create</h2>
                <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: c.muted }}>Available for film, commercial, and creative video projects.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                  {section.email && (
                    <a href={`mailto:${section.email}`} className="rounded-xl p-4 text-center transition-all hover:scale-105" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: c.muted }}>Email</p>
                      <p className="text-sm truncate" style={{ color: c.text }}>{section.email}</p>
                    </a>
                  )}
                  {section.phone && (
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: c.muted }}>Phone</p>
                      <p className="text-sm" style={{ color: c.text }}>{section.phone}</p>
                    </div>
                  )}
                  {section.location && (
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: c.muted }}>Based in</p>
                      <p className="text-sm" style={{ color: c.text }}>{section.location}</p>
                    </div>
                  )}
                </div>
                <div className="mt-8 flex justify-center gap-4">
                  {section.email && <a href={`mailto:${section.email}`} className="px-6 py-3 rounded-lg font-bold text-sm text-white transition-all hover:scale-105" style={{ background: c.gradient }}>Hire Me →</a>}
                  {section.calendarLink && <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105" style={{ border: `1px solid ${c.border}`, color: c.text }}>Schedule Call</a>}
                </div>
              </div>
            </div>
          </SectionWrapper>
        </div>
      );
    }

    default: return null;
  }
}

export default function VideographerTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      <Hero data={data} />

      <div style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div className="max-w-5xl mx-auto">
          <StatsBar data={data} variant="minimal" colors={{
            bg: "transparent", text: c.heading, accent: c.crimson, muted: c.muted, border: c.border,
          }} />
        </div>
      </div>

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          {renderSection(section, i)}
        </div>
      ))}

      <footer className="py-12 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:opacity-60 transition-opacity" style={{ color: c.crimson }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
