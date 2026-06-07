"use client";

/* # Modern Template v2 — Violet × Electric Blue dual-tone, constellation dots, floating bento grid */

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

/* # Dual-tone palette: Violet × Electric Blue */
const c = {
  bg: "#0c0a1a",
  bgAlt: "#0f0d22",
  surface: "#16142a",
  text: "#fafafa",
  muted: "#a1a1aa",
  /* # Primary gradient pair */
  primary: "#7c3aed",
  secondary: "#4f46e5",
  /* # Extended palette */
  highlight: "#c7d2fe",
  midDark: "#1e1b4b",
  periwinkle: "#818cf8",
  cyan: "#06b6d4",
  pink: "#ec4899",
  green: "#10b981",
  amber: "#f59e0b",
  gradient: "linear-gradient(135deg, #7c3aed, #4f46e5, #3b82f6)",
  gradientWarm: "linear-gradient(135deg, #7c3aed, #ec4899, #f97316)",
  border: "rgba(255,255,255,0.06)",
};

/* # Rotating accent palette for visual variety across sections */
const ACCENT_COLORS = ["#7c3aed", "#818cf8", "#06b6d4", "#ec4899", "#10b981"];
const ENTRY_GRADIENTS = [
  { from: "#7c3aed", to: "#4f46e5" },
  { from: "#818cf8", to: "#06b6d4" },
  { from: "#ec4899", to: "#7c3aed" },
  { from: "#06b6d4", to: "#10b981" },
  { from: "#f59e0b", to: "#ec4899" },
];

/* # Demo content — curated images for the template picker and editor previews */
const DEMO = {
  projects: [
    { title: "Analytics Platform", desc: "Real-time SaaS dashboard with revenue tracking", img: "https://picsum.photos/seed/dashboard/800/500", tech: ["Next.js", "D3.js", "PostgreSQL"] },
    { title: "CLI Tool", desc: "Fast terminal-based developer utility", img: "https://picsum.photos/seed/coding/600/400", tech: ["Rust", "Tokio"] },
    { title: "FitTracker", desc: "Health & fitness mobile app", img: "https://picsum.photos/seed/mobile/600/400", tech: ["Swift", "HealthKit"] },
    { title: "NeuralChat", desc: "AI-powered conversation engine", img: "https://picsum.photos/seed/aitech/600/400", tech: ["Python", "LangChain"] },
    { title: "Spectrum UI", desc: "Design system component library", img: "https://picsum.photos/seed/uidesign/600/400", tech: ["React", "Figma"] },
  ],
  gallery: [
    { title: "Product Launch", img: "https://picsum.photos/seed/techlaunch/600/500" },
    { title: "Team Workshop", img: "https://picsum.photos/seed/workshop/500/400" },
    { title: "Conference Talk", img: "https://picsum.photos/seed/conference/500/600" },
    { title: "Code Review", img: "https://picsum.photos/seed/review/600/400" },
    { title: "Hackathon", img: "https://picsum.photos/seed/hackathon/500/500" },
    { title: "Office Setup", img: "https://picsum.photos/seed/desksetup/600/400" },
  ],
};

/* # Constellation dots SVG pattern — subtle background decoration */
function ConstellationPattern({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
      {/* # Random dots connected by thin lines */}
      <circle cx="15%" cy="20%" r="1.5" fill={c.primary} />
      <circle cx="25%" cy="35%" r="1" fill={c.periwinkle} />
      <circle cx="10%" cy="50%" r="1.5" fill={c.primary} />
      <circle cx="35%" cy="15%" r="1" fill={c.periwinkle} />
      <circle cx="45%" cy="40%" r="2" fill={c.primary} />
      <circle cx="60%" cy="25%" r="1" fill={c.periwinkle} />
      <circle cx="70%" cy="45%" r="1.5" fill={c.primary} />
      <circle cx="80%" cy="20%" r="1" fill={c.periwinkle} />
      <circle cx="85%" cy="55%" r="1.5" fill={c.primary} />
      <circle cx="90%" cy="35%" r="1" fill={c.periwinkle} />
      <line x1="15%" y1="20%" x2="25%" y2="35%" stroke={c.primary} strokeWidth="0.3" />
      <line x1="25%" y1="35%" x2="45%" y2="40%" stroke={c.primary} strokeWidth="0.3" />
      <line x1="45%" y1="40%" x2="60%" y2="25%" stroke={c.periwinkle} strokeWidth="0.3" />
      <line x1="60%" y1="25%" x2="80%" y2="20%" stroke={c.primary} strokeWidth="0.3" />
      <line x1="70%" y1="45%" x2="85%" y2="55%" stroke={c.periwinkle} strokeWidth="0.3" />
      <line x1="10%" y1="50%" x2="25%" y2="35%" stroke={c.periwinkle} strokeWidth="0.3" />
      <line x1="35%" y1="15%" x2="60%" y2="25%" stroke={c.primary} strokeWidth="0.3" />
    </svg>
  );
}

