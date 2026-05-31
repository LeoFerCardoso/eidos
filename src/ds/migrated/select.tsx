'use client';
// Eidos DS — Components / Select
// Custom-rendered single-value picker. Reach for it when the native
// <select> isn't enough — when you need icons, descriptions, or grouped
// options. For typeahead and multi-select, see Combobox.
//
// Sections:
//   1. Installation
//   2. Usage
//   3. Examples (Variants · Searchable · Grouped · Sizes · States)
//   4. Boundary: Select vs Combobox vs DropdownMenu
//   5. Accessibility
//   6. RTL
//   7. Anatomy
//   8. Do / Don't
//   9. API reference
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, installTabs, Lede, Mono, Select } from '@/ds/core';

// ── Demo data ────────────────────────────────────────────────────────────────

const STATUS_OPTS = [
  { value: 'open',     label: 'Open',        icon: Icons.eye,    description: 'Available for assignment' },
  { value: 'inprog',   label: 'In progress', icon: Icons.zap },
  { value: 'review',   label: 'Review',      icon: Icons.check },
  { value: 'archived', label: 'Archived',    icon: Icons.folder, disabled: true },
];

const TZ_OPTS = [
  { value: 'sao', label: 'São Paulo · GMT−3' },
  { value: 'nyc', label: 'New York · GMT−5'  },
  { value: 'lon', label: 'London · GMT+0'    },
  { value: 'mad', label: 'Madrid · GMT+1'    },
  { value: 'ber', label: 'Berlin · GMT+1'    },
  { value: 'ist', label: 'Istanbul · GMT+3'  },
  { value: 'jak', label: 'Jakarta · GMT+7'   },
  { value: 'syd', label: 'Sydney · GMT+11'   },
];

const TEAM_GROUPS = [
  { label: 'Product', options: [
    { value: 'platform', label: 'Platform engineering', icon: Icons.cpu,     description: '12 members · São Paulo' },
    { value: 'design',   label: 'Design',               icon: Icons.sparkle, description: '8 members · São Paulo + NYC' },
    { value: 'data',     label: 'Data',                 icon: Icons.gauge,   description: '6 members · remote' },
  ]},
  { label: 'Go-to-market', options: [
    { value: 'sales', label: 'Sales',            icon: Icons.trending },
    { value: 'mktg',  label: 'Marketing',        icon: Icons.flame },
    { value: 'cs',    label: 'Customer success', icon: Icons.shield },
  ]},
  { label: 'Operations', options: [
    { value: 'finance', label: 'Finance', icon: Icons.book },
    { value: 'people',  label: 'People',  icon: Icons.user, disabled: true },
  ]},
];

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import { Select } from "@eidos/ui"

export function Demo() {
  const [value, setValue] = React.useState('open');
  return (
    <Select
      value={value}
      onValueChange={setValue}
      options={[
        { value: 'open',   label: 'Open',        icon: Icons.eye,
          description: 'Available for assignment' },
        { value: 'inprog', label: 'In progress', icon: Icons.zap },
        { value: 'review', label: 'Review',      icon: Icons.check },
      ]}
    />
  );
}`;

export default function Page() {
  const [status, setStatus] = React.useState('open');
  const [tz, setTz] = React.useState('sao');
  const [team, setTeam] = React.useState('platform');
  const [statusAr, setStatusAr] = React.useState('open');
  const [empty, setEmpty] = React.useState<string | undefined>(undefined);

  return (
    <Section
      id="select"
      num="22"
      title="Select"
      desc="Custom single-value picker. Reach for it when you need icons, descriptions, or grouped options. For typeahead and multi-select, see Combobox."
    >
      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('select')} ariaLabel="package manager"/>
      <Lede>
        The CLI copies <Mono>select.tsx</Mono> and the <Mono>.sel-*</Mono> CSS into your repo. The only baseline dep is <Mono>cn()</Mono>. Pick the <em>Manual</em> tab to paste the source files instead.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <div style={{minWidth: 240}}>
          <Select value="open" onValueChange={() => {}} options={STATUS_OPTS}/>
        </div>
      </Frame>

      {/* ====================================================================
          3. EXAMPLES
          ==================================================================== */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 'var(--space-8)', marginBlockEnd: 'var(--space-1)' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* Default + empty + disabled */}
      <SubHead meta="basic">Default</SubHead>
      <Frame
        label="single-value picker — click to open, click to choose"
        code={`<Select
  label="Status"
  value={status}
  onValueChange={setStatus}
  options={STATUS_OPTS}
  help="Pick the work state for this row."
