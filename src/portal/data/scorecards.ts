// Forge (IDP Portal) — Scorecards data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/scorecards — continuous production-readiness / security /
// documentation scorecards across the estate, PAIRED with Initiatives (the
// time-bound campaigns that close the gaps). No tier; services belong to a
// product. Scores are deterministic (hash-seeded) so the page is stable across
// renders; mock but internally consistent.

import type { Lang } from './services';

export type ScorecardId = 'readiness' | 'security' | 'docs';

export interface Scorecard {
  id: ScorecardId;
  name: string;
  desc: string;
  pillars: string[];
}

export const SCORECARDS: Scorecard[] = [
  {
    id: 'readiness',
    name: 'Production readiness',
    desc: 'Can this service take production traffic safely?',
    pillars: ['Reliability', 'Performance', 'Security', 'Maintainability', 'Observability'],
  },
  {
    id: 'security',
    name: 'Security baseline',
    desc: 'Does it meet the bureau security and LGPD bar?',
    pillars: ['SAST', 'Secrets', 'Dependencies', 'Access', 'LGPD'],
  },
  {
    id: 'docs',
    name: 'Documentation',
    desc: 'Can a new engineer or an agent understand and run it?',
    pillars: ['README', 'API spec', 'Runbook', 'ADRs', 'Onboarding'],
  },
];

interface SvcSeed {
  id: string;
  name: string;
  lang: Lang;
  product: string;
  owner: string;
  /** baseline quality 0-100 — anchors the deterministic per-pillar spread. */
  base: number;
}

const SERVICES: SvcSeed[] = [
  { id: 'score-engine',      name: 'score-engine',      lang: 'Java',       product: 'Score & Risk',  owner: 'Thiago Albuquerque', base: 92 },
  { id: 'acerta-api',        name: 'acerta-api',        lang: 'Go',         product: 'Score & Risk',  owner: 'Rafael Mendonça',    base: 86 },
  { id: 'konduto-antifraud', name: 'konduto-antifraud', lang: 'Python',     product: 'Anti-Fraud',    owner: 'Beatriz Okamoto',    base: 83 },
  { id: 'device-fingerprint',name: 'device-fingerprint',lang: 'Go',         product: 'Anti-Fraud',    owner: 'Beatriz Okamoto',    base: 79 },
  { id: 'identity-proofing', name: 'identity-proofing', lang: 'TypeScript', product: 'Identity',      owner: 'Camila Tanaka',      base: 81 },
  { id: 'document-ocr',      name: 'document-ocr',      lang: 'Python',     product: 'Identity',      owner: 'Camila Tanaka',      base: 68 },
  { id: 'scpc-gateway',      name: 'scpc-gateway',      lang: 'Java',       product: 'Data & Bureau', owner: 'Diego Vasquez',      base: 74 },
  { id: 'bureau-ingestion',  name: 'bureau-ingestion',  lang: 'Go',         product: 'Data & Bureau', owner: 'Diego Vasquez',      base: 58 },
  { id: 'decision-engine',   name: 'decision-engine',   lang: 'Rust',       product: 'Decisioning',   owner: 'Thiago Albuquerque', base: 88 },
  { id: 'consent-service',   name: 'consent-service',   lang: 'Go',         product: 'Platform',      owner: 'Larissa Fontana',    base: 90 },
  { id: 'audit-trail',       name: 'audit-trail',       lang: 'Go',         product: 'Platform',      owner: 'Larissa Fontana',    base: 84 },
  { id: 'recovery-comms',    name: 'recovery-comms',    lang: 'TypeScript', product: 'Recovery',      owner: 'Mariana Castelli',   base: 49 },
];

const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const clamp = (n: number) => Math.max(28, Math.min(99, Math.round(n)));

export interface ScoreRow {
  id: string;
  name: string;
  lang: Lang;
  product: string;
  owner: string;
  pillarScores: Record<string, number>;
  overall: number;
  /** 12-point trend series. */
  series: number[];
  /** delta over the window. */
  trend: number;
}

export interface ScorecardView {
  scorecard: Scorecard;
  rows: ScoreRow[];
  summary: { average: number; passing: number; atRisk: number; failing: number };
}

