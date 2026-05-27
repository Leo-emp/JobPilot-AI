/* ============================================================
   PORTFOLIO LAYOUT — Minimal shell for public portfolios
   ============================================================
   No navbar, no footer, no sidebar — the portfolio IS the page.
   Loads template-specific fonts (Playfair Display, Lora, JetBrains Mono,
   Space Grotesk) alongside the app defaults so every template renders
   with its intended typography.
   ============================================================ */

import { Playfair_Display, Lora, JetBrains_Mono, Space_Grotesk, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "600", "700", "800"] });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", weight: ["400", "500", "600", "700"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["400", "500", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["400", "500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${lora.variable} ${jetbrains.variable} ${spaceGrotesk.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
