import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardMedia,
} from '@eidos/ui';

const meta = {
  title: 'Elements/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Generic slotted surface. Compound: Card > CardMedia? + CardHeader(CardTitle + CardDescription) + CardContent + CardContent + CardFooter. ' +
          'Three variants (outline · elevated · ghost) and two densities (default · compact). ' +
          'When the whole card is interactive, pass `interactive` and wrap in an `<a>` — do NOT nest separate focusable controls inside.',
      },
    },
  },
  args: {
    variant: 'outline',
    compact: false,
    interactive: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'elevated', 'ghost'] },
    compact: { control: 'boolean' },
    interactive: { control: 'boolean' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ──────────────────────────────────────────────────────────────────

/** Basic card with header, body, and footer. */
export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Service health</CardTitle>
        <CardDescription>Uptime over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <strong style={{ color: 'var(--fg)' }}>99.94%</strong> — well within SLO. The
        single-minute outage on Sept 3 was during a planned migration.
      </CardContent>
      <CardFooter actions>
        <button className="btn ghost">Skip</button>
        <button className="btn ember">Open service</button>
      </CardFooter>
    </Card>
  ),
};

// ── Variants ─────────────────────────────────────────────────────────────────

/** All three visual variants side by side. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {(['outline', 'elevated', 'ghost'] as const).map((variant) => (
        <Card key={variant} variant={variant} style={{ width: 260 }}>
          <CardHeader>
            <CardTitle>{variant[0].toUpperCase() + variant.slice(1)}</CardTitle>
            <CardDescription>variant="{variant}"</CardDescription>
          </CardHeader>
          <CardContent>Supplementary body text for this variant.</CardContent>
        </Card>
      ))}
    </div>
  ),
};

// ── Compact ───────────────────────────────────────────────────────────────────

/** Stat tiles use compact density + tabular heading. */
export const Compact: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 12,
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        width: '100%',
        maxWidth: 680,
      }}
    >
      {[
        { label: 'Uptime', value: '99.94%', sub: 'over 30 days' },
        { label: 'p50 latency', value: '12ms', sub: 'edge regions' },
        { label: 'Deploys', value: '12', sub: 'this month' },
        { label: 'Active runbooks', value: '4', sub: 'all linked' },
      ].map((s) => (
        <Card key={s.label} compact>
          <CardHeader>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--fg-faint)',
                margin: 0,
              }}
            >
              {s.label}
            </p>
            <CardTitle
              as="h3"
              style={{
                fontSize: 'var(--text-2xl)',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                marginTop: 4,
              }}
            >
              {s.value}
            </CardTitle>
          </CardHeader>
          <CardContent style={{ paddingTop: 0, fontSize: 'var(--text-base)', color: 'var(--fg-faint)' }}>
            {s.sub}
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// ── WithMedia ─────────────────────────────────────────────────────────────────

/** CardMedia above the header — image, canvas, or a custom preview. */
export const WithMedia: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <CardMedia
        style={{
          height: 160,
          background: 'linear-gradient(135deg, var(--surface), var(--bg-elevated))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--fg-faint)',
        }}
      >
        SERVICE
      </CardMedia>
      <CardHeader>
        <CardTitle>eidos-api</CardTitle>
        <CardDescription>Edge-deployed REST gateway. 4 regions.</CardDescription>
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
          Docs
        </button>
      </CardFooter>
    </Card>
  ),
};

// ── Interactive ───────────────────────────────────────────────────────────────

/** Whole-card link — single Tab stop, hover lift, focus ring around the entire surface. */
export const Interactive: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 12,
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        width: '100%',
        maxWidth: 680,
      }}
    >
      {[
        { name: 'eidos-api', desc: 'REST gateway · 99.94% uptime' },
        { name: 'eidos-jobs', desc: 'Background workers · 12 active' },
        { name: 'eidos-ledger', desc: 'Event store · 3.2M events/day' },
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
  ),
};

// ── HeaderWithAction ──────────────────────────────────────────────────────────

