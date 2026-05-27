"use client";

/* # Developer Template — Cyberpunk neon terminal with glassmorphism and glow effects */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";

const c = {
  bg: "#050510",
  surface: "#0a0a1a",
  card: "rgba(15, 15, 35, 0.7)",
  text: "#e4e4f0",
  muted: "#8888a8",
  green: "#00ff88",
  cyan: "#22d3ee",
  purple: "#a855f7",
  border: "rgba(0, 255, 136, 0.12)",
  glow: "0 0 30px rgba(0, 255, 136, 0.15)",
  glowStrong: "0 0 60px rgba(0, 255, 136, 0.2), 0 0 120px rgba(0, 255, 136, 0.05)",
};

/* # Blinking terminal cursor */
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

/* # Glass card wrapper with gradient border */
function GlassCard({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
      {/* # Gradient border glow */}
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

/* # Terminal window chrome with dots */
function TerminalWindow({ children, title = "terminal" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: c.glow }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#febc2e" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28c840" }} />
        <span className="ml-2 text-xs font-mono" style={{ color: c.muted }}>{title}</span>
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
      className="relative min-h-screen flex items-center px-6 md:px-12 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      {/* # Animated grid background */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `linear-gradient(${c.green}40 1px, transparent 1px), linear-gradient(90deg, ${c.green}40 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* # Floating glow orbs */}
      <motion.div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[150px]"
        style={{ background: `radial-gradient(circle, ${c.green}15, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/4 left-1/6 w-72 h-72 rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${c.cyan}10, transparent)` }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, ${c.purple}08, transparent)` }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />

      {/* # Decorative code lines */}
      <div className="absolute top-20 left-8 opacity-[0.06] text-xs font-mono leading-loose hidden lg:block select-none" style={{ color: c.green }}>
        {"const portfolio = {\n  name: 'developer',\n  type: 'full-stack',\n  passion: 'building',\n  status: 'open-to-work',\n  skills: [...],\n};"}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          {/* # Avatar with glow ring */}
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" as const, bounce: 0.3 }}>
              <div className="absolute -inset-1 rounded-2xl opacity-60" style={{
                background: `linear-gradient(135deg, ${c.green}, ${c.cyan})`,
                filter: "blur(8px)",
              }} />
              <img src={avatarUrl} alt={data.userName}
                className="relative w-36 h-36 rounded-2xl object-cover" />
            </motion.div>
          )}
          <div>
            {/* # Terminal-style tag */}
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono mb-6"
              style={{ backgroundColor: `${c.green}10`, border: `1px solid ${c.green}25`, color: c.green }}
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: c.green, boxShadow: `0 0 6px ${c.green}` }} />
              {data.tagline || "Available for opportunities"}
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight"
              style={{ color: c.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
              {data.title || data.userName}
            </h1>

            {/* # Animated command line */}
            <div className="mt-6 font-mono text-base flex items-center gap-2">
              <span style={{ color: c.cyan }}>$</span>
              <span style={{ color: c.muted }}>npx</span>
              <span style={{ color: c.green }}>view-portfolio</span>
              <span style={{ color: c.muted }}>--format=awesome</span>
              <Cursor />
            </div>

            {about && "bio" in about && about.bio && (
              <p className="mt-8 text-lg leading-relaxed max-w-2xl" style={{ color: c.muted }}>{about.bio}</p>
            )}

            <div className="mt-8 flex items-center gap-6">
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.green} iconSize={22} />}
            </div>
          </div>
        </div>

        {/* # Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-5 h-8 rounded-full border-2 flex justify-center pt-1.5" style={{ borderColor: `${c.green}40` }}>
            <motion.div className="w-1 h-2 rounded-full" style={{ backgroundColor: c.green }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}

function SectionHeader({ title, tag }: { title: string; tag: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="text-xs font-mono px-3 py-1 rounded-full" style={{
        backgroundColor: `${c.green}10`, color: c.green, border: `1px solid ${c.green}20`
      }}>{tag}</span>
      <h2 className="text-3xl font-bold" style={{ color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>
        {title}
      </h2>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${c.green}20, transparent)` }} />
    </div>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Experience" tag="01" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-6">
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem}>
                <GlassCard>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div>
                      <h3 className="text-xl font-bold font-mono" style={{ color: c.text }}>{e.title}</h3>
                      <p className="text-sm font-medium mt-1" style={{ color: c.cyan }}>{e.company}</p>
                      {e.location && <p className="text-xs mt-0.5" style={{ color: c.muted }}>{e.location}</p>}
                    </div>
                    <span className="text-xs font-mono px-3 py-1.5 rounded-lg shrink-0"
                      style={{ backgroundColor: `${c.green}08`, border: `1px solid ${c.green}15`, color: c.green }}>
                      {e.startDate} → {e.endDate || "Present"}
                    </span>
                  </div>
                  {e.achievements.length > 0 && (
                    <ul className="mt-5 space-y-3">
                      {e.achievements.map((a, j) => (
                        <li key={j} className="text-sm flex items-start gap-3" style={{ color: c.muted }}>
                          <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.green, boxShadow: `0 0 6px ${c.green}` }} />
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Tech Stack" tag="02" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.groups.map((g, i) => (
              <GlassCard key={i}>
                <h3 className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: c.green }}>
                  {"// "}{g.category}
                </h3>
                <div className="space-y-4">
                  {g.skills.map((s, j) => (
                    <div key={j}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-mono" style={{ color: c.text }}>{s.name}</span>
                        <span className="text-xs font-mono" style={{ color: c.muted }}>{s.proficiency || 80}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${c.green}10` }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${c.green}, ${c.cyan})`, boxShadow: `0 0 10px ${c.green}40` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.proficiency || 80}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 * j }} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Projects" tag="03" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}>
                <div className="relative rounded-2xl overflow-hidden group" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                  {/* # Project number watermark */}
                  <div className="absolute top-4 right-4 text-6xl font-extrabold font-mono opacity-[0.04] select-none" style={{ color: c.green }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {p.imageUrl && (
                    <div className="overflow-hidden h-48 relative">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${c.surface})` }} />
                    </div>
                  )}
                  <div className="p-6 relative">
                    <h3 className="text-lg font-bold font-mono" style={{ color: c.text }}>{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>{p.description}</p>
                    {p.techStack.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.techStack.map((t, j) => (
                          <span key={j} className="text-xs font-mono px-2.5 py-1 rounded-lg"
                            style={{ backgroundColor: `${c.green}08`, color: c.green, border: `1px solid ${c.green}15` }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-5 flex gap-4 font-mono text-sm">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all hover:shadow-lg"
                          style={{ backgroundColor: `${c.green}15`, color: c.green, border: `1px solid ${c.green}25` }}>
                          demo →
                        </a>
                      )}
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all hover:opacity-80"
                          style={{ color: c.cyan, border: `1px solid ${c.cyan}25` }}>
                          repo →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Education" tag="04" />
          <div className="space-y-4">
            {section.entries.map((e, i) => (
              <GlassCard key={i}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-mono text-sm font-bold"
                    style={{ background: `linear-gradient(135deg, ${c.green}20, ${c.cyan}20)`, color: c.green }}>
                    {e.endDate?.slice(-2) || "??"}
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: c.text }}>{e.degree}</h3>
                    <p className="text-sm mt-0.5" style={{ color: c.cyan }}>{e.school}</p>
                    {e.startDate && <p className="text-xs mt-0.5 font-mono" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                    {e.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{e.description}</p>}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Certifications" tag="05" />
          <TerminalWindow title="certs --list">
            <div className="space-y-4 font-mono text-sm">
              {section.entries.map((cert, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span style={{ color: c.green }}>✓</span>
                  <div>
                    <p style={{ color: c.text }}>{cert.name}</p>
                    <p className="text-xs" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </TerminalWindow>
        </SectionWrapper>
      );

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Publications" tag="06" />
          <div className="space-y-4">
            {section.entries.map((pub, i) => (
              <GlassCard key={i}>
                <h3 className="font-bold" style={{ color: c.text }}>{pub.title}</h3>
                <p className="text-sm mt-1" style={{ color: c.muted }}>{pub.venue}{pub.date ? ` · ${pub.date}` : ""}</p>
                {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-2 inline-block font-mono hover:underline" style={{ color: c.cyan }}>read →</a>}
              </GlassCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Awards" tag="07" />
          <div className="space-y-4">
            {section.entries.map((a, i) => (
              <GlassCard key={i}>
                <h3 className="font-bold" style={{ color: c.text }}>{a.title}</h3>
                <p className="text-sm" style={{ color: c.cyan }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                {a.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{a.description}</p>}
              </GlassCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Gallery" tag="08" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.entries.map((g, i) => (
              <a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden aspect-square"
                style={{ border: `1px solid ${c.border}` }}>
                <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Testimonials" tag="09" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <GlassCard key={i}>
                <div className="text-3xl mb-4" style={{ color: c.green, opacity: 0.3 }}>"</div>
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                <div className="mt-5 pt-4 flex items-center gap-3" style={{ borderTop: `1px solid ${c.border}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono"
                    style={{ background: `linear-gradient(135deg, ${c.green}20, ${c.cyan}20)`, color: c.green }}>
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
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeader title="Contact" tag="10" />
          <TerminalWindow title="contact --info">
            <div className="font-mono text-sm space-y-3">
              {section.email && (
                <p><span style={{ color: c.muted }}>email</span> <span style={{ color: c.green }}>=</span> <a href={`mailto:${section.email}`} style={{ color: c.cyan }} className="hover:underline">"{section.email}"</a></p>
              )}
              {section.phone && (
                <p><span style={{ color: c.muted }}>phone</span> <span style={{ color: c.green }}>=</span> <span style={{ color: c.text }}>"{section.phone}"</span></p>
              )}
              {section.location && (
                <p><span style={{ color: c.muted }}>location</span> <span style={{ color: c.green }}>=</span> <span style={{ color: c.text }}>"{section.location}"</span></p>
              )}
              {section.calendarLink && (
                <p className="pt-2"><a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${c.green}20, ${c.cyan}20)`, border: `1px solid ${c.green}25`, color: c.green }}>
                  schedule_meeting()
                </a></p>
              )}
            </div>
          </TerminalWindow>
        </SectionWrapper>
      );
    }

    default:
      return null;
  }
}

export default function DeveloperTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* # Scan line overlay for CRT effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.03) 2px, rgba(0,255,136,0.03) 4px)" }} />

      <div className="relative z-10">
        <Hero data={data} />

        {/* # Gradient divider after hero */}
        <div className="h-px max-w-6xl mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${c.green}30, transparent)` }} />

        {data.sections
          .filter((s) => s.visible && s.type !== "about")
          .map((section, i) => (
            <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
          ))}

        <footer className="py-10 text-center">
          <p className="text-xs font-mono" style={{ color: c.muted }}>
            <span style={{ color: c.green }}>{"// "}</span>
            Built with{" "}
            <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.green }}>JobPilot AI</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
