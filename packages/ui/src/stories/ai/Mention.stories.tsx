import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mention } from '@eidos/ui';
import type { MentionPerson } from '@eidos/ui';

// ── Mention ───────────────────────────────────────────────────────────────────

const meta = {
  title: 'AI/Mention',
  component: Mention,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inline @-mention pill with a HoverCard profile preview. Use in chat bubbles, ' +
          'incident commander lines, or any prose surface where a person name appears. ' +
          'The pill is an ember-soft token that opens a rich profile card on hover/focus.',
      },
    },
  },
  argTypes: {
    person: { control: 'object' },
  },
} satisfies Meta<typeof Mention>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared sample people ─────────────────────────────────────────────────────

const COMMANDER: MentionPerson = {
  name: 'Marcus Johnson',
  src: '/avatars/Marcus-Johnson.jpg',
  role: 'Staff SRE',
  tribe: 'Score & Risk',
  status: 'busy',
  presence: 'On-call now · paged 6h ago',
  bio: 'SRE on the Score & Risk platform. Owns the on-call rotation and the konduto rollback runbooks. Ask me about incident response and SLOs.',
  region: 'São Paulo · Brazil',
  email: 'marcus.johnson@equifax.com',
  phone: '+55 11 99876-5432',
  joined: 'Joined Mar 2021',
  chatHref: 'https://chat.google.com/',
  href: '/portal',
};

const BACKUP: MentionPerson = {
  name: 'Diego Ferreira',
  src: '/avatars/Diego-Ferreira.jpg',
  role: 'Platform Eng',
  tribe: 'Score & Risk',
  status: 'online',
  presence: 'Available · backup on-call',
  bio: 'Platform engineer on Score & Risk. Secondary pager this week. Owns the Ignite feature-store wiring.',
  region: 'Rio de Janeiro · Brazil',
  email: 'diego.ferreira@equifax.com',
  phone: '+55 21 98123-4567',
  joined: 'Joined Aug 2022',
  chatHref: 'https://chat.google.com/',
  href: '/portal',
};

// ── Stories ──────────────────────────────────────────────────────────────────

/** Full profile — all fields populated. Hover/focus the pill to open the card. */
export const Default: Story = {
  args: { person: COMMANDER },
  render: (args) => (
    <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6 }}>
      The on-call commander for this incident is <Mention {...args} />. Reach out
      before escalating to the tribal lead.
    </p>
  ),
};

/** Minimal — only name and role are set; no photo, no contact details. */
export const Minimal: Story = {
  args: {
    person: {
      name: 'Ana Silva',
      role: 'Engineer',
    },
  },
  render: (args) => (
    <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6 }}>
      PR authored by <Mention {...args} />.
    </p>
  ),
};

/** Status: online — green dot. */
export const Online: Story = {
  args: {
    person: { ...BACKUP, status: 'online', presence: 'Available · backup on-call' },
  },
  render: (args) => (
    <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6 }}>
      <Mention {...args} /> is online and available to assist.
    </p>
  ),
};

/** Status: away — amber/warning dot. */
export const Away: Story = {
  args: {
    person: { ...COMMANDER, name: 'Priya Nair', status: 'away', presence: 'In a meeting until 15:00' },
  },
  render: (args) => (
    <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6 }}>
      <Mention {...args} /> may be slow to respond right now.
    </p>
  ),
};

/** Status: busy — danger/red dot. */
export const Busy: Story = {
  args: { person: COMMANDER },
  render: (args) => (
    <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6 }}>
      <Mention {...args} /> is on-call and actively paged — do not interrupt.
    </p>
  ),
};

/** Status: offline — faint neutral dot. */
export const Offline: Story = {
  args: {
    person: {
      name: 'Rafael Costa',
      role: 'Senior Backend Eng',
      tribe: 'Lending',
      status: 'offline',
      joined: 'Joined Jan 2023',
    },
  },
  render: (args) => (
    <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6 }}>
      <Mention {...args} /> is offline — try the team channel instead.
    </p>
  ),
};

/** Without photo — avatar falls back to generated initials. */
export const NoPhoto: Story = {
  args: {
    person: {
      name: 'Beatriz Lopes',
      role: 'Data Engineer',
      tribe: 'ML Platform',
      status: 'online',
      presence: 'Available',
      email: 'beatriz.lopes@equifax.com',
      region: 'Campinas · Brazil',
      joined: 'Joined Jul 2024',
      chatHref: 'https://chat.google.com/',
      href: '/portal',
    },
  },
  render: (args) => (
    <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6 }}>
      Owner of the feature pipeline is <Mention {...args} />.
    </p>
  ),
};

/** Multiple mentions in one paragraph. */
export const Multiple: Story = {
  args: { person: COMMANDER },
  render: () => (
    <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6 }}>
      Incident commander is <Mention person={COMMANDER} />, backed up by{' '}
      <Mention person={BACKUP} />.
    </p>
  ),
};

/** Inside a chat bubble — verifies text-decoration and colour overrides hold. */
export const InChatBubble: Story = {
  args: { person: COMMANDER },
  render: (args) => (
    <div className="msg-thread">
      <div className="msg assistant">
        <div className="msg-stack">
          <div className="msg-bubble">
            <p>
              Based on the alert timeline, <Mention {...args} /> is the current
              on-call. They were paged 6h ago and acknowledged.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
