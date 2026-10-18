import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Portfolio from "@/components/Portfolio";
import { site } from "@/data/site";
import { privateProjects } from "@/lib/projects";
import { readJson, root } from "./helpers";

const tracked = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const textFiles = tracked.filter((f) => /\.(ts|tsx|mjs|js|json|md|ya?ml|css|txt|example)$/.test(f));

describe("privacy rules", () => {
  it("commits no secrets or tokens", () => {
    const patterns = [
      /gh[pousr]_[A-Za-z0-9]{30,}/,
      /github_pat_[A-Za-z0-9_]{40,}/,
      /sk-(ant-)?[A-Za-z0-9_-]{30,}/,
      /\bre_[A-Za-z0-9]{8}_[A-Za-z0-9]{16,}/,
      /AKIA[0-9A-Z]{16}/,
      /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
      /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\./,
    ];
    const hits = textFiles.flatMap((f) => {
      const text = readFileSync(path.join(root, f), "utf8");
      return patterns.filter((p) => p.test(text)).map((p) => `${f} matches ${p}`);
    });
    expect(hits).toEqual([]);
  });

  it("commits no env files other than the template", () => {
    expect(tracked.filter((f) => /(^|\/)\.env/.test(f) && !f.endsWith(".env.example"))).toEqual([]);
  });

  it("never ships internal files or raw synced docs in the site", () => {
    const siteFiles = tracked.filter((f) => f.startsWith("src/") || f.startsWith("public/"));
    expect(siteFiles.filter((f) => /NEEDS_APPROVAL|DAILY_LOG|ROADMAP/.test(f))).toEqual([]);
    for (const f of siteFiles.filter((f) => /\.(ts|tsx)$/.test(f))) {
      const text = readFileSync(path.join(root, f), "utf8");
      expect(text, f).not.toMatch(/NEEDS_APPROVAL|DAILY_LOG|data\/sync\/docs/);
    }
  });

  it("publishes only the contact details marked public in portfolio.config.json", () => {
    const pub = readJson<{ public: Record<string, string> }>("portfolio.config.json").public;
    expect(site.email).toBe(pub.email);
    expect(site.github).toBe(pub.github);
    expect(site.linkedin).toBe(pub.linkedin);
    expect(site.leetcode).toBe(pub.leetcode);
    expect(site.location).toBe(pub.location);
  });
});

describe("private work", () => {
  type Include = Record<string, { name: string; status: string; summary: string }>;
  const include = readJson<{ include: Include }>("portfolio.config.json").include;
  const html = renderToStaticMarkup(<Portfolio />);

  it("shows only the name, status and summary Alpha wrote for each listed private repo", () => {
    expect(privateProjects).toEqual(Object.values(include));
    for (const p of privateProjects) {
      expect(html).toContain(p.name);
      expect(html).toContain(p.summary.replace(/'/g, "&#x27;"));
    }
  });

  it("never names, links or reads a private repo", () => {
    for (const repo of Object.keys(include)) {
      expect(html).not.toMatch(new RegExp(`github\\.com/[^"]*/${repo}\\b`, "i"));
      expect(html).not.toMatch(new RegExp(`>${repo}<`, "i"));
      expect(existsSync(path.join(root, "data/sync/docs/Alphaguyasa", repo))).toBe(false);
    }
  });

  it("claims no status a private repo cannot back", () => {
    for (const p of privateProjects) expect(["idea", "building", "paused"]).toContain(p.status);
  });
});
