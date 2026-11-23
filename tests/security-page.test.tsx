import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SecurityPage from "@/app/security/page";
import ServicesPage from "@/app/services/page";
import { securityPage } from "@/data/site";
import { projectPath, projects } from "@/lib/projects";
import { normalize, numbersIn } from "../scripts/lib/facts.mjs";

const html = renderToStaticMarkup(<SecurityPage />);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
const docOf = (repo: string, file: string) => {
  const p = path.join(process.cwd(), "data/sync/docs", repo, file);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
};

describe("security page", () => {
  it("covers only real projects, and each case's source doc is in the sync", () => {
    for (const item of securityPage.cases) {
      const project = projects.find((p) => p.slug === item.slug);
      expect(project, item.slug).toBeDefined();
      expect(docOf(project!.repo, item.doc.path), `${item.slug}: ${item.doc.path}`).not.toBeNull();
      expect(html).toContain(`href="${projectPath(project!)}"`);
      expect(html).toContain(`href="https://github.com/${project!.repo}/blob/main/${item.doc.path}"`);
    }
  });

  it("quotes every fact verbatim from the synced repo docs", () => {
    for (const item of securityPage.cases) {
      const repo = projects.find((p) => p.slug === item.slug)!.repo;
      expect(item.facts.length).toBeGreaterThan(0);
      for (const fact of item.facts) {
        const doc = docOf(repo, fact.path);
        expect(doc && normalize(doc).includes(normalize(fact.quote)), `${item.slug}: "${fact.quote}"`).toBe(true);
      }
    }
  });

  it("states no number that its quotes do not back", () => {
    for (const item of securityPage.cases) {
      const backed = new Set(item.facts.flatMap((f) => numbersIn(f.quote)));
      for (const text of [item.heading, item.summary, item.limits, ...item.points]) {
        for (const n of numbersIn(text)) expect(backed.has(n), `${item.slug} states "${n}"`).toBe(true);
      }
    }
    expect(numbersIn(securityPage.intro)).toEqual([]);
  });

  it("shows every case with its open limits, and one h1 and one JSON-LD block", () => {
    for (const item of securityPage.cases) {
      for (const text of [item.heading, item.summary, item.limits, ...item.points]) expect(html).toContain(esc(text));
    }
    expect(html.match(/Still open: /g)).toHaveLength(securityPage.cases.length);
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html.match(/application\/ld\+json/g)).toHaveLength(1);
  });

  it("is linked from the security review package and links back to its quote form", () => {
    expect(renderToStaticMarkup(<ServicesPage />)).toContain('href="/security"');
    expect(html).toContain('href="/?package=security-review#contact"');
  });
});
