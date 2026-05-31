'use client';
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, installTabs,
  Lede, Mono, Command, CommandDialog,
  type CommandGroup,
} from '@/ds/core';

// ── Sample data shared across demos ─────────────────────────────────────────

const COMMANDS: CommandGroup[] = [
  {
    heading: 'Navigation',
    items: [
      { id: 'go-home',   icon: Icons.home,   label: 'Go to Home',          kbd: ['G', 'H'] },
      { id: 'go-svc',    icon: Icons.cpu,    label: 'Go to Services',      kbd: ['G', 'S'] },
      { id: 'go-deploy', icon: Icons.rocket, label: 'Go to Deployments',   kbd: ['G', 'D'] },
    ],
  },
  {
    heading: 'Create',
    items: [
      { id: 'new-svc', icon: Icons.plus,   label: 'New service…',     kbd: ['⌘', 'N'] },
      { id: 'new-key', icon: Icons.shield, label: 'Generate API key', kbd: [] },
      { id: 'invite',  icon: Icons.user,   label: 'Invite teammate',  kbd: [] },
    ],
  },
  {
    heading: 'Recent',
    items: [
      { id: 'r-1', icon: Icons.doc,    label: 'Open: deploy guide' },
      { id: 'r-2', icon: Icons.branch, label: 'Open: feature/api-v2' },
    ],
  },
];

