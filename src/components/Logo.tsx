import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 28, className = "" }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="JobPilot AI"
      width={size}
      height={Math.round(size * 1.33)}
      className={className}
      priority
    />
  );
}
