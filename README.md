# Handoff: Alpha Guyasa Portfolio Site

## Overview
A one-page personal portfolio for Alpha Guyasa (frontend/full-stack engineer, Haramaya University). Sections: sticky nav, hero with typing effect, marquee credentials strip, Selected Work (5 real GitHub projects, filterable), About, Craft (skills), Record (experience/education timeline), Contact (form + links + résumé download). Light/dark theme toggle persisted to localStorage.

## About the Design Files
The bundled HTML file is a **design reference** built in a prototyping tool (inline styles, a custom templating syntax like `{{ }}` and `<sc-for>` loops — not real JSX/React). It is not production code to copy verbatim. The task is to **recreate this design in a real Next.js/React + TypeScript + Tailwind codebase** (per the original brief), matching the layout, copy, colors, typography, and interactions described below, using idiomatic components, hooks, and file structure for that stack. If deploying as a static site instead, plain React/Vite is also fine — choose whichever fits the deploy target.

## Fidelity
**High-fidelity.** Colors, type, spacing, and copy are final. Recreate pixel-close using the design tokens below, adapted to Tailwind config / CSS variables in the new codebase.

## Screens / Views
Single page, anchor-linked sections: `#top`, `#work`, `#about`, `#craft`, `#record`, `#contact`.

### 1. Nav (sticky header)
- Height 64px, sticky top, `backdrop-filter: blur(14px)`, background = page bg at 82% opacity, 1px bottom border (`--rule`).
- Left: small accent dot + "A. Guyasa / eng" wordmark (IBM Plex Mono, 12.5px, uppercase, letter-spacing 0.1em).
- Right: nav links (Work, About, Craft, Record) each `padding: 8px 11px`, hover bg `--bg2`; theme toggle button (34×34px, bordered, shows ☾/☀); "Get in touch" pill button (dark bg, pill→accent on hover) linking to `#contact`.

### 2. Hero (`#top`)
- Eyebrow row: "01" in accent + horizontal rule + "Addis Ababa, Ethiopia · UTC+3" (mono, uppercase, 11.5px).
- H1 "Alpha Guyasa." — `clamp(52px,10.5vw,148px)`, weight 600, line-height 0.86, letter-spacing -0.045em, period in accent color.
- Below a rule: two-column-ish stacked block —
  - "Currently" label + typewriter line cycling through: "Frontend & full-stack engineer", "Capture-the-flag competitor", "Open to work — 2026" (52ms/char typing, 2.2s pause, blinking accent-colored caret block).
  - Bio paragraph (serif, Newsreader, 20px/1.55): intro mentioning security-minded engineering background and CTF placement.
  - CTA stack: "See selected work" (dark pill → accent on hover, arrow icon) linking `#work`; "alphaguyasa@gmail.com" (bordered pill, mailto link); "Download résumé" (bordered pill, downloads `alphaguyasaResume.pdf`).
  - Small link row: GitHub (github.com/Alphaguyasa) and phone (0975 567 560), mono uppercase, underlined, muted → accent on hover.

### 3. Marquee strip
- Full-width band, `--bg2` background, top/bottom 1px rules, infinite horizontal scroll (34s linear) of duplicated content: CTF 1st place, Cyber Club leader, Gheero focal person, BSc 2026, "Open to frontend & full-stack roles" — separated by accent diamond glyphs (◆).

