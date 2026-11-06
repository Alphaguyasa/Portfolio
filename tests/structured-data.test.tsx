import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import AboutPage, { metadata as aboutMetadata } from "@/app/about/page";
import Home from "@/app/page";
import ProjectPage, { generateMetadata } from "@/app/projects/[slug]/page";
import { site } from "@/data/site";
import { formatDate, projects } from "@/lib/projects";
import { jsonLdString, projectJsonLd, projectLanguages, projectRepoUrl } from "@/lib/structured-data";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

/** The JSON-LD blocks of a page, and the page without them (so a value cannot vouch for itself). */
function split(html: string) {
  const blocks = [...html.matchAll(LD)].map((m) => JSON.parse(m[1]) as Record<string, unknown>);
  return { blocks, visible: html.replace(LD, "") };
}

/** Every string value in a JSON-LD block, with its key, skipping the schema.org vocabulary. */
function values(node: unknown, key = ""): [string, string][] {
  if (typeof node === "string") return key === "@context" || key === "@type" ? [] : [[key, node]];
  if (Array.isArray(node)) return node.flatMap((item) => values(item, key));
  if (node && typeof node === "object") return Object.entries(node).flatMap(([k, v]) => values(v, k));
  return [];
}

function canonical(meta: { alternates?: { canonical?: unknown } | null } | undefined) {
  return `${site.url}${meta?.alternates?.canonical === "/" ? "" : String(meta?.alternates?.canonical)}`;
}

/**
 * Each value must be shown on the page: as text, as a link, or (for `url`) be the page's
 * own canonical or the site's home; a date must be shown in the page's date format.
 */
function expectBacked(visible: string, block: Record<string, unknown>, ownUrl: string) {
  for (const [key, value] of values(block)) {
    if (key === "url") {
      expect([ownUrl, site.url], `${key}: ${value}`).toContain(value);
    } else if (key === "dateModified") {
      expect(visible, `${key}: ${value}`).toContain(formatDate(value));
    } else {
      expect(visible, `${key}: ${value}`).toContain(esc(value));
    }
  }
}

describe("structured data", () => {
  it("home and about carry one Person block backed by the page", async () => {
    const pages = [
      // The layout's canonical is "/", the home page itself.
      { html: renderToStaticMarkup(<Home />), url: site.url },
      { html: renderToStaticMarkup(<AboutPage />), url: canonical(aboutMetadata) },
    ];
    for (const { html, url } of pages) {
      const { blocks, visible } = split(html);
      expect(blocks).toHaveLength(1);
      expect(blocks[0]["@type"]).toBe("Person");
      expect(blocks[0]["@context"]).toBe("https://schema.org");
      expectBacked(visible, blocks[0], url);
    }
  });

  it.each(projects.map((p) => [p.slug, p] as const))("%s carries one SoftwareSourceCode block backed by the page", async (slug, p) => {
    const html = renderToStaticMarkup(await ProjectPage({ params: Promise.resolve({ slug }) }));
    const { blocks, visible } = split(html);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]["@type"]).toBe("SoftwareSourceCode");
    expect(blocks[0].name).toBe(p.name);
    const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
    expect(blocks[0].url).toBe(canonical(meta));
    expectBacked(visible, blocks[0], canonical(meta));
  });

  it("lists only languages that the page's stack also lists", () => {
    for (const p of projects) for (const lang of projectLanguages(p)) expect(p.stack).toContain(lang);
    // Kotlin is a GitHub language of HU News (its Android shell) but not in its stack.
    const huNews = projects.find((p) => p.slug === "hu-news");
    if (huNews) expect(projectLanguages(huNews)).not.toContain("Kotlin");
  });

  it("links the repo only when the page links it", () => {
    for (const p of projects) {
      const repo = projectRepoUrl(p);
      if (repo) expect(p.links.map((l) => l.href)).toContain(repo);
      expect(Boolean(projectJsonLd(p).codeRepository)).toBe(Boolean(repo));
    }
    const noLinks = { ...projects[0], links: [] };
    expect(projectJsonLd(noLinks)).not.toHaveProperty("codeRepository");
  });

  it("is not in the layout, so the 404 page has none and no page has two", () => {
    expect(readFileSync("src/app/layout.tsx", "utf8")).not.toContain("ld+json");
  });

  it("cannot close its script tag", () => {
    const out = jsonLdString({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});
