"use client";

/* ============================================================
   MINIMAL TEMPLATE — Clean, universal, lots of whitespace
   ============================================================
   Font: Inter (system default)
   Colors: Near-white background, charcoal text, single accent
   Hero: Left-aligned, large name, tagline in muted gray
   Animations: Subtle fade-up on scroll
   ============================================================ */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { SkillPill } from "../shared/SkillBar";

/* # Template-specific colors */
const defaultColors = {
  bg: "#fafafa",
  text: "#1a1a2e",
  muted: "#6b7280",
  accent: "#3b82f6",
  cardBg: "#ffffff",
  border: "#e5e7eb",
};

function getColors(data: PortfolioData) {
  const tc = data.themeColors;
  return {
    ...defaultColors,
    ...(tc ? { accent: tc.primary, bg: tc.background || defaultColors.bg } : {}),
  };
}

/* ---- Hero Section ---- */
function Hero({ data, colors }: { data: PortfolioData; colors: typeof defaultColors }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="pt-24 pb-16 px-6 md:px-12 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={data.userName}
            className="w-28 h-28 rounded-full object-cover shadow-lg"
            style={{ border: `3px solid ${colors.accent}` }}
          />
        )}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: colors.text }}>
            {data.title || data.userName}
          </h1>
          {data.tagline && (
            <p className="text-xl mt-2" style={{ color: colors.accent }}>{data.tagline}</p>
          )}
          {about && "bio" in about && about.bio && (
            <p className="mt-4 text-lg leading-relaxed max-w-2xl" style={{ color: colors.muted }}>
              {about.bio}
            </p>
          )}
          <div className="mt-6 flex items-center gap-6">
            {data.socialLinks && <SocialIcons links={data.socialLinks} color={colors.muted} />}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

/* ---- Section Renderers ---- */

function ExperienceSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "experience" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Experience</h2>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {section.entries.map((e, i) => (
          <motion.div key={i} variants={staggerItem} className="mb-10 relative pl-6"
            style={{ borderLeft: `2px solid ${colors.border}` }}>
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full" style={{ backgroundColor: colors.accent }} />
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{e.title}</h3>
                <p className="text-sm" style={{ color: colors.accent }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
              </div>
              {(e.startDate || e.endDate) && (
                <span className="text-sm mt-1 md:mt-0 shrink-0" style={{ color: colors.muted }}>
                  {e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}
                </span>
              )}
            </div>
            {e.description && <p className="mt-2 text-sm" style={{ color: colors.muted }}>{e.description}</p>}
            {e.achievements.length > 0 && (
              <ul className="mt-3 space-y-1">
                {e.achievements.map((a, j) => (
                  <li key={j} className="text-sm flex items-start gap-2" style={{ color: colors.muted }}>
                    <span style={{ color: colors.accent }} className="mt-1.5 shrink-0">•</span>
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
}

function EducationSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "education" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Education</h2>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {section.entries.map((e, i) => (
          <motion.div key={i} variants={staggerItem} className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{e.degree}</h3>
                <p className="text-sm" style={{ color: colors.accent }}>{e.school}{e.location ? ` · ${e.location}` : ""}</p>
              </div>
              {(e.startDate || e.endDate) && (
                <span className="text-sm mt-1 md:mt-0 shrink-0" style={{ color: colors.muted }}>
                  {e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}
                </span>
              )}
            </div>
            {e.description && <p className="mt-2 text-sm" style={{ color: colors.muted }}>{e.description}</p>}
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

function SkillsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "skills" || section.groups.length === 0) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Skills</h2>
      <div className="space-y-6">
        {section.groups.map((g, i) => (
          <div key={i}>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: colors.muted }}>
              {g.category}
            </h3>
            <div className="flex flex-wrap">
              {g.skills.map((s, j) => (
                <SkillPill key={j} name={s.name} color={colors.accent} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function ProjectsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "projects" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Projects</h2>
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {section.entries.map((p, i) => (
          <motion.div
            key={i} variants={staggerItem}
            className="rounded-xl p-6 transition-shadow hover:shadow-lg"
            style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
          >
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover rounded-lg mb-4" />
            )}
            <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{p.title}</h3>
            <p className="mt-2 text-sm" style={{ color: colors.muted }}>{p.description}</p>
            {p.techStack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {p.techStack.map((t, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${colors.accent}10`, color: colors.accent }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-3">
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline" style={{ color: colors.accent }}>
                  Live Demo →
                </a>
              )}
              {p.repoUrl && (
                <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline" style={{ color: colors.muted }}>
                  Source Code
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

function CertificationsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "certifications" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Certifications</h2>
      <div className="space-y-4">
        {section.entries.map((c, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.accent }} />
            <div>
              <h3 className="font-semibold" style={{ color: colors.text }}>
                {c.link ? <a href={c.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{c.name}</a> : c.name}
              </h3>
              <p className="text-sm" style={{ color: colors.muted }}>{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function PublicationsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "publications" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Publications</h2>
      <div className="space-y-4">
        {section.entries.map((p, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-sm font-mono shrink-0 mt-0.5" style={{ color: colors.accent }}>[{i + 1}]</span>
            <div>
              <h3 className="font-semibold" style={{ color: colors.text }}>
                {p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.title}</a> : p.title}
              </h3>
              <p className="text-sm" style={{ color: colors.muted }}>{p.venue}{p.date ? ` · ${p.date}` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function AwardsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "awards" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Awards</h2>
      <div className="space-y-4">
        {section.entries.map((a, i) => (
          <div key={i}>
            <h3 className="font-semibold" style={{ color: colors.text }}>{a.title}</h3>
            <p className="text-sm" style={{ color: colors.accent }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
            {a.description && <p className="text-sm mt-1" style={{ color: colors.muted }}>{a.description}</p>}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function GallerySection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "gallery" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {section.entries.map((g, i) => (
          <a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
            className="group relative rounded-xl overflow-hidden aspect-square">
            <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <div>
                <h3 className="text-white font-semibold text-sm">{g.title}</h3>
                {g.description && <p className="text-white/70 text-xs mt-1">{g.description}</p>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}

function TestimonialsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "testimonials" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.entries.map((t, i) => (
          <div key={i} className="rounded-xl p-6" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <p className="text-sm italic leading-relaxed" style={{ color: colors.muted }}>"{t.quote}"</p>
            <div className="mt-4">
              <p className="font-semibold text-sm" style={{ color: colors.text }}>{t.author}</p>
              <p className="text-xs" style={{ color: colors.muted }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function ContactSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "contact") return null;
  const hasContent = section.email || section.phone || section.location || section.calendarLink;
  if (!hasContent) return null;
  return (
    <SectionWrapper className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8" style={{ color: colors.text }}>Get in Touch</h2>
      <div className="rounded-xl p-8" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.email && (
            <a href={`mailto:${section.email}`} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.accent}15` }}>
                <span style={{ color: colors.accent }}>✉</span>
              </div>
              <div>
                <p className="text-xs" style={{ color: colors.muted }}>Email</p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>{section.email}</p>
              </div>
            </a>
          )}
          {section.phone && (
            <a href={`tel:${section.phone}`} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.accent}15` }}>
                <span style={{ color: colors.accent }}>☎</span>
              </div>
              <div>
                <p className="text-xs" style={{ color: colors.muted }}>Phone</p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>{section.phone}</p>
              </div>
            </a>
          )}
          {section.location && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.accent}15` }}>
                <span style={{ color: colors.accent }}>📍</span>
              </div>
              <div>
                <p className="text-xs" style={{ color: colors.muted }}>Location</p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>{section.location}</p>
              </div>
            </div>
          )}
          {section.calendarLink && (
            <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.accent}15` }}>
                <span style={{ color: colors.accent }}>📅</span>
              </div>
              <div>
                <p className="text-xs" style={{ color: colors.muted }}>Schedule a Call</p>
                <p className="text-sm font-medium" style={{ color: colors.accent }}>Book a meeting →</p>
              </div>
            </a>
          )}
        </div>
        {section.socialLinks && Object.keys(section.socialLinks).length > 0 && (
          <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${colors.border}` }}>
            <SocialIcons links={section.socialLinks} color={colors.muted} />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

/* ---- Section dispatcher ---- */
const SECTION_RENDERERS: Record<string, React.ComponentType<{ section: PortfolioSection; colors: typeof defaultColors }>> = {
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
  publications: PublicationsSection,
  awards: AwardsSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
};

/* ---- Main Template ---- */
export default function MinimalTemplate({ data }: { data: PortfolioData }) {
  const colors = getColors(data);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} colors={colors} />

      {/* # Thin accent divider */}
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="h-px" style={{ backgroundColor: colors.border }} />
      </div>

      {/* # Render visible sections in order */}
      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => {
          const Renderer = SECTION_RENDERERS[section.type];
          if (!Renderer) return null;
          return <Renderer key={`${section.type}-${i}`} section={section} colors={colors} />;
        })}

      {/* # Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs" style={{ color: colors.muted }}>
          Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: colors.accent }}>JobPilot AI</a>
        </p>
      </footer>
    </div>
  );
}
