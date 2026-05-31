'use client';
// Eidos DS — Components / Menubar
// Section order (DS-PAGE-STANDARD §2.2):
//   1. Installation
//   2. Usage
//   3. Examples divider  →  Full menubar · In context
//   4. Accessibility
//   5. RTL
//   6. Anatomy
//   7. Decision matrix (Menubar vs Dropdown vs Toolbar)
//   8. Do / Don't
//   9. API reference
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, Lede, Mono, PropsTable, AutoPropsTable,
  TabbedCode, installTabs,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@/ds/core';

// ── Menu data for demos ───────────────────────────────────────────────────────

const FILE_ITEMS = [
  { label: 'New project',   icon: Icons.plus,     kbd: ['⌘','N'] },
  { label: 'Open project…', icon: Icons.folder,   kbd: ['⌘','O'] },
  { sep: true },
  { label: 'Import…',       icon: Icons.upload },
  { label: 'Export…',       icon: Icons.download },
  { sep: true },
  { label: 'Sign out',      icon: Icons.enter,    kbd: ['⌘','Q'] },
] as const;

const EDIT_ITEMS = [
  { label: 'Undo', icon: Icons.undo, kbd: ['⌘','Z'] },
  { label: 'Redo', icon: Icons.redo, kbd: ['⌘','⇧','Z'] },
  { sep: true },
  { label: 'Cut',   kbd: ['⌘','X'] },
  { label: 'Copy',  kbd: ['⌘','C'] },
  { label: 'Paste', kbd: ['⌘','V'] },
] as const;

const VIEW_ITEMS = [
  { label: 'Toggle sidebar', icon: Icons.panelLeft, kbd: ['⌘','\\'] },
  { label: 'Zoom in',        kbd: ['⌘','='] },
  { label: 'Zoom out',       kbd: ['⌘','−'] },
  { label: 'Reset zoom',     kbd: ['⌘','0'] },
] as const;

const HELP_ITEMS = [
  { label: 'Documentation',     icon: Icons.book },
  { label: 'Keyboard shortcuts', icon: Icons.command, kbd: ['⌘','/'] },
  { label: 'Send feedback',     icon: Icons.alert },
] as const;

type AnyItem = { sep: true } | { label: string; icon?: React.ComponentType<{ size?: number }>; kbd?: readonly string[]; sep?: never };

function DemoMenu({
  label,
  items,
}: {
  label: string;
  items: readonly AnyItem[];
}) {
  return (
    <MenubarMenu value={label}>
      <MenubarTrigger>{label}</MenubarTrigger>
      <MenubarContent>
        {(items as AnyItem[]).map((it, i) => {
          if ('sep' in it && it.sep) return <MenubarSeparator key={'s' + i} />;
          const row = it as { label: string; icon?: React.ComponentType<{ size?: number }>; kbd?: readonly string[] };
          const IconEl = row.icon;
          return (
            <MenubarItem
              key={row.label}
              icon={IconEl ? <IconEl size={13} /> : undefined}
              shortcut={
                row.kbd ? (
                  <MenubarShortcut>
                    {row.kbd.map((k, j) => <kbd key={j} className="kbd">{k}</kbd>)}
                  </MenubarShortcut>
                ) : undefined
              }
            >
              {row.label}
            </MenubarItem>
          );
        })}
      </MenubarContent>
    </MenubarMenu>
  );
}

