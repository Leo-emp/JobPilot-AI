"use client";

/* # Creative Template v2 — Teal × Magenta dual-tone, geometric scatter, stacked overlap cards */

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

/* # Dual-tone palette: Teal × Magenta */
const c = {
  bg: "#070714",
  bgAlt: "#0a0a1e",
  surface: "rgba(20, 20, 45, 0.6)",
  text: "#f0f0f8",
  muted: "#9090b0",
  /* # Primary gradient pair — teal fused with magenta */
  teal: "#0891b2",
  magenta: "#d946ef",
  /* # Extended palette */
  cyan: "#22d3ee",
  pink: "#f472b6",
  purple: "#a855f7",
  blue: "#6366f1",
  amber: "#f59e0b",
  green: "#10b981",
  gradient: "linear-gradient(135deg, #0891b2, #d946ef)",
  gradientSoft: "linear-gradient(135deg, rgba(8,145,178,0.15), rgba(217,70,239,0.15))",
  border: "rgba(255,255,255,0.06)",
  glass: "rgba(255,255,255,0.03)",
};

/* # Gradient combos — unique color per card */
const ENTRY_GRADIENTS = [
  { from: "#0891b2", to: "#d946ef" },
  { from: "#d946ef", to: "#a855f7" },
  { from: "#22d3ee", to: "#0891b2" },
  { from: "#f472b6", to: "#d946ef" },
  { from: "#6366f1", to: "#22d3ee" },
];

/* # Accent color rotation */
const ACCENT_COLORS = ["#0891b2", "#d946ef", "#22d3ee", "#f472b6", "#a855f7"];

/* # Demo content — curated images for template previews */
const DEMO = {
  projects: [
    { title: "Design System", img: "https://picsum.photos/seed/designsys/800/500", tech: ["React", "Storybook", "Figma"] },
    { title: "Brand Identity", img: "https://picsum.photos/seed/branding/600/400", tech: ["Illustrator", "Photoshop"] },
    { title: "Motion Reel", img: "https://picsum.photos/seed/motion/600/400", tech: ["After Effects", "Cinema 4D"] },
    { title: "Web Experience", img: "https://picsum.photos/seed/webapp/600/400", tech: ["Three.js", "GSAP"] },
  ],
  gallery: [
    { title: "Abstract Composition", img: "https://picsum.photos/seed/abstract/600/500" },
    { title: "Typography Study", img: "https://picsum.photos/seed/typo/500/600" },
    { title: "Color Exploration", img: "https://picsum.photos/seed/colorful/600/400" },
    { title: "Texture Detail", img: "https://picsum.photos/seed/texture/500/500" },
    { title: "Gradient Art", img: "https://picsum.photos/seed/gradientart/600/400" },
    { title: "Neon Glow", img: "https://picsum.photos/seed/neon/500/600" },
  ],
};

/* # Geometric scatter SVG pattern — floating triangles and circles */
function GeometricScatter({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
      {/* # Scattered triangles */}
      <polygon points="120,30 140,70 100,70" fill={c.teal} />
      <polygon points="80%,15% 83%,22% 77%,22%" fill={c.magenta} transform="rotate(30)" />
      <polygon points="50%,60% 53%,67% 47%,67%" fill={c.teal} />
      {/* # Scattered circles */}
      <circle cx="20%" cy="40%" r="8" fill="none" stroke={c.magenta} strokeWidth="1" />
      <circle cx="75%" cy="30%" r="5" fill="none" stroke={c.teal} strokeWidth="1" />
      <circle cx="90%" cy="65%" r="6" fill={c.teal} opacity="0.5" />
      <circle cx="35%" cy="80%" r="4" fill={c.magenta} opacity="0.4" />
      {/* # Small squares rotated */}
      <rect x="60%" y="75%" width="10" height="10" fill="none" stroke={c.teal} strokeWidth="0.8" transform="rotate(45, 60, 75)" />
      <rect x="15%" y="65%" width="8" height="8" fill="none" stroke={c.magenta} strokeWidth="0.8" transform="rotate(30, 15, 65)" />
      {/* # Connecting lines */}
      <line x1="20%" y1="40%" x2="50%" y2="60%" stroke={c.teal} strokeWidth="0.3" />
      <line x1="75%" y1="30%" x2="90%" y2="65%" stroke={c.magenta} strokeWidth="0.3" />
    </svg>
  );
}

