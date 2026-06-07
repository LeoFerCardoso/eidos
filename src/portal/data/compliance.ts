// Forge (IDP Portal) — LGPD & Audit data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/compliance — the LGPD posture and the PII audit trail. Consent
// coverage, data-subject requests (acesso / eliminação / portabilidade /
// correção), who touched PII and why, and data residency. CPFs are masked.
// Mock but consistent; LGPD is Brazil's data-protection law.

export interface ComplianceKpi { id: string; label: string; value: string; note: string; tone?: 'good' | 'warn' | 'bad' }

export const KPIS: ComplianceKpi[] = [
  { id: 'consent', label: 'Consent coverage', value: '98.7%', note: 'Records tied to a valid consent scope.', tone: 'good' },
  { id: 'dsr', label: 'Open subject requests', value: '6', note: '1 past its LGPD deadline.', tone: 'warn' },
  { id: 'redaction', label: 'PII redaction rate', value: '100%', note: 'CPF and CNPJ masked before logs.', tone: 'good' },
  { id: 'audit', label: 'Audit events · 24h', value: '38.2k', note: '2 flagged for review.', tone: 'warn' },
];

// ── Data-subject requests (LGPD direitos do titular) ──────────────────────────

export type DsrType = 'Access' | 'Deletion' | 'Portability' | 'Rectification';
export type DsrStatus = 'open' | 'in-progress' | 'done' | 'overdue';

export interface Dsr {
  id: string;
  type: DsrType;
  subject: string;
  opened: string;
  due: string;
  owner: string;
  status: DsrStatus;
}

export const DSRS: Dsr[] = [
  { id: 'DSR-4821', type: 'Deletion',      subject: '***.456.789-**', opened: '2 days ago',  due: 'in 13 days', owner: 'Mariana Castelli',   status: 'in-progress' },
  { id: 'DSR-4820', type: 'Access',        subject: '***.112.004-**', opened: '4 days ago',  due: 'in 11 days', owner: 'Diego Vasquez',      status: 'in-progress' },
  { id: 'DSR-4818', type: 'Portability',   subject: '***.778.321-**', opened: '1 day ago',   due: 'in 14 days', owner: 'Camila Tanaka',      status: 'open' },
  { id: 'DSR-4815', type: 'Rectification', subject: '***.903.550-**', opened: '16 days ago', due: '1 day ago',  owner: 'Larissa Fontana',    status: 'overdue' },
  { id: 'DSR-4812', type: 'Deletion',      subject: '***.221.087-**', opened: '5 days ago',  due: 'in 10 days', owner: 'Mariana Castelli',   status: 'open' },
  { id: 'DSR-4809', type: 'Access',        subject: '***.640.219-**', opened: '9 days ago',  due: 'in 6 days',  owner: 'Diego Vasquez',      status: 'in-progress' },
  { id: 'DSR-4801', type: 'Access',        subject: '***.158.772-**', opened: '20 days ago', due: 'closed',     owner: 'Camila Tanaka',      status: 'done' },
];

export const DSR_STATUS_META: Record<DsrStatus, { label: string; tone: 'health-up' | 'status-running' | 'warning' | 'danger' }> = {
  open: { label: 'Open', tone: 'warning' },
  'in-progress': { label: 'In progress', tone: 'status-running' },
  done: { label: 'Fulfilled', tone: 'health-up' },
  overdue: { label: 'Overdue', tone: 'danger' },
};

// ── Consent scopes (segmented coverage) ───────────────────────────────────────

export interface ConsentScope { label: string; pct: number; color: string }
export const CONSENT_SCOPES: ConsentScope[] = [
  { label: 'Credit consultation', pct: 71, color: 'var(--success)' },
  { label: 'Cadastro Positivo', pct: 19, color: 'var(--accent-2)' },
  { label: 'Marketing (opt-in)', pct: 8, color: 'var(--warning)' },
  { label: 'No valid scope', pct: 2, color: 'var(--danger)' },
];

// ── Data residency ────────────────────────────────────────────────────────────

export interface Residency { region: string; share: string; note: string }
export const RESIDENCY: Residency[] = [
  { region: 'br-se-1 · São Paulo', share: '82%', note: 'Primary · in-country' },
  { region: 'br-ne-1 · Fortaleza', share: '18%', note: 'Secondary · in-country' },
];

// ── Audit trail (who touched PII, and why) ────────────────────────────────────

export type AuditStatus = 'ok' | 'flagged';

export interface AuditEvent {
  id: string;
  actor: string;
  actorKind: 'human' | 'agent' | 'service';
  action: string;
  resource: string;
  subject: string;
  purpose: string;
  when: string;
  status: AuditStatus;
}

export const AUDIT: AuditEvent[] = [
  { id: 'a1', actor: 'acerta-api',       actorKind: 'service', action: 'read',   resource: 'CPF · score',     subject: '***.456.789-**', purpose: 'Credit consultation',  when: '2m ago',  status: 'ok' },
  { id: 'a2', actor: 'SRE Triage Agent', actorKind: 'agent',   action: 'export', resource: 'CPF · address',   subject: '***.221.087-**', purpose: 'Incident investigation', when: '8m ago', status: 'flagged' },
  { id: 'a3', actor: 'Diego Vasquez',    actorKind: 'human',   action: 'read',   resource: 'CNPJ · score',    subject: '12.***.***/0001-**', purpose: 'Dispute review',  when: '14m ago', status: 'ok' },
  { id: 'a4', actor: 'score-engine',     actorKind: 'service', action: 'read',   resource: 'CPF · features',  subject: '***.112.004-**', purpose: 'Score computation', when: '21m ago', status: 'ok' },
  { id: 'a5', actor: 'bureau-ingestion', actorKind: 'service', action: 'write',  resource: 'CPF · negative',  subject: '***.903.550-**', purpose: 'Bureau feed sync',  when: '33m ago', status: 'ok' },
  { id: 'a6', actor: 'Beatriz Okamoto',  actorKind: 'human',   action: 'export', resource: 'CPF · device',    subject: '***.640.219-**', purpose: 'Fraud case file',   when: '47m ago', status: 'flagged' },
  { id: 'a7', actor: 'consent-service',  actorKind: 'service', action: 'redact', resource: 'CPF · address',   subject: '***.158.772-**', purpose: 'Log redaction',     when: '52m ago', status: 'ok' },
  { id: 'a8', actor: 'audit-trail',      actorKind: 'service', action: 'read',   resource: 'CPF · consent',   subject: '***.778.321-**', purpose: 'Portability export', when: '1h ago',  status: 'ok' },
];

export const ACTOR_ICON: Record<AuditEvent['actorKind'], string> = {
  human: 'user',
  agent: 'agent',
  service: 'server',
};

// Forge AI read — the access worth a second look.
export const AI_READ = {
  title: 'An access worth reviewing',
  body: 'The SRE Triage Agent exported CPF and address for subject ***.221.087-** during incident INC-1243 at 03:19. The purpose was valid, but the export left the incident scope and the subject has an open deletion request (DSR-4812). Holding that export until the request is resolved keeps the audit clean. Forge can revoke the artifact and notify the commander.',
};
