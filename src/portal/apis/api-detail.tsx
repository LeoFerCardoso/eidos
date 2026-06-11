'use client';
// Forge — API detail (/portal/apis/[id]). T4 detail: back-in-eyebrow, plain
// title, meta chips, then the shared ApiExplorer (Endpoints | OpenAPI | Try it).
// The service detail's API tab renders the SAME explorer scoped to its APIs,
// so the contract reads identically wherever you meet it.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, StatusDot } from '@/ds/core';
import { FPageHeader, usePageCrumb } from '@/portal/shell/portal-shell';
import { ApiExplorer } from '@/portal/apis/api-explorer';
import { getApi } from '@/portal/data/apis';

const STATUS_TONE = { stable: 'success', beta: 'warning', deprecated: 'danger' } as const;
const VIS_LABEL = { public: 'Public', partner: 'Partner', internal: 'Internal' } as const;

export default function ApiDetail({ id }: { id: string }) {
  const api = getApi(id);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (api) setCrumb({ label: api.name, replace: true });
    return () => setCrumb(null);
  }, [api, setCrumb]);

  if (!api) {
    return (
      <div className="fp-empty" style={{ marginBlockStart: 24 }}>
        <StatusDot tone="error" />
        <span>
          API <span className="mono">{id}</span> not found.{' '}
          <Link href="/portal/apis" className="u-link">Back to APIs</Link>
        </span>
      </div>
    );
  }

  return (
    <>
      <FPageHeader
        back={{ href: '/portal/apis', label: 'APIs' }}
        title={api.name}
        status={<Pill tone={STATUS_TONE[api.status]}>{api.status}</Pill>}
        subtitle={api.desc}
        meta={
          <div className="fp-meta">
            <span className="fp-meta-chip mono">{api.kind} · {api.version}</span>
            <span className="fp-meta-chip"><Icons.eye size={12} /> {VIS_LABEL[api.visibility]}</span>
            <span className="fp-meta-chip"><Icons.user size={12} /> {api.consumers} consumers</span>
            <span className="fp-meta-chip mono">p95 {api.p95}ms</span>
            <span className="fp-meta-chip">
              <Icons.server size={12} />{' '}
              <Link href={`/portal/catalog/${api.service}`} className="u-link-quiet mono" style={{ marginBlockEnd: 0 }}>
                {api.service}
              </Link>
            </span>
          </div>
        }
        actions={
          <>
            <Button variant="ghost"><Icons.book size={13} /> Changelog</Button>
            <Button variant="outline"><Icons.key size={13} /> Request access</Button>
          </>
        }
      />

      <ApiExplorer api={api} />
    </>
  );
}