/>
<Select value={undefined} onValueChange={…} options={STATUS_OPTS} placeholder="Choose a status…"/>
<Select value="open" onValueChange={() => {}} options={STATUS_OPTS} disabled/>`}
        row
      >
        <div style={{display:'flex', gap: 16, alignItems:'flex-start', flexWrap:'wrap', minHeight: 280}}>
          <Select
            label="Status"
            value={status}
            onValueChange={setStatus}
            options={STATUS_OPTS}
            help="Pick the work state for this row."
          />
          <Select
            label="Empty"
            value={empty}
            onValueChange={setEmpty}
            options={STATUS_OPTS}
            placeholder="Choose a status…"
          />
          <Select
            label="Disabled"
            value="open"
            onValueChange={() => {}}
            options={STATUS_OPTS}
            disabled
          />
        </div>
      </Frame>

      {/* Searchable */}
      <SubHead meta="searchable">With search</SubHead>
      <Frame
        label="set searchable when the list is {'>'} ~10 items"
        code={`<Select
  label="Timezone"
  value={tz}
  onValueChange={setTz}
  searchable
  options={TZ_OPTS}
  help="Type to filter all 8 supported zones."
/>`}
        row
      >
        <div style={{display:'flex', gap: 16, alignItems:'flex-start', flexWrap:'wrap', minHeight: 320}}>
          <Select
            label="Timezone"
            value={tz}
            onValueChange={setTz}
            options={TZ_OPTS}
            searchable
            help="Type to filter all 8 supported zones."
          />
        </div>
      </Frame>

      {/* Grouped */}
      <SubHead meta="grouped">Option groups</SubHead>
      <Frame
        label="pass groups instead of options to add labelled categories"
        code={`<Select
  label="Team"
  value={team}
  onValueChange={setTeam}
  searchable
  groups={[
    { label: 'Product', options: [
      { value: 'platform', label: 'Platform engineering', icon: Icons.cpu,
        description: '12 members · São Paulo' },
      /* … */
    ]},
    /* … */
  ]}
/>`}
        row
      >
        <div style={{display:'flex', gap: 16, flexWrap:'wrap', minHeight: 360}}>
          <Select
            label="Team"
            value={team}
            onValueChange={setTeam}
            groups={TEAM_GROUPS}
            searchable
          />
        </div>
      </Frame>

      {/* Sizes */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame
        label="three sizes — matches the .btn height scale (26 / 32 / 40 px)"
        code={`<Select size="sm" value={v} onValueChange={setV} options={opts}/>
<Select           value={v} onValueChange={setV} options={opts}/>   {/* md (default) */}
<Select size="lg" value={v} onValueChange={setV} options={opts}/>`}
        row
      >
        <div style={{display:'flex', gap: 12, alignItems:'center', flexWrap:'wrap', minHeight: 220}}>
          <Select size="sm" value={status} onValueChange={setStatus} options={STATUS_OPTS}/>
          <Select           value={status} onValueChange={setStatus} options={STATUS_OPTS}/>
          <Select size="lg" value={status} onValueChange={setStatus} options={STATUS_OPTS}/>
        </div>
      </Frame>

      {/* States */}
      <SubHead meta="states">States</SubHead>
      <Frame
        label="default · invalid · disabled"
        code={`<Select value={v} onValueChange={setV} options={opts}/>
<Select value={undefined} onValueChange={setV} options={opts}
  invalid error="Status is required."/>
