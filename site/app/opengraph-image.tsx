import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Alpha Guyasa — Frontend & Full-Stack Engineer";

// Light-theme tokens, resolved to sRGB (satori has no OKLCH support).
const BG = "#f7f4ee";
const INK = "#1a1511";
const MUTED = "#6b625a";
const RULE = "#d4cec7";
const ACCENT = "#cf3f27";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          color: INK,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: ACCENT }} />
          <div style={{ display: "flex" }}>Addis Ababa, Ethiopia</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 148,
              fontWeight: 700,
              letterSpacing: -6,
              lineHeight: 1,
            }}
          >
            Alpha Guyasa
            <span style={{ color: ACCENT }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 40, color: MUTED, marginTop: 24 }}>
            Frontend &amp; full-stack engineer
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `2px solid ${RULE}`,
            paddingTop: 28,
            gap: 40,
            fontSize: 21,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>BSc Computer Science · Haramaya University</div>
          <div style={{ display: "flex", color: ACCENT }}>1st place · HU × INSA CTF</div>
        </div>
      </div>
    ),
    size,
  );
}
