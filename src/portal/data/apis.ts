// Forge (IDP Portal) — API catalog (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/apis — the global listing of every API the bureau exposes,
// grouped by product and service. Each API links back to its owning service in
// the catalog. Mock but consistent.

export type ApiKind = 'REST' | 'gRPC' | 'GraphQL' | 'Webhook' | 'Event';
export type ApiVisibility = 'public' | 'partner' | 'internal';
export type ApiStatus = 'stable' | 'beta' | 'deprecated';
export type Tier = 'T0' | 'T1' | 'T2' | 'T3';

export interface Api {
  id: string;
  name: string;
  desc: string;
  service: string;
  product: string;
  kind: ApiKind;
  version: string;
  consumers: number;
  p95: number;
  visibility: ApiVisibility;
  status: ApiStatus;
  /** Criticality tier (T0 = mission-critical, T3 = best-effort). */
  tier: Tier;
  owner: string;
}

/** Public base URL the integration snippets + console call (sandbox host). */
export const API_BASE = 'https://api.bvs.equifax.com.br';

export const PRODUCTS = ['Score & Risk', 'Anti-Fraud', 'Identity', 'Data & Bureau', 'Decisioning', 'Platform', 'Recovery'];

export const APIS: Api[] = [
  { id: 'acerta-consulta',   name: 'Acerta Consulta',        desc: 'CPF/CNPJ credit consultation by document.',      service: 'acerta-api',         product: 'Score & Risk',  kind: 'REST',    version: 'v4',   consumers: 142, p95: 138, visibility: 'public',   status: 'stable',     tier: 'T1', owner: 'Rafael Mendonça' },
  { id: 'onescore',          name: 'OneScore',               desc: 'Unified credit score for PF and PJ.',            service: 'onescore-gateway',   product: 'Score & Risk',  kind: 'REST',    version: 'v2',   consumers: 96,  p95: 92,  visibility: 'public',   status: 'stable',     tier: 'T1', owner: 'Thiago Albuquerque' },
  { id: 'score-grpc',        name: 'Score Engine RPC',       desc: 'Low-latency scoring for internal callers.',      service: 'score-engine',       product: 'Score & Risk',  kind: 'gRPC',    version: 'v7',   consumers: 8,   p95: 24,  visibility: 'internal', status: 'stable',     tier: 'T1', owner: 'Thiago Albuquerque' },
  { id: 'risk-events',       name: 'Risk Events',            desc: 'Streamed risk decisions for downstream.',        service: 'risk-monitor',       product: 'Score & Risk',  kind: 'Event',   version: 'v1',   consumers: 12,  p95: 0,   visibility: 'internal', status: 'beta',       tier: 'T2', owner: 'Thiago Albuquerque' },
  { id: 'konduto-decision',  name: 'Konduto Decision',       desc: 'Antifraud decision for a transaction.',          service: 'konduto-antifraud',  product: 'Anti-Fraud',    kind: 'REST',    version: 'v3',   consumers: 64,  p95: 71,  visibility: 'public',   status: 'stable',     tier: 'T1', owner: 'Beatriz Okamoto' },
  { id: 'device-fp',         name: 'Device Fingerprint',     desc: 'Device reputation and fingerprint lookup.',      service: 'device-fingerprint', product: 'Anti-Fraud',    kind: 'REST',    version: 'v2',   consumers: 31,  p95: 44,  visibility: 'partner',  status: 'stable',     tier: 'T2', owner: 'Beatriz Okamoto' },
  { id: 'chargeback-hook',   name: 'Chargeback Webhook',     desc: 'Posts chargeback classifications to partners.',  service: 'chargeback-classifier', product: 'Anti-Fraud', kind: 'Webhook', version: 'v1',   consumers: 18,  p95: 0,   visibility: 'partner',  status: 'stable',     tier: 'T3', owner: 'Beatriz Okamoto' },
  { id: 'identity-proof',    name: 'Identity Proofing',      desc: 'KYC step-up and document verification.',         service: 'identity-proofing',  product: 'Identity',      kind: 'REST',    version: 'v3',   consumers: 47,  p95: 210, visibility: 'public',   status: 'stable',     tier: 'T1', owner: 'Camila Tanaka' },
  { id: 'ocr-grpc',          name: 'Document OCR RPC',       desc: 'Extracts fields from uploaded documents.',       service: 'document-ocr',       product: 'Identity',      kind: 'gRPC',    version: 'v3',   consumers: 6,   p95: 880, visibility: 'internal', status: 'stable',     tier: 'T2', owner: 'Camila Tanaka' },
  { id: 'biometric',         name: 'Biometric Match',        desc: 'Face match against the document photo.',         service: 'biometric-match',    product: 'Identity',      kind: 'REST',    version: 'v1',   consumers: 9,   p95: 320, visibility: 'internal', status: 'beta',       tier: 'T2', owner: 'Camila Tanaka' },
  { id: 'scpc',              name: 'SCPC Gateway',           desc: 'SCPC bureau queries and negativation.',          service: 'scpc-gateway',       product: 'Data & Bureau', kind: 'REST',    version: 'v5',   consumers: 88,  p95: 162, visibility: 'public',   status: 'stable',     tier: 'T1', owner: 'Diego Vasquez' },
  { id: 'cadastro-positivo', name: 'Cadastro Positivo',      desc: 'Positive registry ingestion and reads.',         service: 'cadastro-positivo-ingestor', product: 'Data & Bureau', kind: 'REST', version: 'v2', consumers: 22,  p95: 140, visibility: 'partner',  status: 'stable',     tier: 'T2', owner: 'Diego Vasquez' },
  { id: 'bureau-graphql',    name: 'Bureau Graph',           desc: 'GraphQL over the unified bureau entity graph.',  service: 'bureau-ingestion',   product: 'Data & Bureau', kind: 'GraphQL', version: 'v1',   consumers: 14,  p95: 96,  visibility: 'internal', status: 'beta',       tier: 'T3', owner: 'Diego Vasquez' },
  { id: 'negativation',      name: 'Negativation Writer',    desc: 'Writes debt negativation records.',              service: 'negativation-writer',product: 'Data & Bureau', kind: 'REST',    version: 'v1',   consumers: 5,   p95: 110, visibility: 'internal', status: 'deprecated', tier: 'T3', owner: 'Diego Vasquez' },
  { id: 'decision',          name: 'Decision Engine',        desc: 'Runs decisioning policies on an applicant.',     service: 'decision-engine',    product: 'Decisioning',   kind: 'REST',    version: 'v6',   consumers: 38,  p95: 88,  visibility: 'public',   status: 'stable',     tier: 'T1', owner: 'Thiago Albuquerque' },
  { id: 'interconnect',      name: 'InterConnect Adapter',   desc: 'Legacy decisioning bridge for partners.',        service: 'interconnect-adapter',product: 'Decisioning',  kind: 'REST',    version: 'v2',   consumers: 11,  p95: 240, visibility: 'partner',  status: 'deprecated', tier: 'T3', owner: 'Thiago Albuquerque' },
  { id: 'consent',           name: 'Consent Service',        desc: 'LGPD consent scope reads and writes.',           service: 'consent-service',    product: 'Platform',      kind: 'REST',    version: 'v2',   consumers: 54,  p95: 36,  visibility: 'internal', status: 'stable',     tier: 'T1', owner: 'Larissa Fontana' },
  { id: 'webhook-dispatch',  name: 'Webhook Dispatcher',     desc: 'Fan-out events to partner endpoints.',           service: 'webhook-dispatcher', product: 'Platform',      kind: 'Webhook', version: 'v3',   consumers: 27,  p95: 0,   visibility: 'partner',  status: 'stable',     tier: 'T2', owner: 'Larissa Fontana' },
];

