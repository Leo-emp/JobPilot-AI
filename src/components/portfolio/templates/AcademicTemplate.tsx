"use client";

/* # Academic Template — Scholarly paper with elegant citations, warm typography, refined layout */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";

const c = {
  bg: "#fefcf7",
  surface: "#faf7f0",
  card: "#ffffff",
  text: "#3d2c1e",
  muted: "#7a6b5d",
  accent: "#4a6fa5",
  accentDark: "#365280",
  accentSoft: "#4a6fa510",
  border: "#e6dfd4",
  heading: "#1c1008",
  gold: "#b8945e",
};

function SectionHeading({ children, number }: { children: React.ReactNode; number?: number }) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-4">
        {number !== undefined && (
          <span className="text-5xl font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.border }}>
            {String(number).padStart(2, "0")}
          </span>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
            {children}
          </h2>
          <div className="mt-3 h-px" style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.border} 50%, transparent)` }} />
        </div>
      </div>
    </div>
  );
}

/* # Decorative initial cap for the about bio */
function InitialCap({ text }: { text: string }) {
  if (!text) return null;
  const firstChar = text.charAt(0);
  const rest = text.slice(1);
  return (
    <p className="text-base leading-relaxed" style={{ color: c.muted }}>
      <span className="float-left text-5xl font-bold mr-3 mt-1 leading-none" style={{ fontFamily: "'Lora', Georgia, serif", color: c.accent }}>
        {firstChar}
      </span>
      {rest}
    </p>
  );
}

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative py-20 px-6 md:px-12 overflow-hidden"
      style={{ backgroundColor: c.bg, borderBottom: `1px solid ${c.border}` }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
    >
      {/* # Subtle paper texture */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {avatarUrl && (
            <motion.div className="shrink-0"
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <img src={avatarUrl} alt={data.userName}
                className="w-32 h-32 rounded-xl object-cover shadow-md"
                style={{ border: `2px solid ${c.border}` }} />
            </motion.div>
          )}
          <div className="flex-1">
            <motion.h1 className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}
              initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              {data.title || data.userName}
            </motion.h1>
            {data.tagline && (
              <motion.p className="text-lg mt-3 italic" style={{ color: c.accent }}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                {data.tagline}
              </motion.p>
            )}
            {about && "bio" in about && about.bio && (
              <motion.div className="mt-6"
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <InitialCap text={about.bio} />
              </motion.div>
            )}
            <motion.div className="mt-6"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.accent} iconSize={20} />}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

let sectionCounter = 0;

function renderSection(section: PortfolioSection) {
  sectionCounter++;
  const num = sectionCounter;

  switch (section.type) {
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Academic & Professional Experience</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem} className="mb-10 relative pl-6"
                style={{ borderLeft: `2px solid ${c.border}` }}>
                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full" style={{ backgroundColor: c.accent }} />
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{e.title}</h3>
                    <p className="text-sm font-medium mt-0.5" style={{ color: c.accent }}>{e.company}{e.location ? `, ${e.location}` : ""}</p>
                  </div>
                  <span className="text-sm italic shrink-0 mt-1 md:mt-0" style={{ color: c.muted }}>{e.startDate} – {e.endDate || "Present"}</span>
                </div>
                {e.achievements.length > 0 && (
                  <ul className="mt-4 space-y-2 pl-4">
                    {e.achievements.map((a, j) => (
                      <li key={j} className="text-sm leading-relaxed" style={{ color: c.text, listStyleType: "disc" }}>{a}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Publications</SectionHeading>
          <ol className="space-y-5">
            {section.entries.map((pub, i) => (
              <li key={i} className="flex gap-4 text-sm p-5 rounded-xl" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <span className="shrink-0 font-mono text-xs w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                  style={{ backgroundColor: c.accentSoft, color: c.accent }}>
                  [{i + 1}]
                </span>
                <div>
                  <span className="font-bold leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{pub.title}</span>
                  {pub.venue && <span className="italic" style={{ color: c.muted }}> — {pub.venue}</span>}
                  {pub.date && <span style={{ color: c.muted }}>, {pub.date}</span>}
                  {pub.link && (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer"
                      className="ml-2 px-2 py-0.5 rounded text-xs font-medium hover:underline"
                      style={{ backgroundColor: c.accentSoft, color: c.accent }}>[PDF]</a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </SectionWrapper>
      );

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Education</SectionHeading>
          {section.entries.map((e, i) => (
            <div key={i} className="mb-8 p-6 rounded-xl" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
              <h3 className="text-lg font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{e.degree}</h3>
              <p className="text-sm font-medium mt-0.5" style={{ color: c.accent }}>{e.school}</p>
              {e.startDate && <p className="text-xs italic mt-1" style={{ color: c.muted }}>{e.startDate} – {e.endDate}</p>}
              {e.description && <p className="text-sm mt-3 leading-relaxed" style={{ color: c.text }}>{e.description}</p>}
            </div>
          ))}
        </SectionWrapper>
      );

    case "skills":
      if (section.groups.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Research Interests & Skills</SectionHeading>
          <div className="space-y-6">
            {section.groups.map((g, i) => (
              <div key={i} className="p-5 rounded-xl" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.accent }}>{g.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s, j) => (
                    <span key={j} className="text-sm px-3 py-1 rounded-lg" style={{ backgroundColor: c.accentSoft, color: c.accent }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Research Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-5">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}
                className="p-6 rounded-xl" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <h3 className="font-bold text-lg" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{p.title}</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: c.text }}>{p.description}</p>
                {p.techStack.length > 0 && (
                  <p className="text-xs mt-3" style={{ color: c.muted }}>
                    <span className="font-bold" style={{ color: c.accent }}>Methods:</span> {p.techStack.join(", ")}
                  </p>
                )}
                <div className="mt-4 flex gap-4 text-sm">
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.accent }}>View Project →</a>}
                  {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.accent }}>Repository</a>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Certifications</SectionHeading>
          <ul className="space-y-3">
            {section.entries.map((cert, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-xl text-sm"
                style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <span className="shrink-0 mt-0.5" style={{ color: c.accent }}>•</span>
                <span><strong style={{ color: c.heading }}>{cert.name}</strong> — {cert.issuer}{cert.date ? `, ${cert.date}` : ""}</span>
              </li>
            ))}
          </ul>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Awards & Fellowships</SectionHeading>
          <ul className="space-y-4">
            {section.entries.map((a, i) => (
              <li key={i} className="p-5 rounded-xl" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <h3 className="font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{a.title}</h3>
                <p className="text-sm mt-0.5" style={{ color: c.accent }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                {a.description && <p className="text-sm mt-2" style={{ color: c.text }}>{a.description}</p>}
              </li>
            ))}
          </ul>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Gallery</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.entries.map((g, i) => (
              <a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                  <img src={g.imageUrl} alt={g.title} className="w-full aspect-square object-cover transition-opacity group-hover:opacity-80" />
                </div>
                <p className="text-xs mt-2 text-center italic" style={{ color: c.muted }}>{g.title}</p>
              </a>
            ))}
          </div>
        </SectionWrapper>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Recommendations</SectionHeading>
          <div className="space-y-6">
            {section.entries.map((t, i) => (
              <blockquote key={i} className="pl-5 py-4 pr-5 rounded-xl"
                style={{ borderLeft: `3px solid ${c.accent}`, backgroundColor: c.surface }}>
                <p className="text-sm italic leading-relaxed" style={{ color: c.text }}>"{t.quote}"</p>
                <footer className="mt-3 text-sm">
                  <span className="font-bold" style={{ color: c.heading }}>{t.author}</span>
                  <span style={{ color: c.muted }}> — {t.role}{t.company ? `, ${t.company}` : ""}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading number={num}>Contact</SectionHeading>
          <div className="p-6 rounded-xl text-sm space-y-3" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, color: c.text }}>
            {section.email && <p>Email: <a href={`mailto:${section.email}`} className="font-medium hover:underline" style={{ color: c.accent }}>{section.email}</a></p>}
            {section.phone && <p>Phone: {section.phone}</p>}
            {section.location && <p>Location: {section.location}</p>}
            {section.calendarLink && <p>Office Hours: <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.accent }}>Schedule a meeting →</a></p>}
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

export default function AcademicTemplate({ data }: { data: PortfolioData }) {
  sectionCounter = 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />
      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
        ))}
      <footer className="py-10 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.accent }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
