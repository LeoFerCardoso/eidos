import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sidebar,
  SidebarSection,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
  Icons,
  ForgeMark,
} from '@eidos/ui';

const meta = {
  title: 'Blocks/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Collapsible vertical navigation rail for app shells. Supports icon-only ' +
          'collapse (56 px rail with tooltips), off-canvas overlay mode, collapsible ' +
          'section groups, trailing count badges, and a pinned footer slot. ' +
          'All positioning uses logical CSS props so RTL layouts flip automatically.',
      },
    },
  },
  args: {
    collapsible: 'icon',
    side: 'start',
    defaultOpen: true,
  },
  argTypes: {
    collapsible: { control: 'inline-radio', options: ['icon', 'offcanvas', 'none'] },
    side: { control: 'inline-radio', options: ['start', 'end'] },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared shell wrapper ─────────────────────────────────────────────────────

interface ShellProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  dir?: string;
}

const Shell = ({ children, width = 600, height = 400, dir = 'ltr' }: ShellProps) => (
  <div
    dir={dir}
    style={{
      display: 'flex',
      alignItems: 'stretch',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      width,
      height,
      background: 'var(--bg)',
      position: 'relative',
    }}
  >
    {children}
  </div>
);

const MainArea = ({ children }: { children?: React.ReactNode }) => (
  <div
    style={{
      flex: 1,
      padding: 24,
      borderInlineStart: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    {children}
  </div>
);

// ── Story: Expanded ──────────────────────────────────────────────────────────

/**
 * Expanded rail — 232 px wide, showing icons, labels, and a trailing badge count.
 * The active item is highlighted. Sections use muted mono headings to organise
 * items into named groups. Collapse the rail with the toggle button.
 */
export const Expanded: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Shell>
        <Sidebar
          collapsible="icon"
          open={open}
          onOpenChange={setOpen}
          style={{ height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 10px 18px' }}>
            <ForgeMark size={20} />
            {open && <span style={{ fontWeight: 700, fontSize: 'var(--text-md)', letterSpacing: '-0.01em' }}>Eidos Studio</span>}
          </div>

          <SidebarSection label="Workspace">
            <SidebarItem icon={<Icons.home size={14} />} active href="#">
              Home
            </SidebarItem>
            <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#">
              Services
            </SidebarItem>
            <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#">
              Deployments
            </SidebarItem>
            <SidebarItem icon={<Icons.doc size={14} />} href="#">
              Logs
            </SidebarItem>
            <SidebarItem icon={<Icons.bell size={14} />} badge={7} href="#">
              Alerts
            </SidebarItem>
          </SidebarSection>

          <SidebarSection label="Account">
            <SidebarItem icon={<Icons.settings size={14} />} href="#">
              Settings
            </SidebarItem>
            <SidebarItem icon={<Icons.user size={14} />} href="#">
              Team
            </SidebarItem>
          </SidebarSection>

          <SidebarFooter>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
                  color: 'var(--ember-fg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 11, flexShrink: 0,
                }}
              >
                AL
              </div>
              {open && (
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Ada Lovelace
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>
                    ada@eidos
                  </div>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Home</span>
          <span style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
            Click the toggle at the bottom of the rail to collapse to icon-only mode.
            Badges remain visible in both states.
          </span>
        </MainArea>
      </Shell>
    );
  },
};

// ── Story: Collapsed ─────────────────────────────────────────────────────────

/**
 * Icon rail (collapsed) — 56 px. Labels are hidden; hover over any item to see
 * the tooltip. Badges are suppressed to reduce clutter. The active item retains
 * its ember accent. Toggle to expand.
 */
export const Collapsed: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Shell>
        <Sidebar
          collapsible="icon"
          open={open}
          onOpenChange={setOpen}
          style={{ height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0 18px' }}>
            <ForgeMark size={20} />
          </div>

          <SidebarSection label="Workspace">
            <SidebarItem icon={<Icons.home size={14} />} active tooltip="Home" href="#" />
            <SidebarItem icon={<Icons.cpu size={14} />} badge={12} tooltip="Services" href="#" />
            <SidebarItem icon={<Icons.rocket size={14} />} badge={3} tooltip="Deployments" href="#" />
            <SidebarItem icon={<Icons.doc size={14} />} tooltip="Logs" href="#" />
            <SidebarItem icon={<Icons.bell size={14} />} badge={7} tooltip="Alerts" href="#" />
          </SidebarSection>

          <SidebarSection label="Account">
            <SidebarItem icon={<Icons.settings size={14} />} tooltip="Settings" href="#" />
            <SidebarItem icon={<Icons.user size={14} />} tooltip="Team" href="#" />
          </SidebarSection>

          <SidebarFooter>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
                  color: 'var(--ember-fg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 11, cursor: 'pointer',
                }}
                title="Ada Lovelace"
              >
                AL
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Icon rail</span>
          <span style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
            Hover over any icon to see its tooltip label. The active item (Home) keeps its ember accent.
            Click the expand button to restore full labels.
          </span>
        </MainArea>
      </Shell>
    );
  },
};

