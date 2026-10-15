import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProjectPage, { dynamicParams, generateMetadata, generateStaticParams } from "@/app/projects/[slug]/page";
import sitemap from "@/app/sitemap";
import Portfolio from "@/components/Portfolio";
import { site } from "@/data/site";
import { STATUS_LABEL, formatDate, liveFacts, projectPath, projects } from "@/lib/projects";
import { STAND_IN_IMAGES } from "../scripts/lib/facts.mjs";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const render = async (slug: string) => renderToStaticMarkup(await ProjectPage(params(slug)));
// React escapes quotes and ampersands in text; compare against the escaped form.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

describe("project pages", () => {
  it("are generated for every project and nothing else", () => {
    expect(generateStaticParams()).toEqual(projects.map((p) => ({ slug: p.slug })));
    expect(dynamicParams).toBe(false);
  });

  it("404 for an unknown slug", async () => {
    await expect(ProjectPage(params("no-such-project"))).rejects.toThrow();
  });

  it.each(projects.map((p) => [p.slug, p] as const))("%s shows every verified field", async (slug, p) => {
    const html = await render(slug);
    expect(html).toContain(STATUS_LABEL[p.status]);
    for (const text of [p.name, p.tagline, p.statusNote, p.problem, p.approach, p.platform, ...p.stack, ...p.results, ...p.learned]) {
      expect(html).toContain(esc(text));
    }
    for (const link of p.links) expect(html).toContain(link.href);
    expect(html.match(/<h1/g)?.length).toBe(1);
  });

  it.each(projects.map((p) => [p.slug, p] as const))("%s shows live facts from the sync, not typed copies", async (slug, p) => {
    const html = await render(slug);
    const live = liveFacts(p);
    if (live.lastCommitAt) expect(html).toContain(formatDate(live.lastCommitAt));
    if (live.latestTag) expect(html).toContain(live.latestTag);
    if (live.npmVersion) expect(html).toContain(`v${live.npmVersion}`);
    if (live.ciPassing === true) expect(html).toContain("Passing");
    if (live.ciPassing === false) expect(html).toContain("Failing");
    if (live.ciPassing === null) expect(html).not.toMatch(/>CI</);
  });

  it.each(projects.map((p) => [p.slug, p] as const))("%s shows only its real screenshots, each with a source", async (slug, p) => {
    const html = await render(slug);
    expect((html.match(/<img/g) ?? []).length).toBe(p.images.length);
    for (const image of p.images) expect(html).toContain(`Source: ${esc(image.source)}`);
    for (const src of STAND_IN_IMAGES) expect(html).not.toContain(src.replace(/^\//, ""));
  });

  it("links section anchors back to the home page", async () => {
    const html = await render(projects[0].slug);
    expect(html).not.toMatch(/href="#/);
    expect(html).toContain('href="/#projects"');
  });

  it("have their own title and canonical URL", async () => {
    for (const p of projects) {
      const meta = await generateMetadata(params(p.slug));
      expect(meta.title).toContain(p.name);
      expect(meta.alternates?.canonical).toBe(projectPath(p));
    }
  });
});

describe("links to project pages", () => {
  it("every card in the Portfolio section links to its page", () => {
    const html = renderToStaticMarkup(<Portfolio />);
    for (const p of projects) expect(html).toContain(`href="${projectPath(p)}"`);
  });

  it("the sitemap lists every project page", () => {
    const urls = sitemap().map((e) => e.url);
    for (const p of projects) expect(urls).toContain(`${site.url}${projectPath(p)}`);
  });
});
