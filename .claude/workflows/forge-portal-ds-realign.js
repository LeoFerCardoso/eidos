export const meta = {
  name: 'forge-portal-ds-realign',
  description: 'Critique the Forge IDP portal against the Eidos DS, then realign it to 100% (collapsible sidebar, DS-only components, English, uniform spacing, hydration fix, no tier, pagination, richer detail with tab-bar-below-header)',
  phases: [
    { title: 'Critique', detail: 'parallel dimension reviewers audit the portal vs the DS' },
    { title: 'Spec', detail: 'consolidate findings into one authoritative remediation spec' },
    { title: 'Shell', detail: 'rebuild portal-shell: DS Sidebar + workspace + next-themes' },
    { title: 'Surfaces', detail: 'realign data, catalog, detail in parallel' },
    { title: 'Verify', detail: 'build + screenshots + adversarial 100%-alignment critique' },
  ],
}

const FILES = {
  shell: 'src/portal/shell/portal-shell.tsx',
  data: 'src/portal/data/services.ts',
  catalog: 'app/portal/catalog/page.tsx',
  detail: 'app/portal/catalog/[service]/page.tsx',
  layout: 'app/portal/layout.tsx',
}

const CONTEXT = [
  'You are realigning "Forge" — the IDP portal product under app/portal/** — built on the "Eidos" Design System.',
  'NAMING (strict): Design System = Eidos; product/portal = Forge; AI copilot = "Forge AI" ("Ask Forge AI", never "Ask Eidos"). Links back to the DS go to "/".',
  'DOMAIN: Equifax Boa Vista, a credit bureau (risk score, credit reports, anti-fraud). Internal services live in src/portal/data/services.ts.',
  '',
  'THE 9 HARD REQUIREMENTS (the bar is 100% — all must be satisfied):',
  '1. EVERYTHING in English — every UI string/label/placeholder. No Portuguese anywhere in the rendered UI.',
  '2. Use ONLY Eidos DS components for every UI element. NO native <select>, NO raw className="pill ..." spans, NO hand-rolled tabs. Use the DS Select/Combobox, Pill/Chip, Tabs, Sidebar, Badge, etc.',
  '3. Pages must breathe with UNIFORM spacing: the breadcrumb-to-header gap and the header-to-body gap must be identical on every page. Define ONE spacing contract and apply it on every page.',
  '4. A real left SIDEBAR (the DS Sidebar component), OPEN by default and COLLAPSIBLE. The collapse/expand toggle sits at the START of the breadcrumb (in the topbar). The breadcrumb area must NOT contain a "Design System" back button.',
  '5. NO framework errors. Fix the Next.js hydration mismatch: the ad-hoc useTheme in src/ds/examples/example-shell.tsx reads localStorage/document during render. Switch the portal to next-themes (already mounted in app/layout.tsx via ThemeProvider) with a mounted-guard so SSR and client agree.',
  '6. The sidebar HEADER is the workspace switcher = "Equifax Brasil". When collapsed, show ONLY the workspace avatar with its initials.',
  '7. Add MANY more example services (enough to require pagination, ~28-32) and add PAGINATION to the catalog.',
  '8. Port the RICHER /example service detail (src/ds/examples/service-detail.tsx) into the portal detail page. Directly BELOW the header must be the TAB BAR (not the KPI/score cards). The KPI/score cards move INSIDE a tab.',
  '9. There is NO "Tier" concept at the company — REMOVE tier (T1/T2/T3) from the data and from every page.',
  '',
  'DS APIs (read the real signatures in packages/ui/src before using): Sidebar (collapsible="icon"|"offcanvas"|"none"; controlled via open/onOpenChange or uncontrolled defaultOpen; compose SidebarSection, SidebarItem(badge?), SidebarFooter). Select (options:{value,label}[], value, onValueChange). Combobox (options, value, onValueChange, searchable/multiple). Pill/Chip (tone-based, from packages/ui/src/badge.tsx). Tabs (from @/ds/core). The reusable layout helpers FPageHeader/FSection/FKpi/IconBubble currently come from src/ds/examples/example-shell.tsx.',
  '',
  'INVARIANTS: contrast is non-negotiable (dark ink on ember fills, never ember-on-ember); single ember accent at most ~2x per screen; Geist Sans + Geist Mono; logical CSS (RTL-first); NEVER write per-page <style> — compose existing .fp-*/ds.css classes or extend src/styles/*.css.',
].join('\n')

