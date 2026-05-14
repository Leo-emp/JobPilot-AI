/* ============================================================
   ROCKET ICON - Detailed Realistic Rocket
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
        {/* Body: white-silver metallic */}
        <linearGradient id="rb" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8d6e5" />
          <stop offset="30%" stopColor="#f1f5f9" />
          <stop offset="60%" stopColor="#ffffff" />
          <stop offset="85%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Nose cone: red-orange tip */}
        <linearGradient id="rn" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        {/* Fins: red matching nose */}
        <linearGradient id="rfin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        {/* Window: dark with cyan reflection */}
        <radialGradient id="rw" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="40%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#083344" />
        </radialGradient>

        {/* Outer flame: orange-yellow */}
        <linearGradient id="rf1" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="30%" stopColor="#f97316" />
          <stop offset="60%" stopColor="#ef4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>

        {/* Mid flame: bright yellow */}
        <linearGradient id="rf2" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="30%" stopColor="#fbbf24" />
          <stop offset="65%" stopColor="#f97316" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>

        {/* Inner flame: white-hot core */}
        <linearGradient id="rf3" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fef9c3" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </linearGradient>

        {/* Stripe accent: cyan band */}
        <linearGradient id="rs" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
        </linearGradient>

        {/* Shadow body for depth */}
        <linearGradient id="rsh" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </linearGradient>

        <filter id="rg">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#22d3ee" floodOpacity="0.2" />
        </filter>

        <filter id="fglow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(100, 100)" filter="url(#rg)">

        {/* ---- Flames ---- */}
        <g filter="url(#fglow)">
          <path d="M-13,42 Q-10,65 -4,90 Q0,95 4,90 Q10,65 13,42 Z" fill="url(#rf1)" opacity="0.8" />
          <path d="M-8,42 Q-5,60 -2,78 Q0,82 2,78 Q5,60 8,42 Z" fill="url(#rf2)" opacity="0.85" />
          <path d="M-4,42 Q-2,55 0,66 Q2,55 4,42 Z" fill="url(#rf3)" opacity="0.9" />
        </g>

        {/* ---- Fins ---- */}
        <path d="M-19,14 L-20,18 L-36,42 L-30,44 L-19,30 Z" fill="url(#rfin)" />
        <path d="M19,14 L20,18 L36,42 L30,44 L19,30 Z" fill="url(#rfin)" />
        {/* Fin inner faces (darker) */}
        <path d="M-19,14 L-19,30 L-15,26 L-15,16 Z" fill="#991b1b" opacity="0.3" />
        <path d="M19,14 L19,30 L15,26 L15,16 Z" fill="#991b1b" opacity="0.3" />

        {/* ---- Nozzle ---- */}
        <path d="M-10,40 L-13,48 L13,48 L10,40 Z" fill="#64748b" />
        <ellipse cx="0" cy="48" rx="13" ry="3" fill="#475569" />
        <ellipse cx="0" cy="42" rx="10" ry="2.5" fill="#94a3b8" />

        {/* ---- Main body ---- */}
        <path
          d="M0,-72 C12,-72 19,-58 21,-40 L23,12 C23,22 18,32 12,38 L10,40 L-10,40 L-12,38 C-18,32 -23,22 -23,12 L-21,-40 C-19,-58 -12,-72 0,-72 Z"
          fill="url(#rb)"
        />

        {/* Body shadow overlay for 3D roundness */}
        <path
          d="M0,-72 C12,-72 19,-58 21,-40 L23,12 C23,22 18,32 12,38 L10,40 L-10,40 L-12,38 C-18,32 -23,22 -23,12 L-21,-40 C-19,-58 -12,-72 0,-72 Z"
          fill="url(#rsh)"
        />

        {/* ---- Nose cone ---- */}
        <path
          d="M0,-88 C6,-88 12,-80 15,-72 L0,-62 L-15,-72 C-12,-80 -6,-88 0,-88 Z"
          fill="url(#rn)"
        />
        {/* Nose highlight */}
        <path
          d="M-3,-86 C-1,-86 1,-82 2,-78"
          fill="none" stroke="white" strokeWidth="1.2" opacity="0.35" strokeLinecap="round"
        />

        {/* ---- Cyan stripe band ---- */}
        <rect x="-21" y="-4" width="42" height="5" rx="1" fill="url(#rs)" />
        <rect x="-20" y="4" width="40" height="1.5" rx="0.75" fill="url(#rs)" opacity="0.4" />

        {/* ---- Window ---- */}
        <circle cx="0" cy="-30" r="10" fill="#1e293b" />
        <circle cx="0" cy="-30" r="8.5" fill="url(#rw)" />
        {/* Window frame ring */}
        <circle cx="0" cy="-30" r="10" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
        {/* Window reflection */}
        <ellipse cx="-2.5" cy="-34" rx="3" ry="2" fill="white" opacity="0.3" />
        <ellipse cx="3" cy="-27" rx="1.5" ry="1" fill="white" opacity="0.15" />

        {/* ---- Rivet details ---- */}
        <circle cx="-14" cy="-50" r="1" fill="#94a3b8" opacity="0.4" />
        <circle cx="14" cy="-50" r="1" fill="#94a3b8" opacity="0.4" />
        <circle cx="-16" cy="15" r="1" fill="#94a3b8" opacity="0.4" />
        <circle cx="16" cy="15" r="1" fill="#94a3b8" opacity="0.4" />
      </g>
    </svg>
  );
}