export const TIER_META: Record<Tier, { label: string; tone: 'danger' | 'warning' | 'ice' | 'neutral' }> = {
  T0: { label: 'T0 · Critical', tone: 'danger' },
  T1: { label: 'T1 · High',     tone: 'warning' },
  T2: { label: 'T2 · Standard', tone: 'ice' },
  T3: { label: 'T3 · Low',      tone: 'neutral' },
};

export const KIND_TONE: Record<ApiKind, 'ember' | 'ice' | 'health-up' | 'warning' | 'neutral'> = {
  REST: 'ember',
  gRPC: 'ice',
  GraphQL: 'health-up',
  Webhook: 'warning',
  Event: 'neutral',
};

export const VIS_TONE: Record<ApiVisibility, 'ember' | 'ice' | 'neutral'> = {
  public: 'ember',
  partner: 'ice',
  internal: 'neutral',
};

export const STATUS_TONE: Record<ApiStatus, { label: string; tone: 'health-up' | 'ice' | 'warning' }> = {
  stable: { label: 'Stable', tone: 'health-up' },
  beta: { label: 'Beta', tone: 'ice' },
  deprecated: { label: 'Deprecated', tone: 'warning' },
};

export const KPIS = [
  { id: 'total', label: 'APIs', value: String(APIS.length), note: `Across ${PRODUCTS.length} products.` },
  { id: 'public', label: 'Public', value: String(APIS.filter((a) => a.visibility === 'public').length), note: 'Externally consumable.' },
  { id: 'deprecated', label: 'Deprecated', value: String(APIS.filter((a) => a.status === 'deprecated').length), note: 'Plan migrations off these.' },
  { id: 'consumers', label: 'Total consumers', value: String(APIS.reduce((m, a) => m + a.consumers, 0)), note: 'Registered integrations.' },
];

