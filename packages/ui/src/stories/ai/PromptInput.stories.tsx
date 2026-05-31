import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromptInput, PromptBanner, Conversation, Message } from '@eidos/ui';

const meta = {
  title: 'AI/PromptInput',
  component: PromptInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composite prompt-input shell: auto-sizing textarea, attachment header, and a footer toolbar ' +
          '(attach · model · submit). Covers all states (ready / submitted / streaming / error / disabled / invalid) ' +
          'and supports an optional top-banner ribbon, "+" actions menu, footer hint, and elevated lift.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 680, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    status: 'ready',
    disabled: false,
    invalid: false,
    placeholder: 'Ask Eidos AI anything…',
    elevated: false,
  },
  argTypes: {
    status: { control: 'select', options: ['ready', 'submitted', 'streaming', 'error'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    elevated: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof PromptInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default ready state — driven by the Controls panel (status · disabled · invalid · elevated). */
export const Default: Story = {};

/** Interactive controlled input — typing drives `value`, submit cycles submitted → streaming → ready. */
export const Interactive: Story = {
  render: () => {
    function Demo() {
      const [text, setText] = React.useState('');
      const [model, setModel] = React.useState('eidos-sonnet-4-6');
      const [status, setStatus] = React.useState<'ready' | 'submitted' | 'streaming' | 'error'>('ready');

      const handleSubmit = (value: string) => {
        setStatus('submitted');
        setTimeout(() => setStatus('streaming'), 600);
        setTimeout(() => { setStatus('ready'); setText(''); }, 2200);
        console.log('submit:', value);
      };

      return (
        <PromptInput
          status={status}
          value={text}
          onChange={setText}
          onSubmit={handleSubmit}
          onStop={() => setStatus('ready')}
          modelValue={model}
          onModelChange={setModel}
          placeholder="Ask Eidos AI anything…"
        />
      );
    }
    return <Demo/>;
  },
};

/** Typing — text present, not yet submitted; the submit arrow is enabled. */
export const Typing: Story = {
  render: () => {
    function Demo() {
      const [text, setText] = React.useState(
        "I'm seeing a p99 spike on identity-svc — anything in the last deploy?",
      );
      const [model, setModel] = React.useState('eidos-opus-4-7');
      return (
        <PromptInput
          status="ready"
          value={text}
          onChange={setText}
          onSubmit={() => setText('')}
          modelValue={model}
          onModelChange={setModel}
          rows={2}
        />
      );
    }
    return <Demo/>;
  },
};

/** Submitted — spinner shown; textarea locked while the request is in flight. */
export const Submitted: Story = {
  args: { status: 'submitted', placeholder: 'Sending…' },
};

/** Streaming — the submit arrow becomes a stop square; `onStop` cancels the response. */
export const Streaming: Story = {
  render: () => {
    function Demo() {
      const [streaming, setStreaming] = React.useState(true);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PromptInput
            status={streaming ? 'streaming' : 'ready'}
            placeholder={streaming ? 'Generating response…' : 'Ask anything…'}
            modelValue="eidos-sonnet-4-6"
            onModelChange={() => {}}
            onStop={() => setStreaming(false)}
          />
          <button type="button" className="btn xs outline" onClick={() => setStreaming(true)}>
            Simulate streaming
          </button>
        </div>
      );
    }
    return <Demo/>;
  },
};

/** Error — the submit button shows the retry glyph; tapping it re-runs the last request. */
export const ErrorState: Story = {
  name: 'Error',
  args: { status: 'error', placeholder: 'Request failed — retry?' },
};

/** Disabled — the entire composer is locked (e.g. while attachments upload). */
export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Uploading attachments…' },
};

/** Invalid — danger border + ring for form-level validation failure (does not disable). */
export const Invalid: Story = {
  args: { invalid: true, placeholder: 'Message required before sending' },
};

/** With the drop-up model picker wired in the footer. */
export const WithModelSelector: Story = {
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('eidos-sonnet-4-6');
      return (
        <PromptInput
          modelValue={model}
          onModelChange={setModel}
          placeholder="Select a model and ask anything…"
        />
      );
    }
    return <Demo/>;
  },
};

/** With file + image attachments rendered as chips in the header row. */
export const WithAttachments: Story = {
  render: () => {
    function Demo() {
      const [files, setFiles] = React.useState([
        { id: 'a1', name: 'incident-0421.log', size: '8.4 KB', kind: 'file' as const },
        { id: 'a2', name: 'flamegraph-p99.png', size: '186 KB', kind: 'image' as const, hue: 18 },
        { id: 'a3', name: 'screenshot-error.png', size: '92 KB', kind: 'image' as const, hue: 200 },
      ]);
      return (
        <PromptInput
          value="Two screenshots + the log. Walk me through it."
          attachments={files}
          onRemoveAttachment={id => setFiles(f => f.filter(x => x.id !== id))}
          modelValue="eidos-opus-4-7"
          onModelChange={() => {}}
          placeholder="What do you see in these files?"
          rows={2}
        />
      );
    }
    return <Demo/>;
  },
};

/** With a promo top-banner ribbon inside the shell — focus ring wraps banner + field together. */
export const WithTopBanner: Story = {
  render: () => {
    function Demo() {
      const [shown, setShown] = React.useState(true);
      return (
        <PromptInput
          placeholder="Ask anything…"
          topBanner={shown
            ? (
              <PromptBanner tone="promo" cta="Upgrade" onCtaClick={() => {}} onDismiss={() => setShown(false)}>
                You&rsquo;re on the free tier — upgrade for unlimited context.
              </PromptBanner>
            )
            : undefined}
        />
      );
    }
    return <Demo/>;
  },
};

