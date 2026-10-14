# ethiopic-text

## 0.1.0

### Minor Changes

- First release.

  Search, matching, and normalization for Ethiopic script, in eight independently importable modules.

  - **`fold`** — homophone folding across the four consonant families writers use interchangeably, so `ሠላም` and `ሰላም` compare equal. Two levels, with level 2 documented as a search-only index key.
  - **`search`** — search keys, word-boundary prefix matching, and `highlightRanges`, which matches on the folded form and returns offsets into the original string.
  - **`fuzzy`** — edit distance weighted for an abugida: homophones cost nothing, a vowel-order slip costs half.
  - **`translit`** — Latin keystrokes to Ethiopic and back, exact inverses over all 279 mapped syllables, plus an incremental mode for live input fields.
  - **`numerals`** — Geez numerals, round-tripping across the whole supported range.
  - **`words`** — numbers written out in Amharic, for receipts.
  - **`phone`** — Ethiopian phone numbers, conservative about naming an operator.
  - **`money`** — birr and santim, parsed as text so no amount ever passes through a float.

  Zero runtime dependencies, dual ESM/CJS, 100% coverage.

  Published as 0.x deliberately: the transliteration scheme's handling of ambiguous Latin sequences will need revision once real users hit it, and several linguistic judgment calls are still awaiting a native reader's review.
