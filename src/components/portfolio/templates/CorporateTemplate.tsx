"use client";

/* # Corporate Template — Luxury serif landing page with navy/gold, premium visual cards */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { autoCategorizeSkills } from "@/lib/skill-categories";

const c = {
  bg: "#f5f1ea",
  surface: "#eee9df",
  navy: "#0f1b3d",
  navyLight: "#1a2850",
  gold: "#c8a96e",
  goldLight: "#d4bc8a",
  goldSoft: "#c8a96e12",
  text: "#2d2d3a",
  muted: "#6b6b7b",
  border: "#e8e4dc",
  cream: "#ebe5da",
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

/* # Navy gradient border colors for each experience entry */
const NAVY_GRADIENTS = [
  `linear-gradient(180deg, ${c.navy}, #2a3f6f)`,
  `linear-gradient(180deg, #1a2850, #3a5080)`,
  `linear-gradient(180deg, #0f1b3d, #2e4a7a)`,
  `linear-gradient(180deg, #162547, #1a3a6e)`,
  `linear-gradient(180deg, #0d1a38, #243b68)`,
];

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

    /* # ─── EXPERIENCE — Full-width alternating case-study blocks, not resume cards ─── */
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <div>
          <div className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
            <SectionHeading>Professional Experience</SectionHeading>
          </div>
          {section.entries.map((e, i) => {
            const isNavy = i % 2 === 0;
            return (
              <motion.div key={i}
                className="relative overflow-hidden"
                style={{ backgroundColor: isNavy ? c.navy : c.cream }}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* # Decorative diamond pattern for navy blocks */}
                {isNavy && (
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23c8a96e' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: "40px 40px",
                  }} />
                )}

                {/* # Ambient gold glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.05]"
                  style={{ background: c.gold }} />

                <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-28">
                  <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* # Left column — Company & role as large editorial block */}
                    <div className="lg:w-2/5 flex flex-col justify-center">
                      {/* # Gold decorative line */}
                      <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: c.gold }} />

                      {/* # Company as oversized serif heading */}
                      <h3 className="text-4xl md:text-5xl font-bold leading-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: isNavy ? "#ffffff" : c.navy }}>
                        {e.company}
                      </h3>

                      {/* # Role with gold diamond */}
                      <div className="flex items-center gap-3 mt-4">
                        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: c.gold }} />
                        <p className="text-base font-medium tracking-wide" style={{ color: c.gold }}>
                          {e.title}
                        </p>
                      </div>

                      {/* # Location & dates */}
                      {e.location && (
                        <p className="text-sm mt-3" style={{ color: isNavy ? "rgba(255,255,255,0.5)" : c.muted }}>
                          {e.location}
                        </p>
                      )}

                      {/* # Date as prominent gold-bordered block */}
                      {(e.startDate || e.endDate) && (
                        <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-lg"
                          style={{
                            border: `1px solid ${isNavy ? c.gold + "40" : c.gold + "30"}`,
                            backgroundColor: isNavy ? "rgba(200,169,110,0.08)" : `${c.gold}08`,
                          }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.gold }} />
                          <span className="text-sm font-semibold tracking-wider uppercase"
                            style={{ color: c.gold, letterSpacing: "0.1em" }}>
                            {e.startDate} — {e.endDate || "Present"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* # Right column — Achievements as impact metric cards */}
                    <div className="lg:w-3/5">
                      {e.description && (
                        <p className="text-base leading-relaxed mb-8"
                          style={{ color: isNavy ? "rgba(255,255,255,0.7)" : c.text }}>
                          {e.description}
                        </p>
                      )}

                      {e.achievements.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {e.achievements.map((a, j) => (
                            <motion.div key={j}
                              className="rounded-xl p-5 relative overflow-hidden"
                              style={{
                                backgroundColor: isNavy ? "rgba(255,255,255,0.04)" : c.surface,
                                border: `1px solid ${isNavy ? "rgba(200,169,110,0.15)" : c.border}`,
                              }}
                              whileHover={{
                                y: -2,
                                borderColor: `${c.gold}40`,
                                backgroundColor: isNavy ? "rgba(255,255,255,0.07)" : `${c.gold}04`,
                              }}
                            >
                              {/* # Gold accent top line */}
                              <div className="absolute top-0 left-0 right-0 h-0.5"
                                style={{ background: `linear-gradient(90deg, ${c.gold}${j % 2 === 0 ? "60" : "30"}, transparent)` }} />

                              {/* # Gold numbered badge */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
                                  style={{
                                    background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`,
                                    color: isNavy ? c.navy : "#ffffff",
                                  }}>
                                  {String(j + 1).padStart(2, "0")}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed"
                                style={{ color: isNavy ? "rgba(255,255,255,0.75)" : c.text }}>
                                {a}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      );

    /* # ─── SKILLS — Unchanged premium layout ─── */
    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Core Competencies</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groups.map((g, i) => (
              <motion.div key={i}
                className="rounded-xl p-6"
                style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderColor: `${c.gold}40`, transition: { duration: 0.2 } }}
              >
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
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );
    }

    /* # ─── PROJECTS — Featured first (full-width) + gradient-bordered cards ─── */
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Key Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* # Featured first project — editorial full-width with image + text side by side */}
            {section.entries.length > 0 && (() => {
              const p = section.entries[0];
              return (
                <motion.div variants={staggerItem} className="mb-10">
                  <motion.div className="rounded-xl overflow-hidden"
                    style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                    whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderColor: `${c.gold}40` }}>
                    <div className="flex flex-col lg:flex-row">
                      {p.imageUrl && (
                        <div className="lg:w-1/2 overflow-hidden relative group">
                          <img src={p.imageUrl} alt={p.title}
                            className="w-full h-64 lg:h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          {/* # Gold gradient overlay on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: `linear-gradient(135deg, ${c.gold}20, transparent)` }} />
                        </div>
                      )}
                      <div className={`p-8 flex flex-col justify-center ${p.imageUrl ? "lg:w-1/2" : "w-full"}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                          <span className="text-xs uppercase tracking-[0.15em] font-bold" style={{ color: c.gold }}>Featured</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{p.title}</h3>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: c.muted }}>{p.description}</p>
                        {/* # Tech stack as accent-colored pills */}
                        {p.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-5">
                            {p.techStack.map((t, j) => (
                              <span key={j} className="text-xs px-3 py-1 rounded-lg font-medium"
                                style={{
                                  background: `linear-gradient(135deg, ${c.gold}15, ${c.gold}08)`,
                                  color: c.navy,
                                  border: `1px solid ${c.gold}25`,
                                }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* # Gradient CTA button */}
                        <div className="flex gap-4 text-sm font-semibold">
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="px-6 py-2.5 rounded-lg transition-all hover:opacity-90 hover:shadow-lg"
                              style={{ background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`, color: c.navy }}>
                              View Project →
                            </a>
                          )}
                          {p.repoUrl && (
                            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                              className="px-6 py-2.5 rounded-lg hover:underline"
                              style={{ color: c.navy, border: `1px solid ${c.border}` }}>
                              Repository
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.entries.slice(1).map((p, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <motion.div className="rounded-xl overflow-hidden h-full relative"
                      style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderColor: `${c.gold}40` }}>
                      {/* # Gold gradient top border */}
                      <div className="h-1" style={{ background: `linear-gradient(90deg, ${c.gold}, ${c.goldLight}, transparent)` }} />
                      {p.imageUrl && (
                        <div className="overflow-hidden h-44 relative group">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#eee9df] via-transparent opacity-40" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-base font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{p.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: c.muted }}>{p.description}</p>
                        {p.techStack.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.techStack.slice(0, 4).map((t, j) => (
                              <span key={j} className="text-[11px] px-2.5 py-0.5 rounded font-medium"
                                style={{ background: `${c.gold}10`, color: c.navy }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 flex gap-4 text-sm font-semibold">
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="px-4 py-1.5 rounded-lg text-white transition-all hover:shadow-md"
                              style={{ background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`, color: c.navy }}>
                              View →
                            </a>
                          )}
                          {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline px-4 py-1.5" style={{ color: c.navy }}>Repo</a>}
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

    /* # ─── EDUCATION — Side-by-side premium institution showcase on navy ─── */
    case "education":
      if (section.entries.length === 0) return null;
      return (
        <div className="relative overflow-hidden" style={{ backgroundColor: c.navy }}>
          {/* # Diamond pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23c8a96e' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }} />
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[200px] opacity-[0.05]"
            style={{ background: c.gold }} />

          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-24">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, transparent, ${c.gold})` }} />
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: c.gold }} />
                <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, ${c.gold}, transparent)` }} />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff" }}>
                Education
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.entries.map((e, i) => (
                <motion.div key={i}
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${c.gold}20`,
                  }}
                  whileHover={{ y: -4, borderColor: `${c.gold}50`, transition: { duration: 0.25 } }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                >
                  {/* # Large gold gradient header area with year */}
                  <div className="relative px-8 pt-10 pb-8 text-center"
                    style={{ background: `linear-gradient(180deg, rgba(200,169,110,0.12), transparent)` }}>
                    {/* # Oversized year display */}
                    {e.endDate && (
                      <div className="text-7xl font-bold opacity-[0.12] absolute top-4 right-6"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.gold }}>
                        {e.endDate.slice(-4)}
                      </div>
                    )}
                    {/* # Shield/crest icon area */}
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`,
                        boxShadow: `0 8px 25px ${c.gold}30`,
                      }}>
                      <span className="text-2xl font-bold" style={{ color: c.navy }}>
                        {e.school?.charAt(0) || "U"}
                      </span>
                    </div>

                    {/* # Institution name large */}
                    <h3 className="text-2xl font-bold leading-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff" }}>
                      {e.school}
                    </h3>
                    {e.location && (
                      <p className="text-xs mt-2 tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>
                        {e.location}
                      </p>
                    )}
                  </div>

                  {/* # Degree and details below */}
                  <div className="px-8 pb-8">
                    {/* # Gold divider */}
                    <div className="w-full h-px mb-6" style={{ background: `linear-gradient(90deg, transparent, ${c.gold}30, transparent)` }} />

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                      <p className="text-base font-semibold" style={{ color: c.gold }}>{e.degree}</p>
                    </div>

                    {(e.startDate || e.endDate) && (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                        style={{ backgroundColor: `${c.gold}10`, border: `1px solid ${c.gold}20` }}>
                        <span className="text-xs font-semibold" style={{ color: c.gold }}>
                          {e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}
                        </span>
                      </div>
                    )}

                    {e.description && (
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {e.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );

    /* # ─── CERTIFICATIONS — Premium certificate-style cards with gold seal visuals ─── */
    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Certifications &amp; Credentials</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((cert, i) => (
              <motion.div key={i}
                className="relative rounded-2xl overflow-hidden text-center"
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
                whileHover={{ y: -5, boxShadow: `0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px ${c.gold}30`, transition: { duration: 0.25 } }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                {/* # Decorative gold border top */}
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, transparent, ${c.gold}, transparent)` }} />

                {/* # Subtle radial gold glow background */}
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ background: `radial-gradient(circle at center top, ${c.gold}, transparent 60%)` }} />

                <div className="relative px-8 py-10">
                  {/* # Large gold seal/badge icon */}
                  <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`,
                      boxShadow: `0 8px 30px ${c.gold}25`,
                    }}>
                    {/* # Inner ring */}
                    <div className="absolute inset-1.5 rounded-full"
                      style={{ border: `2px solid ${c.navy}30` }} />
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={c.navy} strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>

                  {/* # Certification name — large serif */}
                  <h3 className="text-lg font-bold leading-snug mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>
                    {cert.link ? (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{cert.name}</a>
                    ) : cert.name}
                  </h3>

                  {/* # Gold divider */}
                  <div className="w-10 h-px mx-auto my-4" style={{ backgroundColor: c.gold }} />

                  {/* # Issuer as prominent text */}
                  <p className="text-sm font-semibold tracking-wide" style={{ color: c.gold }}>
                    {cert.issuer}
                  </p>

                  {/* # Date as styled badge */}
                  {cert.date && (
                    <div className="mt-4 inline-flex items-center px-5 py-2 rounded-full"
                      style={{
                        backgroundColor: `${c.gold}08`,
                        border: `1px solid ${c.gold}20`,
                      }}>
                      <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: c.gold, letterSpacing: "0.12em" }}>
                        Issued {cert.date}
                      </span>
                    </div>
                  )}
                </div>

                {/* # Bottom decorative gold border */}
                <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${c.gold}40, transparent)` }} />
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── PUBLICATIONS — Numbered citation cards with gradient accent border ─── */
    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Publications</SectionHeading>
          <div className="space-y-5">
            {section.entries.map((pub, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden relative"
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderColor: `${c.gold}40`, transition: { duration: 0.2 } }}
              >
                {/* # Navy gradient accent left border */}
                <div className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: `linear-gradient(180deg, ${c.navy}, ${c.navy}60)` }} />

                <div className="relative p-6 pl-7 flex items-start gap-4">
                  {/* # Large colored number badge */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold shadow-md"
                    style={{ background: `linear-gradient(135deg, ${c.navy}, ${c.navyLight})`, color: c.gold }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>
                      {pub.title}
                    </h3>
                    {/* # Venue in a colored tag/pill */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {pub.venue && (
                        <span className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            background: `linear-gradient(135deg, ${c.gold}15, ${c.gold}08)`,
                            color: c.gold,
                            border: `1px solid ${c.gold}20`,
                          }}>
                          {pub.venue}
                        </span>
                      )}
                      {pub.date && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: c.cream, color: c.muted }}>
                          {pub.date}
                        </span>
                      )}
                    </div>
                    {pub.link && (
                      <a href={pub.link} target="_blank" rel="noopener noreferrer"
                        className="text-sm mt-3 inline-block font-medium hover:underline"
                        style={{ color: c.gold }}>
                        Read Publication →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── AWARDS — Cards with gold gradient accent fills ─── */
    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Awards &amp; Honors</SectionHeading>
          <div className="space-y-5">
            {section.entries.map((a, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden relative"
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderColor: `${c.gold}40`, transition: { duration: 0.2 } }}
              >
                {/* # Gold gradient accent left border */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                  style={{ background: `linear-gradient(180deg, ${c.gold}, ${c.goldLight})` }} />

                {/* # Subtle gold gradient fill */}
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{ background: `linear-gradient(135deg, ${c.gold}, transparent 50%)` }} />

                <div className="relative p-7 pl-8">
                  <div className="flex items-start gap-4">
                    {/* # Gold trophy/star badge */}
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`,
                        boxShadow: `0 4px 12px ${c.gold}30`,
                      }}>
                      <span className="text-white text-lg">★</span>
                    </div>
                    <div className="flex-1">
                      {/* # Award title prominent */}
                      <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>
                        {a.title}
                      </h3>
                      {/* # Issuer as colored subtitle */}
                      <p className="text-sm font-medium mt-0.5" style={{ color: c.gold }}>
                        {a.issuer}{a.date ? ` · ${a.date}` : ""}
                      </p>
                    </div>
                  </div>
                  {/* # Description in a tinted box */}
                  {a.description && (
                    <div className="mt-4 ml-15 px-4 py-3 rounded-lg" style={{ backgroundColor: `${c.gold}08` }}>
                      <p className="text-sm leading-relaxed" style={{ color: c.text }}>{a.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── GALLERY — Editorial bento grid with varying sizes and video support ─── */
    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Portfolio Gallery</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[200px] gap-4">
            {section.entries.map((g, i) => {
              const isVideo = Boolean(g.videoUrl && g.videoUrl.trim().length > 0);
              /* # Bento layout: hero → square → tall → wide → square → wide panorama */
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
                  className={`block rounded-xl overflow-hidden group relative ${bentoClass}`}
                  style={{ border: `1px solid ${c.border}` }}
                  whileHover={{ y: -4, boxShadow: `0 8px 30px rgba(0,0,0,0.08)` }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="relative overflow-hidden w-full h-full">
                    <img src={g.imageUrl} alt={g.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                    {/* # Video play button */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${c.navy}cc`, boxShadow: `0 0 30px ${c.gold}30` }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill={c.gold}><polygon points="8,5 20,12 8,19" /></svg>
                        </div>
                      </div>
                    )}

                    {/* # Featured badge */}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md"
                        style={{ backgroundColor: `${c.navy}80`, border: `1px solid ${c.gold}40` }}>
                        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                        <span className="text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: c.gold }}>Featured</span>
                      </div>
                    )}

                    {/* # Category badge */}
                    {g.category && i !== 0 && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                        style={{ backgroundColor: `${c.navy}60`, color: c.gold }}>
                        {g.category}
                      </div>
                    )}

                    {/* # Navy gradient overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5"
                      style={{ background: `linear-gradient(to top, ${c.navy}ee, ${c.navy}50 40%, transparent 70%)` }}>
                      <div>
                        <p className="text-sm font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.gold }}>{g.title}</p>
                        {g.description && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{g.description}</p>}
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </SectionWrapper>
      );

    /* # ─── TESTIMONIALS — Frosted cards with large decorative gradient quote marks ─── */
    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Client Testimonials</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden relative"
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderColor: `${c.gold}40`, transition: { duration: 0.2 } }}
              >
                {/* # Gradient border at top */}
                <div className="h-1" style={{ background: `linear-gradient(90deg, ${c.gold}, ${c.goldLight}, transparent)` }} />

                {/* # Subtle frosted gold background */}
                <div className="absolute inset-0 opacity-[0.02]"
                  style={{ background: `linear-gradient(135deg, ${c.gold}, transparent)` }} />

                <div className="relative p-6">
                  {/* # Large decorative gradient quote marks */}
                  <div className="text-6xl font-bold leading-none mb-3"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      opacity: 0.35,
                    }}>
                    {"“"}
                  </div>

                  {/* # Quote in a frosted tinted card */}
                  <div className="px-4 py-3 rounded-lg mb-5" style={{ backgroundColor: `${c.gold}06` }}>
                    <p className="text-sm italic leading-relaxed" style={{ color: c.text }}>{t.quote}</p>
                  </div>

                  {/* # Author with colored avatar circle and accent separator */}
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop: `2px solid ${c.gold}15` }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${c.navy}, ${c.navyLight})`,
                        color: c.gold,
                        boxShadow: `0 3px 10px ${c.navy}30`,
                      }}>
                      {t.author.charAt(0)}
                    </div>
                    {/* # Gold accent separator */}
                    <div className="w-0.5 h-8 rounded-full" style={{ backgroundColor: `${c.gold}25` }} />
                    <div>
                      <p className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{t.author}</p>
                      <p className="text-xs" style={{ color: c.gold }}>{t.role}{t.company ? `, ${t.company}` : ""}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── CONTACT — Full-width navy background CTA with gold accents ─── */
    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-0">
          <div className="py-20 px-6 md:px-12 relative overflow-hidden" style={{ backgroundColor: c.navy }}>
            {/* # Diamond pattern inside CTA */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23c8a96e' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
              }} />
            {/* # Gold ambient glow */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.06]"
              style={{ background: c.gold }} />

            <div className="relative z-10 max-w-5xl mx-auto">
              {/* # Large heading with diamond accents */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-12" style={{ backgroundColor: `${c.gold}40` }} />
                  <div className="w-2 h-2 rotate-45" style={{ backgroundColor: c.gold }} />
                  <div className="h-px w-12" style={{ backgroundColor: `${c.gold}40` }} />
                </div>
                <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff" }}>
                  Get in Touch
                </h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  I&apos;d love to discuss how we can work together.
                </p>
              </div>

              {/* # Contact items in styled cards on navy background */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {section.email && (
                  <motion.a href={`mailto:${section.email}`}
                    className="flex items-center gap-4 p-5 rounded-xl group"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: `1px solid ${c.gold}20`,
                    }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: `${c.gold}40` }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.gold}30, ${c.gold}15)` }}>
                      <span className="text-lg" style={{ color: c.gold }}>✉</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.gold }}>Email</p>
                      <p className="text-sm font-bold mt-0.5 text-white">{section.email}</p>
                    </div>
                  </motion.a>
                )}
                {section.phone && (
                  <motion.a href={`tel:${section.phone}`}
                    className="flex items-center gap-4 p-5 rounded-xl group"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: `1px solid ${c.gold}20`,
                    }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: `${c.gold}40` }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.gold}30, ${c.gold}15)` }}>
                      <span className="text-lg" style={{ color: c.gold }}>☎</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.gold }}>Phone</p>
                      <p className="text-sm font-bold mt-0.5 text-white">{section.phone}</p>
                    </div>
                  </motion.a>
                )}
                {section.location && (
                  <motion.div
                    className="flex items-center gap-4 p-5 rounded-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: `1px solid ${c.gold}20`,
                    }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: `${c.gold}40` }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.gold}30, ${c.gold}15)` }}>
                      <span className="text-lg" style={{ color: c.gold }}>⌘</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.gold }}>Location</p>
                      <p className="text-sm font-bold mt-0.5 text-white">{section.location}</p>
                    </div>
                  </motion.div>
                )}
                {section.calendarLink && (
                  <motion.a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-xl group"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: `1px solid ${c.gold}20`,
                    }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: `${c.gold}40` }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.gold}30, ${c.gold}15)` }}>
                      <span className="text-lg" style={{ color: c.gold }}>{"📅"}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.gold }}>Schedule</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: c.gold }}>Book a meeting →</p>
                    </div>
                  </motion.a>
                )}
              </div>

              {/* # Prominent gradient gold CTA button */}
              <div className="text-center mb-6">
                {section.email && (
                  <a href={`mailto:${section.email}`}
                    className="inline-flex items-center px-10 py-3.5 rounded-lg font-bold text-sm tracking-wide transition-all hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`,
                      color: c.navy,
                      boxShadow: `0 4px 20px ${c.gold}40`,
                    }}>
                    Send Email →
                  </a>
                )}
              </div>

              {/* # Social links with colored hover */}
              {section.socialLinks && Object.keys(section.socialLinks).length > 0 && (
                <div className="text-center pt-6" style={{ borderTop: `1px solid ${c.gold}15` }}>
                  <SocialIcons links={section.socialLinks} color={c.gold} />
                </div>
              )}
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
