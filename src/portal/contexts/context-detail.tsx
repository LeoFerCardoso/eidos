'use client';
// Forge · Context detail page (/portal/contexts/[id]).
// Opened when a row is clicked in the Contexts catalog. Two-column layout
// mirrors agent-detail: wide left (header + Prose overview) and a right
// metadata sidebar with AsideSection blocks adapted for a knowledge source.
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import {
  Icons, Pill, Prose, BrandIcon, Button,
} from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import { AsideSection, EmptyState } from '@/portal/shell/detail-kit';
import {
  getContext, SOURCE_META, STATUS_META, fmtItems,
  syncFor, usedByFor, accessFor,
  type Context,
} from '@/portal/data/contexts';
import { AGENTS } from '@/portal/data/agents';

// ── Local helpers (not exported) ─────────────────────────────────────────────

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.circle;
  return <C size={size} />;
};



// ── Per-source sample content ─────────────────────────────────────────────────

function sampleContent(ctx: Context): { heading: string; items: string[] } {
  switch (ctx.source) {
    case 'Registry':
      switch (ctx.id) {
        case 'catalog':
          return {
            heading: 'Sample records',
            items: [
              'service:payment-gateway · owner:payments · crit:high',
              'service:consent-api · owner:compliance · crit:high',
              'service:ignite-feature-server · owner:data-bureau · crit:med',
              'service:konduto-proxy · owner:anti-fraud · crit:med',
              'service:scr-reconciler · owner:bureau · crit:high',
            ],
          };
        case 'slo':
          return {
            heading: 'Sample SLO entries',
            items: [
              'payment-gateway · availability 99.95% · burn 0.12x',
              'consent-api · latency p99 200 ms · burn 0.04x',
              'ignite-feature-server · freshness 5 min · burn 0.31x',
              'konduto-proxy · error rate 0.1% · burn 0.08x',
            ],
          };
        case 'consent':
          return {
            heading: 'Sample consent entries',
            items: [
              'CPF 000.xxx.xxx-01 · scope:credit-query · granted 2026-01-14',
              'CPF 000.xxx.xxx-02 · scope:cadastro-positivo · granted 2025-11-03',
              'CPF 000.xxx.xxx-03 · scope:credit-query · revoked 2026-02-20',
              'CPF 000.xxx.xxx-04 · scope:fraud-prevention · granted 2026-03-07',
            ],
          };
        case 'fraudrules':
          return {
            heading: 'Sample rule definitions',
            items: [
              'rule:high-velocity-card · threshold 8 txn/min · action:decline',
              'rule:cpf-mismatch · confidence 0.9 · action:manual-review',
              'rule:device-fingerprint-new · score delta +12 · action:challenge',
              'rule:amount-outlier-pix · z-score >3.2 · action:hold',
            ],
          };
        default:
          return {
            heading: 'Sample records',
            items: [
              `${ctx.name} record · id:001 · updated:${ctx.updated}`,
              `${ctx.name} record · id:002 · owner:${ctx.owner}`,
              `${ctx.name} record · id:003 · status:active`,
            ],
          };
      }
    case 'Google Drive':
      if (ctx.id === 'drive-arch') {
        return {
          heading: 'Indexed documents',
          items: [
            'Q1 2026 Architecture Review - Payments tribe.pptx',
            'Q4 2025 Architecture Review - Data and Bureau tribe.pptx',
            'Event-driven migration ADR - Kafka to Pub/Sub.pptx',
            'Multi-region failover design - PIX rail.pptx',
          ],
        };
      }
      return {
        heading: 'Indexed documents',
        items: [
          'Engineering handbook v4 - Day 1 setup.md',
          'Ways of working - incident response.md',
          'Paved road guide - golden-path templates.md',
          'Escalation matrix - on-call and PagerDuty.md',
        ],
      };
    case 'Confluence':
      if (ctx.id === 'conf-bureau') {
        return {
          heading: 'Indexed pages',
          items: [
            'SCPC integration overview · Bureau space',
            'Boa Vista feed schema v3 · Data and Bureau space',
            'Reconciliation runbook · SRE space',
            'SCPC error codes and resolution guide',
          ],
        };
      }
      return {
        heading: 'Indexed pages',
        items: [
          'LGPD data-protection policy v2 · Compliance space',
          'DPIA template and review checklist',
          'Consent scope catalogue · Legal space',
          'Data subject request playbook',
        ],
      };
    case 'Upload':
      return {
        heading: 'Uploaded file',
        items: [
          'SCR-layout-spec-v9.pdf · 142 pages · uploaded by Diego Vasquez',
          'Sections: Field codes, Data types, Error conditions, Examples',
        ],
      };
    case 'Markdown':
      return {
        heading: 'Document sections',
        items: [
          '## Tone - be concise, use active voice, no jargon',
          '## Format - prefer bullet lists for steps, prose for explanations',
          '## Code - always wrap in fenced blocks with language tag',
          '## Citations - always cite the source context when quoting data',
        ],
      };
  }
}

