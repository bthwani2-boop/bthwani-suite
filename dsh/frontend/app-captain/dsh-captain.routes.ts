import type { DshCaptainRoute } from './dsh-captain.types';

export type DshCaptainRouteId =
  | 'dsh-captain-home'
  | 'dsh-captain-account'
  | 'dsh-captain-account-profile'
  | 'dsh-captain-account-finance'
  | 'dsh-captain-account-orders'
  | 'dsh-captain-account-docs'
  | 'dsh-captain-account-shifts'
  | 'dsh-captain-account-support'
  | 'dsh-captain-entry'
  | 'dsh-captain-inbox'
  | 'dsh-captain-detail'
  | 'dsh-captain-order-chat'
  | 'dsh-captain-bell'
  | 'dsh-captain-support-directory'
  | 'dsh-captain-support-screen'
  | 'dsh-captain-pickup-dropoff'
  | 'dsh-captain-pod-submission';

export type DshCaptainLegacyRoute = DshCaptainRoute;

export type DshCaptainRouteRecord = {
  readonly routeId: DshCaptainRouteId;
  readonly legacyRoute: DshCaptainLegacyRoute;
  readonly screenId: string;
  readonly ownerPath: string;
};

export const dshCaptainRoutes = [
  { routeId: 'dsh-captain-home', legacyRoute: 'home', screenId: 'captain.dsh.home.dashboard', ownerPath: 'dsh/frontend/app-captain/DshCaptainSurface.tsx' },
  { routeId: 'dsh-captain-account', legacyRoute: 'account', screenId: 'captain.dsh.account.root', ownerPath: 'dsh/frontend/app-captain/DshCaptainSurface.tsx' },
  { routeId: 'dsh-captain-account-profile', legacyRoute: 'account-profile', screenId: 'captain.dsh.account.profile', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainProfileScreen.tsx' },
  { routeId: 'dsh-captain-account-finance', legacyRoute: 'account-finance', screenId: 'captain.dsh.account.finance', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainFinanceScreen.tsx' },
  { routeId: 'dsh-captain-account-orders', legacyRoute: 'account-orders', screenId: 'captain.dsh.account.orders', ownerPath: 'dsh/frontend/app-captain/DshCaptainSurface.tsx' },
  { routeId: 'dsh-captain-account-docs', legacyRoute: 'account-docs', screenId: 'captain.dsh.account.docs', ownerPath: 'dsh/frontend/app-captain/DshCaptainSurface.tsx' },
  { routeId: 'dsh-captain-account-shifts', legacyRoute: 'account-shifts', screenId: 'captain.dsh.account.shifts', ownerPath: 'dsh/frontend/app-captain/DshCaptainSurface.tsx' },
  { routeId: 'dsh-captain-account-support', legacyRoute: 'account-support', screenId: 'captain.dsh.account.support', ownerPath: 'dsh/frontend/app-captain/DshCaptainSurface.tsx' },
  { routeId: 'dsh-captain-entry', legacyRoute: 'entry', screenId: 'captain.dsh.entry', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainEntryScreen.tsx' },
  { routeId: 'dsh-captain-inbox', legacyRoute: 'inbox', screenId: 'captain.dsh.orders.inbox', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx' },
  { routeId: 'dsh-captain-detail', legacyRoute: 'detail', screenId: 'captain.dsh.orders.detail', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx' },
  { routeId: 'dsh-captain-order-chat', legacyRoute: 'orderchat', screenId: 'captain.dsh.orders.chat', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx' },
  { routeId: 'dsh-captain-bell', legacyRoute: 'bell', screenId: 'captain.dsh.orders.bell', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx' },
  { routeId: 'dsh-captain-support-directory', legacyRoute: 'support-directory', screenId: 'captain.dsh.support.directory', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainOperationsScreen.tsx' },
  { routeId: 'dsh-captain-support-screen', legacyRoute: 'support-screen', screenId: 'captain.dsh.support.workspace', ownerPath: 'dsh/frontend/app-captain/DshCaptainSurface.tsx' },
  { routeId: 'dsh-captain-pickup-dropoff', legacyRoute: 'pickup-dropoff', screenId: 'captain.dsh.orders.pickup-dropoff', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainPickupDropoffScreen.tsx' },
  { routeId: 'dsh-captain-pod-submission', legacyRoute: 'pod-submission', screenId: 'captain.dsh.orders.pod-submission', ownerPath: 'dsh/frontend/app-captain/screens/DshCaptainPoDSubmissionScreen.tsx' },
] as const satisfies readonly DshCaptainRouteRecord[];
