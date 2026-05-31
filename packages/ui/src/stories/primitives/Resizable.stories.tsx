import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Resizable, ResizablePanel, ResizableHandle } from '@eidos/ui';

const meta = {
  title: 'Primitives/Resizable',
  component: Resizable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A drag-and-keyboard handle that lets users split two panels. ' +
          'Orientation horizontal or vertical; supports controlled + uncontrolled sizes, ' +
          'min/max constraints, and an optional collapsible first panel. ' +
          'Full keyboard model on the handle: Arrow keys nudge, Shift+Arrow for large steps, ' +
          'Home/End jump to limits, Enter toggles collapse.',
      },
    },
  },
  args: {
    orientation: 'horizontal',
    defaultSizes: [30, 70],
    minSize: 10,
    maxSize: 90,
    step: 1,
    largeStep: 10,
    collapsible: false,
    withHandle: true,
    handleLabel: 'Resize panels',
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    defaultSizes: { control: false },
    minSize: { control: { type: 'range', min: 0, max: 50, step: 1 } },
    maxSize: { control: { type: 'range', min: 50, max: 100, step: 1 } },
    step: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 } },
    largeStep: { control: { type: 'range', min: 5, max: 30, step: 5 } },
    collapsible: { control: 'boolean' },
    withHandle: { control: 'boolean' },
    handleLabel: { control: 'text' },
  },
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared panel chrome ───────────────────────────────────────────────────────

const PanelContent = ({
  title,
  items,
  muted = false,
}: {
  title: string;
  items?: string[];
  muted?: boolean;
}) => (
  <div
    style={{
      padding: 16,
      height: '100%',
      background: 'var(--surface)',
      overflow: 'auto',
    }}
  >
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--fg-faint)',
        marginBottom: 10,
      }}
    >
      {title}
    </div>
    {items
      ? items.map((item) => (
          <div
            key={item}
            style={{
              padding: '4px 6px',
              fontSize: 'var(--text-sm)',
              color: muted ? 'var(--fg-muted)' : 'var(--fg)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {item}
          </div>
        ))
      : null}
  </div>
);

// ── Default — horizontal split ─────────────────────────────────────────────────

/** Default horizontal split — drag the handle or focus it and use Arrow keys. */
export const Default: Story = {
  render: (args) => (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        height: 260,
      }}
    >
      <Resizable {...args} style={{ height: '100%' }}>
        {[
          <PanelContent
            key="a"
            title="Files"
            items={['index.tsx', 'config.json', 'README.md', 'styles.css']}
            muted
          />,
          <PanelContent
            key="b"
            title="Editor"
            items={['// Edit panel content renders here']}
          />,
        ]}
      </Resizable>
    </div>
  ),
};

// ── Vertical split ─────────────────────────────────────────────────────────────

/** Vertical orientation — top/bottom split with a horizontal drag line. */
export const Vertical: Story = {
  args: { orientation: 'vertical', defaultSizes: [60, 40] },
  render: (args) => (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        height: 360,
      }}
    >
      <Resizable {...args} style={{ height: '100%' }}>
        {[
          <PanelContent
            key="top"
            title="Editor"
            items={['function deploy() {', "  return forge.push('us-east-1');", '}']}
          />,
          <PanelContent
            key="bottom"
            title="Preview"
            items={['Output renders here']}
            muted
          />,
        ]}
      </Resizable>
    </div>
  ),
};

// ── Collapsible ────────────────────────────────────────────────────────────────

