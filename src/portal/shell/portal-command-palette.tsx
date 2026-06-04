'use client';
// Forge — the ⌘K command palette. Same UX + .cp-* markup as the Eidos DS docs
// palette (src/components/layout/command-palette.tsx), but scoped to the PRODUCT
// instead of the DS nav: it searches portal destinations, services and actions.
//
// This is a SEED we grow as new screens land — add entries to buildEntries()
// (a navigate route, a service, a quick action) and they become searchable +
// keyboard-runnable for free. Keep it the single source of "where can I go /
// what can I do" in Forge.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/ds/core';
import { SERVICES } from '@/portal/data/services';

type Group = 'Navigate' | 'Service' | 'Action';

interface CmdEntry {
  id: string;
  label: string;
  group: Group;
  icon: keyof typeof Icons;
  href?: string;          // route to push
  onRun?: () => void;     // or an action to run (takes priority over href)
  hint?: string;          // trailing context (tribe, shortcut…)
  keywords?: string;      // extra fuzzy-match haystack
}

// Subsequence fuzzy match — identical to the DS palette so the feel is the same.
const fuzzy = (q: string, target: string) => {
  if (!q) return true;
  q = q.toLowerCase();
  target = target.toLowerCase();
  let i = 0;
  for (const ch of target) {
    if (ch === q[i]) i++;
    if (i === q.length) return true;
  }
  return false;
};

// The entry table. GROW THIS as screens ship — one object per destination/action.
function buildEntries(actions: { openAI: () => void }): CmdEntry[] {
  return [
    // Navigate — the live product IA (mirrors the sidebar rail's enabled routes).
    { id: 'nav-home',      label: 'Home',             group: 'Navigate', icon: 'home',    href: '/portal' },
    { id: 'nav-catalog',   label: 'Software Catalog', group: 'Navigate', icon: 'catalog', href: '/portal/catalog', keywords: 'services' },
    { id: 'nav-templates', label: 'Templates',        group: 'Navigate', icon: 'package', href: '/portal/create', keywords: 'golden path scaffold new service' },
    { id: 'nav-notifs',    label: 'Notifications',    group: 'Navigate', icon: 'bell',    href: '/portal/notifications', keywords: 'inbox alerts' },

    // Actions — quick verbs; this list is where future commands accrue.
    { id: 'act-ai', label: 'Ask Forge AI', group: 'Action', icon: 'sparkle', onRun: actions.openAI, keywords: 'copilot assistant chat estate' },

    // Services — every catalog service is jump-to-able by name / tribe / lang.
    ...SERVICES.map((s): CmdEntry => ({
      id: `svc-${s.id}`,
      label: s.name,
      group: 'Service',
      icon: 'server',
      href: `/portal/catalog/${s.id}`,
      hint: s.tribe,
      keywords: `${s.tribe} ${s.lang} ${s.summary}`,
    })),
  ];
}

export function PortalCommandPalette({
  open,
  onClose,
  onOpenAI,
}: {
  open: boolean;
  onClose: () => void;
  onOpenAI: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const items = React.useMemo(() => buildEntries({ openAI: onOpenAI }), [onOpenAI]);
  const matches = React.useMemo(
    () => (q ? items.filter((i) => fuzzy(q, [i.label, i.group, i.hint, i.keywords].filter(Boolean).join(' '))) : items),
    [q, items],
  );

  React.useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  React.useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const run = (it: CmdEntry) => {
    onClose();
    if (it.onRun) it.onRun();
    else if (it.href) router.push(it.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (matches[active]) run(matches[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  return (
    <div className="cp-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cp" onClick={(e) => e.stopPropagation()}>
        <div className="cp-search">
          <Icons.search size={14} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search services, screens and actions…"
            spellCheck={false}
            autoComplete="off"
            aria-label="Search Forge"
          />
          <span className="kbd">esc</span>
        </div>
        <div className="cp-results" role="listbox">
          {matches.length === 0 && <div className="cp-empty">No matches for &ldquo;{q}&rdquo;</div>}
          {matches.slice(0, 80).map((m, i) => {
            const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[m.icon] ?? Icons.circle;
            return (
              <a
                key={m.id}
                href={m.href ?? '#'}
                className={'cp-row' + (i === active ? ' is-active' : '')}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={(e) => { e.preventDefault(); run(m); }}
              >
                <span className="cp-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                  <Icon size={14} aria-hidden="true" />
                  {m.label}
                </span>
                <span className="cp-trail">{m.hint ? `${m.group} · ${m.hint}` : m.group}</span>
              </a>
            );
          })}
        </div>
        <div className="cp-foot">
          <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span><span className="kbd">↵</span> open</span>
          <span><span className="kbd">esc</span> close</span>
          <span style={{ marginInlineStart: 'auto', color: 'var(--fg-faint)' }}>
            {matches.length} of {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}
