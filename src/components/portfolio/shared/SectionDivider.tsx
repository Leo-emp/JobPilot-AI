"use client";

import { motion } from "framer-motion";

type DividerVariant = "wave" | "gradient" | "dots" | "diamond" | "terminal";

interface SectionDividerProps {
  variant?: DividerVariant;
  color?: string;
  bg?: string;
  flip?: boolean;
}

export function SectionDivider({ variant = "gradient", color = "#00ff88", bg = "transparent", flip = false }: SectionDividerProps) {
  if (variant === "wave") {
    return (
      <div className="relative w-full overflow-hidden" style={{ height: 80, background: bg, transform: flip ? "rotate(180deg)" : undefined }}>
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <path
            d="M0 40 C360 80 720 0 1080 40 C1260 60 1380 20 1440 40 V80 H0 Z"
            fill={color} fillOpacity="0.06"
          />
          <path
            d="M0 50 C320 20 640 70 960 40 C1200 20 1360 60 1440 50"
            stroke={color} strokeOpacity="0.15" strokeWidth="1.5" fill="none"
          />
        </svg>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className="flex items-center justify-center gap-2 py-8" style={{ background: bg }}>
        {[...Array(5)].map((_, i) => (
          <motion.div key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color, opacity: 0.3 }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (variant === "diamond") {
    return (
      <div className="flex items-center justify-center gap-4 py-6" style={{ background: bg }}>
        <div className="flex-1 max-w-[200px] h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}40)` }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color, opacity: 0.5 }} />
        <div className="flex-1 max-w-[200px] h-px" style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />
      </div>
    );
  }

  if (variant === "terminal") {
    return (
      <div className="flex items-center justify-center py-6 px-6" style={{ background: bg }}>
        <div className="flex-1 max-w-2xl h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}30, transparent)` }} />
        <motion.div className="mx-4 w-2 h-4 rounded-sm" style={{ backgroundColor: color, opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <div className="flex-1 max-w-2xl h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}30, transparent)` }} />
      </div>
    );
  }

  /* # Gradient variant — default */
  return (
    <div className="flex justify-center py-6" style={{ background: bg }}>
      <div className="w-full max-w-md h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}25, transparent)` }} />
    </div>
  );
}
