// extract-registry.mjs — slice the family-grouped @eidos/ui source into ONE
// self-contained file per component, for shadcn-style per-component install.
//
// For each public component C in its family file, we compute the reachability
// closure of top-level declarations C uses, INLINING private helpers/types/
// internal sub-components, and treating references to OTHER public components
// (Trend, Sparkline, Icons, …) as a BOUNDARY → an alias import
// `@/components/forge/<kebab>` + a registryDependency. External libs
// (react / recharts / react-dom) are re-imported as needed. The single
// `MOCKS.LANGS` use (LangBadge) is inlined as a literal.
//
//   node scripts/extract-registry.mjs
//     → writes packages/registry/src/forge/<kebab>.tsx  (one per component)
//     → writes packages/registry/registry.generated.json (catalog + deps)
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const ts = createRequire(import.meta.url)('typescript');

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const UI = join(ROOT, 'packages/ui/src');
const OUT = join(ROOT, 'packages/registry/src/forge');

// ── Curated installable component set (real components, not helper exports) ──
// name → { family file, npm deps }. Sub-component/helpers excluded; they inline.
const FAMILIES = {
  'icons.tsx':       { only: ['Icons', 'ForgeMark'] },
  'badge.tsx':       { only: ['Pill', 'Chip', 'Badge'] },
  'atoms.tsx':       { only: ['Sparkline', 'Counter', 'CountUp', 'Avatar', 'TierBadge', 'LangBadge', 'Empty', 'StatusDot', 'Trend', 'HealthBadge', 'SeverityPill', 'Kbd', 'KbdRow', 'CopyChip', 'RelativeTime', 'OwnerPill'] },
  'primitives.tsx':  { only: ['CopyButton', 'Code', 'CodeBlock', 'CodeTree', 'TabbedCode', 'CollapsibleCode', 'Frame', 'PropsTable', 'SubHead', 'Lede', 'Mono', 'TokenSwatch', 'SpecRow', 'Pagination', 'SimplePagination'] },
  'tabs.tsx':        { only: ['Tabs'] },
  'forms.tsx':       { only: ['Input', 'Textarea', 'NativeSelect', 'SelectNative', 'Checkbox', 'Switch', 'RadioGroup', 'Slider', 'NumberInput', 'OTPInput', 'FileInput', 'DateInput'] },
  'date-picker.tsx': { only: ['DatePicker'] },
  'select.tsx':      { only: ['Select'] },
  'calendar.tsx':    { only: ['Calendar', 'RangeCalendar', 'DateRange', 'CalendarProps', 'RangeCalendarProps', 'startOfMonth', 'sameDay', 'isoDate', 'monthGrid', 'monthLabel'] },
  'combobox.tsx':    { only: ['Combobox'] },
  'color-input.tsx': { only: ['ColorInput', 'ColorPicker'] },
  'blocks.tsx':      { only: ['Banner', 'MetricCard', 'Stat', 'Pipeline', 'Timeline', 'RingBar', 'ScoreGauge', 'LogViewer', 'DiffViewer', 'TreeView', 'JSONInspector', 'ServiceCard', 'AgentCard', 'FilterPanel', 'DataTable'] },
  'charts.tsx':      { only: ['EidosChart', 'EidosTooltipContent', 'ChartLegend'], npm: ['recharts'] },
  'device.tsx':      { only: ['DeviceFrame', 'StatusBar', 'PhoneTop'] },
  'drawer.tsx':      { only: ['Drawer'] },
  'modal.tsx':       { only: ['Modal'] },
  'alert-dialog.tsx': { only: ['AlertDialog'] },
  'popover.tsx':     { only: ['Popover'] },
  'tooltip.tsx':     { only: ['Tooltip'] },
  'hover-card.tsx':  { only: ['HoverCard'] },
  'menu.tsx':        { only: ['DropdownMenu'] },
  'menubar.tsx':     { only: ['Menubar'] },
  'command.tsx':     { only: ['Command', 'CommandDialog'] },
  'notification.tsx': { only: ['Toaster', 'Notification'] },
  'separator.tsx':    { only: ['Separator'] },
  'aspect-ratio.tsx': { only: ['AspectRatio'] },
  'scroll-area.tsx':  { only: ['ScrollArea'] },
  'button-group.tsx': { only: ['ButtonGroup'] },
  'breadcrumb.tsx':   { only: ['Breadcrumb'] },
  'toolbar.tsx':      { only: ['Toolbar'] },
  'navigation.tsx':   { only: ['NavigationMenu'] },
  'sidebar.tsx':      { only: ['Sidebar'] },
  'resizable.tsx':    { only: ['Resizable'] },
  'accordion.tsx':   { only: ['Accordion'] },
  'collapsible.tsx': { only: ['Collapsible'] },
  'carousel.tsx':    { only: ['Carousel'], npm: ['embla-carousel-react'] },
  'table.tsx':       { only: ['Table'] },
  'card.tsx':        { only: ['Card'] },
  'alert.tsx':       { only: ['Alert'] },
  'progress.tsx':    { only: ['Progress'] },
  'spinner.tsx':     { only: ['Spinner'] },
  'skeleton.tsx':    { only: ['Skeleton'] },
  'toggle.tsx':      { only: ['Toggle'] },
  'toggle-group.tsx': { only: ['ToggleGroup'] },
  'label.tsx':        { only: ['Label'] },
  'input-group.tsx':  { only: ['InputGroup'] },
  'tag-input.tsx':    { only: ['TagInput'] },
  'password.tsx':        { only: ['PasswordInput', 'PasswordField'] },
  'selection-card.tsx':  { only: ['CheckboxCard', 'RadioCard', 'RadioCardGroup'] },
  'ai/agentic.tsx':  { only: ['ToolStatus', 'Tool', 'ToolInput', 'ToolOutput', 'Reasoning', 'ChainOfThought', 'Plan', 'Task', 'Checkpoint', 'Confirmation', 'Queue'], npm: ['ai'] },
  'ai/artifact.tsx': { only: ['ArtifactWidget', 'ArtifactPanel'] },
  'ai/ask.tsx':      { only: ['AskUser'] },
  'ai/content.tsx':  { only: ['Shimmer', 'ImageView', 'Diagram', 'MathView'] },
  'ai/context.tsx':  { only: ['Context', 'ContextGauge', 'ContextBar'] },
  'ai/history.tsx':  { only: ['HistoryItem', 'HistoryGroup', 'History', 'HistoryShell'] },
  'ai/identity.tsx': { only: ['AILabel', 'AILabelWithPopover', 'AgentAvatar', 'AgentIdentity'] },
  'ai/mention.tsx':  { only: ['Mention'] },
  'ai/message.tsx':  { only: ['Message', 'MessageActions', 'Response', 'Conversation'] },
  'ai/prompt.tsx':   { only: ['PromptSubmit', 'ModelBadge', 'ModelSelector', 'ModelPicker', 'Attachment', 'DropZone', 'DragDropOverlay', 'PromptBanner', 'PromptInput', 'Suggestion', 'SuggestionCard'] },
  'ai/prose.tsx':    { only: ['Prose', 'ProseCode'], npm: ['react-markdown', 'remark-gfm'] },
  'ai/sources.tsx':  { only: ['Citation', 'Sources', 'SourcesPanel'] },
  'ai/terminal.tsx': { only: ['Terminal'] },
  'ai/voice.tsx':    { only: ['Persona', 'SpeechInput', 'Transcription', 'AudioPlayer'] },
};

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();

