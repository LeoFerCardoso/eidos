'use client';
// Forge DS — Components / Combobox.
// Searchable single/multi-select with a fixed-position popover panel that
// escapes parent overflow:hidden (e.g. .ds-frame). Always-visible search,
// free-text filter, and multi-select with a chip row.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono, Combobox } from '@/ds/core';

const USAGE_CODE = `import { Combobox } from "@forge/ui"

export function Demo() {
  const [value, setValue] = React.useState<string | null>(null);
  return (
    <Combobox
      value={value}
      onChange={setValue}
      options={[
        { value: 'next',  label: 'Next.js' },
        { value: 'remix', label: 'Remix' },
        { value: 'astro', label: 'Astro' },
      ]}
      placeholder="Pick a framework"
    />
  );
}`;

// ---- demo data ----------------------------------------------------------
const FRAMEWORKS = [
  { value: 'next',    label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt',    label: 'Nuxt.js' },
  { value: 'remix',   label: 'Remix' },
  { value: 'astro',   label: 'Astro' },
];
const TEAMS = [
  { value: 'design', label: 'Design' },
  { value: 'eng',    label: 'Engineering' },
  { value: 'ops',    label: 'Operations' },
  { value: 'mkt',    label: 'Marketing' },
  { value: 'fin',    label: 'Finance', disabled: true },
];
const GROUPED = [
  { label: 'Production', options: [
    { value: 'us-east-1', label: 'us-east-1', meta: 'N. Virginia' },
    { value: 'us-west-2', label: 'us-west-2', meta: 'Oregon' },
    { value: 'eu-west-1', label: 'eu-west-1', meta: 'Ireland' },
  ]},
  { label: 'Staging', options: [
    { value: 'sa-east-1', label: 'sa-east-1', meta: 'São Paulo' },
    { value: 'ap-southeast-2', label: 'ap-southeast-2', meta: 'Sydney' },
  ]},
  { label: 'Development', options: [
    { value: 'dev-1', label: 'dev-1', meta: 'Local' },
  ]},
];
const FRAMEWORKS_AR = [
  { value: 'next',   label: 'نكست جي إس' },
  { value: 'svelte', label: 'سفلت كيت' },
  { value: 'nuxt',   label: 'نوكست' },
  { value: 'remix',  label: 'ريمكس' },
];

type CbVal = string | string[] | null | undefined;

// ---- Page --------------------------------------------------------------
export default function Page() {
  const [v1, setV1] = React.useState<CbVal>(null);
  const [v2, setV2] = React.useState<CbVal>(['design', 'eng']);
  const [v3, setV3] = React.useState<CbVal>(null);
  const [v4, setV4] = React.useState<CbVal>(null);
  const [v5, setV5] = React.useState<CbVal>('next');
  const [v6, setV6] = React.useState<CbVal>(null);
  const [v7, setV7] = React.useState<CbVal>(null);
  const [v8, setV8] = React.useState<CbVal>(null);
  const [vAr, setVAr] = React.useState<CbVal>(null);

  return (
    <Section
      id="combobox"
      title="Combobox"
      desc="Searchable picker with always-visible search input. Type to filter, arrow keys to navigate, Enter to commit. Pass multiple for chip-row multi-select."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('combobox')} ariaLabel="package manager"/>
      <Lede>
        Ships a custom-built searchable picker — no cmdk or Radix required. CSS classes (<Mono>.cb-*</Mono>) live in <Mono>tokens.css</Mono> and are included in the <Mono>forge-ui init</Mono> base layer. Pick the <em>Manual</em> tab to copy the source files instead.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>A trigger reveals a popover: search input above, filtered option list below. The popover closes on Escape or an outside click; Enter or a click commits the selection.</Lede>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{padding:'var(--space-6)', display:'flex', justifyContent:'center'}}>
          <Combobox options={FRAMEWORKS} value={v1} onChange={setV1} placeholder="Pick a framework"/>
        </div>
      </Frame>

      {/* 3. EXAMPLES */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 'var(--space-8)', marginBlockEnd: 'var(--space-1)' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* Single */}
      <SubHead meta="default">Single value</SubHead>
      <Frame
        label="trigger · search · list — pick one"
        code={`<Combobox
  options={frameworks}
  value={v} onChange={setV}
  placeholder="Pick a framework"
/>`}
      >
        <div style={{padding:'var(--space-6)', display:'flex', justifyContent:'center'}}>
          <Combobox options={FRAMEWORKS} value={v1} onChange={setV1} placeholder="Pick a framework"/>
        </div>
      </Frame>
      <Lede>Selected value replaces the trigger label. Click again or press Enter on a different option to swap. Press Escape or click outside to dismiss without committing.</Lede>

      {/* Multi */}
      <SubHead meta="multiple">Multi-select</SubHead>
      <Frame
        label="multiple=true — chips below trigger, count inside it"
        code={`<Combobox
  multiple
  options={teams}
  value={ids} onChange={setIds}
  placeholder="Choose teams"
/>`}
      >
        <div style={{padding:'var(--space-6)', display:'flex', justifyContent:'center'}}>
          <Combobox multiple options={TEAMS} value={v2} onChange={setV2} placeholder="Choose teams"/>
        </div>
      </Frame>
      <Lede>Each click toggles. The trigger shows the selected count; chips below let users remove individual values without reopening the panel. Disabled options skip from the keyboard cycle. The prop is <Mono>multiple</Mono> (not <Mono>multi</Mono>).</Lede>

      {/* Grouped */}
      <SubHead meta="groups">Grouped options</SubHead>
      <Frame
        label="pass `groups` instead of `options` — labels rendered above each cluster"
        code={`<Combobox
  groups={[
    { label:'Production', options:[…] },
    { label:'Staging',    options:[…] },
  ]}
  value={region} onChange={setRegion}
/>`}
      >
        <div style={{padding:'var(--space-6)', display:'flex', justifyContent:'center'}}>
          <Combobox groups={GROUPED} value={v3} onChange={setV3} placeholder="Pick a region" width="280px"/>
        </div>
      </Frame>
      <Lede>Search filters within each group — empty groups hide automatically. Use group labels for taxonomy (regions, environments, teams) so users scan the cluster, not the line.</Lede>

      {/* Sizes */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame
        label="sm · md · lg — match Input/Button heights (28 / 36 / 44 px)"
        code={`<Combobox size="sm" … />
<Combobox … />            // md (default)
<Combobox size="lg" … />`}
      >
        <div style={{padding:'var(--space-6)', display:'flex', flexDirection:'column', gap: 'var(--space-3)', alignItems:'center'}}>
          <Combobox size="sm" options={FRAMEWORKS} value={v4} onChange={setV4} placeholder="Small"/>
          <Combobox options={FRAMEWORKS} value={v4} onChange={setV4} placeholder="Default"/>
          <Combobox size="lg" options={FRAMEWORKS} value={v4} onChange={setV4} placeholder="Large"/>
        </div>
      </Frame>

      {/* States */}
      <SubHead meta="states">States</SubHead>
      <Frame label="default · with value · invalid · disabled">
        <div style={{padding:'var(--space-6)', display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 'var(--space-3)', alignItems:'start'}}>
          <Combobox options={FRAMEWORKS} value={null} onChange={() => {}} placeholder="Default"/>
          <Combobox options={FRAMEWORKS} value={v5} onChange={setV5}/>
          <Combobox options={FRAMEWORKS} value={null} onChange={() => {}} invalid placeholder="Required field"/>
          <Combobox options={FRAMEWORKS} value="next" onChange={() => {}} disabled/>
        </div>
      </Frame>
      <Lede>Invalid tints the border and ring <Mono>--danger</Mono>. Pair with a <Mono>.fc-error</Mono> helper line below the field.</Lede>

      {/* As Field */}
      <SubHead meta="composition">In a form field</SubHead>
      <Frame
        label="label + Combobox + helper · same .in-field rhythm as Input"
        code={`<div className="in-field">
  <label className="in-label">Region</label>
  <Combobox groups={regions} value={r} onChange={setR}/>
  <span className="in-help">us-east-1 · default for new resources</span>
</div>`}
      >
        <div style={{padding:'var(--space-6)', display:'flex', flexDirection:'column', gap: 'var(--space-1)', alignItems:'center', minWidth: 320, maxWidth: 320, margin:'0 auto'}}>
          <span className="in-label" style={{alignSelf:'flex-start'}}>Region</span>
          <Combobox groups={GROUPED} value={v6} onChange={setV6} placeholder="Pick a region" full/>
          <span className="in-help" style={{alignSelf:'flex-start'}}>us-east-1 · default for new resources</span>
        </div>
      </Frame>

      {/* Empty state */}
      <SubHead meta="zero state">No matches</SubHead>
      <Frame label="search returns 0 — show a quiet message inside the panel">
        <div style={{padding:'var(--space-6)', display:'flex', justifyContent:'center'}}>
          <Combobox options={FRAMEWORKS} value={v7} onChange={setV7} placeholder="Type 'foo'…"/>
        </div>
      </Frame>
      <Lede>Default fallback is "No matches.". Override with <Mono>emptyText</Mono> if you want a different message.</Lede>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 'var(--space-3)'}}>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 'var(--space-1)'}}>Keyboard</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Enter/Space opens the panel and moves focus to the search input; typing filters. Arrow Down/Up move the active option, Enter commits it, Esc closes and returns focus to the trigger, and Tab also closes. Disabled options are skipped in the cycle; in multi mode each chip's X removes a value.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 'var(--space-1)'}}>Screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The trigger carries <Mono>aria-haspopup="dialog"</Mono> and <Mono>aria-expanded</Mono> — it opens a composite panel (<Mono>role="dialog"</Mono>) containing a search input and a nested <Mono>role="listbox"</Mono> (<Mono>aria-multiselectable</Mono> in multi mode) of <Mono>role="option"</Mono> rows with <Mono>aria-selected</Mono>. The search input is labelled "Search options" and each chip remove button is labelled "Remove {'{'}label{'}'}".</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 'var(--space-1)'}}>Focus &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The trigger shows the ember focus ring (<Mono>--ring</Mono>) whether opened by keyboard or pointer; invalid swaps to <Mono>--ring-danger</Mono> and pairs with a helper line. The selected check sits in ember on a hover surface, and multi chips use ember on ember-soft, both clearing AA.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 'var(--space-1)'}}>Motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The panel rises with <Mono>cb-rise</Mono> and the chevron rotates on <Mono>--dur-fast</Mono>. Under <Mono>prefers-reduced-motion: reduce</Mono> the component-scoped guard on <Mono>.cb-panel</Mono> and <Mono>.cb-trigger .chev</Mono> in <Mono>tokens.css</Mono> suppresses the animation and rotation so the list appears in place instantly.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — value cluster auto-flips; chevron stays (non-directional)'
        code={`<div dir="rtl">
  <Combobox options={…} value={v} onChange={setV}/>
</div>`}
      >
        <div dir="rtl" style={{padding:'var(--space-6)', display:'flex', justifyContent:'center'}}>
          <Combobox options={FRAMEWORKS_AR} value={vAr} onChange={setVAr} placeholder="اختر إطار العمل" searchPlaceholder="بحث…"/>
        </div>
      </Frame>
      <Lede>The trigger uses logical <Mono>padding-inline</Mono> so the value label and trailing slot auto-flip in RTL. The downward chevron is non-directional and does <em>not</em> mirror — it only rotates 180° on open. The panel is placed via <Mono>position: fixed</Mono> at the measured <Mono>getBoundingClientRect()</Mono> of the trigger, not via logical anchoring.</Lede>

      {/* When to use */}
      <SubHead meta="when to use">Combobox vs Select vs Input</SubHead>
      <div className="dd-grid">
        <div className="surface" style={{padding: 'var(--space-4)'}}>
          <div className="ds-h-eyebrow" style={{marginBlockEnd: 'var(--space-1)'}}>Combobox</div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginBlockEnd: 'var(--space-2)'}}>{'≥'} 8 options, search is faster than scan. Multi-select is plausible. Region pickers, framework lists, taggable categories.</div>
          <div className="t-small" style={{color:'var(--fg-subtle)'}}>Reach for it whenever Select would force the user to scroll.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-4)'}}>
          <div className="ds-h-eyebrow" style={{marginBlockEnd: 'var(--space-1)'}}>Select</div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginBlockEnd: 'var(--space-2)'}}>{'≤'} 7 options, single value, the user knows the names. Plan tier, role, status.</div>
          <div className="t-small" style={{color:'var(--fg-subtle)'}}>Lighter chrome — no search needed.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-4)'}}>
          <div className="ds-h-eyebrow" style={{marginBlockEnd: 'var(--space-1)'}}>Input + Autocomplete</div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginBlockEnd: 'var(--space-2)'}}>Free-text with hints. The user can submit a value not in the list (city, address, person not on the team).</div>
          <div className="t-small" style={{color:'var(--fg-subtle)'}}>Combobox enforces the list; Autocomplete only suggests.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-4)'}}>
          <div className="ds-h-eyebrow" style={{marginBlockEnd: 'var(--space-1)'}}>DropdownMenu</div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginBlockEnd: 'var(--space-2)'}}>Command list — actions, not values. Closes on action; no value state. <Mono>role="menu"</Mono> / <Mono>menuitem</Mono>.</div>
          <div className="t-small" style={{color:'var(--fg-subtle)'}}>Use for contextual action menus, not pickers.</div>
        </div>
      </div>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 96px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 260}} aria-hidden="true">
              {/* Static trigger button (no real Combobox — we want a stable, open-state snapshot) */}
              <div className="cb-trigger is-open" style={{width: '100%', cursor:'default'}}>
                <span className="label">Next.js</span>
                <Icons.chevronDown size={14} className="chev" style={{transform:'rotate(180deg)'}}/>
              </div>
              {/* Static panel rendered absolute below the trigger so it stays anchored inside the stage */}
              <div className="cb-panel" style={{position:'absolute', top: 44, left: 0, right: 0, width: 'auto'}}>
                <div className="cb-search">
                  <Icons.search size={14}/>
                  <input readOnly value="" placeholder="Search…"/>
                </div>
                <div className="cb-list">
                  <div className="cb-item is-active"><span className="check"><Icons.check size={12}/></span><span className="label">Next.js</span><span className="meta">next</span></div>
                  <div className="cb-item"><span className="check"/><span className="label">Remix</span><span className="meta">remix</span></div>
                  <div className="cb-item"><span className="check"/><span className="label">Astro</span><span className="meta">astro</span></div>
                  <div className="cb-item is-disabled"><span className="check"/><span className="label">SvelteKit</span><span className="meta">soon</span></div>
                </div>
              </div>

              {/* Lead lines */}
              <span className="lead v" style={{top: -22, left: 16, height: 18}}/>
              <span className="lead h" style={{top: 16, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 76, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 116, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 156, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 200, left: -28, width: 24}}/>

              {/* Numbered pins */}
              <div className="pin" style={{top: -42, left: 16, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: 8, right: -52}}>2</div>
              <div className="pin" style={{top: 68, right: -52}}>3</div>
              <div className="pin" style={{top: 108, left: -52}}>4</div>
              <div className="pin" style={{top: 148, right: -52}}>5</div>
              <div className="pin" style={{top: 192, left: -52}}>6</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'120px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Trigger.</b> <Mono>.cb-trigger</Mono>. Shows the current value (or placeholder). Ember focus ring when open.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Chevron.</b> 14px. Rotates 180° when the panel is open — visual confirmation of state.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Panel.</b> <Mono>.cb-panel</Mono>. <Mono>position: fixed</Mono> so it escapes <Mono>.ds-frame</Mono>'s <Mono>overflow: hidden</Mono> — anchored via <Mono>getBoundingClientRect()</Mono>.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Active row.</b> <Mono>.cb-item.is-active</Mono>. Keyboard highlight follows arrow keys; the check marks the selected option.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Option row.</b> <Mono>.cb-item</Mono>. Label flexes, optional meta (mono, faint) parks on the trailing edge.</span>
            <span className="num">6</span><span><b style={{color:'var(--fg)'}}>Disabled / empty state.</b> <Mono>.cb-item.is-disabled</Mono> dims to 0.5; when the filter matches nothing, <Mono>.cb-empty</Mono> takes the row.</span>
          </div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — search by anything users actually look up</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 'var(--space-2)'}}>
            <Combobox groups={GROUPED} value={null} onChange={() => {}} placeholder="us-east, ireland, oregon…" full/>
          </div>
          <div className="note">Match against label and value (and meta when available). "ireland" finds eu-west-1; "oregon" finds us-west-2 — users don't memorise IDs.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use a Combobox for {'≤'} 4 options</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 'var(--space-2)'}}>
            <Combobox options={[{value:'on',label:'On'},{value:'off',label:'Off'}]} value={v8} onChange={setV8} placeholder="Pick a state" full/>
          </div>
          <div className="note">Two or three options? Use <Mono>Select</Mono> or a RadioGroup. The popover + search is wasted ceremony.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — group when the list has structure</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 'var(--space-2)'}}>
            <Combobox groups={GROUPED} value={null} onChange={() => {}} placeholder="Pick a region" full/>
          </div>
          <div className="note">Production · Staging · Development reads as a hierarchy. Without it the user scans every row to figure out which environment a region belongs to.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — block submission on disabled options</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 'var(--space-2)'}}>
            <Combobox options={TEAMS} value={null} onChange={() => {}} placeholder="Choose a team" full/>
          </div>
          <div className="note">If "Finance" is disabled because the user lacks the role, say so on the option (a meta hint or tooltip), not by silently skipping it.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="ComboboxProps">API reference</SubHead>
      <AutoPropsTable component="Combobox" label="<Combobox />"/>
    </Section>
  );
}
