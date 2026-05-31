import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Hr as i,Ur as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_;e((()=>{s=t(n(),1),o(),c=r(),l=[`#FF6B35`,`#1A73E8`,`#34A853`,`#FBBC04`,`#EA4335`,`#9334E6`,`#0D1117`,`#F6F8FA`],u=[`#22C55E`,`#F59E0B`,`#EF4444`,`#3B82F6`,`#6B7280`,`#8B5CF6`],d={title:`Forms/ColorPicker`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"`ColorPicker` renders an inline HSV picker — saturation/value square, hue bar, optional alpha slider, hex + RGB inputs, optional eyedropper, and an optional swatch palette. Use it inside a popover (via `ColorInput`, the trigger wrapper) or inline when the color selection surface should always be visible — e.g. theme editors, incident-status colour coding, service-label configuration, and AI agent personality customisation.\n\n`ColorInput` wraps `ColorPicker` in a swatch-trigger button that opens the picker in a `position:fixed` popover, safe under `overflow:hidden` ancestors."}}},argTypes:{value:{control:`text`},alpha:{control:`boolean`},swatches:{control:!1},onChange:{action:`changed`},popRef:{control:!1},style:{control:!1}},args:{value:`#FF6B35`,alpha:!1,swatches:[]}},f={args:{value:`#FF6B35`,alpha:!1,swatches:[]}},p={args:{value:`#1A73E8`,swatches:l}},m={args:{value:`#9334E680`,alpha:!0,swatches:u}},h={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,alignItems:`flex-start`},children:[(0,c.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`,flexWrap:`wrap`},children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:8},children:`sm — 28 px`}),(0,c.jsx)(i,{size:`sm`,defaultValue:`#1A73E8`,swatches:l})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:8},children:`md — 36 px (default)`}),(0,c.jsx)(i,{size:`md`,defaultValue:`#FF6B35`,swatches:l})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:8},children:`lg — 44 px`}),(0,c.jsx)(i,{size:`lg`,defaultValue:`#34A853`,swatches:l})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:8},children:`disabled`}),(0,c.jsx)(i,{size:`md`,defaultValue:`#6B7280`,disabled:!0})]})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:8},children:`md + alpha channel`}),(0,c.jsx)(i,{size:`md`,defaultValue:`#9334E680`,alpha:!0,swatches:u})]})]})},g={render:()=>{let[e,t]=s.useState(`#EA4335`);return(0,c.jsxs)(`div`,{style:{display:`flex`,gap:20,alignItems:`center`,flexWrap:`wrap`},children:[(0,c.jsx)(i,{value:e,onChange:t,swatches:u}),(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4},children:[(0,c.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`},children:`Controlled value`}),(0,c.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8},children:[(0,c.jsx)(`span`,{style:{display:`inline-block`,width:14,height:14,borderRadius:3,background:e,border:`1px solid var(--border)`,flexShrink:0}}),(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:13,color:`var(--fg)`},children:e})]})]})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    value: '#FF6B35',
    alpha: false,
    swatches: []
  }
}`,...f.parameters?.docs?.source},description:{story:`Minimal inline picker. The ember accent (\`#FF6B35\`) is the default value —
matching the Forge brand token. Drag the SV square or the hue bar to
explore; the hex and RGB fields update in real time.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    value: '#1A73E8',
    swatches: BRAND_SWATCHES
  }
}`,...p.parameters?.docs?.source},description:{story:`Brand swatch palette — 8 curated tokens covering accent, semantic states,
ink and surface. One click applies the colour without touching the sliders.
Suitable for theme configuration flows.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    value: '#9334E680',
    alpha: true,
    swatches: STATUS_SWATCHES
  }
}`,...m.parameters?.docs?.source},description:{story:"When `alpha` is `true` an additional alpha slider appears below the hue bar\nand the hex field expands to 8 characters (`#RRGGBBAA`). Use for overlay\ncolours — chart annotations, incident-band backgrounds, AI response\nhighlight fills.",...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    alignItems: 'flex-start'
  }}>
      {/* Size row */}
      <div style={{
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
        <div>
          <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)',
          marginBottom: 8
        }}>
            sm — 28 px
          </div>
          <ColorInput size="sm" defaultValue="#1A73E8" swatches={BRAND_SWATCHES} />
        </div>

        <div>
          <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)',
          marginBottom: 8
        }}>
            md — 36 px (default)
          </div>
          <ColorInput size="md" defaultValue="#FF6B35" swatches={BRAND_SWATCHES} />
        </div>

        <div>
          <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)',
          marginBottom: 8
        }}>
            lg — 44 px
          </div>
          <ColorInput size="lg" defaultValue="#34A853" swatches={BRAND_SWATCHES} />
        </div>

        <div>
          <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)',
          marginBottom: 8
        }}>
            disabled
          </div>
          <ColorInput size="md" defaultValue="#6B7280" disabled />
        </div>
      </div>

      {/* With alpha */}
      <div>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 8
      }}>
          md + alpha channel
        </div>
        <ColorInput size="md" defaultValue="#9334E680" alpha swatches={STATUS_SWATCHES} />
      </div>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`\`ColorInput\` is the production-ready trigger that wraps \`ColorPicker\` in a
fixed-position popover. This story lays out all three trigger sizes and the
disabled state side by side so you can compare them at a glance.

- **sm** (28 px) — compact toolbars, inline property panels.
- **md** (36 px, default) — standard form rows.
- **lg** (44 px) — prominent theme or brand editors.
- **disabled** — greys out the trigger and blocks the popover.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [color, setColor] = React.useState('#EA4335');
    return <div style={{
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
        <ColorInput value={color} onChange={setColor} swatches={STATUS_SWATCHES} />
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}>
          <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)'
        }}>
            Controlled value
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
            <span style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            borderRadius: 3,
            background: color,
            border: '1px solid var(--border)',
            flexShrink: 0
          }} />
            <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--fg)'
          }}>
              {color}
            </span>
          </div>
        </div>
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`Fully controlled \`ColorInput\` — parent state drives the value; the selected
hex is echoed beside the trigger. Use this pattern in configuration forms
where the colour must be persisted or validated on change.`,...g.parameters?.docs?.description}}},_=[`Default`,`WithSwatches`,`WithAlpha`,`States`,`Controlled`]}))();export{g as Controlled,f as Default,h as States,m as WithAlpha,p as WithSwatches,_ as __namedExportsOrder,d as default};