// ── API explorer (detail page + the service API tab) ─────────────────────────
// Endpoints per API: hand-authored for the flagship, derived deterministically
// for the rest (shape follows the API kind). The OpenAPI excerpt and the try-it
// mock response are built from the same endpoint list, so the three views of
// an API never disagree.

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'RPC' | 'QUERY' | 'EVENT';

/** A documented request parameter (path / query / body field or header). */
export interface Field {
  name: string;
  in: 'path' | 'query' | 'body' | 'header';
  type: string;
  req?: boolean;
  desc: string;
}

export interface Endpoint {
  method: HttpMethod;
  path: string;
  summary: string;
  auth: 'oauth2' | 'mtls' | 'api-key' | 'none';
  p95: number; // ms
  deprecated?: boolean;
  /** Static mock body the try-it console answers with (the 200 response). */
  example: string;
  /** Sample request body, prefilled into the console + shown in the docs. */
  request?: string;
  /** Documented parameters (path/query/body) for the reference table. */
  fields?: Field[];
}

interface EpOpts { deprecated?: boolean; request?: string; fields?: Field[] }
const EP = (
  method: HttpMethod, path: string, summary: string, auth: Endpoint['auth'], p95: number, example: string, opts: EpOpts = {},
): Endpoint => ({ method, path, summary, auth, p95, example, ...opts });

const HAND: Record<string, Endpoint[]> = {
  'acerta-consulta': [
    EP('POST', '/v4/consultas', 'Run a CPF/CNPJ credit consultation.', 'oauth2', 138,
      '{\n  "document": "***.456.789-**",\n  "score": 742,\n  "band": "B",\n  "reason_codes": ["R1", "R3"],\n  "consent": { "scope": "credit-decision", "valid_until": "2026-12-01" }\n}',
      {
        request: '{\n  "document": "12345678900",\n  "product": "credit-decision",\n  "context": "underwriting"\n}',
        fields: [
          { name: 'document', in: 'body', type: 'string', req: true, desc: 'CPF (11 digits) or CNPJ (14 digits), digits only.' },
          { name: 'product', in: 'body', type: 'string', req: true, desc: 'Decision product scope the consent is checked against.' },
          { name: 'context', in: 'body', type: 'string', desc: 'Free-form caller context, recorded in the audit trail.' },
        ],
      }),
    EP('GET', '/v4/consultas/{id}', 'Fetch a previous consultation by id.', 'oauth2', 64,
      '{\n  "id": "cons_8f3k2",\n  "status": "completed",\n  "score": 742,\n  "created_at": "2026-06-10T14:02:11Z"\n}',
      { fields: [{ name: 'id', in: 'path', type: 'string', req: true, desc: 'Consultation id returned by the POST.' }] }),
    EP('GET', '/v4/consultas/{id}/reasons', 'Reason codes with the human-readable rationale.', 'oauth2', 71,
      '{\n  "reason_codes": [\n    { "code": "R1", "label": "Established credit history" },\n    { "code": "R3", "label": "Low utilization" }\n  ]\n}',
      { fields: [{ name: 'id', in: 'path', type: 'string', req: true, desc: 'Consultation id.' }] }),
    EP('POST', '/v4/consultas/batch', 'Batch consultation (up to 500 documents).', 'mtls', 920,
      '{\n  "batch_id": "bat_2210",\n  "accepted": 500,\n  "rejected": 0,\n  "callback": "https://partner.example/cb"\n}',
      {
        request: '{\n  "documents": ["12345678900", "98765432100"],\n  "callback": "https://partner.example/cb"\n}',
        fields: [
          { name: 'documents', in: 'body', type: 'string[]', req: true, desc: 'Up to 500 documents to score in one call.' },
          { name: 'callback', in: 'body', type: 'string', req: true, desc: 'HTTPS URL the batch result is POSTed to.' },
        ],
      }),
    EP('GET', '/v3/consultas/{id}', 'Legacy v3 read (sunset 2026-09).', 'oauth2', 88,
      '{\n  "id": "cons_legacy",\n  "deprecation": "sunset 2026-09-30"\n}',
      { deprecated: true, fields: [{ name: 'id', in: 'path', type: 'string', req: true, desc: 'Consultation id.' }] }),
  ],
};