// Build the global boundary set: componentName → kebab target.
const COMPONENT = new Map();
for (const { only } of Object.values(FAMILIES)) for (const n of only) COMPONENT.set(n, kebab(n));

const LANGS_LITERAL = `{ TypeScript: '#3178C6', Go: '#00ADD8', Java: '#F89820', Python: '#FFD43B', Rust: '#CE422B' }`;

// ── Parse one family file into a declaration graph ──────────────────────────
function parseFamily(absPath) {
  const text = readFileSync(absPath, 'utf8');
  const sf = ts.createSourceFile(absPath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  // imports: binding name → { source, kind, statementText }
  const imports = new Map();
  // top-level decls: name → { text, refs:Set<string>, order }
  const decls = new Map();
  let order = 0;

  const collectRefs = (node, into) => {
    const visit = (n) => {
      if (ts.isIdentifier(n)) {
        // skip the property name in `a.b` / `<a.b/>` and object-literal keys
        const p = n.parent;
        const isPropName = p && ts.isPropertyAccessExpression(p) && p.name === n;
        const isQualRight = p && ts.isQualifiedName(p) && p.right === n;
        const isObjKey = p && ts.isPropertyAssignment(p) && p.name === n;
        const isBindingName = p && (ts.isParameter(p) || ts.isBindingElement(p) || ts.isVariableDeclaration(p)) && p.name === n;
        if (!isPropName && !isQualRight && !isObjKey && !isBindingName) into.add(n.text);
      }
      ts.forEachChild(n, visit);
    };
    ts.forEachChild(node, visit);
  };

  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) {
      const src = st.moduleSpecifier.text;
      const stmtText = st.getText(sf);
      const ic = st.importClause;
      if (!ic) continue;
      if (ic.name) imports.set(ic.name.text, { source: src, kind: 'default', stmtText });
      const nb = ic.namedBindings;
      if (nb && ts.isNamespaceImport(nb)) imports.set(nb.name.text, { source: src, kind: 'namespace', stmtText });
      if (nb && ts.isNamedImports(nb)) for (const el of nb.elements) imports.set(el.name.text, { source: src, kind: 'named', stmtText });
      continue;
    }
    // unwrap `export { ... }` (no decl) — record nothing; aliases handled via COMPONENT
    let names = [];
    let node = st;
    if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) names.push(d.name.getText(sf));
    } else if (ts.isFunctionDeclaration(st) && st.name) {
      names.push(st.name.text);
    } else if ((ts.isTypeAliasDeclaration(st) || ts.isInterfaceDeclaration(st)) && st.name) {
      names.push(st.name.text);
    } else continue;

    const refs = new Set();
    collectRefs(st, refs);
    // strip a leading `export ` so inlined private decls aren't re-exported
    let txt = st.getText(sf).replace(/^export\s+/, '');
    for (const nm of names) decls.set(nm, { text: txt, refs, order: order });
    order++;
  }
  return { imports, decls };
}

