import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard } from '@eidos/ui';

// ── Shared demo helpers ────────────────────────────────────────────────────────

const AvatarCircle = ({ initials, size = 40 }: { initials: string; size?: number }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
      color: '#08090A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: size > 32 ? 15 : 12,
      flexShrink: 0,
      fontFamily: 'var(--font-mono)',
    }}
  >
    {initials}
  </div>
);

const ProfileContent = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <AvatarCircle initials="AL" />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 15 }}>Ada Lovelace</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
        @ada · Eidos Platform
      </div>
      <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 8, lineHeight: 1.5 }}>
        Working on the deploy pipeline. Reachable on #platform-eng.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <span className="pill">Online</span>
        <span className="pill ember">Reviewer</span>
      </div>
    </div>
  </div>
);

const LinkContent = () => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        docs.eidos.dev
      </span>
    </div>
    <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 15, marginBottom: 4 }}>
      Deploying a service
    </div>
    <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
      Six steps from local change to production traffic — config, build, push, deploy, verify, rollback.
    </div>
  </>
);

// ── Meta ───────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A rich hover-triggered floating panel for previewing entities — users, links, commits, refs. ' +
          'Opens on hover (300ms delay) or keyboard focus; closes on mouse-leave (200ms), blur, or Escape. ' +
          'Positions itself below the trigger with automatic flip; passively rendered (no focus trap). ' +
          'For one-line hints use Tooltip; for click-triggered actions use Popover.',
      },
    },
  },
  args: {
    openDelay: 300,
    closeDelay: 200,
    side: 'bottom',
    align: 'start',
    sideOffset: 8,
    minWidth: 240,
  },
  argTypes: {
    openDelay: { control: { type: 'range', min: 0, max: 1000, step: 50 }, description: 'ms before open on hover' },
    closeDelay: { control: { type: 'range', min: 0, max: 500, step: 25 }, description: 'ms before close on leave' },
    side: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    sideOffset: { control: { type: 'number', min: 0, max: 32 } },
    minWidth: { control: { type: 'number', min: 160, max: 480 } },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ────────────────────────────────────────────────────────────────────

/**
 * Default — hover or focus the @-mention button to reveal the user card.
 * The trigger is a button so it is reachable by keyboard Tab and by the probe.
 */
export const Default: Story = {
  render: (args) => (
    <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
      Just paired with{' '}
      <HoverCard
        {...args}
        trigger={
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--ember)',
              fontWeight: 500,
              font: 'inherit',
              fontSize: 15,
            }}
          >
            @ada
          </button>
        }
      >
        <ProfileContent />
      </HoverCard>
      {' '}on the new pipeline.
    </p>
  ),
};

/**
 * Focus story — the card opens on keyboard focus (Tab to the @-mention, then
 * immediately visible at openDelay=0). Demonstrates that HoverCard is reachable
 * without a mouse. Trigger is a `<button>` so it is probe-testable.
 */
export const Focus: Story = {
  args: { openDelay: 0, closeDelay: 0 },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
      <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 13, margin: 0 }}>
        Tab to the mention below — the card opens on focus immediately.
      </p>
      <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
        Assigned to{' '}
        <HoverCard
          {...args}
          trigger={
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'var(--ember)',
                fontWeight: 500,
                font: 'inherit',
                fontSize: 15,
              }}
            >
              @ada
            </button>
          }
        >
          <ProfileContent />
        </HoverCard>
        {' '}for this sprint.
      </p>
    </div>
  ),
};

/** Link preview — hover a URL to peek the page title and description. */
export const LinkPreview: Story = {
  render: (args) => (
    <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
      The deploy guide lives at{' '}
      <HoverCard
        {...args}
        minWidth={280}
        trigger={
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ color: 'var(--ember)', textDecoration: 'underline' }}
          >
            docs.eidos.dev/deploy
          </a>
        }
      >
        <LinkContent />
      </HoverCard>
      {' '}— hover to peek before you commit to the click.
    </p>
  ),
};

/** Opens above the trigger — useful when the trigger is near the bottom of a panel. */
export const SideTop: Story = {
  args: { side: 'top' },
  render: (args) => (
    <div style={{ paddingTop: 160, paddingBottom: 0 }}>
      <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
        Assigned to{' '}
        <HoverCard
          {...args}
          trigger={
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}>
              @ada
            </a>
          }
        >
          <ProfileContent />
        </HoverCard>
      </p>
    </div>
  ),
};

/** Center aligned panel — suitable for short trigger text. */
export const AlignCenter: Story = {
  args: { align: 'center', minWidth: 280 },
  render: (args) => (
    <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
      Assigned to{' '}
      <HoverCard
        {...args}
        trigger={
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}>
            @ada
          </a>
        }
      >
        <ProfileContent />
      </HoverCard>
    </p>
  ),
};

/** Zero open delay — opens immediately on hover (not recommended for production). */
export const NoDelay: Story = {
  args: { openDelay: 0, closeDelay: 0 },
  render: (args) => (
    <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
      Hover{' '}
      <HoverCard
        {...args}
        trigger={
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}>
            @ada
          </a>
        }
      >
        <ProfileContent />
      </HoverCard>
      {' '}— opens immediately.
    </p>
  ),
};

/** Controlled — open state driven externally. */
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <button className="btn" onClick={() => setOpen((v) => !v)}>
          {open ? 'Close card' : 'Open card'}
        </button>
        <HoverCard
          {...args}
          open={open}
          onOpenChange={setOpen}
          trigger={
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}>
              @ada
            </a>
          }
        >
          <ProfileContent />
        </HoverCard>
      </div>
    );
  },
};

/** RTL — the panel anchors to the start edge, which is the right in right-to-left text. */
export const RTL: Story = {
  render: (args) => (
    <div dir="rtl">
      <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
        أُسنِد إلى{' '}
        <HoverCard
          {...args}
          trigger={
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}>
              @ada
            </a>
          }
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AvatarCircle initials="AL" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 15 }}>Ada Lovelace</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>@ada · Eidos</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 8, lineHeight: 1.5 }}>
                تعمل على مسار النشر. متاحة على ‎#platform-eng.
              </div>
            </div>
          </div>
        </HoverCard>
        {' '}في خط الأنابيب الجديد.
      </p>
    </div>
  ),
};

/** In context — inside a realistic activity-feed surface. */
export const InContext: Story = {
  render: (args) => (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '16px 20px',
        maxWidth: 480,
        fontFamily: 'var(--font)',
      }}
    >
      <div style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: 16, fontSize: 13 }}>Recent activity</div>
      {[
        { name: 'Ada Lovelace', handle: '@ada', action: 'approved PR #7421', initials: 'AL', time: '2m ago' },
        { name: 'Grace Hopper', handle: '@grace', action: 'deployed pix-router v2.7', initials: 'GH', time: '14m ago' },
        { name: 'Margaret Hamilton', handle: '@margaret', action: 'opened incident #312', initials: 'MH', time: '1h ago' },
      ].map(({ name, handle, action, initials, time }) => (
        <div
          key={handle}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderTop: '1px solid var(--border)' }}
        >
          <AvatarCircle initials={initials} size={32} />
          <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
            <HoverCard
              {...args}
              trigger={
                <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--fg)', fontWeight: 500, textDecoration: 'none' }}>
                  {name}
                </a>
              }
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AvatarCircle initials={initials} size={36} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 15 }}>{name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{handle} · Eidos Platform</div>
                </div>
              </div>
            </HoverCard>
            {' '}{action}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', whiteSpace: 'nowrap' }}>{time}</span>
        </div>
      ))}
    </div>
  ),
};
