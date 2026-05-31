---
name: tweaks
description: |
  Targeted polish of an existing Forge component, page, or example in the repo —
  the "dial in the last 20%" pass. Edit the real files (tsx + tokens/ds.css),
  tighten type/spacing/accent/states, then re-run the anti-ai-slop, a11y, and
  RTL checks. Use when the request is "tweak this", "polish X", "tighten the
  spacing", "fix the accent usage", "clean this up", or "make this feel less
  AI-generated". Edits in place — produces no new artifact.
allowed-tools: Read, Edit, Bash, Grep, Glob
argument-hint: "[component/page/example to polish]"
---

# Tweaks Skill · Targeted Forge Polish

Take something that already exists in the repo and make it noticeably better
with small, surgical edits. You change the real source files; you do not rebuild
the artifact or wrap it in anything. The win is precision: a few right edits,
then re-verify the craft checks.

## Required pre-reading

1. The target file(s): `src/ds/migrated/<ds>/<slug>.tsx` (core pages:
   `src/ds/migrated/<slug>.tsx`), `src/ds/examples/<name>.tsx`, and the classes it uses in
   `src/styles/ds.css` / `src/styles/tokens.css`.
2. `../../design-systems/forge/DESIGN.md` — the standard you're polishing toward.
3. `../../craft/anti-ai-slop.md` (P0 list), plus whichever of
   `{typography,color,state-coverage,accessibility-baseline,rtl-and-bidi,animation-discipline,form-validation}.md`
   the change touches.
4. `../../FORGE-DS-REFERENCE.md` — to confirm a better-fitting existing class
   exists before adding CSS.

## When to use vs. not

- **Use** when an artifact is ~80% right and needs the last 20%: accent
  overuse, weak hierarchy, slack spacing, a missing state, an RTL leak.
- **Don't use** to build something new (use `dashboard` / `idp-screen` /
  `component-page` / `new-page`) or to author a brand-new component (use
  `new-component`). For a structured before/after assessment, run `critique`
  first, then `tweaks` to execute its Fix/Quick-win list.

## The polish passes (apply only what the artifact needs)

1. **Accent discipline** — count visible uses of `var(--accent)` / `#FF6B35`.
   If > 2 per screen, demote the weakest to a neutral token. Ember is a scalpel,
   not a highlighter.
2. **Type roles** — Geist Sans for UI, Geist Mono for numerics / captions /
   eyebrows. Metrics get `font-variant-numeric: tabular-nums`. Fix mismatched
   roles and runaway sizes (see `craft/typography.md`).
3. **Spacing & rhythm** — replace one-off pixel values with spacing tokens;
   create intentional tight/breathing tension instead of flat symmetry.
4. **State coverage** — add any missing loading / empty / error / invalid state
   (`craft/state-coverage.md`). A populated-only screen is incomplete.
5. **A11y** — focus-visible rings, label/control association, contrast, hit
   targets (`craft/accessibility-baseline.md`).
6. **RTL** — convert physical properties to logical (`padding-inline-*`,
   `margin-inline-*`, `inset-inline-*`, `text-align: start`); the only physical
   exception is `transform: translateX`, which needs a `[dir="rtl"]` override.
7. **Motion** — respect `prefers-reduced-motion`; keep transitions calm
   (`craft/animation-discipline.md`).

## Workflow

1. Identify the target file(s) and read them plus the classes they use.
2. List the specific edits you intend (2–6 surgical changes), each tied to a
   DESIGN.md / craft rule.
3. Make the edits **in place** with Edit. Prefer composing an existing class or
   adjusting a token over adding new CSS. If new CSS is unavoidable, extend
   `ds.css`/`tokens.css`, never inline per-page `<style>`.
4. Re-verify: walk the anti-ai-slop P0 list, the a11y baseline, and the RTL
   check against your changes.
5. If the page is registered, no regen is needed unless you renamed the slug; if
   you did, update `src/ds/core/nav-config.js` and run `node scripts/gen-nav.mjs &&
   node scripts/gen-migrated.mjs` (+ `gen-examples.mjs` for examples), then restart
   `next dev`.

## Hard rules

- **Edit the real files in the repo.** No wrapper, no copy, no new artifact.
- **Zero per-page `<style>`** — compose existing classes / tokens.
- **Ember accent ≤ 2× per screen** after the pass.
- **Geist Sans UI / Geist Mono numerics. Logical CSS + RTL check.**
- **Don't gold-plate** — make the edits the artifact needs and stop. A tweak
  that breaks the layout is a regression; revert it rather than ship it.
