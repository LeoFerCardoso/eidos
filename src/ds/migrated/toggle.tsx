'use client';
// Forge DS — Components / Toggle
// Page layout:
//   1. Installation     (TabbedCode: pnpm · npm · yarn · bun · Manual)
//   2. Usage            (Frame: minimal render)
//   3. Examples         (Variants · Sizes · With label · Toggle vs Switch)
//   4. In context       (formatting toolbar)
//   5. Accessibility
//   6. RTL
//   7. Anatomy
//   8. Do / Don't
//   9. API reference    (AutoPropsTable)
import * as React from 'react';
import { Toggle, Icons, Kbd, Frame, TabbedCode, Section, SubHead, Lede, Mono, installTabs } from '@/ds/core';
import { AutoPropsTable } from '@/ds/core';

// ==========================================================================
// 1. INSTALLATION
// ==========================================================================
const INSTALL_TABS = installTabs('toggle');

// ==========================================================================
// 2. USAGE
// ==========================================================================
const USAGE_CODE = `import { Toggle } from "@/components/forge/toggle"
import { Icons } from "@/components/forge/icons"

export function Demo() {
  const [pressed, setPressed] = React.useState(false)
  return (
    <Toggle pressed={pressed} onPressedChange={setPressed} aria-label="Bold">
      <Icons.bold size={14} />
    </Toggle>
  )
}`;

