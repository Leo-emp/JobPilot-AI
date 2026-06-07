"use client";

/* # Academic Template v2 — Sapphire × Steel Blue dual-tone, scholarly paper style */

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

/* # Dual-tone palette: Sapphire × Steel Blue (light scholarly theme) */
const c = {
  bg: "#f8f6f2",
  bgAlt: "#f0ede6",
  surface: "#ffffff",
  /* # Primary gradient pair */
  sapphire: "#1d4ed8",
  steel: "#64748b",
  text: "#1e293b",
  muted: "#64748b",
  heading: "#0f172a",
  border: "#e2e8f0",
  gradient: "linear-gradient(135deg, #1d4ed8, #64748b)",
  accentSoft: "#1d4ed808",
};

const ACCENT_COLORS = ["#1d4ed8", "#475569", "#2563eb", "#334155", "#3b82f6"];
const ENTRY_GRADIENTS = [
  { from: "#1d4ed8", to: "#3b82f6" },
  { from: "#475569", to: "#1d4ed8" },
  { from: "#2563eb", to: "#64748b" },
  { from: "#334155", to: "#2563eb" },
  { from: "#3b82f6", to: "#475569" },
];

const DEMO = {
  projects: [
    { title: "Research Paper", img: "https://picsum.photos/seed/research/800/500" },
    { title: "Data Visualization", img: "https://picsum.photos/seed/dataviz/600/400" },
    { title: "Lab Equipment", img: "https://picsum.photos/seed/laboratory/600/400" },
    { title: "Conference Poster", img: "https://picsum.photos/seed/poster/600/400" },
  ],
  gallery: [
    { title: "Publication", img: "https://picsum.photos/seed/publication/600/500" },
    { title: "Lecture Hall", img: "https://picsum.photos/seed/lecture/500/600" },
    { title: "Lab Work", img: "https://picsum.photos/seed/labwork/600/400" },
    { title: "Graduation", img: "https://picsum.photos/seed/graduation/500/500" },
    { title: "Symposium", img: "https://picsum.photos/seed/symposium/600/400" },
    { title: "Library", img: "https://picsum.photos/seed/library/500/600" },
  ],
};

/* # Section heading with numbered academic style */
function SectionHeading({ children, number }: { children: React.ReactNode; number?: number }) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-4">
        {number !== undefined && (
          <span className="text-5xl font-black" style={{ color: `${c.sapphire}15` }}>
            {String(number).padStart(2, "0")}
          </span>
        )}
        <h2 className="text-3xl font-bold" style={{ fontFamily: "'Merriweather', Georgia, serif", color: c.heading }}>
          {children}
        </h2>
      </div>
      <div className="mt-4 h-0.5 w-16 rounded-full" style={{ background: c.gradient }} />
    </div>
  );
}

