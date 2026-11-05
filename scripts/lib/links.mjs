/**
 * Link-safety rules for check:site, as pure functions so tests can pin them.
 * A link that opens a new tab must carry rel="noopener noreferrer": noopener so the
 * opened page cannot reach back through window.opener, noreferrer so the visitor's
 * page URL is not sent to third parties (the site has no analytics, and should not
 * leak to others either). Every link off the site must be https:, so no click from
 * the portfolio downgrades a client to plain http. These held by hand in several
 * components; this keeps them.
 */

/** Runs in the browser: every anchor's raw href, target and rel. */
export function readAnchors() {
  return [...document.querySelectorAll("a[href]")].map((el) => ({
    href: el.getAttribute("href") ?? "",
    target: el.getAttribute("target") ?? "",
    rel: el.getAttribute("rel") ?? "",
  }));
}

const SAFE_SCHEMES = ["mailto:", "tel:"];

/** Problems with the anchors of one page (at `pageUrl`); an empty list when all are fine. */
export function linkProblems(anchors, pageUrl) {
  const page = new URL(pageUrl);
  const found = [];
  for (const { href, target, rel } of anchors) {
    let url;
    try {
      url = new URL(href, page);
    } catch {
      found.push(`link with an unreadable href: ${href}`);
      continue;
    }
    if (SAFE_SCHEMES.includes(url.protocol)) continue;
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      found.push(`link uses ${url.protocol} (only https:, mailto: and tel: are allowed): ${href}`);
      continue;
    }
    if (url.origin !== page.origin && url.protocol !== "https:") found.push(`external link is not https: ${href}`);
    if (target.trim().toLowerCase() === "_blank") {
      const tokens = rel.toLowerCase().split(/\s+/).filter(Boolean);
      const missing = ["noopener", "noreferrer"].filter((t) => !tokens.includes(t));
      if (missing.length) found.push(`new-tab link without rel ${missing.join(" and ")}: ${href}`);
    }
  }
  return found;
}
