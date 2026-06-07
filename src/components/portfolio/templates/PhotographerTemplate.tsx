"use client";

/* # Photographer Template v2 — Rose × Golden Peach dual-tone, full-bleed gallery, lightbox style */

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

/* # Dual-tone palette: Rose × Golden Peach — warm, elegant dark theme */
const c = {
  bg: "#0f0f0f",
  bgAlt: "#141414",
  surface: "#1a1a1a",
  rose: "#e11d48",
  peach: "#f59e0b",
  text: "#f5f5f5",
  muted: "#a3a3a3",
  heading: "#ffffff",
  border: "rgba(255,255,255,0.08)",
  gradient: "linear-gradient(135deg, #e11d48, #fbbf24)",
  gradientSubtle: "linear-gradient(135deg, #e11d4815, #fbbf2415)",
};

const ENTRY_GRADIENTS = [
  { from: "#e11d48", to: "#fbbf24" },
  { from: "#fbbf24", to: "#e11d48" },
  { from: "#f43f5e", to: "#f59e0b" },
  { from: "#be123c", to: "#d97706" },
  { from: "#fb923c", to: "#f43f5e" },
];

const DEMO = {
  projects: [
    { title: "Portrait", img: "https://picsum.photos/seed/portrait/800/1000" },
    { title: "Landscape", img: "https://picsum.photos/seed/landscape/1200/800" },
    { title: "Street", img: "https://picsum.photos/seed/street/800/800" },
    { title: "Wedding", img: "https://picsum.photos/seed/wedding/800/1000" },
  ],
  gallery: [
    { title: "Golden Hour", img: "https://picsum.photos/seed/goldenhour/600/800" },
    { title: "Studio", img: "https://picsum.photos/seed/studio/600/600" },
    { title: "Nature", img: "https://picsum.photos/seed/nature/800/600" },
    { title: "Fashion", img: "https://picsum.photos/seed/fashion/600/900" },
    { title: "Travel", img: "https://picsum.photos/seed/travel/800/600" },
    { title: "Abstract", img: "https://picsum.photos/seed/abstract/600/600" },
  ],
};

/* # Bokeh orb — ambient lighting for warm depth */
function BokehOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[20%] left-[10%] w-48 h-48 rounded-full blur-[100px] opacity-10" style={{ background: c.rose }} />
      <div className="absolute top-[60%] right-[15%] w-56 h-56 rounded-full blur-[120px] opacity-8" style={{ background: c.peach }} />
      <div className="absolute bottom-[10%] left-[40%] w-40 h-40 rounded-full blur-[80px] opacity-6" style={{ background: c.rose }} />
    </div>
  );
}

/* # Section heading with rose/peach gradient accent */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold tracking-tight" style={{ color: c.heading }}>
        {children}
      </h2>
      <div className="mt-3 h-0.5 w-16 rounded-full" style={{ background: c.gradient }} />
    </div>
  );
}

