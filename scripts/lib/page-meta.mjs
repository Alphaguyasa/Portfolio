/**
 * Search and link-preview metadata rules for check:site, as pure functions so tests
 * can pin them. Clients find the portfolio through search results and shared links,
 * so every crawled page needs exactly one non-empty <title>, one meta description
 * and one canonical link that points at its own path on the production site URL,
 * and no two pages may share a title, description or canonical.
 */

/** Runs in the browser: the raw metadata of the current page. */
export function readPageMeta() {
  return {
    titles: [...document.querySelectorAll("head > title")].map((el) => el.textContent ?? ""),
    descriptions: [...document.querySelectorAll('meta[name="description"]')].map(
      (el) => el.getAttribute("content") ?? "",
    ),
    canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map((el) => el.getAttribute("href") ?? ""),
  };
}

/** The production URL from src/data/site.ts (`url: "https://..."`), or null. */
export function siteUrlFrom(source) {
  const match = /\burl:\s*"(https:\/\/[^"]+)"/.exec(source);
  return match ? match[1].replace(/\/+$/, "") : null;
}

function samePath(a, b) {
  const trim = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
  return trim(a) === trim(b);
}

/** Problems with one page's metadata; an empty list when it is fine. */
export function metaProblems(meta, pathname, siteUrl) {
  const found = [];
  const one = (values, name) => {
    const filled = values.filter((v) => v.trim() !== "");
    if (values.length > 1) {
      found.push(`${values.length} ${name} tags (want exactly one)`);
      return null;
    }
    if (filled.length === 0) found.push(`no ${name}`);
    return filled[0] ?? null;
  };
  one(meta.titles, "title");
  one(meta.descriptions, "meta description");
  const canonical = one(meta.canonicals, "canonical link");
  if (canonical !== null) {
    let url = null;
    try {
      url = new URL(canonical);
    } catch {
      found.push(`canonical link is not an absolute URL: ${canonical}`);
    }
    if (url) {
      const site = new URL(siteUrl);
      if (url.origin !== site.origin) found.push(`canonical link ${canonical} is not on ${site.origin}`);
      else if (!samePath(url.pathname, pathname) || url.search || url.hash) {
        found.push(`canonical link ${canonical} does not point at ${pathname}`);
      }
    }
  }
  return found;
}

/**
 * Pages that share a title, description or canonical. `pages` maps a pathname to the
 * meta read from it; each repeated value is reported once, naming every page.
 */
export function duplicateProblems(pages) {
  const found = [];
  for (const [field, name] of [
    ["titles", "title"],
    ["descriptions", "meta description"],
    ["canonicals", "canonical link"],
  ]) {
    const byValue = new Map();
    for (const [pathname, meta] of Object.entries(pages)) {
      const value = (meta[field][0] ?? "").trim();
      if (!value) continue;
      byValue.set(value, [...(byValue.get(value) ?? []), pathname]);
    }
    for (const [value, paths] of byValue) {
      if (paths.length > 1) found.push(`same ${name} on ${paths.join(", ")}: "${value}"`);
    }
  }
  return found;
}