// ==========================================================================
// PAGE
// ==========================================================================
export default function TogglePage() {
  // Variant/size demos are stateful — declared at the top level so hooks are
  // called unconditionally (SWC rule).
  const [usageBold, setUsageBold] = React.useState(false);

  const [vGhost, setVGhost] = React.useState(false);
  const [vGhostP, setVGhostP] = React.useState(true);
  const [vOutline, setVOutline] = React.useState(false);
  const [vOutlineP, setVOutlineP] = React.useState(true);
  const [vSolid, setVSolid] = React.useState(false);
  const [vSolidP, setVSolidP] = React.useState(true);

  const [szSm, setSzSm] = React.useState(false);
  const [szMd, setSzMd] = React.useState(false);
  const [szLg, setSzLg] = React.useState(false);

  const [pinned, setPinned] = React.useState(false);
  const [fav, setFav] = React.useState(true);

  // In-context formatting toolbar — wired to a live editing line below.
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(true);
  const [under, setUnder] = React.useState(false);
  const [strike, setStrike] = React.useState(false);
  const [ctxPin, setCtxPin] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [lastShortcut, setLastShortcut] = React.useState<string | null>(null);

  // Cmd/Ctrl + B / I / U / Shift+X drive the SAME toggle state the toolbar
  // owns, so a keyboard shortcut and a button click are one editing loop.
  const onEditorKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    const k = e.key.toLowerCase();
    if (k === 'b') { e.preventDefault(); setBold(v => !v); setLastShortcut('⌘ B'); }
    else if (k === 'i') { e.preventDefault(); setItalic(v => !v); setLastShortcut('⌘ I'); }
    else if (k === 'u') { e.preventDefault(); setUnder(v => !v); setLastShortcut('⌘ U'); }
    else if (e.shiftKey && k === 'x') { e.preventDefault(); setStrike(v => !v); setLastShortcut('⌘ ⇧ X'); }
  }, []);

  // RTL
  const [rtlPin, setRtlPin] = React.useState(true);
  const [rtlBold, setRtlBold] = React.useState(false);
  const [rtlItalic, setRtlItalic] = React.useState(false);

  // Do / Don't
  const [ddPressed, setDdPressed] = React.useState(true);
  const [ddRest, setDdRest] = React.useState(false);

  return (
    <Section
      id="toggle"
      title="Toggle"
      desc="A two-state pressed button for commands like Bold, Pin, and Mute. Uses aria-pressed — not aria-checked. Press again to undo."
    >
      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={INSTALL_TABS} ariaLabel="package manager" />
      <Lede>
        Ships <Mono>toggle.tsx</Mono> as a pure <Mono>{'<button>'}</Mono> with <Mono>aria-pressed</Mono> semantics — no Radix, no external dependency. The component reuses the <Mono>.btn</Mono> CSS layer and adds toggle-specific pressed states via the <Mono>.tgl</Mono> class.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <Toggle pressed={usageBold} onPressedChange={setUsageBold} aria-label="Bold">
          <Icons.bold size={14} />
        </Toggle>
      </Frame>

      {/* ====================================================================
          3. EXAMPLES
          ==================================================================== */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ---- Variants ---- */}
      <SubHead meta="3 variants">Variants</SubHead>
      <Frame
        label="ghost · outline · solid — rest and pressed"
        row
        code={`<Toggle variant="ghost" pressed={p} onPressedChange={setP} aria-label="Bold">
  <Icons.bold size={14} />
</Toggle>

<Toggle variant="outline" pressed={p} onPressedChange={setP} aria-label="Pin">
  <Icons.pin size={14} />
</Toggle>

<Toggle variant="solid" pressed={p} onPressedChange={setP} aria-label="Notifications">
  <Icons.bell size={14} />
</Toggle>`}
      >
        <Toggle variant="ghost" pressed={vGhost} onPressedChange={setVGhost} aria-label="Bold (ghost rest)">
          <Icons.bold size={14} />
        </Toggle>
        <Toggle variant="ghost" pressed={vGhostP} onPressedChange={setVGhostP} aria-label="Bold (ghost pressed)">
          <Icons.bold size={14} />
        </Toggle>
        <span style={{ inlineSize: 1, blockSize: 24, background: 'var(--border)', marginInline: 4 }} aria-hidden="true" />
        <Toggle variant="outline" pressed={vOutline} onPressedChange={setVOutline} aria-label="Pin (outline rest)">
          <Icons.pin size={14} />
        </Toggle>
        <Toggle variant="outline" pressed={vOutlineP} onPressedChange={setVOutlineP} aria-label="Pin (outline pressed)">
          <Icons.pin size={14} />
        </Toggle>
        <span style={{ inlineSize: 1, blockSize: 24, background: 'var(--border)', marginInline: 4 }} aria-hidden="true" />
        <Toggle variant="solid" pressed={vSolid} onPressedChange={setVSolid} aria-label="Notifications (solid rest)">
          <Icons.bell size={14} />
        </Toggle>
        <Toggle variant="solid" pressed={vSolidP} onPressedChange={setVSolidP} aria-label="Notifications (solid pressed)">
          <Icons.bell size={14} />
        </Toggle>
      </Frame>
      <Lede up>
        <Mono>ghost</Mono> — transparent until pressed (surface fill). Use in toolbars and command bars. <Mono>outline</Mono> — always has a visible border; safer on busy surfaces where the ghost might disappear. <Mono>solid</Mono> — opaque surface at rest, ember fill when pressed; use sparingly — at most once per toolbar row.
      </Lede>

      {/* ---- Sizes ---- */}
      <SubHead meta="3 sizes">Sizes</SubHead>
      <Frame
        label="sm 26px · md 32px · lg 40px"
        row
        code={`<Toggle size="sm" aria-label="Bold small">
  <Icons.bold size={12} />
</Toggle>
<Toggle aria-label="Bold medium">
  <Icons.bold size={14} />
</Toggle>
<Toggle size="lg" aria-label="Bold large">
  <Icons.bold size={16} />
</Toggle>`}
      >
        <Toggle size="sm" pressed={szSm} onPressedChange={setSzSm} aria-label="Bold small">
          <Icons.bold size={12} />
        </Toggle>
        <Toggle pressed={szMd} onPressedChange={setSzMd} aria-label="Bold medium">
          <Icons.bold size={14} />
        </Toggle>
        <Toggle size="lg" pressed={szLg} onPressedChange={setSzLg} aria-label="Bold large">
          <Icons.bold size={16} />
        </Toggle>
      </Frame>

      {/* ---- With label ---- */}
      <SubHead meta="text variant">With label</SubHead>
      <Frame
        label="icon + label — still aria-pressed"
        row
        code={`<Toggle variant="outline" pressed={pinned} onPressedChange={setPinned}>
  <Icons.pin size={14} /> {pinned ? 'Pinned' : 'Pin'}
</Toggle>

<Toggle variant="outline" pressed={fav} onPressedChange={setFav}>
  <Icons.star size={14} /> Favourite
</Toggle>`}
      >
        <Toggle variant="outline" pressed={pinned} onPressedChange={setPinned}>
          <Icons.pin size={14} /> {pinned ? 'Pinned' : 'Pin'}
        </Toggle>
        <Toggle variant="outline" pressed={fav} onPressedChange={setFav}>
          <Icons.star size={14} /> Favourite
        </Toggle>
      </Frame>

      {/* ---- Decision matrix ---- */}
      <SubHead meta="when to use">Toggle vs Switch vs Checkbox</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Pick the right primitive</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Use case</th>
              <th>Component</th>
              <th>ARIA</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>"Make this text bold right now"</td><td className="tok-name">Toggle</td><td className="mono">aria-pressed</td></tr>
            <tr><td>"Turn dark mode on" (a setting saved when the user leaves)</td><td className="tok-name">Switch</td><td className="mono">aria-checked / role=switch</td></tr>
            <tr><td>"I accept the terms" (form value submitted)</td><td className="tok-name">Checkbox</td><td className="mono">aria-checked / type=checkbox</td></tr>
            <tr><td>"Pick one of these layout options"</td><td className="tok-name">Toggle Group (single)</td><td className="mono">role=radiogroup</td></tr>
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          4. IN CONTEXT — formatting toolbar
          ==================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        Toggles live in toolbars, command bars, and action rows. In an editor the toolbar is only half the loop — the keyboard owns the other half. Click into the line below and press <Kbd keys={['⌘', 'B']} /> or <Kbd keys={['⌘', 'I']} />: the shortcut and the toolbar button flip the <em>same</em> pressed state, so the buttons stay in lock-step with what the writer types.
      </Lede>
      <Frame label="formatting toolbar — live editor">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', inlineSize: '100%' }}>
          <div
            role="toolbar"
            aria-label="Text formatting"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              padding: 4,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}
          >
            <Toggle variant="ghost" pressed={bold} onPressedChange={setBold} aria-label="Bold" aria-keyshortcuts="Meta+B Control+B">
              <Icons.bold size={14} />
            </Toggle>
            <Toggle variant="ghost" pressed={italic} onPressedChange={setItalic} aria-label="Italic" aria-keyshortcuts="Meta+I Control+I">
              <Icons.italic size={14} />
            </Toggle>
            <Toggle variant="ghost" pressed={under} onPressedChange={setUnder} aria-label="Underline" aria-keyshortcuts="Meta+U Control+U">
              <Icons.underline size={14} />
            </Toggle>
            <Toggle variant="ghost" pressed={strike} onPressedChange={setStrike} aria-label="Strikethrough">
              <Icons.strike size={14} />
            </Toggle>
            <span style={{ inlineSize: 1, blockSize: 20, background: 'var(--border)', marginInline: 4 }} aria-hidden="true" />
            <Toggle variant="outline" pressed={ctxPin} onPressedChange={setCtxPin}>
              <Icons.pin size={14} /> {ctxPin ? 'Pinned' : 'Pin'}
            </Toggle>
          </div>
          <div
            role="textbox"
            aria-label="Editor line — formatting reflects the toolbar above"
            aria-multiline="false"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            tabIndex={0}
            onFocus={() => setEditing(true)}
            onBlur={() => setEditing(false)}
            onKeyDown={onEditorKeyDown}
            style={{
              fontStyle: italic ? 'italic' : 'normal',
              fontWeight: bold ? 700 : 400,
              textDecoration: [under && 'underline', strike && 'line-through'].filter(Boolean).join(' ') || 'none',
              fontSize: 'var(--text-body)',
              color: 'var(--fg)',
              margin: 0,
              inlineSize: '100%',
              maxInlineSize: 380,
              lineHeight: 1.6,
              padding: '10px 12px',
              borderRadius: 8,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              cursor: 'text',
            }}
          >
            Forge ships at 3:47am — the toolbar and the keyboard speak the same toggle.
          </div>
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.04em',
              color: 'var(--fg-faint)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {editing ? (
              <>
                <span style={{ inlineSize: 6, blockSize: 6, borderRadius: 999, background: 'var(--accent)' }} />
                <span>editing{lastShortcut ? ` — last shortcut ${lastShortcut}` : ' — try ⌘ B'}</span>
              </>
            ) : (
              <span>focus the line, then press ⌘/Ctrl + B · I · U</span>
            )}
          </div>
        </div>
      </Frame>

      {/* ====================================================================
          5. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <Kbd label={<span>Move focus to next toggle</span>} keys="Tab" />
          <Kbd label={<span>Flip the focused toggle</span>} keys={['Space']} />
          <Kbd label={<span>Flip the focused toggle</span>} keys={['Enter']} />
          <Kbd label={<span>Bold / Italic / Underline (in an editor)</span>} keys={['⌘', 'B']} />
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55, marginBlockStart: 8 }}>
            The toggle is a native <Mono>{'<button>'}</Mono> in the tab order; both <Mono>Space</Mono> and <Mono>Enter</Mono> flip the pressed state with no confirm step. When a toggle mirrors an editor command, advertise the shortcut with <Mono>aria-keyshortcuts</Mono> so the key and the button stay one action (see the live editor above). Disabled toggles leave the tab order via the <Mono>disabled</Mono> attribute.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The element is a <Mono>button</Mono> with <Mono>aria-pressed="true"</Mono> or <Mono>"false"</Mono>. Screen readers announce the pressed state change on every activation. Icon-only toggles <strong>must</strong> carry an <Mono>aria-label</Mono> naming the command ("Bold", "Mute"); text toggles are named by their visible label.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Every variant shows the ember focus ring (<Mono>--ring</Mono>) on <Mono>:focus-visible</Mono>.
            Pressed state is communicated by a surface fill <em>and</em> a border change — never colour alone.
            The icon or label clears AA (4.5:1 text, 3:1 non-text) against both rest and pressed fills in both themes.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The surface fill eases with <Mono>var(--ease)</Mono> on press. Under <Mono>prefers-reduced-motion: reduce</Mono> the component-scoped guard removes all transitions so the state change happens instantly — the fill alone carries the signal.
          </div>
        </div>
      </div>

      {/* ====================================================================
          6. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — icon + label swap sides; pressed fill is unaffected'
        row
        code={`<div dir="rtl">
  {/* inline-flex: icon lands on the right, label follows to its left */}
  <Toggle variant="outline" pressed={pinned} onPressedChange={setPinned}>
    <Icons.pin size={14} /> {pinned ? 'مثبّت' : 'تثبيت'}
  </Toggle>
  <Toggle variant="ghost" pressed={bold} onPressedChange={setBold} aria-label="عريض">
    <Icons.bold size={14} />
  </Toggle>
