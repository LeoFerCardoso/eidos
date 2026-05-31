import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArtifactWidget } from '@eidos/ui';
import type { ArtifactRef } from '@eidos/ui';

const DOC_ARTIFACT: ArtifactRef = {
  id: 'art-001',
  kind: 'document',
  title: 'Incident Report — INC-9812',
  meta: '4 KB · markdown',
};

const CODE_ARTIFACT: ArtifactRef = {
  id: 'art-002',
  kind: 'code',
  title: 'rollback.ts',
  meta: '84 lines · TypeScript',
  lang: 'ts',
};

const HTML_ARTIFACT: ArtifactRef = {
  id: 'art-003',
  kind: 'html',
  title: 'Risk Dashboard Preview',
  meta: '12 KB',
};

const APP_ARTIFACT: ArtifactRef = {
  id: 'art-004',
  kind: 'app',
  title: 'Latency Explorer',
};

const meta = {
  title: 'AI/ArtifactWidget',
  component: ArtifactWidget,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compact chip that lands in a message bubble to represent a model-produced artifact ' +
          '(document, code file, HTML page, or live app). Click to open the artifact in the side panel.',
      },
    },
  },
  args: {
    artifact: DOC_ARTIFACT,
  },
  argTypes: {
    className: { control: 'text' },
  },
} satisfies Meta<typeof ArtifactWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Document artifact chip — default kind. */
export const Default: Story = {};

/** Code artifact chip with language meta. */
export const CodeArtifact: Story = {
  args: { artifact: CODE_ARTIFACT },
};

/** HTML page artifact chip. */
export const HtmlArtifact: Story = {
  args: { artifact: HTML_ARTIFACT },
};

/** App artifact chip — no meta. */
export const AppArtifact: Story = {
  args: { artifact: APP_ARTIFACT },
};

/** All four kinds side by side. */
export const AllKinds: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
      {[DOC_ARTIFACT, CODE_ARTIFACT, HTML_ARTIFACT, APP_ARTIFACT].map((a) => (
        <ArtifactWidget key={a.id} artifact={a} onOpen={() => {}} />
      ))}
    </div>
  ),
};
