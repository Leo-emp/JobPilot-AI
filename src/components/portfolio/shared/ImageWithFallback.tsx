"use client";

/* # Image component with triple fallback: primary URL → picsum backup → CSS gradient */

import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  /* # picsum seed for backup — e.g. "dashboard" generates picsum.photos/seed/dashboard/w/h */
  fallbackSeed?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  /* # Accent color for the final CSS gradient fallback */
  accentColor?: string;
  fill?: boolean;
  priority?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSeed,
  width,
  height,
  className = "",
  style,
  accentColor = "#8b5cf6",
  fill = false,
  priority = false,
}: ImageWithFallbackProps) {
  /* # Track which fallback stage we're at: 0=primary, 1=picsum, 2=gradient */
  const [fallbackStage, setFallbackStage] = useState(0);

  /* # Build the picsum fallback URL from seed + dimensions */
  const picsumUrl = fallbackSeed
    ? `https://picsum.photos/seed/${fallbackSeed}/${width || 600}/${height || 400}`
    : null;

  /* # If we've exhausted all image sources, show a styled gradient placeholder */
  if (fallbackStage >= 2 || (!src && !picsumUrl)) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          ...style,
          background: `linear-gradient(145deg, ${accentColor}18, ${accentColor}06)`,
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: `${accentColor}40`,
            fontWeight: 600,
          }}
        >
          DEMO
        </span>
      </div>
    );
  }

  /* # Determine current source based on fallback stage */
  const currentSrc =
    fallbackStage === 0 ? src : fallbackStage === 1 && picsumUrl ? picsumUrl : src;

  const handleError = () => {
    if (fallbackStage === 0 && picsumUrl) {
      /* # Primary failed — try picsum */
      setFallbackStage(1);
    } else {
      /* # All image sources failed — show gradient */
      setFallbackStage(2);
    }
  };

  if (fill) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        className={className}
        style={style}
        fill
        unoptimized
        onError={handleError}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      width={width || 600}
      height={height || 400}
      unoptimized
      onError={handleError}
      priority={priority}
    />
  );
}
