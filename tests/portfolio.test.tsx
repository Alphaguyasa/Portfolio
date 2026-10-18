import { readFileSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import { STATUS_LABEL, portfolioStats, projects } from "@/lib/projects";
import { STAND_IN_IMAGES } from "../scripts/lib/facts.mjs";
import { readJson, root, type Sync } from "./helpers";

const srcFiles = execFileSync("git", ["ls-files", "-co", "--exclude-standard", "src"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .filter((f) => /\.(ts|tsx)$/.test(f));

describe("Portfolio section", () => {
  const html = renderToStaticMarkup(<Portfolio />);

  it("renders every project in data/projects.json", () => {
    for (const p of projects) expect(html).toContain(p.name.replace("→", "→"));
    expect(html.match(/<article/g)?.length).toBe(projects.length);
  });

  it("shows each project's real status and links to its code", () => {
    for (const p of projects) expect(html).toContain(p.links[0].href);
    for (const p of projects) expect(html).toContain(STATUS_LABEL[p.status]);
  });

  it("shows only real screenshots, and none for projects without one", () => {
    const imgs = html.match(/<img[^>]*>/g) ?? [];
    expect(imgs.length).toBe(projects.filter((p) => p.images.length > 0).length);
    for (const src of STAND_IN_IMAGES) expect(html).not.toContain(src.replace(/^\//, ""));
  });
});

describe("no stand-in illustrations anywhere in the site source", () => {
  it.each(srcFiles)("%s", (file) => {
    const text = readFileSync(path.join(root, file), "utf8");
    for (const src of STAND_IN_IMAGES) expect(text).not.toContain(src);
  });
});

describe("About stats", () => {
  it("derives project counts from the data instead of hard-coding them", () => {
    const sync = readJson<Sync>("data/sync/index.json");
    const counts = portfolioStats();
    expect(counts.shipped).toBe(projects.filter((p) => p.status === "shipped" || p.status === "maintained").length);
    expect(counts.publicRepos).toBe(
      sync.repos.filter((r) => !r.private && r.fullName.startsWith(`${sync.repos[0].fullName.split("/")[0]}/`)).length,
    );
    const html = renderToStaticMarkup(<About />);
    expect(html).toContain(`>${counts.shipped}</dd>`);
    expect(html).toContain(`>${counts.publicRepos}</p>`);
  });
});
