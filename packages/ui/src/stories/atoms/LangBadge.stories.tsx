import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { LangBadge } from '@eidos/ui';

const meta = {
  title: 'Primitives/LangBadge',
  component: LangBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inline language tag used in service catalogs, repository listings, and dependency tables. ' +
          'Renders a colour-coded dot (keyed to the language in MOCKS.LANGS) inside a Chip. ' +
          'Unknown languages fall back to a muted dot. Pass `lang` as the language name string; ' +
          'the dot colour is resolved automatically — no per-use colour wiring needed.',
      },
    },
  },
  argTypes: {
    lang: {
      control: 'select',
      options: ['TypeScript', 'Go', 'Java', 'Python', 'Rust', 'Shell', 'Kotlin'],
    },
    className: { control: false },
  },
  args: {
    lang: 'TypeScript',
  },
} satisfies Meta<typeof LangBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single badge — the smallest real example. Colour dot resolves from the language registry. */
export const Default: Story = {
  render: (args) => <LangBadge {...args} />,
};

/** Known languages side by side — covers the full dot-colour matrix. */
export const KnownLanguages: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <LangBadge lang="TypeScript" />
      <LangBadge lang="Go" />
      <LangBadge lang="Java" />
      <LangBadge lang="Python" />
      <LangBadge lang="Rust" />
    </div>
  ),
};

/** Unknown / unlisted language — dot falls back to muted foreground. */
export const UnknownLanguage: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <LangBadge lang="Shell" />
      <LangBadge lang="Kotlin" />
      <LangBadge lang="Elixir" />
      <LangBadge lang="Terraform" />
    </div>
  ),
};

/** In context — service catalog row with language, owner, and tier information. */
export const InContext: Story = {
  render: () => (
    <div className="surface" style={{ borderRadius: 10, overflow: 'hidden' }}>
      {[
        { name: 'forge-api',           lang: 'Go',         repo: 'platform/forge-api',      deploys: 142 },
        { name: 'auth-service',        lang: 'TypeScript', repo: 'platform/auth-service',   deploys: 89  },
        { name: 'billing-worker',      lang: 'Java',       repo: 'platform/billing-worker', deploys: 31  },
        { name: 'ml-inference-router', lang: 'Python',     repo: 'ml/inference-router',     deploys: 17  },
        { name: 'cache-proxy',         lang: 'Rust',       repo: 'infra/cache-proxy',       deploys: 204 },
      ].map((row, i) => (
        <div
          key={row.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 16px',
            borderTop: i === 0 ? 'none' : '1px solid var(--border)',
          }}
        >
          <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg)' }}>
            {row.name}
          </span>
          <span style={{ color: 'var(--fg-muted)', fontSize: 12 }}>{row.repo}</span>
          <LangBadge lang={row.lang} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-subtle)', minWidth: 48, textAlign: 'right' }}>
            {row.deploys} deploys
          </span>
        </div>
      ))}
    </div>
  ),
};
