'use client';
// Forge IDP Portal · Action detail (/portal/actions/[slug]).
// Two-column layout reusing the .fp-agentd-* detail pattern. Left: header +
// guardrail policy + input schema + run history. Right: properties, wiring
// (Skill + MCP), triggers, permitted principals. Composes only Eidos DS + .fp-*.

import * as React from 'react';
import Link from 'next/link';
import { Icons, Pill, Button } from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import { AsideSection } from '@/portal/shell/detail-kit';
import {
  getAction, runsFor, GATE_META, RUNNER_META, TRIGGER_META,
  type Action, type ActionRun,
} from '@/portal/data/actions';
import { WORKFLOWS } from '@/portal/data/workflows';

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.zap;
  return <C size={size} />;
};

const OUTCOME: Record<ActionRun['outcome'], { label: string; tone: 'health-up' | 'warning' | 'ice' }> = {
  'ok':          { label: 'ok',          tone: 'health-up' },
  'escalated':   { label: 'escalated',   tone: 'warning' },
  'rolled-back': { label: 'rolled back', tone: 'ice' },
};


// Mock "who may run this" derived from the runner kind — humans (by role) and/or
// the agents wired to act. Kept representative, not exhaustive.
function permittedFor(a: Action): { icon: string; label: string; agent?: boolean }[] {
  const humans = [
    { icon: 'user', label: 'Service owners' },
    { icon: 'user', label: 'Platform engineers' },
  ];
  const agents = [
    { icon: 'agent', label: 'Deploy-bot', agent: true },
    { icon: 'agent', label: 'Sentinel', agent: true },
  ];
  if (a.runnableBy === 'human') return humans;
  if (a.runnableBy === 'agent') return agents;
  return [...agents.slice(0, 1), ...humans];
}

