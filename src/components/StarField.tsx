/* ============================================================
   STAR FIELD - Animated Background Stars
   ============================================================
   Creates a cosmic star field effect behind the entire page.
   Uses pure CSS — no canvas or JS animation libraries needed.
   Three layers of stars at different sizes and speeds create
   a parallax-like depth effect.
   ============================================================ */

"use client"; // Needed because we use useEffect for random star positions

import { useEffect, useState } from "react";

/* ---- Type for a single star's properties ---- */
interface Star {
  id: number;
  x: number;      // Horizontal position (% of viewport width)
  y: number;      // Vertical position (% of viewport height)
  size: number;   // Diameter in pixels
  delay: number;  // Animation delay (staggered twinkle)
  duration: number; // How long one twinkle cycle takes
}

export default function StarField() {
  /* Store generated stars in state so they render consistently */
  const [stars, setStars] = useState<Star[]>([]);

  /* Generate random star positions once on mount */
  /* We do this in useEffect (client-side only) because Math.random() */
  /* would cause hydration mismatches between server and client */
  useEffect(() => {
    const generated: Star[] = [];
    for (let i = 0; i < 150; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,         // 0-100% across the page
        y: Math.random() * 100,         // 0-100% down the page
        size: Math.random() * 2.5 + 0.5, // 0.5px to 3px diameter
        delay: Math.random() * 5,        // 0-5 second animation delay
        duration: Math.random() * 3 + 2, // 2-5 second twinkle cycle
      });
    }
    setStars(generated);
  }, []);

  return (
    /* Fixed position so stars stay visible while scrolling */
    /* pointer-events-none so clicks pass through to content below */
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid pattern overlay (like the OpenClaw reference) */}
      <div className="absolute inset-0 grid-bg" />

      {/* Radial gradient glow in the center-top (nebula effect) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)",
        }}
      />

      {/* Render each star as a tiny glowing dot */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            /* Star color: mix of white and light purple */
            backgroundColor:
              star.size > 2 ? "#c7d2fe" : "#e0e7ff",
            /* Twinkle animation — fades opacity in and out */
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            /* Subtle glow around larger stars */
            boxShadow:
              star.size > 1.5
                ? `0 0 ${star.size * 3}px rgba(192,132,252,0.3)`
                : "none",
          }}
        />
      ))}
    </div>
  );
}
