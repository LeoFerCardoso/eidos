import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverHeader, PopoverBody, PopoverFooter } from '@forge/ui';

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Trigger element + anchored floating panel. Placement: top|bottom|start|end (logical) ' +
          'with viewport flip. Click-outside and Escape dismiss; focus moves into the panel on open ' +
          'and restores to the trigger on close. Distinct from Tooltip (hover, plain text) and Menu ' +
          '(list of actions).',
      },
    },
  },
  args: {
    side: 'bottom',
    align: 'start',
    sideOffset: 8,
    showArrow: false,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'bottom', 'start', 'end'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    sideOffset: { control: 'number' },
    showArrow: { control: 'boolean' },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    const [w, setW] = React.useState(360);
    const [h, setH] = React.useState(220);
    const [maintain, setMaintain] = React.useState(true);
    return (
      <div style={{ padding: 80 }}>
        <Popover
          {...args}
          open={open}
          onOpenChange={setOpen}
          trigger={<button className="btn">Dimensions</button>}
        >
          {({ close }) => (
            <>
              <PopoverHeader>Dimensions</PopoverHeader>
              <PopoverBody style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label className="pop-label">
                    Width
                    <input className="pop-input" type="number" value={w} onChange={(e) => setW(+e.target.value)} />
                  </label>
                  <label className="pop-label">
                    Height
                    <input className="pop-input" type="number" value={h} onChange={(e) => setH(+e.target.value)} />
                  </label>
                </div>
                <label className="pop-label" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={maintain} onChange={(e) => setMaintain(e.target.checked)} style={{ width: 'auto' }} />
                  Maintain aspect ratio
                </label>
              </PopoverBody>
              <PopoverFooter>
                <button className="btn xs ghost" onClick={close}>Cancel</button>
                <button className="btn xs ember" onClick={close}>Apply</button>
              </PopoverFooter>
            </>
          )}
        </Popover>
      </div>
    );
  },
};

// ── Placement matrix ──────────────────────────────────────────────────────────

const SIDES = ['top', 'bottom', 'start', 'end'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

export const Placements: Story = {
  render: () => {
    const [side, setSide] = React.useState<'top' | 'bottom' | 'start' | 'end'>('bottom');
    const [align, setAlign] = React.useState<'start' | 'center' | 'end'>('start');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 40 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', marginInlineEnd: 4 }}>SIDE</span>
          {SIDES.map((s) => (
            <button key={s} className={'btn xs' + (s === side ? ' ember' : '')} onClick={() => setSide(s)}>{s}</button>
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', marginInlineStart: 12, marginInlineEnd: 4 }}>ALIGN</span>
          {ALIGNS.map((a) => (
            <button key={a} className={'btn xs' + (a === align ? ' ember' : '')} onClick={() => setAlign(a)}>{a}</button>
          ))}
        </div>
        <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
          <Popover
            key={side + '-' + align}
            side={side}
            align={align}
            trigger={<button className="btn">Open popover</button>}
          >
            {({ close }) => (
              <>
                <PopoverHeader>{side} · {align}</PopoverHeader>
                <PopoverBody>
                  <p style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, margin: 0 }}>
                    Anchored using position:fixed + getBoundingClientRect. Flips when it would overflow the viewport.
                  </p>
                </PopoverBody>
              </>
            )}
          </Popover>
        </div>
      </div>
    );
  },
};

// ── With arrow ────────────────────────────────────────────────────────────────

export const WithArrow: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ padding: 80 }}>
        <Popover
          open={open}
          onOpenChange={setOpen}
          showArrow
          side="bottom"
          align="center"
          trigger={<button className="btn">Hover info</button>}
        >
          {({ close }) => (
            <>
              <PopoverHeader closeLabel="Close">Link preview</PopoverHeader>
              <PopoverBody>
                <p style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, margin: 0 }}>
                  Use the arrow to visually connect the panel to its trigger.
                </p>
              </PopoverBody>
            </>
          )}
        </Popover>
      </div>
    );
  },
};

// ── Rich content — profile card ───────────────────────────────────────────────

