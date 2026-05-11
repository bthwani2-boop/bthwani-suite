export type DshPartnerRouteId =
  | 'dsh-partner-home'
  | 'dsh-partner-entry'
  | 'dsh-partner-store-profile'
  | 'dsh-partner-operations'
  | 'dsh-partner-orders'
  | 'dsh-partner-order-detail'
  | 'dsh-partner-order-issue'
  | 'dsh-partner-inventory'
  | 'dsh-partner-promotions'
  | 'dsh-partner-notifications'
  | 'dsh-partner-settings'
  | 'dsh-partner-support';

export type DshPartnerRouteRecord = {
  readonly routeId: DshPartnerRouteId;
  readonly screenId: string;
  readonly ownerPath: string;
};

export const dshPartnerRoutes = [
  { routeId: 'dsh-partner-home', screenId: 'partner.dsh.home.dashboard', ownerPath: 'dsh/frontend/app-partner/DshPartnerSurface.tsx' },
  { routeId: 'dsh-partner-entry', screenId: 'partner.dsh.entry.status', ownerPath: 'dsh/frontend/app-partner/screens/PartnerEntryScreen.tsx' },
  { routeId: 'dsh-partner-store-profile', screenId: 'partner.dsh.store.profile', ownerPath: 'dsh/frontend/app-partner/screens/StoreProfileScreen.tsx' },
  { routeId: 'dsh-partner-operations', screenId: 'partner.dsh.operations.control', ownerPath: 'dsh/frontend/app-partner/DshPartnerSurface.tsx' },
  { routeId: 'dsh-partner-orders', screenId: 'partner.dsh.orders.inbox', ownerPath: 'dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx' },
  { routeId: 'dsh-partner-order-detail', screenId: 'partner.dsh.order.detail', ownerPath: 'dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx' },
  { routeId: 'dsh-partner-order-issue', screenId: 'partner.dsh.order.issue', ownerPath: 'dsh/frontend/app-partner/screens/OperationScreens.tsx' },
  { routeId: 'dsh-partner-inventory', screenId: 'partner.dsh.inventory.catalog', ownerPath: 'dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx' },
  { routeId: 'dsh-partner-promotions', screenId: 'partner.dsh.promotions.intent', ownerPath: 'dsh/frontend/app-partner/screens/PromotionsScreen.tsx' },
  { routeId: 'dsh-partner-notifications', screenId: 'partner.dsh.notifications.list', ownerPath: 'dsh/frontend/app-partner/screens/OperationScreens.tsx' },
  { routeId: 'dsh-partner-settings', screenId: 'partner.dsh.settings.preferences', ownerPath: 'dsh/frontend/app-partner/DshPartnerSurface.tsx' },
  { routeId: 'dsh-partner-support', screenId: 'partner.dsh.support.center', ownerPath: 'dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx' },
] as const satisfies readonly DshPartnerRouteRecord[];
