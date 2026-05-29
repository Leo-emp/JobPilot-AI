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

    /* # ─── EXPERIENCE — Premium cards with navy gradient left border, gold badges ─── */
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Professional Experience</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-6">
            {section.entries.map((e, i) => {
              /* # Unique navy gradient for each card's left border */
              const grad = NAVY_GRADIENTS[i % NAVY_GRADIENTS.length];
              return (
                <motion.div key={i} variants={staggerItem}>
                  <motion.div
                    className="relative rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: c.surface,
                      border: `1px solid ${c.border}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                    whileHover={{
                      y: -4,
                      boxShadow: `0 8px 30px rgba(0,0,0,0.08)`,
                      borderColor: `${c.gold}40`,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {/* # Navy gradient left border */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                      style={{ background: grad }} />

                    {/* # Subtle cream gradient fill */}
                    <div className="absolute inset-0 opacity-[0.4]"
                      style={{ background: `linear-gradient(135deg, ${c.cream}80, transparent 40%)` }} />

                    <div className="relative p-7 pl-8">
                      {/* # Company badge + gold date pill */}
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                        <div className="flex items-start gap-4">
                          {/* # Gradient company icon with gold diamond */}
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                            style={{ background: `linear-gradient(135deg, ${c.navy}, ${c.navyLight})` }}>
                            <span className="text-sm" style={{ color: c.gold }}>◆</span>
                          </div>
                          <div>
                            {/* # Large company name */}
                            <p className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>
                              {e.company}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                              <h3 className="text-sm font-medium" style={{ color: c.gold }}>
                                {e.title}{e.location ? ` — ${e.location}` : ""}
                              </h3>
                            </div>
                          </div>
                        </div>
                        {/* # Date range in gold pill badge */}
                        {(e.startDate || e.endDate) && (
                          <span className="text-xs font-semibold shrink-0 px-4 py-1.5 rounded-full"
                            style={{
                              background: `linear-gradient(135deg, ${c.gold}20, ${c.gold}10)`,
                              color: c.gold,
                              border: `1px solid ${c.gold}30`,
                            }}>
                            {e.startDate} — {e.endDate || "Present"}
                          </span>
                        )}
                      </div>

                      {/* # Achievements with gold accent markers */}
                      {e.achievements.length > 0 && (
                        <ul className="mt-5 space-y-3 ml-16">
                          {e.achievements.map((a, j) => (
                            <li key={j} className="text-sm flex items-start gap-3" style={{ color: c.text }}>
                              {/* # Gold diamond accent marker */}
                              <span className="shrink-0 mt-1 w-5 h-5 rounded flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${c.gold}20, ${c.gold}08)` }}>
                                <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                              </span>
                              <span className="leading-relaxed">{a}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </SectionWrapper>
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
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent opacity-40" />
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

    /* # ─── EDUCATION — Cards with gold-accented gradient header strip ─── */
    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-6">
            {section.entries.map((e, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderColor: `${c.gold}40`, transition: { duration: 0.2 } }}
              >
                {/* # Gold-accented gradient header strip */}
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${c.gold}, ${c.goldLight}, ${c.gold}30)` }} />

                <div className="p-7">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      {/* # Degree name large */}
                      <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>
                        {e.degree}
                      </h3>
                      {/* # School in accent color with diamond */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: c.gold }} />
                        <p className="text-sm font-medium" style={{ color: c.gold }}>{e.school}{e.location ? ` · ${e.location}` : ""}</p>
                      </div>
                    </div>
                    {/* # Year in a gradient gold badge */}
                    {(e.startDate || e.endDate) && (
                      <span className="text-xs font-semibold shrink-0 px-4 py-1.5 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${c.gold}20, ${c.gold}10)`,
                          color: c.gold,
                          border: `1px solid ${c.gold}30`,
                        }}>
                        {e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}
                      </span>
                    )}
                  </div>
                  {/* # Description in a subtle tinted box */}
                  {e.description && (
                    <div className="mt-4 px-4 py-3 rounded-lg" style={{ backgroundColor: c.cream }}>
                      <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{e.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    /* # ─── CERTIFICATIONS — Badge/shield-style cards with gradient fills ─── */
    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Certifications &amp; Licenses</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.entries.map((cert, i) => (
              <motion.div key={i}
                className="rounded-xl overflow-hidden relative"
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
                whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.06)", borderColor: `${c.gold}40`, transition: { duration: 0.2 } }}
              >
                {/* # Subtle gradient fill */}
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{ background: `linear-gradient(135deg, ${c.navy}, transparent)` }} />

                <div className="relative p-6 flex items-center gap-4">
                  {/* # Shield badge with gradient and gold checkmark glow */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${c.navy}, ${c.navyLight})`,
                      boxShadow: `0 4px 15px ${c.navy}30`,
                    }}>
                    <span className="text-lg font-bold"
                      style={{ color: c.gold, textShadow: `0 0 10px ${c.gold}60` }}>
                      ✓
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>
                      {cert.link ? (
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{cert.name}</a>
                      ) : cert.name}
                    </p>
                    {/* # Issuer and date as separate pill elements */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={{ background: `${c.gold}15`, color: c.gold }}>
                        {cert.issuer}
                      </span>
                      {cert.date && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: c.cream, color: c.muted }}>
                          {cert.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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

    /* # ─── GALLERY — Grid with hover zoom, gradient overlay, first featured ─── */
    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Portfolio Gallery</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.entries.map((g, i) => (
              <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className={`block rounded-xl overflow-hidden group relative ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                style={{ border: `1px solid ${c.border}` }}
                whileHover={{ y: -4, boxShadow: `0 8px 30px rgba(0,0,0,0.08)` }}>
                <div className="relative overflow-hidden">
                  <img src={g.imageUrl} alt={g.title}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${i === 0 ? "aspect-[4/3]" : "aspect-square"}`} />
                  {/* # Gradient overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                    style={{ background: `linear-gradient(to top, ${c.navy}cc, ${c.navy}40 40%, transparent 70%)` }}>
                    <div>
                      <p className="text-white text-sm font-bold">{g.title}</p>
                      {g.description && <p className="text-white/60 text-xs mt-1">{g.description}</p>}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
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
