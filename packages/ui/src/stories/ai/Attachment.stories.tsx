import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Attachment, PromptInput, Message, Response, ImageView } from '@eidos/ui';

// ── Attachment ─────────────────────────────────────────────────────────────────
// An attachment chip + three contexts where it appears:
//   (a) chips in the PromptInput composer header
//   (b) attachment chips on a received chat message (user uploads)
//   (c) a rendered image inside a response body (inline ImageView)

const meta = {
  title: 'AI/Attachment',
  component: Attachment,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single attachment chip (file or image) with three usage contexts: ' +
          '(a) chips in the PromptInput composer header before sending, ' +
          '(b) attachment chips shown on a chat message, ' +
          '(c) a rendered inline image in a response body using ImageView. ' +
          'Shows filename, size, optional thumbnail, optional remove button, ' +
          'and an optional per-chip upload progress bar.',
      },
    },
  },
  args: {
    file: { name: 'fraud-trace.json', size: '2.1 KB', kind: 'file' },
  },
  argTypes: {
    progress: { control: 'number', description: '0–100. Shows progress bar while uploading.' },
  },
} satisfies Meta<typeof Attachment>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Context (a): PromptInput composer chips ────────────────────────────────────

/** File attachment chip with a remove button (standalone). */
export const Default: Story = {
  args: { onRemove: () => {} },
};

/** Image chip — shows a thumbnail placeholder with a generated gradient. */
export const ImageChip: Story = {
  args: {
    file: { name: 'screenshot.png', size: '148 KB', kind: 'image', hue: 200 },
    onRemove: () => {},
  },
};

/** Uploading — progress bar at 42%; name row shows percentage. */
export const Uploading: Story = {
  args: {
    file: { name: 'service-log.zip', size: '4.8 MB', kind: 'file' },
    progress: 42,
    onRemove: () => {},
  },
};

/** Animated upload counter — interactive progress bar. */
export const AnimatedUpload: Story = {
  name: 'Animated upload',
  render: () => {
    function Demo() {
      const [progress, setProgress] = React.useState(0);
      React.useEffect(() => {
        if (progress >= 100) return;
        const t = setTimeout(() => setProgress(p => Math.min(100, p + 5)), 120);
        return () => clearTimeout(t);
      }, [progress]);
      return (
        <Attachment
          file={{ name: 'audit-log-2026-05.csv', size: '12.3 MB', kind: 'file' }}
          progress={progress < 100 ? progress : undefined}
        />
      );
    }
    return <Demo/>;
  },
};

/** Multiple chips — file and image side by side. */
export const MultipleChips: Story = {
  name: 'Multiple chips',
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Attachment
        file={{ name: 'fraud-trace.json', size: '2.1 KB', kind: 'file' }}
        onRemove={() => {}}
      />
      <Attachment
        file={{ name: 'decision-tree.png', size: '88 KB', kind: 'image', hue: 30 }}
        onRemove={() => {}}
      />
      <Attachment
        file={{ name: 'risk-report.pdf', size: '1.4 MB', kind: 'file' }}
        progress={67}
        onRemove={() => {}}
      />
    </div>
  ),
};

// ── Context (a) full: PromptInput with attachment chips ────────────────────────

/** (a) Composer context — attachments inside PromptInput header before sending. */
export const InComposer: Story = {
  name: '(a) In PromptInput composer',
  parameters: {
    docs: {
      description: {
        story:
          'Attachments appear in the PromptInput `attachments` header before the user sends. ' +
          'Pass an array of `{ id, name, size, kind }` objects; remove via `onRemoveAttachment`.',
      },
    },
  },
  render: () => {
    function Demo() {
      const [files, setFiles] = React.useState([
        { id: '1', name: 'fraud-trace.json', size: '2.1 KB', kind: 'file' as const },
        { id: '2', name: 'decision-tree.png', size: '88 KB', kind: 'image' as const, hue: 30 },
      ]);
      return (
        <div style={{ width: '100%', maxWidth: 620 }}>
          <PromptInput
            placeholder="Ask anything about these files…"
            attachments={files}
            onRemoveAttachment={(id) => setFiles(f => f.filter(x => x.id !== id))}
            modelValue="eidos-sonnet-4-6"
            onModelChange={() => {}}
          />
        </div>
      );
    }
    return <Demo/>;
  },
};