// ── Overview prose per context ────────────────────────────────────────────────

function overviewMarkdown(ctx: Context): string {
  const sample = sampleContent(ctx);
  const itemCount = fmtItems(ctx.items);

  const leadBySource: Record<string, string> = {
    Registry: `The **${ctx.name}** is a live registry context maintained by the ${ctx.owner} team. It exposes \`${itemCount}\` indexed records that agents query to ground their answers with current, authoritative data from the platform.`,
    'Google Drive': `The **${ctx.name}** is synced from Google Drive and maintained by ${ctx.owner}. It provides \`${itemCount}\` indexed documents that agents reference when answering questions about processes, architecture decisions, and ways of working.`,
    Confluence: `The **${ctx.name}** is indexed from a Confluence space owned by ${ctx.owner}. It contains \`${itemCount}\` pages covering policies, procedures, and reference material that agents cite when answering compliance and operational questions.`,
    Upload: `The **${ctx.name}** is a manually uploaded document provided by ${ctx.owner}. Its \`${itemCount}\` document is parsed and chunked so agents can cite exact sections when answering field-level questions.`,
    Markdown: `The **${ctx.name}** is an authored Markdown document owned by ${ctx.owner}. It contains editorial guidance that shapes how agents phrase and format their responses.`,
  };

  const usageNote: Record<string, string> = {
    Registry: 'Agents retrieve records from this context to answer factual questions without hallucinating current state. The registry is the authoritative source, so grounded answers cite it directly.',
    'Google Drive': 'Agents embed relevant document passages when answering how-to questions. Drive contexts are best for long-form reference material that changes quarterly.',
    Confluence: 'Agents surface policy and procedural pages by semantic similarity. Confluence contexts work well for compliance questions where the exact wording matters.',
    Upload: 'Agents use this document as a spec reference. Because it is a single-file context, answers are highly focused and cite page numbers when possible.',
    Markdown: 'This context is injected into the agent system prompt to influence tone and format globally, not just in individual answers.',
  };

  const indexed =
    ctx.source === 'Registry'
      ? `The indexer reads each record from the ${ctx.name.toLowerCase()} and generates embeddings over the key fields. Records are chunked by entity, so agents retrieve complete, consistent objects rather than fragmented text.`
      : ctx.source === 'Upload'
      ? 'The PDF is parsed page by page. Tables are converted to structured text and headings are preserved as chunk boundaries so agents can locate specific sections quickly.'
      : ctx.source === 'Markdown'
      ? 'The document is indexed as a single chunk. It is short enough that the full content fits in the context window without retrieval.'
      : `Documents are chunked by heading hierarchy. ${ctx.source === 'Google Drive' ? 'Slide decks are converted to text per slide.' : 'Confluence pages are indexed per heading section.'} Agents retrieve the most relevant chunks by cosine similarity.`;

  // Sample lines render as inline-code list items so field markup reads cleanly.
  const sampleList = sample.items.map((item) => `- \`${item.replace(/`/g, '')}\``).join('\n');

  return [
    leadBySource[ctx.source],
    '',
    '### How agents use this context',
    usageNote[ctx.source],
    '',
    '### What is indexed',
    indexed,
    '',
    `### ${sample.heading}`,
    sampleList,
  ].join('\n');
}

// ── Source cell (icon or BrandIcon + label) ────────────────────────────────────

