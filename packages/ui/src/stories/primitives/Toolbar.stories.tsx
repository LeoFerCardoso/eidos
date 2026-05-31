import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from '@eidos/ui';
import { Icons } from '@eidos/ui';

const meta = {
  title: 'Primitives/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single-tab-stop row of controls — buttons, toggle buttons, groups, and separators. ' +
          'Implements the WAI-ARIA Toolbar Pattern with roving tabindex: ' +
          'ArrowLeft/Right (or Up/Down when vertical) navigate between controls; ' +
          'Home/End jump to ends; Tab leaves the bar entirely.',
      },
    },
  },
  args: {
    orientation: 'horizontal',
    loop: true,
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    loop: { control: 'boolean' },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default formatting toolbar — bold, italic, separator, link. */
export const Default: Story = {
  render: (args) => (
    <Toolbar {...args} aria-label="Text formatting">
      <ToolbarButton aria-label="Bold">
        <Icons.bold size={14} />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <Icons.italic size={14} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link">
        <Icons.link size={14} />
      </ToolbarButton>
    </Toolbar>
  ),
};

/** Toggle buttons — aria-pressed reflects selection state. */
export const ToggleButtons: Story = {
  render: function ToggleDemo(args) {
    const [bold, setBold] = React.useState(false);
    const [italic, setItalic] = React.useState(false);
    const [underline, setUnderline] = React.useState(false);

    return (
      <Toolbar {...args} aria-label="Text style">
        <ToolbarButton
          aria-label="Bold"
          pressed={bold}
          onPressedChange={setBold}
        >
          <Icons.bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Italic"
          pressed={italic}
          onPressedChange={setItalic}
        >
          <Icons.italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Underline"
          pressed={underline}
          onPressedChange={setUnderline}
        >
          <Icons.underline size={14} />
        </ToolbarButton>
      </Toolbar>
    );
  },
};

/** ToolbarGroup visually clusters related controls with shared borders. */
export const WithGroups: Story = {
  render: (args) => (
    <Toolbar {...args} aria-label="Text formatting and alignment">
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold"><Icons.bold size={14} /></ToolbarButton>
        <ToolbarButton aria-label="Italic"><Icons.italic size={14} /></ToolbarButton>
        <ToolbarButton aria-label="Underline"><Icons.underline size={14} /></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton aria-label="Align left"><Icons.alignLeft size={14} /></ToolbarButton>
        <ToolbarButton aria-label="Align center"><Icons.alignCenter size={14} /></ToolbarButton>
        <ToolbarButton aria-label="Align right"><Icons.alignRight size={14} /></ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  ),
};

/** Workspace-level toolbar — actions left, primary CTA right. */
export const InContext: Story = {
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <Toolbar
        {...args}
        aria-label="Table controls"
        style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ToolbarGroup>
            <ToolbarButton aria-label="Undo"><Icons.undo size={14} /></ToolbarButton>
            <ToolbarButton aria-label="Redo"><Icons.redo size={14} /></ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <button className="btn outline sm" tabIndex={-1}>
            <Icons.filter size={12} /> Filter
          </button>
          <button className="btn outline sm" tabIndex={-1}>
            <Icons.sort size={12} /> Sort
          </button>
        </div>
        <button className="btn ember sm" tabIndex={-1}>
          <Icons.plus size={12} /> New record
        </button>
      </Toolbar>
    </div>
  ),
};

/** Disabled controls are skipped by roving focus and show visual muted state. */
export const WithDisabled: Story = {
  render: (args) => (
    <Toolbar {...args} aria-label="Editor actions">
      <ToolbarButton aria-label="Bold"><Icons.bold size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Italic" disabled><Icons.italic size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Underline"><Icons.underline size={14} /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link" disabled><Icons.link size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Insert image"><Icons.image size={14} /></ToolbarButton>
    </Toolbar>
  ),
};

/** Vertical orientation — ArrowDown/Up navigate; the bar stacks controls. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <Toolbar
      {...args}
      aria-label="Canvas tools"
      style={{ flexDirection: 'column', width: 'fit-content', height: 'auto', display: 'inline-flex' }}
    >
      <ToolbarButton aria-label="Edit"><Icons.edit size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Search"><Icons.search size={14} /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Zoom in"><Icons.plus size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Zoom out"><Icons.minus size={14} /></ToolbarButton>
    </Toolbar>
  ),
};

/** RTL — clusters reverse order; arrow keys swap direction. */
export const RTL: Story = {
  render: function RtlDemo(args) {
    const [bold, setBold] = React.useState(false);
    const [italic, setItalic] = React.useState(false);

    return (
      <div dir="rtl">
        <Toolbar {...args} aria-label="تنسيق النص">
          <ToolbarButton
            aria-label="عريض"
            pressed={bold}
            onPressedChange={setBold}
          >
            <Icons.bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            aria-label="مائل"
            pressed={italic}
            onPressedChange={setItalic}
          >
            <Icons.italic size={14} />
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton aria-label="رابط">
            <Icons.link size={14} />
          </ToolbarButton>
          <ToolbarButton aria-label="قائمة">
            <Icons.list size={14} />
          </ToolbarButton>
        </Toolbar>
      </div>
    );
  },
};
