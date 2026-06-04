import { Suspense } from 'react';
import PortalChat from '@/portal/chat/portal-chat';

// Forge — Chat workspace route. Full-bleed: the PortalShell drops the padded
// content column (.fp-main--full) for /portal/chat so the chat sub-sidebar +
// thread fill the main area edge-to-edge with their own independent scroll.
// Suspense boundary: PortalChat reads ?agent via useSearchParams (deep link
// from the Agents catalog), which requires one in the App Router.
export default function PortalChatPage() {
  return (
    <Suspense fallback={null}>
      <PortalChat />
    </Suspense>
  );
}
