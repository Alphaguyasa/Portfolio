# ROADMAP.md

Prioritized backlog. The daily run takes the **top open item** first, up to 2 per run.
When an item is done, move it to "Done" with its PR number and release tag. Replan
(CLAUDE.md, daily loop step 6) when fewer than 5 items are open.

**Priority:** P0 = honesty / privacy / security / broken build · P1 = core value for
clients reading the portfolio · P2 = important, not blocking · P3 = polish.
**Effort:** S = under half a run · M = about one run · L = split into several PRs first.

Last replan: 2026-10-14 (first audit). 9 items open on 2026-10-15; no replan needed.

---

## Open

### 5. [P1 · M] Real screenshots from the project repos
Mezgeb (`docs/media/screen-*.png`) and DocSearch (`docs/screenshots/*.png`) have real
screenshots in their public repos. Add a script that copies listed screenshots from
the repos (read-only, raw.githubusercontent.com) into `public/assets/projects/<slug>/`,
optimises them with sharp, and records the source path in projects.json.

### 6. [P1 · M] About page and "How I work" section
/about: background, what Alpha builds, and the development method (CLAUDE.md context
files, pre-planned prompts, AI-assisted development with verification, CI as the
gatekeeper) backed by numbers derived from the sync (`methodEvidence`: repos with
CLAUDE.md, repos with CI). Link to this repo's own CLAUDE.md flow as a worked example
(description only; the repo is private).

### 7. [P1 · S] Restore the contact-form tests lost in the rebuild
Commit f361113 had 15 tests (rate limiter, contact route validation / honeypot /
missing key / provider failure, form states); the 7b99ee9 rebuild removed them. Port
the rate-limiter and route tests to the new code.

### 8. [P2 · S] Lighthouse check in CI
Add `@lhci/cli` (free, local, no upload) against the built site, asserting 90+ on all
four categories for `/` and one project page, at mobile settings.

### 9. [P2 · S] Remove dead assets
Items 1 and 2 are done, so delete `public/assets/proj-*.png` and `note-*.png` (stand-ins),
with this entry as the reason. They remain in `../design_handoff_portfolio`.

### 10. [P2 · S] README refresh
README still describes a single-page site where all copy is in `src/data/site.ts`.
Document the data flow (sync → projects.json → verify → site/copy).

### 11. [P2 · S] Dev-only dependency advisories
`npm audit` reports 5 high advisories in dev-only tooling (braces/micromatch via
`eslint-config-next`); the only automatic fix downgrades eslint-config-next to 14.
Re-check weekly; take the upstream fix when a 16.x release ships one.

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

- **[P1] "Recently shipped" feed on the home page** — PR #5 (2026-10-15).
- **[P1] A page per project: /projects/[slug]** — PR #4 (2026-10-15). Release tag
  `v2026-10-15-1` could not be pushed from the cloud session (NEEDS_APPROVAL A10);
  roll back to squash commit `f30bf71` if needed.
- **[P0] Portfolio section from data/projects.json, no stand-in images** — PR #2, `v2026-10-14-2`.
- **[P0] Remove unverifiable claims from the home page** (skill percentages, draft
  testimonials, unwritten notes with stand-in images) — PR #3, `v2026-10-14-3`.
- **Setup:** sync, fact checks, CI, context files — PR #1, `v2026-10-14-1`.