export const ProfileCard: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ padding: 80 }}>
        <Popover
          open={open}
          onOpenChange={setOpen}
          side="bottom"
          align="end"
          trigger={
            <button style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
              <span className="avatar lg ember" title="Ana Silva">AS</span>
            </button>
          }
        >
          {({ close }) => (
            <>
              <PopoverBody style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14 }}>
                <span className="avatar lg ember">AS</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, letterSpacing: '-0.005em' }}>Ana Silva</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginBottom: 8 }}>Platform engineer · GMT-3</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="pill"><span className="dot" />Online</span>
                    <span className="pill ember">Owner</span>
                  </div>
                </div>
              </PopoverBody>
              <PopoverFooter>
                <button className="btn xs ghost" onClick={close}>Cancel</button>
                <button className="btn xs">View profile</button>
                <button className="btn xs ember">Message</button>
              </PopoverFooter>
            </>
          )}
        </Popover>
      </div>
    );
  },
};

// ── Uncontrolled ──────────────────────────────────────────────────────────────

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <Popover
        defaultOpen={false}
        side="bottom"
        align="start"
        trigger={<button className="btn ghost">Filter</button>}
      >
        {({ close }) => (
          <>
            <PopoverHeader>Filter rows</PopoverHeader>
            <PopoverBody style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label className="pop-label">
                Status
                <select className="pop-input"><option>Any</option><option>Active</option><option>Archived</option></select>
              </label>
              <label className="pop-label">
                Owner
                <input className="pop-input" type="text" placeholder="ana@…" />
              </label>
            </PopoverBody>
            <PopoverFooter>
              <button className="btn xs ghost" onClick={close}>Reset</button>
              <button className="btn xs ember" onClick={close}>Apply</button>
            </PopoverFooter>
          </>
        )}
      </Popover>
    </div>
  ),
};

// ── RTL ───────────────────────────────────────────────────────────────────────

export const RTL: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div dir="rtl" style={{ padding: 80 }}>
        <Popover
          open={open}
          onOpenChange={setOpen}
          side="bottom"
          align="start"
          trigger={<button className="btn">الأبعاد</button>}
        >
          {({ close }) => (
            <>
              <PopoverHeader closeLabel="إغلاق">الأبعاد</PopoverHeader>
              <PopoverBody style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label className="pop-label">العرض<input className="pop-input" type="number" defaultValue={360} /></label>
                  <label className="pop-label">الارتفاع<input className="pop-input" type="number" defaultValue={220} /></label>
                </div>
              </PopoverBody>
              <PopoverFooter>
                <button className="btn xs ghost" onClick={close}>إلغاء</button>
                <button className="btn xs ember" onClick={close}>تطبيق</button>
              </PopoverFooter>
            </>
          )}
        </Popover>
      </div>
    );
  },
};

// ── In context — settings form in a product UI ────────────────────────────────

export const InContext: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [resolution, setResolution] = React.useState('1920×1080');
    return (
      <div style={{ padding: 40, minWidth: 360 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Export settings</span>
            <Popover
              open={open}
              onOpenChange={setOpen}
              side="bottom"
              align="end"
              trigger={
                <button className="btn xs">
                  Resolution: {resolution}
                </button>
              }
            >
              {({ close }) => (
                <>
                  <PopoverHeader>Choose resolution</PopoverHeader>
                  <PopoverBody style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {['720×480', '1280×720', '1920×1080', '3840×2160'].map((r) => (
                      <button
                        key={r}
                        className="btn xs ghost"
                        style={{ justifyContent: 'flex-start', fontFamily: 'var(--font-mono)', width: '100%' }}
                        onClick={() => { setResolution(r); close(); }}
                      >
                        {r === resolution ? '✓ ' : '  '}{r}
                      </button>
                    ))}
                  </PopoverBody>
                </>
              )}
            </Popover>
          </div>
          <div style={{ padding: '14px', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
            Output format: H.264 · Quality: High · Audio: AAC 192kbps
          </div>
        </div>
      </div>
    );
  },
};
