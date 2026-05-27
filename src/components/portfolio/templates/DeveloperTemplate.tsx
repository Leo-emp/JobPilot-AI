"use client";

/* ============================================================
   DEVELOPER TEMPLATE — Dark terminal aesthetic, code vibes
   ============================================================
   Font: JetBrains Mono for headings, Inter for body
   Colors: Dark #0a0a0f, green terminal accents #00ff88
   Hero: Terminal prompt aesthetic with blinking cursor
   ============================================================ */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { SkillBar } from "../shared/SkillBar";

const colors = {
  bg: "#0a0a0f",
  surface: "#12121a",
  card: "#1a1a25",
  text: "#e4e4e7",
  muted: "#71717a",
  green: "#00ff88",
  cyan: "#22d3ee",
  border: "#27272a",
  comment: "#6b7280",
};

/* ---- Blinking cursor ---- */
function Cursor() {
  return (
    <motion.span
      className="inline-block w-3 h-6 ml-1 align-middle"
      style={{ backgroundColor: colors.green }}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

/* ---- Terminal prompt prefix ---- */
function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <span>
      <span style={{ color: colors.cyan }}>~</span>
      <span style={{ color: colors.muted }}>/</span>
      <span style={{ color: colors.green }}>{children}</span>
      <span style={{ color: colors.muted }}> $</span>
    </span>
  );
}

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="min-h-[80vh] flex items-center px-6 md:px-12"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
          {avatarUrl && (
            <img src={avatarUrl} alt={data.userName}
              className="w-32 h-32 rounded-2xl object-cover"
              style={{ border: `2px solid ${colors.green}`, boxShadow: `0 0 30px ${colors.green}20` }} />
          )}
          <div>
            {/* # Terminal-style greeting */}
            <div className="text-sm font-mono mb-4" style={{ color: colors.comment }}>
              {"// "}{data.tagline || "Welcome to my portfolio"}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight" style={{ color: colors.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
              {data.title || data.userName}
            </h1>
            <div className="mt-4 font-mono text-lg" style={{ color: colors.green }}>
              <Prompt>portfolio</Prompt>
              <span className="ml-2" style={{ color: colors.text }}>cat about.txt</span>
              <Cursor />
            </div>
            {about && "bio" in about && about.bio && (
              <p className="mt-6 text-lg leading-relaxed max-w-2xl" style={{ color: colors.muted }}>{about.bio}</p>
            )}
            <div className="mt-8">
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={colors.green} iconSize={22} />}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function SectionHeader({ title, slug }: { title: string; slug: string }) {
  return (
    <div className="mb-8 font-mono">
      <span style={{ color: colors.comment }}>{"// "}</span>
      <span style={{ color: colors.green }}>{slug}</span>
      <h2 className="text-2xl font-bold mt-2" style={{ color: colors.text, fontFamily: "'JetBrains Mono', monospace" }}>
        {title}
      </h2>
    </div>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeader title="Experience" slug="work" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem} className="mb-8 rounded-xl p-6"
                style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h3 className="text-lg font-bold font-mono" style={{ color: colors.text }}>{e.title}</h3>
                    <p className="text-sm" style={{ color: colors.cyan }}>{e.company}</p>
                  </div>
                  <span className="text-xs font-mono mt-1 md:mt-0 px-2 py-1 rounded" style={{ backgroundColor: colors.surface, color: colors.muted }}>
                    {e.startDate} → {e.endDate || "Present"}
                  </span>
                </div>
                {e.achievements.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {e.achievements.map((a, j) => (
                      <li key={j} className="text-sm flex items-start gap-2" style={{ color: colors.muted }}>
                        <span style={{ color: colors.green }} className="font-mono shrink-0">→</span> {a}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "skills":
      if (section.groups.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeader title="Tech Stack" slug="skills" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.groups.map((g, i) => (
              <div key={i} className="rounded-xl p-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
                <h3 className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: colors.green }}>{g.category}</h3>
                {g.skills.map((s, j) => (
                  <SkillBar key={j} name={s.name} proficiency={s.proficiency || 80}
                    color={colors.green} bgColor={colors.surface} textColor={colors.text} />
                ))}
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeader title="Projects" slug="projects" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem} className="rounded-xl overflow-hidden group"
                style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
                {p.imageUrl && (
                  <div className="overflow-hidden h-44">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold font-mono" style={{ color: colors.text }}>{p.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: colors.muted }}>{p.description}</p>
                  {p.techStack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.techStack.map((t, j) => (
                        <span key={j} className="text-xs font-mono px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${colors.green}15`, color: colors.green, border: `1px solid ${colors.green}30` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-4 font-mono text-sm">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: colors.green }}>demo →</a>}
                    {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: colors.cyan }}>repo →</a>}
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
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeader title="Education" slug="education" />
          {section.entries.map((e, i) => (
            <div key={i} className="mb-4 rounded-xl p-5" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
              <h3 className="font-bold" style={{ color: colors.text }}>{e.degree}</h3>
              <p className="text-sm" style={{ color: colors.cyan }}>{e.school} {e.startDate && `· ${e.startDate} — ${e.endDate}`}</p>
            </div>
          ))}
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeader title="Certifications" slug="certs" />
          <div className="space-y-3">
            {section.entries.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-4" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
                <span className="font-mono text-lg" style={{ color: colors.green }}>✓</span>
                <div>
                  <p className="font-medium" style={{ color: colors.text }}>{c.name}</p>
                  <p className="text-xs" style={{ color: colors.muted }}>{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeader title="Contact" slug="contact" />
          <div className="rounded-xl p-8 font-mono" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
            {section.email && <p className="mb-2"><span style={{ color: colors.comment }}>email:</span> <a href={`mailto:${section.email}`} style={{ color: colors.green }} className="hover:underline">{section.email}</a></p>}
            {section.phone && <p className="mb-2"><span style={{ color: colors.comment }}>phone:</span> <span style={{ color: colors.text }}>{section.phone}</span></p>}
            {section.location && <p className="mb-2"><span style={{ color: colors.comment }}>location:</span> <span style={{ color: colors.text }}>{section.location}</span></p>}
            {section.calendarLink && <p><span style={{ color: colors.comment }}>calendar:</span> <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" style={{ color: colors.cyan }} className="hover:underline">Book a meeting →</a></p>}
          </div>
        </SectionWrapper>
      );
    }

    default:
      return null;
  }
}

export default function DeveloperTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* # Subtle grid background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(${colors.green} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />

      <div className="relative z-10">
        <Hero data={data} />
        {data.sections
          .filter((s) => s.visible && s.type !== "about")
          .map((section, i) => (
            <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
          ))}

        <footer className="py-8 text-center font-mono text-xs" style={{ color: colors.comment }}>
          {"// "} Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: colors.green }}>JobPilot AI</a>
        </footer>
      </div>
    </div>
  );
}
