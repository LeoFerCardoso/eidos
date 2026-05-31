'use client';
// Forge DS — Components / Card
// Page layout:
//   1. Installation     (TabbedCode)
//   2. Usage            (Frame: hello world)
//   3. Variants         (outline · elevated · ghost · compact · interactive)
//   4. In context       (realistic dashboard tile)
//   5. Accessibility    (keyboard · ARIA · contrast · motion)
//   6. RTL              (dir="rtl" live frame)
//   7. Anatomy          (labelled compound parts)
//   8. Do / Don't       (dd-grid)
//   9. API reference    (PropsTable per sub-part)
import {
  Icons,
  Frame,
  Section,
  SubHead,
  TabbedCode,
  PropsTable,
  installTabs,
  Lede,
  Mono,
  AutoPropsTable,
} from '@/ds/core';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardMedia,
} from '@/ds/core';

// ==========================================================================
// 1. INSTALLATION
// ==========================================================================

const INSTALL_TABS = installTabs('card');

// ==========================================================================
// 2. USAGE
// ==========================================================================

const USAGE_CODE = `import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/forge/card"
import { Button } from "@/components/forge/button"

export function Demo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service health</CardTitle>
        <CardDescription>Uptime over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>99.94% — well within SLO.</CardContent>
      <CardFooter actions>
        <Button variant="ghost">Skip</Button>
        <Button variant="ember">Open service</Button>
      </CardFooter>
    </Card>
  )
}`;

// ==========================================================================
// PAGE
// ==========================================================================