### 4. Selected Work (`#work`)
- Eyebrow "02 · Selected work" + H2 "Things I've shipped, and how they were made." + filter pill row: All / Web / Mobile / Security / AI (active = dark filled pill, inactive = bordered muted).
- Grid `repeat(auto-fill, minmax(320px,1fr))`, gap 18px. Each card is a full-card `<a>` (opens repo in new tab): tag (accent, mono uppercase) + index number top row; title (24px/600); body copy (serif, 17px, muted); footer row with stack list (mono, muted) and "View repo ↗" (accent). Border 1px `--rule` → accent on hover, lifts `translateY(-3px)`.
- **Real project content (5 cards, in this order):**
  1. **Website Vulnerability Scanner** — final year project. Orchestrates OWASP ZAP, Nuclei, Nikto behind one dashboard; JWT auth; containerized; tested against Juice Shop/DVWA. Stack: Next.js 16, Fastify, PostgreSQL, Docker, OWASP ZAP. Repo: github.com/vulnerability-scanner-website/Final-year-project. Tags: Security, Web.
  2. **DocSearch** — RAG Q&A over PDF corpora with citations, refuses when uncovered. Hybrid retrieval: Voyage embeddings + pgvector fused with Postgres keyword search via Reciprocal Rank Fusion; streamed answers. Stack: Next.js 15, TypeScript, Supabase pgvector, Voyage. Repo: github.com/Alphaguyasa/docsearch. Tags: Web, AI.
  3. **NullChat** — Android offline mesh messenger; Bluetooth store-and-forward; Ed25519-signed packets, X25519 sessions, Android Keystore-sealed identity keys; QR or 6-word verbal verification. Stack: Kotlin, Jetpack Compose, Room, Nearby, Tink. Repo: github.com/Alphaguyasa/NullChat. Tags: Mobile, Security.
  4. **HU News** — Haramaya University news app in Flutter, live WordPress REST API data; featured carousel, paginated feed, search, embedded video, 3-tier image fallback. Built with 4 classmates; Alpha owned the home screen. Stack: Flutter, Dart, WordPress REST, Android APK. Repo: github.com/Alphaguyasa/HUnews. Tag: Mobile.
  5. **Alpha Coin** — Internet Computer token dashboard; Internet Identity login, balance read, claim-once, transfer. Motoko canister backend + Next.js frontend. Stack: Next.js 15, TypeScript, Motoko, ICP. Repo: github.com/Alphaguyasa/Alpha-digital-coin. Tag: Web.
- Below grid: right-aligned "All repositories on GitHub ↗" link to github.com/Alphaguyasa.

### 5. About (`#about`)
- Eyebrow "03 · About" + 2-col layout: portrait image (grayscale, color on hover, 4:5 ratio, bordered) with caption "Alpha Guyasa — Addis Ababa, 2026"; right column H2 "I came to the web through breaking things." + 3 serif paragraphs (CTF background → frontend security mindset → Cyber Club + Gheero data work) + 3-stat strip (1px-gap grid, bordered cells): "1st — CTF, Haramaya University × INSA", "BSc — Computer science, class of 2026", "1 — University cyber club, led".

### 6. Craft (`#craft`)
- Eyebrow "04 · Craft" + H2 "What I reach for, and why." + explanatory line about skipping percentage bars.
- 2×2ish grid (`auto-fit minmax(290px,1fr)`, 1px gaps forming hairlines) of 4 cards: title + level tag (accent) + note + wrapped tag chips (bordered, mono, `white-space:nowrap`):
  1. **Interface engineering** — Core — React, TypeScript, Next.js 15, Tailwind, Framer Motion, HTML, CSS.
  2. **Mobile** — Shipped — Flutter, Dart, Kotlin, Jetpack Compose, Room, Gradle.
  3. **Backend & data** — Working — Node.js, REST APIs, PostgreSQL, pgvector, Supabase, Motoko, Python.
  4. **Security** — Competitive — OWASP Top 10, Ed25519/X25519, Burp Suite, Wireshark, Nmap, Linux, Bash.

### 7. Record (`#record`)
- Eyebrow "05 · Record" + H2 "Experience, study, and one trophy."
- Vertical list, each row: left column = year (mono, muted), right = role/title (23px/600) + org (accent, mono uppercase) + serif description. Top-bordered rows, hover shifts `padding-left: 8px`. Entries (all dated 2026 per user correction):
  1. Graduated, BSc Computer Science — Haramaya University.
  2. 1st place, Capture the Flag — HU × INSA.
  3. Shipped HU News with a team of five — Mobile App Development course, owned home screen.
  4. Leader, Cyber Club — Haramaya University.
  5. Focal person, Leyu data collection — Gheero.

### 8. Contact (`#contact`)
- Full-bleed dark (`--ink`) band. Eyebrow "06 · Contact" + big H2 "Hiring, or just curious?" (`clamp(38px,7.6vw,104px)`).
- 2-col: left = intro paragraph (serif, light-on-dark) + stacked link list (1px hairline dividers): GitHub, LinkedIn, Phone — each a full-row link, hover fills accent bg.
- Right = contact form: Name, Email, Message (underline-style inputs, dark bg, bottom-border only, accent on focus), accent-filled Submit button labeled "Send message" (state → "Opening your mail app…" after submit), helper note below. On submit: builds a `mailto:` link with subject/body and navigates to it (no backend — purely client-side; a real build should POST to an email service instead).
- Footer bar: "© 2026 Alpha Guyasa" · "Built by hand · Addis Ababa, Ethiopia" · "Back to top ↑" (`#top` anchor).

