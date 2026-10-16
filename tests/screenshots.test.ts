import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProjectPage from "@/app/projects/[slug]/page";
import { projects } from "@/lib/projects";
import { verifyProjects } from "../scripts/lib/facts.mjs";
import { checkFrom, rawUrl, screenshotPlan, screenshotSrc } from "../scripts/lib/screenshots.mjs";
import { fixture, readJson, type Data } from "./helpers";

const from = { repo: "me/app", path: "docs/media/screen-today.png" };
const good = () => ({
  src: "/assets/projects/app/screen-today.webp",
  alt: "The Today screen",
  source: "me/app docs/media/screen-today.png",
  from: { ...from },
});

describe("screenshot paths", () => {
  it("derives the served file from the repo path", () => {
    expect(screenshotSrc("app", from)).toBe("/assets/projects/app/screen-today.webp");
    expect(screenshotSrc("app", { repo: "me/app", path: "a/b/Shot.JPG" })).toBe("/assets/projects/app/Shot.webp");
  });

  it("reads from the default branch on raw.githubusercontent.com", () => {
    expect(rawUrl(from)).toBe("https://raw.githubusercontent.com/me/app/HEAD/docs/media/screen-today.png");
    expect(rawUrl({ repo: "me/app", path: "docs/my shot.png" })).toBe(
      "https://raw.githubusercontent.com/me/app/HEAD/docs/my%20shot.png",
    );
  });
});

describe("checkFrom", () => {
  const project = { slug: "app", repo: "me/app" };

  it("accepts a screenshot from the project's own repo", () => {
    expect(checkFrom(project, good())).toEqual([]);
    expect(checkFrom(project, { src: "/assets/real.png", alt: "x", source: "y" })).toEqual([]);
  });

  it("rejects a screenshot from another repo (only the project's own public repo)", () => {
    const img = { ...good(), from: { ...from, repo: "someone/else" } };
    expect(checkFrom(project, img).join()).toMatch(/not this project's repo/);
  });

  it("rejects paths outside the repo and non-image files", () => {
    expect(checkFrom(project, { ...good(), from: { ...from, path: "../x.png" } }).join()).toMatch(/relative/);
    expect(checkFrom(project, { ...good(), from: { ...from, path: "/x.png" } }).join()).toMatch(/relative/);
    expect(checkFrom(project, { ...good(), from: { ...from, path: "README.md" } }).join()).toMatch(/\.png/);
  });

  it("requires the served path and the stated source to match the repo file", () => {
    expect(checkFrom(project, { ...good(), src: "/assets/other.webp" }).join()).toMatch(/src must be/);
    expect(checkFrom(project, { ...good(), source: "me/app" }).join()).toMatch(/source must name/);
  });

  it("is enforced by verify-facts", () => {
    const f = fixture();
    const p = f.project();
    p.images.push({ ...good(), from: { ...from, repo: "someone/else" } });
    const errors = verifyProjects({ projects: [p] }, f.sync, f.readDoc, () => true);
    expect(errors.join()).toMatch(/images\[0\] from.repo/);
  });

  it("verify-facts rejects an unknown image shape", () => {
    const f = fixture();
    const p = f.project();
    p.images.push({ ...good(), shape: "tablet" });
    const errors = verifyProjects({ projects: [p] }, f.sync, f.readDoc, () => true);
    expect(errors.join()).toMatch(/shape must be one of phone/);
  });
});

describe("the real data", () => {
  it("lists only valid screenshots to fetch", () => {
    const plan = screenshotPlan(readJson<Data>("data/projects.json"));
    expect(plan.length).toBeGreaterThan(0);
    for (const shot of plan) expect(shot.errors).toEqual([]);
  });

  it("shows phone screenshots in a grid on the project page", async () => {
    const p = projects.find((x) => x.images.some((i) => i.shape === "phone"));
    expect(p).toBeDefined();
    const html = renderToStaticMarkup(await ProjectPage({ params: Promise.resolve({ slug: p!.slug }) }));
    const start = html.indexOf('aria-label="Screens"');
    const grid = html.slice(start, html.indexOf("</ul>", start));
    const phones = p!.images.filter((i) => i.shape === "phone");
    expect((grid.match(/<li>/g) ?? []).length).toBe(phones.length);
  });
});
