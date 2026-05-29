"use client";

/* # Videographer Template — Cinematic widescreen with actual video embeds, showreel hero, film aesthetic */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";
import { VideoEmbed, hasVideo } from "../shared/VideoEmbed";
import { StatsBar } from "../shared/StatsBar";
import { autoCategorizeSkills } from "@/lib/skill-categories";

const c = {
  bg: "#0a0a0a",
  surface: "#111111",
  card: "#161616",
  text: "#f5f5f5",
  muted: "#8a8a8a",
  red: "#e50914",
  redSoft: "#e5091410",
  gold: "#d4a853",
  border: "rgba(255,255,255,0.06)",
  shadow: "0 8px 40px rgba(0,0,0,0.4)",
};

/* # Cinematic letterbox bars */
function Letterbox() {
  return <div className="w-full h-6 md:h-10" style={{ backgroundColor: "#000000" }} />;
}

/* # Film-style card with red accent on hover */
function FilmCard({ children, className = "", featured = false }: { children: React.ReactNode; className?: string; featured?: boolean }) {
  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        backgroundColor: featured ? c.surface : c.card,
        border: `1px solid ${featured ? c.red + "20" : c.border}`,
      }}
      whileHover={{ y: -4, boxShadow: `0 12px 50px rgba(229,9,20,0.1)`, transition: { duration: 0.25 } }}
    >
      {children}
    </motion.div>
  );
}

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  /* # Find a showreel video from projects to feature in hero */
  const projectsSection = data.sections.find((s): s is import("@/lib/portfolio-types").ProjectsSection => s.type === "projects" && s.visible);
  const showreelVideo = projectsSection
    ? projectsSection.entries.find((e) => hasVideo(e))
    : null;

  return (
    <motion.section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
    >
      {/* # Dark cinema background with vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)",
      }} />

      {/* # Film grain texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* # Red accent glow */}
      <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[150px]"
        style={{ background: c.red, opacity: 0.06 }}
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

      <Letterbox />

      <div className="flex-1 flex items-center relative z-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* # Left: name & bio */}
            <div className="flex-1 lg:max-w-md">
              {avatarUrl && (
                <motion.img src={avatarUrl} alt={data.userName}
                  className="w-24 h-24 rounded-xl object-cover mb-6"
                  style={{ border: `2px solid ${c.border}`, boxShadow: c.shadow }}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" as const }} />
              )}

              <motion.p className="text-xs uppercase tracking-[0.3em] mb-4 font-semibold"
                style={{ color: c.red }}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                {data.tagline || "Director · Cinematographer · Editor"}
              </motion.p>

              <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9]"
                style={{ color: c.text }}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                {data.title || data.userName}
              </motion.h1>

              {about && "bio" in about && about.bio && (
                <motion.p className="mt-6 text-sm leading-relaxed" style={{ color: c.muted }}
                  initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                  {about.bio}
                </motion.p>
              )}

              <motion.div className="mt-8 flex items-center gap-6"
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.muted} iconSize={22} />}
              </motion.div>
            </div>

            {/* # Right: showreel video embed if available */}
            {showreelVideo && hasVideo(showreelVideo) && (
              <motion.div className="flex-1 w-full max-w-2xl"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}>
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${c.red}20`, boxShadow: `0 0 60px ${c.red}10` }}>
                  <VideoEmbed
                    videoUrl={showreelVideo.videoUrl}
                    thumbnailUrl={showreelVideo.imageUrl || undefined}
                    title={showreelVideo.title}
                    accentColor={c.red}
                  />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-center" style={{ color: c.red }}>
                  {showreelVideo.title || "Showreel"}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Letterbox />
    </motion.section>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-8 h-px" style={{ backgroundColor: c.red }} />
        {subtitle && <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: c.red }}>{subtitle}</span>}
      </div>
      <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: c.text }}>{title}</h2>
    </div>
  );
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <SectionHeading title="Featured Work" subtitle="Selected Projects" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-10">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}>
                <FilmCard featured>
                  {/* # Video or image showcase — full width on top */}
                  <div className="relative w-full group">
                    {hasVideo(p) ? (
                      <VideoEmbed
                        videoUrl={p.videoUrl}
                        thumbnailUrl={p.imageUrl || undefined}
                        title={p.title}
                        accentColor={c.red}
                      />
                    ) : p.imageUrl ? (
                      <div className="aspect-video overflow-hidden">
                        <img src={p.imageUrl} alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        {/* # Cinematic overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: `linear-gradient(180deg, transparent 60%, ${c.bg}cc)` }} />
                      </div>
                    ) : (
                      <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: c.surface }}>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                            style={{ border: `2px solid ${c.border}` }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={c.muted}><polygon points="8,5 20,12 8,19" /></svg>
                          </div>
                          <p className="text-xs" style={{ color: c.muted }}>Video Project</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* # Project info below the video */}
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-xs uppercase tracking-widest" style={{ color: c.red }}>
                          Project {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-2xl font-bold mt-1" style={{ color: c.text }}>{p.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed max-w-2xl" style={{ color: c.muted }}>{p.description}</p>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-bold px-6 py-2.5 rounded-lg transition-all hover:opacity-90"
                            style={{ backgroundColor: c.red, color: "#ffffff", boxShadow: `0 4px 20px ${c.red}30` }}>
                            Watch Film →
                          </a>
                        )}
                        {p.repoUrl && (
                          <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-semibold px-6 py-2.5 rounded-lg transition-all hover:opacity-80"
                            style={{ color: c.muted, border: `1px solid ${c.border}` }}>
                            Behind the Scenes
                          </a>
                        )}
                      </div>
                    </div>
                    {p.techStack.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {p.techStack.map((t, j) => (
                          <span key={j} className="text-xs px-3 py-1 rounded-full"
                            style={{ backgroundColor: c.redSoft, color: c.red, border: `1px solid ${c.red}15` }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </FilmCard>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      /* # Split gallery into videos and stills */
      const videos = section.entries.filter((g) => hasVideo(g));
      const stills = section.entries.filter((g) => !hasVideo(g));

      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <SectionHeading title="Visual Reel" subtitle="Stills & Frames" />

          {/* # Video gallery — larger cards with embeds */}
          {videos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {videos.map((g, i) => (
                <motion.div key={`v-${i}`} className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${c.border}` }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <VideoEmbed
                    videoUrl={g.videoUrl}
                    thumbnailUrl={g.imageUrl || undefined}
                    title={g.title}
                    accentColor={c.red}
                  />
                  {(g.title || g.description) && (
                    <div className="p-4" style={{ backgroundColor: c.card }}>
                      {g.title && <p className="font-bold text-sm" style={{ color: c.text }}>{g.title}</p>}
                      {g.description && <p className="text-xs mt-1" style={{ color: c.muted }}>{g.description}</p>}
                      {g.category && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: c.redSoft, color: c.red }}>{g.category}</span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* # Still frames grid */}
          {stills.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stills.map((g, i) => (
                <motion.a key={`s-${i}`} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                  className="group relative rounded-lg overflow-hidden aspect-video"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-75" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(180deg, transparent 50%, ${c.bg}ee)` }}>
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-white font-bold text-sm">{g.title}</p>
                      {g.description && <p className="text-white/60 text-xs mt-0.5">{g.description}</p>}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </SectionWrapper>
      );

    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Career" subtitle="Experience" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-6">
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem}>
                <FilmCard className="p-7">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                      <p className="text-sm font-medium mt-1" style={{ color: c.red }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                    </div>
                    <span className="text-xs uppercase tracking-widest shrink-0" style={{ color: c.muted }}>
                      {e.startDate} — {e.endDate || "Present"}
                    </span>
                  </div>
                  {e.achievements.length > 0 && (
                    <ul className="mt-5 space-y-2">
                      {e.achievements.map((a, j) => (
                        <li key={j} className="text-sm flex items-start gap-3" style={{ color: c.muted }}>
                          <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: c.red }} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </FilmCard>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>
      );

    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Toolkit" subtitle="Skills & Software" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g, i) => (
              <FilmCard key={i} className="p-6">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4" style={{ color: c.red }}>{g.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s, j) => (
                    <span key={j} className="text-sm px-3.5 py-1.5 rounded-lg"
                      style={{ backgroundColor: c.surface, color: c.text, border: `1px solid ${c.border}` }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </FilmCard>
            ))}
          </div>
        </SectionWrapper>
      );
    }

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Education" subtitle="Background" />
          <div className="space-y-4">
            {section.entries.map((e, i) => (
              <FilmCard key={i} className="p-6">
                <h3 className="text-lg font-bold" style={{ color: c.text }}>{e.degree}</h3>
                <p className="text-sm mt-0.5" style={{ color: c.red }}>{e.school}</p>
                {e.startDate && <p className="text-xs mt-1" style={{ color: c.muted }}>{e.startDate} — {e.endDate}</p>}
                {e.description && <p className="text-sm mt-3" style={{ color: c.muted }}>{e.description}</p>}
              </FilmCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "awards":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Awards & Recognition" subtitle="Honors" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.entries.map((a, i) => (
              <FilmCard key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: c.redSoft, border: `1px solid ${c.red}20` }}>
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: c.text }}>{a.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: c.red }}>{a.issuer}{a.date ? ` · ${a.date}` : ""}</p>
                    {a.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{a.description}</p>}
                  </div>
                </div>
              </FilmCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Certifications" />
          <div className="space-y-3">
            {section.entries.map((cert, i) => (
              <FilmCard key={i} className="p-5">
                <div className="flex items-center gap-3">
                  <span style={{ color: c.red }}>✓</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: c.text }}>{cert.name}</p>
                    <p className="text-xs" style={{ color: c.muted }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                  </div>
                </div>
              </FilmCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Collaborator Reviews" subtitle="Testimonials" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <FilmCard key={i} className="p-7">
                <div className="text-3xl mb-3" style={{ color: c.red, opacity: 0.4 }}>&ldquo;</div>
                <p className="text-sm italic leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>
                <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
                  <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
                  <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? ` · ${t.company}` : ""}</p>
                </div>
              </FilmCard>
            ))}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto text-center">
          <SectionHeading title="Let's Create" subtitle="Contact" />
          <p className="mb-10 text-base" style={{ color: c.muted }}>Ready to bring your vision to life? Let&apos;s talk.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {section.email && (
              <a href={`mailto:${section.email}`}
                className="px-8 py-3 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90 hover:shadow-lg"
                style={{ backgroundColor: c.red, boxShadow: `0 4px 20px ${c.red}30` }}>
                Get in Touch
              </a>
            )}
            {section.calendarLink && (
              <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                className="px-8 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-80"
                style={{ color: c.text, border: `1px solid ${c.border}` }}>
                Book a Call
              </a>
            )}
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

export default function VideographerTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* # Film grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <Hero data={data} />

      <StatsBar data={data} variant="minimal" colors={{
        bg: c.bg, text: c.text, accent: c.red, muted: c.muted, border: c.border,
      }} />

      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i) => (
          <div key={`${section.type}-${i}`}>{renderSection(section)}</div>
        ))}

      <footer className="py-16 text-center text-xs" style={{ color: c.muted, borderTop: `1px solid ${c.border}` }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: c.red }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
