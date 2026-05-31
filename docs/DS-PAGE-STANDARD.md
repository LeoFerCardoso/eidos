# Eidos DS — page section standard (proposal)

**Date:** 2026-05-21 · **Goal:** one predictable section anatomy for every page across core +
the 6 sub-DSs, so the DS reads as complete, detailed, and professional. **Status:** awaiting
approval — nothing implemented yet.

## 1. Audit — what's used today

Section frequency across all migrated pages (the `SubHead` titles):

| Section | Count | Section | Count |
|---|---|---|---|
| Do / Don't | 118 | Variants | 27 |
| API reference | 99 | Sizes | 25 |
| Installation | 97 | States | 19 |
| Usage | 96 | In context | 13 |
| Anatomy | 74 | When to use / Decision | 15 |
| RTL | 51 | **Accessibility** | **4** |

**The gold standard already exists** — core Components (e.g. Buttons) run:
`Installation → Usage → [Variants · Sizes · With icon · States · …] → RTL → Anatomy → Do/Don't →
API reference`. The problems are at the edges:

1. **Accessibility is almost never its own section** (4×) — a11y is half-buried inside RTL.
2. **Charts** skip Anatomy/RTL; **Patterns** invent their own vocab (`Variables`, no
   Installation/Usage/API); **Foundations** are bespoke.
3. **Sub-DS pages are thin.** `mobile/list` has **1** section; `buttons` has **14**. Most
   Mobile / Charts / Pattern pages are under-built versus the core bar.
4. **Vocabulary drifts**: "API reference" vs "Variables" vs "Props"; "Usage" vs "Default".

## 2. The proposed standard

### 2.1 Every page opens the same way (already true — keep)
`PageHeader` = eyebrow (`GROUP — NN`) · **H1 title** · **lede**. Then sections, each a
semantic `<h2>` (`SubHead`) with a mono `meta` eyebrow. Close with the brand footer where it fits.

**Lede budget — the hard rule (2026-05-29).** The header lede (`desc`) is **≤ 2 lines / ≤ 220
characters**, and it now spans the **full content column** (`.ds-ph-lede` is `max-width: none`),
so 2 lines reach the end of the doc area. The lede says only **what it is + when to reach for
it**. Everything longer — the "honesty rule" on a chart, the recipe/ownership note on a card,
caveats — goes **below the separator**, as a `<Lede>` under the first `SubHead` (Usage /
Overview). **Never put markup in `desc`** (no `<code>`, no inline `<span style>`); a header is
plain text. (Enforced by `.claude/hooks/typography-scale.mjs`: a `desc` over ~220 chars or
containing `<` is flagged.)

### 2.2 Canonical **Component** template (Components, IDP Blocks & Elements, AI, Mobile, Charts)

Ordered; **R** = required, **r** = recommended, **o** = optional. Omit a section only when it
genuinely doesn't apply — never reorder.

| # | Section | `meta` | R/r/o | Notes |
|---|---|---|---|---|
| 1 | **Installation** | `package managers` | R | `ComponentInstall` / `TabbedCode`. Mobile & Patterns: the import/`className` instead. |
| 2 | **Usage** | `hello world` | R | Smallest real example + code (`Frame` w/ `code`). |
| 3 | **Variants** | `N variants` | r | One `SubHead` per axis (Variants, Sizes, States, With icon…). Keep each focused. |
| 4 | **In context** | `real surface` | r | The component inside a realistic composition. |
| 5 | **Accessibility** | `a11y` | **R** | Keyboard map, ARIA roles/attrs, contrast pairs, reduced-motion, **44px target (mobile)**. *New standard — promote out of RTL.* |
| 6 | **RTL** | `RTL · العربية` | **R** | A live `dir="rtl"` `Frame` (Arabic copy) + a `Lede` explaining what mirrors. Required on every component page — see §3.5. Mirror the gold ref (`buttons.tsx`). |
| 7 | **Anatomy** | `anatomy` | r | Labelled parts (the `dd`/anatomy block). |
| 8 | **Do / Don't** | `rules` | R | The `dd-grid` pair, each note names the failure mode + the fix. |
| 9 | **API reference** | `<Name>Props` | R | `PropsTable`. Patterns: rename to **CSS variables** (same slot). |