/* # Hero section — clean scholarly header with sapphire accents */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header className="relative min-h-[85vh] flex items-center overflow-hidden"
      style={{ backgroundColor: c.sapphire }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      {/* # Subtle ruled lines pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px)`,
      }} />

      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[200px] opacity-20 pointer-events-none"
        style={{ background: "#3b82f6" }} />

      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center gap-12">
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" as const }}>
              <Image src={avatarUrl} alt={data.userName}
                className="w-32 h-32 rounded-2xl object-cover shadow-lg ring-2 ring-white/20" width={128} height={128} unoptimized />
            </motion.div>
          )}
          <div>
            <motion.h1 className="text-4xl md:text-6xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Merriweather', Georgia, serif" }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              {data.title || data.userName}
            </motion.h1>

            {data.tagline && (
              <motion.p className="text-lg mt-4 font-medium text-white/70"
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                {data.tagline}
              </motion.p>
            )}

            {about && "bio" in about && about.bio && (
              <motion.p className="mt-6 text-base leading-relaxed text-white/60 max-w-xl"
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                {about.bio}
              </motion.p>
            )}

            <motion.div className="mt-8"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color="#ffffff" iconSize={20} />}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

/* # Main section renderer */
function renderSection(section: PortfolioSection, index: number) {
  const isAlt = index % 2 === 1;
  const sectionNum = index + 1;

  switch (section.type) {
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <SectionHeading number={sectionNum}>Research Competencies</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((g, gi) => (
                <motion.div key={gi} className="rounded-xl p-6" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: gi * 0.1 }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: c.sapphire }}>{g.category}</h3>
                  <div className="space-y-1">
                    {g.skills.map((s, si) => (
                      <SkillBar key={si} name={s.name} proficiency={s.proficiency ?? 80}
                        gradientFrom={c.sapphire} gradientTo={c.steel}
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
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <SectionHeading number={sectionNum}>Academic & Professional Experience</SectionHeading>
            <div className="space-y-4">
              {section.entries.map((e, i) => {
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                return (
                  <motion.div key={i} className="relative rounded-xl overflow-hidden" style={{
                    backgroundColor: c.surface, border: `1px solid ${c.border}`,
                  }}
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{
                      background: `linear-gradient(180deg, ${grad.from}, ${grad.to})`,
                    }} />
                    <div className="p-6 pl-7">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-base" style={{ fontFamily: "'Merriweather', serif", color: c.heading }}>{e.title}</h3>
                          <p className="text-sm font-semibold mt-0.5" style={{ color: c.sapphire }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                        </div>
                        {(e.startDate || e.endDate) && (
                          <span className="text-xs shrink-0 px-2.5 py-1 rounded" style={{ backgroundColor: c.bgAlt, color: c.muted }}>
                            {e.startDate} — {e.endDate || "Present"}
                          </span>
                        )}
                      </div>
                      {e.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{e.description}</p>}
                      {e.achievements.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {e.achievements.map((a, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: grad.from }} />
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
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <SectionHeading number={sectionNum}>Research Projects</SectionHeading>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {section.entries.map((p, i) => {
                  const isFeatured = i === 0;
                  return (
                    <motion.div key={i} variants={staggerItem}
                      className={`rounded-xl overflow-hidden group ${isFeatured ? "md:col-span-2" : ""}`}
                      style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                      <motion.div className="h-full" whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
                        <div className={`${isFeatured ? "flex flex-col md:flex-row" : ""}`}>
                          <div className={`relative overflow-hidden ${isFeatured ? "md:w-1/2 min-h-[200px]" : "h-40"}`}>
                            <ImageWithFallback src={p.imageUrl} alt={p.title}
                              fallbackSeed={DEMO.projects[i % DEMO.projects.length]?.title.toLowerCase().replace(/\s/g, "")}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              accentColor={c.sapphire} fill />
                          </div>
                          <div className={`p-5 ${isFeatured ? "md:w-1/2 flex flex-col justify-center" : ""}`}>
                            <h3 className={`${isFeatured ? "text-xl" : "text-base"} font-bold`} style={{ fontFamily: "'Merriweather', serif", color: c.heading }}>{p.title}</h3>
                            {p.description && <p className="mt-2 text-sm leading-relaxed line-clamp-3" style={{ color: c.muted }}>{p.description}</p>}
                            {p.techStack.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {p.techStack.slice(0, 4).map((t: string, j: number) => (
                                  <span key={j} className="text-[10px] px-2 py-0.5 rounded font-medium" style={{ backgroundColor: `${c.sapphire}08`, color: c.sapphire }}>{t}</span>
                                ))}
                              </div>
                            )}
                            {isFeatured && (p.liveUrl || p.repoUrl) && (
                              <div className="mt-4 flex gap-3">
                                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-4 py-2 rounded-lg text-white" style={{ background: c.gradient }}>View →</a>}
                                {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-4 py-2 rounded-lg hover:opacity-80" style={{ color: c.sapphire, border: `1px solid ${c.border}` }}>Source</a>}
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

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <SectionHeading number={sectionNum}>Education</SectionHeading>
            <div className="space-y-4">
              {section.entries.map((e, i) => {
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                return (
                  <motion.div key={i} className="rounded-xl overflow-hidden" style={{
                    backgroundColor: c.surface, border: `1px solid ${c.border}`,
                  }}
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <div className="p-6 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold" style={{ fontFamily: "'Merriweather', serif", color: c.heading }}>{e.degree}</h3>
                        <p className="text-sm font-semibold mt-1" style={{ color: grad.from }}>{e.school}</p>
                        {e.startDate && <p className="text-xs mt-2" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                        {e.description && <p className="text-sm leading-relaxed mt-3 pt-3" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>{e.description}</p>}
                      </div>
                      {e.endDate && (
                        <div className="shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white"
                          style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}>
                          <span className="text-lg font-black leading-none">{e.endDate.slice(-2)}</span>
                          <span className="text-[8px] uppercase mt-0.5 opacity-70">year</span>
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

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <SectionHeading number={sectionNum}>Publications</SectionHeading>
            <div className="space-y-4">
              {section.entries.map((pub, i) => (
                <motion.div key={i} className="rounded-xl overflow-hidden" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`,
                }}
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="p-6 flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: c.gradient }}>{String(i + 1).padStart(2, "0")}</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base" style={{ fontFamily: "'Merriweather', serif", color: c.heading }}>{pub.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {pub.venue && <span className="text-xs px-2.5 py-1 rounded font-medium" style={{ backgroundColor: `${c.sapphire}08`, color: c.sapphire }}>{pub.venue}</span>}
                        {pub.date && <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: c.bgAlt, color: c.muted }}>{pub.date}</span>}
                      </div>
                      {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-3 inline-block font-medium hover:underline" style={{ color: c.sapphire }}>Read Publication →</a>}
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
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <SectionHeading number={sectionNum}>Certifications</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.entries.map((cert, i) => (
                <motion.div key={i} className="rounded-xl p-5" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-base font-bold text-white"
                      style={{ background: c.gradient }}>✓</div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm" style={{ color: c.heading }}>{cert.name}</h3>
                      <p className="text-xs mt-1" style={{ color: c.sapphire }}>{cert.issuer}</p>
                      {cert.date && <span className="text-xs" style={{ color: c.muted }}> · {cert.date}</span>}
                      {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs block mt-1 hover:underline" style={{ color: c.sapphire }}>Verify →</a>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <SectionHeading number={sectionNum}>Awards & Honors</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((a, i) => (
                <motion.div key={i} className="rounded-xl p-6" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <h3 className="font-bold text-base" style={{ fontFamily: "'Merriweather', serif", color: c.heading }}>{a.title}</h3>
                  <p className="text-sm font-semibold mt-1" style={{ color: c.sapphire }}>{a.issuer}</p>
                  {a.date && <span className="text-xs" style={{ color: c.muted }}> · {a.date}</span>}
                  {a.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{a.description}</p>}
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <SectionHeading number={sectionNum}>Gallery</SectionHeading>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {section.entries.map((g, i) => {
                const heights = ["h-48", "h-60", "h-52", "h-64", "h-44", "h-56"];
                return (
                  <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                    className={`block rounded-xl overflow-hidden group break-inside-avoid relative ${heights[i % heights.length]}`}
                    style={{ border: `1px solid ${c.border}` }}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <ImageWithFallback src={g.imageUrl} alt={g.title}
                      fallbackSeed={DEMO.gallery[i % DEMO.gallery.length]?.title.toLowerCase().replace(/\s/g, "")}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      accentColor={c.sapphire} fill />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, transparent 40%, ${c.sapphire}cc 80%)` }}>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-bold text-sm">{g.title}</p>
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
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <SectionHeading number={sectionNum}>Endorsements</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((t, i) => (
                <motion.div key={i} className="rounded-xl p-6" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="text-4xl font-serif leading-none mb-3" style={{ color: `${c.sapphire}30` }}>&ldquo;</div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: c.muted }}>{t.quote}</p>
                  <div className="flex items-center gap-3 pt-3" style={{ borderTop: `1px solid ${c.border}` }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: c.gradient }}>{t.author.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: c.heading }}>{t.author}</p>
                      <p className="text-xs" style={{ color: c.sapphire }}>{t.role}{t.company ? `, ${t.company}` : ""}</p>
                    </div>
                  </div>
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
        <div style={{ backgroundColor: isAlt ? c.bgAlt : c.bg }}>
          <SectionDivider variant="dots" color={c.sapphire} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
            <div className="rounded-2xl p-10 md:p-14 text-center text-white relative overflow-hidden" style={{ background: c.gradient }}>
              <div className="absolute inset-0 opacity-[0.05]" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(255,255,255,0.2) 29px, rgba(255,255,255,0.2) 30px)`,
              }} />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Get In Touch</h2>
                <p className="mt-3 text-white/70 max-w-md mx-auto">Open to research collaborations, speaking engagements, and academic opportunities.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8 mb-8">
                  {section.email && (
                    <a href={`mailto:${section.email}`} className="group block rounded-xl p-4 text-center transition-all group-hover:scale-105" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1 text-white/60">Email</p>
                      <p className="text-sm text-white truncate">{section.email}</p>
                    </a>
                  )}
                  {section.phone && (
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1 text-white/60">Phone</p>
                      <p className="text-sm text-white">{section.phone}</p>
                    </div>
                  )}
                  {section.location && (
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                      <p className="text-[10px] uppercase tracking-widest mb-1 text-white/60">Location</p>
                      <p className="text-sm text-white">{section.location}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {section.email && <a href={`mailto:${section.email}`} className="px-6 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105" style={{ backgroundColor: "#fff", color: c.sapphire }}>Contact Me →</a>}
                  {section.calendarLink && <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg font-bold text-sm text-white transition-all hover:scale-105" style={{ border: "1px solid rgba(255,255,255,0.3)" }}>Schedule Meeting</a>}
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

export default function AcademicTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      <div style={{ backgroundColor: c.bgAlt, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div className="max-w-4xl mx-auto">
          <StatsBar data={data} variant="minimal" colors={{
            bg: "transparent", text: c.heading, accent: c.sapphire, muted: c.muted, border: c.border,
          }} />
        </div>
      </div>

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          {renderSection(section, i)}
        </div>
      ))}

      <footer className="py-12 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.sapphire }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
