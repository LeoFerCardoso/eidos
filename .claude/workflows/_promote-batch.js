export const meta = {
  name: 'promote-batch',
  description: 'Promote a batch of docs-only Forge DS patterns into real @eidos/ui components: per-component build in parallel (each writes ONLY its own new component file + story + docs-page rewrite, and RETURNS the shared-file snippets), then ONE serialized integrator applies all barrel/FAMILIES/CSS edits, then one full verify gate (auto-fix), then parallel adversarial critique. Pass args = { batchName, items: [{slug, displayName, suggestedExports, file, npmDeps, intraDeps, notes}] }.',
  whenToUse: 'Phases 2-5 of the Forge DS Storybook-completion program.',
  phases: [
    { title: 'Build components' },
    { title: 'Integrate' },
    { title: 'Verify' },
    { title: 'Critique' },
  ],
}

const REPO = '/Users/leocardoso/Projects/forge-ds'
const A = typeof args === 'string' ? JSON.parse(args) : (args || {})
const BATCH = A.batchName || 'batch'
const ITEMS = A.items || []
if (!ITEMS.length) throw new Error('promote-batch: pass args.items = [{slug, displayName, suggestedExports, file, npmDeps, intraDeps, notes}]')

const STANDARDS = `
You are a senior Forge DS engineer building a PRODUCTION component. Repo: ${REPO}.
Read these before writing (do not guess): docs/DS-PAGE-STANDARD.md; src/ds/migrated/buttons.tsx (gold doc page); packages/ui/src/badge.tsx + select.tsx + combobox.tsx (the canonical NEW-component style — mirror their structure); packages/ui/src/stories/blocks/Banner.stories.tsx + atoms/StatusDot.stories.tsx (CSF3 story template).

COMPONENT-LAYER CONTRACT (how a real @eidos/ui component is written):
- File header imports: \`import * as React from 'react';\` then \`import { cn } from './lib/utils';\` then \`import { Icons } from './icons';\` (Icons only if used). Cross-component use: \`import { Modal } from './modal';\` (a sibling in this same batch is fine — it resolves at build time).
- Framework-agnostic React over the SEMANTIC CSS layer. NO Tailwind utilities, NO Radix, NO next/* — pure React + CSS classes + cn(). Overlays render via React.createPortal to document.body; positioning is self-contained (position:fixed + getBoundingClientRect with a flip, like select.tsx/combobox.tsx already do) — do NOT introduce a new shared lib dependency.
- Typed props interface exported (e.g. ModalProps). Controlled + uncontrolled where sensible. Custom value components use \`value\` + \`onValueChange:(v)=>void\` (native wrappers keep native onChange). Compound components export their parts (e.g. Card, CardHeader, CardTitle, CardContent, CardFooter) from the same file.
- PRODUCTION QUALITY is the bar: full keyboard model, focus management (focus trap + restore for modals/dialogs; roving tabindex + type-ahead for menus; ESC + click-outside dismiss for overlays), correct ARIA roles/states, prefers-reduced-motion, and RTL via logical CSS props + directional-glyph mirroring.
- OVERLAY/FLOATING SPECIFICS (hard-won — do ALL of these or the critique gate fails):
  * role="dialog"/"alertdialog" overlays (Modal, AlertDialog, dialog-style Popover) MUST: trap Tab/Shift+Tab focus inside the panel (wrap last→first and first→last; guard that focus actually started inside before trapping), restore focus to the trigger on close, lock body scroll (document.body overflow) while open, AND isolate from assistive tech (set inert/aria-hidden on sibling roots while open). Partial parity is a fail — match the Modal reference exactly.
  * Anchored positioning (Popover/Tooltip/HoverCard/Menu): position:fixed from getBoundingClientRect is fine, but \`start\`/\`end\` placement MUST be DIRECTION-AWARE — read \`getComputedStyle(anchor).direction === 'rtl'\` (or closest('[dir]')) and swap start↔end before computing the physical left. Never hardcode start→left/end→right. Add an RTL story/Frame that actually exercises a non-center align so the mirroring is covered.
  * A non-modal Tooltip that claims WCAG 1.4.13 must be truly hoverable+dismissable: the bubble is pointer-events:auto with onMouseEnter cancelling the close timer and onMouseLeave rescheduling it, ESC dismisses, and it persists on hover. If you don't implement hoverable, do NOT claim it.
- DOCS-ACCURACY IS A GATE: the docs page must not assert behavior the component lacks (keyboard map, focus containment, RTL/logical anchoring, a11y SC claims). Implement the behavior (preferred) or delete the claim — code and docs must agree. NO emoji-as-icon (use Icons.*), no lorem/invented copy — BUT note the DS eyebrow convention: Installation's SubHead meta is "package managers" and Usage's is "hello world" (these are CORRECT across 60+ pages — keep them, do not flag as placeholder). header \`desc\` ≤ 220 chars, every font-size on the 9-step scale, ember accent ≤ 2× per rendered demo frame.
  * There is NO global prefers-reduced-motion guard in this codebase — every reduced-motion rule is component-scoped. If your component (or a class it composes like .btn) animates, ship a component-scoped \`@media (prefers-reduced-motion: reduce)\` block; never claim a "global guard."
  * Do NOT promise keyboard behavior that only works in one browser (e.g. arrow/PageUp/Home scrolling a focused generic div works in Firefox only). If the docs claim it, implement it in JS (a keydown handler adjusting scrollTop/scrollLeft); otherwise don't claim it.
  * If the component spreads \`{...rest}\` onto its root, its Props interface MUST extend the matching \`React.HTMLAttributes<...>\` (else rest is dead and consumers can't pass id/data-*/aria-*).
  * COMPOUND-API INTEGRITY: if you export sub-components (Panel/Handle/Item/Header…), the parent MUST actually consume them as children — never hardcode internal wrappers while ALSO accepting the subcomponents (that double-wraps and orphans standalone sub-parts). The documented composition must be the real render path. Pick one model and make code + docs + stories all use it.
  * ARIA IDs MUST RESOLVE: any aria-controls / aria-labelledby / aria-describedby / aria-activedescendant must point at an id that actually exists in the rendered output (share ids via context/props — don't useId() on one element and reference it from another that never receives it).
  * A panel rendered via createPortal is LAST in DOM order — Tab from the trigger will NOT reach it. If you portal a panel and the docs promise "Tab moves into the panel," you MUST move focus into it programmatically on open and trap/cycle Tab inside (and restore on close). Otherwise don't claim it. Likewise, only use role="menubar"/menu/menuitem + aria-haspopup="menu" if you implement true menu keyboard semantics; a nav strip of link panels should be a nav landmark with disclosure buttons (aria-expanded) + a region, not a menubar.

HARD INVARIANTS (acceptance criteria):
1. CONTRAST: any fg on a colored/elevated surface gets an explicit contrasting color, via a THEME-AWARE TOKEN (never a hardcoded hex — that breaks light/dark parity). Nuance by surface kind:
   • SOLID ember FILL (.btn.ember, a full var(--accent)/--ember background): foreground is the dark-ink token \`var(--ember-fg)\` (theme-aware: dark in dark mode, light in light mode) — NOT a literal #08090A.
   • ember-SOFT tint (--ember-soft, .pill.ember, .chip.ember): foreground is \`var(--ember-text)\` (the AA-safe on-tint token). NOT dark ink (invisible on the tint) and NOT plain \`var(--ember)\` (fails AA against its own tint).
   • dark surface → light fg; light surface → dark fg. When unsure, verify the rendered result.
2. Single ember accent, ≤2×/screen. Geist Sans (UI) + Geist Mono (numerics/eyebrows).
3. NO per-page <style>: ALL CSS the component needs lives in the shared stylesheet. You do NOT edit tokens.css/ds.css yourself — you RETURN the CSS block (de-indented, with a section comment) and the integrator appends it. Leave NO <style> in the docs page.
4. Logical CSS props only (margin-inline-*, inset-inline-*, etc.). Directional glyphs mirror under [dir=rtl]; non-directional carets and trend arrows do NOT.
5. Type scale: font-size must be on the 9-step scale (no off-scale values like 12.5px — use the --text-* tokens / 12px).
6. Keep docs JSX SWC-valid (escape a literal '>' as {'>'}).

CRITICAL — you write ONLY these files (all disjoint from other agents, safe in parallel):
  (a) the new component file packages/ui/src/<file>
  (b) its story packages/ui/src/stories/<group>/<Comp>.stories.tsx
  (c) the existing docs page src/ds/migrated/<slug>.tsx — rewrite it to import the real component from '@/ds/core', remove the inline implementation + <style>, keep full DS-PAGE-STANDARD anatomy (Installation→Usage→Variants/Sizes/States→In context→Accessibility→RTL→Anatomy→Do/Don't→API reference with <AutoPropsTable component="X"/>).
You MUST NOT edit packages/ui/src/index.ts, scripts/extract-registry.mjs, packages/ui/styles/tokens.css, or ds.css — return their snippets instead. (The integrator owns those shared files to avoid write races.)
`

