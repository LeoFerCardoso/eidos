'use client';
// Eidos IDP — AI Module shell.
//
// Shared sidebar + topbar + improved PromptInput composer used by every
// AI example surface. Two-pane layout (left rail ~272px · main).
// Theme is reactive: a sun/moon button at the rail foot flips
// [data-theme="light"|"dark"] on <html>, persisted to localStorage.
//
// Composes existing Eidos primitives only — Avatar, Icons, .btn, .pill,
// .in-* input chrome. No new tokens introduced.
import * as React from 'react';
import { Icons } from '@/ds/core';

// ─── Sidebar nav data ─────────────────────────────────────────────────
// Single source of truth for what every AI page renders in the rail.
// `slug` is matched against the page's `activeNav` prop for the
// ember-accent left bar + ember background tint.
const TOP_ITEMS = [
  { slug: 'new-chat',  icon: 'plus',    label: 'New chat',  ember: true, href: '/example/ai-chat-empty' },
  { slug: 'projects',  icon: 'folder',  label: 'Projects',                 href: '/example/ai-projects' },
  { slug: 'library',   icon: 'book',    label: 'Library' },
];

const PINNED = [
  { slug: 'research-analysis',  label: 'Research & Analysis', href: '/example/ai-project-detail' },
  { slug: 'web-search',         label: 'Web Search' },
  { slug: 'knowledge-base',     label: 'Knowledge Base' },
];

const RECENTS = [
  { slug: 'user-research',      label: 'User research analysis', href: '/example/ai-chat-thread' },
  { slug: 'competitive-1',      label: 'Competitive analysis' },
  { slug: 'meeting-notes',      label: 'Meeting notes' },
];

const YESTERDAY = [
  { slug: 'market-trends',      label: 'Market trends analysis' },
  { slug: 'usability-testing',  label: 'Usability testing results' },
  { slug: 'competitive-2',      label: 'Competitive analysis' },
  { slug: 'feature-prio',       label: 'Feature prioritization' },
  { slug: 'user-feedback',      label: 'User feedback' },
];

// ─── Theme handling ───────────────────────────────────────────────────
// Initial paint comes from the inline boot script in each HTML shell so
// there's no FOUC. This hook just lets the rail toggle re-flip the attr.
const useTheme = () => {
  const get = () => document.documentElement.getAttribute('data-theme') || 'light';
  const [theme, setTheme] = React.useState(get);
  const toggle = React.useCallback(() => {
    const next = get() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('eidos-ai-theme', next); } catch {}
    setTheme(next);
  }, []);
  return [theme, toggle] as [string, () => void];
};

