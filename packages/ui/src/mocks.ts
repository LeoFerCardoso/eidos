// Eidos mock data — Brazilian fintech context
const SERVICES = [
  { id: 'identity-svc', name: 'identity-svc', tier: 'T1', lang: 'TypeScript', owner: 'Identity', tribe: 'Identity', deploys: '2m ago', alert: false, coverage: 87.4, p95: 142, sast: 0, version: '4.18.2', deps: ['bureau-gateway','consent-vault','session-store'] },
  { id: 'pix-router', name: 'pix-router', tier: 'T1', lang: 'Go', owner: 'Pix', tribe: 'Pix', deploys: '14m ago', alert: true, coverage: 78.2, p95: 89, sast: 0, version: '2.7.0', deps: ['ledger-svc','bureau-gateway'] },
  { id: 'bureau-gateway', name: 'bureau-gateway', tier: 'T1', lang: 'Java', owner: 'Risk', tribe: 'Risk', deploys: '3h ago', alert: false, coverage: 91.0, p95: 218, sast: 0, version: '8.2.1', deps: ['score-engine'] },
  { id: 'fraud-engine', name: 'fraud-engine', tier: 'T1', lang: 'Python', owner: 'Fraud', tribe: 'Fraud', deploys: '47min ago', alert: false, coverage: 82.6, p95: 312, sast: 1, version: '3.4.7', deps: ['ml-feature-store','event-bus'] },
  { id: 'kyc-orchestrator', name: 'kyc-orchestrator', tier: 'T1', lang: 'TypeScript', owner: 'Onboarding', tribe: 'Onboarding', deploys: 'yesterday at 14:22', alert: false, coverage: 74.9, p95: 410, sast: 0, version: '1.9.3' },
  { id: 'consent-vault', name: 'consent-vault', tier: 'T1', lang: 'Rust', owner: 'Open Finance', tribe: 'Open Finance', deploys: '2d ago', alert: false, coverage: 94.1, p95: 38, sast: 0, version: '0.12.4' },
  { id: 'score-engine', name: 'score-engine', tier: 'T1', lang: 'Python', owner: 'Risk', tribe: 'Risk', deploys: '6h ago', alert: false, coverage: 88.0, p95: 156, sast: 0, version: '5.0.0' },
  { id: 'ledger-svc', name: 'ledger-svc', tier: 'T1', lang: 'Go', owner: 'Pix', tribe: 'Pix', deploys: '1h ago', alert: false, coverage: 92.3, p95: 24, sast: 0, version: '2.3.9' },
  { id: 'event-bus', name: 'event-bus', tier: 'T1', lang: 'Go', owner: 'Telemetry', tribe: 'Telemetry', deploys: '5d ago', alert: false, coverage: 89.5, p95: 11, sast: 0, version: '1.8.0' },
  { id: 'session-store', name: 'session-store', tier: 'T2', lang: 'Go', owner: 'Identity', tribe: 'Identity', deploys: '4d ago', alert: false, coverage: 81.0, p95: 9, sast: 0, version: '3.1.2' },
  { id: 'ml-feature-store', name: 'ml-feature-store', tier: 'T2', lang: 'Python', owner: 'DataLab', tribe: 'DataLab', deploys: '8h ago', alert: false, coverage: 70.4, p95: 78, sast: 0, version: '0.9.1' },
  { id: 'webhook-gateway', name: 'webhook-gateway', tier: 'T2', lang: 'TypeScript', owner: 'Open Finance', tribe: 'Open Finance', deploys: '12h ago', alert: false, coverage: 76.5, p95: 64, sast: 0, version: '2.1.0' },
  { id: 'notification-svc', name: 'notification-svc', tier: 'T2', lang: 'TypeScript', owner: 'Onboarding', tribe: 'Onboarding', deploys: '1d ago', alert: false, coverage: 72.1, p95: 145, sast: 0, version: '4.0.5' },
  { id: 'audit-log', name: 'audit-log', tier: 'T1', lang: 'Rust', owner: 'Risk', tribe: 'Risk', deploys: '3d ago', alert: false, coverage: 96.8, p95: 6, sast: 0, version: '1.4.0' },
  { id: 'doc-vault', name: 'doc-vault', tier: 'T2', lang: 'Go', owner: 'Onboarding', tribe: 'Onboarding', deploys: '4h ago', alert: false, coverage: 84.2, p95: 52, sast: 0, version: '2.6.1' },
  { id: 'biometrics-svc', name: 'biometrics-svc', tier: 'T1', lang: 'Python', owner: 'Identity', tribe: 'Identity', deploys: '7h ago', alert: false, coverage: 79.3, p95: 220, sast: 0, version: '1.2.8' },
  { id: 'open-finance-api', name: 'open-finance-api', tier: 'T1', lang: 'TypeScript', owner: 'Open Finance', tribe: 'Open Finance', deploys: '22m ago', alert: false, coverage: 86.7, p95: 95, sast: 0, version: '3.9.0' },
  { id: 'risk-rules', name: 'risk-rules', tier: 'T2', lang: 'Java', owner: 'Risk', tribe: 'Risk', deploys: '2d ago', alert: false, coverage: 80.2, p95: 41, sast: 0, version: '6.1.3' },
  { id: 'merchant-api', name: 'merchant-api', tier: 'T2', lang: 'Go', owner: 'BizDev', tribe: 'BizDev', deploys: '11h ago', alert: false, coverage: 75.8, p95: 88, sast: 0, version: '1.7.2' },
  { id: 'webhook-replay', name: 'webhook-replay', tier: 'T3', lang: 'Python', owner: 'Open Finance', tribe: 'Open Finance', deploys: '1w ago', alert: false, coverage: 68.0, p95: 132, sast: 0, version: '0.4.1' },
  { id: 'cost-allocator', name: 'cost-allocator', tier: 'T3', lang: 'TypeScript', owner: 'Telemetry', tribe: 'Telemetry', deploys: '3w ago', alert: false, coverage: 65.4, p95: 290, sast: 0, version: '0.7.0' },
  { id: 'ml-model-registry', name: 'ml-model-registry', tier: 'T2', lang: 'Python', owner: 'DataLab', tribe: 'DataLab', deploys: '5d ago', alert: false, coverage: 73.9, p95: 110, sast: 0, version: '1.0.6' },
  { id: 'data-export', name: 'data-export', tier: 'T3', lang: 'Go', owner: 'DataLab', tribe: 'DataLab', deploys: '2w ago', alert: false, coverage: 70.0, p95: 480, sast: 0, version: '0.3.2' },
  { id: 'reconciliation-svc', name: 'reconciliation-svc', tier: 'T1', lang: 'Java', owner: 'Pix', tribe: 'Pix', deploys: '9h ago', alert: false, coverage: 88.9, p95: 320, sast: 0, version: '4.2.0' },
];