/** Deterministic endpoint set for APIs without a hand-authored list. */
export function endpointsFor(api: Api): Endpoint[] {
  if (HAND[api.id]) return HAND[api.id];
  const base = api.id.replace(/[^a-z0-9]+/g, '-');
  const v = api.version;
  const ok = `{\n  "status": "ok",\n  "api": "${api.name}",\n  "version": "${v}"\n}`;
  const reqBody = `{\n  "document": "12345678900",\n  "context": "${api.product.toLowerCase().replace(/[^a-z]+/g, '-')}"\n}`;
  const bodyFields: Field[] = [
    { name: 'document', in: 'body', type: 'string', req: true, desc: 'Subject document (CPF/CNPJ), digits only.' },
    { name: 'context', in: 'body', type: 'string', desc: 'Caller context recorded for audit.' },
  ];
  const idField: Field[] = [{ name: 'id', in: 'path', type: 'string', req: true, desc: 'Resource id.' }];
  if (api.kind === 'gRPC') {
    return [
      EP('RPC', `${base}.v1/Evaluate`, `Unary call: evaluate one ${api.product.toLowerCase()} request.`, 'mtls', api.p95, ok, { request: reqBody, fields: bodyFields }),
      EP('RPC', `${base}.v1/StreamEvaluate`, 'Server-streaming variant for batch callers.', 'mtls', api.p95 * 3, ok, { request: reqBody, fields: bodyFields }),
      EP('RPC', `${base}.v1/GetStatus`, 'Health + model/contract versions.', 'mtls', 12, ok),
    ];
  }
  if (api.kind === 'GraphQL') {
    return [
      EP('QUERY', 'query { record(document: $d) { score band } }', 'Single-record lookup with field selection.', 'oauth2', api.p95, ok, { request: '{\n  "d": "12345678900"\n}' }),
      EP('QUERY', 'query { records(filter: $f, first: 20) { id } }', 'Paginated search over the dataset.', 'oauth2', api.p95 * 2, ok, { request: '{\n  "f": { "band": "B" }\n}' }),
      EP('QUERY', 'mutation { annotate(id: $id, note: $n) { ok } }', 'Attach an analyst annotation.', 'oauth2', 95, ok, { request: '{\n  "id": "rec_1",\n  "n": "reviewed"\n}' }),
    ];
  }
  if (api.kind === 'Webhook' || api.kind === 'Event') {
    return [
      EP('EVENT', `${base}.created`, 'Emitted when a new record lands.', 'api-key', 0, ok, { request: `{\n  "event": "${base}.created",\n  "endpoint": "https://your-app.example/webhooks/bvs"\n}` }),
      EP('EVENT', `${base}.updated`, 'Emitted on state transitions.', 'api-key', 0, ok, { request: `{\n  "event": "${base}.updated",\n  "endpoint": "https://your-app.example/webhooks/bvs"\n}` }),
      EP('POST', `/v1/${base}/replay`, 'Replay events for a window (ops only).', 'mtls', 240, ok, { request: '{\n  "from": "2026-06-01T00:00:00Z",\n  "to": "2026-06-02T00:00:00Z"\n}' }),
    ];
  }
  return [
    EP('POST', `/${v}/${base}`, `Create / evaluate a ${api.name.toLowerCase()} request.`, 'oauth2', api.p95, ok, { request: reqBody, fields: bodyFields }),
    EP('GET', `/${v}/${base}/{id}`, 'Fetch one result by id.', 'oauth2', Math.max(18, Math.round(api.p95 * 0.4)), ok, { fields: idField }),
    EP('GET', `/${v}/${base}`, 'List recent results (paginated).', 'oauth2', Math.max(24, Math.round(api.p95 * 0.6)), ok, {
      fields: [
        { name: 'limit', in: 'query', type: 'int', desc: 'Page size (default 20, max 100).' },
        { name: 'cursor', in: 'query', type: 'string', desc: 'Opaque pagination cursor.' },
      ],
    }),
    EP('DELETE', `/${v}/${base}/{id}`, 'Forget one record (LGPD erasure path).', 'mtls', 130, ok, { fields: idField }),
  ];
}

