/* ============================================================
   ROOT LAYOUT - JobPilot AI
   ============================================================
   This is the top-level layout that wraps every page.
   It sets up fonts, metadata (SEO), and the HTML shell.
   In Next.js App Router, layout.tsx is the equivalent of
   _document + _app from the Pages Router.
   ============================================================ */

import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

/* ---- Font Setup ---- */
/* Geist is a clean, modern sans-serif font by Vercel — used for body text */
/* We load it as a CSS variable so Tailwind can reference it */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Space Grotesk — geometric, premium display font for the brand name */
/* Used specifically for "JobPilot AI" headings and hero text */
/* Its sharp, techy letterforms fit the space theme perfectly */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* ---- SEO Metadata ---- */
/* This populates the <title> and <meta> tags in the HTML <head> */
/* Search engines and social media use these when displaying links */
export const metadata: Metadata = {
  title: "JobPilot AI — Your Career Co-Pilot",
  description:
    "AI-powered career platform that optimizes your resume, matches you with jobs, generates cover letters, and prepares you for interviews.",
  keywords: [
    "AI resume builder",
    "job search",
    "career tools",
    "ATS optimization",
    "cover letter generator",
    "interview prep",
  ],
};

/* ---- Root Layout Component ---- */
/* Every page in the app is rendered inside this layout */
/* The {children} prop is whatever page component Next.js routes to */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      /* Apply font CSS variables so they're available everywhere */
      /* All three font CSS variables are made available globally */
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
