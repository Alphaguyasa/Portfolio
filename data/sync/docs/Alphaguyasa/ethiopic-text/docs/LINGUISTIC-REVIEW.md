# Linguistic review sheet

**For:** anyone who reads and writes Amharic.
**Needs:** no programming, no Unicode knowledge, no need to open the code.
**Takes:** about 15 minutes. The first three questions carry most of the value — if that is all the time you have, answer those and stop.

---

## What this is

`ethiopic-text` is a small library that fixes Amharic search. Two people spell the same shop name ሰላም and ሠላም, and every search box treats those as different words, so one of them finds nothing. The library folds them together.

Doing that requires making decisions about Amharic. Most were mechanical, decided by how Unicode lays the script out. **Nine were judgment calls**, and they were made by someone who does not speak the language. Each one below shows exactly what the library does today and asks whether that is right.

**Every one of these is cheap to change now and expensive to change after release**, because published behaviour is what people build on. That is the whole reason this sheet exists before version 1.0.

## How to answer

Tick a box, or write what it should be instead. Rough answers are useful — "the second one, I think, but ask someone from Gondar" is a real answer. Guessing is not: leave it blank rather than.

You can edit this file directly, reply with the question numbers, or open an issue.

---

# ✅ Reviewed — 2026-08-05

**All twelve questions were answered by the maintainer, an Amharic reader. Every current choice was confirmed.** The questions are kept below for a second opinion, and because they will need re-asking if the scheme ever changes.

| # | Question | Answer |
| --- | --- | --- |
| 1 | The `e` / `ie` vowel split | **Keep it.** `biet` for ቤት is correct |
| 2 | Capital letters for the variant consonant | **Fine** as it stands |
| 3 | Glottal vowel keys (`a`→አ, `aa`→ኣ) | **Right** |
| 4 | The number words | **Both spellings fine** in each pair — current choices stand |
| 5 | መቶ alone but አንድ ሺህ | **Correct** |
| 6 | The ከ santim joiner | **Right** — as on a cheque |
| 7 | Words, place names, shop names | **All look right** |
| 8 | Which words are treated as the same | **Both lists right** — the matches and the must-not-matches |
| 9 | The four rare eighth-order letters | **Harmless, leave it** |
| 10 | Mobile prefixes 09 / 07 | **Both correct** |
| 11 | Font rendering | **Everything renders** |
| 12 | Tigrinya letters omitted | **Fine for an Amharic library** |

Nothing had to change. That is a meaningful result rather than a formality — question 8 in particular asked whether any two genuinely different words were being merged, which is the failure this library could not recover from.

## One consequence worth knowing

Answer 4 says both spellings in each pair are in common use. Folding only unifies one of them, because folding is about *homophone letters* — same sound, different character — and the rest are different words:

| Pair | Search unifies them? | |
| --- | --- | --- |
| ሶስት / ሦስት | **yes** | ሦ and ሶ are the s-family; folding catches it |
| ሃምሳ / ሀምሳ | no | different vowel order, not a homophone. `distance` 0.5 |
| ሃያ / ሀያ | no | same |
| ስድሳ / ስልሳ | no | ድ and ል are different consonants entirely. `distance` 1 |
| ሺህ / ሺ | no | different length. `distance` 1 |

This is not a bug and folding should not be widened to cover it — that would start merging genuinely different words, which answer 8 confirms it must not do. Use `ethiopic-text/fuzzy` when you need these to match: every pair above scores 0.5 or better, well inside a sensible threshold.

---

# Part A — How people type Amharic

The library lets you type Amharic on a normal Latin keyboard: you type `selam`, you get ሰላም. These three questions are about the choices in that scheme.

## Q1. The two "e" vowels ⭐ most consequential

Amharic has two vowels that both want the Latin letter `e` — the 1st order (ሰ) and the 5th order (ሴ). Latin has one `e`. Something has to give.

**What the library does now:**

| You type | You get | | You type | You get |
| --- | --- | --- | --- | --- |
| `se` | ሰ | | `sie` | ሴ |
| `bet` | በት | | `biet` | ቤት |
| `ken` | ከን | | `kien` | ኬን |

So the word ቤት ("house") is typed **`biet`**, not `bet`.

**The worry:** most people's instinct is to type `bet` for ቤት. If that instinct is common, this scheme fights its users on a very frequent vowel.

- [ ] **Keep it.** `e` = 1st order, `ie` = 5th order. Typing `biet` for ቤት is fine.
- [ ] **Swap them.** `e` should give ቤ, and the 1st order should be something else (what? ________)
- [ ] **Accept both.** `bet` and `biet` should both give ቤት, and the 1st order needs a different key (what? ________)
- [ ] Something else: ________________________________________________

> Changing this affects `data/translit-phonetic.json` only.

## Q2. Capital letters for the "other" consonant ⭐

Several Amharic consonants sound alike, or have an ejective partner, and Latin has only one letter for each pair. The library uses **lowercase for the everyday one, a capital for the other one.**

**What the library does now:**

