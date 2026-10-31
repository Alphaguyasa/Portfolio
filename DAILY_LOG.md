# DAILY_LOG.md

One entry per run, newest first. Internal file: never published on the site.

---

## 2026-10-31 — scheduled run (second)

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Actions runs again.** This run's sync PR got a real CI run at 09:37 UTC (green in
  3.5 min), the first since 2026-10-27. Billing was not touched by any run; whatever
  was blocking it (A16) cleared on Alpha's side or by itself.
- **Backlog cleared:** CI re-run (not re-pushed) on #46 and #48, both green.
  - **Sync** — PR #52 (merged, squash `0a4a276`): fresh snapshot plus the Meret update
    from #50 (phases 5 and 6 done in CI, device checks pending). All facts verified.
  - **Item 31** — PR #46 (merged, squash `6f1849f`): no sideways scroll in check:site.
  - **Item 32** — PR #48 (this one): rate limiter capped at 5,000 keys. main merged in
    (no rebase); the log conflict resolved by keeping every entry, newest first. This PR
    also carries the 10-30 and 10-31 morning log entries, which were only on #49/#50.
  - **Superseded, still open:** sync PRs #45, #47, #49, #50. Closing them was refused in
    this session (as on 10-30); close them by hand, nothing in them is lost.
- **Found:** the sync records the newest run of *any* workflow as a repo's CI. For
  NullChat that is now "Release tag" (a tagging job), not "Android CI" (both green
  today, so nothing false is shown). Added as item 35 (P1), top of the roadmap.
- **Roadmap work:** items 31 and 32 were done by earlier runs; merging them is this
  run's two items, so no new item was started.
- **Item 11:** production audit clean. Dev tree: the fast-uri moderate (item 26, due
  2026-11-02) plus a new moderate, minimatch <11.0.1 (GHSA-g3hv-75wg-m249, denial of
  service), reached only through eslint / eslint-config-next. Dev-only, never shipped.
- **Tags:** still refused (A10). Rollback points: squash commits above.

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #52), item 31 no-sideways-scroll (PR #46), item 32 rate limiter cap (PR #48) |
| Merged | #52 yes, `0a4a276` · #46 yes, `6f1849f` · #48 see PR (tags not pushable: A10) |
| Failed or blocked | Closing superseded PRs #45/#47/#49/#50 refused; tags (A10) |
| Roadmap | 7 items open; no replan needed (item 35 added) |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A16 Actions (cleared today; confirm the cause), A15 FYI, A10 tags, A12 |
| Next | Daily sync; item 35 (CI status from the build workflow), then item 26 (from 2026-11-02) |

---

## 2026-10-31 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** last push run green (2026-10-27). **GitHub Actions has not started a job
  since 2026-10-28**: "recent account payments have failed or your spending limit needs
  to be increased" (A16). Nothing has merged since #44, so the 10-28, 10-29 and 10-30
  logs exist only on their open PRs (#45–#49). This run read main and did not see them.
- **Sync** — PR #50 (open, CI not started): all 9 repos read (123 API requests). Meret's
  roadmap now says phases 5 and 6 are done in CI with device checks pending; its status
  note and results say so, backed by a new quote. docsearch's README now notes the
  pivot, so that suggestion is removed from ROADMAP.md. All facts verified, 230 tests pass.
- **Items 31 and 32:** redone before the earlier PRs were found. The item 31 duplicate
  (#51) is closed in favour of #46. The item 32 push was refused because #48 already
  holds that branch, so nothing was overwritten. No new roadmap work is stacked while
  CI is blocked.
- **Lesson for the next run:** list open PRs (`gh api repos/Alphaguyasa/Portfolio/pulls`)
  before starting. While A16 stands, the logs live on open PRs.

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #50); found items 31 (#46) and 32 (#48) already open |
| Merged | None: GitHub Actions will not start jobs (A16) |
| Failed or blocked | CI blocked by billing / spending limit since 2026-10-28; PRs #45–#50 waiting |
| Roadmap | 8 items open (31, 32 in PRs); no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | **A16 Actions blocked** (wait for 1 Nov reset, go public, or allow local checks), A15, A10, A12 |
| Next | If Actions runs again: re-run CI, merge #50 (close #45/#47/#49), #46, #48; then items 33, 34 |

---

## 2026-10-30 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** last push run green (`8ec8126`). Nothing has merged since 2026-10-27.
- **Actions still blocked (A16, third day):** the CI job on this PR was refused again
  with "recent account payments have failed or your spending limit needs to be
  increased". No billing setting was touched. The 2026-10-28 and 2026-10-29 log
  entries and the A16 write-up are in PR #48, which cannot merge yet.
- **Sync** — PR #49 (this one): all 9 repos read (123 API requests; owner listing and
  search still 403). Every fact verified; no status, release or npm version changed, so
  projects.json is unchanged. docsearch's CI is green again and its README now notes
  the Not Alone pivot, so that suggestion left the roadmap. #45 and #47 (older
  snapshots) are superseded by this one; closing them was refused in this session,
  so close them by hand or in the next run.
