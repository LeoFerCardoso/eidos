import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { ButtonGroup } from '@forge/ui';

// NOTE: The stories render raw .btn / .btn-group CSS classes directly — in a
// real app you would use the full <Button> component. The ButtonGroup component
// itself manages orientation, size modifier, and role="group"; child buttons
// are plain HTML buttons styled with the Forge .btn classes here for clarity.

const meta = {
  title: 'Primitives/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Visually-joined cluster of action buttons. Collapses inner seam borders, ' +
          'rounds only the outer corners. Grouping only — for toggle/selection use ToggleGroup.',
      },
    },
  },
  args: {
    orientation: 'horizontal',
    size: 'md',
    'aria-label': 'Time range',
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default outline group — the most common usage. */
export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <button className="btn outline">Day</button>
      <button className="btn outline" aria-pressed="true" style={{ background: 'var(--surface-hover)' }}>
        Week
      </button>
      <button className="btn outline">Month</button>
      <button className="btn outline">Year</button>
    </ButtonGroup>
  ),
};

/** Three available sizes — sm for dense toolbars, lg for primary surfaces. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ButtonGroup key={size} size={size} aria-label={`${size} group`}>
          <button className={`btn outline ${size !== 'md' ? size : ''}`}>Left</button>
          <button className={`btn outline ${size !== 'md' ? size : ''}`}>Middle</button>
          <button className={`btn outline ${size !== 'md' ? size : ''}`}>Right</button>
        </ButtonGroup>
      ))}
    </div>
  ),
};

/** Vertical orientation — segments stack top-to-bottom. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <ButtonGroup {...args} aria-label="Text alignment">
      <button className="btn outline">Top</button>
      <button className="btn outline" aria-pressed="true" style={{ background: 'var(--surface-hover)' }}>
        Middle
      </button>
      <button className="btn outline">Bottom</button>
    </ButtonGroup>
  ),
};

/** Icon-only segments — each cell must carry an aria-label. */
export const IconOnly: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Text alignment">
      <button className="btn icon outline" aria-label="Align left">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
        </svg>
      </button>
      <button className="btn icon outline" aria-label="Align center" aria-pressed="true" style={{ background: 'var(--surface-hover)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
        </svg>
      </button>
      <button className="btn icon outline" aria-label="Align right">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </ButtonGroup>
  ),
};

/** Split action — primary CTA + overflow chevron share the ember fill. */
export const SplitAction: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Deploy options">
      <button className="btn ember">Deploy</button>
      <button className="btn ember icon" aria-label="More deploy options">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </ButtonGroup>
  ),
};

/** RTL — border-inline and border-radius logical props mirror automatically. */
export const RTL: Story = {
  render: (args) => (
    <div dir="rtl" style={{ display: 'flex', gap: 20, flexDirection: 'column', alignItems: 'flex-start' }}>
      <ButtonGroup {...args} aria-label="نطاق زمني">
        <button className="btn outline">يوم</button>
        <button className="btn outline" aria-pressed="true" style={{ background: 'var(--surface-hover)' }}>
          أسبوع
        </button>
        <button className="btn outline">شهر</button>
      </ButtonGroup>
      <ButtonGroup {...args} orientation="vertical" aria-label="محاذاة">
        <button className="btn outline">أعلى</button>
        <button className="btn outline">وسط</button>
        <button className="btn outline">أسفل</button>
      </ButtonGroup>
    </div>
  ),
};

/** A stateful demo — click a segment to mark it active. */
export const StatefulDemo: Story = {
  render: (args) => {
    const [active, setActive] = React.useState<'day' | 'week' | 'month'>('week');
    const options = [
      { key: 'day', label: 'Day' },
      { key: 'week', label: 'Week' },
      { key: 'month', label: 'Month' },
    ] as const;
    return (
      <ButtonGroup {...args} aria-label="Time range">
        {options.map(({ key, label }) => (
          <button
            key={key}
            className="btn outline"
            aria-pressed={active === key}
            style={active === key ? { background: 'var(--surface-hover)' } : undefined}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </ButtonGroup>
    );
  },
};

/** In context — a compact file toolbar with mixed groups and separators. */
export const InContext: Story = {
  render: () => (
    <div className="toolbar" role="toolbar" aria-label="Editor toolbar">
      <ButtonGroup aria-label="Text style">
        <button className="btn icon ghost sm" aria-label="Bold" aria-pressed="true" style={{ background: 'var(--surface-hover)', fontWeight: 700 }}>B</button>
        <button className="btn icon ghost sm" aria-label="Italic" style={{ fontStyle: 'italic' }}>I</button>
        <button className="btn icon ghost sm" aria-label="Underline" style={{ textDecoration: 'underline' }}>U</button>
      </ButtonGroup>
      <span className="toolbar-sep" role="separator" aria-orientation="vertical" />
      <ButtonGroup aria-label="Text alignment">
        <button className="btn icon ghost sm" aria-label="Align left" aria-pressed="true" style={{ background: 'var(--surface-hover)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
          </svg>
        </button>
        <button className="btn icon ghost sm" aria-label="Align center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </button>
        <button className="btn icon ghost sm" aria-label="Align right">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </ButtonGroup>
      <span className="toolbar-sep" role="separator" aria-orientation="vertical" />
      <ButtonGroup aria-label="Deploy">
        <button className="btn ember sm">Deploy</button>
        <button className="btn ember sm icon" aria-label="More deploy options">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </ButtonGroup>
    </div>
  ),
};
