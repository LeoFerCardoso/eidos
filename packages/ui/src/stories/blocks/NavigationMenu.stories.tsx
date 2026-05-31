import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@eidos/ui';

const meta = {
  title: 'Elements/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Horizontal site navigation bar with optional dropdown content panels. ' +
          'Top items form a single roving tab-stop (plain list, no menubar role). ' +
          'ArrowLeft/Right navigate between items; ArrowDown/Enter opens a panel; ' +
          'focus moves to the first panel link. Tab/Shift+Tab cycle within the panel. ' +
          'Escape closes the panel and returns focus to the trigger.',
      },
    },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Basic top-level link bar with an active item. */
export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuLink href="#" active>
          Home
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Catalog</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Deploys</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Runbooks</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  ),
};

/** Items with dropdown content panels — hover or ArrowDown to open. */
export const WithDropdownPanels: Story = {
  render: () => {
    const [open, setOpen] = React.useState('');
    return (
      <div style={{ minHeight: 260 }}>
        <NavigationMenu value={open} onValueChange={setOpen}>
          <NavigationMenuItem id="platform">
            <NavigationMenuLink href="#">Platform</NavigationMenuLink>
            <NavigationMenuContent>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 4,
                  padding: 12,
                  minWidth: 320,
                }}
              >
                {[
                  ['Catalog', 'Browse all services'],
                  ['Deploys', 'Recent pipeline runs'],
                  ['Runbooks', 'Incident playbooks'],
                  ['SLOs', 'Reliability targets'],
                ].map(([label, desc]) => (
                  <a
                    key={label}
                    href="#"
                    className="nm-panel-item"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="nm-panel-item-label">{label}</span>
                    <span className="nm-panel-item-desc">{desc}</span>
                  </a>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem id="ops">
            <NavigationMenuLink href="#">Operations</NavigationMenuLink>
            <NavigationMenuContent>
              <div style={{ padding: 12, minWidth: 200 }}>
                {['GMUDs', 'Incidents', 'On-call', 'Alerts'].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="nm-panel-item"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="nm-panel-item-label">{label}</span>
                  </a>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink href="#" active>
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      </div>
    );
  },
};

/** No delay — panel opens instantly on hover. */
export const NoDelay: Story = {
  render: () => {
    const [open, setOpen] = React.useState('');
    return (
      <div style={{ minHeight: 180 }}>
        <NavigationMenu value={open} onValueChange={setOpen} delayDuration={0}>
          <NavigationMenuItem id="fast-platform">
            <NavigationMenuLink href="#">Platform</NavigationMenuLink>
            <NavigationMenuContent>
              <div style={{ padding: 12, minWidth: 200 }}>
                {['Catalog', 'Deploys', 'Runbooks'].map((label) => (
                  <a key={label} href="#" className="nm-panel-item" onClick={(e) => e.preventDefault()}>
                    <span className="nm-panel-item-label">{label}</span>
                  </a>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      </div>
    );
  },
};

/** RTL — panels anchor to the correct edge; the bar reads right-to-left. */
export const RTL: Story = {
  render: () => {
    const [open, setOpen] = React.useState('');
    return (
      <div dir="rtl" style={{ minHeight: 180 }}>
        <NavigationMenu value={open} onValueChange={setOpen}>
          <NavigationMenuItem id="rtl-platform">
            <NavigationMenuLink href="#" active>
              الرئيسية
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem id="rtl-ops">
            <NavigationMenuLink href="#">المنصّة</NavigationMenuLink>
            <NavigationMenuContent>
              <div style={{ padding: 12, minWidth: 200 }}>
                {['الكتالوج', 'عمليات النشر', 'كتب التشغيل'].map((label) => (
                  <a key={label} href="#" className="nm-panel-item" onClick={(e) => e.preventDefault()}>
                    <span className="nm-panel-item-label">{label}</span>
                  </a>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">العمليات</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      </div>
    );
  },
};

/** In context — navigation bar inside a minimal app shell header. */
export const InContext: Story = {
  render: () => {
    const [active, setActive] = React.useState('home');
    return (
      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* Topbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            height: 44,
            borderBottom: '1px solid var(--border)',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              color: 'var(--ember)',
              marginInlineEnd: 12,
            }}
          >
            Forge
          </span>
          <NavigationMenu>
            {[
              { id: 'home', label: 'Home' },
              { id: 'catalog', label: 'Catalog' },
              { id: 'deploys', label: 'Deploys' },
              { id: 'runbooks', label: 'Runbooks' },
            ].map((item) => (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuLink
                  href="#"
                  active={active === item.id}
                  onClick={(e) => { e.preventDefault(); setActive(item.id); }}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenu>
          <span
            style={{
              marginInlineStart: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--fg-subtle)',
              padding: '2px 6px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 4,
            }}
          >
            ⌘K
          </span>
        </div>
        {/* Page content placeholder */}
        <div style={{ padding: '20px 16px', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>
          Active: <strong style={{ color: 'var(--fg)' }}>{active}</strong>
        </div>
      </div>
    );
  },
};