// ── Story: NonCollapsible ────────────────────────────────────────────────────

/**
 * Non-collapsible (`collapsible="none"`) — the rail is always expanded and renders
 * no collapse controls. Use when there is no toggle affordance and the layout always
 * has room for full labels (e.g. fixed desktop shells, the docs-site nav).
 */
export const NonCollapsible: Story = {
  render: () => (
    <Shell>
      <Sidebar collapsible="none" style={{ height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 10px 18px' }}>
          <ForgeMark size={20} />
          <span style={{ fontWeight: 700, fontSize: 'var(--text-md)', letterSpacing: '-0.01em' }}>Eidos Studio</span>
        </div>

        <SidebarSection label="Workspace">
          <SidebarItem icon={<Icons.home size={14} />} active href="#">Home</SidebarItem>
          <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#">Services</SidebarItem>
          <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#">Deployments</SidebarItem>
          <SidebarItem icon={<Icons.doc size={14} />} href="#">Logs</SidebarItem>
        </SidebarSection>

        <SidebarSection label="Account">
          <SidebarItem icon={<Icons.settings size={14} />} href="#">Settings</SidebarItem>
          <SidebarItem icon={<Icons.user size={14} />} href="#">Team</SidebarItem>
        </SidebarSection>

        <SidebarFooter>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))', color: 'var(--ember-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>AL</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Ada Lovelace</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>ada@eidos</div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <MainArea>
        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Home</span>
        <span style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
          No collapse toggle is rendered — the rail stays at its full width. Use this mode when
          the shell always reserves space for the nav and labels.
        </span>
      </MainArea>
    </Shell>
  ),
};

// ── Story: CollapsibleGroups ─────────────────────────────────────────────────

/**
 * Collapsible groups — sections can contain named groups that collapse
 * independently. "Observability" starts collapsed; click its header to expand.
 * Groups become icon-passthrough in collapsed rail mode.
 */
export const CollapsibleGroups: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Shell height={460}>
        <Sidebar
          collapsible="icon"
          open={open}
          onOpenChange={setOpen}
          style={{ height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 10px 18px' }}>
            <ForgeMark size={20} />
            {open && <span style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>Eidos Studio</span>}
          </div>

          <SidebarSection label="Platform">
            <SidebarGroup label="Infrastructure">
              <SidebarItem icon={<Icons.cpu size={14} />} active href="#">Services</SidebarItem>
              <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#">Deployments</SidebarItem>
              <SidebarItem icon={<Icons.layers size={14} />} href="#">Environments</SidebarItem>
            </SidebarGroup>
            <SidebarGroup label="Observability" defaultCollapsed>
              <SidebarItem icon={<Icons.doc size={14} />} href="#">Logs</SidebarItem>
              <SidebarItem icon={<Icons.bell size={14} />} badge={7} href="#">Alerts</SidebarItem>
              <SidebarItem icon={<Icons.activity size={14} />} href="#">Metrics</SidebarItem>
            </SidebarGroup>
            <SidebarGroup label="Security">
              <SidebarItem icon={<Icons.shield size={14} />} href="#">Policies</SidebarItem>
              <SidebarItem icon={<Icons.lock size={14} />} href="#">Secrets</SidebarItem>
            </SidebarGroup>
          </SidebarSection>

          <SidebarSection label="Admin">
            <SidebarItem icon={<Icons.settings size={14} />} href="#">Settings</SidebarItem>
          </SidebarSection>

          <SidebarFooter>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))', color: 'var(--ember-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>AL</div>
              {open && <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Ada Lovelace</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>ada@eidos</div></div>}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Platform</span>
          <span style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
            Groups collapse independently. "Observability" starts closed — click its label to expand.
            Collapsing the rail collapses all group labels and shows icons only.
          </span>
        </MainArea>
      </Shell>
    );
  },
};

