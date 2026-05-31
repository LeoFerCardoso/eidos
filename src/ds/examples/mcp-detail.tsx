'use client';
import * as React from 'react';
import { Avatar, Code, CopyChip, HealthBadge, Icons, RelativeTime, Sparkline, Timeline } from '@/ds/core';
import { FPageHeader, FShell } from './example-shell';
// Eidos IDP — Example: MCP server detail (Model Context Protocol).

  
  
  
  

  const TABS = ['Overview', 'Tools', 'Auth', 'Audit'];

  // 12 tool definitions exposed by the MCP server
  const seed = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
  const sparkFor = (id, base) => Array.from({ length: 12 }).map((_, i) => Math.max(2, Math.round(base + Math.sin((seed(id) + i) / 2) * (base * 0.4) + ((seed(id + i) % 7) - 3))));

  const TOOLS = [
    { name: 'search_code',      desc: 'Search code across all repos · ranks by recency + relevance',
      args: 'q · repo? · path? · limit',  out: 'CodeMatch[]', calls: 1842, latency: 142, base: 80 },
    { name: 'create_issue',     desc: 'Open an issue in a target repo with labels and assignees',
      args: 'repo · title · body · labels?', out: 'Issue', calls: 412, latency: 318, base: 22 },
    { name: 'open_pr',          desc: 'Open a PR from a branch to default · auto-requests reviewers',
      args: 'repo · head · base? · title · body', out: 'PullRequest', calls: 168, latency: 482, base: 12 },
    { name: 'review_pr',        desc: 'Post review comments grouped by file and line range',
      args: 'pr · comments[]',  out: 'Review', calls: 612, latency: 264, base: 38 },
    { name: 'list_workflows',   desc: 'List GitHub Actions workflows for a repo · last 30 runs',
      args: 'repo',             out: 'Workflow[]', calls: 84, latency: 92, base: 7 },
    { name: 'trigger_workflow', desc: 'Dispatch a workflow_run event with inputs · returns run id',
      args: 'repo · workflow_id · ref · inputs?', out: 'RunRef', calls: 132, latency: 218, base: 14 },
    { name: 'comment_issue',    desc: 'Post a comment to an issue or PR thread',
      args: 'issue_or_pr · body', out: 'Comment', calls: 728, latency: 178, base: 42 },
    { name: 'get_file',         desc: 'Fetch raw file content at a ref · supports binary',
      args: 'repo · path · ref?', out: 'FileBlob', calls: 2412, latency: 84, base: 96 },
    { name: 'list_commits',     desc: 'List commits on a branch · filter by author and date range',
      args: 'repo · branch? · since? · author?', out: 'Commit[]', calls: 318, latency: 124, base: 28 },
    { name: 'check_runs',       desc: 'List check runs for a commit · status · conclusion · annotations',
      args: 'repo · sha',       out: 'CheckRun[]', calls: 1042, latency: 96, base: 64 },
    { name: 'merge_pr',         desc: 'Squash · rebase · or merge a PR · respects branch protection',
      args: 'pr · method · commit_title?', out: 'MergeResult', calls: 92, latency: 612, base: 8 },
    { name: 'branch_protection', desc: 'Read or update branch protection rules · audit-logged',
      args: 'repo · branch · rule?', out: 'ProtectionRule', calls: 14, latency: 198, base: 2 },
  ];

  // Recent activity events
  const ACTIVITY = [
    { id: 'a1', title: 'Tool call · review_pr',  meta: 'pr-reviewer · pr #7421',         icon: 'toolCall', at: new Date(Date.now() - 3 * 60 * 1000), tone: 'done' },
    { id: 'a2', title: 'Tool call · search_code', meta: 'incident-triage · q="pix idem"', icon: 'toolCall', at: new Date(Date.now() - 11 * 60 * 1000), tone: 'done' },
    { id: 'a3', title: 'Heartbeat · ok',          meta: 'latency 38ms',                    icon: 'pulse',    at: new Date(Date.now() - 16 * 60 * 1000), tone: 'done' },
    { id: 'a4', title: 'OAuth token refreshed',   meta: 'gh_pat_… valid 30d',              icon: 'key',      at: new Date(Date.now() - 28 * 60 * 1000), tone: 'default' },
    { id: 'a5', title: 'Tool call · merge_pr',    meta: 'release-notes · pr #7398',        icon: 'merge',    at: new Date(Date.now() - 42 * 60 * 1000), tone: 'done' },
  ];

  // Consumer agents
  const CONSUMERS = [
    { name: 'pr-reviewer',       initials: 'PR' },
    { name: 'incident-triage',   initials: 'IT' },
    { name: 'release-notes',     initials: 'RN' },
    { name: 'doc-gen',           initials: 'DG' },
    { name: 'compliance-bot',    initials: 'CB' },
    { name: 'runbook-runner',    initials: 'RR' },
  ];

  const App = () => {
    const [tab, setTab] = React.useState('Tools');
    return (
      <FShell
        nav="mcp"
        crumbs={[{ label: 'Eidos', href: '/example/ai-insights' }, 'MCP', 'github-mcp-server']}>

        <FPageHeader
          eyebrow="MCP / Hosted servers"
          title="github-mcp-server"
          status={<HealthBadge state="up"/>}
          subtitle="Model Context Protocol server · exposes GitHub repo operations to Eidos agents."
          meta={
            <>
              <span className="chip">v0.4.2</span>
              <span className="chip">anthropic</span>
              <span className="chip">OAuth</span>
              <span className="chip ok">read · write</span>
            </>
          }
          actions={
            <>
              <button className="btn ghost"><Icons.refresh size={13}/> Refresh tools</button>
              <button className="btn outline"><Icons.book size={13}/> Docs</button>
              <button className="btn ember"><Icons.play size={13}/> Test connection</button>
            </>
          }/>

        <p style={{fontSize: 'var(--text-base)', lineHeight: 1.65, color:'var(--fg-muted)', maxWidth: 78 + 'ch', marginTop: 8, marginBottom: 18}}>
          github-mcp-server is a Model Context Protocol adapter that fronts the GitHub REST and GraphQL APIs as a stable tool surface for Eidos agents. It centralizes auth (OAuth app + per-tenant scopes), audit-logs every call, and rate-limits per agent — so PR-reviewer · release-notes · incident-triage can read repos, post reviews, and dispatch workflows without each carrying credentials.
        </p>

        {/* 4-tab strip */}
        <div className="fp-tabs">
          {TABS.map(t => (
            <button key={t}
                    className={'fp-tab' + (tab === t ? ' is-active' : '')}
                    onClick={() => setTab(t)}>
              {t}
              {t === 'Tools' && <span style={{marginInlineStart: 8, fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{TOOLS.length}</span>}
              {t === 'Audit' && <span style={{marginInlineStart: 8, fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{ACTIVITY.length}</span>}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="fp-grid fp-grid-2x1" style={{gap: 18, marginTop: 14}}>
          {/* Main — Tools panel */}
          <div className="fp-card" style={{padding: 0}}>
            <div className="fp-card-head" style={{padding: '14px 16px', borderBottom: '1px solid var(--border)'}}>
              <div className="fp-card-title">Tools · {TOOLS.length} exposed</div>
              <span className="pill neutral">read · write</span>
            </div>
            <div className="tbl-wrap">
            <table className="tbl" style={{margin: 0}}>
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Args</th>
                  <th>Output</th>
                  <th>Calls · 24h</th>
                  <th style={{textAlign:'end'}}>Avg latency</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((t) => (
                  <tr key={t.name}>
                    <td className="cell-wrap" style={{verticalAlign: 'top', paddingTop: 12}}>
                      <div style={{display:'flex', flexDirection:'column', gap: 3, maxWidth: 320}}>
                        <span className="mono" style={{color:'var(--ember)', fontWeight: 600, fontSize: 'var(--text-sm)'}}>{t.name}</span>
                        <span style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.45}}>{t.desc}</span>
                      </div>
                    </td>
                    <td style={{verticalAlign: 'top', paddingTop: 12}}>
                      <Code lang="jsx">{t.args}</Code>
                    </td>
                    <td style={{verticalAlign: 'top', paddingTop: 12}}>
                      <span className="mono" style={{color:'var(--ice)', fontSize: 'var(--text-sm)'}}>{t.out}</span>
                    </td>
                    <td style={{verticalAlign: 'top', paddingTop: 8}}>
                      <div style={{display:'flex', alignItems:'center', gap: 8}}>
                        <Sparkline data={sparkFor(t.name, t.base)} w={88} h={24}/>
                        <span className="mono" style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>{t.calls.toLocaleString()}</span>
                      </div>
                    </td>
                    <td style={{textAlign:'end', verticalAlign: 'top', paddingTop: 12}}>
                      <span className="mono" style={{fontSize: 'var(--text-sm)'}}>{t.latency}ms</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Aside */}
          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Connection</div>
                <HealthBadge state="up"/>
              </div>
              <ul style={{listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 10, fontSize: 'var(--text-sm)'}}>
                <li style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'var(--fg-muted)'}}>Endpoint</span>
                  <CopyChip value="mcp://eidos.idp/github" label="mcp://eidos.idp/github"/>
                </li>
                <li style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'var(--fg-muted)'}}>Auth method</span>
                  <span className="pill ice"><Icons.key size={10}/> OAuth · per-tenant</span>
                </li>
                <li style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'var(--fg-muted)'}}>Rate limit</span>
                  <span className="mono">5,000 / hour</span>
                </li>
                <li style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'var(--fg-muted)'}}>Last heartbeat</span>
                  <span className="mono"><RelativeTime value={Date.now() - 16 * 60 * 1000}/></span>
                </li>
                <li style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'var(--fg-muted)'}}>Uptime · 30d</span>
                  <span className="mono" style={{color:'var(--success)'}}>99.97%</span>
                </li>
              </ul>
            </div>

            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Recent activity</div>
                <span className="pill neutral">live</span>
              </div>
              <Timeline items={ACTIVITY} compact/>
            </div>

            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Consumers</div>
                <span className="pill neutral">{CONSUMERS.length} agents</span>
              </div>
              <ul style={{listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 10}}>
                {CONSUMERS.map((c) => (
                  <li key={c.name} style={{display:'flex', alignItems:'center', gap: 10}}>
                    <Avatar p={c}/>
                    <span style={{flex: 1, fontWeight: 600, fontSize: 'var(--text-base)'}}>{c.name}</span>
                    <span className="pill neutral" style={{fontSize: 'var(--text-xs)'}}>agent</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </FShell>
    );
  };

  
  export default App;
