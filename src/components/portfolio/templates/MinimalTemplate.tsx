"use client";

/* # Minimal Template — Premium landing page with clean luxury, visual depth, gradient cards */

import Image from "next/image";
import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { autoCategorizeSkills } from "@/lib/skill-categories";

const defaultColors = {
  bg: "#f4f4f8",
  surface: "#eeeef3",
  text: "#0f0f0f",
  muted: "#6b7280",
  accent: "#2563eb",
  accentSoft: "#2563eb12",
  cardBg: "#eaeaf0",
  border: "#00000008",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)",
  shadowHover: "0 4px 12px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)",
};

function getColors(data: PortfolioData) {
  const tc = data.themeColors;
  return {
    ...defaultColors,
    ...(tc ? { accent: tc.primary, accentSoft: `${tc.primary}12`, bg: tc.background || defaultColors.bg } : {}),
  };
}

/* # Gradient border colors for experience entries — cycles through these */
const ENTRY_GRADIENTS = [
  "linear-gradient(180deg, #2563eb, #7c3aed)",
  "linear-gradient(180deg, #0ea5e9, #2563eb)",
  "linear-gradient(180deg, #8b5cf6, #ec4899)",
  "linear-gradient(180deg, #06b6d4, #3b82f6)",
  "linear-gradient(180deg, #6366f1, #a855f7)",
  "linear-gradient(180deg, #14b8a6, #0ea5e9)",
];