// ── Story: WithFooter ────────────────────────────────────────────────────────

/**
 * With user footer — pinned footer slot showing the signed-in user's avatar,
 * name, and workspace handle. Stays pinned as content grows. The footer adapts
 * to icon-only mode: only the avatar is shown when collapsed.
 */
export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Shell height={420}>
        <Sidebar
          collapsible="icon"
          open={open}
          onOpenChange={setOpen}
          style={{ height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 10px 18px' }}>
            <ForgeMark size={20} />
            {open && <span style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>Eidos Studio</span>}
          </div>

          <SidebarSection label="Workspace">
            <SidebarItem icon={<Icons.home size={14} />} active href="#">Home</SidebarItem>
            <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#">Services</SidebarItem>
            <SidebarItem icon={<Icons.rocket size={14} />} href="#">Deployments</SidebarItem>
          </SidebarSection>

          <SidebarSection label="Account">
            <SidebarItem icon={<Icons.settings size={14} />} href="#">Settings</SidebarItem>
            <SidebarItem icon={<Icons.user size={14} />} href="#">Team</SidebarItem>
          </SidebarSection>

          <SidebarFooter>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px',
                cursor: 'pointer', borderRadius: 6,
                transition: 'background var(--dur-fast) var(--ease)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-hover)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
                  color: 'var(--ember-fg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}
              >
                RF
              </div>
              {open && (
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Rafael Mendonça
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    acme-workspace
                  </div>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Services</span>
          <span style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
            The footer is pinned regardless of content height. In icon-only mode only the avatar is shown.
            The footer item is a hover-tinted button for account menus.
          </span>
        </MainArea>
      </Shell>
    );
  },
};

// ── Story: OffCanvas ─────────────────────────────────────────────────────────

/**
 * Off-canvas / mobile — the sidebar slides in from the start edge as a full-height
 * overlay. A scrim covers the content area. Clicking the scrim or pressing Escape
 * closes the drawer. Typically triggered by a hamburger button in the topbar.
 */
export const OffCanvas: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'column',
          width: 480, height: 400,
          border: '1px solid var(--border)', borderRadius: 10,
          overflow: 'hidden', background: 'var(--bg)', position: 'relative',
        }}
      >
        {/* Topbar */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '0 16px', height: 44,
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)', flexShrink: 0,
          }}
        >
          <button
            className="btn icon ghost sm"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Icons.menu size={14} />
          </button>
          <ForgeMark size={18} />
          <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>App Shell</span>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: 20, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6, position: 'relative' }}>
          Click the menu icon in the topbar to open the off-canvas sidebar.
          A scrim covers this area and clicking it closes the panel.

          <Sidebar
            collapsible="offcanvas"
            open={open}
            onOpenChange={setOpen}
            style={{ height: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 10px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ForgeMark size={20} />
                <span style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>Eidos Studio</span>
              </div>
            </div>

            <SidebarSection label="Workspace">
              <SidebarItem icon={<Icons.home size={14} />} active href="#" onClick={() => setOpen(false)}>Home</SidebarItem>
              <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#" onClick={() => setOpen(false)}>Services</SidebarItem>
              <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#" onClick={() => setOpen(false)}>Deployments</SidebarItem>
              <SidebarItem icon={<Icons.doc size={14} />} href="#" onClick={() => setOpen(false)}>Logs</SidebarItem>
              <SidebarItem icon={<Icons.bell size={14} />} badge={7} href="#" onClick={() => setOpen(false)}>Alerts</SidebarItem>
            </SidebarSection>

            <SidebarSection label="Account">
              <SidebarItem icon={<Icons.settings size={14} />} href="#" onClick={() => setOpen(false)}>Settings</SidebarItem>
            </SidebarSection>

            <SidebarFooter>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))', color: 'var(--ember-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>AL</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Ada Lovelace</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>ada@eidos</div>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
        </div>
      </div>
    );
  },
};

// ── Story: RTL ───────────────────────────────────────────────────────────────

