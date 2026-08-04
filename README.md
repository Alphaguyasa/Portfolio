# Alpha Guyasa — Portfolio

Single-page portfolio for Alpha Guyasa, built from the `design_handoff_portfolio`
bundle. Next.js 16 (App Router) · TypeScript · Tailwind CSS v4.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## How it is put together

```
src/
  app/
    layout.tsx        fonts, metadata, JSON-LD
    page.tsx          section order — the 20 bands from the handoff
    globals.css       design tokens (@theme), marquee/badge keyframes
    api/contact/      contact form endpoint
  components/         one file per section, plus ui.tsx and icons.tsx
  data/site.ts        ALL page copy and content
  lib/                shared contact validation
scripts/              one-off asset + logo generation
```

**All copy lives in `src/data/site.ts`.** Editing text, projects, pricing or FAQs
means editing that file — the components are layout only.

### Things worth knowing

- **The `xl:` breakpoint is 1290px, not the Tailwind default 1280px**, and it is
  declared in `rem` (`80.625rem`) in `globals.css`. This matters: Tailwind orders
  breakpoint media queries by raw value, and a `px` value sorts ahead of the
  `rem`-based defaults — which silently emits `xl:` *before* `sm:` and makes it
  lose every conflict. `xl:` is where the handoff's exact desktop composition
  kicks in; everything below it is the responsive adaptation.
- **Fonts** (Poppins, DM Sans) are self-hosted by `next/font` at build time. No
  runtime request to Google Fonts.
- **Brand logos** in the tool tiles are vendored from the `simple-icons` package
  into `src/components/brand-logos.tsx` rather than hot-linked from a CDN.
  Regenerate with `node scripts/generate-brand-logos.mjs`.
- **Motion** (marquees, the HIRE ME badge) is halted under
  `prefers-reduced-motion: reduce`.
- Accordions are real `<button>` elements with `aria-expanded`/`aria-controls`,
  so they work from the keyboard.

## Contact form

`POST /api/contact` validates server-side using the same rules as the client
(`src/lib/contact-schema.ts`), then sends via Resend.

Without `RESEND_API_KEY` set, the route returns `{ delivery: "unconfigured" }`
and the form falls back to opening the visitor's mail client with everything
prefilled. To enable real server-side sending, add `RESEND_API_KEY` to the Vercel
project's environment variables and redeploy. See `.env.example`.

## Still outstanding (carried over from the handoff)

- **Nine project/note cover images are stand-ins**, not product shots:
  `proj-suq`, `proj-docsearch`, `proj-scanner`, `proj-hunews`, `proj-alphacoin`,
  `proj-nullchat`, `note-sync`, `note-sms`, `note-eval`. Capture real screens and
  replace the files in `public/assets/` — the filenames can stay the same.
  `mezgeb-showcase.png` and `mobile-service.png` *are* real.
- **The two testimonial quotes were drafted for layout and approved as
  placeholders.** Confirm the wording with Melkias Teshome and Abdi Fekeda before
  treating them as real endorsements.
- **The hero portrait is the original photo**, clipped into the arch. A
  background-removed cut-out PNG would read better — drop it in as
  `public/assets/hero-portrait.png`.
- The three engineering notes are unlinked because the posts do not exist yet.
- The footer subscribe field opens a prefilled email; wire it to a real list
  provider when there is one.

## Deviations from the mock

- The nav is sticky (the handoff recommended it). It carries the hero's grey at
  rest and goes transparent with a backdrop blur once scrolled, so the grey band
  does not travel over the white sections.
- The testimonials' three pagination bars were dropped. There are two quotes and
  the mock wired no carousel; dead controls are worse than none.
