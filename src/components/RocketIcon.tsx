/* ============================================================
   ROCKET ICON - Glossy 3D-Style Rocket
   ============================================================ */

interface RocketIconProps {
  size?: number;
  className?: string;
}

export default function RocketIcon({ size = 80, className = "" }: RocketIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 220"
      width={size}
      height={size * 1.1}
      className={className}
    >
      <defs>
        {/* Chrome body: silver with blue reflections */}
        <linearGradient id="rb" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="15%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="30%" stopColor="#e0f2fe" />
          <stop offset="45%" stopColor="#f8fafc" />
          <stop offset="55%" stopColor="#bae6fd" />
          <stop offset="70%" stopColor="#7dd3fc" />
          <stop offset="85%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>

        {/* Body vertical shading for 3D */}
        <linearGradient id="rbv" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.3" />
          <stop offset="50%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.3" />
        </linearGradient>

        {/* Nose cone: bright metallic cyan */}
        <linearGradient id="rn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="40%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>

        {/* Fin gradient: dark steel blue */}
        <linearGradient id="rfin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Window outer ring: metallic */}
        <linearGradient id="rwr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="50%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Window glass: deep blue with cyan glow */}
        <radialGradient id="rw" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="30%" stopColor="#0891b2" />
          <stop offset="70%" stopColor="#164e63" />
          <stop offset="100%" stopColor="#042f2e" />
        </radialGradient>

        {/* Exhaust outer: cyan blue */}
        <linearGradient id="rex" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#0ea5e9" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>

        {/* Exhaust core: white hot */}
        <linearGradient id="rexc" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#cffafe" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>

        {/* Stripe band */}
        <linearGradient id="rst" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="30%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#67e8f9" />
          <stop offset="70%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>

        {/* Specular highlight on body */}
        <linearGradient id="rspec" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="40%" stopColor="white" stopOpacity="0.08" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Overall glow */}
        <filter id="rg">
          <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#22d3ee" floodOpacity="0.2" />
        </filter>

        {/* Window glow */}
        <filter id="wg">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#22d3ee" floodOpacity="0.5" />
        </filter>

        {/* Exhaust glow */}
        <filter id="eg">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Particle glow */}
        <filter id="pg">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Tilt the entire rocket */}
      <g transform="translate(100, 108) rotate(-12)" filter="url(#rg)">

        {/* ---- Exhaust trail ---- */}
        <g filter="url(#eg)">
          <path d="M-12,50 Q-8,75 -2,105 Q0,110 2,105 Q8,75 12,50 Z" fill="url(#rex)" />
          <path d="M-6,50 Q-3,70 -1,90 Q0,93 1,90 Q3,70 6,50 Z" fill="url(#rexc)" />
        </g>

        {/* ---- Exhaust particles ---- */}
        <g filter="url(#pg)" opacity="0.6">
          <circle cx="-8" cy="80" r="1.5" fill="#22d3ee" />
          <circle cx="5" cy="88" r="1" fill="#67e8f9" />
          <circle cx="-3" cy="95" r="1.2" fill="#22d3ee" />
          <circle cx="8" cy="75" r="0.8" fill="#a5f3fc" />
          <circle cx="-10" cy="92" r="0.7" fill="#22d3ee" />
          <circle cx="2" cy="100" r="1" fill="#67e8f9" />
          <circle cx="-5" cy="105" r="0.6" fill="#22d3ee" />
          <circle cx="6" cy="98" r="0.9" fill="#a5f3fc" />
        </g>

        {/* ---- Fins ---- */}
        <path d="M-20,16 L-22,22 L-38,46 L-32,48 L-20,32 Z" fill="url(#rfin)" />
        <path d="M20,16 L22,22 L38,46 L32,48 L20,32 Z" fill="url(#rfin)" />
        {/* Fin highlights */}
        <path d="M-20,16 L-36,44" fill="none" stroke="#67e8f9" strokeWidth="0.7" opacity="0.3" />
        <path d="M20,16 L36,44" fill="none" stroke="#67e8f9" strokeWidth="0.7" opacity="0.3" />

        {/* ---- Nozzle ---- */}
        <path d="M-11,44 L-14,52 L14,52 L11,44 Z" fill="#334155" />
        <ellipse cx="0" cy="52" rx="14" ry="3.5" fill="#1e293b" />
        <ellipse cx="0" cy="52" rx="10" ry="2.5" fill="#475569" />
        <ellipse cx="0" cy="44" rx="11" ry="2" fill="#64748b" />

        {/* ---- Main body ---- */}
        <path
          d="M0,-75 C13,-75 20,-58 22,-38 L24,14 C24,26 19,36 13,42 L11,44 L-11,44 L-13,42 C-19,36 -24,26 -24,14 L-22,-38 C-20,-58 -13,-75 0,-75 Z"
          fill="url(#rb)"
        />
        {/* Vertical shading overlay */}
        <path
          d="M0,-75 C13,-75 20,-58 22,-38 L24,14 C24,26 19,36 13,42 L11,44 L-11,44 L-13,42 C-19,36 -24,26 -24,14 L-22,-38 C-20,-58 -13,-75 0,-75 Z"
          fill="url(#rbv)"
        />
        {/* Specular highlight */}
        <path
          d="M-8,-70 C-2,-70 2,-62 4,-50 L5,-10 L-4,-10 L-6,-50 C-6,-60 -6,-68 -8,-70 Z"
          fill="url(#rspec)"
        />

        {/* ---- Cyan stripe bands ---- */}
        <rect x="-22" y="-2" width="44" height="4" rx="1" fill="url(#rst)" opacity="0.7" />
        <rect x="-21" y="5" width="42" height="1.5" rx="0.75" fill="url(#rst)" opacity="0.3" />

        {/* ---- Nose cone ---- */}
        <path
          d="M0,-90 C7,-90 14,-82 16,-75 L0,-64 L-16,-75 C-14,-82 -7,-90 0,-90 Z"
          fill="url(#rn)"
        />
        {/* Nose highlight streak */}
        <path
          d="M-4,-88 C-2,-87 0,-83 1,-78"
          fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"
        />

        {/* ---- Window ---- */}
        <g filter="url(#wg)">
          <circle cx="0" cy="-30" r="11" fill="url(#rwr)" />
          <circle cx="0" cy="-30" r="9" fill="url(#rw)" />
          {/* Window reflection */}
          <ellipse cx="-3" cy="-34" rx="3" ry="2.2" fill="white" opacity="0.35" />
          <ellipse cx="3" cy="-27" rx="1.5" ry="1" fill="white" opacity="0.15" />
        </g>

        {/* ---- Panel lines ---- */}
        <line x1="-18" y1="-55" x2="-20" y2="14" stroke="#0c4a6e" strokeWidth="0.4" opacity="0.2" />
        <line x1="18" y1="-55" x2="20" y2="14" stroke="white" strokeWidth="0.3" opacity="0.08" />
      </g>
    </svg>
  );
}