| Lowercase | | Capital | | What the pair is |
| --- | --- | --- | --- | --- |
| `he` → ሀ | | `He` → ሐ, `hhe` → ኀ | | the three h's |
| `se` → ሰ | | `Se` → ሠ | | the two s's |
| `a` → አ | | `A` → ዐ | | the two glottals |
| `tse` → ጸ | | `Tse` → ፀ | | the two ts' |
| `te` → ተ | | `Te` → ጠ | | plain vs ejective |
| `che` → ቸ | | `Che` → ጨ | | plain vs ejective |
| `pe` → ፐ | | `Pe` → ጰ | | plain vs ejective |

Unambiguous consonants use plain digraphs: `qe`→ቀ, `she`→ሸ, `nye`→ኘ, `zhe`→ዠ, `khe`→ኸ.

**The worry:** this convention was invented for this library. It was not copied from Power Geez, Keyman, Google's Amharic input, or SERA. If Ethiopian users already have muscle memory for a different set of keys, this will feel wrong to everyone.

- [ ] **Fine.** Capitals for the second consonant is what I would expect.
- [ ] **Wrong.** People expect ________________________________________
- [ ] **Partly wrong** — these specific ones are off: ______________________
- [ ] I use a different input method; it does it like this: ________________

> If you know which system most people learned on (Power Geez? Google? Keyman?), say so — that is more useful than an opinion.

## Q3. Typing vowels with no consonant

አ, ኡ, ኢ, ኣ, ኤ, እ, ኦ carry a vowel with no consonant in front. They do **not** follow the pattern every other letter uses, because አ is pronounced /a/ and not /ä/.

**What the library does now:**

| You type | You get | | Compare, with a consonant |
| --- | --- | --- | --- |
| `a` | አ | | `sa` → ሳ |
| `u` | ኡ | | `su` → ሱ |
| `i` | ኢ | | `si` → ሲ |
| `aa` | ኣ | | `sie` → ሴ |
| `ie` | ኤ | | `se` → ሰ |
| `e` | እ | | `s` → ስ |
| `o` | ኦ | | `so` → ሶ |

So `a` gives አ but `sa` gives ሳ — the same letter `a` means the 1st order alone and the 4th order after a consonant. That inconsistency is deliberate, because typing `a` and getting ኣ would surprise people writing አዲስ አበባ.

- [ ] **Right.** `a` should give አ, and `aa` should give ኣ.
- [ ] **Wrong.** It should be: ______________________________________
- [ ] `e` → እ is the part that is wrong; it should be ____________________

# Part B — Numbers written out in words

For the line on a receipt that spells the amount out.

## Q4. Are these the right words? ⭐

**What the library uses now:**

| | |
| --- | --- |
| 1–9 | አንድ · ሁለት · ሶስት · አራት · አምስት · ስድስት · ሰባት · ስምንት · ዘጠኝ |
| 10 | አስር (and አስራ inside 11–19, so 11 is አስራ አንድ) |
| 20–90 | ሃያ · ሰላሳ · አርባ · ሃምሳ · ስድሳ · ሰባ · ሰማንያ · ዘጠና |
| scales | መቶ · ሺህ · ሚሊዮን |
| zero | ዜሮ |
| money | ብር · ሳንቲም |

**Known to have more than one accepted spelling.** Please pick, or say "both are fine":

- 3 — **ሶስት** or ሦስት? ________
- 60 — **ስድሳ** or ስልሳ? ________
- 1000 — **ሺህ** or ሺ? ________
- 50 — **ሃምሳ** or ሀምሳ? ________
- 20 — **ሃያ** or ሀያ? ________

Anything else in that table wrong? ______________________________________

> These live in `data/amharic-numbers.json`. Correcting one is a one-word edit, no code involved.

## Q5. መቶ alone, but አንድ ሺህ

The library treats 100 and 1000 differently.

**What the library does now:**

| Number | Words |
| --- | --- |
| 100 | መቶ |
| 200 | ሁለት መቶ |
| 1000 | **አንድ** ሺህ |
| 2000 | ሁለት ሺህ |
| 1,000,000 | **አንድ** ሚሊዮን |
| 1250 | አንድ ሺህ ሁለት መቶ ሃምሳ |
| 1100 | አንድ ሺህ መቶ |

So መቶ stands alone for 100, but ሺህ and ሚሊዮን always take አንድ. That asymmetry came from one worked example and may just be an accident of it.

- [ ] **Correct.** መቶ alone, but አንድ ሺህ.
- [ ] **Should be አንድ መቶ** for 100 as well.
- [ ] **Should be ሺህ alone** for 1000, without አንድ.
- [ ] Depends on context — explain: ______________________________________

## Q6. How the santim part is joined

**What the library does now:**

| Amount | Words |
| --- | --- |
| 1250.00 | አንድ ሺህ ሁለት መቶ ሃምሳ ብር |
| 1250.50 | አንድ ሺህ ሁለት መቶ ሃምሳ ብር **ከ**ሃምሳ ሳንቲም |
| 1.05 | አንድ ብር **ከ**አምስት ሳንቲም |
| 0.05 | ዜሮ ብር **ከ**አምስት ሳንቲም |

The ከ is attached directly to the next word with no space.

