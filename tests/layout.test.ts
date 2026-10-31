import { describe, expect, it } from "vitest";
import { horizontalOverflow, overflowCulprits } from "../scripts/lib/layout.mjs";

describe("check:site horizontal scroll at phone width", () => {
  it("passes a page exactly as wide as the viewport", () => {
    expect(horizontalOverflow({ scrollWidth: 375, clientWidth: 375 })).toBeNull();
  });

  it("fails a page one pixel wider than the viewport", () => {
    expect(horizontalOverflow({ scrollWidth: 376, clientWidth: 375 })).toMatch(/376px wide in a 375px viewport/);
  });

  it("fails when the width cannot be measured", () => {
    expect(horizontalOverflow({ scrollWidth: Number.NaN, clientWidth: 375 })).toMatch(/could not measure/);
    expect(horizontalOverflow({ scrollWidth: 375, clientWidth: 0 })).toMatch(/could not measure/);
  });

  it("names the widest overflowing elements first, at most three", () => {
    const boxes = [
      { selector: "div.ok", right: 375 },
      { selector: "pre", right: 500 },
      { selector: "img#hero", right: 900 },
      { selector: "p.long", right: 400 },
      { selector: "span", right: 380 },
    ];
    expect(overflowCulprits(boxes, 375)).toEqual([
      "img#hero (right edge 900px)",
      "pre (right edge 500px)",
      "p.long (right edge 400px)",
    ]);
  });
});
