import { describe, expect, it } from "vitest";
import { sitemapProblems, sitemapUrls } from "../scripts/lib/sitemap.mjs";

const SITE = "https://alpha-guyasa-portfolio.vercel.app";

const xml = (locs: string[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs
    .map((l) => `<url>\n<loc>${l}</loc>\n<lastmod>2026-11-04T06:00:00.000Z</lastmod>\n</url>`)
    .join("\n")}\n</urlset>`;

describe("sitemapUrls", () => {
  it("reads every <loc>, trimmed and entity-decoded", () => {
    expect(sitemapUrls(xml([SITE, `${SITE}/about`, ` ${SITE}/projects/a?x=1&amp;y=2 `]))).toEqual([
      SITE,
      `${SITE}/about`,
      `${SITE}/projects/a?x=1&y=2`,
    ]);
    expect(sitemapUrls("<urlset></urlset>")).toEqual([]);
  });
});

describe("sitemapProblems", () => {
  const crawled = ["/", "/about", "/projects/mezgeb"];
  const urls = [SITE, `${SITE}/about`, `${SITE}/projects/mezgeb`];

  it("passes when the sitemap and the crawl list the same pages", () => {
    expect(sitemapProblems(urls, crawled, SITE)).toEqual([]);
    expect(sitemapProblems([`${SITE}/`, `${SITE}/about/`, `${SITE}/projects/mezgeb`], crawled, SITE)).toEqual([]);
  });

  it("fails a crawled page that the sitemap leaves out", () => {
    expect(sitemapProblems(urls, [...crawled, "/projects/suq"], SITE)).toEqual([
      "crawled page /projects/suq is missing from sitemap.xml",
    ]);
  });

  it("fails a sitemap URL that the crawl never reached (a 404 or an unlinked page)", () => {
    expect(sitemapProblems([...urls, `${SITE}/projects/old`], crawled, SITE)).toEqual([
      "sitemap lists /projects/old, which the crawl did not reach",
    ]);
  });

  it("fails a URL on another host, a relative URL, a query, a duplicate and an empty sitemap", () => {
    expect(sitemapProblems([...urls, "https://example.com/about"], crawled, SITE)).toEqual([
      "sitemap URL https://example.com/about is not on https://alpha-guyasa-portfolio.vercel.app",
    ]);
    expect(sitemapProblems([...urls, "/about"], crawled, SITE)).toEqual(["sitemap URL is not absolute: /about"]);
    expect(sitemapProblems([...urls, `${SITE}/about?ref=x`], crawled, SITE)).toEqual([
      `sitemap URL ${SITE}/about?ref=x has a query or fragment`,
      "sitemap lists /about twice",
    ]);
    expect(sitemapProblems([], [], SITE)).toEqual(["sitemap.xml lists no URLs"]);
  });

  it("matches what the built sitemap.ts produces for every project", async () => {
    const { default: sitemap } = await import("../src/app/sitemap");
    const { projectPath, projects } = await import("../src/lib/projects");
    const expected = ["/", "/about", ...projects.map((p) => projectPath(p))];
    expect(sitemapProblems(sitemap().map((e) => e.url), expected, SITE)).toEqual([]);
  });
});
