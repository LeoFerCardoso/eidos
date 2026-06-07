'use client';
// Forge — PR detail (/portal/quality-gates/[pr]). The PR-analysis agent's full
// read on one pull request: the Change Risk Score and how it was computed, the
// gate it triggers, the approvals required and who can give them, and the
// diagnosis with the recommended move. The diagnosis is the agentic layer woven
// in, not a chat box.
//
// Brief — Persona: the author + the reviewer. Question: why is this PR this
// risky, what gate does it face, and what do I do? Data: getPr
// (src/portal/data/quality-gates.ts). Primary action: approve / request changes
// / split. Distinctive move: the CRS speedo paired with the factor breakdown
// that shows exactly what drove the score.
import * as React from 'react';
import Link from 'next/link';
import {
  Avatar,
  Button,
  Icons,
  Pill,
  ScoreGauge,
  StatusDot,
} from '@/ds/core';
import { FPageHeader, FSection, usePageCrumb } from '@/portal/shell/portal-shell';
import { GATES, PR_STATUS_META, gateFor, getPr } from '@/portal/data/quality-gates';

const FACTOR_MAX = 300;

export default function PrDetail({ prId }: { prId: string }) {
  const id = Number(prId);
  const pr = getPr(id);
  const { setCrumb } = usePageCrumb();

  // The speedo gauge draws SVG arcs with Math.cos/sin; those transcendental
  // results can differ in the last ULP between the SSR (Node) and client
  // (browser) engines, which trips React hydration on the path `d`. Render it
  // only after mount so the server never emits the divergent markup.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (pr) setCrumb({ label: `#${pr.id}`, replace: true });
    return () => setCrumb(null);
  }, [pr, setCrumb]);

  if (!pr) {
    return (
      <div className="fp-empty" style={{ marginBlockStart: 24 }}>
        <StatusDot tone="error" />
        <span>
          PR <span className="mono">#{prId}</span> not found.{' '}
          <Link href="/portal/quality-gates" className="u-link">Back to Quality Gates</Link>
        </span>
      </div>
    );
  }

  const gate = gateFor(pr.crs);
  const st = PR_STATUS_META[pr.status];
  const approved = pr.approvers.filter((a) => a.status === 'approved').length;

  const actions =
    pr.status === 'merged' ? (
      <Button variant="ghost"><Icons.gitPullRequest size={13} /> View merge</Button>
    ) : pr.status === 'blocked' ? (
      <>
        <Button variant="ghost"><Icons.x size={13} /> Request changes</Button>
        <Button variant="ember"><Icons.gitPullRequest size={13} /> Split PR</Button>
      </>
    ) : (
      <>
        <Button variant="ghost"><Icons.x size={13} /> Request changes</Button>
        <Button variant="ember"><Icons.check size={13} /> Approve</Button>
      </>
    );

  return (
    <>
      <FPageHeader
        eyebrow={`Quality Gates · ${pr.service}`}
        title={`#${pr.id} · ${pr.title}`}
        status={<Pill tone={st.tone} dot live={pr.status === 'in-review'}>{st.label}</Pill>}
        subtitle={`${pr.author.name} wants to merge ${pr.branch} into main.`}
        meta={
          <div className="fp-meta">
            <span className="fp-meta-chip"><Icons.gitPullRequest size={12} /> {pr.branch}</span>
            <span className="fp-meta-chip"><Icons.doc size={12} /> {pr.files} files</span>
            <span className="fp-meta-chip" style={{ color: 'var(--success)' }}>+{pr.additions}</span>
            <span className="fp-meta-chip" style={{ color: 'var(--danger)' }}>-{pr.deletions}</span>
            <span className="fp-meta-chip"><Icons.clock size={12} /> {pr.when}</span>
          </div>
        }
        actions={actions}
      />

      {/* PR-analysis agent diagnosis. */}
      <div className="fp-ai-read">
        <span className="fp-ai-read-icon" aria-hidden="true"><Icons.sparkle size={16} /></span>
        <div className="fp-ai-read-body">
          <span className="fp-ai-read-eyebrow">PR-analysis agent · diagnosis</span>
          <p>{pr.diagnosis}</p>
        </div>
      </div>

      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'start', marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        {/* MAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Change Risk Score</div>
              <Pill tone={gate.tone}>{gate.label}</Pill>
            </div>
            <div className="fp-crs-hero">
              {mounted ? (
                <ScoreGauge variant="speedo" value={pr.crs} min={0} max={1000} ticks labels size={220} />
              ) : (
                <div style={{ inlineSize: 220, blockSize: 162, flexShrink: 0 }} aria-hidden="true" />
              )}
              <div className="fp-crs-read">
                <span className="fp-crs-num mono">{pr.crs}<span className="fp-crs-den">/1000</span></span>
                <p className="fp-crs-rule">
                  {gate.approvals === 0
                    ? 'Under 300: merges automatically once checks pass.'
                    : gate.key === 'blocked'
                      ? 'At or above 900: cannot merge. Split the change to lower the score.'
                      : `${gate.range}: needs ${gate.approvals} ${gate.approvals === 1 ? 'approval' : 'approvals'} before merge.`}
                </p>
              </div>
            </div>
            <div className="fp-factors">
              {pr.factors.map((f) => (
                <div key={f.label} className="fp-factor">
                  <div className="fp-factor-id">
                    <span className="fp-factor-label">{f.label}</span>
                    <span className="fp-factor-detail">{f.detail}</span>
                  </div>
                  <span className="fp-factor-bar" aria-hidden="true">
                    <span className={`fp-factor-fill tone-${gate.tone}`} style={{ inlineSize: `${Math.min(100, (f.points / FACTOR_MAX) * 100)}%` }} />
                  </span>
                  <span className="fp-factor-pts mono">+{f.points}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Change summary</div>
            </div>
            <dl className="fp-kv">
              <div className="fp-kv-row"><dt>Files changed</dt><dd className="mono">{pr.files}</dd></div>
              <div className="fp-kv-row"><dt>Lines</dt><dd className="mono"><span style={{ color: 'var(--success)' }}>+{pr.additions}</span> <span style={{ color: 'var(--danger)' }}>-{pr.deletions}</span></dd></div>
              <div className="fp-kv-row"><dt>Coverage delta</dt><dd className="mono" style={{ color: pr.coverageDelta.startsWith('-') ? 'var(--danger)' : 'var(--success)' }}>{pr.coverageDelta}</dd></div>
              <div className="fp-kv-row"><dt>Blast radius</dt><dd>{pr.blast}</dd></div>
              <div className="fp-kv-row"><dt>SAST findings</dt><dd className="mono" style={{ color: pr.sast > 0 ? 'var(--danger)' : 'var(--success)' }}>{pr.sast}</dd></div>
            </dl>
          </div>
        </div>

        {/* ASIDE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Approval gate</div>
              {gate.approvals > 0 && <span className="fp-card-meta">{approved} of {gate.approvals}</span>}
            </div>
            {gate.approvals === 0 ? (
              <p className="fp-kpi-note">No human approval required. This PR is in the auto-merge band.</p>
            ) : pr.approvers.length === 0 ? (
              <p className="fp-kpi-note">No approvals yet. {gate.approvals} required.</p>
            ) : (
              <ul className="fp-resp">
                {pr.approvers.map((a) => (
                  <li key={a.person.name} className="fp-resp-row">
                    <Avatar p={a.person} size={28} />
                    <div className="fp-resp-id">
                      <span className="fp-resp-name">{a.person.name}</span>
                      <span className="fp-resp-role">{a.person.role}</span>
                    </div>
                    {a.status === 'approved' ? (
                      <span className="fp-ok"><StatusDot tone="done" size="sm" /> Approved</span>
                    ) : (
                      <Pill tone="status-pending" dot>Pending</Pill>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {gate.approvals > 0 && pr.status !== 'merged' && (
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Eligible reviewers</div>
              </div>
              <ul className="fp-resp">
                {pr.eligible.map((p) => (
                  <li key={p.name} className="fp-resp-row">
                    <Avatar p={p} size={26} />
                    <div className="fp-resp-id">
                      <span className="fp-resp-name">{p.name}</span>
                      <span className="fp-resp-role">{p.role}</span>
                    </div>
                    <Button variant="ghost" size="sm"><Icons.bell size={11} /> Request</Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Where it falls</div>
            </div>
            <ul className="fp-ladder">
              {GATES.map((g) => (
                <li key={g.key} className={'fp-ladder-row' + (g.key === gate.key ? ' is-current' : '')}>
                  <span className={`fp-ladder-dot tone-${g.tone}`} />
                  <span className="fp-ladder-range mono">{g.range}</span>
                  <span className="fp-ladder-label">{g.label}</span>
                  {g.key === gate.key && <Icons.chevronLeft size={13} />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
