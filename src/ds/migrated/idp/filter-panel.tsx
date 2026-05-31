'use client';
// Eidos DS — Components / FilterPanel
// Sidebar of grouped facets.
import * as React from 'react';
import { AutoPropsTable, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, FilterPanel, Icons, Lede, Mono } from '@/ds/core';


const USAGE = `import { FilterPanel } from "@/components/forge/filter-panel"

const [tiers, setTiers]     = useState(new Set(['T1']))
const [langs, setLangs]     = useState(new Set([]))
const [query, setQuery]     = useState('')

<FilterPanel
  query={query} onQueryChange={setQuery}
  groups={[
    { title: 'Tier',     selected: tiers, multi: true,
      items: [{ value:'T1', label:'T1', count: 14 }, { value:'T2', label:'T2', count: 8 }],
      onToggle: (v) => setTiers(toggleSet(tiers, v)) },
  ]}
/>`;

export default function Page() {
  const [tiers, setTiers] = React.useState(new Set(['T1']));
  const [langs, setLangs] = React.useState(new Set([]));
  const [tribes, setTribes] = React.useState(new Set([]));
  const [q, setQ] = React.useState('');
  const [env, setEnv] = React.useState('prod');
  const [emptyQ, setEmptyQ] = React.useState('graphql');
  const toggle = (setter, current) => (v) => {
    const next = new Set(current);
    if (next.has(v)) next.delete(v); else next.add(v);
    setter(next);
  };
  const groups = [
    { id: 'tier', title: 'Tier', multi: true, selected: tiers, onToggle: toggle(setTiers, tiers),
      items: [{value:'T1',label:'T1 · critical',count:14},{value:'T2',label:'T2 · standard',count:8},{value:'T3',label:'T3 · best-effort',count:3}] },
    { id: 'lang', title: 'Language', multi: true, selected: langs, onToggle: toggle(setLangs, langs),
      items: [{value:'TypeScript',label:'TypeScript',count:8},{value:'Go',label:'Go',count:6},{value:'Python',label:'Python',count:5},{value:'Java',label:'Java',count:3},{value:'Rust',label:'Rust',count:2}] },
    { id: 'tribe', title: 'Tribe', multi: true, selected: tribes, onToggle: toggle(setTribes, tribes),
      items: [{value:'Identity',label:'Identity',count:3},{value:'Pix',label:'Pix',count:4},{value:'Risk',label:'Risk',count:4},{value:'Fraud',label:'Fraud',count:1},{value:'Onboarding',label:'Onboarding',count:3},{value:'Open Finance',label:'Open Finance',count:3},{value:'DataLab',label:'DataLab',count:3},{value:'Telemetry',label:'Telemetry',count:2}] },
  ];
  return (
  <Section id="filter-panel" title="Filter panel" desc="Faceted sidebar for narrowing large collections — service catalog, incident queue, deploy history. Groups of checkboxes or radios with optional counts and an internal search. Fully controlled.">
    <SubHead meta="package managers">Installation</SubHead>
    <TabbedCode tabs={installTabs('filter-panel')} ariaLabel="package manager"/>
    <Lede>Pure controlled component — your page owns the <Mono>selected</Mono> Sets and the search query. The panel renders, the page filters.</Lede>

    <SubHead meta="hello world">Usage</SubHead>
    <Lede>Pass a <Mono>groups</Mono> array of facet sets, each with a controlled <Mono>selected</Mono> Set and an <Mono>onToggle</Mono> callback. The same panel drives a URL-synced list or a client-side table without changing — just swap how the page reacts to the emitted toggles.</Lede>
    <Frame label="catalog filters (live)" code={USAGE}>
      <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap: 16}}>
        <FilterPanel query={q} onQueryChange={setQ} groups={groups} onClear={()=>{setTiers(new Set()); setLangs(new Set()); setTribes(new Set());}}/>
        <div style={{padding: 14, border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', background:'var(--bg)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
          <div style={{color:'var(--fg-faint)', marginBottom: 6}}>FILTERS</div>
          <div>tiers  = [{[...tiers].join(', ')}]</div>
          <div>langs  = [{[...langs].join(', ')}]</div>
          <div>tribes = [{[...tribes].join(', ')}]</div>
          <div>query  = "{q}"</div>
        </div>
      </div>
    </Frame>

    <SubHead meta="single-pick">Radio (single-select) group</SubHead>
    <Lede>Omit <Mono>multi</Mono> (or set <Mono>multi=false</Mono>) and the group renders as a native radio set — exactly one value at a time. Picking a new option clears the previous one; the arrow keys move the selection within the group.</Lede>
    <Frame label="multi=false renders radios — live, exactly one selected">
      <FilterPanel groups={[
        { id:'env', title:'Environment', selected: new Set([env]),
          onToggle: (v) => setEnv(v), items: [
          { value:'dev',   label:'Development', count: 4 },
          { value:'stage', label:'Staging',     count: 2 },
          { value:'prod',  label:'Production',   count: 11 },
        ]},
      ]}/>
    </Frame>

    <SubHead meta="search → zero results">Empty state</SubHead>
    <Lede>When the search query filters every facet out of every group, the panel keeps its header and search field and shows a single quiet <Mono>Empty</Mono> region instead of a blank column — so the user knows the filter ran and matched nothing, rather than seeing an apparently broken panel.</Lede>
    <Frame label='try clearing the search — "graphql" matches no facet'>
      <div style={{display:'grid', gridTemplateColumns:'minmax(0, 240px)', gap: 0}}>
        <FilterPanel query={emptyQ} onQueryChange={setEmptyQ} groups={groups}/>
      </div>
    </Frame>

    <SubHead meta="a11y">Accessibility</SubHead>
    <div className="ds-grid cols-2" style={{marginTop: 12}}>
      <div className="surface" style={{padding: 18}}>
        <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
        <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every facet is a native input. <Mono>Tab</Mono> / <Mono>Shift+Tab</Mono> walk the panel top-to-bottom — search field, then each facet, then <i>Clear all</i>. <Mono>Space</Mono> toggles a checkbox. In a single-select group the facets share one <Mono>name</Mono>, so <Mono>↑</Mono>/<Mono>↓</Mono>/<Mono>←</Mono>/<Mono>→</Mono> move the selection within that group and <Mono>Tab</Mono> jumps past it as one stop — standard radio-group semantics.</div>
      </div>
      <div className="surface" style={{padding: 18}}>
        <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
        <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each group is a labelled region — <Mono>role="group"</Mono> with its title as the <Mono>aria-labelledby</Mono> name — so a facet announces in context as "Tier group, T1 critical, 14, checkbox". The per-facet count is part of the accessible label rather than decorative text. The search input is labelled <Mono>aria-label="Filter facets"</Mono>, and when it matches nothing the empty region is read out instead of leaving silence.</div>
      </div>
      <div className="surface" style={{padding: 18}}>
        <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
        <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A selected facet is conveyed by the native checked state (and its check / dot mark), not by tint alone — so selection survives greyscale. Counts are text; the label and count both meet AA contrast, including the muted count digits against the panel surface.</div>
      </div>
      <div className="surface" style={{padding: 18}}>
        <div style={{fontWeight: 600, marginBottom: 6}}>Density, focus &amp; motion</div>
        <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The whole label row is the click/hit target, kept at the minimum size, with a visible focus ring on the control. Filtering is an instant in-place re-render — there is no entrance/exit animation, so the panel is unaffected by <Mono>prefers-reduced-motion</Mono>. Cap a group at ~6 visible facets behind a "Show more" so the list stays keyboard-traversable without endless tabbing — lean on search for the long tail.</div>
      </div>
    </div>

    <SubHead meta="RTL · العربية">RTL</SubHead>
    <Frame label='dir="rtl" — labels, checkboxes, and counts align to the right; the search icon mirrors'>
      <div dir="rtl" style={{ maxWidth: 220 }}>
        <FilterPanel
          query=""
          onQueryChange={() => {}}
          onClear={() => {}}
          groups={[
            { id: 'tier', title: 'الطبقة', multi: true, selected: new Set(['T1']), onToggle: () => {},
              items: [{ value: 'T1', label: 'T1 · حرج', count: 14 }, { value: 'T2', label: 'T2 · قياسي', count: 8 }, { value: 'T3', label: 'T3 · مجهود أفضل', count: 3 }] },
            { id: 'lang', title: 'اللغة', multi: true, selected: new Set([]), onToggle: () => {},
              items: [{ value: 'TypeScript', label: 'TypeScript', count: 8 }, { value: 'Go', label: 'Go', count: 6 }] },
          ]}
        />
      </div>
    </Frame>
    <Lede>
      FilterPanel uses labelled <Mono>role="group"</Mono> regions and logical CSS so the entire panel mirrors under <Mono>dir="rtl"</Mono> — group headings, label text, count numerals, and the "Clear all" ghost button all align from the right. Checkboxes appear at the inline-start (right) edge per platform convention in RTL locales.
    </Lede>

    {/* ====================================================================
        ANATOMY
        ==================================================================== */}
    <SubHead meta="anatomy">Anatomy</SubHead>
    <div className="ds-frame">
      <div className="ds-frame-head"><span className="label">anatomy</span></div>
      <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
        <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
            <FilterPanel
              query=""
              onQueryChange={() => {}}
              onClear={() => {}}
              groups={[
                { id: 'tier', title: 'Tier', multi: true, selected: new Set(['T1']), onToggle: () => {},
                  items: [{ value: 'T1', label: 'T1 · critical', count: 14 }, { value: 'T2', label: 'T2 · standard', count: 8 }] },
                { id: 'env',  title: 'Environment', selected: new Set(['prod']), onToggle: () => {},
                  items: [{ value: 'dev', label: 'Development', count: 1 }, { value: 'prod', label: 'Production', count: 1 }] },
              ]}
            />
            {/* pin 1 — search input, top of panel */}
            <span className="lead h" style={{ top: 14, right: -32, width: 28 }} />
            <div className="pin" style={{ top: 6, right: -56 }}>1</div>
            {/* pin 2 — group heading, above first group title */}
            <span className="lead h" style={{ top: 58, right: -32, width: 28 }} />
            <div className="pin" style={{ top: 50, right: -56 }}>2</div>
            {/* pin 3 — checkbox row, pointing at first facet */}
            <span className="lead h" style={{ top: 86, right: -32, width: 28 }} />
            <div className="pin" style={{ top: 78, right: -56 }}>3</div>
            {/* pin 4 — count badge, pointing at the count on the first facet */}
            <span className="lead v" style={{ bottom: -26, left: 30, height: 20 }} />
            <div className="pin" style={{ bottom: -48, left: 30, transform: 'translateX(-50%)' }}>4</div>
            {/* pin 5 — Clear all button */}
            <span className="lead v" style={{ top: -26, left: 30, height: 20 }} />
            <div className="pin" style={{ top: -48, left: 30, transform: 'translateX(-50%)' }}>5</div>
          </div>
        </div>
        <div className="ana-list" style={{ maxWidth: 580, margin: '72px auto 0' }}>
          <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Search input.</b> Scopes the visible facets in real time without a submit. Labelled via <Mono>aria-label</Mono> so screen readers announce "Filter" when focused. Controlled via <Mono>query</Mono> + <Mono>onQueryChange</Mono>.</span>
          <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Group heading.</b> The list is a labelled <Mono>role="group"</Mono> region named by this title via <Mono>aria-labelledby</Mono>, so each facet announces its group ("Tier group, T1 critical, 14, checkbox"). One heading per facet domain.</span>
          <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Checkbox row (multi) / radio row (single).</b> Native inputs — <Mono>multi=true</Mono> renders checkboxes, <Mono>multi=false</Mono> renders radios. The full label row is the hit target, kept at the minimum touch size.</span>
          <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Count.</b> Muted Geist Mono numeral trailing each label. Part of the accessible name ("14") so assistive tech reads "T1 critical, 14, checkbox, checked". Omit when the total is unknown or irrelevant.</span>
          <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Clear all.</b> Ghost button that appears only when <Mono>onClear</Mono> is provided and at least one selection is active. Resets all Sets in one action — keeps keyboard-traversable lists short.</span>
        </div>
      </div>
    </div>

    <SubHead meta="rules">Do / Don't</SubHead>
    <div className="dd-grid">
      <div className="dd-card do">
        <div className="head"><Icons.check size={12}/> Do — show counts when known</div>
        <div className="body" style={{padding:0}}>
          <FilterPanel groups={[{ id:'a', title:'Tier', selected: new Set(['T1']), multi: true, onToggle: ()=>{}, items: [{value:'T1',label:'T1',count:14},{value:'T2',label:'T2',count:8}] }]}/>
        </div>
        <div className="note">Counts tell users which facets are worth picking.</div>
      </div>
      <div className="dd-card dont">
        <div className="head"><Icons.x size={12}/> Don't — leave {'>'} 8 facets visible per group</div>
        <div className="body" style={{padding:0, maxHeight: 220, overflow: 'auto'}}>
          <FilterPanel groups={[{ id:'g', title:'Tag', selected: new Set([]), multi: true, onToggle: ()=>{}, items: Array.from({length: 20}, (_,i)=>({value:'t'+i,label:'tag-'+i,count: 1+i})) }]}/>
        </div>
        <div className="note">Surface the top 6, hide the rest behind "Show more" — and rely on the search.</div>
      </div>
    </div>

    <SubHead meta="FilterPanelProps">API reference</SubHead>
    <AutoPropsTable component="FilterPanel" label="<FilterPanel />"/>
    <PropsTable
      label="Group"
      rows={[
        { prop: 'title',    type: 'string',  description: 'Group heading.' },
        { prop: 'items',    type: 'Item[]',  description: 'Facets: { value, label, count? }.' },
        { prop: 'selected', type: 'Set<string>', description: 'Currently-selected values.' },
        { prop: 'multi',    type: 'boolean', default: 'false', description: 'Multi-select (checkboxes) vs single (radios).' },
        { prop: 'onToggle', type: '(value) => void', description: 'Fires when a facet is toggled.' },
      ]}
    />
  </Section>
  ); }