const PEOPLE = [
  { name: 'Leonardo Cardoso', initials: 'LC', role: 'Director of Engineering' },
  { name: 'Camila Tanaka', initials: 'CT', role: 'Staff Engineer · Identity' },
  { name: 'Rafael Mendonça', initials: 'RM', role: 'Tech Lead · Pix' },
  { name: 'Beatriz Okamoto', initials: 'BO', role: 'Senior Engineer · Fraud' },
  { name: 'Thiago Albuquerque', initials: 'TA', role: 'Principal Engineer · Risk' },
  { name: 'Mariana Castelli', initials: 'MC', role: 'Engineering Manager · Onboarding' },
  { name: 'Diego Vasquez', initials: 'DV', role: 'Staff Engineer · Open Finance' },
  { name: 'Larissa Fontana', initials: 'LF', role: 'Senior SRE · Telemetry' },
];

const PRS = [
  { id: 7421, title: 'feat(pix-router): add idempotency keys for retries', author: 'Rafael Mendonça', service: 'pix-router', risk: 34, verdict: 'low', complexity: 8, cognitive: 11, mi: 64, coverageDelta: '+1.2%', sast: 0, blast: 'Ring 0→2', when: '12m ago', files: 8, additions: 142, deletions: 38 },
  { id: 7420, title: 'fix(fraud-engine): handle null user_agent in scoring', author: 'Beatriz Okamoto', service: 'fraud-engine', risk: 18, verdict: 'low', complexity: 4, cognitive: 6, mi: 78, coverageDelta: '+0.4%', sast: 0, blast: 'Ring 0', when: '34min ago', files: 2, additions: 18, deletions: 4 },
  { id: 7419, title: 'refactor(bureau-gateway): extract decision tree into strategy', author: 'Thiago Albuquerque', service: 'bureau-gateway', risk: 71, verdict: 'high', complexity: 14, cognitive: 19, mi: 41, coverageDelta: '-2.8%', sast: 1, blast: 'Ring 0→4', when: '1h ago', files: 23, additions: 412, deletions: 290, blocked: true },
  { id: 7418, title: 'feat(identity-svc): biometric step-up for high-risk auth', author: 'Camila Tanaka', service: 'identity-svc', risk: 52, verdict: 'med', complexity: 11, cognitive: 14, mi: 58, coverageDelta: '+0.9%', sast: 0, blast: 'Ring 0→2', when: '2h ago', files: 14, additions: 286, deletions: 51 },
  { id: 7417, title: 'chore(consent-vault): bump tonic to 0.11', author: 'Diego Vasquez', service: 'consent-vault', risk: 12, verdict: 'low', complexity: 2, cognitive: 3, mi: 92, coverageDelta: '0.0%', sast: 0, blast: 'Ring 0', when: '3h ago', files: 3, additions: 14, deletions: 11 },
  { id: 7416, title: 'feat(kyc-orchestrator): parallelize document validation', author: 'Mariana Castelli', service: 'kyc-orchestrator', risk: 44, verdict: 'med', complexity: 9, cognitive: 12, mi: 61, coverageDelta: '+2.1%', sast: 0, blast: 'Ring 0→2', when: '4h ago', files: 11, additions: 198, deletions: 87 },
  { id: 7415, title: 'perf(ledger-svc): batch BTREE inserts for settlement runs', author: 'Rafael Mendonça', service: 'ledger-svc', risk: 28, verdict: 'low', complexity: 7, cognitive: 9, mi: 71, coverageDelta: '+0.3%', sast: 0, blast: 'Ring 0→1', when: '5h ago', files: 4, additions: 62, deletions: 18 },
  { id: 7414, title: 'feat(open-finance-api): consent revocation webhook', author: 'Diego Vasquez', service: 'open-finance-api', risk: 39, verdict: 'med', complexity: 8, cognitive: 11, mi: 66, coverageDelta: '+1.5%', sast: 0, blast: 'Ring 0→3', when: '6h ago', files: 9, additions: 174, deletions: 22 },
];

