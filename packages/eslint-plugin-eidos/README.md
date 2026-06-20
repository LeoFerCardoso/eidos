# eslint-plugin-eidos

The enforcement half of the Eidos **LLM-safe design system**. The typed `<Box>` vocabulary
in `@eidos/ui` makes off-system *values* un-typeable; these rules make off-system *markup*
fail the lint/pre-commit gate. Together they turn the design system into a strongly-typed
language: the only expressible UI is correct UI.

## Rules

| Rule | What it bans | Why |
| --- | --- | --- |
| `no-raw-layout-elements` | bare `<div>`, `<section>`, `<nav>`, `<span>`, `<ul>`, `<li>`, … | Force layout through `<Box>`/`<Stack>`/`<Inline>`/`<Grid>`; semantics via `as`. |
| `no-inline-style` | the `style={{…}}` prop | Spacing/color/layout must be typed token props. |
| `no-hardcoded-color` | `#hex`, `rgb()`, `hsl()`, `oklch()` literals | Color must come from a token / `var(--token)`. |

`no-raw-layout-elements` accepts `{ elements: [...] }` (override the banned list) and
`{ allow: [...] }` (keep an escape element during migration — use the **ratchet**: enable
rules per already-migrated directory via ESLint `overrides`, widen as you convert pages).

## Usage (flat config, ESLint 9+)

```js
// eslint.config.js
import eidos from 'eslint-plugin-eidos';

export default [
  { files: ['app/**/*.tsx', 'src/**/*.tsx'], ...eidos.configs['flat/llm-safe'] },
];
```

Requires `@typescript-eslint/parser` for `.tsx`. In Forge, lint-config changes are
**critical files** (escalate, never auto-merge) and `eslint-disable` is hard-blocked, so
these rules cannot be locally suppressed — exactly the contract we want.

## Test

```
npm test            # node --test, no ESLint install needed
```
