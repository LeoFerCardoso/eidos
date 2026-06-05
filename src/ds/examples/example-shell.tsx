'use client';
// Eidos IDP — Example Shell
// Renders the simulated Eidos product chrome (rail · topbar · main). Each
// example page mounts an FShell with a `nav` slug + breadcrumb +
// optional headerActions. The page body is passed as children.
//
// v2 (2026-05-17): crumbs accept {label, href} OR plain strings; optional
// subNav strip below the topbar; <IconBubble> + useQueryParam helpers.
import * as React from 'react';
import { Icons, MOCKS } from '@/ds/core';

// Single source of truth for the product navigation rail. Pages select
// which item is active by passing `nav="<key>"` to <FShell>.
// `example` is the *primary* page for that rail icon — siblings (e.g.
// service-detail under services) are reached via subNav + cross-links.
const RAIL = [
  { key: 'home',       icon: 'home',       label: 'Home',              example: 'ai-insights' },
  { key: 'chat',       icon: 'chat',       label: 'Chat',              example: 'ai-chat' },
  { key: 'services',   icon: 'server',     label: 'Services',          example: 'service-catalog' },
  { key: 'pipelines',  icon: 'pipeline',   label: 'Pipelines',         example: 'pipeline-console' },
  { key: 'flags',      icon: 'flag',       label: 'Feature flags',     example: 'feature-flags' },
  { key: 'gates',      icon: 'gate',       label: 'Quality gates',     example: 'quality-gates' },
  { key: 'dora',       icon: 'gauge',      label: 'DORA',              example: 'dora-dashboard' },
  { key: 'scores',     icon: 'score',      label: 'Score cards',       example: 'score-cards' },
  { key: 'agents',     icon: 'agent',      label: 'Agents',            example: 'agent-catalog' },
  { key: 'mcp',        icon: 'mcpServer',  label: 'MCP servers',       example: 'mcp-detail' },
  { key: 'incidents',  icon: 'incident',   label: 'Incidents',         example: 'incident-room' },
  { key: 'cloud',      icon: 'cloud',      label: 'Cloud',             example: 'cloud-inventory' },
  { key: 'templates',  icon: 'package',    label: 'Templates',         example: 'templates' },
];

// ─── Helpers ──────────────────────────────────────────────────────────
// Read the current URL's query string. Returns a getter function.
// Usage: const q = useQueryParam(); const id = q('id') || 'default';
const useQueryParam = () => {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  return (key) => params.get(key);
};

