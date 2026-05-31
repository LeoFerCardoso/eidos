import type { Meta, StoryObj } from '@storybook/react-vite';
import { SubHead } from '@forge/ui';

const meta = {
  title: 'Docs/SubHead',
  component: SubHead,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A semantic `<h2>` section heading that forms the page outline (TOC + screen readers). ' +
          'String children automatically get a slug `id` and a hover anchor `#` for deep-linking. ' +
          'An optional `meta` badge (e.g. "a11y", "rtl") appears to the right of the label.',
      },
    },
  },
  args: { children: 'Usage', meta: undefined },
  argTypes: {
    children: { control: 'text', description: 'Section title (string recommended for auto-slug + anchor).' },
    meta: { control: 'text', description: 'Optional badge label shown to the right — e.g. "a11y" or "rtl".' },
  },
} satisfies Meta<typeof SubHead>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Plain section heading with a hover anchor. */
export const Default: Story = {};

/** With a meta badge — used for Accessibility and RTL sections. */
export const WithMeta: Story = {
  args: { children: 'Accessibility', meta: 'a11y' },
};

/** RTL meta badge variant. */
export const RtlBadge: Story = {
  args: { children: 'Right-to-left', meta: 'rtl' },
};

/** Multiple headings showing the page outline structure. */
export const PageOutline: Story = {
  render: () => (
    <div>
      <SubHead>Installation</SubHead>
      <SubHead>Usage</SubHead>
      <SubHead>Variants</SubHead>
      <SubHead>States</SubHead>
      <SubHead meta="a11y">Accessibility</SubHead>
      <SubHead meta="rtl">Right-to-left</SubHead>
      <SubHead>Anatomy</SubHead>
      <SubHead>{'Do / Don\'t'}</SubHead>
      <SubHead>API reference</SubHead>
    </div>
  ),
};
