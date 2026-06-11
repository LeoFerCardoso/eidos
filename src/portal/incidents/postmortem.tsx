'use client';
// Forge — Auto-postmortem (/portal/incidents/[id]/postmortem). §7.11 of the
// vision: the incident-manager agent drafts the postmortem from the full
// incident context (timeline, deploys, runbooks); a human edits and publishes.
//
// Brief — Persona: incident commander / EM after the fire. Question: what
// happened, why, what do we change so it cannot recur? Data: incident.postmortem
// (src/portal/data/incidents.ts). Primary action: edit / publish the draft.
// Distinctive move: the draft is explicitly agent-authored (draftedBy) with a
// human-edit affordance, and action items flow toward initiatives + an ADR.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, StatusDot, Timeline } from '@/ds/core';
import { FPageHeader, usePageCrumb } from '@/portal/shell/portal-shell';
import { getIncident, type PostmortemActionItem } from '@/portal/data/incidents';

const ITEM_META = {
  open: { label: 'Open', tone: 'status-pending' },
  'in-progress': { label: 'In progress', tone: 'status-running' },
  done: { label: 'Done', tone: 'status-done' },
} as const satisfies Record<PostmortemActionItem['status'], { label: string; tone: string }>;

function ProseBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="fp-section-title" style={{ marginBlockEnd: 6 }}>{title}</div>
      <p style={{ margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--fg-muted)' }}>{body}</p>
    </div>
  );
}

function BulletList({ title, items, tone }: { title: string; items: string[]; tone: 'success' | 'warning' }) {
  return (
    <div className="fp-card">
      <div className="fp-card-head">
        <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {tone === 'success' ? <Icons.check size={13} /> : <Icons.alert size={13} />} {title}
        </div>
      </div>
      <ul style={{ margin: 0, paddingInlineStart: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it) => (
          <li key={it} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
            <StatusDot tone={tone === 'success' ? 'done' : 'pending'} style={{ marginBlockStart: 5 }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PostmortemView({ id }: { id: string }) {
  const inc = getIncident(id);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (inc) setCrumb({ label: `${inc.id} · Postmortem`, replace: true });
    return () => setCrumb(null);
  }, [inc, setCrumb]);

  if (!inc) {
    return (
      <div className="fp-empty" style={{ marginBlockStart: 24 }}>
        <StatusDot tone="error" />
        <span>
          Incident <span className="mono">{id}</span> not found.{' '}
          <Link href="/portal/incidents" className="u-link">Back to Incidents</Link>
        </span>
      </div>
    );
  }

  const pm = inc.postmortem;

  if (!pm) {
    return (
      <>
        <FPageHeader
          back={{ href: `/portal/incidents/${inc.id}`, label: inc.id }}
          title="Postmortem"
          subtitle="No postmortem yet for this incident."
        />
        <div className="fp-empty" style={{ marginBlockStart: 8 }}>
          <Icons.sparkle size={14} />
          <span>
            Once the incident resolves, the incident-manager agent drafts the postmortem from the
            full timeline, the correlated deploy, and the runbooks that ran.
          </span>
          <Button variant="outline" size="sm" style={{ marginInlineStart: 'auto' }}>
            <Icons.sparkle size={11} /> Draft with Forge AI
          </Button>
        </div>
      </>
    );
  }

  const draft = pm.status === 'draft';

  return (
    <>
      <FPageHeader
        back={{ href: `/portal/incidents/${inc.id}`, label: `War room · ${inc.id}` }}
        title={`${inc.id} · Postmortem`}
        status={
          <Pill tone={draft ? 'status-pending' : 'status-done'} dot>
            {draft ? 'Draft' : 'Published'}
          </Pill>
        }
        subtitle={pm.summary}
        meta={
          <div className="fp-meta">
            <span className="fp-meta-chip"><Icons.bot size={12} /> Drafted by {pm.draftedBy}</span>
            {pm.editedBy && <span className="fp-meta-chip"><Icons.edit size={12} /> Edited by {pm.editedBy}</span>}
            <span className="fp-meta-chip"><Icons.clock size={12} /> {inc.duration} to restore</span>
            <span className="fp-meta-chip"><Icons.user size={12} /> {inc.customers} customers</span>
          </div>
        }
        actions={
          <>
            <Button variant="outline"><Icons.edit size={13} /> Edit draft</Button>
            {draft && <Button variant="ember"><Icons.check size={13} /> Publish</Button>}
          </>
        }
      />

      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'start' }}>
        {/* MAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ProseBlock title="Root cause" body={pm.rootCause} />
            <ProseBlock title="Impact" body={pm.impact} />
          </div>

          <div className="fp-grid fp-grid-2">
            <BulletList title="What went well" items={pm.whatWentWell} tone="success" />
            <BulletList title="What hurt" items={pm.whatHurt} tone="warning" />
          </div>

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icons.clock size={13} /> Timeline · auto-assembled
              </div>
              <span className="fp-card-meta">{inc.timeline.length} events · from the war room</span>
            </div>
            <Timeline items={inc.timeline} />
          </div>
        </div>

        {/* ASIDE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Action items</div>
              <span className="fp-card-meta">{pm.actionItems.filter((a) => a.status === 'done').length}/{pm.actionItems.length} done</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {pm.actionItems.map((a) => {
                const m = ITEM_META[a.status];
                return (
                  <li
                    key={a.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, paddingBlock: 10,
                      borderBlockEnd: '1px solid var(--border)', fontSize: 'var(--text-sm)',
                    }}
                  >
                    <div style={{ flex: 1, minInlineSize: 0 }}>
                      <div style={{ fontWeight: 600 }}>{a.title}</div>
                      <span className="fp-cell-sub">{a.owner}</span>
                    </div>
                    <Pill tone={m.tone}>{m.label}</Pill>
                  </li>
                );
              })}
            </ul>
            <p style={{ margin: '10px 0 0', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
              Items sync to Jira and roll up into Scorecard initiatives.
            </p>
          </div>

          {pm.adrSuggestion && (
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Icons.doc size={13} /> Suggested ADR
                </div>
                <Pill tone="status-pending">proposed</Pill>
              </div>
              <div style={{ fontSize: 'var(--text-sm)' }}>
                <span className="mono" style={{ color: 'var(--fg-muted)', marginInlineEnd: 8 }}>{pm.adrSuggestion.id}</span>
                <span style={{ fontWeight: 600 }}>{pm.adrSuggestion.title}</span>
              </div>
              <Button variant="ghost" size="sm" asChild style={{ alignSelf: 'flex-start', marginBlockStart: 10 }}>
                <Link href="/portal/architecture"><Icons.arrowRight size={11} /> Review in Architecture</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
