'use client';
// Forge - Publish skill wizard (/portal/skills/new).
// Guides publication through 4 steps:
//   1 Define       - name, category, description, owner team/tribe, initial version
//   2 Capabilities - pick Actions (multi-select), derived MCP server chips
//   3 Guardrails   - read-only guardrail gate summary, install access, runnable-by
//   4 Evaluate     - mocked eval cases + Save as draft / Publish CTAs
//
// Built only from Eidos DS primitives and .fp-* classes. No per-page <style>.
// Static/deterministic data only - no Date.now() or Math.random() in render.

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Icons, Pill, Input, Textarea, Select, RadioCardGroup,
  Field, Button,
  type SelectOption,
} from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import { SKILL_CATEGORIES, type SkillCategory } from '@/portal/data/skills';
import { ACTIONS, GATE_META, type Action, type Gate } from '@/portal/data/actions';
import { SQUADS } from '@/portal/data/teams';

// ── Static option data ────────────────────────────────────────────────────────

const STEPS = [
  { id: 'define',       title: 'Define',       sub: 'Name, category and owner' },
  { id: 'capabilities', title: 'Capabilities', sub: 'Actions and MCP servers' },
  { id: 'guardrails',   title: 'Guardrails',   sub: 'Policy and access control' },
  { id: 'evaluate',     title: 'Evaluate',     sub: 'Test cases and publish' },
] as const;

type RunnableBy = 'human' | 'agent' | 'both';
type InstallPolicy = 'official' | 'community';

const RUNNABLE_OPTIONS: SelectOption[] = [
  { value: 'both',   label: 'Human and agent' },
  { value: 'human',  label: 'Human only' },
  { value: 'agent',  label: 'Agent only' },
];

const INSTALL_OPTIONS = [
  { value: 'official',  title: 'Official', description: 'Platform-reviewed, appears in the Official tier. Requires security sign-off.' },
  { value: 'community', title: 'Community', description: 'Self-published by any engineer. Appears in Community with an unverified badge.' },
] as const;

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.circle;
  return <C size={size} />;
};

// Derive the unique MCP server ids from a set of selected actions.
function mcpServersFrom(actions: Action[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const a of actions) {
    if (a.mcp && !seen.has(a.mcp)) { seen.add(a.mcp); out.push(a.mcp); }
  }
  return out;
}

// Summarise guardrail gates across selected actions. Returns the "strictest" gate,
// ordered: blocked > 2-approvers > 1-approver > auto.
const GATE_ORDER: Gate[] = ['auto', '1-approver', '2-approvers', 'blocked'];
function gateRank(g: Gate): number { return GATE_ORDER.indexOf(g); }

// Group selected actions by gate for the summary table.
function groupByGate(actions: Action[]): Record<Gate, Action[]> {
  const out = { auto: [], '1-approver': [], '2-approvers': [], blocked: [] } as Record<Gate, Action[]>;
  for (const a of actions) out[a.gate].push(a);
  return out;
}

// Static eval cases (deterministic, no random).
const EVAL_CASES = [
  { id: 'e1', label: 'Happy path - standard invocation', pass: true,  detail: 'Skill invoked with valid inputs; all actions resolved and returned expected output.' },
  { id: 'e2', label: 'Guardrail gate escalation',        pass: true,  detail: 'Action requiring 1 approver triggered the approval flow and blocked execution until resolved.' },
  { id: 'e3', label: 'Missing required input',           pass: true,  detail: 'Skill raised a validation error for the missing field before calling any action.' },
  { id: 'e4', label: 'Blocked action attempted',         pass: false, detail: 'Skill attempted to invoke a blocked action directly. Gate stopped execution. Skill must not bypass blocked gates.' },
] as const;

const EVAL_PASS_COUNT = EVAL_CASES.filter((c) => c.pass).length;
const EVAL_SUCCESS_RATE = Math.round((EVAL_PASS_COUNT / EVAL_CASES.length) * 100);

