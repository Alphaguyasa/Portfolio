/**
 * Sitemap rules for check:site, as pure functions so tests can pin them. The sitemap
 * and the crawl are built separately (src/app/sitemap.ts lists the home page, /about
 * and every project; the crawl follows links from "/"), so nothing else keeps them in
 * step: a new page missing from the sitemap, or a sitemap URL that no link reaches or
 * that 404s, would otherwise pass.
 */

/** The <loc> URLs of a sitemap.xml, in order, with XML entities decoded. */
export function sitemapUrls(xml) {
  const decode = (s) =>
    s
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&");
  return [...xml.matchAll(/<loc>\s*([^<]*?)\s*<\/loc>/g)].map((m) => decode(m[1]));
}

function trimPath(p) {
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

/**
 * Problems between the sitemap's URLs and the crawled page paths; an empty list when
 * every sitemap URL is a crawled page on the site URL and every crawled page is listed.
 */
export function sitemapProblems(urls, crawledPaths, siteUrl) {
  const found = [];
  const site = new URL(siteUrl);
  const listed = new Set();
  if (urls.length === 0) found.push("sitemap.xml lists no URLs");
  for (const raw of urls) {
    let url;
    try {
      url = new URL(raw);
    } catch {
      found.push(`sitemap URL is not absolute: ${raw}`);
      continue;
    }
    if (url.origin !== site.origin) {
      found.push(`sitemap URL ${raw} is not on ${site.origin}`);
      continue;
    }
    if (url.search || url.hash) found.push(`sitemap URL ${raw} has a query or fragment`);
    const path = trimPath(url.pathname);
    if (listed.has(path)) found.push(`sitemap lists ${path} twice`);
    listed.add(path);
  }
  const crawled = new Set([...crawledPaths].map(trimPath));
  for (const path of listed) {
    if (!crawled.has(path)) found.push(`sitemap lists ${path}, which the crawl did not reach`);
  }
  for (const path of crawled) {
    if (!listed.has(path)) found.push(`crawled page ${path} is missing from sitemap.xml`);
  }
  return found;
}
