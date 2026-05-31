import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@eidos/ui';

const meta = {
  title: 'Primitives/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Single disclosure — one trigger and one animated region. ' +
          'The atom beneath Accordion. Reach for Collapsible when only one optional ' +
          'block is involved; use Accordion for 2+ peer regions. ' +
          'Height animates via `grid-template-rows: 0fr → 1fr` with no DOM measuring. ' +
          'The trigger is `<button aria-expanded aria-controls>`; the region is ' +
          '`role="region" aria-labelledby`. Both IDs are wired via shared context.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ───────────────────────────────────────────────────────────────────

/** Uncontrolled — starts closed. Toggle to see the region slide open. */
export const Default: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Collapsible>
        <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
        <CollapsibleContent>
          Force a custom region, set a TTL, or attach a side-car. Most teams
          never need these — open only when you do.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

// ── Default open ─────────────────────────────────────────────────────────────

/** Pre-opened via `defaultOpen`. Useful for settings panels open by default. */
export const DefaultOpen: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Raw payload</CollapsibleTrigger>
        <CollapsibleContent>
          <pre
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--fg)',
              lineHeight: 1.6,
            }}
          >
            {`{\n  "id": "svc_8f3",\n  "region": "us-east-1",\n  "replicas": 3\n}`}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

// ── Controlled ────────────────────────────────────────────────────────────────

/** Controlled — `open` + `onOpenChange` let you drive the state externally. */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn sm outline"
            onClick={() => setOpen(true)}
          >
            Open
          </button>
          <button
            className="btn sm outline"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger>Controlled region</CollapsibleTrigger>
          <CollapsibleContent>
            This panel is driven by external state — the buttons above bypass
            the trigger but both paths still call <code>onOpenChange</code>.
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};

// ── Disabled ─────────────────────────────────────────────────────────────────

/** Disabled — the trigger is non-interactive and visually dimmed. */
export const Disabled: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Collapsible disabled>
        <CollapsibleTrigger>Locked region</CollapsibleTrigger>
        <CollapsibleContent>
          This content is never reached when disabled.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

// ── Multiple stacked ──────────────────────────────────────────────────────────

/** Multiple Collapsibles — each is independent (no single-open constraint). */
export const Stacked: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 400 }}>
      <Collapsible>
        <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
        <CollapsibleContent>
          Force a custom region, set a TTL, or attach a side-car.
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Raw payload</CollapsibleTrigger>
        <CollapsibleContent>
          <pre
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--fg)',
            }}
          >
            {`{ "region": "us-east-1", "replicas": 3 }`}
          </pre>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Debug logs</CollapsibleTrigger>
        <CollapsibleContent>
          No errors in the last 24 hours.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

// ── In context ───────────────────────────────────────────────────────────────

/** In context — a service detail card with a hidden advanced section. */
export const InContext: Story = {
  render: () => (
    <div
      className="surface"
      style={{ padding: 20, borderRadius: 'var(--radius-xl)', width: 400 }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 'var(--text-body)',
          color: 'var(--fg)',
          marginBottom: 4,
        }}
      >
        api-gateway · us-east-1
      </div>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--fg-muted)',
          marginBottom: 16,
        }}
      >
        3 replicas · healthy
      </div>

      <Collapsible>
        <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
        <CollapsibleContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              paddingTop: 4,
            }}
          >
            <label
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--text-sm)',
                color: 'var(--fg-muted)',
              }}
            >
              <span>TTL override</span>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--fg)',
                }}
              >
                3600s
              </code>
            </label>
            <label
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--text-sm)',
                color: 'var(--fg-muted)',
              }}
            >
              <span>Side-car enabled</span>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--fg)',
                }}
              >
                true
              </code>
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

// ── RTL ───────────────────────────────────────────────────────────────────────

/**
 * RTL — the trigger uses `justify-content: space-between` + `text-align: start`,
 * so in a right-to-left context the label right-aligns and the disclosure chevron
 * rides the trailing (left) edge automatically. No override needed.
 */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ width: 400 }}>
      <Collapsible defaultOpen>
        <CollapsibleTrigger>خيارات متقدمة</CollapsibleTrigger>
        <CollapsibleContent>
          افرض منطقة مخصصة، أو اضبط مدة البقاء، أو أرفق حاوية جانبية.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
