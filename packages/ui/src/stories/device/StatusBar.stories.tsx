import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBar } from '@eidos/ui';

const meta = {
  title: 'Device/StatusBar',
  component: StatusBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The OS status strip shown above an app\'s top navigation inside a device frame. ' +
          'Adapts to platform: iOS renders a heavier centred clock with filled signal/wifi glyphs ' +
          'and a rounded battery; Android uses a lighter clock and outline battery.',
      },
    },
  },
  args: {
    platform: 'ios',
    time: '9:41',
  },
  argTypes: {
    platform: { control: 'inline-radio', options: ['ios', 'android'] },
    time: { control: 'text' },
  },
} satisfies Meta<typeof StatusBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — iOS StatusBar at 9:41. */
export const Default: Story = {};

/** Android platform variant. */
export const Android: Story = {
  args: { platform: 'android' },
};

/** Both platforms side by side for comparison. */
export const BothPlatforms: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
      {(['ios', 'android'] as const).map((platform) => (
        <div
          key={platform}
          style={{
            background: 'var(--surface)',
            borderRadius: 8,
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          <StatusBar platform={platform} time="9:41" />
        </div>
      ))}
    </div>
  ),
};

/** Custom time string — useful for documentation screenshots. */
export const CustomTime: Story = {
  args: { time: '12:00' },
};