<Select value="open" onValueChange={() => {}} options={opts} disabled/>`}
        row
      >
        <div style={{display:'flex', gap: 16, alignItems:'flex-start', flexWrap:'wrap', minHeight: 220}}>
          <Select value={status} onValueChange={setStatus} options={STATUS_OPTS} label="Default"/>
          <Select value={undefined} onValueChange={() => {}} options={STATUS_OPTS}
            label="Invalid" invalid error="Status is required."/>
          <Select value="open" onValueChange={() => {}} options={STATUS_OPTS} label="Disabled" disabled/>
        </div>
      </Frame>

      {/* ====================================================================
          4. BOUNDARY: SELECT vs COMBOBOX vs DROPDOWN
          ==================================================================== */}
      <SubHead meta="when to use">Select vs Combobox vs DropdownMenu</SubHead>
      <Lede up>
        Three distinct patterns — choose the one that matches the interaction model, not just the visual shape.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Decision matrix</span></div>
        <table className="spec" style={{margin: 0}}>
          <thead><tr>
            <th style={{padding:'10px 12px'}}>Component</th>
            <th>ARIA role</th>
            <th>Search</th>
            <th>Multi</th>
            <th>Custom render</th>
            <th>Best for</th>
          </tr></thead>
          <tbody>
            <tr>
              <td className="tok-name">NativeSelect</td>
              <td className="mono">combobox (native)</td>
              <td className="mono">no</td>
              <td className="mono">no</td>
              <td className="mono">no</td>
              <td>Short plain lists, mobile-first, system look-and-feel.</td>
            </tr>
            <tr>
              <td className="tok-name">Select</td>
              <td><code>button</code> + <code>listbox</code></td>
              <td className="mono">opt-in</td>
              <td className="mono">no</td>
              <td className="mono">icon + desc</td>
              <td>1-of-N from a closed set with icons, descriptions, or grouping. The 80% case.</td>
            </tr>
            <tr>
              <td className="tok-name">Combobox</td>
              <td><code>button</code> + <code>listbox</code></td>
              <td className="mono">always</td>
              <td className="mono">yes (chips)</td>
              <td className="mono">yes</td>
              <td>Typeahead, free-text filter, multi-select, large catalogs.</td>
            </tr>
            <tr>
              <td className="tok-name">DropdownMenu</td>
              <td><code>button</code> + <code>menu/menuitem</code></td>
              <td className="mono">no</td>
              <td className="mono">no</td>
              <td className="mono">icons</td>
              <td>Command list (actions, not values). Closes on action; no value state.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          5. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            <Mono>Space</Mono>, <Mono>Enter</Mono>, or <Mono>ArrowDown</Mono> opens the listbox. <Mono>ArrowDown</Mono> / <Mono>ArrowUp</Mono> move the active option. <Mono>Enter</Mono> selects and closes; <Mono>Escape</Mono> closes without committing and returns focus to the trigger. <Mono>Tab</Mono> also closes. The search input (when <Mono>searchable</Mono>) receives focus automatically on open.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            The trigger is a <Mono>button</Mono> with <Mono>aria-haspopup="listbox"</Mono> and <Mono>aria-expanded</Mono>; the popup is <Mono>role="listbox"</Mono> and each row is <Mono>role="option"</Mono> with <Mono>aria-selected</Mono>. Option groups use <Mono>role="group"</Mono> with an aria-label. Disabled rows carry the native <Mono>disabled</Mono> attribute.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            The trigger and active option show the ember focus ring (<Mono>--ring</Mono>). The selected check and option text meet AA (4.5:1) on the popover surface in both themes. Invalid state swaps to <Mono>--ring-danger</Mono>. The active-row highlight is a surface tint, never the sole position indicator.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            The panel fade + slide on open is brief and eased with <Mono>--ease</Mono>. Under <Mono>prefers-reduced-motion: reduce</Mono> the component-scoped guard on <Mono>.sel-panel</Mono> in <Mono>tokens.css</Mono> suppresses the animation so the listbox appears instantly with no transform.
          </div>
        </div>
      </div>

      {/* ====================================================================
          6. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — chevron lands on the leading edge automatically'
        code={`<div dir="rtl">
  <Select
    value={status}
    onValueChange={setStatus}
    options={[
      { value: 'open',   label: 'مفتوح',       icon: Icons.eye },
      { value: 'review', label: 'مراجعة',       icon: Icons.check },
    ]}
  />
