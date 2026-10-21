# NEEDS_APPROVAL.md

Decisions only Alpha can make. Internal file: never published on the site.
Newest first. When Alpha answers, move the item to "Resolved" with the answer.

## Open

### A12. A second Vercel project fails on every PR (2026-10-18)
**Update:** from PR #14 on, the failing `portfolio` project no longer posts; it looks
fixed. Close this once Alpha confirms.
Each PR gets two Vercel statuses. `portfolio-8ybl` builds and deploys fine (it is the
one that deploys main). The other, Vercel project `portfolio`, has its root directory
set to `next-app`, which does not exist in this repo, so it fails on every PR (seen
on #8, #9, #10, #11). GitHub Actions CI is green; the merge policy treats this as a
hosting misconfiguration, not a failing check, so merges continue. Hosting settings
are yours to change: delete or disconnect the `portfolio` project in Vercel, or set
its root directory to the repo root. Nothing was changed on Vercel.

### A10. Release tags cannot be pushed from the cloud run (2026-10-15)
The session's git proxy allows pushing only the working branch, and the REST API
refuses creating refs. PR #4 and PR #5 are merged, but their tags were not created.
To create them yourself:
`git fetch origin && git tag v2026-10-15-1 f30bf71 && git tag v2026-10-15-2 <PR #5 squash commit> && git push origin --tags`.
Alternatively, accept "squash commit SHA in DAILY_LOG" as the rollback point for cloud runs.
Still refused on 2026-10-16; also missing: `git tag v2026-10-16-1 97c1b89` (PR #8) and
`v2026-10-16-2 92c9e97` (PR #9). Still refused on 2026-10-18; also missing:
`v2026-10-18-1 ccac03c` (PR #10) and `v2026-10-18-2` on the PR #11 squash commit.
Still refused on 2026-10-19; also missing: `v2026-10-19-1 594e4fb` (PR #17) and
`v2026-10-19-2`, `-3` on the PR #18 and #19 squash commits.
Still refused on 2026-10-20; also missing: `v2026-10-20-1 b8db769` (PR #20),
`v2026-10-20-2 c70e31e` (PR #21) and `v2026-10-20-3` on the honeypot PR's squash commit.
Still refused on 2026-10-21; also missing: `v2026-10-21-1 0910c86` (PR #24),
`v2026-10-21-2 e50a330` (PR #25) and `v2026-10-21-3` on the PR #26 squash commit.

## Resolved

Answered by Alpha on 2026-10-18:
- **A2 / A14. Testimonials** — both people (university classmates and teammates)
  approved their exact quotes (Alpha, 2026-10-18); shown, labelled as such.
- **A3. Pricing** — Alpha asked for a recommended rate: now $20/hour, $1,500/month,
  $4,000/quarter (was $15 / $1,200 / $3,200).
- **A4. Biography** — all confirmed: 1st place University CTF (HU × INSA),
  chairperson of the HU Cyber Security Club, 2+ years full-stack, 1+ year in AI, BSc
  Computer Science (Haramaya). Leyu (spelling confirmed by Alpha; the site said "Leyo"): still focal person, as a contractor (site now
  says "Current"). Links pending as A13.
- **A5. Alpha Coin and Security Scanner** — both finished, with more planned. New
  status "completed", allowed only with `statusConfirmed: "Alpha, <date>"`. The
  scanner is described as similar to online pentesting platforms.
- **A6. erko** — listed as "Adey" (paused) under "Private work", from the summary
  in `portfolio.config.json` only; the repo is never read, named or linked.
- **A13. Proof links** — Alpha supplied public Telegram posts: HU Cyber Club
  (t.me/HU_CYBER_CLUB/445, chairperson; represented campus, club and department in
  Bahir Dar) and INSA (t.me/insagovet/3068 Cyber Security Month at HU, 3079 photos of
  him presenting his CTF-winning Java code). The cloud session cannot open t.me, so
  the posts were not read; they are linked with neutral labels.
- **A7. NullChat** — it is the only mesh-chat repo.
- **A8. Accent colour** — keep `#c2410c`.
- **A11. Sync could not read the other repos** (2026-10-15 → 2026-10-18) — Alpha added
  the project repos to the routine on 2026-10-18; the sync then read all 9 repos (122
  API requests). Listing the owner's repos is still refused, so the sync reads
  `knownPublicRepos`: a new public repo must be added there (and to the routine)
  before it can appear on the site.
- **A1. Daily task permissions** (2026-10-14) — the 2026-10-15 scheduled run executed
  without stalling, so permissions are set correctly.
- **A9. Cloud run GitHub access** (2026-10-14) — answered by the 2026-10-15 run: a
  token exists but is scoped to this repo only. Follow-up is A11.