const USAGE_CODE = `import { Command, CommandDialog } from "@/components/forge/command"

// Inline (embedded in your own surface):
export function InlineDemo() {
  return (
    <Command
      groups={[
        { heading: "Navigation", items: [
          { id: "home", label: "Go to Home", kbd: ["G", "H"] },
        ]},
      ]}
      onSelect={(id) => console.log("selected:", id)}
    />
  );
}

// Full ⌘K overlay:
export function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open palette</button>
      <CommandDialog
        groups={groups}
        open={open}
        onOpenChange={setOpen}
        onSelect={(id) => { doAction(id); setOpen(false); }}
      />
    </>
  );
}`;

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CommandPage() {
  return (
    <Section
      id="command"
      title="Command"
      desc="The ⌘K surface — a single search input across navigation, creation, and recent items. Keyboard-first: one shortcut makes every user a power user."
    >
      {/* ── 1. INSTALLATION ─────────────────────────────────────────────── */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('command')} ariaLabel="package manager" />
      <Lede>
        The CLI copies <Mono>command.tsx</Mono> and its CSS into your repo — Eidos is
        source-shipped, not a black-box dependency. Use the{' '}
        <em>Manual</em> tab to copy the files by hand. No third-party deps beyond the{' '}
        <Mono>cn()</Mono> helper.
      </Lede>

      {/* ── 2. USAGE ────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="inline — no backdrop" center code={USAGE_CODE}>
        <Command groups={COMMANDS} onSelect={() => {}} />
      </Frame>
      <Lede>
        Pass <Mono>groups</Mono> (typed <Mono>CommandGroup[]</Mono>) and an{' '}
        <Mono>onSelect</Mono> callback. Use <Mono>{'<CommandDialog>'}</Mono> for the full
        backdrop overlay — it portals to <Mono>document.body</Mono>, locks scroll, traps
        focus, and restores the trigger on close.
      </Lede>

      {/* ── EXAMPLES divider ────────────────────────────────────────────── */}
      <div className="ds-examples-rule" style={{ marginBlock: '36px 6px' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }} />
      </div>

      {/* ── 3. VARIANTS ─────────────────────────────────────────────────── */}
      <SubHead meta="2 variants">Variants</SubHead>

      {/* Inline variant */}
      <Frame
        label="inline — embedded in a custom surface"
        center
        code={`<Command
  groups={groups}
  onSelect={(id) => handleSelect(id)}
/>`}>
        <Command groups={COMMANDS} onSelect={() => {}} />
      </Frame>

      {/* Dialog variant */}
      <SubHead meta="dialog · backdrop">With dialog</SubHead>
      {(() => {
        const Demo = () => {
          const [open, setOpen] = React.useState(false);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <button
                className="btn ember"
                onClick={() => setOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                Open palette
                <span className="kbd-chord">
                  <kbd className="kbd">⌘</kbd>
                  <kbd className="kbd">K</kbd>
                </span>
              </button>
              <CommandDialog
                groups={COMMANDS}
                open={open}
                onOpenChange={setOpen}
                onSelect={() => setOpen(false)}
              />
            </div>
          );
        };
        return (
          <Frame
            label="CommandDialog — full backdrop, focus trap, body scroll lock"
            center
            code={`<CommandDialog
  groups={groups}
  open={open}
  onOpenChange={setOpen}
  onSelect={(id) => { doAction(id); setOpen(false); }}
/>`}>
            <Demo />
          </Frame>
        );
      })()}

      {/* Filtered state */}
      <SubHead meta="filtered">Filtered state</SubHead>
      {(() => {
        const FilteredDemo = () => {
          const [q, setQ] = React.useState('depl');
          return (
            <Command
              groups={COMMANDS}
              query={q}
              onQueryChange={setQ}
              onSelect={() => {}}
            />
          );
        };
        return (
          <Frame
            label='typed "depl" → only matching items remain'
            center
            code={`// Controlled query:
<Command
  groups={groups}
  query={q}
  onQueryChange={setQ}
  onSelect={handleSelect}
/>`}>
            <FilteredDemo />
          </Frame>
        );
      })()}

      {/* Empty state */}
      <SubHead meta="empty">Empty state</SubHead>
      <Frame
        label="no results — polite live region announced to screen readers"
        center
        code={`<Command groups={groups} defaultQuery="zzznomatch" onSelect={() => {}} />`}>
        <Command groups={COMMANDS} defaultQuery="zzznomatch" onSelect={() => {}} />
      </Frame>

      {/* ── Decision matrix ──────────────────────────────────────────────── */}
      <SubHead meta="when to use">Command vs Combobox vs Menu</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Pick the right primitive</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Use</th>
              <th>Pattern</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Global "do anything" surface across the whole app</td><td className="tok-name">Command</td></tr>
            <tr><td>Pick one value to assign to a field</td><td className="tok-name">Combobox</td></tr>
            <tr><td>Run an action scoped to a single object</td><td className="tok-name">Dropdown Menu</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── 4. IN CONTEXT ───────────────────────────────────────────────── */}
      <SubHead meta="real surface">In context</SubHead>
      {(() => {
        const InContext = () => {
          const [open, setOpen] = React.useState(false);
          return (
            <div style={{
              width: 620, fontFamily: 'var(--font)',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 12, overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
                background: 'var(--surface)',
              }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--fg)' }}>eidos-api</span>
                <div style={{ flex: 1 }} />
                <button
                  className="ds-topbar-search"
                  onClick={() => setOpen(true)}
                  aria-label="Open command palette (⌘K)"
                >
                  <Icons.search size={14} aria-hidden="true" />
                  <span className="label" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-subtle)' }}>
                    Search commands…
                  </span>
                  <span className="kbd-chord">
                    <kbd className="kbd">⌘</kbd>
                    <kbd className="kbd">K</kbd>
                  </span>
                </button>
              </div>
              <div style={{ padding: 20, minHeight: 110, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
                Press the search bar above or <kbd className="kbd">⌘K</kbd> to open the palette.
              </div>
              <CommandDialog
                groups={COMMANDS}
                open={open}
                onOpenChange={setOpen}
                onSelect={() => setOpen(false)}
              />
            </div>
          );
        };
        return (
          <Frame label="⌘K trigger in an app topbar" center>
            <InContext />
          </Frame>
        );
      })()}

      {/* ── 5. ACCESSIBILITY ─────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }} className="t-small">Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }} className="t-small">
            Opening (⌘K / Ctrl+K) auto-focuses the search input.{' '}
            <Mono>↑</Mono> / <Mono>↓</Mono> move the active item across
            groups; <Mono>Enter</Mono> runs it; <Mono>Esc</Mono> closes and
            restores focus to the trigger. Per-command kbd chords fire the
            same actions from anywhere in the app.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }} className="t-small">Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }} className="t-small">
            The input is <Mono>role=combobox</Mono> with <Mono>aria-expanded</Mono> and{' '}
            <Mono>aria-controls</Mono> pointing to the <Mono>role=listbox</Mono>. Active
            option is surfaced via <Mono>aria-activedescendant</Mono> — focus stays in
            the input while the highlight moves. Group headings are <Mono>role=group</Mono>{' '}
            labels. The result count is a polite live region.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }} className="t-small">Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }} className="t-small">
            <Mono>CommandDialog</Mono> traps <Mono>Tab</Mono> / <Mono>Shift+Tab</Mono>{' '}
            inside the panel (wrap last→first and first→last), restores focus to the
            trigger on close, locks body scroll, and sets sibling roots to{' '}
            <Mono>inert</Mono>. The active row uses <Mono>--surface-hover</Mono> (not
            colour-only) — item text and kbd chips meet AA on the elevated panel.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }} className="t-small">Motion</div>
          <div style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }} className="t-small">
            The backdrop fades via <Mono>@keyframes cmd-backdrop-in</Mono> (140&nbsp;ms) and
            the panel fades + scales via <Mono>@keyframes cmd-dialog-in</Mono> (180&nbsp;ms).
            Under <Mono>prefers-reduced-motion: reduce</Mono> both animations are dropped
            (<Mono>animation: none</Mono>) — the palette appears and disappears instantly.
            Filtering and highlight movement are synchronous with no per-row animation.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ───────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      {(() => {
        const rtlGroups: CommandGroup[] = [
          {
            heading: 'التنقل',
            items: [
              { id: 'home-ar',   icon: Icons.home,   label: 'الذهاب إلى الرئيسية',    kbd: ['G', 'H'] },
              { id: 'svc-ar',    icon: Icons.cpu,    label: 'الذهاب إلى الخدمات',     kbd: ['G', 'S'] },
              { id: 'deploy-ar', icon: Icons.rocket, label: 'الذهاب إلى عمليات النشر', kbd: ['G', 'D'] },
            ],
          },
          {
            heading: 'إنشاء',
            items: [
              { id: 'new-svc-ar', icon: Icons.plus, label: 'خدمة جديدة…',    kbd: ['⌘', 'N'] },
              { id: 'invite-ar',  icon: Icons.user, label: 'دعوة عضو فريق', kbd: [] },
            ],
          },
        ];
        return (
          <Frame
            label={'dir="rtl" — search icon leads on the right, kbd hints trail on the left'}
            center
            code={`<div dir="rtl">
  <Command groups={rtlGroups} placeholder="اكتب أمراً أو ابحث…" onSelect={() => {}} />
</div>`}
            lang="tsx">
            <div dir="rtl">
              <Command
                groups={rtlGroups}
                placeholder="اكتب أمراً أو ابحث…"
                onSelect={() => {}}
              />
            </div>
          </Frame>
        );
      })()}
      <Lede>
        All rows are <Mono>display: flex</Mono> with <Mono>justify-content: space-between</Mono>{' '}
        and <Mono>text-align: start</Mono>, so the leading search icon and each result's
        leading icon land on the right while the trailing kbd chord moves to the left.
        Query text right-aligns automatically. The footer static glyphs (<Mono>⌘</Mono>,
        arrows) and group labels stay as-is — they are not directional.
      </Lede>

      {/* ── 7. ANATOMY ───────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              {/* Static anatomy snapshot */}
              <div className="cmd" style={{ width: 460, maxWidth: '100%' }}>
                <div className="cmd-search">
                  <Icons.search size={14} color="var(--fg-faint)" />
                  <span className="cmd-input" style={{ flex: 1, color: 'var(--fg-muted)' }}>
                    Type a command or search…
                  </span>
                  <kbd className="kbd">Esc</kbd>
                </div>
                <div className="cmd-results">
                  <div className="cmd-group">
                    <div className="cmd-group-label">Navigation</div>
                    <div className="cmd-row">
                      <span className="cmd-row-lead">
                        <span className="cmd-row-icon"><Icons.home size={14} /></span>
                        <span className="cmd-row-label">Go to Home</span>
                      </span>
                      <span className="kbd-chord"><kbd className="kbd">G</kbd><kbd className="kbd">H</kbd></span>
                    </div>
                    <div className="cmd-row is-active">
                      <span className="cmd-row-lead">
                        <span className="cmd-row-icon"><Icons.cpu size={14} /></span>
                        <span className="cmd-row-label">Go to Services</span>
                      </span>
                      <span className="kbd-chord"><kbd className="kbd">G</kbd><kbd className="kbd">S</kbd></span>
                    </div>
                  </div>
                </div>
                <div className="cmd-foot" aria-hidden="true">
                  <span className="cmd-foot-count">
                    <Icons.command size={12} />
                    6 results
                  </span>
                  <span className="cmd-foot-hints">
                    <span className="cmd-hint">
                      <kbd className="kbd">↑</kbd>
                      <kbd className="kbd">↓</kbd>
                      <span>navigate</span>
                    </span>
                    <span className="cmd-hint">
                      <kbd className="kbd">↵</kbd>
                      <span>select</span>
                    </span>
                  </span>
                </div>
              </div>
              {/* Leader lines + pins */}
              <span className="lead v" style={{ top: -22, left: 40, height: 18 }} />
              <span className="lead h" style={{ top: 70, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 120, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 120, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: -42, left: 40, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: 60, left: -52 }}>2</div>
              <div className="pin" style={{ top: 110, left: -52 }}>3</div>
              <div className="pin" style={{ top: 110, right: -52 }}>4</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Search input.</b>{' '}
              Leading search glyph + a bare input with <Mono>role=combobox</Mono>.
              Auto-focused on open; the only interactive field in the palette.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Group label.</b>{' '}
              Mono uppercase — Navigation, Create, Recent. Groups by what the command
              does, not alphabetically.
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Active row.</b>{' '}
              The keyboard selection. <Mono>--surface-hover</Mono> fill tracks{' '}
              <Mono>↑</Mono>/<Mono>↓</Mono> and pointer hover.{' '}
              <Mono>aria-activedescendant</Mono> keeps the input focused.
            </span>
            <span className="num">4</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Kbd chord.</b>{' '}
              Right-aligned shortcut hint. Runs the same command from anywhere in the
              app without opening the palette.
            </span>
            <span className="num">5</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Footer.</b>{' '}
              Result count on the start side; global key hints (↑↓ navigate, ↵ select,
              Esc close) on the end.
            </span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — group by intent, not alphabet</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="t-mono-label">Navigation</div>
            <div className="t-small" style={{ color: 'var(--fg-muted)', marginBlockStart: 2 }}>
              Go to … · Open project … · Switch workspace …
            </div>
            <div className="t-mono-label" style={{ marginBlockStart: 8 }}>Create</div>
            <div className="t-small" style={{ color: 'var(--fg-muted)', marginBlockStart: 2 }}>
              New service · Generate key · Invite teammate
            </div>
          </div>
          <div className="note">
            "Navigation" and "Create" are how the user thinks. Group by what the command
            does — not by the alphabet.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — hide it in a buried menu</div>
          <div className="body t-small" style={{ padding: 14, color: 'var(--fg-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              File <Icons.chevronRight size={10} /> Tools <Icons.chevronRight size={10} /> Show command palette…
              <span className="kbd-chord" style={{ marginInlineStart: 8 }}>
                <kbd className="kbd">⌘</kbd>
                <kbd className="kbd">K</kbd>
              </span>
            </span>
          </div>
          <div className="note">
            A command palette without a global shortcut is just another menu. Bind{' '}
            ⌘K (Ctrl+K) and expose the kbd hint everywhere.
          </div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — wire the global shortcut</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                className="ds-topbar-search"
                style={{ pointerEvents: 'none', width: 240 }}
                aria-hidden="true"
              >
                <Icons.search size={14} />
                <span className="label" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-subtle)' }}>
                  Search commands…
                </span>
                <span className="kbd-chord">
                  <kbd className="kbd">⌘</kbd>
                  <kbd className="kbd">K</kbd>
                </span>
              </button>
            </div>
          </div>
          <div className="note">
            Show the ⌘K chord in the search trigger. Use{' '}
            <Mono>onKeyDown</Mono> at the document root so it fires regardless of focus.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — show stale results</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="cmd-group" style={{ padding: '0 4px' }}>
              <div className="cmd-group-label">Create</div>
              <div className="cmd-row">
                <span className="cmd-row-lead">
                  <span className="cmd-row-icon"><Icons.rocket size={14} /></span>
                  <span className="cmd-row-label">New service (disabled)</span>
                </span>
              </div>
              <div className="cmd-row">
                <span className="cmd-row-lead">
                  <span className="cmd-row-icon"><Icons.shield size={14} /></span>
                  <span className="cmd-row-label" style={{ color: 'var(--fg-muted)' }}>
                    Generate key (hidden feature)
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="note">
            Don't surface commands the user can't run. Omit them or mark{' '}
            <Mono>disabled: true</Mono> — stale items erode trust.
          </div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ─────────────────────────────────────────────── */}
      <SubHead meta="CommandProps">API reference</SubHead>
      <AutoPropsTable component="Command" label="<Command />" />
      <AutoPropsTable component="CommandDialog" label="<CommandDialog />" />
      <PropsTable
        label="CommandItem"
        rows={[
          { prop: 'id', type: 'string', required: true, description: 'Unique item id — passed to onSelect and used for aria-activedescendant.' },
          { prop: 'label', type: 'string', required: true, description: 'Display label. Also the default search target.' },
          { prop: 'keywords', type: 'string[]', description: 'Extra search aliases extending filtering beyond the label.' },
          { prop: 'icon', type: 'ComponentType<{ size?: number }>', description: 'Leading icon component (14 px).' },
          { prop: 'kbd', type: 'string[]', description: 'Keyboard chord shown at the trailing edge, e.g. ["⌘", "N"].' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Skips the item in keyboard navigation and dims it visually.' },
        ]}
      />
    </Section>
  );
}
