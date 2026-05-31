'use client';
import { Icons, Frame, Section, SubHead, TabbedCode, installTabs } from '@/components/docs';
import { Kbd, KbdRow, AutoPropsTable, Lede, Mono } from '@/ds/core';


const USAGE_CODE = `import { Kbd } from "@/components/forge/kbd"

export function Demo() {
  return (
    <>
      {/* single key */}
      <Kbd>⌘</Kbd>
      {/* chord */}
      <Kbd keys={['⌘', 'K']} />
      {/* row (menu item) */}
      <Kbd label="Open palette" keys={['⌘', 'K']} />
    </>
  )
}`;

export default function KbdPage() {
  return (
    <Section
      id="kbd"
      title="Kbd"
      desc="A small monospace pill that represents a keyboard shortcut — single keys or chord strings. Used in Command palettes, Tooltips, Menu trailing slots, and inline docs."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('kbd')} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>Kbd</Mono> + <Mono>Kbd.Chord</Mono> wrappers and the matching <Mono>.kbd</Mono> / <Mono>.kbd-chord</Mono> classes.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <Kbd keys={['⌘','K']}/>
      </Frame>

      {/* 3. EXAMPLES */}
      {/* ── Single keys ─────────────────────────────────────────── */}
      <SubHead meta="single key">Single keys</SubHead>
      <Frame label="one cell per key" row
        code={`<Kbd>⌘</Kbd>
<Kbd>⌥</Kbd>
<Kbd>⌃</Kbd>
<Kbd>⇧</Kbd>
<Kbd>↵</Kbd>
<Kbd>Esc</Kbd>
<Kbd>⌫</Kbd>
<Kbd>Tab</Kbd>`}>
        <Kbd>⌘</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>↵</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>⌫</Kbd>
        <Kbd>Tab</Kbd>
      </Frame>

      {/* ── Chord strings ───────────────────────────────────────── */}
      <SubHead meta="chord">Chord strings</SubHead>
      <Frame
        label="joined with a thin separator · no plus signs"
        row
        code={`<Kbd.Chord>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</Kbd.Chord>

<Kbd.Chord>
  <Kbd>⌘</Kbd>
  <Kbd>⇧</Kbd>
  <Kbd>P</Kbd>
</Kbd.Chord>`}>
        <Kbd keys={['⌘','K']}/>
        <Kbd keys={['⌘','⇧','P']}/>
        <Kbd keys={['⌃',',']} />
      </Frame>
      <p className="ds-caption">
        Forge convention: place keys side-by-side with a 2px gap. Avoid <Mono>Cmd+K</Mono> — the plus character drops to baseline and breaks the visual rhythm of the monospace cells.
      </p>

      {/* ── In context ──────────────────────────────────────────── */}
      <SubHead meta="in context">In real surfaces</SubHead>
      <Frame label="menu-like row · command row · tooltip">
        <div style={{display:'flex', gap: 24, alignItems:'flex-start', flexWrap:'wrap'}}>
          {/* Menu-like row composition */}
          <div style={{minWidth: 240, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 4, background:'var(--surface)'}}>
            {[
              { label:'New file',        keys:['⌘','N'] },
              { label:'Open project…',   keys:['⌘','O'] },
              { label:'Save',            keys:['⌘','S'] },
            ].map((r, i) => (
              <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 8px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-sm)', cursor:'default'}}>
                <span>{r.label}</span>
                <Kbd keys={r.keys}/>
              </div>
            ))}
          </div>
          {/* Command palette row */}
          <div style={{minWidth: 320, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 6, background:'var(--surface)'}}>
            <div style={{padding:'8px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', fontSize: 'var(--text-base)'}}>
              <span style={{display:'inline-flex', alignItems:'center', gap: 8}}><Icons.search size={12}/> Search files</span>
              <Kbd keys={['⌘','P']}/>
            </div>
            <div style={{padding:'8px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', fontSize: 'var(--text-base)'}}>
              <span style={{display:'inline-flex', alignItems:'center', gap: 8}}><Icons.command size={12}/> Run command</span>
              <Kbd keys={['⌘','⇧','P']}/>
            </div>
          </div>
          {/* Tooltip composition */}
          <div data-tt="Toggle Bold ⌘B" style={{padding: 12}}>
            <button className="btn icon outline" aria-label="Bold"><Icons.bold size={14}/></button>
          </div>
        </div>
      </Frame>

      {/* Kbd row composition — moved from its own page (folded in 3.A) */}
      <SubHead meta="row composition">Kbd row</SubHead>
      <p className="ds-caption" style={{marginBlockStart: 'var(--space-1)', marginBlockEnd: 'var(--space-4)'}}>
        Row layout used in menus, command palettes, cheat-sheets. Pass <Mono>label</Mono> to <Mono>Kbd</Mono> to activate row mode — label on the start, chord on the end, optional muted <Mono>meta</Mono> in between.
      </p>
      <Frame label="label + chord · optional meta" code={`<Kbd label="Open palette" keys={['⌘','K']}/>
<Kbd label="Submit form" keys={['⇧','⏎']}/>
<Kbd label="Toggle theme" meta="experimental" keys={['⌘','⇧','D']}/>
<Kbd label="Go to deploys" keys={['G','D']}/>`}>
        <div style={{maxWidth: 360, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 4, background:'var(--surface)'}}>
          <Kbd label="Open palette" keys={['⌘','K']}/>
          <Kbd label="Submit form" keys={['⇧','⏎']}/>
          <Kbd label="Toggle theme" meta="experimental" keys={['⌘','⇧','D']}/>
          <Kbd label="Go to deploys" keys={['G','D']}/>
        </div>
      </Frame>
      <p className="ds-caption">
        <Mono>{'<Kbd label="…" keys={["⌘","K"]} meta="…"/>'}</Mono> — props: <Mono>label</Mono> (start), <Mono>keys</Mono> (end), <Mono>meta</Mono> (muted hint between).
      </p>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Kbd is a static label, not a control — it never takes focus and adds no tab stop. It documents a shortcut; the actual binding lives on the command, menu item, or global handler it sits beside.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Rendered as the semantic <Mono>{'<kbd>'}</Mono> element so assistive tech announces it as keyboard input. Spell out symbol keys for clarity — a glyph like <Mono>⌘</Mono> should carry a text alternative ("Command") rather than be read as a lone symbol. When it annotates a menu item, expose it through the item's <Mono>aria-keyshortcuts</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Not focusable, so there is no focus ring to manage. The pill's monospace text and its subtle border both clear AA contrast against the surfaces it appears on — command palettes, tooltips, and menu trailing slots.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The pill is fully static — no transitions, no animation — so there is nothing for <Mono>prefers-reduced-motion</Mono> to suppress.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — a chord follows the reading order; its logical meaning is unchanged'} center code={`<div dir="rtl"><Kbd keys={['⌘','K']}/></div>`} lang="tsx">
        <div dir="rtl" style={{display:'flex', flexWrap:'wrap', gap: 16, alignItems:'center'}}>
          <Kbd keys={['⌘','K']}/>
          <Kbd keys={['⌘','⇧','P']}/>
        </div>
      </Frame>
      <Lede>Honestly minimal: an individual keycap is symmetric and never mirrors. Under <Mono>dir="rtl"</Mono> a chord's cells follow the surrounding text and lay out right-to-left, but the binding's logical meaning — press <Mono>⌘</Mono> then <Mono>K</Mono> — is unchanged. The keys are pressed in the same physical order regardless of how the pills are visually ordered, so no glyph gets a directional flip.</Lede>
      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <span className="kbd-chord" style={{display:'inline-flex', alignItems:'center'}}>
                <kbd className="kbd">⌘</kbd><kbd className="kbd">K</kbd>
              </span>
              <span className="lead v" style={{top: -22, left: 9, height: 18}}/>
              <span className="lead h" style={{top: 9, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 9, right: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, left: 9, height: 18}}/>
              <span className="lead v" style={{top: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <div className="pin" style={{top: -42, left: 9, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: 0, left: -52}}>2</div>
              <div className="pin" style={{top: 0, right: -52}}>3</div>
              <div className="pin" style={{bottom: -42, left: 9, transform:'translateX(-50%)'}}>4</div>
              <div className="pin" style={{top: -42, left: '50%', transform:'translate(-50%, 0)'}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Glyph.</b> Single character or symbol in <Mono>var(--font-mono)</Mono> at 11px / 500.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Background.</b> <Mono>var(--surface-hover)</Mono> — subtle elevation that reads against any surface.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Border.</b> 1px solid <Mono>var(--border)</Mono> with 3px radius.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Min width 18px / height 18px.</b> Keeps a single character square.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Pair gap.</b> 2px between consecutive cells suggests a chord without a plus sign.</span>
          </div>
        </div>
      </div>

      {/* ── Decision matrix ─────────────────────────────────────── */}
      <SubHead meta="when to use">When to show a Kbd</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Surfaces</span></div>
        <table className="spec" style={{margin: 0}}>
          <thead><tr><th style={{padding:'10px 12px'}}>Surface</th><th>Show Kbd?</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Menu items with a shortcut</td><td className="tok-name">Always</td><td>Teaches the shortcut next to the action</td></tr>
            <tr><td>Command palette rows</td><td className="tok-name">Always</td><td>Same as menu — discoverability</td></tr>
            <tr><td>Tooltip on an icon-only button</td><td className="tok-name">Yes</td><td>Pairs label + shortcut in one hover</td></tr>
            <tr><td>Toast / Notification</td><td className="tok-name">Sometimes</td><td>Only when an action is one keystroke away (Undo)</td></tr>
            <tr><td>Body copy / docs</td><td className="tok-name">Sparingly</td><td>Use prose unless the reader will actually press the key</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── Do / Don't ──────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — symbols on macOS, words on Windows/Linux</div>
          <div className="body">
            <div style={{display:'flex', gap: 14, alignItems:'center'}}>
              <Kbd keys={['⌘','K']}/>
              <span style={{color:'var(--fg-faint)', fontSize: 'var(--text-base)'}}>or</span>
              <Kbd keys={['Ctrl','K']}/>
            </div>
          </div>
          <div className="note">Detect the platform once at boot and render the right token. Don't show both — pick one.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — wrap multi-key strings in one pill</div>
          <div className="body">
            <kbd className="kbd" style={{minWidth: 0, padding:'0 8px'}}>⌘ + K</kbd>
          </div>
          <div className="note">One pill = one key. Use the chord separator pattern so each key is its own cell.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="KbdProps">API reference</SubHead>
      <AutoPropsTable component="Kbd" label="<Kbd />"/>
    </Section>
  );
}