- **Roadmap items:** none started. Items 31 (#46) and 32 (#48) are done and waiting on
  CI; opening more PRs that cannot merge would only pile up conflicts in ROADMAP.md
  and DAILY_LOG.md, so the run stopped here ("stop earlier if blocked").
- **Merge order once CI runs:** #46, #48, then #49 (resolve the DAILY_LOG conflict by
  keeping both entries, newest first). Then item 26 (fast-uri, due 2026-11-02).

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #49), superseding #45 and #47 |
| Merged | None: GitHub Actions will not start jobs (A16) |
| Failed or blocked | CI blocked by billing/spending limit (A16); release tags (A10); closing #45/#47 refused |
| Roadmap | 7 items open (31 and 32 done in open PRs); no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A16 Actions billing (blocks every merge), A15 FYI, A10 tags, A12 |
| Next | If CI runs: merge #46, #48, #49, close #45/#47; then item 26 and item 33 |

---

## 2026-10-29 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

The 2026-10-28 run's entry and A16 are on PR #46's branch, which has not merged.

- **Main:** last push run (#44) green. **Still blocked: GitHub Actions does not start
  jobs** (A16, same billing / spending-limit annotation as 2026-10-28). Nothing can
  merge under the merge policy; PRs #45, #46 and today's stay open.
- **Sync** — PR #47 (open): all 9 repos read (123 API requests; owner listing and
  search still 403). Every fact verified; no status, release or npm version changed, so
  projects.json is unchanged. docsearch's README now says `main` is Not Alone, so that
  suggestion is dropped from ROADMAP. Supersedes #45 (close #45 once #47 merges).
  230 tests pass locally.
- **Item 32** — PR #48 (open): the rate limiter tracks at most 5,000 keys. Locally:
  lint, typecheck, 232 tests, verify:facts, production audit and build pass; the flood
  test fails without the cap. check:site/Lighthouse not re-run (no page changed).
- Stopped after one roadmap item: more unmergeable PRs would only pile up conflicts.
- **Item 11:** unchanged (fast-uri moderate, dev-only, item 26 due 2026-11-02).
- **Tags:** none (nothing merged).

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #47), item 32 rate limiter cap (PR #48) |
| Merged | #47 no · #48 no · #45/#46 still open (CI cannot start: A16) |
| Failed or blocked | GitHub Actions refuses to start jobs (billing/spending limit, A16), second day |
| Roadmap | 6 items open; no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A16 Actions blocked, A15 critical-fix rule (FYI), A10 tags, A12 second Vercel project |
| Next | Once Actions runs: re-run CI and merge #46, #47 and #48 (close #45); then item 33; item 26 from 2026-11-02 |

---

## 2026-10-28 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last push run (#44).
- **Blocked: GitHub Actions does not start jobs** (A16). Both PRs got a failed check
  after 2 s with no runner: "recent account payments have failed or your spending limit
  needs to be increased". Most likely the free 2,000 minutes for October are used up.
  Nothing can merge under the merge policy, so both PRs stay open and the run stopped
  after one roadmap item instead of two.
- **Sync** — PR #45 (open, not merged): all 9 repos read (123 API requests; owner
  listing and search still 403). Every fact verified; no status, release or npm version
  changed, so projects.json is unchanged. New commits, merged PRs and tags in docsearch,
  Meret, Mezgeb, NullChat and Suq. 230 tests pass locally.
- **Item 31** — PR #46 (this one, open, not merged): check:site fails on horizontal page
  scroll at both widths. Locally: lint, typecheck, 233 tests, verify:facts, production
  audit, build and check:site pass; checked to fail on a forced 2000px element.
  check:lighthouse locally: `/` performance 89 (needs 90; local runs have sat at 89–90
  before, CI scores 96), project page 96, all else 100. This PR does not change pages.