const DEPLOYS = [
  { id: 'D-9182', service: 'pix-router', version: '2.7.0', author: 'Rafael Mendonça', stage: 'Ring 2', progress: 62, started: '14m ago', status: 'in-flight', stages: { build: 'ok', test: 'ok', sast: 'ok', risk: 'ok', canary: 'running', full: 'pending' } },
  { id: 'D-9181', service: 'fraud-engine', version: '3.4.7', author: 'Beatriz Okamoto', stage: 'Ring 1', progress: 38, started: '47min ago', status: 'in-flight', stages: { build: 'ok', test: 'ok', sast: 'ok', risk: 'ok', canary: 'running', full: 'pending' } },
  { id: 'D-9180', service: 'identity-svc', version: '4.18.2', author: 'Camila Tanaka', stage: 'Ring 4', progress: 100, started: '2h ago', status: 'success', stages: { build: 'ok', test: 'ok', sast: 'ok', risk: 'ok', canary: 'ok', full: 'ok' } },
  { id: 'D-9179', service: 'bureau-gateway', version: '8.2.1', author: 'Thiago Albuquerque', stage: 'Ring 0', progress: 12, started: '3h ago', status: 'rolled-back', stages: { build: 'ok', test: 'ok', sast: 'ok', risk: 'ok', canary: 'fail', full: 'pending' } },
  { id: 'D-9178', service: 'ledger-svc', version: '2.3.9', author: 'Rafael Mendonça', stage: 'Ring 4', progress: 100, started: '1h ago', status: 'success', stages: { build: 'ok', test: 'ok', sast: 'ok', risk: 'ok', canary: 'ok', full: 'ok' } },
];

const ETI_PILLARS = [
  { name: 'Velocity', score: 88, trend: [76, 79, 82, 85, 88], delta: '+3' },
  { name: 'Quality', score: 81, trend: [72, 74, 77, 79, 81], delta: '+2' },
  { name: 'Reliability', score: 92, trend: [88, 89, 91, 91, 92], delta: '+1' },
  { name: 'AI Adoption', score: 76, trend: [42, 51, 63, 70, 76], delta: '+6' },
  { name: 'Standards', score: 84, trend: [78, 80, 81, 83, 84], delta: '+1' },
];