/* # Section heading with accent underline */
function SectionHeading({ title, colors }: { title: string; colors: typeof defaultColors }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold tracking-tight" style={{ color: colors.text }}>{title}</h2>
      <motion.div className="mt-3 h-0.5 w-12 rounded-full"
        style={{ backgroundColor: colors.accent }}
        initial={{ width: 0 }} whileInView={{ width: 48 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
    </div>
  );
}

function Hero({ data, colors }: { data: PortfolioData; colors: typeof defaultColors }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative pt-28 pb-20 px-6 md:px-12 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
    >
      {/* # Subtle gradient glow behind hero */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.07]"
        style={{ background: colors.accent }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.04]"
        style={{ background: colors.accent }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" as const }}>
              <div className="absolute -inset-1 rounded-full opacity-20 blur-md" style={{ background: colors.accent }} />
              <Image src={avatarUrl} alt={data.userName}
                className="relative w-32 h-32 rounded-full object-cover ring-4 ring-gray-200 shadow-xl" width={128} height={128} unoptimized />
            </motion.div>
          )}
          <div>
            <motion.h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none"
              style={{ color: colors.text }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              {data.title || data.userName}
            </motion.h1>
            {data.tagline && (
              <motion.p className="text-xl mt-3 font-medium" style={{ color: colors.accent }}
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                {data.tagline}
              </motion.p>
            )}
            {about && "bio" in about && about.bio && (
              <motion.p className="mt-5 text-lg leading-relaxed max-w-2xl" style={{ color: colors.muted }}
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                {about.bio}
              </motion.p>
            )}
            <motion.div className="mt-8 flex items-center gap-6"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={colors.muted} iconSize={22} />}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

/* # ─── EXPERIENCE — Alternating timeline with compact cards ─── */
function ExperienceSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "experience" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Experience" colors={colors} />
      <div className="relative">
        {/* # Center timeline line */}
        <div className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 rounded-full"
          style={{ background: `linear-gradient(180deg, ${colors.accent}, ${colors.accent}30, transparent)` }} />

        {section.entries.map((e, i) => {
          const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
          const isLeft = i % 2 === 0;
          return (
            <motion.div key={i}
              className={`relative grid grid-cols-[40px_1fr] md:grid-cols-[1fr_40px_1fr] gap-0 mb-5`}
              initial={{ opacity: 0, x: isLeft ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>

              {/* # Card — alternates sides on desktop */}
              <div className={`col-start-2 md:col-start-auto ${!isLeft ? "md:order-3" : ""}`}>
                <motion.div className="rounded-xl overflow-hidden relative"
                  style={{ backgroundColor: colors.cardBg, boxShadow: colors.shadow, border: `1px solid ${colors.border}` }}
                  whileHover={{ y: -3, boxShadow: colors.shadowHover }}>
                  <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: grad }} />
                  <div className="p-4 pl-4.5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                          style={{ background: grad }}>
                          {e.company?.charAt(0)?.toUpperCase() || "W"}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold truncate" style={{ color: colors.text }}>{e.title}</h3>
                          <p className="text-xs truncate" style={{ color: colors.muted }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                        </div>
                      </div>
                      {(e.startDate || e.endDate) && (
                        <span className="text-[10px] font-semibold shrink-0 px-2.5 py-1 rounded-full"
                          style={{ background: `${colors.accent}12`, color: colors.accent }}>
                          {e.startDate} — {e.endDate || "Now"}
                        </span>
                      )}
                    </div>
                    {e.description && (
                      <p className="text-xs leading-relaxed mb-2" style={{ color: colors.muted }}>{e.description}</p>
                    )}
                    {e.achievements.length > 0 && (
                      <ul className="space-y-1">
                        {e.achievements.map((a, j) => (
                          <li key={j} className="text-xs flex items-start gap-2" style={{ color: colors.text }}>
                            <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full" style={{ background: grad }} />
                            <span className="leading-relaxed">{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* # Timeline dot */}
              <div className={`col-start-1 md:col-start-auto ${!isLeft ? "md:order-2" : "md:order-2"} flex justify-center pt-4`}>
                <div className="w-3 h-3 rounded-full border-2 shrink-0"
                  style={{ borderColor: colors.accent, backgroundColor: colors.bg }} />
              </div>

              {/* # Empty spacer on opposite side */}
              <div className={`hidden md:block ${!isLeft ? "md:order-1" : "md:order-3"}`} />
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

/* # ─── EDUCATION — Cards with gradient top border strip ─── */
function EducationSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "education" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Education" colors={colors} />
      <div className="space-y-5">
        {section.entries.map((e, i) => (
          <motion.div key={i}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: colors.cardBg,
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
            }}
            whileHover={{ y: -3, boxShadow: colors.shadowHover, transition: { duration: 0.2 } }}
          >
            {/* # Gradient header strip at top of card */}
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}60, ${colors.accent}20)` }} />

            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  {/* # Degree name large and prominent */}
                  <h3 className="text-xl font-bold" style={{ color: colors.text }}>{e.degree}</h3>
                  {/* # School in accent color */}
                  <p className="text-sm font-semibold mt-1" style={{ color: colors.accent }}>
                    {e.school}{e.location ? ` · ${e.location}` : ""}
                  </p>
                </div>
                {/* # Year in a gradient badge */}
                {(e.startDate || e.endDate) && (
                  <span className="text-xs font-semibold shrink-0 px-4 py-1.5 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}15, ${colors.accent}08)`,
                      color: colors.accent,
                      border: `1px solid ${colors.accent}20`,
                    }}>
                    {e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}
                  </span>
                )}
              </div>
              {e.description && (
                <div className="mt-4 px-4 py-3 rounded-xl" style={{ backgroundColor: `${colors.accent}05` }}>
                  <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>{e.description}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

/* # ─── SKILLS — Unchanged premium card layout ─── */
function SkillsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "skills" || section.groups.length === 0) return null;
  const groups = autoCategorizeSkills(section.groups);
  return (
    <SectionWrapper className="py-28 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Skills" colors={colors} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((g, i) => (
          <motion.div key={i}
            className="rounded-2xl p-6"
            style={{ backgroundColor: colors.cardBg, boxShadow: colors.shadow, border: `1px solid ${colors.border}` }}
            whileHover={{ y: -3, boxShadow: colors.shadowHover, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.accent }} />
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.accent }}>{g.category}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.skills.map((s, j) => (
                <motion.span key={j}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: colors.accentSoft, color: colors.accent }}
                  whileHover={{ scale: 1.05 }}>
                  {s.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

/* # ─── PROJECTS — Featured first (full-width) + gradient-bordered cards ─── */
function ProjectsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "projects" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Projects" colors={colors} />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {/* # Featured first project — full-width, image + text side by side */}
        {section.entries.length > 0 && (() => {
          const p = section.entries[0];
          return (
            <motion.div variants={staggerItem} className="mb-8">
              <motion.div className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: colors.cardBg,
                  boxShadow: colors.shadow,
                  border: `1px solid ${colors.border}`,
                }}
                whileHover={{ y: -4, boxShadow: colors.shadowHover }}>
                <div className="flex flex-col lg:flex-row">
                  {p.imageUrl && (
                    <div className="lg:w-1/2 overflow-hidden relative group">
                      <Image src={p.imageUrl} alt={p.title}
                        className="w-full h-64 lg:h-full object-cover transition-transform duration-500 group-hover:scale-105" fill unoptimized />
                      {/* # Gradient overlay on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(135deg, ${colors.accent}30, transparent)` }} />
                    </div>
                  )}
                  <div className={`p-8 flex flex-col justify-center ${p.imageUrl ? "lg:w-1/2" : "w-full"}`}>
                    {/* # Featured label pill */}
                    <span className="inline-flex items-center self-start text-xs font-bold px-3 py-1 rounded-full mb-4 text-white"
                      style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)` }}>
                      Featured
                    </span>
                    <h3 className="text-2xl font-bold" style={{ color: colors.text }}>{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: colors.muted }}>{p.description}</p>
                    {/* # Tech stack as accent-colored pills */}
                    {p.techStack.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.techStack.map((t, j) => (
                          <span key={j} className="text-xs px-3 py-1 rounded-full font-semibold"
                            style={{
                              background: `linear-gradient(135deg, ${colors.accent}15, ${colors.accent}08)`,
                              color: colors.accent,
                              border: `1px solid ${colors.accent}20`,
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
                          className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:shadow-lg hover:shadow-blue-500/20"
                          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` }}>
                          Live Demo →
                        </a>
                      )}
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:opacity-80"
                          style={{ color: colors.accent, border: `1px solid ${colors.accent}30` }}>
                          Source Code
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
                <motion.div className="rounded-2xl overflow-hidden group relative"
                  style={{
                    backgroundColor: colors.cardBg,
                    boxShadow: colors.shadow,
                    border: `1px solid ${colors.border}`,
                  }}
                  whileHover={{ y: -4, boxShadow: colors.shadowHover }}>
                  {/* # Gradient top border on each card */}
                  <div className="h-1" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}40)` }} />
                  {p.imageUrl && (
                    <div className="overflow-hidden h-48 relative">
                      <Image src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" fill unoptimized />
                      {/* # Gradient overlay on image hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(to top, ${colors.accent}20, transparent)` }} />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: colors.muted }}>{p.description}</p>
                    {/* # Tech stack pills */}
                    {p.techStack.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.techStack.map((t, j) => (
                          <span key={j} className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                            style={{
                              background: `linear-gradient(135deg, ${colors.accent}12, ${colors.accent}06)`,
                              color: colors.accent,
                            }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-5 flex gap-3">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:shadow-md"
                          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)` }}>
                          Live Demo →
                        </a>
                      )}
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80"
                          style={{ color: colors.accent, border: `1px solid ${colors.accent}30` }}>
                          Source Code
                        </a>
                      )}
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
}

/* # ─── CERTIFICATIONS — Shield/badge-style cards with gradient fills ─── */
function CertificationsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "certifications" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Certifications" colors={colors} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {section.entries.map((c2, i) => (
          <motion.div key={i}
            className="rounded-2xl overflow-hidden relative"
            style={{
              backgroundColor: colors.cardBg,
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
            }}
            whileHover={{ y: -3, boxShadow: colors.shadowHover, transition: { duration: 0.2 } }}
          >
            {/* # Subtle gradient fill background */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ background: `linear-gradient(135deg, ${colors.accent}, transparent)` }} />

            <div className="relative p-6 flex items-center gap-4">
              {/* # Shield-style badge icon with gradient and glow */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)`,
                  boxShadow: `0 4px 15px ${colors.accent}30`,
                }}>
                {/* # Checkmark with glow effect */}
                <span className="text-lg text-white font-bold" style={{ textShadow: "0 0 8px rgba(255,255,255,0.5)" }}>
                  ✓
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm" style={{ color: colors.text }}>
                  {c2.link ? (
                    <a href={c2.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{c2.name}</a>
                  ) : c2.name}
                </h3>
                {/* # Issuer and date as separate pill elements */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${colors.accent}10`, color: colors.accent }}>
                    {c2.issuer}
                  </span>
                  {c2.date && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${colors.accent}08`, color: colors.muted }}>
                      {c2.date}
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
}

/* # ─── PUBLICATIONS — Numbered citation cards with gradient accent border ─── */
function PublicationsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "publications" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Publications" colors={colors} />
      <div className="space-y-5">
        {section.entries.map((p, i) => (
          <motion.div key={i}
            className="rounded-2xl overflow-hidden relative"
            style={{
              backgroundColor: colors.cardBg,
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
            }}
            whileHover={{ y: -3, boxShadow: colors.shadowHover, transition: { duration: 0.2 } }}
          >
            {/* # Gradient accent left border */}
            <div className="absolute left-0 top-0 bottom-0 w-1"
              style={{ background: `linear-gradient(180deg, ${colors.accent}, ${colors.accent}40)` }} />

            <div className="relative p-6 pl-7 flex items-start gap-4">
              {/* # Large colored number badge */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-md"
                style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}bb)` }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-bold leading-snug" style={{ color: colors.text }}>
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.title}</a>
                  ) : p.title}
                </h3>
                {/* # Venue in a colored tag/pill */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {p.venue && (
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${colors.accent}12, ${colors.accent}06)`,
                        color: colors.accent,
                        border: `1px solid ${colors.accent}15`,
                      }}>
                      {p.venue}
                    </span>
                  )}
                  {p.date && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${colors.accent}08`, color: colors.muted }}>
                      {p.date}
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
}

/* # ─── AWARDS — Cards with amber/gold gradient accent ─── */
function AwardsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "awards" || section.entries.length === 0) return null;
  /* # Award-specific amber accent */
  const amber = "#f59e0b";
  const amberSoft = "#f59e0b15";
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Awards" colors={colors} />
      <div className="space-y-5">
        {section.entries.map((a, i) => (
          <motion.div key={i}
            className="rounded-2xl overflow-hidden relative"
            style={{
              backgroundColor: colors.cardBg,
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
            }}
            whileHover={{ y: -3, boxShadow: colors.shadowHover, transition: { duration: 0.2 } }}
          >
            {/* # Amber/gold gradient accent left border */}
            <div className="absolute left-0 top-0 bottom-0 w-1"
              style={{ background: `linear-gradient(180deg, ${amber}, #d97706)` }} />

            {/* # Subtle gold gradient fill */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ background: `linear-gradient(135deg, ${amber}, transparent 50%)` }} />

            <div className="relative p-6 pl-7">
              <div className="flex items-start gap-4">
                {/* # Award trophy badge */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${amber}, #d97706)` }}>
                  <span className="text-white text-lg">★</span>
                </div>
                <div className="flex-1">
                  {/* # Award title prominent */}
                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>{a.title}</h3>
                  {/* # Issuer as colored subtitle */}
                  <p className="text-sm font-semibold mt-0.5" style={{ color: amber }}>
                    {a.issuer}{a.date ? ` · ${a.date}` : ""}
                  </p>
                </div>
              </div>
              {/* # Description in a tinted box */}
              {a.description && (
                <div className="mt-4 px-4 py-3 rounded-xl" style={{ backgroundColor: amberSoft }}>
                  <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>{a.description}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

/* # ─── GALLERY — Bento grid with varying sizes, video support, hover zoom ─── */
function GallerySection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "gallery" || section.entries.length === 0) return null;

  /* # Bento layout pattern — assigns grid span classes based on position */
  const bentoLayout = (i: number, total: number): string => {
    if (total <= 2) return i === 0 ? "md:col-span-2 md:row-span-2 aspect-[16/10]" : "md:col-span-2 aspect-[21/9]";
    if (total <= 4) {
      return ["md:col-span-2 md:row-span-2 aspect-[4/3]", "aspect-square", "aspect-[4/5]", "md:col-span-2 aspect-[21/9]"][i] || "aspect-square";
    }
    const pattern = [
      "md:col-span-2 md:row-span-2 aspect-[4/3]",
      "aspect-square",
      "md:row-span-2 aspect-[3/5]",
      "aspect-[4/3]",
      "aspect-square",
      "md:col-span-2 aspect-[21/9]",
    ];
    return pattern[i % pattern.length];
  };

  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Gallery" colors={colors} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[200px] gap-4">
        {section.entries.map((g, i) => {
          const isVideo = Boolean(g.videoUrl && g.videoUrl.trim().length > 0);
          return (
            <motion.a key={i} href={g.link || g.videoUrl || g.imageUrl} target="_blank" rel="noopener noreferrer"
              className={`group relative rounded-2xl overflow-hidden ${bentoLayout(i, section.entries.length)}`}
              style={{ boxShadow: colors.shadow, border: `1px solid ${colors.border}` }}
              whileHover={{ y: -4, boxShadow: colors.shadowHover }}>
              <Image src={g.imageUrl} alt={g.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" fill unoptimized />

              {/* # Video play button overlay */}
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${colors.accent}cc`, boxShadow: `0 0 30px ${colors.accent}40` }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
                  </div>
                </div>
              )}

              {/* # Featured badge on first item */}
              {i === 0 && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                  style={{ backgroundColor: `${colors.accent}25`, border: `1px solid ${colors.accent}30`, color: colors.accent }}>
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
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5"
                style={{ background: `linear-gradient(to top, ${colors.accent}cc, ${colors.accent}40 40%, transparent 70%)` }}>
                <div>
                  <h3 className="text-white font-bold text-sm">{g.title}</h3>
                  {g.description && <p className="text-white/70 text-xs mt-1">{g.description}</p>}
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

/* # ─── TESTIMONIALS — Frosted cards with decorative gradient quote marks ─── */
function TestimonialsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "testimonials" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Testimonials" colors={colors} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.entries.map((t, i) => (
          <motion.div key={i}
            className="rounded-2xl overflow-hidden relative"
            style={{
              backgroundColor: colors.cardBg,
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
            }}
            whileHover={{ y: -3, boxShadow: colors.shadowHover, transition: { duration: 0.2 } }}
          >
            {/* # Gradient border at top */}
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}40, transparent)` }} />

            {/* # Frosted/tinted background */}
            <div className="absolute inset-0 opacity-[0.02]"
              style={{ background: `linear-gradient(135deg, ${colors.accent}, transparent)` }} />

            <div className="relative p-6">
              {/* # Large decorative gradient quote marks */}
              <div className="text-6xl font-bold leading-none mb-3"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}40)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  opacity: 0.3,
                }}>
                {"“"}
              </div>

              {/* # Quote text in tinted card area */}
              <div className="px-3 py-3 rounded-xl mb-5" style={{ backgroundColor: `${colors.accent}04` }}>
                <p className="text-sm leading-relaxed italic" style={{ color: colors.text }}>{t.quote}</p>
              </div>

              {/* # Author with colored avatar circle and accent separator */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: `2px solid ${colors.accent}15` }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}bb)`,
                    boxShadow: `0 3px 10px ${colors.accent}30`,
                  }}>
                  {t.author.charAt(0)}
                </div>
                {/* # Accent separator line */}
                <div className="w-0.5 h-8 rounded-full" style={{ backgroundColor: `${colors.accent}20` }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: colors.text }}>{t.author}</p>
                  <p className="text-xs" style={{ color: colors.accent }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

/* # ─── CONTACT — Full-width gradient CTA section with styled cards ─── */
function ContactSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "contact") return null;
  const hasContent = section.email || section.phone || section.location || section.calendarLink;
  if (!hasContent) return null;
  return (
    <SectionWrapper className="py-0">
      {/* # Full-width light blue gradient background */}
      <div className="py-20 px-6 md:px-12"
        style={{ background: `linear-gradient(135deg, ${colors.accent}08, ${colors.accent}15, ${colors.accent}05)` }}>
        <div className="max-w-5xl mx-auto">
          {/* # Large heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: colors.text }}>
              Let&apos;s Connect
            </h2>
            <p className="text-base mt-3" style={{ color: colors.muted }}>
              Ready to start a conversation? Reach out through any of these channels.
            </p>
            <motion.div className="mt-4 h-0.5 w-16 mx-auto rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }}
              initial={{ width: 0 }} whileInView={{ width: 64 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }} />
          </div>

          {/* # Contact items in styled cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {section.email && (
              <motion.a href={`mailto:${section.email}`}
                className="flex items-center gap-4 p-5 rounded-2xl group"
                style={{
                  backgroundColor: colors.cardBg,
                  boxShadow: colors.shadow,
                  border: `1px solid ${colors.accent}10`,
                }}
                whileHover={{ y: -2, boxShadow: `0 8px 25px ${colors.accent}15` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-shadow group-hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)` }}>
                  <span className="text-lg text-white">✉</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>Email</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: colors.text }}>{section.email}</p>
                </div>
              </motion.a>
            )}
            {section.phone && (
              <motion.a href={`tel:${section.phone}`}
                className="flex items-center gap-4 p-5 rounded-2xl group"
                style={{
                  backgroundColor: colors.cardBg,
                  boxShadow: colors.shadow,
                  border: `1px solid ${colors.accent}10`,
                }}
                whileHover={{ y: -2, boxShadow: `0 8px 25px ${colors.accent}15` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${colors.accent}dd, ${colors.accent}99)` }}>
                  <span className="text-lg text-white">☎</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>Phone</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: colors.text }}>{section.phone}</p>
                </div>
              </motion.a>
            )}
            {section.location && (
              <motion.div
                className="flex items-center gap-4 p-5 rounded-2xl"
                style={{
                  backgroundColor: colors.cardBg,
                  boxShadow: colors.shadow,
                  border: `1px solid ${colors.accent}10`,
                }}
                whileHover={{ y: -2, boxShadow: `0 8px 25px ${colors.accent}15` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${colors.accent}bb, ${colors.accent}88)` }}>
                  <span className="text-lg text-white">⌘</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>Location</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: colors.text }}>{section.location}</p>
                </div>
              </motion.div>
            )}
            {section.calendarLink && (
              <motion.a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl group"
                style={{
                  backgroundColor: colors.cardBg,
                  boxShadow: colors.shadow,
                  border: `1px solid ${colors.accent}10`,
                }}
                whileHover={{ y: -2, boxShadow: `0 8px 25px ${colors.accent}15` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}aa)` }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>Schedule</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: colors.accent }}>Book a meeting →</p>
                </div>
              </motion.a>
            )}
          </div>

          {/* # Prominent gradient CTA button */}
          {section.email && (
            <div className="text-center mb-8">
              <a href={`mailto:${section.email}`}
                className="inline-flex items-center px-8 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)`,
                  boxShadow: `0 4px 15px ${colors.accent}30`,
                }}>
                Get In Touch →
              </a>
            </div>
          )}

          {/* # Social links with colored hover */}
          {section.socialLinks && Object.keys(section.socialLinks).length > 0 && (
            <div className="text-center pt-6" style={{ borderTop: `1px solid ${colors.accent}15` }}>
              <SocialIcons links={section.socialLinks} color={colors.accent} />
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

const SECTION_RENDERERS: Record<string, React.ComponentType<{ section: PortfolioSection; colors: typeof defaultColors }>> = {
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
  publications: PublicationsSection,
  awards: AwardsSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
};

export default function MinimalTemplate({ data }: { data: PortfolioData }) {
  const colors = getColors(data);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* # Subtle noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <Hero data={data} colors={colors} />

      <StatsBar data={data} variant="minimal" colors={{
        bg: colors.bg, text: colors.text, accent: colors.accent, muted: colors.muted, border: colors.border,
      }} />

      <SectionDivider variant="gradient" color={colors.accent} />

      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => {
          const Renderer = SECTION_RENDERERS[section.type];
          if (!Renderer) return null;
          return (
            <div key={`${section.type}-${i}`}>
              {i > 0 && <SectionDivider variant="gradient" color={colors.accent} />}
              <Renderer section={section} colors={colors} />
            </div>
          );
        })}

      <footer className="py-16 text-center" style={{ borderTop: `1px solid ${colors.border}` }}>
        <p className="text-xs" style={{ color: colors.muted }}>
          Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: colors.accent }}>JobPilot AI</a>
        </p>
      </footer>
    </div>
  );
}
