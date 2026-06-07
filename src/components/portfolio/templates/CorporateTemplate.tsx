"use client";

/* # Corporate Template v2 — Gold × Warm Ivory dual-tone, diamond pattern, luxury serif */

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

/* # Dual-tone palette: Gold × Warm Ivory (unique: light theme, luxury serif) */
const c = {
  bg: "#faf8f4",
  bgAlt: "#f2efe8",
  surface: "#ffffff",
  navy: "#0f1b3d",
  navyLight: "#1a2850",
  /* # Primary gradient pair — gold fused with warm ivory */
  gold: "#b8960c",
  goldLight: "#d4bc8a",
  text: "#1a1a2e",
  muted: "#5a5a6e",
  cream: "#ebe5da",
  border: "#e8e4dc",
  gradient: "linear-gradient(135deg, #b8960c, #d4bc8a)",
  gradientNavy: "linear-gradient(135deg, #0f1b3d, #1a2850)",
};

/* # Accent rotation */
const ACCENT_COLORS = ["#b8960c", "#0f1b3d", "#7c6f3a", "#2a4a7a", "#8b6914"];
const ENTRY_GRADIENTS = [
  { from: "#0f1b3d", to: "#2a4a7a" },
  { from: "#b8960c", to: "#d4bc8a" },
  { from: "#1a2850", to: "#3a5a8a" },
  { from: "#7c6f3a", to: "#b8960c" },
  { from: "#2a4a7a", to: "#0f1b3d" },
];

/* # Demo content */
const DEMO = {
  projects: [
    { title: "Strategic Vision", img: "https://picsum.photos/seed/strategy/800/500" },
    { title: "Market Analysis", img: "https://picsum.photos/seed/analysis/600/400" },
    { title: "Leadership Summit", img: "https://picsum.photos/seed/summit/600/400" },
    { title: "Innovation Lab", img: "https://picsum.photos/seed/innovation/600/400" },
  ],
  gallery: [
    { title: "Boardroom", img: "https://picsum.photos/seed/boardroom/600/500" },
    { title: "Keynote", img: "https://picsum.photos/seed/keynote/500/600" },
    { title: "Awards Gala", img: "https://picsum.photos/seed/gala/600/400" },
    { title: "Team Strategy", img: "https://picsum.photos/seed/teamwork/500/500" },
    { title: "Executive Summit", img: "https://picsum.photos/seed/execsummit/600/400" },
    { title: "Press Release", img: "https://picsum.photos/seed/press/500/600" },
  ],
};

/* # Diamond pattern SVG — luxury background decoration */
function DiamondPattern({ opacity = 0.04, color = c.gold }: { opacity?: number; color?: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <div className="w-full h-full" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "40px 40px",
      }} />
    </div>
  );
}

/* # Section heading with gold accent diamond */
function SectionHeading({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, transparent, ${c.gold})` }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: c.gold }} />
        <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, ${c.gold}, transparent)` }} />
      </div>
      <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>
        {children}
      </h2>
      {subtitle && <p className="mt-2 text-sm" style={{ color: c.muted }}>{subtitle}</p>}
    </div>
  );
}

/* # Hero section — navy background with gold accents, serif typography */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: c.navy }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <DiamondPattern opacity={0.04} />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[200px] opacity-10 pointer-events-none"
        style={{ background: c.gold }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-[0.06] pointer-events-none"
        style={{ background: c.goldLight }} />

      {/* # Decorative corner lines */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t border-l opacity-20 hidden md:block" style={{ borderColor: c.gold }} />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r opacity-20 hidden md:block" style={{ borderColor: c.gold }} />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 md:px-12 text-center">
        {avatarUrl && (
          <motion.div className="relative mx-auto mb-10 w-36 h-36"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" as const }}>
            <div className="absolute -inset-1 rounded-full" style={{ background: c.gradient, opacity: 0.5 }} />
            <Image src={avatarUrl} alt={data.userName} className="relative w-full h-full rounded-full object-cover" fill unoptimized />
          </motion.div>
        )}

        <motion.div className="w-12 h-0.5 mx-auto mb-8" style={{ backgroundColor: c.gold }}
          initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.3, duration: 0.6 }} />

        <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff" }}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          {data.title || data.userName}
        </motion.h1>

        {data.tagline && (
          <motion.p className="text-lg md:text-xl mt-5 font-light tracking-widest uppercase" style={{ color: c.gold, letterSpacing: "0.15em" }}
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            {data.tagline}
          </motion.p>
        )}

        {about && "bio" in about && about.bio && (
          <motion.p className="mt-8 text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            {about.bio}
          </motion.p>
        )}

        <motion.div className="mt-10"
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.gold} iconSize={22} />}
        </motion.div>
      </div>
    </motion.header>
  );
}

