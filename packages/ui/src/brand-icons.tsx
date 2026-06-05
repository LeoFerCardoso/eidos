import * as React from 'react';
// Eidos DS — Brand icons.
//
// The third-party logos Forge connects to (source control, observability,
// incident, cloud, data) and the LLM providers/models behind the agents. Unlike
// the hand-drawn `Icons` set, these are real brand marks: most come from
// **Simple Icons** (CC0 path data) and a small hand-maintained `EXTRA` supplies
// the few Simple Icons drops on trademark request (OpenAI, AWS, Slack, …).
//
// Every entry is a single 24×24 path so they all render the same way through
// <BrandIcon/> — monochrome (currentColor) by default, or in the brand colour
// with `color="brand"`. Grow the registry as new integrations land.
import {
  siGithub, siGitlab, siBitbucket,
  siJenkins, siGithubactions, siCircleci, siArgo,
  siDatadog, siDynatrace, siGrafana, siPrometheus, siNewrelic, siSentry, siOpentelemetry, siSplunk, siElastic,
  siPagerduty, siOpsgenie,
  siJira, siConfluence, siLinear, siNotion, siZendesk,
  siGooglecloud, siCloudflare, siVercel, siNetlify, siDigitalocean,
  siDocker, siKubernetes, siTerraform,
  siPostgresql, siRedis, siMongodb, siSnowflake,
  siAnthropic, siClaude, siGooglegemini, siGoogle, siMistralai, siMeta,
  siOllama, siHuggingface, siPerplexity, siDeepseek, siGithubcopilot, siX,
} from 'simple-icons';

export type BrandCategory =
  | 'source' | 'ci' | 'observability' | 'incident' | 'comms'
  | 'project' | 'cloud' | 'infra' | 'data' | 'llm-provider' | 'llm-model';

export interface BrandDef {
  slug: string;
  title: string;
  /** Brand colour, `#rrggbb`. */
  hex: string;
  /** Single 24×24 SVG path. */
  path: string;
  category: BrandCategory;
}

type SI = { title: string; hex: string; path: string };

// ── EXTRA — brands Simple Icons removed on trademark request. Hand-maintained;
//    swap a path for the official single-path SVG whenever it changes. ────────
const EXTRA: Record<string, SI> = {
  openai: {
    title: 'OpenAI', hex: '412991',
    path: 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z',
  },
  amazonaws: {
    title: 'Amazon Web Services', hex: 'FF9900',
    path: 'M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.24-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.215 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.119.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.081-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.806-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z',
  },
  slack: {
    title: 'Slack', hex: '4A154B',
    path: 'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z',
  },
  grok: {
    title: 'Grok', hex: '000000',
    path: 'M9.27 15.29 18.36 8.5c.42-.31 1.03-.2 1.24.27.84 1.85.62 4.08-.74 5.74-1.36 1.66-3.5 2.36-5.5 1.96l-2.2 2.02c2.94 1.18 6.04.49 7.94-1.82 1.5-1.83 1.96-4.18 1.43-6.32-.77-3.02.13-4.22 1.92-6.67.04-.06.09-.12.13-.18l-2.4 2.4L9.27 15.29M7.99 16.4c-2.06-1.97-1.7-5.02.06-6.93 1.3-1.42 3.5-2 5.45-1.32l2.19-2.01c-.38-.18-.86-.4-1.4-.53-2.62-.7-5.55.04-7.55 2.23-1.94 2.13-2.4 5.21-1.04 7.83 1.02 1.95-.31 3.33-1.65 4.72-.48.49-.95.98-1.34 1.5l5.22-5.5',
  },
  azure: {
    title: 'Microsoft Azure', hex: '0078D4',
    path: 'M13.05 4.24 6.56 18.04h4.83l1.2-3.39-2.74-2.45 3.2-7.96zm.78 1.55-1.4 3.95 6.04 7.16-6.61 2.27v.07h7.58a.6.6 0 0 0 .57-.8L13.83 5.79z',
  },
  servicenow: {
    title: 'ServiceNow', hex: '62D84E',
    path: 'M12 2.4A9.6 9.6 0 0 0 4.3 17.7a.9.9 0 0 0 1.27.16 6.6 6.6 0 0 1 8.86 0 .9.9 0 0 0 1.27-.16A9.6 9.6 0 0 0 12 2.4zm0 13.2a3.84 3.84 0 1 1 0-7.68 3.84 3.84 0 0 1 0 7.68z',
  },
  teams: {
    title: 'Microsoft Teams', hex: '6264A7',
    path: 'M19.19 6.36a2.4 2.4 0 1 0-2.34-2.88h-3.3a2.7 2.7 0 1 0-5.2 0H3.6a.9.9 0 0 0-.9.9v8.1a4.8 4.8 0 0 0 4.8 4.8c.36 0 .71-.04 1.05-.12A4.5 4.5 0 0 0 12.9 21h.6a4.5 4.5 0 0 0 4.5-4.5V9.36h2.1a.9.9 0 0 0 .9-.9V8.4a2.4 2.4 0 0 0-1.81-2.04zM12.6 8.4v8.1a3.3 3.3 0 0 1-3.3 3.3 3.3 3.3 0 0 1-1.2-.23V7.5h4.5z',
  },
};

