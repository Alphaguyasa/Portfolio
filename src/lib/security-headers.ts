/**
 * Response headers for every route. Kept apart from next.config.ts so the list
 * can be unit-tested.
 *
 * The CSP has no nonces: nonces would make every page dynamic, and the site is
 * static on purpose (Lighthouse budget). Next.js inlines its RSC payload as
 * <script> tags, and the JSON-LD block in the layout is inline too, so
 * script-src needs 'unsafe-inline'; 'unsafe-eval' is only for `next dev`.
 * There is no upgrade-insecure-requests: check:site and check:lighthouse serve
 * the build over plain http on 127.0.0.1, and Vercel already redirects to https.
 */
export function contentSecurityPolicy(isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export function securityHeaders(isDev: boolean): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(isDev) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ];
}
