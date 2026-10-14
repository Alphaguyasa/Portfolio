# Design notes

Why this library is built the way it is. For maintainers and anyone reviewing a change.

## Hard constraints

These are promises the package makes, and they are enforced in CI.

1. **Zero runtime dependencies.** `dependencies` stays empty. If something appears to need one, that is a design discussion, not a patch.
2. **No `Intl` reliance in core paths.** `Intl` support for Ethiopic is inconsistent across runtimes and Node builds, so core functions must work on a build without ICU. `Intl` may be used only behind a feature-detected optional path.
3. **Pure functions, no global state, no side effects on import.** Importing must not touch `globalThis`, define locales, or mutate prototypes.
4. **Tree-shakeable.** Every module is independently importable. Named exports only, no default export, no barrel that pulls in everything.
5. **Never mutate input.**
6. **Level 2 folding is search-only.** Every function that applies it says so in its own documentation, because someone will otherwise normalize a production database with it.

## Layout

```
src/
  fold/        homophone folding, canonicalization        [core]
  search/      search keys, tokenization, prefix matching
  fuzzy/       Ethiopic-aware edit distance and ranking
  translit/    Ethiopic <-> Latin, both directions
  numerals/    Geez numerals <-> integers
  words/       integers -> Amharic words
  phone/       Ethiopian phone parsing and formatting
  money/       ETB and santim formatting
  index.ts     re-exports only, no logic
data/          the tables, as reviewable JSON
test/vectors/  test vectors, as reviewable JSON
playground/    Next.js demo, its own project
```

Each module has `index.ts` (public), `impl.ts` (logic), and colocated tests. No cross-module imports except from `fold/`, which anything may use — plus one documented exception, below.

## Conventions

- **Verbs for operations** (`fold`, `romanize`, `toGeez`), nouns for types (`FoldOptions`, `PhoneNumber`). No abbreviations.
- **Options objects** beyond two parameters, always with defaults. `fold(text)` works with no options.
- **Return `null`, never `undefined`,** for "no valid result". Parse functions never throw; throwing is reserved for programmer error — a bad option, an out-of-range argument.
- **Optional option properties are typed `T | undefined`.** `exactOptionalPropertyTypes` is on, and callers must be able to forward an optional value straight through.
- **Codepoint arithmetic over lookup tables** where the structure allows. Ethiopic consonants occupy 8 consecutive codepoints in vowel order, so folding is `base = cp - (cp - 0x1200) % 8`, remap, re-add the offset. Smaller, faster, and self-documenting next to a 40-entry map.
- **Every exported symbol has TSDoc with a working `@example`.** They are executed as tests.

## Testing

- **Tables and vectors are committed JSON**, in `data/` and `test/vectors/`. They are the reviewable record of what this library claims about Amharic, and a contributor can correct one without touching code.
- **Runtime code carries typed constants rather than importing JSON**, so the bundle stays dependency-free and tree-shakeable. A drift test asserts the constants still match `data/` — a correction to the JSON cannot silently fail to take effect.
- **Every documented example runs.** `test/doc-examples.test.ts` extracts the `@example` blocks from `src/` and the `js` blocks from `README.md` and asserts them. A wrong example is what people copy.
- **Property tests where the invariant is clear:** folding is idempotent, folding preserves length, transliteration round-trips.
- **Negative tests carry equal weight.** Level 2 must not collapse አለ/አላ, ገና/ጋና, ሰው/ሳው. A normalizer that over-collapses is worse than none.
- **Dense sweeps collect failures and assert once.** 100,000 `expect()` calls is slow enough to trip the default timeout on its own.
- **Genuinely long tests declare their own timeout** rather than raising the global default, which would mask a real hang.
- 100% line, branch, and function coverage on `src/`. If a branch is unreachable, delete it rather than ignoring it.

## Decisions worth knowing

