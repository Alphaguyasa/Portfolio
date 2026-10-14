# DAILY_LOG.md

One entry per run, newest first. Internal file: never published on the site.

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
