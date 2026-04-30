/**
 * Fixture for platform captain tier info (auto_platform_captain_tier_info).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface TierInfo {
  captainId: string;
  service: 'dsh' | 'amn';
  currentTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'ELITE';
  tierName: string;
  tierBenefits: string[];
  nextTierRequirements: {
    requiredDeliveries?: number;
    requiredTrips?: number;
    requiredRating: number;
    requiredCompletionRate: number;
  };
  progress: {
    currentValue: number;
    targetValue: number;
    percentage: number;
  };
  evaluationDate: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildPlatformCaptainTierInfoMock(
  t: TFunction,
  service: 'dsh' | 'amn',
  captainId: string
): TierInfo {
  return {
    captainId: captainId || 'cap_001',
    service,
    currentTier: service === 'dsh' ? 'GOLD' : 'SILVER',
    tierName: service === 'dsh' ? t('surfaces.ذهبي') : t('surfaces.فضي'),
    tierBenefits:
      service === 'dsh'
        ? [
            t('surfaces.أولوية_في_الطلبات'),
            t('surfaces.مكافآت_شهرية'),
            t('surfaces.دعم_فني_متميز'),
            t('surfaces.تأمين_صحي'),
          ]
        : [t('surfaces.أولوية_في_العروض'), t('surfaces.مكافآت_أسبوعية'), t('surfaces.دعم_فني')],
    nextTierRequirements: {
      requiredDeliveries: service === 'dsh' ? 200 : undefined,
      requiredTrips: service === 'amn' ? 150 : undefined,
      requiredRating: 4.8,
      requiredCompletionRate: 95,
    },
    progress: {
      currentValue: service === 'dsh' ? 185 : 120,
      targetValue: service === 'dsh' ? 200 : 150,
      percentage: service === 'dsh' ? 92.5 : 80,
    },
    evaluationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
