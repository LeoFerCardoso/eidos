import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@eidos/ui';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Multi-line text entry — a native <textarea> in the Forge field shell (label / helper / invalid), with three sizes, an error tone, and an optional live character counter.' } },
  },
  args: { label: 'Incident summary', placeholder: 'What happened, impact, and current status…', rows: 4 },
  argTypes: {
    label: { control: 'text' },
    help: { control: 'text' },
    error: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    showCount: { control: 'boolean' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The everyday multi-line field — label, control, and rows, driven by args. */
export const Default: Story = {};

/** The three field heights — match the surrounding chrome (sm in dense tables, lg for long-form). */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 380 }}>
      <Textarea size="sm" label="Small" rows={2} placeholder="sm — chat reply…" />
      <Textarea size="md" label="Medium (default)" rows={3} placeholder="md — forms & dialogs…" />
      <Textarea size="lg" label="Large" rows={4} placeholder="lg — long-form…" />
    </div>
  ),
};

/** Live character counter — the count lives in the helper row and requires `maxLength`. */
export const WithCounter: Story = {
  args: { label: 'Commit message', maxLength: 140, showCount: true, defaultValue: 'fix(pix-router): drop sync call to bureau-gateway', rows: 3 },
};

/** Error state — danger ring + message, aria-invalid set. */
export const Invalid: Story = {
  args: { label: 'Postmortem', error: 'A postmortem is required for P0/P1 incidents.', rows: 4 },
};

/** Disabled — non-interactive, dimmed. */
export const Disabled: Story = {
  args: { label: 'Notes', defaultValue: 'Read-only context from the incident bot.', disabled: true, rows: 3 },
};

/** Readonly — value is selectable but locked from editing (imported log lines, IDs). */
export const ReadOnly: Story = {
  args: { label: 'Captured timeline', defaultValue: '12:04 alert fired · 12:07 paged on-call · 12:31 mitigation applied', readOnly: true, rows: 3, help: 'Selectable, but locked.' },
};

/** A postmortem fragment, as on a real form — sized textareas inside a Card. */
export const InContext: Story = {
  render: () => (
    <Card variant="outline" style={{ maxWidth: 440 }}>
      <CardHeader>
        <CardTitle>Postmortem · INC-2041</CardTitle>
        <CardDescription>pix-router 5xx spike — capture the summary and follow-ups.</CardDescription>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Textarea
          label="Summary"
          rows={4}
          defaultValue="Sync call to bureau-gateway timed out under load and exhausted the connection pool."
          help="What happened and the customer impact."
        />
        <Textarea
          label="Action items"
          size="sm"
          rows={2}
          maxLength={280}
          showCount
          placeholder="One follow-up per line…"
        />
      </CardContent>
    </Card>
  ),
};
