import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArtifactPanel } from '@eidos/ui';
import type { ArtifactRef } from '@eidos/ui';

const DOC_ARTIFACT: ArtifactRef = {
  id: 'art-doc',
  kind: 'document',
  title: 'Incident Report — INC-9812',
  meta: '4 KB · markdown',
  content: `## Summary\n\nHigh p95 latency spike in fraud-engine detected at 14:02 BRT.\n\n` +
    `## Root cause\n\nThe ML feature store returned stale data, causing the scoring chain to ` +
    `retry three times before the circuit breaker opened.\n\n` +
    `## Resolution\n\nFeature store cache invalidated and canary rolled back to v3.4.6.`,
};

const CODE_ARTIFACT: ArtifactRef = {
  id: 'art-code',
  kind: 'code',
  title: 'rollback.ts',
  meta: '22 lines · TypeScript',
  lang: 'ts',
  content: `import { deployctl } from '@eidos/infra';\n\nasync function rollback(service: string, version: string) {\n  await deployctl.rollback({ service, version, ring: 0 });\n}`,
};

const TAB_ARTIFACT: ArtifactRef = {
  id: 'art-tab',
  kind: 'document',
  title: 'Pix Router Analysis',
  meta: '2 views',
};

const meta = {
  title: 'AI/ArtifactPanel',
  component: ArtifactPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A docked inline panel (wrapping the Forge Drawer in inline mode) that shows a ' +
          'model-produced artifact alongside the chat. Renders document, code, HTML, or app ' +
          'content by kind; supports a tab strip when multiple views are needed.',
      },
    },
    layout: 'fullscreen',
  },
  args: {
    artifact: DOC_ARTIFACT,
    open: true,
    side: 'right',
    width: 460,
  },
  argTypes: {
    open: { control: 'boolean' },
    side: { control: 'inline-radio', options: ['right', 'left'] },
    width: { control: 'number' },
  },
} satisfies Meta<typeof ArtifactPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Document artifact — renders paragraph content from ArtifactRef.content. */
export const Default: Story = {};

/** Code artifact — renders a pre/code block. */
export const CodeKind: Story = {
  args: { artifact: CODE_ARTIFACT },
};

/** Panel docked on the left side. */
export const LeftSide: Story = {
  args: { side: 'left' },
};

/** Closed — panel is collapsed, space is reclaimed by siblings. */
export const Closed: Story = {
  args: { open: false },
};

/** With a tab strip — two named views inside the same panel. */
export const WithTabs: Story = {
  args: { artifact: TAB_ARTIFACT },
  render: (args) => (
    <ArtifactPanel
      {...args}
      tabs={[
        { id: 'summary', label: 'Summary', content: <p style={{ padding: '12px 16px', color: 'var(--fg-muted)' }}>Risk score delta: +12 over the past 7 days.</p> },
        { id: 'raw', label: 'Raw data', content: <pre style={{ padding: '12px 16px', fontSize: 12 }}>{`{ "risk_delta": 12, "period": "7d" }`}</pre> },
      ]}
    />
  ),
};

/** Interactive — toggle open/closed with a button beside the panel. */
export const Interactive: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 1, padding: 24 }}>
          <button className="btn sm" onClick={() => setOpen((v) => !v)}>
            {open ? 'Close panel' : 'Open panel'}
          </button>
          <p style={{ marginTop: 16, color: 'var(--fg-muted)', fontSize: 14 }}>
            The artifact panel docks inline — this column shrinks when the panel opens.
          </p>
        </div>
        <ArtifactPanel
          artifact={DOC_ARTIFACT}
          open={open}
          onClose={() => setOpen(false)}
          width={420}
        />
      </div>
    );
  },
};
