"use client";

/* # Architect Template — Blueprint grid, clean structural lines, technical precision */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";

const c = {
  bg: "#0c1220",
  surface: "#111827",
  card: "#15202e",
  text: "#e2e8f0",
  muted: "#94a3b8",
  teal: "#2dd4bf",
  tealSoft: "#2dd4bf12",
  blue: "#38bdf8",
  border: "rgba(45, 212, 191, 0.1)",
  gridLine: "rgba(45, 212, 191, 0.06)",
  shadow: "0 4px 30px rgba(0,0,0,0.3)",
};

/* # Blueprint-style card with technical border */
function BlueprintCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
      whileHover={{ y: -3, boxShadow: `0 8px 30px rgba(45, 212, 191, 0.06)`, transition: { duration: 0.2 } }}
    >
      {/* # Corner markers — architectural detail */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: `${c.teal}30` }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: `${c.teal}30` }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: `${c.teal}30` }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: `${c.teal}30` }} />
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
      {/* # Blueprint grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(${c.gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${c.gridLine} 1px, transparent 1px),
          linear-gradient(${c.gridLine} 0.5px, transparent 0.5px),
          linear-gradient(90deg, ${c.gridLine} 0.5px, transparent 0.5px)
        `,
        backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
      }} />

      {/* # Teal ambient glow */}
      <motion.div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[200px]"
        style={{ background: `radial-gradient(circle, ${c.teal}08, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

      {/* # Decorative measurement line */}
      <div className="absolute top-16 left-8 bottom-16 w-px hidden lg:block" style={{ backgroundColor: `${c.teal}15` }}>
        <div className="absolute top-0 -left-1 w-2.5 h-px" style={{ backgroundColor: `${c.teal}30` }} />
        <div className="absolute bottom-0 -left-1 w-2.5 h-px" style={{ backgroundColor: `${c.teal}30` }} />
        <div className="absolute top-1/2 -translate-y-1/2 -left-8 -rotate-90 text-[10px] tracking-[0.3em] uppercase whitespace-nowrap"
          style={{ color: `${c.teal}30` }}>
          Portfolio
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          {avatarUrl && (
            <motion.div className="shrink-0 relative"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" as const }}>
              <div className="absolute -inset-3 rounded-xl" style={{ border: `1px solid ${c.teal}15` }} />
              <div className="absolute -inset-6 rounded-xl" style={{ border: `1px solid ${c.teal}08` }} />
              <img src={avatarUrl} alt={data.userName}
                className="relative w-36 h-36 rounded-xl object-cover"
                style={{ border: `2px solid ${c.teal}30` }} />
            </motion.div>
          )}
          <div>
            <motion.div className="flex items-center gap-3 mb-5"
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="w-8 h-px" style={{ backgroundColor: c.teal }} />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: c.teal }}>
                {data.tagline || "Architecture · Design · Vision"}
              </span>
            </motion.div>

            <motion.h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
              style={{ color: c.text }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              {data.title || data.userName}
            </motion.h1>

            {about && "bio" in about && about.bio && (
              <motion.p className="mt-8 text-base leading-relaxed max-w-2xl" style={{ color: c.muted }}
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                {about.bio}
              </motion.p>
            )}

            <motion.div className="mt-8"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.teal} iconSize={22} />}
            </motion.div>
          </div>
        </div>
      </div>

      {/* # Bottom measurement bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.teal}20, transparent)` }} />
    </motion.header>
  );
}