## Interactions & Behavior
- **Theme toggle**: reads/writes `localStorage["ag-theme"]`, sets `data-theme` attr on `<html>`, swaps CSS variables (see tokens). Defaults to light.
- **Hero typewriter**: cycles 3 strings, ~52ms/char type, 2.2s hold, then next string, infinite loop. Blinking caret (`1.05s steps(1) infinite`).
- **Scroll reveals**: sections fade/slide up (`opacity 0→1`, `translateY(14px)→0`, 700ms ease) via `IntersectionObserver`, threshold 0.12, one-shot (unobserve after firing).
- **Work filter**: client-side filter over 5 hardcoded projects by category tag; "All" shows all.
- **Marquee**: pure CSS `translateX(0 → -50%)` loop over a doubled content block, 34s linear infinite; respect `prefers-reduced-motion` (disable all animations).
- **Contact form**: client-only `mailto:` composition (see above) — swap for a real form handler (e.g. Resend, Formspree, or an API route) in production.

## State Management
- `theme`: 'light' | 'dark', persisted to localStorage.
- `activeFilter`: string, one of All/Web/Mobile/Security/AI.
- `typewriterIndex`/`charIndex`: drives the typing animation.
- `formSubmitted`: boolean, toggles button/help text copy.
- No server state; all project/timeline/skill data can be static arrays/JSON.

## Design Tokens

### Colors (OKLCH, light / dark)
- `--bg`: `oklch(0.968 0.008 85)` / `oklch(0.168 0.008 60)`
- `--bg2`: `oklch(0.945 0.010 85)` / `oklch(0.205 0.009 60)`
- `--ink` (text): `oklch(0.20 0.012 60)` / `oklch(0.945 0.006 85)`
- `--muted`: `oklch(0.505 0.012 60)` / `oklch(0.665 0.010 75)`
- `--rule` (borders): `oklch(0.855 0.012 75)` / `oklch(0.295 0.010 70)`
- `--accent`: `oklch(0.575 0.185 32)` / `oklch(0.735 0.155 40)` (warm vermilion)
- `--onAccent`: `oklch(0.99 0.005 85)` / `oklch(0.16 0.01 60)`

### Typography
- Sans/UI: **Archivo** (400/500/600/700)
- Serif/body copy: **Newsreader** (300/400, italic 300)
- Mono/labels: **IBM Plex Mono** (400/500)
- Scale: hero H1 `clamp(52px,10.5vw,148px)`; section H2 `clamp(30–38px, 4.4–7.6vw, 50–104px)`; body serif 17–21px; labels/mono 11–12.5px, uppercase, letter-spacing 0.08–0.14em.

### Spacing / Radius / Shadows
- Section padding: ~96–120px top on desktop, container max-width 1180px, 28px side gutters.
- Border radius: 2–3px everywhere (sharp, not rounded) — intentionally not the rounded-card-with-accent-border look.
- No drop shadows; hairline 1px borders (`--rule`) do all the separating. No gradients, no glassmorphism except the nav's blur.

### Animation
- Reveal: 700ms ease, translateY 14px.
- Marquee: 34s linear infinite.
- Typewriter: 52ms/char, 2200ms hold.
- Hover transitions: 240–300ms ease.
- All animation disabled under `prefers-reduced-motion: reduce`.

## Assets
- Profile photo: `uploads/photo-1785240404088.jpg` (portrait, grayscale-on-load/color-on-hover treatment).
- Résumé PDF: `uploads/alphaguyasaResume.pdf` (download link in hero).
- No icons/illustrations — all glyphs are Unicode (→, ↗, ◆, ☾/☀, ⭳) styled with the mono font, no icon library needed.

## Files
- `Alpha Guyasa Portfolio.dc.html` — full design reference (all markup/logic/styles inline).
- `uploads/photo-1785240404088.jpg` — profile photo.
- `uploads/alphaguyasaResume.pdf` — résumé.

## Suggested stack for the VS Code build
Next.js (App Router) + TypeScript + Tailwind CSS, per the original brief — map the CSS variables above into `tailwind.config` theme colors / CSS custom properties, keep the section order as-is, extract project/timeline/skill data into small typed arrays (`lib/data.ts`), and swap the mailto-based contact form for a real API route or a service like Resend before deploying. Deploy target: Vercel (zero-config for Next.js) or any static host if you drop the form's server dependency.
