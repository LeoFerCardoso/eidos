export const meta = {
  name: 'eidos-consolidate',
  description: 'Phase 1 of the Eidos DS consolidation: dedup CountUp/Counter, build the Pill/Chip/Badge trio + presets, unify Calendar (selectionMode), and rebuild Select as a custom dropdown + reconcile Combobox + document the Select/Combobox/DropdownMenu boundary. Sequential builds (shared-file safe) → one full verify → per-case critique.',
  whenToUse: 'After the consolidation-audit, to execute the 4 consolidation cases.',
  phases: [
    { title: 'Counter dedup' },
    { title: 'Badge trio' },
    { title: 'Calendar unify' },
    { title: 'Select rebuild' },
    { title: 'Verify' },
    { title: 'Critique' },
  ],
}

const REPO = '/Users/leocardoso/Projects/eidos'

const STANDARDS = `
You are a Eidos DS engineer. Repo: ${REPO}. Obey these conventions (read the files, do not guess):
- docs/DS-PAGE-STANDARD.md (page anatomy), src/ds/migrated/buttons.tsx (GOLD doc page), src/ds/migrated/pills.tsx (the complete Pills&Chips reference).
- CSF3 story template: packages/ui/src/stories/blocks/Banner.stories.tsx + atoms/StatusDot.stories.tsx (satisfies Meta<typeof X>, tags:['autodocs'], Default + variants + InContext; stateful demos use a React.useState wrapper in render; rely on the GLOBAL theme/RTL/a11y toolbars — do NOT duplicate per theme/direction).
- Registry pipeline: scripts/extract-registry.mjs (FAMILIES map — the 'only' array lists exported names per family file) → scripts/build-registry-manifest.mjs → packages/registry/scripts/build-registry.mjs. 'npm run registry:build' runs all three.
- Barrel: packages/ui/src/index.ts (export * from each module). A NEW component file must be added here.

HARD RULES (never violate — these are acceptance criteria):
1. CONTRAST: any fg on a colored/elevated surface gets an explicit contrasting color; on ember (var(--accent)/#FF6B35) the fg is DARK INK (#08090A / var(--bg)), never ember. dark surface→light fg, light surface→dark fg.
2. Single ember accent, ≤2×/screen. Geist Sans (UI) + Geist Mono (numerics/eyebrows).
3. NO per-page <style>. Any CSS a promoted component needs MUST be moved into packages/ui/styles/tokens.css or ds.css (de-indented, with a section comment) so it ships styled via 'eidos add'. Leave NO <style> block behind in the docs page.
4. Logical CSS props only (margin-inline-*, padding-inline-*, inset-inline-*) — RTL is first-class. Directional glyphs (chevrons) mirror under [dir=rtl]; trend arrows do NOT mirror.
5. Framework-agnostic React over the SEMANTIC CSS layer. NO Tailwind utilities, NO Radix in the component layer. Use cn() from '@eidos/ui'. Components import only from within @eidos/ui (icons/atoms/etc.), never from the docs app.
6. NAMING: custom value components use \`value\` + \`onValueChange:(v)=>void\`. Native-input wrappers keep native \`onChange\`. Breaking renames ship WITH an @deprecated back-compat alias export for one release.
7. Keep JSX SWC-valid in docs pages (escape a literal '>' as {'>'}).
Report exactly which files you wrote/edited and the exports added.`

