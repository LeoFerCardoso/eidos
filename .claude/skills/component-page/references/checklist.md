# Component page — self-review

## P0 — blocks delivery
- [ ] The 2 coordinated changes exist: entry in `src/ds/core/nav-config.js` + the
      `src/ds/migrated/<ds>/<slug>.tsx` module (default export, imports from `@/ds/core`);
      `gen-nav` + `gen-migrated` ran (auto on `dev`/`build`) and `next dev` was restarted.
- [ ] The module is auto-registered in `src/ds/migrated/registry.ts` (no `window.PAGES`, no `.jsx`).
- [ ] Zero per-page `<style>`. Only existing classes or an extension of `tokens.css`/`ds.css`.
- [ ] **Typography**: section intros use `<Lede>`, inline code uses `<Mono>`, header/headings via
      `<Section>`/`<SubHead>` — **no hand-rolled `font-size` for prose** (DS-PAGE-STANDARD §3.5).
- [ ] Page includes, in order: Installation → Usage → Variants/Sizes/States → Accessibility →
      **RTL** → visual Anatomy → Do/Don't (live UI) → API reference (`PropsTable`).
- [ ] **RTL section present** — a live `dir="rtl"` Frame with Arabic copy + a `<Lede>` (§3.6). *Required.*
- [ ] Each example is a `<Frame label code>` (preview + code).
- [ ] Ember accent appears at most 2× in the rendered screen; dark ink on every ember fill.
- [ ] No non-existent `Icons.x` (causes a black screen).
- [ ] Anti-AI-slop P0 (`.claude/craft/anti-ai-slop.md`): no Tailwind indigo, no trust gradient, no emoji-icon, no invented metric, no lorem ipsum.

## P1 — must pass
- [ ] Logical properties everywhere; directional icons mirror in RTL via `transform: scaleX(-1)`.
- [ ] Spacing rhythm comes from `<Lede>` (`up` after a SubHead) — don't reintroduce inline margins.
- [ ] No duplicated focus ring (inner inputs with `box-shadow:none !important`).
- [ ] Dropdowns/popovers not clipped by the `.ds-frame`'s `overflow:hidden`.
- [ ] `npm run verify` mounts the route with no page errors; bumped `DS_VERSION` in `src/lib/site.ts` + changelog.

## P2 — polish
- [ ] Variant guidance actually helps you choose (it's not a generic table).
- [ ] Do/Don't show the real mistake someone would make, not a strawman.
- [ ] The `<Lede>` explains the *why* of the variant, not just the *what*.
