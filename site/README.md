# Alpha Guyasa — Portfolio

The production build of the design handed off in [`../README.md`](../README.md).
Next.js (App Router) + TypeScript + Tailwind CSS v4.

## Run it

```bash
npm install
cp .env.example .env.local   # then set RESEND_API_KEY
npm run dev     # http://localhost:3000
npm run build   # production build
npm test        # vitest
npm run lint    # eslint
```

## How it's put together

```
app/
  layout.tsx           fonts, metadata, pre-paint theme script
  globals.css          design tokens (OKLCH), @theme mapping, keyframes
  page.tsx             section order
  not-found.tsx        styled 404
  icon.svg             favicon
  opengraph-image.tsx  1200×630 link preview, generated at build
  robots.ts sitemap.ts
  api/contact/route.ts Resend-backed form handler
components/            one file per section, plus Eyebrow / ThemeToggle / Typewriter
lib/data.ts            projects, craft groups, timeline, links — typed and static
lib/hooks.ts           useTheme / useReducedMotion, via useSyncExternalStore
lib/rateLimit.ts       fixed-window limiter for the form
tests/                 vitest — form, route, limiter
public/                portrait + résumé PDF
```

### Design tokens

The palette lives as CSS custom properties on `:root`, overridden on
`html[data-theme="dark"]`. `@theme inline` maps them to Tailwind colours
(`bg-bg`, `text-ink`, `border-rule`, `text-accent`, …), so the toggle
re-colours everything by flipping one attribute — no `dark:` variants.
Opacity modifiers such as `text-bg/82` compile to the same `color-mix(in oklab, …)`
the design reference used by hand.

### Behaviour

- **Theme** — `localStorage["ag-theme"]`, applied by an inline script in `<head>` before first paint so a dark preference never flashes light. Defaults to light. The attribute on `<html>` is the source of truth; `useTheme` subscribes to it with a `MutationObserver`.
- **Typewriter** — 52ms/char, 2.2s hold, cycles three phrases; renders the first phrase statically under `prefers-reduced-motion`.
- **Scroll reveals** — one `IntersectionObserver` in `RevealObserver` releases every `[data-reveal]` block at 12% visibility, then unobserves it.
- **Work filter** — client state over the five static projects; "All" shows everything.
- **Marquee** — CSS `translateX(0 → -50%)` across a doubled track, 34s linear.
- **Reduced motion** — a global media query kills all animation and transitions.
- **Nav** — below `sm` the links collapse into a disclosure panel; the "Get in touch" pill moves into it so the 64px bar stays uncrowded. Escape closes it.

### Contrast on the dark band

The contact section paints `--bg` on `--ink`, which inverts between themes. At
the design's original opacities the small mono labels measured 4.06:1 in dark
mode — under AA. Small text now sits at `/70` (6.7:1 dark, 8.5:1 light) and
field underlines and placeholders at `/50`, clearing the 3:1 non-text threshold.

### Contact form

`components/ContactForm.tsx` POSTs to `app/api/contact/route.ts`, which sends the
mail through [Resend](https://resend.com). Copy `.env.example` to `.env.local` and
set `RESEND_API_KEY`; the same variable has to exist on the host.

The default sender is Resend's shared `onboarding@resend.dev`, which can **only**
deliver to the address that owns the Resend account. Verify a domain at
resend.com/domains and set `CONTACT_FROM` to lift that restriction.

The route trims and length-caps every field, checks the email shape, and drops
submissions that fill in the hidden `company` honeypot. Replies go to the
sender's address via `replyTo`.

Rate limit: 5 posts per IP per 15 minutes, held in module memory. That is one
serverless instance, not the fleet — enough to stop a script burning the Resend
quota, not a security boundary. `lib/rateLimit.ts` says so at the top and is the
place to swap in Upstash if it ever needs to be authoritative.

## Deploy

Zero-config on Vercel, but **the project's Root Directory must be `site`** —
the repo root holds the design handoff, not the app. `vercel deploy` from this
directory already does the right thing; a Git-triggered build needs the setting.

`RESEND_API_KEY` must exist in the Vercel project's environment variables.
Set `NEXT_PUBLIC_SITE_URL` too once a custom domain is attached, so canonical,
OG, and sitemap URLs stop pointing at the `.vercel.app` host.
