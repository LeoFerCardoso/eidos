'use client';
import * as React from 'react';
// Forge DS — section-building primitives shared by every page:
// CopyButton · Code · CodeBlock · Frame · Section · SubHead · TokenSwatch · SpecRow
//
// Tokenizer note (do NOT regress):
// The highlighter walks the source ONCE, collects {t, v} tokens, and
// renders them at the very end with HTML escaping applied to v. Earlier
// versions ran a chain of .replace() calls that re-scanned previously
// injected <span class="..."> markup — the `class` keyword pattern then
// matched `class` *inside* its own injected spans, corrupting the output
// (see RTL HTML samples). Single-pass tokenization eliminates that whole
// class of bug. Keep it single-pass.
import { Icons } from './icons';

// ---- Copy button ---------------------------------------------------------
const CopyButton = ({ text, label = 'Copy' }: { text?: string; label?: string }) => {
  const [ok, setOk] = React.useState(false);
  const onClick = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch(e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch(e2){}
      ta.remove();
    }
    setOk(true); setTimeout(()=>setOk(false), 1400);
  };
  return (
    <button className={'copy-btn' + (ok?' ok':'')} onClick={onClick} aria-label="Copy code">
      {ok ? <Icons.check size={12}/> : <Icons.copy size={12}/>}
      {ok ? 'Copied' : label}
    </button>
  );
};

// ---- Token-stream highlighter -------------------------------------------
const escapeHtml = (s) => String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// JS / JSX / TS — single alternation regex; group order = priority.
// Importantly, attribute-name match REQUIRES a following `=` via lookahead,
// so `class` as a JS keyword and `class` as an attribute don't collide.
const tokJs = (src) => {
  const out = [];
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:className|onClick|onChange|onSubmit|onKeyDown|onKeyUp|onFocus|onBlur|style|key|ref|href|src|alt|type|value|placeholder|disabled|checked|readOnly|required|role|id|name|lang|dir|title|width|height|aria-[a-z]+|data-[a-z-]+)\b)(?=\s*=)|(\b(?:const|let|var|function|return|import|from|export|default|if|else|for|of|in|new|class|extends|await|async|try|catch|finally|throw|while|do|switch|case|break|continue|typeof|instanceof|null|true|false|undefined|this|super)\b)|(\b[A-Z][A-Za-z0-9_$]*\b)|(=>)/g;
  let pos = 0, m;
  while ((m = re.exec(src))) {
    if (m.index > pos) out.push({ t: '', v: src.slice(pos, m.index) });
    if (m[1])      out.push({ t: 'c', v: m[0] });
    else if (m[2]) out.push({ t: 's', v: m[0] });
    else if (m[3]) out.push({ t: 'a', v: m[0] });
    else if (m[4]) out.push({ t: 'k', v: m[0] });
    else if (m[5]) out.push({ t: 'f', v: m[0] });
    else if (m[6]) out.push({ t: 'k', v: m[0] });
    pos = m.index + m[0].length;
  }
  if (pos < src.length) out.push({ t: '', v: src.slice(pos) });
  return out;
};

// CSS — comments, custom properties, at-rules, strings, numbers/units.
const tokCss = (src) => {
  const out = [];
  const re = /(\/\*[\s\S]*?\*\/)|(--[A-Za-z0-9-]+)|(@[a-z-]+)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?(?:px|em|rem|%|s|ms|deg|vh|vw|fr|ch|ex)?\b)/g;
  let pos = 0, m;
  while ((m = re.exec(src))) {
    if (m.index > pos) out.push({ t: '', v: src.slice(pos, m.index) });
    if (m[1])      out.push({ t: 'c', v: m[0] });
    else if (m[2]) out.push({ t: 'n', v: m[0] });
    else if (m[3]) out.push({ t: 'k', v: m[0] });
    else if (m[4]) out.push({ t: 's', v: m[0] });
    else if (m[5]) out.push({ t: 'f', v: m[0] });
    pos = m.index + m[0].length;
  }
  if (pos < src.length) out.push({ t: '', v: src.slice(pos) });
  return out;
};

