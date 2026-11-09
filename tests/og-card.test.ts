import { describe, expect, it } from "vitest";
import { nameFontSize, projectCard } from "@/lib/og-card";
import { projects, STATUS_LABEL } from "@/lib/projects";

describe("project Open Graph card", () => {
  it("shows only what the project already states", () => {
    for (const project of projects) {
      const card = projectCard(project);
      expect(card.status).toBe(STATUS_LABEL[project.status]);
      expect(card.stack).toEqual(project.stack.slice(0, 4));
      expect(card.tagline).toBe(project.tagline.replace(/\s*→\s*/g, ": "));
    }
  });

  it("keeps every card to the glyphs the default image font can draw", () => {
    for (const project of projects) {
      const { name, tagline, stack } = projectCard(project);
      expect([name, tagline, ...stack].join(" ")).toMatch(/^[\x20-\x7E–—·’]+$/);
    }
  });

  it("drops the arrow from a renamed project and caps the stack at four chips", () => {
    const docsearch = projects.find((p) => p.name.includes("→"));
    expect(docsearch).toBeDefined();
    expect(projectCard(docsearch!).name).not.toContain("→");
    expect(projectCard({ ...docsearch!, stack: ["a", "b", "c", "d", "e"] }).stack).toEqual(["a", "b", "c", "d"]);
  });

  it("shrinks long names", () => {
    expect(nameFontSize("Suq")).toBeGreaterThan(nameFontSize("Security Scanner"));
    expect(nameFontSize("Security Scanner")).toBeGreaterThan(nameFontSize("DocSearch: Not Alone and more text"));
  });
});
