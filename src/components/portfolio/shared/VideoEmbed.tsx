"use client";

/* # Shared video embed component — parses YouTube/Vimeo URLs into responsive iframes */

import { useState } from "react";

/* # Extract YouTube video ID from various URL formats */
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/* # Extract Vimeo video ID */
function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

/* # Check if URL is a direct video file */
function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

interface VideoEmbedProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  aspectRatio?: string;
  accentColor?: string;
}

export function VideoEmbed({ videoUrl, thumbnailUrl, title, aspectRatio = "16/9", accentColor = "#e50914" }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(!thumbnailUrl);

  const ytId = getYouTubeId(videoUrl);
  const vimeoId = getVimeoId(videoUrl);
  const isDirect = isDirectVideo(videoUrl);

  /* # Show thumbnail with play button if thumbnail provided and not yet playing */
  if (thumbnailUrl && !playing) {
    return (
      <div className="relative w-full cursor-pointer group" style={{ aspectRatio }} onClick={() => setPlaying(true)}>
        <img src={thumbnailUrl} alt={title || "Video thumbnail"} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${accentColor}dd`, boxShadow: `0 0 40px ${accentColor}40` }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
          </div>
        </div>
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
            <p className="text-white font-semibold text-sm">{title}</p>
          </div>
        )}
      </div>
    );
  }

  /* # YouTube embed */
  if (ytId) {
    return (
      <div className="relative w-full" style={{ aspectRatio }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=${thumbnailUrl ? 1 : 0}&rel=0&modestbranding=1`}
          title={title || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  /* # Vimeo embed */
  if (vimeoId) {
    return (
      <div className="relative w-full" style={{ aspectRatio }}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${thumbnailUrl ? 1 : 0}&title=0&byline=0&portrait=0`}
          title={title || "Video"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  /* # Direct video file */
  if (isDirect) {
    return (
      <div className="relative w-full" style={{ aspectRatio }}>
        <video src={videoUrl} controls className="absolute inset-0 w-full h-full object-cover" playsInline title={title || "Video"} />
      </div>
    );
  }

  /* # Fallback — link to external video */
  return (
    <a href={videoUrl} target="_blank" rel="noopener noreferrer"
      className="relative w-full flex items-center justify-center" style={{ aspectRatio, backgroundColor: "#111" }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border-2"
          style={{ borderColor: `${accentColor}60` }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={accentColor}><polygon points="8,5 20,12 8,19" /></svg>
        </div>
        <p className="text-sm" style={{ color: accentColor }}>Watch Video</p>
      </div>
    </a>
  );
}

/* # Thumbnail-only play button overlay (for use when embedding is handled by the template) */
export function PlayOverlay({ accentColor = "#e50914", size = 20 }: { accentColor?: string; size?: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
      <div className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{ backgroundColor: `${accentColor}cc`, boxShadow: `0 0 40px ${accentColor}40` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
      </div>
    </div>
  );
}

/* # Helper to check if a gallery/project entry has video */
export function hasVideo(entry: { videoUrl?: string }): boolean {
  return Boolean(entry.videoUrl && entry.videoUrl.trim().length > 0);
}
