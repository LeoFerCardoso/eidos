import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeviceFrame, PhoneTop, StatusBar } from '@forge/ui';

const meta = {
  title: 'Device/DeviceFrame',
  component: DeviceFrame,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A realistic handset bezel for previewing mobile surfaces at true device ' +
          'dimensions. A device-picker toolbar lets you switch between presets ' +
          '(iPhone 15 Pro, iPhone 16 Pro Max, iPhone SE, Pixel 8, Galaxy S24). ' +
          'Pass `bare` to hide the toolbar for static hero visuals.',
      },
    },
  },
  args: {
    initial: 'iphone-15-pro',
    maxHeight: 600,
    bare: false,
  },
  argTypes: {
    initial: {
      control: 'select',
      options: ['iphone-15-pro', 'iphone-16-pro-max', 'iphone-se', 'pixel-8', 'galaxy-s24'],
    },
    maxHeight: { control: 'number' },
    bare: { control: 'boolean' },
  },
} satisfies Meta<typeof DeviceFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — iPhone 15 Pro with the device-picker toolbar visible. */
export const Default: Story = {
  render: (args) => (
    <DeviceFrame {...args}>
      <div style={{
        width: '100%', height: '100%',
        background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font)', color: 'var(--fg)', fontSize: 14,
      }}>
        Your app here
      </div>
    </DeviceFrame>
  ),
};

/** Bare — no toolbar; the bezel alone, intended for static hero visuals. */
export const Bare: Story = {
  args: { bare: true },
  render: (args) => (
    <DeviceFrame {...args}>
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)',
        display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font)', color: 'var(--fg)',
      }}>
        <StatusBar platform="ios" />
        <span style={{ fontSize: 18, fontWeight: 600 }}>Bare frame</span>
      </div>
    </DeviceFrame>
  ),
};

/** Android device — Pixel 8 with a punch-hole cutout. */
export const Android: Story = {
  args: { initial: 'pixel-8' },
  render: (args) => (
    <DeviceFrame {...args}>
      <div style={{
        width: '100%', height: '100%',
        background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font)', color: 'var(--fg)', fontSize: 14,
      }}>
        Android preview
      </div>
    </DeviceFrame>
  ),
};

/** Small device — iPhone SE (375×667) with no notch. */
export const SmallDevice: Story = {
  args: { initial: 'iphone-se', maxHeight: 500 },
  render: (args) => (
    <DeviceFrame {...args}>
      <div style={{
        width: '100%', height: '100%',
        background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font)', color: 'var(--fg)', fontSize: 13,
      }}>
        iPhone SE — no notch
      </div>
    </DeviceFrame>
  ),
};

/** In context — a PhoneTop composited inside the frame, showing an app header. */
export const InContext: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <DeviceFrame initial="iphone-15-pro" maxHeight={600}>
      <div style={{ width: '100%', height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        <PhoneTop platform="ios" time="9:41" width={393} peek={120} frameless>
          <div style={{
            padding: '12px 18px',
            fontFamily: 'var(--font)', fontSize: 17, fontWeight: 600, color: 'var(--fg)',
          }}>
            Forge Mobile
          </div>
        </PhoneTop>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
          App content
        </div>
      </div>
    </DeviceFrame>
  ),
};