// ── Phase 1: Critique (parallel, read-only) ──────────────────────────────────
phase('Critique')
const DIMENSIONS = [
  { key: 'ds-parity', focus: 'Component parity. Find EVERY place the portal uses a native element or raw CSS class instead of the canonical Eidos DS component (native <select>, raw .pill/.chip spans, hand-rolled rail/tabs/badges). Map each to the correct DS component with its real import path + props.' },
  { key: 'spacing', focus: 'Spacing & rhythm. Find inconsistent gaps and cramped sections; confirm breadcrumb-to-header and header-to-body are NOT uniform today. Propose ONE spacing contract (exact token values) and list every spot it must apply.' },
  { key: 'i18n', focus: 'Language. List EVERY Portuguese string in the portal UI (shell + catalog + detail + data summaries/labels) with its exact English replacement.' },
  { key: 'framework', focus: 'Next.js correctness. Pinpoint the hydration mismatch source and any other framework errors (theme state read on render, SSR/client parity, redirect, useParams). Give the precise fix using next-themes with a mounted guard.' },
  { key: 'detail-gap', focus: 'Compare app/portal/catalog/[service]/page.tsx against the richer src/ds/examples/service-detail.tsx. Identify exactly what to port, and how to (a) put the TAB BAR directly below the header and (b) move the KPI/score cards INSIDE a tab. List which content belongs in which tab.' },
]
const findings = await parallel(DIMENSIONS.map((d) => () =>
  agent(
    CONTEXT + '\n\nDIMENSION: ' + d.key + '\nFOCUS: ' + d.focus + '\n\nRead the portal files (' + Object.values(FILES).join(', ') + '), the relevant DS components under packages/ui/src, and src/ds/examples/service-detail.tsx + example-shell.tsx as needed. Return a precise, file-cited findings list for THIS dimension ONLY: each finding = { file, current snippet, problem, exact fix including the DS import + props }. READ-ONLY — do NOT edit any file.',
    { label: 'critique:' + d.key, phase: 'Critique', agentType: 'design-system-engineer' },
  ),
))

// ── Phase 2: Spec (consolidate) ──────────────────────────────────────────────
phase('Spec')
const findingsBlock = findings
  .map((f, i) => '### ' + DIMENSIONS[i].key + '\n' + (f || '(no findings returned)'))
  .join('\n\n')
const spec = await agent(
  CONTEXT + '\n\nThe dimension reviewers reported:\n\n' + findingsBlock +
  '\n\nProduce ONE authoritative, self-contained remediation SPEC the implementers will follow verbatim. Include, concretely:\n' +
  '(a) ENGLISH GLOSSARY: a PT→EN table for every UI string.\n' +
  '(b) SPACING CONTRACT: exact values for breadcrumb→header, header→body, section gaps, grid gaps — uniform across all pages; say which class/wrapper carries each.\n' +
  '(c) SHELL ARCHITECTURE: how portal-shell.tsx is rebuilt — DS Sidebar (collapsible="icon", OPEN by default, controlled open state lifted to the shell); workspace header "Equifax Brasil" (collapsed = avatar initials ONLY); topbar with the collapse toggle at the START of the breadcrumb and NO Design-System back button in the breadcrumb; the EXACT export contract portal-shell.tsx must expose (FPageHeader/FKpi/IconBubble or replacements) so catalog & detail keep importing cleanly.\n' +
  '(d) HYDRATION FIX: the exact next-themes mounted-guard pattern to use.\n' +
  '(e) COMPONENT MAP: a table mapping each native/raw usage → the DS component + import + props (cite the real signatures from packages/ui/src).\n' +
  '(f) DETAIL-PAGE PLAN: tab bar directly below header; the exact tab set and what content each holds (e.g. Overview, a Health/Metrics tab holding the KPI/score cards, Dependencies, API, Activity timeline ported from the example); how the "Forge AI" explain panel fits.\n' +
  '(g) DATA PLAN: remove tier entirely; target ~30 English-named credit-bureau services across the tribes; catalog pagination UX (page size, control).\n' +
  'Be exhaustive and unambiguous — downstream agents will not re-derive decisions.',
  { label: 'spec', phase: 'Spec', agentType: 'design-system-engineer' },
)

// ── Phase 3: Shell (sequential — establishes the import contract) ─────────────
phase('Shell')
const shellResult = await agent(
  CONTEXT + '\n\nAUTHORITATIVE SPEC:\n' + spec +
  '\n\nIMPLEMENT THE SHELL NOW. Rewrite ' + FILES.shell + ' (and ' + FILES.layout + ' if needed) per the spec: DS Sidebar (open by default, collapsible="icon", controlled open state in the shell), workspace header "Equifax Brasil" (collapsed = avatar initials only), topbar whose breadcrumb STARTS with the collapse/expand toggle and has NO Design-System back button, next-themes for theme (fixing the hydration mismatch with a mounted guard), English copy, and the uniform spacing contract. Keep/define the EXACT export contract the spec specifies (so catalog & detail import cleanly). Read the real DS Sidebar/Select/Pill signatures in packages/ui/src first. Compose ONLY Eidos DS + existing .fp-*/ds.css classes; if a class is genuinely missing, extend src/styles/example-shell.css (never per-page <style>). Edit only the shell (+layout +css). Return the FINAL export contract of portal-shell.tsx (every exported name + its signature) and any CSS you added.',
  { label: 'shell', phase: 'Shell', agentType: 'frontend-engineer' },
)

