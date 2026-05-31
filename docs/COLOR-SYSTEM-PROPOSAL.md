# Eidos color system — proposal & relocation (v2)

**Date:** 2026-05-21 · **Scope:** core color tokens (`src/styles/tokens.css`, dark + light) +
the `/color` page + where domain palettes live. **Status:** awaiting approval.

## TL;DR

Eidos's color foundation is strong — OKLCH surface tiers, alpha borders, a warm 4-step
foreground ramp, a single ember accent, and a full data-viz palette. Three gaps remain:

1. **The status layer is inconsistent.** Ember has 6 variants; danger has `soft + fg`;
   success/warning have only `-soft`; ice/violet almost nothing. Every Alert/Badge/Banner
   re-derives its border and text colour by hand.
2. **No `info` role.** `--ice` is used informally for "informational" — every mature system
   ships an explicit `info`/`information`.
3. **Two doc sections sit in Core that describe sub-DS domains** (data-viz → Charts;
   severity/run-status/health/risk → IDP).

**Proposal:** define **one 7-token contract** that *every* functional role implements, add
`info`, **keep `-fg` meaning "ink on the solid"** (so `--ember-fg`/`--danger-fg` don't change
meaning) and add `-text` for in-hue text on the page. All additive / non-breaking. Then move
the two domain sections out of Core. Concrete values are in §4.

---

## 1. What Eidos has today

| Layer | Tokens | State |
|---|---|---|
| Surfaces | `--bg`, `--bg-elevated`, `--surface`(+`-hover`/`-overlay`/`-active`/`-selected`) | ✅ OKLCH, 7 tiers |
| Borders | `--border-subtle / - / -strong / -stronger` | ✅ alpha ramp |
| Foreground | `--fg / -muted / -subtle / -faint` | ✅ 4-step |
| Accent | `--ember`(+`-glow`/`-deep`/`-soft`/`-softer`/`-fg`) | ✅ complete |
| Cool | `--ice`(+`-soft`), `--violet` | ⚠️ thin |
| Status | `--success`/`--warning`/`--danger` (+`-soft`; `--danger-fg`) | ⚠️ uneven |
| Data-viz | `--viz-cat-1..12`, `--viz-seq-*`, `--viz-div-*`, `--viz-grid/axis/tooltip` | ✅ (docs misplaced) |

## 2. How leading systems model color (the one lesson)

| System | Per-role set |
|---|---|
| **Radix** | 12-step scale, fixed semantic steps (bg → border → solid → text), accessible pairs by construction |
| **Primer (GitHub)** | `-fg / -emphasis / -muted / -subtle` per functional role |
| **Atlassian** | `bold / subtle / subtlest` + text + border per role |
| **Material 3** | every fill has an `on-` pair; explicit roles |
| **shadcn/Tailwind** | role tokens + `chart-1..5`; numeric ramps underneath |

**The shared rule:** every semantic role exposes the *same named set* — a tint background, a
hairline border, a solid, in-hue text, and an on-solid ink — and there is always an `info`.

## 3. The role contract (proposed)

Every functional role — **neutral, ember (brand), info, success, warning, danger** — implements
this **7-token contract**:

| Suffix | Role | Typical use |
|---|---|---|
| `--{r}` | solid | badge/dot fill, icon, chart series |
| `--{r}-strong` | deeper solid | hover / pressed / emphasis |
| `--{r}-soft` | ~14% tint bg *(exists)* | alert / badge soft fill |
| `--{r}-subtle` | ~7% tint bg **(new)** | banner background, table row tint |
| `--{r}-border` | ~30% hairline **(new)** | border on soft surfaces |
| `--{r}-text` | in-hue text on the page **(new)** | inline status text, links |
| `--{r}-fg` | ink **on** the solid *(ember/danger exist)* | label on a solid fill |

Rules that stay: **ember is the only brand accent** (≤2×/screen); info/success/warning/danger
are *functional*, never decorative. **Neutral** maps to the existing surface/border/fg tiers
(no new tokens) — it's documented as the seventh role for completeness.

## 4. Concrete values (dark mode; light mirrors — see note)

