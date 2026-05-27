"use client";

/* ============================================================
   CORPORATE TEMPLATE — Elegant serif, restrained animations
   ============================================================
   Font: Playfair Display headings, Inter body
   Colors: Navy #1a1a3e, gold #c8a96e, cream #f8f6f0
   Hero: Centered, dignified, subtle gold accents
   ============================================================ */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";

const c = {
  bg: "#f8f6f0",
  surface: "#ffffff",
  card: "#ffffff",
  navy: "#1a1a3e",
  gold: "#c8a96e",
  text: "#2d2d3a",
  muted: "#6b6b7b",
  border: "#e8e4dc",
  light: "#f0ede6",
};

/* # Gold accent line under section headings */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>
        {children}
      </h2>
      <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: c.gold }} />
    </div>
  );
}

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="min-h-[80vh] flex items-center"
      style={{ backgroundColor: c.navy }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
    >
      {/* # Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #c8a96e 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 md:px-12 text-center">
        {avatarUrl && (
          <motion.img src={avatarUrl} alt={data.userName}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-8"
            style={{ border: `3px solid ${c.gold}` }}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          />
        )}
        <div className="w-12 h-0.5 mx-auto mb-6" style={{ backgroundColor: c.gold }} />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff" }}>
          {data.title || data.userName}
        </h1>
        {data.tagline && (
          <p className="text-lg md:text-xl mt-4 font-light tracking-wide" style={{ color: c.gold }}>{data.tagline}</p>
        )}
        {about && "bio" in about && about.bio && (
          <p className="mt-6 text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>{about.bio}</p>
        )}
        <div className="mt-8">
          {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.gold} iconSize={22} />}
        </div>
      </div>
    </motion.header>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading>Professional Experience</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem}
                className="mb-8 pb-8" style={{ borderBottom: `1px solid ${c.border}` }}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                  <div>
                    <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{e.title}</h3>
                    <p className="text-sm font-medium mt-1" style={{ color: c.gold }}>{e.company}{e.location ? ` — ${e.location}` : ""}</p>
                  </div>
                  <span className="text-sm mt-1 md:mt-0 shrink-0 italic" style={{ color: c.muted }}>{e.startDate} — {e.endDate || "Present"}</span>
                </div>
                {e.achievements.length > 0 && (
                  <ul className="mt-4 space-y-2">
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

    case "skills":
      if (section.groups.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading>Core Competencies</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {section.groups.map((g, i) => (
              <div key={i}>
                <h3 className="text-sm uppercase tracking-widest font-semibold mb-4" style={{ color: c.gold }}>{g.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s, j) => (
                    <span key={j} className="px-4 py-1.5 rounded text-sm"
                      style={{ backgroundColor: c.light, color: c.navy, border: `1px solid ${c.border}` }}>
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
          <SectionHeading>Key Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}
                className="rounded-lg overflow-hidden shadow-sm"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}>
                {p.imageUrl && (
                  <div className="overflow-hidden h-48">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>{p.description}</p>
                  {p.techStack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.techStack.map((t, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: c.light, color: c.navy }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-4 text-sm">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: c.gold }} className="hover:underline">View Project</a>}
                    {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: c.navy }} className="hover:underline">Repository</a>}
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading>Education</SectionHeading>
          {section.entries.map((e, i) => (
            <div key={i} className="mb-6 pb-6" style={{ borderBottom: `1px solid ${c.border}` }}>
              <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: c.navy }}>{e.degree}</h3>
              <p className="text-sm mt-1" style={{ color: c.gold }}>{e.school}</p>
              {e.startDate && <p className="text-xs italic mt-1" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
              {e.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{e.description}</p>}
            </div>
          ))}
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading>Certifications & Licenses</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((cert, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-lg" style={{ backgroundColor: c.light, border: `1px solid ${c.border}` }}>
                <span className="text-xl shrink-0" style={{ color: c.gold }}>◆</span>
                <div>
                  <p className="font-semibold" style={{ color: c.navy }}>{cert.name}</p>
                  <p className="text-xs mt-1" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading>Publications</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((pub, i) => (
              <div key={i} className="p-5 rounded-lg" style={{ backgroundColor: c.light, border: `1px solid ${c.border}` }}>
                <h3 className="font-semibold" style={{ color: c.navy }}>{pub.title}</h3>
                <p className="text-sm mt-1" style={{ color: c.muted }}>{pub.venue}{pub.date ? ` · ${pub.date}` : ""}</p>
                {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-2 inline-block hover:underline" style={{ color: c.gold }}>Read Publication →</a>}
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading>Awards & Honors</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((a, i) => (
              <div key={i} className="flex items-start gap-4 p-5" style={{ borderBottom: `1px solid ${c.border}` }}>
                <span className="text-2xl shrink-0" style={{ color: c.gold }}>★</span>
                <div>
                  <h3 className="font-bold" style={{ color: c.navy }}>{a.title}</h3>
                  <p className="text-sm" style={{ color: c.muted }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                  {a.description && <p className="text-sm mt-1" style={{ color: c.text }}>{a.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading>Portfolio Gallery</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.entries.map((g, i) => (
              <a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden group" style={{ border: `1px solid ${c.border}` }}>
                <div className="relative overflow-hidden">
                  <img src={g.imageUrl} alt={g.title} className="w-full aspect-square object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-sm font-medium">{g.title}</p>
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
          <SectionHeading>Client Testimonials</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <div key={i} className="p-6 rounded-lg" style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <span className="text-4xl leading-none" style={{ color: c.gold }}>"</span>
                <p className="text-sm italic leading-relaxed mt-2" style={{ color: c.text }}>{t.quote}</p>
                <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
                  <p className="font-semibold text-sm" style={{ color: c.navy }}>{t.author}</p>
                  <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? `, ${t.company}` : ""}</p>
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-4xl mx-auto text-center">
          <SectionHeading>Get in Touch</SectionHeading>
          <p className="mb-8 text-sm" style={{ color: c.muted }}>I'd love to hear from you. Let's discuss how we can work together.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {section.email && (
              <a href={`mailto:${section.email}`}
                className="px-8 py-3 rounded font-semibold text-sm tracking-wide transition-all hover:opacity-90"
                style={{ backgroundColor: c.navy, color: "#ffffff" }}>
                Send Email
              </a>
            )}
            {section.calendarLink && (
              <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                className="px-8 py-3 rounded font-semibold text-sm tracking-wide transition-all hover:opacity-90"
                style={{ backgroundColor: "transparent", color: c.navy, border: `2px solid ${c.navy}` }}>
                Schedule Meeting
              </a>
            )}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm" style={{ color: c.muted }}>
            {section.email && <span>{section.email}</span>}
            {section.phone && <span>{section.phone}</span>}
            {section.location && <span>{section.location}</span>}
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

export default function CorporateTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />
      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>
            {i > 0 && <div className="w-16 h-px mx-auto" style={{ backgroundColor: c.border }} />}
            {renderSection(section)}
          </div>
        ))}
      <footer className="py-8 text-center text-xs" style={{ color: c.muted }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.gold }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
