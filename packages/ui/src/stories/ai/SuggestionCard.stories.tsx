import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuggestionCard, Icons } from '@eidos/ui';

const meta = {
  title: 'AI/SuggestionCard',
  component: SuggestionCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'High-emphasis starter-prompt tile for empty-state grids. ' +
          'Each card shows a small ember-soft icon, a headline question, and a supporting line.',
      },
    },
  },
  args: {
    icon: <Icons.sparkle size={14} />,
    title: 'What’s the top risk this week?',
    line: 'Scan T1 services, open incidents, and high-risk PRs.',
  },
  argTypes: {
    title: { control: 'text' },
    line: { control: 'text' },
  },
} satisfies Meta<typeof SuggestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single starter-prompt card — click to select. */
export const Default: Story = {
  render: (args) => {
    function Demo() {
      const [selected, setSelected] = React.useState<string | null>(null);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <SuggestionCard
            icon={args.icon || <Icons.sparkle size={14} />}
            title={args.title || 'What’s the top risk this week?'}
            line={args.line || 'Scan T1 services, open incidents, and high-risk PRs.'}
            onClick={() => setSelected(args.title || 'What’s the top risk this week?')}
          />
          {selected && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ember)' }}>
              selected: {selected}
            </span>
          )}
        </div>
      );
    }
    return <Demo />;
  },
};

/** Without the supporting line — title only. */
export const TitleOnly: Story = {
  args: { line: undefined, title: 'Summarise last night’s deploys' },
};

const SUGGESTIONS = [
  { icon: <Icons.sparkle size={14} />, title: 'What’s broken right now?', line: 'Surface failing services and open incidents.' },
  { icon: <Icons.shield size={14} />, title: 'Security posture', line: 'Summarise SAST findings across T1 services.' },
  { icon: <Icons.rocket size={14} />, title: 'Ready to ship?', line: 'Check deploy readiness for the release train.' },
];

/** The canonical empty-state grid: a row of starter prompts. */
export const Grid: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))', gap: 12, maxWidth: 720 }}>
      {SUGGESTIONS.map((s) => (
        <SuggestionCard key={s.title} icon={s.icon} title={s.title} line={s.line} onClick={() => {}} />
      ))}
    </div>
  ),
};
