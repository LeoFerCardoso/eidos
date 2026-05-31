export const meta = {
  name: 'consolidation-audit',
  description:
    'Read-only audit for the Forge DS consolidation + Storybook-completion program: deep-dives the 4 consolidation cases (Calendar, Badge family, Counter/CountUp, Select vs Combobox vs Dropdown) and builds a full coverage matrix (docs page ↔ @eidos/ui export ↔ story ↔ registry item) classifying every component as complete / story-only / promote-component / consolidate. Produces the plan inputs — makes NO edits.',
  whenToUse: 'Before planning the Forge DS component-consolidation + Storybook coverage work.',
  phases: [
    { title: 'Consolidation deep-dives' },
    { title: 'Coverage matrix' },
    { title: 'Critique' },
  ],
}

const REPO = '/Users/leocardoso/Projects/forge-ds'

const GROUND = `
GROUND TRUTH (verify against disk — packages/ui/src/index.ts barrel, packages/ui/src/stories/**, packages/registry/registry.generated.json — but use this to move fast):
- @eidos/ui REAL component exports (a component is "real" only if it is exported here; everything else lives only as CSS + inline JSX in a docs page and is "docs-only"):
  atoms: Sparkline, Counter, CountUp(=alias of Counter), Avatar, TierBadge, LangBadge, Empty, StatusDot, Trend, HealthBadge, SeverityPill, KbdRow, CopyChip, RelativeTime, OwnerPill
  blocks: Banner, MetricCard, Stat, Pipeline, Timeline, RingBar, ScoreGauge, LogViewer, DiffViewer, TreeView, JSONInspector, ServiceCard, AgentCard, FilterPanel, DataTable
  calendar: Calendar, RangeCalendar
  forms: Input, Textarea, Select, Checkbox, Switch, RadioGroup, Slider, NumberInput, OTPInput, FileInput, DatePicker
  combobox: Combobox ; color-input: ColorInput, ColorPicker ; drawer: Drawer ; device: DeviceFrame, StatusBar, PhoneTop
  primitives: CopyButton, Code, CodeBlock, CodeTree, Tabs, TabbedCode, CollapsibleCode, Frame, PropsTable, SubHead, Lede, Mono, TokenSwatch, SpecRow, installTabs, Pagination, SimplePagination
  charts: ForgeChart, ForgeTooltipContent, ChartLegend (+helpers)
  ai: many (ToolStatus, ChainOfThought, Checkpoint, Confirmation, ArtifactWidget, AskUser, Shimmer, Skeleton, ImageView, Diagram, MathView, ContextGauge, ContextBar, History*, AILabel, AILabelWithPopover, AgentAvatar, AgentIdentity, Message, MessageActions, Response, Conversation, PromptInput, Suggestion, ModelBadge, ModelSelector, Terminal, AudioPlayer, Persona, Citation/Sources, ...)
- Existing Storybook stories (co-located packages/ui/src/stories/<family>/<Comp>.stories.tsx). Families with stories: atoms, blocks, forms, overlays, charts, primitives, docs, ai. (e.g. forms/{Calendar,RangeCalendar,Select,Combobox,DatePicker,RadioGroup,Input,Textarea,Switch,Checkbox,Slider,NumberInput,OTPInput,FileInput,ColorInput}, atoms/{CountUp,Counter,StatusDot,Trend,HealthBadge,LangBadge,SeverityPill,TierBadge,OwnerPill,CopyChip,RelativeTime,Avatar,Sparkline,KbdRow,Empty}, primitives/{Tabs,Pagination,...}).
- Registry: ~125 installable items in packages/registry/registry.generated.json (one per real export). docs-only patterns are NOT in the registry.

FORGE INVARIANTS to keep in mind while proposing APIs: single ember accent #FF6B35 (≤2×/screen), dark ink on ember fills (contrast non-negotiable), Geist Sans+Mono, compose existing CSS classes (NEVER per-page <style>; promote shared CSS to packages/ui/styles/tokens.css), logical CSS props (RTL first-class), framework-agnostic React over a semantic CSS layer (no Tailwind utilities, no Radix in the component layer).
Authoritative refs: docs/DS-PAGE-STANDARD.md, src/ds/migrated/buttons.tsx (gold page), src/ds/migrated/pills.tsx (the "Pills & Chips" reference the user cites for a COMPLETE badge), .claude/craft/anti-ai-slop.md.
`