/* # Frosted glass card — reusable container with gradient border glow */
function GlassPanel({ children, className = "", gradFrom = c.teal, gradTo = c.magenta }: {
  children: React.ReactNode; className?: string; gradFrom?: string; gradTo?: string;
}) {
  return (
    <motion.div className={`relative rounded-3xl overflow-hidden ${className}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}>
      <div className="absolute inset-0 rounded-3xl p-px" style={{
        background: `linear-gradient(135deg, ${gradFrom}30, transparent 50%, ${gradTo}20)`,
      }}>
        <div className="w-full h-full rounded-3xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.8)", backdropFilter: "blur(40px)" }} />
      </div>
      <div className="relative z-10 p-7">{children}</div>
    </motion.div>
  );
}

/* # Section background with geometric scatter and optional glow */
function SectionBg({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) {
  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: alt ? c.bgAlt : c.bg }}>
      {alt && (
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${c.teal}06, transparent 70%)`, filter: "blur(80px)" }} />
      )}
      <GeometricScatter opacity={alt ? 0.03 : 0.02} />
      <div className="relative">{children}</div>
    </div>
  );
}

/* # Hero section — center-aligned with floating teal/magenta orbs and bold gradient text */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header className="relative min-h-screen flex items-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
      {/* # Multi-layered radial gradient background */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 20% 50%, ${c.teal}18 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${c.magenta}14 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, ${c.purple}0c 0%, transparent 50%), ${c.bg}`,
      }} />

      {/* # Floating gradient orbs with animation */}
      <motion.div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${c.magenta}12, transparent 70%)`, filter: "blur(80px)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${c.teal}10, transparent 70%)`, filter: "blur(100px)" }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />

      {/* # Geometric scatter on hero */}
      <GeometricScatter opacity={0.06} />

      {/* # Decorative grid overlay */}
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

          {/* # Bold gradient text heading — teal to magenta blend */}
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

/* # Bold section heading with gradient text */
function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <h2 className="text-5xl font-extrabold tracking-tighter" style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base" style={{ color: c.muted }}>{subtitle}</p>}
      <div className="mt-4 w-20 h-1 mx-auto rounded-full" style={{ background: c.gradient }} />
    </div>
  );
}

