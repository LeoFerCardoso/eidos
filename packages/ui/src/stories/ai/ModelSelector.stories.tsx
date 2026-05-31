import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ModelSelector, ModelPicker, PromptInput, Icons } from '@forge/ui';

const MODELS = [
  { id: 'forge-sonnet-4-6', short: 'S', name: 'Sonnet 4.6', cost: '$3 / 1M' },
  { id: 'forge-opus-4-7',   short: 'O', name: 'Opus 4.7',   cost: '$15 / 1M' },
  { id: 'forge-haiku-4-5',  short: 'H', name: 'Haiku 4.5',  cost: '$1 / 1M' },
];

const meta = {
  title: 'AI/ModelSelector',
  component: ModelSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Choose the model the next reply will use. A compact drop-up trigger that lives in the ' +
          'PromptInput composer footer — or any surface (a conversation header) where the active model ' +
          'should be visible and switchable. Fully keyboard-navigable (ArrowUp/Down, Home/End, Enter, ' +
          'Escape) with a roving `aria-activedescendant` listbox. `ModelPicker` is a legacy alias.',
      },
    },
  },
  args: {
    value: 'forge-sonnet-4-6',
    models: MODELS,
  },
  argTypes: {
    value: { control: 'select', options: MODELS.map(m => m.id) },
  },
} satisfies Meta<typeof ModelSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled drop-up driven by args — click to open; pick a model to update value. */
export const Default: Story = {
  render: (args) => {
    function Demo() {
      const [value, setValue] = React.useState(args.value);
      return <ModelSelector value={value} onChange={setValue} models={args.models} />;
    }
    return <Demo />;
  },
};

/** Custom models — pass a `models` array with descriptive cost subtitles (speed + price). */
export const CustomModels: Story = {
  render: () => {
    function Demo() {
      const custom = [
        { id: 'anthropic/claude-sonnet-4-5', short: 'S', name: 'Claude Sonnet 4.5', cost: 'Fast · $3 / 1M' },
        { id: 'openai/gpt-5',                short: 'G', name: 'GPT-5',             cost: 'OpenAI · $15 / 1M' },
        { id: 'forge-ai/sonnet-4-6',         short: 'F', name: 'Forge Sonnet 4.6',  cost: 'Hosted · $3 / 1M' },
        { id: 'openai/gpt-4o-mini',          short: 'M', name: 'GPT-4o mini',      cost: 'Budget · $0.15 / 1M' },
      ];
      const [value, setValue] = React.useState('anthropic/claude-sonnet-4-5');
      return <ModelSelector value={value} onChange={setValue} models={custom} />;
    }
    return <Demo />;
  },
};

/** Inside PromptInput — the canonical placement. Pass `modelValue` / `onModelChange`
 *  to the composer and the selector renders automatically in the footer. */
export const InContext: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      const [text, setText] = React.useState('');
      return (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <PromptInput
            status="ready"
            placeholder="Ask anything…"
            value={text}
            onChange={setText}
            onSubmit={() => setText('')}
            modelValue={model}
            onModelChange={setModel}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

/** Header context — in a conversation header bar the selector doubles as the
 *  current-model indicator; clicking opens the picker for the next reply. */
export const HeaderContext: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-opus-4-7');
      return (
        <div
          className="surface"
          style={{
            width: '100%',
            maxWidth: 520,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Icons.flame size={14} color="var(--ember)" />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, flex: 1 }}>
            Incident replay · 0421
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-faint)',
              marginInlineEnd: 8,
            }}
          >
            Model
          </span>
          <ModelSelector value={model} onChange={setModel} models={MODELS} />
        </div>
      );
    }
    return <Demo />;
  },
};

/** RTL — `dir="rtl"`. Logical gap + flex-direction flip the reading order; the
 *  chevron is not directional and does not mirror. */
export const RTL: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    function Demo() {
      const [selector, setSelector] = React.useState('forge-sonnet-4-6');
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      const [text, setText] = React.useState('');
      return (
        <div
          dir="rtl"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            alignItems: 'flex-start',
            width: '100%',
            maxWidth: 520,
          }}
        >
          <ModelSelector value={selector} onChange={setSelector} models={MODELS} />
          <div style={{ width: '100%' }}>
            <PromptInput
              status="ready"
              placeholder="اسأل أي شيء…"
              value={text}
              onChange={setText}
              onSubmit={() => setText('')}
              modelValue={model}
              onModelChange={setModel}
            />
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};

/** ModelPicker alias — identical behaviour under the legacy export name. */
export const ModelPickerAlias: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState('forge-haiku-4-5');
      return <ModelPicker value={value} onChange={setValue} models={MODELS} />;
    }
    return <Demo />;
  },
};
