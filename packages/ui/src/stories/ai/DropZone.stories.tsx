import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropZone } from '@eidos/ui';

const meta = {
  title: 'AI/DropZone',
  component: DropZone,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A basic drag-and-drop composer wrapper. Renders the `.pi` shell with a footer drop hint ' +
          'that appears when files are dragged over it. Children override the default textarea slot.',
      },
    },
  },
  args: {
    modelValue: 'forge-sonnet-4-6',
  },
  argTypes: {
    modelValue: { control: 'text' },
  },
} satisfies Meta<typeof DropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default drop zone with a model selector in the footer. */
export const Default: Story = {
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      return (
        <DropZone
          modelValue={model}
          onModelChange={setModel}
          onDrop={files => console.log('dropped:', files)}
        />
      );
    }
    return <Demo/>;
  },
};

/** Without the model selector — simpler footer. */
export const NoModelSelector: Story = {
  args: {
    modelValue: undefined,
    onModelChange: undefined,
  },
};
