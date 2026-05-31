'use client';
// Eidos DS — Components / TreeView, backed by the real trees.software engine.
// We render Pierre's @pierre/trees FileTree (path-first model, virtualized rows,
// git-status lane, search, drag-and-drop, context menus, keyboard a11y) and
// re-skin ONLY colours, typography and shapes to Eidos via the `--trees-*-override`
// custom props. See `.eidos-tree` in ds.css and the wrapper in
// src/components/pierre-tree.tsx.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, Lede, Mono } from '@/ds/core';
import { EidosTree } from '@/components/pierre-tree';

const lede  = { fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, marginBottom: 18, lineHeight: 1.6, maxWidth: 'none' };
const intro = { fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 0, marginBottom: 30, lineHeight: 1.65, maxWidth: 'none' };
const strong = { color: 'var(--fg)' };

// ── A generous, realistic monorepo slice — many file types so the per-language
//    icon colours (React cyan, TS blue, CSS indigo, Markdown green, image pink,
//    git vermilion, …) are tangible. Path-first: directories are inferred. ──
const REPO = [
  '.github/workflows/ci.yml',
  'build/assets/images/social/logo.png',
  'build/index.mjs',
  'build/scripts.js',
  'config/project/tsconfig.json',
  'node_modules/react/index.js',
  'node_modules/react/package.json',
  'public/404.html',
  'public/favicon.ico',
  'scripts/release.sh',
  'src/components/Avatar.tsx',
  'src/components/Badge.tsx',
  'src/components/Button.tsx',
  'src/components/Button.test.tsx',
  'src/components/Card.tsx',
  'src/components/Dialog.tsx',
  'src/components/Input.tsx',
  'src/hooks/useDebounce.ts',
  'src/hooks/useMediaQuery.ts',
  'src/lib/mdx.tsx',
  'src/styles/globals.css',
  'src/styles/tokens.css',
  'src/utils/cn.ts',
  'src/index.ts',
  '.browserslistrc',
  '.gitignore',
  '.oxlintrc.json',
  'bunfig.toml',
  'package.json',
  'README.md',
  'stylelint.config.js',
];

// Git lane — status rides colour AND a letter glyph, never colour alone. Covers
// every state the engine paints (added · modified · deleted · renamed · untracked).
const REPO_GIT = [
  { path: 'src/components/Button.tsx', status: 'added' as const },
  { path: 'src/components/Card.tsx', status: 'added' as const },
  { path: 'src/index.ts', status: 'modified' as const },
  { path: 'src/styles/globals.css', status: 'modified' as const },
  { path: '.gitignore', status: 'deleted' as const },
  { path: 'package.json', status: 'renamed' as const },
  { path: 'README.md', status: 'untracked' as const },
];

const GIT_LEGEND: { letter: string; color: string; state: string; desc: string }[] = [
  { letter: 'A', color: 'var(--success)',  state: 'added',     desc: 'New file staged in the working tree' },
  { letter: 'M', color: 'var(--viz-cat-2)', state: 'modified', desc: 'Tracked file with uncommitted changes' },
  { letter: 'D', color: 'var(--danger)',   state: 'deleted',   desc: 'Tracked file removed from the tree' },
  { letter: 'R', color: 'var(--viz-cat-3)', state: 'renamed',  desc: 'Tracked file moved or renamed' },
  { letter: 'U', color: 'var(--warning)',  state: 'untracked', desc: 'New file not yet tracked by Git' },
  { letter: '•', color: 'var(--fg-faint)', state: 'descendant',desc: 'Folder contains changed descendants' },
];

// Domain taxonomy — service-and-tier hierarchy, same engine, no file extensions.
const SERVICES = [
  'Payments/eidos-api',
  'Payments/pix-router',
  'Payments/fraud-engine',
  'Identity/identity-svc',
  'Identity/bureau-gateway',
  'Identity/kyc-orchestrator',
];
const SERVICES_META: Record<string, string> = {
  'Payments/eidos-api': 'T1', 'Payments/pix-router': 'T1', 'Payments/fraud-engine': 'T1',
  'Identity/identity-svc': 'T1', 'Identity/bureau-gateway': 'T2', 'Identity/kyc-orchestrator': 'T1',
};