// <IconBubble icon="ring" size={36} tone="ember"/> — the recurring
// section-icon bubble that sits next to page titles, KPI cards, etc.
// Replaces ~9 hand-rolled instances across the example set.
const IconBubble = ({ icon, size = 36, tone = 'ember', solid = false, children }: {
  icon?: string;
  size?: number;
  tone?: string;
  /** Solid fill (strong tone bg + dark ink) instead of the soft tint. For bold,
   *  featured treatments (hero tiles). Contrast-correct: ink is var(--bg). */
  solid?: boolean;
  children?: React.ReactNode;
}) => {
  const Icon = (Icons && Icons[icon]) || null;
  const palette = (solid
    ? {
        ember:  { bg: 'var(--ember)',          fg: 'var(--bg)' },
        ice:    { bg: 'var(--accent-2)',        fg: 'var(--bg)' },
        danger: { bg: 'var(--danger)',          fg: 'var(--bg)' },
        warn:   { bg: 'var(--warning)',         fg: 'var(--bg)' },
        neutral:{ bg: 'var(--surface-active)',  fg: 'var(--fg)'  },
      }
    : {
        ember:  { bg: 'var(--ember-soft)',   fg: 'var(--ember)' },
        ice:    { bg: 'var(--accent-2-soft, color-mix(in oklch, var(--accent-2) 16%, transparent))', fg: 'var(--accent-2)' },
        danger: { bg: 'var(--danger-soft)',  fg: 'var(--danger)' },
        warn:   { bg: 'var(--warning-soft)', fg: 'var(--warning)' },
        neutral:{ bg: 'var(--surface-active)', fg: 'var(--fg-muted)' },
      })[tone] || (solid
        ? { bg: 'var(--ember)', fg: 'var(--bg)' }
        : { bg: 'var(--ember-soft)', fg: 'var(--ember)' });
  const radius = size <= 28 ? 'var(--radius-lg)' : 'var(--radius-xl)';
  return (
    <span style={{
      width: size, height: size,
      borderRadius: radius,
      background: palette.bg,
      color: palette.fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {Icon ? <Icon size={Math.round(size * 0.5)}/> : children}
    </span>
  );
};

const FRail = ({ active = 'home' }: { active?: string }) => (
  <aside className="fp-rail" aria-label="Eidos primary nav">
    <a className="fp-rail-brand" href={(typeof document !== 'undefined' && document.baseURI ? new URL('/example/ai-insights', document.baseURI).toString() : '/example/ai-insights')} title="Eidos — back to Home">F</a>
    {RAIL.map((it) => {
      const Icon = Icons[it.icon] || Icons.circle;
      return (
        <a key={it.key}
           className={'fp-rail-item' + (it.key === active ? ' is-active' : '')}
           href={'/example/' + it.example}
           title={it.label}
           aria-label={it.label}
           aria-current={it.key === active ? 'page' : undefined}>
          <Icon size={18}/>
        </a>
      );
    })}
    <div className="fp-rail-bottom">
      <button className="fp-rail-item" title="Search · ⌘K" aria-label="Search">
        <Icons.search size={18}/>
      </button>
      <button className="fp-rail-item" title="Help" aria-label="Help">
        <Icons.info size={18}/>
      </button>
    </div>
  </aside>
);

// ─── Breadcrumbs ──────────────────────────────────────────────────────
// Crumbs accept either a plain string OR {label, href}. The last segment
// is always rendered as the current page (no link). Non-current segments
// with an href become anchors; without one, they stay as spans.
const FCrumbs = ({ crumbs = [] }: { crumbs?: any[] }) => (
  <nav className="fp-crumbs" aria-label="Breadcrumb">
    {crumbs.map((c, i) => {
      const isLast = i === crumbs.length - 1;
      const segment = typeof c === 'string' ? { label: c } : c;
      return (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">/</span>}
          {isLast ? (
            <span className="cur" aria-current="page">{segment.label}</span>
          ) : segment.href ? (
            <a href={segment.href} className="link">{segment.label}</a>
          ) : (
            <span>{segment.label}</span>
          )}
        </React.Fragment>
      );
    })}
  </nav>
);

// ─── Sub-nav strip (in-section tabs) ──────────────────────────────────
// Pages in the same section (e.g. services) expose siblings via subNav:
//   subNav={[{ label: 'Catalog', href: '/example/service-catalog', active: false },
//            { label: 'Service detail', href: '/example/service-detail', active: true },
//            { label: 'Ring rollout', href: '/example/ring-deployment' },
//            { label: 'Agent chat',  href: '/example/agent-chat' }]}
const FSubNav = ({ items }: { items?: any[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="fp-subnav" role="tablist" aria-label="Section navigation">
      {items.map((it, i) => (
        <a key={i}
           href={it.href || '#'}
           className={'fp-subnav-item' + (it.active ? ' is-active' : '')}
           role="tab"
           aria-current={it.active ? 'page' : undefined}>
          {it.icon && Icons[it.icon] && React.createElement(Icons[it.icon], { size: 12 })}
          <span>{it.label}</span>
          {typeof it.count === 'number' && (
            <span className="fp-subnav-count">{it.count}</span>
          )}
        </a>
      ))}
    </div>
  );
};

// ─── Theme ────────────────────────────────────────────────────────────
// Shares `eidos-mode` localStorage with the DS shell so a user who picks
// light in the DS and opens an example in a new tab lands in light.
const useTheme = () => {
  const [theme, setTheme] = React.useState(() => {
    try {
      return document.documentElement.dataset.mode
          || localStorage.getItem('eidos-mode')
          || 'dark';
    } catch (e) { return 'dark'; }
  });
  React.useEffect(() => {
    document.documentElement.dataset.mode = theme;
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem('eidos-mode', theme); } catch (e) {}
  }, [theme]);
  // Cross-tab sync: when the DS tab flips, mirror here.
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'eidos-mode' && e.newValue && e.newValue !== theme) setTheme(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [theme]);
  return [theme, setTheme] as [string, React.Dispatch<React.SetStateAction<string>>];
};

const ThemeToggle = ({ theme, setTheme }: { theme?: string; setTheme?: any }) => (
  <div className="theme-pill" role="tablist" aria-label="Theme">
    <button className={theme==='dark'?'active':''} onClick={() => setTheme('dark')} aria-pressed={theme==='dark'} title="Dark mode">
      <Icons.moon size={12}/>
    </button>
    <button className={theme==='light'?'active':''} onClick={() => setTheme('light')} aria-pressed={theme==='light'} title="Light mode">
      <Icons.sun size={12}/>
    </button>
  </div>
);

// Path back to the Eidos Design System home (the DS docs shell).
const dsHomeHref = () => '/';

const FTopbar = ({ crumbs, onSearch, onAgentChat, theme, setTheme }: {
  crumbs?: any[];
  onSearch?: () => void;
  onAgentChat?: () => void;
  theme?: string;
  setTheme?: any;
}) => (
  <header className="fp-topbar">
    <a className="fp-topbar-back" href={dsHomeHref()} title="Back to the Eidos Design System" aria-label="Back to the Eidos Design System">
      <Icons.chevronLeft size={12}/>
      <span>Design system</span>
    </a>
    <FCrumbs crumbs={crumbs || ['Eidos', 'Home']}/>
    <div className="fp-topbar-search" role="button" tabIndex={0} onClick={onSearch}>
      <Icons.search size={13}/>
      <span className="label">Search services, agents, deploys...</span>
      <span className="kbd">⌘K</span>
    </div>
    <div className="fp-topbar-actions">
      <ThemeToggle theme={theme} setTheme={setTheme}/>
      {onAgentChat && (
        <button className="fp-topbar-icon" title="Open Eidos agent" aria-label="Eidos agent" onClick={onAgentChat}>
          <Icons.sparkle size={16}/>
        </button>
      )}
      <button className="fp-topbar-icon has-dot" title="Inbox" aria-label="Inbox">
        <Icons.bell size={16}/>
      </button>
      <span className="fp-topbar-user" title="Leonardo Mariga">LM</span>
    </div>
  </header>
);

/**
 * <FShell nav="..." crumbs={[...]} subNav={[...]} actions={...} fullBleed?>
 *   {children}
 * </FShell>
 *
 * - `crumbs`: string[] or { label, href }[] — last segment is the current page.
 * - `subNav`: optional secondary tab strip under the topbar for in-section navigation.
 * - `fullBleed`: drops .fp-main max-width/padding for immersive layouts.
 *
 * The shell installs a global ⌘K Command palette and an agent drawer stub.
 * Pages can still pass `onSearch` / `onAgentChat` to override; default opens
 * the shared overlays.
 */
const FShell = ({ nav = 'home', crumbs, subNav, actions, fullBleed = false, onAgentChat, onSearch, children }: {
  nav?: string;
  crumbs?: any;
  subNav?: any;
  actions?: React.ReactNode;
  fullBleed?: boolean;
  onAgentChat?: any;
  onSearch?: any;
  children?: React.ReactNode;
}) => {
  const { paletteOpen, setPaletteOpen, drawerOpen, setDrawerOpen } = useShellOverlays();
  const [theme, setTheme] = useTheme();
  const handleSearch    = onSearch    || (() => setPaletteOpen(true));
  const handleAgentChat = onAgentChat || (() => setDrawerOpen(true));
  return (
    <div className="fp-app">
      <FRail active={nav}/>
      <FTopbar crumbs={crumbs} onAgentChat={handleAgentChat} onSearch={handleSearch} theme={theme} setTheme={setTheme}/>
      <main className={'fp-main' + (fullBleed ? ' fp-main--full' : '')}>
        {subNav && <FSubNav items={subNav}/>}
        {actions && <div className="fp-page-header-actions">{actions}</div>}
        {children}
      </main>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)}/>
      <AgentDrawerStub open={drawerOpen} onClose={() => setDrawerOpen(false)}/>
    </div>
  );
};