export default function CardPage() {
  return (
    <Section
      id="card"
      num="20"
      title="Card"
      desc="A bounded surface with optional header, body, and footer slots. The most common composition unit — dashboard tiles, settings groups, and content blocks are all Cards with different slots filled."
    >
      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={INSTALL_TABS} ariaLabel="package manager" />
      <Lede>
        Ships <Mono>Card</Mono> plus the slot subcomponents (<Mono>CardHeader</Mono>,{' '}
        <Mono>CardTitle</Mono>, <Mono>CardDescription</Mono>, <Mono>CardContent</Mono>,{' '}
        <Mono>CardFooter</Mono>, <Mono>CardMedia</Mono>). Pick the <em>Manual</em> tab to paste
        the source files instead.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <Card style={{ width: 360 }}>
          <CardHeader>
            <CardTitle>Service health</CardTitle>
            <CardDescription>Uptime over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <strong style={{ color: 'var(--fg)' }}>99.94%</strong> — well within SLO.
          </CardContent>
          <CardFooter actions>
            <button className="btn ghost">Skip</button>
            <button className="btn ember">Open service</button>
          </CardFooter>
        </Card>
      </Frame>

      {/* ====================================================================
          3. EXAMPLES divider eyebrow
          ==================================================================== */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }} />
      </div>

      {/* ---- Variants ---- */}
      <SubHead meta="3 variants">Variants</SubHead>
      <Lede up>
        <Mono>outline</Mono> is the default — bordered surface for forms, settings, and
        content blocks. <Mono>elevated</Mono> lifts with a shadow instead of a border —
        use on flat canvas (dashboard, home). <Mono>ghost</Mono> has neither; use it
        inside an already-bounded region so the hierarchy stays flat.
      </Lede>
      <Frame
        label="outline · elevated · ghost"
        code={`<Card variant="outline">…</Card>
<Card variant="elevated">…</Card>
<Card variant="ghost">…</Card>`}
      >
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', width: '100%' }}>
          {(['outline', 'elevated', 'ghost'] as const).map((v) => (
            <Card key={v} variant={v} style={{ flex: '1 1 180px', minWidth: 180 }}>
              <CardHeader>
                <CardTitle>{v[0].toUpperCase() + v.slice(1)}</CardTitle>
                <CardDescription>variant="{v}"</CardDescription>
              </CardHeader>
              <CardContent>Body text sits here.</CardContent>
            </Card>
          ))}
        </div>
      </Frame>

      {/* ---- Compact ---- */}
      <SubHead meta="compact">Stat tiles</SubHead>
      <Lede up>
        Pass <Mono>compact</Mono> for stat tile grids. Reduces internal padding on
        header, body, and footer uniformly — title size also drops one step to stay
        proportional.
      </Lede>
      <Frame
        label="compact + tabular heading"
        code={`<Card compact>
  <CardHeader>
    <p className="t-mono-label">Uptime</p>
    <CardTitle className="text-2xl tabular-nums">99.94%</CardTitle>
  </CardHeader>
  <CardContent>over 30 days</CardContent>
</Card>`}
      >
        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            width: '100%',
          }}
        >
          {[
            { l: 'Uptime', v: '99.94%', d: 'over 30 days' },
            { l: 'p50 latency', v: '12ms', d: 'edge regions' },
            { l: 'Deploys', v: '12', d: 'this month' },
            { l: 'Active runbooks', v: '4', d: 'all linked' },
          ].map((s) => (
            <Card key={s.l} compact>
              <CardHeader>
                <p className="t-mono-label" style={{ margin: 0 }}>
                  {s.l}
                </p>
                <CardTitle
                  style={{
                    fontSize: 'var(--text-2xl)',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                    marginBlockStart: 4,
                  }}
                >
                  {s.v}
                </CardTitle>
              </CardHeader>
              <CardContent
                style={{
                  paddingBlockStart: 0,
                  fontSize: 'var(--text-base)',
                  color: 'var(--fg-faint)',
                }}
              >
                {s.d}
              </CardContent>
            </Card>
          ))}
        </div>
      </Frame>

      {/* ---- With media ---- */}
      <SubHead meta="CardMedia">With media</SubHead>
      <Lede up>
        Place <Mono>CardMedia</Mono> as the first child to get a full-bleed image or
        preview region above the header. It is <Mono>aria-hidden</Mono> by default — pass
        an <Mono>alt</Mono> prop when it carries meaning.
      </Lede>
      <Frame
        label="thumbnail above the header"
        code={`<Card>
  <CardMedia alt="Service diagram">
    {/* <img> or <canvas> */}
  </CardMedia>
  <CardHeader>
    <CardTitle>forge-api</CardTitle>
    <CardDescription>Edge-deployed REST gateway.</CardDescription>
  </CardHeader>
  <CardFooter>
    <span className="t-mono-label">v2.14.0</span>
    <Button variant="link">Docs</Button>
  </CardFooter>
</Card>`}
      >
        <Card style={{ width: 320 }}>
          <CardMedia
            style={{
              height: 160,
              background:
                'linear-gradient(180deg, color-mix(in oklab, var(--ember) 18%, transparent), transparent 60%), linear-gradient(135deg, var(--surface), var(--bg-elevated))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--fg-faint)',
            }}
          >
            SERVICE
          </CardMedia>
          <CardHeader>
            <CardTitle>forge-api</CardTitle>
            <CardDescription>Edge-deployed REST gateway. 4 regions. p50 latency 12ms.</CardDescription>
          </CardHeader>
          <CardFooter>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-base)',
                color: 'var(--fg-faint)',
              }}
            >
              v2.14.0 · Sept 12
            </span>
            <button className="btn link" style={{ padding: '0 4px' }}>
              Docs <Icons.arrowRight size={12} />
            </button>
          </CardFooter>
        </Card>
      </Frame>

      {/* ---- Interactive ---- */}
      <SubHead meta="interactive">Interactive card</SubHead>
      <Lede up>
        Pass <Mono>interactive</Mono> on <Mono>Card</Mono> and wrap the whole card in
        a single <Mono>{'<a>'}</Mono> (or give it an <Mono>onClick</Mono> + <Mono>role="button"</Mono>).
        This is one Tab stop — do <em>not</em> also nest separate focusable controls
        inside; screen readers will read the title as the link name.
      </Lede>
      <Frame
        label="whole card is a link — one Tab stop"
        code={`<a href="/services/forge-api" style={{ textDecoration: 'none' }}>
  <Card interactive>
    <CardHeader>
      <CardTitle>forge-api</CardTitle>
      <CardDescription>REST gateway · 99.94% uptime</CardDescription>
    </CardHeader>
  </Card>
</a>`}
      >
        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            width: '100%',
          }}
        >
          {[
            { name: 'forge-api', desc: 'REST gateway · 99.94% uptime' },
            { name: 'forge-jobs', desc: 'Background workers · 12 active' },
            { name: 'forge-ledger', desc: 'Event store · 3.2M events/day' },
          ].map((s) => (
            <a
              key={s.name}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ textDecoration: 'none' }}
            >
              <Card interactive style={{ height: '100%' }}>
                <CardHeader>
                  <CardTitle>{s.name}</CardTitle>
                  <CardDescription>{s.desc}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </Frame>

      {/* ---- Inline action ---- */}
      <SubHead meta="CardHeader row">Inline action</SubHead>
      <Frame
        label="title + description leading, action trailing"
        code={`<Card>
  <CardHeader row>
    <div>
      <CardTitle>Recent deploys</CardTitle>
      <CardDescription>Last 30 days · forge-api</CardDescription>
    </div>
    <Button size="xs">View all</Button>
  </CardHeader>
  <CardContent>{/* … */}</CardContent>
</Card>`}
      >
        <Card style={{ width: '100%', maxWidth: 520 }}>
          <CardHeader row>
            <div>
              <CardTitle>Recent deploys</CardTitle>
              <CardDescription>Last 30 days · forge-api</CardDescription>
            </div>
            <button className="btn xs">View all</button>
          </CardHeader>
          <CardContent style={{ paddingTop: 4 }}>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: 'var(--text-base)',
                color: 'var(--fg-muted)',
              }}
            >
              {[
                { v: 'v2.14.0', d: 'Sept 12' },
                { v: 'v2.13.4', d: 'Sept 9' },
                { v: 'v2.13.3', d: 'Sept 6' },
              ].map((row, i, arr) => (
                <li
                  key={row.v}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span>{row.v}</span>
                  <span
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)' }}
                  >
                    {row.d}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Frame>

      {/* ====================================================================
          4. IN CONTEXT
          ==================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        A typical dashboard panel: stat row on top, deploy history below with a header
        action and a footer for pagination metadata.
      </Lede>
      <Frame label="dashboard tile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520, width: '100%' }}>
          <div
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(3, 1fr)',
            }}
          >
            {[
              { l: 'Uptime', v: '99.94%' },
              { l: 'p50', v: '12ms' },
              { l: 'Deploys', v: '12' },
            ].map((s) => (
              <Card key={s.l} compact>
                <CardHeader>
                  <p className="t-mono-label" style={{ margin: 0 }}>
                    {s.l}
                  </p>
                  <CardTitle
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em',
                      marginBlockStart: 4,
                    }}
                  >
                    {s.v}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader row>
              <div>
                <CardTitle>Recent deploys</CardTitle>
                <CardDescription>forge-api · last 30 days</CardDescription>
              </div>
              <button className="btn xs outline">View all</button>
            </CardHeader>
            <CardContent style={{ paddingTop: 4 }}>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: 'var(--text-base)',
                  color: 'var(--fg-muted)',
                }}
              >
                {[
                  { v: 'v2.14.0', d: 'Sept 12' },
                  { v: 'v2.13.4', d: 'Sept 9' },
                  { v: 'v2.13.3', d: 'Sept 6' },
                ].map((row, i, arr) => (
                  <li
                    key={row.v}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <span>{row.v}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)' }}>
                      {row.d}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-faint)' }}>
                Showing 3 of 12
              </span>
              <button className="btn link" style={{ padding: '0 4px' }}>
                View all
              </button>
            </CardFooter>
          </Card>
        </div>
      </Frame>

      {/* ====================================================================
          5. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            A static card is not a focus stop. Its footer buttons and links are reached in
            DOM order with <Mono>Tab</Mono> and fire on <Mono>Enter</Mono> /{' '}
            <Mono>Space</Mono>. An interactive card wraps in a single{' '}
            <Mono>{'<a>'}</Mono> — one <Mono>Tab</Mono> stop, <Mono>Enter</Mono>{' '}
            activates — so do not also nest separate focusable controls inside it.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            <Mono>CardTitle</Mono> renders a real <Mono>{'<h3>'}</Mono> (adjustable via{' '}
            <Mono>as</Mono>) so cards appear in the document outline and are navigable by
            heading shortcut. The decorative <Mono>CardMedia</Mono> is{' '}
            <Mono>aria-hidden</Mono> by default; pass <Mono>alt</Mono> when the media
            carries meaning. An interactive card's anchor takes its accessible name from
            the title text automatically.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus and contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            An interactive card shows the ember focus ring (<Mono>--ring</Mono>) around the
            whole surface via <Mono>:focus-within</Mono> — this fires whether the card div
            itself is focused (onClick+tabIndex pattern) or an inner anchor is focused
            (anchor-wrapped pattern), so both patterns get the card-scoped ring.
            Title (<Mono>--fg</Mono>), description (
            <Mono>--fg-muted</Mono>), and footer meta all clear WCAG AA on the elevated
            card surface. The ember footer button uses dark ink (<Mono>--ember-fg</Mono>) on its
            fill.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The <Mono>interactive</Mono> variant lifts 2px with a shadow via{' '}
            <Mono>--dur</Mono> / <Mono>--ease</Mono>. Under{' '}
            <Mono>prefers-reduced-motion: reduce</Mono> the component-scoped media query
            collapses the lift to instant — the card still signals hover via{' '}
            <Mono>border-color: var(--border-strong)</Mono> without any movement.
          </div>
        </div>
      </div>

      {/* ====================================================================
          6. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — leading/trailing flip with reading direction'
        code={`<div dir="rtl">
  <Card>
    <CardHeader row>
      <div>
        <CardTitle>عمليات النشر الأخيرة</CardTitle>
        <CardDescription>آخر ٣٠ يومًا · forge-api</CardDescription>
      </div>
      <Button size="xs">عرض الكل</Button>
    </CardHeader>
    <CardContent>{/* deploy list */}</CardContent>
    <CardFooter actions>
      <Button variant="ghost">إلغاء</Button>
      <Button variant="ember">فتح الخدمة</Button>
    </CardFooter>
  </Card>
</div>`}
      >
        <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
          <Card style={{ width: '100%', maxWidth: 520 }}>
            <CardHeader row>
              <div>
                <CardTitle>عمليات النشر الأخيرة</CardTitle>
                <CardDescription>آخر ٣٠ يومًا · forge-api</CardDescription>
              </div>
              <button className="btn xs">عرض الكل</button>
            </CardHeader>
            <CardContent style={{ paddingTop: 4 }}>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: 'var(--text-base)',
                  color: 'var(--fg-muted)',
                }}
              >
                {[
                  { v: 'v2.14.0', d: '١٢ سبتمبر' },
                  { v: 'v2.13.4', d: '٩ سبتمبر' },
                  { v: 'v2.13.3', d: '٦ سبتمبر' },
                ].map((row, i, arr) => (
                  <li
                    key={row.v}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <span>{row.v}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)' }}>
                      {row.d}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter actions>
              <button className="btn ghost">إلغاء</button>
              <button className="btn ember">فتح الخدمة</button>
            </CardFooter>
          </Card>
          <div
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              width: '100%',
            }}
          >
            {[
              { l: 'وقت التشغيل', v: '٩٩٫٩٤٪', d: 'خلال ٣٠ يومًا' },
              { l: 'زمن الاستجابة p50', v: '١٢ مللي', d: 'مناطق الحافة' },
              { l: 'عمليات النشر', v: '١٢', d: 'هذا الشهر' },
            ].map((s) => (
              <Card key={s.l} compact>
                <CardHeader>
                  <p className="t-mono-label" style={{ margin: 0 }}>
                    {s.l}
                  </p>
                  <CardTitle
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em',
                      marginBlockStart: 4,
                    }}
                  >
                    {s.v}
                  </CardTitle>
                </CardHeader>
                <CardContent
                  style={{
                    paddingBlockStart: 0,
                    fontSize: 'var(--text-base)',
                    color: 'var(--fg-faint)',
                  }}
                >
                  {s.d}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Frame>
      <Lede>
        Card uses <Mono>padding-inline</Mono> and <Mono>padding-block</Mono> throughout,
        so the leading/trailing edges flip automatically under <Mono>dir="rtl"</Mono>.
        The <Mono>CardHeader row</Mono> flex layout respects <Mono>flex-direction</Mono>
        — title lands on the right and the action on the left with no overrides.
        Non-directional icons (no arrows here) require no mirroring.
      </Lede>

      {/* ====================================================================
          7. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head">
          <span className="label">anatomy</span>
        </div>
        <div className="ds-frame-body" style={{ padding: '56px 36px 48px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <Card style={{ width: 300 }}>
                <CardMedia
                  style={{
                    height: 80,
                    background: 'linear-gradient(135deg, var(--surface), var(--bg-elevated))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--fg-faint)',
                  }}
                >
                  MEDIA
                </CardMedia>
                <CardHeader>
                  <CardTitle>Service health</CardTitle>
                  <CardDescription>Uptime over 30 days.</CardDescription>
                </CardHeader>
                <CardContent style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
                  99.94% — within SLO.
                </CardContent>
                <CardFooter actions>
                  <button className="btn ghost xs" tabIndex={-1}>Skip</button>
                  <button className="btn ember xs" tabIndex={-1}>Open</button>
                </CardFooter>
              </Card>
              {/* leads + pins */}
              <span className="lead h" style={{ top: 36, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 100, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 126, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 168, left: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 24, left: -28, width: 24 }} />
              <div className="pin" style={{ top: 28, left: -52 }}>1</div>
              <div className="pin" style={{ top: 92, left: -52 }}>2</div>
              <div className="pin" style={{ top: 118, left: -52 }}>3</div>
              <div className="pin" style={{ top: 160, left: -52 }}>4</div>
              <div className="pin" style={{ bottom: 16, left: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '48px auto 0' }}>
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>CardMedia.</b> Optional full-bleed region. aria-hidden by default; pass <Mono>alt</Mono> when it carries meaning.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>CardTitle.</b> Geist 600 / 15px. Real heading — participates in document outline. Adjust <Mono>as</Mono> (h2–h4) per context.
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>CardDescription.</b> Muted / 13px. One sentence. Drop it when the body is self-evident.
            </span>
            <span className="num">4</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>CardContent.</b> Accepts anything — text, lists, charts, forms. Padding matches the header; content takes the lead.
            </span>
            <span className="num">5</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>CardFooter.</b> Hairline divider + tinted background. Holds actions or metadata. Pass <Mono>actions</Mono> to push controls to the trailing edge.
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          8. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — let cards breathe
          </div>
          <div className="body" style={{ padding: 14 }}>
            <Card style={{ width: '100%', maxWidth: 320 }}>
              <CardHeader>
                <CardTitle>forge-api</CardTitle>
                <CardDescription>REST gateway</CardDescription>
              </CardHeader>
              <CardContent style={{ paddingTop: 4, fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
                p50 12ms · 99.94% uptime
              </CardContent>
            </Card>
          </div>
          <div className="note">
            Generous internal padding. The card's job is to bound content — not to compress it.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don't — cards-on-cards
          </div>
          <div className="body" style={{ padding: 14 }}>
            <Card style={{ width: '100%', maxWidth: 320 }}>
              <CardHeader>
                <CardTitle>forge-api</CardTitle>
              </CardHeader>
              <CardContent style={{ paddingTop: 4 }}>
                <div
                  style={{
                    border: '1px solid var(--danger)',
                    borderRadius: 6,
                    padding: '10px 14px',
                    background: 'var(--bg-elevated)',
                  }}
                >
                  <p style={{ fontSize: 'var(--text-base)', margin: 0, color: 'var(--fg-muted)' }}>
                    Inner stat card
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="note">
            Nested cards trap the eye. Use a divider, a section heading, or a table — not another box.
          </div>
        </div>
        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — interactive card is a single link
          </div>
          <div className="body" style={{ padding: 14 }}>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none' }}>
              <Card interactive style={{ width: '100%', maxWidth: 320 }}>
                <CardHeader>
                  <CardTitle>forge-ledger</CardTitle>
                  <CardDescription>Event store · 3.2M events/day</CardDescription>
                </CardHeader>
              </Card>
            </a>
          </div>
          <div className="note">
            Wrap the whole card in one {'<a>'} — accessible name comes from the title, one Tab stop.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don't — nested interactives inside interactive card
          </div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <Card interactive style={{ width: '100%', maxWidth: 320, cursor: 'pointer' }}>
              <CardHeader>
                <CardTitle>forge-ledger</CardTitle>
                <CardDescription>Event store</CardDescription>
              </CardHeader>
              <CardFooter actions>
                <button className="btn ghost xs" tabIndex={-1}>Archive</button>
                <button className="btn ember xs" tabIndex={-1}>Open</button>
              </CardFooter>
            </Card>
          </div>
          <div className="note">
            Mixing a clickable card surface with nested buttons creates ambiguous Tab stops and confuses keyboard users.
          </div>
        </div>
      </div>

      {/* ====================================================================
          9. API REFERENCE
          ==================================================================== */}
      <SubHead meta="CardProps">API reference</SubHead>
      <AutoPropsTable component="Card" />
      <PropsTable
        label="<CardHeader />"
        rows={[
          {
            prop: 'row',
            type: 'boolean',
            default: 'false',
            description:
              'Switch to flex-row layout — title+description on the start, action on the end.',
          },
          {
            prop: 'className',
            type: 'string',
            default: undefined,
            description: 'Extra utility classes. Merged via cn().',
          },
          {
            prop: 'children',
            type: 'ReactNode',
            required: true,
            description: 'Typically CardTitle + CardDescription (and optionally a trailing action).',
          },
        ]}
      />
      <PropsTable
        label="<CardTitle />"
        rows={[
          {
            prop: 'as',
            type: '"h2" | "h3" | "h4"',
            default: '"h3"',
            description:
              'Heading level. Adjust to match the document outline — h3 is the default for cards inside a page section.',
          },
          {
            prop: 'className',
            type: 'string',
            default: undefined,
            description: 'Extra utility classes.',
          },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Heading text.' },
        ]}
      />
      <PropsTable
        label="<CardDescription /> · <CardContent /> · <CardMedia />"
        rows={[
          {
            prop: 'className',
            type: 'string',
            default: undefined,
            description: 'Extra utility classes.',
          },
          {
            prop: 'children',
            type: 'ReactNode',
            required: true,
            description: 'Slot content.',
          },
        ]}
      />
      <PropsTable
        label="<CardMedia />"
        rows={[
          {
            prop: 'alt',
            type: 'string',
            default: undefined,
            description:
              'Accessible label for the media region. When omitted the element is aria-hidden.',
          },
          {
            prop: 'className',
            type: 'string',
            default: undefined,
            description: 'Extra utility classes.',
          },
          {
            prop: 'children',
            type: 'ReactNode',
            required: false,
            description: 'Image, canvas, or other media content.',
          },
        ]}
      />
      <PropsTable
        label="<CardFooter />"
        rows={[
          {
            prop: 'actions',
            type: 'boolean',
            default: 'false',
            description:
              'Push children to the trailing edge (justify-content: flex-end). Use for action rows.',
          },
          {
            prop: 'className',
            type: 'string',
            default: undefined,
            description: 'Extra utility classes.',
          },
          {
            prop: 'children',
            type: 'ReactNode',
            required: true,
            description: 'Actions or metadata.',
          },
        ]}
      />
    </Section>
  );
}
