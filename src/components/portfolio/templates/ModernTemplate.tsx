"use client";

/* ============================================================
   MODERN TEMPLATE — Animated gradient hero, startup vibe
   ============================================================
   Font: Space Grotesk headings, Inter body
   Colors: Violet→Cyan animated gradient hero, white cards, dark text
   Hero: Full-width animated gradient, bold personality
   ============================================================ */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { SkillPill } from "../shared/SkillBar";

const c = {
  bg: "#fafbff",
  surface: "#ffffff",
  card: "#ffffff",
  text: "#1a1a2e",
  muted: "#64648c",
  violet: "#7c3aed",
  cyan: "#06b6d4",
  pink: "#ec4899",
  gradient: "linear-gradient(135deg, #7c3aed, #06b6d4)",
  gradientAlt: "linear-gradient(135deg, #7c3aed, #ec4899, #06b6d4)",
  border: "#e5e7f0",
  shadow: "0 4px 24px rgba(124, 58, 237, 0.08)",
};

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative min-h-[85vh] flex items-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      {/* # Animated gradient background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 25%, #06b6d4 50%, #7c3aed 75%, #ec4899 100%)",
        backgroundSize: "300% 300%",
        animation: "modernGradient 10s ease infinite",
      }} />

      {/* # Mesh overlay */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
          {avatarUrl && (
            <motion.img src={avatarUrl} alt={data.userName}
              className="w-36 h-36 rounded-3xl object-cover shadow-2xl shrink-0"
              style={{ border: "4px solid rgba(255,255,255,0.3)" }}
              initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}
            />
          )}
          <div>
            <motion.div
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff", backdropFilter: "blur(10px)" }}
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            >
              {data.tagline || "Welcome"}
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {data.title || data.userName}
            </h1>
            {about && "bio" in about && about.bio && (
              <p className="mt-6 text-lg leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.85)" }}>{about.bio}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {data.socialLinks && <SocialIcons links={data.socialLinks} color="#ffffff" iconSize={24} />}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes modernGradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>
    </motion.header>
  );
}

function SectionHeading({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-extrabold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>
        {children}
      </h2>
      {subtitle && <p className="mt-1 text-sm" style={{ color: c.muted }}>{subtitle}</p>}
      <div className="mt-3 w-12 h-1 rounded-full" style={{ background: c.gradient }} />
    </div>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading subtitle="Where I've made an impact">Experience</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem}
                className="mb-6 rounded-2xl p-6 transition-shadow hover:shadow-lg"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                    <p className="text-sm font-medium" style={{ color: c.violet }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                  </div>
                  <span className="text-sm mt-1 md:mt-0 shrink-0 px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${c.violet}10`, color: c.violet }}>
                    {e.startDate} — {e.endDate || "Present"}
                  </span>
                </div>
                {e.achievements.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {e.achievements.map((a, j) => (
                      <li key={j} className="text-sm flex items-start gap-2" style={{ color: c.muted }}>
                        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full" style={{ background: c.gradient }} />
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading subtitle="Technologies & tools I work with">Skills</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {section.groups.map((g, i) => (
              <div key={i} className="p-6 rounded-2xl" style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: c.violet }}>{g.category}</h3>
                <div className="flex flex-wrap">
                  {g.skills.map((s, j) => (
                    <SkillPill key={j} name={s.name} color={c.violet} />
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading subtitle="Things I've built">Projects</SectionHeading>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}
                className="rounded-2xl overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
                {p.imageUrl && (
                  <div className="overflow-hidden h-48">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold" style={{ color: c.text }}>{p.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: c.muted }}>{p.description}</p>
                  {p.techStack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.techStack.map((t, j) => (
                        <span key={j} className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                          style={{ background: `${c.violet}10`, color: c.violet }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-4 text-sm font-semibold">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-white transition-opacity hover:opacity-90"
                        style={{ background: c.gradient }}>
                        Live Demo
                      </a>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full transition-colors hover:bg-gray-100"
                        style={{ color: c.violet, border: `1px solid ${c.violet}30` }}>
                        Source
                      </a>
                    )}
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((e, i) => (
              <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
                <h3 className="text-lg font-bold" style={{ color: c.text }}>{e.degree}</h3>
                <p className="text-sm font-medium" style={{ color: c.violet }}>{e.school}</p>
                {e.startDate && <p className="text-xs mt-1" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                {e.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{e.description}</p>}
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Certifications</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((cert, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: c.gradient }}>
                  <span className="text-white text-lg">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: c.text }}>{cert.name}</p>
                  <p className="text-xs" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "publications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Publications</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((pub, i) => (
              <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
                <h3 className="font-bold" style={{ color: c.text }}>{pub.title}</h3>
                <p className="text-sm mt-1" style={{ color: c.muted }}>{pub.venue}{pub.date ? ` · ${pub.date}` : ""}</p>
                {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-2 inline-block font-medium hover:underline" style={{ color: c.violet }}>Read More →</a>}
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Awards</SectionHeading>
          <div className="space-y-4">
            {section.entries.map((a, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="font-bold" style={{ color: c.text }}>{a.title}</h3>
                  <p className="text-sm" style={{ color: c.muted }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                  {a.description && <p className="text-sm mt-1" style={{ color: c.muted }}>{a.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading>Gallery</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {section.entries.map((g, i) => (
              <a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden group transition-all hover:-translate-y-1"
                style={{ boxShadow: c.shadow }}>
                <div className="relative">
                  <img src={g.imageUrl} alt={g.title} className="w-full aspect-square object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white font-semibold text-sm">{g.title}</p>
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <SectionHeading subtitle="What people say">Testimonials</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: c.gradient }}>
                  <span className="text-white text-lg font-bold">"</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: c.gradient }}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: c.text }}>{t.author}</p>
                    <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
                  </div>
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <div className="rounded-3xl p-10 text-center text-white" style={{ background: c.gradientAlt }}>
            <h2 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Let's Build Something Great</h2>
            <p className="mb-8 opacity-80">I'm always open to new opportunities and collaborations.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {section.email && (
                <a href={`mailto:${section.email}`}
                  className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff", backdropFilter: "blur(10px)" }}>
                  Email Me
                </a>
              )}
              {section.calendarLink && (
                <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
                  style={{ backgroundColor: "#ffffff", color: c.violet }}>
                  Book a Call
                </a>
              )}
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
      <footer className="py-8 text-center text-xs" style={{ color: c.muted }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.violet }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
