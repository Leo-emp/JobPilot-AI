/* ============================================================
   WORKSHOP PROGRESS RING — Circular SVG Progress Indicator
   ============================================================
   # Shows completion percentage as a circular ring.
   # Used on workshop cards and module headers.
   ============================================================ */

"use client";

interface WorkshopProgressRingProps {
  completed: number;
  total: number;
  color: string;
  size?: number;
}

export default function WorkshopProgressRing({
  completed,
  total,
  color,
  size = 48,
}: WorkshopProgressRingProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        {/* # Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-white/10"
          strokeWidth={3}
        />
        {/* # Progress arc */}
        {percentage > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        )}
      </svg>
      {/* # Percentage text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
}
