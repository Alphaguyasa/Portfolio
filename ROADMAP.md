# ROADMAP.md

Prioritized backlog. The daily run takes the **top open item** first, up to 2 per run.
When an item is done, move it to "Done" with its PR number and release tag. Replan
(CLAUDE.md, daily loop step 6) when fewer than 5 items are open.

**Priority:** P0 = honesty / privacy / security / broken build · P1 = core value for
clients reading the portfolio · P2 = important, not blocking · P3 = polish.
**Effort:** S = under half a run · M = about one run · L = split into several PRs first.

Last replan: 2026-10-19 (4 items were left after items 9 and 10; added 15–18).
2026-10-20: 6 items open after items 18 and 14, so no replan.
2026-10-21: 4 items were left after items 15 and 16; added 19–21.
2026-10-22: items 19 and 20 done, item 22 added; 6 open, so no replan.
2026-10-23: 4 items were left after items 22 and 21; added 23–25.
2026-10-24: items 23 and 24 done, item 26 added; 6 open, so no replan.
2026-10-26: 4 items were left after items 25 and 17; added 27–30.
2026-10-26 (evening run): items 27 and 28 done; 6 open, so no replan.
2026-10-27: 4 items were left after items 29 and 30; added 31–34.

---

## Open

### 31. [P2 · S] check:site fails on horizontal scroll at 375px
CLAUDE.md asks for pages readable at phone width with no horizontal page scroll, but
check:site does not test it. At 375px, fail a page whose `document.documentElement.
scrollWidth` exceeds its `clientWidth` (marquees must clip, not widen the page). Put
the rule in a pure helper with tests; check it fails on a forced wide element.

### 32. [P2 · S] Hard cap on the contact rate limiter's memory
`src/lib/rateLimit.ts` prunes only expired windows once the map holds 500 keys, so
many distinct client keys inside one window grow it without bound. Add a hard cap
(evict the oldest windows first) and a test that floods it with distinct keys.

### 33. [P3 · S] Weekly workflow also verifies registry signatures
Add `npm audit signatures` to `.github/workflows/audit.yml` after `npm ci
--ignore-scripts`, so a re-published or tampered package is caught in a week with
no PRs too. Extend `tests/workflows.test.ts`.

### 34. [P3 · S] check:site checks title, description and canonical on every page
Each page should have a non-empty `<title>`, a meta description and a canonical link
to its own path on the site URL (clients find the portfolio through search and
shared links). Fail check:site on a missing or duplicated one; pure helper + tests.

### 26. [P2 · S] fast-uri 3.1.9 for four moderate advisories (dev-only)
`npm audit` (2026-10-24) reports GHSA-w74x-v6f9-j3xg, -xhq7-xmqj-769h,
-wjr9-j795-jxcr and -333x-w4r6-6crp in fast-uri 3.1.8, reached only through
lighthouse → ajv (dev-only, never shipped; production audit clean). The fix, 3.1.9,
was published 2026-10-19, so it meets the two-week rule on **2026-11-02**. Then
update the lockfile (`npm update fast-uri --before=<date>`), check that nothing else
moves, and confirm `npm audit` is clean.

### 11. [P2 · S] Dev-only dependency advisories
`npm audit` reports 5 high advisories in dev-only tooling (braces/micromatch via
`eslint-config-next`); the only automatic fix downgrades eslint-config-next to 14.
Re-check weekly; take the upstream fix when a 16.x release ships one.
Still 5 high (dev-only) on 2026-10-20, 2026-10-21, 2026-10-22 and 2026-10-23
(eslint-config-next 16.4.2 still pulls the same chain); production audit clean.
2026-10-24: the 5 high are no longer reported; the dev tree now shows only the
fast-uri moderate (item 26). Keep re-checking until that is gone, then close this.
2026-10-26: unchanged (only the fast-uri moderate, dev-only); production audit clean.
2026-10-26 (evening): unchanged.
2026-10-27: unchanged.

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

- **[P3] README: weekly audit and repo discovery** (item 30), this PR (2026-10-27).
  Documents `.github/workflows/audit.yml` and what to do when the sync logs a public
  repo as "NOT synced" (add it to `knownPublicRepos` or `skip`).