// ─── Sidebar ──────────────────────────────────────────────────────────
// `activeNav` is the slug of the highlighted entry across the three
// groups (TOP_ITEMS, PINNED, RECENTS, YESTERDAY). At most one row is
// selected at a time — matches the reference visuals.
const AISidebar = ({ activeNav, onToggleSidebar }: { activeNav?: any; onToggleSidebar?: () => void }) => {
  const [query, setQuery] = React.useState('');

  const Row = ({ it, group }: { it?: any; group?: string }) => {
    const isActive = it.slug === activeNav;
    const cls = ['ai-row'];
    if (isActive) cls.push('is-active');
    if (it.ember)  cls.push('is-ember');
    const Tag = it.href ? 'a' : 'button';
    return (
      <Tag
        className={cls.join(' ')}
        href={it.href}
        aria-current={isActive ? 'page' : undefined}
        title={it.label}
      >
        {group === 'top' && (
          it.icon === 'plus' ? (
            <Icons.plus size={15} color="var(--ember)"/>
          ) : it.icon === 'folder' ? (
            <Icons.folder size={15}/>
          ) : (
            <Icons.book size={15}/>
          )
        )}
        {group === 'list' && <Icons.folder size={15}/>}
        {group === 'recent' && null /* text-only rows under Recents/Yesterday */}
        <span className="label">{it.label}</span>
        {it.slug === 'projects' && activeNav === 'projects' && (
          <Icons.chevronRight size={12} style={{ marginInlineStart: 'auto', color: 'var(--ember)' }}/>
        )}
        {it.slug === 'research-analysis' && activeNav === 'research-analysis' && (
          <Icons.chevronRight size={12} style={{ marginInlineStart: 'auto', color: 'var(--ember)' }}/>
        )}
      </Tag>
    );
  };

  return (
    <aside className="ai-side" aria-label="Eidos AI navigation">
      {/* Brand row */}
      <div className="ai-side-brand">
        <a className="ai-brand-tile" href="/" title="Eidos — back to docs">
          <Icons.flame size={18} color="#fff"/>
        </a>
        <button
          className="ai-icon-btn"
          onClick={onToggleSidebar}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <Icons.panelLeft size={16}/>
        </button>
      </div>

      {/* Search */}
      <div className="ai-side-search">
        <Icons.search size={13}/>
        <input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search chats"
        />
      </div>

      {/* Top section: New chat / Projects / Library */}
      <nav className="ai-side-section" aria-label="Primary">
        {TOP_ITEMS.map(it => <Row key={it.slug} it={it} group="top"/>)}
      </nav>

      {/* Pinned */}
      <div className="ai-side-heading">Pinned</div>
      <nav className="ai-side-section" aria-label="Pinned">
        {PINNED.map(it => <Row key={it.slug} it={it} group="list"/>)}
      </nav>

      {/* Recents */}
      <div className="ai-side-heading">Recents</div>
      <nav className="ai-side-section" aria-label="Recents">
        {RECENTS.map(it => <Row key={it.slug} it={it} group="recent"/>)}
      </nav>

      {/* Yesterday */}
      <div className="ai-side-heading">Yesterday</div>
      <nav className="ai-side-section ai-side-section-last" aria-label="Yesterday">
        {YESTERDAY.map(it => <Row key={it.slug} it={it} group="recent"/>)}
      </nav>

      {/* User row */}
      <UserPill/>
    </aside>
  );
};

// ─── User pill at the rail foot ───────────────────────────────────────
// Hosts the theme toggle (sun/moon button) so the brand never moves —
// critical for the empty-state surfaces where the brand is the only
// anchor on screen.
const UserPill = () => {
  const [theme, toggleTheme] = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="ai-user">
      <span className="ai-user-avatar">JB</span>
      <div className="ai-user-meta">
        <div className="ai-user-name-row">
          <span className="ai-user-name">James Brown</span>
          <span className="ai-user-pro">PRO</span>
        </div>
        <span className="ai-user-email">james@alignui.com</span>
      </div>
      <button
        className="ai-icon-btn"
        onClick={toggleTheme}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle theme"
      >
        {isDark ? <Icons.sun size={14}/> : <Icons.moon size={14}/>}
      </button>
    </div>
  );
};

// ─── Topbar — breadcrumb on leading edge, kebab on trailing ───────────
const AITopbar = ({ crumbs = [], onBack, kebab = true, right }: { crumbs?: any[]; onBack?: any; kebab?: boolean; right?: React.ReactNode }) => (
  <header className="ai-top">
    {onBack && (
      <button className="ai-top-back" onClick={onBack} aria-label="Back">
        <Icons.arrowLeft size={14}/>
        <span>{crumbs[0] || 'Back'}</span>
      </button>
    )}
    {!onBack && (
      <nav className="ai-top-crumbs" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? 'cur' : ''}>{c}</span>
          </React.Fragment>
        ))}
        {crumbs.length > 0 && <Icons.chevronDown size={12} style={{ opacity: 0.5, marginInlineStart: 6 }}/>}
      </nav>
    )}
    <span className="ai-top-spacer"/>
    {right}
    {kebab && (
      <button className="ai-icon-btn" aria-label="More options">
        <Icons.more size={16}/>
      </button>
    )}
  </header>
);

