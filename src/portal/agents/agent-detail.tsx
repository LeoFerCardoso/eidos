'use client';
// Forge — Agent detail / settings page (/portal/agents/[id]). Opened from an
// agent card. Two columns: a wide left (header + the agent's stored Markdown
// instructions) and a right metadata sidebar separated by a hairline rule.
// Sidebar sections: Properties · Capabilities · Apps (MCP/API, with a tool
// popup) · Skills · Contexts · Usage (DS charts) · Versions. Built from Eidos
// DS primitives + BrandIcon for the app logos.
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import {
  Icons, Avatar, Pill, Chip, Trend, Prose, Modal, BrandIcon, CopyChip, Popover, AlertDialog, Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  useChartColors, Recharts,
} from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import { usePersistentState } from '@/portal/shell/use-persistent-state';
import { AGENTS, getAgent, type Agent } from '@/portal/data/agents';
import {
  OUTPUT_META, buildInstructions, usageFor, type UsageDay,
  appsFor, addableApps, type AppDef,
  capabilitiesFor, skillsFor, SKILL_POOL, type SkillDef, contextsFor, addableContexts, type ContextDef,
  versionsFor, BASELINE_GUARDRAILS, policyFor, dataClassLabel,
  channelsFor, type Channel,
} from '@/portal/data/agent-detail';

const { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } = Recharts;

const STAR_LIMIT = 10;
const SEED_STARRED = AGENTS.filter((a) => a.starred).map((a) => a.id);