- **[P3] Registry signatures verified in CI** (item 29), PR #43 (2026-10-27), squash
  `743c871`. `npm audit signatures` runs right after `npm ci`; a test keeps it there.
  Not runnable locally (the session proxy blocks Sigstore's TUF host); passed in CI.
- **[P2] 404 page in check:site** (item 28), PR #41 (2026-10-26). check:site opens an
  unknown path at both widths: it must answer 404 (not a soft 200), show the not-found
  page with the CSP header, pass axe, log no error but its own 404, and link home.
  `isOwnNotFound()` allows only the page's own 404 line; three tests. Checked to fail
  when pointed at `/about`.
- **[P2] GitHub Actions pinned to commit SHAs** (item 27), PR #40 (2026-10-26), squash
  `342ed6b`. checkout v4.4.0, setup-node v4.4.0, cache v4.3.0, each the commit `v4`
  pointed to (no behaviour change; all older than two weeks). A test fails on any
  `uses:` that is not a 40-character SHA with a version comment.
- **[P3] Find new public repos without the owner listing** (item 17), PR #38
  (2026-10-26). When the owner listing is refused, the sync now also asks the search
  API (`user:<owner> fork:false`) and logs every public repo it finds that the config
  does not list ("NOT synced. Add it to the config"), without syncing it. A refused
  search is logged and the sync goes on. The cloud run refuses the search API too
  (403), so here it only logs that; it works wherever the token can search. Five tests.
- **[P2] Weekly production audit on main** (item 25), PR #37 (2026-10-26).
  `.github/workflows/audit.yml` runs `npm audit --omit=dev --audit-level=high` on main
  every Monday 04:00 UTC (and by hand), read-only, install scripts skipped, about a
  minute. `tests/workflows.test.ts` keeps its command identical to CI's gate.

- **[P2] Browser test of the contact form** (item 24), PR #35 (2026-10-24). check:site
  now clicks the form on `/` at 1440px and 375px: an empty submit must show all seven
  errors, move focus to the name field and post nothing; a valid one, with
  `/api/contact` stubbed to answer `unconfigured` (so no email can be sent), must post
  the fields with the honeypot empty and reach "Message sent" with the mail-app
  notice, without leaving the page. Checked to fail when the stub answers 500.
- **[P2] Exact dependency pins** (item 23), PR #34 (2026-10-24). The nine ranged
  devDependencies are pinned to the versions already in package-lock.json (no
  upgrades; the lockfile's root entry updated to match, `npm ci` clean).
  `tests/pins.test.ts` fails on any range, on a pin that differs from the lockfile,
  and on a root entry out of step with package.json.
- **[P3] Contact form state tests** (item 21), PR #32 (2026-10-23). The reply handling
  moved out of `ContactForm.tsx` into a pure `contactOutcome()` and `contactMailto()`
  in `src/lib/contact-outcome.ts`: sent, mailto fallback on `unconfigured`, server
  field errors (422), rate limit (429, with a default text) and every other failure
  (the email-me notice, never raw server text). No new dependency. Eight tests; build
  and check:site pass.
- **[P2] vitest past the @vitest/mocker advisories** (item 22), PR #31 (2026-10-23), squash `48f5558`.
  vitest 5.0.2 → 5.0.3 (published 2026-09-30; both advisories are fixed from 5.0.3, so
  5.0.5 was not needed). Installed with `npm install --before=2026-10-09`, so the
  re-resolved transitive tooling (vite 8.3.4, rolldown 1.2.13) is also two weeks old;
  a plain install had pulled a two-day-old vite. The 2 moderate are gone.
- **[P0] Next.js 16.4.0 → 16.4.1** (main-broken fix, not a roadmap item), PR #30
  (2026-10-23), squash `44cb14d`. A critical advisory in next ≤16.4.0 failed CI's
  production audit. 16.4.1 was 9 days old; the critical fix overrode the two-week rule
  (NEEDS_APPROVAL A15).
- **[P2] check:site fails on page errors** (item 20), PR #29 (2026-10-22). Any uncaught
  exception (`pageerror`) or console error now fails the page, at both widths; the rule
  lives in `scripts/lib/page-errors.mjs` with an allowlist that starts empty. 11 pages
  clean locally. Four tests.
- **[P2] Refuse cross-site posts to /api/contact** (item 19), PR #28 (2026-10-22). A
  request whose `Origin` is not the site's own host (canonical URL, the addressed host,
  `Host` or `X-Forwarded-Host`) gets 403 before the rate limit runs; no `Origin` is
  unchanged. Eleven tests.
- **[P2] Contact body-size cap** (item 16), PR #26 (2026-10-21). `/api/contact` refuses a
  body over 32 KB with 413 before parsing: a declared `Content-Length` is checked first,
  then the stream is read with a running count and cancelled past the cap. 32 KB, not
  16, because a full 5,000-character message in Amharic is about 15 KB. Three route tests.
- **[P2] Security headers** (item 15), PR #25 (2026-10-21), squash `e50a330`. CSP limited
  to the site's own origin (`frame-ancestors 'none'`, `object-src 'none'`; `'unsafe-inline'`
  scripts because nonces would make the static pages dynamic), nosniff, strict referrer
  policy, `X-Frame-Options: DENY`, Permissions-Policy off for camera, microphone and
  geolocation. check:site fails on a missing CSP header or a CSP violation. Four tests.

- **[P1] Udacity certificates** (Alpha's request, 2026-10-20). Two Nanodegree certificates
  (Artificial Intelligence Fundamentals, Android Developer Fundamentals, both issued
  2025-08-22) are in `data/certificates.json`. They appear as a fourth Recognitions card
  that links to Udacity's verification pages, and as a "Certificates" section in
  PORTFOLIO_COPY.md. The details come from Alpha's screenshots, because the cloud
  session cannot reach udacity.com.

- **[P2] Honeypot field on the contact form** (item 14), from the PR after #21 (2026-10-20).
  The form has a hidden `company` field: off-screen, `aria-hidden`, `tabIndex=-1`,
  `autoComplete="off"`. The route answers a filled one as sent and delivers nothing.
  Two route tests.
- **[P1] Lighthouse margin on the home page** (item 18), PR #20 (2026-10-20), squash
  `b8db769`. Poppins is no longer preloaded: all eight of its files had been preloaded,
  competing with the hero image. Below-the-fold sections sit in Suspense boundaries
  (hydration runs as shorter tasks), and the marquee sparkle is CSS. CI scored `/` at
  96 (main had been 84–92). Locally the median of 9–15 runs only moved from 89 to 90.
  The rest of the cost is the page's size: with JS, CSS and fonts blocked, LCP is
  still 2.3 s. If the gate turns flaky again, the next lever is fewer sections on `/`,
  which is a content decision for Alpha.

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
