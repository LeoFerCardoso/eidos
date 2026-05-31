import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, Icons, DeviceFrame } from '@eidos/ui';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Transient explanatory hint anchored to a control; opens on hover or keyboard focus ' +
          'and auto-flips at the viewport edge. Carries `role="tooltip"` and wires ' +
          '`aria-describedby` on the trigger while open. Touch devices have no hover, so a mobile ' +
          'surface drives it CONTROLLED (`open` + `onOpenChange`) — a tap toggles the bubble. ' +
          'ESC dismisses; the bubble is pointer-events:none; prefers-reduced-motion removes the ' +
          'slide. For rich/interactive help content use a Popover instead.',
      },
    },
  },
  args: {
    content: 'Rollback to last good build',
    side: 'top',
    align: 'center',
    delayDuration: 500,
    closeDelayDuration: 100,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    delayDuration: { control: 'number', description: 'Open delay in ms (default 500).' },
    closeDelayDuration: { control: 'number', description: 'Close delay in ms (default 100).' },
    open: { control: 'boolean', description: 'Force open (controlled).' },
    content: { control: 'text' },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// 44px icon-only button anchor (the documented tooltip trigger). Forwards ref + ARIA
// via the cloned child; keeps its own ≥44px touch target.
function IconBtn(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: React.ReactNode },
) {
  const { label, children, ...rest } = props;
  return (
    <button
      type="button"
      aria-label={label}
      {...rest}
      style={{
        display: 'grid', placeItems: 'center', width: 44, height: 44,
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
        background: 'var(--surface)', color: 'var(--fg)', cursor: 'pointer',
        ...rest.style,
      }}
    >
      {children}
    </button>
  );
}

/** Default — icon-only button trigger, top placement, 500ms open delay (args-driven). */
export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <IconBtn label="Rollback to last good build">
        <Icons.rollback size={17} />
      </IconBtn>
    </Tooltip>
  ),
};

/** Sides — `side` places the bubble top / right / bottom / left of the trigger; it
 *  auto-flips to the opposite side when the chosen side would clip the viewport. */
export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap', padding: '60px 32px' }}>
      {([
        { side: 'top', icon: <Icons.rollback size={17} />, label: 'Rollback', tip: 'Rollback to last good build' },
        { side: 'right', icon: <Icons.copy size={17} />, label: 'Copy', tip: 'Copy run ID' },
        { side: 'bottom', icon: <Icons.auditLog size={17} />, label: 'Audit log', tip: 'View full audit log' },
        { side: 'left', icon: <Icons.flag size={17} />, label: 'Flag', tip: 'Flag for review' },
      ] as const).map((v) => (
        <div key={v.side} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)' }}>{v.side}</span>
          <Tooltip content={v.tip} side={v.side} delayDuration={0}>
            <IconBtn label={v.label}>{v.icon}</IconBtn>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

/** Alignment — `align` shifts the bubble along the chosen side: start, center (default), end. */
export const Alignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '48px 24px', width: 280 }}>
      {(['start', 'center', 'end'] as const).map((align) => (
        <Tooltip key={align} content={`Aligned ${align}`} side="top" align={align} delayDuration={0}>
          <button className="btn" style={{ width: '100%' }}>
            align=&quot;{align}&quot;
          </button>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Touch (no hover) — the documented MOBILE trigger: with no hover event the tooltip is
 *  driven CONTROLLED and a tap on the button toggles its `open` state. */
export const TouchToggle: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 32 }}>
        <Tooltip content={copied ? 'Copied!' : 'Copy run ID to clipboard'} open={open} onOpenChange={setOpen}>
          <IconBtn
            label="Copy run ID"
            onClick={() => {
              setOpen((o) => !o);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1400);
            }}
            style={{ color: copied ? 'var(--accent)' : 'var(--fg)' }}
          >
            {copied ? <Icons.check size={17} /> : <Icons.copy size={17} />}
          </IconBtn>
        </Tooltip>
      </div>
    );
  },
};

/** Controlled — open state driven externally (here by a checkbox), bypassing hover/focus. */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 32 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontSize: 13, color: 'var(--fg)' }}>
          <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
          Force tooltip open
        </label>
        <Tooltip content="Controlled tooltip" open={open} onOpenChange={setOpen} delayDuration={0}>
          <button className="btn ember">Hover or control me</button>
        </Tooltip>
      </div>
    );
  },
};

