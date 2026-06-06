// Forge — pre-built agents. Shared by the Chat sidebar (first three, as a
// quick "new chat with this agent" affordance), the external Agents catalog
// page (/portal/agents) and the agent detail/settings page (/portal/agents/[id]).
//
// `official` distinguishes company-built agents (Equifax platform, verified)
// from ones a collaborator authored (`author` is then the maker). `starred` is
// the seed favourite set — the page persists user changes over it. `output` is
// the agent's response kind — not every agent is conversational.
export type AgentOutput = 'conversation' | 'json' | 'code' | 'document' | 'image' | 'file';
export type AgentStatus = 'active' | 'beta' | 'draft';

export type Agent = {
  id: string;
  name: string;
  role: string;
  desc: string;
  model: string;
  tools: number;
  chats: number;
  updated: string;
  /** Company-built + verified. Otherwise it's a collaborator agent. */
  official: boolean;
  /** Maker, for collaborator agents (shown as "by …"). */
  author?: string;
  /** Seed "starred for quick access" state. */
  starred?: boolean;
  /** Response kind — what the agent returns. Most are conversational; some
   *  only ever return a json/code/document/image artifact. */
  output: AgentOutput;
  status: AgentStatus;
  version: string;
  /** Short capability tags. */
  tags: string[];
  /** Creation month (display). */
  created: string;
};