// HTML — proper state-machine. Tag names are .f, attributes are .a,
// attribute values are .s, comments are .c.
const tokHtml = (src) => {
  const out = [];
  let i = 0;
  while (i < src.length) {
    // <!-- comment -->
    if (src.substr(i, 4) === '<!--') {
      const end = src.indexOf('-->', i + 4);
      const stop = end === -1 ? src.length : end + 3;
      out.push({ t: 'c', v: src.slice(i, stop) });
      i = stop; continue;
    }
    // <!DOCTYPE …>
    if (src.substr(i, 2) === '<!') {
      const end = src.indexOf('>', i);
      const stop = end === -1 ? src.length : end + 1;
      out.push({ t: 'c', v: src.slice(i, stop) });
      i = stop; continue;
    }
    // tag
    if (src[i] === '<') {
      const slash = src[i + 1] === '/';
      let n = i + 1 + (slash ? 1 : 0);
      const nameStart = n;
      while (n < src.length && /[A-Za-z0-9_-]/.test(src[n])) n++;
      out.push({ t: '', v: '<' + (slash ? '/' : '') });
      if (n > nameStart) out.push({ t: 'f', v: src.slice(nameStart, n) });
      // attributes / self-close
      while (n < src.length && src[n] !== '>') {
        if (src[n] === '/') { out.push({ t: '', v: '/' }); n++; continue; }
        if (/\s/.test(src[n])) { out.push({ t: '', v: src[n] }); n++; continue; }
        const aStart = n;
        while (n < src.length && /[A-Za-z0-9_:-]/.test(src[n])) n++;
        if (n > aStart) out.push({ t: 'a', v: src.slice(aStart, n) });
        if (src[n] === '=') {
          out.push({ t: '', v: '=' }); n++;
          if (src[n] === '"' || src[n] === "'") {
            const q = src[n];
            const end = src.indexOf(q, n + 1);
            const stop = end === -1 ? src.length : end + 1;
            out.push({ t: 's', v: src.slice(n, stop) });
            n = stop;
          } else {
            const vs = n;
            while (n < src.length && !/[\s>]/.test(src[n])) n++;
            if (n > vs) out.push({ t: 's', v: src.slice(vs, n) });
          }
        } else if (n === aStart) {
          // Stuck — emit one char as plain to avoid infinite loop
          out.push({ t: '', v: src[n] });
          n++;
        }
      }
      if (src[n] === '>') { out.push({ t: '', v: '>' }); n++; }
      i = n; continue;
    }
    // text content up to next tag
    const next = src.indexOf('<', i);
    const stop = next === -1 ? src.length : next;
    out.push({ t: '', v: src.slice(i, stop) });
    i = stop;
  }
  return out;
};

// bash / shell — comments, strings, vars.
const tokBash = (src) => {
  const out = [];
  const re = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\$[A-Za-z_][A-Za-z0-9_]*|\$\{[^}]+\})/g;
  let pos = 0, m;
  while ((m = re.exec(src))) {
    if (m.index > pos) out.push({ t: '', v: src.slice(pos, m.index) });
    if (m[1])      out.push({ t: 'c', v: m[0] });
    else if (m[2]) out.push({ t: 's', v: m[0] });
    else if (m[3]) out.push({ t: 'n', v: m[0] });
    pos = m.index + m[0].length;
  }
  if (pos < src.length) out.push({ t: '', v: src.slice(pos) });
  return out;
};

// Auto-detect: when the snippet's first non-space char is '<' AND
// there is no obvious JS at top level (no `const` / `function` / `=>`),
// treat a 'jsx' label as raw HTML. Lets old call sites that wrote
// lang="jsx" for a chunk of HTML render correctly without an audit.
const sniffHtml = (src) => {
  const head = src.replace(/^\s+/, '').slice(0, 200);
  if (!head.startsWith('<')) return false;
  if (/\b(const|function|return|import|export|=>)\b/.test(head)) return false;
  return true;
};

const tokenize = (src, lang='jsx') => {
  const code = String(src);
  const norm = (lang || 'jsx').toLowerCase();
  let chosen = norm;
  if (chosen === 'jsx' || chosen === 'js' || chosen === 'ts' || chosen === 'tsx') {
    if (sniffHtml(code)) chosen = 'html';
  }
  let tokens;
  if      (chosen === 'html') tokens = tokHtml(code);
  else if (chosen === 'css')  tokens = tokCss(code);
  else if (chosen === 'bash' || chosen === 'sh' || chosen === 'shell' || chosen === 'terminal') tokens = tokBash(code);
  else                        tokens = tokJs(code);
  return tokens
    .map(t => t.t ? '<span class="' + t.t + '">' + escapeHtml(t.v) + '</span>' : escapeHtml(t.v))
    .join('');
};

