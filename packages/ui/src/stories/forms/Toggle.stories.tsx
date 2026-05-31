import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Toggle } from '@eidos/ui';
import { Icons } from '@eidos/ui';

const meta = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A two-state pressed button (`aria-pressed`). Use for commands that can be active or inactive — ' +
          'Bold, Pin, Mute. NOT a Switch (`aria-checked`/`role=switch`): a Toggle is stateless-form-wise; ' +
          'it applies an action immediately and can be undone by pressing again.',
      },
    },
  },
  args: {
    variant: 'ghost',
    size: 'md',
    disabled: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'outline', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled by Storybook args. */
export const Default: Story = {
  render: (args) => {
    const [pressed, setPressed] = React.useState(false);
    return (
      <Toggle {...args} pressed={pressed} onPressedChange={setPressed} aria-label="Bold">
        <Icons.bold size={14} />
      </Toggle>
    );
  },
};

/** All three variants in rest and pressed states. */
export const Variants: Story = {
  render: () => {
    const [ghostRest, setGhostRest] = React.useState(false);
    const [ghostPressed, setGhostPressed] = React.useState(true);
    const [outlineRest, setOutlineRest] = React.useState(false);
    const [outlinePressed, setOutlinePressed] = React.useState(true);
    const [solidRest, setSolidRest] = React.useState(false);
    const [solidPressed, setSolidPressed] = React.useState(true);
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Toggle variant="ghost" pressed={ghostRest} onPressedChange={setGhostRest} aria-label="Bold ghost rest">
          <Icons.bold size={14} />
        </Toggle>
        <Toggle variant="ghost" pressed={ghostPressed} onPressedChange={setGhostPressed} aria-label="Bold ghost pressed">
          <Icons.bold size={14} />
        </Toggle>
        <span style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} aria-hidden="true" />
        <Toggle variant="outline" pressed={outlineRest} onPressedChange={setOutlineRest} aria-label="Pin outline rest">
          <Icons.pin size={14} />
        </Toggle>
        <Toggle variant="outline" pressed={outlinePressed} onPressedChange={setOutlinePressed} aria-label="Pin outline pressed">
          <Icons.pin size={14} />
        </Toggle>
        <span style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} aria-hidden="true" />
        <Toggle variant="solid" pressed={solidRest} onPressedChange={setSolidRest} aria-label="Bell solid rest">
          <Icons.bell size={14} />
        </Toggle>
        <Toggle variant="solid" pressed={solidPressed} onPressedChange={setSolidPressed} aria-label="Bell solid pressed">
          <Icons.bell size={14} />
        </Toggle>
      </div>
    );
  },
};

/** Three sizes — sm · md · lg. */
export const Sizes: Story = {
  render: () => {
    const [sm, setSm] = React.useState(false);
    const [md, setMd] = React.useState(false);
    const [lg, setLg] = React.useState(false);
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Toggle size="sm" pressed={sm} onPressedChange={setSm} aria-label="Bold small">
          <Icons.bold size={12} />
        </Toggle>
        <Toggle pressed={md} onPressedChange={setMd} aria-label="Bold medium">
          <Icons.bold size={14} />
        </Toggle>
        <Toggle size="lg" pressed={lg} onPressedChange={setLg} aria-label="Bold large">
          <Icons.bold size={16} />
        </Toggle>
      </div>
    );
  },
};

/** Icon + text label — outline variant with flipping label on press.
 *  Text is wrapped in `<span>` so the SVG is no longer the only element child,
 *  preventing the square-footprint CSS rule from applying to icon+label buttons. */
export const WithLabel: Story = {
  render: () => {
    const [pinned, setPinned] = React.useState(false);
    const [fav, setFav] = React.useState(true);
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Toggle variant="outline" pressed={pinned} onPressedChange={setPinned}>
          <Icons.pin size={14} /><span>{pinned ? 'Pinned' : 'Pin'}</span>
        </Toggle>
        <Toggle variant="outline" pressed={fav} onPressedChange={setFav}>
          <Icons.star size={14} /><span>Favourite</span>
        </Toggle>
      </div>
    );
  },
};

/** Disabled — no interaction, half opacity. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Toggle variant="ghost" disabled aria-label="Bold disabled">
        <Icons.bold size={14} />
      </Toggle>
      <Toggle variant="outline" disabled aria-label="Pin disabled">
        <Icons.pin size={14} />
      </Toggle>
      <Toggle variant="solid" disabled aria-label="Bell disabled">
        <Icons.bell size={14} />
      </Toggle>
    </div>
  ),
};

/** Formatting toolbar — a realistic in-context composition. */
export const InContext: Story = {
  render: () => {
    const [bold, setBold] = React.useState(false);
    const [italic, setItalic] = React.useState(true);
    const [under, setUnder] = React.useState(false);
    const [strike, setStrike] = React.useState(false);
    const [pinned, setPinned] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            padding: 4,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}
        >
          <Toggle variant="ghost" pressed={bold} onPressedChange={setBold} aria-label="Bold">
            <Icons.bold size={14} />
          </Toggle>
          <Toggle variant="ghost" pressed={italic} onPressedChange={setItalic} aria-label="Italic">
            <Icons.italic size={14} />
          </Toggle>
          <Toggle variant="ghost" pressed={under} onPressedChange={setUnder} aria-label="Underline">
            <Icons.underline size={14} />
          </Toggle>
          <Toggle variant="ghost" pressed={strike} onPressedChange={setStrike} aria-label="Strikethrough">
            <Icons.strike size={14} />
          </Toggle>
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} aria-hidden="true" />
          <Toggle variant="outline" pressed={pinned} onPressedChange={setPinned}>
            <Icons.pin size={14} /><span>{pinned ? 'Pinned' : 'Pin'}</span>
          </Toggle>
        </div>
        <p
          style={{
            fontStyle: italic ? 'italic' : 'normal',
            fontWeight: bold ? 700 : 400,
            textDecoration: [under && 'underline', strike && 'line-through'].filter(Boolean).join(' ') || 'none',
            fontSize: 15,
            color: 'var(--fg)',
            margin: 0,
            maxWidth: 340,
            lineHeight: 1.6,
          }}
        >
          Toggle the formatting buttons above to style this sample text.
        </p>
      </div>
    );
  },
};

/** RTL — leading icon swaps to the right side automatically. */
export const RTL: Story = {
  render: () => {
    const [p1, setP1] = React.useState(true);
    const [p2, setP2] = React.useState(false);
    const [p3, setP3] = React.useState(false);
    return (
      <div dir="rtl" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Toggle variant="outline" pressed={p1} onPressedChange={setP1}>
          <Icons.pin size={14} /><span>{p1 ? 'مثبّت' : 'تثبيت'}</span>
        </Toggle>
        <Toggle variant="ghost" pressed={p2} onPressedChange={setP2} aria-label="عريض">
          <Icons.bold size={14} />
        </Toggle>
        <Toggle variant="ghost" pressed={p3} onPressedChange={setP3} aria-label="مائل">
          <Icons.italic size={14} />
        </Toggle>
      </div>
    );
  },
};
