"use client";

/* # Modern Template — Glassmorphism with violet/cyan/pink accents, floating orbs, animated mesh gradients */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { autoCategorizeSkills } from "@/lib/skill-categories";

/* # Color palette — dark glassmorphism with violet/cyan/pink highlights */
const c = {
  bg: "#09090b",
  bgAlt: "#0f0f14",
  surface: "#16161d",
  text: "#fafafa",
  muted: "#a1a1aa",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  pink: "#ec4899",
  green: "#10b981",
  amber: "#f59e0b",
  gradient: "linear-gradient(135deg, #7c3aed, #06b6d4)",
  gradientWarm: "linear-gradient(135deg, #7c3aed, #ec4899, #f97316)",
  border: "rgba(255,255,255,0.08)",
};

/* # Rotating accent palette for sections and entries */
const ACCENT_COLORS = ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"];

/* # Gradient combos for experience and other entry-based sections */
const ENTRY_GRADIENTS = [
  { from: "#8b5cf6", to: "#06b6d4" },
  { from: "#ec4899", to: "#8b5cf6" },
  { from: "#06b6d4", to: "#10b981" },
  { from: "#f59e0b", to: "#ec4899" },
  { from: "#10b981", to: "#06b6d4" },
];

/* # Reusable glass card with gradient border, backdrop blur, and hover lift */
function GlassCard({ children, className = "", span = "" }: {
  children: React.ReactNode; className?: string; span?: string;
}) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${span} ${className}`}
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: `1px solid ${c.border}`,
        backdropFilter: "blur(12px)",
      }}
      whileHover={{
        y: -4,
        borderColor: "rgba(139, 92, 246, 0.2)",
        boxShadow: "0 12px 40px rgba(139, 92, 246, 0.08)",
        transition: { duration: 0.2 },
      }}
    >
      <div className="p-7">{children}</div>
    </motion.div>
  );
}

/* # Section background with optional floating gradient orb */
function SectionBg({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) {
  return (
    <div className="relative" style={{ backgroundColor: alt ? c.bgAlt : c.bg }}>
      {alt && (
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[250px] opacity-[0.04]"
          style={{ background: c.gradient }} />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/* # Hero section — full-screen animated mesh gradient background */
function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative min-h-screen flex items-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      {/* # Animated mesh gradient background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 25%, #06b6d4 50%, #10b981 75%, #7c3aed 100%)",
        backgroundSize: "400% 400%",
        animation: "meshGradient 15s ease infinite",
      }} />

      {/* # Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* # Light refraction overlay */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(255,255,255,0.1) 0%, transparent 40%)",
      }} />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16">
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" as const }}>
              <div className="absolute -inset-2 rounded-3xl bg-white/20 blur-md" />
              <img src={avatarUrl} alt={data.userName}
                className="relative w-44 h-44 rounded-3xl object-cover shadow-2xl ring-2 ring-white/20" />
            </motion.div>
          )}
          <div>
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(20px)" }}
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {data.tagline || "Open to opportunities"}
            </motion.div>

            <motion.h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.95]"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              {data.title || data.userName}
            </motion.h1>

            {about && "bio" in about && about.bio && (
              <motion.p className="mt-10 text-xl leading-relaxed max-w-2xl text-white/80"
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                {about.bio}
              </motion.p>
            )}

            <motion.div className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color="#ffffff" iconSize={24} />}
            </motion.div>
          </div>
        </div>
      </div>

      {/* # Scroll indicator */}
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <motion.div className="w-1.5 h-3 rounded-full bg-white"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>

      <style>{`@keyframes meshGradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>
    </motion.header>
  );
}

/* # Section heading with gradient underline */
function SectionHeading({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-14">
      <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: c.text }}>
        {children}
      </h2>
      {subtitle && <p className="mt-2 text-base" style={{ color: c.muted }}>{subtitle}</p>}
      <motion.div className="mt-5 h-1 w-14 rounded-full" style={{ background: c.gradient }}
        initial={{ width: 0 }} whileInView={{ width: 56 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
    </div>
  );
}

