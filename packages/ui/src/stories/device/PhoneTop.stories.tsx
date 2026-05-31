import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhoneTop } from '@forge/ui';

const meta = {
  title: 'Device/PhoneTop',
  component: PhoneTop,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shows only the upper slice of a handset — status bar and an anchored ' +
          'top region — at a comfortable preview size without rendering the full device. ' +
          'Rounded top corners, the platform\'s camera cutout, and a fade hint signal ' +
          'that more content exists below.',
      },
    },
  },
  args: {
    platform: 'ios',
    time: '9:41',
    width: 360,
    peek: 96,
    frameless: false,
  },
  argTypes: {
    platform: { control: 'inline-radio', options: ['ios', 'android'] },
    time: { control: 'text' },
    width: { control: 'number' },
    peek: { control: 'number' },
    frameless: { control: 'boolean' },
  },
} satisfies Meta<typeof PhoneTop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — iOS PhoneTop with a dynamic island and status bar. */
export const Default: Story = {
  render: (args) => (
    <PhoneTop {...args}>
      <div style={{
        padding: '12px 18px',
        fontFamily: 'var(--font)', fontSize: 17, fontWeight: 600, color: 'var(--fg)',
        borderBlockEnd: '1px solid var(--border)',
      }}>
        Inbox
      </div>
    </PhoneTop>
  ),
};

/** Android platform — punch-hole cutout, lighter status bar typography. */
export const AndroidPlatform: Story = {
  args: { platform: 'android' },
  render: (args) => (
    <PhoneTop {...args}>
      <div style={{
        padding: '10px 16px',
        fontFamily: 'var(--font)', fontSize: 16, fontWeight: 600, color: 'var(--fg)',
        borderBlockEnd: '1px solid var(--border)',
      }}>
        Home
      </div>
    </PhoneTop>
  ),
};

/** Frameless — no border or shadow; for embedding inside DeviceFrame. */
export const Frameless: Story = {
  args: { frameless: true },
  render: (args) => (
    <div style={{ background: 'var(--bg)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <PhoneTop {...args}>
        <div style={{
          padding: '12px 18px',
          fontFamily: 'var(--font)', fontSize: 17, fontWeight: 600, color: 'var(--fg)',
        }}>
          Frameless mode
        </div>
      </PhoneTop>
    </div>
  ),
};

/** Both platforms at once — useful for spec documentation. */
export const BothPlatforms: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {(['ios', 'android'] as const).map((p) => (
        <PhoneTop key={p} platform={p} time="9:41" width={320}>
          <div style={{
            padding: '12px 18px',
            fontFamily: 'var(--font)', fontSize: 16, fontWeight: 600, color: 'var(--fg)',
            borderBlockEnd: '1px solid var(--border)',
          }}>
            {p === 'ios' ? 'iOS' : 'Android'}
          </div>
        </PhoneTop>
      ))}
    </div>
  ),
};
