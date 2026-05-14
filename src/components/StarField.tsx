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

      {/* Ambient cyan-blue glow at top of page */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(ellipse, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0.04) 40%, transparent 70%)",
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
                ? `0 0 ${star.size * 3}px rgba(56,189,248,0.2)`
                : "none",
          }}
        />
      ))}
    </div>
  );
}
