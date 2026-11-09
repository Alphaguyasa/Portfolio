import { ImageResponse } from "next/og";
import { nameFontSize, projectCard } from "@/lib/og-card";
import { projectBySlug, projects } from "@/lib/projects";

export const alt = "Summary card for this project: its name, one-line description, status and tech stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Rendered at build time. Kept to the default font so it needs no font fetch.
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const project = projectBySlug((await params).slug);
  if (!project) throw new Error("opengraph-image: unknown project");
  const card = projectCard(project);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F4F4F4",
          padding: "72px 90px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#0A0A0A" }}>
            Alpha Guyasa<span style={{ color: "#c2410c" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 28px",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 600,
              color: "#fff",
              background: "#c2410c",
            }}
          >
            {card.status}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: nameFontSize(card.name),
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.05,
              color: "#0A0A0A",
            }}
          >
            {card.name}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 42, lineHeight: 1.25, color: "#5B5B5B" }}>
            {card.tagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {card.stack.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                padding: "12px 26px",
                borderRadius: 999,
                fontSize: 26,
                fontWeight: 600,
                color: "#fff",
                background: "#0A0A0A",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
