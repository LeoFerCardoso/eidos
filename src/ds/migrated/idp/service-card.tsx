'use client';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, ServiceCard, MOCKS, Lede, Mono, Skeleton } from '@/ds/core';


const services = (MOCKS.SERVICES || []);
const people = (MOCKS.PEOPLE || []);
// Pick a deterministic team for each service so the avatar group is stable
// across re-renders. n is the team size; rotates through PEOPLE by index.
const teamFor = (idx, n) => people.slice((idx * 2) % Math.max(1, people.length - n), ((idx * 2) % Math.max(1, people.length - n)) + n);
// pair services to owners
const findPerson = (tribe) => people.find(p => (p.role || '').includes(tribe)) || people[0];

const sparkA = [142, 138, 145, 152, 148, 151, 142, 139, 144, 141, 143, 142];
const sparkB = [89, 92, 88, 95, 91, 88, 87, 86, 88, 90, 89, 89];

const USAGE = `import { ServiceCard } from "@/components/forge/service-card"

export function Demo() {
  return (
    <ServiceCard
      service={{
        name: "pix-router",
        tier: "T1",
        lang: "Go",
        version: "2.7.0",
        p95: 89,
        deploys: "14m ago",
        alert: true,
      }}
      contributors={[
        { name: "Rafael Mendonça", initials: "RM" },
        { name: "Camila Tanaka",   initials: "CT" },
        { name: "Diego Vasconcelos", initials: "DV" },
        { name: "Beatriz Okamoto", initials: "BO" },
      ]}
      sparkSeries={[89, 92, 88, 95, 91, 88, 87, 88, 89]}
      variant="detailed"
    />
  )
}`;

// Loading placeholder — mirrors the real .service-card geometry (44px avatar,
// name + version lines, sparkline block, footer) so the tile reserves its slot
// while the catalog fetch resolves. One role="status" announcement for the
// whole tile; every shape inside is decorative (aria-hidden via <Skeleton/>).
function ServiceCardSkeleton({ variant = 'detailed' }) {
  return (
    <div
      className={'service-card variant-' + variant}
      role="status"
      aria-busy="true"
      aria-label="Loading service"
    >
      <header className="sc-head">
        <Skeleton variant="circle" size={44} radius="var(--radius-xl)"/>
        <div className="sc-id" style={{ gap: 6 }}>
          <Skeleton variant="line" width="58%" height={12}/>
          <Skeleton variant="line" width="40%" height={10}/>
        </div>
        <Skeleton variant="box" width={62} height={22} radius={999}/>
      </header>
      {variant === 'detailed' && (
        <div className="sc-spark"><Skeleton variant="box" width="100%" height={48} radius={8}/></div>
      )}
      <footer className="sc-foot">
        <div style={{ display: 'flex' }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="circle" size={26} style={{ marginInlineStart: i ? -8 : 0 }}/>
          ))}
        </div>
        <Skeleton variant="box" width={54} height={20} radius={999}/>
      </footer>
    </div>
  );
}

