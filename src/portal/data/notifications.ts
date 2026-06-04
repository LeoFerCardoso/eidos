// Forge — notifications feed (shared by the topbar bell PREVIEW and the
// dedicated /portal/notifications inbox). The bell shows the first few; the
// inbox lists everything. Grow NOTIFS as new event sources land.
//
// Avatar policy (resolved in <NotifRow>):
//   • person WITH a headshot → photo avatar (src) + presence status
//   • SYSTEM actor (Platform, CI/CD, Agent…) → ember avatar with a glyph
//   • named person WITHOUT a headshot → neutral avatar with computed initials
//   • truly ANONYMOUS actor → neutral avatar with a user silhouette

export type NotifTab = 'all' | 'following' | 'archive';

export interface Notif {
  id: string;
  actor: string;            // display name ('' for anonymous → silhouette)
  src?: string;             // headshot → photo avatar
  system?: string;          // system actor → ember avatar carrying this Icons glyph
  anonymous?: boolean;      // unknown identity → user silhouette instead of initials
  status?: 'online' | 'away' | 'busy' | 'offline'; // presence dot (people only)
  action: string;           // "promoted", "mentioned you in", …
  target?: string;          // the object, rendered bold
  time: string;
  context: string;          // "acerta-api · deploys"
  unread?: boolean;
  following?: boolean;
  archived?: boolean;
  kind?: 'approval' | 'file' | 'text';
  file?: { name: string; size: string };
}

// How many rows the bell PREVIEW shows before "View all notifications".
export const NOTIF_PREVIEW = 5;

export const NOTIFS: Notif[] = [
  {
    id: 'n1', actor: 'Ashley Williams', src: '/avatars/Ashley-Williams.jpg',
    status: 'online', following: true, unread: true,
    action: 'promoted', target: '🚀 v4.18.2 to Ring 4', time: '2h ago', context: 'acerta-api · deploys',
  },
  {
    id: 'n2', actor: 'Mariana Rossi', src: '/avatars/Mariana-Rossi.jpg',
    status: 'busy', following: true, unread: true,
    action: 'mentioned you in', target: '🔥 INC-2041', time: '4h ago', context: 'acerta-api · incident',
  },
  {
    id: 'n3', actor: 'Platform', system: 'gate', kind: 'approval',
    action: 'requests promotion of', target: 'konduto-antifraud → prod', time: '12h ago', context: 'konduto-antifraud · gates',
  },
  {
    id: 'n4', actor: 'CI · golden-pipeline', system: 'pipeline', kind: 'file',
    action: 'published a build artifact', time: '1d ago', context: 'scoring-service · build',
    file: { name: 'scoring-service_v2.3.1.tar', size: '18 MB' },
  },
  {
    id: 'n5', actor: 'Bruno Mendes', status: 'away', following: true,
    action: 'edited', target: '📓 the rollback runbook', time: '1d ago', context: 'acerta-api · runbooks',
  },
  {
    id: 'n6', actor: 'Diego Ferreira', src: '/avatars/Diego-Ferreira.jpg',
    status: 'online', following: true,
    action: 'approved', target: 'PR #7421', time: '1d ago', context: 'acerta-api · reviews',
  },
  {
    id: 'n7', actor: 'scorecard-bot', system: 'score',
    action: 'scored', target: 'acerta-api → 82 · Silver tier', time: '2d ago', context: 'acerta-api · scorecards',
  },
  {
    id: 'n8', actor: 'Marcus Johnson', src: '/avatars/Marcus-Johnson.jpg',
    status: 'busy',
    action: 'flagged a CVE in', target: 'base-image 1.24', time: '2d ago', context: 'platform · security',
  },
  {
    id: 'n9', actor: 'Emma Larsson', src: '/avatars/Emma-Larsson.jpg',
    following: true,
    action: 'requested changes on', target: 'PR #7430', time: '3d ago', context: 'scoring-service · reviews',
  },
];

/** Apply a tab filter to the feed. Archive is its own bucket; All excludes archived. */
export function filterByTab(rows: Notif[], tab: NotifTab): Notif[] {
  if (tab === 'archive') return rows.filter((n) => n.archived);
  if (tab === 'following') return rows.filter((n) => n.following && !n.archived);
  return rows.filter((n) => !n.archived);
}