export const AGENTS: Agent[] = [
  // ── Official — Equifax platform ────────────────────────────────────────────
  { id: 'sre',     name: 'SRE Copilot',       role: 'Incident response · runbooks', desc: 'Triages alerts, correlates p99 spikes with deploys, drafts postmortems and proposes safe rollbacks across the estate.', model: 'Opus 4.7',   tools: 6, chats: 128, updated: '2h ago',    official: true, starred: true, output: 'conversation', status: 'active', version: 'v3.4.0', tags: ['incidents', 'observability', 'runbooks'], created: 'Mar 2025' },
  { id: 'fraud',   name: 'Fraud Analyst',     role: 'konduto rules · chargebacks',  desc: 'Investigates false-positive spikes, tunes the antifraud rule set and explains the approval impact before you ship.',     model: 'Sonnet 4.6', tools: 5, chats: 86,  updated: '5h ago',    official: true, starred: true, output: 'conversation', status: 'active', version: 'v2.8.1', tags: ['fraud', 'konduto', 'rules'], created: 'Apr 2025' },
  { id: 'bureau',  name: 'Bureau Assistant',  role: 'SCR · Cadastro Positivo',      desc: 'Answers bureau reconciliation questions against the SCR layout and the Boa Vista feed contracts.',                     model: 'Sonnet 4.6', tools: 4, chats: 53,  updated: 'Yesterday', official: true, output: 'conversation', status: 'active', version: 'v2.1.0', tags: ['bureau', 'SCR', 'reconciliation'], created: 'Feb 2025' },
  { id: 'score',   name: 'Score Reviewer',    role: 'Models · feature store',       desc: 'Reviews score-engine shadow results, reason-code drift and Ignite feature freshness for the thin-file cohort.',        model: 'Opus 4.7',   tools: 5, chats: 41,  updated: '2d ago',    official: true, starred: true, output: 'conversation', status: 'active', version: 'v1.9.2', tags: ['scoring', 'models', 'drift'], created: 'May 2025' },
  { id: 'lgpd',    name: 'LGPD Auditor',      role: 'Consent · PII',                desc: 'Flags services logging PII without a registered consent scope and drafts the remediation each one needs.',              model: 'Haiku 4.5',  tools: 3, chats: 22,  updated: '3d ago',    official: true, output: 'conversation', status: 'active', version: 'v1.5.0', tags: ['LGPD', 'PII', 'consent'], created: 'Jan 2025' },
  { id: 'onboard', name: 'Onboarding Buddy',  role: 'Paved road · setup',           desc: 'Walks new engineers through day-1 setup, pager rotation, escalation paths and the golden-path templates.',              model: 'Haiku 4.5',  tools: 4, chats: 17,  updated: '1w ago',    official: true, output: 'conversation', status: 'active', version: 'v1.2.0', tags: ['onboarding', 'paved-road'], created: 'Mar 2025' },
  { id: 'scr',     name: 'SCR Reconciler',    role: 'SCPC · negative base',         desc: 'Cross-checks SCPC negative-base entries against the daily SCR feed and explains every divergence it finds.',           model: 'Sonnet 4.6', tools: 5, chats: 64,  updated: '6h ago',    official: true, output: 'json', status: 'active', version: 'v2.0.3', tags: ['SCPC', 'reconciliation', 'feeds'], created: 'Feb 2025' },
  { id: 'cadpos',  name: 'Cadastro Positivo', role: 'Positive data · consent',      desc: 'Answers Cadastro Positivo coverage and opt-out questions and traces a CPF through the consent ledger.',                 model: 'Haiku 4.5',  tools: 3, chats: 38,  updated: '1d ago',    official: true, output: 'conversation', status: 'active', version: 'v1.4.1', tags: ['cadastro-positivo', 'consent'], created: 'Apr 2025' },
  { id: 'dora',    name: 'DORA Analyst',      role: 'Delivery metrics',             desc: 'Explains lead time, deploy frequency, change-fail rate and MTTR per tribe, and where the bottleneck is this week.',    model: 'Opus 4.7',   tools: 4, chats: 29,  updated: '4d ago',    official: true, output: 'conversation', status: 'active', version: 'v1.7.0', tags: ['DORA', 'delivery', 'metrics'], created: 'May 2025' },
  { id: 'kyc',     name: 'KYC Navigator',     role: 'Identity · onboarding',        desc: 'Walks an identity-proofing flow end to end and points at the step where a document or biometric check is failing.',   model: 'Sonnet 4.6', tools: 5, chats: 31,  updated: '2d ago',    official: true, output: 'conversation', status: 'active', version: 'v1.3.0', tags: ['KYC', 'identity', 'onboarding'], created: 'Mar 2025' },

  // ── Collaborator-built ─────────────────────────────────────────────────────
  { id: 'chargeback', name: 'Chargeback Helper', role: 'Disputes · evidence',     desc: 'Drafts chargeback evidence packets from the transaction trail and flags the disputes most likely to be won.',          model: 'Sonnet 4.6', tools: 4, chats: 47, updated: '3h ago',    official: false, author: 'Larissa Souza',  starred: true, output: 'document', status: 'active', version: 'v1.6.0', tags: ['chargebacks', 'disputes'], created: 'Apr 2025' },
  { id: 'p99hunter',  name: 'p99 Hunter',       role: 'Latency · traces',        desc: 'Hunts tail-latency regressions across the request path and ranks the spans adding the most p99 right now.',           model: 'Opus 4.7',   tools: 6, chats: 73, updated: '1h ago',    official: false, author: 'Diego Ferreira', starred: true, output: 'conversation', status: 'beta', version: 'v0.9.4', tags: ['latency', 'traces', 'p99'], created: 'Jun 2025' },
  { id: 'kondtuner',  name: 'konduto Tuner',    role: 'Rules · thresholds',      desc: 'Simulates konduto rule-threshold changes against last week’s traffic and reports the approve/decline delta.',      model: 'Sonnet 4.6', tools: 4, chats: 19, updated: '8h ago',    official: false, author: 'Rafael Lima', output: 'code', status: 'beta', version: 'v0.7.1', tags: ['konduto', 'rules', 'simulation'], created: 'Jun 2025' },
  { id: 'consentmap', name: 'Consent Mapper',   role: 'LGPD · data flows',       desc: 'Maps which services touch a given PII field and whether a consent scope covers each hop.',                            model: 'Haiku 4.5',  tools: 3, chats: 12, updated: '5d ago',    official: false, author: 'Ana Ribeiro', output: 'json', status: 'beta', version: 'v0.6.0', tags: ['LGPD', 'data-flows', 'PII'], created: 'May 2025' },
  { id: 'relnotes',   name: 'Release Notes',    role: 'Changelogs · GMUD',       desc: 'Turns a diff and its GMUD into clean release notes for the tribe, with the risky changes called out first.',          model: 'Haiku 4.5',  tools: 2, chats: 26, updated: '2d ago',    official: false, author: 'Bruno Mendes', output: 'document', status: 'active', version: 'v1.1.0', tags: ['changelog', 'GMUD', 'docs'], created: 'Apr 2025' },
  { id: 'costwatch',  name: 'Cost Watch',       role: 'FinOps · spend',          desc: 'Explains which services moved the cloud bill this month and proposes the safest places to trim.',                     model: 'Sonnet 4.6', tools: 4, chats: 33, updated: '6d ago',    official: false, author: 'Marcus Johnson', output: 'document', status: 'active', version: 'v1.0.2', tags: ['FinOps', 'cost', 'cloud'], created: 'Mar 2025' },
  { id: 'flaky',      name: 'Flaky Finder',     role: 'CI · test health',        desc: 'Surfaces the flakiest tests in the pipeline, quarantines the worst offenders and traces them to a likely cause.',     model: 'Haiku 4.5',  tools: 3, chats: 15, updated: '1w ago',    official: false, author: 'Camila Nunes', output: 'json', status: 'draft', version: 'v0.4.0', tags: ['CI', 'tests', 'flaky'], created: 'Jun 2025' },
  { id: 'apicontract',name: 'API Contract',     role: 'OpenAPI · breaking changes', desc: 'Diffs an API change against its consumers and flags anything that would break a downstream integration.',            model: 'Sonnet 4.6', tools: 4, chats: 21, updated: '4d ago',    official: false, author: 'Pedro Alves', output: 'json', status: 'active', version: 'v1.2.1', tags: ['OpenAPI', 'contracts', 'breaking-changes'], created: 'May 2025' },
];

