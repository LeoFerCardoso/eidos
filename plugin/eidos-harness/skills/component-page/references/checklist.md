# Component page — self-review

## P0 — blocks delivery
- [ ] The 2 coordinated changes exist: entry in `src/ds/core/nav-config.js` + the
      `src/ds/pages/<group>/<slug>.jsx` module; `npm run gen:manifest` was run.
- [ ] The `.jsx` registers `window.PAGES['<slug>']` (without it the page does not mount).
- [ ] `manifest.generated.ts` was NOT hand-edited (it's generated from nav-config).
- [ ] Zero per-page `<style>`. Only existing classes or an extension of `tokens.css`/`ds.css`.
- [ ] Page includes: Frame with live demo, Anatomy, Decision matrix, Do/Don't (with live UI), RTL example.
- [ ] Ember accent appears at most 2× in the rendered screen.
- [ ] No non-existent `Icons.x` (causes a black screen).
- [ ] Anti-AI-slop P0 (see `${CLAUDE_PLUGIN_ROOT}/craft/anti-ai-slop.md`): no Tailwind indigo, no trust gradient, no emoji-icon, no invented metric, no lorem ipsum.

## P1 — must pass
- [ ] Logical properties everywhere; directional icons mirror in `[dir="rtl"]`.
- [ ] Spacing rhythm: caption after Frame `marginTop:14`; lede after SubHead `marginTop:-6`; consecutive Frames `18px`.
- [ ] No duplicated focus ring (inner inputs with `box-shadow:none !important`).
- [ ] Dropdowns/popovers not clipped by the `.ds-frame`'s `overflow:hidden`.
- [ ] `npm run build` compiles and `npm run verify -- /<slug>` mounts the route.

## P2 — polish
- [ ] Decision matrix actually helps you choose (it's not a generic table).
- [ ] Do/Don't show the real mistake someone would make, not a strawman.
- [ ] Caption explains the *why* of the variant, not just the *what*.