const BUILD_ITEM = {
  type: 'object', additionalProperties: false,
  properties: {
    slug: { type: 'string' },
    newFile: { type: 'string', description: 'packages/ui/src/<file> you created.' },
    exportNames: { type: 'array', items: { type: 'string' }, description: 'All exports from the new file (components + types + parts).' },
    familiesOnly: { type: 'array', items: { type: 'string' }, description: 'The subset that are top-level INSTALLABLE components → go in FAMILIES only[]. Compound sub-parts (CardHeader etc.) are OMITTED here so they inline into the parent registry item.' },
    barrelLine: { type: 'string', description: "e.g. \"export * from './modal';\"" },
    familyFile: { type: 'string', description: "e.g. \"modal.tsx\" (key for the FAMILIES map)." },
    cssTarget: { type: 'string', enum: ['tokens.css', 'ds.css', 'none'] },
    cssBlock: { type: 'string', description: 'Full CSS to append to the target stylesheet (with a /* section */ comment), de-indented. "" if none.' },
    storyFile: { type: 'string' },
    storyTitle: { type: 'string', description: "atomic-clean group, e.g. 'Overlays/Modal'." },
    docsPage: { type: 'string' },
    docRoute: { type: 'string', description: 'e.g. /modal' },
    registryNames: { type: 'array', items: { type: 'string' } },
    intraDeps: { type: 'array', items: { type: 'string' }, description: 'Sibling @eidos/ui components imported (their export names).' },
    npmDeps: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['slug', 'newFile', 'exportNames', 'familiesOnly', 'barrelLine', 'familyFile', 'cssTarget', 'storyFile', 'storyTitle', 'docsPage', 'registryNames'],
}

const VERDICT = {
  type: 'object', additionalProperties: false,
  properties: {
    pass: { type: 'boolean' },
    checks: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { name: { type: 'string' }, ok: { type: 'boolean' }, detail: { type: 'string' } }, required: ['name', 'ok'] } },
    fixesApplied: { type: 'array', items: { type: 'string' } },
  },
  required: ['pass', 'checks'],
}

