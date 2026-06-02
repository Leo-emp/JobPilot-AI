import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { THEME } from "../theme";

interface MockScreenProps {
  delay?: number;
  children: React.ReactNode;
}

export const MockScreen: React.FC<MockScreenProps> = ({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  if (f < 0) return null;

  const scale = spring({ frame: f, fps, config: { damping: 12, stiffness: 80 } });
  const opacity = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: 900,
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${THEME.cardBorder}`,
        background: THEME.bg,
        boxShadow: `0 25px 80px rgba(99,102,241,0.15), 0 0 1px rgba(255,255,255,0.1)`,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: "rgba(255,255,255,0.03)",
          borderBottom: `1px solid ${THEME.cardBorder}`,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f87171" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: THEME.amber }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: THEME.emerald }} />
        <div
          style={{
            flex: 1,
            marginLeft: 12,
            padding: "6px 16px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            fontSize: 13,
            color: THEME.textDim,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          jobpilotai.com/dashboard
        </div>
      </div>
      {/* Content area */}
      <div style={{ padding: 32 }}>
        {children as React.ReactNode}
      </div>
    </div>
  );
};
