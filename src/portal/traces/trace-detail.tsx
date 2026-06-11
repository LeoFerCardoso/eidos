'use client';
// Forge — Trace detail (/portal/traces/[id]). One end-to-end agent execution
// as a span tree (left) with a span inspector (right): the Braintrust/Langfuse
// examine-trace pattern in Eidos terms.
//
// Brief — Persona: agent owner debugging latency, cost or a wrong answer.
// Question: which span burned the time/tokens, what exactly went in and out,
// and what did the scorers say? Data: getTrace (src/portal/data/traces.ts).
// Primary action: select a span; jump to the run / evaluation it belongs to.
// Distinctive move: score and review spans carry the judge's reasoning inline,
// so "why 0.74" is one click, not a separate tool.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, StatusDot } from '@/ds/core';
import { FPageHeader, usePageCrumb } from '@/portal/shell/portal-shell';
import {
  SOURCE_META,
  SPAN_META,
  fmtMs,
  fmtTok,
  fmtUsd,
  getTrace,
  type Span,
} from '@/portal/data/traces';

function SpanIcon({ type, size = 13 }: { type: Span['type']; size?: number }) {
  const Ic = Icons[SPAN_META[type].icon as keyof typeof Icons];
  return <Ic size={size} />;
}

function IoBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="fp-trd-io">
      <div className="fp-trd-io-label">{label}</div>
      <pre className="fp-trd-io-pre mono">{text}</pre>
    </div>
  );
}

export default function TraceDetail({ id }: { id: string }) {
  const trace = getTrace(id);
  const { setCrumb } = usePageCrumb();
  const [selectedId, setSelectedId] = React.useState<string>('s0');

  React.useEffect(() => {
    if (trace) setCrumb({ label: trace.id, replace: true });
    return () => setCrumb(null);
  }, [trace, setCrumb]);

  if (!trace) {
    return (
      <div className="fp-empty" style={{ marginBlockStart: 24 }}>
        <StatusDot tone="error" />
        <span>
          Trace <span className="mono">{id}</span> not found.{' '}
          <Link href="/portal/traces" className="u-link">Back to Traces</Link>
        </span>
      </div>
    );
  }

  const span = trace.spans.find((s) => s.id === selectedId) ?? trace.spans[0];
  const src = SOURCE_META[trace.source];
  const SrcIcon = Icons[src.icon as keyof typeof Icons];

  return (
    <>
      <FPageHeader
        back={{ href: '/portal/traces', label: 'Traces' }}
        title={`${trace.id} · ${trace.root}`}
        status={<Pill tone={trace.status === 'error' ? 'danger' : 'success'}>{trace.status}</Pill>}
        subtitle={`One ${src.label.toLowerCase()} execution by ${trace.agent} on ${trace.model}, ${trace.when}.`}
        meta={
          <div className="fp-meta">
            <span className="fp-meta-chip"><SrcIcon size={12} /> {src.label}{trace.runId ? ` · ${trace.runId}` : ''}</span>
            <span className="fp-meta-chip"><Icons.clock size={12} /> {fmtMs(trace.latencyMs)} total</span>
            <span className="fp-meta-chip mono">{fmtTok(trace.tokensIn)} in · {fmtTok(trace.tokensOut)} out · {fmtUsd(trace.cost)}</span>
            {trace.service && <span className="fp-meta-chip"><Icons.server size={12} /> {trace.service} · {trace.env}</span>}
          </div>
        }
        actions={
          <>
            {trace.runId && (
              <Button variant="outline" asChild>
                <Link href={`/portal/runs/${trace.runId}`}><Icons.activity size={13} /> Open run</Link>
              </Button>
            )}
            <Button variant="outline"><Icons.plus size={13} /> Add to dataset</Button>
          </>
        }
      />

      <div className="fp-trd-grid">
        {/* ── Span tree ── */}
        <div className="fp-card fp-trd-tree-card">
          <div className="fp-card-head">
            <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icons.branch size={13} /> Spans · {trace.spansCount}
            </div>
            <span className="fp-card-meta mono">{fmtMs(trace.latencyMs)} · {fmtUsd(trace.cost)}</span>
          </div>
          <div className="fp-trd-tree" role="listbox" aria-label="Trace spans">
            {trace.spans.map((s) => (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={s.id === span.id}
                className={`fp-trd-span${s.id === span.id ? ' is-selected' : ''}${s.error ? ' is-error' : ''}`}
                style={{ '--trd-depth': s.depth } as React.CSSProperties}
                onClick={() => setSelectedId(s.id)}
              >
                <span className="sp-ic"><SpanIcon type={s.type} /></span>
                <span className="sp-name" title={s.name}>
                  {s.name}
                  {s.error && <span className="sp-err mono">ERROR</span>}
                  {s.score && <span className="sp-score mono">{s.score.value.toFixed(2)}</span>}
                </span>
                <span className="sp-stats mono">
                  {s.tokensIn !== undefined && <span className="dim">{fmtTok(s.tokensIn)} to {fmtTok(s.tokensOut ?? 0)}</span>}
                  {s.cost !== undefined && <span>{fmtUsd(s.cost)}</span>}
                  <span className="dur">{fmtMs(s.durMs)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Span inspector ── */}
        <div className="fp-card fp-trd-panel">
          <div className="fp-card-head">
            <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <SpanIcon type={span.type} /> {span.name}
            </div>
            <Pill tone="neutral">{SPAN_META[span.type].label}</Pill>
          </div>

          {/* Stat row */}
          <div className="fp-trd-stats">
            <span><span className="v mono">{fmtMs(span.durMs)}</span><span className="l">duration</span></span>
            {span.tokensIn !== undefined && (
              <span><span className="v mono">{fmtTok(span.tokensIn)} to {fmtTok(span.tokensOut ?? 0)}</span><span className="l">tokens</span></span>
            )}
            {span.cost !== undefined && (
              <span><span className="v mono">{fmtUsd(span.cost)}</span><span className="l">cost</span></span>
            )}
            {span.model && (
              <span><span className="v mono">{span.model}</span><span className="l">{span.params ?? 'model'}</span></span>
            )}
          </div>

          {span.score && (
            <div className={`fp-trd-score${span.score.value < 0.7 ? ' is-low' : ''}`}>
              <div className="head">
                <span className="nm mono">{span.score.name}</span>
                <span className="val mono">{span.score.value.toFixed(2)}</span>
              </div>
              {span.score.judge && <div className="judge">Judge: {span.score.judge}</div>}
              {span.score.reasoning && <p className="why">{span.score.reasoning}</p>}
            </div>
          )}

          {span.input && <IoBlock label="Input" text={span.input} />}
          {span.output && <IoBlock label="Output" text={span.output} />}

          {span.meta && span.meta.length > 0 && (
            <div className="fp-trd-meta">
              <div className="fp-trd-io-label">Metadata</div>
              <dl>
                {span.meta.map((m) => (
                  <React.Fragment key={m.k}>
                    <dt className="mono">{m.k}</dt>
                    <dd className="mono">{m.v}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
