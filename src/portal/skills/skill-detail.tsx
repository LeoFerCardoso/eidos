'use client';
// Forge IDP Portal — Skill detail page (/portal/skills/[id]).
// Two-column layout reusing .fp-agentd-* classes from the agent detail pattern.
// Left: skill header + README (what it does, Inputs/Outputs, Example, Permissions).
// Right: metadata sidebar (Properties, Capabilities, Used by agents, Versions).

import * as React from 'react';
import Link from 'next/link';
import { Icons, Pill, Chip, Prose, ProseCode, Button } from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import { AsideSection, EmptyState } from '@/portal/shell/detail-kit';
import {
  getSkill, capabilitiesFor, usedByFor, versionsFor,
  type Skill, type SkillCapability, type SkillVersion,
} from '@/portal/data/skills';
import { AGENTS } from '@/portal/data/agents';

// ── Small local helpers (not exported) ───────────────────────────────────────

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.circle;
  return <C size={size} />;
};



// ── README content per category ───────────────────────────────────────────────
// Static, plausible per-skill write-up: description, inputs, outputs, example
// invocation, and permissions note. Keyed on skill id with a category fallback.

interface ReadmeContent {
  body: string;
  inputs: string;
  outputs: string;
  example: { lang: string; code: string };
  permissions: string;
}

