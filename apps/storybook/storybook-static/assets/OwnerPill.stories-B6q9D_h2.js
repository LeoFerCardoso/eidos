import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Ka as n,ja as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m;e((()=>{i(),a=t(),o=n.PEOPLE,s={title:`Primitives/OwnerPill`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:"Avatar + name inline tag for ownership rows — service catalog, PR reviewers, incident commanders. Truncates long names with ellipsis; the optional `role` prop appends a muted label."}}},args:{person:o[0],role:o[0].role,ember:!1},argTypes:{role:{control:`text`,description:`Role label appended after the name in muted weight.`},ember:{control:`boolean`,description:`Ember-tinted avatar (incident commander accent).`}}},c={},l={args:{person:o[1],role:void 0}},u={args:{person:o[0],role:`Incident Commander`,ember:!0}},d={args:{person:void 0}},f={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10},children:o.map(e=>(0,a.jsx)(r,{person:e,role:e.role},e.initials))})},p={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,padding:16,background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8,maxWidth:320},children:[{label:`Owner`,person:o[2],role:`Tech Lead · Pix`},{label:`Commander`,person:o[7],role:`Incident Commander`,ember:!0},{label:`Reviewer`,person:o[3]}].map(({label:e,person:t,role:n,ember:i=!1})=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,a.jsx)(`span`,{style:{fontSize:12,color:`var(--fg-muted)`},children:e}),(0,a.jsx)(r,{person:t,role:n,ember:i})]},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source},description:{story:`Default — name + role.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    person: PEOPLE[1],
    role: undefined
  }
}`,...l.parameters?.docs?.source},description:{story:`Without role — compact, name only.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    person: PEOPLE[0],
    role: 'Incident Commander',
    ember: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Ember-tinted — for incident commanders.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    person: undefined
  }
}`,...d.parameters?.docs?.source},description:{story:`Null guard — renders nothing when person is undefined.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  }}>
      {PEOPLE.map(p => <OwnerPill key={p.initials} person={p} role={p.role} />)}
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Team ownership list.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 16,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    maxWidth: 320
  }}>
      {[{
      label: 'Owner',
      person: PEOPLE[2],
      role: 'Tech Lead · Pix'
    }, {
      label: 'Commander',
      person: PEOPLE[7],
      role: 'Incident Commander',
      ember: true
    }, {
      label: 'Reviewer',
      person: PEOPLE[3]
    }].map(({
      label,
      person,
      role,
      ember = false
    }) => <div key={label} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
          <span style={{
        fontSize: 12,
        color: 'var(--fg-muted)'
      }}>{label}</span>
          <OwnerPill person={person} role={role} ember={ember} />
        </div>)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`In a service detail card — owner row + commander row.`,...p.parameters?.docs?.description}}},m=[`Default`,`NameOnly`,`Ember`,`Empty`,`AllPeople`,`InContext`]}))();export{f as AllPeople,c as Default,u as Ember,d as Empty,p as InContext,l as NameOnly,m as __namedExportsOrder,s as default};