// Forge — pre-built agents. Shared by the Chat sidebar (first three, as a
// quick "new chat with this agent" affordance) and the external Agents catalog
// page (/portal/agents).
export type Agent = {
  id: string;
  name: string;
  role: string;
  desc: string;
  model: string;
  tools: number;
  chats: number;
  updated: string;
};

export const AGENTS: Agent[] = [
  { id: 'sre',     name: 'SRE Copilot',      role: 'Incident response · runbooks', desc: 'Triages alerts, correlates p99 spikes with deploys, drafts postmortems and proposes safe rollbacks across the estate.', model: 'Opus 4.7',   tools: 6, chats: 128, updated: '2h ago' },
  { id: 'fraud',   name: 'Fraud Analyst',    role: 'konduto rules · chargebacks',  desc: 'Investigates false-positive spikes, tunes the antifraud rule set and explains the approval impact before you ship.',     model: 'Sonnet 4.6', tools: 5, chats: 86,  updated: '5h ago' },
  { id: 'bureau',  name: 'Bureau Assistant', role: 'SCR · Cadastro Positivo',      desc: 'Answers bureau reconciliation questions against the SCR layout and the Boa Vista feed contracts.',                     model: 'Sonnet 4.6', tools: 4, chats: 53,  updated: 'Yesterday' },
  { id: 'score',   name: 'Score Reviewer',   role: 'Models · feature store',       desc: 'Reviews score-engine shadow results, reason-code drift and Ignite feature freshness for the thin-file cohort.',        model: 'Opus 4.7',   tools: 5, chats: 41,  updated: '2d ago' },
  { id: 'lgpd',    name: 'LGPD Auditor',     role: 'Consent · PII',                desc: 'Flags services logging PII without a registered consent scope and drafts the remediation each one needs.',              model: 'Haiku 4.5',  tools: 3, chats: 22,  updated: '3d ago' },
  { id: 'onboard', name: 'Onboarding Buddy', role: 'Paved road · setup',           desc: 'Walks new engineers through day-1 setup, pager rotation, escalation paths and the golden-path templates.',              model: 'Haiku 4.5',  tools: 4, chats: 17,  updated: '1w ago' },
];