// ---- Code (raw <pre>) ---------------------------------------------------
const Code = ({ children, lang = 'jsx' }: { children?: React.ReactNode; lang?: string }) => {
  const html = { __html: tokenize(String(children).replace(/^\n+|\s+$/g, ''), lang) };
  return <pre className="ds-code"><code dangerouslySetInnerHTML={html} /></pre>;
};

// ---- Lede / Mono — canonical page prose ----------------------------------
// Lede is the muted explainer paragraph under a SubHead (the buttons.tsx `lede`
// pattern, unified onto the existing `.ds-caption` class so every page reads the
// same: var(--text-sm) · var(--fg-muted) · line-height 1.6 · 64ch). Use it for ALL
// section intros — never hand-roll an inline font-size. `up` tightens the top
// margin when the lede directly follows a SubHead. Mono is an inline code
// reference: the default ember tone names a single token/prop/class as the
// accent of a sentence, but the ember accent caps at ~2× per screen — so a
// page with several inline code refs in one paragraph would overspend it and,
// at var(--text-sm), small ember text on a surface flirts with the AA floor.
// For those repeated/secondary references pass tone="subtle" (var(--fg-subtle))
// so pages compose the canonical primitive without the ember-overuse hazard.
const Lede = ({ children, up = false, wide = false, narrow = false }: { children?: React.ReactNode; up?: boolean; wide?: boolean; narrow?: boolean }) => (
  <p className={'ds-caption' + (wide ? ' wide' : '') + (narrow ? ' narrow' : '')} style={{ marginBottom: 18, ...(up ? { marginTop: -6 } : null) }}>
    {children}
  </p>
);

const Mono = ({ children, tone = 'ember' }: { children?: React.ReactNode; tone?: 'ember' | 'subtle' }) => (
  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: tone === 'subtle' ? 'var(--fg-subtle)' : 'var(--ember)' }}>{children}</code>
);

// ---- CodeBlock — code-only display --------------------------------------
// Use this when there is no preview to show. Frame is for preview + code;
// CodeBlock is for code alone (terminal, config, recipe). Renders a
// labeled head bar with copy + the highlighted body, no empty preview area.
export interface CodeBlockProps {
  /** Eyebrow label shown in the block header, left-aligned. Name the snippet ("deploy command", "agent loop"). */
  label?: string;
  /** The raw code string. Rendered through the built-in tokenizer; copied verbatim by the copy button. */
  code: string;
  /** Language hint for the built-in tokenizer. Drives syntax colour. Pass an empty string to render plain mono. */
  lang?: string;
}
const CodeBlock = ({ label = 'snippet', code, lang = 'jsx' }: CodeBlockProps) => (
  <div className="ds-frame ds-frame-codeonly">
    <div className="ds-frame-head">
      <span className="label">{label}</span>
      <div className="actions">
        <CopyButton text={code}/>
      </div>
    </div>
    <Code lang={lang}>{code}</Code>
  </div>
);

// ---- CodeTree — multi-file viewer with VS-Code-style file tree ----------
// Use when a single example needs more than one file (component def +
// usage + types + styles). `files` is an array of { path, code, lang? }.
// The tree groups by folder; selecting a leaf swaps the code pane.
// langFromExt() infers tokenizer from extension when `lang` is omitted.
const langFromExt = (path) => {
  const ext = path.toLowerCase().split('.').pop();
  if (ext === 'tsx' || ext === 'jsx' || ext === 'ts' || ext === 'js') return 'jsx';
  if (ext === 'css' || ext === 'scss') return 'css';
  if (ext === 'html') return 'html';
  if (ext === 'sh' || ext === 'bash') return 'bash';
  return 'jsx';
};

// Build nested folder tree from flat list of paths.
// Returns { [name]: { __file: idx } | { __folder: subtree } }
const buildTree = (files) => {
  const root = {};
  files.forEach((f, idx) => {
    const parts = f.path.split('/');
    let cursor = root;
    parts.forEach((part, i) => {
      const isLeaf = i === parts.length - 1;
      if (isLeaf) {
        cursor[part] = { __file: idx };
      } else {
        if (!cursor[part] || cursor[part].__file !== undefined) cursor[part] = {};
        cursor = cursor[part];
      }
    });
  });
  return root;
};

