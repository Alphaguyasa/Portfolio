/**
 * JSON-LD rules for check:site, run on the HTML the server actually sends. The vitest
 * suite renders components; this catches what only the built page can get wrong, such
 * as a block rendered twice, a block on the 404 page or a site URL that went stale.
 */

/** In-page: the text of every application/ld+json block. */
export function readJsonLdBlocks() {
  return [...document.querySelectorAll('script[type="application/ld+json"]')].map((el) => el.textContent ?? "");
}

function trimSlash(url) {
  return url.replace(/\/+$/, "");
}

/**
 * Problems with one page's blocks; empty when it has exactly one block of valid JSON
 * whose `url` is right for its type. A Person's `url` is the site, on `/` and `/about`
 * alike; anything else describes this page, so its `url` is the page's canonical.
 */
export function jsonLdProblems(blocks, canonical, siteUrl) {
  if (blocks.length !== 1) return [`has ${blocks.length} JSON-LD block(s), expected exactly 1`];

  let data;
  try {
    data = JSON.parse(blocks[0]);
  } catch (err) {
    return [`JSON-LD is not valid JSON: ${String(err?.message ?? err).split("\n")[0]}`];
  }

  const found = [];
  if (data?.["@context"] !== "https://schema.org") found.push('JSON-LD "@context" is not https://schema.org');
  if (typeof data?.["@type"] !== "string" || !data["@type"]) found.push('JSON-LD has no "@type"');

  const expected = data?.["@type"] === "Person" ? siteUrl : canonical;
  if (typeof data?.url !== "string") found.push("JSON-LD has no url");
  else if (!expected || trimSlash(data.url) !== trimSlash(expected)) {
    found.push(`JSON-LD url is ${data.url}, expected ${expected}`);
  }
  return found;
}

/** The not-found page describes nothing, so it must carry no structured data. */
export function notFoundJsonLdProblems(blocks) {
  return blocks.length === 0 ? [] : [`has ${blocks.length} JSON-LD block(s) on the 404 page, expected none`];
}