const fromSI = (si: SI, category: BrandCategory, slug: string, title?: string): BrandDef => ({
  slug, title: title ?? si.title, hex: '#' + si.hex, path: si.path, category,
});
const fromExtra = (key: string, category: BrandCategory, slug: string, title?: string): BrandDef => ({
  slug, title: title ?? EXTRA[key].title, hex: '#' + EXTRA[key].hex, path: EXTRA[key].path, category,
});

// ── Registry ──────────────────────────────────────────────────────────────────

export const BRANDS: BrandDef[] = [
  // Source control
  fromSI(siGithub, 'source', 'github'),
  fromSI(siGitlab, 'source', 'gitlab'),
  fromSI(siBitbucket, 'source', 'bitbucket'),
  // CI / CD
  fromSI(siGithubactions, 'ci', 'github-actions'),
  fromSI(siJenkins, 'ci', 'jenkins'),
  fromSI(siCircleci, 'ci', 'circleci'),
  fromSI(siArgo, 'ci', 'argocd', 'Argo CD'),
  // Observability / APM
  fromSI(siDatadog, 'observability', 'datadog'),
  fromSI(siDynatrace, 'observability', 'dynatrace'),
  fromSI(siGrafana, 'observability', 'grafana'),
  fromSI(siPrometheus, 'observability', 'prometheus'),
  fromSI(siNewrelic, 'observability', 'new-relic'),
  fromSI(siSentry, 'observability', 'sentry'),
  fromSI(siOpentelemetry, 'observability', 'opentelemetry'),
  fromSI(siSplunk, 'observability', 'splunk'),
  fromSI(siElastic, 'observability', 'elastic'),
  // Incident / ITSM
  fromSI(siPagerduty, 'incident', 'pagerduty'),
  fromSI(siOpsgenie, 'incident', 'opsgenie'),
  fromExtra('servicenow', 'incident', 'servicenow'),
  // Comms
  fromExtra('slack', 'comms', 'slack'),
  fromExtra('teams', 'comms', 'teams'),
  // Project / docs
  fromSI(siJira, 'project', 'jira'),
  fromSI(siConfluence, 'project', 'confluence'),
  fromSI(siLinear, 'project', 'linear'),
  fromSI(siNotion, 'project', 'notion'),
  fromSI(siZendesk, 'project', 'zendesk'),
  // Cloud
  fromExtra('amazonaws', 'cloud', 'aws'),
  fromExtra('azure', 'cloud', 'azure'),
  fromSI(siGooglecloud, 'cloud', 'gcp', 'Google Cloud'),
  fromSI(siCloudflare, 'cloud', 'cloudflare'),
  fromSI(siVercel, 'cloud', 'vercel'),
  fromSI(siNetlify, 'cloud', 'netlify'),
  fromSI(siDigitalocean, 'cloud', 'digitalocean'),
  // Infra
  fromSI(siDocker, 'infra', 'docker'),
  fromSI(siKubernetes, 'infra', 'kubernetes'),
  fromSI(siTerraform, 'infra', 'terraform'),
  // Data
  fromSI(siPostgresql, 'data', 'postgresql'),
  fromSI(siRedis, 'data', 'redis'),
  fromSI(siMongodb, 'data', 'mongodb'),
  fromSI(siSnowflake, 'data', 'snowflake'),
  // LLM providers
  fromExtra('openai', 'llm-provider', 'openai'),
  fromSI(siAnthropic, 'llm-provider', 'anthropic'),
  fromSI(siGoogle, 'llm-provider', 'google'),
  fromSI(siX, 'llm-provider', 'xai', 'xAI'),
  fromSI(siMistralai, 'llm-provider', 'mistral-ai'),
  fromSI(siMeta, 'llm-provider', 'meta'),
  fromSI(siDeepseek, 'llm-provider', 'deepseek'),
  fromSI(siPerplexity, 'llm-provider', 'perplexity'),
  fromSI(siHuggingface, 'llm-provider', 'huggingface'),
  fromSI(siOllama, 'llm-provider', 'ollama'),
  fromSI(siGithubcopilot, 'llm-provider', 'copilot', 'GitHub Copilot'),
  // LLM models
  fromExtra('openai', 'llm-model', 'gpt', 'GPT'),
  fromSI(siClaude, 'llm-model', 'claude', 'Claude'),
  fromSI(siGooglegemini, 'llm-model', 'gemini', 'Gemini'),
  fromExtra('grok', 'llm-model', 'grok', 'Grok'),
  fromSI(siMeta, 'llm-model', 'llama', 'Llama'),
  fromSI(siMistralai, 'llm-model', 'mistral', 'Mistral'),
  fromSI(siDeepseek, 'llm-model', 'deepseek-r1', 'DeepSeek'),
];