// ── Phase 4: Surfaces (parallel — disjoint files, against the stable contract) ─
phase('Surfaces')
const SURFACES = [
  { key: 'data', file: FILES.data, task: 'Rewrite the domain data: REMOVE the tier field entirely from the type and every record. Expand to ~30 realistic Equifax/Boa Vista credit-bureau services with ENGLISH summaries (keep ids like acerta-api, score-engine, scpc-gateway, konduto-antifraud, identity-proofing, decision-engine, ignite-feature-store, consent-service, cadastro-positivo-ingestor, bureau-ingestion, recovery-comms, onescore-api, and add ~18 more plausible ones spread across the tribes). Keep FLAGSHIP_ID=acerta-api and keep it degraded. Keep the PortalService type coherent and exported.' },
  { key: 'catalog', file: FILES.catalog, task: 'Rewrite the catalog in English: replace the native <select> tribe filter with the DS Select (or Combobox); replace the raw .pill saved-view spans with DS Pill/Chip; remove every tier column/badge; add PAGINATION (~9-12 per page) built from DS components; apply the spec spacing contract; cards/rows navigate to /portal/catalog/[id]. Import the shell helpers per the new contract.' },
  { key: 'detail', file: FILES.detail, task: 'Rewrite the service detail by PORTING the richer src/ds/examples/service-detail.tsx composition into the portal (English, DS components only). The TAB BAR sits DIRECTLY below the header; the KPI/score cards move INSIDE a tab (e.g. a Health/Overview tab); add Dependencies, API, and an Activity (Timeline) tab mirroring the example. Remove tier everywhere. Keep the "Forge AI" explain panel for the degraded flagship, placed sensibly (e.g. a banner under the header or inside the Health tab). Use DS Tabs/Pill/Badge/etc.' },
]
await parallel(SURFACES.map((s) => () =>
  agent(
    CONTEXT + '\n\nAUTHORITATIVE SPEC:\n' + spec + '\n\nNEW SHELL EXPORT CONTRACT:\n' + shellResult +
    '\n\nYOUR FILE: ' + s.file + '\nTASK: ' + s.task +
    '\n\nRead the CURRENT file, the spec, the relevant DS signatures in packages/ui/src, and (for the detail surface) src/ds/examples/service-detail.tsx. Edit ONLY ' + s.file + '. Compose ONLY Eidos DS components — no native form controls, no raw .pill/.chip spans, no per-page <style>. English only. No tier. Return a short summary of what changed.',
    { label: 'build:' + s.key, phase: 'Surfaces', agentType: 'design-system-engineer' },
  ),
))

// ── Phase 5: Verify (build + shots) then adversarial 100% critique ───────────
phase('Verify')
const verify = await agent(
  CONTEXT + '\n\nRUN THE GATE.\n1) Run "npm run build" and FIX any TypeScript/build errors in app/portal/** and src/portal/** until it passes cleanly (you may edit those files; common breakage: leftover references to the removed tier field, or stale shell imports).\n2) The dev server is already running on http://localhost:3000. Capture screenshots: run "node scripts/shot.mjs /portal/catalog dark /tmp/forge2-catalog.png" and "node scripts/shot.mjs /portal/catalog/acerta-api dark /tmp/forge2-detail.png". Also curl the routes and report status codes.\nReturn: build PASS/FAIL (with the final error if any), the route status codes, and the screenshot paths.',
  { label: 'verify', phase: 'Verify', agentType: 'frontend-engineer' },
)
const critique = await agent(
  CONTEXT + '\n\nVERIFY RESULT:\n' + verify +
  '\n\nADVERSARIAL DS-ALIGNMENT CRITIQUE. Re-read the final portal files (' + Object.values(FILES).join(', ') + ') and judge EACH of the 9 hard requirements as PASS or FAIL with file-cited evidence. Be strict — the bar is 100%: English-only, DS-only components (no native <select>, no raw .pill spans), uniform spacing, working collapsible sidebar with the toggle at the breadcrumb start and no DS back button, workspace header "Equifax Brasil" (collapsed=initials), next-themes (no hydration mismatch), NO tier anywhere, catalog pagination present, detail with the tab bar directly below the header and score cards inside a tab. Return a PASS/FAIL table for the 9 requirements + a residual punch list (file + exact remaining fix) for anything not yet 100%. READ-ONLY.',
  { label: 'critique:final', phase: 'Verify', agentType: 'design-system-engineer' },
)

return { spec, shellResult, verify, critique }