/** Title + description on the leading side, inline action on the trailing side. */
export const HeaderWithAction: Story = {
  render: () => (
    <Card style={{ width: '100%', maxWidth: 520 }}>
      <CardHeader row>
        <div>
          <CardTitle>Recent deploys</CardTitle>
          <CardDescription>Last 30 days · eidos-api</CardDescription>
        </div>
        <button className="btn xs">View all</button>
      </CardHeader>
      <CardContent style={{ paddingTop: 4 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
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
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)' }}>{row.d}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  ),
};

// ── ElevatedVariant ───────────────────────────────────────────────────────────

/** Elevated variant — shadowlifted card, no visible border, for use on flat canvas. */
export const ElevatedVariant: Story = {
  args: { variant: 'elevated' },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Incident #4821</CardTitle>
        <CardDescription>eidos-api · SEV-2 · Resolved</CardDescription>
      </CardHeader>
      <CardContent>Latency spike on EU-West-1 node. Rollback deployed in 4 min.</CardContent>
      <CardFooter actions>
        <button className="btn ghost">Archive</button>
        <button className="btn outline">View runbook</button>
      </CardFooter>
    </Card>
  ),
};

// ── GhostVariant ──────────────────────────────────────────────────────────────

/** Ghost variant — no background, no border. Ideal inside an already-bounded region. */
export const GhostVariant: Story = {
  args: { variant: 'ghost' },
  render: (args) => (
    <div
      className="surface"
      style={{ padding: 20, borderRadius: 10, maxWidth: 420 }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)',
          margin: '0 0 12px',
        }}
      >
        Group
      </p>
      <Card {...args}>
        <CardHeader>
          <CardTitle>eidos-api</CardTitle>
          <CardDescription>No extra elevation inside the group surface.</CardDescription>
        </CardHeader>
        <CardContent>99.94% uptime · p50 12ms</CardContent>
      </Card>
    </div>
  ),
};

// ── InContext ─────────────────────────────────────────────────────────────────

/** A realistic dashboard tile — stat grid + header action + footer metadata. */
export const InContext: Story = {
  render: () => {
    const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
        {/* Stat row */}
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
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--fg-faint)',
                    margin: 0,
                  }}
                >
                  {s.l}
                </p>
                <CardTitle
                  style={{
                    fontSize: 'var(--text-2xl)',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                    marginTop: 4,
                  }}
                >
                  {s.v}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Deploy history */}
        <Card>
          <CardHeader row>
            <div>
              <CardTitle>Recent deploys</CardTitle>
              <CardDescription>eidos-api · last 30 days</CardDescription>
            </div>
            <button
              className="btn xs outline"
              onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              aria-label={`Sort ${sortDir === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortDir === 'asc' ? 'Oldest first' : 'Newest first'}
            </button>
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
                { v: 'v2.14.0', d: 'Sept 12', status: 'ok' },
                { v: 'v2.13.4', d: 'Sept 9', status: 'ok' },
                { v: 'v2.13.3', d: 'Sept 6', status: 'ok' },
              ]
                .sort((a, b) => (sortDir === 'asc' ? 1 : -1) * a.d.localeCompare(b.d))
                .map((row, i, arr) => (
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
          <CardFooter>
            <span
              style={{ fontSize: 'var(--text-base)', color: 'var(--fg-faint)' }}
            >
              Showing 3 of 12
            </span>
            <button className="btn link" style={{ padding: '0 4px' }}>
              View all
            </button>
          </CardFooter>
        </Card>
      </div>
    );
  },
};

// ── RTL ───────────────────────────────────────────────────────────────────────

/** dir="rtl" — logical padding and flex layout flip without any overrides. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ maxWidth: 520 }}>
      <Card>
        <CardHeader row>
          <div>
            <CardTitle>عمليات النشر الأخيرة</CardTitle>
            <CardDescription>آخر ٣٠ يومًا · eidos-api</CardDescription>
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
    </div>
  ),
};
