"use client";

/* # Developer Template — IDE/terminal theme with neon green, cyan, purple accents on dark backgrounds */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { autoCategorizeSkills } from "@/lib/skill-categories";

/* # Color palette — dark IDE/terminal aesthetic with neon accents */
const c = {
  bg: "#050510",
  bgAlt: "#0a0a1f",
  surface: "#0d0d22",
  card: "rgba(15, 15, 35, 0.8)",
  text: "#e4e4f0",
  muted: "#8888a8",
  green: "#00ff88",
  cyan: "#22d3ee",
  purple: "#a855f7",
  amber: "#f59e0b",
  pink: "#ec4899",
  border: "rgba(0, 255, 136, 0.12)",
  glow: "0 0 30px rgba(0, 255, 136, 0.15)",
};

/* # Rotating accent colors for skill groups and entry differentiation */
const SKILL_COLORS = [
  { bg: "rgba(0, 255, 136, 0.06)", border: "rgba(0, 255, 136, 0.2)", text: "#00ff88", glow: "rgba(0,255,136,0.15)" },
  { bg: "rgba(34, 211, 238, 0.06)", border: "rgba(34, 211, 238, 0.2)", text: "#22d3ee", glow: "rgba(34,211,238,0.15)" },
  { bg: "rgba(168, 85, 247, 0.06)", border: "rgba(168, 85, 247, 0.2)", text: "#a855f7", glow: "rgba(168,85,247,0.15)" },
  { bg: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.2)", text: "#f59e0b", glow: "rgba(245,158,11,0.15)" },
  { bg: "rgba(236, 72, 153, 0.06)", border: "rgba(236, 72, 153, 0.2)", text: "#ec4899", glow: "rgba(236,72,153,0.15)" },
];

/* # Gradient left-border accent colors for experience entries */
const ENTRY_GRADIENTS = [
  { from: "#00ff88", to: "#22d3ee" },
  { from: "#a855f7", to: "#ec4899" },
  { from: "#22d3ee", to: "#6366f1" },
  { from: "#f59e0b", to: "#ef4444" },
  { from: "#ec4899", to: "#a855f7" },
];

/* # Blinking terminal cursor component */
function Cursor() {
  return (
    <motion.span
      className="inline-block w-2.5 h-5 ml-1 align-middle rounded-sm"
      style={{ backgroundColor: c.green, boxShadow: `0 0 8px ${c.green}` }}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" as const }}
    />
  );
}

