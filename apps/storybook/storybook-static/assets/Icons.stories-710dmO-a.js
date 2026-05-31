import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Wa as r,t as i}from"./src-DgoylXRw.js";function a({keys:e,size:t=20,color:n,strokeWidth:i}){return(0,o.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(88px, 1fr))`,gap:8,fontFamily:`var(--font-mono)`},children:e.map(e=>{let a=r[e];return(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6,padding:`10px 6px`,borderRadius:6,border:`1px solid var(--border)`,background:`var(--surface)`,color:`var(--fg)`},children:[(0,o.jsx)(a,{size:t,color:n,strokeWidth:i}),(0,o.jsx)(`span`,{style:{fontSize:9,color:`var(--fg-muted)`,textAlign:`center`,wordBreak:`break-all`,lineHeight:1.3},children:e})]},e)})})}var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{t(),i(),o=n(),s={title:`Icons/Icons`,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"Forge icon primitives — Lucide-style 24×24 stroke glyphs shared across every Forge DS surface (core, charts, AI, IDP, DevOps). Each key in the `Icons` map is a React component accepting `size` (default 16), `color` (default `currentColor`), and `strokeWidth` (default 1.5). Use the semantic groupings — Navigation, Editing, DevOps, Agent / AI — to pick the right glyph for a given affordance rather than reaching for a generic shape."}}}},c=[`home`,`catalog`,`rocket`,`gauge`,`trending`,`book`,`clipboard`,`layers`,`plug`,`chevronRight`,`chevronLeft`,`chevronDown`,`chevronUp`,`arrowRight`,`arrowLeft`,`arrowUp`,`arrowDown`],l=[`edit`,`trash`,`copy`,`link`,`externalLink`,`share`,`download`,`upload`,`paperclip`,`file`,`doc`,`folder`],u=[`deploy`,`rollback`,`pipeline`,`merge`,`commit`,`tag`,`gate`,`branch`,`gitFork`,`gitPullRequest`,`ring`,`container`,`server`,`database`,`terminal`,`cloud`,`package`,`workflow`],d=[`agent`,`mcpServer`,`toolCall`,`prompt`,`vector`,`bot`,`cpu`,`zap`,`sparkle`,`fn`,`queue`,`region`,`key`,`network`],f=[`incident`,`score`,`compliance`,`auditLog`,`runbook`,`slo`,`flag`,`shield`,`lock`,`lockKey`,`target`,`pulse`,`activity`],p={render:()=>(0,o.jsx)(a,{keys:c})},m={render:()=>{let e=[`deploy`,`agent`,`incident`,`pipeline`,`toolCall`];return(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24},children:[12,16,20,24,32].map(t=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16},children:[(0,o.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,color:`var(--fg-muted)`,width:28,flexShrink:0},children:[t,`px`]}),e.map(e=>{let n=r[e];return(0,o.jsx)(`div`,{style:{color:`var(--fg)`,display:`flex`,alignItems:`center`},children:(0,o.jsx)(n,{size:t})},e)})]},t))})}},h={render:()=>{let e=[`deploy`,`agent`,`incident`,`pipeline`,`server`,`toolCall`,`commit`,`compliance`,`vector`,`workflow`];return(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20},children:[{label:`Default (1.5sw)`,strokeWidth:1.5},{label:`Thin (1.0sw)`,strokeWidth:1},{label:`Bold (2.0sw)`,strokeWidth:2},{label:`Accent (ember)`,color:`var(--accent)`,strokeWidth:1.5},{label:`Muted`,color:`var(--fg-muted)`,strokeWidth:1.5}].map(({label:t,color:n,strokeWidth:i,bg:a,fg:s})=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8},children:[(0,o.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:t}),(0,o.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16,padding:`12px 16px`,borderRadius:6,border:`1px solid var(--border)`,background:a??`var(--surface)`,color:s??n??`var(--fg)`},children:e.map(e=>{let t=r[e];return(0,o.jsx)(t,{size:20,color:n,strokeWidth:i},e)})})]},t))})}},g={render:()=>(0,o.jsx)(a,{keys:u})},_={render:()=>(0,o.jsx)(a,{keys:d})},v={render:()=>(0,o.jsx)(a,{keys:f})},y={render:()=>(0,o.jsx)(a,{keys:l})},b={render:()=>{let e=r.deploy;return(0,o.jsx)(`div`,{style:{display:`flex`,gap:12,flexWrap:`wrap`},children:[{label:`default surface`,bg:`var(--surface)`,iconColor:`var(--fg)`},{label:`ember / accent`,bg:`var(--accent)`,iconColor:`var(--bg)`},{label:`dark ink`,bg:`#08090A`,iconColor:`var(--fg)`},{label:`success fill`,bg:`var(--green)`,iconColor:`var(--bg)`},{label:`warning fill`,bg:`var(--yellow)`,iconColor:`var(--bg)`},{label:`critical fill`,bg:`var(--red)`,iconColor:`var(--bg)`}].map(({label:t,bg:n,iconColor:r})=>(0,o.jsxs)(`div`,{style:{background:n,borderRadius:10,padding:`16px 20px`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8,minWidth:96},children:[(0,o.jsx)(e,{size:24,color:r}),(0,o.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:9,color:r,textAlign:`center`},children:t})]},t))})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <IconGrid keys={NAV_ICONS} />
}`,...p.parameters?.docs?.source},description:{story:`Default — the core navigation and UI glyphs at 20px with default stroke.
These appear in sidebars, breadcrumbs, and tab bars across all Forge surfaces.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const SAMPLE: (keyof typeof Icons)[] = ['deploy', 'agent', 'incident', 'pipeline', 'toolCall'];
    const sizes = [12, 16, 20, 24, 32] as const;
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }}>
        {sizes.map(s => <div key={s} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
            <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--fg-muted)',
          width: 28,
          flexShrink: 0
        }}>
              {s}px
            </span>
            {SAMPLE.map(name => {
          const IconComponent = Icons[name];
          return <div key={name} style={{
            color: 'var(--fg)',
            display: 'flex',
            alignItems: 'center'
          }}>
                  <IconComponent size={s} />
                </div>;
        })}
          </div>)}
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Sizes — every icon accepts a numeric \`size\` prop. At 16px glyphs render
inline with body text; at 24px they anchor action buttons; at 32px they
work as section headers and empty-state illustrations.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const SAMPLE: (keyof typeof Icons)[] = ['deploy', 'agent', 'incident', 'pipeline', 'server', 'toolCall', 'commit', 'compliance', 'vector', 'workflow'];
    const variants: {
      label: string;
      color?: string;
      strokeWidth?: number;
      bg?: string;
      fg?: string;
    }[] = [{
      label: 'Default (1.5sw)',
      strokeWidth: 1.5
    }, {
      label: 'Thin (1.0sw)',
      strokeWidth: 1.0
    }, {
      label: 'Bold (2.0sw)',
      strokeWidth: 2.0
    }, {
      label: 'Accent (ember)',
      color: 'var(--accent)',
      strokeWidth: 1.5
    }, {
      label: 'Muted',
      color: 'var(--fg-muted)',
      strokeWidth: 1.5
    }];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }}>
        {variants.map(({
        label,
        color,
        strokeWidth,
        bg,
        fg
      }) => <div key={label} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
            <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)'
        }}>
              {label}
            </span>
            <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 16px',
          borderRadius: 6,
          border: '1px solid var(--border)',
          background: bg ?? 'var(--surface)',
          color: fg ?? color ?? 'var(--fg)'
        }}>
              {SAMPLE.map(name => {
            const IconComponent = Icons[name];
            return <IconComponent key={name} size={20} color={color} strokeWidth={strokeWidth} />;
          })}
            </div>
          </div>)}
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Variants — stroke weight and color modes that cover the three Forge
contexts: default UI (1.5), editorial/thin (1.0), and accent-highlighted
(ember). All icons share the same prop surface.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <IconGrid keys={DEVOPS_ICONS} />
}`,...g.parameters?.docs?.source},description:{story:`DevOps — glyphs used on deploy dashboards, pipeline status feeds, and
release management surfaces. Covers the full artifact lifecycle.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <IconGrid keys={AGENT_ICONS} />
}`,..._.parameters?.docs?.source},description:{story:`Agent and AI — glyphs for agent orchestration, MCP server tiles, tool-call
traces, and embedding/vector surfaces in the AI platform.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <IconGrid keys={GOVERNANCE_ICONS} />
}`,...v.parameters?.docs?.source},description:{story:`Governance — incident response, SLO tracking, compliance audits, and
runbook authoring. All share the same 24×24 stroke vocabulary.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <IconGrid keys={EDITING_ICONS} />
}`,...y.parameters?.docs?.source},description:{story:`Editing — file management, clipboard, and content-manipulation glyphs
used in editors, command palettes, and context menus.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const Icon = Icons.deploy;
    const surfaces: {
      label: string;
      bg: string;
      iconColor: string;
    }[] = [{
      label: 'default surface',
      bg: 'var(--surface)',
      iconColor: 'var(--fg)'
    }, {
      label: 'ember / accent',
      bg: 'var(--accent)',
      iconColor: 'var(--bg)'
    }, {
      label: 'dark ink',
      bg: '#08090A',
      iconColor: 'var(--fg)'
    }, {
      label: 'success fill',
      bg: 'var(--green)',
      iconColor: 'var(--bg)'
    }, {
      label: 'warning fill',
      bg: 'var(--yellow)',
      iconColor: 'var(--bg)'
    }, {
      label: 'critical fill',
      bg: 'var(--red)',
      iconColor: 'var(--bg)'
    }];
    return <div style={{
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }}>
        {surfaces.map(({
        label,
        bg,
        iconColor
      }) => <div key={label} style={{
        background: bg,
        borderRadius: 10,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        minWidth: 96
      }}>
            <Icon size={24} color={iconColor} />
            <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: iconColor,
          textAlign: 'center'
        }}>
              {label}
            </span>
          </div>)}
      </div>;
  }
}`,...b.parameters?.docs?.source},description:{story:"On colored surfaces — contrast rule: any icon on a non-default background\nmust carry an explicitly contrasting color. On ember/accent fills use dark\nink (`var(--bg)`). On dark tiles use `var(--fg)` or light tokens. Never\nrely on inheritance when the surface color changes.",...b.parameters?.docs?.description}}},x=[`Default`,`Sizes`,`Variants`,`DevOps`,`AgentAI`,`Governance`,`Editing`,`OnColoredSurfaces`]}))();export{_ as AgentAI,p as Default,g as DevOps,y as Editing,v as Governance,b as OnColoredSurfaces,m as Sizes,h as Variants,x as __namedExportsOrder,s as default};