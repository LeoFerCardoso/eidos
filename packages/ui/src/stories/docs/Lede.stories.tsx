import type { Meta, StoryObj } from '@storybook/react-vite';
import { Lede, SubHead, Mono } from '@eidos/ui';

const meta = {
  title: 'Docs/Lede',
  component: Lede,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The muted explainer paragraph that follows every `SubHead`. ' +
          'Rendered as `var(--text-sm)` / `var(--fg-muted)` / `line-height 1.6` / `max-width 64ch` — ' +
          'never hand-roll a font size, use this for ALL section introductions.',
      },
    },
  },
  args: {
    children: 'Buttons trigger actions — form submission, navigation, or a command. Pick the variant that reflects the weight of the action in context.',
    up: false,
    wide: false,
    narrow: false,
  },
  argTypes: {
    up: { control: 'boolean', description: 'Tightens top margin when the lede directly follows a SubHead.' },
    wide: { control: 'boolean', description: 'Removes the 64ch max-width cap.' },
    narrow: { control: 'boolean', description: 'Constrains to a narrower measure.' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Lede>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — muted caption below a section heading. */
export const Default: Story = {};

/** `up` — tightens the top margin for tight SubHead + Lede pairs. */
export const TightTop: Story = {
  args: { up: true },
  render: (args) => (
    <div>
      <SubHead>Usage</SubHead>
      <Lede up={args.up}>
        Combine <Mono>variant</Mono> and <Mono>size</Mono> props to express the visual weight
        and importance of each action in context.
      </Lede>
    </div>
  ),
};

/** Wide — no max-width cap; useful for intro sections that need full column width. */
export const Wide: Story = {
  args: {
    wide: true,
    children: 'The Forge Design System is a family of interconnected systems — core tokens, component libraries for web, mobile, and AI — all sharing a single ember accent and Geist type scale.',
  },
};

/** With inline `Mono` references — the standard pattern for API prose. */
export const WithMonoRefs: Story = {
  render: () => (
    <Lede>
      Pass <Mono>variant="primary"</Mono> for the main call to action and{' '}
      <Mono>variant="ghost"</Mono> for secondary actions in the same surface.
      Use <Mono>size="sm"</Mono> inside dense table rows or toolbars.
    </Lede>
  ),
};
