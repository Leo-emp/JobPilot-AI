/* ============================================================
   ROCKET ICON - Sleek Minimal Rocket
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
        <linearGradient id="rb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="50%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>

        <linearGradient id="rn" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        <linearGradient id="rf" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="rfc" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e0f2fe" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="rw" x1="30%" y1="20%" x2="70%" y2="80%">
          <stop offset="0%" stopColor="#cffafe" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>

        <filter id="rg">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#22d3ee" floodOpacity="0.25" />
        </filter>
      </defs>

      <g transform="translate(100, 100)" filter="url(#rg)">
        {/* Flame outer */}
        <ellipse cx="0" cy="52" rx="10" ry="28" fill="url(#rf)" opacity="0.6" />
        {/* Flame core */}
        <ellipse cx="0" cy="48" rx="5" ry="18" fill="url(#rfc)" opacity="0.8" />

        {/* Fins */}
        <path d="M-18,12 C-22,20 -32,36 -30,40 C-28,42 -24,38 -20,30 Z" fill="#0ea5e9" opacity="0.7" />
        <path d="M18,12 C22,20 32,36 30,40 C28,42 24,38 20,30 Z" fill="#0ea5e9" opacity="0.7" />

        {/* Body */}
        <path
          d="M0,-70 C10,-70 18,-55 20,-35 L22,15 C22,25 16,35 10,40 L0,44 L-10,40 C-16,35 -22,25 -22,15 L-20,-35 C-18,-55 -10,-70 0,-70 Z"
          fill="url(#rb)"
        />

        {/* Nose cone */}
        <path
          d="M0,-82 C5,-82 11,-76 13,-68 L0,-58 L-13,-68 C-11,-76 -5,-82 0,-82 Z"
          fill="url(#rn)"
        />

        {/* Window */}
        <circle cx="0" cy="-20" r="8" fill="#0c4a6e" />
        <circle cx="0" cy="-20" r="6.5" fill="url(#rw)" />
        <ellipse cx="-2" cy="-23" rx="2.5" ry="1.8" fill="white" opacity="0.4" />
      </g>
    </svg>
  );
}