const USAGE_CODE = `import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarItem, MenubarSeparator, MenubarShortcut,
} from "@/components/forge/menubar"

export function Demo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'N'}</MenubarShortcut>}>
            New project
          </MenubarItem>
          <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'O'}</MenubarShortcut>}>
            Open…
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'S'}</MenubarShortcut>}>
            Save
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'Z'}</MenubarShortcut>}>Undo</MenubarItem>
          <MenubarItem shortcut={<MenubarShortcut>{'⌘'}{'⇧'}{'Z'}</MenubarShortcut>}>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MenubarPage() {
  return (
    <Section
      id="menubar"
      title="Menubar"
      desc="A horizontal row of top-level menus (File · Edit · View · Help) — the desktop pattern. Use it on dense workspaces that already have a familiar mental model."
    >
      {/* ===================================================================
          1. INSTALLATION
          =================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('menubar')} ariaLabel="package manager" />
      <Lede>
        Eidos's Menubar handles the full WAI-ARIA menubar keyboard model — roving tabindex across triggers, type-ahead in both the bar and panels, and correct arrow/Escape handling — as plain React over the Eidos CSS layer. No Radix runtime. The CLI ships <Mono>menubar.tsx</Mono>; pick <em>Manual</em> to copy the file yourself.
      </Lede>

      {/* ===================================================================
          2. USAGE
          =================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic — two menus" code={USAGE_CODE}>
        <Menubar>
          <DemoMenu label="File" items={FILE_ITEMS.slice(0, 3)} />
          <DemoMenu label="Edit" items={EDIT_ITEMS} />
        </Menubar>
      </Frame>

      {/* ===================================================================
          EXAMPLES divider
          =================================================================== */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 'var(--space-8)', marginBlockEnd: 'var(--space-2)' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }} />
      </div>

      {/* ===================================================================
          3a. FULL MENUBAR
          =================================================================== */}
      <SubHead meta="all four menus">Full menubar</SubHead>
      <Frame
        label="click to open · hover to switch · ESC to close · Arrow keys navigate"
        code={`<Menubar>
  <MenubarMenu value="File">
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>{/* New / Open / Import / Export / Sign out */}</MenubarContent>
  </MenubarMenu>
  <MenubarMenu value="Edit"><MenubarTrigger>Edit</MenubarTrigger>{/* … */}</MenubarMenu>
  <MenubarMenu value="View"><MenubarTrigger>View</MenubarTrigger>{/* … */}</MenubarMenu>
  <MenubarMenu value="Help"><MenubarTrigger>Help</MenubarTrigger>{/* … */}</MenubarMenu>
</Menubar>`}
      >
        <Menubar>
          <DemoMenu label="File"  items={FILE_ITEMS} />
          <DemoMenu label="Edit"  items={EDIT_ITEMS} />
          <DemoMenu label="View"  items={VIEW_ITEMS} />
          <DemoMenu label="Help"  items={HELP_ITEMS} />
        </Menubar>
      </Frame>

      {/* ===================================================================
          3b. IN CONTEXT
          =================================================================== */}
      <SubHead meta="real shell">In context</SubHead>
      <Frame label="paired with a workspace topbar">
        <div style={{ inlineSize: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: 'var(--space-2)', paddingInline: 'var(--space-3)', borderBlockEnd: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>Eidos Studio</span>
              <Menubar>
                <DemoMenu label="File"  items={FILE_ITEMS} />
                <DemoMenu label="Edit"  items={EDIT_ITEMS} />
                <DemoMenu label="View"  items={VIEW_ITEMS} />
                <DemoMenu label="Help"  items={HELP_ITEMS} />
              </Menubar>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button className="btn icon ghost sm" aria-label="Help"><Icons.info size={12} /></button>
              <button className="btn icon ghost sm" aria-label="User account"><Icons.user size={12} /></button>
            </div>
          </div>
          <div className="t-small" style={{ padding: 'var(--space-6)', color: 'var(--fg-muted)' }}>
            The menubar lives in the workspace shell. Each trigger opens a panel anchored below it. Keep depth shallow — at most one submenu level deep.
          </div>
        </div>
      </Frame>

      {/* ===================================================================
          4. ACCESSIBILITY
          =================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 'var(--space-3)' }}>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Keyboard model</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            The bar is a <strong>single tab stop</strong> using roving tabindex. <Mono>Tab</Mono> lands on the active trigger; <Mono>←</Mono>/<Mono>→</Mono> moves between File · Edit · View · Help. <Mono>↓</Mono>, <Mono>Enter</Mono>, or <Mono>Space</Mono> opens the focused menu and focuses its first enabled item. While a menu is open, <Mono>←</Mono>/<Mono>→</Mono> closes the current panel and opens the adjacent one. <Mono>↑</Mono>/<Mono>↓</Mono> navigate items; <Mono>Home</Mono>/<Mono>End</Mono> jump to the boundary. <Mono>Escape</Mono> closes and restores focus to the trigger. <Mono>Tab</Mono> inside a panel closes it and moves natural focus out.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            The container carries <Mono>role="menubar"</Mono> + <Mono>aria-orientation="horizontal"</Mono>. Each trigger is a <Mono>role="menuitem"</Mono> with <Mono>aria-haspopup="menu"</Mono> and <Mono>aria-expanded</Mono>. Each panel is <Mono>role="menu"</Mono> with <Mono>aria-orientation="vertical"</Mono>. Item rows are <Mono>role="menuitem"</Mono>; shortcut hints carry <Mono>aria-hidden="true"</Mono> so they are not double-read.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Type-ahead</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            Typing a printable character on the bar focuses the next trigger whose label starts with that character (wrapping). Inside an open menu, the same mechanism scans items from the current position.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Contrast &amp; motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            Active trigger and hovered items pick up <Mono>--surface-hover</Mono>; all label + shortcut text clears AA contrast against both the bar and elevated panel chrome. Under <Mono>prefers-reduced-motion: reduce</Mono>, the panel's open animation collapses to opacity-only.
          </div>
        </div>
      </div>

      {/* ===================================================================
          5. RTL
          =================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — menu order reverses; panels open toward the start (right) edge'}
        code={`<div dir="rtl">
  <Menubar dir="rtl">
    {/* The trigger row is a flex row — menus reverse so File sits on the right.
        MenubarContent reads the closest [dir] via getComputedStyle and anchors
        the panel's inset-inline-start, so it opens toward the start (right) edge. */}
    <MenubarMenu value="ملف">…</MenubarMenu>
    <MenubarMenu value="تحرير">…</MenubarMenu>
    <MenubarMenu value="عرض">…</MenubarMenu>
  </Menubar>
