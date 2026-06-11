'use client';
// Forge · Access control. Humans AND agents on one plane: the agentic platform's
// deepest claim made literal (agent as a first-class principal with the same RBAC
// rigor as a human). Master-detail: pick a principal, see its identity, granted
// Actions, scopes and autonomy level. See docs/AGENTIC-PLATFORM-VISION.md §7.5.
//
// Brief · Persona: platform owner / security. Question: who (human or agent) can
// do what, where, and which agents are over-privileged? Data: PRINCIPALS +
// REQUESTS (src/portal/data/access.ts). Primary action: review an identity /
// approve an access request. Distinctive move: agents carry an autonomy ramp and
// the same grant model as humans, in one matrix.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Avatar } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  PRINCIPALS, REQUESTS, KPIS, AUTONOMY_ORDER, AUTONOMY_META,
  type Principal, type PrincipalKind,
} from '@/portal/data/access';
import { getAction } from '@/portal/data/actions';

const TYPES: { value: PrincipalKind | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'human', label: 'Humans' },
  { value: 'agent', label: 'Agents' },
];

function KindBadge({ kind }: { kind: PrincipalKind }) {
  return kind === 'agent' ? (
    <span className="fp-acc-kind is-agent"><Icons.agent size={11} /> Agent</span>
  ) : (
    <span className="fp-acc-kind"><Icons.user size={11} /> Human</span>
  );
}

// The autonomy ramp — a 4-rung ladder, current level filled.
function AutonomyRamp({ p }: { p: Principal }) {
  if (!p.autonomy) return null;
  const idx = AUTONOMY_ORDER.indexOf(p.autonomy);
  return (
    <div className="fp-acc-ramp">
      <div className="fp-acc-ramp-head">
        <span className="t">Autonomy</span>
        {p.successRate !== undefined && (
          <span className="fp-acc-ramp-rate mono">{p.successRate}% verified</span>
        )}
      </div>
      <div className="fp-acc-rungs" role="img" aria-label={`Autonomy level: ${AUTONOMY_META[p.autonomy].label}`}>
        {AUTONOMY_ORDER.map((lvl, i) => (
          <span key={lvl} className={`fp-acc-rung${i <= idx ? ' is-on' : ''}${i === idx ? ' is-cur' : ''}`}>
            <span className="bar" />
            <span className="lbl">{AUTONOMY_META[lvl].label}</span>
          </span>
        ))}
      </div>
      <p className="fp-acc-ramp-blurb">{AUTONOMY_META[p.autonomy].blurb}</p>
    </div>
  );
}

function PrincipalRow({ p, selected, onSelect }: { p: Principal; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={`fp-acc-row${selected ? ' is-sel' : ''}`} onClick={onSelect} aria-pressed={selected}>
      <Avatar name={p.name} size={32} />
      <span className="fp-acc-row-id">
        <span className="nm">{p.name}</span>
        <span className="rl">{p.role}</span>
      </span>
      <KindBadge kind={p.kind} />
      {p.autonomy && <span className="fp-acc-auto mono">{AUTONOMY_META[p.autonomy].label}</span>}
      {p.overPrivileged && (
        <span className="fp-acc-warn" title="Over-privileged"><Icons.alert size={12} /></span>
      )}
      <Icons.chevronRight size={13} className="go" />
    </button>
  );
}

