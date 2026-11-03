import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { duplicateProblems, metaProblems, siteUrlFrom } from "../scripts/lib/page-meta.mjs";
import { site } from "../src/data/site";

const SITE = "https://alpha-guyasa-portfolio.vercel.app";

function meta(over: Partial<{ titles: string[]; descriptions: string[]; canonicals: string[] }> = {}) {
  return {
    titles: ["Mezgeb · Alpha Guyasa"],
    descriptions: ["Small shops lose track of mobile-money payments."],
    canonicals: [`${SITE}/projects/mezgeb`],
    ...over,
  };
}

describe("check:site page metadata", () => {
  it("passes a page with one title, one description and its own canonical", () => {
    expect(metaProblems(meta(), "/projects/mezgeb", SITE)).toEqual([]);
    expect(metaProblems(meta({ canonicals: [SITE] }), "/", SITE)).toEqual([]);
    expect(metaProblems(meta({ canonicals: [`${SITE}/`] }), "/", SITE)).toEqual([]);
  });

  it("fails a missing or empty title, description or canonical", () => {
    expect(metaProblems(meta({ titles: [] }), "/projects/mezgeb", SITE)).toEqual(["no title"]);
    expect(metaProblems(meta({ titles: ["  "] }), "/projects/mezgeb", SITE)).toEqual(["no title"]);
    expect(metaProblems(meta({ descriptions: [] }), "/projects/mezgeb", SITE)).toEqual(["no meta description"]);
    expect(metaProblems(meta({ canonicals: [] }), "/projects/mezgeb", SITE)).toEqual(["no canonical link"]);
  });

  it("fails a tag that appears twice on one page", () => {
    expect(metaProblems(meta({ canonicals: [`${SITE}/`, `${SITE}/projects/mezgeb`] }), "/projects/mezgeb", SITE)).toEqual([
      "2 canonical link tags (want exactly one)",
    ]);
  });

  it("fails a canonical that points at another page, host or a relative path", () => {
    // The layout's canonical is "/"; a page that forgets its own inherits it.
    expect(metaProblems(meta({ canonicals: [`${SITE}/`] }), "/projects/mezgeb", SITE)).toEqual([
      `canonical link ${SITE}/ does not point at /projects/mezgeb`,
    ]);
    expect(metaProblems(meta({ canonicals: ["http://localhost:3000/projects/mezgeb"] }), "/projects/mezgeb", SITE)).toEqual([
      `canonical link http://localhost:3000/projects/mezgeb is not on ${SITE}`,
    ]);
    expect(metaProblems(meta({ canonicals: ["/projects/mezgeb"] }), "/projects/mezgeb", SITE)).toEqual([
      "canonical link is not an absolute URL: /projects/mezgeb",
    ]);
  });

  it("names every page that shares a title, description or canonical", () => {
    const problems = duplicateProblems({
      "/": meta({ titles: ["Alpha"], descriptions: ["Home"], canonicals: [`${SITE}/`] }),
      "/about": meta({ titles: ["Alpha"], descriptions: ["About"], canonicals: [`${SITE}/`] }),
      "/projects/suq": meta({ titles: ["Suq"], descriptions: ["Suq"], canonicals: [`${SITE}/projects/suq`] }),
    });
    expect(problems).toEqual([`same title on /, /about: "Alpha"`, `same canonical link on /, /about: "${SITE}/"`]);
    expect(duplicateProblems({ "/": meta(), "/about": meta({ titles: ["About"], descriptions: ["x"], canonicals: ["y"] }) })).toEqual([]);
  });

  it("reads the site URL from src/data/site.ts", () => {
    expect(siteUrlFrom(readFileSync("src/data/site.ts", "utf8"))).toBe(site.url);
    expect(siteUrlFrom('url: "https://example.com/",')).toBe("https://example.com");
    expect(siteUrlFrom("no url here")).toBeNull();
  });
});
