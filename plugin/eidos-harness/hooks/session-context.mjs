#!/usr/bin/env node
// SessionStart hook — injects the Eidos invariants + harness map so every session
// starts grounded without bloating CLAUDE.md. stdout is added to the session context.
import { readFileSync } from 'node:fs';

let version = 'v1.7.13';
try {
  const shell = readFileSync(new URL('../../src/ds/core/shell.jsx', import.meta.url), 'utf8');
  const m = shell.match(/Design System\s+(v[\d.]+)/);
  if (m) version = m[1];
} catch {
  /* ignore */
}

const context = `Eidos harness session context (Design System ${version}):
- Eidos invariants: single accent ember #FF6B35 (var(--accent)) at most 2x/screen; Geist Sans (UI) + Geist Mono (numerics/captions/eyebrows); compose existing classes, never per-page <style>; logical CSS properties everywhere (RTL is first-class); anti-AI-slop is a mandatory checklist.
- DS routes come from src/ds/core/nav-config.js → run \`npm run gen:manifest\` after changing it. Pages register window.PAGES['<slug>']; examples register window.EXAMPLES['<name>'].
- Harness lives entirely in .claude/: Eidos-native skills in .claude/skills/, single canonical brand .claude/design-systems/forge/DESIGN.md, craft rulebooks .claude/craft/*, subagents .claude/agents/. Scope is DS / Harness / DevEx / IDP only. Catalog: EIDOS-DS-REFERENCE.md + llms.txt.
- Gap analysis / roadmap: docs/HARNESS-GAP-ANALYSIS.md.`;

console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context } }));
process.exit(0);