export default function ActionDetail({ slug }: { slug: string }) {
  const action = getAction(slug);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (action) setCrumb({ label: action.name, replace: true });
    return () => setCrumb(null);
  }, [action, setCrumb]);

  if (!action) {
    return (
      <div className="fp-agents-empty" style={{ padding: '64px 0' }}>
        <Icons.zap size={28} />
        <p>No action with id &ldquo;{slug}&rdquo;.</p>
        <Button variant="ghost" asChild>
          <Link href="/portal/actions"><Icons.chevronLeft size={13} /> Back to actions</Link>
        </Button>
      </div>
    );
  }

  const gate = GATE_META[action.gate];
  const runner = RUNNER_META[action.runnableBy];
  const runs = runsFor(action);
  const permitted = permittedFor(action);
  // Workflows that sequence this action — the Action ← Workflow interlink.
  const usedIn = WORKFLOWS.filter((w) => w.nodes.some((n) => n.actionId === action.id));
  const ActionIcon = (Icons as Record<string, React.FC<{ size?: number }>>)[action.icon] ?? Icons.zap;

  return (
    <div className="fp-agentd">
      {/* ── Left: header + policy + schema + runs ──────────────────────────── */}
      <div className="fp-agentd-main">
        <div className="fp-agentd-main-in">
          <div className="fp-agentd-head">
            <div className="fp-agentd-topbar">
              <Link href="/portal/actions" className="fp-back-eyebrow" style={{ marginBlockEnd: 0 }}><Icons.arrowLeft size={11} /> Actions</Link>
              <div className="fp-agentd-topbar-actions">
                <Button variant="ghost"><Icons.book size={14} /> Docs</Button>
                <Button variant="ember"><Icons.play size={14} /> Run action</Button>
              </div>
            </div>

            <div className="fp-agentd-title">
              <span
                className="fp-skill-ic"
                aria-hidden="true"
                style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)' }}
              >
                <ActionIcon size={22} />
              </span>
              <h1>{action.name}</h1>
              <Pill tone={gate.tone} dot>{gate.label}</Pill>
              {action.deprecated && <Pill tone="neutral">deprecated</Pill>}
            </div>

            <p className="fp-agentd-summary">{action.desc}</p>
          </div>

          {/* Guardrail policy */}
          <section className="fp-action-guard">
            <div className="fp-action-guard-head">
              <span className="fp-action-guard-ic" aria-hidden="true"><Icons.shield size={15} /></span>
              <span className="t">Guardrail policy</span>
              <Pill tone={gate.tone} dot>{gate.label}</Pill>
              {!action.governed && (
                <Pill tone="warning"><Icons.alert size={11} /> Ungoverned</Pill>
              )}
            </div>
            <p className="fp-action-guard-text">{action.guardrail}</p>
            <div className="fp-agentd-caps" style={{ marginBlockStart: 8 }}>
              {action.triggers.map((t) => (
                <span key={t} className="cap">{ICON(TRIGGER_META[t].icon, 13)} {TRIGGER_META[t].label}</span>
              ))}
            </div>
          </section>

          {/* Input schema */}
          <section style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
            <div className="fp-action-sec-head"><Icons.braces size={14} /> Input schema</div>
            <dl className="fp-agentd-props fp-action-schema">
              {action.inputs.map((inp) => (
                <React.Fragment key={inp.name}>
                  <dt className="mono">{inp.name}{inp.required && <span className="fp-action-req" title="Required"> *</span>}</dt>
                  <dd className="mono">{inp.type}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>

          {/* Run history */}
          <section style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
            <div className="fp-action-sec-head"><Icons.clock size={14} /> Recent runs</div>
            <div className="fp-agentd-list">
              {runs.map((r) => {
                const oc = OUTCOME[r.outcome];
                return (
                  <div key={r.id} className="item" style={{ cursor: 'default' }}>
                    <span className="ic">{ICON(r.isAgent ? 'agent' : 'user', 14)}</span>
                    <span className="tx">
                      <span className="nm">{r.principal} <span className="mono" style={{ color: 'var(--fg-faint)', fontWeight: 400 }}>· {r.target}</span></span>
                      <span className="ds">{r.when}</span>
                    </span>
                    <Pill tone={oc.tone}>{oc.label}</Pill>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Used in workflows — the Action ← Workflow interlink */}
          <section style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
            <div className="fp-action-sec-head"><Icons.share size={14} /> Used in workflows <span className="fp-action-sec-n mono">{usedIn.length}</span></div>
            {usedIn.length === 0 ? (
              <div className="fp-agentd-empty"><span className="ic">{ICON('share', 16)}</span><span>Not sequenced in any workflow yet.</span></div>
            ) : (
              <div className="fp-agentd-list">
                {usedIn.map((w) => (
                  <Link key={w.id} href={`/portal/workflows/${w.id}`} className="item" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className="ic">{ICON('share', 14)}</span>
                    <span className="tx"><span className="nm">{w.name}</span><span className="ds">{w.runsWeek} runs/wk · {w.successRate}% success</span></span>
                    <Icons.chevronRight size={13} style={{ color: 'var(--fg-faint)', flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="fp-agentd-rule" aria-hidden="true" />

      {/* ── Right: metadata ────────────────────────────────────────────────── */}
      <aside className="fp-agentd-aside">
        <AsideSection title="Properties">
          <dl className="fp-agentd-props">
            <dt>Category</dt>
            <dd>{action.category}</dd>
            <dt>Runner</dt>
            <dd style={{ display: 'flex', alignItems: 'center', gap: 5 }}>{ICON(runner.icon, 12)} {runner.label}</dd>
            <dt>Maintainer</dt>
            <dd>{action.official ? 'Equifax Platform' : action.author}</dd>
            <dt>Version</dt>
            <dd className="mono">{action.version}</dd>
            <dt>Runs / week</dt>
            <dd className="mono">{action.runsWeek}</dd>
            <dt>Governed</dt>
            <dd>
              {action.governed
                ? <Pill tone="health-up" dot>Yes</Pill>
                : <Pill tone="warning" dot>No policy</Pill>}
            </dd>
          </dl>
        </AsideSection>

        <AsideSection title="Wiring">
          <div className="fp-agentd-list">
            {action.skill ? (
              <Link href={`/portal/skills/${action.skill}`} className="item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="ic">{ICON('zap', 14)}</span>
                <span className="tx"><span className="nm">{action.skill}</span><span className="ds">Wired skill</span></span>
                <Icons.chevronRight size={13} style={{ color: 'var(--fg-faint)', flexShrink: 0 }} />
              </Link>
            ) : (
              <div className="fp-agentd-empty"><span className="ic">{ICON('zap', 16)}</span><span>No skill wired.</span></div>
            )}
            {action.mcp && (
              <Link href={`/portal/mcp-servers/${action.mcp}`} className="item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="ic">{ICON('plug', 14)}</span>
                <span className="tx"><span className="nm">{action.mcp}-mcp</span><span className="ds">MCP transport</span></span>
                <Icons.chevronRight size={13} style={{ color: 'var(--fg-faint)', flexShrink: 0 }} />
              </Link>
            )}
          </div>
        </AsideSection>

        <AsideSection title="Triggers" count={action.triggers.length}>
          <div className="fp-agentd-caps">
            {action.triggers.map((t) => (
              <span key={t} className="cap">{ICON(TRIGGER_META[t].icon, 13)} {TRIGGER_META[t].label}</span>
            ))}
          </div>
        </AsideSection>

        <AsideSection title="Permitted principals" count={permitted.length}>
          <div className="fp-agentd-list">
            {permitted.map((p) => (
              <div key={p.label} className="item" style={{ cursor: 'default' }}>
                <span className="ic">{ICON(p.icon, 14)}</span>
                <span className="tx"><span className="nm">{p.label}</span><span className="ds">{p.agent ? 'Agent' : 'Human role'}</span></span>
              </div>
            ))}
          </div>
        </AsideSection>
      </aside>
    </div>
  );
}