- **Item 11:** unchanged (only the fast-uri moderate, dev-only, item 26 due
  2026-11-02). Production audit clean.
- **Tags:** none (nothing merged).

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #45), item 31 no-horizontal-scroll check (PR #46) |
| Merged | #45 no · #46 no (CI could not start: A16) |
| Failed or blocked | GitHub Actions refuses to start jobs (billing/spending limit, A16), so no merge |
| Roadmap | 7 items open; no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A16 Actions blocked (new), A15 critical-fix rule (FYI), A10 tags, A12 second Vercel project |
| Next | Re-run CI on #45/#46 once Actions works, merge them; then items 32 and 33 |

---

## 2026-10-27 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last 2 push runs (the third was cancelled by the next push).
- **Sync** — PR #42 (merged, squash `3ec8669`): all 9 repos read (123 API requests;
  owner listing and search still 403). Every fact verified; no status, release or npm
  version changed, so projects.json is unchanged. Meret's default-branch CI is green
  again; new merged PRs and NullChat tags.
- **Item 29** — PR #43 (merged, squash `743c871`): `npm audit signatures` in CI right
  after install. It could not run locally (the session proxy refuses Sigstore's TUF
  host with 403); the step passed in CI.
- **Item 30** — PR #44 (this one): README documents the weekly audit and the
  "NOT synced" log line for new public repos.
- **Item 11:** unchanged (only the fast-uri moderate, dev-only, item 26 due
  2026-11-02). Production audit clean.
- **Replan:** 4 items were left, so four were added: no horizontal scroll at 375px in
  check:site (31), a hard cap on the rate limiter's memory (32), signatures in the
  weekly audit (33), title/description/canonical checks (34).
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #42), item 29 registry signatures in CI (PR #43), item 30 README (PR #44) |
| Merged | #42 yes, `3ec8669` · #43 yes, `743c871` · #44 see PR (tags not pushable: A10) |
| Failed or blocked | Release tags not pushable (A10) |
| Roadmap | 8 items open; replan done (items 31–34 added) |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A15 critical-fix rule (FYI), A10 tags, A12 second Vercel project |
| Next | Daily sync; item 31 (no horizontal scroll), then 32 (rate limiter cap); item 26 from 2026-11-02 |

---

## 2026-10-26 — scheduled run (evening)

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

A second scheduled run on the same day; the morning run's PRs (#36–#38) were already merged.

- **Main:** CI green on the last 3 push runs.
- **Sync** — PR #39 (merged, squash `73fec9c`): all 9 repos read (123 API requests;
  owner listing and search still 403). Every fact verified, no status, release or npm
  version changed, so projects.json is unchanged. Meret's last commit is now
  2026-10-26. CI on the default branch turned red for docsearch (`deploy-not-alone`)
  and Meret; the site reads CI live, so it shows that as is.
- **Item 27** — PR #40 (merged, squash `342ed6b`): Actions pinned to commit SHAs.
- **Item 28** — PR #41 (this one): the 404 page is checked by check:site.
- **Item 11:** unchanged (only the fast-uri moderate, dev-only, item 26 due
  2026-11-02). Production audit clean.
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #39), item 27 Actions SHA pins (PR #40), item 28 404 page check (PR #41) |
| Merged | #39 yes, `73fec9c` · #40 yes, `342ed6b` · #41 see PR (tags not pushable: A10) |
| Failed or blocked | Release tags not pushable (A10) |
| Roadmap | 6 items open; no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A15 critical-fix rule (FYI), A10 tags, A12 second Vercel project |
| Next | Daily sync; item 29 (`npm audit signatures`), then 30 (README); item 26 from 2026-11-02 |

---

## 2026-10-26 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last 3 push runs.
- **Sync** — PR #36 (merged, squash `7d90d91`): all 9 repos read (122 API requests;
  owner listing still 403). Every fact verified; no status, release, CI result or npm
  version changed, so projects.json is unchanged. Copy and feed regenerated.
- **Item 25** — PR #37 (merged, squash `548a3d7`): weekly production audit on main
  (`.github/workflows/audit.yml`, Mondays 04:00 UTC). It first runs on 2026-11-02;
  it can also be started by hand.
