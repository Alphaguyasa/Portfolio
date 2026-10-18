# DAILY_LOG.md

One entry per run, newest first. Internal file: never published on the site.

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
- **Vercel:** a second Vercel project (`portfolio`, root directory `next-app`) fails
  on every PR since at least #8; the deploying project succeeds. Logged as A12.
- Local checks used the preinstalled Chromium; a leftover local server briefly skewed
  one Lighthouse measurement (stale build), re-run clean.

### Report

| Field | Content |
|---|---|
| Done | Item 6 About / How I work (PR #10), item 8 Lighthouse in CI (PR #11) |
| Merged | #10 yes, `ccac03c` (tag not pushable: A10) · #11 see PR |
| Failed or blocked | Sync skipped (A11: API 403 for every repo). Release tags not pushable (A10). |
| Roadmap | 6 items open; no replan needed |
| Model | Opus 5.5, newest Opus; no action needed |
| Needs approval | A12 failing second Vercel project, A11 sync access, A10 tags, A2–A8 |
| Next | Sync if A11 is fixed; item 9 (remove dead assets) and item 10 (README refresh) |

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