</div>`}
        lang="tsx"
      >
        <div dir="rtl">
          <Menubar dir="rtl">
            <MenubarMenu value="ملف">
              <MenubarTrigger>ملف</MenubarTrigger>
              <MenubarContent>
                <MenubarItem icon={<Icons.plus size={13} />} shortcut={<MenubarShortcut><kbd className="kbd">⌘</kbd><kbd className="kbd">N</kbd></MenubarShortcut>}>مشروع جديد</MenubarItem>
                <MenubarItem icon={<Icons.folder size={13} />} shortcut={<MenubarShortcut><kbd className="kbd">⌘</kbd><kbd className="kbd">O</kbd></MenubarShortcut>}>فتح مشروع…</MenubarItem>
                <MenubarSeparator />
                <MenubarItem icon={<Icons.enter size={13} />} shortcut={<MenubarShortcut><kbd className="kbd">⌘</kbd><kbd className="kbd">Q</kbd></MenubarShortcut>}>تسجيل الخروج</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="تحرير">
              <MenubarTrigger>تحرير</MenubarTrigger>
              <MenubarContent>
                <MenubarItem icon={<Icons.undo size={13} />} shortcut={<MenubarShortcut><kbd className="kbd">⌘</kbd><kbd className="kbd">Z</kbd></MenubarShortcut>}>تراجع</MenubarItem>
                <MenubarItem icon={<Icons.redo size={13} />} shortcut={<MenubarShortcut><kbd className="kbd">⌘</kbd><kbd className="kbd">⇧</kbd><kbd className="kbd">Z</kbd></MenubarShortcut>}>إعادة</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="عرض">
              <MenubarTrigger>عرض</MenubarTrigger>
              <MenubarContent>
                <MenubarItem shortcut={<MenubarShortcut><kbd className="kbd">⌘</kbd><kbd className="kbd">=</kbd></MenubarShortcut>}>تكبير</MenubarItem>
                <MenubarItem shortcut={<MenubarShortcut><kbd className="kbd">⌘</kbd><kbd className="kbd">−</kbd></MenubarShortcut>}>تصغير</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </Frame>
      <Lede>
        The trigger row is a flex row, so the top-level menus reverse — <Mono>ملف</Mono> sits on the right and <Mono>عرض</Mono> on the left. Each panel reads the closest <Mono>[dir]</Mono> attribute via <Mono>getComputedStyle</Mono> and anchors with a logical inset, so it opens toward the start (right) edge. Item rows keep their icon on the leading side with the <Mono>kbd</Mono> chord trailing. Non-directional icons stay as-is; a submenu chevron would mirror with <Mono>scaleX(-1)</Mono>.
      </Lede>

      {/* ===================================================================
          6. ANATOMY
          =================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              {/* Trigger row */}
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 2, padding: 4, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', background: 'var(--surface)', width: 240 }}>
                <span style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', fontSize: 'var(--text-base)' }}>File</span>
                <span style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)' }}>Edit</span>
                <span style={{ padding: '6px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)' }}>View</span>
              </div>
              {/* Open panel under File */}
              <div style={{ marginTop: 6, width: 220, padding: 4, borderRadius: 'var(--radius-xl)', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', boxShadow: 'var(--elev-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '7px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Icons.plus size={13} /> New project</span>
                  <span className="kbd-chord"><kbd className="kbd">⌘</kbd><kbd className="kbd">N</kbd></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '7px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Icons.folder size={13} /> Open…</span>
                  <span className="kbd-chord"><kbd className="kbd">⌘</kbd><kbd className="kbd">O</kbd></span>
                </div>
                <hr className="separator horizontal" style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '7px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Icons.enter size={13} /> Sign out</span>
                  <span className="kbd-chord"><kbd className="kbd">⌘</kbd><kbd className="kbd">Q</kbd></span>
                </div>
              </div>
              {/* Leader lines */}
              <span className="lead v" style={{ top: -22, left: 60, height: 18 }} />
              <span className="lead h" style={{ top: 14, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 62, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 100, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 142, right: -28, width: 24 }} />
              {/* Pins */}
              <div className="pin" style={{ top: -42, left: 60, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: 4, left: -52 }}>2</div>
              <div className="pin" style={{ top: 52, right: -52 }}>3</div>
              <div className="pin" style={{ top: 90, left: -52 }}>4</div>
              <div className="pin" style={{ top: 132, right: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxInlineSize: 560, marginInline: 'auto', marginBlockStart: 'var(--space-12)' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Trigger.</b> Top-level word (File · Edit · View · Help). One click opens the panel beneath it; hovering while another menu is open switches to this one.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Open state.</b> The active trigger picks up <Mono>--surface-hover</Mono> so it is clear which menu the panel belongs to.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Open panel.</b> Elevated chrome anchored below the trigger via <Mono>position:fixed</Mono> — 240 px min-width, 4 px padding, <Mono>var(--radius-xl)</Mono>.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Item row.</b> Single command — optional icon on the start edge, keyboard shortcut on the end edge.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Separator.</b> Hairline grouping inside the panel. Use sparingly — at most one or two per menu.</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          7. DECISION MATRIX
          =================================================================== */}
      <SubHead meta="when to use">Menubar vs Dropdown Menu vs Toolbar</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Pick the right pattern</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Use</th>
              <th>Pattern</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>App-wide commands grouped by category (Figma, Sketch)</td><td className="tok-name">Menubar</td></tr>
            <tr><td>Actions on a single selected object</td><td className="tok-name">Dropdown Menu</td></tr>
            <tr><td>Visible format toggles for the current selection</td><td className="tok-name">Toolbar</td></tr>
            <tr><td>Right-click context actions on a canvas</td><td className="tok-name">Dropdown Menu</td></tr>
          </tbody>
        </table>
      </div>

      {/* ===================================================================
          8. DO / DON'T
          =================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — show the keyboard shortcut for every item that has one</div>
          <div className="body" style={{ padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-base)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icons.undo size={13} /> Undo</span>
              <span className="kbd-chord"><kbd className="kbd">⌘</kbd><kbd className="kbd">Z</kbd></span>
            </div>
          </div>
          <div className="note">Menubar items are how shortcuts get discovered. Hide the hint and the menubar becomes the only way to trigger the action.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — nest submenus more than one level deep</div>
          <div className="body" style={{ padding: 12, fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              File <Icons.chevronRight size={10} /> Recent <Icons.chevronRight size={10} /> Projects <Icons.chevronRight size={10} /> 2024 <Icons.chevronRight size={10} /> Q3
            </span>
          </div>
          <div className="note">Deep submenus are a usability tax. Promote frequently used items to the top level, or use a Command palette so search replaces the tree.</div>
        </div>
      </div>

      {/* ===================================================================
          9. API REFERENCE
          =================================================================== */}
      <SubHead meta="MenubarProps">API reference</SubHead>
      <AutoPropsTable component="Menubar" label="<Menubar />" />
      <PropsTable
        label="<MenubarMenu />"
        rows={[
          { prop: 'value',    type: 'string',    description: 'Stable id for this menu — required when Menubar is controlled. Defaults to the trigger text content.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'A MenubarTrigger followed by a MenubarContent.' },
        ]}
      />
      <PropsTable
        label="<MenubarItem />"
        rows={[
          { prop: 'icon',      type: 'ReactNode',  description: 'Leading icon (12–14 px). Placed on the inline-start edge.' },
          { prop: 'shortcut',  type: 'ReactNode',  description: 'Trailing keyboard shortcut. Use <MenubarShortcut> for consistent formatting.' },
          { prop: 'disabled',  type: 'boolean', default: 'false', description: 'Disables the item — aria-disabled is set, pointer events removed.' },
          { prop: 'children',  type: 'ReactNode', required: true, description: 'Command label.' },
          { prop: 'onClick',   type: '() => void', description: 'Fires before the menu closes. Note: the menu always closes after a non-disabled item click.' },
        ]}
      />
    </Section>
  );
}
