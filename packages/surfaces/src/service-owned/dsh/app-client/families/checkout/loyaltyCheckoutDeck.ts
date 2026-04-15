export const loyaltyCheckoutKeyValues = [
  { label: 'Applied discount', value: '12 SAR' },
  { label: 'Redeemable points', value: '2,840 pts' },
  { label: 'Subscription lane', value: 'Promo-ready' },
] as const;

export const loyaltyCheckoutItems = [
  {
    title: 'Promo application',
    subtitle: 'Apply savings inside pricing without leaving checkout.',
    meta: 'Coupon',
    badgeLabel: 'Apply',
  },
  {
    title: 'Points preview',
    subtitle: 'Show the points benefit before the order is submitted.',
    meta: 'Loyalty',
    badgeLabel: 'Earn',
  },
  {
    title: 'Subscription handoff',
    subtitle: 'Keep the customer in the same lane if the offer changes the tier.',
    meta: 'Subscription',
    badgeLabel: 'Plan',
  },
] as const;
