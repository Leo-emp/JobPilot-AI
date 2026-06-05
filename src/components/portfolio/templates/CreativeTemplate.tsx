"use client";

/* # Creative Template — Bold gradients, floating glass panels, neon accents, dramatic layouts */

import Image from "next/image";
import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { autoCategorizeSkills } from "@/lib/skill-categories";

/* # Color palette — bold and playful with pink/purple/blue/cyan on dark base */
const c = {
  bg: "#070714",
  surface: "rgba(20, 20, 45, 0.6)",
  text: "#f0f0f8",
  muted: "#9090b0",
  pink: "#f472b6",
  purple: "#a855f7",
  blue: "#6366f1",
  cyan: "#22d3ee",
  amber: "#f59e0b",
  green: "#10b981",
  border: "rgba(255,255,255,0.06)",
  gradient: "linear-gradient(135deg, #f472b6, #a855f7, #6366f1)",
  gradientSoft: "linear-gradient(135deg, rgba(244,114,182,0.15), rgba(168,85,247,0.15), rgba(99,102,241,0.15))",
  glass: "rgba(255,255,255,0.03)",
  glow: "0 0 60px rgba(168, 85, 247, 0.15)",
};

/* # Gradient combos for entries — unique color per card */
const ENTRY_GRADIENTS = [
  { from: "#f472b6", to: "#a855f7" },
  { from: "#a855f7", to: "#6366f1" },
  { from: "#6366f1", to: "#22d3ee" },
  { from: "#22d3ee", to: "#10b981" },
  { from: "#f59e0b", to: "#f472b6" },
];

/* # Accent color rotation for sections */
const ACCENT_COLORS = ["#f472b6", "#a855f7", "#6366f1", "#22d3ee", "#f59e0b"];

/* # Frosted glass card with gradient border */
function GlassPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative rounded-3xl overflow-hidden ${className}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="absolute inset-0 rounded-3xl p-px" style={{ background: `linear-gradient(135deg, ${c.pink}30, transparent 50%, ${c.purple}20)` }}>
        <div className="w-full h-full rounded-3xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.8)", backdropFilter: "blur(40px)" }} />
      </div>
      <div className="relative z-10 p-7">{children}</div>
    </motion.div>
  );
}