/* # Floating radial glow orb — ambient lighting effect */
function GlowOrb({ color = c.primary, size = 500, top, left, right, bottom, opacity = 0.08 }: {
  color?: string; size?: number; top?: string; left?: string; right?: string; bottom?: string; opacity?: number;
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, top, left, right, bottom, opacity,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: "blur(80px)",
      }}
    />
  );
}

/* # Section background with optional alt color and glow orb */
function SectionBg({ children, alt = false }: { children: React.ReactNode; alt?: boolean }) {
  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: alt ? c.bgAlt : c.bg }}>
      {alt && <GlowOrb top="-200px" left="50%" opacity={0.04} />}
      <ConstellationPattern opacity={alt ? 0.03 : 0.02} />
      <div className="relative">{children}</div>
    </div>
  );
}

/* # Hero section — full-viewport animated mesh gradient with floating orb */
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
        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 25%, #3b82f6 50%, #06b6d4 75%, #7c3aed 100%)",
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

      {/* # Constellation dots on hero */}
      <ConstellationPattern opacity={0.08} />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16">
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" as const }}>
              <div className="absolute -inset-2 rounded-3xl bg-white/20 blur-md" />
              <Image src={avatarUrl} alt={data.userName}
                className="relative w-44 h-44 rounded-3xl object-cover shadow-2xl ring-2 ring-white/20" width={176} height={176} unoptimized />
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
function renderSection(section: PortfolioSection, index: number, data: PortfolioData) {
  const isAlt = index % 2 === 1;

  switch (section.type) {
    /* # Skills section — glass cards with gradient proficiency bars */
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.primary} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="Technologies & tools I work with">Stack</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((g, gi) => {
                const accent = ACCENT_COLORS[gi % ACCENT_COLORS.length];
                return (
                  <motion.div key={gi}
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
                      {/* # Gradient proficiency bars for each skill */}
                      <div className="space-y-1">
                        {g.skills.map((s, si) => (
                          <SkillBar
                            key={si}
                            name={s.name}
                            proficiency={s.proficiency ?? 80}
                            gradientFrom={c.primary}
                            gradientTo={c.secondary}
                            textColor={c.highlight}
                            mutedColor={`${accent}90`}
                          />
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
          <SectionDivider variant="gradient" color={c.primary} />
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
                    <div className="absolute inset-0 rounded-2xl" style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: `1px solid ${grad.from}15`,
                      backdropFilter: "blur(12px)",
                    }} />
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{
                      background: `linear-gradient(90deg, ${grad.from}, ${grad.to}, transparent)`,
                    }} />
                    <div className={`relative z-10 ${isFeatured ? "p-5 md:flex md:gap-6" : "p-4"}`}>
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

    /* # Projects section — floating bento grid (4col × 2row, featured spans 2×2) */
    case "projects": {
      if (section.entries.length === 0) return null;
      /* # Use real entries if user has them, otherwise show demo in picker/editor */
      const entries = section.entries;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.primary} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="Things I've built">Projects</SectionHeading>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {/* # Bento grid: featured first project spans 2×2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[220px_180px] gap-4">
                {entries.map((p, i) => {
                  const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                  const isFeatured = i === 0;
                  return (
                    <motion.div key={i} variants={staggerItem}
                      className={`rounded-2xl overflow-hidden group relative ${isFeatured ? "lg:col-span-2 lg:row-span-2" : ""}`}
                      style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                      {/* # Image with fallback */}
                      <div className="relative w-full h-full min-h-[180px]">
                        <ImageWithFallback
                          src={p.imageUrl}
                          alt={p.title}
                          fallbackSeed={DEMO.projects[i]?.title.toLowerCase().replace(/\s/g, "")}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          accentColor={grad.from}
                          fill
                        />
                        {/* # Gradient overlay */}
                        <div className="absolute inset-0" style={{
                          background: `linear-gradient(180deg, transparent 20%, ${c.bg}dd 70%, ${c.bg})`,
                        }} />
                        {/* # Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          {isFeatured && (
                            <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block"
                              style={{ color: c.primary }}>Featured Project</span>
                          )}
                          <h3 className={`${isFeatured ? "text-xl" : "text-sm"} font-bold`} style={{ color: c.text }}>
                            {p.title}
                          </h3>
                          {isFeatured && p.description && (
                            <p className="text-sm leading-relaxed mt-2 line-clamp-2" style={{ color: c.muted }}>
                              {p.description}
                            </p>
                          )}
                          {p.techStack.length > 0 && (
                            <div className={`flex flex-wrap gap-1.5 ${isFeatured ? "mt-3" : "mt-2"}`}>
                              {p.techStack.slice(0, isFeatured ? 5 : 3).map((t: string, j: number) => {
                                const pillColor = ACCENT_COLORS[j % ACCENT_COLORS.length];
                                return (
                                  <span key={j} className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                                    style={{ background: `${pillColor}12`, color: pillColor }}>
                                    {t}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          {/* # CTA links */}
                          {isFeatured && (
                            <div className="flex gap-3 mt-4">
                              {p.liveUrl && (
                                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                                  style={{ background: c.gradient, boxShadow: `0 4px 15px ${c.primary}25` }}>
                                  Live Demo →
                                </a>
                              )}
                              {p.repoUrl && (
                                <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold hover:opacity-80"
                                  style={{ color: c.periwinkle, border: `1px solid ${c.periwinkle}25` }}>
                                  Source
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </SectionWrapper>
        </SectionBg>
      );
    }

    /* # Education section — gradient header bars with visual year badges */
    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.primary} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Education</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((e, i) => {
                const grad = ENTRY_GRADIENTS[i % ENTRY_GRADIENTS.length];
                return (
                  <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -6, boxShadow: `0 20px 50px ${grad.from}12`, transition: { duration: 0.25 } }}>
                    <div className="absolute inset-0 rounded-2xl" style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: `1px solid ${grad.from}15`,
                      backdropFilter: "blur(12px)",
                    }} />
                    <div className="relative z-10">
                      <div className="px-7 pt-6 pb-4" style={{
                        background: `linear-gradient(135deg, ${grad.from}12, ${grad.to}06)`,
                        borderBottom: `1px solid ${grad.from}12`,
                      }}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold truncate" style={{ color: c.text }}>{e.degree}</h3>
                            <p className="text-sm font-semibold mt-1" style={{ color: grad.from }}>{e.school}</p>
                          </div>
                          {e.endDate && (
                            <div className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white"
                              style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`, boxShadow: `0 4px 15px ${grad.from}25` }}>
                              <span className="text-lg font-black leading-none">{e.endDate.slice(-2)}</span>
                              <span className="text-[9px] uppercase mt-0.5 opacity-80">year</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="px-7 py-5">
                        {e.startDate && <p className="text-xs mb-3" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
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

    /* # Certifications section — shield-style cards with glowing checkmarks */
    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.primary} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Certifications</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((cert, i) => {
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <motion.div key={i} className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -5, boxShadow: `0 16px 40px ${accent}12`, transition: { duration: 0.2 } }}>
                    <div className="absolute inset-0 rounded-2xl" style={{
                      background: `linear-gradient(135deg, ${accent}06, transparent 60%, ${accent}03)`,
                      border: `1px solid ${accent}12`, backdropFilter: "blur(12px)",
                    }} />
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{
                      background: `linear-gradient(90deg, ${accent}, ${accent}60)`,
                    }} />
                    <div className="relative z-10 p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)`, boxShadow: `0 0 25px ${accent}20` }}>
                          ✓
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-lg" style={{ color: c.text }}>{cert.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs px-3 py-1 rounded-lg font-medium" style={{
                              background: `${accent}12`, color: accent, border: `1px solid ${accent}15`,
                            }}>{cert.issuer}</span>
                            {cert.date && <span className="text-xs px-2.5 py-1 rounded-lg" style={{
                              background: c.border, color: c.muted,
                            }}>{cert.date}</span>}
                          </div>
                          {cert.link && (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-medium mt-3 inline-flex items-center gap-1 hover:underline" style={{ color: accent }}>
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
          <SectionDivider variant="gradient" color={c.primary} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Publications</SectionHeading>
            <div className="space-y-5">
              {section.entries.map((pub, i) => {
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <motion.div key={i} className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -4, boxShadow: `0 16px 40px ${accent}10`, transition: { duration: 0.2 } }}>
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{
                      background: `linear-gradient(180deg, ${accent}, ${accent}40)`, boxShadow: `0 0 15px ${accent}20`,
                    }} />
                    <div className="absolute inset-0 rounded-2xl" style={{
                      backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${accent}10`, backdropFilter: "blur(12px)",
                    }} />
                    <div className="relative z-10 p-7 pl-8 flex items-start gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)`, boxShadow: `0 4px 15px ${accent}20` }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg" style={{ color: c.text }}>{pub.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {pub.venue && <span className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{
                            background: `${accent}12`, color: accent, border: `1px solid ${accent}15`,
                          }}>{pub.venue}</span>}
                          {pub.date && <span className="text-xs px-2.5 py-1 rounded-lg" style={{
                            background: c.border, color: c.muted,
                          }}>{pub.date}</span>}
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

    /* # Awards section — trophy-style cards */
    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.primary} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Awards</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((a, i) => {
                const goldGrads = [
                  { from: "#f59e0b", to: "#f97316" }, { from: "#fbbf24", to: "#f59e0b" }, { from: "#d97706", to: "#fbbf24" },
                ];
                const grad = goldGrads[i % goldGrads.length];
                return (
                  <motion.div key={i} className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -6, boxShadow: `0 20px 50px ${grad.from}15`, transition: { duration: 0.25 } }}>
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{
                      background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`, boxShadow: `0 0 15px ${grad.from}25`,
                    }} />
                    <div className="absolute inset-0 rounded-2xl" style={{
                      backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${grad.from}12`, backdropFilter: "blur(12px)",
                    }} />
                    <div className="relative z-10 p-7">
                      <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                          style={{ background: `linear-gradient(135deg, ${grad.from}20, ${grad.to}12)`, border: `1px solid ${grad.from}25` }}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-bold" style={{ color: c.text }}>{a.title}</h3>
                          <p className="text-sm font-semibold mt-1.5" style={{ color: grad.from }}>{a.issuer}</p>
                          {a.date && <span className="inline-block text-xs px-3 py-1 rounded-lg mt-2 font-medium" style={{
                            background: `${grad.from}10`, color: grad.from, border: `1px solid ${grad.from}15`,
                          }}>{a.date}</span>}
                          {a.description && (
                            <div className="mt-4 p-4 rounded-xl" style={{
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

    /* # Gallery section — floating glass masonry with hover scale */
    case "gallery": {
      if (section.entries.length === 0) return null;
      const galleryEntries = section.entries;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.primary} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Gallery</SectionHeading>
            {/* # 3-column masonry with varied heights */}
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
              {galleryEntries.map((g, i) => {
                const isVideo = Boolean(g.videoUrl && g.videoUrl.trim().length > 0);
                const heights = ["h-48", "h-64", "h-52", "h-72", "h-56", "h-60"];
                const heightClass = heights[i % heights.length];
                return (
                  <motion.a key={i} href={g.link || g.videoUrl || g.imageUrl} target="_blank" rel="noopener noreferrer"
                    className={`block rounded-2xl overflow-hidden group relative break-inside-avoid ${heightClass}`}
                    style={{ border: `1px solid ${c.border}`, backdropFilter: "blur(8px)" }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <ImageWithFallback
                      src={g.imageUrl}
                      alt={g.title}
                      fallbackSeed={DEMO.gallery[i]?.title.toLowerCase().replace(/\s/g, "")}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      accentColor={c.primary}
                      fill
                    />
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${c.primary}cc`, boxShadow: `0 0 30px ${c.primary}40` }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
                        </div>
                      </div>
                    )}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: `${c.primary}20`, border: `1px solid ${c.primary}30`, color: c.primary, backdropFilter: "blur(10px)" }}>
                        Featured
                      </div>
                    )}
                    {g.category && i !== 0 && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                        style={{ backgroundColor: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.85)" }}>
                        {g.category}
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, transparent 30%, ${c.bg}cc 70%, ${c.bg}ee)` }}>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold text-sm">{g.title}</p>
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

    /* # Testimonials section — glass cards with gradient quote marks */
    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.primary} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="What people say">Testimonials</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.entries.map((t, i) => {
                const gradAccents = [
                  { from: c.primary, to: c.secondary }, { from: c.pink, to: c.primary },
                  { from: c.cyan, to: c.green }, { from: c.amber, to: c.pink },
                ];
                const grad = gradAccents[i % gradAccents.length];
                return (
                  <motion.div key={i} className="relative rounded-2xl overflow-hidden"
                    whileHover={{ y: -5, boxShadow: `0 16px 40px ${grad.from}10`, transition: { duration: 0.25 } }}>
                    <div className="absolute inset-0 rounded-2xl p-px" style={{
                      background: `linear-gradient(135deg, ${grad.from}30, transparent 50%, ${grad.to}20)`,
                    }}>
                      <div className="w-full h-full rounded-2xl" style={{
                        backgroundColor: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
                      }} />
                    </div>
                    <div className="relative z-10 p-7">
                      <div className="text-6xl font-serif leading-none mb-3" style={{
                        background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0.4,
                      }}>&ldquo;</div>
                      <div className="p-4 rounded-xl mb-5" style={{
                        background: `linear-gradient(135deg, ${grad.from}05, ${grad.to}03)`, border: `1px solid ${c.border}`,
                      }}>
                        <p className="text-base leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`, boxShadow: `0 4px 15px ${grad.from}20` }}>
                          {t.author.charAt(0)}
                        </div>
                        <div className="w-px h-8" style={{ background: `linear-gradient(180deg, ${grad.from}40, transparent)` }} />
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

    /* # Contact section — full-width gradient CTA */
    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.primary} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <div className="rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden" style={{ background: c.gradientWarm }}>
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.08) 0%, transparent 40%)",
              }} />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black mb-4">Let&apos;s Build Something Great</h2>
                <p className="mb-10 text-lg opacity-80 max-w-lg mx-auto">Always open to new opportunities, collaborations, and conversations.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
                  {section.email && (
                    <a href={`mailto:${section.email}`} className="group block">
                      <div className="rounded-xl p-5 text-center transition-all group-hover:scale-105"
                        style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                        <div className="flex justify-center mb-2"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg></div>
                        <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Email</p>
                        <p className="text-sm font-semibold truncate">{section.email}</p>
                      </div>
                    </a>
                  )}
                  {section.phone && (
                    <div className="rounded-xl p-5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                      <div className="flex justify-center mb-2"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg></div>
                      <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Phone</p>
                      <p className="text-sm font-semibold">{section.phone}</p>
                    </div>
                  )}
                  {section.location && (
                    <div className="rounded-xl p-5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                      <div className="flex justify-center mb-2"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg></div>
                      <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Location</p>
                      <p className="text-sm font-semibold">{section.location}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {section.email && (
                    <a href={`mailto:${section.email}`}
                      className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${c.cyan}, ${c.primary})`, color: "#0a0a12" }}>
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
            bg: "transparent", text: c.text, accent: c.primary, muted: c.muted, border: c.border,
          }} />
        </div>
      </div>

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          {renderSection(section, i, data)}
        </div>
      ))}

      {/* # Footer */}
      <footer className="py-16 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.primary }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
