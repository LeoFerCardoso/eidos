'use client';
// Forge — the IDP Portal product shell (built on the Eidos Design System).
//
// Naming: the DESIGN SYSTEM is "Eidos"; the PRODUCT/portal is "Forge". The
// AI copilot is "Forge AI" ("Ask Forge AI"). "Design system" links point back
// to Eidos at "/"; everything else is Forge.
//
// Architecture: uses the DS <Sidebar collapsible="icon"> component (replaces
// the legacy .fp-rail icon-only rail). Sidebar open state is lifted to
// PortalShell and passed to both the Sidebar and PortalTopbar so the topbar
// toggle button can control it. Theme uses next-themes (already mounted in
// app/layout.tsx via ThemeProvider) with a mounted-guard to prevent the
// SSR hydration mismatch that the old ad-hoc useTheme caused.
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Sidebar,
  SidebarSection,
  SidebarItem,
  SidebarFooter,
  Icons,
  ForgeMark,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Popover,
  Drawer,
  Avatar,
} from '@/ds/core';
import { useColorTheme, type ColorTheme } from '@/components/color-theme-provider';
import { ForgeAIChat } from './forge-ai-chat';
import { PortalCommandPalette } from './portal-command-palette';
import { usePersistentState } from './use-persistent-state';
import { NotifRow } from '@/portal/notifications/notif-row';
import { NOTIFS, NOTIF_PREVIEW, filterByTab, type NotifTab } from '@/portal/data/notifications';

// Re-export the shared layout helpers so portal pages can import from here
// without changing their import paths.
export { FPageHeader, FSection, FKpi, IconBubble } from '@/ds/examples/example-shell';
export { FSearch, type FSearchProps } from './fsearch';
export { FCardHead, FRows, FRow, Sub } from './layout';

// useLayoutEffect on the client, useEffect on the server (no SSR warning).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

// ── Page crumb context ──────────────────────────────────────────────────────
// Lets a page push the trailing breadcrumb segment into the topbar instead of
// repeating it as an in-page header. By default it APPENDS (e.g. the chat title
// under "Chat"); `replace: true` swaps the last base segment instead — used by
// the agent detail page so a raw id ("…/agents/sre") reads as the agent name.
type PageCrumb = { label: string; replace?: boolean } | null;
const PageCrumbContext = React.createContext<{ crumb: PageCrumb; setCrumb: (c: PageCrumb) => void }>({
  crumb: null,
  setCrumb: () => {},
});
export const usePageCrumb = () => React.useContext(PageCrumbContext);

// ── Rail items ────────────────────────────────────────────────────────────────

type RailItem = {
  key: string;
  icon: string;
  label: string;
  href?: string; // present → live link; absent → disabled (coming soon)
};

// Product IA — live routes have an href; the rest are disabled (vision placeholders).
const RAIL: RailItem[] = [
  { key: 'home',          icon: 'home',    label: 'Home',          href: '/portal' },
  { key: 'notifications', icon: 'bell',    label: 'Notifications', href: '/portal/notifications' },
  { key: 'chat',          icon: 'chat',    label: 'Chat',          href: '/portal/chat' },
  { key: 'catalog',       icon: 'server',  label: 'Catalog',       href: '/portal/catalog' },
  { key: 'agents',        icon: 'agent',   label: 'Agents',        href: '/portal/agents' },
  { key: 'create',     icon: 'package',    label: 'Templates',    href: '/portal/create' },
  { key: 'pipelines',  icon: 'pipeline',   label: 'Pipelines'                     },
  { key: 'fraud',      icon: 'shield',     label: 'Fraud & Risk'                  },
  { key: 'dora',       icon: 'gauge',      label: 'DORA'                          },
  { key: 'scorecards', icon: 'score',      label: 'Scorecards'                    },
  { key: 'incidents',  icon: 'incident',   label: 'Incidents'                     },
  { key: 'compliance', icon: 'compliance', label: 'LGPD & Audit'                  },
];

// ── Active key ────────────────────────────────────────────────────────────────

