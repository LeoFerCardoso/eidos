# Typography craft rules

Universal typography rules that apply on top of any `DESIGN.md`. The
active design system decides *which* fonts; this file decides *how* they
behave at every size.

> Adapted from [refero_skill](https://github.com/referodesign/refero_skill)
> (MIT) — distilled and re-tuned for Open Design's token system.

## Eidos type scale — the 9 canonical steps (HARD RULE)

Eidos type is a **fixed 9-step scale**, not a range. The source of truth is
**Foundations / Typography** (`src/ds/migrated/typography.tsx`) and the
`.t-*` utilities in `tokens.css`. **There is no 12.5, no 13.5, no 14, no 16.**
A size that isn't on this list is a bug.

| Class | px | token | Use |
|---|---|---|---|
| `.t-display-xl` | 72 | `--text-display-xl` | Marketing hero. Once per page. |
| `.t-display-lg` | 56 | `--text-display` | Onboarding / splash title. |
| `.t-h1` | 36 | `--text-3xl` | Page title in product chrome. |
| `.t-h2` | 28 | `--text-2xl` | Section title. |
| `.t-h3` | 20 | `--text-xl` | Card title, sub-section. |
| `.t-body-lg` | 17 | `--text-lg` | **Lede below a display/page heading.** Page-header lede (`.ds-ph-lede`). |
| `.t-body` | 15 | `--text-body` | **Default paragraph, table cells, section intro / `<Lede>`, descriptions.** |
| `.t-small` | 13 | `--text-base` | **Card / a11y / helper / caption / footer-meta body.** Inline code (`<Mono>`). |
| `.t-mono-label` | 11 | `--text-xs` | Eyebrows above titles, table column headers. ALL-CAPS mono. |

`--text-sm` and `--text-md` are **aliases** snapped onto the scale (13 / 15) —
they exist only so legacy inline usage stays on-scale; prefer `--text-base` /
`--text-body`. Numeric ladder for the escape hatch: a custom `<td>`/`<span>`
may use `var(--text-*)`, never a raw px.

### Doc-page element → role (use these, nothing else)

- **Page H1 + eyebrow + page-lede** → the `<Section title desc>` header renders them (`t-h1` + `t-mono-label` + `.ds-ph-lede`=17). Don't hand-build.
- **Section heading** → `<SubHead meta="…">` (one per section; `meta` is the mono eyebrow).
- **Section intro / explainer paragraph** → `<Lede>` (renders `.ds-caption` = **t-body 15**, muted, 64ch). Replaces every `const lede` / `<p style={…}>`.
- **Card / a11y / feature-card body** → `className="t-small"` (or `var(--text-base)` inline) muted, line-height 1.5. **Not 13.5.**
- **Inline code / token / prop name in prose** → `<Mono>` (mono, 13, ember). Replaces `<code style={mono}>`.
- **Frame caption / short note under a Frame** → `.ds-caption` or `t-small`.
- **Eyebrows / table column headers / numeric labels** → `t-mono-label` (11) / `var(--font-mono)`.

### Forbidden (the hook blocks these — `${CLAUDE_PLUGIN_ROOT}/hooks/typography-scale.mjs`)

- A literal `fontSize: 13.5 / 12.5 / 14.5 / 16` anywhere in a DS page → **hard-blocked**. These were the systemic drift; they are never a real size.
- Any other hand-rolled `fontSize: <px>` for **page chrome / doc prose** → use a `.t-*` class or `--text-*` token. Raw px is allowed *only* inside a component/demo being rendered (a 22px specimen, an 11px badge), never in the surrounding documentation.

## Type scale (other design systems / non-Eidos artifacts)

When the active `DESIGN.md` is **not** Eidos, use a multiplicative scale (1.2
or 1.25), capped at 6–8 sizes per artifact (Display 48–72 · H1 32–48 · H2
24–32 · H3 20–24 · Body 15–18 · Small 13–14 · Caption 11–12). Eidos work
**must** use the fixed 9 steps above.

## Line height (leading)

| Text size | Line height |
|---|---|
| Display / H1 (≥32 px) | `1.0`–`1.2` (tight) |
| Body (15–18 px) | `1.5`–`1.6` |
| Small (≤14 px) | `1.5` |

## Letter-spacing — the rule that makes or breaks craft

This is the single most-skipped rule in AI-generated design. **No
exceptions.**

| Context | Letter-spacing |
|---|---|
| Body text (14–18 px) | `0` (default) |
| Small text (11–13 px) | `0.01em` to `0.02em` (positive) |
| UI labels and button text | `0.02em` |
| **ALL CAPS** | **`0.06em` to `0.1em` (required)** |
| Headings 32 px+ | `-0.01em` to `-0.02em` |
| Display 48 px+ | `-0.02em` to `-0.03em` |

ALL CAPS without positive tracking looks cramped and amateur. Display
text without negative tracking looks loose and weak. These two failures
are the most reliable AI-slop tells.

The `0.06em` floor is not arbitrary: it is the empirical lower bound
that print and web typographers have converged on for uppercase
tracking (cf. Bringhurst's *Elements of Typographic Style* §3.2.7,
which recommends 5–10% of the em for caps; modern screen practice
rounds the lower end to 0.06em). Anything tighter and the counters
collide on screen; the upper bound `0.1em` keeps the word from
disintegrating into letters.

## Font pairing

- Maximum 2 typefaces per artifact (display + body, or one variable face
  used at multiple weights).
- Always declare a system fallback chain. If the active `DESIGN.md`
  ships a webfont URL, the fallback must still produce a coherent look.
- Never set `font-family: system-ui` alone on a heading — that is the
  textbook AI default; always pair it with an intentional first choice.

## Line length

Limit body copy to **50–75 characters** per line. In CSS:
`max-width: 65ch` is a safe default.

## Three-weight system

Most well-crafted UIs use exactly 3 weights:
- **Read** (400 / 450) — body copy
- **Emphasize** (510 / 550) — UI text, labels, navigation
- **Announce** (590 / 600) — headlines, buttons

Weight 700+ is rarely needed. If your design uses bold for "emphasis on
emphasis," it likely lacks weight discipline elsewhere.

## Common mistakes (lint these)

- ALL CAPS without `letter-spacing` ≥ `0.06em`.
- Display text (≥32 px) without negative tracking.
- More than 3 type sizes visible above the fold.
- Mixed serif and slab on the same screen without a clear role split.
- Body copy in `text-align: justify` (creates rivers; never use on the web).