// ── Phase 1 — Build each component (parallel, disjoint files) ────────────────────
phase('Build components')
const built = (await parallel(ITEMS.map(it => () => agent(
  `${STANDARDS}

BUILD this component to production quality and wire its OWN files (component + story + docs rewrite). Do NOT touch the 4 shared files — return their snippets.

COMPONENT: ${it.displayName} (docs slug: ${it.slug})
Suggested exports: ${JSON.stringify(it.suggestedExports || [])}
Target file: packages/ui/src/${it.file}
Story group: ${it.storyGroup || 'Overlays'} → story title "${it.storyGroup || 'Overlays'}/${(it.suggestedExports && it.suggestedExports[0]) || it.displayName}"
npm deps: ${JSON.stringify(it.npmDeps || [])}   intra-DS deps (sibling components you may import): ${JSON.stringify(it.intraDeps || [])}
Notes from the audit: ${it.notes || '(none)'}

STEPS:
1. Read src/ds/migrated/${it.slug}.tsx — it contains the existing inline implementation + page-local <style>/CSS classes. Extract the behavior + the CSS. Also grep tokens.css/ds.css for any related classes already present (reuse them; only return NEW css).
2. Write packages/ui/src/${it.file}: the real, typed, production component (full keyboard/focus/ARIA/RTL/reduced-motion per the contract). Mirror badge.tsx/select.tsx style.
3. Decide cssTarget + cssBlock: the CSS the component needs that is NOT already in the stylesheet, de-indented, prefixed with a "/* <Component> — promoted from <slug>.tsx */" section comment. (Do NOT edit the css file — return the block.)
4. Write the CSF3 story at packages/ui/src/stories/<group>/<Comp>.stories.tsx — Default + one per real variant/size/state + an InContext story; stateful demos use a React.useState wrapper in render; rely on the global theme/RTL/a11y toolbars; import ONLY from '@eidos/ui'.
5. Rewrite src/ds/migrated/${it.slug}.tsx to import the real component from '@/ds/core', drop the inline impl + <style>, and conform to DS-PAGE-STANDARD (keep/upgrade Installation, Usage, Variants, In context, Accessibility, RTL, visual Anatomy, Do/Don't, <AutoPropsTable component="${(it.suggestedExports && it.suggestedExports[0]) || it.displayName}"/>).
6. Return the structured BUILD_ITEM with EXACT snippets (barrelLine, familyFile, familiesOnly, cssTarget, cssBlock, registryNames, intraDeps, npmDeps). registry name = kebab of each familiesOnly entry.
Report nothing else — just the structured result.`,
  { label: `build:${it.slug}`, phase: 'Build components', agentType: 'design-system-engineer', schema: BUILD_ITEM },
)))).filter(Boolean)

