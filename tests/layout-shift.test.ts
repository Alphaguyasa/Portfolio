import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CLS_LIMIT, cumulativeLayoutShift, layoutShiftProblem } from "../scripts/lib/layout-shift.mjs";

const shift = (value: number, startTime: number, source: string | null = null, hadRecentInput = false) => ({
  value,
  startTime,
  hadRecentInput,
  source,
});

describe("check:site layout shift", () => {
  it("passes a page that does not move, and one at exactly the limit", () => {
    expect(layoutShiftProblem([])).toBeNull();
    expect(layoutShiftProblem([shift(CLS_LIMIT, 100)])).toBeNull();
  });

  it("fails a page over the limit and names what moved", () => {
    expect(layoutShiftProblem([shift(0.08, 100, "img.hero"), shift(0.05, 400, "section#about")])).toBe(
      "layout shift 0.130 (needs 0.1 or less); moved: img.hero, section#about",
    );
  });

  it("ignores shifts right after user input", () => {
    expect(layoutShiftProblem([shift(0.5, 100, "div", true)])).toBeNull();
  });

  it("scores the worst session window, not the sum of the whole visit", () => {
    // Two windows split by a gap of 1 s or more: each is 0.06, so CLS is 0.06.
    const split = [shift(0.03, 0), shift(0.03, 500), shift(0.03, 1600), shift(0.03, 2000)];
    expect(cumulativeLayoutShift(split).score).toBeCloseTo(0.06);
    expect(layoutShiftProblem(split)).toBeNull();
    // A window closes once it spans 5 s even with no gap: shifts every 900 ms.
    const long = Array.from({ length: 8 }, (_, i) => shift(0.02, i * 900));
    expect(cumulativeLayoutShift(long).score).toBeCloseTo(0.12);
    expect(cumulativeLayoutShift(long).worst).toHaveLength(6);
  });

  it("orders shifts by time before grouping them", () => {
    expect(cumulativeLayoutShift([shift(0.06, 600), shift(0.06, 0)]).score).toBeCloseTo(0.12);
  });

  it("runs in check:site on every page, failing when nothing was recorded", () => {
    const src = readFileSync("scripts/check-site.mjs", "utf8");
    expect(src).toContain("context.addInitScript(recordLayoutShifts)");
    expect(src).toContain("layoutShiftProblem(shifts)");
    expect(src).toContain("layout shifts were not recorded");
  });
});

describe("fonts cannot shift the page", () => {
  it("the display font, which is not preloaded, never swaps in after first paint", () => {
    const layout = readFileSync("src/app/layout.tsx", "utf8");
    const poppins = layout.slice(layout.indexOf("Poppins({"), layout.indexOf("});", layout.indexOf("Poppins({")));
    expect(poppins).toContain("preload: false");
    expect(poppins).toContain('display: "optional"');
  });
});