/* # Hero section — center-aligned with floating gradient orbs and bold typography */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative min-h-screen flex items-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
    >
      {/* # Multi-layered gradient background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(168,85,247,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(244,114,182,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.1) 0%, transparent 50%), #070714",
      }} />

      {/* # Floating gradient orbs with animation */}
      <motion.div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] rounded-full"
        style={{ background: `radial-gradient(circle, ${c.pink}12, transparent 70%)`, filter: "blur(80px)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, ${c.purple}10, transparent 70%)`, filter: "blur(100px)" }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-[50%] left-[40%] w-[400px] h-[400px] rounded-full"
        style={{ background: `radial-gradient(circle, ${c.blue}08, transparent 70%)`, filter: "blur(60px)" }}
        animate={{ x: [0, 20, -10, 0], y: [-10, 10, 0, -10] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />

      {/* # Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col items-center text-center">
          {avatarUrl && (
            <motion.div className="relative mb-10"
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" as const, bounce: 0.3 }}>
              <div className="absolute -inset-2 rounded-full" style={{ background: c.gradient, filter: "blur(15px)", opacity: 0.4 }} />
              <Image src={avatarUrl} alt={data.userName}
                className="relative w-40 h-40 rounded-full object-cover ring-2 ring-white/10 shadow-2xl" width={160} height={160} unoptimized />
            </motion.div>
          )}

          {/* # Bold oversized gradient text heading */}
          <motion.h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif", background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            {data.title || data.userName}
          </motion.h1>

          {data.tagline && (
            <motion.p className="text-xl md:text-2xl mt-5 font-medium tracking-wide" style={{ color: c.muted }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              {data.tagline}
            </motion.p>
          )}

          {about && "bio" in about && about.bio && (
            <motion.p className="mt-8 text-lg max-w-2xl leading-relaxed" style={{ color: c.muted }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              {about.bio}
            </motion.p>
          )}

          <motion.div className="mt-10 flex items-center gap-5"
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.text} iconSize={24} />}
          </motion.div>
        </div>
      </div>

      {/* # Scroll indicator */}
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
          <motion.div className="w-1.5 h-3 rounded-full" style={{ background: c.gradient }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </motion.header>
  );
}

/* # Bold oversized section heading with gradient underline */
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="text-center mb-14">
      <h2 className="text-5xl font-extrabold tracking-tighter" style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: c.gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        {title}
      </h2>
      <div className="mt-4 w-20 h-1 mx-auto rounded-full" style={{ background: c.gradient }} />
    </div>
  );
}

/* # Main section renderer — handles all portfolio section types */
function renderSection(section: PortfolioSection) {
  switch (section.type) {
    /* # Experience section — staggered zigzag cards with alternating offsets */
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading title="Experience" />
          <div className="space-y-4">
            {section.entries.map((e, i) => {
              const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
              const isEven = i % 2 === 0;
              return (
                <motion.div key={i}
                  className={`${isEven ? "md:mr-16" : "md:ml-16"}`}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}>
                  <motion.div
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -4, rotate: isEven ? 0.3 : -0.3, boxShadow: `0 16px 40px ${grad.from}15` }}>
                    {/* # Gradient border glow */}
                    <div className="absolute inset-0 rounded-2xl p-px" style={{
                      background: `linear-gradient(${isEven ? "135deg" : "225deg"}, ${grad.from}30, transparent 50%, ${grad.to}20)`,
                    }}>
                      <div className="w-full h-full rounded-2xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.85)", backdropFilter: "blur(40px)" }} />
                    </div>

                    <div className="relative z-10 p-4 flex gap-4">
                      {/* # Compact badge */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base font-black text-white"
                        style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`, boxShadow: `0 4px 15px ${grad.from}25` }}>
                        {e.company?.charAt(0) || "?"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                          <h3 className="text-sm font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>{e.title}</h3>
                          <span className="text-xs font-bold" style={{ color: grad.from }}>{e.company}</span>
                          {e.location && <span className="text-[10px]" style={{ color: c.muted }}>· {e.location}</span>}
                          {(e.startDate || e.endDate) && (
                            <span className="text-[10px] font-bold ml-auto shrink-0 px-2 py-0.5 rounded-lg"
                              style={{ background: `${grad.from}12`, color: grad.from }}>
                              {e.startDate} — {e.endDate || "Now"}
                            </span>
                          )}
                        </div>

                        {e.description && (
                          <p className="text-xs leading-relaxed mb-2" style={{ color: c.muted }}>{e.description}</p>
                        )}

                        {e.achievements.length > 0 && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {e.achievements.map((a, j) => (
                              <div key={j} className="flex items-start gap-1.5">
                                <span className="shrink-0 mt-1 text-[10px]" style={{ color: grad.from }}>✦</span>
                                <span className="text-xs leading-relaxed" style={{ color: c.muted }}>{a}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );

    /* # Skills section — floating glass panels with colored accents */
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Skills & Tools" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g, gi) => {
              const accents = [c.pink, c.purple, c.blue, c.cyan, c.amber];
              const accent = accents[gi % accents.length];
              const isLarge = gi === 0 && groups.length > 2;
              return (
                <motion.div key={gi} className={isLarge ? "md:col-span-2" : ""}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: gi * 0.1 }}
                  whileHover={{ rotate: gi % 2 === 0 ? 0.5 : -0.5, transition: { duration: 0.3 } }}>
                  <GlassPanel>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}60` }} />
                      <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{g.category}</h3>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full ml-auto font-bold" style={{
                        background: `linear-gradient(135deg, ${accent}20, ${accent}10)`,
                        color: accent,
                        border: `1px solid ${accent}20`,
                      }}>
                        {g.skills.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {g.skills.map((s, si) => (
                        <motion.span key={si}
                          className="px-3.5 py-1.5 rounded-xl text-sm font-semibold cursor-default"
                          style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}20` }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: si * 0.03 }}
                          whileHover={{ scale: 1.08, boxShadow: `0 0 20px ${accent}25` }}
                        >
                          {s.name}
                        </motion.span>
                      ))}
                    </div>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );
    }

    /* # Projects section — featured first + staggered grid with bold styling */
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Projects" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* # Featured first project — full-width showcase */}
            {section.entries.length > 0 && (() => {
              const p = section.entries[0];
              return (
                <motion.div variants={staggerItem} className="mb-6">
                  <motion.div className="relative rounded-3xl overflow-hidden group"
                    style={{ backgroundColor: "rgba(12,12,30,0.8)", border: `1px solid ${c.border}`, boxShadow: `0 0 60px ${c.purple}08` }}
                    whileHover={{ boxShadow: `0 0 80px ${c.purple}15`, transition: { duration: 0.3 } }}>
                    {/* # Subtle gradient mesh overlay */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                      background: `radial-gradient(ellipse at 30% 40%, ${c.pink}, transparent 50%), radial-gradient(ellipse at 70% 60%, ${c.purple}, transparent 50%)`,
                    }} />
                    <div className="flex flex-col lg:flex-row relative z-10">
                      {p.imageUrl && (
                        <div className="lg:w-1/2 overflow-hidden relative">
                          <Image src={p.imageUrl} alt={p.title}
                            className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105" fill unoptimized />
                          <div className="absolute inset-0 lg:hidden" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(7,7,20,0.95))" }} />
                          <div className="absolute inset-0 hidden lg:block" style={{ background: `linear-gradient(90deg, transparent 50%, rgba(12,12,30,0.95))` }} />
                        </div>
                      )}
                      <div className={`p-8 md:p-10 flex flex-col justify-center ${p.imageUrl ? "lg:w-1/2" : "w-full"}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{
                          background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>Featured Project</span>
                        <h3 className="text-3xl font-extrabold tracking-tight mb-3" style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: c.text,
                        }}>{p.title}</h3>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: c.muted }}>{p.description}</p>
                        {/* # Tech stack as colored pills */}
                        {p.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {p.techStack.map((t: string, j: number) => {
                              const pillColor = ACCENT_COLORS[j % ACCENT_COLORS.length];
                              return (
                                <span key={j} className="text-xs px-3.5 py-1.5 rounded-full font-semibold"
                                  style={{
                                    background: `linear-gradient(135deg, ${pillColor}15, ${pillColor}08)`,
                                    color: pillColor,
                                    border: `1px solid ${pillColor}20`,
                                  }}>{t}</span>
                              );
                            })}
                          </div>
                        )}
                        {/* # CTA buttons with gradient fills */}
                        <div className="flex gap-3">
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-bold px-6 py-3 rounded-xl text-white transition-all hover:shadow-lg hover:scale-105"
                              style={{ background: c.gradient, boxShadow: `0 4px 20px ${c.purple}25` }}>
                              Live Demo →
                            </a>
                          )}
                          {p.repoUrl && (
                            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-bold px-6 py-3 rounded-xl transition-all hover:opacity-80"
                              style={{ color: c.purple, border: `1px solid ${c.purple}30` }}>
                              Source
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
            {/* # Remaining projects in staggered grid with gradient borders */}
            {section.entries.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {section.entries.slice(1).map((p, i) => {
                  const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                  return (
                    <motion.div key={i} variants={staggerItem}>
                      <motion.div className="relative rounded-3xl overflow-hidden group h-full"
                        style={{ backgroundColor: "rgba(12,12,30,0.8)", border: `1px solid ${c.border}` }}
                        whileHover={{ y: -5, rotate: i % 2 === 0 ? 0.5 : -0.5, borderColor: `${grad.from}25`, boxShadow: `0 16px 40px ${grad.from}12`, transition: { duration: 0.3 } }}>
                        {/* # Top gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1" style={{
                          background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                        }} />
                        {/* # Image header */}
                        {p.imageUrl && (
                          <div className="overflow-hidden h-44 relative">
                            <Image src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" fill unoptimized />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(7,7,20,0.95))" }} />
                          </div>
                        )}
                        <div className="p-6 relative">
                          <h3 className="text-lg font-extrabold tracking-tight" style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: c.text,
                          }}>{p.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.muted }}>{p.description}</p>
                          {/* # Tech stack as colored pills */}
                          {p.techStack.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {p.techStack.slice(0, 4).map((t: string, j: number) => {
                                const pillColor = ACCENT_COLORS[j % ACCENT_COLORS.length];
                                return (
                                  <span key={j} className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                                    style={{ background: `${pillColor}12`, color: pillColor }}>{t}</span>
                                );
                              })}
                              {p.techStack.length > 4 && <span className="text-[11px] px-2 py-0.5" style={{ color: c.muted }}>+{p.techStack.length - 4}</span>}
                            </div>
                          )}
                          {/* # CTA links with gradient accents */}
                          <div className="mt-4 flex gap-3 text-sm font-bold">
                            {p.liveUrl && (
                              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl transition-all hover:scale-105"
                                style={{
                                  background: `linear-gradient(135deg, ${grad.from}15, ${grad.to}10)`,
                                  color: grad.from,
                                  border: `1px solid ${grad.from}18`,
                                }}>
                                Demo →
                              </a>
                            )}
                            {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.purple }}>Source →</a>}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </SectionWrapper>
      );

    /* # Education section — gradient header bars with visual year badges */
    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Education" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((e, i) => {
              /* # Each education card gets a different gradient */
              const gradients = [
                { from: c.pink, to: c.purple },
                { from: c.purple, to: c.blue },
                { from: c.blue, to: c.cyan },
                { from: c.cyan, to: c.green },
              ];
              const grad = gradients[i % gradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-3xl overflow-hidden"
                  whileHover={{ y: -6, rotate: i % 2 === 0 ? 0.5 : -0.5, boxShadow: `0 20px 50px ${grad.from}15`, transition: { duration: 0.3 } }}
                >
                  {/* # Gradient border */}
                  <div className="absolute inset-0 rounded-3xl p-px" style={{
                    background: `linear-gradient(180deg, ${grad.from}40, ${grad.to}20, transparent 60%)`,
                  }}>
                    <div className="w-full h-full rounded-3xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.85)", backdropFilter: "blur(40px)" }} />
                  </div>
                  <div className="relative z-10">
                    {/* # Gradient header bar */}
                    <div className="px-7 pt-6 pb-4" style={{
                      background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}06)`,
                      borderBottom: `1px solid ${grad.from}12`,
                    }}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* # Degree name — large and bold */}
                          <h3 className="text-xl font-extrabold tracking-tight truncate" style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: c.text,
                          }}>{e.degree}</h3>
                          {/* # School name in accent color */}
                          <p className="text-sm font-bold mt-1" style={{ color: grad.from }}>{e.school}</p>
                        </div>
                        {/* # Visual year badge with gradient background */}
                        {e.endDate && (
                          <div className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white"
                            style={{
                              background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                              boxShadow: `0 4px 20px ${grad.from}30`,
                            }}>
                            <span className="text-xl font-black leading-none">{e.endDate.slice(-2)}</span>
                            <span className="text-[8px] uppercase mt-0.5 opacity-80 font-bold tracking-wider">year</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* # Body content */}
                    <div className="px-7 py-5">
                      {e.startDate && (
                        <p className="text-xs mb-3" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>
                      )}
                      {e.description && (
                        <div className="p-4 rounded-2xl" style={{
                          background: `linear-gradient(135deg, ${grad.from}05, ${grad.to}03)`,
                          border: `1px solid ${c.border}`,
                        }}>
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
      );

    /* # Gallery section — masonry layout with hover zoom and gradient overlay */
    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Gallery" />
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {section.entries.map((g, i) => {
              const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                  className="block rounded-3xl overflow-hidden group break-inside-avoid"
                  style={{ border: `1px solid ${c.border}` }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}>
                  <div className="relative">
                    <Image src={g.imageUrl} alt={g.title} className="w-full transition-transform duration-500 group-hover:scale-110" width={800} height={600} unoptimized />
                    {/* # Gradient overlay on hover showing title */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, transparent 20%, ${accent}15 60%, ${c.bg}dd 90%)` }}>
                      <div className="absolute bottom-5 left-5 right-5">
                        <p className="text-white font-extrabold text-sm tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{g.title}</p>
                        {g.description && <p className="text-white/60 text-xs mt-1">{g.description}</p>}
                      </div>
                    </div>
                    {/* # Featured badge on first item */}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: `linear-gradient(135deg, ${c.pink}25, ${c.purple}20)`,
                          border: `1px solid ${c.pink}30`,
                          color: c.pink,
                          backdropFilter: "blur(10px)",
                        }}>
                        Featured
                      </div>
                    )}
                  </div>
                </motion.a>
              );
            })}
          </div>
        </SectionWrapper>
      );

    /* # Testimonials section — glass/frosted cards with large decorative gradient quotes */
    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Kind Words" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => {
              const gradAccents = [
                { from: c.pink, to: c.purple },
                { from: c.purple, to: c.blue },
                { from: c.blue, to: c.cyan },
                { from: c.cyan, to: c.pink },
              ];
              const grad = gradAccents[i % gradAccents.length];
              return (
                <motion.div key={i}
                  className="relative rounded-3xl overflow-hidden"
                  whileHover={{ y: -5, rotate: i % 2 === 0 ? 0.3 : -0.3, boxShadow: `0 16px 40px ${grad.from}12`, transition: { duration: 0.3 } }}
                >
                  {/* # Gradient border for frosted glass effect */}
                  <div className="absolute inset-0 rounded-3xl p-px" style={{
                    background: `linear-gradient(135deg, ${grad.from}35, transparent 50%, ${grad.to}25)`,
                  }}>
                    <div className="w-full h-full rounded-3xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.85)", backdropFilter: "blur(40px)" }} />
                  </div>
                  <div className="relative z-10 p-7">
                    {/* # Large decorative gradient quote mark */}
                    <div className="text-7xl font-serif leading-none mb-2" style={{
                      background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      opacity: 0.45,
                    }}>&ldquo;</div>
                    {/* # Quote text in a gradient inner card */}
                    <div className="p-5 rounded-2xl mb-5" style={{
                      background: `linear-gradient(135deg, ${grad.from}06, ${grad.to}04)`,
                      border: `1px solid ${grad.from}12`,
                    }}>
                      <p className="text-base leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                    </div>
                    {/* # Author info with colored avatar badge and accent divider */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                          boxShadow: `0 4px 15px ${grad.from}25`,
                        }}>
                        {t.author.charAt(0)}
                      </div>
                      {/* # Accent divider */}
                      <div className="w-px h-8" style={{
                        background: `linear-gradient(180deg, ${grad.from}50, transparent)`,
                      }} />
                      <div>
                        <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
                        <p className="text-xs font-semibold" style={{ color: grad.from }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );

    /* # Certifications section — badge/shield-style cards with glowing gradient fills */
    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Certifications" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.entries.map((cert, i) => {
              const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
              const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
              return (
                <motion.div key={i}
                  className="relative rounded-3xl overflow-hidden"
                  whileHover={{ y: -5, rotate: i % 2 === 0 ? 0.5 : -0.5, boxShadow: `0 16px 40px ${accent}15`, transition: { duration: 0.3 } }}
                >
                  {/* # Shield-style gradient fill background */}
                  <div className="absolute inset-0 rounded-3xl" style={{
                    background: `linear-gradient(135deg, ${accent}08, transparent 60%, ${accent}04)`,
                    border: `1px solid ${accent}12`,
                  }} />
                  {/* # Bold top gradient bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{
                    background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                    boxShadow: `0 0 15px ${grad.from}30`,
                  }} />
                  <div className="relative z-10 p-7">
                    <div className="flex items-start gap-4">
                      {/* # Verification checkmark with glowing gradient accent */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                          boxShadow: `0 0 30px ${accent}20, inset 0 0 15px rgba(255,255,255,0.1)`,
                        }}>
                        ✓
                      </div>
                      <div className="min-w-0">
                        {/* # Certificate name — bold */}
                        <h3 className="font-extrabold text-lg tracking-tight" style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: c.text,
                        }}>{cert.name}</h3>
                        {/* # Issuer and date as separate visual elements */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs px-3 py-1.5 rounded-xl font-bold" style={{
                            background: `linear-gradient(135deg, ${accent}15, ${accent}08)`,
                            color: accent,
                            border: `1px solid ${accent}18`,
                          }}>{cert.issuer}</span>
                          {cert.date && (
                            <span className="text-xs px-2.5 py-1 rounded-xl font-medium" style={{
                              background: c.border, color: c.muted,
                            }}>{cert.date}</span>
                          )}
                        </div>
                        {cert.link && (
                          <a href={cert.link} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-bold mt-3 inline-flex items-center gap-1 hover:underline"
                            style={{ color: accent }}>
                            Verify →
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
      );

    /* # Publications section — numbered citation cards with gradient left accent */
    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Publications" />
          <div className="space-y-5">
            {section.entries.map((pub, i) => {
              const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
              const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
              return (
                <motion.div key={i}
                  className="relative rounded-3xl overflow-hidden"
                  whileHover={{ y: -4, boxShadow: `0 16px 40px ${accent}12`, transition: { duration: 0.25 } }}
                >
                  {/* # Gradient left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-3xl" style={{
                    background: `linear-gradient(180deg, ${grad.from}, ${grad.to})`,
                    boxShadow: `0 0 20px ${grad.from}25`,
                  }} />
                  <div className="absolute inset-0 rounded-3xl" style={{
                    backgroundColor: "rgba(12, 12, 30, 0.8)",
                    border: `1px solid ${accent}10`,
                    backdropFilter: "blur(20px)",
                  }} />
                  <div className="relative z-10 p-7 pl-9 flex items-start gap-5">
                    {/* # Colored number badge */}
                    <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                      style={{
                        background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                        boxShadow: `0 4px 15px ${grad.from}25`,
                      }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-lg tracking-tight" style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: c.text,
                      }}>{pub.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {/* # Venue name as colored tag/pill */}
                        {pub.venue && (
                          <span className="text-xs px-3.5 py-1.5 rounded-xl font-bold" style={{
                            background: `linear-gradient(135deg, ${accent}15, ${accent}08)`,
                            color: accent,
                            border: `1px solid ${accent}18`,
                          }}>{pub.venue}</span>
                        )}
                        {pub.date && (
                          <span className="text-xs px-2.5 py-1 rounded-xl font-medium" style={{
                            background: c.border, color: c.muted,
                          }}>{pub.date}</span>
                        )}
                      </div>
                      {pub.link && (
                        <a href={pub.link} target="_blank" rel="noopener noreferrer"
                          className="text-sm mt-4 inline-flex items-center gap-1 font-bold hover:underline"
                          style={{ color: accent }}>
                          Read →
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );

    /* # Awards section — trophy-style cards with amber/gold gradient accents */
    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Awards" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((a, i) => {
              /* # Amber/gold gradient variations for trophy style */
              const goldGradients = [
                { from: "#fbbf24", to: "#f59e0b" },
                { from: "#f59e0b", to: "#f97316" },
                { from: "#d97706", to: "#fbbf24" },
              ];
              const grad = goldGradients[i % goldGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-3xl overflow-hidden"
                  whileHover={{ y: -6, rotate: i % 2 === 0 ? 0.5 : -0.5, boxShadow: `0 20px 50px ${grad.from}18`, transition: { duration: 0.3 } }}
                >
                  {/* # Gold top border */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{
                    background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                    boxShadow: `0 0 20px ${grad.from}30`,
                  }} />
                  <div className="absolute inset-0 rounded-3xl p-px" style={{
                    background: `linear-gradient(135deg, ${grad.from}20, transparent 40%, ${grad.to}10)`,
                  }}>
                    <div className="w-full h-full rounded-3xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.85)", backdropFilter: "blur(40px)" }} />
                  </div>
                  {/* # Subtle gold gradient wash */}
                  <div className="absolute inset-0 rounded-3xl opacity-[0.05]" style={{
                    background: `radial-gradient(ellipse at top left, ${grad.from}, transparent 50%)`,
                  }} />
                  <div className="relative z-10 p-7">
                    <div className="flex items-start gap-5">
                      {/* # Trophy icon with amber gradient */}
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${grad.from}25, ${grad.to}15)`,
                          border: `1px solid ${grad.from}25`,
                          boxShadow: `0 0 30px ${grad.from}12`,
                        }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* # Award title — prominent with bold typography */}
                        <h3 className="text-xl font-extrabold tracking-tight" style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: c.text,
                        }}>{a.title}</h3>
                        {/* # Issuer as colored subtitle */}
                        <p className="text-sm font-bold mt-1.5" style={{ color: grad.from }}>{a.issuer}</p>
                        {a.date && (
                          <span className="inline-block text-xs px-3 py-1 rounded-xl mt-2 font-bold" style={{
                            background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}08)`,
                            color: grad.from,
                            border: `1px solid ${grad.from}18`,
                          }}>{a.date}</span>
                        )}
                        {/* # Description in a subtle gradient box */}
                        {a.description && (
                          <div className="mt-4 p-4 rounded-2xl" style={{
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
      );

    /* # Contact section — full-width gradient CTA with glass cards and bold typography */
    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <div className="py-24 px-6 md:px-12">
          <SectionWrapper>
            <div className="max-w-6xl mx-auto">
              {/* # Full-width gradient background CTA section */}
              <div className="relative rounded-3xl overflow-hidden p-12 md:p-16" style={{
                background: c.gradient,
                boxShadow: `0 0 80px ${c.purple}20`,
              }}>
                {/* # Mesh gradient overlay */}
                <div className="absolute inset-0 opacity-30" style={{
                  background: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 40%)",
                }} />
                {/* # Noise texture */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }} />

                <div className="relative z-10 text-center">
                  {/* # Large heading with bold typography */}
                  <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white" style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    Let&apos;s Create Together
                  </h2>
                  <p className="mt-4 text-lg text-white/70 max-w-lg mx-auto">Got an idea? Let&apos;s make something extraordinary.</p>

                  {/* # Contact info in gradient glass cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-10 mb-10">
                    {section.email && (
                      <a href={`mailto:${section.email}`} className="group block">
                        <div className="rounded-2xl p-5 text-center transition-all group-hover:scale-105"
                          style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                          <div className="flex justify-center mb-2"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg></div>
                          <p className="text-xs uppercase tracking-wider mb-1 text-white/60">Email</p>
                          <p className="text-sm font-bold text-white truncate">{section.email}</p>
                        </div>
                      </a>
                    )}
                    {section.phone && (
                      <div className="rounded-2xl p-5 text-center"
                        style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                        <div className="flex justify-center mb-2"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg></div>
                        <p className="text-xs uppercase tracking-wider mb-1 text-white/60">Phone</p>
                        <p className="text-sm font-bold text-white">{section.phone}</p>
                      </div>
                    )}
                    {section.location && (
                      <div className="rounded-2xl p-5 text-center"
                        style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                        <div className="flex justify-center mb-2"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg></div>
                        <p className="text-xs uppercase tracking-wider mb-1 text-white/60">Location</p>
                        <p className="text-sm font-bold text-white">{section.location}</p>
                      </div>
                    )}
                  </div>

                  {/* # Prominent CTA buttons */}
                  <div className="flex flex-wrap justify-center gap-4">
                    {section.email && (
                      <a href={`mailto:${section.email}`}
                        className="px-8 py-4 rounded-2xl font-extrabold text-base transition-all hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${c.pink}, ${c.purple})`,
                          color: "#0c0c1e",
                          boxShadow: `0 4px 20px ${c.pink}40`,
                        }}>
                        Say Hello →
                      </a>
                    )}
                    {section.calendarLink && (
                      <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                        className="px-8 py-4 rounded-2xl font-extrabold text-base text-white transition-all hover:scale-105"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(10px)",
                        }}>
                        Schedule a Call
                      </a>
                    )}
                  </div>
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
export default function CreativeTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      {/* # Stats bar after hero */}
      <StatsBar data={data} variant="glass" colors={{
        bg: "rgba(255,255,255,0.02)", text: c.text, accent: c.pink, muted: c.muted, border: c.border,
      }} />

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          <SectionDivider variant="wave" color={c.purple} />
          {renderSection(section)}
        </div>
      ))}

      {/* # Footer */}
      <footer className="py-16 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.pink }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
