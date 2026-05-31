import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Avatar } from '@eidos/ui';

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Identity at a glance. Initials by default (computed from `name`, or pass `children` to ' +
          'override); reach for an image via `src` only when the product is identity-focused. ' +
          'Five size presets (xs–xl), an optional presence `status` dot, an `ember` tint for the ' +
          'current user, and `<Avatar.Group>` for overlapping team rows.',
      },
    },
  },
  args: { name: 'Ana Silva', size: 'md' },
  argTypes: {
    name: { control: 'text', description: 'Full name — title tooltip + computed initials fallback.' },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    status: { control: 'inline-radio', options: [undefined, 'online', 'away', 'busy', 'offline'] },
    ember: { control: 'boolean' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — initials computed from `name`. */
export const Default: Story = {
  render: (args) => <Avatar {...args}>AS</Avatar>,
};

/** Size presets — xs 18 · sm 22 · md 28 · lg 36 · xl 48. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} size={size} name="Ana Silva">AS</Avatar>
      ))}
    </div>
  ),
};

/** Presence status — the trailing-bottom dot reads as a cutout via a 2px ring. */
export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar size="lg" name="Ana — online" status="online">AS</Avatar>
      <Avatar size="lg" name="Bruno — away" status="away">BC</Avatar>
      <Avatar size="lg" name="Camila — busy" status="busy">CO</Avatar>
      <Avatar size="lg" name="Diego — offline" status="offline">DM</Avatar>
    </div>
  ),
};

/** Image with initials fallback — a broken `src` degrades to the computed initials. */
export const WithImage: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar size="lg" name="Mariana Rossi" src="/avatars/Mariana-Rossi.jpg" />
      <Avatar size="lg" name="Broken URL" src="/does-not-exist.jpg">BU</Avatar>
    </div>
  ),
};

/** Ember tint — reserve for the current user / "you". Dark ink on the ember-soft fill. */
export const Ember: Story = {
  render: () => <Avatar size="lg" name="You" ember>YO</Avatar>,
};

/** Avatar.Group — overlapping team row with a "+N" overflow chip. Mirrors under RTL. */
export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Avatar.Group max={4}>
        <Avatar name="Ana">AS</Avatar>
        <Avatar name="Bruno" ember>BC</Avatar>
        <Avatar name="Camila">CO</Avatar>
        <Avatar name="Diego">DM</Avatar>
        <Avatar name="Eliane">EL</Avatar>
      </Avatar.Group>
      <div dir="rtl">
        <Avatar.Group max={4}>
          <Avatar name="آنا">AS</Avatar>
          <Avatar name="برونو" ember>BC</Avatar>
          <Avatar name="كاميلا">CO</Avatar>
          <Avatar name="ديغو">DM</Avatar>
          <Avatar name="إلين">EL</Avatar>
        </Avatar.Group>
      </div>
    </div>
  ),
};

// Real headshots, resized to 200px in the docs app's public/avatars/ (served via
// Storybook staticDirs). Reused across the photo stories below.
const PHOTOS = [
  { name: 'Ashley Williams', initials: 'AW', src: '/avatars/Ashley-Williams.jpg' },
  { name: 'Mariana Rossi', initials: 'MR', src: '/avatars/Mariana-Rossi.jpg' },
  { name: 'Diego Ferreira', initials: 'DF', src: '/avatars/Diego-Ferreira.jpg' },
  { name: 'Yuki Tanaka', initials: 'YT', src: '/avatars/Yuki-Tanaka.jpg' },
  { name: 'Marcus Johnson', initials: 'MJ', src: '/avatars/Marcus-Johnson.jpg' },
  { name: 'Emma Larsson', initials: 'EL', src: '/avatars/Emma-Larsson.jpg' },
  { name: 'Raj Patel', initials: 'RP', src: '/avatars/Raj-Patel.jpg' },
];

/** With photo — pass `src` for a real headshot; initials render until it loads and on error. */
export const WithPhoto: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {PHOTOS.map((p) => (
        <Avatar key={p.src} size="lg" name={p.name} src={p.src}>{p.initials}</Avatar>
      ))}
      <Avatar size="lg" name="Broken URL" src="/nope.jpg">BU</Avatar>
    </div>
  ),
};

/** Photo group — overlapping headshots with a "+N" overflow chip. */
export const PhotoGroup: Story = {
  render: () => (
    <Avatar.Group max={5}>
      {PHOTOS.map((p) => (
        <Avatar key={p.src} name={p.name} src={p.src} />
      ))}
    </Avatar.Group>
  ),
};

/** Photo + status — presence dot over a headshot. */
export const PhotoStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar size="lg" name="Ashley Williams" src="/avatars/Ashley-Williams.jpg" status="online" />
      <Avatar size="lg" name="Mariana Rossi" src="/avatars/Mariana-Rossi.jpg" status="away" />
      <Avatar size="lg" name="Diego Ferreira" src="/avatars/Diego-Ferreira.jpg" status="busy" />
    </div>
  ),
};

/** Variants — the full matrix at a glance. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Avatar size="md" name="Default">DE</Avatar>
      <Avatar size="md" name="You" ember>YO</Avatar>
      <Avatar size="md" name="Online" status="online">ON</Avatar>
      <Avatar size="md" name="Yuki Tanaka" src="/avatars/Yuki-Tanaka.jpg" />
    </div>
  ),
};
