export const meta = {
  name: 'forge-ai-audit',
  description: 'Full AI Audit of Forge (IDP portal) pages: product-sense, DS-compliance, UX+motion, info-hierarchy and runtime gates — per page, with a ranked P0/P1/P2 punch-list. Pass args={pages:[{name,route,file}]} or run on the default portal pages.',
  phases: [
    { title: 'Audit', detail: 'parallel lenses per page (read-only)' },
    { title: 'Synthesize', detail: 'merge into a ranked punch-list per page' },
  ],
}

// Pages to audit — override via args.pages.
const DEFAULT_PAGES = [
  { name: 'Home', route: '/portal', file: 'app/portal/page.tsx' },
  { name: 'Catalog', route: '/portal/catalog', file: 'app/portal/catalog/page.tsx' },
  { name: 'Service detail', route: '/portal/catalog/acerta-api', file: 'app/portal/catalog/[service]/page.tsx' },
  { name: 'Templates', route: '/portal/create', file: 'app/portal/create/page.tsx' },
  { name: 'Forge AI', route: '/portal/assistant', file: 'app/portal/assistant/page.tsx' },
]

const pages = Array.isArray(args?.pages) && args.pages.length ? args.pages : DEFAULT_PAGES

const CONTEXT = [
  'You are auditing a page of "Forge" — the AI-native IDP portal (app/portal/**) built on the Eidos Design System.',
  'The product model you MUST judge against is `.claude/craft/idp-product.md` (read it first). Forge is an',
  'Agentic Engineering Platform, not a 2015 service catalog. The matching example screens in src/ds/examples/**',
  'are the proven visual language to reuse (~80%). READ-ONLY — do NOT edit any file.',
].join('\n')

const FINDINGS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lens', 'verdict', 'items'],
  properties: {
    lens: { type: 'string' },
    verdict: { type: 'string', enum: ['pass', 'concerns', 'fail'] },
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['severity', 'issue', 'where', 'fix'],
        properties: {
          severity: { type: 'string', enum: ['P0', 'P1', 'P2'] },
          issue: { type: 'string' },
          where: { type: 'string', description: 'file:line or component/region' },
          fix: { type: 'string', description: 'the smallest concrete fix' },
        },
      },
    },
  },
}

const LENSES = [
  {
    key: 'product',
    agent: 'design-system-engineer',
    focus:
      'IDP PRODUCT-SENSE per idp-product.md. Does the page declare/serve an explicit persona (SWE / SRE / Tech Manager) and answer ONE clear question? Is it on the right pillar, with the correct entity model and information hierarchy? Flag anti-patterns: platform decisions pushed onto the developer (esp. the scaffolder), any component/section with no job, metrics dumped where they do not belong, AI as a bolted-on chatbox instead of an in-context agentic action, untrusted/lorem/invented data. Is it genuinely AI-native (agentic), or a generic catalog?',
  },
  {
    key: 'ds',
    agent: 'design-system-engineer',
    focus:
      'DS-COMPLIANCE (MANDATORY — composing only the Eidos DS). Flag: native <select>/<input>/<textarea> used raw where a DS component exists, raw className="pill"/"chip"/badge spans instead of the DS Pill/Chip/Badge, per-page <style>, hand-rolled components that duplicate an existing DS component (Tabs, Switch, Checkbox, RadioCardGroup, DataTable, etc.), and off-token magic numbers where a token exists. Cross-check available components against the inventory in packages/ui/src/**.',
  },
  {
    key: 'ux',
    agent: 'ux-designer',
    focus:
      'UX + MOTION + HIERARCHY. Visual hierarchy, rhythm, spacing, the single ember accent (<=2x/screen), state coverage (loading/empty/error), a11y (focus/labels/contrast) and RTL. MOTION per animation-discipline.md: is there disciplined ENTRANCE / page-open motion (.page-enter, staggered reveal via --dur-stagger, sheet/container morphs) where it earns its place? Any gratuitous/decorative motion? Is prefers-reduced-motion honored? Name the ONE distinctive move that gives the page Eidos soul — or flag its absence.',
  },
]

// ── Phase 1+2: per page, run lenses in parallel, then synthesize ──────────────
phase('Audit')
const results = await pipeline(
  pages,
  // stage 1 — fan out the lenses for this page
  async (page) => {
    const lensFindings = await parallel(
      LENSES.map((l) => () =>
        agent(
          CONTEXT +
            '\n\nPAGE: ' + page.name + ' (route ' + page.route + ', file ' + page.file + ')' +
            '\nLENS: ' + l.key + '\nFOCUS: ' + l.focus +
            '\n\nRead ' + page.file + ', `.claude/craft/idp-product.md`, and the matching example in src/ds/examples/** for comparison. Return findings for THIS lens only.',
          { label: l.key + ':' + page.name, phase: 'Audit', agentType: l.agent, schema: FINDINGS_SCHEMA },
        ),
      ),
    )
    return { page, lensFindings: lensFindings.filter(Boolean) }
  },
  // stage 2 — synthesize a ranked punch-list for this page
  async (r) => {
    if (!r) return null
    const block = r.lensFindings
      .map((f) => '### ' + f.lens + ' — ' + f.verdict + '\n' + f.items.map((i) => `- [${i.severity}] ${i.issue} (${i.where}) → ${i.fix}`).join('\n'))
      .join('\n\n')
    const synthesis = await agent(
      CONTEXT +
        '\n\nPAGE: ' + r.page.name + '\n\nLens findings:\n' + block +
        '\n\nSynthesize ONE ranked punch-list for this page: dedupe, order P0 → P1 → P2, and for each give the single smallest concrete fix. Lead with a one-line verdict (ship / fix-first / rethink). Be terse and concrete; no praise, no preamble.',
      { label: 'synth:' + r.page.name, phase: 'Synthesize', agentType: 'design-system-engineer' },
    )
    return { page: r.page.name, route: r.page.route, punchList: synthesis }
  },
)

return { audited: pages.length, results: results.filter(Boolean) }
