export type DshScreenFamilyId =
  | 'entry'
  | 'discovery'
  | 'cart'
  | 'store'
  | 'checkout'
  | 'orders'
  | 'benefits'
  | 'operations'
  | 'support'
  | 'shared';

export type DshScreenFamily = {
  id: DshScreenFamilyId;
  title: string;
  screens: string[];
  note?: string;
};

export const dshScreenFamilies: DshScreenFamily[] = [
  {
    id: 'entry',
    title: 'Entry',
    screens: ['entry'],
    note: 'Landing and entry routing.',
  },
  {
    id: 'discovery',
    title: 'Discovery',
    screens: ['home', 'home-get', 'categories-list', 'category-get', 'search', 'favorite-toggle', 'favorites-list'],
    note: 'Search, browse, and category exploration.',
  },
  {
    id: 'cart',
    title: 'Cart',
    screens: ['cart-get', 'cart-init', 'cart-item-add', 'cart-item-remove', 'cart-item-update'],
    note: 'Cart entry, initialization, and item mutation flows.',
  },
  {
    id: 'store',
    title: 'Store',
    screens: ['stores-list', 'store-detail', 'store-get', 'store-items', 'store-items-list'],
    note: 'Store browsing and item inspection.',
  },
  {
    id: 'checkout',
    title: 'Checkout',
    screens: ['create-order', 'checkout-workspace', 'awnak-order-create', 'review'],
    note: 'Order creation and checkout confirmation.',
  },
  {
    id: 'orders',
    title: 'Orders',
    screens: ['orders-list', 'tracking', 'success'],
    note: 'Order review and active tracking.',
  },
  {
    id: 'benefits',
    title: 'Benefits',
    screens: ['benefits', 'subscription-family-get', 'subscription-family-members-get', 'subscription-family-members-post', 'subscription-pro-catalog', 'subscription-sync', 'subscription-tier-get', 'subscription-upgrade-post', 'loyalty-points-redeem', 'loyalty-points-user-balance', 'loyalty-points-user-history', 'entitlements-get'],
    note: 'Subscriptions, loyalty, and entitlement surfaces.',
  },
  {
    id: 'operations',
    title: 'Operations',
    screens: ['conversation-workspace', 'delivery-management-workspace', 'intake-workspace', 'listing-status-update', 'order-issue-workspace', 'proxy-workspace', 'service-settings', 'shein-info', 'trust-workspace', 'zone-set'],
    note: 'Operational hubs that sit outside the customer discovery loop.',
  },
  {
    id: 'support',
    title: 'Support',
    screens: ['support-directory', 'support-screen'],
    note: 'Client support directory and generated support screens.',
  },
  {
    id: 'shared',
    title: 'Shared',
    screens: ['_shared/screens/DshOperationScreen'],
    note: 'Shared shell and state helpers.',
  },
];