const TRIBES = [
  { name: 'Identity', eti: 89, delta: 4, services: 4, engineers: 38 },
  { name: 'Pix', eti: 87, delta: 3, services: 5, engineers: 52 },
  { name: 'Risk', eti: 86, delta: 2, services: 6, engineers: 47 },
  { name: 'Open Finance', eti: 84, delta: 5, services: 4, engineers: 33 },
  { name: 'Fraud', eti: 82, delta: 1, services: 3, engineers: 29 },
  { name: 'Onboarding', eti: 81, delta: 2, services: 5, engineers: 41 },
  { name: 'DataLab', eti: 78, delta: 7, services: 4, engineers: 26 },
  { name: 'Telemetry', eti: 84, delta: -1, services: 3, engineers: 18 },
];

const GMUDS = [
  { id: 'GMUD-2026-0418', service: 'pix-router', requester: 'Rafael Mendonça', window: 'Wed 02:00–04:00 BRT', risk: 'med', stage: 'Pending Approval', summary: 'Rollout idempotency keys to 100% production traffic.' },
  { id: 'GMUD-2026-0417', service: 'bureau-gateway', requester: 'Thiago Albuquerque', window: 'Tue 01:00–03:00 BRT', risk: 'high', stage: 'Pending Approval', summary: 'Schema migration: decision_history → partitioned table.' },
  { id: 'GMUD-2026-0416', service: 'consent-vault', requester: 'Diego Vasquez', window: 'Thu 03:00–04:30 BRT', risk: 'low', stage: 'Scheduled', summary: 'Library bump: tonic 0.11 + tokio 1.40.' },
  { id: 'GMUD-2026-0415', service: 'identity-svc', requester: 'Camila Tanaka', window: 'Now', risk: 'med', stage: 'Executing', summary: 'Enable biometric step-up flag for high-risk auth.' },
  { id: 'GMUD-2026-0414', service: 'fraud-engine', requester: 'Beatriz Okamoto', window: 'Mon 04:00 BRT', risk: 'low', stage: 'Closed', summary: 'Hot patch — null user_agent crash.' },
  { id: 'GMUD-2026-0413', service: 'ledger-svc', requester: 'Rafael Mendonça', window: 'Sat 02:00 BRT', risk: 'high', stage: 'Closed', summary: 'BTREE batching for settlement throughput.' },
  { id: 'GMUD-2026-0419', service: 'kyc-orchestrator', requester: 'Mariana Castelli', window: 'TBD', risk: 'med', stage: 'Draft', summary: 'Parallel document validation — pending design review.' },
  { id: 'GMUD-2026-0420', service: 'open-finance-api', requester: 'Diego Vasquez', window: 'TBD', risk: 'low', stage: 'Draft', summary: 'Add consent revocation webhook receiver.' },
];

const ADRS = [
  { id: 'ADR-001', title: 'TypeScript as default for new services', status: 'Accepted', date: '2024-03-12', author: 'Leonardo Mariga' },
  { id: 'ADR-002', title: 'Event-driven by default; sync only at edge', status: 'Accepted', date: '2024-05-04', author: 'Thiago Albuquerque' },
  { id: 'ADR-003', title: 'PostgreSQL for OLTP, ClickHouse for analytics', status: 'Accepted', date: '2024-06-22', author: 'Larissa Fontana' },
  { id: 'ADR-004', title: 'gRPC for internal RPC, REST at the edge', status: 'Superseded', date: '2024-08-19', author: 'Camila Tanaka' },
  { id: 'ADR-005', title: 'Quality gates enforced at PR-time, not deploy-time', status: 'Accepted', date: '2025-01-08', author: 'Leonardo Mariga' },
  { id: 'ADR-006', title: 'Async-first inter-tribe communication', status: 'Accepted', date: '2025-04-30', author: 'Diego Vasquez' },
  { id: 'ADR-007', title: 'Eidos as the single system of record for delivery', status: 'Proposed', date: '2026-04-21', author: 'Leonardo Mariga' },
];