const EXPAND_SRC = ['src', 'src/components'];

const USAGE = `import { EidosTree } from "@/components/forge/tree-view"

<EidosTree
  paths={files}
  chrome="acme-components"
  defaultExpanded={["src", "src/components"]}
  selected="src/components/Button.tsx"
/>`;

// ── Context-menu demo: trigger mode is captured when the model is created, so
//    switching modes remounts the tree (key). ──
const TRIGGERS = [
  { id: 'both' as const, label: 'Both' },
  { id: 'right-click' as const, label: 'Right click' },
  { id: 'button' as const, label: 'Button' },
];
function ContextMenuDemo() {
  const [trigger, setTrigger] = React.useState<'both' | 'right-click' | 'button'>('both');
  return (
    <div>
      <div className="pierre-diff-bar" role="group" aria-label="Context menu trigger">
        <div className="pdb-seg">
          {TRIGGERS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`pdb-btn${trigger === t.id ? ' is-active' : ''}`}
              aria-pressed={trigger === t.id}
              onClick={() => setTrigger(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 420 }}>
        <EidosTree
          key={trigger}
          paths={REPO}
          chrome="acme-components"
          defaultExpanded={EXPAND_SRC}
          contextMenu
          contextMenuTrigger={trigger}
          height={372}
        />
      </div>
    </div>
  );
}

