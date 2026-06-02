import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 28, className = "" }: LogoProps) {
  /* # Height from 76:159 aspect ratio */
  const height = Math.round(size * 2.09);

  return (
    <Image
      src="/logo.png"
      alt="JobPilot AI"
      width={size}
      height={height}
      className={className}
      priority
    />
  );
}
