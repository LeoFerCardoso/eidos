'use client';
// Shared changelog view — the main DS changelog and every sub-DS changelog render through
// this so they are identical in structure. Each page passes its own `entries` + `dsName`.
import * as React from 'react';
import { Section, SubHead, ForgeMark, Icons, Mono } from '@/ds/core';

export type ChangelogEntry = {
  version: string; date: string; type: string; scope: string; title: string; summary: string;
};

const TYPES = [
  { id: 'feat', label: 'feature', pill: 'ember' },
  { id: 'fix', label: 'fix', pill: 'success' },
  { id: 'tokens', label: 'tokens', pill: 'ice' },
  { id: 'docs', label: 'docs', pill: '' },
  { id: 'a11y', label: 'a11y', pill: 'warning' },
  { id: 'rtl', label: 'rtl', pill: 'warning' },
  { id: 'breaking', label: 'breaking', pill: 'danger' },
];

export function ChangelogView({
  entries,
  id = 'changelog',
  num,
  title = 'Changelog',
  desc = 'Every meaningful change — searchable, filterable, scoped per component.',
  dsName = 'Forge Design System',
}: {
  entries: ChangelogEntry[];
  id?: string;
  num?: string;
  title?: string;
  desc?: string;
  dsName?: string;
}) {
  const [q, setQ] = React.useState('');
  const [activeTypes, setActiveTypes] = React.useState<Set<string>>(new Set());
  const [scope, setScope] = React.useState('all');

  const allScopes = React.useMemo(() => {
    const s = new Set(entries.map((e) => e.scope));
    return ['all', ...Array.from(s).sort()];
  }, [entries]);

  const toggleType = (id: string) => setActiveTypes((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const matches = React.useMemo(() => {
    const ql = q.toLowerCase().trim();
    return entries.filter((e) => {
      if (activeTypes.size && !activeTypes.has(e.type)) return false;
      if (scope !== 'all' && e.scope !== scope) return false;
      if (!ql) return true;
      const hay = (e.version + ' ' + e.title + ' ' + e.summary + ' ' + e.scope).toLowerCase();
      return hay.includes(ql);
    });
  }, [q, activeTypes, scope, entries]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, { version: string; date: string; entries: ChangelogEntry[] }>();
    for (const e of matches) {
      if (!map.has(e.version)) map.set(e.version, { version: e.version, date: e.date, entries: [] });
      map.get(e.version)!.entries.push(e);
    }
    return Array.from(map.values());
  }, [matches]);

  const typePill = (id: string) => TYPES.find((t) => t.id === id)?.pill || '';
  const typeLabel = (id: string) => TYPES.find((t) => t.id === id)?.label || id;

  return (
    <Section id={id} num={num} title={title} desc={desc}>
      {/* ─── Filter chrome ───────────────────────────────────────────── */}
      <div className="surface" style={{ padding: 14, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="in-group" style={{ minWidth: 240, flex: '1 1 240px' }}>
            <div className="in-addon icon" aria-hidden="true"><Icons.search size={14} /></div>
            <input className="in-control" placeholder="Search version, title, scope…" value={q} onChange={(e) => setQ(e.target.value)} spellCheck={false} autoComplete="off" />
            {q && <button className="in-addon btn" onClick={() => setQ('')} aria-label="Clear search"><Icons.x size={12} /></button>}
          </div>
          <select className="in-addon select" value={scope} onChange={(e) => setScope(e.target.value)} style={{ height: 36, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)' }} aria-label="Filter by scope">
            {allScopes.map((s) => <option key={s} value={s}>{s === 'all' ? 'All scopes' : s}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
          <span className="t-mono-label" style={{ padding: 0, marginInlineEnd: 6 }}>Type</span>
          {TYPES.map((t) => {
            const on = activeTypes.has(t.id);
            return (
              <button key={t.id} className={'pill ' + (on ? (t.pill || 'ember') : '')} style={on ? undefined : { opacity: 0.7 }} onClick={() => toggleType(t.id)} aria-pressed={on}>
                {on && <Icons.check size={10} />}{t.label}
              </button>
            );
          })}
          {(activeTypes.size > 0 || q || scope !== 'all') && (
            <button className="btn ghost xs" onClick={() => { setQ(''); setActiveTypes(new Set()); setScope('all'); }} style={{ marginInlineStart: 6 }}>Clear all</button>
          )}
        </div>
      </div>

      <p className="ds-caption">
        {matches.length === entries.length
          ? `${entries.length} changes across ${grouped.length} releases.`
          : `Showing ${matches.length} of ${entries.length} entries — across ${grouped.length} ${grouped.length === 1 ? 'release' : 'releases'}.`}
      </p>

      {/* ─── Timeline ────────────────────────────────────────────────── */}
      {grouped.length === 0 && (
        <div className="surface" style={{ padding: 28, textAlign: 'center', color: 'var(--fg-faint)', fontSize: 'var(--text-sm)' }}>No changes match your filters.</div>
      )}
      {grouped.map((g) => (
        <div key={g.version} style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span className="t-mono" style={{ color: 'var(--ember)', fontSize: 'var(--text-lg)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{g.version}</span>
            <span className="t-mono" style={{ color: 'var(--fg-subtle)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums' }}>{g.date}</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span className="t-mono-label" style={{ padding: 0, fontVariantNumeric: 'tabular-nums' }}>{g.entries.length} {g.entries.length === 1 ? 'change' : 'changes'}</span>
          </div>
          <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
            {g.entries.map((e, i) => (
              <div key={e.title + i} style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: 14, padding: '14px 18px', borderBottom: i < g.entries.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'baseline' }}>
                <span className={'pill ' + typePill(e.type)} style={{ minWidth: 78, justifyContent: 'center' }}>{typeLabel(e.type)}</span>
                <span className="t-mono" style={{ color: 'var(--fg-subtle)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', minWidth: 110 }}>{e.scope}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--fg)', marginBottom: 3, letterSpacing: '-0.005em' }}>{e.title}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>{e.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ─── Convention footer ─────────────────────────────────────── */}
      <SubHead meta="convention">How entries are written</SubHead>
      <p className="ds-caption" style={{ marginTop: -6 }}>
        One entry per logically-distinct change. Lead the title with a verb (added, replaced, fixed, removed). Summary names the failure mode the change addresses or the new capability shipped — never just "improved". Scope is the component slug, or one of <Mono>core / foundation / patterns / docs / shell</Mono>. Breaking changes get type <Mono>breaking</Mono> + a migration note in the summary.
      </p>

      <div style={{ marginTop: 56, padding: 36, border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', background: 'var(--bg-elevated)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-grid" />
        <div style={{ position: 'relative' }}>
          <ForgeMark size={32} />
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: '-0.02em', marginTop: 12 }}>{dsName}</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-subtle)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>Maintained by the Forge Platform Team · forge@equifax.com.br</div>
        </div>
      </div>
    </Section>
  );
}