export default function TreeViewPage() {
  return (
    <Section id="tree-view" title="Tree view" desc="The @pierre/trees engine re-skinned to Eidos — path-first file tree with virtualized rows, per-language icons, git-status lane, fuzzy search, drag-and-drop, inline rename, and context menus.">
      <Lede>How the platform renders any nested structure a developer browses — monorepo file trees, service-and-domain taxonomies, dependency graphs. Eidos themes colours, typography and shapes through the library&rsquo;s <Mono>--trees-*-override</Mono> custom properties: selection accent and focus ring are ember, the git lane maps to Eidos success / danger / warning. The tree model, virtualization, layout and keyboard a11y are the library&rsquo;s, untouched.</Lede>

      {/* ── INSTALLATION ─────────────────────────────────────────────── */}
      <SubHead meta="package">Installation</SubHead>
      <TabbedCode tabs={installTabs('tree-view', '@pierre/trees')} ariaLabel="package manager"/>
      <Lede>Feed it a flat list of canonical <b style={strong}>paths</b> — directories are inferred from the segments, so you never build a nested object. <Mono>defaultExpanded</Mono> opens folders by path, <Mono>gitStatus</Mono> paints the status lane, and the optional <Mono>chrome</Mono> prop frames it as an IDE panel.</Lede>

      {/* ── USAGE ────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="path-first file tree · per-language icons · window chrome" code={USAGE}>
        <div style={{ maxWidth: 420 }}>
          <EidosTree
            paths={REPO}
            chrome="acme-components"
            defaultExpanded={EXPAND_SRC}
            selected="src/components/Button.tsx"
            height={420}
          />
        </div>
      </Frame>
      <Lede>Each file icon is coloured by language — <b style={strong}>React</b> cyan, <b style={strong}>TypeScript</b> blue, <b style={strong}>CSS</b> indigo, <b style={strong}>Markdown</b> green, images pink, <Mono>.gitignore</Mono> vermilion. The selected row carries the ember tint + an ember focus ring (never the library&rsquo;s default blue).</Lede>

      {/* ── FILE TYPES ───────────────────────────────────────────────── */}
      <SubHead meta="per-language colour">File types &amp; icons</SubHead>
      <Frame label="every level expanded — the icon palette in one view" code={`<EidosTree paths={files} initialExpansion="open" />`}>
        <div style={{ maxWidth: 420 }}>
          <EidosTree paths={REPO} initialExpansion="open" height={560} />
        </div>
      </Frame>
      <Lede>The engine resolves an icon + colour from each filename — extensions (<Mono>.tsx</Mono>, <Mono>.css</Mono>, <Mono>.sql</Mono>) and whole-name configs (<Mono>package.json</Mono>, <Mono>bunfig.toml</Mono>, <Mono>.oxlintrc.json</Mono>) alike. Files with no match fall back to one quiet neutral.</Lede>

      {/* ── FLATTEN EMPTY DIRECTORIES ────────────────────────────────── */}
      <SubHead meta="flattenEmptyDirectories">Flatten empty directories</SubHead>
      <Frame label="collapse single-child folder chains into one row">
        <div className="eidos-tree-duo">
          <div className="ftd-col">
            <div className="ftd-cap"><Icons.folder size={13}/> <b>Default expanded</b></div>
            <EidosTree paths={REPO} defaultExpanded={['.github', 'build', 'build/assets', 'build/assets/images', 'build/assets/images/social', 'config']} height={384}/>
          </div>
          <div className="ftd-col">
            <div className="ftd-cap"><Icons.layers size={13}/> <b>flattenEmptyDirectories</b></div>
            <EidosTree paths={REPO} flattenEmptyDirectories defaultExpanded={['.github', 'build', 'build/assets/images/social', 'config']} height={384}/>
          </div>
        </div>
      </Frame>
      <Lede>With <Mono>flattenEmptyDirectories</Mono>, a chain like <Mono>assets / images / social</Mono> collapses into one breadcrumb row — fewer rows, the same paths. Useful for deep, sparse monorepos.</Lede>

      {/* ── GIT STATUS ───────────────────────────────────────────────── */}
      <SubHead meta="gitStatus">Git status on files</SubHead>
      <Frame label="status lane — colour + letter, descendant dots on folders" code={`<EidosTree
  paths={files}
  gitStatus={[
    { path: "src/components/Button.tsx", status: "added" },
    { path: "src/index.ts", status: "modified" },
    { path: ".gitignore", status: "deleted" },
    { path: "package.json", status: "renamed" },
    { path: "README.md", status: "untracked" },
  ]}
/>`}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(280px, 1fr) minmax(240px, 320px)', alignItems: 'start' }}>
          <EidosTree paths={REPO} gitStatus={REPO_GIT} initialExpansion="open" height={560}/>
          <div className="surface" style={{ padding: 4, alignSelf: 'start' }}>
            {GIT_LEGEND.map((g, i) => (
              <div key={g.state} style={{ display: 'grid', gridTemplateColumns: '28px 92px 1fr', alignItems: 'center', gap: 10, padding: '11px 12px', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-base)', color: g.color, textAlign: 'center' }}>{g.letter}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)' }}>{g.state}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', lineHeight: 1.45 }}>{g.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Frame>
      <Lede>Each changed row gets a coloured letter on the inline-end edge; a folder with changed descendants shows a quiet dot. Because the state rides a <b style={strong}>letter</b>, not colour alone, it reads without colour perception. Ignored files keep their styling with no indicator.</Lede>

      {/* ── SEARCH ───────────────────────────────────────────────────── */}
      <SubHead meta="fileTreeSearchMode">Search &amp; filter</SubHead>
      <Frame label='filter by name — three modes for non-matching rows ("tsx" prefilled)'>
        <div className="eidos-tree-duo">
          <div className="ftd-col">
            <div className="ftd-cap"><Icons.eyeOff size={13}/> <b>hide-non-matches</b></div>
            <EidosTree paths={REPO} search searchMode="hide-non-matches" initialSearchQuery="tsx" defaultExpanded={EXPAND_SRC} height={360}/>
          </div>
          <div className="ftd-col">
            <div className="ftd-cap"><Icons.minimize size={13}/> <b>collapse-non-matches</b></div>
            <EidosTree paths={REPO} search searchMode="collapse-non-matches" initialSearchQuery="tsx" defaultExpanded={EXPAND_SRC} height={360}/>
          </div>
          <div className="ftd-col">
            <div className="ftd-cap"><Icons.maximize size={13}/> <b>expand-matches</b></div>
            <EidosTree paths={REPO} search searchMode="expand-matches" initialSearchQuery="tsx" defaultExpanded={EXPAND_SRC} height={360}/>
          </div>
        </div>
      </Frame>
      <Lede><Mono>hide-non-matches</Mono> drops everything without a hit; <Mono>collapse-non-matches</Mono> folds non-matching folders but keeps the shape; <Mono>expand-matches</Mono> keeps all rows and opens the branches that match. <Mono>↑</Mono>/<Mono>↓</Mono> cycle matches in every mode.</Lede>

      {/* ── CONTEXT MENU ─────────────────────────────────────────────── */}
      <SubHead meta="renderContextMenu">Context menu</SubHead>
      <p style={{ ...lede, marginTop: 0 }}>Right-click a row (or use the per-row trigger button) for new file, new folder, rename and delete. The menu is a plain Eidos surface — your app supplies its own. Switch the trigger mode and try it:</p>
      <Frame label="right-click · trigger button · both — new file/folder, rename, delete">
        <ContextMenuDemo/>
      </Frame>
      <Lede>New file and rename hand focus straight to an inline rename input; delete removes the row (recursively for folders). All four are wired to the model&rsquo;s mutation API, so the tree updates live.</Lede>

      {/* ── DRAG AND DROP ────────────────────────────────────────────── */}
      <SubHead meta="dragAndDrop">Drag and drop</SubHead>
      <Frame label="drag rows onto folders or the root — package.json is locked" code={`<EidosTree
  paths={files}
  dragAndDrop
  lockedPaths={["package.json"]}
/>`}>
        <div style={{ maxWidth: 460 }}>
          <EidosTree paths={REPO} dragAndDrop lockedPaths={['package.json']} defaultExpanded={['src', 'src/components', 'src/utils']} height={480}/>
        </div>
      </Frame>
      <Lede>Drop targets open automatically on hover, and dragging is disabled while search is active. A <Mono>canDrag</Mono> callback pins specific paths — here <Mono>package.json</Mono> carries a <Mono>locked</Mono> tag and refuses to move.</Lede>

      {/* ── IN CONTEXT ───────────────────────────────────────────────── */}
      <SubHead meta="domain taxonomy">In context — service catalog</SubHead>
      <Frame label="same engine · meta tag per node · tier in the action lane" code={`<EidosTree paths={services} meta={{ "Payments/eidos-api": "T1" }} density="relaxed" />`}>
        <div style={{ maxWidth: 420 }}>
          <EidosTree paths={SERVICES} defaultExpanded={['Payments', 'Identity']} meta={SERVICES_META} density="relaxed" height={300}/>
        </div>
      </Frame>
      <Lede>The path-first model is not just for files — feed it any <Mono>parent/child</Mono> taxonomy. Here service tiers ride a text meta tag in the action lane.</Lede>

      {/* ── ACCESSIBILITY ────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A single roving <code>Tab</code> stop enters the tree, then arrow keys move within it: <code>↓</code>/<code>↑</code> step between visible rows, <code>→</code> expands a collapsed folder (or moves to its first child), <code>←</code> collapses an open folder (or moves to its parent). <code>Enter</code>/<code>Space</code> selects; type-ahead jumps to a name. The library owns this — Eidos only re-skins it.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The container is <code>role="tree"</code> and each row <code>role="treeitem"</code>; folders carry <code>aria-expanded</code>, depth rides <code>aria-level</code>, and position uses <code>aria-posinset</code>/<code>aria-setsize</code>. The selected node is <code>aria-selected</code> so the ember accent is never the only selection cue.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status &amp; type, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The git lane pairs each colour with a letter (A · M · D · R · U), and tier rides a text meta tag (<code>T1</code>) — change and tier read without colour perception. File-icon colour is a redundant cue layered on the always-present name + glyph, never the sole signal.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The focused row keeps a full <b style={strong}>ember</b> focus ring spanning the row at every <code>density</code> — corrected from the library&rsquo;s default blue. Indent guides tighten the rows; keep nesting to ~four levels before the indent eats the labels. Expand/collapse and search transitions respect <code>prefers-reduced-motion</code>.</div>
        </div>
      </div>

      {/* ── RTL ──────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — indentation, chevrons and the git lane mirror to the start edge' code={`<EidosTree dir="rtl" paths={files} gitStatus={status} />`}>
        <div style={{ maxWidth: 420 }}>
          <EidosTree dir="rtl" paths={REPO} gitStatus={REPO_GIT} defaultExpanded={EXPAND_SRC} height={360}/>
        </div>
      </Frame>
      <Lede>Set <Mono>dir="rtl"</Mono> on the tree itself (not just a wrapper) so the engine&rsquo;s RTL mode engages: the disclosure chevrons, indent guides and the status lane all flip to the inline-start edge, and filenames stay bidi-isolated LTR — they are code, so they read left-to-right inside the mirrored layout.</Lede>

      {/* ── ANATOMY ──────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '60px 36px 48px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 380}} aria-hidden="true">
              {/* a folder row + a selected file row, hand-composed so pins anchor */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-elevated)', padding: '8px 0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', color: 'var(--fg)' }}>
                  <Icons.chevronDown size={14} color="var(--fg-subtle)"/>
                  <Icons.folder size={15} color="var(--fg-subtle)"/>
                  <span style={{ fontSize: 'var(--text-base)' }}>components</span>
                  <span style={{ marginInlineStart: 'auto', width: 6, height: 6, borderRadius: 999, background: 'var(--fg-faint)' }}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', marginInline: 6, borderRadius: 'var(--radius-md)', background: 'var(--surface-selected)', boxShadow: 'inset 0 0 0 2px var(--ember)', color: 'var(--fg)' }}>
                  <span style={{ width: 14 }}/>
                  <Icons.file size={15} color="var(--viz-cat-2)"/>
                  <span style={{ fontSize: 'var(--text-base)' }}>Button.tsx</span>
                  <span style={{ marginInlineStart: 'auto', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--success)' }}>A</span>
                </div>
              </div>
              <span className="lead v" style={{top: -22, left: 22, height: 18}}/>
              <span className="lead v" style={{top: -22, left: 64, height: 18}}/>
              <span className="lead h" style={{top: 30, left: -30, width: 26}}/>
              <span className="lead h" style={{bottom: 34, right: -30, width: 26}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <div className="pin" style={{top: -42, left: 22, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -42, left: 64, transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{top: 22, left: -52}}>3</div>
              <div className="pin" style={{bottom: 26, right: -52}}>4</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 580, margin:'64px auto 0'}}>
            <span className="num">1</span><span><b style={strong}>Disclosure chevron.</b> 14px, quiet neutral. Rotates on expand; mirrors under RTL.</span>
            <span className="num">2</span><span><b style={strong}>File / folder icon.</b> 15px, coloured by language (here React/TS cyan-blue). No-match files use one neutral.</span>
            <span className="num">3</span><span><b style={strong}>Selected row.</b> Ember tint fill + a 2px ember focus ring spanning the row — the single accent, plus <Mono>aria-selected</Mono>.</span>
            <span className="num">4</span><span><b style={strong}>Git lane.</b> A coloured letter (A · M · D · R · U) on the inline-end edge — colour + glyph, never colour alone.</span>
            <span className="num">5</span><span><b style={strong}>Action lane.</b> Trailing meta tag, context-menu trigger, or descendant dot — 16px reserved on the trailing edge.</span>
          </div>
        </div>
      </div>

      {/* ── DO / DON'T ───────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don&rsquo;t</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — surface git status + a meta tag per row</div>
          <div className="body">
            <EidosTree
              paths={['eidos-api/deploy.ts', 'eidos-api/risk.ts']}
              defaultExpanded={['eidos-api']}
              gitStatus={[{ path: 'eidos-api/deploy.ts', status: 'modified' }]}
              meta={{ 'eidos-api': 'T1' }}
              height={132}
            />
          </div>
          <div className="note">Trees collapse fast — leave a hint of the node&rsquo;s state (git lane, meta tag) in the row so the user can scan without expanding.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don&rsquo;t — nest 6+ levels deep</div>
          <div className="body" style={{ fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)' }}>{">"} apps {">"} eidos {">"} src {">"} util {">"} string {">"} pad.ts</div>
          <div className="note">Past four levels, the indent guides take over and the labels collapse to nothing. Split into multiple trees, scope the root deeper, or turn on <Mono>flattenEmptyDirectories</Mono>.</div>
        </div>
      </div>

      {/* ── API ──────────────────────────────────────────────────────── */}
      <SubHead meta="EidosTreeProps">API reference</SubHead>
      <PropsTable
        label="<EidosTree />"
        rows={[
          { prop: 'paths', type: 'string[]', required: true, description: 'Canonical leaf paths (e.g. "src/index.ts"). Directories are inferred from the segments.' },
          { prop: 'defaultExpanded', type: 'string[]', description: 'Directory paths that start expanded.' },
          { prop: 'initialExpansion', type: '"open" | "closed" | number', description: 'Expand everything, nothing, or to a depth. Overrides defaultExpanded.' },
          { prop: 'selected', type: 'string', description: 'Selected leaf path (single-select). Adds the ember selection tint + aria-selected.' },
          { prop: 'gitStatus', type: '{ path, status }[]', description: 'Per-path git decoration — added | modified | deleted | renamed | untracked | ignored. Drives the coloured status lane.' },
          { prop: 'meta', type: 'Record<string, string>', description: 'Per-path trailing text rendered in the action lane (a tier, runtime, version…).' },
          { prop: 'flattenEmptyDirectories', type: 'boolean', default: 'false', description: 'Collapse single-child folder chains into one breadcrumb row.' },
          { prop: 'search', type: 'boolean', default: 'false', description: 'Mount the built-in fuzzy search field above the tree.' },
          { prop: 'searchMode', type: '"hide-non-matches" | "collapse-non-matches" | "expand-matches"', description: 'How non-matching rows behave while searching.' },
          { prop: 'initialSearchQuery', type: 'string', description: 'Pre-populate the search field (e.g. to demo a mode at rest).' },
          { prop: 'dragAndDrop', type: 'boolean', default: 'false', description: 'Enable drag-to-move between folders and to the root. Disabled while searching.' },
          { prop: 'lockedPaths', type: 'string[]', description: 'Paths that cannot be dragged (canDrag=false); each also gets a "locked" tag.' },
          { prop: 'contextMenu', type: 'boolean', default: 'false', description: 'Mount the Eidos context menu (new file/folder, rename, delete) wired to the model.' },
          { prop: 'contextMenuTrigger', type: '"both" | "right-click" | "button"', default: '"both"', description: 'How the context menu opens.' },
          { prop: 'chrome', type: 'string', description: 'Render an IDE-style window chrome header (traffic lights, repo title, search + new-file actions).' },
          { prop: 'density', type: '"compact" | "default" | "relaxed" | number', default: '"default"', description: 'Row height + spacing preset (or an explicit item height in px).' },
          { prop: 'height', type: 'number | string', default: '320', description: 'Fixed panel height; rows virtualize and scroll inside it.' },
        ]}
      />
      <Lede>Built on <Mono>@pierre/trees</Mono> (the engine behind <a href="https://trees.software" target="_blank" rel="noreferrer" style={{color:'var(--accent-2)'}}>trees.software</a>). Eidos sets only the <Mono>--trees-*-override</Mono> colour, type + shape custom properties in <Mono>ds.css</Mono>; the model, virtualization and a11y are the library&rsquo;s.</Lede>
    </Section>
  );
}