- **Item 17** — PR #38 (this one): when the owner listing is refused, the sync asks the
  search API and logs public repos missing from the config, without syncing them. The
  cloud run refuses the search API too (403), which is logged and harmless.
- **Item 11:** unchanged, only the fast-uri moderate (dev-only, item 26, due 2026-11-02).
  Production audit clean.
- **Replan:** 4 items were left, so four were added: Actions pinned to SHAs (27), the
  404 page in check:site (28), `npm audit signatures` in CI (29), README update (30).
- **Branch:** a force push to reset the session branch after a squash merge was refused,
  so main is merged into the branch instead (no history rewritten).
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #36), item 25 weekly audit (PR #37), item 17 repo discovery (PR #38) |
| Merged | #36 yes, `7d90d91` · #37 yes, `548a3d7` · #38 see PR (tags not pushable: A10) |
| Failed or blocked | Release tags not pushable (A10) |
| Roadmap | 8 items open; replan done (items 27–30 added) |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A15 critical-fix rule (FYI), A10 tags, A12 second Vercel project |
| Next | Daily sync; item 27 (Actions SHA pins), then 28 (404 page check); item 26 from 2026-11-02 |

---

## 2026-10-24 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last 3 push runs.
- **Sync** — PR #33 (merged, squash `4928d5d`): all 9 repos read (122 API requests;
  owner listing still 403). Every fact verified; no status, release, CI result or npm
  version changed, so projects.json is unchanged. Copy and feed regenerated.
- **Item 23** — PR #34 (merged, squash `bf65d86`): the nine ranged devDependencies
  pinned to their locked versions (no upgrades); `tests/pins.test.ts` guards it.
- **Item 24** — PR #35 (this one): check:site clicks the contact form at both widths
  (empty submit, then a valid one against a stubbed `/api/contact`). 11 pages clean.
- **Item 11:** the 5 high dev-only advisories are no longer reported. New: one
  moderate (fast-uri 3.1.8 via lighthouse → ajv, dev-only); the fix is 5 days old, so
  it is item 26, due on 2026-11-02. Production audit clean.
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.
- Local tooling: Chromium 1243 is preinstalled now, so check:site ran without the
  symlink workaround; `npm ci` on npm 10 worked.

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #33), item 23 exact pins (PR #34), item 24 contact form browser test (PR #35) |
| Merged | #33 yes, `4928d5d` · #34 yes, `bf65d86` · #35 see PR (tags not pushable: A10) |
| Failed or blocked | Release tags not pushable (A10) |
| Roadmap | 6 items open; no replan needed (item 26 added) |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A15 critical-fix rule (FYI), A10 tags, A12 second Vercel project |
| Next | Daily sync; item 25 (weekly production audit), then item 11 re-check / 17 |

---

## 2026-10-23 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last push run (#29).
- **Sync + Next.js patch** — PR #30 (merged, squash `44cb14d`): all 9 repos read (122
  API requests; owner listing still 403). Every fact verified, no status changed;
  docsearch's CI on main is green again, so that suggestion is removed. npm audit then
  showed a **critical** advisory in next ≤16.4.0, which fails CI's production audit, so
  next went to 16.4.1 in the same PR (9 days old: the critical fix overrode the
  two-week rule, logged as A15). Locally: build, check:site 11 pages, Lighthouse `/` 90
  and project page 95.
- **Item 22** — PR #31 (merged, squash `48f5558`): vitest 5.0.3 (two weeks old, fixes both @vitest/mocker
  advisories). Installed with `npm install --before=2026-10-09`, because a plain install
  pulled a two-day-old vite. npm 10 crashes on this tree ("edgesOut"); npm 11 works.
- **Item 21** — PR #32 (this one): the contact form's reply handling is a pure, tested
  function (`src/lib/contact-outcome.ts`); no DOM test dependency added. 8 tests.
- **Item 11:** still 5 high in dev-only tooling (eslint-config-next 16.4.2 unchanged).
- **Replan:** 4 items were left, so three were added: exact dependency pins (23), a
  browser test of the contact form (24), a weekly production audit on main (25).
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.
- Local check:site used the preinstalled Chromium 1194 through symlinks named as the
  1243 headless shell (the shell binary now has to be linked as
  `chrome-headless-shell-linux64/chrome-headless-shell`). CI is unaffected.

### Report

