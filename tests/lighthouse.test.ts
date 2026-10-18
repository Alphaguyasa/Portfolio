import { describe, expect, it } from "vitest";
import { CATEGORIES, MIN_SCORE, failures, medianScores, scoresOf } from "../scripts/lib/lighthouse.mjs";

const lhr = (scores: Record<string, number | null>) => ({
  categories: Object.fromEntries(Object.entries(scores).map(([id, score]) => [id, { score }])),
});

describe("lighthouse gate", () => {
  it("asserts all four categories at 90+", () => {
    expect(CATEGORIES).toEqual(["performance", "accessibility", "best-practices", "seo"]);
    expect(MIN_SCORE).toBe(90);
  });

  it("reads 0-100 scores and treats a missing category as unscored", () => {
    expect(scoresOf(lhr({ performance: 0.894, accessibility: 1, "best-practices": 0.96 }))).toEqual({
      performance: 89,
      accessibility: 100,
      "best-practices": 96,
      seo: null,
    });
  });

  it("takes the per-category median of the runs", () => {
    const run = (p: number) => ({ performance: p, accessibility: 100, "best-practices": 100, seo: 100 });
    expect(medianScores([run(84), run(95), run(91)]).performance).toBe(91);
    expect(medianScores([run(88), run(92)]).performance).toBe(90);
    expect(medianScores([run(95), { ...run(95), seo: null }]).seo).toBeNull();
    expect(medianScores([]).performance).toBeNull();
  });

  it("fails each category under the bar or unscored, and passes 90 exactly", () => {
    const scores = { performance: 89, accessibility: 90, "best-practices": 100, seo: null };
    expect(failures("/", scores)).toEqual(["/: performance 89 (needs 90+)", "/: seo not scored (needs 90+)"]);
    expect(failures("/", { performance: 90, accessibility: 90, "best-practices": 90, seo: 90 })).toEqual([]);
  });
});
