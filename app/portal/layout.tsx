import type { Metadata } from 'next';
import { PortalShell } from '@/portal/shell/portal-shell';

// Forge — the IDP Portal: a parallel product surface (route group `(portal)`),
// separate from the Eidos DS docs `(ds)` and the isolated `/example` screens.
// It is a navigable mockup of the real Internal Developer Platform for Equifax
// Boa Vista, assembled exclusively from Eidos DS components. (Naming: the design
// system is "Eidos"; this product is "Forge".) The product chrome (rail ·
// topbar) is rendered once here; route content slots into <main>.
export const metadata: Metadata = {
  title: 'Forge · IDP',
  description:
    'Forge · Internal Developer Platform mockup for Equifax Boa Vista, built on the Eidos Design System.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
