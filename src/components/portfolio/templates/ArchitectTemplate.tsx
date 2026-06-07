"use client";

/* # Architect Template v2 — Copper × Navy Steel dual-tone, blueprint grid, structural design */

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

/* # Dual-tone palette: Copper × Navy Steel — technical precision */
const c = {
  bg: "#0c1524",
  bgAlt: "#0f1a2e",
  surface: "#132038",
  copper: "#c87533",
  navy: "#1e3a5f",
  text: "#e2e8f0",
  muted: "#94a3b8",
  heading: "#f8fafc",
  border: "rgba(200, 117, 51, 0.12)",
  gradient: "linear-gradient(135deg, #c87533, #1e3a5f)",
  copperGlow: "rgba(200, 117, 51, 0.15)",
};

const ENTRY_GRADIENTS = [
  { from: "#c87533", to: "#1e3a5f" },
  { from: "#1e3a5f", to: "#c87533" },
  { from: "#d4873d", to: "#2a4d7a" },
  { from: "#b06a2f", to: "#163050" },
  { from: "#2a4d7a", to: "#d4873d" },
];

const DEMO = {
  projects: [
    { title: "Blueprint", img: "https://picsum.photos/seed/blueprint/800/600" },
    { title: "Structure", img: "https://picsum.photos/seed/structure/600/400" },
    { title: "Facade", img: "https://picsum.photos/seed/facade/600/400" },
    { title: "Interior", img: "https://picsum.photos/seed/interior/600/400" },
  ],
  gallery: [
    { title: "Elevation", img: "https://picsum.photos/seed/elevation/600/500" },
    { title: "Detail", img: "https://picsum.photos/seed/detail/500/600" },
    { title: "Render", img: "https://picsum.photos/seed/render/600/400" },
    { title: "Section", img: "https://picsum.photos/seed/section/500/500" },
    { title: "Model", img: "https://picsum.photos/seed/model/600/400" },
    { title: "Plan", img: "https://picsum.photos/seed/plan/500/600" },
  ],
};

/* # Blueprint grid SVG — technical drawing aesthetic */
function BlueprintGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#c87533" strokeWidth="0.5" />
        </pattern>
        <pattern id="subgrid" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#c87533" strokeWidth="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#subgrid)" />
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/* # Section heading with copper accent and structural lines */
function SectionHeading({ children, code }: { children: React.ReactNode; code?: string }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4">
        {code && (
          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: c.copperGlow, color: c.copper }}>{code}</span>
        )}
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: c.heading }}>
          {children}
        </h2>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-px flex-1" style={{ backgroundColor: c.border }} />
        <div className="w-2 h-2 rotate-45" style={{ border: `1px solid ${c.copper}` }} />
        <div className="h-px w-8" style={{ backgroundColor: c.copper }} />
      </div>
    </div>
  );
}