type PillTone = React.ComponentProps<typeof Pill>['tone'];
const STATUS_TONE: Record<Agent['status'], PillTone> = { active: 'health-up', beta: 'ember', draft: 'neutral' };

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.circle;
  return <C size={size} />;
};
// Icon component (not element) for DropdownMenuItem's `icon` prop / BrandIcon menus.
const iconOf = (k: string): React.ComponentType<{ size?: number; className?: string }> =>
  (Icons as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[k] ?? Icons.circle;
const Verified = () => (
  <span className="fp-agents-verified" title="Official · built by Equifax" aria-label="Official agent">
    <Icons.badgeCheck size={18} />
  </span>
);

// Map a model name to its LLM brand-icon slug.
const modelBrand = (m: string): string => {
  const s = m.toLowerCase();
  if (/opus|sonnet|haiku|claude/.test(s)) return 'claude';
  if (/gpt|openai|\bo\d/.test(s)) return 'gpt';
  if (/gemini/.test(s)) return 'gemini';
  if (/grok/.test(s)) return 'grok';
  if (/llama/.test(s)) return 'llama';
  if (/mistral/.test(s)) return 'mistral';
  if (/deepseek/.test(s)) return 'deepseek-r1';
  return 'claude';
};

// Avatar-pill (à la OwnerPill) for the model: the LLM logo + the model name.
const ModelPill = ({ model }: { model: string }) => (
  <span className="fp-agentd-modelpill" title={`Model — ${model}`}>
    <span className="av"><BrandIcon slug={modelBrand(model)} size={12} /></span>
    <span className="nm">{model}</span>
  </span>
);

// ── Usage charts (DS) ─────────────────────────────────────────────────────────

const fmtTok = (n: number) => (n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : Math.round(n / 1e3) + 'k');

// Hover tooltip — the extraction date + the token breakdown (input/output/cache)
// and the USD total for that day. Styled with the DS chart-tooltip classes.
function SpendTooltip({ active, payload }: { active?: boolean; payload?: { payload: UsageDay }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const rows: [string, string, string][] = [
    ['Input tokens', fmtTok(p.input), 'var(--ember)'],
    ['Output tokens', fmtTok(p.output), 'color-mix(in oklch, var(--ember) 55%, var(--surface-active))'],
    ['Cache tokens', fmtTok(p.cache), 'var(--fg-faint)'],
    ['Total', `$${p.v}`, 'var(--accent-2)'],
  ];
  return (
    <div className="eidos-tooltip fp-agentd-spendtip">
      <div className="ft-label">{p.date}</div>
      <div className="ft-rows">
        {rows.map(([name, val, color]) => (
          <div key={name} className="ft-row">
            <span className="ft-dot" style={{ background: color }} />
            <span className="ft-name">{name}</span>
            <span className="ft-value t-mono">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bare bars — no card, title or axes; just the chart + the hover tooltip above.
function CostChart({ data }: { data: UsageDay[] }) {
  const c = useChartColors();
  return (
    <div className="fp-agentd-chart">
      <div className="fp-agentd-chart-head">
        <span className="t">Daily spend · last 30 days</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }} barCategoryGap={2}>
          <XAxis dataKey="d" hide />
          {/* Mid-height upward (y), and x clamps inside the chart (allowEscapeViewBox
              x:false) so the tooltip flips: aligned to the start for early bars and
              to the end for late bars — never running off the right edge. */}
          <Tooltip cursor={{ fill: 'var(--viz-grid)' }} content={<SpendTooltip />} position={{ y: -78 }} allowEscapeViewBox={{ x: false, y: true }} />

          <Bar dataKey="v" fill={c[0]} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Sidebar scaffolding ───────────────────────────────────────────────────────

function AsideSection({ title, action, count, children }: { title: string; action?: React.ReactNode; count?: number; children: React.ReactNode }) {
  return (
    <section className="fp-agentd-sec">
      <div className="fp-agentd-sec-head">
        <span className="t">{title}</span>
        {count !== undefined && <span className="fp-agentd-sec-count">{count}</span>}
        {action && <span className="fp-agentd-sec-action">{action}</span>}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="fp-agentd-empty">
      <span className="ic">{ICON(icon, 16)}</span>
      <span>{label}</span>
    </div>
  );
}

function AddMenu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="fp-agentd-add"><Icons.plus size={12} /> Add</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="fp-agentd-add-menu">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const KindChip = ({ kind }: { kind: AppDef['kind'] }) => (
  <span className={`fp-agentd-kind k-${kind.toLowerCase()}`}>{kind}</span>
);

const CH_STATUS: Record<Channel['status'], { label: string; tone: string }> = {
  on:     { label: 'Live',      tone: 'on' },
  review: { label: 'In review', tone: 'review' },
  off:    { label: 'Off',       tone: 'off' },
};
const ChannelStatusBadge = ({ status }: { status: Channel['status'] }) => (
  <span className={`fp-agentd-chstatus s-${CH_STATUS[status].tone}`}>{CH_STATUS[status].label}</span>
);

// Share popover — one copyable link per active channel (Forge chat, API, A2A).
function ShareChannels({ agent, channels }: { agent: Agent; channels: Channel[] }) {
  return (
    <div className="fp-agentd-share">
      <div className="h">Share {agent.name}</div>
      <div className="rows">
        {channels.map((c) => (
          <div key={c.id} className="ch">
            <span className="ic">{ICON(c.icon, 14)}</span>
            <span className="nm">{c.label}</span>
            {c.status === 'on'
              ? <CopyChip value={c.link} label="Copy link" />
              : <span className="st"><ChannelStatusBadge status={c.status} /></span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AgentDetail({ id }: { id: string }) {
  const agent = getAgent(id);
  const router = useRouter();
  const { setCrumb } = usePageCrumb();
  const [confirm, setConfirm] = React.useState<null | 'archive' | 'delete'>(null);
  const [starredIds, setStarredIds] = usePersistentState<string[]>('forge.agents.starred', SEED_STARRED);
  const [activeApp, setActiveApp] = React.useState<AppDef | null>(null);
  const [extraApps, setExtraApps] = React.useState<AppDef[]>([]);
  const [skills, setSkills] = React.useState<SkillDef[]>([]);
  const [contexts, setContexts] = React.useState<ContextDef[]>([]);

  React.useEffect(() => {
    if (agent) setCrumb({ label: agent.name, replace: true });
    return () => setCrumb(null);
  }, [agent, setCrumb]);

  // Seed editable lists + reset additions per agent. (Contexts start empty —
  // the context layer ships later.)
  React.useEffect(() => {
    setSkills(agent ? skillsFor(agent) : []);
    setContexts(agent ? contextsFor(agent) : []);
    setExtraApps([]);
  }, [agent]);

  if (!agent) {
    return (
      <div className="fp-agents-empty" style={{ padding: '64px 0' }}>
        <Icons.sparkle size={28} />
        <p>No agent with id &ldquo;{id}&rdquo;.</p>
        <Button variant="ghost" asChild><Link href="/portal/agents"><Icons.chevronLeft size={13} /> Back to agents</Link></Button>
      </div>
    );
  }

  const starred = starredIds.includes(agent.id);
  const atLimit = starredIds.length >= STAR_LIMIT;
  const toggleStar = () =>
    setStarredIds((ids) =>
      ids.includes(agent.id) ? ids.filter((x) => x !== agent.id) : ids.length >= STAR_LIMIT ? ids : [...ids, agent.id],
    );

  const out = OUTPUT_META[agent.output];
  const usage = usageFor(agent);
  const apps = [...appsFor(agent), ...extraApps].sort((a, b) => a.name.localeCompare(b.name));
  const capabilities = capabilitiesFor(agent);
  const versions = versionsFor(agent);
  const policy = policyFor(agent);
  const channels = channelsFor(agent);
  const instructions = buildInstructions(agent);
  const appsToAdd = addableApps(apps);
  const ctxToAdd = addableContexts(contexts);
  const skillsToAdd = SKILL_POOL.filter((s) => !skills.some((x) => x.name === s.name));

  return (
    <div className="fp-agentd">
      {/* ── Left: header + instructions (content centred in the leftover) ── */}
      <div className="fp-agentd-main">
        <div className="fp-agentd-main-in">
        <div className="fp-agentd-head">
          <div className="fp-agentd-topbar">
            <Button variant="ghost" asChild>
              <Link href="/portal/agents"><Icons.chevronLeft size={14} /> Back to agents</Link>
            </Button>
            <div className="fp-agentd-topbar-actions">
              <Popover
                side="bottom"
                align="end"
                aria-label="Share agent"
                className="fp-agentd-sharepop"
                trigger={<Button variant="ghost"><Icons.share size={14} /> Share</Button>}
              >
                <ShareChannels agent={agent} channels={channels} />
              </Popover>
              <Button variant="default" asChild>
                <Link href={`/portal/agents/${agent.id}/edit`}><Icons.edit size={14} /> Edit</Link>
              </Button>
              <Button variant="ember" asChild>
                <Link href={`/portal/chat?agent=${agent.id}`}>
                  {out.conversational ? <><Icons.chat size={14} /> New chat</> : <><Icons.play size={14} /> Run agent</>}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" icon aria-label="More actions"><Icons.more size={16} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem icon={Icons.copy} onSelect={() => router.push(`/portal/agents/new?from=${agent.id}`)}>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem icon={Icons.inbox} onSelect={() => setConfirm('archive')}>Archive</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem icon={Icons.trash} variant="destructive" onSelect={() => setConfirm('delete')}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="fp-agentd-title">
            <Avatar name={agent.name} size={44} />
            <h1>
              {agent.name}
              {agent.official && <Verified />}
            </h1>
            <button
              type="button"
              className={'fp-agents-star' + (starred ? ' is-on' : '')}
              aria-pressed={starred}
              disabled={!starred && atLimit}
              title={starred ? 'Unstar' : atLimit ? `Starred limit reached (${STAR_LIMIT})` : 'Star for quick access'}
              aria-label={starred ? 'Unstar agent' : 'Star agent'}
              onClick={toggleStar}
            >
              <Icons.star size={17} />
            </button>
          </div>

          <p className="fp-agentd-summary">{agent.desc}</p>
        </div>

        <Prose className="fp-agentd-instructions">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {instructions}
          </ReactMarkdown>
        </Prose>
        </div>
      </div>

      <div className="fp-agentd-rule" aria-hidden="true" />

      {/* ── Right: metadata sidebar ─────────────────────────────────────── */}
      <aside className="fp-agentd-aside">
        {/* Properties */}
        <AsideSection title="Properties">
          <dl className="fp-agentd-props">
            <dt>Author</dt>
            <dd>{agent.official ? 'Equifax · Official' : agent.author}</dd>
            <dt>Model</dt>
            <dd><ModelPill model={agent.model} /></dd>
            <dt>Status</dt>
            <dd><Pill tone={STATUS_TONE[agent.status]} dot>{agent.status[0].toUpperCase() + agent.status.slice(1)}</Pill></dd>
            <dt>Version</dt>
            <dd className="mono">{agent.version}</dd>
            <dt>Created</dt>
            <dd>{agent.created}</dd>
            <dt>Updated</dt>
            <dd>{agent.updated}</dd>
            <dt>Tags</dt>
            <dd className="tags">{agent.tags.map((t) => <Chip key={t} tone="neutral">{t}</Chip>)}</dd>
          </dl>
        </AsideSection>

        {/* Capabilities */}
        <AsideSection title="Capabilities" count={capabilities.length}>
          {capabilities.length === 0 ? (
            <EmptyState icon="sparkle" label="No capabilities declared." />
          ) : (
            <div className="fp-agentd-caps">
              {capabilities.map((c) => (
                <span key={c.id} className="cap">{ICON(c.icon, 13)} {c.label}</span>
              ))}
            </div>
          )}
        </AsideSection>

        {/* Output — how the agent responds */}
        <AsideSection title="Output">
          <div className={'fp-agentd-output' + (out.conversational ? '' : ' is-artifact')}>
            <span className="io">{ICON(out.icon, 16)}</span>
            <div className="b">
              <span className="lbl">Responds with {out.label}</span>
              <p className="note">{out.note}</p>
            </div>
          </div>
        </AsideSection>

        {/* Usage — two metric cards (with trend) + the daily-spend bar chart */}
        <AsideSection title="Usage" action={<Link href={`/portal/agents/${agent.id}`} className="fp-agentd-more">View more <Icons.chevronRight size={12} /></Link>}>
          <div className="fp-agentd-metrics">
            <div className="fp-agentd-metric">
              <span className="k">Tokens · 30d</span>
              <span className="vrow">
                <span className="v">{usage.tokensTotal}M</span>
                <Trend delta={usage.tokensTrend} unit="%" />
              </span>
            </div>
            <div className="fp-agentd-metric">
              <span className="k">Spend · 30d</span>
              <span className="vrow">
                <span className="v">${usage.costTotal.toLocaleString()}</span>
                <Trend delta={usage.spendTrend} unit="%" />
              </span>
            </div>
          </div>
          <CostChart data={usage.cost} />
        </AsideSection>

        {/* Guardrails — the enforced security baseline + this agent's policy */}
        <AsideSection title="Guardrails">
          <div className="fp-agentd-guards">
            <p className="fp-agentd-guards-note"><Icons.shield size={12} /> Enforced by Equifax · Google Cloud</p>
            <div className="fp-agentd-list">
              {BASELINE_GUARDRAILS.map((g) => (
                <div key={g.id} className="item">
                  <span className="ic">{ICON(g.icon, 14)}</span>
                  <span className="tx"><span className="nm">{g.label}</span><span className="ds">{g.tool}</span></span>
                  <span className="fp-agentd-lock"><Icons.lock size={10} /></span>
                </div>
              ))}
            </div>
            <dl className="fp-agentd-props fp-agentd-policy">
              <dt>Model Armor</dt>
              <dd><Pill tone={policy.armorLevel === 'strict' ? 'health-up' : 'neutral'} dot>{policy.armorLevel === 'strict' ? 'Strict' : 'Standard'}</Pill></dd>
              <dt>Human approval</dt>
              <dd>{policy.humanApproval ? 'Required' : 'Off'}</dd>
              <dt>Data class</dt>
              <dd>{dataClassLabel(policy.dataClass)}</dd>
            </dl>
          </div>
        </AsideSection>

        {/* Skills */}
        <AsideSection
          title="Skills"
          count={skills.length}
          action={
            <AddMenu label="Add a skill">
              {skillsToAdd.length === 0 ? (
                <DropdownMenuItem disabled>All skills added</DropdownMenuItem>
              ) : (
                skillsToAdd.map((s) => (
                  <DropdownMenuItem key={s.name} icon={iconOf(s.icon)} onSelect={() => setSkills((p) => [...p, s].sort((a, b) => a.name.localeCompare(b.name)))}>{s.name}</DropdownMenuItem>
                ))
              )}
            </AddMenu>
          }
        >
          {skills.length === 0 ? (
            <EmptyState icon="zap" label="No skills enabled." />
          ) : (
            <div className="fp-agentd-list">
              {skills.map((s) => (
                <div key={s.name} className="item">
                  <span className="ic">{ICON(s.icon, 14)}</span>
                  <span className="tx"><span className="nm">{s.name}</span><span className="ds">{s.desc}</span></span>
                  <button type="button" className="fp-agentd-rm" aria-label={`Remove ${s.name}`} onClick={() => setSkills((p) => p.filter((x) => x.name !== s.name))}>
                    <Icons.x size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </AsideSection>

        {/* Contexts (the context layer ships later) */}
        <AsideSection
          title="Contexts"
          count={contexts.length}
          action={
            <AddMenu label="Attach a context">
              {ctxToAdd.length === 0 ? (
                <DropdownMenuItem disabled>All contexts attached</DropdownMenuItem>
              ) : (
                ctxToAdd.map((c) => (
                  <DropdownMenuItem key={c.id} icon={iconOf(c.icon)} onSelect={() => setContexts((p) => [...p, c])}>{c.name}</DropdownMenuItem>
                ))
              )}
            </AddMenu>
          }
        >
          {contexts.length === 0 ? (
            <EmptyState icon="layers" label="No contexts attached yet." />
          ) : (
            <div className="fp-agentd-list">
              {contexts.map((c) => (
                <div key={c.id} className="item">
                  <span className="ic">{ICON(c.icon, 14)}</span>
                  <span className="tx"><span className="nm">{c.name}</span><span className="ds">{c.desc}</span></span>
                  <button type="button" className="fp-agentd-rm" aria-label={`Remove ${c.name}`} onClick={() => setContexts((p) => p.filter((x) => x.id !== c.id))}>
                    <Icons.x size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </AsideSection>

        {/* Apps */}
        <AsideSection
          title="Apps"
          count={apps.length}
          action={
            <AddMenu label="Connect an app">
              {appsToAdd.length === 0 ? (
                <DropdownMenuItem disabled>All apps connected</DropdownMenuItem>
              ) : (
                appsToAdd.map((a) => (
                  <DropdownMenuItem key={a.slug} icon={(p) => <BrandIcon slug={a.slug} {...p} />} onSelect={() => setExtraApps((p) => [...p, a])}>
                    {a.name} <KindChip kind={a.kind} />
                  </DropdownMenuItem>
                ))
              )}
            </AddMenu>
          }
        >
          {apps.length === 0 ? (
            <EmptyState icon="mcpServer" label="No apps connected yet." />
          ) : (
            <div className="fp-agentd-apps">
              {apps.map((app) => (
                <button key={app.slug} type="button" className="app" onClick={() => setActiveApp(app)}>
                  <span className="logo"><BrandIcon slug={app.slug} size={18} /></span>
                  <span className="nm">{app.name}</span>
                  <KindChip kind={app.kind} />
                  <Icons.chevronRight size={13} className="chev" />
                </button>
              ))}
            </div>
          )}
        </AsideSection>

        {/* Channels — how the agent is consumed (chat / API / A2A) */}
        <AsideSection title="Channels">
          <div className="fp-agentd-channels">
            {channels.map((c) => (
              <div key={c.id} className="ch">
                <span className="ic">{ICON(c.icon, 14)}</span>
                <div className="tx">
                  <span className="nm">{c.label}<span className="consumer">{c.consumer}</span></span>
                  <span className="ds">{c.desc}</span>
                  {c.status === 'on' && <div className="lnk"><CopyChip value={c.link} label={c.copyLabel} /></div>}
                </div>
                <ChannelStatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </AsideSection>

        {/* Versions */}
        <AsideSection title="Versions" count={versions.length}>
          <div className="fp-agentd-versions">
            {versions.map((v) => (
              <div key={v.version + v.date} className="ver">
                <span className="dot" aria-hidden="true" />
                <div className="b">
                  <div className="top">
                    <code className="mono">{v.version}</code>
                    {v.current && <span className="cur">current</span>}
                    <span className="date">{v.date}</span>
                  </div>
                  <span className="note">{v.note}</span>
                </div>
              </div>
            ))}
          </div>
        </AsideSection>
      </aside>

      {/* ── App popup — logo, name, details + enabled tools ─────────────── */}
      <Modal
        open={!!activeApp}
        onOpenChange={(o) => !o && setActiveApp(null)}
        size="sm"
        title={activeApp?.name}
        desc={activeApp?.desc}
        hero={
          activeApp ? (
            <div className="fp-agentd-apphero">
              <span className="logo"><BrandIcon slug={activeApp.slug} size={30} color="brand" /></span>
              <KindChip kind={activeApp.kind} />
            </div>
          ) : undefined
        }
      >
        {activeApp && (
          <div className="fp-agentd-apptools">
            <div className="h">Enabled tools <span className="fp-agentd-sec-count">{activeApp.tools.length}</span></div>
            <div className="grid">
              {activeApp.tools.map((t) => (
                <span key={t} className="tool"><Icons.toolCall size={12} /><code className="mono">{t}</code></span>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Archive → recoverable; Delete → permanent (guarded by archive-first copy). */}
      <AlertDialog
        open={confirm === 'archive'}
        onOpenChange={(o) => !o && setConfirm(null)}
        variant="warning"
        title={`Archive ${agent.name}?`}
        description="It moves to Archived and is hidden from the catalog. Live channels are paused. You can restore it any time."
        cancelLabel="Cancel"
        confirmLabel="Archive"
        onConfirm={() => { setConfirm(null); router.push('/portal/agents?archived=1'); }}
      />
      <AlertDialog
        open={confirm === 'delete'}
        onOpenChange={(o) => !o && setConfirm(null)}
        variant="danger"
        title={`Delete ${agent.name}?`}
        description="This permanently removes the agent, its versions and channels. If you might need it back, archive it instead."
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onConfirm={() => { setConfirm(null); router.push('/portal/agents'); }}
      />
    </div>
  );
}