/** No delay — instant open, for icon-dense toolbars where the 500ms wait is too slow. */
export const NoDelay: Story = {
  args: { content: 'Instant', delayDuration: 0 },
  render: (args) => (
    <Tooltip {...args}>
      <IconBtn label="Settings">
        <Icons.settings size={17} />
      </IconBtn>
    </Tooltip>
  ),
};

/** In context — the documented mobile pipeline toolbar inside a DeviceFrame. Touch has no
 *  hover, so each anchor is a CONTROLLED tooltip and tapping toggles it (one open at a time). */
export const InContext: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [openKey, setOpenKey] = React.useState<string | null>(null);
    const [copied, setCopied] = React.useState(false);
    const toggle = (k: string) => setOpenKey((cur) => (cur === k ? null : k));
    const stages = [
      { name: 'Build', status: 'passed', dur: '1m 12s' },
      { name: 'Test', status: 'passed', dur: '3m 44s' },
      { name: 'Deploy', status: 'failed', dur: '0m 38s' },
    ] as const;
    return (
      <div style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
        <DeviceFrame initial="iphone-se">
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ paddingBlock: '52px 0', paddingInline: 14, flex: 1 }}>
              <div style={{ fontSize: 'var(--text-xl, 20px)', fontWeight: 700, letterSpacing: '-0.02em', marginBlockEnd: 4 }}>Pipeline · INC-1841</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBlockEnd: 20 }}>identity-svc — 3 stages</div>
              {stages.map((s) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, paddingInline: 10, borderRadius: 'var(--radius-md)', background: 'var(--surface)', marginBlockEnd: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: s.status === 'passed' ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 550 }}>{s.name}</span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>{s.dur}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginBlockStart: 20 }}>
                <Tooltip content="Rollback to last good build" open={openKey === 'rollback'} onOpenChange={(o) => setOpenKey(o ? 'rollback' : null)}>
                  <IconBtn label="Rollback to last good build" onClick={() => toggle('rollback')}>
                    <Icons.rollback size={17} />
                  </IconBtn>
                </Tooltip>
                <Tooltip content={copied ? 'Copied!' : 'Copy run ID to clipboard'} open={openKey === 'copy'} onOpenChange={(o) => setOpenKey(o ? 'copy' : null)}>
                  <IconBtn
                    label="Copy run ID"
                    onClick={() => { toggle('copy'); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }}
                    style={{ color: copied ? 'var(--accent)' : 'var(--fg)' }}
                  >
                    {copied ? <Icons.check size={17} /> : <Icons.copy size={17} />}
                  </IconBtn>
                </Tooltip>
                <Tooltip content="View full audit log" open={openKey === 'audit'} onOpenChange={(o) => setOpenKey(o ? 'audit' : null)}>
                  <IconBtn label="View full audit log" onClick={() => toggle('audit')}>
                    <Icons.auditLog size={17} />
                  </IconBtn>
                </Tooltip>
                <Tooltip content="Flag for review" open={openKey === 'flag'} onOpenChange={(o) => setOpenKey(o ? 'flag' : null)}>
                  <IconBtn label="Flag for review" onClick={() => toggle('flag')}>
                    <Icons.flag size={17} />
                  </IconBtn>
                </Tooltip>
              </div>
            </div>
          </div>
        </DeviceFrame>
      </div>
    );
  },
};

/** RTL — under dir="rtl" the position math reads computed direction and mirrors
 *  align start/end across the inline axis; the default centre case is unchanged. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', gap: 32, alignItems: 'center', padding: '64px 32px 24px' }}>
      {([
        { label: 'الرجوع', tip: 'الرجوع لآخر بناء سليم', icon: <Icons.rollback size={17} /> },
        { label: 'نسخ المعرف', tip: 'نسخ المعرف', icon: <Icons.copy size={17} /> },
        { label: 'إبلاغ للمراجعة', tip: 'إبلاغ للمراجعة', icon: <Icons.flag size={17} /> },
      ] as const).map((v) => (
        <Tooltip key={v.label} content={v.tip} side="top" delayDuration={0}>
          <IconBtn label={v.label}>{v.icon}</IconBtn>
        </Tooltip>
      ))}
    </div>
  ),
};