// ── Version options ───────────────────────────────────────────────────────────
const VERSION_OPTIONS: SelectOption[] = [
  { value: 'v0.1.0', label: 'v0.1.0 - Initial release' },
  { value: 'v0.2.0', label: 'v0.2.0 - Early access' },
  { value: 'v1.0.0', label: 'v1.0.0 - Stable release' },
];

// Squad options for the owner select.
const SQUAD_OPTIONS: SelectOption[] = SQUADS.map((s) => ({
  value: s.id,
  label: s.name,
  description: s.tribe,
}));

const CATEGORY_OPTIONS: SelectOption[] = SKILL_CATEGORIES.map((c) => ({
  value: c,
  label: c,
}));

// ── Wizard component ──────────────────────────────────────────────────────────

export default function NewSkill() {
  const router = useRouter();
  const { setCrumb } = usePageCrumb();
  React.useEffect(() => {
    setCrumb({ label: 'Publish skill', replace: true });
    return () => setCrumb(null);
  }, [setCrumb]);

  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);

  // Step 1 - Define
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<SkillCategory>('Delivery');
  const [desc, setDesc] = React.useState('');
  const [squad, setSquad] = React.useState(SQUADS[0].id);
  const [version, setVersion] = React.useState('v0.1.0');

  // Step 2 - Capabilities (selected action ids)
  const [selectedActionIds, setSelectedActionIds] = React.useState<Set<string>>(new Set());

  const selectedActions = React.useMemo(
    () => ACTIONS.filter((a) => selectedActionIds.has(a.id)),
    [selectedActionIds],
  );
  const mcpServers = React.useMemo(() => mcpServersFrom(selectedActions), [selectedActions]);

  const toggleAction = (id: string) =>
    setSelectedActionIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Step 3 - Guardrails & RBAC
  const [installPolicy, setInstallPolicy] = React.useState<InstallPolicy>('official');
  const [runnableBy, setRunnableBy] = React.useState<RunnableBy>('both');

  // Validity
  const step0Ok = name.trim().length > 0 && desc.trim().length > 0;
  const step1Ok = selectedActionIds.size > 0;
  const canContinue = step === 0 ? step0Ok : step === 1 ? step1Ok : true;

  const goto = (i: number) => {
    if (i <= step || (i === step + 1 && canContinue)) setStep(i);
  };
  const next = () => {
    if (!canContinue) return;
    step < STEPS.length - 1 ? setStep(step + 1) : setDone(true);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const selectedSquad = SQUADS.find((s) => s.id === squad);

  // ── Done panel ───────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="fp-wizard-done">
        <span className="ic"><Icons.check size={30} /></span>
        <h1>Skill published</h1>
        <p>Your skill is now listed in the marketplace. Engineers and agents can add it from the catalog.</p>

        <div className="fp-wizard-donecard">
          <div className="dc-id">
            <span className="fp-skill-ic" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--ember-soft)', color: 'var(--ember)' }}>
              <Icons.zap size={18} />
            </span>
            <div className="dc-idtx">
              <span className="dc-nm">{name}</span>
              <span className="dc-sm">{desc}</span>
            </div>
          </div>

          <dl className="dc-props">
            <div className="dcp"><dt>Category</dt><dd>{category}</dd></div>
            <div className="dcp"><dt>Version</dt><dd>{version}</dd></div>
            <div className="dcp"><dt>Owner</dt><dd>{selectedSquad?.name ?? squad}</dd></div>
            <div className="dcp"><dt>Actions</dt><dd>{selectedActionIds.size}</dd></div>
            <div className="dcp"><dt>MCP servers</dt><dd>{mcpServers.length || 'None'}</dd></div>
            <div className="dcp"><dt>Runnable by</dt><dd>{runnableBy === 'both' ? 'Human + agent' : runnableBy === 'human' ? 'Human' : 'Agent'}</dd></div>
          </dl>

          <div className="dc-sec">
            <span className="dc-sec-h"><Icons.shield size={14} /> Access and policy</span>
            <div className="dc-sec-chips">
              <Pill tone={installPolicy === 'official' ? 'ember' : 'neutral'} dot={installPolicy === 'official'}>
                {installPolicy === 'official' ? 'Official tier' : 'Community tier'}
              </Pill>
              <Pill tone="neutral">{runnableBy === 'both' ? 'Human + agent' : runnableBy === 'human' ? 'Human only' : 'Agent only'}</Pill>
            </div>
          </div>
        </div>

        <div className="row">
          <Button variant="outline" asChild>
            <Link href="/portal/skills"><Icons.zap size={14} /> Back to Skills</Link>
          </Button>
          <Button variant="ember" asChild>
            <Link href="/portal/agents"><Icons.agent size={14} /> Add to an agent</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Step bodies ──────────────────────────────────────────────────────────────

  const StepDefine = (
    <>
      <StepHead
        title="Define the skill"
        desc="Name the skill, pick its category, describe what it does, and assign an owning team. These appear in the marketplace catalog."
      />
      <Field label="Skill name" required>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. PII scanner"
          maxLength={48}
          autoFocus
        />
      </Field>

      <Field label="Category" required hint="Choose the domain this skill belongs to.">
        <Select
          options={CATEGORY_OPTIONS}
          value={category}
          onValueChange={(v) => setCategory(v as SkillCategory)}
          width="220px"
        />
      </Field>

      <Field label="Description" required hint="One sentence that explains what the skill does. This is the first thing engineers read in the catalog.">
        <Textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Scans logs and payloads for unregistered PII fields."
          rows={3}
          maxLength={200}
          showCount
        />
      </Field>

      <Field label="Owner team" hint="The squad responsible for this skill's quality and lifecycle.">
        <Select
          options={SQUAD_OPTIONS}
          value={squad}
          onValueChange={setSquad}
          width="280px"
          searchable
          searchPlaceholder="Search squads..."
        />
      </Field>

      <Field label="Initial version" hint="Semantic version of this first published release.">
        <Select
          options={VERSION_OPTIONS}
          value={version}
          onValueChange={setVersion}
          width="220px"
        />
      </Field>
    </>
  );

  const StepCapabilities = (
    <>
      <StepHead
        title="Capabilities"
        desc="Pick the Actions this skill invokes. The guardrail gate and MCP server for each action are shown so you can reason about the skill's blast radius before publishing."
      />

      <Field
        label="Actions"
        required
        hint="Select every action this skill can call. At least one is required."
        action={
          <span className="fp-wizard-count">
            {selectedActionIds.size} selected
          </span>
        }
      >
        <div className="fp-skill-action-list">
          {ACTIONS.map((a) => {
            const checked = selectedActionIds.has(a.id);
            const gateMeta = GATE_META[a.gate];
            return (
              <label
                key={a.id}
                className={'fp-skill-action-row' + (checked ? ' is-checked' : '')}
              >
                <input
                  type="checkbox"
                  className="fp-skill-action-chk"
                  checked={checked}
                  onChange={() => toggleAction(a.id)}
                />
                <span className="fp-skill-action-ic">
                  {ICON(a.icon, 14)}
                </span>
                <span className="fp-skill-action-tx">
                  <span className="nm">{a.name}</span>
                  <span className="ds">{a.desc}</span>
                </span>
                <span className="fp-skill-action-meta">
                  <Pill tone={gateMeta.tone}>{gateMeta.label}</Pill>
                  {a.mcp && (
                    <span className="fp-skill-action-mcp mono">{a.mcp}-mcp</span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </Field>

      {mcpServers.length > 0 && (
        <Field
          label="MCP servers touched"
          hint="Derived from your action selection. These servers must be available in any environment where this skill runs."
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {mcpServers.map((srv) => (
              <Pill key={srv} tone="neutral">
                {srv}-mcp
              </Pill>
            ))}
          </div>
        </Field>
      )}
    </>
  );

  const byGate = groupByGate(selectedActions);
  const strictestGate: Gate = (['blocked', '2-approvers', '1-approver', 'auto'] as Gate[]).find(
    (g) => byGate[g].length > 0,
  ) ?? 'auto';

  const StepGuardrails = (
    <>
      <StepHead
        title="Guardrails and access"
        desc="The gate thresholds are inherited from the actions you picked - they are read-only here. Set who can install this skill and what can invoke it."
      />

      <Field
        label="Inherited gate summary"
        hint="The strictest gate from your selected actions. Users installing the skill accept these gates."
      >
        {selectedActions.length === 0 ? (
          <div className="fp-agentd-empty">
            <span className="ic"><Icons.shield size={16} /></span>
            <span>No actions selected. Go back and pick at least one.</span>
          </div>
        ) : (
          <div className="fp-wizard-guards">
            {(Object.entries(byGate) as [Gate, Action[]][])
              .filter(([, acts]) => acts.length > 0)
              .sort(([a], [b]) => gateRank(b) - gateRank(a))
              .map(([gate, acts]) => {
                const meta = GATE_META[gate];
                return (
                  <div key={gate} className="guard">
                    <span className="ic">{ICON('shield', 15)}</span>
                    <div className="tx">
                      <span className="nm">
                        <Pill tone={meta.tone}>{meta.label}</Pill>
                        <span style={{ marginInlineStart: 8 }}>{acts.length} action{acts.length > 1 ? 's' : ''}</span>
                      </span>
                      <span className="ds">{acts.map((a) => a.name).join(', ')}</span>
                    </div>
                    <span className="lock"><Icons.lock size={11} /> Inherited</span>
                  </div>
                );
              })}
          </div>
        )}
      </Field>

      {selectedActions.length > 0 && (
        <div className="fp-skill-gate-banner" data-gate={strictestGate}>
          <span className="ic">{ICON(strictestGate === 'blocked' ? 'shield' : strictestGate === 'auto' ? 'check' : 'shield', 14)}</span>
          <span className="tx">
            Effective gate: <strong>{GATE_META[strictestGate].label}</strong>
            {strictestGate === 'blocked' && ' - This skill cannot be invoked until the blocked action is ungated.'}
            {strictestGate === '2-approvers' && ' - Invocations reaching this path require two approvers.'}
            {strictestGate === '1-approver' && ' - Some invocations require one approver.'}
            {strictestGate === 'auto' && ' - All actions are auto-approved. No human gate required.'}
          </span>
        </div>
      )}

      <Field label="Who can install this skill" hint="Controls which tier the skill appears in and who may add it to an agent.">
        <RadioCardGroup
          orientation="horizontal"
          ariaLabel="Install policy"
          value={installPolicy}
          onValueChange={(v) => setInstallPolicy(v as InstallPolicy)}
          className="fp-wizard-armor"
          options={INSTALL_OPTIONS.map((o) => ({ value: o.value, title: o.title, description: o.description }))}
        />
      </Field>

      <Field label="Runnable by" hint="Whether the skill can be called by a human via the portal, an agent, or both.">
        <Select
          options={RUNNABLE_OPTIONS}
          value={runnableBy}
          onValueChange={(v) => setRunnableBy(v as RunnableBy)}
          width="220px"
        />
      </Field>
    </>
  );

  const StepEvaluate = (
    <>
      <StepHead
        title="Evaluate and publish"
        desc="Review the automated eval results for this skill. All cases must pass before publishing to the Official tier. Save as draft to continue later."
      />

      <Field
        label="Eval results"
        hint="4 standard test cases run against the skill contract. Community tier requires only the happy-path case to pass."
        action={
          <span className="fp-wizard-count">
            {EVAL_PASS_COUNT}/{EVAL_CASES.length} pass - {EVAL_SUCCESS_RATE}% success
          </span>
        }
      >
        <div className="fp-skill-eval-list">
          {EVAL_CASES.map((c) => (
            <div key={c.id} className={'fp-skill-eval-row' + (c.pass ? ' is-pass' : ' is-fail')}>
              <span className="fp-skill-eval-ic">
                {c.pass ? <Icons.check size={13} /> : <Icons.x size={13} />}
              </span>
              <div className="fp-skill-eval-tx">
                <span className="nm">{c.label}</span>
                <span className="ds">{c.detail}</span>
              </div>
              <span className={'fp-skill-eval-badge ' + (c.pass ? 'pass' : 'fail')}>
                {c.pass ? 'Pass' : 'Fail'}
              </span>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Skill summary" hint="Read-only recap before publishing.">
        <div className="fp-wizard-review">
          <dl className="rv-props">
            <div className="rvp"><dt>Name</dt><dd>{name || <span className="ph">Unnamed</span>}</dd></div>
            <div className="rvp"><dt>Category</dt><dd>{category}</dd></div>
            <div className="rvp"><dt>Owner</dt><dd>{selectedSquad?.name ?? squad}</dd></div>
            <div className="rvp"><dt>Version</dt><dd>{version}</dd></div>
            <div className="rvp"><dt>Actions</dt><dd>{selectedActionIds.size}</dd></div>
            <div className="rvp"><dt>MCP servers</dt><dd>{mcpServers.length || 'None'}</dd></div>
            <div className="rvp"><dt>Install tier</dt><dd>{installPolicy === 'official' ? 'Official' : 'Community'}</dd></div>
            <div className="rvp"><dt>Runnable by</dt><dd>{runnableBy === 'both' ? 'Human + agent' : runnableBy === 'human' ? 'Human only' : 'Agent only'}</dd></div>
          </dl>
        </div>
      </Field>
    </>
  );

  const BODY = [StepDefine, StepCapabilities, StepGuardrails, StepEvaluate][step];
  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="fp-wizard">
      <header className="fp-wizard-head">
        <div className="fp-chat-pane-head">
          <span className="eyebrow">Forge - Skills</span>
          <h1>Publish skill</h1>
          <p className="lede">Package a reusable ability that agents can invoke. Define its actions, guardrail gates, and access policy before listing it in the marketplace.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/portal/skills"><Icons.x size={14} /> Cancel</Link>
        </Button>
      </header>

      <div className="fp-wizard-body">
        <nav className="fp-wizard-rail" aria-label="Steps">
          {STEPS.map((s, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : 'todo';
            const reachable = i <= step || (i === step + 1 && canContinue);
            return (
              <button
                key={s.id}
                type="button"
                className={`fp-wizard-step is-${state}`}
                disabled={!reachable}
                onClick={() => goto(i)}
                aria-current={state === 'active' ? 'step' : undefined}
              >
                <span className="mk">
                  {state === 'done' ? <Icons.check size={14} strokeWidth={3} /> : i + 1}
                </span>
                <span className="tx">
                  <span className="t">{s.title}</span>
                  <span className="s">{s.sub}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="fp-wizard-panel">
          <div className="fp-wizard-content">
            {BODY}
          </div>

          <footer className="fp-wizard-foot">
            <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
              <Icons.chevronLeft size={14} /> Back
            </Button>
            <span className="fp-wizard-progress t-mono">Step {step + 1} of {STEPS.length}</span>
            {isLastStep ? (
              <div style={{ display: 'inline-flex', gap: 8 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/portal/skills')}
                >
                  Save as draft
                </Button>
                <Button type="button" variant="ember" onClick={next}>
                  <Icons.check size={14} /> Publish skill
                </Button>
              </div>
            ) : (
              <Button type="button" variant="ember" onClick={next} disabled={!canContinue}>
                Continue <Icons.chevronRight size={14} />
              </Button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}

// ── Building blocks ───────────────────────────────────────────────────────────

function StepHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="form-section__head">
      <h2 className="form-section__title">{title}</h2>
      <p className="form-section__desc">{desc}</p>
    </div>
  );
}