/* # Main section renderer — handles all portfolio section types */
function renderSection(section: PortfolioSection, index: number) {
  const isAlt = index % 2 === 1;

  switch (section.type) {
    /* # Skills section — glass cards with accent badges per category */
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="Technologies & tools I work with">Stack</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {groups.map((g, gi) => {
                const accent = ACCENT_COLORS[gi % ACCENT_COLORS.length];
                const isLarge = gi === 0 && groups.length > 2;
                return (
                  <motion.div key={gi} className={isLarge ? "md:col-span-2" : ""}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: gi * 0.1 }}>
                    <div className="rounded-2xl p-6 h-full" style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: `1px solid ${c.border}`,
                      backdropFilter: "blur(12px)",
                    }}>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)` }}>
                          {g.skills.length}
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: accent }}>
                          {g.category}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {g.skills.map((s, si) => (
                          <motion.span key={si}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium"
                            style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}18` }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: si * 0.02 }}
                            whileHover={{ scale: 1.06, boxShadow: `0 0 16px ${accent}20` }}
                          >
                            {s.name}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );
    }

    /* # Experience section — bento grid with featured first entry */
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="Where I've made an impact">Experience</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.entries.map((e, i) => {
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                const isFeatured = i === 0;
                return (
                  <motion.div key={i}
                    className={`relative rounded-2xl overflow-hidden ${isFeatured ? "md:col-span-2" : ""}`}
                    whileHover={{ y: -4, boxShadow: `0 16px 40px ${grad.from}12` }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    {/* # Glass card background */}
                    <div className="absolute inset-0 rounded-2xl" style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: `1px solid ${grad.from}15`,
                      backdropFilter: "blur(12px)",
                    }} />
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{
                      background: `linear-gradient(90deg, ${grad.from}, ${grad.to}, transparent)`,
                    }} />

                    <div className={`relative z-10 ${isFeatured ? "p-5 md:flex md:gap-6" : "p-4"}`}>
                      {/* # Company badge */}
                      <div className={`${isFeatured ? "w-12 h-12 text-lg mb-3 md:mb-0" : "w-9 h-9 text-sm mb-3"} rounded-xl flex items-center justify-center shrink-0 font-black text-white`}
                        style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`, boxShadow: `0 4px 15px ${grad.from}25` }}>
                        {e.company?.charAt(0) || "?"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <div className="min-w-0">
                            <h3 className={`${isFeatured ? "text-lg" : "text-sm"} font-bold`} style={{ color: c.text }}>{e.title}</h3>
                            <p className="text-xs mt-0.5" style={{ color: grad.from }}>
                              {e.company}{e.location ? ` · ${e.location}` : ""}
                            </p>
                          </div>
                          {(e.startDate || e.endDate) && (
                            <span className="text-[10px] font-semibold shrink-0 px-2.5 py-1 rounded-lg"
                              style={{ background: `${grad.from}12`, color: grad.from, border: `1px solid ${grad.from}18` }}>
                              {e.startDate} — {e.endDate || "Now"}
                            </span>
                          )}
                        </div>

                        {e.description && (
                          <p className="text-xs leading-relaxed mb-2" style={{ color: c.muted }}>{e.description}</p>
                        )}

                        {e.achievements.length > 0 && (
                          <div className={`${isFeatured ? "grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1" : "space-y-1"}`}>
                            {e.achievements.map((a, j) => (
                              <div key={j} className="flex items-start gap-2">
                                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{
                                  background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                                  boxShadow: `0 0 6px ${grad.from}40`,
                                }} />
                                <span className="text-xs leading-relaxed" style={{ color: c.muted }}>{a}</span>
                              </div>
                            ))}
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

    /* # Projects section — featured first project + grid of cards */
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="Things I've built">Projects</SectionHeading>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {/* # Featured first project — full-width with image on one side */}
              {section.entries.length > 0 && (() => {
                const p = section.entries[0];
                return (
                  <motion.div variants={staggerItem} className="mb-8">
                    <motion.div className="rounded-2xl overflow-hidden group relative"
                      style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                      whileHover={{ borderColor: `${c.violet}30`, boxShadow: `0 12px 50px ${c.violet}12` }}>
                      {/* # Subtle gradient overlay */}
                      <div className="absolute inset-0 opacity-[0.03]" style={{
                        background: `linear-gradient(135deg, ${c.violet}, transparent 50%)`,
                      }} />
                      <div className="flex flex-col lg:flex-row relative z-10">
                        {p.imageUrl && (
                          <div className="lg:w-1/2 overflow-hidden relative">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-72 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 hidden lg:block" style={{ background: `linear-gradient(90deg, transparent 50%, ${c.surface})` }} />
                          </div>
                        )}
                        <div className={`p-10 flex flex-col justify-center ${p.imageUrl ? "lg:w-1/2" : "w-full"}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: c.violet }}>Featured Project</span>
                          <h3 className="text-3xl font-bold mb-4" style={{ color: c.text }}>{p.title}</h3>
                          <p className="text-base leading-relaxed mb-6" style={{ color: c.muted }}>{p.description}</p>
                          {/* # Tech stack as colored pills */}
                          {p.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                              {p.techStack.map((t: string, j: number) => {
                                const pillColor = ACCENT_COLORS[j % ACCENT_COLORS.length];
                                return (
                                  <span key={j} className="text-xs px-3 py-1.5 rounded-lg font-medium"
                                    style={{ background: `${pillColor}10`, color: pillColor, border: `1px solid ${pillColor}18` }}>
                                    {t}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          {/* # CTA buttons with gradient fills */}
                          <div className="flex gap-4">
                            {p.liveUrl && (
                              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                                style={{ background: c.gradient, boxShadow: `0 4px 20px ${c.violet}25` }}>
                                Live Demo →
                              </a>
                            )}
                            {p.repoUrl && (
                              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                                style={{ color: c.violet, border: `1px solid ${c.violet}25` }}>
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
              {/* # Remaining projects in gradient-bordered cards */}
              {section.entries.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.entries.slice(1).map((p, i) => {
                    const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                    return (
                      <motion.div key={i} variants={staggerItem}>
                        <motion.div className="rounded-2xl overflow-hidden group h-full relative"
                          style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                          whileHover={{ y: -5, borderColor: `${grad.from}25`, boxShadow: `0 16px 40px ${grad.from}10` }}>
                          {/* # Top gradient accent */}
                          <div className="absolute top-0 left-0 right-0 h-0.5" style={{
                            background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                          }} />
                          {/* # Image header */}
                          {p.imageUrl && (
                            <div className="overflow-hidden h-48 relative">
                              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${c.surface})` }} />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="text-lg font-bold" style={{ color: c.text }}>{p.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.muted }}>{p.description}</p>
                            {/* # Tech stack as colored pills */}
                            {p.techStack.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-1.5">
                                {p.techStack.slice(0, 4).map((t: string, j: number) => {
                                  const pillColor = ACCENT_COLORS[j % ACCENT_COLORS.length];
                                  return (
                                    <span key={j} className="text-[11px] px-2.5 py-0.5 rounded-md font-medium"
                                      style={{ background: `${pillColor}10`, color: pillColor }}>
                                      {t}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                            {/* # CTA links with gradient accents */}
                            <div className="mt-5 flex gap-3 text-sm font-medium">
                              {p.liveUrl && (
                                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg transition-all hover:scale-105"
                                  style={{
                                    background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}08)`,
                                    color: grad.from,
                                    border: `1px solid ${grad.from}15`,
                                  }}>
                                  Demo →
                                </a>
                              )}
                              {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.cyan }}>Source →</a>}
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
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Education</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((e, i) => {
                /* # Different gradient per education entry */
                const gradients = [
                  { from: c.violet, to: c.cyan },
                  { from: c.cyan, to: c.green },
                  { from: c.pink, to: c.violet },
                  { from: c.amber, to: c.pink },
                ];
                const grad = gradients[i % gradients.length];
                return (
                  <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -6, boxShadow: `0 20px 50px ${grad.from}12`, transition: { duration: 0.25 } }}
                  >
                    {/* # Gradient border */}
                    <div className="absolute inset-0 rounded-2xl" style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: `1px solid ${grad.from}15`,
                      backdropFilter: "blur(12px)",
                    }} />
                    <div className="relative z-10">
                      {/* # Gradient header bar */}
                      <div className="px-7 pt-6 pb-4" style={{
                        background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}06)`,
                        borderBottom: `1px solid ${grad.from}12`,
                      }}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* # Degree name — large and bold */}
                            <h3 className="text-xl font-bold truncate" style={{ color: c.text }}>{e.degree}</h3>
                            {/* # School name in accent color */}
                            <p className="text-sm font-semibold mt-1" style={{ color: grad.from }}>{e.school}</p>
                          </div>
                          {/* # Visual year badge with gradient background */}
                          {e.endDate && (
                            <div className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white"
                              style={{
                                background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                                boxShadow: `0 4px 15px ${grad.from}25`,
                              }}>
                              <span className="text-lg font-black leading-none">{e.endDate.slice(-2)}</span>
                              <span className="text-[9px] uppercase mt-0.5 opacity-80">year</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* # Body */}
                      <div className="px-7 py-5">
                        {e.startDate && (
                          <p className="text-xs mb-3" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>
                        )}
                        {e.description && (
                          <div className="p-3 rounded-xl" style={{ background: `${grad.from}05`, border: `1px solid ${c.border}` }}>
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

    /* # Certifications section — badge/shield-style cards with glowing checkmarks */
    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Certifications</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((cert, i) => {
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -5, boxShadow: `0 16px 40px ${accent}12`, transition: { duration: 0.2 } }}
                  >
                    {/* # Shield-style gradient fill */}
                    <div className="absolute inset-0 rounded-2xl" style={{
                      background: `linear-gradient(135deg, ${accent}06, transparent 60%, ${accent}03)`,
                      border: `1px solid ${accent}12`,
                      backdropFilter: "blur(12px)",
                    }} />
                    {/* # Top gradient accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{
                      background: `linear-gradient(90deg, ${accent}, ${accent}60)`,
                    }} />
                    <div className="relative z-10 p-6">
                      <div className="flex items-start gap-4">
                        {/* # Verification checkmark with glowing accent */}
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${accent}, ${accent}80)`,
                            boxShadow: `0 0 25px ${accent}20, inset 0 0 15px rgba(255,255,255,0.1)`,
                          }}>
                          ✓
                        </div>
                        <div className="min-w-0">
                          {/* # Certificate name */}
                          <h3 className="font-bold text-lg" style={{ color: c.text }}>{cert.name}</h3>
                          {/* # Issuer and date as separate styled elements */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs px-3 py-1 rounded-lg font-medium" style={{
                              background: `${accent}12`, color: accent, border: `1px solid ${accent}15`,
                            }}>{cert.issuer}</span>
                            {cert.date && (
                              <span className="text-xs px-2.5 py-1 rounded-lg" style={{
                                background: c.border, color: c.muted,
                              }}>{cert.date}</span>
                            )}
                          </div>
                          {cert.link && (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-medium mt-3 inline-flex items-center gap-1 hover:underline"
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
        </SectionBg>
      );

    /* # Publications section — numbered citation cards with gradient left accent */
    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Publications</SectionHeading>
            <div className="space-y-5">
              {section.entries.map((pub, i) => {
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
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
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: `1px solid ${accent}10`,
                      backdropFilter: "blur(12px)",
                    }} />
                    <div className="relative z-10 p-7 pl-8 flex items-start gap-5">
                      {/* # Colored number badge */}
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
                        style={{
                          background: `linear-gradient(135deg, ${accent}, ${accent}80)`,
                          boxShadow: `0 4px 15px ${accent}20`,
                        }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg" style={{ color: c.text }}>{pub.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {/* # Venue name as colored tag/pill */}
                          {pub.venue && (
                            <span className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{
                              background: `${accent}12`, color: accent, border: `1px solid ${accent}15`,
                            }}>{pub.venue}</span>
                          )}
                          {pub.date && (
                            <span className="text-xs px-2.5 py-1 rounded-lg" style={{
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
        </SectionBg>
      );

    /* # Awards section — trophy-style cards with amber/gold gradient accents */
    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Awards</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((a, i) => {
                /* # Amber/gold gradient variations for trophy style */
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
                    {/* # Gold top border */}
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{
                      background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                      boxShadow: `0 0 15px ${grad.from}25`,
                    }} />
                    <div className="absolute inset-0 rounded-2xl" style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: `1px solid ${grad.from}12`,
                      backdropFilter: "blur(12px)",
                    }} />
                    {/* # Subtle gold gradient wash */}
                    <div className="absolute inset-0 rounded-2xl opacity-[0.04]" style={{
                      background: `radial-gradient(ellipse at top left, ${grad.from}, transparent 60%)`,
                    }} />
                    <div className="relative z-10 p-7">
                      <div className="flex items-start gap-5">
                        {/* # Trophy icon with amber gradient */}
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
                          <h3 className="text-xl font-bold" style={{ color: c.text }}>{a.title}</h3>
                          {/* # Issuer as colored subtitle */}
                          <p className="text-sm font-semibold mt-1.5" style={{ color: grad.from }}>{a.issuer}</p>
                          {a.date && (
                            <span className="inline-block text-xs px-3 py-1 rounded-lg mt-2 font-medium" style={{
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

    /* # Gallery section — bento grid with varying sizes, video support, gradient overlays */
    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Gallery</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[210px] gap-4">
              {section.entries.map((g, i) => {
                const isVideo = Boolean(g.videoUrl && g.videoUrl.trim().length > 0);
                /* # Bento layout pattern for visual variety */
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
                    className={`block rounded-2xl overflow-hidden group relative ${bentoClass}`}
                    style={{ border: `1px solid ${c.border}` }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="relative w-full h-full">
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                      {/* # Video play overlay */}
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${c.violet}cc`, boxShadow: `0 0 30px ${c.violet}40` }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
                          </div>
                        </div>
                      )}

                      {/* # Featured badge on first item */}
                      {i === 0 && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: `${c.violet}20`, border: `1px solid ${c.violet}30`, color: c.violet, backdropFilter: "blur(10px)" }}>
                          Featured
                        </div>
                      )}

                      {/* # Category badge */}
                      {g.category && i !== 0 && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                          style={{ backgroundColor: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.85)" }}>
                          {g.category}
                        </div>
                      )}

                      {/* # Gradient overlay on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(180deg, transparent 30%, ${c.bg}cc 70%, ${c.bg}ee)` }}>
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-bold text-sm">{g.title}</p>
                          {g.description && <p className="text-white/60 text-xs mt-1">{g.description}</p>}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    /* # Testimonials section — glass/frosted cards with decorative gradient quote marks */
    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="What people say">Testimonials</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((t, i) => {
                const gradAccents = [
                  { from: c.violet, to: c.cyan },
                  { from: c.pink, to: c.violet },
                  { from: c.cyan, to: c.green },
                  { from: c.amber, to: c.pink },
                ];
                const grad = gradAccents[i % gradAccents.length];
                return (
                  <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -5, boxShadow: `0 16px 40px ${grad.from}10`, transition: { duration: 0.25 } }}
                  >
                    {/* # Gradient border for frosted glass effect */}
                    <div className="absolute inset-0 rounded-2xl p-px" style={{
                      background: `linear-gradient(135deg, ${grad.from}30, transparent 50%, ${grad.to}20)`,
                    }}>
                      <div className="w-full h-full rounded-2xl" style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(20px)",
                      }} />
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
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                            boxShadow: `0 4px 15px ${grad.from}20`,
                          }}>
                          {t.author.charAt(0)}
                        </div>
                        {/* # Accent divider */}
                        <div className="w-px h-8" style={{
                          background: `linear-gradient(180deg, ${grad.from}40, transparent)`,
                        }} />
                        <div>
                          <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
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

    /* # Contact section — full-width gradient CTA with glass cards grid */
    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            {/* # Full-width gradient background CTA */}
            <div className="rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden" style={{ background: c.gradientWarm }}>
              {/* # Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
              {/* # Light refraction overlays */}
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.08) 0%, transparent 40%)",
              }} />
              <div className="relative z-10">
                {/* # Large heading */}
                <h2 className="text-4xl md:text-6xl font-black mb-4">Let&apos;s Build Something Great</h2>
                <p className="mb-10 text-lg opacity-80 max-w-lg mx-auto">Always open to new opportunities, collaborations, and conversations.</p>

                {/* # Contact info in gradient glass cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
                  {section.email && (
                    <a href={`mailto:${section.email}`} className="group block">
                      <div className="rounded-xl p-5 text-center transition-all group-hover:scale-105"
                        style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                        <div className="text-2xl mb-2">📧</div>
                        <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Email</p>
                        <p className="text-sm font-semibold truncate">{section.email}</p>
                      </div>
                    </a>
                  )}
                  {section.phone && (
                    <div className="rounded-xl p-5 text-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                      <div className="text-2xl mb-2">📱</div>
                      <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Phone</p>
                      <p className="text-sm font-semibold">{section.phone}</p>
                    </div>
                  )}
                  {section.location && (
                    <div className="rounded-xl p-5 text-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                      <div className="text-2xl mb-2">📍</div>
                      <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Location</p>
                      <p className="text-sm font-semibold">{section.location}</p>
                    </div>
                  )}
                </div>

                {/* # Prominent CTA buttons with gradient fills */}
                <div className="flex flex-wrap justify-center gap-4">
                  {section.email && (
                    <a href={`mailto:${section.email}`}
                      className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${c.cyan}, ${c.violet})`, color: "#0a0a12" }}>
                      Email Me →
                    </a>
                  )}
                  {section.calendarLink && (
                    <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                      className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
                      style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(10px)" }}>
                      Book a Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SectionWrapper>
        </SectionBg>
      );
    }

    default: return null;
  }
}

/* # Main template export */
export default function ModernTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      {/* # Stats bar after hero */}
      <div style={{ backgroundColor: c.bgAlt, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div className="max-w-6xl mx-auto">
          <StatsBar data={data} variant="glass" colors={{
            bg: "transparent", text: c.text, accent: c.violet, muted: c.muted, border: c.border,
          }} />
        </div>
      </div>

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          {renderSection(section, i)}
        </div>
      ))}

      {/* # Footer */}
      <footer className="py-16 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.violet }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
