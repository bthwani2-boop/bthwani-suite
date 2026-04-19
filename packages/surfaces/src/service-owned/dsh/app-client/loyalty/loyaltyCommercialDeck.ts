export type LoyaltyBenefitMode = 'subscription' | 'loyalty';

export type LoyaltyBenefitItem = {
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export const loyaltyBenefitSurfaceItems: Record<LoyaltyBenefitMode, LoyaltyBenefitItem[]> = {
  subscription: [
    { title: 'subscription-family-get', subtitle: 'Open the live subscription family route.', meta: 'Catalog', badgeLabel: 'Route' },
    { title: 'subscription-family-members-get', subtitle: 'Inspect the current family members via the live route.', meta: 'Family', badgeLabel: 'Route' },
    { title: 'subscription-sync', subtitle: 'Refresh the subscription state from the real lane.', meta: 'Sync', badgeLabel: 'Route' },
    { title: 'subscription-upgrade-post', subtitle: 'Continue into the actual upgrade flow.', meta: 'Upgrade', badgeLabel: 'Route' },
  ],
  loyalty: [
    { title: 'loyalty-points-user-balance', subtitle: 'Open the live points balance route.', meta: 'Balance', badgeLabel: 'Route' },
    { title: 'loyalty-points-redeem', subtitle: 'Open the real redemption route.', meta: 'Redeem', badgeLabel: 'Route' },
    { title: 'loyalty-points-user-history', subtitle: 'Inspect the live accrual and redemption history.', meta: 'History', badgeLabel: 'Route' },
    { title: 'entitlements-get', subtitle: 'Verify the entitlement lane that powers loyalty visibility.', meta: 'Entitlements', badgeLabel: 'Route' },
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