export const BRAND_CATEGORIES: { id: BrandCategory; label: string; desc: string }[] = [
  { id: 'source', label: 'Source control', desc: 'Repos, code review, pull requests.' },
  { id: 'ci', label: 'CI / CD', desc: 'Build, test and deploy pipelines.' },
  { id: 'observability', label: 'Observability', desc: 'Metrics, traces, logs and APM.' },
  { id: 'incident', label: 'Incident & ITSM', desc: 'On-call, paging and service management.' },
  { id: 'comms', label: 'Comms', desc: 'Where the agent posts and pages people.' },
  { id: 'project', label: 'Project & docs', desc: 'Tickets, knowledge and support.' },
  { id: 'cloud', label: 'Cloud', desc: 'Where the estate runs.' },
  { id: 'infra', label: 'Infra', desc: 'Containers, orchestration, IaC.' },
  { id: 'data', label: 'Data', desc: 'Stores the agents query.' },
  { id: 'llm-provider', label: 'LLM providers', desc: 'The companies behind the models.' },
  { id: 'llm-model', label: 'LLM models', desc: 'The models an agent can run on.' },
];

const BRAND_MAP: Record<string, BrandDef> = Object.fromEntries(BRANDS.map((b) => [b.slug, b]));

export const getBrand = (slug: string): BrandDef | undefined => BRAND_MAP[slug];
export const brandsByCategory = (c: BrandCategory): BrandDef[] => BRANDS.filter((b) => b.category === c);

// ── BrandIcon ─────────────────────────────────────────────────────────────────

export interface BrandIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  /** Registry slug, e.g. "github", "datadog", "claude". */
  slug: string;
  size?: number;
  /** "brand" paints the official hex; otherwise a CSS colour. Default currentColor. */
  color?: 'brand' | (string & {});
  title?: string;
}

/**
 * Renders a brand mark from the registry. Monochrome (inherits currentColor) by
 * default — pass `color="brand"` for the official colour. Unknown slugs render
 * nothing.
 */
export const BrandIcon = React.forwardRef<SVGSVGElement, BrandIconProps>(
  ({ slug, size = 20, color, title, ...rest }, ref) => {
    const b = BRAND_MAP[slug];
    if (!b) return null;
    const fill = color === 'brand' ? b.hex : color ?? 'currentColor';
    return (
      <svg
        ref={ref}
        role="img"
        aria-label={title ?? b.title}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        {...rest}
      >
        <path d={b.path} />
      </svg>
    );
  },
);
BrandIcon.displayName = 'BrandIcon';
