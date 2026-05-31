'use client';
import * as React from 'react';
import {
  Icons,
  Frame,
  Section,
  SubHead,
  TabbedCode,
  PropsTable,
  installTabs,
  Lede,
  Mono,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/ds/core';

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/forge/menu"

export function Demo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">Actions</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem icon={Icons.eye}>Open</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.edit}>Rename</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.copy}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.trash} variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

const WITH_ICONS_CODE = `<DropdownMenu>
  <DropdownMenuTrigger className="btn">
    File actions
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuItem icon={Icons.eye}      shortcut="↩">Open</DropdownMenuItem>
    <DropdownMenuItem icon={Icons.edit}     shortcut="⌘E">Rename</DropdownMenuItem>
    <DropdownMenuItem icon={Icons.copy}     shortcut="⌘D">Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem icon={Icons.download} shortcut="⌘S">Download</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem icon={Icons.trash} variant="destructive" shortcut="⌫">
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`;

const CHECKBOX_CODE = `const [view, setView] = React.useState({ grid: true, ruler: false });

<DropdownMenu>
  <DropdownMenuTrigger className="btn">View</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Display</DropdownMenuLabel>
    <DropdownMenuCheckboxItem
      checked={view.grid}
      onCheckedChange={(v) => setView(s => ({ ...s, grid: v }))}
    >
      Grid
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem
      checked={view.ruler}
      onCheckedChange={(v) => setView(s => ({ ...s, ruler: v }))}
    >
      Ruler
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>`;

const RADIO_CODE = `const [sort, setSort] = React.useState('name-asc');

<DropdownMenu>
  <DropdownMenuTrigger className="btn">Sort by</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Sort order</DropdownMenuLabel>
    <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
      <DropdownMenuRadioItem value="name-asc">Name (A → Z)</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="name-desc">Name (Z → A)</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="date-desc">Date modified</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>`;

const RTL_CODE = `<div dir="rtl">
  <DropdownMenu dir="rtl">
    <DropdownMenuTrigger className="btn">
      الإجراءات <Icons.chevronDown size={12} />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem icon={Icons.eye}   shortcut="↩">فتح</DropdownMenuItem>
      <DropdownMenuItem icon={Icons.edit}  shortcut="⌘E">إعادة تسمية</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem icon={Icons.trash} variant="destructive" shortcut="⌫">
        حذف
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>`;

// ── Demo helpers (stateful, no inline impl) ───────────────────────────────────

function CheckboxDemo() {
  const [view, setView] = React.useState({ grid: true, ruler: false, lines: true });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">
        <Icons.eye size={13} /> View <Icons.chevronDown size={12} />
      </DropdownMenuTrigger>
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
}

function RadioDemo() {
  const [sort, setSort] = React.useState('name-asc');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">
        Sort <Icons.chevronDown size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Sort order</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="name-asc">Name (A {'>'} Z)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name-desc">Name (Z {'>'} A)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date-desc">Date modified</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size-desc">File size</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Anatomy helper — static menu (panel without portal/trigger) ───────────────
function StaticPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="menu"
      className="dm-panel"
      style={{ position: 'static', boxShadow: 'none', border: '1px solid var(--border)' }}
    >
      {children}
    </div>
  );
}