function activeKey(pathname: string): string {
  if (pathname.startsWith('/portal/catalog')) return 'catalog';
  if (pathname === '/portal' || pathname === '/portal/') return 'home';
  const seg = pathname.split('/')[2];
  return seg || 'home';
}

// ── Breadcrumb labels ─────────────────────────────────────────────────────────

const CRUMB_LABELS: Record<string, string> = {
  portal:        'Forge',
  catalog:       'Catalog',
  agents:        'Agents',
  create:        'Templates',
  assistant:     'Forge AI',
  notifications: 'Notifications',
  chat:          'Chat',
};

function buildCrumbs(pathname: string): { label: string; href?: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  return parts.map((p, i) => {
    const href = '/' + parts.slice(0, i + 1).join('/');
    const label = CRUMB_LABELS[p] ?? p;
    return i === parts.length - 1 ? { label } : { label, href };
  });
}

// ── Workspace data ────────────────────────────────────────────────────────────

type Workspace = { initials: string; name: string; region: string };

const WORKSPACES: Workspace[] = [
  { initials: 'EB', name: 'Equifax BVS',       region: 'Brazil · Latam'              },
  { initials: 'EU', name: 'Equifax USIS',       region: 'USA · North America'         },
  { initials: 'EC', name: 'Equifax Canada',     region: 'Canada · North America'      },
  { initials: 'EI', name: 'Equifax UK&I',       region: 'United Kingdom · Europe'     },
  { initials: 'EA', name: 'Equifax Australia',  region: 'Australia · Asia Pacific'    },
];

// ── Workspace switcher avatar chip ────────────────────────────────────────────

const WsAvatar = ({
  initials,
  size = 28,
}: {
  initials: string;
  size?: number;
}) => (
  <span
    aria-hidden="true"
    style={{
      width: size,
      height: size,
      minWidth: size,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--ember-soft)',
      color: 'var(--ember)',
      fontWeight: 700,
      fontSize: size * 0.39,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      letterSpacing: '-0.01em',
    }}
  >
    {initials}
  </span>
);

// ── Workspace header ──────────────────────────────────────────────────────────
// Expanded: avatar + two-line name/region + chevron; acts as a DropdownMenu trigger.
// Collapsed: centered avatar only — clicking still opens the workspace menu.
// The DS sidebar renders its own internal .sb-toggle button; we suppress it
// via CSS in example-shell.css so the ONLY collapse control is the topbar button.

