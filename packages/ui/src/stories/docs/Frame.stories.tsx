import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame } from '@eidos/ui';

const SAMPLE_CODE = `<button className="btn btn-primary" type="button">\n  Ship it\n</button>`;

const meta = {
  title: 'Docs/Frame',
  component: Frame,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The standard DS docs canvas — a labeled frame with an optional live-preview body on top ' +
          'and a `CollapsibleCode` block below. Use `center` to center the preview, `row` for horizontal ' +
          'flex layout, and `dotted` to show a dot-grid background that makes spacing visible.',
      },
    },
  },
  args: {
    label: 'Default',
    code: SAMPLE_CODE,
    lang: 'jsx',
    center: false,
    row: false,
    dotted: false,
  },
  argTypes: {
    label: { control: 'text', description: 'Text shown in the frame header bar.' },
    lang: {
      control: 'select',
      options: ['jsx', 'tsx', 'ts', 'js', 'css', 'html', 'bash'],
      description: 'Language passed to `CollapsibleCode`.',
    },
    code: { control: 'text', description: 'Source string shown below the preview.' },
    center: { control: 'boolean', description: 'Centers the preview body horizontally and vertically.' },
    row: { control: 'boolean', description: 'Lays out preview children in a horizontal row.' },
    dotted: { control: 'boolean', description: 'Shows a dot-grid background in the preview area.' },
    height: { control: 'text', description: 'Minimum height of the preview body (CSS value or number = px).' },
  },
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single button in the default layout — label + code pane beneath. */
export const Default: Story = {
  render: (args) => (
    <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
  ),
};

/** Centered preview — the most common variant for component demos. */
export const Centered: Story = {
  args: { label: 'Centered preview', center: true },
  render: (args) => (
    <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
  ),
};

/** Row layout — shows multiple buttons side by side. */
export const RowLayout: Story = {
  args: {
    label: 'Button variants',
    row: true,
    center: true,
    code: `<button className="btn btn-primary">Primary</button>\n<button className="btn btn-ghost">Ghost</button>`,
  },
  render: (args) => (
    <Frame {...args}>
      <button className="btn btn-primary" type="button">Primary</button>
      <button className="btn btn-ghost" type="button">Ghost</button>
    </Frame>
  ),
};

/** Dotted background — makes spacing and alignment visible. */
export const DottedGrid: Story = {
  args: { label: 'Dotted grid', dotted: true, center: true },
  render: (args) => (
    <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
  ),
};

/** Fixed height — useful when the preview needs a controlled canvas. */
export const FixedHeight: Story = {
  args: {
    label: 'Fixed 240px canvas',
    center: true,
    height: 240,
    code: `<Frame height={240} center>\n  {/* your component */}\n</Frame>`,
  },
  render: (args) => (
    <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
  ),
};

/** No code prop — preview-only frame with no copy button or code pane. */
export const PreviewOnly: Story = {
  args: { label: 'Preview only', center: true, code: undefined },
  render: (args) => (
    <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
  ),
};
