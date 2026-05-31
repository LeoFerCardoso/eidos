import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Icons,
} from '@forge/ui';

const meta = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A portalled command list anchored to any trigger. role=menu with roving tabindex, ' +
          'type-ahead, direction-aware positioning — no Radix, no CVA.',
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">Actions</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Open</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// ── With icons and shortcuts ──────────────────────────────────────────────────

export const WithIconsAndShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">File actions</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem icon={Icons.eye}      shortcut="↩">Open</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.edit}     shortcut="⌘E">Rename</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.copy}     shortcut="⌘D">Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.download} shortcut="⌘S">Download</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.link}     shortcut="⌘⇧C">Copy link</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.trash} variant="destructive" shortcut="⌫">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// ── Account menu (end-aligned) ────────────────────────────────────────────────

export const AccountMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">
        <Icons.user size={13} /> Ana Silva <Icons.chevronDown size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem icon={Icons.settings} shortcut="⌘,">Settings</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.bell}>Notifications</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuItem icon={Icons.sun}>Light</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.moon}>Dark</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.x} variant="destructive" shortcut="⌘⇧Q">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// ── Checkbox items ────────────────────────────────────────────────────────────

export const CheckboxItems: Story = {
  render: () => {
    const [view, setView] = React.useState({ grid: true, ruler: false, lines: true });
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="btn">View</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Display</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={view.grid}
            onCheckedChange={(v) => setView((s) => ({ ...s, grid: v }))}
          >
            Grid
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={view.ruler}
            onCheckedChange={(v) => setView((s) => ({ ...s, ruler: v }))}
          >
            Ruler
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={view.lines}
            onCheckedChange={(v) => setView((s) => ({ ...s, lines: v }))}
          >
            Guidelines
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

// ── Radio items ───────────────────────────────────────────────────────────────

export const RadioItems: Story = {
  render: () => {
    const [sort, setSort] = React.useState('name-asc');
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="btn">Sort by</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Sort order</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="name-asc">Name (A → Z)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name-desc">Name (Z → A)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date-desc">Date modified</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="size-desc">File size</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

// ── Disabled items ────────────────────────────────────────────────────────────

export const WithDisabled: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">Actions</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem icon={Icons.eye}>Open</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.edit}>Rename</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.copy} disabled>Duplicate (unavailable)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.trash} variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// ── In context — toolbar ──────────────────────────────────────────────────────

export const InContext: Story = {
  render: () => {
    const [sort, setSort] = React.useState('date-desc');
    return (
      <div
        className="surface"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 8,
          gap: 12,
          minWidth: 360,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>
          my-project / src
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <DropdownMenu>
            <DropdownMenuTrigger className="btn sm outline">
              Sort <Icons.chevronDown size={11} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort order</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="name-asc">Name (A → Z)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date-desc">Date modified</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size-desc">File size</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="btn sm icon">
              <Icons.more size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem icon={Icons.download}>Download</DropdownMenuItem>
              <DropdownMenuItem icon={Icons.link}>Copy link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Icons.trash} variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  },
};

// ── RTL ───────────────────────────────────────────────────────────────────────

export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger className="btn">
          الإجراءات <Icons.chevronDown size={12} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem icon={Icons.eye}    shortcut="↩">فتح</DropdownMenuItem>
          <DropdownMenuItem icon={Icons.edit}   shortcut="⌘E">إعادة تسمية</DropdownMenuItem>
          <DropdownMenuItem icon={Icons.copy}   shortcut="⌘D">تكرار</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={Icons.trash} variant="destructive" shortcut="⌫">حذف</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