const CATEGORY_READMES: Record<string, ReadmeContent> = {
  Incident: {
    body: 'This skill packages the incident-response playbook used by SRE teams at Equifax Boa Vista. It normalises an alert timeline, correlates related signals from logs and traces, and produces a structured summary ready for a postmortem or an on-call handoff.',
    inputs: '`incident_id` (string) - the PagerDuty or Forge incident ID. `lookback_minutes` (number, default 60) - how far back to pull correlated signals. `services` (string[], optional) - limit correlation to a set of service names.',
    outputs: 'A structured JSON object with `timeline` (ordered events), `likely_cause` (string), `impacted_services` (string[]), `recommended_action` (string), and `confidence` (0-1).',
    example: {
      lang: 'json',
      code: `{
  "skill": "root-cause",
  "inputs": {
    "incident_id": "INC-20260531-0042",
    "lookback_minutes": 90,
    "services": ["score-engine", "identity-svc"]
  }
}`,
    },
    permissions: 'Requires read access to the Forge incident store and the Datadog MCP connection. The skill never writes to any system - it is read-only by design. Outputs are classified Internal (L2) unless the correlated traces contain PII, in which case they are Sensitive (L4) and redacted before display.',
  },
  Delivery: {
    body: 'This skill evaluates a pending release against the platform quality gates defined in the Forge delivery policy. It checks DORA metrics, open P1/P2 incidents, SLO burn rates, and mandatory GMUD approval status before reporting a go / no-go verdict with the blocking reasons.',
    inputs: '`service` (string) - the service slug being deployed. `version` (string) - the image tag or git SHA. `environment` (string) - one of `staging`, `production`. `gmud_id` (string, optional) - the change ticket to validate.',
    outputs: 'A `GatingResult` object: `verdict` (`go` | `no_go`), `blockers` (string[]) listing failing gates, `warnings` (string[]) for soft checks, and `gmud_status` (string).',
    example: {
      lang: 'json',
      code: `{
  "skill": "deploy-gating",
  "inputs": {
    "service": "score-engine",
    "version": "sha-a3f9c21",
    "environment": "production",
    "gmud_id": "GMUD-2026-0831"
  }
}`,
    },
    permissions: 'Needs read access to the Forge CI pipeline API, the GMUD service, and the Datadog SLO API. No write operations. Outputs are Internal (L2).',
  },
  Security: {
    body: 'This skill scans a service or payload for security signals. Depending on the variant, it can map an attack surface, discover unregistered PII in logs and API payloads, or draft evidence packets for dispute investigations. All outputs are passed through Model Armor before they leave the skill boundary.',
    inputs: '`target` (string) - the service slug, log sample, or payload to inspect. `scan_type` (string) - one of `pii`, `threat`, `evidence`. `context` (object, optional) - additional metadata such as the associated incident or transaction ID.',
    outputs: 'A scan report object with `findings` (array of `{field, value, classification}`), `risk_level` (`low` | `medium` | `high`), and `recommended_actions` (string[]).',
    example: {
      lang: 'json',
      code: `{
  "skill": "pii-discovery",
  "inputs": {
    "target": "payment-svc",
    "scan_type": "pii",
    "context": { "incident_id": "INC-20260601-0019" }
  }
}`,
    },
    permissions: 'Requires the PII scan permission (granted by the security team). Outputs containing identified PII are classified Sensitive (L4) and access-logged. The skill is subject to the Model Armor strict profile.',
  },
  Observability: {
    body: 'This skill ingests metric series, distributed traces, and SLO burn-rate data to produce human-readable summaries. It can set SLO targets from historical baselines, rank slow spans in a trace, or flag metric anomalies before they breach an alert threshold.',
    inputs: '`service` (string) - the service to analyse. `metric` (string, optional) - a specific PromQL selector. `trace_id` (string, optional) - a distributed trace ID to walk. `window` (string, default `30m`) - the evaluation window.',
    outputs: 'An analysis object containing `summary` (string), `top_issues` (array of ranked findings), `slo_status` (`ok` | `burning` | `breached`), and `recommended_next` (string).',
    example: {
      lang: 'json',
      code: `{
  "skill": "trace-analysis",
  "inputs": {
    "service": "score-engine",
    "trace_id": "7f4b2a91e0c3d5f8",
    "window": "1h"
  }
}`,
    },
    permissions: 'Reads from Datadog and Prometheus MCP connections. No write operations. Outputs are Internal (L2).',
  },
  Data: {
    body: 'This skill operates on data layer artefacts: SQL queries, SCR field layouts, Ignite feature vectors, and credit-score reason codes. It can rewrite slow queries, explain field contracts from the SCR record layout, or check feature freshness against the Ignite lineage graph.',
    inputs: '`artifact_type` (string) - one of `sql`, `scr_field`, `feature`, `reason_code`. `artifact` (string) - the query, field name, or feature ID to inspect. `context` (object, optional) - schema or lineage hints.',
    outputs: 'A structured result matching the artifact type: for SQL, an `optimised_query` + `index_suggestions`; for SCR fields, a `field_contract`; for features, a `freshness_report`; for reason codes, an `explanation`.',
    example: {
      lang: 'json',
      code: `{
  "skill": "query-optimization",
  "inputs": {
    "artifact_type": "sql",
    "artifact": "SELECT * FROM scr_entries WHERE cpf = ? AND date >= NOW() - INTERVAL 90 DAY"
  }
}`,
    },
    permissions: 'Needs read access to the Snowflake MCP and the Ignite feature store API. No data is written. Query results containing CPF or CNPJ are classified Restricted (L5).',
  },
  Quality: {
    body: 'This skill improves software quality signals in the CI pipeline. It can triage flaky tests, quarantine the worst offenders, and trace flakiness to a likely root cause. It can also diff an API change against downstream consumers and flag breaking changes before they reach production.',
    inputs: '`pipeline_id` (string) - the CI run to inspect. `scope` (string) - one of `flaky`, `contract`. `service` (string, optional) - restrict analysis to one service. `threshold` (number, default 0.05) - flakiness rate above which a test is quarantined.',
    outputs: 'For `flaky`: a `FlakeReport` with `quarantined` (string[]) and `causes` (array of `{test, likely_cause}`). For `contract`: a `ContractDiff` with `breaking` (array of changed endpoints) and `safe` (string[]).',
    example: {
      lang: 'json',
      code: `{
  "skill": "flaky-test-triage",
  "inputs": {
    "pipeline_id": "ci-run-20260604-0812",
    "scope": "flaky",
    "threshold": 0.08
  }
}`,
    },
    permissions: 'Reads from the GitHub Actions and CircleCI APIs. No write operations unless `auto_quarantine` is true (off by default). Outputs are Internal (L2).',
  },
  FinOps: {
    body: 'This skill analyses cloud spend data from the Equifax GCP billing export. It identifies the services and resource types that moved the bill in the last billing cycle, projects usage for the coming period, and proposes right-sizing or commitment changes safe to make without risking availability.',
    inputs: '`billing_period` (string) - ISO month, e.g. `2026-05`. `scope` (string, optional) - restrict to a team label or project. `min_saving_usd` (number, default 100) - ignore optimisations below this threshold.',
    outputs: 'A `SpendReport` with `movers` (array of `{service, delta_usd, pct}`), `projections` (array of `{month, estimated_usd}`), and `recommendations` (array of `{action, saving_usd, risk_level}`).',
    example: {
      lang: 'json',
      code: `{
  "skill": "cost-optimization",
  "inputs": {
    "billing_period": "2026-05",
    "scope": "tribe-fraud",
    "min_saving_usd": 250
  }
}`,
    },
    permissions: 'Requires the FinOps data reader role. Outputs are Internal (L2). Cost data is never exposed outside the portal boundary.',
  },
  Compliance: {
    body: 'This skill enforces LGPD and Equifax data-governance policies. It checks whether each personal-data hop in a service is covered by a registered consent scope, flags gaps, and drafts the per-service remediation steps needed to close them before the next compliance review.',
    inputs: '`service` (string) - the service to audit. `pii_fields` (string[], optional) - specific fields to trace; if omitted, the skill discovers them automatically. `regulation` (string, default `LGPD`) - the regulatory framework to apply.',
    outputs: 'A `ComplianceReport` with `gaps` (array of `{field, missing_scope, severity}`), `covered` (string[]), and `remediation_steps` (string[]).',
    example: {
      lang: 'json',
      code: `{
  "skill": "lgpd-remediation",
  "inputs": {
    "service": "identity-svc",
    "pii_fields": ["cpf", "phone", "email"],
    "regulation": "LGPD"
  }
}`,
    },
    permissions: 'Requires Compliance Auditor role. Outputs are Sensitive (L4) and audit-logged. Human approval is required before any remediation step is executed outside sandbox mode.',
  },
};

