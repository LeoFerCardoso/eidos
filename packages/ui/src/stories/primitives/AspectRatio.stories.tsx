import type { Meta, StoryObj } from '@storybook/react-vite';
import { AspectRatio } from '@forge/ui';

const meta = {
  title: 'Primitives/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A zero-dependency layout wrapper that locks children to a fixed width/height ratio. ' +
          'Uses the CSS `aspect-ratio` property (supported since 2021). Eliminates CLS by ' +
          'reserving space before the asset arrives. Adds no ARIA role or focus stop — ' +
          'interactive children behave normally.',
      },
    },
  },
  args: {
    ratio: '16/9',
    radius: 'var(--radius-md)',
  },
  argTypes: {
    ratio: {
      control: 'select',
      options: ['16/9', '4/3', '3/2', '1/1', '3/4', '9/16', '21/9'],
      description: 'Numeric ratio or named preset (width ÷ height).',
    },
    radius: { control: 'text', description: 'Border-radius CSS value.' },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────────────

/** Default — 16:9, driven by the controls panel. */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <AspectRatio {...args}>
        <div className="ar-fill warm" />
        <div className="ar-label">{String(args.ratio)}</div>
      </AspectRatio>
    </div>
  ),
};

/** Seven common ratios side by side. */
export const CommonRatios: Story = {
  name: 'Common ratios',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>
      {([
        ['16/9', '',      '16 : 9 — video'],
        ['4/3',  ' warm', '4 : 3 — classic'],
        ['3/2',  ' cool', '3 : 2 — DSLR'],
        ['1/1',  ' warm', '1 : 1 — square'],
        ['3/4',  ' cool', '3 : 4 — portrait'],
        ['9/16', '',      '9 : 16 — story'],
      ] as const).map(([ratio, fillMod, label]) => (
        <AspectRatio key={ratio} ratio={ratio}>
          <div className={`ar-fill${fillMod}`} />
          <div className="ar-label">{label}</div>
        </AspectRatio>
      ))}
    </div>
  ),
};

/** Numeric ratio — pass `ratio={16 / 9}` directly. */
export const NumericRatio: Story = {
  name: 'Numeric ratio prop',
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <AspectRatio {...args}>
        <div className="ar-fill cool" />
        <div className="ar-label">ratio={'{16 / 9}'}</div>
      </AspectRatio>
    </div>
  ),
};

/** Portrait / vertical — 9:16 story format. */
export const Portrait: Story = {
  render: () => (
    <div style={{ maxWidth: 200 }}>
      <AspectRatio ratio="9/16">
        <div className="ar-fill warm" />
        <div className="ar-label">9 : 16</div>
      </AspectRatio>
    </div>
  ),
};

/** Cinematic — 21:9 banner. */
export const Cinematic: Story = {
  render: () => (
    <AspectRatio ratio="21/9" radius="var(--radius-lg)">
      <div className="ar-fill cool" />
      <div className="ar-label">21 : 9 — banner</div>
    </AspectRatio>
  ),
};

/** In context — card with a locked-ratio thumbnail. */
export const InContext: Story = {
  name: 'In context — card',
  render: () => (
    <div
      className="surface"
      style={{ padding: 0, overflow: 'hidden', maxWidth: 320 }}
    >
      <AspectRatio ratio="16/9" radius="0">
        <div className="ar-fill warm" />
        <div className="ar-label">cover.jpg</div>
      </AspectRatio>
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>The forge that ships</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>
          Architecture notes from the platform team.
        </div>
      </div>
    </div>
  ),
};

/** RTL — ratio box is direction-agnostic; the caption label lands in the trailing corner. */
export const RTL: Story = {
  name: 'RTL — direction-agnostic',
  render: () => (
    <div dir="rtl" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12 }}>
      <AspectRatio ratio="16/9">
        <div className="ar-fill warm" />
        <div className="ar-label">١٦ : ٩ — هيرو</div>
      </AspectRatio>
      <AspectRatio ratio="1/1">
        <div className="ar-fill cool" />
        <div className="ar-label">١ : ١ — أفتار</div>
      </AspectRatio>
    </div>
  ),
};
