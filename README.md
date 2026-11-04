# Alpha Guyasa — Portfolio

Developer portfolio for Alpha Guyasa: a home page, an About page and one page per
project, kept in sync with the real repositories. Next.js 16 (App Router) · React 19 ·
TypeScript strict · Tailwind CSS v4. Deployed on Vercel from `main`.

The design comes from the `design_handoff_portfolio` bundle.

## Running it

```bash
npm ci                    # Node 24
npm run dev               # http://localhost:3000
npm run lint
npm run typecheck
npm test                  # vitest
npm run verify:facts      # every claim in data/projects.json backed by the sync
npm run build
npm run check:site        # after build: link check + axe, 1440px and 375px
npm run check:lighthouse  # after build: Lighthouse 90+ in all four categories
```

`check:site` and `check:lighthouse` need a Chromium (`npx playwright install chromium`).
CI (`.github/workflows/ci.yml`) runs all of the above, plus a production `npm audit`
and `npm audit signatures`, on every PR and on `main`.

A second workflow, `.github/workflows/audit.yml`, runs the same production audit
(`npm audit --omit=dev --audit-level=high`) on `main` every Monday at 04:00 UTC, so a
new advisory shows up even in a week with no PRs. It is read-only, skips install
scripts and takes about a minute; start it by hand from the Actions tab at any time.

## How the content flows

```
GitHub repos ──npm run sync──▶ data/sync/index.json      repo metadata, last commit, tags, CI, npm, merged PRs
  (read-only)                  data/sync/docs/<repo>/    verbatim README / ROADMAP / docs
                                        │
data/projects.json ◀── edited by hand, every claim quotes data/sync/docs
        │
        ├── npm run verify:facts   CI gate: quotes, numbers, statuses, dates, images
        ├── npm run copy           PORTFOLIO_COPY.md + data/shipped.json
        └── next build             the site (live facts read from data/sync at build time)
```

1. **Sync.** `scripts/sync-github.mjs` reads the repos named in
   `portfolio.config.json` (public repos by default; a private repo only when listed
   under `include`, and then only its written summary) and writes `data/sync/`. It needs
   `GITHUB_TOKEN`, `GH_TOKEN` or `gh auth token`; a run uses about 120 requests.

   **Finding new repos.** The sync first lists the owner's repos. Where the token may
   not (403), it reads `knownPublicRepos` in `portfolio.config.json` instead, then asks
   the search API (`user:<owner> fork:false`) for any public repo missing from that
   list. Such a repo is **not** synced; the log names it:

   ```
   found public repo <owner>/<repo> that is not in portfolio.config.json knownPublicRepos; it was NOT synced. Add it to the config to include it.
   ```

   Add it to `knownPublicRepos` (or to `skip` to keep it off the site), and give the
   scheduled routine read access to it, so the next sync reads it. Where the search is
   refused as well, the log says so and new public repos have to be added by hand.

   A repo's CI is every workflow run on the newest settled commit of its default
   branch (`scripts/lib/ci.mjs`), not just the newest run: failing if any of them
   failed, passing only if all passed. Cancelled and skipped runs are ignored.
2. **Projects.** `data/projects.json` holds all project content. Each project lists
   `facts: [{ path, quote }]`; a quote must appear verbatim in that repo's synced doc
   (or its description, for `@description`). Every number shown on the site must
   appear in one of the project's quotes. The rules are in `scripts/lib/facts.mjs`.
3. **Verify.** `npm run verify:facts` fails CI on any unbacked claim, a status the
   sync does not support, a stale "since" date, or an image that is not a real
   screenshot from the project's own repo.
4. **Copy and feed.** `npm run copy` regenerates `PORTFOLIO_COPY.md` (Upwork, LinkedIn
   and CV text) and the Recently-shipped feed. Both are generated: edit the data,
   not the output.
5. **Screenshots.** `npm run screenshots` copies the images listed with
   `from: { repo, path }` from each project's public repo into
   `public/assets/projects/<slug>/` as WebP.

`npm run sync` runs steps 1, 3 and 4 in one go.

## Where things live

```
data/                 projects.json, sync snapshot, shipped feed
portfolio.config.json which repos are read; public contacts; private-repo summaries
PORTFOLIO_COPY.md     generated copy to paste into profiles
scripts/              sync, copy, verify-facts, check-site, check-lighthouse, screenshots
  lib/                the pure, unit-tested rules (facts, copy, screenshots, lighthouse)
src/
  app/                layout, home page (section order), /about, /projects/[slug],
                      /api/contact, Open Graph image, sitemap, robots
  components/         one file per section, plus ui.tsx and icons.tsx
  data/site.ts        non-project copy: hero, services, pricing, FAQ, contacts
  lib/                contact validation, rate limiter
tests/                vitest: honesty, privacy, copy, pages, contact route
```

Content lives in data (`data/projects.json`, `src/data/site.ts`); components are
layout only.

### Things worth knowing

- **The `xl:` breakpoint is 1290px, not the Tailwind default 1280px**, and it is
  declared in `rem` (`80.625rem`) in `globals.css`. Tailwind orders breakpoint media
  queries by raw value, and a `px` value sorts ahead of the `rem`-based defaults,
  which silently emits `xl:` *before* `sm:` and makes it lose every conflict.
- **Accent colour** is `#c2410c` (WCAG AA on white). `accent-bright` `#ff4a17` is only
  for text on the dark ink background.
- **Fonts** (Poppins, DM Sans) are self-hosted by `next/font` at build time. No
  runtime request to Google Fonts.
- **Brand logos** in the tool tiles are vendored from the `simple-icons` package
  into `src/components/brand-logos.tsx` rather than hot-linked from a CDN.
  Regenerate with `node scripts/generate-brand-logos.mjs`.
- **Motion** (marquees, the HIRE ME badge) is halted under
  `prefers-reduced-motion: reduce`.
- Accordions are real `<button>` elements with `aria-expanded`/`aria-controls`,
  so they work from the keyboard.
- No analytics.

## Contact form

`POST /api/contact` validates server-side using the same rules as the client
(`src/lib/contact-schema.ts`), applies a per-instance rate limit, then sends via Resend.

Without `RESEND_API_KEY` set, the route returns `{ delivery: "unconfigured" }`
and the form falls back to opening the visitor's mail client with everything
prefilled. To enable real server-side sending, add `RESEND_API_KEY` to the Vercel
project's environment variables and redeploy. See `.env.example`.

## Still outstanding

- **The hero portrait is the original photo**, clipped into the arch. A
  background-removed cut-out PNG would read better; drop it in as
  `public/assets/hero-portrait.jpg` (or a PNG, updating `Hero.tsx`).
- The engineering notes stay hidden until the posts exist.
- The footer subscribe field opens a prefilled email; wire it to a real list
  provider when there is one.

## Deviations from the mock

- The nav is sticky (the handoff recommended it). It carries the hero's grey at
  rest and goes transparent with a backdrop blur once scrolled, so the grey band
  does not travel over the white sections.
- The handoff's stand-in project and note illustrations are not used: a project
  without real screenshots is shown without images. The files remain in the handoff
  bundle.
- The testimonials' three pagination bars were dropped. There are two quotes and
  the mock wired no carousel; dead controls are worse than none.
