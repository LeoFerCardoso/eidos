import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileInput, Input, Textarea } from '@forge/ui';

const meta = {
  title: 'Forms/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Drag-and-drop or click-to-upload. A styled `.in-drop` `<label>` wraps a hidden native `<input type="file">`, so Tab reaches it, Space/Enter open the picker, and drag-and-drop, focus ring, and form-submit semantics all come for free. `accept` filters the dialog and the drop; `onFilesChange` hands you a `File[]` to wire to your upload pipeline. The component renders the zone only — the multi-file list, per-file progress rows, and image previews shown on the docs page are consumer-composed from the `.in-file*` layer.',
      },
    },
  },
  args: {
    label: 'Avatar',
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024,
    helpText: 'PNG or JPG, up to 5 MB',
  },
  argTypes: {
    label: { control: 'text' },
    title: { control: 'text' },
    helpText: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    compact: { control: 'boolean' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single-file dropzone — the simplest form, driven by args. */
export const Default: Story = {};

/** Compact single-row layout for dense forms and side-sheets. */
export const Compact: Story = {
  args: { label: 'Logo', compact: true, helpText: 'PNG / JPG / SVG · max 2 MB' },
};

/** `accept` filters the picker dialog AND validates the drop — here PDF only. */
export const TypeRestricted: Story = {
  args: {
    label: 'Document',
    accept: 'application/pdf,.pdf',
    helpText: 'PDF only · max 25 MB',
    maxSize: 25 * 1024 * 1024,
  },
};

/** `multiple` lets the user drop or pick several files at once. */
export const Multiple: Story = {
  args: {
    label: 'Attachments',
    multiple: true,
    accept: 'image/*,application/pdf',
    helpText: 'PNG, JPG, PDF up to 10 MB',
    maxSize: 10 * 1024 * 1024,
  },
};

/** Error state — sets `aria-invalid` and paints the danger ring + message. */
export const Invalid: Story = {
  args: {
    label: 'Avatar',
    error: 'File exceeds the 5 MB limit.',
    helpText: undefined,
  },
};

/** Disabled — the zone ignores clicks, drops, and the picker. */
export const Disabled: Story = { args: { disabled: true } };

/** Right-to-left — icon, text, and helper line all mirror under `dir="rtl"`. */
export const RTL: Story = {
  args: { label: 'المرفقات (Attachments)', helpText: 'PNG · JPG · حتى ٥ ميغابايت' },
  render: (args) => (
    <div dir="rtl" style={{ maxInlineSize: 460 }}>
      <FileInput {...args} />
    </div>
  ),
};

/** Interactive — reflects the picked file name from the `onFilesChange` `File[]`. */
export const WithSelection: Story = {
  render: () => {
    function Demo() {
      const [name, setName] = React.useState<string | null>(null);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxInlineSize: 460 }}>
          <FileInput
            label="Avatar"
            accept="image/*"
            helpText="PNG or JPG, up to 5 MB"
            onFilesChange={(files) => setName(files[0]?.name ?? null)}
          />
          {name && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
              selected: {name}
            </span>
          )}
        </div>
      );
    }
    return <Demo />;
  },
};

/** In context — an attachment field composed beside sibling form primitives. */
export const InContext: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 16, maxInlineSize: 520 }}>
      <Input label="Subject" placeholder="Short summary of the request" />
      <Textarea label="Description" placeholder="What happened?" rows={3} />
      <FileInput
        label="Attachments"
        multiple
        accept="image/*,application/pdf"
        helpText="Screenshots or logs — PNG, JPG, PDF up to 10 MB"
        maxSize={10 * 1024 * 1024}
      />
    </form>
  ),
};
