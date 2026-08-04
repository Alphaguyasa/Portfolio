import { ImageResponse } from "next/og";

export const alt = "Alpha Guyasa — Full Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered at build time. Kept to system fonts so it needs no font fetch.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#F4F4F4",
          padding: "80px 90px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#FF4A17",
              color: "#fff",
              fontSize: 40,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            A
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 42,
              fontWeight: 700,
              color: "#0A0A0A",
            }}
          >
            Alpha<span style={{ color: "#FF4A17" }}>.</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 86,
            fontWeight: 700,
            letterSpacing: -3,
            color: "#0A0A0A",
            lineHeight: 1.05,
            display: "flex",
          }}
        >
          I&rsquo;m&nbsp;<span style={{ color: "#FF4A17" }}>Alpha Guyasa</span>
        </div>

        <div style={{ marginTop: 20, fontSize: 36, color: "#5B5B5B" }}>
          Full Stack Engineer based in Addis Ababa
        </div>

        <div style={{ marginTop: 44, display: "flex", gap: 14 }}>
          {["Offline-First", "Kotlin & Compose", "Next.js", "AI Retrieval"].map(
            (chip, i) => (
              <div
                key={chip}
                style={{
                  padding: "14px 28px",
                  borderRadius: 999,
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#fff",
                  background: i % 2 === 0 ? "#0A0A0A" : "#FF4A17",
                }}
              >
                {chip}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}