const BUILD = {
  type: 'object', additionalProperties: false,
  properties: {
    caseName: { type: 'string' },
    exportsAdded: { type: 'array', items: { type: 'string' } },
    filesWritten: { type: 'array', items: { type: 'string' } },
    cssPromoted: { type: 'array', items: { type: 'string' }, description: 'CSS selectors/blocks moved into tokens.css/ds.css.' },
    registryItems: { type: 'array', items: { type: 'string' }, description: 'registry kebab names added/changed/aliased.' },
    storiesWritten: { type: 'array', items: { type: 'string' } },
    docsUpdated: { type: 'array', items: { type: 'string' } },
    deprecatedAliases: { type: 'array', items: { type: 'string' } },
    followups: { type: 'array', items: { type: 'string' }, description: 'Anything left for the verify phase to reconcile (e.g., cli:test count assertions).' },
  },
  required: ['caseName', 'exportsAdded', 'filesWritten'],
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

// ── 1. Counter / CountUp dedup ──────────────────────────────────────────────────
phase('Counter dedup')
const counter = await agent(`${STANDARDS}

CONSOLIDATION CASE 1 — Counter / CountUp dedup.
Today packages/ui/src/atoms.tsx has \`const Counter = (...)\` and \`const CountUp = Counter\` (alias). Both have stories and both are registry items. Canonical name = CountUp.

DO:
1. In atoms.tsx, FLIP the definition: implement the component as \`CountUp\` (keep its current animation: mono number easing from \`from\` (default 0) to \`to\` on first viewport entry via IntersectionObserver, collapses to instant under prefers-reduced-motion). Ensure props: to:number, from?:number (default 0), dur?:number, prefix?:string, suffix?:string, decimals?:number, className?, style?. Fire-once (document that callers reset via React \`key\`; no internal re-trigger). Then export \`/** @deprecated use CountUp */ const Counter = CountUp;\` Keep BOTH in the atoms export block.
2. Stories: make packages/ui/src/stories/atoms/CountUp.stories.tsx the single canonical file — absorb Counter.stories.tsx's richer named stories (Percentage, Currency, Latency, InContext), adopt Counter's better Default arg (to:4280), add a ReducedMotion story. DELETE packages/ui/src/stories/atoms/Counter.stories.tsx.
3. Registry: in scripts/extract-registry.mjs keep \`count-up\` as the canonical self-contained item; remove the now-redundant separate \`counter\` curated entry IF cli:test does not assert it — otherwise keep \`counter\` as a thin entry. Whatever you choose, 'npm run cli:test' MUST still pass (the verify phase will confirm; note any test-count assertion you touched in followups).
4. Docs: src/ds/migrated/count-up.tsx already imports CountUp from @/ds/core — confirm it renders the canonical component and covers from/prefix/suffix/decimals. Light touch only.
Return the structured build result.`,
  { label: 'build:counter', phase: 'Counter dedup', agentType: 'design-system-engineer', schema: BUILD })

// ── 2. Badge trio (Pill / Chip / Badge) + presets ───────────────────────────────
phase('Badge trio')
const badge = await agent(`${STANDARDS}

CONSOLIDATION CASE 2 — the Badge family. DECISION (locked by the user): the TRIO model — three small components, each polymorphic in its OWN role, honoring the documented Pill≠Chip≠Badge contract in src/ds/migrated/pills.tsx. Read pills.tsx, severity.tsx, status.tsx, status-dot.tsx, and grep tokens.css/ds.css for .pill / .chip / .badge / .dot / .ldot / .pl-x / .ch-arrow class systems FIRST.

DO:
1. Create packages/ui/src/badge.tsx exporting:
   - \`Pill\` (STATE): props { tone?: 'ember'|'success'|'warning'|'danger'|'ice'|'neutral' AND the semantic state families used on the severity/status/health docs pages — 'severity-p0'..'p3', 'health-up'|'degraded'|'down'|'unknown', 'status-*', 'risk-*' (map each to the EXISTING CSS class on those pages; the 6 base tones are primary, the families power presets); dot?:boolean; live?:boolean (pulsing .ldot — only while work runs); icon?:ReactNode (suppresses the dot); onRemove?:()=>void + removeLabel?:string (renders the trailing .pl-x button with required aria-label; Backspace/Delete on the pill also removes); children; className; ...span }. role/aria per pills.tsx (state text spelled out, pulse dot aria-hidden).
   - \`Chip\` (ATTRIBUTE, 4px-radius rectangle): props { tone?: 'ok'|'bad'|'warn'|'ember'|'neutral'|'tier-t1'|'tier-t2'|'tier-t3'; trend?:'up'|'down' (leading 10px .ch-arrow — does NOT mirror in RTL); icon?:ReactNode; onRemove?+removeLabel?; children; className }.
   - \`Badge\` (COUNT, ~18px): props { tone?: 'neutral'|'new'|'success'|'warning'|'danger'; size?:'sm'|'md'|'lg'; dot?:boolean (bare dot badge); pushEnd?:boolean (.push-end to hug a nav row's trailing edge); children }.
   Plus PillProps/ChipProps/BadgeProps types. Use cn().
2. PROMOTE the page-local CSS from pills.tsx's <style> (.pill .ldot + pl-pulse keyframes, .pl-x remove button + hover/light-theme, .chip .ch-arrow, .chip-row) into ds.css with a section comment, and remove that <style> block from pills.tsx. Add \`.chip.tier-t1/.tier-t2/.tier-t3\` to tokens.css in the .chip-modifiers block (T1=ember fill w/ DARK INK fg, T2=warning, T3=muted/border) replacing TierBadge's inline-style colors. Ensure all .pill/.chip/.badge tone classes the presets need actually exist — promote any that are page-local on severity/status pages.
3. Refactor packages/ui/src/atoms.tsx PRESETS to compose the new trio (keep them EXPORTED as thin presets — they are "applications", not new components):
   - TierBadge = ({tier}) => <Chip tone={\`tier-\${tier.toLowerCase()}\`}>{tier}</Chip>
   - SeverityPill = ({level='p2', label, icon=true}) => <Pill tone={\`severity-\${level}\`} icon={icon?<Icons.alert size={10}/>:undefined} role="status" aria-label={'Severity: '+(label||SEVERITY_LABELS[level])}>{label||SEVERITY_LABELS[level]}</Pill>
   - HealthBadge = ({state='unknown', label, pulse=false}) => <Pill tone={\`health-\${state}\`} dot live={pulse&&state==='degraded'} role="status" aria-label={'Health: '+(label||HEALTH_LABELS[state])}>{label||HEALTH_LABELS[state]}</Pill>
   - LangBadge = ({lang}) => <Chip icon={<span aria-hidden="true" style={{width:7,height:7,borderRadius:'50%',background:MOCKS.LANGS[lang]||'var(--fg-subtle)'}}/>}>{lang}</Chip>  (data-driven dot stays inline — correct)
   Keep StatusDot, CopyChip, OwnerPill STANDALONE (do not fold). Update atoms.tsx to import Pill/Chip from './badge'.
4. Barrel: add \`export * from './badge'\` to packages/ui/src/index.ts. FAMILIES: add a 'badge' family entry in extract-registry.mjs with only:['Pill','Chip','Badge'] (so registry items pill, chip, badge appear). Keep tier-badge/lang-badge/severity-pill/health-badge registry items (their source becomes the preset re-export).
5. Stories: write packages/ui/src/stories/atoms/Badge.stories.tsx (title 'Atoms/Badge') covering Pill tones+dot+live+icon+removable, Chip tones+trend+removable+tier, Badge counts+sizes+dot+pushEnd, and an InContext service-row story. The existing TierBadge/LangBadge/SeverityPill/HealthBadge stories stay (presets) — only fix imports if needed.
6. Docs: rewrite src/ds/migrated/pills.tsx to import { Pill, Chip } from '@/ds/core' and use the REAL components in every Frame (no raw spans), keeping the full section anatomy. Update badges.tsx similarly for Badge. Add Installation that ships Pill/Chip/Badge.
Return the structured build result.`,
  { label: 'build:badge', phase: 'Badge trio', agentType: 'design-system-engineer', schema: BUILD })

// ── 3. Calendar unify ───────────────────────────────────────────────────────────
phase('Calendar unify')
const calendar = await agent(`${STANDARDS}

CONSOLIDATION CASE 3 — Calendar / RangeCalendar unify. Read packages/ui/src/calendar.tsx, src/ds/migrated/calendar.tsx (the docs PropsTable promises mode/locale/weekStartsOn/disabled/className/onValueChange that don't exist yet), and src/ds/migrated/date-picker.tsx (its private RangeGrid has the hover-preview we want).

DO:
1. Rewrite packages/ui/src/calendar.tsx so \`Calendar\` is the single unified month-grid picker with prop \`selectionMode?: 'single'|'range'\` (default 'single'; design the value/onChange types to allow adding 'multiple' later but DEFER implementing 'multiple' now). Implement the real props the docs promise:
   - value/defaultValue typed by mode (Date for single, DateRange {start,end} for range), onValueChange matching the mode (keep an @deprecated onChange alias that forwards).
   - disabled?:(date:Date)=>boolean (matching cells: opacity .3, tabIndex -1, no selection), minDate/maxDate (disable out-of-range cells AND disable the Prev/Next nav at bounds), locale?:string (default 'en-US', via Intl for month title + DOW), weekStartsOn?:0|1 (default 1), footer?:ReactNode slot, className, aria-label.
   - In range mode, hover-preview is ON: previewing the in-range band on mouse hover before the 2nd click commits (port the hovering/onHover logic from date-picker.tsx's RangeGrid).
   - Keyboard: arrows move focus by day/week, PageUp/Down month, Home/End week, Enter/Space select, Esc clears in-progress range. role=grid semantics.
2. RangeCalendar => keep-alias: \`/** @deprecated use <Calendar selectionMode="range"/> */ export function RangeCalendar(props){ return <Calendar selectionMode="range" {...props}/> }\` keeping RangeCalendarProps exported.
3. Any calendar CSS still in the docs page <style> (.cal-*) must be in tokens.css already per prior work — verify; promote anything missing; remove leftover <style>.
4. Stories: rewrite packages/ui/src/stories/forms/Calendar.stories.tsx to cover Single, Range (with hover-preview), DisabledDates, Bounded(min/max), Locale, WeekStartsOnSunday, WithFooter. Keep RangeCalendar.stories.tsx but reduce it to a single Deprecated/Alias story pointing at Calendar selectionMode=range (or delete and note in followups).
5. Docs: src/ds/migrated/calendar.tsx — make every Frame import Calendar from @/ds/core and exercise selectionMode + the new props; reconcile the PropsTable to the real API (onValueChange).
6. DatePicker note (do NOT implement here): in followups, record that forms.tsx DatePicker (native input) should later be renamed DateInput with a DatePicker alias and a popover DatePicker composing Calendar.
Return the structured build result.`,
  { label: 'build:calendar', phase: 'Calendar unify', agentType: 'design-system-engineer', schema: BUILD })

// ── 4. Select rebuild + boundary ────────────────────────────────────────────────
phase('Select rebuild')
const select = await agent(`${STANDARDS}

CONSOLIDATION CASE 4 — Select rebuild + Combobox reconcile + Select/Combobox/DropdownMenu boundary. Read packages/ui/src/forms.tsx (Select native wrapper), packages/ui/src/combobox.tsx, src/ds/migrated/select.tsx (its local custom .sel-* dropdown is the real target), src/ds/migrated/combobox.tsx, src/ds/migrated/menu.tsx. The exported Select is currently a native <select> (chevron via CSS background); the user wants the RICH custom dropdown the docs promise.

DECISION/BOUNDARY (apply + document on the docs pages):
- Select = single-value picker from a closed set. CUSTOM (button trigger + listbox panel). Features: leading icon, per-option icon/description, groups, optional typeahead (\`searchable\`), sizes sm/md/lg, status (invalid/disabled/error/help), the panel shows a check on the selected item, RTL. value + onValueChange. NEVER multi. ARIA: trigger role=button aria-haspopup=listbox aria-expanded; panel role=listbox; rows role=option aria-selected. Panel uses position:fixed + getBoundingClientRect (to escape .ds-frame overflow) with scroll/resize close.
- Combobox = superset: always-visible search input, free-text filter, AND multi-select (chip row). value:string|string[]|null + onChange/onValueChange. Reconcile the docs Combobox 'multi' prop to the exported 'multiple'.
- DropdownMenu = command list (actions, not value); role=menu/menuitem; closes on action; no search/value. (menu.tsx documents it; it will be PROMOTED in Phase 2 — here just make the boundary text correct on the select/combobox docs pages.)

DO:
1. In packages/ui/src/forms.tsx: RENAME the current native-<select> Select to \`NativeSelect\` (keep NativeSelectProps; it's valid for SSR/mobile/native-submit forms). Then implement the new custom \`Select\` (port src/ds/migrated/select.tsx's .sel-* component) as the canonical export, OR put it in its own file packages/ui/src/select.tsx and re-export. Provide props per the boundary: value, onValueChange, defaultValue, options:SelectOption[] ({value,label,icon?,description?,disabled?}), groups?:SelectGroup[], placeholder, searchable?, searchPlaceholder?, size, disabled, invalid, error, help, label, leadingIcon, full?, width?, emptyText?, id, className. Render an explicit <Icons.chevronDown> in the trigger that rotates on open and mirrors under RTL. Keep \`/** @deprecated use NativeSelect or the new Select */\` only if a name truly collides.
2. PROMOTE the .sel-* CSS from select.tsx's <style> into packages/ui/styles/tokens.css with a section comment; remove the <style> from the docs page.
3. Combobox: reconcile prop naming (docs 'multi' → exported 'multiple'); ensure CB_CSS is in tokens.css (per prior work) and remove any duplicate <style>; confirm multi-select chip row + free-text filter + searchable-always.
4. Barrel/FAMILIES: ensure NativeSelect + the custom Select (and Combobox) are exported in index.ts and curated in extract-registry FAMILIES (registry items: select, native-select, combobox).
5. Stories: rewrite packages/ui/src/stories/forms/Select.stories.tsx for the CUSTOM select — Default, Selected, WithIcon (leading), WithOptionIcons, Grouped, Searchable, Sizes, Invalid, Disabled, RTL, InContext. Add a NativeSelect story (forms/NativeSelect). Update Combobox.stories.tsx to show single, Searchable, Multiple(chip row), Grouped.
6. Docs: rewrite src/ds/migrated/select.tsx to import the real Select from @/ds/core (no local component, no <style>), full section anatomy, and add the boundary note (Select vs Combobox vs Dropdown). Reconcile combobox.tsx to import the exported Combobox and document 'multiple'.
Return the structured build result.`,
  { label: 'build:select', phase: 'Select rebuild', agentType: 'design-system-engineer', schema: BUILD })

// ── 5. Verify (one full gate; auto-fix) ─────────────────────────────────────────
phase('Verify')
const builds = [counter, badge, calendar, select].filter(Boolean)
const verify = await agent(`${STANDARDS}

VERIFY the Phase-1 consolidation end-to-end and FIX anything red (re-run after each fix; don't stop at the first failure). Builds just landed:
${JSON.stringify(builds)}

Run IN ORDER, report each as a check:
1. node scripts/gen-props.mjs                       (refresh AutoPropsTable rows for CountUp, Pill, Chip, Badge, Calendar, Select, NativeSelect, Combobox)
2. npm run ui:typecheck                              (0 errors)
3. npm run registry:build                            (pill/chip/badge/select/native-select appear; counter/range-calendar handled per plan; deps correct)
4. npm run cli:test && npm run cli:test:full         (BOTH ALL_PASS — fix any hardcoded count assertions you changed)
5. npm run sb:build                                  (all stories compile; deleted Counter story not referenced)
6. npm run build                                     (docs: Compiled successfully, 247+ routes; .next/BUILD_ID present)
7. npm run verify                                    (headless route render check — calendar/select/pills/badges/count-up/combobox render clean)
8. node scripts/shoot-stories.mjs atoms-badge--pill atoms-countup--default forms-select--default forms-calendar--range   (screenshot — confirm STYLED, not bare; confirm Select shows ONE rotating chevron + selected check, Pill/Chip render with tones, dark ink on ember)
You own these fixes: barrel exports, extract-registry FAMILIES, promoted CSS in tokens.css/ds.css, story prop/title errors, props.generated, cli:test count assertions, escaping '>' in docs JSX. cat logs / ls artifacts to confirm — never trust silent success.
Return the verdict (pass=true only if checks 2–7 are green).`,
  { label: 'verify:phase1', phase: 'Verify', agentType: 'design-system-engineer', schema: VERDICT })

// ── 6. Critique (parallel, per case) ────────────────────────────────────────────
phase('Critique')
const CASES = [
  { k: 'Badge trio', pages: 'src/ds/migrated/pills.tsx + badges.tsx; packages/ui/src/badge.tsx; Badge.stories.tsx', extra: 'Confirm Pill≠Chip≠Badge contract intact, presets are thin, dark ink on ember tones, pulse only while running, removable aria-labels.' },
  { k: 'Calendar', pages: 'src/ds/migrated/calendar.tsx; packages/ui/src/calendar.tsx; Calendar.stories.tsx', extra: 'Confirm selectionMode single+range, hover-preview, disabled/min/max, locale/weekStartsOn, keyboard grid nav, RTL chevrons mirror, PropsTable matches real API.' },
  { k: 'Select', pages: 'src/ds/migrated/select.tsx + combobox.tsx; packages/ui/src/forms.tsx/select.tsx/combobox.tsx; Select/Combobox stories', extra: 'Confirm custom Select has ONE rotating chevron, leading icon, sizes, groups, searchable, selected-check, RTL; NativeSelect alias exists; Combobox multiple; boundary documented; no overlap.' },
]
const critiques = await parallel(CASES.map(c => () => agent(
  `${STANDARDS.split('Report exactly')[0]}
Adversarial design + DS review of the "${c.k}" consolidation. Surfaces: ${c.pages}. Judge against docs/DS-PAGE-STANDARD.md, .claude/craft/anti-ai-slop.md (P0 list), and the Eidos invariants (single ember accent; DARK INK on ember — verify contrast; Geist; logical props/RTL; composed classes, NO leftover per-page <style>). ${c.extra} Assume something is wrong and find it. Return a tight Keep / Fix / Quick-wins list with file:line evidence. Do not edit — written gate.`,
  { label: `critique:${c.k}`, phase: 'Critique', agentType: 'ux-designer' },
)))

return { builds, verify, critiques, green: !!(verify && verify.pass) }