/* # Main section renderer */
function renderSection(section: PortfolioSection, index: number) {
  const isAlt = index % 2 === 1;

  switch (section.type) {
    /* # Skills section — elegant cards with gold proficiency bars */
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading subtitle="Core competencies & expertise">Capabilities</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((g, gi) => {
                const accent = ACCENT_COLORS[gi % ACCENT_COLORS.length];
                return (
                  <motion.div key={gi} className="rounded-xl p-6" style={{
                    backgroundColor: c.surface, border: `1px solid ${c.border}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: gi * 0.1 }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: accent }} />
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: accent }}>{g.category}</h3>
                    </div>
                    <div className="space-y-1">
                      {g.skills.map((s, si) => (
                        <SkillBar key={si} name={s.name} proficiency={s.proficiency ?? 80}
                          gradientFrom={c.gold} gradientTo={c.navy}
                          textColor={c.text} mutedColor={c.muted} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </div>
      );
    }

    /* # Experience section — alternating navy/cream cards with editorial layout */
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Professional Experience</SectionHeading>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {section.entries.map((e, i) => {
                const isNavy = i % 2 === 0;
                const bg = isNavy ? c.navy : c.surface;
                const textColor = isNavy ? "rgba(255,255,255,0.9)" : c.text;
                const mutedColor = isNavy ? "rgba(255,255,255,0.55)" : c.muted;
                const accentColor = isNavy ? c.gold : c.navy;
                return (
                  <motion.div key={i} className="relative rounded-xl overflow-hidden"
                    style={{ backgroundColor: bg, border: isNavy ? "none" : `1px solid ${c.border}` }}
                    whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    {isNavy && <DiamondPattern opacity={0.04} />}
                    <div className="relative z-10 p-6">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-white text-sm"
                          style={{ background: isNavy ? c.gradient : c.gradientNavy }}>
                          {e.company?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif", color: textColor }}>{e.title}</h3>
                          <p className="text-xs font-semibold mt-0.5" style={{ color: accentColor }}>{e.company}</p>
                        </div>
                        {(e.startDate || e.endDate) && (
                          <span className="text-[10px] font-semibold shrink-0 px-2 py-1 rounded" style={{ color: mutedColor }}>
                            {e.startDate} — {e.endDate || "Present"}
                          </span>
                        )}
                      </div>
                      {e.description && <p className="text-xs leading-relaxed mb-2" style={{ color: mutedColor }}>{e.description}</p>}
                      {e.achievements.length > 0 && (
                        <div className="space-y-1 mt-3">
                          {e.achievements.map((a, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accentColor }} />
                              <span className="text-xs leading-relaxed" style={{ color: mutedColor }}>{a}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </div>
      );

    /* # Projects section — elegant grid with gold hover accents */
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading subtitle="Key initiatives & deliverables">Projects</SectionHeading>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {section.entries.map((p, i) => {
                  const isFeatured = i === 0;
                  return (
                    <motion.div key={i} variants={staggerItem}
                      className={`relative rounded-xl overflow-hidden group ${isFeatured ? "md:col-span-2" : ""}`}
                      style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                      <motion.div className="h-full"
                        whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
                        <div className={`${isFeatured ? "flex flex-col md:flex-row" : ""}`}>
                          <div className={`relative overflow-hidden ${isFeatured ? "md:w-1/2 min-h-[200px]" : "h-44"}`}>
                            <ImageWithFallback src={p.imageUrl} alt={p.title}
                              fallbackSeed={DEMO.projects[i % DEMO.projects.length]?.title.toLowerCase().replace(/\s/g, "")}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              accentColor={c.gold} fill />
                            <div className="absolute inset-0" style={{
                              background: isFeatured
                                ? `linear-gradient(90deg, transparent 60%, ${c.surface})`
                                : `linear-gradient(180deg, transparent 50%, ${c.surface})`,
                            }} />
                          </div>
                          <div className={`p-6 ${isFeatured ? "md:w-1/2 flex flex-col justify-center" : ""}`}>
                            {isFeatured && <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: c.gold }}>Featured</span>}
                            <h3 className={`${isFeatured ? "text-2xl" : "text-lg"} font-bold`} style={{ fontFamily: "'Playfair Display', serif", color: c.navy }}>{p.title}</h3>
                            {p.description && <p className="mt-2 text-sm leading-relaxed line-clamp-3" style={{ color: c.muted }}>{p.description}</p>}
                            {p.techStack.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {p.techStack.slice(0, isFeatured ? 5 : 3).map((t: string, j: number) => (
                                  <span key={j} className="text-[10px] px-2 py-0.5 rounded font-medium"
                                    style={{ backgroundColor: `${c.gold}12`, color: c.gold, border: `1px solid ${c.gold}20` }}>
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                            {isFeatured && (p.liveUrl || p.repoUrl) && (
                              <div className="mt-4 flex gap-3">
                                {p.liveUrl && (
                                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                    className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                                    style={{ background: c.gradientNavy }}>
                                    View Project →
                                  </a>
                                )}
                                {p.repoUrl && (
                                  <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                                    className="px-5 py-2 rounded-lg text-xs font-bold hover:opacity-80"
                                    style={{ color: c.navy, border: `1px solid ${c.border}` }}>
                                    Source
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </SectionWrapper>
        </div>
      );

    /* # Education section — serif-styled cards with gold year badges */
    case "education":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Education</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((e, i) => (
                <motion.div key={i} className="rounded-xl overflow-hidden" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`,
                }}
                  whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: c.navy }}>{e.degree}</h3>
                        <p className="text-sm font-semibold mt-1" style={{ color: c.gold }}>{e.school}</p>
                      </div>
                      {e.endDate && (
                        <div className="shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center"
                          style={{ background: c.gradient }}>
                          <span className="text-lg font-black leading-none text-white">{e.endDate.slice(-2)}</span>
                          <span className="text-[8px] uppercase text-white/70 mt-0.5">year</span>
                        </div>
                      )}
                    </div>
                    {e.startDate && <p className="text-xs mt-3" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                    {e.description && (
                      <p className="text-sm leading-relaxed mt-3 pt-3" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
                        {e.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    /* # Gallery section — elegant masonry with gold hover overlay */
    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Gallery</SectionHeading>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {section.entries.map((g, i) => {
                const heights = ["h-48", "h-64", "h-52", "h-72", "h-56", "h-60"];
                return (
                  <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                    className={`block rounded-xl overflow-hidden group break-inside-avoid relative ${heights[i % heights.length]}`}
                    style={{ border: `1px solid ${c.border}` }}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <ImageWithFallback src={g.imageUrl} alt={g.title}
                      fallbackSeed={DEMO.gallery[i % DEMO.gallery.length]?.title.toLowerCase().replace(/\s/g, "")}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      accentColor={c.gold} fill />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, transparent 30%, ${c.navy}cc 70%, ${c.navy}ee)` }}>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{g.title}</p>
                        {g.description && <p className="text-white/60 text-xs mt-1">{g.description}</p>}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </SectionWrapper>
        </div>
      );

    /* # Certifications section — refined cards with gold accents */
    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Certifications</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((cert, i) => (
                <motion.div key={i} className="rounded-xl overflow-hidden" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`,
                }}
                  whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="h-1" style={{ background: c.gradient }} />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-lg font-bold text-white"
                        style={{ background: c.gradientNavy }}>✓</div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif", color: c.navy }}>{cert.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs px-2.5 py-1 rounded font-medium" style={{ backgroundColor: `${c.gold}12`, color: c.gold }}>{cert.issuer}</span>
                          {cert.date && <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: c.bgAlt, color: c.muted }}>{cert.date}</span>}
                        </div>
                        {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium mt-2 inline-block hover:underline" style={{ color: c.gold }}>Verify →</a>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    /* # Publications section */
    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Publications</SectionHeading>
            <div className="space-y-4">
              {section.entries.map((pub, i) => (
                <motion.div key={i} className="rounded-xl overflow-hidden" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`,
                }}
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="p-6 flex items-start gap-5">
                    <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: c.gradientNavy }}>{String(i + 1).padStart(2, "0")}</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif", color: c.navy }}>{pub.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {pub.venue && <span className="text-xs px-2.5 py-1 rounded font-medium" style={{ backgroundColor: `${c.gold}12`, color: c.gold }}>{pub.venue}</span>}
                        {pub.date && <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: c.bgAlt, color: c.muted }}>{pub.date}</span>}
                      </div>
                      {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-3 inline-block font-medium hover:underline" style={{ color: c.gold }}>Read →</a>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    /* # Awards section — gold trophy style */
    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Awards & Recognition</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((a, i) => (
                <motion.div key={i} className="rounded-xl overflow-hidden" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`,
                }}
                  whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="h-1" style={{ background: c.gradient }} />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${c.gold}12`, border: `1px solid ${c.gold}20` }}>
                        <svg width="20" height="20" fill="none" stroke={c.gold} viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: c.navy }}>{a.title}</h3>
                        <p className="text-sm font-semibold mt-1" style={{ color: c.gold }}>{a.issuer}</p>
                        {a.date && <span className="inline-block text-xs px-2 py-0.5 rounded mt-1" style={{ backgroundColor: c.bgAlt, color: c.muted }}>{a.date}</span>}
                        {a.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{a.description}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    /* # Testimonials section — elegant quote cards */
    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Testimonials</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((t, i) => {
                const isNavy = i % 2 === 0;
                return (
                  <motion.div key={i} className="rounded-xl overflow-hidden" style={{
                    backgroundColor: isNavy ? c.navy : c.surface,
                    border: isNavy ? "none" : `1px solid ${c.border}`,
                  }}
                    whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    {isNavy && <DiamondPattern opacity={0.03} />}
                    <div className="relative z-10 p-7">
                      <div className="text-5xl font-serif leading-none mb-3" style={{ color: c.gold, opacity: 0.3 }}>&ldquo;</div>
                      <p className="text-base leading-relaxed mb-5" style={{ color: isNavy ? "rgba(255,255,255,0.7)" : c.muted }}>{t.quote}</p>
                      <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${isNavy ? "rgba(200,169,110,0.2)" : c.border}` }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: c.gradient }}>{t.author.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: isNavy ? "#fff" : c.navy }}>{t.author}</p>
                          <p className="text-xs" style={{ color: c.gold }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </div>
      );

    /* # Contact section — navy CTA with gold accents */
    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="diamond" color={c.gold} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden p-12 md:p-16 text-center relative" style={{ backgroundColor: c.navy }}>
              <DiamondPattern opacity={0.04} />
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[150px] opacity-10 pointer-events-none" style={{ background: c.gold }} />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(90deg, transparent, ${c.gold})` }} />
                  <div className="w-2 h-2 rotate-45" style={{ backgroundColor: c.gold }} />
                  <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(90deg, ${c.gold}, transparent)` }} />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Let&apos;s Connect
                </h2>
                <p className="mt-4 text-base text-white/60 max-w-md mx-auto">Open to strategic partnerships, advisory roles, and executive opportunities.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-10 mb-8">
                  {section.email && (
                    <a href={`mailto:${section.email}`} className="group block rounded-xl p-4 text-center transition-all group-hover:scale-105"
                      style={{ backgroundColor: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.15)" }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: c.gold }}>Email</p>
                      <p className="text-sm text-white truncate">{section.email}</p>
                    </a>
                  )}
                  {section.phone && (
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.15)" }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: c.gold }}>Phone</p>
                      <p className="text-sm text-white">{section.phone}</p>
                    </div>
                  )}
                  {section.location && (
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.15)" }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: c.gold }}>Location</p>
                      <p className="text-sm text-white">{section.location}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {section.email && (
                    <a href={`mailto:${section.email}`}
                      className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105"
                      style={{ background: c.gradient, color: c.navy }}>
                      Get In Touch →
                    </a>
                  )}
                  {section.calendarLink && (
                    <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                      className="px-8 py-3 rounded-lg font-bold text-sm text-white transition-all hover:scale-105"
                      style={{ border: `1px solid ${c.gold}40` }}>
                      Book a Meeting
                    </a>
                  )}
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

/* # Main template export */
export default function CorporateTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      <div style={{ backgroundColor: c.bgAlt, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div className="max-w-5xl mx-auto">
          <StatsBar data={data} variant="serif" colors={{
            bg: "transparent", text: c.navy, accent: c.gold, muted: c.muted, border: c.border,
          }} />
        </div>
      </div>

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          {renderSection(section, i)}
        </div>
      ))}

      <footer className="py-12 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.gold }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
