import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ModelPicker } from '@forge/ui';
import type { ModelOption } from '@forge/ui';

// ── Shared model catalogs ────────────────────────────────────────────────────

const FORGE_MODELS: ModelOption[] = [
  { id: 'forge-sonnet-4-6', short: 'S', name: 'Sonnet 4.6', cost: '$3 / 1M' },
  { id: 'forge-opus-4-7',   short: 'O', name: 'Opus 4.7',   cost: '$15 / 1M' },
  { id: 'forge-haiku-4-5',  short: 'H', name: 'Haiku 4.5',  cost: '$1 / 1M' },
];

const EXTENDED_MODELS: ModelOption[] = [
  { id: 'forge-sonnet-4-6',   short: 'S',  name: 'Sonnet 4.6',       cost: '$3 / 1M' },
  { id: 'forge-opus-4-7',     short: 'O',  name: 'Opus 4.7',         cost: '$15 / 1M' },
  { id: 'forge-haiku-4-5',    short: 'H',  name: 'Haiku 4.5',        cost: '$1 / 1M' },
  { id: 'forge-embed-3',      short: 'E',  name: 'Embed 3',          cost: '$0.10 / 1M' },
];

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'AI/ModelPicker',
  component: ModelPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A compact drop-up trigger that lets users switch the active language model ' +
          'inside a prompt composer. Opens a portaled `listbox` anchored above (or below ' +
          'when space is tight) the trigger; fully keyboard-navigable with ArrowUp/Down, ' +
          'Home, End, Enter, and Escape. Use it in any prompt-input footer alongside ' +
          '`PromptInput` or standalone when the model choice is the primary affordance ' +
          '(e.g. an agent-config panel or a deployment-pipeline settings drawer). ' +
          '`ModelPicker` is the canonical export name; `ModelSelector` is an alias.',
      },
    },
  },
  args: {
    value: 'forge-sonnet-4-6',
    models: FORGE_MODELS,
  },
  argTypes: {
    value: {
      control: 'select',
      options: FORGE_MODELS.map(m => m.id),
    },
  },
} satisfies Meta<typeof ModelPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────────────

/**
 * Default — controlled picker with the three standard Forge-hosted models.
 * Click the trigger to open the drop-up and select a model; the label updates
 * to reflect the choice.
 */
export const Default: Story = {
  render: (args) => {
    function Demo() {
      const [value, setValue] = React.useState(args.value ?? 'forge-sonnet-4-6');
      return (
        <ModelPicker
          value={value}
          onChange={setValue}
          models={args.models ?? FORGE_MODELS}
        />
      );
    }
    return <Demo />;
  },
};

/**
 * Variants — all three standard models shown as individual active selections,
 * side-by-side. Demonstrates how each model's `short` badge and `name` label
 * render in the trigger at rest (no drop-up open).
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      {FORGE_MODELS.map((m) => {
        function ModelRow() {
          const [value, setValue] = React.useState(m.id);
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 120, fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
                {m.id}
              </span>
              <ModelPicker value={value} onChange={setValue} models={FORGE_MODELS} />
            </div>
          );
        }
        return <ModelRow key={m.id} />;
      })}
    </div>
  ),
};

/**
 * Extended catalog — a four-model list including an embedding model.
 * Shows how the drop-up handles a longer list and a narrower cost column.
 */
export const ExtendedCatalog: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState('forge-sonnet-4-6');
      return (
        <ModelPicker
          value={value}
          onChange={setValue}
          models={EXTENDED_MODELS}
        />
      );
    }
    return <Demo />;
  },
};

/**
 * In context — the picker embedded inside a minimal prompt-composer footer,
 * showing the typical placement alongside an attach icon and a submit button.
 */
export const InContext: Story = {
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--surface-1)',
            width: 360,
          }}
        >
          <button className="pi-tool" aria-label="Attach file" title="Attach file">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <span style={{ flex: 1 }}/>
          <ModelPicker value={model} onChange={setModel} models={FORGE_MODELS} />
          <button
            className="pi-submit"
            aria-label="Send"
            disabled
            style={{ opacity: 0.4 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
      );
    }
    return <Demo />;
  },
};
