import { describe, expect, it } from "vitest";
import { ogImagePath, ogImageProblems, ogTagProblems, pngSize } from "../scripts/lib/og-image.mjs";

const SITE = "https://alpha-guy.vercel.app";

function png(width: number, height: number) {
  const bytes = new Uint8Array(24);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const view = new DataView(bytes.buffer);
  view.setUint32(16, width);
  view.setUint32(20, height);
  return bytes;
}

describe("ogImagePath", () => {
  it("gives a project its own image and every other page the site's", () => {
    expect(ogImagePath("/projects/suq")).toBe("/projects/suq/opengraph-image");
    expect(ogImagePath("/")).toBe("/opengraph-image");
    expect(ogImagePath("/about")).toBe("/opengraph-image");
  });
});

describe("ogTagProblems", () => {
  it("passes one tag for this page on the site URL, with or without a cache query", () => {
    expect(ogTagProblems([`${SITE}/projects/suq/opengraph-image?abc`], "/projects/suq", SITE)).toEqual([]);
    expect(ogTagProblems([`${SITE}/opengraph-image`], "/about", SITE)).toEqual([]);
  });

  it("fails none, several, a relative URL, another host and another page's image", () => {
    expect(ogTagProblems([], "/", SITE).join()).toMatch(/0 og:image/);
    expect(ogTagProblems(["a", "b"], "/", SITE).join()).toMatch(/2 og:image/);
    expect(ogTagProblems(["/opengraph-image"], "/", SITE).join()).toMatch(/not an absolute/);
    expect(ogTagProblems(["https://old.example/opengraph-image"], "/", SITE).join()).toMatch(/not on/);
    expect(ogTagProblems([`${SITE}/opengraph-image`], "/projects/suq", SITE).join()).toMatch(/expected \/projects\/suq/);
  });
});

describe("ogTagProblems for twitter:image", () => {
  it("names the tag it checked", () => {
    expect(ogTagProblems([], "/", SITE, "twitter:image").join()).toMatch(/0 twitter:image/);
    expect(ogTagProblems(["https://old.example/opengraph-image"], "/", SITE, "twitter:image").join()).toMatch(/twitter:image .* is not on/);
  });
});

describe("pngSize", () => {
  it("reads the header and rejects anything else", () => {
    expect(pngSize(png(1200, 630))).toEqual({ width: 1200, height: 630 });
    expect(pngSize(new Uint8Array(30))).toBeNull();
    expect(pngSize(new Uint8Array(3))).toBeNull();
  });
});

describe("ogImageProblems", () => {
  it("passes a 1200x630 PNG", () => {
    expect(ogImageProblems(200, "image/png", png(1200, 630))).toEqual([]);
  });

  it("fails a bad status, a wrong type, broken bytes and a wrong size", () => {
    expect(ogImageProblems(500, "text/html", new Uint8Array()).join()).toMatch(/HTTP 500/);
    expect(ogImageProblems(200, "text/html", png(1200, 630)).join()).toMatch(/expected image\/png/);
    expect(ogImageProblems(200, "image/png", new Uint8Array(30)).join()).toMatch(/not a valid PNG/);
    expect(ogImageProblems(200, "image/png", png(800, 600)).join()).toMatch(/800x600/);
  });
});
