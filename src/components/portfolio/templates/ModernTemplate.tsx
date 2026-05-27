"use client";

/* # Modern Template — Animated mesh gradient hero, bento cards, startup aesthetic */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";

const c = {
  bg: "#fafbff",
  surface: "#ffffff",
  text: "#0a0a1a",
  muted: "#64648c",
  violet: "#7c3aed",
  cyan: "#06b6d4",
  pink: "#ec4899",
  gradient: "linear-gradient(135deg, #7c3aed, #06b6d4)",
  gradientWarm: "linear-gradient(135deg, #7c3aed, #ec4899, #f97316)",
  gradientSoft: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(6,182,212,0.06))",
  border: "#e5e7f0",
  shadow: "0 2px 8px rgba(124, 58, 237, 0.04), 0 8px 32px rgba(0,0,0,0.04)",
  shadowHover: "0 8px 24px rgba(124, 58, 237, 0.1), 0 16px 48px rgba(0,0,0,0.06)",
};

/* # Premium card with gradient hover border */
function ModernCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity p-px" style={{ background: c.gradient }}>
        <div className="w-full h-full rounded-2xl" style={{ backgroundColor: c.surface }} />
      </div>
      <div className="relative p-6" style={{ backgroundColor: c.surface, boxShadow: c.shadow, border: `1px solid ${c.border}`, borderRadius: "1rem" }}>
        {children}
      </div>
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
      {/* # Multi-color animated mesh gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 20%, #06b6d4 40%, #10b981 60%, #7c3aed 80%, #ec4899 100%)",
        backgroundSize: "400% 400%",
        animation: "meshGradient 12s ease infinite",
      }} />

      {/* # Glass noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* # Radial light spots */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(255,255,255,0.12) 0%, transparent 40%)",
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
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff", backdropFilter: "blur(20px)" }}
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {data.tagline || "Open to opportunities"}
            </motion.div>

            <motion.h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              {data.title || data.userName}
            </motion.h1>

            {about && "bio" in about && about.bio && (
              <motion.p className="mt-8 text-lg leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.8)" }}
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

      {/* # Scroll indicator */}
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
      <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>
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
            className="space-y-5">
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem}>
                <ModernCard>
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                      <p className="text-sm font-semibold mt-1" style={{ color: c.violet }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                    </div>
                    <span className="text-sm px-4 py-1.5 rounded-full shrink-0 self-start font-medium"
                      style={{ background: c.gradientSoft, color: c.violet }}>
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
                </ModernCard>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "skills":
      if (section.groups.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading subtitle="Technologies & tools I work with">Skills</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.groups.map((g, i) => (
              <ModernCard key={i}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: c.violet }}>{g.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s, j) => (
                    <motion.span key={j}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-sm font-medium"
                      style={{ background: c.gradientSoft, color: c.violet }}
                      whileHover={{ scale: 1.05 }}>
                      {s.name}
                    </motion.span>
                  ))}
                </div>
              </ModernCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading subtitle="Things I've built">Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}>
                <motion.div className="rounded-2xl overflow-hidden group"
                  style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow }}
                  whileHover={{ y: -5, boxShadow: c.shadowHover }}>
                  {p.imageUrl && (
                    <div className="overflow-hidden h-52 relative">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent opacity-30" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold" style={{ color: c.text }}>{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>{p.description}</p>
                    {p.techStack.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.techStack.map((t, j) => (
                          <span key={j} className="text-xs px-3 py-1 rounded-xl font-medium"
                            style={{ background: c.gradientSoft, color: c.violet }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-5 flex gap-3">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-105"
                          style={{ background: c.gradient }}>
                          Live Demo
                        </a>
                      )}
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                          style={{ color: c.violet, border: `1px solid ${c.violet}25` }}>
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
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
              <ModernCard key={i}>
                <h3 className="text-lg font-bold" style={{ color: c.text }}>{e.degree}</h3>
                <p className="text-sm font-semibold mt-0.5" style={{ color: c.violet }}>{e.school}</p>
                {e.startDate && <p className="text-xs mt-1" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                {e.description && <p className="text-sm mt-3 leading-relaxed" style={{ color: c.muted }}>{e.description}</p>}
              </ModernCard>
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
              <ModernCard key={i}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold"
                    style={{ background: c.gradient }}>
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: c.text }}>{cert.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  </div>
                </div>
              </ModernCard>
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
              <ModernCard key={i}>
                <h3 className="font-bold" style={{ color: c.text }}>{pub.title}</h3>
                <p className="text-sm mt-1" style={{ color: c.muted }}>{pub.venue}{pub.date ? ` · ${pub.date}` : ""}</p>
                {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-2 inline-block font-semibold hover:underline" style={{ color: c.violet }}>Read More →</a>}
              </ModernCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading>Awards</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((a, i) => (
              <ModernCard key={i}>
                <h3 className="font-bold" style={{ color: c.text }}>{a.title}</h3>
                <p className="text-sm mt-0.5" style={{ color: c.violet }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                {a.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{a.description}</p>}
              </ModernCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading>Gallery</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.entries.map((g, i) => (
              <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden group"
                style={{ boxShadow: c.shadow }}
                whileHover={{ y: -4, boxShadow: c.shadowHover }}>
                <div className="relative">
                  <img src={g.imageUrl} alt={g.title} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(180deg, transparent 40%, ${c.text}cc)` }}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <ModernCard key={i}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-white text-lg font-bold" style={{ background: c.gradient }}>"</div>
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
              </ModernCard>
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
            {/* # Texture overlay */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Let's Build Something Great</h2>
              <p className="mb-10 opacity-80 max-w-md mx-auto">I'm always open to new opportunities, collaborations, and conversations.</p>
              <div className="flex flex-wrap justify-center gap-4">
                {section.email && (
                  <a href={`mailto:${section.email}`}
                    className="px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff", backdropFilter: "blur(10px)" }}>
                    Email Me
                  </a>
                )}
                {section.calendarLink && (
                  <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                    className="px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                    style={{ backgroundColor: "#ffffff", color: c.violet }}>
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