/* # Main section renderer */
function renderSection(section: PortfolioSection, index: number) {
  const isAlt = index % 2 === 1;

  switch (section.type) {
    /* # Skills section — glass panels with gradient proficiency bars */
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.teal} />
          <SectionWrapper className="py-28 px-6 md:px-12 max-w-6xl mx-auto">
            <SectionHeading title="Skills & Tools" subtitle="My creative toolkit" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {groups.map((g, gi) => {
                const accent = ACCENT_COLORS[gi % ACCENT_COLORS.length];
                const isLarge = gi === 0 && groups.length > 2;
                return (
                  <motion.div key={gi} className={isLarge ? "md:col-span-2" : ""}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: gi * 0.1 }}
                    whileHover={{ rotate: gi % 2 === 0 ? 0.5 : -0.5, transition: { duration: 0.3 } }}>
                    <GlassPanel gradFrom={c.teal} gradTo={c.magenta}>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}60` }} />
                        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{g.category}</h3>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full ml-auto font-bold" style={{
                          background: `linear-gradient(135deg, ${accent}20, ${accent}10)`,
                          color: accent, border: `1px solid ${accent}20`,
                        }}>
                          {g.skills.length}
                        </span>
                      </div>
                      {/* # Gradient proficiency bars for each skill */}
                      <div className="space-y-1">
                        {g.skills.map((s, si) => (
                          <SkillBar
                            key={si}
                            name={s.name}
                            proficiency={s.proficiency ?? 80}
                            gradientFrom={c.teal}
                            gradientTo={c.magenta}
                            textColor={c.text}
                            mutedColor={`${accent}90`}
                          />
                        ))}
                      </div>
                    </GlassPanel>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );
    }

    /* # Experience section — staggered zigzag cards with alternating offsets */
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.teal} />
          <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading title="Experience" />
            <div className="space-y-4">
              {section.entries.map((e, i) => {
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                const isEven = i % 2 === 0;
                return (
                  <motion.div key={i} className={`${isEven ? "md:mr-16" : "md:ml-16"}`}
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}>
                    <motion.div className="relative rounded-2xl overflow-hidden"
                      whileHover={{ y: -4, rotate: isEven ? 0.3 : -0.3, boxShadow: `0 16px 40px ${grad.from}15` }}>
                      <div className="absolute inset-0 rounded-2xl p-px" style={{
                        background: `linear-gradient(${isEven ? "135deg" : "225deg"}, ${grad.from}30, transparent 50%, ${grad.to}20)`,
                      }}>
                        <div className="w-full h-full rounded-2xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.85)", backdropFilter: "blur(40px)" }} />
                      </div>
                      <div className="relative z-10 p-4 flex gap-4">
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
                          {e.description && <p className="text-xs leading-relaxed mb-2" style={{ color: c.muted }}>{e.description}</p>}
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
        </SectionBg>
      );

    /* # Projects section — stacked overlap cards (featured first, rest offset-stacked) */
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.magenta} />
          <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
            <SectionHeading title="Projects" subtitle="Creative work & experiments" />
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {/* # Featured first project — full-width split card */}
              {section.entries.length > 0 && (() => {
                const p = section.entries[0];
                return (
                  <motion.div variants={staggerItem} className="mb-8">
                    <motion.div className="relative rounded-3xl overflow-hidden group"
                      style={{ backgroundColor: "rgba(12,12,30,0.8)", border: `1px solid ${c.border}`, boxShadow: `0 0 60px ${c.teal}08` }}
                      whileHover={{ boxShadow: `0 0 80px ${c.teal}15`, transition: { duration: 0.3 } }}>
                      <div className="absolute inset-0 opacity-[0.04]" style={{
                        background: `radial-gradient(ellipse at 30% 40%, ${c.teal}, transparent 50%), radial-gradient(ellipse at 70% 60%, ${c.magenta}, transparent 50%)`,
                      }} />
                      <div className="flex flex-col lg:flex-row relative z-10">
                        <div className="lg:w-1/2 overflow-hidden relative min-h-[250px]">
                          <ImageWithFallback src={p.imageUrl} alt={p.title}
                            fallbackSeed={DEMO.projects[0]?.title.toLowerCase().replace(/\s/g, "")}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            accentColor={c.teal} fill />
                          <div className="absolute inset-0 lg:hidden" style={{ background: `linear-gradient(180deg, transparent 50%, ${c.bg}f0)` }} />
                          <div className="absolute inset-0 hidden lg:block" style={{ background: `linear-gradient(90deg, transparent 50%, rgba(12,12,30,0.95))` }} />
                        </div>
                        <div className={`p-8 md:p-10 flex flex-col justify-center ${p.imageUrl ? "lg:w-1/2" : "w-full"}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{
                            background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                          }}>Featured Project</span>
                          <h3 className="text-3xl font-extrabold tracking-tight mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>{p.title}</h3>
                          <p className="text-sm leading-relaxed mb-5" style={{ color: c.muted }}>{p.description}</p>
                          {p.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {p.techStack.map((t: string, j: number) => {
                                const pillColor = ACCENT_COLORS[j % ACCENT_COLORS.length];
                                return (
                                  <span key={j} className="text-xs px-3.5 py-1.5 rounded-full font-semibold"
                                    style={{ background: `linear-gradient(135deg, ${pillColor}15, ${pillColor}08)`, color: pillColor, border: `1px solid ${pillColor}20` }}>
                                    {t}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          <div className="flex gap-3">
                            {p.liveUrl && (
                              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                className="text-sm font-bold px-6 py-3 rounded-xl text-white transition-all hover:shadow-lg hover:scale-105"
                                style={{ background: c.gradient, boxShadow: `0 4px 20px ${c.teal}25` }}>
                                Live Demo →
                              </a>
                            )}
                            {p.repoUrl && (
                              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                                className="text-sm font-bold px-6 py-3 rounded-xl transition-all hover:opacity-80"
                                style={{ color: c.teal, border: `1px solid ${c.teal}30` }}>
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

              {/* # Remaining projects — stacked overlap cards with slight rotation/offset */}
              {section.entries.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.entries.slice(1).map((p, i) => {
                    const grad = ENTRY_GRADIENTS[(i + 1) % ENTRY_GRADIENTS.length];
                    return (
                      <motion.div key={i} variants={staggerItem}>
                        <motion.div className="relative rounded-3xl overflow-hidden group h-full"
                          style={{ backgroundColor: "rgba(12,12,30,0.8)", border: `1px solid ${c.border}` }}
                          whileHover={{ y: -5, rotate: i % 2 === 0 ? 0.5 : -0.5, borderColor: `${grad.from}25`, boxShadow: `0 16px 40px ${grad.from}12`, transition: { duration: 0.3 } }}>
                          <div className="absolute top-0 left-0 right-0 h-1" style={{
                            background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                          }} />
                          <div className="overflow-hidden h-44 relative">
                            <ImageWithFallback src={p.imageUrl} alt={p.title}
                              fallbackSeed={DEMO.projects[(i + 1) % DEMO.projects.length]?.title.toLowerCase().replace(/\s/g, "")}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              accentColor={grad.from} fill />
                            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${c.bg}f0)` }} />
                          </div>
                          <div className="p-6 relative">
                            <h3 className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>{p.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.muted }}>{p.description}</p>
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
                            <div className="mt-4 flex gap-3 text-sm font-bold">
                              {p.liveUrl && (
                                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl transition-all hover:scale-105"
                                  style={{ background: `linear-gradient(135deg, ${grad.from}15, ${grad.to}10)`, color: grad.from, border: `1px solid ${grad.from}18` }}>
                                  Demo →
                                </a>
                              )}
                              {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.teal }}>Source →</a>}
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
        </SectionBg>
      );

    /* # Education section — gradient header bars with visual year badges */
    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.teal} />
          <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
            <SectionHeading title="Education" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((e, i) => {
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                return (
                  <motion.div key={i} className="relative rounded-3xl overflow-hidden"
                    whileHover={{ y: -6, rotate: i % 2 === 0 ? 0.5 : -0.5, boxShadow: `0 20px 50px ${grad.from}15`, transition: { duration: 0.3 } }}>
                    <div className="absolute inset-0 rounded-3xl p-px" style={{
                      background: `linear-gradient(180deg, ${grad.from}40, ${grad.to}20, transparent 60%)`,
                    }}>
                      <div className="w-full h-full rounded-3xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.85)", backdropFilter: "blur(40px)" }} />
                    </div>
                    <div className="relative z-10">
                      <div className="px-7 pt-6 pb-4" style={{
                        background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}06)`,
                        borderBottom: `1px solid ${grad.from}12`,
                      }}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-extrabold tracking-tight truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>{e.degree}</h3>
                            <p className="text-sm font-bold mt-1" style={{ color: grad.from }}>{e.school}</p>
                          </div>
                          {e.endDate && (
                            <div className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white"
                              style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`, boxShadow: `0 4px 20px ${grad.from}30` }}>
                              <span className="text-xl font-black leading-none">{e.endDate.slice(-2)}</span>
                              <span className="text-[8px] uppercase mt-0.5 opacity-80 font-bold tracking-wider">year</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="px-7 py-5">
                        {e.startDate && <p className="text-xs mb-3" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                        {e.description && (
                          <div className="p-4 rounded-2xl" style={{ background: `linear-gradient(135deg, ${grad.from}05, ${grad.to}03)`, border: `1px solid ${c.border}` }}>
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

    /* # Gallery section — duotone collage with varied sizes and hover effects */
    case "gallery": {
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.magenta} />
          <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
            <SectionHeading title="Gallery" subtitle="Visual explorations" />
            {/* # Duotone collage — 2-column masonry with teal/magenta overlays on hover */}
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {section.entries.map((g, i) => {
                const isVideo = Boolean(g.videoUrl && g.videoUrl.trim().length > 0);
                const duotone = i % 2 === 0 ? c.teal : c.magenta;
                const heights = ["h-52", "h-72", "h-56", "h-64", "h-48", "h-68"];
                const heightClass = heights[i % heights.length];
                return (
                  <motion.a key={i} href={g.link || g.videoUrl || g.imageUrl} target="_blank" rel="noopener noreferrer"
                    className={`block rounded-3xl overflow-hidden group break-inside-avoid relative ${heightClass}`}
                    style={{ border: `1px solid ${c.border}` }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <ImageWithFallback src={g.imageUrl} alt={g.title}
                      fallbackSeed={DEMO.gallery[i]?.title.toLowerCase().replace(/\s/g, "")}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      accentColor={duotone} fill />
                    {/* # Duotone color overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${c.teal}, ${c.magenta})`, mixBlendMode: "color" }} />
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${c.teal}cc`, boxShadow: `0 0 30px ${c.teal}40` }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
                        </div>
                      </div>
                    )}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: `linear-gradient(135deg, ${c.teal}25, ${c.magenta}20)`, border: `1px solid ${c.teal}30`, color: c.teal, backdropFilter: "blur(10px)" }}>
                        Featured
                      </div>
                    )}
                    {/* # Info overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, transparent 20%, ${c.bg}cc 70%, ${c.bg}ee)` }}>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-extrabold text-sm tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{g.title}</p>
                        {g.description && <p className="text-white/60 text-xs mt-1">{g.description}</p>}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );
    }

    /* # Certifications section — shield-style cards with glowing gradient fills */
    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.teal} />
          <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
            <SectionHeading title="Certifications" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((cert, i) => {
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                return (
                  <motion.div key={i} className="relative rounded-3xl overflow-hidden"
                    whileHover={{ y: -5, rotate: i % 2 === 0 ? 0.5 : -0.5, boxShadow: `0 16px 40px ${accent}15`, transition: { duration: 0.3 } }}>
                    <div className="absolute inset-0 rounded-3xl" style={{
                      background: `linear-gradient(135deg, ${accent}08, transparent 60%, ${accent}04)`,
                      border: `1px solid ${accent}12`,
                    }} />
                    <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{
                      background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                      boxShadow: `0 0 15px ${grad.from}30`,
                    }} />
                    <div className="relative z-10 p-7">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`, boxShadow: `0 0 30px ${accent}20, inset 0 0 15px rgba(255,255,255,0.1)` }}>
                          ✓
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>{cert.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs px-3 py-1.5 rounded-xl font-bold" style={{
                              background: `linear-gradient(135deg, ${accent}15, ${accent}08)`, color: accent, border: `1px solid ${accent}18`,
                            }}>{cert.issuer}</span>
                            {cert.date && <span className="text-xs px-2.5 py-1 rounded-xl font-medium" style={{ background: c.border, color: c.muted }}>{cert.date}</span>}
                          </div>
                          {cert.link && (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-bold mt-3 inline-flex items-center gap-1 hover:underline" style={{ color: accent }}>
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
        </SectionBg>
      );

    /* # Publications section — numbered citation cards */
    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.magenta} />
          <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
            <SectionHeading title="Publications" />
            <div className="space-y-5">
              {section.entries.map((pub, i) => {
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                return (
                  <motion.div key={i} className="relative rounded-3xl overflow-hidden"
                    whileHover={{ y: -4, boxShadow: `0 16px 40px ${accent}12`, transition: { duration: 0.25 } }}>
                    <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-3xl" style={{
                      background: `linear-gradient(180deg, ${grad.from}, ${grad.to})`, boxShadow: `0 0 20px ${grad.from}25`,
                    }} />
                    <div className="absolute inset-0 rounded-3xl" style={{
                      backgroundColor: "rgba(12, 12, 30, 0.8)", border: `1px solid ${accent}10`, backdropFilter: "blur(20px)",
                    }} />
                    <div className="relative z-10 p-7 pl-9 flex items-start gap-5">
                      <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                        style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`, boxShadow: `0 4px 15px ${grad.from}25` }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>{pub.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {pub.venue && <span className="text-xs px-3.5 py-1.5 rounded-xl font-bold" style={{
                            background: `linear-gradient(135deg, ${accent}15, ${accent}08)`, color: accent, border: `1px solid ${accent}18`,
                          }}>{pub.venue}</span>}
                          {pub.date && <span className="text-xs px-2.5 py-1 rounded-xl font-medium" style={{ background: c.border, color: c.muted }}>{pub.date}</span>}
                        </div>
                        {pub.link && (
                          <a href={pub.link} target="_blank" rel="noopener noreferrer"
                            className="text-sm mt-4 inline-flex items-center gap-1 font-bold hover:underline" style={{ color: accent }}>
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
        </SectionBg>
      );

    /* # Awards section — trophy-style cards with gold gradient accents */
    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.teal} />
          <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
            <SectionHeading title="Awards" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((a, i) => {
                const goldGrads = [
                  { from: "#fbbf24", to: "#f59e0b" }, { from: "#f59e0b", to: "#f97316" }, { from: "#d97706", to: "#fbbf24" },
                ];
                const grad = goldGrads[i % goldGrads.length];
                return (
                  <motion.div key={i} className="relative rounded-3xl overflow-hidden"
                    whileHover={{ y: -6, rotate: i % 2 === 0 ? 0.5 : -0.5, boxShadow: `0 20px 50px ${grad.from}18`, transition: { duration: 0.3 } }}>
                    <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{
                      background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`, boxShadow: `0 0 20px ${grad.from}30`,
                    }} />
                    <div className="absolute inset-0 rounded-3xl p-px" style={{
                      background: `linear-gradient(135deg, ${grad.from}20, transparent 40%, ${grad.to}10)`,
                    }}>
                      <div className="w-full h-full rounded-3xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.85)", backdropFilter: "blur(40px)" }} />
                    </div>
                    <div className="relative z-10 p-7">
                      <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                          style={{ background: `linear-gradient(135deg, ${grad.from}25, ${grad.to}15)`, border: `1px solid ${grad.from}25`, boxShadow: `0 0 30px ${grad.from}12` }}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>{a.title}</h3>
                          <p className="text-sm font-bold mt-1.5" style={{ color: grad.from }}>{a.issuer}</p>
                          {a.date && <span className="inline-block text-xs px-3 py-1 rounded-xl mt-2 font-bold" style={{
                            background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}08)`, color: grad.from, border: `1px solid ${grad.from}18`,
                          }}>{a.date}</span>}
                          {a.description && (
                            <div className="mt-4 p-4 rounded-2xl" style={{
                              background: `linear-gradient(135deg, ${grad.from}06, ${grad.to}03)`, border: `1px solid ${grad.from}10`,
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

    /* # Testimonials section — glass cards with decorative gradient quotes */
    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.magenta} />
          <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
            <SectionHeading title="Kind Words" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((t, i) => {
                const gradAccents = [
                  { from: c.teal, to: c.magenta }, { from: c.magenta, to: c.purple },
                  { from: c.cyan, to: c.teal }, { from: c.pink, to: c.magenta },
                ];
                const grad = gradAccents[i % gradAccents.length];
                return (
                  <motion.div key={i} className="relative rounded-3xl overflow-hidden"
                    whileHover={{ y: -5, rotate: i % 2 === 0 ? 0.3 : -0.3, boxShadow: `0 16px 40px ${grad.from}12`, transition: { duration: 0.3 } }}>
                    <div className="absolute inset-0 rounded-3xl p-px" style={{
                      background: `linear-gradient(135deg, ${grad.from}35, transparent 50%, ${grad.to}25)`,
                    }}>
                      <div className="w-full h-full rounded-3xl" style={{ backgroundColor: "rgba(12, 12, 30, 0.85)", backdropFilter: "blur(40px)" }} />
                    </div>
                    <div className="relative z-10 p-7">
                      <div className="text-7xl font-serif leading-none mb-2" style={{
                        background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0.45,
                      }}>&ldquo;</div>
                      <div className="p-5 rounded-2xl mb-5" style={{
                        background: `linear-gradient(135deg, ${grad.from}06, ${grad.to}04)`, border: `1px solid ${grad.from}12`,
                      }}>
                        <p className="text-base leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`, boxShadow: `0 4px 15px ${grad.from}25` }}>
                          {t.author.charAt(0)}
                        </div>
                        <div className="w-px h-8" style={{ background: `linear-gradient(180deg, ${grad.from}50, transparent)` }} />
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
        </SectionBg>
      );

    /* # Contact section — full-width gradient CTA with teal-magenta blend */
    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="wave" color={c.teal} />
          <div className="py-24 px-6 md:px-12">
            <SectionWrapper>
              <div className="max-w-6xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden p-12 md:p-16" style={{
                  background: c.gradient, boxShadow: `0 0 80px ${c.teal}20`,
                }}>
                  <div className="absolute inset-0 opacity-30" style={{
                    background: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 40%)",
                  }} />
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }} />
                  <div className="relative z-10 text-center">
                    <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Let&apos;s Create Together
                    </h2>
                    <p className="mt-4 text-lg text-white/70 max-w-lg mx-auto">Got an idea? Let&apos;s make something extraordinary.</p>
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
                        <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                          <div className="flex justify-center mb-2"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg></div>
                          <p className="text-xs uppercase tracking-wider mb-1 text-white/60">Phone</p>
                          <p className="text-sm font-bold text-white">{section.phone}</p>
                        </div>
                      )}
                      {section.location && (
                        <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                          <div className="flex justify-center mb-2"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg></div>
                          <p className="text-xs uppercase tracking-wider mb-1 text-white/60">Location</p>
                          <p className="text-sm font-bold text-white">{section.location}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                      {section.email && (
                        <a href={`mailto:${section.email}`}
                          className="px-8 py-4 rounded-2xl font-extrabold text-base transition-all hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${c.magenta}, ${c.teal})`, color: "#0c0c1e", boxShadow: `0 4px 20px ${c.magenta}40` }}>
                          Say Hello →
                        </a>
                      )}
                      {section.calendarLink && (
                        <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                          className="px-8 py-4 rounded-2xl font-extrabold text-base text-white transition-all hover:scale-105"
                          style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
                          Schedule a Call
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
        bg: "rgba(255,255,255,0.02)", text: c.text, accent: c.teal, muted: c.muted, border: c.border,
      }} />

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          {renderSection(section, i)}
        </div>
      ))}

      {/* # Footer */}
      <footer className="py-16 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.teal }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
