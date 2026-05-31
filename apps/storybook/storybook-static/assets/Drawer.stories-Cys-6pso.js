import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{pi as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Overlays/Drawer`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A panel that slides in from any edge of the viewport. `variant="overlay"` portals over the page with a scrim backdrop; `variant="inline"` docks as a flex column beside sibling content. Bottom overlay drawers support drag-to-close.'}}},args:{open:!1,side:`right`,variant:`overlay`,persistent:!1,title:`Settings`,desc:`Adjust your preferences.`},argTypes:{open:{control:`boolean`},side:{control:`inline-radio`,options:[`right`,`left`,`top`,`bottom`]},variant:{control:`inline-radio`,options:[`overlay`,`inline`]},persistent:{control:`boolean`},title:{control:`text`},desc:{control:`text`}}},l={render:e=>{let[t,n]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:200},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>n(!0),children:`Open drawer`}),(0,s.jsx)(i,{...e,open:t,onClose:()=>n(!1),children:(0,s.jsx)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg)`,fontSize:14,margin:0},children:`Drawer body content goes here.`})})]})}},u={args:{side:`left`,title:`Navigation`,desc:void 0},render:e=>{let[t,n]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:200},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>n(!0),children:`Open left drawer`}),(0,s.jsx)(i,{...e,open:t,onClose:()=>n(!1),children:(0,s.jsx)(`nav`,{style:{display:`flex`,flexDirection:`column`,gap:8},children:[`Dashboard`,`Services`,`Deploys`,`Incidents`,`Settings`].map(e=>(0,s.jsx)(`a`,{href:`#`,style:{fontFamily:`var(--font)`,color:`var(--fg)`,textDecoration:`none`,fontSize:14,padding:`6px 4px`,borderRadius:4},children:e},e))})})]})}},d={args:{side:`bottom`,title:`Filter`,desc:`Narrow results by tribe and tier.`},render:e=>{let[t,n]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:200},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>n(!0),children:`Open bottom sheet`}),(0,s.jsx)(i,{...e,open:t,onClose:()=>n(!1),children:(0,s.jsx)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg)`,fontSize:14,margin:0},children:`Drag the handle down or tap outside to close.`})})]})}},f={args:{persistent:!0,title:`Review PR #7421`,desc:`Must be explicitly dismissed.`},render:e=>{let[t,n]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:200},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>n(!0),children:`Open persistent drawer`}),(0,s.jsx)(i,{...e,open:t,onClose:()=>n(!1),children:(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg)`,fontSize:14,margin:0},children:[`Clicking the backdrop or pressing Escape has no effect when `,(0,s.jsx)(`code`,{children:`persistent`}),` is set.`]})})]})}},p={args:{variant:`inline`,side:`right`,title:`Detail panel`,desc:`Inline variant.`},render:e=>{let[t,n]=o.useState(!0);return(0,s.jsxs)(`div`,{style:{display:`flex`,height:300,border:`1px solid var(--border)`,borderRadius:8,overflow:`hidden`},children:[(0,s.jsxs)(`div`,{style:{flex:1,padding:24,fontFamily:`var(--font)`,color:`var(--fg)`,fontSize:14},children:[(0,s.jsx)(`button`,{className:`btn`,style:{marginBottom:16},onClick:()=>n(e=>!e),children:t?`Hide panel`:`Show panel`}),(0,s.jsx)(`p`,{style:{margin:0},children:`Main content — siblings contract when the panel opens.`})]}),(0,s.jsx)(i,{...e,open:t,onClose:()=>n(!1),children:(0,s.jsx)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg)`,fontSize:13,margin:0},children:`Artifact detail or a chat thread can live here.`})})]})}},m={args:{title:`Deploy to Ring 2`,desc:`pix-router v2.7.0`,footer:(0,s.jsxs)(`div`,{style:{display:`flex`,gap:8,justifyContent:`flex-end`},children:[(0,s.jsx)(`button`,{className:`btn btn-ghost`,children:`Cancel`}),(0,s.jsx)(`button`,{className:`btn btn-primary`,children:`Confirm deploy`})]})},render:e=>{let[t,n]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:200},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>n(!0),children:`Open with footer`}),(0,s.jsx)(i,{...e,open:t,onClose:()=>n(!1),children:(0,s.jsx)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg)`,fontSize:14,margin:0},children:`Review the deployment plan before confirming.`})})]})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 200
    }}>
        <button className="btn" onClick={() => setOpen(true)}>Open drawer</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{
          fontFamily: 'var(--font)',
          color: 'var(--fg)',
          fontSize: 14,
          margin: 0
        }}>
            Drawer body content goes here.
          </p>
        </Drawer>
      </div>;
  }
}`,...l.parameters?.docs?.source},description:{story:`Default — overlay drawer sliding from the right, toggled by a button.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    side: 'left',
    title: 'Navigation',
    desc: undefined
  },
  render: args => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 200
    }}>
        <button className="btn" onClick={() => setOpen(true)}>Open left drawer</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
            {['Dashboard', 'Services', 'Deploys', 'Incidents', 'Settings'].map(item => <a key={item} href="#" style={{
            fontFamily: 'var(--font)',
            color: 'var(--fg)',
            textDecoration: 'none',
            fontSize: 14,
            padding: '6px 4px',
            borderRadius: 4
          }}>
                {item}
              </a>)}
          </nav>
        </Drawer>
      </div>;
  }
}`,...u.parameters?.docs?.source},description:{story:`Left side — slides in from the left edge.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    side: 'bottom',
    title: 'Filter',
    desc: 'Narrow results by tribe and tier.'
  },
  render: args => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 200
    }}>
        <button className="btn" onClick={() => setOpen(true)}>Open bottom sheet</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{
          fontFamily: 'var(--font)',
          color: 'var(--fg)',
          fontSize: 14,
          margin: 0
        }}>
            Drag the handle down or tap outside to close.
          </p>
        </Drawer>
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`Bottom sheet — slides up from the bottom with drag-to-close.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    persistent: true,
    title: 'Review PR #7421',
    desc: 'Must be explicitly dismissed.'
  },
  render: args => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 200
    }}>
        <button className="btn" onClick={() => setOpen(true)}>Open persistent drawer</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{
          fontFamily: 'var(--font)',
          color: 'var(--fg)',
          fontSize: 14,
          margin: 0
        }}>
            Clicking the backdrop or pressing Escape has no effect when <code>persistent</code> is set.
          </p>
        </Drawer>
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Persistent — Escape key and backdrop clicks do not close it; an explicit close button is required.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'inline',
    side: 'right',
    title: 'Detail panel',
    desc: 'Inline variant.'
  },
  render: args => {
    const [open, setOpen] = React.useState(true);
    return <div style={{
      display: 'flex',
      height: 300,
      border: '1px solid var(--border)',
      borderRadius: 8,
      overflow: 'hidden'
    }}>
        <div style={{
        flex: 1,
        padding: 24,
        fontFamily: 'var(--font)',
        color: 'var(--fg)',
        fontSize: 14
      }}>
          <button className="btn" style={{
          marginBottom: 16
        }} onClick={() => setOpen(v => !v)}>
            {open ? 'Hide panel' : 'Show panel'}
          </button>
          <p style={{
          margin: 0
        }}>Main content — siblings contract when the panel opens.</p>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{
          fontFamily: 'var(--font)',
          color: 'var(--fg)',
          fontSize: 13,
          margin: 0
        }}>
            Artifact detail or a chat thread can live here.
          </p>
        </Drawer>
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Inline variant — the drawer occupies space in a flex row rather than overlaying.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Deploy to Ring 2',
    desc: 'pix-router v2.7.0',
    footer: <div style={{
      display: 'flex',
      gap: 8,
      justifyContent: 'flex-end'
    }}>
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Confirm deploy</button>
      </div>
  },
  render: args => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 200
    }}>
        <button className="btn" onClick={() => setOpen(true)}>Open with footer</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{
          fontFamily: 'var(--font)',
          color: 'var(--fg)',
          fontSize: 14,
          margin: 0
        }}>
            Review the deployment plan before confirming.
          </p>
        </Drawer>
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`With footer — drawer with a sticky action bar at the bottom.`,...m.parameters?.docs?.description}}},h=[`Default`,`LeftSide`,`BottomSheet`,`Persistent`,`Inline`,`WithFooter`]}))();export{d as BottomSheet,l as Default,p as Inline,u as LeftSide,f as Persistent,m as WithFooter,h as __namedExportsOrder,c as default};