const fileExtDot = (path) => {
  const ext = path.toLowerCase().split('.').pop();
  // Color-coded dot in the file tree — quick visual cue per language.
  if (ext === 'tsx' || ext === 'jsx') return 'var(--ember-glow)';
  if (ext === 'ts' || ext === 'js')   return '#93C5FD';
  if (ext === 'css' || ext === 'scss') return 'var(--violet)';
  if (ext === 'html')                  return 'var(--success)';
  if (ext === 'json')                  return 'var(--warning)';
  return 'var(--fg-faint)';
};

const TreeNode = ({ node, activeIdx, setActive, depth }: {
  node: Record<string, any>;
  activeIdx: number;
  setActive: (idx: number) => void;
  depth: number;
}) => {
  const entries = Object.entries(node);
  return (
    <ul className="ds-codetree-list" style={depth === 0 ? null : { paddingInlineStart: 14 }}>
      {entries.map(([name, value]) => {
        if (value.__file !== undefined) {
          const idx = value.__file;
          return (
            <li key={name}>
              <button
                type="button"
                className={'ds-codetree-file' + (idx === activeIdx ? ' active' : '')}
                onClick={() => setActive(idx)}
              >
                <span className="dot" style={{ background: fileExtDot(name) }} aria-hidden="true"/>
                <span className="name">{name}</span>
              </button>
            </li>
          );
        }
        return (
          <li key={name}>
            <div className="ds-codetree-folder">
              <Icons.chevronDown size={10}/>
              <Icons.folder size={11}/>
              <span className="name">{name}</span>
            </div>
            <TreeNode node={value} activeIdx={activeIdx} setActive={setActive} depth={depth + 1}/>
          </li>
        );
      })}
    </ul>
  );
};

const CodeTree = ({ files, defaultIndex = 0, label }: {
  files: { path: string; code: string; lang?: string }[];
  defaultIndex?: number;
  label?: string;
}) => {
  const [active, setActive] = React.useState(defaultIndex);
  const file = files[active] || files[0];
  const tree = React.useMemo(() => buildTree(files), [files]);
  const lang = file.lang || langFromExt(file.path);
  return (
    <div className="ds-frame ds-frame-tree">
      <div className="ds-frame-head">
        <span className="label">{label || file.path}</span>
        <div className="actions">
          <CopyButton text={file.code}/>
        </div>
      </div>
      <div className="ds-codetree">
        <aside className="ds-codetree-sidebar" aria-label="Files">
          <TreeNode node={tree} activeIdx={active} setActive={setActive} depth={0}/>
        </aside>
        <div className="ds-codetree-body">
          <Code lang={lang}>{file.code}</Code>
        </div>
      </div>
    </div>
  );
};

// ---- TabSwitch ----------------------------------------------------------
// Compact pill-style tab bar — used in the frame head when a Frame is in
// tabbed mode (Preview / Code), and as a standalone primitive in TabbedCode
// for switching between package managers in the Installation section.
// Named TabSwitch to distinguish from the compound Tabs exported from tabs.tsx.
const TabSwitch = ({ tabs, active, onSelect, ariaLabel }: {
  tabs: string[];
  active?: number;
  onSelect?: (i: number) => void;
  ariaLabel?: string;
}) => (
  <div className="ds-tabs" role="tablist" aria-label={ariaLabel}>
    {tabs.map((t, i) => (
      <button
        key={t}
        type="button"
        role="tab"
        aria-selected={i === active}
        tabIndex={i === active ? 0 : -1}
        className={'ds-tab' + (i === active ? ' active' : '')}
        onClick={() => onSelect?.(i)}
      >
        {t}
      </button>
    ))}
  </div>
);