/* # Reusable glass card with gradient border and hover lift */
function GlassCard({ children, className = "", hover = true, span = "" }: {
  children: React.ReactNode; className?: string; hover?: boolean; span?: string;
}) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${span} ${className}`}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
      {/* # Gradient border using nested div technique */}
      <div className="absolute inset-0 rounded-2xl p-px" style={{
        background: `linear-gradient(135deg, ${c.green}30, transparent 40%, ${c.cyan}20 60%, transparent 80%, ${c.purple}30)`,
      }}>
        <div className="w-full h-full rounded-2xl" style={{ backgroundColor: c.surface }} />
      </div>
      <div className="relative z-10 p-6" style={{ backdropFilter: "blur(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

/* # Terminal window chrome with traffic light dots and optional tabs */
function TerminalWindow({ children, title = "terminal", tabs }: { children: React.ReactNode; title?: string; tabs?: string[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: c.glow }}>
      {/* # macOS-style window controls */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#febc2e" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28c840" }} />
        {tabs ? (
          <div className="ml-3 flex gap-0.5">
            {tabs.map((tab, i) => (
              <span key={i} className="px-3 py-1 text-[11px] font-mono rounded-t-md" style={{
                backgroundColor: i === 0 ? c.bg : "transparent",
                color: i === 0 ? c.green : c.muted,
                borderTop: i === 0 ? `1px solid ${c.border}` : undefined,
                borderLeft: i === 0 ? `1px solid ${c.border}` : undefined,
                borderRight: i === 0 ? `1px solid ${c.border}` : undefined,
              }}>{tab}</span>
            ))}
          </div>
        ) : (
          <span className="ml-2 text-xs font-mono" style={{ color: c.muted }}>{title}</span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/* # Hero section — full-screen intro with code aesthetics */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative min-h-screen flex items-center px-6 md:px-16 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      {/* # Animated grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(${c.green}40 1px, transparent 1px), linear-gradient(90deg, ${c.green}40 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      {/* # Floating glow orbs */}
      <motion.div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[200px]"
        style={{ background: `radial-gradient(circle, ${c.green}12, transparent)` }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/3 left-[10%] w-[400px] h-[400px] rounded-full blur-[180px]"
        style={{ background: `radial-gradient(circle, ${c.purple}08, transparent)` }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />

      {/* # Decorative code block — top right */}
      <div className="absolute top-16 right-12 opacity-[0.05] text-[11px] font-mono leading-loose hidden xl:block select-none whitespace-pre" style={{ color: c.green }}>
{`class Portfolio {
  constructor() {
    this.skills = [...]
    this.projects = [...]
    this.passion = Infinity
  }

  async render() {
    return <Amazing />
  }
}`}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16">
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" as const, bounce: 0.3 }}>
              <div className="absolute -inset-2 rounded-3xl opacity-50" style={{
                background: `linear-gradient(135deg, ${c.green}, ${c.cyan}, ${c.purple})`,
                filter: "blur(12px)",
              }} />
              <img src={avatarUrl} alt={data.userName}
                className="relative w-40 h-40 rounded-3xl object-cover" style={{ boxShadow: `0 0 0 2px ${c.green}40` }} />
            </motion.div>
          )}
          <div>
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono mb-8"
              style={{ backgroundColor: `${c.green}08`, border: `1px solid ${c.green}20`, color: c.green }}
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: c.green, boxShadow: `0 0 6px ${c.green}` }} />
              {data.tagline || "Available for opportunities"}
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
              style={{ color: c.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
              {data.title || data.userName}
            </motion.h1>

            <motion.div className="mt-8 font-mono text-base flex items-center gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <span style={{ color: c.cyan }}>$</span>
              <span style={{ color: c.muted }}>npx</span>
              <span style={{ color: c.green }}>view-portfolio</span>
              <span style={{ color: c.muted }}>--format=awesome</span>
              <Cursor />
            </motion.div>

            {about && "bio" in about && about.bio && (
              <motion.p className="mt-10 text-lg leading-relaxed max-w-2xl" style={{ color: c.muted }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                {about.bio}
              </motion.p>
            )}

            <motion.div className="mt-10 flex items-center gap-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.green} iconSize={22} />}
            </motion.div>
          </div>
        </div>

        <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <div className="w-5 h-9 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: `${c.green}30` }}>
            <motion.div className="w-1 h-2.5 rounded-full" style={{ backgroundColor: c.green }}
              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}

/* # Section header with tag number and gradient line */
function SectionHeader({ title, tag }: { title: string; tag: string }) {
  return (
    <div className="mb-12 flex items-center gap-4">
      <span className="text-xs font-mono px-3 py-1.5 rounded-full" style={{
        backgroundColor: `${c.green}08`, color: c.green, border: `1px solid ${c.green}18`
      }}>{tag}</span>
      <h2 className="text-4xl font-bold tracking-tight" style={{ color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>
        {title}
      </h2>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${c.green}15, transparent)` }} />
    </div>
  );
}

