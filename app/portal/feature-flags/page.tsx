'use client';
// Forge — Feature flags console. Every flag across the bureau estate, with its
// type, rollout exposure and owner. Flags activate through the ring deployment,
// so a flag tagged ring-rollout inherits its targeting from the active rings and
// links straight into the deployment.
//
// Brief — Persona: any engineer shipping behind a flag + the release manager.
// Question: what is gated, how far has it rolled out, and what is moving right
// now? Data: FLAGS (src/portal/data/feature-flags.ts). Primary action: flip a
// boolean / open a rollout. Distinctive move: the ring-rollout chip ties a flag
// to the Ring 1 -> Ring 5 deployment that drives its traffic.
//
// Composes only Eidos DS + .fp-* classes. No tier; bureau services.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Select, Sparkline, Switch } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { FLAGS, KPIS, STATE_META, TYPE_LABEL, flagPct, type Flag, type FlagState } from '@/portal/data/feature-flags';

const ENV_FILTERS = [
  { value: 'all', label: 'All envs' },
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
];
const STATE_FILTERS = [
  { value: 'all', label: 'All status' },
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
  { value: 'rolling', label: 'Rolling out' },
  { value: 'multivariate', label: 'Multivariate' },
];

export default function FeatureFlagsPage() {
  const [query, setQuery] = React.useState('');
  const [env, setEnv] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  // Local optimistic toggle state for boolean flags.
  const [on, setOn] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(FLAGS.filter((f) => f.type === 'boolean').map((f) => [f.id, f.state === 'on'])),
  );

  const stateOf = (f: Flag): FlagState => (f.type === 'boolean' ? (on[f.id] ? 'on' : 'off') : f.state);

  const filtered = React.useMemo(() => {
    return FLAGS.filter((f) => {
      if (env !== 'all' && f.env !== env) return false;
      if (status !== 'all' && stateOf(f) !== status) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!f.key.toLowerCase().includes(q) && !f.desc.toLowerCase().includes(q) && !f.author.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, env, status, on]);

  return (
    <>
      <FPageHeader
        eyebrow="Delivery"
        title="Feature Flags"
        subtitle="See what's gated, how far each rollout has gone, and jump into the ring deployment driving it."
        actions={
          <>
            <Button variant="ghost"><Icons.book size={13} /> Docs</Button>
            <Button variant="ember"><Icons.plus size={13} /> New flag</Button>
          </>
        }
      />

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value" style={k.accent ? { color: 'var(--ember)' } : undefined}>{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 440, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Filter by key, description, owner…" aria-label="Filter flags" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={env} onValueChange={setEnv} options={ENV_FILTERS} width="150px" />
        </span>
        <span className="fp-filter-select">
          <Select value={status} onValueChange={setStatus} options={STATE_FILTERS} width="160px" />
        </span>
      </div>

      <FSection title="Flags" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Flag</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Targeting</th>
                  <th>Owner</th>
                  <th style={{ textAlign: 'end' }}>Modified</th>
                  <th style={{ textAlign: 'end' }} aria-label="Toggle" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => {
                  const st = STATE_META[stateOf(f)];
                  const exposure = flagPct(f);
                  return (
                    <tr key={f.id} className={f.ring ? 'fp-row-accent' : undefined}>
                      <td>
                        <span className="fp-flag-name">
                          <span className="mono" style={{ fontWeight: 600 }}>{f.key}</span>
                          {f.ring && (
                            <Link href="/portal/pipelines/run_8h2k9p" className="fp-ring-chip" aria-label="Open ring deployment">
                              <Icons.ring size={10} /> ring-rollout
                            </Link>
                          )}
                        </span>
                        <span className="fp-cell-sub">{f.desc}</span>
                      </td>
                      <td style={{ color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{TYPE_LABEL[f.type]}</td>
                      <td><Pill tone={st.tone} dot live={st.live}>{st.label}</Pill></td>
                      <td>
                        <span className="fp-flag-target">
                          <span className="fp-flag-spark"><Sparkline data={f.rollout} w={72} h={20} color={exposure > 0 ? 'var(--ember)' : 'var(--fg-faint)'} /></span>
                          <span className="mono" style={{ color: exposure > 0 ? 'var(--fg)' : 'var(--fg-muted)' }}>{exposure}%</span>
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{f.author}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{f.modified}</td>
                      <td style={{ textAlign: 'end' }}>
                        {f.type === 'boolean' ? (
                          <Switch
                            checked={!!on[f.id]}
                            onChange={() => setOn((s) => ({ ...s, [f.id]: !s[f.id] }))}
                            aria-label={`Toggle ${f.key}`}
                          />
                        ) : (
                          <Button variant="ghost" size="sm" aria-label={`Open ${f.key}`}><Icons.more size={13} /></Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FSection>

      {filtered.length === 0 && (
        <div className="fp-empty" style={{ marginBlockStart: 16 }}>
          <Icons.search size={18} />
          <span>No flags match this filter.</span>
        </div>
      )}
    </>
  );
}
