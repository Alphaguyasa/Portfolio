import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RecentlyShipped from "@/components/RecentlyShipped";
import { formatDate, projects } from "@/lib/projects";
import { shipped } from "@/lib/shipped";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

describe("Recently shipped feed", () => {
  const html = renderToStaticMarkup(<RecentlyShipped />);
  const shown = shipped.slice(0, 8);

  it("renders the newest items from data/shipped.json with dates and links", () => {
    expect(html.match(/<li/g)?.length).toBe(shown.length);
    for (const item of shown) {
      expect(html).toContain(esc(item.title));
      expect(html).toContain(`href="${item.url}"`);
      expect(html).toContain(formatDate(item.date));
    }
  });

  it("only lists listed projects, and links each to its project page", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const item of shipped) expect(slugs.has(item.slug)).toBe(true);
    for (const item of shown) expect(html).toContain(`href="/projects/${item.slug}"`);
  });

  it("links only to public GitHub repos or npm", () => {
    for (const item of shipped) {
      expect(item.url).toMatch(/^https:\/\/(github\.com\/[^/]+\/[^/]+\/|www\.npmjs\.com\/package\/)/);
    }
  });

  it("is ordered newest first", () => {
    const dates = shipped.map((i) => i.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });
});
