/* ============================================================
   OG IMAGE - Dynamic Open Graph Image for Social Sharing
   ============================================================
   Next.js App Router generates /opengraph-image automatically.
   When someone shares jobpilotai.co on Twitter/LinkedIn/Slack,
   this image appears as the preview card. Uses ImageResponse
   to render JSX → PNG at build time (no external image needed).
   ============================================================ */

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "JobPilot AI — Your Career Co-Pilot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  /* # Embed the logo as base64 so it renders in the OG image */
  const logoData = readFileSync(join(process.cwd(), "public", "logo.png"));
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #0f172a 40%, #1e1b4b 70%, #09090b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* # Decorative gradient orb — matches the space theme */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)",
          }}
        />

        {/* # Logo / brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* # Gold rocket logo */}
          <img
            src={logoBase64}
            width="40"
            height="84"
            style={{ objectFit: "contain" }}
          />
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            JobPilot AI
          </span>
        </div>

        {/* # Tagline */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Your AI-Powered Career Co-Pilot
        </div>

        {/* # Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
          }}
        >
          {["Resume Builder", "Job Matching", "Interview Prep", "Portfolio"].map((feature) => (
            <div
              key={feature}
              style={{
                padding: "10px 24px",
                borderRadius: "9999px",
                border: "1px solid rgba(99,102,241,0.4)",
                background: "rgba(99,102,241,0.1)",
                color: "#a5b4fc",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        {/* # URL at the bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "20px",
            color: "#475569",
            fontWeight: 500,
          }}
        >
          jobpilotai.co
        </div>
      </div>
    ),
    { ...size }
  );
}