// ─── PromptInput — improved variant matching the reference visuals ─────
// Surface stack:
//   1. premium banner    (lightning · Access premium models · Upgrade)
//   2. textarea row      (rounded white card, placeholder)
//   3. toolbar           (+ button · model select · send arrow)
//   4. helper text       (AI can make mistakes — under the shell)
//
// The shell uses CSS variables, so it re-tints automatically in light /
// dark mode without per-theme overrides.
const AIPromptInput = ({
  placeholder = 'How can I help you today?',
  value,
  onChange,
  onSubmit,
  helper = true,
  premium = true,
  style,
}: {
  placeholder?: string;
  value?: any;
  onChange?: any;
  onSubmit?: any;
  helper?: boolean;
  premium?: boolean;
  style?: any;
}) => {
  const [text, setText] = React.useState(value || '');
  const [model, setModel] = React.useState('GPT-4');
  const [modelOpen, setModelOpen] = React.useState(false);
  const taRef = React.useRef(null);
  const menuRef = React.useRef(null);

  const txt = onChange != null ? value : text;
  const setTxt = onChange != null ? onChange : setText;

  const autosize = () => {
    const el = taRef.current; if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(180, Math.max(28, el.scrollHeight)) + 'px';
  };
  React.useEffect(() => { autosize(); }, [txt]);

  React.useEffect(() => {
    if (!modelOpen) return;
    const onDoc = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setModelOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setModelOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [modelOpen]);

  const send = () => {
    if (!txt.trim()) return;
    if (onSubmit) onSubmit(txt);
    setTxt('');
  };

  return (
    <div className="ai-prompt" style={style}>
      {premium && (
        <div className="ai-prompt-premium">
          <Icons.zap size={12}/>
          <span>Access premium models & features</span>
          <span className="dot">·</span>
          <a href="#" className="upgrade">Upgrade</a>
        </div>
      )}

      <div className="ai-prompt-card">
        <textarea
          ref={taRef}
          className="ai-prompt-textarea"
          placeholder={placeholder}
          value={txt}
          onChange={(e) => { setTxt(e.target.value); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          aria-label="Message"
        />

        <div className="ai-prompt-toolbar">
          <button className="ai-prompt-tool ai-prompt-plus" title="Attach" aria-label="Attach">
            <Icons.plus size={16}/>
          </button>

          <div className="ai-prompt-model" ref={menuRef}>
            <button
              className="ai-prompt-model-btn"
              onClick={() => setModelOpen(v => !v)}
              aria-haspopup="menu"
              aria-expanded={modelOpen}
            >
              <span>{model}</span>
              <Icons.chevronDown size={11}/>
            </button>
            {modelOpen && (
              <div className="ai-prompt-model-menu" role="menu">
                {['GPT-4', 'GPT-4 Turbo', 'Claude Sonnet', 'Gemini Pro'].map(m => (
                  <button
                    key={m}
                    role="menuitem"
                    className={'ai-prompt-model-item' + (m === model ? ' is-active' : '')}
                    onClick={() => { setModel(m); setModelOpen(false); }}
                  >
                    <Icons.sparkle size={11}/>
                    <span>{m}</span>
                    {m === model && <Icons.check size={11} style={{ marginInlineStart: 'auto', color: 'var(--ember)' }}/>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="ai-prompt-spacer"/>

          <button
            className={'ai-prompt-send' + (txt.trim() ? ' is-ready' : '')}
            onClick={send}
            disabled={!txt.trim()}
            aria-label="Send message"
          >
            <Icons.arrowUp size={15}/>
          </button>
        </div>
      </div>

      {helper && (
        <div className="ai-prompt-helper">
          AI can make <i>mistakes</i> - please double-check
        </div>
      )}
    </div>
  );
};

// ─── Shell ─────────────────────────────────────────────────────────────
// Wraps every AI page: rail · top · scrollable main.
const AIShell = ({ activeNav, crumbs, onBack, topRight, children, contentClass = '' }: {
  activeNav?: any;
  crumbs?: any;
  onBack?: any;
  topRight?: React.ReactNode;
  children?: React.ReactNode;
  contentClass?: string;
}) => (
  <div className="ai-app">
    <AISidebar activeNav={activeNav}/>
    <div className="ai-main">
      <AITopbar crumbs={crumbs} onBack={onBack} right={topRight}/>
      <div className={'ai-content ' + contentClass}>
        {children}
      </div>
    </div>
  </div>
);

export {
  AIShell, AISidebar, AITopbar, AIPromptInput,
  useTheme as useAITheme,
  TOP_ITEMS as AI_TOP_ITEMS, PINNED as AI_PINNED, RECENTS as AI_RECENTS, YESTERDAY as AI_YESTERDAY,
};
