"use client";

/* # Modern Template — Bento grid layout, animated mesh gradient, startup/founder aesthetic */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";

const c = {
  bg: "#09090b",
  surface: "#111113",
  card: "rgba(255,255,255,0.04)",
  text: "#fafafa",
  muted: "#a1a1aa",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  pink: "#ec4899",
  green: "#10b981",
  gradient: "linear-gradient(135deg, #7c3aed, #06b6d4)",
  gradientWarm: "linear-gradient(135deg, #7c3aed, #ec4899, #f97316)",
  border: "rgba(255,255,255,0.08)",
  glass: "rgba(255,255,255,0.03)",
};

/* # Glassmorphism card — startup aesthetic */
function GlassCard({ children, className = "", span = "" }: {
  children: React.ReactNode; className?: string; span?: string;
}) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${span} ${className}`}
      style={{
        backgroundColor: c.card,
        border: `1px solid ${c.border}`,
        backdropFilter: "blur(12px)",
      }}
      whileHover={{
        y: -3,
        borderColor: "rgba(139, 92, 246, 0.2)",
        boxShadow: "0 8px 32px rgba(139, 92, 246, 0.08)",
        transition: { duration: 0.2 },
      }}
    >
      <div className="p-6">{children}</div>
    </motion.div>
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
      {/* # Animated mesh gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 25%, #06b6d4 50%, #10b981 75%, #7c3aed 100%)",
        backgroundSize: "400% 400%",
        animation: "meshGradient 15s ease infinite",
      }} />

      {/* # Grain texture */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(255,255,255,0.1) 0%, transparent 40%)",
      }} />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" as const }}>
              <div className="absolute -inset-1 rounded-3xl bg-white/20 blur-sm" />
              <img src={avatarUrl} alt={data.userName}
                className="relative w-40 h-40 rounded-3xl object-cover shadow-2xl ring-2 ring-white/20" />
            </motion.div>
          )}
          <div>
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(20px)" }}
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {data.tagline || "Open to opportunities"}
            </motion.div>

            <motion.h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              {data.title || data.userName}
            </motion.h1>

            {about && "bio" in about && about.bio && (
              <motion.p className="mt-8 text-lg leading-relaxed max-w-2xl text-white/80"
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                {about.bio}
              </motion.p>
            )}

            <motion.div className="mt-8 flex flex-wrap items-center gap-4"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color="#ffffff" iconSize={24} />}
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
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
    <div className="mb-12">
      <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: c.text }}>
        {children}
      </h2>
      {subtitle && <p className="mt-1.5 text-sm" style={{ color: c.muted }}>{subtitle}</p>}
      <motion.div className="mt-4 h-1 w-12 rounded-full" style={{ background: c.gradient }}
        initial={{ width: 0 }} whileInView={{ width: 48 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
    </div>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading subtitle="Where I've made an impact">Experience</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4">
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem}>
                <GlassCard>
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                      <p className="text-sm font-semibold mt-1" style={{ color: c.violet }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                    </div>
                    <span className="text-xs px-3 py-1.5 rounded-full shrink-0 self-start font-medium"
                      style={{ background: `${c.violet}15`, color: c.violet, border: `1px solid ${c.violet}25` }}>
                      {e.startDate} — {e.endDate || "Present"}
                    </span>
                  </div>
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
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "skills":
      if (section.groups.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading subtitle="Technologies & tools I work with">Stack</SectionHeading>
          {/* # Bento grid — first group spans 2 cols for visual weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.groups.map((g, gi) => {
              const isLarge = gi === 0 && section.groups.length > 2;
              const colors = [c.violet, c.cyan, c.pink, c.green, "#f59e0b"];
              const accent = colors[gi % colors.length];
              return (
                <GlassCard key={gi} span={isLarge ? "md:col-span-2" : ""}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}60` }} />
                    <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{g.category}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full ml-auto" style={{ background: `${accent}15`, color: accent }}>
                      {g.skills.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.skills.map((s, si) => (
                      <motion.span key={si}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}20` }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: si * 0.03 }}
                        whileHover={{ scale: 1.05, boxShadow: `0 0 12px ${accent}20` }}
                      >
                        {s.name}
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading subtitle="Things I've built">Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* # Featured first project — full-width bento hero */}
            {section.entries.length > 0 && (() => {
              const p = section.entries[0];
              return (
                <motion.div variants={staggerItem} className="mb-6">
                  <motion.div className="rounded-2xl overflow-hidden group"
                    style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                    whileHover={{ borderColor: `${c.violet}30`, boxShadow: `0 8px 40px ${c.violet}10` }}>
                    <div className="flex flex-col lg:flex-row">
                      {p.imageUrl && (
                        <div className="lg:w-1/2 overflow-hidden relative">
                          <img src={p.imageUrl} alt={p.title}
                            className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 lg:hidden" style={{ background: `linear-gradient(180deg, transparent 50%, ${c.surface})` }} />
                          <div className="absolute inset-0 hidden lg:block" style={{ background: `linear-gradient(90deg, transparent 60%, ${c.surface})` }} />
                        </div>
                      )}
                      <div className={`p-8 flex flex-col justify-center ${p.imageUrl ? "lg:w-1/2" : "w-full"}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: c.violet }}>Featured Project</span>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: c.text }}>{p.title}</h3>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: c.muted }}>{p.description}</p>
                        {p.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {p.techStack.map((t, j) => (
                              <span key={j} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                                style={{ background: `${c.violet}10`, color: c.violet, border: `1px solid ${c.violet}20` }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-3">
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:scale-[1.02]"
                              style={{ background: c.gradient }}>
                              Live Demo →
                            </a>
                          )}
                          {p.repoUrl && (
                            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
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
            {/* # Bento grid for remaining projects */}
            {section.entries.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.entries.slice(1).map((p, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <motion.div className="rounded-2xl overflow-hidden group h-full"
                      style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}
                      whileHover={{ y: -4, borderColor: `${c.violet}20`, boxShadow: `0 8px 32px ${c.violet}08` }}>
                      {p.imageUrl && (
                        <div className="overflow-hidden h-44 relative">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${c.surface})` }} />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-base font-bold" style={{ color: c.text }}>{p.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.muted }}>{p.description}</p>
                        {p.techStack.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.techStack.slice(0, 4).map((t, j) => (
                              <span key={j} className="text-[11px] px-2 py-0.5 rounded-md font-medium"
                                style={{ background: `${c.violet}10`, color: c.violet }}>
                                {t}
                              </span>
                            ))}
                            {p.techStack.length > 4 && (
                              <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ color: c.muted }}>+{p.techStack.length - 4}</span>
                            )}
                          </div>
                        )}
                        <div className="mt-4 flex gap-3 text-sm font-medium">
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
      );

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((e, i) => (
              <GlassCard key={i}>
                <h3 className="text-lg font-bold" style={{ color: c.text }}>{e.degree}</h3>
                <p className="text-sm font-semibold mt-0.5" style={{ color: c.violet }}>{e.school}</p>
                {e.startDate && <p className="text-xs mt-1" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                {e.description && <p className="text-sm mt-3 leading-relaxed" style={{ color: c.muted }}>{e.description}</p>}
              </GlassCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading>Certifications</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((cert, i) => (
              <GlassCard key={i}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold"
                    style={{ background: c.gradient }}>✓</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: c.text }}>{cert.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading>Publications</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((pub, i) => (
              <GlassCard key={i}>
                <h3 className="font-bold" style={{ color: c.text }}>{pub.title}</h3>
                <p className="text-sm mt-1" style={{ color: c.muted }}>{pub.venue}{pub.date ? ` · ${pub.date}` : ""}</p>
                {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-2 inline-block font-semibold hover:underline" style={{ color: c.violet }}>Read →</a>}
              </GlassCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading>Awards</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((a, i) => (
              <GlassCard key={i}>
                <h3 className="font-bold" style={{ color: c.text }}>{a.title}</h3>
                <p className="text-sm mt-0.5" style={{ color: c.violet }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                {a.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{a.description}</p>}
              </GlassCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading>Gallery</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {section.entries.map((g, i) => (
              <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className={`block rounded-2xl overflow-hidden group ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
                style={{ border: `1px solid ${c.border}` }}
                whileHover={{ y: -3 }}>
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
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading subtitle="What people say">Testimonials</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((t, i) => (
              <GlassCard key={i}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 text-white text-sm font-bold" style={{ background: c.gradient }}>"</div>
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                <div className="mt-5 pt-4 flex items-center gap-3" style={{ borderTop: `1px solid ${c.border}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: c.gradient }}>
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
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <div className="rounded-3xl p-12 text-center text-white relative overflow-hidden" style={{ background: c.gradientWarm }}>
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-3">Let's Build Something Great</h2>
              <p className="mb-10 opacity-80 max-w-md mx-auto">Always open to new opportunities, collaborations, and conversations.</p>
              <div className="flex flex-wrap justify-center gap-4">
                {section.email && (
                  <a href={`mailto:${section.email}`}
                    className="px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(10px)" }}>
                    Email Me
                  </a>
                )}
                {section.calendarLink && (
                  <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                    className="px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                    style={{ backgroundColor: "#fff", color: c.violet }}>
                    Book a Call
                  </a>
                )}
              </div>
            </div>
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

export default function ModernTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />
      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
        ))}
      <footer className="py-10 text-center text-xs" style={{ color: c.muted }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.violet }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
