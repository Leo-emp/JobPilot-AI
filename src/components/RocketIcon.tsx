/* ============================================================
   ROCKET ICON - Premium Cyan-Blue Rocket
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
        {/* Body: dark steel-blue metallic gradient */}
        <linearGradient id="rBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="40%" stopColor="#0f2744" />
          <stop offset="100%" stopColor="#0a1628" />
        </linearGradient>

        {/* Body highlight: subtle light edge for 3D depth */}
        <linearGradient id="rBodyHL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="50%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
        </linearGradient>

        {/* Nose cone: bright cyan tip */}
        <linearGradient id="rNose" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>

        {/* Fins: darker with cyan edge */}
        <linearGradient id="rFin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#164e63" />
          <stop offset="100%" stopColor="#0e3a4a" />
        </linearGradient>

        {/* Window glass: cyan reflection */}
        <radialGradient id="rWindow" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>

        {/* Outer flame: cyan-blue */}
        <linearGradient id="rFlame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>

        {/* Inner flame: white-hot core */}
        <linearGradient id="rFlameCore" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#e0f2fe" />
          <stop offset="60%" stopColor="#67e8f9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>

        {/* Exhaust particles glow */}
        <radialGradient id="rExhaust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>

        {/* Cyan glow behind entire rocket */}
        <filter id="rGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22d3ee" floodOpacity="0.3" />
        </filter>

        {/* Soft window glow */}
        <filter id="rWindowGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22d3ee" floodOpacity="0.6" />
        </filter>
      </defs>

      <g transform="translate(100, 98)" filter="url(#rGlow)">

        {/* ---- Exhaust glow ---- */}
        <ellipse cx="0" cy="70" rx="20" ry="30" fill="url(#rExhaust)" />

        {/* ---- Flames ---- */}
        <path d="M-14,46 Q-8,75 0,100 Q8,75 14,46" fill="url(#rFlame)" opacity="0.7" />
        <path d="M-8,46 Q-4,68 0,85 Q4,68 8,46" fill="url(#rFlameCore)" opacity="0.9" />

        {/* ---- Side boosters / nozzle detail ---- */}
        <rect x="-16" y="36" width="6" height="14" rx="2" fill="#164e63" opacity="0.8" />
        <rect x="10" y="36" width="6" height="14" rx="2" fill="#164e63" opacity="0.8" />
        <ellipse cx="-13" cy="50" rx="3" ry="1.5" fill="#22d3ee" opacity="0.4" />
        <ellipse cx="13" cy="50" rx="3" ry="1.5" fill="#22d3ee" opacity="0.4" />

        {/* ---- Fins ---- */}
        <path d="M-20,18 L-38,44 L-34,46 L-22,34 L-20,18 Z" fill="url(#rFin)" />
        <path d="M20,18 L38,44 L34,46 L22,34 L20,18 Z" fill="url(#rFin)" />
        {/* Fin edge highlights */}
        <path d="M-20,18 L-38,44 L-36,45" fill="none" stroke="#22d3ee" strokeWidth="0.6" opacity="0.4" />
        <path d="M20,18 L38,44 L36,45" fill="none" stroke="#22d3ee" strokeWidth="0.6" opacity="0.4" />

        {/* ---- Main body ---- */}
        <path
          d="M0,-78 C14,-78 22,-60 24,-40 L26,14 C26,24 22,34 16,42 L0,48 L-16,42 C-22,34 -26,24 -26,14 L-24,-40 C-22,-60 -14,-78 0,-78 Z"
          fill="url(#rBody)"
        />

        {/* Body highlight overlay for metallic sheen */}
        <path
          d="M0,-78 C14,-78 22,-60 24,-40 L26,14 C26,24 22,34 16,42 L0,48 L-16,42 C-22,34 -26,24 -26,14 L-24,-40 C-22,-60 -14,-78 0,-78 Z"
          fill="url(#rBodyHL)"
        />

        {/* Body edge line — left side subtle highlight */}
        <path
          d="M-14,-72 C-20,-55 -24,-30 -26,14"
          fill="none" stroke="#38bdf8" strokeWidth="0.5" opacity="0.3"
        />

        {/* ---- Horizontal stripe detail ---- */}
        <rect x="-18" y="8" width="36" height="2" rx="1" fill="#22d3ee" opacity="0.12" />
        <rect x="-16" y="24" width="32" height="1.5" rx="0.75" fill="#22d3ee" opacity="0.08" />

        {/* ---- Nose cone ---- */}
        <path
          d="M0,-90 C7,-90 14,-82 17,-70 L0,-58 L-17,-70 C-14,-82 -7,-90 0,-90 Z"
          fill="url(#rNose)"
        />
        {/* Nose shine */}
        <path
          d="M-4,-88 C-2,-88 0,-85 1,-80"
          fill="none" stroke="white" strokeWidth="1" opacity="0.3" strokeLinecap="round"
        />

        {/* ---- Window ---- */}
        <g filter="url(#rWindowGlow)">
          <circle cx="0" cy="-28" r="11" fill="#0a1628" />
          <circle cx="0" cy="-28" r="9" fill="url(#rWindow)" opacity="0.9" />
          {/* Window reflection */}
          <ellipse cx="-3" cy="-32" rx="3.5" ry="2.5" fill="white" opacity="0.35" />
        </g>

      </g>
    </svg>
  );
}
