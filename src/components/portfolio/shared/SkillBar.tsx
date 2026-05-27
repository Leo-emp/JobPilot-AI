"use client";

/* # Animated skill proficiency bar for portfolio templates */

import { motion } from "framer-motion";

export function SkillBar({
  name,
  proficiency = 80,
  color = "#3b82f6",
  bgColor = "#e5e7eb",
  textColor = "#1f2937",
}: {
  name: string;
  proficiency?: number;
  color?: string;
  bgColor?: string;
  textColor?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium" style={{ color: textColor }}>{name}</span>
        <span className="text-xs" style={{ color: textColor, opacity: 0.6 }}>{proficiency}%</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: bgColor }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

/* # Skill pill badge — used in minimal/modern templates */
export function SkillPill({
  name,
  color = "#3b82f6",
  textColor = "#ffffff",
}: {
  name: string;
  color?: string;
  textColor?: string;
}) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {name}
    </span>
  );
}