// FPageHeader — mirrors the DS canonical .ds-page-header pattern. Three
// composition slots beyond the basics so detail/entity pages can carry the
// canonical anatomy from `pages/elements/page-headers.html`:
//   • eyebrow — mono ember 11px above title (locates the page in the IA)
//   • status  — pills/badges sharing the title's baseline
//   • meta    — chip row below the lede (version, deploy, p95, coverage)
//   • compact — drops the lede, shrinks the title (above-table dense form)
// Backward-compatible: omit the new props for the standard variant.
const FPageHeader = ({
  eyebrow, title, subtitle, status, meta, icon, actions, compact, leading,
}: {
  eyebrow?: any;
  title?: any;
  subtitle?: any;
  status?: any;
  meta?: any;
  icon?: any;
  actions?: any;
  compact?: any;
  leading?: any;
}) => (
  <div className={'fp-page-header' + (compact ? ' is-compact' : '')}>
    <div>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <div className="fp-page-header-title-row">
        {leading}
        {icon}
        <h1>{title}</h1>
        {status}
      </div>
      {subtitle && <div className="sub">{subtitle}</div>}
      {meta && <div className="fp-page-header-meta">{meta}</div>}
    </div>
    {actions && <div className="fp-page-header-actions">{actions}</div>}
  </div>
);

