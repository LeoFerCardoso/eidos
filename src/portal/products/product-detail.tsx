'use client';
// Forge — Product detail. Composes the product's full estate from the catalog
// data (services, databases, buckets, cloud resources) plus its squads + people
// from teams.ts, and surfaces its responsibles (DRI, eng lead, PM) and internal
// modules. Three tabs: Overview (who + what), Components (the estate), Team.
import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  HealthBadge,
  Icons,
  LangBadge,
  Pill,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/ds/core';
import {
  FPageHeader,
  FKpi,
  FRows,
  FRow,
  Sub,
  PersonAvatar,
  AvatarStack,
  usePageCrumb,
} from '@/portal/shell/portal-shell';
import {
  getProduct,
  productServices,
  productDatabases,
  productBuckets,
  productCloud,
  productSquads,
  productPeople,
  productSpendMo,
  STAGE_TONE,
  fmtBrl,
  type Product,
} from '@/portal/data/products';
import { getPerson, getSquad, peopleInSquad } from '@/portal/data/teams';
import { getService } from '@/portal/data/services';

// Responsibles — collapse duplicate people (owner == PM, etc.) into one row
// carrying every role they hold on this product.
function responsibles(product: Product): { id: string; roles: string[] }[] {
  const order: [string | undefined, string][] = [
    [product.ownerId, 'Product owner'],
    [product.engLeadId, 'Engineering lead'],
    [product.pmId, 'Product manager'],
  ];
  const map = new Map<string, string[]>();
  for (const [pid, role] of order) {
    if (!pid) continue;
    const cur = map.get(pid) ?? [];
    if (!cur.includes(role)) cur.push(role);
    map.set(pid, cur);
  }
  return [...map.entries()].map(([id, roles]) => ({ id, roles }));
}

