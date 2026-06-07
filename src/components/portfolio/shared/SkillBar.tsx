"use client";

/* # Animated skill proficiency bar with dual-tone gradient fill and glow effect */

import { motion } from "framer-motion";

export function SkillBar({
  name,
  proficiency = 80,
  /* # Dual-tone gradient: pass two colors for the signature blend */
  gradientFrom = "#7c3aed",
  gradientTo = "#4f46e5",
  textColor = "#ffffff",
  mutedColor = "rgba(255,255,255,0.5)",
}: {
  name: string;
  proficiency?: number;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  mutedColor?: string;
}) {
  return (
    <div className="mb-4">
      {/* # Label row: skill name left, percentage right */}
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-semibold" style={{ color: textColor }}>
          {name}
        </span>
        <span className="text-xs font-semibold" style={{ color: mutedColor }}>
          {proficiency}%
        </span>
      </div>
      {/* # Bar track */}
      <div
        className="w-full h-[5px] rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
      >
        {/* # Animated gradient fill with glow */}
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
            boxShadow: `0 0 12px ${gradientFrom}40`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

/* # Skill pill badge — used across templates for tag-style skill display */
export function SkillPill({
  name,
  color = "#3b82f6",
}: {
  name: string;
  color?: string;
}) {
  return (
    <span
      className="inline-block px-3 py-1.5 rounded-lg text-sm font-medium mr-2 mb-2"
      style={{
        backgroundColor: `${color}10`,
        color,
        border: `1px solid ${color}18`,
      }}
    >
      {name}
    </span>
  );
}
