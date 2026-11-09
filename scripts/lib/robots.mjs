/**
 * robots.txt rules for check:site, as pure functions so tests can pin them. A wrong
 * `robots.ts` or site URL hides the whole site from search, and no page, link or
 * sitemap check would notice.
 */

/** The user-agent groups and sitemap URLs of a robots.txt. Field names are case-insensitive. */
export function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  let group = null;
  let inRules = false;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (field === "sitemap") {
      sitemaps.push(value);
    } else if (field === "user-agent") {
      // Consecutive User-agent lines share the rules that follow them.
      if (!group || inRules) {
        group = { agents: [], allow: [], disallow: [] };
        groups.push(group);
        inRules = false;
      }
      group.agents.push(value);
    } else if ((field === "allow" || field === "disallow") && group) {
      inRules = true;
      if (value) group[field].push(value);
    }
  }
  return { groups, sitemaps };
}

/**
 * Problems with a served robots.txt; an empty list when every agent may read "/" and
 * the sitemap is named on the site URL.
 */
export function robotsProblems(text, siteUrl) {
  const found = [];
  const { groups, sitemaps } = parseRobots(text);

  const everyone = groups.filter((g) => g.agents.includes("*"));
  if (everyone.length === 0) found.push('no rules for User-agent "*"');
  else if (!everyone.some((g) => g.allow.includes("/"))) found.push('User-agent "*" does not allow "/"');

  for (const g of groups) {
    if (g.disallow.includes("/")) found.push(`User-agent "${g.agents.join(", ")}" is blocked from "/"`);
  }

  const expected = `${siteUrl.replace(/\/+$/, "")}/sitemap.xml`;
  if (!sitemaps.includes(expected)) {
    found.push(`does not name ${expected} (names: ${sitemaps.join(", ") || "none"})`);
  }
  return found;
}