function SourceCell({ ctx }: { ctx: Context }) {
  const m = SOURCE_META[ctx.source];
  return (
    <span className="fp-ctx-src">
      {m.brand ? (
        <BrandIcon slug={m.brand} size={14} color="brand" />
      ) : (
        ICON(m.icon ?? 'database', 13)
      )}
      {ctx.source}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContextDetail({ id }: { id: string }) {
  const ctx = getContext(id);
  const router = useRouter();
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (ctx) setCrumb({ label: ctx.name, replace: true });
    return () => setCrumb(null);
  }, [ctx, setCrumb]);

  if (!ctx) {
    return (
      <div className="fp-agents-empty" style={{ padding: '64px 0' }}>
        <Icons.layers size={28} />
        <p>No context with id &ldquo;{id}&rdquo;.</p>
        <Button variant="ghost" asChild>
          <Link href="/portal/contexts">
            <Icons.chevronLeft size={13} /> Back to contexts
          </Link>
        </Button>
      </div>
    );
  }

  const st = STATUS_META[ctx.status];
  const sync = syncFor(ctx.id);
  const agentIds = usedByFor(ctx.id);
  const agentNames = AGENTS.filter((a) => agentIds.includes(a.id)).map((a) => ({
    id: a.id,
    name: a.name,
    role: a.role,
    icon: 'sparkle',
  }));
  const access = accessFor(ctx.id);

  return (
    <div className="fp-agentd">
      {/* ── Left: header + overview ─────────────────────────────────────── */}
      <div className="fp-agentd-main">
        <div className="fp-agentd-main-in">
          <div className="fp-agentd-head">
            <div className="fp-agentd-topbar">
              <Link href="/portal/contexts" className="fp-back-eyebrow" style={{ marginBlockEnd: 0 }}><Icons.arrowLeft size={11} /> Contexts</Link>
              <div className="fp-agentd-topbar-actions">
                <Button variant="ghost" onClick={() => router.refresh()}>
                  <Icons.refresh size={14} /> Sync now
                </Button>
                <Button variant="ember">
                  <Icons.plus size={14} /> Attach to agent
                </Button>
              </div>
            </div>

            <div className="fp-agentd-title">
              <span
                className="fp-agentd-ctx-ic"
                aria-hidden="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'var(--surface-active)',
                  flexShrink: 0,
                }}
              >
                {ICON(ctx.icon, 20)}
              </span>
              <h1>{ctx.name}</h1>
              <Pill tone={st.tone} dot live={ctx.status === 'syncing'}>
                {st.label}
              </Pill>
            </div>

            <div
              className="fp-agentd-ctx-source"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBlockStart: 6,
                color: 'var(--fg-muted)',
                fontSize: 13,
              }}
            >
              <SourceCell ctx={ctx} />
              <span style={{ color: 'var(--fg-faint)' }}>·</span>
              <span>{ctx.owner}</span>
            </div>

            <p className="fp-agentd-summary">{ctx.desc}</p>
          </div>

          <Prose className="fp-agentd-instructions">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {overviewMarkdown(ctx)}
            </ReactMarkdown>
          </Prose>
        </div>
      </div>

      <div className="fp-agentd-rule" aria-hidden="true" />

      {/* ── Right: metadata sidebar ─────────────────────────────────────── */}
      <aside className="fp-agentd-aside">
        {/* Properties */}
        <AsideSection title="Properties">
          <dl className="fp-agentd-props">
            <dt>Source</dt>
            <dd><SourceCell ctx={ctx} /></dd>
            <dt>Owner</dt>
            <dd>{ctx.owner}</dd>
            <dt>Items indexed</dt>
            <dd className="mono">{fmtItems(ctx.items)}</dd>
            <dt>Last updated</dt>
            <dd>{ctx.updated}</dd>
            <dt>Status</dt>
            <dd>
              <Pill tone={st.tone} dot live={ctx.status === 'syncing'}>
                {st.label}
              </Pill>
            </dd>
          </dl>
        </AsideSection>

        {/* Sync */}
        <AsideSection title="Sync">
          <dl className="fp-agentd-props">
            <dt>Connector</dt>
            <dd>{sync.connector}</dd>
            <dt>Transport</dt>
            <dd className="mono" style={{ fontSize: 11 }}>{sync.transport}</dd>
            <dt>Schedule</dt>
            <dd>{sync.schedule}</dd>
            <dt>Last sync</dt>
            <dd>{sync.lastSync}</dd>
          </dl>
          <p
            style={{
              marginBlockStart: 8,
              fontSize: 11,
              color: 'var(--fg-muted)',
              lineHeight: 1.5,
            }}
          >
            {sync.freshnessNote}
          </p>
        </AsideSection>

        {/* Used by agents */}
        <AsideSection title="Used by agents" count={agentNames.length}>
          {agentNames.length === 0 ? (
            <EmptyState icon="sparkle" label="No agents attached yet." />
          ) : (
            <div className="fp-agentd-list">
              {agentNames.map((a) => (
                <div key={a.id} className="item">
                  <span className="ic">{ICON(a.icon, 14)}</span>
                  <span className="tx">
                    <span className="nm">{a.name}</span>
                    <span className="ds">{a.role}</span>
                  </span>
                  <Link
                    href={`/portal/agents/${a.id}`}
                    className="fp-agentd-more"
                    aria-label={`Open ${a.name}`}
                    style={{ flexShrink: 0 }}
                  >
                    <Icons.chevronRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </AsideSection>

        {/* Access */}
        <AsideSection title="Access">
          <dl className="fp-agentd-props">
            <dt>Data class</dt>
            <dd>
              {access.restricted ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.lock size={11} style={{ color: 'var(--fg-muted)', flexShrink: 0 }} />
                  {access.dataClass}
                </span>
              ) : (
                access.dataClass
              )}
            </dd>
          </dl>
          {access.readers.length > 0 && (
            <div className="fp-agentd-list" style={{ marginBlockStart: 6 }}>
              {access.readers.map((r) => (
                <div key={r} className="item">
                  <span className="ic">{ICON('user', 14)}</span>
                  <span className="tx">
                    <span className="nm">{r}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </AsideSection>
      </aside>
    </div>
  );
}
