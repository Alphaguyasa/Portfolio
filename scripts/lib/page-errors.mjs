/**
 * Which browser console messages fail check:site, as a pure function so tests can
 * pin it. A CSP violation, any console error (a failed hydration, a 404 for a
 * script) and any uncaught exception fail the page; warnings and info do not.
 */

/**
 * Console errors that are known and not this site's fault. Each entry needs a
 * reason next to it; keep it empty unless a third-party message forces one.
 */
export const ALLOWED_CONSOLE_ERRORS = [];

/** "csp", "error" or null (not a problem) for one console message. */
export function classifyConsole(type, text) {
  if (/Content Security Policy/i.test(text)) return "csp";
  if (type !== "error") return null;
  if (ALLOWED_CONSOLE_ERRORS.some((pattern) => pattern.test(text))) return null;
  return "error";
}

/**
 * On the 404 check, Chromium logs the page's own 404 as a console error ("Failed
 * to load resource ... 404"). That one is the expected answer, so it is allowed
 * only when its source is the page itself; a 404 for any script, style or image on
 * that page still fails.
 */
export function isOwnNotFound(text, sourceUrl, pageUrl) {
  return /status of 404/.test(text) && sourceUrl === pageUrl;
}
