export type LoyaltyBenefitMode = 'subscription' | 'loyalty';

export type LoyaltyBenefitItem = {
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export const loyaltyBenefitSurfaceItems: Record<LoyaltyBenefitMode, LoyaltyBenefitItem[]> = {
  subscription: [
    { title: 'Pro catalog', subtitle: 'Compare plans with one clear upgrade path.', meta: 'Catalog', badgeLabel: 'Plan' },
    { title: 'Family members', subtitle: 'Keep member management close to the active subscription state.', meta: 'Family', badgeLabel: 'Share' },
    { title: 'Sync state', subtitle: 'Refresh benefits before the next paid action.', meta: 'Sync', badgeLabel: 'Live' },
    { title: 'Coupon lane', subtitle: 'Keep promos visible without breaking the subscription flow.', meta: 'Promo', badgeLabel: 'Ready' },
  ],
  loyalty: [
    { title: 'Points balance', subtitle: 'Show current value before redemption.', meta: 'Balance', badgeLabel: 'Value' },
    { title: 'Redeem points', subtitle: 'Convert points into visible order savings.', meta: 'Redeem', badgeLabel: 'Action' },
    { title: 'History', subtitle: 'Explain accrual and redemption without support friction.', meta: 'History', badgeLabel: 'Audit' },
    { title: 'Coupon visibility', subtitle: 'Mirror the checkout discount lane so the value stays obvious.', meta: 'Coupon', badgeLabel: 'Promo' },
  ],
};

export const loyaltyBenefitKeyValues: Record<LoyaltyBenefitMode, Array<{ label: string; value: string }>> = {
  subscription: [
    { label: 'Family lane', value: 'subscription-family-get' },
    { label: 'Upgrade lane', value: 'subscription-upgrade-post' },
    { label: 'Sync lane', value: 'subscription-sync' },
  ],
  loyalty: [
    { label: 'Redeem lane', value: 'loyalty-points-redeem' },
    { label: 'Balance lane', value: 'loyalty-points-user-balance' },
    { label: 'History lane', value: 'loyalty-points-user-history' },
  ],
};