// ── Reachability closure for one component within its family ────────────────
function sliceComponent(name, fam) {
  const { imports, decls } = fam;
  const included = new Map(); // declName → order (private decls to inline)
  const boundaryDeps = new Set(); // other component names
  const usedImports = new Set(); // import binding names actually reached
  let usesMOCKS = false;

  const visit = (n) => {
    const d = decls.get(n);
    if (!d) {
      if (n === 'MOCKS') { usesMOCKS = true; return; }
      if (imports.has(n)) usedImports.add(n);
      return;
    }
    if (included.has(n)) return;
    included.set(n, d.order);
    for (const r of d.refs) {
      if (r === n) continue;
      if (COMPONENT.has(r) && r !== name) { boundaryDeps.add(r); continue; }
      visit(r);
    }
  };
  visit(name);

  // emit imports
  const lines = [];
  if (usedImports.has('React') || [...included.keys()].some((k) => /React\./.test(decls.get(k).text)) || true) {
    // components are TSX; always pull React namespace (covers React.useState/JSX types)
    lines.push(`import * as React from 'react';`);
  }
  // external libs (recharts / react-dom) — reuse the original import statement text.
  // Also handle ./lib/utils and similar local-but-non-component imports by rewriting
  // the source to the consumer alias (@/lib/utils → installed by `eidos init`).
  const extByStmt = new Map();
  for (const b of usedImports) {
    const imp = imports.get(b);
    if (!imp) continue;
    if (imp.source === 'react') continue; // handled above
    if (imp.source.startsWith('.')) {
      // Rewrite ./lib/utils → @/lib/utils (installed by eidos init).
      // Other relative-local paths are inlined via the boundary system; skip them.
      if (imp.source === './lib/utils' || imp.source.endsWith('/lib/utils')) {
        const rewritten = imp.stmtText.replace(/'[^']*lib\/utils'/, "'@/lib/utils'");
        extByStmt.set(rewritten, true);
      }
      // all other family-local references are handled via boundary deps or inlined
      continue;
    }
    extByStmt.set(imp.stmtText, true);
  }
  for (const stmt of extByStmt.keys()) lines.push(stmt);
  // boundary component imports (alias path) — sorted for stable output
  for (const dep of [...boundaryDeps].sort()) {
    lines.push(`import { ${dep} } from '@/components/forge/${COMPONENT.get(dep)}';`);
  }
  lines.push('');
  if (usesMOCKS) {
    lines.push(`// Inlined Eidos mock palette (LangBadge) — keeps this file self-contained.`);
    lines.push(`const MOCKS = { LANGS: ${LANGS_LITERAL} } as { LANGS: Record<string, string> };`);
    lines.push('');
  }
  // included decls in original source order
  const ordered = [...included.entries()].sort((a, b) => a[1] - b[1]).map(([k]) => k);
  for (const k of ordered) lines.push(decls.get(k).text, '');
  lines.push(`export { ${name} };`);

  return { code: lines.join('\n') + '\n', deps: [...boundaryDeps] };
}

// ── Run ─────────────────────────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true });
const items = [];
const seen = new Set();
for (const [rel, cfg] of Object.entries(FAMILIES)) {
  const fam = parseFamily(join(UI, rel));
  for (const name of cfg.only) {
    if (!fam.decls.has(name)) { console.error(`  ! ${name} not found in ${rel}`); continue; }
    const slug = COMPONENT.get(name);
    if (seen.has(slug)) continue;
    seen.add(slug);
    const { code, deps } = sliceComponent(name, fam);
    writeFileSync(join(OUT, `${slug}.tsx`), code);
    items.push({ name: slug, component: name, deps: deps.map((d) => COMPONENT.get(d)), npm: cfg.npm || [], ai: rel.startsWith('ai/') });
  }
}

writeFileSync(
  join(ROOT, 'packages/registry/registry.generated.json'),
  JSON.stringify({ items }, null, 2) + '\n',
);
console.log(`Extracted ${items.length} component files → packages/registry/src/forge/`);
const withDeps = items.filter((i) => i.deps.length);
console.log(`  ${withDeps.length} have component dependencies, e.g.:`);
for (const i of withDeps.slice(0, 8)) console.log(`    • ${i.name} ← ${i.deps.join(', ')}`);
