import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Suggestion, Icons } from '@forge/ui';

const meta = {
  title: 'AI/Suggestion',
  component: Suggestion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A clickable pill for starter prompts and filters. Three sizes (sm / md / lg). ' +
          'The `pressed` state locks an ember-soft fill for already-picked selections.',
      },
    },
  },
  args: {
    children: 'Show top risk this week',
    size: 'md',
    pressed: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    pressed: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Suggestion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — click a suggestion chip to select it. The selected label is shown below. */
export const Default: Story = {
  render: (args) => {
    const CHIPS = [
      'Show top risk this week',
      'Summarise last night\'s deploys',
      'Open incidents',
    ];
    function Demo() {
      const [selected, setSelected] = React.useState('');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CHIPS.map((label) => (
              <Suggestion
                key={label}
                size={args.size}
                pressed={selected === label}
                onClick={() => setSelected(prev => prev === label ? '' : label)}
              >
                {label}
              </Suggestion>
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minHeight: 16 }}>
            {selected ? `selected: ${selected}` : 'click a chip to select'}
          </span>
        </div>
      );
    }
    return <Demo />;
  },
};

/** With a leading icon. */
export const WithIcon: Story = {
  args: {
    icon: <Icons.sparkle size={12}/>,
    children: 'Summarise the sprint',
  },
};

/** Pressed — ember-soft fill, locked state. */
export const Pressed: Story = {
  args: {
    pressed: true,
    children: 'High-risk only',
  },
};

/** All three sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Suggestion key={size} size={size} icon={<Icons.zap size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12}/>}>
          {size === 'sm' ? 'Top risk' : size === 'lg' ? 'Show me the top risk this week' : 'Top risk this week'}
        </Suggestion>
      ))}
    </div>
  ),
};

/** Interactive toggle — pressing locks the chip. */
export const Interactive: Story = {
  render: () => {
    function Demo() {
      const chips = ['T1 only', 'High risk', 'In-flight deploys', 'Open incidents'] as const;
      const [active, setActive] = React.useState<Set<string>>(new Set());
      const toggle = (label: string) =>
        setActive(prev => {
          const next = new Set(prev);
          next.has(label) ? next.delete(label) : next.add(label);
          return next;
        });
      return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {chips.map(c => (
            <Suggestion key={c} pressed={active.has(c)} onClick={() => toggle(c)}>
              {c}
            </Suggestion>
          ))}
        </div>
      );
    }
    return <Demo/>;
  },
};

/** A row of starter-prompt chips typical for an empty-state thread. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Suggestion icon={<Icons.sparkle size={12}/>}>Summarise the sprint</Suggestion>
      <Suggestion icon={<Icons.zap size={12}/>}>Top risk this week</Suggestion>
      <Suggestion icon={<Icons.search size={12}/>}>Find ADR violations</Suggestion>
      <Suggestion icon={<Icons.cpu size={12}/>}>Show T1 service health</Suggestion>
    </div>
  ),
};

/** Unified SuggestionList — a set of suggestion chips rendered together in a
 *  flex-wrap row. Clicking any chip registers a selection. This is the
 *  canonical empty-state starter-prompt pattern. */
export const SuggestionList: Story = {
  name: 'SuggestionList — unified set',
  render: () => {
    const PROMPTS = [
      { icon: <Icons.sparkle size={12}/>, label: 'Summarise the sprint' },
      { icon: <Icons.zap size={12}/>,     label: 'Top risk this week' },
      { icon: <Icons.search size={12}/>,  label: 'Find ADR violations' },
      { icon: <Icons.cpu size={12}/>,     label: 'Show T1 service health' },
      { icon: <Icons.shield size={12}/>,  label: 'Security posture' },
    ];
    function SuggestionListDemo() {
      const [selected, setSelected] = React.useState<string | null>(null);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PROMPTS.map(({ icon, label }) => (
              <Suggestion
                key={label}
                icon={icon}
                pressed={selected === label}
                onClick={() => setSelected(prev => prev === label ? null : label)}
              >
                {label}
              </Suggestion>
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minHeight: 16 }}>
            {selected ? `selected: ${selected}` : 'click a chip to select'}
          </span>
        </div>
      );
    }
    return <SuggestionListDemo />;
  },
};
