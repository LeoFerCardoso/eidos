---
name: refine
description: |
  Artifact polish pass. Pick an already-built Forge DS component page or example
  screen, propose targeted visual + interaction improvements, apply them, then re-run
  the anti-ai-slop, accessibility, and RTL checks. Use when the request is "polish X",
  "refine this screen", "tighten the spacing/states", "make X feel less generic", or
  "improve the interactions on Y". Do NOT use to create a new page (use new-component /
  new-page).
argument-hint: "[target]"
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# refine — targeted polish of a built DS artifact

Bridges the harness `tweaks` (parametric exploration) and `critique` (5-dimension
review) skills into an apply-then-verify loop on an existing Forge artifact.

## 1. Locate the target

Resolve `$ARGUMENTS` to a slug/file. Pages: `src/ds/pages/<group>/<slug>.jsx`.
Examples: `src/ds/examples/<name>.jsx`. Confirm the route exists in
`src/ds/core/nav-config.js`. Read the file fully before changing anything.

## 2. Pre-read

- `${CLAUDE_PLUGIN_ROOT}/skills/critique/SKILL.md` — the 5-dimension review lens
  (Philosophy / Visual hierarchy / Detail / Functionality / Innovation).
- `${CLAUDE_PLUGIN_ROOT}/skills/tweaks/SKILL.md` — how to reason about parametric variants
  (accent, type scale, density, motion) before committing to one.
- `${CLAUDE_PLUGIN_ROOT}/design-systems/forge/DESIGN.md` — the bar the artifact must hit.
- `${CLAUDE_PLUGIN_ROOT}/craft/anti-ai-slop.md`, `accessibility-baseline.md`, `rtl-and-bidi.md`,
  `animation-discipline.md`.

## 3. Critique → propose

Run a quick critique pass and produce a short, prioritized list of **targeted** changes
(Keep / Fix / Quick-wins). Bias toward: hierarchy and spacing rhythm, state coverage
gaps (loading/empty/error), interaction affordances (focus, hover, keyboard), motion
discipline, and removing AI-slop tells. Get the user's nod on scope if it's broad.

## 4. Apply by composition

Edit the `.jsx` only. Reuse existing classes/tokens — **never** add per-page `<style>`,
never reinvent a class that exists. If a token genuinely must change, edit
`src/styles/tokens.css` / `ds.css` and call it out. Keep ember to ≤2 visible uses;
Geist Sans + Mono; logical CSS properties.

## 5. Re-verify (the whole point)

After applying, re-run all three gates and report results:
- **anti-ai-slop** — no indigo, no trust gradient, no emoji icons, no invented metrics,
  no filler copy, ember ≤2×.
- **accessibility** (`accessibility-baseline.md`) — focus visible, labels, keyboard
  reachability, contrast.
- **RTL** (`rtl-and-bidi.md`) — logical properties only, directional icons mirror.

Then run `node scripts/gen-manifest.mjs` if you touched nav, and offer `npm run verify`
(the `verify-routes` command) to confirm the route still renders.