function IdentityPanel({ p }: { p: Principal }) {
  return (
    <div className="fp-acc-detail">
      <div className="fp-acc-detail-head">
        <Avatar name={p.name} size={48} />
        <div className="id">
          <div className="nm">{p.name} <KindBadge kind={p.kind} /></div>
          <div className="rl">{p.role}</div>
        </div>
        <Button variant="outline" size="sm"><Icons.edit size={12} /> Edit access</Button>
      </div>

      {p.overPrivileged && (
        <div className="fp-acc-flag">
          <Icons.alert size={14} />
          <span>Over-privileged: holds grants beyond its autonomy level or unused for 90 days. Review and trim.</span>
        </div>
      )}

      <AutonomyRamp p={p} />

      <dl className="fp-agentd-props" style={{ marginBlockStart: 14 }}>
        {p.owner && (<><dt>Owner</dt><dd>{p.owner}</dd></>)}
        {p.email && (<><dt>Email</dt><dd className="mono">{p.email}</dd></>)}
        <dt>Scopes</dt><dd>{p.scopes.join(' · ')}</dd>
        <dt>Environments</dt><dd className="mono">{p.envs.join(' · ')}</dd>
        {p.secrets !== undefined && (<><dt>Secret refs</dt><dd className="mono">{p.secrets}</dd></>)}
        <dt>Last used</dt><dd>{p.lastUsed}</dd>
      </dl>

      <div className="fp-acc-grants-head"><Icons.command size={13} /> Granted actions <span className="n mono">{p.grants.length}</span></div>
      <div className="fp-acc-grants">
        {p.grants.map((g) => {
          const act = getAction(g.action);
          const inner = (
            <>
              <span className="ga-name mono">{g.action}</span>
              <span className="ga-scope">{g.scope}</span>
            </>
          );
          return act ? (
            <Link key={g.action} href={`/portal/actions/${g.action}`} className="fp-acc-grant is-link">
              {inner}<Icons.chevronRight size={12} className="ga-go" />
            </Link>
          ) : (
            <div key={g.action} className="fp-acc-grant">{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

export default function AccessPage() {
  const [type, setType] = React.useState<PrincipalKind | 'all'>('all');
  const [query, setQuery] = React.useState('');
  const [selId, setSelId] = React.useState(PRINCIPALS[0].id);

  const filtered = React.useMemo(() => {
    let list = PRINCIPALS;
    if (type !== 'all') list = list.filter((p) => p.kind === type);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || (p.owner ?? '').toLowerCase().includes(q));
    }
    return list;
  }, [type, query]);

  const selected = PRINCIPALS.find((p) => p.id === selId) ?? filtered[0] ?? PRINCIPALS[0];

  return (
    <>
      <FPageHeader
        eyebrow="Governance"
        title="Access"
        subtitle="Every principal on one plane. Humans and agents hold the same kind of grant; an agent adds an owner, an autonomy level, and the scopes it may act in. This is what makes an agent a first-class user, not a script with a shared key."
        actions={
          <>
            <Button variant="ghost"><Icons.book size={13} /> Policy docs</Button>
            <Button variant="ember"><Icons.plus size={13} /> New identity</Button>
          </>
        }
      />

      <AiBanner title="Forge AI read" action="Review requests">
        <span className="fp-aip-hl mono">Deploy-bot</span> is asking to promote to autonomous prod deploys after{' '}
        <span className="fp-aip-hl">96% verified</span>. Two identities are <span className="fp-aip-hl">over-privileged</span>:
        {' '}<span className="fp-aip-hl mono">Cost-bot</span> holds a snapshot grant unused for 90 days, and{' '}
        <span className="fp-aip-hl mono">Maria Lopes</span> carries broad standing prod access. Trim both before the next audit.
      </AiBanner>

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value" style={k.id === 'overpriv' ? { color: 'var(--warning)' } : undefined}>{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Pending access requests */}
      {REQUESTS.length > 0 && (
        <div className="fp-acc-reqs" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
          <div className="fp-acc-reqs-head"><Icons.bell size={14} /> Access requests <span className="n mono">{REQUESTS.length}</span></div>
          {REQUESTS.map((r) => (
            <div key={r.id} className="fp-acc-req">
              <Avatar name={r.principalName} size={28} />
              <span className="rq-id">
                <span className="nm">{r.principalName} <KindBadge kind={r.principalKind} /></span>
                <span className="want">wants <b className="mono">{r.want}</b> on <span className="mono">{r.scope}</span></span>
              </span>
              <span className="rq-reason">{r.reason}</span>
              <span className="rq-when mono">{r.when}</span>
              <span className="rq-actions">
                <Button variant="ghost" size="sm">Deny</Button>
                <Button variant="outline" size="sm">Approve</Button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div role="radiogroup" aria-label="Principal type" style={{ display: 'flex', gap: 6 }}>
          {TYPES.map((t) => (
            <Pill
              key={t.value}
              tone={type === t.value ? 'ember' : 'neutral'}
              dot={type === t.value}
              role="radio"
              aria-checked={type === t.value}
              tabIndex={0}
              style={{ cursor: 'pointer', border: '1px solid var(--border)', fontWeight: type === t.value ? 600 : 500 }}
              onClick={() => setType(t.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setType(t.value); } }}
            >
              {t.label}
            </Pill>
          ))}
        </div>
        <div style={{ flex: 1, minInlineSize: 200, maxInlineSize: 360, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search principals…" aria-label="Search principals" className="fluid" />
        </div>
        <span className="fp-agents-count">{filtered.length} principals</span>
      </div>

      {/* Master-detail */}
      <div className="fp-acc-grid">
        <div className="fp-acc-list">
          {filtered.map((p) => (
            <PrincipalRow key={p.id} p={p} selected={p.id === selected.id} onSelect={() => setSelId(p.id)} />
          ))}
          {filtered.length === 0 && (
            <div className="fp-empty" style={{ padding: '32px 0' }}>
              <Icons.search size={18} /><span>No principals match.</span>
            </div>
          )}
        </div>
        <IdentityPanel p={selected} />
      </div>
    </>
  );
}
