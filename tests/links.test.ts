import { describe, expect, it } from "vitest";
import { linkProblems } from "../scripts/lib/links.mjs";

const PAGE = "http://localhost:3123/about";
const a = (href: string, target = "", rel = "") => ({ href, target, rel });

describe("linkProblems", () => {
  it("passes internal, mailto, tel and safe new-tab https links", () => {
    expect(
      linkProblems(
        [
          a("/"),
          a("#contact"),
          a("/projects/suq"),
          a("mailto:someone@example.com"),
          a("tel:+251900000000"),
          a("https://github.com/Alphaguyasa", "_blank", "noreferrer noopener"),
          a("https://t.me/x", "_BLANK", "NoOpener  NoReferrer"),
          a("https://example.com/same-tab"),
        ],
        PAGE,
      ),
    ).toEqual([]);
  });

  it("fails a new-tab link missing noopener, noreferrer or both", () => {
    expect(
      linkProblems(
        [
          a("https://x.example", "_blank", "noreferrer"),
          a("https://y.example", "_blank", "noopener"),
          a("https://z.example", "_blank"),
        ],
        PAGE,
      ),
    ).toEqual([
      "new-tab link without rel noopener: https://x.example",
      "new-tab link without rel noreferrer: https://y.example",
      "new-tab link without rel noopener and noreferrer: https://z.example",
    ]);
  });

  it("fails an external http: link, but not the local server's own pages", () => {
    expect(linkProblems([a("http://example.com/page")], PAGE)).toEqual([
      "external link is not https: http://example.com/page",
    ]);
    expect(linkProblems([a("http://localhost:3123/about")], PAGE)).toEqual([]);
  });

  it("fails javascript:, data: and other schemes", () => {
    expect(linkProblems([a("javascript:void(0)"), a("ftp://example.com/f")], PAGE)).toEqual([
      "link uses javascript: (only https:, mailto: and tel: are allowed): javascript:void(0)",
      "link uses ftp: (only https:, mailto: and tel: are allowed): ftp://example.com/f",
    ]);
  });

  it("checks every new-tab link the components render (source scan)", async () => {
    const { readdirSync, readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (p.endsWith(".tsx")) files.push(p);
      }
    };
    walk("src");
    let count = 0;
    for (const f of files) {
      for (const m of readFileSync(f, "utf8").matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
        count++;
        expect(m[0], f).toMatch(/rel="[^"]*\bnoopener\b[^"]*"/);
        expect(m[0], f).toMatch(/rel="[^"]*\bnoreferrer\b[^"]*"/);
      }
    }
    expect(count).toBeGreaterThan(0);
  });
});