// ── Schemas ───────────────────────────────────────────────────────────────────
const DEEPDIVE = {
  type: 'object', additionalProperties: false,
  properties: {
    caseName: { type: 'string' },
    currentState: { type: 'string', description: 'What exists today across component/story/docs — concrete, cite files.' },
    fragmentation: { type: 'array', items: { type: 'string' }, description: 'The redundant or over-split pieces (separate components/stories that should fold into one).' },
    featureGap: { type: 'array', items: { type: 'string' }, description: 'Features present in the DS docs page but missing from the @eidos/ui component and/or Storybook.' },
    regressionDiagnosis: { type: 'string', description: 'Root cause of any bug/regression (e.g. Select chevron gone) with file:line. "" if N/A.' },
    proposedApi: {
      type: 'object', additionalProperties: false,
      properties: {
        name: { type: 'string' },
        summary: { type: 'string' },
        props: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { name: { type: 'string' }, type: { type: 'string' }, default: { type: 'string' }, note: { type: 'string' } }, required: ['name', 'type'] } },
      },
      required: ['name', 'props'],
    },
    foldsInto: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { from: { type: 'string' }, become: { type: 'string', enum: ['preset-export', 'example-only', 'delete', 'keep-alias'] }, how: { type: 'string' } }, required: ['from', 'become'] }, description: 'Each currently-separate component and what it should become.' },
    boundary: { type: 'string', description: 'For the Select case: the precise Select vs Combobox vs DropdownMenu contract. "" otherwise.' },
    storyPlan: { type: 'string' },
    docsPlan: { type: 'string' },
    migrationRisk: { type: 'string', description: 'Backward-compat / registry-consumer impact of the consolidation.' },
    openDecisions: { type: 'array', items: { type: 'string' }, description: 'Genuine judgment calls the human should decide.' },
  },
  required: ['caseName', 'currentState', 'fragmentation', 'featureGap', 'proposedApi', 'foldsInto', 'storyPlan', 'docsPlan', 'openDecisions'],
}

const COVERAGE = {
  type: 'object', additionalProperties: false,
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          docSlug: { type: 'string' },
          displayName: { type: 'string' },
          exportName: { type: 'string', description: 'The @eidos/ui export name, or "" if docs-only.' },
          isRealComponent: { type: 'boolean', description: 'True only if exported from @eidos/ui; false if it lives only as CSS + inline JSX in the docs page.' },
          family: { type: 'string', description: 'atoms|blocks|forms|overlays|primitives|navigation|feedback|data|disclosure|ai' },
          hasStory: { type: 'boolean' },
          storyTitle: { type: 'string' },
          hasRegistryItem: { type: 'boolean' },
          registryName: { type: 'string' },
          pageLocalStyle: { type: 'boolean', description: 'Does the docs page carry a <style> block / page-local CSS that would need promoting to tokens.css?' },
          intraDeps: { type: 'array', items: { type: 'string' } },
          npmDeps: { type: 'array', items: { type: 'string' } },
          classification: { type: 'string', enum: ['complete', 'story-only', 'promote-component', 'consolidate', 'foundation-skip'] },
          effort: { type: 'string', enum: ['S', 'M', 'L'] },
          notes: { type: 'string' },
        },
        required: ['docSlug', 'displayName', 'exportName', 'isRealComponent', 'family', 'hasStory', 'hasRegistryItem', 'classification', 'effort'],
      },
    },
  },
  required: ['items'],
}

// ── Phase 1 — Consolidation deep-dives (4 parallel) ─────────────────────────────
phase('Consolidation deep-dives')

