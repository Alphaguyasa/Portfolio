import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";
import sitemap from "@/app/sitemap";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { aboutPage, bioStats, site } from "@/data/site";
import { formatDate, methodEvidence, projectPath, projects, syncedAt } from "@/lib/projects";
import { methodEvidence as copyMethodEvidence } from "../scripts/lib/copy.mjs";
import projectsData from "../data/projects.json";
import syncData from "../data/sync/index.json";

const html = renderToStaticMarkup(<AboutPage />);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

describe("about page", () => {
  it("counts the method evidence the same way as PORTFOLIO_COPY.md", () => {
    const site = methodEvidence();
    const copy = copyMethodEvidence(projectsData.projects, syncData);
    expect({ total: site.total, withRoadmap: site.withRoadmap.length, withCi: site.withCi.length }).toEqual(copy);
  });

  it("derives the counts from the sync snapshot", () => {
    const repos = syncData.repos as { fullName: string; rootFiles?: string[]; ci?: unknown }[];
    const { withRoadmap, withCi } = methodEvidence();
    for (const p of withRoadmap) expect(repos.find((r) => r.fullName === p.repo)?.rootFiles).toContain("ROADMAP.md");
    for (const p of withCi) expect(repos.find((r) => r.fullName === p.repo)?.ci).toBeTruthy();
  });

  it("shows the derived counts, the snapshot date, and links each counted project", () => {
    const m = methodEvidence();
    expect(text).toContain(`${m.withRoadmap.length} of ${m.total} listed projects keep a written roadmap`);
    expect(text).toContain(`${m.withCi.length} of ${m.total} listed projects have CI on GitHub Actions`);
    expect(html).toContain(formatDate(syncedAt));
    for (const p of [...m.withRoadmap, ...m.withCi]) expect(html).toContain(`href="${projectPath(p)}"`);
  });

  it("lists every project with its real status", () => {
    for (const p of projects) {
      expect(html).toContain(`href="${projectPath(p)}"`);
      expect(html).toContain(esc(p.tagline));
    }
  });

  it("shows every method step and the description of this site", () => {
    for (const step of aboutPage.method) {
      expect(html).toContain(esc(step.title));
      expect(html).toContain(esc(step.body));
    }
    expect(html).toContain(esc(aboutPage.thisSite));
  });

  it("carries no typed-in numbers and no unconfirmed biographical figures", () => {
    const copy = [...aboutPage.intro, ...aboutPage.method.flatMap((s) => [s.title, s.body]), aboutPage.thisSite];
    for (const s of copy) expect(s).not.toMatch(/\d/);
    for (const stat of bioStats) expect(text).not.toContain(stat.label);
  });

  it("does not link to the private portfolio repo", () => {
    expect(html).not.toMatch(/github\.com\/Alphaguyasa\/Portfolio/i);
  });

  it("has one h1", () => {
    expect(html.match(/<h1/g)?.length).toBe(1);
  });

  it("is linked from the home page and the footer, and is in the sitemap", () => {
    expect(renderToStaticMarkup(<About />)).toContain('href="/about"');
    expect(renderToStaticMarkup(<Footer />)).toContain('href="/about"');
    expect(sitemap().map((e) => e.url)).toContain(`${site.url}/about`);
  });
});