// ── Anatomy helper — a row that anchors its own pin via a dashed .lead ─────────
// The pin sits in the inline-start gutter and is vertically centred on THIS row,
// so it tracks the row across re-renders and themes — no magic top/bottom pixels.
function AnaRow({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      <div className="pin" style={{ insetInlineStart: -34, insetBlockStart: '50%', transform: 'translateY(-50%)' }}>{n}</div>
      <span className="lead h" style={{ insetInlineStart: -16, insetBlockStart: '50%', inlineSize: 16 }} aria-hidden="true" />
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <Section
      id="menu"
      num="17"
      title="Menu"
      desc="A portalled command list anchored to any trigger. Roving tabindex, type-ahead, direction-aware positioning — no Radix, no CVA."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('menu')} ariaLabel="package manager" />
      <Lede>
        The CLI copies <Mono>menu.tsx</Mono> and its CSS into your repo so you own the source.
        Pick the <em>Manual</em> tab to paste the files by hand. No Radix runtime — Eidos handles
        focus order, roving tabindex, type-ahead, and panel positioning itself.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic dropdown" code={USAGE_CODE}>
        <DropdownMenu>
          <DropdownMenuTrigger className="btn">Actions</DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem icon={Icons.eye}>Open</DropdownMenuItem>
            <DropdownMenuItem icon={Icons.edit}>Rename</DropdownMenuItem>
            <DropdownMenuItem icon={Icons.copy}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={Icons.trash} variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Frame>

      {/* 3. VARIANTS */}
      <SubHead meta="3 variants">Variants</SubHead>
      <Lede>
        Three item types cover every command-list need: <Mono>DropdownMenuItem</Mono> for one-shot
        actions, <Mono>DropdownMenuCheckboxItem</Mono> for toggles (panel stays open), and{' '}
        <Mono>DropdownMenuRadioItem</Mono> inside a <Mono>DropdownMenuRadioGroup</Mono> for
        single-choice lists.
      </Lede>

      <Frame label="icon + shortcut items" code={WITH_ICONS_CODE} height={280}>
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
      </Frame>

      <Frame label="checkbox items — panel stays open on toggle" code={CHECKBOX_CODE} height={260}>
        <CheckboxDemo />
      </Frame>

      <Frame label="radio items — single-choice inside a group" code={RADIO_CODE} height={240}>
        <RadioDemo />
      </Frame>

      {/* STATES */}
      <SubHead meta="states">States</SubHead>
      <Frame label="default · disabled · destructive" row>
        <StaticPanel>
          <div className="dm-item" role="menuitem" tabIndex={-1}>
            <span className="dm-item-left">
              <Icons.eye size={13} className="dm-item-icon" />
              <span className="dm-item-label">Default item</span>
            </span>
          </div>
          <div className="dm-item" role="menuitem" tabIndex={-1} aria-disabled="true" style={{ opacity: 0.4, cursor: 'not-allowed' }}>
            <span className="dm-item-left">
              <Icons.copy size={13} className="dm-item-icon" />
              <span className="dm-item-label">Disabled item</span>
            </span>
          </div>
          <div className="dm-sep" role="separator" />
          <div className="dm-item dm-item-destructive" role="menuitem" tabIndex={-1}>
            <span className="dm-item-left">
              <Icons.trash size={13} className="dm-item-icon" />
              <span className="dm-item-label">Destructive item</span>
            </span>
          </div>
        </StaticPanel>
      </Frame>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="toolbar with sort + more-actions menus">
        {(() => {
          function ToolbarDemo() {
            const [sort, setSort] = React.useState('date-desc');
            return (
              <div
                className="surface"
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 8,
                  gap: 12,
                  minWidth: 360,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--fg)', letterSpacing: '0.01em' }}>
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
                        <DropdownMenuRadioItem value="name-asc">Name (A {'>'} Z)</DropdownMenuRadioItem>
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
          }
          return <ToolbarDemo />;
        })()}
      </Frame>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard model</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            <strong>Enter</strong>, <strong>Space</strong>, or <strong>Down</strong> opens the menu
            and lands focus on the first item. <strong>Up</strong> / <strong>Down</strong> rove
            through items (wrapping at the ends). <strong>Home</strong> / <strong>End</strong> jump
            to the first or last item. <strong>Type-ahead</strong> finds the nearest item whose
            label starts with the typed character. <strong>Enter</strong> activates the focused
            item. <strong>Esc</strong> or <strong>Tab</strong> closes the panel and returns focus
            to the trigger. Disabled items are skipped.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>ARIA roles</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The trigger carries <Mono>aria-haspopup="menu"</Mono> and <Mono>aria-expanded</Mono>.
            The panel is <Mono>role="menu"</Mono>; regular items are{' '}
            <Mono>role="menuitem"</Mono>. Checkable items use{' '}
            <Mono>role="menuitemcheckbox"</Mono> or <Mono>role="menuitemradio"</Mono> with{' '}
            <Mono>aria-checked</Mono>. Separators carry <Mono>role="separator"</Mono>. Group
            labels use <Mono>role="presentation"</Mono> to stay purely visual.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Focus management</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Roving tabindex: only the currently active item holds <Mono>tabIndex=0</Mono>; all
            others are <Mono>tabIndex=-1</Mono>. Focus moves into the menu on open and returns
            to the trigger on close (ESC, Tab, or item activation). The active item renders the
            standard Eidos focus ring — it is never obscured by <Mono>box-shadow:none</Mono>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Contrast + motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Item labels and trailing shortcut hints clear AA contrast on the elevated panel in
            both dark and light themes. Destructive items use the danger token pair
            (text + icon), not the ember accent. Under{' '}
            <Mono>prefers-reduced-motion: reduce</Mono> the entry animation is suppressed — the
            panel appears instantly with no scale or translate.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — icon leads on the right, shortcut sits on the left' code={RTL_CODE}>
        <div dir="rtl">
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger className="btn">
              الإجراءات <Icons.chevronDown size={12} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>الملف</DropdownMenuLabel>
              <DropdownMenuItem icon={Icons.eye}    shortcut="↩">فتح</DropdownMenuItem>
              <DropdownMenuItem icon={Icons.edit}   shortcut="⌘E">إعادة تسمية</DropdownMenuItem>
              <DropdownMenuItem icon={Icons.copy}   shortcut="⌘D">تكرار</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Icons.download} shortcut="⌘S">تنزيل</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Icons.trash} variant="destructive" shortcut="⌫">حذف</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Frame>
      <Lede>
        The icon-and-label cluster sits at the inline-start (right in RTL); the keyboard hint
        sits at the inline-end (left). <Mono>justify-content: space-between</Mono> on{' '}
        <Mono>.dm-item</Mono> mirrors automatically. Anchored positioning reads the nearest{' '}
        <Mono>[dir]</Mono> ancestor and swaps start↔end before computing the panel's physical
        left offset — <Mono>align="start"</Mono> in RTL anchors to the trigger's right edge.
        Non-directional glyphs (check mark, shortcut text) do not mirror.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '40px 36px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            {/* Each numbered part carries its own pin, anchored to its row by a dashed
                .lead connector and centred on that row — so the callouts stay aligned
                across re-renders and themes regardless of row height. */}
            <div
              className="stage"
              role="menu"
              aria-hidden="true"
              style={{ position: 'relative', insetInlineStart: 17 }}
            >
              <div
                className="dm-panel"
                style={{ position: 'static', boxShadow: 'none', border: '1px solid var(--border)' }}
              >
                <AnaRow n={1}>
                  <div className="dm-label" role="presentation">Sort by</div>
                </AnaRow>
                <AnaRow n={2}>
                  <button className="dm-item" role="menuitem" tabIndex={-1}>
                    <span className="dm-item-left">
                      <Icons.eye size={13} className="dm-item-icon" />
                      <span className="dm-item-label">Open</span>
                    </span>
                    {/* Pin 3 anchors to the shortcut on the inline-end edge */}
                    <span style={{ position: 'relative', display: 'inline-flex' }}>
                      <span className="dm-item-shortcut" aria-hidden="true">↩</span>
                      <span className="lead h" style={{ insetInlineEnd: -16, insetBlockStart: '50%', inlineSize: 16 }} aria-hidden="true" />
                      <div className="pin" style={{ insetInlineEnd: -34, insetBlockStart: '50%', transform: 'translateY(-50%)' }}>3</div>
                    </span>
                  </button>
                </AnaRow>
                <button className="dm-item" role="menuitem" tabIndex={-1}>
                  <span className="dm-item-left">
                    <Icons.edit size={13} className="dm-item-icon" />
                    <span className="dm-item-label">Rename</span>
                  </span>
                  <span className="dm-item-shortcut" aria-hidden="true">⌘E</span>
                </button>
                <AnaRow n={4}>
                  <div className="dm-sep" role="separator" />
                </AnaRow>
                <AnaRow n={5}>
                  <button className="dm-item dm-item-destructive" role="menuitem" tabIndex={-1}>
                    <span className="dm-item-left">
                      <Icons.trash size={13} className="dm-item-icon" />
                      <span className="dm-item-label">Delete</span>
                    </span>
                    <span className="dm-item-shortcut" aria-hidden="true">⌫</span>
                  </button>
                </AnaRow>
              </div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '32px auto 0' }}>
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Group label.</b>{' '}
              Mono <Mono>--text-xs</Mono> uppercase. Optional — only use when items cluster into
              named categories. Never as decoration.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Leading icon.</b>{' '}
              13px. One per item, even when redundant — icons help scanning at speed. Muted by
              default; ember on hover. Destructive items inherit the danger token.
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Keyboard shortcut.</b>{' '}
              Mono, far inline-end edge. Show the real platform shortcut when one exists (⌘ on
              macOS, Ctrl elsewhere). Hidden from screen readers via <Mono>aria-hidden</Mono>.
            </span>
            <span className="num">4</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Separator.</b>{' '}
              1px hairline, 4px breathing space. Group items by stage of the verb
              (open / edit / share / delete).
            </span>
            <span className="num">5</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Destructive item.</b>{' '}
              Danger token pair (text + icon). Always at the bottom, always after a separator.
            </span>
          </div>
        </div>
      </div>

      {/* DO/DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — keep it under 8 items</div>
          <div className="body" style={{ padding: 14 }}>
            <StaticPanel>
              <div className="dm-item" role="menuitem" tabIndex={-1}>
                <span className="dm-item-left"><Icons.eye size={13} className="dm-item-icon" /><span className="dm-item-label">Open</span></span>
              </div>
              <div className="dm-item" role="menuitem" tabIndex={-1}>
                <span className="dm-item-left"><Icons.edit size={13} className="dm-item-icon" /><span className="dm-item-label">Rename</span></span>
              </div>
              <div className="dm-item" role="menuitem" tabIndex={-1}>
                <span className="dm-item-left"><Icons.copy size={13} className="dm-item-icon" /><span className="dm-item-label">Duplicate</span></span>
              </div>
              <div className="dm-sep" role="separator" />
              <div className="dm-item dm-item-destructive" role="menuitem" tabIndex={-1}>
                <span className="dm-item-left"><Icons.trash size={13} className="dm-item-icon" /><span className="dm-item-label">Delete</span></span>
              </div>
            </StaticPanel>
          </div>
          <div className="note">
            A short menu reads in one glance. Group related actions together; promote
            rarely-used actions into a submenu or a secondary surface.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — replicate the entire toolbar</div>
          <div className="body" style={{ padding: 14 }}>
            <StaticPanel>
              {['Open', 'Open in new tab', 'Open with…', 'Rename', 'Duplicate', 'Move',
                'Copy link', 'Share', 'Permissions', 'Tags', 'Comment', 'Pin to top',
                'Mark as read', 'Archive', 'Delete', 'Empty trash'].map((l) => (
                <div key={l} className="dm-item" role="menuitem" tabIndex={-1}>
                  <span className="dm-item-left">
                    <Icons.eye size={13} className="dm-item-icon" />
                    <span className="dm-item-label">{l}</span>
                  </span>
                </div>
              ))}
            </StaticPanel>
          </div>
          <div className="note">
            16 items means the user cannot scan. Pick the 4–6 actions most relevant to
            the object under the pointer.
          </div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="DropdownMenuProps">API reference</SubHead>
      <PropsTable
        label="<DropdownMenu />"
        rows={[
          { prop: 'open', type: 'boolean', description: 'Controlled open state.' },
          { prop: 'defaultOpen', type: 'boolean', default: 'false', description: 'Uncontrolled initial open state.' },
          { prop: 'onOpenChange', type: '(open: boolean) => void', description: 'Fires when the menu opens or closes.' },
          { prop: 'dir', type: '"ltr" | "rtl"', description: 'Reading direction. Inherited from the nearest [dir] ancestor when omitted.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'DropdownMenuTrigger and DropdownMenuContent.' },
        ]}
      />
      <PropsTable
        label="<DropdownMenuContent />"
        rows={[
          { prop: 'align', type: '"start" | "center" | "end"', default: '"start"', description: 'Panel alignment relative to the trigger. Direction-aware: start→right in RTL.' },
          { prop: 'side', type: '"bottom" | "top"', default: '"bottom"', description: 'Preferred side; auto-flips if the preferred side is clipped.' },
          { prop: 'sideOffset', type: 'number', default: '4', description: 'Pixel gap between the trigger and the panel edge.' },
          { prop: 'className', type: 'string', description: 'Extra classes on the panel element.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Items, labels, separators.' },
        ]}
      />
      <PropsTable
        label="<DropdownMenuItem />"
        rows={[
          { prop: 'onSelect', type: '(event: MouseEvent) => void', description: 'Fires when the item is chosen. Call event.preventDefault() to keep the panel open.' },
          { prop: 'variant', type: '"default" | "destructive"', default: '"default"', description: 'Red text + icon for delete/revoke actions. Always place after a separator.' },
          { prop: 'icon', type: 'ComponentType', description: 'Leading icon component (e.g. Icons.eye). 13px.' },
          { prop: 'shortcut', type: 'string', description: 'Trailing keyboard shortcut hint. Rendered aria-hidden.' },
          { prop: 'inset', type: 'boolean', default: 'false', description: 'Reserve the 14px leading slot so text aligns with sibling checkbox/radio items.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Prevents activation. Item remains in the DOM for AT discoverability.' },
          { prop: 'asChild', type: 'boolean', default: 'false', description: 'Render as the wrapped child (e.g. a Next.js Link) while keeping menu behavior.' },
        ]}
      />
      <PropsTable
        label="<DropdownMenuCheckboxItem />"
        rows={[
          { prop: 'checked', type: 'boolean', default: 'false', description: 'Whether the item is checked. Panel stays open on activation.' },
          { prop: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Fires when the checked state toggles.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Prevents toggling.' },
          { prop: 'shortcut', type: 'string', description: 'Trailing keyboard hint.' },
        ]}
      />
      <PropsTable
        label="<DropdownMenuRadioGroup />"
        rows={[
          { prop: 'value', type: 'string', description: 'Currently selected radio value.' },
          { prop: 'onValueChange', type: '(value: string) => void', description: 'Fires when the selection changes.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'DropdownMenuRadioItem elements.' },
        ]}
      />
    </Section>
  );
}
