/**
 * The Lighthouse gate, as pure functions so tests can pin it: every category on
 * every checked page must score at least MIN_SCORE (0-100).
 */

export const MIN_SCORE = 90;
export const RUNS = 3;
export const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

/** Scores (0-100, or null when Lighthouse could not score it) from a Lighthouse result. */
export function scoresOf(lhr) {
  return Object.fromEntries(
    CATEGORIES.map((id) => {
      const score = lhr.categories?.[id]?.score;
      return [id, typeof score === "number" ? Math.round(score * 100) : null];
    }),
  );
}

/** Per-category median of several runs, as Lighthouse CI does: single runs vary. */
export function medianScores(runs) {
  return Object.fromEntries(
    CATEGORIES.map((id) => {
      const values = runs.map((run) => run[id]);
      if (values.length === 0 || values.some((v) => v === null)) return [id, null];
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return [id, sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)];
    }),
  );
}

/** One problem line per category below the bar or missing. */
export function failures(pathname, scores, min = MIN_SCORE) {
  return CATEGORIES.filter((id) => scores[id] === null || scores[id] < min).map(
    (id) => `${pathname}: ${id} ${scores[id] ?? "not scored"} (needs ${min}+)`,
  );
}