const CASES = [
  {
    label: 'calendar',
    prompt: `CONSOLIDATION CASE: Calendar / RangeCalendar.
Read: packages/ui/src/calendar.tsx (Calendar, RangeCalendar, CalendarProps, RangeCalendarProps), src/ds/migrated/calendar.tsx (the canonical docs page — note EVERY feature it shows), src/ds/migrated/date-picker.tsx, and packages/ui/src/stories/forms/{Calendar,RangeCalendar,DatePicker}.stories.tsx.
The user wants ONE Calendar that covers all the features the docs page demonstrates (single + range + possibly multiple selection, min/max, disabled dates, month/year nav, footer, etc.), with RangeCalendar folded in (e.g. a mode/selectionMode prop). They feel the Storybook lost features. Diagnose what features the docs Calendar has that the component/stories lack, propose the unified Calendar API (a single export covering single|range|multiple), and decide what happens to RangeCalendar (delete / keep-alias / preset). DatePicker should compose the unified Calendar.`,
  },
  {
    label: 'badge',
    prompt: `CONSOLIDATION CASE: the Badge family — the BIG one.
Read: packages/ui/src/atoms.tsx (TierBadge, LangBadge, HealthBadge, SeverityPill, StatusDot, OwnerPill, CopyChip and any helper maps), and the docs pages src/ds/migrated/{badges.tsx, pills.tsx, severity.tsx, status.tsx, status-dot.tsx, trend.tsx} — pills.tsx is the "Pills & Chips" page the user cites as the COMPLETE reference. Also grep tokens.css/ds.css for the badge/pill/chip class system (.badge / .pill / .chip / .tag etc.).
The user wants a SINGLE polymorphic Badge component that can express every variant: pill vs chip shape, with/without border, with/without leading status dot, with/without live pulsing dot, with/without leading/trailing icon, rounded vs squared corners, the full tone/color set, filter-chip (selectable) and removable/dismissible chip, all sizes. Then LangBadge, SeverityPill, TierBadge, HealthBadge, OwnerPill (and StatusDot where it's really a badge) become USAGE EXAMPLES / thin presets of Badge — "applications", not separate components.
Design the canonical Badge API (every axis as a prop), and for each existing specialized atom decide: preset-export (thin wrapper re-exporting Badge with fixed props), example-only (just a documented recipe, export removed), keep-alias, or delete. Note registry/consumer impact. Determine whether StatusDot stays its own primitive (a bare dot) or becomes a Badge mode.`,
  },
  {
    label: 'counter',
    prompt: `CONSOLIDATION CASE: Counter / CountUp.
Read: packages/ui/src/atoms.tsx (Counter and the line "const CountUp = Counter"), src/ds/migrated/count-up.tsx (docs page), and packages/ui/src/stories/atoms/{Counter,CountUp}.stories.tsx. CountUp is literally an alias of Counter yet both have stories. The user wants ONE component and ONE story, and confirms the docs page should exist (count-up.tsx). Decide the canonical name (Counter vs CountUp), what happens to the other (keep-alias for compat vs delete), the single story plan, and the single docs page (rename/redirect if needed). Check there isn't a second redundant "Stat"-style number animator.`,
  },
  {
    label: 'select',
    prompt: `CONSOLIDATION CASE: Select vs Combobox vs Dropdown.
Read: packages/ui/src/forms.tsx (Select, SelectProps, SelectOption), packages/ui/src/combobox.tsx (Combobox, ComboboxOption, ComboboxGroup, ComboboxProps), the docs pages src/ds/migrated/{select.tsx, combobox.tsx, menu.tsx}, and packages/ui/src/stories/forms/{Select,Combobox}.stories.tsx. Grep tokens.css/ds.css for the select/combobox/menu class systems.
KNOWN BUG: Select used to render two chevrons, a fix removed BOTH so now it has none, and its behavior diverged from the DS docs. Find the root cause with file:line (look for appearance:none + background chevron vs a rendered <Icons.chevronDown/>, and a duplicate).
The user wants a proper Select with: optional leading icon, status (error/disabled/etc.) + sizes, the expanded menu shows the currently-selected item, optional search/typeahead, grouped items, and RTL — matching the current DS select docs. Combobox additionally supports multi-select and free-text filtering. Dropdown menu (menu.tsx) is actions/commands, not value selection.
Diagnose the regression, list Select's feature gaps vs its docs page, propose the corrected Select API, and write the precise Select vs Combobox vs DropdownMenu boundary so the three stop overlapping.`,
  },
]

const deepdives = await parallel(CASES.map(c => () => agent(
  `Repo: ${REPO}. Read-only DEEP-DIVE to plan a consolidation. Make NO edits.
${GROUND}

${c.prompt}

Return the structured deep-dive. Be concrete and cite file:line. Propose a real API (named props with types/defaults). Flag only GENUINE judgment calls in openDecisions (don't pad).`,
  { label: `dive:${c.label}`, phase: 'Consolidation deep-dives', agentType: 'design-system-engineer', schema: DEEPDIVE },
)))

// ── Phase 2 — Coverage matrix (5 parallel shards over the component universe) ────
phase('Coverage matrix')

const SHARDS = [
  { label: 'forms', slugs: ['input', 'textarea', 'select', 'combobox', 'checkbox', 'switch', 'radio', 'slider', 'number-input', 'otp-input', 'file-input', 'date-picker', 'calendar', 'color-input', 'tag-input', 'input-group', 'label'] },
  { label: 'overlays', slugs: ['modal', 'alert-dialog', 'drawer', 'sidesheet', 'popover', 'hover-card', 'tooltips', 'notification', 'command', 'menu', 'menubar'] },
  { label: 'navigation', slugs: ['tabs', 'breadcrumb', 'navigation', 'sidebar', 'toolbar', 'button-group', 'separator', 'resizable', 'scroll-area', 'aspect-ratio', 'pagination', 'accordion', 'collapsible', 'carousel'] },
  { label: 'feedback', slugs: ['alerts', 'banner', 'progress', 'skeleton', 'spinner', 'status-dot', 'status', 'trend', 'badges', 'pills', 'severity', 'kbd', 'empty', 'avatars', 'copy-chip', 'relative-time', 'toggle', 'toggle-group'] },
  { label: 'data', slugs: ['table', 'card', 'count-up'] },
]

