import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Wa as i,_ as a,t as o,v as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E;e((()=>{c=t(n(),1),o(),l=r(),u={title:`Forms/InputGroup`,component:s,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A horizontal cluster — input, button, select, and optional text addons — sharing one bordered shell. Composes the existing .in-group / .in-addon / .in-control CSS system. Use InputAddon (kind text|icon|button|select) to compose each segment. Pass an id to text addons and reference it from the input via aria-describedby.`}}},args:{size:`md`,invalid:!1,disabled:!1,full:!0},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},invalid:{control:`boolean`},disabled:{control:`boolean`},full:{control:`boolean`}}},d={render:e=>(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.search,{size:14})}),(0,l.jsx)(`input`,{className:`in-control`,placeholder:`Search projects, files, people…`}),(0,l.jsx)(a,{kind:`button`,accent:!0,children:`Search`})]})},f={render:e=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14},children:[(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`text`,id:`sb-scheme-1`,children:`https://`}),(0,l.jsx)(`input`,{className:`in-control`,"aria-describedby":`sb-scheme-1`,defaultValue:`forge.example.com/team`})]}),(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`text`,id:`sb-at-1`,children:`@`}),(0,l.jsx)(`input`,{className:`in-control`,"aria-describedby":`sb-at-1`,placeholder:`username`})]})]})},p={render:e=>(0,l.jsxs)(s,{...e,style:{maxWidth:320},children:[(0,l.jsx)(`input`,{className:`in-control`,placeholder:`42`,"aria-describedby":`sb-unit-1`}),(0,l.jsx)(a,{kind:`text`,id:`sb-unit-1`,children:`USD / month`})]})},m={render:e=>(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.inbox,{size:14})}),(0,l.jsx)(`input`,{className:`in-control`,placeholder:`you@example.com`,type:`email`})]})},h={render:e=>(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsx)(`input`,{className:`in-control`,placeholder:`Search repositories…`}),(0,l.jsx)(a,{kind:`button`,accent:!0,children:`Search`})]})},g={render:e=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14},children:[(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.link,{size:14})}),(0,l.jsx)(`input`,{className:`in-control`,readOnly:!0,defaultValue:`https://forge-ds.com/invites/3f4-9k2-x8q`}),(0,l.jsx)(a,{kind:`button`,"aria-label":`Copy link`,children:(0,l.jsx)(i.copy,{size:14})})]}),(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsx)(`input`,{className:`in-control`,placeholder:`Reply to thread…`}),(0,l.jsx)(a,{kind:`button`,accent:!0,"aria-label":`Send`,children:(0,l.jsx)(i.arrowRight,{size:14})})]})]})},_={render:e=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14},children:[(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsxs)(a,{kind:`select`,defaultValue:`USD`,children:[(0,l.jsx)(`option`,{children:`USD`}),(0,l.jsx)(`option`,{children:`EUR`}),(0,l.jsx)(`option`,{children:`BRL`}),(0,l.jsx)(`option`,{children:`JPY`})]}),(0,l.jsx)(`input`,{className:`in-control`,placeholder:`0.00`}),(0,l.jsx)(a,{kind:`text`,id:`sb-per-mo`,children:`/ month`})]}),(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsxs)(a,{kind:`select`,defaultValue:`+1`,children:[(0,l.jsx)(`option`,{children:`+1`}),(0,l.jsx)(`option`,{children:`+44`}),(0,l.jsx)(`option`,{children:`+55`}),(0,l.jsx)(`option`,{children:`+81`})]}),(0,l.jsx)(`input`,{className:`in-control`,placeholder:`(415) 555 0182`})]})]})},v={render:()=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14},children:[(0,l.jsxs)(s,{size:`sm`,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.search,{size:12})}),(0,l.jsx)(`input`,{className:`in-control`,placeholder:`Small (28px)`}),(0,l.jsx)(a,{kind:`button`,children:`Apply`})]}),(0,l.jsxs)(s,{size:`md`,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.search,{size:14})}),(0,l.jsx)(`input`,{className:`in-control`,placeholder:`Default (36px)`}),(0,l.jsx)(a,{kind:`button`,accent:!0,children:`Apply`})]}),(0,l.jsxs)(s,{size:`lg`,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.search,{size:16})}),(0,l.jsx)(`input`,{className:`in-control`,placeholder:`Large (44px)`}),(0,l.jsx)(a,{kind:`button`,accent:!0,children:`Subscribe`})]})]})},y={render:e=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,l.jsxs)(s,{...e,invalid:!0,style:{maxWidth:460},children:[(0,l.jsx)(`input`,{className:`in-control`,defaultValue:`not-an-email`}),(0,l.jsx)(a,{kind:`button`,children:`Submit`})]}),(0,l.jsx)(`span`,{style:{fontSize:12,color:`var(--danger)`},children:`Enter a valid email address.`})]})},b={args:{disabled:!0},render:e=>(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.search,{size:14})}),(0,l.jsx)(`input`,{className:`in-control`,placeholder:`Search…`,disabled:!0}),(0,l.jsx)(a,{kind:`button`,children:`Search`})]})},x={render:e=>(0,l.jsx)(`div`,{dir:`rtl`,style:{maxWidth:460},children:(0,l.jsxs)(s,{...e,children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.search,{size:14})}),(0,l.jsx)(`input`,{className:`in-control`,placeholder:`ابحث في المشاريع…`}),(0,l.jsx)(a,{kind:`button`,accent:!0,children:`بحث`})]})})},S={render:e=>(0,l.jsxs)(s,{...e,style:{maxWidth:460},children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.link,{size:14})}),(0,l.jsx)(`input`,{className:`in-control`,readOnly:!0,defaultValue:`https://forge-ds.com/invites/3f4-9k2-x8q`}),(0,l.jsx)(a,{kind:`button`,"aria-label":`Copy link`,children:(0,l.jsx)(i.copy,{size:14})})]})},C={render:e=>(0,l.jsxs)(s,{...e,style:{maxWidth:560},children:[(0,l.jsx)(a,{kind:`text`,id:`sb-filter`,children:`Filter`}),(0,l.jsxs)(a,{kind:`select`,defaultValue:`name`,children:[(0,l.jsx)(`option`,{value:`name`,children:`name`}),(0,l.jsx)(`option`,{value:`owner`,children:`owner`}),(0,l.jsx)(`option`,{value:`tag`,children:`tag`})]}),(0,l.jsx)(`input`,{className:`in-control`,"aria-describedby":`sb-filter`,placeholder:`contains…`}),(0,l.jsx)(a,{kind:`button`,accent:!0,children:`Apply`})]})},w={render:e=>{let[t,n]=c.useState(``);return(0,l.jsxs)(s,{...e,style:{maxWidth:560},children:[(0,l.jsx)(a,{kind:`button`,"aria-label":`Add attachment`,children:(0,l.jsx)(i.paperclip,{size:14})}),(0,l.jsx)(`input`,{className:`in-control`,value:t,onChange:e=>n(e.target.value),placeholder:`Reply to thread…`}),(0,l.jsx)(a,{kind:`button`,accent:!0,"aria-label":`Send`,children:(0,l.jsx)(i.arrowRight,{size:14})})]})}},T={render:()=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:480},children:[(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,l.jsx)(`label`,{htmlFor:`invite-url`,style:{fontSize:13,fontWeight:500,color:`var(--fg)`},children:`Invite link`}),(0,l.jsxs)(s,{children:[(0,l.jsx)(a,{kind:`icon`,children:(0,l.jsx)(i.link,{size:14})}),(0,l.jsx)(`input`,{id:`invite-url`,className:`in-control`,readOnly:!0,defaultValue:`https://forge-ds.com/invites/3f4-9k2-x8q`}),(0,l.jsx)(a,{kind:`button`,"aria-label":`Copy link`,children:(0,l.jsx)(i.copy,{size:14})})]}),(0,l.jsx)(`span`,{style:{fontSize:12,color:`var(--fg-muted)`},children:`Share with anyone to grant read access.`})]}),(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,l.jsx)(`label`,{htmlFor:`budget`,style:{fontSize:13,fontWeight:500,color:`var(--fg)`},children:`Monthly budget`}),(0,l.jsxs)(s,{children:[(0,l.jsxs)(a,{kind:`select`,"aria-label":`Currency`,children:[(0,l.jsx)(`option`,{children:`USD`}),(0,l.jsx)(`option`,{children:`EUR`}),(0,l.jsx)(`option`,{children:`GBP`})]}),(0,l.jsx)(`input`,{id:`budget`,className:`in-control`,type:`number`,min:`0`,placeholder:`0.00`}),(0,l.jsx)(a,{kind:`text`,id:`budget-unit`,children:`/ month`})]})]})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <InputGroup {...args} style={{
    maxWidth: 460
  }}>
      <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
      <input className="in-control" placeholder="Search projects, files, people…" />
      <InputAddon kind="button" accent>Search</InputAddon>
    </InputGroup>
}`,...d.parameters?.docs?.source},description:{story:`Default: leading icon + input + primary (ember) action button.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  }}>
      <InputGroup {...args} style={{
      maxWidth: 460
    }}>
        <InputAddon kind="text" id="sb-scheme-1">https://</InputAddon>
        <input className="in-control" aria-describedby="sb-scheme-1" defaultValue="forge.example.com/team" />
      </InputGroup>
      <InputGroup {...args} style={{
      maxWidth: 460
    }}>
        <InputAddon kind="text" id="sb-at-1">@</InputAddon>
        <input className="in-control" aria-describedby="sb-at-1" placeholder="username" />
      </InputGroup>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Leading text affix — URL scheme prefix wired via aria-describedby.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <InputGroup {...args} style={{
    maxWidth: 320
  }}>
      <input className="in-control" placeholder="42" aria-describedby="sb-unit-1" />
      <InputAddon kind="text" id="sb-unit-1">USD / month</InputAddon>
    </InputGroup>
}`,...p.parameters?.docs?.source},description:{story:`Trailing text affix — unit suffix.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <InputGroup {...args} style={{
    maxWidth: 460
  }}>
      <InputAddon kind="icon"><Icons.inbox size={14} /></InputAddon>
      <input className="in-control" placeholder="you@example.com" type="email" />
    </InputGroup>
}`,...m.parameters?.docs?.source},description:{story:`Leading icon addon (non-interactive decorative affordance).`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <InputGroup {...args} style={{
    maxWidth: 460
  }}>
      <input className="in-control" placeholder="Search repositories…" />
      <InputAddon kind="button" accent>Search</InputAddon>
    </InputGroup>
}`,...h.parameters?.docs?.source},description:{story:`Trailing primary (ember) button — the canonical search pattern.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  }}>
      <InputGroup {...args} style={{
      maxWidth: 460
    }}>
        <InputAddon kind="icon"><Icons.link size={14} /></InputAddon>
        <input className="in-control" readOnly defaultValue="https://forge-ds.com/invites/3f4-9k2-x8q" />
        <InputAddon kind="button" aria-label="Copy link"><Icons.copy size={14} /></InputAddon>
      </InputGroup>
      <InputGroup {...args} style={{
      maxWidth: 460
    }}>
        <input className="in-control" placeholder="Reply to thread…" />
        <InputAddon kind="button" accent aria-label="Send"><Icons.arrowRight size={14} /></InputAddon>
      </InputGroup>
    </div>
}`,...g.parameters?.docs?.source},description:{story:`Icon-only action button — copy, send, clear.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  }}>
      <InputGroup {...args} style={{
      maxWidth: 460
    }}>
        <InputAddon kind="select" defaultValue="USD">
          <option>USD</option>
          <option>EUR</option>
          <option>BRL</option>
          <option>JPY</option>
        </InputAddon>
        <input className="in-control" placeholder="0.00" />
        <InputAddon kind="text" id="sb-per-mo">/ month</InputAddon>
      </InputGroup>
      <InputGroup {...args} style={{
      maxWidth: 460
    }}>
        <InputAddon kind="select" defaultValue="+1">
          <option>+1</option>
          <option>+44</option>
          <option>+55</option>
          <option>+81</option>
        </InputAddon>
        <input className="in-control" placeholder="(415) 555 0182" />
      </InputGroup>
    </div>
}`,..._.parameters?.docs?.source},description:{story:`Trailing native select addon — currency picker.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  }}>
      <InputGroup size="sm" style={{
      maxWidth: 460
    }}>
        <InputAddon kind="icon"><Icons.search size={12} /></InputAddon>
        <input className="in-control" placeholder="Small (28px)" />
        <InputAddon kind="button">Apply</InputAddon>
      </InputGroup>
      <InputGroup size="md" style={{
      maxWidth: 460
    }}>
        <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
        <input className="in-control" placeholder="Default (36px)" />
        <InputAddon kind="button" accent>Apply</InputAddon>
      </InputGroup>
      <InputGroup size="lg" style={{
      maxWidth: 460
    }}>
        <InputAddon kind="icon"><Icons.search size={16} /></InputAddon>
        <input className="in-control" placeholder="Large (44px)" />
        <InputAddon kind="button" accent>Subscribe</InputAddon>
      </InputGroup>
    </div>
}`,...v.parameters?.docs?.source},description:{story:`All three sizes — sm (28px) / md (36px) / lg (44px).`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  }}>
      <InputGroup {...args} invalid style={{
      maxWidth: 460
    }}>
        <input className="in-control" defaultValue="not-an-email" />
        <InputAddon kind="button">Submit</InputAddon>
      </InputGroup>
      <span style={{
      fontSize: 12,
      color: 'var(--danger)'
    }}>Enter a valid email address.</span>
    </div>
}`,...y.parameters?.docs?.source},description:{story:`Invalid state — danger ring on the group.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  },
  render: args => <InputGroup {...args} style={{
    maxWidth: 460
  }}>
      <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
      <input className="in-control" placeholder="Search…" disabled />
      <InputAddon kind="button">Search</InputAddon>
    </InputGroup>
}`,...b.parameters?.docs?.source},description:{story:`Disabled — entire group non-interactive.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl" style={{
    maxWidth: 460
  }}>
      <InputGroup {...args}>
        <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
        <input className="in-control" placeholder="ابحث في المشاريع…" />
        <InputAddon kind="button" accent>بحث</InputAddon>
      </InputGroup>
    </div>
}`,...x.parameters?.docs?.source},description:{story:`RTL direction — logical properties flip segments correctly.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <InputGroup {...args} style={{
    maxWidth: 460
  }}>
      <InputAddon kind="icon"><Icons.link size={14} /></InputAddon>
      <input className="in-control" readOnly defaultValue="https://forge-ds.com/invites/3f4-9k2-x8q" />
      <InputAddon kind="button" aria-label="Copy link"><Icons.copy size={14} /></InputAddon>
    </InputGroup>
}`,...S.parameters?.docs?.source},description:{story:`URL + copy icon button (utility pattern).`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <InputGroup {...args} style={{
    maxWidth: 560
  }}>
      <InputAddon kind="text" id="sb-filter">Filter</InputAddon>
      <InputAddon kind="select" defaultValue="name">
        <option value="name">name</option>
        <option value="owner">owner</option>
        <option value="tag">tag</option>
      </InputAddon>
      <input className="in-control" aria-describedby="sb-filter" placeholder="contains…" />
      <InputAddon kind="button" accent>Apply</InputAddon>
    </InputGroup>
}`,...C.parameters?.docs?.source},description:{story:`Three segments: text label + select + input + action.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = React.useState('');
    return <InputGroup {...args} style={{
      maxWidth: 560
    }}>
        <InputAddon kind="button" aria-label="Add attachment">
          <Icons.paperclip size={14} />
        </InputAddon>
        <input className="in-control" value={value} onChange={e => setValue(e.target.value)} placeholder="Reply to thread…" />
        <InputAddon kind="button" accent aria-label="Send">
          <Icons.arrowRight size={14} />
        </InputAddon>
      </InputGroup>;
  }
}`,...w.parameters?.docs?.source},description:{story:`Send-message pattern: leading attachment, trailing send.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 480
  }}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
        <label htmlFor="invite-url" style={{
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg)'
      }}>
          Invite link
        </label>
        <InputGroup>
          <InputAddon kind="icon"><Icons.link size={14} /></InputAddon>
          <input id="invite-url" className="in-control" readOnly defaultValue="https://forge-ds.com/invites/3f4-9k2-x8q" />
          <InputAddon kind="button" aria-label="Copy link">
            <Icons.copy size={14} />
          </InputAddon>
        </InputGroup>
        <span style={{
        fontSize: 12,
        color: 'var(--fg-muted)'
      }}>
          Share with anyone to grant read access.
        </span>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
        <label htmlFor="budget" style={{
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg)'
      }}>
          Monthly budget
        </label>
        <InputGroup>
          <InputAddon kind="select" aria-label="Currency">
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </InputAddon>
          <input id="budget" className="in-control" type="number" min="0" placeholder="0.00" />
          <InputAddon kind="text" id="budget-unit">/ month</InputAddon>
        </InputGroup>
      </div>
    </div>
}`,...T.parameters?.docs?.source},description:{story:`In context: a realistic signup-form fragment.`,...T.parameters?.docs?.description}}},E=[`Default`,`LeadingText`,`TrailingText`,`LeadingIcon`,`TrailingPrimaryButton`,`IconOnlyButton`,`TrailingSelect`,`Sizes`,`Invalid`,`Disabled`,`RTL`,`UrlCopy`,`ThreeSegments`,`SendMessage`,`InContext`]}))();export{d as Default,b as Disabled,g as IconOnlyButton,T as InContext,y as Invalid,m as LeadingIcon,f as LeadingText,x as RTL,w as SendMessage,v as Sizes,C as ThreeSegments,h as TrailingPrimaryButton,_ as TrailingSelect,p as TrailingText,S as UrlCopy,E as __namedExportsOrder,u as default};