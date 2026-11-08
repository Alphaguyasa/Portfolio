/**
 * Horizontal page scroll, as a pure rule so tests can pin it. The engineering handbook asks for
 * pages readable at phone width with no horizontal scroll: a marquee or a long URL
 * must clip or wrap inside its box, never widen the page. The browser side only
 * measures (see measureOverflow); this decides.
 */

/** How many elements to name in a failure, widest first. */
export const MAX_OFFENDERS = 3;

/**
 * A problem message, or null when the page fits. `scrollWidth` and `clientWidth`
 * are document.documentElement's; `offenders` lists elements whose right edge is
 * past the viewport, as { selector, right }.
 *
 * @param {{ scrollWidth: number, clientWidth: number, offenders?: { selector: string, right: number }[] }} m
 */
export function overflowProblem({ scrollWidth, clientWidth, offenders = [] }) {
  if (scrollWidth <= clientWidth) return null;
  const named = [...offenders]
    .sort((a, b) => b.right - a.right)
    .slice(0, MAX_OFFENDERS)
    .map((o) => `${o.selector} (right edge ${Math.round(o.right)}px)`);
  const where = named.length ? `; widest: ${named.join(", ")}` : "";
  return `scrolls sideways: page is ${scrollWidth}px wide in a ${clientWidth}px viewport${where}`;
}

/**
 * Runs in the page (pass to page.evaluate). Offenders are elements that stick out
 * past the viewport and are not clipped by an ancestor with overflow other than
 * visible; those are what make the page scroll.
 */
export function measureOverflow() {
  const root = document.documentElement;
  const clientWidth = root.clientWidth;
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== root && p !== document.body; p = p.parentElement) {
      if (getComputedStyle(p).overflowX !== "visible") return true;
    }
    return false;
  };
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };
  /** @type {{ selector: string, right: number }[]} */
  const offenders = [];
  for (const el of document.body.querySelectorAll("*")) {
    const right = el.getBoundingClientRect().right + window.scrollX;
    if (right > clientWidth + 0.5 && !clipped(el)) offenders.push({ selector: describe(el), right });
  }
  return { scrollWidth: root.scrollWidth, clientWidth, offenders };
}