const getReadme = (skill: Skill): ReadmeContent =>
  CATEGORY_READMES[skill.category] ?? CATEGORY_READMES['Incident'];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SkillDetail({ id }: { id: string }) {
  const skill = getSkill(id);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (skill) setCrumb({ label: skill.name, replace: true });
    return () => setCrumb(null);
  }, [skill, setCrumb]);

  if (!skill) {
    return (
      <div className="fp-agents-empty" style={{ padding: '64px 0' }}>
        <Icons.zap size={28} />
        <p>No skill with id &ldquo;{id}&rdquo;.</p>
        <Button variant="ghost" asChild>
          <Link href="/portal/skills"><Icons.chevronLeft size={13} /> Back to skills</Link>
        </Button>
      </div>
    );
  }

  const SkillIcon = (Icons as Record<string, React.FC<{ size?: number }>>)[skill.icon] ?? Icons.zap;
  const capabilities = capabilitiesFor(skill);
  const usedByIds = usedByFor(skill);
  const usedByAgents = AGENTS.filter((a) => usedByIds.includes(a.id));
  const versions = versionsFor(skill);
  const readme = getReadme(skill);

  return (
    <div className="fp-agentd">
      {/* ── Left: header + README ────────────────────────────────────────── */}
      <div className="fp-agentd-main">
        <div className="fp-agentd-main-in">
          <div className="fp-agentd-head">
            {/* Topbar: back link + actions */}
            <div className="fp-agentd-topbar">
              <Link href="/portal/skills" className="fp-back-eyebrow" style={{ marginBlockEnd: 0 }}><Icons.arrowLeft size={11} /> Skills</Link>
              <div className="fp-agentd-topbar-actions">
                <Button variant="ghost">
                  <Icons.book size={14} /> Docs
                </Button>
                <Button variant="ember">
                  <Icons.plus size={14} /> Add to agent
                </Button>
              </div>
            </div>

            {/* Title row: icon + name + provenance pill */}
            <div className="fp-agentd-title">
              <span
                className={'fp-skill-ic' + (skill.official ? '' : ' is-muted')}
                aria-hidden="true"
                style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)' }}
              >
                <SkillIcon size={22} />
              </span>
              <h1>{skill.name}</h1>
              <Pill tone={skill.official ? 'ember' : 'neutral'} dot={skill.official}>
                {skill.official ? 'Official' : 'Community'}
              </Pill>
            </div>

            <p className="fp-agentd-summary">{skill.desc}</p>
          </div>

          {/* README body */}
          <Prose className="fp-agentd-instructions">
            <p>{readme.body}</p>

            <h2>Inputs</h2>
            <p>{readme.inputs}</p>

            <h2>Outputs</h2>
            <p>{readme.outputs}</p>

            <h2>Example</h2>
            <p>Sample invocation passed as the <code>skill_call</code> field in an agent turn:</p>
            <ProseCode lang={readme.example.lang}>{readme.example.code}</ProseCode>

            <h2>Permissions / notes</h2>
            <p>{readme.permissions}</p>
          </Prose>
        </div>
      </div>

      <div className="fp-agentd-rule" aria-hidden="true" />

      {/* ── Right: metadata sidebar ──────────────────────────────────────── */}
      <aside className="fp-agentd-aside">

        {/* Properties */}
        <AsideSection title="Properties">
          <dl className="fp-agentd-props">
            <dt>Author</dt>
            <dd>{skill.official ? 'Equifax Platform' : skill.author}</dd>
            <dt>Category</dt>
            <dd>{skill.category}</dd>
            <dt>Version</dt>
            <dd className="mono">{skill.version}</dd>
            <dt>Provenance</dt>
            <dd>
              <Pill tone={skill.official ? 'ember' : 'neutral'} dot={skill.official}>
                {skill.official ? 'Official' : 'Community'}
              </Pill>
            </dd>
            <dt>Rating</dt>
            <dd style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icons.star size={12} style={{ color: 'var(--accent)' }} />
              <span className="mono">{skill.rating.toFixed(1)}</span>
            </dd>
            <dt>Installs</dt>
            <dd className="mono">{skill.installs} agents</dd>
          </dl>
        </AsideSection>

        {/* Capabilities */}
        <AsideSection title="Tools / capabilities" count={capabilities.length}>
          {capabilities.length === 0 ? (
            <EmptyState icon="zap" label="No capabilities declared." />
          ) : (
            <div className="fp-agentd-caps">
              {capabilities.map((c: SkillCapability) => (
                <span key={c.id} className="cap">
                  {ICON(c.icon, 13)} {c.label}
                </span>
              ))}
            </div>
          )}
        </AsideSection>

        {/* Used by agents */}
        <AsideSection title="Used by agents" count={usedByAgents.length}>
          {usedByAgents.length === 0 ? (
            <EmptyState icon="sparkle" label="No agents use this skill yet." />
          ) : (
            <div className="fp-agentd-list">
              {usedByAgents.map((a) => (
                <Link
                  key={a.id}
                  href={`/portal/agents/${a.id}`}
                  className="item"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <span className="ic">{ICON('sparkle', 14)}</span>
                  <span className="tx">
                    <span className="nm">{a.name}</span>
                    <span className="ds">{a.role}</span>
                  </span>
                  <Icons.chevronRight size={13} style={{ color: 'var(--fg-faint)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}
        </AsideSection>

        {/* Versions */}
        <AsideSection title="Versions" count={versions.length}>
          <div className="fp-agentd-versions">
            {versions.map((v: SkillVersion) => (
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
    </div>
  );
}
