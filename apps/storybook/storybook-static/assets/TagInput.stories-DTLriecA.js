import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{h as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Forms/TagInput`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Free-entry list field. Type a value and press Enter or comma to commit it as a chip; Backspace on an empty caret removes the last chip. Paste splits on comma and newline. Supports optional maxTags, duplicate prevention, and a validate predicate. Controlled (value + onValueChange) and uncontrolled (defaultValue) modes.`}}},args:{placeholder:`Add tag…`,size:`md`,disabled:!1,readOnly:!1},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},disabled:{control:`boolean`},readOnly:{control:`boolean`},maxTags:{control:`number`},placeholder:{control:`text`},help:{control:`text`}}},l={render:e=>{let[t,n]=o.useState([`identity`,`auth`]);return(0,s.jsxs)(`div`,{style:{maxWidth:480,display:`flex`,flexDirection:`column`,gap:8},children:[(0,s.jsx)(`label`,{className:`in-label`,htmlFor:`story-default-input`,style:{display:`block`},children:`Topics`}),(0,s.jsx)(i,{...e,id:`story-default-input`,value:t,onValueChange:n,help:`Press Enter or comma to add. Backspace removes the last tag.`})]})}},u={render:()=>{let[e,t]=o.useState([`react`,`vue`]),[n,r]=o.useState([`react`,`vue`]),[a,c]=o.useState([`react`,`vue`]);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:480},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontSize:`var(--text-base)`,color:`var(--fg-muted)`,marginBottom:6},children:`Small (28 px)`}),(0,s.jsx)(i,{size:`sm`,value:e,onValueChange:t,placeholder:`Add tag…`})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontSize:`var(--text-base)`,color:`var(--fg-muted)`,marginBottom:6},children:`Default (36 px)`}),(0,s.jsx)(i,{size:`md`,value:n,onValueChange:r,placeholder:`Add tag…`})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontSize:`var(--text-base)`,color:`var(--fg-muted)`,marginBottom:6},children:`Large (44 px)`}),(0,s.jsx)(i,{size:`lg`,value:a,onValueChange:c,placeholder:`Add tag…`})]})]})}},d={render:()=>{let[e,t]=o.useState([`lead@forge.io`]);return(0,s.jsxs)(`div`,{style:{maxWidth:480},children:[(0,s.jsxs)(`label`,{className:`in-label`,htmlFor:`story-val-input`,style:{display:`block`,marginBottom:6},children:[`Recipients`,` `,(0,s.jsx)(`span`,{className:`opt`,children:`(max 5 emails)`})]}),(0,s.jsx)(i,{id:`story-val-input`,value:e,onValueChange:t,placeholder:`Add an email…`,maxTags:5,validate:e=>/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(e)?null:`Not a valid email address`})]})}},f={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:480},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontSize:`var(--text-base)`,color:`var(--fg-muted)`,marginBottom:6},children:`Default`}),(0,s.jsx)(i,{defaultValue:[`react`],placeholder:`Add tag…`})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontSize:`var(--text-base)`,color:`var(--fg-muted)`,marginBottom:6},children:`Disabled`}),(0,s.jsx)(i,{defaultValue:[`locked`,`readonly`],disabled:!0})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontSize:`var(--text-base)`,color:`var(--fg-muted)`,marginBottom:6},children:`Read-only`}),(0,s.jsx)(i,{defaultValue:[`prod-east-1`,`prod-west-2`,`prod-eu-1`],readOnly:!0})]})]})},p={render:()=>{let[e,t]=o.useState([`الهوية`,`المصادقة`,`الجلسات`]);return(0,s.jsxs)(`div`,{dir:`rtl`,style:{maxWidth:480},children:[(0,s.jsx)(`label`,{className:`in-label`,htmlFor:`story-rtl-input`,style:{display:`block`,marginBottom:6},children:`المواضيع (Topics)`}),(0,s.jsx)(i,{id:`story-rtl-input`,value:e,onValueChange:t,placeholder:`أضف موضوعًا…`})]})}},m={render:()=>{let[e,t]=o.useState([`platform`,`identity`]),[n,r]=o.useState([`prod-east-1`]);return(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:480},children:(0,s.jsxs)(`div`,{style:{padding:20,border:`1px solid var(--border)`,borderRadius:8,background:`var(--surface)`},children:[(0,s.jsx)(`div`,{style:{fontWeight:600,marginBottom:16,fontSize:`var(--text-body)`},children:`Pipeline filter`}),(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`label`,{className:`in-label`,htmlFor:`ctx-teams`,style:{display:`block`,marginBottom:6},children:`Teams`}),(0,s.jsx)(i,{id:`ctx-teams`,value:e,onValueChange:t,placeholder:`Add team…`,help:`Filter runs by owning team.`})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`label`,{className:`in-label`,htmlFor:`ctx-envs`,style:{display:`block`,marginBottom:6},children:`Environments`}),(0,s.jsx)(i,{id:`ctx-envs`,value:n,onValueChange:r,placeholder:`Add environment…`,maxTags:4})]})]})]})})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => {
    const INITIAL = ['identity', 'auth'];
    const [tags, setTags] = React.useState<string[]>(INITIAL);
    return <div style={{
      maxWidth: 480,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
        <label className="in-label" htmlFor="story-default-input" style={{
        display: 'block'
      }}>
          Topics
        </label>
        <TagInput {...args} id="story-default-input" value={tags} onValueChange={setTags} help="Press Enter or comma to add. Backspace removes the last tag." />
      </div>;
  }
}`,...l.parameters?.docs?.source},description:{story:`Basic free-entry. Enter or comma commits; Backspace removes the last tag.
 Starts with two tags so clicking × immediately demonstrates live removal.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sm, setSm] = React.useState<string[]>(['react', 'vue']);
    const [md, setMd] = React.useState<string[]>(['react', 'vue']);
    const [lg, setLg] = React.useState<string[]>(['react', 'vue']);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      maxWidth: 480
    }}>
        <div>
          <div style={{
          fontSize: 'var(--text-base)',
          color: 'var(--fg-muted)',
          marginBottom: 6
        }}>
            Small (28 px)
          </div>
          <TagInput size="sm" value={sm} onValueChange={setSm} placeholder="Add tag…" />
        </div>
        <div>
          <div style={{
          fontSize: 'var(--text-base)',
          color: 'var(--fg-muted)',
          marginBottom: 6
        }}>
            Default (36 px)
          </div>
          <TagInput size="md" value={md} onValueChange={setMd} placeholder="Add tag…" />
        </div>
        <div>
          <div style={{
          fontSize: 'var(--text-base)',
          color: 'var(--fg-muted)',
          marginBottom: 6
        }}>
            Large (44 px)
          </div>
          <TagInput size="lg" value={lg} onValueChange={setLg} placeholder="Add tag…" />
        </div>
      </div>;
  }
}`,...u.parameters?.docs?.source},description:{story:`Three sizes — sm / md (default) / lg — to match the surrounding form chrome.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [emails, setEmails] = React.useState<string[]>(['lead@forge.io']);
    return <div style={{
      maxWidth: 480
    }}>
        <label className="in-label" htmlFor="story-val-input" style={{
        display: 'block',
        marginBottom: 6
      }}>
          Recipients{' '}
          <span className="opt">(max 5 emails)</span>
        </label>
        <TagInput id="story-val-input" value={emails} onValueChange={setEmails} placeholder="Add an email…" maxTags={5} validate={t => /^[^@\\s]+@[^@\\s.]+\\.[^@\\s]+$/.test(t) ? null : 'Not a valid email address'} />
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`Commit-time validator — rejects malformed entries and caps the total.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 480
  }}>
      <div>
        <div style={{
        fontSize: 'var(--text-base)',
        color: 'var(--fg-muted)',
        marginBottom: 6
      }}>
          Default
        </div>
        <TagInput defaultValue={['react']} placeholder="Add tag…" />
      </div>
      <div>
        <div style={{
        fontSize: 'var(--text-base)',
        color: 'var(--fg-muted)',
        marginBottom: 6
      }}>
          Disabled
        </div>
        <TagInput defaultValue={['locked', 'readonly']} disabled />
      </div>
      <div>
        <div style={{
        fontSize: 'var(--text-base)',
        color: 'var(--fg-muted)',
        marginBottom: 6
      }}>
          Read-only
        </div>
        <TagInput defaultValue={['prod-east-1', 'prod-west-2', 'prod-eu-1']} readOnly />
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Default / disabled / readonly states.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [tags, setTags] = React.useState<string[]>(['الهوية', 'المصادقة', 'الجلسات']);
    return <div dir="rtl" style={{
      maxWidth: 480
    }}>
        <label className="in-label" htmlFor="story-rtl-input" style={{
        display: 'block',
        marginBottom: 6
      }}>
          المواضيع (Topics)
        </label>
        <TagInput id="story-rtl-input" value={tags} onValueChange={setTags} placeholder="أضف موضوعًا…" />
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Chips and the caret flow right-to-left; remove buttons stay on the trailing edge.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [teams, setTeams] = React.useState<string[]>(['platform', 'identity']);
    const [envs, setEnvs] = React.useState<string[]>(['prod-east-1']);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      maxWidth: 480
    }}>
        <div style={{
        padding: 20,
        border: '1px solid var(--border)',
        borderRadius: 8,
        background: 'var(--surface)'
      }}>
          <div style={{
          fontWeight: 600,
          marginBottom: 16,
          fontSize: 'var(--text-body)'
        }}>
            Pipeline filter
          </div>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
            <div>
              <label className="in-label" htmlFor="ctx-teams" style={{
              display: 'block',
              marginBottom: 6
            }}>
                Teams
              </label>
              <TagInput id="ctx-teams" value={teams} onValueChange={setTeams} placeholder="Add team…" help="Filter runs by owning team." />
            </div>
            <div>
              <label className="in-label" htmlFor="ctx-envs" style={{
              display: 'block',
              marginBottom: 6
            }}>
                Environments
              </label>
              <TagInput id="ctx-envs" value={envs} onValueChange={setEnvs} placeholder="Add environment…" maxTags={4} />
            </div>
          </div>
        </div>
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Tag Input inside a realistic pipeline-filter form.`,...m.parameters?.docs?.description}}},h=[`Default`,`Sizes`,`WithValidation`,`States`,`RTL`,`InContext`]}))();export{l as Default,m as InContext,p as RTL,u as Sizes,f as States,d as WithValidation,h as __namedExportsOrder,c as default};