</div>`}
        row
      >
        <div dir="rtl" style={{display:'flex', gap: 16, flexWrap:'wrap', minHeight: 280}}>
          <Select
            label="الحالة"
            value={statusAr}
            onValueChange={setStatusAr}
            options={[
              { value: 'open',     label: 'مفتوح',       icon: Icons.eye,    description: 'متاح للتعيين' },
              { value: 'inprog',   label: 'قيد التنفيذ', icon: Icons.zap },
              { value: 'review',   label: 'مراجعة',      icon: Icons.check },
              { value: 'archived', label: 'مؤرشف',       icon: Icons.folder, disabled: true },
            ]}
          />
          <Select
            label="المنطقة الزمنية"
            searchable
            value={tz}
            onValueChange={setTz}
            options={[
              { value:'sao', label:'ساو باولو · GMT−3' },
              { value:'nyc', label:'نيويورك · GMT−5' },
              { value:'lon', label:'لندن · GMT+0' },
              { value:'mad', label:'مدريد · GMT+1' },
              { value:'ist', label:'إسطنبول · GMT+3' },
            ]}
          />
        </div>
      </Frame>
      <Lede>
        The trigger uses <Mono>justify-content: space-between</Mono> + <Mono>flex</Mono>, so the value cluster lands at the inline-start edge and the chevron at the inline-end. Under <Mono>dir="rtl"</Mono> these swap automatically — no explicit override needed.
      </Lede>

      {/* ====================================================================
          7. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{padding: 36}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div style={{position:'relative', width: 280}}>
              {/* Trigger snapshot */}
              <button
                className="sel-trigger is-open"
                type="button"
                style={{width:'100%', cursor:'default'}}
                aria-haspopup="listbox"
                aria-expanded={true}
                tabIndex={-1}
              >
                <span className="sel-value"><Icons.eye size={14} color="var(--fg-muted)"/><span>Open</span></span>
                <Icons.chevronDown size={14} className="sel-chev" style={{transform:'rotate(180deg)'}}/>
              </button>
              {/* Static panel */}
              <div className="sel-panel" style={{position:'static', marginTop: 4, animation:'none', maxHeight: 'none'}}>
                <div className="sel-search">
                  <Icons.search size={14} color="var(--fg-faint)"/>
                  <input placeholder="Search…" readOnly tabIndex={-1}/>
                </div>
                <div className="sel-list">
                  <div className="sel-group-label">Active</div>
                  <button className="sel-option is-selected" type="button" tabIndex={-1} style={{cursor:'default'}}>
                    <span className="left"><Icons.eye size={14} className="ico"/><span>Open</span></span>
                    <Icons.check size={14} className="check"/>
                  </button>
                  <button className="sel-option is-active" type="button" tabIndex={-1} style={{cursor:'default'}}>
                    <span className="left"><Icons.zap size={14} className="ico"/><span>In progress</span></span>
                    <Icons.check size={14} className="check"/>
                  </button>
                </div>
              </div>
              {/* Pins */}
              <div className="pin" style={{top: 6, left: -22}}>1</div>
              <div className="pin" style={{top: 6, right: -22}}>2</div>
              <div className="pin" style={{top: 56, left: -22}}>3</div>
              <div className="pin" style={{top: 90, left: -22}}>4</div>
              <div className="pin" style={{top: 130, right: -22}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 600, margin:'24px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Trigger.</b> 32px tall (matches <Mono>.btn</Mono>). Shows current value with optional icon. Faint placeholder when empty.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Chevron.</b> Rotates 180° when open. Always at the trailing edge regardless of LTR / RTL.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Search (optional).</b> Enabled via <Mono>searchable</Mono>. Auto-focused on open; filters both <Mono>label</Mono> and <Mono>description</Mono>.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Group label.</b> Mono uppercase at <Mono>--text-xs</Mono>. Use only when categories are semantically meaningful.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Selected check.</b> Ember check at the trailing edge of the active option. Exactly one check at a time.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          8. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — describe ambiguous options</div>
          <div className="body" style={{padding: 14}}>
            <div className="sel-panel" style={{position:'static', boxShadow:'none', animation:'none'}}>
              <div className="sel-list">
                <button className="sel-option" type="button" tabIndex={-1} style={{cursor:'default'}}>
                  <span className="left"><Icons.eye size={14} className="ico"/><span style={{minWidth:0}}>
                    <span style={{display:'block'}}>Open</span>
                    <span className="desc">Available for assignment</span>
                  </span></span>
                </button>
              </div>
            </div>
          </div>
          <div className="note">A short description disambiguates similarly-named statuses ("Review" vs "In review"). Keep it to 6 words.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use a custom Select for short plain lists</div>
          <div className="body" style={{padding: 14}}>
            <select style={{padding: '6px 8px', background:'var(--surface)', color:'var(--fg)', border:'1px solid var(--border-strong)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-base)'}}>
              <option>Yes</option><option>No</option><option>Maybe</option>
            </select>
          </div>
          <div className="note">3–5 plain strings? Use <Mono>NativeSelect</Mono>. It wins on mobile, zero JS, and native a11y — no overhead needed.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use searchable on lists with {'>'}10 items</div>
          <div className="body" style={{padding: 14, minHeight: 80, display:'flex', alignItems:'center'}}>
            <Select
              searchable
              value={tz}
              onValueChange={setTz}
              options={TZ_OPTS}
              placeholder="Filter timezones…"
            />
          </div>
          <div className="note">Without search, users must scroll a long list. With it, two keystrokes filters to a match.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use Select for multi-select</div>
          <div className="body" style={{padding: 14, minHeight: 80, display:'flex', alignItems:'center', color:'var(--fg-faint)', fontSize:'var(--text-base)'}}>
            Select enforces single value only.
          </div>
          <div className="note">Multi-select belongs in <Mono>Combobox</Mono> (<Mono>multiple</Mono> prop). Select will never accept an array — by design.</div>
        </div>
      </div>

      {/* ====================================================================
          9. API REFERENCE
          ==================================================================== */}
      <SubHead meta="SelectProps">API reference</SubHead>
      <AutoPropsTable component="Select" label="<Select />"/>
      <PropsTable
        label="SelectOption"
        rows={[
          { prop: 'value',       type: 'string', required: true, description: 'Unique key — passed to onValueChange.' },
          { prop: 'label',       type: 'string', required: true, description: 'Display text.' },
          { prop: 'icon',        type: 'ComponentType', description: 'Leading icon component (14px).' },
          { prop: 'description', type: 'string', description: 'Short sub-line below the label.' },
          { prop: 'disabled',    type: 'boolean', description: 'Dims the option and makes it non-interactive.' },
        ]}
      />
    </Section>
  );
}
