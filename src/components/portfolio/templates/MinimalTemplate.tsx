"use client";

/* # Minimal Template — Refined elegance with glassmorphism, grain texture, premium typography */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { StatsBar } from "../shared/StatsBar";
import { SectionDivider } from "../shared/SectionDivider";
import { autoCategorizeSkills } from "@/lib/skill-categories";

const defaultColors = {
  bg: "#fafafa",
  surface: "#ffffff",
  text: "#0f0f0f",
  muted: "#6b7280",
  accent: "#2563eb",
  accentSoft: "#2563eb12",
  cardBg: "#ffffff",
  border: "#00000008",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)",
  shadowHover: "0 4px 12px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)",
};

function getColors(data: PortfolioData) {
  const tc = data.themeColors;
  return {
    ...defaultColors,
    ...(tc ? { accent: tc.primary, accentSoft: `${tc.primary}12`, bg: tc.background || defaultColors.bg } : {}),
  };
}

/* # Section heading with accent underline */
function SectionHeading({ title, colors }: { title: string; colors: typeof defaultColors }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold tracking-tight" style={{ color: colors.text }}>{title}</h2>
      <motion.div className="mt-3 h-0.5 w-12 rounded-full"
        style={{ backgroundColor: colors.accent }}
        initial={{ width: 0 }} whileInView={{ width: 48 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
    </div>
  );
}

/* # Premium card with subtle shadow and hover lift */
function Card({ children, colors, className = "" }: { children: React.ReactNode; colors: typeof defaultColors; className?: string }) {
  return (
    <motion.div
      className={`rounded-2xl p-6 ${className}`}
      style={{ backgroundColor: colors.cardBg, boxShadow: colors.shadow, border: `1px solid ${colors.border}` }}
      whileHover={{ y: -3, boxShadow: colors.shadowHover, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}

function Hero({ data, colors }: { data: PortfolioData; colors: typeof defaultColors }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative pt-28 pb-20 px-6 md:px-12 overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
    >
      {/* # Subtle gradient glow behind hero */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.07]"
        style={{ background: colors.accent }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.04]"
        style={{ background: colors.accent }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-10">
          {avatarUrl && (
            <motion.div className="relative shrink-0"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" as const }}>
              <div className="absolute -inset-1 rounded-full opacity-20 blur-md" style={{ background: colors.accent }} />
              <img src={avatarUrl} alt={data.userName}
                className="relative w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl" />
            </motion.div>
          )}
          <div>
            <motion.h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none"
              style={{ color: colors.text }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              {data.title || data.userName}
            </motion.h1>
            {data.tagline && (
              <motion.p className="text-xl mt-3 font-medium" style={{ color: colors.accent }}
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                {data.tagline}
              </motion.p>
            )}
            {about && "bio" in about && about.bio && (
              <motion.p className="mt-5 text-lg leading-relaxed max-w-2xl" style={{ color: colors.muted }}
                initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                {about.bio}
              </motion.p>
            )}
            <motion.div className="mt-8 flex items-center gap-6"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              {data.socialLinks && <SocialIcons links={data.socialLinks} color={colors.muted} iconSize={22} />}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function ExperienceSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "experience" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Experience" colors={colors} />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {section.entries.map((e, i) => (
          <motion.div key={i} variants={staggerItem} className="mb-10 relative pl-8"
            style={{ borderLeft: `2px solid ${colors.border}` }}>
            {/* # Accent dot on timeline */}
            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent, boxShadow: `0 0 0 4px ${colors.accentSoft}` }} />
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.text }}>{e.title}</h3>
                <p className="text-sm font-medium mt-0.5" style={{ color: colors.accent }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
              </div>
              {(e.startDate || e.endDate) && (
                <span className="text-sm shrink-0 px-3 py-1 rounded-full" style={{ backgroundColor: colors.accentSoft, color: colors.accent }}>
                  {e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}
                </span>
              )}
            </div>
            {e.description && <p className="mt-3 text-sm" style={{ color: colors.muted }}>{e.description}</p>}
            {e.achievements.length > 0 && (
              <ul className="mt-4 space-y-2">
                {e.achievements.map((a, j) => (
                  <li key={j} className="text-sm flex items-start gap-2.5" style={{ color: colors.muted }}>
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
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
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Education" colors={colors} />
      <div className="space-y-4">
        {section.entries.map((e, i) => (
          <Card key={i} colors={colors}>
            <div className="flex flex-col md:flex-row md:justify-between">
              <div>
                <h3 className="text-lg font-bold" style={{ color: colors.text }}>{e.degree}</h3>
                <p className="text-sm font-medium mt-0.5" style={{ color: colors.accent }}>{e.school}{e.location ? ` · ${e.location}` : ""}</p>
              </div>
              {(e.startDate || e.endDate) && (
                <span className="text-sm shrink-0 mt-1 md:mt-0" style={{ color: colors.muted }}>
                  {e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}
                </span>
              )}
            </div>
            {e.description && <p className="mt-3 text-sm leading-relaxed" style={{ color: colors.muted }}>{e.description}</p>}
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}

function SkillsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "skills" || section.groups.length === 0) return null;
  const groups = autoCategorizeSkills(section.groups);
  return (
    <SectionWrapper className="py-28 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Skills" colors={colors} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((g, i) => (
          <Card key={i} colors={colors}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.accent }} />
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.accent }}>{g.category}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.skills.map((s, j) => (
                <motion.span key={j}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: colors.accentSoft, color: colors.accent }}
                  whileHover={{ scale: 1.05 }}>
                  {s.name}
                </motion.span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}

function ProjectsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "projects" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Projects" colors={colors} />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.entries.map((p, i) => (
          <motion.div key={i} variants={staggerItem}>
            <motion.div className="rounded-2xl overflow-hidden group"
              style={{ backgroundColor: colors.cardBg, boxShadow: colors.shadow, border: `1px solid ${colors.border}` }}
              whileHover={{ y: -4, boxShadow: colors.shadowHover }}>
              {p.imageUrl && (
                <div className="overflow-hidden h-48 relative">
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold" style={{ color: colors.text }}>{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: colors.muted }}>{p.description}</p>
                {p.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.techStack.map((t, j) => (
                      <span key={j} className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: colors.accentSoft, color: colors.accent }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-5 flex gap-3">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:shadow-md"
                      style={{ backgroundColor: colors.accent, color: "#ffffff" }}>
                      Live Demo →
                    </a>
                  )}
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80"
                      style={{ color: colors.accent, border: `1px solid ${colors.accent}30` }}>
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

function CertificationsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "certifications" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Certifications" colors={colors} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {section.entries.map((c2, i) => (
          <Card key={i} colors={colors}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.accentSoft }}>
                <span className="text-lg font-bold" style={{ color: colors.accent }}>✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: colors.text }}>
                  {c2.link ? <a href={c2.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{c2.name}</a> : c2.name}
                </h3>
                <p className="text-xs" style={{ color: colors.muted }}>{c2.issuer}{c2.date ? ` · ${c2.date}` : ""}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}

function PublicationsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "publications" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Publications" colors={colors} />
      <div className="space-y-4">
        {section.entries.map((p, i) => (
          <Card key={i} colors={colors}>
            <div className="flex items-start gap-3">
              <span className="text-sm font-mono shrink-0 mt-0.5 w-6 text-right font-bold" style={{ color: colors.accent }}>[{i + 1}]</span>
              <div>
                <h3 className="font-semibold" style={{ color: colors.text }}>
                  {p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.title}</a> : p.title}
                </h3>
                <p className="text-sm mt-0.5" style={{ color: colors.muted }}>{p.venue}{p.date ? ` · ${p.date}` : ""}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}

function AwardsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "awards" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Awards" colors={colors} />
      <div className="space-y-4">
        {section.entries.map((a, i) => (
          <Card key={i} colors={colors}>
            <h3 className="font-bold" style={{ color: colors.text }}>{a.title}</h3>
            <p className="text-sm mt-0.5" style={{ color: colors.accent }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
            {a.description && <p className="text-sm mt-2" style={{ color: colors.muted }}>{a.description}</p>}
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}

function GallerySection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "gallery" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Gallery" colors={colors} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {section.entries.map((g, i) => (
          <motion.a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
            className="group relative rounded-2xl overflow-hidden aspect-square"
            style={{ boxShadow: colors.shadow }}
            whileHover={{ y: -4, boxShadow: colors.shadowHover }}>
            <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div>
                <h3 className="text-white font-bold text-sm">{g.title}</h3>
                {g.description && <p className="text-white/70 text-xs mt-1">{g.description}</p>}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </SectionWrapper>
  );
}

function TestimonialsSection({ section, colors }: { section: PortfolioSection; colors: typeof defaultColors }) {
  if (section.type !== "testimonials" || section.entries.length === 0) return null;
  return (
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Testimonials" colors={colors} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.entries.map((t, i) => (
          <Card key={i} colors={colors}>
            <div className="text-4xl leading-none mb-3" style={{ color: colors.accent, opacity: 0.2 }}>"</div>
            <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>{t.quote}</p>
            <div className="mt-5 pt-4 flex items-center gap-3" style={{ borderTop: `1px solid ${colors.border}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: colors.accent }}>
                {t.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: colors.text }}>{t.author}</p>
                <p className="text-xs" style={{ color: colors.muted }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
              </div>
            </div>
          </Card>
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
    <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <SectionHeading title="Get in Touch" colors={colors} />
      <Card colors={colors} className="!p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.email && (
            <a href={`mailto:${section.email}`} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:shadow-md"
                style={{ backgroundColor: colors.accentSoft }}>
                <span className="text-lg" style={{ color: colors.accent }}>✉</span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Email</p>
                <p className="text-sm font-semibold" style={{ color: colors.text }}>{section.email}</p>
              </div>
            </a>
          )}
          {section.phone && (
            <a href={`tel:${section.phone}`} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.accentSoft }}>
                <span className="text-lg" style={{ color: colors.accent }}>☎</span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Phone</p>
                <p className="text-sm font-semibold" style={{ color: colors.text }}>{section.phone}</p>
              </div>
            </a>
          )}
          {section.location && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.accentSoft }}>
                <span className="text-lg" style={{ color: colors.accent }}>⌘</span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Location</p>
                <p className="text-sm font-semibold" style={{ color: colors.text }}>{section.location}</p>
              </div>
            </div>
          )}
          {section.calendarLink && (
            <a href={section.calendarLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:shadow-md"
                style={{ backgroundColor: colors.accentSoft }}>
                <span className="text-lg" style={{ color: colors.accent }}>📅</span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>Schedule</p>
                <p className="text-sm font-semibold" style={{ color: colors.accent }}>Book a meeting →</p>
              </div>
            </a>
          )}
        </div>
        {section.socialLinks && Object.keys(section.socialLinks).length > 0 && (
          <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${colors.border}` }}>
            <SocialIcons links={section.socialLinks} color={colors.muted} />
          </div>
        )}
      </Card>
    </SectionWrapper>
  );
}

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

export default function MinimalTemplate({ data }: { data: PortfolioData }) {
  const colors = getColors(data);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* # Subtle noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <Hero data={data} colors={colors} />

      <StatsBar data={data} variant="minimal" colors={{
        bg: colors.bg, text: colors.text, accent: colors.accent, muted: colors.muted, border: colors.border,
      }} />

      <SectionDivider variant="gradient" color={colors.accent} />

      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => {
          const Renderer = SECTION_RENDERERS[section.type];
          if (!Renderer) return null;
          return (
            <div key={`${section.type}-${i}`}>
              {i > 0 && <SectionDivider variant="gradient" color={colors.accent} />}
              <Renderer section={section} colors={colors} />
            </div>
          );
        })}

      <footer className="py-16 text-center" style={{ borderTop: `1px solid ${colors.border}` }}>
        <p className="text-xs" style={{ color: colors.muted }}>
          Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: colors.accent }}>JobPilot AI</a>
        </p>
      </footer>
    </div>
  );
}
