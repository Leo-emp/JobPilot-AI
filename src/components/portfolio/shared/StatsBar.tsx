"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import type { PortfolioData } from "@/lib/portfolio-types";

/* # Animated number that counts up from 0 when scrolled into view */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* # Extract stats from portfolio data */
function extractStats(data: PortfolioData) {
  const stats: { label: string; value: number; suffix: string }[] = [];

  const exp = data.sections.find(s => s.type === "experience" && s.visible);
  if (exp && "entries" in exp && exp.entries.length > 0) {
    stats.push({ label: "Years Experience", value: exp.entries.length, suffix: "+" });
  }

  const proj = data.sections.find(s => s.type === "projects" && s.visible);
  if (proj && "entries" in proj && proj.entries.length > 0) {
    stats.push({ label: "Projects", value: proj.entries.length, suffix: "" });
  }

  const skills = data.sections.find(s => s.type === "skills" && s.visible);
  if (skills && "groups" in skills) {
    const total = skills.groups.reduce((sum, g) => sum + g.skills.length, 0);
    if (total > 0) stats.push({ label: "Skills", value: total, suffix: "+" });
  }

  const certs = data.sections.find(s => s.type === "certifications" && s.visible);
  if (certs && "entries" in certs && certs.entries.length > 0) {
    stats.push({ label: "Certifications", value: certs.entries.length, suffix: "" });
  }

  const pubs = data.sections.find(s => s.type === "publications" && s.visible);
  if (pubs && "entries" in pubs && pubs.entries.length > 0) {
    stats.push({ label: "Publications", value: pubs.entries.length, suffix: "" });
  }

  return stats;
}

export type StatsVariant = "terminal" | "glass" | "minimal" | "editorial" | "serif";

interface StatsBarProps {
  data: PortfolioData;
  variant?: StatsVariant;
  colors?: {
    bg?: string;
    text?: string;
    accent?: string;
    muted?: string;
    border?: string;
  };
}

export function StatsBar({ data, variant = "minimal", colors = {} }: StatsBarProps) {
  const stats = extractStats(data);
  if (stats.length === 0) return null;

  const {
    bg = "transparent",
    text = "#ffffff",
    accent = "#00ff88",
    muted = "#888888",
    border = "rgba(255,255,255,0.1)",
  } = colors;

  if (variant === "terminal") {
    return (
      <motion.div
        className="flex flex-wrap justify-center gap-6 md:gap-10 py-8 px-6"
        style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, background: bg }}
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-bold font-mono" style={{ color: accent }}>
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs font-mono uppercase tracking-widest mt-1" style={{ color: muted }}>{s.label}</div>
          </div>
        ))}
      </motion.div>
    );
  }

  if (variant === "glass") {
    return (
      <motion.div
        className="flex flex-wrap justify-center gap-4 md:gap-6 py-8 px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        {stats.map((s, i) => (
          <motion.div key={i}
            className="flex-1 min-w-[120px] max-w-[180px] text-center py-5 px-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${border}`,
              backdropFilter: "blur(12px)",
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="text-3xl font-bold" style={{ color: accent }}>
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs uppercase tracking-wider mt-1.5" style={{ color: muted }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (variant === "editorial") {
    return (
      <motion.div
        className="flex flex-wrap items-center justify-center gap-6 md:gap-8 py-8 px-6"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.8 }}
      >
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: text }}>
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs uppercase tracking-widest mt-1" style={{ color: muted }}>{s.label}</div>
            </div>
            {i < stats.length - 1 && (
              <div className="hidden md:block text-lg" style={{ color: accent }}>◆</div>
            )}
          </div>
        ))}
      </motion.div>
    );
  }

  if (variant === "serif") {
    return (
      <motion.div
        className="flex flex-wrap items-center justify-center gap-8 py-8 px-6"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.8 }}
      >
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: text, fontFamily: "Lora, 'Times New Roman', serif" }}>
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs uppercase tracking-widest mt-1" style={{ color: muted }}>{s.label}</div>
            </div>
            {i < stats.length - 1 && (
              <div className="hidden md:block" style={{ width: 1, height: 32, background: border }} />
            )}
          </div>
        ))}
      </motion.div>
    );
  }

  /* # Minimal variant — default */
  return (
    <motion.div
      className="flex flex-wrap items-center justify-center gap-8 md:gap-12 py-8 px-6"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
    >
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold" style={{ color: text }}>
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs uppercase tracking-widest mt-1.5" style={{ color: muted }}>{s.label}</div>
          </div>
          {i < stats.length - 1 && (
            <div className="hidden md:block" style={{ width: 1, height: 40, background: border }} />
          )}
        </div>
      ))}
    </motion.div>
  );
}