| Field | Content |
|---|---|
| Done | Sync + Next.js 16.4.1 security patch (PR #30), item 22 vitest (PR #31), item 21 form state tests (PR #32) |
| Merged | #30 yes, `44cb14d` · #31 yes, `48f5558` · #32 see PR (tags not pushable: A10) |
| Failed or blocked | Release tags not pushable (A10) |
| Roadmap | 7 items open; replan done (items 23–25 added) |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A15 critical fix under the two-week rule (FYI), A10 tags, A12 second Vercel project |
| Next | Daily sync; item 11 re-check, then item 23 (exact pins) and 24 (form browser test) |

---

## 2026-10-22 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last runs (#24's push run was cancelled by #25's, not failed).
- **Sync** — PR #27 (merged, squash `a3e95cf`): all 9 repos read (122 API requests;
  owner listing still 403). verify:facts failed on one stale quote: NullChat's roadmap
  was replanned and dropped the "231 JVM unit tests" baseline. The result now cites
  "100 instrumented tests run in CI on an API 34 emulator" (NullChat #4/#7), and the
  status note no longer says instrumented tests run only on a phone. No status changed.
  docsearch's CI on main was red at sync time (shown live; suggestion added).
- **Item 19** — PR #28 (merged, squash `ca6cdc4`): cross-site posts to `/api/contact` get 403 before the rate
  limit. Checked against `next start` too: no Origin 422, same origin 422, other site 403.
- **Item 20** — PR #29 (this one): check:site fails on uncaught exceptions and console
  errors. 11 pages clean locally.
- **Item 11:** still 5 high in dev-only tooling (eslint-config-next 16.4.2 unchanged).
  New: 2 moderate in vitest 5.0.0–5.0.2, logged as item 22. Production audit clean.
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.
- Local check:site used the preinstalled Chromium 1194 through symlinks named as the
  1243 headless shell that Playwright expects. CI is unaffected.

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #27), item 19 cross-site posts (PR #28), item 20 page errors (PR #29) |
| Merged | #27 yes, `a3e95cf` · #28 yes, `ca6cdc4` · #29 see PR (tags not pushable: A10) |
| Failed or blocked | Release tags not pushable (A10) |
| Roadmap | 6 items open; no replan needed (item 22 added) |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A10 tags, A12 confirm the second Vercel project is gone |
| Next | Daily sync; item 11 re-check, then item 22 (vitest bump) and 21 (form state tests) |

---

## 2026-10-21 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last 3 runs.
- **Sync** — PR #24 (merged, squash `0910c86`): all 9 repos read (122 API requests;
  owner listing still 403). verify:facts failed on one stale quote: Meret's ROADMAP
  replaced "Phase 0 (tile pack) is only partly done" with "Phase 0 (tile pack) tooling
  is done" and "A real Ethiopia pack has not been built yet" (Meret #28). Meret's lesson
  now says exactly that. No status changed; copy and feed regenerated.
- **Item 15** — PR #25 (merged, squash `e50a330`): security headers on every route, and
  check:site now fails on a missing CSP or a CSP violation (11 pages clean locally).
- **Item 16** — PR #26 (this one): the contact route refuses bodies over 32 KB with 413
  before parsing. Three route tests.
- **Item 11:** re-checked; still 5 high in dev-only tooling, production audit clean.
- **Replan:** 4 items were left, so three were added: refuse cross-site posts to the
  contact route (19), fail check:site on page errors (20), contact form state tests (21).
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.
- Local check:site used the preinstalled Chromium build 1194 through symlinks named as
  the 1243 headless shell that Playwright 1.63 expects. CI is unaffected.

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #24), item 15 security headers (PR #25), item 16 body-size cap (PR #26) |
| Merged | #24 yes, `0910c86` · #25 yes, `e50a330` · #26 see PR (tags not pushable: A10) |
| Failed or blocked | Release tags not pushable (A10) |
| Roadmap | 7 items open; replan done (items 19–21 added) |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A10 tags, A12 confirm the second Vercel project is gone |
| Next | Daily sync; item 11 re-check, then item 19 (cross-site posts) and 20 (page errors) |

---

## 2026-10-20 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main was red:** the push run for #19 failed the Lighthouse gate (`/` performance
  84). The cause was item 18's variance, not #19 (Markdown only). Fixing it was the
  first task.