export default function ProductDetail({ id }: { id: string }) {
  const product = getProduct(id);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (product) setCrumb({ label: product.name, replace: true });
    return () => setCrumb(null);
  }, [product, setCrumb]);

  if (!product) {
    return (
      <div className="fp-empty" style={{ padding: '64px 0' }}>
        <Icons.package size={28} />
        <p>No product with id &ldquo;{id}&rdquo;.</p>
        <Button variant="ghost" asChild>
          <Link href="/portal/products"><Icons.chevronLeft size={13} /> Back to products</Link>
        </Button>
      </div>
    );
  }

  const services = productServices(product);
  const dbs = productDatabases(product);
  const buckets = productBuckets(product);
  const cloud = productCloud(product);
  const squads = productSquads(product);
  const people = productPeople(product);
  const owners = responsibles(product);

  return (
    <>
      <FPageHeader
        back={{ href: '/portal/products', label: 'Products' }}
        title={product.name}
        status={<Pill tone={STAGE_TONE[product.stage]}>{product.stage}</Pill>}
        subtitle={product.summary}
        meta={
          <>
            <span className="fp-meta-chip"><Icons.layers size={12} /> {product.tribe}</span>
            <span className="fp-meta-chip"><Icons.server size={12} /> {services.length} services</span>
            <span className="fp-meta-chip"><Icons.network size={12} /> {squads.length} squads · {people.length} people</span>
            <span className="fp-meta-chip"><Icons.gauge size={12} /> {fmtBrl(productSpendMo(product))}/mo</span>
          </>
        }
      />

      {/* KPIs */}
      <div className="fp-grid fp-grid-4">
        <FKpi label="Services" value={services.length} sub={<Sub muted>{services.filter((s) => s.alert).length} degraded</Sub>} />
        <FKpi label="Databases" value={dbs.length} sub={<Sub muted>{dbs.filter((d) => d.pii).length} hold PII</Sub>} />
        <FKpi label="Storages" value={buckets.length} sub={<Sub muted>object storage</Sub>} />
        <FKpi label="Cloud + storage" value={`${fmtBrl(productSpendMo(product))}`} sub={<Sub muted>per month</Sub>} />
      </div>

      <div style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <Tabs defaultValue="overview" className="fp-flat-tabs">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* ── Overview — responsibles, modules, APIs ──────────────────── */}
          <TabsContent value="overview">
            <div className="fp-grid fp-grid-2x1">
              <section className="fp-section">
                <div className="fp-section-title">Responsibles</div>
                <ul className="fp-resp">
                  {owners.map(({ id: pid, roles }) => {
                    const person = getPerson(pid);
                    if (!person) return null;
                    return (
                      <li key={pid} className="fp-resp-row">
                        <PersonAvatar initials={person.initials} size={32} title={person.name} />
                        <span className="fp-resp-id">
                          <span className="fp-resp-name">{person.name}</span>
                          <span className="fp-resp-role">{roles.join(' · ')} · {person.role}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="fp-section">
                <div className="fp-section-title">Exposed APIs</div>
                {product.apis && product.apis.length > 0 ? (
                  <div className="fp-tags">
                    {product.apis.map((a) => (
                      <Pill key={a} tone="neutral" style={{ border: '1px solid var(--border)' }}>
                        <Icons.braces size={11} /> {a}
                      </Pill>
                    ))}
                  </div>
                ) : (
                  <Sub muted>No public API products.</Sub>
                )}
              </section>
            </div>

            <section className="fp-section">
              <div className="fp-section-title">Modules</div>
              <div className="fp-grid fp-grid-2">
                {product.modules.map((m) => {
                  const owner = getPerson(m.ownerId);
                  return (
                    <div key={m.name} className="fp-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{m.name}</span>
                        {owner && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <PersonAvatar initials={owner.initials} size={20} title={owner.name} />
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{owner.name.split(' ')[0]}</span>
                          </span>
                        )}
                      </div>
                      <Sub muted>{m.blurb}</Sub>
                      <div className="fp-tags" style={{ marginBlockStart: 2 }}>
                        {m.serviceIds.map((sid) => {
                          const svc = getService(sid);
                          return svc ? (
                            <Link key={sid} href={`/portal/catalog/${sid}`} className="fp-tag" style={{ textDecoration: 'none' }}>
                              {svc.name}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </TabsContent>

          {/* ── Components — the full estate ─────────────────────────────── */}
          <TabsContent value="components">
            <section className="fp-section">
              <div className="fp-section-title">Services · {services.length}</div>
              <FRows>
                {services.map((s) => (
                  <FRow key={s.id} href={`/portal/catalog/${s.id}`}>
                    <div className="fp-row-main">
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{s.name}</div>
                      <Sub muted>{s.summary}</Sub>
                    </div>
                    <LangBadge lang={s.lang} />
                    {s.pii && <Pill tone="neutral" className="fp-pii">PII</Pill>}
                    <HealthBadge state={s.alert ? 'degraded' : 'up'} pulse={s.alert} />
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', minInlineSize: 60, textAlign: 'end' }}>{s.p95}ms</span>
                  </FRow>
                ))}
              </FRows>
            </section>

            <div className="fp-grid fp-grid-2">
              <section className="fp-section">
                <div className="fp-section-title">Databases · {dbs.length}</div>
                {dbs.length ? (
                  <FRows>
                    {dbs.map((d) => (
                      <FRow key={d.id} href="/portal/databases">
                        <div className="fp-row-main">
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{d.name}</div>
                          <Sub muted>{d.engine} · {d.env}</Sub>
                        </div>
                        {d.pii && <Pill tone="neutral" className="fp-pii">PII</Pill>}
                        <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{d.sizeGb} GB</span>
                      </FRow>
                    ))}
                  </FRows>
                ) : (
                  <Sub muted>No databases attached.</Sub>
                )}
              </section>

              <section className="fp-section">
                <div className="fp-section-title">Storages · {buckets.length}</div>
                {buckets.length ? (
                  <FRows>
                    {buckets.map((b) => (
                      <FRow key={b.id} href="/portal/buckets">
                        <div className="fp-row-main">
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{b.name}</div>
                          <Sub muted>{b.provider} · {b.content}</Sub>
                        </div>
                        {b.pii && <Pill tone="neutral" className="fp-pii">PII</Pill>}
                        <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{b.sizeGb} GB</span>
                      </FRow>
                    ))}
                  </FRows>
                ) : (
                  <Sub muted>No buckets attached.</Sub>
                )}
              </section>
            </div>

            <section className="fp-section">
              <div className="fp-section-title">Cloud resources · {cloud.length}</div>
              {cloud.length ? (
                <FRows>
                  {cloud.map((r) => (
                    <FRow key={r.id} href="/portal/cloud-resources">
                      <div className="fp-row-main">
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{r.name}</div>
                        <Sub muted>{r.type} · {r.provider} · {r.spec}</Sub>
                      </div>
                      <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{r.util}% util</span>
                      <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', minInlineSize: 90, textAlign: 'end' }}>{fmtBrl(r.costMo)}/mo</span>
                    </FRow>
                  ))}
                </FRows>
              ) : (
                <Sub muted>No cloud resources attached.</Sub>
              )}
            </section>
          </TabsContent>

          {/* ── Team — squads + people ───────────────────────────────────── */}
          <TabsContent value="team">
            <section className="fp-section">
              <div className="fp-section-title">Owning squads · {squads.length}</div>
              <FRows>
                {squads.map((sq) => {
                  const members = peopleInSquad(sq.id);
                  const lead = getPerson(sq.leadId);
                  return (
                    <FRow key={sq.id} href="/portal/teams">
                      <div className="fp-row-main">
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{sq.name}</div>
                        <Sub muted>{sq.mission}</Sub>
                      </div>
                      {lead && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minInlineSize: 140 }}>
                          <PersonAvatar initials={lead.initials} size={22} title={lead.name} />
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{lead.name.split(' ')[0]} · lead</span>
                        </span>
                      )}
                      <AvatarStack people={members.map((m) => ({ initials: m.initials, name: m.name }))} max={4} size={22} />
                      <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', minInlineSize: 28, textAlign: 'end' }}>{members.length}</span>
                    </FRow>
                  );
                })}
              </FRows>
            </section>

            <section className="fp-section">
              <div className="fp-section-title">People · {people.length}</div>
              <ul className="fp-resp" style={{ gap: 14 }}>
                {people.map((m) => (
                  <li key={m.id} className="fp-resp-row">
                    <PersonAvatar initials={m.initials} size={28} title={m.name} />
                    <span className="fp-resp-id">
                      <span className="fp-resp-name">{m.name}</span>
                      <span className="fp-resp-role">{m.role}</span>
                    </span>
                    <div className="fp-tags" style={{ justifyContent: 'flex-end' }}>
                      {m.squads.map((sid) => {
                        const sq = getSquad(sid);
                        return sq ? (
                          <Pill key={sid} tone="neutral" style={{ border: '1px solid var(--border)' }}>
                            {sq.name.replace(/^Squad\s+/, '')}
                          </Pill>
                        ) : null;
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