const RUNBOOKS = [
  { id: 'rb-pix-rollback', title: 'Pix Router · Emergency rollback', owner: 'Rafael Mendonça', last: '14d ago', success: 100, executions: 7 },
  { id: 'rb-bureau-failover', title: 'Bureau Gateway · Provider failover', owner: 'Thiago Albuquerque', last: '3d ago', success: 87, executions: 22 },
  { id: 'rb-fraud-replay', title: 'Fraud Engine · Replay from event-bus', owner: 'Beatriz Okamoto', last: '1d ago', success: 95, executions: 41 },
  { id: 'rb-identity-key', title: 'Identity · Rotate signing key', owner: 'Camila Tanaka', last: '32d ago', success: 100, executions: 4 },
  { id: 'rb-pix-circuit', title: 'Pix · Open circuit breaker (incident)', owner: 'Rafael Mendonça', last: '48d ago', success: 100, executions: 2 },
  { id: 'rb-consent-purge', title: 'Open Finance · Purge expired consents', owner: 'Diego Vasquez', last: '7h ago', success: 99, executions: 138 },
  { id: 'rb-onboarding-redo', title: 'Onboarding · Re-run KYC for cohort', owner: 'Mariana Castelli', last: '5d ago', success: 92, executions: 18 },
];

const TEMPLATES = [
  { id: 'nestjs-microservice', name: 'nestjs-microservice', desc: 'NestJS · gRPC + REST · OTLP · pre-wired quality gates', lang: 'TypeScript', usage: 142 },
  { id: 'nextjs-app', name: 'nextjs-app', desc: 'Next.js 15 · App Router · Tailwind · Eidos auth shim', lang: 'TypeScript', usage: 84 },
  { id: 'go-grpc-svc', name: 'go-grpc-svc', desc: 'Go · gRPC · sqlc + pgx · canary-ready Helm chart', lang: 'Go', usage: 96 },
  { id: 'data-pipeline', name: 'data-pipeline', desc: 'Python · Dagster · ClickHouse sink · cost guardrails', lang: 'Python', usage: 38 },
  { id: 'ml-model-svc', name: 'ml-model-svc', desc: 'Python · FastAPI · model registry · drift alarms', lang: 'Python', usage: 27 },
  { id: 'rust-edge-svc', name: 'rust-edge-svc', desc: 'Rust · axum · tonic · zero-copy serialization', lang: 'Rust', usage: 14 },
];

const INSIGHTS = [
  { id: 'i1', kind: 'drift', when: '34m ago', title: '`pix-router` introduced sync call to `bureau-gateway`', body: 'Violates ADR-006 (async-first inter-tribe communication). Fan-out latency increases p95 by ~80ms under load.', service: 'pix-router', adr: 'ADR-006' },
  { id: 'i2', kind: 'drift', when: '2h ago', title: '`fraud-engine` reads from `ml-feature-store` without circuit breaker', body: 'No fallback path declared. Single point of failure for the scoring chain.', service: 'fraud-engine' },
  { id: 'i3', kind: 'drift', when: '1d ago', title: 'Cost spike — `data-export` egress +340% week-over-week', body: 'Likely related to the new merchant nightly job. Owner notified.', service: 'data-export' },
  { id: 'i4', kind: 'pr', when: '12m ago', title: 'PR #7421 · idempotency keys for retries', verdict: 'ship', body: 'Risk score 34. Coverage delta +1.2%. Blast radius bounded to Ring 0→2.', service: 'pix-router' },
  { id: 'i5', kind: 'pr', when: '1h ago', title: 'PR #7419 · refactor decision tree into strategy', verdict: 'block', body: 'Cyclomatic complexity 14 in `RiskCalculator.evaluate()` exceeds policy. Coverage drops 2.8%.', service: 'bureau-gateway' },
  { id: 'i6', kind: 'pr', when: '2h ago', title: 'PR #7418 · biometric step-up for high-risk auth', verdict: 'revise', body: 'No ADR linked for the step-up policy. Add a brief decision record before merge.', service: 'identity-svc' },
];

const TRIBE_NAMES = ['Risk','Identity','Pix','Fraud','Open Finance','Onboarding','BizDev','DataLab','Telemetry'];
const LANGS = { TypeScript:'#3178C6', Go:'#00ADD8', Java:'#F89820', Python:'#FFD43B', Rust:'#CE422B' };

export const MOCKS = { SERVICES, PEOPLE, PRS, DEPLOYS, ETI_PILLARS, TRIBES, GMUDS, ADRS, RUNBOOKS, TEMPLATES, INSIGHTS, TRIBE_NAMES, LANGS };
