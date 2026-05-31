import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{b as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p,m;e((()=>{r(),i=t(),a={title:`Forms/Label`,component:n,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A native <label> wrapper that focuses/toggles its associated control on click. Adds an ember required asterisk, an optional muted suffix, sm/md size variants, and disabled styling. Use htmlFor + matching id to bind to the control.`}}},args:{children:`Email address`,size:`md`,required:!1,optional:!1,disabled:!1},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`]},required:{control:`boolean`},optional:{control:`boolean`},disabled:{control:`boolean`},children:{control:`text`},htmlFor:{control:`text`}}},o={render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,width:320},children:[(0,i.jsx)(n,{htmlFor:`demo-email`,...e}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`demo-email`,className:`in-control`,placeholder:`you@forge.com`})})]})},s={args:{children:`Full name`,required:!0},render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,width:320},children:[(0,i.jsx)(n,{htmlFor:`demo-name`,...e}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`demo-name`,className:`in-control`,placeholder:`Ada Lovelace`})})]})},c={args:{children:`Pronoun`,optional:!0},render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,width:320},children:[(0,i.jsx)(n,{htmlFor:`demo-pronoun`,...e}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`demo-pronoun`,className:`in-control`,placeholder:`e.g. she/her`})})]})},l={args:{children:`API key`,size:`sm`},render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4,width:320},children:[(0,i.jsx)(n,{htmlFor:`demo-apikey`,...e}),(0,i.jsx)(`div`,{className:`in-group sm`,children:(0,i.jsx)(`input`,{id:`demo-apikey`,className:`in-control`,placeholder:`sk_live_••••`})})]})},u={args:{children:`Billing email`,disabled:!0},render:e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,width:320},children:[(0,i.jsx)(n,{htmlFor:`demo-billing`,...e}),(0,i.jsx)(`div`,{className:`in-group is-disabled`,children:(0,i.jsx)(`input`,{id:`demo-billing`,className:`in-control`,value:`billing@acme.com`,disabled:!0,readOnly:!0})})]})},d={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:400},children:[(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,i.jsx)(n,{htmlFor:`av-plain`,children:`Plain label (no marker)`}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`av-plain`,className:`in-control`,placeholder:`value`})})]}),(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,i.jsx)(n,{htmlFor:`av-req`,required:!0,children:`Required label`}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`av-req`,className:`in-control`,placeholder:`value`})})]}),(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,i.jsx)(n,{htmlFor:`av-opt`,optional:!0,children:`Optional label`}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`av-opt`,className:`in-control`,placeholder:`value`})})]}),(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,i.jsx)(n,{htmlFor:`av-sm`,size:`sm`,children:`Small label`}),(0,i.jsx)(`div`,{className:`in-group sm`,children:(0,i.jsx)(`input`,{id:`av-sm`,className:`in-control`,placeholder:`value`})})]}),(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,i.jsx)(n,{htmlFor:`av-dis`,disabled:!0,children:`Disabled label`}),(0,i.jsx)(`div`,{className:`in-group is-disabled`,children:(0,i.jsx)(`input`,{id:`av-dis`,className:`in-control`,value:`locked`,disabled:!0,readOnly:!0})})]})]})},f={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:360},children:[(0,i.jsxs)(`div`,{className:`in-field`,children:[(0,i.jsx)(n,{htmlFor:`ctx-email`,required:!0,children:`Email`}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`ctx-email`,className:`in-control`,type:`email`,placeholder:`you@equifax.com`})})]}),(0,i.jsxs)(`div`,{className:`in-field`,children:[(0,i.jsx)(n,{htmlFor:`ctx-pw`,required:!0,children:`Password`}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`ctx-pw`,className:`in-control`,type:`password`,placeholder:`••••••••`})}),(0,i.jsx)(`p`,{className:`in-help`,children:`Minimum 12 characters.`})]}),(0,i.jsxs)(`div`,{className:`in-field`,children:[(0,i.jsx)(n,{htmlFor:`ctx-org`,optional:!0,children:`Organisation`}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`ctx-org`,className:`in-control`,placeholder:`Acme Corp`})})]})]})},p={render:()=>(0,i.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:360},children:[(0,i.jsxs)(`div`,{className:`in-field`,children:[(0,i.jsx)(n,{htmlFor:`rtl-email`,required:!0,children:`البريد الإلكتروني`}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`rtl-email`,className:`in-control`,placeholder:`you@forge.com`})}),(0,i.jsx)(`p`,{className:`in-help`,children:`يستخدم لتسجيل الدخول.`})]}),(0,i.jsxs)(`div`,{className:`in-field`,children:[(0,i.jsx)(n,{htmlFor:`rtl-org`,optional:!0,children:`المنظمة`}),(0,i.jsx)(`div`,{className:`in-group`,children:(0,i.jsx)(`input`,{id:`rtl-org`,className:`in-control`,placeholder:`شركة المثال`})})]})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width: 320
  }}>
      <Label htmlFor="demo-email" {...args} />
      <div className="in-group">
        <input id="demo-email" className="in-control" placeholder="you@forge.com" />
      </div>
    </div>
}`,...o.parameters?.docs?.source},description:{story:`Default md label wired to an input via htmlFor.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Full name',
    required: true
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width: 320
  }}>
      <Label htmlFor="demo-name" {...args} />
      <div className="in-group">
        <input id="demo-name" className="in-control" placeholder="Ada Lovelace" />
      </div>
    </div>
}`,...s.parameters?.docs?.source},description:{story:`Required field — ember asterisk + sr-only "required".`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Pronoun',
    optional: true
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width: 320
  }}>
      <Label htmlFor="demo-pronoun" {...args} />
      <div className="in-group">
        <input id="demo-pronoun" className="in-control" placeholder="e.g. she/her" />
      </div>
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Optional field — muted "(optional)" suffix.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'API key',
    size: 'sm'
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    width: 320
  }}>
      <Label htmlFor="demo-apikey" {...args} />
      <div className="in-group sm">
        <input id="demo-apikey" className="in-control" placeholder="sk_live_••••" />
      </div>
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Small size — compact label for nested or dense forms.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Billing email',
    disabled: true
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width: 320
  }}>
      <Label htmlFor="demo-billing" {...args} />
      <div className="in-group is-disabled">
        <input id="demo-billing" className="in-control" value="billing@acme.com" disabled readOnly />
      </div>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Disabled — label dims to match the disabled control.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 400
  }}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
        <Label htmlFor="av-plain">Plain label (no marker)</Label>
        <div className="in-group"><input id="av-plain" className="in-control" placeholder="value" /></div>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
        <Label htmlFor="av-req" required>Required label</Label>
        <div className="in-group"><input id="av-req" className="in-control" placeholder="value" /></div>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
        <Label htmlFor="av-opt" optional>Optional label</Label>
        <div className="in-group"><input id="av-opt" className="in-control" placeholder="value" /></div>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
        <Label htmlFor="av-sm" size="sm">Small label</Label>
        <div className="in-group sm"><input id="av-sm" className="in-control" placeholder="value" /></div>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
        <Label htmlFor="av-dis" disabled>Disabled label</Label>
        <div className="in-group is-disabled"><input id="av-dis" className="in-control" value="locked" disabled readOnly /></div>
      </div>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`All marker variants side by side for quick comparison.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 360
  }}>
      <div className="in-field">
        <Label htmlFor="ctx-email" required>Email</Label>
        <div className="in-group">
          <input id="ctx-email" className="in-control" type="email" placeholder="you@equifax.com" />
        </div>
      </div>
      <div className="in-field">
        <Label htmlFor="ctx-pw" required>Password</Label>
        <div className="in-group">
          <input id="ctx-pw" className="in-control" type="password" placeholder="••••••••" />
        </div>
        <p className="in-help">Minimum 12 characters.</p>
      </div>
      <div className="in-field">
        <Label htmlFor="ctx-org" optional>Organisation</Label>
        <div className="in-group">
          <input id="ctx-org" className="in-control" placeholder="Acme Corp" />
        </div>
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`In context — a complete sign-in form fragment with required + helper text.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 360
  }}>
      <div className="in-field">
        <Label htmlFor="rtl-email" required>البريد الإلكتروني</Label>
        <div className="in-group">
          <input id="rtl-email" className="in-control" placeholder="you@forge.com" />
        </div>
        <p className="in-help">يستخدم لتسجيل الدخول.</p>
      </div>
      <div className="in-field">
        <Label htmlFor="rtl-org" optional>المنظمة</Label>
        <div className="in-group">
          <input id="rtl-org" className="in-control" placeholder="شركة المثال" />
        </div>
      </div>
    </div>
}`,...p.parameters?.docs?.source},description:{story:`RTL — label and markers flip with reading direction.`,...p.parameters?.docs?.description}}},m=[`Default`,`Required`,`Optional`,`Small`,`Disabled`,`AllVariants`,`InContext`,`RTL`]}))();export{d as AllVariants,o as Default,u as Disabled,f as InContext,c as Optional,p as RTL,s as Required,l as Small,m as __namedExportsOrder,a as default};