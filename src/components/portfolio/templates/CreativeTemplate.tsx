"use client";

/* # Creative Template — Bold gradients, floating glass panels, neon accents, dramatic layouts */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";

const c = {
  bg: "#070714",
  surface: "rgba(20, 20, 45, 0.6)",
  text: "#f0f0f8",
  muted: "#9090b0",
  pink: "#f472b6",
  purple: "#a855f7",
  blue: "#6366f1",
  cyan: "#22d3ee",
  border: "rgba(255,255,255,0.06)",
  gradient: "linear-gradient(135deg, #f472b6, #a855f7, #6366f1)",
  gradientSoft: "linear-gradient(135deg, rgba(244,114,182,0.15), rgba(168,85,247,0.15), rgba(99,102,241,0.15))",
  glass: "rgba(255,255,255,0.03)",
  glow: "0 0 60px rgba(168, 85, 247, 0.15)",
};

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
              <img src={avatarUrl} alt={data.userName}
                className="relative w-40 h-40 rounded-full object-cover ring-2 ring-white/10 shadow-2xl" />
            </motion.div>
          )}

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

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="text-center mb-14">
      <h2 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>
        {title}
      </h2>
      <div className="mt-4 w-16 h-1 mx-auto rounded-full" style={{ background: c.gradient }} />
    </div>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Experience" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-6">
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem}>
                <GlassPanel>
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                      <p className="text-sm font-semibold mt-1" style={{ color: c.pink }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                    </div>
                    <span className="text-sm shrink-0 px-4 py-1.5 rounded-full self-start"
                      style={{ background: `linear-gradient(135deg, ${c.pink}15, ${c.purple}15)`, color: c.muted, border: `1px solid ${c.border}` }}>
                      {e.startDate} — {e.endDate || "Present"}
                    </span>
                  </div>
                  {e.achievements.length > 0 && (
                    <ul className="mt-5 space-y-3">
                      {e.achievements.map((a, j) => (
                        <li key={j} className="text-sm flex items-start gap-3" style={{ color: c.muted }}>
                          <span className="shrink-0 mt-1 text-xs" style={{ color: c.purple }}>✦</span> {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "skills":
      if (section.groups.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Skills & Tools" />
          <div className="flex flex-wrap justify-center gap-3">
            {section.groups.flatMap((g) => g.skills).map((s, i) => (
              <motion.span key={i}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold cursor-default"
                style={{ background: c.gradientSoft, color: c.text, border: `1px solid ${c.border}`, backdropFilter: "blur(10px)" }}
                whileHover={{ scale: 1.08, boxShadow: `0 0 25px ${c.purple}25`, transition: { duration: 0.15 } }}
              >
                {s.name}
              </motion.span>
            ))}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Projects" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}>
                <div className="relative rounded-3xl overflow-hidden group"
                  style={{ backgroundColor: "rgba(12,12,30,0.8)", border: `1px solid ${c.border}` }}>
                  {p.imageUrl && (
                    <div className="overflow-hidden h-52 relative">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(7,7,20,0.95))" }} />
                    </div>
                  )}
                  <div className="p-7 relative">
                    {/* # Project number */}
                    <span className="absolute top-0 right-6 text-7xl font-extrabold opacity-[0.04] select-none" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.pink }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-bold" style={{ color: c.text }}>{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>{p.description}</p>
                    {p.techStack.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.techStack.map((t, j) => (
                          <span key={j} className="text-xs px-3 py-1 rounded-full" style={{ background: `${c.purple}15`, color: c.purple }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-5 flex gap-3">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold px-5 py-2 rounded-xl text-white transition-all hover:shadow-lg hover:scale-105"
                          style={{ background: c.gradient }}>
                          Live Demo →
                        </a>
                      )}
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:opacity-80"
                          style={{ color: c.purple, border: `1px solid ${c.purple}30` }}>
                          Source
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
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Education" />
          <div className="space-y-5">
            {section.entries.map((e, i) => (
              <GlassPanel key={i}>
                <h3 className="text-lg font-bold" style={{ color: c.text }}>{e.degree}</h3>
                <p className="text-sm font-medium mt-1" style={{ color: c.pink }}>{e.school}</p>
                {e.startDate && <p className="text-xs mt-1" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                {e.description && <p className="text-sm mt-3" style={{ color: c.muted }}>{e.description}</p>}
              </GlassPanel>
            ))}
          </div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Gallery" />
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {section.entries.map((g, i) => (
              <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden group break-inside-avoid"
                whileHover={{ scale: 1.02 }}>
                <div className="relative">
                  <img src={g.imageUrl} alt={g.title} className="w-full transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(180deg, transparent 30%, ${c.bg}dd)` }}>
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
          <SectionHeading title="Kind Words" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <GlassPanel key={i}>
                <div className="text-3xl mb-3" style={{ background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>"</div>
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                <div className="mt-5 pt-4 flex items-center gap-3" style={{ borderTop: `1px solid ${c.border}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: c.gradient }}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
                    <p className="text-xs" style={{ color: c.pink }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
          <SectionHeading title="Certifications" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.entries.map((cert, i) => (
              <GlassPanel key={i}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: c.gradientSoft, border: `1px solid ${c.border}` }}>
                    <span className="font-bold" style={{ color: c.purple }}>✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: c.text }}>{cert.name}</p>
                    <p className="text-xs" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-6xl mx-auto text-center">
          <SectionHeading title="Let's Create Together" />
          <p className="mb-10 text-lg" style={{ color: c.muted }}>Got an idea? Let's make something extraordinary.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {section.email && (
              <a href={`mailto:${section.email}`}
                className="px-8 py-3.5 rounded-2xl font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
                style={{ background: c.gradient, boxShadow: `0 4px 30px ${c.purple}25` }}>
                Say Hello
              </a>
            )}
            {section.calendarLink && (
              <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-2xl font-bold transition-all hover:scale-105"
                style={{ color: c.text, border: `1px solid ${c.border}`, backdropFilter: "blur(10px)", background: c.glass }}>
                Schedule a Call
              </a>
            )}
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

export default function CreativeTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i, arr) => (
          <div key={`${section.type}-${i}`}>
            {i > 0 && <div className="h-px max-w-6xl mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${c.border}, transparent)` }} />}
            {renderSection(section)}
          </div>
        ))}

      <footer className="py-10 text-center text-xs" style={{ color: c.muted }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.pink }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
