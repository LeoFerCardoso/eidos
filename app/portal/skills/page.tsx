'use client';
// Forge — Skills marketplace. Packaged abilities an agent can invoke, official
// (Platform team) or community (bureau engineers). This catalog is the single
// source: everything here is selectable in the agent wizard's Knowledge step.
//
// Brief — Persona: any engineer building or tuning an agent. Question: what
// abilities can I give my agent, which are trusted, and which are popular?
// Data: SKILLS (src/portal/data/skills.ts). Primary action: add a skill to an
// agent (or publish one). Distinctive move: official vs community provenance
// with install counts, so trust and adoption read at a glance.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { SKILLS, SKILL_CATEGORIES, type Skill } from '@/portal/data/skills';

const SOURCES = ['All', 'Official', 'Community'] as const;
type Source = (typeof SOURCES)[number];

const SORTS = [
  { value: 'popular', label: 'Most installed' },
  { value: 'rating', label: 'Top rated' },
  { value: 'az', label: 'A to Z' },
];

function SkillCard({ s }: { s: Skill }) {
  const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[s.icon] ?? Icons.zap;
  return (
    <div className="fp-skill">
      <div className="fp-skill-top">
        <span className={'fp-skill-ic' + (s.official ? '' : ' is-muted')} aria-hidden="true"><Icon size={18} /></span>
        <Pill tone={s.official ? 'ember' : 'neutral'} dot={s.official}>
          {s.official ? 'Official' : 'Community'}
        </Pill>
      </div>
      <span className="fp-skill-name">{s.name}</span>
      <p className="fp-skill-desc">{s.desc}</p>
      <div className="fp-skill-foot">
        <span className="fp-skill-meta">
          <Icons.star size={12} /> {s.rating.toFixed(1)}
          <span className="fp-skill-dot">·</span>
          {s.installs} agents
        </span>
        <span className="fp-skill-cat">{s.category}</span>
      </div>
      <div className="fp-skill-actions">
        <Button variant="outline" size="sm"><Icons.plus size={12} /> Add to agent</Button>
        <span className="fp-skill-ver mono">{s.version}</span>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const [query, setQuery] = React.useState('');
  const [source, setSource] = React.useState<Source>('All');
  const [cat, setCat] = React.useState('all');
  const [sort, setSort] = React.useState('popular');

  const filtered = React.useMemo(() => {
    let list = SKILLS;
    if (source === 'Official') list = list.filter((s) => s.official);
    else if (source === 'Community') list = list.filter((s) => !s.official);
    if (cat !== 'all') list = list.filter((s) => s.category === cat);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.author.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sort === 'popular') sorted.sort((a, b) => b.installs - a.installs);
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [query, source, cat, sort]);

  const catOptions = [{ value: 'all', label: 'All categories' }, ...SKILL_CATEGORIES.map((c) => ({ value: c, label: c }))];

  return (
    <>
      <FPageHeader
        eyebrow="Marketplace"
        title="Skills"
        subtitle="Browse packaged abilities, official and community, and drop them into any agent."
        actions={
          <>
            <Button variant="ghost"><Icons.book size={13} /> Author guide</Button>
            <Button variant="ember"><Icons.plus size={13} /> Publish skill</Button>
          </>
        }
      />

      {/* Provenance chips */}
      <div role="group" aria-label="Source" style={{ display: 'flex', gap: 6, marginBlockEnd: 'var(--fp-filter-gap, 14px)', flexWrap: 'wrap' }}>
        {SOURCES.map((sName) => (
          <Pill
            key={sName}
            tone={source === sName ? 'ember' : 'neutral'}
            dot={source === sName}
            role="radio"
            aria-checked={source === sName}
            tabIndex={0}
            style={{ cursor: 'pointer', border: '1px solid var(--border)', fontWeight: source === sName ? 600 : 500 }}
            onClick={() => setSource(sName)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSource(sName); } }}
          >
            {sName}
          </Pill>
        ))}
      </div>

      {/* Toolbar */}
      <div className="fp-toolbar">
        <div style={{ flex: 1, minWidth: 240, maxWidth: 460, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search skills, authors…" aria-label="Search skills" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={cat} onValueChange={setCat} options={catOptions} width="170px" />
        </span>
        <span className="fp-filter-select">
          <Select value={sort} onValueChange={setSort} options={SORTS} width="160px" />
        </span>
      </div>

      <div className="fp-grid fp-grid-auto" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        {filtered.map((s) => (
          <SkillCard key={s.id} s={s} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="fp-empty" style={{ marginBlockStart: 16 }}>
          <Icons.search size={18} />
          <span>No skills match this filter.</span>
        </div>
      )}
    </>
  );
}
