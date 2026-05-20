/* ============================================================
   STAR FIELD - Animated Background Stars
   ============================================================
   Creates a living night-sky effect behind the entire page.
   Three visual layers for depth:
     1. Small dim stars — gentle pulse, barely moving
     2. Larger bright stars — dramatic twinkle + slight scale
     3. Shooting stars — occasional diagonal streaks
   All pure CSS animations — zero JS runtime cost.
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
      {/* # Dot grid pattern */}
      <div className="absolute inset-0 grid-bg" />

      {/* # Ambient cyan-blue glow at top of page */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full sm:w-[1000px] h-[400px] sm:h-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0.04) 35%, transparent 65%)",
        }}
      />

      {/* # Stars — small stars get gentle pulse + drift, */}
      {/* # large stars get dramatic twinkle with scale */}
      {stars.map((star) => {
        /* # Stars > 1.5px are "bright" — they get the dramatic twinkle */
        const isBright = star.size > 1.5;

        return (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: isBright ? "#dbeafe" : "#e2e8f0",
              /* # Bright stars: twinkle + scale. Dim stars: gentle pulse + slow drift */
              animation: isBright
                ? `twinkle-bright ${star.duration}s ease-in-out ${star.delay}s infinite`
                : `pulse-subtle ${star.duration}s ease-in-out ${star.delay}s infinite, star-drift ${star.duration * 4}s ease-in-out ${star.delay}s infinite`,
              boxShadow: isBright
                ? `0 0 ${star.size * 4}px rgba(56,189,248,0.3)`
                : "none",
            }}
          />
        );
      })}

      {/* # Shooting stars — 3 streaks at different positions and timings */}
      {/* # Each one is invisible most of the time, then briefly streaks across */}
      <div
        className="absolute w-[2px] h-[2px] bg-white rounded-full"
        style={{
          top: "12%",
          left: "15%",
          boxShadow: "0 0 4px 1px rgba(255,255,255,0.6), -30px 0 20px 1px rgba(56,189,248,0.3)",
          animation: "shooting-star 8s ease-in-out 2s infinite",
        }}
      />
      <div
        className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full"
        style={{
          top: "35%",
          left: "65%",
          boxShadow: "0 0 3px 1px rgba(255,255,255,0.5), -25px 0 15px 1px rgba(56,189,248,0.2)",
          animation: "shooting-star 12s ease-in-out 6s infinite",
        }}
      />
      <div
        className="absolute w-[1px] h-[1px] bg-white rounded-full"
        style={{
          top: "55%",
          left: "40%",
          boxShadow: "0 0 3px 1px rgba(255,255,255,0.4), -20px 0 12px 1px rgba(56,189,248,0.15)",
          animation: "shooting-star 15s ease-in-out 10s infinite",
        }}
      />
    </div>
  );
}