export function buildScorecard(id: ScorecardId): ScorecardView {
  const scorecard = SCORECARDS.find((s) => s.id === id) ?? SCORECARDS[0];
  const rows: ScoreRow[] = SERVICES.map((svc) => {
    const pillarScores: Record<string, number> = {};
    for (const p of scorecard.pillars) {
      const drift = (hash(svc.id + id + p) % 22) - 11;
      pillarScores[p] = clamp(svc.base + drift);
    }
    const overall = Math.round(
      scorecard.pillars.reduce((m, p) => m + pillarScores[p], 0) / scorecard.pillars.length,
    );
    const series = Array.from({ length: 12 }).map((_, i) =>
      clamp(overall - 7 + (hash(svc.id + id + i) % 14)),
    );
    const trend = series[series.length - 1] - series[0];
    return { id: svc.id, name: svc.name, lang: svc.lang, product: svc.product, owner: svc.owner, pillarScores, overall, series, trend };
  });

  const average = Math.round(rows.reduce((m, r) => m + r.overall, 0) / rows.length);
  const pct = (n: number) => Math.round((n / rows.length) * 100);
  const summary = {
    average,
    passing: pct(rows.filter((r) => r.overall >= 80).length),
    atRisk: pct(rows.filter((r) => r.overall >= 60 && r.overall < 80).length),
    failing: pct(rows.filter((r) => r.overall < 60).length),
  };

  return { scorecard, rows, summary };
}

export const pillarTone = (v: number): 'status-done' | 'status-running' | 'status-error' =>
  v >= 80 ? 'status-done' : v >= 60 ? 'status-running' : 'status-error';

export const bandTone = (v: number): 'success' | 'ember' | 'warning' | 'danger' =>
  v >= 90 ? 'success' : v >= 80 ? 'ember' : v >= 60 ? 'warning' : 'danger';

// ── Initiatives — time-bound campaigns that close scorecard gaps ──────────────

export type InitiativeStatus = 'on-track' | 'at-risk' | 'behind';

export interface Initiative {
  id: string;
  name: string;
  desc: string;
  scorecard: ScorecardId;
  /** completion 0-100. */
  progress: number;
  /** services in scope vs. already passing. */
  scope: number;
  done: number;
  due: string;
  owner: string;
  status: InitiativeStatus;
}

export const INITIATIVES: Initiative[] = [
  { id: 'sast-zero',   name: 'Zero SAST highs',          desc: 'Clear every high-severity SAST finding across bureau-critical services.', scorecard: 'security',  progress: 72, scope: 18, done: 13, due: 'Jul 1',  owner: 'Larissa Fontana',   status: 'on-track' },
  { id: 'openapi-all', name: 'OpenAPI for public APIs',  desc: 'Every externally consumed API ships a validated OpenAPI 3.1 contract.',   scorecard: 'docs',      progress: 54, scope: 24, done: 13, due: 'Aug 15', owner: 'Diego Vasquez',     status: 'on-track' },
  { id: 'slo-coverage',name: 'SLOs on tier-0 paths',     desc: 'Define SLOs and burn-rate alerts for every revenue-path service.',         scorecard: 'readiness', progress: 38, scope: 12, done: 5,  due: 'Jul 20', owner: 'Thiago Albuquerque',status: 'at-risk' },
  { id: 'lgpd-redact', name: 'LGPD redaction at source', desc: 'Redact CPF and CNPJ before they reach logs across the estate.',            scorecard: 'security',  progress: 21, scope: 30, done: 6,  due: 'Sep 1',  owner: 'Beatriz Okamoto',   status: 'behind' },
];

export const INITIATIVE_TONE: Record<InitiativeStatus, { label: string; tone: 'health-up' | 'warning' | 'danger' }> = {
  'on-track': { label: 'On track', tone: 'health-up' },
  'at-risk': { label: 'At risk', tone: 'warning' },
  behind: { label: 'Behind', tone: 'danger' },
};

// Forge AI read — the gap worth closing first.
export const AI_READ = {
  title: 'The gap to close first',
  body: 'recovery-comms scores 49 on production readiness, the only failing service, and it owns the debt-restructure customer path. Its weakest pillar is Observability (no SLOs, no tracing). Folding it into the "SLOs on tier-0 paths" initiative would lift it above the at-risk line within the window.',
};