// ── Phase 2 — Integrate (single serialized writer of the 4 shared files) ─────────
phase('Integrate')
const integrate = await agent(
  `${STANDARDS.split('CRITICAL — you write ONLY')[0]}

You are the SERIALIZED INTEGRATOR. ${built.length} components were just built (their own files are on disk). Apply ALL shared-file edits now — you are the only writer, so there are no races. Here are the build results:
${JSON.stringify(built)}

DO, carefully (read each shared file first, then edit):
1. packages/ui/src/index.ts — append each item's \`barrelLine\` (one \`export * from './<file>';\` per new file). Keep them grouped sensibly; no duplicates.
2. scripts/extract-registry.mjs — in the FAMILIES map add one entry per new file: \`'<familyFile>': { only: [<familiesOnly...>]${''} }\` (add \`, npm: [<npmDeps>]\` only if npmDeps non-empty). Match the existing formatting exactly. Do NOT list compound sub-parts in only[] (they inline). intraDeps need NO manual entry — the AST closure resolves sibling deps automatically as long as both are in FAMILIES.
3. packages/ui/styles/tokens.css and ds.css — append each item's \`cssBlock\` to the file named by its \`cssTarget\` (skip 'none'). De-duplicate against existing rules (if a class already exists, drop it from the block). Keep the section comments.
4. If any item has npmDeps, ensure they are dependencies of packages/ui/package.json (add + note for the verify phase to npm install).
Report exactly what you appended to each of the 4 files (counts + the FAMILIES keys added). Do NOT run the build — the verify phase does.`,
  { label: 'integrate', phase: 'Integrate', agentType: 'design-system-engineer' },
)

// ── Phase 3 — Verify (one full gate; auto-fix) ──────────────────────────────────
phase('Verify')
const exportsList = built.flatMap(b => b.familiesOnly || []).join(', ')
const routes = built.map(b => b.docRoute).filter(Boolean).join(' ')
const shoots = built.map(b => (b.storyTitle || '').toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9-]/g, '') + '--default').filter(Boolean).join(' ')
const verify = await agent(
  `${STANDARDS.split('CRITICAL — you write ONLY')[0]}

VERIFY the "${BATCH}" promote batch end-to-end and FIX anything red (re-run after each fix; don't stop at the first failure). New components: ${exportsList}.
First: if any npm dep was added, run \`npm install\` at the repo root.
Then run IN ORDER, report each as a check:
1. node scripts/gen-props.mjs                  — then CONFIRM each new component name appears in src/ds/core/props.generated.ts with >0 rows (grep each export). gen-props reads named interfaces + forwardRef<Ref,Props> generics; if a new component has 0 rows its <AutoPropsTable> is empty — fix the component's prop typing until it extracts.
2. npm run ui:typecheck                         (0 errors)
3. npm run registry:build                       (each new component appears as a registry item; expected count grew by the right amount; deps correct)
4. npm run cli:test && npm run cli:test:full    (BOTH ALL_PASS — fix any hardcoded count/sample assertions you changed)
5. npm run sb:build                             (every new story compiles under its group)
6. npm run build                                (docs: Compiled successfully, 247+ routes, .next/BUILD_ID present)
7. npm run verify                               (then confirm these routes render clean: ${routes || '(the new component routes)'})
8. node scripts/shoot-stories.mjs ${shoots || '(the new --default stories)'}   (screenshot — confirm each renders STYLED, not a bare unstyled box; this catches un-promoted CSS)
You own these fixes: barrel exports, extract-registry FAMILIES, promoted CSS in tokens.css/ds.css, story prop/title errors, props.generated, cli:test assertions, escaping '>' in docs JSX, missing imports. cat logs / ls artifacts to confirm — never trust silent success.
Return the verdict (pass=true only if checks 2-7 are green).`,
  { label: `verify:${BATCH}`, phase: 'Verify', agentType: 'design-system-engineer', schema: VERDICT },
)

// ── Phase 4 — Critique (parallel per component) ─────────────────────────────────
phase('Critique')
const critiques = await parallel(built.map(b => () => agent(
  `${STANDARDS.split('CRITICAL — you write ONLY')[0]}
Adversarial design + DS + a11y review of the newly promoted "${b.slug}" component. Surfaces: ${b.newFile}; its story ${b.storyFile}; its docs page ${b.docsPage}. Judge against docs/DS-PAGE-STANDARD.md, .claude/craft/anti-ai-slop.md (P0 list), and the Forge invariants (single ember accent; DARK INK on ember — verify contrast; Geist; on-scale type; logical props/RTL; composed classes, NO leftover per-page <style>). Specifically verify the production bar: full keyboard model, focus trap/restore (overlays) or roving tabindex (menus), correct ARIA roles/states, focus-visible rings, prefers-reduced-motion, RTL mirroring of directional glyphs only. Assume something is wrong and find it. Return a tight Keep / Fix (P0/P1) / Quick-wins list with file:line evidence. Do not edit — written gate.`,
  { label: `critique:${b.slug}`, phase: 'Critique', agentType: 'ux-designer' },
)))

return { batch: BATCH, built, integrate, verify, critiques, green: !!(verify && verify.pass) }