### 2.3 **Foundation** template (core Foundations + Mobile Foundations)

No Installation/Usage/API. Ordered:

| # | Section | `meta` | R/r/o |
|---|---|---|---|
| 1 | **Scale / Roles** (the artifact: type scale, surface scale, the grid…) | `N roles` etc. | R |
| 2 | **In practice** (the tokens applied to real UI) | `applied` | r |
| 3 | **Principles** (3–4 axis cards) | `rules` | R |
| 4 | **Accessibility & pairings** (contrast, motion) | `a11y` | **R** |
| 5 | **Do / Don't** | `rules` | r |
| 6 | **Tokens / Reference** (the `--tokens` table) | `reference` | R |

### 2.4 **Overview** template (per sub-DS) — already standardized
`DsOverview`: eyebrow · title · subtitle · lede · domain hero · **Principles** · **Start here**
tiles · footer. Keep as-is.

### 2.5 **Example screen** template
Full screens in the `DeviceFrame` / `ExampleLoader`; no rigid section grid — a `SubHead`
per screen + a closing caption is enough.

## 3. Vocabulary (canonical names & `meta`)

Always use the left column; retire the variants on the right.

| Canonical | `meta` | Retire |
|---|---|---|
| Installation | `package managers` | — |
| Usage | `hello world` | "Default", "Basic" (as the first demo) |
| Accessibility | `a11y` | a11y buried only in RTL |
| Do / Don't | `rules` | "Dos and Don'ts" |
| API reference | `<Name>Props` | "Props", "Reference" |
| CSS variables *(patterns only)* | `CSS tokens` | "Variables" |
| Anatomy | `anatomy` | — |

## 3.5 Typography — font sizes & prose (NEW — this is the rule)

Pages must **not** hand-roll font sizes. Eidos type is a **fixed 9-step scale**
(72·56·36·28·20·17·15·13·11) — the source of truth is **Foundations / Typography**
+ the `.t-*` utilities. **There is no 12.5, 13.5, 14 or 16.** Use the components /
classes / `--text-*` tokens below. Gold reference: `buttons.tsx`.

| Role | Class · token (px) | How to render it | Notes |
|---|---|---|---|
| Page H1 + eyebrow + page-lede | `t-h1` 36 / `t-mono-label` 11 / `t-body-lg` 17 | `<Section title desc>` | Don't build the header by hand; `Section` renders it (`.ds-ph-lede`=17). `desc` ≤3 lines. |
| Section heading | `t-h3` 20 | `<SubHead meta="…">` | One per section; the `meta` is the mono eyebrow. |
| **Section intro / explainer** | **`t-body` 15** (`--text-body`) | **`<Lede>`** (`up` after a SubHead) | Muted 64ch paragraph under a SubHead. `<Lede>`→`.ds-caption`=15. **Replaces every inline `const lede` / `<p style={…}>`.** |
| Default body paragraph / table cell | `t-body` 15 | `.t-body` / existing classes (`.tbl`, `.in-*`) | — |
| **Card / a11y / helper / caption body** | **`t-small` 13** (`--text-base`) | `className="t-small"` (muted, lh 1.5) | Feature/a11y `.surface` cards, frame captions, footer meta. **Never 13.5.** |
| Inline code reference | `t-small` 13, ember | **`<Mono>`** | Token names, props, classNames in prose. Replaces `<code style={mono}>`. |
| Numerics / eyebrows / column headers | `t-mono-label` 11 | `className="t-mono-label"` / `var(--font-mono)` | Geist Mono; ALL-CAPS eyebrows need `letter-spacing: 0.06em+`. |

