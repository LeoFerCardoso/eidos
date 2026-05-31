export const meta = {
  name: 'restructure-component',
  description:
    'Restructure ONE Forge DS component end-to-end so its three surfaces are correct and consistent: the docs page (section standard), the Storybook story (CSF3 / atomic-clean taxonomy), and the install/registry item (forge-ui add). Flow: resolve+audit → 3 parallel rebuilds → build/verify (auto-fix) → adversarial critique.',
  whenToUse:
    'Improving or building an existing Forge DS component. Invoke with args = a component name/slug string, or { component, dryRun, skipDocs, skipStory, skipInstall }. dryRun returns the audit/gap report without editing files.',
  phases: [
    { title: 'Resolve & audit' },
    { title: 'Restructure' },
    { title: 'Build & verify' },
    { title: 'Critique' },
  ],
}

// ── Input ─────────────────────────────────────────────────────────────────────
const input = typeof args === 'string' ? { component: args } : (args || {})
const COMPONENT = input.component || input.slug || input.name
if (!COMPONENT) throw new Error('restructure-component: pass a component name/slug — e.g. Workflow({ name: "restructure-component", args: "badge" })')
const DRY = !!input.dryRun

const REPO = '/Users/leocardoso/Projects/forge-ds'
const STANDARDS = `
Authoritative conventions to obey (read them — do not guess):
- docs/DS-PAGE-STANDARD.md — the canonical page anatomy + class vocabulary.
- src/ds/migrated/buttons.tsx — the GOLD-REFERENCE doc page; mirror its shape & quality.
- .claude/skills/component-page/SKILL.md + .claude/craft/anti-ai-slop.md — doc rules + the anti-AI-slop P0 checklist.
- packages/ui/src/stories/blocks/Banner.stories.tsx + atoms/StatusDot.stories.tsx — the CSF3 story template (satisfies Meta, tags:['autodocs'], Default + variants/sizes/states + InContext).
- scripts/extract-registry.mjs (FAMILIES map) → scripts/build-registry-manifest.mjs → packages/registry/scripts/build-registry.mjs — the 3-step install/registry pipeline.

FORGE INVARIANTS (never violate): single ember accent #FF6B35 (≤2×/screen); dark-ink foreground on ember fills (contrast is non-negotiable); Geist Sans + Geist Mono; compose existing classes (NEVER per-page <style> — extend tokens.css/ds.css); logical CSS props (RTL first-class); the component layer is framework-agnostic React over a SEMANTIC CSS layer (no Tailwind utilities, no Radix in components).

Storybook taxonomy (atomic-clean): Primitives · Forms · Atoms · Blocks · Charts · Overlays · Device · AI · Icons · Docs. Story title must use the correct group.

Install model: a component is installable when (a) it is a curated entry in scripts/extract-registry.mjs FAMILIES, (b) its registry item declares the right registryDependencies (forge base, +forge-ai for AI components, + any sibling components it imports) and npm dependencies, and (c) any page-local <style> CSS it relies on has been PROMOTED into the shared packages/ui/styles/tokens.css (like .in-drop / .cal-* were) so it ships styled via forge-ui add.
`

const AUDIT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    component: { type: 'string', description: 'Canonical PascalCase export name.' },
    exists: { type: 'boolean', description: 'Does the component already exist as an exported @forge/ui component?' },
    sourceFile: { type: 'string', description: 'Path to the component source (packages/ui/src/...), or "" if it must be created.' },
    family: { type: 'string', description: 'atoms|primitives|blocks|charts|device|drawer|forms|icons|ai|overlays' },
    storyTitle: { type: 'string', description: 'Correct atomic-clean Storybook title, e.g. "Forms/Combobox".' },
    storyFile: { type: 'string', description: 'Path to the co-located story (packages/ui/src/stories/<family>/<Comp>.stories.tsx).' },
    docPage: { type: 'string', description: 'Path to the docs page (src/ds/migrated/<...>.tsx), or "" if missing.' },
    docRoute: { type: 'string', description: 'The route the docs page renders at, e.g. /combobox or /idp/metric-card.' },
    registryName: { type: 'string', description: 'kebab-case registry item name, e.g. combobox.' },
    props: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: { name: { type: 'string' }, type: { type: 'string' }, required: { type: 'boolean' }, default: { type: 'string' }, description: { type: 'string' } },
        required: ['name', 'type'],
      },
    },
    variants: { type: 'array', items: { type: 'string' }, description: 'Distinct visual variants/sizes/states worth one Frame + one story each.' },
    intraDeps: { type: 'array', items: { type: 'string' }, description: 'Other Forge components this one imports (→ registryDependencies).' },
    npmDeps: { type: 'array', items: { type: 'string' }, description: 'Real external npm deps (recharts/ai/react-markdown/…), [] if none.' },
    pageLocalCss: { type: 'boolean', description: 'Does it rely on CSS in a page <style> block that must be promoted to tokens.css?' },
    gaps: {
      type: 'object', additionalProperties: false,
      properties: {
        doc: { type: 'array', items: { type: 'string' }, description: 'Missing/incorrect doc-page sections vs DS-PAGE-STANDARD.' },
        story: { type: 'array', items: { type: 'string' }, description: 'Story gaps vs the CSF3 template (missing states, wrong title, etc.).' },
        install: { type: 'array', items: { type: 'string' }, description: 'Install/registry gaps (not in FAMILIES, wrong deps, un-promoted CSS, vaporware peer-deps).' },
      },
      required: ['doc', 'story', 'install'],
    },
  },
  required: ['component', 'exists', 'family', 'storyTitle', 'registryName', 'props', 'variants', 'gaps'],
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

