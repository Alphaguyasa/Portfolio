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

Next: roadmap items 1 and 2 (honesty fixes on the home page).
