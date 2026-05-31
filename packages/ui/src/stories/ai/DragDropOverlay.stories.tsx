import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DragDropOverlay } from '@forge/ui';

const meta = {
  title: 'AI/DragDropOverlay',
  component: DragDropOverlay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Full-shell drag-and-drop composer with an ember overlay that covers the whole input area when ' +
          'files are dragged over it. Supports pre-loaded attachments (rendered as chips) and a model selector.',
      },
    },
  },
  args: {
    modelValue: 'forge-sonnet-4-6',
    placeholder: 'Drag a file anywhere on this composer…',
  },
  argTypes: {
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof DragDropOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default overlay composer — drag a file over it to see the veil. */
export const Default: Story = {
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      return (
        <DragDropOverlay
          modelValue={model}
          onModelChange={setModel}
          onDrop={files => console.log('dropped:', files)}
          placeholder="Have a look — drag a file to attach it."
        />
      );
    }
    return <Demo/>;
  },
};

/** With pre-loaded attachments in the header. */
export const WithPreloadedFiles: Story = {
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      return (
        <DragDropOverlay
          modelValue={model}
          onModelChange={setModel}
          initialFiles={[
            { id: 'f1', name: 'fraud-trace.json', size: '2.1 KB', kind: 'file' },
            { id: 'f2', name: 'decision-tree.png', size: '88 KB', kind: 'image', hue: 30 },
          ]}
          placeholder="Anything odd in these files?"
        />
      );
    }
    return <Demo/>;
  },
};
