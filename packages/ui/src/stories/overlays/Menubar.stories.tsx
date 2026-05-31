import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@forge/ui';
import { Icons } from '@forge/ui';

const meta = {
  title: 'Overlays/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Horizontal application menu bar (File · Edit · View · Help). ' +
          'role=menubar with roving tabindex; ArrowLeft/Right move between top menus, ' +
          'ArrowDown opens a menu, Up/Down navigate items; ESC closes and returns focus. ' +
          'Direction-aware anchoring for RTL. Type-ahead in both the bar and open panels.',
      },
    },
  },
  args: {
    loop: true,
    dir: 'ltr',
  },
  argTypes: {
    loop: { control: 'boolean', description: 'Arrow-key navigation wraps around.' },
    dir: { control: 'inline-radio', options: ['ltr', 'rtl'], description: 'Reading direction.' },
  },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared menu data ──────────────────────────────────────────────────────────

const FileMenu = () => (
  <MenubarMenu value="File">
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem icon={<Icons.plus size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'N'}</MenubarShortcut>}>
        New project
      </MenubarItem>
      <MenubarItem icon={<Icons.folder size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'O'}</MenubarShortcut>}>
        Open project…
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem icon={<Icons.upload size={13} />}>Import…</MenubarItem>
      <MenubarItem icon={<Icons.download size={13} />}>Export…</MenubarItem>
      <MenubarSeparator />
      <MenubarItem icon={<Icons.enter size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'Q'}</MenubarShortcut>}>
        Sign out
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
);

const EditMenu = () => (
  <MenubarMenu value="Edit">
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem icon={<Icons.undo size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'Z'}</MenubarShortcut>}>
        Undo
      </MenubarItem>
      <MenubarItem icon={<Icons.redo size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'⇧'}{'Z'}</MenubarShortcut>}>
        Redo
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'X'}</MenubarShortcut>}>Cut</MenubarItem>
      <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'C'}</MenubarShortcut>}>Copy</MenubarItem>
      <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'V'}</MenubarShortcut>}>Paste</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
);

const ViewMenu = () => (
  <MenubarMenu value="View">
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarItem icon={<Icons.panelLeft size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'\\'}  </MenubarShortcut>}>
        Toggle sidebar
      </MenubarItem>
      <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'='}</MenubarShortcut>}>Zoom in</MenubarItem>
      <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'−'}</MenubarShortcut>}>Zoom out</MenubarItem>
      <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'0'}</MenubarShortcut>}>Reset zoom</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
);

const HelpMenu = () => (
  <MenubarMenu value="Help">
    <MenubarTrigger>Help</MenubarTrigger>
    <MenubarContent>
      <MenubarItem icon={<Icons.book size={13} />}>Documentation</MenubarItem>
      <MenubarItem icon={<Icons.command size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'/'}</MenubarShortcut>}>
        Keyboard shortcuts
      </MenubarItem>
      <MenubarItem icon={<Icons.alert size={13} />}>Send feedback</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
);

// ── Stories ───────────────────────────────────────────────────────────────────

/** Full four-menu bar — click to open, hover to switch, ESC to close. */
export const Default: Story = {
  render: (args) => (
    <Menubar {...args}>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
      <HelpMenu />
    </Menubar>
  ),
};

/** Single two-menu bar — minimal hello-world. */
export const TwoMenus: Story = {
  render: (args) => (
    <Menubar {...args}>
      <FileMenu />
      <EditMenu />
    </Menubar>
  ),
};

/** Disabled items — aria-disabled set, no pointer events. */
export const WithDisabledItems: Story = {
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu value="Edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem icon={<Icons.undo size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'Z'}</MenubarShortcut>}>
            Undo
          </MenubarItem>
          <MenubarItem
            icon={<Icons.redo size={13} />}
            shortcut={<MenubarShortcut>{'⌘'}{'⇧'}{'Z'}</MenubarShortcut>}
            disabled
          >
            Redo
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'X'}</MenubarShortcut>} disabled>Cut</MenubarItem>
          <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'C'}</MenubarShortcut>}>Copy</MenubarItem>
          <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'V'}</MenubarShortcut>}>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/** RTL — menus reverse; panels anchor to the start (right) edge. */
export const RTL: Story = {
  render: (args) => (
    <div dir="rtl">
      <Menubar {...args} dir="rtl">
        <MenubarMenu value="ملف">
          <MenubarTrigger>ملف</MenubarTrigger>
          <MenubarContent>
            <MenubarItem icon={<Icons.plus size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'N'}</MenubarShortcut>}>
              مشروع جديد
            </MenubarItem>
            <MenubarItem icon={<Icons.folder size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'O'}</MenubarShortcut>}>
              فتح مشروع…
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem icon={<Icons.enter size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'Q'}</MenubarShortcut>}>
              تسجيل الخروج
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="تحرير">
          <MenubarTrigger>تحرير</MenubarTrigger>
          <MenubarContent>
            <MenubarItem icon={<Icons.undo size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'Z'}</MenubarShortcut>}>
              تراجع
            </MenubarItem>
            <MenubarItem icon={<Icons.redo size={13} />} shortcut={<MenubarShortcut>{'⌘'}{'⇧'}{'Z'}</MenubarShortcut>}>
              إعادة
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="عرض">
          <MenubarTrigger>عرض</MenubarTrigger>
          <MenubarContent>
            <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'='}</MenubarShortcut>}>تكبير</MenubarItem>
            <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'−'}</MenubarShortcut>}>تصغير</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  ),
};

/** In context — menubar inside a realistic workspace shell topbar. */
export const InContext: Story = {
  render: (args) => (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        background: 'var(--surface)',
        width: '100%',
        maxWidth: 700,
      }}
    >
      {/* Shell topbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>Forge Studio</span>
          <Menubar {...args}>
            <FileMenu />
            <EditMenu />
            <ViewMenu />
            <HelpMenu />
          </Menubar>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn icon ghost sm" aria-label="Help">
            <Icons.info size={12} />
          </button>
          <button className="btn icon ghost sm" aria-label="User account">
            <Icons.user size={12} />
          </button>
        </div>
      </div>
      {/* Canvas area */}
      <div
        style={{
          padding: 22,
          color: 'var(--fg-muted)',
          fontSize: 'var(--text-base)',
          minHeight: 80,
        }}
      >
        Menubar lives in the workspace shell. Each trigger opens a panel anchored below it.
      </div>
    </div>
  ),
};
