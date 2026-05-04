/* ============================================================
   ROCKET ICON - Custom SVG in Brand Colors
   ============================================================
   Replaces the default emoji rocket (which has fixed red/white colors)
   with a custom SVG rocket using our indigo-to-purple gradient.
   Accepts a size prop for flexibility across navbar and hero.
   ============================================================ */

interface RocketIconProps {
  size?: number; // Width/height in pixels (default 80)
  className?: string; // Optional extra CSS classes
}

export default function RocketIcon({ size = 80, className = "" }: RocketIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        {/* Main gradient: indigo to purple (matches brand) */}
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        {/* Lighter accent gradient for the nose cone */}
        <linearGradient id="rocketNose" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        {/* Blue-white flame gradient (space thruster look) */}
        <linearGradient id="rocketFlame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="40%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
        {/* Inner white-hot flame core */}
        <linearGradient id="rocketFlameCore" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="60%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
        {/* Glow behind rocket */}
        <filter id="rocketShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Rocket group, centered in the viewBox */}
      <g transform="translate(100, 95)" filter="url(#rocketShadow)">
        {/* Exhaust flame (outer blue glow) */}
        <path d="M-12,48 Q0,95 12,48" fill="url(#rocketFlame)" opacity="0.7" />
        {/* Exhaust flame (inner white-hot core) */}
        <path d="M-6,48 Q0,80 6,48" fill="url(#rocketFlameCore)" opacity="0.9" />

        {/* Rocket main body */}
        <path
          d="M0,-72 C12,-72 20,-58 22,-42 L25,8 C25,16 20,28 15,37 L0,45 L-15,37 C-20,28 -25,16 -25,8 L-22,-42 C-20,-58 -12,-72 0,-72 Z"
          fill="url(#rocketBody)"
          opacity="0.95"
        />

        {/* Nose cone (lighter tip) */}
        <path
          d="M0,-82 C6,-82 13,-74 15,-64 L0,-52 L-15,-64 C-13,-74 -6,-82 0,-82 Z"
          fill="url(#rocketNose)"
        />

        {/* Porthole window — dark circle with inner glow */}
        <circle cx="0" cy="-22" r="10" fill="#0a0a1a" opacity="0.9" />
        <circle cx="0" cy="-22" r="7.5" fill="url(#rocketNose)" opacity="0.3" />
        <circle cx="-2" cy="-25" r="3" fill="#e0e7ff" opacity="0.6" />

        {/* Left fin */}
        <path d="M-22,8 L-40,36 L-35,40 L-20,28 Z" fill="url(#rocketBody)" opacity="0.85" />
        {/* Right fin */}
        <path d="M22,8 L40,36 L35,40 L20,28 Z" fill="url(#rocketBody)" opacity="0.85" />
      </g>
    </svg>
  );
}