function SectionHeading({ title, label }: { title: string; label: string }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-2 h-2" style={{ backgroundColor: c.teal }} />
        <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: c.teal }}>{label}</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${c.teal}20, transparent)` }} />
      </div>
      <h2 className="text-3xl font-bold tracking-tight" style={{ color: c.text }}>{title}</h2>
    </div>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <SectionHeading title="Selected Works" label="Projects" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-12">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}>
                <div className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-stretch`}>
                  {/* # Large project image with blueprint overlay */}
                  <div className="w-full lg:w-3/5 relative rounded-xl overflow-hidden group" style={{ border: `1px solid ${c.border}` }}>
                    {p.imageUrl ? (
                      <>
                        <div className="aspect-[16/10] overflow-hidden">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        {/* # Blueprint overlay on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{ background: `linear-gradient(180deg, transparent 50%, ${c.bg}dd)`, mixBlendMode: "multiply" }} />
                      </>
                    ) : (
                      <div className="aspect-[16/10] flex items-center justify-center" style={{ backgroundColor: c.surface }}>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2" style={{
                            border: `1px solid ${c.teal}30`,
                            background: `linear-gradient(135deg, transparent 45%, ${c.teal}15 45%, ${c.teal}15 55%, transparent 55%)`,
                          }} />
                          <p className="text-xs" style={{ color: c.muted }}>Project Render</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* # Project details */}
                  <div className="w-full lg:w-2/5 flex flex-col justify-center">
                    <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: c.teal }}>
                      Project {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-bold mt-2" style={{ color: c.text }}>{p.title}</h3>
                    <div className="mt-1 w-10 h-px" style={{ backgroundColor: c.teal }} />
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: c.muted }}>{p.description}</p>
                    {p.techStack.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: c.teal }}>Materials & Methods</p>
                        <div className="flex flex-wrap gap-2">
                          {p.techStack.map((t, j) => (
                            <span key={j} className="text-xs px-3 py-1 rounded-md"
                              style={{ backgroundColor: c.tealSoft, color: c.teal, border: `1px solid ${c.teal}20` }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-6 flex gap-4">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
                          style={{ backgroundColor: c.teal, color: c.bg }}>
                          View Project →
                        </a>
                      )}
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:opacity-80"
                          style={{ color: c.teal, border: `1px solid ${c.teal}25` }}>
                          Details
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

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <SectionHeading title="Design Gallery" label="Renders & Drawings" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {section.entries.map((g, i) => (
              <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="group relative rounded-xl overflow-hidden"
                style={{ border: `1px solid ${c.border}` }}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-80" />
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(180deg, transparent 50%, ${c.bg}ee)` }}>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-sm">{g.title}</h3>
                    {g.description && <p className="text-white/60 text-xs mt-1">{g.description}</p>}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </SectionWrapper>
      );

    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Professional Experience" label="Career" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-6">
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem}>
                <BlueprintCard>
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                      <p className="text-sm font-medium mt-1" style={{ color: c.teal }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                    </div>
                    <span className="text-xs tracking-[0.15em] uppercase shrink-0 px-3 py-1.5 rounded-md self-start"
                      style={{ backgroundColor: c.tealSoft, color: c.teal }}>
                      {e.startDate} — {e.endDate || "Present"}
                    </span>
                  </div>
                  {e.achievements.length > 0 && (
                    <ul className="mt-5 space-y-2">
                      {e.achievements.map((a, j) => (
                        <li key={j} className="text-sm flex items-start gap-3" style={{ color: c.muted }}>
                          <span className="shrink-0 mt-1.5 w-1.5 h-1.5" style={{ backgroundColor: c.teal }} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </BlueprintCard>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "skills":
      if (section.groups.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Technical Skills" label="Expertise" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.groups.map((g, i) => (
              <BlueprintCard key={i}>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4" style={{ color: c.teal }}>{g.category}</h3>
                <div className="space-y-3">
                  {g.skills.map((s, j) => (
                    <div key={j}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm" style={{ color: c.text }}>{s.name}</span>
                        {s.proficiency && <span className="text-xs" style={{ color: c.muted }}>{s.proficiency}%</span>}
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${c.teal}10` }}>
                        <motion.div className="h-full rounded-full"
                          style={{ backgroundColor: c.teal }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.proficiency || 80}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.1 * j }} />
                      </div>
                    </div>
                  ))}
                </div>
              </BlueprintCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Education" label="Academic" />
          <div className="space-y-4">
            {section.entries.map((e, i) => (
              <BlueprintCard key={i}>
                <h3 className="text-lg font-bold" style={{ color: c.text }}>{e.degree}</h3>
                <p className="text-sm mt-0.5" style={{ color: c.teal }}>{e.school}</p>
                {e.startDate && <p className="text-xs mt-1" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                {e.description && <p className="text-sm mt-3 leading-relaxed" style={{ color: c.muted }}>{e.description}</p>}
              </BlueprintCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Licenses & Certifications" label="Credentials" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((cert, i) => (
              <BlueprintCard key={i}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2" style={{ backgroundColor: c.teal }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: c.text }}>{cert.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  </div>
                </div>
              </BlueprintCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Awards & Recognition" label="Honors" />
          <div className="space-y-4">
            {section.entries.map((a, i) => (
              <BlueprintCard key={i}>
                <h3 className="font-bold" style={{ color: c.text }}>{a.title}</h3>
                <p className="text-sm mt-0.5" style={{ color: c.teal }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                {a.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{a.description}</p>}
              </BlueprintCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Client Testimonials" label="Reviews" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <BlueprintCard key={i}>
                <div className="text-3xl mb-3" style={{ color: c.teal, opacity: 0.3 }}>"</div>
                <p className="text-sm italic leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
                  <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
                  <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? ` · ${t.company}` : ""}</p>
                </div>
              </BlueprintCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <div className="rounded-2xl p-12 text-center relative overflow-hidden" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
            {/* # Blueprint grid inside CTA */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `linear-gradient(${c.teal} 1px, transparent 1px), linear-gradient(90deg, ${c.teal} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="w-2 h-2" style={{ backgroundColor: c.teal }} />
                <span className="text-xs uppercase tracking-[0.2em]" style={{ color: c.teal }}>Contact</span>
              </div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: c.text }}>Let's Build Together</h2>
              <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: c.muted }}>
                Looking for an architect who brings vision and precision? Let's discuss your project.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {section.email && (
                  <a href={`mailto:${section.email}`}
                    className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:shadow-lg"
                    style={{ backgroundColor: c.teal, color: c.bg }}>
                    Start a Conversation
                  </a>
                )}
                {section.calendarLink && (
                  <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                    className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-80"
                    style={{ color: c.teal, border: `1px solid ${c.teal}25` }}>
                    Schedule Consultation
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

export default function ArchitectTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
        ))}

      <footer className="py-10 text-center text-xs" style={{ color: c.muted }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.teal }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
