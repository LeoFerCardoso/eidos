'use client';
// Forge — API catalog. Every API the bureau exposes, grouped by product and
// service, each linking back to its owning service.
//
// Brief — Persona: any engineer + API consumers / partners. Question: what APIs
// exist, who owns them, which are public, and which are deprecated? Data: APIS
// (src/portal/data/apis.ts). Primary action: open the owning service / filter by
// product. Distinctive move: visibility (public/partner/internal) and consumer
// counts surfaced so partner-facing surface area reads at a glance.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { APIS, KIND_TONE, KPIS, PRODUCTS, STATUS_TONE, VIS_TONE, type ApiKind, type ApiVisibility } from '@/portal/data/apis';

const PRODUCT_OPTS = [{ value: 'all', label: 'All products' }, ...PRODUCTS.map((p) => ({ value: p, label: p }))];
const KIND_OPTS = [
  { value: 'all', label: 'All kinds' },
  { value: 'REST', label: 'REST' },
  { value: 'gRPC', label: 'gRPC' },
  { value: 'GraphQL', label: 'GraphQL' },
  { value: 'Webhook', label: 'Webhook' },
  { value: 'Event', label: 'Event' },
];

// Get-started band (Frontstack-style Setup): install the Forge CLI in your
// package manager of choice, authenticate, and run an endpoint from the shell.
const PMS = [
  { id: 'npm', label: 'npm', cmd: 'npm i -g @forge/cli' },
  { id: 'pnpm', label: 'pnpm', cmd: 'pnpm add -g @forge/cli' },
  { id: 'yarn', label: 'yarn', cmd: 'yarn global add @forge/cli' },
  { id: 'brew', label: 'Homebrew', cmd: 'brew install equifax/tap/forge' },
];

function SetupCard() {
  const [pm, setPm] = React.useState('npm');
  const [copied, setCopied] = React.useState(false);
  const cmd = PMS.find((p) => p.id === pm)?.cmd ?? PMS[0].cmd;
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="fp-setup">
      <div className="fp-setup-tx">
        <span className="fp-setup-eyebrow mono">Get started</span>
        <h2 className="fp-setup-title">Integrate in minutes</h2>
        <p className="fp-setup-desc">
          Install the Forge CLI to call any API from your terminal, generate typed clients, and
          run requests in the Workbench. You can also call the REST surfaces directly.
        </p>
        <div className="fp-setup-steps mono">
          <span><span className="n">1</span> Install the CLI</span>
          <span><span className="n">2</span> <span className="c">forge login --workspace bvs</span></span>
          <span><span className="n">3</span> <span className="c">forge api acerta-consulta POST</span></span>
        </div>
      </div>
      <div className="fp-setup-code">
        <div className="fp-code-head">
          <div className="fp-lang-tabs" role="tablist" aria-label="Package manager">
            {PMS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={pm === p.id}
                className={`fp-lang-tab${pm === p.id ? ' is-active' : ''}`}
                onClick={() => setPm(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button type="button" className="fp-copy" onClick={() => copy(cmd)}>
            {copied ? <Icons.check size={12} /> : <Icons.copy size={12} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="fp-code-body mono"><span style={{ color: 'var(--fg-faint)' }}>$ </span>{cmd}</pre>
      </div>
    </div>
  );
}

export default function ApisPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [product, setProduct] = React.useState('all');
  const [kind, setKind] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = APIS;
    if (product !== 'all') list = list.filter((a) => a.product === product);
    if (kind !== 'all') list = list.filter((a) => a.kind === (kind as ApiKind));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q) || a.service.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.owner.toLowerCase().includes(q));
    }
    return list;
  }, [query, product, kind]);

  return (
    <>
      <FPageHeader
        eyebrow="Catalog"
        title="APIs"
        subtitle="Discover every API the bureau exposes, who owns it, and who is allowed to consume it."
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="ember"><Icons.plus size={13} /> Register API</Button>
          </>
        }
      />

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <SetupCard />
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 420, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search APIs, services, owners…" aria-label="Search APIs" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={product} onValueChange={setProduct} options={PRODUCT_OPTS} width="170px" />
        </span>
        <span className="fp-filter-select">
          <Select value={kind} onValueChange={setKind} options={KIND_OPTS} width="140px" />
        </span>
      </div>

      <FSection title="APIs" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>API</th>
                  <th>Kind</th>
                  <th>Service</th>
                  <th>Product</th>
                  <th>Visibility</th>
                  <th style={{ textAlign: 'end' }}>Consumers</th>
                  <th style={{ textAlign: 'end' }}>p95</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const st = STATUS_TONE[a.status];
                  return (
                    <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/portal/apis/${a.id}`)}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{a.name} <span className="mono" style={{ color: 'var(--fg-faint)', fontWeight: 400 }}>{a.version}</span></span>
                        <span className="fp-cell-sub">{a.desc}</span>
                      </td>
                      <td><Pill tone={KIND_TONE[a.kind]}>{a.kind}</Pill></td>
                      <td>
                        <Link href={`/portal/catalog/${a.service}`} className="fp-entity-link mono" onClick={(e) => e.stopPropagation()}>{a.service}</Link>
                      </td>
                      <td style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{a.product}</td>
                      <td><Pill tone={VIS_TONE[a.visibility as ApiVisibility]}>{a.visibility}</Pill></td>
                      <td className="mono" style={{ textAlign: 'end' }}>{a.consumers}</td>
                      <td className="mono" style={{ textAlign: 'end', color: a.p95 === 0 ? 'var(--fg-faint)' : 'var(--fg-muted)' }}>{a.p95 === 0 ? 'n/a' : `${a.p95}ms`}</td>
                      <td style={{ textAlign: 'end' }}><Pill tone={st.tone}>{st.label}</Pill></td>
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
          <span>No APIs match this filter.</span>
        </div>
      )}
    </>
  );
}
