import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider, NumberInput } from '@eidos/ui';

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Pick a value or a range along a continuous track — drag the thumb, click the track, or use the keyboard (arrows, Page Up/Down, Home/End). The thumb is role="slider" with full ARIA value semantics; RTL and vertical orientation are supported.' } },
  },
  args: { defaultValue: 40, min: 0, max: 100, step: 1, label: 'Volume', size: 'md' },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 360, maxWidth: '100%' }}>{children}</div>
);

/** A small mono label / value row above a slider — mirrors the doc page's `LabelRow`. */
const LabelRow = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
    <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--fg-faint)' }}>{label}</span>
    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>{value}</span>
  </div>
);

/** Default — a single-thumb, args-driven control. Click the track or use arrow keys. */
export const Default: Story = { render: (args) => <Wrap><Slider {...args} /></Wrap> };

/** Single value with a live read-out (the doc's "basic" example). */
export const SingleValue: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = React.useState(40);
      return (
        <Wrap>
          <LabelRow label="Volume" value={v} />
          <Slider value={v} onChange={(x) => setV(x as number)} label="Volume" />
        </Wrap>
      );
    }
    return <Demo />;
  },
};

/** A two-thumb range (e.g. a budget filter). Order is preserved automatically. */
export const Range: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = React.useState<[number, number]>([1500, 4500]);
      return (
        <Wrap>
          <LabelRow label="Budget" value={`$${v[0].toLocaleString()} – $${v[1].toLocaleString()}`} />
          <Slider value={v} min={0} max={10000} step={100} label="Budget" onChange={(x) => setV(x as [number, number])} />
        </Wrap>
      );
    }
    return <Demo />;
  },
};

/** The three sizes — sm (dense surfaces), md (default), lg (touch / media controls). */
export const Sizes: Story = {
  render: () => (
    <Wrap>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div><LabelRow label="Small" value={40} /><Slider size="sm" defaultValue={40} label="Small" /></div>
        <div><LabelRow label="Default" value={50} /><Slider defaultValue={50} label="Default" /></div>
        <div><LabelRow label="Large" value={60} /><Slider size="lg" defaultValue={60} label="Large" /></div>
      </div>
    </Wrap>
  ),
};

/** States — default, disabled (visible but unreachable), and invalid (--danger fill). */
export const States: Story = {
  render: () => (
    <Wrap>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div><LabelRow label="Default" value={50} /><Slider defaultValue={50} label="Default" /></div>
        <div><LabelRow label="Disabled" value={30} /><Slider defaultValue={30} disabled label="Disabled" /></div>
        <div>
          <LabelRow label="Invalid" value={92} />
          <Slider defaultValue={92} invalid label="Invalid" />
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)', marginTop: 8 }}>Over the limit (max 80).</div>
        </div>
      </div>
    </Wrap>
  ),
};

/** Discrete stops — `step={25}` snaps the thumb to every 25%, reading as a stepped scale. */
export const SteppedScale: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = React.useState(50);
      return (
        <Wrap>
          <LabelRow label="Quality" value={`${v}%`} />
          <Slider value={v} onChange={(x) => setV(x as number)} min={0} max={100} step={25} label="Quality" />
        </Wrap>
      );
    }
    return <Demo />;
  },
};

/** Integer stepper — `step={1}` over a small range (1–10), so the thumb lands on whole counts only. */
export const Stepper: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = React.useState(4);
      return (
        <Wrap>
          <LabelRow label="Replicas" value={v} />
          <Slider value={v} onChange={(x) => setV(x as number)} min={1} max={10} step={1} label="Replicas" />
        </Wrap>
      );
    }
    return <Demo />;
  },
};

/** Vertical orientation — for mixers, brightness panels, console UIs. Up arrow always increases. */
export const Vertical: Story = {
  render: () => {
    function Demo() {
      const [vol, setVol] = React.useState(35);
      const [bri, setBri] = React.useState(60);
      const Channel = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>{value}</span>
          <Slider orientation="vertical" value={value} onChange={(x) => onChange(x as number)} label={label} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--fg-faint)' }}>{label}</span>
        </div>
      );
      return (
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end', height: 220 }}>
          <Channel label="Volume" value={vol} onChange={setVol} />
          <Channel label="Brightness" value={bri} onChange={setBri} />
        </div>
      );
    }
    return <Demo />;
  },
};

/** Controlled with a live read-out — the `value`/`onChange` pair drives the thumb. */
export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = React.useState(40);
      return (
        <Wrap>
          <LabelRow label="Volume" value={v} />
          <Slider value={v} onChange={(x) => setV(x as number)} label="Volume" />
        </Wrap>
      );
    }
    return <Demo />;
  },
};

/** Right-to-left — the fill grows from the trailing (right) edge; drag direction is normalised, arrows stay direction-agnostic. */
export const RTL: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = React.useState(75);
      return (
        <div dir="rtl" style={{ width: 360, maxWidth: '100%' }}>
          <LabelRow label="مستوى الصوت" value={v} />
          <Slider value={v} onChange={(x) => setV(x as number)} label="Volume" />
        </div>
      );
    }
    return <Demo />;
  },
};

/** In context — a Slider paired with a NumberInput over shared state: drag updates the field, typing moves the thumb. */
export const InContext: Story = {
  render: () => {
    function Demo() {
      const [pad, setPad] = React.useState(16);
      const clamp = (n: number) => Math.max(0, Math.min(48, Number.isNaN(n) ? 0 : n));
      return (
        <Wrap>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--fg-faint)', marginBottom: 10 }}>Padding</div>
              <Slider value={pad} onChange={(x) => setPad(x as number)} min={0} max={48} step={2} label="Padding" />
            </div>
            <div style={{ width: 110 }}>
              <NumberInput
                value={pad}
                min={0}
                max={48}
                step={2}
                size="sm"
                suffix="px"
                onChange={(e) => setPad(clamp(Number(e.target.value)))}
              />
            </div>
          </div>
        </Wrap>
      );
    }
    return <Demo />;
  },
};