// ── Integration: normalize any endpoint to an HTTP call + snippet generation ──
// gRPC/GraphQL/Event surfaces are mapped to their HTTP-transcoded form so the
// console + code snippets stay uniform; a `note` explains the native protocol.

export interface HttpReq { method: string; url: string; body?: string; note?: string }

export function httpFor(api: Api, ep: Endpoint): HttpReq {
  if (ep.method === 'RPC') {
    return { method: 'POST', url: `${API_BASE}/${api.id}/${ep.path}`, body: ep.request, note: 'Native gRPC method · JSON transcoding shown for the console.' };
  }
  if (ep.method === 'QUERY') {
    const query = ep.path.replace(/"/g, '\\"');
    const vars = ep.request ? ep.request.replace(/\n\s*/g, ' ') : '{}';
    return { method: 'POST', url: `${API_BASE}/${api.id}/graphql`, body: `{\n  "query": "${query}",\n  "variables": ${vars}\n}`, note: 'GraphQL over HTTP POST to /graphql.' };
  }
  if (ep.method === 'EVENT') {
    return { method: 'POST', url: `${API_BASE}/${api.id}/v1/subscriptions`, body: ep.request, note: 'Subscribe your HTTPS endpoint to receive this event.' };
  }
  const hasBody = ep.method === 'POST' || ep.method === 'PUT';
  return { method: ep.method, url: `${API_BASE}${ep.path}`, body: hasBody ? ep.request : undefined };
}

export const LANGS = [
  { id: 'curl', label: 'cURL' },
  { id: 'js', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'go', label: 'Go' },
  { id: 'java', label: 'Java' },
  { id: 'csharp', label: 'C#' },
] as const;
export type Lang = (typeof LANGS)[number]['id'];

function authHeader(auth: Endpoint['auth']): { key: string; val: string } | null {
  if (auth === 'oauth2') return { key: 'Authorization', val: 'Bearer $FORGE_TOKEN' };
  if (auth === 'api-key') return { key: 'X-API-Key', val: '$FORGE_API_KEY' };
  return null; // mtls / none carry no bearer header
}

const oneLine = (json: string) => json.replace(/\n\s*/g, ' ').trim();

/** A runnable integration snippet for an endpoint in the given language.
 *  `over` lets the Workbench inject the live request (edited URL / body). */
export function snippetFor(api: Api, ep: Endpoint, lang: Lang, over?: { url?: string; body?: string }): string {
  const base = httpFor(api, ep);
  const r: HttpReq = { ...base, url: over?.url ?? base.url, body: over?.body ?? base.body };
  const h = authHeader(ep.auth);
  const body = r.body;
  const mtls = ep.auth === 'mtls' ? '  # mTLS: present your client certificate' : '';

  switch (lang) {
    case 'curl': {
      const lines = [`curl -X ${r.method} "${r.url}" \\`];
      if (h) lines.push(`  -H "${h.key}: ${h.val}" \\`);
      if (body) lines.push('  -H "Content-Type: application/json" \\');
      lines.push(body ? `  -d '${oneLine(body)}'` : '  -H "Accept: application/json"');
      return (mtls ? `${mtls}\n` : '') + lines.join('\n');
    }
    case 'js': {
      const headers: string[] = [];
      if (h) headers.push(`    "${h.key}": "${h.val.replace('$FORGE_TOKEN', '${process.env.FORGE_TOKEN}').replace('$FORGE_API_KEY', '${process.env.FORGE_API_KEY}')}",`);
      if (body) headers.push('    "Content-Type": "application/json",');
      return [
        `const res = await fetch("${r.url}", {`,
        `  method: "${r.method}",`,
        '  headers: {',
        ...headers,
        '  },',
        body ? `  body: JSON.stringify(${oneLine(body)}),` : null,
        '});',
        'const data = await res.json();',
      ].filter(Boolean).join('\n');
    }
    case 'python': {
      const headers: string[] = [];
      if (h) headers.push(`    "${h.key}": "${h.val}",`);
      return [
        'import requests',
        '',
        `resp = requests.${r.method.toLowerCase()}(`,
        `    "${r.url}",`,
        '    headers={',
        ...headers,
        '    },',
        body ? `    json=${oneLine(body)},` : null,
        ')',
        'data = resp.json()',
      ].filter(Boolean).join('\n');
    }
    case 'go': {
      const hdr = h ? `\treq.Header.Set("${h.key}", "${h.val}")\n` : '';
      const ct = body ? '\treq.Header.Set("Content-Type", "application/json")\n' : '';
      const reader = body ? `strings.NewReader(\`${oneLine(body)}\`)` : 'nil';
      return [
        `req, _ := http.NewRequest("${r.method}", "${r.url}", ${reader})`,
        hdr + ct + 'resp, err := http.DefaultClient.Do(req)',
      ].join('\n');
    }
    case 'java': {
      const hdr = h ? `    .header("${h.key}", "${h.val}")\n` : '';
      const ct = body ? '    .header("Content-Type", "application/json")\n' : '';
      const pub = body ? `BodyPublishers.ofString("${oneLine(body).replace(/"/g, '\\"')}")` : 'BodyPublishers.noBody()';
      return [
        'HttpClient client = HttpClient.newHttpClient();',
        'HttpRequest req = HttpRequest.newBuilder()',
        `    .uri(URI.create("${r.url}"))`,
        hdr + ct + `    .method("${r.method}", ${pub})`,
        '    .build();',
        'HttpResponse<String> resp = client.send(req, BodyHandlers.ofString());',
      ].join('\n');
    }
    case 'csharp': {
      const hdr = h ? `req.Headers.Add("${h.key}", "${h.val}");\n` : '';
      const content = body ? `req.Content = new StringContent("${oneLine(body).replace(/"/g, '\\"')}", Encoding.UTF8, "application/json");\n` : '';
      return [
        'using var client = new HttpClient();',
        `var req = new HttpRequestMessage(HttpMethod.${r.method[0]}${r.method.slice(1).toLowerCase()}, "${r.url}");`,
        hdr + content + 'var resp = await client.SendAsync(req);',
        'var data = await resp.Content.ReadAsStringAsync();',
      ].join('\n');
    }
  }
}

/** OpenAPI 3.1 excerpt rendered in the docs tab — built from the endpoints. */
export function openapiFor(api: Api): string {
  const eps = endpointsFor(api).filter((e) => !['RPC', 'QUERY', 'EVENT'].includes(e.method));
  const paths = eps
    .map((e) =>
      `  ${e.path}:\n    ${e.method.toLowerCase()}:\n      summary: ${e.summary}\n      security: [ { ${e.auth}: [] } ]\n      responses:\n        "200": { description: OK }`)
    .join('\n');
  return `openapi: 3.1.0\ninfo:\n  title: ${api.name}\n  version: ${api.version}\n  x-owner: ${api.owner}\n  x-service: ${api.service}\nservers:\n  - url: https://api.internal.bvs/${api.id}\npaths:\n${paths || '  {} # non-HTTP surface: see the protocol contract'}\n`;
}

export const getApi = (id: string): Api | undefined => APIS.find((a) => a.id === id);
