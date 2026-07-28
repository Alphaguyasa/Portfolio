# Alpha Guyasa — Portfolio

The production build of the design handed off in [`../README.md`](../README.md).
Next.js (App Router) + TypeScript + Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## How it's put together

```
app/
  layout.tsx      fonts, metadata, pre-paint theme script
  globals.css     design tokens (OKLCH), @theme mapping, keyframes
  page.tsx        section order
components/       one file per section, plus Eyebrow / ThemeToggle / Typewriter
lib/data.ts       projects, craft groups, timeline, links — all typed, all static
public/           portrait + résumé PDF
```

### Design tokens

The palette lives as CSS custom properties on `:root`, overridden on
`html[data-theme="dark"]`. `@theme inline` maps them to Tailwind colours
(`bg-bg`, `text-ink`, `border-rule`, `text-accent`, …), so the toggle
re-colours everything by flipping one attribute — no `dark:` variants.
Opacity modifiers such as `text-bg/82` compile to the same `color-mix(in oklab, …)`
the design reference used by hand.

### Behaviour

- **Theme** — `localStorage["ag-theme"]`, applied by an inline script in `<head>` before first paint so a dark preference never flashes light. Defaults to light.
- **Typewriter** — 52ms/char, 2.2s hold, cycles three phrases; renders the first phrase statically under `prefers-reduced-motion`.
- **Scroll reveals** — one `IntersectionObserver` in `RevealObserver` releases every `[data-reveal]` block at 12% visibility, then unobserves it.
- **Work filter** — client state over the five static projects; "All" shows everything.
- **Marquee** — CSS `translateX(0 → -50%)` across a doubled track, 34s linear.
- **Reduced motion** — a global media query kills all animation and transitions.

### Contact form

`components/ContactForm.tsx` POSTs to `app/api/contact/route.ts`, which sends the
mail through [Resend](https://resend.com). Copy `.env.example` to `.env.local` and
set `RESEND_API_KEY`; the same variable has to exist on the host.

The default sender is Resend's shared `onboarding@resend.dev`, which can **only**
deliver to the address that owns the Resend account. Verify a domain at
resend.com/domains and set `CONTACT_FROM` to lift that restriction.

The route trims and length-caps every field, checks the email shape, and drops
submissions that fill in the hidden `company` honeypot. Replies go to the
sender's address via `replyTo`. There is no rate limit yet — see the repo notes.

## Deploy

Zero-config on Vercel — the project root is this `site/` directory.
