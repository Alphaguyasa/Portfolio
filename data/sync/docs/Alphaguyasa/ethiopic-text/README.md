# ethiopic-text

[![npm](https://img.shields.io/npm/v/ethiopic-text?color=1f6f4a)](https://www.npmjs.com/package/ethiopic-text)
[![CI](https://github.com/Alphaguyasa/ethiopic-text/actions/workflows/ci.yml/badge.svg)](https://github.com/Alphaguyasa/ethiopic-text/actions/workflows/ci.yml)
[![gzipped](https://img.shields.io/badge/core-0.49%20KB%20gzipped-1f6f4a)](#size)
[![dependencies](https://img.shields.io/badge/dependencies-0-1f6f4a)](#size)

```js
"ሠላም".includes("ሰላም")            // false
isFoldEquivalent("ሠላም", "ሰላም")   // true
```

Same word. Two spellings. Every Amharic search box in existence quietly returns nothing for the second one.

**Search, matching, and normalization for Ethiopic script.** TypeScript, zero runtime dependencies, 0.49 KB gzipped for the core.

---

## Why

Ethiopic has homophone consonant families — characters that sound identical and that writers use interchangeably. The same shop, the same name, the same product gets spelled either way depending on who typed it. Unicode treats them as different characters, so string comparison fails and nobody notices until a customer says "your search is broken."

Four families, reached from five variant blocks, covering 40 codepoints once you multiply across the vowel orders:

| Sound | Canonical | Also written | Codepoints |
| --- | --- | --- | --- |
| *hä* | ሀ | ሐ ኀ | `U+1200` ← `U+1210`, `U+1280` |
| *sä* | ሰ | ሠ | `U+1230` ← `U+1220` |
| glottal | አ | ዐ | `U+12A0` ← `U+12D0` |
| *ts'ä* | ጸ | ፀ | `U+1338` ← `U+1340` |

Fixing it is codepoint arithmetic, not a lookup table. Ethiopic gives each consonant eight consecutive codepoints in vowel order, so the offset within the block survives a change of base untouched:

```text
order  = (cp - 0x1200) % 8
base   = cp - order
folded = (FOLD_MAP.get(base) ?? base) + order
```

Four lines, all 40 characters, every vowel order.

## Install

```sh
npm install ethiopic-text
```

Node 18+, all modern browsers, and edge runtimes. Dual ESM/CJS. No dependencies, and none planned.

## The two fold levels

This is the one thing to get right before you use the library.

**Level 1 — consonant folding.** Maps ሐ/ኀ → ሀ, ሠ → ሰ, ዐ → አ, ፀ → ጸ, preserving the vowel order. Safe and meaning-preserving: two strings that fold together really are the same word spelled two ways.

**Level 2 — also folds the glottal 4th order** (ኣ → አ), because writers interchange አ/ዓ/ኣ/ዐ freely. This catches ዓለም ≡ አለም, which level 1 misses.

```js
import { fold, isFoldEquivalent } from 'ethiopic-text/fold'

fold('ሠላም')                                    // 'ሰላም'
isFoldEquivalent('ዓለም', 'አለም')                 // false
isFoldEquivalent('ዓለም', 'አለም', { level: 2 })   // true
```

> [!WARNING]
> **Level 2 is search-only.** It is a lossy index key. Store it *beside* your text, never *instead of* it, and never render it to a user. Normalizing a production database with level 2 loses data you cannot get back.
>
> Level 2 does not over-collapse: አለ stays distinct from አላ, ገና from ጋና, ሰው from ሳው. That is asserted by tests, because a normalizer that merges genuinely different words is worse than no normalizer at all.

## Modules

Each one is independently importable and pulls in nothing else.

### `ethiopic-text/fold` — homophone folding

```js
import { fold, isFoldEquivalent, foldChar } from 'ethiopic-text/fold'

isFoldEquivalent('ጸሐይ', 'ፀሐይ')   // true
fold('ሠላም')                       // 'ሰላም'
```

### `ethiopic-text/search` — search keys, prefixes, highlighting

```js
import { searchKey, matchesPrefix, highlightRanges, tokenize } from 'ethiopic-text/search'

searchKey('ሠላም ሱቅ') === searchKey('ሰላም ሱቅ')   // true
matchesPrefix('ሰላም ሱቅ', 'ሠላ')                  // true — variant spelling, mid-string word
tokenize('ሰላም፡ዓለም')                             // ['ሰላም', 'ዓለም']

// Matches on the folded form, returns offsets into the ORIGINAL string.
highlightRanges('ሰላም ሱቅ', 'ሠላም')                // [[0, 3]]
```

`highlightRanges` tracks real offsets rather than assuming folding is length-preserving, so ranges stay correct through punctuation, collapsed whitespace, and case changes.

### `ethiopic-text/fuzzy` — Ethiopic-aware edit distance

Plain Levenshtein treats ሰ and ሱ as maximally different characters, when they are one consonant with two vowels — a typo, not a different word.

```js
import { distance, similarity, rank } from 'ethiopic-text/fuzzy'

distance('ሰላም', 'ሠላም')   // 0   — homophone, free
distance('ሰላም', 'ሱላም')   // 0.5 — same consonant, different vowel
distance('ሰላም', 'ቡና')    // 3   — unrelated
```

`rank` scores 10,000 items in about 9 ms.

### `ethiopic-text/translit` — Latin keystrokes ↔ Ethiopic

How Amharic is actually typed on a Latin keyboard.

```js
import { toEthiopic, romanize, transliterateIncremental } from 'ethiopic-text/translit'

toEthiopic('selam')                    // 'ሰላም'
toEthiopic('adis abeba')               // 'አዲስ አበባ'
romanize('ሰላም')                        // 'selam'

// For a live input field: a buffer stays pending while a keystroke could
// still change what it means.
transliterateIncremental('', 's')      // { committed: '',  pending: 's' }
transliterateIncremental('s', 'e')     // { committed: 'ሰ', pending: ''  }
```

### `ethiopic-text/numerals` — Geez numerals

Geez has no zero and no positional notation. ፻ and ፼ are multiplicative separators, so 1994 is literally *19, hundred, 94*.

```js
import { toGeez, fromGeez, isGeezNumeral } from 'ethiopic-text/numerals'

toGeez(1994)        // '፲፱፻፺፬'
fromGeez('፲፱፻፺፬')   // 1994
fromGeez('፻፻')      // null — malformed, not guessed at
```

Supported range is 1–999,999, and the whole range round-trips in a test.

### `ethiopic-text/words` — numbers in Amharic words

For the line on a receipt that spells the amount out.

```js
import { toAmharicWords, toBirrWords } from 'ethiopic-text/words'

toAmharicWords(1250)   // 'አንድ ሺህ ሁለት መቶ ሃምሳ'
toBirrWords(125050)    // 'አንድ ሺህ ሁለት መቶ ሃምሳ ብር ከሃምሳ ሳንቲም'
```

### `ethiopic-text/phone` — Ethiopian phone numbers

```js
import { parsePhone, formatPhone } from 'ethiopic-text/phone'

parsePhone('+251 91 234 5678').national   // '0912345678'
formatPhone('0912345678', 'pretty')       // '091 234 5678'
parsePhone('0111234567').operator         // 'unknown' — a landline
```

`operator` means *the operator this prefix was allocated to*, not *the network this SIM is on today*. It returns `'unknown'` for anything outside the two mobile blocks, because a library that confidently names the wrong carrier is worse than one that declines to guess.

### `ethiopic-text/money` — birr and santim

```js
import { formatBirr, parseBirr } from 'ethiopic-text/money'

parseBirr('1,234.56')                  // 123456  — santim, exact
parseBirr('፻')                         // 10000   — Geez numerals work too
formatBirr(123456)                     // 'ETB 1,234.56'
formatBirr(123456, { locale: 'am' })   // '1,234.56 ብር'
```

Minor units throughout, and **no float arithmetic anywhere**. Of the first 100,000 two-decimal amounts, 9,175 come out wrong under `Number(text) * 100` — starting at `0.07`. This library splits on the decimal separator and pads as text, so every accepted input is an exact integer. More than two decimal places is rejected rather than rounded.

## Transliteration is ambiguous, and we say so

`romanize` and `toEthiopic` are exact inverses over all 279 syllables the scheme maps. What is *not* reversible is a human's casual romanization: someone writing "selam" for ሠላም cannot be distinguished from someone writing it for ሰላም.

Lowercase spells the everyday consonant. A capital first letter selects the other consonant that Latin conflates with it.

| You type | You get | Alternatives | Type instead |
| --- | --- | --- | --- |
| `he` | ሀ | ሐ, ኀ | `He`, `hhe` |
| `se` | ሰ | ሠ | `Se` |
| `a` | አ | ዐ | `A` |
| `tse` | ጸ | ፀ | `Tse` |
| `te` | ተ | ጠ | `Te` |
| `che` | ቸ | ጨ | `Che` |
| `pe` | ፐ | ጰ | `Pe` |

Those first four rows are exactly the fold families — which is not a coincidence. The ambiguity in *typing* Amharic and the ambiguity in *searching* it are the same ambiguity. `alternativesFor` derives an input method's cycle-key options by inverting the fold map, so a keyboard can never offer a choice that search would treat as different.

```js
import { alternativesFor } from 'ethiopic-text/translit'

alternativesFor('ሰ')   // ['ሰ', 'ሠ']
alternativesFor('ሓ')   // ['ሃ', 'ሓ', 'ኃ']
```

Two more things worth knowing:

- **Longest key wins**, so `she` is ሸ and not ስ + ሄ. Same for `tse`, `nye`, `zhe`, `gwe`.
- **A bare consonant is the 6th order.** `s` is ስ; ሰ is `se`.
- **Latin has one `e` and Amharic needs two.** The 1st order is `e` and the 5th is `ie`, so `bet` is በት while `biet` is ቤት. This is the single most likely thing to trip you up.

## Size

Per subpath, minified and gzipped. Import only what you use.

| Import | Minified | Gzipped |
| --- | --- | --- |
| `ethiopic-text/fold` | 0.76 KB | 0.49 KB |
| `ethiopic-text/phone` | 0.92 KB | 0.45 KB |
| `ethiopic-text/numerals` | 1.20 KB | 0.64 KB |
| `ethiopic-text/words` | 1.45 KB | 0.63 KB |
| `ethiopic-text/money` | 1.68 KB | 0.91 KB |
| `ethiopic-text/fuzzy` | 2.12 KB | 1.07 KB |
| `ethiopic-text/search` | 2.33 KB | 1.15 KB |
| `ethiopic-text/translit` | 2.95 KB | 1.16 KB |
| `ethiopic-text` (everything) | 12.08 KB | 4.77 KB |

## What this does **not** do

**Calendar conversion.** That space is well covered already — use [abushakir](https://github.com/Nabute/AbushakirJs) or [ethiopian-calendar-date-converter](https://www.npmjs.com/package/ethiopian-calendar-date-converter). This library is the text layer, and a twelfth calendar converter helps nobody.

Also out of scope, deliberately: ICU or `Intl` polyfills, fonts and rendering, machine translation, spell checking, and Tigrinya-specific orthography beyond the shared Ethiopic core.

## How this is verified

A normalization library is only worth what its correctness claims are worth.

- The fold table, the transliteration scheme, the Geez values, and the Amharic number words all live in `data/` as reviewable JSON. Runtime code carries typed constants, and a drift test fails the build if the two disagree — so a linguist's correction to the JSON cannot silently fail to take effect.
- Every `@example` in this README's source is executed as a test. They cannot drift from the behaviour they claim.
- Geez numerals round-trip across the entire supported range, all 999,999 of them.
- Transliteration round-trips exactly, in both directions, across all 279 mapped syllables — committed as a fixture, so a diff there is a visible change to the published contract.
- Negative tests carry equal weight: over-collapsing is a worse failure than under-collapsing, and is tested as such.
- Every judgment call about Amharic — the transliteration keys, the number words, which spellings count as the same word — was written down as an answerable question and reviewed by an Amharic reader before release, rather than left implicit in the code.
- 100% line, branch, and function coverage on `src/`.

## Contributing

**Linguistic corrections are the most valuable contribution this project can receive**, and they need no code change — every linguistic claim is JSON in `data/`, and test vectors are JSON in `test/vectors/`. Adding a test case requires no test-code change at all.

If a word folds wrong, transliterates wrong, or is spelled wrong, open an issue with the [*word folds wrong*](https://github.com/Alphaguyasa/ethiopic-text/issues/new?template=word-folds-wrong.yml) template. You don't need to know the codepoints or propose a fix — just the words and what should happen.

**If you read Amharic**, [the linguistic review sheet](docs/LINGUISTIC-REVIEW.md) covers every judgment call this library makes about the language — 15 minutes, no code. All twelve were reviewed and confirmed on 2026-08-05, so a second opinion is what would help most now. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

## Status

`0.x` on purpose — not because the Amharic is unverified, but because the transliteration scheme has not yet met real users, and the way it resolves ambiguous Latin sequences is the part most likely to need revising once it has. The API is stable in shape.

## License

MIT

