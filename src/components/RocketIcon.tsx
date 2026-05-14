/* ============================================================
   ROCKET ICON - Custom SVG in Brand Colors
   ============================================================
   Custom SVG rocket using blue gradient to match the clean
   dark design system. No purple, no neon glow.
   ============================================================ */

interface RocketIconProps {
  size?: number;
  className?: string;
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
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="rocketNose" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="rocketFlame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="40%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rocketFlameCore" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="60%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
        <filter id="rocketShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.25" />
        </filter>
      </defs>

      <g transform="translate(100, 95)" filter="url(#rocketShadow)">
        <path d="M-12,48 Q0,95 12,48" fill="url(#rocketFlame)" opacity="0.6" />
        <path d="M-6,48 Q0,80 6,48" fill="url(#rocketFlameCore)" opacity="0.8" />

        <path
          d="M0,-72 C12,-72 20,-58 22,-42 L25,8 C25,16 20,28 15,37 L0,45 L-15,37 C-20,28 -25,16 -25,8 L-22,-42 C-20,-58 -12,-72 0,-72 Z"
          fill="url(#rocketBody)"
          opacity="0.95"
        />

        <path
          d="M0,-82 C6,-82 13,-74 15,-64 L0,-52 L-15,-64 C-13,-74 -6,-82 0,-82 Z"
          fill="url(#rocketNose)"
        />

        <circle cx="0" cy="-22" r="10" fill="#09090b" opacity="0.9" />
        <circle cx="0" cy="-22" r="7.5" fill="url(#rocketNose)" opacity="0.25" />
        <circle cx="-2" cy="-25" r="3" fill="#e0e7ff" opacity="0.5" />

        <path d="M-22,8 L-40,36 L-35,40 L-20,28 Z" fill="url(#rocketBody)" opacity="0.85" />
        <path d="M22,8 L40,36 L35,40 L20,28 Z" fill="url(#rocketBody)" opacity="0.85" />
      </g>
    </svg>
  );
}
