"use client";

/* ============================================================
   ACADEMIC TEMPLATE — Publication-focused, warm paper tones
   ============================================================
   Font: Lora headings, Inter body
   Colors: Warm paper #fefcf7, dark brown #3d2c1e, muted blue
   Hero: Clean, scholarly, understated elegance
   ============================================================ */

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
  accentLight: "#6b8fc0",
  border: "#e6dfd4",
  heading: "#2c1810",
};

function SectionHeading({ children, number }: { children: React.ReactNode; number?: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-baseline gap-3">
        {number !== undefined && (
          <span className="text-4xl font-bold opacity-10" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
            {String(number).padStart(2, "0")}
          </span>
        )}
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
          {children}
        </h2>
      </div>
      <div className="mt-2 w-full h-px" style={{ backgroundColor: c.border }} />
    </div>
  );
}

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="py-20 px-6 md:px-12"
      style={{ backgroundColor: c.bg, borderBottom: `1px solid ${c.border}` }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {avatarUrl && (
            <img src={avatarUrl} alt={data.userName}
              className="w-28 h-28 rounded-lg object-cover shrink-0"
              style={{ border: `1px solid ${c.border}` }} />
          )}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>
              {data.title || data.userName}
            </h1>
            {data.tagline && (
              <p className="text-lg mt-2 italic" style={{ color: c.accent }}>{data.tagline}</p>
            )}
            {about && "bio" in about && about.bio && (
              <p className="mt-4 text-base leading-relaxed" style={{ color: c.muted }}>{about.bio}</p>
            )}
            <div className="mt-6">
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.accent} iconSize={20} />}
            </div>
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
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Academic & Professional Experience</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem} className="mb-8">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{e.title}</h3>
                    <p className="text-sm" style={{ color: c.accent }}>{e.company}{e.location ? `, ${e.location}` : ""}</p>
                  </div>
                  <span className="text-sm italic shrink-0 mt-1 md:mt-0" style={{ color: c.muted }}>{e.startDate} – {e.endDate || "Present"}</span>
                </div>
                {e.achievements.length > 0 && (
                  <ul className="mt-3 space-y-1.5 pl-4">
                    {e.achievements.map((a, j) => (
                      <li key={j} className="text-sm" style={{ color: c.text, listStyleType: "disc" }}>{a}</li>
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
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Publications</SectionHeading>
          <ol className="space-y-4">
            {section.entries.map((pub, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{ color: c.text }}>
                <span className="shrink-0 font-mono text-xs mt-0.5 w-6 text-right" style={{ color: c.muted }}>[{i + 1}]</span>
                <div>
                  <span className="font-semibold" style={{ color: c.heading }}>{pub.title}</span>
                  {pub.venue && <span className="italic" style={{ color: c.muted }}> — {pub.venue}</span>}
                  {pub.date && <span style={{ color: c.muted }}>, {pub.date}</span>}
                  {pub.link && (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer"
                      className="ml-2 hover:underline" style={{ color: c.accent }}>[link]</a>
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
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Education</SectionHeading>
          {section.entries.map((e, i) => (
            <div key={i} className="mb-6">
              <h3 className="text-lg font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{e.degree}</h3>
              <p className="text-sm" style={{ color: c.accent }}>{e.school}</p>
              {e.startDate && <p className="text-xs italic mt-0.5" style={{ color: c.muted }}>{e.startDate} – {e.endDate}</p>}
              {e.description && <p className="text-sm mt-2 leading-relaxed" style={{ color: c.text }}>{e.description}</p>}
            </div>
          ))}
        </SectionWrapper>
      );

    case "skills":
      if (section.groups.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Research Interests & Skills</SectionHeading>
          <div className="space-y-6">
            {section.groups.map((g, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: c.accent }}>{g.category}</h3>
                <p className="text-sm" style={{ color: c.text }}>
                  {g.skills.map((s) => s.name).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Research Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-6">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}
                className="p-5 rounded-lg" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
                <h3 className="font-bold" style={{ fontFamily: "'Lora', Georgia, serif", color: c.heading }}>{p.title}</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: c.text }}>{p.description}</p>
                {p.techStack.length > 0 && (
                  <p className="text-xs mt-2" style={{ color: c.muted }}>
                    <span className="font-semibold">Methods:</span> {p.techStack.join(", ")}
                  </p>
                )}
                <div className="mt-3 flex gap-4 text-sm">
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.accent }}>View Project</a>}
                  {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.accent }}>Repository</a>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Certifications</SectionHeading>
          <ul className="space-y-3">
            {section.entries.map((cert, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: c.text }}>
                <span style={{ color: c.accent }}>•</span>
                <span><strong style={{ color: c.heading }}>{cert.name}</strong> — {cert.issuer}{cert.date ? `, ${cert.date}` : ""}</span>
              </li>
            ))}
          </ul>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Awards & Fellowships</SectionHeading>
          <ul className="space-y-4">
            {section.entries.map((a, i) => (
              <li key={i}>
                <h3 className="font-semibold" style={{ color: c.heading }}>{a.title}</h3>
                <p className="text-sm" style={{ color: c.muted }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                {a.description && <p className="text-sm mt-1" style={{ color: c.text }}>{a.description}</p>}
              </li>
            ))}
          </ul>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Gallery</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.entries.map((g, i) => (
              <a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer" className="block group">
                <img src={g.imageUrl} alt={g.title} className="w-full aspect-square object-cover rounded-lg transition-opacity group-hover:opacity-80" style={{ border: `1px solid ${c.border}` }} />
                <p className="text-xs mt-1 text-center" style={{ color: c.muted }}>{g.title}</p>
              </a>
            ))}
          </div>
        </SectionWrapper>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Recommendations</SectionHeading>
          <div className="space-y-6">
            {section.entries.map((t, i) => (
              <blockquote key={i} className="pl-4" style={{ borderLeft: `3px solid ${c.accent}` }}>
                <p className="text-sm italic leading-relaxed" style={{ color: c.text }}>"{t.quote}"</p>
                <footer className="mt-2 text-sm">
                  <span className="font-semibold" style={{ color: c.heading }}>{t.author}</span>
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
        <SectionWrapper className="py-16 px-6 md:px-12 max-w-3xl mx-auto">
          <SectionHeading number={num}>Contact</SectionHeading>
          <div className="text-sm space-y-2" style={{ color: c.text }}>
            {section.email && <p>Email: <a href={`mailto:${section.email}`} className="hover:underline" style={{ color: c.accent }}>{section.email}</a></p>}
            {section.phone && <p>Phone: {section.phone}</p>}
            {section.location && <p>Location: {section.location}</p>}
            {section.calendarLink && <p>Office Hours: <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.accent }}>Schedule a meeting</a></p>}
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

export default function AcademicTemplate({ data }: { data: PortfolioData }) {
  /* # Reset section counter on each render */
  sectionCounter = 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />
      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
        ))}
      <footer className="py-8 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.accent }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
