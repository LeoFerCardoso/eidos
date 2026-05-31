import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Ka as i,qi as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_,v;e((()=>{s=t(n(),1),o(),c=r(),l=[...new Set(i.SERVICES.map(e=>e.tribe))].sort(),u=Object.keys(i.LANGS).sort(),d=[`T1`,`T2`,`T3`],f=(e,t)=>[{id:`tribe`,title:`Tribe`,multi:!0,selected:e.tribes,onToggle:e=>t(`tribes`,e),items:l.map(e=>({value:e,label:e,count:i.SERVICES.filter(t=>t.tribe===e).length}))},{id:`lang`,title:`Language`,multi:!0,selected:e.langs,onToggle:e=>t(`langs`,e),items:u.map(e=>({value:e,label:e,count:i.SERVICES.filter(t=>t.lang===e).length}))},{id:`tier`,title:`Tier`,multi:!1,selected:e.tiers,onToggle:e=>t(`tiers`,e),items:d.map(e=>({value:e,label:e,count:i.SERVICES.filter(t=>t.tier===e).length}))}],p={title:`Elements/FilterPanel`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A grouped facets sidebar: a search input that scopes visible items in real time, grouped checkbox (multi-select) or radio (single-select) facets with optional counts, and a "Clear all" ghost button. The component is fully controlled — the caller owns `selected` Set and `onToggle`.'}}},args:{groups:f({tribes:new Set([`Pix`,`Risk`]),langs:new Set([`Go`]),tiers:new Set},()=>{}),placeholder:`Filter…`},argTypes:{placeholder:{control:`text`}}},m={},h={args:{onClear:()=>{}}},g={render:()=>{let[e,t]=s.useState({tribes:new Set,langs:new Set,tiers:new Set}),[n,r]=s.useState(``),i=(e,n)=>{t(t=>{let r=new Set(t[e]);return r.has(n)?r.delete(n):r.add(n),{...t,[e]:r}})},o=()=>t({tribes:new Set,langs:new Set,tiers:new Set}),l=e.tribes.size+e.langs.size+e.tiers.size;return(0,c.jsxs)(`div`,{style:{display:`flex`,gap:24,alignItems:`flex-start`},children:[(0,c.jsx)(`div`,{style:{width:220},children:(0,c.jsx)(a,{groups:f(e,i),query:n,onQueryChange:r,onClear:l>0?o:void 0})}),(0,c.jsx)(`div`,{style:{flex:1},children:(0,c.jsxs)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`},children:[`Active filters: tribes=[`,[...e.tribes].join(`, `),`] langs=[`,[...e.langs].join(`, `),`] tier=[`,[...e.tiers].join(`, `),`]`]})})]})}},_={render:()=>{let[e,t]=s.useState({tribes:new Set([`Pix`]),langs:new Set,tiers:new Set}),[n,r]=s.useState(``),o=(e,n)=>{t(t=>{let r=new Set(t[e]);return r.has(n)?r.delete(n):r.add(n),{...t,[e]:r}})},l=i.SERVICES.filter(t=>!(e.tribes.size>0&&!e.tribes.has(t.tribe)||e.langs.size>0&&!e.langs.has(t.lang)||e.tiers.size>0&&!e.tiers.has(t.tier)));return(0,c.jsxs)(`div`,{style:{display:`flex`,gap:24,alignItems:`flex-start`},children:[(0,c.jsx)(`div`,{style:{width:220,flexShrink:0},children:(0,c.jsx)(a,{groups:f(e,o),query:n,onQueryChange:r,onClear:()=>t({tribes:new Set,langs:new Set,tiers:new Set})})}),(0,c.jsxs)(`div`,{style:{flex:1},children:[(0,c.jsxs)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:[l.length,` services`]}),l.map(e=>(0,c.jsxs)(`div`,{style:{padding:`6px 0`,borderBottom:`1px solid var(--border)`,fontSize:13},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`},children:e.name}),(0,c.jsxs)(`span`,{style:{marginLeft:8,color:`var(--fg-muted)`,fontSize:11},children:[e.tier,` · `,e.lang]})]},e.id))]})]})}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source},description:{story:`Static snapshot — two tribes + one language pre-selected.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    onClear: () => {}
  }
}`,...h.parameters?.docs?.source},description:{story:'With a "Clear all" button (provide `onClear`).',...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sel, setSel] = React.useState({
      tribes: new Set<string>(),
      langs: new Set<string>(),
      tiers: new Set<string>()
    });
    const [query, setQuery] = React.useState('');
    const toggle = (group: string, value: string) => {
      setSel(prev => {
        const next = new Set(prev[group as keyof typeof prev]);
        if (next.has(value)) next.delete(value);else next.add(value);
        return {
          ...prev,
          [group]: next
        };
      });
    };
    const clear = () => setSel({
      tribes: new Set(),
      langs: new Set(),
      tiers: new Set()
    });
    const totalActive = sel.tribes.size + sel.langs.size + sel.tiers.size;
    return <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start'
    }}>
        <div style={{
        width: 220
      }}>
          <FilterPanel groups={makeGroups(sel, toggle)} query={query} onQueryChange={setQuery} onClear={totalActive > 0 ? clear : undefined} />
        </div>
        <div style={{
        flex: 1
      }}>
          <p style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg-muted)'
        }}>
            Active filters: tribes=[{[...sel.tribes].join(', ')}] langs=[{[...sel.langs].join(', ')}] tier=[{[...sel.tiers].join(', ')}]
          </p>
        </div>
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`Fully interactive — controlled selection and query state.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sel, setSel] = React.useState({
      tribes: new Set<string>(['Pix']),
      langs: new Set<string>(),
      tiers: new Set<string>()
    });
    const [query, setQuery] = React.useState('');
    const toggle = (group: string, value: string) => {
      setSel(prev => {
        const next = new Set(prev[group as keyof typeof prev]);
        if (next.has(value)) next.delete(value);else next.add(value);
        return {
          ...prev,
          [group]: next
        };
      });
    };
    const visibleServices = MOCKS.SERVICES.filter(s => {
      if (sel.tribes.size > 0 && !sel.tribes.has(s.tribe)) return false;
      if (sel.langs.size > 0 && !sel.langs.has(s.lang)) return false;
      if (sel.tiers.size > 0 && !sel.tiers.has(s.tier)) return false;
      return true;
    });
    return <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start'
    }}>
        <div style={{
        width: 220,
        flexShrink: 0
      }}>
          <FilterPanel groups={makeGroups(sel, toggle)} query={query} onQueryChange={setQuery} onClear={() => setSel({
          tribes: new Set(),
          langs: new Set(),
          tiers: new Set()
        })} />
        </div>
        <div style={{
        flex: 1
      }}>
          <p style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg-muted)',
          marginBottom: 8
        }}>
            {visibleServices.length} services
          </p>
          {visibleServices.map(s => <div key={s.id} style={{
          padding: '6px 0',
          borderBottom: '1px solid var(--border)',
          fontSize: 13
        }}>
              <span style={{
            fontFamily: 'var(--font-mono)'
          }}>{s.name}</span>
              <span style={{
            marginLeft: 8,
            color: 'var(--fg-muted)',
            fontSize: 11
          }}>{s.tier} · {s.lang}</span>
            </div>)}
        </div>
      </div>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Filter panel alongside a service list — realistic catalog sidebar layout.`,..._.parameters?.docs?.description}}},v=[`Default`,`WithClear`,`Interactive`,`InContext`]}))();export{m as Default,_ as InContext,g as Interactive,h as WithClear,v as __namedExportsOrder,p as default};