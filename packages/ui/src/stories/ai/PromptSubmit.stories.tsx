import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromptSubmit } from '@eidos/ui';

const meta = {
  title: 'AI/PromptSubmit',
  component: PromptSubmit,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Status-aware submit button for the AI prompt composer footer. ' +
          'Renders four distinct states — ready (arrow-up), submitted (spinner), ' +
          'streaming (stop square), and error (retry) — so the affordance always ' +
          'matches the current agent lifecycle phase. Drop it into any .pi-foot ' +
          'toolbar or compose it standalone in a custom input shell.',
      },
    },
  },
  args: {
    status: 'ready',
    hasText: true,
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['ready', 'submitted', 'streaming', 'error'],
    },
    hasText: { control: 'boolean' },
  },
} satisfies Meta<typeof PromptSubmit>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Ready state with text present — submit is enabled and shows the arrow-up icon. */
export const Default: Story = {
  args: {
    status: 'ready',
    hasText: true,
    onClick: () => {},
  },
};

/** Ready state with no text — submit is disabled, signalling the composer is empty. */
export const ReadyEmpty: Story = {
  args: {
    status: 'ready',
    hasText: false,
  },
};

/**
 * All four status states rendered side by side.
 * Covers the full status × hasText matrix so reviewers can compare the visual
 * variants in one glance.
 */
export const States: Story = {
  render: () => {
    const items: Array<{
      label: string;
      status: 'ready' | 'submitted' | 'streaming' | 'error';
      hasText?: boolean;
    }> = [
      { label: 'ready · no text', status: 'ready', hasText: false },
      { label: 'ready · has text', status: 'ready', hasText: true },
      { label: 'submitted', status: 'submitted' },
      { label: 'streaming', status: 'streaming' },
      { label: 'error', status: 'error' },
    ];

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
        {items.map(({ label, status, hasText }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <PromptSubmit status={status} hasText={hasText} onClick={() => {}} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--fg-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Interactive demo — click Submit to cycle through the lifecycle:
 * ready → submitted → streaming → ready. Click again while streaming to stop.
 */
export const Interactive: Story = {
  render: () => {
    const [status, setStatus] = React.useState<
      'ready' | 'submitted' | 'streaming' | 'error'
    >('ready');
    const [text, setText] = React.useState('');

    const handleClick = () => {
      if (status === 'ready' && text.trim()) {
        setStatus('submitted');
        // Simulate network round-trip before streaming begins
        setTimeout(() => setStatus('streaming'), 900);
        // Simulate stream completing
        setTimeout(() => setStatus('ready'), 2800);
      } else if (status === 'streaming') {
        setStatus('ready');
      } else if (status === 'error') {
        setStatus('ready');
      }
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 480,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '8px 12px',
            background: 'var(--surface)',
          }}
        >
          <input
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--fg)',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
            }}
            placeholder="Describe the deploy failure or paste a trace…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={status === 'submitted' || status === 'streaming'}
          />
          <PromptSubmit status={status} hasText={text.trim().length > 0} onClick={handleClick} />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--fg-muted)',
          }}
        >
          status: <strong style={{ color: 'var(--accent)' }}>{status}</strong>
          {status === 'ready' && !text.trim() && ' — type to enable submit'}
          {status === 'streaming' && ' — click stop square to abort'}
        </span>
      </div>
    );
  },
};
