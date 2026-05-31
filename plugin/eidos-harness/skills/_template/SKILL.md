---
disable-model-invocation: true
name: skill-template
description: Template for authoring a new Eidos harness skill. Invoke with /skill-template when creating a new ${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md. Quiet (not auto-triggered).
allowed-tools: [Read, Write, Edit]
---

# <Name> Skill

> Copy this file to `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md` and replace everything. Keep skills
> Eidos-native: they build **in the repo**, never emit standalone `<artifact>` HTML.

Frontmatter you keep: `name`, a rich `description` (when to use + what it produces + when
NOT to — this is what makes it auto-trigger), optional `argument-hint` and
`allowed-tools`. Add `disable-model-invocation: true` only for quiet, /invoke-only skills.

One sentence saying what the skill produces and the golden rule (e.g. "compose existing
Eidos classes, never write per-page CSS").

## Required pre-reading
1. `${CLAUDE_PLUGIN_ROOT}/design-systems/forge/DESIGN.md` — the brand (ember budget, Geist, density).
2. `FORGE-DS-REFERENCE.md` + `llms.txt` — catalog; don't reinvent an existing class/component.
3. The `${CLAUDE_PLUGIN_ROOT}/craft/*` sections this artifact needs (typography, color, anti-ai-slop, …).

## Workflow
1. **Plan** — state the composition in one sentence before building.
2. **Build in the repo** — for a DS page/screen: edit `src/ds/core/nav-config.js`, add
   `src/ds/pages/<group>/<slug>.jsx` (registers `window.PAGES`) or
   `src/ds/examples/<name>.jsx` (registers `window.EXAMPLES`), then `npm run gen:manifest`.
   Compose classes from `src/styles/ds.css`; never per-page `<style>`.
3. **Self-check** — `npm run verify` + the anti-ai-slop P0 checklist.

## Hard rules (the Eidos invariants every skill enforces)
- Single ember accent `var(--accent)` ≤2×/screen; Geist Sans (UI) + Geist Mono (numerics).
- Compose existing classes; logical CSS properties + RTL parity; no invented metrics/lorem.
- Don't hand-edit `src/ds/runtime/manifest.generated.ts` (generated; hook-blocked).