</div>`}
      >
        <div dir="rtl" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Toggle variant="outline" pressed={rtlPin} onPressedChange={setRtlPin}>
            <Icons.pin size={14} /> {rtlPin ? 'مثبّت' : 'تثبيت'}
          </Toggle>
          <Toggle variant="ghost" pressed={rtlBold} onPressedChange={setRtlBold} aria-label="عريض">
            <Icons.bold size={14} />
          </Toggle>
          <Toggle variant="ghost" pressed={rtlItalic} onPressedChange={setRtlItalic} aria-label="مائل">
            <Icons.italic size={14} />
          </Toggle>
        </div>
      </Frame>
      <Lede>
        A toggle is symmetric — the pressed fill is directionally neutral so the selected state reads identically in both directions. When an icon pairs with a label, the <Mono>inline-flex</Mono> row swaps them in RTL automatically: the icon leads on the right, the label follows to its left. The icons here (pin, bold, italic) aren't directional and stay as drawn. Directional glyphs (arrows, chevrons) would get a <Mono>scaleX(-1)</Mono> mirror.
      </Lede>

      {/* ====================================================================
          7. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <Toggle
                variant="outline"
                pressed
                tabIndex={-1}
                style={{ cursor: 'default' }}
              >
                <Icons.pin size={14} /> Pinned
              </Toggle>
              <span className="lead v" style={{ top: -22, left: 18, height: 18 }} />
              <span className="lead v" style={{ top: -22, left: 56, height: 18 }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: 14, right: -32, width: 28 }} />
              <div className="pin" style={{ top: -42, left: 18, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -42, left: 56, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: 6, right: -56 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Icon.</b> <Mono>14px</Mono> glyph naming the command. Required when icon-only — pair with <Mono>aria-label</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Label (optional).</b> Geist <Mono>500</Mono> at <Mono>13px</Mono>. Verb or noun; can flip with state: <em>Pin → Pinned</em>. Omit in dense toolbars.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Pressed surface.</b> <Mono>var(--surface-hover)</Mono> fill (ghost) / <Mono>var(--surface-active)</Mono> fill (outline) or <Mono>var(--ember)</Mono> fill (solid) while <Mono>aria-pressed="true"</Mono>. The idle ghost variant is fully transparent.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Border + radius.</b> 1px <Mono>var(--border-stronger)</Mono> on pressed outline/solid; <Mono>var(--border-strong)</Mono> at rest on outline/solid; ghost has no border at rest. 6px radius. Hit area is 32px (md), matching Button so toggles sit in button rows without rhythm breaks.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          8. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — paint a clear pressed state</div>
          <div className="body">
            <Toggle variant="ghost" pressed={ddPressed} onPressedChange={setDdPressed} aria-label="Bold pressed">
              <Icons.bold size={14} />
            </Toggle>
            <span style={{ color: 'var(--fg-faint)', fontSize: 'var(--text-base)', margin: '0 8px' }}>vs.</span>
            <Toggle variant="ghost" pressed={ddRest} onPressedChange={setDdRest} aria-label="Bold rest">
              <Icons.bold size={14} />
            </Toggle>
          </div>
          <div className="note">Surface fill + border change. The two states are unmistakable at a glance, even in a dense icon-only toolbar.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — use for destructive one-way actions</div>
          <div className="body">
            <button className="btn icon destructive" aria-pressed="true"><Icons.trash size={14} /></button>
          </div>
          <div className="note">If pressing cannot be undone safely, it's not a toggle — it needs a confirmation dialog. Toggles are always reversible.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — use aria-label on icon-only</div>
          <div className="body">
            <Toggle variant="ghost" aria-label="Bold" pressed={false}>
              <Icons.bold size={14} />
            </Toggle>
          </div>
          <div className="note">The icon communicates visually; the <Mono>aria-label</Mono> communicates to screen readers. Both must name the same command.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — use ember fill for non-solid toggles</div>
          <div className="body">
            <button className="btn icon ghost" aria-pressed="true" style={{ background: 'var(--ember)', color: 'var(--ember-fg)' }}><Icons.bold size={14} /></button>
          </div>
          <div className="note">Ember is a single accent reserved for the primary action. Pressed toggles use <Mono>--surface-hover</Mono> fill — not ember — unless the variant is explicitly <Mono>solid</Mono>.</div>
        </div>
      </div>

      {/* ====================================================================
          9. API REFERENCE
          ==================================================================== */}
      <SubHead meta="ToggleProps">API reference</SubHead>
      <AutoPropsTable component="Toggle" label="<Toggle />" />
    </Section>
  );
}