- **Fold range is `U+1200–U+1357`.** Past U+1357 the block stops being 8-aligned — U+1358–U+135A are standalone syllables, then combining marks, punctuation, numerals. Everything outside passes through unchanged.
- **Four canonical families, five variant blocks.** ሀ, ሰ, አ, ጸ, reached from five bases because the h-family has two variants. Five blocks × 8 orders = the 40 folded codepoints.
- **The six labiovelar blocks are gapped and must never be derived arithmetically.** ቈ ቘ ኈ ኰ ዀ ጐ occupy only orders 0, 2, 3, 4, 5. Their reachable orders are listed explicitly in `data/translit-phonetic.json`; a test asserts every listed order is assigned and every omitted one is not.
- **Punctuation is a word boundary, not a deletion.** `stripPunctuation` replaces each run with a single space. Deleting would fuse `ሰላም፡ሱቅ` into one token matching neither word.
- **The Ethiopic wordspace `፡` (U+1361) counts as whitespace**, even though Unicode classes it as punctuation. It does a space's job.
- **`highlightRanges` tracks real offsets; it does not assume identity.** `fold` alone is one-to-one, but the full search-key pipeline is not: `'İ'.toLowerCase()` is two code units from one, punctuation runs collapse, whitespace collapses and trims.
- **`rank` breaks score ties toward an exact string match.** An exact match and its homophone variant both score exactly 1, so without it "exact first" would depend on input order.
- **One Latin spelling per syllable, no aliases.** This makes `romanize` and `toEthiopic` exact inverses over all 279 mapped syllables, and makes incremental input decidable — an alias like `ee` would mean `se` could still become `see`, so ሰ could never commit on the second keystroke.
- **`parseBirr` never does float arithmetic.** 9,175 of the first 100,000 two-decimal amounts are wrong under `Number(text) * 100`, starting at `0.07`. More than two decimal places is rejected rather than rounded.
- **Geez range is 1–999,999, enforced both directions.** The formation rule generalizes above that, but stacked forms are rare and harder to verify, so they are rejected rather than guessed.
- **`toGeez(0)` throws.** Geez has no zero, so there is no correct answer; the caller has to decide what to display.
- **`money/` imports `numerals/`** — the one cross-module import outside `fold/`, so a Geez amount parses as birr. One-directional.
- **`fuzzy/` uses the internal `foldCodePoint`**, not the public `foldChar`, to skip per-character validation in the DP hot path. It is `@internal` and absent from the published surface.
- **The exports map splits `types` per condition.** A single top-level `types` resolves as ESM even under `require`, giving CJS consumers the wrong declaration file. `typesVersions` additionally covers the legacy node10 resolver.
- **The `rank` wall-clock budget is instrumentation-aware.** The v8 coverage provider costs roughly an order of magnitude on that loop. `npm test` enforces the real 100 ms; the coverage run uses a relaxed ceiling. A separate test asserts linear scaling, which is machine-independent.
- **No invisible characters in source.** A formatter once collapsed two literal non-breaking spaces in a regex into `{2}`, which the character class then read as the literals `{`, `2`, `}` — silently deleting the digit 2 from every parsed amount. `\s` already covers every non-breaking and thin space; write anything else as `\uXXXX`.
- **No BOMs.** `.gitattributes` pins LF.

## The playground

A Next.js App Router project in `playground/`, statically exported, deployed to Vercel as plain static files.

- It consumes the library as a `file:..` dependency, which npm resolves as a symlink, so the app goes through the package's real `exports` map — six subpaths. If the exports map breaks, the playground build breaks.
- It is deliberately **not** an npm workspace: the library must keep `dependencies` empty and root `npm ci` must stay fast.
- The font is self-hosted by `next/font`, so the page renders Amharic with no runtime network request and no dependence on the visitor's system fonts.
- URL state uses a small `useUrlState` hook rather than `useSearchParams`, which under static export would need a Suspense boundary.
- The seed data lives in `playground/data/shops.json` so `scripts/check-playground.mjs` can assert the demo still goes from zero hits to some without building the app. Each shop is stored under one spelling, the way a real database holds it — the customer types the variant.

## Known limitations

- **`İ` does not case-fold to `i`.** `'İ'.toLowerCase()` yields `i` plus a combining dot, so it will not compare equal to a plain `i` without a Unicode normalization pass this library does not perform. Ethiopic has no case, so this only affects Latin mixed into the same string.
- **Some syllables cannot be typed.** The `-oa` eighth-order forms (ሇ ቇ ኇ ፇ), ኧ, and the Tigrinya labiovelars ቘ and ዀ have no Latin spelling in the phonetic scheme. They still fold, romanize, and search correctly.
- **Only the `phonetic` transliteration scheme exists.** SERA is the other convention worth having, but shipping a guessed version of an external standard would be worse than not shipping it — a user would trust it precisely because it names a standard. `TransliterationScheme` is a type alias so adding one later is not a breaking change.

## Linguistic review — complete

Twelve judgment calls about Amharic were open. **All twelve were reviewed and confirmed on 2026-08-05**; the full record is in [docs/LINGUISTIC-REVIEW.md](LINGUISTIC-REVIEW.md), which doubles as the questionnaire for a second opinion.

Confirmed as they stand: the `e`/`ie` vowel split, the capital-letter convention for variant consonants and ejectives, the glottal vowel keys, the number words, the መቶ / አንድ ሺህ asymmetry, the ከ santim joiner, the eighth-order folding, the mobile prefixes, and — most importantly — that no two genuinely different words are being merged.

One finding came out of it. Several number words have two spellings in common use, and folding unifies only the pair that is a real homophone:

| Pair | Unified by folding | |
| --- | --- | --- |
| ሶስት / ሦስት | yes | the s-family; folding is exactly for this |
| ሃምሳ / ሀምሳ · ሃያ / ሀያ | no | different vowel order, not a homophone |
| ስድሳ / ስልሳ · ሺህ / ሺ | no | different consonants, different length |

Folding must not be widened to cover these — that is precisely how a normalizer starts collapsing meaning. `fuzzy/` is the intended route and scores every pair at 0.5 or better. Pinned by tests in `src/words/words.test.ts`.

The package stays `0.x` for now because the transliteration scheme has not yet met real users, not because the Amharic is unverified.

## Out of scope

Calendar conversion — deliberately ceded to [abushakir](https://github.com/Nabute/AbushakirJs) and [ethiopian-calendar-date-converter](https://www.npmjs.com/package/ethiopian-calendar-date-converter). Also out: ICU or `Intl` polyfills, fonts and rendering, machine translation, spell checking, and Tigrinya-specific orthography beyond the shared Ethiopic core.