Rules: **Geist Sans** for UI/body, **Geist Mono** for numerics/eyebrows/captions
(`craft/typography.md`). Body line-height 1.5–1.6; headings ≥32px get `-0.01em`/`-0.02em`
tracking. Never `font-family: system-ui` on a heading. **No literal `font-size` for prose —
if you reach for one, you want `<Lede>` / `<Mono>` / a `.t-*` class.** A `fontSize: 13.5 /
12.5 / 14.5 / 16` is hard-blocked by `.claude/hooks/typography-scale.mjs`; raw px is allowed
only inside a component/demo being rendered, never in page chrome.

## 3.6 RTL is required (not optional)

Every component page ships an **RTL** section (`<SubHead meta="RTL · العربية">`): a live
`dir="rtl"` `Frame` with Arabic copy proving logical properties hold, plus a `<Lede>` that
names what mirrors (leading/trailing flip) and what stays (static glyphs). Directional icons
(arrows, chevrons, share, back) get `transform: scaleX(-1)`; non-directional ones don't.
Mirror `buttons.tsx`'s RTL frame. This is the most-skipped section across existing pages — it
is now part of the completeness gate.

## 4. Per-DS application

| Sub-DS | Template | Notes |
|---|---|---|
| **Core / Components** | §2.2 | Already compliant — add **Accessibility** where missing. |
| **Charts** | §2.2 | Add **Accessibility** (color-blind-safe palette, non-colour encoding) + **Anatomy** (axes/legend/tooltip). Keep RTL optional. |
| **IDP** (Blocks/Elements) | §2.2 | Bring Elements pages up to the full template. |
| **AI** | §2.2 | Already close; ensure Accessibility (live-region, focus order) is its own section. |
| **Patterns** | §2.2 (lite) | Usage(`className`) → Variants → In context → Accessibility(reduced-motion) → Do/Don't → CSS variables. |
| **Mobile** | §2.2 | **Biggest lift** — most pages have 1 section. Flesh out: Usage(in `DeviceFrame`) → Variants/States → Accessibility(**44px**, VoiceOver) → Anatomy → Do/Don't → spec. |
| **Foundations** (core + mobile) | §2.3 | — |

## 5. Completeness checklist (every page must clear)

- [ ] PageHeader: eyebrow + H1 + lede (≤3 lines).
- [ ] **Installation** (or import/className) + **Usage** with runnable code.
- [ ] At least one demo axis (Variants/Sizes/States) where the component has surface area.
- [ ] **Accessibility** section present (keyboard/ARIA/contrast/motion; 44px on mobile).
- [ ] **Do / Don't** with paired, specific notes.
- [ ] **RTL** section present — live `dir="rtl"` Frame + `<Lede>` (§3.6). *Required.*
- [ ] **API reference** (`PropsTable`) or **CSS variables** for CSS-only artifacts.
- [ ] **Typography**: section intros use `<Lede>` and inline code uses `<Mono>` — **zero hand-rolled `font-size` for prose** (§3.5).
- [ ] Section order matches §2.2 / §2.3; canonical names from §3.
- [ ] anti-ai-slop checklist + headless render (dark + light).

## 6. Rollout (low-risk, incremental)

1. **Lock the template** — encode §2.2/§2.3 in `.claude/skills/component-page` + a `_template`
   so new pages start compliant.
2. **Add Accessibility everywhere** — one focused pass per DS (highest value: it's the biggest gap).
3. **Flesh out Mobile** — bring the 14 mobile component pages to the full template (Usage →
   Variants → Accessibility → Anatomy → Do/Don't → spec).
4. **Normalize vocab** — a scripted rename of `meta`/titles per §3.
5. Verify per page (render + checklist), build green per DS.

## 7. Recommendation

Approve §2 (templates) + §3 (vocabulary). Start with **(a) Accessibility as a required section
across all DSs** and **(b) fleshing out the Mobile pages** — those two close ~90% of the gap to
"complete and professional". I can roll it out DS-by-DS with screenshots and a green build at
each step.