- **Item 18** — PR #20 (merged, squash `b8db769`): Poppins is no longer preloaded (all
  eight of its files had been preloaded, three of them never used), below-the-fold sections
  sit in Suspense boundaries, and the marquee sparkle is CSS. CI scored `/` at 96 and
  main is green again. Honest note: locally the gain was small (median of 9–15 runs, 89 → 90).
  Tried and dropped: inline CSS, AVIF hero, a lower hero quality, content-visibility,
  no font preloads at all, and serving the check over HTTP/2.
- **Sync** — PR #21 (merged, squash `c70e31e`): all 9 repos read (122 API requests;
  owner listing still 403). docsearch, Meret, Mezgeb, NullChat and Suq were active
  today. No status changed; every quoted fact still verifies; `projects.json` unchanged.
- **Item 14** — honeypot PR (this one): a hidden `company` field on the form; a
  filled one is answered as sent and delivers nothing. Two route tests.
- **Later the same day (Alpha's request):** two Udacity Nanodegree certificates are added
  to the Recognitions section and to PORTFOLIO_COPY.md, each linked to Udacity's own
  verification page. The details come from Alpha's screenshots; the session cannot
  reach udacity.com.
- **Audit:** dev-only still 5 high (item 11); production audit clean.
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.
- Local check:site and check:lighthouse used the preinstalled Chromium (symlinked
  browsers path for Playwright 1.63). PageSpeed Insights for the live site could not
  be read (the shared API quota was used up).

### Report

| Field | Content |
|---|---|
| Done | Item 18 Lighthouse margin (PR #20), sync (PR #21), item 14 honeypot (see PR) |
| Merged | #20 yes, `b8db769` · #21 yes, `c70e31e` · honeypot PR see PR (tags not pushable: A10) |
| Failed or blocked | Release tags not pushable (A10). Local Lighthouse margin is thin (90); CI measured 96. |
| Roadmap | 6 items open; no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A10 tags, A12 confirm the second Vercel project is gone |
| Next | Daily sync; item 11 re-check, then item 15 (security headers) and 16 (body-size cap) |

---

## 2026-10-19 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last 3 runs.
- **Sync** — PR #17 (merged, squash `594e4fb`): all 9 repos read (122 API requests;
  owner listing still 403, so `knownPublicRepos` is used). docsearch, Meret, Mezgeb,
  NullChat and Suq were active today. No status changed (no release or npm version);
  every quoted fact is still in the synced docs, so `projects.json` is unchanged.
- **Item 9** — PR #18 (merged, squash `545f37a`): the nine stand-in images are deleted; the stand-in guard in
  `facts.mjs` stays.
- **Item 10** — PR #19: README rewritten around the data flow and the full command list.
- **Replan:** 4 items were left, so three were added from a short audit: security
  headers (15), a body-size cap on the contact route (16), and finding new public repos
  without the owner listing (17).
- **Lighthouse variance:** PR #19 (Markdown only) failed CI on home-page mobile
  performance 87, where the same build scored 92 on #18. Not caused by the PR; logged
  as item 18 (P1, win back a margin), and CI ran again on the push that added it. Dev-only audit still 5 high; production audit clean.
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.
- Local check:site used the preinstalled Chromium through a symlinked browsers path
  (Playwright now expects build 1243); 11 pages pass. CI is unaffected.

### Report

| Field | Content |
|---|---|
| Done | Sync (PR #17), item 9 dead assets (PR #18), item 10 README (PR #19) |
| Merged | #17 yes, `594e4fb` · #18 yes, `545f37a` · #19 see PR (tags not pushable: A10) |
| Failed or blocked | Release tags not pushable (A10). Lighthouse home performance is flaky around 90 (item 18). |
| Roadmap | 7 items open; replan done (items 15–18 added) |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A10 tags, A12 confirm the second Vercel project is gone |
| Next | Daily sync; item 18 (Lighthouse margin), then item 14 (honeypot) |

---

## 2026-10-18 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last 3 runs.
- **Sync step: skipped again.** All 8 repos in `knownPublicRepos` still return 403 from
  the API; `data/sync/` is still the 2026-10-14 snapshot. NEEDS_APPROVAL A11 updated.
- **Item 6** — PR #10 (merged, squash `ccac03c`): `/about` with every project and its
  status, the four-step method, and counts derived from the sync (5 of 9 listed
  projects carry a CLAUDE.md, 6 have CI), each linked. Linked from the home About
  section, the footer and the sitemap. 9 new tests.
- **Item 8** — PR #11: Lighthouse gate in CI (`npm run check:lighthouse`, median of 3
  mobile runs, `/` and `/projects/mezgeb`, all four categories 90+). The home page
  measured 83–89 on mobile performance, so the hero image now loads eagerly at high
  priority with accurate `sizes`, and unused font files are dropped. 4 new tests.
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.
- **Follow-up from Alpha:** remove anything that presents his work as AI-assisted. The
  /about method, its evidence (CLAUDE.md count replaced by ROADMAP.md count) and the
  "How I work" line in PORTFOLIO_COPY.md were rewritten; a test now fails on such
  wording anywhere on the site or in the copy. Recorded in CLAUDE.md.
- **Sync (later the same day):** Alpha added the project repos to the routine
  (A11 resolved). The sync read all 9 repos: last commits refreshed (five projects
  active today), statuses unchanged. One claim fell out of date: NullChat's "open
  security gap" was closed by NullChat #9 (`v2026-10-15-3`); the lesson now says so
  and cites the roadmap. Copy and Recently-shipped feed regenerated.
- **Alpha's answers (A2–A8):** PR #14 (testimonials stay hidden and are relabelled,
  pricing $20/h · $1,500/mo · $4,000/qtr, bio confirmed, Alpha Coin and Security
  Scanner "completed" with a confirmation rule). PR #15: Adey (private erko) shown as
  "Private work" from its config summary only.
