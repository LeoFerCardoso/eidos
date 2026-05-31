'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DSIcon } from './ds-icon';
import { NAV_FLAT, DESIGN_SYSTEMS } from '@/lib/nav';

const DS_LABEL = Object.fromEntries(DESIGN_SYSTEMS.map((d) => [d.id, d.label]));

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

/** ⌘K palette — mirrors the legacy .cp-* markup, driven by the typed nav + Next router. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(
    () => NAV_FLAT.map((i) => ({ ...i, hay: [i.label, DS_LABEL[i.ds], i.group, i.subgroup, i.slug].filter(Boolean).join(' ') })),
    [],
  );
  const matches = useMemo(() => (q ? items.filter((i) => fuzzy(q, i.hay)) : items), [q, items]);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const go = (it: (typeof matches)[number]) => {
    onClose();
    router.push(it.href);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (matches[active]) go(matches[active]); }
  };

  return (
    <div className="cp-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cp" onClick={(e) => e.stopPropagation()}>
        <div className="cp-search">
          <DSIcon name="search" size={14} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search components, foundations, patterns…"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="kbd">esc</span>
        </div>
        <div className="cp-results" role="listbox">
          {matches.length === 0 && <div className="cp-empty">No matches for &ldquo;{q}&rdquo;</div>}
          {matches.slice(0, 80).map((m, i) => (
            <a
              key={m.slug}
              href={m.href}
              className={'cp-row' + (i === active ? ' is-active' : '')}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={(e) => { e.preventDefault(); go(m); }}
            >
              <span className="cp-label">{m.label}</span>
              <span className="cp-trail">
                <span className="cp-group">
                  {DS_LABEL[m.ds]}
                  {m.group ? ' · ' + m.group : ''}
                  {m.subgroup ? ' · ' + m.subgroup : ''}
                </span>
              </span>
            </a>
          ))}
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
