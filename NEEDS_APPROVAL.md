# NEEDS_APPROVAL.md

Decisions only Alpha can make. Internal file: never published on the site.
Newest first. When Alpha answers, move the item to "Resolved" with the answer.

## Open

### A11. Cloud run cannot read your other repos, so the daily sync is skipped (2026-10-15)
The scheduled cloud session's GitHub access is scoped to this repo only. The sync's
first call (`/users/Alphaguyasa/repos`) returns 403 "sessions are bound to their
configured repositories". Per CLAUDE.md the sync was skipped, not worked around, so
`data/sync/` still holds the 2026-10-14 snapshot (last commits, CI, tags may be stale).
To fix (free): add the public repos (Mezgeb, Suq, docsearch, NullChat, Meret,
ethiopic-text, HUnews, Alpha-digital-coin, vulnerability-scanner-website/Final-year-project)
to the routine's repository list in the Claude app, or run `npm run sync` locally and
push the result. Done on Alpha's go-ahead (2026-10-15): when listing the repos is
refused, the sync now reads the repos named in `portfolio.config.json`
`knownPublicRepos` (add any new public repo there), and it routes through the
session proxy. If any listed repo still cannot be read, the sync stops and keeps the
previous snapshot.

### A10. Release tags cannot be pushed from the cloud run (2026-10-15)
The session's git proxy allows pushing only the working branch, and the REST API
refuses creating refs. PR #4 and PR #5 are merged, but their tags were not created.
To create them yourself:
`git fetch origin && git tag v2026-10-15-1 f30bf71 && git tag v2026-10-15-2 <PR #5 squash commit> && git push origin --tags`.
Alternatively, accept "squash commit SHA in DAILY_LOG" as the rollback point for cloud runs.

### A2. Placeholder testimonials (2026-10-14)
The two quotes (Melkias Teshome, Abdi Fekeda) were drafted for layout and approved
only as placeholders (old README). They are also labelled "Client Testimonials",
though both are described as fellow developers. Under the honesty rules they will be
hidden (roadmap item 2) until you confirm: (a) each person approved the exact wording,
and (b) how they should be labelled (colleague / teammate / client).

### A3. Pricing on the public site (2026-10-14)
The Pricing section shows $15/hour, $1,200/month, $3,200/quarter. The privacy rules
forbid publishing "prices I quoted". I read these as your public rate card, not quotes
to a client, so they stay for now. Confirm, or say "remove pricing" and it goes.

### A4. Biographical claims that the repos cannot verify (2026-10-14)
Kept as you supplied them in the design, but nothing in GitHub backs them:
"1st place, University CTF (HU × INSA)", "Head & Chairperson, Cyber Security Club",
"Focal Person, Leyo, 1 year", "2+ Years Full-Stack", "1+ Year in AI", "BSc Computer
Science, Haramaya University 2023–2026". Confirm they are accurate, and if you can,
add a public link (certificate, news post) to `src/data/site.ts` or tell me where it is.

### A5. Status of Alpha Coin and Security Scanner (2026-10-14)
No commits since March 2026 (Alpha Coin) and May 2026 (Security Scanner, a team
final-year project). I marked both **paused** (the lower claim). If they are finished
rather than paused, say so and I will add a "completed" status.

### A6. Adey and the private "erko" repo (2026-10-14)
No public repo named Adey exists. There is a private repo `erko` ("a classifieds
marketplace for Ethiopia"). Private repos are not shown. If erko is Adey (paused) and
you want it listed, add it to `include` in `portfolio.config.json` with a public
summary, e.g. `"erko": { "name": "Adey", "status": "paused", "summary": "..." }`.

### A7. NullChat = the Bluetooth LE / Wi-Fi Direct mesh chat? (2026-10-14)
NullChat's repo description is "Peer-to-peer Android messaging over Bluetooth LE and
Wi-Fi Direct", and I found no second mesh-chat repo, so I list them as one project.
Tell me if there is a separate repo.

### A8. Brand accent darkened for accessibility (2026-10-14)
The handoff orange `#ff4a17` is 3.4:1 against white text and failed the new
accessibility check in ~85 places. The accent is now `#c2410c` (5.2:1); the original
orange is kept for text on black. Reply "revert accent" if you prefer the original,
but the a11y check would then fail and block every merge.

## Resolved

- **A1. Daily task permissions** (2026-10-14) — the 2026-10-15 scheduled run executed
  without stalling, so permissions are set correctly.
- **A9. Cloud run GitHub access** (2026-10-14) — answered by the 2026-10-15 run: a
  token exists but is scoped to this repo only. Follow-up is A11.
