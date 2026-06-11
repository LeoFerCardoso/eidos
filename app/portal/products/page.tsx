'use client';
// Forge — Products. A product is the business-facing offering composed of
// services, databases, buckets, cloud resources, squads and people. This list
// is the entry point; each card opens the product detail with its full estate
// and its responsibles. Everything is derived from the existing catalog data.
import * as React from 'react';
import Link from 'next/link';
import { Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FKpi, FSearch, Sub, AvatarStack } from '@/portal/shell/portal-shell';
import {
  PRODUCTS,
  PRODUCT_KPIS,
  STAGE_TONE,
  productServices,
  productDatabases,
  productBuckets,
  productCloud,
  productPeople,
  productSquads,
  productSpendMo,
  fmtBrl,
  type Product,
} from '@/portal/data/products';
import { TRIBES } from '@/portal/data/services';

function ProductCard({ product }: { product: Product }) {
  const services = productServices(product);
  const dbs = productDatabases(product);
  const buckets = productBuckets(product);
  const cloud = productCloud(product);
  const people = productPeople(product);
  const squads = productSquads(product);

  return (
    <Link href={`/portal/products/${product.id}`} className="fp-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="fp-card-head" style={{ marginBlockEnd: 0 }}>
        <div className="fp-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', inlineSize: 28, blockSize: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--surface-active)', color: 'var(--fg-muted)', flexShrink: 0 }}>
            <Icons.package size={15} />
          </span>
          {product.name}
        </div>
        <Pill tone={STAGE_TONE[product.stage]}>{product.stage}</Pill>
      </div>

      <div className="t-mono-label" style={{ color: 'var(--fg-muted)' }}>{product.tribe}</div>

      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
        {product.summary}
      </p>

      <div className="fp-meta" style={{ marginBlockStart: 'auto' }}>
        <span className="fp-meta-chip"><Icons.server size={12} /> {services.length} services</span>
        <span className="fp-meta-chip"><Icons.database size={12} /> {dbs.length} db</span>
        <span className="fp-meta-chip"><Icons.folder size={12} /> {buckets.length} buckets</span>
        <span className="fp-meta-chip"><Icons.cloud size={12} /> {cloud.length} cloud</span>
        <span className="fp-meta-chip"><Icons.gauge size={12} /> {fmtBrl(productSpendMo(product))}/mo</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlockStart: 10, borderBlockStart: '1px solid var(--border)' }}>
        <AvatarStack people={people.map((p) => ({ initials: p.initials, name: p.name }))} max={5} size={24} />
        <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
          {squads.length} {squads.length === 1 ? 'squad' : 'squads'} · {people.length} people
        </span>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const [query, setQuery] = React.useState('');
  const [tribe, setTribe] = React.useState('All tribes');
  const [stage, setStage] = React.useState('All stages');

  const filtered = React.useMemo(() => {
    let list = PRODUCTS;
    if (tribe !== 'All tribes') list = list.filter((p) => p.tribe === tribe);
    if (stage !== 'All stages') list = list.filter((p) => p.stage === stage);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tribe.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, tribe, stage]);

  return (
    <>
      <FPageHeader
        eyebrow="Catalog"
        title="Products"
        subtitle={`${PRODUCT_KPIS.products} products · ${PRODUCT_KPIS.services} services · ${PRODUCT_KPIS.squads} squads`}
      />

      <div className="fp-grid fp-grid-4">
        <FKpi label="Products" value={PRODUCT_KPIS.products} sub={<Sub muted>business offerings</Sub>} />
        <FKpi label="Services" value={PRODUCT_KPIS.services} sub={<Sub muted>across all products</Sub>} />
        <FKpi label="Owning squads" value={PRODUCT_KPIS.squads} sub={<Sub muted>delivery teams</Sub>} />
        <FKpi label="Cloud + storage" value={`${fmtBrl(PRODUCT_KPIS.spendMo)}/mo`} sub={<Sub muted>combined spend</Sub>} />
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 460, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Filter by name, tribe, description…" aria-label="Filter products" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select
            value={tribe}
            onValueChange={setTribe}
            options={[{ value: 'All tribes', label: 'All tribes' }, ...TRIBES.map((t) => ({ value: t, label: t }))]}
            width="180px"
          />
        </span>
        <span className="fp-filter-select">
          <Select
            value={stage}
            onValueChange={setStage}
            options={[
              { value: 'All stages', label: 'All stages' },
              { value: 'GA', label: 'GA' },
              { value: 'Beta', label: 'Beta' },
              { value: 'Sunset', label: 'Sunset' },
            ]}
            width="150px"
          />
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="fp-empty" style={{ marginBlockStart: 16 }}>
          <Icons.package size={20} />
          <div style={{ marginBlockStart: 8 }}>No products match your filters.</div>
        </div>
      ) : (
        <div className="fp-grid fp-grid-3" style={{ marginBlockStart: 14 }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