const FSection = ({ title, children, style }: { title?: any; children?: React.ReactNode; style?: any }) => (
  <section className="fp-section" style={style}>
    {title && <div className="fp-section-title">{title}</div>}
    {children}
  </section>
);

const FKpi = ({ label, value, sub, trendNode }: { label?: any; value?: any; sub?: any; trendNode?: any }) => (
  <div className="fp-kpi">
    <div className="label">{label}</div>
    <div className="fp-kpi-row">
      <div className="value">{value}</div>
      {trendNode}
    </div>
    {sub}
  </div>
);

// ─── Command palette ──────────────────────────────────────────────────
// Product-side ⌘K. Index = 17 example pages + services + agents + a small
// set of synthetic actions ("Open run #9384", "Page on-call", …). Reuses
// the .cp-* styles already in ds.css so the visual is identical to the
// DS Command primitive.
const fuzzy = (q, target) => {
  if (!q) return true;
  q = q.toLowerCase(); target = target.toLowerCase();
  let i = 0;
  for (const ch of target) { if (ch === q[i]) i++; if (i === q.length) return true; }
  return false;
};

const buildCommandIndex = () => {
  const SERVICES = MOCKS.SERVICES || [];
  const idx = [];
  // 1. The 17 example pages — primary destinations.
  RAIL.forEach(r => idx.push({
    id: 'page-' + r.key, label: r.label, group: 'Page',
    href: '/example/' + r.example, icon: r.icon,
  }));
  [
    ['service-detail',   'Service detail',   'server'],
    ['agent-chat',       'Eidos agent chat', 'sparkle'],
    ['pipeline-view',    'Pipeline run',     'pipeline'],
    ['ring-deployment',  'Ring rollout',     'ring'],
    ['service-scaffold', 'Scaffold service', 'rocket'],
  ].forEach(([slug, label, icon]) => idx.push({
    id: 'page-' + slug, label, group: 'Page',
    href: '/example/' + slug, icon,
  }));
  // 2. Services — drill straight into service-detail.
  SERVICES.slice(0, 24).forEach(s => idx.push({
    id: 'svc-' + s.id, label: s.name, group: 'Service',
    meta: (s.tribe || '') + (s.tier ? ' · ' + s.tier : ''),
    href: '/example/service-detail?id=' + s.id, icon: 'server',
  }));
  // 3. A few synthetic quick actions.
  [
    { id: 'act-incident', label: 'Open active incident · INC-1247', group: 'Action', href: '/example/incident-room', icon: 'incident' },
    { id: 'act-deploy',   label: 'View deploy run #9384',           group: 'Action', href: '/example/pipeline-view',  icon: 'pipeline' },
    { id: 'act-scaffold', label: 'Scaffold a new service',          group: 'Action', href: '/example/service-scaffold', icon: 'rocket' },
    { id: 'act-flags',    label: 'Manage feature flags',            group: 'Action', href: '/example/feature-flags', icon: 'flag' },
    { id: 'act-agent',    label: 'Ask Eidos agent',                 group: 'Action', href: '/example/agent-chat',    icon: 'sparkle' },
  ].forEach(a => idx.push(a));
  return idx.map(it => ({
    ...it,
    haystack: [it.label, it.group, it.meta || ''].join(' '),
  }));
};

