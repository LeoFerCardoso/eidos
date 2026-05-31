export const meta = {
  name: 'capstone-audit',
  description: 'Final adversarial audit over the integrated Forge DS component catalog (all consolidated + promoted components) plus a full deterministic gate. Read-only reviewers return CONFIRMED P0s only (contrast incl. ember-soft nuance, a11y/ARIA-id-resolution/keyboard/focus, RTL logical-props/mirroring, docs-accuracy, leftover <style>, off-scale fonts). One integrity agent runs the whole build gate + cross-component consistency. Produces the final punch list — makes NO edits.',
  whenToUse: 'Phase 6 capstone — confirm the whole DS is coherent and catch cross-cutting issues.',
  phases: [{ title: 'Final audit' }, { title: 'Integrity' }],
}

const REPO = '/Users/leocardoso/Projects/forge-ds'

const RUBRIC = `
You are doing a FINAL adversarial DS review. Repo: ${REPO}. Read the component source (packages/ui/src/<file>.tsx), its docs page (src/ds/migrated/<slug>.tsx), and the promoted CSS in packages/ui/styles/{tokens,ds}.css. Be adversarial — assume a defect exists and find it — but report ONLY CONFIRMED P0s (cite file:line; if you can't cite it, don't report it). Categories to hunt:
- CONTRAST: fg on a colored/elevated surface must use a THEME-AWARE token. On a SOLID ember fill → var(--ember-fg) (dark-ink, theme-aware); on an ember-SOFT tint (--ember-soft / .pill.ember / .chip.ember) → var(--ember-text) (NOT dark ink = invisible, NOT plain --ember = fails AA). No hardcoded hex for fg-on-accent. Flag any literal #08090A / #FF6B35 used as a foreground on a tint.
- A11y: aria-controls/labelledby/activedescendant must point at ids that RESOLVE; dialogs trap+restore focus + lock scroll + isolate AT; menus use roving tabindex + type-ahead; disabled items are skipped by keyboard nav; focus-visible rings present.
- RTL: logical CSS props only (no physical left/right/padding shorthand that should be inline); directional glyphs (chevrons/arrows in nav) mirror, non-directional carets/trend-arrows do not.
- DOCS-ACCURACY: the docs page must not claim a keyboard/focus/RTL/a11y/motion behavior the component lacks (incl. "global reduced-motion guard" — there is none; guards are component-scoped). Code and docs must agree.
- HYGIENE: NO leftover <style>{ block in a COMPONENT docs page; no off-scale (x.5px) font-size; no emoji-as-icon; ember ≤2×/rendered frame. (Note: meta="hello world" for Usage and "package managers" for Installation are CORRECT conventions — do NOT flag them.)
Return confirmed P0s only.`

const FINDINGS = {
  type: 'object', additionalProperties: false,
  properties: {
    group: { type: 'string' },
    confirmedP0s: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          component: { type: 'string' },
          category: { type: 'string', enum: ['contrast', 'a11y', 'rtl', 'docs-accuracy', 'hygiene'] },
          file: { type: 'string' },
          line: { type: 'string' },
          issue: { type: 'string' },
          fix: { type: 'string', description: 'The smallest correct fix.' },
        },
        required: ['component', 'category', 'file', 'issue', 'fix'],
      },
    },
    clean: { type: 'array', items: { type: 'string' }, description: 'Components you verified clean.' },
  },
  required: ['group', 'confirmedP0s', 'clean'],
}

phase('Final audit')
const GROUPS = [
  { key: 'overlays', list: 'modal, alert-dialog, popover, tooltip, hover-card, menu(DropdownMenu), menubar, command, notification(Toaster)' },
  { key: 'structure-nav', list: 'separator, aspect-ratio, scroll-area, button-group, breadcrumb, toolbar, navigation(NavigationMenu), sidebar, resizable, tabs' },
  { key: 'disclosure-data', list: 'accordion, collapsible, carousel, table, card' },
  { key: 'feedback-forms', list: 'alert, progress, spinner, toggle, toggle-group, label, input-group, tag-input, skeleton' },
  { key: 'consolidations', list: 'badge(Pill/Chip/Badge), calendar(+RangeCalendar alias), count-up(CountUp/Counter), select(+NativeSelect), combobox — and confirm the Tier/Lang/Severity/Health presets compose the trio correctly' },
]
const findings = await parallel(GROUPS.map(g => () => agent(
  `${RUBRIC}

GROUP: ${g.key}. Components: ${g.list}.
Review EACH component across its three surfaces. Return the structured findings (confirmed P0s + the list you verified clean).`,
  { label: `audit:${g.key}`, phase: 'Final audit', agentType: 'ux-designer', schema: FINDINGS },
)))

phase('Integrity')
const integrity = await agent(
  `Repo: ${REPO}. FINAL INTEGRITY GATE (read + run; you MAY run build commands but do not edit source). Report a structured pass/fail.
Run and confirm green (cat logs / ls artifacts — never trust silent success):
1. node scripts/gen-props.mjs ; npm run ui:typecheck (0 errors)
2. npm run registry:build (report the item count; confirm no duplicate names; spot-check that pill/chip/badge/modal/popover/dropdown-menu/command/toaster/accordion/carousel/table/card/alert/progress/spinner/toggle/toggle-group/label/input-group/tag-input/skeleton/tabs/calendar/select/native-select/combobox all resolve)
3. npm run cli:test && npm run cli:test:full (BOTH ALL_PASS)
4. npm run sb:build (all story groups compile)
5. npm run build (Compiled successfully, 247+ routes, .next/BUILD_ID present)
6. npm run verify (routes render clean)
Also CHECK cross-component consistency and report any issue: (a) value components consistently use onValueChange (Select/Combobox/Calendar/Tabs/ToggleGroup/Accordion); (b) every new component is in the barrel + extract-registry FAMILIES + has a registry item + a story + a docs page + props.generated rows; (c) no two barrel exports collide; (d) grep packages/ui/styles for any remaining x.5px font-size (should be zero); (e) list any src/ds/migrated COMPONENT page (not foundation) that still has a real <style>{ block.
Return a structured verdict: { pass:boolean, checks:[{name,ok,detail}], registryCount, consistencyIssues:[...] }.`,
  { label: 'integrity', phase: 'Integrity', agentType: 'design-system-engineer',
    schema: { type: 'object', additionalProperties: false, properties: {
      pass: { type: 'boolean' },
      checks: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { name: { type: 'string' }, ok: { type: 'boolean' }, detail: { type: 'string' } }, required: ['name', 'ok'] } },
      registryCount: { type: 'number' },
      consistencyIssues: { type: 'array', items: { type: 'string' } },
    }, required: ['pass', 'checks', 'consistencyIssues'] } },
)

const allP0s = findings.filter(Boolean).flatMap(f => f.confirmedP0s || [])
return { findings: findings.filter(Boolean), totalP0s: allP0s.length, p0s: allP0s, integrity }
