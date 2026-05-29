"use client";

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { autoCategorizeSkills } from "@/lib/skill-categories";

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

const SKILL_COLORS = [
  { bg: "rgba(0, 255, 136, 0.06)", border: "rgba(0, 255, 136, 0.2)", text: "#00ff88", glow: "rgba(0,255,136,0.15)" },
  { bg: "rgba(34, 211, 238, 0.06)", border: "rgba(34, 211, 238, 0.2)", text: "#22d3ee", glow: "rgba(34,211,238,0.15)" },
  { bg: "rgba(168, 85, 247, 0.06)", border: "rgba(168, 85, 247, 0.2)", text: "#a855f7", glow: "rgba(168,85,247,0.15)" },
  { bg: "rgba(245, 158, 11, 0.06)", border: "rgba(245, 158, 11, 0.2)", text: "#f59e0b", glow: "rgba(245,158,11,0.15)" },
  { bg: "rgba(236, 72, 153, 0.06)", border: "rgba(236, 72, 153, 0.2)", text: "#ec4899", glow: "rgba(236,72,153,0.15)" },
];

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

function GlassCard({ children, className = "", hover = true, span = "" }: {
  children: React.ReactNode; className?: string; hover?: boolean; span?: string;
}) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${span} ${className}`}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
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

function TerminalWindow({ children, title = "terminal", tabs }: { children: React.ReactNode; title?: string; tabs?: string[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: c.glow }}>
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

function renderSection(section: PortfolioSection, index: number) {
  const isAlt = index % 2 === 1;
  const tag = String(index + 1).padStart(2, "0");

  switch (section.type) {
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

    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Experience" tag={tag} />
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-6">
              {section.entries.map((e, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <GlassCard>
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* # Large company initial */}
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-bold font-mono"
                        style={{ background: `linear-gradient(135deg, ${c.green}15, ${c.cyan}10)`, color: c.green, border: `1px solid ${c.border}` }}>
                        {e.company?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                          <div>
                            <h3 className="text-xl font-bold font-mono" style={{ color: c.text }}>{e.title}</h3>
                            <p className="text-base font-medium mt-1" style={{ color: c.cyan }}>{e.company}</p>
                            {e.location && <p className="text-xs mt-1" style={{ color: c.muted }}>{e.location}</p>}
                          </div>
                          <span className="text-xs font-mono px-4 py-2 rounded-xl shrink-0"
                            style={{ backgroundColor: `${c.green}06`, border: `1px solid ${c.green}12`, color: c.green }}>
                            {e.startDate} → {e.endDate || "Present"}
                          </span>
                        </div>
                        {e.description && (
                          <p className="mt-4 text-sm leading-relaxed" style={{ color: c.muted }}>{e.description}</p>
                        )}
                        {e.achievements.length > 0 && (
                          <ul className="mt-5 space-y-3">
                            {e.achievements.map((a, j) => (
                              <li key={j} className="text-sm flex items-start gap-3 font-mono" style={{ color: c.muted }}>
                                <span className="shrink-0 mt-0.5" style={{ color: c.green }}>→</span>
                                <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{a}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </SectionWrapper>
        </SectionBg>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Projects" tag={tag} />
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {section.entries.length > 0 && (
                <motion.div variants={staggerItem} className="mb-8">
                  <FeaturedProject project={section.entries[0]} />
                </motion.div>
              )}
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

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Education" tag={tag} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((e, i) => (
                <GlassCard key={i}>
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-mono text-lg font-bold"
                      style={{ background: `linear-gradient(135deg, ${c.cyan}15, ${c.purple}15)`, color: c.cyan, border: `1px solid ${c.border}` }}>
                      {e.endDate?.slice(-2) || "??"}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: c.text }}>{e.degree}</h3>
                      <p className="text-sm mt-1" style={{ color: c.cyan }}>{e.school}</p>
                      {e.startDate && <p className="text-xs mt-1.5 font-mono" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                      {e.description && <p className="text-sm mt-3 leading-relaxed" style={{ color: c.muted }}>{e.description}</p>}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Certifications" tag={tag} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((cert, i) => (
                <GlassCard key={i}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-mono font-bold"
                      style={{ background: `linear-gradient(135deg, ${c.green}12, ${c.amber}10)`, color: c.green, border: `1px solid ${c.border}` }}>
                      ✓
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: c.text }}>{cert.name}</h3>
                      <p className="text-sm mt-1" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                      {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs font-mono mt-2 inline-block hover:underline" style={{ color: c.cyan }}>view →</a>}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Publications" tag={tag} />
            <div className="space-y-5">
              {section.entries.map((pub, i) => (
                <GlassCard key={i}>
                  <h3 className="font-bold text-lg" style={{ color: c.text }}>{pub.title}</h3>
                  <p className="text-sm mt-2" style={{ color: c.muted }}>{pub.venue}{pub.date ? ` · ${pub.date}` : ""}</p>
                  {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-3 inline-block font-mono hover:underline" style={{ color: c.cyan }}>read →</a>}
                </GlassCard>
              ))}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Awards" tag={tag} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((a, i) => (
                <GlassCard key={i}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg"
                      style={{ background: `linear-gradient(135deg, ${c.amber}12, ${c.green}10)`, border: `1px solid ${c.border}` }}>
                      🏆
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: c.text }}>{a.title}</h3>
                      <p className="text-sm mt-1" style={{ color: c.cyan }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                      {a.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{a.description}</p>}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Gallery" tag={tag} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {section.entries.map((g, i) => (
                <a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                  className={`group relative rounded-2xl overflow-hidden ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
                  style={{ border: `1px solid ${c.border}` }}>
                  <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(180deg, transparent 30%, ${c.bg}ee)` }}>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-mono font-bold text-sm">{g.title}</h3>
                      {g.description && <p className="text-white/60 text-xs mt-1">{g.description}</p>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeader title="Testimonials" tag={tag} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((t, i) => (
                <GlassCard key={i}>
                  <div className="text-4xl mb-4 font-serif" style={{ color: c.green, opacity: 0.25 }}>&ldquo;</div>
                  <p className="text-base leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                  <div className="mt-6 pt-4 flex items-center gap-3" style={{ borderTop: `1px solid ${c.border}` }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold font-mono"
                      style={{ background: `linear-gradient(135deg, ${c.green}15, ${c.cyan}15)`, color: c.green }}>
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: c.text }}>{t.author}</p>
                      <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="terminal" color={c.green} />
          <div className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionWrapper>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold font-mono" style={{ color: c.text }}>
                  Let&apos;s <span style={{ color: c.green }}>Connect</span>
                </h2>
                <p className="mt-4 text-lg" style={{ color: c.muted }}>Ready to build something amazing together?</p>
              </div>
              <div className="max-w-2xl mx-auto">
                <TerminalWindow title="contact --info">
                  <div className="font-mono text-sm space-y-4">
                    {section.email && (
                      <p><span style={{ color: c.muted }}>email</span> <span style={{ color: c.green }}>=</span> <a href={`mailto:${section.email}`} style={{ color: c.cyan }} className="hover:underline">&quot;{section.email}&quot;</a></p>
                    )}
                    {section.phone && (
                      <p><span style={{ color: c.muted }}>phone</span> <span style={{ color: c.green }}>=</span> <span style={{ color: c.text }}>&quot;{section.phone}&quot;</span></p>
                    )}
                    {section.location && (
                      <p><span style={{ color: c.muted }}>location</span> <span style={{ color: c.green }}>=</span> <span style={{ color: c.text }}>&quot;{section.location}&quot;</span></p>
                    )}
                    {section.calendarLink && (
                      <div className="pt-4">
                        <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-semibold hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${c.green}, ${c.cyan})`, color: c.bg }}>
                          schedule_meeting()
                        </a>
                      </div>
                    )}
                    {section.email && (
                      <div className="pt-4">
                        <a href={`mailto:${section.email}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-semibold hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${c.green}, ${c.cyan})`, color: c.bg }}>
                          send_message() →
                        </a>
                      </div>
                    )}
                  </div>
                </TerminalWindow>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FeaturedProject({ project }: { project: any }) {
  const p = project;
  return (
    <div className="relative rounded-2xl overflow-hidden group" style={{
      backgroundColor: c.surface,
      border: `1px solid ${c.border}`,
      boxShadow: `0 0 60px rgba(0, 255, 136, 0.06)`,
    }}>
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
          {p.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {p.techStack.map((t: string, j: number) => (
                <span key={j} className="text-xs font-mono px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: `${c.green}06`, color: c.green, border: `1px solid ${c.green}15` }}>
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4 font-mono text-sm">
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105 font-semibold"
                style={{ background: `linear-gradient(135deg, ${c.green}, ${c.cyan})`, color: c.bg }}>
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
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProjectCard({ project, index }: { project: any; index: number }) {
  const p = project;
  return (
    <div className="relative rounded-2xl overflow-hidden group h-full" style={{
      backgroundColor: c.surface,
      border: `1px solid ${c.border}`,
    }}>
      <div className="absolute top-4 right-4 text-6xl font-black font-mono opacity-[0.03] select-none" style={{ color: c.green }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      {p.imageUrl && (
        <div className="overflow-hidden h-44 relative">
          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${c.surface})` }} />
        </div>
      )}
      <div className="p-6 relative">
        <h3 className="text-lg font-bold font-mono" style={{ color: c.text }}>{p.title}</h3>
        <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.muted }}>{p.description}</p>
        {p.techStack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.techStack.slice(0, 4).map((t: string, j: number) => (
              <span key={j} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md"
                style={{ backgroundColor: `${c.green}06`, color: c.green, border: `1px solid ${c.green}10` }}>
                {t}
              </span>
            ))}
            {p.techStack.length > 4 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md" style={{ color: c.muted }}>
                +{p.techStack.length - 4}
              </span>
            )}
          </div>
        )}
        <div className="mt-5 flex gap-3 font-mono text-xs">
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline" style={{ color: c.green }}>
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
    </div>
  );
}

export default function DeveloperTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* # Subtle scan line overlay */}
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
