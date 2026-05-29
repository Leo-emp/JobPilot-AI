"use client";

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { autoCategorizeSkills } from "@/lib/skill-categories";

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

const ACCENT_COLORS = ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"];

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

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative min-h-screen flex items-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 25%, #06b6d4 50%, #10b981 75%, #7c3aed 100%)",
        backgroundSize: "400% 400%",
        animation: "meshGradient 15s ease infinite",
      }} />

      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

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

function renderSection(section: PortfolioSection, index: number) {
  const isAlt = index % 2 === 1;

  switch (section.type) {
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

    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="Where I've made an impact">Experience</SectionHeading>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-5">
              {section.entries.map((e, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <GlassCard>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold text-white"
                        style={{ background: c.gradient }}>
                        {e.company?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                          <div>
                            <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                            <p className="text-base font-semibold mt-1" style={{ color: c.violet }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                          </div>
                          <span className="text-xs px-4 py-2 rounded-xl shrink-0 self-start font-medium"
                            style={{ background: `${c.violet}10`, color: c.violet, border: `1px solid ${c.violet}20` }}>
                            {e.startDate} — {e.endDate || "Present"}
                          </span>
                        </div>
                        {e.description && (
                          <p className="mt-4 text-sm leading-relaxed" style={{ color: c.muted }}>{e.description}</p>
                        )}
                        {e.achievements.length > 0 && (
                          <ul className="mt-5 space-y-3">
                            {e.achievements.map((a, j) => (
                              <li key={j} className="text-sm flex items-start gap-3" style={{ color: c.muted }}>
                                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: c.gradient }} />
                                {a}
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
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="Things I've built">Projects</SectionHeading>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {section.entries.length > 0 && (() => {
                const p = section.entries[0];
                return (
                  <motion.div variants={staggerItem} className="mb-8">
                    <motion.div className="rounded-2xl overflow-hidden group"
                      style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                      whileHover={{ borderColor: `${c.violet}30`, boxShadow: `0 12px 50px ${c.violet}10` }}>
                      <div className="flex flex-col lg:flex-row">
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
                          {p.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                              {p.techStack.map((t: string, j: number) => (
                                <span key={j} className="text-xs px-3 py-1.5 rounded-lg font-medium"
                                  style={{ background: `${c.violet}10`, color: c.violet, border: `1px solid ${c.violet}18` }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-4">
                            {p.liveUrl && (
                              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                                style={{ background: c.gradient }}>
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
              {section.entries.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.entries.slice(1).map((p, i) => (
                    <motion.div key={i} variants={staggerItem}>
                      <motion.div className="rounded-2xl overflow-hidden group h-full"
                        style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                        whileHover={{ y: -4, borderColor: `${c.violet}20`, boxShadow: `0 8px 32px ${c.violet}08` }}>
                        {p.imageUrl && (
                          <div className="overflow-hidden h-48 relative">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${c.surface})` }} />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-lg font-bold" style={{ color: c.text }}>{p.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.muted }}>{p.description}</p>
                          {p.techStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {p.techStack.slice(0, 4).map((t: string, j: number) => (
                                <span key={j} className="text-[11px] px-2.5 py-0.5 rounded-md font-medium"
                                  style={{ background: `${c.violet}10`, color: c.violet }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-5 flex gap-3 text-sm font-medium">
                            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.violet }}>Demo →</a>}
                            {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.cyan }}>Source →</a>}
                          </div>
                        </div>
                      </motion.div>
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
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Education</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((e, i) => (
                <GlassCard key={i}>
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-lg font-bold text-white"
                      style={{ background: c.gradient }}>
                      {e.endDate?.slice(-2) || "??"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: c.text }}>{e.degree}</h3>
                      <p className="text-sm font-semibold mt-1" style={{ color: c.violet }}>{e.school}</p>
                      {e.startDate && <p className="text-xs mt-1.5" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
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
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Certifications</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((cert, i) => (
                <GlassCard key={i}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold"
                      style={{ background: c.gradient }}>✓</div>
                    <div>
                      <p className="font-bold" style={{ color: c.text }}>{cert.name}</p>
                      <p className="text-sm mt-0.5" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
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
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Publications</SectionHeading>
            <div className="space-y-5">
              {section.entries.map((pub, i) => (
                <GlassCard key={i}>
                  <h3 className="font-bold text-lg" style={{ color: c.text }}>{pub.title}</h3>
                  <p className="text-sm mt-2" style={{ color: c.muted }}>{pub.venue}{pub.date ? ` · ${pub.date}` : ""}</p>
                  {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-3 inline-block font-bold hover:underline" style={{ color: c.violet }}>Read →</a>}
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
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Awards</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((a, i) => (
                <GlassCard key={i}>
                  <h3 className="font-bold text-lg" style={{ color: c.text }}>{a.title}</h3>
                  <p className="text-sm mt-1" style={{ color: c.violet }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                  {a.description && <p className="text-sm mt-3" style={{ color: c.muted }}>{a.description}</p>}
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
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading>Gallery</SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {section.entries.map((g, i) => (
                <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                  className={`block rounded-2xl overflow-hidden group ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
                  style={{ border: `1px solid ${c.border}` }}
                  whileHover={{ y: -4 }}>
                  <div className="relative w-full h-full">
                    <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, transparent 40%, ${c.bg}ee)` }}>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold text-sm">{g.title}</p>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </SectionWrapper>
        </SectionBg>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionBg alt={isAlt}>
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <SectionHeading subtitle="What people say">Testimonials</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.entries.map((t, i) => (
                <GlassCard key={i}>
                  <div className="text-4xl font-serif mb-4" style={{ color: c.violet, opacity: 0.25 }}>&ldquo;</div>
                  <p className="text-base leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                  <div className="mt-6 pt-4 flex items-center gap-3" style={{ borderTop: `1px solid ${c.border}` }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: c.gradient }}>
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
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
          <SectionDivider variant="gradient" color={c.violet} />
          <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
            <div className="rounded-3xl p-16 text-center text-white relative overflow-hidden" style={{ background: c.gradientWarm }}>
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black mb-4">Let&apos;s Build Something Great</h2>
                <p className="mb-12 text-lg opacity-80 max-w-lg mx-auto">Always open to new opportunities, collaborations, and conversations.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {section.email && (
                    <a href={`mailto:${section.email}`}
                      className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
                      style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(10px)" }}>
                      Email Me →
                    </a>
                  )}
                  {section.calendarLink && (
                    <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                      className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
                      style={{ backgroundColor: "#fff", color: c.violet }}>
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

export default function ModernTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

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

      <footer className="py-16 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.violet }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
