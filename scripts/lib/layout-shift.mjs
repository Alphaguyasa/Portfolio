/**
 * Cumulative Layout Shift for every crawled page, as a pure rule so tests can pin it.
 * Lighthouse scores CLS on only two pages; CLAUDE.md asks for no layout shift on any.
 * The browser side only records `layout-shift` entries (see recordLayoutShifts);
 * this scores them the way Core Web Vitals does and decides.
 */

/** Core Web Vitals' "good" CLS. */
export const CLS_LIMIT = 0.1;
/** A session window closes after a 1 s gap between shifts, or once it spans 5 s. */
export const SESSION_GAP_MS = 1000;
export const SESSION_MAX_MS = 5000;

/**
 * @typedef {{ value: number, startTime: number, hadRecentInput: boolean, source?: string | null }} Shift
 */

/**
 * CLS: the largest sum of shifts within one session window. Shifts within 500 ms of
 * user input (`hadRecentInput`) are expected and do not count.
 *
 * @param {Shift[]} shifts
 * @returns {{ score: number, worst: Shift[] }} the score and the shifts of that window
 */
export function cumulativeLayoutShift(shifts) {
  const counted = shifts.filter((s) => !s.hadRecentInput).sort((a, b) => a.startTime - b.startTime);
  let best = { score: 0, worst: /** @type {Shift[]} */ ([]) };
  /** @type {Shift[]} */
  let window = [];
  let sum = 0;
  for (const shift of counted) {
    const first = window[0];
    const last = window[window.length - 1];
    const fits = first && shift.startTime - last.startTime < SESSION_GAP_MS && shift.startTime - first.startTime < SESSION_MAX_MS;
    if (!fits) {
      window = [];
      sum = 0;
    }
    window.push(shift);
    sum += shift.value;
    if (sum > best.score) best = { score: sum, worst: [...window] };
  }
  return best;
}

/**
 * A problem message, or null when the page stays put.
 *
 * @param {Shift[]} shifts
 */
export function layoutShiftProblem(shifts, limit = CLS_LIMIT) {
  const { score, worst } = cumulativeLayoutShift(shifts);
  if (score <= limit) return null;
  const sources = [...new Set(worst.map((s) => s.source).filter(Boolean))].slice(0, 3);
  const where = sources.length ? `; moved: ${sources.join(", ")}` : "";
  return `layout shift ${score.toFixed(3)} (needs ${limit} or less)${where}`;
}

/**
 * Runs before any page script (pass to context.addInitScript). Keeps every
 * `layout-shift` entry, with the element that moved most, on window.__layoutShifts.
 */
export function recordLayoutShifts() {
  /** @type {any} */ (window).__layoutShifts = [];
  const describe = (node) => {
    if (!node || node.nodeType !== 1) return null;
    const id = node.id ? `#${node.id}` : "";
    const cls = typeof node.className === "string" && node.className.trim() ? `.${node.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
    return `${node.tagName.toLowerCase()}${id}${cls}`;
  };
  try {
    new PerformanceObserver((list) => {
      for (const e of /** @type {any[]} */ (list.getEntries())) {
        const area = (r) => r.width * r.height;
        const top = [...(e.sources ?? [])].sort((a, b) => area(b.previousRect) - area(a.previousRect))[0];
        /** @type {any} */ (window).__layoutShifts.push({
          value: e.value,
          startTime: e.startTime,
          hadRecentInput: e.hadRecentInput,
          source: describe(top?.node),
        });
      }
    }).observe({ type: "layout-shift", buffered: true });
  } catch {
    // A browser without the Layout Instability API records nothing.
  }
}

/** Runs in the page (pass to page.evaluate). */
export function readLayoutShifts() {
  return /** @type {any} */ (window).__layoutShifts ?? null;
}
