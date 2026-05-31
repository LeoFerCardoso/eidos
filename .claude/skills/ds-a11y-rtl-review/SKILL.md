---
name: ds-a11y-rtl-review
description: |
  Review a Forge DS artifact for accessibility (focus visibility, labels, keyboard
  reachability, contrast, ARIA) AND RTL correctness (logical CSS properties, directional
  icon mirroring, bidi text). Use when the request is "a11y review", "accessibility
  audit", "check RTL", "is this keyboard accessible", or as a gate before shipping a page/
  screen. Bridges the craft accessibility-baseline + rtl-and-bidi rulebooks. Read-only
  review by default; apply fixes only if asked.
argument-hint: "[target]"
allowed-tools: [Read, Grep, Edit, Bash]
---

# ds-a11y-rtl-review — accessibility + RTL gate for a DS artifact

## 1. Locate the target

Resolve `$ARGUMENTS` to a file: pages `src/ds/migrated/<ds>/<slug>.tsx` (core pages
`src/ds/migrated/<slug>.tsx`), examples `src/ds/examples/<name>.tsx`. Read it fully.
Confirm its route in `src/ds/core/nav-config.js`.

## 2. Pre-read the rulebooks

- `.claude/craft/accessibility-baseline.md` — the a11y contract.
- `.claude/craft/rtl-and-bidi.md` — logical-property + mirroring rules.
- `.claude/design-systems/forge/DESIGN.md` — Forge already mandates logical properties
  and visible focus; treat deviations as regressions.

## 3. Accessibility checklist

- **Focus** — every interactive element has a visible focus state; no `outline:none`
  without a replacement ring. Watch the doubled-focus-ring gotcha (only `.in-group`
  paints; inner inputs `box-shadow:none`).
- **Labels** — inputs have associated labels; icon-only buttons have `aria-label`;
  images have alt/`aria-hidden` as appropriate.
- **Keyboard** — all actions reachable and operable by keyboard; logical tab order;
  menus/dialogs/comboboxes trap and restore focus; ⌘K palette reachable.
- **ARIA & semantics** — correct roles, `aria-busy` on loading, `aria-invalid` +
  `aria-describedby` on invalid fields; no redundant/contradictory ARIA.
- **Contrast** — text and UI meet the baseline against `bg`/`surface` in both dark and
  light themes; ember used for meaning, not as low-contrast text.
- **Multi-fire onChange** — flag any `<label htmlFor>` that also wraps its input.

## 4. RTL checklist

- **Logical properties only** — `margin-inline`, `padding-inline`, `inset-inline-start/
  end`, `text-align: start/end`, `border-inline-*`. Flag any physical `left/right`,
  `margin-left`, `padding-right`, `text-align:left`, etc.
- **Directional icons mirror** — chevrons, arrows, back/forward, send, indent icons flip
  under `dir="rtl"`; non-directional icons (search, settings) do not.
- **Bidi text** — numerals, code, and LTR tokens stay correct inside RTL flow; use
  isolation where needed.
- **Verify** — mentally (or by adding a temporary `dir="rtl"` wrapper) confirm the layout
  holds. Component doc pages should include an RTL example.

## 5. Report

Output a prioritized findings list (P0 must-fix → P2 nice) with the exact file + the
offending pattern. Apply fixes only if the user asked; otherwise leave edits to `refine`.
If you edited and touched nav, run `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs`
(+ `gen-examples.mjs`) and restart `next dev`, then offer `npm run verify`.