/* # Hero — structural with blueprint grid background */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header className="relative min-h-[85vh] flex items-center overflow-hidden"
      style={{ backgroundColor: c.bg }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <BlueprintGrid />

      {/* # Copper ambient glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[200px] opacity-10 pointer-events-none"
        style={{ background: c.copper }} />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full blur-[150px] opacity-8 pointer-events-none"
        style={{ background: c.navy }} />

      {/* # Corner brackets decoration */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 opacity-20 pointer-events-none" style={{ borderColor: c.copper }} />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 opacity-20 pointer-events-none" style={{ borderColor: c.copper }} />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" as const }}>
              <div className="absolute -inset-1 rounded-lg rotate-3 opacity-30" style={{ background: c.gradient }} />
              <Image src={avatarUrl} alt={data.userName}
                className="relative w-28 h-28 rounded-lg object-cover" width={112} height={112} unoptimized />
            </motion.div>
          )}
          <div>
            <motion.div className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: c.copper }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              Portfolio / Overview
            </motion.div>
            <motion.h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
              style={{ color: c.heading }}
              initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              {data.title || data.userName}
            </motion.h1>

            {data.tagline && (
              <motion.p className="text-lg mt-4 font-light" style={{ color: c.copper }}
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
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
  const sectionCode = `S${String(index + 1).padStart(2, "0")}`;

  switch (section.type) {
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto relative">
            <BlueprintGrid />
            <div className="relative z-10">
              <SectionHeading code={sectionCode}>Technical Proficiency</SectionHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {groups.map((g, gi) => (
                  <motion.div key={gi} className="rounded-xl p-6" style={{
                    backgroundColor: c.surface, border: `1px solid ${c.border}`,
                  }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: gi * 0.1 }}>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] mb-5" style={{ color: c.copper }}>{g.category}</h3>
                    <div className="space-y-1">
                      {g.skills.map((s, si) => (
                        <SkillBar key={si} name={s.name} proficiency={s.proficiency ?? 80}
                          gradientFrom={c.copper} gradientTo={c.navy}
                          textColor={c.text} mutedColor={c.muted} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        </div>
      );
    }

    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading code={sectionCode}>Professional Timeline</SectionHeading>
            <div className="relative">
              {/* # Vertical timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px hidden md:block" style={{ backgroundColor: c.border }} />
              <div className="space-y-6 md:pl-16">
                {section.entries.map((e, i) => {
                  const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                  return (
                    <motion.div key={i} className="relative" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      {/* # Timeline node */}
                      <div className="absolute -left-16 top-6 hidden md:flex items-center justify-center">
                        <div className="w-3 h-3 rotate-45" style={{ backgroundColor: grad.from, boxShadow: `0 0 8px ${grad.from}40` }} />
                      </div>
                      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                        <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${grad.from}, ${grad.to})` }} />
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-bold text-base" style={{ color: c.heading }}>{e.title}</h3>
                              <p className="text-sm font-medium mt-0.5" style={{ color: c.copper }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                            </div>
                            {(e.startDate || e.endDate) && (
                              <span className="text-xs font-mono shrink-0 px-2.5 py-1 rounded" style={{ backgroundColor: c.copperGlow, color: c.copper }}>
                                {e.startDate} — {e.endDate || "Present"}
                              </span>
                            )}
                          </div>
                          {e.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{e.description}</p>}
                          {e.achievements.length > 0 && (
                            <ul className="mt-3 space-y-1.5">
                              {e.achievements.map((a, j) => (
                                <li key={j} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rotate-45 mt-1.5 shrink-0" style={{ backgroundColor: c.copper }} />
                                  <span className="text-xs leading-relaxed" style={{ color: c.muted }}>{a}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </SectionWrapper>
        </div>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading code={sectionCode}>Project Archive</SectionHeading>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.entries.map((p, i) => {
                  const isFeatured = i === 0;
                  return (
                    <motion.div key={i} variants={staggerItem}
                      className={`rounded-xl overflow-hidden group ${isFeatured ? "md:col-span-2" : ""}`}
                      style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                      <motion.div whileHover={{ y: -3 }}>
                        <div className={`relative overflow-hidden ${isFeatured ? "h-64 md:h-80" : "h-48"}`}>
                          <ImageWithFallback src={p.imageUrl} alt={p.title}
                            fallbackSeed={DEMO.projects[i % DEMO.projects.length]?.title.toLowerCase().replace(/\s/g, "")}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            accentColor={c.copper} fill />
                          {/* # Blueprint overlay on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{ background: `linear-gradient(180deg, transparent 50%, ${c.bg}ee 100%)` }} />
                        </div>
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: c.copper }}>
                                PRJ-{String(i + 1).padStart(3, "0")}
                              </span>
                              <h3 className={`${isFeatured ? "text-xl" : "text-base"} font-bold mt-1`} style={{ color: c.heading }}>{p.title}</h3>
                              {p.description && <p className="text-sm leading-relaxed mt-2 line-clamp-2" style={{ color: c.muted }}>{p.description}</p>}
                            </div>
                          </div>
                          {p.techStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {p.techStack.map((t: string, j: number) => (
                                <span key={j} className="text-[10px] font-mono px-2.5 py-1 rounded" style={{ backgroundColor: c.copperGlow, color: c.copper }}>{t}</span>
                              ))}
                            </div>
                          )}
                          {(p.liveUrl || p.repoUrl) && (
                            <div className="mt-4 flex gap-3">
                              {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-4 py-2 rounded-lg text-white" style={{ background: c.gradient }}>View →</a>}
                              {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-4 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, color: c.text }}>Source</a>}
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
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading code={sectionCode}>Education</SectionHeading>
            <div className="space-y-4">
              {section.entries.map((e, i) => {
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                return (
                  <motion.div key={i} className="rounded-xl overflow-hidden" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${grad.from}, ${grad.to})` }} />
                    <div className="p-6">
                      <h3 className="font-bold text-base" style={{ color: c.heading }}>{e.degree}</h3>
                      <p className="text-sm font-medium mt-1" style={{ color: c.copper }}>{e.school}</p>
                      {e.startDate && <p className="text-xs font-mono mt-2" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                      {e.description && <p className="text-sm leading-relaxed mt-3" style={{ color: c.muted }}>{e.description}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </div>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading code={sectionCode}>Visual Archive</SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {section.entries.map((g, i) => (
                <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                  className="block relative aspect-[4/3] rounded-lg overflow-hidden group"
                  style={{ border: `1px solid ${c.border}` }}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <ImageWithFallback src={g.imageUrl} alt={g.title}
                    fallbackSeed={DEMO.gallery[i % DEMO.gallery.length]?.title.toLowerCase().replace(/\s/g, "")}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    accentColor={c.copper} fill />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(180deg, transparent 50%, ${c.bg}dd 100%)` }}>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white text-sm font-bold">{g.title}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </SectionWrapper>
        </div>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <div style={{ backgroundColor: index % 2 === 0 ? c.bg : c.bgAlt }}>
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading code={sectionCode}>Client Feedback</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((t, i) => (
                <motion.div key={i} className="rounded-xl p-6 relative overflow-hidden" style={{
                  backgroundColor: c.surface, border: `1px solid ${c.border}`,
                }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="text-4xl font-serif leading-none mb-3" style={{ color: c.copperGlow }}>&ldquo;</div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: c.muted }}>{t.quote}</p>
                  <div className="flex items-center gap-3 pt-3" style={{ borderTop: `1px solid ${c.border}` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: c.gradient }}>{t.author.charAt(0)}</div>
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
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading code={sectionCode}>Certifications</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.entries.map((cert, i) => (
                <motion.div key={i} className="rounded-xl p-5" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <h3 className="text-sm font-bold" style={{ color: c.heading }}>{cert.name}</h3>
                  <p className="text-xs font-mono mt-1" style={{ color: c.copper }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-block hover:opacity-60 transition-opacity" style={{ color: c.copper }}>Verify →</a>}
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
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading code={sectionCode}>Awards</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((a, i) => (
                <motion.div key={i} className="rounded-xl p-6" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <h3 className="text-base font-bold" style={{ color: c.heading }}>{a.title}</h3>
                  <p className="text-sm font-medium mt-1" style={{ color: c.copper }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
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
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading code={sectionCode}>Publications</SectionHeading>
            <div className="space-y-3">
              {section.entries.map((pub, i) => (
                <motion.div key={i} className="rounded-xl p-5" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <h3 className="text-sm font-bold" style={{ color: c.heading }}>{pub.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    {pub.venue && <span className="text-xs font-mono" style={{ color: c.copper }}>{pub.venue}</span>}
                    {pub.date && <span className="text-xs" style={{ color: c.muted }}>· {pub.date}</span>}
                  </div>
                  {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-block hover:opacity-60 transition-opacity" style={{ color: c.copper }}>Read →</a>}
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
          <SectionDivider variant="diamond" color={c.copper} />
          <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto relative">
            <BlueprintGrid />
            <div className="relative z-10 rounded-2xl p-10 md:p-14 text-center" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: c.heading }}>Start a Project</h2>
              <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: c.muted }}>Open to collaborations on architectural visualization, structural design, and spatial planning.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                {section.email && (
                  <a href={`mailto:${section.email}`} className="rounded-xl p-4 text-center transition-all hover:scale-105" style={{ backgroundColor: c.bgAlt, border: `1px solid ${c.border}` }}>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: c.muted }}>Email</p>
                    <p className="text-sm truncate" style={{ color: c.text }}>{section.email}</p>
                  </a>
                )}
                {section.phone && (
                  <div className="rounded-xl p-4 text-center" style={{ backgroundColor: c.bgAlt, border: `1px solid ${c.border}` }}>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: c.muted }}>Phone</p>
                    <p className="text-sm" style={{ color: c.text }}>{section.phone}</p>
                  </div>
                )}
                {section.location && (
                  <div className="rounded-xl p-4 text-center" style={{ backgroundColor: c.bgAlt, border: `1px solid ${c.border}` }}>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: c.muted }}>Based in</p>
                    <p className="text-sm" style={{ color: c.text }}>{section.location}</p>
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-center gap-4">
                {section.email && <a href={`mailto:${section.email}`} className="px-6 py-3 rounded-lg font-bold text-sm text-white transition-all hover:scale-105" style={{ background: c.gradient }}>Contact Me →</a>}
                {section.calendarLink && <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105" style={{ border: `1px solid ${c.border}`, color: c.text }}>Schedule</a>}
              </div>
            </div>
          </SectionWrapper>
        </div>
      );
    }

    default: return null;
  }
}

export default function ArchitectTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      <Hero data={data} />

      <div style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div className="max-w-5xl mx-auto">
          <StatsBar data={data} variant="minimal" colors={{
            bg: "transparent", text: c.heading, accent: c.copper, muted: c.muted, border: c.border,
          }} />
        </div>
      </div>

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          {renderSection(section, i)}
        </div>
      ))}

      <footer className="py-12 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:opacity-60 transition-opacity" style={{ color: c.copper }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