// ── Phase 1 — Resolve & audit (read-only) ─────────────────────────────────────
phase('Resolve & audit')
const audit = await agent(
  `Repo: ${REPO}. You are AUDITING a single Forge DS component to plan a 3-surface restructure
(docs page, Storybook story, install/registry). Component identifier: "${COMPONENT}".

${STANDARDS}

DO (read-only — make NO edits):
1. Resolve the component: find its source export in packages/ui/src/** (it may be in a family file
   like atoms.tsx/forms.tsx, or its own file, or under ai/). Determine the canonical PascalCase name,
   the family, the correct atomic-clean Storybook title + story file path, the docs page path + route
   (src/ds/migrated/<slug>.tsx or <ds>/<slug>.tsx), and the kebab registry name. If a surface is
   missing, say so (this workflow also builds from scratch).
2. Extract the REAL prop list (name/type/required/default/description) from the TS source — this is the
   single source of truth the rebuild steps will share. Cross-check src/ds/core/props.generated.ts.
3. List the distinct variants/sizes/states that each deserve a Frame + a story.
4. Identify intra-DS component deps (imports of other Forge components) and real npm deps.
5. Detect whether the component relies on page-local <style> CSS that must be promoted to tokens.css.
6. Produce the GAP report per surface: doc (vs DS-PAGE-STANDARD section anatomy), story (vs the CSF3
   template), install (FAMILIES membership, registryDependencies, npm deps, promoted CSS, vaporware).

Return the structured audit.`,
  { label: `audit:${COMPONENT}`, phase: 'Resolve & audit', agentType: 'design-system-engineer', schema: AUDIT_SCHEMA },
)

if (DRY) {
  log(`Dry run — audit only for "${COMPONENT}". No files changed.`)
  return { mode: 'dryRun', audit }
}

const A = JSON.stringify(audit)

// ── Phase 2 — Restructure (3 parallel, non-conflicting file sets) ──────────────
phase('Restructure')
const streams = []

if (!input.skipDocs) streams.push(() => agent(
  `Repo: ${REPO}. Restructure the DOCS PAGE for ${audit.component} to the Forge page standard.
${STANDARDS}

AUDIT (shared source of truth — use these props/variants/paths, do not re-derive differently):
${A}

DO:
- Author/rewrite the docs page at ${audit.docPage || 'src/ds/migrated/<slug>.tsx (create it + add to nav-config if missing)'}
  to follow docs/DS-PAGE-STANDARD.md section anatomy IN ORDER: Header (Section id/num/title/desc, lede ≤3 lines)
  → Installation (ComponentInstall or installTabs) → Usage (one Frame, smallest real render) →
  Variants/Sizes/States (one Frame per axis, every variant from the audit) → In context (realistic mini-layout)
  → Accessibility (SubHead meta="a11y": real keyboard table + ARIA + contrast + reduced-motion) →
  RTL (a Frame under dir="rtl") → Anatomy (visual .ana>.stage with numbered .pin + .lead + .ana-list legend)
  → Do/Don't (.dd-grid) → API reference (<AutoPropsTable component="${audit.component}"/>).
- Import primitives from '@/ds/core'. Compose ONLY existing classes; NO per-page <style>. Mirror buttons.tsx quality.
- Run the anti-ai-slop P0 checklist before finishing. Keep JSX SWC-valid (escape literal '>' as {'>'}).
Report exactly which file(s) you wrote.`,
  { label: `doc:${audit.component}`, phase: 'Restructure', agentType: 'design-system-engineer' },
))

if (!input.skipStory) streams.push(() => agent(
  `Repo: ${REPO}. Restructure the STORYBOOK STORY for ${audit.component}.
${STANDARDS}

AUDIT (shared source of truth):
${A}

DO:
- Author/rewrite the co-located CSF3 story at ${audit.storyFile || `packages/ui/src/stories/${audit.family}/${audit.component}.stories.tsx`}.
- Pattern (match Banner/StatusDot stories): import type { Meta, StoryObj } from '@storybook/react-vite';
  import { ${audit.component} } from '@forge/ui'; const meta = { title: '${audit.storyTitle}', component: ${audit.component},
  tags: ['autodocs'], parameters, args, argTypes } satisfies Meta<typeof ${audit.component}>; export default meta;
  type Story = StoryObj<typeof meta>.
- Stories: Default (driven by args) + one per real Variant/Size/State from the audit + an InContext story
  (compose with siblings; use MOCKS from '@forge/ui' for data-heavy components). Interactive/stateful
  controls use a React.useState wrapper inside render. Rely on the global theme + RTL + a11y toolbars
  (do NOT duplicate stories per theme/direction). Correct atomic-clean title group.
- Only import from '@forge/ui'. Provide ALL required props. Keep it tsc-clean.
Report the file you wrote.`,
  { label: `story:${audit.component}`, phase: 'Restructure', agentType: 'design-system-engineer' },
))