/** All five banner tones — promo (ember) · info · success · warn · danger. */
export const BannerTones: Story = {
  render: () => {
    const tones: { tone: 'promo' | 'info' | 'success' | 'warn' | 'danger'; cta?: string; text: React.ReactNode }[] = [
      { tone: 'promo', cta: 'Upgrade', text: <>Access premium models &amp; features</> },
      { tone: 'info', text: <>Beta agent · responses may take longer than usual</> },
      { tone: 'success', text: <>Connected to <b>identity-svc</b> · 4 tools available</> },
      { tone: 'warn', cta: 'Switch model', text: <>Approaching the daily limit · <b>92% used</b></> },
      { tone: 'danger', cta: 'Retry', text: <>Connection lost · check your network</> },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {tones.map(t => (
          <PromptInput
            key={t.tone}
            placeholder="Ask anything…"
            topBanner={<PromptBanner tone={t.tone} cta={t.cta}>{t.text}</PromptBanner>}
          />
        ))}
      </div>
    );
  },
};

/** With a legal footer hint below the shell — small, muted, centred. */
export const WithFooterHint: Story = {
  args: {
    footerHint: 'AI can make mistakes — please double-check important decisions.',
  },
};

/** Elevated — soft DS shadow lift for floating composer surfaces. */
export const Elevated: Story = {
  args: { elevated: true, placeholder: 'Elevated composer…' },
};

/** With a "+" actions menu replacing the paperclip — icons · descriptions · divider · destructive row. */
export const WithActionsMenu: Story = {
  render: () => {
    function Demo() {
      const [text, setText] = React.useState('');
      const [picked, setPicked] = React.useState<string | null>(null);
      return (
        <PromptInput
          value={text}
          onChange={setText}
          placeholder="Type a message, or use + to add context…"
          modelValue="eidos-sonnet-4-6"
          onModelChange={() => {}}
          actions={[
            { id: 'upload', label: 'Upload images or files', description: 'PNG, JPG, PDF, logs — up to 20 MB', icon: 'upload' },
            { id: 'image', label: 'Generate image', description: 'Describe a picture and the agent draws it', icon: 'sparkle' },
            { id: 'search', label: 'Deep search', description: 'Browse trusted sources for a longer answer', icon: 'search' },
            { id: 'div', label: '', divider: true },
            { id: 'clear', label: 'Clear conversation', description: 'Removes every message from this thread', destructive: true, icon: 'trash' },
          ]}
          onActionSelect={setPicked}
          footerHint={picked ? `picked: ${picked}` : undefined}
        />
      );
    }
    return <Demo/>;
  },
};

/** Enhanced — the flagship demo: top banner + "+" actions + footer hint + elevated, all at once. */
export const Enhanced: Story = {
  render: () => {
    function Demo() {
      const [text, setText] = React.useState('');
      const [model, setModel] = React.useState('eidos-sonnet-4-6');
      const [picked, setPicked] = React.useState<string | null>(null);
      return (
        <PromptInput
          status="ready"
          value={text}
          onChange={setText}
          onSubmit={() => setText('')}
          modelValue={model}
          onModelChange={setModel}
          elevated
          topBanner={
            <PromptBanner tone="promo" cta="Upgrade">
              Access premium models &amp; features
            </PromptBanner>
          }
          actions={[
            { id: 'upload', label: 'Upload images or files', description: 'PNG, JPG, PDF, log files — up to 20 MB', icon: 'upload' },
            { id: 'image', label: 'Generate image', description: 'Describe a picture and the agent will draw it', icon: 'sparkle' },
            { id: 'search', label: 'Deep search', description: 'Browse trusted sources for a longer answer', icon: 'search' },
            { id: 'tools', label: 'Run a tool', description: 'Open the tool picker (file, shell, web, …)', icon: 'terminal' },
            { id: 'div', label: '', divider: true },
            { id: 'clear', label: 'Clear conversation', description: 'Removes every message from this thread', destructive: true, icon: 'trash' },
          ]}
          onActionSelect={setPicked}
          footerHint={
            picked
              ? `AI can make mistakes — please double-check. picked: ${picked}`
              : 'AI can make mistakes — please double-check important answers.'
          }
        />
      );
    }
    return <Demo/>;
  },
};

/** In context — the composer anchored at the bottom of a chat surface, below a short thread. */
export const InContext: Story = {
  render: () => {
    function Demo() {
      const [text, setText] = React.useState('');
      const [model, setModel] = React.useState('eidos-sonnet-4-6');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Conversation title="identity-svc · incident 0421">
            <Message from="user" meta="You · 2:14 PM">
              p99 on identity-svc jumped to 1.8s after the 14:02 deploy. What changed?
            </Message>
            <Message from="assistant" meta="Eidos AI · 2:14 PM">
              The 14:02 deploy added a synchronous token-refresh call on the hot path.
              Drop me the trace and I&rsquo;ll confirm the regression.
            </Message>
          </Conversation>
          <PromptInput
            status="ready"
            value={text}
            onChange={setText}
            onSubmit={() => setText('')}
            modelValue={model}
            onModelChange={setModel}
            elevated
            placeholder="Reply to Eidos AI…"
            footerHint="AI can make mistakes — please double-check important answers."
          />
        </div>
      );
    }
    return <Demo/>;
  },
};
