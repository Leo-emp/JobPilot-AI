/* ============================================================
   STAR FIELD - Animated Background Stars
   ============================================================
   Creates a subtle star field effect behind the entire page.
   Three layers of stars at different sizes create depth.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generated: Star[] = [];
    for (let i = 0; i < 120; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 3,
      });
    }
    setStars(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dot grid pattern */}
      <div className="absolute inset-0 grid-bg" />

      {/* Subtle top glow — very faint blue, not purple */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)",
        }}
      />

      {/* Stars — white/light blue dots with subtle pulse */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.size > 1.5 ? "#dbeafe" : "#e2e8f0",
            animation: `pulse-subtle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            boxShadow:
              star.size > 1.5
                ? `0 0 ${star.size * 2}px rgba(147,197,253,0.15)`
                : "none",
          }}
        />
      ))}
    </div>
  );
}