if (!input.skipInstall) streams.push(() => agent(
  `Repo: ${REPO}. Fix the INSTALL / REGISTRY surface for ${audit.component} so 'forge-ui add ${audit.registryName}' works and ships it styled.
${STANDARDS}

AUDIT (shared source of truth):
${A}

DO:
1. Ensure ${audit.component} is a curated entry in scripts/extract-registry.mjs FAMILIES (correct family file +
   the export name in its 'only' array). Add it if missing.
2. If the audit flags pageLocalCss=true, PROMOTE the component's page-local <style> CSS into the shared
   packages/ui/styles/tokens.css (same pattern used for .in-drop and .cal-*), de-indented, with a section
   comment — otherwise it installs unstyled.
3. Make sure its registry item will declare the right deps: registryDependencies = forge (+forge-ai if AI)
   + intra-DS components [${(audit.intraDeps||[]).join(', ') || 'none'}]; npm dependencies = [${(audit.npmDeps||[]).join(', ') || 'none'}].
   The deps come from the FAMILIES npm field + the AST closure, so verify the source imports match.
4. Reconcile any vaporware in the docs install block (no bogus @radix/CVA peers; the baseline is clsx+tailwind-merge;
   installTabs/ComponentInstall in src/ds/core or PEER_OVERRIDES in src/ds/core/docs-primitives.tsx).
Do NOT run the full build here (the verify phase does). Report the files you edited.`,
  { label: `install:${audit.component}`, phase: 'Restructure', agentType: 'design-system-engineer' },
))

const rebuilt = await parallel(streams)

// ── Phase 3 — Build & verify (deterministic gates; auto-fix) ───────────────────
phase('Build & verify')
const verify = await agent(
  `Repo: ${REPO}. VERIFY the ${audit.component} restructure end-to-end and FIX anything that fails. Run, in order,
and report each as a check (fix + re-run on failure; do not stop at the first red):
  1. node scripts/gen-props.mjs              (refresh AutoPropsTable rows for ${audit.component})
  2. npm run ui:typecheck                    (0 errors)
  3. npm run registry:build                  (component appears; expected count grows; deps correct)
  4. npm run cli:test  &&  npm run cli:test:full   (both ALL_PASS — proves forge-ui add ${audit.registryName} installs + the tree typechecks)
  5. npm run sb:build                         (story compiles; title under '${audit.storyTitle.split('/')[0]}/')
  6. npm run build                            (docs: 247+ routes, Compiled successfully — confirm .next/BUILD_ID present)
  7. npm run start (background) then: node scripts/verify-render.mjs ${audit.docRoute || '/' + audit.registryName}   (route renders clean), then stop the server
  8. node scripts/shoot-stories.mjs ${audit.storyTitle.toLowerCase().replace(/\\//g, '-').replace(/[^a-z0-9-]/g, '')}--default   (screenshot the story; confirm it renders STYLED, not a bare unstyled box — this catches un-promoted CSS)
Common fixes you own: add the export to packages/ui/src/index.ts barrel; add to extract-registry FAMILIES; promote
page-local CSS to tokens.css; fix story prop/title errors; escape '>' in doc JSX. Verify outputs against disk (cat the
log / ls the artifact) — the tool channel can drop output, so never trust a silent success.
Return the structured verdict (pass=true only if checks 2-6 are green).`,
  { label: `verify:${audit.component}`, phase: 'Build & verify', agentType: 'design-system-engineer', schema: VERDICT },
)

// ── Phase 4 — Adversarial critique ─────────────────────────────────────────────
phase('Critique')
const critique = await agent(
  `Repo: ${REPO}. Expert design + DS review of the restructured ${audit.component}: its docs page (${audit.docPage}),
its Storybook story (${audit.storyFile}), and its install block. Judge against docs/DS-PAGE-STANDARD.md,
.claude/craft/anti-ai-slop.md (P0 list), and the Forge invariants (single ember accent; DARK INK on ember fills —
verify contrast; Geist type; logical props/RTL; composed classes, no per-page <style>). For the story, confirm it
covers every real variant/state and reads intentional, not boilerplate. Be adversarial: assume something is wrong
and find it. Return: a short Keep / Fix / Quick-wins review with cited evidence (file:line). Do not edit — this is a
written gate the user reads before shipping.`,
  { label: `critique:${audit.component}`, phase: 'Critique', agentType: 'ux-designer' },
)

return {
  component: audit.component,
  audit,
  rebuilt,
  verify,
  critique,
  green: !!(verify && verify.pass),
}
