export const loyaltyCheckoutKeyValues = [
  { label: 'Applied discount lane', value: 'promo-apply' },
  { label: 'Redeemable points route', value: 'loyalty-points-redeem' },
  { label: 'Subscription lane', value: 'subscription-upgrade-post' },
] as const;

export const loyaltyCheckoutItems = [
  {
    title: 'Promo application',
    subtitle: 'Apply savings inside the live pricing route without leaving checkout.',
    meta: 'Coupon',
    badgeLabel: 'Apply',
  },
  {
    title: 'Points preview',
    subtitle: 'Open the real points route before the order is submitted.',
    meta: 'Loyalty',
    badgeLabel: 'Earn',
  },
  {
    title: 'Subscription handoff',
    subtitle: 'Keep the customer in the live subscription lane when the offer changes the tier.',
    meta: 'Subscription',
    badgeLabel: 'Plan',
  },
] as const;
