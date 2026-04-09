/**
 * Fixture for platform captain tier evaluate (auto_platform_captain_tier_evaluate).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface TierEvaluationResult {
  captainId: string;
  service: 'dsh' | 'amn';
  previousTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'ELITE';
  newTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'ELITE';
  evaluationDate: string;
  metrics: {
    totalDeliveries?: number;
    totalTrips?: number;
    averageRating: number;
    onTimePercentage: number;
    tripCompletionRate?: number;
    customerComplaints: number;
  };
  tierChanged: boolean;
  message: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildPlatformCaptainTierEvaluateMock(
  t: TFunction,
  service: 'dsh' | 'amn',
  captainId: string
): TierEvaluationResult {
  return {
    captainId: captainId || 'cap_001',
    service,
    previousTier: service === 'dsh' ? 'GOLD' : 'SILVER',
    newTier: service === 'dsh' ? 'ELITE' : 'GOLD',
    evaluationDate: new Date().toISOString(),
    metrics: {
      totalDeliveries: service === 'dsh' ? 250 : undefined,
      totalTrips: service === 'amn' ? 180 : undefined,
      averageRating: 4.9,
      onTimePercentage: 98,
      tripCompletionRate: service === 'amn' ? 97 : undefined,
      customerComplaints: 0,
    },
    tierChanged: true,
    message:
      service === 'dsh'
        ? 'تهانينا! تم ترقيتك إلى المستوى ELITE بناءً على أدائك المتميز'
        : 'تهانينا! تم ترقيتك إلى المستوى GOLD بناءً على أدائك المتميز',
  };
}