/** Collapsible first panel — drag below minSize or press Enter on the handle to collapse. */
export const Collapsible: Story = {
  args: {
    orientation: 'horizontal',
    defaultSizes: [30, 70],
    collapsible: true,
    collapsedSize: 0,
  },
  render: (args) => {
    const [label, setLabel] = React.useState('drag · 30% · collapse on Enter');
    return (
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          height: 260,
        }}
      >
        <Resizable
          {...args}
          style={{ height: '100%' }}
          onSizesChange={([a]) => setLabel(`first panel: ${Math.round(a)}%`)}
        >
          {[
            <PanelContent
              key="a"
              title="Sidebar"
              items={['item-1', 'item-2', 'item-3']}
              muted
            />,
            <PanelContent key="b" title="Content" />,
          ]}
        </Resizable>
        <div
          style={{
            marginTop: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-faint)',
          }}
        >
          {label}
        </div>
      </div>
    );
  },
};

// ── Controlled ─────────────────────────────────────────────────────────────────

/** Controlled mode — parent owns the sizes and can snap or constrain them. */
export const Controlled: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => {
    const [sizes, setSizes] = React.useState<[number, number]>([40, 60]);
    const presets: [number, number][] = [
      [20, 80],
      [50, 50],
      [70, 30],
    ];
    return (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {presets.map(([a, b]) => (
            <button
              key={`${a}-${b}`}
              className="btn outline sm"
              onClick={() => setSizes([a, b])}
            >
              {a}/{b}
            </button>
          ))}
        </div>
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            height: 240,
          }}
        >
          <Resizable {...args} sizes={sizes} onSizesChange={setSizes} style={{ height: '100%' }}>
            {[
              <PanelContent key="a" title={`Panel A — ${Math.round(sizes[0])}%`} muted />,
              <PanelContent key="b" title={`Panel B — ${Math.round(sizes[1])}%`} />,
            ]}
          </Resizable>
        </div>
      </div>
    );
  },
};

// ── No grip pill ───────────────────────────────────────────────────────────────

/**
 * Handle without the grip pill — for tight UIs where the seam is
 * implied by the layout.
 */
export const NoGrip: Story = {
  args: { withHandle: false },
  render: (args) => (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        height: 200,
      }}
    >
      <Resizable {...args} style={{ height: '100%' }}>
        {[
          <PanelContent key="a" title="Left" muted />,
          <PanelContent key="b" title="Right" />,
        ]}
      </Resizable>
    </div>
  ),
};

// ── RTL ────────────────────────────────────────────────────────────────────────

/** RTL — the group is a flex row so the first panel sits on the right; the handle
 * is drag-direction-aware (drag left to grow the right-hand pane). */
export const RTL: Story = {
  render: (args) => (
    <div dir="rtl">
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          height: 260,
        }}
      >
        <Resizable {...args} style={{ height: '100%' }}>
          {[
            <PanelContent
              key="a"
              title="الملفات"
              items={['index.tsx', 'styles.css']}
              muted
            />,
            <PanelContent key="b" title="المحرر" />,
          ]}
        </Resizable>
      </div>
    </div>
  ),
};

// ── In context ─────────────────────────────────────────────────────────────────

/** In context — a three-column IDE layout with two nested splits. */
export const InContext: Story = {
  render: () => (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        height: 320,
      }}
    >
      {/* Outer horizontal split: sidebar vs main area */}
      <Resizable orientation="horizontal" defaultSizes={[22, 78]} style={{ height: '100%' }}>
        {[
          <PanelContent
            key="sidebar"
            title="Explorer"
            items={['src/', '├ app/', '│ └ page.tsx', 'public/', 'package.json']}
            muted
          />,
          // Inner vertical split: editor vs terminal
          <div key="main" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Resizable orientation="vertical" defaultSizes={[68, 32]} style={{ height: '100%' }}>
              {[
                <PanelContent
                  key="editor"
                  title="Editor"
                  items={[
                    'export default function Page() {',
                    '  return <h1>Hello Forge</h1>',
                    '}',
                  ]}
                />,
                <PanelContent
                  key="terminal"
                  title="Terminal"
                  items={['$ pnpm dev', '> ready on http://localhost:3000']}
                  muted
                />,
              ]}
            </Resizable>
          </div>,
        ]}
      </Resizable>
    </div>
  ),
};
