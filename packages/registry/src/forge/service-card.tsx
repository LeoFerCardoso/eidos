import * as React from 'react';
import { HealthBadge } from '@/components/forge/health-badge';
import { Icons } from '@/components/forge/icons';
import { LangBadge } from '@/components/forge/lang-badge';
import { Sparkline } from '@/components/forge/sparkline';

type ServiceData = {
  name?: string;
  version?: string;
  deploys?: string;
  alert?: boolean;
  lang?: string;
  p95?: number | string;
};

type Contributor = { name: string; initials?: string; ember?: boolean };

const ServiceCard = ({
  service, contributors, sparkSeries, onOpen,
  variant = 'default',
}: {
  /** Service record — name, tier, lang, version, p95, deploys, alert. */
  service?: ServiceData;
  /** Team avatars in the footer. Shows up to 3 + a "+N" overflow counter. */
  contributors?: Contributor[];
  /** Sparkline data. Only rendered in the detailed variant. */
  sparkSeries?: number[];
  /** Click handler. Wires the tile as a button (with keyboard handling). */
  onOpen?: () => void;
  /** Visual layout — compact for slim rows, default for grids, detailed for the service-detail surface. */
  variant?: 'compact' | 'default' | 'detailed';
}) => {
  if (!service) return null;
  const health = service.alert ? 'degraded' : 'up';
  const showSpark = variant === 'detailed' && sparkSeries && sparkSeries.length > 0;
  const team = contributors || [];
  const teamShown = team.slice(0, 3);
  const teamExtra = Math.max(0, team.length - teamShown.length);
  const showFoot = (variant !== 'compact') && (team.length > 0 || service.lang != null);

  return (
    <div
      className={'service-card variant-' + variant}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onOpen) onOpen(); }}
    >
      <header className="sc-head">
        <span className="sc-avatar" aria-hidden="true">
          <Icons.server size={20}/>
        </span>
        <div className="sc-id">
          <span className="sc-name">{service.name}</span>
          {(service.version || service.deploys) && (
            <span className="sc-version">
              {service.version && <>v{service.version}</>}
              {service.version && service.deploys && <span className="sc-version-sep"> · </span>}
              {service.deploys && <>{service.deploys}</>}
            </span>
          )}
        </div>
        <HealthBadge state={health} pulse={health === 'degraded'}/>
      </header>

      {showSpark && (
        <div className="sc-spark">
          <div className="sc-spark-head">
            <span className="sc-spark-lab">Latency · last 24h</span>
            {service.p95 != null && (
              <span className="sc-spark-val">
                <span className="lbl">p95</span>
                <span className="v">{service.p95}<span className="unit">ms</span></span>
              </span>
            )}
          </div>
          <Sparkline data={sparkSeries} w={260} h={32}/>
        </div>
      )}

      {showFoot && (
        <footer className="sc-foot">
          <div className="sc-foot-team">
            {teamShown.length > 0 && (
              <div className="avatar-group">
                {teamShown.map((p) => (
                  <span
                    key={p.name}
                    className={'avatar' + (p.ember ? ' ember' : '')}
                    title={p.name}
                  >{p.initials}</span>
                ))}
                {teamExtra > 0 && (
                  <span className="avatar" title={`${teamExtra} more`}>
                    +{teamExtra}
                  </span>
                )}
              </div>
            )}
          </div>
          {service.lang && (
            <span className="sc-foot-lang">
              <LangBadge lang={service.lang}/>
            </span>
          )}
        </footer>
      )}
    </div>
  );
};

export { ServiceCard };