export default function ServiceCardPage() {
  return (
    <Section id="el-service-card" title="Service card" desc="Catalog tile for a microservice — name, version, tier, language, owner, health and p95 in one block. Use ServiceCard wherever the catalog needs a tile: the dashboard grid, a search-result row, a dependency drawer.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('service-card')} ariaLabel="package manager"/>
      <Lede>Reach for <Mono>&lt;ServiceCard/&gt;</Mono> wherever the catalog needs a tile — the dashboard's "owned services" grid, the search-result row, the dependency drawer. The recipe owns the badge order so two surfaces never disagree.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Composed from Card + TierBadge + LangBadge + HealthBadge + OwnerPill + Sparkline. The recipe owns the badge order so two surfaces never disagree. Three variants: <Mono>compact</Mono> (slim header-only row) for dense catalog lists, <Mono>default</Mono> (no sparkline) for grids, and <Mono>detailed</Mono> (sparkline + p95 + footer) for the service-detail page.</Lede>
      <Frame label="detailed · the full tile" code={USAGE}>
        <div style={{maxWidth: 340}}>
          <ServiceCard service={services[1]} contributors={teamFor(1, 4)} sparkSeries={sparkB} variant="detailed"/>
        </div>
      </Frame>
      <Lede>Header shows the service name + version · deploy timestamp on a mono micro-label, with the HealthBadge flush right. The footer carries the contributor AvatarGroup (3 + "+N") and the language badge. Detailed adds a sparkline with the p95 readout in the middle.</Lede>

      <div style={{ marginTop: 36, marginBottom: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)'}}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="dense catalog list">Compact variant</SubHead>
      <Frame label="`compact` · header-only slim row · stacked list" code={`<ServiceCard service={…} variant="compact" />`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
          <ServiceCard service={services[0]} variant="compact"/>
          <ServiceCard service={services[2]} variant="compact"/>
          <ServiceCard service={{ ...services[1], alert: true }} variant="compact"/>
          <ServiceCard service={services[4]} variant="compact"/>
        </div>
      </Frame>
      <Lede>Compact drops the footer entirely — just the server glyph, name + version line and HealthBadge on one slim row. Reach for it in the search palette, a dependency drawer, or any dense list where a 3-up grid would waste vertical space.</Lede>

      <SubHead meta="catalog grid · 3-up">Default variant</SubHead>
      <Frame label="`clean` · slim · catalog grid · 3-up" code={`<ServiceCard service={…} person={…} variant="default" />`}>
        <div className="ds-grid cols-3">
          <ServiceCard service={services[0]} contributors={teamFor(0, 5)} variant="default"/>
          <ServiceCard service={services[1]} contributors={teamFor(1, 4)} variant="default"/>
          <ServiceCard service={services[2]} contributors={teamFor(2, 3)} variant="default"/>
          <ServiceCard service={services[3]} contributors={teamFor(3, 6)} variant="default"/>
          <ServiceCard service={services[4]} contributors={teamFor(4, 3)} variant="default"/>
          <ServiceCard service={services[5]} contributors={teamFor(5, 5)} variant="default"/>
        </div>
      </Frame>
      <Lede>Clean drops the sparkline and the footer — perfect for the catalog page where the grid pulls 30+ services. Click-through to the service-detail surface for the full tile.</Lede>

      <SubHead meta="service detail page">Detailed variant</SubHead>
      <Frame label="`detailed` · sparkline + p95 + version + deploys footer · 2-up" code={`<ServiceCard service={…} person={…} sparkSeries={[…]} variant="detailed" />`}>
        <div className="ds-grid cols-2">
          <ServiceCard service={services[0]} contributors={teamFor(0, 5)} sparkSeries={sparkA} variant="detailed"/>
          <ServiceCard service={services[1]} contributors={teamFor(1, 4)} sparkSeries={sparkB} variant="detailed"/>
        </div>
      </Frame>

      <SubHead meta="health states">Up · degraded · with alert</SubHead>
      <Frame label="the `alert` flag on the service swaps the badge to degraded" code={`{ name: "pix-router", tier: "T1", alert: true }   // → "Degraded"
{ name: "consent-vault", tier: "T1", alert: false } // → "Up"`}>
        <div className="ds-grid cols-2">
          <ServiceCard service={services[5]} contributors={teamFor(5, 5)} variant="default"/>
          <ServiceCard service={{ ...services[1], alert: true }} contributors={teamFor(1, 4)} variant="default"/>
        </div>
      </Frame>

      <SubHead meta="loading · empty">State coverage</SubHead>
      <Lede>A catalog tile lives between three non-populated states. While the fetch resolves it shows a <Mono>loading</Mono> placeholder shaped exactly like the resolved tile — same 44px glyph, two title lines, footer — so the grid never reflows on arrival. <Mono>onOpen</Mono> is omitted on the skeleton so a loading tile is never focusable. The empty cases keep the card frame and drop the canonical <Mono>.empty</Mono> chrome inside: <Mono>no-service</Mono> for a filtered catalog that matched nothing, and <Mono>no-team</Mono> for a service whose owner is still unassigned.</Lede>
      <Frame label="loading skeleton (reserves the slot) · no-service · no-team" code={`// loading — reserve the slot, no onOpen so it's not focusable
{loading ? <ServiceCardSkeleton variant="detailed" /> : <ServiceCard … />}

// empty — keep the card frame, fill with the canonical <Empty/>
// no service matched the catalog filter / owner not yet assigned`}>
        <div className="ds-grid cols-3">
          <ServiceCardSkeleton variant="detailed"/>
          <div className="service-card" style={{ justifyContent: 'center' }}>
            <div className="empty sm" role="status">
              <span className="empty-icon" aria-hidden="true"><Icons.search size={18}/></span>
              <div className="empty-text">
                <div className="empty-title">No services match</div>
                <div className="empty-desc">No service matched this catalog filter. Clear the query or widen the tier.</div>
              </div>
            </div>
          </div>
          <div className="service-card" style={{ justifyContent: 'center' }}>
            <div className="empty sm">
              <span className="empty-icon" aria-hidden="true"><Icons.user size={18}/></span>
              <div className="empty-text">
                <div className="empty-title">No owner yet</div>
                <div className="empty-desc">This service has no team assigned. The footer collapses rather than render an empty avatar row.</div>
              </div>
            </div>
          </div>
        </div>
      </Frame>
      <Lede>The shipped component returns <Mono>null</Mono> for a missing <Mono>service</Mono> and auto-collapses the footer when <Mono>contributors</Mono> is empty and there is no <Mono>lang</Mono> — so "no-team" is the component's own behaviour, while "no-service" and the skeleton are the surrounding grid's responsibility. Pair the loading tile with <Mono>aria-busy</Mono> on its container so the swap to live data is announced once.</Lede>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>When <Mono>onOpen</Mono> is set the whole tile is one <Mono>Tab</Mono> stop that activates on <Mono>Enter</Mono>/<Mono>Space</Mono>; the badges, owner pill and avatar group inside are not separate stops, so a 30-tile catalog tabs cleanly tile-to-tile. A non-interactive card stays out of the tab order.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>An interactive tile is a <Mono>role=&quot;button&quot;</Mono> named for the service. The HealthBadge announces its state as text ("Degraded"), TierBadge and LangBadge read their labels (T1, Go), and the AvatarGroup exposes the visible owners plus an accessible "+N more" — the overflow count is announced, not just drawn.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Up / degraded health is carried by the HealthBadge label and dot rather than colour alone, and the <Mono>alert</Mono> flag flips the label text — so health survives greyscale. The tier and language badges always pair tone with text, and badge / version / p95 type all meet AA against the card surface.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Density, focus &amp; async</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The interactive tile keeps a full visible focus ring around its whole footprint, kept above the minimum target. The loading skeleton carries one <Mono>role=&quot;status&quot;</Mono> + <Mono>aria-busy</Mono> announcement and stays out of the tab order (no <Mono>onOpen</Mono>); its shimmer rests as a flat block under <Mono>prefers-reduced-motion</Mono>. The avatar group caps at three visible plus a counter so the footer never crowds, and any degraded-health pulse is suppressed under reduced-motion too.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — service name anchors to the right, HealthBadge and LangBadge flip to the inline-end (left)'>
        <div dir="rtl" className="ds-grid cols-2">
          <ServiceCard service={services[0]} contributors={teamFor(0, 5)} variant="default"/>
          <ServiceCard service={{ ...services[1], alert: true }} contributors={teamFor(1, 4)} sparkSeries={sparkB} variant="detailed"/>
        </div>
      </Frame>
      <Lede>
        The card uses logical CSS properties throughout — the service name and version line anchor to the inline-start (right in RTL), the HealthBadge flips to the inline-end (left), and the footer AvatarGroup and LangBadge swap sides. The sparkline is a decorative visual that does not mirror; the time axis always reads left-to-right.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 300 }} aria-hidden="true">
              <ServiceCard service={services[1]} contributors={teamFor(1, 4)} sparkSeries={sparkB} variant="detailed"/>
              {/* pin 1 — service name + version line */}
              <span className="lead v" style={{ top: -26, left: 52, height: 22 }} />
              <div className="pin" style={{ top: -48, left: 52, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — HealthBadge (top-right) */}
              <span className="lead v" style={{ top: -26, right: 10, height: 22 }} />
              <div className="pin" style={{ top: -48, right: 10, transform: 'translateX(50%)' }}>2</div>
              {/* pin 3 — sparkline + p95 readout */}
              <span className="lead h" style={{ top: 88, right: -30, width: 24 }} />
              <div className="pin" style={{ top: 78, right: -52 }}>3</div>
              {/* pin 4 — contributor AvatarGroup */}
              <span className="lead v" style={{ bottom: -26, left: 28, height: 22 }} />
              <div className="pin" style={{ bottom: -48, left: 28, transform: 'translateX(-50%)' }}>4</div>
              {/* pin 5 — LangBadge */}
              <span className="lead v" style={{ bottom: -26, right: 20, height: 22 }} />
              <div className="pin" style={{ bottom: -48, right: 20, transform: 'translateX(50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Name + version line.</b> Service name in Geist 500/13; version and deploy timestamp in <Mono>--font-mono</Mono> at <Mono>--text-xs</Mono>, muted — so the on-call eye reads "what is it" before "when did it ship".</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>HealthBadge.</b> Flush right in the header. Green dot = Up, amber pulse = Degraded. Colour + label, never colour alone — survives greyscale.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Sparkline + p95.</b> Detailed variant only. 24h latency shape drawn at 260 × 32px in <Mono>--accent</Mono>; p95 numeric readout in tabular mono top-right. Omit in the default variant used for catalog grids.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Contributor AvatarGroup.</b> Up to 3 initials-avatars + a <Mono>+N</Mono> overflow counter. Treats the card as a team artifact, not a single-owner page.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>LangBadge.</b> Language dot + name in the footer's trailing slot. A row of cards reveals its tech-stack palette at a glance without cluttering the header.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pick the variant that matches the surface</div>
          <div className="body">
            <div style={{maxWidth: 240}}>
              <ServiceCard service={services[0]} contributors={teamFor(0, 5)} variant="default"/>
            </div>
          </div>
          <div className="note">Clean for grids, detailed for the service page. Mixing them on the same surface breaks rhythm — every row should be the same height.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — overload the avatar group</div>
          <div className="body">
            <div style={{maxWidth: 240, padding: 14, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', background:'var(--surface)'}}>
              <div style={{display:'flex', gap: 2}}>
                {Array.from({length: 12}).map((_, i) => <div key={i} style={{width: 22, height: 22, borderRadius: '50%', background:'var(--surface-hover)', border:'2px solid var(--surface)'}}/>)}
              </div>
            </div>
          </div>
          <div className="note">Cap at 3 visible + counter. A line of 12 portraits is illegible — the user can't pick out faces and the count loses meaning. Open the team panel for the full list.</div>
        </div>
      </div>

      <SubHead meta="ServiceCardProps">API reference</SubHead>
      {/* Generated from the typed ServiceCard props (scripts/gen-props.mjs) — can't drift from the component. */}
      <AutoPropsTable component="ServiceCard" label="<ServiceCard />"/>
    </Section>
  );
}
