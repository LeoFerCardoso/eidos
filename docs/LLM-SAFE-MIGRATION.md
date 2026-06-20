# Migrating the portal to the LLM-safe typed vocabulary

The LLM-safe layer (`<Box>`/`<Stack>`/`<Inline>`/`<Grid>` + `eslint-plugin-eidos`) is in
place. Converting the existing `/portal` is a **ratchet**, not a one-shot codemod: coverage
grows file-by-file, each conversion is visually verified, and once a path is enforced it can
never regress. This is the procedure.

## Why not a blind codemod

`node scripts/portal-migration-report.mjs` reports the surface: ~3160 raw elements and ~1070
inline styles across 72 files. **93% of inline styles are on the token grid** (mechanical),
but two things make blind conversion unsafe:

1. **Off-grid spacing (~7%).** `gap: 14`, `gap: 10` have no token. Converting them forces a
   normalization decision (snap to 12 or 16) — a design call, per screen.
2. **`.fp-*` classes encode design.** A raw `<div className="fp-card">` is the `<Card>`
   component; `<div className="fp-meta">` is a styled cluster. `<Box>` carries no
   `className`, so converting means choosing the right DS component (or reproducing the
   layout with token props) and **verifying the pixels are unchanged**.

So conversion is human-driven, tool-assisted, and gated by screenshots — the DoD bar.

## Per-screen procedure

1. **Pick the worst-first file** from `reports/portal-migration-worklist.md` (regenerate with
   `node scripts/portal-migration-report.mjs --md`). The `map`/`dec` columns tell you how
   many inline styles are mechanical vs need a decision.
2. **Convert markup:**
   - Pure layout `<div style={{display:'flex',…}}>` (no `.fp-*`) → `<Inline>`/`<Stack>`/`<Box>`
     with token props. Use the spacing map below so pixels are identical.
   - `<div className="fp-card|fp-section|fp-meta|…">` → the matching DS component
     (`Card`, `Section`, …) or `<Box>` with the equivalent token props. Never drop the design.
   - Semantic elements (`<nav>`, `<ul>`, `<li>`, `<header>`) → `<Box as="nav">`, etc.
3. **Resolve off-grid spacing** (`dec` styles): snap to the nearest token and confirm visually.
4. **Verify** (DoD): the screen typechecks, `npm run lint:llm-safe` is clean, and a Playwright
   screenshot matches the pre-migration baseline (no visual diff beyond intended normalization).
5. **Ratchet:** add the converted path to `MIGRATED` in `eslint.config.mjs`. From now on any
   raw `<div>`/inline `style`/hardcoded color in that path fails CI. **Never remove a path.**

## Spacing map (token → px, the `--space` grid)

| token | `0` | `px` | `1` | `2` | `3` | `4` | `5` | `6` | `8` | `10` | `12` | `16` | `24` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| px | 0 | 1 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 96 |

`padding: 16` → `p="4"`; `gap: 8` → `gap="2"`; `gap: 24` → `gap="6"`. Spacing props are
logical (RTL-first): `px`/`py` are the inline/block axes, `ps`/`pe` inline start/end.

## Common patterns

```tsx
// before
<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>…</div>
// after
<Stack gap="4">…</Stack>

// before
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>…</div>
// after
<Inline justify="between">…</Inline>

// before
<nav className="row" style={{ gap: 8, padding: 12 }}>…</nav>
// after
<Box as="nav" display="flex" gap="2" p="3">…</Box>
```

A reference fragment built entirely from the vocabulary lives at
`src/portal/_system-demo/demo.tsx` (the first enforced path).
