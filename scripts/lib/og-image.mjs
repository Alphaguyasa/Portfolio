/**
 * Open Graph image rules for check:site, as pure functions so tests can pin them. A
 * shared link shows whatever og:image names, so a missing tag, a tag on the wrong
 * host or an image that fails to render only shows up once someone shares the page.
 */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** In-page: the content of every og:image tag. */
export function readOgImages() {
  return [...document.querySelectorAll('meta[property="og:image"]')].map((el) => el.getAttribute("content") ?? "");
}

/** The route of the image a page should use: its own for a project, the site's otherwise. */
export function ogImagePath(pathname) {
  return pathname.startsWith("/projects/") ? `${pathname}/opengraph-image` : "/opengraph-image";
}

/** Problems with a page's og:image tags; empty when there is one, on the site URL, for this page. */
export function ogTagProblems(urls, pathname, siteUrl) {
  if (urls.length !== 1) return [`has ${urls.length} og:image tag(s), expected exactly 1`];
  let url;
  try {
    url = new URL(urls[0]);
  } catch {
    return [`og:image is not an absolute URL: ${urls[0]}`];
  }
  const found = [];
  if (url.origin !== new URL(siteUrl).origin) found.push(`og:image ${urls[0]} is not on ${siteUrl}`);
  if (url.pathname !== ogImagePath(pathname)) found.push(`og:image points at ${url.pathname}, expected ${ogImagePath(pathname)}`);
  return found;
}

/** Width and height from a PNG's header, or null when the bytes are not a PNG. */
export function pngSize(bytes) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length < 24 || signature.some((b, i) => bytes[i] !== b)) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

/** Problems with a fetched image; empty when it is a PNG of the size scrapers expect. */
export function ogImageProblems(status, contentType, bytes) {
  if (status !== 200) return [`og:image answered HTTP ${status}`];
  if (!String(contentType).startsWith("image/png")) return [`og:image is ${contentType}, expected image/png`];
  const size = pngSize(bytes);
  if (!size) return ["og:image is not a valid PNG"];
  if (size.width !== OG_WIDTH || size.height !== OG_HEIGHT) {
    return [`og:image is ${size.width}x${size.height}, expected ${OG_WIDTH}x${OG_HEIGHT}`];
  }
  return [];
}
