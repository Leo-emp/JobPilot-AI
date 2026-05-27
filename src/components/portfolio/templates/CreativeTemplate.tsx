"use client";

/* ============================================================
   CREATIVE TEMPLATE — Bold gradients, visual emphasis
   ============================================================
   Font: Space Grotesk headings, Inter body
   Colors: Vibrant gradients, coral/electric blue/purple
   Hero: Full-width gradient background, oversized name
   ============================================================ */

import { motion } from "framer-motion";
import type { PortfolioData, PortfolioSection } from "@/lib/portfolio-types";
import { SectionWrapper, staggerContainer, staggerItem } from "../shared/SectionWrapper";
import { SocialIcons } from "../shared/SocialIcons";

const c = {
  bg: "#0f0f1a",
  surface: "#1a1a2e",
  card: "#16162a",
  text: "#f0f0f5",
  muted: "#8888a0",
  pink: "#ec4899",
  purple: "#a855f7",
  blue: "#3b82f6",
  gradient: "linear-gradient(135deg, #ec4899, #a855f7, #3b82f6)",
  border: "#2a2a40",
};

function Hero({ data }: { data: PortfolioData }) {
  const about = data.sections.find((s) => s.type === "about" && s.visible);
  const avatarUrl = (about && "avatarUrl" in about ? about.avatarUrl : null) || data.avatarUrl || data.userImage;

  return (
    <motion.header
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      {/* # Animated gradient background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #1a0030 0%, #0f0f1a 30%, #0a1628 60%, #1a0030 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 12s ease infinite",
      }} />
      {/* # Floating orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-[100px] opacity-20" style={{ background: c.pink }} />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-[120px] opacity-15" style={{ background: c.purple }} />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col items-center text-center">
          {avatarUrl && (
            <motion.img src={avatarUrl} alt={data.userName}
              className="w-36 h-36 rounded-full object-cover mb-8 shadow-2xl"
              style={{ border: "4px solid transparent", backgroundClip: "padding-box", boxShadow: `0 0 40px ${c.pink}30` }}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}
            />
          )}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", background: c.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {data.title || data.userName}
          </h1>
          {data.tagline && (
            <p className="text-xl md:text-2xl mt-4 font-medium" style={{ color: c.muted }}>{data.tagline}</p>
          )}
          {about && "bio" in about && about.bio && (
            <p className="mt-6 text-lg max-w-2xl leading-relaxed" style={{ color: c.muted }}>{about.bio}</p>
          )}
          <div className="mt-8">
            {data.socialLinks && <SocialIcons links={data.socialLinks} color={c.text} iconSize={24} />}
          </div>
        </div>
      </div>

      <style>{`@keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
    </motion.header>
  );
}

function GradientDivider() {
  return <div className="h-px mx-auto max-w-5xl" style={{ background: c.gradient, opacity: 0.3 }} />;
}

function renderSection(section: PortfolioSection) {
  switch (section.type) {
    case "experience":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>Experience</h2>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {section.entries.map((e, i) => (
              <motion.div key={i} variants={staggerItem}
                className="mb-6 rounded-2xl p-6 backdrop-blur-sm transition-all hover:scale-[1.01]"
                style={{ backgroundColor: `${c.card}cc`, border: `1px solid ${c.border}` }}>
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: c.text }}>{e.title}</h3>
                    <p className="text-sm font-medium" style={{ color: c.pink }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                  </div>
                  <span className="text-sm mt-1 md:mt-0 shrink-0" style={{ color: c.muted }}>{e.startDate} — {e.endDate || "Present"}</span>
                </div>
                {e.achievements.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {e.achievements.map((a, j) => (
                      <li key={j} className="text-sm flex items-start gap-2" style={{ color: c.muted }}>
                        <span style={{ color: c.purple }}>✦</span> {a}
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
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {section.groups.flatMap((g) => g.skills).map((s, i) => (
              <motion.span key={i}
                className="px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: `linear-gradient(135deg, ${c.pink}20, ${c.purple}20)`, color: c.text, border: `1px solid ${c.border}` }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${c.pink}30` }}
              >
                {s.name}
              </motion.span>
            ))}
          </div>
        </SectionWrapper>
      );

    case "projects":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>Projects</h2>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((p, i) => (
              <motion.div key={i} variants={staggerItem}
                className="rounded-2xl overflow-hidden group transition-all hover:scale-[1.02]"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}>
                {p.imageUrl && (
                  <div className="overflow-hidden h-48">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold" style={{ color: c.text }}>{p.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: c.muted }}>{p.description}</p>
                  {p.techStack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.techStack.map((t, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${c.purple}20`, color: c.purple }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-4 text-sm font-medium">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: c.pink }} className="hover:underline">Live Demo →</a>}
                    {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: c.blue }} className="hover:underline">Source</a>}
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
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>Education</h2>
          {section.entries.map((e, i) => (
            <div key={i} className="mb-4 rounded-2xl p-6" style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}>
              <h3 className="text-lg font-bold" style={{ color: c.text }}>{e.degree}</h3>
              <p className="text-sm" style={{ color: c.pink }}>{e.school} {e.startDate && `· ${e.startDate} — ${e.endDate}`}</p>
              {e.description && <p className="text-sm mt-2" style={{ color: c.muted }}>{e.description}</p>}
            </div>
          ))}
        </SectionWrapper>
      );

    case "gallery":
      if (section.entries.length === 0) return null;
      return (
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>Gallery</h2>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {section.entries.map((g, i) => (
              <a key={i} href={g.link || g.imageUrl} target="_blank" rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden group break-inside-avoid">
                <div className="relative">
                  <img src={g.imageUrl} alt={g.title} className="w-full transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
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
          <h2 className="text-3xl font-extrabold mb-10 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.entries.map((t, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${c.pink}08, ${c.purple}08)`, border: `1px solid ${c.border}` }}>
                <p className="text-sm italic leading-relaxed" style={{ color: c.muted }}>"{t.quote}"</p>
                <div className="mt-4">
                  <p className="font-bold text-sm" style={{ color: c.text }}>{t.author}</p>
                  <p className="text-xs" style={{ color: c.pink }}>{t.role}{t.company ? ` at ${t.company}` : ""}</p>
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
        <SectionWrapper className="py-20 px-6 md:px-12 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }}>Let's Connect</h2>
          <p className="mb-8" style={{ color: c.muted }}>Have a project in mind? Let's make something amazing together.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {section.email && (
              <a href={`mailto:${section.email}`} className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
                style={{ background: c.gradient }}>
                Email Me
              </a>
            )}
            {section.calendarLink && (
              <a href={section.calendarLink} target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                style={{ color: c.text, border: `2px solid ${c.border}` }}>
                Schedule a Call
              </a>
            )}
          </div>
        </SectionWrapper>
      );
    }

    default: return null;
  }
}

export default function CreativeTemplate({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Hero data={data} />
      {data.sections
        .filter((s) => s.visible && s.type !== "about")
        .map((section, i, arr) => (
          <div key={`${section.type}-${i}`}>
            {i > 0 && <GradientDivider />}
            {renderSection(section)}
          </div>
        ))}
      <footer className="py-8 text-center text-xs" style={{ color: c.muted }}>
        Built with <a href="https://jobpilotai.co" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: c.pink }}>JobPilot AI</a>
      </footer>
    </div>
  );
}
