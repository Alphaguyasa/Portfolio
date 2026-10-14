# NEEDS_APPROVAL.md

Decisions only Alpha can make. Internal file: never published on the site.
Newest first. When Alpha answers, move the item to "Resolved" with the answer.

## Open

### A1. ACTION FOR ALPHA: set the daily task to "Automatically approve" (2026-10-14)
The cloud scheduled task runs with nobody to approve tool calls. Open the task's
settings in the Claude app and switch permissions to **Automatically approve**,
otherwise every run will stall at its first action.

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

### A9. Cloud run GitHub access (2026-10-14)
The sync needs a GitHub token (~115 API calls per run). The first scheduled run will
confirm whether the cloud environment provides one. If it does not, the run will log
it here and skip the sync rather than work around it.

## Resolved

(none yet)
