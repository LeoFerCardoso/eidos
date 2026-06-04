import PortalChat from '@/portal/chat/portal-chat';

// Forge — Chat workspace route. Full-bleed: the PortalShell drops the padded
// content column (.fp-main--full) for /portal/chat so the chat sub-sidebar +
// thread fill the main area edge-to-edge with their own independent scroll.
export default function PortalChatPage() {
  return <PortalChat />;
}