const CommandPalette = ({ open, onClose }: { open?: boolean; onClose?: () => void }) => {
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);
  const index = React.useMemo(buildCommandIndex, []);
  const matches = React.useMemo(() => index.filter(it => fuzzy(q, it.haystack)), [q, index]);
  React.useEffect(() => {
    if (open) {
      setQ(''); setActive(0);
      requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
    }
  }, [open]);
  React.useEffect(() => { setActive(0); }, [q]);
  if (!open) return null;
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const m = matches[active];
      if (m) window.location.href = m.href;
    } else if (e.key === 'Escape') { onClose && onClose(); }
  };
  return (
    <div className="cp-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cp" onClick={e => e.stopPropagation()}>
        <div className="cp-search">
          <Icons.search size={14}/>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search services, agents, deploys, pages…"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="kbd">esc</span>
        </div>
        <div className="cp-results" role="listbox">
          {matches.length === 0 && (
            <div className="cp-empty">No matches for "{q}"</div>
          )}
          {matches.slice(0, 80).map((m, i) => {
            const Icon = (Icons && Icons[m.icon]) || Icons.circle;
            return (
              <a key={m.id} href={m.href}
                 className={'cp-row' + (i === active ? ' is-active' : '')}
                 role="option" aria-selected={i === active}
                 onMouseEnter={() => setActive(i)}>
                <span style={{display:'inline-flex', alignItems:'center', justifyContent:'center', width: 18, color:'var(--fg-muted)'}}>
                  <Icon size={13}/>
                </span>
                <span className="cp-label">{m.label}</span>
                <span className="cp-trail">
                  <span className="cp-group">{m.group}{m.meta ? ' · ' + m.meta : ''}</span>
                </span>
              </a>
            );
          })}
        </div>
        <div className="cp-foot">
          <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span><span className="kbd">↵</span> open</span>
          <span style={{marginInlineStart:'auto'}}><span className="kbd">⌘K</span> toggle</span>
        </div>
      </div>
    </div>
  );
};

// ─── Agent drawer stub ────────────────────────────────────────────────
// Lightweight ChatGPT-like sidesheet for pages that don't host their own
// full agent (agent-chat.jsx still mounts the canonical one). Lives in
// the shell so onAgentChat is honoured everywhere without an alert().
const AgentDrawerStub = ({ open, onClose }: { open?: boolean; onClose?: () => void }) => {
  if (!open) return null;
  return (
    <aside className="fp-drawer" role="dialog" aria-label="Eidos agent" aria-modal="false">
      <div className="fp-drawer-head">
        <span style={{
          width: 28, height: 28, borderRadius: 'var(--radius-xl)',
          background: 'var(--ember-soft)', color: 'var(--ember)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icons.sparkle size={14}/>
        </span>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: 'var(--text-sm)', fontWeight: 600}}>Eidos agent</div>
          <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>Reading this page · ask anything</div>
        </div>
        <a className="btn ghost sm" href="/example/agent-chat" title="Open full chat">
          <Icons.maximize size={12}/> Full
        </a>
        <button className="btn ghost sm" onClick={onClose} title="Close">
          <Icons.x size={12}/>
        </button>
      </div>
      <div className="fp-drawer-body">
        <div style={{
          background: 'var(--ember-softer)',
          border: '1px solid color-mix(in oklch, var(--ember) 22%, transparent)',
          borderRadius: 'var(--radius-2xl)',
          padding: '12px 14px',
          fontSize: 'var(--text-sm)',
          color: 'var(--fg)',
          lineHeight: 1.55,
        }}>
          Hi — I'm caught up on this page. Ask about anything you see, or pick a starter below.
        </div>
        <div style={{display:'flex', flexDirection:'column', gap: 8, marginTop: 12}}>
          {[
            'Summarise the current state of this page',
            'What changed in the last 24 hours?',
            'Open the canonical chat for richer context',
          ].map((s, i) => (
            <button key={i} className="chip" style={{
              cursor: 'pointer', justifyContent: 'flex-start',
              fontSize: 'var(--text-sm)', padding: '8px 10px',
            }}>{s}</button>
          ))}
        </div>
      </div>
      <div className="fp-drawer-foot" style={{display:'flex', alignItems:'center', gap: 8}}>
        <input
          className="in-control"
          placeholder="Ask Eidos anything…"
          style={{flex: 1}}
          aria-label="Message Eidos agent"
        />
        <button className="btn ember sm" title="Send">
          <Icons.arrowRight size={12}/>
        </button>
      </div>
    </aside>
  );
};

// Hook: install ⌘K and centralise palette / drawer state. Pages that don't
// pass custom onSearch / onAgentChat handlers inherit the shared ones.
const useShellOverlays = () => {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  React.useEffect(() => {
    const onKey = (e) => {
      const isToggle = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isToggle) { e.preventDefault(); setPaletteOpen(v => !v); return; }
      if (e.key === 'Escape') {
        if (paletteOpen) setPaletteOpen(false);
        if (drawerOpen)  setDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [paletteOpen, drawerOpen]);
  return { paletteOpen, setPaletteOpen, drawerOpen, setDrawerOpen };
};

export {
  FShell, FRail, FTopbar, FCrumbs, FSubNav,
  FPageHeader, FSection, FKpi,
  IconBubble, useQueryParam, useTheme,
  CommandPalette, AgentDrawerStub, useShellOverlays, ThemeToggle,
  RAIL,
};
