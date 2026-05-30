"use client";

/* # Academic Template — Scholarly landing page with modern visual cards, warm typography */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { autoCategorizeSkills } from "@/lib/skill-categories";

const c = {
  bg: "#f7f3ec",
  surface: "#f0ebe2",
  card: "#ece7dd",
  text: "#3d2c1e",
  muted: "#7a6b5d",
  accent: "#4a6fa5",
  accentDark: "#365280",
  accentSoft: "#4a6fa510",
  border: "#e6dfd4",
  heading: "#1c1008",
  gold: "#b8945e",
};

/* # Gradient colors for experience entry left borders */
const ACADEMIC_GRADIENTS = [
  `linear-gradient(180deg, #4a6fa5, #7c9ec7)`,
  `linear-gradient(180deg, #365280, #5b82b5)`,
  `linear-gradient(180deg, #5c83b8, #8ba8d0)`,
  `linear-gradient(180deg, #3a6090, #6a90c0)`,
  `linear-gradient(180deg, #4878a8, #82aad0)`,
];

function SectionHeading({ children, number }: { children: React.ReactNode; number?: number }) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-4">
        {number !== undefined && (
          <span className="text-5xl font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.border }}>
            {String(number).padStart(2, "0")}
          </span>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
            {children}
          </h2>
          <div className="mt-3 h-px" style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.border} 50%, transparent)` }} />
        </div>
      </div>
    </div>
  );
}

/* # Decorative initial cap for the about bio */
function InitialCap({ text }: { text: string }) {
  if (!text) return null;
  const firstChar = text.charAt(0);
  const rest = text.slice(1);
  return (
    <p className="text-base leading-relaxed" style={{ color: c.muted }}>
      <span className="float-left text-5xl font-bold mr-3 mt-1 leading-none" style={{ fontFamily: "'Lora', Georgia, serif", color: c.accent }}>
        {firstChar}
      </span>
      {rest}
    </p>
  );
}

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative py-20 px-6 md:px-12 overflow-hidden"
      style={{ backgroundColor: c.bg, borderBottom: `1px solid ${c.border}` }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
    >
      {/* # Subtle paper texture */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {avatarUrl && (
            <motion.div className="shrink-0"
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <img src={avatarUrl} alt={data.userName}
                className="w-32 h-32 rounded-xl object-cover shadow-md"
                style={{ border: `2px solid ${c.border}` }} />
            </motion.div>
          )}
          <div className="flex-1">
            <motion.h1 className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}
              initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              {data.title || data.userName}
            </motion.h1>
            {data.tagline && (
              <motion.p className="text-lg mt-3 italic" style={{ color: c.accent }}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                {data.tagline}
              </motion.p>
            )}
            {about && "bio" in about && about.bio && (
              <motion.div className="mt-6"
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <InitialCap text={about.bio} />
              </motion.div>
            )}
            <motion.div className="mt-6"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.accent} iconSize={20} />}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

let sectionCounter = 0;

function renderSection(section: PortfolioSection) {
  sectionCounter++;
  const num = sectionCounter;

  switch (section.type) {

    /* # ─── EXPERIENCE — Two-column grid of compact numbered journal cards ─── */
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Academic &amp; Professional Experience</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((e, i) => {
              const grad = ACADEMIC_GRADIENTS[i % ACADEMIC_GRADIENTS.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden"
                  style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  {/* # Gradient top strip */}
                  <div className="h-1" style={{ background: grad }} />

                  <div className="p-4">
                    {/* # Large faded number + title row */}
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-3xl font-bold leading-none shrink-0"
                        style={{ fontFamily: "'Lora', Georgia, serif", color: `${c.accent}20` }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <h3 className="text-sm font-bold leading-tight" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
                          {e.title}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: c.accent }}>
                          {e.company}{e.location ? ` · ${e.location}` : ""}
                        </p>
                      </div>
                    </div>

                    {(e.startDate || e.endDate) && (
                      <span className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-2"
                        style={{ background: `${c.accent}10`, color: c.accent }}>
                        {e.startDate} – {e.endDate || "Present"}
                      </span>
                    )}

                    {e.description && (
                      <p className="text-xs leading-relaxed mb-2" style={{ color: c.muted }}>{e.description}</p>
                    )}

                    {e.achievements.length > 0 && (
                      <ul className="space-y-1 border-t pt-2" style={{ borderColor: c.border }}>
                        {e.achievements.map((a, j) => (
                          <li key={j} className="text-xs flex items-start gap-1.5" style={{ color: c.text }}>
                            <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ backgroundColor: c.accent }} />
                            <span className="leading-relaxed">{a}</span>
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
      );

    /* # ─── PUBLICATIONS — Premium numbered badge cards with journal pills ─── */
    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Publications</SectionHeading>
          <div className="space-y-5">
            {section.entries.map((pub, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden relative"
                style={{
                  backgroundColor: c.card,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                whileHover={{
                  y: -3,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  transition: { duration: 0.2 },
                }}
              >
                {/* # Gradient accent left border */}
                <div className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: `linear-gradient(180deg, ${c.accent}, ${c.accent}50)` }} />

                {/* # Subtle background tint */}
                <div className="absolute inset-0 opacity-[0.02]"
                  style={{ background: `linear-gradient(135deg, ${c.accent}, transparent)` }} />

                <div className="relative p-6 pl-7 flex items-start gap-4">
                  {/* # Large colored number badge */}
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-base shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`,
                      boxShadow: `0 4px 12px ${c.accent}30`,
                    }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold leading-snug" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
                      {pub.title}
                    </h3>
                    {/* # Venue in a colored tag/pill + date pill */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {pub.venue && (
                        <span className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{
                            background: `linear-gradient(135deg, ${c.accent}15, ${c.accent}08)`,
                            color: c.accent,
                            border: `1px solid ${c.accent}20`,
                          }}>
                          {pub.venue}
                        </span>
                      )}
                      {pub.date && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${c.gold}15`, color: c.gold }}>
                          {pub.date}
                        </span>
                      )}
                    </div>
                    {pub.link && (
                      <a href={pub.link} target="_blank" rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold hover:shadow-md transition-shadow"
                        style={{
                          background: `linear-gradient(135deg, ${c.accent}12, ${c.accent}06)`,
                          color: c.accent,
                          border: `1px solid ${c.accent}20`,
                        }}>
                        [PDF] View Publication →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── EDUCATION — Cards with gradient header strip ─── */
    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Education</SectionHeading>
          <div className="space-y-5">
            {section.entries.map((e, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: c.card,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.08)", transition: { duration: 0.2 } }}
              >
                {/* # Gradient header strip — blue to gold */}
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.gold}, ${c.accent}30)` }} />

                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      {/* # Degree name large */}
                      <h3 className="text-xl font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
                        {e.degree}
                      </h3>
                      {/* # School in accent color */}
                      <p className="text-sm font-semibold mt-1" style={{ color: c.accent }}>
                        {e.school}{e.location ? ` · ${e.location}` : ""}
                      </p>
                    </div>
                    {/* # Year in a gradient badge */}
                    {(e.startDate || e.endDate) && (
                      <span className="text-xs font-semibold shrink-0 px-4 py-1.5 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${c.accent}15, ${c.gold}12)`,
                          color: c.accent,
                          border: `1px solid ${c.accent}20`,
                        }}>
                        {e.startDate}{e.endDate ? ` {"–"} ${e.endDate}` : ""}
                      </span>
                    )}
                  </div>
                  {e.description && (
                    <div className="mt-4 px-4 py-3 rounded-lg" style={{ backgroundColor: c.surface }}>
                      <p className="text-sm leading-relaxed" style={{ color: c.text }}>{e.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── SKILLS — Unchanged premium layout ─── */
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Research Interests &amp; Skills</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((g, i) => (
              <motion.div key={i} className="p-6 rounded-xl"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.08)", transition: { duration: 0.2 } }}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: c.accent }}>{g.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s, j) => (
                    <span key={j} className="text-sm px-3 py-1.5 rounded-lg font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${c.accent}10, ${c.accent}05)`,
                        color: c.accent,
                        border: `1px solid ${c.accent}15`,
                      }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );
    }

    /* # ─── PROJECTS — Featured first (full-width) + gradient-bordered cards ─── */
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Research Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* # Featured first project — full-width with image + text */}
            {section.entries.length > 0 && (() => {
              const p = section.entries[0];
              return (
                <motion.div variants={staggerItem} className="mb-8">
                  <motion.div className="rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: c.card,
                      border: `1px solid ${c.border}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                    whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
                    <div className="flex flex-col lg:flex-row">
                      {p.imageUrl && (
                        <div className="lg:w-1/2 overflow-hidden relative group">
                          <img src={p.imageUrl} alt={p.title}
                            className="w-full h-64 lg:h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: `linear-gradient(135deg, ${c.accent}20, transparent)` }} />
                        </div>
                      )}
                      <div className={`p-8 flex flex-col justify-center ${p.imageUrl ? "lg:w-1/2" : "w-full"}`}>
                        {/* # Featured label */}
                        <span className="inline-flex items-center self-start text-xs font-bold px-3 py-1 rounded-full mb-4 text-white"
                          style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark})` }}>
                          Featured Research
                        </span>
                        <h3 className="text-2xl font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{p.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed" style={{ color: c.text }}>{p.description}</p>
                        {/* # Tech stack as accent pills */}
                        {p.techStack.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {p.techStack.map((t, j) => (
                              <span key={j} className="text-xs px-3 py-1 rounded-full font-semibold"
                                style={{
                                  background: `linear-gradient(135deg, ${c.accent}12, ${c.accent}06)`,
                                  color: c.accent,
                                  border: `1px solid ${c.accent}18`,
                                }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* # Gradient CTA buttons */}
                        <div className="mt-6 flex gap-3">
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all hover:shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`,
                                boxShadow: `0 3px 12px ${c.accent}30`,
                              }}>
                              View Project →
                            </a>
                          )}
                          {p.repoUrl && (
                            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-bold px-5 py-2.5 rounded-lg transition-all hover:opacity-80"
                              style={{ color: c.accent, border: `1px solid ${c.accent}30` }}>
                              Repository
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}

            {/* # Remaining projects in gradient-bordered cards */}
            {section.entries.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.entries.slice(1).map((p, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <motion.div className="rounded-xl overflow-hidden h-full relative"
                      style={{
                        backgroundColor: c.card,
                        border: `1px solid ${c.border}`,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                      whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}>
                      {/* # Gradient top border */}
                      <div className="h-1" style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.gold}60, transparent)` }} />
                      {p.imageUrl && (
                        <div className="overflow-hidden h-44 relative group">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-bold text-base" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{p.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.text }}>{p.description}</p>
                        {p.techStack.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.techStack.slice(0, 4).map((t, j) => (
                              <span key={j} className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                                style={{ background: `${c.accent}10`, color: c.accent }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 flex gap-3 text-sm">
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="font-bold px-4 py-1.5 rounded-lg text-white transition-all hover:shadow-md"
                              style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark})` }}>
                              View →
                            </a>
                          )}
                          {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="font-bold px-4 py-1.5 hover:underline" style={{ color: c.accent }}>Repo</a>}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </SectionWrapper>
      );

    /* # ─── CERTIFICATIONS — Badge/shield-style cards with gradient fills ─── */
    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Certifications</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.entries.map((cert, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden relative"
                style={{
                  backgroundColor: c.card,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.08)", transition: { duration: 0.2 } }}
              >
                {/* # Subtle gradient fill */}
                <div className="absolute inset-0 opacity-[0.02]"
                  style={{ background: `linear-gradient(135deg, ${c.accent}, transparent)` }} />

                <div className="relative p-5 flex items-center gap-4">
                  {/* # Shield badge with gradient and glowing checkmark */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`,
                      boxShadow: `0 4px 15px ${c.accent}30`,
                    }}>
                    <span className="text-lg text-white font-bold"
                      style={{ textShadow: "0 0 8px rgba(255,255,255,0.5)" }}>
                      ✓
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
                      {cert.link ? (
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{cert.name}</a>
                      ) : cert.name}
                    </h3>
                    {/* # Issuer and date as separate pill elements */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={{ background: `${c.accent}12`, color: c.accent }}>
                        {cert.issuer}
                      </span>
                      {cert.date && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${c.gold}12`, color: c.gold }}>
                          {cert.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── AWARDS — Cards with amber/gold gradient accent ─── */
    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Awards &amp; Fellowships</SectionHeading>
          <div className="space-y-5">
            {section.entries.map((a, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden relative"
                style={{
                  backgroundColor: c.card,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.08)", transition: { duration: 0.2 } }}
              >
                {/* # Gold/amber gradient accent left border */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                  style={{ background: `linear-gradient(180deg, ${c.gold}, #d4a84a)` }} />

                {/* # Subtle gold gradient fill */}
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{ background: `linear-gradient(135deg, ${c.gold}, transparent 50%)` }} />

                <div className="relative p-6 pl-7">
                  <div className="flex items-start gap-4">
                    {/* # Gold trophy badge */}
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${c.gold}, #d4a84a)`,
                        boxShadow: `0 4px 12px ${c.gold}30`,
                      }}>
                      <span className="text-white text-lg">★</span>
                    </div>
                    <div className="flex-1">
                      {/* # Award title prominent */}
                      <h3 className="text-lg font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
                        {a.title}
                      </h3>
                      {/* # Issuer as colored subtitle */}
                      <p className="text-sm font-semibold mt-0.5" style={{ color: c.gold }}>
                        {a.issuer}{a.date ? ` · ${a.date}` : ""}
                      </p>
                    </div>
                  </div>
                  {/* # Description in a tinted box */}
                  {a.description && (
                    <div className="mt-4 px-4 py-3 rounded-lg" style={{ backgroundColor: `${c.gold}08` }}>
                      <p className="text-sm leading-relaxed" style={{ color: c.text }}>{a.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── GALLERY — Bento grid with varying sizes, video support, scholarly aesthetic ─── */
    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Gallery</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[170px] md:auto-rows-[190px] gap-4">
            {section.entries.map((g, i) => {
              const isVideo = Boolean(g.videoUrl && g.videoUrl.trim().length > 0);
              /* # Bento pattern: hero → square → tall → normal → normal → wide */
              const bentoClass = (() => {
                const total = section.entries.length;
                if (total <= 2) return i === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-2";
                const pattern = [
                  "md:col-span-2 md:row-span-2",
                  "",
                  "md:row-span-2",
                  "",
                  "",
                  "md:col-span-2",
                ];
                return pattern[i % pattern.length] || "";
              })();

              return (
                <motion.a key={i} href={g.link || g.videoUrl || g.imageUrl} target="_blank" rel="noopener noreferrer"
                  className={`block group relative rounded-xl overflow-hidden ${bentoClass}`}
                  style={{ border: `1px solid ${c.border}` }}
                  whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <img src={g.imageUrl} alt={g.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                  {/* # Video play button */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${c.accent}cc`, boxShadow: `0 0 25px ${c.accent}30` }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
                      </div>
                    </div>
                  )}

                  {/* # Featured badge */}
                  {i === 0 && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                      style={{ backgroundColor: `${c.accent}25`, border: `1px solid ${c.accent}30`, color: c.accent }}>
                      Featured
                    </div>
                  )}

                  {/* # Category badge */}
                  {g.category && i !== 0 && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                      style={{ backgroundColor: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.85)" }}>
                      {g.category}
                    </div>
                  )}

                  {/* # Gradient overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                    style={{ background: `linear-gradient(to top, ${c.accent}cc, ${c.accent}40 40%, transparent 70%)` }}>
                    <div>
                      <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Lora', Georgia, serif" }}>{g.title}</h3>
                      {g.description && <p className="text-white/70 text-xs mt-1">{g.description}</p>}
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </SectionWrapper>
      );

    /* # ─── TESTIMONIALS — Frosted cards with large gradient quote marks ─── */
    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Recommendations</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden relative"
                style={{
                  backgroundColor: c.card,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.08)", transition: { duration: 0.2 } }}
              >
                {/* # Gradient border at top */}
                <div className="h-1" style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.gold}, transparent)` }} />

                {/* # Subtle frosted background tint */}
                <div className="absolute inset-0 opacity-[0.02]"
                  style={{ background: `linear-gradient(135deg, ${c.accent}, transparent)` }} />

                <div className="relative p-6">
                  {/* # Large decorative gradient quote marks */}
                  <div className="text-6xl font-bold leading-none mb-3"
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      background: `linear-gradient(135deg, ${c.accent}, ${c.gold})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      opacity: 0.3,
                    }}>
                    {"“"}
                  </div>

                  {/* # Quote in a frosted tinted card */}
                  <div className="px-4 py-3 rounded-lg mb-5" style={{ backgroundColor: c.surface }}>
                    <p className="text-sm italic leading-relaxed" style={{ color: c.text }}>
                      {"“"}{t.quote}{"”"}
                    </p>
                  </div>

                  {/* # Author with colored avatar circle and accent separator */}
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop: `2px solid ${c.accent}15` }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`,
                        boxShadow: `0 3px 10px ${c.accent}30`,
                      }}>
                      {t.author.charAt(0)}
                    </div>
                    {/* # Accent separator line */}
                    <div className="w-0.5 h-8 rounded-full" style={{ backgroundColor: `${c.accent}20` }} />
                    <div>
                      <p className="font-bold text-sm" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{t.author}</p>
                      <p className="text-xs" style={{ color: c.accent }}>{t.role}{t.company ? `, ${t.company}` : ""}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── CONTACT — Full-width blue gradient background CTA ─── */
    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-0">
          {/* # Full-width blue gradient background */}
          <div className="py-20 px-6 md:px-12 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark}, #2a4a75)` }}>
            {/* # Subtle paper texture on blue */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

            {/* # Warm ambient glow */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.12]"
              style={{ background: c.gold }} />

            <div className="relative z-10 max-w-4xl mx-auto">
              {/* # Large heading */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Lora', Georgia, serif", color: "#ffffff" }}>
                  Let&apos;s Connect
                </h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Open for collaboration, research partnerships, and academic inquiries.
                </p>
                <div className="mt-4 h-px w-16 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${c.gold}, transparent)` }} />
              </div>

              {/* # Contact items in warm-toned cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {section.email && (
                  <motion.a href={`mailto:${section.email}`}
                    className="flex items-center gap-4 p-5 rounded-xl group"
                    style={{
                      backgroundColor: "rgba(254,252,247,0.08)",
                      border: "1px solid rgba(254,252,247,0.12)",
                      backdropFilter: "blur(10px)",
                    }}
                    whileHover={{ backgroundColor: "rgba(254,252,247,0.12)", borderColor: `${c.gold}40` }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.gold}40, ${c.gold}20)` }}>
                      <span className="text-lg" style={{ color: c.gold }}>✉</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.gold }}>Email</p>
                      <p className="text-sm font-bold mt-0.5 text-white">{section.email}</p>
                    </div>
                  </motion.a>
                )}
                {section.phone && (
                  <motion.a href={`tel:${section.phone}`}
                    className="flex items-center gap-4 p-5 rounded-xl group"
                    style={{
                      backgroundColor: "rgba(254,252,247,0.08)",
                      border: "1px solid rgba(254,252,247,0.12)",
                      backdropFilter: "blur(10px)",
                    }}
                    whileHover={{ backgroundColor: "rgba(254,252,247,0.12)", borderColor: `${c.gold}40` }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.gold}40, ${c.gold}20)` }}>
                      <span className="text-lg" style={{ color: c.gold }}>☎</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.gold }}>Phone</p>
                      <p className="text-sm font-bold mt-0.5 text-white">{section.phone}</p>
                    </div>
                  </motion.a>
                )}
                {section.location && (
                  <motion.div
                    className="flex items-center gap-4 p-5 rounded-xl"
                    style={{
                      backgroundColor: "rgba(254,252,247,0.08)",
                      border: "1px solid rgba(254,252,247,0.12)",
                      backdropFilter: "blur(10px)",
                    }}
                    whileHover={{ backgroundColor: "rgba(254,252,247,0.12)", borderColor: `${c.gold}40` }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.gold}40, ${c.gold}20)` }}>
                      <span className="text-lg" style={{ color: c.gold }}>⌘</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.gold }}>Location</p>
                      <p className="text-sm font-bold mt-0.5 text-white">{section.location}</p>
                    </div>
                  </motion.div>
                )}
                {section.calendarLink && (
                  <motion.a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-xl group"
                    style={{
                      backgroundColor: "rgba(254,252,247,0.08)",
                      border: "1px solid rgba(254,252,247,0.12)",
                      backdropFilter: "blur(10px)",
                    }}
                    whileHover={{ backgroundColor: "rgba(254,252,247,0.12)", borderColor: `${c.gold}40` }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.gold}40, ${c.gold}20)` }}>
                      <span className="text-lg" style={{ color: c.gold }}>{"📅"}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.gold }}>Office Hours</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: c.gold }}>Schedule a meeting →</p>
                    </div>
                  </motion.a>
                )}
              </div>

              {/* # Prominent gradient CTA button */}
              <div className="text-center mb-6">
                {section.email && (
                  <a href={`mailto:${section.email}`}
                    className="inline-flex items-center px-10 py-3.5 rounded-lg font-bold text-sm tracking-wide transition-all hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${c.gold}, #d4a84a)`,
                      color: c.heading,
                      boxShadow: `0 4px 20px ${c.gold}40`,
                    }}>
                    Get In Touch →
                  </a>
                )}
              </div>

              {/* # Social links with colored hover */}
              {section.socialLinks && Object.keys(section.socialLinks).length > 0 && (
                <div className="text-center pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <SocialIcons links={section.socialLinks} color={c.gold} />
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

export default function AcademicTemplate({ data }: { data: PortfolioData }) {
  sectionCounter = 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      <StatsBar data={data} variant="serif" colors={{
        bg: c.bg, text: c.text, accent: c.accent, muted: c.muted, border: c.border,
      }} />

      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
        ))}
      <footer className="py-16 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.accent }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