- **Vercel:** a second Vercel project (`portfolio`, root directory `next-app`) fails
  on every PR since at least #8; the deploying project succeeds. Logged as A12.
- Local checks used the preinstalled Chromium; a leftover local server briefly skewed
  one Lighthouse measurement (stale build), re-run clean.

### Report

| Field | Content |
|---|---|
| Done | Item 6 About / How I work (PR #10), item 8 Lighthouse in CI (PR #11) |
| Merged | #10 yes, `ccac03c` (tag not pushable: A10) · #11 see PR |
| Failed or blocked | Release tags not pushable (A10). Sync was blocked until Alpha fixed the routine's repos (A11, resolved the same day). |
| Roadmap | 6 items open; no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A12 failing second Vercel project, A10 tags, A2–A8 (A11 resolved) |
| Next | Daily sync; item 9 (remove dead assets) and item 10 (README refresh) |

---

## 2026-10-16 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus (Fable 5.1 is listed, but the policy is the Opus line); no switch.

- **Main:** CI green on the last 3 runs.
- **Sync step: skipped again.** The new knownPublicRepos fallback ran, but each named
  repo also returns 403 from the API; the sync stopped without touching `data/sync/`
  (still the 2026-10-14 snapshot). NEEDS_APPROVAL A11 updated.
- **Item 5** — PR #8 (merged, squash `97c1b89`): real screenshots copied read-only from
  the project repos by `npm run screenshots`; Mezgeb's six phone screens in a grid,
  DocSearch's three screens of the original interface. verify-facts checks every
  screenshot traces to a file in the project's own repo. 9 new tests.
- **Item 7** — PR #9: contact-form tests restored (14 tests: rate limiter and route).
  Found the honeypot is gone from the current form; added roadmap item 14.
- **Tags:** still refused by the session proxy (A10). Rollback points: squash commits.
- check:site run locally against the preinstalled Chromium (10 pages pass).

### Report

| Field | Content |
|---|---|
| Done | Item 5 real screenshots (PR #8), item 7 contact-form tests (PR #9) |
| Merged | #8 yes, `97c1b89` (tag not pushable: A10) · #9 see PR |
| Failed or blocked | Sync skipped (A11: API 403 for every repo). Release tags not pushable (A10). |
| Roadmap | 8 items open (new: 14 honeypot); no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A11 sync access, A10 tags, A2–A8 |
| Next | Sync if A11 is fixed; item 6 (About / How I work) and item 8 (Lighthouse in CI) |

---

## 2026-10-15 — scheduled run

**Model:** Opus 5.5 (`claude-opus-5-5`). Checked the official models overview: Opus 5.5
is still the newest Opus; no switch needed.

- **Main:** CI green on the last 3 runs.
- **Sync step: skipped.** The cloud session's GitHub access is scoped to this repo, so
  `/users/Alphaguyasa/repos` returns 403. Not worked around; logged as NEEDS_APPROVAL
  A11. `data/sync/` is still the 2026-10-14 snapshot.
- **Item 3** — PR #4 (merged, squash `f30bf71`): `/projects/<slug>` for all 9 projects,
  statically generated; live facts from the sync; in the sitemap; linked from every
  card; check:site now crawls 10 pages. 34 new tests.
- **Item 4** — PR #5: "Recently shipped" section on the home page from
  `data/shipped.json` (newest 8 items, linked to the project page and to the PR/tag).
- **Tags:** pushing `v2026-10-15-*` is refused by the session proxy (git push and REST
  both 403). NEEDS_APPROVAL A10 has the commands. Rollback point: the squash commits.
- **Branches:** the cloud routine is pinned to one working branch
  (`alpha/cool-bardeen-bxivoq`), so PRs came from it instead of `claude/<name>`; main
  was merged back into it between PRs (no force-push).
- Local check:site needed Playwright pointed at the preinstalled Chromium; CI is
  unaffected.

### Report

| Field | Content |
|---|---|
| Done | Item 3 project pages (PR #4), item 4 Recently-shipped feed (PR #5) |
| Merged | #4 yes (no tag: A10) · #5 see PR |
| Failed or blocked | Sync skipped (A11: repo-scoped token). Release tags not pushable (A10). |
| Roadmap | 9 items open; no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A11 sync access, A10 tags, plus A2–A8 from yesterday |
| Next | Sync if A11 is fixed; items 5 (real screenshots, needs other repos readable) or 6 (About / How I work) and 7 (contact-form tests) |

---

## 2026-10-14 — setup run (interactive, Phase 0)

**Model:** Opus 5.5 (`claude-opus-5-5`), the newest Opus available.

Phase 0 (PR `claude/setup`):
- Read the codebase and docs: an existing Next.js 16 single-page site rebuilt from the
  design handoff. Kept its design direction.
- Added the GitHub sync (`scripts/sync-github.mjs`), `portfolio.config.json`,
  `data/projects.json` (9 projects, every number backed by a quote from the repo's own
  docs), the fact verifier, the copy/feed generator, `PORTFOLIO_COPY.md`.
- Added CI: production audit, lint, typecheck, vitest (29 tests), verify:facts, build,
  link check and axe accessibility check at desktop and phone width.
- Pre-existing problems fixed so CI can pass: Next.js 16.3.0 had a critical RCE
  advisory (patched to 16.3.8); accent colour failed WCAG AA contrast (~85 elements).
- Wrote CLAUDE.md, ROADMAP.md (13 items), NEEDS_APPROVAL.md (9 items).

Phase 1 (roadmap items):
- **Item 1** — PR #2 (merged, `v2026-10-14-2`): the Portfolio section renders from
  `data/projects.json` + the sync snapshot (status badges, real last-commit dates, top
  results). Only Mezgeb has a real screenshot; the other six stand-in illustrations
  are gone. About's counts are derived (2 shipped, 5 in development, 8 public repos)
  instead of the hard-coded "8 Projects Shipped".
- **Item 2** — PR #3 (merged, `v2026-10-14-3`): skill percentages replaced by
  "N listed projects" derived from the data; the two draft testimonials are hidden
  behind a `confirmed` flag (NEEDS_APPROVAL A2); unwritten notes and their stand-in
  images hidden until a post exists; nav no longer links to hidden sections.
- Tests: 70 passing (facts, copy, privacy, portfolio, claims).

Phase 2: daily cloud task created for 09:30 Africa/Nairobi (see report).

### Report

| Field | Content |
|---|---|
| Done | Setup (PR #1), roadmap item 1 (PR #2), item 2 (PR #3) |
| Merged | #1 yes `v2026-10-14-1` · #2 yes `v2026-10-14-2` · #3 yes `v2026-10-14-3` |
| Failed or blocked | Nothing failed. Branch protection is unavailable on a private free repo, so the merge policy is self-enforced. |
| Roadmap | 11 items open; no replan needed (first audit written today) |
| Model | Opus 5.5 (newest Opus). ACTION FOR ALPHA: set the task to "Automatically approve" |
| Needs approval | A1–A9 in NEEDS_APPROVAL.md (testimonials, pricing, bio claims, paused statuses, Adey/erko, accent colour, cloud GitHub token) |
| Next | Sync step, then item 3 (a page per project) and item 4 (Recently shipped feed) |
