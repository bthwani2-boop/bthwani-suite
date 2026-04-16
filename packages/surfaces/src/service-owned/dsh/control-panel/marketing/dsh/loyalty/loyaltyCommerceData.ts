export type LoyaltyCommercialSignal = {
  title: string;
  value: string;
  description: string;
};

export type LoyaltyCommercialLaneItem = {
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export const loyaltyCommercialSignals: LoyaltyCommercialSignal[] = [
  {
    title: 'Subscription tier',
    value: 'subscription-family-get',
    description: 'The real subscription family route is the entry point for plan, family, and sync actions.',
  },
  {
    title: 'Points balance',
    value: 'loyalty-points-user-balance',
    description: 'The balance screen is the source of truth before redemption or checkout.',
  },
  {
    title: 'Coupon lane',
    value: 'promo-apply',
    description: 'Coupons stay inside the live pricing path rather than becoming a display-only state.',
  },
];

export const loyaltyCommercialLaneItems: LoyaltyCommercialLaneItem[] = [
  {
    title: 'Subscription family',
    subtitle: 'Open the actual family, upgrade, and sync routes instead of a sample summary.',
    meta: 'Subscription',
    badgeLabel: 'Route',
  },
  {
    title: 'Points redemption',
    subtitle: 'Open the live balance, redeem, and history routes before checkout.',
    meta: 'Loyalty',
    badgeLabel: 'Route',
  },
  {
    title: 'Coupon application',
    subtitle: 'Keep promo application in checkout and pricing where the live lane already exists.',
    meta: 'Coupon',
    badgeLabel: 'Route',
  },
  {
    title: 'Entitlements',
    subtitle: 'Use the entitlement route as the actual source of loyalty visibility.',
    meta: 'Points',
    badgeLabel: 'Route',
  },
  {
    title: 'Sync and audit',
    subtitle: 'Refresh subscription state from the live route and keep history readable.',
    meta: 'Sync',
    badgeLabel: 'Route',
  },
];

export const loyaltyCommercialKeyValues = [
  { label: 'Current plan route', value: 'subscription-family-get' },
  { label: 'Coupon lane', value: 'promo-apply' },
  { label: 'Points balance route', value: 'loyalty-points-user-balance' },
  { label: 'Entitlement lane', value: 'entitlements-get' },
] as const;