const coverageShards = await parallel(SHARDS.map(s => () => agent(
  `Repo: ${REPO}. Read-only COVERAGE-MATRIX audit. Make NO edits.
${GROUND}

For EACH of these docs slugs, inspect src/ds/migrated/<slug>.tsx (header/lede + the components it renders) and determine the true state across surfaces:
SLUGS: ${JSON.stringify(s.slugs)}

For each, decide:
- isRealComponent: is there a matching @eidos/ui EXPORT (verify via grep of packages/ui/src/index.ts barrel + the source files)? If the docs page only renders raw HTML + CSS classes (no imported Forge component), it is docs-only → isRealComponent:false.
- hasStory: is there packages/ui/src/stories/**/<Comp>.stories.tsx? (give the title if so)
- hasRegistryItem: is <kebab> in packages/registry/registry.generated.json?
- pageLocalStyle: does the docs page contain a <style> block / rely on page-local CSS that would need promoting to packages/ui/styles/tokens.css before it can install styled?
- intraDeps / npmDeps for when it becomes a real component.
- classification:
    complete            = real component + story + registry, in good shape
    story-only          = real component + registry exist, just missing/short a Storybook story
    promote-component   = docs-only today; must be built as a real @eidos/ui component (then story+registry)
    consolidate         = should fold into another component (note which in notes) — e.g. range-calendar→calendar, count-up→counter, lang-badge/severity-pill/tier-badge/health-badge→badge
    foundation-skip     = not a component (a foundation/guide page) — skip
- effort: S (story only / trivial), M (promote a simple CSS-class component), L (promote a stateful/overlay component — modal, popover, command palette, accordion, sidebar, carousel, table, resizable).

Be accurate about isRealComponent — that is the single most important field (it decides "write a story" vs "build the component first"). Return the structured items array (one entry per slug).`,
  { label: `cover:${s.label}`, phase: 'Coverage matrix', agentType: 'design-system-engineer', schema: COVERAGE },
)))

const allItems = coverageShards.filter(Boolean).flatMap(r => r.items || [])

// ── Phase 3 — Completeness critic ───────────────────────────────────────────────
phase('Critique')
const critic = await agent(
  `Repo: ${REPO}. You are a COMPLETENESS + CONSISTENCY critic for a Forge DS consolidation audit. Read-only.
${GROUND}

Here is the assembled audit:
DEEP-DIVES (4 consolidation cases): ${JSON.stringify(deepdives.filter(Boolean))}
COVERAGE MATRIX (${allItems.length} items): ${JSON.stringify(allItems)}

The user's explicit asks were: (1) fold RangeCalendar into Calendar (restore lost features); (2) one polymorphic Badge that subsumes LangBadge/SeverityPill/TierBadge/HealthBadge etc. as examples (per the Pills & Chips page); (3) merge CountUp+Counter into one + ensure its docs page; (4) fix Select (no chevron now) and define Select vs Combobox vs Dropdown; (5) this Storybook "missing components" list — verify EACH appears in the matrix with a sane classification: Label, AI Label, Button Group, Tabs, Date Picker, Radio/RadioGroup, Tag input, Toolbar, Accordion, Breadcrumb (multiple separators), Navigation menu, Resizable, Scroll Area, Separator, Sidebar, Alert dialog, Modal, Command palette, Dropdown menu, Cards, Hover Card, Menu bar, Popover, Tooltip, Alert, Banner, Notification, Progress, Skeleton, Spinner, Dot status, Trend, Aspect ratio, Carousel, Table, Collapsible, Toggle/Toggle group.

DO: spot-check 4-5 isRealComponent / hasStory / classification calls against disk (grep) and report any you believe are WRONG with the correct value + evidence. List any user-requested component MISSING from the matrix. Flag any contradictions between the deep-dives and the matrix (e.g. matrix says badge complete but deep-dive says consolidate). Surface the cross-cutting open decisions the human must make before execution. Keep it tight and evidence-backed.`,
  { label: 'critic', phase: 'Critique', agentType: 'code-reviewer' },
)

// ── tallies ─────────────────────────────────────────────────────────────────────
const byClass = {}
for (const it of allItems) byClass[it.classification] = (byClass[it.classification] || 0) + 1

return {
  deepdives: deepdives.filter(Boolean),
  coverage: allItems,
  tally: byClass,
  critic,
}