`info` is the headline addition (sky family; `--ice` becomes an alias of `--info-text`).
Values are starting points; each pair is AA-verified against its bg at implementation.

| role | `--{r}` | `-strong` | `-soft` | `-subtle` | `-border` | `-text` | `-fg` (on solid) |
|---|---|---|---|---|---|---|---|
| **ember** | `#FF6B35` | `#E04E1A` | `rgb(255 107 53 / .14)` | `/.07` | `/.30` | `#FF8C42` | `#0A0907` |
| **info** | `#38BDF8` | `#0EA5E9` | `rgb(56 189 248 / .14)` | `/.07` | `/.30` | `#7DD3FC` | `#06141C` |
| **success** | `#34D399` | `#10B981` | `rgb(52 211 153 / .14)` | `/.07` | `/.30` | `#6EE7B7` | `#05140E` |
| **warning** | `#FBBF24` | `#F59E0B` | `rgb(251 191 36 / .14)` | `/.07` | `/.30` | `#FCD34D` | `#1A1206` |
| **danger** | `#F87171` | `#EF4444` | `rgb(248 113 113 / .14)` | `/.07` | `/.30` | `#FCA5A5` | `#1A0808` |

**Already present** (no change): `--ember`, `--ember-deep`(→`-strong` alias), `--ember-soft`,
`--ember-softer`(→`-subtle` alias), `--ember-fg`, `--success/-soft`, `--warning/-soft`,
`--danger/-soft/-fg`, `--ice`(→`--info-text`). **New cells** are the rest of the matrix.

**Light mode** mirrors the logic with **deeper solids** (legible on white — e.g. ember `#E85A28`,
success `#059669`, warning `#D97706`, danger `#DC2626`, info `#0284C7`), **soft/subtle** built
from the *deeper* hue, `-text` a deep readable tint, and **`-fg` = `#FFFFFF`** on every solid
except warning (keeps dark ink). Same alpha steps (.14 / .07 / .30).

A **contrast-pairs** table joins the Color page: which `-text`/`-fg` clears AA on which surface,
Radix-style, so authors never guess.

## 5. Relocation — what leaves Core (#3)

- **Data-viz colours** (the "12 hues · charts only" section) → **Charts DS**, new
  `/charts/colors` page (categorical + sequential + diverging + axis/grid/tooltip). The
  `--viz-*` *tokens* stay global; only the **docs** move.
- **IDP semantic palettes** (Severity P0–P3, Run status, Service health, Risk) → **IDP DS**,
  new `/idp/status` page. They're domain meaning rendered through the core **Badge/Pill** — Core
  shouldn't re-document them. Core keeps the *generic* success/warning/danger trio as the base.
- **Core `/color` keeps**: surfaces, elevation, foreground, ember, on-primary, cool accents
  (now framed as `info`), the role contract, borders, accessibility & pairings, anatomy, do/don't.

## 6. Migration plan (atomic, build-green per step)

1. **Tokens** — add the new cells in §4 to `tokens.css` (dark + light); alias
   `--ember-deep→--ember-strong`, `--ember-softer→--ember-subtle`, `--ice→--info-text`.
   *Non-breaking.* Verify both themes by headless screenshot of `/color`.
2. **Color page** — add an `info` block + the contrast-pairs table; reframe "cool accents".
3. **Relocate** — create `/charts/colors` + `/idp/status` (move the two sections verbatim),
   update `nav-config.js` + in-page links, regen, build.
4. **Adopt (incremental, optional)** — refactor Alert / Badge / Banner / StatusDot / Pill to
   read `--{r}-soft/-border/-text/-fg` instead of ad-hoc colour math. This is the real
   maintainability payoff; not required for the token addition.

## 7. Recommendation

Approve §3 (contract) + §4 (values) + §5 (relocation). The single highest-leverage change is
the **consistent status set + `info`** — it deletes per-component colour math and makes every
status surface predictable. Steps 1–3 are low-risk and verifiable; step 4 is opportunistic.

**Risks:** keep the change additive (don't repurpose `-fg`); never let `info`/status read as
brand (ember stays the only accent); verify every new pair for AA in both themes before shipping.
