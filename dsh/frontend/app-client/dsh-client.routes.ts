export type DshClientRouteId =
  | 'dsh-home'
  | 'dsh-entry'
  | 'dsh-my-space'
  | 'dsh-notifications'
  | 'dsh-store-items'
  | 'dsh-cart'
  | 'dsh-store'
  | 'dsh-bell'
  | 'dsh-benefits'
  | 'dsh-conversation-workspace'
  | 'dsh-listing-status-update'
  | 'dsh-order-issue-workspace'
  | 'dsh-proxy-workspace'
  | 'dsh-service-settings'
  | 'dsh-zone-set'
  | 'dsh-orders'
  | 'dsh-tracking'
  | 'dsh-checkout-intent'
  | 'dsh-checkout-failure'
  | 'dsh-addresses-location'
  | 'dsh-identity'
  | 'dsh-appearance'
  | 'dsh-preferences';

export type DshClientLegacyRoute =
  | 'home'
  | 'entry'
  | 'my-space'
  | 'notifications'
  | 'store-items'
  | 'cart-get'
  | 'store-get'
  | 'bell'
  | 'benefits'
  | 'conversation-workspace'
  | 'listing-status-update'
  | 'order-issue-workspace'
  | 'proxy-workspace'
  | 'service-settings'
  | 'zone-set'
  | 'orders-list'
  | 'tracking'
  | 'checkout-intent'
  | 'checkout-failure'
  | 'addresses-location'
  | 'identity'
  | 'appearance'
  | 'preferences';

export type DshClientRouteRecord = {
  readonly routeId: DshClientRouteId;
  readonly legacyRoute: DshClientLegacyRoute;
  readonly screenId: string;
  readonly ownerPath: string;
};

export const dshClientRoutes = [
  { routeId: 'dsh-home', legacyRoute: 'home', screenId: 'client.dsh.home.feed', ownerPath: 'dsh/frontend/app-client/screens/HomeScreen.tsx' },
  { routeId: 'dsh-entry', legacyRoute: 'entry', screenId: 'client.dsh.entry', ownerPath: 'dsh/frontend/app-client/screens/EntryScreen.tsx' },
  { routeId: 'dsh-my-space', legacyRoute: 'my-space', screenId: 'client.dsh.my-space.home', ownerPath: 'dsh/frontend/app-client/screens/MySpaceScreen.tsx' },
  { routeId: 'dsh-notifications', legacyRoute: 'notifications', screenId: 'client.dsh.notifications.list', ownerPath: 'dsh/frontend/app-client/screens/NotificationsScreen.tsx' },
  { routeId: 'dsh-store-items', legacyRoute: 'store-items', screenId: 'client.dsh.store.items', ownerPath: 'dsh/frontend/app-client/screens/StoreItemsScreen.tsx' },
  { routeId: 'dsh-cart', legacyRoute: 'cart-get', screenId: 'client.dsh.cart.review', ownerPath: 'dsh/frontend/app-client/screens/CartScreen.tsx' },
  { routeId: 'dsh-store', legacyRoute: 'store-get', screenId: 'client.dsh.store.details', ownerPath: 'dsh/frontend/app-client/screens/StoreScreen.tsx' },
  { routeId: 'dsh-bell', legacyRoute: 'bell', screenId: 'client.dsh.bell', ownerPath: 'dsh/frontend/app-client/screens/BellScreen.tsx' },
  { routeId: 'dsh-benefits', legacyRoute: 'benefits', screenId: 'client.dsh.benefits.home', ownerPath: 'dsh/frontend/app-client/screens/BenefitsScreen.tsx' },
  { routeId: 'dsh-conversation-workspace', legacyRoute: 'conversation-workspace', screenId: 'client.dsh.conversation.workspace', ownerPath: 'dsh/frontend/app-client/screens/DshConversationHubScreen.tsx' },
  { routeId: 'dsh-listing-status-update', legacyRoute: 'listing-status-update', screenId: 'client.dsh.listing.status-update', ownerPath: 'dsh/frontend/app-client/screens/DshListingStatusUpdateScreen.tsx' },
  { routeId: 'dsh-order-issue-workspace', legacyRoute: 'order-issue-workspace', screenId: 'client.dsh.order.issue.workspace', ownerPath: 'dsh/frontend/app-client/screens/DshOrderIssueHubScreen.tsx' },
  { routeId: 'dsh-proxy-workspace', legacyRoute: 'proxy-workspace', screenId: 'client.dsh.proxy.workspace', ownerPath: 'dsh/frontend/app-client/screens/DshProxyHubScreen.tsx' },
  { routeId: 'dsh-service-settings', legacyRoute: 'service-settings', screenId: 'client.dsh.service.settings', ownerPath: 'dsh/frontend/app-client/screens/DshServiceSettingsHubScreen.tsx' },
  { routeId: 'dsh-zone-set', legacyRoute: 'zone-set', screenId: 'client.dsh.zone.set', ownerPath: 'dsh/frontend/app-client/screens/DshZoneSetScreen.tsx' },
  { routeId: 'dsh-orders', legacyRoute: 'orders-list', screenId: 'client.dsh.orders.history', ownerPath: 'dsh/frontend/app-client/screens/DshOrdersListScreen.tsx' },
  { routeId: 'dsh-tracking', legacyRoute: 'tracking', screenId: 'client.dsh.order.smart-followup', ownerPath: 'dsh/frontend/app-client/screens/DshTrackingScreen.tsx' },
  { routeId: 'dsh-checkout-intent', legacyRoute: 'checkout-intent', screenId: 'client.dsh.checkout.intent', ownerPath: 'dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx' },
  { routeId: 'dsh-checkout-failure', legacyRoute: 'checkout-failure', screenId: 'client.dsh.checkout.failure', ownerPath: 'dsh/frontend/app-client/screens/DshCheckoutFailureScreen.tsx' },
  { routeId: 'dsh-addresses-location', legacyRoute: 'addresses-location', screenId: 'client.dsh.addresses-location.hub', ownerPath: 'dsh/frontend/app-client/screens/AddressLocationScreen.tsx' },
  { routeId: 'dsh-identity', legacyRoute: 'identity', screenId: 'client.dsh.identity.hub', ownerPath: 'dsh/frontend/app-client/screens/DshIdentityHubScreen.tsx' },
  { routeId: 'dsh-appearance', legacyRoute: 'appearance', screenId: 'client.dsh.appearance.hub', ownerPath: 'dsh/frontend/app-client/screens/DshAppearanceHubScreen.tsx' },
  { routeId: 'dsh-preferences', legacyRoute: 'preferences', screenId: 'client.dsh.preferences.hub', ownerPath: 'dsh/frontend/app-client/screens/DshPreferencesHubScreen.tsx' },
] as const satisfies readonly DshClientRouteRecord[];