// ── Context (b): attachment chips on a received chat message ──────────────────

/** (b) Message context — attachment chips shown on a user chat message. */
export const OnMessage: Story = {
  name: '(b) On a chat message',
  parameters: {
    docs: {
      description: {
        story:
          'Attachment chips also appear below the body of a user Message turn — ' +
          'showing which files the user included with their question.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Message
        from="user"
        userAvatar={{ initials: 'LM', name: 'Leonardo Mariga' }}
        attachments={[
          { name: 'fraud-trace.json', size: '2.1 KB', kind: 'file' },
          { name: 'decision-tree.png', size: '88 KB', kind: 'image' },
        ]}
      >
        Anything odd in this trace and diagram?
      </Message>
    </div>
  ),
};

// ── Context (c): inline image in a response body ───────────────────────────────

/** (c) Response body context — an inline ImageView inside a model response. */
export const InResponseBody: Story = {
  name: '(c) Inline image in response body',
  parameters: {
    docs: {
      description: {
        story:
          'An image attachment generated or returned by the model renders inline in the ' +
          'response body using ImageView. The caption names the provenance: source, service, timestamp.',
      },
    },
  },
  render: () => {
    // Inline SVG data-URI so the story renders offline
    const SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e3a5f'/%3E%3Cstop offset='50%25' stop-color='%23312e81'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Crect x='40' y='140' width='180' height='80' rx='8' fill='rgba(255,255,255,0.08)'/%3E%3Crect x='260' y='100' width='320' height='20' rx='4' fill='rgba(255,255,255,0.12)'/%3E%3Ccircle cx='130' cy='180' r='40' fill='rgba(255,107,53,0.18)'/%3E%3C/svg%3E`;
    return (
      <div style={{ maxWidth: 640 }}>
        <Response
          meta={
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
              Eidos AI · Sonnet 4.6 · just now
            </span>
          }
        >
          <p>
            Here is the ring rollout architecture for <code>identity-svc</code> as of the last
            deployment. The canary ring receives 5% of traffic:
          </p>
          <ImageView
            src={SVG}
            alt="Ring rollout diagram showing canary, 25%, and 100% stages with health gates at each transition"
            caption="Generated from eidos.yaml ring definitions · identity-svc · 2026-05-30"
            aspect="16 / 9"
          />
          <p>
            Gates at each stage check <strong>p95 latency</strong> and{' '}
            <strong>error budget burn rate</strong> before auto-promoting.
          </p>
        </Response>
      </div>
    );
  },
};

// ── All three contexts side-by-side ────────────────────────────────────────────

/** All three contexts — composer, message, response body. */
export const AllContexts: Story = {
  name: 'All three contexts',
  render: () => {
    const SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e3a5f'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ccircle cx='320' cy='180' r='60' fill='rgba(255,107,53,0.2)'/%3E%3C/svg%3E`;
    function Demo() {
      const [files, setFiles] = React.useState([
        { id: '1', name: 'fraud-trace.json', size: '2.1 KB', kind: 'file' as const },
        { id: '2', name: 'design.png', size: '88 KB', kind: 'image' as const, hue: 220 },
      ]);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 640 }}>
          {/* (a) Composer */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>(a) PromptInput composer</div>
            <PromptInput
              placeholder="Ask about these files…"
              attachments={files}
              onRemoveAttachment={(id) => setFiles(f => f.filter(x => x.id !== id))}
              modelValue="eidos-sonnet-4-6"
              onModelChange={() => {}}
            />
          </div>
          {/* (b) On a message */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>(b) On a chat message</div>
            <Message
              from="user"
              userAvatar={{ initials: 'LM', name: 'Leo' }}
              attachments={[
                { name: 'fraud-trace.json', size: '2.1 KB', kind: 'file' },
                { name: 'design.png', size: '88 KB', kind: 'image' },
              ]}
            >
              What do you see in these files?
            </Message>
          </div>
          {/* (c) Inline image in response */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>(c) Inline image in response body</div>
            <Response
              meta={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>Eidos AI · just now</span>}
            >
              <p>Here is the architecture diagram you requested:</p>
              <ImageView
                src={SVG}
                alt="Architecture diagram"
                caption="Generated by Eidos AI · identity-svc · 2026-05-30"
                aspect="16 / 9"
              />
              <p>The canary ring captures 5% of traffic at each stage.</p>
            </Response>
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};
