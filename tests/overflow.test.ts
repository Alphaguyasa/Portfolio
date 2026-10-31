import { describe, expect, it } from "vitest";
import { MAX_OFFENDERS, overflowProblem } from "../scripts/lib/overflow.mjs";

describe("check:site horizontal scroll", () => {
  it("passes a page that fits its viewport", () => {
    expect(overflowProblem({ scrollWidth: 375, clientWidth: 375 })).toBeNull();
    expect(overflowProblem({ scrollWidth: 360, clientWidth: 375 })).toBeNull();
  });

  it("fails a page even one pixel wider than the viewport", () => {
    expect(overflowProblem({ scrollWidth: 376, clientWidth: 375 })).toBe(
      "scrolls sideways: page is 376px wide in a 375px viewport",
    );
  });

  it("names the widest offenders first, at most three", () => {
    const offenders = [
      { selector: "div.a", right: 400 },
      { selector: "img.hero", right: 900.4 },
      { selector: "p", right: 380 },
      { selector: "pre", right: 500 },
    ];
    const msg = overflowProblem({ scrollWidth: 900, clientWidth: 375, offenders });
    expect(msg).toContain("widest: img.hero (right edge 900px), pre (right edge 500px), div.a (right edge 400px)");
    expect(msg).not.toContain("p (right edge 380px)");
    expect(MAX_OFFENDERS).toBe(3);
  });
});
