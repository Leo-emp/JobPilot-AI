"use client";

/* # Videographer Template — Cinematic widescreen with actual video embeds, showreel hero, film aesthetic */
/* # PREMIUM LANDING PAGE — no section should look like a resume, all text sections have visual treatments */

import Image from "next/image";
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
  goldSoft: "#d4a85315",
  border: "rgba(255,255,255,0.06)",
  shadow: "0 8px 40px rgba(0,0,0,0.4)",
};

/* # Unique gradient accents for skill categories and experience entries */
const categoryGradients = [
  { from: "#e50914", to: "#ff4d4d" },
  { from: "#d4a853", to: "#f0d78c" },
  { from: "#e50914", to: "#d4a853" },
  { from: "#ff4d4d", to: "#ff8c42" },
  { from: "#d4a853", to: "#e50914" },
  { from: "#ff8c42", to: "#e50914" },
];

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
                        <Image src={p.imageUrl} alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" fill unoptimized />
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
                            style={{
                              background: `linear-gradient(135deg, ${c.red}, #ff4d4d)`,
                              color: "#ffffff",
                              boxShadow: `0 4px 20px ${c.red}40`,
                            }}>
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
                          <span key={j} className="text-xs px-3 py-1 rounded-full transition-all duration-200"
                            style={{
                              background: `linear-gradient(135deg, ${c.red}15, ${c.gold}10)`,
                              color: c.red,
                              border: `1px solid ${c.red}20`,
                            }}>
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

          {/* # Video gallery — featured hero + bento grid for remaining */}
          {videos.length > 0 && (
            <div className="mb-10">
              {/* # First video hero — full width cinematic */}
              <motion.div className="rounded-xl overflow-hidden mb-6"
                style={{ border: `1px solid ${c.border}` }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}>
                <div className="relative">
                  <VideoEmbed
                    videoUrl={videos[0].videoUrl}
                    thumbnailUrl={videos[0].imageUrl || undefined}
                    title={videos[0].title}
                    accentColor={c.red}
                    aspectRatio="21/9"
                  />
                  {/* # Featured badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md"
                    style={{ backgroundColor: `${c.red}30`, border: `1px solid ${c.red}40` }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: c.red }} />
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: c.red }}>Featured</span>
                  </div>
                </div>
                {(videos[0].title || videos[0].description) && (
                  <div className="p-5" style={{ backgroundColor: c.card }}>
                    {videos[0].title && <p className="font-bold text-base" style={{ color: c.text }}>{videos[0].title}</p>}
                    {videos[0].description && <p className="text-sm mt-1.5" style={{ color: c.muted }}>{videos[0].description}</p>}
                    {videos[0].category && (
                      <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full"
                        style={{ backgroundColor: c.redSoft, color: c.red }}>{videos[0].category}</span>
                    )}
                  </div>
                )}
              </motion.div>

              {/* # Remaining videos in a responsive grid with varying sizes */}
              {videos.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.slice(1).map((g, i) => (
                    <motion.div key={`v-${i}`}
                      className={`rounded-xl overflow-hidden ${i === 0 && videos.length > 3 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                      style={{ border: `1px solid ${c.border}` }}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4, boxShadow: `0 12px 30px rgba(0,0,0,0.3)` }}>
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
            </div>
          )}

          {/* # Still frames — bento grid with varying sizes */}
          {stills.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[160px] md:auto-rows-[200px] gap-3">
              {stills.map((g, i) => {
                /* # Bento pattern for visual variety */
                const bentoClass = (() => {
                  const total = stills.length;
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
                  <motion.a key={`s-${i}`} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                    className={`group relative rounded-lg overflow-hidden ${bentoClass}`}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <Image src={g.imageUrl} alt={g.title} className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-75" fill unoptimized />

                    {/* # Featured badge on first still */}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                        style={{ backgroundColor: `${c.gold}25`, border: `1px solid ${c.gold}35`, color: c.gold }}>
                        Featured
                      </div>
                    )}

                    {/* # Category badge */}
                    {g.category && i !== 0 && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)", color: c.gold }}>
                        {g.category}
                      </div>
                    )}

                    {/* # Gradient overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, transparent 40%, ${c.red}15 70%, ${c.bg}ee)` }}>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold text-sm">{g.title}</p>
                        {g.description && <p className="text-white/60 text-xs mt-1">{g.description}</p>}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </SectionWrapper>
      );

    /* # ─── EXPERIENCE — Cinematic credits layout: role ··· company ─── */
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-16 max-w-5xl mx-auto">
          <SectionHeading title="Production Credits" subtitle="Career" />
          <div className="space-y-3">
            {section.entries.map((e, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden"
                  style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
                  whileHover={{ y: -2, boxShadow: `0 8px 25px rgba(0,0,0,0.3)`, borderColor: `${gradient.from}30` }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ background: `linear-gradient(180deg, ${gradient.from}, ${gradient.to})` }} />

                  <div className="p-4 pl-4.5">
                    {/* # Credits-style header: Title ········ Company */}
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <h3 className="text-sm font-bold shrink-0" style={{ color: c.text }}>{e.title}</h3>
                      <div className="flex-1 border-b border-dotted mx-1" style={{ borderColor: `${c.muted}30` }} />
                      <span className="text-sm font-semibold shrink-0" style={{
                        background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>{e.company}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                      {e.location && <span className="text-[10px]" style={{ color: c.muted }}>{e.location}</span>}
                      {(e.startDate || e.endDate) && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: `${gradient.from}15`, color: gradient.from }}>
                          {e.startDate} — {e.endDate || "Present"}
                        </span>
                      )}
                    </div>

                    {e.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {e.achievements.map((a, j) => (
                          <div key={j} className="flex items-start gap-1.5">
                            <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-sm rotate-45"
                              style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }} />
                            <span className="text-xs leading-relaxed" style={{ color: c.muted }}>{a}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );

    case "skills": {
      const groups = autoCategorizeSkills(section.groups);
      if (groups.length === 0) return null;
      return (
        <SectionWrapper className="py-28 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Toolkit" subtitle="Skills & Software" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g, i) => {
              /* # Each category card gets a unique gradient accent */
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: c.card,
                    border: `1px solid ${c.border}`,
                  }}
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${gradient.from}10` }}
                  transition={{ duration: 0.25 }}
                >
                  {/* # Gradient top strip — unique per category */}
                  <div className="h-1" style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }} />

                  <div className="p-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4" style={{
                      background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                      {g.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {g.skills.map((s, j) => (
                        <motion.span key={j}
                          className="text-sm px-3.5 py-1.5 rounded-lg cursor-default transition-all duration-200"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from}08, ${gradient.to}05)`,
                            color: c.text,
                            border: `1px solid ${gradient.from}15`,
                          }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: `0 0 12px ${gradient.from}20`,
                          }}
                        >
                          {s.name}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );
    }

    case "education":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Education" subtitle="Background" />
          <div className="space-y-5">
            {section.entries.map((e, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden group"
                  style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
                  whileHover={{ y: -3, boxShadow: `0 8px 30px ${gradient.from}08` }}
                  transition={{ duration: 0.2 }}
                >
                  {/* # Gradient header strip */}
                  <div className="h-1.5" style={{
                    background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to}, transparent)`,
                  }} />

                  <div className="p-7">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1">
                        {/* # Degree name — large and prominent */}
                        <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.degree}</h3>
                        {/* # School in gradient accent color */}
                        <p className="text-sm font-semibold mt-1.5" style={{
                          background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>
                          {e.school}
                        </p>
                      </div>
                      {/* # Year in gradient badge */}
                      {e.startDate && (
                        <span className="inline-flex items-center self-start text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from}18, ${gradient.to}10)`,
                            color: gradient.from,
                            border: `1px solid ${gradient.from}20`,
                          }}>
                          {e.startDate} — {e.endDate || "Present"}
                        </span>
                      )}
                    </div>
                    {e.description && (
                      <p className="text-sm mt-4 leading-relaxed" style={{ color: c.muted }}>{e.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
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
              <motion.div key={i}
                className="relative rounded-xl overflow-hidden group"
                style={{
                  backgroundColor: c.card,
                  border: `1px solid ${c.gold}15`,
                }}
                whileHover={{ y: -4, boxShadow: `0 12px 40px ${c.gold}10` }}
                transition={{ duration: 0.25 }}
              >
                {/* # Gold/amber gradient accent strip */}
                <div className="h-1" style={{
                  background: `linear-gradient(90deg, ${c.gold}, ${c.red}, ${c.gold})`,
                }} />

                <div className="p-7">
                  <div className="flex items-start gap-4">
                    {/* # Trophy-style icon with gradient glow */}
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(135deg, ${c.gold}20, ${c.red}15)`,
                        border: `1px solid ${c.gold}25`,
                      }}>
                      {/* # Glow effect behind trophy */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: `0 0 20px ${c.gold}20` }} />
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 1 }}>
                        <path d="M8 21h8m-4-4v4m-5-8a5 5 0 0 1-3-4.5V4h16v4.5A5 5 0 0 1 13 13h-2z"
                          stroke={c.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3"
                          stroke={c.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg" style={{ color: c.text }}>{a.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-sm font-medium" style={{
                          background: `linear-gradient(90deg, ${c.gold}, ${c.red})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>
                          {a.issuer}
                        </span>
                        {a.date && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                            style={{
                              background: `${c.gold}12`,
                              color: c.gold,
                              border: `1px solid ${c.gold}20`,
                            }}>
                            {a.date}
                          </span>
                        )}
                      </div>
                      {a.description && <p className="text-sm mt-3 leading-relaxed" style={{ color: c.muted }}>{a.description}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      );

    case "certifications":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Certifications" subtitle="Credentials" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.entries.map((cert, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.from}08, ${c.card} 30%, ${c.card})`,
                    border: `1px solid ${gradient.from}15`,
                  }}
                  whileHover={{ y: -3, boxShadow: `0 8px 25px ${gradient.from}10` }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6 flex items-center gap-4">
                    {/* # Shield/badge-style icon with gradient fill */}
                    <div className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(135deg, ${gradient.from}25, ${gradient.to}15)`,
                        border: `1px solid ${gradient.from}30`,
                      }}>
                      {/* # Checkmark with accent glow */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 1 }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                          fill={`${gradient.from}30`} stroke={gradient.from} strokeWidth="1.5" />
                      </svg>
                      {/* # Glow on hover */}
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: `0 0 15px ${gradient.from}20` }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: c.text }}>{cert.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-xs font-medium" style={{ color: gradient.from }}>{cert.issuer}</p>
                        {cert.date && (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: `${gradient.from}12`,
                              color: gradient.from,
                              border: `1px solid ${gradient.from}15`,
                            }}>
                            {cert.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );

    case "testimonials":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
          <SectionHeading title="Collaborator Reviews" subtitle="Testimonials" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => {
              const gradient = categoryGradients[i % categoryGradients.length];
              return (
                <motion.div key={i}
                  className="relative rounded-xl overflow-hidden group"
                  style={{
                    background: `linear-gradient(145deg, ${gradient.from}06, ${c.card} 40%, ${c.card})`,
                    border: `1px solid ${gradient.from}12`,
                  }}
                  whileHover={{ y: -3, boxShadow: `0 8px 30px ${gradient.from}08` }}
                  transition={{ duration: 0.2 }}
                >
                  {/* # Gradient side border accent */}
                  <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                    style={{ background: `linear-gradient(180deg, ${gradient.from}, ${gradient.to})` }} />

                  <div className="p-8 pl-6">
                    {/* # Large decorative gradient quote marks */}
                    <div className="text-5xl font-serif leading-none mb-4 select-none" style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      opacity: 0.5,
                    }}>
                      &ldquo;
                    </div>

                    <p className="text-sm italic leading-relaxed" style={{ color: c.muted }}>{t.quote}</p>

                    {/* # Author with colored avatar badge */}
                    <div className="mt-6 pt-4 flex items-center gap-3" style={{ borderTop: `1px solid ${c.border}` }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${gradient.from}30, ${gradient.to}20)`,
                          color: gradient.from,
                          border: `1px solid ${gradient.from}25`,
                        }}>
                        {t.author?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
                        <p className="text-xs" style={{ color: c.muted }}>{t.role}{t.company ? ` · ${t.company}` : ""}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionWrapper>
      );

    case "contact": {
      const hasContent = section.email || section.phone || section.location;
      if (!hasContent) return null;
      return (
        <SectionWrapper className="py-24 px-6 md:px-16">
          {/* # Full-width cinematic dark background CTA */}
          <div className="relative max-w-6xl mx-auto rounded-2xl overflow-hidden">
            {/* # Background gradient with film grain */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(135deg, ${c.surface} 0%, #0d0d0d 40%, ${c.red}08 100%)`,
            }} />
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
            {/* # Red glow accent */}
            <div className="absolute bottom-0 right-0 w-[300px] h-[200px] rounded-full blur-[120px]"
              style={{ background: c.red, opacity: 0.06 }} />

            <div className="relative z-10 py-20 px-8 md:px-16 text-center">
              {/* # Film reel decorative line */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-px" style={{ backgroundColor: c.red }} />
                <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: c.red }}>Contact</span>
                <div className="w-8 h-px" style={{ backgroundColor: c.red }} />
              </div>

              {/* # Large heading */}
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: c.text }}>
                Let&apos;s Create Together
              </h2>
              <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: c.muted }}>
                Ready to bring your vision to life? Let&apos;s talk about your next production.
              </p>

              {/* # Contact info in styled cards */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {section.email && (
                  <div className="px-5 py-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: `linear-gradient(135deg, ${c.red}10, ${c.card})`,
                      border: `1px solid ${c.red}15`,
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.red} strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="text-sm" style={{ color: c.text }}>{section.email}</span>
                  </div>
                )}
                {section.phone && (
                  <div className="px-5 py-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: `linear-gradient(135deg, ${c.red}10, ${c.card})`,
                      border: `1px solid ${c.red}15`,
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.red} strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="text-sm" style={{ color: c.text }}>{section.phone}</span>
                  </div>
                )}
                {section.location && (
                  <div className="px-5 py-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: `linear-gradient(135deg, ${c.red}10, ${c.card})`,
                      border: `1px solid ${c.red}15`,
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.red} strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-sm" style={{ color: c.text }}>{section.location}</span>
                  </div>
                )}
              </div>

              {/* # Gradient CTA buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                {section.email && (
                  <a href={`mailto:${section.email}`}
                    className="px-10 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${c.red}, #ff4d4d)`,
                      boxShadow: `0 4px 25px ${c.red}40`,
                    }}>
                    Get in Touch
                  </a>
                )}
                {section.calendarLink && (
                  <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                    className="px-10 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                    style={{ color: c.text, border: `1px solid ${c.border}` }}>
                    Book a Call
                  </a>
                )}
              </div>
            </div>
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