/**
 * RTL layout — `dir="rtl"` on the shell. The rail docks to the inline-end
 * (right) edge. Section headings, item labels, and badges mirror. All achieved
 * via logical CSS properties with zero overrides.
 */
export const RTL: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <Shell dir="rtl">
        <Sidebar
          collapsible="icon"
          open={open}
          onOpenChange={setOpen}
          style={{ height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 10px 18px' }}>
            <ForgeMark size={20} />
            {open && <span style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>Eidos Studio</span>}
          </div>

          <SidebarSection label="مساحة العمل">
            <SidebarItem icon={<Icons.home size={14} />} active href="#">الرئيسية</SidebarItem>
            <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#">الخدمات</SidebarItem>
            <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#">عمليات النشر</SidebarItem>
            <SidebarItem icon={<Icons.doc size={14} />} href="#">السجلات</SidebarItem>
          </SidebarSection>

          <SidebarSection label="الحساب">
            <SidebarItem icon={<Icons.settings size={14} />} href="#">الإعدادات</SidebarItem>
            <SidebarItem icon={<Icons.user size={14} />} href="#">الفريق</SidebarItem>
          </SidebarSection>

          <SidebarFooter>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))', color: 'var(--ember-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>ن م</div>
              {open && (
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>نور محمد</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>nour@eidos</div>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>الرئيسية</span>
          <span style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
            اتجاه RTL — يرسو الرصيف على الحافة اليمنى تلقائياً بفضل الخصائص المنطقية. لا تعديلات يدوية مطلوبة.
          </span>
        </MainArea>
      </Shell>
    );
  },
};

// ── Story: InContext ─────────────────────────────────────────────────────────

/**
 * In-context app shell — topbar + sidebar + content area. The topbar toggle
 * button and the rail's own toggle both share state so either can collapse
 * the sidebar. Realistic product layout.
 */
export const InContext: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [active, setActive] = React.useState('Home');
    const navItems = [
      { label: 'Home', icon: <Icons.home size={14} />, badge: undefined as number | undefined },
      { label: 'Services', icon: <Icons.cpu size={14} />, badge: 12 },
      { label: 'Deployments', icon: <Icons.rocket size={14} />, badge: 3 },
      { label: 'Logs', icon: <Icons.doc size={14} />, badge: undefined },
      { label: 'Alerts', icon: <Icons.bell size={14} />, badge: 7 },
    ];
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'column',
          width: 680, height: 440,
          border: '1px solid var(--border)', borderRadius: 10,
          overflow: 'hidden', background: 'var(--bg)',
        }}
      >
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: 44, borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', flexShrink: 0 }}>
          <button className="btn icon ghost sm" aria-label="Toggle sidebar" onClick={() => setOpen((o) => !o)}>
            <Icons.panelLeft size={14} />
          </button>
          <ForgeMark size={18} />
          <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Eidos Studio</span>
          <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn icon ghost sm" aria-label="Search"><Icons.search size={14} /></button>
            <button className="btn icon ghost sm" aria-label="Notifications"><Icons.bell size={14} /></button>
          </div>
        </div>
        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar collapsible="icon" open={open} onOpenChange={setOpen} style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 10px 16px' }}>
              {open && <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Workspace</span>}
            </div>

            <SidebarSection>
              {navItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  icon={item.icon}
                  active={active === item.label}
                  badge={item.badge}
                  href="#"
                  tooltip={item.label}
                  onClick={(e) => { e.preventDefault(); setActive(item.label); }}
                >
                  {item.label}
                </SidebarItem>
              ))}
            </SidebarSection>

            <SidebarSection label="Admin">
              <SidebarItem icon={<Icons.settings size={14} />} tooltip="Settings" href="#">Settings</SidebarItem>
            </SidebarSection>

            <SidebarFooter>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))', color: 'var(--ember-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>AL</div>
                {open && (
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ada Lovelace</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>ada@eidos</div>
                  </div>
                )}
              </div>
            </SidebarFooter>
          </Sidebar>
          {/* Content */}
          <main style={{ flex: 1, padding: 24, borderInlineStart: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
            <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700 }}>{active}</h2>
            <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
              Topbar toggle and the rail's own button share state — either collapses the sidebar.
              Click nav items to change the active state.
            </p>
          </main>
        </div>
      </div>
    );
  },
};
