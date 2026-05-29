"use client";

/* # Corporate Template — Luxury serif with navy/gold textures, diamond patterns, premium cards */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { autoCategorizeSkills } from "@/lib/skill-categories";

const c = {
  bg: "#faf8f4",
  surface: "#ffffff",
  navy: "#0f1b3d",
  navyLight: "#1a2850",
  gold: "#c8a96e",
  goldLight: "#d4bc8a",
  goldSoft: "#c8a96e12",
  text: "#2d2d3a",
  muted: "#6b6b7b",
  border: "#e8e4dc",
  cream: "#f5f1ea",
};

/* # Section heading with gold accent and diamond */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-14">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, transparent, ${c.gold})` }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: c.gold }} />
        <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, ${c.gold}, transparent)` }} />
      </div>
      <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>
        {children}
      </h2>
    </div>
  );
}

/* # Premium card with subtle gold border on hover */
function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`rounded-xl p-6 ${className}`}
      style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderColor: `${c.gold}40`, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: c.navy }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      {/* # Diamond pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23c8a96e' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }} />

      {/* # Gold gradient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[200px] opacity-10"
        style={{ background: c.gold }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-[0.06]"
        style={{ background: c.goldLight }} />

      {/* # Decorative corner lines */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t border-l opacity-20 hidden md:block" style={{ borderColor: c.gold }} />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r opacity-20 hidden md:block" style={{ borderColor: c.gold }} />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 md:px-12 text-center">
        {avatarUrl && (
          <motion.div className="relative mx-auto mb-10 w-36 h-36"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" as const }}>
            <div className="absolute -inset-1 rounded-full" style={{ background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`, opacity: 0.5 }} />
            <img src={avatarUrl} alt={data.userName} className="relative w-full h-full rounded-full object-cover" />
          </motion.div>
        )}

        {/* # Decorative gold line */}
        <motion.div className="w-12 h-0.5 mx-auto mb-8" style={{ backgroundColor: c.gold }}
          initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.3, duration: 0.6 }} />

        <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff" }}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          {data.title || data.userName}
        </motion.h1>

        {data.tagline && (
          <motion.p className="text-lg md:text-xl mt-5 font-light tracking-widest uppercase" style={{ color: c.gold, letterSpacing: "0.15em" }}
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            {data.tagline}
          </motion.p>
        )}

        {about && "bio" in about && about.bio && (
          <motion.p className="mt-8 text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            {about.bio}
          </motion.p>
        )}

        <motion.div className="mt-10"
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.gold} iconSize={22} />}
        </motion.div>
      </div>
    </motion.header>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Professional Experience</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem} className="mb-10 pb-10" style={{ borderBottom: `1px solid ${c.border}` }}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2">
                  <div>
                    <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{e.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                      <p className="text-sm font-medium" style={{ color: c.gold }}>{e.company}{e.location ? ` — ${e.location}` : ""}</p>
                    </div>
                  </div>
                  <span className="text-sm italic shrink-0" style={{ color: c.muted }}>{e.startDate} — {e.endDate || "Present"}</span>
                </div>
                {e.achievements.length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {e.achievements.map((a, j) => (
                      <li key={j} className="text-sm flex items-start gap-3" style={{ color: c.text }}>
                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.gold }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Core Competencies</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groups.map((g, i) => (
              <PremiumCard key={i}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: c.gold }}>{g.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s, j) => (
                    <span key={j} className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: c.cream, color: c.navy, border: `1px solid ${c.border}` }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </PremiumCard>
            ))}
          </div>
        </SectionWrapper>
      );
    }

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Key Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* # Featured first project — editorial full-width */}
            {section.entries.length > 0 && (() => {
              const p = section.entries[0];
              return (
                <motion.div variants={staggerItem} className="mb-10">
                  <PremiumCard className="!p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                      {p.imageUrl && (
                        <div className="lg:w-1/2 overflow-hidden relative group">
                          <img src={p.imageUrl} alt={p.title}
                            className="w-full h-64 lg:h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className={`p-8 flex flex-col justify-center ${p.imageUrl ? "lg:w-1/2" : "w-full"}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                          <span className="text-xs uppercase tracking-[0.15em] font-bold" style={{ color: c.gold }}>Featured</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{p.title}</h3>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: c.muted }}>{p.description}</p>
                        {p.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-5">
                            {p.techStack.map((t, j) => (
                              <span key={j} className="text-xs px-3 py-1 rounded-lg" style={{ backgroundColor: c.cream, color: c.navy, border: `1px solid ${c.border}` }}>{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-4 text-sm font-semibold">
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="px-6 py-2.5 rounded-lg transition-all hover:opacity-90"
                              style={{ backgroundColor: c.gold, color: c.navy }}>
                              View Project →
                            </a>
                          )}
                          {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-lg hover:underline" style={{ color: c.navy, border: `1px solid ${c.border}` }}>Repository</a>}
                        </div>
                      </div>
                    </div>
                  </PremiumCard>
                </motion.div>
              );
            })()}
            {/* # Remaining projects in grid */}
            {section.entries.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.entries.slice(1).map((p, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <PremiumCard className="!p-0 overflow-hidden h-full">
                      {p.imageUrl && (
                        <div className="overflow-hidden h-44 relative group">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent opacity-40" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-base font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{p.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.muted }}>{p.description}</p>
                        {p.techStack.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.techStack.slice(0, 4).map((t, j) => (
                              <span key={j} className="text-[11px] px-2 py-0.5 rounded" style={{ backgroundColor: c.cream, color: c.navy }}>{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 flex gap-4 text-sm font-medium">
                          {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.gold }}>View →</a>}
                          {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.navy }}>Repo</a>}
                        </div>
                      </div>
                    </PremiumCard>
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
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Education</SectionHeading>
          {section.entries.map((e, i) => (
            <div key={i} className="mb-8 pb-8" style={{ borderBottom: `1px solid ${c.border}` }}>
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{e.degree}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                <p className="text-sm font-medium" style={{ color: c.gold }}>{e.school}</p>
              </div>
              {e.startDate && <p className="text-xs italic mt-1" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
              {e.description && <p className="text-sm mt-3 leading-relaxed" style={{ color: c.muted }}>{e.description}</p>}
            </div>
          ))}
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Certifications & Licenses</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((cert, i) => (
              <PremiumCard key={i}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${c.navy}, ${c.navyLight})` }}>
                    <span className="text-sm" style={{ color: c.gold }}>◆</span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: c.navy }}>{cert.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Publications</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((pub, i) => (
              <PremiumCard key={i}>
                <h3 className="font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{pub.title}</h3>
                <p className="text-sm mt-1" style={{ color: c.muted }}>{pub.venue}{pub.date ? ` · ${pub.date}` : ""}</p>
                {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-2 inline-block hover:underline" style={{ color: c.gold }}>Read Publication →</a>}
              </PremiumCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Awards & Honors</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((a, i) => (
              <PremiumCard key={i}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0" style={{ color: c.gold }}>★</span>
                  <div>
                    <h3 className="font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{a.title}</h3>
                    <p className="text-sm" style={{ color: c.muted }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                    {a.description && <p className="text-sm mt-2" style={{ color: c.text }}>{a.description}</p>}
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Portfolio Gallery</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.entries.map((g, i) => (
              <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden group"
                style={{ border: `1px solid ${c.border}` }}
                whileHover={{ y: -4, boxShadow: `0 8px 30px rgba(0,0,0,0.08)` }}>
                <div className="relative overflow-hidden">
                  <img src={g.imageUrl} alt={g.title} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-sm font-medium">{g.title}</p>
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
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Client Testimonials</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <PremiumCard key={i}>
                <span className="text-5xl leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.gold, opacity: 0.3 }}>"</span>
                <p className="text-sm italic leading-relaxed mt-2" style={{ color: c.text }}>{t.quote}</p>
                <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
                  <p className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{t.author}</p>
                  <p className="text-xs" style={{ color: c.gold }}>{t.role}{t.company ? `, ${t.company}` : ""}</p>
                </div>
              </PremiumCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <div className="rounded-2xl p-12 text-center relative overflow-hidden" style={{ backgroundColor: c.navy }}>
            {/* # Diamond pattern inside CTA */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23c8a96e' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
              }} />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-12" style={{ backgroundColor: `${c.gold}40` }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: c.gold }} />
                <div className="h-px w-12" style={{ backgroundColor: `${c.gold}40` }} />
              </div>
              <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff" }}>Get in Touch</h2>
              <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>I'd love to discuss how we can work together.</p>
              <div className="flex flex-wrap justify-center gap-4">
                {section.email && (
                  <a href={`mailto:${section.email}`}
                    className="px-8 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ backgroundColor: c.gold, color: c.navy }}>
                    Send Email
                  </a>
                )}
                {section.calendarLink && (
                  <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                    className="px-8 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all hover:opacity-90"
                    style={{ color: c.gold, border: `1px solid ${c.gold}40` }}>
                    Schedule Meeting
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

export default function CorporateTemplate({ data }: { data: PortfolioData }) {
  const visibleSections = data.sections.filter((s) => s.visible && s.type !== "about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />

      <StatsBar data={data} variant="editorial" colors={{
        bg: c.cream, text: c.navy, accent: c.gold, muted: c.muted, border: c.border,
      }} />

      {visibleSections.map((section, i) => (
        <div key={`${section.type}-${i}`}>
          <SectionDivider variant="diamond" color={c.gold} />
          {renderSection(section)}
        </div>
      ))}

      <SectionDivider variant="diamond" color={c.gold} />
      <footer className="py-16 text-center text-xs" style={{ color: c.muted }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.gold }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
