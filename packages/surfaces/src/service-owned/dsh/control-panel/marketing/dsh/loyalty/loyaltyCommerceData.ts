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
    value: 'Pro Plus',
    description: 'One visible plan with family, upgrade, and sync lanes attached to it.',
  },
  {
    title: 'Points balance',
    value: '2,840 pts',
    description: 'Redeemable value stays visible before the customer commits to checkout.',
  },
  {
    title: 'Coupon lane',
    value: 'Ready',
    description: 'Promos remain in the pricing path instead of becoming a dead-end support step.',
  },
];

export const loyaltyCommercialLaneItems: LoyaltyCommercialLaneItem[] = [
  {
    title: 'Subscription family',
    subtitle: 'Keep family membership, plan changes, and entitlement visibility in one lane.',
    meta: 'Subscription',
    badgeLabel: 'Share',
  },
  {
    title: 'Points redemption',
    subtitle: 'Convert points into visible order savings before the review step.',
    meta: 'Loyalty',
    badgeLabel: 'Redeem',
  },
  {
    title: 'Coupon application',
    subtitle: 'Keep promo application inside checkout and pricing instead of branching away.',
    meta: 'Coupon',
    badgeLabel: 'Promo',
  },
  {
    title: 'Multiplier preview',
    subtitle: 'Surface x2 and x3 earning behavior where the shopper is already deciding.',
    meta: 'Points',
    badgeLabel: 'Earn',
  },
  {
    title: 'Sync and audit',
    subtitle: 'Refresh subscription state before the next paid action and keep history readable.',
    meta: 'Sync',
    badgeLabel: 'Live',
  },
];

export const loyaltyCommercialKeyValues = [
  { label: 'Current plan', value: 'Pro Plus' },
  { label: 'Coupon availability', value: 'Visible before checkout' },
  { label: 'Points preview', value: '2,840 pts' },
  { label: 'Entitlement lane', value: 'subscription-sync' },
] as const;
