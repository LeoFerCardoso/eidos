# Forge DS — saved workflows

Reusable multi-agent workflows for the design system. Invoke from any session with the
**Workflow** tool by name, passing `args`.

## `restructure-component`

Restructure (or build) **one** component across all three surfaces, consistently:

1. **Docs page** → the canonical section anatomy (`docs/DS-PAGE-STANDARD.md`):
   Header → Installation → Usage → Variants/Sizes/States → In context → Accessibility → RTL →
   Anatomy → Do/Don't → API reference.
2. **Storybook story** → CSF3 in the atomic-clean taxonomy (Primitives · Forms · Atoms · Blocks ·
   Charts · Overlays · Device · AI · Icons · Docs), Default + every variant/state + InContext + autodocs.
3. **Install / registry** → the component is a curated `FAMILIES` entry, its registry item has the right
   `registryDependencies` + npm deps, and any page-local CSS is promoted to the shared `tokens.css` so
   `forge-ui add <name>` ships it styled.

### Flow
`Resolve & audit` (read-only; emits one shared inventory) → `Restructure` (3 parallel rebuilds fed the
same audit) → `Build & verify` (gen-props · ui:typecheck · registry:build · cli:test(+full) · sb:build ·
docs build · render check · screenshot — auto-fixes failures) → `Critique` (adversarial review vs the
standard + anti-ai-slop + Forge invariants).

### Invoke
```js
// Preview the gap report only — NO files changed:
Workflow({ name: 'restructure-component', args: { component: 'badge', dryRun: true } })

// Full restructure of one component:
Workflow({ name: 'restructure-component', args: 'badge' })

// Or with options:
Workflow({ name: 'restructure-component', args: {
  component: 'MetricCard',
  dryRun:      false,   // audit-only when true
  skipDocs:    false,   // skip the docs-page rebuild
  skipStory:   false,   // skip the Storybook rebuild
  skipInstall: false,   // skip the registry/install fix
} })
```

`args` accepts a bare string (the component name/slug) or an object. The audit resolves the rest
(family, file paths, story title, registry name, real props) from disk, so you only supply the name.

### Notes
- Start with `dryRun: true` to read the gap report, then run for real.
- It edits the live repo (doc page, story file, `extract-registry.mjs`, sometimes `tokens.css`/barrel).
  Run on a clean working tree so the diff is reviewable.
- The verify phase is the safety net: it won't report green unless typecheck + registry + Storybook +
  docs build all pass and `forge-ui add` installs a tree that compiles.
