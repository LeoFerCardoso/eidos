# DS documentation — text hierarchy & layout decomposition (Gap Analysis)

**Date:** 2026-05-21 · **Scope:** every page across core + the 6 sub-DSs (≈149 pages).

> **Status (2026-05-21): Step A + Step C SHIPPED.** `SubHead` now renders a semantic `<h2>`
> at **22px** (was a 13px `<div>`) with a hover anchor + id — fixing all **1244** section
> headings across **149 pages** in one change; `.ds-h1` unified to the page-header H1 size
> (40px). A generated **"On this page"** rail (`components/layout/toc.tsx`) reads those `<h2>`s
> with scroll-spy. Build green (175 routes), 0 render errors. **Steps B & D** (rename to
> `PageHeader`/`Section`/`Subsection`; reconcile ad-hoc headings) remain as follow-up polish.
> Known minor: sub-DS pages still pass the old global `id` to `Section`, so the in-page eyebrow
> falls back to "FORGE" (breadcrumb is correct) — fix when adopting the renamed API (Step B).

## TL;DR

The doc layer is **already shared** — `Section` is used by **144 pages**, `SubHead` by **143
pages (1244 section headings)**. So the goal *“change in one place and it reflects
everywhere”* is already achievable; the gap is the **hierarchy itself**, not the wiring:

- The page title (**40px H1**) drops straight to a **13px section “heading”** — there is **no
  intermediate H2 level**. A section title is barely larger than body text (13.5px), so pages
  read as a flat wall.
- That section heading (`SubHead` → `.ds-sub`) is a **`<div>`, not a `<h2>`** — the document
  outline is just `H1 + divs`, which kills the “on this page” TOC, scannability, and
  screen-reader navigation.
- There are **two competing H1 systems** (`.ds-ph-title` 40px in 144 pages; `.ds-h1` 44px in 5
  intro pages) and **~50 ad-hoc `<h2>`/`<h3>`** in page bodies that bypass the system.
- A token scale already exists (`.t-h1/.t-h2/.t-h3` = 3xl/2xl/xl) but the doc components don’t
  use it.

**Recommendation:** upgrade the shared `SubHead`/`.ds-sub` into a real semantic `<h2>` section
heading and unify the two H1s — a **non-breaking change that fixes all 1244 section headings +
149 pages without editing a single page body**, then add an outline TOC. Decompose and rename
the doc components so the hierarchy is explicit for future refactors.

---

## 1. Current state (measured)

| Role | Component | Element | Class | Size | Notes |
|---|---|---|---|---|---|
| Page title | `Section` | `<h1>` | `.ds-ph-title` | **40px** / 600 | 144 pages; eyebrow + lede |
| Page title (intros) | — (raw) | `<h1>` | `.ds-h1` | **44px** / 600 | 5 pages → 2nd H1 system |
| Section heading | `SubHead` | **`<div>`** | `.ds-sub` | **13px** / 600 | **1244 uses**; not semantic |
| Sub-section | — (ad-hoc) | `<h3>` | (inline) | varies | 28 raw `<h3>`, 22 raw `<h2>` |
| Body / caption | `.ds-caption` / `<p>` | `<p>` | — | 13.5px | fine |

The visual jump is **40px → 13px** with nothing between. `Section` is misnamed — it actually
wraps the **whole page** (renders the page header), while `SubHead` is what actually heads each
**section**.

## 2. Problems & impact

1. **Readability** — sections don’t register as sections; the eye finds no rhythm.
2. **Navigability / a11y** — headings aren’t semantic (`<div>`), so there’s no usable outline,
   no right-rail TOC, and poor screen-reader landmarking.
3. **Consistency** — two H1 systems, ad-hoc `<h2>/<h3>`, 10 raw `.ds-sub` uses.
4. **Maintainability** — the lever (shared components) exists, but the hierarchy is hardcoded
   thin and the naming is inverted, so the structure isn’t obvious to refactor against.

## 3. Target — one documented heading scale

Map every level to a **semantic element + a token size + a component**:

| Level | Role | Component | Element | Size (token) | Weight |
|---|---|---|---|---|---|
| **H1** | Page title | `PageHeader` | `<h1>` | `--text-display`/3xl (~36–40px) | 600 |
| **H2** | Section | `Section` *(new sense)* | `<h2>` | `--text-2xl`/xl (**~22–24px**) | 600 |
| **H3** | Sub-section | `Subsection` | `<h3>` | `--text-md`/lg (~16–17px) | 600 |
| — | Eyebrow / meta | slot | `<span>` | 11px mono | 500 |
| — | Body / caption | `Prose` / `.ds-caption` | `<p>` | 13.5px | 400 |

The single most important addition is the **H2 section heading** (~22–24px, semantic, with the
optional mono meta + a hairline rule). It closes the 40→13 gap.

## 4. Decomposition — clearer layouts/components

Rename to reflect what each piece *is* (today’s names are inverted):

- **`PageHeader`** — eyebrow + `<h1>` + lede (+ optional install block). Extracted from today’s
  `Section`; **unifies** `.ds-ph-title` and `.ds-h1` into one page-H1.
- **`DocPage`** *(or keep `Section` as the page wrapper)* — `<section.ds-section>` + `PageHeader`.
- **`Section`** *(new meaning)* — an in-page `<section>` with an `<h2>` heading + meta + content.
  This is the upgraded `SubHead`.
- **`Subsection`** — `<h3>` heading for the next level (absorbs the ~50 ad-hoc headings).
- **Content primitives unchanged**: `Frame`, `PropsTable`, `CodeBlock`/`TabbedCode`, `SpecRow`,
  `TokenSwatch`, `Prose`.

All driven by tokens + classes → one edit propagates to every page in all 7 DSs.

## 5. Migration strategy (low-risk; leverages the shared layer)

- **Step A — non-breaking restyle (the big win, zero page edits).** Make `SubHead`/`.ds-sub`
  render a semantic `<h2>` at the new H2 size (with anchor + rule), and unify `.ds-h1` +
  `.ds-ph-title`. Fixes 1244 section headings + 149 pages instantly. Verify parity by
  screenshot across a sample per DS.
- **Step B — clarity (incremental).** Introduce `PageHeader` / `Section`(H2) / `Subsection` as
  the canonical API; keep `SubHead` as a thin alias so existing pages keep working; new/edited
  pages adopt the clear names. Fold the 5 intro pages off `.ds-h1` onto `PageHeader`.
- **Step C — outline & TOC.** Now that headings are semantic, add the right-rail “On this page”
  TOC (the `.ds-toc` class already exists) generated from the H2/H3s; give each H2 an anchor.
- **Step D — reconcile ad-hoc headings.** Convert raw `<h2>/<h3>` to `Section`/`Subsection`,
  **except** prose/markdown demos (e.g. `.ai-prose`) which must keep their own scale — so the
  new heading CSS is **scoped to the doc components, not global `h2/h3`**.

## 6. Risks

- **Vertical rhythm** — bigger H2s change spacing; tune `.ds-sub` margins so pages don’t feel
  cramped or loose.
- **Scope creep into prose** — do not restyle global `h2/h3`; markdown/`ai-prose` demos have
  their own scale.
- **Parity mandate** — this is a deliberate, approved visual change to the hierarchy, but every
  other aspect (classes, components, layout) must stay identical; verify with screenshots.

## 7. Recommendation

Do **Step A now** (highest leverage, non-breaking) **+ Step C** (TOC) for immediate readability
and navigability wins; treat **B/D** as follow-up polish. This is the cleanest expression of
*“change in one place → reflects everywhere.”*