// ---- TabbedCode — switchable code panes (CLI commands per package mgr) ---
// `tabs` is an array of { label, code, lang? }. The head bar shows the tabs
// on the left and a copy button (always reflects the active tab) on the right.
const TabbedCode = ({ tabs, defaultIndex = 0, ariaLabel = 'package manager' }: {
  tabs: { label: string; code: string; lang?: string }[];
  defaultIndex?: number;
  ariaLabel?: string;
}) => {
  const [active, setActive] = React.useState(defaultIndex);
  const tab = tabs[active] || tabs[0];
  return (
    <div className="ds-frame ds-frame-codeonly">
      <div className="ds-frame-head ds-frame-head-tabs">
        <TabSwitch
          tabs={tabs.map(t => t.label)}
          active={active}
          onSelect={setActive}
          ariaLabel={ariaLabel}
        />
        <div className="actions">
          <CopyButton text={tab.code} />
        </div>
      </div>
      <Code lang={tab.lang || 'bash'}>{tab.code}</Code>
    </div>
  );
};

// ---- CollapsibleCode — long snippets get a "Show code" reveal -------------
// Tiny snippets (under the line threshold) render plain; longer ones clip
// to ~6 lines with a fade overlay, then expand on click. Keeps long Frame
// bodies from dominating the page rhythm.
const COLLAPSE_THRESHOLD = 8; // lines visible without scroll before we clip
const countLines = (src) => String(src).replace(/^\n+|\s+$/g, '').split('\n').length;
const CollapsibleCode = ({ code, lang = 'jsx' }: { code?: string; lang?: string }) => {
  const collapsible = countLines(code) > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = React.useState(false);
  if (!collapsible) return <Code lang={lang}>{code}</Code>;
  return (
    <div className="ds-code-collapse" data-expanded={expanded ? 'true' : 'false'}>
      <div className="ds-code-clip">
        <Code lang={lang}>{code}</Code>
        {!expanded && <div className="ds-code-fade" aria-hidden="true"/>}
      </div>
      <div className="ds-code-toggle-row">
        <button
          type="button"
          className="ds-code-toggle"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide code' : 'Show code'}
          <Icons.chevronDown size={10}/>
        </button>
      </div>
    </div>
  );
};

// ---- Frame (preview + optional code) -------------------------------------
// Preview body on top, code block below — always rendered side-by-side
// (vertically stacked) so the reader can see both at once. Long code
// snippets auto-collapse via CollapsibleCode.
const Frame = ({ label, children, code, lang='jsx', center=false, row=false, dotted=false, height }: {
  label?: React.ReactNode;
  children?: React.ReactNode;
  code?: string;
  lang?: string;
  center?: boolean;
  row?: boolean;
  dotted?: boolean;
  height?: number | string;
}) => (
  <div className="ds-frame">
    <div className="ds-frame-head">
      <span className="label">{label}</span>
      <div className="actions">
        {code && <CopyButton text={code}/>}
      </div>
    </div>
    <div
      className={'ds-frame-body' + (center?' center':'') + (row?' row':'') + (dotted?' dotted':'')}
      style={height ? {minHeight: height} : undefined}
    >
      {children}
    </div>
    {code && <CollapsibleCode code={code} lang={lang}/>}
  </div>
);

