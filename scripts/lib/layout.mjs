/**
 * Horizontal-scroll rule for check:site, as pure functions so tests can pin it.
 * At phone width a page must not be wider than the viewport: a marquee or a long
 * word that widens the page makes every section slide sideways under the thumb.
 */

/** Widths are CSS pixels from the page; null when the page fits. */
export function horizontalOverflow({ scrollWidth, clientWidth }) {
  if (!Number.isFinite(scrollWidth) || !Number.isFinite(clientWidth) || clientWidth <= 0) {
    return "could not measure the page width";
  }
  if (scrollWidth <= clientWidth) return null;
  return `page scrolls sideways: ${scrollWidth}px wide in a ${clientWidth}px viewport`;
}

/**
 * Names the elements most likely to blame: those whose right edge passes the
 * viewport, widest first, as `tag#id.class` (max 3), so a failure says where to look.
 */
export function overflowCulprits(boxes, clientWidth, max = 3) {
  return boxes
    .filter((b) => b.right > clientWidth)
    .sort((a, b) => b.right - a.right)
    .slice(0, max)
    .map((b) => `${b.selector} (right edge ${Math.round(b.right)}px)`);
}