/* # Hero — full-bleed with large aperture ring motif */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: c.bg }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <BokehOrbs />

      {/* # Aperture ring decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ border: `2px solid ${c.rose}` }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ border: `1px solid ${c.peach}` }} />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center gap-12">
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" as const }}>
              <div className="absolute -inset-1 rounded-full" style={{ background: c.gradient, opacity: 0.3, filter: "blur(8px)" }} />
              <Image src={avatarUrl} alt={data.userName}
                className="relative w-28 h-28 rounded-full object-cover ring-2 ring-white/10"
                width={112} height={112} unoptimized />
            </motion.div>
          )}
          <div>
            <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
              style={{ color: c.heading }}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              {data.title || data.userName}
            </motion.h1>

            {data.tagline && (
              <motion.p className="text-lg md:text-xl mt-4 font-light"
                style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                {data.tagline}
              </motion.p>
            )}

            {about && "bio" in about && about.bio && (
              <motion.p className="mt-5 text-base leading-relaxed max-w-lg" style={{ color: c.muted }}
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                {about.bio}
              </motion.p>
            )}

            <motion.div className="mt-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.text} iconSize={20} />}
            </motion.div>
          </div>
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
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.rose} />
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
                        gradientFrom={c.rose} gradientTo={c.peach}
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
          <SectionDivider variant="gradient" color={c.rose} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-4">
              {section.entries.map((e, i) => {
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                return (
                  <motion.div key={i} className="relative rounded-xl overflow-hidden" style={{
                    backgroundColor: c.surface, border: `1px solid ${c.border}`,
                  }}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ background: `linear-gradient(180deg, ${grad.from}, ${grad.to})` }} />
                    <div className="p-6 pl-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-base" style={{ color: c.heading }}>{e.title}</h3>
                          <p className="text-sm font-medium mt-0.5"
                            style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {e.company}{e.location ? ` · ${e.location}` : ""}
                          </p>
                        </div>
                        {(e.startDate || e.endDate) && (
                          <span className="text-xs shrink-0 px-3 py-1 rounded" style={{ backgroundColor: `${c.rose}15`, color: c.rose }}>
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
          <SectionDivider variant="gradient" color={c.rose} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Portfolio</SectionHeading>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {/* # Full-bleed alternating layout — image dominance */}
              <div className="space-y-12">
                {section.entries.map((p, i) => {
                  const isWide = i % 3 === 0;
                  return (
                    <motion.div key={i} variants={staggerItem}
                      className="rounded-xl overflow-hidden group" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                      <motion.div whileHover={{ scale: 1.005 }}>
                        <div className={`relative overflow-hidden ${isWide ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
                          <ImageWithFallback src={p.imageUrl} alt={p.title}
                            fallbackSeed={DEMO.projects[i % DEMO.projects.length]?.title.toLowerCase().replace(/\s/g, "")}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            accentColor={c.rose} fill />
                          {/* # Vignette overlay */}
                          <div className="absolute inset-0 pointer-events-none"
                            style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)" }} />
                        </div>
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-bold" style={{ color: c.heading }}>{p.title}</h3>
                              {p.description && <p className="text-sm leading-relaxed mt-2 line-clamp-2" style={{ color: c.muted }}>{p.description}</p>}
                            </div>
                            {(p.liveUrl || p.repoUrl) && (
                              <div className="flex gap-3 shrink-0">
                                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-4 py-2 rounded-lg text-white" style={{ background: c.gradient }}>View</a>}
                                {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-4 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, color: c.text }}>Source</a>}
                              </div>
                            )}
                          </div>
                          {p.techStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {p.techStack.map((t: string, j: number) => (
                                <span key={j} className="text-[10px] px-2.5 py-1 rounded font-medium" style={{ backgroundColor: `${c.rose}10`, color: c.rose }}>{t}</span>
                              ))}
                            </div>
                          )}
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

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="gradient" color={c.rose} />
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
          <SectionDivider variant="gradient" color={c.rose} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Gallery</SectionHeading>
            {/* # Masonry with varied aspect ratios — photographer aesthetic */}
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {section.entries.map((g, i) => {
                const aspects = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/2]", "aspect-[2/3]", "aspect-[4/3]"];
                return (
                  <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                    className={`block rounded-lg overflow-hidden group break-inside-avoid relative ${aspects[i % aspects.length]}`}
                    style={{ border: `1px solid ${c.border}` }}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                    <ImageWithFallback src={g.imageUrl} alt={g.title}
                      fallbackSeed={DEMO.gallery[i % DEMO.gallery.length]?.title.toLowerCase().replace(/\s/g, "")}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      accentColor={c.rose} fill />
                    {/* # Warm gradient overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, transparent 40%, ${c.bg}dd 90%)` }}>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-bold">{g.title}</p>
                        {g.description && <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{g.description}</p>}
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
          <SectionDivider variant="gradient" color={c.rose} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Client Love</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((t, i) => (
                <motion.div key={i} className="rounded-xl p-6 relative overflow-hidden" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`,
                }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="text-4xl leading-none mb-3" style={{
                    background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>&ldquo;</div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: c.muted }}>{t.quote}</p>
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
          <SectionDivider variant="gradient" color={c.rose} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Certifications</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.entries.map((cert, i) => (
                <motion.div key={i} className="rounded-xl p-5" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <h3 className="text-sm font-bold" style={{ color: c.heading }}>{cert.name}</h3>
                  <p className="text-xs mt-1" style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-block hover:opacity-60 transition-opacity" style={{ color: c.rose }}>Verify →</a>}
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
          <SectionDivider variant="gradient" color={c.rose} />
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
          <SectionDivider variant="gradient" color={c.rose} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Publications</SectionHeading>
            <div className="space-y-3">
              {section.entries.map((pub, i) => (
                <motion.div key={i} className="rounded-xl p-5" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <h3 className="text-sm font-bold" style={{ color: c.heading }}>{pub.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    {pub.venue && <span className="text-xs" style={{ color: c.rose }}>{pub.venue}</span>}
                    {pub.date && <span className="text-xs" style={{ color: c.muted }}>· {pub.date}</span>}
                  </div>
                  {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-block hover:opacity-60 transition-opacity" style={{ color: c.peach }}>Read →</a>}
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
          <SectionDivider variant="gradient" color={c.rose} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <div className="rounded-2xl p-10 md:p-14 text-center relative overflow-hidden" style={{ background: c.gradientSubtle, border: `1px solid ${c.border}` }}>
              <BokehOrbs />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: c.heading }}>Book a Shoot</h2>
                <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: c.muted }}>Available for portraits, weddings, events, and creative projects worldwide.</p>
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
                  {section.email && <a href={`mailto:${section.email}`} className="px-6 py-3 rounded-lg font-bold text-sm text-white transition-all hover:scale-105" style={{ background: c.gradient }}>Get in Touch →</a>}
                  {section.calendarLink && <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105" style={{ border: `1px solid ${c.border}`, color: c.text }}>Schedule</a>}
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

export default function PhotographerTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      <Hero data={data} />

      <div style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div className="max-w-5xl mx-auto">
          <StatsBar data={data} variant="minimal" colors={{
            bg: "transparent", text: c.heading, accent: c.rose, muted: c.muted, border: c.border,
          }} />
        </div>
      </div>

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          {renderSection(section, i)}
        </div>
      ))}

      <footer className="py-12 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:opacity-60 transition-opacity" style={{ color: c.rose }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
