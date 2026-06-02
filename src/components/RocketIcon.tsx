/* ============================================================
   ROCKET ICON - Gold Rocket Brand Logo
   ============================================================ */

import Image from "next/image";

interface RocketIconProps {
  size?: number;
  className?: string;
}

export default function RocketIcon({ size = 80, className = "" }: RocketIconProps) {
  /* # Match old rocket height (size * 1.2), derive width from 225:451 aspect ratio */
  const height = Math.round(size * 1.2);
  const width = Math.round(height / 2.0);

  return (
    <Image
      src="/logo.png"
      alt="JobPilot AI"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