const WorkspaceHeader = ({
  collapsed,
  current,
  onSelect,
}: {
  collapsed: boolean;
  current: number;
  onSelect: (i: number) => void;
}) => {
  const ws = WORKSPACES[current] ?? WORKSPACES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          style={{
            // Full-bleed 48px band so the header height + bottom border align
            // exactly with the topbar (48px grid row). marginInline:-8 + width
            // calc cancel the .sb-rail 8px side padding so the divider spans the
            // full rail width; .sb-rail padding-block-start is zeroed in CSS so
            // the band starts flush at the top.
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 48,
            paddingBlock: 0,
            paddingInline: collapsed ? 0 : 14,
            marginInline: -8,
            width: 'calc(100% + 16px)',
            marginBlockEnd: 8,
            overflow: 'hidden',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
            textAlign: 'start',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'background .12s ease',
          }}
          aria-label={`Switch workspace — current: ${ws.name}`}
        >
          <WsAvatar initials={ws.initials} size={32} />
          {!collapsed && (
            <>
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'var(--fg)',
                    lineHeight: 1.3,
                  }}
                >
                  {ws.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--fg-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.3,
                  }}
                >
                  {ws.region}
                </span>
              </span>
              <Icons.chevronDown
                size={13}
                style={{ flexShrink: 0, color: 'var(--fg-faint)' } as React.CSSProperties}
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="fp-menu-flush">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {WORKSPACES.map((w, i) => (
          <DropdownMenuItem key={w.name} onSelect={() => onSelect(i)}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
              }}
            >
              <WsAvatar initials={w.initials} size={20} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontWeight: 500,
                    fontSize: 'var(--text-sm)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {w.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--fg-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {w.region}
                </span>
              </span>
              {i === current && (
                <Icons.check
                  size={13}
                  style={{ color: 'var(--ember)', flexShrink: 0 } as React.CSSProperties}
                />
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ── Notifications panel ───────────────────────────────────────────────────────
// A wide Popover (not the narrow DropdownMenu) so it can hold tabs, actor
// avatars, inline approve/decline actions and file chips — the richer inbox
// pattern. It is a PREVIEW: it shows the first NOTIF_PREVIEW rows, then a styled
// footer links to the dedicated /portal/notifications inbox for the full list.
// Data + the row component are shared with that page (src/portal/data +
// src/portal/notifications). Unread rows carry an ember-soft band; ember stays
// the single accent (the soft tint + one primary "Approve").

const NotificationsPanel = () => {
  const [tab, setTab] = React.useState<NotifTab>('all');
  const [read, setRead] = React.useState<Record<string, boolean>>({});

  const markRead = React.useCallback((id: string) => setRead((r) => (r[id] ? r : { ...r, [id]: true })), []);
  const markAll = () => setRead(Object.fromEntries(NOTIFS.map((n) => [n.id, true])));

  const rows = NOTIFS.map((n) => ({ ...n, unread: n.unread && !read[n.id] }));
  const filtered = filterByTab(rows, tab);
  const preview = filtered.slice(0, NOTIF_PREVIEW);

  const allCount = rows.filter((n) => n.unread && !n.archived).length;
  const followingCount = rows.filter((n) => n.following && n.unread && !n.archived).length;
  const hasUnread = allCount > 0;

  return (
    <Popover
      align="end"
      sideOffset={10}
      className="fp-notif-pop"
      aria-label="Notifications"
      trigger={
        <button
          type="button"
          className={`fp-topbar-icon${hasUnread ? ' has-dot' : ''}`}
          title="Notifications"
          aria-label={`Notifications${hasUnread ? `, ${allCount} unread` : ''}`}
        >
          <Icons.bell size={16} />
        </button>
      }
    >
      {({ close }) => (
        <>
          <div className="fp-notif-head">
            <span className="fp-notif-title">Notifications</span>
            <button type="button" className="fp-notif-link" onClick={markAll} disabled={!hasUnread}>
              Mark all as read
            </button>
          </div>

          <div className="fp-notif-tabs" role="tablist" aria-label="Notification filter">
            {([
              ['all', 'All', allCount],
              ['following', 'Following', followingCount],
              ['archive', 'Archive', 0],
            ] as [NotifTab, string, number][]).map(([id, label, count]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={`fp-notif-tab${tab === id ? ' is-active' : ''}`}
                onClick={() => setTab(id)}
              >
                {label}
                {count > 0 && <span className="fp-notif-count">{count}</span>}
              </button>
            ))}
            <button type="button" className="fp-notif-gear" aria-label="Notification settings">
              <Icons.settings size={14} />
            </button>
          </div>

          <div className="fp-notif-list">
            {preview.length === 0 ? (
              <div className="fp-notif-empty">
                <Icons.inbox size={18} />
                <span>You're all caught up.</span>
              </div>
            ) : (
              preview.map((n) => <NotifRow key={n.id} n={n} onRead={markRead} />)
            )}
          </div>

          {/* Styled footer — the bell is a preview; the full feed lives in the inbox. */}
          <Link href="/portal/notifications" className="fp-notif-foot" onClick={close}>
            <Icons.inbox size={14} />
            <span>View all notifications</span>
            {filtered.length > preview.length && (
              <span className="fp-notif-foot-more">+{filtered.length - preview.length}</span>
            )}
            <Icons.chevronRight size={14} />
          </Link>
        </>
      )}
    </Popover>
  );
};

// ── User menu ─────────────────────────────────────────────────────────────────
// The avatar opens a Popover account menu: identity header, navigation rows
// with leading icons + shortcut hints, a plan/usage strip with an Upgrade CTA,
// and a sign-out footer. Inspired by the account-menu reference, retoned to
// Eidos (single ember accent, Geist Mono shortcuts).

type UserRow = { icon: keyof typeof Icons; label: string; shortcut?: string; href?: string };

const USER_ROWS: UserRow[] = [
  { icon: 'user',     label: 'Profile',       href: '/portal' },
  { icon: 'activity', label: 'My activity',   href: '/portal' },
  { icon: 'settings', label: 'Settings',      shortcut: '⌘,' },
  { icon: 'command',  label: 'Command menu',  shortcut: '⌘K' },
];

// Appearance — a true submenu INSIDE the account menu (replaces the old standalone
// topbar ThemePicker). It carries both DS axes — dark/light mode + accent theme —
// the same controls as the DS docs picker. The flyout is rendered as a panel
// DESCENDANT (not portaled) so the parent Popover's click-outside never fires when
// you pick an option; it opens to the inline-start since the menu hugs the topbar's
// trailing edge. Selecting an option keeps both menus open so you can tune freely.
const AppearanceSubmenu = () => {
  const { theme, setTheme, themes } = useColorTheme();
  const { resolvedTheme, setTheme: setMode } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Submenu opens to the inline-start with a small gap; closing instantly on
  // mouseleave makes the diagonal trip to the flyout lose it mid-way. Hold the
  // close on a short timer so crossing the gap (and moving diagonally) re-enters
  // and cancels it before it fires.
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);
  const openSub = React.useCallback(() => { cancelClose(); setOpen(true); }, [cancelClose]);
  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  }, [cancelClose]);
  React.useEffect(() => cancelClose, [cancelClose]);

  const mode = mounted ? resolvedTheme ?? 'dark' : 'dark';
  const current = themes.find((t) => t.id === theme) ?? themes[0];

  return (
    <div
      className="fp-user-sub"
      onMouseEnter={openSub}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="fp-user-row"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => { cancelClose(); setOpen((o) => !o); }}
      >
        <Icons.palette size={15} />
        <span className="label">Appearance</span>
        <span className="fp-user-sub-val">{current.label} · {mode === 'dark' ? 'Dark' : 'Light'}</span>
        <Icons.chevronRight size={14} />
      </button>

      {open && (
        <div className="fp-user-flyout" role="menu" aria-label="Appearance">
          <span className="fp-user-flyout-label">Mode</span>
          {([['light', 'Light', 'sun'], ['dark', 'Dark', 'moon']] as const).map(([val, label, icon]) => {
            const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[icon];
            return (
              <button
                key={val}
                type="button"
                role="menuitemradio"
                aria-checked={mode === val}
                className="fp-user-opt"
                onClick={() => setMode(val)}
              >
                <Icon size={14} />
                <span className="label">{label}</span>
                {mode === val && <Icons.check size={14} />}
              </button>
            );
          })}

          <span className="fp-user-flyout-sep" />
          <span className="fp-user-flyout-label">Accent</span>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              role="menuitemradio"
              aria-checked={theme === t.id}
              className="fp-user-opt"
              onClick={() => setTheme(t.id as ColorTheme)}
            >
              <span className="fp-user-swatch" style={{ background: t.swatch }} aria-hidden="true" />
              <span className="label">{t.label}</span>
              {theme === t.id && <Icons.check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const UserMenu = () => (
  <Popover
    align="end"
    sideOffset={10}
    className="fp-user-pop"
    aria-label="Account menu"
    trigger={
      <button type="button" className="fp-topbar-user" title="Leonardo Cardoso" aria-label="Account menu">
        LC
      </button>
    }
  >
    {({ close }) => (
      <>
        <div className="fp-user-head">
          <span className="fp-user-av" aria-hidden="true">LC</span>
          <span className="fp-user-id">
            <span className="name">Leonardo Cardoso</span>
            <span className="email">leofercardoso@gmail.com</span>
          </span>
        </div>

        <div className="fp-user-group">
          {USER_ROWS.map((r) => {
            const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[r.icon] ?? Icons.circle;
            const body = (
              <>
                <Icon size={15} />
                <span className="label">{r.label}</span>
                {r.shortcut && <span className="kbd">{r.shortcut}</span>}
              </>
            );
            return r.href ? (
              <Link key={r.label} href={r.href} className="fp-user-row" onClick={close}>
                {body}
              </Link>
            ) : (
              <button key={r.label} type="button" className="fp-user-row" onClick={close}>
                {body}
              </button>
            );
          })}
          <AppearanceSubmenu />
        </div>

        <div className="fp-user-plan">
          <div className="fp-user-plan-top">
            <span className="fp-user-plan-name">Platform plan</span>
            <Link href="/portal/create" className="btn ember sm" onClick={close}>Upgrade</Link>
          </div>
          <div className="fp-user-usage">
            <div className="fp-user-usage-bar"><span style={{ inlineSize: '64%' }} /></div>
            <span className="fp-user-usage-label">AI credits · 3.2k / 5k this month</span>
          </div>
        </div>

        <div className="fp-user-group">
          <button type="button" className="fp-user-row" onClick={close}>
            <Icons.externalLink size={15} />
            <span className="label">Sign out</span>
          </button>
        </div>
      </>
    )}
  </Popover>
);

// ── TopBar ────────────────────────────────────────────────────────────────────
// Order (inline-end): Forge AI · notifications · avatar. Appearance (mode +
// accent) now lives as a submenu INSIDE the avatar account menu, not as a
// standalone control. Forge AI opens an in-context slide-over drawer;
// notifications + avatar open rich Popovers; the search opens the ⌘K palette.

const PortalTopbar = ({
  pathname,
  sidebarOpen,
  onToggleSidebar,
  onOpenAI,
  onOpenPalette,
  pageCrumb,
}: {
  pathname: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenAI: () => void;
  onOpenPalette: () => void;
  pageCrumb: PageCrumb;
}) => {
  const base = buildCrumbs(pathname);
  // A page-supplied crumb becomes the trailing segment. `replace` swaps the last
  // base segment (e.g. a raw id) for it; otherwise it appends under the section,
  // turning the prior last crumb into a link back.
  const crumbs = !pageCrumb
    ? base
    : pageCrumb.replace
      ? [...base.slice(0, -1), { label: pageCrumb.label }]
      : [...base.slice(0, -1), { label: base[base.length - 1]?.label ?? '', href: pathname }, { label: pageCrumb.label }];

  return (
    <header className="fp-topbar">
      {/* Sidebar collapse/expand toggle — first in the breadcrumb area */}
      <button
        type="button"
        className="btn ghost sm"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        onClick={onToggleSidebar}
        style={{ flexShrink: 0 }}
      >
        <Icons.panelLeft size={16} />
      </button>

      <nav className="fp-crumbs" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            {c.href ? (
              <Link href={c.href} className="link">
                {c.label}
              </Link>
            ) : (
              <span className="cur" aria-current="page">
                {c.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <button
        type="button"
        className="fp-topbar-search"
        onClick={onOpenPalette}
        aria-label="Search Forge — open command palette"
      >
        <Icons.search size={13} />
        <span className="label">Search services, screens, actions…</span>
        <span className="kbd">⌘K</span>
      </button>

      <div className="fp-topbar-actions">
        {/* Forge AI — opens the copilot in an in-context slide-over drawer */}
        <button
          type="button"
          className="fp-topbar-icon"
          title="Forge AI"
          aria-label="Open Forge AI"
          onClick={onOpenAI}
        >
          <Icons.sparkle size={16} />
        </button>

        {/* Notifications — rich Popover inbox */}
        <NotificationsPanel />

        {/* Account — Popover menu */}
        <UserMenu />
      </div>
    </header>
  );
};

// ── Portal shell ──────────────────────────────────────────────────────────────

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/portal';
  const active = activeKey(pathname);
  // The Chat surface is full-bleed (its own sub-sidebar + independent scroll),
  // so it opts out of the padded, max-width content column.
  const fullBleed = pathname.startsWith('/portal/chat');
  // The Agent detail (/portal/agents/<id>) is a fixed-height two-pane layout —
  // its left column and sidebar scroll independently, so the main area doesn't
  // scroll as a whole.
  const paneled = /^\/portal\/agents\/(?!new$)[^/]+$/.test(pathname);
  const [sidebarOpen, setSidebarOpen] = usePersistentState('forge.sidebar.open', true);
  const [workspace, setWorkspace] = usePersistentState('forge.workspace', 0);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [pageCrumb, setPageCrumb] = React.useState<PageCrumb>(null);
  const crumbCtx = React.useMemo(() => ({ crumb: pageCrumb, setCrumb: setPageCrumb }), [pageCrumb]);
  // Drop any page-supplied crumb when navigating away from its route. This runs
  // as a layout effect (before paint) so a page that re-sets its crumb in a
  // mount useEffect (which runs after) wins instead of being cleared by it.
  useIsomorphicLayoutEffect(() => { setPageCrumb(null); }, [pathname]);

  // ⌘K / Ctrl+K toggles the command palette anywhere in the portal.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <PageCrumbContext.Provider value={crumbCtx}>
    <div className="fp-app">
      {/* DS Sidebar — controlled, collapsible to icon-only rail.
          The Sidebar's own internal .sb-toggle button is hidden via CSS
          in example-shell.css (.fp-app > .sb-rail .sb-toggle { display: none })
          so the ONLY collapse trigger is the topbar panelLeft button above. */}
      <Sidebar
        collapsible="icon"
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        aria-label="Forge — primary navigation"
      >
        <WorkspaceHeader collapsed={!sidebarOpen} current={workspace} onSelect={setWorkspace} />

        <SidebarSection>
          {RAIL.map((it) => {
            const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[it.icon] ?? Icons.circle;
            // Live routes navigate client-side via the Slot pattern (<SidebarItem
            // asChild><Link/></SidebarItem>) so the shell + its state persist
            // across navigation. Disabled (vision-placeholder) items stay a bare
            // non-interactive anchor.
            if (it.href) {
              return (
                <SidebarItem
                  key={it.key}
                  asChild
                  icon={<Icon size={16} />}
                  active={it.key === active}
                  tooltip={it.label}
                >
                  <Link href={it.href}>{it.label}</Link>
                </SidebarItem>
              );
            }
            return (
              <SidebarItem
                key={it.key}
                href="#"
                icon={<Icon size={16} />}
                tooltip={it.label}
                aria-disabled
                onClick={(e: React.MouseEvent) => e.preventDefault()}
                style={{ opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none' }}
              >
                {it.label}
              </SidebarItem>
            );
          })}
        </SidebarSection>

        {/* Footer: brand mark only — Forge AI has moved to the topbar */}
        <SidebarFooter>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingInline: sidebarOpen ? 14 : 0,
              paddingBlock: 10,
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}
          >
            <ForgeMark size={18} />
            {sidebarOpen && (
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                  color: 'var(--fg-muted)',
                  letterSpacing: '-0.01em',
                }}
              >
                Forge
              </span>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>

      <PortalTopbar
        pathname={pathname}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onOpenAI={() => setAiOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
        pageCrumb={pageCrumb}
      />

      <main className={'fp-main' + (fullBleed ? ' fp-main--full' : paneled ? ' fp-main--panes' : '')}>{children}</main>

      {/* Forge AI — in-context copilot slide-over (same thread as /portal/assistant) */}
      <Drawer
        open={aiOpen}
        side="right"
        onClose={() => setAiOpen(false)}
        className="fp-ai-drawer"
        style={{ ['--dr-w' as string]: '480px' } as React.CSSProperties}
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icons.sparkle size={16} style={{ color: 'var(--ember)' } as React.CSSProperties} />
            Forge AI
          </span>
        }
        desc="Reads your estate and acts on it."
        headerActions={
          <Link
            href="/portal/assistant"
            className="dr-header-action"
            title="Open the full Forge AI page"
            aria-label="Open the full Forge AI page"
            onClick={() => setAiOpen(false)}
          >
            <Icons.maximize size={16} />
          </Link>
        }
      >
        {aiOpen && <ForgeAIChat />}
      </Drawer>

      {/* ⌘K command palette — product-scoped (services · screens · actions). Grows
          as new screens ship (see buildEntries in portal-command-palette). */}
      <PortalCommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenAI={() => setAiOpen(true)}
      />
    </div>
    </PageCrumbContext.Provider>
  );
}
