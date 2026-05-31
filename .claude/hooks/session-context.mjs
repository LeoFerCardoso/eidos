#!/usr/bin/env node
// SessionStart hook — injects the Eidos invariants + harness map + "read first"
// pointers so every session starts grounded without bloating CLAUDE.md. stdout
// (additionalContext) is added to the session context on every start.
import { readFileSync } from 'node:fs';

let version = 'v1.8.1';
try {
  // Single source of truth for the DS version badge (src/lib/site.ts).
  const site = readFileSync(new URL('../../src/lib/site.ts', import.meta.url), 'utf8');
  const m = site.match(/DS_VERSION\s*=\s*'([^']+)'/);
  if (m) version = m[1].startsWith('v') ? m[1] : `v${m[1]}`;
} catch {
  /* ignore */
}

const context = `Eidos harness session context (Design System ${version}):

CONTRAST IS NON-NEGOTIABLE (applies to EVERY component — never repeat the ForgeMark-on-ember mistake):
- Whenever you place a foreground (text, icon, glyph, brand mark, value) on a colored/elevated surface, you MUST set an explicitly contrasting color — never let the foreground inherit or keep a color equal or near-equal to its background.
- On an ember/accent fill (var(--accent) / #FF6B35), the foreground is DARK INK (#08090A or var(--bg)), NOT ember. On dark surfaces use a light fg; on light surfaces use a dark fg.
- This covers brand tiles, badges/pills on accent, buttons, chips, avatars, icon buttons, status dots, charts — anything layered on a non-default background. If unsure, verify the rendered result (a headless screenshot) before declaring done.

Eidos visual invariants:
- Single accent ember #FF6B35 (var(--accent)) at most 2x/screen; Geist Sans (UI/body) + Geist Mono (numerics/captions/eyebrows); compose existing classes, NEVER per-page <style> (extend src/styles/tokens.css + ds.css instead); logical CSS properties everywhere (RTL first-class); anti-AI-slop is a mandatory checklist (.claude/craft/anti-ai-slop.md).

Architecture (post window-bridge cut — SWC, no .babelrc, no window registry):
- Eidos is a FAMILY of design systems sharing one base. The registry is src/ds/core/design-systems.js (DESIGN_SYSTEMS): core (root: /, /color, /buttons), charts (/charts/*), ai (/ai/*), idp (/idp/*), patterns (/patterns/*), mobile (/mobile/*). The sidebar header is a DS switcher (DsSwitcher); the nav is scoped to the active DS (NAV_BY_DS[useActiveDs()]). Sub-DSs ONLY add domain components — tokens, primitives, and the ember accent always come from core.
- DS pages are idiomatic 'use client' TSX with a default export. Core pages: src/ds/migrated/<slug>.tsx (route /<slug>). Sub-DS pages: src/ds/migrated/<ds>/<slug>.tsx (route /<ds>/<slug>). Both import primitives from @/ds/core; rendered via DSPageLoader from the generated MIGRATED registry inside the persisted (ds) DocsShell. Examples: src/ds/examples/<name>.tsx (default export) via EXAMPLES_REG at /example/<name>.
- Routes come from src/ds/core/nav-config.js (build-time data; groups tagged by DS via ds:/GROUP_DS) → gen-nav.mjs → src/lib/nav.ts (typed DESIGN_SYSTEMS/NAV/NAV_BY_DS/NAV_FLAT, dsHref, navForPath→ds). gen-nav/gen-migrated/gen-examples (recursive) auto-run on dev/build. Adding a page = add it to the right DS section in nav-config.js + drop src/ds/migrated/<ds>/<slug>.tsx. Do NOT reference window.PAGES/window.EXAMPLES/window.Icons/window.MOCKS — import from @/ds/core. After editing nav-config/design-systems, RESTART next dev (generateStaticParams is read once at start; dynamicParams=false → new routes 404 until restart).

READ FIRST (links):
- Project rules: CLAUDE.md (root). DS catalog: FORGE-DS-REFERENCE.md + llms.txt. Authoring notes: docs/FORGE-DS-AUTHORING.md.
- Canonical brand: .claude/design-systems/forge/DESIGN.md. Craft rulebooks: .claude/craft/* (incl. anti-ai-slop.md).
- Memory (compiled project state/history/conventions): .claude/Memory/PROJECT-LOG.md + .claude/Memory/README.md.
- Roadmaps: docs/REACT-NEXTJS-GAP-ANALYSIS.md (app), docs/HARNESS-GAP-ANALYSIS.md (harness).
- Verify with: npm run build (157 routes, SWC) + npm run verify (headless render check).`;

console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context } }));
process.exit(0);