- [ ] **Right** — that is how it reads on a cheque.
- [ ] Should be **እና** instead: ... ብር እና ሃምሳ ሳንቲም
- [ ] Should have a space: ... ብር ከ ሃምሳ ሳንቲም
- [ ] Something else: ______________________________________
- [ ] Also: "ዜሮ ብር ከአምስት ሳንቲም" for 5 santim reads wrong; better would be ____________

# Part C — Word lists to skim

These need a quick read for anything that looks misspelled, not deep thought.

## Q7. Words and place names

Used as test cases. Please flag any misspelling.

ሰላም · ሠላም · ቡና · ወተት · ዳቦ · ስኳር · ሱቅ · ቤት · እናት · አባት · ጓደኛ · እንጀራ · ጸሐይ · ዓለም · ሀገር

አዲስ አበባ · ኢትዮጵያ · ጎንደር · ደሴ · መቀሌ · ባህር ዳር · ሐረር

Shop names used in the demo page:

ሰላም ሱቅ · ሰላም ፋርማሲ · ጸሐይ ወተት · ጸሐይ ዳቦ · ሀገር ቡና · ሀገር ስኳር · አለም ገበያ · አለም ሱቅ · ሀረር ቢራ · ባህር ዳር ዳቦ · ህይወት ፋርማሲ · አዲስ አበባ ሱቅ · ቡና ቤት · ጅማ ቡና · ጎንደር ወተት

- [ ] All look right.
- [ ] These are misspelled: ______________________________________

## Q8. Pairs the library treats as the same word

The library says each group below is **one word spelled different ways**, and a search for any of them finds all of them.

| Treated as the same | |
| --- | --- |
| ሰላም = ሠላም | peace |
| ጸሐይ = ፀሐይ = ጸሀይ = ፀሀይ | sun |
| ሀገር = ኀገር | country |
| አለም = ዓለም = ኣለም = ዐለም | world |
| ሀረር = ሐረር = ኀረር | Harar |
| ሕይወት = ኅይወት = ህይወት | life |
| ባሕር ዳር = ባህር ዳር | Bahir Dar |

And these it keeps **separate**, on purpose — they are different words:

አለ ≠ አላ  ·  ገና ≠ ጋና  ·  ሰው ≠ ሳው

- [ ] Both lists are right.
- [ ] These should **not** be treated as the same word: ______________________
- [ ] These are actually the same and should match: ______________________

> Merging two genuinely different words is the worst failure this library can have — worse than missing a match. If anything in the first list looks wrong, that is the most important thing on this sheet.

## Q9. Four rare letters

The library folds these together when searching. They are the 8th form of their letter, and they are rare.

| Folded together | Same sound? |
| --- | --- |
| ሧ → ሷ | believed yes |
| ኇ → ሇ | believed yes |
| ሗ → ሇ | **unsure** |
| ፇ → ጿ | **unsure** |

The last two look wrong on paper — one is a "-wa" sound and the other an "-oa" sound — but they are so rare that folding them was judged harmless for search.

- [ ] Harmless, leave it.
- [ ] ሗ and ፇ should not fold. (They would then simply never match anything.)
- [ ] Never seen these letters used — do whatever.

---

# Part D — Not language questions

Recorded here so nothing is lost, but these need a different kind of checking.

## Q10. Mobile prefixes — needs a source, not a speaker

The library says **09 = Ethio Telecom** and **07 = Safaricom Ethiopia**, and returns "unknown" for everything else including landlines. This was written from general knowledge, **not checked against the Ethiopian Communications Authority numbering plan.**

- [ ] Both correct.
- [ ] Wrong: ______________________________________
- [ ] Ethiopia has mobile number portability, so a prefix cannot reliably name the current carrier: ☐ yes ☐ no ☐ don't know

> If portability exists, the honest fix is to keep describing the field as "the operator this prefix was allocated to" rather than "the network this SIM is on today", which is what the documentation already says.

## Q11. Do the letters render on your machine?

Open <https://ethiopic-text.vercel.app> (once deployed), or run the playground locally with `npm run playground:dev`.

The page now ships the Amharic font with it rather than fetching one, so it should render even with no Ethiopic font installed and no network. That has been checked in the build output but not on a real machine lacking those fonts.

- [ ] Everything renders.
- [ ] I see boxes □□□ or missing letters — which ones, and what device/browser? ______________

## Q12. Tigrinya

Two labialized letters, ቘ and ዀ, are left out because they are Tigrinya rather than Amharic. Everything else in the script is included.

- [ ] Fine for an Amharic library.
- [ ] I need Tigrinya support; what breaks for me is: ______________________

---

## When you are done

Anything you changed above is enough — no need to write it up separately. If you would rather talk it through, the three that matter most are **Q1** (the two e's), **Q2** (capital letters), and **Q8** (words treated as the same).

Thank you. Corrections to this list are worth more to the project than any feature.

---

<sub>Describes `ethiopic-text` **0.1.0**. Every "what the library does now" table above was generated from the running library rather than written by hand, and checked again after this sheet was written. If the library changes, regenerate them — a review sheet that misstates current behaviour is worse than none.</sub>

