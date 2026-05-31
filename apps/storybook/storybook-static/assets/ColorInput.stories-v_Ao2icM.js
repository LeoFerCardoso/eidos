import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Hr as i,Ur as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_;e((()=>{s=t(n(),1),o(),c=r(),l=[`#FF6B35`,`#F87171`,`#FACC15`,`#4ADE80`,`#60A5FA`,`#A78BFA`,`#F472B6`,`#08090A`,`#1F2024`,`#F4F4F5`,`#FFFFFF`,`#52525B`],u={title:`Forms/ColorInput`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A swatch + hex code trigger that opens an H/S/V color picker popover. State lives in HSV space so the saturation/value square and hue bar stay geometrically intuitive. Hex and RGB are derived and stay in sync. Optional alpha slider extends the hex format to 8 characters (#RRGGBBAA). The EyeDropper API is used when available (Chrome / Edge).`}}},args:{value:`#FF6B35`,alpha:!1,swatches:[],size:`md`,disabled:!1},argTypes:{value:{control:`text`},alpha:{control:`boolean`},size:{control:`select`,options:[`sm`,`md`,`lg`]},disabled:{control:`boolean`}}},d={render:e=>{let[t,n]=s.useState(`#FF6B35`);return(0,c.jsx)(i,{...e,value:t,onChange:n})}},f={render:e=>{let[t,n]=s.useState(`#FF6B35E6`);return(0,c.jsx)(i,{...e,value:t,onChange:n,alpha:!0})}},p={render:e=>{let[t,n]=s.useState(`#FF6B35`);return(0,c.jsx)(i,{...e,value:t,onChange:n,swatches:l})}},m={render:e=>(0,c.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:14,flexWrap:`wrap`},children:[(0,c.jsx)(i,{...e,size:`sm`,value:`#60A5FA`}),(0,c.jsx)(i,{...e,size:`md`,value:`#4ADE80`}),(0,c.jsx)(i,{...e,size:`lg`,value:`#A78BFA`})]})},h={render:()=>{let[e,t]=s.useState(`#FF6B35`);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:360},children:[(0,c.jsxs)(`div`,{className:`in-field`,children:[(0,c.jsx)(`label`,{className:`in-label`,children:`Theme accent`}),(0,c.jsx)(i,{value:e,onChange:t,swatches:l,alpha:!0}),(0,c.jsxs)(`div`,{className:`in-help`,children:[`Current value:`,` `,(0,c.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,color:`var(--ember)`},children:e})]})]}),(0,c.jsx)(`div`,{style:{height:48,borderRadius:`var(--radius-xl)`,background:e,border:`1px solid var(--border)`,transition:`background 120ms`},"aria-hidden":`true`})]})}},g={render:()=>{let[e,t]=s.useState(`#60A5FA`);return(0,c.jsxs)(`div`,{style:{maxWidth:288,display:`flex`,flexDirection:`column`,gap:8},children:[(0,c.jsx)(a,{value:e,onChange:t,swatches:l,alpha:!0}),(0,c.jsx)(`button`,{type:`button`,className:`btn ghost`,onClick:()=>t(`#FF6B35`),style:{alignSelf:`flex-start`,width:`auto`,padding:`4px 10px`,fontSize:12},children:`Use ember preset`}),(0,c.jsx)(`p`,{style:{margin:0,fontFamily:`var(--font-mono)`,fontSize:12},children:e})]})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [color, setColor] = React.useState('#FF6B35');
    return <ColorInput {...args} value={color} onChange={setColor} />;
  }
}`,...d.parameters?.docs?.source},description:{story:`Ember brand color — the picker's neutral starting state.
 Uses local state so the trigger swatch updates live when you open the picker
 and choose a color.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [color, setColor] = React.useState('#FF6B35E6');
    return <ColorInput {...args} value={color} onChange={setColor} alpha />;
  }
}`,...f.parameters?.docs?.source},description:{story:`Alpha slider enabled — hex extends to 8 characters (#RRGGBBAA).
The checker-pattern swatch reveals transparency visually.
Uses local state so the trigger updates live.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [color, setColor] = React.useState('#FF6B35');
    return <ColorInput {...args} value={color} onChange={setColor} swatches={BRAND_SWATCHES} />;
  }
}`,...p.parameters?.docs?.source},description:{story:`Curated Forge brand palette pinned below the inputs.
Click any swatch to snap to that value exactly.
Uses local state so the trigger swatch updates on every pick.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap'
  }}>
      <ColorInput {...args} size="sm" value="#60A5FA" />
      <ColorInput {...args} size="md" value="#4ADE80" />
      <ColorInput {...args} size="lg" value="#A78BFA" />
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Three trigger sizes — sm (28px), md (36px), lg (44px) — to match the
surrounding form chrome height.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [color, setColor] = React.useState('#FF6B35');
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 360
    }}>
        <div className="in-field">
          <label className="in-label">Theme accent</label>
          <ColorInput value={color} onChange={setColor} swatches={BRAND_SWATCHES} alpha />
          <div className="in-help">
            Current value:{' '}
            <code style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--ember)'
          }}>
              {color}
            </code>
          </div>
        </div>
        {/* Live preview swatch */}
        <div style={{
        height: 48,
        borderRadius: 'var(--radius-xl)',
        background: color,
        border: '1px solid var(--border)',
        transition: 'background 120ms'
      }} aria-hidden="true" />
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Fully controlled — useState wires up onChange so the live hex value is
displayed below the trigger. This mirrors the real consumer pattern.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [color, setColor] = React.useState('#60A5FA');
    return <div style={{
      maxWidth: 288,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
        <ColorPicker value={color} onChange={setColor} swatches={BRAND_SWATCHES} alpha />
        <button type="button" className="btn ghost" onClick={() => setColor('#FF6B35')} style={{
        alignSelf: 'flex-start',
        width: 'auto',
        padding: '4px 10px',
        fontSize: 12
      }}>
          Use ember preset
        </button>
        <p style={{
        margin: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: 12
      }}>
          {color}
        </p>
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`The raw ColorPicker — rendered inline without the trigger popover.
Useful for embedding in a panel, settings sheet, or command palette.
The "Use preset" button switches to a clearly different color so live
updates are immediately visible.`,...g.parameters?.docs?.description}}},_=[`Default`,`WithAlpha`,`WithSwatches`,`Sizes`,`Interactive`,`InlineColorPicker`]}))();export{d as Default,g as InlineColorPicker,h as Interactive,m as Sizes,f as WithAlpha,p as WithSwatches,_ as __namedExportsOrder,u as default};