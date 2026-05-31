import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromptBanner, PromptInput } from '@eidos/ui';

// PromptBanner renders as Fragment children so Storybook wraps it inside PromptInput.
// We use a thin wrapper to satisfy the component prop requirement while keeping each
// story self-contained and meaningful.

const meta = {
  title: 'AI/PromptBanner',
  component: PromptBanner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A 1-line ribbon inside the composer shell — rendered above the textarea via the `topBanner` slot. ' +
          'Five tones: promo (ember), info (neutral), warn, success, danger. ' +
          'Supports an optional CTA button and a dismiss × button.',
      },
    },
  },
  args: {
    tone: 'promo',
    cta: 'Upgrade',
    children: 'You\'re on the free tier — upgrade for unlimited context.',
  },
  argTypes: {
    tone: { control: 'select', options: ['promo', 'info', 'warn', 'success', 'danger'] },
    cta: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof PromptBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** PromptBanner rendered inside a PromptInput shell (its natural home). */
export const Default: Story = {
  render: (args) => (
    <PromptInput
      topBanner={<PromptBanner {...args}/>}
      placeholder="Ask anything…"
    />
  ),
};

/** All five tones — each inside a composer shell. */
export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['promo', 'info', 'warn', 'success', 'danger'] as const).map(tone => (
        <PromptInput
          key={tone}
          topBanner={
            <PromptBanner tone={tone}>
              {tone === 'promo'   ? 'Upgrade for unlimited context and longer history.' :
               tone === 'info'   ? '18 services loaded · context window at 42 %.' :
               tone === 'warn'   ? 'Token budget at 80 % — response may be truncated.' :
               tone === 'success'? 'Connected to Eidos workspace · 3 integrations active.' :
                                   'Rate limit reached — wait 60 s before sending.'}
            </PromptBanner>
          }
          placeholder="Ask anything…"
        />
      ))}
    </div>
  ),
};

/** Dismissible banner — × closes the ribbon. */
export const Dismissible: Story = {
  render: () => {
    function Demo() {
      const [visible, setVisible] = React.useState(true);
      return (
        <PromptInput
          topBanner={
            visible
              ? (
                <PromptBanner
                  tone="info"
                  onDismiss={() => setVisible(false)}
                >
                  Context loaded: pix-router service graph, 14-day incident window.
                </PromptBanner>
              )
              : undefined
          }
          placeholder="Ask anything…"
        />
      );
    }
    return <Demo/>;
  },
};

/** With CTA button. */
export const WithCta: Story = {
  render: () => (
    <PromptInput
      topBanner={
        <PromptBanner
          tone="promo"
          cta="Upgrade"
          onCtaClick={() => console.log('upgrade clicked')}
          onDismiss={() => {}}
        >
          You're on the free tier — upgrade for unlimited context.
        </PromptBanner>
      }
      placeholder="Ask anything…"
    />
  ),
};