/* # Section background wrapper for alternating dark shades */
function SectionBg({ children, alt = false, className = "" }: { children: React.ReactNode; alt?: boolean; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ backgroundColor: alt ? c.bgAlt : c.bg }}>
      {alt && (
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(${c.green}40 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }} />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/* # Main section renderer — handles all portfolio section types */
function renderSection(section: PortfolioSection, index: number) {
  const isAlt = index % 2 === 1;
  const tag = String(index + 1).padStart(2, "0");

  switch (section.type) {
    /* # Skills section — terminal window cards with colored skill pills */
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Tech Stack" tag={tag} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {groups.map((g, gi) => {
                const colorSet = SKILL_COLORS[gi % SKILL_COLORS.length];
                const isLarge = gi === 0 && groups.length > 2;
                return (
                  <motion.div key={gi} className={isLarge ? "md:col-span-2" : ""}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: gi * 0.1 }}>
                    <TerminalWindow tabs={[g.category]}>
                      <div className="flex flex-wrap gap-2">
                        {g.skills.map((s, si) => (
                          <motion.span
                            key={si}
                            className="px-3 py-1.5 rounded-lg text-sm font-mono inline-flex items-center gap-2"
                            style={{
                              backgroundColor: colorSet.bg,
                              border: `1px solid ${colorSet.border}`,
                              color: colorSet.text,
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: si * 0.02 }}
                            whileHover={{ scale: 1.08, boxShadow: `0 0 20px ${colorSet.glow}` }}
                          >
                            {s.name}
                          </motion.span>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 flex items-center gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorSet.text }} />
                        <span className="text-[11px] font-mono" style={{ color: c.muted }}>{g.skills.length} skills</span>
                      </div>
                    </TerminalWindow>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );
    }

    /* # Experience section — gradient-bordered cards with prominent company badges */
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Experience" tag={tag} />
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-6">
              {section.entries.map((e, i) => {
                /* # Each entry gets a unique gradient accent from the palette */
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                const accentColor = SKILL_COLORS[i % SKILL_COLORS.length].text;
                return (
                  <motion.div key={i} variants={staggerItem}>
                    <motion.div
                      className="relative rounded-2xl overflow-hidden"
                      whileHover={{ y: -6, boxShadow: `0 20px 60px ${grad.from}15`, transition: { duration: 0.25 } }}
                    >
                      {/* # Gradient left border accent — unique color per entry */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{
                        background: `linear-gradient(180deg, ${grad.from}, ${grad.to})`,
                        boxShadow: `0 0 20px ${grad.from}30`,
                      }} />
                      {/* # Outer gradient border */}
                      <div className="absolute inset-0 rounded-2xl p-px" style={{
                        background: `linear-gradient(135deg, ${grad.from}25, transparent 40%, ${grad.to}15 70%, transparent)`,
                      }}>
                        <div className="w-full h-full rounded-2xl" style={{ backgroundColor: c.surface }} />
                      </div>
                      {/* # Subtle gradient background wash */}
                      <div className="absolute inset-0 rounded-2xl opacity-[0.03]" style={{
                        background: `linear-gradient(135deg, ${grad.from}, transparent 60%)`,
                      }} />
                      <div className="relative z-10 p-7 pl-8">
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          {/* # Large company initial badge with gradient background */}
                          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 text-3xl font-black font-mono"
                            style={{
                              background: `linear-gradient(135deg, ${grad.from}20, ${grad.to}15)`,
                              color: grad.from,
                              border: `1px solid ${grad.from}25`,
                              boxShadow: `0 0 30px ${grad.from}10`,
                            }}>
                            {e.company?.charAt(0) || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                              <div>
                                {/* # Job title — large and prominent */}
                                <h3 className="text-2xl font-bold font-mono" style={{ color: c.text }}>{e.title}</h3>
                                {/* # Company name as a gradient badge */}
                                <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-lg"
                                  style={{
                                    background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}08)`,
                                    border: `1px solid ${grad.from}18`,
                                  }}>
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: grad.from, boxShadow: `0 0 6px ${grad.from}` }} />
                                  <span className="text-sm font-semibold" style={{ color: grad.from }}>{e.company}</span>
                                </div>
                                {e.location && (
                                  <p className="text-xs mt-2 font-mono flex items-center gap-1.5" style={{ color: c.muted }}>
                                    <span style={{ color: accentColor }}>@</span> {e.location}
                                  </p>
                                )}
                              </div>
                              {/* # Date range in a colored pill badge */}
                              <span className="text-xs font-mono px-5 py-2.5 rounded-xl shrink-0 font-semibold"
                                style={{
                                  background: `linear-gradient(135deg, ${grad.from}10, ${grad.to}08)`,
                                  border: `1px solid ${grad.from}20`,
                                  color: grad.from,
                                  boxShadow: `0 0 15px ${grad.from}08`,
                                }}>
                                {e.startDate} → {e.endDate || "Present"}
                              </span>
                            </div>
                            {e.description && (
                              <div className="mt-5 p-4 rounded-xl" style={{
                                background: `linear-gradient(135deg, ${grad.from}04, ${grad.to}03)`,
                                border: `1px solid ${c.border}`,
                              }}>
                                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{e.description}</p>
                              </div>
                            )}
                            {/* # Achievements as styled rows with colored accent markers */}
                            {e.achievements.length > 0 && (
                              <div className="mt-5 space-y-2">
                                {e.achievements.map((a, j) => (
                                  <div key={j} className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                                    style={{ background: j % 2 === 0 ? `${grad.from}03` : "transparent" }}>
                                    {/* # Colored chevron icon with glow */}
                                    <span className="shrink-0 mt-0.5 text-sm font-mono font-bold" style={{
                                      color: grad.from,
                                      textShadow: `0 0 10px ${grad.from}40`,
                                    }}>{">"}</span>
                                    <span className="text-sm leading-relaxed" style={{ color: c.muted, fontFamily: "'Inter', system-ui, sans-serif" }}>{a}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </SectionWrapper>
        </SectionBg>
      );

    /* # Projects section — featured first project + grid of remaining */
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Projects" tag={tag} />
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {/* # Featured first project — full-width showcase */}
              {section.entries.length > 0 && (
                <motion.div variants={staggerItem} className="mb-8">
                  <FeaturedProject project={section.entries[0]} />
                </motion.div>
              )}
              {/* # Remaining projects in a two-column grid */}
              {section.entries.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.entries.slice(1).map((p, i) => (
                    <motion.div key={i} variants={staggerItem}>
                      <ProjectCard project={p} index={i + 1} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </SectionWrapper>
        </SectionBg>
      );

    /* # Education section — gradient header bars with visual year badges */
    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Education" tag={tag} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((e, i) => {
                /* # Each education entry gets a unique gradient header */
                const gradients = [
                  { from: c.cyan, to: c.purple },
                  { from: c.green, to: c.cyan },
                  { from: c.purple, to: c.pink },
                  { from: c.amber, to: c.green },
                ];
                const grad = gradients[i % gradients.length];
                return (
                  <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -6, boxShadow: `0 20px 50px ${grad.from}12`, transition: { duration: 0.25 } }}
                  >
                    {/* # Gradient border shell */}
                    <div className="absolute inset-0 rounded-2xl p-px" style={{
                      background: `linear-gradient(180deg, ${grad.from}40, ${grad.to}20, transparent 60%)`,
                    }}>
                      <div className="w-full h-full rounded-2xl" style={{ backgroundColor: c.surface }} />
                    </div>
                    <div className="relative z-10">
                      {/* # Gradient header bar */}
                      <div className="px-7 pt-5 pb-4" style={{
                        background: `linear-gradient(135deg, ${grad.from}10, ${grad.to}06)`,
                        borderBottom: `1px solid ${grad.from}15`,
                      }}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* # Degree name — large bold font */}
                            <h3 className="text-xl font-bold font-mono truncate" style={{ color: c.text }}>{e.degree}</h3>
                            {/* # School name in accent color */}
                            <p className="text-sm font-semibold mt-1" style={{ color: grad.from }}>{e.school}</p>
                          </div>
                          {/* # Visual year badge with gradient background */}
                          {e.endDate && (
                            <div className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${grad.from}18, ${grad.to}12)`,
                                border: `1px solid ${grad.from}25`,
                                boxShadow: `0 0 20px ${grad.from}10`,
                              }}>
                              <span className="text-lg font-black font-mono leading-none" style={{ color: grad.from }}>
                                {e.endDate.slice(-2)}
                              </span>
                              <span className="text-[9px] font-mono uppercase mt-0.5" style={{ color: c.muted }}>year</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* # Body content */}
                      <div className="px-7 py-5">
                        {e.startDate && (
                          <p className="text-xs font-mono mb-3 flex items-center gap-2" style={{ color: c.muted }}>
                            <span style={{ color: grad.from }}>$</span> {e.startDate} — {e.endDate}
                          </p>
                        )}
                        {e.description && (
                          <div className="p-3 rounded-lg" style={{ background: `${grad.from}04`, border: `1px solid ${c.border}` }}>
                            <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{e.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    /* # Certifications section — shield-style badge cards with glowing checkmarks */
    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Certifications" tag={tag} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((cert, i) => {
                const accents = [c.green, c.cyan, c.purple, c.amber, c.pink];
                const accent = accents[i % accents.length];
                return (
                  <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -5, boxShadow: `0 16px 40px ${accent}12`, transition: { duration: 0.2 } }}
                  >
                    {/* # Gradient fill background for badge/shield style */}
                    <div className="absolute inset-0 rounded-2xl" style={{
                      background: `linear-gradient(135deg, ${accent}08, transparent 60%, ${accent}04)`,
                      border: `1px solid ${accent}15`,
                    }} />
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{
                      background: `linear-gradient(90deg, ${accent}, ${accent}60)`,
                    }} />
                    <div className="relative z-10 p-6">
                      <div className="flex items-start gap-4">
                        {/* # Verification checkmark with glowing accent */}
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold"
                          style={{
                            background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
                            border: `1px solid ${accent}25`,
                            color: accent,
                            boxShadow: `0 0 25px ${accent}15, inset 0 0 15px ${accent}05`,
                          }}>
                          ✓
                        </div>
                        <div className="min-w-0">
                          {/* # Certificate name */}
                          <h3 className="font-bold text-lg font-mono" style={{ color: c.text }}>{cert.name}</h3>
                          {/* # Issuer as separate styled element */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs font-mono px-3 py-1 rounded-lg" style={{
                              background: `${accent}10`, color: accent, border: `1px solid ${accent}15`,
                            }}>{cert.issuer}</span>
                            {/* # Date as separate visual badge */}
                            {cert.date && (
                              <span className="text-xs font-mono px-2.5 py-1 rounded-lg" style={{
                                background: `${c.border}`, color: c.muted,
                              }}>{cert.date}</span>
                            )}
                          </div>
                          {cert.link && (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-mono mt-3 inline-flex items-center gap-1 hover:underline"
                              style={{ color: accent }}>
                              verify →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    /* # Publications section — numbered citation cards with gradient accents */
    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Publications" tag={tag} />
            <div className="space-y-5">
              {section.entries.map((pub, i) => {
                const accents = [c.cyan, c.purple, c.green, c.pink, c.amber];
                const accent = accents[i % accents.length];
                return (
                  <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -4, boxShadow: `0 16px 40px ${accent}10`, transition: { duration: 0.2 } }}
                  >
                    {/* # Gradient left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{
                      background: `linear-gradient(180deg, ${accent}, ${accent}40)`,
                      boxShadow: `0 0 15px ${accent}20`,
                    }} />
                    <div className="absolute inset-0 rounded-2xl" style={{
                      backgroundColor: c.surface,
                      border: `1px solid ${accent}12`,
                    }} />
                    <div className="relative z-10 p-6 pl-8 flex items-start gap-5">
                      {/* # Colored number badge */}
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black font-mono"
                        style={{
                          background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
                          color: accent,
                          border: `1px solid ${accent}20`,
                        }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg font-mono" style={{ color: c.text }}>{pub.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {/* # Venue name as a colored tag/pill */}
                          {pub.venue && (
                            <span className="text-xs font-mono px-3 py-1.5 rounded-lg" style={{
                              background: `${accent}12`, color: accent, border: `1px solid ${accent}18`,
                            }}>{pub.venue}</span>
                          )}
                          {pub.date && (
                            <span className="text-xs font-mono px-2.5 py-1 rounded-lg" style={{
                              background: `${c.border}`, color: c.muted,
                            }}>{pub.date}</span>
                          )}
                        </div>
                        {pub.link && (
                          <a href={pub.link} target="_blank" rel="noopener noreferrer"
                            className="text-sm mt-4 inline-flex items-center gap-1 font-mono hover:underline"
                            style={{ color: accent }}>
                            read →
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    /* # Awards section — trophy-style cards with amber/gold gradient accents */
    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Awards" tag={tag} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((a, i) => {
                /* # Alternating amber/gold gradients for trophy style */
                const goldGradients = [
                  { from: "#f59e0b", to: "#f97316" },
                  { from: "#fbbf24", to: "#f59e0b" },
                  { from: "#d97706", to: "#fbbf24" },
                ];
                const grad = goldGradients[i % goldGradients.length];
                return (
                  <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -6, boxShadow: `0 20px 50px ${grad.from}15`, transition: { duration: 0.25 } }}
                  >
                    {/* # Trophy gold top border */}
                    <div className="absolute top-0 left-0 right-0 h-1" style={{
                      background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                      boxShadow: `0 0 15px ${grad.from}30`,
                    }} />
                    <div className="absolute inset-0 rounded-2xl" style={{
                      backgroundColor: c.surface,
                      border: `1px solid ${grad.from}12`,
                    }} />
                    {/* # Subtle gold gradient wash */}
                    <div className="absolute inset-0 rounded-2xl opacity-[0.04]" style={{
                      background: `radial-gradient(ellipse at top left, ${grad.from}, transparent 60%)`,
                    }} />
                    <div className="relative z-10 p-7">
                      <div className="flex items-start gap-5">
                        {/* # Trophy icon with amber gradient background */}
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${grad.from}20, ${grad.to}12)`,
                            border: `1px solid ${grad.from}25`,
                            boxShadow: `0 0 25px ${grad.from}10`,
                          }}>
                          🏆
                        </div>
                        <div className="min-w-0 flex-1">
                          {/* # Award title — prominent */}
                          <h3 className="text-xl font-bold font-mono" style={{ color: c.text }}>{a.title}</h3>
                          {/* # Issuer as colored subtitle */}
                          <p className="text-sm font-semibold mt-1.5" style={{ color: grad.from }}>{a.issuer}</p>
                          {a.date && (
                            <span className="inline-block text-xs font-mono px-3 py-1 rounded-lg mt-2" style={{
                              background: `${grad.from}10`, color: grad.from, border: `1px solid ${grad.from}15`,
                            }}>{a.date}</span>
                          )}
                          {/* # Description in a subtle gradient box */}
                          {a.description && (
                            <div className="mt-4 p-4 rounded-xl" style={{
                              background: `linear-gradient(135deg, ${grad.from}06, ${grad.to}03)`,
                              border: `1px solid ${grad.from}10`,
                            }}>
                              <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{a.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    /* # Gallery section — bento grid with hover zoom and gradient overlay */
    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Gallery" tag={tag} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {section.entries.map((g, i) => (
                <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                  /* # First item is featured — spans two rows */
                  className={`group relative rounded-2xl overflow-hidden ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
                  style={{ border: `1px solid ${c.border}` }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}>
                  <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {/* # Gradient overlay on hover showing title */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(180deg, transparent 20%, ${c.bg}cc 70%, ${c.bg}ee)` }}>
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-white font-mono font-bold text-sm">{g.title}</h3>
                      {g.description && <p className="text-white/60 text-xs mt-1.5">{g.description}</p>}
                    </div>
                  </div>
                  {/* # Featured badge on first item */}
                  {i === 0 && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider"
                      style={{ backgroundColor: `${c.green}15`, border: `1px solid ${c.green}25`, color: c.green }}>
                      Featured
                    </div>
                  )}
                </motion.a>
              ))}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    /* # Testimonials section — glass/frosted cards with decorative gradient quote marks */
    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Testimonials" tag={tag} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((t, i) => {
                const accents = [
                  { from: c.green, to: c.cyan },
                  { from: c.purple, to: c.pink },
                  { from: c.cyan, to: c.purple },
                  { from: c.pink, to: c.amber },
                ];
                const grad = accents[i % accents.length];
                return (
                  <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -5, boxShadow: `0 16px 40px ${grad.from}10`, transition: { duration: 0.25 } }}
                  >
                    {/* # Gradient border for glass card effect */}
                    <div className="absolute inset-0 rounded-2xl p-px" style={{
                      background: `linear-gradient(135deg, ${grad.from}30, transparent 50%, ${grad.to}20)`,
                    }}>
                      <div className="w-full h-full rounded-2xl" style={{ backgroundColor: c.surface, backdropFilter: "blur(20px)" }} />
                    </div>
                    <div className="relative z-10 p-7">
                      {/* # Large decorative gradient quote mark */}
                      <div className="text-6xl font-serif leading-none mb-3" style={{
                        background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        opacity: 0.4,
                      }}>&ldquo;</div>
                      {/* # Quote text in a frosted inner card */}
                      <div className="p-4 rounded-xl mb-5" style={{
                        background: `linear-gradient(135deg, ${grad.from}05, ${grad.to}03)`,
                        border: `1px solid ${c.border}`,
                      }}>
                        <p className="text-base leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                      </div>
                      {/* # Author info with colored avatar badge and accent divider */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold font-mono"
                          style={{
                            background: `linear-gradient(135deg, ${grad.from}20, ${grad.to}15)`,
                            color: grad.from,
                            border: `1px solid ${grad.from}20`,
                          }}>
                          {t.author.charAt(0)}
                        </div>
                        {/* # Accent divider line */}
                        <div className="w-px h-8" style={{
                          background: `linear-gradient(180deg, ${grad.from}40, transparent)`,
                        }} />
                        <div>
                          <p className="font-semibold text-sm" style={{ color: c.text }}>{t.author}</p>
                          <p className="text-xs" style={{ color: grad.from }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    /* # Contact section — full-width gradient CTA with glass cards */
    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <div className="py-28 px-6 md:px-16">
            <SectionWrapper>
              <div className="max-w-6xl mx-auto">
                {/* # Full-width gradient background CTA section */}
                <div className="relative rounded-3xl overflow-hidden p-12 md:p-16" style={{
                  background: `linear-gradient(135deg, ${c.green}08, ${c.cyan}06, ${c.purple}08)`,
                  border: `1px solid ${c.green}15`,
                  boxShadow: `0 0 80px ${c.green}08`,
                }}>
                  {/* # Background decorative elements */}
                  <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-20"
                    style={{ background: `radial-gradient(circle, ${c.green}15, transparent)` }} />
                  <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-[120px] opacity-15"
                    style={{ background: `radial-gradient(circle, ${c.purple}15, transparent)` }} />
                  {/* # Dot grid pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(${c.green}60 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }} />

                  <div className="relative z-10">
                    {/* # Large heading text */}
                    <div className="text-center mb-12">
                      <h2 className="text-5xl md:text-6xl font-black font-mono" style={{ color: c.text }}>
                        Let&apos;s <span style={{
                          background: `linear-gradient(135deg, ${c.green}, ${c.cyan})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>Connect</span>
                      </h2>
                      <p className="mt-4 text-lg font-mono" style={{ color: c.muted }}>
                        Ready to build something amazing together?
                      </p>
                    </div>

                    {/* # Contact info in gradient glass cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
                      {section.email && (
                        <a href={`mailto:${section.email}`} className="group block">
                          <div className="relative rounded-xl overflow-hidden p-5 text-center transition-all group-hover:scale-105"
                            style={{
                              background: `linear-gradient(135deg, ${c.green}08, ${c.cyan}05)`,
                              border: `1px solid ${c.green}15`,
                              backdropFilter: "blur(10px)",
                            }}>
                            <div className="text-2xl mb-2">📧</div>
                            <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: c.green }}>Email</p>
                            <p className="text-sm font-mono truncate" style={{ color: c.text }}>{section.email}</p>
                          </div>
                        </a>
                      )}
                      {section.phone && (
                        <div className="relative rounded-xl overflow-hidden p-5 text-center"
                          style={{
                            background: `linear-gradient(135deg, ${c.cyan}08, ${c.purple}05)`,
                            border: `1px solid ${c.cyan}15`,
                            backdropFilter: "blur(10px)",
                          }}>
                          <div className="text-2xl mb-2">📱</div>
                          <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: c.cyan }}>Phone</p>
                          <p className="text-sm font-mono" style={{ color: c.text }}>{section.phone}</p>
                        </div>
                      )}
                      {section.location && (
                        <div className="relative rounded-xl overflow-hidden p-5 text-center"
                          style={{
                            background: `linear-gradient(135deg, ${c.purple}08, ${c.green}05)`,
                            border: `1px solid ${c.purple}15`,
                            backdropFilter: "blur(10px)",
                          }}>
                          <div className="text-2xl mb-2">📍</div>
                          <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: c.purple }}>Location</p>
                          <p className="text-sm font-mono" style={{ color: c.text }}>{section.location}</p>
                        </div>
                      )}
                    </div>

                    {/* # Prominent CTA buttons with gradient fills */}
                    <div className="flex flex-wrap justify-center gap-4">
                      {section.email && (
                        <a href={`mailto:${section.email}`}
                          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all font-bold font-mono hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${c.green}, ${c.cyan})`,
                            color: c.bg,
                            boxShadow: `0 4px 30px ${c.green}25`,
                          }}>
                          send_message() →
                        </a>
                      )}
                      {section.calendarLink && (
                        <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all font-bold font-mono hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${c.purple}, ${c.pink})`,
                            color: "#fff",
                            boxShadow: `0 4px 30px ${c.purple}25`,
                          }}>
                          schedule_meeting()
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SectionWrapper>
          </div>
        </SectionBg>
      );
    }

    default:
      return null;
  }
}

/* # Featured project component — full-width showcase with image side layout */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FeaturedProject({ project }: { project: any }) {
  const p = project;
  return (
    <motion.div className="relative rounded-2xl overflow-hidden group"
      style={{
        backgroundColor: c.surface,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 60px rgba(0, 255, 136, 0.06)`,
      }}
      whileHover={{ boxShadow: `0 0 80px rgba(0, 255, 136, 0.12)`, transition: { duration: 0.3 } }}
    >
      <div className="flex flex-col lg:flex-row">
        {p.imageUrl && (
          <div className="lg:w-1/2 relative overflow-hidden">
            <img src={p.imageUrl} alt={p.title}
              className="w-full h-72 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{
              background: `linear-gradient(90deg, transparent 50%, ${c.surface})`,
            }} />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider"
              style={{ backgroundColor: `${c.green}15`, border: `1px solid ${c.green}30`, color: c.green }}>
              Featured
            </div>
          </div>
        )}
        <div className={`p-10 flex flex-col justify-center ${p.imageUrl ? "lg:w-1/2" : "w-full"}`}>
          <h3 className="text-3xl font-bold font-mono mb-4" style={{ color: c.text }}>{p.title}</h3>
          <p className="text-base leading-relaxed mb-6" style={{ color: c.muted }}>{p.description}</p>
          {/* # Tech stack as colored gradient pills */}
          {p.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {p.techStack.map((t: string, j: number) => {
                const pillColors = [c.green, c.cyan, c.purple, c.amber, c.pink];
                const pillColor = pillColors[j % pillColors.length];
                return (
                  <span key={j} className="text-xs font-mono px-3 py-1.5 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${pillColor}10, ${pillColor}05)`,
                      color: pillColor,
                      border: `1px solid ${pillColor}20`,
                    }}>
                    {t}
                  </span>
                );
              })}
            </div>
          )}
          {/* # CTA buttons with gradient fills */}
          <div className="flex gap-4 font-mono text-sm">
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105 font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${c.green}, ${c.cyan})`,
                  color: c.bg,
                  boxShadow: `0 4px 20px ${c.green}20`,
                }}>
                Live Demo →
              </a>
            )}
            {p.repoUrl && (
              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:opacity-80"
                style={{ color: c.cyan, border: `1px solid ${c.cyan}25` }}>
                Source →
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* # Project card component — gradient-bordered with image header and tech pills */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProjectCard({ project, index }: { project: any; index: number }) {
  const p = project;
  const grad = ENTRY_GRADIENTS[index % ENTRY_GRADIENTS.length];
  return (
    <motion.div className="relative rounded-2xl overflow-hidden group h-full"
      style={{
        backgroundColor: c.surface,
        border: `1px solid ${c.border}`,
      }}
      whileHover={{ y: -5, boxShadow: `0 16px 40px ${grad.from}10`, transition: { duration: 0.25 } }}
    >
      {/* # Top gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{
        background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
      }} />
      <div className="absolute top-4 right-4 text-6xl font-black font-mono opacity-[0.03] select-none" style={{ color: grad.from }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      {/* # Image header with gradient overlay */}
      {p.imageUrl && (
        <div className="overflow-hidden h-44 relative">
          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${c.surface})` }} />
        </div>
      )}
      <div className="p-6 relative">
        <h3 className="text-lg font-bold font-mono" style={{ color: c.text }}>{p.title}</h3>
        <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.muted }}>{p.description}</p>
        {/* # Tech stack as colored pills */}
        {p.techStack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.techStack.slice(0, 4).map((t: string, j: number) => {
              const pillColors = [c.green, c.cyan, c.purple, c.amber];
              const pillColor = pillColors[j % pillColors.length];
              return (
                <span key={j} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md"
                  style={{ background: `${pillColor}08`, color: pillColor, border: `1px solid ${pillColor}15` }}>
                  {t}
                </span>
              );
            })}
            {p.techStack.length > 4 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md" style={{ color: c.muted }}>
                +{p.techStack.length - 4}
              </span>
            )}
          </div>
        )}
        {/* # CTA links with gradient accents */}
        <div className="mt-5 flex gap-3 font-mono text-xs">
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}08)`,
                color: grad.from,
                border: `1px solid ${grad.from}15`,
              }}>
              demo →
            </a>
          )}
          {p.repoUrl && (
            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline" style={{ color: c.cyan }}>
              repo →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* # Main template export */
export default function DeveloperTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* # Subtle scan line overlay for CRT terminal effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.012] z-50"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.03) 2px, rgba(0,255,136,0.03) 4px)" }} />

      <div className="relative z-10">
        <Hero data={data} />

        {/* # Stats bar after hero */}
        <div style={{ backgroundColor: c.bgAlt, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
          <div className="max-w-6xl mx-auto">
            <StatsBar data={data} variant="terminal" colors={{
              bg: "transparent", text: c.text, accent: c.green, muted: c.muted, border: c.border,
            }} />
          </div>
        </div>

        {visibleSections.map((section, i) => (
          <div key={`${section.type}-${i}`}>
            {renderSection(section, i)}
          </div>
        ))}

        {/* # Footer */}
        <div className="py-16 text-center" style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }}>
          <p className="text-xs font-mono" style={{ color: c.muted }}>
            <span style={{ color: c.green }}>{"// "}</span>
            Built with{" "}
            <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.green }}>JobPilot AI</a>
          </p>
        </div>
      </div>
    </div>
  );
}
