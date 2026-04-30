// Dev/demo fallback for dsh_captain_tier_info. Isolated per RULE_DEV_DATA_ENV_AND_LEAK.

export interface TierInfo {
  current_tier: string;
  tier_level: number;
  tier_name: string;
  next_tier: string | null;
  progress_to_next: number;
  benefits: string[];
  requirements: {
    completed_orders: number;
    required_orders: number;
    rating: number;
    required_rating: number;
  };
  last_evaluated: string;
}

export type TierInfoApi = Partial<TierInfo> | null;

type TFunction = (key: string) => string;

export function buildTierInfoFromApi(t: TFunction, tierData: TierInfoApi): TierInfo {
  return {
    current_tier: tierData?.current_tier ?? 'gold',
    tier_level: tierData?.tier_level ?? 3,
    tier_name: tierData?.tier_name ?? t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.tierNameGold'),
    next_tier: tierData?.next_tier ?? 'platinum',
    progress_to_next: tierData?.progress_to_next ?? 75,
    benefits: tierData?.benefits ?? [
      t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.benefitCommission'),
      t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.benefitPriority'),
      t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.benefitSupport'),
      t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.benefitRewards'),
    ],
    requirements: tierData?.requirements ?? {
      completed_orders: 450,
      required_orders: 600,
      rating: 4.7,
      required_rating: 4.8,
    },
    last_evaluated: new Date().toISOString(),
  };
}