// ---- PropsTable — minimal API reference table ----------------------------
// `rows` is an array of { prop, type, default, required?, description? }.
// Each row's prop / type / default render as inline code with semantic
// colors that match the highlighter (ember = identifier, ice = type,
// violet = literal).
const PropsTable = ({ rows, label = 'props' }: {
  rows: { prop: string; type?: string; default?: string; required?: boolean; description?: React.ReactNode }[];
  label?: string;
}) => (
  <div className="ds-frame ds-props-frame">
    <div className="ds-frame-head">
      <span className="label">{label}</span>
    </div>
    <div className="ds-props-wrap">
      <table className="ds-props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.prop + ':' + i}>
              <td className="prop">
                <code>{r.prop}</code>
                {r.required && <span className="req" aria-label="required">*</span>}
              </td>
              <td className="type"><code>{r.type}</code></td>
              <td className="default">
                {r.default
                  ? <code>{r.default}</code>
                  : <span className="dim">—</span>}
              </td>
              <td className="desc">{r.description || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Section heading (H2). Semantic <h2> so the page has a real outline (TOC + a11y),
// at the H2 size in the type scale. When the title is a plain string it gets an id +
// hover anchor so it can be deep-linked and picked up by the "On this page" rail.
const slugifyHeading = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SubHead = ({ children, meta }: { children?: React.ReactNode; meta?: string }) => {
  const id = typeof children === 'string' ? 'sec-' + slugifyHeading(children) : undefined;
  return (
    <h2 className="ds-sub" id={id} data-toc={typeof children === 'string' ? children : undefined}>
      <span className="ds-sub-text">{children}</span>
      {meta && <span className="meta">{meta}</span>}
      {id && <a className="ds-sub-anchor" href={'#' + id} aria-label="Link to this section">#</a>}
    </h2>
  );
};

/* TokenSwatch — paints `varName` LIVE via CSS variable so the swatch tracks
   theme. `value` is the dark-mode literal; `lightValue` (optional) is shown
   alongside it in the meta so the spec/audit row reads both halves. */
const TokenSwatch = ({ name, value, lightValue, varName }: {
  name?: string;
  value?: string;
  lightValue?: string;
  varName?: string;
}) => (
  <div className="tok">
    <div className="swatch" style={{ background: `var(${varName})` }}/>
    <div className="meta">
      <span className="name">{name}</span>
      <span className="val">{varName}</span>
      <span className="val" style={{color:'var(--fg-faint)'}}>
        {lightValue ? <>dark · {value}<br/>light · {lightValue}</> : value}
      </span>
    </div>
    <CopyButton text={varName} label="var"/>
  </div>
);

const SpecRow = ({ token, value, usage }: {
  token?: React.ReactNode;
  value?: React.ReactNode;
  usage?: React.ReactNode;
}) => (
  <tr>
    <td className="tok-name">{token}</td>
    <td className="mono">{value}</td>
    <td>{usage}</td>
  </tr>
);

// ---- installTabs(name) — boilerplate factory for the Installation block ----
// Every component page opens with a 5-tab TabbedCode (pnpm/npm/yarn/bun/Manual).
// Only the component name and the peer-dep list differ — extract that.
//
// Usage on a page:
//   <TabbedCode tabs={installTabs('alert')} ariaLabel="package manager"/>
//
// `peers` overrides the default npm dependency list shown in the Manual tab. Forge
// components are SEMANTIC-CLASS React (no Radix, no CVA) — the only baseline dep is
// the cn() helper (clsx + tailwind-merge). Components that need a real library
// (recharts for charts, ai/react-markdown for AI) pass their own list.
const DEFAULT_PEERS = 'clsx tailwind-merge';
const installTabs = (name, peers = DEFAULT_PEERS) => {
  const manual = `# 1. Install the Forge base layer once (design tokens + ds.css + cn).
npx forge-ui@latest init

# 2. Add this component — the CLI copies its source into components/forge/
#    and resolves any component + npm dependencies.
npx forge-ui@latest add ${name}
${peers !== DEFAULT_PEERS ? `\n#    (pulls npm deps: ${peers})` : ''}

# Manual alternative: copy components/forge/${name}.tsx + lib/utils.ts from the
# Forge source, run \`npm install ${peers}\`, and import the Forge stylesheet layer
# (@forge/ui/styles/tokens.css → ds.css) so the semantic classes resolve.`;
  return [
    { label: 'pnpm',   code: `pnpm dlx forge-ui@latest add ${name}`, lang: 'bash' },
    { label: 'npm',    code: `npx forge-ui@latest add ${name}`,      lang: 'bash' },
    { label: 'yarn',   code: `yarn dlx forge-ui@latest add ${name}`, lang: 'bash' },
    { label: 'bun',    code: `bunx forge-ui@latest add ${name}`,     lang: 'bash' },
    // The Forge registry is shadcn registry-item.json compatible, so the stock
    // shadcn CLI installs the same component (resolving its deps) too.
    { label: 'shadcn', code: `npx shadcn@latest add https://forge.equifax.dev/r/${name}.json`, lang: 'bash' },
    { label: 'Manual', code: manual, lang: 'bash' },
  ];
};

// ---- Pagination ---------------------------------------------------------
// Shared by the Pagination page and by table footers. Markup contract:
//   <nav class="pg [sm|lg] [outline]">
//     <button class="pg-btn">prev</button>
//     <button class="pg-btn is-active">1</button>
//     <span   class="pg-ellipsis">…</span>
//     <button class="pg-btn">next</button>
//   </nav>
// All styling lives in ds.css under the .pg-* block so other pages can
// render the same chrome without importing this component.
const pageRange = (current, total, siblings = 1) => {
  const out = [];
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  out.push(1);
  if (start > 2) out.push('left-ellipsis');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('right-ellipsis');
  if (total > 1) out.push(total);
  return out;
};

export interface PaginationProps {
  /** Total number of pages. */
  total?: number;
  /** Active page (1-based). Clamped to [1, total]. */
  current?: number;
  /** Fires when the user clicks a page button or prev/next. */
  onChange?: (page: number) => void;
  /** How many page buttons to show on each side of current before collapsing to an ellipsis. */
  siblings?: number;
  /** Button footprint. Match the surrounding table density. */
  size?: 'sm' | 'md' | 'lg';
  /** Draws a border around every button — better on low-contrast surfaces. */
  outline?: boolean;
  /** Hide the prev/next labels — show only the chevron. */
  compact?: boolean;
  /** Add double-chevron buttons for jumping to the first and last page. */
  showFirstLast?: boolean;
}
const Pagination = (props: PaginationProps) => {
  const total = props.total || 1;
  const current = Math.min(Math.max(props.current || 1, 1), total);
  const onChange = props.onChange || (() => {});
  const siblings = props.siblings ?? 1;
  const showFirstLast = props.showFirstLast || false;
  const cls = ['pg']
    .concat(props.size && props.size !== 'md' ? [props.size] : [])
    .concat(props.outline ? ['outline'] : [])
    .join(' ');
  const range = pageRange(current, total, siblings);
  const go = (n: number) => onChange(Math.min(Math.max(n, 1), total));
  return (
    <nav className={cls} role="navigation" aria-label="Pagination">
      {showFirstLast && (
        <button className="pg-btn" onClick={() => go(1)} disabled={current === 1} aria-label="First page">
          <Icons.chevronLeft size={12} className="ico-prev"/><Icons.chevronLeft size={12} className="ico-prev"/>
        </button>
      )}
      <button className="pg-btn" onClick={() => go(current - 1)} disabled={current === 1} aria-label="Previous page">
        <Icons.chevronLeft size={14} className="ico-prev"/>
        {props.compact ? null : <span>Previous</span>}
      </button>
      {range.map((p, i) =>
        typeof p === 'string'
          ? <span key={p + i} className="pg-ellipsis" aria-hidden="true">…</span>
          : <button key={p} className={'pg-btn' + (p === current ? ' is-active' : '')} onClick={() => go(p)} aria-current={p === current ? 'page' : undefined} aria-label={`Page ${p}`}>{p}</button>
      )}
      <button className="pg-btn" onClick={() => go(current + 1)} disabled={current === total} aria-label="Next page">
        {props.compact ? null : <span>Next</span>}
        <Icons.chevronRight size={14} className="ico-next"/>
      </button>
      {showFirstLast && (
        <button className="pg-btn" onClick={() => go(total)} disabled={current === total} aria-label="Last page">
          <Icons.chevronRight size={12} className="ico-next"/><Icons.chevronRight size={12} className="ico-next"/>
        </button>
      )}
    </nav>
  );
};

type SimplePaginationProps = {
  total?: number;
  current?: number;
  onChange?: (page: number) => void;
};
const SimplePagination = (props: SimplePaginationProps) => {
  const total = props.total || 1;
  const current = props.current || 1;
  const onChange = props.onChange || (() => {});
  return (
    <div className="pg">
      <button className="pg-btn outline" disabled={current === 1} onClick={() => onChange(current - 1)}>
        <Icons.chevronLeft size={14} className="ico-prev"/>
        <span>Previous</span>
      </button>
      <span className="pg-ellipsis" style={{font:'400 12px/1 var(--font-mono)', color:'var(--fg-faint)', minWidth: 100}}>
        Page {current} of {total}
      </span>
      <button className="pg-btn outline" disabled={current === total} onClick={() => onChange(current + 1)}>
        <span>Next</span>
        <Icons.chevronRight size={14} className="ico-next"/>
      </button>
    </div>
  );
};

export { CopyButton, Code, CodeBlock, CodeTree, TabbedCode, CollapsibleCode, Frame, PropsTable, SubHead, Lede, Mono, TokenSwatch, SpecRow, installTabs, Pagination, SimplePagination };
