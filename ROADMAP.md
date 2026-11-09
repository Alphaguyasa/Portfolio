# ROADMAP.md

Prioritized backlog. The daily run takes the **top open item** first, up to 2 per run.
When an item is done, move it to "Done" with its PR number and release tag. Replan
(the engineering handbook, daily loop step 6) when fewer than 5 items are open.

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
2026-10-28 → 2026-10-31: GitHub Actions did not start jobs (A16), so nothing merged.
2026-10-31 (second run): Actions ran again; items 31 and 32 merged, item 35 added; 7 open, so no replan.
2026-11-02: items 35 and 33 done; 5 open (34, 26, 11, 12, 13), so no replan.
2026-11-03: 3 items were left after items 26 and 34; added 36–38.
2026-11-04: 4 items were left after items 36 and 37; added 39–42.
2026-11-05: items 39 and 40 done; 6 open (38, 41, 42, 11, 12, 13), so no replan.
2026-11-06: 4 items were left after items 38 and 41; added 43–46.

---

## Open

### 44. [P3 · S] HU News project page shifts more than the others
check:site's new CLS gate (item 41) scores `/projects/hu-news` at 0.034 desktop and
0.035 phone (`main#main` moved); every other page is at 0.005 or less. Under the 0.1
limit, but find the element that changes size after load (likely the phone screenshot
grid) and reserve its space. Lower the limit for that page in a test once it is fixed.

### 45. [P3 · S] check:site reads the built JSON-LD
Item 38's test renders pages in vitest. check:site could also parse every
`application/ld+json` block in the served HTML: valid JSON, exactly one per page,
none on the 404 page, and its `url` equal to the page's canonical. Pure helper + tests.

### 46. [P3 · S] Home page Lighthouse performance margin
Local Lighthouse on `/` scored 87 on 2026-11-06 (CI passes at 90+). Measure the home
page's blocking time and JS size per section, and cut the largest client-side cost so
the margin over 90 is not luck. No new dependency.

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
2026-10-31: production audit clean. New dev-only moderate: minimatch <11.0.1
(GHSA-g3hv-75wg-m249) via eslint / eslint-config-next. Take the fix once a release
with it is two weeks old and eslint-config-next accepts it.
2026-11-02: unchanged (production clean; dev-only fast-uri and minimatch moderates).
2026-11-03: fast-uri fixed (item 26). Left: the minimatch moderate (16 dev-only
entries, all eslint tooling). 11.0.1 was published 2026-10-27 22:26 UTC, so it is two
weeks old from 2026-11-10 22:26 UTC; eslint-config-next 16.4.0 still asks for 3.x and
10.x, so it also needs an upstream release that accepts it.
2026-11-04: unchanged (production clean; 16 dev-only minimatch moderates).
2026-11-05: production clean; `npm audit` now counts 8 dev-only moderates, all the same
minimatch advisory via eslint tooling. Fix still not due before 2026-11-10 22:26 UTC.
2026-11-06: unchanged (production clean; the same dev-only minimatch moderate).

### 12. [P3 · S] Per-project Open Graph images
Generate an OG image per project page with `next/og` (already used for the home page).

### 13. [P3 · M] Amharic version of the key pages
Most projects target Amharic-speaking users; an Amharic summary of the home page and
project pages would show that. Needs Alpha to review wording (the decision log).

## Suggestions for other repos (read-only; for Alpha to apply)

- **NullChat:** has no README; the sync can only cite the repo description and ROADMAP.
- **HUnews:** README's team table includes student ID numbers; consider removing them.
- **ethiopic-text:** 0.1.0 is on npm but has no git tag or GitHub release.
- **Meret:** no repo description is set on GitHub.
- **docsearch:** `deploy-not-alone` failed on main's newest commit (2026-11-02 sync; still failing in the 2026-11-05 sync).

## Done

- **[P3] check:site checks robots.txt** (item 42), 2026-11-09. `/robots.txt` must let every agent read `/` and name the sitemap on the site URL; a named agent blocked from `/` fails too. Rules in `scripts/lib/robots.mjs`, eight tests.
- **[P2] Meret's tagline is behind its status note** (item 43), 2026-11-09. The stale line was Meret's first result, which PORTFOLIO_COPY.md uses as its proof line; it now names phases 1–8 with the device-check caveat. verify:facts fails when results[0] names an earlier phase than a later result.
- **[P3] Layout shift on every page** (item 41), this PR (2026-11-06). check:site records
  `layout-shift` entries from before any page script on all 11 pages at both widths and
  fails above CLS 0.1 (Core Web Vitals session windows; shifts after input ignored), or
  when nothing was recorded. Rules in `scripts/lib/layout-shift.mjs`, seven tests. It
  found a real shift (0.19–0.24 on two project pages at phone width where Arial is
  missing): Poppins now uses `display: "optional"`, so it never swaps in after paint.
