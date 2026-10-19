# ROADMAP.md

Prioritized backlog. The daily run takes the **top open item** first, up to 2 per run.
When an item is done, move it to "Done" with its PR number and release tag. Replan
(CLAUDE.md, daily loop step 6) when fewer than 5 items are open.

**Priority:** P0 = honesty / privacy / security / broken build · P1 = core value for
clients reading the portfolio · P2 = important, not blocking · P3 = polish.
**Effort:** S = under half a run · M = about one run · L = split into several PRs first.

Last replan: 2026-10-19 (4 items were left after items 9 and 10; added 15–17).

---

## Open

### 11. [P2 · S] Dev-only dependency advisories
`npm audit` reports 5 high advisories in dev-only tooling (braces/micromatch via
`eslint-config-next`); the only automatic fix downgrades eslint-config-next to 14.
Re-check weekly; take the upstream fix when a 16.x release ships one.
Still 5 high (dev-only) on 2026-10-19; production audit clean.

### 14. [P2 · S] Honeypot field on the contact form
The pre-rebuild form (f361113) had a hidden honeypot field the route silently
accepted without sending; the current form and route have none, so the only spam
guard is the per-instance rate limit. Add the field (visually hidden, `tabIndex=-1`,
`autoComplete="off"`, not announced to screen readers) and a route test.

### 15. [P2 · S] Security headers
`next.config.ts` sets no headers. Add `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` /
`frame-ancestors 'none'`, a `Permissions-Policy` that turns off camera, microphone and
geolocation, and a Content-Security-Policy that the static pages pass (next/font is
self-hosted; check inline styles and the JSON-LD script). Test: a unit test on the
header list, and check:site must still pass with no CSP console errors.

### 16. [P2 · S] Cap the contact request body before parsing
`/api/contact` calls `request.json()` on any body; field limits are checked only after
the whole body is parsed. Reject a `Content-Length` over ~16 KB (413) and read with a
size guard. Route test for the 413.

### 17. [P3 · S] Find new public repos without the owner listing
Listing Alphaguyasa's repos returns 403 in the cloud run, so a new public repo appears
only once it is added to `knownPublicRepos` by hand. Try the search API
(`user:Alphaguyasa fork:false`) as a second fallback, and log any repo it finds that is
not in the config, instead of adding it silently. Unit test on the merge of the lists.

### 12. [P3 · S] Per-project Open Graph images
Generate an OG image per project page with `next/og` (already used for the home page).

### 13. [P3 · M] Amharic version of the key pages
Most projects target Amharic-speaking users; an Amharic summary of the home page and
project pages would show that. Needs Alpha to review wording (NEEDS_APPROVAL).

## Suggestions for other repos (read-only; for Alpha to apply)

- **docsearch:** README still describes DocSearch only; the pivot to Not Alone lives in
  `docs/`. A short "Status: pivoting to Not Alone" note at the top would let the
  portfolio cite the pivot from the README.
- **NullChat:** has no README; the sync can only cite the repo description and ROADMAP.
- **HUnews:** README's team table includes student ID numbers; consider removing them.
- **ethiopic-text:** 0.1.0 is on npm but has no git tag or GitHub release.
- **Meret:** no repo description is set on GitHub.

## Done

- **[P2] README refresh** — PR #19 (2026-10-19). Documents the data flow (sync →
  projects.json → verify-facts → site and copy), every command, and the current
  outstanding list.
- **[P2] Remove dead assets** — PR #18 (2026-10-19). The nine stand-in illustrations
  are deleted from `public/assets`; `STAND_IN_IMAGES` stays as a guard.

- **[P2] Lighthouse check in CI** — PR #11 (2026-10-18). `npm run check:lighthouse`
  runs Lighthouse 13.5.0 (Apache-2.0, dev-only; `lighthouse` itself rather than
  `@lhci/cli`, whose latest release bundles an older Lighthouse) against the built
  site at default mobile settings, median of 3 runs, on `/` and `/projects/mezgeb`;
  any of the four categories under 90 fails CI. To pass, the home page's mobile
  performance (83–89) was raised: the hero portrait now loads eagerly at high fetch
  priority with accurate `sizes`, and unused font files (Poppins 400, DM Sans italic)
  are no longer preloaded. Measured locally: `/` 91, project page 93, others 100.
- **[P1] About page and "How I work"** — PR #10 (2026-10-18), squash `ccac03c`
  (tag `v2026-10-18-1` not pushable: A10). `/about`: every project with its status,
  the four-step method, and counts from the sync, each with the projects linked and
  the snapshot date. Revised the same day on Alpha's instruction: no mention of
  AI-assisted work or prompts on the site or in the copy; the evidence is now
  "5 of 9 keep a written roadmap, 6 have CI".
- **[P1] Restore the contact-form tests** — PR #9 (2026-10-16). 14 tests: rate
  limiter windows and key extraction; route success, validation (422), malformed body,
  unconfigured delivery (mailto fallback), provider rejection and network failure
  (502), and rate limiting (429). The honeypot test was not ported: the current form
  has no honeypot (new item 14). Form-state tests need a DOM test environment; left out.
- **[P1] Real screenshots from the project repos** — PR #8 (2026-10-16).
  `npm run screenshots` copies every image with `from: { repo, path }` in projects.json
  from the project's own public repo (raw.githubusercontent.com, read-only) to
  `public/assets/projects/<slug>/` as WebP. Mezgeb: six phone screens; DocSearch: three
  screens of the original interface. verify-facts checks repo, path, src and source.
  Squash `97c1b89`; tag `v2026-10-16-1` not pushable (A10).
- **[P1] "Recently shipped" feed on the home page** — PR #5 (2026-10-15).
- **[P1] A page per project: /projects/[slug]** — PR #4 (2026-10-15). Release tag
  `v2026-10-15-1` could not be pushed from the cloud session (NEEDS_APPROVAL A10);
  roll back to squash commit `f30bf71` if needed.
- **[P0] Portfolio section from data/projects.json, no stand-in images** — PR #2, `v2026-10-14-2`.
- **[P0] Remove unverifiable claims from the home page** (skill percentages, draft
  testimonials, unwritten notes with stand-in images) — PR #3, `v2026-10-14-3`.
- **Setup:** sync, fact checks, CI, context files — PR #1, `v2026-10-14-1`.