// Archived agents — hidden from the catalog, restorable. Same shape as a live
// agent plus when it was archived (mirrors the Chat archive's restorable list).
export type ArchivedAgent = Agent & { archivedWhen: string };

export const ARCHIVED_AGENTS: ArchivedAgent[] = [
  { id: 'legacy-score', name: 'Legacy Score Bot',  role: 'Models · v1 engine',     desc: 'Answered questions against the retired v1 score engine. Superseded by Score Reviewer.',        model: 'Haiku 4.5',  tools: 3, chats: 58, updated: 'Archived', official: true,  output: 'conversation', status: 'draft', version: 'v0.9.0', tags: ['scoring', 'legacy'], created: 'Nov 2024', archivedWhen: 'Archived 2w ago' },
  { id: 'pix-throttle', name: 'Pix Throttle Aide', role: 'Incidents · Pix rail',   desc: 'One-off helper built during the 06/04 Pix spike to tune offline-path throttling. No longer needed.', model: 'Sonnet 4.6', tools: 4, chats: 12, updated: 'Archived', official: false, author: 'Diego Ferreira', output: 'conversation', status: 'draft', version: 'v0.3.0', tags: ['incidents', 'pix'], created: 'Apr 2025', archivedWhen: 'Archived 3w ago' },
  { id: 'old-relnotes', name: 'Changelog Drafter', role: 'Changelogs · GMUD (old)', desc: 'Earlier release-notes prototype. Replaced by Release Notes once GMUD parsing landed.',             model: 'Haiku 4.5',  tools: 2, chats: 31, updated: 'Archived', official: false, author: 'Bruno Mendes', output: 'document', status: 'draft', version: 'v0.6.2', tags: ['changelog', 'docs'], created: 'Feb 2025', archivedWhen: 'Archived 1mo ago' },
];

export const getAgent = (id: string): Agent | undefined =>
  AGENTS.find((a) => a.id === id) ?? ARCHIVED_AGENTS.find((a) => a.id === id);