- **[P3] Structured data (JSON-LD)** (item 38), PR #67 (2026-11-06), squash `c2cd315`.
  Person on `/` and `/about`, SoftwareSourceCode per project page, from
  `src/lib/structured-data.ts`; the untested layout block (on every page, the 404 too) is
  gone. A test checks every value against the rendered page; it caught the old jobTitle
  "Full Stack Engineer", which `/about` never shows.

- **[P2] check:site checks new-tab and external links** (item 40), this PR
  (2026-11-05). Every crawled page: a `target="_blank"` link needs `rel` with both
  `noopener` and `noreferrer`, a link off the site must be `https:`, and only
  `https:`/`http:` (same site), `mailto:` and `tel:` hrefs are allowed. Rules in
  `scripts/lib/links.mjs`, five tests (one scans every `.tsx` for new-tab anchors).
  Checked to fail on all 11 pages when the footer GitHub link lost `noopener`.
- **[P2] Sitemap dates are real change dates** (item 39), PR #64 (2026-11-05), squash `07cd314`.
  `sitemap.ts` dates each project page by its synced last commit and `/` and `/about`
  by `syncedAt`, instead of the build time for every URL. A test pins both (and fails
  on the old `new Date()`).

- **[P3] check:site compares the sitemap with the crawl** (item 37), PR #61
  (2026-11-04), squash `71f0066`. `/sitemap.xml` must list exactly the crawled pages: every URL absolute,
  on the site URL, no query or fragment, no duplicate, and reached by the crawl; every
  crawled page listed. Rules in `scripts/lib/sitemap.mjs`, six tests (one runs
  `sitemap.ts` itself against the project list). All 11 pages match.
- **[P3] The 404 page gives one robots answer** (item 36), PR #60 (2026-11-04), squash `c887f35`.
  `not-found.tsx` clears the layout's robots and canonical, so only Next's `noindex` is
  left. check:site now fails a crawled page with `noindex` or two robots tags, and a 404
  page without exactly one `noindex` or with a canonical. Six tests.

- **[P3] check:site checks title, description and canonical** (item 34), this PR
  (2026-11-03). Every crawled page needs one non-empty `<title>`, one meta description
  and one canonical link to its own path on the site URL (read from `src/data/site.ts`);
  no two pages may share any of them. Rules in `scripts/lib/page-meta.mjs`, six tests.
  All 11 pages pass; checked to fail when `/about` lost its canonical (it inherited "/").

- **[P2] fast-uri 3.1.9** (item 26), this PR (2026-11-03). Only the lockfile entry for
  fast-uri (dev-only, via lighthouse → ajv) moved from 3.1.8 to 3.1.9, published
  2026-10-19 23:05 UTC (two weeks old). The four fast-uri advisories are gone; nothing
  else moved; production audit clean.

- **[P3] Weekly audit verifies registry signatures** (item 33), this PR (2026-11-02).
  `.github/workflows/audit.yml` runs `npm audit signatures` right after
  `npm ci --ignore-scripts`; a test (fails without the step) keeps it there.
- **[P1] CI status from every workflow on the newest settled commit** (item 35), PR #54
  (2026-11-02), squash `063b6a9`. `scripts/lib/ci.mjs` `summariseCi()`: failing if any
  run on that commit failed, passing only if all passed; cancelled and skipped ignored;
  a still-running commit is skipped for an older settled one. Nine tests. Live check:
  NullChat = Android CI + Release tag, passing; docsearch = ci + deploy-not-alone,
  failing (its deploy job failed). The next sync writes this into index.json.
- **[P2] Hard cap on the rate limiter's memory** (item 32), PR #48 (2026-10-29, merged
  2026-10-31). `src/lib/rateLimit.ts` tracks at most 5,000
  keys; past that the oldest windows are evicted first (a renewed window is
  re-inserted, so map order is window-start order). Two tests flood it with distinct
  keys; the first fails without the cap.
- **[P2] No horizontal scroll in check:site** (item 31), PR #46 (2026-10-28, merged 2026-10-31, squash
  `6f1849f`). At
  1440px and 375px, every crawled page and the 404 page fail when
  `documentElement.scrollWidth` exceeds `clientWidth`; the message names the three
  widest unclipped elements past the edge. Rule in `scripts/lib/overflow.mjs`, three
  tests. All 11 pages fit; checked to fail on a forced 2000px element.
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
  (the decision log A15).
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
  `v2026-10-15-1` could not be pushed from the cloud session (the decision log A10);
  roll back to squash commit `f30bf71` if needed.
- **[P0] Portfolio section from data/projects.json, no stand-in images** — PR #2, `v2026-10-14-2`.
- **[P0] Remove unverifiable claims from the home page** (skill percentages, draft
  testimonials, unwritten notes with stand-in images) — PR #3, `v2026-10-14-3`.
- **Setup:** sync, fact checks, CI, context files — PR #1, `v2026-10-14-1`.
