/* ============================================================
   ROCKET ICON - Premium Glossy Rocket
   ============================================================ */

interface RocketIconProps {
  size?: number;
  className?: string;
}

export default function RocketIcon({ size = 80, className = "" }: RocketIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={className}
    >
      <defs>
        {/* Body: dark navy to bright cyan metallic */}
        <linearGradient id="rb" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a1929" />
          <stop offset="18%" stopColor="#0c4a6e" />
          <stop offset="35%" stopColor="#0ea5e9" />
          <stop offset="48%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#7dd3fc" />
          <stop offset="65%" stopColor="#38bdf8" />
          <stop offset="80%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0a1929" />
        </linearGradient>

        {/* Body top-down shading */}
        <linearGradient id="rbv" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.15" />
          <stop offset="40%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a1929" stopOpacity="0.25" />
        </linearGradient>

        {/* Nose: bright silver-cyan */}
        <linearGradient id="rn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="35%" stopColor="#22d3ee" />
          <stop offset="70%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#155e75" />
        </linearGradient>

        {/* Fins: dark blue steel */}
        <linearGradient id="rfL" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0a1929" />
        </linearGradient>
        <linearGradient id="rfR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0a1929" />
        </linearGradient>

        {/* Window ring */}
        <linearGradient id="rwr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="30%" stopColor="#7dd3fc" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#164e63" />
        </linearGradient>

        {/* Window glass: deep with glow center */}
        <radialGradient id="rw" cx="38%" cy="32%" r="60%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="25%" stopColor="#06b6d4" />
          <stop offset="55%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#042f2e" />
        </radialGradient>

        {/* Stripe accent: gold-amber for contrast */}
        <linearGradient id="rst" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="25%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="75%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        {/* Nozzle: dark metallic */}
        <linearGradient id="rnz" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="30%" stopColor="#475569" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="70%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Exhaust outer */}
        <linearGradient id="rex" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="25%" stopColor="#0ea5e9" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>

        {/* Exhaust core */}
        <linearGradient id="rexc" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#ecfeff" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#67e8f9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>

        {/* Specular streak */}
        <linearGradient id="rsp" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="50%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <filter id="rg">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#22d3ee" floodOpacity="0.18" />
        </filter>
        <filter id="wg">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22d3ee" floodOpacity="0.45" />
        </filter>
        <filter id="eg">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pg">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      <g transform="translate(100, 112)" filter="url(#rg)">

        {/* ---- Exhaust plume ---- */}
        <g filter="url(#eg)">
          <path d="M-14,54 Q-9,80 -3,115 Q0,120 3,115 Q9,80 14,54 Z" fill="url(#rex)" />
          <path d="M-7,54 Q-4,74 -1,98 Q0,102 1,98 Q4,74 7,54 Z" fill="url(#rexc)" />
        </g>

        {/* ---- Exhaust particles ---- */}
        <g filter="url(#pg)" opacity="0.5">
          <circle cx="-7" cy="90" r="1.3" fill="#22d3ee" />
          <circle cx="5" cy="98" r="0.9" fill="#67e8f9" />
          <circle cx="-3" cy="105" r="1" fill="#22d3ee" />
          <circle cx="8" cy="85" r="0.7" fill="#a5f3fc" />
          <circle cx="-9" cy="100" r="0.6" fill="#22d3ee" />
          <circle cx="2" cy="112" r="0.8" fill="#67e8f9" />
          <circle cx="-5" cy="115" r="0.5" fill="#22d3ee" />
        </g>

        {/* ---- Left fin ---- */}
        <path d="M-21,18 L-24,24 L-42,52 L-35,54 L-22,34 Z" fill="url(#rfL)" />
        <path d="M-21,18 L-40,50" fill="none" stroke="#67e8f9" strokeWidth="0.5" opacity="0.25" />

        {/* ---- Right fin ---- */}
        <path d="M21,18 L24,24 L42,52 L35,54 L22,34 Z" fill="url(#rfR)" />
        <path d="M21,18 L40,50" fill="none" stroke="#67e8f9" strokeWidth="0.5" opacity="0.25" />

        {/* ---- Center fin (behind body) ---- */}
        <rect x="-3" y="38" width="6" height="18" rx="1" fill="#0c4a6e" opacity="0.5" />

        {/* ---- Nozzle assembly ---- */}
        <path d="M-12,46 L-15,56 L15,56 L12,46 Z" fill="url(#rnz)" />
        <ellipse cx="0" cy="56" rx="15" ry="4" fill="#1e293b" />
        <ellipse cx="0" cy="56" rx="11" ry="3" fill="#334155" />
        <ellipse cx="0" cy="55" rx="8" ry="2" fill="#475569" />
        <ellipse cx="0" cy="46" rx="12" ry="2.5" fill="#64748b" />
        {/* Nozzle highlight */}
        <ellipse cx="-3" cy="46" rx="4" ry="1" fill="white" opacity="0.1" />

        {/* ---- Main body ---- */}
        <path
          d="M0,-80 C14,-80 22,-62 24,-40 L26,16 C26,28 20,38 14,44 L12,46 L-12,46 L-14,44 C-20,38 -26,28 -26,16 L-24,-40 C-22,-62 -14,-80 0,-80 Z"
          fill="url(#rb)"
        />
        <path
          d="M0,-80 C14,-80 22,-62 24,-40 L26,16 C26,28 20,38 14,44 L12,46 L-12,46 L-14,44 C-20,38 -26,28 -26,16 L-24,-40 C-22,-62 -14,-80 0,-80 Z"
          fill="url(#rbv)"
        />

        {/* Specular highlight streak */}
        <path
          d="M-6,-74 C-1,-74 3,-66 5,-52 L6,-5 L-2,-5 L-4,-52 C-5,-64 -5,-72 -6,-74 Z"
          fill="url(#rsp)"
        />

        {/* ---- Gold accent stripes ---- */}
        <rect x="-23" y="0" width="46" height="3.5" rx="1" fill="url(#rst)" opacity="0.8" />
        <rect x="-22" y="6" width="44" height="1.5" rx="0.75" fill="url(#rst)" opacity="0.35" />

        {/* ---- Nose cone ---- */}
        <path
          d="M0,-96 C8,-96 15,-86 18,-78 L14,-80 L0,-68 L-14,-80 L-18,-78 C-15,-86 -8,-96 0,-96 Z"
          fill="url(#rn)"
        />
        {/* Nose tip highlight */}
        <path d="M-3,-94 C-1,-93 1,-88 2,-82" fill="none" stroke="white" strokeWidth="1.5" opacity="0.45" strokeLinecap="round" />
        {/* Nose base seam */}
        <ellipse cx="0" cy="-78" rx="18" ry="2" fill="#0891b2" opacity="0.3" />

        {/* ---- Window ---- */}
        <g filter="url(#wg)">
          <circle cx="0" cy="-32" r="12" fill="url(#rwr)" />
          <circle cx="0" cy="-32" r="10" fill="url(#rw)" />
          <ellipse cx="-3" cy="-36" rx="3.5" ry="2.5" fill="white" opacity="0.35" />
          <ellipse cx="3.5" cy="-28.5" rx="1.5" ry="1" fill="white" opacity="0.12" />
        </g>

        {/* ---- Panel details ---- */}
        <line x1="-19" y1="-60" x2="-22" y2="16" stroke="#0a1929" strokeWidth="0.4" opacity="0.2" />
        <line x1="19" y1="-60" x2="22" y2="16" stroke="#7dd3fc" strokeWidth="0.3" opacity="0.08" />
        {/* Rivets */}
        <circle cx="-16" cy="-55" r="0.8" fill="#7dd3fc" opacity="0.2" />
        <circle cx="16" cy="-55" r="0.8" fill="#0a1929" opacity="0.15" />
        <circle cx="-18" cy="18" r="0.8" fill="#7dd3fc" opacity="0.2" />
        <circle cx="18" cy="18" r="0.8" fill="#0a1929" opacity="0.15" />
        <circle cx="-15" cy="-18" r="0.8" fill="#7dd3fc" opacity="0.15" />
        <circle cx="15" cy="-18" r="0.8" fill="#0a1929" opacity="0.12" />
      </g>
    </svg>
  );
}
