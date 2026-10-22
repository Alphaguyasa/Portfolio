/**
 * True when the request carries an Origin header from another site. Browsers send
 * Origin on every cross-site POST, so this stops a page elsewhere from submitting
 * the contact form through a visitor's browser. A request with no Origin (curl, old
 * clients) is not a browser-driven cross-site post and is left to the rate limit.
 *
 * "Own site" is the host the request was addressed to (so preview deployments and
 * localhost work), plus the canonical site URL.
 */
export function isCrossSite(request: Request, siteUrl: string): boolean {
  const origin = request.headers.get("origin");
  if (origin === null) return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    // "null" (sandboxed frames, some redirects) and garbage are never our own page.
    return true;
  }

  const ownHosts = new Set([new URL(siteUrl).host, new URL(request.url).host]);
  const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (forwarded) ownHosts.add(forwarded);
  const host = request.headers.get("host");
  if (host) ownHosts.add(host);

  return !ownHosts.has(originHost);
}
